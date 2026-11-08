import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import type { Doc } from './_generated/dataModel';

export const bookFields = {
	author: v.string(),
	isFiction: v.boolean(),
	pages: v.float64(),
	publishDate: v.optional(v.float64()),
	rating: v.float64(),
	review: v.string(),
	title: v.string()
};

export const bookFullFields = {
	...bookFields,
	genres: v.array(v.id('Genres'))
};

export const bookFullUpdateFields = {
	...bookFullFields,
	id: v.id('Books')
};

export type BookType = Doc<'Books'>;
export type GenreType = Doc<'Genres'>;
export type BookTypeFull = Doc<'Books'> & {
	genres: GenreType[];
};

export const accountType = v.union(
	v.literal('Brokerage'),
	v.literal('Roth'),
	v.literal('IRA'),
	v.literal('401k')
);

export const serviceCategory = v.union(
	v.literal('Oil'),
	v.literal('Transmission'),
	v.literal('Brakes'),
	v.literal('Tires & Wheels'),
	v.literal('Fluids'),
	v.literal('Filters'),
	v.literal('Track'),
	v.literal('Other')
);

export const vehicleProfileFields = {
	carId: v.id('Cars'),
	year: v.number(),
	make: v.string(),
	model: v.string(),
	chassisCode: v.optional(v.string()),
	vin: v.optional(v.string()),
	color: v.optional(v.string()),
	purchaseDate: v.optional(v.string()),
	purchaseMileage: v.optional(v.number()),
	currentMileage: v.number(),
	notes: v.optional(v.string())
};

export const serviceRecordFields = {
	carId: v.id('Cars'),
	date: v.string(), // YYYY-MM-DD
	mileage: v.number(),
	title: v.string(),
	category: serviceCategory,
	minderCode: v.optional(v.string()),
	cost: v.optional(v.number()), // cents
	items: v.array(
		v.object({
			partId: v.optional(v.id('Parts')),
			name: v.string(),
			partNumber: v.optional(v.string()),
			quantity: v.number(),
			unit: v.string(),
			notes: v.optional(v.string())
		})
	),
	checklist: v.optional(v.array(v.object({ text: v.string(), done: v.boolean() }))),
	templateId: v.optional(v.id('ChecklistTemplates')),
	notes: v.optional(v.string())
};

export const partFields = {
	carId: v.id('Cars'),
	name: v.string(),
	kind: v.union(v.literal('Part'), v.literal('Fluid')),
	brand: v.optional(v.string()),
	partNumber: v.optional(v.string()),
	spec: v.optional(v.string()),
	defaultQuantity: v.optional(v.number()),
	unit: v.optional(v.string()),
	notes: v.optional(v.string())
};

export const specFields = {
	carId: v.id('Cars'),
	category: v.union(
		v.literal('Torque'),
		v.literal('Capacity'),
		v.literal('Pressure'),
		v.literal('Procedure'),
		v.literal('Other')
	),
	name: v.string(),
	value: v.string(),
	source: v.optional(v.string()),
	notes: v.optional(v.string())
};

export const checklistTemplateFields = {
	carId: v.id('Cars'),
	title: v.string(),
	category: serviceCategory,
	steps: v.array(v.string()),
	notes: v.optional(v.string())
};

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
	Books: defineTable(bookFields),
	Genres: defineTable({
		description: v.string()
	}),
	Books_Genres_Association: defineTable({
		bookId: v.id('Books'),
		genreId: v.id('Genres')
	}).index('by_book', ['bookId']),
	Recipes: defineTable({
		title: v.string(),
		url: v.optional(v.string()),
		prepTime: v.optional(v.string()),
		cookTime: v.optional(v.string()),
		totalTime: v.optional(v.string()),
		yield: v.optional(v.string()),
		ingredients: v.array(v.string()),
		instructions: v.array(v.string()),
		notes: v.optional(v.string()),
		imageUrl: v.optional(v.string()),
		rating: v.optional(v.number())
	}),
	FinancialAccounts: defineTable({
		person: v.string(),
		institution: v.string(),
		type: accountType,
		balance: v.number(),
		updatedAt: v.number()
	}).index('by_person', ['person']),
	VehicleProfiles: defineTable({ ...vehicleProfileFields, updatedAt: v.number() }).index(
		'by_carId',
		['carId']
	),
	ServiceRecords: defineTable(serviceRecordFields).index('by_carId_date', ['carId', 'date']),
	Parts: defineTable(partFields).index('by_carId', ['carId']),
	Specs: defineTable(specFields).index('by_carId', ['carId']),
	ChecklistTemplates: defineTable(checklistTemplateFields).index('by_carId', ['carId'])
});
