<script lang="ts">
  import Book from "./Book.svelte";
  import { GradientButton } from "flowbite-svelte";

  export let data;
</script>

<div class="container mx-auto">
  <div class="flex justify-center">
    <GradientButton class="w-1/2" shadow color="teal" href="/books/modify"
      >Add a New Book</GradientButton
    >
  </div>
  <hr class="my-4" />
  <div class="grid gap-4 grid-cols-2">
    {#each data.books as bookDetails}
      <Book {bookDetails} />
    {/each}
  </div>
</div>
