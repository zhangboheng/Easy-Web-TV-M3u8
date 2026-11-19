// Novel List Page JS - public-apis sources (Books section)
// Native JavaScript (No jQuery)
//
// Sources from Downloads/public-apis-master/README.md (Books):
//   Gutendex     https://gutendex.com/             - Project Gutenberg full text
//   Open Library https://openlibrary.org/dev...   - book metadata + covers
//   PoetryDB     https://poetrydb.org             - public-domain poems
//   Bible API    https://bible-api.com/           - Bible passages
// Royal Road / 和图书 removed. All requests use apiproxy.js helpers.

var GUTENDEX_API = 'https://gutendex.com/books';
var OPENLIBRARY_API = 'https://openlibrary.org/search.json';
var POETRYDB_API = 'https://poetrydb.org';
var BIBLE_API = 'https://bible-api.com';

// Novel source registry: fixed browse filters per source.
var NOVEL_SOURCES = {
    gutendex: {
        name: 'Gutendex (Gutenberg)',
        categories: [
            { id: 'popular', name: 'Popular Books' },
            { id: 'fiction', name: 'Fiction' },
            { id: 'romance', name: 'Romance' },
            { id: 'adventure', name: 'Adventure' },
            { id: 'children', name: "Children's" },
            { id: 'history', name: 'History' },
            { id: 'poetry', name: 'Poetry Books' },
            { id: 'scifi', name: 'Science Fiction' },
            { id: 'newest', name: 'Newest' }
        ]
    },
    openlibrary: {
        name: 'Open Library',
        categories: [
            { id: 'classic', name: 'Classics' },
            { id: 'fiction', name: 'Fiction' },
            { id: 'fantasy', name: 'Fantasy' },
            { id: 'mystery', name: 'Mystery' },
            { id: 'romance', name: 'Romance' },
            { id: 'scifi', name: 'Science Fiction' },
            { id: 'history', name: 'History' },
            { id: 'new', name: 'Recently Added' }
        ]
    },
    poetrydb: {
        name: 'PoetryDB',
        categories: [
            { id: 'winter', name: 'Winter Poems' },
            { id: 'love', name: 'Love Poems' },
            { id: 'nature', name: 'Nature Poems' },
            { id: 'sonnet', name: 'Sonnets' },
            { id: 'dickinson', name: 'Emily Dickinson' },
            { id: 'shakespeare', name: 'Shakespeare' }
        ]
    },
    bible: {
        name: 'Bible API',
        categories: [
            { id: 'john', name: 'John' },
            { id: 'genesis', name: 'Genesis' },
            { id: 'psalms', name: 'Psalms' },
            { id: 'proverbs', name: 'Proverbs' },
            { id: 'matthew', name: 'Matthew' },
            { id: 'romans', name: 'Romans' }
        ]
    }
};

// Global variables
var pnum = 1;
var currentCategory = 'popular';
var currentSource = 'gutendex';
var currentListUrl = '';
var hasMoreNovels = true;
var lastFirstNovelUrl = '';
var searchKeyword = '';
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

// Render novel cards from normalized [{ title, url, src, image, author }]
function renderNovels(novels, append = false) {
    var grid = document.getElementById('contentGrid');

    if (!append) {
        grid.innerHTML = '';
        grid.classList.add('has-results');
    }

    if (novels.length === 0 && !append) {
        grid.innerHTML = '<div class="empty-state"><i class="fas fa-book"></i><p>No books found</p></div>';
        return;
    }

    novels.forEach(function(novel) {
        var card = document.createElement('a');
        card.href = '../catalogues/novelplay.html?web=' + encodeURIComponent(novel.url) + '&src=' + encodeURIComponent(novel.src);
        card.className = 'card-item';
        card.innerHTML = `
            <img class="card-image" src="${escapeHtml(novel.image || '../images/noimage.jpeg')}" alt="${escapeHtml(novel.title)}" onerror="this.src='../images/noimage.jpeg'">
            <div class="card-overlay"></div>
            <div class="card-play-icon">
                <i class="fas fa-book-open"></i>
            </div>
            <div class="card-info">
                <div class="card-type">Book</div>
                <h3 class="card-title">${escapeHtml(novel.title)}</h3>
                <p class="card-author">${novel.author ? '[' + escapeHtml(novel.author) + ']' : ''}</p>
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
        item.dataset.id = cat.id;
        item.dataset.name = cat.name;
        item.innerHTML = `
            <i class="fas fa-bookmark"></i>
            <span>${escapeHtml(cat.name)}</span>
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

            currentCategory = this.dataset.id;
            currentListUrl = '';
            searchKeyword = '';
            pnum = 1;
            hasMoreNovels = true;
            lastFirstNovelUrl = '';
            loadNovels('', false);

            // Hide sidebar on mobile
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('show-mobile');
            }
        });
    });
}

