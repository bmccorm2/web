<script lang="ts">
  import "iconify-icon";
  import { userRating } from "$lib/stores";
</script>

{#each [1, 2, 3, 4, 5] as star}
  <button type="button" on:click={() => userRating.set(star)}>
    <iconify-icon
      icon="solar:star-bold"
      width="32"
      class:marked={star <= $userRating}
    />
  </button>
{/each}

<style>
  .marked {
    color: gold;
  }
</style>
