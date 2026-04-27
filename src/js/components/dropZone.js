import Component from './component.js';
import { $ } from '../lib/rtkjs/dom.js';

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

		this.addEventListener('dragleave', (e) => {
			e.preventDefault();
			dropArea.classList.remove('dragover');
		});

		this.addEventListener('drop', (e) => {
			e.preventDefault();
			dropArea.classList.remove('dragover');
			const file = e.dataTransfer.files[0];
			if (FILE_TYPES.includes(file?.type)) {
				this.handleFile(file);
			} else {
				this.showWarning();
				this.dispatchEvent('file-invalid');
			}
		});

		dropArea.addEventListener('click', () => {
			const input = document.createElement('input');
			input.type = 'file';
			input.accept = '.xml';
			input.onchange = (e) => {
				if (e.target.files[0]) {
					this.handleFile(e.target.files[0]);
				}
			};
			input.click();
		});
	}

	handleFile(file) {
		const reader = new FileReader();
		reader.onload = (e) => {
			const parser = new DOMParser();
			const doc = parser.parseFromString(e.target.result, 'text/xml');
			const games = Array.from(doc.getElementsByTagName('game'));

			if (games.length === 0) {
				this.showWarning();
				this.dispatchEvent('dragleave');
				return;
			}

			this.dispatchEvent('file-loaded', { games });
		};
		reader.readAsText(file);
	}

	showWarning() {
		const modal = $('modal-modal');
		modal.open({
			message: 'Invalid file. No games found in the file loaded.',
			title: 'Warning',
			type: 'warning'
		});
	}
}

customElements.define('drop-zone', DropZone);
