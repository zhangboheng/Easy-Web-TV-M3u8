![Easy-Web-TV](images/banner.jpg)

# Easy-Web-TV-M3u8

[![Issues](https://img.shields.io/github/issues/zhangboheng/Easy-Web-TV-M3u8)](https://github.com/zhangboheng/Easy-Web-TV-M3u8/issues)
[![Forks](https://img.shields.io/github/forks/zhangboheng/Easy-Web-TV-M3u8)](https://github.com/zhangboheng/Easy-Web-TV-M3u8/network/members)
[![Stars](https://img.shields.io/github/stars/zhangboheng/Easy-Web-TV-M3u8)](https://github.com/zhangboheng/Easy-Web-TV-M3u8/stargazers)
[![License](https://img.shields.io/github/license/zhangboheng/Easy-Web-TV-M3u8)](https://github.com/zhangboheng/Easy-Web-TV-M3u8/blob/main/LICENSE)
[![Version](https://img.shields.io/badge/version-8.5.3-green)](https://github.com/zhangboheng/Easy-Web-TV-M3u8)

An all-in-one web entertainment platform to watch TV, movies, series, anime, shows, listen to music and radio, read novels and manga, and play games - all in one place.

## 📋 Table of Contents

- [Demo](#-demo)
- [What's New](#-whats-new-v853)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [Sponsor](#-sponsor)
- [Thanks](#-thanks)
- [License](#-license)

## 🎬 Demo

**[Live Demo](https://zhangboheng.github.io/Easy-Web-TV-M3u8/)**

## 🆕 What's New (v8.5.3)

- **PS Vita emulator embedded in-app, with a persistent new-tab option**: the PS Vita emulator card now opens an in-app player page (`routes/vita.html`) that embeds [vitaslop](https://github.com/cretz/vitaslop) (MIT, hot-linked to the official web app) - bring your own legally dumped packages (.pkg + work.bin, a dumped folder, or a zip); the embedded credentialless iframe uses temporary storage, so use the new-tab link for long-term games and saves
- **PS2 emulator embedded in-app, with a persistent new-tab option**: the PS2 card now opens an in-app player page (`routes/ps2.html`) embedding [TabStationToo](https://tabstationtoo.github.io/TabStationToo/) (PCSX2 compiled to WebAssembly, GPL-3.0, hot-linked) - replacing the external-link card. Bring your own BIOS dump (.bin) and disc images (.iso); the embedded credentialless iframe uses temporary storage, so use the new-tab link for long-term BIOS, memory cards, saves and save states
- **Cross-origin isolation without breaking anything else**: a targeted service-worker enhancement injects `COOP: same-origin` + `COEP: require-corp` on top-level navigations to the two player routes only, so the embedded emulators get SharedArrayBuffer inside credentialless iframes (with the `cross-origin-isolated` permission delegation) while every other page keeps its exact previous hot-linking behavior; first-visit reload bootstrap included; storage in inline credentialless frames is temporary, with a new-tab escape hatch for persistent saves

- **10 new Web Games via a generic hot-link player**: the Web Games category grows from 5 to 15 titles. A single player page (`routes/webgame.html`) driven by a `?game=<key>` registry serves them all - each game hot-links its author's official demo build, nothing is bundled:
  - [2048](https://devrsi0n.github.io/React-2048-game/) via [devrsi0n/React-2048-game](https://github.com/devrsi0n/React-2048-game) (MIT)
  - [Pac-Man](https://masonicgit.github.io/pacman/) via [masonicGIT/pacman](https://github.com/masonicGIT/pacman) (GPL-3.0)
  - [T-Rex Runner](https://wayou.github.io/t-rex-runner/) via [wayou/t-rex-runner](https://github.com/wayou/t-rex-runner) (BSD-3-Clause)
  - [Space Invaders](https://dwmkerr.github.io/spaceinvaders/) via [dwmkerr/spaceinvaders](https://github.com/dwmkerr/spaceinvaders) (MIT)
  - [SkiFree](https://basicallydan.github.io/skifree.js/) via [basicallydan/skifree.js](https://github.com/basicallydan/skifree.js) (MIT)
  - [Flappy Bird](https://nebez.github.io/floppybird/) via [nebez/floppybird](https://github.com/nebez/floppybird) (Apache-2.0)
  - [HexGL](https://hexgl.bkcore.com/play/) via [BKcore/HexGL](https://github.com/BKcore/HexGL) (MIT)
  - [Astray](https://wwwtyro.github.io/Astray/) via [wwwtyro/Astray](https://github.com/wwwtyro/Astray) (Unlicense)
  - [Q1K3](https://phoboslab.org/q1k3/) via [phoboslab/q1k3](https://github.com/phoboslab/q1k3) (MIT)
  - [Underrun](https://phoboslab.org/underrun/) via [phoboslab/underrun](https://github.com/phoboslab/underrun) (MIT)

- **Two more Recomp-class games**: the Recomp category grows from one title to three, both hot-linked WebAssembly ports that need no native install
  - **[Diablo](https://d07riv.github.io/diabloweb/)** via [diabloweb](https://github.com/d07RiV/diabloweb) (WebAssembly build of the source-released [Devilution](https://github.com/diasurgical/devilution) engine) - the **shareware episode is included upstream and plays instantly**; the full game needs your own `DIABDAT.MPQ`
  - **[Zelda II: The Adventure of Link](https://z2rs.com/)** via [z2rs](https://github.com/troyedwardsjr/z2rs) (MIT-licensed clean-room Rust reconstruction compiled to WebAssembly, verified frame by frame against the original ROM) - adds widescreen, save states and optional online co-op; bring your own ROM (No-Intro USA dump, CRC32 `BA322865`), read in place and never uploaded

## ✨ Features

### 📺 TV & IPTV
- Watch 6000+ TV channels from around the world
- Filter by country, language, and category
- Support for M3U8 video links
- Favorite channels for quick access

### 🎬 Movies & Series
- Search and watch movies, series, animes, and shows
- Multiple source options
- **Source selection dialog** with language badges (EN/CN) and an archive.org classic-movies source (public-domain films); reopen it anytime from the source dropdown
- Favorites and watch history
- 🎮 **Player controls**: playback speed (0.5x–2x), ±10s skip buttons around the progress bar, keyboard shortcuts (Space = play/pause, ←/→ = seek ±10s), plus Video.js built-ins (F fullscreen, M mute); mobile-friendly control bar

### 🎵 Music & Radio
- Search and listen to music
- Browse and play podcasts with cover art and titles
- Podcast episode list with search and playback controls
- Access 28000+ radio stations worldwide
- Radio station search by name, country, language
- Favorites system for music and podcast episodes

### 📖 Reading
- Search and read novels/books
- Search and read manga
- Reading progress tracking
- Chapter navigation

### 🎮 Games
- Built-in mini games (Square Obstacles, Pong, Breakout, Tic Tac Toe)
- **Tamaweb virtual pet** - raise a pixel pet in real time (feeding, cleaning, adventures, growth); vendored from [Tamaweb](https://github.com/autosam/Tamaweb) by autosam under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)
- **Emulator support** - Play retro console games, powered by [EmulatorJS](https://emulatorjs.org/)
  - **Nintendo**: NES, SNES, N64, GB/GBC, GBA, NDS, Virtual Boy
  - **PlayStation**: PS1/PSX, PSP (bring your own disc image; desktop recommended)
  - **Sega**: Genesis/Mega Drive, Master System, Game Gear, Sega CD, Sega 32X, Saturn
  - **Atari**: 2600, 5200, 7800, Jaguar, Lynx
  - **Commodore**: C64, C128, VIC-20, PET, Plus/4, Amiga
  - **SNK**: Neo Geo Pocket / Color
  - **Bandai**: WonderSwan / Color
  - **Amstrad**: CPC (464/6128)
  - **Sinclair**: ZX Spectrum
  - **Doom engine**: DOOM Shareware, Freedoom/Freedm, HacX (prboom)
  - **Sony PlayStation 2**: [TabStationToo](https://tabstationtoo.github.io/TabStationToo/) (PCSX2 compiled to WebAssembly, GPL-3.0, hot-linked embed with cross-origin isolation delegation; the inline credentialless player uses temporary storage, with a new-tab link for persistent BIOS, games, memory cards and saves - nothing is bundled or uploaded; needs WebAssembly threads + SharedArrayBuffer + WebGPU, i.e. recent desktop Chrome/Edge)
  - **Sony PlayStation Vita**: [vitaslop](https://github.com/cretz/vitaslop) (MIT, hot-linked embed of the official web app with a runtime ARM-to-WebAssembly translator and WebGPU rendering; the inline credentialless player uses temporary storage, with a new-tab link for persistent games and saves - nothing is bundled or uploaded; needs WebGPU + JSPI + SharedArrayBuffer + OPFS, i.e. recent desktop Chrome/Edge; early days - many commercial games boot and play, many do not)
  - **NEC**: PC Engine / TurboGrafx-16, PC-FX (bring your own disc image + BIOS)
  - **Coleco**: ColecoVision
  - **3DO**: 3DO (bring your own firmware: panafz1/panafz10/goldstar/sanyotry .bin)
  - **Flash**: Flash Player powered by [Ruffle](https://ruffle.rs/) (100 preset games, or load your own .swf via upload/URL/archive.org search; keyboard & mouse recommended)
  - **DOS**: MS-DOS games powered by [js-dos](https://js-dos.com/) (100 preset classics, or load your own .zip/.jsdos via upload/URL/archive.org search; built-in DOS environment, no BIOS needed)
  - **Retro PC**: full x86 PC emulation powered by [v86](https://github.com/copy/v86) (boot your own floppy/hard disk/CD image or Linux kernel; instant-play open-source bootsector games fetched live from GitHub, plus downloadable OS images from the official demo CDN), plus [jsbeeb](https://bbc.godbolt.org/) (BBC Micro) and [apple2js](https://www.scullinsteel.com/apple2/) (Apple II) embedded from their official deployments
  - **Web Games**: classic open-source web games - the 5 built-in titles (Square Obstacles, Pong, Breakout, Tic Tac Toe, Tamaweb) plus 10 hot-linked classics (2048, Pac-Man, T-Rex Runner, Space Invaders, SkiFree, Flappy Bird, HexGL, Astray, Q1K3, Underrun) served through one generic `?game=` hot-link player page
  - **Recomp**: native-class ports recompiled or rebuilt for the browser, all hot-linked official web apps:
    - [Red Alert 2 / Yuri's Revenge](https://ra2.games) via [RA2 VM](https://github.com/ra2-games/ra2) (v86 + Win32/DirectX compatibility layer, GPL-3.0, Alpha; bring your own RA2/YR files)
    - [Diablo](https://d07riv.github.io/diabloweb/) via [diabloweb](https://github.com/d07RiV/diabloweb) (WebAssembly port of the source-released Devilution engine; the shareware episode is included, the full game needs your own `DIABDAT.MPQ`)
    - [Zelda II: The Adventure of Link](https://z2rs.com/) via [z2rs](https://github.com/troyedwardsjr/z2rs) (MIT, clean-room Rust reconstruction compiled to WebAssembly; bring your own ROM)
  - **Fantasy Console**: [WASM-4](https://wasm4.org/) (load any .wasm cart via upload or URL; self-contained vendored runtime)
  - **Arcade**: FBNeo (incl. Neo Geo / CPS1 / CPS3), MAME 2003
  - **Mobile platforms**: Palm OS via [CloudpilotEmu](https://github.com/cloudpilot-emu/cloudpilot-emu) (GPL-3.0) and Korean WIPI/SKVM/J2ME via [WIE](https://github.com/dlunch/wie) (MIT) - both hot-linked official web apps, bring your own ROM/files
- **20000+ preset games** across 40 platforms, with search on the game launcher
  - Nintendo: NES (805), SNES (772), GB/GBC (800), GBA (992), N64 (116), Virtual Boy (28)
  - Sega: Genesis/Mega Drive (1841), Master System + Game Gear (1283)
  - Coleco: ColecoVision (94)
  - SNK: Neo Geo Pocket/Color (82)
  - Bandai: WonderSwan/Color (208)
  - Atari: 2600 (4145), 5200 (72), 7800 (27), Jaguar (49), Lynx (77)
  - Commodore: Commodore 64 (49)
  - Amstrad: CPC (6719)
  - Sinclair: ZX Spectrum (67)
  - Flash: 100 classic games (.swf, Ruffle)
  - DOS: 100 classics like Oregon Trail, Prince of Persia, Wolfenstein 3D, Pac-Man and SimCity (.zip, js-dos)
  - Doom engine: DOOM Shareware (4), Freedoom, Freedm, HacX
  - Arcade (FBNeo): 149 games incl. the full Neo Geo MVS lineup (Metal Slug 1–5/X, King of Fighters '94–2003, Samurai Shodown I–V, The Last Blade 1/2, Garou, Real Bout Fatal Fury series, World Heroes series, Puzzle Bobble...), CPS1 classics (Cadillacs and Dinosaurs, Knights of the Round, King of Dragons, Magic Sword, Warriors of Fate, Ghouls 'n Ghosts), CPS3 (Marvel vs. Capcom 2) and 14 MAME-era classics (from the marlon-santana/roms-retro-arcade, roms-retro-neogeo, roms-retro-cps1 and roms-retro-cps3 sets on GitHub)
- **Three ways to load a ROM**: pick from the preset list, upload a file (core auto-detected by extension), or paste a ROM URL
- **BIOS upload support**: platforms needing a BIOS/firmware (Sega CD, 3DO, PC-FX) show a dedicated upload box on the emulator page; PSP needs none
- **Fast ROM fetching**: direct download for CORS-enabled sources (e.g. GitHub-hosted ROMs), public CORS proxies only as fallback
- **ROM caching**: downloaded ROMs and SWFs are stored in Cache Storage, so replaying the same game is instant and works even when proxies are down
- **Manual download fallback**: if a preset or URL fails to load, an inline button lets you download the ROM file directly, then load it via upload
- **Favorites & Continue Playing**: star any game to pin it to the top of the launcher, and the last 12 played games appear in a Continue Playing row
- **Gamepad navigation on the game hub**: browse categories and game cards with a gamepad D-pad/stick or keyboard arrow keys (TV friendly)
- Gamepad support
- Save/load states and fullscreen via the in-emulator controls
- Reset button to return to the ROM selection screen
- 🎮 **How to play with a gamepad on TV:**
  1. Access the app through the browser on your TV
  2. Select an emulator to enter
  3. Plug in the gamepad before the game starts

### 🔧 Other Features
- 🌐 Multi-language support
- ⭐ Favorites system for all content types
- 🔍 Powerful search functionality
- 📱 Responsive design for mobile devices
- 🎨 Modern dark theme UI
- 🔒 Sensitive content filter (adult content)
- 💾 **Backup & Restore**: export all app data (favorites, history, settings) as a JSON file and import it on any device

## 📸 Screenshots

### Homepage

![Homepage](images/example.jpg)

### TV

![TV](images/tvscreen.jpg)

### Movie

![Movie](images/moviescreen.jpg)

### Radio

![Radio](images/radioscreen.jpg)

### Novel

![Novel](images/novelscreen.jpg)

### Manga

![Manga](images/mangascreen.jpg)

### Music & Podcast

![Music & Podcast](images/musicscreen.jpg)

### Game

![Game](images/gamescreen.jpg)

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+, no framework - jQuery was fully removed in v8.4.2)
- **Video Player**: Video.js
- **Emulator**: EmulatorJS (RetroArch-based), plus vendored engines: js-dos, Ruffle, WASM-4, v86
- **Persistence**: localStorage (favorites, settings, backups) + IndexedDB (Tamaweb saves)
- **APIs**:
  - [iptv-org](https://github.com/iptv-org/iptv) - TV channels
  - [Radiobrowser](https://github.com/segler-alex/radiobrowser-api-rust) - Radio stations

## 🎮 Emulator Features

### Dynamic ROM Loading
- **JSON-based ROM catalogue**: ROM lists are stored in separate JSON files for easy maintenance
- **Platform-specific loading**: Each platform has its own JSON file under `data/roms/` (31 catalogue files)
- **Caching system**: Loaded ROM lists are cached for faster switching
- **Search filter**: Filter ROMs by name in real-time

### Supported Platforms

All 40 EmulatorJS-based emulators + 10 standalone/hot-linked engines and their cores. **Preset ROMs** = bundled games (`–` = none bundled; load your own via upload or URL). Preset total: **20682** games across 31 JSON files. Sega CD and PC-FX have no bundled games and require a BIOS file (uploaded on the emulator page) dumped from your own console. ³ v86 bootsector games (BootRogue/BootBASIC/bootOS, BSD-2) boot instantly via GitHub; OS images come from the official v86 demo CDN (copy.sh) and are downloaded, then booted via the Disk Image tab; WASM-4 has no bundled carts.

| Family | Platform | Core | Preset ROMs | JSON File |
|--------|----------|------|-------------|-----------|
| Nintendo | NES | fceumm | 805 | nes.json |
| Nintendo | SNES | snes9x | 772 | snes.json |
| Nintendo | GB / GBC | gambatte | 800 | gb.json |
| Nintendo | GBA | mgba | 992 | gba.json |
| Nintendo | Nintendo 64 | mupen64plus_next | 116 | n64.json |
| Nintendo | Nintendo DS | melonds | – | – |
| Nintendo | Virtual Boy | beetle_vb | 28 | vb.json |
| PlayStation | PS1 / PSX | pcsx_rearmed | – | – |
| PlayStation | PSP | ppsspp | – | – |
| Sega | Genesis / Mega Drive | genesis_plus_gx | 1841 | genesis.json |
| Sega | Master System | smsplus | 1283 | sms.json |
| Sega | Game Gear | smsplus | – ¹ | sms.json |
| Sega | Sega CD | picodrive | – ² | – |
| Sega | Sega 32X | picodrive | 33 | sega32x.json |
| Sega | Saturn | yabause | – | – |
| Atari | Atari 2600 | stella2014 | 4145 | atari2600.json |
| Atari | Atari 5200 | a5200 | 72 | atari5200.json |
| Atari | Atari 7800 | prosystem | 27 | atari7800.json |
| Atari | Atari Jaguar | virtualjaguar | 49 | atarijaguar.json |
| Atari | Atari Lynx | handy | 77 | atarilynx.json |
| Commodore | Commodore 64 | vice_x64 | 51 | c64.json |
| Commodore | Commodore 128 | vice_x128 | 5 | c128.json |
| Commodore | VIC-20 | vice_xvic | 156 | vic20.json |
| Commodore | PET | vice_xpet | 14 | pet.json |
| Commodore | Plus/4 | vice_xplus4 | 5 | plus4.json |
| Commodore | Amiga | puae | 1455 | amiga.json |
| Amstrad | Amstrad CPC | cap32 | 6719 | cpc.json |
| Sinclair | ZX Spectrum | fuse | 67 | zx.json |
| NEC | PC Engine / TurboGrafx-16 | mednafen_pce | 280 | pce.json |
| NEC | PC-FX | mednafen_pcfx | – ² | – |
| SNK | Neo Geo Pocket / Color | mednafen_ngp | 82 | ngp.json |
| Bandai | WonderSwan / Color | mednafen_wswan | 208 | wonderswan.json |
| Coleco | ColecoVision | gearcoleco | 94 | coleco.json |
| 3DO | 3DO | opera | – | – |
| Arcade | Arcade (FBNeo, incl. Neo Geo / CPS1 / CPS3) | fbneo | 149 | arcade.json |
| Arcade | Arcade (MAME 2003+) | mame2003_plus | 153 | mame.json |
| Other | Flash (Ruffle) | ruffle | 100 | flash.json |
| Other | DOS (js-dos) | js-dos | 100 | dos.json |
| Other | Doom Engine (prboom) | prboom | 4 | doom.json |
| Retro PC | x86 PC (v86) | v86 | – ³ | – |
| Retro PC | BBC Micro (jsbeeb) | jsbeeb (embedded) | – | – |
| Retro PC | Apple II (apple2js) | apple2js (embedded) | – | – |
| Retro PC | Red Alert 2 / Yuri's Revenge (RA2 VM) | ra2vm (hot-linked embed, Alpha) | – | – |
| Fantasy | WASM-4 | wasm4 (vendored runtime) | – ³ | – |
| Fantasy | PICO-8 (hot-linked web builds) | pico8 (no runtime bundled) | 5 | – |
| Computer | MSX (WebMSX embed) | webmsx (hot-linked embed) | 3 ⁴ | – |
| Mobile | J2ME (J2meJS embed) | j2mejs (hot-linked embed) | – | – |
| Mobile | Palm OS (CloudpilotEmu embed) | cloudpilot-emu (hot-linked embed) | – | – |
| Mobile | WIPI (WIE embed) | wie (hot-linked embed) | – | – |
| **Total** | **50 platforms** | – | **20682** | **31 files** |

¹ Master System and Game Gear share `sms.json` (1283 games combined).
² No bundled games: load your own disc image via upload/URL, plus a BIOS file dumped from your own console (Sega CD: `bios_CD_U/J/E.bin`; PC-FX: `pcfx.rom`) using the BIOS upload box on the emulator page.
⁴ MSX presets are free/open homebrew ROMs hot-linked from their authors' official GitHub releases (nohzdyve GPL-3.0, Go Penguin!, Zeros Houkou R MIT); J2ME has no presets - open the official demo or load your own jars. Neither engine is bundled: WebMSX and J2meJS are embedded by hotlink per their authors' intended web-embedding use.

### Core Features
- **Automatic core detection**: Upload any ROM file and the system automatically detects the platform
- **URL parameter support**: Direct link to specific platform (e.g., `?core=snes9x`)
- **No core selection UI**: Simplified interface with automatic detection
- **Error handling**: Comprehensive error handling with user-friendly messages
- **Smart CORS strategy**: Direct fetch first for CORS-enabled hosts (GitHub raw, archive.org APIs); resilient proxy failover with 30s timeout for free-tier proxies, detection of proxy error pages returned as HTTP 200, and detection of binary-corrupting proxies that transcode responses as text (U+FFFD mangling)

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/zhangboheng/Easy-Web-TV-M3u8.git
   ```

2. Navigate to the project directory:
   ```bash
   cd Easy-Web-TV-M3u8
   ```

3. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve
   ```

4. Open `http://localhost:8000` in your browser

> **Note**: Always use a local server (or the GitHub Pages demo) instead of opening `index.html` via `file://` - the emulator preset ROM lists and several APIs require HTTP for CORS.

## 📁 Project Structure

```
Easy-Web-TV-M3u8/
├── index.html              # Main entry point
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker (v8.5.0: index-shell precache + runtime caching)
├── css/
│   ├── main.css           # Main styles
│   ├── style.css          # Additional styles
│   └── emulatorjs.css     # Emulator-specific styles
├── js/
│   ├── index.js           # Main JavaScript (incl. Backup & Restore, changelog)
│   ├── apiproxy.js        # Shared CORS-proxy failover helpers
│   ├── core/
│   │   ├── dom.js             # DOM helper ($ / DOM utilities)
│   │   └── header-height.js  # Header height measurement (--header-height CSS var)
│   ├── locales/
│   │   └── translations.js  # 90+ language translations + i18n applier
│   ├── translator.js      # Language detection & switching
│   ├── emulatorjs.js      # Emulator logic & ROM loading
│   ├── togame.js          # Game launcher & emulator picker
│   ├── todos.js           # DOS games page (js-dos)
│   ├── tov86.js           # Retro PC page (v86, presets & URL loading)
│   ├── towasm4.js         # WASM-4 fantasy console page
│   ├── topico8.js         # PICO-8 web games page (featured itch.io builds)
│   ├── tomsx.js           # MSX page (WebMSX embed, homebrew presets)
│   ├── toj2me.js          # J2ME page (J2meJS embed, jar upload/URL)
│   ├── topalm.js          # Palm OS page (CloudpilotEmu embed, bring-your-own ROM)
│   ├── towipi.js          # WIPI page (WIE embed, bring-your-own files)
│   ├── tora2.js           # Red Alert 2 page (RA2 VM embed, bring-your-own game files)
│   ├── tojsbeeb.js        # BBC Micro page (official jsbeeb embed)
│   ├── toapple2js.js      # Apple II page (official apple2js embed)
│   ├── tv.js              # TV channels page (tabs & search)
│   ├── music.js           # Music player logic
│   ├── podcast.js         # Podcast player with favorites
│   ├── tomusic.js         # Music page navigation & podcast browsing
│   └── ...                # Other modules
├── data/
│   └── roms/              # ROM catalogue files
│       ├── nes.json          # 805 NES games
│       ├── snes.json         # 772 SNES games
│       ├── gb.json           # 800 GB/GBC games
│       ├── gba.json          # 992 GBA games
│       ├── n64.json          # 116 N64 games
│       ├── genesis.json      # 1841 Genesis games
│       ├── atari2600.json    # 4145 Atari 2600 games
│       ├── atari5200.json    # 72 Atari 5200 games
│       ├── sms.json          # 1283 Master System + Game Gear games
│       ├── atari7800.json    # 27 Atari 7800 games
│       ├── atarijaguar.json  # 49 Atari Jaguar games
│       ├── atarilynx.json    # 77 Atari Lynx games
│       ├── coleco.json       # 94 ColecoVision games
│       ├── vb.json           # 28 Virtual Boy games
│       ├── wonderswan.json   # 208 WonderSwan / WonderSwan Color games (No-Intro sets on archive.org)
│       ├── ngp.json          # 82 Neo Geo Pocket / Color games (No-Intro 1G1R sets on archive.org)
│       ├── cpc.json          # 6719 Amstrad CPC disk games (No-Intro set on archive.org)
│       ├── doom.json         # 4 Doom-engine IWADs: DOOM Shareware, Freedoom, Freedm, HacX
│       ├── c64.json          # 51 Commodore 64 games
│       ├── c128.json         # 5 Commodore 128 games
│       ├── vic20.json        # 156 VIC-20 games
│       ├── arcade.json       # 149 Arcade (FBNeo) games: Neo Geo MVS + CPS1 + CPS3 + classics (marlon-santana/roms-retro-* on GitHub)
│       ├── mame.json         # 153 Arcade (MAME 2003+) games, CRC-verified against the MAME 0.78 DAT
│       ├── pet.json          # 14 Commodore PET games (milasoft64 on GitHub + archive.org)
│       ├── plus4.json        # 5 Commodore Plus/4 games (No-Intro set on archive.org)
│       ├── sega32x.json      # 33 Sega 32X games (No-Intro-style set on archive.org)
│       ├── amiga.json        # 1455 Commodore Amiga games, single-disk ADF (TOSEC sets on archive.org)
│       ├── pce.json          # 280 PC Engine / TurboGrafx-16 HuCard games (GoodPCE set on archive.org)
│       ├── zx.json           # 67 ZX Spectrum games (snapshots .z80 / tapes .tzx / disks .dsk from single-game items on archive.org)
│       ├── flash.json        # 100 Flash games (.swf from the archive.org softwarelibrary_flash_games collection, served by Ruffle)
│       └── dos.json          # 100 MS-DOS games (.zip from the archive.org softwarelibrary_msdos_games collection, served by js-dos)
├── routes/
│   ├── tv.html            # TV page
│   ├── movie.html         # Movie page
│   ├── music.html         # Music page
│   ├── radio.html         # Radio page
│   ├── novel.html         # Novel page
│   ├── manga.html         # Manga page
│   ├── game.html          # Game page
│   ├── emulatorjs.html    # Emulator pages
│   ├── dos.html           # MS-DOS games (js-dos)
│   ├── v86.html           # Retro PC / x86 emulation (v86)
│   ├── wasm4.html         # WASM-4 fantasy console
│   ├── pico8.html         # PICO-8 web games (featured builds, no runtime)
│   ├── msx.html           # MSX (WebMSX embed, homebrew presets)
│   ├── j2me.html          # J2ME (J2meJS embed, jar loading)
│   ├── palm.html          # Palm OS (CloudpilotEmu embed, bring-your-own ROM)
│   ├── wipi.html          # WIPI (WIE embed, bring-your-own files)
│   ├── ra2.html           # Red Alert 2 (RA2 VM embed, bring-your-own game files)
│   ├── jsbeeb.html        # BBC Micro (embedded jsbeeb)
│   ├── apple2.html        # Apple II (embedded apple2js)
│   └── ...                # Other pages
├── vendor/
│   ├── v86/               # v86 runtime: libv86.js + v86.wasm + SeaBIOS (BSD-2 / LGPL)
│   ├── wasm4/             # WASM-4 slim runtime (MIT)
│   └── js-dos/            # js-dos runtime (GPL-2.0)
├── catalogues/
│   └── *play.html         # Player pages
├── gamebox/
│   ├── ball/ bong/ breakout/ tic-tac-toe/  # Built-in mini games
│   └── tamaweb/             # Tamaweb virtual pet (vendored, trackers stripped)
└── images/
    └── ...                # Image assets
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ☕ Sponsor

[![Buy Me A Coffee](images/buymecoffeesponsor.jpeg)](https://www.buymeacoffee.com/zhangboheng)

If you like this project, consider buying me a coffee! ☕

## 🙏 Thanks

This project uses the following open source projects:

- [jQuery](https://github.com/jquery/jquery) - JavaScript library (used before v8.4.2)
- [iptv-org](https://github.com/iptv-org/iptv) - IPTV channels database
- [Radiobrowser](https://github.com/segler-alex/radiobrowser-api-rust) - Radio stations API
- [Video.js](https://github.com/videojs/video.js) - Video player
- [EmulatorJS](https://github.com/EmulatorJS/EmulatorJS) - RetroArch-based emulator
- [CloudpilotEmu](https://github.com/cloudpilot-emu/cloudpilot-emu) - Palm OS emulator (GPL-3.0, hot-linked embed)
- [WIE](https://github.com/dlunch/wie) - WIPI/SKVM/J2ME emulator (MIT, hot-linked embed)
- [vitaslop](https://github.com/cretz/vitaslop) - PlayStation Vita emulator (MIT, hot-linked embed)
- [TabStationToo](https://github.com/TabStationToo/TabStationToo) - PlayStation 2 emulator built on PCSX2 compiled to WebAssembly (GPL-3.0, hot-linked embed)
- [RA2 VM](https://github.com/ra2-games/ra2) - Red Alert 2 in the browser via v86 (GPL-3.0, hot-linked embed)
- [diabloweb](https://github.com/d07RiV/diabloweb) - Diablo in the browser via WebAssembly (built on the source-released [Devilution](https://github.com/diasurgical/devilution) engine; hot-linked embed)
- [z2rs](https://github.com/troyedwardsjr/z2rs) - Zelda II clean-room reconstruction in Rust/WebAssembly (MIT, hot-linked embed)
- [2048](https://github.com/devrsi0n/React-2048-game) (React-2048-game), [pacman](https://github.com/masonicGIT/pacman), [t-rex-runner](https://github.com/wayou/t-rex-runner), [spaceinvaders](https://github.com/dwmkerr/spaceinvaders), [skifree.js](https://github.com/basicallydan/skifree.js), [floppybird](https://github.com/nebez/floppybird), [HexGL](https://github.com/BKcore/HexGL), [Astray](https://github.com/wwwtyro/Astray), [q1k3](https://github.com/phoboslab/q1k3), [underrun](https://github.com/phoboslab/underrun) - open-source web games (MIT / GPL-3.0 / BSD-3-Clause / Apache-2.0 / Unlicense, hot-linked embeds)
- [Font Awesome](https://fontawesome.com/) - Icons
- [Tamaweb](https://github.com/autosam/Tamaweb) - Virtual pet game (vendored under `gamebox/tamaweb/`, CC BY-NC-SA 4.0)
- [js-dos](https://js-dos.com/), [Ruffle](https://ruffle.rs/), [WASM-4](https://wasm4.org/), [v86](https://github.com/copy/v86) - Vendored game runtimes
- [iptv-org/iptv](https://github.com/iptv-org/iptv), archive.org collections - Preset ROM/SWF sources

## Star History

<a href="https://www.star-history.com/?repos=zhangboheng%2FEasy-Web-TV-M3u8&type=date&legend=top-left">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/chart?repos=zhangboheng/Easy-Web-TV-M3u8&type=date&theme=dark&legend=top-left" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/chart?repos=zhangboheng/Easy-Web-TV-M3u8&type=date&legend=top-left" />
   <img alt="Star History Chart" src="https://api.star-history.com/chart?repos=zhangboheng/Easy-Web-TV-M3u8&type=date&legend=top-left" />
 </picture>
</a>

## 📄 License

This project is licensed under the GNU Affero General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

Permissions of this weak copyleft license are conditioned on making available source code of licensed files and modifications of those files under the same license. Copyright and license notices must be preserved. Contributors provide an express grant of patent rights.

**Third-party components** keep their own licenses: the vendored Tamaweb virtual pet (`gamebox/tamaweb/`) is CC BY-NC-SA 4.0 (non-commercial - do not monetize this component separately), and the vendored runtimes carry their own licenses (js-dos GPL-2.0, WASM-4 MIT, v86 BSD-2/LGPL, Ruffle Apache-2.0/MIT dual).

---

Made with ❤️ by [Zhang Boheng](https://github.com/zhangboheng)
