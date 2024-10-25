<script lang="ts">
   import { userRating } from "$lib/stores";
   import { Star } from "lucide-svelte";

   function handleRating(rating: number) {
      userRating.set(rating);
   }
</script>

{#each [1, 2, 3, 4, 5] as star}
   <button type="button" onclick={() => handleRating(star)}>
      <Star
         size={32}
         strokeWidth={0}
         fill={star <= $userRating ? "gold" : ""}
      />
   </button>
{/each}
<input hidden type="number" name="rating" value={$userRating} />
