// Browser-port page JS - hot-linked, iframe-embedded classic games rebuilt to
// run natively in the browser from their decompiled / reimplemented source.
// Nothing is bundled here: the engine and game pages are hosted upstream and
// shown in an iframe. Each game credits its upstream project and makes clear
// whether the user must supply their own game data.

var BROWSER_PORTS = {
    legoisland: {
        name: 'LEGO Island',
        url: 'https://isle.pizza/',
        repo: 'https://github.com/isledecomp/isle',
        license: 'open-source decompilation (isledecomp)',
        noAssets: true
    }
};

var _params = new URLSearchParams(window.location.search);
var _key = _params.get('game');
var game = BROWSER_PORTS[_key] || null;

// Internationalization (8 languages, same key set as the other recomp pages).
var i18n = {
    zh: {
        pageTitle: '网页移植游戏',
        reset: '重置',
        tabDemo: '游戏',
        demoTitle: '乐高海岛（1997）',
        demoDesc: '1997 年经典《乐高海岛》冒险，由 isledecomp 项目从反编译源码忠实重构。浏览器直接运行，无需下载、ROM 或游戏文件。',
        demoOpen: '启动游戏',
        demoHint: '热链自 isle.pizza 开源反编译重构版，无需任何游戏文件或 ROM。点击启动即可在本页游玩；想要全屏可用新标签页链接。非官方粉丝项目，与乐高集团无关联或背书。',
        openInNewTab: '在新标签页打开 ↗',
        instructions: '使用说明',
        controlsTitle: '操作方式',
        controlsHint1: '使用键盘、鼠标或手柄操作；先点击游戏区域以接收输入',
        controlsHint2: '按 Esc 释放键盘；设置与存档请使用游戏内菜单',
        aboutTitle: '关于',
        aboutHint: '《乐高海岛》由 isledecomp 从原始反编译源码重构，通过 WebAssembly 在浏览器运行。这是源代码级重建而非 ROM 模拟器，无需游戏数据。与乐高集团无关联。',
        loading: '游戏启动中，请稍候...',
        loadingTip: '游戏从官方站点加载，首次启动可能需要一些时间',
        playing: '正在运行：',
        fullscreen: '全屏',
        invalidGame: '找不到这个游戏，请从游戏列表中重新选择。'
    },
    en: {
        pageTitle: 'Browser Port',
        reset: 'Reset',
        tabDemo: 'Game',
        demoTitle: 'LEGO Island (1997)',
        demoDesc: 'The classic 1997 LEGO Island adventure, faithfully rebuilt from its decompiled source by the isledecomp project. Runs directly in the browser - no download, no ROM, no game files needed.',
        demoOpen: 'Launch Game',
        demoHint: 'Hot-linked from isle.pizza, an open-source decompilation rebuild. No game files or ROM required. Click Launch to play inside this page; use the new-tab link for full screen. Unofficial fan project, not affiliated with or endorsed by The LEGO Group.',
        openInNewTab: 'Open in a new tab ↗',
        instructions: 'Instructions',
        controlsTitle: 'Controls',
        controlsHint1: 'Use keyboard, mouse or a gamepad; click inside the game area first so it receives input',
        controlsHint2: 'Press Esc to release the keyboard; use the in-game menus for settings and saves',
        aboutTitle: 'About',
        aboutHint: 'LEGO Island was rebuilt from original decompiled source code by isledecomp and runs in the browser via WebAssembly. It is a source-level reconstruction, not a ROM emulator, and needs no game data. Not affiliated with The LEGO Group.',
        loading: 'Starting the game, please wait...',
        loadingTip: 'The game loads from its official host; first launch can take a while',
        playing: 'Now running: ',
        fullscreen: 'Fullscreen',
        invalidGame: 'That game was not found. Please choose one from the game list.'
    },
    ja: {
        pageTitle: 'ブラウザ移植ゲーム',
        reset: 'リセット',
        tabDemo: 'ゲーム',
        demoTitle: 'LEGO アイランド（1997）',
        demoDesc: '1997 年の名作「LEGO アイランド」を isledecomp が非コンパイルソースから忠実に再構築。ブラウザで直接遊べ、ダウンロード・ROM・ゲームファイルは不要です。',
        demoOpen: 'ゲームを起動',
        demoHint: 'isle.pizza のオープンソース非コンパイル再構築版をホットリンク。ゲームファイルや ROM は不要です。「起動」を押すとこのページで遊べます。全画面は新しいタブリンクをご利用ください。非公式ファンプロジェクトで、レゴグループの公認ではありません。',
        openInNewTab: '新しいタブで開く ↗',
        instructions: '使い方',
        controlsTitle: '操作方法',
        controlsHint1: 'キーボード、マウス、またはゲームパッドで操作します。先にゲーム領域をクリックして入力を有効にしてください',
        controlsHint2: 'Esc でキーボード入力を解放します。設定やセーブはゲーム内メニューを使用してください',
        aboutTitle: 'について',
        aboutHint: '「LEGO アイランド」は isledecomp がオリジナルの非コンパイルソースから再構築し、WebAssembly でブラウザ動作するものです。ROM エミュレータではなく、ソースレベルの再構築でゲームデータは不要です。レゴグループとは無関係です。',
        loading: 'ゲームを起動中...',
        loadingTip: 'ゲームは公式サイトから読み込まれます。初回は時間がかかることがあります',
        playing: '実行中：',
        fullscreen: '全画面',
        invalidGame: 'ゲームが見つかりません。ゲーム一覧から選び直してください。'
    },
    ko: {
        pageTitle: '브라우저 포트 게임',
        reset: '재설정',
        tabDemo: '게임',
        demoTitle: 'LEGO Island (1997)',
        demoDesc: '1997년 고전 「LEGO Island」 모험을 isledecomp가 디컴파일 소스에서 충실히 재구현했습니다. 브라우저에서 바로 플레이하며 다운로드·ROM·게임 파일이 필요 없습니다.',
        demoOpen: '게임 실행',
        demoHint: '오픈 소스 디컴파일 재구현인 isle.pizza를 핫링크합니다. 게임 파일이나 ROM이 필요 없습니다. 「실행」을 누르면 이 페이지에서 플레이할 수 있고, 전체 화면은 새 탭 링크를 사용하세요. 비공식 팬 프로젝트이며 LEGO 그룹과 관련이 없습니다.',
        openInNewTab: '새 탭에서 열기 ↗',
        instructions: '사용법',
        controlsTitle: '조작',
        controlsHint1: '키보드, 마우스 또는 게임패드로 조작합니다. 먼저 게임 영역을 클릭해 입력을 받으세요',
        controlsHint2: 'Esc로 키보드 입력을 해제합니다. 설정과 세이브는 게임 내 메뉴를 사용하세요',
        aboutTitle: '정보',
        aboutHint: '「LEGO Island」는 isledecomp가 원본 디컴파일 소스에서 재구현하여 WebAssembly로 브라우저에서 실행합니다. ROM 에뮬레이터가 아닌 소스 수준 재구현이며 게임 데이터가 필요 없습니다. LEGO 그룹과 관련이 없습니다.',
        loading: '게임을 실행 중...',
        loadingTip: '게임은 공식 호스트에서 로드됩니다. 첫 실행은 시간이 걸릴 수 있습니다',
        playing: '실행 중: ',
        fullscreen: '전체 화면',
        invalidGame: '게임을 찾을 수 없습니다. 게임 목록에서 다시 선택하세요.'
    },
    fr: {
        pageTitle: 'Port navigateur',
        reset: 'Réinitialiser',
        tabDemo: 'Jeu',
        demoTitle: 'LEGO Island (1997)',
        demoDesc: 'L\'aventure classique LEGO Island (1997), fidèlement reconstruite à partir de source décompilée par le projet isledecomp. Fonctionne directement dans le navigateur - aucun téléchargement, ROM ou fichier de jeu requis.',
        demoOpen: 'Lancer le jeu',
        demoHint: 'Hot-link de isle.pizza, une reconstruction open source décompilée. Aucun fichier de jeu ni ROM requis. Cliquez sur Lancer pour jouer dans cette page ; utilisez le lien nouvel onglet pour le plein écran. Projet fan non officiel, non affilié ni approuvé par The LEGO Group.',
        openInNewTab: 'Ouvrir dans un nouvel onglet ↗',
        instructions: 'Instructions',
        controlsTitle: 'Commandes',
        controlsHint1: 'Utilisez le clavier, la souris ou une manette ; cliquez d\'abord dans la zone de jeu pour activer la saisie',
        controlsHint2: 'Appuyez sur Échap pour libérer le clavier ; utilisez les menus du jeu pour les réglages et les sauvegardes',
        aboutTitle: 'À propos',
        aboutHint: 'LEGO Island a été reconstruit à partir du code source décompilé d\'origine par isledecomp et fonctionne dans le navigateur via WebAssembly. C\'est une reconstruction au niveau source, pas un émulateur de ROM, et aucun fichier de jeu n\'est requis. Non affilié à The LEGO Group.',
        loading: 'Lancement du jeu, veuillez patienter...',
        loadingTip: 'Le jeu se charge depuis son hébergeur officiel ; le premier lancement peut être long',
        playing: 'En cours : ',
        fullscreen: 'Plein écran',
        invalidGame: 'Jeu introuvable. Choisissez-en un dans la liste.'
    },
    de: {
        pageTitle: 'Browser-Port',
        reset: 'Zurücksetzen',
        tabDemo: 'Spiel',
        demoTitle: 'LEGO Island (1997)',
        demoDesc: 'Das klassische LEGO Island-Abenteuer (1997), vom isledecomp-Projekt originalgetreu aus dekompiliertem Quellcode neu gebaut. Läuft direkt im Browser - kein Download, keine ROM, keine Spieldateien nötig.',
        demoOpen: 'Spiel starten',
        demoHint: 'Hotlink von isle.pizza, einem Open-Source-Dekompilations-Rebuild. Keine Spieldateien oder ROM nötig. Klicke auf Start, um hier zu spielen; für Vollbild den Link im neuen Tab nutzen. Inoffizielles Fanprojekt, nicht mit The LEGO Group verbunden oder von ihr unterstützt.',
        openInNewTab: 'In neuem Tab öffnen ↗',
        instructions: 'Anleitung',
        controlsTitle: 'Steuerung',
        controlsHint1: 'Tastatur, Maus oder Gamepad verwenden; zuerst auf den Spielbereich klicken, damit Eingaben ankommen',
        controlsHint2: 'Mit Esc die Tastatur freigeben; Einstellungen und Speichern über die Menüs im Spiel',
        aboutTitle: 'Über',
        aboutHint: 'LEGO Island wurde von isledecomp aus dem ursprünglichen dekompilierten Quellcode neu gebaut und läuft im Browser via WebAssembly. Es ist eine Rekonstruktion auf Quellcode-Ebene, kein ROM-Emulator, und braucht keine Spieldateien. Nicht mit The LEGO Group verbunden.',
        loading: 'Spiel wird gestartet, bitte warten...',
        loadingTip: 'Das Spiel lädt vom offiziellen Host; der erste Start kann dauern',
        playing: 'Läuft: ',
        fullscreen: 'Vollbild',
        invalidGame: 'Spiel nicht gefunden. Bitte aus der Liste wählen.'
    },
    es: {
        pageTitle: 'Port para navegador',
        reset: 'Reiniciar',
        tabDemo: 'Juego',
        demoTitle: 'LEGO Island (1997)',
        demoDesc: 'La clásica aventura LEGO Island (1997), reconstruida fielmente desde el código descompilado por el proyecto isledecomp. Funciona directamente en el navegador: sin descargas, ROM ni archivos de juego.',
        demoOpen: 'Iniciar juego',
        demoHint: 'Hotlink de isle.pizza, una reconstrucción de código abierto descompilada. No se necesitan archivos de juego ni ROM. Pulsa Iniciar para jugar aquí; usa el enlace en pestaña nueva para pantalla completa. Proyecto fan no oficial, sin relación ni respaldo de The LEGO Group.',
        openInNewTab: 'Abrir en una pestaña nueva ↗',
        instructions: 'Instrucciones',
        controlsTitle: 'Controles',
        controlsHint1: 'Usa teclado, ratón o mando; haz clic primero en el área de juego para recibir entradas',
        controlsHint2: 'Pulsa Esc para liberar el teclado; usa los menús del juego para ajustes y partidas guardadas',
        aboutTitle: 'Acerca de',
        aboutHint: 'LEGO Island fue reconstruido por isledecomp a partir del código descompilado original y funciona en el navegador mediante WebAssembly. Es una reconstrucción a nivel de fuente, no un emulador de ROM, y no requiere datos de juego. Sin relación con The LEGO Group.',
        loading: 'Iniciando el juego, espera...',
        loadingTip: 'El juego se carga desde su host oficial; el primer inicio puede tardar',
        playing: 'Ejecutando: ',
        fullscreen: 'Pantalla completa',
        invalidGame: 'Juego no encontrado. Elígelo de la lista.'
    },
    ru: {
        pageTitle: 'Браузерный порт',
        reset: 'Сброс',
        tabDemo: 'Игра',
        demoTitle: 'LEGO Island (1997)',
        demoDesc: 'Классическое приключение LEGO Island (1997), точно пересобранное проектом isledecomp из декомпилированного исходного кода. Работает прямо в браузере - без загрузок, ROM и файлов игры.',
        demoOpen: 'Запустить игру',
        demoHint: 'Горячая ссылка на isle.pizza, открытую декомпилированную пересборку. Файлы игры и ROM не нужны. Нажмите «Запустить», чтобы играть здесь; для полного экрана используйте ссылку в новой вкладке. Неофициальный фанатский проект, не связанный с The LEGO Group и не одобренный ею.',
        openInNewTab: 'Открыть в новой вкладке ↗',
        instructions: 'Инструкции',
        controlsTitle: 'Управление',
        controlsHint1: 'Используйте клавиатуру, мышь или геймпад; сначала щёлкните по игровой области для ввода',
        controlsHint2: 'Нажмите Esc, чтобы освободить клавиатуру; настройки и сохранения — в меню игры',
        aboutTitle: 'О проекте',
        aboutHint: 'LEGO Island пересобран isledecomp из исходного декомпилированного кода и работает в браузере через WebAssembly. Это реконструкция на уровне исходного кода, а не эмулятор ROM, и она не требует данных игры. Не связан с The LEGO Group.',
        loading: 'Запуск игры, подождите...',
        loadingTip: 'Игра загружается с официального хоста; первый запуск может быть долгим',
        playing: 'Запущено: ',
        fullscreen: 'Полный экран',
        invalidGame: 'Игра не найдена. Выберите её из списка.'
    }
};



