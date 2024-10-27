<script lang="ts">
	import type { Consumption } from '$lib/types';
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
		type ChartItem
	} from 'chart.js';

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

	type ChartType = {
		label: string;
		datapoint: string;
		radius: number;
		fill: boolean;
	};
	type ChartTypes = {
		[key: string]: ChartType;
	};

	const {
		chartData,
		selectedChart
	}: {
		chartData: Consumption[];
		selectedChart: string;
	} = $props();

	let myCanvas = $state<ChartItem>();
	let myChart: Chart;

	const fontColor = '#e2e8f0'; //slate-200

	const chartTypes: ChartTypes = {
		ppg: {
			label: 'Price Per Gallon',
			datapoint: 'price_per_gallon',
			radius: 0,
			fill: true
		},
		mpg: {
			label: 'Miles Per Gallon',
			datapoint: 'miles_per_gallon',
			radius: 5,
			fill: false
		}
	};

	const options: any = {
		responsive: true,
		maintainAspectRatio: false,
		interaction: {
			mode: 'index',
			intersect: false
		},
		plugins: {
			legend: {
				labels: {
					color: fontColor
				}
			}
		},
		scales: {
			x: {
				ticks: {
					color: fontColor
				},
				grid: {
					display: false
				}
			},
			y: {
				type: 'linear',
				ticks: {
					color: fontColor
				},
				grid: {
					color: '#334155'
				}
			}
		}
	};

	let data = $derived({
		labels: chartData.map((o) => new Date(o.created).toISOString().split('T')[0]).reverse(),
		datasets: [
			{
				label: chartTypes[selectedChart].label,
				data: chartData
					.map((o: Consumption) =>
						parseFloat((o as any)[chartTypes[selectedChart].datapoint].toFixed(2))
					)
					.reverse(),
				backgroundColor: '#3b82f6', //blue-500
				// backgroundColor: "#6d28d9", //violet-700
				borderColor: fontColor,
				fill: chartTypes[selectedChart].fill,
				radius: chartTypes[selectedChart].radius
			}
		]
	});

	$effect(() => {
		if (chartData.length != 0) {
			if (myChart) myChart.destroy();

			myChart = new Chart(myCanvas!, {
				type: 'line',
				data,
				options
			});
		}
	});
</script>

<div class="relative h-80 w-full rounded bg-slate-800">
	{#if chartData.length === 0}
		<h6>No Chart Data...</h6>
	{:else}
		<canvas bind:this={myCanvas}></canvas>
	{/if}
</div>
