<script lang="ts">
  import {
    Chart,
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    LineController,
    Filler,
  } from "chart.js";
  import { afterUpdate } from "svelte";

  Chart.register(
    Tooltip,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    CategoryScale,
    LineController,
    Filler
  );

  type ChartData = {
    date: string;
    miles_per_gallon: number;
    price_per_gallon: number;
  }[];
  type ChartType = {
    label: string;
    datapoint: string;
    radius: number;
    fill: boolean;
  };
  type ChartTypes = {
    [key: string]: ChartType;
  };

  export let chartData: ChartData;
  export let selectedChart: string;

  let myCanvas: HTMLCanvasElement;
  let myChart: Chart;

  const fontColor = "#e2e8f0"; //slate-200

  const chartTypes: ChartTypes = {
    ppg: {
      label: "Price Per Gallon",
      datapoint: "price_per_gallon",
      radius: 0,
      fill: true,
    },
    mpg: {
      label: "Miles Per Gallon",
      datapoint: "miles_per_gallon",
      radius: 5,
      fill: false,
    },
  };

  const options: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false,
    },
    plugins: {
      legend: {
        labels: {
          color: fontColor,
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: fontColor,
        },
        grid: {
          display: false,
        },
      },
      y: {
        type: "linear",
        ticks: {
          color: fontColor,
        },
        grid: {
          color: "#334155",
        },
      },
    },
  };

  $: data = {
    labels: chartData
      .map((o) => new Date(o.date).toISOString().split("T")[0])
      .reverse(),
    datasets: [
      {
        label: chartTypes[selectedChart].label,
        data: chartData
          .map((o) =>
            parseFloat(o[chartTypes[selectedChart].datapoint].toFixed(2))
          )
          .reverse(),
        backgroundColor: "#6d28d9", //violet-700
        borderColor: fontColor,
        fill: chartTypes[selectedChart].fill,
        radius: chartTypes[selectedChart].radius,
      },
    ],
  };

  afterUpdate(() => {
    if (chartData.length != 0) {
      if (myChart) myChart.destroy();

      myChart = new Chart(myCanvas, {
        type: "line",
        data,
        options,
      });
    }
  });
</script>

<div class="bg-slate-800 rounded relative w-full h-80">
  {#if chartData.length === 0}
    <h6>No Chart Data...</h6>
  {:else}
    <canvas bind:this={myCanvas} />
  {/if}
</div>
