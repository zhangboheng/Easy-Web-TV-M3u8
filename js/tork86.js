// Radio-86RK Page JavaScript - rk86-js (MIT) embedded by hotlink to the
// official web app at rk86.ru. No ROMs or programs are bundled by this host:
// the emulator's built-in catalog is served by rk86.ru, and user-supplied
// program files are loaded inside the emulator's own UI.

var RK_HOME = 'https://rk86.ru/';

// Internationalization (8 languages, same key set as tomac.js)
var i18n = {
    zh: {
        pageTitle: 'Radio-86RK',
        reset: '重置',
        tabDemo: '模拟器',
        demoTitle: 'Radio-86RK 模拟器',
        demoDesc: '通过 rk86.ru 官方 Web App 热链嵌入，在浏览器里运行 1986 年的苏联家用电脑 Radio-86RK。站点自带大量示例程序，也可以在模拟器界面加载自己的程序文件。',
        demoHint: '本页不分发 ROM 或软件——模拟器及其示例目录由 rk86.ru 提供，程序文件在自己的界面加载；「在新标签页打开」可获得完整独立体验。',
        demoOpen: '启动模拟器',
        loading: 'Radio-86RK 启动中，请稍候...',
        loadingTip: '模拟器从 rk86.ru 加载，首次启动可能较慢',
        loadingSlow: '加载较慢，请耐心等待；也可以在新标签页打开模拟器',
        openInNewTab: '在新标签页打开模拟器 ↗',
        instructions: '使用说明',
        controlsTitle: '操作方式',
        controlsHint1: '点击嵌入画面取得键盘焦点，然后按 CMD/CTRL-K 打开命令帮助；也可以按 l 选择文件、o 打开目录、g 运行程序。',
        controlsHint2: '支持 .rk、.rkr、.gam、.pki、.bin 等格式；暂停、复位、保存状态和全屏请使用模拟器自己的快捷键或菜单。',
        aboutTitle: '关于',
        aboutHint: 'Radio-86RK 是 1986 年的苏联 8 位家用电脑，基于 Intel 8080 / КР580ВМ80A。模拟由 begoon/rk86-js（MIT）提供，热链嵌入官方站点 rk86.ru。',
        playing: '正在运行：',
        fullscreen: '全屏'
    },
    en: {
        pageTitle: 'Radio-86RK',
        reset: 'Reset',
        tabDemo: 'Emulator',
        demoTitle: 'Radio-86RK Emulator',
        demoDesc: 'Run the 1986 Soviet home computer Radio-86RK in your browser, embedded by hotlink to the official rk86.ru web app. The site ships a large catalog of demo programs, and you can load your own program files from the emulator UI.',
        demoHint: 'This host bundles no ROMs or software - the emulator and its demo catalog are served by rk86.ru, and program files are loaded in the emulator own UI. Use the ‘Open in a new tab’ link for the full standalone experience.',
        demoOpen: 'Launch Emulator',
        loading: 'Starting Radio-86RK, please wait...',
        loadingTip: 'The emulator loads from rk86.ru; the first start can take a while',
        loadingSlow: 'Still loading - please wait a bit longer, or open the simulator in a new tab',
        openInNewTab: 'Open the emulator in a new tab ↗',
        instructions: 'Instructions',
        controlsTitle: 'Controls',
        controlsHint1: 'Click the embedded screen for keyboard focus, then press CMD/CTRL-K for command help; l selects a file, o opens the catalog and g runs a program.',
        controlsHint2: 'Formats include .rk, .rkr, .gam, .pki and .bin; use the emulator own shortcuts for pause, reset, save state and fullscreen.',
        aboutTitle: 'About',
        aboutHint: 'Radio-86RK is a Soviet 8-bit home computer from 1986 based on the Intel 8080 / КР580ВМ80A. Emulation by begoon/rk86-js (MIT), embedded by hotlink to the official rk86.ru site.',
        playing: 'Now running: ',
        fullscreen: 'Fullscreen'
    },
    ja: {
        pageTitle: 'Radio-86RK',
        reset: 'リセット',
        tabDemo: 'エミュレータ',
        demoTitle: 'Radio-86RK エミュレータ',
        demoDesc: '公式 rk86.ru Web アプリへのホットリンク埋め込みで、1986 年のソ連製ホームコンピュータ Radio-86RK をブラウザで動かします。多数のデモプログラムを搭載し、独自のプログラムもエミュレータ内で読み込めます。',
        demoHint: 'このホストページは ROM やソフトウェアを同梱しません。エミュレータとデモカタログは rk86.ru が提供し、プログラムはエミュレータ自身の UI で読み込みます。新しいタブで開くとフルスタンドアロン体験になります。',
        demoOpen: 'エミュレータを起動',
        loading: 'Radio-86RK を起動中...',
        loadingTip: 'エミュレータは rk86.ru から読み込まれます。初回起動は時間がかかることがあります',
        loadingSlow: '読み込みが遅い場合はそのままお待ちいただくか、新しいタブでエミュレータを開いてください',
        openInNewTab: '新しいタブでエミュレータを開く ↗',
        instructions: '使い方',
        controlsTitle: '操作方法',
        controlsHint1: '埋め込み画面をクリックしてキーボードフォーカスを合わせ、CMD/CTRL-K でコマンドヘルプを開きます。l でファイル選択、o でカタログ、g でプログラム実行です。',
        controlsHint2: '.rk、.rkr、.gam、.pki、.bin などに対応。一時停止・リセット・セーブ・全画面はエミュレータ自身のショートカットを使ってください。',
        aboutTitle: 'について',
        aboutHint: 'Radio-86RK は 1986 年のソ連製 8 ビットホームコンピュータで、Intel 8080 / КР580ВМ80A ベースです。begoon/rk86-js（MIT）によるエミュレーションを公式サイト rk86.ru からホットリンク提供します。',
        playing: '実行中：',
        fullscreen: '全画面'
    },
    ko: {
        pageTitle: 'Radio-86RK',
        reset: '재설정',
        tabDemo: '에뮬레이터',
        demoTitle: 'Radio-86RK 에뮬레이터',
        demoDesc: '공식 rk86.ru 웹 앱 핫링크 임베드로 1986년 소련 가정용 컴퓨터 Radio-86RK를 브라우저에서 실행합니다. 다양한 데모 프로그램이 포함되며, 자기 프로그램 파일도 에뮬레이터에서 불러올 수 있습니다.',
        demoHint: '이 호스트 페이지는 ROM이나 소프트웨어를 포함하지 않습니다. 에뮬레이터와 데모 카탈로그는 rk86.ru에서 제공하고, 프로그램은 에뮬레이터 자체 UI에서 불러옵니다. 새 탭에서 열면 완전한 독립 실행 환경이 됩니다.',
        demoOpen: '에뮬레이터 실행',
        loading: 'Radio-86RK 시작 중...',
        loadingTip: '에뮬레이터는 rk86.ru에서 로드됩니다. 첫 실행은 시간이 걸릴 수 있습니다',
        loadingSlow: '로딩이 느리면 조금 더 기다리거나 새 탭에서 에뮬레이터를 여세요',
        openInNewTab: '새 탭에서 에뮬레이터 열기 ↗',
        instructions: '사용 방법',
        controlsTitle: '조작 방법',
        controlsHint1: '내장 화면을 클릭해 키보드 포커스를 준 뒤 CMD/CTRL-K로 명령 도움말을 엽니다. l은 파일 선택, o는 카탈로그, g는 프로그램 실행입니다.',
        controlsHint2: '.rk, .rkr, .gam, .pki, .bin 등을 지원합니다. 일시정지, 재설정, 상태 저장, 전체 화면은 에뮬레이터 자체 단축키를 사용하세요.',
        aboutTitle: '소개',
        aboutHint: 'Radio-86RK는 1986년 소련의 8비트 가정용 컴퓨터로 Intel 8080 / КР580ВМ80A를 사용했습니다. begoon/rk86-js(MIT) 에뮬레이션을 공식 사이트 rk86.ru에서 핫링크로 제공합니다.',
        playing: '실행 중: ',
        fullscreen: '전체 화면'
    },
    fr: {
        pageTitle: 'Radio-86RK',
        reset: 'Réinitialiser',
        tabDemo: 'Émulateur',
        demoTitle: 'Émulateur Radio-86RK',
        demoDesc: "Faites tourner l'ordinateur domestique soviétique Radio-86RK (1986) dans votre navigateur, intégré par lien direct vers l'application web officielle rk86.ru. Le site fournit de nombreux programmes de démonstration et vous pouvez charger vos propres fichiers depuis l'interface de l'émulateur.",
        demoHint: "Cette page n'inclut aucune ROM ni aucun logiciel - l'émulateur et son catalogue de démonstrations sont servis par rk86.ru, et les fichiers de programmes sont chargés dans l'interface de l'émulateur. Utilisez le lien « Ouvrir dans un nouvel onglet » pour l'expérience autonome complète.",
        demoOpen: "Lancer l'émulateur",
        loading: "Démarrage de Radio-86RK, veuillez patienter...",
        loadingTip: "L'émulateur se charge depuis rk86.ru ; le premier démarrage peut être long",
        loadingSlow: "Chargement lent - patientez encore un peu, ou ouvrez l'émulateur dans un nouvel onglet",
        openInNewTab: "Ouvrir l'émulateur dans un nouvel onglet ↗",
        instructions: 'Instructions',
        controlsTitle: 'Commandes',
        controlsHint1: "Cliquez dans l'écran intégré pour donner le focus au clavier, puis appuyez sur CMD/CTRL-K pour l'aide ; l sélectionne un fichier, o ouvre le catalogue et g lance un programme.",
        controlsHint2: "Formats pris en charge : .rk, .rkr, .gam, .pki et .bin ; utilisez les raccourcis de l'émulateur pour pause, réinitialisation, sauvegarde et plein écran.",
        aboutTitle: 'À propos',
        aboutHint: "Le Radio-86RK est un ordinateur domestique soviétique 8 bits de 1986 basé sur l'Intel 8080 / КР580ВМ80A. Émulation par begoon/rk86-js (MIT), intégrée par lien direct vers le site officiel rk86.ru.",
        playing: 'En cours : ',
        fullscreen: 'Plein écran'
    },
    de: {
        pageTitle: 'Radio-86RK',
        reset: 'Zurücksetzen',
        tabDemo: 'Emulator',
        demoTitle: 'Radio-86RK-Emulator',
        demoDesc: 'Betreiben Sie den sowjetischen Heimcomputer Radio-86RK aus dem Jahr 1986 im Browser - per Hotlink zur offiziellen rk86.ru-Web-App. Die Site enthält eine große Sammlung von Demoprogrammen; eigene Programmdateien laden Sie in der Emulator-Oberfläche.',
        demoHint: 'Diese Host-Seite enthält keine ROMs und keine Software - Emulator und Demo-Katalog kommen von rk86.ru, Programmdateien werden in der Emulator-Oberfläche geladen. Der Link «Im neuen Tab öffnen» bietet das vollständige eigenständige Erlebnis.',
        demoOpen: 'Emulator starten',
        loading: 'Radio-86RK wird gestartet, bitte warten...',
        loadingTip: 'Der Emulator lädt von rk86.ru; der erste Start kann dauern',
        loadingSlow: 'Lädt langsam - warten Sie noch etwas oder öffnen Sie den Emulator in einem neuen Tab',
        openInNewTab: 'Emulator in einem neuen Tab öffnen ↗',
        instructions: 'Anleitung',
        controlsTitle: 'Steuerung',
        controlsHint1: 'Klicken Sie in den eingebetteten Bildschirm, um Tastaturfokus zu erhalten, dann CMD/CTRL-K für die Befehlshilfe; l wählt eine Datei, o öffnet den Katalog und g startet ein Programm.',
        controlsHint2: 'Unterstützt .rk, .rkr, .gam, .pki und .bin; Pause, Reset, Speichern und Vollbild über die Emulator-Tastenkürzel.',
        aboutTitle: 'Über',
        aboutHint: 'Der Radio-86RK ist ein sowjetischer 8-Bit-Heimcomputer von 1986 mit Intel 8080 / КР580ВМ80A. Emulation durch begoon/rk86-js (MIT), per Hotlink zur offiziellen Site rk86.ru eingebettet.',
        playing: 'Läuft: ',
        fullscreen: 'Vollbild'
    },

    es: {
        pageTitle: 'Radio-86RK',
        reset: 'Restablecer',
        tabDemo: 'Emulador',
        demoTitle: 'Emulador de Radio-86RK',
        demoDesc: 'Ejecuta el ordenador doméstico soviético Radio-86RK (1986) en tu navegador, incrustado por enlace directo a la aplicación web oficial rk86.ru. El sitio incluye un amplio catálogo de programas de demostración y puedes cargar tus propios archivos desde la interfaz del emulador.',
        demoHint: 'Esta página no incluye ROMs ni software: el emulador y su catálogo de demostraciones los sirve rk86.ru, y los archivos de programas se cargan en la propia interfaz del emulador. Usa el enlace «Abrir en una pestaña nueva» para disfrutar la experiencia independiente completa.',
        demoOpen: 'Iniciar emulador',
        loading: 'Iniciando Radio-86RK, espera...',
        loadingTip: 'El emulador se carga desde rk86.ru; el primer arranque puede tardar',
        loadingSlow: 'Carga lenta - espera un poco más o abre el emulador en una pestaña nueva',
        openInNewTab: 'Abrir el emulador en una pestaña nueva ↗',
        instructions: 'Instrucciones',
        controlsTitle: 'Controles',
        controlsHint1: 'Haz clic en la pantalla incrustada para dar foco al teclado y pulsa CMD/CTRL-K para la ayuda de comandos; l selecciona un archivo, o abre el catálogo y g ejecuta un programa.',
        controlsHint2: 'Admite .rk, .rkr, .gam, .pki y .bin; usa los atajos del emulador para pausa, reinicio, guardar estado y pantalla completa.',
        aboutTitle: 'Acerca de',
        aboutHint: 'Radio-86RK es un ordenador doméstico soviético de 8 bits de 1986 basado en Intel 8080 / КР580ВМ80A. Emulación por begoon/rk86-js (MIT), incrustada por enlace directo al sitio oficial rk86.ru.',
        playing: 'Ejecutando: ',
        fullscreen: 'Pantalla completa'
    },
    ru: {
        pageTitle: 'Радио-86РК',
        reset: 'Сброс',
        tabDemo: 'Эмулятор',
        demoTitle: 'Эмулятор Радио-86РК',
        demoDesc: 'Запускайте советский домашний компьютер Радио-86РК (1986) в браузере через встраивание официального веб-приложения rk86.ru. Сайт содержит множество демонстрационных программ, а свои файлы можно загрузить в интерфейсе эмулятора.',
        demoHint: 'Эта страница не содержит ROM и ПО: эмулятор и каталог демопрограмм предоставляет rk86.ru, файлы программ загружаются в самом эмуляторе. Ссылка ‘Открыть в новой вкладке’ даёт полный автономный режим.',
        demoOpen: 'Запустить эмулятор',
        loading: 'Радио-86РК запускается, подождите...',
        loadingTip: 'Эмулятор загружается с rk86.ru; первая загрузка может быть долгой',
        loadingSlow: 'Загрузка идёт медленно - подождите ещё немного или откройте эмулятор в новой вкладке',
        openInNewTab: 'Открыть эмулятор в новой вкладке ↗',
        instructions: 'Инструкция',
        controlsTitle: 'Управление',
        controlsHint1: 'Кликните по встроенному экрану для фокуса клавиатуры, затем CMD/CTRL-K открывает справку по командам; l выбирает файл, o открывает каталог, g запускает программу.',
        controlsHint2: 'Поддерживаются .rk, .rkr, .gam, .pki и .bin; пауза, сброс, сохранение состояния и полный экран - через собственные горячие клавиши эмулятора.',
        aboutTitle: 'О платформе',
        aboutHint: 'Радио-86РК — советский 8-битный домашний компьютер 1986 года на базе Intel 8080 / КР580ВМ80А. Эмуляция от begoon/rk86-js (MIT), встраивание горячей ссылкой на официальный сайт rk86.ru.',
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

function showSlowLink() {
    var overlay = document.getElementById('loadingOverlay');
    if (!overlay || document.getElementById('slowOpenLink')) return;
    var link = document.createElement('a');
    link.id = 'slowOpenLink';
    link.href = RK_HOME;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = t('openInNewTab');
    link.style.cssText = 'display:inline-block;margin-top:14px;color:#33ff66;text-decoration:underline;font-size:14px;';
    overlay.appendChild(link);
}

function showPlayer(title) {
    document.getElementById('uploadSection').classList.add('hidden');
    document.getElementById('playerSection').classList.add('active');
    document.getElementById('pageTitle').textContent = t('playing') + (title || 'Radio-86RK');
    document.getElementById('resetBtn').style.display = '';
    document.getElementById('fullscreenBtn').style.display = '';
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

function playRk86() {
    var frame = document.getElementById('rk86Frame');
    if (!frame) return;
    showPlayer('Radio-86RK');
    // rk86.ru handles its own catalog and program loading inside the iframe.
    frame.addEventListener('load', hideOverlay, { once: true });
    frame.src = RK_HOME;
    slowTimer = setTimeout(function () {
        showToast(t('loadingSlow'));
        showSlowLink();
    }, 15000);
}

function stopPlayback() {
    var frame = document.getElementById('rk86Frame');
    if (frame) frame.src = 'about:blank';
    hideOverlay();
    document.getElementById('playerSection').classList.remove('active');
    document.getElementById('uploadSection').classList.remove('hidden');
    document.getElementById('pageTitle').textContent = t('pageTitle');
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('fullscreenBtn').style.display = 'none';
}

// ---- demo tab ----------------------------------------------------------
document.getElementById('demoOpenBtn').addEventListener('click', playRk86);
(function () {
    var link = document.getElementById('demoOpenNewTab');
    if (link) link.href = RK_HOME;
})();

// ---- back / reset ------------------------------------------------------
document.getElementById('backBtn').addEventListener('click', function () {
    if (document.getElementById('playerSection').classList.contains('active')) { stopPlayback(); return; }
    window.location.href = '../routes/game.html?category=computer';
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

// ---- fullscreen --------------------------------------------------------
document.getElementById('fullscreenBtn').addEventListener('click', function () {
    var frame = document.getElementById('rk86Frame');
    if (!frame) return;
    if (document.fullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen();
    } else if (frame.requestFullscreen) {
        frame.requestFullscreen();
    } else if (frame.webkitRequestFullscreen) {
        frame.webkitRequestFullscreen();
    }
});

// ---- init --------------------------------------------------------------
applyI18n();
