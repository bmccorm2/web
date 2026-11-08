<script lang="ts">
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';
	import { api } from '../../../../convex/_generated/api';
	import type { Id } from '../../../../convex/_generated/dataModel';
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { getMaintenanceContext } from '../../context';
	import ConfirmDelete from '../../ConfirmDelete.svelte';
	import RecordForm from '../RecordForm.svelte';
	import { draftFromRecord, type RecordPayload } from '../record';

	const ctx = getMaintenanceContext();
	const client = useConvexClient();

	const id = $derived(page.params.id as Id<'ServiceRecords'>);
	const record = useQuery(api.serviceRecords.get, () => ({ id }));

	let confirmOpen = $state(false);
	let deleting = $state(false);

	async function save(payload: RecordPayload) {
		try {
			await client.mutation(api.serviceRecords.update, { ...payload, id, carId: ctx.carId });
			toast.success('Service saved');
			await goto(ctx.href('/maintenance/history'));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Save failed');
		}
	}

	async function remove() {
		deleting = true;
		try {
			await client.mutation(api.serviceRecords.remove, { id });
			toast.success('Service deleted');
			await goto(ctx.href('/maintenance/history'));
		} catch (err) {
			deleting = false;
			toast.error(err instanceof Error ? err.message : 'Delete failed');
		}
	}
</script>

<svelte:head>
	<title>Service Record</title>
</svelte:head>

<Card.Root class="mx-4 md:mx-0">
	<Card.Header>
		<Card.Title>{record.data?.title ?? 'Service record'}</Card.Title>
	</Card.Header>
	<Card.Content>
		{#if record.isLoading}
			<p class="text-center">Loading...</p>
		{:else if record.error}
			<p class="text-center font-bold text-red-500">Error loading record.</p>
		{:else if !record.data}
			{#if !deleting}
				<p class="text-center">Record not found.</p>
			{/if}
		{:else}
			{#key record.data._id}
				<RecordForm initial={draftFromRecord(record.data)} onsubmit={save}>
					{#snippet actions()}
						<Button
							variant="outline"
							href={ctx.href(`/maintenance/history/new?from=${record.data?._id}`)}>Duplicate</Button
						>
						<Button type="button" variant="destructive" onclick={() => (confirmOpen = true)}
							>Delete</Button
						>
					{/snippet}
				</RecordForm>
			{/key}
		{/if}
	</Card.Content>
</Card.Root>

<ConfirmDelete bind:open={confirmOpen} title="Delete service record?" onconfirm={remove} />
