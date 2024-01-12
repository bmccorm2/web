import { client } from "$lib/server/dbClient";
import { INSERT_CONSUMPTION } from "$lib/server/queries";
import type { Actions } from "./$types";
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
    const res = await client.execute({
      sql: INSERT_CONSUMPTION,
      args: {
        carId: 4,
        price,
        gallons,
        miles,
        notes,
      },
    });

    if (res.rowsAffected != 1) error(505, "Error creating record");

    return message(form, { isSuccess: true });
  },
};
