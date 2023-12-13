import { GRAPHQL_URL } from "$env/static/private";
import {
  CREATE_BOOK,
  CREATE_GENRE,
  DELETE_GENRE,
  GET_BOOK,
  GET_GENRES,
  UPDATE_BOOK,
} from "$lib/server/queries";
import { error, fail, redirect, type Actions } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { bookCrudSchema, bookSchema, genreInputSchema } from "$lib/zodSchemas";
import type { Genre, Book } from "$lib/zodSchemas";

export const load = async ({ params }) => {
  const id = params.id ? parseInt(params.id) : -1;

  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    let query = {
      query: GET_GENRES,
    };
    let options = {
      method: "POST",
      headers,
      body: JSON.stringify(query),
    };

    let res = await fetch(GRAPHQL_URL, options);
    const {
      data: { genres },
    }: { data: { genres: Genre[] } } = await res.json();

    const q2 = {
      query: GET_BOOK,
      variables: { id },
    };
    const o2 = {
      method: "POST",
      headers,
      body: JSON.stringify(q2),
    };

    const res2 = await fetch(GRAPHQL_URL, o2);
    let {
      data: { book },
    }: { data: { book: Book } } = await res2.json();

    //Add only the ids in an array so we can track in the form
    if (book) {
      book.selectedGenres = [];
      book.genres.forEach((e) => book.selectedGenres?.push(e.id));
    }

    const form = await superValidate(book, bookSchema);

    return { genres, form };
  } catch (e: any) {
    throw error(505, e.message);
  }
};

export const actions = {
  modify: async ({ request }) => {
    const form = await superValidate(request, bookCrudSchema);

    if (!form.valid) return fail(400, { form });

    if (form.data.id) {
      //Update Book
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      const query = {
        query: UPDATE_BOOK,
        variables: {
          id: form.data.id,
          title: form.data.title,
          author: form.data.author,
          pages: form.data.pages,
          publishDate: form.data.publishDate,
          isFiction: form.data.isFiction,
          review: form.data.review,
          selectedGenres: form.data.selectedGenres,
          rating: form.data.rating,
        },
      };

      const options = {
        method: "POST",
        headers,
        body: JSON.stringify(query),
      };

      const res = await fetch(GRAPHQL_URL, options);
      const { data, errors } = await res.json();

      if (errors) throw error(505, errors[0].message);
      if (data.updateBook != true) throw error(505, "Unknown Error Occurred.");

      throw redirect(301, "/books");
    } else {
      //Create Book
      const headers = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };
      const query = {
        query: CREATE_BOOK,
        variables: {
          title: form.data.title,
          author: form.data.author,
          pages: form.data.pages,
          publishDate: form.data.publishDate,
          isFiction: form.data.isFiction,
          review: form.data.review,
          genres: form.data.selectedGenres,
          rating: form.data.rating,
        },
      };
      const options = {
        method: "POST",
        headers,
        body: JSON.stringify(query),
      };
      const res = await fetch(GRAPHQL_URL, options);
      const { data, errors } = await res.json();

      if (errors) throw error(505, errors[0].message);
      if (data.createBook != true) throw error(505, "Unknown Error Occurred.");

      throw redirect(301, "/books");
    }
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
} satisfies Actions;
