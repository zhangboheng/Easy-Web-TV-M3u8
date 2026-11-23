// i18n integrity check for the per-page i18n tables (run with node)
// Usage: node check-i18n.js js/topalm.js [routes/palm.html]
// 1) every language in the i18n object must have the same key set as i18n.en
// 2) with an HTML argument: every data-i18n key used in the HTML, and every one
//    the page script builds into a template, must exist in the i18n object
//    (a missing key renders as raw key text); JS keys unused by data-i18n are
//    listed as INFO because they may be used via t().
//
// The table is located by brace-matching the `i18n` literal (lib-i18n.js), so
// this works for the engine pages too - they have no `// ---- helpers` marker
// and used to be skipped entirely by CI.
const fs = require('fs');
const i18nLib = require('./lib-i18n.js');

const file = process.argv[2];
const htmlFile = process.argv[3];
if (!file) {
  console.log('usage: node check-i18n.js <page.js> [page.html]');
  process.exit(2);
}
const src = fs.readFileSync(file, 'utf8');
const i18n = i18nLib.extractI18nTable(src);
if (!i18n || !i18n.en) {
  console.log('FAIL cannot locate an `i18n = { ... }` table with an en baseline in ' + file);
  process.exit(1);
}
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
  const used = new Set(i18nLib.collectDataI18nKeys(html));
  used.forEach((k) => {
    if (!keys.includes(k)) {
      console.log('HTML USES UNKNOWN KEY: ' + htmlFile + ' -> ' + k);
      ok = false;
    }
  });
  // Templates in the page script can emit data-i18n attributes too; a key
  // missing there is just as visible ("noGamepad" leaked that way).
  const inJs = new Set(i18nLib.collectDataI18nKeys(src));
  inJs.forEach((k) => {
    if (!keys.includes(k)) {
      console.log('JS TEMPLATE USES UNKNOWN KEY: ' + file + ' -> ' + k);
      ok = false;
    }
  });
  const unused = keys.filter((k) => !used.has(k) && !inJs.has(k));
  if (unused.length) console.log('INFO js-only keys (used via t()): ' + unused.join(', '));
  console.log('html keys: ' + used.size + ' | js-template keys: ' + inJs.size + ' checked against ' + keys.length + ' js keys');
}
console.log('langs: ' + langs.join(',') + ' | keys/lang: ' + keys.length + ' | ' + (ok ? 'ALL OK' : 'FAIL'));
process.exit(ok ? 0 : 1);
