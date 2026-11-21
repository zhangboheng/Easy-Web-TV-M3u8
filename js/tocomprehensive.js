// Comprehensive (Theater) Page JS - Modern UI Version
// Native JavaScript (No jQuery)

// Source ID to URL mapping for Movie sources
// lang: content language badge shown in the source picker dialog
// archive: uses the archive.org data loader instead of the Chinese CMS API
var movieSources = {
    'archive_classic': { url: 'https://archive.org', name: 'Classic Movies (Public Domain)', lang: 'en', archive: true },
    'youtube_blender': { url: 'https://youtube-nocookie.com', name: 'YouTube', lang: 'en', youtube: true },
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
        dlgDesc: 'Movie feeds come from community CMS APIs (Chinese), public-domain classics from archive.org (English), and curated CC-BY open movies from YouTube. Pick the sources you want — you can change this later from the source dropdown at the top.',
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
        dlgDesc: '影片源来自社区 CMS 资源站（中文）、archive.org 的公共领域经典电影（英文），以及 YouTube 上精选的 CC-BY 开源电影（官方嵌入播放）。选择你想看的源——之后可随时在顶部下拉框里修改。',
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
    },
    ja: {
        dlgTitle: '動画ソースを選択',
        dlgDesc: '動画ソースはコミュニティ CMS（中国語）、archive.org のパブリックドメイン映画（英語）、および YouTube の厳選された CC-BY オープン映画です。使用するソースを選択してください。上部のドロップダウンからいつでも変更できます。',
        dlgConfirm: '確認',
        dlgSkip: 'すべてのソースを使用',
        langZh: '中国語',
        langEn: '英語',
        latest: '最新更新',
        loadingCats: 'カテゴリを読み込み中...',
        loadingVids: '動画を読み込み中...',
        noVideos: '動画が見つかりません',
        failCats: 'カテゴリの読み込みに失敗',
        failVids: '動画の読み込みに失敗',
        searchFail: '検索に失敗しました',
        searching: '検索中...',
        noResults: '結果が見つかりません',
        needSource: '少なくとも 1 つのソースを選択してください',
        editSources: '⚙ ソースを編集...',
        searchPh: '動画を検索...',
        unknown: '不明'
    },
    ko: {
        dlgTitle: '영화 소스 선택',
        dlgDesc: '영화 소스는 커뮤니티 CMS(중국어), archive.org 퍼블릭 도메인 영화(영어), YouTube의 엄선된 CC-BY 오픈 영화입니다. 사용할 소스를 선택하세요. 상단 드롭다운에서 언제든 변경할 수 있습니다.',
        dlgConfirm: '확인',
        dlgSkip: '모든 소스 사용',
        langZh: '중국어',
        langEn: '영어',
        latest: '최신 업데이트',
        loadingCats: '카테고리 로딩 중...',
        loadingVids: '영화 로딩 중...',
        noVideos: '영화를 찾을 수 없습니다',
        failCats: '카테고리 로드 실패',
        failVids: '영화 로드 실패',
        searchFail: '검색 실패',
        searching: '검색 중...',
        noResults: '결과가 없습니다',
        needSource: '소스를 하나 이상 선택하세요',
        editSources: '⚙ 소스 편집...',
        searchPh: '영화 검색...',
        unknown: '알 수 없음'
    },
    fr: {
        dlgTitle: 'Choisir les sources de films',
        dlgDesc: 'Les sources proviennent de CMS communautaires (chinois), de films du domaine public sur archive.org (anglais) et de films ouverts CC-BY sélectionnés sur YouTube. Choisissez les sources à utiliser — modifiables à tout moment depuis le menu déroulant en haut.',
        dlgConfirm: 'Confirmer',
        dlgSkip: 'Utiliser toutes les sources',
        langZh: 'Chinois',
        langEn: 'Anglais',
        latest: 'Dernières mises à jour',
        loadingCats: 'Chargement des catégories...',
        loadingVids: 'Chargement des films...',
        noVideos: 'Aucun film trouvé',
        failCats: 'Échec du chargement des catégories',
        failVids: 'Échec du chargement des films',
        searchFail: 'Échec de la recherche',
        searching: 'Recherche...',
        noResults: 'Aucun résultat',
        needSource: 'Veuillez sélectionner au moins une source',
        editSources: '⚙ Modifier les sources...',
        searchPh: 'Rechercher des films...',
        unknown: 'Inconnu'
    },
    de: {
        dlgTitle: 'Filmquellen auswählen',
        dlgDesc: 'Die Quellen stammen aus Community-CMS (Chinesisch), Public-Domain-Filmen von archive.org (Englisch) und ausgewählten CC-BY-Open-Movies auf YouTube. Wähle die gewünschten Quellen — jederzeit änderbar über das Dropdown oben.',
        dlgConfirm: 'Bestätigen',
        dlgSkip: 'Alle Quellen verwenden',
        langZh: 'Chinesisch',
        langEn: 'Englisch',
        latest: 'Neueste Updates',
        loadingCats: 'Kategorien werden geladen...',
        loadingVids: 'Filme werden geladen...',
        noVideos: 'Keine Filme gefunden',
        failCats: 'Kategorien konnten nicht geladen werden',
        failVids: 'Filme konnten nicht geladen werden',
        searchFail: 'Suche fehlgeschlagen',
        searching: 'Suche...',
        noResults: 'Keine Ergebnisse',
        needSource: 'Bitte mindestens eine Quelle auswählen',
        editSources: '⚙ Quellen bearbeiten...',
        searchPh: 'Filme suchen...',
        unknown: 'Unbekannt'
    },
    es: {
        dlgTitle: 'Elegir fuentes de películas',
        dlgDesc: 'Las fuentes provienen de CMS comunitarios (chino), películas de dominio público en archive.org (inglés) y películas abiertas CC-BY seleccionadas en YouTube. Elige las fuentes que quieras: puedes cambiarlas cuando quieras desde el menú desplegable superior.',
        dlgConfirm: 'Confirmar',
        dlgSkip: 'Usar todas las fuentes',
        langZh: 'Chino',
        langEn: 'Inglés',
        latest: 'Últimas actualizaciones',
        loadingCats: 'Cargando categorías...',
        loadingVids: 'Cargando películas...',
        noVideos: 'No se encontraron películas',
        failCats: 'Error al cargar categorías',
        failVids: 'Error al cargar películas',
        searchFail: 'Error en la búsqueda',
        searching: 'Buscando...',
        noResults: 'No hay resultados',
        needSource: 'Selecciona al menos una fuente',
        editSources: '⚙ Editar fuentes...',
        searchPh: 'Buscar películas...',
        unknown: 'Desconocido'
    },
    ru: {
        dlgTitle: 'Выбрать источники фильмов',
        dlgDesc: 'Источники: сообщества CMS (китайский), общедоступные фильмы archive.org (английский) и отобранные фильмы CC-BY на YouTube. Выберите нужные источники — их можно изменить в любой момент через меню вверху.',
        dlgConfirm: 'Подтвердить',
        dlgSkip: 'Использовать все источники',
        langZh: 'Китайский',
        langEn: 'Английский',
        latest: 'Последние обновления',
        loadingCats: 'Загрузка категорий...',
        loadingVids: 'Загрузка фильмов...',
        noVideos: 'Фильмы не найдены',
        failCats: 'Не удалось загрузить категории',
        failVids: 'Не удалось загрузить фильмы',
        searchFail: 'Ошибка поиска',
        searching: 'Поиск...',
        noResults: 'Ничего не найдено',
        needSource: 'Выберите хотя бы один источник',
        editSources: '⚙ Изменить источники...',
        searchPh: 'Поиск фильмов...',
        unknown: 'Неизвестно'
    }
};

