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

<CarSource cars={data.cars} />
<div class="mb-2 gap-4 md:flex">
   <div class="mb-2 md:mb-0 md:basis-4/12">
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
