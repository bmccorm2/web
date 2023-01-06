<script lang="ts">
	import '../app.css';
	import { page } from '$app/stores';

	let navMenu: HTMLElement;

	const routes = [
		{
			location: '/consumption/1',
			description: 'Consumption'
		},
		{
			location: '/yields',
			description: 'Yields'
		},
		{
			location: '/cars/3',
			description: 'Cars'
		},
		{
			location: '/snake',
			description: 'Snake'
		},
		{
			location: '/life',
			description: 'Life'
		}
	];

	const showMenu = () => {
		navMenu.classList.contains('hidden')
			? navMenu.classList.remove('hidden')
			: navMenu.classList.add('hidden');
	};
</script>

<div class="bg-slate-800 p-4 md:flex items-center">
	<a href="/" class="hidden md:inline-block">
		<img src="/svelte.png" alt="svelte" />
	</a>
	<div class="md:flex md:justify-end w-full">
		<div class="md:hidden cursor-pointer">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				on:keypress
				on:click={showMenu}
				fill="currentColor"
				class="bi bi-list"
				viewBox="0 0 16 16"
			>
				<path
					fill-rule="evenodd"
					d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"
				/>
			</svg>
		</div>
		<ul class="md:flex text-center hidden" bind:this={navMenu}>
			{#each routes as { location, description }}
				{@const currentLocation = $page.url.pathname.split('/')[1]}
				<li
					class="mx-4 border-slate-200 text-slate-200"
					class:border-b-4={currentLocation != '' &&
						location.indexOf(currentLocation) != -1}
				>
					<a class="font-bold" href={location}>{description}</a>
				</li>
			{/each}
		</ul>
	</div>
</div>

<slot />
