<script>
   /**
    * @typedef {Object} Props
    * @property {import('svelte').Snippet} [children]
    */

   /** @type {Props} */
   let { children } = $props();
</script>

<span
   class="flex content-center rounded-l-md border border-white bg-gray-500 px-4 py-1"
>
   {@render children?.()}
</span>
