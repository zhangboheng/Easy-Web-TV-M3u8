// Novel Reader JS - public-apis sources (Books section)
// Native JavaScript (No jQuery)
//
// Reader dispatch uses ?src= gutendex | openlibrary | poetrydb | bible.
// Royal Road / 和图书 parsers removed. All requests use apiproxy.js helpers.

var GUTENDEX_API = 'https://gutendex.com/books';
var OPENLIBRARY_API = 'https://openlibrary.org';
var POETRYDB_API = 'https://poetrydb.org';
var BIBLE_API = 'https://bible-api.com';

// Favorite prefix for localStorage
var FAV_PREFIX = 'fav_novel_';

// Global variables
var chapters = [];
var currentChapterIndex = -1;
var currentNovelTitle = '';
var novelInfo = '';
var originUrl = '';
var prevChapterUrl = '';
var nextChapterUrl = '';
var readerSource = '';
var readerInitLink = '';

// Helper: escape untrusted plain text before inserting into readerContent
function escapeText(text) {
    return String(text === null || text === undefined ? '' : text)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

// Helper: render plain text as safe HTML paragraphs/lines
function textToHtml(text) {
    var lines = String(text || '').replace(/\r\n/g, '\n').split('\n');
    var html = '';
    var buffer = [];
    function flush() {
        if (buffer.length) {
            html += '<p>' + escapeText(buffer.join('\n')) + '</p>';
            buffer = [];
        }
    }
    lines.forEach(function(line) {
        if (!line.trim()) flush();
        else buffer.push(line);
    });
    flush();
    return html || '<p>No content available.</p>';
}

// Toast notification system
function showToast(message, type) {
    type = type || 'info';
    var iconMap = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        info: 'fa-info-circle',
        warning: 'fa-exclamation-triangle'
    };
    
    var toast = document.createElement('div');
    toast.className = 'toast ' + type;
    toast.innerHTML = 
        '<i class="fas ' + iconMap[type] + '"></i>' +
        '<span class="toast-message">' + message + '</span>' +
        '<button class="toast-close"><i class="fas fa-times"></i></button>';
    
    document.getElementById('toastContainer').appendChild(toast);
    
    toast.querySelector('.toast-close').addEventListener('click', function() {
        toast.remove();
    });
    
    // Auto remove after 3 seconds
    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(function() { toast.remove(); }, 300);
    }, 3000);
}

// Modal dialog system
function showModal(title, message, onConfirm, type) {
    type = type || 'warning';
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').textContent = message;
    
    var iconClass = type === 'error' ? 'error' : 'warning';
    var modalIcon = document.querySelector('#modalOverlay .modal-icon');
    modalIcon.className = 'modal-icon ' + iconClass;
    var iconI = modalIcon.querySelector('i');
    iconI.className = type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-exclamation-triangle';
    
    document.getElementById('modalOverlay').classList.remove('hidden');
    
    var confirmBtn = document.getElementById('modalConfirm');
    var cancelBtn = document.getElementById('modalCancel');
    
    // Clone and replace to remove old listeners
    var newConfirmBtn = confirmBtn.cloneNode(true);
    var newCancelBtn = cancelBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    
    newConfirmBtn.addEventListener('click', function() {
        document.getElementById('modalOverlay').classList.add('hidden');
        if (onConfirm) onConfirm();
    });
    
    newCancelBtn.addEventListener('click', function() {
        document.getElementById('modalOverlay').classList.add('hidden');
    });
}

// Loading control
function showLoading(show) {
    if (show) {
        document.getElementById('loadingOverlay').classList.remove('hidden');
    } else {
        document.getElementById('loadingOverlay').classList.add('hidden');
    }
}

// Toggle sidebar - toggle chapter list and toolbar visibility
function toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
    var toolbar = document.querySelector('.top-toolbar');
    var readerArea = document.getElementById('readerArea');
    
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

