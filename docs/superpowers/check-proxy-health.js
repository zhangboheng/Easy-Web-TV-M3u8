// Proxy health cache behaviour check (run with node).
// Exercises the cooldown/demotion logic without a browser by shimming
// localStorage and window.
const fs = require('fs');
const path = require('path');

// Resolve from this file so the check also runs on CI (and any other machine).
const repoRoot = path.resolve(__dirname, '..', '..');

let ok = true;
function check(cond, msg) {
  if (!cond) { console.log('FAIL: ' + msg); ok = false; }
}

// --- minimal browser shims --------------------------------------------------
const store = {};
const localStorageShim = {
  getItem: function(k) { return Object.prototype.hasOwnProperty.call(store, k) ? store[k] : null; },
  setItem: function(k, v) { store[k] = String(v); },
  removeItem: function(k) { delete store[k]; }
};
global.window = { localStorage: localStorageShim, fetch: function() { return Promise.resolve({ ok: true }); } };
global.localStorage = localStorageShim;

// Load proxy-config.js as a CommonJS module (it exports ProxyConfig).
const mod = require(path.join(repoRoot, 'js', 'proxy-config.js'));
const ProxyConfig = mod.ProxyConfig;
const BUILTIN_PROXIES = mod.BUILTIN_PROXIES;

// --- 1. pool ordering -------------------------------------------------------
check(BUILTIN_PROXIES.length === 4, 'pool must hold 4 proxies, found ' + BUILTIN_PROXIES.length);
check(BUILTIN_PROXIES[0].indexOf('corsmirror') !== -1, 'corsmirror must be first');
check(BUILTIN_PROXIES[1].indexOf('proxy.corsfix.com') !== -1, 'corsfix must be second');
check(BUILTIN_PROXIES.indexOf('https://api.codetabs.com/v1/proxy/?quest=') === -1, 'codetabs must be removed');

// --- 2. a fresh pool is in declared order -----------------------------------
ProxyConfig.clearHealth();
let pool = ProxyConfig.getProxies();
check(pool.join('|') === BUILTIN_PROXIES.join('|'), 'clean pool must keep declared order');

// --- 3. a failing proxy is demoted -----------------------------------------
// getProxies() compares against the real clock, so anchor the timestamps to now.
const t0 = Date.now();
ProxyConfig.reportFailure(BUILTIN_PROXIES[0], t0);
check(ProxyConfig.isCoolingDown(BUILTIN_PROXIES[0], t0 + 1000) === true, 'failed proxy must cool down');
pool = ProxyConfig.getProxies();
check(pool[pool.length - 1] === BUILTIN_PROXIES[0], 'cooling proxy must move to the end, got ' + pool[pool.length - 1]);

// --- 4. cooldown expires ---------------------------------------------------
check(ProxyConfig.isCoolingDown(BUILTIN_PROXIES[0], t0 + 61 * 1000) === false, 'cooldown must expire after 60s');

// --- 5. cooldown escalates with repeat failures ----------------------------
ProxyConfig.clearHealth();
ProxyConfig.reportFailure(BUILTIN_PROXIES[1], t0);
let h = ProxyConfig.getHealth(t0)[0];
const first = h.remainingMs;
ProxyConfig.reportFailure(BUILTIN_PROXIES[1], t0 + 10 * 1000); // outside dedupe window
h = ProxyConfig.getHealth(t0 + 10 * 1000)[0];
check(h.fails === 2, 'failure count must escalate, got ' + h.fails);
check(h.remainingMs > first, 'second cooldown must be longer (' + h.remainingMs + ' > ' + first + ')');

// --- 6. duplicate reports inside the dedupe window are ignored -------------
ProxyConfig.clearHealth();
ProxyConfig.reportFailure(BUILTIN_PROXIES[2], t0);
ProxyConfig.reportFailure(BUILTIN_PROXIES[2], t0 + 500); // same failure, reported twice
check(ProxyConfig.getHealth(t0 + 500)[0].fails === 1, 'duplicate report must not double count');

// --- 7. success clears the record ------------------------------------------
ProxyConfig.reportSuccess(BUILTIN_PROXIES[2]);
check(ProxyConfig.isCoolingDown(BUILTIN_PROXIES[2], t0 + 600) === false, 'success must clear the cooldown');

// --- 8. binary corruption gets the long cooldown ---------------------------
ProxyConfig.clearHealth();
ProxyConfig.reportCorruption(BUILTIN_PROXIES[0], t0);
h = ProxyConfig.getHealth(t0)[0];
check(h.coolingDown === true, 'corruption must cool the proxy down');
check(h.remainingMs === 30 * 60 * 1000, 'corruption cooldown must be 30min, got ' + h.remainingMs);

