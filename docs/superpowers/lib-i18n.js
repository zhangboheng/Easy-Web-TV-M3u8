// Shared i18n helpers for docs/superpowers/check-*.js (run with node)
//
// The game pages keep their strings in a top-level `var i18n = { en: {...}, ... }`
// object literal. Reading it must not depend on a `// ---- helpers` marker: the
// five engine pages (todos/toflash/tov86/towasm4/emulatorjs) do not have one,
// and executing the whole file to reach the table would run page code in Node.
// Every table in this repo is a literal, so brace-matching it and evaluating
// just that literal is both safe and marker-free.
const fs = require('fs');

// Locate `var|let|const i18n = { ... }` and return the plain object, or null.
function extractI18nTable(src) {
    const decl = /(?:^|\n)[ \t]*(?:var|let|const)[ \t]+i18n[ \t]*=[ \t]*\{/.exec(src);
    if (!decl) return null;
    const open = src.indexOf('{', decl.index);
    let depth = 0;
    let end = -1;
    for (let i = open; i < src.length; i++) {
        const ch = src[i];
        if (ch === '{') depth++;
        else if (ch === '}' && --depth === 0) { end = i; break; }
    }
    if (end === -1) return null;
    try {
        // The slice is a pure object literal: no page side effects run here.
        return new Function('return (' + src.slice(open, end + 1) + ')')();
    } catch (err) {
        return null;
    }
}

// Unique data-i18n / data-i18n-placeholder keys, in source order.
function collectDataI18nKeys(text) {
    const found = [];
    const re = /data-i18n(?:-placeholder)?="([^"]+)"/g;
    let m;
    while ((m = re.exec(text)) !== null) {
        if (found.indexOf(m[1]) === -1) found.push(m[1]);
    }
    return found;
}

// Keys of the `en` baseline that some locale is missing.
function localeGaps(table) {
    const base = table && table.en ? Object.keys(table.en) : [];
    return Object.keys(table || {})
        .filter((lang) => base.some((k) => !(k in table[lang])))
        .map((lang) => ({ lang: lang, keys: base.filter((k) => !(k in table[lang])) }));
}

module.exports = {
    extractI18nTable: extractI18nTable,
    collectDataI18nKeys: collectDataI18nKeys,
    localeGaps: localeGaps,
    read: (p) => fs.readFileSync(p, 'utf8')
};
