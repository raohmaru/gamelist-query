import Component from './component.js';
import gamelistQuery from '../lib/glq/gamelistQuery.js';
import { parseDate, parsePlayers } from '../lib/glq/parseValues.js';
import { exportToXml, exportToCSV } from '../utils/export.js';
import dragScroll from '../utils/dragScroll.js';
import { $ } from '../lib/rtkjs/dom.js';
import { pluralize } from '../lib/rtkjs/string.js';
import { COMPARISON_OP } from '../lib/glq/operators.js';

export default class GamelistQuery extends Component {
	init() {
		this.games = [];
		this.gamesFiltered = [];
		this.sortColumn = null;
		this.sortDirection = 'asc';
		this.properties = [];
		this.propertiesFiltered = [];

		this.setupEvents();
	}

	setupEvents() {
		this.$('#execute-btn').addEventListener('click', () => this.executeQuery());

		this.$('#reset-btn').addEventListener('click', () => {
			this.reset();
			this.$('code-editor').focus();
		});

		this.$('#export-xml-btn').addEventListener('mousedown', () =>
			exportToXml(this.games, this.gamesFiltered)
		);
		this.$('#export-csv-btn').addEventListener('mousedown', () =>
			exportToCSV(this.$('#table-container table'))
		);

		this.$('#help-btn').addEventListener('click', () => {
			$('modal-modal').open({
				title: 'How to Search',
				message: `
The search query consists of the name of a property (${Object.values(
					this.properties
				)
					.slice(0, 3)
					.map((p) => `<code>${p}</code>`)
					.join(', ')}, etc), an operator (${Object.values(COMPARISON_OP)
					.map((p) => `<code>${p}</code>`)
					.join(', ')}) and a value to compare with the game property.<br>
You can join queries with <code>AND</code> or <code>OR</code>, and create sub-queries by enclosing a query in parentheses <code>(...)</code>.<br><br>
To search games missing a property, prefix the property with <code>!</code>.<br><br>
<strong>Examples:</strong><br>
Games with "Sonic" in the title and the rating is greater than 0.5 and the property "publisher" is missing.
<pre>
name ~ Sonic AND rating > 0.5 AND !publisher
</pre>
Games with number of players greater than 2 and which genre is "Adventure" or it was released on February 1990 and before.
<pre>
players > 2 AND (genre = Adventure OR releasedate <= 1990-02)
</pre>
`
			});
		});

		this.$('code-editor').addEventListener('exec', (e) =>
			this.executeQuery(e.detail.value)
		);

		this.$('column-filter').addEventListener('change', (e) => {
			this.propertiesFiltered = e.detail.selectedColumns;
			this.renderTable(this.gamesFiltered);
		});

		const tableContainer = this.$('#table-container');
		tableContainer.addEventListener('click', (e) => {
			if (e.target.tagName === 'TH') {
				const prop = e.target.dataset.prop;
				if (this.sortColumn === prop) {
					this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
				} else {
					this.sortColumn = prop;
					this.sortDirection = 'asc';
				}
				this.renderTable(this.gamesFiltered);
			}
		});

		document.addEventListener('modal', (e) => {
			this.toggleAttribute('inert', e.detail.open);
			if (!e.detail.open) {
				this.$('code-editor').focus();
			}
		});

		dragScroll(tableContainer, (e) => e.altKey);
	}

	loadGames(games) {
		this.games = games;

		const allProperties = new Set();
		games.forEach((game) => {
			Array.from(game.children).forEach((child) => {
				allProperties.add(child.tagName);
			});
		});
		this.properties = Array.from(allProperties);
		this.propertiesFiltered = this.properties.slice();

		this.show();
		this.reset();

		this.$('code-editor').setCompleters(this.properties.slice());
		this.$('column-filter').setColumns(this.properties.slice());
	}

	executeQuery() {
		const query = this.$('code-editor').value.trim();
		if (!query) {
			if (this.games.length !== this.gamesFiltered.length) {
				this.reset();
			}
			this.$('code-editor').focus();
			return;
		}

		try {
			this.gamesFiltered = gamelistQuery(this.games, query);
		} catch (error) {
			$('modal-modal').open({
				message: error.message,
				title: 'Query Error',
				type: 'warning'
			});
			return;
		}

		this.renderTable(this.gamesFiltered);
	}

	reset() {
		this.sortColumn = null;
		this.sortDirection = 'asc';
		this.gamesFiltered = Array.from(this.games, (_, i) => i);
		this.$('code-editor').value = '';
		this.renderTable(this.gamesFiltered);
	}

	renderTable(gameIdxs) {
		const container = this.$('#table-container');
		const info = this.$('#info');

		if (gameIdxs.length === 0) {
			container.innerHTML = '<div class="empty">No games found</div>';
			info.textContent = '';
			return;
		}

		const sortProp = this.sortColumn;
		let sortedGames = [...gameIdxs];
		if (sortProp) {
			sortedGames = [...gameIdxs].sort((a, b) => {
				let aVal =
					this.games[a]
						.getElementsByTagName(sortProp)?.[0]
						?.textContent?.trim() || '|||'; // ||| sorts before most values alphabetically
				let bVal =
					this.games[b]
						.getElementsByTagName(sortProp)?.[0]
						?.textContent?.trim() || '!!!'; // !!! sorts after most values alphabetically
				if (sortProp === 'players') {
					aVal = parsePlayers(aVal);
					bVal = parsePlayers(bVal);
				}
				// biome-ignore lint: lint/suspicious/noGlobalIsNan
				if (isNaN(aVal)) {
					if (this.sortDirection === 'asc') {
						return aVal.localeCompare(bVal);
					}
					return bVal.localeCompare(aVal);
				}
				aVal = Number(aVal);
				bVal = Number(bVal);
				if (this.sortDirection === 'asc') {
					return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
				}
				return bVal > aVal ? 1 : bVal < aVal ? -1 : 0;
			});
		}

		const headers = this.properties
			.map((prop) => {
				if (!this.propertiesFiltered.includes(prop)) {
					return '';
				}
				const isSorted = this.sortColumn === prop;
				const cls = isSorted ? `sorted ${this.sortDirection}` : '';
				return `<th class="${cls}" data-prop="${prop}" title="Order table by this property">${prop}</th>`;
			})
			.join('');

		const rows = sortedGames
			.map((idx) => {
				const game = this.games[idx];
				const cells = this.properties
					.map((prop) => {
						if (!this.propertiesFiltered.includes(prop)) {
							return '';
						}
						const node = game.getElementsByTagName(prop)?.[0];
						let value = node?.textContent?.trim() || '';
						if (value) {
							if (/\d{8}T\d{6}/.exec(value)) {
								value = parseDate(value);
							} else if (prop === 'players') {
								value = parsePlayers(value);
							}
						}
						return `<td ${prop === 'desc' ? ' title="' + value.replace(/"/g, "&quot;") + '"' : ''}>
                            ${value}
                        </td>`;
					})
					.join('');
				return `<tr>${cells}</tr>`;
			})
			.join('');

		container.innerHTML = `
            <table>
                <thead><tr>${headers}</tr></thead>
                <tbody>${rows}</tbody>
            </table>
        `;

		let infoText = `${gameIdxs.length} ${pluralize('game', gameIdxs.length)}`;
		if (gameIdxs.length < this.games.length) {
			infoText = `Showing ${gameIdxs.length} / ${this.games.length} ${pluralize('game', gameIdxs.length)}`;
		}
		info.textContent = infoText;
	}
}

customElements.define('gamelist-query', GamelistQuery);
