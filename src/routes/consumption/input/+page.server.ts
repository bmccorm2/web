import type { Actions } from './$types';
import { CREATE_CONSUMPTION } from '$lib/server/queries';
import { GRAPHQL_URL } from '$env/static/private';
import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { z } from 'zod';

export const prerender = false;

const inputSchema = z.object({
	price: z.number().gt(0).lt(100).default(NaN),
	gallons: z.number().gt(0).lt(50).default(NaN),
	miles: z.number().gt(0).lt(1000).default(NaN),
	notes: z.string().nullable()
});

export const load = async () => {
	const form = await superValidate(inputSchema);
	return { form };
};

export const actions: Actions = {
	create: async ({ request, fetch }) => {
		const form = await superValidate(request, inputSchema);

		if (!form.valid) return fail(400, { form });

		const { price, gallons, miles, notes } = form.data;

		try {
			const headers = {
				'Content-Type': 'application/json',
				Accept: 'application/json'
			};
			const query = {
				query: CREATE_CONSUMPTION,
				variables: { price, gallons, miles, notes, carId: 1 }
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
			return { form };
		} catch (error) {
			console.log(error);
		}
	}
};
