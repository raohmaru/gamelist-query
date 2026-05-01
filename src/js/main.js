import './components/dropZone.js';
import './components/modal.js';
import {
	DROP_DRAG_LEAVE,
	DROP_FILE_INVALID,
	DROP_FILE_LOADED
} from './events.js';
import { $ } from './lib/rtkjs/dom.js';

/** @typedef {import('./components/dropZone.js').default} DropZone */
const dropZone = /** @type {DropZone} */ ($('drop-zone'));
/** @typedef {import('./components/gamelistQuery.js').default} GamelistQuery */
const queryApp = /** @type {GamelistQuery} */ ($('gamelist-query'));

document.addEventListener(DROP_FILE_LOADED, (e) => {
	dropZone?.hide();
	queryApp?.loadGames(/** @type {CustomEvent} */ (e).detail.games);
});

document.addEventListener(DROP_FILE_INVALID, () => {
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

document.addEventListener(DROP_DRAG_LEAVE, (e) => {
	e.preventDefault();
});

dropZone.addEventListener(DROP_DRAG_LEAVE, () => {
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

// const games = `<gameList>
// 	<game id="5">
// 		<path>./Sonic The Hedgehog (World) (Hack).zip</path>
// 		<name>Sonic The Hedgehog</name>
// 		<desc>Sonic the Hedgehog is the first of many games starring Sega's premier rodent Sonic. It's a side scrolling platform game with a difference: speed. Sonic rushes through levels with incredible speed, allowing him to traverse loops and jumps with linear. The evil Dr. Robotnik has captured many of Sonic's animal friends and trapped them inside robots. Sonic can free his friends by destroying the robots with his spin attack. Meanwhile, Dr. Robotnik is trying to control the all-powerful chaos emeralds and Sonic must grab them before he does in the 3D rotating bonus levels. Sonic's weapon is his spin attack; while jumping, Sonic destroys hostile robots by touch. Throughout the platforming levels Sonic collects numerous rings. If Sonic is hit by an enemy, all the rings he's carrying fall out and scatter around; Sonic can quickly grab the rings back before they disappear. If Sonic is hit while not carrying any rings, he dies. Collecting 100 rings gives Sonic an extra life. There is also an invincibility bonus which temporarily protects Sonic from all attacks. The game is divided into several "zones", each of them containing three levels. At the end of each zone Sonic confronts Dr. Robotnik in a boss fight. Sonic the Hedgehog is a significant game because it gave Sega it's first real mascot, and established the Genesis as the video game system with "attitude."</desc>
// 		<image>./images/Sonic The Hedgehog (World) (Hack)-image.png</image>
// 		<marquee>./images/Sonic The Hedgehog (World) (Hack)-marquee.png</marquee>
// 		<thumbnail>./images/Sonic The Hedgehog (World) (Hack)-thumb.jpg</thumbnail>
// 		<rating>0.8</rating>
// 		<releasedate>19910101T000000</releasedate>
// 		<developer>SEGA</developer>
// 		<publisher>SEGA</publisher>
// 		<genre>Platform</genre>
// 		<family>Sonic</family>
// 		<players>1</players>
// 		<playcount>1</playcount>
// 		<lastplayed>20240630T150551</lastplayed>
// 		<md5>dfd89d2f66d2ef6a6e3e6c298dadda75</md5>
// 		<gametime>132</gametime>
// 		<lang>en</lang>
// 		<region>wr</region>
// 		<scrap name="ScreenScraper" date="20240620T222916" />
// 	</game>
// 	<game>
// 		<path>./Pier Solar and the Great Architects (Japan) (En,Fr,Es) (Aftermarket) (Unl).zip</path>
// 		<name>Pier Solar and the Great Architects (Japan) (En,Fr,Es) (Aftermarket) (Unl)</name>
// 		<playcount>1</playcount>
// 		<lastplayed>20240724T221228</lastplayed>
// 		<gametime>153</gametime>
// 		<lang>es,fr,en,jp</lang>
// 		<region>jp</region>
// 		<image>./images/Pier Solar and the Great Architects (Japan) (En,Fr,Es) (Aftermarket) (Unl)-image.png</image>
// 		<marquee>./images/Pier Solar and the Great Architects (Japan) (En,Fr,Es) (Aftermarket) (Unl)-marquee.png</marquee>
// 		<thumbnail>./images/Pier Solar and the Great Architects (Japan) (En,Fr,Es) (Aftermarket) (Unl)-thumb.jpg</thumbnail>
// 	</game>
// 	<game id="599">
// 		<path>./TechnoClash (USA, Europe).zip</path>
// 		<name>TechnoClash</name>
// 		<desc>Ronaan, the Wizard Prince, is given the task of chasing the Engine Man (a half man, half machine entity that infiltrated the magickal Inner Realm) into a world  that has been overrun by technology.  Joined by his bodyguards, Chazz and Farrg, and his spirit guide, Indar, Ronaan joins the battle between magick and technology whose outcome will determine the fate of two dimensions.

// TechnoClash is a top-down scrolling action/adventure game.  The player controls Ronaan, whose goal is to track down and defeat the Engine Man. Ronaan is accompanied by two computer-controlled bodyguards who help him in combat situations; he can scout out the tactical situation using Indar, a falcon who can fly anywhere; and he can cast spells to accomplish many tasks, including attacking his foes, teleporting out of danger, and healing himself.</desc>
// 		<image>./images/TechnoClash (USA, Europe)-image.png</image>
// 		<marquee>./images/TechnoClash (USA, Europe)-marquee.png</marquee>
// 		<thumbnail>./images/TechnoClash (USA, Europe)-thumb.jpg</thumbnail>
// 		<rating>0.75</rating>
// 		<releasedate>19930328T000000</releasedate>
// 		<developer>BlueSky Software</developer>
// 		<publisher>Electronic Arts</publisher>
// 		<genre>Adventure</genre>
// 		<players>1</players>
// 		<md5>4cd30f3ad42b0354659d128bdcd61a6c</md5>
// 		<lang>en</lang>
// 		<region>us</region>
// 		<scrap name="ScreenScraper" date="20240620T221951" />
// 	</game>
// 	<game>
// 		<path>./Old-Towers.zip</path>
// 		<name>Old Towers</name>
// 		<desc>You play as a little explorers in a towers full of deadly traps and ugly skullz. Your only weapons to help you win: quick-thinking and skill.</desc>
// 		<image>./images/Old-Towers-image.png</image>
// 		<video>./videos/Old-Towers-video.mp4</video>
// 		<marquee>./images/Old-Towers-marquee.png</marquee>
// 		<thumbnail>./images/Old-Towers-thumb.jpg</thumbnail>
// 		<rating>0.9</rating>
// 		<releasedate>20190318T000000</releasedate>
// 		<developer>Denis Grachev</developer>
// 		<publisher>RetroSouls</publisher>
// 		<genre>Puzzle-Game</genre>
// 		<players>1</players>
// 		<playcount>42</playcount>
// 		<lastplayed>20240817T221657</lastplayed>
// 		<crc32>D875E97D</crc32>
// 		<md5>96216acdb9b8eb86f8fa7209a5cc5619</md5>
// 		<gametime>8301</gametime>
// 		<lang>en</lang>
// 		<cheevosHash>96216ACDB9B8EB86F8FA7209A5CC5619</cheevosHash>
// 	</game>
// 	<game>
// 		<path>./NHL 94 - 2025 Edition (Hack) (v3.8).zip</path>
// 		<name>NHL 94: 2025 Edition</name>
// 		<desc>The most refined and realistic up-to-date versions of this all-time classic game, has been updated for the 2025 playoffs! Here are the top reasons you might want to give it a try…

// New in ‘25. Gameplay has been completely rebalanced, and optional patches provide alternate Arcade, Classic, and Rookie gameplay balance modes and more. Plus, for the first time, an optional wide display mode! 800 players obsessively rated, up-to-date rosters and realistic lines, based on even more extensive 2022-2025 regular season data. New player Photos, updated Logos, Colours, Uniforms, Arena names… everything up-to-date for the 2025 playoffs.

// Gameplay Revisioned. The gameplay has been carefully re-balanced for a more realistic modern hockey feel, with harder to score goals, easier to hit crossbars and posts, more realistic speed burst, fewer penalty calls, custom energy depletion and recovery rates (balanced for more realistic line rolling and shift length), and player rating distribution curves that have been carefully calibrated for more realistic gameplay on the ice.

// Graphical Refinements. Hundreds of refinements have been made including title screens, banners, player photos, scoreboard, audience, face-offs, bench area, player sprites, nets, ice markings, scorekeepers, Zamboni driver, and more. The goal is to bring the most graphically refined version of NHL 94 ever made, remastered for modern flat screens, while remaining faithful to the spirit of the original art direction.

// And so much more. Of course there is the checking bug fix, but also a custom weight scale, less variance in Hot/Cold rating randomization, immediate goalie control by pressing the (Y) button with a six-button controller, a custom 3-Stars of the Game rating formula, numerous bug fixes, and so much more.</desc>
// 		<image>./images/NHL 94 - 2025 Edition (Hack) (v3.8)-image.png</image>
// 		<marquee>./images/NHL 94 - 2025 Edition (Hack) (v3.8)-marquee.png</marquee>
// 		<thumbnail>./images/NHL 94 - 2025 Edition (Hack) (v3.8)-thumb.jpg</thumbnail>
// 		<rating>0.9</rating>
// 		<releasedate>20250521T000000</releasedate>
// 		<developer>Adam Catalyst</developer>
// 		<genre>Sports / Hockey</genre>
// 		<family>NHL</family>
// 		<players>1-4</players>
// 		<favorite>true</favorite>
// 		<md5>75c2e98bb8d8bbe95aeb3a49d4e7c600</md5>
// 		<lang>en</lang>
// 		<region>us</region>
// 		<scrap name="TheGamesDB" date="20260130T233039" />
// 		<thumbnail>./images/NHL 94 - 2025 Edition (Hack) (v3.8)-thumb.png</thumbnail>
// 		<thumbnail>./images/NHL 94 - 2025 Edition (Hack) (v3.8)-thumb.png</thumbnail>
// 		<thumbnail>./images/NHL 94 - 2025 Edition (Hack) (v3.8)-thumb.png</thumbnail>
// 	</game>
// 	<game id="333">
// 		<path>./Blades of Vengeance (USA, Europe).zip</path>
// 		<name>Blades of Vengeance</name>
// 		<desc>Blades of Vengeance is a platform game incorporating RPG elements and character styling, reminiscent of Gods by The Bitmap Brothers. The Dark Lady has unleashed hordes of monsters who you must slay.

// The player can choose from three main characters - the Huntress, Warrior and Sorcerer, all of which have different abilities. Throughout the game the player has the option to improve their powers by collecting armour and weapons (such as a mace and a crossbow) or by using spells. Each of the 8 levels ends with a boss.</desc>
// 		<image>./images/Blades of Vengeance (USA, Europe)-image.png</image>
// 		<marquee>./images/Blades of Vengeance (USA, Europe)-marquee.png</marquee>
// 		<thumbnail>./images/Blades of Vengeance (USA, Europe)-thumb.jpg</thumbnail>
// 		<rating>0.7</rating>
// 		<releasedate>19930101T000000</releasedate>
// 		<developer>Beam Software</developer>
// 		<publisher>Electronic Arts</publisher>
// 		<genre>Role Playing Game</genre>
// 		<players>1-2</players>
// 		<favorite>true</favorite>
// 		<playcount>1</playcount>
// 		<lastplayed>20260329T192105</lastplayed>
// 		<md5>0ef8cf31e77cf8fab03bd7540a4751c0</md5>
// 		<gametime>160</gametime>
// 		<lang>en</lang>
// 		<region>us</region>
// 		<scrap name="ScreenScraper" date="20240620T222533" />
// 	</game>
// </gameList>`;
// const parser = new DOMParser();
// const doc = parser.parseFromString(games, 'text/xml');

// document.dispatchEvent(
// 	new CustomEvent(DROP_FILE_LOADED, {
// 		detail: {
// 			games: Array.from(/** @type {Element} */ (doc.firstChild)?.children)
// 		}
// 	})
// );