// Build the API URL for the current source/category/keyword/page
function buildListUrl(page) {
    var cat = currentCategory;
    var q = searchKeyword;

    if (currentSource === 'gutendex') {
        var url = GUTENDEX_API + '?languages=en&mime_type=text%2F&page=' + page;
        if (q) url += '&search=' + encodeURIComponent(q);
        else if (cat === 'newest') url += '&sort=descending';
        else if (cat !== 'popular') {
            var topics = { fiction: 'fiction', romance: 'love stories', adventure: 'adventure', children: 'children', history: 'history', poetry: 'poetry', scifi: 'science fiction' };
            url += '&topic=' + encodeURIComponent(topics[cat] || cat);
        }
        return url;
    }

    if (currentSource === 'openlibrary') {
        var subjects = { classic: 'classics', fiction: 'fiction', fantasy: 'fantasy', mystery: 'mystery', romance: 'romance', scifi: 'science fiction', history: 'history' };
        var query = q || (cat === 'new' ? '*:*' : 'subject:' + (subjects[cat] || cat));
        return OPENLIBRARY_API + '?q=' + encodeURIComponent(query) +
            '&fields=key,title,author_name,cover_i,first_publish_year,subject&limit=24&page=' + page +
            (cat === 'new' && !q ? '&sort=new' : '');
    }

    if (currentSource === 'poetrydb') {
        var terms = { winter: 'Winter', love: 'Love', nature: 'Nature', sonnet: 'Sonnet', dickinson: 'Emily Dickinson', shakespeare: 'William Shakespeare' };
        var term = q || terms[cat] || 'Love';
        var field = (cat === 'dickinson' || cat === 'shakespeare') && !q ? 'author' : 'title';
        return POETRYDB_API + '/' + field + '/' + encodeURIComponent(term);
    }

    // Bible API: passages are fixed per category, search accepts a reference
    var books = { john: 'John', genesis: 'Genesis', psalms: 'Psalms', proverbs: 'Proverbs', matthew: 'Matthew', romans: 'Romans' };
    var ref = q || (books[cat] || 'John') + ' 1';
    return BIBLE_API + '/' + encodeURIComponent(ref) + '?translation=web';
}

// Normalize Gutendex book object
function gutendexToNovel(book) {
    var formats = book.formats || {};
    var textUrl = formats['text/plain; charset=utf-8'] || formats['text/plain; charset=us-ascii'] || formats['text/plain'] || formats['text/html'] || '';
    if (!textUrl) return null;
    var cover = formats['image/jpeg'] || '';
    var authors = (book.authors || []).map(function(a) { return a.name; }).join(', ');
    return { title: book.title || 'Untitled', url: GUTENDEX_API + '/' + book.id, src: 'gutendex', image: cover, author: authors };
}

// Normalize Open Library search doc
function openlibraryToNovel(doc) {
    var key = doc.key || '';
    if (!key) return null;
    var cover = doc.cover_i ? 'https://covers.openlibrary.org/b/id/' + doc.cover_i + '-M.jpg' : '';
    return { title: doc.title || 'Untitled', url: 'https://openlibrary.org' + key + '.json', src: 'openlibrary', image: cover, author: (doc.author_name || []).join(', ') };
}

// Normalize PoetryDB poem (encode its title/author into the reader URL)
function poetrydbToNovel(poem) {
    var title = poem.title || 'Untitled Poem';
    var author = poem.author || '';
    var url = POETRYDB_API + '/title/' + encodeURIComponent(title) + '?author=' + encodeURIComponent(author);
    return { title: title, url: url, src: 'poetrydb', image: '', author: author };
}

// Bible API: one passage per card; chapters are generated in the reader
function bibleToNovel(data, url) {
    return { title: data.reference || 'Bible Passage', url: url, src: 'bible', image: '', author: data.translation_name || 'Bible API' };
}

