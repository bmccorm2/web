// // import { db } from '$lib/server/databaseClient';
// // import { INSERT_CONSUMPTION } from '$lib/server/queries';
// import { zod4 } from 'sveltekit-superforms/adapters';
// import type { Actions } from './$types';
// import { error, fail } from '@sveltejs/kit';
// import { superValidate } from 'sveltekit-superforms/server';
// import { inputSchema } from '$lib/types';
// import { useConvexClient } from 'convex-svelte';

// const CAR_ID = 'j974gq57tzkh75gkqwqxcn0hx97n0nv8';
// const client = useConvexClient();

// export const load = async () => {
// 	return {
// 		form: await superValidate(zod4(inputSchema))
// 	};
// };

// export const actions: Actions = {
// 	create: async (event) => {
// 		const form = await superValidate(event, zod4(inputSchema));

// 		if (!form.valid) return fail(400, { form });

// 		const { price, gallons, miles, notes } = form.data;
// 		const consumptionId = await client.mutation(api.consumption.insert, {
// 			carId: CAR_ID,
// 			price,
// 			gallons,
// 			miles,
// 			notes
// 		});

// 		if (!consumptionId) error(505, 'Error creating record');
// 		return { form };
// 	}
// };
