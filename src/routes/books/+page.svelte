<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Book from './Book.svelte';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { useQuery } from 'convex-svelte';
	import { api } from '../../convex/_generated/api';

	const books = useQuery(api.books.getAll, {});
	const sixMonthsAgo = new Date();
	sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

	let booksInLastSixMonths = $state(0);

	$effect(() => {
		if (books.data) {
			booksInLastSixMonths = books.data.filter(
				(book) => book._creationTime >= sixMonthsAgo.getTime()
			).length;
		}
	});

	$effect(() => {
		if (page.url.searchParams.get('create') === 'true') toast.success('Successfully created book');
		if (page.url.searchParams.get('update') === 'true') toast.success('Successfully updated book');
	});
</script>

<div class="flex justify-center">
	<Button
		variant="link"
		href="/books/modify"
		class="me-2 mt-4 w-1/2 rounded-lg bg-gradient-to-b from-blue-700 to-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:ring-4 focus:ring-blue-300 focus:outline-none dark:focus:ring-blue-800"
		>Add a New Book</Button
	>
</div>
<div class="mt-4 flex justify-around">
	<span class="text-xs text-slate-400">Books Read in last six months: {booksInLastSixMonths} </span>
	<span class="text-xs text-slate-400">Total Read: {books.data?.length} </span>
</div>
<hr class="my-4" />
<div class="md:grid md:grid-cols-2 md:gap-4">
	{#if books.isLoading}
		<p>Loading Books...</p>
	{:else if books.error}
		<p>Error Loading Books.</p>
	{:else}
		{#each books.data as bookDetails (bookDetails._id)}
			<Book {bookDetails} />
		{/each}
	{/if}
</div>