// Load favorites
function loadFavorites() {
    var favList = document.getElementById('favList');
    favList.innerHTML = '';
    
    var hasFavorites = false;
    
    Object.keys(localStorage).forEach(function(key) {
        if (key.startsWith(FAV_PREFIX)) {
            hasFavorites = true;
            var url = key.replace(FAV_PREFIX, '');
            var name = localStorage.getItem(key);
            
            var item = document.createElement('div');
            item.className = 'fav-item';
            item.setAttribute('data-url', url);
            item.innerHTML = 
                '<div class="fav-item-info">' +
                    '<div class="fav-item-name">' + escapeHtml(name) + '</div>' +
                '</div>' +
                '<button class="fav-item-remove" title="Remove">' +
                    '<i class="fas fa-times"></i>' +
                '</button>';
            
            favList.appendChild(item);
        }
    });
    
    if (!hasFavorites) {
        favList.innerHTML = 
            '<div class="no-favorites">' +
                '<i class="fas fa-heart-broken"></i>' +
                '<p>No favorites yet</p>' +
            '</div>';
    }
    
    // Bind click events
    var favItems = favList.querySelectorAll('.fav-item');
    favItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            if (!e.target.closest('.fav-item-remove')) {
                var url = this.getAttribute('data-url');
                var name = this.querySelector('.fav-item-name').textContent;
                document.getElementById('favPanel').classList.remove('show');
                loadChapter(url, name);
            }
        });
    });
    
    var removeBtns = favList.querySelectorAll('.fav-item-remove');
    removeBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var item = this.closest('.fav-item');
            var url = item.getAttribute('data-url');
            
            showModal('Remove Favorite', 'Are you sure you want to remove this from favorites?', function() {
                localStorage.removeItem(FAV_PREFIX + url);
                loadFavorites();
                updateChapterFavorites();
                showToast('Removed from favorites', 'success');
            });
        });
    });
}

// Toggle favorite
function toggleFavorite(url, name) {
    var favKey = FAV_PREFIX + url;
    var isFavorited = localStorage.getItem(favKey) === name;
    
    if (isFavorited) {
        localStorage.removeItem(favKey);
        showToast('Removed from favorites', 'success');
    } else {
        localStorage.setItem(favKey, name);
        showToast('Added to favorites', 'success');
    }
    
    loadFavorites();
    updateChapterFavorites();
}

// Update chapter list favorite icons
function updateChapterFavorites() {
    var items = document.querySelectorAll('.chapter-item');
    items.forEach(function(item) {
        var url = item.getAttribute('data-url');
        var name = item.getAttribute('data-name');
        var favKey = FAV_PREFIX + url;
        var isFav = localStorage.getItem(favKey) === name;
        
        var favBtn = item.querySelector('.fav-btn');
        if (isFav) {
            favBtn.classList.add('active');
        } else {
            favBtn.classList.remove('active');
        }
    });
}

// Render chapter list
function renderChapters(chapterData) {
    var list = document.getElementById('chapterList');
    list.innerHTML = '';
    
    chapters = chapterData;
    
    for (var i = 0; i < chapterData.length; i++) {
        var chapter = chapterData[i];
        var favKey = FAV_PREFIX + chapter.url;
        var isFav = localStorage.getItem(favKey) === chapter.name;
        
        var item = document.createElement('div');
        item.className = 'chapter-item';
        item.setAttribute('data-url', chapter.url);
        item.setAttribute('data-name', chapter.name);
        item.setAttribute('data-index', i);
        item.innerHTML = 
            '<span class="chapter-name">' + escapeHtml(chapter.name) + '</span>' +
            '<button class="fav-btn ' + (isFav ? 'active' : '') + '" title="Add to favorites">' +
                '<i class="fas fa-heart"></i>' +
            '</button>';
        
        list.appendChild(item);
    }
    
    // Bind click events
    var items = list.querySelectorAll('.chapter-item');
    items.forEach(function(item) {
        item.addEventListener('click', function(e) {
            if (!e.target.closest('.fav-btn')) {
                var url = this.getAttribute('data-url');
                var name = this.getAttribute('data-name');
                var index = parseInt(this.getAttribute('data-index'));
                
                document.querySelectorAll('.chapter-item').forEach(function(i) {
                    i.classList.remove('active');
                });
                this.classList.add('active');
                
                currentChapterIndex = index;
                loadChapter(url, name);
            }
        });
    });
    
    var favBtns = list.querySelectorAll('.fav-btn');
    favBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var item = this.closest('.chapter-item');
            var url = item.getAttribute('data-url');
            var name = item.getAttribute('data-name');
            toggleFavorite(url, name);
        });
    });
}

// In-memory cache for large Gutenberg texts. Chapter URLs are virtual keys;
// loadChapter reads the cached chunk instead of refetching the whole book.
var chapterCache = { data: {} };
function chapterCacheKey(source, textUrl, index) {
    return source + '::' + textUrl + '::' + index;
}

