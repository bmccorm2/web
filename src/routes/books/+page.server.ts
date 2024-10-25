import { error } from "@sveltejs/kit";
import type { Actions } from "./$types.js";
import { db } from "$lib/server/databaseClient.js";
import { DELETE_BGA, DELETE_BOOK, GET_BOOKS } from "$lib/server/queries.js";
import type { BookDb } from "$lib/types.js";
import { serializeBooks } from "$lib/server/utilities.js";

export const load = async () => {
  try {
    const res = await db.execute(GET_BOOKS);
    const books = serializeBooks(res.rows as unknown as BookDb[]);

    return { books };
  } catch (e: any) {
    error(505, e.message);
  }
};

export const actions: Actions = {
  deleteBook: async ({ request }) => {
    const formData = await request.formData();
    const id = parseInt(formData.get("id") as string);

    const transaction = await db.transaction("write");
    await transaction.execute({
      sql: DELETE_BGA,
      args: { id },
    });
    await transaction.execute({
      sql: DELETE_BOOK,
      args: { id },
    });

    await transaction.commit();

    return { success: "true" };
  },
};
