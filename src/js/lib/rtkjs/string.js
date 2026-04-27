/**
 * Mini template engine. Parses variables (w/o dot notation) and does not delete undefined variable expressions.
 * @param {string} expr - String expression with {{variables}} to interpolate.
 * @param {RegExp} [regex] - Custom regex to match variables. By default it matches double curly braces `{{variables}}`.
 * @returns {(data:Object|string[]) => string} - A function that accepts an object or an array as argument to interpolate the template variables.
 * @example
 * const templateObj = parseTemplate('{{a}} {{b.c}}');
 * template({a: 'hello', b: {c:'world'}}); // "hello world"
 *
 * const templateArr = parseTemplate('{{}} {{}}');
 * templateArr(["hello", "world"]); // "hello world"
 *
 * const templateArrIndex = parseTemplate('{{0}} {{1}}');
 * templateArrIndex(["hello", "world"]); // "hello world"
 *
 * parseTemplate('{{name}}')(); // "{{name}}"
 */
export const parseTemplate = (expr, regex = /\{\{([^}]*)}}/g) => {
	return (data) => {
		let i = 0;
		return expr.replace(regex, (s, p1) => {
			if (Array.isArray(data)) {
				return data[p1 || i++] || s;
			}
			// Get property of object using a string with dot notation
			return p1.split('.').reduce((o, i) => o[i] ?? s, data || {});
		});
	};
};

/**
 * Pluralize a word based on a given number.
 * @param {string} word - The word to pluralize.
 * @param {number} count - The number determining pluralization.
 * @returns {string} The pluralized or singular form of the word.
 */
export function pluralize(word, count) {
	if (count === 1) {
		return word;
	}
	return pluralForm(word);
}

// Irregular plurals
const IRREGULARS = {
	person: 'people',
	man: 'men',
	woman: 'women',
	child: 'children',
	foot: 'feet',
	mouse: 'mice',
	tooth: 'teeth',
	goose: 'geese',
	phenomenon: 'phenomena',
	criterion: 'criteria',
	analysis: 'analyses',
	basis: 'bases',
	crisis: 'crises',
	thesis: 'theses'
};

/**
 * Get the plural form of a word.
 * Handles common English pluralization rules.
 * @param {string} word - The singular form of the word.
 * @returns {string} The plural form of the word.
 */
function pluralForm(word) {
	const lowerWord = word.toLowerCase();

	if (IRREGULARS[lowerWord]) {
		return IRREGULARS[lowerWord];
	}

	// Words ending in 's', 'x', 'z', 'ch', 'sh' -> add 'es'
	if (/(s|x|z|ch|sh)$/.test(lowerWord)) {
		return `${word}es`;
	}

	// Words ending in 'f' or 'fe' -> replace with 'ves'
	if (lowerWord.endsWith('f')) {
		return `${word.slice(0, -1)}ves`;
	}
	if (lowerWord.endsWith('fe')) {
		return `${word.slice(0, -2)}ves`;
	}

	// Words ending in 'y' preceded by a consonant -> replace 'y' with 'ies'
	if (/[^aeiou]y$/.test(lowerWord)) {
		return `${word.slice(0, -1)}ies`;
	}

	// Default: add 's'
	return `${word}s`;
}
