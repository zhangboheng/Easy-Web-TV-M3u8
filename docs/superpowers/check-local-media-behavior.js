// Behavioral regression tests for the local media library fixes.
// Run with: node docs/superpowers/check-local-media-behavior.js
//
// Behavior tests: load js/local-media-core.js into a sandbox and assert the
// observable contract of each fixed defect. They must fail before the fix.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..', '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');

const failures = [];
let passed = 0;
function check(condition, message) {
    if (condition) passed++;
    else failures.push(message);
}
function eq(actual, expected, message) {
    check(actual === expected,
        message + ' (expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual) + ')');
}

// Load the core into a minimal browser sandbox so window.LocalMediaCore exists.
function loadCore() {
    const sandbox = {
        document: { createElement: () => ({}) },
        console: console,
        setTimeout: setTimeout,
        URL: { createObjectURL: () => 'blob:fake', revokeObjectURL: () => {} },
        addEventListener: () => {}
    };
    sandbox.window = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(read('js/local-media-core.js'), sandbox);
    return sandbox.window.LocalMediaCore;
}

const core = loadCore();
check(!!core, 'core did not expose window.LocalMediaCore');
// ---- Defect 1: stale sessionStorage must not hijack online playback --------
// Source selection must depend on the URL only, never on stored session state.
eq(core.isLocalSource('?web=https%3A%2F%2Farchive.org&tab=x'), false,
    'online URL must not be treated as a local source');
eq(core.isLocalSource('?src=local'), true, 'src=local must select the local source');
eq(core.isLocalSource(''), false, 'empty search must not select the local source');
eq(core.isLocalSource('?src=local&web=https://archive.org'), true, 'src=local wins over web=');

