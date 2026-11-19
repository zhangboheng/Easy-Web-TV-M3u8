/**
 * Manga Reader - public-apis sources (Jikan / xkcd)
 * Native JavaScript (No jQuery)
 *
 * Jikan provides manga metadata and official pictures (no page scans); the
 * reader presents its picture gallery as chapters. xkcd provides actual comic
 * images, one issue per chapter. MangaDex / MangaPill readers were removed.
 */

const JIKAN_API = 'https://api.jikan.moe/v4';
const XKCD_API = 'https://xkcd.com';

// State
let currentManga = null;
let currentChapter = null;
let chapters = [];
let currentPageIndex = 0;
let currentPages = [];
let mangaInfo = null;
let isScrollMode = true;
let localMangaSession = null;
let localMangaFiles = {};
// Object URLs created for rendered PDF pages. They are not part of the core
// objectUrls registry, so they must be revoked here when a chapter is replaced.
let pdfObjectUrls = [];
// Message shown under the reader when a PDF was cut off at PDF_LIMITS.MAX_PAGES.
let pendingPdfNotice = '';
// Message shown when the folder scan stopped at its entry/depth limit.
const TRUNCATED_NOTICE = 'Only part of the folder was read (too many files or too deeply '
    + 'nested). Move the missing chapters into a smaller folder and choose again.';
let localTruncatedNotice = '';

function getLocalMangaSession() {
    if (localMangaSession) return localMangaSession;
    try {
        localMangaSession = JSON.parse(window.sessionStorage.getItem('localMediaManga') || 'null');
    } catch (error) {
        localMangaSession = null;
    }
    if (!localMangaSession || !Array.isArray(localMangaSession.groups)) localMangaSession = null;
    return localMangaSession;
}

function saveLocalMangaProgress() {
    if (!currentChapter) return;
    window.LocalMediaCore.saveProgress(currentChapter, {
        pageIndex: currentPageIndex,
        updatedAt: Date.now()
    });
}

function loadLocalManga() {
    const session = getLocalMangaSession();
    if (!session) {
        showError('No local manga session found');
        return;
    }
    chapters = session.groups.map(function (group) {
        var isPdf = group.entries.length === 1 && /\.pdf$/i.test(group.entries[0].name || '');
        return {
            id: group.id,
            name: group.name,
            attributes: {
                chapter: group.name,
                title: isPdf ? 'PDF' : group.entries.length + ' image(s)'
            },
            pageUrl: '',
            localEntries: group.entries
        };
    });
    document.getElementById('mangaTitle').textContent = session.rootName || 'Local manga';
    var mangaHint = session.resumable
        ? 'Local images stay in this browser.'
        : 'Files were picked directly, so reloading this page requires choosing them again.';
    if (session.truncated) {
        // The folder scan hit its entry/depth limit, so some files are missing.
        // Keep the notice so loadChapter() can restore it instead of overwriting
        // it with the chapter name.
        mangaHint = TRUNCATED_NOTICE;
    }
    localTruncatedNotice = session.truncated ? TRUNCATED_NOTICE : '';
    document.getElementById('currentChapter').textContent = mangaHint;
    displayChapters();
    if (chapters.length) loadChapter(chapters[0].id);
}

async function resolveLocalMangaEntryList(entries) {
    // One folder scan (or one staged-file read) for the whole chapter; entries
    // already resolved are reused.
    var pending = entries.filter(function (entry) { return !localMangaFiles[entry.id]; });
    if (!pending.length) {
        return entries.map(function (entry) { return localMangaFiles[entry.id]; });
    }
    var resolved = await window.LocalMediaCore.resolveEntries(
        pending, { category: 'manga', handleKey: 'manga' });
    if (resolved.error) throw new Error(resolved.error);
    resolved.entries.forEach(function (entry) { localMangaFiles[entry.id] = entry; });
    var missing = pending.filter(function (entry) { return !localMangaFiles[entry.id]; });
    if (missing.length) throw new Error('Some local files could not be found; choose them again');
    return entries.map(function (entry) { return localMangaFiles[entry.id]; });
}

