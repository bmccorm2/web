import type { Actions, PageServerLoad } from "./$types";
import { type SwimWorkoutDb } from "$lib/types";
import { error } from "@sveltejs/kit";
import { db } from "$lib/server/databaseClient";
import {
  GET_SWIM_WORKOUTS,
  SOFT_DELETE_SWIM_WORKOUT,
} from "$lib/server/queries";
import { serializeSwimWorkout } from "$lib/server/utilities";

export const load: PageServerLoad = async () => {
  try {
    const rs = await db.execute(GET_SWIM_WORKOUTS);
    const swimWorkouts = serializeSwimWorkout(
      rs.rows as unknown as SwimWorkoutDb[],
    );
    return {
      swimWorkouts,
    };
  } catch (e: any) {
    error(505, e.message);
  }
};

export const actions: Actions = {
  deleteWorkout: async ({ request }) => {
    const formData = await request.formData();
    const id = parseInt(formData.get("id") as string);
    await db.execute({
      sql: SOFT_DELETE_SWIM_WORKOUT,
      args: { id },
    });

    return { success: "true" };
  },
};
