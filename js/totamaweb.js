// Tamaweb page controller - hot-linked official static build.
// No game code or assets are bundled by this host.

var TAMAWEB_HOME = 'https://autosam.github.io/Tamaweb/';

var i18n = {
    zh: {
        pageTitle: "Tamaweb", reset: "重置", tabDemo: "游戏",
        demoTitle: "Tamaweb 虚拟宠物",
        demoDesc: "在浏览器里照顾官方 Tamaweb 宠物：喂食、清洁、玩耍、布置房间并陪伴它成长。游戏由官方静态页面热链提供。",
        demoHint: "本页不内置游戏代码或素材；官方页面可能有自己的统计/错误上报，存档保存在官方域名。建议用「在新标签页打开」获得完整体验。",
        demoOpen: "启动游戏",
        loading: "启动中，请稍候...",
        loadingTip: "本页不内置游戏代码或素材；官方页面可能有自己的统计/错误上报，存档保存在官方域名。建议用「在新标签页打开」获得完整体验。",
        instructions: "使用说明",
        controlsTitle: "操作方式",
        controlsHint1: "点击游戏画面打开菜单，使用鼠标或触屏照顾宠物：喂食、洗澡、如厕、玩耍、冒险并自定义房间。",
        controlsHint2: "支持鼠标、触屏；设置、存档管理和 view size 在官方游戏菜单内。按官方页面提示操作，关闭页面前可在设置里导出存档。",
        aboutTitle: "关于",
        aboutHint: "Tamaweb 是 autosam 制作的虚拟宠物游戏，浏览器版由官方 GitHub Pages 静态构建提供。署名原作者并保留 CC BY-NC-SA 4.0 与非商业条款；名称、品牌和素材另有使用条款。",
        playing: "正在运行：",
        fullscreen: "全屏"
    },
    en: {
        pageTitle: "Tamaweb", reset: "Reset", tabDemo: "Game",
        demoTitle: "Tamaweb Virtual Pet",
        demoDesc: "Raise a virtual pet in the browser: feed, clean, play, decorate rooms and watch it grow through day/night and seasons. The game is hot-linked from its official static build.",
        demoHint: "This host bundles no game code or assets. The official page may load its own analytics/error reporting; saves live on the official domain. Use “Open in a new tab” for the full experience.",
        demoOpen: "Launch Game",
        loading: "Starting, please wait...",
        loadingTip: "This host bundles no game code or assets. The official page may load its own analytics/error reporting; saves live on the official domain. Use “Open in a new tab” for the full experience.",
        instructions: "Instructions",
        controlsTitle: "Controls",
        controlsHint1: "Click the game screen to open menus, then use mouse or touch to feed, bathe, play, go on adventures and customize the room.",
        controlsHint2: "Mouse and touch input are supported. Settings, save management and view size live in the official game menu; export your save in settings before relying on browser storage.",
        aboutTitle: "About",
        aboutHint: "Tamaweb is a virtual pet game by autosam; the browser build is hot-linked from the official GitHub Pages site. Credit the author and keep CC BY-NC-SA 4.0/non-commercial terms; name, branding and assets have separate terms.",
        playing: "Now running: ",
        fullscreen: "Fullscreen"
    },
    ja: {
        pageTitle: "Tamaweb", reset: "リセット", tabDemo: "ゲーム",
        demoTitle: "Tamaweb バーチャルペット",
        demoDesc: "ブラウザでTamawebのバーチャルペットを育てましょう。食事、掃除、遊び、部屋のカスタマイズ、昼夜と季節の変化を公式静的ページからホットリンクして楽しみます。",
        demoHint: "このホストページはゲームコードや素材を同梱しません。公式ページが独自の解析やエラー報告を読み込む場合があり、セーブデータは公式ドメインに保存されます。新しいタブで開くと快適に遊べます。",
        demoOpen: "ゲームを起動",
        loading: "起動中...",
        loadingTip: "このホストページはゲームコードや素材を同梱しません。公式ページが独自の解析やエラー報告を読み込む場合があり、セーブデータは公式ドメインに保存されます。新しいタブで開くと快適に遊べます。",
        instructions: "使い方",
        controlsTitle: "操作方法",
        controlsHint1: "ゲーム画面をクリックしてメニューを開き、マウスやタッチで食事、掃除、遊び、冒険、部屋のカスタマイズを行います。",
        controlsHint2: "マウスとタッチに対応しています。設定、セーブ管理、表示サイズは公式ゲーム内のメニューにあります。",
        aboutTitle: "について",
        aboutHint: "Tamawebはautosam制作のバーチャルペットゲームです。ブラウザ版は公式GitHub Pagesからホットリンクします。作者をクレジットし、CC BY-NC-SA 4.0と非商用条件を守ってください。",
        playing: "実行中：",
        fullscreen: "全画面"
    },
    ko: {
        pageTitle: "Tamaweb", reset: "재설정", tabDemo: "게임",
        demoTitle: "Tamaweb 가상 펫",
        demoDesc: "브라우저에서 Tamaweb 가상 펫을 키우세요. 먹이, 청소, 놀이, 방 꾸미기와 계절 변화를 공식 정적 페이지에서 핫링크로 즐깁니다.",
        demoHint: "이 페이지는 게임 코드나 애셋을 포함하지 않습니다. 공식 페이지가 자체 분석/오류 보고를 불러올 수 있고 저장 데이터는 공식 도메인에 저장됩니다. 새 탭에서 열면 더 편하게 이용할 수 있습니다.",
        demoOpen: "게임 시작",
        loading: "시작하는 중...",
        loadingTip: "이 페이지는 게임 코드나 애셋을 포함하지 않습니다. 공식 페이지가 자체 분석/오류 보고를 불러올 수 있고 저장 데이터는 공식 도메인에 저장됩니다. 새 탭에서 열면 더 편하게 이용할 수 있습니다.",
        instructions: "사용법",
        controlsTitle: "조작",
        controlsHint1: "게임 화면을 클릭해 메뉴를 열고 마우스나 터치로 먹이 주기, 목욕, 놀이, 모험, 방 꾸미기를 하세요.",
        controlsHint2: "마우스와 터치를 지원합니다. 설정, 저장 관리, 화면 크기는 공식 게임 메뉴에 있습니다.",
        aboutTitle: "정보",
        aboutHint: "Tamaweb은 autosam이 만든 가상 펫 게임입니다. 브라우저 버전은 공식 GitHub Pages에서 핫링크합니다. 작성자를 표기하고 CC BY-NC-SA 4.0과 비상업 조건을 지켜주세요.",
        playing: "실행 중: ",
        fullscreen: "전체 화면"
    },
    fr: {
        pageTitle: "Tamaweb", reset: "Réinitialiser", tabDemo: "Jeu",
        demoTitle: "Tamaweb - Animal virtuel",
        demoDesc: "Élevez un animal virtuel dans le navigateur : nourrissez, nettoyez, jouez, décorez des pièces et voyez-le grandir au fil des jours, des nuits et des saisons. Le jeu est hot-linké depuis sa version statique officielle.",
        demoHint: "Cette page ne regroupe aucun code ni asset de jeu. La page officielle peut charger ses propres analyses ou rapports d’erreur ; les sauvegardes sont stockées sur le domaine officiel. Utilisez « Ouvrir dans un nouvel onglet » pour une meilleure expérience.",
        demoOpen: "Lancer le jeu",
        loading: "Démarrage, veuillez patienter...",
        loadingTip: "Cette page ne regroupe aucun code ni asset de jeu. La page officielle peut charger ses propres analyses ou rapports d’erreur ; les sauvegardes sont stockées sur le domaine officiel. Utilisez « Ouvrir dans un nouvel onglet » pour une meilleure expérience.",
        instructions: "Instructions",
        controlsTitle: "Commandes",
        controlsHint1: "Cliquez sur l’écran de jeu pour ouvrir les menus, puis utilisez la souris ou le tactile pour nourrir, laver, jouer, explorer et décorer la pièce.",
        controlsHint2: "La souris et le tactile sont pris en charge. Réglages, gestion des sauvegardes et taille d’affichage se trouvent dans le menu du jeu officiel.",
        aboutTitle: "À propos",
        aboutHint: "Tamaweb est un jeu d’animal virtuel par autosam ; la version navigateur est chargée depuis la page officielle GitHub Pages. Créditez l’auteur et respectez CC BY-NC-SA 4.0 et les conditions non commerciales.",
        playing: "En cours : ",
        fullscreen: "Plein écran"
    },
    de: {
        pageTitle: "Tamaweb", reset: "Zurücksetzen", tabDemo: "Spiel",
        demoTitle: "Tamaweb - Virtuelles Haustier",
        demoDesc: "Ziehe ein virtuelles Haustier im Browser groß: füttere, reinige, spiele, gestalte Zimmer und beobachte das Wachstum über Tag, Nacht und Jahreszeiten. Das Spiel wird als Hotlink vom offiziellen statischen Build geladen.",
        demoHint: "Diese Seite enthält keinen Spielcode und keine Assets. Die offizielle Seite kann eigene Analysen oder Fehlerberichte laden; Spielstände liegen auf der offiziellen Domain. Nutze „In neuem Tab öffnen“ für ein besseres Erlebnis.",
        demoOpen: "Spiel starten",
        loading: "Wird gestartet, bitte warten...",
        loadingTip: "Diese Seite enthält keinen Spielcode und keine Assets. Die offizielle Seite kann eigene Analysen oder Fehlerberichte laden; Spielstände liegen auf der offiziellen Domain. Nutze „In neuem Tab öffnen“ für ein besseres Erlebnis.",
        instructions: "Anleitung",
        controlsTitle: "Steuerung",
        controlsHint1: "Klicke auf den Spielbildschirm, um Menüs zu öffnen, und nutze Maus oder Touch zum Füttern, Waschen, Spielen, Erkunden und Zimmerdekorieren.",
        controlsHint2: "Maus und Touch werden unterstützt. Einstellungen, Speicherverwaltung und Ansichtsgröße befinden sich im Menü des offiziellen Spiels.",
        aboutTitle: "Über",
        aboutHint: "Tamaweb ist ein virtuelles Haustier-Spiel von autosam; die Browser-Version wird von der offiziellen GitHub-Pages-Seite geladen. Nenne den Autor und beachte CC BY-NC-SA 4.0 sowie die nichtkommerziellen Bedingungen.",
        playing: "Läuft: ",
        fullscreen: "Vollbild"
    },
    es: {
        pageTitle: "Tamaweb", reset: "Reiniciar", tabDemo: "Juego",
        demoTitle: "Tamaweb - Mascota virtual",
        demoDesc: "Cuida una mascota virtual en el navegador: alimenta, limpia, juega, decora habitaciones y observa cómo crece con el día, la noche y las estaciones. El juego se carga mediante hotlink desde su compilación estática oficial.",
        demoHint: "Esta página no incluye código ni recursos del juego. La página oficial puede cargar sus propias analíticas o informes de error; las partidas se guardan en el dominio oficial. Usa «Abrir en una pestaña nueva» para una mejor experiencia.",
        demoOpen: "Iniciar juego",
        loading: "Iniciando, espera...",
        loadingTip: "Esta página no incluye código ni recursos del juego. La página oficial puede cargar sus propias analíticas o informes de error; las partidas se guardan en el dominio oficial. Usa «Abrir en una pestaña nueva» para una mejor experiencia.",
        instructions: "Instrucciones",
        controlsTitle: "Controles",
        controlsHint1: "Haz clic en la pantalla del juego para abrir los menús y usa ratón o tacto para alimentar, bañar, jugar, explorar y decorar la habitación.",
        controlsHint2: "Admite ratón y tacto. Ajustes, gestión de partidas y tamaño de vista están en el menú del juego oficial.",
        aboutTitle: "Acerca de",
        aboutHint: "Tamaweb es un juego de mascota virtual de autosam; la versión de navegador se carga desde la página oficial de GitHub Pages. Acredita al autor y respeta CC BY-NC-SA 4.0 y las condiciones no comerciales.",
        playing: "Ejecutando: ",
        fullscreen: "Pantalla completa"
    },
    ru: {
        pageTitle: "Tamaweb", reset: "Сбросить", tabDemo: "Игра",
        demoTitle: "Tamaweb - Виртуальный питомец",
        demoDesc: "Выращивайте виртуального питомца в браузере: кормите, мойте, играйте, украшайте комнату и наблюдайте рост в цикле дня, ночи и сезонов. Игра загружается горячей ссылкой с официальной статической сборки.",
        demoHint: "Эта страница не содержит кода или ресурсов игры. Официальная страница может загружать собственную аналитику или отчёты об ошибках; сохранения хранятся на официальном домене. Для удобства используйте «Открыть в новой вкладке».",
        demoOpen: "Запустить игру",
        loading: "Запуск, подождите...",
        loadingTip: "Эта страница не содержит кода или ресурсов игры. Официальная страница может загружать собственную аналитику или отчёты об ошибках; сохранения хранятся на официальном домене. Для удобства используйте «Открыть в новой вкладке».",
        instructions: "Инструкции",
        controlsTitle: "Управление",
        controlsHint1: "Нажмите на игровой экран, чтобы открыть меню, затем используйте мышь или касание: кормите, мойте, играйте, исследуйте и украшайте комнату.",
        controlsHint2: "Поддерживаются мышь и касание. Настройки, управление сохранениями и размер отображения находятся в меню официальной игры.",
        aboutTitle: "О игре",
        aboutHint: "Tamaweb — игра о виртуальном питомце авторства autosam; браузерная версия загружается с официальной страницы GitHub Pages. Указывайте автора и соблюдайте CC BY-NC-SA 4.0 и некоммерческие условия.",
        playing: "Запущено: ",
        fullscreen: "Полный экран"
    }
};

