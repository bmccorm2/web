<script lang="ts">
	import * as Button from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils';

	type $$Props = Button.Props;
	type $$Events = Button.Events;
</script>

<Button.Root
	type="submit"
	on:click
	on:keydown
	{...$$restProps}
	class={cn(
		'bg-gradient-to-b from-blue-700 to-blue-600 font-bold uppercase text-white',
		$$restProps.class
	)}
>
	<slot />
</Button.Root>
