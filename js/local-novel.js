// Local novel picker adapter. Keeps file bodies in memory and hands the scan to novelplay.html.
(function (global) {
    'use strict';
    if (!global || !global.window) return;

    global.window.LocalMediaAdapters = global.window.LocalMediaAdapters || {};

    function open(options) {
        var core = global.window.LocalMediaCore;
        if (!core) return Promise.reject(new Error('LocalMediaCore is not loaded'));
        var opts = options || {};
        var filesMode = opts.mode === 'files';
        var pick = filesMode ? core.pickFiles : core.pickDirectory;
        return pick({
            category: 'novel',
            accept: '.txt,.md,.markdown',
            rootName: 'Local novels',
            onProgress: opts.onProgress
        }).then(function (result) {
            if (!result || result.cancelled) return result;
            result.entries = core.sortEntries(result.entries, 'path');
            if (!result.entries.length) {
                if (opts.onEmpty) opts.onEmpty(result);
                return result;
            }
            if (result.handle && core.saveHandle) core.saveHandle('novel', result.handle, result.rootName);
            // "Choose files" has no directory handle: stage the bodies in IDB.
            result.filesMode = filesMode;
            if (filesMode && core.stageEntries) {
                return core.stageEntries('novel', result.entries).then(function (stage) {
                    if (stage && stage.error) {
                        if (opts.onStageFailed) opts.onStageFailed(stage);
                        return result;
                    }
                    return saveAndOpen(result, opts);
                });
            }
            return saveAndOpen(result, opts);
        });
    }

    // Persist the playlist metadata and hand it to the reader page.
    function saveAndOpen(result, opts) {
        var core = global.window.LocalMediaCore;
        try {
            global.sessionStorage.setItem('localMediaNovel', JSON.stringify({
                rootName: result.rootName,
                // Directory handles and staged files both survive a reload.
                resumable: core.isResumableOnReload(result) || !!result.filesMode,
                filesMode: !!result.filesMode,
                // Scan limit hit: tell the reader rather than silently dropping files.
                truncated: !!result.truncated,
                entries: result.entries.map(function (entry) {
                    return {
                        id: entry.id,
                        name: entry.name,
                        path: entry.path,
                        size: entry.size,
                        lastModified: entry.lastModified
                    };
                })
            }));
        } catch (error) {
            return Promise.reject(error);
        }
        global.window.location.href = '../catalogues/novelplay.html?src=local';
        return result;
    }

    function restore(options) {
        var core = global.window.LocalMediaCore;
        if (!core) return Promise.reject(new Error('LocalMediaCore is not loaded'));
        var opts = options || {};
        return core.getHandle('novel').then(function (saved) {
            if (!saved || !saved.handle) {
                // A staged "choose files" session can still be restored, but only
                // while its bodies are still in IndexedDB (quota/eviction can drop
                // them), otherwise the reader would open onto a broken file.
                var staged = readStagedSession();
                if (!staged) {
                    if (opts.onEmpty) opts.onEmpty(null);
                    return null;
                }
                return stagedEntriesAvailable(staged).then(function (available) {
                    if (!available) {
                        if (opts.onEmpty) opts.onEmpty(null);
                        return null;
                    }
                    global.window.location.href = '../catalogues/novelplay.html?src=local';
                    return staged;
                });
            }
            return core.requestHandlePermission(saved.handle).then(function (allowed) {
                if (!allowed) {
                    if (opts.onDenied) opts.onDenied();
                    return null;
                }
                return core.scanHandle(saved.handle, {
                    category: 'novel',
                    accept: '.txt,.md,.markdown',
                    rootName: saved.rootName || 'Local novels'
                }).then(function (scan) { return saveAndOpen(scan, opts); });
            });
        });
    }

    // Re-open a session whose files were staged in IndexedDB ("choose files").
    function readStagedSession() {
        try {
            var raw = global.sessionStorage.getItem('localMediaNovel');
            var session = raw ? JSON.parse(raw) : null;
            return session && session.filesMode && Array.isArray(session.entries) ? session : null;
        } catch (error) {
            return null;
        }
    }

    // Confirm every staged body of a session is still readable.
    function stagedEntriesAvailable(session) {
        var core = global.window.LocalMediaCore;
        var metas = (session && session.entries) || [];
        if (!core || !metas.length || typeof core.readStagedEntries !== 'function') {
            return Promise.resolve(false);
        }
        return Promise.resolve(core.readStagedEntries('novel', metas)).then(function (result) {
            var found = (result && result.entries) || [];
            return found.length === metas.length;
        }).catch(function () { return false; });
    }

    global.window.LocalMediaAdapters.novel = { open: open, restore: restore };
}(typeof window !== 'undefined' ? window : undefined));
