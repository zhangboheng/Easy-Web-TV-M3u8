// Palm OS Page JavaScript - CloudpilotEmu (GPL-3.0, by cloudpilot-emu) embedded
// by hotlink to the official web app. No ROMs are bundled or hot-linked:
// users must provide their own Palm OS ROM image and software inside the app.

var PALM_BASE = 'https://cloudpilot-emu.github.io/app/';

// Internationalization (8 languages, same key set as toj2me.js)
var i18n = {
    zh: {
        pageTitle: 'Palm OS',
        reset: '重置',
        tabDemo: '模拟器',
        demoTitle: 'Palm OS 游戏',
        demoDesc: '通过 CloudpilotEmu（GPL-3.0，热链嵌入官方 Web App）在浏览器里运行 Palm OS 掌上电脑的游戏与应用。支持 Dragonball 设备（Palm OS 1–4）与 ARM 架构 Tungsten E2（OS 5）。',
        demoOpen: '启动模拟器',
        demoHint: '不内置任何 ROM——需要你从自己的设备提取 Palm OS ROM 镜像后，在模拟器内上传安装。不热链商业软件。',
        loading: 'CloudpilotEmu 启动中，请稍候...',
        loadingTip: '模拟器从其服务器下载，首次加载可能较慢',
        loadingSlow: '加载较慢，请耐心等待；也可以在新标签页打开模拟器',
        openInNewTab: '在新标签页打开模拟器 ↗',
        instructions: '使用说明',
        controlsTitle: '操作方式',
        controlsHint1: '用鼠标/触摸点击机身按钮，或待模拟器获得焦点后使用键盘',
        controlsHint2: '在模拟器内选择机型并安装 ROM 镜像，然后添加你自己的 .prc 应用与数据库',
        aboutTitle: '关于',
        aboutHint: 'Palm OS：经典 PDA/掌上平台（1996–2007），拥有大量游戏。模拟由 CloudpilotEmu（GPL-3.0）热链提供。',
        playing: '正在运行：'
    },
    en: {
        pageTitle: 'Palm OS',
        reset: 'Reset',
        tabDemo: 'Emulator',
        demoTitle: 'Palm OS Games',
        demoDesc: 'Run Palm OS apps and games in your browser with CloudpilotEmu (GPL-3.0, embedded by hotlink to the official web app). It emulates Dragonball devices (Palm OS 1-4) and the ARM-based Tungsten E2 (OS 5).',
        demoOpen: 'Launch Emulator',
        demoHint: 'No ROMs are bundled - a Palm OS ROM image is required and must be provided by you from your own device. Commercial software is not hot-linked here.',
        loading: 'Starting CloudpilotEmu, please wait...',
        loadingTip: 'The emulator downloads from its host; first load can take a while',
        loadingSlow: 'Still loading - please wait a bit longer, or open the emulator in a new tab',
        openInNewTab: 'Open the emulator in a new tab ↗',
        instructions: 'Instructions',
        controlsTitle: 'Controls',
        controlsHint1: 'Use the on-screen device buttons with mouse/touch, or the keyboard once the emulator has focus',
        controlsHint2: 'Inside the emulator, pick a device and install a ROM image, then add your own .prc apps and databases',
        aboutTitle: 'About',
        aboutHint: 'Palm OS: the classic PDA/palm-size platform (1996-2007) with a large library of games. Emulation via CloudpilotEmu (GPL-3.0), embedded by hotlink.',
        playing: 'Now running: '
    },
    ja: {
        pageTitle: 'Palm OS',
        reset: 'リセット',
        tabDemo: 'エミュレータ',
        demoTitle: 'Palm OS ゲーム',
        demoDesc: 'CloudpilotEmu（GPL-3.0、公式Webアプリへのホットリンク埋め込み）でブラウザ上でPalm OSのゲームとアプリを実行します。Dragonballデバイス（Palm OS 1-4）とARMベースのTungsten E2（OS 5）に対応。',
        demoOpen: 'エミュレータを起動',
        demoHint: 'ROMは同梱されていません。お持ちのPalm OSデバイスから抽出したROMイメージをエミュレータ内でアップロードする必要があります。商用ソフトはホットリンクしません。',
        loading: 'CloudpilotEmu を起動中...',
        loadingTip: 'エミュレータはホストからダウンロードされます。初回は時間がかかることがあります',
        loadingSlow: '読み込みが遅い場合はそのままお待ちいただくか、新しいタブでエミュレータを開いてください',
        openInNewTab: '新しいタブでエミュレータを開く ↗',
        instructions: '使い方',
        controlsTitle: '操作方法',
        controlsHint1: '画面上のデバイスボタンをマウス/タッチで操作、またはエミュレータにフォーカスを合わせてキーボードを使用',
        controlsHint2: 'エミュレータ内で機種を選びROMイメージをインストールし、自分の .prc アプリとデータベースを追加してください',
        aboutTitle: 'Palm OS について',
        aboutHint: 'Palm OS：1996-2007年のクラシックなPDA/ハンドヘルドプラットフォーム。多くのゲームがあります。エミュレーションはCloudpilotEmu（GPL-3.0）をホットリンクで提供。',
        playing: '実行中：'
    },
    ko: {
        pageTitle: 'Palm OS',
        reset: '재설정',
        tabDemo: '에뮬레이터',
        demoTitle: 'Palm OS 게임',
        demoDesc: 'CloudpilotEmu(GPL-3.0, 공식 웹 앱 핫링크 임베드)로 브라우저에서 Palm OS 게임과 앱을 실행하세요. Dragonball 기기(Palm OS 1-4)와 ARM 기반 Tungsten E2(OS 5)를 지원합니다.',
        demoOpen: '에뮬레이터 실행',
        demoHint: 'ROM은 포함되지 않습니다. 소유한 Palm OS 기기에서 추출한 ROM 이미지를 에뮬레이터 안에서 업로드해야 합니다. 상용 소프트웨어는 핫링크하지 않습니다.',
        loading: 'CloudpilotEmu 시작 중...',
        loadingTip: '에뮬레이터는 호스트에서 다운로드됩니다. 첫 로드는 시간이 걸릴 수 있습니다',
        loadingSlow: '로딩이 느리면 조금 더 기다리거나 새 탭에서 에뮬레이터를 여세요',
        openInNewTab: '새 탭에서 에뮬레이터 열기 ↗',
        instructions: '사용 방법',
        controlsTitle: '조작 방법',
        controlsHint1: '화면의 기기 버튼을 마우스/터치로 누르거나, 에뮬레이터에 포커스를 맞춘 후 키보드를 사용하세요',
        controlsHint2: '에뮬레이터 안에서 기기를 선택하고 ROM 이미지를 설치한 뒤, 자신의 .prc 앱과 데이터베이스를 추가하세요',
        aboutTitle: '소개',
        aboutHint: 'Palm OS: 1996-2007년의 클래식 PDA/핸드헬드 플랫폼으로 풍부한 게임 라이브러리를 보유. CloudpilotEmu(GPL-3.0)를 핫링크로 제공.',
        playing: '실행 중: '
    },
    fr: {
        pageTitle: 'Palm OS',
        reset: 'Réinitialiser',
        tabDemo: 'Émulateur',
        demoTitle: 'Jeux Palm OS',
        demoDesc: "Exécutez des applications et jeux Palm OS dans votre navigateur avec CloudpilotEmu (GPL-3.0, intégré par lien direct vers l'application web officielle). Il émule les appareils Dragonball (Palm OS 1-4) et le Tungsten E2 à base ARM (OS 5).",
        demoOpen: "Lancer l'émulateur",
        demoHint: "Aucune ROM n'est fournie - une image ROM Palm OS est requise et doit être fournie par vous depuis votre propre appareil. Les logiciels commerciaux ne sont pas liés ici.",
        loading: "Démarrage de CloudpilotEmu, veuillez patienter...",
        loadingTip: "L'émulateur est téléchargé depuis son hôte ; le premier chargement peut prendre du temps",
        loadingSlow: "Chargement lent - patientez encore un peu, ou ouvrez l'émulateur dans un nouvel onglet",
        openInNewTab: "Ouvrir l'émulateur dans un nouvel onglet ↗",
        instructions: 'Instructions',
        controlsTitle: 'Commandes',
        controlsHint1: "Utilisez les boutons de l'appareil à l'écran avec la souris/le tactile, ou le clavier une fois l'émulateur focalisé",
        controlsHint2: "Dans l'émulateur, choisissez un appareil et installez une image ROM, puis ajoutez vos applications .prc et bases de données",
        aboutTitle: 'À propos',
        aboutHint: "Palm OS : la plateforme PDA classique (1996-2007) avec une vaste bibliothèque de jeux. Émulation via CloudpilotEmu (GPL-3.0), intégré par lien direct.",
        playing: 'En cours : '
    },
    de: {
        pageTitle: 'Palm OS',
        reset: 'Zurücksetzen',
        tabDemo: 'Emulator',
        demoTitle: 'Palm-OS-Spiele',
        demoDesc: 'Führen Sie Palm-OS-Anwendungen und -Spiele in Ihrem Browser aus - mit CloudpilotEmu (GPL-3.0, per Hotlink zur offiziellen Web-App eingebettet). Es emuliert Dragonball-Geräte (Palm OS 1-4) und das ARM-basierte Tungsten E2 (OS 5).',
        demoOpen: 'Emulator starten',
        demoHint: 'Es sind keine ROMs enthalten - ein Palm-OS-ROM-Image ist erforderlich und muss von Ihnen von Ihrem eigenen Gerät stammen. Kommerzielle Software wird nicht verlinkt.',
        loading: 'CloudpilotEmu wird gestartet, bitte warten...',
        loadingTip: 'Der Emulator wird von seinem Host heruntergeladen; das erste Laden kann dauern',
        loadingSlow: 'Lädt langsam - warten Sie noch etwas oder öffnen Sie den Emulator in einem neuen Tab',
        openInNewTab: 'Emulator in einem neuen Tab öffnen ↗',
        instructions: 'Anleitung',
        controlsTitle: 'Steuerung',
        controlsHint1: 'Benutzen Sie die Geräte-Tasten auf dem Bildschirm mit Maus/Touch oder die Tastatur, sobald der Emulator den Fokus hat',
        controlsHint2: 'Wählen Sie im Emulator ein Gerät und installieren Sie ein ROM-Image, dann fügen Sie Ihre eigenen .prc-Apps und Datenbanken hinzu',
        aboutTitle: 'Über',
        aboutHint: 'Palm OS: die klassische PDA-Plattform (1996-2007) mit einer großen Spielesammlung. Emulation via CloudpilotEmu (GPL-3.0), per Hotlink eingebettet.',
        playing: 'Läuft: '
    },

    es: {
        pageTitle: 'Palm OS',
        reset: 'Restablecer',
        tabDemo: 'Emulador',
        demoTitle: 'Juegos de Palm OS',
        demoDesc: 'Ejecuta aplicaciones y juegos de Palm OS en tu navegador con CloudpilotEmu (GPL-3.0, incrustado por enlace directo a la aplicación web oficial). Emula dispositivos Dragonball (Palm OS 1-4) y el Tungsten E2 basado en ARM (OS 5).',
        demoOpen: 'Iniciar emulador',
        demoHint: 'No se incluyen ROMs - se requiere una imagen ROM de Palm OS que debes proporcionar desde tu propio dispositivo. No se enlaza software comercial.',
        loading: 'Iniciando CloudpilotEmu, espera...',
        loadingTip: 'El emulador se descarga desde su host; la primera carga puede tardar',
        loadingSlow: 'Carga lenta - espera un poco más o abre el emulador en una pestaña nueva',
        openInNewTab: 'Abrir el emulador en una pestaña nueva ↗',
        instructions: 'Instrucciones',
        controlsTitle: 'Controles',
        controlsHint1: 'Usa los botones del dispositivo en pantalla con ratón/táctil, o el teclado una vez que el emulador tenga el foco',
        controlsHint2: 'Dentro del emulador, elige un dispositivo e instala una imagen ROM, luego añade tus propias aplicaciones .prc y bases de datos',
        aboutTitle: 'Acerca de',
        aboutHint: 'Palm OS: la clásica plataforma PDA (1996-2007) con una gran biblioteca de juegos. Emulación vía CloudpilotEmu (GPL-3.0), incrustado por enlace directo.',
        playing: 'Ejecutando: '
    },
    ru: {
        pageTitle: 'Palm OS',
        reset: 'Сброс',
        tabDemo: 'Эмулятор',
        demoTitle: 'Игры Palm OS',
        demoDesc: 'Запускайте приложения и игры Palm OS в браузере с помощью CloudpilotEmu (GPL-3.0, встраивание горячей ссылкой на официальное веб-приложение). Эмулируются устройства Dragonball (Palm OS 1-4) и ARM-устройство Tungsten E2 (OS 5).',
        demoOpen: 'Запустить эмулятор',
        demoHint: 'ROM не включены - требуется образ ROM Palm OS, который вы должны предоставить со своего устройства. Коммерческое ПО не линкуется.',
        loading: 'CloudpilotEmu запускается, подождите...',
        loadingTip: 'Эмулятор скачивается с сервера; первая загрузка может занять время',
        loadingSlow: 'Загрузка идёт медленно - подождите ещё немного или откройте эмулятор в новой вкладке',
        openInNewTab: 'Открыть эмулятор в новой вкладке ↗',
        instructions: 'Инструкция',
        controlsTitle: 'Управление',
        controlsHint1: 'Используйте экранные кнопки устройства мышью/касанием или клавиатуру, когда эмулятор в фокусе',
        controlsHint2: 'В эмуляторе выберите устройство и установите образ ROM, затем добавьте свои приложения .prc и базы данных',
        aboutTitle: 'О платформе',
        aboutHint: 'Palm OS: классическая платформа КПК (1996-2007) с большой библиотекой игр. Эмуляция через CloudpilotEmu (GPL-3.0), встраивание горячей ссылкой.',
        playing: 'Запущено: '
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

// ---- tab switching (single tab, kept for structural parity) -------------
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
    link.href = PALM_BASE;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = t('openInNewTab');
    link.style.cssText = 'display:inline-block;margin-top:14px;color:#33ff66;text-decoration:underline;font-size:14px;';
    overlay.appendChild(link);
}

function showPlayer(title) {
    document.getElementById('uploadSection').classList.add('hidden');
    document.getElementById('playerSection').classList.add('active');
    document.getElementById('pageTitle').textContent = t('playing') + (title || 'Palm OS');
    document.getElementById('resetBtn').style.display = '';
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

function playPalm() {
    var frame = document.getElementById('palmFrame');
    if (!frame) return;
    showPlayer('Palm OS');
    // CloudpilotEmu manages device/ROM selection and uploads inside the app
    // itself; nothing can be passed from this host page.
    frame.addEventListener('load', hideOverlay, { once: true });
    frame.src = PALM_BASE;
    slowTimer = setTimeout(function () {
        showToast(t('loadingSlow'));
        showSlowLink();
    }, 15000);
}

function stopPlayback() {
    var frame = document.getElementById('palmFrame');
    if (frame) frame.src = 'about:blank';
    hideOverlay();
    document.getElementById('playerSection').classList.remove('active');
    document.getElementById('uploadSection').classList.remove('hidden');
    document.getElementById('pageTitle').textContent = t('pageTitle');
    document.getElementById('resetBtn').style.display = 'none';
}

// ---- demo tab ----------------------------------------------------------
document.getElementById('demoOpenBtn').addEventListener('click', playPalm);

// ---- back / reset ------------------------------------------------------
document.getElementById('backBtn').addEventListener('click', function () {
    var playerSection = document.getElementById('playerSection');
    if (playerSection.classList.contains('active')) { stopPlayback(); return; }
    window.location.href = '../routes/game.html?category=mobile';
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

