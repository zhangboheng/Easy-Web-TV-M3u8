// Manga List Page JS - public-apis sources (Jikan / xkcd)
// Native JavaScript (No jQuery)
//
// Sources from Downloads/public-apis-master/README.md:
//   Jikan  https://jikan.moe          (Anime) - manga catalog, search, genres
//   xkcd   https://xkcd.com/json.html (Games & Comics) - single-issue comics
// MangaDex / MangaPill removed. All requests use apiproxy.js helpers.

var JIKAN_API = 'https://api.jikan.moe/v4';
var XKCD_API = 'https://xkcd.com';

var MANGA_SOURCES = {
    jikan: {
        name: 'Jikan (Manga)',
        categories: [
            { id: 'all', name: 'All Manga' },
            { id: 'top', name: 'Top Manga' },
            { id: 'publishing', name: 'Publishing' },
            { id: 'complete', name: 'Completed' },
            { id: 'manga', name: 'Manga' },
            { id: 'novels', name: 'Light Novels' },
            { id: 'oneshots', name: 'One-shots' },
            { id: 'doujin', name: 'Doujinshi' },
            { id: 'manhwa', name: 'Manhwa' },
            { id: 'manhua', name: 'Manhua' }
        ]
    },
    xkcd: {
        name: 'xkcd Comics',
        categories: [
            { id: 'latest', name: 'Latest Issues' },
            { id: 'classic', name: 'Classic Issues' },
            { id: 'random', name: 'Random Issues' }
        ]
    }
};

// Global variables
var pnum = 1;
var currentCategory = 'all';
var currentSource = 'jikan';
var isLoading = false;
var searchKeyword = '';
var totalMangas = [];
var hasMoreManga = true;
var currentListUrl = '';

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

// Jikan: normalize one manga entry into a card
function jikanToCard(manga) {
    var title = manga.title_english || manga.title || (manga.titles && manga.titles[0] && manga.titles[0].title) || 'Unknown Title';
    var jpg = (manga.images && manga.images.jpg) || {};
    var coverUrl = jpg.large_image_url || jpg.image_url || jpg.small_image_url || '';
    var status = manga.status || (manga.score ? 'Score ' + manga.score : 'Manga');
    return {
        id: manga.mal_id,
        href: '../catalogues/mangaplay.html?src=jikan&id=' + encodeURIComponent(manga.mal_id),
        title: title,
        coverUrl: coverUrl,
        status: status
    };
}

// xkcd: normalize one comic entry into a card
function xkcdToCard(comic) {
    return {
        id: comic.num,
        href: '../catalogues/mangaplay.html?src=xkcd&id=' + encodeURIComponent(comic.num),
        title: '#' + comic.num + ' ' + (comic.safe_title || comic.title || 'Untitled'),
        coverUrl: comic.img || '',
        status: (comic.year || '') + '-' + (comic.month || '') + '-' + (comic.day || '')
    };
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

// Jikan / xkcd normalizers are defined above.

// Render categories (fixed filters + optional Jikan genres)
function renderCategories(categories) {
    var list = document.getElementById('categoryList');
    list.innerHTML = '';

    categories.forEach(function(cat) {
        var item = document.createElement('div');
        item.className = 'category-item' + (cat.id === currentCategory ? ' active' : '');
        item.setAttribute('data-id', cat.id);
        item.setAttribute('data-name', cat.name);
        item.innerHTML = '<i class="fas fa-bookmark"></i><span>' + escapeHtml(cat.name) + '</span>';
        list.appendChild(item);
    });

    var items = list.querySelectorAll('.category-item');
    items.forEach(function(item) {
        item.addEventListener('click', function() {
            items.forEach(function(i) { i.classList.remove('active'); });
            this.classList.add('active');
            currentCategory = this.getAttribute('data-id');
            pnum = 1;
            searchKeyword = '';
            hasMoreManga = true;
            loadMangas(currentCategory, false);
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('show-mobile');
            }
        });
    });
}

