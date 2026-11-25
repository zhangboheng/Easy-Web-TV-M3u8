/**
 * Shared helpers for hot-linked player pages (v8.6.2).
 *
 * ensureIsolated centralises the service-worker cross-origin-isolation dance.
 * createPlayer centralises the iframe lifecycle and the slow/stalled upstream
 * UX so every hot-linked page behaves the same way. Plain global script, no
 * modules, matching the rest of the codebase.
 */
window.HotlinkPlayer = (function () {
    'use strict';

    var COPY = {
        zh: {
            loadingSlow: '加载较慢，请再等一会儿',
            upstreamUnavailable: '官方页面加载超时或暂时不可用',
            retry: '重试',
            upstreamHint: '若游戏持续空白，请点击重试重新加载。'
        },
        en: {
            loadingSlow: 'Still loading - please wait a little longer',
            upstreamUnavailable: 'The official page is taking too long or may be unavailable',
            retry: 'Retry',
            upstreamHint: 'If the game stays blank, use the Retry button to reload it.'
        },
        ja: {
            loadingSlow: '読み込みが遅いです。しばらくお待ちください',
            upstreamUnavailable: '公式ページの読み込みがタイムアウトしたか、利用できないようです',
            retry: '再試行',
            upstreamHint: 'ゲームが空白のままの場合は、再試行ボタンで読み込み直してください。'
        },
        ko: {
            loadingSlow: '로딩이 느립니다. 조금 더 기다려 주세요',
            upstreamUnavailable: '공식 페이지 응답이 지연되거나 일시적으로 사용할 수 없습니다',
            retry: '다시 시도',
            upstreamHint: '게임이 계속 비어 있으면 다시 시도 버튼으로 다시 불러오세요.'
        },
        fr: {
            loadingSlow: 'Chargement lent - patientez encore un peu',
            upstreamUnavailable: 'La page officielle met trop de temps ou est momentanément indisponible',
            retry: 'Réessayer',
            upstreamHint: 'Si le jeu reste vide, utilisez le bouton Réessayer pour le recharger.'
        },
        de: {
            loadingSlow: 'Laden dauert länger - bitte warten Sie noch etwas',
            upstreamUnavailable: 'Die offizielle Seite antwortet nicht oder ist vorübergehend nicht verfügbar',
            retry: 'Erneut versuchen',
            upstreamHint: 'Wenn das Spiel leer bleibt, klicken Sie auf „Erneut versuchen“, um es neu zu laden.'
        },
        es: {
            loadingSlow: 'La carga va lenta: espera un poco más',
            upstreamUnavailable: 'La página oficial tarda demasiado o no está disponible temporalmente',
            retry: 'Reintentar',
            upstreamHint: 'Si el juego sigue en blanco, usa el botón Reintentar para volver a cargarlo.'
        },
        ru: {
            loadingSlow: 'Загрузка идёт медленно - подождите ещё немного',
            upstreamUnavailable: 'Официальная страница слишком долго не отвечает или временно недоступна',
            retry: 'Повторить',
            upstreamHint: 'Если игра остаётся пустой, нажмите «Повторить», чтобы перезагрузить её.'
        }
    };

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
            try { sessionStorage.removeItem(namespace); } catch (e) { /* storage blocked */ }
            return;
        }
        var storageAvailable = true;
        try {
            if (sessionStorage.getItem(namespace)) return; // already retried once
        } catch (e) {
            // Storage-blocked/private contexts cannot remember the retry. Do not
            // reload blindly, or the page would loop forever.
            storageAvailable = false;
        }
        if (!storageAvailable) return;
        navigator.serviceWorker.ready.then(function () {
            try { sessionStorage.setItem(namespace, '1'); } catch (e) {
                storageAvailable = false;
            }
            if (storageAvailable) location.reload();
        }).catch(function () { /* SW unavailable - stay non-isolated */ });
    }

    function resolve(value) {
        return typeof value === 'function' ? value() : value;
    }

    function language() {
        try {
            return (localStorage.getItem('ewtv-lang') || 'en').split('-')[0];
        } catch (e) {
            return 'en';
        }
    }

    function noop() {}

    function createPlayer(options) {
        options = options || {};
        var frame = document.getElementById(options.frameId);
        if (!frame) return { start: noop, stop: noop, retry: noop };

        // The player reveals the iframe from display:none on demand. A lazy
        // loading attribute can make Chrome skip the later src assignment, so
        // drop it here as well as in the page markup.
        frame.removeAttribute('loading');

        var words = COPY[language()] || COPY.en;
        var overlay = document.getElementById(options.overlayId || 'loadingOverlay');
        var toastEl = document.getElementById(options.toastId || 'toast');
        var toastMsg = document.getElementById(options.toastMessageId || 'toastMessage');
        var slowMs = options.slowMs || 15000;
        var stalledMs = options.stalledMs || 30000;
        var hideDelay = options.hideDelay || 0;
        var generation = 0;
        var active = false;
        var pendingLoad = false;
        var slowTimer = null;
        var stalledTimer = null;
        var hideTimer = null;
        var lastUrl = null;

        function clearTimers() {
            [slowTimer, stalledTimer, hideTimer].forEach(function (timer) {
                if (timer) clearTimeout(timer);
            });
            slowTimer = null;
            stalledTimer = null;
            hideTimer = null;
        }

        function showToast(message) {
            if (!toastEl || !toastMsg) return;
            toastMsg.textContent = message;
            toastEl.classList.remove('hidden');
            if (showToast._timer) clearTimeout(showToast._timer);
            showToast._timer = setTimeout(function () {
                toastEl.classList.add('hidden');
            }, 3000);
        }


        function removeFallback() {
            var row = document.getElementById('hotlinkFallback');
            if (row && row.parentNode) row.parentNode.removeChild(row);
        }

        function showFallback() {
            if (!overlay) return;
            removeFallback();
            var row = document.createElement('div');
            row.id = 'hotlinkFallback';
            row.className = 'hotlink-fallback';
            var message = document.createElement('p');
            message.className = 'hotlink-fallback-message';
            message.textContent = words.upstreamUnavailable + ' ' + words.upstreamHint;
            var button = document.createElement('button');
            button.id = 'hotlinkRetry';
            button.type = 'button';
            button.className = 'hotlink-retry';
            button.textContent = words.retry;
            button.addEventListener('click', function () { start(); });
            row.appendChild(message);
            row.appendChild(button);
            overlay.appendChild(row);
            overlay.classList.remove('hidden');
        }

        function showOverlay(show) {
            if (!overlay) return;
            overlay.classList[show ? 'remove' : 'add']('hidden');
        }


        function finish() {
            generation += 1;
            active = false;
            pendingLoad = false;
            clearTimers();
            removeFallback();
            if (options.onLoad) options.onLoad();
            hideTimer = setTimeout(function () { showOverlay(false); }, hideDelay);
        }

        frame.addEventListener('load', function () {
            if (!active || !pendingLoad) return;
            pendingLoad = false;
            finish();
        });

        function start() {
            generation += 1;
            var mine = generation;
            active = true;
            pendingLoad = false;
            clearTimers();
            removeFallback();
            lastUrl = resolve(options.url);
            if (options.onStart) options.onStart();
            showOverlay(true);
            frame.src = 'about:blank';
            setTimeout(function () {
                if (!active || mine !== generation) return;
                pendingLoad = true;
                frame.src = lastUrl;
            }, 0);
            slowTimer = setTimeout(function () {
                if (!active || mine !== generation) return;
                showToast(words.loadingSlow);
            }, slowMs);
            stalledTimer = setTimeout(function () {
                if (!active || mine !== generation) return;
                showToast(words.upstreamUnavailable);
                showFallback();
            }, stalledMs);
        }

        function stop() {
            generation += 1;
            active = false;
            pendingLoad = false;
            clearTimers();
            removeFallback();
            frame.src = 'about:blank';
            showOverlay(false);
            if (options.onStop) options.onStop();
        }

        function retry() { start(); }

        return { start: start, stop: stop, retry: retry };
    }

    return {
        ensureIsolated: ensureIsolated,
        createPlayer: createPlayer
    };
})();
