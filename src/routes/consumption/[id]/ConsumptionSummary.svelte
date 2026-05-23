<script lang="ts">
	import type { Summary } from '$lib/types.ts.bak';
	import { DollarSign, Fuel, Gauge, Milestone } from 'lucide-svelte';
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
	<Card.Header class="text-sm tracking-wide text-white/95">SUMMARY</Card.Header>
	<Card.Content class="py-4">
		{#if summary.totalMiles === null}
			<h6>No Summary Data...</h6>
		{:else}
			<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div class="bg-muted/40 border-border/70 min-h-[7.5rem] rounded-lg border p-4">
					<div class="text-muted-foreground mb-3 flex items-center gap-2 text-xs tracking-wide">
						<Milestone class="h-4 w-4" />
						<span>Total Miles</span>
					</div>
					<div class="text-foreground text-2xl font-semibold">
						{summary.totalMiles.toLocaleString(undefined, roundZeroDecimals)}
					</div>
				</div>
				<div class="bg-muted/40 border-border/70 min-h-[7.5rem] rounded-lg border p-4">
					<div class="text-muted-foreground mb-3 flex items-center gap-2 text-xs tracking-wide">
						<DollarSign class="h-4 w-4" />
						<span>Total Cost</span>
					</div>
					<div class="text-foreground text-2xl font-semibold">
						${summary.totalPrice.toLocaleString(undefined, roundZeroDecimals)}
					</div>
				</div>
				<div class="bg-muted/40 border-border/70 min-h-[7.5rem] rounded-lg border p-4">
					<div class="text-muted-foreground mb-3 flex items-center gap-2 text-xs tracking-wide">
						<Gauge class="h-4 w-4" />
						<span>Average MPG</span>
					</div>
					<div class="text-foreground text-2xl font-semibold">
						{summary.milesPerGallon.toLocaleString(undefined, roundTwoDecimals)}
					</div>
				</div>
				<div class="bg-muted/40 border-border/70 min-h-[7.5rem] rounded-lg border p-4">
					<div class="text-muted-foreground mb-3 flex items-center gap-2 text-xs tracking-wide">
						<Fuel class="h-4 w-4" />
						<span>Average Price/Gallon</span>
					</div>
					<div class="text-foreground text-2xl font-semibold">
						${summary.pricePerGallon.toLocaleString(undefined, roundTwoDecimals)}
					</div>
				</div>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
