<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Id } from '../../../../convex/_generated/dataModel';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { api } from '../../../../convex/_generated/api';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import { Loader2, Download, ChefHat } from 'lucide-svelte';
	import { onMount } from 'svelte';

	const id = page.params.id as Id<'Recipes'>;
	const client = useConvexClient();

	let title = $state('');
	let url = $state('');
	let prepTime = $state('');
	let cookTime = $state('');
	let totalTime = $state('');
	let yieldStr = $state('');
	let imageUrl = $state('');
	let notes = $state('');
	let ingredientsText = $state('');
	let instructionsText = $state('');

	let isImporting = $state(false);
	let importUrlInput = $state('');

	// Load existing recipe if we are editing
	if (id) {
		const recipe = useQuery(api.recipes.get, { recipeId: id });
		$effect(() => {
			if (recipe.data) {
				title = recipe.data.title || '';
				url = recipe.data.url || '';
				prepTime = recipe.data.prepTime || '';
				cookTime = recipe.data.cookTime || '';
				totalTime = recipe.data.totalTime || '';
				yieldStr = recipe.data.yield || '';
				imageUrl = recipe.data.imageUrl || '';
				notes = recipe.data.notes || '';
				ingredientsText = (recipe.data.ingredients || []).join('\n');
				instructionsText = (recipe.data.instructions || []).join('\n');
			}
		});
	}

	// Trigger auto-import if url query parameter is present on load
	onMount(() => {
		const initUrl = new URLSearchParams(window.location.search).get('importUrl');
		if (initUrl) {
			importUrlInput = initUrl;
			handleImport(initUrl);
		}
	});

	async function handleImport(targetUrl: string) {
		if (!targetUrl) return;
		isImporting = true;
		const cleanUrl = targetUrl.trim();

		try {
			const res = await fetch(`/api/parse-recipe?url=${encodeURIComponent(cleanUrl)}`);
			if (!res.ok) {
				throw new Error('Could not contact the import server.');
			}
			const data = await res.json();
			if (data.error) {
				toast.error(`Import failed: ${data.error}`);
			} else {
				title = data.title || '';
				url = data.url || cleanUrl;
				prepTime = data.prepTime || '';
				cookTime = data.cookTime || '';
				totalTime = data.totalTime || '';
				yieldStr = data.yield || '';
				imageUrl = data.imageUrl || '';
				ingredientsText = (data.ingredients || []).join('\n');
				instructionsText = (data.instructions || []).join('\n');

				if (data.success) {
					toast.success('Successfully parsed recipe! Review and save below.');
				} else {
					toast.warning(data.message || 'Partial parsing complete.');
				}
			}
		} catch (err: any) {
			toast.error(`Failed to import: ${err.message}`);
		} finally {
			isImporting = false;
		}
	}

function safeTrim(val: any): string {
		if (val === null || val === undefined) return '';
		if (typeof val === 'string') return val.trim();
		if (typeof val.toString === 'function') return val.toString().trim();
		return '';
	}

	async function handleSubmit() {
		console.log('--- handleSubmit Diagnostic Log ---');
		console.log('title:', title, 'type:', typeof title);
		console.log('url:', url, 'type:', typeof url);
		console.log('prepTime:', prepTime, 'type:', typeof prepTime);
		console.log('cookTime:', cookTime, 'type:', typeof cookTime);
		console.log('totalTime:', totalTime, 'type:', typeof totalTime);
		console.log('yieldStr:', yieldStr, 'type:', typeof yieldStr);
		console.log('notes:', notes, 'type:', typeof notes);
		console.log('imageUrl:', imageUrl, 'type:', typeof imageUrl);
		console.log('-----------------------------------');

		const safeTitle = safeTrim(title);
		if (!safeTitle) {
			console.warn('Submission blocked: Title is empty');
			toast.error('Title is required');
			return;
		}

		// Convert newline-separated text back into string arrays
		const ingredients = safeTrim(ingredientsText)
			.split('\n')
			.map((line) => line.trim())
			.filter(Boolean);

		const instructions = safeTrim(instructionsText)
			.split('\n')
			.map((line) => line.trim())
			.filter(Boolean);

		const recipeData = {
			title: safeTitle,
			url: safeTrim(url) || undefined,
			prepTime: safeTrim(prepTime) || undefined,
			cookTime: safeTrim(cookTime) || undefined,
			totalTime: safeTrim(totalTime) || undefined,
			yield: safeTrim(yieldStr) || undefined,
			ingredients,
			instructions,
			notes: safeTrim(notes) || undefined,
			imageUrl: safeTrim(imageUrl) || undefined
		};

		console.log('Sending recipe data to Convex:', recipeData);

		try {
			if (id) {
				console.log('Performing UPDATE mutation for ID:', id);
				const res = await client.mutation(api.recipes.update, {
					id,
					...recipeData
				});
				console.log('UPDATE response:', res);
				if (res.success === true) {
					sessionStorage.setItem('cooking-toast', 'update');
					goto('/cooking');
				}
			} else {
				console.log('Performing INSERT mutation');
				const newId = await client.mutation(api.recipes.insert, recipeData);
				console.log('INSERT response (new ID):', newId);
				if (newId) {
					sessionStorage.setItem('cooking-toast', 'create');
					goto('/cooking');
				} else {
					console.error('INSERT returned a falsy ID:', newId);
				}
			}
		} catch (err: any) {
			console.error('Convex Mutation Error:', err);
			toast.error(`Error saving recipe: ${err.message}`);
		}
	}
</script>

