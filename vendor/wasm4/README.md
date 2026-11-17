# WASM-4 web runtime (vendored)

Source: npm package `wasm4@2.7.1` (https://registry.npmjs.org/wasm4/-/wasm4-2.7.1.tgz),
directory `assets/runtime/slim/`.
License: ISC (WASM-4 by Bruno Garcia, https://wasm4.org) - see LICENSE.txt.
The bundled `wasm4.js` also contains lit-html (BSD-3-Clause, Google LLC) which
carries its own license headers.

Files:
- `wasm4.js`  — self-contained web runtime (UI + emulator core, no external assets)
- `wasm4.css` — player styles
- `LICENSE.txt` — ISC license

Used by `routes/wasm4.html` + `js/towasm4.js` (fantasy console player).
Carts (.wasm files) are provided by the user via file upload or URL.
