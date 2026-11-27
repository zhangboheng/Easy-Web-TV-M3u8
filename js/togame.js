// Game Page JS - Modern UI Version
// Native JavaScript (No jQuery)

// UI dictionary for the Games page. Covers the static HTML copy (titles,
// sidebar categories, placeholders, loading states) and the dynamic strings
// generated from JS (empty states). Same 8-language pattern and `i18n` name
// as the other route pages so scripts/checks/check-i18n.js can verify it.
var i18n = {
    zh: {
        pageTitle: '游戏', back: '返回', menu: '菜单', searchPlaceholder: '搜索游戏...',
        catAll: '全部游戏', catRecent: '最近游玩', catFavorites: '收藏', catEmulator: '模拟器',
        catRetroPc: '复古电脑', catRecomp: '重编译', catFantasy: '幻想主机', catComputers: '电脑',
        catMobile: '手机', catWebGames: '网页游戏', loadingMore: '正在加载更多游戏...', loading: '正在加载游戏...',
        noRecent: '暂无最近游玩的游戏', noFavs: '还没有收藏的游戏 - 点击游戏卡片上的星标即可收藏', noGames: '未找到游戏'
    },
    en: {
        pageTitle: 'Games', back: 'Back', menu: 'Menu', searchPlaceholder: 'Search games...',
        catAll: 'All Games', catRecent: 'Recently Played', catFavorites: 'Favorites', catEmulator: 'Emulator',
        catRetroPc: 'Retro PC', catRecomp: 'Recomp', catFantasy: 'Fantasy Console', catComputers: 'Computers',
        catMobile: 'Mobile', catWebGames: 'Web Games', loadingMore: 'Loading more games...', loading: 'Loading games...',
        noRecent: 'No recently played games', noFavs: 'No favorite games yet - tap the star on any game card', noGames: 'No games found'
    },
    ja: {
        pageTitle: 'ゲーム', back: '戻る', menu: 'メニュー', searchPlaceholder: 'ゲームを検索...',
        catAll: 'すべてのゲーム', catRecent: '最近プレイしたゲーム', catFavorites: 'お気に入り', catEmulator: 'エミュレーター',
        catRetroPc: 'レトロPC', catRecomp: 'リコンプ', catFantasy: 'ファンタジーコンソール', catComputers: 'コンピューター',
        catMobile: 'モバイル', catWebGames: 'ウェブゲーム', loadingMore: 'ゲームをさらに読み込み中...', loading: 'ゲームを読み込み中...',
        noRecent: '最近プレイしたゲームはありません', noFavs: 'お気に入りはまだありません - ゲームカードの星をタップしてください', noGames: 'ゲームが見つかりません'
    },
    ko: {
        pageTitle: '게임', back: '뒤로', menu: '메뉴', searchPlaceholder: '게임 검색...',
        catAll: '모든 게임', catRecent: '최근 플레이한 게임', catFavorites: '즐겨찾기', catEmulator: '에뮬레이터',
        catRetroPc: '레트로 PC', catRecomp: '리컴프', catFantasy: '판타지 콘솔', catComputers: '컴퓨터',
        catMobile: '모바일', catWebGames: '웹 게임', loadingMore: '게임을 더 불러오는 중...', loading: '게임을 불러오는 중...',
        noRecent: '최근 플레이한 게임이 없습니다', noFavs: '즐겨찾는 게임이 없습니다 - 게임 카드의 별을 눌러 추가하세요', noGames: '게임을 찾을 수 없습니다'
    },
    fr: {
        pageTitle: 'Jeux', back: 'Retour', menu: 'Menu', searchPlaceholder: 'Rechercher des jeux...',
        catAll: 'Tous les jeux', catRecent: 'Joués récemment', catFavorites: 'Favoris', catEmulator: 'Émulateur',
        catRetroPc: 'PC rétro', catRecomp: 'Recomp', catFantasy: 'Console fantaisie', catComputers: 'Ordinateurs',
        catMobile: 'Mobile', catWebGames: 'Jeux web', loadingMore: 'Chargement d\'autres jeux...', loading: 'Chargement des jeux...',
        noRecent: 'Aucun jeu récemment joué', noFavs: 'Aucun favori pour le moment - touchez l\'étoile sur une carte de jeu', noGames: 'Aucun jeu trouvé'
    },
    de: {
        pageTitle: 'Spiele', back: 'Zurück', menu: 'Menü', searchPlaceholder: 'Spiele suchen...',
        catAll: 'Alle Spiele', catRecent: 'Zuletzt gespielt', catFavorites: 'Favoriten', catEmulator: 'Emulator',
        catRetroPc: 'Retro-PC', catRecomp: 'Recomp', catFantasy: 'Fantasy-Konsole', catComputers: 'Computer',
        catMobile: 'Mobil', catWebGames: 'Webspiele', loadingMore: 'Weitere Spiele werden geladen...', loading: 'Spiele werden geladen...',
        noRecent: 'Keine kürzlich gespielten Spiele', noFavs: 'Noch keine Favoriten - tippe auf den Stern auf einer Spielkarte', noGames: 'Keine Spiele gefunden'
    },
    es: {
        pageTitle: 'Juegos', back: 'Atrás', menu: 'Menú', searchPlaceholder: 'Buscar juegos...',
        catAll: 'Todos los juegos', catRecent: 'Jugados recientemente', catFavorites: 'Favoritos', catEmulator: 'Emulador',
        catRetroPc: 'PC retro', catRecomp: 'Recomp', catFantasy: 'Consola fantástica', catComputers: 'Ordenadores',
        catMobile: 'Móvil', catWebGames: 'Juegos web', loadingMore: 'Cargando más juegos...', loading: 'Cargando juegos...',
        noRecent: 'No hay juegos jugados recientemente', noFavs: 'Aún no hay favoritos - toca la estrella en una tarjeta de juego', noGames: 'No se encontraron juegos'
    },
    ru: {
        pageTitle: 'Игры', back: 'Назад', menu: 'Меню', searchPlaceholder: 'Поиск игр...',
        catAll: 'Все игры', catRecent: 'Недавно сыгранные', catFavorites: 'Избранное', catEmulator: 'Эмулятор',
        catRetroPc: 'Ретро-ПК', catRecomp: 'Ре compilation', catFantasy: 'Фэнтези-консоль', catComputers: 'Компьютеры',
        catMobile: 'Мобильные', catWebGames: 'Веб-игры', loadingMore: 'Загрузка большего количества игр...', loading: 'Загрузка игр...',
        noRecent: 'Нет недавно сыгранных игр', noFavs: 'Пока нет избранного - нажмите звезду на карточке игры', noGames: 'Игры не найдены'
    }
};
var currentLang = (localStorage.getItem('ewtv-lang') || localStorage.getItem('preferredLanguage') || 'en').split('-')[0];
if (!i18n[currentLang]) currentLang = 'en';
function t(key) { return (i18n[currentLang] && i18n[currentLang][key]) || i18n.en[key] || key; }

