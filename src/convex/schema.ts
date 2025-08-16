import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { Doc } from './_generated/dataModel';

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
	}).index('by_book', ['bookId'])
});
