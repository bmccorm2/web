import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { specFields } from './schema';

export const byCar = query({
	args: { carId: v.id('Cars') },
	handler: async (ctx, args) => {
		const specs = await ctx.db
			.query('Specs')
			.withIndex('by_carId', (q) => q.eq('carId', args.carId))
			.collect();
		return specs.sort((a, b) => a.name.localeCompare(b.name));
	}
});

export const insert = mutation({
	args: specFields,
	handler: async (ctx, args) => {
		return await ctx.db.insert('Specs', args);
	}
});

export const update = mutation({
	args: { ...specFields, id: v.id('Specs') },
	handler: async (ctx, args) => {
		const { id, ...data } = args;
		await ctx.db.replace(id, data);
	}
});

export const remove = mutation({
	args: { id: v.id('Specs') },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id);
	}
});
