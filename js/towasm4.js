// WASM-4 Fantasy Console Page JavaScript
// Runtime: vendored web runtime at vendor/wasm4 (npm wasm4@2.7.1, ISC license,
// (c) Bruno Garcia - see vendor/wasm4/README.md). The runtime boots into the
// <wasm4-app> player element; carts (.wasm files) are handed over via setCart.

// Internationalization (same language set as todos.js)
var i18n = {
    zh: {
        pageTitle: 'WASM-4 虚拟主机',
        reset: '重置',
        tabFile: '游戏卡带',
        tabUrl: 'URL 输入',
        uploadTitle: '加载 WASM-4 游戏卡带',
        uploadDesc: '拖拽 .wasm 卡带到此处或点击选择',
        uploadSelect: '选择 .wasm 卡带',
        uploadHint: 'WASM-4 是一台幻想主机：160x160 像素、四色调色板，卡带用 Rust / C / Zig / AssemblyScript 编译成极小的 .wasm 文件。',
        urlTitle: '从 URL 加载卡带',
        urlDesc: '输入 .wasm 卡带文件的直接链接',
        urlPlaceholder: 'https://example.com/game.wasm',
        loadCart: '加载卡带',
        urlTip: '提示：必要时会通过公共 CORS 代理下载。',
        loading: '正在加载 WASM-4 运行时，请稍候...',
        loadingTip: '幻想主机一两秒内即可启动',
        playing: '正在播放：',
        invalidCart: '请选择 .wasm 卡带文件',
        cartFailed: '卡带加载失败，请确认是有效的 WASM-4 .wasm 卡带',
        urlFetchFailed: '下载卡带失败，请检查 URL 是否正确。',
        urlFetchError: '网络错误，无法下载卡带。',
        noRuntime: 'WASM-4 运行时未加载，请刷新页面重试',
        instructions: '使用说明',
        controlsTitle: '操作方式',
        controlsHint1: '方向键 = 十字键，Z 和 X = 动作按钮',
        controlsHint2: '播放器工具栏提供全屏、存档和音量控制',
        fullscreenDesc: '全屏：使用工具栏按钮',
        exitFullscreen: '按 ESC 退出全屏'
    },
    en: {
        pageTitle: 'WASM-4',
        reset: 'Reset',
        tabFile: 'Game Cart',
        tabUrl: 'URL Input',
        uploadTitle: 'Load a WASM-4 Game Cart',
        uploadDesc: 'Drag and drop a .wasm cart here or click to select',
        uploadSelect: 'Select .wasm Cart',
        uploadHint: 'WASM-4 is a fantasy console: 160x160 pixels, 4-color palettes, tiny .wasm carts built with Rust / C / Zig / AssemblyScript.',
        urlTitle: 'Load a Cart from URL',
        urlDesc: 'Enter the direct URL of a .wasm cart file',
        urlPlaceholder: 'https://example.com/game.wasm',
        loadCart: 'Load Cart',
        urlTip: 'Tip: downloads go through a public CORS proxy when needed.',
        loading: 'Loading WASM-4 runtime, please wait...',
        loadingTip: 'The fantasy console boots in a second or two',
        playing: 'Now playing: ',
        invalidCart: 'Please select a .wasm cart file',
        cartFailed: 'Failed to load the cart. Make sure it is a valid WASM-4 .wasm cart.',
        urlFetchFailed: 'Failed to download the cart. Please check the URL.',
        urlFetchError: 'Network error, unable to download the cart.',
        noRuntime: 'WASM-4 runtime not loaded, please refresh the page',
        instructions: 'Instructions',
        controlsTitle: 'Controls',
        controlsHint1: 'Arrow keys = D-pad, Z and X = action buttons',
        controlsHint2: 'The player toolbar offers fullscreen, save states and volume',
        fullscreenDesc: 'Fullscreen: use the toolbar button',
        exitFullscreen: 'Press ESC to exit fullscreen'
    },
    ja: {
        pageTitle: 'WASM-4',
        reset: 'リセット',
        tabFile: 'ゲームカート',
        tabUrl: 'URL入力',
        uploadTitle: 'WASM-4ゲームカートを読み込む',
        uploadDesc: '.wasmカートをここにドラッグ＆ドロップ、またはクリックして選択',
        uploadSelect: '.wasmカートを選択',
        uploadHint: 'WASM-4はファンタジーコンソール：160x160ピクセル、4色パレット、Rust / C / Zig / AssemblyScriptで作られた小さな.wasmカート。',
        urlTitle: 'URLからカートを読み込む',
        urlDesc: '.wasmカートファイルの直接URLを入力',
        urlPlaceholder: 'https://example.com/game.wasm',
        loadCart: 'カートを読み込む',
        urlTip: 'ヒント：必要に応じて公共CORSプロキシ経由でダウンロードします。',
        loading: 'WASM-4ランタイムを読み込み中...',
        loadingTip: 'ファンタジーコンソールは1〜2秒で起動します',
        playing: '再生中：',
        invalidCart: '.wasmカートファイルを選択してください',
        cartFailed: 'カートの読み込みに失敗しました。有効なWASM-4 .wasmカートか確認してください。',
        urlFetchFailed: 'カートのダウンロードに失敗しました。URLを確認してください。',
        urlFetchError: 'ネットワークエラー、カートをダウンロードできません。',
        noRuntime: 'WASM-4ランタイムが読み込まれていません。ページを更新してください',
        instructions: '使い方',
        controlsTitle: '操作方法',
        controlsHint1: '矢印キー = 十字キー、Z と X = アクションボタン',
        controlsHint2: 'プレイヤーツールバーで全画面・セーブ状態・音量を操作できます',
        fullscreenDesc: '全画面：ツールバーのボタンを使用',
        exitFullscreen: 'ESCキーで全画面を解除'
    },
    ko: {
        pageTitle: 'WASM-4',
        reset: '재설정',
        tabFile: '게임 카트',
        tabUrl: 'URL 입력',
        uploadTitle: 'WASM-4 게임 카트 로드',
        uploadDesc: '.wasm 카트를 여기로 드래그하거나 클릭하여 선택',
        uploadSelect: '.wasm 카트 선택',
        uploadHint: 'WASM-4는 판타지 콘솔: 160x160 픽셀, 4색 팔레트, Rust / C / Zig / AssemblyScript로 만든 작은 .wasm 카트.',
        urlTitle: 'URL에서 카트 로드',
        urlDesc: '.wasm 카트 파일의 직접 URL을 입력',
        urlPlaceholder: 'https://example.com/game.wasm',
        loadCart: '카트 로드',
        urlTip: '팁: 필요 시 공용 CORS 프록시를 통해 다운로드합니다.',
        loading: 'WASM-4 런타임을 불러오는 중...',
        loadingTip: '판타지 콘솔은 1~2초 만에 부팅됩니다',
        playing: '재생 중: ',
        invalidCart: '.wasm 카트 파일을 선택하세요',
        cartFailed: '카트 로드 실패. 유효한 WASM-4 .wasm 카트인지 확인하세요.',
        urlFetchFailed: '카트 다운로드 실패. URL을 확인하세요.',
        urlFetchError: '네트워크 오류, 카트를 다운로드할 수 없습니다.',
        noRuntime: 'WASM-4 런타임이 로드되지 않았습니다. 페이지를 새로고침하세요',
        instructions: '사용 방법',
        controlsTitle: '조작 방법',
        controlsHint1: '방향키 = D패드, Z와 X = 액션 버튼',
        controlsHint2: '플레이어 툴바에서 전체 화면, 저장 상태, 음량을 조작할 수 있습니다',
        fullscreenDesc: '전체 화면: 툴바 버튼 사용',
        exitFullscreen: 'ESC 키로 전체 화면 종료'
    },
    fr: {
        pageTitle: 'WASM-4',
        reset: 'Réinitialiser',
        tabFile: 'Cartouche',
        tabUrl: 'URL',
        uploadTitle: 'Charger une cartouche WASM-4',
        uploadDesc: 'Glissez-déposez une cartouche .wasm ici ou cliquez pour sélectionner',
        uploadSelect: 'Sélectionner une cartouche .wasm',
        uploadHint: 'WASM-4 est une console fantasy : 160x160 pixels, palettes de 4 couleurs, petites cartouches .wasm créées avec Rust / C / Zig / AssemblyScript.',
        urlTitle: 'Charger une cartouche depuis une URL',
        urlDesc: 'Entrez l\'URL directe d\'un fichier cartouche .wasm',
        urlPlaceholder: 'https://example.com/game.wasm',
        loadCart: 'Charger la cartouche',
        urlTip: 'Astuce : les téléchargements passent par un proxy CORS public si nécessaire.',
        loading: 'Chargement du runtime WASM-4, veuillez patienter...',
        loadingTip: 'La console fantasy démarre en une ou deux secondes',
        playing: 'Lecture : ',
        invalidCart: 'Veuillez sélectionner un fichier cartouche .wasm',
        cartFailed: 'Échec du chargement de la cartouche. Vérifiez qu\'il s\'agit d\'une cartouche .wasm WASM-4 valide.',
        urlFetchFailed: 'Échec du téléchargement. Vérifiez l\'URL.',
        urlFetchError: 'Erreur réseau, impossible de télécharger la cartouche.',
        noRuntime: 'Runtime WASM-4 non chargé, veuillez actualiser la page',
        instructions: 'Instructions',
        controlsTitle: 'Commandes',
        controlsHint1: 'Flèches = croix directionnelle, Z et X = boutons d\'action',
        controlsHint2: 'La barre d\'outils du lecteur offre plein écran, sauvegardes et volume',
        fullscreenDesc: 'Plein écran : utilisez le bouton de la barre d\'outils',
        exitFullscreen: 'Appuyez sur ÉCHAP pour quitter le plein écran'
    },
    de: {
        pageTitle: 'WASM-4',
        reset: 'Zurücksetzen',
        tabFile: 'Spiel-Kartusche',
        tabUrl: 'URL',
        uploadTitle: 'WASM-4-Spielkartusche laden',
        uploadDesc: '.wasm-Kartusche hierher ziehen oder klicken zum Auswählen',
        uploadSelect: '.wasm-Kartusche auswählen',
        uploadHint: 'WASM-4 ist eine Fantasy-Konsole: 160x160 Pixel, 4-Farb-Paletten, winzige .wasm-Kartuschen mit Rust / C / Zig / AssemblyScript.',
        urlTitle: 'Kartusche von URL laden',
        urlDesc: 'Geben Sie die direkte URL einer .wasm-Kartuschendatei ein',
        urlPlaceholder: 'https://example.com/game.wasm',
        loadCart: 'Kartusche laden',
        urlTip: 'Tipp: Downloads laufen bei Bedarf über einen öffentlichen CORS-Proxy.',
        loading: 'WASM-4-Runtime wird geladen, bitte warten...',
        loadingTip: 'Die Fantasy-Konsole startet in ein bis zwei Sekunden',
        playing: 'Läuft: ',
        invalidCart: 'Bitte eine .wasm-Kartuschendatei auswählen',
        cartFailed: 'Kartusche konnte nicht geladen werden. Bitte prüfen, ob es eine gültige WASM-4-.wasm-Kartusche ist.',
        urlFetchFailed: 'Download fehlgeschlagen. Bitte URL prüfen.',
        urlFetchError: 'Netzwerkfehler, Kartusche kann nicht heruntergeladen werden.',
        noRuntime: 'WASM-4-Runtime nicht geladen, bitte Seite neu laden',
        instructions: 'Anleitung',
        controlsTitle: 'Steuerung',
        controlsHint1: 'Pfeiltasten = Steuerkreuz, Z und X = Aktionstasten',
        controlsHint2: 'Die Player-Symbolleiste bietet Vollbild, Speicherstände und Lautstärke',
        fullscreenDesc: 'Vollbild: Symbolleisten-Schaltfläche verwenden',
        exitFullscreen: 'ESC drücken, um den Vollbildmodus zu verlassen'
    },
    es: {
        pageTitle: 'WASM-4',
        reset: 'Restablecer',
        tabFile: 'Cartucho',
        tabUrl: 'URL',
        uploadTitle: 'Cargar un cartucho WASM-4',
        uploadDesc: 'Arrastra un cartucho .wasm aquí o haz clic para seleccionar',
        uploadSelect: 'Seleccionar cartucho .wasm',
        uploadHint: 'WASM-4 es una consola fantasy: 160x160 píxeles, paletas de 4 colores, pequeños cartuchos .wasm hechos con Rust / C / Zig / AssemblyScript.',
        urlTitle: 'Cargar cartucho desde URL',
        urlDesc: 'Ingrese la URL directa de un archivo cartucho .wasm',
        urlPlaceholder: 'https://example.com/game.wasm',
        loadCart: 'Cargar cartucho',
        urlTip: 'Consejo: las descargas usan un proxy CORS público si es necesario.',
        loading: 'Cargando el runtime WASM-4, espera...',
        loadingTip: 'La consola fantasy arranca en uno o dos segundos',
        playing: 'Reproduciendo: ',
        invalidCart: 'Selecciona un archivo cartucho .wasm',
        cartFailed: 'No se pudo cargar el cartucho. Asegúrate de que es un cartucho .wasm WASM-4 válido.',
        urlFetchFailed: 'Error al descargar. Verifique la URL.',
        urlFetchError: 'Error de red, no se puede descargar el cartucho.',
        noRuntime: 'Runtime de WASM-4 no cargado, actualice la página',
        instructions: 'Instrucciones',
        controlsTitle: 'Controles',
        controlsHint1: 'Flechas = cruceta, Z y X = botones de acción',
        controlsHint2: 'La barra del reproductor ofrece pantalla completa, guardado y volumen',
        fullscreenDesc: 'Pantalla completa: use el botón de la barra',
        exitFullscreen: 'Pulsa ESC para salir de pantalla completa'
    },
    ru: {
        pageTitle: 'WASM-4',
        reset: 'Сброс',
        tabFile: 'Картридж',
        tabUrl: 'URL',
        uploadTitle: 'Загрузить картридж WASM-4',
        uploadDesc: 'Перетащите картридж .wasm сюда или нажмите для выбора',
        uploadSelect: 'Выбрать картридж .wasm',
        uploadHint: 'WASM-4 — фэнтезийная консоль: 160x160 пикселей, палитры из 4 цветов, крошечные картриджи .wasm на Rust / C / Zig / AssemblyScript.',
        urlTitle: 'Загрузить картридж по URL',
        urlDesc: 'Введите прямой URL файла картриджа .wasm',
        urlPlaceholder: 'https://example.com/game.wasm',
        loadCart: 'Загрузить картридж',
        urlTip: 'Совет: при необходимости загрузка идёт через публичный CORS-прокси.',
        loading: 'Загрузка runtime WASM-4, подождите...',
        loadingTip: 'Фэнтезийная консоль запускается за секунду-другую',
        playing: 'Запущено: ',
        invalidCart: 'Выберите файл картриджа .wasm',
        cartFailed: 'Не удалось загрузить картридж. Убедитесь, что это корректный .wasm-картридж WASM-4.',
        urlFetchFailed: 'Ошибка загрузки. Проверьте URL.',
        urlFetchError: 'Сетевая ошибка, невозможно загрузить картридж.',
        noRuntime: 'Runtime WASM-4 не загружен, обновите страницу',
        instructions: 'Инструкция',
        controlsTitle: 'Управление',
        controlsHint1: 'Стрелки = крестовина, Z и X = кнопки действий',
        controlsHint2: 'Панель плеера: полный экран, сохранения и громкость',
        fullscreenDesc: 'Полный экран: кнопка на панели',
        exitFullscreen: 'Нажмите ESC, чтобы выйти из полного экрана'
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
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
        el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    document.documentElement.lang = getLang() === 'zh' ? 'zh-CN' : getLang();
}

// Toast
var toastTimer = null;
function showToast(message) {
    var toast = document.getElementById('toast');
    var msgEl = document.getElementById('toastMessage');
    if (!toast || !msgEl) return;
    msgEl.textContent = message;
    toast.classList.remove('hidden');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
        toast.classList.add('hidden');
    }, 3500);
}
// ---------------------------------------------------------------------------
// Cart loading & player control
//
// The slim runtime has no setCart API. Its official integration point is a
// JSON script tag read during <wasm4-app> init:
//   <script type="application/json" id="wasm4-cart-json">
//     {"WASM4_CART": "<z85-encoded cart>", "WASM4_CART_SIZE": <byte length>}
//   </script>
// (matches lib/bundle.js in the wasm4 npm package: WASM4_CART = z85.encode(cart),
// WASM4_CART_SIZE = cart.length; the decoder stops at SIZE so zero padding
// added for the 4-byte z85 block alignment is dropped again.)
// We inject that tag and mount a fresh wasm4-app element per cart.
// ---------------------------------------------------------------------------

