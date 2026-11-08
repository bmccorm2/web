<script lang="ts">
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { prettifyError } from 'zod';
	import { toast } from 'svelte-sonner';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { api } from '../../../convex/_generated/api';
	import type { Id } from '../../../convex/_generated/dataModel';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import type { PartType } from '$lib/types';
	import { PART_KINDS, partSchema } from '$lib/zodSchemas';
	import { getMaintenanceContext } from '../context';
	import ConfirmDelete from '../ConfirmDelete.svelte';

	const ctx = getMaintenanceContext();
	const client = useConvexClient();
	const parts = useQuery(api.parts.byCar, () => ({ carId: ctx.carId }));

	const nf = new Intl.NumberFormat('en-US');

	type Draft = {
		name: string;
		kind: PartType['kind'];
		brand: string;
		partNumber: string;
		spec: string;
		defaultQuantity: number | undefined;
		unit: string;
		notes: string;
	};

	// 'new' = the add row; an Id = that row is being edited.
	let editingId = $state<Id<'Parts'> | 'new' | null>(null);
	let draft = $state<Draft>(toDraft());
	let pendingDelete = $state<PartType | null>(null);
	let confirmOpen = $state(false);

	function toDraft(p?: PartType): Draft {
		return {
			name: p?.name ?? '',
			kind: p?.kind ?? 'Part',
			brand: p?.brand ?? '',
			partNumber: p?.partNumber ?? '',
			spec: p?.spec ?? '',
			defaultQuantity: p?.defaultQuantity,
			unit: p?.unit ?? '',
			notes: p?.notes ?? ''
		};
	}

	function edit(p?: PartType) {
		editingId = p?._id ?? 'new';
		draft = toDraft(p);
	}

	const opt = (s: string) => (s.trim() ? s.trim() : undefined);

	async function save() {
		const result = partSchema.safeParse({
			name: draft.name,
			kind: draft.kind,
			brand: opt(draft.brand),
			partNumber: opt(draft.partNumber),
			spec: opt(draft.spec),
			defaultQuantity:
				typeof draft.defaultQuantity === 'number' ? draft.defaultQuantity : undefined,
			unit: opt(draft.unit),
			notes: opt(draft.notes)
		});
		if (!result.success) {
			toast.error(prettifyError(result.error));
			return;
		}
		try {
			const data = { ...result.data, carId: ctx.carId };
			if (editingId === 'new') await client.mutation(api.parts.insert, data);
			else if (editingId) await client.mutation(api.parts.update, { ...data, id: editingId });
			editingId = null;
			toast.success('Part saved');
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Save failed');
		}
	}

	function askDelete(p: PartType) {
		pendingDelete = p;
		confirmOpen = true;
	}

	async function remove() {
		if (!pendingDelete) return;
		try {
			await client.mutation(api.parts.remove, { id: pendingDelete._id });
			toast.success('Part deleted');
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Delete failed');
		}
		pendingDelete = null;
	}

	const inputClass = 'border-input bg-background w-full rounded-md border px-2 py-1 text-sm';
	const columns = ['Name', 'Kind', 'Brand', 'Part #', 'Spec', 'Qty', 'Unit', 'Notes', 'Last used'];
</script>

<svelte:head>
	<title>Parts & Fluids</title>
</svelte:head>

