<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index';
	import { Star, PencilLine, Trash2 } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { formatToMST } from '$lib/utilities';
	import type { BookTypeFull } from '../../convex/schema';
	import { useConvexClient } from 'convex-svelte';
	import { api } from '../../convex/_generated/api';
	import { toast } from 'svelte-sonner';

	let {
		bookDetails
	}: {
		bookDetails: BookTypeFull;
	} = $props();

	const client = useConvexClient();
	const { title, author, rating, pages, isFiction, _id, review, _creationTime, genres } =
		bookDetails;

	async function handleDelete() {
		const res = await client.mutation(api.books.deleteBook, { bookId: _id });
		if (res.success === true) toast.success(`Deleted ${title}`);
	}
</script>

<Card.Root class="mb-2 md:mb-0">
	<Card.Content>
		<div class="mb-2 flex justify-between">
			<div class="flex content-center gap-3">
				<!-- TITLE -->
				<div class="text-3xl font-bold underline">{title}</div>
			</div>
			<!-- ACTIONS -->
			<div class="flex items-center gap-3">
				<a href="books/modify/{_id}">
					<PencilLine class="h-4- w-4" />
				</a>
				<button onclick={handleDelete}>
					<Trash2 class="h-4- w-4 cursor-pointer text-red-500" />
				</button>
			</div>
		</div>
		<!-- AUTHOR/PAGES/FICTION -->
		<div class="mb-2 flex justify-between">
			<div class="self-center text-xs text-slate-400">By {author}</div>
			<div class="flex gap-4">
				<Badge class="bg-blue-600 text-xs text-black dark:bg-blue-600">{pages} pages</Badge>
				<Badge class="bg-gray-500 text-xs text-black dark:bg-gray-500"
					>{isFiction ? 'Fiction' : 'Non-Fiction'}</Badge
				>
			</div>
		</div>
		<!-- READ/RATING -->
		<div class="mb-2 flex justify-between gap-2">
			<p class="self-center text-xs text-slate-400">First read: {formatToMST(_creationTime)}</p>
			<div class="flex">
				{#each [1, 2, 3, 4, 5] as rate}
					{@const colored = rate <= rating}
					<Star strokeWidth={0} fill={colored ? 'gold' : ''} />
				{/each}
			</div>
		</div>
		<!-- REVIEW -->
		<div class="mb-3">
			{#if review}
				<div>{review}</div>
			{:else}
				<div>No Review for this book.</div>
			{/if}
		</div>
		<!-- GENRES -->
		<div class="flex justify-between">
			<div class="flex gap-2">
				<div class="self-center text-xs text-gray-500">Genres</div>
				{#each genres as { description }}
					<Badge class="bg-purple-600 text-xs text-black dark:bg-purple-600">{description}</Badge>
				{/each}
			</div>
		</div>
	</Card.Content>
</Card.Root>
