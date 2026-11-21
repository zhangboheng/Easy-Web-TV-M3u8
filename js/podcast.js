// Podcast Player JS
// Native JavaScript (No jQuery)

// CORS proxies from the unified ProxyConfig (Settings > Proxy Settings).
// Tried in order; failed attempts fall through to the next proxy.
//
// The pool is read on every request (getProxyPool) instead of once at load:
// a proxy the health cache just demoted, or one the user just added in
// Settings, must take effect without a page reload.
var PROXY_TIMEOUT_MS = 30000;

function getProxyPool() {
    return (typeof ProxyConfig !== 'undefined') ? ProxyConfig.getProxies() : [];
}

var feedUrl = '';
var podcastInfo = {};
var episodes = [];
var filteredEpisodes = [];
var currentEpisodeIndex = -1;
var audioEl = null;
var isPlaying = false;
var playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
var currentSpeedIndex = 2;
var FAV_PREFIX = 'fav_podcast_';

document.addEventListener('DOMContentLoaded', function () {
    audioEl = document.getElementById('podcastAudio');
    var params = new URLSearchParams(window.location.search);
    feedUrl = params.get('feed') || '';
    if (!feedUrl) { showError('No podcast feed URL provided.'); return; }
    
    // Back button
    document.getElementById('backBtn').addEventListener('click', function () { window.location.href = '../routes/music.html'; });
    
    // Toggle sidebar - toggle episode list and toolbar visibility
    function toggleSidebar() {
        var sidebar = document.getElementById('sidebar');
        var toolbar = document.getElementById('top-toolbar');
        
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
        } else {
            toolbar.classList.add('hidden');
        }
    }
    
    // Toggle Sidebar button
    document.getElementById('toggleSidebar').addEventListener('click', function () {
        toggleSidebar();
    });
    
    // Episode search
    document.getElementById('episodeSearch').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') { searchEpisodes(); }
    });
    document.getElementById('episodeSearch').addEventListener('input', function () {
        if (!this.value.trim()) { searchEpisodes(); }
    });
    
    // Cover play button
    document.getElementById('coverPlayBtn').addEventListener('click', function () {
        if (currentEpisodeIndex === -1 && episodes.length > 0) {
            playEpisode(0);
        } else if (currentEpisodeIndex !== -1) {
            if (isPlaying) { audioEl.pause(); } else { audioEl.play().catch(function(e){ console.error(e); }); }
        }
    });
    
    // Shuffle button
    document.getElementById('shuffleBtn').addEventListener('click', function () {
        if (episodes.length > 0) {
            var randomIndex = Math.floor(Math.random() * episodes.length);
            playEpisode(randomIndex);
        }
    });
    
    // Favorite Panel Toggle
    document.getElementById('favoriteBtn').addEventListener('click', function () {
        document.getElementById('favoritePanel').classList.toggle('show');
    });
    
    // Close panels when clicking outside
    document.addEventListener('click', function (e) {
        if (!e.target.closest('#favoritePanel') && !e.target.closest('#favoriteBtn')) {
            document.getElementById('favoritePanel').classList.remove('show');
        }
    });
    
    // GitHub button
    document.getElementById('githubBtn').addEventListener('click', function () {
        window.open('https://github.com/zhangboheng/Easy-Web-TV-M3u8', '_blank');
    });
    
    initPlayerControls();
    loadPodcastFeed();
    loadFavorites();
});

function loadPodcastFeed() {
    var overlay = document.getElementById('loadingOverlay');
    overlay.classList.remove('hidden');
    // Snapshot the pool once per request: the failover chain indexes into this
    // array, so re-reading it between attempts would shift the indices if the
    // health cache reordered the pool mid-chain.
    var proxyList = getProxyPool();
    var i = 0;
    function attempt() {
        if (i >= proxyList.length) {
            overlay.classList.add('hidden');
            showError('Failed to load podcast feed.');
            return;
        }
        var prefix = proxyList[i++];
        // Each attempt gets its own timeout so a hung proxy cannot leave the
        // loading overlay spinning forever.
        var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
        var timer = controller ? setTimeout(function() { controller.abort(); }, PROXY_TIMEOUT_MS) : null;
        fetch(prefix + encodeURIComponent(feedUrl), controller ? { signal: controller.signal } : {})
            .then(function(response) {
                if (timer) clearTimeout(timer);
                if (!response.ok) throw new Error('HTTP ' + response.status);
                return response.text();
            })
            .then(function(text) {
                var parser = new DOMParser();
                var xmlData = parser.parseFromString(text, 'text/xml');
                // Treat a parse error as a failed attempt (some proxies return
                // HTML). Keep the overlay up: the next proxy is still loading.
                if (xmlData.getElementsByTagName('parsererror').length) {
                    attempt();
                    return;
                }
                overlay.classList.add('hidden');
                parsePodcastFeed(xmlData, text);
            })
            .catch(function() {
                if (timer) clearTimeout(timer);
                attempt();
            });
    }
    attempt();
}

