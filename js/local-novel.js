// Local novel picker adapter. Keeps file bodies in memory and hands the scan to novelplay.html.
(function (global) {
    'use strict';
    if (!global || !global.window) return;

    global.window.LocalMediaAdapters = global.window.LocalMediaAdapters || {};

    function open(options) {
        var core = global.window.LocalMediaCore;
        if (!core) return Promise.reject(new Error('LocalMediaCore is not loaded'));
        var opts = options || {};
        var pick = opts.mode === 'files' ? core.pickFiles : core.pickDirectory;
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
            return saveAndOpen(result, opts);
        });
    }

    // Persist the playlist metadata and hand it to the reader page.
    function saveAndOpen(result, opts) {
        var core = global.window.LocalMediaCore;
        try {
            global.sessionStorage.setItem('localMediaNovel', JSON.stringify({
                rootName: result.rootName,
                // Files mode has no handle, so a reload needs a re-pick.
                resumable: core.isResumableOnReload(result),
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
                if (opts.onEmpty) opts.onEmpty(null);
                return null;
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

    global.window.LocalMediaAdapters.novel = { open: open, restore: restore };
}(typeof window !== 'undefined' ? window : undefined));
