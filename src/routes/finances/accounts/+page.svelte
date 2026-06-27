<script lang="ts">
	import { useQuery, useConvexClient } from 'convex-svelte';
	import { api } from '../../../convex/_generated/api';
	import { formatCurrency, type AccountType, type Account } from '$lib/finances';
	import { toast } from 'svelte-sonner';
	import { Trash2, Plus, Upload } from 'lucide-svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';

	const ACCOUNT_TYPES: AccountType[] = ['Brokerage', 'Roth', 'IRA', '401k'];
	const PERSONS = ['Bryan', 'Jen'] as const;

	const accountsQuery = useQuery(api.finances.list, {});
	const client = useConvexClient();
	const accounts = $derived(accountsQuery.data ?? []);

	type SortKey = 'person' | 'institution' | 'type' | 'balance';
	let sortKey = $state<SortKey>('person');
	let sortDir = $state<1 | -1>(1);

	function toggleSort(key: SortKey) {
		if (sortKey === key) sortDir = (sortDir * -1) as 1 | -1;
		else {
			sortKey = key;
			sortDir = 1;
		}
	}

	const sorted = $derived(
		[...accounts].sort((a, b) => {
			const av = a[sortKey];
			const bv = b[sortKey];
			const cmp =
				typeof av === 'number' && typeof bv === 'number'
					? av - bv
					: String(av).localeCompare(String(bv));
			return cmp * sortDir;
		})
	);

	const totalCents = $derived(accounts.reduce((s, a) => s + a.balance, 0));

	// Inline editing
	let editingId: Account['_id'] | null = $state(null);
	let draft = $state<Partial<Account>>({});

	function startEdit(a: Account) {
		editingId = a._id;
		draft = { ...a };
	}
	function cancelEdit() {
		editingId = null;
		draft = {};
	}
	async function saveEdit() {
		if (!draft.person || !draft.institution || !draft.type) {
			toast.error('Missing fields');
			return;
		}
		await client.mutation(api.finances.upsert, {
			id: editingId ?? undefined,
			person: draft.person,
			institution: draft.institution,
			type: draft.type,
			balance: draft.balance ?? 0
		});
		cancelEdit();
		toast.success('Account saved');
	}

	// Add row
	let showAdd = $state(false);
	let newRow = $state({
		person: 'Bryan' as string,
		institution: '',
		type: 'Brokerage' as AccountType,
		balanceDollars: 0
	});
	async function addRow() {
		if (!newRow.institution) {
			toast.error('Institution is required');
			return;
		}
		await client.mutation(api.finances.upsert, {
			person: newRow.person,
			institution: newRow.institution,
			type: newRow.type,
			balance: Math.round(newRow.balanceDollars * 100)
		});
		newRow = { person: 'Bryan', institution: '', type: 'Brokerage', balanceDollars: 0 };
		showAdd = false;
		toast.success('Account added');
	}

	// Delete with confirm
	let pendingDelete: Account | null = $state(null);
	async function confirmDelete() {
		if (!pendingDelete) return;
		await client.mutation(api.finances.remove, { id: pendingDelete._id });
		pendingDelete = null;
		toast.success('Account deleted');
	}

	// CSV upload + preview
	let previewRows: { person: string; institution: string; type: AccountType; balance: number }[] | null = $state(null);

	// ponytail: minimal CSV parser. Handles quoted fields with commas/quotes.
	// No streaming — a spreadsheet upload is small. Switch to a real parser if
	// files get big or malformed-edge heavy.
	function parseCsv(text: string): string[][] {
		const rows: string[][] = [];
		let row: string[] = [];
		let field = '';
		let inQuotes = false;
		for (let i = 0; i < text.length; i++) {
			const c = text[i];
			if (inQuotes) {
				if (c === '"') {
					if (text[i + 1] === '"') {
						field += '"';
						i++;
					} else inQuotes = false;
				} else field += c;
			} else if (c === '"') inQuotes = true;
			else if (c === ',') {
				row.push(field);
				field = '';
			} else if (c === '\n' || c === '\r') {
				if (c === '\r' && text[i + 1] === '\n') i++;
				row.push(field);
				rows.push(row);
				row = [];
				field = '';
			} else field += c;
		}
		if (field.length > 0 || row.length > 0) {
			row.push(field);
			rows.push(row);
		}
		return rows.filter((r) => r.some((f) => f.trim() !== ''));
	}

	function handleUpload(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (!file) return;
		file.text().then((text) => {
			const [header, ...dataRows] = parseCsv(text);
			if (!header) {
				toast.error('Empty file');
				return;
			}
			const idx = (name: string) =>
				header.findIndex((h) => h.trim().toLowerCase() === name.toLowerCase());
			const pI = idx('person');
			const iI = idx('institution');
			const tI = idx('type');
			const amI = idx('amount');
			if (pI < 0 || iI < 0 || tI < 0 || amI < 0) {
				toast.error('CSV must have: Person, Institution, Type, Amount');
				return;
			}
			const rows = dataRows
				.map((r) => {
					const type = r[tI]?.trim() as AccountType;
					if (!ACCOUNT_TYPES.includes(type)) return null;
					return {
						person: r[pI]?.trim() || 'Bryan',
						institution: r[iI]?.trim(),
						type,
						balance: Math.round(Number(r[amI]?.replace(/[$,]/g, '')) * 100)
					};
				})
				.filter(
					(r): r is NonNullable<typeof r> =>
						r !== null && !!r.institution && !isNaN(r.balance)
				);
			previewRows = rows;
		});
		input.value = '';
	}

	async function confirmUpload() {
		if (!previewRows) return;
		await client.mutation(api.finances.bulkUpsert, { accounts: previewRows });
		toast.success(`Replaced ${previewRows.length} accounts`);
		previewRows = null;
	}

	const inputClass =
		'border-input bg-background rounded-md border px-2 py-1 text-sm w-full';
	const thClass = 'text-left text-xs font-medium uppercase text-muted-foreground py-2 px-2 cursor-pointer hover:text-foreground';
