<script lang="ts">
	import { untrack, type Snippet } from 'svelte';
	import { useQuery } from 'convex-svelte';
	import { prettifyError } from 'zod';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { api } from '../../../convex/_generated/api';
	import { Button } from '$lib/components/ui/button';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import { SERVICE_CATEGORIES, serviceRecordSchema } from '$lib/zodSchemas';
	import { getMaintenanceContext } from '../context';
	import { draftFromTemplate, type RecordDraft, type RecordPayload } from './record';

	type Props = {
		initial: RecordDraft;
		submitLabel?: string;
		onsubmit: (payload: RecordPayload) => Promise<void>;
		actions?: Snippet;
	};
	const { initial, submitLabel = 'Save', onsubmit, actions }: Props = $props();

	const ctx = getMaintenanceContext();
	const parts = useQuery(api.parts.byCar, () => ({ carId: ctx.carId }));
	const templates = useQuery(api.checklistTemplates.byCar, () => ({ carId: ctx.carId }));

	// The form owns a copy; parents remount it via {#key} to reset.
	let form = $state<RecordDraft>(untrack(() => $state.snapshot(initial) as RecordDraft));
	let errors = $state<string>();
	let saving = $state(false);
	let newStep = $state('');

	const selectClass = 'border-input bg-background h-9 w-full rounded-md border px-2 text-sm';
	const opt = (s: string) => (s.trim() ? s.trim() : undefined);
	const num = (n: number | undefined | null) => (typeof n === 'number' ? n : undefined);

	function applyTemplate(e: Event & { currentTarget: HTMLSelectElement }) {
		const t = templates.data?.find((t) => t._id === e.currentTarget.value);
		e.currentTarget.value = '';
		if (t) form = draftFromTemplate(t, form);
	}

	function addFromCatalog(e: Event & { currentTarget: HTMLSelectElement }) {
		const p = parts.data?.find((p) => p._id === e.currentTarget.value);
		e.currentTarget.value = '';
		if (!p) return;
		form.items.push({
			partId: p._id,
			name: p.name,
			partNumber: p.partNumber ?? '',
			quantity: p.defaultQuantity ?? 1,
			unit: p.unit ?? 'ea',
			notes: ''
		});
	}

	function addItem() {
		form.items.push({ name: '', partNumber: '', quantity: 1, unit: 'ea', notes: '' });
	}

	function addStep() {
		const text = newStep.trim();
		if (!text) return;
		form.checklist.push({ text, done: false });
		newStep = '';
	}

	async function submit(e: SubmitEvent) {
		e.preventDefault();
		errors = undefined;
		const cost = num(form.cost);
		const draft = {
			date: form.date,
			mileage: num(form.mileage),
			title: form.title.trim(),
			category: form.category,
			minderCode: opt(form.minderCode),
			cost,
			items: form.items.map((i) => ({
				name: i.name.trim(),
				partNumber: opt(i.partNumber),
				quantity: num(i.quantity),
				unit: i.unit.trim(),
				notes: opt(i.notes)
			})),
			checklist: form.checklist.length ? form.checklist : undefined,
			notes: opt(form.notes)
		};
		const result = serviceRecordSchema.safeParse(draft);
		if (!result.success) {
			errors = prettifyError(result.error);
			return;
		}
		const data = result.data;
		saving = true;
		try {
			await onsubmit({
				...data,
				cost: data.cost === undefined ? undefined : Math.round(data.cost * 100),
				items: data.items.map((item, i) => ({ ...item, partId: form.items[i].partId })),
				templateId: form.templateId
			});
		} finally {
			saving = false;
		}
	}
</script>

