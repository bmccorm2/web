<script>
	import '../app.css';
	import Navbar from '$lib/Navbar.svelte';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<ModeWatcher></ModeWatcher>
<Navbar />
<div class="md:container">
	{@render children()}
</div>