// Apply translated copy to the static HTML. Uses data-i18n on text nodes,
// data-i18n-placeholder on inputs, data-i18n-title on tooltips.
function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
        var key = el.getAttribute('data-i18n');
        if (i18n[currentLang] && i18n[currentLang][key]) el.textContent = i18n[currentLang][key];
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-placeholder');
        if (i18n[currentLang] && i18n[currentLang][key]) el.placeholder = i18n[currentLang][key];
    });
    document.querySelectorAll('[data-i18n-title]').forEach(function (el) {
        var key = el.getAttribute('data-i18n-title');
        if (i18n[currentLang] && i18n[currentLang][key]) el.title = i18n[currentLang][key];
    });
    document.documentElement.lang = currentLang;
}
// Short alias used by the dynamic renderers below.
function tgT(key) { return t(key); }

// Game data
var games = [
    // Emulator Games
    {
        id: 26,
        name: 'Arcade Emulator',
        platform: 'Arcade',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/FBNEO.png',
        url: '../routes/emulatorjs.html?core=fbneo'
    },
    {
        id: 20,
        name: 'Atari 2600 Emulator',
        platform: 'Atari 2600',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/A2600.png',
        url: '../routes/emulatorjs.html?core=stella2014'
    },
    {
        id: 32,
        name: 'Commodore PET Emulator',
        platform: 'PET',
        category: 'emulator',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Commodore_2001_Series-IMG_0448b.jpg/330px-Commodore_2001_Series-IMG_0448b.jpg',
        url: '../routes/emulatorjs.html?core=vice_xpet'
    },
    {
        id: 31,
        name: 'Commodore VIC-20 Emulator',
        platform: 'VIC-20',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/VIC20.png',
        url: '../routes/emulatorjs.html?core=vice_xvic'
    },
    {
        id: 28,
        name: 'ColecoVision Emulator',
        platform: 'ColecoVision',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Coleco%20-%20ColecoVision/Named_Titles/2010%20-%20The%20Graphic%20Action%20Game%20%28USA%2C%20Europe%29.png',
        url: '../routes/emulatorjs.html?core=gearcoleco'
    },
    {
        id: 29,
        name: 'Commodore 64 Emulator',
        platform: 'C64',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/C64.png',
        url: '../routes/emulatorjs.html?core=vice_x64'
    },
    {
        id: 22,
        name: 'Atari 5200 Emulator',
        platform: 'Atari 5200',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/A5200.png',
        url: '../routes/emulatorjs.html?core=a5200'
    },
    {
        id: 5,
        name: 'NES Emulator',
        platform: 'NES',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/FC.png',
        url: '../routes/emulatorjs.html?core=fceumm'
    },
    {
        id: 33,
        name: 'Commodore Plus/4 Emulator',
        platform: 'Plus/4',
        category: 'emulator',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Commodore_Plus_4.jpg/330px-Commodore_Plus_4.jpg',
        url: '../routes/emulatorjs.html?core=vice_xplus4'
    },
    {
        id: 13,
        name: 'Master System Emulator',
        platform: 'Master System',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/SMS.png',
        url: '../routes/emulatorjs.html?core=smsplus'
    },
    {
        id: 34,
        name: 'Amiga Emulator',
        platform: 'Amiga',
        category: 'emulator',
        image: 'https://cdn.simpleicons.org/commodore/ffffff',
        url: '../routes/emulatorjs.html?core=puae'
    },
    {
        id: 30,
        name: 'Commodore 128 Emulator',
        platform: 'C128',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/C128.png',
        url: '../routes/emulatorjs.html?core=vice_x128'
    },
    {
        id: 21,
        name: 'Atari 7800 Emulator',
        platform: 'Atari 7800',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/A7800.png',
        url: '../routes/emulatorjs.html?core=prosystem'
    },
    {
        id: 12,
        name: 'Genesis Emulator',
        platform: 'Genesis',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/GENESIS.png',
        url: '../routes/emulatorjs.html?core=genesis_plus_gx'
    },
    {
        id: 24,
        name: 'Atari Lynx Emulator',
        platform: 'Atari Lynx',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/LYNX.png',
        url: '../routes/emulatorjs.html?core=handy'
    },
    {
        id: 8,
        name: 'Game Boy Emulator',
        platform: 'GB/GBC',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/GB.png',
        url: '../routes/emulatorjs.html?core=gambatte'
    },
    {
        id: 36,
        name: 'Sega Game Gear Emulator',
        platform: 'Game Gear',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/GG.png',
        url: '../routes/emulatorjs.html?core=smsplus'
    },
    {
        id: 6,
        name: 'SNES Emulator',
        platform: 'SNES',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/SNES.png',
        url: '../routes/emulatorjs.html?core=snes9x'
    },
    {
        id: 14,
        name: 'Sega CD Emulator',
        platform: 'Sega CD',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/MD.png',
        url: '../routes/emulatorjs.html?core=picodrive&platform=segacd'
    },
    {
        id: 25,
        name: '3DO Emulator',
        platform: '3DO',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/3DO.png',
        url: '../routes/emulatorjs.html?core=opera'
    },
    {
        id: 23,
        name: 'Atari Jaguar Emulator',
        platform: 'Atari Jaguar',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/JAGUAR.png',
        url: '../routes/emulatorjs.html?core=virtualjaguar'
    },
    {
        id: 35,
        name: 'Sega 32X Emulator',
        platform: 'Sega 32X',
        category: 'emulator',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Sega-Genesis-32X-01.jpg/330px-Sega-Genesis-32X-01.jpg',
        url: '../routes/emulatorjs.html?core=picodrive'
    },
    {
        id: 10,
        name: 'PS1 Emulator',
        platform: 'PS1',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/PSX.png',
        url: '../routes/emulatorjs.html?core=pcsx_rearmed'
    },
    {
        id: 15,
        name: 'Saturn Emulator',
        platform: 'Saturn',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/SATURN.png',
        url: '../routes/emulatorjs.html?core=yabause'
    },
    {
        id: 37,
        name: 'Virtual Boy Emulator',
        platform: 'Virtual Boy',
        category: 'emulator',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Virtual-Boy-Set.png/330px-Virtual-Boy-Set.png',
        url: '../routes/emulatorjs.html?core=beetle_vb'
    },
    {
        id: 38,
        name: 'PC Engine Emulator',
        platform: 'PCE',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/PCE.png',
        url: '../routes/emulatorjs.html?core=mednafen_pce'
    },
    {
        id: 39,
        name: 'WonderSwan Emulator',
        platform: 'WS',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/WS.png',
        url: '../routes/emulatorjs.html?core=mednafen_wswan'
    },
    {
        id: 40,
        name: 'Neo Geo Pocket Emulator',
        platform: 'NGP',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/NGP.png',
        url: '../routes/emulatorjs.html?core=mednafen_ngp'
    },
    {
        id: 41,
        name: 'Amstrad CPC Emulator',
        platform: 'CPC',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/CPC.png',
        url: '../routes/emulatorjs.html?core=cap32'
    },
    {
        id: 42,
        name: 'Doom Engine (prboom)',
        platform: 'DOOM',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/DOOM.png',
        url: '../routes/emulatorjs.html?core=prboom'
    },
    // PS2 emulator (TabStationToo, PCSX2 compiled to WebAssembly, GPL-3.0):
    // embedded by hotlink to the official hosted web app (verified frameable
    // with cross-origin isolation delegation). Bring your own BIOS dump and
    // disc images - picked inside the emulator's Disc library; needs desktop
    // Chrome/Edge.
    {
        id: 43,
        name: 'PS2 Emulator',
        platform: 'PS2',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/tabstationtoo/TabStationToo/wasm/bin/resources/icons/AppBanner.svg',
        url: '../routes/ps2.html'
    },
    // PS Vita emulator (vitaslop, MIT): embedded by hotlink to the official
    // hosted web app (verified frameable). Bring your own games - imported
    // inside the emulator's own library UI; needs desktop Chrome/Edge.
    {
        id: 123,
        name: 'PS Vita Emulator',
        platform: 'PS Vita',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/cretz/vitaslop/main/projects/vitaslop-web/web/icon.svg',
        url: '../routes/vita.html'
    },
    {
        id: 44,
        name: 'ZX Spectrum Emulator',
        platform: 'ZX',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/ZXS.png',
        url: '../routes/emulatorjs.html?core=fuse'
    },
    {
        id: 45,
        name: 'PSP Emulator',
        platform: 'PSP',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Sony%20-%20PlayStation%20Portable/Named_Titles/Ace%20Combat%20X%20-%20Skies%20of%20Deception%20%28Europe%29%20%28En%2CJa%2CFr%2CDe%2CEs%2CIt%2CKo%29.png',
        url: '../routes/emulatorjs.html?core=ppsspp'
    },
    {
        id: 47,
        name: 'PC-FX Emulator',
        platform: 'PC-FX',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/NEC%20-%20PC-FX/Named_Titles/Battle%20Heat%20%28Japan%29.png',
        url: '../routes/emulatorjs.html?core=mednafen_pcfx'
    },
    {
        id: 48,
        name: 'Flash Player (Ruffle)',
        platform: 'Flash',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/ruffle-rs/ruffle/master/web/packages/demo/public/logo.svg',
        url: '../routes/flash.html'
    },
    {
        id: 49,
        name: 'DOS Emulator (js-dos)',
        platform: 'DOS',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/MSDOS.png',
        url: '../routes/dos.html'
    },
    {
        id: 50,
        name: 'ZX81/ZX80 Emulator',
        platform: 'ZX81/ZX80',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/ZX81.png',
        url: '../routes/emulatorjs.html?core=81'
    },
    {
        id: 51,
        name: 'Thomson MO/TO Emulator',
        platform: 'Thomson MO/TO',
        category: 'emulator',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Thomson_MO5-IMG_1732.jpg/330px-Thomson_MO5-IMG_1732.jpg',
        url: '../routes/emulatorjs.html?core=crocods'
    },
    {
        id: 52,
        name: 'Philips CD-i Emulator',
        platform: 'Philips CD-i',
        category: 'emulator',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Philips_CD-i_210_player_%2830179599718%29.jpg/330px-Philips_CD-i_210_player_%2830179599718%29.jpg',
        url: '../routes/emulatorjs.html?core=same_cdi'
    },
    {
        id: 9,
        name: 'N64 Emulator',
        platform: 'N64',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/N64.png',
        url: '../routes/emulatorjs.html?core=mupen64plus_next'
    },
    {
        id: 27,
        name: 'MAME 2003+ Emulator',
        platform: 'MAME',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/MAME.png',
        url: '../routes/emulatorjs.html?core=mame2003_plus'
    },
    {
        id: 7,
        name: 'GBA Emulator',
        platform: 'GBA',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/YoMama78/MuOS-Consoles/main/preview/GBA.png',
        url: '../routes/emulatorjs.html?core=mgba'
    },
    {
        id: 17,
        name: 'NDS Emulator',
        platform: 'NDS',
        category: 'emulator',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%20DS/Named_Titles/Chrono%20Trigger%20%28USA%29%20%28En%2CFr%29.png',
        url: '../routes/emulatorjs.html?core=melonds'
    },

    {
        id: 103,
        name: 'Retro PC (x86)',
        platform: 'x86 PC',
        category: 'retropc',
        image: '../images/v86.svg',
        url: '../routes/v86.html'
    },
    // Red Alert 2 (RA2 VM: v86 + Win32/DirectX layer, hot-link) - recomp category
    {
        id: 110,
        name: 'Red Alert 2',
        platform: 'PC',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/ra2-games/ra2/main/docs/assets/ra2vm-poster.jpg',
        url: '../routes/ra2.html'
    },
    // Diablo (diabloweb: WASM port of the open-source Devilution engine, hot-link) - recomp category
    {
        id: 111,
        name: 'Diablo',
        platform: 'PC',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/d07RiV/diabloweb/master/public/icon-192.png',
        url: '../routes/diablo.html'
    },
    // Zelda II (z2rs: Rust clean-room reconstruction compiled to WASM, hot-link, BYO ROM) - recomp category
    {
        id: 112,
        name: 'Zelda II',
        platform: 'NES',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/troyedwardsjr/z2rs/main/crates/z2-web/site/assets/hero.webp',
        url: '../routes/z2rs.html'
    },
    {
        id: 104,
        name: 'BBC Micro Emulator',
        platform: 'BBC Micro',
        category: 'retropc',
        image: 'https://raw.githubusercontent.com/mattgodbolt/jsbeeb/master/public/images/jsbeeb-example.png',
        url: '../routes/jsbeeb.html'
    },
    {
        id: 105,
        name: 'Apple II Emulator',
        platform: 'Apple II',
        category: 'retropc',
        image: 'https://cdn.simpleicons.org/apple/ffffff',
        url: '../routes/apple2.html'
    },
    {
        id: 124,
        name: 'Classic Macintosh Emulator',
        platform: 'Classic Mac',
        category: 'retropc',
        image: 'https://cdn.simpleicons.org/apple/ffffff',
        url: '../routes/mac.html'
    },
    {
        id: 106,
        name: 'WASM-4 Fantasy Console',
        platform: 'WASM-4',
        category: 'fantasy',
        image: 'https://cdn.simpleicons.org/webassembly/ffffff',
        url: '../routes/wasm4.html'
    },
    {
        id: 107,
        name: 'PICO-8 Web Games',
        platform: 'PICO-8',
        category: 'fantasy',
        image: '../images/pico8.svg',
        url: '../routes/pico8.html'
    },
    {
        id: 108,
        name: 'MSX Homebrew',
        platform: 'MSX',
        category: 'computer',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Microsoft%20-%20MSX/Named_Titles/10-Yard%20Fight%20%28Japan%29.png',
        url: '../routes/msx.html'
    },
    {
        id: 125,
        name: 'Radio-86RK Emulator',
        platform: 'Radio-86RK',
        category: 'computer',
        image: '../images/rk86.svg',
        url: '../routes/rk86.html'
    },
    {
        id: 126,
        name: 'Atari ST Emulator',
        platform: 'Atari ST',
        category: 'computer',
        image: 'https://cdn.simpleicons.org/atari/ffffff',
        url: '../routes/esty.html'
    },
    {
        id: 127,
        name: 'Android-x86 Emulator',
        platform: 'Android',
        category: 'mobile',
        image: 'https://cdn.simpleicons.org/android/3DDC84',
        url: '../routes/android.html'
    },
    {
        id: 109,
        name: 'J2ME Mobile Games',
        platform: 'J2ME',
        category: 'mobile',
        image: 'https://raw.githubusercontent.com/rosabis/J2meJS/main/java/img/icon-512.png',
        url: '../routes/j2me.html'
    },
    // Palm OS emulator (CloudpilotEmu hot-link, GPL-3.0) - mobile category
    {
        id: 101,
        name: 'Palm OS Emulator',
        platform: 'Palm OS',
        category: 'mobile',
        image: 'https://raw.githubusercontent.com/cloudpilot-emu/cloudpilot-emu/master/doc/images/m515.jpeg',
        url: '../routes/palm.html'
    },
    // WIPI emulator (WIE hot-link, MIT) - mobile category
    {
        id: 102,
        name: 'WIPI Emulator',
        platform: 'WIPI',
        category: 'mobile',
        image: 'https://raw.githubusercontent.com/dlunch/WIE/main/wie-app/icons/icon.png',
        url: '../routes/wipi.html'
    },
    {
        id: 1,
        name: 'Square Obstacles',
        platform: 'PC',
        category: 'webgames',
        image: '../gamebox/ball/squareobstacle.png',
        url: '../catalogues/gameplay.html?game=square-obstacles'
    },
    {
        id: 2,
        name: 'Pong',
        platform: 'PC',
        category: 'webgames',
        image: '../gamebox/bong/bong.png',
        url: '../catalogues/gameplay.html?game=pong'
    },
    {
        id: 3,
        name: 'Breakout',
        platform: 'PC',
        category: 'webgames',
        image: '../gamebox/breakout/breakout.png',
        url: '../catalogues/gameplay.html?game=breakout'
    },
    {
        id: 4,
        name: 'Tic Tac Toe',
        platform: 'PC',
        category: 'webgames',
        image: '../gamebox/tic-tac-toe/tictactoe.png',
        url: '../catalogues/gameplay.html?game=tic-tac-toe'
    },
    // Tamaweb virtual pet (hot-linked official static build, CC BY-NC-SA 4.0)
    {
        id: 100,
        name: 'Tamaweb',
        platform: 'PC',
        category: 'webgames',
        image: 'https://raw.githubusercontent.com/autosam/Tamaweb/main/apple-icon.png',
        url: '../routes/tamaweb.html'
    },
    // Open-source web games (hot-link via the generic player routes/webgame.html?game=<key>)
    {
        id: 113,
        name: '2048',
        platform: 'PC',
        category: 'webgames',
        image: 'https://raw.githubusercontent.com/devrsi0n/React-2048-game/master/public/favicon.ico',
        url: '../routes/webgame.html?game=2048'
    },
    {
        id: 114,
        name: 'Pac-Man',
        platform: 'PC',
        category: 'webgames',
        image: 'https://raw.githubusercontent.com/masonicGIT/pacman/master/shots/montage2.png',
        url: '../routes/webgame.html?game=pacman'
    },
    {
        id: 115,
        name: 'T-Rex Runner',
        platform: 'PC',
        category: 'webgames',
        image: 'https://raw.githubusercontent.com/wayou/t-rex-runner/master/img/chrome_offline_game.gif',
        url: '../routes/webgame.html?game=trex'
    },
    {
        id: 116,
        name: 'Space Invaders',
        platform: 'PC',
        category: 'webgames',
        image: 'https://raw.githubusercontent.com/dwmkerr/spaceinvaders/master/jev-invaders/docs/reflexive.gif',
        url: '../routes/webgame.html?game=spaceinvaders'
    },
    {
        id: 117,
        name: 'SkiFree',
        platform: 'PC',
        category: 'webgames',
        image: '../images/skifree.svg',
        url: '../routes/webgame.html?game=skifree'
    },
    {
        id: 118,
        name: 'Flappy Bird',
        platform: 'PC',
        category: 'webgames',
        image: 'https://raw.githubusercontent.com/nebez/floppybird/master/screencap.png',
        url: '../routes/webgame.html?game=floppybird'
    },
    {
        id: 119,
        name: 'HexGL',
        platform: 'PC',
        category: 'webgames',
        image: 'https://raw.githubusercontent.com/BKcore/HexGL/master/icon_256.png',
        url: '../routes/webgame.html?game=hexgl'
    },
    {
        id: 120,
        name: 'Astray',
        platform: 'PC',
        category: 'webgames',
        image: '../images/astray.svg',
        url: '../routes/webgame.html?game=astray'
    },
    {
        id: 121,
        name: 'Q1K3',
        platform: 'PC',
        category: 'webgames',
        image: '../images/q1k3.svg',
        url: '../routes/webgame.html?game=q1k3'
    },
    {
        id: 122,
        name: 'Underrun',
        platform: 'PC',
        category: 'webgames',
        image: '../images/underrun.svg',
        url: '../routes/webgame.html?game=underrun'
    },
    {
        id: 128,
        name: 'Felt World',
        platform: 'PC',
        category: 'webgames',
        image: 'https://raw.githubusercontent.com/az9713/opus-5.5-open-world-game/master/screenshots/air.jpg',
        url: '../routes/feltworld.html'
    },
    {
        id: 131,
        name: 'NOVA LANCER',
        platform: 'PC',
        category: 'webgames',
        image: 'https://raw.githubusercontent.com/tanuu5/nova-lancer/main/docs/screenshots/hero.jpg',
        url: '../routes/nova.html'
    },
    {
        id: 132,
        name: 'Casa de Gemas',
        platform: 'PC',
        category: 'webgames',
        image: 'https://raw.githubusercontent.com/deepujain/casadegema/main/preview.png',
        url: '../routes/casa.html'
    },
    {
        id: 133,
        name: 'Papertrails',
        platform: 'PC',
        category: 'webgames',
        image: 'https://raw.githubusercontent.com/xikhar/papertrails/master/screenshots/hero.png',
        url: '../routes/webgame.html?game=papertrails'
    },
    // 雾锁山门 (AI-generated 3D action game, hot-link via the generic player, AGPL-3.0 + demo content © 2026 歸藏)
    {
        id: 176,
        name: '雾锁山门 (AI 3D)',
        platform: 'PC',
        category: 'webgames',
        image: 'https://raw.githubusercontent.com/op7418/guizang-game-skill/main/media/cover.jpg',
        url: '../routes/webgame.html?game=wusuomon'
    },
    // Text games (v8.6.1 batch): narrative / incremental games via the same
    // generic hot-link player. Card images are hot-linked from each project's
    // official repository (onerror falls back to ../images/game.svg).
    {
        id: 178,
        name: 'A Dark Room',
        platform: 'PC',
        category: 'webgames',
        image: 'https://raw.githubusercontent.com/doublespeakgames/adarkroom/master/img/adr.png',
        url: '../routes/webgame.html?game=adarkroom'
    },
    {
        id: 179,
        name: '人生重开模拟器',
        platform: 'PC',
        category: 'webgames',
        image: 'https://raw.githubusercontent.com/AliyunWorkbench/lifeRestart/master/view/images/icons/icon-512x512.png',
        url: '../routes/webgame.html?game=liferestart'
    },
    {
        id: 180,
        name: 'Candy Box 2',
        platform: 'PC',
        category: 'webgames',
        image: 'https://raw.githubusercontent.com/candybox2/candybox2.github.io/master/favicon.png',
        url: '../routes/webgame.html?game=candybox2'
    },
    {
        id: 181,
        name: 'Antimatter Dimensions',
        platform: 'PC',
        category: 'webgames',
        image: 'https://raw.githubusercontent.com/IvarK/AntimatterDimensionsSourceCode/master/public/icon.png',
        url: '../routes/webgame.html?game=antimatter'
    },
    {
        id: 182,
        name: '文字修仙',
        platform: 'PC',
        category: 'webgames',
        image: 'https://raw.githubusercontent.com/setube/vue-xiuxiangame/master/public/icons/icon-512x512.png',
        url: '../routes/webgame.html?game=xiuxian'
    },
    {
        id: 183,
        name: 'Cube Composer',
        platform: 'PC',
        category: 'webgames',
        image: 'https://raw.githubusercontent.com/sharkdp/cube-composer/master/img/favicon-196.png',
        url: '../routes/webgame.html?game=cubecomposer'
    },
    {
        id: 184,
        name: 'Hexapipes',
        platform: 'PC',
        category: 'webgames',
        image: 'https://raw.githubusercontent.com/gereleth/hexapipes/main/static/og_image_v1.png',
        url: '../routes/webgame.html?game=hexapipes'
    },
    {
        id: 185,
        name: 'Mimstris',
        platform: 'PC',
        category: 'webgames',
        image: 'https://raw.githubusercontent.com/mimshwright/mimstris/master/screenshot.gif',
        url: '../routes/webgame.html?game=mimstris'
    },
    {
        id: 186,
        name: 'Esviji',
        platform: 'PC',
        category: 'webgames',
        image: 'https://raw.githubusercontent.com/esviji/esviji/master/static/img/esviji-logo-180.png',
        url: '../routes/webgame.html?game=esviji'
    },
    {
        id: 134,
        name: 'Super Mario 64',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Super%20Mario%2064%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=sm64'
    },
    {
        id: 135,
        name: 'F-Zero X',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/F-Zero%20X%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=fzerox'
    },
    {
        id: 136,
        name: 'Mario Party',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Mario%20Party%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=marioparty'
    },
    {
        id: 137,
        name: 'San Francisco Rush 2049',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/San%20Francisco%20Rush%202049%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=rush2049'
    },
    {
        id: 138,
        name: 'GoldenEye 007',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/007%20-%20GoldenEye%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=goldeneye'
    },
    {
        id: 139,
        name: "The Legend of Zelda: Majora's Mask",
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Legend%20of%20Zelda%2C%20The%20-%20Majora%27s%20Mask%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=majorasmask'
    },
    {
        id: 140,
        name: 'Banjo-Kazooie',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Banjo-Kazooie%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=banjokazooie'
    },
    {
        id: 141,
        name: "Conker's Bad Fur Day",
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Conker%27s%20Bad%20Fur%20Day%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=conker'
    },
    {
        id: 142,
        name: 'Donkey Kong 64',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Donkey%20Kong%2064%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=dk64'
    },
    {
        id: 143,
        name: 'Wave Race 64',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Wave%20Race%2064%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=waverace64'
    },
    {
        id: 144,
        name: 'Pilotwings 64',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Pilotwings%2064%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=pilotwings64'
    },
    {
        id: 145,
        name: 'Banjo-Tooie',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Banjo-Tooie%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=banjotooie'
    },
    {
        id: 146,
        name: 'Mario Kart 64',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Mario%20Kart%2064%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=mariokart64'
    },
    {
        id: 147,
        name: 'Star Fox 64',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Star%20Fox%2064%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=starfox64'
    },
    {
        id: 148,
        name: 'The Legend of Zelda: Ocarina of Time',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Legend%20of%20Zelda%2C%20The%20-%20Ocarina%20of%20Time%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=oot'
    },
    {
        id: 149,
        name: 'Diddy Kong Racing',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Diddy%20Kong%20Racing%20%28USA%29%20%28En%2CFr%29.png',
        url: '../routes/n64recomp.html?game=diddykongracing'
    },
    {
        id: 150,
        name: 'Jet Force Gemini',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Jet%20Force%20Gemini%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=jetforcegemini'
    },
    {
        id: 151,
        name: 'Star Wars Episode I: Racer',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Star%20Wars%20Episode%20I%20-%20Racer%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=racer'
    },
    {
        id: 152,
        name: 'Pokémon Snap',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Pokemon%20Snap%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=pokemonsnap'
    },
    {
        id: 153,
        name: 'Rush 2: Extreme Racing USA',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Rush%202%20-%20Extreme%20Racing%20USA%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=rush2'
    },
    {
        id: 154,
        name: '1080° Snowboarding',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/1080%20TenEighty%20Snowboarding%20%28Europe%29%20%28En%2CJa%2CFr%2CDe%29.png',
        url: '../routes/n64recomp.html?game=snowboarding1080'
    },
    {
        id: 155,
        name: 'Space Station Silicon Valley',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/SpaceStation%20Silicon%20Valley%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=sssv'
    },

    {
        id: 156,
        name: "Tony Hawk's Pro Skater 2",
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Tony%20Hawk%27s%20Pro%20Skater%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=thps2'
    },
    {
        id: 157,
        name: 'Star Wars: Rogue Squadron',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Star%20Wars%20-%20Rogue%20Squadron%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=roguesquadron'
    },
    {
        id: 158,
        name: 'Beetle Adventure Racing!',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Beetle%20Adventure%20Racing%21%20%28USA%29%20%28En%2CFr%2CDe%29.png',
        url: '../routes/n64recomp.html?game=beetle'
    },
    {
        id: 159,
        name: 'Turok: Rage Wars',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Turok%20-%20Rage%20Wars%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=turokragewars'
    },
    {
        id: 160,
        name: 'WWF No Mercy',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/WWF%20No%20Mercy%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=wwfmercy'
    },
    {
        id: 161,
        name: 'Mario Tennis',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Mario%20Tennis%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=mariotennis'
    },
    {
        id: 162,
        name: 'Perfect Dark',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Perfect%20Dark%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=perfectdark'
    },
    {
        id: 163,
        name: 'Mario Party 2',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Mario%20Party%202%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=marioparty2'
    },
    {
        id: 164,
        name: 'Mario Party 3',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Mario%20Party%203%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=marioparty3'
    },
    {
        id: 165,
        name: 'Super Smash Bros.',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Super%20Smash%20Bros.%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=smashbros'
    },
    {
        id: 166,
        name: 'Paper Mario',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Paper%20Mario%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=papermario'
    },
    {
        id: 167,
        name: 'Mario Golf',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Mario%20Golf%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=mariogolf'
    },
    {
        id: 168,
        name: 'Rayman 2',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Rayman%202%20-%20The%20Great%20Escape%20%28USA%29%20%28En%2CFr%2CDe%2CEs%2CIt%29.png',
        url: '../routes/n64recomp.html?game=rayman2'
    },
    {
        id: 169,
        name: "Donald Duck: Goin' Quackers",
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Donald%20Duck%20-%20Goin%27%20Quackers%20%28USA%29%20%28En%2CFr%2CDe%2CEs%2CIt%29.png',
        url: '../routes/n64recomp.html?game=goinquackers'
    },
    {
        id: 170,
        name: 'Dinosaur Planet',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/n64hub/dinosaur-planet-recomp/main/icons/512.png',
        url: '../routes/n64recomp.html?game=dinosaurplanet'
    },
    {
        id: 171,
        name: 'Turok: Dinosaur Hunter',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Turok%20-%20Dinosaur%20Hunter%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=turok'
    },
    {
        id: 172,
        name: 'Turok 2: Seeds of Evil',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Turok%202%20-%20Seeds%20of%20Evil%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=turok2'
    },
    {
        id: 173,
        name: 'Turok 3: Shadow of Oblivion',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Turok%203%20-%20Shadow%20of%20Oblivion%20%28USA%29%20%28Beta%29%20%282000-05-31%29.png',
        url: '../routes/n64recomp.html?game=turok3'
    },
    {
        id: 174,
        name: 'Excitebike 64',
        platform: 'Nintendo 64',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/libretro/libretro-thumbnails/master/Nintendo%20-%20Nintendo%2064/Named_Titles/Excitebike%2064%20%28USA%29.png',
        url: '../routes/n64recomp.html?game=excitebike64'
    },
    {
        id: 175,
        name: 'LEGO Island (Browser Port)',
        platform: 'PC / Web',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/isledecomp/isle.pizza/master/public/images/install.webp',
        url: '../routes/browserport.html?game=legoisland'
    },
    // Legend of Sword and Fairy (DOS): complete Rust/WASM engine port running
    // the original game data, hot-linked to the official demo site in an iframe.
    // The dedicated route gets COOP/COEP from sw.js so SharedArrayBuffer works.
    {
        id: 177,
        name: 'Legend of Sword and Fairy (DOS)',
        platform: 'PC',
        category: 'recomp',
        image: 'https://raw.githubusercontent.com/madeye/Legend-of-Sword-and-Fairy/master/screenshots/splash.png',
        url: '../routes/rustpal.html'
    }
];

