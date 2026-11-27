// Game Play Page JS - Native JavaScript (No jQuery)
//
// Shell for the four locally bundled gamebox games (reached from the Games
// catalogue as ../catalogues/gameplay.html?game=<key>). The iframe lifecycle
// (loading overlay, slow-load hint, stalled fallback + retry) is delegated to
// js/hotlink-player.js so this page behaves exactly like the other players.
// An unknown/missing ?game= shows an explicit error instead of silently
// launching the first game in the list (v8.6.x).

var GAMEPLAY_REGISTRY = {
    'square-obstacles': {
        name: 'Square Obstacles',
        category: 'arcade',
        url: '../gamebox/ball/gameball.html'
    },
    'pong': {
        name: 'Pong',
        category: 'classic',
        url: '../gamebox/bong/gamebong.html'
    },
    'breakout': {
        name: 'Breakout',
        category: 'arcade',
        url: '../gamebox/breakout/gamebreakout.html'
    },
    'tic-tac-toe': {
        name: 'Tic Tac Toe',
        category: 'puzzle',
        url: '../gamebox/tic-tac-toe/tic-tac-toe-game.html'
    }
};

// Same 8-language pattern as the other route pages so check-i18n.js can verify
// this table against catalogues/gameplay.html.
var i18n = {
    zh: { pageTitle: '游戏', back: '返回游戏列表', home: '首页', restart: '重新开始', fullscreen: '全屏', exitFullscreen: '退出全屏', loading: '正在加载游戏...', loadingTip: '游戏从本地资源包加载，首次启动可能需要一点时间', invalidGame: '找不到这个游戏', invalidTip: '请返回游戏列表重新选择。' },
    en: { pageTitle: 'Game', back: 'Back to games', home: 'Home', restart: 'Restart', fullscreen: 'Fullscreen', exitFullscreen: 'Exit fullscreen', loading: 'Loading game...', loadingTip: 'The game loads from the local bundle; the first launch can take a moment', invalidGame: 'Game not found', invalidTip: 'Go back to the games list and pick another one.' },
    ja: { pageTitle: 'ゲーム', back: 'ゲーム一覧へ戻る', home: 'ホーム', restart: 'リスタート', fullscreen: '全画面', exitFullscreen: '全画面を終了', loading: 'ゲームを読み込み中...', loadingTip: 'ゲームはローカルのバンドルから読み込まれます。初回は少し時間がかかることがあります', invalidGame: 'ゲームが見つかりません', invalidTip: 'ゲーム一覧に戻って選び直してください。' },
    ko: { pageTitle: '게임', back: '게임 목록으로', home: '홈', restart: '다시 시작', fullscreen: '전체 화면', exitFullscreen: '전체 화면 종료', loading: '게임을 불러오는 중...', loadingTip: '게임은 로컬 번들에서 로드됩니다. 처음 실행은 시간이 조금 걸릴 수 있습니다', invalidGame: '게임을 찾을 수 없습니다', invalidTip: '게임 목록으로 돌아가 다시 선택하세요.' },
    fr: { pageTitle: 'Jeu', back: 'Retour aux jeux', home: 'Accueil', restart: 'Redémarrer', fullscreen: 'Plein écran', exitFullscreen: 'Quitter le plein écran', loading: 'Chargement du jeu...', loadingTip: 'Le jeu se charge depuis le paquet local ; le premier lancement peut prendre un instant', invalidGame: 'Jeu introuvable', invalidTip: 'Revenez à la liste des jeux et choisissez-en un autre.' },
    de: { pageTitle: 'Spiel', back: 'Zurück zu den Spielen', home: 'Startseite', restart: 'Neu starten', fullscreen: 'Vollbild', exitFullscreen: 'Vollbild beenden', loading: 'Spiel wird geladen...', loadingTip: 'Das Spiel lädt aus dem lokalen Paket; der erste Start kann einen Moment dauern', invalidGame: 'Spiel nicht gefunden', invalidTip: 'Gehen Sie zurück zur Spieleliste und wählen Sie ein anderes.' },
    es: { pageTitle: 'Juego', back: 'Volver a los juegos', home: 'Inicio', restart: 'Reiniciar', fullscreen: 'Pantalla completa', exitFullscreen: 'Salir de pantalla completa', loading: 'Cargando juego...', loadingTip: 'El juego se carga desde el paquete local; el primer inicio puede tardar un momento', invalidGame: 'Juego no encontrado', invalidTip: 'Vuelve a la lista de juegos y elige otro.' },
    ru: { pageTitle: 'Игра', back: 'Назад к играм', home: 'Главная', restart: 'Перезапустить', fullscreen: 'Полный экран', exitFullscreen: 'Выйти из полного экрана', loading: 'Загрузка игры...', loadingTip: 'Игра загружается из локального пакета; первый запуск может занять время', invalidGame: 'Игра не найдена', invalidTip: 'Вернитесь к списку игр и выберите другую.' }
};

