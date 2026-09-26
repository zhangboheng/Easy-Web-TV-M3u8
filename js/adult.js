// Adult Player JS - Native JavaScript (No jQuery)

// CORS proxy + failover now live in ../js/apiproxy.js (fetchWithProxy)

// Favorite prefix for localStorage
var FAV_PREFIX = 'fav_adult_';

// Global variables
var currentApiUrl = '';
var currentVideoId = '';
var currentVideoName = '';
var currentPlayUrl = '';
var player = null;
var favorites = [];
var playItems = [];
var currentPlayIndex = -1;

// Helper functions
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Adult Player JS Loaded ===');
    
    // Initialize Video.js player
    player = videojs(document.querySelector('#video1'));
    console.log('Video.js player initialized');
    
    // Error handling
    player.on('error', function() {
        player.removeClass('vjs-waiting');
        player.removeClass('vjs-loading');
    });
    
    // Auto-play next episode when current episode ends
    player.on('ended', function() {
        console.log('Video ended, checking for next episode...');
        if (currentPlayIndex >= 0 && currentPlayIndex < playItems.length - 1) {
            var nextIndex = currentPlayIndex + 1;
            console.log('Auto-playing next episode:', nextIndex + 1);
            playVideo(playItems[nextIndex].url, playItems[nextIndex].name);
            $$('.channel-item').forEach(function(el) { el.classList.remove('active'); });
            $$('.channel-item')[nextIndex].classList.add('active');
        } else {
            console.log('No more episodes to play');
        }
    });
    
    // Parse URL parameters
    var urlParams = new URLSearchParams(window.location.search);
    currentApiUrl = urlParams.get('web') || '';
    currentVideoId = urlParams.get('tab') || '';
    
    console.log('URL Parameters:');
    console.log('  - web (API URL):', currentApiUrl);
    console.log('  - tab (Video ID):', currentVideoId);
    
    // Load favorites
    loadFavorites();
    
    // Load video detail
    if (currentApiUrl && currentVideoId) {
        console.log('Loading video detail...');
        loadVideoDetail(currentApiUrl, currentVideoId);
    } else if (currentApiUrl) {
        var initlink = decodeURIComponent(window.location.href).split('web=')[1];
        console.log('Direct play link:', initlink);
        if (initlink && initlink.indexOf('youxijian') > 1) {
            handleDirectPlay(initlink);
        }
    } else {
        console.warn('No API URL or Video ID provided');
        $('#channelList').innerHTML = '<div class="no-channels"><i class="fas fa-exclamation-triangle"></i><span>No video specified</span></div>';
    }
    
    // Setup UI interactions
    setupUIInteractions();
});

// Build API URL with proxy
function buildApiUrl(link, action, params) {
    var baseUrl;
    if (link.endsWith('.php')) {
        baseUrl = link;
    } else {
        baseUrl = link.endsWith('/') ? link : link + '/';
    }
    var url = baseUrl + '?ac=' + action;
    
    if (params) {
        for (var key in params) {
            if (params[key]) {
                url += '&' + key + '=' + encodeURIComponent(params[key]);
            }
        }
    }
    
    // Return the raw API URL; proxy + failover handled by fetchWithProxy().
    return url;
}

// Parse API response
function parseApiResponse(data) {
    console.log('Parsing API response...');
    
    if (typeof data === 'object') {
        console.log('Response is already an object');
        return data;
    }
    
    // Try JSON first
    try {
        var jsonData = JSON.parse(data);
        console.log('Response parsed as JSON');
        return jsonData;
    } catch (e) {
        console.log('Not JSON, trying XML...');
    }
    
    // Try XML
    try {
        var parser = new DOMParser();
        var xmlDoc = parser.parseFromString(data, 'text/xml');
        var result = {};
        
        console.log('Response parsed as XML');
        
        // Parse list page
        var listEl = xmlDoc.querySelector('list');
        result.page = parseInt(listEl.getAttribute('page') || '1');
        result.pagecount = parseInt(listEl.getAttribute('pagecount') || '0');
        result.recordcount = parseInt(listEl.getAttribute('recordcount') || '0');
        
        // Parse video list
        result.list = [];
        xmlDoc.querySelectorAll('video').forEach(function(videoEl) {
            var videoData = {
                vod_id: videoEl.querySelector('id') ? videoEl.querySelector('id').textContent : '',
                vod_name: videoEl.querySelector('name') ? videoEl.querySelector('name').textContent : '',
                vod_pic: videoEl.querySelector('pic') ? videoEl.querySelector('pic').textContent : '../images/noimage.jpeg',
                type_id: videoEl.querySelector('tid') ? videoEl.querySelector('tid').textContent : '',
                type_name: videoEl.querySelector('type') ? videoEl.querySelector('type').textContent : '',
                vod_remarks: videoEl.querySelector('note') ? videoEl.querySelector('note').textContent : '',
                vod_content: videoEl.querySelector('des') ? videoEl.querySelector('des').textContent : '',
                vod_play_url: videoEl.querySelector('dl') ? videoEl.querySelector('dl').textContent : '',
                vod_play_from: videoEl.querySelector('from') ? videoEl.querySelector('from').textContent : ''
            };
            
            // Alternative field names
            if (!videoData.vod_play_url) {
                videoData.vod_play_url = videoEl.querySelector('vod_play_url') ? videoEl.querySelector('vod_play_url').textContent : '';
            }
            if (!videoData.vod_play_url) {
                videoData.vod_play_url = videoEl.querySelector('play_url') ? videoEl.querySelector('play_url').textContent : '';
            }
            
            console.log('Parsed video:', videoData.vod_name, 'Play URL:', videoData.vod_play_url ? 'Found' : 'Not found');
            result.list.push(videoData);
        });
        
        return result;
    } catch (e) {
        console.error('Failed to parse response:', e);
        return null;
    }
}

