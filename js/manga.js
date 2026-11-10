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

    if (p.src === 'xkcd' && p.id) {
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
        window.history.back();
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
        const activeItem = document.querySelector(`.chapter-item[data-id="${chapterId}"]`);
        if (activeItem) activeItem.classList.add('active');

        showLoading('Loading chapter pages...');
        const src = getReaderParams().src;

        if (src === 'xkcd') {
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
        document.getElementById('pageText').textContent = `Total: ${currentPages.length} pages`;
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
    
    document.getElementById('pageText').textContent = `Page ${idx + 1} / ${currentPages.length}`;
    updateNavigation();
}

// Update Navigation
function updateNavigation() {
    // Page navigation
    document.getElementById('prevPageBtn').disabled = currentPageIndex === 0;
    document.getElementById('nextPageBtn').disabled = currentPageIndex >= currentPages.length - 1;
    
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
