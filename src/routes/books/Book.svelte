<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Star, PencilLine, Trash2 } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card';
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
	let isDeleting = $state(false);

	async function handleDelete() {
		if (!confirm(`Delete "${bookDetails.title}"? This cannot be undone.`)) return;
		isDeleting = true;

		try {
			const res = await client.mutation(api.books.deleteBook, { bookId: bookDetails._id });
			if (res.success === true) toast.success(`Deleted ${bookDetails.title}`);
		} catch {
			toast.error('Unable to delete book. Try again.');
		} finally {
			isDeleting = false;
		}
	}
</script>

<Card.Root
	class="mb-2 border-slate-200/80 bg-white/90 shadow-sm transition-shadow hover:shadow-md md:mb-0 dark:border-slate-700 dark:bg-slate-900"
>
	<Card.Content>
		<div class="mb-2 flex justify-between">
			<div class="flex content-center gap-3">
				<div>
					<div class="text-2xl font-bold tracking-tight">{bookDetails.title}</div>
					<p class="text-xs text-slate-500 dark:text-slate-400">
						Added {formatToMST(bookDetails._creationTime)}
					</p>
				</div>
			</div>
			<div class="flex items-center gap-3">
				<a
					href={`/books/modify/${bookDetails._id}`}
					class="text-slate-500 transition-colors hover:text-sky-600"
					aria-label={`Edit ${bookDetails.title}`}
				>
					<PencilLine class="size-4" />
				</a>
				<button
					type="button"
					onclick={handleDelete}
					disabled={isDeleting}
					aria-label={`Delete ${bookDetails.title}`}
				>
					<Trash2
						class="size-4 cursor-pointer text-red-500 disabled:cursor-not-allowed disabled:opacity-50"
					/>
				</button>
			</div>
		</div>

		<div class="mb-2 flex justify-between">
			<div class="text-muted-foreground self-center text-xs">By {bookDetails.author}</div>
			<div class="flex gap-4">
				<Badge variant="secondary">{bookDetails.pages} pages</Badge>
				<Badge variant="outline">{bookDetails.isFiction ? 'Fiction' : 'Non-Fiction'}</Badge>
			</div>
		</div>

		<div class="mb-2 flex justify-between gap-2">
			<p class="text-muted-foreground self-center text-xs">Rating</p>
			<div class="flex" aria-label={`Rated ${bookDetails.rating} out of 5`}>
				{#each [1, 2, 3, 4, 5] as rate}
					{@const colored = rate <= bookDetails.rating}
					<Star class="size-4" strokeWidth={0} fill={colored ? '#f59e0b' : '#cbd5e1'} />
				{/each}
			</div>
		</div>

		<div class="mb-3">
			{#if bookDetails.review}
				<div class="rounded-md bg-slate-50 p-3 text-sm dark:bg-slate-800/60">
					{bookDetails.review}
				</div>
			{:else}
				<div
					class="rounded-md bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800/60 dark:text-slate-400"
				>
					No review for this book.
				</div>
			{/if}
		</div>

		<div class="flex justify-between">
			<div class="flex flex-wrap gap-2">
				<div class="text-muted-foreground self-center text-xs">Genres</div>
				{#each bookDetails.genres as { description }}
					<Badge class="bg-indigo-600 text-white hover:bg-indigo-700">{description}</Badge>
				{/each}
			</div>
		</div>
	</Card.Content>
</Card.Root>
