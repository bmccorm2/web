import * as z from 'zod/mini';

export const inputSchema = z.object({
	price: z.coerce.number().check(z.gt(0), z.lt(100)),
	gallons: z.coerce.number().check(z.gt(0), z.lt(50)),
	miles: z.coerce.number().check(z.gt(0), z.lt(1000)),
	notes: z.optional(z.string()),
	carId: z.string()
});
