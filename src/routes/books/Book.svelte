<script lang="ts">
  import { Rating, Span } from "flowbite-svelte";
  import "iconify-icon";

  export let bookDetails;

  const { title, author, rating, pages, isFiction, id } = bookDetails;

  console.log(bookDetails);
</script>

<div class="border-2 border-red-500 rounded-lg px-2 py-1">
  <div class="flex justify-between mb-2">
    <div class="font-bold text-2xl underline">{title}</div>
    <div class="flex justify-end gap-2">
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
  <div class="flex justify-between content-center mb-2">
    <div>
      <Rating total={5} {rating} />
    </div>
    <div>{author}</div>
  </div>
  <div class="flex justify-between mb-1">
    <div class="grid grid-cols-2 gap-1">
      {#each bookDetails.genres as { description }}
        <div
          class="px-2 py-1 rounded-xl bg-purple-700 text-xs place-self-start"
        >
          {description}
        </div>
      {/each}
    </div>
    <div class="flex justify-end gap-1">
      <span class="px-2 py-1 rounded-xl bg-gray-500 text-xs self-start">
        {isFiction ? "Fiction" : "Non-Fiction"}
      </span>
      <div class="p-1 rounded-full bg-blue-700 text-xs self-start">{pages}</div>
    </div>
  </div>
</div>
