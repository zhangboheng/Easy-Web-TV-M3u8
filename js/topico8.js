// PICO-8 Page JavaScript - featured web builds played via each author's
// official host (itch.io embeds etc). PICO-8 itself is a paid, closed-source
// fantasy console by Lexaloffle and is NOT bundled here; see the About panel.

// Featured games - every entry verified reachable and iframe-friendly.
// "page"  = the author's store/info page (also used as Open Standalone)
// "embed" = itch.io's official embed widget for that upload (bypasses the
//           itch.zone hotlink protection; widget wraps the real play frame)
var PRESETS = [
    {
        name: 'POOM',
        desc: 'DOOM demake - freds72 & Paranoid Cactus (free, itch.io)',
        page: 'https://freds72.itch.io/poom',
        embed: 'https://itch.io/embed-upload/7204900?color=333333'
    },
    {
        name: 'Dank Tomb',
        desc: 'Dungeon crawler - Jakub Wasilewski (free, itch.io)',
        page: 'https://krajzeg.itch.io/dank-tomb',
        embed: 'https://itch.io/embed-upload/553564?color=333333'
    },
    {
        name: 'Ascent',
        desc: 'Platformer - Johan Peitz (free, itch.io)',
        page: 'https://johanpeitz.itch.io/ascent',
        embed: 'https://itch.io/embed-upload/6414077?color=333333'
    },
    {
        name: 'PICO Sonic',
        desc: 'Sonic-style platformer - komehara (free, itch.io)',
        page: 'https://komehara.itch.io/pico-sonic',
        embed: 'https://itch.io/embed-upload/3206704?color=333333'
    },
    {
        name: 'Manbomber',
        desc: '1-4 player bomber - fresh-d (free, itch.io)',
        page: 'https://fresh-d.itch.io/manbomber',
        embed: 'https://itch.io/embed-upload/3193778?color=333333'
    }
];

