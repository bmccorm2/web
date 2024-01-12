import { error } from "@sveltejs/kit";
import { client } from "$lib/server/dbClient";
import {
  GET_CARS_OWNED,
  GET_CONSUMPTION,
  GET_SUMMARY,
} from "$lib/server/queries.js";
import type { Cars, Consumption, Summary } from "$lib/types.js";

export const load = async ({ params }) => {
  try {
    const carId = parseInt(params.id);

    const rs = await client.batch(
      [
        GET_CARS_OWNED,
        {
          sql: GET_SUMMARY,
          args: { carId },
        },
        {
          sql: GET_CONSUMPTION,
          args: { carId },
        },
      ],
      "read"
    );

    const cars: Cars[] = rs[0].rows;
    const summary: Summary = rs[1].rows[0];
    const consumption: Consumption[] = rs[2].rows;

    return {
      cars,
      summary,
      consumption,
    };
  } catch (e: any) {
    error(505, e.message);
  }
};
