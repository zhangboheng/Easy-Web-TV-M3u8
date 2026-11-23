// Proxy configuration integrity check (run with node).
// Ensures every proxy consumer sources its pool from ProxyConfig.getProxies()
// rather than maintaining its own hard-coded list.
const fs = require('fs');

let ok = true;
function check(cond, msg) {
  if (!cond) { console.log('FAIL: ' + msg); ok = false; }
}
function read(rel) { return fs.readFileSync(rel, 'utf8'); }

const config = read('js/proxy-config.js');
check(/const BUILTIN_PROXIES\s*=\s*\[/.test(config), 'proxy-config.js must define BUILTIN_PROXIES');
check(/getProxies:\s*function/.test(config), 'ProxyConfig must expose getProxies()');
check(/getBuiltins:\s*function/.test(config), 'ProxyConfig must expose getBuiltins()');
check(/ProxyConfig\s*=\s*\{/.test(config) && /module\.exports/.test(config), 'ProxyConfig global/export missing');
// De-duplicated built-ins: 4 known proxies, each once.
const builtinBlock = config.split('const BUILTIN_PROXIES')[1].split('];')[0];
const urls = builtinBlock.match(/https:\/\/[^']+/g) || [];
check(urls.length === 4, 'built-in pool should contain 4 proxies, found ' + urls.length);
check(new Set(urls).size === urls.length, 'built-in pool must be de-duplicated');
// Health-ordered pool: corsmirror first (JSON APIs), corsfix second (the only
// proxy that forwards binary bodies byte-exact), then the two rate-limited ones.
check(urls[0].indexOf('corsmirror') !== -1, 'first built-in must be corsmirror, found ' + urls[0]);
check(urls[1].indexOf('proxy.corsfix.com') !== -1, 'second built-in must be corsfix, found ' + urls[1]);
// codetabs was removed: it answers 522 and stalls ~22s before failing.
check(!/codetabs/.test(builtinBlock), 'codetabs must not be in the built-in pool');

// Health cache: failures are remembered locally and demoted for a cooldown.
check(/reportFailure:\s*function/.test(config), 'ProxyConfig must expose reportFailure()');
check(/reportSuccess:\s*function/.test(config), 'ProxyConfig must expose reportSuccess()');
check(/isCoolingDown:\s*function/.test(config), 'ProxyConfig must expose isCoolingDown()');
check(/installFetchObserver:\s*function/.test(config), 'ProxyConfig must expose installFetchObserver()');
check(/reportCorruption:\s*function/.test(config), 'ProxyConfig must expose reportCorruption()');
check(/reportCorruptionFor:\s*function/.test(config), 'ProxyConfig must expose reportCorruptionFor()');
check(/HEALTH_KEY/.test(config), 'proxy-config.js must define a health cache key');
check(/installFetchObserver\(\)/.test(config), 'the fetch observer must be installed on load');

const consumers = [
  'js/apiproxy.js', 'js/emulatorjs.js', 'js/todos.js',
  'js/toflash.js', 'js/tov86.js', 'js/towasm4.js', 'js/podcast.js'
];
consumers.forEach(function(rel) {
  const src = read(rel);
  check(/ProxyConfig\.getProxies\(\)/.test(src), rel + ' must use ProxyConfig.getProxies()');
  // No hard-coded proxy endpoints may remain in consumer code.
  check(!/https:\/\/[^'\"]*(cors\.lol|luckydesigner|codetabs|corsmirror|corsfix|allorigins|corsproxy\.io)/.test(src),
        rel + ' still hard-codes a proxy URL');
});

// Binary-corruption detectors must feed the health cache, otherwise a proxy
// that mangles downloads keeps being retried. Every consumer that downloads
// binary payloads needs one, because the unified pool leads with a proxy known
// to transcode binary bodies as text. They must report the URL they fetched
// (not a shared "last proxy" slot) so concurrent downloads stay attributable.
['js/emulatorjs.js', 'js/todos.js', 'js/toflash.js', 'js/tov86.js', 'js/towasm4.js'].forEach(function(rel) {
  const src = read(rel);
  check(/function hasBinaryCorruption\(blob, target\)/.test(src),
        rel + ' must detect binary corruption and accept the fetched URL');
  check(/reportCorruptionFor\(target\)/.test(src),
        rel + ' must report corruption for the URL it fetched');
});

// Every consumer page must load proxy-config.js BEFORE its business script.
['index.html', 'routes/emulatorjs.html', 'routes/dos.html', 'routes/flash.html',
 'routes/v86.html', 'routes/wasm4.html', 'catalogues/podcastplay.html'].forEach(function(rel) {
  const html = read(rel);
  check(/proxy-config\.js/.test(html), rel + ' must load proxy-config.js');
});

// Service worker must precache the shared config for offline use.
check(/'\/js\/proxy-config\.js'/.test(read('sw.js')), 'sw.js must precache proxy-config.js');

console.log('proxy config check: ' + (ok ? 'ALL OK' : 'FAIL'));
process.exit(ok ? 0 : 1);
