ace.define('ace/mode/glq_highlight_rules', (require, exports) => {
	const oop = require('../lib/oop');
	const textHighlightRules =
		require('./text_highlight_rules').TextHighlightRules;
	const HighlightRules = function () {
		const keywords = 'and|or';
		const dataTypes = 'numeric|string';
		const keywordMapper = this.createKeywordMapper(
			{
				keyword: keywords,
				'storage.type': dataTypes
			},
			'identifier',
			true
		);
		this.$rules = {
			start: [
				{
					token: 'constant.numeric', // float
					regex: '[+-]?\\d+(?:(?:\\.\\d*)?(?:[eE][+-]?\\d+)?)?\\b'
				},
				{
					token: keywordMapper,
					regex: '[a-zA-Z_$][a-zA-Z0-9_$]*\\b'
				},
				{
					token: 'keyword.operator',
					regex: '~|!~|<|>|<=|=>|=|!=|!'
				},
				{
					token: 'text',
					regex: '\\s+'
				}
			]
		};
		this.normalizeRules();
	};
	oop.inherits(HighlightRules, textHighlightRules);
	exports.SqlHighlightRules = HighlightRules;
});

ace.define('ace/mode/glq', (require, exports) => {
	const oop = require('../lib/oop');
	const textMode = require('./text').Mode;
	const HighlightRules = require('./glq_highlight_rules').SqlHighlightRules;
	const mode = function () {
		this.HighlightRules = HighlightRules;
		this.$behaviour = this.$defaultBehaviour;
	};
	oop.inherits(mode, textMode);
	(function () {
		this.$id = 'ace/mode/glq';
	}).call(mode.prototype);
	exports.Mode = mode;
});

(() => {
	ace.require(['ace/mode/glq'], (mode) => {
		if (typeof module === 'object' && typeof exports === 'object' && module) {
			module.exports = mode;
		}
	});
})();