// Load video detail
function loadVideoDetail(apiUrl, videoId) {
    console.log('=== Loading Video Detail ===');
    
    $('#channelList').innerHTML = '<div class="loading-state"><i class="fas fa-spinner"></i><span>Loading playlist...</span></div>';
    
    var detailUrl = buildApiUrl(apiUrl, 'detail', { ids: videoId });
    console.log('Detail API URL:', detailUrl);
    
    fetchWithProxy(detailUrl)
        .then(function(data) {
            console.log('API Response received, length:', data.length);
            
            var parsedData = parseApiResponse(data);
            
            if (!parsedData) {
                $('#channelList').innerHTML = '<div class="no-channels"><i class="fas fa-exclamation-triangle"></i><span>Failed to parse response</span></div>';
                return;
            }
            
            if (!parsedData.list || parsedData.list.length === 0) {
                $('#channelList').innerHTML = '<div class="no-channels"><i class="fas fa-video-slash"></i><span>No video found</span></div>';
                return;
            }
            
            var video = parsedData.list[0];
            currentVideoName = video.vod_name || video.name || 'Unknown';
            var videoContent = video.vod_content || video.des || video.content || '暂无简介';
            
            var playUrlRaw = video.vod_play_url || video.vpath || video.play_url || video.url || video.dl || '';
            
            console.log('Video name:', currentVideoName);
            console.log('Play URL raw:', playUrlRaw);
            
            $('#currentChannel').textContent = currentVideoName;
            $('#videoTitle').textContent = 'Playlist';
            document.title = currentVideoName + ' - Adult Player';
            
            $('#detailContent').innerHTML = '<h4 style="color: #ff004c; margin-bottom: 10px;">' + currentVideoName + '</h4><p>' + videoContent + '</p>';
            
            var items = parsePlayUrls(playUrlRaw, apiUrl);
            console.log('Parsed play items:', items.length);
            
            if (items.length === 0) {
                $('#channelList').innerHTML = '<div class="no-channels"><i class="fas fa-video-slash"></i><span>No playable sources found</span><small style="margin-top: 10px; font-size: 11px;">Raw data: ' + (playUrlRaw ? playUrlRaw.substring(0, 100) + '...' : 'Empty') + '</small></div>';
                return;
            }
            
            $('#channelCount').textContent = items.length;
            renderPlaylist(items);
            
            if (items[0]) {
                playVideo(items[0].url, items[0].name);
                $$('.channel-item')[0].classList.add('active');
            }
        })
        .catch(function(error) {
            console.error('API Error:', error);
            $('#channelList').innerHTML = '<div class="no-channels"><i class="fas fa-exclamation-triangle"></i><span>Failed to load</span></div>';
        });
}

