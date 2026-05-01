import { CODE_EXEC } from '../events.js';
import Component from './component.js';

export default class CodeEditor extends Component {
	init() {
		this.initEditor(this.$('#editor'));
		this.addCommands();
		this.setupEvents();
		this.addStyles();
	}

	addStyles() {
		if (this.shadowRoot) {
			// Append styles from document
			const { firstChild } = this.shadowRoot;
			[
				'autocompletion',
				'snippets',
				'error_marker',
				'ace_editor',
				'ace_scrollbar'
			].forEach((cssID) => {
				const styleNode = document.querySelector(`style[id="${cssID}.css"]`);
				if (styleNode) {
					this.shadowRoot?.insertBefore(styleNode, firstChild);
				}
			});
		}
	}

	initEditor(editorElement) {
		this.editor = window.ace.edit(editorElement);
		const { editor } = this;
		editor.session.setMode('ace/mode/glq');
		editor.setTheme('ace/theme/light-dark');
		editor.renderer.setOption('showGutter', false);
		editor.setOptions({
			highlightActiveLine: false,
			highlightSelectedWord: false,
			enableLiveAutocompletion: true,
			enableBasicAutocompletion: true,
			vScrollBarAlwaysVisible: false,
			placeholder: 'Enter search query, e.g. name = Sonic AND rating > 0.5'
		});

		const completer = this.getCompleter();
		completer.parentNode = this.shadowRoot;
	}

	addCommands() {
		// Disable Enter key by binding it to an empty command
		this.editor.commands.addCommand({
			name: 'blockEnter',
			bindKey: { win: 'Enter', mac: 'Enter' },
			exec: (editor) => {
				const value = editor.getValue();
				if (value) {
					this.dispatchCustomEvent(CODE_EXEC, { value });
				}
			}
		});
	}

	/**
	 * Get the Autocomplete instance.
	 * @returns {Autocomplete}
	 */
	getCompleter() {
		const { Autocomplete } = window.ace.require('ace/autocomplete');
		return Autocomplete.for(this.editor);
	}

	setCompleters(values) {
		const keyWordCompleter = {
			// biome-ignore lint: lint/correctness/noUnusedFunctionParameters
			getCompletions: (editor, session, pos, prefix, callback) => {
				callback(
					null,
					values.map((v) => ({
						name: v,
						value: v,
						score: 0,
						meta: '',
						completerId: keyWordCompleter.id
					}))
				);
			},
			id: 'keywordCompleter'
		};
		const langTools = window.ace.require('ace/ext/language_tools');
		langTools.setCompleters([keyWordCompleter]);
	}

	setupEvents() {
		const { editor } = this;
		const completer = this.getCompleter();

		editor.on('click', () => {
			const value = editor.getValue();
			if (!value) {
				completer.showPopup(editor);
			}
		});
	}

	focus() {
		this.editor.focus();
	}

	get value() {
		return this.editor.getValue();
	}

	set value(val) {
		this.editor.setValue(val);
	}
}

customElements.define('code-editor', CodeEditor);
