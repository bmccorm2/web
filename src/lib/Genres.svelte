<script lang="ts">
  import { enhance } from "$app/forms";
  import { Toast } from "flowbite-svelte";
  import CheckCircleSolid from "flowbite-svelte-icons/CheckCircleSolid.svelte";
  import Card from "$lib/Card.svelte";
  import GenreTable from "../routes/books/GenreTable.svelte";

  export let genres;

  let toastShow = false;
  let autohideCounter: number;
  let createdTitle: string;

  const showToast = () => {
    toastShow = true;
    autohideCounter = 3;
    timeout();
  };

  const timeout = () => {
    if (autohideCounter-- > 0) return setTimeout(timeout, 1000);
    toastShow = false;
  };
</script>

<Card header="genres">
  <form
    action="?/insertGenre"
    class="my-4"
    method="post"
    use:enhance={async () => {
      return async ({ update }) => {
        await update();
        createdTitle = "Genre";
        showToast();
      };
    }}
  >
    <input
      class="p-2 mb-2 rounded-md text-slate-800"
      type="text"
      placeholder="Add a Genre"
      name="description"
      autocomplete="off"
    />
    <button class="btn bg-blue-500 text-center">Submit</button>
  </form>
  <hr class="mx-2" />
  <div class="mt-2">
    <GenreTable {genres} />
  </div>
</Card>

<Toast position="top-right" color="green" bind:open={toastShow}>
  <svelte:fragment slot="icon">
    <CheckCircleSolid name="check-circle-solid" class="w-5 h-5" />
    <span class="sr-only">Check icon</span>
  </svelte:fragment>
  {createdTitle} created successfully!
</Toast>
