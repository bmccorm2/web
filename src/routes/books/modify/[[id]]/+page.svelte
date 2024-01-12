<script lang="ts">
  import Card from "$lib/Card.svelte";
  import { userRating } from "$lib/stores";
  import {
    FloatingLabelInput,
    Checkbox,
    Textarea,
    NumberInput,
  } from "flowbite-svelte";
  import Genres from "$lib/Genres.svelte";
  import { superForm } from "sveltekit-superforms/client";
  import Rating from "../../Rating.svelte";

  export let data;

  const { form } = superForm(data.form);

  //in flowbite, you MUST use the variable GROUP for bindings.
  //That's why we have a hack here to bind the genres to the group
  //variable instead of just binding to $form.genres
  let group = $form.selectedGenres;
  $: $form.selectedGenres = group;

  //Same is true for NumberInputs and value
  let value = $form.pages;
  $: $form.pages = value;

  //For the star rating so we can bind it to the form
  userRating.set($form.rating);
  $: $form.rating = $userRating;
</script>

<div class="container mx-auto lg:flex lg:gap-2">
  <div class="lg:w-9/12">
    <Card header={$form.id ? "Update Book" : "Create a Book"}>
      <form action="?/modify" method="post">
        <div class="m-4">
          <input type="hidden" bind:value={$form.id} name="id" />
          <FloatingLabelInput
            style="outlined"
            classLabel="dark:bg-slate-800"
            name="title"
            bind:value={$form.title}
            type="text"
            autocomplete="off"
            label="Title">Title</FloatingLabelInput
          >
        </div>
        <div class="m-4">
          <FloatingLabelInput
            style="outlined"
            classLabel="dark:bg-slate-800"
            bind:value={$form.author}
            type="text"
            name="author"
            autocomplete="off"
            label="Author">Author</FloatingLabelInput
          >
        </div>
        <div class="m-4">
          <Textarea
            unWrappedClass="dark:bg-slate-800 text-sm"
            placeholder="Review"
            rows="4"
            name="review"
            bind:value={$form.review}
          />
        </div>
        <!-- GENRES -->
        <div class="border-2 border-purple-500 rounded-md px-2 py-1 m-4">
          <div class="font-bold underline mb-2">Genres</div>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-2">
            {#each data.genres as genre}
              <Checkbox bind:group value={genre.id} name="selectedGenres"
                >{genre.description}</Checkbox
              >
            {/each}
          </div>
        </div>

        <!-- RATING -->
        <div class="flex justify-center gap-12 m-4">
          <div>
            <Rating />
            <input type="hidden" bind:value={$form.rating} name="rating" />
          </div>
          <div class="flex justify-center">
            <Checkbox bind:checked={$form.isFiction} name="isFiction"
              >Is Fiction</Checkbox
            >
          </div>
        </div>

        <!-- PAGES -->
        <div class="lg:flex lg:justify-evenly lg:content-center m-4">
          <NumberInput
            class="lg:m-0 mb-2 dark:bg-slate-800"
            placeholder="pages"
            bind:value
            name="pages"
          />
          <FloatingLabelInput
            style="outlined"
            classLabel="dark:bg-slate-800"
            classDiv="lg:m-0"
            bind:value={$form.publishDate}
            type="number"
            name="publishDate"
            autocomplete="off"
            label="Publish Date">Publish Date</FloatingLabelInput
          >
        </div>

        <button class="btn bg-blue-500 text-center mb-4 w-1/2"
          >{#if $form.id}
            Update
          {:else}
            Create
          {/if}</button
        >
      </form>
    </Card>
  </div>
  <div class="lg:w-3/12 w-full mt-2 lg:mt-0">
    <Genres genres={data.genres} />
  </div>
</div>
