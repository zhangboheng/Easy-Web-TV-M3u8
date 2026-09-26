// Music Page JS - Modern UI Version
// Native JavaScript (No jQuery)

// CORS proxy + failover now live in ../js/apiproxy.js (fetchWithProxy / fetchMusicJSON)

var artists = [];
var pageNum = 1;
var currentFilter = { type: 'all', value: '-1' };
var searchQuery = '';
var isLoading = false;
var hasMore = true;
var isSearchMode = false;

// Player state
var currentPlaylist = [];
var currentSongIndex = -1;
var audioPlayer = null;
var isPlaying = false;

// Podcast state
var podcastSubscriptions = [];
var PODCAST_STORAGE_KEY = 'podcast_subscriptions';

// Helper functions
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

document.addEventListener('DOMContentLoaded', function () {
    // Initialize audio player
    audioPlayer = document.getElementById('audioPlayer');
    
    // Back button
    $('#backBtn').addEventListener('click', function () {
        window.history.back();
    });
    
    // Tab switching
    $$('.tab-btn').forEach(function(btn) {
        btn.addEventListener('click', function () {
            var tabId = this.dataset.tab;
            
            // Update tab buttons
            $$('.tab-btn').forEach(function(el) { el.classList.remove('active'); });
            this.classList.add('active');
            
            // Update tab content
            $$('.tab-content').forEach(function(el) { el.classList.remove('active'); });
            $('#' + tabId).classList.add('active');
            
            // Show/hide search box based on tab
            if (tabId === 'podcast') {
                $('#musicSearchBox').style.display = 'none';
                $('#podcastSearchBox').style.display = '';
            } else {
                $('#musicSearchBox').style.display = '';
                $('#podcastSearchBox').style.display = 'none';
            }
            
            // Load music data on first switch if needed
            if (tabId === 'music' && artists.length === 0 && !isLoading) {
                loadArtists();
            }
            
            // Update content margin after tab switch
            setTimeout(updateContentMargin, 50);
        });
    });
    
    // ============ PODCAST EVENT HANDLERS ============
    
    // OPML import button (file picker - works on desktop/mobile)
    $('#importOpmlBtn').addEventListener('click', function () {
        $('#opmlFileInput').click();
    });
    
    // Paste OPML button - opens modal with paste tab
    $('#pasteOpmlBtn').addEventListener('click', function () {
        showOpmlImportModal('paste');
    });
    
    // OPML Import Modal - tab switching
    $$('.opml-import-tab').forEach(function(tab) {
        tab.addEventListener('click', function () {
            var tabId = this.dataset.opmlTab;
            $$('.opml-import-tab').forEach(function(el) { el.classList.remove('active'); });
            this.classList.add('active');
            $$('.opml-import-panel').forEach(function(el) { el.classList.remove('active'); });
            if (tabId === 'paste') {
                $('#opmlPanelPaste').classList.add('active');
            } else {
                $('#opmlPanelUrl').classList.add('active');
            }
        });
    });
    
    // OPML Import Modal - close
    $('#opmlImportClose').addEventListener('click', function () {
        hideOpmlImportModal();
    });
    
    // OPML Import Modal - click outside to close
    $('#opmlImportOverlay').addEventListener('click', function (e) {
        if (e.target === this) {
            hideOpmlImportModal();
        }
    });
    
    // OPML Paste submit
    $('#opmlPasteSubmit').addEventListener('click', function () {
        var content = $('#opmlTextarea').value.trim();
        if (!content) {
            showToast('Please paste OPML content first.', 'warning');
            return;
        }
        parseOpml(content);
        hideOpmlImportModal();
        $('#opmlTextarea').value = '';
    });
    
    // OPML URL submit
    $('#opmlUrlSubmit').addEventListener('click', function () {
        var url = $('#opmlUrlInput').value.trim();
        if (!url) {
            showToast('Please enter an OPML URL first.', 'warning');
            return;
        }
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        fetchOpmlFromUrl(url);
    });
    
    // OPML URL input enter key
    $('#opmlUrlInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter' || e.which === 13) {
            $('#opmlUrlSubmit').click();
        }
    });
    
    // OPML file selected
    $('#opmlFileInput').addEventListener('change', function (e) {
        var file = e.target.files[0];
        if (!file) return;
        
        var reader = new FileReader();
        reader.onload = function (event) {
            var content = event.target.result;
            parseOpml(content);
            // Reset file input
            $('#opmlFileInput').value = '';
        };
        reader.readAsText(file);
    });
    
    // Add RSS feed
    $('#addRssBtn').addEventListener('click', function () {
        addRssFeed();
    });
    
    $('#rssUrlInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter' || e.which === 13) {
            addRssFeed();
        }
    });
    
    // Export OPML
    $('#exportOpmlBtn').addEventListener('click', function () {
        exportOpml();
    });
    
    // Clear all podcasts
    $('#clearPodcastsBtn').addEventListener('click', function () {
        showConfirm('Are you sure you want to remove all podcast subscriptions?', function () {
            podcastSubscriptions = [];
            savePodcastSubscriptions();
            renderPodcastList();
            showToast('All podcast subscriptions have been removed.', 'success');
        }, true);
    });
    
    // Confirm modal buttons
    $('#confirmOk').addEventListener('click', function () {
        if (confirmCallback) {
            confirmCallback();
        }
        hideConfirm();
    });
    
    $('#confirmCancel').addEventListener('click', function () {
        hideConfirm();
    });
    
    // Remove individual podcast (delegated)
    $('#podcastGrid').addEventListener('click', function (e) {
        if (e.target.closest('.podcast-remove')) {
            e.stopPropagation();
            e.preventDefault();
            var feedUrl = e.target.closest('.podcast-remove').dataset.feed;
            podcastSubscriptions = podcastSubscriptions.filter(function (p) {
                return p.feedUrl !== feedUrl;
            });
            savePodcastSubscriptions();
            renderPodcastList();
        }
    });
    
    // ============ MUSIC EVENT HANDLERS ============
    
    // Menu button - toggle sidebar (if exists)
    var menuBtn = $('#menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function () {
            toggleSidebar();
        });
    }
    
    // Toggle sidebar button
    $('#toggleSidebar').addEventListener('click', function () {
        toggleSidebar();
    });
    
    function toggleSidebar() {
        if (window.innerWidth <= 768) {
            $('#sidebar').classList.toggle('show-mobile');
        } else {
            $('#sidebar').classList.toggle('collapsed');
            $('#mainContent').classList.toggle('expanded');
        }
    }
    
    // Category selection
    $('#categoryList').addEventListener('click', function (e) {
        var item = e.target.closest('.category-item');
        if (!item || isLoading) return;
        
        $$('.category-item').forEach(function(el) { el.classList.remove('active'); });
        item.classList.add('active');
        
        currentFilter = {
            type: item.dataset.type,
            value: item.dataset.value
        };
        
        // Reset pagination
        pageNum = 1;
        hasMore = true;
        artists = [];
        
        // Load artists with new filter
        loadArtists();
    });
    
    // Search functionality
    $('#searchInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter' || e.which === 13) {
            performSearch();
        }
    });
    
    $('#searchBtn').addEventListener('click', function () {
        performSearch();
    });
    
    // Infinite scroll - listen on main content area scroll
    $('#mainContent').addEventListener('scroll', function () {
        var scrollTop = this.scrollTop;
        var scrollHeight = this.scrollHeight;
        var clientHeight = this.clientHeight;
        
        // Trigger when user scrolls near bottom (100px before end)
        if (scrollTop + clientHeight >= scrollHeight - 100) {
            if (!isLoading && hasMore && !isSearchMode) {
                loadMoreArtists();
            }
        }
    });
    
    // Player controls
    initPlayerControls();
    
    // Podcast search functionality
    $('#podcastSearchInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter' || e.which === 13) {
            performPodcastSearch();
        }
    });
    
    $('#podcastSearchBtn').addEventListener('click', function () {
        performPodcastSearch();
    });
    
    // ============ INITIAL LOAD ============
    
    // Load podcast subscriptions from localStorage
    loadPodcastSubscriptions();
    renderPodcastList();
    
    // Show podcast search box, hide music search box (default tab is podcast)
    $('#podcastSearchBox').style.display = '';
    $('#musicSearchBox').style.display = 'none';
    
    // Dynamic margin-top for tab-content-wrapper based on header height
    function updateContentMargin() {
        var headerHeight = $('.top-header').offsetHeight;
        $('.tab-content-wrapper').style.marginTop = headerHeight + 'px';
    }
    
    // Update on load and resize
    updateContentMargin();
    window.addEventListener('resize', updateContentMargin);
});

