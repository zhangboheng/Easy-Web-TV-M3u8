// Regression checks for the v8.5.3 game-module bug batch.
// Run with: node docs/superpowers/check-game-regressions.js
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const failures = [];
function check(condition, message) {
    if (!condition) failures.push(message);
}

const togame = read('js/togame.js');
const gamesMatch = togame.match(/var games = \[([\s\S]*?)\n\];/);
check(Boolean(gamesMatch), 'togame.js games array not found');
const games = gamesMatch ? eval('[' + gamesMatch[1] + ']') : [];

const vita = read('js/tovita.js');
const webgame = read('js/towebgame.js');
const webgameHtml = read('routes/webgame.html');
const diabloHtml = read('routes/diablo.html');
const z2rsHtml = read('routes/z2rs.html');
const ps2Html = read('routes/ps2.html');
const vitaHtml = read('routes/vita.html');
const readme = read('README.md');
const indexJs = read('js/index.js');
const indexHtml = read('index.html');
const novelHtml = read('catalogues/novelplay.html');
const musicJs = read('js/music.js');
const styleCss = read('css/style.css');
const emulatorJs = read('js/emulatorjs.js');
const emulatorJsHtml = read('routes/emulatorjs.html');

// 1. Vita back navigation must return to the emulator category.
check(/game\.html\?category=emulator/.test(vita), 'Vita back link does not use category=emulator');
check(!/game\.html\?category=mobile/.test(vita), 'Vita back link still uses category=mobile');

// 2. Exactly one Sega CD card, pointing at the BIOS-aware platform parameter.
const segaCd = games.filter((g) => g.platform === 'Sega CD');
check(segaCd.length === 1, 'expected exactly one Sega CD card, found ' + segaCd.length);
check(
    games.every((g) => g.platform !== 'Sega CD' || /platform=segacd/.test(g.url)),
    'Sega CD cards must include platform=segacd'
);

