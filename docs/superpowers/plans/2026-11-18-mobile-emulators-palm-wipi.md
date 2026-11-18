# Palm OS (CloudpilotEmu) + WIPI (WIE) Mobile Emulators Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add two new mobile-platform emulators — Palm OS (CloudpilotEmu, cloudpilot-emu/cloudpilot-emu, GPL-3.0) and WIPI/SKVM/J2ME (WIE, dlunch/wie, MIT) — to the game module's `mobile` category as hot-linked iframe embeds, following the established j2me.html pattern.

**Architecture:** Each new emulator gets one standalone route page (`routes/palm.html`, `routes/wipi.html`) that hot-links the official web app inside an iframe, plus one JS file (`js/topalm.js`, `js/towipi.js`) with 8-language i18n. Neither app supports URL-parameter loading of user files from a parent page (verified: WIE's `wie-web/src/ts/app.ts` and `index.ts` have no URLSearchParams/jar-param handling; CloudpilotEmu's embedded API exists but requires vendoring wasm + self-built UI, out of scope for the hot-link pattern), so both pages use the single "Open Emulator" demo-tab pattern from j2me.html (no URL/local-file tabs). Game hub cards are added to `js/togame.js` under `category: 'mobile'`; icons are new SVGs in `images/`.

**Tech Stack:** Vanilla JS (ES6+), HTML5, inline CSS per route page (matching routes/j2me.html), iframe hot-link embed.

**Spec:** This plan follows the V8.4.9 precedent (J2ME integration, changelog entry in `js/index.js:1229`): hot-link official demo + user-runs-own-files + 8-language i18n.

## Global Constraints

- User-facing copy (HTML default text) in English, i18n objects carry translations; code comments in English (project convention, see js/toj2me.js)
- No new dependencies, no build tools — this is a zero-build static site
- Emulator embeds are hot-links only — no vendoring, no bundling of ROMs/BIOS
- Do not hot-link commercial content; users run their own files (js/toj2me.js header comment)
- Every new i18n key must exist in all 8 languages: zh, en, ja, ko, fr, de, es, ru (see js/toj2me.js)
- Route page structure must match routes/j2me.html: header (backBtn + pageTitle + hidden resetBtn), main-container > upload-section (tabs + demoBox), playerSection (iframe + loadingOverlay), toast, script at end
- New games[] entries in js/togame.js need: id, name, platform, category:'mobile', image, url — image must be a relative path to a real file in images/

## Task 1: Palm OS emulator page (routes/palm.html + js/topalm.js + images/palm.svg)

### Files
- `images/palm.svg` (new) — Palm-PDA-styled SVG icon, same 200x120 viewBox style as images/j2me.svg
- `routes/palm.html` (new) — copy of routes/j2me.html structure, adapted per below
- `js/topalm.js` (new) — copy of js/toj2me.js structure, adapted per below

### Design decisions
- **Embed target:** `https://cloudpilot-emu.github.io/app/` (official web app; verified headers: `Access-Control-Allow-Origin: *`, no X-Frame-Options → iframe-embeddable)
- **Tab layout:** single Demo tab only (cloudpilot app has its own internal ROM-upload UI)
- **Back link:** `../routes/game.html?category=mobile` (same as toj2me.js:380)
- **iframe:** id `palmFrame`, title "Palm OS emulator", `allow="fullscreen; autoplay" allowfullscreen`, `.palm-wrapper` CSS, max-width 480px
- **Page title / i18n pageTitle:** 'Palm OS'
- **Header icon:** `fa-mobile-screen`

