// Felt World Page JavaScript - Felt World (MIT) embedded by hotlink to the
// official static build at
// https://az9713.github.io/opus-5.5-open-world-game/feltworld/.
// No game code, textures, audio or assets are bundled by this host.

var FELT_HOME = 'https://az9713.github.io/opus-5.5-open-world-game/feltworld/';

// Internationalization (8 languages, same key set as toesty.js).
var i18n = {
    zh: {
        pageTitle: 'Felt World', reset: '重置', tabDemo: '游戏',
        demoTitle: 'Felt World 开放世界',
        demoDesc: '在浏览器里探索程序化生成的 3D 开放世界：驾驶、步行、飞行、潜水和海底探险。游戏由 Felt World 官方静态页面热链提供。',
        demoHint: '本页不内置游戏代码、贴图或音效——Felt World 及其 three.js 依赖由官方站点加载；「在新标签页打开」可获得完整独立体验。',
        demoOpen: '启动游戏', loading: 'Felt World 启动中，请稍候...',
        loadingTip: '游戏从 az9713.github.io 加载，首次启动需要联网',
        instructions: '使用说明',
        controlsTitle: '操作方式',
        controlsHint1: '先点击游戏画面取得键盘焦点。按提示切换驾驶、步行、飞行、潜水或潜艇模式；也支持触屏控制。',
        controlsHint2: '暂停、重置和全屏请使用游戏自己的界面；按 Esc 或使用上方重置按钮返回本页。',
        aboutTitle: '关于',
        aboutHint: 'Felt World 是基于 three.js 的单文件 3D 开放世界实验，纹理由 canvas 程序化生成，声音由 Web Audio 合成。作者 az9713，MIT 许可证。',
        playing: '正在运行：', fullscreen: '全屏'
    },
    en: {
        pageTitle: 'Felt World', reset: 'Reset', tabDemo: 'Game',
        demoTitle: 'Felt World Open World',
        demoDesc: 'Explore a procedural 3D open world in your browser: drive, walk, fly, dive and explore beneath the sea. The game is embedded by hotlink from the official Felt World static build.',
        demoHint: 'This host bundles no game code, textures or audio - Felt World and its three.js dependencies are loaded from the official site. Use the “Open in a new tab” link for the full standalone experience.',
        demoOpen: 'Launch Game', loading: 'Starting Felt World, please wait...',
        loadingTip: 'The game loads from az9713.github.io; an internet connection is required on first launch',
        instructions: 'Instructions',
        controlsTitle: 'Controls',
        controlsHint1: 'Click inside the game area first so it receives keyboard input. Follow the in-game prompts to switch between driving, walking, flying, diving and submarine modes; touch controls are also supported.',
        controlsHint2: 'Use the game own UI for pause, reset and fullscreen; press Esc or use the Reset button above to come back here.',
        aboutTitle: 'About',
        aboutHint: 'Felt World is a single-file 3D open-world experiment built with three.js. Textures are generated with canvas and sound is synthesized with Web Audio. By az9713, MIT licensed.',
        playing: 'Now running: ', fullscreen: 'Fullscreen'
    },
    ja: {
        pageTitle: 'Felt World', reset: 'リセット', tabDemo: 'ゲーム',
        demoTitle: 'Felt World オープンワールド',
        demoDesc: 'ブラウザで手続き生成された 3D オープンワールドを探索：運転、歩行、飛行、潜水、海底探検ができます。公式の Felt World 静的ページをホットリンク埋め込みしています。',
        demoHint: 'このホストページはゲームコード、テクスチャ、音声を同梱しません。Felt World と three.js の依存関係は公式サイトから読み込まれます。新しいタブで開くとフルスタンドアロン体験になります。',
        demoOpen: 'ゲームを起動', loading: 'Felt World を起動中...',
        loadingTip: 'ゲームは az9713.github.io から読み込まれます。初回起動にはインターネット接続が必要です',
        instructions: '使い方',
        controlsTitle: '操作方法',
        controlsHint1: '先にゲーム領域をクリックしてキーボード入力を渡してください。画面の案内に従って運転、歩行、飛行、潜水、潜水艦モードを切り替えられます。タッチ操作にも対応しています。',
        controlsHint2: '一時停止、リセット、全画面はゲーム自身の UI を使ってください。Esc または上のリセットボタンでこの画面に戻ります。',
        aboutTitle: 'について',
        aboutHint: 'Felt World は three.js で作られた単一ファイルの 3D オープンワールド実験です。テクスチャは canvas で生成され、音声は Web Audio で合成されます。作者 az9713、MIT ライセンス。',
        playing: '実行中：', fullscreen: '全画面'
    },
    ko: {
        pageTitle: 'Felt World', reset: '재설정', tabDemo: '게임',
        demoTitle: 'Felt World 오픈 월드',
        demoDesc: '브라우저에서 절차적으로 생성된 3D 오픈 월드를 탐험하세요. 운전, 걷기, 비행, 잠수, 해저 탐험이 가능합니다. 공식 Felt World 정적 페이지를 핫링크로 삽입했습니다.',
        demoHint: '이 페이지는 게임 코드, 텍스처 또는 오디오를 포함하지 않습니다. Felt World와 three.js 종속성은 공식 사이트에서 로드됩니다. 새 탭에서 열면 전체 독립 실행 환경을 사용할 수 있습니다.',
        demoOpen: '게임 시작', loading: 'Felt World를 시작하는 중...',
        loadingTip: '게임은 az9713.github.io에서 로드되며 첫 실행 시 인터넷 연결이 필요합니다',
        instructions: '사용법',
        controlsTitle: '조작',
        controlsHint1: '먼저 게임 영역을 클릭해 키보드 입력을 받으세요. 게임 안의 안내에 따라 운전, 걷기, 비행, 잠수, 잠수함 모드를 전환할 수 있으며 터치 조작도 지원합니다.',
        controlsHint2: '일시정지, 재설정, 전체 화면은 게임 자체 UI를 사용하세요. Esc 또는 위의 재설정 버튼으로 이 페이지로 돌아옵니다.',
        aboutTitle: '정보',
        aboutHint: 'Felt World는 three.js로 만든 단일 파일 3D 오픈 월드 실험입니다. 텍스처는 canvas로 생성하고 소리는 Web Audio로 합성합니다. 제작자 az9713, MIT 라이선스.',
        playing: '실행 중: ', fullscreen: '전체 화면'
    },
    fr: {
        pageTitle: 'Felt World', reset: 'Réinitialiser', tabDemo: 'Jeu',
        demoTitle: 'Monde ouvert Felt World',
        demoDesc: 'Explorez un monde ouvert 3D généré procéduralement dans votre navigateur : conduite, marche, vol, plongée et exploration sous-marine. Le jeu est intégré par hotlink depuis la version statique officielle de Felt World.',
        demoHint: 'Cette page ne regroupe aucun code de jeu, aucune texture ni aucun audio - Felt World et ses dépendances three.js sont chargés depuis le site officiel. Utilisez le lien « Ouvrir dans un nouvel onglet » pour l’expérience autonome complète.',
        demoOpen: 'Lancer le jeu', loading: 'Démarrage de Felt World, veuillez patienter...',
        loadingTip: 'Le jeu se charge depuis az9713.github.io ; une connexion Internet est nécessaire au premier lancement',
        instructions: 'Instructions',
        controlsTitle: 'Commandes',
        controlsHint1: 'Cliquez d’abord dans la zone de jeu pour activer le clavier. Suivez les invites du jeu pour passer entre conduite, marche, vol, plongée et sous-marin ; les commandes tactiles sont également prises en charge.',
        controlsHint2: 'Utilisez l’interface du jeu pour pause, réinitialisation et plein écran ; appuyez sur Échap ou sur le bouton Réinitialiser ci-dessus pour revenir ici.',
        aboutTitle: 'À propos',
        aboutHint: 'Felt World est une expérience de monde ouvert 3D en fichier unique conçue avec three.js. Les textures sont générées via canvas et les sons par Web Audio. Par az9713, sous licence MIT.',
        playing: 'En cours : ', fullscreen: 'Plein écran'
    },
    de: {
        pageTitle: 'Felt World', reset: 'Zurücksetzen', tabDemo: 'Spiel',
        demoTitle: 'Felt World Open World',
        demoDesc: 'Erkunde eine prozedural erzeugte 3D-Open-World im Browser: fahren, laufen, fliegen, tauchen und den Meeresboden erkunden. Das Spiel wird als Hotlink vom offiziellen statischen Felt World-Build eingebettet.',
        demoHint: 'Diese Seite enthält keinen Spielcode, keine Texturen und keine Audiodateien - Felt World und die three.js-Abhängigkeiten werden von der offiziellen Website geladen. Nutze den Link „In neuem Tab öffnen“ für die vollständige Standalone-Version.',
        demoOpen: 'Spiel starten', loading: 'Felt World wird gestartet, bitte warten...',
        loadingTip: 'Das Spiel lädt von az9713.github.io; beim ersten Start ist eine Internetverbindung erforderlich',
        instructions: 'Anleitung',
        controlsTitle: 'Steuerung',
        controlsHint1: 'Klicke zuerst in den Spielbereich, damit Tastatureingaben ankommen. Wechsle gemäß den Spielhinweisen zwischen Fahren, Gehen, Fliegen, Tauchen und U-Boot-Modus; Touch-Steuerung wird ebenfalls unterstützt.',
        controlsHint2: 'Pause, Zurücksetzen und Vollbild befinden sich in der Spieloberfläche; mit Esc oder der Schaltfläche oben kommst du hierher zurück.',
        aboutTitle: 'Über',
        aboutHint: 'Felt World ist ein Single-File-3D-Open-World-Experiment mit three.js. Texturen werden per Canvas erzeugt, Klänge mit Web Audio synthetisiert. Von az9713, MIT-lizenziert.',
        playing: 'Läuft: ', fullscreen: 'Vollbild'
    },
    es: {
        pageTitle: 'Felt World', reset: 'Reiniciar', tabDemo: 'Juego',
        demoTitle: 'Mundo abierto Felt World',
        demoDesc: 'Explora un mundo abierto 3D generado proceduralmente en tu navegador: conduce, camina, vuela, bucea y explora el fondo marino. El juego se inserta mediante hotlink desde la compilación estática oficial de Felt World.',
        demoHint: 'Esta página no incluye código del juego, texturas ni audio: Felt World y sus dependencias de three.js se cargan desde el sitio oficial. Usa el enlace «Abrir en una pestaña nueva» para disfrutar la experiencia independiente completa.',
        demoOpen: 'Iniciar juego', loading: 'Iniciando Felt World, espera...',
        loadingTip: 'El juego se carga desde az9713.github.io; se necesita conexión a Internet en el primer inicio',
        instructions: 'Instrucciones',
        controlsTitle: 'Controles',
        controlsHint1: 'Haz clic primero en el área del juego para activar el teclado. Sigue las indicaciones para cambiar entre conducir, caminar, volar, bucear y submarino; también admite controles táctiles.',
        controlsHint2: 'Usa la interfaz del juego para pausar, reiniciar y activar la pantalla completa; pulsa Esc o el botón Reiniciar de arriba para volver aquí.',
        aboutTitle: 'Acerca de',
        aboutHint: 'Felt World es un experimento de mundo abierto 3D en un solo archivo creado con three.js. Las texturas se generan con canvas y los sonidos se sintetizan con Web Audio. Por az9713, licencia MIT.',
        playing: 'Ejecutando: ', fullscreen: 'Pantalla completa'
    },
    ru: {
        pageTitle: 'Felt World', reset: 'Сбросить', tabDemo: 'Игра',
        demoTitle: 'Открытый мир Felt World',
        demoDesc: 'Исследуйте процедурно созданный 3D-мир в браузере: водите, ходите, летайте, ныряйте и изучайте морское дно. Игра встроена через горячую ссылку на официальную статическую сборку Felt World.',
        demoHint: 'Эта страница не содержит кода игры, текстур или звука — Felt World и зависимости three.js загружаются с официального сайта. Используйте ссылку «Открыть в новой вкладке» для полной отдельной версии.',
        demoOpen: 'Запустить игру', loading: 'Запуск Felt World, подождите...',
        loadingTip: 'Игра загружается с az9713.github.io; при первом запуске требуется интернет-соединение',
        instructions: 'Инструкции',
        controlsTitle: 'Управление',
        controlsHint1: 'Сначала щёлкните по игровой области, чтобы получать ввод с клавиатуры. Следуйте подсказкам игры, чтобы переключаться между вождением, ходьбой, полётом, нырянием и подводной лодкой; сенсорное управление также поддерживается.',
        controlsHint2: 'Пауза, сброс и полноэкранный режим находятся в интерфейсе игры; нажмите Esc или кнопку «Сбросить» выше, чтобы вернуться сюда.',
        aboutTitle: 'О игре',
        aboutHint: 'Felt World — это однофайловый эксперимент с открытым 3D-миром на three.js. Текстуры создаются через canvas, а звук синтезируется через Web Audio. Автор az9713, лицензия MIT.',
        playing: 'Запущено: ', fullscreen: 'Полный экран'
    }
};

