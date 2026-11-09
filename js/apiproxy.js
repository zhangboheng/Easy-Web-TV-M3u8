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
// Excluded: corsproxy.io (needs an API key), cors.x2u.in / corsfix (need
// email / domain registration). codetabs & allorigins are intermittently down
// but often reachable, so kept as deep fallbacks. redoc.ly requires the raw URL
// and an Origin header (the browser sends Origin automatically on fetch).
var proxyList = [
    'https://cors.luckydesigner.workers.dev/?',
    { prefix: 'https://cors.redoc.ly/', raw: true },
    'https://corsmirror.onrender.com/v1/cors?url=',
    'https://api.codetabs.com/v1/proxy/?quest=',
    'https://api.allorigins.win/raw?url='
];

// NetEase Cloud Music API host (music-only convenience, see fetchMusicJSON).
var MUSIC_API_BASE = 'http://iwenwiki.com:3000';

// Core: try each proxy in order. `consume(response)` extracts the payload
// (e.g. r => r.text() or r => r.json()). Resolves with the first success,
// rejects only after every proxy has failed. Each attempt is aborted after
// REQUEST_TIMEOUT_MS so a hung proxy cannot freeze the page forever.
var REQUEST_TIMEOUT_MS = 15000;

function tryProxies(url, consume) {
    return new Promise(function (resolve, reject) {
        var i = 0;
        function attempt() {
            if (i >= proxyList.length) {
                reject(new Error('all proxies failed for ' + url));
                return;
            }
            var entry = proxyList[i++];
            var prefix = (typeof entry === 'string') ? entry : entry.prefix;
            var target = (entry && entry.raw) ? url : encodeURIComponent(url);
            var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
            var timer = controller ? setTimeout(function() { controller.abort(); }, REQUEST_TIMEOUT_MS) : null;
            fetch(prefix + target, controller ? { signal: controller.signal } : undefined)
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
