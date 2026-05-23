<script lang="ts">
	import { useQuery } from 'convex-svelte';
	import { api } from '../../../convex/_generated/api';
	import CarSource from '$lib/CarSource.svelte';
	import ConsumptionChart from './ConsumptionChart.svelte';
	import ConsumptionSummary from './ConsumptionSummary.svelte';
	import MileageData from './MileageData.svelte';
	import { Plus } from 'lucide-svelte';
	import { page } from '$app/state';
	import type { Id } from '../../../convex/_generated/dataModel';
	import { Button } from '$lib/components/ui/button';

	const carId = $derived(page.params.id as Id<'Cars'>);
	const cars = useQuery(api.cars.getOwnedCars, {});

	const consumption = $derived(useQuery(api.consumption.byCar, { carId }));
	const CHART_DATA_ROWS = 9;
</script>

<svelte:head>
	<title>Consumption</title>
	<meta name="description" content="automobile consumption" />
</svelte:head>

<!-- Floating Add Record Button -->
<div class="fixed right-4 bottom-6 z-50 md:right-8">
	<Button
		variant="default"
		href={`/consumption/input/${carId}`}
		size="icon"
		class="h-14 w-14 rounded-full bg-pink-600 text-white shadow-lg shadow-pink-950/30 hover:bg-pink-700"
		aria-label="Add consumption record"
	>
		<Plus class="h-6 w-6" />
	</Button>
</div>

<div class="md:gap my-2 text-center md:flex md:items-center md:justify-center">
	{#if cars.isLoading}
		<p>Loading Cars...</p>
	{:else if cars.error}
		<p class="font-bold text-red-500">Error Loading Cars.</p>
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
		<p class="font-bold text-red-500">Error Loading Data.</p>
	</div>
{:else}
	<div class="mb-4 gap-4 md:flex">
		<div class="mb-2 md:mb-0 md:basis-4/12">
			<ConsumptionSummary summary={consumption.data.summary} />
		</div>
		<div class="md:w-8/12">
			<MileageData
				tableRows={consumption.data.data.slice(0, CHART_DATA_ROWS)}
				averageMpg={consumption.data.summary.milesPerGallon}
			/>
		</div>
	</div>
	<div>
		<ConsumptionChart chartData={consumption.data.data} />
	</div>
{/if}
