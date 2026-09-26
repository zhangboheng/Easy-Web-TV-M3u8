/**
 * Manga Reader - MangaDex API Integration
 * Using MangaDex API (free, no key required)
 * Native JavaScript (No jQuery)
 */

// API Base URL
const MANGADEX_API = 'https://api.mangadex.org';
const MANGADEX_COVER = 'https://uploads.mangadex.org/covers';
// CORS proxy + failover now live in ../js/apiproxy.js (fetchJSONWithProxy)

// State
let currentManga = null;
let currentChapter = null;
let chapters = [];
let currentPageIndex = 0;
let currentPages = [];
let mangaInfo = null;
let isScrollMode = true;

// Get manga ID from URL
function getMangaId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || params.get('mangaId');
}

// Get chapter ID from URL
function getChapterId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('chapter');
}

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    const mangaId = getMangaId();
    const chapterId = getChapterId();
    
    if (mangaId) {
        loadManga(mangaId, chapterId);
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

// Load Manga
async function loadManga(mangaId, chapterId) {
    try {
        showLoading('Loading manga...');
        
        // Get manga info
        const mangaData = await fetchJSONWithProxy(`${MANGADEX_API}/manga/${mangaId}`);
        
        if (mangaData.result === 'ok') {
            currentManga = mangaData.data;
            mangaInfo = currentManga;
            updateMangaInfo();
        }
        
        // Get chapters
        const chaptersData = await fetchJSONWithProxy(`${MANGADEX_API}/manga/${mangaId}/feed?translatedLanguage[]=en&order[chapter]=desc&limit=500`);
        
        if (chaptersData.result === 'ok') {
            chapters = chaptersData.data;
            displayChapters();
            
            // Load first chapter or specified chapter
            if (chapterId) {
                await loadChapter(chapterId);
            } else if (chapters.length > 0) {
                await loadChapter(chapters[0].id);
            }
        }
        
    } catch (error) {
        console.error('Error loading manga:', error);
        showError('Failed to load manga: ' + error.message);
    }
}

// Update Manga Info
function updateMangaInfo() {
    if (!mangaInfo) return;
    
    const title = mangaInfo.attributes.title.en || 
                  Object.values(mangaInfo.attributes.title)[0] || 
                  'Unknown Title';
    
    document.getElementById('mangaTitle').textContent = title;
    document.getElementById('mangaInfoTitle').textContent = title;
    
    // Get cover
    const coverArt = mangaInfo.relationships.find(r => r.type === 'cover_art');
    if (coverArt) {
        const coverUrl = `${MANGADEX_COVER}/${mangaInfo.id}/${coverArt.attributes?.fileName || 'cover.jpg'}`;
        document.getElementById('mangaCover').src = coverUrl;
    }
    
    // Get tags
    const tags = mangaInfo.attributes.tags
        .filter(t => t.attributes.group === 'genre')
        .map(t => t.attributes.name.en)
        .slice(0, 5);
    
    if (tags.length > 0) {
        document.getElementById('mangaTags').innerHTML = tags.map(t => `<span class="tag">${t}</span>`).join('');
    }
    
    // Get description
    const description = mangaInfo.attributes.description.en || 
                        Object.values(mangaInfo.attributes.description)[0] || 
                        'No description available.';
    
    document.getElementById('mangaInfoContent').innerHTML = `<p>${description}</p>`;
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
            <div class="chapter-item ${isCurrent ? 'active' : ''}" data-id="${chapter.id}">
                <div class="chapter-icon">
                    <i class="fas fa-book-open"></i>
                </div>
                <span class="chapter-name">Ch. ${chapterNum}: ${title}</span>
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

// Load Chapter
async function loadChapter(chapterId) {
    try {
        currentChapter = chapterId;
        
        // Update active state
        document.querySelectorAll('.chapter-item').forEach(function(item) {
            item.classList.remove('active');
        });
        const activeItem = document.querySelector(`.chapter-item[data-id="${chapterId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
        
        showLoading('Loading chapter pages...');
        
        // Get chapter pages
        const data = await fetchJSONWithProxy(`${MANGADEX_API}/at-home/server/${chapterId}`);
        
        if (data.result === 'ok') {
            const baseUrl = data.baseUrl;
            const chapterHash = data.chapter.hash;
            const pages = data.chapter.data;
            
            currentPages = pages.map(page => `${baseUrl}/data/${chapterHash}/${page}`);
            currentPageIndex = 0;
            
            // Update chapter title
            const chapter = chapters.find(c => c.id === chapterId);
            if (chapter) {
                const chapterNum = chapter.attributes.chapter || '?';
                const title = chapter.attributes.title || '';
                document.getElementById('currentChapter').textContent = `Ch. ${chapterNum}: ${title}`;
            }
            
            displayPages();
            updateNavigation();
        } else {
            throw new Error('Failed to load chapter');
        }
        
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
            html += `<img src="${page}" class="manga-page" alt="Page ${index + 1}" loading="lazy">`;
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
    document.getElementById('readerWrapper').innerHTML = `
        <img src="${pageUrl}" class="manga-page" alt="Page ${currentPageIndex + 1}">
    `;
    
    document.getElementById('pageText').textContent = `Page ${currentPageIndex + 1} / ${currentPages.length}`;
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