var currentLang = 'en';
try {
    var storedLang = localStorage.getItem('ewtv-lang') || localStorage.getItem('preferredLanguage') || 'en';
    currentLang = storedLang.split('-')[0];
} catch (e) {
    // Storage blocked (private mode / hardened settings): fall back to English.
}
if (!i18n[currentLang]) currentLang = 'en';
function t(key) { return (i18n[currentLang] && i18n[currentLang][key]) || i18n.en[key] || key; }

function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (i18n[currentLang] && i18n[currentLang][key]) el.textContent = i18n[currentLang][key];
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-title');
        if (i18n[currentLang] && i18n[currentLang][key]) {
            el.title = i18n[currentLang][key];
            el.setAttribute('aria-label', i18n[currentLang][key]);
        }
    });
    document.documentElement.lang = currentLang;
}

// Read ?game=<key>. No silent fallback: an unknown key must be reported.
// Stop at '&' and '#' so "?game=pong#x" still resolves.
function getGameKey() {
    var match = new RegExp('[?&]game=([^&#]*)').exec(window.location.search);
    if (!match) return '';
    try {
        return decodeURIComponent(match[1].replace(/\+/g, ' '));
    } catch (e) {
        return match[1];
    }
}

var gameKey = getGameKey();
var currentGame = Object.prototype.hasOwnProperty.call(GAMEPLAY_REGISTRY, gameKey) ? GAMEPLAY_REGISTRY[gameKey] : null;
var isValid = Boolean(currentGame);

// The shared helper owns the iframe lifecycle: overlay show/hide, the 15s
// "still loading" toast and the 30s stalled fallback with a Retry button.
var player = HotlinkPlayer.createPlayer({
    frameId: 'gameFrame',
    overlayId: 'loadingOverlay',
    url: function () { return currentGame ? currentGame.url : 'about:blank'; }
});

function setControlsEnabled(enabled) {
    ['restartBtn', 'fullscreenBtn'].forEach(function (id) {
        var btn = document.getElementById(id);
        if (btn) btn.disabled = !enabled;
    });
}

// Unknown/missing game key: keep the iframe blank, explain the problem and
// disable the controls instead of launching an unrelated game.
function showInvalidGame() {
    var overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        // No spinner for a permanent error: it would suggest the game is still
        // coming.
        var spinner = overlay.querySelector('.loading-spinner');
        if (spinner) spinner.style.display = 'none';
        var text = overlay.querySelector('.loading-text');
        if (text) {
            text.innerHTML = '<span>' + t('invalidGame') + '</span><small>' + t('invalidTip') + '</small>';
        }
        overlay.classList.remove('hidden');
    }
    var title = document.getElementById('gameTitle');
    if (title) title.textContent = t('invalidGame');
    var category = document.getElementById('gameCategory');
    if (category) category.textContent = '-';
    document.title = t('invalidGame') + ' - Easy Web TV';
    setControlsEnabled(false);
}

