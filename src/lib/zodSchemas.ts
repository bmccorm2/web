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

export type Genre = {
  id: number;
  description: string;
};

export type Book = z.infer<typeof bookSchema>;
