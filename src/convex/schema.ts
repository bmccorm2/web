import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
	Cars: defineTable({
		displayName: v.string(),
		isOwned: v.boolean(),
		searchUrl: v.optional(v.string())
	}).index('by_isOwned', ['isOwned']),
	Consumption: defineTable({
		carId: v.id('Cars'),
		gallons: v.float64(),
		miles: v.float64(),
		notes: v.optional(v.string()),
		price: v.float64()
	}).index('by_carId', ['carId']),
	Books: defineTable({
		author: v.string(),
		isFiction: v.boolean(),
		pages: v.float64(),
		publishDate: v.optional(v.float64()),
		rating: v.float64(),
		review: v.string(),
		title: v.string()
	}),
	Genres: defineTable({
		description: v.string()
	}),
	Books_Genres_Association: defineTable({
		bookId: v.id('Books'),
		genreId: v.id('Genres')
	})
});
