<!-- <script lang="ts">
	import { userRating } from '$lib/stores';
	import Genres from '$lib/Genres.svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import Rating from '../../Rating.svelte';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Form from '$lib/components/ui/form';
	import { zod4Client } from 'sveltekit-superforms/adapters';
	import { bookSchema, type Genre } from '$lib/types';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card/index.js';

	let { data } = $props();

	const form = superForm(data.form, { validators: zod4Client(bookSchema), dataType: 'json' });

	const { form: formData, enhance } = form;

	//For the star rating so we can bind it to the form
	userRating.set($formData.rating);
	$effect(() => {
		$formData.rating = $userRating;
	});

	const addGenre = (id: number, description: string) => {
		$formData.genres = [...$formData.genres, { id, description }];
	};

	const removeGenre = (id: number) => {
		$formData.genres = $formData.genres.filter((e: Genre) => e.id != id);
	};
</script> -->

<!-- <div class="mt-2 lg:flex lg:gap-2">
	<div class="lg:w-9/12">
		<Card.Root class="mt-2">
			<Card.Header>{$formData.id ? 'UPDATE BOOK' : 'CREATE BOOK'}</Card.Header>
			<Card.Content>
				<form action="?/modify" method="post" use:enhance>
					<div class="mx-2">
						<Form.Field {form} name="title" class="mx-4 mb-4 mt-4">
							<Form.Control>
								{#snippet children({ props })}
									<Input
										{...props}
										class="rounded-md p-2 ring-1 ring-slate-400"
										bind:value={$formData.title}
										placeholder="Title"
										autocomplete="off"
										spellcheck="false"
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<Form.Field {form} name="author" class="m-4">
							<Form.Control>
								{#snippet children({ props })}
									<Input
										{...props}
										class="rounded-md p-2 ring-1 ring-slate-400"
										bind:value={$formData.author}
										placeholder="Author"
										autocomplete="off"
										spellcheck="false"
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field>
						<Form.Field {form} name="review" class="m-4">
							<Form.Control>
								{#snippet children({ props })}
									<Textarea
										{...props}
										class="rounded-md p-2 ring-1 ring-slate-400"
										bind:value={$formData.review}
										placeholder="Review"
										autocomplete="off"
										spellcheck="false"
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						</Form.Field> -->
<!-- GENRES -->
<!-- <div class="m-4 mt-6 rounded-md border-2 border-purple-500 px-2 py-1 text-center">
							<div class="mb-2 font-bold underline">Genres</div>
							<Form.Fieldset {form} name="genres">
								<div class="mb-2 grid grid-cols-2 gap-2 lg:grid-cols-4">
									{#each data.genres as genre}
										{@const checked = $formData.genres.some((e) => e.id === genre.id)}
										<div class="flex items-center">
											<Form.Control>
												{#snippet children({ props })}
													<Checkbox
														{...props}
														{checked}
														onCheckedChange={(e: boolean) => {
															if (e) addGenre(genre.id, genre.description);
															else removeGenre(genre.id);
														}}
													/>
													<Form.Label class="ml-2">{genre.description}</Form.Label>
													<input
														hidden
														type="checkbox"
														name={props.name}
														value={genre.id}
														{checked}
													/>
												{/snippet}
											</Form.Control>
											<Form.FieldErrors />
										</div>
									{/each}
								</div>
							</Form.Fieldset>
						</div> -->
<!-- RATING -->
<!-- <div class="m-4 mt-6 md:flex md:items-center md:justify-center md:gap-12">
							<div class="mb-2 text-center md:mb-0">
								<Rating />
							</div>
							<div class="text-center">
								<Form.Field {form} name="isFiction">
									<Form.Control>
										{#snippet children({ props })}
											<Checkbox {...props} bind:checked={$formData.isFiction} />
											<Form.Label>Is Fiction?</Form.Label>
											<input name={props.name} value={$formData.isFiction} hidden />
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</Form.Field>
							</div>
						</div> -->
<!-- PAGES -->
<!-- <div class="m-4 lg:flex lg:content-center lg:justify-evenly">
							<Form.Field {form} name="pages">
								<Form.Control>
									{#snippet children({ props })}
										<Input
											{...props}
											type="number"
											placeholder="Pages"
											class="rounded-md p-2 ring-1 ring-slate-400"
											bind:value={$formData.pages}
											autocomplete="off"
										/>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
							<Form.Field {form} name="publishDate">
								<Form.Control>
									{#snippet children({ props })}
										<Input
											{...props}
											type="date"
											placeholder="Publish Date"
											class="rounded-md p-2 ring-1 ring-slate-400"
											bind:value={$formData.publishDate}
											autocomplete="off"
										/>
									{/snippet}
								</Form.Control>
								<Form.FieldErrors />
							</Form.Field>
						</div> -->

<!-- SUBMIT BUTTON -->
<!-- <div class="text-center">
							<Form.Button class="m-4 w-1/2">{$formData.id ? 'Update' : 'Create'}</Form.Button>
						</div>
					</div>
				</form>
			</Card.Content>
		</Card.Root>
	</div>
	<div class="mt-2 w-full lg:w-3/12">
		<Genres data={data.genreForm} genres={data.genres} />
	</div>
</div> -->
