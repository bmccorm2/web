<script lang="ts">
	import { useQuery, useConvexClient } from 'convex-svelte';
	import { api } from '../../convex/_generated/api';
	import Chart from '$lib/Chart.svelte';
	import {
		BIRTH_YEAR,
		PERSONS,
		INFLATION_RATE,
		currentAge,
		formatCurrency,
		sumByType,
		totalNetWorth,
		projectedTotal,
		projectPortfolio,
		buildLadder,
		buildAccessTimeline,
		type Person,
		type ConversionRow,
		type LumpSum
	} from '$lib/finances';
	import type { ChartConfiguration } from 'chart.js';

	const accountsQuery = useQuery(api.finances.list, {});
	const client = useConvexClient();
	const accounts = $derived(accountsQuery.data ?? []);

	const fmt = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

	// Load persisted inputs from localStorage
	function loadStored(): Record<string, unknown> {
		if (typeof localStorage === 'undefined') return {};
		try { return JSON.parse(localStorage.getItem('finances-inputs') ?? '{}'); } catch { return {}; }
	}
	const s = loadStored();

	let retirementAge = $state<number>((s.retirementAge as number) ?? 45);
	let brokerageGrowthRatePct = $state<number>((s.brokerageGrowthRatePct as number) ?? 7);
	let retirementGrowthRatePct = $state<number>((s.retirementGrowthRatePct as number) ?? 10);
	let inflationAdjusted = $state<boolean>((s.inflationAdjusted as boolean) ?? true);
	let yearlyWithdrawalDollars = $state<number>((s.yearlyWithdrawalDollars as number) ?? 100000);
	let personFilter = $state<'All' | Person>((s.personFilter as 'All' | Person) ?? 'All');
	let yearlyConversionDollars = $state<number>((s.yearlyConversionDollars as number) ?? 50000);
	let conversionTaxRatePct = $state<number>((s.conversionTaxRatePct as number) ?? 22);
	let ladderStartAge = $state<number>((s.ladderStartAge as number) ?? 45);
	let expenses = $state<LumpSum[]>(
		(s.expenses as LumpSum[]) ?? [{ label: 'House', amountCents: -50000000, age: 45 }]
	);

	let withdrawalText = $state(fmt.format(yearlyWithdrawalDollars));
	let conversionText = $state(fmt.format(yearlyConversionDollars));

	// Persist all inputs to localStorage whenever they change
	$effect(() => {
		localStorage.setItem('finances-inputs', JSON.stringify({
			retirementAge, brokerageGrowthRatePct, retirementGrowthRatePct, inflationAdjusted,
			yearlyWithdrawalDollars, personFilter, yearlyConversionDollars, conversionTaxRatePct,
			ladderStartAge, expenses
		}));
	});

	let newLabel = $state('');
	let newAmountDollars = $state(0);
	let newAge = $state(45);

	function addExpense() {
		if (!newLabel.trim() || newAmountDollars === 0) return;
		expenses = [...expenses, { label: newLabel.trim(), amountCents: Math.round(newAmountDollars * 100), age: newAge }];
		newLabel = '';
		newAmountDollars = 0;
		newAge = retirementAge;
	}
	function removeExpense(i: number) {
		expenses = expenses.filter((_, idx) => idx !== i);
	}

	function handleMoneyInput(e: Event & { currentTarget: HTMLInputElement }, set: (v: number) => void) {
		const raw = e.currentTarget.value.replace(/[^0-9]/g, '');
		const num = Number(raw) || 0;
		set(num);
		const formatted = raw === '' ? '' : fmt.format(num);
		e.currentTarget.value = formatted;
	}
	let controlsOpen = $state(true);

	function onkeydown(e: KeyboardEvent) {
		if (e.key === 'i' && !e.metaKey && !e.ctrlKey && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement) && !(e.target instanceof HTMLSelectElement)) {
			controlsOpen = !controlsOpen;
		}
	}

	// ponytail: subtract standard 3% inflation when checked, applied per rate
	const brokerageGrowthRate = $derived(
		Math.max(0, brokerageGrowthRatePct / 100 - (inflationAdjusted ? INFLATION_RATE : 0))
	);
	const retirementGrowthRate = $derived(
		Math.max(0, retirementGrowthRatePct / 100 - (inflationAdjusted ? INFLATION_RATE : 0))
	);
	// blended rate for simple projection charts (weighted by account balance)
	const growthRate = $derived(brokerageGrowthRate);
	const yearlyWithdrawalCents = $derived(Math.round(yearlyWithdrawalDollars * 100));
	const yearlyConversionCents = $derived(Math.round(yearlyConversionDollars * 100));
	const conversionTaxRate = $derived(conversionTaxRatePct / 100);
	const age = $derived(currentAge());

	const filteredAccounts = $derived(
		personFilter === 'All'
			? accounts
			: accounts.filter((a) => a.person === personFilter)
	);

	const totals = $derived(sumByType(filteredAccounts));
	const netWorth = $derived(totalNetWorth(filteredAccounts));

	const ira401kCents = $derived(totals.IRA + totals['401k']);
	const ladder: ConversionRow[] = $derived(
		buildLadder(ira401kCents, ladderStartAge, yearlyConversionCents, 60)
	);

	// Summary cards
	const accessibleNow = $derived(totals.Brokerage); // Roth basis not tracked
	// projected tax-advantaged balance at retirement age (grows until then)
	const accessibleAtRetirement = $derived(
		projectPortfolio(filteredAccounts, retirementAge, growthRate, retirementAge, yearlyWithdrawalCents, undefined, expenses)
	);
	const accessibleViaLadder = $derived(
		ladder.reduce((s, r) => s + r.amount, 0)
	);

	// --- Chart 1: projected net worth over time ---
	const agesAxis = $derived(Array.from({ length: 90 - age + 1 }, (_, i) => age + i));
	const projectionConfig = $derived(
		(() => {
			const persons: ('All' | Person)[] =
				personFilter === 'All' ? ['Bryan', 'Jen', 'All'] : [personFilter];
			const datasets = persons.map((p, i) => ({
				label: p === 'All' ? 'Combined' : p,
				data: agesAxis.map((a) => projectPortfolio(accounts, a, growthRate, retirementAge, yearlyWithdrawalCents, p === 'All' ? undefined : p, expenses)),
				borderColor: ['#3b82f6', '#ec4899', '#22c55e'][i],
				backgroundColor: ['#3b82f6', '#ec4899', '#22c55e'][i],
				tension: 0.25,
				fill: false
			}));
			return {
				type: 'line',
				data: { labels: agesAxis, datasets },
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						tooltip: {
							callbacks: { label: (c) => `${c.dataset.label}: ${formatCurrency(Number(c.parsed.y))}` }
						}
					},
					scales: {
						x: { title: { display: true, text: 'Age' } },
						y: {
							ticks: { callback: (v) => formatCurrency(Number(v)) }
						}
					}
				}
			} as ChartConfiguration;
		})()
	);

	// --- Chart 2: account type donut ---
	const donutConfig = $derived(
		({
			type: 'doughnut',
			data: {
				labels: ['Brokerage', 'Roth', 'IRA', '401k'],
				datasets: [
					{
						data: [totals.Brokerage, totals.Roth, totals.IRA, totals['401k']],
						backgroundColor: ['#22c55e', '#f97316', '#3b82f6', '#a855f7']
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { position: 'bottom' },
					tooltip: {
						callbacks: { label: (c) => `${c.label}: ${formatCurrency(Number(c.raw))}` }
					}
				}
			}
		}) as ChartConfiguration
	);

	// --- Chart 3: access timeline (stacked area) ---
	const timeline = $derived(
		buildAccessTimeline(
			accounts,
			personFilter === 'All' ? undefined : personFilter,
			brokerageGrowthRate,
			ladder,
			retirementAge,
			yearlyWithdrawalCents,
			expenses,
			conversionTaxRate,
			retirementGrowthRate
		)
	);
	const timelineConfig = $derived(
		({
			type: 'line',
			data: {
				labels: timeline.map((p) => p.age),
				datasets: [
					{
						label: 'Now (Brokerage)',
						data: timeline.map((p) => p.brokerage),
						backgroundColor: 'rgba(34,197,94,0.5)',
						borderColor: '#22c55e',
						fill: true,
						tension: 0.25
					},
					{
						label: 'Roth Ladder',
						data: timeline.map((p) => p.ladder),
						backgroundColor: 'rgba(234,179,8,0.5)',
						borderColor: '#eab308',
						fill: true,
						tension: 0.25
					},
					{
						label: '59½ (Tax-advantaged)',
						data: timeline.map((p) => p.retirement),
						backgroundColor: 'rgba(59,130,246,0.5)',
						borderColor: '#3b82f6',
						fill: true,
						tension: 0.25
					}
				]
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: {
					x: { stacked: true, title: { display: true, text: 'Age' } },
					y: {
						stacked: true,
						ticks: { callback: (v) => formatCurrency(Number(v)) }
					}
				},
				plugins: {
					tooltip: {
						callbacks: { label: (c) => `${c.dataset.label}: ${formatCurrency(Number(c.parsed.y))}` }
					}
				}
			}
		}) as ChartConfiguration
	);

	// --- Chart 4: per-person grouped bar ---
	const perPersonConfig = $derived(
		({
			type: 'bar',
			data: {
				labels: ['Brokerage', 'Roth', 'IRA', '401k'],
				datasets: PERSONS.map((p, i) => ({
					label: p,
					data: [
						sumByType(accounts, p).Brokerage,
						sumByType(accounts, p).Roth,
						sumByType(accounts, p).IRA,
						sumByType(accounts, p)['401k']
					],
					backgroundColor: i === 0 ? '#3b82f6' : '#ec4899'
				}))
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				scales: { y: { ticks: { callback: (v) => formatCurrency(Number(v)) } } },
				plugins: {
					tooltip: {
						callbacks: { label: (c) => `${c.dataset.label}: ${formatCurrency(Number(c.parsed.y))}` }
					}
				}
			}
		}) as ChartConfiguration
	);

	// Ledger: pair each timeline point with its inflation-adjusted withdrawal + any lump sum
	const ledger = $derived(
		timeline.map((p) => {
			const regularWithdrawal = (yearlyWithdrawalCents > 0 && p.age >= retirementAge)
				? Math.round(yearlyWithdrawalCents * Math.pow(1 + INFLATION_RATE, p.age - retirementAge))
				: 0;
			return { ...p, year: BIRTH_YEAR + p.age, withdrawal: regularWithdrawal, conversionTax: p.conversionTax, bigExpenses: p.bigExpenses };
		})
	);

	// --- Chart 5: projected balance by account type ---
	const byTypeConfig = $derived({
		type: 'line',
		data: {
			labels: timeline.map((p) => p.age),
			datasets: [
				{
					label: 'Brokerage',
					data: timeline.map((p) => p.rawBrokerage),
					borderColor: '#22c55e',
					backgroundColor: 'rgba(34,197,94,0.1)',
					fill: true,
					tension: 0.25
				},
				{
					label: 'Roth',
					data: timeline.map((p) => p.rawRoth),
					borderColor: '#f97316',
					backgroundColor: 'rgba(249,115,22,0.1)',
					fill: true,
					tension: 0.25
				},
				{
					label: 'IRA / 401k',
					data: timeline.map((p) => p.rawIra401k),
					borderColor: '#a855f7',
					backgroundColor: 'rgba(168,85,247,0.1)',
					fill: true,
					tension: 0.25
				}
			]
		},
		options: {
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				tooltip: {
					callbacks: { label: (c) => `${c.dataset.label}: ${formatCurrency(Number(c.parsed.y))}` }
				}
			},
			scales: {
				x: { title: { display: true, text: 'Age' } },
				y: { ticks: { callback: (v) => formatCurrency(Number(v)) } }
			}
		}
	} as ChartConfiguration);

	const cardClass =
		'rounded-lg border border-border bg-card p-4 shadow-sm';
