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

// The shared player owns the slow-load/failure UX for every iframe route.
check(/function createPlayer\(/.test(helper), 'hotlink-player.js must define createPlayer');
check(/\bcreatePlayer\s*:\s*createPlayer\b/.test(helper), 'HotlinkPlayer must export createPlayer');
check(/return\s*\{[\s\S]*\bstart\s*[\s\S]*\bstop\s*[\s\S]*\bretry\s*/.test(helper),
    'createPlayer must return start/stop/retry controls');
['zh', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru'].forEach((lang) => {
    check(new RegExp('\\b' + lang + '\\s*:\\s*\\{').test(helper),
        'shared hotlink copy is missing language ' + lang);
});
['loadingSlow', 'upstreamUnavailable', 'retry', 'openInNewTab', 'upstreamHint'].forEach((key) => {
    check(new RegExp('\\b' + key + '\\s*:').test(helper), 'shared hotlink copy is missing ' + key);
});
check(/15000/.test(helper), 'shared hotlink player must surface the slow-load hint at 15s');
check(/30000/.test(helper), 'shared hotlink player must surface stalled upstream state at 30s');
check(/hotlinkRetry/.test(helper), 'shared hotlink player must create a retry control');
check(/hotlinkNewTab/.test(helper), 'shared hotlink player must create an official-page link');
check(/addEventListener\(['"]load['"]/.test(helper), 'shared hotlink player must listen for iframe load');
check(/about:blank/.test(helper), 'shared hotlink player must clear stopped iframes');
check(!/(TAMAWEB_HOME|WEBGAME_BASE|MAC_EMBED_URL|RUSTPAL_BASE)/.test(helper),
    'shared hotlink player must not hardcode any page-specific URL');



// Every iframe-driven game route is declared in one manifest, so adding or
// removing a hot-linked page cannot silently escape the checks below.
const manifestRel = 'scripts/checks/hotlink-pages.json';
const manifestPath = path.join(root, manifestRel);
check(fs.existsSync(manifestPath), 'missing ' + manifestRel + ' hotlink page manifest');
const pages = fs.existsSync(manifestPath) ? JSON.parse(read(manifestRel)) : [];
if (Array.isArray(pages)) {
    const iframeRoutes = fs.readdirSync(path.join(root, 'routes'))
        .filter((f) => f.endsWith('.html'))
        .filter((f) => /<iframe\b/.test(read('routes/' + f)))
        .map((f) => 'routes/' + f)
        .sort();
    const manifestRoutes = pages.map((p) => p.route).sort();
    check(JSON.stringify(iframeRoutes) === JSON.stringify(manifestRoutes),
        'hotlink manifest routes must equal iframe routes: ' + JSON.stringify({ iframeRoutes, manifestRoutes }));

    const seen = new Set();
    pages.forEach((p) => {
        ['route', 'script', 'frameId', 'overlayId', 'resolver', 'newTabResolver', 'isolated'].forEach((key) => {
            check(Object.prototype.hasOwnProperty.call(p, key),
                (p.route || '<unknown>') + ' manifest entry is missing ' + key);
        });
        if (seen.has(p.route)) check(false, 'duplicate manifest route ' + p.route);
        seen.add(p.route);
        check(fs.existsSync(path.join(root, p.script)), p.route + ' script does not exist: ' + p.script);
        const html = read(p.route);
        const src = read(p.script);
        check(html.indexOf('id="' + p.frameId + '"') !== -1,
            p.route + ' is missing iframe id ' + p.frameId);
        check(html.indexOf('id="' + p.overlayId + '"') !== -1,
            p.route + ' is missing overlay id ' + p.overlayId);
        check(src.indexOf(p.frameId) !== -1,
            p.script + ' does not reference frame id ' + p.frameId);
        [p.resolver, p.newTabResolver].forEach((resolver) => {
            check(resolver && typeof resolver.name === 'string' && resolver.name.length > 0,
                p.route + ' resolver must name a URL constant or registry');
            if (!resolver || !resolver.name) return;
            const declared = new RegExp('\\bvar\\s+' + resolver.name + '\\s*=');
            check(declared.test(src), p.script + ' does not declare resolver ' + resolver.name);
            if (resolver.type === 'const' || resolver.type === 'prefix') {
                check(new RegExp('\\bvar\\s+' + resolver.name + "\\s*=\\s*'https://").test(src),
                    resolver.name + ' must be a literal https:// URL in ' + p.script);
            }
        });
        if (p.isolated) {
            check(/HotlinkPlayer\.ensureIsolated\(/.test(src),
                p.script + ' is marked isolated but does not call ensureIsolated');
        }
    });
}

// Every manifest page must delegate its iframe lifecycle to the shared player.
pages.forEach((p) => {
    const html = read(p.route);
    const src = read(p.script);
    const helperPos = html.indexOf('js/hotlink-player.js');
    const pagePos = html.indexOf(p.script.replace('js/', '../js/'));
    check(helperPos !== -1 && pagePos !== -1 && helperPos < pagePos,
        p.route + ' must load hotlink-player.js before ' + p.script);
    check(/HotlinkPlayer\.createPlayer\(/.test(src), p.script + ' does not call HotlinkPlayer.createPlayer');
    check(new RegExp("frameId\\s*:\\s*['\"]" + p.frameId + "['\"]").test(src),
        p.script + ' createPlayer must target iframe ' + p.frameId);
    check(!/\bvar\s+slowTimer\b|slowTimer\s*=\s*setTimeout/.test(src),
        p.script + ' still owns a slow-load timer');
    check(!/function\s+showSlowLink\s*\(/.test(src), p.script + ' still owns a slow-open link');
    check(!/addEventListener\(\s*['"]load['"]\s*,\s*hideOverlay/.test(src),
        p.script + ' still owns an iframe load handler');
    check(!/setTimeout\(\s*hideOverlay/.test(src), p.script + ' still uses a timed overlay hide');
});
const stylesheet = read('css/style.css');
check(/\.hotlink-retry\b/.test(stylesheet), 'css/style.css is missing .hotlink-retry styles');
check(/\.hotlink-fallback-link\b/.test(stylesheet), 'css/style.css is missing .hotlink-fallback-link styles');


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
