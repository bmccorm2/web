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

<div class="container mx-auto lg:flex lg:gap-2">
  <div class="lg:w-9/12">
    <Card header="create a book">
      <form action="?/createBook" method="post" use:enhance>
        <div class="m-4">
          <FloatingLabelInput
            style="outlined"
            classLabel="dark:bg-slate-800"
            name="title"
            type="text"
            label="Title"
          />
        </div>
        <div class="m-4">
          <FloatingLabelInput
            style="outlined"
            classLabel="dark:bg-slate-800"
            name="author"
            type="text"
            label="Author"
          />
        </div>
        <div class="lg:flex lg:justify-evenly lg:content-center">
          <FloatingLabelInput
            style="outlined"
            classLabel="dark:bg-slate-800"
            classDiv="lg:m-0 m-4"
            name="pages"
            type="number"
            label="Pages"
          />
          <FloatingLabelInput
            style="outlined"
            classLabel="dark:bg-slate-800"
            classDiv="lg:m-0 m-4"
            name="publishDate"
            type="number"
            label="Publish Date"
          />
        </div>
        <div class="lg:m-4" />
        <div class="mb-2 flex align-center justify-center">
          <Rating />
          <input type="hidden" name="rating" value={$userRating} />
        </div>
        <div class="flex justify-center">
          <Checkbox name="isFiction" class="mb-4">Is Fiction</Checkbox>
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
        <div class="border-2 border-purple-500 rounded-md px-2 py-1 mx-4">
          <div class="font-bold underline mb-2">Genres</div>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-2">
            {#each data.genres as { id, description }}
              <Checkbox value={id} name="genreList">{description}</Checkbox>
            {/each}
          </div>
        </div>
        <button class="btn bg-blue-500 text-center my-4">Submit</button>
      </form>
    </Card>
  </div>
  <div class="lg:w-3/12 w-full mt-2 lg:mt-0">
    <Genres genres={data.genres} />
  </div>
</div>
