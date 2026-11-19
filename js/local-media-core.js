// Shared core for browser-local media libraries.
// Classic script: exposes window.LocalMediaCore. No network or persistence of file bodies.
(function (global) {
    'use strict';

    var FORMATS = {
        novel: ['.txt', '.md', '.markdown'],
        manga: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif'],
        audio: ['.mp3', '.m4a', '.aac', '.ogg', '.oga', '.wav', '.flac'],
        video: ['.mp4', '.webm', '.ogv', '.m4v', '.mov']
    };

    var UNSUPPORTED_REASONS = {
        '.epub': 'EPUB needs an ebook parser (deferred)',
        '.pdf': 'PDF is not a browser-native novel format',
        '.docx': 'DOCX needs a document parser (deferred)',
        '.mobi': 'MOBI needs an ebook parser (deferred)',
        '.azw': 'AZW needs an ebook parser (deferred)',
        '.azw3': 'AZW3 needs an ebook parser (deferred)',
        '.cbz': 'CBZ archives are deferred',
        '.zip': 'ZIP archives are deferred',
        '.cbr': 'CBR archives are deferred',
        '.rar': 'RAR archives are deferred',
        '.7z': '7z archives are deferred',
        '.m3u8': 'Local M3U8 playlists are excluded',
        '.mkv': 'Browser playback is not guaranteed',
        '.avi': 'Browser playback is not guaranteed',
        '.ts': 'Browser playback is not guaranteed',
        '.wmv': 'Browser playback is not guaranteed',
        '.flv': 'Browser playback is not guaranteed'
    };

    var LIMITS = { MAX_ENTRIES: 10000, MAX_DEPTH: 12, YIELD_EVERY: 500 };
    var DB_NAME = 'easy-web-tv-local-media';
    var STORE_HANDLES = 'handles';
    var STORE_PROGRESS = 'progress';
    var objectUrls = {};
    var scanTokens = {};
    var pagehideBound = false;

    function hasWindow() {
        return typeof global !== 'undefined' && !!global && !!global.document && !!global.window;
    }

    function hasShowDirectoryPicker() {
        return hasWindow() && typeof global.showDirectoryPicker === 'function';
    }

    function hasWebkitDirectory() {
        if (!hasWindow()) return false;
        var input = global.document.createElement('input');
        return 'webkitdirectory' in input;
    }

    function hasIndexedDB() {
        return hasWindow() && !!global.indexedDB;
    }

    function getExtension(name) {
        var match = String(name || '').toLowerCase().match(/(\.[a-z0-9]+)$/);
        return match ? match[1] : '';
    }

    function classifyFile(file) {
        if (!file || !file.name) return '';
        var ext = getExtension(file.name);
        var keys = Object.keys(FORMATS);
        for (var i = 0; i < keys.length; i++) {
            if (FORMATS[keys[i]].indexOf(ext) !== -1) return keys[i];
        }
        return '';
    }

    function isSupported(file, category) {
        return classifyFile(file) === category;
    }

    function getSupportReason(file, category) {
        var ext = getExtension(file && file.name);
        if (UNSUPPORTED_REASONS[ext]) return UNSUPPORTED_REASONS[ext];
        if (!ext) return 'Unknown file type';
        if (!classifyFile(file)) return ext.toUpperCase() + ' is not a supported local format';
        return 'This file belongs to another media category';
    }

    function naturalCompare(a, b) {
        var left = String(a || '');
        var right = String(b || '');
        var rx = /(\d+)|(\D+)/g;
        var aa = left.match(rx) || [];
        var bb = right.match(rx) || [];
        var i = 0;
        while (i < aa.length && i < bb.length) {
            var x = aa[i];
            var y = bb[i];
            if (x !== y) {
                if (/^\d+$/.test(x) && /^\d+$/.test(y)) return parseInt(x, 10) - parseInt(y, 10);
                return x < y ? -1 : 1;
            }
            i++;
        }
        return aa.length - bb.length;
    }

    function compareEntries(a, b) {
        return naturalCompare(a.path || a.name, b.path || b.name) || naturalCompare(a.name, b.name);
    }

    function sortEntries(entries, mode) {
        var list = Array.prototype.slice.call(entries || []);
        if (mode === 'none') return list;
        list.sort(function (a, b) {
            var primary = mode === 'name' ? naturalCompare(a.name, b.name) : compareEntries(a, b);
            if (primary) return primary;
            return (a.size || 0) - (b.size || 0);
        });
        return list;
    }

    function createStableFileId(entry) {
        var e = entry || {};
        return 'local:' + [
            e.rootName || '',
            e.path || e.name || '',
            e.name || '',
            e.size || 0,
            e.lastModified || 0
        ].join('|');
    }

    function yieldToBrowser() {
        return new Promise(function (resolve) {
            if (typeof setTimeout === 'function') setTimeout(resolve, 0);
            else resolve();
        });
    }

    function fileFromHandle(handle) {
        if (handle && typeof handle.getFile === 'function') return handle.getFile();
        return Promise.resolve(handle);
    }

    function scanHandle(handle, options) {
        var opts = options || {};
        var rootName = opts.rootName || (handle && handle.name) || 'Local';
        var token = {};
        var tokenKey = opts.tokenKey || 'default';
        scanTokens[tokenKey] = token;
        var result = {
            rootName: rootName,
            entries: [],
            unsupported: [],
            truncated: false,
            cancelled: false
        };

        async function visit(dir, prefix, depth) {
            if (token.cancelled || result.truncated) return;
            if (depth > LIMITS.MAX_DEPTH) {
                result.truncated = true;
                return;
            }
            var values = [];
            if (dir && typeof dir.values === 'function') {
                var iterator = dir.values();
                while (true) {
                    var step = await iterator.next();
                    if (step.done) break;
                    values.push(step.value);
                }
            }
            for (var i = 0; i < values.length; i++) {
                if (token.cancelled || result.truncated) return;
                if (result.entries.length + result.unsupported.length >= LIMITS.MAX_ENTRIES) {
                    result.truncated = true;
                    return;
                }
                var item = values[i];
                var itemPath = prefix ? prefix + '/' + item.name : item.name;
                if (item.kind === 'directory' || (item && typeof item.values === 'function')) {
                    if (opts.onProgress) opts.onProgress('Scanning ' + itemPath);
                    await visit(item, itemPath, depth + 1);
                } else {
                    var file = await fileFromHandle(item);
                    var category = classifyFile(file);
                    if (opts.category && category !== opts.category) continue;
                    if (category) result.entries.push(normalizeEntry(file, itemPath, rootName));
                    else result.unsupported.push({ name: file.name, path: itemPath, reason: getSupportReason(file, opts.category || category) });
                }
                if ((result.entries.length + result.unsupported.length) % LIMITS.YIELD_EVERY === 0) await yieldToBrowser();
            }
        }

        return visit(handle, '', 0).then(function () {
            delete scanTokens[tokenKey];
            return result;
        });
    }

    function cancelScan(tokenKey) {
        var token = scanTokens[tokenKey || 'default'];
        if (token) token.cancelled = true;
    }

    function normalizeEntry(file, path, rootName) {
        var entry = {
            id: '',
            file: file,
            name: file.name,
            path: path,
            rootName: rootName || '',
            category: classifyFile(file),
            size: file.size || 0,
            lastModified: file.lastModified || 0
        };
        entry.id = createStableFileId(entry);
        return entry;
    }
    function pickFiles(options) {
        var opts = options || {};
        return new Promise(function (resolve, reject) {
            if (!hasWindow()) {
                reject(new Error('File picking requires a browser'));
                return;
            }
            var input = global.document.createElement('input');
            input.type = 'file';
            input.multiple = opts.multiple !== false;
            input.accept = opts.accept || '';
            input.addEventListener('change', function () {
                var files = Array.prototype.slice.call(input.files || []);
                var rootName = opts.rootName || 'Selected files';
                var result = { rootName: rootName, entries: [], unsupported: [], truncated: false, cancelled: false };
                files.forEach(function (file) {
                    var category = classifyFile(file);
                    if (opts.category && category !== opts.category) return;
                    if (category) result.entries.push(normalizeEntry(file, file.name, rootName));
                    else result.unsupported.push({ name: file.name, path: file.name, reason: getSupportReason(file, opts.category || category) });
                });
                resolve(result);
            });
            input.addEventListener('cancel', function () {
                resolve({ rootName: '', entries: [], unsupported: [], truncated: false, cancelled: true });
            });
            input.click();
        });
    }

    function pickDirectory(options) {
        var opts = options || {};
        if (hasShowDirectoryPicker()) {
            return global.showDirectoryPicker({ mode: 'read' }).then(function (handle) {
                return scanHandle(handle, opts).then(function (result) {
                    result.handle = handle;
                    return result;
                });
            });
        }
        if (hasWebkitDirectory()) {
            return new Promise(function (resolve) {
                var input = global.document.createElement('input');
                input.type = 'file';
                input.multiple = true;
                input.webkitdirectory = true;
                input.addEventListener('change', function () {
                    var files = Array.prototype.slice.call(input.files || []);
                    var rootName = files.length && files[0].webkitRelativePath
                        ? files[0].webkitRelativePath.split('/')[0]
                        : 'Selected folder';
                    var result = { rootName: rootName, entries: [], unsupported: [], truncated: files.length >= LIMITS.MAX_ENTRIES, cancelled: false };
                    files.forEach(function (file) {
                        var path = file.webkitRelativePath || file.name;
                        var category = classifyFile(file);
                        if (opts.category && category !== opts.category) return;
                        if (result.entries.length + result.unsupported.length >= LIMITS.MAX_ENTRIES) {
                            result.truncated = true;
                            return;
                        }
                        if (category) result.entries.push(normalizeEntry(file, path, rootName));
                        else result.unsupported.push({ name: file.name, path: path, reason: getSupportReason(file, opts.category || category) });
                    });
                    resolve(result);
                });
                input.addEventListener('cancel', function () {
                    resolve({ rootName: '', entries: [], unsupported: [], truncated: false, cancelled: true });
                });
                input.click();
            });
        }
        return pickFiles(opts);
    }

    function revokeObjectUrl(id) {
        if (!objectUrls[id]) return;
        try { global.URL.revokeObjectURL(objectUrls[id]); } catch (e) { /* ignore */ }
        delete objectUrls[id];
    }

    function releaseAllObjectUrls() {
        Object.keys(objectUrls).forEach(revokeObjectUrl);
    }

    function getObjectUrl(id, file) {
        if (!hasWindow()) return '';
        if (objectUrls[id]) return objectUrls[id];
        objectUrls[id] = global.URL.createObjectURL(file);
        if (!pagehideBound) {
            pagehideBound = true;
            global.addEventListener('pagehide', releaseAllObjectUrls);
        }
        return objectUrls[id];
    }

    function openDb() {
        if (!hasIndexedDB()) return Promise.resolve(null);
        return new Promise(function (resolve) {
            var request = global.indexedDB.open(DB_NAME, 1);
            request.onupgradeneeded = function () {
                var db = request.result;
                if (!db.objectStoreNames.contains(STORE_HANDLES)) db.createObjectStore(STORE_HANDLES);
                if (!db.objectStoreNames.contains(STORE_PROGRESS)) db.createObjectStore(STORE_PROGRESS);
            };
            request.onsuccess = function () { resolve(request.result); };
            request.onerror = function () { resolve(null); };
        });
    }

    function withStore(storeName, mode, callback) {
        return openDb().then(function (db) {
            if (!db) return undefined;
            return new Promise(function (resolve) {
                var tx = db.transaction(storeName, mode);
                var store = tx.objectStore(storeName);
                var result = callback(store);
                tx.oncomplete = function () { resolve(result && result.result !== undefined ? result.result : result); };
                tx.onerror = function () { resolve(null); };
            });
        });
    }

    function getProgress(id) {
        return withStore(STORE_PROGRESS, 'readonly', function (store) { return store.get(String(id)); });
    }

    function saveProgress(id, value) {
        return withStore(STORE_PROGRESS, 'readwrite', function (store) { store.put(value || {}, String(id)); });
    }

    function saveHandle(category, handle, rootName) {
        return withStore(STORE_HANDLES, 'readwrite', function (store) {
            store.put({ handle: handle, rootName: rootName || '', savedAt: Date.now() }, String(category));
        });
    }

    function getHandle(category) {
        return withStore(STORE_HANDLES, 'readonly', function (store) { return store.get(String(category)); });
    }

    function requestHandlePermission(handle) {
        if (!handle || typeof handle.queryPermission !== 'function' || typeof handle.requestPermission !== 'function') {
            return Promise.resolve(true);
        }
        return handle.queryPermission({ mode: 'read' }).then(function (state) {
            if (state === 'granted') return true;
            return handle.requestPermission({ mode: 'read' }).then(function (next) { return next === 'granted'; });
        }).catch(function () { return false; });
    }

    function addButton(parent, text, onClick) {
        var button = global.document.createElement('button');
        button.type = 'button';
        button.className = 'local-media-btn';
        button.textContent = text;
        button.addEventListener('click', onClick);
        parent.appendChild(button);
        return button;
    }

    // Built-in picker i18n (labels shown by mountPicker). Follows the same
    // localStorage language keys as the host pages; unknown -> English.
    var PICKER_I18N = {
        en: {
            pickFiles: 'Choose files',
            pickFolder: 'Choose folder',
            restoreFolder: 'Restore folder',
            choosingFiles: 'Choosing files...',
            choosingFolder: 'Choosing folder...',
            restoringFolder: 'Restoring folder...',
            noSavedFolder: 'No saved folder for this browser.',
            permDenied: 'Permission was not granted. Choose the folder again.',
            introDir: 'Local files stay in this browser. Choose a folder to begin.',
            introAny: 'Local files stay in this browser. Choose files or a folder to begin.',
            unsupported: ' unsupported file(s) skipped',
            supportedFrom: ' supported file(s) from ',
            localFiles: 'local files'
        },
        zh: {
            pickFiles: '选择文件',
            pickFolder: '选择文件夹',
            restoreFolder: '恢复文件夹',
            choosingFiles: '正在选择文件...',
            choosingFolder: '正在选择文件夹...',
            restoringFolder: '正在恢复文件夹...',
            noSavedFolder: '此浏览器没有已保存的文件夹。',
            permDenied: '未获得权限，请重新选择文件夹。',
            introDir: '本地文件仅保存在本浏览器中。选择一个文件夹开始。',
            introAny: '本地文件仅保存在本浏览器中。选择文件或文件夹开始。',
            unsupported: ' 个不支持的文件已跳过',
            supportedFrom: ' 个支持的文件，来自 ',
            localFiles: '本地文件'
        },
        ja: {
            pickFiles: 'ファイルを選択',
            pickFolder: 'フォルダーを選択',
            restoreFolder: 'フォルダーを復元',
            choosingFiles: 'ファイルを選択中...',
            choosingFolder: 'フォルダーを選択中...',
            restoringFolder: 'フォルダーを復元中...',
            noSavedFolder: 'このブラウザーに保存されたフォルダーはありません。',
            permDenied: '権限が許可されませんでした。フォルダーを選び直してください。',
            introDir: 'ローカルファイルはこのブラウザー内にのみ保存されます。開始するにはフォルダーを選択してください。',
            introAny: 'ローカルファイルはこのブラウザー内にのみ保存されます。開始するにはファイルまたはフォルダーを選択してください。',
            unsupported: ' 件の未対応ファイルをスキップしました',
            supportedFrom: ' 件の対応ファイル（取得元: ',
            localFiles: 'ローカルファイル'
        },
        ko: {
            pickFiles: '파일 선택',
            pickFolder: '폴더 선택',
            restoreFolder: '폴더 복원',
            choosingFiles: '파일 선택 중...',
            choosingFolder: '폴더 선택 중...',
            restoringFolder: '폴더 복원 중...',
            noSavedFolder: '이 브라우저에 저장된 폴더가 없습니다.',
            permDenied: '권한이 허용되지 않았습니다. 폴더를 다시 선택하세요.',
            introDir: '로컬 파일은 이 브라우저에만 저장됩니다. 시작하려면 폴더를 선택하세요.',
            introAny: '로컬 파일은 이 브라우저에만 저장됩니다. 시작하려면 파일이나 폴더를 선택하세요.',
            unsupported: ' 지원되지 않는 파일을 건너뛰었습니다',
            supportedFrom: ' 지원되는 파일, 출처: ',
            localFiles: '로컬 파일'
        },
        fr: {
            pickFiles: 'Choisir des fichiers',
            pickFolder: 'Choisir un dossier',
            restoreFolder: 'Restaurer le dossier',
            choosingFiles: 'Sélection des fichiers...',
            choosingFolder: 'Sélection du dossier...',
            restoringFolder: 'Restauration du dossier...',
            noSavedFolder: 'Aucun dossier enregistré pour ce navigateur.',
            permDenied: "L'autorisation n'a pas été accordée. Choisissez à nouveau le dossier.",
            introDir: 'Les fichiers locaux restent dans ce navigateur. Choisissez un dossier pour commencer.',
            introAny: 'Les fichiers locaux restent dans ce navigateur. Choisissez des fichiers ou un dossier pour commencer.',
            unsupported: ' fichier(s) non pris en charge ignoré(s)',
            supportedFrom: ' fichier(s) pris en charge depuis ',
            localFiles: 'fichiers locaux'
        },
        de: {
            pickFiles: 'Dateien auswählen',
            pickFolder: 'Ordner auswählen',
            restoreFolder: 'Ordner wiederherstellen',
            choosingFiles: 'Dateien werden ausgewählt...',
            choosingFolder: 'Ordner wird ausgewählt...',
            restoringFolder: 'Ordner wird wiederhergestellt...',
            noSavedFolder: 'Für diesen Browser ist kein Ordner gespeichert.',
            permDenied: 'Die Berechtigung wurde nicht erteilt. Wählen Sie den Ordner erneut.',
            introDir: 'Lokale Dateien bleiben in diesem Browser. Wählen Sie einen Ordner zum Starten.',
            introAny: 'Lokale Dateien bleiben in diesem Browser. Wählen Sie Dateien oder einen Ordner zum Starten.',
            unsupported: ' nicht unterstützte Datei(en) übersprungen',
            supportedFrom: ' unterstützte Datei(en) aus ',
            localFiles: 'lokale Dateien'
        },
        es: {
            pickFiles: 'Elegir archivos',
            pickFolder: 'Elegir carpeta',
            restoreFolder: 'Restaurar carpeta',
            choosingFiles: 'Eligiendo archivos...',
            choosingFolder: 'Eligiendo carpeta...',
            restoringFolder: 'Restaurando carpeta...',
            noSavedFolder: 'No hay ninguna carpeta guardada en este navegador.',
            permDenied: 'No se concedió el permiso. Vuelve a elegir la carpeta.',
            introDir: 'Los archivos locales permanecen en este navegador. Elige una carpeta para empezar.',
            introAny: 'Los archivos locales permanecen en este navegador. Elige archivos o una carpeta para empezar.',
            unsupported: ' archivo(s) no compatibles omitidos',
            supportedFrom: ' archivo(s) compatibles desde ',
            localFiles: 'archivos locales'
        },
        ru: {
            pickFiles: 'Выбрать файлы',
            pickFolder: 'Выбрать папку',
            restoreFolder: 'Восстановить папку',
            choosingFiles: 'Выбор файлов...',
            choosingFolder: 'Выбор папки...',
            restoringFolder: 'Восстановление папки...',
            noSavedFolder: 'В этом браузере нет сохранённой папки.',
            permDenied: 'Разрешение не предоставлено. Выберите папку снова.',
            introDir: 'Локальные файлы остаются в этом браузере. Выберите папку, чтобы начать.',
            introAny: 'Локальные файлы остаются в этом браузере. Выберите файлы или папку, чтобы начать.',
            unsupported: ' неподдерживаемых файлов пропущено',
            supportedFrom: ' поддерживаемых файлов из ',
            localFiles: 'локальные файлы'
        }
    };

    function pickLang() {
        try {
            var lang = String(global.localStorage.getItem('preferredLanguage')
                || global.localStorage.getItem('languages') || '').toLowerCase();
            if (lang.indexOf('zh') === 0) return 'zh';
            if (lang.indexOf('en') === 0) return 'en';
            var uiLangs = ['ja', 'ko', 'fr', 'de', 'es', 'ru'];
            for (var i = 0; i < uiLangs.length; i++) {
                if (lang.indexOf(uiLangs[i]) === 0) return uiLangs[i];
            }
        } catch (e) { /* storage unavailable */ }
        return 'en';
    }

    function pickT(key) {
        var lang = pickLang();
        return (PICKER_I18N[lang] && PICKER_I18N[lang][key]) || PICKER_I18N.en[key] || key;
    }

    function isLocalSource(search) {
        // Only the explicit `src=local` parameter selects local playback. A
        // leftover sessionStorage entry must never hijack an online page.
        var value = String(search || '');
        if (value.charAt(0) === '?') value = value.slice(1);
        if (!value) return false;
        var parts = value.split('&');
        for (var i = 0; i < parts.length; i++) {
            var pair = parts[i].split('=');
            if (decodeURIComponent(pair[0]) === 'src') {
                return decodeURIComponent((pair[1] || '').replace(/\+/g, ' ')) === 'local';
            }
        }
        return false;
    }

    var VIDEO_MIME = {
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.ogv': 'video/ogg',
        '.m4v': 'video/x-m4v',
        '.mov': 'video/quicktime'
    };

    function mimeForVideoFile(name) {
        var ext = getExtension(name);
        return VIDEO_MIME[ext] || 'video/mp4';
    }

    function mangaGroupId(name) {
        return 'local-group:' + String(name || 'Root');
    }

    // A session picked through a directory handle can be reopened after a
    // reload (the handle is in IndexedDB). Files picked through <input> cannot:
    // their File objects die with the page, so the user must pick again.
    function isResumableOnReload(session) {
        return !!(session && session.handle);
    }

    function createProgressThrottler(options) {
        var opts = options || {};
        var minIntervalMs = typeof opts.minIntervalMs === 'number' ? opts.minIntervalMs : 5000;
        var now = typeof opts.now === 'function' ? opts.now : function () { return Date.now(); };
        var save = typeof opts.save === 'function' ? opts.save : function () { };
        var lastSavedAt = -Infinity;
        var pending = null;

        function persist() {
            if (!pending) return;
            var item = pending;
            pending = null;
            lastSavedAt = now();
            save(item.id, item.value);
        }

        return {
            push: function (id, value) {
                pending = { id: id, value: value };
                if (now() - lastSavedAt >= minIntervalMs) persist();
            },
            flush: function () { persist(); }
        };
    }

    // Resolve every requested entry from the saved directory handle with a
    // SINGLE scan. Returns { entries, error } and never throws.
    function resolveEntries(metas, options, deps) {
        var opts = options || {};
        var list = Array.prototype.slice.call(metas || []);
        var handleKey = opts.handleKey || opts.category || '';
        var api = deps || api_deps();
        if (!list.length) return Promise.resolve({ entries: [], error: null });
        return Promise.resolve()
            .then(function () { return api.getHandle(handleKey); })
            .then(function (saved) {
                if (!saved || !saved.handle) {
                    return { entries: [], error: 'Please choose the local folder again' };
                }
                return Promise.resolve(api.requestHandlePermission(saved.handle)).then(function (allowed) {
                    if (!allowed) return { entries: [], error: 'Permission was not granted' };
                    return Promise.resolve(api.scanHandle(saved.handle, {
                        category: opts.category,
                        rootName: saved.rootName || opts.rootName
                    })).then(function (result) {
                        var byId = {};
                        (result && result.entries || []).forEach(function (entry) { byId[entry.id] = entry; });
                        var entries = [];
                        for (var i = 0; i < list.length; i++) {
                            var found = byId[list[i].id];
                            if (found) entries.push(found);
                        }
                        if (!entries.length) {
                            return { entries: [], error: 'Local files not found; please choose the folder again' };
                        }
                        return { entries: entries, error: null };
                    });
                });
            })
            .catch(function (error) {
                return { entries: [], error: (error && error.message) || 'Unable to read the local folder' };
            });
    }

    function api_deps() {
        return {
            getHandle: getHandle,
            requestHandlePermission: requestHandlePermission,
            scanHandle: scanHandle
        };
    }

    function mountPicker(container, options) {
        var opts = options || {};
        var root = global.document.createElement('div');
        root.className = 'local-media-panel';
        var actions = global.document.createElement('div');
        actions.className = 'local-media-actions';
        var status = global.document.createElement('div');
        status.className = 'local-media-status';
        status.setAttribute('role', 'status');
        var list = global.document.createElement('div');
        list.className = 'local-media-list';
        root.appendChild(actions);
        root.appendChild(status);
        root.appendChild(list);
        container.appendChild(root);

        function renderStatus(text) {
            status.textContent = String(text || '');
        }

        function renderUnsupported(result) {
            list.textContent = '';
            var unsupported = (result && result.unsupported) || [];
            if (!unsupported.length) return;
            var box = global.document.createElement('div');
            box.className = 'local-media-unsupported';
            var heading = global.document.createElement('strong');
            heading.textContent = unsupported.length + pickT('unsupported');
            box.appendChild(heading);
            var ul = global.document.createElement('ul');
            unsupported.slice(0, 20).forEach(function (item) {
                var li = global.document.createElement('li');
                li.textContent = item.path + ' — ' + item.reason;
                ul.appendChild(li);
            });
            box.appendChild(ul);
            list.appendChild(box);
        }

        function renderResult(result) {
            renderStatus((result.entries || []).length + pickT('supportedFrom') + (result.rootName || pickT('localFiles')));
            renderUnsupported(result);
            if (opts.onResult) opts.onResult(result);
        }

        addButton(actions, pickT('pickFiles'), function () {
            renderStatus(pickT('choosingFiles'));
            pickFiles(opts).then(renderResult).catch(function (error) { renderStatus(error.message); });
        });
        addButton(actions, pickT('pickFolder'), function () {
            renderStatus(pickT('choosingFolder'));
            pickDirectory(opts).then(renderResult).catch(function (error) { renderStatus(error.message); });
        });
        if (opts.category) {
            addButton(actions, pickT('restoreFolder'), function () {
                renderStatus(pickT('restoringFolder'));
                getHandle(opts.category).then(function (saved) {
                    if (!saved || !saved.handle) {
                        renderStatus(pickT('noSavedFolder'));
                        return;
                    }
                    return requestHandlePermission(saved.handle).then(function (allowed) {
                        if (!allowed) {
                            renderStatus(pickT('permDenied'));
                            return;
                        }
                        return scanHandle(saved.handle, opts).then(renderResult);
                    });
                }).catch(function (error) { renderStatus(error.message); });
            });
        }
        renderStatus(hasShowDirectoryPicker()
            ? pickT('introDir')
            : pickT('introAny'));

        return {
            renderStatus: renderStatus,
            renderResult: renderResult,
            destroy: function () {
                if (root.parentNode) root.parentNode.removeChild(root);
            }
        };
    }

    var api = {
        FORMATS: FORMATS,
        UNSUPPORTED_REASONS: UNSUPPORTED_REASONS,
        LIMITS: LIMITS,
        hasShowDirectoryPicker: hasShowDirectoryPicker,
        hasWebkitDirectory: hasWebkitDirectory,
        hasIndexedDB: hasIndexedDB,
        getExtension: getExtension,
        classifyFile: classifyFile,
        isSupported: isSupported,
        getSupportReason: getSupportReason,
        naturalCompare: naturalCompare,
        sortEntries: sortEntries,
        createStableFileId: createStableFileId,
        pickFiles: pickFiles,
        pickDirectory: pickDirectory,
        scanHandle: scanHandle,
        cancelScan: cancelScan,
        releaseAllObjectUrls: releaseAllObjectUrls,
        getObjectUrl: getObjectUrl,
        openDb: openDb,
        getProgress: getProgress,
        saveProgress: saveProgress,
        saveHandle: saveHandle,
        getHandle: getHandle,
        requestHandlePermission: requestHandlePermission,
        isLocalSource: isLocalSource,
        mimeForVideoFile: mimeForVideoFile,
        mangaGroupId: mangaGroupId,
        isResumableOnReload: isResumableOnReload,
        createProgressThrottler: createProgressThrottler,
        resolveEntries: resolveEntries,
        mountPicker: mountPicker
    };

    if (hasWindow()) {
        global.window.LocalMediaCore = api;
        global.window.LocalMediaAdapters = global.window.LocalMediaAdapters || {};
    }
}(typeof window !== 'undefined' ? window : undefined));

