<script lang="ts">
  import { enhance } from "$app/forms";
  import Card from "$lib/Card.svelte";
  import { userRating } from "$lib/stores";
  import Rating from "../Rating.svelte";
  import { FloatingLabelInput, Checkbox } from "flowbite-svelte";
  import Genres from "./Genres.svelte";

  export let data;

  let genreSelect: Array<{ value: string; name: string }> = [];
  let genreList: Array<number> = [];

  data.genres.forEach((e) => {
    genreSelect.push({
      value: e.id,
      name: e.description,
    });
  });
</script>

<div class="container mx-auto flex gap-2">
  <div class="w-9/12">
    <Card header="create a book">
      <form action="?/createBook" method="post" use:enhance>
        <div class="m-4">
          <FloatingLabelInput
            style="outlined"
            id="floating_outlined"
            classLabel="dark:bg-slate-800"
            name="title"
            type="text"
            label="Title"
          />
        </div>
        <div class="m-4">
          <FloatingLabelInput
            style="outlined"
            id="floating_outlined"
            classLabel="dark:bg-slate-800"
            name="author"
            type="text"
            label="Author"
          />
        </div>
        <div class="m-4 flex justify-evenly content-center">
          <FloatingLabelInput
            style="outlined"
            id="floating_outlined"
            classLabel="dark:bg-slate-800"
            name="pages"
            type="number"
            label="Pages"
          />
          <Checkbox name="isFiction">Is Fiction</Checkbox>
          <div class="flex justify-center mb-2">
            <Rating />
            <input type="hidden" name="rating" value={$userRating} />
          </div>
        </div>
        <div class="m-4">
          <FloatingLabelInput
            style="outlined"
            id="floating_outlined"
            classLabel="dark:bg-slate-800"
            name="publishDate"
            type="number"
            label="Publish Date"
          />
        </div>
        <!-- <div class="m-4">
          <MultiSelect items={genreSelect} name="genreList" />
        </div> -->
        <!-- <div class="m-4">
          <select multiple name="genreList">
            {#each data.genres as { id, description }}
              <option class="text-slate-800" value={id}>{description}</option>
            {/each}
          </select>
        </div> -->
        <div class="grid m-4 grid-cols-4 gap-2">
          {#each data.genres as { id, description }}
            <Checkbox value={id} name="genreList">{description}</Checkbox>
          {/each}
        </div>
        <button class="btn bg-blue-500 text-center my-2">Submit</button>
      </form>
    </Card>
  </div>
  <div class="w-3/12">
    <Genres genres={data.genres} />
  </div>
</div>
