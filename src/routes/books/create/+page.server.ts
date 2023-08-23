import { GRAPHQL_URL } from "$env/static/private";
import {
  CREATE_BOOK,
  CREATE_GENRE,
  DELETE_GENRE,
  GET_GENRES,
} from "$lib/server/queries";
import { error, fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { z } from "zod";

const genreInputSchema = z.object({
  description: z.string(),
});
const bookInputSchema = z.object({
  title: z.string(),
  author: z.string(),
  pages: z.number().lt(1500).positive(),
  publishDate: z.date().nullable(),
  rating: z.number().gte(1).lte(5),
  isFiction: z.boolean(),
  genreList: z.array(z.number().positive()),
});

export const load = async ({ request }) => {
  const form = superValidate(request, bookInputSchema);

  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const query = {
      query: GET_GENRES,
    };
    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(query),
    };

    const res = await fetch(GRAPHQL_URL, options);
    const {
      data: { genres },
    } = await res.json();
    return { genres, form };
  } catch (e: any) {
    throw error(505, e.message);
  }
};

export const actions = {
  createBook: async ({ request }) => {
    const form = await superValidate(request, bookInputSchema);
    if (!form.valid) return fail(400, { form });

    const { title, author, pages, publishDate, isFiction, genreList, rating } =
      form.data;

    console.log(form);

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const query = {
      query: CREATE_BOOK,
      variables: {
        title,
        author,
        pages,
        publishDate,
        isFiction,
        genreList,
        rating,
      },
    };
    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(query),
    };
    const res = await fetch(GRAPHQL_URL, options);
    const { data, errors } = await res.json();
    console.log(data);

    if (errors) throw error(505, errors[0].message);
    if (data.createBook != true) throw error(505, "Unknown Error Occurred.");

    throw redirect(301, "/books");
  },
  createGenre: async ({ request, fetch }) => {
    const form = await superValidate(request, genreInputSchema);
    if (!form.valid) return fail(400, { form });

    const { description } = form.data;
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const query = {
      query: CREATE_GENRE,
      variables: { description },
    };
    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(query),
    };
    const res = await fetch(GRAPHQL_URL, options);
    const { data, errors } = await res.json();

    if (errors) throw error(505, errors[0].message);
    if (data.createGenre != true) throw error(505, "Unknown Error Occurred.");
  },

  deleteGenre: async ({ request }) => {
    const { id: t } = Object.fromEntries(await request.formData());
    const id = parseInt(t);

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const query = {
      query: DELETE_GENRE,
      variables: { id },
    };
    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(query),
    };
    const res = await fetch(GRAPHQL_URL, options);
    const { data, errors } = await res.json();

    if (errors) throw error(505, errors[0].message);
    if (data.deleteGenre != true) throw error(505, "Deleting object failed.");

    return { success: "true" };
  },
};