// ============ TOAST & CONFIRM FUNCTIONS ============

var toastIcons = {
    success: 'fa-check-circle',
    error: 'fa-times-circle',
    warning: 'fa-exclamation-circle',
    info: 'fa-info-circle'
};

var toastTitles = {
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info'
};

function showToast(message, type, duration) {
    type = type || 'info';
    duration = duration || 3000;
    
    var iconClass = toastIcons[type] || toastIcons.info;
    var titleText = toastTitles[type] || toastTitles.info;
    
    var toastHtml = '<div class="toast ' + type + '">';
    toastHtml += '  <div class="toast-icon"><i class="fas ' + iconClass + '"></i></div>';
    toastHtml += '  <div class="toast-body">';
    toastHtml += '    <div class="toast-title">' + titleText + '</div>';
    toastHtml += '    <div class="toast-text">' + escapeHtml(message) + '</div>';
    toastHtml += '  </div>';
    toastHtml += '  <button class="toast-close" onclick="dismissToast(this)"><i class="fas fa-times"></i></button>';
    toastHtml += '</div>';
    
    var toastEl = document.createElement('div');
    toastEl.innerHTML = toastHtml;
    var toast = toastEl.firstElementChild;
    $('#toastContainer').appendChild(toast);
    
    // Auto dismiss
    setTimeout(function () {
        dismissToast(toast.querySelector('.toast-close'));
    }, duration);
}

