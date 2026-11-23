// Guard the shared hot-link player helper (v8.6.0).
// Usage: node scripts/checks/check-hotlink-player.js
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const failures = [];
function check(cond, msg) { if (!cond) failures.push(msg); }

const helper = read('js/hotlink-player.js');
check(/ensureIsolated/.test(helper), 'hotlink-player.js must define ensureIsolated');
check(/window\.HotlinkPlayer/.test(helper), 'hotlink-player.js must expose window.HotlinkPlayer');

// Pages that need cross-origin isolation must use the shared helper.
const isolated = {
    'js/tomac.js': 'routes/mac.html',
    'js/ton64recomp.js': 'routes/n64recomp.html',
    'js/tops2.js': 'routes/ps2.html',
    'js/torustpal.js': 'routes/rustpal.html',
    'js/tovita.js': 'routes/vita.html'
};
Object.keys(isolated).forEach((js) => {
    const src = read(js);
    check(/HotlinkPlayer\.ensureIsolated\(/.test(src), js + ' does not call HotlinkPlayer.ensureIsolated');
    check(!/function ensureIsolation/.test(src), js + ' still has an inline isolation block');
    const html = read(isolated[js]);
    const helperPos = html.indexOf('js/hotlink-player.js');
    const pagePos = html.indexOf(js.replace('js/', 'js/'));
    check(helperPos !== -1, isolated[js] + ' does not load hotlink-player.js');
    check(helperPos !== -1 && pagePos !== -1 && helperPos < pagePos,
        isolated[js] + ' must load hotlink-player.js before ' + js);
});

// Any other page that still references crossOriginIsolated must also migrate.
const jsDir = path.join(root, 'js');
fs.readdirSync(jsDir).filter((f) => f.endsWith('.js') && f !== 'hotlink-player.js').forEach((f) => {
    if (isolated['js/' + f]) return;
    const src = read('js/' + f);
    if (/crossOriginIsolated/.test(src)) {
        check(/HotlinkPlayer\.ensureIsolated\(/.test(src),
            'js/' + f + ' uses crossOriginIsolated without the shared helper');
    }
});

if (failures.length) {
    failures.forEach((f) => console.log('FAIL: ' + f));
    process.exit(1);
}
console.log('hotlink player helper: ALL OK');
