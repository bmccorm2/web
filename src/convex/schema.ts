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
	}).index('by_carId', ['carId'])
});
