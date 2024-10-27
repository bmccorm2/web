<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import { cn } from '$lib/utils.js';

	type $$Props = HTMLAttributes<HTMLDivElement>;

	let className: $$Props['class'] = undefined;
	export { className as class };
</script>

<div
	class={cn(
		'rounded-lg border-2 border-teal-500 bg-card text-card-foreground shadow-sm dark:bg-slate-800',
		className
	)}
	{...$$restProps}
>
	<slot />
</div>
