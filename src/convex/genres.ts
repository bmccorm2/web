import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const getAll = query({
	handler: async (ctx) => {
		return await ctx.db.query('Genres').collect();
	}
});

export const deleteGenre = mutation({
	args: {
		genreId: v.id('Genres')
	},
	handler: async (ctx, args) => {
		const res = await ctx.db.delete(args.genreId);
		return {
			success: true
		};
	}
});

export const insert = mutation({
	args: {
		description: v.string()
	},
	handler: async (ctx, args) => {
		const id = await ctx.db.insert('Genres', {
			description: args.description
		});
		return id;
	}
});