const comprehensiveSrc = read('js/comprehensive.js');
check(/isLocalSource\(/.test(comprehensiveSrc),
    'comprehensive.js must branch on core.isLocalSource');
check(!/if \(getLocalVideoSession\(\)\) \{/.test(comprehensiveSrc),
    'comprehensive.js must not branch on getLocalVideoSession()');

// ---- Defect 2: resolving N files must scan the folder exactly once --------
function makeMeta(count, category) {
    const ext = category === 'audio' ? '.mp3' : category === 'novel' ? '.txt' : '.png';
    const list = [];
    for (let i = 1; i <= count; i++) {
        const name = i + ext;
        list.push({
            id: 'local:root|' + name + '|' + name + '|1|1',
            name: name, path: name, size: 1, lastModified: 1
        });
    }
    return list;
}

function fakeDeps(meta) {
    const calls = { getHandle: 0, permission: 0, scan: 0 };
    const handle = {
        kind: 'directory',
        name: 'root',
        values: async function* () {
            for (const m of meta) {
                yield {
                    kind: 'file',
                    name: m.name,
                    getFile: async function () {
                        return new File(['x'], m.name, { lastModified: 1 });
                    }
                };
            }
        }
    };
    return {
        calls: calls,
        deps: {
            getHandle: function () { calls.getHandle++; return Promise.resolve({ handle: handle, rootName: 'root' }); },
            requestHandlePermission: function () { calls.permission++; return Promise.resolve(true); },
            scanHandle: function (h, opts) { calls.scan++; return core.scanHandle(h, opts); }
        }
    };
}

async function runAsyncChecks() {
    const meta = makeMeta(10, 'manga');
    const fixture = fakeDeps(meta);
    const resolved = await core.resolveEntries(meta, { category: 'manga', handleKey: 'manga' }, fixture.deps);
    eq(resolved.entries.length, 10, 'resolveEntries must return every resolved entry');
    eq(resolved.error, null, 'resolveEntries must report no error on success');
    eq(fixture.calls.scan, 1, 'resolveEntries must scan the folder exactly once for N files');
    eq(fixture.calls.getHandle, 1, 'resolveEntries must read the saved handle once');
    eq(fixture.calls.permission, 1, 'resolveEntries must request permission once');

    const missing = await core.resolveEntries(meta, { category: 'manga' }, {
        getHandle: function () { return Promise.resolve(null); },
        requestHandlePermission: function () { return Promise.resolve(true); },
        scanHandle: function () { throw new Error('must not scan'); }
    });
    eq(missing.entries.length, 0, 'resolveEntries must return no entries without a saved handle');
    eq(typeof missing.error, 'string', 'resolveEntries must report an error without a saved handle');

    const denied = await core.resolveEntries(meta, { category: 'manga' }, {
        getHandle: function () { return Promise.resolve({ handle: {} }); },
        requestHandlePermission: function () { return Promise.resolve(false); },
        scanHandle: function () { throw new Error('must not scan'); }
    });
    eq(typeof denied.error, 'string', 'resolveEntries must report an error when permission is denied');

    ['js/manga.js', 'js/novel.js', 'js/comprehensive.js'].forEach(function (rel) {
        check(/resolveEntries\(/.test(read(rel)), rel + ' must use core.resolveEntries');
    });
    check(!/for \(const entry of chapter\.localEntries\)/.test(read('js/manga.js')),
        'manga.js must not resolve images one-by-one in a loop');

    // ---- Defect 3: progress writes must be throttled -----------------------
    check(typeof core.createProgressThrottler === 'function',
        'core must expose createProgressThrottler');

    let writes = 0;
    let clock = 1000;
    const throttler = core.createProgressThrottler({
        minIntervalMs: 5000,
        now: function () { return clock; },
        save: function () { writes++; }
    });
    for (let i = 0; i < 20; i++) {
        clock += 100;
        throttler.push('id', { time: i });
    }
    eq(writes, 1, 'throttler must collapse rapid progress writes');
    clock += 5000;
    throttler.push('id', { time: 99 });
    eq(writes, 2, 'throttler must write again after the interval elapses');
    throttler.push('id', { time: 100 });   // no time passed -> stays pending
    eq(writes, 2, 'throttler must keep the value pending inside the interval');
    throttler.flush();
    eq(writes, 3, 'flush must persist the pending value');

    check(/createProgressThrottler\(/.test(read('js/comprehensive.js')),
        'comprehensive.js must throttle video progress writes');
    check(/createProgressThrottler\(/.test(read('js/tomusic.js')),
        'tomusic.js must throttle audio progress writes');

    // ---- Defect 4: page scripts must guard LocalMediaCore ------------------
    check(/function hasLocalMediaCore|window\.LocalMediaCore\s*&&/.test(comprehensiveSrc),
        'comprehensive.js must guard window.LocalMediaCore usage');

    // ---- Defect 7: local video MIME must follow the extension --------------
    eq(core.mimeForVideoFile('a.webm'), 'video/webm', 'webm must map to video/webm');
    eq(core.mimeForVideoFile('a.ogv'), 'video/ogg', 'ogv must map to video/ogg');
    eq(core.mimeForVideoFile('a.mov'), 'video/quicktime', 'mov must map to video/quicktime');
    eq(core.mimeForVideoFile('a.m4v'), 'video/x-m4v', 'm4v must map to video/x-m4v');
    eq(core.mimeForVideoFile('a.mp4'), 'video/mp4', 'mp4 must map to video/mp4');
    eq(core.mimeForVideoFile('a.MP4'), 'video/mp4', 'extension matching must be case-insensitive');
    eq(core.mimeForVideoFile('a.unknown'), 'video/mp4', 'unknown extension must fall back to video/mp4');
    check(/mimeForVideoFile\(/.test(comprehensiveSrc),
        'comprehensive.js must set the local video MIME from the file name');

    // ---- Defect 9: manga chapter ids must not embed the index --------------
    eq(core.mangaGroupId('Vol1'), core.mangaGroupId('Vol1'), 'mangaGroupId must be deterministic');
    check(core.mangaGroupId('Vol1') !== core.mangaGroupId('Vol2'),
        'mangaGroupId must differ per folder');
    check(!/chapter:/.test(core.mangaGroupId('Vol1')),
        'mangaGroupId must not encode a chapter index');
    check(/mangaGroupId\(/.test(read('js/local-manga.js')),
        'local-manga.js must build group ids with core.mangaGroupId');

    // ---- Defect 5: files mode must warn that a reload needs a re-pick ------
    eq(core.isResumableOnReload({ handle: {} }), true,
        'a directory-handle session must be resumable after reload');
    eq(core.isResumableOnReload({ handle: null }), false,
        'a files-mode session must not be resumable after reload');
    eq(core.isResumableOnReload(null), false, 'a missing session must not be resumable');
    ['js/local-manga.js', 'js/local-novel.js', 'js/local-video.js'].forEach(function (rel) {
        check(/persist:|resumable|mode/.test(read(rel)), rel + ' must record whether the session can resume');
    });
    ['js/manga.js', 'js/novel.js', 'js/comprehensive.js'].forEach(function (rel) {
        check(/resumable|reloadAfterPick/.test(read(rel)), rel + ' must explain files-mode reload behaviour');
    });

    // ---- Defect 6: the advertised "Restore folder" action must be reachable --
    ['routes/music.html', 'routes/novel.html', 'routes/manga.html', 'routes/comprehensive.html']
        .forEach(function (rel) {
            check(/localRestoreBtn|data-i18n-text="restoreFolder"/.test(read(rel)),
                rel + ' must render a restore-folder control');
        });
    ['js/tomusic.js', 'js/tonovel.js', 'js/tomanga.js', 'js/tocomprehensive.js']
        .forEach(function (rel) {
            check(/restoreFolder|restore\(/.test(read(rel)),
                rel + ' must wire the restore-folder action');
        });
    ['js/local-novel.js', 'js/local-manga.js', 'js/local-video.js'].forEach(function (rel) {
        check(/function restore|restore: restore/.test(read(rel)),
            rel + ' must expose restore() like the music adapter');
    });
}
runAsyncChecks()
    .then(function () {
        if (failures.length) {
            console.error('FAILED (' + failures.length + ' of ' + (failures.length + passed) + ')');
            failures.forEach(function (f) { console.error('  FAIL: ' + f); });
            process.exit(1);
        }
        console.log('ALL BEHAVIOR CHECKS OK (' + passed + ' assertions)');
    })
    .catch(function (error) {
        console.error('HARNESS ERROR: ' + (error && error.message));
        console.error(error && error.stack);
        process.exit(1);
    });