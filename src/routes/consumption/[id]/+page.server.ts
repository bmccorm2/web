import type { PageServerLoad } from './$types';
import { GRAPHQL_URL } from '$env/static/private';
import { GET_CONSUMPTION } from '$lib/server/queries';

export const load = (async ({ params, fetch }) => {
	try {
		const carId = parseInt(params.id);
		const headers = {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		};
		const query = {
			query: GET_CONSUMPTION,
			variables: { carId }
		};
		const options = {
			method: 'POST',
			headers,
			body: JSON.stringify(query)
		};

		const res = await fetch(GRAPHQL_URL, options);
		const {
			data: { cars, summary, consumption }
		} = await res.json();

		return { cars, summary, consumption };
	} catch (error) {
		console.log(error);
	}
}) satisfies PageServerLoad;
