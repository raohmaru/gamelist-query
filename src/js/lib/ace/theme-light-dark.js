// biome-ignore lint: lint/correctness/noUnusedFunctionParameters
window.ace.define('ace/theme/light-dark-css', (require, exports, module) => {
	module.exports = `
.ace-light-dark {
    color: black;

    .ace_placeholder {
        font-family: var(--font-code);
    }

    .ace_cursor {
        color: black;
    }

    .ace_invisible {
        color: rgb(191, 191, 191);
    }

    .ace_paren {
        color: #168185;
    }

    .ace_constant.ace_buildin {
        color: rgb(88, 72, 246);
    }

    .ace_constant.ace_language {
        color: rgb(88, 92, 246);
    }

    .ace_constant.ace_library {
        color: rgb(6, 150, 14);
    }

    .ace_invalid {
        background-color: rgb(153, 0, 0);
        color: white;
    }

    .ace_support.ace_function {
        color: rgb(60, 76, 114);
    }

    .ace_support.ace_constant {
        color: rgb(6, 150, 14);
    }

    .ace_support.ace_type,
    .ace_support.ace_class .ace_support.ace_other {
        color: rgb(109, 121, 222);
    }

    .ace_variable.ace_parameter {
        font-style: italic;
        color: #fd971f;
    }

    .ace_keyword.ace_operator {
        color: rgb(104, 118, 135);
    }

    .ace_constant.ace_numeric {
        color: rgb(0, 0, 205);
    }

    .ace_variable {
        color: rgb(49, 132, 149);
    }

    .ace_xml-pe {
        color: rgb(104, 104, 91);
    }

    .ace_entity.ace_name.ace_function {
        color: #0000a2;
    }

    .ace_heading {
        color: rgb(12, 7, 255);
    }

    .ace_list {
        color: rgb(185, 6, 144);
    }

    .ace_marker-layer .ace_selection {
        background: rgb(181, 213, 255);
    }

    .ace_marker-layer .ace_step {
        background: rgb(252, 255, 0);
    }

    .ace_marker-layer .ace_stack {
        background: rgb(164, 229, 101);
    }

    .ace_marker-layer .ace_bracket {
        margin: -1px 0 0 -1px;
        border: 1px solid rgb(192, 192, 192);
    }

    .ace_marker-layer .ace_active-line {
        background: rgba(0, 0, 0, 0.07);
    }

    .ace_marker-layer .ace_selected-word {
        background: rgb(250, 250, 255);
        border: 1px solid rgb(200, 200, 250);
    }

    .ace_storage,
    .ace_keyword,
    .ace_meta.ace_tag {
        color: rgb(147, 15, 128);
    }

    .ace_string.ace_regex {
        color: rgb(255, 0, 0);
    }

    .ace_string {
        color: #1a1aa6;
    }

    .ace_entity.ace_other.ace_attribute-name {
        color: #994409;
    }
}

@media (prefers-color-scheme: dark) {
    .ace-light-dark {
        color: #E6E1DC;

        .ace_cursor {
            border-left: 1px solid #7991E8;
        }

        .ace_overwrite-cursors .ace_cursor {
            border: 1px solid #FFE300;
            background: #766B13;
        }

        .ace-ambiance.normal-mode .ace_cursor-layer {
            z-index: 0;
        }

        .ace_marker-layer .ace_selection {
            background: rgba(221, 240, 255, 0.20);
        }

        .ace_marker-layer .ace_selected-word {
            border-radius: 4px;
            border: 8px solid #3f475d;
        }

        .ace_marker-layer .ace_step {
            background: rgb(198, 219, 174);
        }

        .ace_marker-layer .ace_bracket {
            margin: -1px 0 0 -1px;
            border: 1px solid rgba(255, 255, 255, 0.25);
        }

        .ace_marker-layer .ace_active-line {
            background: rgba(255, 255, 255, 0.031);
        }

        .ace_invisible {
            color: #333;
        }

        .ace_paren {
            color: #24C2C7;
        }

        .ace_keyword {
            color: #cda869;
        }

        .ace_keyword.ace_operator {
            color: #fa8d6a;
        }

        .ace_punctuation.ace_operator {
            color: #fa8d6a;
        }

        .ace-statement {
            color: #cda869;
        }

        .ace_constant {
            color: #CF7EA9;
        }

        .ace_constant.ace_language {
            color: #CF7EA9;
        }

        .ace_constant.ace_numeric {
            color: #78CF8A;
        }

        .ace_invalid {
            text-decoration: underline;
        }

        .ace_invalid.ace_illegal {
            color: #F8F8F8;
            background-color: rgba(86, 45, 86, 0.75);
        }

        .ace_invalid,
        .ace_deprecated {
            text-decoration: underline;
            font-style: italic;
            color: #D2A8A1;
        }

        .ace_support {
            color: #9B859D;
        }

        .ace_support.ace_function {
            color: #DAD085;
        }

        .ace_function.ace_buildin {
            color: #9b859d;
        }

        .ace_string {
            color: #8f9d6a;
        }

        .ace_string.ace_regexp {
            color: #DAD085;
        }

        .ace_definition,
        .ace_type {
            color: #aac6e3;
        }

        .ace_variable {
            color: #9999cc;
        }

        .ace_variable.ace_language {
            color: #9b859d;
        }

        .ace_xml-pe {
            color: #494949;
        }
    }
}
`;
});

window.ace.define('ace/theme/light-dark', (require, exports) => {
	exports.cssClass = 'ace-light-dark';
	exports.cssText = require('./light-dark-css');
	const dom = require('../lib/dom');
	dom.importCssString(exports.cssText, exports.cssClass, true);
});

(() => {
	window.ace.require(['ace/theme/light-dark'], (theme) => {
		if (typeof module === 'object' && typeof exports === 'object' && module) {
			module.exports = theme;
		}
	});
})();
