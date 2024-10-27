<script lang="ts">
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import GenreTable from '../routes/books/GenreTable.svelte';
	import { Input } from './components/ui/input';
	import { genreSchema, type Genre } from './types';
	import * as Form from '$lib/components/ui/form';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast, Toaster } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card/index.js';

	let { data, genres }: { data: SuperValidated<Infer<typeof genreSchema>>; genres: Genre[] } =
		$props();

	const form = superForm(data, {
		validators: zodClient(genreSchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Created ${JSON.stringify(f.data.description, null, 2)}`);
			}
		}
	});

	const { form: formData } = form;
</script>

<Card.Root>
	<Card.Header>GENRES</Card.Header>
	<Card.Content>
		<form action="?/insertGenre" method="post">
			<Form.Field {form} name="description" class="mx-4">
				<Form.Control>
					{#snippet children({ attrs })}
						<Input
							{...attrs}
							placeholder="Add a Genre"
							autocomplete="off"
							spellcheck="false"
							bind:value={$formData.description}
							class="rounded-md p-2 ring-1 ring-slate-400"
						/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>
			<div class="mt-4 text-center">
				<Form.Button class="w-1/2 bg-blue-500 font-bold uppercase text-white">Submit</Form.Button>
			</div>
		</form>
		<hr class="mx-2 my-4 border-white" />
		<GenreTable {genres} />
	</Card.Content>
</Card.Root>

<Toaster richColors />
