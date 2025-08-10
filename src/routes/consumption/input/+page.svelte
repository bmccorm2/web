<script lang="ts">
	import { inputSchema } from '$lib/zodSchemas';
	import * as Card from '$lib/components/ui/card/index.js';
	import * as z from 'zod';
	import InputIcon from './InputIcon.svelte';
	import { Fuel, StickyNote, DollarSign, CarFront } from 'lucide-svelte';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { useConvexClient } from 'convex-svelte';
	import { api } from '../../../convex/_generated/api';
	import type { Id } from '../../../convex/_generated/dataModel';

	const client = useConvexClient();
	const CAR_ID: Id<'Cars'> = 'j974gq57tzkh75gkqwqxcn0hx97n0nv8' as Id<'Cars'>;

	let isSuccess = $state(false);
	let price: number | undefined = $state();
	let gallons: number | undefined = $state();
	let miles: number | undefined = $state();
	let notes: string | undefined = $state();
	let errors = $state();

	let mpg = $derived(miles && gallons ? (miles / gallons).toFixed(2) : '');
	let ppg = $derived(price && gallons ? (price / gallons).toFixed(2) : '');

	function validateForm() {
		errors = undefined;
		const formData = {
			price,
			gallons,
			miles,
			carId: CAR_ID,
			...(notes !== undefined && { notes })
		};
		const result = inputSchema.safeParse(formData);

		if (!result.success) {
			errors = z.prettifyError(result.error);
			return false;
		}
		return true;
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		if (validateForm() && price !== undefined && gallons !== undefined && miles !== undefined) {
			const consumptionId = await client.mutation(api.consumption.insert, {
				notes,
				price,
				gallons,
				miles,
				carId: CAR_ID
			});

			if (consumptionId) {
				isSuccess = true;
				price = undefined;
				gallons = undefined;
				miles = undefined;
				notes = undefined;
			}
		}
	}
</script>

<svelte:head>
	<title>Input</title>
	<meta name="description" content="Input new consumption record" />
</svelte:head>

<Card.Root class="my-2 md:mb-0">
	<Card.Header class={`${isSuccess && 'from-emerald-800 to-emerald-700'}`}>INPUT</Card.Header>
	<form onsubmit={handleSubmit}>
		<Card.Content>
			{#if errors}
				<div class="mb-4 font-bold text-red-500">
					{errors}
				</div>
			{/if}
			<!-- PRICE -->
			<div class="mx-6 flex items-center">
				<InputIcon>
					<DollarSign />
				</InputIcon>
				<Input
					type="number"
					placeholder="Price"
					bind:value={price}
					inputmode="decimal"
					step=".01"
					class="border-2 border-slate-500"
				/>
			</div>
			<!-- GALLONS -->
			<div class="mx-6 mt-2 flex items-center">
				<InputIcon>
					<Fuel />
				</InputIcon>
				<Input
					type="number"
					placeholder="Gallons"
					bind:value={gallons}
					inputmode="decimal"
					step=".001"
					class="border-2 border-slate-500"
				/>
			</div>
			<!-- MILES -->
			<div class="mx-6 mt-2 flex items-center">
				<InputIcon>
					<CarFront />
				</InputIcon>
				<Input
					type="number"
					placeholder="Miles"
					bind:value={miles}
					inputmode="decimal"
					step=".01"
					class="border-2 border-slate-500"
				/>
			</div>
			<!-- NOTES -->
			<div class="mx-6 mt-2 mb-4 flex items-center">
				<InputIcon>
					<StickyNote />
				</InputIcon>
				<Input placeholder="Notes" bind:value={notes} class="border-2 border-slate-500" />
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
			<Button
				type="submit"
				class={`w-1/2 bg-gradient-to-b from-blue-700 to-blue-600 font-bold text-white uppercase ${isSuccess && 'bg-gradient-to-b from-emerald-800 to-emerald-700'}`}
				disabled={isSuccess}>{isSuccess ? 'SENT!' : 'SUBMIT'}</Button
			>
		</Card.Footer>
	</form>
</Card.Root>