// Load chapter content from the public API source
function loadChapter(url, chapterName) {
    showLoading(true);
    var source = readerSource;
    var request;

    if (source === 'gutendex') {
        var m = String(url).match(/^gutendex::(.+)::(\d+)$/);
        if (!m) {
            request = Promise.reject(new Error('Invalid chapter key'));
        } else {
            var textUrl = m[1];
            var index = parseInt(m[2], 10);
            var cached = chapterCache.data[textUrl];
            var getChunk = cached
                ? Promise.resolve(cached[index])
                : fetchWithProxy(textUrl).then(function(text) {
                    var chunks = splitGutenbergText(text).slice(0, 80);
                    chapterCache.data[textUrl] = chunks;
                    return chunks[index];
                });
            request = getChunk.then(function(chunk) {
                return { html: textToHtml(chunk || 'Chapter not available.'), title: chapterName };
            });
        }
    } else if (source === 'openlibrary') {
        request = fetchJSONWithProxy(url).then(function(work) {
            var desc = work.description;
            if (desc && typeof desc === 'object') desc = desc.value;
            var subjects = (work.subjects || []).slice(0, 12).join(', ');
            var html = '<h2>' + escapeText(work.title || 'Untitled') + '</h2>' + textToHtml(desc || 'No description available.');
            if (subjects) html += '<p><strong>Subjects:</strong> ' + escapeText(subjects) + '</p>';
            if (work.key) html += '<p><a target="_blank" rel="noopener" href="' + escapeText(OPENLIBRARY_API + work.key) + '">View on Open Library</a></p>';
            return { html: html, title: chapterName || work.title };
        });
    } else if (source === 'poetrydb') {
        request = fetchJSONWithProxy(url).then(function(poems) {
            var list = Array.isArray(poems) ? poems : [];
            var poem = list[0] || {};
            var lines = (poem.lines || []).join('\n');
            var html = '<h2>' + escapeText(poem.title || chapterName) + '</h2>';
            if (poem.author) html += '<p><em>' + escapeText(poem.author) + '</em></p>';
            html += textToHtml(lines || 'Poem text not available.');
            return { html: html, title: poem.title || chapterName };
        });
    } else if (source === 'bible') {
        request = fetchJSONWithProxy(url).then(function(data) {
            var verses = data.verses || [];
            var html = '<h2>' + escapeText(data.reference || 'Bible Passage') + '</h2>';
            verses.forEach(function(v) {
                html += '<p><strong>' + escapeText(v.chapter + ':' + v.verse) + '</strong> ' + escapeText(v.text) + '</p>';
            });
            if (!verses.length && data.text) html += textToHtml(data.text);
            return { html: html, title: data.reference || chapterName };
        });
    } else {
        request = Promise.reject(new Error('Unsupported novel source'));
    }

    request.then(function(result) {
        var displayTitle = result.title || chapterName || 'Chapter';
        document.getElementById('chapterTitle').textContent = displayTitle;
        var titleDisplay = document.getElementById('chapterTitleDisplay');
        if (titleDisplay) titleDisplay.textContent = displayTitle;
        document.getElementById('readerContent').innerHTML = result.html || '<p>Unable to load content.</p>';

        document.getElementById('prevChapter').disabled = currentChapterIndex <= 0;
        document.getElementById('nextChapter').disabled = currentChapterIndex >= chapters.length - 1;
        prevChapterUrl = currentChapterIndex > 0 ? chapters[currentChapterIndex - 1].url : '';
        nextChapterUrl = currentChapterIndex < chapters.length - 1 ? chapters[currentChapterIndex + 1].url : '';
        document.getElementById('readerNav').style.display = 'flex';
        document.getElementById('readerArea').scrollTop = 0;
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('show-mobile');
        }
        document.getElementById('chapterCount').textContent = chapters.length;
    })
    .catch(function(error) {
        console.error('Failed to load chapter:', error);
        showToast('Failed to load chapter content. Please try again.', 'error');
        document.getElementById('readerContent').innerHTML = '<p style="text-align:center;color:rgba(255,255,255,0.5);">Unable to load chapter content. Please try another chapter.</p>';
    })
    .finally(function() {
        showLoading(false);
    });
}

// Set the novel info panel and title from parsed metadata
function setNovelHeader(title, info) {
    currentNovelTitle = title || 'Unknown Title';
    novelInfo = info || 'No description available.';
    document.getElementById('novelTitle').textContent = currentNovelTitle;
    document.getElementById('infoTitle').textContent = currentNovelTitle;
    document.getElementById('infoContent').textContent = novelInfo;
    document.title = currentNovelTitle + ' - Novel Reader';
}

