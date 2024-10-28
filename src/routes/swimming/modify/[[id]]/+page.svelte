<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Textarea } from '$lib/components/ui/textarea';
	import { Input } from '$lib/components/ui/input';
	import { superForm } from 'sveltekit-superforms';
	import { swimWorkoutSchema } from '$lib/types.js';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as Card from '$lib/components/ui/card/index.js';

	let { data } = $props();

	const form = superForm(data.form, {
		validators: zodClient(swimWorkoutSchema),
		dataType: 'json'
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

		if (event.key === 'Tab') {
			event.preventDefault();
			const start = el.selectionStart;
			const end = el.selectionEnd;

			// Insert the tab character at the cursor position
			el.value = el.value.substring(0, start) + '   ' + el.value.substring(end);
		}
	}
</script>

<svelte:head>
	<title>Modify Workout</title>
	<meta name="swim workouts" content="add or change an existing swim workout" />
</svelte:head>

<Card.Root class="mt-2">
	<Card.Header>{$formData.id ? 'UPDATE WORKOUT' : 'ADD A WORKOUT'}</Card.Header>
	<Card.Content>
		<form method="post" action="?/modify" use:enhance>
			<div class="mb-4 lg:flex lg:gap-2">
				<!-- WORKOUT AREA -->
				<Form.Field {form} name="swimWorkoutText" class="m-4 grow">
					<Form.Control>
						{#snippet children({ props })}
							<Textarea
								{...props}
								class="h-72 rounded-md p-2 ring-1 ring-slate-400"
								bind:value={$formData.swimWorkoutText}
								onkeydown={handleTab}
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
						<Form.Control>
							{#snippet children({ props })}
								<Input
									{...props}
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
						<Form.Control>
							{#snippet children({ props })}
								<Input
									{...props}
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
						<div class="mx-4 mb-4 grid grid-cols-2 gap-2 xl:grid-cols-3">
							{#each data.swimTags as tag}
								{@const checked = $formData.tags?.some((e) => e.id === tag.id)}
								<div class="flex items-center">
									<Form.Control>
										{#snippet children({ props })}
											<Checkbox
												{...props}
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
											<input hidden type="checkbox" name={props.name} value={tag.id} />
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								</div>
							{/each}
						</div>
					</Form.Fieldset>
				</div>
			</div>
			<div class="flex justify-center">
				<Form.Button class="w-1/2">Submit</Form.Button>
			</div>
		</form>
	</Card.Content>
</Card.Root>
