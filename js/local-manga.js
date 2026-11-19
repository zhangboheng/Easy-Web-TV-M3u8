// Local manga/comic picker adapter. Uses in-memory File objects and object URLs only.
(function (global) {
    'use strict';
    if (!global || !global.window) return;

    global.window.LocalMediaAdapters = global.window.LocalMediaAdapters || {};

    function groupEntries(entries) {
        var core = global.window.LocalMediaCore;
        var groups = {};
        entries.forEach(function (entry) {
            var parts = entry.path.split('/');
            var key = parts.length > 1 ? parts.slice(0, -1).join('/') : 'Root';
            if (!groups[key]) groups[key] = [];
            groups[key].push(entry);
        });
        return Object.keys(groups).sort().map(function (name) {
            return {
                // Ids must not embed the array position: adding or removing a
                // folder would otherwise shift saved reading progress.
                id: core ? core.mangaGroupId(name) : 'local-group:' + name,
                name: name,
                entries: groups[name]
            };
        });
    }

    function open(options) {
        var core = global.window.LocalMediaCore;
        if (!core) return Promise.reject(new Error('LocalMediaCore is not loaded'));
        var opts = options || {};
        var pick = opts.mode === 'files' ? core.pickFiles : core.pickDirectory;
        return pick({
            category: 'manga',
            accept: '.jpg,.jpeg,.png,.webp,.gif,.avif',
            rootName: 'Local manga',
            onProgress: opts.onProgress
        }).then(function (result) {
            if (!result || result.cancelled) return result;
            result.entries = core.sortEntries(result.entries, 'path');
            if (!result.entries.length) {
                if (opts.onEmpty) opts.onEmpty(result);
                return result;
            }
            if (result.handle && core.saveHandle) core.saveHandle('manga', result.handle, result.rootName);
            return saveAndOpen(result, opts);
        });
    }

    // Persist the grouped chapter metadata and hand it to the reader page.
    function saveAndOpen(result, opts) {
        var core = global.window.LocalMediaCore;
        var groups = groupEntries(result.entries);
        try {
            global.sessionStorage.setItem('localMediaManga', JSON.stringify({
                rootName: result.rootName,
                // Files mode has no handle, so a reload needs a re-pick.
                resumable: core.isResumableOnReload(result),
                groups: groups.map(function (group) {
                    return {
                        id: group.id,
                        name: group.name,
                        entries: group.entries.map(function (entry) {
                            return {
                                id: entry.id,
                                name: entry.name,
                                path: entry.path,
                                size: entry.size,
                                lastModified: entry.lastModified
                            };
                        })
                    };
                })
            }));
        } catch (error) {
            return Promise.reject(error);
        }
        global.window.location.href = '../catalogues/mangaplay.html?src=local';
        return result;
    }

    function restore(options) {
        var core = global.window.LocalMediaCore;
        if (!core) return Promise.reject(new Error('LocalMediaCore is not loaded'));
        var opts = options || {};
        return core.getHandle('manga').then(function (saved) {
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
                    category: 'manga',
                    accept: '.jpg,.jpeg,.png,.webp,.gif,.avif',
                    rootName: saved.rootName || 'Local manga'
                }).then(function (scan) { return saveAndOpen(scan, opts); });
            });
        });
    }

    global.window.LocalMediaAdapters.manga = { open: open, restore: restore };
}(typeof window !== 'undefined' ? window : undefined));
