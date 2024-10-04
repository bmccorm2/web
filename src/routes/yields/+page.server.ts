import { GET_YIELDS } from "$lib/server/queries_graphql";
import { GRAPHQL_URL } from "$env/static/private";
import { error, type LoadEvent } from "@sveltejs/kit";

export const load = async ({ fetch }: LoadEvent) => {
   const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
   };
   const query = {
      query: GET_YIELDS,
   };
   const options = {
      method: "POST",
      headers,
      body: JSON.stringify(query),
   };

   const res = await fetch(GRAPHQL_URL, options);

   const {
      data: { yields },
   } = await res.json();
   if (yields && yields.length != 3) error(505, "Insufficient data.");

   return { yields };
};
