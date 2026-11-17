// Radio Player JS - Extracted from radioplay.html
// Radio Browser API source
// Native JavaScript (No jQuery)

// RadioBrowser fetch + mirror failover now live in ../js/apiproxy.js (fetchRadio)
var stations = [];
var player;

// Favorite prefix for localStorage - ensures only this app's favorites are shown
const FAV_PREFIX = 'radio_fav_';

// ============================== Stream diagnostics ==============================
// Explain why a station may fail on this device. The #1 real-world cause is
// mixed content: the site runs on HTTPS (GitHub Pages) while the station is a
// plain http:// stream - desktop Chrome/Edge/Firefox block that, while some
// mobile/TV webviews allow it. That matches "works on my other devices".
var currentRadioUrl = '';

function isMixedContent(url) {
    return window.location.protocol === 'https:' && url && url.indexOf('http://') === 0;
}

function isZhUser() {
    return (navigator.language || '').toLowerCase().indexOf('zh') === 0;
}

function showStreamNotice(url) {
    currentRadioUrl = url || currentRadioUrl;
    var wrapper = document.querySelector('.video-wrapper');
    if (!wrapper) return;
    var old = document.getElementById('streamNotice');
    if (old) old.remove();

    var msg = null, kind = 'warn';
    if (url && isMixedContent(url)) {
        msg = isZhUser()
            ? '此电台使用不安全的 HTTP 流。桌面浏览器会在 HTTPS 页面上阻止它（混合内容策略），但在部分手机 / TV 应用中可能正常。可复制链接用 VLC 等播放器打开。'
            : 'This station uses an insecure HTTP stream. Desktop browsers block it on HTTPS pages (mixed content), though it may still play in some mobile/TV apps. Copy the link into VLC or another media player instead.';
    } else if (player && player.error()) {
        msg = isZhUser()
            ? '电台加载失败——源可能已失效、有地域限制，或使用了本浏览器不支持的编码。'
            : 'Station failed to load - the source may be offline, geo-blocked, or encoded with a codec this browser lacks.';
        kind = 'err';
    }
    if (!msg) return;

    var box = document.createElement('div');
    box.id = 'streamNotice';
    box.style.cssText = 'position:absolute;top:10px;left:50%;transform:translateX(-50%);z-index:20;max-width:92%;' +
        'background:rgba(10,10,18,0.92);color:#fff;padding:10px 14px;border-radius:10px;font-size:13px;line-height:1.5;' +
        'box-shadow:0 4px 18px rgba(0,0,0,0.5);border:1px solid ' + (kind === 'err' ? '#ff5566' : '#ffb84d') + ';display:flex;gap:10px;align-items:flex-start;';
    var icon = document.createElement('i');
    icon.className = 'fas ' + (kind === 'err' ? 'fa-exclamation-circle' : 'fa-unlock-alt');
    icon.style.cssText = 'margin-top:2px;color:' + (kind === 'err' ? '#ff5566' : '#ffb84d') + ';';
    var txt = document.createElement('span');
    txt.textContent = msg;
    var close = document.createElement('i');
    close.className = 'fas fa-times';
    close.style.cssText = 'cursor:pointer;color:rgba(255,255,255,0.6);margin-top:2px;';
    close.addEventListener('click', function () { box.remove(); });
    box.appendChild(icon); box.appendChild(txt); box.appendChild(close);
    wrapper.style.position = wrapper.style.position || 'relative';
    wrapper.appendChild(box);
}

function currentStationUrl() {
    return currentRadioUrl;
}


