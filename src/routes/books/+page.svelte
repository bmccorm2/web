<script lang="ts">
  import "iconify-icon";
  import BookTable from "./BookTable.svelte";

  export let data;
</script>

<div class="container mx-auto mt-2">
  <div class="flex gap-2">
    <div class="w-11/12">
      <BookTable books={data.books} />
    </div>
    <div class="w-1/12 flex justify-center mt-4">
      <button>
        <a href="/books/create">
          <iconify-icon icon="zondicons:add-solid" width="32" />
        </a>
      </button>
    </div>
  </div>
</div>
