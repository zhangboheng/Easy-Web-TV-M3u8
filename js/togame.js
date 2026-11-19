// Game Page JS - Modern UI Version
// Native JavaScript (No jQuery)

// Game data
var games = [
    // Emulator Games
    {
        id: 26,
        name: 'Arcade Emulator',
        platform: 'Arcade',
        category: 'emulator',
        image: '../images/arcade.svg',
        url: '../routes/emulatorjs.html?core=fbneo'
    },
    {
        id: 20,
        name: 'Atari 2600 Emulator',
        platform: 'Atari 2600',
        category: 'emulator',
        image: '../images/atari2600.svg',
        url: '../routes/emulatorjs.html?core=stella2014'
    },
    {
        id: 32,
        name: 'Commodore PET Emulator',
        platform: 'PET',
        category: 'emulator',
        image: '../images/pet.svg',
        url: '../routes/emulatorjs.html?core=vice_xpet'
    },
    {
        id: 31,
        name: 'Commodore VIC-20 Emulator',
        platform: 'VIC-20',
        category: 'emulator',
        image: '../images/vic20.svg',
        url: '../routes/emulatorjs.html?core=vice_xvic'
    },
    {
        id: 28,
        name: 'ColecoVision Emulator',
        platform: 'ColecoVision',
        category: 'emulator',
        image: '../images/colecovision.svg',
        url: '../routes/emulatorjs.html?core=gearcoleco'
    },
    {
        id: 29,
        name: 'Commodore 64 Emulator',
        platform: 'C64',
        category: 'emulator',
        image: '../images/c64.svg',
        url: '../routes/emulatorjs.html?core=vice_x64'
    },
    {
        id: 22,
        name: 'Atari 5200 Emulator',
        platform: 'Atari 5200',
        category: 'emulator',
        image: '../images/atari5200.svg',
        url: '../routes/emulatorjs.html?core=a5200'
    },
    {
        id: 5,
        name: 'NES Emulator',
        platform: 'NES',
        category: 'emulator',
        image: '../images/nes.svg',
        url: '../routes/emulatorjs.html?core=fceumm'
    },
    {
        id: 33,
        name: 'Commodore Plus/4 Emulator',
        platform: 'Plus/4',
        category: 'emulator',
        image: '../images/plus4.svg',
        url: '../routes/emulatorjs.html?core=vice_xplus4'
    },
    {
        id: 13,
        name: 'Master System Emulator',
        platform: 'Master System',
        category: 'emulator',
        image: '../images/mastersystem.svg',
        url: '../routes/emulatorjs.html?core=smsplus'
    },
    {
        id: 34,
        name: 'Amiga Emulator',
        platform: 'Amiga',
        category: 'emulator',
        image: '../images/amiga.svg',
        url: '../routes/emulatorjs.html?core=puae'
    },
    {
        id: 30,
        name: 'Commodore 128 Emulator',
        platform: 'C128',
        category: 'emulator',
        image: '../images/c128.svg',
        url: '../routes/emulatorjs.html?core=vice_x128'
    },
    {
        id: 21,
        name: 'Atari 7800 Emulator',
        platform: 'Atari 7800',
        category: 'emulator',
        image: '../images/atari7800.svg',
        url: '../routes/emulatorjs.html?core=prosystem'
    },
    {
        id: 12,
        name: 'Genesis Emulator',
        platform: 'Genesis',
        category: 'emulator',
        image: '../images/genesis.svg',
        url: '../routes/emulatorjs.html?core=genesis_plus_gx'
    },
    {
        id: 24,
        name: 'Atari Lynx Emulator',
        platform: 'Atari Lynx',
        category: 'emulator',
        image: '../images/atarilynx.svg',
        url: '../routes/emulatorjs.html?core=handy'
    },
    {
        id: 8,
        name: 'Game Boy Emulator',
        platform: 'GB/GBC',
        category: 'emulator',
        image: '../images/gb.svg',
        url: '../routes/emulatorjs.html?core=gambatte'
    },
    {
        id: 36,
        name: 'Sega Game Gear Emulator',
        platform: 'Game Gear',
        category: 'emulator',
        image: '../images/gamegear.svg',
        url: '../routes/emulatorjs.html?core=smsplus'
    },
    {
        id: 6,
        name: 'SNES Emulator',
        platform: 'SNES',
        category: 'emulator',
        image: '../images/snes.svg',
        url: '../routes/emulatorjs.html?core=snes9x'
    },
    {
        id: 14,
        name: 'Sega CD Emulator',
        platform: 'Sega CD',
        category: 'emulator',
        image: '../images/segacd.svg',
        url: '../routes/emulatorjs.html?core=picodrive'
    },
    {
        id: 25,
        name: '3DO Emulator',
        platform: '3DO',
        category: 'emulator',
        image: '../images/3do.svg',
        url: '../routes/emulatorjs.html?core=opera'
    },
    {
        id: 23,
        name: 'Atari Jaguar Emulator',
        platform: 'Atari Jaguar',
        category: 'emulator',
        image: '../images/atarijaguar.svg',
        url: '../routes/emulatorjs.html?core=virtualjaguar'
    },
    {
        id: 35,
        name: 'Sega 32X Emulator',
        platform: 'Sega 32X',
        category: 'emulator',
        image: '../images/sega32x.svg',
        url: '../routes/emulatorjs.html?core=picodrive'
    },
    {
        id: 10,
        name: 'PS1 Emulator',
        platform: 'PS1',
        category: 'emulator',
        image: '../images/ps1.svg',
        url: '../routes/emulatorjs.html?core=pcsx_rearmed'
    },
    {
        id: 15,
        name: 'Saturn Emulator',
        platform: 'Saturn',
        category: 'emulator',
        image: '../images/saturn.svg',
        url: '../routes/emulatorjs.html?core=yabause'
    },
    {
        id: 37,
        name: 'Virtual Boy Emulator',
        platform: 'Virtual Boy',
        category: 'emulator',
        image: '../images/virtualboy.svg',
        url: '../routes/emulatorjs.html?core=beetle_vb'
    },
    {
        id: 38,
        name: 'PC Engine Emulator',
        platform: 'PCE',
        category: 'emulator',
        image: '../images/pcengine.svg',
        url: '../routes/emulatorjs.html?core=mednafen_pce'
    },
    {
        id: 39,
        name: 'WonderSwan Emulator',
        platform: 'WS',
        category: 'emulator',
        image: '../images/wonderswan.svg',
        url: '../routes/emulatorjs.html?core=mednafen_wswan'
    },
    {
        id: 40,
        name: 'Neo Geo Pocket Emulator',
        platform: 'NGP',
        category: 'emulator',
        image: '../images/ngp.svg',
        url: '../routes/emulatorjs.html?core=mednafen_ngp'
    },
    {
        id: 41,
        name: 'Amstrad CPC Emulator',
        platform: 'CPC',
        category: 'emulator',
        image: '../images/amstrad.svg',
        url: '../routes/emulatorjs.html?core=cap32'
    },
    {
        id: 42,
        name: 'Doom Engine (prboom)',
        platform: 'DOOM',
        category: 'emulator',
        image: '../images/doom.svg',
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
        image: '../images/ps2.svg',
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
        image: '../images/psvita.svg',
        url: '../routes/vita.html'
    },
    {
        id: 44,
        name: 'ZX Spectrum Emulator',
        platform: 'ZX',
        category: 'emulator',
        image: '../images/zx.svg',
        url: '../routes/emulatorjs.html?core=fuse'
    },
    {
        id: 45,
        name: 'PSP Emulator',
        platform: 'PSP',
        category: 'emulator',
        image: '../images/psp.svg',
        url: '../routes/emulatorjs.html?core=ppsspp'
    },
    {
        id: 46,
        name: 'Sega CD Emulator',
        platform: 'Sega CD',
        category: 'emulator',
        image: '../images/segacd.svg',
        url: '../routes/emulatorjs.html?core=picodrive&platform=segacd'
    },
    {
        id: 47,
        name: 'PC-FX Emulator',
        platform: 'PC-FX',
        category: 'emulator',
        image: '../images/pcfx.svg',
        url: '../routes/emulatorjs.html?core=mednafen_pcfx'
    },
    {
        id: 48,
        name: 'Flash Player (Ruffle)',
        platform: 'Flash',
        category: 'emulator',
        image: '../images/flash.svg',
        url: '../routes/flash.html'
    },
    {
        id: 49,
        name: 'DOS Emulator (js-dos)',
        platform: 'DOS',
        category: 'emulator',
        image: '../images/dos.svg',
        url: '../routes/dos.html'
    },
    {
        id: 9,
        name: 'N64 Emulator',
        platform: 'N64',
        category: 'emulator',
        image: '../images/n64.svg',
        url: '../routes/emulatorjs.html?core=mupen64plus_next'
    },
    {
        id: 27,
        name: 'MAME 2003+ Emulator',
        platform: 'MAME',
        category: 'emulator',
        image: '../images/mame.svg',
        url: '../routes/emulatorjs.html?core=mame2003_plus'
    },
    {
        id: 7,
        name: 'GBA Emulator',
        platform: 'GBA',
        category: 'emulator',
        image: '../images/gba.svg',
        url: '../routes/emulatorjs.html?core=mgba'
    },
    {
        id: 17,
        name: 'NDS Emulator',
        platform: 'NDS',
        category: 'emulator',
        image: '../images/nds.svg',
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
        platform: 'Red Alert 2',
        category: 'recomp',
        image: '../images/ra2.svg',
        url: '../routes/ra2.html'
    },
    // Diablo (diabloweb: WASM port of the open-source Devilution engine, hot-link) - recomp category
    {
        id: 111,
        name: 'Diablo',
        platform: 'Diablo',
        category: 'recomp',
        image: '../images/diablo.svg',
        url: '../routes/diablo.html'
    },
    // Zelda II (z2rs: Rust clean-room reconstruction compiled to WASM, hot-link, BYO ROM) - recomp category
    {
        id: 112,
        name: 'Zelda II',
        platform: 'Zelda II',
        category: 'recomp',
        image: '../images/z2rs.svg',
        url: '../routes/z2rs.html'
    },
    {
        id: 104,
        name: 'BBC Micro Emulator',
        platform: 'BBC Micro',
        category: 'retropc',
        image: '../images/jsbeeb.svg',
        url: '../routes/jsbeeb.html'
    },
    {
        id: 105,
        name: 'Apple II Emulator',
        platform: 'Apple II',
        category: 'retropc',
        image: '../images/apple2.svg',
        url: '../routes/apple2.html'
    },
    {
        id: 106,
        name: 'WASM-4 Fantasy Console',
        platform: 'WASM-4',
        category: 'fantasy',
        image: '../images/wasm4.svg',
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
        image: '../images/msx.svg',
        url: '../routes/msx.html'
    },
    {
        id: 109,
        name: 'J2ME Mobile Games',
        platform: 'J2ME',
        category: 'mobile',
        image: '../images/j2me.svg',
        url: '../routes/j2me.html'
    },
    // Palm OS emulator (CloudpilotEmu hot-link, GPL-3.0) - mobile category
    {
        id: 101,
        name: 'Palm OS Emulator',
        platform: 'Palm OS',
        category: 'mobile',
        image: '../images/palm.svg',
        url: '../routes/palm.html'
    },
    // WIPI emulator (WIE hot-link, MIT) - mobile category
    {
        id: 102,
        name: 'WIPI Emulator',
        platform: 'WIPI',
        category: 'mobile',
        image: '../images/wipi.svg',
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
    // Tamaweb virtual pet (vendored from https://github.com/autosam/Tamaweb, CC BY-NC-SA 4.0)
    {
        id: 100,
        name: 'Tamaweb',
        platform: 'PC',
        category: 'webgames',
        image: '../gamebox/tamaweb/resources/img/character/chara_100b.png',
        url: '../catalogues/gameplay.html?game=tamaweb'
    },
    // Open-source web games (hot-link via the generic player routes/webgame.html?game=<key>)
    {
        id: 113,
        name: '2048',
        platform: 'PC',
        category: 'webgames',
        image: '../images/web2048.svg',
        url: '../routes/webgame.html?game=2048'
    },
    {
        id: 114,
        name: 'Pac-Man',
        platform: 'PC',
        category: 'webgames',
        image: '../images/pacman.svg',
        url: '../routes/webgame.html?game=pacman'
    },
    {
        id: 115,
        name: 'T-Rex Runner',
        platform: 'PC',
        category: 'webgames',
        image: '../images/trex.svg',
        url: '../routes/webgame.html?game=trex'
    },
    {
        id: 116,
        name: 'Space Invaders',
        platform: 'PC',
        category: 'webgames',
        image: '../images/spaceinvaders.svg',
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
        image: '../images/floppybird.svg',
        url: '../routes/webgame.html?game=floppybird'
    },
    {
        id: 119,
        name: 'HexGL',
        platform: 'PC',
        category: 'webgames',
        image: '../images/hexgl.svg',
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
];

var currentCategory = 'all';
var searchQuery = '';

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
    html += '    <img class="game-image" src="' + game.image + '" alt="' + game.name + '" onerror="this.src=\'../images/noimage.jpeg\'">';
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

// Render the "Continue Playing" row (only on unfiltered All view)
function recentSectionHtml() {
    if (currentCategory !== 'all' || searchQuery) return '';
    var recent = getRecent();
    if (!recent.length) return '';
    var cards = '';
    var shown = 0;
    for (var i = 0; i < recent.length && shown < 8; i++) {
        var game = findGameById(recent[i].id);
        if (game) {
            cards += gameCardHtml(game);
            shown++;
        }
    }
    if (!shown) return '';
    return '<div class="recent-section">' +
        '<h3 class="recent-title"><i class="fas fa-clock-rotate-left"></i> Continue Playing</h3>' +
        '<div class="recent-row">' + cards + '</div>' +
        '</div>';
}

// Render games
function renderGames() {
    var filteredGames = games;
    
    // Filter by category
    if (currentCategory !== 'all') {
        filteredGames = filteredGames.filter(function(game) {
            return game.category === currentCategory;
        });
    }
    
    // Filter by search
    if (searchQuery) {
        filteredGames = filteredGames.filter(function(game) {
            return game.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
        });
    }
    
    var grid = $('#gameGrid');
    grid.innerHTML = '';
    
    var recentHtml = recentSectionHtml();
    if (recentHtml) {
        grid.innerHTML = recentHtml;
    }
    
    if (filteredGames.length === 0 && !recentHtml) {
        grid.innerHTML = '<div class="no-results"><i class="fas fa-gamepad"></i><p>No games found</p></div>';
        return;
    }
    if (filteredGames.length === 0) {
        return;
    }
    
    var html = '';
    filteredGames.forEach(function(game) {
        html += gameCardHtml(game);
    });
    
    grid.innerHTML += html;
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
    
    // Favorites & recent: event delegation on the grid (v8.5.0)
    $('#gameGrid').addEventListener('click', function(e) {
        var favBtn = e.target.closest ? e.target.closest('.game-fav-btn') : null;
        if (favBtn) {
            e.preventDefault();
            e.stopPropagation();
            toggleFav(favBtn.dataset.favId);
            renderGames();
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
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            $('#sidebar').classList.remove('show-mobile');
        }
    });
});
