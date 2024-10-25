<script lang="ts">
  import Card from "$lib/Card.svelte";
  import type { Consumption } from "$lib/types";

  interface Props {
    tableRows: Consumption[];
  }

  let { tableRows }: Props = $props();
</script>

<Card header="mileage data">
  {#if tableRows.length === 0}
    <h6>No Data...</h6>
  {:else}
    <div class="px-4 py-4 overflow-x-auto">
      <table class="w-full table-auto">
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
              class="text-left text-sm transition duration-300 ease-in-out font-normal hover:bg-gray-500 border-b border-gray-500 text-slate-300"
            >
              <td>{new Date(row.created).toISOString().split("T")[0]}</td>
              <td>{row.miles_per_gallon.toFixed(2)}</td>
              <td>${row.price_per_gallon.toFixed(2)}</td>
              <td>{row.notes === null ? "" : row.notes}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</Card>