function extractPodcastImage(channel, xmlText) {
    var imageUrl = '';
    
    var imageEl = channel.querySelector('image');
    if (imageEl) {
        var urlEl = imageEl.querySelector('url');
        if (urlEl) imageUrl = urlEl.textContent;
    }
    if (!imageUrl) {
        var imgEl = channel.querySelector('img');
        if (imgEl) imageUrl = imgEl.getAttribute('src') || '';
    }
    
    if (!imageUrl) {
        var itunesImage = channel.querySelector('itunes\\:image, image[href]');
        if (itunesImage) imageUrl = itunesImage.getAttribute('href') || '';
    }
    
    // Check all children for itunes:image
    if (!imageUrl) {
        var children = channel.children;
        for (var i = 0; i < children.length; i++) {
            var tagName = children[i].tagName ? children[i].tagName.toLowerCase() : '';
            if (tagName === 'itunes:image') {
                imageUrl = children[i].getAttribute('href') || '';
                if (imageUrl) break;
            }
        }
    }
    
    if (!imageUrl && xmlText) {
        var urlMatch = xmlText.match(/<image[^>]*>[\s\S]*?<url>\s*(.*?)\s*<\/url>/i);
        if (urlMatch && urlMatch[1]) imageUrl = urlMatch[1];
        if (!imageUrl) {
            var itunesMatch = xmlText.match(/<itunes:image\s+href=["']([^"']+)["']/i);
            if (itunesMatch && itunesMatch[1]) imageUrl = itunesMatch[1];
        }
    }
    
    return imageUrl;
}

function parsePodcastFeed(xmlData, xmlText) {
    try {
        var channel = xmlData.querySelector('channel');
        var imageUrl = extractPodcastImage(channel, xmlText) || '../images/noimage.jpeg';
        
        podcastInfo = {
            title: channel.querySelector('title') ? channel.querySelector('title').textContent : 'Unknown Podcast',
            description: channel.querySelector('description') ? channel.querySelector('description').textContent : '',
            imageUrl: imageUrl,
            link: channel.querySelector('link') ? channel.querySelector('link').textContent : ''
        };
        
        // Update header
        document.getElementById('headerTitle').textContent = podcastInfo.title;
        document.getElementById('sidebarTitle').textContent = podcastInfo.title;
        
        // Update cover
        var coverSrc = podcastInfo.imageUrl && podcastInfo.imageUrl !== '../images/noimage.jpeg' 
            ? podcastInfo.imageUrl 
            : '../images/noimage.jpeg';
        var coverImg = document.getElementById('podcastCover');
        coverImg.src = coverSrc;
        coverImg.onerror = function () { this.src = '../images/noimage.jpeg'; };
        
        // Update info text
        document.getElementById('podcastName').textContent = podcastInfo.title;
        document.getElementById('podcastDesc').textContent = podcastInfo.description;
        
        // Parse episodes
        episodes = [];
        var items = channel.querySelectorAll('item');
        items.forEach(function(item) {
            var enclosure = item.querySelector('enclosure');
            var audioUrl = enclosure ? enclosure.getAttribute('url') : '';
            if (audioUrl) {
                var itunesDuration = item.querySelector('itunes\\:duration, duration');
                var itunesImage = item.querySelector('itunes\\:image');
                
                episodes.push({
                    title: item.querySelector('title') ? item.querySelector('title').textContent : 'Untitled Episode',
                    audioUrl: audioUrl,
                    pubDate: formatDate(item.querySelector('pubDate') ? item.querySelector('pubDate').textContent : ''),
                    duration: formatDuration(itunesDuration ? itunesDuration.textContent : ''),
                    description: item.querySelector('description') ? item.querySelector('description').textContent : '',
                    imageUrl: itunesImage ? itunesImage.getAttribute('href') : podcastInfo.imageUrl
                });
            }
        });
        
        if (episodes.length === 0) { showError('No episodes found in this podcast feed.'); return; }
        
        // Update episode count
        document.getElementById('episodeCount').textContent = episodes.length;
        
        filteredEpisodes = episodes.slice();
        renderEpisodes(filteredEpisodes);
    } catch (e) { console.error('Failed to parse podcast feed:', e); showError('Failed to parse podcast feed.'); }
}

