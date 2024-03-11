<script lang="ts">
  import { page } from "$app/stores";
  import "../app.pcss";
</script>

<div class="container mx-auto">
  <h1 class="text-4xl mt-4">
    {$page.status}: {$page.error?.message}
  </h1>
</div>
