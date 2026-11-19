// Web Game Page JavaScript - a generic hot-link player for classic
// open-source web games. Each game runs from its author's official demo
// site in an iframe; nothing is bundled here. The registry below maps
// ?game=<key> to the upstream URL, title and license.

var WEBGAME_REGISTRY = {
    '2048':          { name: '2048',           url: 'https://devrsi0n.github.io/React-2048-game/',        repo: 'devrsi0n/React-2048-game',  license: 'MIT' },
    'pacman':        { name: 'Pac-Man',        url: 'https://masonicgit.github.io/pacman/',               repo: 'masonicGIT/pacman',         license: 'GPL-3.0' },
    'trex':          { name: 'T-Rex Runner',   url: 'https://wayou.github.io/t-rex-runner/',              repo: 'wayou/t-rex-runner',        license: 'BSD-3-Clause' },
    'spaceinvaders': { name: 'Space Invaders', url: 'https://dwmkerr.github.io/spaceinvaders/',           repo: 'dwmkerr/spaceinvaders',     license: 'MIT' },
    'skifree':       { name: 'SkiFree',        url: 'https://basicallydan.github.io/skifree.js/',         repo: 'basicallydan/skifree.js',   license: 'MIT' },
    'floppybird':    { name: 'Flappy Bird',    url: 'https://nebez.github.io/floppybird/',                repo: 'nebez/floppybird',          license: 'Apache-2.0' },
    'hexgl':         { name: 'HexGL',          url: 'https://hexgl.bkcore.com/play/',                     repo: 'BKcore/HexGL',              license: 'MIT' },
    'astray':        { name: 'Astray',         url: 'https://wwwtyro.github.io/Astray/',                  repo: 'wwwtyro/Astray',            license: 'Unlicense' },
    'q1k3':          { name: 'Q1K3',           url: 'https://phoboslab.org/q1k3/',                        repo: 'phoboslab/q1k3',            license: 'MIT' },
    'underrun':      { name: 'Underrun',       url: 'https://phoboslab.org/underrun/',                    repo: 'phoboslab/underrun',        license: 'MIT' }
};

