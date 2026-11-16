# js-dos v8 (vendored)

Self-hosted build of [js-dos](https://js-dos.com/) v8.5.4, used by `routes/dos.html` + `js/todos.js` to run classic MS-DOS games (.zip packages) in the browser.

## Source

- Upstream: https://github.com/caiiiycuk/js-dos (npm package `js-dos`, version 8.5.4)
- Files extracted from the npm tarball's `release.zip` (`dist/` folder)

## License

js-dos is released under the **GPL-2.0** license (see the upstream repository).
Copyright (c) Dmitry "caiiiycuk" Svetlov.

js-dos v8 states: "All available features are enabled for any integration and free."
The upstream README and LICENSE apply to the files in this directory. This vendored
copy is kept as a separate, unmodified third-party asset (not merged into this
project's source), loaded only by `routes/dos.html`.

## Included files (trimmed for plain DOS games, ~2.6MB)

| File | Purpose |
|---|---|
| `js-dos.js` / `js-dos.css` | Player UI bundle (global `Dos()` API) |
| `emulators/emulators.js` | Core bootstrap (sets `emulators.pathPrefix`) |
| `emulators/wdosbox.js` / `wdosbox.wasm` | DOSBox WASM backend (non-threaded) |
| `emulators/wlibzip.js` / `wlibzip.wasm` | In-memory zip handling (bundle mount) |
| `emulators/file-explorer.js` / `.css` + sprites/font | In-game file explorer UI |
| `emulators/webrtcnet.mjs` / `webrtcnet.wasm` | Optional IPX networking |

Excluded from the upstream bundle: DOSBox-X builds (`wdosbox-x*`, used only for
Windows 9x images), source maps, `.symbols` files, TypeScript definitions and the
demo `index.html`.
