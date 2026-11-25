// Casa de Gemas page controller - hot-linked official static build.
// No game code or assets are bundled by this host.

var CASA_HOME = 'https://deepujain.github.io/casadegema/';

var i18n = {
    zh: {
        pageTitle: "Casa de Gemas", reset: "重置", tabDemo: "游戏",
        demoTitle: "Casa de Gemas 隐藏宝石",
        demoDesc: "在一座水彩风的西班牙小屋里寻找四季隐藏宝石：摇晃树枝、浇水、扫开落叶，听猫头鹰 Oli 讲述春天到冬天的故事。游戏由官方静态页面热链提供。",
        demoHint: "本页不内置游戏代码或素材——画面由 Canvas 绘制，音乐与音效由 Web Audio 生成；「在新标签页打开」可使用姓名和季节等 URL 参数。",
        demoOpen: "启动游戏",
        loading: "启动中，请稍候...",
        loadingTip: "本页不内置游戏代码或素材——画面由 Canvas 绘制，音乐与音效由 Web Audio 生成；「在新标签页打开」可使用姓名和季节等 URL 参数。",
        loadingSlow: "本页不内置游戏代码或素材——画面由 Canvas 绘制，音乐与音效由 Web Audio 生成；「在新标签页打开」可使用姓名和季节等 URL 参数。",
        openInNewTab: "在新标签页打开游戏 ↗",
        instructions: "使用说明",
        controlsTitle: "操作方式",
        controlsHint1: "用鼠标拖拽环视庭院，点击或拖动物件来摇树、浇水、扫叶；找到当前季节的所有宝石，最后一个雪日会出现生日惊喜。",
        controlsHint2: "桌面版适合鼠标操作，官方也提供手机触屏版；音效默认静音，点击页面里的扬声器图标开启。",
        aboutTitle: "关于",
        aboutHint: "Casa de Gemas 是 Claude Opus 5.5 全程对话生成的水彩风互动花园，使用 Canvas 2D 与 Web Audio，无外部图片或音频文件。作者 deepujain，MIT 许可证。",
        playing: "正在运行：",
        fullscreen: "全屏"
    },
    en: {
        pageTitle: "Casa de Gemas", reset: "Reset", tabDemo: "Game",
        demoTitle: "Casa de Gemas Hidden Gems",
        demoDesc: "Find seasonal hidden gems in a watercolor Spanish house: shake branches, water the garden, rake leaves and listen to Oli the owl tell the story from spring to winter. The game is hot-linked from its official static build.",
        demoHint: "This host bundles no game code or assets - visuals are drawn with Canvas and music/sound are generated with Web Audio. Use “Open in a new tab” to use name and season URL parameters.",
        demoOpen: "Launch Game",
        loading: "Starting, please wait...",
        loadingTip: "This host bundles no game code or assets - visuals are drawn with Canvas and music/sound are generated with Web Audio. Use “Open in a new tab” to use name and season URL parameters.",
        loadingSlow: "This host bundles no game code or assets - visuals are drawn with Canvas and music/sound are generated with Web Audio. Use “Open in a new tab” to use name and season URL parameters.",
        openInNewTab: "Open the game in a new tab ↗",
        instructions: "Instructions",
        controlsTitle: "Controls",
        controlsHint1: "Drag with the mouse to look around the courtyard, then click or drag objects to shake trees, pour water and rake leaves. Find every gem in the current season to reveal the final snowy-day surprise.",
        controlsHint2: "The desktop version is designed for mouse input; the author also provides a mobile touch version. Sound starts muted - click the speaker icon in the page to enable it.",
        aboutTitle: "About",
        aboutHint: "Casa de Gemas is an interactive watercolor garden built entirely through conversation with Claude Opus 5.5, using Canvas 2D and Web Audio with no external image or audio files. By deepujain, MIT licensed.",
        playing: "Now running: ",
        fullscreen: "Fullscreen"
    },
    ja: {
        pageTitle: "Casa de Gemas", reset: "リセット", tabDemo: "ゲーム",
        demoTitle: "Casa de Gemas 隠された宝石",
        demoDesc: "水彩風のスペインの家で季節ごとの宝石を探しましょう。枝を揺らし、水をやり、落ち葉を掃きながら、フクロウのOliが春から冬までを語ります。公式静的ページをホットリンクしています。",
        demoHint: "このホストページはゲームコードや素材を同梱しません。映像はCanvasで描かれ、音楽と効果音はWeb Audioで生成されます。新しいタブで開くと名前や季節のURLパラメータも使えます。",
        demoOpen: "ゲームを起動",
        loading: "起動中...",
        loadingTip: "このホストページはゲームコードや素材を同梱しません。映像はCanvasで描かれ、音楽と効果音はWeb Audioで生成されます。新しいタブで開くと名前や季節のURLパラメータも使えます。",
        loadingSlow: "このホストページはゲームコードや素材を同梱しません。映像はCanvasで描かれ、音楽と効果音はWeb Audioで生成されます。新しいタブで開くと名前や季節のURLパラメータも使えます。",
        openInNewTab: "新しいタブで開く ↗",
        instructions: "使い方",
        controlsTitle: "操作方法",
        controlsHint1: "マウスでドラッグして庭を見渡し、物件をクリックまたはドラッグして木を揺らしたり、水をやったり、落ち葉を掃いたりします。季節ごとの宝石をすべて見つけると雪の日のサプライズが現れます。",
        controlsHint2: "デスクトップ版はマウス操作向けです。作者はスマホ向けタッチ版も提供しています。音は最初ミュートなので、ページ内のスピーカーアイコンをクリックして有効にしてください。",
        aboutTitle: "について",
        aboutHint: "Casa de GemasはClaude Opus 5.5との対話だけで作られた水彩風インタラクティブ庭園です。Canvas 2DとWeb Audioを使い、外部の画像・音声ファイルはありません。作者deepujain、MITライセンス。",
        playing: "実行中：",
        fullscreen: "全画面"
    },
    ko: {
        pageTitle: "Casa de Gemas", reset: "재설정", tabDemo: "게임",
        demoTitle: "Casa de Gemas 숨겨진 보석",
        demoDesc: "수채화풍 스페인 집에서 계절별 숨겨진 보석을 찾으세요. 가지를 흔들고 물을 주고 낙엽을 쓸며 올빼미 Oli가 봄부터 겨울까지 들려줍니다. 공식 정적 페이지를 핫링크합니다.",
        demoHint: "이 페이지는 게임 코드나 애셋을 포함하지 않습니다. 화면은 Canvas로 그려지고 음악과 효과음은 Web Audio로 생성됩니다. 새 탭에서 열면 이름과 계절 URL 매개변수를 사용할 수 있습니다.",
        demoOpen: "게임 시작",
        loading: "시작하는 중...",
        loadingTip: "이 페이지는 게임 코드나 애셋을 포함하지 않습니다. 화면은 Canvas로 그려지고 음악과 효과음은 Web Audio로 생성됩니다. 새 탭에서 열면 이름과 계절 URL 매개변수를 사용할 수 있습니다.",
        loadingSlow: "이 페이지는 게임 코드나 애셋을 포함하지 않습니다. 화면은 Canvas로 그려지고 음악과 효과음은 Web Audio로 생성됩니다. 새 탭에서 열면 이름과 계절 URL 매개변수를 사용할 수 있습니다.",
        openInNewTab: "새 탭에서 게임 열기 ↗",
        instructions: "사용법",
        controlsTitle: "조작",
        controlsHint1: "마우스로 드래그해 정원을 둘러보고 사물을 클릭하거나 드래그해 나무를 흔들고, 물을 주고, 낙엽을 쓸으세요. 해당 계절의 보석을 모두 찾으면 마지막 눈 오는 날의 놀라움이 나타납니다.",
        controlsHint2: "데스크톱 버전은 마우스 입력용이며 작성자가 모바일 터치 버전도 제공합니다. 소리는 기본적으로 음소거이므로 페이지의 스피커 아이콘을 눌러 켜세요.",
        aboutTitle: "정보",
        aboutHint: "Casa de Gemas는 Claude Opus 5.5와의 대화만으로 만들어진 수채화풍 인터랙티브 정원입니다. Canvas 2D와 Web Audio를 사용하며 외부 이미지나 오디오 파일이 없습니다. 제작자 deepujain, MIT 라이선스.",
        playing: "실행 중: ",
        fullscreen: "전체 화면"
    },
    fr: {
        pageTitle: "Casa de Gemas", reset: "Réinitialiser", tabDemo: "Jeu",
        demoTitle: "Casa de Gemas - Pierres cachées",
        demoDesc: "Trouvez les gemmes cachées de chaque saison dans une maison espagnole aquarelle : secouez les branches, arrosez le jardin, ratissez les feuilles et écoutez Oli le hibou raconter le printemps à l’hiver. Le jeu est hot-linké depuis sa version statique officielle.",
        demoHint: "Cette page ne regroupe aucun code ni asset de jeu - les visuels sont dessinés avec Canvas et la musique/les sons sont générés avec Web Audio. Utilisez « Ouvrir dans un nouvel onglet » pour les paramètres de nom et de saison.",
        demoOpen: "Lancer le jeu",
        loading: "Démarrage, veuillez patienter...",
        loadingTip: "Cette page ne regroupe aucun code ni asset de jeu - les visuels sont dessinés avec Canvas et la musique/les sons sont générés avec Web Audio. Utilisez « Ouvrir dans un nouvel onglet » pour les paramètres de nom et de saison.",
        loadingSlow: "Cette page ne regroupe aucun code ni asset de jeu - les visuels sont dessinés avec Canvas et la musique/les sons sont générés avec Web Audio. Utilisez « Ouvrir dans un nouvel onglet » pour les paramètres de nom et de saison.",
        openInNewTab: "Ouvrir le jeu dans un nouvel onglet ↗",
        instructions: "Instructions",
        controlsTitle: "Commandes",
        controlsHint1: "Faites glisser la souris pour explorer la cour, puis cliquez ou glissez sur les objets pour secouer les arbres, arroser et ratisser. Trouvez toutes les gemmes de la saison pour révéler la surprise du dernier jour de neige.",
        controlsHint2: "La version ordinateur est conçue pour la souris ; l’auteur propose aussi une version tactile mobile. Le son est coupé par défaut - cliquez sur l’icône du haut-parleur dans la page.",
        aboutTitle: "À propos",
        aboutHint: "Casa de Gemas est un jardin interactif aquarelle créé entièrement par conversation avec Claude Opus 5.5, avec Canvas 2D et Web Audio, sans fichiers image ou audio externes. Par deepujain, licence MIT.",
        playing: "En cours : ",
        fullscreen: "Plein écran"
    },
    de: {
        pageTitle: "Casa de Gemas", reset: "Zurücksetzen", tabDemo: "Spiel",
        demoTitle: "Casa de Gemas - Versteckte Edelsteine",
        demoDesc: "Finde saisonale versteckte Edelsteine in einem aquarellfarbenen spanischen Haus: schüttle Zweige, gieße den Garten, reche Blätter und höre der Eule Oli von Frühling bis Winter zu. Das Spiel wird als Hotlink vom offiziellen statischen Build geladen.",
        demoHint: "Diese Seite enthält keinen Spielcode und keine Assets - Bilder werden mit Canvas gezeichnet, Musik und Sound mit Web Audio erzeugt. Nutze „In neuem Tab öffnen“ für Namens- und Jahreszeit-URL-Parameter.",
        demoOpen: "Spiel starten",
        loading: "Wird gestartet, bitte warten...",
        loadingTip: "Diese Seite enthält keinen Spielcode und keine Assets - Bilder werden mit Canvas gezeichnet, Musik und Sound mit Web Audio erzeugt. Nutze „In neuem Tab öffnen“ für Namens- und Jahreszeit-URL-Parameter.",
        loadingSlow: "Diese Seite enthält keinen Spielcode und keine Assets - Bilder werden mit Canvas gezeichnet, Musik und Sound mit Web Audio erzeugt. Nutze „In neuem Tab öffnen“ für Namens- und Jahreszeit-URL-Parameter.",
        openInNewTab: "Spiel in neuem Tab öffnen ↗",
        instructions: "Anleitung",
        controlsTitle: "Steuerung",
        controlsHint1: "Ziehe mit der Maus, um den Hof anzusehen, und klicke oder ziehe Objekte, um Bäume zu schütteln, zu gießen und Blätter zu rechen. Finde alle Edelsteine der Jahreszeit für die Überraschung am letzten Schneetag.",
        controlsHint2: "Die Desktop-Version ist für Mausbedienung ausgelegt; der Autor bietet auch eine mobile Touch-Version. Ton ist standardmäßig aus - klicke auf das Lautsprechersymbol in der Seite.",
        aboutTitle: "Über",
        aboutHint: "Casa de Gemas ist ein interaktiver Aquarell-Garten, der vollständig im Gespräch mit Claude Opus 5.5 entstand. Er nutzt Canvas 2D und Web Audio ohne externe Bild- oder Audiodateien. Von deepujain, MIT-lizenziert.",
        playing: "Läuft: ",
        fullscreen: "Vollbild"
    },
    es: {
        pageTitle: "Casa de Gemas", reset: "Reiniciar", tabDemo: "Juego",
        demoTitle: "Casa de Gemas - Gemas ocultas",
        demoDesc: "Encuentra gemas ocultas de cada estación en una casa española acuarela: sacude ramas, riega el jardín, recoge hojas y escucha a Oli el búho contar la historia de primavera a invierno. El juego se carga mediante hotlink desde su compilación estática oficial.",
        demoHint: "Esta página no incluye código ni recursos del juego: las imágenes se dibujan con Canvas y la música y los efectos se generan con Web Audio. Usa «Abrir en una pestaña nueva» para los parámetros de nombre y estación.",
        demoOpen: "Iniciar juego",
        loading: "Iniciando, espera...",
        loadingTip: "Esta página no incluye código ni recursos del juego: las imágenes se dibujan con Canvas y la música y los efectos se generan con Web Audio. Usa «Abrir en una pestaña nueva» para los parámetros de nombre y estación.",
        loadingSlow: "Esta página no incluye código ni recursos del juego: las imágenes se dibujan con Canvas y la música y los efectos se generan con Web Audio. Usa «Abrir en una pestaña nueva» para los parámetros de nombre y estación.",
        openInNewTab: "Abrir el juego en una pestaña nueva ↗",
        instructions: "Instrucciones",
        controlsTitle: "Controles",
        controlsHint1: "Arrastra con el ratón para mirar el patio y haz clic o arrastra objetos para sacudir árboles, regar y recoger hojas. Encuentra todas las gemas de la estación para descubrir la sorpresa del último día de nieve.",
        controlsHint2: "La versión de escritorio está pensada para ratón; el autor también ofrece una versión táctil móvil. El sonido empieza silenciado: pulsa el icono del altavoz en la página.",
        aboutTitle: "Acerca de",
        aboutHint: "Casa de Gemas es un jardín interactivo en acuarela creado completamente mediante conversación con Claude Opus 5.5, con Canvas 2D y Web Audio y sin archivos de imagen o audio externos. Por deepujain, licencia MIT.",
        playing: "Ejecutando: ",
        fullscreen: "Pantalla completa"
    },
    ru: {
        pageTitle: "Casa de Gemas", reset: "Сбросить", tabDemo: "Игра",
        demoTitle: "Casa de Gemas - Скрытые самоцветы",
        demoDesc: "Ищите сезонные скрытые самоцветы в акварельном испанском доме: тресите ветки, поливайте сад, сгребайте листья и слушайте сову Оли, рассказывающую историю от весны до зимы. Игра загружается горячей ссылкой с официальной статической сборки.",
        demoHint: "Эта страница не содержит кода или ресурсов игры — изображения рисуются через Canvas, а музыка и звуки создаются через Web Audio. Используйте «Открыть в новой вкладке» для параметров имени и времени года.",
        demoOpen: "Запустить игру",
        loading: "Запуск, подождите...",
        loadingTip: "Эта страница не содержит кода или ресурсов игры — изображения рисуются через Canvas, а музыка и звуки создаются через Web Audio. Используйте «Открыть в новой вкладке» для параметров имени и времени года.",
        loadingSlow: "Эта страница не содержит кода или ресурсов игры — изображения рисуются через Canvas, а музыка и звуки создаются через Web Audio. Используйте «Открыть в новой вкладке» для параметров имени и времени года.",
        openInNewTab: "Открыть игру в новой вкладке ↗",
        instructions: "Инструкции",
        controlsTitle: "Управление",
        controlsHint1: "Тяните мышью, чтобы осмотреть двор, затем щелкайте или тяните предметы, чтобы трясти деревья, поливать и сгребать листья. Найдите все самоцветы сезона, чтобы увидеть сюрприз в последний снежный день.",
        controlsHint2: "Версия для компьютера рассчитана на мышь; автор также предоставляет мобильную сенсорную версию. Звук по умолчанию выключен — нажмите значок динамика на странице.",
        aboutTitle: "О игре",
        aboutHint: "Casa de Gemas — интерактивный акварельный сад, созданный полностью в диалоге с Claude Opus 5.5. Он использует Canvas 2D и Web Audio без внешних файлов изображений или звука. Автор deepujain, лицензия MIT.",
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
    frameId: 'casaFrame', overlayId: 'loadingOverlay', url: CASA_HOME, newTabUrl: CASA_HOME
});
function showPlayer() { $('uploadSection').classList.add('hidden'); $('playerSection').classList.add('active'); $('pageTitle').textContent = t('playing') + "Casa de Gemas"; $('resetBtn').style.display = ''; $('fullscreenBtn').style.display = ''; }
function playGame() { if (!$('casaFrame')) return; showPlayer(); player.start(); }
function stopPlayback() { player.stop(); $('playerSection').classList.remove('active'); $('uploadSection').classList.remove('hidden'); $('pageTitle').textContent = t('pageTitle'); $('resetBtn').style.display = 'none'; $('fullscreenBtn').style.display = 'none'; }
$('demoOpenBtn').addEventListener('click', playGame);
(function () { var link = $('demoOpenNewTab'); if (link) link.href = CASA_HOME; })();
$('backBtn').addEventListener('click', function () { if ($('playerSection').classList.contains('active')) { stopPlayback(); return; } window.location.href = '../routes/game.html?category=webgames'; });
$('resetBtn').addEventListener('click', stopPlayback);
$('fullscreenBtn').addEventListener('click', function () { var wrapper = $('casaWrapper'); if (!wrapper) return; if (document.fullscreenElement) document.exitFullscreen(); else if (wrapper.requestFullscreen) wrapper.requestFullscreen(); });
document.addEventListener('fullscreenchange', function () { var icon = $('fullscreenBtn').querySelector('i'); if (icon) icon.className = document.fullscreenElement ? 'fas fa-compress' : 'fas fa-expand'; });
(function () { var header = $('instructionsHeader'); var toggle = $('instructionsToggle'); if (!header || !toggle) return; header.addEventListener('click', function () { $('instructionsContent').classList.toggle('collapsed'); toggle.classList.toggle('fa-chevron-up'); toggle.classList.toggle('fa-chevron-down'); }); })();
applyI18n();
