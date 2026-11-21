![Easy-Web-TV](images/banner.jpg)

# Easy-Web-TV-M3u8

[![Issues](https://img.shields.io/github/issues/zhangboheng/Easy-Web-TV-M3u8)](https://github.com/zhangboheng/Easy-Web-TV-M3u8/issues)
[![Forks](https://img.shields.io/github/forks/zhangboheng/Easy-Web-TV-M3u8)](https://github.com/zhangboheng/Easy-Web-TV-M3u8/network/members)
[![Stars](https://img.shields.io/github/stars/zhangboheng/Easy-Web-TV-M3u8)](https://github.com/zhangboheng/Easy-Web-TV-M3u8/stargazers)
[![License](https://img.shields.io/github/license/zhangboheng/Easy-Web-TV-M3u8)](https://github.com/zhangboheng/Easy-Web-TV-M3u8/blob/main/LICENSE)
[![Version](https://img.shields.io/badge/version-8.5.6-green)](https://github.com/zhangboheng/Easy-Web-TV-M3u8)

An all-in-one web entertainment platform to watch TV, movies, series, anime, shows, listen to music and radio, read novels and manga, and play games - all in one place.

## 📋 Table of Contents

- [Demo](#-demo)
- [What's New](#-whats-new-v856)
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

## 🆕 What's New (v8.5.6)

- **Curated YouTube movies in Theatre**: a new YouTube source plays 7 Blender Foundation / Blender Studio open movies (Big Buck Bunny, Sintel, Tears of Steel, Elephants Dream, Cosmos Laundromat, Agent 327 and Spring) through YouTube's official privacy-enhanced iframe - player controls, branding and channel links stay intact
- **Compliant by design**: a small hand-picked white list needs no API key, never fetches, proxies or stores a direct video URL, and avoids ads-blocking or UI tampering; category filters and local search work over the curated list
- **Translated everywhere**: the source picker description and labels are localized in all 8 UI languages (zh, en, ja, ko, fr, de, es, ru)
- **Mist Gate game**: the AI-generated 3D game 《雾锁山门》 is hot-linked in Web Games
- **Layout fix**: Theatre cards no longer stretch into tall strips when only a few results are shown

## ✨ Features

### 📺 TV & IPTV
- Watch 6000+ TV channels from around the world
- Filter by country, language, and category
- Support for M3U8 video links
- Favorite channels for quick access

### 🎬 Movies & Series
- Search and watch movies, series, animes, and shows
- Multiple source options
- **Source selection dialog** with language badges (EN/CN), an archive.org classic-movies source (public-domain films), and a curated Blender open-movies source (CC-BY, embedded via YouTube's official player); reopen it anytime from the source dropdown
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
- Built-in mini games and a real-time virtual pet
- **Emulator support** for retro consoles, handhelds, arcade, DOS, Flash, and classic computers via EmulatorJS and hot-linked engines
- **Hot-linked browser games** including open-source classics, AI-generated web games, recompiled native-class ports, and standalone emulator apps
- **20000+ preset games** across 40 platforms, with search and favorites on the game launcher
- Flexible ROM loading from preset lists, local uploads, or URLs, with BIOS upload where required
- Fast fetching, caching, and manual download fallback for unreliable sources
- Gamepad navigation, save/load states, fullscreen, recently played, and TV-friendly controls

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

All 43 EmulatorJS-based emulators + 10 standalone/hot-linked engines and their cores. **Preset ROMs** = bundled games (`–` = none bundled; load your own via upload or URL). Preset total: **20694** games across 34 JSON files. Sega CD and PC-FX have no bundled games and require a BIOS file (uploaded on the emulator page) dumped from your own console. ³ v86 bootsector games (BootRogue/BootBASIC/bootOS, BSD-2) boot instantly via GitHub; OS images come from the official v86 demo CDN (copy.sh) and are downloaded, then booted via the Disk Image tab; WASM-4 has no bundled carts.

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
| Thomson | Thomson MO/TO | crocods | – | thomson.json |
| Sinclair | ZX Spectrum | fuse | 67 | zx.json |
| Sinclair | ZX81 / ZX80 | 81 | 12 ⁵ | zx81.json |
| NEC | PC Engine / TurboGrafx-16 | mednafen_pce | 280 | pce.json |
| Philips | CD-i | same_cdi | – | cdi.json |
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
| Computer | Radio-86RK (rk86-js embed) | rk86-js (hot-linked embed) | – | – |
| Computer | Atari ST (EstyJS embed) | EstyJS (hot-linked embed) | – | – |
| Mobile | J2ME (J2meJS embed) | j2mejs (hot-linked embed) | – | – |
| Mobile | Android-x86 (v86, BYO Android-x86 image) | v86 (vendored engine) | – ⁵ | – |
| Mobile | Palm OS (CloudpilotEmu embed) | cloudpilot-emu (hot-linked embed) | – | – |
| Mobile | WIPI (WIE embed) | wie (hot-linked embed) | – | – |
| Web Games | Felt World (hot-linked embed, MIT) | three.js (hot-linked CDN) | – | – |
| Web Games | NOVA LANCER (hot-linked embed, MIT) | three.js (hot-linked single-file build) | – | – |
| Web Games | Casa de Gemas (hot-linked embed, MIT) | Canvas / Web Audio (hot-linked build) | – | – |
| Web Games | Papertrails (hot-linked embed, MIT) | Canvas (hot-linked build) | – | – |
| Web Games | 雾锁山门 (hot-linked embed, AGPL-3.0) | three.js (AI-generated single-HTML) | – | – |
| **Total** | **59 platforms** | – | **20694** | **34 files** |

¹ Master System and Game Gear share `sms.json` (1283 games combined).
² No bundled games: load your own disc image via upload/URL, plus a BIOS file dumped from your own console (Sega CD: `bios_CD_U/J/E.bin`; PC-FX: `pcfx.rom`) using the BIOS upload box on the emulator page.
³ No bundled games: v86 bootsector demos boot from their authors' GitHub releases (BootRogue/BootBASIC/bootOS, BSD-2), OS images come from the official v86 demo CDN (copy.sh) and are downloaded to the Disk Image tab, and WASM-4 carts are loaded from the official cart library or your own file.
⁴ MSX presets are free/open homebrew ROMs hot-linked from their authors' official GitHub releases (nohzdyve GPL-3.0, Go Penguin!, Zeros Houkou R MIT); J2ME has no presets - open the official demo or load your own jars. Neither engine is bundled: WebMSX and J2meJS are embedded by hotlink per their authors' intended web-embedding use.
⁵ Android-x86 boots a user-provided image with the vendored v86 engine (BSD-2-Clause). No Android system image, GApps, or proprietary apps are bundled: bring a lawful Android-x86 ISO/IMG, preferably a compact x86 6/7 build, and allow time for the browser VM to boot.

⁵ ZX81 presets are 12 freeware homebrew programs by Kurt-Arne Johnsen, hot-linked from the author's repository whose license says "Totally free" and requests author credit; Thomson and CD-i ship empty preset JSON files and are intentionally user-supplied-media only.

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

The app is a static site. `index.html`, `manifest.json`, and `sw.js` are the main entry files; `routes/`, `js/`, and `css/` contain pages, modules, and styles.

Supporting directories include `data/roms/` (preset catalogues), `vendor/` (local runtimes), `catalogues/` and `gamebox/` (extra players and built-in games), and `images/` (assets).

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
- [rk86-js](https://github.com/begoon/rk86-js) - Radio-86RK emulator (MIT, hot-linked embed)
- [EstyJS](https://github.com/kaiec/EstyJS) - Atari ST 520/1040 emulator (GPL-2.0-or-later, hot-linked embed)
- [2048](https://github.com/devrsi0n/React-2048-game) (React-2048-game), [pacman](https://github.com/masonicGIT/pacman), [t-rex-runner](https://github.com/wayou/t-rex-runner), [spaceinvaders](https://github.com/dwmkerr/spaceinvaders), [skifree.js](https://github.com/basicallydan/skifree.js), [floppybird](https://github.com/nebez/floppybird), [HexGL](https://github.com/BKcore/HexGL), [Astray](https://github.com/wwwtyro/Astray), [q1k3](https://github.com/phoboslab/q1k3), [underrun](https://github.com/phoboslab/underrun) - open-source web games (MIT / GPL-3.0 / BSD-3-Clause / Apache-2.0 / Unlicense, hot-linked embeds)
- [N64Recomp](https://github.com/N64Recomp/N64Recomp) and [n64hub](https://n64hub.com/) - Nintendo 64 static recompilations (all 41 games currently listed by n64hub; both n64hub's own recomps and third-party web ports, each credited to its upstream author/repository; browser builds via RT64/Emscripten/WASM/WebGPU, hot-linked embeds; bring your own lawfully obtained ROM; independent projects not endorsed by Nintendo)
- [isle.pizza](https://isle.pizza/) ([isledecomp](https://github.com/isledecomp/isle)) - LEGO Island rebuilt from decompiled source, runs in the browser with no game files needed (hot-linked embed)
- [guizang-game-skill](https://github.com/op7418/guizang-game-skill) - AI-generated 3D action game demo 《雾锁山门》 (AGPL-3.0, demo content © 2026 歸藏, hot-linked embed)
- [Font Awesome](https://fontawesome.com/) - Icons
- [Tamaweb](https://github.com/autosam/Tamaweb) - Virtual pet game (official static build hot-linked from autosam.github.io, CC BY-NC-SA 4.0)
- [js-dos](https://js-dos.com/), [Ruffle](https://ruffle.rs/), [WASM-4](https://wasm4.org/), [v86](https://github.com/copy/v86) - Vendored game runtimes
- [iptv-org/iptv](https://github.com/iptv-org/iptv), archive.org collections - Preset ROM/SWF sources
- [Blender Foundation Open Movies](https://www.blender.org/about/projects/) - Big Buck Bunny, Sintel, Tears of Steel, Elephants Dream, Cosmos Laundromat, Agent 327 and Spring (CC-BY), played via YouTube's official embedded player from the official Blender / Blender Studio channels; no video is downloaded, proxied or stored by this app

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

**Third-party components** keep their own licenses: the Tamaweb virtual pet is loaded from the author's official static build (CC BY-NC-SA 4.0, non-commercial - do not monetize this component separately; name/branding/assets have separate terms), and the vendored runtimes carry their own licenses (js-dos GPL-2.0, WASM-4 MIT, v86 BSD-2/LGPL, Ruffle Apache-2.0/MIT dual).

---

Made with ❤️ by [Zhang Boheng](https://github.com/zhangboheng)
