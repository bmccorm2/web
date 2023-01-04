import type { Actions } from './$types';
import { CREATE_CONSUMPTION } from '$lib/server/queries';
import { GRAPHQL_URL } from '$env/static/private';
import { error } from '@sveltejs/kit';

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const formData = await request.formData();
		const price = parseFloat(formData.get('price') as string);
		const gallons = parseFloat(formData.get('gallons') as string);
		const miles = parseFloat(formData.get('miles') as string);
		const notes = formData.get('notes');
		const carId = 1;

		try {
			const headers = {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			};
			const query = {
				query: CREATE_CONSUMPTION,
				variables: { price, gallons, miles, notes, carId }
			};
			const options = {
				method: 'POST',
				headers,
				body: JSON.stringify(query)
			};
			const res = await fetch(GRAPHQL_URL, options);
			const { data } = await res.json();
			if (data.createConsumption != true)
				throw error(505, 'Creating object failed.');

			return { success: true };
		} catch (error) {
			console.log(error);
		}
	}
};
