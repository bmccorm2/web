<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import SwimWorkout from '$lib/SwimWorkout.svelte';
	import {
		authorValues,
		type AuthorFilter,
		type TagFilter,
		type SwimWorkout as SwimWorkoutType,
		tagValues
	} from '$lib/types';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { Tags } from 'lucide-svelte';

	let { data } = $props();

	let authorFilter: AuthorFilter = $state('All');
	let tagFilter: TagFilter = $state('All');
	let filteredWorkouts = $derived.by(() => {
		if (authorFilter === 'All' && tagFilter === 'All') return data.swimWorkouts;

		let authors: SwimWorkoutType[] = [];
		let tags: SwimWorkoutType[] = [];

		if (authorFilter != 'All')
			authors = data.swimWorkouts.filter((e: SwimWorkoutType) => e.author === authorFilter);

		if (tagFilter != 'All')
			tags = data.swimWorkouts.filter((e1: SwimWorkoutType) => {
				return e1.tags?.some((e2) => e2.tag === tagFilter);
			});

		if (tagFilter === 'All') return authors;
		if (authorFilter === 'All') return tags;

		//else return common elements
		return authors.filter((e1) => tags.some((e2) => e1.id === e2.id));
	});

	$effect(() => {
		if (page.url.searchParams.get('success') === 'true')
			toast.success('Successfully created workout!!');
	});
</script>

{#snippet authorButton(authorText: AuthorFilter)}
	<Button
		variant="secondary"
		class={authorFilter === authorText ? 'bg-blue-500' : ''}
		onclick={() => (authorFilter = authorText)}>{authorText}</Button
	>
{/snippet}
{#snippet tagButton(tagText: TagFilter)}
	<Button
		variant="secondary"
		class={tagFilter === tagText ? 'bg-blue-500' : ''}
		onclick={() => (tagFilter = tagText)}>{tagText}</Button
	>
{/snippet}

<svelte:head>
	<title>Swimming</title>
	<meta name="swim workouts" content="save swim workouts" />
</svelte:head>

<div class="flex justify-center">
	<Button
		variant="link"
		href="/swimming/modify"
		class="me-2 mt-4 w-1/2 rounded-lg bg-gradient-to-b from-blue-700 to-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
		>Add a Workout</Button
	>
</div>
<hr class="my-4" />

<!-- AUTHORS -->
<div class="ml-2 md:ml-0 md:flex md:items-center">
	<div class="md:w-3/4">
		<div class="flex items-center gap-1 overflow-auto">
			<p class="mr-2 w-16">Authors</p>
			{#each authorValues as author}
				{@render authorButton(author)}
			{/each}
		</div>
		<!-- TAGS -->
		<div class="mt-2 flex items-center gap-1 overflow-auto">
			<p class="mr-2 min-w-16">Tags</p>
			{#each tagValues as tag}
				{@render tagButton(tag)}
			{/each}
		</div>
	</div>
	<div
		class="mt-2 flex items-center justify-center text-4xl font-extrabold text-red-500 md:mt-0 md:justify-start"
	>
		<div class="mr-6 text-xs text-gray-500">TOTAL</div>
		<div>
			{filteredWorkouts.length}
		</div>
	</div>
</div>

<hr class="my-4" />

<div class="md:grid md:gap-4 lg:grid-cols-2 xl:grid-cols-3">
	{#each filteredWorkouts as workout}
		<SwimWorkout {...workout} />
	{/each}
</div>
