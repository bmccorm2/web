import { v, type Infer } from 'convex/values';
import { internalMutation } from './_generated/server';
import { serviceCategory } from './schema';

// Never put numeric torque/capacity values here. Steps point to Specs instead.
const TEMPLATES: { title: string; category: Infer<typeof serviceCategory>; steps: string[] }[] = [
	{
		title: 'Manual transmission fluid change',
		category: 'Transmission',
		steps: [
			'Park level and support on stands, keeping the car level',
			'Loosen the fill plug first and confirm it comes out',
			'Remove the drain plug, drain, and inspect the magnet for debris',
			'Install the drain plug with a new washer to spec (see Specs)',
			'Fill until fluid reaches the fill hole with the car level',
			'Install the fill plug with a new washer to spec (see Specs)',
			'Lower the car, check for leaks, test drive',
			'Record the product and quantity'
		]
	},
	{
		title: 'Rear brake service mode',
		category: 'Brakes',
		steps: [
			'Level ground, wheels chocked',
			'Enter rear-brake service mode per the service manual (store the exact procedure in Specs › Procedure)',
			'Confirm the caliper is released before removing it',
			'Perform the brake work',
			'Exit service mode per the service manual',
			'Verify the parking brake applies and releases with no warning lights'
		]
	},
	{
		title: 'Brake pads & rotors',
		category: 'Brakes',
		steps: [
			'Loosen lugs, lift, remove wheels',
			'Rear only: enter rear-brake service mode',
			'Remove the caliper and support it (do not hang it by the hose)',
			'Remove the bracket and rotor; clean the hub face',
			'Install the rotor, then the bracket bolts to spec (see Specs)',
			'Clean and lube the slides and pad hardware; install the pads',
			'Caliper bolts to spec (see Specs)',
			'Wheels on, lugs to spec (see Specs)',
			'Rear only: exit service mode',
			'Pump the pedal; check fluid level',
			'Bed in the pads',
			'Record pad/rotor brand and part numbers'
		]
	},
	{
		title: 'Track-day prep',
		category: 'Track',
		steps: [
			'Check pad thickness and rotor condition',
			'Check brake fluid level and age; bleed if due',
			'Check oil and coolant levels',
			'Inspect tires; set cold track pressures (see Specs)',
			'Torque lugs to spec (see Specs)',
			'Empty the cabin and trunk of loose items',
			'Pack tow hook, tools, helmet, and tech items',
			'After the event: re-torque lugs, inspect brakes and tires, reset street pressures'
		]
	}
];

export const seed = internalMutation({
	args: { carId: v.optional(v.id('Cars')) },
	handler: async (ctx, args) => {
		let carId = args.carId;
		if (!carId) {
			const cars = await ctx.db.query('Cars').collect();
			carId =
				cars.find((c) => c.displayName.toLowerCase().includes('type r'))?._id ??
				(await ctx.db.insert('Cars', { displayName: 'Type R', isOwned: true }));
		}

		const created = { profile: false, templates: [] as string[] };
		const profile = await ctx.db
			.query('VehicleProfiles')
			.withIndex('by_carId', (q) => q.eq('carId', carId))
			.first();
		if (!profile) {
			await ctx.db.insert('VehicleProfiles', {
				carId,
				year: 2023,
				make: 'Honda',
				model: 'Civic Type R',
				chassisCode: 'FL5',
				currentMileage: 0,
				updatedAt: Date.now()
			});
			created.profile = true;
		}

		const existing = await ctx.db
			.query('ChecklistTemplates')
			.withIndex('by_carId', (q) => q.eq('carId', carId))
			.collect();
		const titles = new Set(existing.map((t) => t.title));
		for (const t of TEMPLATES) {
			if (titles.has(t.title)) continue;
			await ctx.db.insert('ChecklistTemplates', { carId, ...t });
			created.templates.push(t.title);
		}
		return { carId, created };
	}
});