</script>

<svelte:head><title>Finances — Retirement Dashboard</title></svelte:head>
<svelte:window {onkeydown} />

<div class="w-full px-4 pb-8">
	<div class="mt-4 flex flex-wrap items-baseline justify-between gap-2">
	<h1 class="text-2xl font-semibold">Retirement Dashboard</h1>
	<a href="/finances/accounts" class="rounded-md bg-slate-800 px-3 py-1.5 text-center text-sm text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900 dark:hover:bg-white">
		Manage accounts →
	</a>
</div>
	<p class="text-sm text-muted-foreground">
		Bryan &amp; Jen · born {BIRTH_YEAR} · current age {age}
	</p>

	<!-- Summary cards -->
	<div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
		<div class={cardClass}>
			<p class="text-xs font-medium uppercase text-muted-foreground">Total Net Worth</p>
			<p class="mt-1 text-2xl font-semibold">{formatCurrency(netWorth)}</p>
		</div>
		<div class={cardClass}>
			<p class="text-xs font-medium uppercase text-muted-foreground">Accessible Now</p>
			<p class="mt-1 text-2xl font-semibold text-green-600 dark:text-green-400">{formatCurrency(accessibleNow)}</p>
		</div>
		<div class={cardClass}>
			<p class="text-xs font-medium uppercase text-muted-foreground">Projected at age {retirementAge}</p>
			<p class="mt-1 text-2xl font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(accessibleAtRetirement)}</p>
		</div>
		<div class={cardClass}>
			<p class="text-xs font-medium uppercase text-muted-foreground">Accessible via Ladder</p>
			<p class="mt-1 text-2xl font-semibold text-amber-600 dark:text-amber-400">{formatCurrency(accessibleViaLadder)}</p>
		</div>
	</div>

	<!-- Controls (sticky) -->
	<div class="sticky top-16 z-30 mt-4 rounded-xl border border-border bg-card shadow-md">
		<button
			type="button"
			onclick={() => (controlsOpen = !controlsOpen)}
			class="flex w-full items-center justify-between px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-slate-700 dark:hover:text-slate-300"
		>
			<span>Inputs <kbd class="ml-1 rounded border border-border px-1 py-0.5 text-[10px] font-mono">i</kbd></span>
			<span class="text-base leading-none">{controlsOpen ? '▲' : '▼'}</span>
		</button>
		{#if controlsOpen}
		<div class="grid gap-4 border-t border-border p-4 md:grid-cols-3 lg:grid-cols-7">
		<label class="flex flex-col gap-1">
			<span class="text-xs font-medium uppercase text-muted-foreground">Retirement age</span>
			<input type="number" min="45" max="75" bind:value={retirementAge} class="border-input bg-background rounded-md border px-2 py-1 text-sm" />
			<input type="range" min="45" max="75" bind:value={retirementAge} class="accent-blue-500" />
		</label>
		<label class="flex flex-col gap-1">
			<span class="text-xs font-medium uppercase text-muted-foreground">Brokerage return (%)</span>
			<input type="number" min="0" max="15" step="0.1" bind:value={brokerageGrowthRatePct} class="border-input bg-background rounded-md border px-2 py-1 text-sm" />
			<input type="range" min="0" max="15" step="0.1" bind:value={brokerageGrowthRatePct} class="accent-green-500" />
		</label>
		<label class="flex flex-col gap-1">
			<span class="text-xs font-medium uppercase text-muted-foreground">Retirement return (%)</span>
			<input type="number" min="0" max="20" step="0.1" bind:value={retirementGrowthRatePct} class="border-input bg-background rounded-md border px-2 py-1 text-sm" />
			<input type="range" min="0" max="20" step="0.1" bind:value={retirementGrowthRatePct} class="accent-blue-500" />
		</label>
		<label class="flex flex-col gap-1">
			<span class="text-xs font-medium uppercase text-muted-foreground">Person</span>
			<select bind:value={personFilter} class="border-input bg-background rounded-md border px-2 py-1 text-sm">
				<option value="All">All</option>
				<option value="Bryan">Bryan</option>
				<option value="Jen">Jen</option>
			</select>
		</label>
		<label class="flex flex-col gap-1">
			<span class="text-xs font-medium uppercase text-muted-foreground">Annual withdrawal ($)</span>
			<input
				type="text"
				value={withdrawalText}
				oninput={(e) => handleMoneyInput(e, (v) => (yearlyWithdrawalDollars = v))}
				onfocus={(e) => e.currentTarget.select()}
				class="border-input bg-background rounded-md border px-2 py-1 text-sm"
			/>
			<span class="text-xs text-muted-foreground">after retirement age</span>
		</label>
		<label class="flex flex-col gap-1">
			<span class="text-xs font-medium uppercase text-muted-foreground">Conversion tax rate (%)</span>
			<input type="number" min="0" max="50" step="1" bind:value={conversionTaxRatePct} class="border-input bg-background rounded-md border px-2 py-1 text-sm" />
			<input type="range" min="0" max="50" step="1" bind:value={conversionTaxRatePct} class="accent-blue-500" />
		</label>
		<label class="flex flex-col gap-2">
			<span class="text-xs font-medium uppercase text-muted-foreground">Inflation adjusted</span>
			<label class="flex cursor-pointer items-center gap-2">
				<input type="checkbox" bind:checked={inflationAdjusted} class="accent-blue-500 h-4 w-4" />
				<span class="text-sm">{inflationAdjusted ? `−3% inflation applied` : 'Off (nominal)'}</span>
			</label>
		</label>
		</div>

		<!-- One-time events -->
		<div class="grid gap-2 border-t border-border p-4">
			<h2 class="text-sm font-semibold">One-Time Events</h2>
			<p class="text-xs text-muted-foreground">Negative = outflow (house, car) · Positive = inflow (inheritance, sale)</p>
			<form class="flex flex-wrap items-end gap-2" onsubmit={(e) => { e.preventDefault(); addExpense(); }}>
				<label class="flex flex-col gap-1">
					<span class="text-xs text-muted-foreground">Label</span>
					<input type="text" bind:value={newLabel} placeholder="e.g. Home" class="border-input bg-background w-32 rounded-md border px-2 py-1 text-sm" />
				</label>
				<label class="flex flex-col gap-1">
					<span class="text-xs text-muted-foreground">Amount ($)</span>
					<input
						type="number"
						bind:value={newAmountDollars}
						placeholder="−500000"
						class="border-input bg-background w-36 rounded-md border px-2 py-1 text-sm"
					/>
				</label>
				<label class="flex flex-col gap-1">
					<span class="text-xs text-muted-foreground">At age</span>
					<input type="number" min={age} max="89" bind:value={newAge} class="border-input bg-background w-20 rounded-md border px-2 py-1 text-sm" />
				</label>
				<button type="submit" class="rounded-md bg-slate-800 px-3 py-1.5 text-sm text-white hover:bg-slate-700 dark:bg-slate-200 dark:text-slate-900">Add</button>
			</form>
			<div class="flex flex-col gap-1">
				{#each expenses as expense, i (i)}
					{@const inflow = expense.amountCents > 0}
					<div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
						<span class="w-32 truncate font-medium">{expense.label}</span>
						<span class="w-36 text-right {inflow ? 'text-green-600 dark:text-green-400' : 'text-orange-500 dark:text-orange-400'}">
							{inflow ? '+' : '−'}{formatCurrency(Math.abs(expense.amountCents))}
						</span>
						<span class="text-muted-foreground">at age {expense.age}</span>
						<button onclick={() => removeExpense(i)} class="ml-auto text-xs text-red-400 hover:text-red-600">Remove</button>
					</div>
				{:else}
					<p class="text-xs text-muted-foreground">No events added.</p>
				{/each}
			</div>
		</div>
		{/if}
	</div>

	{#if accounts.length === 0}
		<div class="mt-8 rounded-xl border border-dashed border-border p-12 text-center">
			<p class="text-muted-foreground">No accounts yet.</p>
			<a href="/finances/accounts" class="mt-3 inline-block rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500">Add accounts →</a>
		</div>
	{:else}
		<!-- Charts -->
		<div class="mt-4 grid gap-4 lg:grid-cols-2">
			<div class="{cardClass} lg:col-span-2">
				<h2 class="mb-2 text-sm font-semibold">Projected Balance by Account Type</h2>
				<Chart config={byTypeConfig} height={300} />
			</div>
			<div class={cardClass}>
				<h2 class="mb-2 text-sm font-semibold">Projected Net Worth Over Time</h2>
				<Chart config={projectionConfig} height={300} />
			</div>
			<div class={cardClass}>
				<h2 class="mb-2 text-sm font-semibold">Account Type Breakdown</h2>
				<Chart config={donutConfig} height={300} />
			</div>
			<div class={cardClass}>
				<h2 class="mb-2 text-sm font-semibold">Access Timeline</h2>
				<Chart config={timelineConfig} height={300} />
			</div>
			<div class={cardClass}>
				<h2 class="mb-2 text-sm font-semibold">Per-Person Breakdown</h2>
				<Chart config={perPersonConfig} height={300} />
			</div>
		</div>

		<!-- Roth ladder scenario -->
		<div class="mt-4 {cardClass}">
			<h2 class="mb-3 text-sm font-semibold">Roth Conversion Ladder</h2>
			<div class="grid gap-3 sm:grid-cols-2">
				<label class="flex flex-col gap-1">
					<span class="text-xs font-medium uppercase text-muted-foreground">Yearly conversion ($)</span>
					<input
					type="text"
					value={conversionText}
					oninput={(e) => handleMoneyInput(e, (v) => (yearlyConversionDollars = v))}
					onfocus={(e) => e.currentTarget.select()}
					class="border-input bg-background rounded-md border px-2 py-1 text-sm"
				/>
				</label>
				<label class="flex flex-col gap-1">
					<span class="text-xs font-medium uppercase text-muted-foreground">Start age</span>
					<input type="number" min={age} max="75" bind:value={ladderStartAge} class="border-input bg-background rounded-md border px-2 py-1 text-sm" />
				</label>
			</div>

			{#if ladder.length > 0}
				<div class="mt-4 overflow-x-auto">
					<table class="w-full min-w-[480px] text-sm">
						<thead class="text-left text-xs uppercase text-muted-foreground">
							<tr>
								<th class="py-1 pr-4">Conversion year</th>
								<th class="py-1 pr-4">Age</th>
								<th class="py-1 pr-4">Amount</th>
								<th class="py-1 pr-4">Accessible year</th>
								<th class="py-1">Accessible age</th>
							</tr>
						</thead>
						<tbody>
							{#each ladder as row (row.conversionAge)}
								<tr class="border-t border-border">
									<td class="py-1 pr-4">{row.conversionYear}</td>
									<td class="py-1 pr-4">{row.conversionAge}</td>
									<td class="py-1 pr-4">{formatCurrency(row.amount)}</td>
									<td class="py-1 pr-4">{row.accessibleYear}</td>
									<td class="py-1">{row.accessibleAge}</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			{:else}
				<p class="mt-4 text-sm text-muted-foreground">
					No conversions scheduled. IRA/401k total: {formatCurrency(ira401kCents)}.
				</p>
			{/if}
		</div>

		<!-- Annual ledger -->
		<div class="mt-4 {cardClass}">
			<h2 class="mb-3 text-sm font-semibold">Annual Balance Ledger</h2>
			<div class="max-h-[480px] overflow-auto">
				<table class="w-full min-w-[760px] text-sm">
					<thead class="sticky top-0 bg-card text-left text-xs uppercase text-muted-foreground">
						<tr>
							<th class="py-1 pr-4">Age</th>
							<th class="py-1 pr-4">Year</th>
							<th class="py-1 pr-4 text-right">Withdrawal</th>
							<th class="py-1 pr-4 text-right">One-Time</th>
							<th class="py-1 pr-4 text-right">Conversion Tax</th>
							<th class="py-1 pr-4 text-right">Brokerage</th>
							<th class="py-1 pr-4 text-right">Roth Ladder</th>
							<th class="py-1 pr-4 text-right">Tax-Advantaged</th>
							<th class="py-1 pr-3 text-right">Total</th>
						</tr>
					</thead>
					<tbody>
						{#each ledger as row (row.age)}
							{@const needsMoney = (row.withdrawal > 0 || row.bigExpenses > 0 || row.conversionTax > 0)}
							{@const broke = needsMoney && row.total === 0}
							{@const locked = needsMoney && !broke && row.age < 59.5 && row.brokerage === 0 && row.ladder === 0}
							<tr class="border-t border-border
								{broke ? 'bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300' : ''}
								{locked ? 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300' : ''}">
								<td class="py-1 pr-4 font-medium">{row.age}</td>
								<td class="py-1 pr-4 text-muted-foreground">{row.year}</td>
								<td class="py-1 pr-4 text-right text-red-500 dark:text-red-400">{row.withdrawal > 0 ? `−${formatCurrency(row.withdrawal)}` : '—'}</td>
							<td class="py-1 pr-4 text-right {row.bigExpenses > 0 ? 'text-green-600 dark:text-green-400' : row.bigExpenses < 0 ? 'text-orange-500 dark:text-orange-400' : ''}">
							{row.bigExpenses > 0 ? `+${formatCurrency(row.bigExpenses)}` : row.bigExpenses < 0 ? `−${formatCurrency(Math.abs(row.bigExpenses))}` : '—'}
						</td>
								<td class="py-1 pr-4 text-right text-purple-500 dark:text-purple-400">{row.conversionTax > 0 ? `−${formatCurrency(row.conversionTax)}` : '—'}</td>
								<td class="py-1 pr-4 text-right text-green-600 dark:text-green-400">{formatCurrency(row.brokerage)}</td>
								<td class="py-1 pr-4 text-right text-amber-600 dark:text-amber-400">{formatCurrency(row.ladder)}</td>
								<td class="py-1 pr-4 text-right text-blue-600 dark:text-blue-400">{formatCurrency(row.retirement)}</td>
								<td class="py-1 pr-3 text-right font-semibold">{formatCurrency(row.total)}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>


