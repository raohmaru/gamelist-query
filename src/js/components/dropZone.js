import Component from './component.js';
import { $ } from '../lib/rtkjs/dom.js';
import {
	DROP_DRAG_LEAVE,
	DROP_FILE_INVALID,
	DROP_FILE_LOADED,
	DROP_FILE_SELECTOR
} from '../events.js';

const FILE_TYPES = ['text/xml', 'text/plain'];

export default class DropZone extends Component {
	init() {
		this.setupEvents();
	}

	setupEvents() {
		const dropArea = this.$('.drop-area');

		this.addEventListener('dragenter', (e) => {
			e.preventDefault();
			// Not supported in FF
			// if (e.dataTransfer.types[0] === 'Files') {
			dropArea.classList.add('dragover');
			// }
		});

		this.addEventListener('dragover', (e) => {
			e.preventDefault();
		});

		this.addEventListener(DROP_DRAG_LEAVE, (e) => {
			e.preventDefault();
			dropArea.classList.remove('dragover');
		});

		this.addEventListener('drop', (e) => {
			e.preventDefault();
			dropArea.classList.remove('dragover');
			const file = e.dataTransfer?.files[0];
			if (!file) {
				return;
			}
			if (FILE_TYPES.includes(file.type)) {
				this.handleFile(file);
			} else {
				this.showWarning();
				this.dispatchCustomEvent(DROP_FILE_INVALID);
			}
		});

		dropArea.addEventListener('click', () => {
			const input = document.createElement('input');
			input.type = 'file';
			input.accept = '.xml';
			input.onchange = (e) => {
				const target = /** @type {HTMLInputElement} */ (e.target);
				if (target.files?.[0]) {
					this.handleFile(target.files[0]);
				}
			};
			input.click();
		});

		document.addEventListener(DROP_FILE_SELECTOR, () => {
			dropArea.click();
		});
	}

	handleFile(file) {
		const reader = new FileReader();
		reader.onload = (e) => {
			const parser = new DOMParser();
			const doc = parser.parseFromString(
				e.target?.result?.toString() || '',
				'text/xml'
			);
			const games = Array.from(doc.getElementsByTagName('game'));

			if (games.length === 0) {
				this.showWarning();
				this.dispatchCustomEvent(DROP_DRAG_LEAVE);
				return;
			}

			this.dispatchCustomEvent(DROP_FILE_LOADED, { games });
		};
		reader.readAsText(file);
	}

	showWarning() {
		/** @typedef {import('./modal.js').default} Modal */
		const modal = /** @type {Modal} */ ($('modal-modal'));
		modal.open({
			message: 'Invalid file. No games found in the file loaded.',
			title: 'Warning',
			type: 'warning'
		});
	}
}

customElements.define('drop-zone', DropZone);
