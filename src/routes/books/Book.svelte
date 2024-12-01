<script lang="ts">
	import { Badge } from '$lib/components/ui/badge/index';
	import type { Book } from '$lib/types';
	import { Star, PencilLine, Trash2 } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import { formatDate } from '$lib/utilities';

	let {
		bookDetails
	}: {
		bookDetails: Book;
	} = $props();

	const { title, author, rating, pages, isFiction, id, review, created } = bookDetails;
</script>

<Card.Root class="mb-2 md:mb-0">
	<Card.Content>
		<div class="mb-2 flex justify-between">
			<div class="flex content-center gap-3">
				<!-- TITLE -->
				<div class="text-3xl font-bold underline">{title}</div>
			</div>
			<!-- ACTIONS -->
			<div class="flex gap-3">
				<a href="books/modify/{id}">
					<PencilLine class="h-4- w-4" />
				</a>
				<form action="?/deleteBook" method="post">
					<input type="hidden" name="id" value={id} />
					<button>
						<Trash2 class="h-4- w-4" />
					</button>
				</form>
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
			<p class="self-center text-xs text-slate-400">First read: {formatDate(created)}</p>
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
				{#each bookDetails.genres as { description }}
					<Badge class="bg-purple-600 text-xs text-black dark:bg-purple-600">{description}</Badge>
				{/each}
			</div>
		</div>
	</Card.Content>
</Card.Root>
