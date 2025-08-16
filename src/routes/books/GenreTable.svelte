<script lang="ts">
	import { Trash2 } from 'lucide-svelte';
	import type { GenreType } from '../../convex/schema';
	import type { Id } from '../../convex/_generated/dataModel';
	import { useConvexClient } from 'convex-svelte';
	import { api } from '../../convex/_generated/api';
	import { toast } from 'svelte-sonner';

	let {
		genres
	}: {
		genres: GenreType[];
	} = $props();

	const client = useConvexClient();

	async function handleSubmit(genreId: Id<'Genres'>, description: string) {
		const res = await client.mutation(api.genres.deleteGenre, { genreId });
		if (res.success === true) toast.success(`Deleted ${description}`);
	}
</script>

<table class="mx-4 mb-2 w-full table-auto">
	<tbody>
		{#each genres as { description, _id }}
			<tr>
				<td class="text-start">{description}</td>
				<td class="w-24">
					<form>
						<button onclick={() => handleSubmit(_id, description)}>
							<Trash2 color="crimson" class="cursor-pointer" size={16} />
						</button>
					</form>
				</td>
			</tr>
		{/each}
	</tbody>
</table>