### Steps
- [ ] Create `images/palm.svg`: palm-device silhouette (vertical PDA body, small screen with green text lines, hardware buttons below, stylus), palette consistent with j2me.svg (dark body #161616/#0d0d0d, accent #33ff66)
- [ ] Create `routes/palm.html` by adapting j2me.html: ids renamed (`palmFrame`, `palmWrapper`), `<title>Palm OS Player - Easy Web TV</title>`, remove URL/file tabs and their boxes, keep instructions panel + toast, script src `../js/topalm.js`
- [ ] Create `js/topalm.js` (copy toj2me.js structure):
  - `var PALM_BASE = 'https://cloudpilot-emu.github.io/app/';`
  - i18n key set (all 8 languages): pageTitle, reset, tabDemo, demoTitle, demoDesc, demoOpen, demoHint, loading, loadingTip, loadingSlow, instructions, controlsTitle, controlsHint1, controlsHint2, aboutTitle, aboutHint, playing — demoTitle 'Palm OS Games', demoDesc explains Palm OS 1–4 (Dragonball) + Tungsten E2 (OS5) via CloudpilotEmu (GPL-3.0, hot-linked), demoHint: upload your own Palm ROM/database files inside the app
  - Player: `playPalm()` sets `frame.src = PALM_BASE`, showPlayer('Palm OS'), overlay hidden on iframe load event, slowTimer 15s → toast
  - backBtn/resetBtn logic identical to toj2me.js
- [ ] Verify in browser: iframe loads cloudpilot app; tabs/instructions/toast work; lang switch renders translations
- [ ] Commit: `Add Palm OS emulator page (CloudpilotEmu hot-link, mobile category)`

### Interfaces
- DOM ids consumed: `palmFrame`, `palmWrapper`, `backBtn`, `resetBtn`, `pageTitle`, `demoOpenBtn`, `instructionsHeader`, `instructionsContent`, `instructionsToggle`, `loadingOverlay`, `uploadSection`, `playerSection`, `toast`, `toastMessage`
- PALM_BASE page-local; nothing exported


## Task 2: WIPI emulator page (routes/wipi.html + js/towipi.js + images/wipi.svg)

### Files
- `images/wipi.svg` (new) — WIPI candybar phone icon (base on j2me.svg layout, WIPI lettering on screen, blue/teal accent, antenna nub)
- `routes/wipi.html` (new) — same structure as routes/palm.html
- `js/towipi.js` (new) — same structure as js/topalm.js

### Design decisions
- **Embed target:** `https://wie.dlunch.net/` (official WIE web frontend; verified no X-Frame-Options/CSP frame-ancestors)
- **Tab layout:** single Demo tab only
- **Back link:** `../routes/game.html?category=mobile`
- **iframe:** id `wipiFrame`, `allow="fullscreen; autoplay" allowfullscreen`, `.wipi-wrapper` CSS, max-width 480px
- **Page title / i18n pageTitle:** 'WIPI'
- **Header icon:** `fa-mobile-screen`

### Steps
- [ ] Create `images/wipi.svg`
- [ ] Create `routes/wipi.html`: adapt from palm.html — s/palm/wipi/g on ids and class names, `<title>WIPI Player - Easy Web TV</title>`, script src `../js/towipi.js`
- [ ] Create `js/towipi.js` (adapt topalm.js):
  - `var WIPI_BASE = 'https://wie.dlunch.net/';`
  - i18n keys: same set as topalm.js
  - demoDesc/aboutHint copy: WIPI = Wireless Internet Platform for Interoperability, Korean mobile standard platform (2001–2009), runs SKVM/J2ME apps; emulation via WIE by dlunch (MIT, hot-linked)
  - `playWipi()` sets `frame.src = WIPI_BASE`, same load-event/overlay/slowTimer pattern
- [ ] Verify: iframe loads WIE; instructions/toast/i18n work
- [ ] Commit: `Add WIPI emulator page (WIE hot-link, mobile category)`

### Interfaces
- DOM ids consumed: s/palm/wipi/ from Task 1's list
- WIPI_BASE page-local

## Task 3: Game hub integration (js/togame.js) + README/changelog + final verification

### Files
- `js/togame.js` (modify) — add 2 entries to games[] array
- `README.md` (modify) — platform table rows + file-tree lines + features bullet
- `js/index.js` (modify) — add V8.5.1 changelog entry
- `sw.js`, `manifest.json` (check only — verified no per-route entries; nothing to do)

### Design decisions
- New ids: **101** (Palm OS), **102** (WIPI) — avoids pre-existing duplicate-id bug in the array (33/34/35/45/46/47 duplicated; do NOT fix in this PR)
- Card order: insert both right after the J2ME entry (js/togame.js:386-392, id 47) to group mobile category
- name: 'Palm OS Emulator' platform 'Palm OS', 'WIPI Emulator' platform 'WIPI'; url `../routes/palm.html` / `../routes/wipi.html`
- README platform table (line ~231, after the J2ME Mobile row): `| Mobile | Palm OS (CloudpilotEmu embed) | cloudpilot-emu (hot-linked embed) | – | – |` and `| Mobile | WIPI (WIE embed) | wie (hot-linked embed) | – | – |`
- README file-tree: add `topalm.js`/`towipi.js` next to `toj2me.js` line (~304), `palm.html`/`wipi.html` next to `j2me.html` line (~359)
- js/index.js changelog: prepend at top of changelog `<p>` list (pattern-match V8.5.0 entry at js/index.js:1228): `[2026-11-18] V8.5.1 release Add Palm OS and WIPI mobile emulators (CloudpilotEmu + WIE, hot-linked embeds) to the Mobile game category`

### Steps
- [ ] Edit `js/togame.js`: insert 2 entries after the J2ME entry with ids 101/102, category 'mobile', images `../images/palm.svg` / `../images/wipi.svg`
- [ ] Edit `README.md`: platform table rows + file-tree lines + features bullet next to the Emulator support bullet (~line 70): `**Mobile platforms**: Palm OS (CloudpilotEmu) and WIPI (WIE), hot-linked embeds`
- [ ] Edit `js/index.js`: prepend V8.5.1 changelog entry dated 2026-11-18
- [ ] Verify: `routes/game.html?category=mobile` shows exactly 3 cards, each navigates to its page; Select-String check that togame.js image/url paths resolve to existing files
- [ ] Commit: `Add Palm OS + WIPI cards to mobile game category, README and changelog (V8.5.1)`

## Review Focus

- **iframe embeddability risk (highest):** both targets header-verified, but live behavior can differ (frame-busting JS, first-party storage requirements). If either fails inside an iframe during verification, fall back to "Open in new tab" mode: keep the page, make demoOpenBtn primary (window.open), do not remove the route page
- **Wrong i18n key referenced in HTML:** every data-i18n attribute must have a matching key in all 8 languages; missing key → English fallback. Verify with lang switching
- **togame.js id collision:** pre-existing duplicates exist; new ids 101/102 avoid them
- **UTF-8 safety:** ko/zh/ja strings are UTF-8; spot-check new JS files open cleanly with `Get-Content -Encoding UTF8`