var currentCategory = 'all';
var searchQuery = '';

// Incremental rendering state (Theater-style infinite scroll over local data).
var GAMES_PER_PAGE = 24;
var visibleGames = [];
var renderedGameCount = 0;

// ---------- Favorites & Recent (v8.5.0) ----------
var FAV_KEY = 'ewtv_game_favs';
var RECENT_KEY = 'ewtv_game_recent';

function loadJson(key, fallback) {
    try {
        var raw = localStorage.getItem(key);
        if (!raw) return fallback;
        var val = JSON.parse(raw);
        return val === null || val === undefined ? fallback : val;
    } catch (e) {
        return fallback;
    }
}

function saveJson(key, val) {
    try {
        localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
        console.warn('localStorage save failed:', key, e);
    }
}

function getFavs() {
    return loadJson(FAV_KEY, []);
}

function isFav(id) {
    return getFavs().indexOf(String(id)) !== -1;
}

function toggleFav(id) {
    var favs = getFavs();
    var sid = String(id);
    var idx = favs.indexOf(sid);
    if (idx === -1) {
        favs.unshift(sid);
    } else {
        favs.splice(idx, 1);
    }
    saveJson(FAV_KEY, favs);
    return idx === -1;
}

function getRecent() {
    return loadJson(RECENT_KEY, []);
}

