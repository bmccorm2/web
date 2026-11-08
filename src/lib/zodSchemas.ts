import * as z from 'zod/mini';

export const inputSchema = z.object({
	price: z.coerce.number().check(z.gt(0), z.lt(100)),
	gallons: z.coerce.number().check(z.gt(0), z.lt(50)),
	miles: z.coerce.number().check(z.gt(0), z.lt(1000)),
	notes: z.optional(z.string()),
	carId: z.string()
});

export const SERVICE_CATEGORIES = [
	'Oil',
	'Transmission',
	'Brakes',
	'Tires & Wheels',
	'Fluids',
	'Filters',
	'Track',
	'Other'
] as const;
export const PART_KINDS = ['Part', 'Fluid'] as const;
export const SPEC_CATEGORIES = ['Torque', 'Capacity', 'Pressure', 'Procedure', 'Other'] as const;

const requiredText = z.string().check(z.trim(), z.minLength(1));
const mileage = z.int().check(z.gte(0), z.lte(1_000_000));
const isoDate = z.string().check(z.regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'));

export const serviceItemSchema = z.object({
	partId: z.optional(z.string()),
	name: requiredText,
	partNumber: z.optional(z.string()),
	quantity: z.number().check(z.gt(0)),
	unit: requiredText,
	notes: z.optional(z.string())
});

export const serviceRecordSchema = z.object({
	date: isoDate,
	mileage,
	title: requiredText,
	category: z.enum(SERVICE_CATEGORIES),
	minderCode: z.optional(z.string()),
	cost: z.optional(z.number().check(z.gte(0))), // dollars; convert to cents before saving
	items: z.array(serviceItemSchema),
	checklist: z.optional(z.array(z.object({ text: requiredText, done: z.boolean() }))),
	templateId: z.optional(z.string()),
	notes: z.optional(z.string())
});

export const partSchema = z.object({
	name: requiredText,
	kind: z.enum(PART_KINDS),
	brand: z.optional(z.string()),
	partNumber: z.optional(z.string()),
	spec: z.optional(z.string()),
	defaultQuantity: z.optional(z.number().check(z.gt(0))),
	unit: z.optional(z.string()),
	notes: z.optional(z.string())
});

export const specSchema = z.object({
	category: z.enum(SPEC_CATEGORIES),
	name: requiredText,
	value: requiredText,
	source: z.optional(z.string()),
	notes: z.optional(z.string())
});

export const templateSchema = z.object({
	title: requiredText,
	category: z.enum(SERVICE_CATEGORIES),
	steps: z.array(requiredText),
	notes: z.optional(z.string())
});

export const profileSchema = z.object({
	year: z.int().check(z.gte(1900), z.lte(2100)),
	make: requiredText,
	model: requiredText,
	chassisCode: z.optional(z.string()),
	vin: z.optional(z.string()),
	color: z.optional(z.string()),
	purchaseDate: z.optional(z.union([isoDate, z.literal('')])),
	purchaseMileage: z.optional(mileage),
	currentMileage: mileage,
	notes: z.optional(z.string())
});
