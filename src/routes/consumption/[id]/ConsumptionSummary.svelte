<script lang="ts">
	import type { Summary } from '$lib/types';
	import SummaryItem from './SummaryItem.svelte';
	import * as Card from '$lib/components/ui/card/index.js';

	let { summary }: { summary: Summary } = $props();

	const roundTwoDecimals = {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	};
	const roundZeroDecimals = {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	};
</script>

<Card.Root>
	<Card.Header>SUMMARY</Card.Header>
	<Card.Content>
		{#if summary.total_miles === null}
			<h6>No Summary Data...</h6>
		{:else}
			<div class="text-center">
				<SummaryItem
					key="Total Miles"
					value={summary.total_miles.toLocaleString(undefined, roundZeroDecimals)}
				/>
				<SummaryItem
					key="Total Cost:"
					value={'$' + summary.total_price.toLocaleString(undefined, roundZeroDecimals)}
				/>
				<SummaryItem
					key="Total Miles per Gallon:"
					value={summary.total_miles_per_gallon.toLocaleString(undefined, roundTwoDecimals)}
				/>
				<SummaryItem
					key="Total Cost per Gallon:"
					value={'$' + summary.total_price_per_gallon.toLocaleString(undefined, roundTwoDecimals)}
				/>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
