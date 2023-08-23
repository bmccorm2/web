import type { Actions } from "./$types";
import { CREATE_CONSUMPTION } from "$lib/server/queries";
import { GRAPHQL_URL } from "$env/static/private";
import { error, fail } from "@sveltejs/kit";
import { superValidate, message } from "sveltekit-superforms/server";
import { z } from "zod";

export const prerender = false;

const inputSchema = z.object({
  price: z
    .number()
    .gt(0)
    .lt(100)
    .default("" as unknown as number),
  gallons: z
    .number()
    .gt(0)
    .lt(50)
    .default("" as unknown as number),
  miles: z
    .number()
    .gt(0)
    .lt(1000)
    .default("" as unknown as number),
  notes: z.string().nullable(),
});

export const load = async (event) => {
  type Message = { isSuccess: boolean };

  const form = await superValidate<typeof inputSchema, Message>(
    event,
    inputSchema
  );
  return { form };
};

export const actions: Actions = {
  create: async ({ request, fetch }) => {
    const form = await superValidate(request, inputSchema);

    if (!form.valid) return fail(400, { form });

    const { price, gallons, miles, notes } = form.data;

    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    const query = {
      query: CREATE_CONSUMPTION,
      variables: { price, gallons, miles, notes, carId: 1 },
    };
    const options = {
      method: "POST",
      headers,
      body: JSON.stringify(query),
    };
    const res = await fetch(GRAPHQL_URL, options);
    const { errors } = await res.json();
    if (errors) throw error(505, errors.message);

    return message(form, { isSuccess: true });
  },
};
