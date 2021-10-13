export const parseRawStringToNumberArray = (rawString: string, separator = ';'): {
	rawString: string,
	numbers: number[] | null
} => {
	rawString = rawString.replace(/\s/g, '');
	let numbers: number[] | null = rawString
		.split(separator)
		.map(number => parseInt(number));
	if (numbers.some(number => Number.isNaN(number))) {
		numbers = null;
	}
	return {
		rawString,
		numbers
	};
};