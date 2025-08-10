import { query } from './_generated/server';

export const getOwnedCars = query({
	handler: async (ctx) => {
		return await ctx.db
			.query('Cars')
			.withIndex('by_isOwned', (q) => q.eq('isOwned', true))
			.collect();
	}
});
