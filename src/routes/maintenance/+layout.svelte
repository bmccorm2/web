<script lang="ts">
	import { useConvexClient, useQuery } from 'convex-svelte';
	import { toast } from 'svelte-sonner';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { api } from '../../convex/_generated/api';
	import type { Id } from '../../convex/_generated/dataModel';
	import { cn } from '$lib/utils';
	import { setMaintenanceContext } from './context';

	const { children } = $props();

	const client = useConvexClient();
	const cars = useQuery(api.cars.getOwnedCars, {});

	const carParam = $derived(page.url.searchParams.get('car'));
	const carId = $derived.by(() => {
		const list = cars.data ?? [];
		return (list.find((c) => c._id === carParam) ?? list[0])?._id as Id<'Cars'> | undefined;
	});

	let adding = $state(false);
	let newCarName = $state('');

	async function addCar(e: SubmitEvent) {
		e.preventDefault();
		if (!newCarName.trim()) return;
		try {
			const id = await client.mutation(api.cars.insert, { displayName: newCarName });
			newCarName = '';
			adding = false;
			const url = new URL(page.url);
			url.pathname = '/maintenance';
			url.search = '';
			url.searchParams.set('car', id);
			goto(url);
			toast.success('Car added');
		} catch (err) {
			toast.error(err instanceof Error ? err.message : 'Add failed');
		}
	}

	function href(path: string) {
		if (!carParam) return path;
		return `${path}${path.includes('?') ? '&' : '?'}car=${encodeURIComponent(carParam)}`;
	}

	setMaintenanceContext({
		get carId() {
			return carId as Id<'Cars'>;
		},
		href
	});

	const links = [
		{ path: '/maintenance', label: 'Profile' },
		{ path: '/maintenance/history', label: 'History' },
		{ path: '/maintenance/parts', label: 'Parts & Fluids' },
		{ path: '/maintenance/specs', label: 'Specs' },
		{ path: '/maintenance/checklists', label: 'Checklists' }
	];

	function isActive(path: string) {
		const current = page.url.pathname;
		return path === '/maintenance' ? current === path : current.startsWith(path);
	}

	function switchCar(e: Event) {
		const url = new URL(page.url);
		url.searchParams.set('car', (e.currentTarget as HTMLSelectElement).value);
		goto(url);
	}
</script>

<svelte:head>
	<title>Maintenance</title>
	<meta name="description" content="vehicle maintenance log" />
</svelte:head>

<div class="mb-4 flex flex-wrap items-center justify-between gap-4 px-4 md:px-0">
	<nav class="flex flex-wrap gap-4">
		{#each links as { path, label }}
			<a
				class={cn(
					'text-sm font-medium hover:text-blue-500',
					isActive(path) && 'border-b-4 border-black dark:border-white'
				)}
				href={href(path)}>{label}</a
			>
		{/each}
	</nav>
	<div class="flex items-center gap-2">
		{#if adding}
			<form onsubmit={addCar} class="flex gap-2">
				<!-- svelte-ignore a11y_autofocus -->
				<Input
					class="h-8 w-40"
					placeholder="Car name"
					aria-label="New car name"
					autofocus
					bind:value={newCarName}
				/>
				<Button type="submit" size="sm">Add</Button>
				<Button type="button" size="sm" variant="outline" onclick={() => (adding = false)}
					>Cancel</Button
				>
			</form>
		{:else}
			{#if (cars.data?.length ?? 0) > 1}
				<select
					class="border-input bg-background rounded-md border px-2 py-1 text-sm"
					value={carId}
					onchange={switchCar}
					aria-label="Vehicle"
				>
					{#each cars.data ?? [] as c (c._id)}
						<option value={c._id}>{c.displayName}</option>
					{/each}
				</select>
			{/if}
			<Button size="sm" variant="outline" onclick={() => (adding = true)}>Add car</Button>
		{/if}
	</div>
</div>

{#if cars.isLoading}
	<p class="text-center">Loading...</p>
{:else if cars.error}
	<p class="text-center font-bold text-red-500">Error loading vehicles.</p>
{:else if !carId}
	<p class="text-center">No vehicle yet. Use "Add car" to create one.</p>
{:else}
	{#key carId}
		{@render children()}
	{/key}
{/if}