function pushRecent(id) {
    var recent = getRecent();
    var sid = String(id);
    var idx = -1;
    for (var i = 0; i < recent.length; i++) {
        if (recent[i].id === sid) { idx = i; break; }
    }
    if (idx !== -1) recent.splice(idx, 1);
    recent.unshift({ id: sid, ts: Date.now() });
    if (recent.length > 12) recent.length = 12;
    saveJson(RECENT_KEY, recent);
}

function findGameById(id) {
    var sid = String(id);
    for (var i = 0; i < games.length; i++) {
        if (String(games[i].id) === sid) return games[i];
    }
    return null;
}

// Each game ID is an identity key for favorites and Continue Playing, so no
// normalization is performed at runtime; duplicate cards must be removed in
// the source array below.

// ---------- Keyboard / Gamepad focus navigation (v8.5.0) ----------
var GamepadNav = {
    repeatDelay: 200,
    _lastRepeat: 0,
    _rafId: null,

    // All focusable elements in navigation order: sidebar categories first, then visible cards
    getFocusables: function() {
        var items = [];
        $$('.category-item').forEach(function(el) {
            if (el.offsetParent) items.push(el);
        });
        $$('.game-card').forEach(function(el) {
            if (el.offsetParent) items.push(el);
        });
        return items;
    },

    // Move focus to the geometrically nearest element in the given direction
    move: function(el, dx, dy) {
        var items = this.getFocusables();
        if (!items.length) return;
        var idx = items.indexOf(el);
        if (idx === -1) { items[0].focus(); return; }
        var rect = el.getBoundingClientRect();
        var cx = rect.left + rect.width / 2;
        var cy = rect.top + rect.height / 2;
        var best = null, bestScore = Infinity;
        for (var i = 0; i < items.length; i++) {
            if (i === idx) continue;
            var r = items[i].getBoundingClientRect();
            var ox = r.left + r.width / 2 - cx;
            var oy = r.top + r.height / 2 - cy;
            var sameRow = Math.abs(oy) < rect.height * 0.6;
            var forward;
            if (dx > 0) forward = sameRow && ox > 0;
            else if (dx < 0) forward = sameRow && ox < 0;
            else if (dy > 0) forward = oy > 0;
            else forward = oy < 0;
            if (!forward) continue;
            // Score: dominant-axis distance + small cross-axis penalty
            var score = dy !== 0 ? Math.abs(oy) * 2 + Math.abs(ox) * 3 : Math.abs(ox) * 2 + Math.abs(oy) * 3;
            if (score < bestScore) { bestScore = score; best = items[i]; }
        }
        // Fallback for left/right: if nothing on the same row, jump to the nearest
        // element in that direction (e.g. sidebar -> game grid)
        if (!best && dx !== 0) {
            for (var j = 0; j < items.length; j++) {
                if (j === idx) continue;
                var r2 = items[j].getBoundingClientRect();
                var ox2 = r2.left + r2.width / 2 - cx;
                var oy2 = Math.abs(r2.top + r2.height / 2 - cy);
                if ((dx > 0 && ox2 > 0) || (dx < 0 && ox2 < 0)) {
                    var score2 = Math.abs(ox2) + oy2;
                    if (score2 < bestScore) { bestScore = score2; best = items[j]; }
                }
            }
        }
        if (best) best.focus();
    },

    handleKey: function(e) {
        var target = e.target;
        // Don't hijack typing in the search box or other form controls
        if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
            return;
        }
        var focused = document.activeElement;
        var items = this.getFocusables();
        var inside = focused && (items.indexOf(focused) !== -1);
        var key = e.key;
        if (key === 'ArrowRight' || key === 'ArrowLeft' || key === 'ArrowUp' || key === 'ArrowDown') {
            e.preventDefault();
            if (!inside) { items[0].focus(); return; }
            this.move(focused, key === 'ArrowRight' ? 1 : key === 'ArrowLeft' ? -1 : 0, key === 'ArrowDown' ? 1 : key === 'ArrowUp' ? -1 : 0);
        } else if (key === 'Enter') {
            if (inside && focused.classList.contains('game-card')) {
                e.preventDefault();
                focused.click();
            }
            // Enter on .category-item and native buttons uses default behavior
        }
    },

    handleGamepad: function(gp) {
        var now = Date.now();
        if (now - this._lastRepeat < this.repeatDelay) return;
        var pressed =
            ((gp.buttons[14] && gp.buttons[14].pressed) || (gp.axes[0] !== undefined && gp.axes[0] < -0.5)) ? 'left' :
            ((gp.buttons[15] && gp.buttons[15].pressed) || (gp.axes[0] !== undefined && gp.axes[0] > 0.5)) ? 'right' :
            ((gp.buttons[12] && gp.buttons[12].pressed) || (gp.axes[1] !== undefined && gp.axes[1] < -0.5)) ? 'up' :
            ((gp.buttons[13] && gp.buttons[13].pressed) || (gp.axes[1] !== undefined && gp.axes[1] > 0.5)) ? 'down' :
            (gp.buttons[0] && gp.buttons[0].pressed) ? 'ok' : null;
        if (!pressed) return;
        this._lastRepeat = now;
        var focused = document.activeElement;
        var items = this.getFocusables();
        if (pressed === 'ok') {
            if (focused && items.indexOf(focused) !== -1) focused.click();
            else items[0].focus();
            return;
        }
        if (!focused || items.indexOf(focused) === -1) { items[0].focus(); return; }
        this.move(focused,
            pressed === 'right' ? 1 : pressed === 'left' ? -1 : 0,
            pressed === 'down' ? 1 : pressed === 'up' ? -1 : 0);
    },

    pollGamepads: function() {
        var self = this;
        var poll = function() {
            var pads = navigator.getGamepads ? navigator.getGamepads() : [];
            for (var i = 0; i < pads.length; i++) {
                if (pads[i] && pads[i].connected) {
                    self.handleGamepad(pads[i]);
                    break;
                }
            }
            self._rafId = requestAnimationFrame(poll);
        };
        if (this._rafId === null) poll();
    }
};

