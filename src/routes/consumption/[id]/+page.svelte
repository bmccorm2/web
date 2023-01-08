<script lang="ts">
	import CarSource from '$lib/CarSource.svelte';
	import MileageData from './mileageData.svelte';
	import ConsumptionSummary from './consumptionSummary.svelte';
	import ConsumptionChart from './consumptionChart.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	$: ({ cars, consumption, summary } = data);
</script>

<svelte:head>
	<title>Consumption</title>
	<meta name="description" content="automobile consumption" />
</svelte:head>

<div class="container mx-auto">
	<CarSource {cars} />
	<div class="md:flex gap-4 mb-2">
		<div class="md:basis-4/12">
			<ConsumptionSummary {summary} />
		</div>
		<div class="md:basis-8/12">
			<MileageData tableRows={consumption.slice(0, 7)} />
		</div>
	</div>
	<ConsumptionChart chartData={consumption} />
</div>
