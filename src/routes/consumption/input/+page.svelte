<script lang="ts">
  import { superForm } from "sveltekit-superforms/client";
  import Card from "$lib/Card.svelte";
  import InputIcon from "./InputIcon.svelte";

  export let data;
  const { form, errors, enhance, message } = superForm(data.form);

  $: mpg =
    $form.miles && $form.gallons
      ? ($form.miles / $form.gallons).toFixed(2)
      : "";
  $: ppg =
    $form.price && $form.gallons
      ? ($form.price / $form.gallons).toFixed(2)
      : "";
</script>

<svelte:head>
  <title>Input</title>
  <meta name="description" content="Input new consumption records" />
</svelte:head>

<div class="container mx-auto mt-2">
  <Card header="input">
    <form action="?/create" method="post" use:enhance>
      <!-- PRICE -->
      <div class="flex mt-4 mx-6 items-center">
        <InputIcon icon="icon-park-outline:dollar" />
        <input
          type="number"
          class="px-3 py-1 border-2 border-slate-500 w-full rounded-r-md text-slate-800"
          placeholder="Price"
          required
          maxlength={5}
          inputmode="decimal"
          pattern="(\d*)\.?(\d*)"
          bind:value={$form.price}
          name="price"
          step=".01"
        />
        {#if $errors.price}
          <small class="text-red-500">{$errors.price}</small>
        {/if}
      </div>
      <!-- GALLONS -->
      <div class="flex mt-1 mx-6 items-center">
        <InputIcon icon="fluent:gas-pump-20-filled" />
        <input
          type="number"
          class="px-3 py-1 border-2 border-slate-500 w-full rounded-r-md text-slate-800"
          placeholder="Gallons"
          required
          maxlength={6}
          inputmode="decimal"
          pattern="(\d*)\.?(\d*)"
          bind:value={$form.gallons}
          name="gallons"
          step=".001"
        />
        {#if $errors.gallons}
          <small class="text-red-500">{$errors.gallons}</small>
        {/if}
      </div>
      <!-- MILES -->
      <div class="flex mt-1 mx-6 items-center">
        <InputIcon icon="bx:car" />
        <input
          type="number"
          class="px-3 py-1 border-2 border-slate-500 w-full rounded-r-md text-slate-800"
          placeholder="Miles"
          required
          maxlength={6}
          inputmode="decimal"
          pattern="(\d*)\.?(\d*)"
          bind:value={$form.miles}
          name="miles"
          step=".01"
        />
        {#if $errors.miles}
          <small class="text-red-500">{$errors.miles}</small>
        {/if}
      </div>
      <!-- NOTES -->
      <div class="flex mt-1 mb-4 mx-6 items-center">
        <InputIcon icon="fluent:note-24-filled" />
        <input
          type="text"
          class="px-3 py-1 border-2 border-slate-500 w-full rounded-r-md text-slate-800"
          placeholder="Notes"
          bind:value={$form.notes}
          name="notes"
        />
        {#if $errors.notes}
          <small class="text-red-500">{$errors.notes}</small>
        {/if}
      </div>
      <hr />
      <div class="flex mx-16 mt-4">
        <input
          type="text"
          readonly
          class="px-3 py-1 border-2 text-sm border-slate-500 w-full rounded-md placeholder-slate-600"
          placeholder={`MPG: ${mpg}`}
        />
        <input
          type="text"
          class="px-3 py-1 border-2 text-sm border-slate-500 w-full rounded-md placeholder-slate-600"
          placeholder={`PPG: ${ppg}`}
        />
      </div>
      <button
        type="submit"
        class="btn w-1/2 mb-4 mt-3 hover:ring {$message?.isSuccess
          ? 'bg-emerald-700'
          : 'bg-sky-700'}"
        disabled={$message?.isSuccess}>submit</button
      >
    </form>
  </Card>
</div>
