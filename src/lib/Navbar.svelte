<script lang="ts">
	import { page } from '$app/state';
	import { Terminal, Menu } from 'lucide-svelte';
	import { Sun, Moon } from 'lucide-svelte';
	import { Button } from './components/ui/button';
	import { toggleMode } from 'mode-watcher';

	let url = $derived(page.url.pathname);
	let activeUrl = $derived(url === '/' ? '/home' : url);

	let isShowNavbar = $state(false);

	const routes = [
		{
			location: '/consumption/4',
			description: 'Consumption',
			searchPattern: '/consumption'
		},
		{
			location: '/books',
			description: 'Books',
			searchPattern: '/books'
		},
		// {
		//    location: "/yields",
		//    description: "Yields",
		//    searchPattern: "/yields",
		// },
		// {
		//    location: "/cars/3",
		//    description: "Cars",
		//    searchPattern: "/cars",
		// },
		{
			location: '/snake',
			description: 'Snake',
			searchPattern: '/snake'
		},
		{
			location: '/life',
			description: 'Life',
			searchPattern: '/life'
		},
		{
			location: '/swimming',
			description: 'Swim Workouts',
			searchPattern: '/swimming'
		}
	];

	const activeClass = 'border-b-4 dark:border-white border-black';

	function toggleNavbar() {
		isShowNavbar = !isShowNavbar;
	}
</script>

<nav class="sticky top-0 space-x-4 bg-gray-300 px-4 py-3 dark:bg-slate-800 lg:space-x-6">
	<ul class="flex items-center justify-between">
		<!-- DON'T SHOW OTHER PAGES WHEN ON SWIMMING PAGE BECAUSE IT IS PUBLIC -->
		{#if !activeUrl.startsWith('/swimming')}
			<li>
				<a href="/">
					<Terminal />
				</a>
			</li>
			<div class="md:display-block hidden space-x-4 md:flex md:items-center lg:space-x-6">
				{#each routes as { location, description, searchPattern }}
					{@const isActive = activeUrl.startsWith(searchPattern)}
					<li>
						<a
							class="text-sm font-medium hover:text-blue-500 {isActive && activeClass}"
							href={location}>{description}</a
						>
					</li>
				{/each}
			</div>
		{/if}
		<li class="pl-6">
			<Button
				onclick={toggleMode}
				variant="outline"
				size="icon"
				class="border-0 bg-gray-300 dark:bg-slate-800 dark:hover:bg-slate-900"
			>
				<Sun
					class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
				/>
				<Moon
					class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
				/>
				<span class="sr-only">Toggle theme</span>
			</Button>
		</li>
		<li class="md:hidden">
			<button onclick={toggleNavbar}>
				<Menu />
			</button>
		</li>
	</ul>
	<!-- DON'T SHOW OTHER PAGES WHEN ON SWIMMING PAGE BECAUSE IT IS PUBLIC -->
	{#if !activeUrl.startsWith('/swimming')}
		<nav class="list-none text-center md:hidden {isShowNavbar ? 'display-block' : 'hidden'}">
			{#each routes as { location, description, searchPattern }}
				{@const isActive = activeUrl.startsWith(searchPattern)}
				<li>
					<a
						class="text-sm font-medium hover:text-blue-500 {isActive && activeClass}"
						href={location}>{description}</a
					>
				</li>
			{/each}
		</nav>
	{/if}
</nav>
