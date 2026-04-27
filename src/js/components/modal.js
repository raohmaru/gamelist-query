import Component from './component.js';

export default class Modal extends Component {
	init() {
		this.setupEvents();
	}

	setupEvents() {
		this.$('#close-btn').addEventListener('click', () => this.close());
	}

	onKeyUp(e) {
		if (this.visible && e.key === 'Escape') {
			this.close();
		}
	}

	open({ message, title = 'Info', type }) {
		this.$('#title').textContent = title;
		this.$('#message').innerHTML = message;
		if (type) {
			this.$('.modal').classList.add(type);
		} else {
			this.$('.modal').className = 'modal';
		}
		this.show();
		this.$('#close-btn').focus();
		document.addEventListener('keydown', (e) => this.onKeyUp(e));
		this.dispatchEvent('modal', { open: true });
	}

	close() {
		this.hide();
		document.removeEventListener('keydown', this.onKeyUp);
		this.dispatchEvent('modal', { open: false });
	}
}

customElements.define('modal-modal', Modal);
