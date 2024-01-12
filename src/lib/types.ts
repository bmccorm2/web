import { z } from "zod";

export const genreInputSchema = z.object({
  description: z.string(),
});
export const bookSchema = z.object({
  id: z.number(),
  title: z.string(),
  author: z.string(),
  pages: z.number().lt(1500).positive(),
  publishDate: z.date().nullable(),
  rating: z.number().gte(1).lte(5),
  review: z.string().nullable(),
  isFiction: z.boolean(),
  created: z.string().optional(),
  genres: z.array(
    z.object({
      id: z.number().positive(),
      description: z.string().min(1),
    })
  ),
  selectedGenres: z.array(z.number().positive()).optional(),
});

export const bookCrudSchema = bookSchema.extend({
  id: bookSchema.shape.id.optional(),
  selectedGenres: z.array(z.number().positive()).nonempty(),
});

export type BookSerialized = z.infer<typeof bookSchema>;

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

export type Genre = {
  id: number;
  description: string;
};

export type Book = {
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
