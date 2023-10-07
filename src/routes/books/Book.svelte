<script lang="ts">
  import { Rating } from "flowbite-svelte";
  import "iconify-icon";

  export let bookDetails;

  const { title, author, rating, pages, isFiction, id, review } = bookDetails;
</script>

<div class="border-2 border-red-500 rounded-lg p-4 bg-slate-800">
  <div class="flex justify-between mb-2">
    <div class="flex gap-3 content-center">
      <!-- TITLE -->
      <div class="font-bold text-3xl underline">{title}</div>
    </div>
    <!-- ACTIONS -->
    <div class="flex gap-2">
      <a href={`books/update/${id}`}>
        <iconify-icon icon="carbon:edit" />
      </a>
      <form action="?/deleteBook" method="post">
        <input type="hidden" name="id" value={id} />
        <button>
          <iconify-icon icon="carbon:trash-can" />
        </button>
      </form>
    </div>
  </div>
  <!-- AUTHOR/PAGES/FICTION -->
  <div class="flex justify-between mb-2">
    <div class="text-xs self-center text-slate-400">By {author}</div>
    <div class="flex gap-4">
      <div class="px-2 py-1 rounded-full bg-blue-700 text-xs self-center">
        {pages} pages
      </div>
      <div class="px-2 py-1 rounded-full bg-gray-500 text-xs self-center">
        {isFiction ? "Fiction" : "Non-Fiction"}
      </div>
    </div>
  </div>
  <!-- RATING -->
  <div class="flex justify-between content-center mb-2">
    <div>
      <Rating size={32} total={5} {rating} />
    </div>
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
      <div class="text-gray-500 text-xs self-center">Genres</div>
      {#each bookDetails.genres as { description }}
        <div
          class="px-2 py-1 rounded-xl bg-purple-700 text-xs place-self-start"
        >
          {description}
        </div>
      {/each}
    </div>
  </div>
</div>
