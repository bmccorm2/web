<script>import "../app.css";
import Navbar from "$lib/Navbar.svelte";
import { ModeWatcher } from "mode-watcher";
import "../app.pcss";</script>

<ModeWatcher></ModeWatcher>
<Navbar></Navbar>
<div class="md:container">
  <slot></slot>
</div>