// ---- helpers
function $(id) { return document.getElementById(id); }
var currentLang = (localStorage.getItem('ewtv-lang') || 'en').split('-')[0];
if (!i18n[currentLang]) currentLang = 'en';
function t(key) { return (i18n[currentLang] && i18n[currentLang][key]) || i18n.en[key] || key; }
function applyI18n() { document.querySelectorAll('[data-i18n]').forEach(function (el) { var key = el.getAttribute('data-i18n'); if (i18n[currentLang] && i18n[currentLang][key]) el.textContent = i18n[currentLang][key]; }); document.documentElement.lang = currentLang; }
function showToast(msg) { var toast = $('toast'); if (!toast) return; $('toastMessage').textContent = msg; toast.classList.remove('hidden'); clearTimeout(showToast._timer); showToast._timer = setTimeout(function () { toast.classList.add('hidden'); }, 3000); }
var player = HotlinkPlayer.createPlayer({
    frameId: 'tamaFrame', overlayId: 'loadingOverlay', url: TAMAWEB_HOME, newTabUrl: TAMAWEB_HOME
});
function showPlayer() { $('uploadSection').classList.add('hidden'); $('playerSection').classList.add('active'); $('pageTitle').textContent = t('playing') + 'Tamaweb'; $('resetBtn').style.display = ''; $('fullscreenBtn').style.display = ''; }
function playGame() { if (!$('tamaFrame')) return; showPlayer(); player.start(); }
function stopPlayback() { player.stop(); $('playerSection').classList.remove('active'); $('uploadSection').classList.remove('hidden'); $('pageTitle').textContent = t('pageTitle'); $('resetBtn').style.display = 'none'; $('fullscreenBtn').style.display = 'none'; }
$('demoOpenBtn').addEventListener('click', playGame);
(function () { var link = $('demoOpenNewTab'); if (link) link.href = TAMAWEB_HOME; })();
$('backBtn').addEventListener('click', function () { if ($('playerSection').classList.contains('active')) { stopPlayback(); return; } window.location.href = '../routes/game.html?category=webgames'; });
$('resetBtn').addEventListener('click', stopPlayback);
$('fullscreenBtn').addEventListener('click', function () { var wrapper = $('tamaWrapper'); if (!wrapper) return; if (document.fullscreenElement) document.exitFullscreen(); else if (wrapper.requestFullscreen) wrapper.requestFullscreen(); });
document.addEventListener('fullscreenchange', function () { var icon = $('fullscreenBtn').querySelector('i'); if (icon) icon.className = document.fullscreenElement ? 'fas fa-compress' : 'fas fa-expand'; });
(function () { var header = $('instructionsHeader'); var toggle = $('instructionsToggle'); if (!header || !toggle) return; header.addEventListener('click', function () { $('instructionsContent').classList.toggle('collapsed'); toggle.classList.toggle('fa-chevron-up'); toggle.classList.toggle('fa-chevron-down'); }); })();

applyI18n();
