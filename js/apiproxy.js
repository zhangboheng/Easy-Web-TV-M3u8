// Shared API proxy helper — generic CORS-proxy failover for all pages.
// Used by: music (fetchMusicJSON) and adult/porn (fetchWithProxy).
//
// Provides an ordered proxy pool and a sequential failover fetch: if one proxy
// is down / blocked / rate-limited, the next is tried automatically until one
// returns a usable response.

// Ordered CORS-proxy pool. Tried in sequence; the first that returns an
// OK, parseable response wins. Entry forms:
//   'https://host/path?url='                -> append encodeURIComponent(url)
//   { prefix: 'https://host/', raw: true }  -> append the URL verbatim (raw)
// Status verified 2026-09: allorigins is unreachable and removed, as is
// redoc.ly (403 on real targets). corsmirror is live but slow to wake
// (Render free tier cold start - hence the 30s proxy timeout); cors.lol
// works but rate-limits aggressively; luckydesigner and codetabs are
// intermittently down but kept as deep fallbacks. CORS-enabled hosts never
// reach this pool - they are fetched directly first (see directHosts).
var proxyList = [
    'https://corsmirror.onrender.com/v1/cors?url=',
    'https://api.cors.lol/?url=',
    'https://cors.luckydesigner.workers.dev/?',
    'https://api.codetabs.com/v1/proxy/?quest='
];

// Hosts that serve CORS headers (Access-Control-Allow-Origin) - requests to
// these are made directly, without any proxy. Verified 2026-09: the
// MangaDex API echoes the caller Origin, api.github.com and the archive.org
// metadata/advancedsearch endpoints send Access-Control-Allow-Origin: *.
var directHosts = [
    'api.mangadex.org',
    'api.github.com',
    'archive.org'
];

// Hosts that also accept credentialed requests (Access-Control-Allow-Credentials
// + Origin echo). Sending cookies lets a Cloudflare bot-challenge token the user
// obtained by visiting the site earlier (cf_clearance) apply to API calls.
var credentialHosts = ['api.mangadex.org'];

function isDirectFetchable(url) {
    try {
        return directHosts.indexOf(new URL(url).hostname) !== -1;
    } catch (e) {
        return false;
    }
}

function wantsCredentials(url) {
    try {
        return credentialHosts.indexOf(new URL(url).hostname) !== -1;
    } catch (e) {
        return false;
    }
}

// NetEase Cloud Music API host (music-only convenience, see fetchMusicJSON).
var MUSIC_API_BASE = 'http://iwenwiki.com:3000';

// Core: try a direct fetch first for CORS-enabled hosts, then each proxy in
// order. `consume(response)` extracts the payload (e.g. r => r.text() or
// r => r.json()). Resolves with the first success, rejects only after every
// attempt has failed. Each attempt is aborted after its timeout so a hung
// proxy cannot freeze the page forever (proxies get a longer timeout than
// direct attempts: free-tier proxies can take 30s+ to wake from cold start).
var REQUEST_TIMEOUT_MS = 15000;
var PROXY_TIMEOUT_MS = 30000;

function tryProxies(url, consume) {
    return new Promise(function (resolve, reject) {
        var attempts = proxyList.map(function (entry) {
            var prefix = (typeof entry === 'string') ? entry : entry.prefix;
            var target = (entry && entry.raw) ? url : encodeURIComponent(url);
            return { fetchUrl: prefix + target, isDirect: false };
        });
        if (isDirectFetchable(url)) {
            attempts.unshift({ fetchUrl: url, isDirect: true });
        }
        var i = 0;
        function attempt() {
            if (i >= attempts.length) {
                reject(new Error('all proxies failed for ' + url));
                return;
            }
            var current = attempts[i++];
            var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
            var timeout = current.isDirect ? REQUEST_TIMEOUT_MS : PROXY_TIMEOUT_MS;
            var timer = controller ? setTimeout(function() { controller.abort(); }, timeout) : null;
            var fetchOptions = controller ? { signal: controller.signal } : {};
            if (current.isDirect && wantsCredentials(url)) {
                fetchOptions.credentials = 'include';
            }
            fetch(current.fetchUrl, fetchOptions)
                .then(function (response) {
                    if (!response.ok) throw new Error('HTTP ' + response.status);
                    return consume(response);
                })
                .then(function (result) {
                    if (timer) clearTimeout(timer);
                    resolve(result);
                })
                .catch(function () {
                    if (timer) clearTimeout(timer);
                    attempt();
                });
        }
        attempt();
    });
}

// Generic: fetch any URL through the proxy pool and resolve with its TEXT.
// (Works for JSON or XML APIs; the caller parses as needed.)
//   fetchWithProxy(url).then(function(text){ ... }).catch(function(){ ... });
function fetchWithProxy(url) {
    return tryProxies(url, function (response) { return response.text(); });
}

// Generic: fetch any URL through the proxy pool and resolve with parsed JSON.
function fetchJSONWithProxy(url) {
    return tryProxies(url, function (response) { return response.json(); });
}

// Escape HTML special characters (& < > " ') so untrusted strings (video
// titles, category names, descriptions...) can be safely interpolated into
// innerHTML templates. Pages may define their own escapeHtml afterwards;
// the local definition then takes precedence in that page.
function escapeHtml(text) {
    if (text === null || text === undefined) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Music convenience: fetch a NetEase API path and hand back parsed JSON.
//   fetchMusicJSON('/song/url?id=123', function(json){...}, function(){...});
function fetchMusicJSON(path, onDone, onFail) {
    tryProxies(MUSIC_API_BASE + path, function (response) { return response.json(); })
        .then(function (data) { if (onDone) onDone(data); })
        .catch(function () { if (onFail) onFail(); });
}

// RadioBrowser API mirrors — all send Access-Control-Allow-Origin: *, tried in order.
var radioMirrors = [
    'https://de1.api.radio-browser.info/',
    'https://de2.api.radio-browser.info/',
    'https://fr1.api.radio-browser.info/',
    'https://nl1.api.radio-browser.info/',
    'https://fi1.api.radio-browser.info/'
];

// Fetch JSON from RadioBrowser, failing over across mirrors on network / HTTP / parse error.
// `path` is appended to each mirror (caller pre-encodes any query params).
// Each attempt is aborted after REQUEST_TIMEOUT_MS so a hung mirror cannot block forever.
function fetchRadio(path) {
    var attempt = function(i) {
        if (i >= radioMirrors.length) {
            return Promise.reject(new Error('All RadioBrowser mirrors failed'));
        }
        var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
        var timer = controller ? setTimeout(function() { controller.abort(); }, REQUEST_TIMEOUT_MS) : null;
        return fetch(radioMirrors[i] + path, controller ? { signal: controller.signal } : undefined)
            .then(function(response) {
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.json();
            })
            .then(function(result) {
                if (timer) clearTimeout(timer);
                return result;
            })
            .catch(function() {
                if (timer) clearTimeout(timer);
                return attempt(i + 1);
            });
    };
    return attempt(0);
}