// Port of the official wasm4 CLI z85 encoder (lib/utils/z85.js, ISC).
function z85Encode(bytes) {
    var ENCODER = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.-:+=^!/*?&<>()[]{}@%$#';
    var size = bytes.length;
    var extra = size % 4;
    var paddedSize = extra ? size + 4 - extra : size;
    var str = '';
    var byteNbr = 0;
    var value = 0;
    while (byteNbr < paddedSize) {
        var b = byteNbr < size ? bytes[byteNbr] : 0;
        ++byteNbr;
        value = value * 256 + b;
        if (byteNbr % 4 === 0) {
            var divisor = 85 * 85 * 85 * 85;
            while (divisor >= 1) {
                str += ENCODER.charAt(Math.floor(value / divisor) % 85);
                divisor /= 85;
            }
            value = 0;
        }
    }
    return str;
}

var currentCartName = null;

function setOverlay(visible) {
    var overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.toggle('hidden', !visible);
}

async function loadCart(bytes, name) {
    if (bytes.byteLength > 65536) {
        // WASM-4 carts are limited to 64 KiB by the runtime (see runtime.load)
        setOverlay(false);
        showToast(t('cartFailed'));
        return;
    }
    setOverlay(true);
    try {
        var wrapper = document.getElementById('wasm4Wrapper');
        // Tear down any previous player instance
        var oldApp = wrapper.querySelector('wasm4-app');
        if (oldApp) oldApp.remove();
        var oldJson = document.getElementById('wasm4-cart-json');
        if (oldJson) oldJson.remove();

        // Inject the cart payload in the runtime's official format
        var script = document.createElement('script');
        script.type = 'application/json';
        script.id = 'wasm4-cart-json';
        script.textContent = JSON.stringify({
            WASM4_CART: z85Encode(new Uint8Array(bytes)),
            WASM4_CART_SIZE: bytes.byteLength
        });
        wrapper.appendChild(script);

        // A fresh element runs its init() which picks up the cart-json tag
        var app = document.createElement('wasm4-app');
        wrapper.appendChild(app);

        currentCartName = name;
        var uploadSection = document.getElementById('uploadSection');
        if (uploadSection) uploadSection.classList.add('hidden');
        var resetBtn = document.getElementById('resetBtn');
        if (resetBtn) resetBtn.style.display = 'flex';
        var playerSection = document.getElementById('playerSection');
        if (playerSection) playerSection.classList.add('active');
        window.scrollTo(0, 0);
        setOverlay(false);
        showToast(t('playing') + name);
    } catch (err) {
        console.error('WASM-4 cart load failed:', err);
        setOverlay(false);
        showToast(t('cartFailed'));
    }
}

function playFile(file) {
    if (!/\.wasm$/i.test(file.name)) {
        showToast(t('invalidCart'));
        return;
    }
    file.arrayBuffer().then(function(buf) {
        loadCart(buf, file.name);
    }).catch(function(err) {
        console.error('read failed:', err);
        showToast(t('cartFailed'));
    });
}

// CORS proxy chain (same set and caveats as todos.js)
var corsProxies = [
    'https://cors.luckydesigner.workers.dev/?',
    'https://api.cors.lol/?url=',
    'https://api.codetabs.com/v1/proxy?quest='
];

var directFetchHosts = [
    'raw.githubusercontent.com',
    'gist.githubusercontent.com',
    'cdn.jsdelivr.net'
];

function isDirectFetchable(url) {
    try {
        return directFetchHosts.indexOf(new URL(url).hostname) !== -1;
    } catch (e) {
        return false;
    }
}

function isLikelyErrorBody(blob) {
    return new Promise(function(resolve) {
        var reader = new FileReader();
        reader.onload = function() {
            var head = String(reader.result || '').slice(0, 512).toLowerCase();
            resolve(head.indexOf('error code:') === 0 ||
                    head.indexOf('{"error') === 0 ||
                    head.indexOf('<!doctype') === 0 ||
                    head.indexOf('<html') === 0 ||
                    head.indexOf('rate limit') !== -1);
        };
        reader.onerror = function() { resolve(false); };
        reader.readAsText(blob.slice(0, 512));
    });
}

function downloadCart(url) {
    var attempts = [];
    if (isDirectFetchable(url)) {
        attempts.push(url);
    }
    corsProxies.forEach(function(p) { attempts.push(p + encodeURIComponent(url)); });

    var idx = 0;
    function tryNext() {
        if (idx >= attempts.length) {
            return Promise.reject(new Error('all proxies failed'));
        }
        var target = attempts[idx++];
        return fetch(target)
            .then(function(res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.blob();
            })
            .then(function(blob) {
                if (blob.size === 0) throw new Error('empty body');
                return isLikelyErrorBody(blob).then(function(bad) {
                    if (bad) throw new Error('error page body');
                    return blob.arrayBuffer();
                });
            })
            .catch(function(err) {
                console.warn('wasm4 cart download failed via', target, err);
                return tryNext();
            });
    }
    return tryNext();
}
// ---------------------------------------------------------------------------
// Event wiring
// ---------------------------------------------------------------------------
function bindEvents() {
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'game.html';
    });

    // Reset: reboot the current cart from the beginning (WASM-4 has no reset
    // method in the slim runtime; reload the page for a clean console state)
    document.getElementById('resetBtn').addEventListener('click', function() {
        if (!currentCartName) return;
        window.location.reload();
    });

    // Tabs
    document.querySelectorAll('.upload-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.upload-tab').forEach(function(el) {
                el.classList.remove('active');
            });
            this.classList.add('active');
            var which = this.dataset.tab;
            document.getElementById('uploadBox').classList.toggle('hidden', which !== 'file');
            document.getElementById('urlBox').classList.toggle('hidden', which !== 'url');
        });
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

    // File upload (click + drag & drop)
    var cartInput = document.getElementById('cartInput');
    document.getElementById('uploadBtn').addEventListener('click', function() {
        cartInput.click();
    });
    cartInput.addEventListener('change', function() {
        var file = cartInput.files && cartInput.files[0];
        if (file) playFile(file);
        cartInput.value = '';
    });
    var uploadBox = document.getElementById('uploadBox');
    ['dragover', 'dragenter'].forEach(function(evt) {
        uploadBox.addEventListener(evt, function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
    });
    uploadBox.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var file = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (file) playFile(file);
    });

    // URL input
    document.getElementById('urlLoadBtn').addEventListener('click', function() {
        var input = document.getElementById('cartUrlInput');
        var url = (input.value || '').trim();
        if (!/^https?:\/\//i.test(url)) {
            showToast(t('urlFetchFailed'));
            return;
        }
        setOverlay(true);
        downloadCart(url).then(function(buf) {
            var name = url.split('/').pop().split('?')[0] || 'cart.wasm';
            loadCart(buf, name);
        }).catch(function(err) {
            console.error('wasm4 URL cart failed:', err);
            setOverlay(false);
            showToast(t('urlFetchError'));
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== WASM-4 Page Loaded ===');
    applyTranslations();
    bindEvents();
});