// 3. Embedded players must not promise persistent browser storage.
for (const [name, source, baseConst] of [['ps2', read('js/tops2.js'), 'PS2_BASE'], ['vita', vita, 'VITA_BASE']]) {
    check(new RegExp('link\\.href = ' + baseConst).test(source), name + ' new-tab link is not wired to ' + baseConst);
    const hints = source.match(/demoHint:\s*(['"])(.*?)\1/g) || [];
    check(hints.length === 8, name + ' should have 8 translated demoHint strings, found ' + hints.length);
    hints.forEach((hint, i) => {
        check(/tab/i.test(hint) || /标签页|タブ|탭|onglet|Tab|pestaña|ВКЛАДКЕ/i.test(hint),
            name + ' demoHint[' + i + '] does not explain the persistent new-tab option');
    });
}
for (const [name, html] of [['ps2', ps2Html], ['vita', vitaHtml]]) {
    check(/open in a new tab/i.test(html), name + ' static HTML fallback lacks new-tab guidance');
}
check(!/nothing is uploaded\);[\s\S]{0,200}stay in your browser/.test(readme), 'README still promises persistent browser storage for credentialless embeds');

// 4. Unknown Web Game keys must be reported, not silently replaced by 2048.
check(!/return WEBGAME_REGISTRY\['2048'\]/.test(webgame), 'towebgame.js still silently falls back to 2048');
check(/invalidGame|gameNotFound/.test(webgame), 'towebgame.js has no invalid-game i18n key');
check(/demoOpenBtn.*disabled|disabled.*demoOpenBtn/.test(webgame), 'towebgame.js does not disable launch on invalid game key');

// 5. Cosmetic and documentation drift.
check(!/Starting RA2 VM/.test(diabloHtml), 'Diablo fallback still says RA2 VM');
check(!/Starting RA2 VM/.test(z2rsHtml), 'Zelda II fallback still says RA2 VM');
check(!/<span data-i18n="tabDemo">Emulator<\/span>/.test(webgameHtml), 'Web Game fallback tab still says Emulator');
check(!/}\/\/ ---- fullscreen/.test(webgame), 'towebgame.js still has }// formatting');
check(!/18 catalogue files/.test(readme), 'README still says 18 catalogue files');
check(!/across 29 JSON files/.test(readme), 'README still says 29 JSON files');
check(/All 43 EmulatorJS-based/.test(readme), 'README does not say 43 EmulatorJS emulators');
check(!/50 platforms/.test(readme), 'README still says 50 platforms');

// 6. Recently played is a dedicated sidebar view, not an All-page shelf.
const gameHtml = read('routes/game.html');
check(/data-category="recent"/.test(gameHtml), 'game sidebar has no recently-played entry');
check(/fa-clock-rotate-left/.test(gameHtml), 'recently-played sidebar entry lacks a clock icon');
check(!/recent-section/.test(togame), 'togame.js still renders the recent shelf');
check(!/recent-row/.test(gameHtml), 'game.html still styles the recent shelf');
check(/currentCategory === 'recent'/.test(togame), 'togame.js has no dedicated recent view');
check(/No recently played games/.test(togame), 'recent view has no empty state message');
check(/recent-empty/.test(gameHtml), 'recent empty state has no centering rule');
check(/\.recent-empty[\s\S]*?min-height:\s*60vh/.test(gameHtml), 'recent empty state is not vertically centered');

// 7. Games render incrementally (Theater-style infinite scroll) so All Games
// does not build one huge DOM as the catalogue grows.
check(/var GAMES_PER_PAGE\s*=\s*\d+/.test(togame), 'togame.js has no page-size constant');
check(/var visibleGames/.test(togame), 'togame.js has no filtered-games state');
check(/var renderedGameCount/.test(togame), 'togame.js has no rendered-count state');
check(/function loadMoreGames/.test(togame), 'togame.js has no incremental load function');
check(/function checkAutoLoadGames/.test(togame), 'togame.js has no wide-screen auto-load fallback');
check(/id="loadMoreIndicator"/.test(gameHtml), 'game.html has no load-more indicator');
check(/mainContent['"]\)\.addEventListener\(['"]scroll/.test(togame), 'togame.js does not listen for main-content scrolling');

// 8. Browser-native dialogs bypass the app theme. All app-level prompts must
// use the themed ConfirmModal/ErrorToast instead.
check(!/(^|[^.[:alnum:]_])(confirm|alert|prompt)\s*\(/.test(indexJs), 'index.js still uses a native confirm/alert/prompt dialog');
check(!/(^|[^.[:alnum:]_])(confirm|alert|prompt)\s*\(/.test(musicJs), 'music.js still uses a native confirm/alert/prompt dialog');
check(/const ConfirmModal\s*=/.test(indexJs), 'index.js has no themed ConfirmModal');
check(/ConfirmModal\.show\(/.test(indexJs), 'index.js does not show the themed ConfirmModal');
check(/id="confirm-modal"/.test(indexHtml), 'index.html has no themed confirm modal');
check(/id="modalOverlay"/.test(novelHtml), 'novelplay.html has no themed confirm modal');
check(/ConfirmDialog\.show\(/.test(indexJs), 'index.js does not route confirmations through ConfirmDialog');
check(/\.confirm-modal-overlay/.test(styleCss), 'style.css has no themed confirm-modal styles');
check(/function showMusicError/.test(musicJs), 'music.js has no themed fallback for playback errors');

// 9. EmulatorJS stable additions: first low-risk batch.
const newEmulatorCards = [
    { platform: 'ZX81/ZX80', core: '81', image: '../images/zx81.svg' },
    { platform: 'Thomson MO/TO', core: 'crocods', image: '../images/thomson.svg' },
    { platform: 'Philips CD-i', core: 'same_cdi', image: '../images/cdi.svg' }
];
newEmulatorCards.forEach(({ platform, core, image }) => {
    const card = games.filter((g) => g.platform === platform);
    check(card.length === 1, 'expected exactly one ' + platform + ' card, found ' + card.length);
    check(card.length === 1 && card[0].category === 'emulator', platform + ' is not in the emulator category');
    check(card.length === 1 && card[0].url === '../routes/emulatorjs.html?core=' + core,
        platform + ' does not point at the EmulatorJS ' + core + ' core');
    check(card.length === 1 && card[0].image === image, platform + ' does not use its dedicated image');
    check(fs.existsSync(path.join(root, image.replace(/^\.\.\//, ''))), platform + ' image is missing: ' + image);
    check(new RegExp("'" + core + "':").test(emulatorJs), 'emulatorjs.js has no ' + core + ' core-to-platform mapping');
});
check(/^\s*'p': '81',/m.test(emulatorJs), 'emulatorjs.js does not detect .p files as ZX81 core');
check(/^\s*'tzx': '81',/m.test(emulatorJs), 'emulatorjs.js does not map .tzx to ZX81 core');
check(/^\s*'dsk': 'crocods',/m.test(emulatorJs), 'emulatorjs.js does not map .dsk to Thomson core');
check(/^\s*'chd': 'same_cdi',/m.test(emulatorJs), 'emulatorjs.js does not map .chd to CD-i core');
check(/^\s*'cue': 'same_cdi',/m.test(emulatorJs), 'emulatorjs.js does not map .cue to CD-i core');
check(/accept="[^"]*\.p[^"]*"/.test(emulatorJsHtml), 'emulator upload accept list lacks .p files');
check(/accept="[^"]*\.dsk[^"]*"/.test(emulatorJsHtml), 'emulator upload accept list lacks .dsk files');
check(/accept="[^"]*\.chd[^"]*"/.test(emulatorJsHtml), 'emulator upload accept list lacks .chd files');

// 10. Preset JSON files. ZX81 has a curated freeware/homebrew set; Thomson and
// CD-i intentionally ship with empty lists so the preset control can hide cleanly.
const zx81Json = JSON.parse(read('data/roms/zx81.json'));
const thomsonJson = JSON.parse(read('data/roms/thomson.json'));
const cdiJson = JSON.parse(read('data/roms/cdi.json'));
check(zx81Json.platform === 'zx81' && zx81Json.core === '81', 'ZX81 preset JSON metadata is wrong');
check(zx81Json.games.length >= 10, 'ZX81 preset list is too small');
check(zx81Json.games.every((g) => /^https:\/\/raw\.githubusercontent\.com\/Retronissen\//.test(g.url)),
    'ZX81 presets must come from the credited freeware repository');
check(zx81Json.games.every((g) => /\.p$/i.test(g.filename)), 'ZX81 presets must be .p program files');
check(zx81Json.games.every((g) => /Kurt-Arne Johnsen/.test(g.name)), 'ZX81 presets must credit the author');
check(thomsonJson.platform === 'thomson' && thomsonJson.core === 'crocods' && thomsonJson.games.length === 0,
    'Thomson preset JSON must be a valid empty list');
check(cdiJson.platform === 'cdi' && cdiJson.core === 'same_cdi' && cdiJson.games.length === 0,
    'CD-i preset JSON must be a valid empty list');

if (failures.length) {
    failures.forEach((f) => console.log('FAIL: ' + f));
    process.exit(1);
}
console.log('ALL REGRESSION CHECKS OK');
