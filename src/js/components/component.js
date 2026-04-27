import { $ } from '../lib/rtkjs/dom.js';

export default class Component extends HTMLElement {
	constructor() {
		super();
		this.attachShadow({ mode: 'open' });
	}

	connectedCallback() {
		this.render();
		this.init();
	}

	render() {
		const template = $(`#${this.tagName.toLowerCase()}-tmpl`);
		if (template) {
			const templateContent = template.content;
			this.shadowRoot.appendChild(document.importNode(templateContent, true));
		}
	}

	init() {}

	$(selector) {
		return this.shadowRoot.querySelector(selector);
	}

	$$(selector) {
		return this.shadowRoot.querySelectorAll(selector);
	}

	dispatchEvent(name, detail) {
		super.dispatchEvent(
			new CustomEvent(name, {
				detail,
				bubbles: true,
				composed: true
			})
		);
	}

	hide() {
		this.classList.add('hidden');
	}

	show() {
		this.classList.remove('hidden');
	}

	get visible() {
		return !this.classList.contains('hidden');
	}
}
