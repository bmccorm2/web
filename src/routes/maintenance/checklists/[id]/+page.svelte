<script lang="ts">
	import { useQuery } from 'convex-svelte';
	import { page } from '$app/state';
	import { api } from '../../../../convex/_generated/api';
	import type { Id } from '../../../../convex/_generated/dataModel';
	import * as Card from '$lib/components/ui/card';
	import TemplateEditor from './TemplateEditor.svelte';

	const id = $derived(page.params.id as Id<'ChecklistTemplates'>);
	const template = useQuery(api.checklistTemplates.get, () => ({ id }));
</script>

<svelte:head>
	<title>Checklist Template</title>
</svelte:head>

<Card.Root class="mx-4 md:mx-0">
	<Card.Header>
		<Card.Title>Edit template</Card.Title>
	</Card.Header>
	<Card.Content>
		{#if template.isLoading}
			<p class="text-center">Loading...</p>
		{:else if template.error}
			<p class="text-center font-bold text-red-500">Error loading template.</p>
		{:else if !template.data}
			<p class="text-center">Template not found.</p>
		{:else}
			{#key template.data._id}
				<TemplateEditor template={template.data} />
			{/key}
		{/if}
	</Card.Content>
</Card.Root>