function dismissToast(closeBtn) {
    var toast = closeBtn.closest('.toast');
    if (toast.classList.contains('toast-exit')) return;
    toast.classList.add('toast-exit');
    setTimeout(function () {
        toast.remove();
    }, 300);
}

var confirmCallback = null;

function showConfirm(message, onConfirm, isDanger) {
    isDanger = isDanger || false;
    confirmCallback = onConfirm;
    
    $('#confirmMessage').textContent = message;
    
    if (isDanger) {
        $('#confirmIcon').classList.add('danger');
        $('#confirmOk').classList.add('danger');
        $('#confirmIcon i').classList.remove('fa-exclamation-triangle');
        $('#confirmIcon i').classList.add('fa-trash-alt');
    } else {
        $('#confirmIcon').classList.remove('danger');
        $('#confirmOk').classList.remove('danger');
        $('#confirmIcon i').classList.remove('fa-trash-alt');
        $('#confirmIcon i').classList.add('fa-exclamation-triangle');
    }
    
    $('#confirmOverlay').classList.add('show');
}

function hideConfirm() {
    $('#confirmOverlay').classList.remove('show');
    confirmCallback = null;
}

// ============ PODCAST FUNCTIONS ============

function loadPodcastSubscriptions() {
    try {
        var stored = localStorage.getItem(PODCAST_STORAGE_KEY);
        if (stored) {
            podcastSubscriptions = JSON.parse(stored);
        } else {
        }
    } catch (e) {
        podcastSubscriptions = [];
    }
}

function savePodcastSubscriptions() {
    try {
        localStorage.setItem(PODCAST_STORAGE_KEY, JSON.stringify(podcastSubscriptions));
    } catch (e) {
        console.error('Failed to save podcast subscriptions:', e);
    }
}

function parseOpml(xmlContent) {
    try {
        var parser = new DOMParser();
        var doc = parser.parseFromString(xmlContent, 'text/xml');
        var outlines = doc.querySelectorAll('outline[type="rss"], outline[type="link"]');
        
        var newPodcasts = [];
        outlines.forEach(function (outline) {
            var text = outline.getAttribute('text') || outline.getAttribute('title') || '';
            var xmlUrl = outline.getAttribute('xmlUrl') || outline.getAttribute('url') || '';
            var category = outline.parentElement && outline.parentElement.getAttribute('text') 
                ? outline.parentElement.getAttribute('text') : '';
            
            if (xmlUrl) {
                // Check if already subscribed
                var exists = podcastSubscriptions.some(function (p) { return p.feedUrl === xmlUrl; });
                if (!exists) {
                    newPodcasts.push({
                        name: text,
                        feedUrl: xmlUrl,
                        category: category,
                        imageUrl: ''
                    });
                }
            }
        });
        
        if (newPodcasts.length > 0) {
            podcastSubscriptions = podcastSubscriptions.concat(newPodcasts);
            savePodcastSubscriptions();
            renderPodcastList();
            
            // Fetch podcast details (cover images) in background
            newPodcasts.forEach(function (podcast) {
                fetchPodcastInfo(podcast);
            });
        }
        
        if (newPodcasts.length === 0 && outlines.length > 0) {
            showToast('All podcasts from this OPML are already in your subscriptions.', 'warning');
        } else if (outlines.length === 0) {
            showToast('No RSS feeds found in this OPML file.', 'warning');
        } else {
            showToast('Successfully imported ' + newPodcasts.length + ' podcast(s).', 'success');
        }
    } catch (e) {
        console.error('Failed to parse OPML:', e);
        showToast('Failed to parse OPML file. Please check the file format.', 'error');
    }
}

