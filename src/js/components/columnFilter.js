import Component from './component.js';

export default class ColumnFilter extends Component {
	selectedColumns = [];

	init() {
		this.setupEvents();
	}

	setupEvents() {
		this.$('#filter-all').addEventListener('click', () => {
			this.inputs.map((input) => (input.checked = true));
		});

		this.$('#filter-none').addEventListener('click', () => {
			this.inputs.map((input) => (input.checked = false));
		});

		this.$('#filter-dialog').addEventListener('toggle', (e) => {
			if (e.newState === 'closed') {
				const selectedColumns = this.inputs
					.map((input) => {
						return input.checked && input.value;
					})
					.filter(Boolean);

				if (!selectedColumns.length) {
					this.$('#filter-open').click();
					return;
				}

				if (
					selectedColumns.length !== this.selectedColumns.length ||
					selectedColumns.some((c, i) => c !== this.selectedColumns[i])
				) {
					this.dispatchEvent('change', { selectedColumns });
					this.selectedColumns = selectedColumns;
				}
			}
		});
	}

	/**
	 * @param {string[]} columns
	 */
	setColumns(columns) {
		const raw = columns.sort().map((c) => {
			return `
            <li>
                <label>
                    <input type="checkbox" name="columns" value="${c}" checked>
                    ${c}
                </label>
            </li>
            `;
		});
		this.$('#filter-list').innerHTML = raw.join('');

		this.inputs = [...this.$$('#filter-list input[type="checkbox"]')];
		this.selectedColumns = columns;
	}
}

customElements.define('column-filter', ColumnFilter);
