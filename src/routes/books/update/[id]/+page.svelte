<script lang="ts">
  import { enhance } from "$app/forms";
  import Card from "$lib/Card.svelte";
  import { userRating } from "$lib/stores";
  import {
    FloatingLabelInput,
    Checkbox,
    Textarea,
    P,
    Rating,
  } from "flowbite-svelte";
  import Genres from "$lib/Genres.svelte";

  export let data;
  const { book } = data;
  const genres = book.genres;

  let genreSelect: Array<{ value: string; name: string }> = [];
  let genreList: Array<number> = [];

  genres.forEach((e) => {
    genreSelect.push({
      value: e.id,
      name: e.description,
    });
  });

  userRating.set(book.rating);
</script>

<div class="container mx-auto lg:flex lg:gap-2">
  <div class="lg:w-9/12">
    <Card header="update book">
      <form action="?/updateBook" method="post" use:enhance>
        <div class="m-4">
          <FloatingLabelInput
            style="outlined"
            classLabel="dark:bg-slate-800"
            name="title"
            type="text"
            value={book.title}
            autocomplete="off"
            label="Title"
          />
        </div>
        <div class="m-4">
          <FloatingLabelInput
            style="outlined"
            classLabel="dark:bg-slate-800"
            name="author"
            type="text"
            value={book.author}
            autocomplete="off"
            label="Author"
          />
        </div>
        <div class="m-4">
          <Textarea
            unWrappedClass="dark:bg-slate-800 text-sm"
            placeholder="Review"
            rows="4"
            value={book.review}
            name="review"
          />
        </div>
        <!-- GENRES -->
        <div class="border-2 border-purple-500 rounded-md px-2 py-1 m-4">
          <div class="font-bold underline mb-2">Genres</div>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
            {#each genres as { id, description }}
              <Checkbox value={id} name="genreList" checked
                >{description}</Checkbox
              >
            {/each}
          </div>
        </div>

        <!-- RATING -->
        <div class="flex justify-center gap-12 m-4">
          <div>
            <Rating size={32} rating={$userRating} />
            <input type="hidden" name="rating" value={$userRating} />
          </div>
          <div class="flex justify-center">
            <Checkbox name="isFiction" checked={book.isFiction}
              >Is Fiction</Checkbox
            >
          </div>
        </div>

        <!-- PAGES -->
        <div class="lg:flex lg:justify-evenly lg:content-center m-4">
          <FloatingLabelInput
            style="outlined"
            classLabel="dark:bg-slate-800"
            classDiv="lg:m-0"
            name="pages"
            type="number"
            value={book.pages}
            label="Pages"
          />
          <FloatingLabelInput
            style="outlined"
            classLabel="dark:bg-slate-800"
            classDiv="lg:m-0"
            name="publishDate"
            type="number"
            value={book.publishDate}
            autocomplete="off"
            label="Publish Date"
          />
        </div>
        <button class="btn bg-blue-500 text-center mb-4 w-1/2">Submit</button>
      </form>
    </Card>
  </div>
  <div class="lg:w-3/12 w-full mt-2 lg:mt-0">
    <Genres {genres} />
  </div>
</div>
