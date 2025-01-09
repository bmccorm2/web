<script lang="ts">
	import SwimWorkout from '$lib/SwimWorkout.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import { formatToMST } from '$lib/utilities.js';

	const { data } = $props();
</script>

<div class="mt-4">
	<Breadcrumb.Root class="mb-4">
		<Breadcrumb.List>
			<Breadcrumb.Item>
				<Breadcrumb.Link href="/swimming">Home</Breadcrumb.Link>
			</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>
				{formatToMST(data.swimWorkout.created)}
			</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>
	<SwimWorkout {...data.swimWorkout} />
</div>
