// Extract games[] from togame.js and verify mobile category (node script)
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const m = src.match(/var games = \[([\s\S]*?)\n\];/);
if (!m) { console.log('games array NOT FOUND'); process.exit(1); }
const games = eval('[' + m[1] + ']');
const mobile = games.filter((g) => g.category === 'mobile');
console.log('total games: ' + games.length + ' | mobile: ' + mobile.length);
mobile.forEach((g) => console.log('  #' + g.id + ' ' + g.name + ' -> ' + g.url));
const ids = games.map((g) => g.id);
const dup101 = ids.filter((i) => i === 101).length;
const dup102 = ids.filter((i) => i === 102).length;
console.log('id101 count: ' + dup101 + ' | id102 count: ' + dup102);
process.exit(mobile.length === 3 && dup101 === 1 && dup102 === 1 ? 0 : 1);
