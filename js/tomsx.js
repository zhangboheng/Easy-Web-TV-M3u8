// MSX Page JavaScript - WebMSX emulator embedded by hotlink (author's
// stated use case: "Show MSX software running on any webpage").
// Presets are free/open homebrew ROMs loaded from their official GitHub
// releases; commercial ROMs are NOT included.

var WEBMSX_BASE = 'https://webmsx.org';


// Featured homebrew - every URL verified reachable with CORS (GitHub
// release assets). type: rom | disk | tape. machine: WebMSX MACHINE id.
var PRESETS = [
    {
        name: 'Nohzdyve',
        desc: 'MSX port of the Bandersnatch Easter-egg game - plainspooky (GPL-3.0)',
        type: 'rom',
        machine: '',
        url: 'https://github.com/plainspooky/nohzdyve/releases/download/v1.0/nohzdyve.rom'
    },
    {
        name: 'Go Penguin!',
        desc: 'MSX1 pixel-scroll platformer - albs-br (free release)',
        type: 'rom',
        machine: '',
        url: 'https://github.com/albs-br/penguin-platformer/releases/download/v.0.75.2/go-penguin.rom'
    },
    {
        name: 'Zeros Houkou R',
        desc: 'MSX turboR vertical shooter - suzuki-black (MIT)',
        type: 'rom',
        machine: 'tRJ',
        url: 'https://github.com/suzuki-black/ZeroNoHoukouR/releases/download/v0.4.8/ZeroNoHoukouR-v0.4.8.rom'
    }
];

