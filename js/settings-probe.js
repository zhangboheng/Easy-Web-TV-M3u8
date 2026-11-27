// Active connectivity probes for Settings > Proxy Settings / Source Control.
// Standalone: index.html does not load apiproxy.js, so this uses fetch directly
// with a short timeout and the live ProxyConfig pool for failover. No data is
// stored; results are returned to the UI for badges only.
var SettingsProbe = (function () {
    var TIMEOUT_MS = 7000;
    // Tiny, CORS-friendly endpoint relayed through each proxy. Probes only
    // whether the proxy forwards a response, not binary integrity.
    var PROBE_TARGET = 'https://archive.org/robots.txt';

    function fetchWithTimeout(url, ms) {
        var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
        var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, ms) : null;
        var opts = { method: 'GET', cache: 'no-store' };
        if (ctrl) opts.signal = ctrl.signal;
        return fetch(url, opts).then(function (r) {
            if (timer) clearTimeout(timer);
            return r;
        }).catch(function (e) {
            if (timer) clearTimeout(timer);
            throw e;
        });
    }

    function proxyUrl(prefix, target) {
        return prefix.indexOf('{url}') !== -1
            ? prefix.replace('{url}', encodeURIComponent(target))
            : prefix + encodeURIComponent(target);
    }

    // Test ONE custom proxy: the url passed in from the ⚡ button. Do not use
    // the shared pool here — probing a different (e.g. built-in) proxy would
    // show a false ✓ on this row and pollute this proxy's health-cache entry.
    function testProxy(url) {
        var started = Date.now();
        return fetchWithTimeout(proxyUrl(url, PROBE_TARGET), TIMEOUT_MS)
            .then(function (r) {
                if (!r.ok) throw new Error('HTTP ' + r.status);
                return r.text();
            })
            .then(function (text) {
                if (!text || !text.length) throw new Error('empty response');
                if (typeof ProxyConfig !== 'undefined') ProxyConfig.reportSuccess(url);
                return { ok: true, ms: Date.now() - started, via: url };
            })
            .catch(function () {
                if (typeof ProxyConfig !== 'undefined') ProxyConfig.reportFailure(url);
                return { ok: false, ms: Date.now() - started, error: 'proxy did not answer' };
            });
    }

    // Source endpoints are Apple CMS vod APIs or YouTube RSS. Try direct first
    // (many allow CORS), then fall back through the proxy pool. A valid result
    // has either a JSON `list` array or an Atom <feed> root.
    function testSource(type, url) {
        var isYt = type === 'youtube';
        var target = isYt ? url : (url + (url.indexOf('?') === -1 ? '?' : '&') + 'ac=videolist&pg=1');
        var started = Date.now();
        function valid(text) {
            if (isYt) return /<feed[\s>]/.test(text) && /<entry[\s>]/.test(text);
            try { var j = JSON.parse(text); return !!j && Array.isArray(j.list); }
            catch (e) { return false; }
        }
        return fetchWithTimeout(target, TIMEOUT_MS)
            .then(function (r) { return r.text(); })
            .then(function (t) {
                if (valid(t)) return { ok: true, ms: Date.now() - started };
                throw new Error('invalid payload');
            })
            .catch(function () {
                var pool = (typeof ProxyConfig !== 'undefined') ? ProxyConfig.getProxies() : [];
                function attempt(i) {
                    if (i >= pool.length) return Promise.resolve({ ok: false, ms: Date.now() - started });
                    return fetchWithTimeout(proxyUrl(pool[i], target), TIMEOUT_MS)
                        .then(function (r) { return r.text(); })
                        .then(function (t) {
                            if (!valid(t)) throw new Error('invalid payload');
                            if (typeof ProxyConfig !== 'undefined') ProxyConfig.reportSuccess(pool[i]);
                            return { ok: true, ms: Date.now() - started };
                        })
                        .catch(function () {
                            if (typeof ProxyConfig !== 'undefined') ProxyConfig.reportFailure(pool[i]);
                            return attempt(i + 1);
                        });
                }
                return attempt(0);
            });
    }

    return { testProxy: testProxy, testSource: testSource, PROBE_TARGET: PROBE_TARGET };
})();
