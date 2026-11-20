// Regression checks for the v8.5.3 game-module bug batch.
// Run with: node docs/superpowers/check-game-regressions.js
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

// Additional regression checks for later hot-linked platform pages.
const macJs = maybeRead('js/tomac.js');
const macHtml = maybeRead('routes/mac.html');
const macCard = games.filter((g) => g.platform === 'Classic Mac');
check(macCard.length === 1, 'expected exactly one Classic Mac card, found ' + macCard.length);
check(macCard.length === 1 && macCard[0].category === 'retropc', 'Classic Mac is not in the retropc category');
check(macCard.length === 1 && macCard[0].url === '../routes/mac.html', 'Classic Mac does not point at routes/mac.html');
check(macCard.length === 1 && macCard[0].image === '../images/mac.svg', 'Classic Mac does not use its dedicated image');
check(fs.existsSync(path.join(root, 'images/mac.svg')), 'Classic Mac image is missing: ../images/mac.svg');
check(/MAC_HOME\s*=\s*'https:\/\/infinitemac\.org\/'/.test(macJs), 'tomac.js has no dedicated MAC_HOME');
check(/link\.href = MAC_HOME/.test(macJs), 'tomac.js new-tab link should point at MAC_HOME');
check(/game\.html\?category=retropc/.test(macJs), 'Classic Mac back link does not use category=retropc');
check(/SystemJS|System\.import|load/.test(macJs), 'tomac.js does not load the Infinite Mac app');
check(/allow=\"[^\"]*fullscreen/.test(macHtml), 'mac.html iframe does not allow fullscreen');

check(/open in a new tab/i.test(macHtml), 'mac.html static HTML fallback lacks new-tab guidance');
check(/js\/tomac\.js routes\/mac\.html/.test(checksYml), 'checks.yml does not run i18n pairs for the Classic Mac page');
check(/js\/tomac\.js/.test(checksYml), 'checks.yml does not syntax-check js/tomac.js');
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
check(/js\/tork86\.js routes\/rk86\.html/.test(checksYml), 'checks.yml does not run i18n pairs for the Radio-86RK page');
check(/js\/tork86\.js/.test(checksYml), 'checks.yml does not syntax-check js/tork86.js');
check(!/allowfullscreen/.test(rkHtml), 'rk86.html iframe has redundant allowfullscreen attribute');
const rkHints = rkJs.match(/demoHint:\s*(['\"])(.*?)\1/g) || [];
check(rkHints.length === 8, 'tork86.js should have 8 translated demoHint strings, found ' + rkHints.length);
const estyJs = maybeRead('js/toesty.js');
const estyHtml = maybeRead('routes/esty.html');
const estyCard = games.filter((g) => g.platform === 'Atari ST');
check(estyCard.length === 1, 'expected exactly one Atari ST card, found ' + estyCard.length);
check(estyCard.length === 1 && estyCard[0].category === 'computer', 'Atari ST is not in the computer category');
check(estyCard.length === 1 && estyCard[0].url === '../routes/esty.html', 'Atari ST does not point at routes/esty.html');
check(estyCard.length === 1 && estyCard[0].image === '../images/atarist.svg', 'Atari ST does not use its dedicated image');
check(fs.existsSync(path.join(root, 'images/atarist.svg')), 'Atari ST image is missing: ../images/atarist.svg');
check(/ESTY_HOME\s*=\s*'https:\/\/kaiec\.github\.io\/EstyJS\/'/.test(estyJs), 'toesty.js has no dedicated ESTY_HOME');
check(/link\.href = ESTY_HOME/.test(estyJs), 'toesty.js new-tab link should point at ESTY_HOME');
check(/link\.href = ESTY_HOME/.test(estyJs.split('function showSlowLink')[1] || ''), 'toesty.js slow-load fallback link should point at ESTY_HOME');
check(/href=\"https:\/\/kaiec\.github\.io\/EstyJS\/\"/.test(estyHtml), 'esty.html static new-tab link is not the official EstyJS app');
check(/game\.html\?category=computer/.test(estyJs), 'Atari ST back link does not use category=computer');
check(/allow=\"[^\"]*fullscreen/.test(estyHtml), 'esty.html iframe does not allow fullscreen');
check(/open in a new tab/i.test(estyHtml), 'esty.html static HTML fallback lacks new-tab guidance');
check(/js\/toesty\.js routes\/esty\.html/.test(checksYml), 'checks.yml does not run i18n pairs for the Atari ST page');
check(/js\/toesty\.js/.test(checksYml), 'checks.yml does not syntax-check js/toesty.js');
check(!/allowfullscreen/.test(estyHtml), 'esty.html iframe has redundant allowfullscreen attribute');
check(/Atari ST \(EstyJS embed\)/.test(readme), 'README platform table has no Atari ST / EstyJS row');
const androidJs = maybeRead('js/toandroid.js');
const androidHtml = maybeRead('routes/android.html');
const androidCard = games.filter((g) => g.platform === 'Android');
check(androidCard.length === 1, 'expected exactly one Android card, found ' + androidCard.length);
check(androidCard.length === 1 && androidCard[0].category === 'mobile', 'Android is not in the mobile category');
check(androidCard.length === 1 && androidCard[0].url === '../routes/android.html', 'Android does not point at routes/android.html');
check(androidCard.length === 1 && androidCard[0].image === '../images/android.svg', 'Android does not use its dedicated image');
check(fs.existsSync(path.join(root, 'images/android.svg')), 'Android image is missing: ../images/android.svg');
check(/V86_RUNTIME\s*=\s*'..\/vendor\/v86\/libv86\.js'/.test(androidJs), 'toandroid.js does not load the vendored v86 engine');
check(/V86_WASM\s*=\s*'..\/vendor\/v86\/v86\.wasm'/.test(androidJs), 'toandroid.js does not load the vendored v86 WASM binary');
check(/bios:\s*\{\s*url:\s*'..\/vendor\/v86\/seabios\.bin'/.test(androidJs), 'toandroid.js does not load the vendored SeaBIOS');
check(/vga_bios:\s*\{\s*url:\s*'..\/vendor\/v86\/vgabios\.bin'/.test(androidJs), 'toandroid.js does not load the vendored VGA BIOS');
check(/BYO|Bring your own|own Android/i.test(androidJs), 'toandroid.js does not explain BYO image support');
check(/game\.html\?category=mobile/.test(androidJs), 'Android back link does not use category=mobile');
check(/js\/toandroid\.js routes\/android\.html/.test(checksYml), 'checks.yml does not run i18n pairs for the Android page');
check(/js\/toandroid\.js/.test(checksYml), 'checks.yml does not syntax-check js/toandroid.js');
check(/\(v86, BYO Android-x86 image\)/.test(readme), 'README platform table has no Android / v86 row');
const feltJs = maybeRead('js/tofelt.js');
const feltHtml = maybeRead('routes/feltworld.html');
const feltCard = games.filter((g) => g.name === 'Felt World');
check(feltCard.length === 1, 'expected exactly one Felt World card, found ' + feltCard.length);
check(feltCard.length === 1 && feltCard[0].id === 128, 'Felt World card should use id 128');
check(feltCard.length === 1 && feltCard[0].category === 'webgames', 'Felt World is not in the webgames category');
check(feltCard.length === 1 && feltCard[0].url === '../routes/feltworld.html', 'Felt World does not point at routes/feltworld.html');
check(feltCard.length === 1 && feltCard[0].image === '../images/feltworld.svg', 'Felt World does not use its dedicated image');
check(fs.existsSync(path.join(root, 'images/feltworld.svg')), 'Felt World image is missing: ../images/feltworld.svg');
check(/FELT_HOME\s*=\s*'https:\/\/az9713\.github\.io\/opus-5\.5-open-world-game\/feltworld\/'/.test(feltJs), 'tofelt.js has no dedicated FELT_HOME');
check(/link\.href = FELT_HOME/.test(feltJs), 'tofelt.js new-tab link should point at FELT_HOME');
check(/link\.href = FELT_HOME/.test(feltJs.split('function showSlowLink')[1] || ''), 'tofelt.js slow-load fallback link should point at FELT_HOME');
check(/href=\"https:\/\/az9713\.github\.io\/opus-5\.5-open-world-game\/feltworld\/\"/.test(feltHtml), 'feltworld.html static new-tab link is not the official Felt World app');
check(/game\.html\?category=webgames/.test(feltJs), 'Felt World back link does not use category=webgames');
check(/allow=\"[^\"]*fullscreen/.test(feltHtml), 'feltworld.html iframe does not allow fullscreen');
check(!/allowfullscreen/.test(feltHtml), 'feltworld.html iframe has redundant allowfullscreen attribute');
check(/open in a new tab/i.test(feltHtml), 'feltworld.html static HTML fallback lacks new-tab guidance');
check(/js\/tofelt\.js routes\/feltworld\.html/.test(checksYml), 'checks.yml does not run i18n pairs for the Felt World page');
check(/js\/tofelt\.js/.test(checksYml), 'checks.yml does not syntax-check js/tofelt.js');
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
check(novaCard.length === 1 && novaCard[0].image === '../images/nova.svg', 'NOVA LANCER image is wrong');
check(fs.existsSync(path.join(root, 'images/nova.svg')), 'nova.svg is missing');
check(/NOVA_HOME\s*=\s*'https:\/\/tanuu5\.github\.io\/nova-lancer\/'/.test(novaJs), 'tonova.js has no NOVA_HOME');
check(/link\.href = NOVA_HOME/.test(novaJs), 'tonova.js new-tab link is wrong');
check(/game\.html\?category=webgames/.test(novaJs), 'NOVA LANCER back link is wrong');
check(/href=\"https:\/\/tanuu5\.github\.io\/nova-lancer\/\"/.test(novaHtml), 'nova.html new-tab link is wrong');
check(/allow=\"[^\"]*fullscreen/.test(novaHtml), 'nova.html iframe lacks fullscreen permission');
check(!/allowfullscreen/.test(novaHtml), 'nova.html has redundant allowfullscreen');
check(/open in a new tab/i.test(novaHtml), 'nova.html lacks new-tab guidance');
check(/js\/tonova\.js routes\/nova\.html/.test(checksYml), 'checks.yml misses NOVA LANCER i18n pair');
check(/js\/tonova\.js/.test(checksYml), 'checks.yml misses NOVA LANCER syntax check');
const casaJs = maybeRead('js/tocasa.js');
const casaHtml = maybeRead('routes/casa.html');
const casaCard = games.filter((g) => g.name === 'Casa de Gemas');
check(casaCard.length === 1, 'expected exactly one Casa de Gemas card, found ' + casaCard.length);
check(casaCard.length === 1 && casaCard[0].id === 132, 'Casa de Gemas card should use id 132');
check(casaCard.length === 1 && casaCard[0].category === 'webgames', 'Casa de Gemas is not in webgames');
check(casaCard.length === 1 && casaCard[0].url === '../routes/casa.html', 'Casa de Gemas route is wrong');
check(casaCard.length === 1 && casaCard[0].image === '../images/casa.svg', 'Casa de Gemas image is wrong');
check(fs.existsSync(path.join(root, 'images/casa.svg')), 'casa.svg is missing');
check(/CASA_HOME\s*=\s*'https:\/\/deepujain\.github\.io\/casadegema\/'/.test(casaJs), 'tocasa.js has no CASA_HOME');
check(/link\.href = CASA_HOME/.test(casaJs), 'tocasa.js new-tab link is wrong');
check(/game\.html\?category=webgames/.test(casaJs), 'Casa de Gemas back link is wrong');
check(/href=\"https:\/\/deepujain\.github\.io\/casadegema\/\"/.test(casaHtml), 'casa.html new-tab link is wrong');
check(/allow=\"[^\"]*fullscreen/.test(casaHtml), 'casa.html iframe lacks fullscreen permission');
check(!/allowfullscreen/.test(casaHtml), 'casa.html has redundant allowfullscreen');
check(/open in a new tab/i.test(casaHtml), 'casa.html lacks new-tab guidance');
check(/js\/tocasa\.js routes\/casa\.html/.test(checksYml), 'checks.yml misses Casa de Gemas i18n pair');
check(/js\/tocasa\.js/.test(checksYml), 'checks.yml misses Casa de Gemas syntax check');
check(/NOVA LANCER \(hot-linked embed, MIT\)/.test(readme), 'README has no NOVA LANCER credit');
check(/Casa de Gemas \(hot-linked embed, MIT\)/.test(readme), 'README has no Casa de Gemas credit');
// Papertrails: curated Fable List candidate, generic webgame hot-link player.
const papertrailsCard = games.filter((g) => g.name === 'Papertrails');
check(papertrailsCard.length === 1, 'expected exactly one Papertrails card, found ' + papertrailsCard.length);
check(papertrailsCard.length === 1 && papertrailsCard[0].id === 133, 'Papertrails card should use id 133');
check(papertrailsCard.length === 1 && papertrailsCard[0].category === 'webgames', 'Papertrails is not in webgames');
check(papertrailsCard.length === 1 && papertrailsCard[0].url === '../routes/webgame.html?game=papertrails', 'Papertrails route is wrong');
check(papertrailsCard.length === 1 && papertrailsCard[0].image === '../images/papertrails.svg', 'Papertrails image is wrong');
check(fs.existsSync(path.join(root, 'images/papertrails.svg')), 'papertrails.svg is missing');
check(/'papertrails':\s*\{\s*name:\s*'Papertrails',\s*url:\s*'https:\/\/xikhar\.github\.io\/papertrails\/',\s*repo:\s*'xikhar\/papertrails',\s*license:\s*'MIT'\s*\}/.test(webgame),
    'towebgame.js has no correct Papertrails registry entry');
check(/Papertrails \(hot-linked embed, MIT\)/.test(readme), 'README has no Papertrails credit');

if (failures.length) {
    failures.forEach((f) => console.log('FAIL: ' + f));
    process.exit(1);
}
console.log('ALL REGRESSION CHECKS OK');