// ---- PDF support: each PDF file is rendered to per-page images with pdf.js ----

var PDFJS_SOURCES = [
    // Prefer the vendored copy (offline); fall back to a public CDN.
    '../vendor/pdfjs/pdf.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
    'https://unpkg.com/pdfjs-dist@3.11.174/legacy/build/pdf.min.js'
];
var PDFJS_WORKER = [
    '../vendor/pdfjs/pdf.worker.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
    'https://unpkg.com/pdfjs-dist@3.11.174/legacy/build/pdf.worker.min.js'
];
var pdfjsLibPromise = null;

function isPdfEntry(entry) {
    return entry && entry.file && /\.pdf$/i.test(entry.name || entry.path || '');
}

function loadScript(src) {
    return new Promise(function (resolve, reject) {
        var script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = function () { reject(new Error('Failed to load ' + src)); };
        document.head.appendChild(script);
    });
}

async function ensurePdfJs() {
    if (window.pdfjsLib) return window.pdfjsLib;
    if (!pdfjsLibPromise) {
        pdfjsLibPromise = (async function () {
            var lastError = null;
            for (var i = 0; i < PDFJS_SOURCES.length; i++) {
                try {
                    await loadScript(PDFJS_SOURCES[i]);
                    if (window.pdfjsLib) {
                        // Worker source mirrors the library source so versions always match.
                        window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER[i];
                        return window.pdfjsLib;
                    }
                } catch (error) {
                    lastError = error;
                }
            }
            throw new Error('PDF renderer (pdf.js) could not be loaded' +
                (lastError ? ': ' + lastError.message : ''));
        })();
        pdfjsLibPromise.catch(function () { pdfjsLibPromise = null; });
    }
    return pdfjsLibPromise;
}

// ---- PDF rendering -------------------------------------------------------
// PDFs can hold thousands of pages. Cap how many we rasterise per open so a
// single huge book cannot freeze the tab or exhaust memory on a phone; the
// reader is told when a file was cut short. Every produced URL is tracked in
// pdfObjectUrls so switching chapters can release it.
var PDF_LIMITS = {
    MAX_PAGES: 400,   // pages rasterised per PDF per open
    BATCH: 4          // pages rendered between yields to the browser
};

// Progress callback: ({done, total, truncated}) => void.
var pdfProgressReporter = null;

// Cancellation token of the running render; bumping it stops older work.
var pdfRenderToken = null;

function pdfYield() {
    return new Promise(function (resolve) { setTimeout(resolve, 0); });
}

// Render one PDF into page images, yielding between small batches so the reader
// stays responsive and can show progress on long documents.
async function renderPdfEntry(entry, onProgress) {
    const file = entry.file;
    if (!file) throw new Error('PDF file not available; choose the folder again');
    const pdfjsLib = await ensurePdfJs();
    const buffer = await file.arrayBuffer();
    const doc = await pdfjsLib.getDocument({ data: buffer }).promise;
    const token = {};
    pdfRenderToken = token;
    const urls = [];
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const total = Math.min(doc.numPages, PDF_LIMITS.MAX_PAGES);
    const report = onProgress || pdfProgressReporter;

    async function renderPage(num) {
        const page = await doc.getPage(num);
        // Render at ~1600px on the long edge: crisp on desktop, memory-safe on phones.
        const base = page.getViewport({ scale: 1 });
        const scale = Math.min(3, Math.max(1, 1600 / Math.max(base.width, base.height)));
        const viewport = page.getViewport({ scale: scale });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        await page.render({ canvasContext: context, viewport: viewport }).promise;
        const blob = await new Promise(function (resolve) {
            canvas.toBlob(resolve, 'image/jpeg', 0.85);
        });
        page.cleanup();
        return blob;
    }

    try {
        for (let num = 1; num <= total; num++) {
            // A new chapter must stop this render instead of piling on memory.
            if (token.cancelled) break;
            const blob = await renderPage(num);
            if (blob) {
                const url = URL.createObjectURL(blob);
                pdfObjectUrls.push(url);
                urls.push(url);
            }
            if (report && (num % PDF_LIMITS.BATCH === 0 || num === total)) {
                report({ done: num, total: total, truncated: doc.numPages > total });
            }
            // Hand the main thread back so the UI can paint progress.
            if (num % PDF_LIMITS.BATCH === 0) await pdfYield();
        }
    } finally {
        canvas.width = canvas.height = 0; // release canvas memory
        // Free the parsed document + its worker buffers as soon as we are done.
        if (doc && typeof doc.destroy === 'function') {
            try { await doc.destroy(); } catch (e) { /* nothing left to free */ }
        }
        if (pdfRenderToken === token) pdfRenderToken = null;
    }
    if (!urls.length) throw new Error('PDF has no readable pages');
    return { urls: urls, total: total, truncated: doc.numPages > total, cancelled: !!token.cancelled };
}

