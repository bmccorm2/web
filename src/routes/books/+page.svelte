<script lang="ts">
   import { Button } from "$lib/components/ui/button";
   import Book from "./Book.svelte";

   let { data } = $props();
</script>

<div class="flex justify-center">
   <Button
      variant="link"
      href="/books/modify"
      class="me-2 mt-4 w-1/2 rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
      >Add a New Book</Button
   >
</div>
<hr class="my-4" />
<div class="md:grid md:grid-cols-2 md:gap-4">
   {#each data.books as bookDetails}
      <Book {bookDetails} />
   {/each}
</div>
