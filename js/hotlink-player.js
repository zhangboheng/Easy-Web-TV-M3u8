/**
 * Shared helpers for hot-linked player pages (v8.6.0).
 *
 * The isolated emulator pages used to repeat the same service-worker
 * registration + single reload dance five times. This module centralises it.
 * Plain global script, no modules, matching the rest of the codebase.
 */
window.HotlinkPlayer = (function () {
    'use strict';

    // Register the SW and reload once so the top-level page becomes
    // cross-origin isolated (COOP/COEP injected by sw.js). The sessionStorage
    // key is per page so multiple players never block each other.
    function ensureIsolated(namespace, consoleTag, swPath) {
        if (!('serviceWorker' in navigator)) return;
        navigator.serviceWorker.register(swPath).catch(function (e) {
            if (console && console.log) {
                console.log(consoleTag + ' SW registration unavailable:', e && e.message);
            }
        });
        if (window.crossOriginIsolated) {
            sessionStorage.removeItem(namespace);
            return;
        }
        if (sessionStorage.getItem(namespace)) return; // already retried once
        navigator.serviceWorker.ready.then(function () {
            sessionStorage.setItem(namespace, '1');
            location.reload();
        }).catch(function () { /* SW unavailable - stay non-isolated */ });
    }

    return {
        ensureIsolated: ensureIsolated
    };
})();
