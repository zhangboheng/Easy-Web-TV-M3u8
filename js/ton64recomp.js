// N64 Static Recomp Page JavaScript - curated N64Recomp browser builds from
// n64hub.com, embedded by hotlink. No ROMs, engines or game data are bundled:
// players must lawfully supply their own ROM inside the upstream app. These
// are independent, unofficial projects not endorsed by Nintendo.

var N64HUB_HOME = 'https://n64hub.com/';

// Only these keys are accepted; an unknown/missing ?game= never silently
// launches a different title. Metadata follows n64hub's Games table; "repo"
// is the recomp/upstream repository and web ports live in the n64hub org.
var N64HUB_GAMES = [
    { key: 'rush2049', name: 'San Francisco Rush 2049', url: 'https://n64hub.com/rush-2049/', repo: 'n64hub/rush-2049-recomp', recomp: "this project's own recomp", license: 'GPL-3.0', rom: 'San Francisco Rush 2049 (USA)' },
    { key: 'goldeneye', name: 'GoldenEye 007', url: 'https://n64hub.com/goldeneye/', repo: 'podulator/GoldenEye64Recomp', recomp: 'GoldenEye64Recomp by podulator, from cblock85', license: 'see upstream', rom: 'GoldenEye 007 (USA)' },
    { key: 'majorasmask', name: "The Legend of Zelda: Majora's Mask", url: 'https://n64hub.com/majoras-mask/', repo: 'Zelda64Recomp/Zelda64Recomp', recomp: 'Zelda 64: Recompiled by Zelda64Recomp', license: 'see upstream', rom: "The Legend of Zelda: Majora's Mask (USA)" },
    { key: 'banjokazooie', name: 'Banjo-Kazooie', url: 'https://n64hub.com/banjo-kazooie/', repo: 'BanjoRecomp/BanjoRecomp', recomp: 'Banjo: Recompiled by BanjoRecomp', license: 'see upstream', rom: 'Banjo-Kazooie (USA)' },
    { key: 'conker', name: "Conker's Bad Fur Day", url: 'https://n64hub.com/conker/', repo: 'sciaschi/CBFD-Recompiled', recomp: "CBFD-Recompiled by sciaschi", license: 'see upstream', rom: "Conker's Bad Fur Day (USA)" },
    { key: 'dk64', name: 'Donkey Kong 64', url: 'https://n64hub.com/donkey-kong-64/', repo: 'Rainchus/Donkey-Kong-64-Recompiled', recomp: 'Donkey Kong 64: Recompiled by Rainchus', license: 'see upstream', rom: 'Donkey Kong 64 (USA)' },
    { key: 'waverace64', name: 'Wave Race 64', url: 'https://n64hub.com/wave-race-64/', repo: 'danielgomesvieira2000/wave-race-64-recomp', recomp: 'Wave Race 64: Recompiled by danielgomesvieira2000', license: 'see upstream', rom: 'Wave Race 64 (USA)' },
    { key: 'pilotwings64', name: 'Pilotwings 64', url: 'https://n64hub.com/pilotwings-64/', repo: 'danielgomesvieira2000/pilotwings-64-recomp', recomp: 'Pilotwings 64: Recompiled by danielgomesvieira2000', license: 'see upstream', rom: 'Pilotwings 64 (USA)' },
    { key: 'banjotooie', name: 'Banjo-Tooie', url: 'https://n64hub.com/banjo-tooie/', repo: 'Vidanox/BanjoTooieRecompiled', recomp: 'Banjo-Tooie: Recompiled by Vidanox', license: 'see upstream', rom: 'Banjo-Tooie (USA)' },
    { key: 'mariokart64', name: 'Mario Kart 64', url: 'https://n64hub.com/mario-kart-64/', repo: 'sonicdcer/MarioKart64Recomp', recomp: 'MarioKart64Recomp by sonicdcer', license: 'see upstream', rom: 'Mario Kart 64 (USA)' },
    { key: 'starfox64', name: 'Star Fox 64', url: 'https://n64hub.com/star-fox-64/', repo: 'sonicdcer/Starfox64Recomp', recomp: 'Starfox64Recomp by sonicdcer', license: 'see upstream', rom: 'Star Fox 64 (USA)' },
    { key: 'oot', name: 'The Legend of Zelda: Ocarina of Time', url: 'https://n64hub.com/ocarina-of-time/', repo: 'JonB-Dev/oot-recompiled', recomp: 'OoT: Recompiled by JonB-Dev', license: 'see upstream', rom: 'The Legend of Zelda: Ocarina of Time (USA)' },
    { key: 'diddykongracing', name: 'Diddy Kong Racing', url: 'https://n64hub.com/diddy-kong-racing/', repo: 'ThatGuyMcd/DKR-R', recomp: 'DKR-R by ThatGuyMcd', license: 'see upstream', rom: 'Diddy Kong Racing (USA)' },
    { key: 'jetforcegemini', name: 'Jet Force Gemini', url: 'https://n64hub.com/jet-force-gemini/', repo: 'VibinToast/JetForceGemini-Recomp', recomp: 'Jet Force Gemini: Recompiled by VibinToast', license: 'see upstream', rom: 'Jet Force Gemini (USA)' },
    { key: 'racer', name: 'Star Wars Episode I: Racer', url: 'https://n64hub.com/star-wars-episode-1-racer/', repo: 'sp00nznet/racer', recomp: 'racer by sp00nznet', license: 'see upstream', rom: 'Star Wars Episode I: Racer (USA)' },
    { key: 'pokemonsnap', name: 'Pokémon Snap', url: 'https://n64hub.com/pokemon-snap/', repo: 'JackandBeans/Snap64Recomp', recomp: 'Snap64Recomp by JackandBeans', license: 'see upstream', rom: 'Pokémon Snap (USA)' },
    { key: 'rush2', name: 'Rush 2: Extreme Racing USA', url: 'https://n64hub.com/rush-2/', repo: 'bryantmh/rush2recompiled', recomp: 'Rush 2 Recompiled by bryantmh', license: 'see upstream', rom: 'Rush 2: Extreme Racing USA (USA)' },
    { key: 'snowboarding1080', name: '1080° Snowboarding', url: 'https://n64hub.com/1080-snowboarding/', repo: 'thebradshaw/1080-Snowboarding-decomp', recomp: '1080° Snowboarding: Recompiled by thebradshaw', license: 'see upstream', rom: '1080° Snowboarding (USA)' },
    { key: 'sssv', name: 'Space Station Silicon Valley', url: 'https://n64hub.com/space-station-silicon-valley/', repo: 'scottjco/SSSV_Recomp', recomp: 'SSSV_Recomp by scottjco', license: 'see upstream', rom: 'Space Station Silicon Valley (USA)' },
    { key: 'thps2', name: "Tony Hawk's Pro Skater 2", url: 'https://n64hub.com/tony-hawks-pro-skater-2/', repo: 'THPS64Recomp/THPS2-64Recomp', recomp: "THPS2 64: Recompiled by THPS64Recomp", license: 'see upstream', rom: "Tony Hawk's Pro Skater 2 (USA)" },
    { key: 'roguesquadron', name: 'Star Wars: Rogue Squadron', url: 'https://n64hub.com/star-wars-rogue-squadron/', repo: 'MikeSemicolonD/RogueSquadron64Recomp', recomp: 'Rogue Squadron 64 Recompiled by MikeSemicolonD', license: 'see upstream', rom: 'Star Wars: Rogue Squadron (USA)' },
    { key: 'beetle', name: 'Beetle Adventure Racing!', url: 'https://n64hub.com/beetle-adventure-racing/', repo: 'bryankruman/BeetleRecomp', recomp: 'BeetleRecomp by bryankruman', license: 'see upstream', rom: 'Beetle Adventure Racing! (USA)' },
    { key: 'turokragewars', name: 'Turok: Rage Wars', url: 'https://n64hub.com/turok-rage-wars/', repo: 'wootbeer/PaxDino', recomp: 'PaxDino: Rage Wars Modernized by wootbeer', license: 'see upstream', rom: 'Turok: Rage Wars (USA)' },
    { key: 'wwfmercy', name: 'WWF No Mercy', url: 'https://n64hub.com/wwf-no-mercy/', repo: 'jessetbh/WWFNoMercyRecomp', recomp: 'WWF No Mercy: Recompiled by jessetbh', license: 'see upstream', rom: 'WWF No Mercy (USA)' },
    { key: 'mariotennis', name: 'Mario Tennis', url: 'https://n64hub.com/mario-tennis/', repo: 'Ieatzcrayonz/MarioTennisRecomp', recomp: 'Mario Tennis: Recompiled by Ieatzcrayonz', license: 'see upstream', rom: 'Mario Tennis (USA)' },
    { key: 'perfectdark', name: 'Perfect Dark', url: 'https://n64hub.com/perfect-dark/', repo: 'n64hub/perfect-dark-recomp', recomp: "this project's own recomp", license: 'GPL-3.0', rom: 'Perfect Dark (USA)' },
    { key: 'sm64', name: 'Super Mario 64', url: 'https://n64hub.com/super-mario-64/', repo: 'n64hub/super-mario-64-recomp', recomp: "this project's own recomp", license: 'GPL-3.0', rom: 'Super Mario 64 (USA)' },
    { key: 'fzerox', name: 'F-Zero X', url: 'https://n64hub.com/f-zero-x/', repo: 'n64hub/f-zero-x-recomp', recomp: "this project's own recomp", license: 'GPL-3.0', rom: 'F-Zero X (USA)' },
    { key: 'marioparty', name: 'Mario Party', url: 'https://n64hub.com/mario-party/', repo: 'n64hub/mario-party-recomp', recomp: "this project's own recomp", license: 'GPL-3.0', rom: 'Mario Party (USA)' },
    { key: 'marioparty2', name: 'Mario Party 2', url: 'https://n64hub.com/mario-party-2/', repo: 'n64hub/mario-party-2-recomp', recomp: "this project's own recomp", license: 'GPL-3.0', rom: 'Mario Party 2 (USA)' },
    { key: 'marioparty3', name: 'Mario Party 3', url: 'https://n64hub.com/mario-party-3/', repo: 'n64hub/mario-party-3-recomp', recomp: "this project's own recomp", license: 'GPL-3.0', rom: 'Mario Party 3 (USA)' },
    { key: 'smashbros', name: 'Super Smash Bros.', url: 'https://n64hub.com/super-smash-bros/', repo: 'n64hub/super-smash-bros-recomp', recomp: "this project's own recomp", license: 'GPL-3.0', rom: 'Super Smash Bros. (USA)' },
    { key: 'papermario', name: 'Paper Mario', url: 'https://n64hub.com/paper-mario/', repo: 'n64hub/paper-mario-recomp', recomp: "this project's own recomp", license: 'GPL-3.0', rom: 'Paper Mario (USA)' },
    { key: 'mariogolf', name: 'Mario Golf', url: 'https://n64hub.com/mario-golf/', repo: 'n64hub/mario-golf-recomp', recomp: "this project's own recomp", license: 'GPL-3.0', rom: 'Mario Golf (USA)' },
    { key: 'rayman2', name: 'Rayman 2', url: 'https://n64hub.com/rayman-2/', repo: 'n64hub/rayman-2-recomp', recomp: "this project's own recomp", license: 'GPL-3.0', rom: 'Rayman 2 (USA)' },
    { key: 'goinquackers', name: "Donald Duck: Goin' Quackers", url: 'https://n64hub.com/goin-quackers/', repo: 'n64hub/donald-duck-goin-quackers-recomp', recomp: "this project's own recomp", license: 'GPL-3.0', rom: "Donald Duck: Goin' Quackers (USA)" },
    { key: 'dinosaurplanet', name: 'Dinosaur Planet', url: 'https://n64hub.com/dinosaur-planet/', repo: 'n64hub/dinosaur-planet-recomp', recomp: "this project's own recomp", license: 'GPL-3.0', rom: 'Dinosaur Planet (USA)' },
    { key: 'turok', name: 'Turok: Dinosaur Hunter', url: 'https://n64hub.com/turok-dinosaur-hunter/', repo: 'n64hub/turok-recomp', recomp: "this project's own recomp", license: 'GPL-3.0', rom: 'Turok: Dinosaur Hunter (USA)' },
    { key: 'turok2', name: 'Turok 2: Seeds of Evil', url: 'https://n64hub.com/turok-2/', repo: 'n64hub/turok-2-recomp', recomp: "this project's own recomp", license: 'GPL-3.0', rom: 'Turok 2: Seeds of Evil (USA)' },
    { key: 'turok3', name: 'Turok 3: Shadow of Oblivion', url: 'https://n64hub.com/turok-3/', repo: 'n64hub/turok-3-recomp', recomp: "this project's own recomp", license: 'GPL-3.0', rom: 'Turok 3: Shadow of Oblivion (USA)' },
    { key: 'excitebike64', name: 'Excitebike 64', url: 'https://n64hub.com/excitebike-64/', repo: 'n64hub/excitebike-64-recomp', recomp: "this project's own recomp", license: 'GPL-3.0', rom: 'Excitebike 64 (USA)' }
];