// --- 9. corruption is attributed to the proxy named in the fetched URL ------
// The download scripts pass the URL they actually fetched, so attribution is
// per request instead of "whichever proxied fetch started last".
ProxyConfig.clearHealth();
const proxied3 = BUILTIN_PROXIES[3] + encodeURIComponent('https://example.com/a.iso');
const matchedProxy = ProxyConfig.reportCorruptionFor(proxied3);
check(matchedProxy === BUILTIN_PROXIES[3],
      'reportCorruptionFor must return the matched proxy, got ' + matchedProxy);
check(ProxyConfig.isCoolingDown(BUILTIN_PROXIES[3], Date.now()) === true,
      'the matched proxy must cool down');

// A direct URL cannot be blamed on any proxy.
ProxyConfig.clearHealth();
check(ProxyConfig.reportCorruptionFor('https://example.com/b.iso') === null,
      'a direct URL must not match a proxy');
check(ProxyConfig.getHealth().length === 0, 'a direct URL must record nothing');
check(ProxyConfig.reportCorruptionFor('') === null, 'an empty target must be ignored');
check(ProxyConfig.reportCorruptionFor(null) === null, 'a missing target must be ignored');

// --- 9b. interleaved downloads blame their own proxy ----------------------
// Regression for the old single-slot `_lastProxyUrl`, which blamed whatever
// request started last and could not tell concurrent downloads apart.
ProxyConfig.clearHealth();
ProxyConfig.reportCorruptionFor(BUILTIN_PROXIES[0] + encodeURIComponent('https://example.com/x'));
ProxyConfig.reportCorruptionFor(BUILTIN_PROXIES[1] + encodeURIComponent('https://example.com/y'));
const blamed = ProxyConfig.getHealth().map(function (h) { return h.url; }).sort();
check(blamed.length === 2, 'both interleaved downloads must be recorded, got ' + blamed.length);
check(blamed.indexOf(BUILTIN_PROXIES[0]) !== -1 && blamed.indexOf(BUILTIN_PROXIES[1]) !== -1,
      'each interleaved download must blame its own proxy');
check(ProxyConfig.getProxies().slice(-2).sort().join('|') ===
      [BUILTIN_PROXIES[0], BUILTIN_PROXIES[1]].sort().join('|'),
      'both blamed proxies must be demoted');

// --- 10. custom proxies still take priority when healthy -------------------
ProxyConfig.clearHealth();
localStorageShim.setItem(ProxyConfig.KEY, JSON.stringify([
  { id: 'custom-1', name: 'Mine', url: 'https://my.example/?u=', enabled: true }
]));
pool = ProxyConfig.getProxies();
check(pool[0] === 'https://my.example/?u=', 'enabled custom proxy must come first, got ' + pool[0]);
check(pool.length === 5, 'pool must hold 4 built-ins + 1 custom, got ' + pool.length);

// --- 11. consumers must not snapshot the pool at script load ---------------
// Regression for BUG #1/#2: every consumer used to do
//   var corsProxies = (typeof ProxyConfig !== 'undefined') ? ProxyConfig.getProxies() : [];
// once at load time, so health-cache demotions (and proxies the user added in
// Settings) never reached the running page.
const CONSUMER_FILES = [
  'js/apiproxy.js',
  'js/podcast.js',
  'js/todos.js',
  'js/toflash.js',
  'js/tov86.js',
  'js/towasm4.js',
  'js/emulatorjs.js'
];
const SNAPSHOT_AT_LOAD = /^\s*(?:var\s+)?(?:corsProxies|proxyList)\s*=\s*\(typeof ProxyConfig/m;

CONSUMER_FILES.forEach(function (rel) {
  const src = fs.readFileSync(path.join(repoRoot, rel), 'utf8');
  check(!SNAPSHOT_AT_LOAD.test(src),
        rel + ' must not snapshot ProxyConfig.getProxies() at load time');
  check(/function\s+getProxyPool\s*\(\s*\)/.test(src),
        rel + ' must define a getProxyPool() helper');
});

// --- 12. getProxyPool() must observe the live health order -----------------
// Extract the real helper from each file and call it, so this asserts behaviour
// rather than just the presence of a function name.
localStorageShim.setItem(ProxyConfig.KEY, '[]'); // drop the custom proxy from test 10
CONSUMER_FILES.forEach(function (rel) {
  const src = fs.readFileSync(path.join(repoRoot, rel), 'utf8');
  const m = src.match(/function\s+getProxyPool\s*\(\s*\)\s*\{[\s\S]*?\n\}/);
  check(!!m, rel + ' getProxyPool() body must be extractable');
  if (!m) return;
  const getProxyPool = new Function('ProxyConfig', m[0] + '; return getProxyPool;')(ProxyConfig);

  ProxyConfig.clearHealth();
  check(getProxyPool().join('|') === BUILTIN_PROXIES.join('|'),
        rel + ' getProxyPool() must start from the clean pool');

  ProxyConfig.reportFailure(BUILTIN_PROXIES[0], Date.now());
  const demoted = getProxyPool();
  check(demoted[demoted.length - 1] === BUILTIN_PROXIES[0],
        rel + ' getProxyPool() must see the demoted proxy without a reload');
});

// --- 13. failover recursion must reuse the pool it started with ------------
// The index-based retry chain would skip or repeat proxies if the array were
// re-read mid-chain, so each loop threads the snapshot into its recursive call.
['js/todos.js', 'js/toflash.js', 'js/emulatorjs.js'].forEach(function (rel) {
  const src = fs.readFileSync(path.join(repoRoot, rel), 'utf8');
  check(/directTried,\s*corsProxies\)/.test(src),
        rel + ' must pass its proxy snapshot into the recursive failover call');
});

