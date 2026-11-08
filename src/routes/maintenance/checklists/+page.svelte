<script lang="ts">
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';
	import Plus from '@lucide/svelte/icons/plus';
	import { api } from '../../../convex/_generated/api';
	import * as Card from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { getMaintenanceContext } from '../context';

	const ctx = getMaintenanceContext();
	const client = useConvexClient();
	const templates = useQuery(api.checklistTemplates.byCar, () => ({ carId: ctx.carId }));

	async function create() {
		try {
			const id = await client.mutation(api.checklistTemplates.insert, {
				carId: ctx.carId,
				title: 'New template',
				category: 'Other',
				steps: []
			});
			await goto(ctx.href(`/maintenance/checklists/${id}`));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Create failed');
		}
	}
</script>

<svelte:head>
	<title>Checklists</title>
</svelte:head>

<div class="grid gap-4 px-4 md:px-0">
	<div class="flex justify-end">
		<Button size="sm" onclick={create}><Plus class="h-4 w-4" /> New template</Button>
	</div>

	{#if templates.isLoading}
		<p class="text-center">Loading...</p>
	{:else if templates.error}
		<p class="text-center font-bold text-red-500">Error loading templates.</p>
	{:else if !templates.data?.length}
		<p class="text-muted-foreground text-center">No templates yet.</p>
	{:else}
		<div class="grid gap-4 md:grid-cols-2">
			{#each templates.data as t (t._id)}
				<Card.Root>
					<Card.Header class="flex items-start justify-between gap-2">
						<div class="grid gap-1">
							<Card.Title>
								<a class="hover:text-blue-500" href={ctx.href(`/maintenance/checklists/${t._id}`)}
									>{t.title}</a
								>
							</Card.Title>
							<div class="text-muted-foreground flex items-center gap-2 text-sm">
								<Badge variant="secondary">{t.category}</Badge>
								{t.steps.length} steps
							</div>
						</div>
						<div class="flex gap-2">
							<Button
								size="sm"
								variant="outline"
								href={ctx.href(`/maintenance/checklists/${t._id}`)}>Edit</Button
							>
							<Button size="sm" href={ctx.href(`/maintenance/history/new?template=${t._id}`)}
								>Log job</Button
							>
						</div>
					</Card.Header>
					{#if t.notes}
						<Card.Content class="text-sm whitespace-pre-wrap">{t.notes}</Card.Content>
					{/if}
				</Card.Root>
			{/each}
		</div>
	{/if}
</div>
