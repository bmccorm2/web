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

	ChartJS.register(Tooltip, Legend, LineElement, LinearScale, PointElement, CategoryScale);

	interface chartData {
		date: string;
		miles_per_gallon: number;
		price_per_gallon: number;
	}

	export let chartData: [chartData];

	const options: any = {
		responsive: true,
		interaction: {
			mode: 'index',
			intersect: false
		},
		plugins: {
			legend: {
				labels: {
					color: 'white'
				}
			}
		},
		scales: {
			right: {
				type: 'linear',
				position: 'right',
				grid: {
					drawOnChartArea: false
				}
			},
			left: {
				type: 'linear',
				position: 'left'
			}
		}
	};

	$: data = {
		labels: chartData.map((o) => new Date(o.date).toISOString().split('T')[0]).reverse(),
		datasets: [
			{
				label: 'Miles Per Gallon',
				data: chartData.map((o) => parseFloat(o.miles_per_gallon.toFixed(2))).reverse(),
				yAxisID: 'right',
				backgroundColor: 'blue',
				borderColor: 'lightblue',
				fill: false,
				radius: 7
			},
			{
				label: 'Price Per Gallon',
				data: chartData.map((o) => parseFloat(o.price_per_gallon.toFixed(2))).reverse(),
				yAxisID: 'left',
				backgroundColor: 'green',
				borderColor: 'lightgreen',
				fill: false,
				radius: 7
			}
		]
	};
</script>

<Line {data} {options} />
