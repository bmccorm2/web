<script lang="ts">
	import type { Cars } from './types';
	import { page } from '$app/state';

	let { cars }: { cars: Cars[] } = $props();
</script>

<div class="md:gap my-2 text-center md:flex md:items-center md:justify-center">
	{#each cars as car}
		<div>
			<a
				href="/consumption/{car.id}"
				class={`px-3 text-xl font-bold dark:text-pink-600 ${
					parseInt(page.params.id) === car.id ? 'underline opacity-100' : 'opacity-60'
				} `}
				>{car.displayName}
			</a>
		</div>{/each}
</div>
