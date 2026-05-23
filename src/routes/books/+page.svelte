<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import Book from './Book.svelte';
	import { toast } from 'svelte-sonner';
	import { useQuery } from 'convex-svelte';
	import { api } from '../../convex/_generated/api';

	const books = useQuery(api.books.getAll, {});
	const sixMonthsAgo = new Date();
	sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

	let searchTerm = $state('');
	let selectedGenre = $state('all');
	let sortBy = $state<'recent' | 'rating' | 'title'>('recent');

	const allBooks = $derived(books.data ?? []);

	const genreOptions = $derived(
		Array.from(
			new Set(allBooks.flatMap((book) => book.genres.map((genre) => genre.description)))
		).sort((a, b) => a.localeCompare(b))
	);

	const filteredBooks = $derived.by(() => {
		const normalizedSearch = searchTerm.trim().toLowerCase();

		let nextBooks = allBooks.filter((book) => {
			if (!normalizedSearch) return true;
			const searchableText = `${book.title} ${book.author} ${book.review}`.toLowerCase();
			return searchableText.includes(normalizedSearch);
		});

		if (selectedGenre !== 'all') {
			nextBooks = nextBooks.filter((book) =>
				book.genres.some((genre) => genre.description === selectedGenre)
			);
		}

		const sortedBooks = [...nextBooks];
		sortedBooks.sort((a, b) => {
			if (sortBy === 'rating') return b.rating - a.rating;
			if (sortBy === 'title') return a.title.localeCompare(b.title);
			return b._creationTime - a._creationTime;
		});

		return sortedBooks;
	});

	const booksInLastSixMonths = $derived(
		allBooks.filter((book) => book._creationTime >= sixMonthsAgo.getTime()).length
	);

	const totalBooks = $derived(allBooks.length);

	$effect(() => {
		const toastType = sessionStorage.getItem('books-toast');
		if (!toastType) return;

		if (toastType === 'create') toast.success('Successfully created book');
		if (toastType === 'update') toast.success('Successfully updated book');

		sessionStorage.removeItem('books-toast');
	});
</script>

<div class="w-full px-4 pb-8">
	<div
		class="mt-4 rounded-xl border border-slate-200 bg-gradient-to-r from-cyan-50 via-sky-50 to-blue-100 p-4 shadow-sm dark:border-slate-700 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800"
	>
		<div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
			<div>
				<h1 class="text-xl font-semibold tracking-tight">Books</h1>
				<p class="text-sm text-slate-500 dark:text-slate-400">
					Browse, filter, and track your reading history.
				</p>
			</div>
			<Button href="/books/modify" class="w-full md:w-auto">Add a New Book</Button>
		</div>
	</div>

	<div class="mt-4 grid gap-3 sm:grid-cols-2">
		<div
			class="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900"
		>
			<p class="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
				Books in 6 Months
			</p>
			<p class="mt-1 text-2xl font-semibold">{booksInLastSixMonths}</p>
		</div>
		<div
			class="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900"
		>
			<p class="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
				Total Read
			</p>
			<p class="mt-1 text-2xl font-semibold">{totalBooks}</p>
		</div>
	</div>

	<div
		class="mt-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm md:grid-cols-[2fr_1fr_1fr_auto] md:items-center dark:border-slate-700 dark:bg-slate-900"
	>
		<Input type="search" bind:value={searchTerm} placeholder="Search by title, author, or review" />

		<select
			class="border-input bg-background ring-offset-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
			bind:value={selectedGenre}
		>
			<option value="all">All genres</option>
			{#each genreOptions as genre}
				<option value={genre}>{genre}</option>
			{/each}
		</select>

		<select
			class="border-input bg-background ring-offset-background focus-visible:border-ring focus-visible:ring-ring/50 h-9 rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
			bind:value={sortBy}
		>
			<option value="recent">Recently added</option>
			<option value="rating">Highest rating</option>
			<option value="title">Title A-Z</option>
		</select>

		<Button
			variant="outline"
			onclick={() => {
				searchTerm = '';
				selectedGenre = 'all';
				sortBy = 'recent';
			}}
		>
			Reset
		</Button>
	</div>

	<hr class="my-4" />

	<div class="grid gap-4 md:grid-cols-2">
		{#if books.isLoading}
			{#each [1, 2, 3, 4] as skeleton}
				<div
					class="animate-pulse rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900"
					aria-hidden="true"
				>
					<div class="mb-3 h-6 w-3/5 rounded bg-slate-200 dark:bg-slate-700"></div>
					<div class="mb-2 h-3 w-2/5 rounded bg-slate-200 dark:bg-slate-700"></div>
					<div class="mb-4 h-3 w-4/5 rounded bg-slate-200 dark:bg-slate-700"></div>
					<div class="h-16 rounded bg-slate-200 dark:bg-slate-700"></div>
				</div>
			{/each}
		{:else if books.error}
			<p class="text-sm text-red-600">Error loading books.</p>
		{:else if filteredBooks.length === 0 && totalBooks === 0}
			<div
				class="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center md:col-span-2 dark:border-slate-700 dark:bg-slate-900"
			>
				<p class="text-lg font-medium">No books yet</p>
				<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
					Add your first book to start your reading log.
				</p>
				<Button href="/books/modify" class="mt-3">Add your first book</Button>
			</div>
		{:else if filteredBooks.length === 0}
			<div
				class="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center md:col-span-2 dark:border-slate-700 dark:bg-slate-900"
			>
				<p class="text-lg font-medium">No books match your filters</p>
				<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
					Try a different search, genre, or sort option.
				</p>
			</div>
		{:else}
			{#each filteredBooks as bookDetails (bookDetails._id)}
				<Book {bookDetails} />
			{/each}
		{/if}
	</div>
</div>