// --- 14. a corruption record survives a later success ----------------------
// corsmirror answers JSON with 200 but still mangles binary bodies, so a later
// successful JSON call must not re-enable it for downloads.
ProxyConfig.clearHealth();
ProxyConfig.reportCorruption(BUILTIN_PROXIES[0], Date.now());
ProxyConfig.reportSuccess(BUILTIN_PROXIES[0]);
check(ProxyConfig.isCoolingDown(BUILTIN_PROXIES[0], Date.now()) === true,
      'a later success must not clear a corruption record');
pool = ProxyConfig.getProxies();
check(pool[pool.length - 1] === BUILTIN_PROXIES[0],
      'a corrupt proxy must stay demoted after an unrelated success');

// --- 15. only proxy-side statuses may demote a proxy ----------------------
// 404/400 are the target's own answer relayed verbatim by the proxy; 403/429/5xx
// point at the proxy itself.
check(ProxyConfig.isProxyFault(403) === true, '403 must count as a proxy fault');
check(ProxyConfig.isProxyFault(429) === true, '429 must count as a proxy fault');
check(ProxyConfig.isProxyFault(500) === true, '5xx must count as a proxy fault');
check(ProxyConfig.isProxyFault(503) === true, '503 must count as a proxy fault');
check(ProxyConfig.isProxyFault(404) === false, '404 is the target answering, not the proxy');
check(ProxyConfig.isProxyFault(400) === false, '400 is the target answering, not the proxy');
check(ProxyConfig.isProxyFault(0) === false, 'an opaque/0 status must not demote a proxy');

// --- 16. a plain failure must not erase the corruption verdict -------------
// A corruption record is strong evidence (a decoded body was mangled); a later
// 503/timeout is weaker. Overwriting the record used to drop `corrupt` and
// shorten the 30min cooldown, so the next successful JSON call re-enabled a
// proxy that wrecks downloads.
ProxyConfig.clearHealth();
const t16 = Date.now();
ProxyConfig.reportCorruption(BUILTIN_PROXIES[2], t16);
const corruptRec = ProxyConfig.getHealth(t16).filter((h) => h.url === BUILTIN_PROXIES[2])[0];
ProxyConfig.reportFailure(BUILTIN_PROXIES[2], t16 + 5000);
const afterFail = ProxyConfig.getHealth(t16 + 5000).filter((h) => h.url === BUILTIN_PROXIES[2])[0];
check(afterFail && afterFail.coolingDown === true,
      'a corruption record must stay in cooldown after a later plain failure');
check(afterFail && corruptRec && afterFail.remainingMs >= corruptRec.remainingMs - 5000,
      'a plain failure must not shorten a corruption cooldown (' +
      (afterFail && Math.round(afterFail.remainingMs / 60000)) + 'min left)');
ProxyConfig.reportSuccess(BUILTIN_PROXIES[2]);
check(ProxyConfig.isCoolingDown(BUILTIN_PROXIES[2], t16 + 6000) === true,
      'a success after that plain failure must still not clear the corruption record');

console.log('proxy health cache check: ' + (ok ? 'ALL OK' : 'FAIL'));
process.exit(ok ? 0 : 1);
