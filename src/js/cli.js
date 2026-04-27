import { DOMParser } from '@xmldom/xmldom';
import { readFileSync, existsSync } from 'node:fs';
import gamelistQuery from './lib/glq/gamelistQuery.js';

const args = process.argv.slice(2);
const gamelistXmlPath = args[0];
const rawQuery = args[1];

if (!gamelistXmlPath || !rawQuery) {
	console.log('Usage: node gamelist-query.js <path/to/gamelist.xml> "<query>"');
	process.exit();
}

let buffer;
if (existsSync(gamelistXmlPath)) {
	buffer = readFileSync(gamelistXmlPath);
} else {
	console.log(`Error: file ${gamelistXmlPath} does not exist`);
	process.exit(1);
}

const gamelistString = buffer.toString();
const doc = new DOMParser().parseFromString(gamelistString, 'text/xml');
const games = Array.from(doc.getElementsByTagName('game'));
let filteredGameIdxs;
try {
	filteredGameIdxs = gamelistQuery(games, rawQuery);
} catch (error) {
	console.log(error);
	process.exit(1);
}

console.log('');
filteredGameIdxs.forEach((idx) => {
	const game = games[idx];
	console.log(game.getElementsByTagName('path')[0].textContent);
});
console.log(`\nFound ${filteredGameIdxs.length} games out of ${games.length}`);
