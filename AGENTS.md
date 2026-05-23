# Agentic Guidelines for Web1

This document provides essential information for coding agents operating in this repository. Adhere to these standards to ensure consistency, safety, and high-quality contributions.

## 1. Project Overview

- **Framework**: SvelteKit (Svelte 5 with Runes)
- **Language**: TypeScript (Strict Mode)
- **Styling**: Tailwind CSS 4 (Vite plugin)
- **Backend**: Convex (located in `src/convex`)
- **UI Components**: Bits UI / Radix Svelte (shadcn-style)
- **Icons**: Lucide Svelte

## 2. Commands

### Development & Build

- `npm run dev` - Start the SvelteKit development server.
- `npm run build` - Build the application for production (Vercel Edge runtime).
- `npm run preview` - Preview the production build locally.

### Linting & Formatting

- `npm run lint` - Run Prettier check and ESLint.
- `npm run format` - Automatically fix formatting with Prettier.
- `npm run check` - Run `svelte-check` for TypeScript and Svelte diagnostics.

### Testing (Proposed/Future)

_Note: No test runner is currently installed. If added (e.g., Vitest), use:_

- `npx vitest` - Run all tests.
- `npx vitest run <path/to/file.test.ts>` - Run a single test file.
- `npx vitest -t 'Test Name Pattern'` - Run a specific test case.

### Convex Backend

- `npx convex dev` - Run the Convex development server (local/cloud syncing).
- `npx convex dashboard` - Open the Convex dashboard.

## 3. Code Style & Conventions

### Svelte 5 Runes

- **State**: Use `$state()` for reactive variables.
- **Derived**: Use `$derived()` for computed values.
- **Effects**: Use `$effect()` sparingly for side effects (syncing with external APIs).
- **Props**: Use the `$props()` rune for component inputs.
- **Events**: Prefer callback props (e.g., `onclick`) over deprecated `on:click`.

### TypeScript

- **Strictness**: Maintain `strict: true` in `tsconfig.json`.
- **Types**: Define interfaces or types for all complex objects. Avoid `any`.
- **Convex Types**: Use `Doc` and `Id` from `src/convex/_generated/dataModel.d.ts` for database interactions.

### Imports

1.  Svelte and SvelteKit built-ins (`svelte`, `$app/...`, `$lib/...`)
2.  External libraries (`lucide-svelte`, `convex/values`, etc.)
3.  Internal components/utils (relative paths or `$lib`)
4.  CSS/Assets

### Naming Conventions

- **Components**: PascalCase (e.g., `ConsumptionChart.svelte`).
- **Functions/Variables**: camelCase (e.g., `handleSubmit`, `isOwned`).
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_RETRY_COUNT`).
- **Convex Tables**: PascalCase in `schema.ts` (e.g., `Cars`, `Consumption`).

### Styling (Tailwind CSS 4)

- Use utility classes directly in Svelte templates.
- Use `cn()` or `clsx/tailwind-merge` for conditional classes.
- Avoid custom CSS in `<style>` blocks unless absolutely necessary.

## 4. Backend (Convex)

Convex functions reside in `src/convex/`.

- **Schema**: Defined in `src/convex/schema.ts`.
- **Queries**: Read-only functions (e.g., `export const list = query(...)`).
- **Mutations**: Write operations (e.g., `export const add = mutation(...)`).
- **Validation**: Use the `v` validator from `convex/values` for all arguments.

### Example Mutation Pattern

```typescript
import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const updateItem = mutation({
	args: { id: v.id('TableName'), count: v.number() },
	handler: async (ctx, args) => {
		await ctx.db.patch(args.id, { count: args.count });
	}
});
```

## 5. Error Handling

- **UI**: Use SvelteKit's `+error.svelte` for page-level errors.
- **Logic**: Use `try/catch` blocks for asynchronous operations (Convex calls, fetch).
- **Forms**: Use `sveltekit-superforms` and `zod` for validation and error reporting.

## 6. Project Structure

- `src/routes/`: SvelteKit pages and layouts.
- `src/lib/`: Reusable components, utilities, and state.
- `src/lib/components/ui/`: Low-level UI primitives (shadcn-style).
- `src/convex/`: Backend schema and functions.

## 7. Rules & Interaction

- No `.cursorrules` or `.github/copilot-instructions.md` found.
- When creating new features, always check `src/convex/schema.ts` first.
- Ensure all Svelte files use `<script lang="ts">`.
- Run `npm run check` before finalizing any logic changes.
