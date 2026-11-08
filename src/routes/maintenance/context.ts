import { getContext, setContext } from 'svelte';
import type { Id } from '../../convex/_generated/dataModel';

const KEY = Symbol('maintenance');

export type MaintenanceContext = {
	/** Active car. Child pages only render once it is resolved. */
	readonly carId: Id<'Cars'>;
	/** Appends `?car=` to a path when it is present in the URL. */
	href: (path: string) => string;
};

export function setMaintenanceContext(ctx: MaintenanceContext) {
	setContext(KEY, ctx);
}

export function getMaintenanceContext() {
	return getContext<MaintenanceContext>(KEY);
}