// Stop the PDF render that is currently running (if any).
function cancelPdfRender() {
    if (pdfRenderToken) pdfRenderToken.cancelled = true;
}

// Release every page image produced by previous PDF renders.
function releasePdfObjectUrls() {
    while (pdfObjectUrls.length) {
        const url = pdfObjectUrls.pop();
        try { URL.revokeObjectURL(url); } catch (e) { /* already gone */ }
    }
}

// Revoke the remaining PDF page images when the page goes away.
window.addEventListener('pagehide', releasePdfObjectUrls);


// Get all reader params from URL
function getReaderParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        src: params.get('src') || 'jikan',
        id: params.get('id') || params.get('mangaId'),
        chapterId: params.get('chapter')
    };
}

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    const p = getReaderParams();

    if (p.src === 'local') {
        loadLocalManga();
    } else if (p.src === 'xkcd' && p.id) {
        loadXkcd(p.id, p.chapterId);
    } else if (p.id) {
        loadJikan(p.id, p.chapterId);
    } else {
        showError('No manga specified');
    }

    setupEventListeners();
});

// Toggle sidebar - toggle chapter list and toolbar visibility
function toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
    var toolbar = document.querySelector('.top-toolbar');
    var readerArea = document.getElementById('readerWrapper');
    
    // Toggle sidebar
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('show-mobile');
    } else {
        sidebar.classList.toggle('collapsed');
    }
    
    // Show toolbar when sidebar is expanded, hide when collapsed
    var isExpanded = (window.innerWidth <= 768) ? sidebar.classList.contains('show-mobile') : !sidebar.classList.contains('collapsed');
    
    if (isExpanded) {
        toolbar.classList.remove('hidden');
        readerArea.classList.remove('expanded');
    } else {
        toolbar.classList.add('hidden');
        readerArea.classList.add('expanded');
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Toggle sidebar button
    document.getElementById('toggleSidebar').addEventListener('click', function() {
        toggleSidebar();
    });
    
    // Back button
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = '../routes/manga.html';
    });
    
    // Chapter search
    document.getElementById('chapterSearch').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        document.querySelectorAll('.chapter-item').forEach(function(item) {
            const name = item.querySelector('.chapter-name').textContent.toLowerCase();
            item.style.display = name.includes(query) ? '' : 'none';
        });
    });
    
    // Navigation buttons
    document.getElementById('prevPageBtn').addEventListener('click', function() {
        if (currentPageIndex > 0) {
            currentPageIndex--;
            displayCurrentPage();
        }
    });
    
    document.getElementById('nextPageBtn').addEventListener('click', function() {
        if (currentPageIndex < currentPages.length - 1) {
            currentPageIndex++;
            displayCurrentPage();
        }
    });
    
    document.getElementById('prevChapterBtn').addEventListener('click', function() {
        const currentIndex = chapters.findIndex(c => c.id === currentChapter);
        if (currentIndex < chapters.length - 1) {
            loadChapter(chapters[currentIndex + 1].id);
        }
    });
    
    document.getElementById('nextChapterBtn').addEventListener('click', function() {
        const currentIndex = chapters.findIndex(c => c.id === currentChapter);
        if (currentIndex > 0) {
            loadChapter(chapters[currentIndex - 1].id);
        }
    });
    
    // Random chapter button
    document.getElementById('scrollModeBtn').addEventListener('click', function() {
        if (chapters.length > 0) {
            const randomIndex = Math.floor(Math.random() * chapters.length);
            loadChapter(chapters[randomIndex].id);
        }
    });
    
    // Info panel
    document.getElementById('infoBtn').addEventListener('click', function() {
        document.getElementById('mangaInfoPanel').classList.toggle('show');
    });
    
    // Fullscreen
    document.getElementById('fullscreenBtn').addEventListener('click', function() {
        const icon = this.querySelector('i');
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            icon.classList.remove('fa-expand');
            icon.classList.add('fa-compress');
        } else {
            document.exitFullscreen();
            icon.classList.remove('fa-compress');
            icon.classList.add('fa-expand');
        }
    });
    
    // GitHub
    document.getElementById('githubBtn').addEventListener('click', function() {
        window.open('https://github.com/zhangboheng/Easy-Web-TV-M3u8', '_blank');
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            document.getElementById('prevPageBtn').click();
        } else if (e.key === 'ArrowRight') {
            document.getElementById('nextPageBtn').click();
        } else if (e.key === 'ArrowUp') {
            document.getElementById('prevChapterBtn').click();
        } else if (e.key === 'ArrowDown') {
            document.getElementById('nextChapterBtn').click();
        }
    });
    
    // Click on reader area to navigate
    document.getElementById('readerWrapper').addEventListener('click', function(e) {
        const width = this.offsetWidth;
        const rect = this.getBoundingClientRect();
        const clickX = e.pageX - rect.left;
        
        if (clickX < width / 3) {
            document.getElementById('prevPageBtn').click();
        } else if (clickX > width * 2 / 3) {
            document.getElementById('nextPageBtn').click();
        }
    });
}

