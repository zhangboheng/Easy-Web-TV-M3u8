// Local music picker adapter. Keeps audio File objects and object URLs in memory.
(function (global) {
    'use strict';
    if (!global || !global.window) return;

    global.window.LocalMediaAdapters = global.window.LocalMediaAdapters || {};
    global.window.LocalMusic = global.window.LocalMusic || { playlist: [], selectedIndex: -1 };

    function renderLocalList(entries) {
        var list = global.document.getElementById('localSongList');
        if (!list) return;
        list.textContent = '';
        entries.forEach(function (entry) {
            var item = global.document.createElement('div');
            item.className = 'local-song-item';
            item.setAttribute('data-id', entry.id);
            item.textContent = entry.path || entry.name;
            item.addEventListener('click', function () {
                var index = global.window.LocalMusic.playlist.findIndex(function (song) { return song.id === entry.id; });
                if (index >= 0 && global.window.playSong) global.window.playSong(index);
            });
            list.appendChild(item);
        });
    }

    function loadResult(result, options) {
        if (!result || result.cancelled) return result;
        var core = global.window.LocalMediaCore;
        var opts = options || {};
        result.entries = core.sortEntries(result.entries, 'path');
        if (!result.entries.length) {
            // Adapters own no UI copy: the page supplies a localized message
            // through onEmpty (mirrors local-novel/manga/video).
            if (opts.onEmpty) opts.onEmpty(result);
            return result;
        }
        if (result.handle && core.saveHandle) core.saveHandle('music', result.handle, result.rootName);
        global.window.LocalMusic.playlist = result.entries.map(function (entry) {
            return {
                id: entry.id,
                name: entry.name,
                artistName: 'Local File',
                path: entry.path,
                file: entry.file,
                localUrl: core.getObjectUrl(entry.id, entry.file)
            };
        });
        renderLocalList(result.entries);
        // The page owns the wording so it can be localized (opts.onReady).
        if (opts.onReady) opts.onReady(global.window.LocalMusic.playlist.length);
        if (global.window.playSong) {
            global.window.LocalMusic.selectedIndex = 0;
            global.window.playSong(0);
        }
        return result;
    }

    function pickOptions(opts) {
        return {
            // File classification category is 'audio'; 'music' is only the
            // adapter/handle namespace used by saveHandle/getHandle below.
            category: 'audio',
            accept: '.mp3,.m4a,.aac,.ogg,.oga,.wav,.flac',
            rootName: 'Local music',
            onProgress: opts.onProgress
        };
    }

    function open(options) {
        var core = global.window.LocalMediaCore;
        if (!core) return Promise.reject(new Error('LocalMediaCore is not loaded'));
        var opts = options || {};
        var pick = opts.mode === 'files' ? core.pickFiles : core.pickDirectory;
        return pick(pickOptions(opts)).then(function (result) { return loadResult(result, opts); });
    }

    function restore(options) {
        var core = global.window.LocalMediaCore;
        if (!core) return Promise.reject(new Error('LocalMediaCore is not loaded'));
        var opts = options || {};
        return core.getHandle('music').then(function (saved) {
            if (!saved || !saved.handle) {
                if (opts.onEmpty) opts.onEmpty(null);
                return null;
            }
            return core.requestHandlePermission(saved.handle).then(function (allowed) {
                if (!allowed) {
                    if (opts.onDenied) opts.onDenied();
                    return null;
                }
                var scanOpts = pickOptions(opts);
                scanOpts.rootName = saved.rootName || scanOpts.rootName;
                return core.scanHandle(saved.handle, scanOpts).then(function (result) { return loadResult(result, opts); });
            });
        });
    }

    global.window.LocalMediaAdapters.music = { open: open, restore: restore, loadResult: loadResult, renderLocalList: renderLocalList };
}(typeof window !== 'undefined' ? window : undefined));
