// Manga List Page JS - MangaDex API Version
// Native JavaScript (No jQuery)

// MangaDex API base URL
var MANGADEX_API = 'https://api.mangadex.org';
// MangaPill (server-rendered HTML, scraped via fetchWithProxy)
var MANGAPILL_BASE = 'https://mangapill.com';
// CORS proxy + failover now live in ../js/apiproxy.js (fetchJSONWithProxy)

// Global variables
var pnum = 1;
var currentCategory = '';
var currentSource = 'mangadex';
var isLoading = false;
var searchKeyword = '';
var totalMangas = [];
var hasMoreManga = true;

// Toast notification
function showToast(message, type) {
    type = type || 'info';
    var iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    // Remove existing toasts
    var existingToasts = document.querySelectorAll('.toast-notification');
    existingToasts.forEach(function(t) { t.remove(); });
    
    var toast = document.createElement('div');
    toast.className = 'toast-notification ' + type;
    toast.style.cssText = 'position: fixed; top: 80px; right: 20px; padding: 15px 20px; background: rgba(0,0,0,0.9); border: 2px solid ' + (type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#a3001b') + '; border-radius: 10px; color: #fff; z-index: 9999; display: flex; align-items: center; gap: 10px; animation: slideIn 0.3s ease;';
    toast.innerHTML = '<i class="fas ' + iconMap[type] + '" style="color: ' + (type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#a3001b') + '"></i><span>' + message + '</span>';
    
    document.body.appendChild(toast);
    
    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
}

// Show/Hide loading
function showLoading(show) {
    var indicator = document.getElementById('loadMoreIndicator');
    var grid = document.getElementById('contentGrid');
    
    if (show) {
        if (indicator) indicator.style.display = 'block';
        if (grid && (grid.children.length === 0 || !grid.classList.contains('has-results'))) {
            grid.innerHTML = '<div class="loading-state"><i class="fas fa-spinner"></i><span>Loading manga...</span></div>';
        }
    } else {
        if (indicator) indicator.style.display = 'none';
    }
}

// Toggle sidebar
function toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
    
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('show-mobile');
    } else {
        sidebar.classList.toggle('collapsed');
    }
}

// Get cover art URL from MangaDex
function getCoverUrl(mangaId, coverArt) {
    if (!coverArt || !coverArt.attributes) {
        return '../images/noimage.jpeg';
    }
    var fileName = coverArt.attributes.fileName;
    return 'https://uploads.mangadex.org/covers/' + mangaId + '/' + fileName + '.256.jpg';
}

// Render manga cards from a normalized card list: [{ id, href, title, coverUrl, status }]
function renderMangas(cards, append) {
    var grid = document.getElementById('contentGrid');
    
    if (!append) {
        grid.innerHTML = '';
        grid.classList.add('has-results');
    }
    
    if (cards.length === 0 && !append) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-book-open"></i><p>No manga found</p></div>';
        return;
    }
    
    cards.forEach(function(cardData) {
        var coverUrl = cardData.coverUrl || '../images/noimage.jpeg';
        
        var card = document.createElement('a');
        card.href = cardData.href;
        card.className = 'card-item';
        card.innerHTML = 
            '<img class="card-image" src="' + escapeHtml(coverUrl) + '" alt="' + escapeHtml(cardData.title) + '" onerror="this.src=\'../images/noimage.jpeg\'">' +
            '<div class="card-overlay"></div>' +
            '<div class="card-play-icon">' +
                '<i class="fas fa-book-open"></i>' +
            '</div>' +
            '<div class="card-info">' +
                '<div class="card-type">Manga</div>' +
                '<h3 class="card-title">' + escapeHtml(cardData.title) + '</h3>' +
                '<p class="card-chapter">' + escapeHtml(cardData.status || 'Ongoing') + '</p>' +
            '</div>';
        
        grid.appendChild(card);
    });
}

// Convert a MangaDex API entry into a normalized card
function mangadexToCard(manga) {
    var title = manga.attributes.title.en || 
               manga.attributes.title['ja-ro'] || 
               manga.attributes.title.ja || 
               Object.values(manga.attributes.title)[0] || 
               'Unknown Title';
    
    return {
        id: manga.id,
        href: '../catalogues/mangaplay.html?id=' + manga.id + '&src=mangadex',
        title: title,
        coverUrl: manga.coverUrl || '../images/noimage.jpeg',
        status: manga.attributes.status || 'Ongoing'
    };
}

