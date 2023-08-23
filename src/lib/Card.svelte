<script lang="ts">
  export let header = "default title";
</script>

<div
  class="w-full text-center font-bold rounded-lg bg-slate-800 border-4 border-slate-400"
>
  <div
    class="rounded-b-lg uppercase p-4 text-2xl bg-gradient-to-b from-emerald-800 to-emerald-700"
  >
    {header}
  </div>
  <slot />
</div>
