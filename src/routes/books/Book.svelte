<script lang="ts">
  import type { Book } from "$lib/types";
  import { Star, PencilLine, Trash2 } from "lucide-svelte";

  export let bookDetails: Book;

  const { title, author, rating, pages, isFiction, id, review } = bookDetails;
</script>

<div
  class="mb-2 rounded-lg border-2 border-teal-500 dark:bg-slate-800 p-4 md:mb-0"
>
  <div class="mb-2 flex justify-between">
    <div class="flex content-center gap-3">
      <!-- TITLE -->
      <div class="text-3xl font-bold underline">{title}</div>
    </div>
    <!-- ACTIONS -->
    <div class="flex gap-3">
      <a href="books/modify/{id}">
        <PencilLine class="h-4- w-4" />
      </a>
      <form action="?/deleteBook" method="post">
        <input type="hidden" name="id" value={id} />
        <button>
          <Trash2 class="h-4- w-4" />
        </button>
      </form>
    </div>
  </div>
  <!-- AUTHOR/PAGES/FICTION -->
  <div class="mb-2 flex justify-between">
    <div class="self-center text-xs text-slate-400">By {author}</div>
    <div class="flex gap-4">
      <div class="self-center rounded-full bg-blue-700 px-2 py-1 text-xs">
        {pages} pages
      </div>
      <div class="self-center rounded-full bg-gray-500 px-2 py-1 text-xs">
        {isFiction ? "Fiction" : "Non-Fiction"}
      </div>
    </div>
  </div>
  <!-- RATING -->
  <div class="mb-2 flex content-center gap-2">
    {#each [1, 2, 3, 4, 5] as rate}
      {@const colored = rate <= rating}
      <Star strokeWidth={0} fill={colored ? "gold" : ""} />
    {/each}
  </div>
  <!-- REVIEW -->
  <div class="mb-3">
    {#if review}
      <div>{review}</div>
    {:else}
      <div>No Review for this book.</div>
    {/if}
  </div>
  <!-- GENRES -->
  <div class="flex justify-between">
    <div class="flex gap-2">
      <div class="self-center text-xs text-gray-500">Genres</div>
      {#each bookDetails.genres as { description }}
        <div
          class="place-self-start rounded-xl bg-purple-700 px-2 py-1 text-xs"
        >
          {description}
        </div>
      {/each}
    </div>
  </div>
</div>