// Render categories (MangaDex tags/genres)
function renderCategories(categories) {
    var list = document.getElementById('categoryList');
    list.innerHTML = '';
    
    // Add "All" category first
    var allItem = document.createElement('div');
    allItem.className = 'category-item active';
    allItem.setAttribute('data-id', '');
    allItem.setAttribute('data-name', 'All');
    allItem.innerHTML = '<i class="fas fa-globe"></i><span>All Manga</span>';
    list.appendChild(allItem);
    
    categories.forEach(function(cat) {
        var item = document.createElement('div');
        item.className = 'category-item';
        item.setAttribute('data-id', cat.id);
        item.setAttribute('data-name', cat.name);
        item.innerHTML = '<i class="fas fa-bookmark"></i><span>' + cat.name + '</span>';
        list.appendChild(item);
    });
    
    // Bind click events
    var items = list.querySelectorAll('.category-item');
    items.forEach(function(item) {
        item.addEventListener('click', function() {
            items.forEach(function(i) { i.classList.remove('active'); });
            this.classList.add('active');
            
            var tagId = this.getAttribute('data-id');
            currentCategory = tagId;
            pnum = 1;
            searchKeyword = '';
            hasMoreManga = true;
            loadMangas(tagId, false);
            
            // Hide sidebar on mobile
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('show-mobile');
            }
        });
    });
}

// Load categories for the current source (dispatches per source)
function loadTags() {
    if (currentSource === 'mangapill') {
        // MangaPill has fixed list pages instead of tag/genre filtering
        renderCategories([
            { id: 'latest', name: 'Latest Updates' },
            { id: 'new', name: 'New Releases' }
        ]);
        loadMangas('', false);
        return;
    }
    document.getElementById('categoryList').innerHTML = '<div class="loading-state"><i class="fas fa-spinner"></i><span>Loading categories...</span></div>';
    
    fetchJSONWithProxy(MANGADEX_API + '/manga/tag')
        .then(function(data) {
            if (data.result === 'ok' && data.data) {
                // Filter for genre-type tags (group: 'genre')
                var genres = data.data.filter(function(tag) { return tag.attributes.group === 'genre'; });
                
                var categories = genres.map(function(tag) {
                    return {
                        id: tag.id,
                        name: tag.attributes.name.en || Object.values(tag.attributes.name)[0] || 'Unknown'
                    };
                }).sort(function(a, b) { return a.name.localeCompare(b.name); });
                
                renderCategories(categories);
                
                // Load initial manga list
                loadMangas('', false);
            } else {
                showToast('Failed to load categories', 'error');
                renderCategories([]);
                loadMangas('', false);
            }
        })
        .catch(function(error) {
            console.error('Error loading tags:', error);
            showToast('Failed to load categories', 'error');
            renderCategories([]);
            loadMangas('', false);
        });
}

// Load mangas for the current source (dispatches per source)
function loadMangas(tagId, append) {
    if (isLoading) return;
    if (append && !hasMoreManga) return;
    
    if (currentSource === 'mangapill') {
        loadMangaPillList(tagId, append);
        return;
    }
    
    isLoading = true;
    showLoading(true);
    
    var limit = 20;
    var offset = append ? (pnum - 1) * limit : 0;
    
    // Build API URL
    var apiUrl = MANGADEX_API + '/manga?limit=' + limit + '&offset=' + offset + '&order[rating]=desc&includes[]=cover_art&contentRating[]=safe&contentRating[]=suggestive';
    
    if (tagId) {
        apiUrl += '&includedTags[]=' + tagId;
    }
    
    if (searchKeyword) {
        apiUrl += '&title=' + encodeURIComponent(searchKeyword);
    }
    
    fetchJSONWithProxy(apiUrl)
        .then(function(data) {
            if (data.result === 'ok' && data.data) {
                // Process manga data and get cover URLs
                var cards = data.data.map(function(manga) {
                    // Find cover art from relationships
                    var coverArt = manga.relationships.find(function(rel) { return rel.type === 'cover_art'; });
                    manga.coverUrl = getCoverUrl(manga.id, coverArt);
                    return mangadexToCard(manga);
                });
                
                renderMangas(cards, append);
                
                // Check if there are more results
                if (typeof data.total === 'number') {
                    hasMoreManga = data.total > offset + limit && cards.length > 0;
                } else {
                    hasMoreManga = cards.length > 0;
                }
                if (hasMoreManga) {
                    pnum++;
                }
            } else {
                if (!append) {
                    document.getElementById('contentGrid').innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Failed to load manga</p></div>';
                }
                showToast('Failed to load manga', 'error');
            }
            isLoading = false;
            showLoading(false);
            checkAutoLoadManga();
        })
        .catch(function(error) {
            console.error('Error loading manga:', error);
            if (!append) {
                document.getElementById('contentGrid').innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Failed to load manga</p></div>';
            }
            showToast('Network error occurred', 'error');
            isLoading = false;
            showLoading(false);
        });
}

// Auto load more when content does not fill the visible area
// (wide screens: the first batch of cards may fit entirely without scrolling,
// so the scroll event never fires and infinite scroll would never trigger)
function checkAutoLoadManga() {
    if (isLoading || !hasMoreManga) return;
    
    var contentArea = document.getElementById('contentArea');
    if (!contentArea) return;
    
    if (contentArea.scrollHeight <= contentArea.clientHeight + 100) {
        loadMangas(currentCategory, true);
    }
}

