/**
 * Unified proxy configuration - the single source of truth for all CORS proxies.
 *
 * Previously every page maintained its own hard-coded proxy list. This module
 * centralises them into one de-duplicated pool. Built-in entries are read-only;
 * users may add/edit/remove their own entries from Settings > Proxy Settings.
 *
 * Load this script BEFORE apiproxy.js and any page script that fetches through
 * a proxy. No module system is used (plain global), matching the codebase style.
 */

// Built-in proxy pool (de-duplicated), ordered by measured health.
//
// Order rationale (probed with curl + a real browser, see the summary in
// docs/superpowers/check-proxy-config.js):
//   1. corsmirror  - responds 200 for JSON APIs. Known caveat: it transcodes
//                    binary bodies as text (U+FFFD), which the download
//                    scripts detect and skip.
//   2. corsfix     - responds 200 and forwards binary bodies byte-exact, so it
//                    is the best choice for ROM/package downloads.
//   3. luckydesigner - Cloudflare Worker that intermittently answers
//                    429 "error code: 1027" when its quota is exhausted.
//   4. cors.lol    - rate limits aggressively ("Rate limit exceeded") and does
//                    not always send CORS headers.
//
// codetabs was removed: it answers 522 (origin handshake timeout) and stalls
// ~22s before failing, which made every download wait for it.
//
// The health cache below re-orders this list at runtime so a proxy that just
// failed is skipped for a while instead of stalling the next request.
const BUILTIN_PROXIES = [
    'https://corsmirror.onrender.com/v1/cors?url=',
    'https://proxy.corsfix.com/?url=',
    'https://cors.luckydesigner.workers.dev/?',
    'https://api.cors.lol/?url='
];

// --- Proxy health cache -----------------------------------------------------
// A failed proxy is remembered in localStorage and demoted for a cooldown
// period, so the next request does not pay the same timeout again.
// Cooldown escalates with consecutive failures (1min, 2min, 4min ... 30min cap)
// and resets as soon as the proxy answers successfully.
const HEALTH_KEY = 'ewtv-proxy-health';
const HEALTH_BASE_COOLDOWN_MS = 60 * 1000;
const HEALTH_MAX_COOLDOWN_MS = 30 * 60 * 1000;
// A single failed request can be reported twice (once by the fetch observer,
// once by the caller's own catch block). Ignore reports that arrive this close.
const HEALTH_DEDUPE_MS = 3000;

