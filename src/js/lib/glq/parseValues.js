/**
 * Parse the value of some special properties.
 * @param {string} prop
 * @param {string} value1
 * @param {string} value2
 * @returns {*[]}
 */
export function parseValues(prop, value1, value2) {
	switch (prop) {
		case 'rating':
		case 'gametime':
		case 'playcount':
			value1 = Number(value1);
			value2 = Number(value2);
			break;

		case 'genre':
		case 'lang':
			value1 = value1.split(/[ ]*[/,][ ]*/g);
			break;

		case 'players':
			value1 = parsePlayers(value1);
			value2 = Number(value2);
			break;

		case 'releasedate':
		case 'lastplayed':
			value1 = new Date(parseDate(value1));
			value2 = new Date(value2);
			break;
	}
	return [value1, value2];
}

export function parseDate(value) {
	const date = value.split('T')[0];
	return `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6, 8)}`;
}

export function parsePlayers(value) {
	return Math.max(...value.split(/\D+/g).map(Number));
}
