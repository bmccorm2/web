<script lang="ts">
	import CarSource from '$lib/CarSource.svelte';
	import type { PageServerData } from './$types';
	import CarChart from './CarChart.svelte';

	export let data: PageServerData;
	const { cars, carDetails } = data;
</script>

<div class="container mx-auto">
	<CarSource {cars} />
	<CarChart chartData={carDetails} />
</div>
