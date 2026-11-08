# Maintenance tab (2023 Honda Civic Type R, FL5)

## Goal
Add a **Maintenance** tab to the site for logging maintenance on the Type R. It covers the vehicle profile, service history (mileage, date, products, quantities, cost, notes), a parts and fluids catalog, torque and spec notes, and reusable job checklists. Logging a job should be quick, and past jobs and templates should be reusable.

## Context
- Repo: `~/src/web`. SvelteKit with Svelte 5 runes, TypeScript (strict), Tailwind 4, Convex backend in `src/convex/`, and Bits UI/shadcn components in `src/lib/components/ui/`.
- Commands: `bun run dev`, `bun run check`, `bun run lint`, `bunx convex dev` (pushes the schema and functions).
- Read `AGENTS.md` first. Rules: use runes, use `onclick` rather than `on:click`, no `any`, use `Doc`/`Id` from `src/convex/_generated/dataModel`, validate every Convex argument with `v`, and avoid `$effect` except for redirects/external sync.
- Nav: `src/lib/Navbar.svelte` defines the `routes` array.
- `src/convex/schema.ts` contains the existing `Cars` table (`displayName`, `isOwned`, `searchUrl?`).
- Reference patterns:
  - `src/routes/consumption/[id]/+page.svelte`: `useQuery` usage and the floating pink "+" button.
  - `src/routes/consumption/input/[id]/+page.svelte`: form plus `zod/mini` validation with `safeParse` and `prettifyError`.
  - `src/routes/finances/accounts/+page.svelte`: table CRUD, `AlertDialog` delete confirm, and `svelte-sonner` toasts.
- Zod schemas go in `src/lib/zodSchemas.ts` (uses `zod/mini`). Shared types go in `src/lib/types.ts`.
- The site has no auth. Keep it that way.
- Available UI components: alert, alert-dialog, badge, button, card, checkbox, drawer, dropdown-menu, form, input, label, separator, skeleton, sonner, textarea. Use native `<select>` styled with Tailwind for dropdowns.

## Decisions
- Route base is `/maintenance` with sub-routes (below). Add the nav entry **Maintenance** right after Consumption.
- All maintenance data is keyed by `carId: v.id('Cars')` so other cars can be added later.
  - Active car = `?car=<id>` query param if present, otherwise the first `VehicleProfiles` row.
  - Show a car switcher only when more than one profile exists.
