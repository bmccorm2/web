<script lang="ts">
	import "../app.css";
	import { page } from "$app/stores";

	let navMenu: HTMLElement;

	const routes = [
		{
			location: "/consumption/1",
			description: "Consumption",
		},
		{
			location: "/books",
			description: "Books",
		},
		{
			location: "/yields",
			description: "Yields",
		},
		{
			location: "/cars/3",
			description: "Cars",
		},
		{
			location: "/snake",
			description: "Snake",
		},
		{
			location: "/life",
			description: "Life",
		},
	];
</script>

<div class="bg-zinc-800 p-4 md:flex items-center">
	<a href="/" class="hidden md:inline-block">
		<img src="/svelte.png" alt="svelte" />
	</a>
	<div class="md:flex md:justify-end w-full">
		<div class="md:hidden cursor-pointer" />
		<ul class="md:flex text-center hidden" bind:this={navMenu}>
			{#each routes as { location, description }}
				{@const currentLocation = $page.url.pathname.split("/")[1]}
				<li
					class="mx-4 border-slate-200"
					class:border-b-4={currentLocation != "" &&
						location.indexOf(currentLocation) != -1}
				>
					<a class="font-bold" href={location}>{description}</a>
				</li>
			{/each}
		</ul>
	</div>
</div>