// Parse play URLs
function parsePlayUrls(playUrlRaw, apiUrl) {
    var items = [];
    
    if (!playUrlRaw) return items;
    
    // Format 1: name$url#name$url
    if (playUrlRaw.indexOf('$') > -1 && playUrlRaw.indexOf('#') > -1) {
        var parts = playUrlRaw.split('#');
        parts.forEach(function(part, i) {
            if (part.indexOf('$') > -1) {
                var nameUrl = part.split('$');
                var name = nameUrl[0] || 'Episode ' + (i + 1);
                var url = nameUrl[1] || '';
                if (url) items.push({ name: name, url: url });
            }
        });
    }
    // Format 2: url#url#url
    else if (playUrlRaw.indexOf('#') > -1) {
        var parts = playUrlRaw.split('#');
        parts.forEach(function(url, i) {
            url = url.trim();
            if (url && (url.indexOf('http') > -1 || url.indexOf('.m3u8') > -1)) {
                items.push({ name: 'Episode ' + (i + 1), url: url });
            }
        });
    }
    // Format 3: name$url
    else if (playUrlRaw.indexOf('$') > -1) {
        var nameUrl = playUrlRaw.split('$');
        var name = nameUrl[0] || 'Play';
        var url = nameUrl[1] || '';
        if (url) items.push({ name: name, url: url });
    }
    // Format 4: Single URL
    else if (playUrlRaw.indexOf('http') > -1 || playUrlRaw.indexOf('.m3u8') > -1) {
        items.push({ name: 'Play', url: playUrlRaw });
    }
    // Format 5: Regex extraction
    else {
        var urlPattern = /https?:\/\/[^\s#$]+/g;
        var matches = playUrlRaw.match(urlPattern);
        if (matches) {
            matches.forEach(function(url, i) {
                items.push({ name: 'Episode ' + (i + 1), url: url });
            });
        }
    }
    
    return items;
}

// Render playlist
function renderPlaylist(items) {
    playItems = items;
    $('#channelList').innerHTML = '';
    
    items.forEach(function(item, i) {
        var displayName = currentVideoName + ' - ' + item.name;
        var isFav = checkFavorite(item.url, displayName);
        
        var div = document.createElement('div');
        div.className = 'channel-item';
        div.dataset.url = item.url;
        div.dataset.name = item.name;
        div.innerHTML = '<div class="channel-icon"><i class="fas fa-play"></i></div><span class="channel-name">' + item.name + '</span><i class="fas fa-heart favorite-btn ' + (isFav ? 'active' : '') + '"></i>';
        
        div.addEventListener('click', function() {
            $$('.channel-item').forEach(function(el) { el.classList.remove('active'); });
            div.classList.add('active');
            playVideo(item.url, item.name);
        });
        
        var favBtn = div.querySelector('.favorite-btn');
        favBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleFavorite(item.url, displayName, favBtn);
        });
        
        $('#channelList').appendChild(div);
    });
}

// Play video
function playVideo(url, name) {
    console.log('=== Playing Video ===');
    console.log('URL:', url);
    console.log('Name:', name);
    
    currentPlayUrl = url;
    
    // Update current play index
    playItems.forEach(function(item, i) {
        if (item.url === url) currentPlayIndex = i;
    });
    
    $('#currentChannel').textContent = name || currentVideoName;
    
    try {
        player.src({ src: url, type: 'application/x-mpegURL' });
        player.play();
        console.log('Video source set successfully');
    } catch (e) {
        console.error('Error setting video source:', e);
    }
}

// Handle direct play
function handleDirectPlay(initlink) {
    var parts = initlink.split('&');
    var playUrl = parts[0];
    var videoName = parts[1] || 'Custom URL';
    
    currentVideoName = videoName;
    var displayName = videoName;
    var isFav = checkFavorite(playUrl, displayName);
    
    $('#currentChannel').textContent = videoName;
    $('#videoTitle').textContent = 'Playlist';
    $('#channelCount').textContent = '1';
    
    var div = document.createElement('div');
    div.className = 'channel-item active';
    div.dataset.url = playUrl;
    div.dataset.name = videoName;
    div.innerHTML = '<div class="channel-icon"><i class="fas fa-play"></i></div><span class="channel-name">' + videoName + '</span><i class="fas fa-heart favorite-btn ' + (isFav ? 'active' : '') + '"></i>';
    
    div.addEventListener('click', function() {
        $$('.channel-item').forEach(function(el) { el.classList.remove('active'); });
        div.classList.add('active');
        playVideo(playUrl, videoName);
    });
    
    var favBtn = div.querySelector('.favorite-btn');
    favBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleFavorite(playUrl, displayName, favBtn);
    });
    
    $('#channelList').appendChild(div);
    playVideo(playUrl, videoName);
}

// Toggle favorite
function toggleFavorite(url, name, btn) {
    var favKey = FAV_PREFIX + url;
    var isFavorited = localStorage.getItem(favKey) === name;
    
    if (isFavorited) {
        localStorage.removeItem(favKey);
        btn.classList.remove('active');
    } else {
        localStorage.setItem(favKey, name);
        btn.classList.add('active');
    }
    
    loadFavorites();
}

