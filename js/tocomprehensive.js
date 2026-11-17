// Comprehensive (Theater) Page JS - Modern UI Version
// Native JavaScript (No jQuery)

// Source ID to URL mapping for Movie sources
// lang: content language badge shown in the source picker dialog
// archive: uses the archive.org data loader instead of the Chinese CMS API
var movieSources = {
    'archive_classic': { url: 'https://archive.org', name: 'Classic Movies (Public Domain)', lang: 'en', archive: true },
    'hyzy': { url: 'https://www.huyaapi.com/api.php/provide/vod/at/json', name: '虎牙资源', lang: 'zh' },
    'xlzy': { url: 'https://api.xinlangapi.com/xinlangapi.php/provide/vod/json', name: '新浪资源', lang: 'zh' },
    'gszy': { url: 'https://api.guangsuapi.com/api.php/provide/vod/json', name: '光速资源', lang: 'zh' },
    'hnzy': { url: 'https://www.hongniuzy2.com/api.php/provide/vod/at/json/', name: '红牛资源', lang: 'zh' },
    'tky': { url: 'https://caiji.maotaizy.cc/api.php/provide/vod/at/json/', name: '茅台资源', lang: 'zh' },
    'bjy': { url: 'https://cj.rycjapi.com/api.php/provide/vod/at/json/', name: '如意资源', lang: 'zh' }
};

// ============================== Lightweight i18n ==============================
// The main-page translator only targets index.html's DOM, so the Theater page
// carries its own small dictionary. Reads the same localStorage keys the main
// page stores (preferredLanguage / languages); anything unknown falls back to English.
var TC_I18N = {
    en: {
        dlgTitle: 'Choose Movie Sources',
        dlgDesc: 'Movie feeds come from community CMS APIs (Chinese) plus public-domain classics from archive.org (English). Pick the sources you want — you can change this later from the source dropdown at the top.',
        dlgConfirm: 'Confirm',
        dlgSkip: 'Use all sources',
        langZh: 'Chinese',
        langEn: 'English',
        latest: 'Latest Updates',
        loadingCats: 'Loading categories...',
        loadingVids: 'Loading videos...',
        noVideos: 'No videos found',
        failCats: 'Failed to load categories',
        failVids: 'Failed to load videos',
        searchFail: 'Search failed',
        searching: 'Searching...',
        noResults: 'No results found',
        needSource: 'Please select at least one source',
        editSources: '⚙ Edit sources...',
        searchPh: 'Search videos...',
        unknown: 'Unknown'
    },
    zh: {
        dlgTitle: '选择影片内容源',
        dlgDesc: '影片源来自社区 CMS 资源站（中文）以及 archive.org 的公共领域经典电影（英文）。选择你想看的源——之后可随时在顶部下拉框里修改。',
        dlgConfirm: '确认',
        dlgSkip: '使用全部源',
        langZh: '中文',
        langEn: '英文',
        latest: '最新更新',
        loadingCats: '正在加载分类...',
        loadingVids: '正在加载影片...',
        noVideos: '没有找到影片',
        failCats: '分类加载失败',
        failVids: '影片加载失败',
        searchFail: '搜索失败',
        searching: '搜索中...',
        noResults: '没有找到结果',
        needSource: '请至少选择一个内容源',
        editSources: '⚙ 编辑内容源...',
        searchPh: '搜索影片...',
        unknown: '未知'
    }
};

function tcLang() {
    try {
        var lang = localStorage.getItem('preferredLanguage') || localStorage.getItem('languages')
            || (navigator.language || 'en');
        if (lang && lang.toLowerCase().indexOf('zh') === 0) return 'zh';
        if (lang && lang.toLowerCase().indexOf('en') === 0) return 'en';
    } catch (e) { /* storage unavailable */ }
    return 'en';
}

function tcT(key) {
    var lang = tcLang();
    return (TC_I18N[lang] && TC_I18N[lang][key]) || TC_I18N.en[key] || key;
}

