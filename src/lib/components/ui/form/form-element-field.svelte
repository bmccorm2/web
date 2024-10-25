<script lang="ts" module>
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { FormPathLeaves, SuperForm } from "sveltekit-superforms";
	type T = Record<string, unknown>;
	type U = unknown;
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPathLeaves<T>">
	import type { HTMLAttributes } from "svelte/elements";
	import * as FormPrimitive from "formsnap";
	import { cn } from "$lib/utils";

	type $$Props = FormPrimitive.ElementFieldProps<T, U> & HTMLAttributes<HTMLDivElement>;


	interface Props {
		form: SuperForm<T>;
		name: U;
		class?: $$Props["class"];
		children?: import('svelte').Snippet<[any]>;
	}

	let {
		form,
		name,
		class: className = undefined,
		children
	}: Props = $props();
	
</script>

<FormPrimitive.ElementField {form} {name}    >
	{#snippet children({ constraints, errors, tainted, value })}
		<div class={cn("space-y-2", className)}>
			{@render children?.({ constraints, errors, tainted, value, })}
		</div>
	{/snippet}
</FormPrimitive.ElementField>
