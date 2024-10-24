<script lang="ts">
  import * as Form from "$lib/components/ui/form";
  import { Textarea } from "$lib/components/ui/textarea";
  import { Input } from "$lib/components/ui/input";
  import { superForm } from "sveltekit-superforms";
  import { swimWorkoutSchema } from "$lib/types.js";
  import { zodClient } from "sveltekit-superforms/adapters";
  import Card from "$lib/Card.svelte";
  import type { PageData } from "./$types";
  import { Checkbox } from "$lib/components/ui/checkbox";

  interface Props {
    data: PageData;
  }

  let { data }: Props = $props();

  const form = superForm(data.form, {
    validators: zodClient(swimWorkoutSchema),
    dataType: "json",
  });

  const { form: formData, enhance } = form;

  function addTag(id: number, tag: string | undefined) {
    if (!$formData.tags) {
      $formData.tags = [];
    }
    $formData.tags = [...$formData.tags, { id, tag }];
  }

  function removeTag(id: number) {
    $formData.tags = $formData.tags?.filter((e) => e.id != id);
  }

  function handleTab(event: KeyboardEvent) {
    const el = event.target as HTMLTextAreaElement;

    if (event.key === "Tab") {
      event.preventDefault();
      const start = el.selectionStart;
      const end = el.selectionEnd;

      // Insert the tab character at the cursor position
      el.value = el.value.substring(0, start) + "   " + el.value.substring(end);
    }
  }
</script>

<svelte:head>
  <title>Modify Workout</title>
  <meta name="swim workouts" content="add or change an existing swim workout" />
</svelte:head>

<div class="mt-2">
  <Card header={$formData.id ? "update workout" : "add a workout"}>
    <form method="post" action="?/modify" use:enhance>
      <div class="lg:flex lg:gap-2">
        <!-- WORKOUT AREA -->
        <Form.Field {form} name="swimWorkoutText" class="m-4 grow">
          <Form.Control >
            {#snippet children({ attrs })}
                        <Textarea
                {...attrs}
                class="rounded-md p-2 ring-1 ring-slate-400 h-72"
                bind:value={$formData.swimWorkoutText}
                on:keydown={handleTab}
                placeholder="Workout"
                autocomplete="off"
                spellcheck="false"
              />
                                  {/snippet}
                    </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <div class="lg:w-4/12">
          <!-- AUTHOR          -->
          <Form.Field {form} name="author" class="m-4">
            <Form.Control >
              {#snippet children({ attrs })}
                            <Input
                  {...attrs}
                  placeholder="Author"
                  class="rounded-md p-2 ring-1 ring-slate-400"
                  bind:value={$formData.author}
                  autocomplete="off"
                />
                                        {/snippet}
                        </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <!-- YARDS -->
          <Form.Field {form} name="yards" class="m-4">
            <Form.Control >
              {#snippet children({ attrs })}
                            <Input
                  {...attrs}
                  type="number"
                  placeholder="Yards"
                  class="rounded-md p-2 ring-1 ring-slate-400"
                  bind:value={$formData.yards}
                  autocomplete="off"
                />
                                        {/snippet}
                        </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <!-- TAGS -->
          <Form.Fieldset {form} name="tags">
            <div class="mx-4 grid grid-cols-2 gap-2 xl:grid-cols-3 mb-4">
              {#each data.swimTags as tag}
                {@const checked = $formData.tags?.some((e) => e.id === tag.id)}
                <div class="flex items-center">
                  <Form.Control >
                    {#snippet children({ attrs })}
                                        <Checkbox
                        {...attrs}
                        {checked}
                        onCheckedChange={(v) => {
                          if (v) {
                            addTag(tag.id, tag.tag);
                          } else {
                            removeTag(tag.id);
                          }
                        }}
                      />
                      <Form.Label class="ml-2">{tag.tag}</Form.Label>
                      <input
                        hidden
                        type="checkbox"
                        name={attrs.name}
                        value={tag.id}
                      />
                                                          {/snippet}
                                    </Form.Control>
                  <Form.FieldErrors />
                </div>
              {/each}
            </div>
          </Form.Fieldset>
        </div>
      </div>
      <div class="flex justify-center mb-4">
        <Form.Button
          class="w-1/2 text-center font-bold uppercase bg-blue-500 text-white"
          >Submit</Form.Button
        >
      </div>
    </form>
  </Card>
</div>