// Load Jikan manga: metadata + official pictures (Jikan does not expose scan pages).
// Each picture becomes a one-image "chapter" so the existing gallery UI works.
async function loadJikan(mangaId, chapterId) {
    try {
        showLoading('Loading manga...');

        const [fullData, picturesData] = await Promise.all([
            fetchJSONWithProxy(`${JIKAN_API}/manga/${encodeURIComponent(mangaId)}/full`),
            fetchJSONWithProxy(`${JIKAN_API}/manga/${encodeURIComponent(mangaId)}/pictures`).catch(() => ({ data: [] }))
        ]);

        if (!fullData || !fullData.data) throw new Error('Manga not found');
        currentManga = fullData.data;
        mangaInfo = currentManga;
        updateMangaInfo();

        const jpg = (mangaInfo.images && mangaInfo.images.jpg) || {};
        const cover = jpg.large_image_url || jpg.image_url || '';
        const pictures = (picturesData && picturesData.data) || [];
        chapters = [];
        var pictureIndex = 0;

        if (cover) {
            chapters.push({
                id: 'cover',
                attributes: { chapter: 'Cover', title: 'Official Cover' }
            });
        }
        pictures.forEach(function(pic) {
            const picJpg = (pic && pic.jpg) || {};
            const url = picJpg.large_image_url || picJpg.image_url || '';
            if (url) {
                chapters.push({
                    id: 'pic' + pictureIndex,
                    pageUrl: url,
                    attributes: { chapter: 'Image ' + (pictureIndex + 1), title: 'Official Art' }
                });
                pictureIndex++;
            }
        });

        if (chapters.length === 0) throw new Error('No images available for this manga');

        displayChapters();
        const first = chapterId || chapters[0].id;
        await loadChapter(first);
    } catch (error) {
        console.error('Error loading manga (Jikan):', error);
        showError('Failed to load manga: ' + error.message);
    }
}

