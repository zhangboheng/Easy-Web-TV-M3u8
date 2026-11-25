// Diablo Page JavaScript - diabloweb (WebAssembly build of the source-released
// Devilution engine, by d07RiV) embedded by hotlink to its official demo site.
// No game data is bundled here: the shareware episode is hosted upstream and
// users must supply their own DIABDAT.MPQ for the full game.

var DIABLO_BASE = 'https://d07riv.github.io/diabloweb/';

// Internationalization (8 languages, same key set as topalm.js)
var i18n = {
    zh: {
        pageTitle: '暗黑破坏神',
        reset: '重置',
        tabDemo: '模拟器',
        demoTitle: '暗黑破坏神',
        demoDesc: '通过 diabloweb（基于开源的 Devilution 引擎编译为 WebAssembly，热链嵌入官方演示站）在浏览器里直接运行 1996 年的《暗黑破坏神》。试玩版已包含，可立即开始。',
        demoOpen: '启动游戏',
        demoHint: '试玩版可直接游玩；完整版需要你自备正版游戏的 DIABDAT.MPQ 文件。暴雪未认可此产品。',
        loading: 'diabloweb 启动中，请稍候...',
        loadingTip: '游戏从其服务器加载，首次启动可能较慢',
        loadingSlow: '加载较慢，请耐心等待；也可以在新标签页打开',
        openInNewTab: '在新标签页打开 ↗',
        instructions: '使用说明',
        controlsTitle: '操作方式',
        controlsHint1: '用鼠标移动与攻击，也可使用游戏内菜单的键盘快捷键',
        controlsHint2: '选择职业后点击地面移动、点击怪物攻击；按 Esc 打开菜单，在角色面板分配技能点',
        aboutTitle: '关于',
        aboutHint: '暗黑破坏神：1996 年暴雪的动作角色扮演游戏。网页版为 diabloweb（WebAssembly，基于开源的 Devilution 引擎），热链嵌入其官方演示页面。',
        playing: '正在运行：',
        fullscreen: '全屏'
    },
    en: {
        pageTitle: 'Diablo',
        reset: 'Reset',
        tabDemo: 'Emulator',
        demoTitle: 'Diablo',
        demoDesc: 'Play the original 1996 Diablo in your browser with diabloweb (a WebAssembly build of the open-source Devilution engine, embedded by hotlink to its official demo site). The shareware episode is included and starts instantly.',
        demoOpen: 'Launch Game',
        demoHint: "The shareware episode plays right away. For the full game you must supply your own DIABDAT.MPQ from a copy of Diablo you own. Not endorsed by Blizzard.",
        loading: 'Starting diabloweb, please wait...',
        loadingTip: 'The game loads from its host; first launch can take a while',
        loadingSlow: 'Still loading - please wait a bit longer, or open it in a new tab',
        openInNewTab: 'Open in a new tab ↗',
        instructions: 'Instructions',
        controlsTitle: 'Controls',
        controlsHint1: 'Move and attack with the mouse, or use the keyboard shortcuts from the in-game menu',
        controlsHint2: 'Pick a class, then click to move and click a monster to attack; press Esc for the menu and open the character sheet to spend skill points',
        aboutTitle: 'About',
        aboutHint: 'Diablo: the 1996 action RPG from Blizzard. The browser build is diabloweb (WebAssembly, based on the open-source Devilution engine), embedded by hotlink to its official demo page.',
        playing: 'Now running: ',
        fullscreen: 'Fullscreen'
    },
    ja: {
        pageTitle: 'ディアブロ',
        reset: 'リセット',
        tabDemo: 'エミュレータ',
        demoTitle: 'ディアブロ',
        demoDesc: 'diabloweb（オープンソースの Devilution エンジンを WebAssembly にビルド、公式デモサイトへのホットリンク埋め込み）で、1996 年の『ディアブロ』をブラウザ上で直接プレイ。シェアウェア版が含まれ、すぐに開始できます。',
        demoOpen: 'ゲームを起動',
        demoHint: 'シェアウェア版はすぐに遊べます。完全版には、お持ちの正規版の DIABDAT.MPQ が必要です。Blizzard の公認製品ではありません。',
        loading: 'diabloweb を起動中...',
        loadingTip: 'ゲームはホストから読み込まれます。初回の起動は時間がかかることがあります',
        loadingSlow: '読み込みが遅い場合はそのままお待ちいただくか、新しいタブで開いてください',
        openInNewTab: '新しいタブで開く ↗',
        instructions: '使い方',
        controlsTitle: '操作方法',
        controlsHint1: 'マウスで移動と攻撃、またはゲーム内メニューのキーボードショートカットを使用',
        controlsHint2: 'クラスを選び、地面をクリックで移動、モンスターをクリックで攻撃。Esc でメニュー、キャラクターシートでスキルポイントを割り振ります',
        aboutTitle: 'について',
        aboutHint: 'ディアブロ：1996 年の Blizzard のアクション RPG。Web 版は diabloweb（WebAssembly、オープンソースの Devilution エンジンベース）をホットリンクで提供、公式デモページに埋め込み。',
        playing: '実行中：',
        fullscreen: '全画面'
    },
    ko: {
        pageTitle: '디아블로',
        reset: '재설정',
        tabDemo: '에뮬레이터',
        demoTitle: '디아블로',
        demoDesc: 'diabloweb(오픈소스 Devilution 엔진을 WebAssembly로 빌드, 공식 데모 사이트 핫링크 임베드)으로 1996년 『디아블로』를 브라우저에서 바로 실행합니다. 셰어웨어판이 포함되어 즉시 시작할 수 있습니다.',
        demoOpen: '게임 실행',
        demoHint: '셰어웨어판은 바로 플레이할 수 있습니다. 전체 게임은 보유한 정품의 DIABDAT.MPQ가 필요합니다. Blizzard의 공식 제품이 아닙니다.',
        loading: 'diabloweb 시작 중...',
        loadingTip: '게임은 호스트에서 로드되며 첫 실행은 느릴 수 있습니다',
        loadingSlow: '로딩이 느립니다. 조금 더 기다리시거나 새 탭에서 여세요',
        openInNewTab: '새 탭에서 열기 ↗',
        instructions: '사용 방법',
        controlsTitle: '조작 방법',
        controlsHint1: '마우스로 이동과 공격, 또는 게임 내 메뉴의 키보드 단축키 사용',
        controlsHint2: '직업을 선택한 뒤 클릭으로 이동하고 몬스터를 클릭해 공격하세요. Esc로 메뉴, 캐릭터 시트에서 스킬 포인트를 투자합니다',
        aboutTitle: '정보',
        aboutHint: '디아블로: 1996년 Blizzard의 액션 RPG. 웹 버전은 diabloweb(WebAssembly, 오픈소스 Devilution 엔진 기반)을 공식 데모 페이지에 핫링크로 임베드했습니다.',
        playing: '실행 중: ',
        fullscreen: '전체 화면'
    },
    fr: {
        pageTitle: 'Diablo',
        reset: 'Réinitialiser',
        tabDemo: 'Émulateur',
        demoTitle: 'Diablo',
        demoDesc: "Jouez au Diablo original de 1996 dans votre navigateur avec diabloweb (build WebAssembly du moteur open source Devilution, intégré par lien direct à son site de démonstration officiel). L'épisode shareware est inclus et démarre immédiatement.",
        demoOpen: 'Lancer le jeu',
        demoHint: "L'épisode shareware est jouable tout de suite. Pour le jeu complet, fournissez votre propre DIABDAT.MPQ issu d'une copie de Diablo que vous possédez. Non approuvé par Blizzard.",
        loading: 'Démarrage de diabloweb, veuillez patienter...',
        loadingTip: 'Le jeu se charge depuis son hôte ; le premier lancement peut être long',
        loadingSlow: 'Chargement toujours en cours - patientez encore un peu, ou ouvrez-le dans un nouvel onglet',
        openInNewTab: 'Ouvrir dans un nouvel onglet ↗',
        instructions: 'Instructions',
        controlsTitle: 'Commandes',
        controlsHint1: 'Déplacez-vous et attaquez à la souris, ou utilisez les raccourcis clavier du menu du jeu',
        controlsHint2: 'Choisissez une classe, cliquez pour vous déplacer et cliquez sur un monstre pour attaquer ; Échap ouvre le menu, la fiche de personnage sert à répartir les points de compétence',
        aboutTitle: 'À propos',
        aboutHint: "Diablo : l'action-RPG de 1996 de Blizzard. La version navigateur est diabloweb (WebAssembly, basée sur le moteur open source Devilution), intégrée par lien direct à sa page de démonstration officielle.",
        playing: 'En cours : ',
        fullscreen: 'Plein écran'
    },
    de: {
        pageTitle: 'Diablo',
        reset: 'Zurücksetzen',
        tabDemo: 'Emulator',
        demoTitle: 'Diablo',
        demoDesc: 'Spiele das originale Diablo von 1996 im Browser mit diabloweb (ein WebAssembly-Build der Open-Source-Engine Devilution, per Hotlink zur offiziellen Demo-Seite eingebettet). Die Shareware-Episode ist enthalten und startet sofort.',
        demoOpen: 'Spiel starten',
        demoHint: 'Die Shareware-Episode ist sofort spielbar. Für das vollständige Spiel benötigst du eine eigene DIABDAT.MPQ aus einer legal erworbenen Diablo-Kopie. Nicht von Blizzard anerkannt.',
        loading: 'diabloweb wird gestartet, bitte warten...',
        loadingTip: 'Das Spiel lädt vom Host; der erste Start kann dauern',
        loadingSlow: 'Lädt noch - bitte etwas länger warten oder in einem neuen Tab öffnen',
        openInNewTab: 'In neuem Tab öffnen ↗',
        instructions: 'Anleitung',
        controlsTitle: 'Steuerung',
        controlsHint1: 'Bewegen und angreifen mit der Maus oder über die Tastaturkürzel im Spielmenü',
        controlsHint2: 'Klasse wählen, dann klicken zum Bewegen und Monster anklicken zum Angreifen; Esc öffnet das Menü, im Charakterbogen werden Fertigkeitspunkte verteilt',
        aboutTitle: 'Über',
        aboutHint: 'Diablo: das Action-RPG von 1996 von Blizzard. Die Browser-Version ist diabloweb (WebAssembly, basierend auf der Open-Source-Engine Devilution), per Hotlink zur offiziellen Demo-Seite eingebettet.',
        playing: 'Läuft: ',
        fullscreen: 'Vollbild'
    },
    es: {
        pageTitle: 'Diablo',
        reset: 'Reiniciar',
        tabDemo: 'Emulador',
        demoTitle: 'Diablo',
        demoDesc: 'Juega al Diablo original de 1996 en tu navegador con diabloweb (una compilación WebAssembly del motor de código abierto Devilution, incrustada por enlace directo a su sitio de demostración oficial). El episodio shareware está incluido y arranca al instante.',
        demoOpen: 'Iniciar juego',
        demoHint: 'El episodio shareware se juega de inmediato. Para el juego completo debes aportar tu propio DIABDAT.MPQ de una copia de Diablo que poseas. No respaldado por Blizzard.',
        loading: 'Iniciando diabloweb, espera por favor...',
        loadingTip: 'El juego se carga desde su host; el primer arranque puede tardar',
        loadingSlow: 'Sigue cargando - espera un poco más o ábrelo en una pestaña nueva',
        openInNewTab: 'Abrir en una pestaña nueva ↗',
        instructions: 'Instrucciones',
        controlsTitle: 'Controles',
        controlsHint1: 'Muévete y ataca con el ratón, o usa los atajos de teclado del menú del juego',
        controlsHint2: 'Elige una clase, luego haz clic para moverte y clic en un monstruo para atacar; Esc abre el menú y la hoja de personaje sirve para repartir puntos de habilidad',
        aboutTitle: 'Acerca de',
        aboutHint: 'Diablo: el RPG de acción de 1996 de Blizzard. La versión web es diabloweb (WebAssembly, basada en el motor de código abierto Devilution), incrustada por enlace directo a su página de demostración oficial.',
        playing: 'En ejecución: ',
        fullscreen: 'Pantalla completa'
    },
    ru: {
        pageTitle: 'Diablo',
        reset: 'Сброс',
        tabDemo: 'Эмулятор',
        demoTitle: 'Diablo',
        demoDesc: 'Играйте в оригинальный Diablo 1996 года прямо в браузере с diabloweb (сборка WebAssembly на основе открытого движка Devilution, встраивание горячей ссылкой на официальный демо-сайт). Эпизод shareware включён и запускается сразу.',
        demoOpen: 'Запустить игру',
        demoHint: 'Эпизод shareware доступен сразу. Для полной игры нужен собственный DIABDAT.MPQ из легально приобретённой копии Diablo. Продукт не одобрен Blizzard.',
        loading: 'Запуск diabloweb, подождите...',
        loadingTip: 'Игра загружается с сервера проекта; первый запуск может быть долгим',
        loadingSlow: 'Всё ещё загружается - подождите немного или откройте в новой вкладке',
        openInNewTab: 'Открыть в новой вкладке ↗',
        instructions: 'Инструкции',
        controlsTitle: 'Управление',
        controlsHint1: 'Двигайтесь и атакуйте мышью или используйте горячие клавиши из меню игры',
        controlsHint2: 'Выберите класс, затем кликайте для движения и по монстру для атаки; Esc открывает меню, на вкладке персонажа распределяются очки навыков',
        aboutTitle: 'О игре',
        aboutHint: 'Diablo: экшен-RPG 1996 года от Blizzard. Веб-версия - diabloweb (WebAssembly, на основе открытого движка Devilution), встроена горячей ссылкой на официальную демо-страницу.',
        playing: 'Запущено: ',
        fullscreen: 'Полный экран'
    }
};
// ---- helpers -----------------------------------------------------------
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

