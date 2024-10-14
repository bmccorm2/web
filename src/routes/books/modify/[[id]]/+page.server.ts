import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import {
  bookSchema,
  genreSchema,
  type Genre,
  type BookDb,
} from "$lib/types.js";
import { db } from "$lib/server/databaseClient.js";
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
import { zod } from "sveltekit-superforms/adapters";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id ? parseInt(params.id) : -1;

  try {
    const rs = await db.batch(
      [
        GET_GENRES,
        {
          sql: GET_BOOK,
          args: { id },
        },
      ],
      "read",
    );
    const genres = rs[0].rows as unknown as Genre[];
    const book = serializeBooks(rs[1].rows as unknown as BookDb[])[0];

    const form = await superValidate(book, zod(bookSchema));
    const genreForm = await superValidate(zod(genreSchema));

    return { genres, form, genreForm };
  } catch (e: any) {
    error(505, e.message);
  }
};

export const actions = {
  modify: async (event) => {
    const form = await superValidate(event, zod(bookSchema));

    if (!form.valid) return fail(400, { form });

    if (form.data.id) {
      //Update Book
      const transaction = await db.transaction("write");
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
      form.data.genres.forEach(async (e: Genre) => {
        await transaction.execute({
          sql: INSERT_BGA,
          args: {
            id: form.data.id,
            genreId: e.id,
          },
        });
      });
      await transaction.commit();
      redirect(301, "/books");
    } else {
      //Create Book
      const transaction = await db.transaction("write");

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

      const id = Number(rs.lastInsertRowid);

      form.data.genres.forEach(async (e: Genre) => {
        await transaction.execute({
          sql: INSERT_BGA,
          args: {
            id,
            genreId: e.id,
          },
        });
      });

      await transaction.commit();

      redirect(301, "/books");
    }
  },

  insertGenre: async (event) => {
    const form = await superValidate(event, zod(genreSchema));
    if (!form.valid) return fail(400, { form });

    const { description } = form.data;
    await db.execute({
      sql: INSERT_GENRE,
      args: { description },
    });

    return { form };
  },

  deleteGenre: async ({ request }) => {
    const { id: t } = Object.fromEntries(await request.formData());
    const id = parseInt(t as string);

    await db.execute({
      sql: DELETE_GENRE,
      args: { id },
    });

    return { success: "true" };
  },
} satisfies Actions;
