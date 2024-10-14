import { number, z } from "zod";

export const swimTag = z.object({
  id: z.number().positive(),
  tag: z.string().optional(),
});

export const swimWorkoutSchema = z.object({
  id: z.number().positive().optional(),
  created: z.number(),
  swimWorkoutText: z.string().min(1),
  yards: z.coerce
    .number()
    .gte(500)
    .lte(10000)
    .default("" as unknown as number),
  tags: z.array(swimTag).optional(),
});

export type SwimWorkout = z.infer<typeof swimWorkoutSchema>;
export type SwimTag = z.infer<typeof swimTag>;

export type SwimWorkoutDb = {
  swimWorkoutId: number;
  tagId: number;
  swimWorkoutText: string;
  yards: number;
  created: number;
  tag: string;
};

export const genreSchema = z.object({
  description: z.string().min(3),
});
export const genre = genreSchema.extend({
  id: number().positive(),
});

export const bookSchema = z.object({
  id: z.number().nullable(),
  title: z.string(),
  author: z.string(),
  pages: z.coerce
    .number()
    .lt(1500)
    .positive()
    .default("" as unknown as number),
  publishDate: z.date().nullable(),
  rating: z.number().gte(1).lte(5).default(3),
  review: z.string().nullable(),
  isFiction: z.boolean(),
  created: z.string().nullable(),
  genres: z.array(genre),
});

export const inputSchema = z.object({
  price: z.coerce
    .number()
    .gt(0)
    .lt(100)
    .default("" as unknown as number),
  gallons: z.coerce
    .number()
    .gt(0)
    .lt(50)
    .default("" as unknown as number),
  miles: z.coerce
    .number()
    .gt(0)
    .lt(1000)
    .default("" as unknown as number),
  notes: z.string().nullable(),
});

export type Book = z.infer<typeof bookSchema>;
export type Genre = z.infer<typeof genre>;

export type Consumption = {
  id: number;
  miles_per_gallon: number;
  price_per_gallon: number;
  notes: string | null;
  created: string;
};

export type Cars = {
  id: number;
  displayName: string;
  searchUrl?: string;
  isOwned?: number;
};

export type Summary = {
  total_miles: number;
  total_price: number;
  total_miles_per_gallon: number;
  total_price_per_gallon: number;
};

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
