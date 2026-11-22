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

    // Shared slow-load toast helper. Pages keep their own translated strings
    // and DOM ids; this only replaces the repeated notice/slow-link plumbing.
    function makeNotifier(opts) {
        var toastEl = document.getElementById(opts.toastId || 'toast');
        var messageEl = document.getElementById(opts.toastMessageId || 'toastMessage');
        var overlayEl = document.getElementById(opts.overlayId || 'loadingOverlay');
        var linkId = opts.linkId || 'slowOpenLink';
        var timer = null;
        return {
            show: function (msg) {
                if (!toastEl || !messageEl) return;
                messageEl.textContent = msg;
                toastEl.classList.remove('hidden');
                clearTimeout(timer);
                timer = setTimeout(function () { toastEl.classList.add('hidden'); }, 3000);
            },
            slowLink: function (url, text) {
                if (!overlayEl || document.getElementById(linkId)) return;
                var link = document.createElement('a');
                link.id = linkId;
                link.href = url;
                link.target = '_blank';
                link.rel = 'noopener';
                link.textContent = text;
                link.style.cssText = 'display:inline-block;margin-top:14px;color:#33ff66;text-decoration:underline;font-size:14px;';
                overlayEl.appendChild(link);
            },
            clearTimer: function () { if (timer) { clearTimeout(timer); timer = null; } }
        };
    }

    return {
        ensureIsolated: ensureIsolated,
        makeNotifier: makeNotifier
    };
})();
