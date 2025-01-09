export const formatToMST = (date: string) => {
	const localDate = new Date(date);
	localDate.setHours(localDate.getHours() - 7);

	const options = {
		timeZone: 'America/Denver',
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	} as const;

	return localDate.toLocaleString('en-US', options);
}