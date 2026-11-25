// Classic Macintosh Page JavaScript - Infinite Mac (Apache 2.0) embedded by
// hotlink to the official web app at infinitemac.org. No ROMs and no software
// are bundled: the emulator boots System 7.1 from the Infinite Mac project
// inside the browser; nothing is uploaded anywhere.

var MAC_HOME = 'https://infinitemac.org/';
var MAC_BASE = 'https://infinitemac.org/embed';
var MAC_EMBED_URL = MAC_BASE + '?disk=System%207.1&infinite_hd=true';

// ---- cross-origin isolation bootstrap (mac page only) -------------------
// Run before createPlayer so no earlier exception can skip the SW reload.
HotlinkPlayer.ensureIsolated('macIsoReload', '[mac]', '/sw.js');

// Internationalization (8 languages, same key set as tops2.js)
var i18n = {
    zh: {
        pageTitle: '经典 Mac',
        reset: '重置',
        tabDemo: '模拟器',
        demoTitle: '经典 Macintosh 模拟器',
        demoDesc: '通过 Infinite Mac（热链嵌入官方 Web App）在浏览器里运行经典 Macintosh。默认启动 System 7.1，并挂载 Infinite HD 软件盘。',
        demoOpen: '启动模拟器',
        demoHint: '不内置任何 ROM 与软件——模拟器在你的浏览器里运行 Infinite Mac 项目的 System 7.1；绝不上传。磁盘与偏好设置持久保存在浏览器中，可在模拟器自己的菜单里切换其他经典 Mac OS 版本；「在新标签页打开」可获得完整的独立体验。',
        loading: 'Infinite Mac 启动中，请稍候...',
        loadingTip: '模拟器从其托管站点加载，首次启动可能较慢',
        loadingSlow: '加载较慢，请耐心等待；也可以在新标签页打开模拟器',
        openInNewTab: '在新标签页打开模拟器 ↗',
        instructions: '使用说明',
        controlsTitle: '操作方式',
        controlsHint1: '在内嵌画面里用鼠标和键盘操作 Mac 桌面；暂停、重置或更换机型请使用模拟器自己的菜单',
        controlsHint2: '默认启动 System 7.1 并挂载 Infinite HD 软件盘；打开模拟器的磁盘菜单可挂载你自己的磁盘镜像或切换其他经典 Mac OS 版本',
        aboutTitle: '关于',
        aboutHint: '经典 Macintosh：苹果 1984–2001 年的个人电脑。由 Infinite Mac（Apache 2.0）热链提供模拟。本宿主页以跨域隔离方式运行，SharedArrayBuffer 可用，模拟可满速进行。',
        playing: '正在运行：',
        fullscreen: '全屏'
    },
    en: {
        pageTitle: 'Classic Mac',
        reset: 'Reset',
        tabDemo: 'Emulator',
        demoTitle: 'Classic Macintosh Emulator',
        demoDesc: 'Run a classic Macintosh in your browser with Infinite Mac (embedded by hotlink to the official web app). System 7.1 boots by default, with the Infinite HD bonus software disk mounted.',
        demoOpen: 'Launch Emulator',
        demoHint: "No ROMs and no software are bundled - the emulator runs System 7.1 from the Infinite Mac project inside your browser; nothing is uploaded. Your disks and preferences persist in your browser's storage, and you can switch to other classic Mac OS versions from the emulator's own menu; the “Open in a new tab” link gives you the full standalone experience.",
        loading: 'Starting Infinite Mac, please wait...',
        loadingTip: 'The emulator loads from its host site; the first boot can take a while',
        loadingSlow: 'Still loading - please wait a bit longer, or open the emulator in a new tab',
        openInNewTab: 'Open the emulator in a new tab ↗',
        instructions: 'Instructions',
        controlsTitle: 'Controls',
        controlsHint1: "The Mac desktop is controlled with your mouse and keyboard inside the embedded screen; use the emulator's own menu to pause, reset or change the emulated machine",
        controlsHint2: "System 7.1 boots by default with the Infinite HD software disk mounted; open the emulator's disk menu to mount your own disk images or switch to another classic Mac OS release",
        aboutTitle: 'About',
        aboutHint: "Classic Macintosh: Apple's 1984-2001 personal computers. Emulated by Infinite Mac (Apache 2.0), embedded by hotlink to the official web app. This host page runs cross-origin isolated, so SharedArrayBuffer stays available for full-speed emulation.",
        playing: 'Now running: ',
        fullscreen: 'Fullscreen'
    },
    ja: {
        pageTitle: 'クラシックMac',
        reset: 'リセット',
        tabDemo: 'エミュレータ',
        demoTitle: 'クラシックMacintoshエミュレータ',
        demoDesc: 'Infinite Mac（公式Webアプリへのホットリンク埋め込み）でブラウザ上でクラシックMacintoshを実行します。デフォルトでSystem 7.1が起動し、Infinite HDソフトウェアディスクがマウントされます。',
        demoOpen: 'エミュレータを起動',
        demoHint: 'ROMやソフトウェアは同梱されていません。エミュレータはInfinite MacプロジェクトのSystem 7.1をブラウザ内で実行します。アップロードは一切行われません。ディスクと設定はブラウザに永続化され、エミュレータのメニューから他のクラシックMac OSバージョンに切り替えられます。「新しいタブで開く」リンクでフルスタンドアロン体験も可能です。',
        loading: 'Infinite Mac を起動中...',
        loadingTip: 'エミュレータはホストサイトから読み込まれます。初回起動は時間がかかることがあります',
        loadingSlow: '読み込みが遅い場合はそのままお待ちいただくか、新しいタブでエミュレータを開いてください',
        openInNewTab: '新しいタブでエミュレータを開く ↗',
        instructions: '使い方',
        controlsTitle: '操作方法',
        controlsHint1: '埋め込み画面内でマウスとキーボードを使ってMacのデスクトップを操作します。一時停止・リセット・機種の変更はエミュレータ自身のメニューから行います',
        controlsHint2: 'デフォルトではSystem 7.1が起動し、Infinite HDソフトウェアディスクがマウントされます。エミュレータのディスクメニューから自分のディスクイメージのマウントや、他のクラシックMac OSへの切り替えができます',
        aboutTitle: 'について',
        aboutHint: 'クラシックMacintosh：Appleの1984-2001年のパーソナルコンピュータ。Infinite Mac（Apache 2.0）をホットリンクで提供。このホストページはクロスオリジン分離で動作するため、SharedArrayBufferが利用可能でフルスピードのエミュレーションが可能です。',
        playing: '実行中：',
        fullscreen: '全画面'
    },
    ko: {
        pageTitle: '클래식 맥',
        reset: '재설정',
        tabDemo: '에뮬레이터',
        demoTitle: '클래식 매킨토시 에뮬레이터',
        demoDesc: 'Infinite Mac(공식 웹 앱 핫링크 임베드)으로 브라우저에서 클래식 매킨토시를 실행합니다. 기본적으로 System 7.1이 부팅되며 Infinite HD 소프트웨어 디스크가 마운트됩니다.',
        demoOpen: '에뮬레이터 실행',
        demoHint: 'ROM이나 소프트웨어는 포함되어 있지 않습니다. 에뮬레이터는 Infinite Mac 프로젝트의 System 7.1을 브라우저에서 실행합니다. 업로드되지 않습니다. 디스크와 환경설정은 브라우저에 유지되며, 에뮬레이터 자체 메뉴에서 다른 클래식 Mac OS 버전으로 전환할 수 있습니다. 영구 저장은 «새 탭에서 열기» 링크를 사용하세요.',
        loading: 'Infinite Mac 시작 중...',
        loadingTip: '에뮬레이터는 호스트 사이트에서 로드됩니다. 첫 부팅은 시간이 걸릴 수 있습니다',
        loadingSlow: '로딩이 느리면 조금 더 기다리거나 새 탭에서 에뮬레이터를 여세요',
        openInNewTab: '새 탭에서 에뮬레이터 열기 ↗',
        instructions: '사용 방법',
        controlsTitle: '조작 방법',
        controlsHint1: '내장 화면 안에서 마우스와 키보드로 맥 데스크톱을 조작합니다. 일시정지, 재설정, 기기 변경은 에뮬레이터 자체 메뉴를 사용하세요',
        controlsHint2: '기본적으로 System 7.1이 부팅되고 Infinite HD 소프트웨어 디스크가 마운트됩니다. 에뮬레이터의 디스크 메뉴에서 자신의 디스크 이미지를 마운트하거나 다른 클래식 Mac OS로 전환할 수 있습니다',
        aboutTitle: '소개',
        aboutHint: '클래식 매킨토시: 애플의 1984-2001년 개인용 컴퓨터. Infinite Mac(Apache 2.0)을 핫링크로 제공. 이 호스트 페이지는 교차 출처 격리로 실행되어 SharedArrayBuffer를 사용할 수 있으므로 최대 속도 에뮬레이션이 가능합니다.',
        playing: '실행 중: ',
        fullscreen: '전체 화면'
    },

    fr: {
        pageTitle: 'Mac classique',
        reset: 'Réinitialiser',
        tabDemo: 'Émulateur',
        demoTitle: 'Émulateur Macintosh classique',
        demoDesc: "Faites tourner un Macintosh classique dans votre navigateur avec Infinite Mac (intégré par lien direct vers l'application web officielle). System 7.1 démarre par défaut, avec le disque logiciel bonus Infinite HD monté.",
        demoOpen: "Lancer l'émulateur",
        demoHint: "Aucune ROM ni aucun logiciel n'est fourni - l'émulateur exécute System 7.1 du projet Infinite Mac dans votre navigateur ; rien n'est envoyé. Vos disques et préférences persistent dans le stockage de votre navigateur, et vous pouvez passer à d'autres versions du classique Mac OS depuis le menu de l'émulateur ; le lien « Ouvrir dans un nouvel onglet » vous donne l'expérience autonome complète.",
        loading: "Démarrage d'Infinite Mac, veuillez patienter...",
        loadingTip: "L'émulateur se charge depuis son site hôte ; le premier démarrage peut être long",
        loadingSlow: "Chargement lent - patientez encore un peu, ou ouvrez l'émulateur dans un nouvel onglet",
        openInNewTab: "Ouvrir l'émulateur dans un nouvel onglet ↗",
        instructions: 'Instructions',
        controlsTitle: 'Commandes',
        controlsHint1: "Le bureau Mac se contrôle à la souris et au clavier dans l'écran intégré ; utilisez le menu de l'émulateur pour mettre en pause, réinitialiser ou changer de machine émulée",
        controlsHint2: "System 7.1 démarre par défaut avec le disque logiciel Infinite HD monté ; ouvrez le menu disque de l'émulateur pour monter vos propres images disque ou passer à une autre version du classique Mac OS",
        aboutTitle: 'À propos',
        aboutHint: "Macintosh classique : les ordinateurs personnels Apple de 1984-2001. Émulation par Infinite Mac (Apache 2.0), intégré par lien direct vers l'application web officielle. Cette page hôte fonctionne en isolation cross-origin, SharedArrayBuffer reste donc disponible pour une émulation à pleine vitesse.",
        playing: 'En cours : ',
        fullscreen: 'Plein écran'
    },
    de: {
        pageTitle: 'Klassischer Mac',
        reset: 'Zurücksetzen',
        tabDemo: 'Emulator',
        demoTitle: 'Klassischer Macintosh-Emulator',
        demoDesc: 'Betreiben Sie einen klassischen Macintosh in Ihrem Browser - mit Infinite Mac (per Hotlink zur offiziellen Web-App eingebettet). Standardmäßig startet System 7.1, mit der Infinite-HD-Software-Disk eingehängt.',
        demoOpen: 'Emulator starten',
        demoHint: 'Es sind keine ROMs und keine Software enthalten - der Emulator führt System 7.1 aus dem Infinite-Mac-Projekt in Ihrem Browser aus; nichts wird hochgeladen. Ihre Disks und Einstellungen bleiben im Browser-Speicher erhalten, und über das Menü des Emulators können Sie zu anderen klassischen Mac-OS-Versionen wechseln; der Link «Im neuen Tab öffnen» bietet das vollständige eigenständige Erlebnis.',
        loading: 'Infinite Mac wird gestartet, bitte warten...',
        loadingTip: 'Der Emulator lädt von seiner Host-Seite; der erste Start kann dauern',
        loadingSlow: 'Lädt langsam - warten Sie noch etwas oder öffnen Sie den Emulator in einem neuen Tab',
        openInNewTab: 'Emulator in einem neuen Tab öffnen ↗',
        instructions: 'Anleitung',
        controlsTitle: 'Steuerung',
        controlsHint1: 'Der Mac-Desktop wird mit Maus und Tastatur im eingebetteten Bildschirm bedient; über das Menü des Emulators pausieren Sie, setzen zurück oder wechseln den emulierten Rechner',
        controlsHint2: 'Standardmäßig startet System 7.1 mit der eingehängten Infinite-HD-Software-Disk; über das Disk-Menü des Emulators hängen Sie eigene Disk-Images ein oder wechseln zu einer anderen klassischen Mac-OS-Version',
        aboutTitle: 'Über',
        aboutHint: 'Klassischer Macintosh: Apples Personalcomputer von 1984-2001. Emuliert von Infinite Mac (Apache 2.0), per Hotlink zur offiziellen Web-App eingebettet. Diese Host-Seite läuft cross-origin isoliert, SharedArrayBuffer bleibt also für Emulation mit voller Geschwindigkeit verfügbar.',
        playing: 'Läuft: ',
        fullscreen: 'Vollbild'
    },
    es: {
        pageTitle: 'Mac clásica',
        reset: 'Restablecer',
        tabDemo: 'Emulador',
        demoTitle: 'Emulador de Macintosh clásica',
        demoDesc: 'Ejecuta una Macintosh clásica en tu navegador con Infinite Mac (incrustado por enlace directo a la aplicación web oficial). System 7.1 arranca por defecto, con el disco de software adicional Infinite HD montado.',
        demoOpen: 'Iniciar emulador',
        demoHint: 'No se incluyen ROMs ni software - el emulador ejecuta System 7.1 del proyecto Infinite Mac dentro de tu navegador; nada se sube. Tus discos y preferencias persisten en el almacenamiento de tu navegador, y puedes cambiar a otras versiones del clásico Mac OS desde el propio menú del emulador; el enlace «Abrir en una pestaña nueva» te da la experiencia independiente completa.',
        loading: 'Iniciando Infinite Mac, espera...',
        loadingTip: 'El emulador se carga desde su sitio anfitrión; el primer arranque puede tardar',
        loadingSlow: 'Carga lenta - espera un poco más o abre el emulador en una pestaña nueva',
        openInNewTab: 'Abrir el emulador en una pestaña nueva ↗',
        instructions: 'Instrucciones',
        controlsTitle: 'Controles',
        controlsHint1: 'El escritorio Mac se controla con el ratón y el teclado dentro de la pantalla incrustada; usa el menú del emulador para pausar, reiniciar o cambiar la máquina emulada',
        controlsHint2: 'System 7.1 arranca por defecto con el disco de software Infinite HD montado; abre el menú de discos del emulador para montar tus propias imágenes de disco o cambiar a otra versión del clásico Mac OS',
        aboutTitle: 'Acerca de',
        aboutHint: 'Macintosh clásica: los ordenadores personales de Apple de 1984-2001. Emulada por Infinite Mac (Apache 2.0), incrustada por enlace directo a la aplicación web oficial. Esta página anfitriona se ejecuta aislada cross-origin, por lo que SharedArrayBuffer sigue disponible para una emulación a plena velocidad.',
        playing: 'Ejecutando: ',
        fullscreen: 'Pantalla completa'
    },
    ru: {
        pageTitle: 'Классический Mac',
        reset: 'Сброс',
        tabDemo: 'Эмулятор',
        demoTitle: 'Эмулятор классического Macintosh',
        demoDesc: 'Запускайте классический Macintosh в браузере с помощью Infinite Mac (встраивание горячей ссылкой на официальное веб-приложение). По умолчанию загружается System 7.1 с подключённым программным диском Infinite HD.',
        demoOpen: 'Запустить эмулятор',
        demoHint: 'ROM-образы и ПО не включены - эмулятор запускает System 7.1 из проекта Infinite Mac внутри вашего браузера; ничего не загружается на сервер. Ваши диски и настройки сохраняются в браузере, а переключиться на другие версии классической Mac OS можно в собственном меню эмулятора; ссылка «Открыть в новой вкладке» даёт полный автономный опыт.',
        loading: 'Infinite Mac запускается, подождите...',
        loadingTip: 'Эмулятор загружается с сайта-хоста; первая загрузка может быть долгой',
        loadingSlow: 'Загрузка идёт медленно - подождите ещё немного или откройте эмулятор в новой вкладке',
        openInNewTab: 'Открыть эмулятор в новой вкладке ↗',
        instructions: 'Инструкция',
        controlsTitle: 'Управление',
        controlsHint1: 'Рабочим столом Mac управляют мышью и клавиатурой внутри встроенного экрана; пауза, сброс и смена эмулируемой машины - в собственном меню эмулятора',
        controlsHint2: 'По умолчанию загружается System 7.1 с подключённым диском Infinite HD; в меню дисков эмулятора можно подключить свои образы дисков или перейти к другой версии классической Mac OS',
        aboutTitle: 'О платформе',
        aboutHint: 'Классический Macintosh: персональные компьютеры Apple 1984-2001 годов. Эмуляция через Infinite Mac (Apache 2.0), встраивание горячей ссылкой на официальное веб-приложение. Эта страница-хост работает в cross-origin изоляции, поэтому SharedArrayBuffer доступен и эмуляция идёт на полной скорости.',
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
var player = HotlinkPlayer.createPlayer({
    frameId: 'macFrame', overlayId: 'loadingOverlay', url: MAC_EMBED_URL, newTabUrl: MAC_HOME
});

function showPlayer(title) {
    document.getElementById('uploadSection').classList.add('hidden');
    document.getElementById('playerSection').classList.add('active');
    document.getElementById('pageTitle').textContent = t('playing') + (title || '');
    document.getElementById('resetBtn').style.display = '';
    document.getElementById('fullscreenBtn').style.display = '';
}

function playMac() {
    if (!document.getElementById('macFrame')) return;
    showPlayer('Classic Mac');
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
document.getElementById('demoOpenBtn').addEventListener('click', playMac);
(function () {
    var link = document.getElementById('demoOpenNewTab');
    if (link) link.href = MAC_HOME;
})();

// ---- back / reset ------------------------------------------------------
document.getElementById('backBtn').addEventListener('click', function () {
    if (document.getElementById('playerSection').classList.contains('active')) { stopPlayback(); return; }
    window.location.href = '../routes/game.html?category=retropc';
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
    var frame = document.getElementById('macFrame');
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