<form onsubmit={submit} class="grid gap-4">
	{#if errors}
		<pre class="font-bold whitespace-pre-wrap text-red-500">{errors}</pre>
	{/if}

	{#if templates.data?.length}
		<div class="grid gap-1 sm:max-w-sm">
			<Label for="rec-template">Start from template</Label>
			<select id="rec-template" class={selectClass} onchange={applyTemplate}>
				<option value="">Choose a template…</option>
				{#each templates.data as t (t._id)}
					<option value={t._id}>{t.title}</option>
				{/each}
			</select>
		</div>
	{/if}

	<div class="grid gap-3 sm:grid-cols-3">
		<div class="grid gap-1">
			<Label for="rec-date">Date</Label>
			<Input id="rec-date" type="date" required bind:value={form.date} />
		</div>
		<div class="grid gap-1">
			<Label for="rec-mileage">Mileage</Label>
			<Input
				id="rec-mileage"
				type="number"
				inputmode="numeric"
				min="0"
				step="1"
				bind:value={form.mileage}
			/>
		</div>
		<div class="grid gap-1">
			<Label for="rec-category">Category</Label>
			<select id="rec-category" class={selectClass} bind:value={form.category}>
				{#each SERVICE_CATEGORIES as c (c)}
					<option value={c}>{c}</option>
				{/each}
			</select>
		</div>
		<div class="grid gap-1 sm:col-span-3">
			<Label for="rec-title">Title</Label>
			<Input id="rec-title" bind:value={form.title} />
		</div>
		<div class="grid gap-1">
			<Label for="rec-minder">Minder code</Label>
			<Input id="rec-minder" placeholder="e.g. B13" bind:value={form.minderCode} />
		</div>
		<div class="grid gap-1">
			<Label for="rec-cost">Cost ($)</Label>
			<Input
				id="rec-cost"
				type="number"
				inputmode="decimal"
				min="0"
				step="0.01"
				bind:value={form.cost}
			/>
		</div>
	</div>

	<section class="grid gap-2">
		<div class="flex flex-wrap items-center justify-between gap-2">
			<h3 class="font-semibold">Items</h3>
			<div class="flex gap-2">
				{#if parts.data?.length}
					<select class={selectClass} onchange={addFromCatalog} aria-label="From catalog">
						<option value="">From catalog…</option>
						{#each parts.data as p (p._id)}
							<option value={p._id}>{p.name}{p.brand ? ` (${p.brand})` : ''}</option>
						{/each}
					</select>
				{/if}
				<Button type="button" variant="outline" size="sm" onclick={addItem}>Add item</Button>
			</div>
		</div>
		{#each form.items as item, i (i)}
			<div class="grid grid-cols-6 items-end gap-2 border-b pb-2 sm:grid-cols-12">
				<div class="col-span-6 grid gap-1 sm:col-span-3">
					<Label class="text-xs" for={`item-name-${i}`}>Name</Label>
					<Input id={`item-name-${i}`} bind:value={item.name} />
				</div>
				<div class="col-span-3 grid gap-1 sm:col-span-2">
					<Label class="text-xs" for={`item-pn-${i}`}>Part #</Label>
					<Input id={`item-pn-${i}`} bind:value={item.partNumber} />
				</div>
				<div class="col-span-1 grid gap-1 sm:col-span-2">
					<Label class="text-xs" for={`item-qty-${i}`}>Qty</Label>
					<Input id={`item-qty-${i}`} type="number" min="0" step="any" bind:value={item.quantity} />
				</div>
				<div class="col-span-2 grid gap-1 sm:col-span-1">
					<Label class="text-xs" for={`item-unit-${i}`}>Unit</Label>
					<Input id={`item-unit-${i}`} bind:value={item.unit} />
				</div>
				<div class="col-span-5 grid gap-1 sm:col-span-3">
					<Label class="text-xs" for={`item-notes-${i}`}>Notes</Label>
					<Input id={`item-notes-${i}`} bind:value={item.notes} />
				</div>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					aria-label="Remove item"
					onclick={() => form.items.splice(i, 1)}
				>
					<Trash2 class="h-4 w-4 text-red-500" />
				</Button>
			</div>
		{:else}
			<p class="text-muted-foreground text-sm">No items.</p>
		{/each}
	</section>

	<section class="grid gap-2">
		<h3 class="font-semibold">Checklist</h3>
		{#each form.checklist as step, i (i)}
			<div class="flex items-center gap-2">
				<Checkbox id={`step-${i}`} bind:checked={step.done} />
				<Label for={`step-${i}`} class="flex-1 font-normal">{step.text}</Label>
				<Button
					type="button"
					variant="ghost"
					size="icon"
					aria-label="Remove step"
					onclick={() => form.checklist.splice(i, 1)}
				>
					<Trash2 class="h-4 w-4 text-red-500" />
				</Button>
			</div>
		{/each}
		<div class="flex gap-2">
			<Input
				placeholder="Add step"
				bind:value={newStep}
				onkeydown={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						addStep();
					}
				}}
			/>
			<Button type="button" variant="outline" onclick={addStep}>Add</Button>
		</div>
	</section>

	<div class="grid gap-1">
		<Label for="rec-notes">Notes</Label>
		<Textarea id="rec-notes" bind:value={form.notes} />
	</div>

	<div class="flex flex-wrap gap-2">
		<Button type="submit" disabled={saving}>{submitLabel}</Button>
		{@render actions?.()}
	</div>
</form>
