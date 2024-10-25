<script>
  import "../app.css";
import Navbar from "$lib/Navbar.svelte";
import { ModeWatcher } from "mode-watcher";
import "../app.pcss";

let { children } = $props();
</script>

<ModeWatcher></ModeWatcher>
<Navbar></Navbar>
<div class="md:container">
  {@render children()}
</div>
