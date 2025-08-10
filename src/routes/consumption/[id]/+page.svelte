<script lang="ts">
	import { useQuery } from 'convex-svelte';
	import { api } from '../../../convex/_generated/api';
	import CarSource from '$lib/CarSource.svelte';
	import ConsumptionChart from './ConsumptionChart.svelte';
	import ConsumptionSummary from './ConsumptionSummary.svelte';
	import MileageData from './MileageData.svelte';
	import { page } from '$app/state';
	import type { Id } from '../../../convex/_generated/dataModel';

	const cars = useQuery(api.cars.getOwnedCars, {});
	const consumption = $derived(
		useQuery(api.consumption.byCar, { carId: page.params.id as Id<'Cars'> })
	);
	const CHART_DATA_ROWS = 9;
</script>

<svelte:head>
	<title>Consumption</title>
	<meta name="description" content="automobile consumption" />
</svelte:head>

<div class="md:gap my-2 text-center md:flex md:items-center md:justify-center">
	{#if cars.isLoading}
		<p>Loading Cars...</p>
	{:else if cars.error}
		<p>Error Loading Cars.</p>
	{:else}
		<CarSource cars={cars.data} />
	{/if}
</div>

{#if consumption.isLoading}
	<div class="mb-4 gap-4 md:flex md:justify-center">
		<p>Loading data...</p>
	</div>
{:else if consumption.error}
	<div class="mb-4 gap-4 md:flex md:justify-center">
		<p>Error Loading Data.</p>
	</div>
{:else}
	<div class="mb-4 gap-4 md:flex">
		<div class="mb-2 md:mb-0 md:basis-4/12">
			<ConsumptionSummary summary={consumption.data.summary} />
		</div>
		<div class="md:w-8/12">
			<MileageData tableRows={consumption.data.data.slice(0, CHART_DATA_ROWS)} />
		</div>
	</div>
	<div class="hidden md:inline">
		<ConsumptionChart chartData={consumption.data.data} selectedChart="mpg" />
		<br />
		<ConsumptionChart chartData={consumption.data.data} selectedChart="ppg" />
	</div>
{/if}
