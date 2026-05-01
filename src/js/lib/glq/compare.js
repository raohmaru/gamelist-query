import { parseValues } from './parseValues.js';
import setDateToLast from './setDateToLast.js';
import { COMPARISON_OP } from './operators.js';

/**
 * Compare two dates using an operator.
 * @param {string} operator
 * @param {Date} leftValue
 * @param {string} rightValue
 * @returns {boolean}
 */
function compareDates(operator, leftValue, rightValue) {
	let result = false;
	const dateParts = rightValue.split('-').map(Number);
	// Adjust month
	dateParts[1] -= 1;

	if (dateParts[0]) {
		result =
			operator === COMPARISON_OP.equal
				? leftValue.getFullYear() === dateParts[0]
				: operator === COMPARISON_OP.not_equal
					? leftValue.getFullYear() !== dateParts[0]
					: false;
	}
	if (result && dateParts[1]) {
		result =
			operator === COMPARISON_OP.equal
				? leftValue.getMonth() === dateParts[1]
				: operator === COMPARISON_OP.not_equal
					? leftValue.getMonth() !== dateParts[1]
					: false;
	}
	if (result && dateParts[2]) {
		result =
			operator === COMPARISON_OP.equal
				? leftValue.getDate() === dateParts[2]
				: operator === COMPARISON_OP.not_equal
					? leftValue.getDate() !== dateParts[2]
					: false;
	}
	return result;
}

/**
 * Compare two values using an operator.
 * @param {string} prop
 * @param {string} value1
 * @param {string} value2
 * @param {string} operator
 * @returns {boolean}
 */
export function compareValues(prop, value1, value2, operator) {
	const [leftValue, rightValue] = parseValues(prop, value1, value2, operator);
	let result = false;
	switch (operator) {
		case COMPARISON_OP.greater:
			if (leftValue instanceof Date && rightValue instanceof Date) {
				setDateToLast(rightValue, value2);
			}
			result = leftValue > rightValue;
			break;

		case COMPARISON_OP.greater_or_equal:
			result = leftValue >= rightValue;
			break;

		case COMPARISON_OP.equal:
			if (leftValue instanceof Date) {
				result = compareDates(operator, leftValue, value2);
			} else if (Array.isArray(leftValue)) {
				result = leftValue.some((v) => v === rightValue);
			} else {
				result = leftValue === rightValue;
			}
			break;

		case COMPARISON_OP.not_equal:
			if (leftValue instanceof Date) {
				result = compareDates(operator, leftValue, value2);
			} else if (Array.isArray(leftValue)) {
				result = leftValue.every((v) => v !== rightValue);
			} else {
				result = leftValue !== rightValue;
			}
			break;

		case COMPARISON_OP.less_or_equal:
			if (leftValue instanceof Date && rightValue instanceof Date) {
				setDateToLast(rightValue, value2);
			}
			result = leftValue <= rightValue;
			break;

		case COMPARISON_OP.less:
			result = leftValue < rightValue;
			break;

		case COMPARISON_OP.like:
			if (typeof leftValue === 'string' && typeof rightValue === 'string') {
				result = leftValue.includes(rightValue);
			} else if (Array.isArray(leftValue)) {
				result = leftValue.some((v) => v.includes(rightValue));
			}
			break;

		case COMPARISON_OP.not_like:
			if (typeof leftValue === 'string' && typeof rightValue === 'string') {
				result = !leftValue.includes(rightValue);
			} else if (Array.isArray(leftValue)) {
				result = leftValue.every((v) => !v.includes(rightValue));
			}
			break;

		case COMPARISON_OP.in: {
			if (typeof leftValue === 'string') {
				result = rightValue.includes(leftValue);
			} else if (Array.isArray(leftValue)) {
				result = leftValue.some((v) => rightValue.includes(v));
			}
			break;
		}

		case COMPARISON_OP.not_in: {
			if (typeof leftValue === 'string') {
				result = !rightValue.includes(leftValue);
			} else if (Array.isArray(leftValue)) {
				result = leftValue.every((v) => !rightValue.includes(v));
			}
			break;
		}
	}
	return result;
}