// Internationalization (8 languages, same key set as topico8.js)
var i18n = {
    zh: {
        pageTitle: 'MSX',
        reset: '重置',
        tabPreset: '精选 Homebrew',
        tabUrl: '媒体 URL',
        tabFile: '本地文件',
        presetTitle: 'MSX Homebrew 游戏',
        presetDesc: '精选免费/开源 MSX 游戏，从作者官方 GitHub release 加载到 WebMSX 模拟器（热链嵌入）。不包含商业 ROM——请使用你自己的合法转储文件。',
        urlTitle: '从 URL 加载媒体',
        urlDesc: '输入 ROM（.rom）、磁盘（.dsk/.zip）或磁带（.cas）镜像的直链，格式自动检测',
        urlPlaceholder: 'https://example.com/game.rom',
        loadMedia: '加载运行',
        urlTip: '提示：文件服务器需允许跨域访问（CORS），GitHub raw 和 release 直链均可用。',
        uploadTitle: '播放本地媒体文件',
        uploadDesc: '选择你自己的 ROM（.rom）、磁盘（.dsk/.zip）或磁带（.cas）镜像',
        uploadSelect: '选择文件',
        uploadHint: '请只运行你拥有版权或免费分发的软件。文件仅在你的浏览器内处理，不会上传到任何服务器。',
        loading: 'MSX 启动中，请稍候...',
        loadingTip: '媒体文件从其服务器下载，首次加载可能较慢',
        instructions: '使用说明',
        controlsTitle: '操作方式',
        controlsHint1: '方向键 = 光标键，Z 或空格 = SPACE 键，X = ESC/STOP，回车 = RETURN',
        controlsHint2: '先点击模拟器画面获得键盘焦点；F1 打开 WebMSX 菜单',
        aboutTitle: '关于',
        aboutHint: 'MSX：基于 Z80 的 8 位家用电脑标准（MSX1/2/2+/turbo R），ASCII 与 Microsoft 1983 年制定。模拟由 ppeccin 的 WebMSX 热链提供。',
        playing: '正在运行：',
        fullscreen: '全屏',
        loadFailed: '无法加载该媒体文件，请检查地址或稍后重试',
        invalidFile: '请选择 .rom / .dsk / .cas / .zip 镜像文件',
        blobHint: '本地文件通过浏览器内存加载，不会上传'
    },
    en: {
        pageTitle: 'MSX',
        reset: 'Reset',
        tabPreset: 'Featured Homebrew',
        tabUrl: 'Media URL',
        tabFile: 'Local File',
        presetTitle: 'MSX Homebrew Games',
        presetDesc: "Featured free/open MSX games, loaded from each author's official GitHub release into the WebMSX emulator (embedded by hotlink). Commercial ROMs are not included - use your own legally dumped files.",
        urlTitle: 'Load Media from URL',
        urlDesc: 'Enter the direct URL of a ROM (.rom), disk (.dsk/.zip) or tape (.cas) image - format is auto-detected',
        urlPlaceholder: 'https://example.com/game.rom',
        loadMedia: 'Load Media',
        urlTip: 'Tip: the file server must allow cross-origin access (CORS). GitHub raw and release links work.',
        uploadTitle: 'Play a Local Media File',
        uploadDesc: 'Select your own ROM (.rom), disk (.dsk/.zip) or tape (.cas) image',
        uploadSelect: 'Select File',
        uploadHint: 'Only run software you own or that is freely distributed. The file stays in your browser - nothing is uploaded to any server.',
        loading: 'Booting MSX, please wait...',
        loadingTip: 'The media file downloads from its host; first load can take a while',
        instructions: 'Instructions',
        controlsTitle: 'Controls',
        controlsHint1: 'Arrow keys = cursor keys, Z or Space = SPACE key, X = ESC/STOP, Enter = RETURN',
        controlsHint2: 'Click inside the emulator first so it captures the keyboard; F1 opens the WebMSX menu',
        aboutTitle: 'About',
        aboutHint: 'MSX: Z80-based 8-bit home computer standard (MSX1/2/2+/turbo R) by ASCII & Microsoft, 1983. Emulation via WebMSX by ppeccin, embedded by hotlink.',
        playing: 'Now running: ',
        fullscreen: 'Fullscreen',
        loadFailed: 'Failed to load that media file - check the URL or try again later',
        invalidFile: 'Please select a .rom / .dsk / .cas / .zip image file',
        blobHint: 'Local files are loaded through browser memory, never uploaded'
    },
    ja: {
        pageTitle: 'MSX',
        reset: 'リセット',
        tabPreset: 'おすすめ Homebrew',
        tabUrl: 'メディアURL',
        tabFile: 'ローカルファイル',
        presetTitle: 'MSX ホームブレームゲーム',
        presetDesc: "無料/オープンソースのMSXゲームを、各作者の公式GitHubリリースからWebMSXエミュレータ（ホットリンク埋め込み）へ読み込みます。商用ROMは含まれません。自分の合法的にダンプしたファイルをご利用ください。",
        urlTitle: 'URLからメディアを読み込む',
        urlDesc: 'ROM（.rom）、ディスク（.dsk/.zip）、テープ（.cas）イメージの直接URLを入力（形式は自動判別）',
        urlPlaceholder: 'https://example.com/game.rom',
        loadMedia: 'メディアを読み込む',
        urlTip: 'ヒント：ファイルサーバーはクロスオリジンアクセス（CORS）を許可する必要があります。GitHubのraw・リリースリンクは利用可能です。',
        uploadTitle: 'ローカルメディアを再生',
        uploadDesc: '自分のROM（.rom）、ディスク（.dsk/.zip）、テープ（.cas）イメージを選択してください',
        uploadSelect: 'ファイルを選択',
        uploadHint: '自分が所有または自由に配布されているソフトウェアのみ実行してください。ファイルはブラウザ内で処理され、サーバーには送信されません。',
        loading: 'MSXを起動中...',
        loadingTip: 'メディアはホストからダウンロードされます。初回は時間がかかることがあります',
        instructions: '使い方',
        controlsTitle: '操作方法',
        controlsHint1: '矢印キー = カーソルキー、Z または Space = SPACEキー、X = ESC/STOP、Enter = RETURN',
        controlsHint2: '先にエミュレータ画面内をクリックしてキーボードフォーカスを合わせ、F1 でWebMSXメニューを開けます',
        aboutTitle: 'MSX について',
        aboutHint: 'MSX：Z80ベースの8ビットホームコンピュータ規格（MSX1/2/2+/turbo R）、ASCIIとマイクロソフト、1983年。エミュレーションはppeccinのWebMSXをホットリンクで提供。',
        playing: '実行中：',
        fullscreen: '全画面',
        loadFailed: 'そのメディアを読み込めませんでした。URLを確認するか後でお試しください',
        invalidFile: '.rom / .dsk / .cas / .zip イメージを選択してください',
        blobHint: 'ローカルファイルはブラウザメモリ経由で読み込まれ、アップロードされません'
    },
    ko: {
        pageTitle: 'MSX',
        reset: '재설정',
        tabPreset: '추천 홈브루',
        tabUrl: '미디어 URL',
        tabFile: '로컬 파일',
        presetTitle: 'MSX 홈브루 게임',
        presetDesc: '무료/오픈소스 MSX 게임을 각 저자의 공식 GitHub 릴리스에서 WebMSX 에뮬레이터(핫링크 임베드)로 불러옵니다. 상용 ROM은 포함되지 않습니다. 합법적으로 덤프한 파일을 사용하세요.',
        urlTitle: 'URL에서 미디어 불러오기',
        urlDesc: 'ROM(.rom), 디스크(.dsk/.zip), 테이프(.cas) 이미지의 직접 URL을 입력하세요(형식 자동 감지)',
        urlPlaceholder: 'https://example.com/game.rom',
        loadMedia: '미디어 불러오기',
        urlTip: '팁: 파일 서버가 교차 출처 접근(CORS)을 허용해야 합니다. GitHub raw 및 릴리스 링크가 동작합니다.',
        uploadTitle: '로컬 미디어 재생',
        uploadDesc: '자신의 ROM(.rom), 디스크(.dsk/.zip), 테이프(.cas) 이미지를 선택하세요',
        uploadSelect: '파일 선택',
        uploadHint: '소유하거나 자유롭게 배포되는 소프트웨어만 실행하세요. 파일은 브라우저에서 처리되며 서버로 전송되지 않습니다.',
        loading: 'MSX 부팅 중...',
        loadingTip: '미디어는 호스트에서 다운로드됩니다. 첫 로드는 시간이 걸릴 수 있습니다',
        instructions: '사용 방법',
        controlsTitle: '조작 방법',
        controlsHint1: '방향키 = 커서 키, Z 또는 Space = SPACE 키, X = ESC/STOP, Enter = RETURN',
        controlsHint2: '먼저 에뮬레이터 내부를 클릭해 키보드 포커스를 주고, F1로 WebMSX 메뉴를 열 수 있습니다',
        aboutTitle: '소개',
        aboutHint: 'MSX: Z80 기반 8비트 홈 컴퓨터 표준(MSX1/2/2+/turbo R), ASCII & Microsoft, 1983. ppeccin의 WebMSX를 핫링크로 제공.',
        playing: '실행 중: ',
        fullscreen: '전체 화면',
        loadFailed: '미디어를 불러오지 못했습니다. URL을 확인하거나 나중에 다시 시도하세요',
        invalidFile: '.rom / .dsk / .cas / .zip 이미지를 선택하세요',
        blobHint: '로컬 파일은 브라우저 메모리를 통해 로드되며 업로드되지 않습니다'
    },
    fr: {
        pageTitle: 'MSX',
        reset: 'Réinitialiser',
        tabPreset: 'Homebrew en vedette',
        tabUrl: 'URL du média',
        tabFile: 'Fichier local',
        presetTitle: 'Jeux homebrew MSX',
        presetDesc: "Jeux MSX gratuits/libres en vedette, chargés depuis la release GitHub officielle de chaque auteur dans l'émulateur WebMSX (intégré par lien direct). Les ROM commerciales ne sont pas incluses - utilisez vos propres fichiers légalement sauvegardés.",
        urlTitle: "Charger un média depuis une URL",
        urlDesc: "Saisissez l'URL directe d'une image ROM (.rom), disque (.dsk/.zip) ou cassette (.cas) - format détecté automatiquement",
        urlPlaceholder: 'https://example.com/game.rom',
        loadMedia: 'Charger le média',
        urlTip: "Astuce : le serveur de fichiers doit autoriser l'accès cross-origin (CORS). Les liens GitHub raw et release fonctionnent.",
        uploadTitle: 'Lire un média local',
        uploadDesc: "Sélectionnez votre propre image ROM (.rom), disque (.dsk/.zip) ou cassette (.cas)",
        uploadSelect: 'Sélectionner un fichier',
        uploadHint: "N'exécutez que des logiciels dont vous possédez les droits ou librement distribués. Le fichier reste dans votre navigateur - rien n'est envoyé à un serveur.",
        loading: 'Démarrage du MSX, veuillez patienter...',
        loadingTip: "Le média est téléchargé depuis son hôte ; le premier chargement peut prendre du temps",
        instructions: 'Instructions',
        controlsTitle: 'Commandes',
        controlsHint1: 'Flèches = touches curseur, Z ou Espace = touche SPACE, X = ESC/STOP, Entrée = RETURN',
        controlsHint2: "Cliquez d'abord dans l'émulateur pour qu'il capte le clavier ; F1 ouvre le menu WebMSX",
        aboutTitle: 'À propos',
        aboutHint: "MSX : standard d'ordinateur familial 8 bits à base de Z80 (MSX1/2/2+/turbo R) par ASCII & Microsoft, 1983. Émulation via WebMSX de ppeccin, intégré par lien direct.",
        playing: 'En cours : ',
        fullscreen: 'Plein écran',
        loadFailed: "Impossible de charger ce média - vérifiez l'URL ou réessayez plus tard",
        invalidFile: "Veuillez sélectionner une image .rom / .dsk / .cas / .zip",
        blobHint: "Les fichiers locaux sont chargés via la mémoire du navigateur, jamais téléversés"
    },
    de: {
        pageTitle: 'MSX',
        reset: 'Zurücksetzen',
        tabPreset: 'Empfohlene Homebrew',
        tabUrl: 'Medien-URL',
        tabFile: 'Lokale Datei',
        presetTitle: 'MSX-Homebrew-Spiele',
        presetDesc: 'Ausgewählte kostenlose/Open-Source-MSX-Spiele, geladen aus der offiziellen GitHub-Release jedes Autors in den WebMSX-Emulator (per Hotlink eingebettet). Kommerzielle ROMs sind nicht enthalten - verwenden Sie Ihre eigenen legal erstellten Sicherungen.',
        urlTitle: 'Medium von URL laden',
        urlDesc: 'Geben Sie die direkte URL eines ROM- (.rom), Disketten- (.dsk/.zip) oder Kassetten- (.cas) Abbilds ein - Format wird automatisch erkannt',
        urlPlaceholder: 'https://example.com/game.rom',
        loadMedia: 'Medium laden',
        urlTip: 'Tipp: Der Dateiserver muss Cross-Origin-Zugriff (CORS) erlauben. GitHub-Raw- und Release-Links funktionieren.',
        uploadTitle: 'Lokale Mediendatei abspielen',
        uploadDesc: 'Wählen Sie Ihr eigenes ROM- (.rom), Disketten- (.dsk/.zip) oder Kassetten- (.cas) Abbild',
        uploadSelect: 'Datei auswählen',
        uploadHint: 'Führen Sie nur Software aus, die Sie besitzen oder die frei verteilt wird. Die Datei bleibt im Browser - nichts wird auf einen Server hochgeladen.',
        loading: 'MSX wird gestartet, bitte warten...',
        loadingTip: 'Die Datei wird vom Host heruntergeladen; das erste Laden kann dauern',
        instructions: 'Anleitung',
        controlsTitle: 'Steuerung',
        controlsHint1: 'Pfeiltasten = Cursortasten, Z oder Leertaste = SPACE, X = ESC/STOP, Enter = RETURN',
        controlsHint2: 'Klicken Sie zuerst in den Emulator, damit er die Tastatur erfasst; F1 öffnet das WebMSX-Menü',
        aboutTitle: 'Über',
        aboutHint: 'MSX: Z80-basierter 8-Bit-Heimcomputer-Standard (MSX1/2/2+/turbo R) von ASCII & Microsoft, 1983. Emulation via WebMSX von ppeccin, per Hotlink eingebettet.',
        playing: 'Läuft: ',
        fullscreen: 'Vollbild',
        loadFailed: 'Medium konnte nicht geladen werden - URL prüfen oder später erneut versuchen',
        invalidFile: 'Bitte ein .rom / .dsk / .cas / .zip-Abbild auswählen',
        blobHint: 'Lokale Dateien werden über den Browserspeicher geladen, nie hochgeladen'
    },
    es: {
        pageTitle: 'MSX',
        reset: 'Reiniciar',
        tabPreset: 'Homebrew destacados',
        tabUrl: 'URL del medio',
        tabFile: 'Archivo local',
        presetTitle: 'Juegos homebrew de MSX',
        presetDesc: "Juegos MSX gratuitos/libres destacados, cargados desde el release oficial de GitHub de cada autor en el emulador WebMSX (incrustado por enlace directo). No se incluyen ROM comerciales - usa tus propios archivos volcados legalmente.",
        urlTitle: 'Cargar un medio desde URL',
        urlDesc: 'Introduce la URL directa de una imagen ROM (.rom), disco (.dsk/.zip) o cinta (.cas) - el formato se detecta automáticamente',
        urlPlaceholder: 'https://example.com/game.rom',
        loadMedia: 'Cargar medio',
        urlTip: 'Consejo: el servidor de archivos debe permitir acceso cross-origin (CORS). Los enlaces raw y release de GitHub funcionan.',
        uploadTitle: 'Reproducir un medio local',
        uploadDesc: 'Selecciona tu propia imagen ROM (.rom), disco (.dsk/.zip) o cinta (.cas)',
        uploadSelect: 'Seleccionar archivo',
        uploadHint: 'Ejecuta solo software que poseas o que se distribuya libremente. El archivo permanece en tu navegador - nada se sube a ningún servidor.',
        loading: 'Iniciando MSX, espera...',
        loadingTip: "El medio se descarga de su servidor; la primera carga puede tardar",
        instructions: 'Instrucciones',
        controlsTitle: 'Controles',
        controlsHint1: 'Flechas = teclas de cursor, Z o Espacio = tecla SPACE, X = ESC/STOP, Enter = RETURN',
        controlsHint2: 'Haz clic primero dentro del emulador para que capture el teclado; F1 abre el menú de WebMSX',
        aboutTitle: 'Acerca de',
        aboutHint: 'MSX: estándar de ordenador doméstico de 8 bits basado en Z80 (MSX1/2/2+/turbo R) por ASCII y Microsoft, 1983. Emulación vía WebMSX de ppeccin, incrustado por enlace directo.',
        playing: 'Ejecutando: ',
        fullscreen: 'Pantalla completa',
        loadFailed: 'No se pudo cargar ese medio - comprueba la URL o inténtalo más tarde',
        invalidFile: 'Selecciona una imagen .rom / .dsk / .cas / .zip',
        blobHint: 'Los archivos locales se cargan por memoria del navegador, nunca se suben'
    },
    ru: {
        pageTitle: 'MSX',
        reset: 'Сброс',
        tabPreset: 'Избранные homebrew',
        tabUrl: 'URL медиа',
        tabFile: 'Локальный файл',
        presetTitle: 'Homebrew-игры MSX',
        presetDesc: 'Избранные бесплатные/открытые игры MSX, загружаемые из официального GitHub-релиза каждого автора в эмулятор WebMSX (встраивание горячей ссылкой). Коммерческие ROM не включены - используйте свои легально снятые образы.',
        urlTitle: 'Загрузить медиа по URL',
        urlDesc: 'Введите прямой URL образа ROM (.rom), дискеты (.dsk/.zip) или кассеты (.cas) - формат определяется автоматически',
        urlPlaceholder: 'https://example.com/game.rom',
        loadMedia: 'Загрузить медиа',
        urlTip: 'Совет: файловый сервер должен разрешать кросс-доменный доступ (CORS). Ссылки GitHub raw и release работают.',
        uploadTitle: 'Запустить локальный файл',
        uploadDesc: 'Выберите свой образ ROM (.rom), дискеты (.dsk/.zip) или кассеты (.cas)',
        uploadSelect: 'Выбрать файл',
        uploadHint: 'Запускайте только программы, которыми владеете или которые свободно распространяются. Файл остаётся в браузере - ничего не загружается на сервер.',
        loading: 'MSX загружается, подождите...',
        loadingTip: 'Медиа скачивается с сервера автора; первая загрузка может занять время',
        instructions: 'Инструкция',
        controlsTitle: 'Управление',
        controlsHint1: 'Стрелки = клавиши курсора, Z или Пробел = клавиша SPACE, X = ESC/STOP, Enter = RETURN',
        controlsHint2: 'Сначала кликните внутри эмулятора, чтобы он получил клавиатуру; F1 открывает меню WebMSX',
        aboutTitle: 'О консоли',
        aboutHint: 'MSX: стандарт 8-битного домашнего компьютера на базе Z80 (MSX1/2/2+/turbo R) от ASCII и Microsoft, 1983. Эмуляция через WebMSX (ppeccin), встраивание горячей ссылкой.',
        playing: 'Запущено: ',
        fullscreen: 'Полный экран',
        loadFailed: 'Не удалось загрузить медиа - проверьте URL или попробуйте позже',
        invalidFile: 'Выберите образ .rom / .dsk / .cas / .zip',
        blobHint: 'Локальные файлы загружаются через память браузера, никуда не отправляются'
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
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-placeholder');
        if (i18n[currentLang] && i18n[currentLang][key]) el.setAttribute('placeholder', i18n[currentLang][key]);
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

// ---- tab switching -----------------------------------------------------
var TAB_BOXES = { preset: 'presetBox', url: 'urlBox', file: 'uploadBox' };
function switchTab(tab) {
    document.querySelectorAll('.upload-tab').forEach(function (el) {
        el.classList.toggle('active', el.getAttribute('data-tab') === tab);
    });
    Object.keys(TAB_BOXES).forEach(function (key) {
        var box = $(TAB_BOXES[key]);
        if (box) box.classList.toggle('hidden', key !== tab);
    });
}
document.querySelectorAll('.upload-tab').forEach(function (el) {
    el.addEventListener('click', function () { switchTab(el.getAttribute('data-tab')); });
});

// ---- preset list -------------------------------------------------------
function buildPresetList() {
    var list = $('presetList');
    if (!list) return;
    list.innerHTML = '';
    PRESETS.forEach(function (p, idx) {
        var item = document.createElement('div');
        item.className = 'preset-item';
        var icon = document.createElement('i');
        icon.className = 'fas fa-microchip pi-icon';
        var textWrap = document.createElement('div');
        textWrap.className = 'pi-text';
        var name = document.createElement('div');
        name.className = 'pi-name';
        name.textContent = p.name;
        var desc = document.createElement('div');
        desc.className = 'pi-desc';
        desc.textContent = p.desc;
        textWrap.appendChild(name);
        textWrap.appendChild(desc);
        item.appendChild(icon);
        item.appendChild(textWrap);
        item.addEventListener('click', function () { playPreset(idx); });
        list.appendChild(item);
    });
}

function playPreset(idx) {
    var p = PRESETS[idx];
    if (!p) return;
    playMedia(p.url, p.name, p.type, p.machine);
}

// ---- player ------------------------------------------------------------
var currentMsxUrl = WEBMSX_BASE;
var player = HotlinkPlayer.createPlayer({
    frameId: 'msxFrame', overlayId: 'loadingOverlay',
    url: function () { return currentMsxUrl; },
    newTabUrl: function () { return WEBMSX_BASE; }
});

// Build a WebMSX launch URL: ROM= (cartridge short form), DISK=, TAPE=,
// optional MACHINE= (e.g. tRJ for Japanese turbo R).
function buildWebMsxUrl(mediaUrl, type, machine) {
    var param = type === 'disk' ? 'DISK' : type === 'tape' ? 'TAPE' : 'ROM';
    var url = WEBMSX_BASE + '?' + param + '=' + encodeURIComponent(mediaUrl);
    if (machine) url += '&MACHINE=' + encodeURIComponent(machine);
    return url;
}

function showPlayer(title) {
    document.getElementById('uploadSection').classList.add('hidden');
    document.getElementById('playerSection').classList.add('active');
    document.getElementById('pageTitle').textContent = t('playing') + (title || 'MSX');
    document.getElementById('resetBtn').style.display = '';
    document.getElementById('fullscreenBtn').style.display = '';
}

function playMedia(mediaUrl, title, type, machine) {
    if (!document.getElementById('msxFrame')) return;
    showPlayer(title);
    currentMsxUrl = buildWebMsxUrl(mediaUrl, type, machine);
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

// Guess WebMSX media type from URL/file extension
function detectMediaType(name) {
    var n = (name || '').toLowerCase();
    if (/\.rom(\?|$)/.test(n) || /\.bin(\?|$)/.test(n)) return 'rom';
    if (/\.dsk(\?|$)/.test(n) || /\.zip(\?|$)/.test(n) || /\.gz(\?|$)/.test(n)) return 'disk';
    if (/\.cas(\?|$)/.test(n)) return 'tape';
    return null;
}

// ---- URL tab -----------------------------------------------------------
document.getElementById('urlLoadBtn').addEventListener('click', function () {
    var input = document.getElementById('mediaUrlInput');
    var url = (input.value || '').trim();
    if (!url) return;
    var errBox = document.getElementById('urlLoadError');
    if (errBox) errBox.classList.add('hidden');
    var type = detectMediaType(url);
    if (type) {
        playMedia(url, '', type, '');
        return;
    }
    // Unknown extension: use WebMSX AUTODETECT param
    showPlayer('MSX');
    currentMsxUrl = WEBMSX_BASE + '?AUTO=' + encodeURIComponent(url);
    player.start();
});

// ---- file tab ----------------------------------------------------------
document.getElementById('uploadBtn').addEventListener('click', function () {
    document.getElementById('mediaInput').click();
});
document.getElementById('mediaInput').addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!/\.(rom|bin|dsk|cas|zip|gz)$/i.test(file.name)) { showToast(t('invalidFile')); return; }
    var type = detectMediaType(file.name);
    var objectUrl = URL.createObjectURL(file);
    playMedia(objectUrl, file.name, type || 'rom', '');
});

// ---- back / reset ------------------------------------------------------
document.getElementById('backBtn').addEventListener('click', function () {
    var playerSection = document.getElementById('playerSection');
    if (playerSection.classList.contains('active')) { stopPlayback(); return; }
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
// The upstream app does not ship its own fullscreen control, so the host
// page requests fullscreen on the iframe itself (allowed via allowfullscreen).
document.getElementById('fullscreenBtn').addEventListener('click', function () {
    var frame = document.getElementById('msxFrame');
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
buildPresetList();