// Helper functions
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

// Build one card's HTML (shared by grid + recent row)
function gameCardHtml(game) {
    var fav = isFav(game.id);
    var html = '<a href="' + game.url + '"' + (game.external ? ' target="_blank" rel="noopener"' : '') + ' class="game-card" data-game-id="' + game.id + '" tabindex="0">';
    html += '  <div class="game-image-wrapper">';
    html += '    <img class="game-image" src="' + game.image + '" alt="' + game.name + '" onerror="this.src=\'../images/game.svg\'">';
    html += '    <button class="game-fav-btn' + (fav ? ' active' : '') + '" data-fav-id="' + game.id + '" title="Favorite" aria-label="Toggle favorite"><i class="fa' + (fav ? 's' : 'r') + ' fa-star"></i></button>';
    html += '  </div>';
    html += '  <div class="game-overlay"></div>';
    html += '  <div class="play-icon"><i class="fas fa-play"></i></div>';
    html += '  <div class="game-info">';
    html += '    <span class="game-platform">' + game.platform + '</span>';
    html += '    <h4 class="game-name">' + game.name + '</h4>';
    html += '  </div>';
    html += '</a>';
    return html;
}

// Render recently played games as a dedicated sidebar view.
function recentGamesHtml() {
    var recent = getRecent();
    var cards = '';
    var shown = 0;
    for (var i = 0; i < recent.length && shown < 12; i++) {
        var game = findGameById(recent[i].id);
        if (game) {
            cards += gameCardHtml(game);
            shown++;
        }
    }
    if (!shown) {
        return '<div class="no-results recent-empty"><i class="fas fa-clock-rotate-left"></i><p>' + tgT('noRecent') + '</p></div>';
    }
    return cards;
}

