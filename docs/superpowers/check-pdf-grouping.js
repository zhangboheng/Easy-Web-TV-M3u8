// Verify PDF grouping + staged-file resolution without a browser.
const fs = require('fs');
const path = require('path');
const ROOT = '/Users/bohengzhang/Documents/GitHub/Easy-Web-TV-M3u8';
let pass = 0, fail = 0;
function eq(actual, expected, label) {
    if (JSON.stringify(actual) === JSON.stringify(expected)) { pass++; }
    else { fail++; console.log('FAIL: ' + label + '\n  got: ' + JSON.stringify(actual) + '\n  want: ' + JSON.stringify(expected)); }
}
function ok(cond, label) { if (cond) pass++; else { fail++; console.log('FAIL: ' + label); } }

// ---- Load local-media-core.js in a fake window ----
const coreSrc = fs.readFileSync(path.join(ROOT, 'js/local-media-core.js'), 'utf8');
global.window = global;
global.document = { createElement: () => ({ addEventListener() {}, click() {} }) };
global.localStorage = { getItem: () => null, setItem() {} };
global.sessionStorage = { getItem: () => null, setItem() {} };
global.File = class File {
    constructor(parts, name, opts) {
        this.name = name;
        this.size = 1;
        this.lastModified = (opts && opts.lastModified) || 0;
    }
};
global.URL = { createObjectURL: () => 'blob:x', revokeObjectURL() {} };
new Function(coreSrc)();
const core = global.window.LocalMediaCore;
ok(!!core, 'core must load');

function entries(list) {
    return list.map((p) => {
        const name = p.split('/').pop();
        return {
            id: 'local:root|' + p + '|' + name + '|1|1',
            file: new File(['x'], name),
            name, path: p, rootName: 'root',
            category: 'manga',
            size: 1, lastModified: 1
        };
    });
}

// ---- Load local-manga.js with a storage shim ----
const mangaSrc = fs.readFileSync(path.join(ROOT, 'js/local-manga.js'), 'utf8');
let savedSession = null;
global.sessionStorage = {
    getItem: () => (savedSession ? JSON.stringify(savedSession) : null),
    setItem: (k, v) => { savedSession = JSON.parse(v); }
};
global.window.location = { href: '' };
global.window.LocalMediaCore = core;
global.window.LocalMediaAdapters = {};
new Function(mangaSrc)();
const adapter = global.window.LocalMediaAdapters.manga;
ok(!!adapter && typeof adapter.open === 'function', 'manga adapter must load');

// A browser with IndexedDB stages every entry successfully.
function stageOk(result) {
    return Promise.resolve({ staged: result.entries.map(e => e.id), skipped: [], error: null });
}