// Internationalization (8 languages, same key set as topalm.js)
var i18n = {
    zh: {
        pageTitle: '网页游戏',
        reset: '重置',
        tabDemo: '游戏',
        demoTitle: '网页游戏',
        demoDesc: '在浏览器里游玩经典开源网页游戏，热链嵌入各项目官方演示站点。本应用不内置任何游戏——每款游戏都直接从作者的托管构建加载。',
        demoOpen: '启动游戏',
        demoHint: '所有游戏均为开源项目（MIT / GPL / BSD / Apache）。游戏清单与许可见应用 README。与任何游戏作者无隶属关系。',
        invalidGame: '找不到这个游戏，请从游戏列表中重新选择。',
        loading: '游戏启动中，请稍候...',
        loadingTip: '游戏从其托管站点加载，首次启动可能较慢',
        loadingSlow: '加载较慢，请耐心等待；也可以在新标签页打开',
        openInNewTab: '在新标签页打开游戏 ↗',
        instructions: '使用说明',
        controlsTitle: '操作方式',
        controlsHint1: '大多数游戏使用方向键加空格/回车，部分游戏支持触摸',
        controlsHint2: '先点击游戏区域让游戏获得键盘输入；按 Esc 或使用重置按钮返回本页',
        aboutTitle: '关于',
        aboutHint: '经典开源网页游戏合集：2048、吃豆人、T-Rex Runner、太空侵略者、SkiFree、Flappy Bird、HexGL、Astray、Q1K3、Underrun——全部热链自官方演示站点。',
        playing: '正在运行：',
        fullscreen: '全屏'
    },
    en: {
        pageTitle: 'Web Game',
        reset: 'Reset',
        tabDemo: 'Game',
        demoTitle: 'Web Game',
        demoDesc: "Play classic open-source web games in your browser, embedded by hotlink from each project's official demo site. Nothing is bundled - every game runs directly from its author's hosted build.",
        demoOpen: 'Launch Game',
        demoHint: 'All games are open source (MIT / GPL / BSD / Apache). The list of games and their licenses is in the app README. Not affiliated with any game author.',
        invalidGame: 'That game was not found. Please choose one from the game list.',
        loading: 'Starting the game, please wait...',
        loadingTip: 'The game loads from its host site; first launch can take a while',
        loadingSlow: 'Still loading - please wait a bit longer, or open it in a new tab',
        openInNewTab: 'Open the game in a new tab ↗',
        instructions: 'Instructions',
        controlsTitle: 'Controls',
        controlsHint1: 'Most games use the arrow keys plus Space/Enter; some also support touch',
        controlsHint2: 'Click inside the game area first so it receives keyboard input; press Esc or use the Reset button to come back here',
        aboutTitle: 'About',
        aboutHint: 'A collection of classic open-source web games: 2048, Pac-Man, T-Rex Runner, Space Invaders, SkiFree, Flappy Bird, HexGL, Astray, Q1K3 and Underrun - all hot-linked from their official demo sites.',
        playing: 'Now running: ',
        fullscreen: 'Fullscreen'
    },ja: {
        pageTitle: 'Web ゲーム',
        reset: 'リセット',
        tabDemo: 'ゲーム',
        demoTitle: 'Web ゲーム',
        demoDesc: 'オープンソースの定番 Web ゲームをブラウザで直接プレイ。各プロジェクトの公式デモサイトへのホットリンク埋め込みで、アプリ本体には何も同梱されていません。',
        demoOpen: 'ゲームを起動',
        demoHint: 'すべてのゲームはオープンソース（MIT / GPL / BSD / Apache）です。ゲーム一覧とライセンスはアプリの README を参照してください。各ゲーム作者とは無関係です。',
        invalidGame: 'そのゲームは見つかりません。ゲーム一覧から選び直してください。',
        loading: 'ゲームを起動中...',
        loadingTip: 'ゲームはホストサイトから読み込まれます。初回は時間がかかることがあります',
        loadingSlow: '読み込みが遅い場合はそのままお待ちいただくか、新しいタブで開いてください',
        openInNewTab: '新しいタブで開く ↗',
        instructions: '使い方',
        controlsTitle: '操作方法',
        controlsHint1: '多くのゲームは矢印キーと Space/Enter で操作します。タッチ対応のものもあります',
        controlsHint2: '先にゲーム領域をクリックしてキーボード入力を渡してください。Esc またはリセットボタンでこの画面に戻ります',
        aboutTitle: 'について',
        aboutHint: '定番オープンソース Web ゲーム集：2048、パックマン、T-Rex Runner、スペースインベーダー、SkiFree、Flappy Bird、HexGL、Astray、Q1K3、Underrun - すべて公式デモサイトへのホットリンク。',
        playing: '実行中：',
        fullscreen: '全画面'
    },
    ko: {
        pageTitle: '웹 게임',
        reset: '재설정',
        tabDemo: '게임',
        demoTitle: '웹 게임',
        demoDesc: '오픈소스 클래식 웹 게임을 브라우저에서 바로 즐기세요. 각 프로젝트의 공식 데모 사이트를 핫링크로 임베드하며, 앱에는 어떤 게임도 포함되어 있지 않습니다.',
        demoOpen: '게임 실행',
        demoHint: '모든 게임은 오픈소스(MIT / GPL / BSD / Apache)입니다. 게임 목록과 라이선스는 앱 README를 참고하세요. 각 게임 작성자와는 무관합니다.',
        invalidGame: '해당 게임을 찾을 수 없습니다. 게임 목록에서 다시 선택하세요.',
        loading: '게임 시작 중...',
        loadingTip: '게임은 호스트 사이트에서 로드되며 첫 실행은 느릴 수 있습니다',
        loadingSlow: '로딩이 느립니다. 조금 더 기다리시거나 새 탭에서 여세요',
        openInNewTab: '새 탭에서 열기 ↗',
        instructions: '사용 방법',
        controlsTitle: '조작 방법',
        controlsHint1: '대부분의 게임은 방향키와 Space/Enter로 조작하며, 일부는 터치도 지원합니다',
        controlsHint2: '먼저 게임 영역을 클릭해 키보드 입력을 받게 하세요. Esc 또는 재설정 버튼으로 돌아옵니다',
        aboutTitle: '정보',
        aboutHint: '클래식 오픈소스 웹 게임 모음: 2048, 팩맨, T-Rex Runner, 스페이스 인베이더, SkiFree, Flappy Bird, HexGL, Astray, Q1K3, Underrun - 모두 공식 데모 사이트 핫링크.',
        playing: '실행 중: ',
        fullscreen: '전체 화면'
    },fr: {
        pageTitle: 'Jeu Web',
        reset: 'Réinitialiser',
        tabDemo: 'Jeu',
        demoTitle: 'Jeu Web',
        demoDesc: "Jouez aux grands classiques du jeu web open source directement dans votre navigateur, intégrés par lien direct depuis le site de démonstration officiel de chaque projet. Rien n'est embarqué - chaque jeu s'exécute depuis le build hébergé par son auteur.",
        demoOpen: 'Lancer le jeu',
        demoHint: "Tous les jeux sont open source (MIT / GPL / BSD / Apache). La liste des jeux et leurs licences figure dans le README de l'application. Sans affiliation avec les auteurs des jeux.",
        invalidGame: "Jeu introuvable. Choisissez-en un dans la liste des jeux.",
        loading: 'Démarrage du jeu, veuillez patienter...',
        loadingTip: "Le jeu se charge depuis son site hôte ; le premier lancement peut être long",
        loadingSlow: 'Chargement toujours en cours - patientez encore un peu, ou ouvrez-le dans un nouvel onglet',
        openInNewTab: 'Ouvrir le jeu dans un nouvel onglet ↗',
        instructions: 'Instructions',
        controlsTitle: 'Commandes',
        controlsHint1: "La plupart des jeux utilisent les flèches plus Espace/Entrée ; certains gèrent le tactile",
        controlsHint2: "Cliquez d'abord dans la zone de jeu pour qu'elle reçoive le clavier ; Échap ou le bouton Réinitialiser revient ici",
        aboutTitle: 'À propos',
        aboutHint: 'Une collection de classiques du jeu web open source : 2048, Pac-Man, T-Rex Runner, Space Invaders, SkiFree, Flappy Bird, HexGL, Astray, Q1K3 et Underrun - tous en lien direct depuis leurs sites de démonstration officiels.',
        playing: 'En cours : ',
        fullscreen: 'Plein écran'
    },
    de: {
        pageTitle: 'Web-Spiel',
        reset: 'Zurücksetzen',
        tabDemo: 'Spiel',
        demoTitle: 'Web-Spiel',
        demoDesc: 'Spiele klassische Open-Source-Webgames direkt im Browser, per Hotlink von der offiziellen Demo-Seite jedes Projekts eingebettet. Nichts ist mitgeliefert - jedes Spiel läuft direkt aus dem vom Autor gehosteten Build.',
        demoOpen: 'Spiel starten',
        demoHint: 'Alle Spiele sind Open Source (MIT / GPL / BSD / Apache). Die Liste der Spiele und ihrer Lizenzen steht in der README der App. Keine Verbindung zu den Spiele-Autoren.',
        invalidGame: 'Spiel nicht gefunden. Bitte wähle ein Spiel aus der Liste.',
        loading: 'Spiel wird gestartet, bitte warten...',
        loadingTip: 'Das Spiel lädt von seiner Host-Seite; der erste Start kann dauern',
        loadingSlow: 'Lädt noch - bitte etwas länger warten oder in einem neuen Tab öffnen',
        openInNewTab: 'Spiel in neuem Tab öffnen ↗',
        instructions: 'Anleitung',
        controlsTitle: 'Steuerung',
        controlsHint1: 'Die meisten Spiele nutzen die Pfeiltasten plus Leertaste/Enter; einige unterstützen Touch',
        controlsHint2: 'Klicke zuerst in den Spielbereich, damit er Tastatureingaben erhält; Esc oder der Zurücksetzen-Knopf führt hierher zurück',
        aboutTitle: 'Über',
        aboutHint: 'Eine Sammlung klassischer Open-Source-Webgames: 2048, Pac-Man, T-Rex Runner, Space Invaders, SkiFree, Flappy Bird, HexGL, Astray, Q1K3 und Underrun - alle per Hotlink von ihren offiziellen Demo-Seiten.',
        playing: 'Läuft: ',
        fullscreen: 'Vollbild'
    },es: {
        pageTitle: 'Juego Web',
        reset: 'Reiniciar',
        tabDemo: 'Juego',
        demoTitle: 'Juego Web',
        demoDesc: 'Juega a los clásicos del juego web de código abierto directamente en tu navegador, incrustados por enlace directo desde el sitio de demostración oficial de cada proyecto. Nada está incluido: cada juego se ejecuta desde el build alojado por su autor.',
        demoOpen: 'Iniciar juego',
        demoHint: 'Todos los juegos son de código abierto (MIT / GPL / BSD / Apache). La lista de juegos y sus licencias está en el README de la app. Sin afiliación con los autores.',
        invalidGame: 'No se encontró ese juego. Elige uno de la lista de juegos.',
        loading: 'Iniciando el juego, espera por favor...',
        loadingTip: 'El juego se carga desde su sitio anfitrión; el primer arranque puede tardar',
        loadingSlow: 'Sigue cargando - espera un poco más o ábrelo en una pestaña nueva',
        openInNewTab: 'Abrir el juego en una pestaña nueva ↗',
        instructions: 'Instrucciones',
        controlsTitle: 'Controles',
        controlsHint1: 'La mayoría de los juegos usan las flechas más Espacio/Enter; algunos también soportan táctil',
        controlsHint2: 'Haz clic primero en el área del juego para que reciba el teclado; Esc o el botón Reiniciar vuelve aquí',
        aboutTitle: 'Acerca de',
        aboutHint: 'Una colección de clásicos del juego web de código abierto: 2048, Pac-Man, T-Rex Runner, Space Invaders, SkiFree, Flappy Bird, HexGL, Astray, Q1K3 y Underrun, todos con enlace directo desde sus sitios de demostración oficiales.',
        playing: 'En ejecución: ',
        fullscreen: 'Pantalla completa'
    },
    ru: {
        pageTitle: 'Веб-игра',
        reset: 'Сброс',
        tabDemo: 'Игра',
        demoTitle: 'Веб-игра',
        demoDesc: 'Играйте в классические веб-игры с открытым кодом прямо в браузере - встраивание горячей ссылкой с официального демо-сайта каждого проекта. Ничего не поставляется в комплекте: каждая игра загружается прямо из сборки автора.',
        demoOpen: 'Запустить игру',
        demoHint: 'Все игры с открытым кодом (MIT / GPL / BSD / Apache). Список игр и их лицензий есть в README приложения. Проект не связан с авторами игр.',
        invalidGame: 'Игра не найдена. Выберите игру из списка.',
        loading: 'Запуск игры, подождите...',
        loadingTip: 'Игра загружается с сайта-хоста; первый запуск может быть долгим',
        loadingSlow: 'Всё ещё загружается - подождите немного или откройте в новой вкладке',
        openInNewTab: 'Открыть игру в новой вкладке ↗',
        instructions: 'Инструкции',
        controlsTitle: 'Управление',
        controlsHint1: 'Большинство игр используют стрелки плюс Space/Enter; некоторые поддерживают касания',
        controlsHint2: 'Сначала кликните в области игры, чтобы она получала ввод с клавиатуры; Esc или кнопка сброса вернут вас сюда',
        aboutTitle: 'О игре',
        aboutHint: 'Коллекция классических веб-игр с открытым кодом: 2048, Pac-Man, T-Rex Runner, Space Invaders, SkiFree, Flappy Bird, HexGL, Astray, Q1K3 и Underrun - все по горячей ссылке с официальных демо-сайтов.',
        playing: 'Запущено: ',
        fullscreen: 'Полный экран'
    }
};// ---- helpers -----------------------------------------------------------
function $(id) { return document.getElementById(id); }
var currentLang = (localStorage.getItem('ewtv-lang') || 'en').split('-')[0];
if (!i18n[currentLang]) currentLang = 'en';

