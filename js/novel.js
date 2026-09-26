// Novel Reader JS - Modern UI Version
// Native JavaScript (No jQuery)

// CORS proxy + failover now live in ../js/apiproxy.js (fetchWithProxy)

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

// Helper: parse HTML string to DOM
function parseHTML(htmlString) {
    var parser = new DOMParser();
    return parser.parseFromString(htmlString, 'text/html');
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
                    '<div class="fav-item-name">' + name + '</div>' +
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
            '<span class="chapter-name">' + chapter.name + '</span>' +
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

// Load chapter content
function loadChapter(url, chapterName) {
    showLoading(true);
    
    fetchWithProxy(url)
        .then(function(data) {
            var html = parseHTML(data);
            
            var title = '';
            var content = '';
            var prevUrl = '';
            var nextUrl = '';
            
            if (url.indexOf('royalroad.com') > -1) {
                // Try multiple selectors for chapter title
                title = html.querySelector('.chapter-title');
                if (title) title = title.textContent.trim();
                if (!title) {
                    title = html.querySelector('h1');
                    if (title) title = title.textContent.trim();
                }
                if (!title) {
                    title = html.querySelector('[property="name"]');
                    if (title) title = title.textContent.trim();
                }
                
                // Try multiple selectors for chapter content
                var chapterContent = html.querySelector('.chapter-content');
                if (!chapterContent) {
                    chapterContent = html.querySelector('.fic-chapter-content');
                }
                if (!chapterContent) {
                    chapterContent = html.querySelector('[property="articleBody"]');
                }
                if (!chapterContent) {
                    chapterContent = html.querySelector('article .content');
                }
                
                if (chapterContent) {
                    // Clean up content - remove unwanted elements
                    var clone = chapterContent.cloneNode(true);
                    var scripts = clone.querySelectorAll('script, style, .ads, .advertisement, .comments');
                    scripts.forEach(function(s) { s.remove(); });
                    content = clone.innerHTML;
                }
                
                // Navigation - try multiple selectors
                // Previous chapter
                var prevLink = html.querySelector('[rel="prev"]');
                if (!prevLink) {
                    prevLink = html.querySelector('.nav-previous a, .prev-chapter a');
                }
                if (!prevLink) {
                    var allLinks = html.querySelectorAll('a[href*="/chapter/"]');
                    allLinks.forEach(function(link) {
                        var text = link.textContent.toLowerCase();
                        if (text.indexOf('previous') > -1 || text.indexOf('prev') > -1) {
                            prevLink = link;
                        }
                    });
                }
                
                // Next chapter
                var nextLink = html.querySelector('[rel="next"]');
                if (!nextLink) {
                    nextLink = html.querySelector('.nav-next a, .next-chapter a');
                }
                if (!nextLink) {
                    var allLinks = html.querySelectorAll('a[href*="/chapter/"]');
                    allLinks.forEach(function(link) {
                        var text = link.textContent.toLowerCase();
                        if (text.indexOf('next') > -1) {
                            nextLink = link;
                        }
                    });
                }
                
                if (prevLink && prevLink.getAttribute('href')) {
                    var prevHref = prevLink.getAttribute('href');
                    if (prevHref.indexOf('http') === -1) {
                        prevUrl = 'https://www.royalroad.com' + prevHref;
                    } else {
                        prevUrl = prevHref;
                    }
                }
                
                if (nextLink && nextLink.getAttribute('href')) {
                    var nextHref = nextLink.getAttribute('href');
                    if (nextHref.indexOf('http') === -1) {
                        nextUrl = 'https://www.royalroad.com' + nextHref;
                    } else {
                        nextUrl = nextHref;
                    }
                }
            }
            
            // Update reader - update both toolbar title and display title
            var displayTitle = title || chapterName || 'Chapter';
            document.getElementById('chapterTitle').textContent = displayTitle;
            var titleDisplay = document.getElementById('chapterTitleDisplay');
            if (titleDisplay) {
                titleDisplay.textContent = displayTitle;
            }
            
            if (content) {
                document.getElementById('readerContent').innerHTML = content;
            } else {
                document.getElementById('readerContent').innerHTML = '<p style="text-align: center; color: rgba(255,255,255,0.5);">Unable to load chapter content. Please try again or select another chapter.</p>';
            }
            
            // Update navigation based on chapter index
            // prevChapter disabled if first chapter (index 0)
            document.getElementById('prevChapter').disabled = currentChapterIndex === 0;
            // nextChapter disabled if last chapter
            document.getElementById('nextChapter').disabled = currentChapterIndex === chapters.length - 1;
            
            // Also store URLs from page parsing as fallback
            prevChapterUrl = prevUrl;
            nextChapterUrl = nextUrl;
            document.getElementById('readerNav').style.display = 'flex';
            
            // Scroll to top
            document.getElementById('readerArea').scrollTop = 0;
            
            // Hide sidebar on mobile
            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('show-mobile');
            }
            
            // Update chapter count
            document.getElementById('chapterCount').textContent = chapters.length;
        })
        .catch(function(error) {
            console.error('Failed to load chapter:', error);
            showToast('Failed to load chapter content. Please try again.', 'error');
        })
        .finally(function() {
            showLoading(false);
        });
}

