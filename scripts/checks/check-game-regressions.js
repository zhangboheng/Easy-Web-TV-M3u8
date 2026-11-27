// Regression checks for the v8.5.3 game-module bug batch.
// Run with: node scripts/checks/check-game-regressions.js
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const maybeRead = (rel) => fs.existsSync(path.join(root, rel)) ? read(rel) : '';
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
const checksYml = read('.github/workflows/checks.yml');
// i18n pairs moved to JSON in v8.6.0; syntax checks use the js/*.js glob.
const i18nPairsRaw = read('scripts/checks/i18n-pairs.json');
const syntaxGlobOk = /js\/\*\.js/.test(checksYml);
const emulatorJs = read('js/emulatorjs.js');
const emulatorJsHtml = read('routes/emulatorjs.html');
const sw = read('sw.js');


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
check(/data-category=\"favorites\"/.test(gameHtml), 'game sidebar has no favorites entry');
check(/fa-star/.test(gameHtml), 'favorites sidebar entry lacks a star icon');
check(/currentCategory === 'favorites'/.test(togame), 'togame.js has no dedicated favorites view');
check(/favoriteGamesHtml/.test(togame), 'togame.js has no favorites renderer');
check(/noFavs:\s*'No favorite games yet/.test(togame), 'favorites view has no empty state message');
check(/game\.name\.toLowerCase\(\).indexOf\(q\).*game\.platform/.test(togame) ||
      /game\.platform[\s\S]{0,120}toLowerCase/.test(togame), 'game search does not match platform names');
check(!/recent-row/.test(gameHtml), 'game.html still styles the recent shelf');
check(/currentCategory === 'recent'/.test(togame), 'togame.js has no dedicated recent view');
check(/noRecent:\s*'No recently played games/.test(togame), 'recent view has no empty state message');
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
    { platform: 'ZX81/ZX80', core: '81', image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/ZX81.png' },
    { platform: 'Thomson MO/TO', core: 'crocods', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Thomson_MO5-IMG_1732.jpg/330px-Thomson_MO5-IMG_1732.jpg' },
    { platform: 'Philips CD-i', core: 'same_cdi', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Philips_CD-i_210_player_%2830179599718%29.jpg/330px-Philips_CD-i_210_player_%2830179599718%29.jpg' }
];
newEmulatorCards.forEach(({ platform, core, image }) => {
    const card = games.filter((g) => g.platform === platform);
    check(card.length === 1, 'expected exactly one ' + platform + ' card, found ' + card.length);
    check(card.length === 1 && card[0].category === 'emulator', platform + ' is not in the emulator category');
    check(card.length === 1 && card[0].url === '../routes/emulatorjs.html?core=' + core,
        platform + ' does not point at the EmulatorJS ' + core + ' core');
    check(card.length === 1 && card[0].image === image, platform + ' does not use its dedicated hosted image');
    check(/^https:\/\/(raw\.githubusercontent\.com|upload\.wikimedia\.org)\//.test(card.length === 1 ? card[0].image : ''), platform + ' image must be a hosted network image');
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

// 9b. NeoGeo BIOS. FBNeo arcade cores only start when a complete "neogeo.zip"
// ARCHIVE is in their FS search paths, and EmulatorJS resolves EJS_biosUrl
// relative to the page - so the file must sit at routes/neogeo.zip with exactly
// that name. There used to be a byte-identical routes/bios/neogeo.zip that no
// code ever fetched; it was removed, and these checks keep it from coming back.
const neogeoZip = path.join(root, 'routes', 'neogeo.zip');
check(fs.existsSync(neogeoZip), 'routes/neogeo.zip (NeoGeo BIOS) is missing - FBNeo arcade games cannot start');
check(fs.existsSync(neogeoZip) && fs.statSync(neogeoZip).size > 1024 * 1024,
    'routes/neogeo.zip is too small to be a complete NeoGeo BIOS archive');
check(/var EJS_biosUrl = 'neogeo\.zip';/.test(emulatorJs),
    'emulatorjs.js must hand EmulatorJS a biosUrl named exactly "neogeo.zip"');
check(/var EJS_dontExtractBIOS = true;/.test(emulatorJs),
    'emulatorjs.js must keep EJS_dontExtractBIOS = true (the core needs the .zip, not loose files)');
check(!fs.existsSync(path.join(root, 'routes', 'bios', 'neogeo.zip')),
    'routes/bios/neogeo.zip is an unused duplicate - keep only routes/neogeo.zip');
check(!/routes\/bios\//.test(emulatorJs),
    'emulatorjs.js still points users at routes/bios/, the BIOS lives in routes/');
const biosMissingLines = emulatorJs.match(/biosMissing:[^\n]*/g) || [];
check(biosMissingLines.length >= 8, 'expected a biosMissing string per locale, found ' + biosMissingLines.length);
check(biosMissingLines.every((l) => /routes\//.test(l)),
    'every biosMissing string must name the routes/ folder that actually holds the BIOS');


// The engine pages keep their own i18n tables; check-i18n.js validates them
// (CI runs it for todos/toflash/tov86/towasm4/emulatorjs), so this file does
// not keep a second table parser.

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

// Additional regression checks for later hot-linked platform pages.
const macJs = maybeRead('js/tomac.js');
const macHtml = maybeRead('routes/mac.html');
const macCard = games.filter((g) => g.platform === 'Classic Mac');
check(macCard.length === 1, 'expected exactly one Classic Mac card, found ' + macCard.length);
check(macCard.length === 1 && macCard[0].category === 'retropc', 'Classic Mac is not in the retropc category');
check(macCard.length === 1 && macCard[0].url === '../routes/mac.html', 'Classic Mac does not point at routes/mac.html');
check(macCard.length === 1 && macCard[0].image === 'https://cdn.simpleicons.org/apple/ffffff', 'Classic Mac does not use the light Apple icon');
check(/^https:\/\/cdn\.simpleicons\.org\//.test(macCard.length === 1 ? macCard[0].image : ''), 'Classic Mac image must be a colored Simple Icons CDN URL');
check(/MAC_HOME\s*=\s*'https:\/\/infinitemac\.org\/'/.test(macJs), 'tomac.js has no dedicated MAC_HOME');
check(/link\.href = MAC_HOME/.test(macJs), 'tomac.js new-tab link should point at MAC_HOME');
check(/game\.html\?category=retropc/.test(macJs), 'Classic Mac back link does not use category=retropc');
check(/SystemJS|System\.import|load/.test(macJs), 'tomac.js does not load the Infinite Mac app');
check(/allow=\"[^\"]*fullscreen/.test(macHtml), 'mac.html iframe does not allow fullscreen');

check(/open in a new tab/i.test(macHtml), 'mac.html static HTML fallback lacks new-tab guidance');
check(i18nPairsRaw.indexOf('js/tomac.js') !== -1 && i18nPairsRaw.indexOf('routes/mac.html') !== -1, 'checks.yml does not run i18n pairs for the Classic Mac page');
check(syntaxGlobOk, 'checks.yml does not syntax-check js/tomac.js');
check(!/allowfullscreen/.test(macHtml), 'mac.html iframe has redundant allowfullscreen attribute');
check(/\(v86, BYO Android-x86 image\)/.test(readme), 'README platform table has no Android / v86 row');
const rkJs = maybeRead('js/tork86.js');
const rkHtml = maybeRead('routes/rk86.html');
const rkCard = games.filter((g) => g.platform === 'Radio-86RK');
check(rkCard.length === 1, 'expected exactly one Radio-86RK card, found ' + rkCard.length);
check(rkCard.length === 1 && rkCard[0].category === 'computer', 'Radio-86RK is not in the computer category');
check(rkCard.length === 1 && rkCard[0].url === '../routes/rk86.html', 'Radio-86RK does not point at routes/rk86.html');
check(rkCard.length === 1 && rkCard[0].image === '../images/rk86.svg', 'Radio-86RK does not use its dedicated image');
check(fs.existsSync(path.join(root, 'images/rk86.svg')), 'Radio-86RK image is missing: ../images/rk86.svg');
check(/RK_HOME\s*=\s*'https:\/\/rk86\.ru\/'/.test(rkJs), 'tork86.js has no dedicated RK_HOME');
check(/RK_HOME\s*=\s*'https:\/\/rk86\.ru\/'/.test(rkJs), 'tork86.js has no dedicated RK_HOME');
check(/game\.html\?category=computer/.test(rkJs), 'Radio-86RK back link does not use category=computer');
check(/allow=\"[^\"]*fullscreen/.test(rkHtml), 'rk86.html iframe does not allow fullscreen');

check(/open in a new tab/i.test(rkHtml), 'rk86.html static HTML fallback lacks new-tab guidance');
check(i18nPairsRaw.indexOf('js/tork86.js') !== -1 && i18nPairsRaw.indexOf('routes/rk86.html') !== -1, 'checks.yml does not run i18n pairs for the Radio-86RK page');
check(syntaxGlobOk, 'checks.yml does not syntax-check js/tork86.js');
check(!/allowfullscreen/.test(rkHtml), 'rk86.html iframe has redundant allowfullscreen attribute');
const rkHints = rkJs.match(/demoHint:\s*(['\"])(.*?)\1/g) || [];
check(rkHints.length === 8, 'tork86.js should have 8 translated demoHint strings, found ' + rkHints.length);
const estyJs = maybeRead('js/toesty.js');
const estyHtml = maybeRead('routes/esty.html');
const estyCard = games.filter((g) => g.platform === 'Atari ST');
check(estyCard.length === 1, 'expected exactly one Atari ST card, found ' + estyCard.length);
check(estyCard.length === 1 && estyCard[0].category === 'computer', 'Atari ST is not in the computer category');
check(estyCard.length === 1 && estyCard[0].url === '../routes/esty.html', 'Atari ST does not point at routes/esty.html');
check(estyCard.length === 1 && estyCard[0].image === 'https://cdn.simpleicons.org/atari/ffffff', 'Atari ST does not use the light Atari icon');
check(/^https:\/\/cdn\.simpleicons\.org\//.test(estyCard.length === 1 ? estyCard[0].image : ''), 'Atari ST image must be a colored Simple Icons CDN URL');
check(/ESTY_HOME\s*=\s*'https:\/\/kaiec\.github\.io\/EstyJS\/'/.test(estyJs), 'toesty.js has no dedicated ESTY_HOME');
check(/link\.href = ESTY_HOME/.test(estyJs), 'toesty.js new-tab link should point at ESTY_HOME');
check(/newTabUrl:\s*ESTY_HOME/.test(estyJs), 'toesty.js shared player official link should point at ESTY_HOME');
check(/href=\"https:\/\/kaiec\.github\.io\/EstyJS\/\"/.test(estyHtml), 'esty.html static new-tab link is not the official EstyJS app');
check(/game\.html\?category=computer/.test(estyJs), 'Atari ST back link does not use category=computer');
check(/allow=\"[^\"]*fullscreen/.test(estyHtml), 'esty.html iframe does not allow fullscreen');
check(/open in a new tab/i.test(estyHtml), 'esty.html static HTML fallback lacks new-tab guidance');
check(i18nPairsRaw.indexOf('js/toesty.js') !== -1 && i18nPairsRaw.indexOf('routes/esty.html') !== -1, 'checks.yml does not run i18n pairs for the Atari ST page');
check(syntaxGlobOk, 'checks.yml does not syntax-check js/toesty.js');
check(!/allowfullscreen/.test(estyHtml), 'esty.html iframe has redundant allowfullscreen attribute');
check(/Atari ST \(EstyJS embed\)/.test(readme), 'README platform table has no Atari ST / EstyJS row');
const androidJs = maybeRead('js/toandroid.js');
const androidHtml = maybeRead('routes/android.html');
const androidCard = games.filter((g) => g.platform === 'Android');
check(androidCard.length === 1, 'expected exactly one Android card, found ' + androidCard.length);
check(androidCard.length === 1 && androidCard[0].category === 'mobile', 'Android is not in the mobile category');
check(androidCard.length === 1 && androidCard[0].url === '../routes/android.html', 'Android does not point at routes/android.html');
check(androidCard.length === 1 && androidCard[0].image === 'https://cdn.simpleicons.org/android/3DDC84', 'Android does not use the brand-green Android icon');
check(/^https:\/\/cdn\.simpleicons\.org\//.test(androidCard.length === 1 ? androidCard[0].image : ''), 'Android image must be a colored Simple Icons CDN URL');
check(/V86_RUNTIME\s*=\s*'..\/vendor\/v86\/libv86\.js'/.test(androidJs), 'toandroid.js does not load the vendored v86 engine');
check(/V86_WASM\s*=\s*'..\/vendor\/v86\/v86\.wasm'/.test(androidJs), 'toandroid.js does not load the vendored v86 WASM binary');
check(/bios:\s*\{\s*url:\s*'..\/vendor\/v86\/seabios\.bin'/.test(androidJs), 'toandroid.js does not load the vendored SeaBIOS');
check(/vga_bios:\s*\{\s*url:\s*'..\/vendor\/v86\/vgabios\.bin'/.test(androidJs), 'toandroid.js does not load the vendored VGA BIOS');
check(/BYO|Bring your own|own Android/i.test(androidJs), 'toandroid.js does not explain BYO image support');
check(/game\.html\?category=mobile/.test(androidJs), 'Android back link does not use category=mobile');
check(i18nPairsRaw.indexOf('js/toandroid.js') !== -1 && i18nPairsRaw.indexOf('routes/android.html') !== -1, 'checks.yml does not run i18n pairs for the Android page');
check(syntaxGlobOk, 'checks.yml does not syntax-check js/toandroid.js');
check(/\(v86, BYO Android-x86 image\)/.test(readme), 'README platform table has no Android / v86 row');
const feltJs = maybeRead('js/tofelt.js');
const feltHtml = maybeRead('routes/feltworld.html');
const feltCard = games.filter((g) => g.name === 'Felt World');
check(feltCard.length === 1, 'expected exactly one Felt World card, found ' + feltCard.length);
check(feltCard.length === 1 && feltCard[0].id === 128, 'Felt World card should use id 128');
check(feltCard.length === 1 && feltCard[0].category === 'webgames', 'Felt World is not in the webgames category');
check(feltCard.length === 1 && feltCard[0].url === '../routes/feltworld.html', 'Felt World does not point at routes/feltworld.html');
check(feltCard.length === 1 && feltCard[0].image === 'https://raw.githubusercontent.com/az9713/opus-5.5-open-world-game/master/screenshots/air.jpg', 'Felt World does not use its GitHub-hosted image');
check(/^https:\/\/raw\.githubusercontent\.com\//.test(feltCard.length === 1 ? feltCard[0].image : ''), 'Felt World image must be GitHub-hosted');
check(/FELT_HOME\s*=\s*'https:\/\/az9713\.github\.io\/opus-5\.5-open-world-game\/feltworld\/'/.test(feltJs), 'tofelt.js has no dedicated FELT_HOME');
check(/link\.href = FELT_HOME/.test(feltJs), 'tofelt.js new-tab link should point at FELT_HOME');
check(/newTabUrl:\s*FELT_HOME/.test(feltJs), 'tofelt.js shared player official link should point at FELT_HOME');
check(/href=\"https:\/\/az9713\.github\.io\/opus-5\.5-open-world-game\/feltworld\/\"/.test(feltHtml), 'feltworld.html static new-tab link is not the official Felt World app');
check(/game\.html\?category=webgames/.test(feltJs), 'Felt World back link does not use category=webgames');
check(/allow=\"[^\"]*fullscreen/.test(feltHtml), 'feltworld.html iframe does not allow fullscreen');
check(!/allowfullscreen/.test(feltHtml), 'feltworld.html iframe has redundant allowfullscreen attribute');
check(/open in a new tab/i.test(feltHtml), 'feltworld.html static HTML fallback lacks new-tab guidance');
check(i18nPairsRaw.indexOf('js/tofelt.js') !== -1 && i18nPairsRaw.indexOf('routes/feltworld.html') !== -1, 'checks.yml does not run i18n pairs for the Felt World page');
check(syntaxGlobOk, 'checks.yml does not syntax-check js/tofelt.js');
check(!/allowfullscreen/.test(feltHtml), 'feltworld.html iframe has redundant allowfullscreen attribute');
check(/Felt World \(hot-linked embed, MIT\)/.test(readme), 'README platform table has no Felt World / MIT row');
// NOVA LANCER + Casa de Gemas.
const novaJs = maybeRead('js/tonova.js');
const novaHtml = maybeRead('routes/nova.html');
const novaCard = games.filter((g) => g.name === 'NOVA LANCER');
check(novaCard.length === 1, 'expected exactly one NOVA LANCER card, found ' + novaCard.length);
check(novaCard.length === 1 && novaCard[0].id === 131, 'NOVA LANCER card should use id 131');
check(novaCard.length === 1 && novaCard[0].category === 'webgames', 'NOVA LANCER is not in webgames');
check(novaCard.length === 1 && novaCard[0].url === '../routes/nova.html', 'NOVA LANCER route is wrong');
check(novaCard.length === 1 && novaCard[0].image === 'https://raw.githubusercontent.com/tanuu5/nova-lancer/main/docs/screenshots/hero.jpg', 'NOVA LANCER image is wrong');
check(/^https:\/\/raw\.githubusercontent\.com\//.test(novaCard.length === 1 ? novaCard[0].image : ''), 'NOVA LANCER image must be GitHub-hosted');
check(/NOVA_HOME\s*=\s*'https:\/\/tanuu5\.github\.io\/nova-lancer\/'/.test(novaJs), 'tonova.js has no NOVA_HOME');
check(/link\.href = NOVA_HOME/.test(novaJs), 'tonova.js new-tab link is wrong');
check(/game\.html\?category=webgames/.test(novaJs), 'NOVA LANCER back link is wrong');
check(/href=\"https:\/\/tanuu5\.github\.io\/nova-lancer\/\"/.test(novaHtml), 'nova.html new-tab link is wrong');
check(/allow=\"[^\"]*fullscreen/.test(novaHtml), 'nova.html iframe lacks fullscreen permission');
check(!/allowfullscreen/.test(novaHtml), 'nova.html has redundant allowfullscreen');
check(/open in a new tab/i.test(novaHtml), 'nova.html lacks new-tab guidance');
check(i18nPairsRaw.indexOf('js/tonova.js') !== -1 && i18nPairsRaw.indexOf('routes/nova.html') !== -1, 'checks.yml misses NOVA LANCER i18n pair');
check(syntaxGlobOk, 'checks.yml misses NOVA LANCER syntax check');
const casaJs = maybeRead('js/tocasa.js');
const casaHtml = maybeRead('routes/casa.html');
const tamaJs = maybeRead('js/totamaweb.js');
const tamaHtml = maybeRead('routes/tamaweb.html');
const tamaCard = games.filter((g) => g.name === 'Tamaweb');
check(tamaCard.length === 1, 'expected exactly one Tamaweb card, found ' + tamaCard.length);
check(tamaCard.length === 1 && tamaCard[0].url === '../routes/tamaweb.html',
    'Tamaweb card must use the dedicated hotlink route');
check(tamaCard.length === 1 && !/gamebox\/tamaweb/.test(tamaCard[0].image),
    'Tamaweb card must not use a vendored gamebox image');
check(fs.existsSync(path.join(root, 'images/pet.svg')), 'Tamaweb image is missing: images/pet.svg');
check(/https:\/\/autosam\.github\.io\/Tamaweb\//.test(tamaJs),
    'totamaweb.js must point at the official Tamaweb static build');
check(!/openInNewTab\s*:/.test(tamaJs), 'totamaweb.js should not carry the dead openInNewTab copy key (shared player owns the fallback UX)');
check(/id="tamaFrame"/.test(tamaHtml), 'tamaweb.html iframe is missing');
check(i18nPairsRaw.indexOf('js/totamaweb.js') !== -1 && i18nPairsRaw.indexOf('routes/tamaweb.html') !== -1,
    'checks.yml does not run i18n pairs for the Tamaweb page');
check(syntaxGlobOk, 'checks.yml does not syntax-check js/totamaweb.js');
check(!fs.existsSync(path.join(root, 'gamebox/tamaweb')), 'vendored gamebox/tamaweb still exists');
check(!/vendored under `gamebox\/tamaweb\/`/.test(readme), 'README still describes Tamaweb as vendored');
const casaCard = games.filter((g) => g.name === 'Casa de Gemas');
check(casaCard.length === 1, 'expected exactly one Casa de Gemas card, found ' + casaCard.length);
check(casaCard.length === 1 && casaCard[0].id === 132, 'Casa de Gemas card should use id 132');
check(casaCard.length === 1 && casaCard[0].category === 'webgames', 'Casa de Gemas is not in webgames');
check(casaCard.length === 1 && casaCard[0].url === '../routes/casa.html', 'Casa de Gemas route is wrong');
check(casaCard.length === 1 && casaCard[0].image === 'https://raw.githubusercontent.com/deepujain/casadegema/main/preview.png', 'Casa de Gemas image is wrong');
check(/^https:\/\/raw\.githubusercontent\.com\//.test(casaCard.length === 1 ? casaCard[0].image : ''), 'Casa de Gemas image must be GitHub-hosted');
check(/CASA_HOME\s*=\s*'https:\/\/deepujain\.github\.io\/casadegema\/'/.test(casaJs), 'tocasa.js has no CASA_HOME');
check(/link\.href = CASA_HOME/.test(casaJs), 'tocasa.js new-tab link is wrong');
check(/game\.html\?category=webgames/.test(casaJs), 'Casa de Gemas back link is wrong');
check(/href=\"https:\/\/deepujain\.github\.io\/casadegema\/\"/.test(casaHtml), 'casa.html new-tab link is wrong');
check(/allow=\"[^\"]*fullscreen/.test(casaHtml), 'casa.html iframe lacks fullscreen permission');
check(!/allowfullscreen/.test(casaHtml), 'casa.html has redundant allowfullscreen');
check(/open in a new tab/i.test(casaHtml), 'casa.html lacks new-tab guidance');
check(i18nPairsRaw.indexOf('js/tocasa.js') !== -1 && i18nPairsRaw.indexOf('routes/casa.html') !== -1, 'checks.yml misses Casa de Gemas i18n pair');
check(syntaxGlobOk, 'checks.yml misses Casa de Gemas syntax check');
check(/NOVA LANCER \(hot-linked embed, MIT\)/.test(readme), 'README has no NOVA LANCER credit');
check(/Casa de Gemas \(hot-linked embed, MIT\)/.test(readme), 'README has no Casa de Gemas credit');
// Papertrails: curated Fable List candidate, generic webgame hot-link player.
const papertrailsCard = games.filter((g) => g.name === 'Papertrails');
check(papertrailsCard.length === 1, 'expected exactly one Papertrails card, found ' + papertrailsCard.length);
check(papertrailsCard.length === 1 && papertrailsCard[0].id === 133, 'Papertrails card should use id 133');
check(papertrailsCard.length === 1 && papertrailsCard[0].category === 'webgames', 'Papertrails is not in webgames');
check(papertrailsCard.length === 1 && papertrailsCard[0].url === '../routes/webgame.html?game=papertrails', 'Papertrails route is wrong');
check(papertrailsCard.length === 1 && papertrailsCard[0].image === 'https://raw.githubusercontent.com/xikhar/papertrails/master/screenshots/hero.png', 'Papertrails image is wrong');
check(/^https:\/\/raw\.githubusercontent\.com\//.test(papertrailsCard.length === 1 ? papertrailsCard[0].image : ''), 'Papertrails image must be GitHub-hosted');
check(/'papertrails':\s*\{\s*name:\s*'Papertrails',\s*url:\s*'https:\/\/xikhar\.github\.io\/papertrails\/',\s*repo:\s*'xikhar\/papertrails',\s*license:\s*'MIT'\s*\}/.test(webgame),
    'towebgame.js has no correct Papertrails registry entry');
check(/Papertrails \(hot-linked embed, MIT\)/.test(readme), 'README has no Papertrails credit');

// 雾锁山门: AI-generated single-HTML 3D action game hot-linked via the generic player.
const wusuomonCard = games.filter((g) => g.name === '雾锁山门 (AI 3D)');
check(wusuomonCard.length === 1, 'expected exactly one 雾锁山门 (AI 3D) card, found ' + wusuomonCard.length);
check(wusuomonCard.length === 1 && wusuomonCard[0].id === 176, '雾锁山门 (AI 3D) card should use id 176');
check(wusuomonCard.length === 1 && wusuomonCard[0].category === 'webgames', '雾锁山门 (AI 3D) is not in webgames');
check(wusuomonCard.length === 1 && wusuomonCard[0].url === '../routes/webgame.html?game=wusuomon', '雾锁山门 (AI 3D) route is wrong');
check(wusuomonCard.length === 1 && wusuomonCard[0].image === 'https://raw.githubusercontent.com/op7418/guizang-game-skill/main/media/cover.jpg', '雾锁山门 (AI 3D) image is wrong');
check(/^https:\/\/raw\.githubusercontent\.com\//.test(wusuomonCard.length === 1 ? wusuomonCard[0].image : ''), '雾锁山门 (AI 3D) image must be GitHub-hosted');
check(/'wusuomon':\s*\{\s*name:\s*'雾锁山门',\s*url:\s*'https:\/\/op7418\.github\.io\/guizang-game-skill\/',\s*repo:\s*'op7418\/guizang-game-skill',\s*license:\s*'AGPL-3\.0 \(demo content © 2026 歸藏\)'\s*\}/.test(webgame),
    'towebgame.js has no correct 雾锁山门 registry entry');
check(/雾锁山门 \(hot-linked embed, AGPL-3\.0\)/.test(readme), 'README has no 雾锁山门 credit');

const toComp = read('js/tocomprehensive.js');
const comp = read('js/comprehensive.js');
const compHtml = read('catalogues/complay.html');
check(/youtube-nocookie\.com\/embed\//.test(comp), 'comprehensive.js does not use the official YouTube embed endpoint');
check(/id="youtubeFrame"/.test(compHtml), 'complay.html has no YouTube iframe container');
check(/youtube-mode/.test(comp) && /favorite-btn/.test(comp),
    'comprehensive.js has no YouTube-mode favourite suppression');
check(!/tcT\(noResults\)/.test(toComp), 'tocomprehensive.js still has unquoted tcT(noResults) bug');
check(/function parseYouTubeRss/.test(toComp) && /getElementsByTagName\('yt:videoId'\)/.test(toComp),
    'tocomprehensive.js has no YouTube RSS videoId parser');
check(/fetchWithProxy/.test(toComp) && /function fetchYouTubeRss/.test(toComp),
    'YouTube RSS is not fetched through the shared CORS proxy');
check(/function loadYouTubeRssVideo/.test(comp) && /yt-rss:/.test(comp),
    'comprehensive.js has no YouTube RSS playback branch');
check(/getEnabled\('youtube'\)/.test(toComp), 'Theater does not merge user-added YouTube channel sources');
check(/Blender Foundation Open Movies/.test(readme), 'README has no Blender open movies credit');
// Theater source-picker copy must be translated into the same 8 UI languages.
const tcHead = toComp.split('function tcLang')[0];
const tcI18n = new Function('localStorage', 'navigator', tcHead + '; return TC_I18N;')(
    { getItem: () => null }, { language: 'en' });
const tcLangs = ['en', 'zh', 'ja', 'ko', 'fr', 'de', 'es', 'ru'];
const tcKeys = Object.keys(tcI18n.en);
check(tcLangs.every((l) => tcI18n[l]), 'Theater i18n is missing one of the 8 UI languages');
tcLangs.forEach((l) => {
    check(Object.keys(tcI18n[l] || {}).length === tcKeys.length,
        'Theater i18n ' + l + ' has a different key count than en');
    tcKeys.forEach((k) => check(typeof (tcI18n[l] || {})[k] === 'string' && (tcI18n[l] || {})[k].length > 0,
        'Theater i18n ' + l + '.' + k + ' is missing'));
});
check(/var uiLangs = \['ja', 'ko', 'fr', 'de', 'es', 'ru'\]/.test(toComp),
    'tcLang() does not recognise all 8 UI languages');
// Every language's source-picker description must mention the YouTube source,
// not just the old CMS + archive.org copy.
tcLangs.forEach((l) => {
    check(/YouTube/i.test(tcI18n[l].dlgDesc),
        'Theater i18n ' + l + '.dlgDesc does not mention the YouTube source');
});

// Recomp cards must label a real platform, not repeat the game title.
const recompCards = games.filter((g) => g.category === 'recomp');
check(recompCards.length === 46, 'expected 46 recomp cards, found ' + recompCards.length);
check(recompCards.every((g) => g.name !== g.platform),
    'recomp cards must not use the game name as the platform label');
check(recompCards.every((g) => g.url.indexOf('n64recomp.html') === -1 || g.platform === 'Nintendo 64'),
    'N64 recomp cards must use Nintendo 64 as the platform label');
check(recompCards.every((g) => g.name !== 'Zelda II' || g.platform === 'NES'),
    'Zelda II recomp card must use NES as the platform label');
check(recompCards.every((g) => !['Red Alert 2', 'Diablo'].includes(g.name) || g.platform === 'PC'),
    'Red Alert 2 and Diablo recomp cards must use PC as the platform label');
const supplementalRemoteCovers = [
    { name: 'Red Alert 2', image: 'https://raw.githubusercontent.com/ra2-games/ra2/main/docs/assets/ra2vm-poster.jpg' },
    { name: 'Diablo', image: 'https://raw.githubusercontent.com/d07RiV/diabloweb/master/public/icon-192.png' },
    { name: 'Zelda II', image: 'https://raw.githubusercontent.com/troyedwardsjr/z2rs/main/crates/z2-web/site/assets/hero.webp' },
    { name: 'LEGO Island (Browser Port)', image: 'https://raw.githubusercontent.com/isledecomp/isle.pizza/master/public/images/install.webp' }
];
supplementalRemoteCovers.forEach(({ name, image }) => {
    const card = games.filter((g) => g.name === name);
    check(card.length === 1 && card[0].image === image,
        name + ' does not use its GitHub-hosted cover image');
});



// N64 static recompilations: one generic player covering all 41 n64hub games.
const n64RecompGames = [
    { key: 'sm64', id: 134, name: 'Super Mario 64', slug: 'super-mario-64' },
    { key: 'fzerox', id: 135, name: 'F-Zero X', slug: 'f-zero-x' },
    { key: 'marioparty', id: 136, name: 'Mario Party', slug: 'mario-party' },
    { key: 'rush2049', id: 137, name: 'San Francisco Rush 2049', slug: 'rush-2049' },
    { key: 'goldeneye', id: 138, name: 'GoldenEye 007', slug: 'goldeneye' },
    { key: 'majorasmask', id: 139, name: "The Legend of Zelda: Majora's Mask", slug: 'majoras-mask' },
    { key: 'banjokazooie', id: 140, name: 'Banjo-Kazooie', slug: 'banjo-kazooie' },
    { key: 'conker', id: 141, name: "Conker's Bad Fur Day", slug: 'conker' },
    { key: 'dk64', id: 142, name: 'Donkey Kong 64', slug: 'donkey-kong-64' },
    { key: 'waverace64', id: 143, name: 'Wave Race 64', slug: 'wave-race-64' },
    { key: 'pilotwings64', id: 144, name: 'Pilotwings 64', slug: 'pilotwings-64' },
    { key: 'banjotooie', id: 145, name: 'Banjo-Tooie', slug: 'banjo-tooie' },
    { key: 'mariokart64', id: 146, name: 'Mario Kart 64', slug: 'mario-kart-64' },
    { key: 'starfox64', id: 147, name: 'Star Fox 64', slug: 'star-fox-64' },
    { key: 'oot', id: 148, name: 'The Legend of Zelda: Ocarina of Time', slug: 'ocarina-of-time' },
    { key: 'diddykongracing', id: 149, name: 'Diddy Kong Racing', slug: 'diddy-kong-racing' },
    { key: 'jetforcegemini', id: 150, name: 'Jet Force Gemini', slug: 'jet-force-gemini' },
    { key: 'racer', id: 151, name: 'Star Wars Episode I: Racer', slug: 'star-wars-episode-1-racer' },
    { key: 'pokemonsnap', id: 152, name: 'Pokémon Snap', slug: 'pokemon-snap' },
    { key: 'rush2', id: 153, name: 'Rush 2: Extreme Racing USA', slug: 'rush-2' },
    { key: 'snowboarding1080', id: 154, name: '1080° Snowboarding', slug: '1080-snowboarding' },
    { key: 'sssv', id: 155, name: 'Space Station Silicon Valley', slug: 'space-station-silicon-valley' },
    { key: 'thps2', id: 156, name: "Tony Hawk's Pro Skater 2", slug: 'tony-hawks-pro-skater-2' },
    { key: 'roguesquadron', id: 157, name: 'Star Wars: Rogue Squadron', slug: 'star-wars-rogue-squadron' },
    { key: 'beetle', id: 158, name: 'Beetle Adventure Racing!', slug: 'beetle-adventure-racing' },
    { key: 'turokragewars', id: 159, name: 'Turok: Rage Wars', slug: 'turok-rage-wars' },
    { key: 'wwfmercy', id: 160, name: 'WWF No Mercy', slug: 'wwf-no-mercy' },
    { key: 'mariotennis', id: 161, name: 'Mario Tennis', slug: 'mario-tennis' },
    { key: 'perfectdark', id: 162, name: 'Perfect Dark', slug: 'perfect-dark' },
    { key: 'marioparty2', id: 163, name: 'Mario Party 2', slug: 'mario-party-2' },
    { key: 'marioparty3', id: 164, name: 'Mario Party 3', slug: 'mario-party-3' },
    { key: 'smashbros', id: 165, name: 'Super Smash Bros.', slug: 'super-smash-bros' },
    { key: 'papermario', id: 166, name: 'Paper Mario', slug: 'paper-mario' },
    { key: 'mariogolf', id: 167, name: 'Mario Golf', slug: 'mario-golf' },
    { key: 'rayman2', id: 168, name: 'Rayman 2', slug: 'rayman-2' },
    { key: 'goinquackers', id: 169, name: "Donald Duck: Goin' Quackers", slug: 'goin-quackers' },
    { key: 'dinosaurplanet', id: 170, name: 'Dinosaur Planet', slug: 'dinosaur-planet' },
    { key: 'turok', id: 171, name: 'Turok: Dinosaur Hunter', slug: 'turok-dinosaur-hunter' },
    { key: 'turok2', id: 172, name: 'Turok 2: Seeds of Evil', slug: 'turok-2' },
    { key: 'turok3', id: 173, name: 'Turok 3: Shadow of Oblivion', slug: 'turok-3' },
    { key: 'excitebike64', id: 174, name: 'Excitebike 64', slug: 'excitebike-64' }
];
check(n64RecompGames.length === 41, 'expected all 41 n64hub games, found ' + n64RecompGames.length);
const n64Js = maybeRead('js/ton64recomp.js');
const n64Html = maybeRead('routes/n64recomp.html');
const n64JsHead = n64Js.split('// ---- helpers')[0];
const n64Sandbox = { localStorage: { getItem: () => null } };
const n64Registry = new Function('localStorage', 'HotlinkPlayer', n64JsHead + '; return N64_REGISTRY;')(
    n64Sandbox.localStorage,
    { ensureIsolated: function () {} }
);
n64RecompGames.forEach((game) => {
    const card = games.filter((g) => g.name === game.name);
    check(card.length === 1, 'expected exactly one ' + game.name + ' card, found ' + card.length);
    check(card.length === 1 && card[0].id === game.id, game.name + ' card should use id ' + game.id);
    check(card.length === 1 && card[0].category === 'recomp', game.name + ' is not in recomp');
    check(card.length === 1 && card[0].url === '../routes/n64recomp.html?game=' + game.key,
        game.name + ' route is wrong');
    const expectedRemoteImage = 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/';
    check(card.length === 1 && card[0].image.startsWith(expectedRemoteImage) || card.length === 1 && game.key === 'dinosaurplanet' && card[0].image === 'https://raw.githubusercontent.com/n64hub/dinosaur-planet-recomp/main/icons/512.png',
        game.name + ' image is wrong');
    check(n64Registry[game.key] && n64Registry[game.key].url === 'https://n64hub.com/' + game.slug + '/',
        'ton64recomp.js has no correct ' + game.name + ' registry entry');
    check(!/n64FallbackList/.test(n64Html) && !/n64FallbackList/.test(n64Js),
        'n64recomp must not render the long n64hub game page link list');
});
check(/N64HUB_HOME\s*=\s*'https:\/\/n64hub\.com\/'/.test(n64Js), 'ton64recomp.js has no N64HUB_HOME');
check(/credentialless/.test(n64Html), 'n64recomp.html iframe lacks credentialless isolation');
check(/cross-origin-isolated/.test(n64Html), 'n64recomp.html iframe lacks cross-origin-isolated permission');
check(/WebGPU/.test(n64Js), 'ton64recomp.js does not explain WebGPU requirements');
check(/bring[- ]your[- ]own|Bring your own/i.test(n64Js), 'ton64recomp.js does not explain BYO ROM requirement');
check(/Nintendo/.test(n64Js), 'ton64recomp.js has no Nintendo-unsupported notice');
check(/Object\.prototype\.hasOwnProperty\.call\(N64_REGISTRY,\s*currentGameKey\)/.test(n64Js),
    'N64 game key validation must use an own-property check');
const n64I18n = new Function('localStorage', 'HotlinkPlayer', n64JsHead + '; return i18n;')(
    n64Sandbox.localStorage,
    { ensureIsolated: function () {} }
);
check(Object.keys(n64I18n).every((lang) => typeof n64I18n[lang].invalidGame === 'string' && n64I18n[lang].invalidGame.length > 0),
    'every N64 recomp language must have an invalidGame message');
check(!/Super Mario 64 \/ F-Zero X \/ Mario Party/.test(n64Js) && !/Super Mario 64 \/ F-Zero X \/ Mario Party/.test(n64Html),
    'N64 recomp ROM guidance must not mention only three supported games');
const n64DivOpens = (n64Html.match(/<div\b/g) || []).length;
const n64DivCloses = (n64Html.match(/<\/div>/g) || []).length;
check(n64DivOpens === n64DivCloses, 'n64recomp.html has unbalanced div tags (' + n64DivOpens + ' open / ' + n64DivCloses + ' close)');
check(/game\.html\?category=recomp/.test(n64Js), 'N64 recomp back link does not use category=recomp');
check(i18nPairsRaw.indexOf('js/ton64recomp.js') !== -1 && i18nPairsRaw.indexOf('routes/n64recomp.html') !== -1, 'checks.yml misses N64 recomp i18n pair');
const syntaxSection = checksYml.split('JavaScript syntax')[1] || '';
// The syntax step may list the script explicitly or cover it with the js/*.js
// glob, which checks every page script (including this one).
check(/js\/ton64recomp\.js/.test(syntaxSection) || /js\/\*\.js/.test(syntaxSection),
    'checks.yml misses N64 recomp syntax check');
check(/\/routes\/n64recomp\.html/.test(sw), 'sw.js does not isolate the N64 recomp route');
check(/N64Recomp/i.test(readme) && /n64hub/i.test(readme), 'README has no N64Recomp / n64hub credit');
check(/bring[- ]your[- ]own|BYO/i.test(readme), 'README has no BYO ROM notice for N64 recompilations');


// v8.6.0: remote game images must keep the Games-icon fallback and be cached
// by the service worker so a hot-link outage does not blank the cards.
check(/onerror="this\.src=\\'..\/images\/game\.svg\\'"/.test(togame),
    'game cards must fall back to ../images/game.svg when a remote image fails');
check(/GAME_IMAGE_CACHE/.test(sw) && /GAME_IMAGE_HOSTS/.test(sw),
    'sw.js must cache hot-linked game card images');
check(/check-remote-images\.js/.test(checksYml),
    'checks.yml must verify remote game image URLs');

// v8.6.1: text-games batch - five narrative / incremental games hot-linked
// through the generic player routes/webgame.html?game=<key>.
const TEXT_GAMES = [
    ['adarkroom',  'A Dark Room',           'https://adarkroom.doublespeakgames.com/',     'doublespeakgames/adarkroom',              'MPL-2.0'],
    ['liferestart', '人生重开模拟器',        'https://liferestart.syaro.io/',               'VickScarlet/remake',                      'MIT'],
    ['candybox2',  'Candy Box 2',           'https://candybox2.github.io/',                'candybox2/candybox2.github.io',           'GPL-3.0'],
    ['antimatter', 'Antimatter Dimensions', 'https://ivark.github.io/AntimatterDimensions/', 'IvarK/AntimatterDimensionsSourceCode',  'MIT'],
    ['xiuxian',    '文字修仙',               'https://xiuxian.wenzi.games/',               'setube/vue-xiuxiangame',                  'CC BY-NC 4.0']
];
// Parse the real objects instead of grepping the whole file: a substring test
// on the file text is satisfied by any other entry (e.g. 'MIT' appears on the
// 2048 line), so it cannot detect a wrong value in a specific game entry.
const wgRegistry = eval('(' + (webgame.match(/var WEBGAME_REGISTRY = (\{[\s\S]*?\n\});/) || ['', '{}'])[1] + ')');
const wgI18n = eval('(' + (webgame.match(/var i18n = (\{[\s\S]*?\n\});/) || ['', '{}'])[1] + ')');
check(Object.keys(wgI18n).length === 8, 'towebgame.js must keep 8 UI languages, found ' + Object.keys(wgI18n).length);

for (const [key, name, url, repo, license] of TEXT_GAMES) {
    const card = games.filter((g) => g.url === '../routes/webgame.html?game=' + key);
    check(card.length === 1 && card[0].category === 'webgames', name + ' is not a single card in the webgames category');
    check(card.length === 1 && /^https:\/\/raw\.githubusercontent\.com\//.test(card[0].image),
        name + ' card image must be a hot-linked raw.githubusercontent.com URL');
    const entry = wgRegistry[key];
    check(Boolean(entry), 'towebgame.js has no ' + name + ' registry entry for key ' + key);
    if (!entry) continue;
    check(entry.url === url, name + ' registry URL is wrong: ' + entry.url);
    check(entry.repo === repo, name + ' registry repo is wrong: ' + entry.repo);
    check(entry.license === license, name + ' registry license is wrong: ' + entry.license);
}

// Every language must list the new text games in aboutHint and must not claim
// that all works are open source (Xiuxian Cultivation is CC BY-NC 4.0).
const TEXT_GAME_MENTIONS = ['A Dark Room', 'Candy Box 2', 'Antimatter Dimensions'];
// Keyed by language so adding or reordering a language cannot silently skip a check.
const FREE_LICENSE_HINT = {
    zh: /自由许可/, en: /free-licensed/, ja: /フリーライセンス/, ko: /자유 라이선스/,
    fr: /licence libre/, de: /frei lizenziert/, es: /licencia libre/, ru: /свободную лицензию/
};
Object.keys(wgI18n).forEach((lang) => {
    const about = wgI18n[lang].aboutHint || '';
    const hint = wgI18n[lang].demoHint || '';
    TEXT_GAME_MENTIONS.forEach((n) => check(about.indexOf(n) !== -1, lang + ' aboutHint is missing ' + n));
    check(/人生重开|人生重開|Life Restart/.test(about), lang + ' aboutHint is missing Life Restart');
    check(/文字修仙|Xiuxian/.test(about), lang + ' aboutHint is missing Xiuxian Cultivation');
    check(FREE_LICENSE_HINT[lang] && FREE_LICENSE_HINT[lang].test(hint),
        lang + ' demoHint does not say the works are open source or free-licensed');
});

check(/A Dark Room/.test(webgameHtml), 'webgame.html fallback aboutHint does not mention the text games');
check(/free-licensed/.test(webgameHtml), 'webgame.html fallback demoHint still claims every game is open source');
check(/Text games \(hot-linked embeds\)/.test(readme), 'README has no text-games credit entry');
check(i18nPairsRaw.indexOf('js/towebgame.js') !== -1, 'i18n-pairs.json misses js/towebgame.js');

// v8.6.1: the hot-linked game URLs themselves must be verified in CI, not only
// the card images - a dead upstream would otherwise show a blank iframe.
const webgameUrls = Object.keys(wgRegistry).map((k) => wgRegistry[k].url);
check(webgameUrls.length >= 17 && webgameUrls.every((u) => /^https:\/\//.test(u)),
    'every webgame registry entry must use an https URL');
check(/check-webgame-urls\.js/.test(checksYml), 'checks.yml must verify the hot-linked game URLs');

// v8.6.1: the catalogue check must not regress into a tautology. The old
// `expectedMobile = Math.max(1, mobile.length)` made the mobile assertion
// true by construction, and the id101/id102 point checks were already covered
// by the global uniqueness scan.
const catalogueCheckRaw = read('scripts/checks/check-games.js');
// Strip comments first: the file documents the old tautology in prose, and a
// grep over raw text would report that explanation as a live regression.
const catalogueCheck = catalogueCheckRaw.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '');
check(!/Math\.max\(1,\s*mobile\.length\)/.test(catalogueCheck),
    'check-games.js reintroduces a self-referential category assertion (always true)');
check(/CATEGORY_FLOORS/.test(catalogueCheck) && /data-category=/.test(catalogueCheck),
    'check-games.js must keep category floors and the game.html tab cross-check');
check(/readFileSync\(path\.join\(root,\s*'routes\/game\.html'\)/.test(catalogueCheck),
    'check-games.js must read routes/game.html to verify card categories against its tabs');

// v8.6.1: the check scripts live in scripts/checks/ (they are project CI tooling,
// not Superpowers skill output, which owns the local-only docs/ folder). Guard
// the directory contract so a future move cannot silently drop checks from CI:
// every script referenced by the workflow must exist, and every check script in
// the folder must be invoked by it.
const checkDir = 'scripts/checks';
const workflowRefs = Array.from(new Set(checksYml.match(/scripts\/checks\/[\w.-]+\.js/g) || []));
check(workflowRefs.length >= 14, 'checks.yml should invoke at least 14 check scripts, found ' + workflowRefs.length);
workflowRefs.forEach((rel) => check(fs.existsSync(path.join(root, rel)), 'checks.yml runs a missing script: ' + rel));
const dirScripts = fs.readdirSync(path.join(root, checkDir))
    .filter((f) => f.startsWith('check-') && f.endsWith('.js'))
    .map((f) => checkDir + '/' + f);
// check-i18n.js is invoked indirectly through check-i18n-all.js.
const notRun = dirScripts.filter((rel) => !workflowRefs.includes(rel) && rel !== 'scripts/checks/check-i18n.js');
check(notRun.length === 0, 'check scripts not invoked by checks.yml: ' + notRun.join(', '));
check(!/docs\/superpowers/.test(checksYml), 'checks.yml still points at the old docs/superpowers location');

// v8.6.1: docs/ is the local-only Superpowers skill folder, so it must stay
// ignored at the root and no check script may read or run anything from it.
const gitignore = maybeRead('.gitignore');
check(/^\/docs\/$/m.test(gitignore), '.gitignore no longer ignores the root docs/ folder (skill drafts would be committed)');
check(!/^\s*!\/?docs\//m.test(gitignore), '.gitignore re-includes docs/ after ignoring it');
check(!/['"(]docs\//.test(checksYml), 'checks.yml runs a script out of the local-only docs/ folder');
const otherChecks = dirScripts.filter((rel) => rel !== 'scripts/checks/check-game-regressions.js');
otherChecks.forEach((rel) => check(!/read\(['"]docs\/|docs\/superpowers/.test(read(rel)),
    rel + ' still reads a file out of the local-only docs/ folder'));

// v8.6.2: J2ME's official demo must launch inside the page's hotlinked iframe.
// Opening the demo with window.open bypasses the shared player and contradicts
// the README's "hot-linked embed" claim.
const j2meJs = maybeRead('js/toj2me.js');
const j2meHtml = maybeRead('routes/j2me.html');
check(/function playDemo\s*\(/.test(j2meJs), 'toj2me.js has no playDemo() function');
check(/demoOpenBtn'\)\.addEventListener\('click',\s*playDemo\)/.test(j2meJs),
    'J2ME official demo button does not call playDemo()');
check(/function playDemo\s*\([\s\S]*?currentJ2meUrl\s*=\s*J2ME_BASE;[\s\S]*?player\.start\(\);/.test(j2meJs),
    'J2ME playDemo() must load J2ME_BASE in the embedded player');
check(!/window\.open\(\s*J2ME_BASE/.test(j2meJs),
    'J2ME official demo still opens a new browser tab');
check(/<i class="fas fa-play"><\/i>[\s\S]{0,160}data-i18n="demoOpen"/.test(j2meHtml),
    'J2ME demo button icon does not signal in-page playback');

// J2meJS runs on rosabis.github.io. A blob: URL created by this page belongs to
// the parent origin, so the iframe cannot fetch it; the old "Local Jar" input
// therefore downloaded the URL as a relative path and always failed. Send users
// to the official installer inside the embedded player instead.
check(!/URL\.createObjectURL/.test(j2meJs),
    'J2ME must not pass a parent-origin blob: URL to the cross-origin J2meJS iframe');
check(!/id="jarInput"/.test(j2meHtml),
    'J2ME page must not offer a host-side local jar file input');
check(/uploadBtn'\)\.addEventListener\('click',\s*playDemo\)/.test(j2meJs),
    'J2ME local-install button must open the embedded official installer');

if (failures.length) {
    failures.forEach((f) => console.log('FAIL: ' + f));
    process.exit(1);
}
console.log('ALL REGRESSION CHECKS OK');
