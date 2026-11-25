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
            loadingSlow: '加载较慢，请再等一会儿，或在新标签页打开官方页面',
            upstreamUnavailable: '官方页面加载超时或暂时不可用',
            retry: '重试',
            openInNewTab: '在新标签页打开官方页面 ↗',
            upstreamHint: '若游戏持续空白，请在新标签页打开官方页面。'
        },
        en: {
            loadingSlow: 'Still loading - please wait a little longer or open the official page in a new tab',
            upstreamUnavailable: 'The official page is taking too long or may be unavailable',
            retry: 'Retry',
            openInNewTab: 'Open official page ↗',
            upstreamHint: 'If the game stays blank, open the official page in a new tab.'
        },
        ja: {
            loadingSlow: '読み込みが遅いです。しばらく待つか、公式ページを新しいタブで開いてください',
            upstreamUnavailable: '公式ページの読み込みがタイムアウトしたか、利用できないようです',
            retry: '再試行',
            openInNewTab: '公式ページを新しいタブで開く ↗',
            upstreamHint: 'ゲームが空白のままの場合は、公式ページを新しいタブで開いてください。'
        },
        ko: {
            loadingSlow: '로딩이 느립니다. 조금 더 기다리거나 공식 페이지를 새 탭에서 여세요',
            upstreamUnavailable: '공식 페이지 응답이 지연되거나 일시적으로 사용할 수 없습니다',
            retry: '다시 시도',
            openInNewTab: '공식 페이지 새 탭에서 열기 ↗',
            upstreamHint: '게임이 계속 비어 있으면 공식 페이지를 새 탭에서 열어 주세요.'
        },
        fr: {
            loadingSlow: 'Chargement lent - patientez encore un peu ou ouvrez la page officielle dans un nouvel onglet',
            upstreamUnavailable: 'La page officielle met trop de temps ou est momentanément indisponible',
            retry: 'Réessayer',
            openInNewTab: 'Ouvrir la page officielle ↗',
            upstreamHint: 'Si le jeu reste vide, ouvrez la page officielle dans un nouvel onglet.'
        },
        de: {
            loadingSlow: 'Laden dauert länger - bitte warten Sie noch etwas oder öffnen Sie die offizielle Seite in einem neuen Tab',
            upstreamUnavailable: 'Die offizielle Seite antwortet nicht oder ist vorübergehend nicht verfügbar',
            retry: 'Erneut versuchen',
            openInNewTab: 'Offizielle Seite öffnen ↗',
            upstreamHint: 'Wenn das Spiel leer bleibt, öffnen Sie die offizielle Seite in einem neuen Tab.'
        },
        es: {
            loadingSlow: 'La carga va lenta: espera un poco más o abre la página oficial en una pestaña nueva',
            upstreamUnavailable: 'La página oficial tarda demasiado o no está disponible temporalmente',
            retry: 'Reintentar',
            openInNewTab: 'Abrir página oficial ↗',
            upstreamHint: 'Si el juego sigue en blanco, abre la página oficial en una pestaña nueva.'
        },
        ru: {
            loadingSlow: 'Загрузка идёт медленно - подождите ещё немного или откройте официальную страницу в новой вкладке',
            upstreamUnavailable: 'Официальная страница слишком долго не отвечает или временно недоступна',
            retry: 'Повторить',
            openInNewTab: 'Открыть официальную страницу ↗',
            upstreamHint: 'Если игра остаётся пустой, откройте официальную страницу в новой вкладке.'
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
            sessionStorage.removeItem(namespace);
            return;
        }
        if (sessionStorage.getItem(namespace)) return; // already retried once
        navigator.serviceWorker.ready.then(function () {
            sessionStorage.setItem(namespace, '1');
            location.reload();
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

        var words = COPY[language()] || COPY.en;
        var overlay = document.getElementById(options.overlayId || 'loadingOverlay');
        var toastEl = document.getElementById(options.toastId || 'toast');
        var toastMsg = document.getElementById(options.toastMessageId || 'toastMessage');
        var slowMs = options.slowMs || 15000;
        var stalledMs = options.stalledMs || 30000;
        var hideDelay = options.hideDelay || 0;
        var generation = 0;
        var active = false;
        var slowTimer = null;
        var stalledTimer = null;
        var hideTimer = null;
        var lastUrl = null;
        var lastTabUrl = null;

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

        function ensureOfficialLink() {
            var link = document.getElementById('hotlinkNewTab');
            if (!link) {
                link = document.createElement('a');
                link.id = 'hotlinkNewTab';
                link.className = 'hotlink-fallback-link';
                link.target = '_blank';
                link.rel = 'noopener';
                var host = document.querySelector('.header-right') || document.body;
                host.appendChild(link);
            }
            link.href = lastTabUrl || lastUrl || '#';
            link.textContent = words.openInNewTab;
            return link;
        }

        function showFallback() {
            if (!overlay) return;
            ensureOfficialLink();
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
            clearTimers();
            removeFallback();
            if (options.onLoad) options.onLoad();
            hideTimer = setTimeout(function () { showOverlay(false); }, hideDelay);
        }

        frame.addEventListener('load', function () {
            if (!active) return;
            if (!frame.src || frame.src === 'about:blank') return;
            finish();
        });

        function start() {
            generation += 1;
            var mine = generation;
            active = true;
            clearTimers();
            removeFallback();
            lastUrl = resolve(options.url);
            lastTabUrl = resolve(options.newTabUrl) || lastUrl;
            ensureOfficialLink();
            if (options.onStart) options.onStart();
            showOverlay(true);
            frame.src = 'about:blank';
            setTimeout(function () {
                if (!active || mine !== generation) return;
                frame.src = lastUrl;
            }, 0);
            slowTimer = setTimeout(function () {
                if (!active || mine !== generation) return;
                showToast(words.loadingSlow);
                ensureOfficialLink();
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

