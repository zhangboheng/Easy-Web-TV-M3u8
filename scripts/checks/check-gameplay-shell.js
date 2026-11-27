// Gameplay shell check: js/togameplay.js + catalogues/gameplay.html (v8.6.x)
// Usage: node scripts/checks/check-gameplay-shell.js
//
// The gameplay page is the only player shell outside routes/, so
// check-hotlink-player.js (driven by hotlink-pages.json) does not see it.
// These assertions pin the behaviour it must share with the other players:
// an unknown ?game= key is reported instead of launching game #1, and the
// iframe lifecycle is delegated to the shared helper.
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..', '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); };

const js = read('js/togameplay.js');
const html = read('catalogues/gameplay.html');

// 1. Unknown/missing game keys must be reported, never silently replaced.
check(/var\s+GAMEPLAY_REGISTRY\s*=/.test(js), 'togameplay.js has no GAMEPLAY_REGISTRY');
check(/hasOwnProperty\.call\(GAMEPLAY_REGISTRY/.test(js),
    'togameplay.js does not own-property-check the registry lookup');
check(!/Object\.keys\(\s*games\s*\)\[0\]/.test(js), 'togameplay.js still falls back to the first game');
check(/function\s+showInvalidGame\s*\(/.test(js), 'togameplay.js has no invalid-game state');
check(/setControlsEnabled\(false\)/.test(js), 'invalid game does not disable restart/fullscreen');
check(/invalidGame/.test(js), 'togameplay.js has no invalidGame i18n key');

// 2. The iframe lifecycle belongs to js/hotlink-player.js.
check(/HotlinkPlayer\.createPlayer\(/.test(js), 'togameplay.js does not call HotlinkPlayer.createPlayer');
check(/frameId:\s*'gameFrame'/.test(js), 'createPlayer does not target iframe gameFrame');
check(/overlayId:\s*'loadingOverlay'/.test(js), 'createPlayer does not use the page loading overlay');
check(!/\biframe\.src\s*=/.test(js), 'togameplay.js still assigns iframe.src directly');
check(!/\bvar\s+slowTimer\b/.test(js), 'togameplay.js still owns a slow-load timer');

// 3. Static copy is translated (8 languages, checked by check-i18n.js).
const helperPos = html.indexOf('js/hotlink-player.js');
const pagePos = html.indexOf('../js/togameplay.js');
check(helperPos !== -1 && pagePos !== -1 && helperPos < pagePos,
    'catalogues/gameplay.html must load hotlink-player.js before togameplay.js');
check(/id="loadingOverlay"/.test(html), 'catalogues/gameplay.html has no loading overlay');
check(/id="toast"/.test(html) && /id="toastMessage"/.test(html),
    'catalogues/gameplay.html has no toast for slow/stalled loads');
check(/data-i18n="restart"/.test(html) && /data-i18n="fullscreen"/.test(html),
    'restart/fullscreen buttons lack data-i18n');
check(/data-i18n="loading"/.test(html) && /data-i18n="loadingTip"/.test(html),
    'loading overlay copy lacks data-i18n');
check(/data-i18n-title="back"/.test(html), 'back button has no translated title');
check(!/<span>Restart<\/span>/.test(html), 'catalogues/gameplay.html still hardcodes English "Restart"');
check(!/<span>Fullscreen<\/span>/.test(html), 'catalogues/gameplay.html still hardcodes English "Fullscreen"');

// 4. The back link returns to the Web Games view (all four games live there).
check(/game\.html\?category=webgames/.test(js), 'back button does not return to the webgames category');

// 5. Fullscreen: the fixed frame must drop the header offset (otherwise a dark
// strip stays above the game) and denied/duplicate requests must not spam the
// console with unhandled rejections.
check(/\.gameplay-container\.fullscreen \.game-frame-container[\s\S]{0,240}?top:\s*0/.test(html),
    'fullscreen mode keeps the header offset above the game frame');
check(/\.gameplay-container:fullscreen \.game-frame-container/.test(html),
    'native :fullscreen does not reset the frame container offset');
check(/result && result\.catch/.test(js),
    'request/exitFullscreen rejections are not swallowed');

// 6. The frame keeps the capabilities the old routes/webgame.html granted, now
// that the Web Games entries play here: in-frame fullscreen + autoplay (same
// convention as routes/mac.html) and modal dialogs.
check(/<iframe[^>]*id="gameFrame"[^>]*allow="[^"]*fullscreen/.test(html),
    'gameFrame does not allow in-frame fullscreen');
check(/<iframe[^>]*id="gameFrame"[^>]*allow="[^"]*autoplay/.test(html),
    'gameFrame does not allow autoplay');
check(/sandbox="[^"]*allow-modals/.test(html), 'gameFrame sandbox blocks alert/confirm');

// 7. Every data-i18n key on the page must exist in this page's own i18n table,
// otherwise the copy stays English in the other 7 languages.
const domKeys = [...new Set([...html.matchAll(/data-i18n(?:-title)?="([^"]+)"/g)].map((m) => m[1]))];
const missingKeys = domKeys.filter((k) => !new RegExp('(^|[\\s,{])' + k + '\\s*:').test(js));
check(!missingKeys.length, 'catalogues/gameplay.html uses unknown i18n keys: ' + missingKeys.join(', '));

// 8. The document must declare its language before any script runs.
check(/^<!DOCTYPE html>\s*<html lang="\w[\w-]*">/.test(html),
    'catalogues/gameplay.html does not declare a language on <html>');

// 9. Back/Home are divs with click handlers; they must be keyboard operable and
// keep a visible focus ring, otherwise the only way off this page is the mouse.
check(/id="backBtn"[^>]*role="button"[^>]*tabindex="0"/.test(html) && /id="homeBtn"[^>]*role="button"[^>]*tabindex="0"/.test(html),
    'gameplay back/home controls are not keyboard operable');
check(/role === 'button' && \(e\.key === 'Enter'/.test(js),
    'gameplay Enter/Space does not activate the header controls');
check(/\.header-btn:focus-visible/.test(html),
    'gameplay header buttons have no visible focus ring');

if (failures.length) {
    failures.forEach((f) => console.log('FAIL: ' + f));
    process.exit(1);
}
console.log('gameplay shell: ALL OK');