function t(key) { return (i18n[currentLang] && i18n[currentLang][key]) || i18n.en[key] || key; }

function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (i18n[currentLang] && i18n[currentLang][key]) el.textContent = i18n[currentLang][key];
    });
    document.documentElement.lang = currentLang;
}

function showToast(msg) {
    var toast = $('toast');
    if (!toast) return;
    $('toastMessage').textContent = msg;
    toast.classList.remove('hidden');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () { toast.classList.add('hidden'); }, 3000);
}

// ---- game resolution ----------------------------------------------------
// Resolve ?game=<key> from the URL. A missing/unknown key is an explicit
// invalid state: never silently launch a different game such as 2048.
var currentGameKey = new URLSearchParams(window.location.search).get('game');
var isCurrentGameValid = Boolean(currentGameKey && WEBGAME_REGISTRY[currentGameKey]);
var currentGame = isCurrentGameValid ? WEBGAME_REGISTRY[currentGameKey] : { name: t('invalidGame'), url: '' };
var WEBGAME_BASE = currentGame.url;

// ---- tab switching (single tab, kept for structural parity) -----------
document.querySelectorAll('.upload-tab').forEach(function (el) {
    el.addEventListener('click', function () {
        document.querySelectorAll('.upload-tab').forEach(function (tab) {
            tab.classList.toggle('active', tab === el);
        });
    });
});