// Load favorites
function loadFavorites() {
    favorites = [];
    
    Object.keys(localStorage).forEach(function(key) {
        if (key.startsWith(FAV_PREFIX)) {
            favorites.push({
                url: key.replace(FAV_PREFIX, ''),
                name: localStorage.getItem(key)
            });
        }
    });
    
    $('#favCount').textContent = favorites.length;
    
    if (favorites.length === 0) {
        $('#favoriteContent').innerHTML = '<div class="no-channels" style="padding: 20px;"><i class="fas fa-heart-broken" style="font-size: 24px;"></i><span style="font-size: 12px;">No favorites yet</span></div>';
        return;
    }
    
    $('#favoriteContent').innerHTML = '';
    favorites.forEach(function(fav) {
        var div = document.createElement('div');
        div.className = 'favorite-item';
        div.dataset.url = fav.url;
        div.innerHTML = '<i class="fas fa-play-circle"></i><span>' + fav.name + '</span><i class="fas fa-times remove-fav" title="Remove"></i>';
        
        div.addEventListener('click', function(e) {
            if (!e.target.classList.contains('remove-fav')) {
                $('#favoritePanel').classList.remove('show');
                playVideo(fav.url, fav.name);
                $$('.channel-item').forEach(function(el) { el.classList.remove('active'); });
                $('#currentChannel').textContent = fav.name;
            }
        });
        
        var removeBtn = div.querySelector('.remove-fav');
        removeBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            localStorage.removeItem(FAV_PREFIX + fav.url);
            loadFavorites();
        });
        
        $('#favoriteContent').appendChild(div);
    });
}

function checkFavorite(url, name) {
    return localStorage.getItem(FAV_PREFIX + url) === name;
}

// Setup UI interactions
function setupUIInteractions() {
    // Toggle Sidebar
    $('#toggleSidebar').addEventListener('click', function() {
        var sidebar = $('#sidebar');
        var toolbar = $('#top-toolbar');
        
        if (window.innerWidth <= 768) {
            sidebar.classList.toggle('show-mobile');
        } else {
            sidebar.classList.toggle('collapsed');
        }
        
        var isExpanded = (window.innerWidth <= 768) ? sidebar.classList.contains('show-mobile') : !sidebar.classList.contains('collapsed');
        
        if (isExpanded) {
            toolbar.classList.remove('hidden');
        } else {
            toolbar.classList.add('hidden');
        }
    });
    
    // Link Input
    $('#linkBtn').addEventListener('click', function() {
        $('#linkInputWrapper').classList.toggle('show');
        $('#linkInput').focus();
    });
    
    $('#playLinkBtn').addEventListener('click', function() {
        var url = $('#linkInput').value.trim();
        if (url) {
            playVideo(url, 'Custom URL');
            $('#currentChannel').textContent = 'Custom URL';
            $('#linkInputWrapper').classList.remove('show');
            $('#linkInput').value = '';
        }
    });
    
    $('#linkInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            $('#playLinkBtn').click();
        }
    });
    
    // Panels
    $('#favoriteBtn').addEventListener('click', function() {
        $('#favoritePanel').classList.toggle('show');
        $('#detailPanel').classList.remove('show');
    });
    
    $('#detailBtn').addEventListener('click', function() {
        $('#detailPanel').classList.toggle('show');
        $('#favoritePanel').classList.remove('show');
    });
    
    // Shuffle
    $('#shuffleBtn').addEventListener('click', function() {
        var channels = $$('.channel-item');
        if (channels.length > 0) {
            var randomIndex = Math.floor(Math.random() * channels.length);
            channels[randomIndex].click();
        }
    });
    
    // GitHub
    $('#githubBtn').addEventListener('click', function() {
        window.open('https://github.com/zhangboheng/Easy-Web-TV-M3u8', '_blank');
    });
    
    // Back
    $('#backBtn').addEventListener('click', function() {
        window.history.back();
    });
    
    // Search
    $('#channelSearch').addEventListener('input', function() {
        var query = this.value.toLowerCase();
        $$('.channel-item').forEach(function(item) {
            var name = item.querySelector('.channel-name').textContent.toLowerCase();
            item.style.display = name.indexOf(query) > -1 ? '' : 'none';
        });
    });
    
    // Close panels on outside click
    document.addEventListener('click', function(e) {
        var favPanel = $('#favoritePanel');
        var favBtn = $('#favoriteBtn');
        if (!favPanel.contains(e.target) && !favBtn.contains(e.target)) {
            favPanel.classList.remove('show');
        }
        
        var detailPanel = $('#detailPanel');
        var detailBtn = $('#detailBtn');
        if (!detailPanel.contains(e.target) && !detailBtn.contains(e.target)) {
            detailPanel.classList.remove('show');
        }
        
        var linkWrapper = $('#linkInputWrapper');
        var linkBtn = $('#linkBtn');
        if (!linkWrapper.contains(e.target) && !linkBtn.contains(e.target)) {
            linkWrapper.classList.remove('show');
        }
    });
    
    // Show toolbar on mouse move near top
    document.addEventListener('mousemove', function(e) {
        if (e.clientY < 100) {
            $('#top-toolbar').classList.remove('hidden');
        }
    });
}
