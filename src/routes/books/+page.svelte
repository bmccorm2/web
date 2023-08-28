<script lang="ts">
  import Book from "./Book.svelte";
  import { GradientButton } from "flowbite-svelte";

  export let data;
</script>

<div class="container mx-auto">
  <div class="flex justify-center">
    <GradientButton class="w-1/2" shadow color="blue" href="/books/create"
      >Add a New Book</GradientButton
    >
  </div>
  <hr class="my-3" />
  <div class="grid gap-1 grid-cols-3">
    {#each data.books as bookDetails}
      <Book {bookDetails} />
    {/each}
  </div>
</div>
