# Agentic Guidelines

## 1. Project Overview
- **Framework & Language**: SvelteKit (Svelte 5 Runes) + TypeScript (Strict)
- **Styling**: Tailwind CSS 4 (Vite plugin)
- **Backend**: Convex (`src/convex/`)
- **UI Components**: Bits UI / Radix Svelte & Lucide Svelte

## 2. Common Commands
- `npm run dev` / `npm run build` / `npm run preview`
- `npm run lint` / `npm run format` / `npm run check` (svelte-check)
- `npx convex dev` / `npx convex dashboard`

## 3. Code Style & Rules
- **Svelte 5**: Use runes (`$state`, `$derived`, `$props`). Avoid `$effect` unless syncing with external APIs. Use callback props (e.g., `onclick`) instead of `on:click`. Always use `<script lang="ts">`.
- **TypeScript**: No `any`. Use `Doc` and `Id` from `src/convex/_generated/dataModel.d.ts` for database operations.
- **Styling**: Prefer Tailwind utility classes. Use `cn()` helper for conditional classes. Avoid `<style>` blocks.
- **Naming**: PascalCase for components/Convex tables, camelCase for functions/variables, UPPER_SNAKE_CASE for constants.

## 4. Convex Backend
- Schema is in `src/convex/schema.ts`. Always check this first when editing backend logic.
- Validate all arguments using `v` validators.
- Example mutation:
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

## 5. Error Handling & Validation
- UI page-level errors: SvelteKit's `+error.svelte`.
- Logic & network: Use `try/catch`.
- Forms: Use `sveltekit-superforms` + `zod`.

## 6. Execution Safeguards
- Always run `npm run check` before finalizing logic changes.