// ---- player ------------------------------------------------------------
var slowTimer = null;
function hideOverlay() {
    var overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
        var link = document.getElementById('slowOpenLink');
        if (link && link.parentNode) link.parentNode.removeChild(link);
    }
    if (slowTimer) { clearTimeout(slowTimer); slowTimer = null; }
}

// After 15s of pending load, surface a real way out: a direct link to the
// upstream game in a new tab (matches the loadingSlow copy).
function showSlowLink() {
    var overlay = document.getElementById('loadingOverlay');
    if (!overlay || document.getElementById('slowOpenLink')) return;
    var link = document.createElement('a');
    link.id = 'slowOpenLink';
    link.href = WEBGAME_BASE;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = t('openInNewTab');
    link.style.cssText = 'display:inline-block;margin-top:14px;color:#33ff66;text-decoration:underline;font-size:14px;';
    overlay.appendChild(link);
}

function showPlayer(title) {
    document.getElementById('uploadSection').classList.add('hidden');
    document.getElementById('playerSection').classList.add('active');
    document.getElementById('pageTitle').textContent = t('playing') + (title || currentGame.name);
    document.getElementById('resetBtn').style.display = '';
    document.getElementById('fullscreenBtn').style.display = '';
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

function playWebgame() {
    var frame = document.getElementById('webgameFrame');
    if (!frame) return;
    if (!isCurrentGameValid) {
        showToast(t('invalidGame'));
        return;
    }
    showPlayer(currentGame.name);
    frame.addEventListener('load', hideOverlay, { once: true });
    frame.src = WEBGAME_BASE;
    slowTimer = setTimeout(function () {
        showToast(t('loadingSlow'));
        showSlowLink();
    }, 15000);
}

function stopPlayback() {
    var frame = document.getElementById('webgameFrame');
    if (frame) frame.src = 'about:blank';
    hideOverlay();
    document.getElementById('playerSection').classList.remove('active');
    document.getElementById('uploadSection').classList.remove('hidden');
    document.getElementById('pageTitle').textContent = t('pageTitle');
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('fullscreenBtn').style.display = 'none';
}

// ---- fullscreen --------------------------------------------------------
// Most of these games do not ship their own fullscreen control, so the host
// page requests fullscreen on the iframe itself (allowed via allowfullscreen).
document.getElementById('fullscreenBtn').addEventListener('click', function () {
    var frame = document.getElementById('webgameFrame');
    if (!frame) return;
    if (document.fullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen();
    } else if (frame.requestFullscreen) {
        frame.requestFullscreen();
    } else if (frame.webkitRequestFullscreen) {
        frame.webkitRequestFullscreen();
    }
});

// ---- demo tab ----------------------------------------------------------
var demoOpenBtn = document.getElementById('demoOpenBtn');
if (isCurrentGameValid) {
    demoOpenBtn.addEventListener('click', playWebgame);
} else {
    demoOpenBtn.disabled = true;
    demoOpenBtn.title = t('invalidGame');
    showToast(t('invalidGame'));
}

// ---- back / reset ------------------------------------------------------
document.getElementById('backBtn').addEventListener('click', function () {
    var playerSection = document.getElementById('playerSection');
    if (playerSection.classList.contains('active')) { stopPlayback(); return; }
    window.location.href = '../routes/game.html?category=webgames';
});
document.getElementById('resetBtn').addEventListener('click', stopPlayback);

// ---- instructions toggle ----------------------------------------------
document.getElementById('instructionsHeader').addEventListener('click', function () {
    document.getElementById('instructionsContent').classList.toggle('hidden');
    var icon = document.getElementById('instructionsToggle');
    if (icon) {
        icon.style.transform = document.getElementById('instructionsContent').classList.contains('hidden') ? '' : 'rotate(180deg)';
    }
});

// ---- init --------------------------------------------------------------
// Show the resolved game name on the start screen and document.title.
var pageTitle = isCurrentGameValid ? currentGame.name + ' - Easy Web TV' : t('pageTitle') + ' - Easy Web TV';
document.title = pageTitle;
(function () {
    var title = document.querySelector('.upload-title');
    if (title) title.textContent = isCurrentGameValid ? currentGame.name : t('pageTitle');
    var icon = document.querySelector('.upload-icon i');
    if (icon) icon.className = 'fas fa-gamepad';
})();

applyI18n();