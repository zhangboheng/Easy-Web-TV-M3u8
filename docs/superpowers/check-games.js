// Extract games[] from togame.js and verify mobile category + id uniqueness (node script)
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const m = src.match(/var games = \[([\s\S]*?)\n\];/);
if (!m) { console.log('games array NOT FOUND'); process.exit(1); }
const games = eval('[' + m[1] + ']');
const mobile = games.filter((g) => g.category === 'mobile');
console.log('total games: ' + games.length + ' | mobile: ' + mobile.length);
mobile.forEach((g) => console.log('  #' + g.id + ' ' + g.name + ' -> ' + g.url));
const dup101 = games.filter((g) => g.id === 101).length;
const dup102 = games.filter((g) => g.id === 102).length;
console.log('id101 count: ' + dup101 + ' | id102 count: ' + dup102);
// Global id uniqueness check - duplicates corrupt favorites and Continue
// Playing: findGameById returns the first match, so the shadowed entry is
// unreachable and both cards mirror one shared favorite/recent state.
const counts = {};
games.forEach((g) => { counts[g.id] = (counts[g.id] || 0) + 1; });
const dupes = Object.keys(counts).filter((k) => counts[k] > 1);
if (dupes.length) console.log('DUPLICATE IDS: ' + dupes.map((k) => k + ' x' + counts[k]).join(', '));
const ok = mobile.length === 3 && dup101 === 1 && dup102 === 1 && dupes.length === 0;
console.log(ok ? 'ALL OK' : 'FAIL');
process.exit(ok ? 0 : 1);