// Load novels from source
function loadNovels(ignoredUrl, append = false) {
    if (isLoading) return;
    isLoading = true;
    showLoading(true);

    var page = append ? pnum : 1;
    var url = buildListUrl(page);
    currentListUrl = url;

    fetchJSONWithProxy(url)
        .then(function(data) {
            var novels = [];
            var hasMore = false;

            if (currentSource === 'gutendex') {
                novels = ((data && data.results) || []).map(gutendexToNovel).filter(Boolean);
                hasMore = !!(data && data.next);
            } else if (currentSource === 'openlibrary') {
                novels = ((data && data.docs) || []).map(openlibraryToNovel).filter(Boolean);
                var numFound = (data && (data.numFound || data.num_found)) || 0;
                hasMore = page * 24 < numFound;
            } else if (currentSource === 'poetrydb') {
                var poems = Array.isArray(data) ? data : [];
                novels = poems.slice(0, 24).map(poetrydbToNovel).filter(Boolean);
                hasMore = false;
            } else if (currentSource === 'bible') {
                novels = (data && data.verses) ? [bibleToNovel(data, url)] : [];
                hasMore = false;
            }

            renderNovels(novels, append);
            hasMoreNovels = hasMore && novels.length > 0;
            if (hasMoreNovels) pnum = page + 1;
            isLoading = false;
            showLoading(false);
        })
        .catch(function(error) {
            console.error('Failed to load novels (' + currentSource + '):', error);
            if (!append) renderNovels([], false);
            showToast('Failed to load books', 'error');
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

    if (categories.length > 0) {
        currentCategory = categories[0].id;
        currentListUrl = '';
        searchKeyword = '';
        pnum = 1;
        hasMoreNovels = true;
        lastFirstNovelUrl = '';
        loadNovels('', false);
    }
}

// Search novels
function searchNovels(keyword) {
    if (!keyword) return;
    searchKeyword = keyword;
    currentListUrl = '';
    pnum = 1;
    hasMoreNovels = true;
    loadNovels('', false);
}

// Lightweight i18n for header tab labels (Online/Local) and local panel texts.
// Mirrors tocomprehensive.js's TC_I18N: reads the same localStorage keys the
// main page stores (preferredLanguage / languages); unknown -> English.
var LOCAL_I18N = {
    en: {
        tabOnline: 'Online',
        tabLocal: 'Local',
        localTitle: 'Local Novels',
        localDesc: 'Choose TXT / Markdown files or a whole folder from your device. Files stay in this browser and are never uploaded.',
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
        noTextFiles: 'No supported TXT / Markdown files found.'
    },
    zh: {
        tabOnline: '在线',
        tabLocal: '本地',
        localTitle: '本地小说',
        localDesc: '从设备选择 TXT / Markdown 文件或整个文件夹。文件仅保存在本浏览器中，不会被上传。',
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
        noTextFiles: '未找到受支持的 TXT / Markdown 文件。'
    },
    // Module-specific labels for the remaining UI languages. Shared panel
    // texts (pick/choose/notLoaded/no*Files) come from js/local-media-i18n.js.
    ja: {
        tabOnline: 'オンライン',
        tabLocal: 'ローカル',
        localTitle: 'ローカル小説',
        localDesc: 'デバイスから TXT / Markdown ファイルまたはフォルダー全体を選択します。ファイルはこのブラウザー内にのみ保存され、アップロードされることはありません。',
        noTextFiles: 'サポートされている TXT / Markdown ファイルが見つかりませんでした。'
    },
    ko: {
        tabOnline: '온라인',
        tabLocal: '로컬',
        localTitle: '로컬 소설',
        localDesc: '기기에서 TXT / Markdown 파일이나 폴더 전체를 선택하세요. 파일은 이 브라우저에만 저장되며 업로드되지 않습니다.',
        noTextFiles: '지원되는 TXT / Markdown 파일을 찾을 수 없습니다.'
    },
    fr: {
        tabOnline: 'En ligne',
        tabLocal: 'Local',
        localTitle: 'Romans locaux',
        localDesc: 'Choisissez des fichiers TXT / Markdown ou un dossier entier depuis votre appareil. Les fichiers restent dans ce navigateur et ne sont jamais téléversés.',
        noTextFiles: "Aucun fichier TXT / Markdown pris en charge n'a été trouvé."
    },
    de: {
        tabOnline: 'Online',
        tabLocal: 'Lokal',
        localTitle: 'Lokale Romane',
        localDesc: 'Wählen Sie TXT-/Markdown-Dateien oder einen ganzen Ordner von Ihrem Gerät. Die Dateien bleiben in diesem Browser und werden nie hochgeladen.',
        noTextFiles: 'Keine unterstützten TXT-/Markdown-Dateien gefunden.'
    },
    es: {
        tabOnline: 'En línea',
        tabLocal: 'Local',
        localTitle: 'Novelas locales',
        localDesc: 'Elige archivos TXT / Markdown o una carpeta completa de tu dispositivo. Los archivos permanecen en este navegador y nunca se suben.',
        noTextFiles: 'No se encontraron archivos TXT / Markdown compatibles.'
    },
    ru: {
        tabOnline: 'Онлайн',
        tabLocal: 'Локально',
        localTitle: 'Локальные романы',
        localDesc: 'Выберите файлы TXT / Markdown или целую папку с устройства. Файлы остаются в этом браузере и никогда не загружаются.',
        noTextFiles: 'Поддерживаемые файлы TXT / Markdown не найдены.'
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
    console.log('=== Novel List Page Loaded ===');
    applyLocalI18n();
    
    // Load source options
    var sourceSelect = document.getElementById('sourceSelect');
    if (sourceSelect) {
        Object.keys(NOVEL_SOURCES).forEach(function(id) {
            var option = document.createElement('option');
            option.value = id;
            option.textContent = NOVEL_SOURCES[id].name;
            sourceSelect.appendChild(option);
        });
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
    
    // Local / Online tab switching
    document.querySelectorAll('.tab-nav .tab-btn').forEach(function (btn) {
        btn.addEventListener('click', function () { switchLocalTab(this.getAttribute('data-tab')); });
    });

    var localNovelStatus = document.getElementById('localNovelStatus');
    function setLocalNovelStatus(text) {
        if (localNovelStatus) localNovelStatus.textContent = String(text || '');
    }
    function openLocalNovel(mode) {
        if (!window.LocalMediaAdapters || !window.LocalMediaAdapters.novel) {
            setLocalNovelStatus(localT('notLoaded'));
            return;
        }
        setLocalNovelStatus(localT(mode === 'files' ? 'choosingFiles' : 'choosingFolder'));
        window.LocalMediaAdapters.novel.open({
            mode: mode,
            onProgress: function (text) { setLocalNovelStatus(text); },
            onEmpty: function () { setLocalNovelStatus(localT('noTextFiles')); },
            onStageFailed: function (stage) {
                // Prefer the localized copy; the core only supplies English text.
                setLocalNovelStatus(localT(stageStatusKey(stage)));
            }
        });
    }
    // Re-open the previously granted folder without showing a picker.
    function restoreLocalNovel() {
        if (!window.LocalMediaAdapters || !window.LocalMediaAdapters.novel
            || !window.LocalMediaAdapters.novel.restore) {
            setLocalNovelStatus(localT('notLoaded'));
            return;
        }
        setLocalNovelStatus(localT('restoringFolder'));
        window.LocalMediaAdapters.novel.restore({
            onProgress: function (text) { setLocalNovelStatus(text); },
            onEmpty: function () { setLocalNovelStatus(localT('noSavedFolder')); },
            onDenied: function () { setLocalNovelStatus(localT('permDenied')); }
        });
    }
    var localNovelFolderBtn = document.getElementById('localNovelFolderBtn');
    if (localNovelFolderBtn) {
        localNovelFolderBtn.addEventListener('click', function () { openLocalNovel('directory'); });
    }
    var localNovelFilesBtn = document.getElementById('localNovelFilesBtn');
    if (localNovelFilesBtn) {
        localNovelFilesBtn.addEventListener('click', function () { openLocalNovel('files'); });
    }
    var localRestoreBtn = document.getElementById('localRestoreBtn');
    if (localRestoreBtn) {
        localRestoreBtn.addEventListener('click', restoreLocalNovel);
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
    
    // Scroll to load more: request the next page of the current API list
    var contentArea = document.getElementById('contentArea');
    if (contentArea) {
        contentArea.addEventListener('scroll', function() {
            var scrollTop = this.scrollTop;
            var scrollHeight = this.scrollHeight;
            var height = this.offsetHeight;

            if (scrollTop + height >= scrollHeight - 100) {
                if (!isLoading && hasMoreNovels) {
                    loadNovels('', true);
                }
            }
        });
    }
});
