import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { vehicleProfileFields } from './schema';

export const list = query({
	handler: async (ctx) => {
		const profiles = await ctx.db.query('VehicleProfiles').collect();
		return await Promise.all(
			profiles.map(async (p) => ({
				...p,
				displayName: (await ctx.db.get(p.carId))?.displayName ?? `${p.year} ${p.model}`
			}))
		);
	}
});

export const getByCar = query({
	args: { carId: v.id('Cars') },
	handler: async (ctx, args) => {
		return await ctx.db
			.query('VehicleProfiles')
			.withIndex('by_carId', (q) => q.eq('carId', args.carId))
			.first();
	}
});

export const upsert = mutation({
	args: { ...vehicleProfileFields, id: v.optional(v.id('VehicleProfiles')) },
	handler: async (ctx, args) => {
		const { id, ...data } = args;
		const doc = { ...data, updatedAt: Date.now() };
		const existingId =
			id ??
			(
				await ctx.db
					.query('VehicleProfiles')
					.withIndex('by_carId', (q) => q.eq('carId', args.carId))
					.first()
			)?._id;
		if (existingId) {
			await ctx.db.replace(existingId, doc);
			return existingId;
		}
		return await ctx.db.insert('VehicleProfiles', doc);
	}
});
