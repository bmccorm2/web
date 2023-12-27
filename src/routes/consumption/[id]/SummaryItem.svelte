<script lang="ts">
  export let key: string;
  export let value: string;
</script>

<div class="bg-violet-600 text-white mx-4 my-3 p-3 rounded-lg">
  <small class="mr-2 font-light text-slate-300">{key}</small>
  <b>{value}</b>
</div>