// Parse novel data from Royal Road
function parseRoyalRoad(initlink) {
    originUrl = 'https://www.royalroad.com';
    
    fetchWithProxy(initlink)
        .then(function(data) {
            var html = parseHTML(data);
            
            // Try multiple selectors for title
            var title = html.querySelector('h1.font-white');
            if (title) title = title.textContent.trim();
            if (!title) {
                title = html.querySelector('.fic-title h1');
                if (title) title = title.textContent.trim();
            }
            if (!title) {
                title = html.querySelector('h1');
                if (title) title = title.textContent.trim();
            }
            
            // Try multiple selectors for author
            var author = html.querySelector('.fic-title a.font-white');
            if (author) author = author.textContent.trim();
            if (!author) {
                author = html.querySelector('.author a');
                if (author) author = author.textContent.trim();
            }
            if (!author) {
                author = html.querySelector('[property="author"]');
                if (author) author = author.textContent.trim();
            }
            
            // Try multiple selectors for description
            var info = html.querySelector('.hidden-content');
            if (info) info = info.textContent.trim();
            if (!info) {
                info = html.querySelector('.description');
                if (info) info = info.textContent.trim();
            }
            if (!info) {
                info = html.querySelector('[property="description"]');
                if (info) info = info.textContent.trim();
            }
            
            currentNovelTitle = title;
            novelInfo = 'Author: ' + author + '\n\n' + info;
            
            document.getElementById('novelTitle').textContent = title || 'Unknown Title';
            document.getElementById('infoTitle').textContent = title || 'Unknown Title';
            document.getElementById('infoContent').textContent = novelInfo || 'No description available.';
            document.title = (title || 'Novel') + ' - Novel Reader';
            
            // Parse chapter list - try multiple selectors
            var chapterData = [];
            
            // Method 1: Standard chapter table
            var chapterRows = html.querySelectorAll('#chapters tbody tr');
            
            if (chapterRows.length > 0) {
                chapterRows.forEach(function(row) {
                    var link = row.querySelector('a');
                    if (link) {
                        var chapterUrl = link.getAttribute('href');
                        var chapterName = link.textContent.trim();
                        
                        if (chapterUrl && chapterName) {
                            if (chapterUrl.indexOf('http') === -1) {
                                chapterUrl = originUrl + chapterUrl;
                            }
                            chapterData.push({
                                name: chapterName,
                                url: chapterUrl
                            });
                        }
                    }
                });
            }
            
            // Method 2: Chapter links in various containers
            if (chapterData.length === 0) {
                var chapterLinks = html.querySelectorAll('a[href*="/chapter/"]');
                chapterLinks.forEach(function(link) {
                    var chapterUrl = link.getAttribute('href');
                    var chapterName = link.textContent.trim();
                    
                    if (chapterUrl && chapterName && chapterName.length > 0) {
                        if (chapterUrl.indexOf('http') === -1) {
                            chapterUrl = originUrl + chapterUrl;
                        }
                        chapterData.push({
                            name: chapterName,
                            url: chapterUrl
                        });
                    }
                });
            }
            
            // Method 3: Fiction chapters list
            if (chapterData.length === 0) {
                var fictionChapters = html.querySelectorAll('.chapter-row, .fiction-chapter');
                fictionChapters.forEach(function(row) {
                    var link = row.querySelector('a');
                    if (link) {
                        var chapterUrl = link.getAttribute('href');
                        var chapterName = link.textContent.trim();
                        
                        if (chapterUrl && chapterName) {
                            if (chapterUrl.indexOf('http') === -1) {
                                chapterUrl = originUrl + chapterUrl;
                            }
                            chapterData.push({
                                name: chapterName,
                                url: chapterUrl
                            });
                        }
                    }
                });
            }
            
            if (chapterData.length === 0) {
                showToast('No chapters found. The page structure may have changed.', 'warning');
                showLoading(false);
                return;
            }
            
            renderChapters(chapterData);
            
            // Auto load first chapter
            if (chapterData[0]) {
                var firstItem = document.querySelector('.chapter-item');
                if (firstItem) firstItem.classList.add('active');
                currentChapterIndex = 0;
                loadChapter(chapterData[0].url, chapterData[0].name);
            }
        })
        .catch(function(error) {
            console.error('Failed to load novel:', error);
            showToast('Failed to load novel. Please try again.', 'error');
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
    var initlink = decodeURIComponent(window.location.href).split('web=')[1];
    
    console.log('Init link:', initlink);
    
    if (initlink) {
        showLoading(true);
        
        if (initlink.indexOf('https://www.royalroad.com/') > -1) {
            parseRoyalRoad(initlink);
        } else {
            showToast('Unsupported novel source. Only Royal Road is supported.', 'error');
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
