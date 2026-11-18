// Red Alert 2 Page JavaScript - RA2 VM (GPL-3.0, by ra2-games) embedded
// by hotlink to the official web app. No games are bundled or hot-linked:
// users must import their own Red Alert 2 / Yuri's Revenge game resources.

var RA2_BASE = 'https://ra2.games';

// Internationalization (8 languages, same key set as topalm.js)
var i18n = {
    zh: {
        pageTitle: '红色警戒 2',
        reset: '重置',
        tabDemo: '模拟器',
        demoTitle: '红色警戒 2 游戏',
        demoDesc: '通过 RA2 VM（v86 + Win32/DirectX 兼容层，热链嵌入官方站点）在浏览器里直接运行《红色警戒 2》与《尤里的复仇》。支持遭遇战、读取存档与联机。',
        demoOpen: '启动游戏',
        demoHint: '不内置任何游戏——需要你自备《红色警戒 2》或《尤里的复仇》的游戏文件，在页面内导入后即可游玩。EA 未认可此产品。',
        loading: 'RA2 VM 启动中，请稍候...',
        loadingTip: '模拟器从其服务器加载，首次启动可能较慢',
        loadingSlow: '加载较慢，请耐心等待；也可以在新标签页打开模拟器',
        openInNewTab: '在新标签页打开模拟器 ↗',
        instructions: '使用说明',
        controlsTitle: '操作方式',
        controlsHint1: '用鼠标/触摸进行建造、选兵与对战，也可使用键盘快捷键',
        controlsHint2: '首次进入需在模拟器内导入你自备的《红色警戒 2》或《尤里的复仇》游戏资源，然后选择版本开始遭遇战',
        aboutTitle: '关于',
        aboutHint: '红色警戒 2：2000 年 Westwood/EA 的经典 PC 即时战略。网页版由 RA2 VM（v86 引擎，GPL-3.0）热链提供，当前为 Alpha 实验阶段。',
        playing: '正在运行：',
        fullscreen: '全屏'
    },
    en: {
        pageTitle: 'Red Alert 2',
        reset: 'Reset',
        tabDemo: 'Emulator',
        demoTitle: 'Red Alert 2 Games',
        demoDesc: "Run Red Alert 2 and Yuri's Revenge directly in your browser with RA2 VM (v86 + Win32/DirectX compatibility layer, embedded by hotlink to the official site). Supports skirmish, saves and multiplayer.",
        demoOpen: 'Launch Game',
        demoHint: "No games are bundled - bring your own copies of Red Alert 2 or Yuri's Revenge and import them in the page to play. Not endorsed by EA.",
        loading: 'Starting RA2 VM, please wait...',
        loadingTip: 'The emulator loads from its host; first launch can take a while',
        loadingSlow: 'Still loading - please wait a bit longer, or open the emulator in a new tab',
        openInNewTab: 'Open the emulator in a new tab ↗',
        instructions: 'Instructions',
        controlsTitle: 'Controls',
        controlsHint1: 'Build, select units and fight with mouse/touch, or use keyboard shortcuts',
        controlsHint2: "On first launch, import your own Red Alert 2 or Yuri's Revenge game resources inside the emulator, then pick a version to start a skirmish",
        aboutTitle: 'About',
        aboutHint: 'Red Alert 2: the 2000 classic PC RTS from Westwood/EA. The web version is provided by RA2 VM (v86 engine, GPL-3.0), embedded by hotlink; currently Alpha.',
        playing: 'Now running: ',
        fullscreen: 'Fullscreen'
    },
    ja: {
        pageTitle: 'レッドアラート2',
        reset: 'リセット',
        tabDemo: 'エミュレータ',
        demoTitle: 'レッドアラート2 ゲーム',
        demoDesc: 'RA2 VM（v86 + Win32/DirectX 互換レイヤ、公式サイトへのホットリンク埋め込み）でブラウザ上で『レッドアラート2』と『ヨーリの復讐』を直接実行。遭遇戦、セーブ読み込み、対戦に対応。',
        demoOpen: 'ゲームを起動',
        demoHint: 'ゲームは同梱されていません。お持ちの『レッドアラート2』または『ヨーリの復讐』のゲームファイルをページ内で読み込んでください。EA の公認製品ではありません。',
        loading: 'RA2 VM を起動中...',
        loadingTip: 'エミュレータはホストから読み込まれます。初回の起動は時間がかかることがあります',
        loadingSlow: '読み込みが遅い場合はそのままお待ちいただくか、新しいタブでエミュレータを開いてください',
        openInNewTab: '新しいタブでエミュレータを開く ↗',
        instructions: '使い方',
        controlsTitle: '操作方法',
        controlsHint1: 'マウス/タッチで建設・部隊選択・戦闘、またはキーボードのショートカットを使用',
        controlsHint2: '初回はエミュレータ内で自前の『レッドアラート2』または『ヨーリの復讐』のゲーム資源を読み込み、バージョンを選んで遭遇戦を開始',
        aboutTitle: 'について',
        aboutHint: 'レッドアラート2：2000年のWestwood/EAによるクラシックPC向けRTS。Web版はRA2 VM（v86エンジン、GPL-3.0）をホットリンクで提供、現在はアルファ版。',
        playing: '実行中：',
        fullscreen: '全画面'
    },
    ko: {
        pageTitle: '레드 얼럿 2',
        reset: '재설정',
        tabDemo: '에뮬레이터',
        demoTitle: '레드 얼럿 2 게임',
        demoDesc: 'RA2 VM(v86 + Win32/DirectX 호환층, 공식 사이트 핫링크 임베드)으로 브라우저에서 『레드 얼럿 2』와 『유리의 복수』를 직접 실행합니다. 전투, 세이브 로드, 대전을 지원합니다.',
        demoOpen: '게임 실행',
        demoHint: '게임은 포함되지 않습니다. 보유한 『레드 얼럿 2』 또는 『유리의 복수』 게임 파일을 페이지에서 불러오세요. EA의 공식 제품이 아닙니다.',
        loading: 'RA2 VM 시작 중...',
        loadingTip: '에뮬레이터는 호스트에서 로드됩니다. 첫 실행은 시간이 걸릴 수 있습니다',
        loadingSlow: '로딩이 느리면 조금 더 기다리거나 새 탭에서 에뮬레이터를 여세요',
        openInNewTab: '새 탭에서 에뮬레이터 열기 ↗',
        instructions: '사용 방법',
        controlsTitle: '조작 방법',
        controlsHint1: '마우스/터치로 건설·부대 선택·전투, 또는 키보드 단축키 사용',
        controlsHint2: '첫 실행 시 에뮬레이터 안에서 보유한 『레드 얼럿 2』 또는 『유리의 복수』 게임 자원을 불러온 뒤 버전을 선택해 전투 시작',
        aboutTitle: '소개',
        aboutHint: '레드 얼럿 2: 2000년 Westwood/EA의 클래식 PC RTS. 웹 버전은 RA2 VM(v86 엔진, GPL-3.0)을 핫링크로 제공하며 현재 알파 단계입니다.',
        playing: '실행 중: ',
        fullscreen: '전체 화면'
    },
    fr: {
        pageTitle: 'Red Alert 2',
        reset: 'Réinitialiser',
        tabDemo: 'Émulateur',
        demoTitle: 'Jeux Red Alert 2',
        demoDesc: "Exécutez Red Alert 2 et Yuri's Revenge directement dans votre navigateur avec RA2 VM (v86 + couche de compatibilité Win32/DirectX, intégré par lien direct au site officiel). Skirmish, chargement de sauvegardes et multijoueur supportés.",
        demoOpen: "Lancer le jeu",
        demoHint: "Aucun jeu n'est fourni - apportez vos propres copies de Red Alert 2 ou Yuri's Revenge et importez-les dans la page pour jouer. Non approuvé par EA.",
        loading: 'Démarrage de RA2 VM, veuillez patienter...',
        loadingTip: "L'émulateur se charge depuis son hôte ; le premier lancement peut prendre du temps",
        loadingSlow: "Chargement lent - patientez encore un peu, ou ouvrez l'émulateur dans un nouvel onglet",
        openInNewTab: "Ouvrir l'émulateur dans un nouvel onglet ↗",
        instructions: 'Instructions',
        controlsTitle: 'Commandes',
        controlsHint1: 'Construisez, sélectionnez des unités et combattez avec la souris/le tactile, ou via les raccourcis clavier',
        controlsHint2: "Au premier lancement, importez vos ressources de Red Alert 2 ou Yuri's Revenge dans l'émulateur, puis choisissez une version pour démarrer un skirmish",
        aboutTitle: 'À propos',
        aboutHint: 'Red Alert 2 : le RTS PC classique de 2000 (Westwood/EA). La version web est fournie par RA2 VM (moteur v86, GPL-3.0), intégré par lien direct ; actuellement en version Alpha.',
        playing: 'En cours : ',
        fullscreen: 'Plein écran'
    },
    de: {
        pageTitle: 'Red Alert 2',
        reset: 'Zurücksetzen',
        tabDemo: 'Emulator',
        demoTitle: 'Red Alert 2 Spiele',
        demoDesc: "Red Alert 2 und Yuri's Revenge direkt im Browser mit RA2 VM (v86 + Win32/DirectX-Kompatibilitätsschicht, per Hotlink zur offiziellen Site eingebettet) ausführen. Gegnerkämpfe, Saves und Mehrspieler unterstützt.",
        demoOpen: 'Spiel starten',
        demoHint: "Keine Spiele enthalten - bringen Sie eigene Kopien von Red Alert 2 oder Yuri's Revenge mit und importieren Sie sie in der Seite. Nicht von EA anerkannt.",
        loading: 'RA2 VM wird gestartet, bitte warten...',
        loadingTip: 'Der Emulator lädt von seinem Host; der erste Start kann dauern',
        loadingSlow: 'Lädt langsam - warten Sie noch etwas oder öffnen Sie den Emulator in einem neuen Tab',
        openInNewTab: 'Emulator in einem neuen Tab öffnen ↗',
        instructions: 'Anleitung',
        controlsTitle: 'Steuerung',
        controlsHint1: 'Bauen, Einheiten auswählen und kämpfen mit Maus/Touch oder Tastatur-Shortcuts',
        controlsHint2: "Importieren Sie beim ersten Start Ihre eigenen Red Alert 2- oder Yuri's Revenge-Ressourcen im Emulator und wählen Sie eine Version für einen Gegnerkampf",
        aboutTitle: 'Über',
        aboutHint: 'Red Alert 2: der klassische PC-RTS von 2000 (Westwood/EA). Die Web-Version wird von RA2 VM (v86-Engine, GPL-3.0) per Hotlink bereitgestellt, derzeit in Alpha-Version.',
        playing: 'Läuft: ',
        fullscreen: 'Vollbild'
    },
    es: {
        pageTitle: 'Red Alert 2',
        reset: 'Restablecer',
        tabDemo: 'Emulador',
        demoTitle: 'Juegos de Red Alert 2',
        demoDesc: "Ejecuta Red Alert 2 y Yuri's Revenge directamente en tu navegador con RA2 VM (v86 + capa de compatibilidad Win32/DirectX, incrustado por enlace directo al sitio oficial). Apoya escaramuzas, carga de guardados y multijugador.",
        demoOpen: 'Iniciar juego',
        demoHint: "No se incluyen juegos - trae tus propias copias de Red Alert 2 o Yuri's Revenge e impórtalas en la página para jugar. No respaldado por EA.",
        loading: 'Iniciando RA2 VM, espera...',
        loadingTip: 'El emulador se carga desde su host; el primer inicio puede tardar',
        loadingSlow: 'Carga lenta - espera un poco más o abre el emulador en una pestaña nueva',
        openInNewTab: 'Abrir el emulador en una pestaña nueva ↗',
        instructions: 'Instrucciones',
        controlsTitle: 'Controles',
        controlsHint1: 'Construye, selecciona unidades y lucha con ratón/táctil o atajos de teclado',
        controlsHint2: "En el primer inicio, importa tus propios recursos de Red Alert 2 o Yuri's Revenge en el emulador y elige una versión para iniciar una escaramuza",
        aboutTitle: 'Acerca de',
        aboutHint: 'Red Alert 2: el RTS clásico de PC de 2000 (Westwood/EA). La versión web es proporcionada por RA2 VM (motor v86, GPL-3.0), incrustado por enlace directo; actualmente en fase Alpha.',
        playing: 'Ejecutando: ',
        fullscreen: 'Pantalla completa'
    },
    ru: {
        pageTitle: 'Red Alert 2',
        reset: 'Сброс',
        tabDemo: 'Эмулятор',
        demoTitle: 'Игры Red Alert 2',
        demoDesc: "Запускайте Red Alert 2 и Yuri's Revenge прямо в браузере с помощью RA2 VM (v86 + слой совместимости Win32/DirectX, встраивание горячей ссылкой на официальный сайт). Поддерживаются схватки, загрузка сохранений и мультиплеер.",
        demoOpen: 'Запустить игру',
        demoHint: "Игры не включены - загрузите свои копии Red Alert 2 или Yuri's Revenge и импортируйте их на странице. Продукт не одобрен EA.",
        loading: 'RA2 VM запускается, подождите...',
        loadingTip: 'Эмулятор загружается с сервера; первая загрузка может занять время',
        loadingSlow: 'Загрузка идёт медленно - подождите ещё немного или откройте эмулятор в новой вкладке',
        openInNewTab: 'Открыть эмулятор в новой вкладке ↗',
        instructions: 'Инструкция',
        controlsTitle: 'Управление',
        controlsHint1: 'Стройте, выбирайте единицы и сражайтесь мышью/касанием или горячими клавишами',
        controlsHint2: "При первом запуске импортируйте свои ресурсы Red Alert 2 или Yuri's Revenge в эмулятор, затем выберите версию для схватки",
        aboutTitle: 'О платформе',
        aboutHint: 'Red Alert 2: классическая RTS на ПК 2000 года (Westwood/EA). Веб-версия предоставляется RA2 VM (движок v86, GPL-3.0) горячей ссылкой; в стадии Alpha.',
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
// upstream app in a new tab (matches the loadingSlow copy).
function showSlowLink() {
    var overlay = document.getElementById('loadingOverlay');
    if (!overlay || document.getElementById('slowOpenLink')) return;
    var link = document.createElement('a');
    link.id = 'slowOpenLink';
    link.href = RA2_BASE;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = t('openInNewTab');
    link.style.cssText = 'display:inline-block;margin-top:14px;color:#33ff66;text-decoration:underline;font-size:14px;';
    overlay.appendChild(link);
}

function showPlayer(title) {
    document.getElementById('uploadSection').classList.add('hidden');
    document.getElementById('playerSection').classList.add('active');
    document.getElementById('pageTitle').textContent = t('playing') + (title || 'Red Alert 2');
    document.getElementById('resetBtn').style.display = '';
    document.getElementById('fullscreenBtn').style.display = '';
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

function playRa2() {
    var frame = document.getElementById('ra2Frame');
    if (!frame) return;
    showPlayer('Red Alert 2');
    // RA2 VM detects and launches the games you imported itself; nothing can
    // be passed from this host page.
    frame.addEventListener('load', hideOverlay, { once: true });
    frame.src = RA2_BASE;
    slowTimer = setTimeout(function () {
        showToast(t('loadingSlow'));
        showSlowLink();
    }, 15000);
}

function stopPlayback() {
    var frame = document.getElementById('ra2Frame');
    if (frame) frame.src = 'about:blank';
    hideOverlay();
    document.getElementById('playerSection').classList.remove('active');
    document.getElementById('uploadSection').classList.remove('hidden');
    document.getElementById('pageTitle').textContent = t('pageTitle');
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('fullscreenBtn').style.display = 'none';
}

// ---- fullscreen --------------------------------------------------------
// ra2.games does not ship its own fullscreen control, so the host page
// requests fullscreen on the iframe itself (allowed via allowfullscreen).
document.getElementById('fullscreenBtn').addEventListener('click', function () {
    var frame = document.getElementById('ra2Frame');
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
document.getElementById('demoOpenBtn').addEventListener('click', playRa2);

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