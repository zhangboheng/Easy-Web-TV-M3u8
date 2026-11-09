// Novel List Page JS - Modern UI Version
// Native JavaScript (No jQuery)

// CORS proxy + failover now live in ../js/apiproxy.js (fetchWithProxy)
// CORS proxy + failover now live in ../js/apiproxy.js (fetchWithProxy)

// Novel source registry: each source defines its own categories, list parser and search builder.
// To add a source: register it here, add a parser branch in loadNovels(), a branch in
// searchNovels(), and a parser in js/novel.js (reader side, dispatched by the ?src= param).
var NOVEL_SOURCES = {
    royalroad: {
        name: 'Royal Road',
        origin: 'https://www.royalroad.com',
        categories: [
            { name: 'All', url: 'https://www.royalroad.com/fictions/best-rated' },
            { name: 'Best Rated', url: 'https://www.royalroad.com/fictions/best-rated' },
            { name: 'Trending', url: 'https://www.royalroad.com/fictions/trending' },
            { name: 'Ongoing', url: 'https://www.royalroad.com/fictions/ongoing' },
            { name: 'Completed', url: 'https://www.royalroad.com/fictions/completed' },
            { name: 'Popular This Week', url: 'https://www.royalroad.com/fictions/weekly-popular' },
            { name: 'Latest Updates', url: 'https://www.royalroad.com/fictions/latest-updates' },
            { name: 'New Releases', url: 'https://www.royalroad.com/fictions/new' },
            { name: 'Rising Stars', url: 'https://www.royalroad.com/fictions/rising-stars' }
        ]
    },
    hetushu: {
        name: '和图书 (中文)',
        origin: 'https://www.hetushu.com',
        categories: [
            { name: '全部小说', url: 'https://www.hetushu.com/book/index.php' },
            { name: '完本', url: 'https://www.hetushu.com/book/index.php?state=2' },
            { name: '连载', url: 'https://www.hetushu.com/book/index.php?state=1' }
        ]
    }
};

// Global variables
var pnum = 1;
var currentCategory = '';
var currentSource = '';   // source id: 'royalroad' | 'hetushu'
var currentListUrl = '';   // Base URL of the currently rendered list (category or search)
var hasMoreNovels = true;  // Stop paginating once a page returns no novels
var lastFirstNovelUrl = '';  // dedup guard for sources whose last page repeats content instead of being empty
var isLoading = false;


// Global variables
var pnum = 1;
var currentCategory = '';
var currentSource = '';
var currentListUrl = '';   // Base URL of the currently rendered list (category or search)
var hasMoreNovels = true;  // Stop paginating once a page returns no novels
var isLoading = false;