function addRssFeed() {
    var url = $('#rssUrlInput').value.trim();
    if (!url) {
        showToast('Please enter a valid RSS feed URL.', 'warning');
        return;
    }
    
    // Auto-prepend https:// if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }
    
    // Validate URL format using URL constructor
    try {
        var urlObj = new URL(url);
        // Must have a valid hostname with at least one dot (not just a single word)
        if (!urlObj.hostname || urlObj.hostname.indexOf('.') === -1) {
            showToast('Invalid URL format. Please enter a complete URL (e.g., https://example.com/feed.xml)', 'error');
            return;
        }
        // Must use http or https protocol
        if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
            showToast('URL must use http:// or https:// protocol.', 'error');
            return;
        }
    } catch (e) {
        showToast('Invalid URL format. Please enter a valid URL.', 'error');
        return;
    }
    
    // Check if already subscribed
    var exists = podcastSubscriptions.some(function (p) { return p.feedUrl === url; });
    if (exists) {
        showToast('This podcast is already in your subscriptions.', 'warning');
        return;
    }
    
    var podcast = {
        name: 'Loading...', // Will be updated after fetching
        feedUrl: url,
        category: '',
        imageUrl: ''
    };
    
    podcastSubscriptions.push(podcast);
    savePodcastSubscriptions();
    renderPodcastList();
    $('#rssUrlInput').value = '';
    
    showToast('Adding podcast... Fetching details from RSS feed.', 'info');
    
    // Fetch podcast details
    fetchPodcastInfo(podcast);
}

function extractPodcastImage(channel, xmlText) {
    var imageUrl = '';
    
    // Method 1: Find <image> child element and extract <url> text
    var imageEl = channel.querySelector('image');
    if (imageEl) {
        var urlEl = imageEl.querySelector('url');
        if (urlEl) {
            imageUrl = urlEl.textContent;
        }
    }
    
    // Method 2: itunes:image href attribute
    if (!imageUrl) {
        var itunesImage = channel.querySelector('itunes:image');
        if (itunesImage) {
            imageUrl = itunesImage.getAttribute('href') || '';
        }
    }
    
    // Method 3: Check all children for itunes:image (namespaced)
    if (!imageUrl) {
        channel.children.forEach(function (child) {
            if (child.tagName && child.tagName.toLowerCase().indexOf('itunes:image') !== -1) {
                imageUrl = child.getAttribute('href') || '';
            }
        });
    }
    
    // Method 4: Regex fallback - extract from raw XML text
    if (!imageUrl && xmlText) {
        // Try <url>...</url> inside <image> block
        var urlMatch = xmlText.match(/<image[^>]*>[\s\S]*?<url>\s*(.*?)\s*<\/url>/i);
        if (urlMatch && urlMatch[1]) {
            imageUrl = urlMatch[1];
        }
        // Try itunes:image href
        if (!imageUrl) {
            var itunesMatch = xmlText.match(/<itunes:image\s+href=["']([^"']+)["']/i);
            if (itunesMatch && itunesMatch[1]) {
                imageUrl = itunesMatch[1];
            }
        }
    }
    
    return imageUrl;
}

function fetchPodcastInfo(podcast) {
    var apiUrl = podcast.feedUrl;
    
    fetchWithProxy(apiUrl)
        .then(function(xmlText) {
            try {
                var parser = new DOMParser();
                var doc = parser.parseFromString(xmlText, 'text/xml');
                var channel = doc.querySelector('channel');
                var title = channel.querySelector('title').textContent || podcast.name;
                var image = extractPodcastImage(channel, xmlText);

                // Update the podcast info
                var idx = podcastSubscriptions.findIndex(function (p) { return p.feedUrl === podcast.feedUrl; });
                if (idx !== -1) {
                    podcastSubscriptions[idx].name = title;
                    podcastSubscriptions[idx].imageUrl = image;
                    savePodcastSubscriptions();
                    renderPodcastList();
                }
            } catch (e) {
                console.error('Failed to parse podcast info:', e);
            }
        })
        .catch(function() {
            // Failed to fetch - update name to show it's unavailable
            var idx = podcastSubscriptions.findIndex(function (p) { return p.feedUrl === podcast.feedUrl; });
            if (idx !== -1 && podcastSubscriptions[idx].name === 'Loading...') {
                // Extract domain name as fallback display
                try {
                    var urlObj = new URL(podcast.feedUrl);
                    podcastSubscriptions[idx].name = urlObj.hostname;
                } catch (e) {
                    podcastSubscriptions[idx].name = 'Unknown Podcast';
                }
                savePodcastSubscriptions();
                renderPodcastList();
                showToast('Could not fetch podcast details for: ' + podcastSubscriptions[idx].name + '. The RSS feed may be unavailable.', 'error', 5000);
            }
            console.error('Failed to fetch podcast info for:', podcast.feedUrl);
        });
}

