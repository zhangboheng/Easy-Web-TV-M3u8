// Validate the games[] catalogue in js/togame.js (node script).
// Usage: node scripts/checks/check-games.js js/togame.js
//
// v8.6.1 rewrite. The previous version had two useless assertions:
//   - the expected mobile count was derived from the actual mobile count, so
//     comparing the two was true by construction and the mobile category was
//     never really checked (it passed even at zero cards);
//   - the id101/id102 counts were point checks for a v8.5.1 duplicate-id bug
//     already fully covered by the global uniqueness scan below.
// Both are replaced by real lower bounds plus cross-file consistency checks:
// a card can also break by pointing at a category with no tab, a missing route
// page, or a local image that no longer resolves.
const fs = require('fs');
const path = require('path');

const target = process.argv[2];
if (!target) {
    console.log('FAIL: usage: node scripts/checks/check-games.js js/togame.js');
    process.exit(1);
}
const root = path.resolve(__dirname, '..', '..');
const src = fs.readFileSync(path.resolve(root, target), 'utf8');
const gamesMatch = src.match(/var games = \[([\s\S]*?)\n\];/);
if (!gamesMatch) { console.log('games array NOT FOUND'); process.exit(1); }
const games = eval('[' + gamesMatch[1] + ']');

const failures = [];
function check(condition, message) { if (!condition) failures.push(message); }

// 1. Every card must carry the full schema - a missing field silently breaks
//    favourites, the card grid or the player route.
const REQUIRED = ['id', 'name', 'platform', 'category', 'image', 'url'];
const schemaBad = games.filter((g) => REQUIRED.some((k) => g[k] === undefined || g[k] === ''));
check(schemaBad.length === 0, 'cards missing required fields: ' + schemaBad.map((g) => g.name || g.id).join(', '));

// 2. Global id uniqueness - duplicates corrupt favorites and Continue Playing:
//    findGameById returns the first match, so the shadowed entry becomes
//    unreachable and both cards mirror one shared favorite/recent state.
const counts = {};
games.forEach((g) => { counts[g.id] = (counts[g.id] || 0) + 1; });
const dupes = Object.keys(counts).filter((k) => counts[k] > 1);
check(dupes.length === 0, 'DUPLICATE IDS: ' + dupes.map((k) => k + ' x' + counts[k]).join(', '));

// 3. Category lower bounds. These are floors, not exact counts, so adding a
//    game stays fine while deleting or miscategorising one fails loudly.
const CATEGORY_FLOORS = {
    emulator: 44, recomp: 46, webgames: 25, retropc: 4, mobile: 4, computer: 3, fantasy: 2
};
const byCategory = {};
games.forEach((g) => { byCategory[g.category] = (byCategory[g.category] || 0) + 1; });
Object.keys(CATEGORY_FLOORS).forEach((category) => {
    const n = byCategory[category] || 0;
    check(n >= CATEGORY_FLOORS[category],
        'category ' + category + ' has ' + n + ' cards, expected at least ' + CATEGORY_FLOORS[category]);
});
check(games.length >= 128, 'total cards ' + games.length + ', expected at least 128');

// 4. Every category used by a card must have a tab in routes/game.html,
//    otherwise those cards are unreachable in the Games UI.
const gameHtml = fs.readFileSync(path.join(root, 'routes/game.html'), 'utf8');
const tabs = new Set((gameHtml.match(/data-category="([a-z]+)"/g) || [])
    .map((m) => m.replace(/^data-category="/, '').replace(/"$/, '')));
const orphaned = Object.keys(byCategory).filter((c) => !tabs.has(c));
check(orphaned.length === 0, 'categories with no tab in routes/game.html: ' + orphaned.join(', '));
check(tabs.has('webgames') && tabs.has('mobile'), 'routes/game.html lost a required category tab');

// 5. Route targets must exist - a typo in url yields a card that 404s on click.
//    Guarded so a malformed card is reported by check 1 instead of crashing here.
const missingRoutes = games.filter((g) => {
    if (typeof g.url !== 'string' || !g.url) return false;
    const rel = g.url.split('?')[0].replace('..', '.');
    return !fs.existsSync(path.resolve(root, rel));
}).map((g) => g.name + ' -> ' + g.url);
check(missingRoutes.length === 0, 'cards whose route file is missing: ' + missingRoutes.join(', '));

// 6. Images are either hot-linked (verified live by check-remote-images.js) or
//    local files that must resolve from the repo root.
const badImages = games.filter((g) => {
    if (typeof g.image !== 'string' || !g.image) return false;
    if (/^https?:\/\//.test(g.image)) return false;
    return !fs.existsSync(path.resolve(root, g.image.replace('..', '.')));
}).map((g) => g.name + ' -> ' + g.image);
check(badImages.length === 0, 'cards with a local image that does not resolve: ' + badImages.join(', '));

const remoteImages = games.filter((g) => /^https?:\/\//.test(g.image)).length;
const mobile = games.filter((g) => g.category === 'mobile');
console.log('total games: ' + games.length + ' | mobile: ' + mobile.length +
    ' | webgames: ' + (byCategory.webgames || 0) +
    ' | categories: ' + Object.keys(byCategory).length +
    ' | remote images: ' + remoteImages + '/' + games.length);

if (failures.length) {
    failures.forEach((f) => console.log('FAIL: ' + f));
    console.log('FAIL');
    process.exit(1);
}
console.log('ALL OK');
process.exit(0);
