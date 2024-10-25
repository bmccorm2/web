<script lang="ts">
  import { superForm } from "sveltekit-superforms/client";
  import Card from "$lib/Card.svelte";
  import { zodClient } from "sveltekit-superforms/adapters";
  import { inputSchema } from "$lib/types";
  import * as Form from "$lib/components/ui/form";
  import InputIcon from "./InputIcon.svelte";
  import { CarFront, DollarSign, Fuel, StickyNote } from "lucide-svelte";
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

<form action="?/create" method="post">
  <Form.Field {form} name="price">
    <Form.Control let:attrs>
      <Form.Label>Username</Form.Label>
      <Input {...attrs} bind:value={$formData.price} />
    </Form.Control>
    <Form.FieldErrors />
  </Form.Field>
</form>