function renderEpisodes(epList) {
    var html = '';
    epList.forEach(function (ep) {
        // Find the real index in the full episodes array
        var realIndex = episodes.indexOf(ep);
        var isFavorite = localStorage.getItem(FAV_PREFIX + realIndex);
        html += '<div class="episode-item" data-index="' + realIndex + '">';
        html += '  <div class="ep-icon"><i class="fas fa-play"></i></div>';
        html += '  <div class="ep-info">';
        html += '    <div class="ep-title">' + escapeHtml(ep.title) + '</div>';
        html += '    <div class="ep-meta">';
        if (ep.pubDate) html += '<span><i class="fas fa-calendar"></i>' + ep.pubDate + '</span>';
        if (ep.duration) html += '<span><i class="fas fa-clock"></i>' + ep.duration + '</span>';
        html += '    </div>';
        html += '  </div>';
        html += '  <i class="fas fa-heart favorite-btn ' + (isFavorite ? 'active' : '') + '"></i>';
        html += '</div>';
    });
    document.getElementById('episodeList').innerHTML = html;
    
    // Click handler - play episode
    document.querySelectorAll('#episodeList .episode-item').forEach(function(item) {
        item.addEventListener('click', function(e) {
            if (!e.target.classList.contains('favorite-btn')) {
                playEpisode(parseInt(this.dataset.index));
            }
        });
    });
    
    // Click to toggle favorite
    document.querySelectorAll('#episodeList .favorite-btn').forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var epItem = this.closest('.episode-item');
            var index = epItem.dataset.index;
            
            if (this.classList.contains('active')) {
                localStorage.removeItem(FAV_PREFIX + index);
                this.classList.remove('active');
            } else {
                localStorage.setItem(FAV_PREFIX + index, episodes[index].title);
                this.classList.add('active');
            }
            
            loadFavorites();
        });
    });
}

function searchEpisodes() {
    var query = document.getElementById('episodeSearch').value.trim().toLowerCase();
    if (!query) {
        filteredEpisodes = episodes.slice();
        renderEpisodes(filteredEpisodes);
        return;
    }
    filteredEpisodes = episodes.filter(function (ep) {
        return ep.title.toLowerCase().indexOf(query) !== -1;
    });
    renderEpisodes(filteredEpisodes);
}

function playEpisode(index) {
    if (index < 0 || index >= episodes.length) return;
    currentEpisodeIndex = index;
    var ep = episodes[index];
    
    // Update sidebar active state
    document.querySelectorAll('.episode-item').forEach(function(item) {
        item.classList.remove('active');
        var icon = item.querySelector('.ep-icon i');
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
    });
    var activeItem = document.querySelector('.episode-item[data-index="' + index + '"]');
    if (activeItem) {
        activeItem.classList.add('active');
        var activeIcon = activeItem.querySelector('.ep-icon i');
        activeIcon.classList.remove('fa-play');
        activeIcon.classList.add('fa-pause');
    }
    
    // Update main display
    document.getElementById('podcastInfoText').style.display = 'none';
    document.getElementById('currentEpInfo').style.display = '';
    document.getElementById('epTitleDisplay').textContent = ep.title;
    document.getElementById('epPodcastDisplay').textContent = podcastInfo.title;
    
    // Update cover with episode image if available
    var epCover = ep.imageUrl || podcastInfo.imageUrl;
    if (epCover && epCover !== '../images/noimage.jpeg' && !epCover.startsWith('data:')) {
        var coverImg = document.getElementById('podcastCover');
        coverImg.src = epCover;
        coverImg.onerror = function () { this.src = '../images/noimage.jpeg'; };
    }
    
    // Show player controls and progress
    document.getElementById('playerControlsBar').style.display = '';
    document.getElementById('progressContainer').style.display = '';
    
    // Update visualizer
    document.getElementById('soundWave').classList.remove('paused');
    
    // Play audio
    audioEl.src = ep.audioUrl;
    audioEl.play().catch(function (e) { console.error('Failed to play audio:', e); });
}