// Common Chinese CMS category names -> English display names (used when the
// UI language is not Chinese; unknown categories keep their original name).
var TC_CATEGORY_MAP = {
    '动作片': 'Action', '喜剧片': 'Comedy', '爱情片': 'Romance', '科幻片': 'Sci-Fi',
    '恐怖片': 'Horror', '剧情片': 'Drama', '战争片': 'War', '纪录片': 'Documentary',
    '动画片': 'Animation', '犯罪片': 'Crime', '奇幻片': 'Fantasy', '悬疑片': 'Mystery',
    '惊悚片': 'Thriller', '冒险片': 'Adventure', '灾难片': 'Disaster', '武侠片': 'Wuxia',
    '古装片': 'Costume', '历史片': 'History', '歌舞片': 'Musical', '伦理片': 'Ethics',
    '音乐片': 'Music', '传记片': 'Biography', '体育片': 'Sports', '西部片': 'Western',
    '连续剧': 'TV Series', '国产剧': 'CN Series', '内地剧': 'CN Series',
    '港台剧': 'HK/TW Series', '香港剧': 'HK Series', '台湾剧': 'TW Series',
    '日韩剧': 'JP/KR Series', '韩国剧': 'KR Series', '韩剧': 'KR Series',
    '日本剧': 'JP Series', '日剧': 'JP Series', '美国剧': 'US Series',
    '欧美剧': 'Western Series', '海外剧': 'Overseas Series', '泰国剧': 'TH Series',
    '马泰剧': 'SEA Series', '港台综艺': 'HK/TW Variety', '日韩综艺': 'JP/KR Variety',
    '欧美综艺': 'Western Variety', '动漫': 'Anime', '日韩动漫': 'JP/KR Anime',
    '欧美动漫': 'Western Anime', '港澳台动漫': 'HK/TW Anime', '日本动漫': 'JP Anime',
    '综艺': 'Variety Show', '短片': 'Short Film', '预告片': 'Trailer',
    '体育': 'Sports', '电影': 'Movies', '电视剧': 'TV Series'
};

function tcCategory(name) {
    if (!name) return name;
    if (tcLang() === 'zh') return filterTypeName(name);
    var clean = filterTypeName(name);
    return TC_CATEGORY_MAP[clean] || clean;
}


// CORS proxy + failover now live in ../js/apiproxy.js (fetchJSONWithProxy)

