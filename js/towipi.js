// WIPI Page JavaScript - WIE (MIT, by dlunch) embedded by hotlink to the
// official web app. No games are bundled or hot-linked: users run their own
// WIPI/SKVM/J2ME files inside the emulator.

var WIPI_BASE = 'https://wie.dlunch.net/';

// Internationalization (8 languages, same key set as topalm.js)
var i18n = {
    zh: {
        pageTitle: 'WIPI',
        reset: '重置',
        tabDemo: '模拟器',
        demoTitle: 'WIPI 手机游戏',
        demoDesc: '通过 WIE（MIT，热链嵌入官方 Web App）在浏览器里运行韩国 WIPI（SKVM/J2ME）功能机游戏。WIPI 是韩国 2001–2009 年的标准手机应用平台。',
        demoOpen: '启动模拟器',
        demoHint: '不内置任何游戏——请在模拟器内加载你自己的 .jar / .bin 文件。请只运行你拥有版权或自由分发的软件。',
        loading: 'WIE 启动中，请稍候...',
        loadingTip: '模拟器从其服务器下载，首次加载可能较慢',
        loadingSlow: '加载较慢，请耐心等待；也可以在新标签页打开模拟器',
        openInNewTab: '在新标签页打开模拟器 ↗',
        instructions: '使用说明',
        controlsTitle: '操作方式',
        controlsHint1: '数字键 / 方向键映射为手机键盘，也可用鼠标/触摸点击屏幕按键',
        controlsHint2: '若游戏无法运行，可在模拟器设置中尝试切换引擎类型（SKVM/WIPI/J2ME）或兼容性选项',
        aboutTitle: '关于',
        aboutHint: 'WIPI：Wireless Internet Platform for Interoperability——韩国 2001–2009 年的手机应用标准，运行 SKVM/J2ME 程序。模拟由 dlunch 的 WIE（MIT）热链提供。',
        playing: '正在运行：',
        fullscreen: '全屏'
    },
    en: {
        pageTitle: 'WIPI',
        reset: 'Reset',
        tabDemo: 'Emulator',
        demoTitle: 'WIPI Mobile Games',
        demoDesc: 'Run Korean WIPI (SKVM/J2ME) feature-phone games in your browser with WIE (MIT, embedded by hotlink to the official web app). WIPI was the standard mobile platform in South Korea from 2001 to 2009.',
        demoOpen: 'Launch Emulator',
        demoHint: 'No games are bundled - load your own .jar / .bin files inside the emulator. Only run software you own or that is freely distributed.',
        loading: 'Starting WIE, please wait...',
        loadingTip: 'The emulator downloads from its host; first load can take a while',
        loadingSlow: 'Still loading - please wait a bit longer, or open the emulator in a new tab',
        openInNewTab: 'Open the emulator in a new tab ↗',
        instructions: 'Instructions',
        controlsTitle: 'Controls',
        controlsHint1: 'Number keys / arrows map to the phone keypad; use the on-screen buttons with mouse/touch',
        controlsHint2: 'If a game does not run, try changing the engine type (SKVM/WIPI/J2ME) or compatibility flags in the emulator settings',
        aboutTitle: 'About',
        aboutHint: 'WIPI: Wireless Internet Platform for Interoperability - the Korean mobile standard (2001-2009) that ran SKVM/J2ME apps. Emulation via WIE by dlunch (MIT), embedded by hotlink.',
        playing: 'Now running: ',
        fullscreen: 'Fullscreen'
    },
    ja: {
        pageTitle: 'WIPI',
        reset: 'リセット',
        tabDemo: 'エミュレータ',
        demoTitle: 'WIPI モバイルゲーム',
        demoDesc: 'WIE（MIT、公式Webアプリへのホットリンク埋め込み）でブラウザ上で韓国のWIPI（SKVM/J2ME）フィーチャーフォンゲームを実行します。WIPIは2001〜2009年の韓国標準モバイルプラットフォームでした。',
        demoOpen: 'エミュレータを起動',
        demoHint: 'ゲームは同梱されていません。エミュレータ内で自分の .jar / .bin ファイルを読み込んでください。所有または自由に配布されているソフトのみ実行してください。',
        loading: 'WIE を起動中...',
        loadingTip: 'エミュレータはホストからダウンロードされます。初回は時間がかかることがあります',
        loadingSlow: '読み込みが遅い場合はそのままお待ちいただくか、新しいタブでエミュレータを開いてください',
        openInNewTab: '新しいタブでエミュレータを開く ↗',
        instructions: '使い方',
        controlsTitle: '操作方法',
        controlsHint1: '数字キー/矢印キーがフィーチャーフォンのキーパッドに対応、画面のボタンはマウス/タッチで操作',
        controlsHint2: 'ゲームが動かない場合は、エミュレータ設定でエンジンタイプ（SKVM/WIPI/J2ME）や互換性オプションを変更してみてください',
        aboutTitle: 'WIPI について',
        aboutHint: 'WIPI：Wireless Internet Platform for Interoperability——2001〜2009年の韓国標準モバイルプラットフォーム。SKVM/J2MEアプリを実行。エミュレーションはdlunchのWIE（MIT）をホットリンクで提供。',
        playing: '実行中：',
        fullscreen: '全画面'
    },
    ko: {
        pageTitle: 'WIPI',
        reset: '재설정',
        tabDemo: '에뮬레이터',
        demoTitle: 'WIPI 모바일 게임',
        demoDesc: 'WIE(MIT, 공식 웹 앱 핫링크 임베드)로 브라우저에서 한국 WIPI(SKVM/J2ME) 피처폰 게임을 실행하세요. WIPI는 2001-2009년 대한민국 표준 모바일 플랫폼이었습니다.',
        demoOpen: '에뮬레이터 실행',
        demoHint: '게임은 포함되지 않습니다. 에뮬레이터 안에서 자신의 .jar / .bin 파일을 불러오세요. 소유하거나 자유롭게 배포되는 소프트웨어만 실행하세요.',
        loading: 'WIE 시작 중...',
        loadingTip: '에뮬레이터는 호스트에서 다운로드됩니다. 첫 로드는 시간이 걸릴 수 있습니다',
        loadingSlow: '로딩이 느리면 조금 더 기다리거나 새 탭에서 에뮬레이터를 여세요',
        openInNewTab: '새 탭에서 에뮬레이터 열기 ↗',
        instructions: '사용 방법',
        controlsTitle: '조작 방법',
        controlsHint1: '숫자 키/방향키가 피처폰 키패드에 대응하고, 화면의 버튼은 마우스/터치로 조작할 수 있습니다',
        controlsHint2: '게임이 실행되지 않으면 에뮬레이터 설정에서 엔진 유형(SKVM/WIPI/J2ME)이나 호환성 옵션을 바꿔 보세요',
        aboutTitle: '소개',
        aboutHint: 'WIPI: Wireless Internet Platform for Interoperability - 2001-2009년 대한민국 표준 모바일 플랫폼. SKVM/J2ME 앱을 실행했습니다. 에뮬레이션은 dlunch의 WIE(MIT)를 핫링크로 제공.',
        playing: '실행 중: ',
        fullscreen: '전체 화면'
    },
    fr: {
        pageTitle: 'WIPI',
        reset: 'Réinitialiser',
        tabDemo: 'Émulateur',
        demoTitle: 'Jeux mobiles WIPI',
        demoDesc: "Exécutez des jeux WIPI (SKVM/J2ME) coréens dans votre navigateur avec WIE (MIT, intégré par lien direct vers l'application web officielle). WIPI était la plateforme mobile standard en Corée du Sud de 2001 à 2009.",
        demoOpen: "Lancer l'émulateur",
        demoHint: "Aucun jeu n'est inclus - chargez vos propres fichiers .jar / .bin dans l'émulateur. N'exécutez que des logiciels dont vous possédez les droits ou librement distribués.",
        loading: 'Démarrage de WIE, veuillez patienter...',
        loadingTip: "L'émulateur est téléchargé depuis son hôte ; le premier chargement peut prendre du temps",
        loadingSlow: "Chargement lent - patientez encore un peu, ou ouvrez l'émulateur dans un nouvel onglet",
        openInNewTab: "Ouvrir l'émulateur dans un nouvel onglet ↗",
        instructions: 'Instructions',
        controlsTitle: 'Commandes',
        controlsHint1: 'Les touches numériques / flèches correspondent au clavier du téléphone ; les boutons à l\'écran se pilotent à la souris/au tactile',
        controlsHint2: "Si un jeu ne fonctionne pas, essayez de changer le type de moteur (SKVM/WIPI/J2ME) ou les options de compatibilité dans les paramètres de l'émulateur",
        aboutTitle: 'À propos',
        aboutHint: "WIPI : Wireless Internet Platform for Interoperability - la norme mobile coréenne (2001-2009) qui exécutait des applications SKVM/J2ME. Émulation via WIE de dlunch (MIT), intégré par lien direct.",
        playing: 'En cours : ',
        fullscreen: 'Plein écran'
    },
    de: {
        pageTitle: 'WIPI',
        reset: 'Zurücksetzen',
        tabDemo: 'Emulator',
        demoTitle: 'WIPI-Handyspiele',
        demoDesc: 'Führen Sie koreanische WIPI-Spiele (SKVM/J2ME) in Ihrem Browser aus - mit WIE (MIT, per Hotlink zur offiziellen Web-App eingebettet). WIPI war von 2001 bis 2009 die Standard-Mobilplattform in Südkorea.',
        demoOpen: 'Emulator starten',
        demoHint: 'Es sind keine Spiele enthalten - laden Sie Ihre eigenen .jar-/bin-Dateien im Emulator. Führen Sie nur Software aus, deren Rechte Sie besitzen oder die frei verbreitet wird.',
        loading: 'WIE wird gestartet, bitte warten...',
        loadingTip: 'Der Emulator wird von seinem Host heruntergeladen; das erste Laden kann dauern',
        loadingSlow: 'Lädt langsam - warten Sie noch etwas oder öffnen Sie den Emulator in einem neuen Tab',
        openInNewTab: 'Emulator in einem neuen Tab öffnen ↗',
        instructions: 'Anleitung',
        controlsTitle: 'Steuerung',
        controlsHint1: 'Zifferntasten / Pfeiltasten entsprechen der Handy-Tastatur; die Bildschirm-Tasten per Maus/Touch bedienen',
        controlsHint2: 'Wenn ein Spiel nicht läuft, ändern Sie im Emulator den Engine-Typ (SKVM/WIPI/J2ME) oder die Kompatibilitätsoptionen',
        aboutTitle: 'Über',
        aboutHint: 'WIPI: Wireless Internet Platform for Interoperability - der koreanische Mobilstandard (2001-2009), der SKVM/J2ME-Apps ausführte. Emulation via WIE von dlunch (MIT), per Hotlink eingebettet.',
        playing: 'Läuft: ',
        fullscreen: 'Vollbild'
    },

    es: {
        pageTitle: 'WIPI',
        reset: 'Restablecer',
        tabDemo: 'Emulador',
        demoTitle: 'Juegos móviles WIPI',
        demoDesc: 'Ejecuta juegos coreanos de WIPI (SKVM/J2ME) en tu navegador con WIE (MIT, incrustado por enlace directo a la aplicación web oficial). WIPI fue la plataforma móvil estándar en Corea del Sur de 2001 a 2009.',
        demoOpen: 'Iniciar emulador',
        demoHint: 'No se incluyen juegos - carga tus propios archivos .jar / .bin dentro del emulador. Solo ejecuta software del que tengas derechos o que sea de distribución libre.',
        loading: 'Iniciando WIE, espera...',
        loadingTip: 'El emulador se descarga desde su host; la primera carga puede tardar',
        loadingSlow: 'Carga lenta - espera un poco más o abre el emulador en una pestaña nueva',
        openInNewTab: 'Abrir el emulador en una pestaña nueva ↗',
        instructions: 'Instrucciones',
        controlsTitle: 'Controles',
        controlsHint1: 'Las teclas numéricas / flechas corresponden al teclado del teléfono; los botones en pantalla se usan con ratón/táctil',
        controlsHint2: 'Si un juego no funciona, prueba a cambiar el tipo de motor (SKVM/WIPI/J2ME) o las opciones de compatibilidad en la configuración del emulador',
        aboutTitle: 'Acerca de',
        aboutHint: 'WIPI: Wireless Internet Platform for Interoperability - el estándar móvil coreano (2001-2009) que ejecutaba aplicaciones SKVM/J2ME. Emulación vía WIE de dlunch (MIT), incrustado por enlace directo.',
        playing: 'Ejecutando: ',
        fullscreen: 'Pantalla completa'
    },
    ru: {
        pageTitle: 'WIPI',
        reset: 'Сброс',
        tabDemo: 'Эмулятор',
        demoTitle: 'Мобильные игры WIPI',
        demoDesc: 'Запускайте корейские игры WIPI (SKVM/J2ME) в браузере с помощью WIE (MIT, встраивание горячей ссылкой на официальное веб-приложение). WIPI была стандартной мобильной платформой в Южной Корее с 2001 по 2009 год.',
        demoOpen: 'Запустить эмулятор',
        demoHint: 'Игры не включены - загрузите свои файлы .jar / .bin внутри эмулятора. Запускайте только программы, которыми владеете или которые свободно распространяются.',
        loading: 'WIE запускается, подождите...',
        loadingTip: 'Эмулятор скачивается с сервера; первая загрузка может занять время',
        loadingSlow: 'Загрузка идёт медленно - подождите ещё немного или откройте эмулятор в новой вкладке',
        openInNewTab: 'Открыть эмулятор в новой вкладке ↗',
        instructions: 'Инструкция',
        controlsTitle: 'Управление',
        controlsHint1: 'Цифровые клавиши / стрелки соответствуют клавиатуре телефона; экранные кнопки работают мышью/касанием',
        controlsHint2: 'Если игра не запускается, попробуйте в настройках эмулятора сменить тип движка (SKVM/WIPI/J2ME) или параметры совместимости',
        aboutTitle: 'О платформе',
        aboutHint: 'WIPI: Wireless Internet Platform for Interoperability - корейский мобильный стандарт (2001-2009), исполнявший приложения SKVM/J2ME. Эмуляция через WIE (dlunch, MIT), встраивание горячей ссылкой.',
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

// ---- tab switching (single tab, kept for structural parity) -------------
document.querySelectorAll('.upload-tab').forEach(function (el) {
    el.addEventListener('click', function () {
        document.querySelectorAll('.upload-tab').forEach(function (tab) {
            tab.classList.toggle('active', tab === el);
        });
    });
});

// ---- player ------------------------------------------------------------
var player = HotlinkPlayer.createPlayer({
    frameId: 'wipiFrame', overlayId: 'loadingOverlay', url: WIPI_BASE, newTabUrl: WIPI_BASE
});

function showPlayer(title) {
    document.getElementById('uploadSection').classList.add('hidden');
    document.getElementById('playerSection').classList.add('active');
    document.getElementById('pageTitle').textContent = t('playing') + (title || 'WIPI');
    document.getElementById('resetBtn').style.display = '';
    document.getElementById('fullscreenBtn').style.display = '';
}

function playWipi() {
    if (!document.getElementById('wipiFrame')) return;
    showPlayer('WIPI');
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

// ---- demo tab ----------------------------------------------------------
document.getElementById('demoOpenBtn').addEventListener('click', playWipi);

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

// ---- fullscreen --------------------------------------------------------
// The upstream app does not ship its own fullscreen control, so the host
// page requests fullscreen on the iframe itself (allowed via allowfullscreen).
document.getElementById('fullscreenBtn').addEventListener('click', function () {
    var frame = document.getElementById('wipiFrame');
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
