// Comprehensive (Theater) Page JS - Modern UI Version
// Native JavaScript (No jQuery)

// Source ID to URL mapping for Movie sources
var movieSources = {
    'hyzy': { url: 'https://www.huyaapi.com/api.php/provide/vod/at/json', name: '虎牙资源' },
    'xlzy': { url: 'https://api.xinlangapi.com/xinlangapi.php/provide/vod/json', name: '新浪资源' },
    'gszy': { url: 'https://api.guangsuapi.com/api.php/provide/vod/json', name: '光速资源' },
    'hnzy': { url: 'https://www.hongniuzy2.com/api.php/provide/vod/at/json/', name: '红牛资源' },
    'tky': { url: 'https://caiji.maotaizy.cc/api.php/provide/vod/at/json/', name: '茅台资源' },
    'bjy': { url: 'https://cj.rycjapi.com/api.php/provide/vod/at/json/', name: '如意资源' }
};

// CORS proxy + failover now live in ../js/apiproxy.js (fetchJSONWithProxy)

// Global variables
var currentLink = '';
var currentCategory = '';
var pageNum = 1;
var isLoading = false;

// Toast notification
function showToast(message, type) {
    type = type || 'info';
    var iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    var existingToast = document.querySelector('.toast-notification');
    if (existingToast) existingToast.remove();
    
    var borderColor = type === 'error' ? '#dc3545' : type === 'success' ? '#28a745' : '#a3001b';
    var iconColor = borderColor;
    
    var toast = document.createElement('div');
    toast.className = 'toast-notification ' + type;
    toast.style.cssText = 'position: fixed; top: 80px; right: 20px; padding: 15px 20px; background: rgba(0,0,0,0.9); border: 2px solid ' + borderColor + '; border-radius: 10px; color: #fff; z-index: 9999; display: flex; align-items: center; gap: 10px;';
    toast.innerHTML = '<i class="fas ' + iconMap[type] + '" style="color: ' + iconColor + '"></i><span>' + message + '</span>';
    
    document.body.appendChild(toast);
    
    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3000);
}

