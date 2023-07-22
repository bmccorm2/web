<script lang="ts">
	import CarSource from "$lib/CarSource.svelte";
	import ConsumptionChart from "./ConsumptionChart.svelte";
	import ConsumptionSummary from "./ConsumptionSummary.svelte";
	import MileageData from "./MileageData.svelte";

	export let data;
</script>

<svelte:head>
	<title>Consumption</title>
	<meta name="description" content="automobile consumption" />
</svelte:head>

<div class="container mx-auto">
	<CarSource cars={data.cars} />
	<div class="md:flex gap-4 mb-2">
		<div class="md:basis-4/12">
			<ConsumptionSummary summary={data.summary} />
		</div>
		<div class="md:basis-8/12">
			<MileageData tableRows={data.consumption.slice(0, 7)} />
		</div>
	</div>
	<div class="hidden md:inline">
		<ConsumptionChart chartData={data.consumption} selectedChart="mpg" />
		<br />
		<ConsumptionChart chartData={data.consumption} selectedChart="ppg" />
	</div>
</div>
