import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import {
  swimWorkoutSchema,
  type SwimTag,
  type SwimWorkoutDb,
} from "$lib/types";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { db } from "$lib/server/databaseClient";
import {
  DELETE_STA,
  GET_SWIM_TAGS,
  GET_SWIM_WORKOUT,
  INSERT_STA,
  INSERT_SWIM_WORKOUT,
  UPDATE_SWIM_WORKOUT,
} from "$lib/server/queries";
import type { PageServerLoad } from "./$types";
import { serializeSwimWorkout } from "$lib/server/utilities";

export const load: PageServerLoad = async ({ params }) => {
  const id = params.id ? parseInt(params.id) : -1;

  const rs = await db.batch(
    [GET_SWIM_TAGS, { sql: GET_SWIM_WORKOUT, args: { id } }],
    "read",
  );
  const swimTags = rs[0].rows as unknown as SwimTag[];
  // Giving an ID so this will always come back with one record.  Grabbing it.
  const swimWorkout = serializeSwimWorkout(
    rs[1].rows as unknown as SwimWorkoutDb[],
  )[0];

  const form = await superValidate(swimWorkout, zod(swimWorkoutSchema));

  return {
    form,
    swimTags,
    swimWorkout,
  };
};

export const actions: Actions = {
  modify: async (event) => {
    const form = await superValidate(event, zod(swimWorkoutSchema));
    if (!form.valid) return fail(400, { form });

    const { swimWorkoutText, yards, tags, id } = form.data;
    const transaction = await db.transaction("write");

    if (id) {
      //UPDATE EXISTING WORKOUT
      await transaction.execute({
        sql: UPDATE_SWIM_WORKOUT,
        args: { id, swimWorkoutText, yards },
      });
      await transaction.execute({
        sql: DELETE_STA,
        args: { swimWorkoutId: id },
      });
      tags?.forEach(async (e: SwimTag) => {
        await transaction.execute({
          sql: INSERT_STA,
          args: { swimWorkoutId: id, swimTagId: e.id },
        });
      });
    } else {
      //CREATE NEW WORKOUT
      const rs = await transaction.execute({
        sql: INSERT_SWIM_WORKOUT,
        args: {
          swimWorkoutText,
          yards,
        },
      });

      const swimWorkoutId = Number(rs.lastInsertRowid);

      tags?.forEach(async (e: SwimTag) => {
        await transaction.execute({
          sql: INSERT_STA,
          args: {
            swimWorkoutId,
            swimTagId: e.id,
          },
        });
      });
    }

    await transaction.commit();
    redirect(301, "/swimming");
  },
};