// ---- helpers -------------------------------------------------------------
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

// ---- player --------------------------------------------------------------
var player = HotlinkPlayer.createPlayer({
    frameId: 'feltFrame', overlayId: 'loadingOverlay', url: FELT_HOME, newTabUrl: FELT_HOME
});

function showPlayer(title) {
    document.getElementById('uploadSection').classList.add('hidden');
    document.getElementById('playerSection').classList.add('active');
    document.getElementById('pageTitle').textContent = t('playing') + (title || 'Felt World');
    document.getElementById('resetBtn').style.display = '';
    document.getElementById('fullscreenBtn').style.display = '';
}

function playFelt() {
    if (!document.getElementById('feltFrame')) return;
    showPlayer('Felt World');
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

// ---- controls ------------------------------------------------------------
$('demoOpenBtn').addEventListener('click', playFelt);
(function () {
    var link = $('demoOpenNewTab');
    if (link) link.href = FELT_HOME;
})();

$('backBtn').addEventListener('click', function () {
    if ($('playerSection').classList.contains('active')) { stopPlayback(); return; }
    window.location.href = '../routes/game.html?category=webgames';
});
$('resetBtn').addEventListener('click', stopPlayback);
$('fullscreenBtn').addEventListener('click', function () {
    var wrapper = $('feltWrapper');
    if (!wrapper) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else if (wrapper.requestFullscreen) wrapper.requestFullscreen();
});

document.addEventListener('fullscreenchange', function () {
    var icon = $('fullscreenBtn').querySelector('i');
    if (icon) icon.className = document.fullscreenElement ? 'fas fa-compress' : 'fas fa-expand';
});

(function () {
    var header = $('instructionsHeader');
    var toggle = $('instructionsToggle');
    if (!header || !toggle) return;
    header.addEventListener('click', function () {
        $('instructionsContent').classList.toggle('collapsed');
        toggle.classList.toggle('fa-chevron-up');
        toggle.classList.toggle('fa-chevron-down');
    });
})();

applyI18n();