// Split Gutenberg plain text into roughly equal readable chapters
function splitGutenbergText(text) {
    var clean = String(text || '').replace(/\r\n/g, '\n');
    var startMarker = clean.indexOf('*** START OF');
    var endMarker = clean.indexOf('*** END OF');
    if (startMarker > -1) clean = clean.slice(startMarker);
    if (endMarker > startMarker && endMarker > -1) clean = clean.slice(0, endMarker);

    var lines = clean.split('\n');
    var maxChars = 14000;
    var result = [];
    var current = [];
    var size = 0;
    lines.forEach(function(line) {
        current.push(line);
        size += line.length + 1;
        if (size >= maxChars) {
            result.push(current.join('\n'));
            current = [];
            size = 0;
        }
    });
    if (current.join('\n').trim()) result.push(current.join('\n'));
    return result.length ? result : [clean];
}

// Gutendex: fetch metadata + full plain text, split into chapters
function parseGutendex(metaUrl) {
    var bookId = String(metaUrl).match(/\/books\/(\d+)/);
    var apiUrl = bookId ? GUTENDEX_API + '/' + bookId[1] + '/' : metaUrl;
    fetchJSONWithProxy(apiUrl)
        .then(function(book) {
            var formats = book.formats || {};
            var textUrl = formats['text/plain; charset=utf-8'] || formats['text/plain; charset=us-ascii'] || formats['text/plain'] || formats['text/html'];
            if (!textUrl) throw new Error('No readable text format');
            var authors = (book.authors || []).map(function(a) { return a.name; }).join(', ');
            var summary = (book.summaries || [])[0] || (book.subjects || []).slice(0, 8).join(', ');
            setNovelHeader(book.title, (authors ? 'Author: ' + authors + '\n\n' : '') + (summary || 'No description available.'));
            return fetchWithProxy(textUrl).then(function(text) {
                var chunks = splitGutenbergText(text).slice(0, 80);
                chapterCache.data[textUrl] = chunks;
                chapters = chunks.map(function(chunk, i) {
                    return { name: 'Part ' + (i + 1), url: chapterCacheKey('gutendex', textUrl, i) };
                });
                renderChapters(chapters);
                currentChapterIndex = 0;
                var first = document.querySelector('.chapter-item');
                if (first) first.classList.add('active');
                loadChapter(chapters[0].url, chapters[0].name);
            });
        })
        .catch(function(error) {
            console.error('Failed to load Gutendex book:', error);
            showToast('Failed to load book. Please try again.', 'error');
            showLoading(false);
        });
}

// Open Library: metadata only (full text is not exposed by this API)
function parseOpenLibrary(workUrl) {
    fetchJSONWithProxy(workUrl)
        .then(function(work) {
            var desc = work.description;
            if (desc && typeof desc === 'object') desc = desc.value;
            var subjects = (work.subjects || []).slice(0, 10).join(', ');
            setNovelHeader(work.title, (desc || 'No description available.') + (subjects ? '\n\nSubjects: ' + subjects : ''));
            chapters = [{ name: 'Book Details', url: workUrl }];
            renderChapters(chapters);
            currentChapterIndex = 0;
            var first = document.querySelector('.chapter-item');
            if (first) first.classList.add('active');
            loadChapter(workUrl, 'Book Details');
        })
        .catch(function(error) {
            console.error('Failed to load Open Library work:', error);
            showToast('Failed to load book. Please try again.', 'error');
            showLoading(false);
        });
}

// PoetryDB: the list URL points at one poem; nearby poems become chapters
function parsePoetryDB(poemUrl) {
    fetchJSONWithProxy(poemUrl)
        .then(function(poems) {
            var list = Array.isArray(poems) ? poems : [];
            var poem = list[0] || {};
            setNovelHeader(poem.title || 'Poem', (poem.author ? 'Author: ' + poem.author + '\n\n' : '') + (poem.linecount ? poem.linecount + ' lines' : 'PoetryDB public-domain poem'));
            chapters = list.slice(0, 24).map(function(item, i) {
                return { name: item.title || ('Poem ' + (i + 1)), url: POETRYDB_API + '/title/' + encodeURIComponent(item.title || '') + '?author=' + encodeURIComponent(item.author || '') };
            });
            if (!chapters.length) chapters = [{ name: poem.title || 'Poem', url: poemUrl }];
            renderChapters(chapters);
            currentChapterIndex = 0;
            var first = document.querySelector('.chapter-item');
            if (first) first.classList.add('active');
            loadChapter(chapters[0].url, chapters[0].name);
        })
        .catch(function(error) {
            console.error('Failed to load PoetryDB poem:', error);
            showToast('Failed to load poem. Please try again.', 'error');
            showLoading(false);
        });
}

