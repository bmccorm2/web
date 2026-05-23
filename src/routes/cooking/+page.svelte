<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import RecipeCard from './RecipeCard.svelte';
	import { toast } from 'svelte-sonner';
	import { useQuery } from 'convex-svelte';
	import { api } from '../../convex/_generated/api';
	import { ChefHat, Search, Filter, Plus, Wand2 } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	const recipes = useQuery(api.recipes.getAll, {});

	let searchTerm = $state('');
	let sortBy = $state<'recent' | 'title'>('recent');
	let importUrl = $state('');

	const allRecipes = $derived(recipes.data ?? []);

	const filteredRecipes = $derived.by(() => {
		const queryStr = searchTerm.trim().toLowerCase();

		let list = allRecipes.filter((recipe) => {
			if (!queryStr) return true;
			const searchableText = [
				recipe.title,
				recipe.notes || '',
				(recipe.ingredients || []).join(' '),
				(recipe.instructions || []).join(' ')
			].join(' ').toLowerCase();

			return searchableText.includes(queryStr);
		});

		const sortedList = [...list];
		if (sortBy === 'title') {
			sortedList.sort((a, b) => a.title.localeCompare(b.title));
		} else {
			sortedList.sort((a, b) => b._creationTime - a._creationTime);
		}

		return sortedList;
	});

	const totalRecipesCount = $derived(allRecipes.length);
	const editedRecipesCount = $derived(allRecipes.filter((r) => r.notes && r.notes.trim()).length);

	function handleQuickImport() {
		if (!importUrl.trim()) return;
		// Navigate to modify page with importUrl parameter
		goto(`/cooking/modify?importUrl=${encodeURIComponent(importUrl.trim())}`);
	}

	$effect(() => {
		const toastType = sessionStorage.getItem('cooking-toast');
		if (!toastType) return;

		if (toastType === 'create') toast.success('Successfully created recipe');
		if (toastType === 'update') toast.success('Successfully updated recipe');

		sessionStorage.removeItem('cooking-toast');
	});
</script>

<div class="w-full px-4 pb-8">
	<!-- Header banner -->
	<div
		class="mt-4 rounded-xl border border-slate-200 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 p-4 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-amber-950/20"
	>
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div class="flex items-center gap-3">
				<div class="rounded-lg bg-amber-500 p-2 text-white">
					<ChefHat class="h-6 w-6" />
				</div>
				<div>
					<h1 class="text-xl font-semibold tracking-tight">My Cooking Ledger</h1>
					<p class="text-sm text-slate-500 dark:text-slate-400">
						Parse web recipes, keep track of ingredient modifications, and document your cooking edits.
					</p>
				</div>
			</div>
			<div class="flex flex-col gap-2 sm:flex-row">
				<Button href="/cooking/modify" class="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white flex items-center gap-1.5">
					<Plus class="h-4 w-4" />
					<span>Add Manually</span>
				</Button>
			</div>
		</div>
	</div>

	<!-- Stats Summary cards -->
	<div class="mt-4 grid gap-3 sm:grid-cols-2">
		<div
			class="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900"
		>
			<p class="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
				Total Recipes
			</p>
			<p class="mt-1 text-2xl font-semibold text-slate-800 dark:text-white">{totalRecipesCount}</p>
		</div>
		<div
			class="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900"
		>
			<p class="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
				Recipes with Custom Notes & Edits
			</p>
			<p class="mt-1 text-2xl font-semibold text-amber-600 dark:text-amber-400">{editedRecipesCount}</p>
		</div>
	</div>

	<!-- Quick URL Import section -->
	<div
		class="mt-4 rounded-xl border border-dashed border-amber-300 bg-amber-50/20 p-4 dark:border-slate-800 dark:bg-slate-900/60"
	>
		<h2 class="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1.5 flex items-center gap-1.5">
			<Wand2 class="h-4 w-4 text-amber-500" />
			<span>Quick Import from Website</span>
		</h2>
		<p class="text-xs text-slate-500 dark:text-slate-400 mb-3">
			Just paste a recipe URL from any major recipe site or blog to parse it and add it.
		</p>
		<div class="flex flex-col gap-2 sm:flex-row">
			<Input
				type="url"
				placeholder="Paste recipe URL (e.g. https://www.allrecipes.com/...)"
				bind:value={importUrl}
				class="flex-1 bg-white dark:bg-slate-950"
			/>
			<Button
				variant="secondary"
				onclick={handleQuickImport}
				disabled={!importUrl.trim()}
				class="bg-amber-100 hover:bg-amber-200 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/50"
			>
				Start Parsing
			</Button>
		</div>
	</div>

	<!-- Filter/Search Bar -->
	<div
		class="mt-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:grid-cols-[2fr_1fr_auto] md:items-center dark:border-slate-700 dark:bg-slate-900"
	>
		<div class="relative">
			<Search class="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
			<Input
				type="search"
				bind:value={searchTerm}
				placeholder="Search by title, notes, or ingredients"
				class="pl-9"
			/>
		</div>

		<div class="flex items-center gap-2">
			<Filter class="h-4 w-4 text-slate-400 shrink-0" />
			<select
				class="border-input bg-background ring-offset-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
				bind:value={sortBy}
			>
				<option value="recent">Recently added</option>
				<option value="title">Title A-Z</option>
			</select>
		</div>

		<Button
			variant="outline"
			onclick={() => {
				searchTerm = '';
				sortBy = 'recent';
			}}
		>
			Reset
		</Button>
	</div>

	<hr class="my-5 border-slate-200 dark:border-slate-800" />

	<!-- Recipes List -->
	{#if recipes.isLoading}
		<div class="space-y-4">
			{#each [1, 2, 3] as skeleton}
				<div
					class="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900"
					aria-hidden="true"
				>
					<div class="flex flex-col sm:flex-row gap-4">
						<div class="h-28 w-full sm:w-40 rounded bg-slate-200 dark:bg-slate-700"></div>
						<div class="flex-1 space-y-3">
							<div class="h-6 w-3/5 rounded bg-slate-200 dark:bg-slate-700"></div>
							<div class="h-4 w-2/5 rounded bg-slate-200 dark:bg-slate-700"></div>
							<div class="h-10 rounded bg-slate-200 dark:bg-slate-700"></div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{:else if filteredRecipes.length === 0}
		<div class="rounded-xl border border-dashed border-slate-200 p-12 text-center dark:border-slate-800">
			<ChefHat class="mx-auto h-12 w-12 text-slate-300 dark:text-slate-700" />
			<h3 class="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">No recipes found</h3>
			<p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
				{#if searchTerm}
					Try adjusting your search or filters.
				{:else}
					Get started by importing a recipe or adding one manually!
				{/if}
			</p>
			{#if searchTerm}
				<Button variant="outline" class="mt-4" onclick={() => { searchTerm = ''; }}>Clear Search</Button>
			{/if}
		</div>
	{:else}
		<div class="space-y-1">
			{#each filteredRecipes as recipe (recipe._id)}
				<RecipeCard {recipe} />
			{/each}
		</div>
	{/if}
</div>
