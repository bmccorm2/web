import type { Doc } from '../convex/_generated/dataModel';

export const BIRTH_YEAR = 1985;
export const PERSONS = ['Bryan', 'Jen'] as const;
export type Person = (typeof PERSONS)[number];
export type AccountType = 'Brokerage' | 'Roth' | 'IRA' | '401k';
export type Account = Doc<'FinancialAccounts'>;

export const RETIREMENT_ACCESS_AGE = 59.5;
export const LADDER_SEASONING_YEARS = 5;
export const INFLATION_RATE = 0.03;

export const currentAge = (year = new Date().getFullYear()) => year - BIRTH_YEAR;

export const formatCurrency = (cents: number) =>
	new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(
		cents / 100
	);

/** Compound a balance (cents) from fromAge to toAge at an annual rate (e.g. 0.07). */
export function projectBalance(
	balance: number,
	fromAge: number,
	toAge: number,
	growthRate: number
): number {
	if (toAge <= fromAge) return balance;
	const years = toAge - fromAge;
	return Math.round(balance * Math.pow(1 + growthRate, years));
}

export interface LadderConfig {
	yearlyConversion: number; // dollars (not cents)
	startAge: number;
}

export interface ConversionRow {
	conversionAge: number;
	conversionYear: number;
	amount: number; // cents
	accessibleAge: number;
	accessibleYear: number;
}

/**
 * Build the Roth conversion ladder schedule.
 * Converts `yearlyConversion` per year from `startAge` until the IRA+401k
 * principal is exhausted or the account holder hits 59½ (no point converting
 * after that — it's already accessible).
 * ponytail: caps cumulative conversions at the current IRA+401k principal,
 * not a projected one. Ignores growth-on-converted-vs-unconverted split;
 * the projection chart handles growth separately. Good enough for a dashboard.
 */
export function buildLadder(
	ira401kCents: number,
	startAge: number,
	yearlyConversionCents: number,
	retirementAccessAge = RETIREMENT_ACCESS_AGE
): ConversionRow[] {
	const rows: ConversionRow[] = [];
	let remaining = ira401kCents;
	let age = startAge;
	while (remaining > 0 && age < retirementAccessAge) {
		const amount = Math.min(yearlyConversionCents, remaining);
		if (amount <= 0) break;
		rows.push({
			conversionAge: age,
			conversionYear: BIRTH_YEAR + age,
			amount,
			accessibleAge: age + LADDER_SEASONING_YEARS,
			accessibleYear: BIRTH_YEAR + age + LADDER_SEASONING_YEARS
		});
		remaining -= amount;
		age += 1;
	}
	return rows;
}

/** Cumulative converted principal that has seasoned by `age`. */
export function seasonedByAge(ladder: ConversionRow[], age: number): number {
	return ladder
		.filter((row) => row.accessibleAge <= age)
		.reduce((sum, row) => sum + row.amount, 0);
}

/** Cumulative converted principal made by `age` (seasoned or not). */
export function convertedByAge(ladder: ConversionRow[], age: number): number {
	return ladder
		.filter((row) => row.conversionAge <= age)
		.reduce((sum, row) => sum + row.amount, 0);
}

export function sumByType(accounts: Account[], person?: Person) {
	const filtered = person ? accounts.filter((a) => a.person === person) : accounts;
	const totals = { Brokerage: 0, Roth: 0, IRA: 0, '401k': 0 } as Record<AccountType, number>;
	for (const a of filtered) totals[a.type] += a.balance;
	return totals;
}

export function totalNetWorth(accounts: Account[], person?: Person): number {
	return (person ? accounts.filter((a) => a.person === person) : accounts).reduce(
		(s, a) => s + a.balance,
		0
	);
}

/** Projected total net worth for a person (or combined) at a given age. */
export function projectedTotal(
	accounts: Account[],
	toAge: number,
	growthRate: number,
	person?: Person
): number {
	const fromAge = currentAge();
	const pool = person ? accounts.filter((a) => a.person === person) : accounts;
	return pool.reduce((s, a) => s + projectBalance(a.balance, fromAge, toAge, growthRate), 0);
}

