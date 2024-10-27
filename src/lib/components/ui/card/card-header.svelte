<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<div
	class={cn(
		'flex flex-col space-y-1.5 rounded-md bg-gradient-to-b from-blue-700 to-blue-600 p-4 text-center text-2xl font-bold text-white',
		className
	)}
	{...$$restProps}
>
	<slot />
</div>
