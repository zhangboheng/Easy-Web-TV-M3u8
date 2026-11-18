// i18n integrity check for topalm.js / towipi.js (run with node)
const fs = require('fs');
const file = process.argv[2];
const src = fs.readFileSync(file, 'utf8');
const head = src.split('// ---- helpers')[0];
const sandbox = { localStorage: { getItem: () => null } };
const run = new Function('localStorage', head + '; return i18n;');
const i18n = run(sandbox.localStorage);
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
console.log('langs: ' + langs.join(',') + ' | keys/lang: ' + keys.length + ' | ' + (ok ? 'ALL OK' : 'FAIL'));
process.exit(ok ? 0 : 1);
