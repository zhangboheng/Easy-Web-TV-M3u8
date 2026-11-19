// Static regression checks for the local media library feature.
// Run with: node docs/superpowers/check-local-media.js
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..', '..');
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8');
const exists = (rel) => fs.existsSync(path.join(root, rel));
const failures = [];
function check(condition, message) {
    if (!condition) failures.push(message);
}

// Returns true when the given language block of a JS dictionary object
// contains `key` (the block ends at the next sibling language or `};`).
function langBlockHas(src, lang, key) {
    const start = src.search(new RegExp('\\n\\s*' + lang + '\\s*:\\s*\\{'));
    if (start < 0) return false;
    const rest = src.slice(start + 1);
    const end = rest.search(/\n\s{0,12}\}\s*(,|\n\s*\}\s*;)/);
    const block = end < 0 ? rest : rest.slice(0, end);
    return block.indexOf(key) >= 0;
}

const coreRel = 'js/local-media-core.js';
check(exists(coreRel), 'js/local-media-core.js is missing');

if (exists(coreRel)) {
    const core = read(coreRel);
    check(/window\.LocalMediaCore\s*=/.test(core), 'core does not expose window.LocalMediaCore');
    check(/\.txt['"][\s\S]{0,120}\.md['"][\s\S]{0,120}\.markdown['"]/.test(core), 'novel format map incomplete');
    check(/\.jpg['"][\s\S]{0,160}\.jpeg['"][\s\S]{0,160}\.png['"][\s\S]{0,160}\.webp['"][\s\S]{0,160}\.gif['"][\s\S]{0,160}\.avif['"]/.test(core), 'manga format map incomplete');
    check(/\.mp3['"][\s\S]{0,200}\.m4a['"][\s\S]{0,200}\.aac['"][\s\S]{0,200}\.ogg['"][\s\S]{0,200}\.oga['"][\s\S]{0,200}\.wav['"][\s\S]{0,200}\.flac['"]/.test(core), 'audio format map incomplete');
    check(/\.mp4['"][\s\S]{0,180}\.webm['"][\s\S]{0,180}\.ogv['"][\s\S]{0,180}\.m4v['"][\s\S]{0,180}\.mov['"]/.test(core), 'video format map incomplete');
    check(/MAX_ENTRIES:\s*10000/.test(core), 'MAX_ENTRIES limit missing');
    check(/MAX_DEPTH:\s*12/.test(core), 'MAX_DEPTH limit missing');
    check(/YIELD_EVERY:\s*500/.test(core), 'YIELD_EVERY limit missing');
    check(/showDirectoryPicker/.test(core), 'File System Access API path missing');
    check(/webkitdirectory/.test(core), 'webkitdirectory fallback missing');
    check(/createObjectURL/.test(core), 'object URL support missing');
    check(/revokeObjectURL/.test(core), 'object URL release missing');
    check(/easy-web-tv-local-media/.test(core), 'IndexedDB database name missing');
    check(/['"]handles['"]/.test(core) && /['"]progress['"]/.test(core), 'IndexedDB stores missing');
    check(!/createObjectStore\(['"][^'"]*text/.test(core), 'core must not create a text-cache store');
}

const mediaJs = [
    'js/local-media-core.js',
    'js/local-novel.js',
    'js/local-manga.js',
    'js/local-music.js',
    'js/local-video.js'
].filter(exists);

for (const rel of mediaJs) {
    const src = read(rel);
    check(!/\bfetch\s*\(/.test(src), rel + ' must not call fetch');
    check(!/XMLHttpRequest/.test(src), rel + ' must not use XMLHttpRequest');
    check(!/\.upload\b/.test(src), rel + ' must not upload file bodies');
}

const stableIdSource = exists(coreRel) ? read(coreRel) : '';
check(!/blob:/.test(stableIdSource.split('createStableFileId')[1] || ''), 'stable IDs must not contain object URLs');

// Task 2: Novel local source and reader
const novelAdapterRel = 'js/local-novel.js';
check(exists(novelAdapterRel), 'js/local-novel.js is missing');
const toNovel = exists('js/tonovel.js') ? read('js/tonovel.js') : '';
const novelJs = exists('js/novel.js') ? read('js/novel.js') : '';
const novelListHtml = exists('routes/novel.html') ? read('routes/novel.html') : '';
const novelPlayHtml = exists('catalogues/novelplay.html') ? read('catalogues/novelplay.html') : '';
// Tab-based local entry: the source dropdown must no longer expose local; tabs carry it instead.
check(!/\blocal:\s*\{/.test(toNovel), 'novel source dropdown still exposes the local option');
check(!/currentSource === 'local'/.test(toNovel), 'novel list still special-cases the local source');
check(/data-tab="local"/.test(novelListHtml), 'novel page has no local tab');
check(/id="localPanel"/.test(novelListHtml), 'novel page has no local tab panel');
check(/localNovelFolderBtn/.test(novelListHtml), 'novel local tab has no folder button');
check(/LocalMediaAdapters\.novel/.test(toNovel), 'novel list does not call the local adapter');
check(/src=local/.test(novelAdapterRel && exists(novelAdapterRel) ? read(novelAdapterRel) : ''), 'novel adapter does not open src=local');
check(/local-media-core\.js/.test(novelListHtml) && /local-novel\.js/.test(novelListHtml), 'novel list HTML lacks local script includes');
check(/local-media-core\.js/.test(novelPlayHtml) && /local-novel\.js/.test(novelPlayHtml), 'novel reader HTML lacks local script includes');
check(/local/.test(novelJs) && /findLocalNovelFile\(/.test(novelJs), 'novel reader has no local source branch');
check(/getProgress\(/.test(novelJs) && /saveProgress\(/.test(novelJs), 'novel reader lacks progress helpers');
check(!/fetchWithProxy\([^)]*url/.test(novelJs.split('source === \'local\'')[1] || novelJs), 'local novel branch must not proxy-fetch chapter content');

// Task 3: Manga local source and reader
const mangaAdapterRel = 'js/local-manga.js';
check(exists(mangaAdapterRel), 'js/local-manga.js is missing');
const toManga = exists('js/tomanga.js') ? read('js/tomanga.js') : '';
const mangaJs = exists('js/manga.js') ? read('js/manga.js') : '';
const mangaListHtml = exists('routes/manga.html') ? read('routes/manga.html') : '';
const mangaPlayHtml = exists('catalogues/mangaplay.html') ? read('catalogues/mangaplay.html') : '';
check(!/\blocal:\s*\{/.test(toManga), 'manga source dropdown still exposes the local option');
check(!/currentSource === 'local'/.test(toManga), 'manga list still special-cases the local source');
check(/data-tab="local"/.test(mangaListHtml), 'manga page has no local tab');
check(/id="localPanel"/.test(mangaListHtml), 'manga page has no local tab panel');
check(/localMangaFolderBtn/.test(mangaListHtml), 'manga local tab has no folder button');
check(/LocalMediaAdapters\.manga/.test(toManga), 'manga list does not call the local adapter');
check(/src=local/.test(exists(mangaAdapterRel) ? read(mangaAdapterRel) : ''), 'manga adapter does not open src=local');
check(/local-media-core\.js/.test(mangaListHtml) && /local-manga\.js/.test(mangaListHtml), 'manga list HTML lacks local script includes');
check(/local-media-core\.js/.test(mangaPlayHtml) && /local-manga\.js/.test(mangaPlayHtml), 'manga reader HTML lacks local script includes');
check(/localMediaManga|local source/.test(mangaJs), 'manga reader has no local source branch');
check(/getProgress\(/.test(mangaJs) && /saveProgress\(/.test(mangaJs), 'manga reader lacks progress helpers');
check(/getObjectUrl\(/.test(mangaJs), 'manga reader must use object URLs for local images');

// Task 4: Music local tab and playlist
const musicAdapterRel = 'js/local-music.js';
check(exists(musicAdapterRel), 'js/local-music.js is missing');
const toMusic = exists('js/tomusic.js') ? read('js/tomusic.js') : '';
const musicListHtml = exists('routes/music.html') ? read('routes/music.html') : '';
check(/data-tab="local"/.test(musicListHtml), 'music page has no local tab');
check(/id="local"/.test(musicListHtml), 'music page has no local tab content');
check(/\.header-right\s*\{[^}]*min-width:\s*\d+px/.test(musicListHtml), 'music header-right lacks min-width so tabs shift when the local tab hides both search boxes');
check(/local-media-core\.js/.test(musicListHtml) && /local-music\.js/.test(musicListHtml), 'music page lacks local script includes');
// Music local tab must reuse the shared structure used by novel/manga/theater:
// .local-tab-inner wrapper + static .local-media-panel card with action buttons.
check(/class="local-tab-inner"/.test(musicListHtml), 'music local tab lacks the shared .local-tab-inner wrapper');
check(/localMusicFolderBtn/.test(musicListHtml), 'music local tab has no folder button');
check(/localMusicFilesBtn/.test(musicListHtml), 'music local tab has no files button');
check(/local-media-actions/.test(musicListHtml), 'music local tab lacks shared action button styles');
check(!/local-music-panel/.test(musicListHtml), 'music local tab still uses the bespoke .local-music-panel wrapper');
check(!/mountPicker/.test(toMusic), 'music page should bind static buttons like the other local tabs instead of mountPicker');
check(/localMusicFolderBtn/.test(toMusic) && /LocalMediaAdapters\.music\.open/.test(toMusic), 'music list does not bind local buttons to the adapter');
check(/opts\.mode === 'files'/.test(exists(musicAdapterRel) ? read(musicAdapterRel) : ''), 'music adapter ignores the picker mode');
check(/function restore\(/.test(exists(musicAdapterRel) ? read(musicAdapterRel) : ''), 'music adapter has no restore entry');
check(/LocalMediaAdapters\.music/.test(toMusic), 'music page does not call local adapter');
check(/song\.file|song\.localUrl/.test(toMusic), 'music player does not handle local files');
check(/getObjectUrl\(/.test(exists(musicAdapterRel) ? read(musicAdapterRel) : ''), 'music adapter lacks object URL lifecycle');

// Task 5: Video local source and playlist
const videoAdapterRel = 'js/local-video.js';
check(exists(videoAdapterRel), 'js/local-video.js is missing');
const toVideo = exists('js/tocomprehensive.js') ? read('js/tocomprehensive.js') : '';
const comprehensiveJs = exists('js/comprehensive.js') ? read('js/comprehensive.js') : '';
const theaterHtml = exists('routes/comprehensive.html') ? read('routes/comprehensive.html') : '';
const videoPlayHtml = exists('catalogues/complay.html') ? read('catalogues/complay.html') : '';
check(/LocalMediaAdapters\.video/.test(toVideo), 'theater page does not call local video adapter');
check(!/local-video-card/.test(toVideo), 'theater page still injects the local files card into the grid');
check(/data-tab="local"/.test(theaterHtml), 'theater page has no local tab');
check(/id="localPanel"/.test(theaterHtml), 'theater page has no local tab panel');
check(/localVideoFolderBtn/.test(theaterHtml), 'theater local tab has no folder button');

// Tab switching must reserve header-right space (visibility), not collapse it (display),
// otherwise the header tab-nav shifts position when toggling Online/Local.
['js/tonovel.js', 'js/tomanga.js', 'js/tocomprehensive.js'].forEach(function (rel) {
    const src = exists(rel) ? read(rel) : '';
    check(!/headerRight\.style\.display/.test(src), rel + ' collapses header-right with display:none (tabs shift)');
    check(/headerRight\.style\.visibility/.test(src), rel + ' does not reserve header-right space via visibility');
});
check(/local-media-core\.js/.test(theaterHtml) && /local-video\.js/.test(theaterHtml), 'theater page lacks local script includes');
check(/local-media-core\.js/.test(videoPlayHtml) && /local-video\.js/.test(videoPlayHtml), 'video player page lacks local script includes');
check(/src=local/.test(exists(videoAdapterRel) ? read(videoAdapterRel) : ''), 'video adapter does not open src=local');
check(/localMediaVideo|local source/.test(comprehensiveJs), 'video player has no local source branch');
check(/getObjectUrl\(/.test(comprehensiveJs), 'video player must use object URLs for local files');
check(/getProgress\(/.test(comprehensiveJs) && /saveProgress\(/.test(comprehensiveJs), 'video player lacks progress helpers');

// Tab labels must follow the UI language (no hardcoded bilingual/English text).
// Each page JS must translate elements carrying data-i18n-tab / data-i18n-text.
['js/tonovel.js', 'js/tomanga.js', 'js/tomusic.js', 'js/tocomprehensive.js'].forEach(function (rel) {
    const src = exists(rel) ? read(rel) : '';
    check(/LOCAL_I18N/.test(src), rel + ' lacks LOCAL_I18N tab translations');
    check(/data-i18n-tab/.test(src), rel + ' does not translate tab labels');
});

// Empty-state messages must follow the page language, not hardcoded English.
const localEmptyKeys = {
    'js/tonovel.js': 'noTextFiles',
    'js/tomanga.js': 'noImageFiles',
    'js/tomusic.js': 'noAudioFiles',
    'js/tocomprehensive.js': 'noVideoFiles'
};
Object.keys(localEmptyKeys).forEach(function (rel) {
    const src = exists(rel) ? read(rel) : '';
    const key = localEmptyKeys[rel];
    check(src.indexOf(key) >= 0, rel + ' lacks ' + key + ' empty-state message');
    check(new RegExp("onEmpty\\s*:[\\s\\S]{0,160}localT\\('" + key + "'\\)").test(src),
        rel + ' empty-state message is not localized via localT');
    check(/localT\(mode === 'files'/.test(src), rel + ' choosing-state message is not localized');
    check(/localT\('notLoaded'\)/.test(src), rel + ' not-loaded message is not localized');
    check(/'ja', 'ko', 'fr', 'de', 'es', 'ru'/.test(src),
        rel + ' localLang does not normalize the route-page UI languages');
    ['ja', 'ko', 'fr', 'de', 'es', 'ru'].forEach(function (lang) {
        check(langBlockHas(src, lang, key), rel + ' lacks ' + lang + ' translation for ' + key);
    });
    check(/window\.LocalMediaI18N/.test(src), rel + ' does not merge the shared i18n dictionary');
});

// The shared dictionary must cover every panel label in all eight languages.
const sharedRel = 'js/local-media-i18n.js';
const sharedSrc = exists(sharedRel) ? read(sharedRel) : '';
check(sharedSrc.length > 0, 'shared local media i18n module missing');
['zh', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru'].forEach(function (lang) {
    ['tabOnline', 'tabLocal', 'chooseFolder', 'chooseFiles', 'restoreFolder',
     'choosingFiles', 'choosingFolder', 'restoringFolder', 'noSavedFolder',
     'permDenied', 'pickIntro', 'pickIntroNoDir', 'notLoaded'].forEach(function (key) {
        check(langBlockHas(sharedSrc, lang, key), sharedRel + ' lacks ' + lang + '.' + key);
    });
});
['noAudioFiles', 'noTextFiles', 'noImageFiles', 'noVideoFiles', 'songsReady']
    .forEach(function (key) {
        check(sharedSrc.indexOf(key) >= 0, sharedRel + ' lacks ' + key);
    });
check(!/No supported audio files found/.test(exists('js/local-music.js') ? read('js/local-music.js') : ''),
    'music adapter hardcodes the empty-state message');

// The "N local song(s) ready." status must come from the page, localized.
const musicPageSrc = exists('js/tomusic.js') ? read('js/tomusic.js') : '';
const musicAdapterSrc = exists('js/local-music.js') ? read('js/local-music.js') : '';
check(/songsReady/.test(musicPageSrc), 'js/tomusic.js lacks the songsReady message');
check(/onReady\s*:/.test(musicPageSrc), 'js/tomusic.js does not pass onReady to the adapter');
check(/opts\.onReady/.test(musicAdapterSrc), 'js/local-music.js does not forward onReady');
check(!/local song\(s\) ready/.test(musicAdapterSrc), 'music adapter hardcodes the ready message');
['ja', 'ko', 'fr', 'de', 'es', 'ru'].forEach(function (lang) {
    check(langBlockHas(musicPageSrc, lang, 'songsReady'),
        'js/tomusic.js lacks ' + lang + ' translation for songsReady');
});

// The shared picker i18n in the core must cover all eight UI languages too.
const coreSrcForI18n = exists(coreRel) ? read(coreRel) : '';
['zh', 'en', 'ja', 'ko', 'fr', 'de', 'es', 'ru'].forEach(function (lang) {
    ['pickFiles', 'pickFolder', 'restoreFolder', 'noSavedFolder', 'permDenied',
     'introDir', 'introAny', 'unsupported', 'supportedFrom', 'localFiles'].forEach(function (key) {
        check(langBlockHas(coreSrcForI18n, lang, key),
            'js/local-media-core.js PICKER_I18N lacks ' + lang + '.' + key);
    });
});
check(!/\|\| 'local files'\)/.test(coreSrcForI18n), 'core fallback "local files" is hardcoded English');
['routes/novel.html', 'routes/manga.html', 'routes/music.html', 'routes/comprehensive.html'].forEach(function (rel) {
    const html = exists(rel) ? read(rel) : '';
    check(!/Online \/ 在线|Local \/ 本地|Movies \/ 在线/.test(html), rel + ' hardcodes bilingual tab labels');
    check(/data-i18n-tab="tabLocal"/.test(html), rel + ' tab-local lacks data-i18n-tab');
    check((html.match(/data-i18n-tab=/g) || []).length >= 2, rel + ' has untranslated tab labels');
    // The shared dictionary must load after the core and before the page script.
    const coreIdx = html.indexOf('local-media-core.js');
    const i18nIdx = html.indexOf('local-media-i18n.js');
    const pageIdx = html.search(/to(novel|manga|music|comprehensive)\.js/);
    check(i18nIdx >= 0, rel + ' does not load js/local-media-i18n.js');
    check(coreIdx >= 0 && i18nIdx > coreIdx, rel + ' loads the shared i18n before the core');
    check(pageIdx > i18nIdx, rel + ' loads the shared i18n after the page script');
});
check(!/>Local<\s*<\/div>/.test(musicListHtml), 'music local tab label is hardcoded English');

// Task 6: styles and final coverage
const css = exists('css/main.css') ? read('css/main.css') : '';
check(/\.local-media-panel/.test(css), 'shared local media panel styles missing');
check(/\.local-media-actions/.test(css), 'shared local media action styles missing');
check(/\.local-media-status/.test(css), 'shared local media status styles missing');
check(/\.local-media-list/.test(css), 'shared local media list styles missing');
check(/\.local-media-unsupported/.test(css), 'shared unsupported styles missing');
check(/\.tab-btn\s*\{/.test(css), 'shared header tab button styles missing');

const coverage = [
    ['novel', novelAdapterRel, novelJs],
    ['manga', mangaAdapterRel, mangaJs],
    ['music', musicAdapterRel, toMusic],
    ['video', videoAdapterRel, comprehensiveJs]
];
coverage.forEach(function (row) {
    const label = row[0];
    const adapterSource = exists(row[1]) ? read(row[1]) : '';
    check(/open/.test(adapterSource), label + ' adapter has no open method');
    check(/local/i.test(adapterSource + row[2]), label + ' has no local marker');
    check(/progress/i.test(adapterSource + row[2]), label + ' has no progress handling');
    check(/unsupported/i.test(adapterSource + row[2]) || /local-media-unsupported/.test(css), label + ' has no unsupported handling');
});

const sw = exists('sw.js') ? read('sw.js') : '';
check(!/blob:/.test(sw), 'service worker must not cache blob URLs');
check(!/local-media/i.test(sw), 'service worker must not special-case local media');

if (failures.length) {
    failures.forEach((m) => console.log('FAIL: ' + m));
    console.log('FAIL');
    process.exit(1);
}
console.log('ALL OK');