// Load manga list from MangaPill (home / new / search pages are server-rendered HTML)
function loadMangaPillList(tagId, append) {
    isLoading = true;
    showLoading(true);
    
    var url;
    if (searchKeyword) {
        url = MANGAPILL_BASE + '/search?q=' + encodeURIComponent(searchKeyword);
    } else if (tagId === 'new') {
        url = MANGAPILL_BASE + '/mangas/new';
    } else {
        url = MANGAPILL_BASE + '/';
    }
    
    fetchWithProxy(url)
        .then(function(data) {
            var html = new DOMParser().parseFromString(data, 'text/html');
            
            // MangaPill cards: an <a class="relative block"> holds the cover img,
            // a sibling <a href="/manga/{id}/{slug}"> holds the title (div.font-black).
            // Aggregate both by manga id.
            var cardMap = {};
            var cards = [];
            
            html.querySelectorAll('a[href^="/manga/"]').forEach(function(a) {
                var href = a.getAttribute('href') || '';
                var m = href.match(/^\/manga\/(\d+)\/([^\/?#]+)/);
                if (!m) return;
                var key = m[1];
                if (!cardMap[key]) {
                    cardMap[key] = {
                        id: m[1],
                        href: '../catalogues/mangaplay.html?src=mangapill&mid=' + m[1] + '&slug=' + m[2],
                        title: '',
                        coverUrl: '',
                        status: ''
                    };
                    cards.push(cardMap[key]);
                }
                var cardData = cardMap[key];
                if (!cardData.coverUrl) {
                    var img = a.querySelector('img');
                    if (!img) {
                        // cover img may sit in the parent card container (home featured cards
                        // nest the /manga/ title link two levels below the card wrapper)
                        var lvl1 = a.parentElement;
                        var lvl2 = lvl1 ? lvl1.parentElement : null;
                        if (lvl1) img = lvl1.querySelector('img[data-src]');
                        if (!img && lvl2) img = lvl2.querySelector('img[data-src]');
                    }
                    if (img) {
                        cardData.coverUrl = img.getAttribute('data-src') || img.getAttribute('src') || '';
                    }
                }
                if (!cardData.title) {
                    var titleEl = a.querySelector('.font-black') || a;
                    var txt = (titleEl.textContent || '').trim();
                    if (txt) cardData.title = txt;
                }
            });
            
            cards = cards.filter(function(c) { return c.title; });
            cards.forEach(function(c) { if (!c.coverUrl) c.coverUrl = '../images/noimage.jpeg'; });
            
            renderMangas(cards, append);
            
            // MangaPill list pages are single-page: no infinite scroll
            hasMoreManga = false;
            isLoading = false;
            showLoading(false);
            checkAutoLoadManga();
        })
        .catch(function(error) {
            console.error('Error loading manga (mangapill):', error);
            if (!append) {
                document.getElementById('contentGrid').innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Failed to load manga</p></div>';
            }
            showToast('Network error occurred', 'error');
            isLoading = false;
            showLoading(false);
        });
}

// Search mangas
function searchMangas(keyword) {
    if (!keyword) {
        searchKeyword = '';
        pnum = 1;
        hasMoreManga = true;
        loadMangas(currentCategory, false);
        return;
    }
    
    searchKeyword = keyword;
    pnum = 1;
    hasMoreManga = true;
    loadMangas(currentCategory, false);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Manga List Page Loaded (MangaDex API) ===');
    
    // Load source options
    var sourceSelect = document.getElementById('sourceSelect');
    if (sourceSelect) {
        var option = document.createElement('option');
        option.value = 'mangadex';
        option.textContent = 'MangaDex';
        sourceSelect.appendChild(option);
        
        var option2 = document.createElement('option');
        option2.value = 'mangapill';
        option2.textContent = 'MangaPill';
        sourceSelect.appendChild(option2);
    }
    
    // Load initial data
    loadTags();
    
    // Source change handler
    if (sourceSelect) {
        sourceSelect.addEventListener('change', function() {
            currentSource = this.value;
            pnum = 1;
            currentCategory = '';
            searchKeyword = '';
            hasMoreManga = true;
            loadTags();
        });
    }
    
    // Back button
    var backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.history.back();
        });
    }
    
    // Menu toggle
    var menuBtn = document.getElementById('menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            toggleSidebar();
        });
    }
    
    var toggleSidebarBtn = document.getElementById('toggleSidebar');
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', function() {
            toggleSidebar();
        });
    }
    
    // Search handler
    var searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                var keyword = this.value.trim();
                searchMangas(keyword);
            }
        });
    }
    
    // Scroll to load more
    var contentArea = document.getElementById('contentArea');
    if (contentArea) {
        contentArea.addEventListener('scroll', function() {
            var scrollTop = this.scrollTop;
            var scrollHeight = this.scrollHeight;
            var height = this.clientHeight;
            
            if (scrollTop + height >= scrollHeight - 100) {
                if (!isLoading && hasMoreManga) {
                    loadMangas(currentCategory, true);
                }
            }
        });
    }
});
