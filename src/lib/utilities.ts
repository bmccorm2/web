export const formatToMST = (date: number) => {
	const localDate = new Date(date);
	localDate.setHours(localDate.getHours() - 7);

	const options = {
		timeZone: 'America/Denver',
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	} as const;

	return localDate.toLocaleString('en-US', options);
};

export function toEpochMs(dateString: string) {
	// Assumes dateString is in 'YYYY-MM-DD' format
	return new Date(dateString).getTime();
}

export function formatToMSTInput(ms: number): string {
	const date = new Date(ms);

	// MST is UTC-7
	const mstOffset = -7 * 60; // minutes
	const utc = date.getTime() + date.getTimezoneOffset() * 60000;
	const mstDate = new Date(utc + mstOffset * 60000);

	const yyyy = mstDate.getFullYear();
	const mm = String(mstDate.getMonth() + 1).padStart(2, '0');
	const dd = String(mstDate.getDate()).padStart(2, '0');

	return `${yyyy}-${mm}-${dd}`;
}