// ---- helpers -----------------------------------------------------------
function $(id) { return document.getElementById(id); }
var currentLang = (localStorage.getItem('ewtv-lang') || 'en').split('-')[0];
if (!i18n[currentLang]) currentLang = 'en';

function t(key, fallback) {
    return (i18n[currentLang] && i18n[currentLang][key]) || i18n.en[key] || fallback || key;
}

function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        var value = i18n[currentLang] && i18n[currentLang][key];
        if (value) el.textContent = value;
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

var player = HotlinkPlayer.createPlayer({
    frameId: 'bpFrame',
    url: function () { return game ? game.url : ''; },
    newTabUrl: function () { return game ? game.url : ''; }
});

function showPlayer(title) {
    $('uploadSection').classList.add('hidden');
    $('playerSection').classList.add('active');
    $('pageTitle').textContent = t('playing') + (title || '');
    $('resetBtn').style.display = '';
    $('fullscreenBtn').style.display = '';
}

function stopPlayback() {
    player.stop();
    $('playerSection').classList.remove('active');
    $('uploadSection').classList.remove('hidden');
    $('pageTitle').textContent = t('pageTitle');
    $('resetBtn').style.display = 'none';
    $('fullscreenBtn').style.display = 'none';
}

function playGame() {
    if (!game) { showToast(t('invalidGame')); return; }
    if (!$('bpFrame')) return;
    showPlayer(game.name);
    player.start();
}