document.addEventListener('DOMContentLoaded', function() {
    // Initialize video.js player
    player = videojs('video1');
    
    // Error handling - prevent loading spinner and error icon showing simultaneously,
    // and explain why the station may refuse to play on this device.
    player.on('error', function() {
        player.removeClass('vjs-waiting');
        player.removeClass('vjs-loading');
        showStreamNotice(currentStationUrl());
    });
    
    // Parse URL parameters
    var urlParams = new URLSearchParams(window.location.search);
    var tab = urlParams.get('tab');
    var type = urlParams.get('t');
    
    // Set page title
    var displayName = tab === 'Taiwan Province Of China' ? 'Taiwan' : tab;
    document.title = displayName + ' - Radio Player';
    document.getElementById('categoryTitle').textContent = displayName;
    
    // API endpoints by type
    // t=1: by country, t=2: by language, t=3: by tag
    var apiEndpoints = ['', 'json/stations/bycountry/', 'json/stations/bylanguage/', 'json/stations/bytag/'];
    
    // Load stations
    if (tab && type) {
        loadStations(tab, apiEndpoints[parseInt(type)]);
    }
    
    // Load favorites
    loadFavorites();
    
    // ========== UI Event Handlers ==========
    
    // Toggle sidebar - toggle station list and toolbar visibility
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
    var toggleSidebarBtn = document.getElementById('toggleSidebar');
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', function() {
            toggleSidebar();
        });
    }
    
    // Back Button
    var backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = '../routes/radio.html';
        });
    }
    
    // Link Input Toggle
    var linkBtn = document.getElementById('linkBtn');
    if (linkBtn) {
        linkBtn.addEventListener('click', function() {
            document.getElementById('linkInputWrapper').classList.toggle('show');
        });
    }
    
    // Play Custom Link
    var playLinkBtn = document.getElementById('playLinkBtn');
    if (playLinkBtn) {
        playLinkBtn.addEventListener('click', function() {
            var link = document.getElementById('linkInput').value;
            if (link) {
                playStation(link, 'Custom URL', '');
            }
        });
    }
    
    // Favorite Panel Toggle
    var favoriteBtn = document.getElementById('favoriteBtn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function() {
            document.getElementById('favoritePanel').classList.toggle('show');
        });
    }
    
    // GitHub Button
    var githubBtn = document.getElementById('githubBtn');
    if (githubBtn) {
        githubBtn.addEventListener('click', function() {
            window.open('https://github.com/zhangboheng/Easy-Web-TV-M3u8', '_blank');
        });
    }
    
    // Shuffle Play
    var shuffleBtn = document.getElementById('shuffleBtn');
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', function() {
            if (stations.length > 0) {
                var randomIndex = Math.floor(Math.random() * stations.length);
                var station = stations[randomIndex];
                playStation(station.url, station.name, station.country);
            }
        });
    }
    
    // Station Search
    var stationSearch = document.getElementById('stationSearch');
    if (stationSearch) {
        stationSearch.addEventListener('input', function() {
            var searchTerm = this.value.toLowerCase();
            document.querySelectorAll('#stationList .station-item').forEach(function(item) {
                var name = item.querySelector('.station-name').textContent.toLowerCase();
                item.style.display = name.indexOf(searchTerm) > -1 ? '' : 'none';
            });
        });
    }
    
    // Close panels when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#favoritePanel') && !e.target.closest('#favoriteBtn')) {
            document.getElementById('favoritePanel').classList.remove('show');
        }
        if (!e.target.closest('#linkInputWrapper') && !e.target.closest('#linkBtn')) {
            document.getElementById('linkInputWrapper').classList.remove('show');
        }
    });
    
    // Player events
    player.on('pause', function() {
        document.getElementById('radioVisualizer').classList.add('paused');
    });
    
    player.on('play', function() {
        document.getElementById('radioVisualizer').classList.remove('paused');
    });
});

// Load stations from API
function loadStations(tab, endpoint) {
    fetchRadio(endpoint + encodeURIComponent(tab))
        .then(function(data) {
            var stationList = document.getElementById('stationList');
            stationList.innerHTML = '';
            stations = [];
            
            if (data && data.length > 0) {
                document.getElementById('stationCount').textContent = data.length;
                
                data.forEach(function(station) {
                    stations.push({
                        url: station.url,
                        name: station.name,
                        country: station.country,
                        favicon: station.favicon
                    });
                    
                    var isFavorite = localStorage.getItem(FAV_PREFIX + station.url) === station.name;
                    var favoriteClass = isFavorite ? 'active' : '';
                    
                    var itemHtml = `
                        <div class="station-item" data-url="${station.url}" data-name="${escapeHtml(station.name)}" data-country="${escapeHtml(station.country)}">
                            <div class="station-icon">
                                <i class="fas fa-radio"></i>
                            </div>
                            <span class="station-name" title="${escapeHtml(station.name)}">${escapeHtml(station.name)}</span>
                            <i class="fas fa-heart favorite-btn ${favoriteClass}" title="Add to favorites"></i>
                        </div>
                    `;
                    stationList.insertAdjacentHTML('beforeend', itemHtml);
                });
                
                // Auto-play first station
                playStation(data[0].url, data[0].name, data[0].country);
                
                // Click handler for station items
                document.querySelectorAll('.station-item').forEach(function(item) {
                    item.addEventListener('click', function(e) {
                        if (e.target.classList.contains('favorite-btn')) {
                            // Handle favorite
                            toggleFavorite(this.dataset.url, this.dataset.name, e.target);
                        } else {
                            // Play station
                            playStation(this.dataset.url, this.dataset.name, this.dataset.country);
                        }
                    });
                });
            } else {
                stationList.innerHTML = `
                    <div class="no-stations">
                        <i class="fas fa-broadcast-tower"></i>
                        <p>No stations found</p>
                    </div>
                `;
            }
        })
        .catch(function() {
            document.getElementById('stationList').innerHTML = `
                <div class="no-stations">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Failed to load stations. Please check your internet connection.</p>
                </div>
            `;
        });
}