// Load xkcd: one issue, plus previous/next issues as "chapters".
async function loadXkcd(comicId, chapterId) {
    try {
        showLoading('Loading comic...');
        const num = parseInt(comicId, 10);
        if (!num || num < 1) throw new Error('Invalid comic number');

        const comic = await fetchJSONWithProxy(`${XKCD_API}/${num}/info.0.json`);
        if (!comic || !comic.img) throw new Error('Comic not found');

        currentManga = comic;
        mangaInfo = comic;
        document.getElementById('mangaTitle').textContent = '#' + comic.num + ' ' + (comic.safe_title || comic.title);
        document.getElementById('mangaInfoTitle').textContent = comic.safe_title || comic.title;
        document.getElementById('mangaCover').src = comic.img;
        document.getElementById('mangaTags').innerHTML = '<span class="tag">xkcd</span><span class="tag">' + escapeHtml(comic.year + '-' + comic.month + '-' + comic.day) + '</span>';
        document.getElementById('mangaInfoContent').innerHTML = '<p>' + escapeHtml(comic.alt || '') + '</p><p>' + escapeHtml(comic.transcript || '') + '</p>';
        document.title = (comic.title || 'xkcd') + ' - Manga Reader';

        chapters = [];
        const latest = await fetchJSONWithProxy(`${XKCD_API}/info.0.json`).catch(() => ({ num: num }));
        const max = latest && latest.num ? latest.num : num;
        for (var n = Math.min(max, num + 3); n >= Math.max(1, num - 3); n--) {
            chapters.push({ id: String(n), attributes: { chapter: n, title: 'Issue ' + n } });
        }

        displayChapters();
        await loadChapter(chapterId || String(num));
    } catch (error) {
        console.error('Error loading manga (xkcd):', error);
        showError('Failed to load comic: ' + error.message);
    }
}

// Update Manga Info (Jikan full entry)
function updateMangaInfo() {
    if (!mangaInfo) return;

    const title = mangaInfo.title_english || mangaInfo.title || 'Unknown Title';
    document.getElementById('mangaTitle').textContent = title;
    document.getElementById('mangaInfoTitle').textContent = title;

    const jpg = (mangaInfo.images && mangaInfo.images.jpg) || {};
    const coverUrl = jpg.large_image_url || jpg.image_url || '';
    if (coverUrl) document.getElementById('mangaCover').src = coverUrl;

    const tags = (mangaInfo.genres || []).map(function(g) { return g.name; })
        .concat((mangaInfo.themes || []).map(function(g) { return g.name; }))
        .slice(0, 5);
    document.getElementById('mangaTags').innerHTML = tags.length
        ? tags.map(function(t) { return '<span class="tag">' + escapeHtml(t) + '</span>'; }).join('')
        : '<span class="tag">Jikan</span>';

    const parts = [mangaInfo.synopsis || 'No description available.'];
    if (mangaInfo.status) parts.push('Status: ' + mangaInfo.status);
    if (mangaInfo.chapters) parts.push('Chapters: ' + mangaInfo.chapters);
    if (mangaInfo.score) parts.push('Score: ' + mangaInfo.score);
    let html = parts.map(function(p) { return '<p>' + escapeHtml(p) + '</p>'; }).join('');
    if (mangaInfo.url) {
        html += '<p><a href="' + escapeHtml(mangaInfo.url) + '" target="_blank" rel="noopener">View on MyAnimeList</a></p>';
    }
    document.getElementById('mangaInfoContent').innerHTML = html;
    document.title = title + ' - Manga Reader';
}

// Display Chapters
function displayChapters() {
    if (chapters.length === 0) {
        document.getElementById('chapterList').innerHTML = `
            <div class="no-chapters">
                <i class="fas fa-book"></i>
                <span>No chapters available</span>
            </div>
        `;
        return;
    }
    
    document.getElementById('chapterCount').textContent = chapters.length;
    
    let html = '';
    chapters.forEach((chapter, index) => {
        const chapterNum = chapter.attributes.chapter || '?';
        const title = chapter.attributes.title || `Chapter ${chapterNum}`;
        const isCurrent = chapter.id === currentChapter;
        
        html += `
            <div class="chapter-item ${isCurrent ? 'active' : ''}" data-id="${escapeHtml(chapter.id)}">
                <div class="chapter-icon">
                    <i class="fas fa-book-open"></i>
                </div>
                <span class="chapter-name">Ch. ${escapeHtml(String(chapterNum))}: ${escapeHtml(title)}</span>
            </div>
        `;
    });
    
    document.getElementById('chapterList').innerHTML = html;
    
    // Click handler
    document.querySelectorAll('.chapter-item').forEach(function(item) {
        item.addEventListener('click', function() {
            const id = this.dataset.id;
            loadChapter(id);
        });
    });
}