function renderPodcastList() {
    if (podcastSubscriptions.length === 0) {
        $('#podcastEmpty').style.display = '';
        $('#podcastGrid').style.display = 'none';
        $('#podcastActions').style.display = 'none';
        return;
    }
    
    $('#podcastEmpty').style.display = 'none';
    $('#podcastGrid').style.display = '';
    $('#podcastActions').style.display = '';
    
    var html = '';
    podcastSubscriptions.forEach(function (podcast) {
        var imgSrc = podcast.imageUrl || '../images/noimage.jpeg';
        var isLoading = podcast.name === 'Loading...';
        html += '<a href="../catalogues/podcastplay.html?feed=' + encodeURIComponent(podcast.feedUrl) + '" class="card-item' + (isLoading ? ' loading' : '') + '">';
        html += '  <img class="card-image" src="' + imgSrc + '" alt="' + escapeHtml(podcast.name) + '" onerror="this.src=\'../images/noimage.jpeg\'">';
        html += '  <div class="card-overlay"></div>';
        html += '  <div class="card-play-icon"><i class="fas fa-play"></i></div>';
        html += '  <div class="card-info">';
        if (podcast.category) {
            html += '    <div class="card-type">' + escapeHtml(podcast.category) + '</div>';
        }
        html += '    <div class="card-title">' + (isLoading ? '<i class="fas fa-spinner fa-spin" style="margin-right:6px;color:#a3001b;"></i>' : '') + escapeHtml(podcast.name) + '</div>';
        html += '  </div>';
        html += '  <div class="podcast-remove" data-feed="' + escapeHtml(podcast.feedUrl) + '"><i class="fas fa-times"></i></div>';
        html += '</a>';
    });
    
    $('#podcastGrid').innerHTML = html;
}

function performPodcastSearch() {
    var query = $('#podcastSearchInput').value.trim().toLowerCase();
    
    if (!query) {
        // If search is empty, show all podcasts
        renderPodcastList();
        return;
    }
    
    // Filter podcasts by name
    var filtered = podcastSubscriptions.filter(function (p) {
        return p.name.toLowerCase().indexOf(query) !== -1;
    });
    
    if (filtered.length === 0) {
        $('#podcastGrid').innerHTML = '<div class="podcast-empty"><i class="fas fa-search"></i><h3>No Results</h3><p>No podcasts matching "' + escapeHtml(query) + '"</p></div>';
        $('#podcastGrid').style.display = '';
        $('#podcastEmpty').style.display = 'none';
        return;
    }
    
    // Render filtered list
    var html = '';
    filtered.forEach(function (podcast) {
        var imgSrc = podcast.imageUrl || '../images/noimage.jpeg';
        var isLoading = podcast.name === 'Loading...';
        html += '<a href="../catalogues/podcastplay.html?feed=' + encodeURIComponent(podcast.feedUrl) + '" class="card-item' + (isLoading ? ' loading' : '') + '">';
        html += '  <img class="card-image" src="' + imgSrc + '" alt="' + escapeHtml(podcast.name) + '" onerror="this.src=\'../images/noimage.jpeg\'">';
        html += '  <div class="card-overlay"></div>';
        html += '  <div class="card-play-icon"><i class="fas fa-play"></i></div>';
        html += '  <div class="card-info">';
        if (podcast.category) {
            html += '    <div class="card-type">' + escapeHtml(podcast.category) + '</div>';
        }
        html += '    <div class="card-title">' + (isLoading ? '<i class="fas fa-spinner fa-spin" style="margin-right:6px;color:#a3001b;"></i>' : '') + escapeHtml(podcast.name) + '</div>';
        html += '  </div>';
        html += '  <div class="podcast-remove" data-feed="' + escapeHtml(podcast.feedUrl) + '"><i class="fas fa-times"></i></div>';
        html += '</a>';
    });
    
    $('#podcastGrid').innerHTML = html;
}

