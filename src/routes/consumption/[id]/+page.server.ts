import { error } from "@sveltejs/kit";
import { db } from "$lib/server/databaseClient";
import {
  GET_CARS_OWNED,
  GET_CONSUMPTION,
  GET_SUMMARY,
} from "$lib/server/queries.js";
import type { Cars, Consumption, Summary } from "$lib/types.js";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ params }) => {
  try {
    const carId = parseInt(params.id);

    const rs = await db.batch(
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
      "read",
    );

    const cars: Cars[] = rs[0].rows.map((row: any) => ({
      id: row.id,
      displayName: row.displayName,
    }));
    const summary = rs[1].rows[0] as unknown as Summary;
    const consumption: Consumption[] = rs[2].rows.map((row: any) => ({
      id: row.id,
      miles_per_gallon: row.miles_per_gallon,
      price_per_gallon: row.price_per_gallon,
      notes: row.notes,
      created: row.created,
    }));

    return {
      cars,
      summary,
      consumption,
    };
  } catch (e: any) {
    error(505, e.message);
  }
};
