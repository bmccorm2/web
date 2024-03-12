<script lang="ts">
   import Card from "$lib/Card.svelte";
   import { userRating } from "$lib/stores";
   import Genres from "$lib/Genres.svelte";
   import { superForm } from "sveltekit-superforms/client";
   import Rating from "../../Rating.svelte";
   import { Textarea } from "$lib/components/ui/textarea";
   import { Checkbox } from "$lib/components/ui/checkbox";
   import * as Form from "$lib/components/ui/form";
   import { zodClient } from "sveltekit-superforms/adapters";
   import { bookSchema, type Genre } from "$lib/types";
   import { Input } from "$lib/components/ui/input";

   export let data;

   const form = superForm(data.form, {
      validators: zodClient(bookSchema),
      dataType: "json",
   });

   const { form: formData, enhance } = form;

   //For the star rating so we can bind it to the form
   userRating.set($formData.rating);
   $: $formData.rating = $userRating;

   const addGenre = (id: number, description: string) => {
      $formData.genres = [...$formData.genres, { id, description }];
   };

   const removeGenre = (id: number) => {
      $formData.genres = $formData.genres.filter((e: Genre) => e.id != id);
   };
</script>

<div class="mt-2 lg:flex lg:gap-2">
   <div class="lg:w-9/12">
      <Card header={$formData.id ? "Update Book" : "Create Book"}>
         <form action="?/modify" method="post" use:enhance>
            <div class="mx-2">
               <Form.Field {form} name="title" class="mx-4 mb-4 mt-4">
                  <Form.Control let:attrs>
                     <Input
                        {...attrs}
                        class="rounded-md p-2 ring-1 ring-slate-400"
                        bind:value={$formData.title}
                        placeholder="Title"
                        autocomplete="off"
                        spellcheck="false"
                     />
                  </Form.Control>
                  <Form.FieldErrors />
               </Form.Field>
               <Form.Field {form} name="author" class="m-4">
                  <Form.Control let:attrs>
                     <Input
                        {...attrs}
                        class="rounded-md p-2 ring-1 ring-slate-400"
                        bind:value={$formData.author}
                        placeholder="Author"
                        autocomplete="off"
                        spellcheck="false"
                     />
                  </Form.Control>
                  <Form.FieldErrors />
               </Form.Field>
               <Form.Field {form} name="review" class="m-4">
                  <Form.Control let:attrs>
                     <Textarea
                        {...attrs}
                        class="rounded-md p-2 ring-1 ring-slate-400"
                        bind:value={$formData.review}
                        placeholder="Review"
                        autocomplete="off"
                        spellcheck="false"
                     />
                  </Form.Control>
                  <Form.FieldErrors />
               </Form.Field>
               <!-- GENRES -->
               <div
                  class="m-4 mt-6 rounded-md border-2 border-purple-500 px-2 py-1 text-center"
               >
                  <div class="mb-2 font-bold underline">Genres</div>
                  <Form.Fieldset {form} name="genres">
                     <div class="mb-2 grid grid-cols-2 gap-2 lg:grid-cols-4">
                        {#each data.genres as genre}
                           {@const checked = $formData.genres.some(
                              (e) => e.id === genre.id,
                           )}
                           <div class="flex items-center">
                              <Form.Control let:attrs>
                                 <Checkbox
                                    {...attrs}
                                    {checked}
                                    onCheckedChange={(e) => {
                                       if (e)
                                          addGenre(genre.id, genre.description);
                                       else removeGenre(genre.id);
                                    }}
                                 />
                                 <Form.Label class="ml-2"
                                    >{genre.description}</Form.Label
                                 >
                                 <input
                                    hidden
                                    type="checkbox"
                                    name={attrs.name}
                                    value={genre.id}
                                    {checked}
                                 />
                              </Form.Control>
                              <Form.FieldErrors />
                           </div>
                        {/each}
                     </div>
                  </Form.Fieldset>
               </div>
               <!-- RATING -->
               <div
                  class="m-4 mt-6 md:flex md:items-center md:justify-center md:gap-12"
               >
                  <div class="mb-2 text-center md:mb-0">
                     <Rating />
                  </div>
                  <div class="text-center">
                     <Form.Field {form} name="isFiction">
                        <Form.Control let:attrs>
                           <Checkbox
                              {...attrs}
                              bind:checked={$formData.isFiction}
                           />
                           <Form.Label>Is Fiction?</Form.Label>
                           <input
                              name={attrs.name}
                              value={$formData.isFiction}
                              hidden
                           />
                        </Form.Control>
                        <Form.FieldErrors />
                     </Form.Field>
                  </div>
               </div>
               <!-- PAGES -->
               <div class="m-4 lg:flex lg:content-center lg:justify-evenly">
                  <Form.Field {form} name="pages">
                     <Form.Control let:attrs>
                        <Input
                           {...attrs}
                           type="number"
                           placeholder="Pages"
                           class="rounded-md p-2 ring-1 ring-slate-400"
                           bind:value={$formData.pages}
                           autocomplete="off"
                        />
                     </Form.Control>
                     <Form.FieldErrors />
                  </Form.Field>
                  <Form.Field {form} name="publishDate">
                     <Form.Control let:attrs>
                        <Input
                           {...attrs}
                           type="number"
                           placeholder="Publish Date"
                           class="rounded-md p-2 ring-1 ring-slate-400"
                           bind:value={$formData.publishDate}
                           autocomplete="off"
                        />
                     </Form.Control>
                     <Form.FieldErrors />
                  </Form.Field>
               </div>

               <!-- SUBMIT BUTTON -->
               <div class="text-center">
                  <Form.Button
                     class="m-4 w-1/2 bg-blue-500 font-bold uppercase text-white"
                     >{$formData.id ? "Update" : "Create"}
                  </Form.Button>
               </div>
            </div>
         </form>
      </Card>
   </div>
   <div class="mt-2 w-full lg:mt-0 lg:w-3/12">
      <Genres data={data.genreForm} genres={data.genres} />
   </div>
</div>
