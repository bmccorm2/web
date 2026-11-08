<script lang="ts">
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	type Props = { open: boolean; title: string; description?: string; onconfirm: () => void };
	let {
		open = $bindable(),
		title,
		description = 'This cannot be undone.',
		onconfirm
	}: Props = $props();
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{title}</AlertDialog.Title>
			<AlertDialog.Description>{description}</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action
				onclick={onconfirm}
				class="bg-destructive text-destructive-foreground hover:bg-destructive/90"
				>Delete</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
