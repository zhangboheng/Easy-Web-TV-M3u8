// i18n integrity check for topalm.js / towipi.js (run with node)
// Usage: node check-i18n.js js/topalm.js [routes/palm.html]
// 1) every language in the i18n object must have the same key set as i18n.en
// 2) with an HTML argument: every data-i18n key used in the HTML must exist
//    in the JS i18n object (a missing key renders as raw key text); JS keys
//    unused by data-i18n are listed as INFO because they may be used via t().
const fs = require('fs');
const file = process.argv[2];
const htmlFile = process.argv[3];
const src = fs.readFileSync(file, 'utf8');
const head = src.split('// ---- helpers')[0];
const sandbox = { localStorage: { getItem: () => null }, window: { location: { search: '' } } };
const run = new Function('localStorage', 'window', head + '; return i18n;');
const i18n = run(sandbox.localStorage, sandbox.window);
const langs = Object.keys(i18n);
const keys = Object.keys(i18n.en);
let ok = true;
langs.forEach((l) => {
  if (Object.keys(i18n[l]).length !== keys.length) {
    console.log('KEY COUNT MISMATCH in ' + l + ' (' + Object.keys(i18n[l]).length + ' vs ' + keys.length + ')');
    ok = false;
  }
  keys.forEach((k) => {
    if (!(k in i18n[l])) {
      console.log('MISSING ' + l + '.' + k);
      ok = false;
    }
  });
});
if (htmlFile) {
  const html = fs.readFileSync(htmlFile, 'utf8');
  const used = new Set();
  const re = /data-i18n="([^"]+)"/g;
  let m;
  while ((m = re.exec(html)) !== null) used.add(m[1]);
  used.forEach((k) => {
    if (!keys.includes(k)) {
      console.log('HTML USES UNKNOWN KEY: ' + k);
      ok = false;
    }
  });
  const unused = keys.filter((k) => !used.has(k));
  if (unused.length) console.log('INFO js-only keys (used via t()): ' + unused.join(', '));
  console.log('html keys: ' + used.size + ' checked against ' + keys.length + ' js keys');
}
console.log('langs: ' + langs.join(',') + ' | keys/lang: ' + keys.length + ' | ' + (ok ? 'ALL OK' : 'FAIL'));
process.exit(ok ? 0 : 1);
