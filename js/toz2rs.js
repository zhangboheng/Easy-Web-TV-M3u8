// Zelda II Page JavaScript - z2rs (MIT, by troyedwardsjr) embedded by hotlink
// to its official web build. No game data is bundled here: users must load
// their own Zelda II ROM (No-Intro USA dump) inside the app.

var Z2RS_BASE = 'https://z2rs.com/';

// Internationalization (8 languages, same key set as topalm.js)
var i18n = {
    zh: {
        pageTitle: '塞尔达传说 II',
        reset: '重置',
        tabDemo: '模拟器',
        demoTitle: '塞尔达传说 II：林克的冒险',
        demoDesc: '通过 z2rs（用 Rust 净室重建 NES 经典、编译为 WebAssembly，热链嵌入官方网页版）在浏览器里直接运行《塞尔达传说 II》。需要自备游戏 ROM 才能开始。',
        demoOpen: '启动游戏',
        demoHint: '不内置任何游戏数据——需自行加载《塞尔达传说 II》ROM，且仅接受 No-Intro 美版转储（CRC32 BA322865）。文件只就地读取，不会上传。任天堂未认可此产品。',
        loading: 'z2rs 启动中，请稍候...',
        loadingTip: '游戏从其服务器加载，首次启动可能较慢',
        loadingSlow: '加载较慢，请耐心等待；也可以在新标签页打开',
        openInNewTab: '在新标签页打开 ↗',
        instructions: '使用说明',
        controlsTitle: '操作方式',
        controlsHint1: '方向键移动，键盘或手柄进行跳跃与攻击',
        controlsHint2: '在开始界面加载你自备的《塞尔达传说 II》ROM 后按 Start；Tab 快进，F5/F7 存档与读档，F11 切换全屏',
        aboutTitle: '关于',
        aboutHint: '《塞尔达传说 II：林克的冒险》（1987，任天堂）。z2rs 是用 Rust 的净室重建，逐帧对照原 ROM 校验，增加了宽屏、即时存档与可选联机双人。源代码为 MIT 许可，不含游戏本体。',
        playing: '正在运行：',
        fullscreen: '全屏'
    },
    en: {
        pageTitle: 'Zelda II',
        reset: 'Reset',
        tabDemo: 'Emulator',
        demoTitle: 'Zelda II: The Adventure of Link',
        demoDesc: 'Play Zelda II in your browser with z2rs (a clean-room reconstruction of the NES classic in Rust, compiled to WebAssembly and embedded by hotlink to its official web build). Bring your own ROM to start.',
        demoOpen: 'Launch Game',
        demoHint: 'No game data is bundled - you must load your own Zelda II ROM. Only the No-Intro USA dump is accepted (CRC32 BA322865). The file is read in place and never uploaded. Not endorsed by Nintendo.',
        loading: 'Starting z2rs, please wait...',
        loadingTip: 'The game loads from its host; first launch can take a while',
        loadingSlow: 'Still loading - please wait a bit longer, or open it in a new tab',
        openInNewTab: 'Open in a new tab ↗',
        instructions: 'Instructions',
        controlsTitle: 'Controls',
        controlsHint1: 'Move with the arrow keys, jump and attack with the keyboard or a gamepad',
        controlsHint2: 'Load your own Zelda II ROM on the start screen, then press Start; Tab fast-forwards, F5/F7 save and load states, F11 toggles fullscreen',
        aboutTitle: 'About',
        aboutHint: 'Zelda II: The Adventure of Link (1987, Nintendo). z2rs is a clean-room reconstruction in Rust, checked frame by frame against the original ROM, adding widescreen, save states and optional online co-op. Source is MIT licensed; the game itself is not included.',
        playing: 'Now running: ',
        fullscreen: 'Fullscreen'
    },
    ja: {
        pageTitle: 'ゼルダの伝説 II',
        reset: 'リセット',
        tabDemo: 'エミュレータ',
        demoTitle: 'ゼルダの伝説 II リンクの冒険',
        demoDesc: 'z2rs（NES の名作を Rust でクリーンルーム再構築し WebAssembly にビルド、公式 Web 版へのホットリンク埋め込み）で『ゼルダの伝説 II』をブラウザ上で直接プレイ。開始には自分の ROM が必要です。',
        demoOpen: 'ゲームを起動',
        demoHint: 'ゲームデータは同梱されていません。お持ちの『ゼルダの伝説 II』ROM を読み込んでください（No-Intro 米国版ダンプ、CRC32 BA322865 のみ対応）。ファイルはその場で読まれるだけで、アップロードされません。任天堂の公認製品ではありません。',
        loading: 'z2rs を起動中...',
        loadingTip: 'ゲームはホストから読み込まれます。初回の起動は時間がかかることがあります',
        loadingSlow: '読み込みが遅い場合はそのままお待ちいただくか、新しいタブで開いてください',
        openInNewTab: '新しいタブで開く ↗',
        instructions: '使い方',
        controlsTitle: '操作方法',
        controlsHint1: '矢印キーで移動、キーボードまたはゲームパッドでジャンプと攻撃',
        controlsHint2: '開始画面で自分の『ゼルダの伝説 II』ROM を読み込み、Start を押します。Tab で早送り、F5/F7 でセーブとロード、F11 で全画面',
        aboutTitle: 'について',
        aboutHint: 'ゼルダの伝説 II リンクの冒険（1987 年、任天堂）。z2rs は Rust によるクリーンルーム再構築で、原 ROM とフレーム単位で照合済み。ワイドスクリーン、セーブステート、任意のオンライン協力プレイを追加。ソースは MIT ライセンスで、ゲーム本体は含みません。',
        playing: '実行中：',
        fullscreen: '全画面'
    },
    ko: {
        pageTitle: '젤다의 전설 II',
        reset: '재설정',
        tabDemo: '에뮬레이터',
        demoTitle: '젤다의 전설 II: 링크의 모험',
        demoDesc: 'z2rs(NES 명작을 Rust로 클린룸 재구현하여 WebAssembly로 빌드, 공식 웹 버전 핫링크 임베드)으로 『젤다의 전설 II』를 브라우저에서 바로 실행합니다. 시작하려면 본인의 ROM이 필요합니다.',
        demoOpen: '게임 실행',
        demoHint: '게임 데이터는 포함되지 않습니다. 보유한 『젤다의 전설 II』 ROM을 불러오세요(No-Intro 미국판 덤프, CRC32 BA322865만 지원). 파일은 그 자리에서 읽기만 하며 업로드되지 않습니다. Nintendo의 공식 제품이 아닙니다.',
        loading: 'z2rs 시작 중...',
        loadingTip: '게임은 호스트에서 로드되며 첫 실행은 느릴 수 있습니다',
        loadingSlow: '로딩이 느립니다. 조금 더 기다리시거나 새 탭에서 여세요',
        openInNewTab: '새 탭에서 열기 ↗',
        instructions: '사용 방법',
        controlsTitle: '조작 방법',
        controlsHint1: '방향키로 이동하고 키보드나 게임패드로 점프와 공격',
        controlsHint2: '시작 화면에서 보유한 『젤다의 전설 II』 ROM을 불러온 뒤 Start를 누르세요. Tab은 빨리 감기, F5/F7은 세이브와 로드, F11은 전체 화면',
        aboutTitle: '정보',
        aboutHint: '젤다의 전설 II: 링크의 모험(1987, Nintendo). z2rs는 Rust 기반 클린룸 재구현으로 원본 ROM과 프레임 단위로 검증되었으며, 와이드스크린, 세이브 스테이트, 선택적 온라인 협동을 추가합니다. 소스는 MIT 라이선스이며 게임 본체는 포함하지 않습니다.',
        playing: '실행 중: ',
        fullscreen: '전체 화면'
    },
    fr: {
        pageTitle: 'Zelda II',
        reset: 'Réinitialiser',
        tabDemo: 'Émulateur',
        demoTitle: 'Zelda II : The Adventure of Link',
        demoDesc: "Jouez à Zelda II dans votre navigateur avec z2rs (reconstruction clean-room du classique NES en Rust, compilée en WebAssembly et intégrée par lien direct à sa version web officielle). Munissez-vous de votre propre ROM pour démarrer.",
        demoOpen: 'Lancer le jeu',
        demoHint: "Aucune donnée de jeu n'est fournie - vous devez charger votre propre ROM Zelda II. Seul le dump No-Intro USA est accepté (CRC32 BA322865). Le fichier est lu sur place et jamais téléversé. Non approuvé par Nintendo.",
        loading: 'Démarrage de z2rs, veuillez patienter...',
        loadingTip: "Le jeu se charge depuis son hôte ; le premier lancement peut être long",
        loadingSlow: 'Chargement toujours en cours - patientez encore un peu, ou ouvrez-le dans un nouvel onglet',
        openInNewTab: 'Ouvrir dans un nouvel onglet ↗',
        instructions: 'Instructions',
        controlsTitle: 'Commandes',
        controlsHint1: 'Déplacez-vous avec les flèches, sautez et attaquez au clavier ou à la manette',
        controlsHint2: "Chargez votre ROM Zelda II sur l'écran de démarrage, puis appuyez sur Start ; Tab accélère, F5/F7 sauvegardent et chargent, F11 bascule en plein écran",
        aboutTitle: 'À propos',
        aboutHint: "Zelda II : The Adventure of Link (1987, Nintendo). z2rs est une reconstruction clean-room en Rust, vérifiée image par image avec la ROM d'origine, ajoutant le widescreen, les sauvegardes d'état et un coop en ligne optionnel. Le code source est sous licence MIT ; le jeu lui-même n'est pas inclus.",
        playing: 'En cours : ',
        fullscreen: 'Plein écran'
    },
    de: {
        pageTitle: 'Zelda II',
        reset: 'Zurücksetzen',
        tabDemo: 'Emulator',
        demoTitle: 'Zelda II: The Adventure of Link',
        demoDesc: 'Spiele Zelda II im Browser mit z2rs (eine Clean-Room-Rekonstruktion des NES-Klassikers in Rust, zu WebAssembly kompiliert und per Hotlink zur offiziellen Web-Version eingebettet). Für den Start brauchst du eine eigene ROM.',
        demoOpen: 'Spiel starten',
        demoHint: 'Es werden keine Spieldaten mitgeliefert - du musst deine eigene Zelda II ROM laden. Akzeptiert wird nur der No-Intro-USA-Dump (CRC32 BA322865). Die Datei wird nur gelesen und nie hochgeladen. Nicht von Nintendo anerkannt.',
        loading: 'z2rs wird gestartet, bitte warten...',
        loadingTip: 'Das Spiel lädt vom Host; der erste Start kann dauern',
        loadingSlow: 'Lädt noch - bitte etwas länger warten oder in einem neuen Tab öffnen',
        openInNewTab: 'In neuem Tab öffnen ↗',
        instructions: 'Anleitung',
        controlsTitle: 'Steuerung',
        controlsHint1: 'Bewegen mit den Pfeiltasten, springen und angreifen per Tastatur oder Gamepad',
        controlsHint2: 'Lade im Startbildschirm deine eigene Zelda II ROM und drücke Start; Tab spult vor, F5/F7 speichern und laden Speicherstände, F11 schaltet Vollbild',
        aboutTitle: 'Über',
        aboutHint: 'Zelda II: The Adventure of Link (1987, Nintendo). z2rs ist eine Clean-Room-Rekonstruktion in Rust, Bild für Bild gegen die Original-ROM geprüft, mit Widescreen, Savestates und optionalem Online-Koop. Der Quellcode steht unter MIT; das Spiel selbst ist nicht enthalten.',
        playing: 'Läuft: ',
        fullscreen: 'Vollbild'
    },
    es: {
        pageTitle: 'Zelda II',
        reset: 'Reiniciar',
        tabDemo: 'Emulador',
        demoTitle: 'Zelda II: The Adventure of Link',
        demoDesc: 'Juega a Zelda II en tu navegador con z2rs (una reconstrucción clean-room del clásico de NES en Rust, compilada a WebAssembly e incrustada por enlace directo a su versión web oficial). Aporta tu propio ROM para empezar.',
        demoOpen: 'Iniciar juego',
        demoHint: 'No se incluyen datos del juego: debes cargar tu propio ROM de Zelda II. Solo se acepta el volcado No-Intro USA (CRC32 BA322865). El archivo solo se lee y nunca se sube. No respaldado por Nintendo.',
        loading: 'Iniciando z2rs, espera por favor...',
        loadingTip: 'El juego se carga desde su host; el primer arranque puede tardar',
        loadingSlow: 'Sigue cargando - espera un poco más o ábrelo en una pestaña nueva',
        openInNewTab: 'Abrir en una pestaña nueva ↗',
        instructions: 'Instrucciones',
        controlsTitle: 'Controles',
        controlsHint1: 'Muévete con las flechas, salta y ataca con el teclado o un mando',
        controlsHint2: 'Carga tu propio ROM de Zelda II en la pantalla de inicio y pulsa Start; Tab acelera, F5/F7 guardan y cargan estados, F11 alterna pantalla completa',
        aboutTitle: 'Acerca de',
        aboutHint: 'Zelda II: The Adventure of Link (1987, Nintendo). z2rs es una reconstrucción clean-room en Rust, comprobada fotograma a fotograma con el ROM original, que añade pantalla ancha, estados guardados y cooperativo online opcional. El código es MIT; el juego no está incluido.',
        playing: 'En ejecución: ',
        fullscreen: 'Pantalla completa'
    },
    ru: {
        pageTitle: 'Zelda II',
        reset: 'Сброс',
        tabDemo: 'Эмулятор',
        demoTitle: 'Zelda II: The Adventure of Link',
        demoDesc: 'Играйте в Zelda II прямо в браузере с z2rs (чистая реализация классики NES на Rust, скомпилированная в WebAssembly и встроенная горячей ссылкой на официальную веб-версию). Для запуска нужен собственный ROM.',
        demoOpen: 'Запустить игру',
        demoHint: 'Данные игры не поставляются - загрузите собственный ROM Zelda II. Принимается только дамп No-Intro USA (CRC32 BA322865). Файл только читается на месте и никогда не отправляется. Продукт не одобрен Nintendo.',
        loading: 'Запуск z2rs, подождите...',
        loadingTip: 'Игра загружается с сервера проекта; первый запуск может быть долгим',
        loadingSlow: 'Всё ещё загружается - подождите немного или откройте в новой вкладке',
        openInNewTab: 'Открыть в новой вкладке ↗',
        instructions: 'Инструкции',
        controlsTitle: 'Управление',
        controlsHint1: 'Движение стрелками, прыжок и атака с клавиатуры или геймпада',
        controlsHint2: 'Загрузите свой ROM Zelda II на стартовом экране и нажмите Start; Tab ускоряет, F5/F7 сохраняют и загружают состояние, F11 переключает полный экран',
        aboutTitle: 'О игре',
        aboutHint: 'Zelda II: The Adventure of Link (1987, Nintendo). z2rs - чистая реализация на Rust, сверенная покадрово с оригинальным ROM, с широким экраном, сохранениями и опциональным сетевым кооперативом. Исходный код под MIT; сама игра не включена.',
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

// ---- tab switching (single tab, kept for structural parity) -----------
document.querySelectorAll('.upload-tab').forEach(function (el) {
    el.addEventListener('click', function () {
        document.querySelectorAll('.upload-tab').forEach(function (tab) {
            tab.classList.toggle('active', tab === el);
        });
    });
});

// ---- player ------------------------------------------------------------
var player = HotlinkPlayer.createPlayer({
    frameId: 'z2rsFrame', overlayId: 'loadingOverlay', url: Z2RS_BASE, newTabUrl: Z2RS_BASE
});

function showPlayer(title) {
    document.getElementById('uploadSection').classList.add('hidden');
    document.getElementById('playerSection').classList.add('active');
    document.getElementById('pageTitle').textContent = t('playing') + (title || 'Zelda II');
    document.getElementById('resetBtn').style.display = '';
    document.getElementById('fullscreenBtn').style.display = '';
}

function playZ2rs() {
    if (!document.getElementById('z2rsFrame')) return;
    showPlayer('Zelda II');
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

// ---- fullscreen --------------------------------------------------------
// z2rs does not ship its own fullscreen control, so the host page
// requests fullscreen on the iframe itself (allowed via allowfullscreen).
document.getElementById('fullscreenBtn').addEventListener('click', function () {
    var frame = document.getElementById('z2rsFrame');
    if (!frame) return;
    if (document.fullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen();
    } else if (frame.requestFullscreen) {
        frame.requestFullscreen();
    } else if (frame.webkitRequestFullscreen) {
        frame.webkitRequestFullscreen();
    }
});

// ---- demo tab ----------------------------------------------------------
document.getElementById('demoOpenBtn').addEventListener('click', playZ2rs);

// ---- back / reset ------------------------------------------------------
document.getElementById('backBtn').addEventListener('click', function () {
    var playerSection = document.getElementById('playerSection');
    if (playerSection.classList.contains('active')) { stopPlayback(); return; }
    window.location.href = '../routes/game.html?category=recomp';
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