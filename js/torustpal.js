// Legend of Sword and Fairy (DOS) page: rustpal hot-linked iframe plus the
// same cross-origin-isolation bootstrap used by the PS2 / Vita routes.
var RUSTPAL_BASE = '/xianjian/web/';
var RUSTPAL_UPSTREAM = 'https://madeye.github.io/Legend-of-Sword-and-Fairy/web/';

// ---- cross-origin isolation bootstrap (rustpal page only) ---------------
// sw.js injects COOP/COEP for /routes/rustpal.html, which gives the hot-linked
// iframe the SharedArrayBuffer it needs. Reload once on first visit if the SW
// was not controlling the initial navigation.
HotlinkPlayer.ensureIsolated('rustpalIsoReload', '[rustpal]', '/sw.js');

var i18n = {
    zh: { pageTitle: '仙剑奇侠传 DOS', reset: '重置', tabDemo: '游戏', demoTitle: '仙剑奇侠传 DOS 版', demoDesc: '通过完整的 Rust/WASM 引擎移植版在浏览器中运行原版游戏数据，热链嵌入官方演示站。无需 DOSBox 或本地文件。', demoOpen: '启动游戏', demoHint: '游戏数据由项目作者托管在上游。《仙剑奇侠传》版权归大宇资讯所有，本页面仅供技术研究与怀旧交流，不用于商业用途。首次点击或按键后才会开始播放声音。', loading: '游戏启动中，请稍候...', loadingTip: '游戏从官方站点加载，首次启动可能较慢', loadingSlow: '加载较慢，请耐心等待；也可以在新标签页打开', openInNewTab: '在新标签页打开 ↗', instructions: '使用说明', controlsTitle: '操作方式', controlsHint1: '方向键移动，空格/回车确认，Esc 菜单；战斗中 R 连击、A 自动、D 防御、E 物品、W 投掷、Q 逃跑、F 仙术、S 状态', controlsHint2: '触屏设备显示虚拟方向键与确认/取消/连击按钮。先点击画面让 iframe 获得键盘焦点并开始音频。', aboutTitle: '关于', aboutHint: '引擎：madeye 从 SDLPAL 移植的 Rust 版（GPL-3.0）。原版游戏数据 © 大宇资讯，由上游项目仅供非商业研究使用。需要支持 WebAssembly 与 SharedArrayBuffer 的现代浏览器。', playing: '正在运行：', fullscreen: '全屏' },
    en: { pageTitle: 'Legend of Sword and Fairy', reset: 'Reset', tabDemo: 'Game', demoTitle: 'Legend of Sword and Fairy (DOS)', demoDesc: 'Play the classic 1995 DOS RPG in your browser with a complete Rust/WASM engine port running the original game data, embedded by hotlink to the official demo site. No DOSBox or local files are required.', demoOpen: 'Launch Game', demoHint: 'The game data is hosted upstream by the project author. 《仙剑奇侠传》 is copyright of Softstar Entertainment; this page is for technical study and nostalgic research only, not commercial use. Sound starts after the first click or key press.', loading: 'Starting the game, please wait...', loadingTip: 'The game loads from its official host; first launch can take a while', loadingSlow: 'Still loading - please wait a bit longer, or open it in a new tab', openInNewTab: 'Open in a new tab ↗', instructions: 'Instructions', controlsTitle: 'Controls', controlsHint1: 'Arrow keys move, Space/Enter confirms, Esc opens the menu. In battle: R repeat attack, A auto, D defend, E item, W throw, Q flee, F magic, S status', controlsHint2: 'Touch devices show an on-screen D-pad and 确认/取消/连击 buttons. Click the canvas first so the iframe receives keyboard focus and audio starts.', aboutTitle: 'About', aboutHint: 'Engine: GPL-3.0 Rust port from SDLPAL by madeye. Original game data © Softstar Entertainment; supplied by the upstream project for non-commercial study only. Requires modern browsers with WebAssembly and SharedArrayBuffer support.', playing: 'Now running: ', fullscreen: 'Fullscreen' },
    ja: { pageTitle: '仙剣奇侠伝', reset: 'リセット', tabDemo: 'ゲーム', demoTitle: '仙剣奇侠伝 DOS版', demoDesc: '完全な Rust/WASM エンジン移植版でオリジナルゲームデータをブラウザ上で実行します。公式デモサイトへのホットリンク埋め込みです。DOSBox やローカルファイルは不要です。', demoOpen: 'ゲームを起動', demoHint: 'ゲームデータは作者により上游で公開されています。技術研究と懐古目的のみに使用します。音声は最初のクリックまたはキー入力後に再生されます。', loading: 'ゲームを起動中...', loadingTip: 'ゲームは公式サイトから読み込まれます。初回は時間がかかることがあります', loadingSlow: '読み込みが遅い場合はそのままお待ちいただくか、新しいタブで開いてください', openInNewTab: '新しいタブで開く ↗', instructions: '使い方', controlsTitle: '操作方法', controlsHint1: '方向キーで移動、Space/Enter で確認、Esc でメニュー。戦闘は R 連撃、A 自動、D 防御、E アイテム、W 投擲、Q 逃走、F 仙術、S 状態', controlsHint2: 'タッチ端末では画面上に方向キーと確認/取消/連撃ボタンが表示されます。', aboutTitle: 'について', aboutHint: 'エンジン：madeye による SDLPAL の Rust 移植（GPL-3.0）。オリジナルデータ © 唯心科技有限公司、非商用研究のみ。', playing: '実行中：', fullscreen: '全画面' },
    ko: { pageTitle: '선검기협전', reset: '재설정', tabDemo: '게임', demoTitle: '선검기협전 DOS', demoDesc: '완전한 Rust/WASM 엔진 이식판으로 원본 게임 데이터를 브라우저에서 실행합니다. 공식 데모 사이트 핫링크 임베드이며 DOSBox나 로컬 파일이 필요 없습니다.', demoOpen: '게임 실행', demoHint: '게임 데이터는 작성자가 공식 호스트에 제공합니다. 기술 연구와 추억 목적으로만 사용합니다. 소리는 첫 클릭/키 입력 후 재생됩니다.', loading: '게임 시작 중...', loadingTip: '게임은 공식 호스트에서 로드되며 첫 실행은 느릴 수 있습니다', loadingSlow: '로딩이 느립니다. 조금 더 기다리거나 새 탭에서 여세요', openInNewTab: '새 탭에서 열기 ↗', instructions: '사용 방법', controlsTitle: '조작 방법', controlsHint1: '방향키 이동, Space/Enter 확인, Esc 메뉴. 전투: R 연타, A 자동, D 방어, E 아이템, W 투척, Q 도주, F 마법, S 상태', controlsHint2: '터치 기기에는 방향키와 확인/취소/연타 버튼이 표시됩니다.', aboutTitle: '정보', aboutHint: '엔진: madeye의 SDLPAL Rust 이식판(GPL-3.0). 원본 게임 데이터 © 소프트스타 엔터테인먼트, 비상업 연구용.', playing: '실행 중: ', fullscreen: '전체 화면' },
    fr: { pageTitle: 'Legend of Sword and Fairy', reset: 'Réinitialiser', tabDemo: 'Jeu', demoTitle: 'Legend of Sword and Fairy (DOS)', demoDesc: 'Jouez au RPG DOS classique de 1995 avec un port moteur complet Rust/WASM exécutant les données d’origine, intégré par lien direct au site officiel. Aucun DOSBox ni fichier local requis.', demoOpen: 'Lancer le jeu', demoHint: 'Les données sont hébergées par l’auteur du projet. 《仙剑奇侠传》 est copyright de Softstar Entertainment ; cette page sert uniquement à l’étude technique et à la nostalgie.', loading: 'Démarrage du jeu, veuillez patienter...', loadingTip: 'Le jeu se charge depuis son hôte officiel ; le premier lancement peut être long', loadingSlow: 'Chargement toujours en cours - patientez encore un peu, ou ouvrez-le dans un nouvel onglet', openInNewTab: 'Ouvrir dans un nouvel onglet ↗', instructions: 'Instructions', controlsTitle: 'Commandes', controlsHint1: 'Flèches pour bouger, Espace/Entrée pour confirmer, Échap pour le menu. En combat : R attaque répétée, A auto, D défense, E objet, W jet, Q fuite, F magie, S statut', controlsHint2: 'Les appareils tactiles affichent un D-pad et les boutons 确认/取消/连击.', aboutTitle: 'À propos', aboutHint: 'Moteur : port Rust GPL-3.0 de SDLPAL par madeye. Données originales © Softstar Entertainment, pour étude non commerciale uniquement.', playing: 'En cours : ', fullscreen: 'Plein écran' },
    de: { pageTitle: 'Legend of Sword and Fairy', reset: 'Zurücksetzen', tabDemo: 'Spiel', demoTitle: 'Legend of Sword and Fairy (DOS)', demoDesc: 'Spiele das klassische DOS-RPG von 1995 mit einer vollständigen Rust/WASM-Engine-Portierung der Originaldaten, per Hotlink zur offiziellen Demo-Seite eingebettet.', demoOpen: 'Spiel starten', demoHint: 'Die Spieldaten werden vom Projektautor bereitgestellt. 《仙剑奇侠传》 ist urheberrechtlich geschützt von Softstar Entertainment; diese Seite dient nur technischer Forschung und Nostalgie.', loading: 'Spiel wird gestartet, bitte warten...', loadingTip: 'Das Spiel lädt vom offiziellen Host; der erste Start kann dauern', loadingSlow: 'Lädt noch - bitte etwas länger warten oder in einem neuen Tab öffnen', openInNewTab: 'In neuem Tab öffnen ↗', instructions: 'Anleitung', controlsTitle: 'Steuerung', controlsHint1: 'Pfeiltasten bewegen, Leertaste/Eingabetaste bestätigt, Esc öffnet das Menü. Im Kampf: R Dauerangriff, A Auto, D Verteidigung, E Item, W Werfen, Q Flucht, F Magie, S Status', controlsHint2: 'Touch-Geräte zeigen ein D-Pad sowie 确认/取消/连击-Tasten.', aboutTitle: 'Über', aboutHint: 'Engine: GPL-3.0 Rust-Portierung von SDLPAL durch madeye. Originaldaten © Softstar Entertainment, nur für nichtkommerzielle Forschung.', playing: 'Läuft: ', fullscreen: 'Vollbild' },
    es: { pageTitle: 'Legend of Sword and Fairy', reset: 'Reiniciar', tabDemo: 'Juego', demoTitle: 'Legend of Sword and Fairy (DOS)', demoDesc: 'Juega al RPG clásico de DOS de 1995 con un port completo del motor a Rust/WASM que ejecuta los datos originales, incrustado por enlace directo al sitio oficial.', demoOpen: 'Iniciar juego', demoHint: 'Los datos están alojados por el autor del proyecto. 《仙剑奇侠传》 es copyright de Softstar Entertainment; esta página es solo para estudio técnico y nostalgia.', loading: 'Iniciando el juego, espera por favor...', loadingTip: 'El juego se carga desde su host oficial; el primer arranque puede tardar', loadingSlow: 'Sigue cargando - espera un poco más o ábrelo en una pestaña nueva', openInNewTab: 'Abrir en una pestaña nueva ↗', instructions: 'Instrucciones', controlsTitle: 'Controles', controlsHint1: 'Flechas para moverte, Espacio/Intro para confirmar, Esc para el menú. En batalla: R ataque repetido, A automático, D defensa, E objeto, W lanzar, Q huir, F magia, S estado', controlsHint2: 'Los dispositivos táctiles muestran un D-pad y botones 确认/取消/连击.', aboutTitle: 'Acerca de', aboutHint: 'Motor: port Rust GPL-3.0 de SDLPAL por madeye. Datos originales © Softstar Entertainment, solo para estudio no comercial.', playing: 'En ejecución: ', fullscreen: 'Pantalla completa' },
    ru: { pageTitle: 'Legend of Sword and Fairy', reset: 'Сброс', tabDemo: 'Игра', demoTitle: 'Legend of Sword and Fairy (DOS)', demoDesc: 'Играйте в классическую DOS-RPG 1995 года с полным портом движка на Rust/WASM, запускающего оригинальные данные, встроенного горячей ссылкой на официальную демо-страницу.', demoOpen: 'Запустить игру', demoHint: 'Данные игры размещены автором проекта. 《仙剑奇侠传》 — авторское право Softstar Entertainment; страница предназначена только для технического изучения и ностальгии.', loading: 'Запуск игры, подождите...', loadingTip: 'Игра загружается с официального сайта; первый запуск может быть долгим', loadingSlow: 'Всё ещё загружается - подождите немного или откройте в новой вкладке', openInNewTab: 'Открыть в новой вкладке ↗', instructions: 'Инструкции', controlsTitle: 'Управление', controlsHint1: 'Стрелки двигают, Пробел/Enter подтверждают, Esc открывает меню. В бою: R повторная атака, A авто, D защита, E предмет, W бросок, Q бегство, F магия, S статус', controlsHint2: 'На сенсорных устройствах отображаются D-pad и кнопки 确认/取消/连击.', aboutTitle: 'Об игре', aboutHint: 'Движок: GPL-3.0 порт SDLPAL на Rust от madeye. Оригинальные данные © Softstar Entertainment, только для некоммерческого изучения.', playing: 'Запущено: ', fullscreen: 'Полный экран' }
};

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
    var toast = $('toast'); if (!toast) return;
    $('toastMessage').textContent = msg; toast.classList.remove('hidden');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(function () { toast.classList.add('hidden'); }, 3000);
}
document.querySelectorAll('.upload-tab').forEach(function (el) {
    el.addEventListener('click', function () {
        document.querySelectorAll('.upload-tab').forEach(function (tab) { tab.classList.toggle('active', tab === el); });
    });
});
var player = HotlinkPlayer.createPlayer({
    frameId: 'rustpalFrame', overlayId: 'loadingOverlay',
    url: RUSTPAL_UPSTREAM, newTabUrl: RUSTPAL_UPSTREAM
});
function showPlayer(title) {
    document.getElementById('uploadSection').classList.add('hidden');
    document.getElementById('playerSection').classList.add('active');
    document.getElementById('pageTitle').textContent = t('playing') + (title || 'Legend of Sword and Fairy');
    document.getElementById('resetBtn').style.display = '';
    document.getElementById('fullscreenBtn').style.display = '';
}
function playRustpal() {
    if (!document.getElementById('rustpalFrame')) return;
    showPlayer('Legend of Sword and Fairy');
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
document.getElementById('fullscreenBtn').addEventListener('click', function () {
    var frame = document.getElementById('rustpalFrame'); if (!frame) return;
    if (document.fullscreenElement) { if (document.exitFullscreen) document.exitFullscreen(); }
    else if (frame.requestFullscreen) frame.requestFullscreen();
    else if (frame.webkitRequestFullscreen) frame.webkitRequestFullscreen();
});
document.getElementById('demoOpenBtn').addEventListener('click', playRustpal);
document.getElementById('demoOpenNewTab').href = RUSTPAL_UPSTREAM;
document.getElementById('backBtn').addEventListener('click', function () {
    var playerSection = document.getElementById('playerSection');
    if (playerSection.classList.contains('active')) { stopPlayback(); return; }
    window.location.href = '../routes/game.html?category=recomp';
});
document.getElementById('resetBtn').addEventListener('click', stopPlayback);
document.getElementById('instructionsHeader').addEventListener('click', function () {
    document.getElementById('instructionsContent').classList.toggle('hidden');
    var icon = document.getElementById('instructionsToggle');
    if (icon) icon.style.transform = document.getElementById('instructionsContent').classList.contains('hidden') ? '' : 'rotate(180deg)';
});
applyI18n();
