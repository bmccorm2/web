<script lang="ts">
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { prettifyError } from 'zod';
	import { toast } from 'svelte-sonner';
	import { api } from '../../convex/_generated/api';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { profileSchema } from '$lib/zodSchemas';
	import { formatCurrency } from '$lib/finances';
	import type { VehicleProfileType } from '$lib/types';
	import { getMaintenanceContext } from './context';

	const ctx = getMaintenanceContext();
	const client = useConvexClient();

	const profile = useQuery(api.vehicleProfiles.getByCar, () => ({ carId: ctx.carId }));
	const history = useQuery(api.serviceRecords.byCar, () => ({ carId: ctx.carId }));

	const lastService = $derived(history.data?.records[0]);
	const nf = new Intl.NumberFormat('en-US');

	type Form = {
		year: number | undefined;
		make: string;
		model: string;
		chassisCode: string;
		vin: string;
		color: string;
		purchaseDate: string;
		purchaseMileage: number | undefined;
		currentMileage: number | undefined;
		notes: string;
	};

	let editing = $state(false);
	let form = $state<Form>(toForm(undefined));
	let errors = $state<string>();
	let mileageInput = $state<number>();

	function toForm(p: VehicleProfileType | null | undefined): Form {
		return {
			year: p?.year,
			make: p?.make ?? '',
			model: p?.model ?? '',
			chassisCode: p?.chassisCode ?? '',
			vin: p?.vin ?? '',
			color: p?.color ?? '',
			purchaseDate: p?.purchaseDate ?? '',
			purchaseMileage: p?.purchaseMileage,
			currentMileage: p?.currentMileage,
			notes: p?.notes ?? ''
		};
	}

	const opt = (s: string) => (s.trim() ? s.trim() : undefined);
	const num = (n: number | undefined | null) => (typeof n === 'number' ? n : undefined);

	function startEdit() {
		form = toForm(profile.data);
		errors = undefined;
		editing = true;
	}

	async function save(e: SubmitEvent) {
		e.preventDefault();
		const data = {
			year: num(form.year),
			make: form.make.trim(),
			model: form.model.trim(),
			chassisCode: opt(form.chassisCode),
			vin: opt(form.vin),
			color: opt(form.color),
			purchaseDate: opt(form.purchaseDate),
			purchaseMileage: num(form.purchaseMileage),
			currentMileage: num(form.currentMileage),
			notes: opt(form.notes)
		};
		const result = profileSchema.safeParse(data);
		if (!result.success) {
			errors = prettifyError(result.error);
			return;
		}
		try {
			await client.mutation(api.vehicleProfiles.upsert, {
				...result.data,
				purchaseDate: result.data.purchaseDate || undefined,
				id: profile.data?._id,
				carId: ctx.carId
			});
			editing = false;
			toast.success('Profile saved');
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Save failed');
		}
	}

	async function updateMileage(e: SubmitEvent) {
		e.preventDefault();
		const p = profile.data;
		const m = num(mileageInput);
		if (!p || m === undefined || !Number.isInteger(m) || m < 0 || m > 1_000_000) {
			toast.error('Enter a whole number of miles');
			return;
		}
		const { _id, _creationTime, updatedAt, ...rest } = p;
		void _creationTime;
		void updatedAt;
		try {
			await client.mutation(api.vehicleProfiles.upsert, { ...rest, id: _id, currentMileage: m });
			mileageInput = undefined;
			toast.success('Mileage updated');
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Update failed');
		}
	}

	const fields: { key: keyof Form; label: string; type?: string }[] = [
		{ key: 'year', label: 'Year', type: 'number' },
		{ key: 'make', label: 'Make' },
		{ key: 'model', label: 'Model' },
		{ key: 'chassisCode', label: 'Chassis code' },
		{ key: 'vin', label: 'VIN' },
		{ key: 'color', label: 'Color' },
		{ key: 'purchaseDate', label: 'Purchase date', type: 'date' },
		{ key: 'purchaseMileage', label: 'Purchase mileage', type: 'number' },
		{ key: 'currentMileage', label: 'Current mileage', type: 'number' }
	];

	function display(p: VehicleProfileType, key: keyof Form) {
		const value = p[key];
		if (value === undefined || value === '') return '—';
		if (key === 'purchaseMileage' || key === 'currentMileage')
			return `${nf.format(Number(value))} mi`;
		return String(value);
	}
