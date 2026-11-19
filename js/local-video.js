// Local video picker adapter. Stores metadata in sessionStorage and hands File objects to the player through core object URLs.
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
            category: 'video',
            accept: '.mp4,.webm,.ogv,.m4v,.mov',
            rootName: 'Local videos',
            onProgress: opts.onProgress
        }).then(function (result) {
            if (!result || result.cancelled) return result;
            result.entries = core.sortEntries(result.entries, 'path');
            if (!result.entries.length) {
                if (opts.onEmpty) opts.onEmpty(result);
                return result;
            }
            if (result.handle && core.saveHandle) core.saveHandle('video', result.handle, result.rootName);
            return saveAndOpen(result, opts);
        });
    }

    // Persist the playlist metadata and hand it to the player page.
    function saveAndOpen(result, opts) {
        var core = global.window.LocalMediaCore;
        try {
                global.sessionStorage.setItem('localMediaVideo', JSON.stringify({
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
        global.window.location.href = '../catalogues/complay.html?src=local';
        return result;
    }

    function restore(options) {
        var core = global.window.LocalMediaCore;
        if (!core) return Promise.reject(new Error('LocalMediaCore is not loaded'));
        var opts = options || {};
        return core.getHandle('video').then(function (saved) {
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
                    category: 'video',
                    accept: '.mp4,.webm,.ogv,.m4v,.mov',
                    rootName: saved.rootName || 'Local videos'
                }).then(function (result) { return saveAndOpen(result, opts); });
            });
        });
    }

    global.window.LocalMediaAdapters.video = { open: open, restore: restore };
}(typeof window !== 'undefined' ? window : undefined));
