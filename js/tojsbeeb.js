// BBC Micro Page JavaScript - embeds the official jsbeeb deployment
// (https://bbc.godbolt.org/, GPL-3.0 by Matt Godbolt and contributors).
// The official host serves the emulator plus all ROMs; we embed it read-only.

var EMBED_URL = 'https://bbc.godbolt.org/';

// Internationalization (same language set as todos.js)
var i18n = {
    zh: {
        pageTitle: 'BBC Micro',
        introTitle: 'BBC Micro 模拟器 (jsbeeb)',
        introDesc: 'jsbeeb 完整模拟 1981 年英国 BBC Micro 家用电脑（Model B），包括 BASIC 解释器、磁带游戏和磁盘系统。',
        introHint: '由 jsbeeb (GPL-3.0, Matt Godbolt 等开发) 驱动，内嵌官方部署 bbc.godbolt.org。磁盘和磁带在模拟器界面内加载。',
        startEmulator: '启动模拟器',
        openStandalone: '独立页面打开',
        instructions: '使用说明',
        controlsTitle: '操作方式',
        controlsHint: '点击模拟器画面内部，然后像真实 BBC Micro 键盘一样输入',
        gamesHint: '在 BASIC 提示符输入 CHAIN"GAMES" 并回车，可打开内置游戏菜单',
        embedLoading: '正在加载官方模拟器站点，首次访问可能需要一点时间...',
        embedSlow: '加载较慢，请耐心等待；也可以点击"独立页面打开"直接访问官方站点',
    },
    en: {
        pageTitle: 'BBC Micro',
        introTitle: 'BBC Micro Emulator (jsbeeb)',
        introDesc: 'jsbeeb emulates the classic 1981 BBC Micro home computer (Model B), including its BASIC interpreter, cassette games and disc system.',
        introHint: 'Powered by jsbeeb (GPL-3.0 by Matt Godbolt and contributors), embedded from the official bbc.godbolt.org deployment. Discs and cassettes load inside the emulator UI.',
        startEmulator: 'Start Emulator',
        openStandalone: 'Open Standalone',
        instructions: 'Instructions',
        controlsTitle: 'Controls',
        controlsHint: 'Click inside the emulator screen, then type like on a real BBC Micro keyboard',
        gamesHint: 'Type CHAIN"GAMES" and press Enter at the BASIC prompt for the built-in game menu',
        embedLoading: 'Loading the official emulator site - the first visit may take a while...',
        embedSlow: 'Still loading - please wait a bit longer, or use "Open Standalone" to visit the official site directly',
    },
    ja: {
        pageTitle: 'BBC Micro',
        introTitle: 'BBC Micro エミュレータ (jsbeeb)',
        introDesc: 'jsbeeb は1981年の英国家用コンピュータ BBC Micro（Model B）を、BASICインタプリタ、カセットゲーム、ディスクシステム込みで完全エミュレートします。',
        introHint: 'jsbeeb (GPL-3.0、Matt Godbolt 他) による公式デプロイ bbc.godbolt.org を埋め込んでいます。ディスクとカセットはエミュレータUI内で読み込みます。',
        startEmulator: 'エミュレータを起動',
        openStandalone: '別ページで開く',
        instructions: '使い方',
        controlsTitle: '操作方法',
        controlsHint: 'エミュレータ画面内をクリックすると、実機のBBC Microキーボードのように入力できます',
        gamesHint: 'BASICプロンプトで CHAIN"GAMES" と入力してEnterを押すと、内蔵ゲームメニューが開きます',
        embedLoading: '公式エミュレータサイトを読み込んでいます。初回は時間がかかることがあります...',
        embedSlow: '読み込みが遅い場合はそのままお待ちいただくか、「別ページで開く」から公式サイトに直接アクセスしてください',
    },
    ko: {
        pageTitle: 'BBC Micro',
        introTitle: 'BBC Micro 에뮬레이터 (jsbeeb)',
        introDesc: 'jsbeeb는 1981년 영국의 가정용 컴퓨터 BBC Micro(Model B)를 BASIC 인터프리터, 카세트 게임, 디스크 시스템까지 완전히 에뮬레이션합니다.',
        introHint: 'jsbeeb(GPL-3.0, Matt Godbolt 외)의 공식 배포본 bbc.godbolt.org를 임베드합니다. 디스크와 카세트는 에뮬레이터 UI 안에서 로드합니다.',
        startEmulator: '에뮬레이터 시작',
        openStandalone: '별도 페이지로 열기',
        instructions: '사용 방법',
        controlsTitle: '조작 방법',
        controlsHint: '에뮬레이터 화면 내부를 클릭한 후 실제 BBC Micro 키보드처럼 입력하세요',
        gamesHint: 'BASIC 프롬프트에서 CHAIN"GAMES"를 입력하고 Enter를 누르면 내장 게임 메뉴가 열립니다',
        embedLoading: '공식 에뮬레이터 사이트를 불러오는 중입니다. 첫 방문 시 시간이 걸릴 수 있습니다...',
        embedSlow: '로딩이 느리면 조금 더 기다리거나 "별도 페이지로 열기"로 공식 사이트에 직접 접속하세요',
    },
    fr: {
        pageTitle: 'BBC Micro',
        introTitle: 'Émulateur BBC Micro (jsbeeb)',
        introDesc: 'jsbeeb émule l\'ordinateur familial BBC Micro de 1981 (Model B), avec son interpréteur BASIC, ses jeux sur cassette et son système de disquettes.',
        introHint: 'Propulsé par jsbeeb (GPL-3.0, Matt Godbolt et contributeurs), intégré depuis le déploiement officiel bbc.godbolt.org. Disquettes et cassettes se chargent dans l\'interface de l\'émulateur.',
        startEmulator: 'Démarrer l\'émulateur',
        openStandalone: 'Ouvrir en standalone',
        instructions: 'Instructions',
        controlsTitle: 'Commandes',
        controlsHint: 'Cliquez dans l\'écran de l\'émulateur, puis tapez comme sur un vrai clavier BBC Micro',
        gamesHint: 'Tapez CHAIN"GAMES" puis Entrée à l\'invite BASIC pour ouvrir le menu de jeux intégré',
        embedLoading: 'Chargement du site officiel de l\'émulateur - la première visite peut prendre un moment...',
        embedSlow: 'Chargement lent - patientez encore un peu, ou utilisez « Ouvrir en standalone » pour accéder directement au site officiel',
    },
    de: {
        pageTitle: 'BBC Micro',
        introTitle: 'BBC-Micro-Emulator (jsbeeb)',
        introDesc: 'jsbeeb emuliert den klassischen Heimcomputer BBC Micro von 1981 (Model B) inklusive BASIC-Interpreter, Kassettenspielen und Diskettensystem.',
        introHint: 'Basiert auf jsbeeb (GPL-3.0, Matt Godbolt und Mitwirkende), eingebettet von der offiziellen Bereitstellung bbc.godbolt.org. Disketten und Kassetten werden in der Emulator-UI geladen.',
        startEmulator: 'Emulator starten',
        openStandalone: 'Einzeln öffnen',
        instructions: 'Anleitung',
        controlsTitle: 'Steuerung',
        controlsHint: 'Klicken Sie in den Emulator-Bildschirm und tippen Sie wie auf einer echten BBC-Micro-Tastatur',
        gamesHint: 'Geben Sie am BASIC-Prompt CHAIN"GAMES" ein und drücken Sie Enter für das eingebaute Spielmenü',
        embedLoading: 'Die offizielle Emulator-Seite wird geladen - der erste Besuch kann eine Weile dauern...',
        embedSlow: 'Laden dauert länger - bitte noch etwas warten, oder über „Einzeln öffnen" die offizielle Seite direkt besuchen',
    },
    es: {
        pageTitle: 'BBC Micro',
        introTitle: 'Emulador BBC Micro (jsbeeb)',
        introDesc: 'jsbeeb emula el ordenador doméstico BBC Micro de 1981 (Model B), incluyendo su intérprete BASIC, juegos en cinta y sistema de disquetes.',
        introHint: 'Impulsado por jsbeeb (GPL-3.0, Matt Godbolt y colaboradores), incrustado desde el despliegue oficial bbc.godbolt.org. Los discos y cintas se cargan dentro de la interfaz del emulador.',
        startEmulator: 'Iniciar emulador',
        openStandalone: 'Abrir independiente',
        instructions: 'Instrucciones',
        controlsTitle: 'Controles',
        controlsHint: 'Haga clic dentro de la pantalla del emulador y escriba como en un teclado BBC Micro real',
        gamesHint: 'Escriba CHAIN"GAMES" y pulse Enter en el prompt de BASIC para abrir el menú de juegos integrado',
        embedLoading: 'Cargando el sitio oficial del emulador - la primera visita puede tardar un poco...',
        embedSlow: 'Carga lenta: espere un poco más, o use "Abrir independiente" para visitar el sitio oficial directamente',
    },
    ru: {
        pageTitle: 'BBC Micro',
        introTitle: 'Эмулятор BBC Micro (jsbeeb)',
        introDesc: 'jsbeeb эмулирует классический домашний компьютер BBC Micro 1981 года (Model B), включая интерпретатор BASIC, игры на кассетах и дисковую систему.',
        introHint: 'Работает на jsbeeb (GPL-3.0, Matt Godbolt и соавторы), встроено с официального развёртывания bbc.godbolt.org. Диски и кассеты загружаются в интерфейсе эмулятора.',
        startEmulator: 'Запустить эмулятор',
        openStandalone: 'Открыть отдельно',
        instructions: 'Инструкция',
        controlsTitle: 'Управление',
        controlsHint: 'Кликните внутри экрана эмулятора, затем вводите текст как на настоящей клавиатуре BBC Micro',
        gamesHint: 'Введите CHAIN"GAMES" и нажмите Enter в приглашении BASIC, чтобы открыть встроенное меню игр',
        embedLoading: 'Загружается официальный сайт эмулятора - первый визит может занять время...',
        embedSlow: 'Загрузка идёт медленно - подождите ещё немного или откройте официальный сайт через «Открыть отдельно»',
    }
};

