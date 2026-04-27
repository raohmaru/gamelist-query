/**
 * Set the date to the last month of the year, last day of the month, last hour of the day.
 * @param {Date} date
 * @param {String} value
 */
export default function (date, value) {
	const dateParts = value.split('-');
	if (!dateParts[1]) {
		date.setUTCMonth(11);
	}
	if (!dateParts[2]) {
		// Get the last day of the month
		const tempDate = new Date(date.getFullYear(), date.getMonth() + 1);
		tempDate.setUTCDate(tempDate.getDate() - 1);
		date.setUTCDate(tempDate.getDate());
	}
	date.setUTCHours(23, 59, 59);
}
