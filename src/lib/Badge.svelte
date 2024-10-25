<script lang="ts">
  interface Props {
    text?: string;
    textSize?: string;
  }

  let { text = "Default", textSize = "sm" }: Props = $props();
</script>

<div class="px-2 py-1 rounded-xl text-{textSize}">
  {text}
</div>
