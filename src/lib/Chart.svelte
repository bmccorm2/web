<script lang="ts">
	import { Chart, type ChartConfiguration, type ChartType } from 'chart.js';
	import { onDestroy } from 'svelte';
	import {
		Tooltip,
		Legend,
		LineElement,
		BarElement,
		ArcElement,
		CategoryScale,
		LinearScale,
		PointElement,
		LineController,
		BarController,
		DoughnutController,
		Filler
	} from 'chart.js';

	Chart.register(
		Tooltip,
		Legend,
		LineElement,
		BarElement,
		ArcElement,
		CategoryScale,
		LinearScale,
		PointElement,
		LineController,
		BarController,
		DoughnutController,
		Filler,
		// inline plugin: red dashed vertical line at age 60
		{
			id: 'age60line',
			afterDraw(chart) {
				const labels = chart.data.labels as number[];
				const xAxis = chart.scales['x'];
				const yAxis = chart.scales['y'];
				if (!labels || !xAxis || !yAxis) return;
				const idx = labels.indexOf(60);
				if (idx === -1) return;
				const x = xAxis.getPixelForValue(idx);
				const ctx = chart.ctx;
				ctx.save();
				ctx.beginPath();
				ctx.moveTo(x, yAxis.top);
				ctx.lineTo(x, yAxis.bottom);
				ctx.strokeStyle = 'rgba(239,68,68,0.85)';
				ctx.lineWidth = 2;
				ctx.setLineDash([6, 3]);
				ctx.stroke();
				ctx.font = '11px sans-serif';
				ctx.fillStyle = 'rgba(239,68,68,0.85)';
				ctx.fillText('Age 60', x + 4, yAxis.top + 14);
				ctx.restore();
			}
		}
	);

	let { config, height = 260 }: { config: ChartConfiguration; height?: number } = $props();

	let canvas: HTMLCanvasElement;
	let chart: Chart<ChartType> | undefined;

	// ponytail: recreate on config change. $effect runs after canvas is bound,
	// so no separate onMount needed.
	$effect(() => {
		config;
		chart?.destroy();
		chart = new Chart(canvas, config as never);
	});

	onDestroy(() => chart?.destroy());
</script>

<div class="relative w-full" style="height: {height}px">
	<canvas bind:this={canvas}></canvas>
</div>
