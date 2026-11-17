# v86 (vendored build)

Source: https://github.com/copy/v86 (release `latest`, fetched 2026-11-16)
License: BSD-2-Clause for the runtime; `seabios.bin`/`vgabios.bin` are LGPL
(see COPYING.LESSER from the v86 repository's bios/ directory).

Files:
- `libv86.js`  — runtime JS (from https://github.com/copy/v86/releases/download/latest/libv86.js)
- `v86.wasm`   — CPU core WebAssembly (from .../latest/v86.wasm)
- `seabios.bin` / `vgabios.bin` — BIOS files from the repo `bios/` directory
- `COPYING.LESSER` — LGPL text covering the bundled SeaBIOS/VGABIOS

Used by `routes/v86.html` + `js/tov86.js` (x86 Retro PC player).
