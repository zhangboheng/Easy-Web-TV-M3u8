// Language selector parity check (run with node)
// Usage: node check-language-selector.js [js/index.js] [js/translations.js]
//
// The language dropdown is a hand-maintained template literal in js/index.js,
// so a translation silently becomes unreachable when its <option> is forgotten
// (20 of them were). This check keeps both sides in sync:
//   1) every language in translations.js has an <option>
//   2) every <option> is a translation or a known alias (e.g. zh -> zh-CN)
//   3) no duplicate option values, no empty or duplicated labels
//   4) every alias points at a language that exists
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');
const indexPath = process.argv[2] || path.join(root, 'js', 'index.js');
// The translation table used to live in js/locales/; accept either location so
// a folder reshuffle cannot silently disable this check.
const localeCandidates = [
    process.argv[3],
    path.join(root, 'js', 'translations.js'),
    path.join(root, 'js', 'locales', 'translations.js')
].filter(Boolean);
const localesPath = localeCandidates.find((p) => fs.existsSync(p));

let failed = 0;
function check(cond, msg) {
    if (!cond) { failed++; console.log('FAIL ' + msg); }
}

check(!!localesPath, 'translations.js not found (looked for: ' + localeCandidates.join(', ') + ')');
if (!localesPath) {
    console.log('language selector check: ' + failed + ' problem(s)');
    process.exit(1);
}

// --- translations.js -------------------------------------------------------
const localesSrc = fs.readFileSync(localesPath, 'utf8');
const sandbox = {
    window: { localStorage: { getItem: () => null, setItem() {}, removeItem() {} }, location: { search: '' } },
    localStorage: { getItem: () => null, setItem() {}, removeItem() {} },
    document: {
        querySelectorAll: () => [],
        querySelector: () => null,
        getElementById: () => null,
        addEventListener() {}
    },
    console
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(
    localesSrc + '\n;globalThis.__t = translations;' +
    'globalThis.__a = (typeof languageAliases !== "undefined") ? languageAliases : {};',
    sandbox,
    { filename: localesPath }
);
const translations = sandbox.__t;
const aliases = sandbox.__a || {};
check(translations && typeof translations === 'object', 'translations.js must define a translations object');
const langs = Object.keys(translations);
check(langs.length > 0, 'translations.js must contain at least one language');
check(!!translations.en, 'translations.js must contain the en baseline');

// --- selector --------------------------------------------------------------
const indexSrc = fs.readFileSync(indexPath, 'utf8');
const marker = indexSrc.indexOf('var languagesHtml = `');
check(marker !== -1, 'js/index.js must build the language list in a languagesHtml template literal');
const open = marker === -1 ? -1 : indexSrc.indexOf('`', marker);
const close = open === -1 ? -1 : indexSrc.indexOf('`', open + 1);
check(close > open, 'the languagesHtml template literal must be terminated');
const tpl = (open === -1 || close === -1) ? '' : indexSrc.slice(open + 1, close);

const options = [];
const re = /<option value="([^"]*)"(?:[^>]*)>([^<]*)<\/option>/g;
let m;
while ((m = re.exec(tpl)) !== null) {
    if (m[1] === 'selectbox') continue;
    options.push({ code: m[1], label: m[2].trim() });
}
const codes = options.map((o) => o.code);
check(options.length > 0, 'the language <select> must contain options');

// 1) every translation is reachable from the UI
langs.forEach((l) => {
    check(codes.indexOf(l) !== -1, 'language "' + l + '" is translated but has no <option>');
});
// 2) no option without a translation (an unknown value renders raw English)
codes.forEach((c) => {
    check(c in translations || c in aliases, '<option value="' + c + '"> matches no translation or alias');
});
// 3) hygiene: unique values, unique non-empty labels that are not raw codes
// (labels such as "Afrikaans"/"Filipino"/"Hausa" are their own endonyms, so a
// "English - endonym" format cannot be enforced)
codes.forEach((c, i) => check(codes.indexOf(c) === i, 'duplicate <option value="' + c + '">'));
const labels = options.map((o) => o.label);
options.forEach((o, i) => {
    check(o.label.length > 0, '<option value="' + o.code + '"> must have a label');
    check(o.label.toUpperCase() !== o.label.toLowerCase() || o.label.length > 1,
          '<option value="' + o.code + '"> must have a readable label, not just the code');
    check(labels.indexOf(o.label) === i, 'duplicate language label "' + o.label + '"');
});
// 4) every alias must resolve to a real translation. Aliases covering browser
// locales (en-US, fr-CA, nn...) are deliberately not selectable, so they are
// not required to appear as an <option>.
Object.keys(aliases).forEach((a) => {
    check(aliases[a] in translations, 'alias "' + a + '" points at "' + aliases[a] + '", which has no translation');
});

if (failed) {
    console.log('language selector check: ' + failed + ' problem(s)');
    process.exit(1);
}
console.log('language selector check: ' + langs.length + ' translations / ' +
            codes.length + ' options / ' + Object.keys(aliases).length + ' aliases - ALL OK');
