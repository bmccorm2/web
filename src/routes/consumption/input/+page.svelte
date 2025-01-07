<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { inputSchema } from '$lib/types';
	import * as Form from '$lib/components/ui/form';
	import * as Card from '$lib/components/ui/card/index.js';
	import InputIcon from './InputIcon.svelte';
	import { Fuel, StickyNote, DollarSign, CarFront } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';

	let { data } = $props();

	let isSuccess = $state(false);

	const form = superForm(data.form, {
		validators: zodClient(inputSchema),
		onUpdated({ form: f }) {
			if (f.valid) {
				isSuccess = true;
			}
		}
	});

	const { form: formData, enhance } = form;

	let mpg = $derived(
		$formData.miles && $formData.gallons ? ($formData.miles / $formData.gallons).toFixed(2) : ''
	);
	let ppg = $derived(
		$formData.price && $formData.gallons ? ($formData.price / $formData.gallons).toFixed(2) : ''
	);
</script>

<svelte:head>
	<title>Input</title>
	<meta name="description" content="Input new consumption records" />
</svelte:head>

<Card.Root class="my-2 md:mb-0">
	<Card.Header class={`${isSuccess && 'from-emerald-800 to-emerald-700'}`}>INPUT</Card.Header>
	<form action="?/create" method="post" use:enhance>
		<Card.Content>
			<!-- PRICE -->
			<div class="mx-6 flex items-center">
				<InputIcon>
					<DollarSign />
				</InputIcon>
				<Form.Field {form} name="price" class="flex grow items-center">
					<Form.Control>
						{#snippet children({ props })}
							<Input
								{...props}
								type="number"
								placeholder="Price"
								bind:value={$formData.price}
								inputmode="decimal"
								step=".01"
								class="rounded-r-md border-2 border-slate-500 px-3 py-1 text-slate-200"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<!-- GALLONS -->
			<div class="mx-6 mt-1 flex items-center">
				<InputIcon>
					<Fuel />
				</InputIcon>
				<Form.Field {form} name="gallons" class="flex grow items-center">
					<Form.Control>
						{#snippet children({ props })}
							<Input
								{...props}
								type="number"
								placeholder="Gallons"
								bind:value={$formData.gallons}
								inputmode="decimal"
								step=".001"
								class="rounded-r-md border-2 border-slate-500 px-3 py-1 text-slate-200"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<!-- MILES -->
			<div class="mx-6 mt-1 flex items-center">
				<InputIcon>
					<CarFront />
				</InputIcon>
				<Form.Field {form} name="miles" class="flex grow items-center">
					<Form.Control>
						{#snippet children({ props })}
							<Input
								{...props}
								type="number"
								placeholder="Miles"
								bind:value={$formData.miles}
								inputmode="decimal"
								step=".01"
								class="rounded-r-md border-2 border-slate-500 px-3 py-1 text-slate-200"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<!-- NOTES -->
			<div class="mx-6 mb-4 mt-1 flex items-center">
				<InputIcon>
					<StickyNote />
				</InputIcon>
				<Form.Field {form} name="notes" class="flex grow items-center">
					<Form.Control>
						{#snippet children({ props })}
							<Input
								{...props}
								placeholder="Notes"
								bind:value={$formData.notes}
								class="rounded-r-md border-2 border-slate-500 px-3 py-1 text-slate-200"
							/>
						{/snippet}
					</Form.Control>
					<Form.FieldErrors />
				</Form.Field>
			</div>
			<!-- SUMMARY -->
			<div class="mx-6 flex gap-2">
				<input
					type="text"
					readonly
					class="w-full rounded-md border-2 border-slate-500 bg-slate-900 px-3 py-1 text-sm"
					placeholder={`MPG: ${mpg}`}
				/>
				<input
					type="text"
					class="w-full rounded-md border-2 border-slate-500 bg-slate-900 px-3 py-1 text-sm"
					placeholder={`PPG: ${ppg}`}
				/>
			</div>
		</Card.Content>
		<Card.Footer class="flex justify-center">
			<Form.Button
				class={`w-1/2 ${isSuccess && 'from-emerald-800 to-emerald-700'}`}
				disabled={isSuccess}>{isSuccess ? 'SENT!' : 'SUBMIT'}</Form.Button
			>
		</Card.Footer>
	</form>
</Card.Root>
