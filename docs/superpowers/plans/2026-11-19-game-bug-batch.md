# Game Module Bug Batch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the five remaining game-module issue groups found in the v8.5.3 audit: Vita back navigation, duplicate Sega CD card, credentialless storage messaging, unknown Web Game key handling, and documentation/tooling drift.

**Architecture:** Keep the existing static JavaScript/HTML architecture. Add one dependency-free Node regression checker that asserts the file-level invariants for these bugs, then make the smallest source and documentation changes needed. Add a GitHub Actions workflow so the existing checkers and the new regression checker run on every push and pull request.

**Tech Stack:** Plain browser JavaScript, static HTML, Markdown, Node.js, GitHub Actions.

**Spec:** The bug list delivered before this implementation request.

## Global Constraints

- Use only libraries already available: plain JavaScript and Node.js built-ins.
- Preserve the project's CRLF line endings where editing existing files.
- Do not restore the intentionally deleted Palm/WIPI plan document.
- Keep iframe hot-linking; do not bundle or vendor copyrighted emulator/game assets.
- Keep cross-origin isolation for PS2/Vita, but do not promise persistence that `credentialless` iframes cannot provide.
- Every production change must be preceded by a failing check.

## Review Focus

- Category deep links must return to the card's actual category.
- Game IDs are identity keys for favorites and Continue Playing; duplicate cards must not leave divergent IDs.
- User-facing privacy/storage copy must match browser behavior for `credentialless`.
- Invalid `?game=` keys must not masquerade as a different playable game.
- Static HTML fallbacks, README numbers, and automation must not contradict runtime data.

## Tasks

### Task 1: Add regression checker and CI

Files:

- Create `docs/superpowers/check-game-regressions.js`
- Create `.github/workflows/checks.yml`
- Modify `docs/superpowers/check-games.js`

Steps:

- [ ] Add assertions for all five bug groups; run it and confirm it fails on the current tree.
- [ ] Generalize the mobile-category check so adding a new mobile platform does not require editing the checker.
- [ ] Add a workflow running `node docs/superpowers/check-games.js js/togame.js`, `node docs/superpowers/check-i18n.js <js> <html>` for all i18n page pairs, and `node docs/superpowers/check-game-regressions.js`.
- [ ] Run all checks; the regression checker must pass only after later tasks are implemented.

### Task 2: Fix Vita and Sega CD data

Files:

- Modify `js/tovita.js`
- Modify `js/togame.js`

Steps:

- [ ] Change the Vita back link to `?category=emulator`.
- [ ] Fix the original Sega CD card URL to include `platform=segacd`.
- [ ] Remove the later duplicate Sega CD card from the source array so only one card exists; do not mutate the array at runtime because IDs are favorites/history keys.
- [ ] Run the regression checker.

### Task 3: Correct credentialless storage expectations

Files:

- Modify `js/tops2.js`
- Modify `js/tovita.js`
- Modify `routes/ps2.html`
- Modify `routes/vita.html`
- Modify `README.md`

Steps:

- [ ] Add a visible “open in a new tab” link to both player start screens and wire its href from the existing base URL constant.
- [ ] Update all eight i18n `demoHint` strings in both modules to state that embedded storage is temporary and long-term saves need the new tab.
- [ ] Update static HTML fallback copy to the same meaning.
- [ ] Update README What's New and feature bullets to remove the false persistence promise.
- [ ] Run i18n checks and the regression checker.

### Task 4: Handle unknown Web Game keys

Files:

- Modify `js/towebgame.js`

Steps:

- [ ] Resolve missing/unknown `?game=` keys to an explicit invalid state instead of silently using 2048.
- [ ] Show a Chinese/English/etc. error message through the existing toast/i18n mechanism and disable launching until a valid key is supplied.
- [ ] Keep all known keys launching exactly as before.
- [ ] Run syntax, i18n, and regression checks.

### Task 5: Clean drift and cosmetic issues

Files:

- Modify `routes/diablo.html`
- Modify `routes/z2rs.html`
- Modify `routes/webgame.html`
- Modify `README.md`

Steps:

- [ ] Replace copied RA2 loading text with the correct Diablo and Zelda II text.
- [ ] Replace Web Game static tab text “Emulator” with “Game”.
- [ ] Fix the `}// ---- fullscreen ---` formatting in `towebgame.js`.
- [ ] Recalculate README platform/catalogue totals from runtime data and JSON counts.
- [ ] Run the full check suite and verify no unintended files changed.

## Verification

```bash
node docs/superpowers/check-games.js js/togame.js
node docs/superpowers/check-i18n.js js/topalm.js routes/palm.html
node docs/superpowers/check-i18n.js js/towipi.js routes/wipi.html
node docs/superpowers/check-i18n.js js/tora2.js routes/ra2.html
node docs/superpowers/check-i18n.js js/todiablo.js routes/diablo.html
node docs/superpowers/check-i18n.js js/toz2rs.js routes/z2rs.html
node docs/superpowers/check-i18n.js js/towebgame.js routes/webgame.html
node docs/superpowers/check-i18n.js js/tops2.js routes/ps2.html
node docs/superpowers/check-i18n.js js/tovita.js routes/vita.html
node docs/superpowers/check-game-regressions.js
node --check js/togame.js
node --check js/tovita.js
node --check js/tops2.js
node --check js/towebgame.js
```
