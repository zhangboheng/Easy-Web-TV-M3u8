// Run every i18n page pair listed in i18n-pairs.json (v8.6.0).
// Usage: node scripts/checks/check-i18n-all.js
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const dir = __dirname;
const root = path.resolve(dir, '..', '..');
const pairs = JSON.parse(fs.readFileSync(path.join(dir, 'i18n-pairs.json'), 'utf8'));

if (!Array.isArray(pairs) || pairs.length < 24) {
    console.log('FAIL: i18n-pairs.json must contain at least 24 pairs, found ' + (pairs.length || 0));
    process.exit(1);
}

let failed = 0;
pairs.forEach((pair) => {
    if (!Array.isArray(pair) || pair.length !== 2) {
        console.log('FAIL: malformed pair ' + JSON.stringify(pair));
        failed++;
        return;
    }
    const [js, html] = pair;
    if (!fs.existsSync(path.join(root, js))) {
        console.log('FAIL: missing ' + js);
        failed++;
        return;
    }
    if (!fs.existsSync(path.join(root, html))) {
        console.log('FAIL: missing ' + html);
        failed++;
        return;
    }
    const result = spawnSync(process.execPath, [path.join(dir, 'check-i18n.js'), js, html], {
        cwd: root, encoding: 'utf8'
    });
    if (result.status !== 0) {
        console.log('FAIL: ' + js + ' / ' + html);
        process.stdout.write(result.stdout || '');
        process.stderr.write(result.stderr || '');
        failed++;
    }
});

if (failed) {
    console.log(failed + ' of ' + pairs.length + ' i18n pairs FAILED');
    process.exit(1);
}
console.log(pairs.length + ' i18n pairs | ALL OK');
