<script lang="ts">
	import { useConvexClient } from 'convex-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { api } from '../../../../convex/_generated/api';
	import type { Id } from '../../../../convex/_generated/dataModel';
	import * as Card from '$lib/components/ui/card';
	import { getMaintenanceContext } from '../../context';
	import RecordForm from '../RecordForm.svelte';
	import {
		draftFromRecord,
		draftFromTemplate,
		emptyDraft,
		type RecordDraft,
		type RecordPayload
	} from '../record';

	const ctx = getMaintenanceContext();
	const client = useConvexClient();

	// One-shot prefill from ?from=<recordId> (duplicate) or ?template=<templateId>.
	async function loadDraft(): Promise<RecordDraft> {
		const from = page.url.searchParams.get('from');
		const template = page.url.searchParams.get('template');
		try {
			if (from) {
				const r = await client.query(api.serviceRecords.get, {
					id: from as Id<'ServiceRecords'>
				});
				if (r) return draftFromRecord(r, true);
			} else if (template) {
				const t = await client.query(api.checklistTemplates.get, {
					id: template as Id<'ChecklistTemplates'>
				});
				if (t) return draftFromTemplate(t);
			}
		} catch {
			toast.error('Could not load prefill');
		}
		return emptyDraft();
	}
	const draft = $derived(loadDraft());

	async function save(payload: RecordPayload) {
		try {
			await client.mutation(api.serviceRecords.insert, { ...payload, carId: ctx.carId });
			toast.success('Service logged');
			await goto(ctx.href('/maintenance/history'));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Save failed');
		}
	}
</script>

<svelte:head>
	<title>Log Service</title>
</svelte:head>

<Card.Root class="mx-4 md:mx-0">
	<Card.Header>
		<Card.Title>Log service</Card.Title>
	</Card.Header>
	<Card.Content>
		{#await draft}
			<p class="text-center">Loading...</p>
		{:then initial}
			<RecordForm {initial} onsubmit={save} />
		{/await}
	</Card.Content>
</Card.Root>
