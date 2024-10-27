<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import type { SwimTag } from '$lib/types';
	import { PencilLine, Trash2 } from 'lucide-svelte';
	import * as Card from '$lib/components/ui/card/index.js';

	interface Props {
		swimWorkoutText: string;
		yards: number;
		created: number;
		author?: string | undefined | null;
		tags?: SwimTag[] | undefined;
		id?: number | undefined;
	}

	let {
		swimWorkoutText,
		yards,
		created,
		author = undefined,
		tags = undefined,
		id = undefined
	}: Props = $props();

	const localDate = new Date(created);
	const utcDate = new Date(
		Date.UTC(
			localDate.getFullYear(),
			localDate.getMonth(),
			localDate.getDate(),
			localDate.getHours(),
			localDate.getMinutes(),
			localDate.getSeconds()
		)
	);

	const dateFormatter = {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	} as const;
</script>

<Card.Root class="mb-2 md:mb-0">
	<Card.Content>
		<div class={`flex justify-between ${author ? 'mb-2' : 'mb-4'}`}>
			<div class="flex content-center gap-3">
				<!-- DATE -->
				<div class="text-3xl font-bold underline">
					{utcDate.toLocaleString('en-US', dateFormatter)}
				</div>
			</div>
			<!-- ACTIONS -->
			<div class="flex gap-3">
				<a href="swimming/modify/{id}">
					<PencilLine class="h-4- w-4" />
				</a>
				<form action="?/deleteWorkout" method="post">
					<input type="hidden" name="id" value={id} />
					<button>
						<Trash2 class="h-4- w-4" />
					</button>
				</form>
			</div>
		</div>
		<!-- AUTHOR -->
		{#if author}
			<div><p class="mb-4 text-xs text-gray-500">By: {author}</p></div>
		{/if}
		<!-- TAGS/YARDS -->
		<div class="flex justify-between">
			<div class="flex gap-2">
				<div class="self-center text-xs text-gray-500">Tags</div>
				{#if tags && tags.length > 0}
					{#each tags as tag}
						<Badge class="bg-purple-700 text-sm">{tag?.tag}</Badge>
					{/each}
				{:else}
					<Badge class="bg-red-700 text-sm">No Tags</Badge>
				{/if}
			</div>

			<Badge class="bg-blue-700 text-sm">{yards} yards</Badge>
		</div>
		<hr class="my-4" />
		<!-- WORKOUT -->
		<div class="mb-3">
			<pre class="text-xs">{swimWorkoutText}</pre>
		</div>
	</Card.Content>
</Card.Root>
