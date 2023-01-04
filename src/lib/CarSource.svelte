<script lang="ts">
	interface car {
		id: number;
		displayName: string;
	}

	export let cars: [car];
</script>

<div class="text-center my-2">
	{#each cars as { id, displayName }}
		<a
			href="/consumption/{id}"
			class="text-teal-600 text-xl font-bold underline px-3 hover:text-blue-600"
			>{displayName}</a
		>
	{/each}
</div>
