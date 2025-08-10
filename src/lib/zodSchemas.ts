import { z, number } from 'zod/v4';

export const inputSchema = z.object({
	price: z.coerce.number().gt(0).lt(100),
	gallons: z.coerce.number().gt(0).lt(50),
	miles: z.coerce.number().gt(0).lt(1000),
	notes: z.string().optional(),
	carId: z.string()
});
