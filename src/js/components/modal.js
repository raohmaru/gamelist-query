import { MODAL_TOGGLE } from '../events.js';
import Component from './component.js';

export default class Modal extends Component {
	type = 'info';

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

	open({ message, title = 'Info', type = 'info' }) {
		this.type = type;
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
		this.dispatchCustomEvent(MODAL_TOGGLE, { open: true, type });
	}

	close() {
		this.hide();
		document.removeEventListener('keydown', this.onKeyUp);
		this.dispatchCustomEvent(MODAL_TOGGLE, { open: false, type: this.type });
	}
}

customElements.define('modal-modal', Modal);