// Load Chapter (one official Jikan image or one xkcd issue)
async function loadChapter(chapterId) {
    try {
        currentChapter = chapterId;

        document.querySelectorAll('.chapter-item').forEach(function(item) {
            item.classList.remove('active');
        });
        // Never interpolate an id into a CSS selector: a file name containing a
        // quote or backslash would throw a SyntaxError (or silently not match).
        let activeItem = null;
        document.querySelectorAll('.chapter-item').forEach(function(item) {
            if (item.dataset.id === chapterId) activeItem = item;
        });
        if (activeItem) activeItem.classList.add('active');

        showLoading('Loading chapter pages...');
        const src = getReaderParams().src;

        // Drop page images rendered for the previous chapter before building new
        // ones, otherwise every PDF chapter switch leaks its JPEG blobs.
        // Also stop any in-flight PDF render so two books never render at once.
        cancelPdfRender();
        releasePdfObjectUrls();
        pendingPdfNotice = '';

        if (getReaderParams().src === 'local') {
            const chapter = chapters.find(c => c.id === chapterId);
            if (!chapter) throw new Error('Chapter not found');
            const files = await resolveLocalMangaEntryList(chapter.localEntries);
            const imageUrls = [];
            let pdfTruncated = false;
            let pdfTotal = 0;
            for (const entry of files) {
                if (isPdfEntry(entry)) {
                    // One PDF file contributes one or more rendered pages. Long
                    // documents report progress and stop at PDF_LIMITS.MAX_PAGES.
                    const rendered = await renderPdfEntry(entry, function (state) {
                        if (state.total > 1) {
                            showLoading('Rendering PDF ' + state.done + ' / ' + state.total + ' pages...');
                        }
                    });
                    imageUrls.push(...rendered.urls);
                    if (rendered.truncated) {
                        pdfTruncated = true;
                        pdfTotal = rendered.total;
                    }
                } else {
                    imageUrls.push(window.LocalMediaCore.getObjectUrl(entry.id, entry.file));
                }
            }
            currentPages = imageUrls;
            currentPageIndex = 0;
            document.getElementById('currentChapter').textContent = localTruncatedNotice
                ? localTruncatedNotice
                : 'Local: ' + (chapter.name || chapterId);
            pendingPdfNotice = pdfTruncated
                ? 'Showing the first ' + pdfTotal + ' pages of a longer PDF.'
                : '';
            const progress = await window.LocalMediaCore.getProgress(chapterId);
            if (progress && !isNaN(progress.pageIndex) && progress.pageIndex >= 0 && progress.pageIndex < currentPages.length) {
                currentPageIndex = parseInt(progress.pageIndex, 10);
            }
        } else if (src === 'xkcd') {
            const num = parseInt(chapterId, 10);
            const comic = await fetchJSONWithProxy(`${XKCD_API}/${num}/info.0.json`);
            if (!comic || !comic.img) throw new Error('Comic not found');
            currentPages = [comic.img];
            currentPageIndex = 0;
            document.getElementById('currentChapter').textContent = '#' + comic.num + ' ' + (comic.safe_title || comic.title);
        } else if (src === 'jikan') {
            const chapter = chapters.find(c => c.id === chapterId);
            if (!chapter) throw new Error('Chapter not found');
            if (chapterId === 'cover') {
                const jpg = (mangaInfo.images && mangaInfo.images.jpg) || {};
                currentPages = [jpg.large_image_url || jpg.image_url].filter(Boolean);
            } else {
                currentPages = [chapter.pageUrl].filter(Boolean);
            }
            currentPageIndex = 0;
            document.getElementById('currentChapter').textContent = 'Ch. ' + chapter.attributes.chapter + ': ' + chapter.attributes.title;
        } else {
            throw new Error('Unsupported manga source');
        }

        if (currentPages.length === 0) throw new Error('No pages available');
        displayPages();
        updateNavigation();
    } catch (error) {
        console.error('Error loading chapter:', error);
        showError('Failed to load chapter: ' + error.message);
    }
}