/**
 * Year-by-year portfolio projection supporting annual withdrawals.
 * Withdrawals start at withdrawalStartAge, inflate by INFLATION_RATE each year,
 * and are applied at end of each year after growth. Balance floors at 0.
 */
/** Signed cents: positive = inflow (inheritance, sale), negative = outflow (house, car). */
export interface LumpSum { amountCents: number; age: number; label: string; }

export function projectPortfolio(
	accounts: Account[],
	toAge: number,
	growthRate: number,
	withdrawalStartAge: number,
	yearlyWithdrawalCents: number,
	person?: Person,
	lumpSums: LumpSum[] = []
): number {
	const fromAge = currentAge();
	const pool = person ? accounts.filter((a) => a.person === person) : accounts;
	let balance = pool.reduce((s, a) => s + a.balance, 0);
	let withdrawal = yearlyWithdrawalCents;
	for (let age = fromAge; age < toAge; age++) {
		balance = Math.round(balance * (1 + growthRate));
		for (const ls of lumpSums) {
			if (ls.age === age) balance = Math.max(0, balance + ls.amountCents);
		}
		if (age >= withdrawalStartAge && withdrawal > 0) {
			balance = Math.max(0, balance - Math.round(withdrawal));
			withdrawal *= (1 + INFLATION_RATE);
		}
	}
	return balance;
}

export interface AccessTimelinePoint {
	age: number;
	brokerage: number; // green: always accessible
	ladder: number; // yellow: seasoned conversions
	retirement: number; // blue: tax-advantaged accessible at 59½
	total: number;
	// raw balances by account type (for by-type projection chart)
	rawBrokerage: number;
	rawRoth: number;
	rawIra401k: number;
	conversionTax: number; // tax owed on Roth conversion this year, paid from brokerage
	bigExpenses: number;  // total one-time expenses (house, car, etc.) deducted this year
}

/**
 * Year-by-year accessible portfolio simulation.
 * - Ladder conversions are mechanically applied each year (ira401k → roth)
 *   so all balances are real, not scheduled.
 * - Pre-59½: withdrawals from brokerage then seasoned Roth only — IRA/401k locked.
 * - Post-59½: withdrawals from brokerage → roth → ira/401k freely.
 * - Shortfall (can't cover expenses) is tracked but balances floor at 0.
 */
