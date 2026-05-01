export const LOGICAL_OP = {
	and: 'AND',
	or: 'OR'
};
export const COMPARISON_OP = {
	greater: '>',
	greater_or_equal: '>=',
	equal: '=',
	not_equal: '!=',
	less_or_equal: '<=',
	less: '<',
	like: '~',
	not_like: '!~',
	in: 'in',
	not_in: '!in'
};
export const PREFIX_OP = {
	has: '+',
	not: '!'
};

export const LOGICAL_OP_RGX = new RegExp(
	`[ ]+(${Object.values(LOGICAL_OP)
		.map((o) => o.replaceAll('|', '\\|'))
		.join('|')})[ ]+`,
	'g'
);
export const COMPARISON_OP_RGX = new RegExp(
	`[ ]+(${Object.values(COMPARISON_OP).join('|')})[ ]+`,
	'gi'
);
export const PREFIX_OP_RGX = new RegExp(
	`^${Object.values(PREFIX_OP)
		.map((o) => o.replaceAll('+', '\\+'))
		.join('|')}`
);

export const LOGICAL_OP_VALUES = Object.values(LOGICAL_OP);
export const PREFIX_OP_VALUES = Object.values(PREFIX_OP);

export const SUBQUERY_START = '(';
export const SUBQUERY_END = ')';
