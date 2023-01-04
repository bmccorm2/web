<script>
	import '../app.css';
	import { page } from '$app/stores';

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
</script>

<div class="bg-slate-800 p-4 flex items-center">
	<a href="/">
		<img src="/svelte.png" alt="svelte" />
	</a>
	<div class="flex justify-end w-full">
		<ul class="flex">
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

<div class="container mx-auto">
	<slot />
</div>