</script>

{#if profile.isLoading}
	<p class="text-center">Loading...</p>
{:else if profile.error}
	<p class="text-center font-bold text-red-500">Error loading profile.</p>
{:else}
	{@const p = profile.data}
	<div class="grid gap-4 px-4 md:grid-cols-3 md:px-0">
		<Card.Root class="md:col-span-2">
			<Card.Header class="flex items-center justify-between">
				<Card.Title
					>{#if p}{p.year} {p.make} {p.model}{p.chassisCode ? ` (${p.chassisCode})` : ''}{:else}New
						vehicle profile{/if}</Card.Title
				>
				{#if !editing}
					<Button variant="outline" size="sm" onclick={startEdit}>{p ? 'Edit' : 'Create'}</Button>
				{/if}
			</Card.Header>
			<Card.Content>
				{#if editing}
					<form onsubmit={save} class="grid gap-3">
						{#if errors}
							<pre class="font-bold whitespace-pre-wrap text-red-500">{errors}</pre>
						{/if}
						<div class="grid gap-3 sm:grid-cols-2">
							{#each fields as f (f.key)}
								<div class="grid gap-1">
									<Label for={`profile-${f.key}`}>{f.label}</Label>
									<Input id={`profile-${f.key}`} type={f.type ?? 'text'} bind:value={form[f.key]} />
								</div>
							{/each}
						</div>
						<div class="grid gap-1">
							<Label for="profile-notes">Notes</Label>
							<Textarea id="profile-notes" bind:value={form.notes} />
						</div>
						<div class="flex gap-2">
							<Button type="submit">Save</Button>
							<Button type="button" variant="outline" onclick={() => (editing = false)}
								>Cancel</Button
							>
						</div>
					</form>
				{:else if !p}
					<p class="text-muted-foreground text-sm">No profile for this car yet.</p>
				{:else}
					<dl class="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
						{#each fields as f (f.key)}
							<div class="flex justify-between gap-2 border-b py-1">
								<dt class="text-muted-foreground">{f.label}</dt>
								<dd class="font-medium">{display(p, f.key)}</dd>
							</div>
						{/each}
					</dl>
					{#if p.notes}
						<p class="mt-4 text-sm whitespace-pre-wrap">{p.notes}</p>
					{/if}
				{/if}
			</Card.Content>
		</Card.Root>

		{#if p}
			<Card.Root>
				<Card.Header>
					<Card.Title>Summary</Card.Title>
				</Card.Header>
				<Card.Content class="grid gap-4 text-sm">
					<div>
						<div class="text-muted-foreground">Current mileage</div>
						<div class="text-2xl font-bold">{nf.format(p.currentMileage)} mi</div>
					</div>
					<div>
						<div class="text-muted-foreground">Last service</div>
						{#if lastService}
							<a
								class="font-medium hover:text-blue-500"
								href={ctx.href(`/maintenance/history/${lastService._id}`)}>{lastService.title}</a
							>
							<div>{lastService.date} · {nf.format(lastService.mileage)} mi</div>
						{:else}
							<div>—</div>
						{/if}
					</div>
					<div>
						<div class="text-muted-foreground">Total spent</div>
						<div class="text-2xl font-bold">{formatCurrency(history.data?.totalCost ?? 0)}</div>
					</div>
					<form onsubmit={updateMileage} class="grid gap-1">
						<Label for="quick-mileage">Update mileage</Label>
						<div class="flex gap-2">
							<Input
								id="quick-mileage"
								type="number"
								inputmode="numeric"
								min="0"
								step="1"
								placeholder={String(p.currentMileage)}
								bind:value={mileageInput}
							/>
							<Button type="submit">Save</Button>
						</div>
					</form>
				</Card.Content>
			</Card.Root>
		{/if}
	</div>
{/if}