// Internationalization (same language set as towasm4.js)
var i18n = {
    zh: {
        pageTitle: 'PICO-8',
        reset: '重置',
        tabPreset: '精选游戏',
        tabUrl: 'Web 构建 URL',
        tabFile: '本地构建',
        presetTitle: 'PICO-8 网页游戏',
        presetDesc: '精选免费 PICO-8 游戏，通过作者官方 Web 构建游玩。PICO-8 本体是 Lexaloffle 的付费幻想主机，此处不包含；购买后可导出你自己的构建。',
        urlTitle: '从 URL 加载 Web 构建',
        urlDesc: '输入导出的 PICO-8 HTML 构建（index.html）或 itch.io 游戏页地址',
        urlPlaceholder: 'https://example.itch.io/my-game',
        loadBuild: '开始游戏',
        urlTip: '提示：itch.io 游戏页会自动解析官方嵌入地址。',
        uploadTitle: '播放本地 Web 构建',
        uploadDesc: '选择你用自己的 PICO-8 许可导出的 index.html',
        uploadSelect: '选择 index.html',
        uploadHint: 'PICO-8 是 Lexaloffle 的付费幻想主机（$14.99），此处不包含——购买后即可制作并导出自己的游戏。多文件导出请通过 URL 标签加载（需托管）。',
        loading: '游戏加载中，请稍候...',
        loadingTip: 'Web 构建来自作者的服务器，首次加载可能较慢',
        loadingSlow: '加载较慢，请耐心等待；也可以右键画面在新标签打开',
        instructions: '使用说明',
        controlsTitle: '操作方式',
        controlsHint1: '方向键 / WASD = 十字键，Z 和 X（或 C / V）= O 与 X 动作键',
        controlsHint2: '先点击游戏画面让其获得键盘焦点',
        aboutTitle: '关于',
        aboutHint: 'PICO-8：128×128 像素、16 色、P8 Lua、32K 卡带——Lexaloffle 出品的付费闭源幻想主机',
        playing: '正在播放：',
        loadFailed: '无法加载该构建，请检查地址或稍后重试',
        invalidFile: '请选择导出构建的 index.html 文件',
        fileProtocolHint: '请通过 HTTP 服务器访问本页（file:// 直开无法解析 itch 游戏页）'
    },
    en: {
        pageTitle: 'PICO-8',
        reset: 'Reset',
        tabPreset: 'Featured Games',
        tabUrl: 'Web Build URL',
        tabFile: 'Local Build',
        presetTitle: 'PICO-8 Web Games',
        presetDesc: "Featured free PICO-8 games, played via each author's official web build. PICO-8 itself is a paid fantasy console by Lexaloffle and is not bundled here; buy it to export your own builds.",
        urlTitle: 'Load a Web Build from URL',
        urlDesc: 'Enter the URL of an exported PICO-8 HTML build (index.html) or an itch.io game page',
        urlPlaceholder: 'https://example.itch.io/my-game',
        loadBuild: 'Play Build',
        urlTip: 'Tip: for an itch.io game page this resolves the official embed URL automatically.',
        uploadTitle: 'Play a Local Web Build',
        uploadDesc: 'Select the index.html of a PICO-8 HTML export you made with your own PICO-8 license',
        uploadSelect: 'Select index.html',
        uploadHint: 'PICO-8 is a paid fantasy console by Lexaloffle ($14.99). It is not bundled here - buy it to make and export your own games. Multi-file exports only work via the URL tab (hosted builds).',
        loading: 'Loading game, please wait...',
        loadingTip: "The web build streams from the author's host; first load can take a while",
        loadingSlow: 'Still loading - please wait a bit longer, or right-click the frame to open it in a new tab',
        instructions: 'Instructions',
        controlsTitle: 'Controls',
        controlsHint1: 'Arrow keys / WASD = D-pad, Z and X / C and V = O and X action buttons',
        controlsHint2: 'Click inside the game frame first so it captures the keyboard',
        aboutTitle: 'About',
        aboutHint: 'PICO-8: 128x128 pixels, 16 colours, P8 Lua, 32k carts - a fantasy console by Lexaloffle (paid, closed source)',
        playing: 'Now playing: ',
        loadFailed: 'Failed to load that build - check the URL or try again later',
        invalidFile: 'Please select the index.html of an exported build',
        fileProtocolHint: 'Please open this page through an HTTP server (file:// cannot resolve itch game pages)'
    },
    ja: {
        pageTitle: 'PICO-8',
        reset: 'リセット',
        tabPreset: 'おすすめゲーム',
        tabUrl: 'WebビルドURL',
        tabFile: 'ローカルビルド',
        presetTitle: 'PICO-8 ウェブゲーム',
        presetDesc: "無料のPICO-8ゲームを、各作者の公式Webビルドで遊べます。PICO-8本体はLexaloffleの有料ファンタジーコンソールであり、ここには含まれていません。購入すれば自分のビルドを書き出せます。",
        urlTitle: 'WebビルドをURLから読み込む',
        urlDesc: '書き出されたPICO-8 HTMLビルド（index.html）またはitch.ioゲームページのURLを入力',
        urlPlaceholder: 'https://example.itch.io/my-game',
        loadBuild: 'ビルドを再生',
        urlTip: 'ヒント：itch.ioのゲームページなら公式埋め込みURLを自動解決します。',
        uploadTitle: 'ローカルWebビルドを再生',
        uploadDesc: '自分のPICO-8ライセンスで書き出したindex.htmlを選択してください',
        uploadSelect: 'index.html を選択',
        uploadHint: 'PICO-8はLexaloffleの有料ファンタジーコンソール（$14.99）です。ここには含まれません。購入して自分のゲームを作成・書き出してください。複数ファイルのビルドはURLタブ（ホスト必要）でのみ動作します。',
        loading: 'ゲームを読み込み中...',
        loadingTip: 'Webビルドは作者のサーバーから配信されます。初回は時間がかかることがあります',
        loadingSlow: '読み込みが遅い場合はそのままお待ちいただくか、フレームを右クリックして新しいタブで開いてください',
        instructions: '使い方',
        controlsTitle: '操作方法',
        controlsHint1: '矢印キー / WASD = 十字キー、Z と X（C / V）= O と X アクションボタン',
        controlsHint2: '先にゲーム画面内をクリックしてキーボードフォーカスを合わせてください',
        aboutTitle: 'PICO-8 について',
        aboutHint: 'PICO-8：128x128ピクセル、16色、P8 Lua、32Kカートリッジ——Lexaloffleによる有料クローズドソースのファンタジーコンソール',
        playing: '再生中：',
        loadFailed: 'そのビルドを読み込めませんでした。URLを確認するか後でお試しください',
        invalidFile: '書き出したビルドの index.html を選択してください',
        fileProtocolHint: 'このページはHTTPサーバー経由で開いてください（file://ではitchページを解決できません）'
    },
    ko: {
        pageTitle: 'PICO-8',
        reset: '재설정',
        tabPreset: '추천 게임',
        tabUrl: '웹 빌드 URL',
        tabFile: '로컬 빌드',
        presetTitle: 'PICO-8 웹 게임',
        presetDesc: '무료 PICO-8 게임을 각 작성자의 공식 웹 빌드로 즐겨보세요. PICO-8 본체는 Lexaloffle의 유료 판타지 콘솔이며 여기에 포함되지 않습니다. 구매하면 자신의 빌드를 내보낼 수 있습니다.',
        urlTitle: 'URL에서 웹 빌드 불러오기',
        urlDesc: '내보낸 PICO-8 HTML 빌드(index.html) 또는 itch.io 게임 페이지 URL을 입력하세요',
        urlPlaceholder: 'https://example.itch.io/my-game',
        loadBuild: '빌드 실행',
        urlTip: '팁: itch.io 게임 페이지는 공식 임베드 URL을 자동으로 찾아냅니다.',
        uploadTitle: '로컬 웹 빌드 실행',
        uploadDesc: '자신의 PICO-8 라이선스로 내보낸 index.html을 선택하세요',
        uploadSelect: 'index.html 선택',
        uploadHint: 'PICO-8은 Lexaloffle의 유료 판타지 콘솔($14.99)이며 여기에 포함되지 않습니다. 구매하면 자신의 게임을 만들고 내보낼 수 있습니다. 다중 파일 빌드는 URL 탭(호스팅 필요)에서만 동작합니다.',
        loading: '게임을 불러오는 중...',
        loadingTip: '웹 빌드는 작성자의 서버에서 스트리밍됩니다. 첫 로드는 시간이 걸릴 수 있습니다',
        loadingSlow: '로딩이 느리면 조금 더 기다리거나 프레임을 우클릭해 새 탭에서 여세요',
        instructions: '사용 방법',
        controlsTitle: '조작 방법',
        controlsHint1: '방향키 / WASD = D-pad, Z와 X (C / V) = O와 X 액션 버튼',
        controlsHint2: '먼저 게임 프레임 내부를 클릭해 키보드 포커스를 주세요',
        aboutTitle: '소개',
        aboutHint: 'PICO-8: 128x128 픽셀, 16색, P8 Lua, 32K 카트리지 - Lexaloffle의 유료 클로즈드소스 판타지 콘솔',
        playing: '재생 중: ',
        loadFailed: '빌드를 불러오지 못했습니다. URL을 확인하거나 나중에 다시 시도하세요',
        invalidFile: '내보낸 빌드의 index.html을 선택하세요',
        fileProtocolHint: '이 페이지는 HTTP 서버를 통해 열어주세요 (file://에서는 itch 페이지를 확인할 수 없습니다)'
    },
    fr: {
        pageTitle: 'PICO-8',
        reset: 'Réinitialiser',
        tabPreset: 'Jeux en vedette',
        tabUrl: 'URL de build web',
        tabFile: 'Build local',
        presetTitle: 'Jeux web PICO-8',
        presetDesc: "Jeux PICO-8 gratuits en vedette, joués via le build web officiel de chaque auteur. PICO-8 lui-même est une console fantasy payante de Lexaloffle, non incluse ici ; achetez-la pour exporter vos propres builds.",
        urlTitle: "Charger un build web depuis une URL",
        urlDesc: "Saisissez l'URL d'un build HTML PICO-8 exporté (index.html) ou d'une page de jeu itch.io",
        urlPlaceholder: 'https://example.itch.io/my-game',
        loadBuild: 'Lire le build',
        urlTip: "Astuce : pour une page de jeu itch.io, l'URL d'intégration officielle est résolue automatiquement.",
        uploadTitle: 'Lire un build web local',
        uploadDesc: "Sélectionnez l'index.html d'un export PICO-8 réalisé avec votre propre licence",
        uploadSelect: 'Sélectionner index.html',
        uploadHint: "PICO-8 est une console fantasy payante de Lexaloffle (14,99 $). Elle n'est pas incluse ici - achetez-la pour créer et exporter vos jeux. Les builds multi-fichiers ne fonctionnent que via l'onglet URL (hébergement requis).",
        loading: 'Chargement du jeu, veuillez patienter...',
        loadingTip: "Le build web est diffusé depuis le serveur de l'auteur ; le premier chargement peut prendre du temps",
        loadingSlow: "Chargement lent - patientez encore un peu, ou faites un clic droit sur le cadre pour l'ouvrir dans un nouvel onglet",
        instructions: 'Instructions',
        controlsTitle: 'Commandes',
        controlsHint1: 'Flèches / WASD = croix directionnelle, Z et X (C / V) = boutons O et X',
        controlsHint2: "Cliquez d'abord dans le cadre du jeu pour qu'il capte le clavier",
        aboutTitle: 'À propos',
        aboutHint: 'PICO-8 : 128x128 pixels, 16 couleurs, P8 Lua, cartouches 32k - une console fantasy de Lexaloffle (payante, closed source)',
        playing: 'Lecture : ',
        loadFailed: "Impossible de charger ce build - vérifiez l'URL ou réessayez plus tard",
        invalidFile: "Veuillez sélectionner l'index.html d'un build exporté",
        fileProtocolHint: "Veuillez ouvrir cette page via un serveur HTTP (file:// ne peut pas résoudre les pages itch)"
    },
    de: {
        pageTitle: 'PICO-8',
        reset: 'Zurücksetzen',
        tabPreset: 'Empfohlene Spiele',
        tabUrl: 'Web-Build-URL',
        tabFile: 'Lokaler Build',
        presetTitle: 'PICO-8 Web-Spiele',
        presetDesc: 'Ausgewählte kostenlose PICO-8-Spiele, gespielt über den offiziellen Web-Build der jeweiligen Autoren. PICO-8 selbst ist eine kostenpflichtige Fantasy-Konsole von Lexaloffle und nicht enthalten; kaufen Sie sie, um eigene Builds zu exportieren.',
        urlTitle: 'Web-Build von URL laden',
        urlDesc: 'Geben Sie die URL eines exportierten PICO-8-HTML-Builds (index.html) oder einer itch.io-Spielseite ein',
        urlPlaceholder: 'https://example.itch.io/my-game',
        loadBuild: 'Build starten',
        urlTip: 'Tipp: Bei einer itch.io-Spielseite wird die offizielle Embed-URL automatisch aufgelöst.',
        uploadTitle: 'Lokalen Web-Build spielen',
        uploadDesc: 'Wählen Sie die index.html eines PICO-8-HTML-Exports aus, den Sie mit Ihrer eigenen Lizenz erstellt haben',
        uploadSelect: 'index.html auswählen',
        uploadHint: 'PICO-8 ist eine kostenpflichtige Fantasy-Konsole von Lexaloffle (14,99 $). Sie ist hier nicht enthalten - kaufen Sie sie, um eigene Spiele zu erstellen und zu exportieren. Multi-Datei-Builds funktionieren nur über den URL-Tab (Hosting erforderlich).',
        loading: 'Spiel wird geladen, bitte warten...',
        loadingTip: 'Der Web-Build wird vom Server des Autors gestreamt; das erste Laden kann dauern',
        loadingSlow: 'Laden dauert länger - bitte noch etwas warten, oder per Rechtsklick den Rahmen in einem neuen Tab öffnen',
        instructions: 'Anleitung',
        controlsTitle: 'Steuerung',
        controlsHint1: 'Pfeiltasten / WASD = D-Pad, Z und X (C / V) = O- und X-Action-Tasten',
        controlsHint2: 'Klicken Sie zuerst in den Spielrahmen, damit er die Tastatur erfasst',
        aboutTitle: 'Über',
        aboutHint: 'PICO-8: 128x128 Pixel, 16 Farben, P8 Lua, 32k-Cartridges - eine Fantasy-Konsole von Lexaloffle (kostenpflichtig, closed source)',
        playing: 'Läuft: ',
        loadFailed: 'Build konnte nicht geladen werden - URL prüfen oder später erneut versuchen',
        invalidFile: 'Bitte die index.html eines exportierten Builds auswählen',
        fileProtocolHint: 'Bitte diese Seite über einen HTTP-Server öffnen (file:// kann itch-Seiten nicht auflösen)'
    },
    es: {
        pageTitle: 'PICO-8',
        reset: 'Reiniciar',
        tabPreset: 'Juegos destacados',
        tabUrl: 'URL de build web',
        tabFile: 'Build local',
        presetTitle: 'Juegos web de PICO-8',
        presetDesc: "Juegos PICO-8 gratuitos destacados, jugados mediante el build web oficial de cada autor. PICO-8 en sí es una consola fantasy de pago de Lexaloffle y no se incluye aquí; cómprala para exportar tus propios builds.",
        urlTitle: 'Cargar un build web desde URL',
        urlDesc: 'Introduce la URL de un build HTML de PICO-8 exportado (index.html) o de una página de juego de itch.io',
        urlPlaceholder: 'https://example.itch.io/my-game',
        loadBuild: 'Jugar build',
        urlTip: 'Consejo: para una página de juego de itch.io se resuelve automáticamente la URL oficial de inserción.',
        uploadTitle: 'Jugar un build web local',
        uploadDesc: 'Selecciona el index.html de una exportación PICO-8 que hayas hecho con tu propia licencia',
        uploadSelect: 'Seleccionar index.html',
        uploadHint: 'PICO-8 es una consola fantasy de pago de Lexaloffle ($14.99). No se incluye aquí - cómprala para crear y exportar tus propios juegos. Los builds multiarchivo solo funcionan desde la pestaña URL (requieren hosting).',
        loading: 'Cargando el juego, espera...',
        loadingTip: "El build web se transmite desde el servidor del autor; la primera carga puede tardar",
        loadingSlow: 'Carga lenta: espera un poco más, o haz clic derecho en el marco para abrirlo en una pestaña nueva',
        instructions: 'Instrucciones',
        controlsTitle: 'Controles',
        controlsHint1: 'Flechas / WASD = cruceta, Z y X (C / V) = botones de acción O y X',
        controlsHint2: 'Haz clic primero dentro del marco del juego para que capture el teclado',
        aboutTitle: 'Acerca de',
        aboutHint: 'PICO-8: 128x128 píxeles, 16 colores, P8 Lua, cartuchos de 32k - una consola fantasy de Lexaloffle (de pago, código cerrado)',
        playing: 'Jugando: ',
        loadFailed: 'No se pudo cargar ese build - comprueba la URL o inténtalo más tarde',
        invalidFile: 'Selecciona el index.html de un build exportado',
        fileProtocolHint: 'Abre esta página a través de un servidor HTTP (file:// no puede resolver páginas de itch)'
    },
    ru: {
        pageTitle: 'PICO-8',
        reset: 'Сброс',
        tabPreset: 'Избранные игры',
        tabUrl: 'URL веб-сборки',
        tabFile: 'Локальная сборка',
        presetTitle: 'Веб-игры PICO-8',
        presetDesc: 'Избранные бесплатные игры PICO-8, запускаемые через официальную веб-сборку каждого автора. Сама PICO-8 — платная фантазийная консоль Lexaloffle и сюда не входит; купите её, чтобы экспортировать свои сборки.',
        urlTitle: 'Загрузить веб-сборку по URL',
        urlDesc: 'Введите URL экспортированной HTML-сборки PICO-8 (index.html) или страницы игры на itch.io',
        urlPlaceholder: 'https://example.itch.io/my-game',
        loadBuild: 'Запустить сборку',
        urlTip: 'Совет: для страницы игры на itch.io официальный URL встраивания находится автоматически.',
        uploadTitle: 'Запустить локальную веб-сборку',
        uploadDesc: 'Выберите index.html экспорта PICO-8, сделанного с вашей собственной лицензией',
        uploadSelect: 'Выбрать index.html',
        uploadHint: 'PICO-8 — платная фантазийная консоль Lexaloffle ($14.99). Она не входит сюда - купите её, чтобы создавать и экспортировать свои игры. Многофайловые сборки работают только через вкладку URL (нужен хостинг).',
        loading: 'Игра загружается, подождите...',
        loadingTip: 'Веб-сборка передаётся с сервера автора; первая загрузка может занять время',
        loadingSlow: 'Загрузка идёт медленно - подождите ещё немного или откройте кадр в новой вкладке правой кнопкой',
        instructions: 'Инструкция',
        controlsTitle: 'Управление',
        controlsHint1: 'Стрелки / WASD = крестовина, Z и X (C / V) = кнопки действий O и X',
        controlsHint2: 'Сначала кликните внутри игрового кадра, чтобы он получил клавиатуру',
        aboutTitle: 'О консоли',
        aboutHint: 'PICO-8: 128x128 пикселей, 16 цветов, P8 Lua, картриджи 32k - фантазийная консоль от Lexaloffle (платная, закрытый код)',
        playing: 'Запущено: ',
        loadFailed: 'Не удалось загрузить сборку - проверьте URL или попробуйте позже',
        invalidFile: 'Выберите index.html экспортированной сборки',
        fileProtocolHint: 'Откройте эту страницу через HTTP-сервер (file:// не может обработать страницы itch)'
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
        icon.className = 'fas fa-gamepad pi-icon';
        var textWrap = document.createElement('div');
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
    playUrl(p.embed, p.name);
}

// ---- player ------------------------------------------------------------
var slowTimer = null;
function hideOverlayAndTitle() {
    var overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.add('hidden');
    if (slowTimer) { clearTimeout(slowTimer); slowTimer = null; }
}

function playUrl(url, title) {
    var frame = document.getElementById('picoFrame');
    if (!frame) return;
    document.getElementById('uploadSection').classList.add('hidden');
    document.getElementById('playerSection').classList.add('active');
    document.getElementById('pageTitle').textContent = t('playing') + (title || 'PICO-8');
    document.getElementById('resetBtn').style.display = '';
    document.getElementById('loadingOverlay').classList.remove('hidden');
    frame.src = url;
    // Cross-origin iframe load events can be unreliable; hide the overlay
    // after 800ms (jsbeeb pattern) and show a slow-network hint at 15s.
    setTimeout(function () {
        if (frame.src.indexOf(url) !== -1) hideOverlayAndTitle();
    }, 800);
    slowTimer = setTimeout(function () {
        if (frame.src.indexOf(url) !== -1) showToast(t('loadingSlow'));
    }, 15000);
}

function stopPlayback() {
    var frame = document.getElementById('picoFrame');
    if (frame) frame.src = 'about:blank';
    hideOverlayAndTitle();
    document.getElementById('playerSection').classList.remove('active');
    document.getElementById('uploadSection').classList.remove('hidden');
    document.getElementById('pageTitle').textContent = t('pageTitle');
    document.getElementById('resetBtn').style.display = 'none';
}

// itch.io game page -> official embed widget URL (bypasses itch.zone
// hotlink protection by loading through itch.io's own embed-upload page)
function resolveItchEmbed(pageUrl, callback) {
    if (location.protocol === 'file:') { callback(null, t('fileProtocolHint')); return; }
    fetch(pageUrl)
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.text(); })
        .then(function (html) {
            var m = html.match(/html-classic\.itch\.zone\/html\/(\d+)/);
            callback(m ? 'https://itch.io/embed-upload/' + m[1] + '?color=333333' : null,
                     m ? null : t('loadFailed'));
        })
        .catch(function () { callback(null, t('loadFailed')); });
}