- Out entirely (do not build):
  - receipt uploads and file storage
  - an upcoming/due-maintenance section (the car's Maintenance Minder handles this)
  - daily-vs-track setup comparison and setup tags
- Each service record has:
  - an optional **cost** (entered in dollars, stored as integer cents)
  - an optional **Maintenance Minder code** (free text, e.g. `B13`)
- Totals: show total spent on the profile, and total plus per-year totals on history.
- Specs (torque, capacities, pressures) start **empty**. The user fills them in from the Honda service manual. Never seed numeric specs.
- Parts/fluids catalog starts empty.
- Checklists are reusable **templates**. When a job is logged from a template, its steps are **copied** into the record as `{ text, done }`. Later template edits do not change past records. Ad-hoc steps can be added to a record.
- Seed 4 templates (steps below). They are editable after seeding. Steps say "to spec (see Specs)" instead of giving numbers.
- If a saved record's mileage is greater than the profile's `currentMileage`, update `currentMileage`. Current mileage can also be edited by hand on the profile.
- Dates are stored as `YYYY-MM-DD` strings. New records default to today's local date.
- No new dependencies.
- Do not commit. Leave changes for review.

## Data model (`src/convex/schema.ts`)
```ts
export const serviceCategory = v.union(
  v.literal('Oil'), v.literal('Transmission'), v.literal('Brakes'),
  v.literal('Tires & Wheels'), v.literal('Fluids'), v.literal('Filters'),
  v.literal('Track'), v.literal('Other')
);

VehicleProfiles: defineTable({
  carId: v.id('Cars'),
  year: v.number(), make: v.string(), model: v.string(),
  chassisCode: v.optional(v.string()),   // 'FL5'
  vin: v.optional(v.string()),
  color: v.optional(v.string()),
  purchaseDate: v.optional(v.string()),
  purchaseMileage: v.optional(v.number()),
  currentMileage: v.number(),
  notes: v.optional(v.string()),
  updatedAt: v.number()
}).index('by_carId', ['carId']),

ServiceRecords: defineTable({
  carId: v.id('Cars'),
  date: v.string(),                      // YYYY-MM-DD
  mileage: v.number(),
  title: v.string(),
  category: serviceCategory,
  minderCode: v.optional(v.string()),
  cost: v.optional(v.number()),          // cents
  items: v.array(v.object({
    partId: v.optional(v.id('Parts')),
    name: v.string(),
    partNumber: v.optional(v.string()),
    quantity: v.number(),
    unit: v.string(),                    // 'qt', 'L', 'ea', 'set', ...
    notes: v.optional(v.string())
  })),
  checklist: v.optional(v.array(v.object({ text: v.string(), done: v.boolean() }))),
  templateId: v.optional(v.id('ChecklistTemplates')),
  notes: v.optional(v.string())
}).index('by_carId_date', ['carId', 'date']),

Parts: defineTable({
  carId: v.id('Cars'),
  name: v.string(),
  kind: v.union(v.literal('Part'), v.literal('Fluid')),
  brand: v.optional(v.string()),
  partNumber: v.optional(v.string()),
  spec: v.optional(v.string()),          // e.g. 'Honda MTF'
  defaultQuantity: v.optional(v.number()),
  unit: v.optional(v.string()),
  notes: v.optional(v.string())
}).index('by_carId', ['carId']),

Specs: defineTable({
  carId: v.id('Cars'),
  category: v.union(v.literal('Torque'), v.literal('Capacity'),
                    v.literal('Pressure'), v.literal('Procedure'), v.literal('Other')),
  name: v.string(),                      // 'Lug nuts'
  value: v.string(),                     // free text, e.g. '94 lb-ft'
  source: v.optional(v.string()),        // 'Service manual p. 12-34'
  notes: v.optional(v.string())
}).index('by_carId', ['carId']),

ChecklistTemplates: defineTable({
  carId: v.id('Cars'),
  title: v.string(),
  category: serviceCategory,
  steps: v.array(v.string()),
  notes: v.optional(v.string())
}).index('by_carId', ['carId'])
```

## Seed templates
1. **Manual transmission fluid change** (Transmission): Park level and support on stands, keeping the car level → Loosen the fill plug first and confirm it comes out → Remove the drain plug, drain, and inspect the magnet for debris → Install the drain plug with a new washer to spec (see Specs) → Fill until fluid reaches the fill hole with the car level → Install the fill plug with a new washer to spec → Lower the car, check for leaks, test drive → Record the product and quantity.
2. **Rear brake service mode** (Brakes): Level ground, wheels chocked → Enter rear-brake service mode per the service manual (store the exact procedure in Specs › Procedure) → Confirm the caliper is released before removing it → Perform the brake work → Exit service mode per the service manual → Verify the parking brake applies and releases with no warning lights.
3. **Brake pads & rotors** (Brakes): Loosen lugs, lift, remove wheels → Rear only: enter rear-brake service mode → Remove the caliper and support it (do not hang it by the hose) → Remove the bracket and rotor; clean the hub face → Install the rotor, then the bracket bolts to spec → Clean and lube the slides and pad hardware; install the pads → Caliper bolts to spec → Wheels on, lugs to spec → Rear only: exit service mode → Pump the pedal; check fluid level → Bed in the pads → Record pad/rotor brand and part numbers.
4. **Track-day prep** (Track): Check pad thickness and rotor condition → Check brake fluid level and age; bleed if due → Check oil and coolant levels → Inspect tires; set cold track pressures → Torque lugs to spec → Empty the cabin and trunk of loose items → Pack tow hook, tools, helmet, and tech items → After the event: re-torque lugs, inspect brakes and tires, reset street pressures.

## Tasks
Tick each box as you finish it.

- [x] 1. **Schema**: add the tables above to `src/convex/schema.ts`. Export `serviceCategory`. Run `bunx convex dev` and confirm it deploys.
- [x] 2. **Convex functions**. All args use `v` validators.
  - [x] 2a. `src/convex/vehicleProfiles.ts`:
    - `list` returns profiles joined with `Cars.displayName`.
    - `getByCar({ carId })`
    - `upsert(...)` sets `updatedAt`.
  - [x] 2b. `src/convex/serviceRecords.ts`:
    - `byCar({ carId })` returns `{ records, totalCost, costByYear: Record<string, number> }`. Sort records newest first by date, then by mileage descending.
    - `get({ id })`, `insert`, `update`, `remove`.
    - `insert` and `update` bump `VehicleProfiles.currentMileage` when the record's mileage is higher.
  - [x] 2c. `src/convex/parts.ts`: `byCar`, `insert`, `update`, `remove`.
  - [x] 2d. `src/convex/specs.ts`: `byCar`, `insert`, `update`, `remove`.
  - [x] 2e. `src/convex/checklistTemplates.ts`: `byCar`, `get`, `insert`, `update`, `remove`.
  - [x] 2f. `src/convex/maintenanceSeed.ts`: `seed` as an `internalMutation({ carId?: v.id('Cars') })`. It must be idempotent: skip anything that already exists.
    - Find the car: use `carId` if given. Otherwise use the first `Cars` row whose `displayName` contains "type r" (case-insensitive). Otherwise insert `{ displayName: 'Type R', isOwned: true }`.
    - If the car has no `VehicleProfiles` row, insert one: `{ year: 2023, make: 'Honda', model: 'Civic Type R', chassisCode: 'FL5', currentMileage: 0 }`.
    - Insert each of the 4 seed templates if no template with that title exists for the car.
- [ ] 3. **Types and validation**:
  - Add `VehicleProfileType`, `ServiceRecordType`, `PartType`, `SpecType`, `ChecklistTemplateType` to `src/lib/types.ts`.
  - Add `zod/mini` schemas to `src/lib/zodSchemas.ts`: `serviceRecordSchema` (mileage integer 0–1,000,000, date matching `^\d{4}-\d{2}-\d{2}$`, title required, quantity > 0, cost ≥ 0 optional), plus `partSchema`, `specSchema`, `templateSchema`, `profileSchema`.
- [ ] 4. **Nav**: add `{ location: '/maintenance', description: 'Maintenance', searchPattern: '/maintenance' }` after Consumption in `src/lib/Navbar.svelte`.
- [ ] 5. **Layout** `src/routes/maintenance/+layout.svelte`:
  - Load `vehicleProfiles.list` and work out the active `carId` (see Decisions).
  - Share it with child pages via `setContext`.
  - Render a sub-nav: Profile `/maintenance`, History `/maintenance/history`, Parts & Fluids `/maintenance/parts`, Specs `/maintenance/specs`, Checklists `/maintenance/checklists`. Underline the active link, matching Navbar style. Keep `?car=` on links when it is present.
  - If no profiles exist, show: "No vehicle yet. Run `bunx convex run maintenanceSeed:seed`."
- [ ] 6. **Profile** `/maintenance/+page.svelte`:
  - Show all profile fields in a Card, with an Edit toggle that saves via `upsert`.
  - Show a summary: current mileage, last service (date, title, mileage), and total spent.
  - Add a quick "Update mileage" input.
- [ ] 7. **History** `/maintenance/history/+page.svelte`:
  - Table: date, mileage, title, category badge, minder code, cost, item count.
  - Filter by category (`<select>`) and text search across title, notes, and item names.
  - Show total spent and per-year totals.
  - Floating pink "+" button links to `/maintenance/history/new`. Clicking a row opens `/maintenance/history/[id]`.
- [ ] 8. **Record form**: one shared component `src/routes/maintenance/history/RecordForm.svelte`, used by `history/new/+page.svelte` and `history/[id]/+page.svelte`.
  - Fields: date (default today), mileage, title, category, minder code, cost ($), notes.
  - Items editor with add/remove rows: name, part number, quantity, unit, notes. A "From catalog" `<select>` prefills name, partNumber, defaultQuantity, unit, and partId.
  - "Start from template" `<select>` prefills title, category, and checklist steps (`done: false`).
  - Checklist with checkboxes, plus an "add step" input.
  - `new` supports `?from=<recordId>` to duplicate an earlier record: copy title, category, items, and checklist with every `done` reset to false; set date to today and leave mileage blank.
  - `[id]` page: view and edit the record, a **Duplicate** button (goes to `new?from=id`), and **Delete** behind an AlertDialog confirm.
  - Show a toast on save, then go to `/maintenance/history`.
- [ ] 9. **Parts & Fluids** `/maintenance/parts/+page.svelte`:
  - Inline-editable table: name, kind, brand, part #, spec, default quantity, unit, notes. Add a row; delete with confirm.
  - Each row shows "Last used": date and mileage of the newest record whose items reference that `partId`.
- [ ] 10. **Specs** `/maintenance/specs/+page.svelte`:
  - Group by category.
  - Inline add, edit, and delete for name, value, source, and notes. `value` uses a textarea when category is Procedure.
  - Empty state: "Add values from the Honda service manual."
- [ ] 11. **Checklists**:
  - `/maintenance/checklists/+page.svelte`: list templates. Each has a "Log job" link to `/maintenance/history/new?template=<id>` (the form preselects that template).
  - `/maintenance/checklists/[id]/+page.svelte`: edit title, category, and notes; add, remove, and reorder steps with up/down buttons; delete with confirm. A "New template" action creates one and opens it.
- [ ] 12. Run the seed: `bunx convex run maintenanceSeed:seed`. Run it a second time and confirm nothing is duplicated.
- [ ] 13. Run `bun run check` and `bun run lint` and fix all errors in touched files.

## Acceptance criteria
- `bun run check` reports 0 errors. `bun run lint` passes for the new and changed files.
- The nav shows Maintenance and `/maintenance` shows the FL5 profile.
- Logging a job from the "Brake pads & rotors" template saves the steps (with tick state), items, quantities, cost, minder code, and notes. The record appears first in History, and totals update.
- Saving a record with higher mileage updates the profile's current mileage.
- Duplicating a record opens a prefilled form with today's date, blank mileage, and unticked steps.
- Editing a template does not change records already logged from it.
- Picking a catalog part in the record form prefills the item. The Parts page shows its "Last used".
- Running the seed twice produces no duplicate profiles or templates.
- The site has no receipts, upcoming-maintenance, or setup-comparison UI.

## Out of scope
- Receipt/file uploads, maintenance due dates or reminders, daily/track setup comparison, auth, charts, CSV import/export, new dependencies, changes to the Consumption pages, and commits.

## Notes / risks
- The root layout sets `ssr = false`. All data comes from the client via `convex-svelte`.
- Never put numeric torque or capacity values in seed data or default text. A wrong value is a safety risk.
- Money: convert dollars to cents with `Math.round(dollars * 100)`. Display with the existing `formatCurrency` in `src/lib/finances.ts` if its signature fits; otherwise use `Intl.NumberFormat`.
- `useQuery` args that depend on `carId` must be reactive. Follow the `$derived(useQuery(...))` pattern in `consumption/[id]/+page.svelte`.
