<script lang="ts">
  import CarSource from "$lib/CarSource.svelte";
  import type { PageServerData } from "./$types";
  import CarChart from "./CarChart.svelte";

  let { data }: { data: PageServerData } = $props();
  const { cars, carDetails } = data;
</script>

<svelte:head>
  <title>Cars</title>
  <meta name="description" content="price to mileage charting" />
</svelte:head>

<CarSource {cars} />
<!-- <CarChart chartData={carDetails} /> -->