{#snippet editRow()}
	<tr class="border-t bg-blue-50 dark:bg-blue-950/20">
		<td class="px-1 py-1"
			><input class={inputClass} placeholder="Name" bind:value={draft.name} aria-label="Name" /></td
		>
		<td class="px-1 py-1">
			<select class={inputClass} bind:value={draft.kind} aria-label="Kind">
				{#each PART_KINDS as k (k)}<option value={k}>{k}</option>{/each}
			</select>
		</td>
		<td class="px-1 py-1"
			><input class={inputClass} bind:value={draft.brand} aria-label="Brand" /></td
		>
		<td class="px-1 py-1"
			><input class={inputClass} bind:value={draft.partNumber} aria-label="Part number" /></td
		>
		<td class="px-1 py-1"
			><input
				class={inputClass}
				placeholder="e.g. Honda MTF"
				bind:value={draft.spec}
				aria-label="Spec"
			/></td
		>
		<td class="px-1 py-1"
			><input
				class={inputClass}
				type="number"
				min="0"
				step="any"
				bind:value={draft.defaultQuantity}
				aria-label="Default quantity"
			/></td
		>
		<td class="px-1 py-1"
			><input
				class={inputClass}
				placeholder="qt, ea…"
				bind:value={draft.unit}
				aria-label="Unit"
			/></td
		>
		<td class="px-1 py-1"
			><input class={inputClass} bind:value={draft.notes} aria-label="Notes" /></td
		>
		<td class="px-1 py-1 whitespace-nowrap" colspan="2">
			<button class="text-blue-600 hover:underline dark:text-blue-400" onclick={save}>Save</button>
			<button class="text-muted-foreground ml-2 hover:underline" onclick={() => (editingId = null)}
				>Cancel</button
			>
		</td>
	</tr>
{/snippet}

<div class="px-4 md:px-0">
	<div class="mb-4 flex justify-end">
		<Button size="sm" onclick={() => edit()} disabled={editingId === 'new'}>
			<Plus class="h-4 w-4" /> Add part
		</Button>
	</div>

	{#if parts.isLoading}
		<p class="text-center">Loading...</p>
	{:else if parts.error}
		<p class="text-center font-bold text-red-500">Error loading parts.</p>
	{:else}
		<div class="overflow-x-auto">
			<table class="w-full min-w-[900px] text-sm">
				<thead class="bg-muted text-left">
					<tr>
						{#each columns as c (c)}<th class="px-2 py-2">{c}</th>{/each}
						<th class="px-2 py-2"></th>
					</tr>
				</thead>
				<tbody>
					{#if editingId === 'new'}
						{@render editRow()}
					{/if}
					{#each parts.data ?? [] as p (p._id)}
						{#if editingId === p._id}
							{@render editRow()}
						{:else}
							<tr class="hover:bg-muted/50 cursor-pointer border-t" onclick={() => edit(p)}>
								<td class="px-2 py-2 font-medium">{p.name}</td>
								<td class="px-2 py-2"><Badge variant="secondary">{p.kind}</Badge></td>
								<td class="px-2 py-2">{p.brand ?? ''}</td>
								<td class="px-2 py-2">{p.partNumber ?? ''}</td>
								<td class="px-2 py-2">{p.spec ?? ''}</td>
								<td class="px-2 py-2">{p.defaultQuantity ?? ''}</td>
								<td class="px-2 py-2">{p.unit ?? ''}</td>
								<td class="px-2 py-2">{p.notes ?? ''}</td>
								<td class="px-2 py-2 whitespace-nowrap">
									{#if p.lastUsed}
										{p.lastUsed.date} · {nf.format(p.lastUsed.mileage)} mi
									{:else}
										<span class="text-muted-foreground">Never</span>
									{/if}
								</td>
								<td class="px-2 py-2">
									<button
										class="text-red-500 hover:text-red-700"
										aria-label="Delete"
										onclick={(e) => {
											e.stopPropagation();
											askDelete(p);
										}}
									>
										<Trash2 class="h-4 w-4" />
									</button>
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
		</div>
		{#if !parts.data?.length && editingId !== 'new'}
			<p class="text-muted-foreground mt-4 text-center">No parts or fluids yet.</p>
		{:else}
			<p class="text-muted-foreground mt-2 text-xs">Click a row to edit it.</p>
		{/if}
	{/if}
</div>

<ConfirmDelete
	bind:open={confirmOpen}
	title={`Delete ${pendingDelete?.name ?? 'part'}?`}
	description="Past service records keep their copied item details."
	onconfirm={remove}
/>