function initPlayerControls() {
    // Play/Pause
    document.getElementById('pPlayPause').addEventListener('click', function () {
        if (currentEpisodeIndex === -1) return;
        if (isPlaying) { audioEl.pause(); } else { audioEl.play().catch(function(e){ console.error(e); }); }
    });
    
    // Rewind 15s
    document.getElementById('pBackward').addEventListener('click', function () {
        if (currentEpisodeIndex !== -1) audioEl.currentTime = Math.max(0, audioEl.currentTime - 15);
    });
    
    // Forward 15s
    document.getElementById('pForward').addEventListener('click', function () {
        if (currentEpisodeIndex !== -1) audioEl.currentTime = Math.min(audioEl.duration || 0, audioEl.currentTime + 15);
    });
    
    // Speed control
    document.getElementById('pSpeed').addEventListener('click', function () {
        currentSpeedIndex = (currentSpeedIndex + 1) % playbackSpeeds.length;
        var speed = playbackSpeeds[currentSpeedIndex];
        audioEl.playbackRate = speed;
        this.textContent = speed + 'x';
    });
    
    // Progress bar click
    document.getElementById('pProgressBar').addEventListener('click', function (e) {
        if (currentEpisodeIndex === -1) return;
        var rect = this.getBoundingClientRect();
        var pct = (e.clientX - rect.left) / rect.width;
        audioEl.currentTime = audioEl.duration * pct;
    });
    
    // Audio events
    audioEl.addEventListener('timeupdate', function () {
        var ct = audioEl.currentTime, dur = audioEl.duration;
        if (dur) {
            document.getElementById('pProgressFill').style.width = (ct / dur) * 100 + '%';
            document.getElementById('pCurrentTime').textContent = formatTime(ct);
            document.getElementById('pTotalTime').textContent = formatTime(dur);
        }
    });
    
    audioEl.addEventListener('play', function () {
        isPlaying = true;
        var playIcon = document.getElementById('pPlayIcon');
        playIcon.classList.remove('fa-play');
        playIcon.classList.add('fa-pause');
        document.getElementById('soundWave').classList.remove('paused');
    });
    
    audioEl.addEventListener('pause', function () {
        isPlaying = false;
        var playIcon = document.getElementById('pPlayIcon');
        playIcon.classList.remove('fa-pause');
        playIcon.classList.add('fa-play');
        document.getElementById('soundWave').classList.add('paused');
    });
    
    audioEl.addEventListener('ended', function () {
        if (currentEpisodeIndex < episodes.length - 1) {
            playEpisode(currentEpisodeIndex + 1);
        } else {
            isPlaying = false;
            var playIcon = document.getElementById('pPlayIcon');
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
            document.getElementById('soundWave').classList.add('paused');
            document.querySelectorAll('.episode-item').forEach(function(item) {
                item.classList.remove('active');
                var icon = item.querySelector('.ep-icon i');
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            });
        }
    });
}

function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    var hrs = Math.floor(seconds / 3600), mins = Math.floor((seconds % 3600) / 60), secs = Math.floor(seconds % 60);
    if (hrs > 0) return hrs + ':' + (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs;
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    try { return new Date(dateStr).toLocaleDateString(); } catch (e) { return dateStr; }
}

function formatDuration(d) {
    if (!d) return '';
    if (/^\d+$/.test(d)) return formatTime(parseInt(d));
    return d;
}

function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

function showError(msg) {
    document.getElementById('episodeList').innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><h3>Error</h3><p>' + msg + '</p></div>';
}

// Load favorites from localStorage
function loadFavorites() {
    var favorites = [];
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key.startsWith(FAV_PREFIX)) {
            var epIndex = key.replace(FAV_PREFIX, '');
            var epTitle = localStorage.getItem(key);
            favorites.push({ index: epIndex, title: epTitle });
        }
    }
    
    document.getElementById('favCount').textContent = favorites.length;
    
    if (favorites.length === 0) {
        document.getElementById('favoriteContent').innerHTML =
            '<div class="empty-state" style="padding: 20px;">' +
            '<i class="fas fa-heart-broken" style="font-size: 24px;"></i>' +
            '<span style="font-size: 12px;">No favorites yet</span>' +
            '</div>';
    } else {
        var html = '';
        favorites.forEach(function (fav) {
            html += '<div class="favorite-item" data-index="' + fav.index + '" data-title="' + escapeHtml(fav.title) + '">';
            html += '  <i class="fas fa-heart"></i>';
            html += '  <span>' + escapeHtml(fav.title) + '</span>';
            html += '  <i class="fas fa-times delete-btn"></i>';
            html += '</div>';
        });
        document.getElementById('favoriteContent').innerHTML = html;
        
        // Click to play favorite
        document.querySelectorAll('#favoriteContent .favorite-item').forEach(function(item) {
            item.addEventListener('click', function(e) {
                if (!e.target.classList.contains('delete-btn')) {
                    var index = parseInt(this.dataset.index);
                    if (index >= 0 && index < episodes.length) {
                        playEpisode(index);
                        document.getElementById('favoritePanel').classList.remove('show');
                    }
                }
            });
        });
        
        // Click to delete favorite
        document.querySelectorAll('#favoriteContent .delete-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var favItem = this.closest('.favorite-item');
                var index = favItem.dataset.index;
                localStorage.removeItem(FAV_PREFIX + index);
                loadFavorites();
                
                // Update episode list favorite icon
                var epItem = document.querySelector('.episode-item[data-index="' + index + '"] .favorite-btn');
                if (epItem) epItem.classList.remove('active');
            });
        });
    }
}
