<script lang="ts">
	import { useQuery } from 'convex-svelte';
	import { goto } from '$app/navigation';
	import Plus from '@lucide/svelte/icons/plus';
	import { api } from '../../../convex/_generated/api';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { formatCurrency } from '$lib/finances';
	import { SERVICE_CATEGORIES } from '$lib/zodSchemas';
	import { getMaintenanceContext } from '../context';

	const ctx = getMaintenanceContext();
	const history = useQuery(api.serviceRecords.byCar, () => ({ carId: ctx.carId }));

	const nf = new Intl.NumberFormat('en-US');

	let category = $state('');
	let search = $state('');

	const records = $derived.by(() => {
		const q = search.trim().toLowerCase();
		return (history.data?.records ?? []).filter((r) => {
			if (category && r.category !== category) return false;
			if (!q) return true;
			return [r.title, r.notes ?? '', ...r.items.map((i) => i.name)].some((s) =>
				s.toLowerCase().includes(q)
			);
		});
	});

	const years = $derived(
		Object.entries(history.data?.costByYear ?? {}).sort(([a], [b]) => b.localeCompare(a))
	);
</script>

<svelte:head>
	<title>Maintenance History</title>
</svelte:head>

<div class="fixed right-4 bottom-6 z-50 md:right-8">
	<Button
		href={ctx.href('/maintenance/history/new')}
		size="icon"
		class="h-14 w-14 rounded-full bg-pink-600 text-white shadow-lg shadow-pink-950/30 hover:bg-pink-700"
		aria-label="Log service"
	>
		<Plus class="h-6 w-6" />
	</Button>
</div>

<div class="px-4 md:px-0">
	{#if history.isLoading}
		<p class="text-center">Loading...</p>
	{:else if history.error}
		<p class="text-center font-bold text-red-500">Error loading history.</p>
	{:else}
		<div class="mb-4 flex flex-wrap items-baseline gap-x-6 gap-y-1 text-sm">
			<div>
				<span class="text-muted-foreground">Total spent</span>
				<span class="ml-1 text-lg font-bold">{formatCurrency(history.data?.totalCost ?? 0)}</span>
			</div>
			{#each years as [year, cents] (year)}
				<div>
					<span class="text-muted-foreground">{year}</span>
					<span class="ml-1 font-medium">{formatCurrency(cents)}</span>
				</div>
			{/each}
		</div>

		<div class="mb-4 flex flex-wrap gap-2">
			<select
				class="border-input bg-background rounded-md border px-2 py-1 text-sm"
				bind:value={category}
				aria-label="Category"
			>
				<option value="">All categories</option>
				{#each SERVICE_CATEGORIES as c (c)}
					<option value={c}>{c}</option>
				{/each}
			</select>
			<Input class="max-w-xs" placeholder="Search title, notes, items" bind:value={search} />
		</div>

		{#if records.length === 0}
			<p class="text-muted-foreground text-center">
				{history.data?.records.length ? 'No matching records.' : 'No service records yet.'}
			</p>
		{:else}
			<div class="overflow-x-auto">
				<table class="w-full min-w-[640px] text-sm">
					<thead class="bg-muted text-left">
						<tr>
							<th class="px-2 py-2">Date</th>
							<th class="px-2 py-2 text-right">Mileage</th>
							<th class="px-2 py-2">Title</th>
							<th class="px-2 py-2">Category</th>
							<th class="px-2 py-2">Minder</th>
							<th class="px-2 py-2 text-right">Cost</th>
							<th class="px-2 py-2 text-right">Items</th>
						</tr>
					</thead>
					<tbody>
						{#each records as r (r._id)}
							<tr
								class="hover:bg-muted/50 cursor-pointer border-t"
								onclick={() => goto(ctx.href(`/maintenance/history/${r._id}`))}
							>
								<td class="px-2 py-2 whitespace-nowrap">{r.date}</td>
								<td class="px-2 py-2 text-right">{nf.format(r.mileage)}</td>
								<td class="px-2 py-2">
									<a
										class="font-medium hover:text-blue-500"
										href={ctx.href(`/maintenance/history/${r._id}`)}>{r.title}</a
									>
								</td>
								<td class="px-2 py-2"><Badge variant="secondary">{r.category}</Badge></td>
								<td class="px-2 py-2">{r.minderCode ?? ''}</td>
								<td class="px-2 py-2 text-right"
									>{r.cost !== undefined ? formatCurrency(r.cost) : ''}</td
								>
								<td class="px-2 py-2 text-right">{r.items.length}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		{/if}
	{/if}
</div>