// Filter ad text from category names
function filterTypeName(name) {
    if (!name) return name;
    return name.replace(/\\?">\* src=https?:\/\/[^\s<]+<\/script>/gi, '').trim();
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

// Show/Hide loading
function showLoading(show, isSearch) {
    show = show !== false;
    isSearch = isSearch || false;
    
    if (show) {
        if (isSearch) {
            var contentArea = document.getElementById('contentArea');
            var existingSearchLoading = contentArea.querySelector('.search-loading');
            if (existingSearchLoading) existingSearchLoading.remove();
            document.getElementById('contentGrid').style.display = 'none';
            var loadingDiv = document.createElement('div');
            loadingDiv.className = 'loading-state search-loading';
            loadingDiv.innerHTML = '<i class="fas fa-spinner"></i><span>Searching...</span>';
            contentArea.insertBefore(loadingDiv, contentArea.firstChild);
        } else if (pageNum > 1) {
            document.getElementById('loadMoreIndicator').style.display = '';
        } else {
            document.getElementById('contentGrid').innerHTML = '<div class="loading-state"><i class="fas fa-spinner"></i><span>Loading videos...</span></div>';
        }
    } else {
        document.getElementById('loadMoreIndicator').style.display = 'none';
        var searchLoading = document.querySelector('.search-loading');
        if (searchLoading) searchLoading.remove();
        document.getElementById('contentGrid').style.display = '';
    }
}

// Load categories
function loadCategories(link) {
    var baseUrl = link.endsWith('/') ? link : link + '/';
    var apiUrl = baseUrl + '?ac=&pg=1';
    
    document.getElementById('categoryList').innerHTML = '<div class="loading-state"><i class="fas fa-spinner"></i><span>Loading categories...</span></div>';
    
    fetchJSONWithProxy(apiUrl)
        .then(function(data) {
            var categoryList = document.getElementById('categoryList');
            categoryList.innerHTML = '';
            
            var categories = data.class || [];
            
            // Add "Latest Update" category
            var latestCat = document.createElement('div');
            latestCat.className = 'category-item active';
            latestCat.dataset.id = '';
            latestCat.innerHTML = '<i class="fas fa-clock"></i><span>最新更新</span>';
            categoryList.appendChild(latestCat);
            
            // Add other categories
            for (var i = 0; i < categories.length; i++) {
                var cat = categories[i];
                var catId = cat.type_id;
                var catName = filterTypeName(cat.type_name);
                
                var catItem = document.createElement('div');
                catItem.className = 'category-item';
                catItem.dataset.id = catId;
                catItem.innerHTML = '<i class="fas fa-folder"></i><span>' + catName + '</span>';
                categoryList.appendChild(catItem);
            }
            
            // Bind click handler
            document.querySelectorAll('.category-item').forEach(function(item) {
                item.addEventListener('click', function() {
                    document.querySelectorAll('.category-item').forEach(function(el) {
                        el.classList.remove('active');
                    });
                    this.classList.add('active');
                    currentCategory = this.dataset.id;
                    pageNum = 1;
                    document.getElementById('searchInput').value = '';
                    loadVideos(currentLink, currentCategory, 1);
                    
                    // Hide sidebar on mobile
                    if (window.innerWidth <= 768) {
                        document.getElementById('sidebar').classList.remove('show-mobile');
                    }
                });
            });
        })
        .catch(function() {
            document.getElementById('categoryList').innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Failed to load categories</p></div>';
            showToast('Failed to load categories', 'error');
        });
}

// Load videos
function loadVideos(link, category, page) {
    if (isLoading) return;
    isLoading = true;
    
    if (page === 1) {
        showLoading(true, false);
    } else {
        showLoading(true, false);
    }
    
    var baseUrl = link.endsWith('/') ? link : link + '/';
    var apiUrl = category
        ? baseUrl + '?ac=videolist&t=' + category + '&pg=' + page
        : baseUrl + '?ac=videolist&pg=' + page;
    
    fetchJSONWithProxy(apiUrl)
        .then(function(data) {
            if (page === 1) {
                document.getElementById('contentGrid').innerHTML = '';
            }
            
            var videos = data.list || [];
            
            if (videos.length === 0 && page === 1) {
                document.getElementById('contentGrid').innerHTML = '<div class="empty-state"><i class="fas fa-video-slash"></i><p>No videos found</p></div>';
            } else {
                document.getElementById('contentGrid').classList.add('has-results');
                
                for (var i = 0; i < videos.length; i++) {
                    var video = videos[i];
                    var videoId = video.vod_id;
                    var videoName = video.vod_name;
                    var videoPic = video.vod_pic || '../images/noimage.jpeg';
                    var videoType = filterTypeName(video.type_name) || '未知';
                    
                    var cardHtml = '<a href="../catalogues/complay.html?web=' + link + '&tab=' + videoId + '" class="card-item">' +
                        '<img class="card-image" src="' + videoPic + '" alt="' + videoName + '" onerror="this.src=\'../images/noimage.jpeg\'">' +
                        '<div class="card-overlay"></div>' +
                        '<div class="card-play-icon"><i class="fas fa-play"></i></div>' +
                        '<div class="card-info">' +
                        '<span class="card-type">' + videoType + '</span>' +
                        '<h4 class="card-title">' + videoName + '</h4>' +
                        '</div></a>';
                    
                    document.getElementById('contentGrid').insertAdjacentHTML('beforeend', cardHtml);
                }
            }
            
            showLoading(false);
            isLoading = false;
        })
        .catch(function() {
            if (page === 1) {
                document.getElementById('contentGrid').innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Failed to load videos</p></div>';
            }
            showLoading(false);
            isLoading = false;
            showToast('Failed to load videos', 'error');
        });
}

// Search videos
function searchVideos(link, term, page) {
    if (isLoading) return;
    isLoading = true;
    
    showLoading(page > 1, page === 1);
    
    var baseUrl = link.endsWith('/') ? link : link + '/';
    var apiUrl = baseUrl + '?ac=videolist&wd=' + encodeURIComponent(term) + '&pg=' + (page || 1);
    
    fetchJSONWithProxy(apiUrl)
        .then(function(data) {
            if (page === 1) {
                var contentGrid = document.getElementById('contentGrid');
                contentGrid.classList.remove('has-results');
                contentGrid.innerHTML = '';
            }
            
            showLoading(false);
            
            var videos = data.list || data.vod_list || data.data || [];
            
            if (videos.length === 0 && page === 1) {
                document.getElementById('contentGrid').innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>No results found for "' + term + '"</p></div>';
            } else if (videos.length > 0) {
                document.getElementById('contentGrid').classList.add('has-results');
                
                for (var i = 0; i < videos.length; i++) {
                    var video = videos[i];
                    var videoId = video.vod_id;
                    var videoName = video.vod_name;
                    var videoPic = video.vod_pic || '../images/noimage.jpeg';
                    var videoType = filterTypeName(video.type_name) || '未知';
                    
                    var cardHtml = '<a href="../catalogues/complay.html?web=' + link + '&tab=' + videoId + '" class="card-item">' +
                        '<img class="card-image" src="' + videoPic + '" alt="' + videoName + '" onerror="this.src=\'../images/noimage.jpeg\'">' +
                        '<div class="card-overlay"></div>' +
                        '<div class="card-play-icon"><i class="fas fa-play"></i></div>' +
                        '<div class="card-info">' +
                        '<span class="card-type">' + videoType + '</span>' +
                        '<h4 class="card-title">' + videoName + '</h4>' +
                        '</div></a>';
                    
                    document.getElementById('contentGrid').insertAdjacentHTML('beforeend', cardHtml);
                }
            }
            
            isLoading = false;
        })
        .catch(function() {
            showLoading(false);
            
            if (page === 1) {
                document.getElementById('contentGrid').innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>Search failed</p></div>';
            }
            
            isLoading = false;
            showToast('Search failed', 'error');
        });
}

// Initialize source select from localStorage
function initSourceSelect() {
    var savedSources = localStorage.getItem('movie');
    var sourceSelect = document.getElementById('sourceSelect');
    
    // Clear existing options
    sourceSelect.innerHTML = '';
    
    if (savedSources) {
        // Parse saved sources
        var sourceIds = savedSources.split(',');
        var hasValidSource = false;
        
        // Add only saved sources
        sourceIds.forEach(function(id) {
            if (movieSources[id]) {
                var option = document.createElement('option');
                option.value = movieSources[id].url;
                option.textContent = movieSources[id].name;
                sourceSelect.appendChild(option);
                hasValidSource = true;
            }
        });
        
        // If no valid sources found, add all sources
        if (!hasValidSource) {
            Object.keys(movieSources).forEach(function(id) {
                var option = document.createElement('option');
                option.value = movieSources[id].url;
                option.textContent = movieSources[id].name;
                sourceSelect.appendChild(option);
            });
        }
    } else {
        // No saved settings, add all sources
        Object.keys(movieSources).forEach(function(id) {
            var option = document.createElement('option');
            option.value = movieSources[id].url;
            option.textContent = movieSources[id].name;
            sourceSelect.appendChild(option);
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Theater (Comprehensive) Page Loaded ===');
    
    // Initialize source select from localStorage
    initSourceSelect();
    
    // Set initial source
    currentLink = document.getElementById('sourceSelect').value;
    
    // Load initial data
    loadCategories(currentLink);
    loadVideos(currentLink, '', 1);
    
    // Back button
    document.getElementById('backBtn').addEventListener('click', function() {
        window.history.back();
    });
    
    // Menu toggle
    document.getElementById('menuBtn').addEventListener('click', function() {
        toggleSidebar();
    });
    
    document.getElementById('toggleSidebar').addEventListener('click', function() {
        toggleSidebar();
    });
    
    // Source select change
    document.getElementById('sourceSelect').addEventListener('change', function() {
        currentLink = this.value;
        currentCategory = '';
        pageNum = 1;
        loadCategories(currentLink);
        loadVideos(currentLink, '', 1);
    });
    
    // Search handler
    document.getElementById('searchInput').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            var searchTerm = this.value.trim();
            if (searchTerm) {
                currentCategory = '';
                pageNum = 1;
                document.querySelectorAll('.category-item').forEach(function(el) {
                    el.classList.remove('active');
                });
                searchVideos(currentLink, searchTerm, 1);
            } else {
                loadVideos(currentLink, currentCategory, 1);
            }
        }
    });
    
    // Infinite scroll
    document.getElementById('contentArea').addEventListener('scroll', function() {
        var scrollTop = this.scrollTop;
        var scrollHeight = this.scrollHeight;
        var clientHeight = this.clientHeight;
        
        if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading) {
            pageNum++;
            var searchTerm = document.getElementById('searchInput').value.trim();
            if (searchTerm) {
                searchVideos(currentLink, searchTerm, pageNum);
            } else {
                loadVideos(currentLink, currentCategory, pageNum);
            }
        }
    });
});
