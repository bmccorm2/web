<script lang="ts">
	import { useQuery } from 'convex-svelte';
	import { api } from '../../convex/_generated/api';
	import { goto } from '$app/navigation';

	const cars = useQuery(api.cars.getOwnedCars, {});
	$effect(() => {
		if (cars.data) {
			goto(`/consumption/${cars.data[cars.data.length - 1]._id}`);
		}
	});
</script>