function applyGameInfo() {
    var title = document.getElementById('gameTitle');
    if (title) title.textContent = currentGame.name;
    var category = document.getElementById('gameCategory');
    if (category) category.textContent = currentGame.category;
    document.title = currentGame.name + ' - Easy Web TV';
}

// Fullscreen promises reject when the request is not granted (policy, no user
// gesture, exiting twice via Esc) - swallow those so the console stays clean;
// the fullscreenchange handler still reports the real state.
function requestFullscreen(element) {
    var request = element.requestFullscreen || element.webkitRequestFullscreen || element.msRequestFullscreen;
    if (!request) return null;
    var result = request.call(element);
    if (result && result.catch) result.catch(function() {});
    return result;
}

function exitFullscreen() {
    var exit = document.exitFullscreen || document.webkitExitFullscreen || document.msExitFullscreen;
    if (!exit) return null;
    var result = exit.call(document);
    if (result && result.catch) result.catch(function() {});
    return result;
}

function isFullscreen() {
    return Boolean(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
}

// Toggle fullscreen
function toggleFullscreen() {
    var container = document.getElementById('gameplayContainer');
    if (!container) return;
    if (!isFullscreen()) {
        requestFullscreen(container);
    } else {
        exitFullscreen();
    }
}

// Restart the current game: the shared player re-arms the overlay and reloads
// the same URL (about:blank first, so re-opening the same src always works).
function restartGame() {
    if (!isValid) return;
    player.start();
}

// Keep the button label/icon in sync with the real fullscreen state instead of
// guessing on click (Esc leaves fullscreen without going through this page).
function updateFullscreenButton() {
    var fullscreenBtn = document.getElementById('fullscreenBtn');
    if (!fullscreenBtn) return;
    var icon = fullscreenBtn.querySelector('i');
    var span = fullscreenBtn.querySelector('span');
    var active = isFullscreen();
    if (icon) {
        icon.classList.toggle('fa-compress', active);
        icon.classList.toggle('fa-expand', !active);
    }
    if (span) span.textContent = active ? t('exitFullscreen') : t('fullscreen');
    fullscreenBtn.title = active ? t('exitFullscreen') : t('fullscreen');
    fullscreenBtn.setAttribute('aria-label', fullscreenBtn.title);
    var container = document.getElementById('gameplayContainer');
    if (container) container.classList.toggle('fullscreen', active);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Game Play Page Loaded ===');

    applyI18n();

    // Back button - go to the games page, Web Games view
    var backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = '../routes/game.html?category=webgames';
        });
    }

    // Home button - go to home page
    var homeBtn = document.getElementById('homeBtn');
    if (homeBtn) {
        homeBtn.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }

    // Restart button
    var restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', function() {
            restartGame();
        });
    }

    // Fullscreen button
    var fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            toggleFullscreen();
        });
    }

    // Listen for fullscreen changes (including Esc)
    document.addEventListener('fullscreenchange', updateFullscreenButton);
    document.addEventListener('webkitfullscreenchange', updateFullscreenButton);
    document.addEventListener('msfullscreenchange', updateFullscreenButton);
    updateFullscreenButton();

    // Keyboard shortcuts (ignored while typing in a form control)
    document.addEventListener('keydown', function(e) {
        var tag = e.target && e.target.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
        // The back/home controls are divs with role="button": Enter/Space must work.
        var role = e.target && e.target.getAttribute ? e.target.getAttribute('role') : null;
        if (role === 'button' && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            e.target.click();
            return;
        }
        // ESC - leave fullscreen
        if (e.key === 'Escape') {
            if (isFullscreen()) toggleFullscreen();
            return;
        }
        // R - restart
        if (e.key === 'r' || e.key === 'R') {
            restartGame();
            return;
        }
        // F - fullscreen
        if (e.key === 'f' || e.key === 'F') {
            toggleFullscreen();
        }
    });

    // Unknown or missing ?game= key: report it instead of launching game #1.
    if (!isValid) {
        showInvalidGame();
        return;
    }

    applyGameInfo();
    player.start();
});
