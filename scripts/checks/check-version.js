// Verify the application version is consistent everywhere (v8.6.1).
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
function expect(label, actual) {
    if (actual !== version) failures.push(label + ' has ' + actual + ', expected ' + version);
}

expect('README badge', (read('README.md').match(/badge\/version-([0-9.]+)-green/) || [])[1]);
expect('index.html version span', (read('index.html').match(/<span id="app-version">([^<]+)<\/span>/) || [])[1]);
expect('manifest.json', JSON.parse(read('manifest.json')).version);
expect('sw.js CACHE_NAME', (read('sw.js').match(/CACHE_NAME = 'easy-web-tv-v([^']+)'/) || [])[1]);
expect('js/index.js @version', (read('js/index.js').match(/@version ([0-9.]+)/) || [])[1]);
expect('js/index.js backup fallback', (read('js/index.js').match(/window\.EWTV_VERSION \|\| '([0-9.]+)'/) || [])[1]);

if (failures.length) {
    failures.forEach((f) => console.log('FAIL: ' + f));
    process.exit(1);
}
console.log('version ' + version + ' consistent across 7 files | ALL OK');
