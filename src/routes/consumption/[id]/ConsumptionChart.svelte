<script lang="ts">
	import { browser } from '$app/environment';
	import type { ConsumptionType } from '$lib/types.ts.bak';
	import { Button } from '$lib/components/ui/button';
	import { mode } from 'mode-watcher';
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
		type ChartData,
		type ChartItem,
		type ChartOptions
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

	const { chartData }: { chartData: ConsumptionType[] } = $props();

	let selectedChart = $state<'mpg' | 'ppg'>('mpg');

	let myCanvas = $state<ChartItem>();
	let myChart: Chart | undefined;

	function isDarkTheme() {
		return browser ? document.documentElement.classList.contains('dark') : $mode === 'dark';
	}

	const chartTypes: ChartTypes = {
		ppg: {
			label: 'Price Per Gallon',
			datapoint: 'pricePerGallon',
			radius: 0,
			fill: true
		},
		mpg: {
			label: 'Miles Per Gallon',
			datapoint: 'milesPerGallon',
			radius: 5,
			fill: false
		}
	};

	function getChartOptions(isDark: boolean): ChartOptions<'line'> {
		const fontColor = isDark ? '#e2e8f0' : '#334155';
		const gridColor = isDark ? '#334155' : '#cbd5e1';

		return {
			responsive: true,
			maintainAspectRatio: false,
			interaction: {
				mode: 'index',
				intersect: false
			},
			plugins: {
				legend: {
					display: false,
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
						color: gridColor
					}
				}
			}
		};
	}

	let data = $derived<ChartData<'line'>>({
		labels: chartData.map((o) => new Date(o._creationTime).toISOString().split('T')[0]).reverse(),
		datasets: [
			{
				label: chartTypes[selectedChart].label,
				data: chartData
					.map((o: ConsumptionType) =>
						parseFloat((o as any)[chartTypes[selectedChart].datapoint].toFixed(2))
					)
					.reverse(),
				backgroundColor: 'rgba(236, 72, 153, 0.28)',
				borderColor: '#ec4899',
				borderWidth: 2,
				fill: chartTypes[selectedChart].fill,
				pointRadius: chartTypes[selectedChart].radius
			}
		]
	});

	$effect(() => {
		$mode;
		if (chartData.length != 0) {
			const darkMode = isDarkTheme();
			if (myChart) {
				myChart.destroy();
			}

			myChart = new Chart(myCanvas!, {
				type: 'line',
				data,
				options: getChartOptions(darkMode)
			});
		}

		return () => myChart?.destroy();
	});
</script>

<div class="border-border/70 bg-muted/35 relative rounded border p-3 sm:p-4 dark:bg-slate-800/80">
	<div class="mb-3 flex flex-wrap gap-2">
		<Button
			variant={selectedChart === 'mpg' ? 'default' : 'outline'}
			size="sm"
			onclick={() => (selectedChart = 'mpg')}
		>
			Miles / Gallon
		</Button>
		<Button
			variant={selectedChart === 'ppg' ? 'default' : 'outline'}
			size="sm"
			onclick={() => (selectedChart = 'ppg')}
		>
			Price / Gallon
		</Button>
	</div>
	<div class="relative h-72 w-full sm:h-80">
		{#if chartData.length === 0}
			<h6 class="text-muted-foreground pt-8 text-center">No Chart Data...</h6>
		{:else}
			<canvas bind:this={myCanvas}></canvas>
		{/if}
	</div>
</div>
