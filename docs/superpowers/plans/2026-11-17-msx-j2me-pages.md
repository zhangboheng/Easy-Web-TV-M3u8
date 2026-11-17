# MSX + J2ME Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two new standalone emulator pages — MSX (WebMSX embed with homebrew presets + user ROM/DSK/CAS loading) and J2ME (J2meJS embed with jar upload) — registered in the game launcher categories.

**Architecture:** Both pages follow the established pattern (wasm4/pico8/v86): `routes/<page>.html` skeleton reusing `emulatorjs.css` classes + `js/to<page>.js` with i18n (8 languages), tabbed input UI, iframe player, loading overlay (800ms + 15s slow hint), back/reset. MSX embeds WebMSX via URL params (`ROM=`/`DISK=`/`TAPE=` hotlinks with CORS; presets = verified open-source homebrew ROMs from GitHub releases). J2ME embeds the official J2meJS GitHub Pages app (`java/main.html?jars=<URL>`), upload tab reads user .jar via FileReader as objectURL. No engines are vendored (WebMSX = hotlink per author's stated embedding use case; J2meJS = GPL-2.0 remote app hotlink, no redistribution).

**Tech Stack:** Vanilla JS (ES5 style matching existing to*.js files), HTML, CSS classes from `css/emulatorjs.css`, Font Awesome 6.4.0 icons.

**Verified assets (Task 1 already done during research):**
- WebMSX: `https://webmsx.org` — no X-Frame-Options, URL params: `ROM`(short), `DISK`, `TAPE`, `MACHINE`, `PRESETS`
- Preset ROMs (GitHub release assets, CORS ok, all 302→200 verified):
  - nohzdyve.rom (8KB, GPL-3.0, plainspooky/nohzdyve v1.0) — MSX1
  - go-penguin.rom (288KB, albs-br/penguin-platformer v0.75.2, public release, no SPDX) — MSX1
  - ZeroNoHoukouR-v0.4.8.rom (1MB, MIT, suzuki-black/ZeroNoHoukouR) — MSX turboR (needs `MACHINE=turboR`)
- J2meJS: `https://rosabis.github.io/J2meJS/java/main.html?jars=<encoded-jar-url>&midletClassName=<cls>` — jar URLs must be CORS-enabled. Demo's hosted jars are commercial games → NOT hotlinked; upload/URL only.

---

### Task 2: MSX page skeleton + SVG

**Files:**
- Create: `images/msx.svg`
- Create: `routes/msx.html`

**Steps:**
- [ ] Create `images/msx.svg` in wasm4/pico8 style (200x120, dark console with MSX rainbow accent bars + "MSX" pixel text + cartridge slot)
- [ ] Create `routes/msx.html` copied from pico8.html structure: header (fa-arrow-left backBtn, fa-desktop pageTitle "MSX"), 3 tabs: tabPreset(Featured Homebrew) / tabUrl(Load Media URL) / tabFile(Local File), presetBox/urlBox/uploadBox sections, instructionsPanel (controls: arrows, Z/X = SPACE/ESC; about: MSX1/2/2+/tR standard, WebMSX by ppeccin embed), playerSection with #msxFrame iframe + loadingOverlay, toast
- [ ] Verify: section tags balanced, all IDs present

### Task 3: MSX page logic (js/tomsx.js)

**Files:**
- Create: `js/tomsx.js`

**Steps:**
- [ ] PRESETS array: 3 verified homebrew (name, desc, mediaUrl, type: rom|disk|tape, machine)
- [ ] i18n 8 languages (zh/en/ja/ko/fr/de/es/ru) — same key set as topico8.js, MSX-specific strings
- [ ] playUrl(url, title, type, machine): build `https://webmsx.org?ROM=...` / `DISK=` / `TAPE=` + `&MACHINE=` when set; playerSection.classList.add('active'); overlay 800ms/15s
- [ ] URL tab: detect extension (.rom→ROM, .dsk/.zip→DISK, .cas→TAPE, else AUTO=AUTODETECT)
- [ ] File tab: FileReader → URL.createObjectURL → same flow (WebMSX fetches blob URLs)
- [ ] backBtn: playing → stopPlayback else → `../routes/game.html?category=computer`; resetBtn; instructions toggle
- [ ] `node --check` pass

### Task 4: J2ME page skeleton + logic

**Files:**
- Create: `images/j2me.svg`
- Create: `routes/j2me.html`
- Create: `js/toj2me.js`

**Steps:**
- [ ] `images/j2me.svg`: 200x120 candybar phone outline (screen + keypad grid + "J2ME" label)
- [ ] `routes/j2me.html`: tabs = tabDemo(Official Demo) / tabUrl(Jar URL) / tabFile(Local Jar); demoBox with button → `window.open('https://rosabis.github.io/J2meJS/java/')`; playerSection iframe #j2meFrame in narrow wrapper (max-width 480px, phone aspect); instructions note user-owned jars
- [ ] `js/toj2me.js`: i18n 8 langs; URL tab → `j2meFrame.src='https://rosabis.github.io/J2meJS/java/main.html?jars='+encodeURIComponent(url)`; file tab → objectURL same; overlay pattern; back/reset
- [ ] `node --check` pass

### Task 5: Register cards (js/togame.js)

**Files:**
- Modify: `js/togame.js` (after id:45 PICO-8 entry)

**Steps:**
- [ ] Add `{id:46, name:'MSX Homebrew', platform:'MSX', category:'computer', image:'../images/msx.svg', url:'../routes/msx.html'}`
- [ ] Add `{id:47, name:'J2ME Mobile Games', platform:'J2ME', category:'mobile', image:'../images/j2me.svg', url:'../routes/j2me.html'}` (user feedback: J2ME is a phone platform, not a computer - dedicated `mobile` category)
- [ ] Check game.html category nav: if hardcoded list, add 'computer' entry + i18n label
- [ ] `node --check` pass

### Task 6: README + sw.js PRECACHE

**Files:**
- Modify: `README.md` (platform table rows, js module list, routes list)
- Modify: `sw.js` (PRECACHE + 6 files: routes/msx.html, routes/j2me.html, js/tomsx.js, js/toj2me.js, images/msx.svg, images/j2me.svg)

**Steps:**
- [ ] Verify each new file exists before adding to PRECACHE (sw addAll 404 rule!)
- [ ] README rows under new Computer grouping next to Retro PC

### Task 7: Browser E2E verify

**Steps:**
- [ ] game.html?category=computer → 2 cards visible (geometry check, not just DOM)
- [ ] MSX: click card → page renders, preset click → WebMSX loads in iframe (screenshot pixel check), Reset/Back cycle
- [ ] J2ME: page renders, demo tab opens external, iframe src pattern correct
- [ ] Console error-free

### Task 8: Commit + push (authorized)

**Steps:**
- [ ] `git add` the 7 files + plan doc
- [ ] Commit: `feat: MSX + J2ME web emulator pages (computer category)`
- [ ] Push origin main
