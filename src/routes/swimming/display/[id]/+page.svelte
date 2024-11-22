<script lang="ts">
	import SwimWorkout from "$lib/SwimWorkout.svelte";

  const {data} = $props()
</script>

<div class="mt-4">
  <SwimWorkout {...data.swimWorkout} />
</div>