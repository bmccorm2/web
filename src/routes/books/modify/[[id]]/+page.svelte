<script lang="ts">
	import { userRating } from '$lib/stores';
	import Genres from '$lib/Genres.svelte';
	import Rating from '../../Rating.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card/index.js';
	import type { Id } from '../../../../convex/_generated/dataModel';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { api } from '../../../../convex/_generated/api';
	import { Label } from '$lib/components/ui/label';
	import { formatToMSTInput, toEpochMs } from '$lib/utilities';
	import { goto } from '$app/navigation';

	const id = page.params.id as Id<'Books'>;
	const client = useConvexClient();
	const genres = useQuery(api.genres.getAll, {});

	let title: string | undefined = $state(undefined);
	let author: string | undefined = $state(undefined);
	let review: string | undefined = $state(undefined);
	let pages: number | undefined = $state(undefined);
	let publishDate: string | undefined = $state(undefined);
	let isFiction: boolean = $state(false);
	let selectedGenres: Id<'Genres'>[] = $state([]);

	if (id) {
		const book = useQuery(api.books.get, { bookId: id });
		$effect(() => {
			if (book.data) {
				title = book.data.title;
				author = book.data.author;
				review = book.data.review;
				pages = book.data.pages;
				publishDate = book.data.publishDate ? formatToMSTInput(book.data.publishDate) : undefined;
				isFiction = book.data.isFiction;
				selectedGenres = book.data.genres;
				userRating.set(book.data.rating);
			}
		});
	}

	async function handleSubmit() {
		if (title && author && review && pages) {
			const bookData = {
				title,
				author,
				review,
				pages,
				...(publishDate ? { publishDate: toEpochMs(publishDate) } : {}),
				isFiction,
				rating: $userRating,
				genres: selectedGenres
			};
			if (id) {
				//Perform an UPDATE
				const res = await client.mutation(api.books.update, {
					id,
					...bookData
				});
				if (res.success === true) goto('/books?update=true');
			} else {
				//Perform an INSERT
				const id = await client.mutation(api.books.insert, bookData);

				if (id) goto('/books?create=true');
			}
		}
	}
</script>

<div class="mt-2 lg:flex lg:gap-2">
	<div class="lg:w-9/12">
		<Card.Root class="mt-2">
			<Card.Header>{id ? 'UPDATE BOOK' : 'CREATE BOOK'}</Card.Header>
			<Card.Content>
				<form>
					<div class="mx-2">
						<Input
							class="mb-4 rounded-md p-2 ring-1 ring-slate-400"
							bind:value={title}
							placeholder="Title"
							autocomplete="off"
							spellcheck="false"
						/>
						<Input
							class="mb-4 rounded-md p-2 ring-1 ring-slate-400"
							bind:value={author}
							placeholder="Author"
							autocomplete="off"
							spellcheck="false"
						/>
						<Textarea
							class="mb-4 rounded-md p-2 ring-1 ring-slate-400"
							bind:value={review}
							placeholder="Review"
							autocomplete="off"
							spellcheck="false"
						/>
						<!-- GENRES -->
						<div class=" mt-6 rounded-md border-2 border-purple-500 px-2 py-1 text-center">
							<div class="mb-2 font-bold underline">Genres</div>
							<div class="mb-2 grid grid-cols-2 gap-2 lg:grid-cols-4">
								{#if genres.isLoading}
									<p>Loading Genres...</p>
								{:else if genres.error}
									<p>Error Loading Genres.</p>
								{:else}
									{#each genres.data as genre}
										{@const checked = selectedGenres.some((e) => e === genre._id)}
										<div class="flex items-center">
											<Label class="ml-2">
												<Checkbox
													{checked}
													onCheckedChange={(e) => {
														if (e) selectedGenres.push(genre._id);
														else selectedGenres = selectedGenres?.filter((e) => genre._id !== e);
													}}
												/>
												{genre.description}
											</Label>
										</div>
									{/each}
								{/if}
							</div>
						</div>
						<!-- RATING -->
						<div class="m-4 md:flex md:items-center md:justify-center md:gap-12">
							<div class="mb-2 text-center md:mb-0">
								<Rating />
							</div>
							<div class="text-center">
								<Label>
									<Checkbox bind:checked={isFiction} />

									Is Fiction?</Label
								>
							</div>
						</div>
						<!-- PAGES -->
						<div class="m-4 lg:flex lg:content-center lg:justify-evenly lg:gap-8">
							<Input
								type="number"
								placeholder="Pages"
								class="mb-4 rounded-md p-2 ring-1 ring-slate-400"
								bind:value={pages}
								autocomplete="off"
							/>
							<Input
								type="date"
								placeholder="Publish Date"
								class="rounded-md p-2 ring-1 ring-slate-400"
								bind:value={publishDate}
								autocomplete="off"
							/>
						</div>

						<!-- SUBMIT BUTTON -->
						<div class="text-center">
							<Button
								onclick={handleSubmit}
								class="m-4 w-2/3 bg-gradient-to-b from-blue-700 to-blue-600 font-bold text-white uppercase hover:cursor-pointer"
								>{id ? 'Update' : 'Create'}</Button
							>
						</div>
					</div>
				</form>
			</Card.Content>
		</Card.Root>
	</div>
	<div class="mt-2 w-full lg:w-3/12">
		{#if genres.isLoading}
			<p>Loading Genres...</p>
		{:else if genres.error}
			<p>Error Loading Genres.</p>
		{:else}
			<Genres genres={genres.data} />
		{/if}
	</div>
</div>