function exportOpml() {
    if (podcastSubscriptions.length === 0) {
        showToast('No podcasts to export.', 'warning');
        return;
    }
    
    var xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<opml version="1.0">\n';
    xml += '  <head>\n';
    xml += '    <title>Podcast Subscriptions</title>\n';
    xml += '  </head>\n';
    xml += '  <body>\n';
    
    // Group by category
    var categories = {};
    podcastSubscriptions.forEach(function (podcast) {
        var cat = podcast.category || 'Uncategorized';
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(podcast);
    });
    
    Object.keys(categories).forEach(function (cat) {
        xml += '    <outline text="' + escapeXml(cat) + '">\n';
        categories[cat].forEach(function (podcast) {
            xml += '      <outline type="rss" text="' + escapeXml(podcast.name) + '" xmlUrl="' + escapeXml(podcast.feedUrl) + '" />\n';
        });
        xml += '    </outline>\n';
    });
    
    xml += '  </body>\n';
    xml += '</opml>';
    
    var blob = new Blob([xml], { type: 'text/xml' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'podcast-subscriptions.opml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

function escapeXml(text) {
    if (!text) return '';
    var result = text.replace(/&/g, '\x26amp;');
    result = result.replace(/</g, '\x26lt;');
    result = result.replace(/>/g, '\x26gt;');
    result = result.replace(/"/g, '\x26quot;');
    result = result.replace(/'/g, '\x26apos;');
    return result;
}

// ============ OPML IMPORT MODAL FUNCTIONS ============

function showOpmlImportModal(tab) {
    tab = tab || 'paste';
    
    // Reset state
    $('#opmlTextarea').value = '';
    $('#opmlUrlInput').value = '';
    
    // Set active tab
    $$('.opml-import-tab').forEach(function(el) { el.classList.remove('active'); });
    $$('.opml-import-panel').forEach(function(el) { el.classList.remove('active'); });
    
    if (tab === 'url') {
        $('#opmlTabUrl').classList.add('active');
        $('#opmlPanelUrl').classList.add('active');
    } else {
        $('#opmlTabPaste').classList.add('active');
        $('#opmlPanelPaste').classList.add('active');
    }
    
    // Show modal
    $('#opmlImportOverlay').classList.add('show');
}

function hideOpmlImportModal() {
    $('#opmlImportOverlay').classList.remove('show');
}

function fetchOpmlFromUrl(url) {
    var btn = $('#opmlUrlSubmit');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching...';
    
    fetchWithProxy(url)
        .then(function(data) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-download"></i> Import from URL';

            if (data && data.trim()) {
                parseOpml(data);
                hideOpmlImportModal();
                $('#opmlUrlInput').value = '';
            } else {
                showToast('The fetched OPML content is empty.', 'warning');
            }
        })
        .catch(function() {
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-download"></i> Import from URL';
            showToast('Failed to fetch OPML from URL. Please check the URL or try pasting the content directly.', 'error');
        });
}

// ============ MUSIC FUNCTIONS ============

function initPlayerControls() {
    // Play/Pause button
    $('#playPauseBtn').addEventListener('click', function () {
        if (isPlaying) {
            audioPlayer.pause();
            isPlaying = false;
            $('#playIcon').classList.remove('fa-pause');
            $('#playIcon').classList.add('fa-play');
        } else {
            audioPlayer.play();
            isPlaying = true;
            $('#playIcon').classList.remove('fa-play');
            $('#playIcon').classList.add('fa-pause');
        }
    });
    
    // Previous button
    $('#prevBtn').addEventListener('click', function () {
        if (currentSongIndex > 0) {
            playSong(currentSongIndex - 1);
        }
    });
    
    // Next button
    $('#nextBtn').addEventListener('click', function () {
        if (currentSongIndex < currentPlaylist.length - 1) {
            playSong(currentSongIndex + 1);
        }
    });
    
    // Close player button
    $('#closePlayerBtn').addEventListener('click', function () {
        audioPlayer.pause();
        isPlaying = false;
        $('#bottomPlayer').classList.remove('show');
        $('#mainContent').classList.remove('with-player');
        $('#playIcon').classList.remove('fa-pause');
        $('#playIcon').classList.add('fa-play');
    });
    
    // Progress bar click
    $('#progressBar').addEventListener('click', function (e) {
        var width = this.offsetWidth;
        var clickX = e.offsetX;
        var percentage = clickX / width;
        audioPlayer.currentTime = audioPlayer.duration * percentage;
    });
    
    // Volume slider click
    $('#volumeSlider').addEventListener('click', function (e) {
        var width = this.offsetWidth;
        var clickX = e.offsetX;
        var percentage = clickX / width;
        audioPlayer.volume = percentage;
        $('#volumeBar').style.width = percentage * 100 + '%';
        updateVolumeIcon(percentage);
    });
    
    // Volume icon click (mute/unmute)
    $('#volumeIcon').addEventListener('click', function () {
        if (audioPlayer.volume > 0) {
            audioPlayer.volume = 0;
            $('#volumeBar').style.width = '0%';
            updateVolumeIcon(0);
        } else {
            audioPlayer.volume = 0.7;
            $('#volumeBar').style.width = '70%';
            updateVolumeIcon(0.7);
        }
    });
    
    // Audio player events
    audioPlayer.addEventListener('timeupdate', function () {
        var currentTime = audioPlayer.currentTime;
        var duration = audioPlayer.duration;
        
        if (duration) {
            var percentage = (currentTime / duration) * 100;
            $('#progressFill').style.width = percentage + '%';
            $('#currentTime').textContent = formatTime(currentTime);
            $('#totalTime').textContent = formatTime(duration);
        }
    });
    
    audioPlayer.addEventListener('ended', function () {
        if (currentSongIndex < currentPlaylist.length - 1) {
            playSong(currentSongIndex + 1);
        } else {
            isPlaying = false;
            $('#playIcon').classList.remove('fa-pause');
            $('#playIcon').classList.add('fa-play');
        }
    });
    
    audioPlayer.addEventListener('play', function () {
        isPlaying = true;
        $('#playIcon').classList.remove('fa-play');
        $('#playIcon').classList.add('fa-pause');
    });
    
    audioPlayer.addEventListener('pause', function () {
        isPlaying = false;
        $('#playIcon').classList.remove('fa-pause');
        $('#playIcon').classList.add('fa-play');
    });
}

function updateVolumeIcon(volume) {
    var icon = $('#volumeIcon');
    icon.classList.remove('fa-volume-up', 'fa-volume-down', 'fa-volume-mute');
    
    if (volume === 0) {
        icon.classList.add('fa-volume-mute');
    } else if (volume < 0.5) {
        icon.classList.add('fa-volume-down');
    } else {
        icon.classList.add('fa-volume-up');
    }
}

function formatTime(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = Math.floor(seconds % 60);
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function playSong(index) {
    if (index < 0 || index >= currentPlaylist.length) return;
    
    currentSongIndex = index;
    var song = currentPlaylist[index];
    
    // Update player UI
    $('#playerSongName').textContent = song.name || 'Unknown';
    $('#playerArtistName').textContent = song.artistName || 'Unknown';
    var coverImg = $('#playerCover');
    coverImg.src = song.cover || '../images/noimage.jpeg';
    coverImg.onerror = function () { this.src = '../images/noimage.jpeg'; };
    
    // Show player
    $('#bottomPlayer').classList.add('show');
    $('#mainContent').classList.add('with-player');
    
    // Get song URL and play
    getSongUrl(song.id, function (url) {
        if (url) {
            audioPlayer.src = url;
            audioPlayer.play();
        } else {
            showError('Unable to get song URL');
        }
    });
}

function getSongUrl(songId, callback) {
    var apiUrl = '/song/url?id=' + songId;
    
    fetchMusicJSON(apiUrl, function (data) {
        console.log('Song URL response:', data);
        var url = (data.data && data.data[0] && data.data[0].url) ? data.data[0].url : null;
        callback(url);
    }, function () {
        callback(null);
    });
}

function loadArtists() {
    if (isLoading) return;
    isLoading = true;
    
    showLoading();
    
    var apiUrl = buildApiUrl();
    console.log('Loading artists, API URL:', apiUrl);
    
    fetchMusicJSON(apiUrl, function (data) {
        console.log('Load artists response:', data);
        hideLoading();
        isLoading = false;
        
        if (data.artists && data.artists.length > 0) {
            artists = data.artists;
            renderArtists(artists);
        } else {
            showNoResults();
        }
    }, function () {
        hideLoading();
        isLoading = false;
        showError('Failed to load artists');
    });
}

function loadMoreArtists() {
    if (isLoading || !hasMore) return;
    isLoading = true;
    
    $('#loadMore').style.display = '';
    pageNum++;
    
    var apiUrl = buildApiUrl();
    console.log('Loading more artists, page:', pageNum, 'API URL:', apiUrl);
    
    fetchMusicJSON(apiUrl, function (data) {
        console.log('Load more response:', data);
        $('#loadMore').style.display = 'none';
        isLoading = false;
        
        if (data.artists && data.artists.length > 0) {
            // Filter out duplicates
            var existingIds = artists.map(function(a) { return a.id; });
            var newArtists = data.artists.filter(function(a) {
                return existingIds.indexOf(a.id) === -1;
            });
            
            if (newArtists.length > 0) {
                artists = artists.concat(newArtists);
                appendArtists(newArtists);
            }
            
            // If we got less than expected, might be end of data
            if (data.artists.length < 50) {
                hasMore = false;
            }
        } else {
            hasMore = false;
        }
    }, function () {
        $('#loadMore').style.display = 'none';
        isLoading = false;
        pageNum--;
    });
}

function buildApiUrl() {
    var baseUrl = '/artist/list';
    var params = [];
    
    if (currentFilter.type === 'area') {
        params.push('area=' + currentFilter.value);
        params.push('type=-1');
    } else if (currentFilter.type === 'type') {
        params.push('type=' + currentFilter.value);
        params.push('area=-1');
    } else {
        params.push('type=-1');
        params.push('area=-1');
    }
    
    params.push('limit=50');
    params.push('offset=' + (50 * (pageNum - 1)));
    
    return baseUrl + '?' + params.join('&');
}

function renderArtists(artistList) {
    var html = '';
    
    artistList.forEach(function (artist) {
        var alias = artist.alias && artist.alias.length > 0 ? artist.alias[0] : '';
        html += '<a href="../catalogues/musicplay.html?web=' + artist.id + '" class="artist-card">';
        html += '  <img class="artist-image" src="' + (artist.picUrl || '../images/noimage.jpeg') + '" alt="' + artist.name + '" onerror="this.src=\'../images/noimage.jpeg\'">';
        html += '  <div class="artist-info">';
        html += '    <div class="artist-name">' + artist.name + '</div>';
        if (alias) {
            html += '    <div class="artist-alias">' + alias + '</div>';
        }
        html += '  </div>';
        html += '</a>';
    });
    
    $('#artistGrid').innerHTML = html;
}

function appendArtists(artistList) {
    var html = '';
    
    artistList.forEach(function (artist) {
        var alias = artist.alias && artist.alias.length > 0 ? artist.alias[0] : '';
        html += '<a href="../catalogues/musicplay.html?web=' + artist.id + '" class="artist-card">';
        html += '  <img class="artist-image" src="' + (artist.picUrl || '../images/noimage.jpeg') + '" alt="' + artist.name + '" onerror="this.src=\'../images/noimage.jpeg\'">';
        html += '  <div class="artist-info">';
        html += '    <div class="artist-name">' + artist.name + '</div>';
        if (alias) {
            html += '    <div class="artist-alias">' + alias + '</div>';
        }
        html += '  </div>';
        html += '</a>';
    });
    
    $('#artistGrid').insertAdjacentHTML('beforeend', html);
}

function performSearch() {
    var query = $('#searchInput').value.trim();
    
    if (!query) {
        // If search is empty, reload with current filter
        isSearchMode = false;
        pageNum = 1;
        hasMore = true;
        artists = [];
        loadArtists();
        return;
    }
    
    searchQuery = query;
    isSearchMode = true;
    searchSongs(query);
}

function searchSongs(query) {
    showLoading();
    isLoading = true;
    
    // Disable load more in search mode
    hasMore = false;
    
    var apiUrl = '/search?keywords=' + encodeURIComponent(query) + '&limit=50';
    
    console.log('Search API URL:', apiUrl);
    
    fetchMusicJSON(apiUrl, function (data) {
        console.log('Search response:', data);
        hideLoading();
        isLoading = false;
        
        // Check multiple possible response structures
        var songs = null;
        if (data.result && data.result.songs) {
            songs = data.result.songs;
        } else if (data.data && data.data.songs) {
            songs = data.data.songs;
        } else if (data.songs) {
            songs = data.songs;
        }
        
        if (songs && songs.length > 0) {
            // Store songs as playlist
            currentPlaylist = songs.map(function (song) {
                // Get artist names from artists array
                var artistNames = '';
                if (song.artists && song.artists.length > 0) {
                    artistNames = song.artists.map(function(a) { return a.name; }).join(', ');
                } else if (song.ar && song.ar.length > 0) {
                    artistNames = song.ar.map(function(a) { return a.name; }).join(', ');
                }
                
                return {
                    id: song.id,
                    name: song.name,
                    artistName: artistNames,
                    cover: song.al && song.al.picUrl ? song.al.picUrl : '../images/noimage.jpeg'
                };
            });
            renderSearchResults(songs);
            
            // Show message that search results are limited
            if (songs.length === 50) {
                $('#artistGrid').insertAdjacentHTML('beforeend', '<div class="search-info" style="grid-column: 1 / -1; text-align: center; padding: 20px; color: rgba(255,255,255,0.5); font-size: 12px;"><i class="fas fa-info-circle"></i> Showing top 50 results. Use more specific keywords for better results.</div>');
            }
        } else {
            showNoResults();
        }
    }, function () {
        hideLoading();
        isLoading = false;
        showError('Search failed');
    });
}

function renderSearchResults(songs) {
    var html = '';
    
    songs.forEach(function (song, index) {
        var songName = song.name || '';
        // Get artist names from artists array
        var artistNames = '';
        if (song.artists && song.artists.length > 0) {
            artistNames = song.artists.map(function(a) { return a.name; }).join(', ');
        } else if (song.ar && song.ar.length > 0) {
            artistNames = song.ar.map(function(a) { return a.name; }).join(', ');
        }
        var albumPic = song.al && song.al.picUrl ? song.al.picUrl : '../images/noimage.jpeg';
        
        html += '<div class="artist-card song-card" data-index="' + index + '">';
        html += '  <img class="artist-image" src="' + albumPic + '" alt="' + songName + '" onerror="this.src=\'../images/noimage.jpeg\'">';
        html += '  <div class="play-overlay"><i class="fas fa-play-circle"></i></div>';
        html += '  <div class="artist-info">';
        html += '    <div class="artist-name">' + songName + '</div>';
        if (artistNames) {
            html += '    <div class="artist-alias">' + artistNames + '</div>';
        }
        html += '  </div>';
        html += '</div>';
    });
    
    $('#artistGrid').innerHTML = html;
    
    // Add click handler for song cards
    $$('.song-card').forEach(function(card) {
        card.addEventListener('click', function () {
            var index = parseInt(this.dataset.index);
            playSong(index);
        });
    });
}

function showLoading() {
    $('#loadingOverlay').classList.remove('hidden');
}

function hideLoading() {
    $('#loadingOverlay').classList.add('hidden');
}

function showNoResults() {
    $('#artistGrid').innerHTML = '<div class="no-results" style="grid-column: 1 / -1;"><i class="fas fa-music"></i><p>No artists found</p></div>';
}

function showError(message) {
    $('#artistGrid').innerHTML = '<div class="no-results" style="grid-column: 1 / -1;"><i class="fas fa-exclamation-circle"></i><p>' + message + '</p></div>';
}
