<script lang="ts">
  export let header = "default title";
  export let isSuccess = false;
</script>

<div class="w-full font-bold rounded-lg bg-slate-800 border-4 border-slate-400">
  <div
    class={`rounded-b-lg uppercase p-4 text-2xl text-center  ${
      isSuccess ? "bg-emerald-700" : "bg-gradient-to-b from-sky-800 to-sky-700"
    }`}
  >
    {header}
  </div>
  <slot />
</div>