// Toast notification
function showToast(message, type = 'info') {
    var iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    // Remove existing toasts
    document.querySelectorAll('.toast-notification').forEach(function(el) {
        el.remove();
    });
    
    var toast = document.createElement('div');
    toast.className = 'toast-notification ' + type;
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        padding: 15px 20px;
        background: rgba(0,0,0,0.9);
        border: 2px solid ${type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#a3001b'};
        border-radius: 10px;
        color: #fff;
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 10px;
        animation: slideIn 0.3s ease;
    `;
    
    var icon = document.createElement('i');
    icon.className = 'fas ' + iconMap[type];
    icon.style.color = type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#a3001b';
    
    var span = document.createElement('span');
    span.textContent = message;
    
    toast.appendChild(icon);
    toast.appendChild(span);
    document.body.appendChild(toast);
    
    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3000);
}

// Show/Hide loading
function showLoading(show = true) {
    var indicator = document.getElementById('loadMoreIndicator');
    if (indicator) {
        indicator.style.display = show ? '' : 'none';
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

// Render novel cards
function renderNovels(novels, append = false) {
    var grid = document.getElementById('contentGrid');
    
    if (!append) {
        grid.innerHTML = '';
        grid.classList.add('has-results');
    }
    
    novels.forEach(function(novel) {
        var card = document.createElement('a');
        var playSrc = novel.url.indexOf('hetushu.com') > -1 ? 'hetushu' : 'royalroad';
        card.href = '../catalogues/novelplay.html?web=' + encodeURIComponent(novel.url) + '&src=' + playSrc;
        card.className = 'card-item';
        card.innerHTML = `
            <img class="card-image" src="${novel.image}" alt="${novel.title}" onerror="this.src='../images/noimage.jpeg'">
            <div class="card-overlay"></div>
            <div class="card-play-icon">
                <i class="fas fa-book-open"></i>
            </div>
            <div class="card-info">
                <div class="card-type">Novel</div>
                <h3 class="card-title">${novel.title}</h3>
                <p class="card-author">${novel.author ? '[' + novel.author + ']' : ''}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Render categories
function renderCategories(categories) {
    var list = document.getElementById('categoryList');
    list.innerHTML = '';
    
    categories.forEach(function(cat, index) {
        var item = document.createElement('div');
        item.className = 'category-item' + (index === 0 ? ' active' : '');
        item.dataset.url = cat.url;
        item.dataset.name = cat.name;
        item.innerHTML = `
            <i class="fas fa-bookmark"></i>
            <span>${cat.name}</span>
        `;
        list.appendChild(item);
    });
    
    // Bind click events
    document.querySelectorAll('.category-item').forEach(function(item) {
        item.addEventListener('click', function() {
            document.querySelectorAll('.category-item').forEach(function(el) {
                el.classList.remove('active');
            });
            this.classList.add('active');
            
            var url = this.dataset.url;
            currentCategory = url;
            currentListUrl = url;
            pnum = 1;
            hasMoreNovels = true;
            lastFirstNovelUrl = '';
            loadNovels(url, false);
            
            // Hide sidebar on mobile
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('show-mobile');
            }
        });
    });
}

// Load novels from source
function loadNovels(url, append = true) {
    if (isLoading) return;
    isLoading = true;
    showLoading(true);
    
    fetchWithProxy(url)
        .then(function(data) {
            var parser = new DOMParser();
            var html = parser.parseFromString(data, 'text/html');
            var novels = [];
            if (currentSource === 'royalroad') {
                // Royal Road
                html.querySelectorAll('.fiction-list-item').forEach(function(item) {
                    var titleEl = item.querySelector('.fiction-title a');
                    var title = titleEl ? titleEl.textContent.trim() : '';
                    var novelUrl = titleEl ? 'https://www.royalroad.com' + titleEl.getAttribute('href') : '';
                    var imageEl = item.querySelector('img');
                    var image = imageEl ? imageEl.getAttribute('src') : '';
                    var authorEl = item.querySelector('.author a');
                    var author = authorEl ? authorEl.textContent.trim() : '';
                    
                    if (title && novelUrl) {
                        novels.push({
                            title: title,
                            url: novelUrl,
                            image: image || '../images/noimage.jpeg',
                            author: author
                        });
                    }
                });
            } else if (currentSource === 'hetushu') {
                // 和图书: list/library/search cards are blocks containing a /book/{id}/index.html link
                var cardMap = {};
                html.querySelectorAll('a[href*="/book/"]').forEach(function(a) {
                    var href = a.getAttribute('href') || '';
                    var m = href.match(/\/book\/(\d+)\//);
                    if (!m) return;
                    var key = m[1];
                    if (!cardMap[key]) {
                        cardMap[key] = {
                            title: '',
                            url: 'https://www.hetushu.com/book/' + key + '/index.html',
                            image: '',
                            author: ''
                        };
                    }
                    var card = cardMap[key];
                    if (!card.image) {
                        var img = a.querySelector('img');
                        if (img) {
                            var imgSrc = img.getAttribute('src') || '';
                            if (imgSrc && imgSrc.charAt(0) === '/') imgSrc = 'https://www.hetushu.com' + imgSrc;
                            card.image = imgSrc;
                        }
                    }
                    if (!card.title) {
                        var t = a.getAttribute('title') || a.textContent.trim();
                        if (t) card.title = t;
                    }
                });
                // Second pass: author name from surrounding <li> containers
                html.querySelectorAll('li').forEach(function(li) {
                    var a = li.querySelector('a[href*="/book/"]');
                    if (!a) return;
                    var m = (a.getAttribute('href') || '').match(/\/book\/(\d+)\//);
                    if (m && cardMap[m[1]] && !cardMap[m[1]].author) {
                        var au = li.querySelector('.author');
                        if (au) cardMap[m[1]].author = au.textContent.replace(/^作者[:：]?/, '').trim();
                    }
                });
                Object.keys(cardMap).forEach(function(key) {
                    var card = cardMap[key];
                    if (card.title) {
                        if (!card.image) card.image = '../images/noimage.jpeg';
                        novels.push(card);
                    }
                });
            }
            
            renderNovels(novels, append);
            
            // An empty page means we reached the end of the list.
            // hetushu repeats page 1 content on out-of-range pages instead of returning an
            // empty page, so stop paginating when the first novel matches the previous page.
            if (novels.length > 0 && novels[0].url === lastFirstNovelUrl) {
                hasMoreNovels = false;
            } else {
                hasMoreNovels = novels.length > 0;
            }
            if (novels.length > 0) {
                lastFirstNovelUrl = novels[0].url;
            }
            
            isLoading = false;
            showLoading(false);
        })
        .catch(function(error) {
            showToast('Failed to load novels', 'error');
            isLoading = false;
            showLoading(false);
        });
}

// Load categories from source (all categories are predefined per source, no fetch needed)
function loadCategories() {
    document.getElementById('categoryList').innerHTML = '<div class="loading-state"><i class="fas fa-spinner"></i><span>Loading...</span></div>';
    
    var source = NOVEL_SOURCES[currentSource];
    var categories = source ? source.categories : [];
    
    renderCategories(categories);
    
    // Load first category
    if (categories.length > 0) {
        currentCategory = categories[0].url;
        currentListUrl = categories[0].url;
        pnum = 1;
        hasMoreNovels = true;
        lastFirstNovelUrl = '';
        loadNovels(categories[0].url, false);
    }
}

// Search novels
function searchNovels(keyword) {
    if (!keyword) return;
    
    var searchUrl = '';
    
    if (currentSource === 'royalroad') {
        searchUrl = 'https://www.royalroad.com/fictions/search?title=' + encodeURIComponent(keyword);
    } else if (currentSource === 'hetushu') {
        searchUrl = 'https://www.hetushu.com/search/?keyword=' + encodeURIComponent(keyword);
    }
    
    if (searchUrl) {
        lastFirstNovelUrl = '';
        currentListUrl = searchUrl;
        pnum = 1;
        hasMoreNovels = true;
        loadNovels(searchUrl, false);
    } else {
        showToast('Search not available for this source', 'warning');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Novel List Page Loaded ===');
    
    // Load source options
    var sourceSelect = document.getElementById('sourceSelect');
    if (sourceSelect) {
        Object.keys(NOVEL_SOURCES).forEach(function(id) {
            var option = document.createElement('option');
            option.value = id;
            option.textContent = NOVEL_SOURCES[id].name;
            sourceSelect.appendChild(option);
        });
        
        // Set initial source
        currentSource = sourceSelect.value;
    }
    
    // Load initial data
    loadCategories();
    
    // Source change handler
    if (sourceSelect) {
        sourceSelect.addEventListener('change', function() {
            currentSource = this.value;
            pnum = 1;
            loadCategories();
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
    
    // Search handlers
    var searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                var keyword = this.value.trim();
                if (keyword) {
                    searchNovels(keyword);
                }
            }
        });
    }
    
    var sidebarSearch = document.getElementById('sidebarSearch');
    if (sidebarSearch) {
        sidebarSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                var keyword = this.value.trim();
                if (keyword) {
                    searchNovels(keyword);
                }
            }
        });
    }
    
    // Scroll to load more: paginate the current list with ?page=N
    // (Royal Road supports ?page=N on both category lists and search results;
    //  use & as separator when the base URL already has a query string)
    var contentArea = document.getElementById('contentArea');
    if (contentArea) {
        contentArea.addEventListener('scroll', function() {
            var scrollTop = this.scrollTop;
            var scrollHeight = this.scrollHeight;
            var height = this.offsetHeight;
            
            if (scrollTop + height >= scrollHeight - 100) {
                if (!isLoading && hasMoreNovels && currentListUrl) {
                    pnum++;
                    var separator = currentListUrl.indexOf('?') > -1 ? '&' : '?';
                    loadNovels(currentListUrl + separator + 'page=' + pnum, true);
                }
            }
        });
    }
});
