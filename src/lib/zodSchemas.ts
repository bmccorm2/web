import { z } from "zod";

export const genreInputSchema = z.object({
  description: z.string(),
});
export const bookInputSchema = z.object({
  title: z.string(),
  author: z.string(),
  pages: z.number().lt(1500).positive(),
  publishDate: z.date().nullable(),
  rating: z.number().gte(1).lte(5),
  review: z.string().nullable(),
  isFiction: z.boolean(),
  genreList: z.array(z.number().positive()),
});