var N64_REGISTRY = {};
N64HUB_GAMES.forEach(function (game) { N64_REGISTRY[game.key] = game; });
// Internationalization (8 languages, same key set as topalm.js / tops2.js).
var i18n = {
    zh: {
        pageTitle: 'N64 静态重编译',
        reset: '重置',
        tabDemo: '游戏',
        demoTitle: 'N64 静态重编译',
        demoDesc: '在浏览器中运行 n64hub 的 Nintendo 64 静态重编译版本。游戏代码由 N64Recomp 与 RT64 在 WASM/WebGPU 中重新编译运行，通过热链嵌入各项目官方页面；本应用不内置任何游戏。',
        demoOpen: '启动游戏',
        demoHint: '请自备你合法拥有的 ROM，并在 n64hub 页面中选择对应游戏版本。首次启动时在 n64hub 页面中选择 ROM；不会上传到本应用。需要支持 WebGPU 与跨源隔离的新版桌面 Chrome/Edge；嵌入模式使用临时隔离存储，存档请用“在新标签页打开”链接。本项目为独立非官方作品，未经 Nintendo 授权或背书。',
        invalidGame: '找不到这个游戏，请从游戏列表中重新选择。',
        loading: '游戏启动中，请稍候...',
        loadingTip: '游戏从 n64hub 加载，首次启动可能需要一些时间',
        loadingSlow: '加载较慢，请耐心等待；也可以在新标签页打开游戏',
        openInNewTab: '在新标签页打开游戏 ↗',
        instructions: '使用说明',
        controlsTitle: '操作方式',
        controlsHint1: '使用键盘或手柄操作；先点击游戏区域以接收输入，按 Esc 可释放键盘',
        controlsHint2: '首次启动时在 n64hub 页面选择你自己的美版 ROM；关闭或刷新嵌入页面后，ROM、设置和存档可能不会保留',
        aboutTitle: '关于',
        aboutHint: 'N64Recomp（GPL-3.0）将 N64 游戏静态重编译为可运行代码；RT64 提供图形渲染，浏览器构建通过 Emscripten/WASM 与 WebGPU 分发。本页热链 n64hub 的构建，不隶属 Nintendo，也不提供任何 ROM。',
        playing: '正在运行：',
        fullscreen: '全屏'
    },
    en: {
        pageTitle: 'N64 Recomp',
        reset: 'Reset',
        tabDemo: 'Game',
        demoTitle: 'N64 Static Recomp',
        demoDesc: 'Run n64hub static recompilations of Nintendo 64 games in your browser. Game code is recompiled by N64Recomp with RT64 graphics and runs via WASM/WebGPU, embedded by hotlink from each project official page. Nothing is bundled here.',
        demoOpen: 'Launch Game',

        demoHint: 'Bring your own lawfully obtained ROM and select the matching game version inside n64hub. Pick the ROM inside the n64hub page on first launch; nothing is uploaded to this app. Requires a recent desktop Chrome/Edge with WebGPU and cross-origin isolation; the embedded player uses temporary isolated storage, so use Open in a new tab for persistent saves. Independent, unofficial projects not endorsed by Nintendo.',
        invalidGame: 'That game was not found. Please choose one from the game list.',
        loading: 'Starting the game, please wait...',
        loadingTip: 'The game loads from n64hub; first launch can take a while',
        loadingSlow: 'Still loading - please wait a bit longer, or open the game in a new tab',
        openInNewTab: 'Open the game in a new tab ↗',
        instructions: 'Instructions',
        controlsTitle: 'Controls',
        controlsHint1: 'Use a keyboard or gamepad; click inside the game area first so it receives input, and press Esc to release the keyboard',
        controlsHint2: 'On first launch choose your own USA ROM inside the n64hub page; ROMs, settings and saves may not survive closing or reloading the embedded page',
        aboutTitle: 'About',
        aboutHint: 'N64Recomp (GPL-3.0) statically recompiles N64 game code; RT64 provides rendering and the browser build uses Emscripten/WASM with WebGPU. This page hot-links n64hub builds, is not affiliated with Nintendo and ships no ROMs.',
        playing: 'Now running: ',
        fullscreen: 'Fullscreen'
    },
    ja: {
        pageTitle: 'N64 静止再コンパイル',
        reset: 'リセット',
        tabDemo: 'ゲーム',
        demoTitle: 'N64 静止再コンパイル',
        demoOpen: 'ゲームを起動',

        demoDesc: 'n64hub の Nintendo 64 静止再コンパイル版をブラウザで遊べます。N64Recomp と RT64 で再コンパイルしたゲームコードを WASM/WebGPU で実行し、各公式ページをホットリンク埋め込みします。このアプリには何も同梱されていません。',
        demoHint: '自分で合法的に入手した ROM を用意し、n64hub の画面で対応するゲーム版を選択してください。初回起動時に n64hub の画面で ROM を選択します。アップロードは行われません。WebGPU と cross-origin isolation に対応した最新のデスクトップ Chrome/Edge が必要です。埋め込み再生は一時的な分離ストレージを使うため、保存には新しいタブで開くを利用してください。Nintendo 非公式・非推奨の独立プロジェクトです。',
        invalidGame: 'ゲームが見つかりません。ゲーム一覧から選び直してください。',
        loading: 'ゲームを起動中...',
        loadingTip: 'ゲームは n64hub から読み込まれます。初回は時間がかかることがあります',
        loadingSlow: '読み込みが遅い場合はそのままお待ちいただくか、新しいタブで開いてください',
        openInNewTab: '新しいタブで開く ↗',
        instructions: '使い方',
        controlsTitle: '操作方法',
        controlsHint1: 'キーボードまたはゲームパッドで操作します。先にゲーム領域をクリックして入力を渡し、Esc でキーボードを解放してください',
        controlsHint2: '初回起動時に n64hub の画面で自分の米国版 ROM を選択してください。埋め込みページを閉じたり再読み込みすると ROM・設定・セーブは保持されないことがあります',
        aboutTitle: 'について',
        aboutHint: 'N64Recomp（GPL-3.0）は N64 のゲームコードを静止再コンパイルします。RT64 が描画を担当し、ブラウザ版は Emscripten/WASM と WebGPU を使用します。このページは n64hub のビルドをホットリンクするだけで、Nintendo とは無関係で ROM も提供しません。',
        playing: '実行中：',
        fullscreen: '全画面'
    },

    ko: {
        pageTitle: 'N64 정적 재컴파일',
        reset: '재설정',
        tabDemo: '게임',
        demoOpen: '게임 실행',

        demoTitle: 'N64 정적 재컴파일',
        demoDesc: 'n64hub의 Nintendo 64 정적 재컴파일 게임을 브라우저에서 실행하세요. N64Recomp와 RT64로 다시 컴파일한 게임 코드를 WASM/WebGPU로 실행하며 각 공식 페이지를 핫링크로 임베드합니다. 이 앱에는 아무것도 포함되어 있지 않습니다.',
        demoHint: '합법적으로 얻은 자체 ROM을 준비하고 n64hub 화면에서 해당 게임 버전을 선택하세요. 첫 실행 시 n64hub 화면에서 ROM을 선택하며 이 앱으로 업로드되지 않습니다. WebGPU와 cross-origin isolation을 지원하는 최신 데스크톱 Chrome/Edge가 필요합니다. 임베드 플레이어는 임시 저장소를 사용하므로 저장에는 새 탭에서 열기를 이용하세요. Nintendo와 무관한 비공식 프로젝트입니다.',
        invalidGame: '게임을 찾을 수 없습니다. 게임 목록에서 다시 선택하세요.',
        loading: '게임 시작 중...',
        loadingTip: '게임은 n64hub에서 로드됩니다. 첫 실행은 시간이 걸릴 수 있습니다',
        loadingSlow: '로딩이 느립니다. 조금 더 기다리거나 새 탭에서 여세요',
        openInNewTab: '새 탭에서 열기 ↗',
        instructions: '사용 방법',
        controlsTitle: '조작 방법',
        controlsHint1: '키보드 또는 게임패드로 조작합니다. 먼저 게임 영역을 클릭해 입력을 받게 하고 Esc로 키보드를 해제하세요',
        controlsHint2: '첫 실행 시 n64hub 화면에서 자신의 미국판 ROM을 선택하세요. 임베드 페이지를 닫거나 새로고침하면 ROM, 설정, 저장 데이터가 유지되지 않을 수 있습니다',
        aboutTitle: '정보',
        aboutHint: 'N64Recomp(GPL-3.0)는 N64 게임 코드를 정적으로 재컴파일합니다. RT64가 렌더링을 담당하며 브라우저 빌드는 Emscripten/WASM과 WebGPU를 사용합니다. 이 페이지는 n64hub 빌드를 핫링크할 뿐 Nintendo와 무관하며 ROM을 제공하지 않습니다.',
        playing: '실행 중: ',
        fullscreen: '전체 화면'
    },
    fr: {
        pageTitle: 'Recomp N64',
        reset: 'Réinitialiser',
        demoOpen: 'Lancer le jeu',

        tabDemo: 'Jeu',
        demoTitle: 'Recomp statique N64',
        demoDesc: "Exécutez des recompilations statiques n64hub de jeux Nintendo 64 dans votre navigateur. Le code du jeu est recompilé par N64Recomp avec les graphismes RT64 et tourne via WASM/WebGPU, intégré par lien direct depuis la page officielle de chaque projet. Rien n'est embarqué ici.",
        demoHint: "Apportez votre propre ROM obtenue légalement et sélectionnez la version du jeu correspondante dans n64hub. Choisissez la ROM dans la page n64hub au premier lancement ; rien n'est envoyé à cette application. Nécessite un Chrome/Edge de bureau récent avec WebGPU et l'isolation cross-origin ; le lecteur intégré utilise un stockage isolé temporaire, utilisez Ouvrir dans un nouvel onglet pour des sauvegardes persistantes. Projets indépendants et non officiels, sans approbation de Nintendo.",
        invalidGame: "Jeu introuvable. Veuillez en choisir un dans la liste des jeux.",
        loading: 'Démarrage du jeu, veuillez patienter...',
        loadingTip: "Le jeu se charge depuis n64hub ; le premier lancement peut être long",
        loadingSlow: 'Chargement toujours en cours - patientez encore un peu, ou ouvrez le jeu dans un nouvel onglet',
        openInNewTab: 'Ouvrir le jeu dans un nouvel onglet ↗',
        instructions: 'Instructions',
        controlsTitle: 'Commandes',
        controlsHint1: "Utilisez le clavier ou une manette ; cliquez d'abord dans la zone de jeu pour qu'elle reçoive les entrées, et Échap libère le clavier",
        controlsHint2: "Au premier lancement, choisissez votre propre ROM USA dans la page n64hub ; ROM, paramètres et sauvegardes peuvent ne pas survivre à la fermeture ou au rechargement de la page intégrée",
        aboutTitle: 'À propos',
        aboutHint: 'N64Recomp (GPL-3.0) recompile statiquement le code des jeux N64 ; RT64 fournit le rendu et la version navigateur utilise Emscripten/WASM avec WebGPU. Cette page met en lien les builds n64hub, n’est pas affiliée à Nintendo et ne fournit aucune ROM.',
        playing: 'En cours : ',
        fullscreen: 'Plein écran'
    },
    de: {
        pageTitle: 'N64-Recomp',
        demoOpen: 'Spiel starten',

        reset: 'Zurücksetzen',
        tabDemo: 'Spiel',
        demoTitle: 'N64-Static-Recomp',
        demoDesc: 'Spiele statische Nintendo-64-Recompilierungen von n64hub im Browser. Der Spielcode wird von N64Recomp mit RT64-Grafik neu kompiliert und läuft über WASM/WebGPU, eingebettet per Hotlink von der offiziellen Seite jedes Projekts. Nichts ist hier gebündelt.',
        demoHint: 'Bring deine eigene rechtmäßig erlangte ROM mit und wähle die passende Spielversion in n64hub. Wähle die ROM beim ersten Start auf der n64hub-Seite; nichts wird an diese App hochgeladen. Erfordert ein aktuelles Desktop-Chrome/Edge mit WebGPU und Cross-Origin-Isolation; der eingebettete Player nutzt temporären isolierten Speicher, für dauerhafte Saves In neuem Tab öffnen verwenden. Unabhängige, inoffizielle Projekte, nicht von Nintendo unterstützt.',
        invalidGame: 'Spiel nicht gefunden. Bitte wähle ein Spiel aus der Liste.',
        loading: 'Spiel wird gestartet, bitte warten...',
        loadingTip: 'Das Spiel lädt von n64hub; der erste Start kann dauern',
        loadingSlow: 'Lädt noch - bitte etwas länger warten oder in einem neuen Tab öffnen',
        openInNewTab: 'Spiel in neuem Tab öffnen ↗',
        instructions: 'Anleitung',
        controlsTitle: 'Steuerung',
        controlsHint1: 'Tastatur oder Gamepad verwenden; zuerst in den Spielbereich klicken, damit er Eingaben erhält, Esc gibt die Tastatur frei',
        controlsHint2: 'Wähle beim ersten Start deine eigene USA-ROM auf der n64hub-Seite; ROMs, Einstellungen und Saves überleben das Schließen oder Neuladen der eingebetteten Seite möglicherweise nicht',
        aboutTitle: 'Über',
        aboutHint: 'N64Recomp (GPL-3.0) kompiliert N64-Spielcode statisch neu; RT64 übernimmt das Rendering, der Browser-Build nutzt Emscripten/WASM mit WebGPU. Diese Seite verlinkt n64hub-Builds, ist nicht mit Nintendo verbunden und liefert keine ROMs.',
        playing: 'Läuft: ',
        fullscreen: 'Vollbild'
    },
    es: {
        demoOpen: 'Iniciar juego',

        pageTitle: 'Recomp de N64',
        reset: 'Reiniciar',
        tabDemo: 'Juego',
        demoTitle: 'Recompilación estática de N64',
        demoDesc: 'Ejecuta recompilaciones estáticas de Nintendo 64 de n64hub en tu navegador. El código del juego se recompila con N64Recomp y gráficos RT64 y corre mediante WASM/WebGPU, incrustado por enlace directo desde la página oficial de cada proyecto. Nada está incluido aquí.',
        demoHint: 'Aporta tu propia ROM obtenida legalmente y selecciona la versión del juego correspondiente en n64hub. Elige la ROM dentro de la página de n64hub en el primer arranque; nada se sube a esta app. Requiere Chrome/Edge de escritorio reciente con WebGPU y aislamiento cross-origin; el reproductor incrustado usa almacenamiento aislado temporal, usa Abrir en una pestaña nueva para partidas persistentes. Proyectos independientes y no oficiales, sin respaldo de Nintendo.',
        invalidGame: 'No se encontró ese juego. Elige uno de la lista de juegos.',
        loading: 'Iniciando el juego, espera por favor...',
        loadingTip: 'El juego se carga desde n64hub; el primer arranque puede tardar',
        loadingSlow: 'Sigue cargando - espera un poco más o ábrelo en una pestaña nueva',
        openInNewTab: 'Abrir el juego en una pestaña nueva ↗',
        instructions: 'Instrucciones',
        controlsTitle: 'Controles',
        controlsHint1: 'Usa teclado o mando; haz clic primero en el área del juego para que reciba entradas y pulsa Esc para liberar el teclado',
        controlsHint2: 'En el primer arranque elige tu propia ROM de EE. UU. en la página de n64hub; ROM, ajustes y partidas pueden no conservarse al cerrar o recargar la página incrustada',
        aboutTitle: 'Acerca de',
        aboutHint: 'N64Recomp (GPL-3.0) recompila estáticamente el código de juegos de N64; RT64 proporciona el renderizado y la versión web usa Emscripten/WASM con WebGPU. Esta página enlaza las compilaciones de n64hub, no está afiliada a Nintendo y no ofrece ROM.',
        playing: 'En ejecución: ',
        fullscreen: 'Pantalla completa'
    },

    ru: {
        pageTitle: 'N64-рекомпиляция',
        reset: 'Сброс',
        tabDemo: 'Игра',
        demoTitle: 'Статическая рекомпиляция N64',
        demoOpen: 'Запустить игру',
        demoDesc: 'Запускайте статические рекомпиляции Nintendo 64 от n64hub в браузере. Код игры перекомпилируется N64Recomp с графикой RT64 и работает через WASM/WebGPU, встраиваясь горячей ссылкой с официальной страницы каждого проекта. Здесь ничего не поставляется.',
        demoHint: 'Используйте собственный законно полученный ROM и выберите подходящую версию игры на странице n64hub. Выберите ROM на странице n64hub при первом запуске; ничего не загружается в это приложение. Требуется современный настольный Chrome/Edge с WebGPU и cross-origin isolation; встроенный плеер использует временное изолированное хранилище, для сохранений используйте Открыть в новой вкладке. Независимые неофициальные проекты, не одобренные Nintendo.',
        invalidGame: 'Игра не найдена. Выберите игру из списка.',
        loading: 'Запуск игры, подождите...',
        loadingTip: 'Игра загружается с n64hub; первый запуск может быть долгим',
        loadingSlow: 'Всё ещё загружается - подождите немного или откройте в новой вкладке',
        openInNewTab: 'Открыть игру в новой вкладке ↗',
        instructions: 'Инструкции',
        controlsTitle: 'Управление',
        controlsHint1: 'Используйте клавиатуру или геймпад; сначала кликните в области игры, чтобы она получала ввод; Esc освобождает клавиатуру',
        controlsHint2: 'При первом запуске выберите собственный ROM версии США на странице n64hub; ROM, настройки и сохранения могут не сохраниться после закрытия или перезагрузки встроенной страницы',
        aboutTitle: 'О проекте',
        aboutHint: 'N64Recomp (GPL-3.0) статически перекомпилирует код игр N64; RT64 обеспечивает рендеринг, веб-сборка использует Emscripten/WASM и WebGPU. Эта страница ссылается на сборки n64hub, не связана с Nintendo и не предоставляет ROM.',
        playing: 'Запущено: ',
        fullscreen: 'Полный экран'
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

// ---- game resolution -----------------------------------------------------
var currentGameKey = new URLSearchParams(window.location.search).get('game');
var isCurrentGameValid = Boolean(currentGameKey && Object.prototype.hasOwnProperty.call(N64_REGISTRY, currentGameKey));
var currentGame = isCurrentGameValid ? N64_REGISTRY[currentGameKey] : { name: t('invalidGame'), url: '' };

// ---- player --------------------------------------------------------------
var slowTimer = null;
function hideOverlay() {
    var overlay = $('loadingOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
        var link = $('slowOpenLink');
        if (link && link.parentNode) link.parentNode.removeChild(link);
    }
    if (slowTimer) { clearTimeout(slowTimer); slowTimer = null; }
}

function showSlowLink() {
    var overlay = $('loadingOverlay');
    if (!overlay || $('slowOpenLink')) return;
    var link = document.createElement('a');
    link.id = 'slowOpenLink';
    link.href = currentGame.url || N64HUB_HOME;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = t('openInNewTab');
    link.style.cssText = 'display:inline-block;margin-top:14px;color:#33ff66;text-decoration:underline;font-size:14px;';
    overlay.appendChild(link);
}

function showPlayer(title) {
    $('uploadSection').classList.add('hidden');
    $('playerSection').classList.add('active');
    $('pageTitle').textContent = t('playing') + (title || 'N64');
    $('resetBtn').style.display = '';
    $('fullscreenBtn').style.display = '';
    $('loadingOverlay').classList.remove('hidden');
}

function playN64Recomp() {
    var frame = $('n64Frame');
    if (!frame) return;
    if (!isCurrentGameValid) {
        showToast(t('invalidGame'));
        return;
    }
    showPlayer(currentGame.name);
    frame.addEventListener('load', hideOverlay, { once: true });
    frame.src = currentGame.url;
    slowTimer = setTimeout(function () {
        showToast(t('loadingSlow'));
        showSlowLink();
    }, 15000);
}

function stopPlayback() {
    var frame = $('n64Frame');
    if (frame) frame.src = 'about:blank';
    hideOverlay();
    $('playerSection').classList.remove('active');
    $('uploadSection').classList.remove('hidden');
    $('pageTitle').textContent = t('pageTitle');
    $('resetBtn').style.display = 'none';
    $('fullscreenBtn').style.display = 'none';
}

// ---- navigation and controls ---------------------------------------------
$('fullscreenBtn').addEventListener('click', function () {
    var frame = $('n64Frame');
    if (!frame) return;
    if (document.fullscreenElement) {
        if (document.exitFullscreen) document.exitFullscreen();
    } else if (frame.requestFullscreen) {
        frame.requestFullscreen();
    } else if (frame.webkitRequestFullscreen) {
        frame.webkitRequestFullscreen();
    }
});

var demoOpenBtn = $('demoOpenBtn');
if (isCurrentGameValid) {
    demoOpenBtn.addEventListener('click', playN64Recomp);
} else {
    demoOpenBtn.disabled = true;
    demoOpenBtn.title = t('invalidGame');
    showToast(t('invalidGame'));
}

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

// ---- init ----------------------------------------------------------------
(function () {
    var title = document.querySelector('.upload-title');
    if (title) title.textContent = isCurrentGameValid ? currentGame.name : t('pageTitle');
    var icon = document.querySelector('.upload-icon i');
    if (icon) icon.className = 'fas fa-gamepad';
    var link = $('demoOpenNewTab');
    if (link) {
        link.href = currentGame.url || N64HUB_HOME;
        link.textContent = t('openInNewTab');
    }
})();
applyI18n();

// ---- cross-origin isolation bootstrap ------------------------------------
// The SW injects COOP/COEP for /routes/n64recomp.html top-level navigations.
// Adopt the controller and reload once if the first load was not isolated;
// the session guard prevents a reload loop.
HotlinkPlayer.ensureIsolated('n64IsoReload', '[n64recomp]', '/sw.js');
