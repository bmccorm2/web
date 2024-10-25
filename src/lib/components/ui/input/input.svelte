<script lang="ts">
   import { createBubbler } from 'svelte/legacy';

   const bubble = createBubbler();
   import type { HTMLInputAttributes } from "svelte/elements";
   import { cn } from "$lib/utils";
   import type { InputEvents } from ".";

   type $$Props = HTMLInputAttributes;
   type $$Events = InputEvents;

   interface Props {
      class?: $$Props["class"];
      value?: $$Props["value"];
      [key: string]: any
   }

   let { class: className = undefined, value = $bindable(undefined), ...rest }: Props = $props();
   
</script>

<input
   class={cn(
      "border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50",
      className,
   )}
   bind:value
   onblur={bubble('blur')}
   onchange={bubble('change')}
   onclick={bubble('click')}
   onfocus={bubble('focus')}
   onfocusin={bubble('focusin')}
   onfocusout={bubble('focusout')}
   onkeydown={bubble('keydown')}
   onkeypress={bubble('keypress')}
   onkeyup={bubble('keyup')}
   onmouseover={bubble('mouseover')}
   onmouseenter={bubble('mouseenter')}
   onmouseleave={bubble('mouseleave')}
   onpaste={bubble('paste')}
   oninput={bubble('input')}
   {...rest}
/>