// ---- URL tab -----------------------------------------------------------
document.getElementById('urlLoadBtn').addEventListener('click', function () {
    var input = document.getElementById('buildUrlInput');
    var url = (input.value || '').trim();
    if (!url) return;
    var errBox = document.getElementById('urlLoadError');
    if (errBox) errBox.classList.add('hidden');
    // itch.io game page: resolve the official play URL first
    if (/^https:\/\/[a-z0-9-]+\.itch\.io\/[a-z0-9-]+\/?$/i.test(url)) {
        showToast('itch.io ...');
        resolveItchEmbed(url, function (embedUrl, err) {
            if (embedUrl) { playUrl(embedUrl, url.split('/').pop()); }
            else { showToast(err || t('loadFailed')); }
        });
        return;
    }
    playUrl(url, '');
});

// ---- file tab ----------------------------------------------------------
document.getElementById('uploadBtn').addEventListener('click', function () {
    document.getElementById('buildInput').click();
});
document.getElementById('buildInput').addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!/\.html?$/i.test(file.name)) { showToast(t('invalidFile')); return; }
    // Single-file HTML export only: render it into the iframe via blob URL.
    // (Multi-file PICO-8 exports reference js/png assets -> use URL tab.)
    var reader = new FileReader();
    reader.onload = function () {
        playUrl(URL.createObjectURL(new Blob([reader.result], { type: 'text/html' })), file.name);
    };
    reader.readAsText(file);
});

// ---- back / reset ------------------------------------------------------
document.getElementById('backBtn').addEventListener('click', function () {
    var playerSection = document.getElementById('playerSection');
    if (playerSection.classList.contains('active')) { stopPlayback(); return; }
    window.location.href = '../routes/game.html?category=fantasy';
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
buildPresetList();
