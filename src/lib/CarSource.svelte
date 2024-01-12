<script lang="ts">
  import type { Cars } from "./types";
  import { page } from "$app/stores";

  export let cars: Cars[];
</script>

<div class="text-center my-2">
  {#each cars as car}
    <a
      href="/consumption/{car.id}"
      class={`text-pink-600 text-xl font-bold px-3
      ${
        parseInt($page.params.id) === car.id
          ? "opacity-100 underline"
          : "opacity-60"
      }
      `}>{car.displayName}</a
    >
  {/each}
</div>
