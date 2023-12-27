<script lang="ts">
  import Card from "$lib/Card.svelte";
  import SummaryItem from "./SummaryItem.svelte";

  interface summary {
    total_miles: number;
    total_price: number;
    total_miles_per_gallon: number;
    total_price_per_gallon: number;
  }

  export let summary: summary;
  const roundTwoDecimals = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  };
  const roundZeroDecimals = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };
</script>

<Card header="summary">
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
        value={"$" +
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
        value={"$" +
          summary.total_price_per_gallon.toLocaleString(
            undefined,
            roundTwoDecimals
          )}
      />
    </div>
  {/if}
</Card>
