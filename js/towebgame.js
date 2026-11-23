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
    'underrun':      { name: 'Underrun',       url: 'https://phoboslab.org/underrun/',                    repo: 'phoboslab/underrun',            license: 'MIT' },
    'papertrails':   { name: 'Papertrails',    url: 'https://xikhar.github.io/papertrails/',              repo: 'xikhar/papertrails',            license: 'MIT' },
    'wusuomon':      { name: '雾锁山门',        url: 'https://op7418.github.io/guizang-game-skill/',       repo: 'op7418/guizang-game-skill',   license: 'AGPL-3.0 (demo content © 2026 歸藏)' },
    // Text games (v8.6.1 batch): incremental / narrative browser games, all
    // hot-linked from their official hosted builds.
    'adarkroom':     { name: 'A Dark Room',           url: 'https://adarkroom.doublespeakgames.com/',      repo: 'doublespeakgames/adarkroom',                license: 'MPL-2.0' },
    'liferestart':   { name: '人生重开模拟器',          url: 'https://liferestart.syaro.io/',                repo: 'VickScarlet/remake',                        license: 'MIT' },
    'candybox2':     { name: 'Candy Box 2',           url: 'https://candybox2.github.io/',                 repo: 'candybox2/candybox2.github.io',             license: 'GPL-3.0' },
    'antimatter':    { name: 'Antimatter Dimensions', url: 'https://ivark.github.io/AntimatterDimensions/', repo: 'IvarK/AntimatterDimensionsSourceCode',     license: 'MIT' },
    'xiuxian':       { name: '文字修仙',               url: 'https://xiuxian.wenzi.games/',                 repo: 'setube/vue-xiuxiangame',                    license: 'CC BY-NC 4.0' }
};