// Play station
function playStation(url, name, country) {
    var type = url.indexOf('m3u8') > -1 ? 'application/x-mpegURL' : 'audio/mp3';
    
    // Explain why a station may fail on this device (mixed content is the #1
    // reason a station works on some devices but not on a PC).
    showStreamNotice(url);
    
    player.src({
        src: url,
        type: type
    });
    player.play();
    
    // Update UI
    document.getElementById('currentStation').textContent = name;
    document.getElementById('stationTitle').textContent = name;
    if (country) {
        document.getElementById('stationCountry').innerHTML = '<i class="fas fa-globe"></i><span>' + country + '</span>';
    }
    
    // Start visualizer animation
    document.getElementById('radioVisualizer').classList.remove('paused');
    
    // Update active state
    document.querySelectorAll('.station-item').forEach(function(item) {
        item.classList.remove('active');
    });
    var activeItem = document.querySelector('.station-item[data-url="' + url + '"]');
    if (activeItem) {
        activeItem.classList.add('active');
    }
}

// Toggle favorite
function toggleFavorite(url, name, btn) {
    var favKey = FAV_PREFIX + url;
    var existingName = localStorage.getItem(favKey);
    
    if (existingName) {
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
    var favorites = [];
    
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key.startsWith(FAV_PREFIX)) {
            favorites.push({
                url: key.substring(FAV_PREFIX.length),
                name: localStorage.getItem(key)
            });
        }
    }
    
    document.getElementById('favCount').textContent = favorites.length;
    var favoriteContent = document.getElementById('favoriteContent');
    
    if (favorites.length > 0) {
        favoriteContent.innerHTML = '';
        
        favorites.forEach(function(fav) {
            var itemHtml = `
                <div class="favorite-item" data-url="${fav.url}">
                    <i class="fas fa-heart"></i>
                    <span>${escapeHtml(fav.name)}</span>
                    <i class="fas fa-times delete-btn" title="Remove from favorites"></i>
                </div>
            `;
            favoriteContent.insertAdjacentHTML('beforeend', itemHtml);
        });
        
        // Click handler for favorite items (play)
        document.querySelectorAll('.favorite-item').forEach(function(item) {
            item.addEventListener('click', function(e) {
                if (e.target.classList.contains('delete-btn')) {
                    // Delete favorite
                    var url = this.dataset.url;
                    localStorage.removeItem(FAV_PREFIX + url);
                    this.remove();
                    
                    // Update station list favorite icons
                    var stationItem = document.querySelector('.station-item[data-url="' + url + '"]');
                    if (stationItem) {
                        stationItem.querySelector('.favorite-btn').classList.remove('active');
                    }
                    
                    // Update count and check if empty
                    var remaining = document.querySelectorAll('.favorite-item').length;
                    document.getElementById('favCount').textContent = remaining;
                    if (remaining === 0) {
                        favoriteContent.innerHTML = `
                            <div class="no-stations" style="padding: 20px;">
                                <i class="fas fa-heart-broken" style="font-size: 24px;"></i>
                                <span style="font-size: 12px;">No favorites yet</span>
                            </div>
                        `;
                    }
                } else {
                    // Play station
                    playStation(this.dataset.url, this.querySelector('span').textContent, '');
                    document.getElementById('favoritePanel').classList.remove('show');
                }
            });
        });
    } else {
        favoriteContent.innerHTML = `
            <div class="no-stations" style="padding: 20px;">
                <i class="fas fa-heart-broken" style="font-size: 24px;"></i>
                <span style="font-size: 12px;">No favorites yet</span>
            </div>
        `;
    }
}

// Escape HTML special characters
function escapeHtml(text) {
    if (!text) return '';
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