export function buildAccessTimeline(
	accounts: Account[],
	person: Person | undefined,
	growthRate: number,
	ladder: ConversionRow[],
	withdrawalStartAge: number = RETIREMENT_ACCESS_AGE,
	yearlyWithdrawalCents: number = 0,
	lumpSums: LumpSum[] = [],
	conversionTaxRate: number = 0,
	retirementGrowthRate: number = growthRate
): AccessTimelinePoint[] {
	const fromAge = currentAge();
	const pool = person ? accounts.filter((a) => a.person === person) : accounts;

	let brokerageBalance = pool.filter((a) => a.type === 'Brokerage').reduce((s, a) => s + a.balance, 0);
	let ira401kBalance = pool.filter((a) => a.type === 'IRA' || a.type === '401k').reduce((s, a) => s + a.balance, 0);
	let rothBalance = pool.filter((a) => a.type === 'Roth').reduce((s, a) => s + a.balance, 0);
	// Track how much of rothBalance came from seasoned conversions (accessible pre-59½)
	let seasonedRothBalance = 0;

	let withdrawal = yearlyWithdrawalCents;
	const points: AccessTimelinePoint[] = [];
	for (let age = fromAge; age <= 90; age++) {
		// Apply this year's Roth conversion (moves real money ira401k → roth)
		// Tax on the conversion is a real cash outflow paid from brokerage.
		const conversion = ladder.find((r) => r.conversionAge === age);
		let conversionTax = 0;
		if (conversion) {
			const amt = Math.min(ira401kBalance, conversion.amount);
			ira401kBalance -= amt;
			rothBalance += amt;
			conversionTax = Math.round(amt * conversionTaxRate);
			brokerageBalance = Math.max(0, brokerageBalance - conversionTax);
		}

		// Growth — brokerage at brokerageRate, retirement pools at retirementGrowthRate
		brokerageBalance = Math.round(brokerageBalance * (1 + growthRate));
		ira401kBalance = Math.round(ira401kBalance * (1 + retirementGrowthRate));
		rothBalance = Math.round(rothBalance * (1 + retirementGrowthRate));
		seasonedRothBalance = Math.round(seasonedRothBalance * (1 + retirementGrowthRate));

		// Season this year's conversion: add its grown value (it has compounded for LADDER_SEASONING_YEARS)
		const newlySeasoned = ladder.find((r) => r.accessibleAge === age);
		if (newlySeasoned) {
			const grownAmount = Math.round(newlySeasoned.amount * Math.pow(1 + retirementGrowthRate, LADDER_SEASONING_YEARS));
			seasonedRothBalance += grownAmount;
		}
		seasonedRothBalance = Math.min(seasonedRothBalance, rothBalance); // cap at actual Roth balance

		// One-time events: positive = inflow (inheritance), negative = outflow (house)
		let bigExpenses = 0;
		for (const ls of lumpSums) {
			if (ls.age === age) {
				brokerageBalance = Math.max(0, brokerageBalance + ls.amountCents);
				bigExpenses += ls.amountCents;
			}
		}

		// Withdrawals: rules depend on whether tax-advantaged accounts are accessible
		if (age >= withdrawalStartAge && withdrawal > 0) {
			let remaining = Math.round(withdrawal);

			// 1. Always draw from brokerage first
			const fromBrokerage = Math.min(brokerageBalance, remaining);
			brokerageBalance -= fromBrokerage;
			remaining -= fromBrokerage;

			if (remaining > 0) {
				if (age >= RETIREMENT_ACCESS_AGE) {
					// 59½+: full access to Roth then IRA/401k
					const fromRoth = Math.min(rothBalance, remaining);
					rothBalance -= fromRoth;
					seasonedRothBalance = Math.min(seasonedRothBalance, rothBalance);
					remaining -= fromRoth;
					if (remaining > 0) {
						ira401kBalance = Math.max(0, ira401kBalance - remaining);
					}
				} else {
					// Pre-59½: only seasoned Roth conversions are accessible
					const fromSeasoned = Math.min(seasonedRothBalance, remaining);
					rothBalance -= fromSeasoned;
					seasonedRothBalance -= fromSeasoned;
					// remaining > 0 after this = true shortfall, money is locked
				}
			}

			withdrawal *= (1 + INFLATION_RATE);
		}

		const ladderAccessible = seasonedRothBalance;
		const retirement = age >= RETIREMENT_ACCESS_AGE
			? ira401kBalance + Math.max(0, rothBalance - ladderAccessible)
			: 0;
		points.push({
			age,
			brokerage: brokerageBalance,
			ladder: ladderAccessible,
			retirement,
			total: brokerageBalance + ladderAccessible + retirement,
			rawBrokerage: brokerageBalance,
			rawRoth: rothBalance,
			rawIra401k: ira401kBalance,
			conversionTax,
			bigExpenses
		});
	}
	return points;
}

// --- self-check ---
function assertClose(a: number, b: number, msg: string) {
	if (Math.abs(a - b) > 1) throw new Error(`assert failed: ${msg} (${a} vs ${b})`);
}

export function _selfCheck() {
	// 100k at 7% for 10 years ≈ 196715.11 → 1967151 cents
	assertClose(projectBalance(10000000, 40, 50, 0.07), 19671514, 'compound');
	// No growth past target
	assertClose(projectBalance(50000, 50, 45, 0.07), 50000, 'no-past-growth');
	// Ladder seasons 5 years later
	const ladder = buildLadder(30000000, 50, 1000000); // 300k IRA, convert 10k/yr from 50
	if (ladder[0].accessibleAge !== 55) throw new Error('seasoning year wrong');
	// stops at 59½ → ages 50..59 = 10 conversions of 10k = 100k
	if (ladder.length !== 10) throw new Error(`expected 10 conversions, got ${ladder.length}`);
	assertClose(seasonedByAge(ladder, 54), 0, 'nothing seasoned at 54');
	assertClose(seasonedByAge(ladder, 55), 1000000, 'one conversion seasoned at 55');
	assertClose(seasonedByAge(ladder, 60), 6000000, 'six seasoned at 60');
}

if (import.meta.env.DEV) _selfCheck();