// Render starred games as a dedicated sidebar view. Unlike Recently Played
// (a short "continue where you left off" shelf), favorites are user-curated
// and must all be reachable, so there is no arbitrary 12-card cap here.
function favoriteGamesHtml() {
    var favs = getFavs();
    var cards = '';
    for (var i = 0; i < favs.length; i++) {
        var game = findGameById(favs[i]);
        if (game) cards += gameCardHtml(game);
    }
    if (!cards) {
        return '<div class="no-results recent-empty"><i class="fas fa-star"></i><p>' + tgT('noFavs') + '</p></div>';
    }
    return cards;
}

// Load the next batch of filtered games into the grid.
function loadMoreGames() {
    if (renderedGameCount >= visibleGames.length) return;
    var grid = $('#gameGrid');
    var next = visibleGames.slice(renderedGameCount, renderedGameCount + GAMES_PER_PAGE);
    var html = '';
    next.forEach(function(game) { html += gameCardHtml(game); });
    grid.insertAdjacentHTML('beforeend', html);
    renderedGameCount += next.length;
    var indicator = $('#loadMoreIndicator');
    if (indicator) {
        indicator.style.display = renderedGameCount < visibleGames.length ? '' : 'none';
    }
}

// Theater-style fallback: if the first batch does not fill the viewport on a
// wide screen, keep appending batches until scrolling is actually possible.
function checkAutoLoadGames() {
    if (renderedGameCount >= visibleGames.length) return;
    var main = $('#mainContent');
    if (!main || main.scrollHeight > main.clientHeight + 100) return;
    loadMoreGames();
    checkAutoLoadGames();
}