// Bible API: passage + adjacent chapters of the same book
function parseBible(passageUrl) {
    fetchJSONWithProxy(passageUrl)
        .then(function(data) {
            var firstVerse = (data.verses || [])[0] || {};
            var book = firstVerse.book_name || (data.reference || '').replace(/\s*\d.*$/, '') || 'John';
            var chapter = firstVerse.chapter || parseInt((data.reference || '').match(/(\d+)/) || [0, 1], 10) || 1;
            setNovelHeader(data.reference || 'Bible Passage', (data.translation_name || 'Bible API') + '\n\n' + (data.translation_note || ''));
            chapters = [];
            for (var c = Math.max(1, chapter - 2); c <= chapter + 2; c++) {
                chapters.push({ name: book + ' ' + c, url: BIBLE_API + '/' + encodeURIComponent(book + ' ' + c) + '?translation=web' });
            }
            renderChapters(chapters);
            currentChapterIndex = 0;
            var first = document.querySelector('.chapter-item');
            if (first) first.classList.add('active');
            loadChapter(passageUrl, data.reference || 'Bible Passage');
        })
        .catch(function(error) {
            console.error('Failed to load Bible passage:', error);
            showToast('Failed to load passage. Please try again.', 'error');
            showLoading(false);
        });
}

// Turn page (prev/next)
function turnPage(url) {
    if (!url) return;
    
    // Find chapter index
    for (var i = 0; i < chapters.length; i++) {
        if (chapters[i].url === url) {
            currentChapterIndex = i;
            break;
        }
    }
    
    loadChapter(url, '');
    
    // Update active state
    document.querySelectorAll('.chapter-item').forEach(function(item) {
        item.classList.remove('active');
    });
    var activeItem = document.querySelector('.chapter-item[data-url="' + url + '"]');
    if (activeItem) activeItem.classList.add('active');
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Novel Reader JS Loaded ===');
    
    // Load favorites
    loadFavorites();
    
    // Parse URL parameters
    var params = new URLSearchParams(window.location.search);
    var initlink = params.get('web') || '';
    var srcParam = params.get('src') || '';
    readerSource = srcParam;
    readerInitLink = initlink;

    console.log('Init link:', initlink, 'source:', srcParam);

    if (initlink && srcParam) {
        showLoading(true);
        if (srcParam === 'gutendex') {
            parseGutendex(initlink);
        } else if (srcParam === 'openlibrary') {
            parseOpenLibrary(initlink);
        } else if (srcParam === 'poetrydb') {
            parsePoetryDB(initlink);
        } else if (srcParam === 'bible') {
            parseBible(initlink);
        } else {
            showToast('Unsupported novel source.', 'error');
            showLoading(false);
        }
    } else {
        showToast('No novel URL provided', 'warning');
        showLoading(false);
    }
    
    // UI Event handlers
    // Toggle Sidebar button
    var toggleSidebarBtn = document.getElementById('toggleSidebar');
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', function() {
            toggleSidebar();
        });
    }
    
    var backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.history.back();
        });
    }
    
    var favBtn = document.getElementById('favBtn');
    if (favBtn) {
        favBtn.addEventListener('click', function() {
            document.getElementById('favPanel').classList.toggle('show');
        });
    }
    
    var closeFavPanel = document.getElementById('closeFavPanel');
    if (closeFavPanel) {
        closeFavPanel.addEventListener('click', function() {
            document.getElementById('favPanel').classList.remove('show');
        });
    }
    
    var infoBtn = document.getElementById('infoBtn');
    if (infoBtn) {
        infoBtn.addEventListener('click', function() {
            var novelInfo = document.getElementById('novelInfo');
            if (novelInfo.style.display === 'none' || !novelInfo.style.display) {
                novelInfo.style.display = 'block';
            } else {
                novelInfo.style.display = 'none';
            }
        });
    }
    
    var prevChapter = document.getElementById('prevChapter');
    if (prevChapter) {
        prevChapter.addEventListener('click', function() {
            if (prevChapterUrl) {
                turnPage(prevChapterUrl);
            }
        });
    }
    
    var nextChapter = document.getElementById('nextChapter');
    if (nextChapter) {
        nextChapter.addEventListener('click', function() {
            if (nextChapterUrl) {
                turnPage(nextChapterUrl);
            }
        });
    }
    
    // Close panels when clicking outside
    document.addEventListener('click', function(e) {
        var favPanel = document.getElementById('favPanel');
        var favBtnEl = document.getElementById('favBtn');
        if (!favPanel.contains(e.target) && !favBtnEl.contains(e.target)) {
            favPanel.classList.remove('show');
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft' && prevChapterUrl) {
            turnPage(prevChapterUrl);
        } else if (e.key === 'ArrowRight' && nextChapterUrl) {
            turnPage(nextChapterUrl);
        }
    });
    
    // Chapter search functionality
    var chapterSearch = document.getElementById('chapterSearch');
    if (chapterSearch) {
        chapterSearch.addEventListener('input', function() {
            var keyword = this.value.toLowerCase();
            document.querySelectorAll('.chapter-item').forEach(function(item) {
                var name = item.querySelector('.chapter-name').textContent.toLowerCase();
                if (name.indexOf(keyword) > -1) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // GitHub button
    var githubBtn = document.getElementById('githubBtn');
    if (githubBtn) {
        githubBtn.addEventListener('click', function() {
            window.open('https://github.com/zhangboheng/Easy-Web-TV-M3u8', '_blank');
        });
    }
    
    // Font settings functionality
    var currentFontSize = 18;
    var currentFontFamily = "Georgia, 'Times New Roman', serif";
    
    // Toggle font panel
    var fontBtn = document.getElementById('fontBtn');
    if (fontBtn) {
        fontBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            document.getElementById('fontPanel').classList.toggle('show');
        });
    }
    
    // Close font panel when clicking outside
    document.addEventListener('click', function(e) {
        var fontPanel = document.getElementById('fontPanel');
        var fontBtnEl = document.getElementById('fontBtn');
        if (fontPanel && fontBtnEl && !fontPanel.contains(e.target) && !fontBtnEl.contains(e.target)) {
            fontPanel.classList.remove('show');
        }
    });
    
    // Increase font size
    var fontIncrease = document.getElementById('fontIncrease');
    if (fontIncrease) {
        fontIncrease.addEventListener('click', function() {
            if (currentFontSize < 32) {
                currentFontSize += 2;
                updateFontSize();
            }
        });
    }
    
    // Decrease font size
    var fontDecrease = document.getElementById('fontDecrease');
    if (fontDecrease) {
        fontDecrease.addEventListener('click', function() {
            if (currentFontSize > 12) {
                currentFontSize -= 2;
                updateFontSize();
            }
        });
    }
    
    // Font family change
    var fontFamily = document.getElementById('fontFamily');
    if (fontFamily) {
        fontFamily.addEventListener('change', function() {
            currentFontFamily = this.value;
            updateFontFamily();
        });
    }
    
    function updateFontSize() {
        document.getElementById('currentFontSize').textContent = currentFontSize + 'px';
        document.getElementById('readerContent').style.fontSize = currentFontSize + 'px';
        // Save to localStorage
        localStorage.setItem('novelFontSize', currentFontSize);
    }
    
    function updateFontFamily() {
        document.getElementById('readerContent').style.fontFamily = currentFontFamily;
        // Save to localStorage
        localStorage.setItem('novelFontFamily', currentFontFamily);
    }
    
    // Load saved font settings
    function loadFontSettings() {
        var savedFontSize = localStorage.getItem('novelFontSize');
        var savedFontFamily = localStorage.getItem('novelFontFamily');
        
        if (savedFontSize) {
            currentFontSize = parseInt(savedFontSize);
            document.getElementById('currentFontSize').textContent = currentFontSize + 'px';
            document.getElementById('readerContent').style.fontSize = currentFontSize + 'px';
        }
        
        if (savedFontFamily) {
            currentFontFamily = savedFontFamily;
            var fontFamilySelect = document.getElementById('fontFamily');
            if (fontFamilySelect) fontFamilySelect.value = savedFontFamily;
            document.getElementById('readerContent').style.fontFamily = savedFontFamily;
        }
    }
    
    // Initialize font settings on page load
    loadFontSettings();
});
