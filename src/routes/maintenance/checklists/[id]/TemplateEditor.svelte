<script lang="ts">
	import { untrack } from 'svelte';
	import { useConvexClient } from 'convex-svelte';
	import { goto } from '$app/navigation';
	import { prettifyError } from 'zod';
	import { toast } from 'svelte-sonner';
	import ArrowUp from '@lucide/svelte/icons/arrow-up';
	import ArrowDown from '@lucide/svelte/icons/arrow-down';
	import Trash2 from '@lucide/svelte/icons/trash-2';
	import { api } from '../../../../convex/_generated/api';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Textarea } from '$lib/components/ui/textarea';
	import type { ChecklistTemplateType } from '$lib/types';
	import { SERVICE_CATEGORIES, templateSchema } from '$lib/zodSchemas';
	import { getMaintenanceContext } from '../../context';
	import ConfirmDelete from '../../ConfirmDelete.svelte';

	const { template }: { template: ChecklistTemplateType } = $props();

	const ctx = getMaintenanceContext();
	const client = useConvexClient();

	// Local copy; the parent remounts on a different template id.
	let form = $state(
		untrack(() => ({
			title: template.title,
			category: template.category,
			notes: template.notes ?? '',
			steps: [...template.steps]
		}))
	);
	let newStep = $state('');
	let confirmOpen = $state(false);
	let errors = $state<string>();

	function addStep() {
		const text = newStep.trim();
		if (!text) return;
		form.steps.push(text);
		newStep = '';
	}

	function move(i: number, delta: number) {
		const j = i + delta;
		if (j < 0 || j >= form.steps.length) return;
		[form.steps[i], form.steps[j]] = [form.steps[j], form.steps[i]];
	}

	async function save(e: SubmitEvent) {
		e.preventDefault();
		errors = undefined;
		const result = templateSchema.safeParse({
			title: form.title,
			category: form.category,
			steps: form.steps.map((s) => s.trim()),
			notes: form.notes.trim() || undefined
		});
		if (!result.success) {
			errors = prettifyError(result.error);
			return;
		}
		try {
			await client.mutation(api.checklistTemplates.update, {
				...result.data,
				id: template._id,
				carId: template.carId
			});
			toast.success('Template saved');
			await goto(ctx.href('/maintenance/checklists'));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Save failed');
		}
	}

	async function remove() {
		try {
			await client.mutation(api.checklistTemplates.remove, { id: template._id });
			toast.success('Template deleted');
			await goto(ctx.href('/maintenance/checklists'));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Delete failed');
		}
	}

	const selectClass = 'border-input bg-background h-9 w-full rounded-md border px-2 text-sm';
</script>

<form onsubmit={save} class="grid gap-4">
	{#if errors}
		<pre class="font-bold whitespace-pre-wrap text-red-500">{errors}</pre>
	{/if}
	<div class="grid gap-3 sm:grid-cols-3">
		<div class="grid gap-1 sm:col-span-2">
			<Label for="tpl-title">Title</Label>
			<Input id="tpl-title" bind:value={form.title} />
		</div>
		<div class="grid gap-1">
			<Label for="tpl-category">Category</Label>
			<select id="tpl-category" class={selectClass} bind:value={form.category}>
				{#each SERVICE_CATEGORIES as c (c)}<option value={c}>{c}</option>{/each}
			</select>
		</div>
	</div>

	<section class="grid gap-2">
		<h3 class="font-semibold">Steps</h3>
		<ol class="grid gap-2">
			{#each form.steps as step, i (i)}
				<li class="flex items-center gap-1">
					<span class="text-muted-foreground w-6 text-right text-sm">{i + 1}.</span>
					<Input
						value={step}
						oninput={(e) => (form.steps[i] = e.currentTarget.value)}
						aria-label={`Step ${i + 1}`}
					/>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label="Move up"
						disabled={i === 0}
						onclick={() => move(i, -1)}><ArrowUp class="h-4 w-4" /></Button
					>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label="Move down"
						disabled={i === form.steps.length - 1}
						onclick={() => move(i, 1)}><ArrowDown class="h-4 w-4" /></Button
					>
					<Button
						type="button"
						variant="ghost"
						size="icon"
						aria-label="Remove step"
						onclick={() => form.steps.splice(i, 1)}><Trash2 class="h-4 w-4 text-red-500" /></Button
					>
				</li>
			{/each}
		</ol>
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
		<Label for="tpl-notes">Notes</Label>
		<Textarea id="tpl-notes" bind:value={form.notes} />
	</div>

	<div class="flex flex-wrap gap-2">
		<Button type="submit">Save</Button>
		<Button variant="outline" href={ctx.href(`/maintenance/history/new?template=${template._id}`)}
			>Log job</Button
		>
		<Button type="button" variant="destructive" onclick={() => (confirmOpen = true)}>Delete</Button>
	</div>
</form>

<ConfirmDelete
	bind:open={confirmOpen}
	title="Delete template?"
	description="Records already logged from it keep their checklist."
	onconfirm={remove}
/>