// ---- controls -----------------------------------------------------------
$('demoOpenBtn').addEventListener('click', playGame);
$('fullscreenBtn').addEventListener('click', function () {
    var frame = $('bpFrame');
    if (!frame) return;
    if (document.fullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen();
    } else if (frame.requestFullscreen) {
        frame.requestFullscreen();
    } else if (frame.webkitRequestFullscreen) {
        frame.webkitRequestFullscreen();
    }
});
$('backBtn').addEventListener('click', function () {
    if ($('playerSection').classList.contains('active')) { stopPlayback(); return; }
    window.location.href = '../routes/game.html?category=recomp';
});
$('resetBtn').addEventListener('click', stopPlayback);
$('instructionsHeader').addEventListener('click', function () {
    $('instructionsContent').classList.toggle('hidden');
    var icon = $('instructionsToggle');
    if (icon) {
        icon.style.transform = $('instructionsContent').classList.contains('hidden') ? '' : 'rotate(180deg)';
    }
});

applyI18n();
// ---- init ---------------------------------------------------------------
(function () {
    if (!game) {
        $('demoOpenBtn').disabled = true;
        $('demoTitle').textContent = t('invalidGame');
        showToast(t('invalidGame'));
        return;
    }
    var link = $('demoOpenNewTab');
    if (link) link.href = game.url;
})();

