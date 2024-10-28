<script lang="ts">
	import * as Button from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils';

	let { ref = $bindable(null), class: className = '', ...restProps }: Button.Props = $props();

	const defaultClasses =
		'bg-gradient-to-b from-blue-700 to-blue-600 font-bold uppercase text-white';
</script>

<Button.Root bind:ref type="submit" class={cn(defaultClasses, className)} {...restProps} />
