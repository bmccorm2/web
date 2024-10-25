<!-- @migration-task Error while migrating Svelte code: Can't migrate code with afterUpdate. Please migrate by hand. -->
<script lang='ts'>
  import * as Plot from "@observablehq/plot";
	import { afterUpdate  } from "svelte";

   export let chartData: [];

   let chart: HTMLDivElement

   const yValue = 'price_per_gallon'
   const xValue = 'date'
   const colorVariants = {
    bg: '#27272a',
    tip: '#3f3f46',
    areaFill: '#0284c7'
   }

   afterUpdate(() => {
    chart.innerHTML = ''
    const myPlot = Plot.plot({
      color: {
        legend: true  
      },
      y: {grid: true, label: 'Price Per Gallon'},
      marks: [
        Plot.ruleY([0]),
        Plot.areaY(chartData, {x: (d) => new Date(d.date), y: yValue, fill: colorVariants.areaFill}),
        Plot.lineY(chartData, {x: (d) => new Date(d.date), y: yValue}),
        Plot.tip(chartData, Plot.pointerX({x: (d) => new Date(d.date), y: yValue, fill: colorVariants.tip})),
      ],
      style: {
        background: colorVariants.bg,
      }
      
    })

    chart.append(myPlot)
   })
</script>

<div bind:this={chart}></div>

