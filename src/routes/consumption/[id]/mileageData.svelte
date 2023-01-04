<script lang="ts">
	interface row {
		date: string;
		miles_per_gallon: number;
		price_per_gallon: number;
		notes: string;
	}
	export let tableRows: [row];
</script>

<div class="card">
	<div class="card-header card-header-purple">Mileage Data</div>
	<div class="px-4 py-4">
		<table class="w-full">
			<thead class="border-b-2 border-white font-bold text-slate-100">
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
						class="text-left transition duration-300 ease-in-out font-normal hover:bg-gray-500 border-b border-gray-500 text-slate-300"
					>
						<td>{new Date(row.date).toISOString().split('T')[0]}</td>
						<td>{row.miles_per_gallon.toFixed(2)}</td>
						<td>${row.price_per_gallon.toFixed(2)}</td>
						<td>{row.notes === null ? '' : row.notes}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
