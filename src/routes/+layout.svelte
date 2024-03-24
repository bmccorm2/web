<script>
   import Navbar from "$lib/Navbar.svelte";
   import "../app.pcss";
</script>

<Navbar />
<div class="md:container">
   <slot />
</div>
