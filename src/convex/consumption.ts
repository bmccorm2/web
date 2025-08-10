import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const MOST_RECENT = 50;

export const byCar = query({
	args: {
		carId: v.id('Cars')
	},
	handler: async (ctx, args) => {
		let totalMiles = 0;
		let totalPrice = 0;
		let totalGallons = 0;
		const res = await ctx.db
			.query('Consumption')
			.withIndex('by_carId', (q) => q.eq('carId', args.carId))
			.order('desc')
			.collect();
		const summary = res.map((e) => ({
			...e,
			milesPerGallon: e.miles / e.gallons,
			pricePerGallon: e.price / e.gallons
		}));

		for (let i = 0; i < summary.length; i++) {
			const e = summary[i];
			totalMiles += e.miles;
			totalPrice += e.price;
			totalGallons += e.gallons;
		}

		return {
			summary: {
				totalMiles,
				totalPrice,
				milesPerGallon: totalMiles / totalGallons,
				pricePerGallon: totalPrice / totalGallons
			},
			data: summary.slice(0, MOST_RECENT)
		};
	}
});

export const insert = mutation({
	args: {
		price: v.float64(),
		gallons: v.float64(),
		miles: v.float64(),
		notes: v.optional(v.string()),
		carId: v.id('Cars')
	},
	handler: async (ctx, args) => {
		return await ctx.db.insert('Consumption', {
			carId: args.carId,
			price: args.price,
			gallons: args.gallons,
			miles: args.miles,
			notes: args.notes
		});
	}
});
