<script lang="ts">
	import type { Consumption } from '$lib/types';
	import * as Card from '$lib/components/ui/card/index.js';

	let { tableRows }: { tableRows: Consumption[] } = $props();
</script>

<Card.Root>
	<Card.Header>MILEAGE DATA</Card.Header>
	<Card.Content>
		{#if tableRows.length === 0}
			<h6>No Data...</h6>
		{:else}
			<div class="overflow-x-auto px-4 py-4">
				<table class="w-full table-auto">
					<thead class="border-b-2 border-black font-bold dark:border-white">
						<tr class="text-left">
							<th>Date</th>
							<th>Miles/Gallon</th>
							<th>Price/Gallon</th>
							<th>Notes</th>
						</tr>
					</thead>
					<tbody>
						{#each tableRows as row}
							<tr
								class="300 border-b border-gray-500 text-left text-sm font-normal transition duration-300 ease-in-out hover:bg-gray-500"
							>
								<td>{new Date(row.created).toISOString().split('T')[0]}</td>
								<td>{row.miles_per_gallon.toFixed(2)}</td>
								<td>${row.price_per_gallon.toFixed(2)}</td>
								<td>{row.notes === null ? '' : row.notes}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
