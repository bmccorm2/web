import { v } from 'convex/values';
import { mutation, query, type MutationCtx } from './_generated/server';
import type { Id } from './_generated/dataModel';
import { serviceRecordFields } from './schema';

async function bumpMileage(ctx: MutationCtx, carId: Id<'Cars'>, mileage: number) {
	const profile = await ctx.db
		.query('VehicleProfiles')
		.withIndex('by_carId', (q) => q.eq('carId', carId))
		.first();
	if (profile && mileage > profile.currentMileage) {
		await ctx.db.patch(profile._id, { currentMileage: mileage, updatedAt: Date.now() });
	}
}

export const byCar = query({
	args: { carId: v.id('Cars') },
	handler: async (ctx, args) => {
		const records = await ctx.db
			.query('ServiceRecords')
			.withIndex('by_carId_date', (q) => q.eq('carId', args.carId))
			.collect();
		records.sort((a, b) => b.date.localeCompare(a.date) || b.mileage - a.mileage);

		let totalCost = 0;
		const costByYear: Record<string, number> = {};
		for (const r of records) {
			if (!r.cost) continue;
			totalCost += r.cost;
			const year = r.date.slice(0, 4);
			costByYear[year] = (costByYear[year] ?? 0) + r.cost;
		}
		return { records, totalCost, costByYear };
	}
});

export const get = query({
	args: { id: v.id('ServiceRecords') },
	handler: async (ctx, args) => {
		return await ctx.db.get(args.id);
	}
});

export const insert = mutation({
	args: serviceRecordFields,
	handler: async (ctx, args) => {
		const id = await ctx.db.insert('ServiceRecords', args);
		await bumpMileage(ctx, args.carId, args.mileage);
		return id;
	}
});

export const update = mutation({
	args: { ...serviceRecordFields, id: v.id('ServiceRecords') },
	handler: async (ctx, args) => {
		const { id, ...data } = args;
		await ctx.db.replace(id, data);
		await bumpMileage(ctx, data.carId, data.mileage);
	}
});

export const remove = mutation({
	args: { id: v.id('ServiceRecords') },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id);
	}
});