// Get current language (same mechanism as todos.js)
function getLang() {
    var lang = localStorage.getItem('languages') || 'en';
    return i18n[lang] ? lang : 'en';
}

function t(key) {
    var lang = getLang();
    return (i18n[lang] && i18n[lang][key]) || i18n['en'][key] || key;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.documentElement.lang = getLang() === 'zh' ? 'zh-CN' : getLang();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== BBC Micro (jsbeeb) Page Loaded ===');
    applyTranslations();

    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'game.html';
    });

    // Instructions toggle
    var instrHeader = document.getElementById('instructionsHeader');
    var instrToggle = document.getElementById('instructionsToggle');
    var instrContent = document.getElementById('instructionsContent');
    if (instrHeader && instrToggle && instrContent) {
        instrHeader.addEventListener('click', function() {
            var collapsed = instrContent.style.display === 'none';
            instrContent.style.display = collapsed ? '' : 'none';
            instrToggle.classList.toggle('collapsed', !collapsed);
        });
    }

    // Lazy-load the official deployment only when the user asks for it.
    // A spinner covers the iframe until it fires load; if the remote site is
    // slow (first visit / far CDN), show a reassurance message after 15s.
    document.getElementById('startBtn').addEventListener('click', function() {
        var introSection = document.getElementById('introSection');
        if (introSection) introSection.classList.add('hidden');
        var embedSection = document.getElementById('embedSection');
        if (embedSection) embedSection.classList.add('active');
        var frame = document.getElementById('embedFrame');
        var embedLoading = document.getElementById('embedLoading');
        var slowTimer = setTimeout(function() {
            if (embedLoading && !embedLoading.classList.contains('hidden')) {
                var txt = embedLoading.querySelector('[data-i18n]');
                if (txt) txt.textContent = t('embedSlow');
            }
        }, 15000);
        if (frame) {
            frame.addEventListener('load', function() {
                clearTimeout(slowTimer);
                // give the embedded site a beat to paint before removing the spinner
                setTimeout(function() {
                    if (embedLoading) embedLoading.classList.add('hidden');
                }, 800);
            });
            if (!frame.src) frame.src = EMBED_URL;
        }
        window.scrollTo(0, 0);
    });
});