// Global variables
var currentLink = '';
var currentCategory = '';
var videoRequestSeq = 0; // generation token: stale responses of switched-away requests are dropped
var pageNum = 1;
var isLoading = false;
var noMoreData = false;

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
            loadingDiv.innerHTML = '<i class="fas fa-spinner"></i><span>' + tcT('searching') + '</span>';
            contentArea.insertBefore(loadingDiv, contentArea.firstChild);
        } else if (pageNum > 1) {
            document.getElementById('loadMoreIndicator').style.display = '';
        } else {
            document.getElementById('contentGrid').innerHTML = '<div class="loading-state"><i class="fas fa-spinner"></i><span>' + tcT('loadingVids') + '</span></div>';
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
    // archive.org source has fixed "All movies" pseudo-category
    if (link === 'https://archive.org') {
        renderArchiveCategories();
        return;
    }
    var baseUrl = link.endsWith('/') ? link : link + '/';
    var apiUrl = baseUrl + '?ac=&pg=1';
    
    document.getElementById('categoryList').innerHTML = '<div class="loading-state"><i class="fas fa-spinner"></i><span>' + tcT('loadingCats') + '</span></div>';
    
    fetchJSONWithProxy(apiUrl)
        .then(function(data) {
            var categoryList = document.getElementById('categoryList');
            categoryList.innerHTML = '';
            
            var categories = data.class || [];
            
            // Add "Latest Update" category
            var latestCat = document.createElement('div');
            latestCat.className = 'category-item active';
            latestCat.dataset.id = '';
            latestCat.innerHTML = '<i class="fas fa-clock"></i><span>' + tcT('latest') + '</span>';
            categoryList.appendChild(latestCat);
            
            // Add other categories
            for (var i = 0; i < categories.length; i++) {
                var cat = categories[i];
                var catId = cat.type_id;
                var catName = tcCategory(cat.type_name);
                
                var catItem = document.createElement('div');
                catItem.className = 'category-item';
                catItem.dataset.id = catId;
                catItem.innerHTML = '<i class="fas fa-folder"></i><span>' + escapeHtml(catName) + '</span>';
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
            document.getElementById('categoryList').innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>' + tcT('failCats') + '</p></div>';
            showToast(tcT('failCats'), 'error');
        });
}

// Load videos
function loadVideos(link, category, page, force) {
    // force=true (source switch): override an in-flight request via the
    // generation token; regular calls (infinite scroll) still debounce
    if (isLoading && !force) return;
    var seq = ++videoRequestSeq;
    isLoading = true;
    if ((page || 1) === 1) noMoreData = false;
    
    if (page === 1) {
        showLoading(true, false);
    } else {
        showLoading(true, false);
    }
    
    // archive.org source: classic movies via the advancedsearch API
    if (link === 'https://archive.org') {
        loadArchiveVideos(category, page, seq);
        return;
    }
    
    var baseUrl = link.endsWith('/') ? link : link + '/';
    var apiUrl = category
        ? baseUrl + '?ac=videolist&t=' + category + '&pg=' + page
        : baseUrl + '?ac=videolist&pg=' + page;
    fetchJSONWithProxy(apiUrl)
        .then(function(data) {
            if (seq !== videoRequestSeq) return; // stale: a newer request took over
            if (page === 1) {
                document.getElementById('contentGrid').innerHTML = '';
            }
            
            var videos = data.list || [];
            
            if (videos.length === 0) {
                noMoreData = true;
            }
            
            if (videos.length === 0 && page === 1) {
                document.getElementById('contentGrid').innerHTML = '<div class="empty-state"><i class="fas fa-video-slash"></i><p>' + tcT('noVideos') + '</p></div>';
            } else if (videos.length > 0) {
                document.getElementById('contentGrid').classList.add('has-results');
                
                for (var i = 0; i < videos.length; i++) {
                    var video = videos[i];
                    var videoId = video.vod_id;
                    var videoName = video.vod_name;
                    var videoPic = video.vod_pic || '../images/noimage.jpeg';
                    var videoType = tcCategory(video.type_name) || tcT('unknown');

                    appendVideoCard(link, videoId, videoName, videoPic, videoType);
                }
            }
            
            showLoading(false);
            isLoading = false;
            checkAutoLoad();
        })
        .catch(function() {
            if (page === 1) {
                document.getElementById('contentGrid').innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>' + tcT('failVids') + '</p></div>';
            }
            showLoading(false);
            isLoading = false;
            showToast(tcT('failVids'), 'error');
        });
}

// Shared card builder so the archive loader renders identical cards
function appendVideoCard(link, videoId, videoName, videoPic, videoType) {
    var cardHtml = '<a href="../catalogues/complay.html?web=' + encodeURIComponent(link) + '&tab=' + encodeURIComponent(videoId) + '" class="card-item">' +
        '<img class="card-image" src="' + escapeHtml(videoPic) + '" alt="' + escapeHtml(videoName) + '" onerror="this.src=\'../images/noimage.jpeg\'">' +
        '<div class="card-overlay"></div>' +
        '<div class="card-play-icon"><i class="fas fa-play"></i></div>' +
        '<div class="card-info">' +
        '<span class="card-type">' + escapeHtml(videoType) + '</span>' +
        '<h4 class="card-title">' + escapeHtml(videoName) + '</h4>' +
        '</div></a>';
    document.getElementById('contentGrid').insertAdjacentHTML('beforeend', cardHtml);
}

// ============================== archive.org classic movies ==============================
function renderArchiveCategories() {
    var categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = '';
    var zh = tcLang() === 'zh';
    var cats = [
        { id: '', icon: 'fa-fire', name: zh ? '最受欢迎' : 'Most Popular' },
        { id: '1930s', icon: 'fa-film', name: '1930s' },
        { id: '1940s', icon: 'fa-film', name: '1940s' },
        { id: '1950s', icon: 'fa-film', name: '1950s' },
        { id: 'sci-fi', icon: 'fa-rocket', name: zh ? '科幻' : 'Sci-Fi' },
        { id: 'noir', icon: 'fa-hat-cowboy', name: zh ? '黑色电影' : 'Film Noir' },
        { id: 'western', icon: 'fa-horse', name: zh ? '西部片' : 'Western' }
    ];
    cats.forEach(function (cat, idx) {
        var item = document.createElement('div');
        item.className = 'category-item' + (idx === 0 ? ' active' : '');
        item.dataset.id = cat.id;
        item.innerHTML = '<i class="fas ' + cat.icon + '"></i><span>' + escapeHtml(cat.name) + '</span>';
        item.addEventListener('click', function () {
            document.querySelectorAll('.category-item').forEach(function (el) {
                el.classList.remove('active');
            });
            this.classList.add('active');
            currentCategory = cat.id;
            pageNum = 1;
            document.getElementById('searchInput').value = '';
            loadVideos(currentLink, currentCategory, 1);
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('show-mobile');
            }
        });
        categoryList.appendChild(item);
    });
}

