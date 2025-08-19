<script lang="ts">
	import type { Summary } from '$lib/types.ts.bak';
	import SummaryItem from './SummaryItem.svelte';
	import * as Card from '$lib/components/ui/card/index.js';

	const { summary }: { summary: Summary } = $props();

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
		{#if summary.totalMiles === null}
			<h6>No Summary Data...</h6>
		{:else}
			<div class="text-center">
				<SummaryItem
					key="Total Miles"
					value={summary.totalMiles.toLocaleString(undefined, roundZeroDecimals)}
				/>
				<SummaryItem
					key="Total Cost:"
					value={'$' + summary.totalPrice.toLocaleString(undefined, roundZeroDecimals)}
				/>
				<SummaryItem
					key="Total Miles per Gallon:"
					value={summary.milesPerGallon.toLocaleString(undefined, roundTwoDecimals)}
				/>
				<SummaryItem
					key="Total Cost per Gallon:"
					value={'$' + summary.pricePerGallon.toLocaleString(undefined, roundTwoDecimals)}
				/>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
