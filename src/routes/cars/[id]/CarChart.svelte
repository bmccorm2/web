<!-- @migration-task Error while migrating Svelte code: Identifier 'chartData' has already been declared -->
<!-- <script lang="ts">
  import {
    Chart,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    ScatterController,
  } from "chart.js";

  Chart.register(
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    ScatterController,
  );

  interface chartData {
    x: number;
    y: number;
    price: number;
    miles: number;
    url: string;
    displayName: string;
    year: number;
    effectiveDate: string;
    distance: number;
  }

  export let chartData: Array<chartData>;
  let chart: any;
  let price: number;
  let url: string;
  let displayName: string;
  let year: number;
  let miles: number;
  let distance: number;
  let effectiveDate: string;
  let isSelected = false;

  const colors = ["maroon", "blue", "green", "orange", "purple", "pink"];
  const years = [...new Set(chartData.map((o) => o.year))];

  const options = {
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
  };

  $: data = {
    datasets: years.map((year, index) => {
      return {
        label: year.toString(),
        backgroundColor: colors[index],
        data: chartData
          .filter((o) => o.year === year)
          .map((o) => {
            return {
              x: o.price,
              y: o.miles,
              price: o.price,
              miles: o.miles,
              url: o.url,
              displayName: o.displayName,
              year: o.year,
              effectiveDate: new Date(o.effectiveDate)
                .toISOString()
                .split("T")[0],
              distance: o.distance,
            };
          }),
        radius: 8,
      };
    }),
  };

  const handleClick = (e: any) => {
    if (!chart) return;
    const points = chart.getElementsAtEventForMode(chart, e);
    if (!points.length) return;
    isSelected = true;

    const firstPoint = points[0];
    const value: any =
      chart.data.datasets[firstPoint.datasetIndex].data[firstPoint.index];
    ({ price, miles, url, displayName, year, effectiveDate } = value);
  };
</script>
 -->
<div class="col-12" class:smallChart={isSelected}>
  <!-- <Chart bind:chart type="scatter" on:click={handleClick} {data} {options} /> -->
</div>
<div class:hideDetails={!isSelected} class="col-3">
  <div class="card">
    <div class="card-header text-center-fs-4">Details</div>
  </div>
  <div class="card-body">
    <p class="fw-bolder">
      <a href={url} target="_blank" rel="noopener noreferrer">
        {displayName}
      </a>
    </p>
    <p class="bold">
      <small>Price:</small>&nbsp;
      {price ? "$" + price.toLocaleString() : ""}
    </p>
    <p class="bold">
      <small>Miles:</small>&nbsp;
      {miles ? miles.toLocaleString() : ""}
    </p>
    <p class="bold">
      <small>Year:</small>
      {year}
    </p>
    <p class="bold">
      <small>Distance (mi):</small>&nbsp;
      {distance ? distance.toLocaleString() : ""}
    </p>
    <p class="bold">
      <small>Last Updated:</small>&nbsp;
      {effectiveDate}
    </p>
  </div>
</div>

<style>
  .hideDetails {
    display: none;
  }
  .smallChart {
    width: 75%;
  }
  .bold {
    font-weight: bolder;
  }
</style>