// Render games
function renderGames() {
    var grid = $('#gameGrid');
    grid.innerHTML = '';
    visibleGames = [];
    renderedGameCount = 0;
    var indicator = $('#loadMoreIndicator');
    if (indicator) indicator.style.display = 'none';

    // Recently played and favorites are their own sidebar views rather than shelves on All Games.
    if (currentCategory === 'recent') {
        grid.innerHTML = recentGamesHtml();
        return;
    }
    if (currentCategory === 'favorites') {
        grid.innerHTML = favoriteGamesHtml();
        return;
    }

    var filteredGames = games;
    
    // Filter by category
    if (currentCategory !== 'all') {
        filteredGames = filteredGames.filter(function(game) {
            return game.category === currentCategory;
        });
    }
    
    // Filter by search: match the game name or its platform (e.g. "N64" finds
    // every N64Recomp card, not just titles that literally contain N64).
    if (searchQuery) {
        var q = searchQuery.toLowerCase();
        filteredGames = filteredGames.filter(function(game) {
            return game.name.toLowerCase().indexOf(q) !== -1 ||
                (game.platform && game.platform.toLowerCase().indexOf(q) !== -1);
        });
    }
    
    if (filteredGames.length === 0) {
        grid.innerHTML = '<div class="no-results"><i class="fas fa-gamepad"></i><p>' + tgT('noGames') + '</p></div>';
        return;
    }

    visibleGames = filteredGames;
    loadMoreGames();
    checkAutoLoadGames();
}

