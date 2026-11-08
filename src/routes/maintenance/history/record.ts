import type { Id } from '../../../convex/_generated/dataModel';
import type {
	ChecklistStepType,
	ChecklistTemplateType,
	ServiceCategory,
	ServiceRecordType
} from '$lib/types';

export type ItemDraft = {
	partId?: Id<'Parts'>;
	name: string;
	partNumber: string;
	quantity: number | undefined;
	unit: string;
	notes: string;
};

export type RecordDraft = {
	date: string;
	mileage: number | undefined;
	title: string;
	category: ServiceCategory;
	minderCode: string;
	cost: number | undefined; // dollars
	notes: string;
	items: ItemDraft[];
	checklist: ChecklistStepType[];
	templateId?: Id<'ChecklistTemplates'>;
};

/** Convex insert/update args without carId. */
export type RecordPayload = Omit<ServiceRecordType, '_id' | '_creationTime' | 'carId'>;

/** Today's local date as YYYY-MM-DD. */
export function today() {
	const d = new Date();
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function emptyDraft(): RecordDraft {
	return {
		date: today(),
		mileage: undefined,
		title: '',
		category: 'Other',
		minderCode: '',
		cost: undefined,
		notes: '',
		items: [],
		checklist: []
	};
}

export function draftFromTemplate(t: ChecklistTemplateType, base = emptyDraft()): RecordDraft {
	return {
		...base,
		title: t.title,
		category: t.category,
		checklist: t.steps.map((text) => ({ text, done: false })),
		templateId: t._id
	};
}

/** Full copy for editing, or a reset copy (today, no mileage, unticked) for duplicating. */
export function draftFromRecord(r: ServiceRecordType, duplicate = false): RecordDraft {
	return {
		date: duplicate ? today() : r.date,
		mileage: duplicate ? undefined : r.mileage,
		title: r.title,
		category: r.category,
		minderCode: duplicate ? '' : (r.minderCode ?? ''),
		cost: duplicate || r.cost === undefined ? undefined : r.cost / 100,
		notes: duplicate ? '' : (r.notes ?? ''),
		items: r.items.map((i) => ({
			partId: i.partId,
			name: i.name,
			partNumber: i.partNumber ?? '',
			quantity: i.quantity,
			unit: i.unit,
			notes: i.notes ?? ''
		})),
		checklist: (r.checklist ?? []).map((s) => ({ text: s.text, done: duplicate ? false : s.done })),
		templateId: r.templateId
	};
}
