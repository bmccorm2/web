import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { partFields } from './schema';

// Includes `lastUsed`: the newest service record referencing each part.
export const byCar = query({
	args: { carId: v.id('Cars') },
	handler: async (ctx, args) => {
		const parts = await ctx.db
			.query('Parts')
			.withIndex('by_carId', (q) => q.eq('carId', args.carId))
			.collect();
		const records = await ctx.db
			.query('ServiceRecords')
			.withIndex('by_carId_date', (q) => q.eq('carId', args.carId))
			.collect();

		const lastUsed = new Map<string, { date: string; mileage: number }>();
		for (const r of records) {
			for (const item of r.items) {
				if (!item.partId) continue;
				const prev = lastUsed.get(item.partId);
				if (!prev || r.date > prev.date || (r.date === prev.date && r.mileage > prev.mileage)) {
					lastUsed.set(item.partId, { date: r.date, mileage: r.mileage });
				}
			}
		}
		return parts
			.map((p) => ({ ...p, lastUsed: lastUsed.get(p._id) ?? null }))
			.sort((a, b) => a.name.localeCompare(b.name));
	}
});

export const insert = mutation({
	args: partFields,
	handler: async (ctx, args) => {
		return await ctx.db.insert('Parts', args);
	}
});

export const update = mutation({
	args: { ...partFields, id: v.id('Parts') },
	handler: async (ctx, args) => {
		const { id, ...data } = args;
		await ctx.db.replace(id, data);
	}
});

export const remove = mutation({
	args: { id: v.id('Parts') },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id);
	}
});
