<script lang="ts">
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { prettifyError } from 'zod';
	import { toast } from 'svelte-sonner';
	import Plus from '@lucide/svelte/icons/plus';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { api } from '../../../convex/_generated/api';
	import type { Id } from '../../../convex/_generated/dataModel';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { SpecType } from '$lib/types';
	import { SPEC_CATEGORIES, specSchema } from '$lib/zodSchemas';
	import { getMaintenanceContext } from '../context';
	import ConfirmDelete from '../ConfirmDelete.svelte';

	const ctx = getMaintenanceContext();
	const client = useConvexClient();
	const specs = useQuery(api.specs.byCar, () => ({ carId: ctx.carId }));

	const groups = $derived(
		SPEC_CATEGORIES.map((category) => ({
			category,
			items: (specs.data ?? []).filter((s) => s.category === category)
		})).filter((g) => g.items.length)
	);

	type Draft = {
		category: SpecType['category'];
		name: string;
		value: string;
		source: string;
		notes: string;
	};

	let editingId = $state<Id<'Specs'> | 'new' | null>(null);
	let draft = $state<Draft>(toDraft());
	let pendingDelete = $state<SpecType | null>(null);
	let confirmOpen = $state(false);

	function toDraft(s?: SpecType): Draft {
		return {
			category: s?.category ?? 'Torque',
			name: s?.name ?? '',
			value: s?.value ?? '',
			source: s?.source ?? '',
			notes: s?.notes ?? ''
		};
	}

	function edit(s?: SpecType) {
		editingId = s?._id ?? 'new';
		draft = toDraft(s);
	}

	const opt = (s: string) => (s.trim() ? s.trim() : undefined);

	async function save(e: SubmitEvent) {
		e.preventDefault();
		const result = specSchema.safeParse({
			category: draft.category,
			name: draft.name,
			value: draft.value,
			source: opt(draft.source),
			notes: opt(draft.notes)
		});
		if (!result.success) {
			toast.error(prettifyError(result.error));
			return;
		}
		try {
			const data = { ...result.data, carId: ctx.carId };
			if (editingId === 'new') await client.mutation(api.specs.insert, data);
			else if (editingId) await client.mutation(api.specs.update, { ...data, id: editingId });
			editingId = null;
			toast.success('Spec saved');
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Save failed');
		}
	}

	function askDelete(s: SpecType) {
		pendingDelete = s;
		confirmOpen = true;
	}

	async function remove() {
		if (!pendingDelete) return;
		try {
			await client.mutation(api.specs.remove, { id: pendingDelete._id });
			toast.success('Spec deleted');
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Delete failed');
		}
		pendingDelete = null;
	}

	const selectClass = 'border-input bg-background h-9 rounded-md border px-2 text-sm';
</script>

<svelte:head>
	<title>Specs</title>
</svelte:head>

{#snippet editor()}
	<form onsubmit={save} class="grid gap-2 rounded-md border bg-blue-50 p-3 dark:bg-blue-950/20">
		<div class="grid gap-2 sm:grid-cols-[auto_1fr_1fr]">
			<select class={selectClass} bind:value={draft.category} aria-label="Category">
				{#each SPEC_CATEGORIES as c (c)}<option value={c}>{c}</option>{/each}
			</select>
			<Input placeholder="Name (e.g. Lug nuts)" bind:value={draft.name} aria-label="Name" />
			{#if draft.category !== 'Procedure'}
				<Input placeholder="Value" bind:value={draft.value} aria-label="Value" />
			{/if}
		</div>
		{#if draft.category === 'Procedure'}
			<Textarea placeholder="Procedure" rows={6} bind:value={draft.value} aria-label="Value" />
		{/if}
		<div class="grid gap-2 sm:grid-cols-2">
			<Input
				placeholder="Source (e.g. manual page)"
				bind:value={draft.source}
				aria-label="Source"
			/>
			<Input placeholder="Notes" bind:value={draft.notes} aria-label="Notes" />
		</div>
		<div class="flex gap-2">
			<Button type="submit" size="sm">Save</Button>
			<Button type="button" size="sm" variant="outline" onclick={() => (editingId = null)}
				>Cancel</Button
			>
		</div>
	</form>
{/snippet}

<div class="grid gap-4 px-4 md:px-0">
	<div class="flex justify-end">
		<Button size="sm" onclick={() => edit()} disabled={editingId === 'new'}>
			<Plus class="h-4 w-4" /> Add spec
		</Button>
	</div>

	{#if editingId === 'new'}
		{@render editor()}
	{/if}

	{#if specs.isLoading}
		<p class="text-center">Loading...</p>
	{:else if specs.error}
		<p class="text-center font-bold text-red-500">Error loading specs.</p>
	{:else if groups.length === 0}
		<p class="text-muted-foreground text-center">Add values from the Honda service manual.</p>
	{:else}
		{#each groups as g (g.category)}
			<Card.Root>
				<Card.Header>
					<Card.Title>{g.category}</Card.Title>
				</Card.Header>
				<Card.Content class="grid gap-2">
					{#each g.items as s (s._id)}
						{#if editingId === s._id}
							{@render editor()}
						{:else}
							<div class="flex items-start gap-2 border-b pb-2 text-sm">
								<button class="grid flex-1 gap-0.5 text-left" onclick={() => edit(s)}>
									<span class="flex flex-wrap justify-between gap-2">
										<span class="font-medium">{s.name}</span>
										{#if s.category !== 'Procedure'}
											<span class="font-semibold">{s.value}</span>
										{/if}
									</span>
									{#if s.category === 'Procedure'}
										<span class="whitespace-pre-wrap">{s.value}</span>
									{/if}
									{#if s.source || s.notes}
										<span class="text-muted-foreground text-xs">
											{[s.source, s.notes].filter(Boolean).join(' · ')}
										</span>
									{/if}
								</button>
								<button
									class="text-red-500 hover:text-red-700"
									aria-label="Delete"
									onclick={() => askDelete(s)}
								>
									<Trash2 class="h-4 w-4" />
								</button>
							</div>
						{/if}
					{/each}
				</Card.Content>
			</Card.Root>
		{/each}
	{/if}
</div>

<ConfirmDelete
	bind:open={confirmOpen}
	title={`Delete ${pendingDelete?.name ?? 'spec'}?`}
	onconfirm={remove}
/>
