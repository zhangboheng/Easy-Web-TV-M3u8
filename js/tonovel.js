// Novel List Page JS - Modern UI Version
// Native JavaScript (No jQuery)

// CORS proxy + failover now live in ../js/apiproxy.js (fetchWithProxy)

// Global variables
var pnum = 1;
var currentCategory = '';
var currentSource = '';
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
        card.href = '../catalogues/novelplay.html?web=' + novel.url;
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
            pnum = 1;
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
            
            if (currentSource.indexOf('royalroad.com') > -1) {
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
            }
            
            renderNovels(novels, append);
            isLoading = false;
            showLoading(false);
        })
        .catch(function(error) {
            showToast('Failed to load novels', 'error');
            isLoading = false;
            showLoading(false);
        });
}

// Load categories from source
function loadCategories(sourceUrl) {
    document.getElementById('categoryList').innerHTML = '<div class="loading-state"><i class="fas fa-spinner"></i><span>Loading...</span></div>';
    
    fetchWithProxy(sourceUrl)
        .then(function(data) {
            var categories = [];
            
            if (sourceUrl.indexOf('royalroad.com') > -1) {
                // Royal Road - predefined categories
                categories = [
                    { name: 'All', url: 'https://www.royalroad.com/fictions/best-rated' },
                    { name: 'Best Rated', url: 'https://www.royalroad.com/fictions/best-rated' },
                    { name: 'Trending', url: 'https://www.royalroad.com/fictions/trending' },
                    { name: 'Ongoing', url: 'https://www.royalroad.com/fictions/ongoing' },
                    { name: 'Completed', url: 'https://www.royalroad.com/fictions/completed' },
                    { name: 'Popular This Week', url: 'https://www.royalroad.com/fictions/weekly-popular' },
                    { name: 'Latest Updates', url: 'https://www.royalroad.com/fictions/latest-updates' },
                    { name: 'New Releases', url: 'https://www.royalroad.com/fictions/new' },
                    { name: 'Rising Stars', url: 'https://www.royalroad.com/fictions/rising-stars' }
                ];
            }
            
            renderCategories(categories);
            
            // Load first category
            if (categories.length > 0) {
                currentCategory = categories[0].url;
                pnum = 1;
                loadNovels(categories[0].url, false);
            }
        })
        .catch(function(error) {
            showToast('Failed to load categories', 'error');
        });
}

// Search novels
function searchNovels(keyword) {
    if (!keyword) return;
    
    var searchUrl = '';
    
    if (currentSource.indexOf('royalroad.com') > -1) {
        searchUrl = 'https://www.royalroad.com/fictions/search?title=' + encodeURIComponent(keyword);
    }
    
    if (searchUrl) {
        pnum = 1;
        loadNovels(searchUrl, false);
    } else {
        showToast('Search not available for this source', 'warning');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Novel List Page Loaded ===');
    
    // Load source options - only Royal Road (other sources are defunct)
    var sourceSelect = document.getElementById('sourceSelect');
    if (sourceSelect) {
        var option = document.createElement('option');
        option.value = 'https://www.royalroad.com/';
        option.textContent = 'Royal Road';
        sourceSelect.appendChild(option);
        
        // Set initial source
        currentSource = sourceSelect.value;
    }
    
    // Load initial data
    loadCategories(currentSource);
    
    // Source change handler
    if (sourceSelect) {
        sourceSelect.addEventListener('change', function() {
            currentSource = this.value;
            pnum = 1;
            loadCategories(currentSource);
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
    
    // Scroll to load more
    var contentArea = document.getElementById('contentArea');
    if (contentArea) {
        contentArea.addEventListener('scroll', function() {
            var scrollTop = this.scrollTop;
            var scrollHeight = this.scrollHeight;
            var height = this.offsetHeight;
            
            if (scrollTop + height >= scrollHeight - 100) {
                if (!isLoading && currentCategory) {
                    pnum++;
                    // Load more logic would go here based on source
                }
            }
        });
    }
});
