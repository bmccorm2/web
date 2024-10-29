<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/Navbar.svelte';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';

	let { children } = $props();
</script>

<Toaster richColors />
<ModeWatcher></ModeWatcher>
<Navbar />
<div class="md:container">
	{@render children()}
</div>
