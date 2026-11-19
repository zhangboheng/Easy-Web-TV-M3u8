// PS2 Page JavaScript - TabStationToo (PCSX2 compiled to WebAssembly, GPL-3.0)
// embedded by hotlink to the official web app. No BIOS and no games are
// bundled: users pick their own console's BIOS dump and disc images inside
// the emulator's Disc library; nothing is uploaded anywhere.

var PS2_BASE = 'https://tabstationtoo.github.io/TabStationToo/';

// Internationalization (8 languages, same key set as tovita.js)
var i18n = {
    zh: {
        pageTitle: 'PS2',
        reset: '重置',
        tabDemo: '模拟器',
        demoTitle: 'PS2 模拟器',
        demoDesc: '通过 TabStationToo（PCSX2 编译为 WebAssembly，GPL-3.0，热链嵌入官方 Web App）在浏览器里运行 PlayStation 2 游戏。情感引擎与 GS 以多线程模拟，图形经 WebGPU 硬件渲染。',
        demoOpen: '启动模拟器',
        demoHint: '不内置 BIOS 与游戏——首次启动时选择你自己主机的 BIOS 转储（.bin，通常 4 MB）和你拥有游戏的镜像文件（.iso）；绝不上传。内嵌模式使用临时隔离存储，关闭或刷新后不会保留；需要长期保存 BIOS、记忆卡和存档，请用“在新标签页打开”链接。许多游戏可满速或接近满速运行。',
        loading: 'TabStationToo 启动中，请稍候...',
        loadingTip: '模拟器从其托管站点加载，首次启动可能较慢',
        loadingSlow: '加载较慢，请耐心等待；也可以在新标签页打开模拟器',
        openInNewTab: '在新标签页打开模拟器 ↗',
        instructions: '使用说明',
        controlsTitle: '操作方式',
        controlsHint1: '使用键盘或手柄操作；PS2 运行时按键会在屏幕上高亮显示，按 Esc 释放键盘',
        controlsHint2: '首次启动时在 Disc library 中选择你的 BIOS 与游戏镜像文件夹；BIOS、游戏、记忆卡与即时存档均持久保存在浏览器中',
        aboutTitle: '关于',
        aboutHint: 'PS2：索尼主机（2000–2013）。模拟由 TabStationToo（PCSX2，GPL-3.0）热链提供。需要 WebAssembly 线程、SharedArrayBuffer 与 WebGPU——即较新的桌面版 Chrome/Edge。',
        playing: '正在运行：',
        fullscreen: '全屏'
    },
    en: {
        pageTitle: 'PS2',
        reset: 'Reset',
        tabDemo: 'Emulator',
        demoTitle: 'PS2 Emulator',
        demoDesc: 'Run PlayStation 2 games in your browser with TabStationToo (PCSX2 compiled to WebAssembly, GPL-3.0, embedded by hotlink to the official web app). The Emotion Engine and GS are emulated with threads and hardware rendering via WebGPU.',
        demoOpen: 'Launch Emulator',
        demoHint: 'No BIOS and no games are bundled - on first launch pick a BIOS dumped from your own console (.bin, usually 4 MB) and disc images of games you own (.iso); nothing is uploaded. The embedded player uses temporary isolated storage, so BIOS, memory cards and saves do not survive closing or reloading; use the “Open in a new tab” link for persistent local storage. Many games run at or near full speed.',
        loading: 'Starting TabStationToo, please wait...',
        loadingTip: 'The emulator loads from its host site; first launch can take a while',
        loadingSlow: 'Still loading - please wait a bit longer, or open the emulator in a new tab',
        openInNewTab: 'Open the emulator in a new tab ↗',
        instructions: 'Instructions',
        controlsTitle: 'Controls',
        controlsHint1: 'Games are controlled with keyboard or gamepad; keys are shown on-screen while the PS2 runs, and Escape releases the keyboard',
        controlsHint2: 'On first launch open the Disc library to choose your BIOS and a folder with your disc images; BIOS, games, memory cards and save states persist in your browser',
        aboutTitle: 'About',
        aboutHint: "PS2: Sony's console (2000-2013). Emulation via TabStationToo (PCSX2, GPL-3.0), embedded by hotlink. Requires WebAssembly threads, SharedArrayBuffer and WebGPU - i.e. a recent desktop Chrome/Edge.",
        playing: 'Now running: ',
        fullscreen: 'Fullscreen'
    },
    ja: {
        pageTitle: 'PS2',
        reset: 'リセット',
        tabDemo: 'エミュレータ',
        demoTitle: 'PS2 エミュレータ',
        demoDesc: 'TabStationToo（PCSX2 を WebAssembly にコンパイル、GPL-3.0、公式Webアプリへのホットリンク埋め込み）でブラウザ上でPlayStation 2のゲームを実行します。Emotion EngineとGSはマルチスレッドでエミュレートされ、グラフィックスはWebGPUでハードウェアレンダリングされます。',
        demoOpen: 'エミュレータを起動',
        demoHint: 'BIOSもゲームも同梱されていません。初回起動時に、自分の本体からダンプしたBIOS（.bin、通常4 MB）と所有ゲームのディスクイメージ（.iso）を選んでください。アップロードは一切行われません。埋め込みプレイヤーは一時的な分離ストレージを使うため、閉じるか再読み込みするとBIOS・メモリーカード・セーブは保持されません。永続保存は「新しいタブで開く」リンクを使ってください。多くのゲームがフル速度またはそれに近い速度で動作します。',
        loading: 'TabStationToo を起動中...',
        loadingTip: 'エミュレータはホストサイトから読み込まれます。初回は時間がかかることがあります',
        loadingSlow: '読み込みが遅い場合はそのままお待ちいただくか、新しいタブでエミュレータを開いてください',
        openInNewTab: '新しいタブでエミュレータを開く ↗',
        instructions: '使い方',
        controlsTitle: '操作方法',
        controlsHint1: 'キーボードまたはゲームパッドで操作します。PS2の実行中は押したキーが画面に表示され、Escでキーボードを解放します',
        controlsHint2: '初回起動時にDisc libraryを開いて、BIOSとディスクイメージのフォルダを選んでください。BIOS、ゲーム、メモリーカード、セーブステートはブラウザに永続化されます',
        aboutTitle: 'PS2 について',
        aboutHint: 'PS2：ソニーの家庭用ゲーム機（2000-2013）。エミュレーションはTabStationToo（PCSX2、GPL-3.0）をホットリンクで提供。WebAssemblyスレッド、SharedArrayBuffer、WebGPUが必要です。つまり最新のデスクトップChrome/Edgeが対象です。',
        playing: '実行中：',
        fullscreen: '全画面'
    },
    ko: {
        pageTitle: 'PS2',
        reset: '재설정',
        tabDemo: '에뮬레이터',
        demoTitle: 'PS2 에뮬레이터',
        demoDesc: 'TabStationToo(PCSX2를 WebAssembly로 컴파일, GPL-3.0, 공식 웹 앱 핫링크 임베드)으로 브라우저에서 PlayStation 2 게임을 실행하세요. Emotion Engine과 GS는 멀티스레드로 에뮬레이션되고, 그래픽은 WebGPU로 하드웨어 렌더링됩니다.',
        demoOpen: '에뮬레이터 실행',
        demoHint: 'BIOS와 게임은 포함되어 있지 않습니다. 첫 실행 시 자신의 콘솔에서 덤프한 BIOS(.bin, 보통 4 MB)와 소유한 게임의 디스크 이미지(.iso)를 선택하세요. 업로드되지 않습니다. 내장 플레이어는 임시 격리 저장소를 사용하므로 닫거나 새로고침하면 BIOS, 메모리 카드, 세이브가 유지되지 않습니다. 영구 저장은 “새 탭에서 열기” 링크를 사용하세요. 많은 게임이 최대 속도 또는 그에 근접한 속도로 실행됩니다.',
        loading: 'TabStationToo 시작 중...',
        loadingTip: '에뮬레이터는 호스트 사이트에서 로드됩니다. 첫 실행은 시간이 걸릴 수 있습니다',
        loadingSlow: '로딩이 느리면 조금 더 기다리거나 새 탭에서 에뮬레이터를 여세요',
        openInNewTab: '새 탭에서 에뮬레이터 열기 ↗',
        instructions: '사용 방법',
        controlsTitle: '조작 방법',
        controlsHint1: '키보드 또는 게임패드로 조작합니다. PS2 실행 중에는 누른 키가 화면에 표시되며, Esc로 키보드를 해제합니다',
        controlsHint2: '첫 실행 시 Disc library를 열어 BIOS와 디스크 이미지 폴더를 선택하세요. BIOS, 게임, 메모리 카드, 세이브 상태는 브라우저에 유지됩니다',
        aboutTitle: 'PS2 소개',
        aboutHint: 'PS2: 소니의 가정용 콘솔(2000-2013). TabStationToo(PCSX2, GPL-3.0)를 핫링크로 제공. WebAssembly 스레드, SharedArrayBuffer, WebGPU가 필요합니다. 즉 최신 데스크톱 Chrome/Edge가 대상입니다.',
        playing: '실행 중: ',
        fullscreen: '전체 화면'
    },
    fr: {
        pageTitle: 'PS2',
        reset: 'Réinitialiser',
        tabDemo: 'Émulateur',
        demoTitle: 'Émulateur PS2',
        demoDesc: "Exécutez des jeux PlayStation 2 dans votre navigateur avec TabStationToo (PCSX2 compilé en WebAssembly, GPL-3.0, intégré par lien direct vers l'application web officielle). L'Emotion Engine et le GS sont émulés avec des threads et le rendu matériel passe par WebGPU.",
        demoOpen: "Lancer l'émulateur",
        demoHint: "Aucun BIOS ni jeu n'est fourni - au premier lancement, choisissez un BIOS dumpé de votre propre console (.bin, généralement 4 Mo) et des images disque de jeux que vous possédez (.iso) ; rien n'est envoyé. Le lecteur intégré utilise un stockage isolé temporaire : BIOS, cartes mémoire et sauvegardes ne survivent pas à la fermeture ou au rechargement. Utilisez le lien « Ouvrir dans un nouvel onglet » pour un stockage local persistant. Beaucoup de jeux tournent à pleine vitesse ou presque.",
        loading: "Démarrage de TabStationToo, veuillez patienter...",
        loadingTip: "L'émulateur se charge depuis son site hôte ; le premier lancement peut être long",
        loadingSlow: "Chargement lent - patientez encore un peu, ou ouvrez l'émulateur dans un nouvel onglet",
        openInNewTab: "Ouvrir l'émulateur dans un nouvel onglet ↗",
        instructions: 'Instructions',
        controlsTitle: 'Commandes',
        controlsHint1: "Les jeux se contrôlent au clavier ou à la manette ; les touches s'allument à l'écran pendant que la PS2 tourne, et Échap libère le clavier",
        controlsHint2: "Au premier lancement, ouvrez la Disc library pour choisir votre BIOS et un dossier d'images disque ; BIOS, jeux, cartes mémoire et sauvegardes instantanées persistent dans votre navigateur",
        aboutTitle: 'À propos',
        aboutHint: "PS2 : la console de salon de Sony (2000-2013). Émulation via TabStationToo (PCSX2, GPL-3.0), intégré par lien direct. Nécessite les threads WebAssembly, SharedArrayBuffer et WebGPU - soit un Chrome/Edge de bureau récent.",
        playing: 'En cours : ',
        fullscreen: 'Plein écran'
    },
    de: {
        pageTitle: 'PS2',
        reset: 'Zurücksetzen',
        tabDemo: 'Emulator',
        demoTitle: 'PS2-Emulator',
        demoDesc: 'Spielen Sie PlayStation-2-Spiele in Ihrem Browser - mit TabStationToo (PCSX2 nach WebAssembly kompiliert, GPL-3.0, per Hotlink zur offiziellen Web-App eingebettet). Der Emotion Engine und die GS werden mit Threads emuliert, die Grafik per WebGPU hardwaregerendert.',
        demoOpen: 'Emulator starten',
        demoHint: 'Es sind kein BIOS und keine Spiele enthalten - wählen Sie beim ersten Start ein von Ihrer eigenen Konsole gedumptes BIOS (.bin, meist 4 MB) und Disc-Images von Spielen, die Sie besitzen (.iso); nichts wird hochgeladen. Der eingebettete Player nutzt temporären isolierten Speicher: BIOS, Speicherkarten und Spielstände bleiben nach Schließen oder Neuladen nicht erhalten. Für dauerhaften lokalen Speicher nutzen Sie den Link „Im neuen Tab öffnen“. Viele Spiele laufen mit voller oder nahezu voller Geschwindigkeit.',
        loading: 'TabStationToo wird gestartet, bitte warten...',
        loadingTip: 'Der Emulator lädt von seiner Host-Seite; der erste Start kann dauern',
        loadingSlow: 'Lädt langsam - warten Sie noch etwas oder öffnen Sie den Emulator in einem neuen Tab',
        openInNewTab: 'Emulator in einem neuen Tab öffnen ↗',
        instructions: 'Anleitung',
        controlsTitle: 'Steuerung',
        controlsHint1: 'Die Spiele werden mit Tastatur oder Gamepad gesteuert; gedrückte Tasten leuchten auf dem Bildschirm auf, Esc gibt die Tastatur frei',
        controlsHint2: 'Öffnen Sie beim ersten Start die Disc library, um Ihr BIOS und einen Ordner mit Disc-Images zu wählen; BIOS, Spiele, Memory Cards und Spielstände bleiben im Browser',
        aboutTitle: 'Über',
        aboutHint: 'PS2: Sonys Heimkonsole (2000-2013). Emulation via TabStationToo (PCSX2, GPL-3.0), per Hotlink eingebettet. Benötigt WebAssembly-Threads, SharedArrayBuffer und WebGPU - also ein aktuelles Desktop-Chrome/Edge.',
        playing: 'Läuft: ',
        fullscreen: 'Vollbild'
    },
    es: {
        pageTitle: 'PS2',
        reset: 'Restablecer',
        tabDemo: 'Emulador',
        demoTitle: 'Emulador de PS2',
        demoDesc: 'Ejecuta juegos de PlayStation 2 en tu navegador con TabStationToo (PCSX2 compilado a WebAssembly, GPL-3.0, incrustado por enlace directo a la aplicación web oficial). El Emotion Engine y el GS se emulan con hilos y el renderizado por hardware pasa por WebGPU.',
        demoOpen: 'Iniciar emulador',
        demoHint: 'No se incluye BIOS ni juegos - al primer arranque elige un BIOS volcado de tu propia consola (.bin, normalmente 4 MB) e imágenes de disco de juegos que poseas (.iso); nada se sube. El reproductor incrustado usa almacenamiento aislado temporal: el BIOS, las tarjetas de memoria y las partidas no sobreviven al cierre o la recarga. Usa el enlace «Abrir en una pestaña nueva» para almacenamiento local persistente. Muchos juegos funcionan a velocidad completa o casi.',
        loading: 'Iniciando TabStationToo, espera...',
        loadingTip: 'El emulador se carga desde su sitio anfitrión; el primer arranque puede tardar',
        loadingSlow: 'Carga lenta - espera un poco más o abre el emulador en una pestaña nueva',
        openInNewTab: 'Abrir el emulador en una pestaña nueva ↗',
        instructions: 'Instrucciones',
        controlsTitle: 'Controles',
        controlsHint1: 'Los juegos se controlan con teclado o mando; las teclas se iluminan en pantalla mientras la PS2 funciona, y Escape libera el teclado',
        controlsHint2: 'Al primer arranque abre la Disc library para elegir tu BIOS y una carpeta con imágenes de disco; BIOS, juegos, memory cards y estados guardados persisten en tu navegador',
        aboutTitle: 'Acerca de',
        aboutHint: "PS2: la consola de sobremesa de Sony (2000-2013). Emulación vía TabStationToo (PCSX2, GPL-3.0), incrustado por enlace directo. Requiere hilos de WebAssembly, SharedArrayBuffer y WebGPU, es decir, un Chrome/Edge de escritorio reciente.",
        playing: 'Ejecutando: ',
        fullscreen: 'Pantalla completa'
    },
    ru: {
        pageTitle: 'PS2',
        reset: 'Сброс',
        tabDemo: 'Эмулятор',
        demoTitle: 'Эмулятор PS2',
        demoDesc: 'Запускайте игры PlayStation 2 в браузере с помощью TabStationToo (PCSX2, скомпилированный в WebAssembly, GPL-3.0, встраивание горячей ссылкой на официальное веб-приложение). Emotion Engine и GS эмулируются с потоками, графика рендерится через WebGPU.',
        demoOpen: 'Запустить эмулятор',
        demoHint: 'BIOS и игры не включены - при первом запуске выберите BIOS, снятый с вашей собственной консоли (.bin, обычно 4 МБ), и образы дисков игр, которые вам принадлежат (.iso); ничего не загружается на сервер. Встроенный плеер использует временное изолированное хранилище: BIOS, карты памяти и сохранения не сохраняются после закрытия или перезагрузки. Для постоянного локального хранения используйте ссылку «Открыть в новой вкладке». Многие игры идут на полной или почти полной скорости.',
        loading: 'TabStationToo запускается, подождите...',
        loadingTip: 'Эмулятор загружается с сайта-хоста; первый запуск может быть долгим',
        loadingSlow: 'Загрузка идёт медленно - подождите ещё немного или откройте эмулятор в новой вкладке',
        openInNewTab: 'Открыть эмулятор в новой вкладке ↗',
        instructions: 'Инструкция',
        controlsTitle: 'Управление',
        controlsHint1: 'Игры управляются клавиатурой или геймпадом; нажатые клавиши подсвечиваются на экране во время работы PS2, Esc освобождает клавиатуру',
        controlsHint2: 'При первом запуске откройте Disc library и выберите BIOS и папку с образами дисков; BIOS, игры, карты памяти и сохранения хранятся в браузере',
        aboutTitle: 'О платформе',
        aboutHint: 'PS2: домашняя консоль Sony (2000-2013). Эмуляция через TabStationToo (PCSX2, GPL-3.0), встраивание горячей ссылкой. Требуются потоки WebAssembly, SharedArrayBuffer и WebGPU - то есть свежий десктопный Chrome/Edge.',
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
    link.href = PS2_BASE;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = t('openInNewTab');
    link.style.cssText = 'display:inline-block;margin-top:14px;color:#33ff66;text-decoration:underline;font-size:14px;';
    overlay.appendChild(link);
}
function showPlayer(title) {
    document.getElementById('uploadSection').classList.add('hidden');
    document.getElementById('playerSection').classList.add('active');
    document.getElementById('pageTitle').textContent = t('playing') + (title || 'PS2');
    document.getElementById('resetBtn').style.display = '';
    document.getElementById('fullscreenBtn').style.display = '';
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

function playPs2() {
    var frame = document.getElementById('ps2Frame');
    if (!frame) return;
    showPlayer('PS2');
    // TabStationToo manages BIOS import, the disc library, memory cards and
    // save states inside its own UI; nothing can be passed from this host page.
    frame.addEventListener('load', hideOverlay, { once: true });
    frame.src = PS2_BASE;
    slowTimer = setTimeout(function () {
        showToast(t('loadingSlow'));
        showSlowLink();
    }, 15000);
}

function stopPlayback() {
    var frame = document.getElementById('ps2Frame');
    if (frame) frame.src = 'about:blank';
    hideOverlay();
    document.getElementById('playerSection').classList.remove('active');
    document.getElementById('uploadSection').classList.remove('hidden');
    document.getElementById('pageTitle').textContent = t('pageTitle');
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('fullscreenBtn').style.display = 'none';
}

// ---- demo tab ----------------------------------------------------------
document.getElementById('demoOpenBtn').addEventListener('click', playPs2);
(function () {
    var link = document.getElementById('demoOpenNewTab');
    if (link) link.href = PS2_BASE;
})();

// ---- back / reset ------------------------------------------------------
document.getElementById('backBtn').addEventListener('click', function () {
    var playerSection = document.getElementById('playerSection');
    if (playerSection.classList.contains('active')) { stopPlayback(); return; }
    window.location.href = '../routes/game.html?category=emulator';
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
// The upstream app has its own fullscreen control; the host page button is
// kept for parity with the other emulator pages.
document.getElementById('fullscreenBtn').addEventListener('click', function () {
    var frame = document.getElementById('ps2Frame');
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

// ---- cross-origin isolation bootstrap (ps2 page only) -------------------
// The SW injects COOP/COEP for /routes/ps2.html top-level navigations. If
// this load happened before the SW could intercept (first visit, or the SW
// was not yet registered because the user landed here without passing
// index.html), adopt the controller and reload once - guarded so we never
// loop. On an isolated load we clear the guard.
(function ensureIsolation() {
    if (!('serviceWorker' in navigator)) return;
    navigator.serviceWorker.register('/sw.js').catch(function (e) {
        console.log('[ps2] SW registration unavailable:', e && e.message);
    });
    if (window.crossOriginIsolated) {
        sessionStorage.removeItem('ps2IsoReload');
        return;
    }
    if (sessionStorage.getItem('ps2IsoReload')) return; // already retried once
    navigator.serviceWorker.ready.then(function () {
        sessionStorage.setItem('ps2IsoReload', '1');
        location.reload();
    }).catch(function () { /* SW unavailable - stay non-isolated */ });
})();