// ---- tab switching (single tab, kept for structural parity) -----------
document.querySelectorAll('.upload-tab').forEach(function (el) {
    el.addEventListener('click', function () {
        document.querySelectorAll('.upload-tab').forEach(function (tab) {
            tab.classList.toggle('active', tab === el);
        });
    });
});

// ---- player ------------------------------------------------------------
var player = HotlinkPlayer.createPlayer({
    frameId: 'diabloFrame', overlayId: 'loadingOverlay', url: DIABLO_BASE, newTabUrl: DIABLO_BASE
});

function showPlayer(title) {
    document.getElementById('uploadSection').classList.add('hidden');
    document.getElementById('playerSection').classList.add('active');
    document.getElementById('pageTitle').textContent = t('playing') + (title || 'Diablo');
    document.getElementById('resetBtn').style.display = '';
    document.getElementById('fullscreenBtn').style.display = '';
}

function playDiablo() {
    if (!document.getElementById('diabloFrame')) return;
    showPlayer('Diablo');
    player.start();
}

function stopPlayback() {
    player.stop();
    document.getElementById('playerSection').classList.remove('active');
    document.getElementById('uploadSection').classList.remove('hidden');
    document.getElementById('pageTitle').textContent = t('pageTitle');
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('fullscreenBtn').style.display = 'none';
}

// ---- fullscreen --------------------------------------------------------
// diabloweb does not ship its own fullscreen control, so the host page
// requests fullscreen on the iframe itself (allowed via allowfullscreen).
document.getElementById('fullscreenBtn').addEventListener('click', function () {
    var frame = document.getElementById('diabloFrame');
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
document.getElementById('demoOpenBtn').addEventListener('click', playDiablo);

// ---- back / reset ------------------------------------------------------
document.getElementById('backBtn').addEventListener('click', function () {
    var playerSection = document.getElementById('playerSection');
    if (playerSection.classList.contains('active')) { stopPlayback(); return; }
    window.location.href = '../routes/game.html?category=recomp';
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
applyI18n();