// Toggle sidebar
function toggleSidebar() {
    var sidebar = $('#sidebar');
    var mainContent = $('#mainContent');
    
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('show-mobile');
    } else {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    }
}

// Show toast notification
function showToast(message, type) {
    type = type || 'info';
    
    // Remove existing toast
    var existingToast = $('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    var toast = document.createElement('div');
    toast.className = 'toast-notification ' + type;
    toast.style.cssText = 'position: fixed; top: 80px; right: 20px; padding: 15px 20px; background: rgba(0,0,0,0.9); border: 2px solid #a3001b; border-radius: 10px; color: #fff; z-index: 9999; display: flex; align-items: center; gap: 10px;';
    toast.innerHTML = '<i class="fas fa-info-circle" style="color: #a3001b"></i><span>' + message + '</span>';
    
    document.body.appendChild(toast);
    
    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Game Page Loaded ===');

    // Translate all static HTML copy (titles, sidebar, placeholders, loading
    // states) and set the document language.
    applyI18n();

    // Deep link: ?category=<id> selects the category (e.g. back links from
    // the standalone emulator pages: fantasy / computer / mobile / retropc)
    var urlCategory = new URLSearchParams(window.location.search).get('category');
    // Backward compatibility: the category was renamed 'others' -> 'webgames'
    // (v8.5.2); old deep links / bookmarks keep working.
    if (urlCategory === 'others') urlCategory = 'webgames';
    if (urlCategory) {
        var target = document.querySelector('.category-item[data-category="' + urlCategory + '"]');
        if (target) {
            $$('.category-item').forEach(function(el) { el.classList.remove('active'); });
            target.classList.add('active');
            currentCategory = urlCategory;
        }
    }

    // Render initial games
    renderGames();
    
    // Incremental loading: reveal the next batch near the bottom, like Theater.
    $('#mainContent').addEventListener('scroll', function() {
        if (!$('#loadMoreIndicator') || $('#loadMoreIndicator').style.display === 'none') return;
        var main = $('#mainContent');
        if (main.scrollTop + main.clientHeight >= main.scrollHeight - 100) {
            loadMoreGames();
        }
    });
    // Favorites & recent: event delegation on the grid (v8.5.0)
    $('#gameGrid').addEventListener('click', function(e) {
        var favBtn = e.target.closest ? e.target.closest('.game-fav-btn') : null;
        if (favBtn) {
            e.preventDefault();
            e.stopPropagation();
            var added = toggleFav(favBtn.dataset.favId);
            // Update only this star so infinite-scroll position is preserved.
            favBtn.classList.toggle('active', added);
            favBtn.innerHTML = '<i class="fa' + (added ? 's' : 'r') + ' fa-star"></i>';
            // In the Favorites view an unstar removes the card from the list,
            // so refresh the whole view to keep it in sync.
            if (currentCategory === 'favorites' && !added) renderGames();
            return;
        }
        var card = e.target.closest ? e.target.closest('.game-card[data-game-id]') : null;
        if (card) {
            pushRecent(card.dataset.gameId);
            // navigation proceeds normally via the anchor href
        }
    });
    
    // Keyboard arrows/Enter navigation + gamepad polling (v8.5.0)
    document.addEventListener('keydown', function(e) {
        GamepadNav.handleKey(e);
    });
    if (navigator.getGamepads) {
        window.addEventListener('gamepadconnected', function() {
            GamepadNav.pollGamepads();
        });
        // Start polling immediately if a pad is already connected
        var existingPads = navigator.getGamepads();
        for (var pi = 0; pi < existingPads.length; pi++) {
            if (existingPads[pi] && existingPads[pi].connected) {
                GamepadNav.pollGamepads();
                break;
            }
        }
    }
    
    // Back button
    $('#backBtn').addEventListener('click', function() {
        window.location.href = '../index.html';
    });
    
    // Menu toggle
    $('#menuBtn').addEventListener('click', function() {
        toggleSidebar();
    });
    
    // Toggle sidebar button
    $('#toggleSidebar').addEventListener('click', function() {
        toggleSidebar();
    });
    
    // Category selection
    $$('.category-item').forEach(function(item) {
        item.addEventListener('click', function() {
            $$('.category-item').forEach(function(el) {
                el.classList.remove('active');
            });
            this.classList.add('active');
            currentCategory = this.dataset.category;
            renderGames();
            
            // Hide sidebar on mobile
            if (window.innerWidth <= 768) {
                $('#sidebar').classList.remove('show-mobile');
            }
        });
    });
    
    // Search functionality
    $('#searchInput').addEventListener('keyup', function(e) {
        searchQuery = this.value.trim();
        renderGames();
    });
    
    $('#searchBtn').addEventListener('click', function() {
        searchQuery = $('#searchInput').value.trim();
        renderGames();
    });
    
    // Handle window resize
    var gameResizeTimer = null;
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            $('#sidebar').classList.remove('show-mobile');
        }
        clearTimeout(gameResizeTimer);
        gameResizeTimer = setTimeout(checkAutoLoadGames, 200);
    });
});
