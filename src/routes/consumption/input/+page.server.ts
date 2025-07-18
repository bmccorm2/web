import { db } from '$lib/server/databaseClient';
import { INSERT_CONSUMPTION } from '$lib/server/queries';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions } from './$types';
import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms/server';
import { inputSchema } from '$lib/types';

export const load = async () => {
	return {
		form: await superValidate(zod4(inputSchema))
	};
};

export const actions: Actions = {
	create: async (event) => {
		const form = await superValidate(event, zod4(inputSchema));

		if (!form.valid) return fail(400, { form });

		const { price, gallons, miles, notes } = form.data;
		const res = await db.execute({
			sql: INSERT_CONSUMPTION,
			args: {
				carId: 4,
				price,
				gallons,
				miles,
				notes
			}
		});

		if (res.rowsAffected != 1) error(505, 'Error creating record');
		return { form };
	}
};