// Display Pages
function displayPages() {
    if (currentPages.length === 0) {
        document.getElementById('readerWrapper').innerHTML = `
            <div class="empty-state">
                <i class="fas fa-image"></i>
                <p>No pages available</p>
            </div>
        `;
        return;
    }
    
    document.getElementById('navButtons').style.display = '';
    
    if (isScrollMode) {
        // Scroll mode - show all pages vertically
        let html = '';
        currentPages.forEach((page, index) => {
            html += `<img src="${page}" class="manga-page" alt="Page ${index + 1}" loading="lazy" referrerpolicy="no-referrer" onerror="this.outerHTML='<div style=&quot;padding:40px 20px;text-align:center;color:rgba(255,255,255,0.5);border:1px dashed rgba(255,255,255,0.15);border-radius:8px;margin:8px 0;font-size:14px;&quot;>⚠ Page ${index + 1}: image blocked by CDN hotlink protection</div>'">`;
        });
        document.getElementById('readerWrapper').innerHTML = html;
        document.getElementById('pageText').textContent = pendingPdfNotice
            ? pendingPdfNotice
            : `Total: ${currentPages.length} pages`;
    } else {
        // Single page mode
        displayCurrentPage();
    }
}

// Display Current Page (for single page mode)
function displayCurrentPage() {
    if (currentPages.length === 0) return;
    
    const pageUrl = currentPages[currentPageIndex];
    const idx = currentPageIndex;
    document.getElementById('readerWrapper').innerHTML = `
        <img src="${pageUrl}" class="manga-page" alt="Page ${idx + 1}" referrerpolicy="no-referrer" onerror="this.outerHTML='<div style=&quot;padding:40px 20px;text-align:center;color:rgba(255,255,255,0.5);border:1px dashed rgba(255,255,255,0.15);border-radius:8px;margin:8px 0;font-size:14px;&quot;>⚠ Page ${idx + 1}: image blocked by CDN hotlink protection</div>'">
    `;
    
    document.getElementById('pageText').textContent = pendingPdfNotice
        ? pendingPdfNotice + ' (page ' + (idx + 1) + ' / ' + currentPages.length + ')'
        : `Page ${idx + 1} / ${currentPages.length}`;
    updateNavigation();
}

// Update Navigation
function updateNavigation() {
    // Page navigation
    document.getElementById('prevPageBtn').disabled = currentPageIndex === 0;
    document.getElementById('nextPageBtn').disabled = currentPageIndex >= currentPages.length - 1;
    if (getReaderParams().src === 'local') saveLocalMangaProgress();
    
    // Chapter navigation
    const currentIndex = chapters.findIndex(c => c.id === currentChapter);
    document.getElementById('prevChapterBtn').disabled = currentIndex >= chapters.length - 1;
    document.getElementById('nextChapterBtn').disabled = currentIndex <= 0;
}

// Show Loading
function showLoading(message) {
    document.getElementById('readerWrapper').innerHTML = `
        <div class="loading-state">
            <i class="fas fa-spinner"></i>
            <span>${message}</span>
        </div>
    `;
    document.getElementById('navButtons').style.display = 'none';
}

// Show Error
function showError(message) {
    document.getElementById('readerWrapper').innerHTML = `
        <div class="empty-state">
            <i class="fas fa-exclamation-circle"></i>
            <p>${message}</p>
            <p style="font-size: 12px; margin-top: 10px;">Please try another manga or check back later.</p>
        </div>
    `;
    document.getElementById('navButtons').style.display = 'none';
}
