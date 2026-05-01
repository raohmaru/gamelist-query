/**
 * Export the filtered games to a gamelist.xml file.
 * @param {Element[]} games
 * @param {number[]} indexes
 */
export function exportToXml(games, indexes) {
	let xml = '<?xml version="1.0"?>\n<gameList>\n\t';
	indexes.forEach((index) => {
		const game = games[index];
		if (game) {
			xml += game.outerHTML;
		}
	});
	xml += '\n</gameList>';
	const blob = new Blob([xml], { type: 'application/xml' });
	download(blob, 'xml');
}

/**
 * Export the HTMLTableElement games to a CSV file.
 * @param {HTMLTableElement} table
 */
export function exportToCSV(table) {
	let csv = '';
	csv += [...table.querySelectorAll('thead th')]
		.map((th) => th.textContent.trim())
		.join(',');
	csv += '\n';
	csv += [...table.querySelectorAll('tbody tr')]
		.map((tr) => {
			return [...tr.children]
                .map((td) => `"${td.textContent.replaceAll('\n', '').trim()}"`)
                .join(',');
		})
		.join('\n');
	const blob = new Blob([csv], { type: 'text/csv' });
	download(blob, 'csv');
}

/**
 * Download a blob as a file.
 * @param {Blob} blob
 * @param {string} ext
 */
function download(blob, ext) {
	const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
	const url = URL.createObjectURL(blob);
	const link = document.createElement('a');
	link.href = url;
	link.download = `gamelist_${timestamp}.${ext}`;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
