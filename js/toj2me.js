// J2ME Page JavaScript - J2meJS (GPL-2.0, by Rosabis) embedded by hotlink
// to the official GitHub Pages demo. No jars are bundled or hotlinked:
// users run their own jars via URL or local file.

var J2ME_BASE = 'https://rosabis.github.io/J2meJS/java/';

// Internationalization (8 languages, same key set as tomsx.js)
var i18n = {
    zh: {
        pageTitle: 'J2ME',
        reset: '重置',
        tabDemo: '官方 Demo',
        tabUrl: 'Jar URL',
        tabFile: '本地 Jar',
        demoTitle: 'J2ME 手机游戏',
        demoDesc: '通过 J2meJS（GPL-2.0，热链嵌入官方 Demo）在浏览器里运行 Java ME 功能机游戏。官方 Demo 收录了一批经典 MIDlet——打开即可选择游戏，或在下方加载你自己的 .jar。',
        demoOpen: '打开官方 Demo',
        demoHint: '托管在别处的商业 MIDlet 不在此热链——请运行你拥有版权或自由分发的 jar。',
        urlTitle: '从 URL 加载 Jar',
        urlDesc: '输入 .jar（Java ME MIDlet）文件的直链',
        urlPlaceholder: 'https://example.com/midlet.jar',
        loadJar: '运行 Jar',
        urlTip: '提示：文件服务器需允许跨域访问（CORS），GitHub raw 和 release 直链均可用。',
        uploadTitle: '运行本地 Jar',
        uploadDesc: '选择你自己的 Java ME .jar（MIDlet）文件',
        uploadSelect: '选择 .jar 文件',
        uploadHint: 'jar 仅在你的浏览器内处理，不会上传到任何服务器。请只运行你拥有版权或自由分发的软件。',
        loading: 'JVM 启动中，请稍候...',
        loadingTip: 'jar 从其服务器下载，首次加载可能较慢',
        loadingSlow: '加载较慢，请耐心等待；也可以在新标签页打开模拟器',
        instructions: '使用说明',
        controlsTitle: '操作方式',
        controlsHint1: '数字键 / 方向键映射为手机键盘，5 = 确认，支持 * 和 # 键',
        controlsHint2: '触屏设备会在模拟器内显示虚拟键盘',
        aboutTitle: '关于',
        aboutHint: 'J2ME：Java Platform, Micro Edition——2000 年代功能机游戏平台（MIDP 2.0）。模拟由 Rosabis 的 J2meJS（GPL-2.0）热链提供。',
        playing: '正在运行：',
        loadFailed: '无法加载该 jar，请检查地址或稍后重试',
        invalidFile: '请选择 .jar 文件'
    },
    en: {
        pageTitle: 'J2ME',
        reset: 'Reset',
        tabDemo: 'Official Demo',
        tabUrl: 'Jar URL',
        tabFile: 'Local Jar',
        demoTitle: 'J2ME Mobile Games',
        demoDesc: 'Run Java ME (J2ME) phone games in your browser with J2meJS (GPL-2.0, embedded by hotlink to the official demo). The official demo hosts a library of classic midlets - open it to pick a game, or load your own .jar below.',
        demoOpen: 'Open Official Demo',
        demoHint: 'Commercial midlets hosted elsewhere are not hotlinked here - run jars you own or that are freely distributed.',
        urlTitle: 'Load a Jar from URL',
        urlDesc: 'Enter the direct URL of a .jar (Java ME midlet) file',
        urlPlaceholder: 'https://example.com/midlet.jar',
        loadJar: 'Run Jar',
        urlTip: 'Tip: the file server must allow cross-origin access (CORS). GitHub raw and release links work.',
        uploadTitle: 'Run a Local Jar',
        uploadDesc: 'Select your own Java ME .jar (midlet) file',
        uploadSelect: 'Select .jar File',
        uploadHint: 'The jar stays in your browser - nothing is uploaded to any server. Run only software you own or that is freely distributed.',
        loading: 'Starting the JVM, please wait...',
        loadingTip: 'The jar downloads from its host; first load can take a while',
        loadingSlow: 'Still loading - please wait a bit longer, or open the emulator in a new tab',
        instructions: 'Instructions',
        controlsTitle: 'Controls',
        controlsHint1: 'Number keys / arrows map to the phone keypad; 5 = action, * and # are supported',
        controlsHint2: 'A virtual keypad appears inside the emulator for touch devices',
        aboutTitle: 'About',
        aboutHint: 'J2ME: Java Platform, Micro Edition - the platform of 2000s feature-phone games (MIDP 2.0). Emulation via J2meJS by Rosabis (GPL-2.0), embedded by hotlink.',
        playing: 'Now running: ',
        loadFailed: 'Failed to load that jar - check the URL or try again later',
        invalidFile: 'Please select a .jar file'
    },
    ja: {
        pageTitle: 'J2ME',
        reset: 'リセット',
        tabDemo: '公式デモ',
        tabUrl: 'Jar URL',
        tabFile: 'ローカル Jar',
        demoTitle: 'J2ME モバイルゲーム',
        demoDesc: 'J2meJS（GPL-2.0、公式デモへのホットリンク埋め込み）でブラウザ上でJava MEフィーチャーフォンのゲームを実行します。公式デモにはクラシックなMIDletのコレクションがあります。開いてゲームを選ぶか、下で自分の.jarを読み込んでください。',
        demoOpen: '公式デモを開く',
        demoHint: '他でホストされている商用MIDletはここではホットリンクしません。所有または自由に配布されているjarを実行してください。',
        urlTitle: 'URLからJarを読み込む',
        urlDesc: '.jar（Java ME MIDlet）ファイルの直接URLを入力してください',
        urlPlaceholder: 'https://example.com/midlet.jar',
        loadJar: 'Jarを実行',
        urlTip: 'ヒント：ファイルサーバーはクロスオリジンアクセス（CORS）を許可する必要があります。GitHubのraw・リリースリンクは利用可能です。',
        uploadTitle: 'ローカルJarを実行',
        uploadDesc: '自分のJava ME .jar（MIDlet）ファイルを選択してください',
        uploadSelect: '.jar ファイルを選択',
        uploadHint: 'jarはブラウザ内で処理され、サーバーには送信されません。所有または自由に配布されているソフトウェアのみ実行してください。',
        loading: 'JVMを起動中...',
        loadingTip: 'jarはホストからダウンロードされます。初回は時間がかかることがあります',
        loadingSlow: '読み込みが遅い場合はそのままお待ちいただくか、新しいタブでエミュレータを開いてください',
        instructions: '使い方',
        controlsTitle: '操作方法',
        controlsHint1: '数字キー/矢印キーがフィーチャーフォンのキーパッドに対応、5 = 決定、* と # も対応',
        controlsHint2: 'タッチデバイスではエミュレータ内にバーチャルキーパッドが表示されます',
        aboutTitle: 'J2ME について',
        aboutHint: 'J2ME：Java Platform, Micro Edition——2000年代のフィーチャーフォンゲームのプラットフォーム（MIDP 2.0）。エミュレーションはRosabisのJ2meJS（GPL-2.0）をホットリンクで提供。',
        playing: '実行中：',
        loadFailed: 'そのjarを読み込めませんでした。URLを確認するか後でお試しください',
        invalidFile: '.jar ファイルを選択してください'
    },
    ko: {
        pageTitle: 'J2ME',
        reset: '재설정',
        tabDemo: '공식 데모',
        tabUrl: 'Jar URL',
        tabFile: '로컬 Jar',
        demoTitle: 'J2ME 모바일 게임',
        demoDesc: 'J2meJS(GPL-2.0, 공식 데모 핫링크 임베드)로 브라우저에서 Java ME 피처폰 게임을 실행하세요. 공식 데모에는 클래식 MIDlet 모음이 있습니다 - 열어서 게임을 고르거나 아래에서 자신의 .jar를 불러오세요.',
        demoOpen: '공식 데모 열기',
        demoHint: '다른 곳에 호스팅된 상용 MIDlet은 여기서 핫링크하지 않습니다 - 소유하거나 자유롭게 배포되는 jar를 실행하세요.',
        urlTitle: 'URL에서 Jar 불러오기',
        urlDesc: '.jar(Java ME MIDlet) 파일의 직접 URL을 입력하세요',
        urlPlaceholder: 'https://example.com/midlet.jar',
        loadJar: 'Jar 실행',
        urlTip: '팁: 파일 서버가 교차 출처 접근(CORS)을 허용해야 합니다. GitHub raw 및 릴리스 링크가 동작합니다.',
        uploadTitle: '로컬 Jar 실행',
        uploadDesc: '자신의 Java ME .jar(MIDlet) 파일을 선택하세요',
        uploadSelect: '.jar 파일 선택',
        uploadHint: 'jar는 브라우저에서 처리되며 서버로 전송되지 않습니다. 소유하거나 자유롭게 배포되는 소프트웨어만 실행하세요.',
        loading: 'JVM 시작 중...',
        loadingTip: 'jar는 호스트에서 다운로드됩니다. 첫 로드는 시간이 걸릴 수 있습니다',
        loadingSlow: '로딩이 느리면 조금 더 기다리거나 새 탭에서 에뮬레이터를 여세요',
        instructions: '사용 방법',
        controlsTitle: '조작 방법',
        controlsHint1: '숫자 키/방향키가 피처폰 키패드에 대응, 5 = 확인, * 및 # 지원',
        controlsHint2: '터치 기기에서는 에뮬레이터 내부에 가상 키패드가 나타납니다',
        aboutTitle: '소개',
        aboutHint: 'J2ME: Java Platform, Micro Edition - 2000년대 피처폰 게임의 플랫폼(MIDP 2.0). Rosabis의 J2meJS(GPL-2.0)를 핫링크로 제공.',
        playing: '실행 중: ',
        loadFailed: 'jar를 불러오지 못했습니다. URL을 확인하거나 나중에 다시 시도하세요',
        invalidFile: '.jar 파일을 선택하세요'
    },
    fr: {
        pageTitle: 'J2ME',
        reset: 'Réinitialiser',
        tabDemo: 'Démo officielle',
        tabUrl: 'URL du jar',
        tabFile: 'Jar local',
        demoTitle: 'Jeux mobiles J2ME',
        demoDesc: "Exécutez des jeux Java ME (J2ME) de téléphones portables dans votre navigateur avec J2meJS (GPL-2.0, intégré par lien direct vers la démo officielle). La démo officielle héberge une bibliothèque de midlets classiques - ouvrez-la pour choisir un jeu, ou chargez votre propre .jar ci-dessous.",
        demoOpen: 'Ouvrir la démo officielle',
        demoHint: "Les midlets commerciaux hébergés ailleurs ne sont pas liés ici - exécutez des jars que vous possédez ou librement distribués.",
        urlTitle: "Charger un jar depuis une URL",
        urlDesc: "Saisissez l'URL directe d'un fichier .jar (midlet Java ME)",
        urlPlaceholder: 'https://example.com/midlet.jar',
        loadJar: 'Exécuter le jar',
        urlTip: "Astuce : le serveur de fichiers doit autoriser l'accès cross-origin (CORS). Les liens GitHub raw et release fonctionnent.",
        uploadTitle: 'Exécuter un jar local',
        uploadDesc: "Sélectionnez votre propre fichier .jar (midlet Java ME)",
        uploadSelect: 'Sélectionner un .jar',
        uploadHint: "Le jar reste dans votre navigateur - rien n'est envoyé à un serveur. N'exécutez que des logiciels dont vous possédez les droits ou librement distribués.",
        loading: 'Démarrage de la JVM, veuillez patienter...',
        loadingTip: "Le jar est téléchargé depuis son hôte ; le premier chargement peut prendre du temps",
        loadingSlow: "Chargement lent - patientez encore un peu, ou ouvrez l'émulateur dans un nouvel onglet",
        instructions: 'Instructions',
        controlsTitle: 'Commandes',
        controlsHint1: "Les touches numériques / flèches correspondent au clavier du téléphone ; 5 = action, * et # sont pris en charge",
        controlsHint2: "Un clavier virtuel apparaît dans l'émulateur pour les appareils tactiles",
        aboutTitle: 'À propos',
        aboutHint: "J2ME : Java Platform, Micro Edition - la plateforme des jeux sur téléphones des années 2000 (MIDP 2.0). Émulation via J2meJS de Rosabis (GPL-2.0), intégré par lien direct.",
        playing: 'En cours : ',
        loadFailed: "Impossible de charger ce jar - vérifiez l'URL ou réessayez plus tard",
        invalidFile: "Veuillez sélectionner un fichier .jar"
    },
    de: {
        pageTitle: 'J2ME',
        reset: 'Zurücksetzen',
        tabDemo: 'Offizielle Demo',
        tabUrl: 'Jar-URL',
        tabFile: 'Lokales Jar',
        demoTitle: 'J2ME-Handyspiele',
        demoDesc: 'Führen Sie Java-ME-Spiele (J2ME) von Mobiltelefonen in Ihrem Browser aus - mit J2meJS (GPL-2.0, per Hotlink zur offiziellen Demo eingebettet). Die offizielle Demo hostet eine Sammlung klassischer Midlets - öffnen Sie sie, um ein Spiel zu wählen, oder laden Sie unten Ihr eigenes .jar.',
        demoOpen: 'Offizielle Demo öffnen',
        demoHint: 'Anderswo gehostete kommerzielle Midlets werden hier nicht verlinkt - führen Sie nur Jars aus, die Sie besitzen oder die frei verteilt werden.',
        urlTitle: 'Jar von URL laden',
        urlDesc: 'Geben Sie die direkte URL einer .jar-Datei (Java-ME-Midlet) ein',
        urlPlaceholder: 'https://example.com/midlet.jar',
        loadJar: 'Jar starten',
        urlTip: 'Tipp: Der Dateiserver muss Cross-Origin-Zugriff (CORS) erlauben. GitHub-Raw- und Release-Links funktionieren.',
        uploadTitle: 'Lokales Jar starten',
        uploadDesc: 'Wählen Sie Ihre eigene Java-ME-.jar-Datei (Midlet)',
        uploadSelect: '.jar-Datei auswählen',
        uploadHint: 'Das Jar bleibt im Browser - nichts wird auf einen Server hochgeladen. Führen Sie nur Software aus, die Sie besitzen oder die frei verteilt wird.',
        loading: 'JVM wird gestartet, bitte warten...',
        loadingTip: 'Das Jar wird vom Host heruntergeladen; das erste Laden kann dauern',
        loadingSlow: 'Laden dauert länger - bitte noch etwas warten, oder den Emulator in einem neuen Tab öffnen',
        instructions: 'Anleitung',
        controlsTitle: 'Steuerung',
        controlsHint1: 'Zifferntasten / Pfeiltasten entsprechen dem Handy-Keypad; 5 = Aktion, * und # werden unterstützt',
        controlsHint2: 'Auf Touch-Geräten erscheint ein virtuelles Keypad im Emulator',
        aboutTitle: 'Über',
        aboutHint: 'J2ME: Java Platform, Micro Edition - die Plattform der Handygames der 2000er (MIDP 2.0). Emulation via J2meJS von Rosabis (GPL-2.0), per Hotlink eingebettet.',
        playing: 'Läuft: ',
        loadFailed: 'Jar konnte nicht geladen werden - URL prüfen oder später erneut versuchen',
        invalidFile: 'Bitte eine .jar-Datei auswählen'
    },
    es: {
        pageTitle: 'J2ME',
        reset: 'Reiniciar',
        tabDemo: 'Demo oficial',
        tabUrl: 'URL del jar',
        tabFile: 'Jar local',
        demoTitle: 'Juegos móviles J2ME',
        demoDesc: "Ejecuta juegos Java ME (J2ME) de teléfonos móviles en tu navegador con J2meJS (GPL-2.0, incrustado por enlace directo a la demo oficial). La demo oficial aloja una biblioteca de midlets clásicos - ábrela para elegir un juego, o carga tu propio .jar abajo.",
        demoOpen: 'Abrir demo oficial',
        demoHint: 'Los midlets comerciales alojados en otros sitios no se enlazan aquí - ejecuta jars que poseas o que se distribuyan libremente.',
        urlTitle: 'Cargar un jar desde URL',
        urlDesc: 'Introduce la URL directa de un archivo .jar (midlet Java ME)',
        urlPlaceholder: 'https://example.com/midlet.jar',
        loadJar: 'Ejecutar jar',
        urlTip: 'Consejo: el servidor de archivos debe permitir acceso cross-origin (CORS). Los enlaces raw y release de GitHub funcionan.',
        uploadTitle: 'Ejecutar un jar local',
        uploadDesc: 'Selecciona tu propio archivo .jar (midlet Java ME)',
        uploadSelect: 'Seleccionar .jar',
        uploadHint: 'El jar permanece en tu navegador - nada se sube a ningún servidor. Ejecuta solo software que poseas o que se distribuya libremente.',
        loading: 'Iniciando la JVM, espera...',
        loadingTip: "El jar se descarga de su servidor; la primera carga puede tardar",
        loadingSlow: 'Carga lenta: espera un poco más, o abre el emulador en una pestaña nueva',
        instructions: 'Instrucciones',
        controlsTitle: 'Controles',
        controlsHint1: 'Las teclas numéricas / flechas corresponden al teclado del teléfono; 5 = acción, * y # están soportadas',
        controlsHint2: 'Un teclado virtual aparece dentro del emulador para dispositivos táctiles',
        aboutTitle: 'Acerca de',
        aboutHint: 'J2ME: Java Platform, Micro Edition - la plataforma de los juegos de móviles de los 2000 (MIDP 2.0). Emulación vía J2meJS de Rosabis (GPL-2.0), incrustado por enlace directo.',
        playing: 'Ejecutando: ',
        loadFailed: 'No se pudo cargar ese jar - comprueba la URL o inténtalo más tarde',
        invalidFile: 'Selecciona un archivo .jar'
    },
    ru: {
        pageTitle: 'J2ME',
        reset: 'Сброс',
        tabDemo: 'Официальная демо',
        tabUrl: 'URL jar',
        tabFile: 'Локальный jar',
        demoTitle: 'Мобильные игры J2ME',
        demoDesc: 'Запускайте игры Java ME (J2ME) с кнопочных телефонов в браузере с помощью J2meJS (GPL-2.0, встраивание горячей ссылкой на официальную демо). В официальной демо есть коллекция классических мидлетов - откройте её, чтобы выбрать игру, или загрузите свой .jar ниже.',
        demoOpen: 'Открыть официальную демо',
        demoHint: 'Коммерческие мидлеты, размещённые где-либо ещё, здесь не линкуются - запускайте jar, которыми владеете или которые свободно распространяются.',
        urlTitle: 'Загрузить jar по URL',
        urlDesc: 'Введите прямой URL файла .jar (мидлет Java ME)',
        urlPlaceholder: 'https://example.com/midlet.jar',
        loadJar: 'Запустить jar',
        urlTip: 'Совет: файловый сервер должен разрешать кросс-доменный доступ (CORS). Ссылки GitHub raw и release работают.',
        uploadTitle: 'Запустить локальный jar',
        uploadDesc: 'Выберите свой файл Java ME .jar (мидлет)',
        uploadSelect: 'Выбрать .jar',
        uploadHint: 'Jar остаётся в браузере - ничего не отправляется на сервер. Запускайте только программы, которыми владеете или которые свободно распространяются.',
        loading: 'JVM запускается, подождите...',
        loadingTip: 'Jar скачивается с сервера; первая загрузка может занять время',
        loadingSlow: 'Загрузка идёт медленно - подождите ещё немного или откройте эмулятор в новой вкладке',
        instructions: 'Инструкция',
        controlsTitle: 'Управление',
        controlsHint1: 'Цифровые клавиши / стрелки соответствуют клавиатуре телефона; 5 = действие, * и # поддерживаются',
        controlsHint2: 'На сенсорных устройствах в эмуляторе появляется виртуальная клавиатура',
        aboutTitle: 'О платформе',
        aboutHint: 'J2ME: Java Platform, Micro Edition - платформа игр на кнопочных телефонах 2000-х (MIDP 2.0). Эмуляция через J2meJS (Rosabis, GPL-2.0), встраивание горячей ссылкой.',
        playing: 'Запущено: ',
        loadFailed: 'Не удалось загрузить jar - проверьте URL или попробуйте позже',
        invalidFile: 'Выберите файл .jar'
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
var TAB_BOXES = { demo: 'demoBox', url: 'urlBox', file: 'uploadBox' };
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

// ---- demo tab ----------------------------------------------------------
document.getElementById('demoOpenBtn').addEventListener('click', function () {
    window.open(J2ME_BASE, '_blank', 'noopener');
});

// ---- player ------------------------------------------------------------
var slowTimer = null;
function hideOverlay() {
    var overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.add('hidden');
    if (slowTimer) { clearTimeout(slowTimer); slowTimer = null; }
}

function showPlayer(title) {
    document.getElementById('uploadSection').classList.add('hidden');
    document.getElementById('playerSection').classList.add('active');
    document.getElementById('pageTitle').textContent = t('playing') + (title || 'J2ME');
    document.getElementById('resetBtn').style.display = '';
    document.getElementById('loadingOverlay').classList.remove('hidden');
}

function playJar(jarUrl, title) {
    var frame = document.getElementById('j2meFrame');
    if (!frame) return;
    showPlayer(title);
    // J2meJS loads the jar via fetch, so CORS-enabled URLs and blob: object
    // URLs both work. Engine mode left at the demo default (compatibility).
    frame.src = J2ME_BASE + 'main.html?jars=' + encodeURIComponent(jarUrl);
    setTimeout(hideOverlay, 800);
    slowTimer = setTimeout(function () { showToast(t('loadingSlow')); }, 15000);
}

function stopPlayback() {
    var frame = document.getElementById('j2meFrame');
    if (frame) frame.src = 'about:blank';
    hideOverlay();
    document.getElementById('playerSection').classList.remove('active');
    document.getElementById('uploadSection').classList.remove('hidden');
    document.getElementById('pageTitle').textContent = t('pageTitle');
    document.getElementById('resetBtn').style.display = 'none';
}

// ---- URL tab -----------------------------------------------------------
document.getElementById('urlLoadBtn').addEventListener('click', function () {
    var input = document.getElementById('jarUrlInput');
    var url = (input.value || '').trim();
    if (!url) return;
    var errBox = document.getElementById('urlLoadError');
    if (errBox) errBox.classList.add('hidden');
    if (!/\.jar(\?|$)/i.test(url)) { showToast(t('invalidFile')); return; }
    playJar(url, url.split('/').pop() || '');
});

// ---- file tab ----------------------------------------------------------
document.getElementById('uploadBtn').addEventListener('click', function () {
    document.getElementById('jarInput').click();
});
document.getElementById('jarInput').addEventListener('change', function (e) {
    var file = e.target.files && e.target.files[0];
    if (!file) return;
    if (!/\.jar$/i.test(file.name)) { showToast(t('invalidFile')); return; }
    // fetch() can read blob: URLs, so pass the object URL straight to J2meJS
    var objectUrl = URL.createObjectURL(file);
    playJar(objectUrl, file.name);
});

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