function tcLang() {
    try {
        var lang = String(localStorage.getItem('preferredLanguage') || localStorage.getItem('languages')
            || (navigator.language || 'en') || '').toLowerCase();
        if (lang.indexOf('zh') === 0) return 'zh';
        if (lang.indexOf('en') === 0) return 'en';
        var uiLangs = ['ja', 'ko', 'fr', 'de', 'es', 'ru'];
        for (var i = 0; i < uiLangs.length; i++) {
            if (lang.indexOf(uiLangs[i]) === 0) return uiLangs[i];
        }
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
    // curated Blender open movies have a small fixed category set
    if (link === YOUTUBE_SOURCE) {
        renderYouTubeCategories();
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
    // curated Blender open movies: finite local catalogue
    if (link === YOUTUBE_SOURCE) {
        loadCuratedYouTubeVideos(category, seq);
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

// ============================== curated Blender open movies (YouTube embed) ==============================
// Small hand-picked catalogue of Blender Foundation open movies (CC-BY).
// Playback uses YouTube's official iframe player only - no direct URLs are
// fetched, stored or proxied by this app.
var YOUTUBE_SOURCE = 'https://youtube-nocookie.com';
var youtubeCatalogue = null; // lazy-loaded from data/videos/youtube.json

function fetchYouTubeCatalogue() {
    if (youtubeCatalogue) return Promise.resolve(youtubeCatalogue);
    return fetch('../data/videos/youtube.json').then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
    }).then(function (data) {
        var videos = (data && data.videos) || [];
        if (!Array.isArray(videos)) throw new Error('Invalid catalogue');
        youtubeCatalogue = videos;
        return youtubeCatalogue;
    });
}

function renderYouTubeCategories() {
    var categoryList = document.getElementById('categoryList');
    categoryList.innerHTML = '';
    var zh = tcLang() === 'zh';
    var cats = [
        { id: '', icon: 'fa-fire', name: zh ? '全部' : 'All' },
        { id: 'animation', icon: 'fa-film', name: zh ? '动画短片' : 'Animation' },
        { id: 'liveaction', icon: 'fa-users', name: zh ? '真人 VFX' : 'Live Action VFX' }
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

function renderYouTubeCards(videos) {
    var zh = tcLang() === 'zh';
    videos.forEach(function (v) {
        appendVideoCard(YOUTUBE_SOURCE, v.id,
            (zh && v.titleZh) ? v.titleZh : v.title,
            'https://i.ytimg.com/vi/' + encodeURIComponent(v.id) + '/hqdefault.jpg',
            v.year ? (v.year + ' · ' + (v.license || 'CC-BY')) : (v.license || 'CC-BY'));
    });
}

function loadCuratedYouTubeVideos(category, seq) {
    fetchYouTubeCatalogue().then(function (videos) {
        if (seq !== videoRequestSeq) return; // stale: a newer request took over
        var contentGrid = document.getElementById('contentGrid');
        contentGrid.innerHTML = '';
        contentGrid.classList.remove('has-results');
        var filtered = category ? videos.filter(function (v) { return v.category === category; }) : videos;
        if (filtered.length === 0) {
            contentGrid.innerHTML = '<div class="empty-state"><i class="fas fa-video-slash"></i><p>' + tcT('noVideos') + '</p></div>';
        } else {
            contentGrid.classList.add('has-results');
            renderYouTubeCards(filtered);
        }
        noMoreData = true; // finite curated list: no infinite scroll
        showLoading(false);
        isLoading = false;
    }).catch(function () {
        if (seq !== videoRequestSeq) return;
        document.getElementById('contentGrid').innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>' + tcT('failVids') + '</p></div>';
        showLoading(false);
        isLoading = false;
        showToast(tcT('failVids'), 'error');
    });
}

function loadCuratedYouTubeSearch(term, seq) {
    fetchYouTubeCatalogue().then(function (videos) {
        if (seq !== videoRequestSeq) return;
        var clean = (term || '').toLowerCase().trim();
        var contentGrid = document.getElementById('contentGrid');
        contentGrid.innerHTML = '';
        contentGrid.classList.remove('has-results');
        var matched = videos.filter(function (v) {
            return (v.title || '').toLowerCase().indexOf(clean) > -1 ||
                (v.titleZh || '').indexOf(clean) > -1 ||
                (v.channel || '').toLowerCase().indexOf(clean) > -1;
        });
        if (matched.length === 0) {
            contentGrid.innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>' + tcT('noResults') + ' "' + escapeHtml(term) + '"</p></div>';
        } else {
            contentGrid.classList.add('has-results');
            renderYouTubeCards(matched);
        }
        noMoreData = true;
        showLoading(false);
        isLoading = false;
    }).catch(function () {
        if (seq !== videoRequestSeq) return;
        document.getElementById('contentGrid').innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-triangle"></i><p>' + tcT('searchFail') + '</p></div>';
        showLoading(false);
        isLoading = false;
        showToast(tcT('searchFail'), 'error');
    });
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
    // curated Blender open movies: search the small local catalogue
    if (link === YOUTUBE_SOURCE) {
        loadCuratedYouTubeSearch(term, seq);
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
                document.getElementById('contentGrid').innerHTML = '<div class="empty-state"><i class="fas fa-search"></i><p>' + tcT('noResults') + '</p></div>';
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

// Lightweight i18n for header tab labels (Online/Local) and local panel texts.
// Mirrors TC_I18N above: reads the same localStorage keys the main page stores
// (preferredLanguage / languages); unknown -> English.
var LOCAL_I18N = {
    en: {
        tabOnline: 'Movies',
        tabLocal: 'Local',
        localTitle: 'Local Videos',
        localDesc: 'Choose video files (MP4/WebM/OGV/M4V/MOV) or a whole folder from your device. Files stay in this browser and are never uploaded.',
        pickFiles: 'Choose files',
        pickFolder: 'Choose folder',
        restoreFolder: 'Restore folder',
        choosingFiles: 'Choosing files...',
        choosingFolder: 'Choosing folder...',
        restoringFolder: 'Restoring folder...',
        noSavedFolder: 'No saved folder for this browser.',
        permDenied: 'Permission was not granted. Choose the folder again.',
        pickIntro: 'Local files stay in this browser. Choose a folder to begin.',
        pickIntroNoDir: 'Local files stay in this browser. Choose files or a folder to begin.',
        noVideoFiles: 'No supported video files found.'
    },
    zh: {
        tabOnline: '在线',
        tabLocal: '本地',
        localTitle: '本地视频',
        localDesc: '从设备选择视频文件（MP4/WebM/OGV/M4V/MOV）或整个文件夹。文件仅保存在本浏览器中，不会被上传。',
        pickFiles: '选择文件',
        pickFolder: '选择文件夹',
        restoreFolder: '恢复文件夹',
        choosingFiles: '正在选择文件...',
        choosingFolder: '正在选择文件夹...',
        restoringFolder: '正在恢复文件夹...',
        noSavedFolder: '此浏览器没有已保存的文件夹。',
        permDenied: '未获得权限，请重新选择文件夹。',
        pickIntro: '本地文件仅保存在本浏览器中。选择一个文件夹开始。',
        pickIntroNoDir: '本地文件仅保存在本浏览器中。选择文件或文件夹开始。',
        noVideoFiles: '未找到受支持的视频文件。'
    },
    // Module-specific labels for the remaining UI languages. Shared panel
    // texts (pick/choose/notLoaded/no*Files) come from js/local-media-i18n.js.
    ja: {
        tabOnline: 'オンライン',
        tabLocal: 'ローカル',
        localTitle: 'ローカル動画',
        localDesc: 'デバイスから動画ファイル（MP4/WebM/OGV/M4V/MOV）またはフォルダー全体を選択します。ファイルはこのブラウザー内にのみ保存され、アップロードされることはありません。',
        noVideoFiles: 'サポートされている動画ファイルが見つかりませんでした。'
    },
    ko: {
        tabOnline: '온라인',
        tabLocal: '로컬',
        localTitle: '로컬 비디오',
        localDesc: '기기에서 비디오 파일(MP4/WebM/OGV/M4V/MOV)이나 폴더 전체를 선택하세요. 파일은 이 브라우저에만 저장되며 업로드되지 않습니다.',
        noVideoFiles: '지원되는 비디오 파일을 찾을 수 없습니다.'
    },
    fr: {
        tabOnline: 'En ligne',
        tabLocal: 'Local',
        localTitle: 'Vidéos locales',
        localDesc: "Choisissez des fichiers vidéo (MP4/WebM/OGV/M4V/MOV) ou un dossier entier depuis votre appareil. Les fichiers restent dans ce navigateur et ne sont jamais téléversés.",
        noVideoFiles: "Aucun fichier vidéo pris en charge n'a été trouvé."
    },
    de: {
        tabOnline: 'Online',
        tabLocal: 'Lokal',
        localTitle: 'Lokale Videos',
        localDesc: 'Wählen Sie Videodateien (MP4/WebM/OGV/M4V/MOV) oder einen ganzen Ordner von Ihrem Gerät. Die Dateien bleiben in diesem Browser und werden nie hochgeladen.',
        noVideoFiles: 'Keine unterstützten Videodateien gefunden.'
    },
    es: {
        tabOnline: 'En línea',
        tabLocal: 'Local',
        localTitle: 'Vídeos locales',
        localDesc: 'Elige archivos de vídeo (MP4/WebM/OGV/M4V/MOV) o una carpeta completa de tu dispositivo. Los archivos permanecen en este navegador y nunca se suben.',
        noVideoFiles: 'No se encontraron archivos de vídeo compatibles.'
    },
    ru: {
        tabOnline: 'Онлайн',
        tabLocal: 'Локально',
        localTitle: 'Локальные видео',
        localDesc: 'Выберите видеофайлы (MP4/WebM/OGV/M4V/MOV) или целую папку с устройства. Файлы остаются в этом браузере и никогда не загружаются.',
        noVideoFiles: 'Поддерживаемые видеофайлы не найдены.'
    }
};

// Fill missing labels (including the shared notLoaded / choose* keys) from
// js/local-media-i18n.js so every UI language gets the full panel text.
(function (dict) {
    var shared = (typeof window !== 'undefined' && window.LocalMediaI18N) || {};
    Object.keys(shared).forEach(function (lang) {
        if (!dict[lang]) dict[lang] = {};
        Object.keys(shared[lang]).forEach(function (key) {
            if (dict[lang][key] === undefined) dict[lang][key] = shared[lang][key];
        });
    });
}(LOCAL_I18N));

// Normalize the stored/navigator language to the UI languages used by the
// route pages (zh, en, ja, ko, fr, de, es, ru); unknown -> English.
function localLang() {
    try {
        var lang = String(localStorage.getItem('preferredLanguage') || localStorage.getItem('languages')
            || (navigator.language || 'en') || '').toLowerCase();
        if (lang.indexOf('zh') === 0) return 'zh';
        if (lang.indexOf('en') === 0) return 'en';
        var uiLangs = ['ja', 'ko', 'fr', 'de', 'es', 'ru'];
        for (var i = 0; i < uiLangs.length; i++) {
            if (lang.indexOf(uiLangs[i]) === 0) return uiLangs[i];
        }
    } catch (e) { /* storage unavailable */ }
    return 'en';
}

function localT(key) {
    var lang = localLang();
    return (LOCAL_I18N[lang] && LOCAL_I18N[lang][key]) || LOCAL_I18N.en[key] || key;
}

// Map a stage failure reason to its localized message key.
function stageStatusKey(stage) {
    var reason = stage && stage.reason;
    if (reason === 'noStorage') return 'stageNoStorage';
    if (reason === 'writeFailed') return 'stageWriteFailed';
    return 'stageFailed';
}

function applyLocalI18n() {
    document.querySelectorAll('[data-i18n-tab]').forEach(function (el) {
        el.textContent = localT(el.getAttribute('data-i18n-tab'));
        // Keep an accessible name on the tab when the text label is hidden on mobile.
        if (el.parentElement) {
            el.parentElement.setAttribute('aria-label', el.textContent);
            el.parentElement.setAttribute('title', el.textContent);
        }
    });
    document.querySelectorAll('[data-i18n-text]').forEach(function (el) {
        el.textContent = localT(el.getAttribute('data-i18n-text'));
    });
}

// Local / Online tab switching (header tab-nav)
function switchLocalTab(tab) {
    var onlineBtn = document.querySelector('.tab-nav .tab-btn[data-tab="online"]');
    var localBtn = document.querySelector('.tab-nav .tab-btn[data-tab="local"]');
    if (onlineBtn) onlineBtn.classList.toggle('active', tab === 'online');
    if (localBtn) localBtn.classList.toggle('active', tab === 'local');
    var mainContent = document.querySelector('.main-content:not(#localPanel)');
    var localPanel = document.getElementById('localPanel');
    var sidebar = document.getElementById('sidebar');
    var headerRight = document.querySelector('.header-right');
    if (mainContent) mainContent.style.display = tab === 'local' ? 'none' : '';
    if (localPanel) localPanel.style.display = tab === 'local' ? '' : 'none';
    if (sidebar) sidebar.style.display = tab === 'local' ? 'none' : '';
    if (headerRight) headerRight.style.visibility = tab === 'local' ? 'hidden' : '';
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Theater (Comprehensive) Page Loaded ===');
    applyLocalI18n();
    
    // Localize static texts that don't go through the dialog
    document.getElementById('searchInput').placeholder = tcT('searchPh');
    
    // Initialize source select from localStorage
    initSourceSelect();
    
    // Local / Online tab switching
    document.querySelectorAll('.tab-nav .tab-btn').forEach(function (btn) {
        btn.addEventListener('click', function () { switchLocalTab(this.getAttribute('data-tab')); });
    });

    var localVideoStatus = document.getElementById('localVideoStatus');
    function setLocalVideoStatus(text) {
        if (localVideoStatus) localVideoStatus.textContent = String(text || '');
    }
    function openLocalVideo(mode) {
        if (!window.LocalMediaAdapters || !window.LocalMediaAdapters.video) {
            setLocalVideoStatus(localT('notLoaded'));
            return;
        }
        setLocalVideoStatus(localT(mode === 'files' ? 'choosingFiles' : 'choosingFolder'));
        window.LocalMediaAdapters.video.open({
            mode: mode,
            onProgress: function (text) { setLocalVideoStatus(text); },
            onEmpty: function () { setLocalVideoStatus(localT('noVideoFiles')); },
            onStageFailed: function (stage) {
                // Prefer the localized copy; the core only supplies English text.
                setLocalVideoStatus(localT(stageStatusKey(stage)));
            }
        });
    }
    // Re-open the previously granted folder without showing a picker.
    function restoreLocalVideo() {
        if (!window.LocalMediaAdapters || !window.LocalMediaAdapters.video
            || !window.LocalMediaAdapters.video.restore) {
            setLocalVideoStatus(localT('notLoaded'));
            return;
        }
        setLocalVideoStatus(localT('restoringFolder'));
        window.LocalMediaAdapters.video.restore({
            onProgress: function (text) { setLocalVideoStatus(text); },
            onEmpty: function () { setLocalVideoStatus(localT('noSavedFolder')); },
            onDenied: function () { setLocalVideoStatus(localT('permDenied')); }
        });
    }
    var localVideoFolderBtn = document.getElementById('localVideoFolderBtn');
    if (localVideoFolderBtn) {
        localVideoFolderBtn.addEventListener('click', function () { openLocalVideo('directory'); });
    }
    var localVideoFilesBtn = document.getElementById('localVideoFilesBtn');
    if (localVideoFilesBtn) {
        localVideoFilesBtn.addEventListener('click', function () { openLocalVideo('files'); });
    }
    var localRestoreBtn = document.getElementById('localRestoreBtn');
    if (localRestoreBtn) {
        localRestoreBtn.addEventListener('click', restoreLocalVideo);
    }

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
