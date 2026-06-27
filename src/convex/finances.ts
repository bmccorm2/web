import { v } from 'convex/values';
import { mutation, query } from './_generated/server';

const accountFields = {
	person: v.string(),
	institution: v.string(),
	type: v.union(
		v.literal('Brokerage'),
		v.literal('Roth'),
		v.literal('IRA'),
		v.literal('401k')
	),
	balance: v.number()
};

export const list = query({
	handler: async (ctx) => {
		return await ctx.db.query('FinancialAccounts').collect();
	}
});

export const upsert = mutation({
	args: { ...accountFields, id: v.optional(v.id('FinancialAccounts')) },
	handler: async (ctx, args) => {
		if (args.id) {
			const { id, ...data } = args;
			await ctx.db.patch(id, { ...data, updatedAt: Date.now() });
			return id;
		}
		// Match on natural key (person + institution + type).
		const existing = await ctx.db
			.query('FinancialAccounts')
			.filter((q) =>
				q.and(
					q.eq(q.field('person'), args.person),
					q.eq(q.field('institution'), args.institution),
					q.eq(q.field('type'), args.type)
				)
			)
			.first();
		if (existing) {
			await ctx.db.patch(existing._id, {
				type: args.type,
				balance: args.balance,
				updatedAt: Date.now()
			});
			return existing._id;
		}
		return await ctx.db.insert('FinancialAccounts', {
			person: args.person,
			institution: args.institution,
			type: args.type,
			balance: args.balance,
			updatedAt: Date.now()
		});
	}
});

export const remove = mutation({
	args: { id: v.id('FinancialAccounts') },
	handler: async (ctx, args) => {
		await ctx.db.delete(args.id);
	}
});

export const bulkUpsert = mutation({
	args: {
		accounts: v.array(
			v.object({
				person: v.string(),
				institution: v.string(),
				type: accountFields.type,
				balance: v.number()
			})
		)
	},
	handler: async (ctx, args) => {
		// ponytail: delete-and-reinsert per upload. Fine for a personal ledger;
		// switch to per-row upsert if uploads get large enough that the wipe is visible.
		const existing = await ctx.db.query('FinancialAccounts').collect();
		await Promise.all(existing.map((row) => ctx.db.delete(row._id)));
		const now = Date.now();
		return await Promise.all(
			args.accounts.map((row) =>
				ctx.db.insert('FinancialAccounts', { ...row, updatedAt: now })
			)
		);
	}
});
