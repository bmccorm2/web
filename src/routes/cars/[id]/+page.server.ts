import { GET_CAR_DETAILS } from "$lib/server/queries_graphql";
import type { PageServerLoad } from "./$types";
import { GRAPHQL_URL } from "$env/static/private";

export const load = (async ({ fetch, params }) => {
  const carId = parseInt(params.id);
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const query = {
    query: GET_CAR_DETAILS,
    variables: { carId },
  };
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(query),
  };

  const res = await fetch(GRAPHQL_URL, options);
  const {
    data: { cars, carDetails },
  } = await res.json();

  return { cars, carDetails };
}) satisfies PageServerLoad;
