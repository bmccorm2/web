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

  export let data: PageData;

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

<div class="mt-2">
  <Card header={$formData.id ? "update workout" : "add a workout"}>
    <form method="post" action="?/modify" use:enhance>
      <div class="flex gap-2">
        <!-- WORKOUT AREA -->
        <Form.Field {form} name="swimWorkoutText" class="m-4 grow">
          <Form.Control let:attrs>
            <Textarea
              {...attrs}
              class="rounded-md p-2 ring-1 ring-slate-400 h-72"
              bind:value={$formData.swimWorkoutText}
              on:keydown={handleTab}
              placeholder="Workout"
              autocomplete="off"
              spellcheck="false"
            />
          </Form.Control>
          <Form.FieldErrors />
        </Form.Field>
        <div>
          <!-- YARDS -->
          <Form.Field {form} name="yards" class="m-4">
            <Form.Control let:attrs>
              <Input
                {...attrs}
                type="number"
                placeholder="Yards"
                class="rounded-md p-2 ring-1 ring-slate-400"
                bind:value={$formData.yards}
                autocomplete="off"
              />
            </Form.Control>
            <Form.FieldErrors />
          </Form.Field>
          <!-- TAGS -->
          <Form.Fieldset {form} name="tags">
            <div class="m-4 grid lg:grid-cols-2 gap-2 xl:grid-cols-3">
              {#each data.swimTags as tag}
                {@const checked = $formData.tags?.some((e) => e.id === tag.id)}
                <div class="flex items-center justify-items-start">
                  <Form.Control let:attrs>
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
