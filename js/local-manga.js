// Local manga/comic picker adapter. Uses in-memory File objects and object URLs only.
(function (global) {
    'use strict';
    if (!global || !global.window) return;

    global.window.LocalMediaAdapters = global.window.LocalMediaAdapters || {};

    function isPdfName(name) {
        return /\.pdf$/i.test(String(name || ''));
    }

    // PDFs are whole books: each one becomes its own chapter instead of being
    // merged with the sibling images (or other PDFs) sharing its folder.
    function groupEntries(entries) {
        var core = global.window.LocalMediaCore;
        var groups = [];
        var byKey = {};
        entries.forEach(function (entry) {
            var parts = entry.path.split('/');
            var folder = parts.length > 1 ? parts.slice(0, -1).join('/') : 'Root';
            var key;
            var label;
            if (isPdfName(entry.name)) {
                // Keep the folder in the key so two same-named PDFs in different
                // folders stay apart, but show just the file name as the title.
                key = folder + '/' + entry.name;
                label = entry.name.replace(/\.pdf$/i, '');
            } else {
                key = folder;
                label = folder;
            }
            if (!byKey[key]) {
                byKey[key] = { key: key, name: label, entries: [] };
                groups.push(byKey[key]);
            }
            byKey[key].entries.push(entry);
        });
        return groups.map(function (group) {
            return {
                // Ids must not embed the array position: adding or removing a
                // folder would otherwise shift saved reading progress. The path
                // key is stable across re-picks of the same folder.
                id: core ? core.mangaGroupId(group.key) : 'local-group:' + group.key,
                name: group.name,
                entries: group.entries
            };
        });
    }

    function open(options) {
        var core = global.window.LocalMediaCore;
        if (!core) return Promise.reject(new Error('LocalMediaCore is not loaded'));
        var opts = options || {};
        var filesMode = opts.mode === 'files';
        var pick = filesMode ? core.pickFiles : core.pickDirectory;
        return pick({
            category: 'manga',
            accept: '.jpg,.jpeg,.png,.webp,.gif,.avif,.pdf',
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
            // "Choose files" has no directory handle, so the selection must be
            // staged in IndexedDB before the reader page takes over.
            result.filesMode = filesMode;
            if (filesMode && core.stageEntries) {
                return core.stageEntries('manga', result.entries).then(function (stage) {
                    if (stage && stage.error) {
                        // Nothing was persisted, so opening the reader would only
                        // show "choose the folder again". Explain it up front.
                        if (opts.onStageFailed) opts.onStageFailed(stage);
                        return result;
                    }
                    return saveAndOpen(result, opts);
                });
            }
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
                // Directory-handle sessions survive a reload; "choose files"
                // sessions survive too now that their bodies are staged in IDB.
                resumable: core.isResumableOnReload(result) || !!result.filesMode,
                filesMode: !!result.filesMode,
                // The scan stops at its entry/depth limits; carry the flag so the
                // reader can tell the user files were left out instead of silently
                // showing a shorter library.
                truncated: !!result.truncated,
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
                // A staged "choose files" session can still be restored, but only
                // while its bodies are still in IndexedDB (quota/eviction can drop
                // them), otherwise the reader would open onto a broken chapter.
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
                    return saveAndOpenFromSession(staged, opts);
                });
            }
            return core.requestHandlePermission(saved.handle).then(function (allowed) {
                if (!allowed) {
                    if (opts.onDenied) opts.onDenied();
                    return null;
                }
                return core.scanHandle(saved.handle, {
                    category: 'manga',
                    accept: '.jpg,.jpeg,.png,.webp,.gif,.avif,.pdf',
                    rootName: saved.rootName || 'Local manga'
                }).then(function (scan) { return saveAndOpen(scan, opts); });
            });
        });
    }

    // Re-open a session whose files were staged in IndexedDB ("choose files").
    function readStagedSession() {
        try {
            var raw = global.sessionStorage.getItem('localMediaManga');
            var session = raw ? JSON.parse(raw) : null;
            return session && session.filesMode && Array.isArray(session.groups) ? session : null;
        } catch (error) {
            return null;
        }
    }

    // Confirm every staged body of a session is still readable.
    // Uses the core resolver so staging and handle fallbacks stay in one place.
    function stagedEntriesAvailable(session) {
        var core = global.window.LocalMediaCore;
        var metas = [];
        (session.groups || []).forEach(function (group) {
            (group.entries || []).forEach(function (entry) { metas.push(entry); });
        });
        if (!core || !metas.length || typeof core.readStagedEntries !== 'function') {
            return Promise.resolve(false);
        }
        return Promise.resolve(core.readStagedEntries('manga', metas)).then(function (result) {
            var found = (result && result.entries) || [];
            return found.length === metas.length;
        }).catch(function () { return false; });
    }

    function saveAndOpenFromSession(session, opts) {
        global.window.location.href = '../catalogues/mangaplay.html?src=local';
        return session;
    }

    global.window.LocalMediaAdapters.manga = { open: open, restore: restore };
}(typeof window !== 'undefined' ? window : undefined));
