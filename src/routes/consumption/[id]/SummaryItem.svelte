<script lang="ts">
  interface Props {
    key: string;
    value: string;
  }

  let { key, value }: Props = $props();
</script>

<div class="bg-gray-700 text-slate-100 mx-4 my-3 p-3 rounded-lg">
  <small class="mr-2 font-light text-slate-300">{key}</small>
  <b>{value}</b>
</div>
