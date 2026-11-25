// Verify the application version is consistent everywhere (v8.6.2).
// Usage: node scripts/checks/check-version.js
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

const versionJs = read('js/version.js');
const versionMatch = versionJs.match(/window\.EWTV_VERSION\s*=\s*'([^']+)'/);
if (!versionMatch) {
    console.log('FAIL: cannot read version from js/version.js');
    process.exit(1);
}
const version = versionMatch[1];
const failures = [];
// js/version.js is the single source of truth: compare every other copy to it
// instead of pinning the release number here, or the next bump would require
// editing this check as well.
function expect(label, actual) {
    if (actual !== version) failures.push(label + ' has ' + actual + ', expected ' + version);
}

expect('README badge', (read('README.md').match(/badge\/version-([0-9.]+)-green/) || [])[1]);
expect('index.html version span', (read('index.html').match(/<span id="app-version">([^<]+)<\/span>/) || [])[1]);
expect('manifest.json', JSON.parse(read('manifest.json')).version);
expect('sw.js CACHE_NAME', (read('sw.js').match(/CACHE_NAME = 'easy-web-tv-v([^']+)'/) || [])[1]);
expect('js/index.js @version', (read('js/index.js').match(/@version ([0-9.]+)/) || [])[1]);
expect('js/index.js backup fallback', (read('js/index.js').match(/window\.EWTV_VERSION \|\| '([0-9.]+)'/) || [])[1]);

// A version bump changes same-origin JS under unchanged filenames. The SW must
// bypass the browser HTTP cache or a stale helper/page script can survive the
// new cache install and break the just-upgraded game route.
const swSource = read('sw.js');
if (!/new Request\(event\.request,\s*\{\s*cache:\s*'reload'\s*\}\)/.test(swSource)) {
    failures.push('sw.js must bypass browser HTTP cache for same-origin assets on version bumps');
}
if (!/fetch\(networkRequest\)/.test(swSource)) {
    failures.push('sw.js must fetch the cache-busting networkRequest');
}

// The isolated player routes return before the normal network-first branch.
// They must use the same cache-busting request or an upgrade can keep serving
// the previous route HTML/JS from the browser HTTP cache.
const isoStart = swSource.indexOf('ISO_PATHS');
const isoEnd = swSource.indexOf('// Cache game card images', isoStart);
const isoBlock = isoStart === -1 || isoEnd === -1 ? '' : swSource.slice(isoStart, isoEnd);
if (!/fetch\(networkRequest\)/.test(isoBlock)) {
    failures.push('sw.js isolated routes must fetch the cache-busting networkRequest');
}
if (swSource.indexOf('const networkRequest') === -1 ||
    swSource.indexOf('const networkRequest') > isoStart) {
    failures.push('sw.js must declare networkRequest before the isolated-route branch');
}
const bypassEnd = swSource.indexOf('// Hot-linked proxy', swSource.indexOf('const networkRequest'));
const bypassBlock = swSource.indexOf('const networkRequest') === -1 || bypassEnd === -1
    ? ''
    : swSource.slice(swSource.indexOf('const networkRequest'), bypassEnd);
if (!/headers\.get\(['"]range['"]\)/.test(bypassBlock) || !/destination/.test(bypassBlock)) {
    failures.push('sw.js must limit cache:reload to document/script/style/worker requests without Range');
}

// The settings version history is user-visible; a release that only bumps the
// version strings leaves the changelog one release behind.
const indexSource = read('js/index.js');
if (!new RegExp('\\[\\d{4}-\\d{2}-\\d{2}\\] V' + version.replace(/\./g, '\\.') + '\\b').test(indexSource)) {
    failures.push('js/index.js version history has no V' + version + ' entry');
}

if (failures.length) {
    failures.forEach((f) => console.log('FAIL: ' + f));
    process.exit(1);
}
console.log('version ' + version + ' consistent across 7 files | ALL OK');