// Title search on the archive.org classic-movies source
function loadArchiveSearch(term, page, seq) {
    // strip Solr-special characters, keep word characters and spaces
    var clean = (term || '').replace(/[+\-!(){}\[\]^"~*?:\\/]+|&&|\|\|/g, ' ').trim();
    if (!clean) {
        loadArchiveVideos('', 1, seq);
        return;
    }
    var q = 'collection:feature_films AND mediatype:movies AND title:(' + clean + ')';
    var apiUrl = 'https://archive.org/advancedsearch.php?q=' + encodeURIComponent(q) +
        '&fl%5B%5D=identifier&fl%5B%5D=title&fl%5B%5D=year&fl%5B%5D=is_dark&rows=40&page=' + (page || 1) +
        '&sort%5B%5D=-downloads&output=json';

    fetchJSONWithProxy(apiUrl)
        .then(function (data) {
            if (seq !== videoRequestSeq) return; // stale: a newer request took over
            if (page === 1) {
                document.getElementById('contentGrid').innerHTML = '';
            }
            var allDocs = (data.response && data.response.docs) || [];
            var docs = allDocs.filter(function (d) { return d.is_dark !== true; });
            if (docs.length === 0) noMoreData = true;

            if (docs.length === 0 && page === 1) {
                document.getElementById('contentGrid').innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>' + tcT('noResults') + ' "' + escapeHtml(term) + '"</p></div>';
            } else {
                document.getElementById('contentGrid').classList.add('has-results');
                var zh = tcLang() === 'zh';
                for (var i = 0; i < docs.length; i++) {
                    var d = docs[i];
                    appendVideoCard('https://archive.org', d.identifier,
                        d.title || d.identifier,
                        'https://archive.org/services/img/' + d.identifier,
                        d.year ? String(d.year) : (zh ? '经典' : 'Classic'));
                }
            }
            showLoading(false);
            isLoading = false;
            checkAutoLoad();
        })
        .catch(function () {
            if (seq !== videoRequestSeq) return;
            if (page === 1) {
                document.getElementById('contentGrid').innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>' + tcT('searchFail') + '</p></div>';
            }
            showLoading(false);
            isLoading = false;
            showToast(tcT('searchFail'), 'error');
        });
}

function loadArchiveVideos(category, page, seq) {    var q = 'collection:feature_films AND mediatype:movies';
    if (category === '1930s') q += ' AND year:[1930 TO 1939]';
    else if (category === '1940s') q += ' AND year:[1940 TO 1949]';
    else if (category === '1950s') q += ' AND year:[1950 TO 1959]';
    else if (category === 'sci-fi') q += ' AND (subject:sci-fi OR subject:"science fiction")';
    else if (category === 'noir') q += ' AND subject:noir';
    else if (category === 'western') q += ' AND subject:western';

    var sort = '-downloads';
    if (category === '1930s' || category === '1940s' || category === '1950s') sort = '-year';

    var apiUrl = 'https://archive.org/advancedsearch.php?q=' + encodeURIComponent(q) +
        '&fl%5B%5D=identifier&fl%5B%5D=title&fl%5B%5D=year&fl%5B%5D=is_dark&rows=40&page=' + (page || 1) +
        '&sort%5B%5D=' + encodeURIComponent(sort) + '&output=json';

    fetchJSONWithProxy(apiUrl)
        .then(function (data) {
            if (seq !== videoRequestSeq) return; // stale: a newer request took over
            if (page === 1) {
                document.getElementById('contentGrid').innerHTML = '';
            }
            var allDocs = (data.response && data.response.docs) || [];
            // skip dark (disabled) items: their downloads return 403
            var docs = allDocs.filter(function (d) { return d.is_dark !== true; });
            if (docs.length === 0) noMoreData = true;

            if (docs.length === 0 && page === 1) {
                document.getElementById('contentGrid').innerHTML = '<div class="empty-state"><i class="fas fa-video-slash"></i><p>' + tcT('noVideos') + '</p></div>';
            } else {
                document.getElementById('contentGrid').classList.add('has-results');
                var zh = tcLang() === 'zh';
                for (var i = 0; i < docs.length; i++) {
                    var d = docs[i];
                    appendVideoCard('https://archive.org', d.identifier,
                        d.title || d.identifier,
                        'https://archive.org/services/img/' + d.identifier,
                        d.year ? String(d.year) : (zh ? '经典' : 'Classic'));
                }
            }
            showLoading(false);
            isLoading = false;
            checkAutoLoad();
        })
        .catch(function () {
            if (page === 1) {
                document.getElementById('contentGrid').innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>' + tcT('failVids') + '</p></div>';
            }
            showLoading(false);
            isLoading = false;
            showToast(tcT('failVids'), 'error');
        });
}

// Search videos
function searchVideos(link, term, page, force) {
    if (isLoading && !force) return;
    var seq = ++videoRequestSeq;
    isLoading = true;
    if ((page || 1) === 1) noMoreData = false;
    
    showLoading(true, page === 1);
    
    // archive.org source: title search via the advancedsearch API
    if (link === 'https://archive.org') {
        loadArchiveSearch(term, page, seq);
        return;
    }
    
    var baseUrl = link.endsWith('/') ? link : link + '/';
    var apiUrl = baseUrl + '?ac=videolist&wd=' + encodeURIComponent(term) + '&pg=' + (page || 1);
    
    fetchJSONWithProxy(apiUrl)
        .then(function(data) {
            if (seq !== videoRequestSeq) return; // stale: a newer request took over
            if (page === 1) {
                var contentGrid = document.getElementById('contentGrid');
                contentGrid.classList.remove('has-results');
                contentGrid.innerHTML = '';
            }
            
            showLoading(false);
            
            var videos = data.list || data.vod_list || data.data || [];
            
            if (videos.length === 0) {
                noMoreData = true;
            }
            
            if (videos.length === 0 && page === 1) {
                document.getElementById('contentGrid').innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>' + tcT(noResults) + '</p></div>';
            } else if (videos.length > 0) {
                document.getElementById('contentGrid').classList.add('has-results');
                
                for (var i = 0; i < videos.length; i++) {
                    var video = videos[i];
                    var videoId = video.vod_id;
                    var videoName = video.vod_name;
                    var videoPic = video.vod_pic || '../images/noimage.jpeg';
                    var videoType = tcCategory(video.type_name) || tcT('unknown');

                    appendVideoCard(link, videoId, videoName, videoPic, videoType);
                }
            }
            
            isLoading = false;
            checkAutoLoad();
        })
        .catch(function() {
            showLoading(false);
            
            if (page === 1) {
                document.getElementById('contentGrid').innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>' + tcT('searchFail') + '</p></div>';
            }
            
            isLoading = false;
            showToast(tcT('searchFail'), 'error');
        });
}

// Initialize source select from localStorage
// Auto load more when content does not fill the visible area
// (e.g. very wide screens where the first page fits entirely without scrolling,
// so the scroll event never fires and infinite scroll would never trigger)
function checkAutoLoad() {
    if (noMoreData || isLoading) return;
    
    var contentArea = document.getElementById('contentArea');
    var contentGrid = document.getElementById('contentGrid');
    
    // Skip while a search loading state is showing (grid is hidden)
    if (contentGrid.style.display === 'none') return;
    
    if (contentArea.scrollHeight <= contentArea.clientHeight + 100) {
        pageNum++;
        var searchTerm = document.getElementById('searchInput').value.trim();
        if (searchTerm) {
            searchVideos(currentLink, searchTerm, pageNum);
        } else {
            loadVideos(currentLink, currentCategory, pageNum);
        }
    }
}

// ============================== Source picker dialog ==============================
// Shown on first visit so users consciously pick their sources (and see which
// are Chinese-language) instead of landing directly on Chinese content.
function initSourceDialog() {
    var overlay = document.getElementById('sourceDialogOverlay');
    if (!overlay) return;

    var list = document.getElementById('sourceDialogList');
    list.innerHTML = '';
    Object.keys(movieSources).forEach(function (id) {
        var src = movieSources[id];
        var item = document.createElement('div');
        item.className = 'source-dialog-item checked';
        item.dataset.id = id;
        item.innerHTML = '<input type="checkbox" checked>' +
            '<span class="src-name">' + escapeHtml(src.name) + '</span>' +
            '<span class="lang-badge ' + src.lang + '">' + (src.lang === 'zh' ? tcT('langZh') : tcT('langEn')) + '</span>';
        item.addEventListener('click', function (e) {
            if (e.target.tagName === 'INPUT') {
                item.classList.toggle('checked', e.target.checked);
                return;
            }
            var cb = item.querySelector('input');
            cb.checked = !cb.checked;
            item.classList.toggle('checked', cb.checked);
        });
        list.appendChild(item);
    });

    // Apply translations for the static dialog texts
    overlay.querySelectorAll('[data-tc]').forEach(function (el) {
        el.textContent = tcT(el.dataset.tc);
    });

    document.getElementById('sourceDialogConfirm').addEventListener('click', function () {
        var picked = [];
        list.querySelectorAll('.source-dialog-item.checked').forEach(function (item) {
            picked.push(item.dataset.id);
        });
        if (picked.length === 0) {
            showToast(tcT('needSource'), 'error');
            return;
        }
        localStorage.setItem('movie', picked.join(','));
        localStorage.setItem('movieDialogSeen', '1');
        overlay.classList.add('hidden');
        initSourceSelect();
        currentLink = document.getElementById('sourceSelect').value;
        currentCategory = '';
        pageNum = 1;
        document.getElementById('searchInput').value = '';
        loadCategories(currentLink);
        loadVideos(currentLink, '', 1, true);
    });

    document.getElementById('sourceDialogSkip').addEventListener('click', function () {
        localStorage.setItem('movieDialogSeen', '1');
        overlay.classList.add('hidden');
        // keep whatever initSourceSelect already loaded
    });

    overlay.classList.remove('hidden');
}

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
    
    // Entry point to reopen the source picker dialog
    var editOpt = document.createElement('option');
    editOpt.value = '__edit__';
    editOpt.textContent = tcT('editSources');
    sourceSelect.appendChild(editOpt);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Theater (Comprehensive) Page Loaded ===');
    
    // Localize static texts that don't go through the dialog
    document.getElementById('searchInput').placeholder = tcT('searchPh');
    
    // Initialize source select from localStorage
    initSourceSelect();
    
    // Set initial source
    currentLink = document.getElementById('sourceSelect').value;
    
    // Show the source picker on first visit (after the grid has something to show)
    if (!localStorage.getItem('movieDialogSeen')) {
        initSourceDialog();
    }
    
    // Load initial data
    loadCategories(currentLink);
    loadVideos(currentLink, '', 1);
    
    // Back button
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = '../index.html';
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
        // "Edit sources..." reopens the picker dialog instead of switching content
        if (this.value === '__edit__') {
            var sel = this;
            initSourceDialog();
            // restore the previous selection so the grid isn't affected
            var opts = [...sel.options].filter(function(o) { return o.value !== '__edit__'; });
            if (opts.length > 0) sel.value = opts[0].value;
            return;
        }
        currentLink = this.value;
        currentCategory = '';
        pageNum = 1;
        document.getElementById('searchInput').value = '';
        loadCategories(currentLink);
        loadVideos(currentLink, '', 1, true);
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
        
        if (scrollTop + clientHeight >= scrollHeight - 100 && !isLoading && !noMoreData) {
            pageNum++;
            var searchTerm = document.getElementById('searchInput').value.trim();
            if (searchTerm) {
                searchVideos(currentLink, searchTerm, pageNum);
            } else {
                loadVideos(currentLink, currentCategory, pageNum);
            }
        }
    });
    
    // When the window is resized (e.g. wider screen), content that previously
    // filled the viewport may now fit entirely, so re-check auto load
    var resizeTimer = null;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(checkAutoLoad, 200);
    });
});
