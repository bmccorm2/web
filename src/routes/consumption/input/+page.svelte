<script lang="ts">
  import { superForm } from "sveltekit-superforms/client";
  import Card from "$lib/Card.svelte";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { inputSchema } from "$lib/types";
  import * as Form from "$lib/components/ui/form";
  // import InputIcon from "./InputIcon.svelte";
  // import { CarFront, DollarSign, Fuel, StickyNote } from "lucide-svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";
  import { Input } from "$lib/components/ui/input";
  import { Toaster } from "$lib/components/ui/sonner";
  import { toast } from "svelte-sonner";

  let { data } = $props();

  let isSuccess = $state(false);

  const form = superForm(data.form, {
    validators: zodClient(inputSchema),
    onUpdated: ({ form: f }) => {
      if (f.valid) {
        toast.success("Successfully created record");
        isSuccess = true;
      }
    },
  });

  const { form: formData, enhance } = form;

  let mpg = $derived(
    $formData.miles && $formData.gallons
      ? ($formData.miles / $formData.gallons).toFixed(2)
      : "",
  );
  let ppg = $derived(
    $formData.price && $formData.gallons
      ? ($formData.price / $formData.gallons).toFixed(2)
      : "",
  );
</script>

<svelte:head>
  <title>Input</title>
  <meta name="description" content="Input new consumption records" />
</svelte:head>

<div class="mt-2">
  <Card header="input" {isSuccess}>
    <form action="?/create" method="post" use:enhance>
      <!-- PRICE -->
      <div class="mx-6 mt-4 flex items-center">
        <Form.Field {form} name="price">
          <Form.Control let:attrs>
            <Input {...attrs} bind:value={$formData.price} />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
      </div>
      <Separator />
      <!-- SUMMARY -->
      <div class="mx-4 flex gap-2">
        <input
          type="text"
          readonly
          class="w-full rounded-md border-2 border-slate-500 px-3 py-1 text-sm placeholder-slate-200"
          placeholder={`MPG: ${mpg}`}
        />
        <input
          type="text"
          readonly
          class="w-full rounded-md border-2 border-slate-500 px-3 py-1 text-sm placeholder-slate-200"
          placeholder={`PPG: ${ppg}`}
        />
      </div>
      <div class="my-4 text-center">
        <Form.Button
          class="w-2/3 font-bold uppercase text-white {isSuccess
            ? 'bg-emerald-700'
            : 'bg-sky-700'}"
          disabled={isSuccess}>{isSuccess ? "sent!" : "submit"}</Form.Button
        >
      </div>
    </form>
  </Card>
</div>

<Toaster richColors />
