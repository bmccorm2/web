import { GRAPHQL_URL } from "$env/static/private";
import { UPDATE_BOOK, GET_BOOK } from "$lib/server/queries";
import { error, fail, redirect } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { bookInputSchema } from "$lib/zodSchemas.js";

export const load = async ({ request, params }) => {
  const form = superValidate(request, bookInputSchema);
  const id = parseInt(params.id);

  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const query = {
      query: GET_BOOK,
      variables: {
        id,
      },
    };
    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(query),
    };

    const res = await fetch(GRAPHQL_URL, options);
    const {
      data: { book },
    } = await res.json();
    return { book, form };
  } catch (e: any) {
    throw error(505, e.message);
  }
};

export const actions = {
  updateBook: async ({ request, params }) => {
    const form = await superValidate(request, bookInputSchema);

    if (!form.valid) return fail(400, { form });

    const id = parseInt(params.id);

    const {
      title,
      author,
      pages,
      publishDate,
      isFiction,
      review,
      genreList,
      rating,
    } = form.data;

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const query = {
      query: UPDATE_BOOK,
      variables: {
        id,
        title,
        author,
        pages,
        publishDate,
        isFiction,
        review,
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

    if (errors) throw error(505, errors[0].message);
    if (data.updateBook != true) throw error(505, "Unknown Error Occurred.");

    throw redirect(301, "/books");
  },
};
