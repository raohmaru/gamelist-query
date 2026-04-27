import { generateTree } from './queryTree.js';
import { compareValues } from './compare.js';
import {
	PREFIX_OP,
	PREFIX_OP_RGX,
	LOGICAL_OP,
	LOGICAL_OP_VALUES
} from './operators.js';

function gameQuery(game, queryTree) {
	let include = false;
	let lastOperator;
	for (let i = 0; i < queryTree.length; i++) {
		const [left, operator, value] = queryTree[i];
		let result = false;

		// Is a sub-query?
		if (Array.isArray(left)) {
			result = gameQuery(game, queryTree[i]);
		} else {
			const prop = left.replace(PREFIX_OP_RGX, '');
			const node = game.getElementsByTagName(prop)?.[0];

			// Handle prefixes
			if (left[0] === PREFIX_OP.not && !node) {
				include = true;
				continue;
			}

			if (LOGICAL_OP_VALUES.includes(prop)) {
				lastOperator = prop;
				continue;
			}

			// Game doesn't have the property, or invalid query
			if (!node || !operator || !value) {
				continue;
			}

			result = compareValues(
				prop,
				node.textContent.trim().toLowerCase(),
				value.toLowerCase(),
				operator
			);
		}

		// Logical operators
		if (lastOperator) {
			switch (lastOperator) {
				case LOGICAL_OP.and:
					include &&= result;
					break;
				case LOGICAL_OP.or:
					include ||= result;
					break;
			}
			lastOperator = undefined;
		} else {
			include = result;
		}
	}

	return include;
}

/**
 * Filter a gamelist.xml string based on a query.
 * @param {Element[]} games
 * @param {string} query
 * @returns {number[]}
 */
export default function (games, query) {
	const queryTree = generateTree(query);
	const filteredGameIdxs = [];
	games.forEach((game, idx) => {
		const include = gameQuery(game, queryTree);
		if (include) {
			filteredGameIdxs.push(idx);
		}
	});

	return filteredGameIdxs;
}
