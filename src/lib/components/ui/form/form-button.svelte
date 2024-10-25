<script lang="ts">
	import * as Button from "$lib/components/ui/button";
	interface Props {
		children?: import('svelte').Snippet;
		[key: string]: any
	}

	let { children, ...rest }: Props = $props();

	type $$Props = Button.Props;
</script>

<Button.Root type="submit" {...rest}>
	{@render children?.()}
</Button.Root>
