<script lang="ts">
	import { page } from '$app/state';
	import type { CarType } from '$lib/types';

	let { cars }: { cars: CarType[] } = $props();
</script>

{#each cars as car}
	<div>
		<a
			href="/consumption/{car._id}"
			class={`px-3 text-xl font-bold dark:text-pink-600 ${
				page.params.id === car._id ? 'underline opacity-100' : 'opacity-60'
			} `}
			>{car.displayName}
		</a>
	</div>{/each}
