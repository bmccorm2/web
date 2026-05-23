<script lang="ts">
	import type { ConsumptionType } from '$lib/types.ts.bak';
	import { Badge } from '$lib/components/ui/badge/index';
	import * as Card from '$lib/components/ui/card/index.js';

	let {
		tableRows,
		averageMpg
	}: {
		tableRows: ConsumptionType[];
		averageMpg: number;
	} = $props();

	const dateFormatter = new Intl.DateTimeFormat('en-US', {
		month: 'short',
		day: '2-digit',
		year: 'numeric'
	});
</script>

<Card.Root>
	<Card.Header class="text-sm tracking-wide text-white/95">MILEAGE DATA</Card.Header>
	<Card.Content>
		{#if tableRows.length === 0}
			<h6>No Data...</h6>
		{:else}
			<div class="overflow-x-auto">
				<table class="text-foreground w-full table-auto text-xs sm:text-sm">
					<thead
						class="border-border text-muted-foreground border-b text-left text-xs tracking-wide uppercase"
					>
						<tr class="text-left">
							<th class="px-2 py-1.5">Date</th>
							<th class="px-2 py-1.5">Miles/Gallon</th>
							<th class="px-2 py-1.5">Price/Gallon</th>
							<th class="px-2 py-1.5">Performance</th>
							<th class="px-2 py-1.5">Notes</th>
						</tr>
					</thead>
					<tbody>
						{#each tableRows.slice(0, 5) as row}
							{@const aboveAverage = row.milesPerGallon >= averageMpg}
							<tr
								class="border-border/70 hover:bg-muted/50 border-b text-left font-normal transition duration-200 ease-in-out"
							>
								<td class="px-2 py-1.5 whitespace-nowrap">
									{dateFormatter.format(new Date(row._creationTime))}
								</td>
								<td class="px-2 py-1.5 font-medium">
									{row.milesPerGallon?.toFixed(2)}
								</td>
								<td class="px-2 py-1.5">${row.pricePerGallon?.toFixed(2)}</td>
								<td class="px-2 py-1.5">
									<Badge
										class={aboveAverage
											? 'border-emerald-500/35 bg-emerald-500/12 !text-emerald-700 dark:!text-emerald-300'
											: 'border-rose-500/35 bg-rose-500/12 !text-rose-700 dark:!text-rose-300'}
									>
										{aboveAverage ? 'Above Avg MPG' : 'Below Avg MPG'}
									</Badge>
								</td>
								<td class="text-muted-foreground max-w-56 px-2 py-1.5">
									{row.notes || '-'}
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			{#if tableRows.length > 5}
				<p class="text-muted-foreground mt-2 text-xs">Showing 5 most recent records.</p>
			{/if}
		{/if}
	</Card.Content>
</Card.Root>