<div class="mx-auto max-w-4xl px-4 py-6">
	<!-- Import Block (Only show if creating a new recipe) -->
	{#if !id}
		<Card.Root class="mb-6 border-slate-200 dark:border-slate-800">
			<Card.Header>
				<h2 class="text-lg font-bold tracking-tight">Import Recipe From Website</h2>
				<p class="text-xs text-slate-500 dark:text-slate-400">
					Enter a recipe website URL (e.g. Serious Eats, NYT Cooking, blogs) to extract details instantly.
				</p>
			</Card.Header>
			<Card.Content>
				<div class="flex flex-col gap-3 sm:flex-row">
					<Input
						type="url"
						placeholder="https://www.seriouseats.com/..."
						bind:value={importUrlInput}
						class="flex-1"
						disabled={isImporting}
					/>
					<Button
						type="button"
						onclick={() => handleImport(importUrlInput)}
						disabled={isImporting || !importUrlInput}
						class="flex items-center gap-2"
					>
						{#if isImporting}
							<Loader2 class="h-4 w-4 animate-spin" />
							<span>Parsing...</span>
						{:else}
							<Download class="h-4 w-4" />
							<span>Import</span>
						{/if}
					</Button>
				</div>
			</Card.Content>
		</Card.Root>
	{/if}

	<Card.Root class="border-slate-200 dark:border-slate-800">
		<Card.Header>
			<div class="flex items-center gap-2">
				<ChefHat class="h-5 w-5 text-sky-600" />
				<h2 class="text-xl font-bold tracking-tight">{id ? 'Edit Recipe' : 'Add New Recipe'}</h2>
			</div>
		</Card.Header>
		<Card.Content>
			<form class="space-y-5">
				<div>
					<label for="title" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Recipe Title *</label>
					<Input
						id="title"
						type="text"
						bind:value={title}
						placeholder="e.g. Classic Beef Bourguignon"
						required
						class="mt-1"
					/>
				</div>

				<div class="grid gap-4 sm:grid-cols-2">
					<div>
						<label for="url" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Recipe URL</label>
						<Input
							id="url"
							type="url"
							bind:value={url}
							placeholder="https://..."
							class="mt-1"
						/>
					</div>
					<div>
						<label for="imageUrl" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Image URL</label>
						<Input
							id="imageUrl"
							type="text"
							bind:value={imageUrl}
							placeholder="https://.../image.jpg"
							class="mt-1"
						/>
					</div>
				</div>

				<div class="grid gap-4 grid-cols-2 sm:grid-cols-4">
					<div>
						<label for="prepTime" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Prep Time</label>
						<Input
							id="prepTime"
							type="text"
							bind:value={prepTime}
							placeholder="e.g. 20 mins"
							class="mt-1"
						/>
					</div>
					<div>
						<label for="cookTime" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Cook Time</label>
						<Input
							id="cookTime"
							type="text"
							bind:value={cookTime}
							placeholder="e.g. 1 hour"
							class="mt-1"
						/>
					</div>
					<div>
						<label for="totalTime" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Total Time</label>
						<Input
							id="totalTime"
							type="text"
							bind:value={totalTime}
							placeholder="e.g. 1h 20m"
							class="mt-1"
						/>
					</div>
					<div>
						<label for="yield" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Yield / Servings</label>
						<Input
							id="yield"
							type="text"
							bind:value={yieldStr}
							placeholder="e.g. 4-6 servings"
							class="mt-1"
						/>
					</div>
				</div>

				<!-- CUSTOM NOTES / EDITS -->
				<div class="rounded-lg border border-amber-200 bg-amber-50/20 p-4 dark:border-amber-900/40 dark:bg-amber-950/5">
					<label for="notes" class="block text-sm font-bold text-amber-900 dark:text-amber-300">My Custom Edits & Notes</label>
					<p class="text-xs text-amber-700/80 dark:text-amber-400/80 mb-2">
						Record ingredient tweaks, longer cooking times, substitution choices, or notes for next time.
					</p>
					<Textarea
						id="notes"
						bind:value={notes}
						placeholder="e.g. Added 2 more cloves of garlic. Reduced chicken stock by 1/2 cup. Needs 10 more minutes in the oven."
						rows={4}
						class="bg-white border-amber-200 focus-visible:ring-amber-500 dark:bg-slate-900 dark:border-slate-800"
					/>
				</div>

				<div class="grid gap-6 md:grid-cols-2">
					<div>
						<label for="ingredients" class="block text-sm font-semibold text-slate-800 dark:text-slate-200">
							Ingredients (One per line)
						</label>
						<p class="text-xs text-slate-500 mb-2">Simply list each ingredient on its own line.</p>
						<Textarea
							id="ingredients"
							bind:value={ingredientsText}
							placeholder="e.g.&#10;3 lbs chuck roast&#10;2 tbsp olive oil&#10;1 whole onion, diced"
							rows={12}
							class="font-mono text-sm"
						/>
					</div>

					<div>
						<label for="instructions" class="block text-sm font-semibold text-slate-800 dark:text-slate-200">
							Instructions / Steps (One per line)
						</label>
						<p class="text-xs text-slate-500 mb-2">List each sequential preparation step on its own line.</p>
						<Textarea
							id="instructions"
							bind:value={instructionsText}
							placeholder="e.g.&#10;Preheat the oven to 325°F.&#10;Sear the beef in hot oil until browned.&#10;Simmer veggies and beef with wine for 2 hours."
							rows={12}
							class="font-mono text-sm"
						/>
					</div>
				</div>

				<div class="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
					<Button variant="outline" href="/cooking">Cancel</Button>
					<button
						type="button"
						onclick={handleSubmit}
						class="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-amber-600 text-white hover:bg-amber-700 h-10 px-4 py-2"
					>
						{id ? 'Save Changes' : 'Create Recipe'}
					</button>
				</div>
			</form>
		</Card.Content>
	</Card.Root>
</div>
