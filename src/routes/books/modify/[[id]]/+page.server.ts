import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import {
  bookCrudSchema,
  bookSchema,
  genreInputSchema,
  type Genre,
  type Book,
} from "$lib/types.js";
import { client } from "$lib/server/databaseClient.js";
import {
  DELETE_BGA,
  DELETE_GENRE,
  GET_BOOK,
  GET_GENRES,
  INSERT_BGA,
  INSERT_BOOK,
  INSERT_GENRE,
  UPDATE_BOOK,
} from "$lib/server/queries.js";
import { serializeBooks } from "$lib/server/utilities.js";

export const load = async ({ params }) => {
  const id = params.id ? parseInt(params.id) : -1;

  try {
    const rs = await client.batch(
      [
        GET_GENRES,
        {
          sql: GET_BOOK,
          args: { id },
        },
      ],
      "read"
    );
    const genres = rs[0].rows as unknown as Genre[];
    const book = serializeBooks(rs[1].rows as unknown as Book[])[0];

    if (book) {
      // Need another structure because the form control (multi checkbox)
      // can only support arrays of numbers and not array of objects.
      book.selectedGenres = book.genres.map((e: Genre) => e.id);

      // Erase the genres object so we don't have to use nested objects with superforms
      book.genres = [];
    }

    const form = await superValidate(book, bookSchema);

    return { genres, form };
  } catch (e: any) {
    error(505, e.message);
  }
};

export const actions = {
  modify: async ({ request }) => {
    const form = await superValidate(request, bookCrudSchema);

    if (!form.valid) return fail(400, { form });

    if (form.data.id) {
      //Update Book
      const transaction = await client.transaction("write");
      await transaction.execute({
        sql: UPDATE_BOOK,
        args: {
          id: form.data.id,
          title: form.data.title,
          author: form.data.author,
          pages: form.data.pages,
          publishDate: form.data.publishDate,
          isFiction: form.data.isFiction,
          review: form.data.review,
          rating: form.data.rating,
        },
      });

      await transaction.execute({
        sql: DELETE_BGA,
        args: { id: form.data.id },
      });

      form.data.selectedGenres.forEach(async (e) => {
        await transaction.execute({
          sql: INSERT_BGA,
          args: {
            id: form.data.id,
            genreId: e,
          },
        });
      });

      await transaction.commit();

      redirect(301, "/books");
    } else {
      //Create Book
      const transaction = await client.transaction("write");
      const rs = await transaction.execute({
        sql: INSERT_BOOK,
        args: {
          title: form.data.title,
          author: form.data.author,
          pages: form.data.pages,
          publishDate: form.data.publishDate,
          isFiction: form.data.isFiction,
          review: form.data.review,
          rating: form.data.rating,
        },
      });
      const id = rs.lastInsertRowid;

      form.data.selectedGenres.forEach(async (e) => {
        await transaction.execute({
          sql: INSERT_BGA,
          args: {
            id,
            genreId: e,
          },
        });
      });

      await transaction.commit();

      redirect(301, "/books");
    }
  },

  insertGenre: async ({ request, fetch }) => {
    const form = await superValidate(request, genreInputSchema);
    if (!form.valid) return fail(400, { form });

    const { description } = form.data;
    await client.execute({
      sql: INSERT_GENRE,
      args: { description },
    });
  },

  deleteGenre: async ({ request }) => {
    const { id: t } = Object.fromEntries(await request.formData());
    const id = parseInt(t as string);

    await client.execute({
      sql: DELETE_GENRE,
      args: { id },
    });

    return { success: "true" };
  },
} satisfies Actions;
