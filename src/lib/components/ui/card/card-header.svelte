<script lang="ts">
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	class={cn(
		className,
		'flex flex-col space-y-1.5 rounded-md bg-gradient-to-b from-blue-700 to-blue-600 p-4 text-center text-2xl font-bold text-white'
	)}
	{...restProps}
>
	{@render children?.()}
</div>
