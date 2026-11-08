import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { checklistTemplateFields } from './schema';

export const byCar = query({
	args: { carId: v.id('Cars') },
	handler: async (ctx, args) => {
		const templates = await ctx.db
			.query('ChecklistTemplates')
			.withIndex('by_carId', (q) => q.eq('carId', args.carId))
			.collect();
		return templates.sort((a, b) => a.title.localeCompare(b.title));
	}
});

export const get = query({
	args: { id: v.id('ChecklistTemplates') },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	}
});

export const insert = mutation({
	args: checklistTemplateFields,
	handler: async (ctx, args) => {
		return await ctx.db.insert('ChecklistTemplates', args);
	}
});

export const update = mutation({
	args: { ...checklistTemplateFields, id: v.id('ChecklistTemplates') },
	handler: async (ctx, args) => {
		const { id, ...data } = args;
		await ctx.db.replace(id, data);
	}
});

export const remove = mutation({
	args: { id: v.id('ChecklistTemplates') },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id);
	}
});
