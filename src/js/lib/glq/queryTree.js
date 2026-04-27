import {
	LOGICAL_OP_RGX,
	COMPARISON_OP_RGX,
	PREFIX_OP_VALUES,
	LOGICAL_OP_VALUES,
	SUBQUERY_START,
	SUBQUERY_END
} from './operators.js';

/**
 * Validate a query tree.
 * @param {string[]} queryTree
 * @returns {Boolean}
 * @throws {Error}
 */
function validateTree(queryTree) {
	for (let i = 0; i < queryTree.length; i++) {
		const node = queryTree[i];
		const [left] = node;
		if (Array.isArray(left)) {
			validateTree(node);
			continue;
		}
		// Invalid query?
		if (
			node.length > 3 ||
			(node.length === 1 &&
				!LOGICAL_OP_VALUES.includes(left) &&
				!PREFIX_OP_VALUES.includes(left[0]))
		) {
			throw new Error(`Invalid query "${node.join(' ')}"`);
		}
	}
	return true;
}

/**
 * Generate a query tree from a query string.
 * @param {string} q
 * @returns {string[]}
 */
export function generateTree(q) {
	const queryTree = [];
	const subQueries = [];
	let subQueryIdx = -1;
	const rawTree = q
		// Fix sub-query start marker
		.replace(new RegExp(`(?<=\\S)\\${SUBQUERY_START}`), ` ${SUBQUERY_START}`)
		// Fix sub-query end marker
		.replace(new RegExp(`\\${SUBQUERY_END}(?=\\S)`), `${SUBQUERY_END} `)
		// Split by sub-queries
		.split(new RegExp(`[\\${SUBQUERY_START}\\${SUBQUERY_END}]`))
		.filter(Boolean)
		// Split by logical operators
		.flatMap((c) => c.split(LOGICAL_OP_RGX));
	for (let i = 0; i < rawTree.length; i++) {
		const cond = rawTree[i].split(COMPARISON_OP_RGX).map((c) => c.trim());
		// Sub-query block
		if (cond[0] === '') {
			// Sub-query start
			if (LOGICAL_OP_VALUES.includes(rawTree[i - 1])) {
				subQueryIdx = subQueries.push([]) - 1;
				if (subQueryIdx > 0) {
					subQueries[subQueryIdx - 1].push(subQueries[subQueryIdx]);
				} else {
					queryTree.push(subQueries[subQueryIdx]);
				}
				// Sub-query end
			} else {
				subQueries.splice(subQueryIdx, 1);
				subQueryIdx--;
			}
		} else {
			if (subQueryIdx > -1) {
				subQueries[subQueryIdx].push(cond);
			} else {
				queryTree.push(cond);
			}
		}
	}
	validateTree(queryTree);
	return queryTree;
}
