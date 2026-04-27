import './components/dropZone.js';
import './components/modal.js';
import { $ } from './lib/rtkjs/dom.js';

const dropZone = $('drop-zone');
const queryApp = $('gamelist-query');

document.addEventListener('file-loaded', (e) => {
	dropZone.hide();
	queryApp.loadGames(e.detail.games);
});

document.addEventListener('file-invalid', () => {
	if (queryApp.visible) {
		dropZone.hide();
	}
});

document.addEventListener('dragenter', (e) => {
	e.preventDefault();
	// Not supported in FF
	if (queryApp.visible /* && e.dataTransfer.types[0] === 'Files' */) {
		dropZone.show();
	}
});

document.addEventListener('dragleave', (e) => {
	e.preventDefault();
});

dropZone.addEventListener('dragleave', () => {
	if (queryApp.visible) {
		dropZone.hide();
	}
});

document.addEventListener('dragover', (e) => {
	e.preventDefault();
});

document.addEventListener('drop', (e) => {
	e.preventDefault();
});

// Load files async
await (async () => {
	await import('./components/gamelistQuery.js');
	await import('./components/columnFilter.js');
	await import('./lib/ace/ace.min.js');
	await import('./lib/ace/mode-glq.js');
	await import('./lib/ace/theme-light-dark.js');
	await import('./lib/ace/ext-language_tools.min.js');
	await import('./components/codeEditor.js');
})();

// const games = `
// 	<game id="599">
// 		<path>./TechnoClash (USA, Europe).zip</path>
// 		<name>TechnoClash</name>
// 		<desc>Ronaan, the Wizard Prince, is given the task of chasing the Engine Man..</desc>
// 		<image>./images/TechnoClash (USA, Europe)-image.png</image>
// 		<marquee>./images/TechnoClash (USA, Europe)-marquee.png</marquee>
// 		<thumbnail>./images/TechnoClash (USA, Europe)-thumb.jpg</thumbnail>
// 		<rating>0.75</rating>
// 		<releasedate>19930328T000000</releasedate>
// 		<developer>BlueSky Software</developer>
// 		<publisher>Electronic Arts</publisher>
// 		<genre>Adventure</genre>
// 		<players>1</players>
// 		<lang>en</lang>
// 		<region>us</region>
// 	</game>`;
// const parser = new DOMParser();
// const doc = parser.parseFromString(games, 'text/xml');

// document.dispatchEvent(
//     new CustomEvent('file-loaded', {
//         detail: {
//             games: Array.from(doc.children)
//         }
//     }),
// );