const ProxyConfig = {
    KEY: 'ewtv-proxy-list',

    // All entries: built-ins are read-only (id starts with "builtin-").
    getBuiltins: function() {
        return BUILTIN_PROXIES.map(function(url, i) {
            return { id: 'builtin-' + i, name: 'Built-in ' + (i + 1), url: url, builtin: true, enabled: true };
        });
    },

    getCustom: function() {
        try {
            var raw = window.localStorage.getItem(this.KEY);
            var list = raw ? JSON.parse(raw) : [];
            return Array.isArray(list) ? list : [];
        } catch (e) {
            return [];
        }
    },

    saveCustom: function(list) {
        try {
            window.localStorage.setItem(this.KEY, JSON.stringify(list));
            return true;
        } catch (e) {
            return false;
        }
    },

    add: function(name, url) {
        var item = {
            id: 'custom-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
            name: String(name || '').trim() || 'Custom proxy',
            url: String(url || '').trim(),
            enabled: true
        };
        var list = this.getCustom();
        list.push(item);
        this.saveCustom(list);
        return item;
    },

    update: function(id, patch) {
        var list = this.getCustom();
        for (var i = 0; i < list.length; i++) {
            if (list[i].id === id) {
                if (patch.name !== undefined) list[i].name = String(patch.name).trim() || list[i].name;
                if (patch.url !== undefined) list[i].url = String(patch.url).trim();
                if (patch.enabled !== undefined) list[i].enabled = !!patch.enabled;
                break;
            }
        }
        this.saveCustom(list);
    },

    remove: function(id) {
        this.saveCustom(this.getCustom().filter(function(item) { return item.id !== id; }));
    },

    // --- Health cache -------------------------------------------------------
    // Shape: { "<proxy url>": { fails: n, until: epochMs, at: epochMs } }

    _readHealth: function() {
        try {
            var raw = window.localStorage.getItem(HEALTH_KEY);
            var obj = raw ? JSON.parse(raw) : {};
            return (obj && typeof obj === 'object') ? obj : {};
        } catch (e) {
            return {};
        }
    },

    _writeHealth: function(map) {
        try {
            window.localStorage.setItem(HEALTH_KEY, JSON.stringify(map));
        } catch (e) { /* storage full or disabled - health cache is best-effort */ }
    },

    // True when the proxy failed recently and is still inside its cooldown.
    isCoolingDown: function(url, now) {
        var rec = this._readHealth()[url];
        if (!rec || !rec.until) return false;
        return (now || Date.now()) < rec.until;
    },

    // Record a failure: escalate the cooldown and persist it.
    reportFailure: function(url, now) {
        if (!url) return;
        var t = now || Date.now();
        var map = this._readHealth();
        var rec = map[url];
        if (rec && rec.at && (t - rec.at) < HEALTH_DEDUPE_MS) return; // duplicate report
        var fails = (rec && rec.fails ? rec.fails : 0) + 1;
        var cooldown = Math.min(HEALTH_BASE_COOLDOWN_MS * Math.pow(2, fails - 1), HEALTH_MAX_COOLDOWN_MS);
        var until = t + cooldown;
        // A corruption record outranks a plain failure: a mangled body is direct
        // evidence, a 503/timeout is not, and the corruption cooldown is already
        // at the 30min ceiling. Keep the flag (so reportSuccess still refuses to
        // clear it) and never let a weaker report shorten that cooldown.
        var corrupt = !!(rec && rec.corrupt);
        if (corrupt && rec.until) until = Math.max(until, rec.until);
        map[url] = { fails: fails, until: until, at: t, corrupt: corrupt };
        this._writeHealth(map);
    },

    // Record a success: the proxy is healthy again, drop its record - but never
    // a corruption record. Corsmirror, for example, answers JSON with 200 and
    // still transcodes binary bodies, so a later successful JSON call must not
    // re-enable it for downloads (that would defeat the 30min cooldown the
    // download scripts rely on).
    reportSuccess: function(url) {
        if (!url) return;
        var map = this._readHealth();
        if (map[url] && !map[url].corrupt) {
            delete map[url];
            this._writeHealth(map);
        }
    },

    // Record binary corruption (U+FFFD transcoding). Unlike a timeout this is a
    // persistent trait of the proxy, so it gets a long fixed cooldown and is
    // tracked separately - the download scripts must not keep retrying it.
    reportCorruption: function(url, now) {
        if (!url) return;
        var t = now || Date.now();
        var map = this._readHealth();
        var rec = map[url] || {};
        if (rec.at && (t - rec.at) < HEALTH_DEDUPE_MS) return;
        map[url] = {
            fails: (rec.fails || 0) + 1,
            until: t + HEALTH_MAX_COOLDOWN_MS,
            at: t,
            corrupt: true
        };
        this._writeHealth(map);
    },

    clearHealth: function() {
        this._writeHealth({});
    },

    // Exposed for the Settings UI / diagnostics: current cooldown entries.
    getHealth: function(now) {
        var t = now || Date.now();
        var map = this._readHealth();
        var out = [];
        Object.keys(map).forEach(function(url) {
            var rec = map[url] || {};
            out.push({
                url: url,
                fails: rec.fails || 0,
                coolingDown: !!rec.until && t < rec.until,
                remainingMs: rec.until ? Math.max(0, rec.until - t) : 0
            });
        });
        return out;
    },

    // The single unified proxy pool used by every fetch path.
    // Custom (enabled) proxies first so users can override the built-ins.
    // Proxies inside their cooldown window are moved to the end, so a known-bad
    // proxy cannot stall the request that would otherwise succeed immediately.
    getProxies: function() {
        var custom = this.getCustom()
            .filter(function(item) { return item && item.enabled && item.url; })
            .map(function(item) { return item.url; });
        var pool = custom.concat(BUILTIN_PROXIES).filter(function(url, i, arr) {
            return arr.indexOf(url) === i; // de-duplicate
        });
        var now = Date.now();
        var self = this;
        var healthy = [], cooling = [];
        pool.forEach(function(url) {
            (self.isCoolingDown(url, now) ? cooling : healthy).push(url);
        });
        return healthy.concat(cooling);
    },

    // Append a target URL to a proxy prefix using the project's convention.
    buildUrl: function(prefix, target) {
        return prefix + encodeURIComponent(target);
    },

    // Basic validation for user-entered proxy prefixes.
    isValidUrl: function(url) {
        try {
            var u = new URL(String(url));
            return (u.protocol === 'https:' || u.protocol === 'http:');
        } catch (e) {
            return false;
        }
    },

    // --- Automatic health observation ---------------------------------------
    // Wraps window.fetch once so every consumer (apiproxy, emulatorjs, todos,
    // toflash, tov86, towasm4, podcast) feeds the health cache without needing
    // any change to its own failover loop. A proxied request is attributed to
    // the proxy whose prefix matches the request URL.
    //
    // Not every status says something about the proxy: 4xx other than 403/429
    // is the target's own answer relayed verbatim (a missing page returns 404
    // through every proxy), so demoting on those would punish healthy proxies.

    // True when the status points at the proxy rather than the target.
    isProxyFault: function(status) {
        return status === 403 || status === 429 || status >= 500;
    },

    matchProxy: function(fetchUrl) {
        var pool = this.getCustom()
            .filter(function(item) { return item && item.enabled && item.url; })
            .map(function(item) { return item.url; })
            .concat(BUILTIN_PROXIES);
        for (var i = 0; i < pool.length; i++) {
            if (pool[i] && fetchUrl.indexOf(pool[i]) === 0) return pool[i];
        }
        return null;
    },

    // Attribute a corrupt body to the proxy that actually delivered it.
    //
    // `target` is the URL the caller fetched (the proxy-prefixed URL when a
    // proxy was used). Matching the prefix per call keeps concurrent downloads
    // correct: a shared "last proxy" slot would blame whichever request started
    // last. Returns the blamed proxy URL, or null for a direct (unproxied) body.
    reportCorruptionFor: function(target) {
        if (!target) return null;
        var proxy = this.matchProxy(target);
        if (proxy) this.reportCorruption(proxy);
        return proxy;
    },

    installFetchObserver: function() {
        if (typeof window === 'undefined' || typeof window.fetch !== 'function') return;
        if (window.__ewtvProxyObserverInstalled) return;
        window.__ewtvProxyObserverInstalled = true;
        var self = this;
        var nativeFetch = window.fetch.bind(window);
        window.fetch = function(input, init) {
            var url = (typeof input === 'string') ? input : (input && input.url) || '';
            var proxy = self.matchProxy(url);
            var p = nativeFetch(input, init);
            if (!proxy) return p;
            return p.then(function(response) {
                if (!response) return response;
                if (response.ok) self.reportSuccess(proxy);
                else if (self.isProxyFault(response.status)) self.reportFailure(proxy);
                return response;
            }, function(err) {
                // Network error / CORS rejection / abort all mean "unusable".
                self.reportFailure(proxy);
                throw err;
            });
        };
    }
};

// Install immediately: proxy-config.js is loaded before every consumer script,
// so the wrapper is in place before the first proxied request is issued.
if (typeof window !== 'undefined') {
    ProxyConfig.installFetchObserver();
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProxyConfig: ProxyConfig, BUILTIN_PROXIES: BUILTIN_PROXIES };
}
