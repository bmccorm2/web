<script lang="ts" module>
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	import type { FormPath, SuperForm } from "sveltekit-superforms";
	type T = Record<string, unknown>;
	type U = unknown;
</script>

<script lang="ts" generics="T extends Record<string, unknown>, U extends FormPath<T>">
	import * as FormPrimitive from "formsnap";
	import { cn } from "$lib/utils";

	type $$Props = FormPrimitive.FieldsetProps<T, U>;


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

<FormPrimitive.Fieldset
	{form}
	{name}
	
	
	
	
	class={cn("space-y-2", className)}
>
	{#snippet children({ constraints, errors, tainted, value })}
		{@render children?.({ constraints, errors, tainted, value, })}
	{/snippet}
</FormPrimitive.Fieldset>
