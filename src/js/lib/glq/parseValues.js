/**
 * Parse the value of some special properties.
 * @param {string} prop
 * @param {string} value1
 * @param {string} value2
 * @returns {*[]}
 */
export function parseValues(prop, value1, value2) {
	/** @type {string|string[]|number|Date} parsedValue1 */
	let parsedValue1 = value1;
	/** @type {string|number|Date} parsedValue2 */
	let parsedValue2 = value2;

	switch (prop) {
		case 'rating':
		case 'gametime':
		case 'playcount':
			parsedValue1 = Number(value1);
			parsedValue2 = Number(value2);
			break;

		case 'genre':
		case 'lang':
			parsedValue1 = value1.split(/[ ]*[/,][ ]*/g);
			break;

		case 'players':
			parsedValue1 = parsePlayers(value1);
			parsedValue2 = Number(value2);
			break;

		case 'releasedate':
		case 'lastplayed':
			parsedValue1 = new Date(parseDate(value1));
			parsedValue2 = new Date(value2);
			break;
	}
	return [parsedValue1, parsedValue2];
}

export function parseDate(value) {
	const date = value.split('T')[0];
	return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
}

export function parsePlayers(value) {
	return Math.max(...value.split(/\D+/g).map(Number));
}
