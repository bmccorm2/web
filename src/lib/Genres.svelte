<script lang="ts">
   import Card from "$lib/Card.svelte";
   import {
      type SuperValidated,
      type Infer,
      superForm,
   } from "sveltekit-superforms";
   import GenreTable from "../routes/books/GenreTable.svelte";
   import { Input } from "./components/ui/input";
   import { genreSchema, type Genre } from "./types";
   import * as Form from "$lib/components/ui/form";
   import { zodClient } from "sveltekit-superforms/adapters";
   import { toast, Toaster } from "svelte-sonner";

   export let data: SuperValidated<Infer<typeof genreSchema>>;
   export let genres: Genre[];

   const form = superForm(data, {
      validators: zodClient(genreSchema),
      onUpdated: ({ form: f }) => {
         if (f.valid) {
            toast.success(
               `Created ${JSON.stringify(f.data.description, null, 2)}`,
            );
         }
      },
   });

   const { form: formData } = form;
</script>

<Card header="genres">
   <form action="?/insertGenre" class="my-4" method="post">
      <Form.Field {form} name="description" class="mx-4">
         <Form.Control let:attrs>
            <Input
               {...attrs}
               placeholder="Add a Genre"
               autocomplete="off"
               spellcheck="false"
               bind:value={$formData.description}
               class="rounded-md p-2 ring-1 ring-slate-400"
            />
         </Form.Control>
         <Form.FieldErrors />
      </Form.Field>
      <div class="text-center">
         <Form.Button class="bg-blue-500 font-bold uppercase text-white"
            >Submit</Form.Button
         >
      </div>
   </form>
   <hr class="mx-2 border-white" />
   <div class="mt-2">
      <GenreTable {genres} />
   </div>
</Card>

<Toaster richColors />
