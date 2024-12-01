const dateFormatter = {
		month: 'short',
		day: 'numeric',
		year: 'numeric'
	} as const;

export const formatDate = (date: string) => {
	const localDate = new Date(date);
	const utcDate = new Date(
		Date.UTC(
			localDate.getFullYear(),
			localDate.getMonth(),
			localDate.getDate(),
			localDate.getHours(),
			localDate.getMinutes(),
			localDate.getSeconds()
		)
	);

	return utcDate.toLocaleString('en-US', dateFormatter)
}