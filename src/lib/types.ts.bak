import { z, number } from 'zod/v4';
import type { Doc } from '../convex/_generated/dataModel';

export const swimTag = z.object({
	id: z.number().positive(),
	tag: z.string().optional()
});

export const swimWorkoutSchema = z.object({
	id: z.number().positive().optional(),
	created: z.string(),
	swimWorkoutText: z.string().min(1),
	author: z.string().nullable().optional(),
	yards: z.coerce
		.number()
		.gte(500)
		.lte(10000)
		.default('' as unknown as number),
	tags: z.array(swimTag).optional()
});

export type SwimWorkout = z.infer<typeof swimWorkoutSchema>;
export type SwimTag = z.infer<typeof swimTag>;

export type SwimWorkoutDb = {
	swimWorkoutId: number;
	tagId: number;
	swimWorkoutText: string;
	yards: number;
	created: string;
	tag: string;
	author: string | undefined | null;
};

export const genreSchema = z.object({
	description: z.string().min(3)
});
export const genre = genreSchema.extend({
	id: number().positive()
});

export const bookSchema = z.object({
	id: z.number().nullable(),
	title: z.string(),
	author: z.string(),
	pages: z.coerce
		.number()
		.lt(1500)
		.positive()
		.default('' as unknown as number),
	publishDate: z
		.string()
		.refine((val) => !isNaN(Date.parse(val)))
		.nullable(),
	rating: z.number().gte(1).lte(5).default(3),
	review: z.string().nullable(),
	isFiction: z.boolean(),
	created: z.string(),
	genres: z.array(genre)
});

export type Book = z.infer<typeof bookSchema>;
export type Genre = z.infer<typeof genre>;

export type BookDb = {
	id: number;
	title: string;
	author: string;
	pages: number;
	rating: number;
	isFiction: number;
	publishDate: string | null;
	review: string;
	created: Date;
	genreId?: number;
	genreDescription?: string;
};

export const authorValues = [
	'All',
	'Jen',
	'Bryan',
	'Bob',
	'Micha',
	'Ryan',
	'Brad',
	'Kirk'
] as const;
export type AuthorFilter = (typeof authorValues)[number];

export const tagValues = [
	'All',
	'Free',
	'IM/Stroke',
	'Sprint',
	'Distance',
	'Kick',
	'Misc'
] as const;
export type TagFilter = (typeof tagValues)[number];

export type CarType = Doc<'Cars'>;
export type ConsumptionType = Doc<'Consumption'> & {
	milesPerGallon?: number;
	pricePerGallon?: number;
};

export type Summary = {
	totalMiles: number;
	totalPrice: number;
	milesPerGallon: number;
	pricePerGallon: number;
};
