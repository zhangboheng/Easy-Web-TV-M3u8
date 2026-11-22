// PS Vita Page JavaScript - vitaslop (MIT, by cretz) embedded by hotlink to
// the official web app. No games are bundled: users add their own legally
// dumped packages inside the emulator; nothing is uploaded anywhere.
// NOTE: the embedded app needs WebGPU/JSPI/SharedArrayBuffer/OPFS. A cross-
// origin iframe cannot get cross-origin isolation from the embedding page, so
// if SharedArrayBuffer is unavailable we surface a clear explanation with a
// one-click escape hatch: open the emulator in a dedicated top-level tab.

var VITA_BASE = 'https://cretz.github.io/vitaslop/';

// Internationalization (8 languages, same key set as toj2me.js)
var i18n = {
    zh: {
        pageTitle: 'PS Vita',
        reset: '重置',
        tabDemo: '模拟器',
        demoTitle: 'PS Vita 模拟器',
        demoDesc: '通过 vitaslop（MIT，热链嵌入官方 Web App）在浏览器里运行 PlayStation Vita 游戏。Vita 的 ARM 代码在运行时翻译为 WebAssembly，图形命令流以 WebGPU 重放。',
        demoOpen: '启动模拟器',
        demoHint: '不内置任何游戏——在模拟器的 Add games 页导入你自己的合法转储包（.pkg + work.bin、转储文件夹或 zip）；绝不上传。内嵌模式使用临时隔离存储，关闭或刷新后游戏与存档不会保留；需要长期保存请用“在新标签页打开”链接。早期阶段：部分商业游戏可启动游玩，部分不能；自制软件可用。',
        loading: 'vitaslop 启动中，请稍候...',
        loadingTip: '模拟器从其托管站点加载，首次启动可能较慢',
        loadingSlow: '加载较慢，请耐心等待；也可以在新标签页打开模拟器',
        openInNewTab: '在新标签页打开模拟器 ↗',
        instructions: '使用说明',
        controlsTitle: '操作方式',
        controlsHint1: '模拟器获得焦点后使用键盘鼠标操作；触摸板映射为鼠标/触摸',
        controlsHint2: '先在模拟器内打开 Add games 导入你自己的游戏包；游戏与存档持久保存在浏览器中',
        aboutTitle: '关于',
        aboutHint: 'PS Vita：索尼掌机（2011–2019）。模拟由 vitaslop（MIT）热链提供。需要 WebGPU、JSPI、SharedArrayBuffer 与 OPFS——即较新的桌面版 Chrome/Edge（移动端 Safari/Firefox 不支持）。',
        playing: '正在运行：',
        fullscreen: '全屏'
    },
    en: {
        pageTitle: 'PS Vita',
        reset: 'Reset',
        tabDemo: 'Emulator',
        demoTitle: 'PS Vita Emulator',
        demoDesc: "Run PlayStation Vita games in your browser with vitaslop (MIT, embedded by hotlink to the official web app). The Vita's ARM code is translated to WebAssembly at runtime and the GPU command stream is replayed as WebGPU.",
        demoOpen: 'Launch Emulator',
        demoHint: 'No games are bundled - add your own legally dumped packages (.pkg + work.bin, a dumped folder, or a zip) inside the emulator library; nothing is uploaded. The embedded player uses temporary isolated storage, so games and saves do not survive closing or reloading; use the “Open in a new tab” link for persistent local storage. Early days: many commercial games boot and play, many do not; homebrew works.',
        loading: 'Starting vitaslop, please wait...',
        loadingTip: 'The emulator loads from its host site; first launch can take a while',
        loadingSlow: 'Still loading - please wait a bit longer, or open the emulator in a new tab',
        openInNewTab: 'Open the emulator in a new tab ↗',
        instructions: 'Instructions',
        controlsTitle: 'Controls',
        controlsHint1: 'Games are controlled with keyboard and mouse once the emulator has focus; the touch pad maps to mouse/touch',
        controlsHint2: 'Open Add games inside the emulator to import your own packages first; games and saves persist in your browser',
        aboutTitle: 'About',
        aboutHint: "PS Vita: Sony's handheld (2011-2019). Emulation via vitaslop (MIT), embedded by hotlink. Requires WebGPU, JSPI, SharedArrayBuffer and OPFS - i.e. a recent desktop Chrome/Edge (mobile Safari/Firefox not supported).",
        playing: 'Now running: ',
        fullscreen: 'Fullscreen'
    },
    ja: {
        pageTitle: 'PS Vita',
        reset: 'リセット',
        tabDemo: 'エミュレータ',
        demoTitle: 'PS Vita エミュレータ',
        demoDesc: 'vitaslop（MIT、公式Webアプリへのホットリンク埋め込み）でブラウザ上でPlayStation Vitaのゲームを実行します。VitaのARMコードは実行時にWebAssemblyへ翻訳され、GPUコマンドストリームはWebGPUで再生されます。',
        demoOpen: 'エミュレータを起動',
        demoHint: 'ゲームは同梱されていません。エミュレータのAdd gamesページで、自分が合法的にダンプしたパッケージ（.pkg + work.bin、ダンプしたフォルダ、またはそのzip）を追加してください。アップロードは一切行われません。埋め込みプレイヤーは一時的な分離ストレージを使うため、閉じるか再読み込みするとゲームとセーブは保持されません。永続保存は「新しいタブで開く」リンクを使ってください。まだ開発途上：動く商用ゲームも多くあれば、動かないものも多くあります。ホームブリューは動作します。',
        loading: 'vitaslop を起動中...',
        loadingTip: 'エミュレータはホストサイトから読み込まれます。初回は時間がかかることがあります',
        loadingSlow: '読み込みが遅い場合はそのままお待ちいただくか、新しいタブでエミュレータを開いてください',
        openInNewTab: '新しいタブでエミュレータを開く ↗',
        instructions: '使い方',
        controlsTitle: '操作方法',
        controlsHint1: 'エミュレータにフォーカスがあればキーボードとマウスで操作します。タッチパッドはマウス/タッチに対応',
        controlsHint2: 'まずエミュレータ内のAdd gamesを開いて自分のパッケージを追加してください。ゲームとセーブはブラウザに永続化されます',
        aboutTitle: 'PS Vita について',
        aboutHint: 'PS Vita：ソニーの携帯ゲーム機（2011-2019）。エミュレーションはvitaslop（MIT）をホットリンクで提供。WebGPU、JSPI、SharedArrayBuffer、OPFSが必要です。つまり最新のデスクトップChrome/Edgeが対象です（モバイルSafari/Firefoxは非対応）。',
        playing: '実行中：',
        fullscreen: '全画面'
    },
    ko: {
        pageTitle: 'PS Vita',
        reset: '재설정',
        tabDemo: '에뮬레이터',
        demoTitle: 'PS Vita 에뮬레이터',
        demoDesc: 'vitaslop(MIT, 공식 웹 앱 핫링크 임베드)으로 브라우저에서 PlayStation Vita 게임을 실행하세요. Vita의 ARM 코드는 런타임에 WebAssembly로 번역되고, GPU 명령 스트림은 WebGPU로 재생됩니다.',
        demoOpen: '에뮬레이터 실행',
        demoHint: '게임은 포함되어 있지 않습니다. 에뮬레이터의 Add games 페이지에서 자신이 합법적으로 덤프한 패키지(.pkg + work.bin, 덤프한 폴더 또는 그 zip)를 추가하세요. 업로드되지 않습니다. 내장 플레이어는 임시 격리 저장소를 사용하므로 닫거나 새로고침하면 게임과 세이브가 유지되지 않습니다. 영구 저장은 “새 탭에서 열기” 링크를 사용하세요. 초기 단계: 실행되는 상용 게임도 많지만 안 되는 것도 많습니다. 홈브루는 동작합니다.',
        loading: 'vitaslop 시작 중...',
        loadingTip: '에뮬레이터는 호스트 사이트에서 로드됩니다. 첫 실행은 시간이 걸릴 수 있습니다',
        loadingSlow: '로딩이 느리면 조금 더 기다리거나 새 탭에서 에뮬레이터를 여세요',
        openInNewTab: '새 탭에서 에뮬레이터 열기 ↗',
        instructions: '사용 방법',
        controlsTitle: '조작 방법',
        controlsHint1: '에뮬레이터에 포커스가 있으면 키보드와 마우스로 조작합니다. 터치 패드는 마우스/터치에 대응',
        controlsHint2: '먼저 에뮬레이터 안의 Add games를 열어 자신의 패키지를 추가하세요. 게임과 세이브는 브라우저에 유지됩니다',
        aboutTitle: 'PS Vita 소개',
        aboutHint: 'PS Vita: 소니의 휴대용 게임기(2011-2019). vitaslop(MIT)을 핫링크로 제공. WebGPU, JSPI, SharedArrayBuffer, OPFS가 필요합니다. 즉 최신 데스크톱 Chrome/Edge가 대상입니다(모바일 Safari/Firefox는 미지원).',
        playing: '실행 중: ',
        fullscreen: '전체 화면'
    },
    fr: {
        pageTitle: 'PS Vita',
        reset: 'Réinitialiser',
        tabDemo: 'Émulateur',
        demoTitle: 'Émulateur PS Vita',
        demoDesc: "Exécutez des jeux PlayStation Vita dans votre navigateur avec vitaslop (MIT, intégré par lien direct vers l'application web officielle). Le code ARM de la Vita est traduit en WebAssembly à l'exécution et le flux de commandes GPU est rejoué en WebGPU.",
        demoOpen: "Lancer l'émulateur",
        demoHint: "Aucun jeu n'est fourni - ajoutez vos propres paquets dumpés légalement (.pkg + work.bin, un dossier dumpé ou un zip) dans la bibliothèque de l'émulateur ; rien n'est envoyé. Le lecteur intégré utilise un stockage isolé temporaire : les jeux et sauvegardes ne survivent pas à la fermeture ou au rechargement. Utilisez le lien « Ouvrir dans un nouvel onglet » pour un stockage local persistant. Stade précoce : beaucoup de jeux commerciaux démarrent, beaucoup non ; les homebrews fonctionnent.",
        loading: "Démarrage de vitaslop, veuillez patienter...",
        loadingTip: "L'émulateur se charge depuis son site hôte ; le premier lancement peut être long",
        loadingSlow: "Chargement lent - patientez encore un peu, ou ouvrez l'émulateur dans un nouvel onglet",
        openInNewTab: "Ouvrir l'émulateur dans un nouvel onglet ↗",
        instructions: 'Instructions',
        controlsTitle: 'Commandes',
        controlsHint1: "Les jeux se contrôlent au clavier et à la souris une fois l'émulateur focalisé ; le pavé tactile correspond à la souris/au tactile",
        controlsHint2: "Ouvrez d'abord Add games dans l'émulateur pour importer vos paquets ; les jeux et sauvegardes persistent dans votre navigateur",
        aboutTitle: 'À propos',
        aboutHint: "PS Vita : la console portable de Sony (2011-2019). Émulation via vitaslop (MIT), intégré par lien direct. Nécessite WebGPU, JSPI, SharedArrayBuffer et OPFS - soit un Chrome/Edge de bureau récent (Safari/Firefox mobile non pris en charge).",
        playing: 'En cours : ',
        fullscreen: 'Plein écran'
    },
    de: {
        pageTitle: 'PS Vita',
        reset: 'Zurücksetzen',
        tabDemo: 'Emulator',
        demoTitle: 'PS-Vita-Emulator',
        demoDesc: 'Spielen Sie PlayStation-Vita-Spiele in Ihrem Browser - mit vitaslop (MIT, per Hotlink zur offiziellen Web-App eingebettet). Der ARM-Code der Vita wird zur Laufzeit nach WebAssembly übersetzt, der GPU-Befehlsstrom als WebGPU wiedergegeben.',
        demoOpen: 'Emulator starten',
        demoHint: 'Es sind keine Spiele enthalten - fügen Sie Ihre eigenen legal gedumpten Pakete (.pkg + work.bin, einen gedumpten Ordner oder ein Zip) in der Emulator-Bibliothek hinzu; nichts wird hochgeladen. Der eingebettete Player nutzt temporären isolierten Speicher: Spiele und Spielstände bleiben nach Schließen oder Neuladen nicht erhalten. Für dauerhaften lokalen Speicher nutzen Sie den Link „Im neuen Tab öffnen“. Frühphase: viele kommerzielle Spiele starten und laufen, viele nicht; Homebrew funktioniert.',
        loading: 'vitaslop wird gestartet, bitte warten...',
        loadingTip: 'Der Emulator lädt von seiner Host-Seite; der erste Start kann dauern',
        loadingSlow: 'Lädt langsam - warten Sie noch etwas oder öffnen Sie den Emulator in einem neuen Tab',
        openInNewTab: 'Emulator in einem neuen Tab öffnen ↗',
        instructions: 'Anleitung',
        controlsTitle: 'Steuerung',
        controlsHint1: 'Die Spiele werden mit Tastatur und Maus gesteuert, sobald der Emulator den Fokus hat; das Touchpad entspricht Maus/Touch',
        controlsHint2: 'Öffnen Sie zuerst Add games im Emulator, um Ihre eigenen Pakete zu importieren; Spiele und Spielstände bleiben im Browser',
        aboutTitle: 'Über',
        aboutHint: 'PS Vita: Sonys Handheld (2011-2019). Emulation via vitaslop (MIT), per Hotlink eingebettet. Benötigt WebGPU, JSPI, SharedArrayBuffer und OPFS - also ein aktuelles Desktop-Chrome/Edge (mobiles Safari/Firefox wird nicht unterstützt).',
        playing: 'Läuft: ',
        fullscreen: 'Vollbild'
    },

    es: {
        pageTitle: 'PS Vita',
        reset: 'Restablecer',
        tabDemo: 'Emulador',
        demoTitle: 'Emulador de PS Vita',
        demoDesc: 'Ejecuta juegos de PlayStation Vita en tu navegador con vitaslop (MIT, incrustado por enlace directo a la aplicación web oficial). El código ARM de la Vita se traduce a WebAssembly en tiempo de ejecución y el flujo de comandos GPU se reproduce como WebGPU.',
        demoOpen: 'Iniciar emulador',
        demoHint: 'No se incluyen juegos - añade tus propios paquetes volcados legalmente (.pkg + work.bin, una carpeta volcada o un zip) en la biblioteca del emulador; nada se sube. El reproductor incrustado usa almacenamiento aislado temporal: los juegos y las partidas no sobreviven al cierre o la recarga. Usa el enlace «Abrir en una pestaña nueva» para almacenamiento local persistente. Etapa temprana: muchos juegos comerciales arrancan y funcionan, muchos no; el homebrew funciona.',
        loading: 'Iniciando vitaslop, espera...',
        loadingTip: 'El emulador se carga desde su sitio anfitrión; el primer arranque puede tardar',
        loadingSlow: 'Carga lenta - espera un poco más o abre el emulador en una pestaña nueva',
        openInNewTab: 'Abrir el emulador en una pestaña nueva ↗',
        instructions: 'Instrucciones',
        controlsTitle: 'Controles',
        controlsHint1: 'Los juegos se controlan con teclado y ratón una vez que el emulador tenga el foco; el panel táctil se mapea a ratón/táctil',
        controlsHint2: 'Abre primero Add games dentro del emulador para importar tus paquetes; los juegos y partidas guardadas persisten en tu navegador',
        aboutTitle: 'Acerca de',
        aboutHint: 'PS Vita: la consola portátil de Sony (2011-2019). Emulación vía vitaslop (MIT), incrustado por enlace directo. Requiere WebGPU, JSPI, SharedArrayBuffer y OPFS, es decir, un Chrome/Edge de escritorio reciente (Safari/Firefox móviles no admitidos).',
        playing: 'Ejecutando: ',
        fullscreen: 'Pantalla completa'
    },
    ru: {
        pageTitle: 'PS Vita',
        reset: 'Сброс',
        tabDemo: 'Эмулятор',
        demoTitle: 'Эмулятор PS Vita',
        demoDesc: 'Запускайте игры PlayStation Vita в браузере с помощью vitaslop (MIT, встраивание горячей ссылкой на официальное веб-приложение). ARM-код Vita транслируется в WebAssembly во время выполнения, а поток команд GPU воспроизводится как WebGPU.',
        demoOpen: 'Запустить эмулятор',
        demoHint: 'Игры не включены - добавьте свои легально снятые дампы (.pkg + work.bin, папку дампа или zip) в библиотеку эмулятора; ничего не загружается на сервер. Встроенный плеер использует временное изолированное хранилище: игры и сохранения не сохраняются после закрытия или перезагрузки. Для постоянного локального хранения используйте ссылку «Открыть в новой вкладке». Ранняя стадия: многие коммерческие игры запускаются и работают, многие нет; homebrew работает.',
        loading: 'vitaslop запускается, подождите...',
        loadingTip: 'Эмулятор загружается с сайта-хоста; первый запуск может быть долгим',
        loadingSlow: 'Загрузка идёт медленно - подождите ещё немного или откройте эмулятор в новой вкладке',
        openInNewTab: 'Открыть эмулятор в новой вкладке ↗',
        instructions: 'Инструкция',
        controlsTitle: 'Управление',
        controlsHint1: 'Игры управляются клавиатурой и мышью, когда эмулятор в фокусе; тачпад соответствует мыши/касанию',
        controlsHint2: 'Сначала откройте Add games в эмуляторе и импортируйте свои пакеты; игры и сохранения хранятся в браузере',
        aboutTitle: 'О платформе',
        aboutHint: 'PS Vita: портативная консоль Sony (2011-2019). Эмуляция через vitaslop (MIT), встраивание горячей ссылкой. Требуются WebGPU, JSPI, SharedArrayBuffer и OPFS - то есть свежий десктопный Chrome/Edge (мобильные Safari/Firefox не поддерживаются).',
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
    link.href = VITA_BASE;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = t('openInNewTab');
    link.style.cssText = 'display:inline-block;margin-top:14px;color:#33ff66;text-decoration:underline;font-size:14px;';
    overlay.appendChild(link);
}

function showPlayer(title) {
    document.getElementById('uploadSection').classList.add('hidden');
    document.getElementById('playerSection').classList.add('active');
    document.getElementById('pageTitle').textContent = t('playing') + (title || 'PS Vita');
    document.getElementById('resetBtn').style.display = '';
    document.getElementById('fullscreenBtn').style.display = '';
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

function playVita() {
    var frame = document.getElementById('vitaFrame');
    if (!frame) return;
    showPlayer('PS Vita');
    // vitaslop manages game import and library inside its own UI
    // itself; nothing can be passed from this host page.
    frame.addEventListener('load', hideOverlay, { once: true });
    frame.src = VITA_BASE;
    slowTimer = setTimeout(function () {
        showToast(t('loadingSlow'));
        showSlowLink();
    }, 15000);
}

function stopPlayback() {
    var frame = document.getElementById('vitaFrame');
    if (frame) frame.src = 'about:blank';
    hideOverlay();
    document.getElementById('playerSection').classList.remove('active');
    document.getElementById('uploadSection').classList.remove('hidden');
    document.getElementById('pageTitle').textContent = t('pageTitle');
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('fullscreenBtn').style.display = 'none';
}

// ---- demo tab ----------------------------------------------------------
document.getElementById('demoOpenBtn').addEventListener('click', playVita);
(function () {
    var link = document.getElementById('demoOpenNewTab');
    if (link) link.href = VITA_BASE;
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
// The upstream app does not ship its own fullscreen control, so the host
// page requests fullscreen on the iframe itself (allowed via allowfullscreen).
document.getElementById('fullscreenBtn').addEventListener('click', function () {
    var frame = document.getElementById('vitaFrame');
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

// ---- cross-origin isolation bootstrap (vita page only) -----------------
// The SW injects COOP/COEP for /routes/vita.html top-level navigations. If
// this load happened before the SW could intercept (first visit, or the SW
// was not yet registered because the user landed here without passing
// index.html), adopt the controller and reload once - guarded so we never
// loop. On an isolated load we clear the guard.
HotlinkPlayer.ensureIsolated('vitaIsoReload', '[vita]', '/sw.js');