// ---- Case 1: several PDFs in ONE folder must each become a chapter ----
(async () => {
    const pdfs = {
        rootName: 'root', cancelled: false, handle: null,
        entries: entries(['Novels/vol1.pdf', 'Novels/vol2.pdf', 'Novels/vol3.pdf'])
    };
    core.pickFiles = () => Promise.resolve(pdfs);
    core.stageEntries = () => stageOk(pdfs);
    await adapter.open({ mode: 'files' });
    ok(savedSession, 'files mode must save a session');
    eq(savedSession.groups.length, 3, 'three PDFs in one folder must produce three chapters');
    eq(savedSession.groups.map(g => g.name), ['vol1', 'vol2', 'vol3'],
        'each chapter must be titled by its PDF file name');
    ok(savedSession.groups.every(g => g.entries.length === 1),
        'each PDF chapter must hold exactly one entry');
    eq(savedSession.filesMode, true, 'session must record files mode');
    eq(savedSession.resumable, true, 'a staged files session must be resumable');

    // ---- Case 2: images still group by folder, PDFs split out ----
    const mixed = {
        rootName: 'root', cancelled: false, handle: null,
        entries: entries([
            'Comic/ch01/001.jpg', 'Comic/ch01/002.jpg',
            'Comic/ch02/001.jpg',
            'Comic/extra.pdf'
        ])
    };
    savedSession = null;
    core.pickFiles = () => Promise.resolve(mixed);
    core.stageEntries = () => stageOk(mixed);
    await adapter.open({ mode: 'files' });
    eq(savedSession.groups.length, 3, 'two image folders plus one PDF must give three chapters');
    const names = savedSession.groups.map(g => g.name);
    ok(names.indexOf('Comic/ch01') !== -1, 'image folder ch01 must keep its folder name');
    ok(names.indexOf('Comic/ch02') !== -1, 'image folder ch02 must keep its folder name');
    ok(names.indexOf('extra') !== -1, 'the PDF must be titled by file name');
    const ch01 = savedSession.groups.find(g => g.name === 'Comic/ch01');
    eq(ch01.entries.length, 2, 'ch01 must keep both images together');
    const firstIds = savedSession.groups.map(g => g.id);

    // ---- Case 3: group ids are stable across re-picks ----
    savedSession = null;
    core.pickFiles = () => Promise.resolve(mixed);
    core.stageEntries = () => stageOk(mixed);
    await adapter.open({ mode: 'files' });
    eq(savedSession.groups.map(g => g.id), firstIds, 'group ids must be stable across re-picks');

    // ---- Case 4: resolveEntries must use staged files when there is no handle ----
    const metas = [{ id: 'stage-1', name: 'a.pdf', path: 'a.pdf', size: 1, lastModified: 1 }];
    const stagedEntry = { id: 'stage-1', file: new File(['x'], 'a.pdf'), name: 'a.pdf', path: 'a.pdf', size: 1, lastModified: 1 };
    const resolved = await core.resolveEntries(metas, { category: 'manga' }, {
        getHandle: () => Promise.resolve(null),
        requestHandlePermission: () => Promise.resolve(true),
        scanHandle: () => { throw new Error('must not scan when staging works'); },
        readStagedEntries: () => Promise.resolve({ entries: [stagedEntry], missing: [] })
    });
    eq(resolved.error, null, 'staged files must resolve without a directory handle');
    eq(resolved.entries.length, 1, 'staged resolution must return the entry');
    ok(/\.pdf$/.test(resolved.entries[0].name), 'staged entry must keep its name');

    // ---- Case 5: no stage + no handle must still report a clear error ----
    const noHandle = await core.resolveEntries(metas, { category: 'manga' }, {
        getHandle: () => Promise.resolve(null),
        requestHandlePermission: () => Promise.resolve(true),
        scanHandle: () => { throw new Error('must not scan'); },
        readStagedEntries: () => Promise.resolve({ entries: [], missing: metas })
    });
    ok(typeof noHandle.error === 'string', 'missing stage and handle must report an error');
    eq(noHandle.entries.length, 0, 'missing stage and handle must return no entries');

    // ---- Case 6: a single PDF picked alone must open as one chapter ----
    const single = {
        rootName: 'root', cancelled: false, handle: null,
        entries: entries(['book.pdf'])
    };
    savedSession = null;
    core.pickFiles = () => Promise.resolve(single);
    core.stageEntries = () => stageOk(single);
    await adapter.open({ mode: 'files' });
    eq(savedSession.groups.length, 1, 'a single PDF must produce exactly one chapter');
    eq(savedSession.groups[0].name, 'book', 'the single-PDF chapter must drop the extension');

    // ---- Case 7: an unstorable pick must not open the reader ----
    savedSession = null;
    let stageFailedReason = null;
    core.pickFiles = () => Promise.resolve(single);
    core.stageEntries = () => Promise.resolve({
        staged: [], skipped: [{ id: 'x', reason: 'file is too large to stage' }],
        error: 'Selected files are too large to keep in this browser'
    });
    await adapter.open({
        mode: 'files',
        onStageFailed: function (stage) { stageFailedReason = stage.error; }
    });
    eq(savedSession, null, 'an unstorable pick must not save a session');
    ok(typeof stageFailedReason === 'string', 'an unstorable pick must report a reason');

    // ---- Case 8: restore() must reopen a staged files session ----
    // (local-manga/novel/video must all handle files mode, not only handles.)
    ['js/local-manga.js', 'js/local-novel.js', 'js/local-video.js'].forEach(function (rel) {
        var src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
        ok(/readStagedSession\('?\)?|function readStagedSession/.test(src) ||
            /filesMode && Array\.isArray/.test(src),
            rel + ' restore() must fall back to a staged session');
    });

    // ---- Case 9: stage failures must expose a translatable reason code ----
    ['js/tomanga.js', 'js/tonovel.js', 'js/tocomprehensive.js'].forEach(function (rel) {
        var src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
        ok(/onStageFailed/.test(src), rel + ' must handle onStageFailed');
        ok(/stageNoStorage/.test(src), rel + ' must translate the storage-unavailable case');
    });

    // ---- Case 10: PDF page images must be released ----
    var mangaSrc = fs.readFileSync(path.join(ROOT, 'js/manga.js'), 'utf8');
    ok(/pdfObjectUrls/.test(mangaSrc), 'manga.js must track PDF page object URLs');
    ok(/revokeObjectURL/.test(mangaSrc), 'manga.js must revoke PDF page object URLs');
    ok(/releasePdfObjectUrls\(\)/.test(mangaSrc), 'manga.js must call releasePdfObjectUrls');
    ok(/doc\.destroy/.test(mangaSrc), 'manga.js must destroy the pdf.js document');

    // ---- Case 11: partial staging must fail loudly, not open a broken reader ----
    var coreSrc = fs.readFileSync(path.join(ROOT, 'js/local-media-core.js'), 'utf8');
    ok(/partialTooLarge/.test(coreSrc), 'core must expose a partialTooLarge reason');
    ok(/if \(skipped\.length\)/.test(coreSrc), 'core must treat a partial stage as a failure');

    // ---- Case 12: clearing staged files must not wipe other categories ----
    ok(/key\.indexOf\(prefix\) === 0/.test(coreSrc), 'clearStagedEntries must scope deletes to its category');
    ok(/if \(!category\) \{\s*\n\s*store\.clear\(\)/.test(coreSrc),
        'clearStagedEntries keeps a full wipe only for an explicit no-category call');

    // ---- Case 13: restore() must verify the staged bodies still exist ----
    ['js/local-manga.js', 'js/local-novel.js', 'js/local-video.js'].forEach(function (rel) {
        var src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
        ok(/function stagedEntriesAvailable/.test(src),
            rel + ' must check staged bodies before navigating');
        ok(/stagedEntriesAvailable\(staged\)/.test(src),
            rel + ' must call the staged-body check in restore()');
    });

    // ---- Case 14: IDB plumbing must not lie about success ----
    ok(/tx\.onabort = function \(\) \{ resolve\(null\); \}/.test(coreSrc),
        'withStore must resolve to null when a transaction aborts (quota)');
    ok(/function withStoreResult/.test(coreSrc),
        'core must distinguish a failed read from a missing row');
    ok(/reason: 'writeFailed'/.test(coreSrc),
        'stageEntries must report a quota-aborted write as writeFailed');
    ok(/read\.failed \? undefined : read\.value/.test(coreSrc),
        'getProgress must return undefined, not the IDBRequest object');
    ok(/read\.failed \|\| read\.value === undefined \? null/.test(coreSrc),
        'getHandle must return null, not the IDBRequest object');
    ok(/var dbPromise = null/.test(coreSrc),
        'core must cache one IndexedDB connection instead of one per entry');
    ok(/onblocked = function/.test(coreSrc),
        'openDb must not hang forever on a blocked upgrade');

    // ---- Case 15: every language must carry the stage-failure copy ----
    var i18nSrc = fs.readFileSync(path.join(ROOT, 'js/local-media-i18n.js'), 'utf8');
    ['stageFailed', 'stageNoStorage', 'stageWriteFailed'].forEach(function (key) {
        var hits = (i18nSrc.match(new RegExp(key + ':', 'g')) || []).length;
        eq(hits, 8, key + ' must exist in all 8 languages (found ' + hits + ')');
    });

    // ---- Case 16: failure reasons must map to localized keys ----
    ['js/tomanga.js', 'js/tonovel.js', 'js/tocomprehensive.js'].forEach(function (rel) {
        var src = fs.readFileSync(path.join(ROOT, rel), 'utf8');
        ok(/function stageStatusKey/.test(src), rel + ' must map stage reasons to i18n keys');
        ok(/stageWriteFailed/.test(src), rel + ' must translate the write-failure case');
    });

    console.log('\n' + pass + ' passed, ' + fail + ' failed');
    process.exit(fail ? 1 : 0);
})();