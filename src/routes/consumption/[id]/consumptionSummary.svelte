<script lang="ts">
	import SummaryItem from './SummaryItem.svelte';

	interface summary {
		total_miles: number;
		total_price: number;
		total_miles_per_gallon: number;
		total_price_per_gallon: number;
	}

	export let summary: summary;
	const roundTwoDecimals = {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	};
	const roundZeroDecimals = {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	};
</script>

<div class="card">
	<div class="card-header card-header-rose">Summary</div>
	<div class="text-center">
		<SummaryItem
			key="Total Miles"
			value={summary.total_miles.toLocaleString(undefined, roundZeroDecimals)}
		/>
		<SummaryItem
			key="Total Cost:"
			value={'$' +
				summary.total_price.toLocaleString(undefined, roundZeroDecimals)}
		/>
		<SummaryItem
			key="Total Miles per Gallon:"
			value={summary.total_miles_per_gallon.toLocaleString(
				undefined,
				roundTwoDecimals
			)}
		/>
		<SummaryItem
			key="Total Cost per Gallon:"
			value={'$' +
				summary.total_price_per_gallon.toLocaleString(
					undefined,
					roundTwoDecimals
				)}
		/>
	</div>
</div>
