<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { inputSchema } from '$lib/types';
	import * as Form from '$lib/components/ui/form';
	import InputIcon from './InputIcon.svelte';
	import CarFront from 'lucide-svelte/icons/car-front';
	import DollarSign from 'lucide-svelte/icons/dollar-sign';
	import Fuel from 'lucide-svelte/icons/fuel';
	import StickyNote from 'lucide-svelte/icons/sticky-note';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Input } from '$lib/components/ui/input';
	import * as Card from '$lib/components/ui/card/index.js';
	import { toast } from 'svelte-sonner';

	let { data } = $props();

	let isSuccess = $state(false);

	const form = superForm(data.form, {
		validators: zodClient(inputSchema),
		onUpdated({ form: f }) {
			if (f.valid) {
				toast.success('Successfully created record!!');
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
	<Card.Header class={`${isSuccess && 'bg-emerald-700'}`}>INPUT</Card.Header>
	<Card.Content>
		<form action="?/create" method="post" use:enhance>
			<!-- PRICE -->
			<div class="mx-6 flex items-center">
				<InputIcon>
					<DollarSign />
				</InputIcon>
				<Form.Field {form} name="price" class="flex grow items-center">
					<Form.Control let:attrs>
						<Input
							{...attrs}
							type="number"
							placeholder="Price"
							bind:value={$formData.price}
							inputmode="decimal"
							step=".01"
							class="rounded-r-md border-2 border-slate-500 px-3 py-1 text-slate-200"
						/>
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
					<Form.Control let:attrs>
						<Input
							{...attrs}
							type="number"
							placeholder="Gallons"
							bind:value={$formData.gallons}
							inputmode="decimal"
							step=".001"
							class="rounded-r-md border-2 border-slate-500 px-3 py-1 text-slate-200"
						/>
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
					<Form.Control let:attrs>
						<Input
							{...attrs}
							type="number"
							placeholder="Miles"
							bind:value={$formData.miles}
							inputmode="decimal"
							step=".01"
							class="rounded-r-md border-2 border-slate-500 px-3 py-1 text-slate-200"
						/>
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
					<Form.Control let:attrs>
						<Input
							{...attrs}
							placeholder="Notes"
							bind:value={$formData.notes}
							class="rounded-r-md border-2 border-slate-500 px-3 py-1 text-slate-200"
						/>
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
					class="w-full rounded-md border-2 border-slate-500 px-3 py-1 text-sm"
					placeholder={`MPG: ${mpg}`}
				/>
				<input
					type="text"
					class="w-full rounded-md border-2 border-slate-500 px-3 py-1 text-sm"
					placeholder={`PPG: ${ppg}`}
				/>
			</div>
			<div class="my-4 text-center">
				<Form.Button class="w-2/3 font-bold text-white" disabled={isSuccess}>SUBMIT</Form.Button>
			</div>
		</form>
	</Card.Content>
</Card.Root>
