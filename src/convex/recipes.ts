import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

export const getAll = query({
	handler: async (ctx) => {
		return await ctx.db.query('Recipes').order('desc').collect();
	}
});

export const get = query({
	args: {
		recipeId: v.id('Recipes')
	},
	handler: async (ctx, args) => {
		const { recipeId } = args;
		const recipe = await ctx.db.get(recipeId);
		if (!recipe) throw new Error(`Recipe with id ${recipeId} not found`);
		return recipe;
	}
});

export const insert = mutation({
	args: {
		title: v.string(),
		url: v.optional(v.string()),
		prepTime: v.optional(v.string()),
		cookTime: v.optional(v.string()),
		totalTime: v.optional(v.string()),
		yield: v.optional(v.string()),
		ingredients: v.array(v.string()),
		instructions: v.array(v.string()),
		notes: v.optional(v.string()),
		imageUrl: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert('Recipes', args);
	}
});

export const update = mutation({
	args: {
		id: v.id('Recipes'),
		title: v.string(),
		url: v.optional(v.string()),
		prepTime: v.optional(v.string()),
		cookTime: v.optional(v.string()),
		totalTime: v.optional(v.string()),
		yield: v.optional(v.string()),
		ingredients: v.array(v.string()),
		instructions: v.array(v.string()),
		notes: v.optional(v.string()),
		imageUrl: v.optional(v.string())
	},
	handler: async (ctx, args) => {
		const { id, ...recipeData } = args;
		await ctx.db.patch(id, recipeData);
		return { success: true };
	}
});

export const deleteRecipe = mutation({
	args: { id: v.id('Recipes') },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id);
		return { success: true };
	}
});
