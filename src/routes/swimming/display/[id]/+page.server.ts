import { GET_SWIM_WORKOUT } from "$lib/server/queries";
import type { PageServerLoad } from "./$types";
import { db } from "$lib/server/databaseClient";
import { serializeSwimWorkout } from "$lib/server/utilities";
import type { SwimWorkoutDb } from "$lib/types";

export const load: PageServerLoad = async ({params}) => {
	const {id} = params

  const rs = await db.execute({sql: GET_SWIM_WORKOUT, args: {id}})
  const swimWorkout = serializeSwimWorkout(rs.rows as unknown as SwimWorkoutDb[])[0]
  return {swimWorkout}

};