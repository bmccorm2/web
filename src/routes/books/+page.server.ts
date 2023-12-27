import { GRAPHQL_URL } from "$env/static/private";
import { GET_BOOKS, DELETE_BOOK } from "$lib/server/queries";
import { error } from "@sveltejs/kit";
import type { Actions } from "./$types.js";

export const load = async ({ fetch }) => {
  try {
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const query = {
      query: GET_BOOKS,
    };
    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(query),
    };

    const res = await fetch(GRAPHQL_URL, options);
    const {
      data: { books },
    } = await res.json();

    return { books };
  } catch (e: any) {
    error(505, e.message);
  }
};

export const actions: Actions = {
  deleteBook: async ({ request }) => {
    const { id: t } = Object.fromEntries(await request.formData());
    const id = parseInt(t);
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const query = {
      query: DELETE_BOOK,
      variables: { id },
    };
    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(query),
    };
    const res = await fetch(GRAPHQL_URL, options);
    const { data, errors } = await res.json();

    if (errors) error(505, errors[0].message);
    if (data.deleteBook != true) error(505, "Deleting object failed.");

    return { success: "true" };
  },
};
