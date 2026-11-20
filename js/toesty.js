// Atari ST Page JavaScript - EstyJS (GPL-2.0-or-later) embedded by hotlink to the
// official web app at https://kaiec.github.io/EstyJS/. No ROMs or disk images are
// bundled by this host: the open-source EmuTOS ROM is part of the upstream app,
// and .st/.sts floppy images are loaded inside the emulator's own UI.

var ESTY_HOME = 'https://kaiec.github.io/EstyJS/';

// Internationalization (8 languages, same key set as tork86.js)
var i18n = {
    zh: {
        pageTitle: 'Atari ST',
        reset: '重置',
        tabDemo: '模拟器',
        demoTitle: 'Atari ST 模拟器',
        demoDesc: '通过 EstyJS 官方 Web App 热链嵌入，在浏览器里运行 68000 时代的 Atari ST 520/1040。EstyJS 2.0 使用开源 EmuTOS，提供软盘加载、鼠标同步和全屏模式。',
        demoHint: '本页不分发 ROM 或软件——EstyJS 与 EmuTOS 由官方站点提供，.st/.sts 软盘镜像在自己的界面加载；「在新标签页打开」可获得完整独立体验。',
        demoOpen: '启动模拟器',
        loading: 'Atari ST 启动中，请稍候...',
        loadingTip: '模拟器从 kaiec.github.io 加载，首次启动可能较慢',
        loadingSlow: '加载较慢，请耐心等待；也可以在新标签页打开模拟器',
        openInNewTab: '在新标签页打开模拟器 ↗',
        instructions: '使用说明',
        controlsTitle: '操作方式',
        controlsHint1: '点击软盘驱动器 A/B 加载 .st 或 .sts 镜像；点击嵌入画面取得键盘焦点，鼠标指针错位时可点鼠标中键重新对齐。',
        controlsHint2: '方向键与 Ctrl 模拟 1 号摇杆，也支持真实 USB 手柄；暂停、声音、复位和全屏请使用 EstyJS 自己的工具栏。',
        aboutTitle: '关于',
        aboutHint: 'Atari ST 是 1985 年发布的 16 位家用/专业电脑，采用 Motorola 68000，内置 MIDI。模拟由 kaiec/EstyJS（GPL-2.0-or-later）提供，默认使用开源 EmuTOS。',
        playing: '正在运行：',
        fullscreen: '全屏'
    },
    en: {
        pageTitle: 'Atari ST',
        reset: 'Reset',
        tabDemo: 'Emulator',
        demoTitle: 'Atari ST Emulator',
        demoDesc: 'Run the 68000-era Atari ST 520/1040 in your browser, embedded by hotlink to the official EstyJS web app. EstyJS 2.0 uses open-source EmuTOS and provides floppy loading, mouse synchronisation and fullscreen mode.',
        demoHint: 'This host bundles no ROMs or software - EstyJS and EmuTOS are served by the official site, and .st/.sts floppy images are loaded in the emulator own UI. Use the ‘Open in a new tab’ link for the full standalone experience.',
        demoOpen: 'Launch Emulator',
        loading: 'Starting Atari ST, please wait...',
        loadingTip: 'The emulator loads from kaiec.github.io; the first start can take a while',
        loadingSlow: 'Still loading - please wait a bit longer, or open the simulator in a new tab',
        openInNewTab: 'Open the emulator in a new tab ↗',
        instructions: 'Instructions',
        controlsTitle: 'Controls',
        controlsHint1: 'Click floppy drive A or B to load a .st/.sts image; click the embedded screen for keyboard focus, and use the middle mouse button to realign the pointer if needed.',
        controlsHint2: 'Cursor keys and Ctrl emulate joystick 1, and real USB gamepads are supported; use the EstyJS toolbar for pause, sound, reset and fullscreen.',
        aboutTitle: 'About',
        aboutHint: 'The Atari ST is a 16-bit home/professional computer launched in 1985 with a Motorola 68000 and built-in MIDI. Emulation by kaiec/EstyJS (GPL-2.0-or-later), using open-source EmuTOS by default.',
        playing: 'Now running: ',
        fullscreen: 'Fullscreen'
    },
    ja: {
        pageTitle: 'Atari ST',
        reset: 'リセット',
        tabDemo: 'エミュレータ',
        demoTitle: 'Atari ST エミュレータ',
        demoDesc: '公式 EstyJS Web アプリへのホットリンク埋め込みで、68000 世代の Atari ST 520/1040 をブラウザで動かします。EstyJS 2.0 はオープンソース EmuTOS を使い、フロッピー読み込み、マウス同期、全画面に対応します。',
        demoHint: 'このホストページは ROM やソフトウェアを同梱しません。EstyJS と EmuTOS は公式サイトが提供し、.st/.sts フロッピーイメージはエミュレータ自身の UI で読み込みます。新しいタブで開くとフルスタンドアロン体験になります。',
        demoOpen: 'エミュレータを起動',
        loading: 'Atari ST を起動中...',
        loadingTip: 'エミュレータは kaiec.github.io から読み込まれます。初回起動は時間がかかることがあります',
        loadingSlow: '読み込みが遅い場合はそのままお待ちいただくか、新しいタブでエミュレータを開いてください',
        openInNewTab: '新しいタブでエミュレータを開く ↗',
        instructions: '使い方',
        controlsTitle: '操作方法',
        controlsHint1: 'フロッピードライブ A/B をクリックして .st/.sts イメージを読み込みます。埋め込み画面をクリックしてキーボードフォーカスを合わせ、必要ならマウス中ボタンでポインタを再同期してください。',
        controlsHint2: '方向キーと Ctrl でジョイスティック 1 を操作し、USB ゲームパッドにも対応。一時停止・サウンド・リセット・全画面は EstyJS のツールバーを使ってください。',
        aboutTitle: 'について',
        aboutHint: 'Atari ST は 1985 年に発売された Motorola 68000 搭載の 16 ビット computer で、MIDI を標準装備しました。kaiec/EstyJS（GPL-2.0-or-later）によるエミュレーションで、既定ではオープンソース EmuTOS を使用します。',
        playing: '実行中：',
        fullscreen: '全画面'
    },
    ko: {
        pageTitle: 'Atari ST',
        reset: '재설정',
        tabDemo: '에뮬레이터',
        demoTitle: 'Atari ST 에뮬레이터',
        demoDesc: '공식 EstyJS 웹 앱 핫링크 임베드로 68000 세대 Atari ST 520/1040을 브라우저에서 실행합니다. EstyJS 2.0은 오픈 소스 EmuTOS를 사용하며 플로피 로딩, 마우스 동기화, 전체 화면을 제공합니다.',
        demoHint: '이 호스트 페이지는 ROM이나 소프트웨어를 포함하지 않습니다. EstyJS와 EmuTOS는 공식 사이트에서 제공하고, .st/.sts 플로피 이미지는 에뮬레이터 자체 UI에서 불러옵니다. 새 탭에서 열면 완전한 독립 실행 환경이 됩니다.',
        demoOpen: '에뮬레이터 실행',
        loading: 'Atari ST 시작 중...',
        loadingTip: '에뮬레이터는 kaiec.github.io에서 로드됩니다. 첫 실행은 시간이 걸릴 수 있습니다',
        loadingSlow: '로딩이 느리면 조금 더 기다리거나 새 탭에서 에뮬레이터를 여세요',
        openInNewTab: '새 탭에서 에뮬레이터 열기 ↗',
        instructions: '사용 방법',
        controlsTitle: '조작 방법',
        controlsHint1: '플로피 드라이브 A/B를 클릭해 .st/.sts 이미지를 불러옵니다. 내장 화면을 클릭해 키보드 포커스를 주고, 필요하면 마우스 가운데 버튼으로 포인터를 다시 맞추세요.',
        controlsHint2: '방향키와 Ctrl로 1번 조이스틱을 흉내 내며 실제 USB 게임패드도 지원합니다. 일시정지, 사운드, 재설정, 전체 화면은 EstyJS 도구 모음을 사용하세요.',
        aboutTitle: '소개',
        aboutHint: 'Atari ST는 1985년에 출시된 Motorola 68000 기반 16비트 가정용/전문가용 컴퓨터로 MIDI를 기본 지원했습니다. kaiec/EstyJS(GPL-2.0-or-later) 에뮬레이션을 사용하며 기본적으로 오픈 소스 EmuTOS를 사용합니다.',
        playing: '실행 중: ',
        fullscreen: '전체 화면'
    },
    fr: {
        pageTitle: 'Atari ST',
        reset: 'Réinitialiser',
        tabDemo: 'Émulateur',
        demoTitle: 'Émulateur Atari ST',
        demoDesc: "Faites tourner l'Atari ST 520/1040 de l'époque 68000 dans votre navigateur, intégré par lien direct vers l'application web officielle EstyJS. EstyJS 2.0 utilise l'EmuTOS open source et propose le chargement de disquettes, la synchronisation de la souris et le plein écran.",
        demoHint: "Cette page n'inclut aucune ROM ni aucun logiciel - EstyJS et EmuTOS sont servis par le site officiel, et les images de disquette .st/.sts sont chargées dans l'interface de l'émulateur. Utilisez le lien « Ouvrir dans un nouvel onglet » pour l'expérience autonome complète.",
        demoOpen: "Lancer l'émulateur",
        loading: "Démarrage de l'Atari ST, veuillez patienter...",
        loadingTip: "L'émulateur se charge depuis kaiec.github.io ; le premier démarrage peut être long",
        loadingSlow: "Chargement lent - patientez encore un peu, ou ouvrez l'émulateur dans un nouvel onglet",
        openInNewTab: "Ouvrir l'émulateur dans un nouvel onglet ↗",
        instructions: 'Instructions',
        controlsTitle: 'Commandes',
        controlsHint1: "Cliquez sur le lecteur de disquettes A ou B pour charger une image .st/.sts ; cliquez dans l'écran intégré pour donner le focus au clavier et utilisez le bouton central de la souris pour recentrer le pointeur.",
        controlsHint2: "Les flèches et Ctrl émulent le joystick 1 ; les manettes USB réelles sont prises en charge. Utilisez la barre d'outils EstyJS pour pause, son, réinitialisation et plein écran.",
        aboutTitle: 'À propos',
        aboutHint: "L'Atari ST est un ordinateur domestique et professionnel 16 bits lancé en 1985 avec un Motorola 68000 et des ports MIDI intégrés. Émulation par kaiec/EstyJS (GPL-2.0-or-later), utilisant EmuTOS open source par défaut.",
        playing: 'En cours : ',
        fullscreen: 'Plein écran'
    },
    de: {
        pageTitle: 'Atari ST',
        reset: 'Zurücksetzen',
        tabDemo: 'Emulator',
        demoTitle: 'Atari ST-Emulator',
        demoDesc: 'Betreiben Sie den Atari ST 520/1040 der 68000-Ära im Browser - per Hotlink zur offiziellen EstyJS-Web-App. EstyJS 2.0 nutzt das quelloffene EmuTOS und bietet Diskettenladen, Maus-Synchronisation und Vollbild.',
        demoHint: 'Diese Host-Seite enthält keine ROMs und keine Software - EstyJS und EmuTOS kommen von der offiziellen Site, .st/.sts-Diskettenabbilder werden in der Emulator-Oberfläche geladen. Der Link «Im neuen Tab öffnen» bietet das vollständige eigenständige Erlebnis.',
        demoOpen: 'Emulator starten',
        loading: 'Atari ST wird gestartet, bitte warten...',
        loadingTip: 'Der Emulator lädt von kaiec.github.io; der erste Start kann dauern',
        loadingSlow: 'Lädt langsam - warten Sie noch etwas oder öffnen Sie den Emulator in einem neuen Tab',
        openInNewTab: 'Emulator in einem neuen Tab öffnen ↗',
        instructions: 'Anleitung',
        controlsTitle: 'Steuerung',
        controlsHint1: 'Klicken Sie auf Diskettenlaufwerk A oder B, um ein .st/.sts-Abbild zu laden; klicken Sie in den eingebetteten Bildschirm für Tastaturfokus und nutzen Sie bei Bedarf die mittlere Maustaste zum Neuausrichten des Zeigers.',
        controlsHint2: 'Pfeiltasten und Ctrl emulieren Joystick 1, echte USB-Gamepads werden unterstützt; Pause, Ton, Reset und Vollbild über die EstyJS-Werkzeugleiste.',
        aboutTitle: 'Über',
        aboutHint: 'Der Atari ST ist ein 16-Bit-Heim- und Proficomputer von 1985 mit Motorola 68000 und integriertem MIDI. Emulation durch kaiec/EstyJS (GPL-2.0-or-later), standardmäßig mit quelloffenem EmuTOS.',
        playing: 'Läuft: ',
        fullscreen: 'Vollbild'
    },
    es: {
        pageTitle: 'Atari ST',
        reset: 'Restablecer',
        tabDemo: 'Emulador',
        demoTitle: 'Emulador de Atari ST',
        demoDesc: 'Ejecuta el Atari ST 520/1040 de la época del 68000 en tu navegador, incrustado por enlace directo a la aplicación web oficial EstyJS. EstyJS 2.0 usa EmuTOS de código abierto y ofrece carga de disquetes, sincronización del ratón y pantalla completa.',
        demoHint: 'Esta página no incluye ROMs ni software: EstyJS y EmuTOS los sirve el sitio oficial, y las imágenes de disquete .st/.sts se cargan en la propia interfaz del emulador. Usa el enlace «Abrir en una pestaña nueva» para disfrutar la experiencia independiente completa.',
        demoOpen: 'Iniciar emulador',
        loading: 'Iniciando Atari ST, espera...',
        loadingTip: 'El emulador se carga desde kaiec.github.io; el primer arranque puede tardar',
        loadingSlow: 'Carga lenta - espera un poco más o abre el emulador en una pestaña nueva',
        openInNewTab: 'Abrir el emulador en una pestaña nueva ↗',
        instructions: 'Instrucciones',
        controlsTitle: 'Controles',
        controlsHint1: 'Haz clic en la unidad de disquete A o B para cargar una imagen .st/.sts; haz clic en la pantalla incrustada para dar foco al teclado y usa el botón central del ratón para realinear el puntero.',
        controlsHint2: 'Las flechas y Ctrl emulan el joystick 1; se admiten mandos USB reales. Usa la barra de herramientas de EstyJS para pausa, sonido, reinicio y pantalla completa.',
        aboutTitle: 'Acerca de',
        aboutHint: 'El Atari ST es un ordenador doméstico y profesional de 16 bits lanzado en 1985 con un Motorola 68000 y MIDI integrado. Emulación por kaiec/EstyJS (GPL-2.0-or-later), usando EmuTOS de código abierto por defecto.',
        playing: 'Ejecutando: ',
        fullscreen: 'Pantalla completa'
    },
    ru: {
        pageTitle: 'Atari ST',
        reset: 'Сброс',
        tabDemo: 'Эмулятор',
        demoTitle: 'Эмулятор Atari ST',
        demoDesc: 'Запускайте Atari ST 520/1040 эпохи 68000 в браузере через встраивание официального веб-приложения EstyJS. EstyJS 2.0 использует открытый EmuTOS и предоставляет загрузку дискет, синхронизацию мыши и полный экран.',
        demoHint: 'Эта страница не содержит ROM и ПО: EstyJS и EmuTOS предоставляет официальный сайт, образы дискет .st/.sts загружаются в самом эмуляторе. Ссылка «Открыть в новой вкладке» даёт полный автономный режим.',
        demoOpen: 'Запустить эмулятор',
        loading: 'Atari ST запускается, подождите...',
        loadingTip: 'Эмулятор загружается с kaiec.github.io; первая загрузка может быть долгой',
        loadingSlow: 'Загрузка идёт медленно - подождите ещё немного или откройте эмулятор в новой вкладке',
        openInNewTab: 'Открыть эмулятор в новой вкладке ↗',
        instructions: 'Инструкция',
        controlsTitle: 'Управление',
        controlsHint1: 'Кликните по дисководу A или B для загрузки образа .st/.sts; кликните по встроенному экрану для фокуса клавиатуры и используйте среднюю кнопку мыши для повторного совмещения указателя.',
        controlsHint2: 'Клавиши-стрелки и Ctrl эмулируют джойстик 1, поддерживаются реальные USB-геймпады; пауза, звук, сброс и полный экран - через панель EstyJS.',
        aboutTitle: 'О платформе',
        aboutHint: 'Atari ST — 16-битный домашний и профессиональный компьютер 1985 года на базе Motorola 68000 со встроенным MIDI. Эмуляция от kaiec/EstyJS (GPL-2.0-or-later), по умолчанию с открытым EmuTOS.',
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
    link.href = ESTY_HOME;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = t('openInNewTab');
    link.style.cssText = 'display:inline-block;margin-top:14px;color:#33ff66;text-decoration:underline;font-size:14px;';
    overlay.appendChild(link);
}

function showPlayer(title) {
    document.getElementById('uploadSection').classList.add('hidden');
    document.getElementById('playerSection').classList.add('active');
    document.getElementById('pageTitle').textContent = t('playing') + (title || 'Atari ST');
    document.getElementById('resetBtn').style.display = '';
    document.getElementById('fullscreenBtn').style.display = '';
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

function playEsty() {
    var frame = document.getElementById('estyFrame');
    if (!frame) return;
    showPlayer('Atari ST');
    // EstyJS handles its own ROM, floppy loading and toolbar inside the iframe.
    frame.addEventListener('load', hideOverlay, { once: true });
    frame.src = ESTY_HOME;
    slowTimer = setTimeout(function () {
        showToast(t('loadingSlow'));
        showSlowLink();
    }, 15000);
}

function stopPlayback() {
    var frame = document.getElementById('estyFrame');
    if (frame) frame.src = 'about:blank';
    hideOverlay();
    document.getElementById('playerSection').classList.remove('active');
    document.getElementById('uploadSection').classList.remove('hidden');
    document.getElementById('pageTitle').textContent = t('pageTitle');
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('fullscreenBtn').style.display = 'none';
}

// ---- demo tab ----------------------------------------------------------
document.getElementById('demoOpenBtn').addEventListener('click', playEsty);
(function () {
    var link = document.getElementById('demoOpenNewTab');
    if (link) link.href = ESTY_HOME;
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
    var frame = document.getElementById('estyFrame');
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
