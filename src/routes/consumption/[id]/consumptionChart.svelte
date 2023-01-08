<script lang="ts">
	import { Line } from 'svelte-chartjs';
	import {
		Chart as ChartJS,
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale
	} from 'chart.js';

	ChartJS.register(
		Tooltip,
		Legend,
		LineElement,
		LinearScale,
		PointElement,
		CategoryScale
	);

	interface chartData {
		date: string;
		miles_per_gallon: number;
		price_per_gallon: number;
	}

	export let chartData: [chartData];

	const fontColor = '#e2e8f0';

	const options: any = {
		responsive: true,
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
				}
			},
			right: {
				type: 'linear',
				position: 'right',
				ticks: {
					color: fontColor
				},
				grid: {
					display: false
				}
			},
			left: {
				type: 'linear',
				position: 'left',
				ticks: {
					color: fontColor
				},
				grid: {
					display: false
				}
			}
		}
	};

	$: data = {
		labels: chartData
			.map((o) => new Date(o.date).toISOString().split('T')[0])
			.reverse(),
		datasets: [
			{
				label: 'Miles Per Gallon',
				data: chartData
					.map((o) => parseFloat(o.miles_per_gallon.toFixed(2)))
					.reverse(),
				yAxisID: 'right',
				backgroundColor: 'blue',
				borderColor: 'lightblue',
				fill: false,
				radius: 7
			},
			{
				label: 'Price Per Gallon',
				data: chartData
					.map((o) => parseFloat(o.price_per_gallon.toFixed(2)))
					.reverse(),
				yAxisID: 'left',
				backgroundColor: 'green',
				borderColor: 'lightgreen',
				fill: false,
				radius: 7
			}
		]
	};
</script>

<div class="bg-slate-800 rounded">
	<Line {data} {options} />
</div>
