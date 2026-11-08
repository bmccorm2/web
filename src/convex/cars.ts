import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const getOwnedCars = query({
	handler: async (ctx) => {
		return await ctx.db
			.query('Cars')
			.withIndex('by_isOwned', (q) => q.eq('isOwned', true))
			.collect();
	}
});

export const insert = mutation({
	args: { displayName: v.string() },
	handler: async (ctx, args) => {
		const displayName = args.displayName.trim();
		if (!displayName) throw new Error('Name is required');
		return await ctx.db.insert('Cars', { displayName, isOwned: true });
	}
});
