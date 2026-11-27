// TV player (tvplay.js) integrity check (run with node).
// Covers the Phase-1 live-TV fixes: standard M3U parsing, proxy-pool fetch,
// local caching, and per-channel failover.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');
const src = fs.readFileSync(path.join(root, 'js', 'tvplay.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'catalogues', 'tvplay.html'), 'utf8');
let ok = true;
function check(cond, msg) { if (!cond) { console.log('FAIL: ' + msg); ok = false; } }

check(/parseM3U/.test(src), 'tvplay.js must define parseM3U()');
check(/fetchWithProxy/.test(src), 'loadChannels must fetch through the proxy pool');
check(/tvCacheGet|tvCacheSet/.test(src), 'loadChannels must cache parsed channels');
check(/tryNextChannel/.test(src), 'tvplay.js must expose tryNextChannel() failover');
check(/markChannelFailed/.test(src), 'tvplay.js must expose markChannelFailed()');
check(/proxy-config\.js/.test(html) && /apiproxy\.js/.test(html),
      'tvplay.html must load proxy-config.js and apiproxy.js before tvplay.js');

// --- Sandbox: minimal document / videojs / localStorage stubs --------------
const store = {};
function fakeEl() {
    return {
        innerHTML: '', textContent: '', style: {}, dataset: {},
        classList: { add(){}, remove(){}, contains(){ return false; }, toggle(){} },
        appendChild(){}, setAttribute(){}, addEventListener(){},
        querySelector(){ return null; }, querySelectorAll(){ return []; }, remove(){},
    };
}
const sandbox = {
    window: {
        localStorage: {
            getItem: function (k) { return k in store ? store[k] : null; },
            setItem: function (k, v) { store[k] = String(v); },
            removeItem: function (k) { delete store[k]; },
        },
        location: { protocol: 'https:' },
    },
    localStorage: {
        getItem: function (k) { return k in store ? store[k] : null; },
        setItem: function (k, v) { store[k] = String(v); },
        removeItem: function (k) { delete store[k]; },
    },
    document: {
        addEventListener: function () {},
        querySelector: function () { return fakeEl(); },
        querySelectorAll: function () { return []; },
        getElementById: function () { return fakeEl(); },
        createElement: function () { return fakeEl(); },
        title: '',
    },
    console: console,
    setTimeout: setTimeout, clearTimeout: clearTimeout, Date: Date, Promise: Promise,
    fetch: function () { return Promise.reject(new Error('no network in check')); },
    videojs: function () {
        return { on(){}, src(){}, play(){}, error(){ return null; },
                 removeClass(){}, addClass(){}, controlBar:{ addClass(){} } };
    },
    escapeHtml: function (t) {
        return String(t == null ? '' : t)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
vm.runInContext(src + '\n;globalThis.__parse=parseM3U; globalThis.__load=loadChannels;' +
                ' globalThis.__cacheGet=tvCacheGet; globalThis.__cacheSet=tvCacheSet;' +
                ' globalThis.__tryNext=tryNextChannel; globalThis.__markFailed=markChannelFailed;' +
                ' globalThis.__setChannels=function(a){ channels = a; };' +
                ' globalThis.__setIndex=function(i){ currentChannelIndex = i; };' +
                ' globalThis.__getIndex=function(){ return currentChannelIndex; };', sandbox);
const parseM3U = sandbox.__parse;

// --- 1. parseM3U: basic parse --------------------------------------------
const fixture = [
    '#EXTM3U',
    '#EXTINF:-1 tvg-id="A.us@HD" tvg-logo="https://x/a.png" tvg-country="US" tvg-language="eng" group-title="News",A Channel (720p)',
    'https://cdn.example.com/a/index.m3u8',
    '#EXTVLCOPT:http-user-agent=Mozilla/5.0',
    '#EXTINF:-1 tvg-id="B.us@SD" group-title="Movies",B Channel',
    'http://stream.example.com/b/index.m3u8',
].join('\n');
const parsed = parseM3U(fixture);
check(parsed.length === 2, 'parseM3U should return 2 channels, got ' + parsed.length);
check(parsed[0].name === 'A Channel (720p)', 'channel name from EXTINF comma suffix');
check(parsed[0].tvgId === 'A.us@HD', 'tvg-id parsed');
check(parsed[0].logo === 'https://x/a.png', 'tvg-logo parsed');
check(parsed[0].group === 'News', 'group-title parsed');
check(parsed[0].opts.length === 1 && parsed[0].opts[0] === 'http-user-agent=Mozilla/5.0', 'EXTVLCOPT captured');
check(parsed[0].url === 'https://cdn.example.com/a/index.m3u8', 'URL line parsed');
check(parsed[1].url === 'http://stream.example.com/b/index.m3u8', 'http URL kept');

// --- 2. parseM3U: dedupe + non-http skipped + blank lines ------------------
const dup = [
    '#EXTINF:-1 tvg-id="C" group-title="X",C1',
    'https://x/c.m3u8',
    '#EXTINF:-1 tvg-id="C" group-title="X",C2',
    'https://x/c.m3u8',
    '#EXTINF:-1 tvg-id="D",D',
    'ftp://bad/d.m3u8',
    '',
    '   ',
].join('\n');
const parsedDup = parseM3U(dup);
check(parsedDup.length === 1, 'duplicate tvg-id+url collapsed, got ' + parsedDup.length);
check(parsedDup.every(function (c) { return /^https?:\/\//.test(c.url); }), 'non-http URLs skipped');

// --- 2b. parseM3U: non-http URL before an http URL keeps metadata ---------
const mixed = [
    '#EXTINF:-1 tvg-id="E" group-title="News",Chan E',
    'rtmp://bad',            // skipped scheme, must NOT discard metadata
    'https://e/x.m3u8',      // http url must keep tvg-id / name / group
].join('\n');
const parsedMixed = parseM3U(mixed);
check(parsedMixed.length === 1, 'non-http then http yields 1 channel, got ' + parsedMixed.length);
check(parsedMixed.length === 1 && parsedMixed[0].name === 'Chan E' && parsedMixed[0].tvgId === 'E' && parsedMixed[0].group === 'News',
      'non-http url must not discard channel metadata for the following http url');

// --- 3. loadChannels: proxy fetch + cache (behavioral) --------------------
const calls = [];
sandbox.fetchWithProxy = function (u) { calls.push(u); return Promise.resolve(fixture); };
const apiUrl = 'https://iptv-org.github.io/iptv/countries/us.m3u';
sandbox.__load(apiUrl)
    .then(function () {
        check(calls[0] === apiUrl, 'loadChannels calls fetchWithProxy with the api url');
        check(store['tvplay_cache_' + apiUrl] !== undefined, 'parsed channels cached in localStorage');

        // --- 4. failover: advances past failed, skips mixed-content ---------
        sandbox.__setChannels([
            { url: 'https://a/x.m3u8', name: 'A', failed: false },
            { url: 'https://b/y.m3u8', name: 'B', failed: true },
            { url: 'https://c/z.m3u8', name: 'C', failed: false },
        ]);
        sandbox.__setIndex(0);
        sandbox.__markFailed(0);
        check(sandbox.__tryNext() === true, 'tryNextChannel advances past a failed channel');
        check(sandbox.__getIndex() === 2, 'tryNextChannel lands on the next working channel');

        sandbox.__setChannels([
            { url: 'https://a/x.m3u8', name: 'A', failed: true },
            { url: 'http://c/z.m3u8', name: 'C', failed: false },
        ]);
        sandbox.__setIndex(0);
        check(sandbox.__tryNext() === false,
              'tryNextChannel skips mixed-content http on https and stops when nothing remains');

        console.log('tvplay check: ' + (ok ? 'ALL OK' : 'FAIL'));
        process.exit(ok ? 0 : 1);
    })
    .catch(function (e) {
        console.log('FAIL: loadChannels threw: ' + e.message);
        process.exit(1);
    });