// Internationalization (8 languages, same key set as topalm.js)
var i18n = {
    zh: {
        pageTitle: '网页游戏',
        reset: '重置',
        tabDemo: '游戏',
        demoTitle: '网页游戏',
        demoDesc: '在浏览器里游玩开源网页游戏和互动作品，热链嵌入各项目官方演示站点。本应用不内置任何游戏——每款作品都直接从作者的托管构建加载。',
        demoOpen: '启动游戏',
        demoHint: '所有作品均为开源或自由许可项目。游戏清单与许可见应用 README。与任何作者无隶属关系。',
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
        aboutHint: '开源网页游戏与互动作品合集：2048、吃豆人、T-Rex Runner、太空侵略者、SkiFree、Flappy Bird、HexGL、Astray、Q1K3、Underrun、Papertrails、雾锁山门，以及文字游戏 A Dark Room、人生重开模拟器、Candy Box 2、Antimatter Dimensions、文字修仙——全部热链自官方演示站点。',
        playing: '正在运行：',
        fullscreen: '全屏'
    },
    en: {
        pageTitle: 'Web Game',
        reset: 'Reset',
        tabDemo: 'Game',
        demoTitle: 'Web Game',
        demoDesc: "Play open-source web games and interactive works in your browser, embedded by hotlink from each project's official demo site. Nothing is bundled - every work runs directly from its author's hosted build.",
        demoOpen: 'Launch Game',
        demoHint: 'All works are open source or free-licensed. The list and licenses are in the app README. Not affiliated with any author.',
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
        aboutHint: 'A collection of open-source web games and interactive works: 2048, Pac-Man, T-Rex Runner, Space Invaders, SkiFree, Flappy Bird, HexGL, Astray, Q1K3, Underrun, Papertrails, Mist Gate (雾锁山门), plus the text games A Dark Room, Life Restart (人生重开模拟器), Candy Box 2, Antimatter Dimensions and Xiuxian Cultivation (文字修仙) - all hot-linked from their official demo sites.',
        playing: 'Now running: ',
        fullscreen: 'Fullscreen'
    },ja: {
        pageTitle: 'Web ゲーム',
        reset: 'リセット',
        tabDemo: 'ゲーム',
        demoTitle: 'Web ゲーム',
        demoDesc: 'オープンソースの Web ゲームとインタラクティブ作品をブラウザで直接プレイ。各プロジェクトの公式デモサイトへのホットリンク埋め込みで、アプリ本体には何も同梱されていません。',
        demoOpen: 'ゲームを起動',
        demoHint: 'すべての作品はオープンソースまたはフリーライセンスです。一覧とライセンスはアプリの README を参照してください。各作者とは無関係です。',
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
        aboutHint: 'オープンソースの Web ゲームとインタラクティブ作品集：2048、パックマン、T-Rex Runner、スペースインベーダー、SkiFree、Flappy Bird、HexGL、Astray、Q1K3、Underrun、Papertrails、雾锁山门、さらにテキストゲーム A Dark Room、人生重開模擬器（Life Restart）、Candy Box 2、Antimatter Dimensions、文字修仙 - すべて公式デモサイトへのホットリンク。',
        playing: '実行中：',
        fullscreen: '全画面'
    },
    ko: {
        pageTitle: '웹 게임',
        reset: '재설정',
        tabDemo: '게임',
        demoTitle: '웹 게임',
        demoDesc: '오픈소스 웹 게임과 인터랙티브 작품을 브라우저에서 바로 즐기세요. 각 프로젝트의 공식 데모 사이트를 핫링크로 임베드하며, 앱에는 어떤 작품도 포함되어 있지 않습니다.',
        demoOpen: '게임 실행',
        demoHint: '모든 작품은 오픈소스 또는 자유 라이선스입니다. 목록과 라이선스는 앱 README를 참고하세요. 각 작가와는 무관합니다.',
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
        aboutHint: '오픈소스 웹 게임과 인터랙티브 작품 모음: 2048, 팩맨, T-Rex Runner, 스페이스 인베이더, SkiFree, Flappy Bird, HexGL, Astray, Q1K3, Underrun, Papertrails, 雾锁山门, 그리고 텍스트 게임 A Dark Room, 인생 리스타트(Life Restart), Candy Box 2, Antimatter Dimensions, 문자수련(文字修仙) - 모두 공식 데모 사이트 핫링크.',
        playing: '실행 중: ',
        fullscreen: '전체 화면'
    },fr: {
        pageTitle: 'Jeu Web',
        reset: 'Réinitialiser',
        tabDemo: 'Jeu',
        demoTitle: 'Jeu Web',
        demoDesc: "Jouez à des jeux web open source et des œuvres interactives directement dans votre navigateur, intégrés par lien direct depuis le site de démonstration officiel de chaque projet. Rien n'est embarqué - chaque œuvre s'exécute depuis le build hébergé par son auteur.",
        demoOpen: 'Lancer le jeu',
        demoHint: "Toutes les œuvres sont open source ou sous licence libre. La liste et les licences figurent dans le README de l'application. Sans affiliation avec les auteurs.",
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
        aboutHint: 'Une collection de jeux web open source et d’œuvres interactives : 2048, Pac-Man, T-Rex Runner, Space Invaders, SkiFree, Flappy Bird, HexGL, Astray, Q1K3, Underrun, Papertrails, Mist Gate (雾锁山门), plus les jeux texte A Dark Room, Life Restart (人生重开模拟器), Candy Box 2, Antimatter Dimensions et Xiuxian Cultivation (文字修仙) - tous en lien direct depuis leurs sites de démonstration officiels.',
        playing: 'En cours : ',
        fullscreen: 'Plein écran'
    },
    de: {
        pageTitle: 'Web-Spiel',
        reset: 'Zurücksetzen',
        tabDemo: 'Spiel',
        demoTitle: 'Web-Spiel',
        demoDesc: 'Spiele Open-Source-Webgames und interaktive Werke direkt im Browser, per Hotlink von der offiziellen Demo-Seite jedes Projekts eingebettet. Nichts ist mitgeliefert - jedes Werk läuft direkt aus dem vom Autor gehosteten Build.',
        demoOpen: 'Spiel starten',
        demoHint: 'Alle Werke sind Open Source oder frei lizenziert. Die Liste und Lizenzen stehen in der README der App. Keine Verbindung zu den Autoren.',
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
        aboutHint: 'Eine Sammlung von Open-Source-Webgames und interaktiven Werken: 2048, Pac-Man, T-Rex Runner, Space Invaders, SkiFree, Flappy Bird, HexGL, Astray, Q1K3, Underrun, Papertrails, Mist Gate (雾锁山门), dazu die Textspiele A Dark Room, Life Restart (人生重开模拟器), Candy Box 2, Antimatter Dimensions und Xiuxian Cultivation (文字修仙) - alle per Hotlink von ihren offiziellen Demo-Seiten.',
        playing: 'Läuft: ',
        fullscreen: 'Vollbild'
    },es: {
        pageTitle: 'Juego Web',
        reset: 'Reiniciar',
        tabDemo: 'Juego',
        demoTitle: 'Juego Web',
        demoDesc: 'Juega a juegos web de código abierto y obras interactivas directamente en tu navegador, incrustados por enlace directo desde el sitio de demostración oficial de cada proyecto. Nada está incluido: cada obra se ejecuta desde el build alojado por su autor.',
        demoOpen: 'Iniciar juego',
        demoHint: 'Todas las obras son de código abierto o de licencia libre. La lista y las licencias están en el README de la app. Sin afiliación con los autores.',
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
        aboutHint: 'Una colección de juegos web de código abierto y obras interactivas: 2048, Pac-Man, T-Rex Runner, Space Invaders, SkiFree, Flappy Bird, HexGL, Astray, Q1K3, Underrun, Papertrails, Mist Gate (雾锁山门), más los juegos de texto A Dark Room, Life Restart (人生重开模拟器), Candy Box 2, Antimatter Dimensions y Xiuxian Cultivation (文字修仙), todos con enlace directo desde sus sitios de demostración oficiales.',
        playing: 'En ejecución: ',
        fullscreen: 'Pantalla completa'
    },
    ru: {
        pageTitle: 'Веб-игра',
        reset: 'Сброс',
        tabDemo: 'Игра',
        demoTitle: 'Веб-игра',
        demoDesc: 'Играйте в веб-игры с открытым кодом и интерактивные работы прямо в браузере - встраивание горячей ссылкой с официального демо-сайта каждого проекта. Ничего не поставляется в комплекте: каждая работа загружается прямо из сборки автора.',
        demoOpen: 'Запустить игру',
        demoHint: 'Все работы имеют открытый код или свободную лицензию. Список и лицензии есть в README приложения. Проект не связан с авторами.',
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
        aboutHint: 'Коллекция веб-игр с открытым кодом и интерактивных работ: 2048, Pac-Man, T-Rex Runner, Space Invaders, SkiFree, Flappy Bird, HexGL, Astray, Q1K3, Underrun, Papertrails, Mist Gate (雾锁山门), а также текстовые игры A Dark Room, Life Restart (人生重开模拟器), Candy Box 2, Antimatter Dimensions и Xiuxian Cultivation (文字修仙) - все по горячей ссылке с официальных демо-сайтов.',
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