<script lang="ts">
	import type { PageServerData } from './$types';
	import YieldChart from './YieldChart.svelte';

	export let data: PageServerData;
	const { yields } = data;
</script>

<div class="container mx-auto">
	<YieldChart chartData={yields} />
</div>