</script>

<svelte:head><title>Finances — Accounts</title></svelte:head>

<div class="w-full px-4 pb-8">
	<div class="mt-4 flex flex-wrap items-center justify-between gap-3">
		<div>
			<h1 class="text-2xl font-semibold">Accounts</h1>
			<p class="text-sm text-muted-foreground">
				<a href="/finances" class="text-blue-600 hover:underline dark:text-blue-400">← Back to dashboard</a>
			</p>
		</div>
		<div class="flex gap-2">
			<label
				class="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted"
			>
				<Upload class="h-4 w-4" /> Upload CSV
				<input type="file" accept=".csv" onchange={handleUpload} class="hidden" />
			</label>
			<button
				class="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-500"
				onclick={() => (showAdd = !showAdd)}
			>
				<Plus class="h-4 w-4" /> Add row
			</button>
		</div>
	</div>

	<!-- Upload preview -->
	{#if previewRows}
		<div class="mt-4 rounded-xl border border-yellow-300 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950/30">
			<h2 class="text-sm font-semibold">Preview — {previewRows.length} rows</h2>
			<p class="text-xs text-muted-foreground">This will replace ALL existing accounts.</p>
			<div class="mt-3 max-h-60 overflow-auto">
				<table class="w-full min-w-[420px] text-sm">
					<thead class="text-left text-xs uppercase text-muted-foreground">
						<tr><th class="py-1 pr-3">Person</th><th class="py-1 pr-3">Institution</th><th class="py-1 pr-3">Type</th><th class="py-1">Balance</th></tr>
					</thead>
					<tbody>
						{#each previewRows as r, i (i)}
							<tr class="border-t border-yellow-200 dark:border-yellow-900/50">
								<td class="py-1 pr-3">{r.person}</td>
								<td class="py-1 pr-3">{r.institution}</td>
								<td class="py-1 pr-3">{r.type}</td>
								<td class="py-1">{formatCurrency(r.balance)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
			<div class="mt-3 flex gap-2">
				<button class="rounded-md bg-red-600 px-3 py-1.5 text-sm text-white hover:bg-red-500" onclick={confirmUpload}>Replace all</button>
				<button class="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted" onclick={() => (previewRows = null)}>Cancel</button>
			</div>
		</div>
	{/if}

	<!-- Add row form -->
	{#if showAdd}
		<div class="mt-4 rounded-xl border border-border bg-card p-4">
			<h2 class="mb-3 text-sm font-semibold">New account</h2>
			<div class="grid gap-2 sm:grid-cols-4">
				<select bind:value={newRow.person} class={inputClass}>
					{#each PERSONS as p}<option value={p}>{p}</option>{/each}
				</select>
				<input bind:value={newRow.institution} placeholder="Institution" class={inputClass} />
				<select bind:value={newRow.type} class={inputClass}>
					{#each ACCOUNT_TYPES as t}<option value={t}>{t}</option>{/each}
				</select>
				<input type="number" bind:value={newRow.balanceDollars} placeholder="Balance ($)" class={inputClass} />
			</div>
			<div class="mt-3 flex gap-2">
				<button class="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-500" onclick={addRow}>Save</button>
				<button class="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-muted" onclick={() => (showAdd = false)}>Cancel</button>
			</div>
		</div>
	{/if}

	<!-- Table -->
	<div class="mt-4 overflow-x-auto rounded-xl border border-border">
		<table class="w-full min-w-[520px] text-sm">
			<thead class="bg-muted">
				<tr>
					<th class={thClass} onclick={() => toggleSort('person')}>Person</th>
					<th class={thClass} onclick={() => toggleSort('institution')}>Institution</th>
					<th class={thClass} onclick={() => toggleSort('type')}>Type</th>
					<th class={thClass} onclick={() => toggleSort('balance')}>Balance</th>
					<th class="py-2 px-2"></th>
				</tr>
			</thead>
			<tbody>
				{#each sorted as a (a._id)}
					{#if editingId === a._id}
						<tr class="border-t border-border bg-blue-50 dark:border-border dark:bg-blue-950/20">
							<td class="py-1 px-2">
								<select bind:value={draft.person} class={inputClass}>
									{#each PERSONS as p}<option value={p}>{p}</option>{/each}
								</select>
							</td>
							<td class="py-1 px-2"><input bind:value={draft.institution} class={inputClass} /></td>
							<td class="py-1 px-2">
								<select bind:value={draft.type} class={inputClass}>
									{#each ACCOUNT_TYPES as t}<option value={t}>{t}</option>{/each}
								</select>
							</td>
							<td class="py-1 px-2">
								<input
									type="number"
									value={draft.balance ? draft.balance / 100 : 0}
									oninput={(e) => (draft.balance = Math.round(Number(e.currentTarget.value) * 100))}
									class={inputClass}
								/>
							</td>
							<td class="py-1 px-2 whitespace-nowrap">
								<button class="text-blue-600 hover:underline dark:text-blue-400" onclick={saveEdit}>Save</button>
								<button class="ml-2 text-muted-foreground hover:underline" onclick={cancelEdit}>Cancel</button>
							</td>
						</tr>
					{:else}
						<tr class="border-t border-border hover:bg-muted dark:hover:bg-muted" onclick={() => startEdit(a)}>
							<td class="py-1.5 px-2">{a.person}</td>
							<td class="py-1.5 px-2">{a.institution}</td>
							<td class="py-1.5 px-2">{a.type}</td>
							<td class="py-1.5 px-2 tabular-nums">{formatCurrency(a.balance)}</td>
							<td class="py-1.5 px-2" onclick={(e) => e.stopPropagation()}>
								<button class="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300" onclick={() => (pendingDelete = a)} aria-label="Delete">
									<Trash2 class="h-4 w-4" />
								</button>
							</td>
						</tr>
					{/if}
				{/each}
			</tbody>
			<tfoot>
				<tr class="border-t-2 border-border font-semibold">
					<td colspan="3" class="py-2 px-2 text-right">Total</td>
					<td class="py-2 px-2 tabular-nums">{formatCurrency(totalCents)}</td>
					<td></td>
				</tr>
			</tfoot>
		</table>
	</div>

	{#if accounts.length === 0}
		<p class="mt-4 text-sm text-muted-foreground">No accounts yet. Add a row or upload a CSV.</p>
	{/if}
	<p class="mt-2 text-xs text-muted-foreground">Tip: click any row to edit it inline.</p>
</div>

<!-- Delete confirmation -->
<AlertDialog.Root open={!!pendingDelete} onOpenChange={(o) => { if (!o) pendingDelete = null; }}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Delete account?</AlertDialog.Title>
			<AlertDialog.Description>
				{#if pendingDelete}
					This will permanently delete <strong>{pendingDelete.person} / {pendingDelete.institution} / {pendingDelete.type}</strong>.
				{/if}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
			<AlertDialog.Action onclick={confirmDelete} class="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
