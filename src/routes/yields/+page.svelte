<script lang="ts">
   import YieldChart from "./YieldChart.svelte";

   export let data;
   $: ({ yields } = data);
</script>

<svelte:head>
   <title>Yields</title>
   <meta name="description" content="US treasury yield curve" />
</svelte:head>

<YieldChart chartData={yields} />
