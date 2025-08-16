<script lang="ts">
	import GenreTable from '../routes/books/GenreTable.svelte';
	import { Input } from './components/ui/input';
	import { toast } from 'svelte-sonner';
	import * as Card from '$lib/components/ui/card/index.js';
	import type { GenreType } from '../convex/schema';
	import { Button } from './components/ui/button';
	import { useConvexClient } from 'convex-svelte';
	import { AudioWaveform } from 'lucide-svelte';
	import { api } from '../convex/_generated/api';

	let { genres }: { genres: GenreType[] } = $props();

	const client = useConvexClient();

	let newGenre = $state('');

	// const form = superForm(data, {
	// 	validators: zod4Client(genreSchema),
	// 	onUpdated: ({ form: f }) => {
	// 		if (f.valid) {
	// 			toast.success(`Created ${JSON.stringify(f.data.description, null, 2)}`);
	// 		}
	// 	}
	// });

	async function handleSubmit() {
		const id = await client.mutation(api.genres.insert, {
			description: newGenre
		});

		if (id) {
			toast.success(`Successfully created ${newGenre}`);
			newGenre = '';
		}
	}
</script>

<Card.Root>
	<Card.Header>GENRES</Card.Header>
	<Card.Content>
		<form onsubmit={handleSubmit}>
			<Input
				placeholder="Add a Genre"
				autocomplete="off"
				spellcheck="false"
				bind:value={newGenre}
				class="rounded-md p-2 ring-1 ring-slate-400"
			/>
			<div class="mt-4 text-center">
				<Button
					onclick={handleSubmit}
					class="w-1/2 bg-gradient-to-b from-blue-700 to-blue-600 font-bold text-white uppercase hover:cursor-pointer"
					>Submit</Button
				>
			</div>
		</form>
		<hr class="mx-2 my-4 border-white" />
		<GenreTable {genres} />
	</Card.Content>
</Card.Root>