// Load categories for the current source. Jikan also exposes tags/genres;
// append safe genre filters when that endpoint is reachable.
function loadTags() {
    var source = MANGA_SOURCES[currentSource];
    var base = source ? source.categories : [];
    document.getElementById('categoryList').innerHTML = '<div class="loading-state"><i class="fas fa-spinner"></i><span>Loading categories...</span></div>';

    if (currentSource !== 'jikan') {
        renderCategories(base);
        loadMangas(base[0].id, false);
        return;
    }

    fetchJSONWithProxy(JIKAN_API + '/genres/manga?filter=genres')
        .then(function(data) {
            var genres = (data && data.data) || [];
            var extra = genres.slice(0, 16).map(function(g) {
                return { id: 'genre:' + g.mal_id, name: g.name };
            });
            renderCategories(base.concat(extra));
            loadMangas(currentCategory, false);
        })
        .catch(function(error) {
            console.warn('Jikan genres unavailable, using fixed filters:', error);
            renderCategories(base);
            loadMangas(currentCategory, false);
        });
}

// Load mangas for the current source (dispatches per source)
function loadMangas(tagId, append) {
    if (isLoading) return;
    if (append && !hasMoreManga) return;

    isLoading = true;
    showLoading(true);

    if (currentSource === 'xkcd') {
        loadXkcdList(append);
        return;
    }

    var page = append ? pnum : 1;
    var apiUrl = buildJikanUrl(page);
    currentListUrl = apiUrl;

    fetchJSONWithProxy(apiUrl)
        .then(function(data) {
            var items = (data && data.data) || [];
            var cards = items.map(jikanToCard);
            renderMangas(cards, append);
            var pagination = data && data.pagination;
            hasMoreManga = pagination ? !!pagination.has_next_page : cards.length >= 24;
            if (hasMoreManga) pnum = page + 1;
            isLoading = false;
            showLoading(false);
            checkAutoLoadManga();
        })
        .catch(function(error) {
            console.error('Error loading manga (Jikan):', error);
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

// Build the Jikan list URL for the current category / keyword / page
function buildJikanUrl(page) {
    var url = JIKAN_API;
    var query = [];
    var cat = currentCategory;

    if (searchKeyword) {
        return url + '/manga?q=' + encodeURIComponent(searchKeyword) + '&limit=24&page=' + page + '&sfw=true';
    }
    if (cat === 'top') {
        url += '/top/manga?limit=24&page=' + page;
    } else if (cat === 'all' || cat === 'publishing' || cat === 'complete') {
        url += '/manga?limit=24&page=' + page + '&sfw=true&order_by=score&sort=desc';
        if (cat === 'publishing') query.push('status=publishing');
        if (cat === 'complete') query.push('status=complete');
    } else if (cat.indexOf('genre:') === 0) {
        url += '/manga?limit=24&page=' + page + '&sfw=true&genres=' + encodeURIComponent(cat.slice(6));
    } else {
        url += '/manga?limit=24&page=' + page + '&sfw=true&type=' + encodeURIComponent(cat);
    }
    if (query.length) url += '&' + query.join('&');
    return url;
}

// Build xkcd issue-number list for a page (xkcd has no list endpoint)
function xkcdNumbers(page) {
    var numbers = [];
    var latest = (typeof xkcdNumbers.latest === 'number') ? xkcdNumbers.latest : 3322;
    var category = currentCategory;

    if (category === 'classic') {
        for (var c = 1; c <= 24; c++) numbers.push(c);
        return numbers;
    }
    if (category === 'random') {
        for (var r = 0; r < 24; r++) numbers.push(1 + Math.floor(Math.random() * latest));
        return numbers;
    }

    var start = Math.max(1, latest - (page - 1) * 24);
    var end = Math.max(1, start - 23);
    for (var n = start; n >= end; n--) numbers.push(n);
    return numbers;
}

// xkcd list: fetch the latest issue once, then N issues in parallel
function loadXkcdList(append) {
    fetchJSONWithProxy(XKCD_API + '/info.0.json')
        .catch(function() { return null; })
        .then(function(latest) {
            if (latest && latest.num) xkcdNumbers.latest = latest.num;
            var numbers = xkcdNumbers(append ? pnum : 1);

            if (searchKeyword) {
                var match = searchKeyword.match(/^\d+$/);
                if (match) {
                    numbers = [parseInt(match[0], 10)];
                } else {
                    renderMangas([], false);
                    showToast('xkcd search accepts an issue number only', 'warning');
                    hasMoreManga = false;
                    isLoading = false;
                    showLoading(false);
                    return null;
                }
            }

            return Promise.all(numbers.map(function(num) {
                return fetchJSONWithProxy(XKCD_API + '/' + num + '/info.0.json').catch(function() { return null; });
            }));
        })
        .then(function(comics) {
            if (!comics) return;
            var cards = comics.filter(Boolean).map(xkcdToCard);
            renderMangas(cards, append);
            hasMoreManga = !searchKeyword && currentCategory === 'latest' && xkcdNumbers.latest > pnum * 24;
            if (hasMoreManga) pnum++;
            isLoading = false;
            showLoading(false);
            checkAutoLoadManga();
        })
        .catch(function(error) {
            console.error('Error loading manga (xkcd):', error);
            if (!append) {
                document.getElementById('contentGrid').innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Failed to load comics</p></div>';
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

// Lightweight i18n for header tab labels (Online/Local) and local panel texts.
// Mirrors tocomprehensive.js's TC_I18N: reads the same localStorage keys the
// main page stores (preferredLanguage / languages); unknown -> English.
var LOCAL_I18N = {
    en: {
        tabOnline: 'Online',
        tabLocal: 'Local',
        localTitle: 'Local Manga',
        localDesc: 'Choose image or PDF files (JPG/PNG/WEBP/GIF/AVIF/PDF) or a whole folder from your device. Files stay in this browser and are never uploaded.',
        chooseFolder: 'Choose folder',
        chooseFiles: 'Choose files',
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
        noImageFiles: 'No supported image or PDF files found.'
    },
    zh: {
        tabOnline: '在线',
        tabLocal: '本地',
        localTitle: '本地漫画',
        localDesc: '从设备选择图片或 PDF 文件（JPG/PNG/WEBP/GIF/AVIF/PDF）或整个文件夹。文件仅保存在本浏览器中，不会被上传。',
        chooseFolder: '选择文件夹',
        chooseFiles: '选择文件',
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
        noImageFiles: '未找到受支持的图片或 PDF 文件。'
    },
    // Module-specific labels for the remaining UI languages. Shared panel
    // texts (pick/choose/notLoaded/no*Files) come from js/local-media-i18n.js.
    ja: {
        tabOnline: 'オンライン',
        tabLocal: 'ローカル',
        localTitle: 'ローカル漫画',
        localDesc: 'デバイスから画像または PDF ファイル（JPG/PNG/WEBP/GIF/AVIF/PDF）またはフォルダー全体を選択します。ファイルはこのブラウザー内にのみ保存され、アップロードされることはありません。',
        noImageFiles: 'サポートされている画像または PDF ファイルが見つかりませんでした。'
    },
    ko: {
        tabOnline: '온라인',
        tabLocal: '로컬',
        localTitle: '로컬 만화',
        localDesc: '기기에서 이미지 또는 PDF 파일(JPG/PNG/WEBP/GIF/AVIF/PDF)이나 폴더 전체를 선택하세요. 파일은 이 브라우저에만 저장되며 업로드되지 않습니다.',
        noImageFiles: '지원되는 이미지 또는 PDF 파일을 찾을 수 없습니다.'
    },
    fr: {
        tabOnline: 'En ligne',
        tabLocal: 'Local',
        localTitle: 'Mangas locaux',
        localDesc: "Choisissez des images ou PDF (JPG/PNG/WEBP/GIF/AVIF/PDF) ou un dossier entier depuis votre appareil. Les fichiers restent dans ce navigateur et ne sont jamais téléversés.",
        noImageFiles: "Aucun fichier image ou PDF pris en charge n'a été trouvé."
    },
    de: {
        tabOnline: 'Online',
        tabLocal: 'Lokal',
        localTitle: 'Lokale Mangas',
        localDesc: 'Wählen Sie Bild- oder PDF-Dateien (JPG/PNG/WEBP/GIF/AVIF/PDF) oder einen ganzen Ordner von Ihrem Gerät. Die Dateien bleiben in diesem Browser und werden nie hochgeladen.',
        noImageFiles: 'Keine unterstützten Bild- oder PDF-Dateien gefunden.'
    },
    es: {
        tabOnline: 'En línea',
        tabLocal: 'Local',
        localTitle: 'Mangas locales',
        localDesc: 'Elige archivos de imagen o PDF (JPG/PNG/WEBP/GIF/AVIF/PDF) o una carpeta completa de tu dispositivo. Los archivos permanecen en este navegador y nunca se suben.',
        noImageFiles: 'No se encontraron archivos de imagen o PDF compatibles.'
    },
    ru: {
        tabOnline: 'Онлайн',
        tabLocal: 'Локально',
        localTitle: 'Локальная манга',
        localDesc: 'Выберите файлы изображений или PDF (JPG/PNG/WEBP/GIF/AVIF/PDF) или целую папку с устройства. Файлы остаются в этом браузере и никогда не загружаются.',
        noImageFiles: 'Поддерживаемые файлы изображений не найдены.'
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
    // Shared keys are merged into LOCAL_I18N at load time (see the fill-in block
    // above), so this lookup already covers js/local-media-i18n.js.
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
    console.log('=== Manga List Page Loaded (public-apis sources) ===');
    applyLocalI18n();

    var sourceSelect = document.getElementById('sourceSelect');
    if (sourceSelect) {
        var savedManga = null;
        try { savedManga = window.localStorage.getItem('manga'); } catch (e) {}
        var mangaIds = savedManga ? savedManga.split(',')
            .filter(function(id) { return MANGA_SOURCES[id]; }) : [];
        (mangaIds.length ? mangaIds : Object.keys(MANGA_SOURCES)).forEach(function(id) {
            var option = document.createElement('option');
            option.value = id;
            option.textContent = MANGA_SOURCES[id].name;
            sourceSelect.appendChild(option);
        });
        currentSource = sourceSelect.value;
    }

    loadTags();

    if (sourceSelect) {
        sourceSelect.addEventListener('change', function() {
            currentSource = this.value;
            currentCategory = MANGA_SOURCES[currentSource].categories[0].id;
            pnum = 1;
            searchKeyword = '';
            hasMoreManga = true;
            loadTags();
        });
    }

    // Local / Online tab switching
    document.querySelectorAll('.tab-nav .tab-btn').forEach(function (btn) {
        btn.addEventListener('click', function () { switchLocalTab(this.getAttribute('data-tab')); });
    });

    var localMangaStatus = document.getElementById('localMangaStatus');
    function setLocalMangaStatus(text) {
        if (localMangaStatus) localMangaStatus.textContent = String(text || '');
    }
    function openLocalManga(mode) {
        if (!window.LocalMediaAdapters || !window.LocalMediaAdapters.manga) {
            setLocalMangaStatus(localT('notLoaded'));
            return;
        }
        setLocalMangaStatus(localT(mode === 'files' ? 'choosingFiles' : 'choosingFolder'));
        window.LocalMediaAdapters.manga.open({
            mode: mode,
            onProgress: function (text) { setLocalMangaStatus(text); },
            onEmpty: function () { setLocalMangaStatus(localT('noImageFiles')); },
            onStageFailed: function (stage) {
                // Prefer the localized copy; the core only supplies English text.
                setLocalMangaStatus(localT(stageStatusKey(stage)));
            }
        });
    }
    // Re-open the previously granted folder without showing a picker.
    function restoreLocalManga() {
        if (!window.LocalMediaAdapters || !window.LocalMediaAdapters.manga
            || !window.LocalMediaAdapters.manga.restore) {
            setLocalMangaStatus(localT('notLoaded'));
            return;
        }
        setLocalMangaStatus(localT('restoringFolder'));
        window.LocalMediaAdapters.manga.restore({
            onProgress: function (text) { setLocalMangaStatus(text); },
            onEmpty: function () { setLocalMangaStatus(localT('noSavedFolder')); },
            onDenied: function () { setLocalMangaStatus(localT('permDenied')); }
        });
    }
    var localMangaFolderBtn = document.getElementById('localMangaFolderBtn');
    if (localMangaFolderBtn) {
        localMangaFolderBtn.addEventListener('click', function () { openLocalManga('directory'); });
    }
    var localMangaFilesBtn = document.getElementById('localMangaFilesBtn');
    if (localMangaFilesBtn) {
        localMangaFilesBtn.addEventListener('click', function () { openLocalManga('files'); });
    }
    var localRestoreBtn = document.getElementById('localRestoreBtn');
    if (localRestoreBtn) {
        localRestoreBtn.addEventListener('click', restoreLocalManga);
    }

    // Back button
    var backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = '../index.html';
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
