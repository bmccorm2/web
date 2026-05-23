<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index';
	import { PencilLine, Trash2, Clock, Globe, NotebookPen, ChefHat } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { formatToMST } from '$lib/utilities';
	import { useConvexClient } from 'convex-svelte';
	import { api } from '../../convex/_generated/api';
	import { toast } from 'svelte-sonner';
	import type { Doc } from '../../convex/_generated/dataModel';

	let {
		recipe
	}: {
		recipe: Doc<'Recipes'>;
	} = $props();

	const client = useConvexClient();
	let isDeleting = $state(false);
	let showDetails = $state(false);

	async function handleDelete() {
		if (!confirm(`Delete "${recipe.title}"? This cannot be undone.`)) return;
		isDeleting = true;

		try {
			const res = await client.mutation(api.recipes.deleteRecipe, { id: recipe._id });
			if (res.success === true) toast.success(`Deleted ${recipe.title}`);
		} catch {
			toast.error('Unable to delete recipe. Try again.');
		} finally {
			isDeleting = false;
		}
	}
</script>

<Card.Root
	class="mb-3 overflow-hidden border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
>
	<div class="flex flex-col sm:flex-row">
		{#if recipe.imageUrl}
			<div class="relative h-48 w-full shrink-0 sm:h-auto sm:w-40 md:w-48 bg-slate-100 dark:bg-slate-800">
				<img
					src={recipe.imageUrl}
					alt={recipe.title}
					class="absolute inset-0 h-full w-full object-cover"
				/>
			</div>
		{:else}
			<div class="flex h-36 w-full shrink-0 items-center justify-center bg-sky-50 text-sky-400 sm:h-auto sm:w-40 md:w-48 dark:bg-slate-800 dark:text-slate-600">
				<ChefHat class="h-12 w-12" />
			</div>
		{/if}

		<div class="flex flex-1 flex-col p-4 sm:p-5">
			<div class="mb-2 flex items-start justify-between gap-2">
				<div>
					<h3 class="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
						{recipe.title}
					</h3>
					<p class="text-xs text-slate-400 dark:text-slate-500">
						Added {formatToMST(recipe._creationTime)}
					</p>
				</div>
				<div class="flex items-center gap-3">
					<a
						href={`/cooking/modify/${recipe._id}`}
						class="text-slate-500 transition-colors hover:text-sky-600"
						aria-label={`Edit ${recipe.title}`}
					>
						<PencilLine class="h-4 w-4" />
					</a>
					<button
						type="button"
						onclick={handleDelete}
						disabled={isDeleting}
						aria-label={`Delete ${recipe.title}`}
					>
						<Trash2
							class="h-4 w-4 cursor-pointer text-red-500 disabled:cursor-not-allowed disabled:opacity-50 hover:text-red-600"
						/>
					</button>
				</div>
			</div>

			<!-- Meta fields (prep, cook, yield, source) -->
			<div class="mb-3 flex flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400">
				{#if recipe.totalTime || recipe.prepTime || recipe.cookTime}
					<div class="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 dark:bg-slate-800">
						<Clock class="h-3 w-3" />
						<span>
							{recipe.totalTime || `${recipe.prepTime ?? ''} / ${recipe.cookTime ?? ''}`}
						</span>
					</div>
				{/if}
				{#if recipe.yield}
					<div class="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 dark:bg-slate-800">
						<span>Yield: {recipe.yield}</span>
					</div>
				{/if}
				{#if recipe.url}
					<a
						href={recipe.url}
						target="_blank"
						rel="noreferrer"
						class="flex items-center gap-1 rounded bg-sky-50 px-2 py-1 text-sky-600 hover:underline dark:bg-sky-950/40 dark:text-sky-400"
					>
						<Globe class="h-3 w-3" />
						<span>Source Site</span>
					</a>
				{/if}
			</div>

			<!-- CUSTOM NOTES / EDITS (Prominently Highlighted) -->
			{#if recipe.notes}
				<div class="mb-3 rounded-lg border border-amber-200 bg-amber-50/70 p-3 text-sm text-slate-700 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-200">
					<div class="mb-1 flex items-center gap-1.5 font-semibold text-amber-800 dark:text-amber-300">
						<NotebookPen class="h-4 w-4" />
						<span>My Notes & Edits</span>
					</div>
					<p class="whitespace-pre-line">{recipe.notes}</p>
				</div>
			{/if}

			<!-- Toggle Details Button -->
			<div class="mt-auto pt-2">
				<button
					type="button"
					onclick={() => showDetails = !showDetails}
					class="text-xs font-semibold text-sky-600 hover:underline dark:text-sky-400"
				>
					{showDetails ? 'Hide details' : 'Show details (ingredients & instructions)'}
				</button>
			</div>

			{#if showDetails}
				<div class="mt-4 border-t border-slate-100 pt-4 dark:border-slate-800">
					<div class="grid gap-4 md:grid-cols-2">
						<div>
							<h4 class="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">Ingredients</h4>
							<ul class="list-inside list-disc space-y-1 text-sm text-slate-600 dark:text-slate-300">
								{#each recipe.ingredients as ingredient}
									<li>{ingredient}</li>
								{/each}
							</ul>
						</div>
						<div>
							<h4 class="mb-2 text-sm font-semibold text-slate-800 dark:text-slate-200">Instructions</h4>
							<ol class="list-inside list-decimal space-y-2 text-sm text-slate-600 dark:text-slate-300">
								{#each recipe.instructions as step, i}
									<li class="pl-1">
										<span class="font-medium text-slate-700 dark:text-slate-200">{step}</span>
									</li>
								{/each}
							</ol>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</Card.Root>
