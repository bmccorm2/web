<script lang="ts">
	import { page } from '$app/state';
</script>

<div class="container mx-auto">
	<h1 class="mt-4 text-4xl">
		{page.status}: {page.error?.message}
	</h1>
</div>
