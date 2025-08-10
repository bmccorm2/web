<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/Navbar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import { PUBLIC_CONVEX_URL } from '$env/static/public';
	import { setupConvex } from 'convex-svelte';

	const { children } = $props();

	setupConvex(PUBLIC_CONVEX_URL);
</script>

<Toaster richColors position="top-right" />
<ModeWatcher></ModeWatcher>
<Navbar />
<div class="md:container md:mx-auto">
	{@render children()}
</div>
