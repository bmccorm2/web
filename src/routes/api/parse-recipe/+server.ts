import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

function parseDuration(durationStr: any): string | undefined {
	if (!durationStr || typeof durationStr !== 'string') return undefined;
	const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
	if (!match) return durationStr;
	const hours = match[1] ? `${match[1]}h` : '';
	const minutes = match[2] ? `${match[2]}m` : '';
	const seconds = match[3] ? `${match[3]}s` : '';
	const result = [hours, minutes, seconds].filter(Boolean).join(' ');
	return result || durationStr;
}

function parseIngredients(ingredients: any): string[] {
	if (!ingredients) return [];
	if (typeof ingredients === 'string') {
		return ingredients.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean);
	}
	if (Array.isArray(ingredients)) {
		return ingredients.map((i: any) => (typeof i === 'string' ? i : '')).filter(Boolean);
	}
	return [];
}

function parseInstructions(instructions: any): string[] {
	if (!instructions) return [];
	if (typeof instructions === 'string') {
		return instructions.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean);
	}
	if (Array.isArray(instructions)) {
		const steps: string[] = [];
		for (const step of instructions) {
			if (typeof step === 'string') {
				steps.push(step);
			} else if (step && typeof step === 'object') {
				if (step['@type'] === 'HowToSection' && Array.isArray(step.itemListElement)) {
					steps.push(...parseInstructions(step.itemListElement));
				} else if (typeof step.text === 'string') {
					steps.push(step.text);
				} else if (typeof step.name === 'string') {
					steps.push(step.name);
				}
			}
		}
		return steps.filter(Boolean);
	}
	return [];
}

function parseImage(image: any): string | undefined {
	if (!image) return undefined;
	if (typeof image === 'string') return image;
	if (Array.isArray(image) && image.length > 0) {
		return parseImage(image[0]);
	}
	if (typeof image === 'object') {
		return image.url || image.contentUrl || undefined;
	}
	return undefined;
}

function extractRecipe(obj: any): any | null {
	if (!obj || typeof obj !== 'object') return null;

	// Check if this object is a Recipe
	if (obj['@type'] === 'Recipe' || obj.type === 'Recipe' || (Array.isArray(obj['@type']) && obj['@type'].includes('Recipe'))) {
		return obj;
	}

	// Check if it's a @graph representation
	if (Array.isArray(obj['@graph'])) {
		for (const sub of obj['@graph']) {
			const found = extractRecipe(sub);
			if (found) return found;
		}
	}

	// Check if it's an array of objects
	if (Array.isArray(obj)) {
		for (const sub of obj) {
			const found = extractRecipe(sub);
			if (found) return found;
		}
	}

	return null;
}

export const GET: RequestHandler = async ({ url }) => {
	const recipeUrl = url.searchParams.get('url');
	if (!recipeUrl) {
		return json({ error: 'Missing url parameter' }, { status: 400 });
	}

	try {
		// Fetch with user agent to avoid basic blocks
		const response = await fetch(recipeUrl, {
			headers: {
				'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
			}
		});

		if (!response.ok) {
			return json({ error: `Failed to fetch website: ${response.statusText}` }, { status: 400 });
		}

		const html = await response.text();

		// Use regex to locate all script tags with application/ld+json
		const jsonLdRegex = /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
		let match;
		let recipeData: any = null;

		while ((match = jsonLdRegex.exec(html)) !== null) {
			try {
				const rawJson = match[1].trim();
				const parsed = JSON.parse(rawJson);
				const found = extractRecipe(parsed);
				if (found) {
					recipeData = found;
					break;
				}
			} catch (err) {
				// Continue parsing other blocks
			}
		}

		if (recipeData) {
			return json({
				title: recipeData.name || '',
				url: recipeUrl,
				prepTime: parseDuration(recipeData.prepTime) || '',
				cookTime: parseDuration(recipeData.cookTime) || '',
				totalTime: parseDuration(recipeData.totalTime) || '',
				yield: recipeData.recipeYield || '',
				ingredients: parseIngredients(recipeData.recipeIngredient),
				instructions: parseInstructions(recipeData.recipeInstructions),
				imageUrl: parseImage(recipeData.image) || '',
				success: true
			});
		}

		// Fallback to title tag if JSON-LD is not found
		const titleRegex = /<title[^>]*>([\s\S]*?)<\/title>/i;
		const titleMatch = html.match(titleRegex);
		const title = titleMatch ? titleMatch[1].trim().replace(/\s+/g, ' ') : '';

		return json({
			title: title || 'Parsed Recipe',
			url: recipeUrl,
			prepTime: '',
			cookTime: '',
			totalTime: '',
			yield: '',
			ingredients: [],
			instructions: [],
			imageUrl: '',
			success: false,
			message: 'Could not find standard recipe schema, but extracted page title.'
		});
	} catch (err: any) {
		return json({ error: err.message || 'Error occurred while parsing' }, { status: 500 });
	}
};
