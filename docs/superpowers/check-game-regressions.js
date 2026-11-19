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
check(!/All 38 EmulatorJS-based/.test(readme), 'README still says 38 EmulatorJS emulators');

// 6. Recently played is a dedicated sidebar view, not an All-page shelf.
const gameHtml = read('routes/game.html');
check(/data-category="recent"/.test(gameHtml), 'game sidebar has no recently-played entry');
check(/fa-clock-rotate-left/.test(gameHtml), 'recently-played sidebar entry lacks a clock icon');
check(!/recent-section/.test(togame), 'togame.js still renders the recent shelf');
check(!/recent-row/.test(gameHtml), 'game.html still styles the recent shelf');
check(/currentCategory === 'recent'/.test(togame), 'togame.js has no dedicated recent view');
check(/No recently played games/.test(togame), 'recent view has no empty state message');

if (failures.length) {
    failures.forEach((f) => console.log('FAIL: ' + f));
    process.exit(1);
}
console.log('ALL REGRESSION CHECKS OK');
