// Apple II Page JavaScript - embeds the official apple2js deployment
// (https://www.scullinsteel.com/apple2/, MIT by Will Scullin).
// The official host serves the emulator plus its ROM set; we embed it read-only.

var EMBED_URL = 'https://www.scullinsteel.com/apple2/';

// Internationalization (same language set as todos.js)
var i18n = {
    zh: {
        pageTitle: 'Apple II',
        introTitle: 'Apple II 模拟器 (apple2js)',
        introDesc: 'apple2js 完整模拟 1977-1983 年的 Apple II 与 IIe，包括 Applesoft BASIC、软盘驱动器和经典 DOS 3.3 / ProDOS 软件。',
        introHint: '由 apple2js (MIT, Will Scullin 开发) 驱动，内嵌官方部署 scullinsteel.com。磁盘镜像在模拟器界面内加载。',
        startEmulator: '启动模拟器',
        openStandalone: '独立页面打开',
        instructions: '使用说明',
        controlsTitle: '操作方式',
        controlsHint: '点击模拟器画面内部，然后在 ] 提示符像真实 Apple II 一样输入',
        gamesHint: '试试 CATALOG、RUN HELLO，或用模拟器菜单加载磁盘',
        embedLoading: '正在加载官方模拟器站点，首次访问可能需要一点时间...',
        embedSlow: '加载较慢，请耐心等待；也可以点击"独立页面打开"直接访问官方站点',
    },
    en: {
        pageTitle: 'Apple II',
        introTitle: 'Apple II Emulator (apple2js)',
        introDesc: 'apple2js emulates the original Apple II and IIe from 1977-1983, with Applesoft BASIC, disk drives and classic DOS 3.3 / ProDOS software.',
        introHint: 'Powered by apple2js (MIT by Will Scullin), embedded from the official scullinsteel.com deployment. Disk images load inside the emulator UI.',
        startEmulator: 'Start Emulator',
        openStandalone: 'Open Standalone',
        instructions: 'Instructions',
        controlsTitle: 'Controls',
        controlsHint: 'Click inside the emulator screen, then type at the ] prompt like on a real Apple II',
        gamesHint: 'Try CATALOG, RUN HELLO, or load a disk from the emulator\'s own menu',
        embedLoading: 'Loading the official emulator site - the first visit may take a while...',
        embedSlow: 'Still loading - please wait a bit longer, or use "Open Standalone" to visit the official site directly',
    },
    ja: {
        pageTitle: 'Apple II',
        introTitle: 'Apple II エミュレータ (apple2js)',
        introDesc: 'apple2js は1977〜1983年の Apple II と IIe を、Applesoft BASIC、ディスクドライブ、DOS 3.3 / ProDOS ソフトウェア込みでエミュレートします。',
        introHint: 'apple2js (MIT、Will Scullin) による公式デプロイ scullinsteel.com を埋め込んでいます。ディスクイメージはエミュレータUI内で読み込みます。',
        startEmulator: 'エミュレータを起動',
        openStandalone: '別ページで開く',
        instructions: '使い方',
        controlsTitle: '操作方法',
        controlsHint: 'エミュレータ画面内をクリックし、] プロンプトで実機のApple IIのように入力してください',
        gamesHint: 'CATALOG や RUN HELLO を試すか、エミュレータのメニューからディスクをロードしてください',
        embedLoading: '公式エミュレータサイトを読み込んでいます。初回は時間がかかることがあります...',
        embedSlow: '読み込みが遅い場合はそのままお待ちいただくか、「別ページで開く」から公式サイトに直接アクセスしてください',
    },
    ko: {
        pageTitle: 'Apple II',
        introTitle: 'Apple II 에뮬레이터 (apple2js)',
        introDesc: 'apple2js는 1977~1983년의 애플 II와 IIe를 Applesoft BASIC, 디스크 드라이브, DOS 3.3 / ProDOS 소프트웨어까지 에뮬레이션합니다.',
        introHint: 'apple2js(MIT, Will Scullin)의 공식 배포본 scullinsteel.com을 임베드합니다. 디스크 이미지는 에뮬레이터 UI 안에서 로드합니다.',
        startEmulator: '에뮬레이터 시작',
        openStandalone: '별도 페이지로 열기',
        instructions: '사용 방법',
        controlsTitle: '조작 방법',
        controlsHint: '에뮬레이터 화면 내부를 클릭한 후 ] 프롬프트에서 실제 Apple II처럼 입력하세요',
        gamesHint: 'CATALOG, RUN HELLO를 시도하거나 에뮬레이터 메뉴에서 디스크를 로드하세요',
        embedLoading: '공식 에뮬레이터 사이트를 불러오는 중입니다. 첫 방문 시 시간이 걸릴 수 있습니다...',
        embedSlow: '로딩이 느리면 조금 더 기다리거나 "별도 페이지로 열기"로 공식 사이트에 직접 접속하세요',
    },
    fr: {
        pageTitle: 'Apple II',
        introTitle: 'Émulateur Apple II (apple2js)',
        introDesc: 'apple2js émule l\'Apple II et IIe originels de 1977-1983, avec Applesoft BASIC, les lecteurs de disquettes et les logiciels DOS 3.3 / ProDOS classiques.',
        introHint: 'Propulsé par apple2js (MIT, Will Scullin), intégré depuis le déploiement officiel scullinsteel.com. Les images disque se chargent dans l\'interface de l\'émulateur.',
        startEmulator: 'Démarrer l\'émulateur',
        openStandalone: 'Ouvrir en standalone',
        instructions: 'Instructions',
        controlsTitle: 'Commandes',
        controlsHint: 'Cliquez dans l\'écran de l\'émulateur, puis tapez à l\'invite ] comme sur un vrai Apple II',
        gamesHint: 'Essayez CATALOG, RUN HELLO, ou chargez un disque depuis le menu de l\'émulateur',
        embedLoading: 'Chargement du site officiel de l\'émulateur - la première visite peut prendre un moment...',
        embedSlow: 'Chargement lent - patientez encore un peu, ou utilisez « Ouvrir en standalone » pour accéder directement au site officiel',
    },
    de: {
        pageTitle: 'Apple II',
        introTitle: 'Apple-II-Emulator (apple2js)',
        introDesc: 'apple2js emuliert den originalen Apple II und IIe von 1977-1983, mit Applesoft BASIC, Diskettenlaufwerken und klassischer DOS 3.3 / ProDOS Software.',
        introHint: 'Basiert auf apple2js (MIT, Will Scullin), eingebettet von der offiziellen Bereitstellung scullinsteel.com. Disk-Images werden in der Emulator-UI geladen.',
        startEmulator: 'Emulator starten',
        openStandalone: 'Einzeln öffnen',
        instructions: 'Anleitung',
        controlsTitle: 'Steuerung',
        controlsHint: 'Klicken Sie in den Emulator-Bildschirm und tippen Sie am ]-Prompt wie auf einem echten Apple II',
        gamesHint: 'Probieren Sie CATALOG, RUN HELLO oder laden Sie eine Diskette über das Emulator-Menü',
        embedLoading: 'Die offizielle Emulator-Seite wird geladen - der erste Besuch kann eine Weile dauern...',
        embedSlow: 'Laden dauert länger - bitte noch etwas warten, oder über „Einzeln öffnen" die offizielle Seite direkt besuchen',
    },
    es: {
        pageTitle: 'Apple II',
        introTitle: 'Emulador Apple II (apple2js)',
        introDesc: 'apple2js emula el Apple II y IIe originales de 1977-1983, con Applesoft BASIC, unidades de disco y el clásico software DOS 3.3 / ProDOS.',
        introHint: 'Impulsado por apple2js (MIT, Will Scullin), incrustado desde el despliegue oficial scullinsteel.com. Las imágenes de disco se cargan dentro de la interfaz del emulador.',
        startEmulator: 'Iniciar emulador',
        openStandalone: 'Abrir independiente',
        instructions: 'Instrucciones',
        controlsTitle: 'Controles',
        controlsHint: 'Haga clic dentro de la pantalla del emulador y escriba en el prompt ] como en un Apple II real',
        gamesHint: 'Pruebe CATALOG, RUN HELLO, o cargue un disco desde el menú del emulador',
        embedLoading: 'Cargando el sitio oficial del emulador - la primera visita puede tardar un poco...',
        embedSlow: 'Carga lenta: espere un poco más, o use "Abrir independiente" para visitar el sitio oficial directamente',
    },
    ru: {
        pageTitle: 'Apple II',
        introTitle: 'Эмулятор Apple II (apple2js)',
        introDesc: 'apple2js эмулирует оригинальные Apple II и IIe 1977-1983 годов, с Applesoft BASIC, дисководами и классическим ПО DOS 3.3 / ProDOS.',
        introHint: 'Работает на apple2js (MIT, Will Scullin), встроено с официального развёртывания scullinsteel.com. Образы дисков загружаются в интерфейсе эмулятора.',
        startEmulator: 'Запустить эмулятор',
        openStandalone: 'Открыть отдельно',
        instructions: 'Инструкция',
        controlsTitle: 'Управление',
        controlsHint: 'Кликните внутри экрана эмулятора, затем вводите команды в приглашении ] как на настоящем Apple II',
        gamesHint: 'Попробуйте CATALOG, RUN HELLO или загрузите диск из меню эмулятора',
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
    console.log('=== Apple II (apple2js) Page Loaded ===');
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
    // The shared helper owns the spinner, slow hint and stalled-upstream UI.
    var player = HotlinkPlayer.createPlayer({
        frameId: 'embedFrame', overlayId: 'embedLoading',
        url: EMBED_URL, newTabUrl: EMBED_URL, hideDelay: 800
    });
    document.getElementById('startBtn').addEventListener('click', function() {
        var introSection = document.getElementById('introSection');
        if (introSection) introSection.classList.add('hidden');
        var embedSection = document.getElementById('embedSection');
        if (embedSection) embedSection.classList.add('active');
        player.start();
        window.scrollTo(0, 0);
    });
});
