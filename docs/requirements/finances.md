# Finances — Retirement Dashboard

## Overview

Two new routes under `/finances`:

- **`/finances`** — Retirement dashboard with charts, projections, and age-based access breakdown.
- **`/finances/accounts`** — Spreadsheet-style view of all account data with inline editing and CSV/spreadsheet upload.

Both people (Bryan & Jen) born 1985. All data persisted in Convex.

---

## Data Model

### `FinancialAccounts` table

| Field       | Type                                              | Notes                                |
| ----------- | ------------------------------------------------- | ------------------------------------ |
| person      | `string`                                          | "Bryan" or "Jen"                     |
| institution | `string`                                          | e.g. "Fidelity", "Vanguard"         |
| accountId   | `string`                                          | Last 4 or label (e.g. "9815", "A5") |
| type        | `"Brokerage" \| "Roth" \| "IRA" \| "401k"`       | Account type                         |
| balance     | `number`                                          | Current balance in cents             |
| updatedAt   | `number`                                          | Timestamp of last balance update     |

### Mutations / Queries

- `finances.list` — all accounts
- `finances.upsert` — create or update a single account
- `finances.remove` — delete an account
- `finances.bulkUpsert` — replace all accounts from spreadsheet upload (delete-and-reinsert per upload)

---

## Page 1: Dashboard (`/finances`)

### Controls

- **Retirement age slider/input** — default 60, range 50–75. Drives all projections.
- **Growth rate input** — default 7%, user-adjustable (0–15%). Applied annually to all accounts in projections.
- **Person filter** — "All", "Bryan", "Jen".

### Summary Cards

| Card                  | Description                                          |
| --------------------- | ---------------------------------------------------- |
| Total Net Worth       | Sum of all account balances                          |
| Accessible Now        | Brokerage totals + Roth contribution basis (if tracked, otherwise just Brokerage) |
| Accessible at 59½     | IRA + 401k + Roth earnings                           |
| Accessible via Ladder | IRA/401k funds convertible through Roth ladder       |

### Charts & Graphs

1. **Projected Net Worth Over Time (line chart)**
   - X-axis: age (current age → 90)
   - Y-axis: projected total balance at selected growth rate
   - Separate lines for Bryan and Jen (and combined)

2. **Account Type Breakdown (donut/pie chart)**
   - Segments: Brokerage, Roth, IRA, 401k
   - Shows current balances

3. **Access Timeline (stacked bar or area chart)**
   - X-axis: age
   - Y-axis: cumulative accessible dollars at that age
   - Color-coded bands:
     - **Now (green):** Brokerage balances (projected)
     - **Roth Ladder (yellow):** IRA/401k converted amounts available 5 years after conversion (see below)
     - **59½ (blue):** All tax-advantaged accounts fully accessible

4. **Per-Person Breakdown (grouped bar chart)**
   - Side-by-side Bryan vs Jen balances by account type

### Roth Conversion Ladder Scenario

- User inputs a **yearly conversion amount** (how much to convert from IRA/401k → Roth per year).
- Conversions start at a user-selected **start age** (default: 5 years before retirement age).
- Each conversion becomes accessible (penalty-free) 5 years after conversion.
- The Access Timeline chart reflects this: converted amounts shift from "59½" band into "Roth Ladder" band at current age + 5.
- Show a simple table: conversion year → amount converted → year accessible.

---

## Page 2: Accounts Spreadsheet (`/finances/accounts`)

### Table View

Columns matching the spreadsheet: Person, Institution, Account, Type, Balance.

- Sortable by any column.
- Inline editable (click cell to edit, save on blur/enter).
- Add row button.
- Delete row (with confirmation).
- Total row at bottom.

### Spreadsheet Upload

- **Upload button** that accepts `.csv` or `.xlsx`.
- Expected columns: `Person, Institution, Account, Type, Amount`.
- On upload: preview parsed rows → confirm → `bulkUpsert` replaces all existing data.
- Parse with a lightweight client-side CSV parser (no new dep if possible; `xlsx` package only if `.xlsx` support is required).

---

## Access Rules Reference

| Account Type | Penalty-Free Access Age | Notes                                               |
| ------------ | ----------------------- | --------------------------------------------------- |
| Brokerage    | Now (any age)           | Taxable, but no withdrawal restrictions              |
| Roth IRA     | Contributions: now      | Earnings: 59½ (5-year rule applies)                  |
| Traditional IRA | 59½                  | 10% penalty before; RMDs at 73                       |
| 401k         | 59½                     | 10% penalty before; Rule of 55 if separated from employer |

Roth Ladder: convert IRA/401k → Roth, wait 5 years, withdraw converted amount penalty-free at any age.

---

## Tech Notes

- Charts: use a lightweight chart lib already in the project, or `chart.js` / `layerchart` if nothing exists.
- All dollar values stored as cents (integers) in Convex, formatted on display.
- Birth year (1985) hardcoded or stored in a simple config — no user/auth system needed for this.
- No historical balance tracking — just current snapshot projected forward.
