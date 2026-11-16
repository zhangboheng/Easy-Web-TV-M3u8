// TV Player JS - Native JavaScript (No jQuery)

var channels = [];
var player;
var currentChannelIndex = -1;  // Track current playing channel index

// Favorite prefix for localStorage - ensures only this app's favorites are shown
var FAV_PREFIX = 'fav_tvplay_';

// ============================== Stream diagnostics ==============================
// Explain why a channel may fail on this device. The #1 real-world cause is
// mixed content: the site runs on HTTPS (GitHub Pages) while the channel is a
// plain http:// stream - desktop Chrome/Edge/Firefox block that, while some
// mobile/TV webviews allow it. That matches "works on my other devices".
function currentChannelUrl() {
    if (currentChannelIndex >= 0 && channels[currentChannelIndex]) return channels[currentChannelIndex];
    var el = document.querySelector('.channel-item.active');
    return el ? el.dataset.url : '';
}

function isMixedContent(url) {
    return window.location.protocol === 'https:' && url && url.indexOf('http://') === 0;
}

function showStreamNotice(url) {
    var wrapper = document.querySelector('.video-wrapper');
    if (!wrapper) return;
    var old = document.getElementById('streamNotice');
    if (old) old.remove();

    var msg = null, kind = 'warn';
    if (url && isMixedContent(url)) {
        msg = isZhUser()
            ? '此频道使用不安全的 HTTP 流。桌面浏览器会在 HTTPS 页面上阻止它（混合内容策略），但在部分手机 / TV 应用中可能正常。可复制链接用 VLC 等 IPTV 播放器打开。'
            : 'This channel uses an insecure HTTP stream. Desktop browsers block it on HTTPS pages (mixed content), though it may still play in some mobile/TV apps. Copy the link into VLC or another IPTV player instead.';
    } else if (player && player.error()) {
        msg = isZhUser()
            ? '频道加载失败——源可能已失效、有地域限制，或使用了本浏览器不支持的编码（如 HEVC/H.265，桌面 Chrome 常不支持而手机/TV 支持）。'
            : 'Channel failed to load - the source may be offline, geo-blocked, or encoded with a codec this browser lacks (e.g. HEVC/H.265, which desktop Chrome often cannot decode but phones/TVs can).';
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

function isZhUser() {
    return (navigator.language || '').toLowerCase().indexOf('zh') === 0;
}


// Helper functions
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

document.addEventListener('DOMContentLoaded', function() {
    // Initialize video player
    player = videojs(document.querySelector('#video1'));
    
    // Error handling - prevent loading spinner and error icon showing simultaneously,
    // and explain to the user WHY a channel may refuse to play on this device.
    player.on('error', function() {
        player.removeClass('vjs-waiting');
        player.removeClass('vjs-loading');
        showStreamNotice(currentChannelUrl());
    });
    
    // Auto-play next channel when current channel ends
    player.on('ended', function() {
        console.log('Video ended, checking for next channel...');
        if (currentChannelIndex >= 0 && currentChannelIndex < channels.length - 1) {
            var nextIndex = currentChannelIndex + 1;
            console.log('Auto-playing next channel:', nextIndex + 1);
            var nextUrl = channels[nextIndex];
            var nextItem = $$('.channel-item')[nextIndex];
            var nextName = nextItem.dataset.name;
            playChannel(nextUrl, nextName);
            $$('.channel-item').forEach(function(el) { el.classList.remove('active'); });
            nextItem.classList.add('active');
        } else {
            console.log('No more channels to play');
        }
    });
    
    // Get Current href parameters
    // URL format: tvplay.html?type=categories&key=xxx&title=xxx
    var urlParams = new URLSearchParams(window.location.search);
    var type = urlParams.get('type') || 'categories';
    var key = urlParams.get('key') || '';
    var title = urlParams.get('title') || 'TV';

    // Set Page Title
    document.title = decodeURIComponent(title) + ' - TV Player';
    $('#categoryTitle').textContent = decodeURIComponent(title);

    // Build API URL based on type
    var apiUrl = 'https://iptv-org.github.io/iptv/' + type + '/' + key + ".m3u";

    // Get iptv-org m3u list and show contents
    loadChannels(apiUrl);
    
    // Load favorites
    loadFavorites();
    
    // ========== UI Event Handlers ==========
    
    // Toggle sidebar - toggle channel list and toolbar visibility
    function toggleSidebar() {
        var sidebar = $('#sidebar');
        var toolbar = $('#top-toolbar');
        
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
    var toggleSidebarBtn = $('#toggleSidebar');
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', function() {
            toggleSidebar();
        });
    }
    
    // Menu Button - hides toolbar for immersive mode
    var menuBtn = $('#menuBtn');
    if (menuBtn) {
        menuBtn.addEventListener('click', function() {
            var sidebar = $('#sidebar');
            var toolbar = $('#top-toolbar');
            
            // Hide toolbar for immersive mode
            toolbar.classList.add('hidden');
            
            // Collapse sidebar
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('show-mobile');
            } else {
                sidebar.classList.add('collapsed');
            }
        });
    }
    
    // Back Button
    var backBtn = $('#backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.history.back();
        });
    }
    
    // Link Input Toggle
    var linkBtn = $('#linkBtn');
    if (linkBtn) {
        linkBtn.addEventListener('click', function() {
            $('#linkInputWrapper').classList.toggle('show');
        });
    }
    
    // Play Custom Link
    var playLinkBtn = $('#playLinkBtn');
    if (playLinkBtn) {
        playLinkBtn.addEventListener('click', function() {
            var link = $('#linkInput').value;
            if (link) {
                playChannel(link, 'Custom URL');
            }
        });
    }
    
    // Favorite Panel Toggle
    var favoriteBtn = $('#favoriteBtn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function() {
            $('#favoritePanel').classList.toggle('show');
        });
    }
    
    // GitHub Button
    var githubBtn = $('#githubBtn');
    if (githubBtn) {
        githubBtn.addEventListener('click', function() {
            window.open('https://github.com/zhangboheng/Easy-Web-TV-M3u8', '_blank');
        });
    }
    
    // Shuffle Play
    var shuffleBtn = $('#shuffleBtn');
    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', function() {
            var channelItems = $$('#channelList .channel-item');
            if (channelItems.length > 0) {
                var randomIndex = Math.floor(Math.random() * channelItems.length);
                channelItems[randomIndex].click();
            }
        });
    }
    
    // Channel Search
    var channelSearch = $('#channelSearch');
    if (channelSearch) {
        channelSearch.addEventListener('input', function() {
            var searchTerm = this.value.toLowerCase();
            $$('#channelList .channel-item').forEach(function(item) {
                var name = item.querySelector('.channel-name').textContent.toLowerCase();
                if (name.indexOf(searchTerm) > -1) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
    
    // Close panels when clicking outside
    document.addEventListener('click', function(e) {
        var favoritePanel = $('#favoritePanel');
        var favoriteBtnEl = $('#favoriteBtn');
        if (favoritePanel && favoriteBtnEl && !favoritePanel.contains(e.target) && !favoriteBtnEl.contains(e.target)) {
            favoritePanel.classList.remove('show');
        }
        var linkInputWrapper = $('#linkInputWrapper');
        var linkBtnEl = $('#linkBtn');
        if (linkInputWrapper && linkBtnEl && !linkInputWrapper.contains(e.target) && !linkBtnEl.contains(e.target)) {
            linkInputWrapper.classList.remove('show');
        }
    });
    
    // Channel list click delegation
    var channelListEl = $('#channelList');
    if (channelListEl) {
        channelListEl.addEventListener('click', function(e) {
            var favoriteBtnClick = e.target.closest('.favorite-btn');
            if (favoriteBtnClick) {
                e.stopPropagation();
                var channelItem = favoriteBtnClick.closest('.channel-item');
                var url = channelItem.dataset.url;
                var name = channelItem.dataset.name;
                
                if (favoriteBtnClick.classList.contains('active')) {
                    // Remove from favorites
                    localStorage.removeItem(FAV_PREFIX + url);
                    favoriteBtnClick.classList.remove('active');
                } else {
                    // Add to favorites
                    localStorage.setItem(FAV_PREFIX + url, name);
                    favoriteBtnClick.classList.add('active');
                }
                
                loadFavorites();
                return;
            }
            
            var channelItem = e.target.closest('.channel-item');
            if (channelItem) {
                var url = channelItem.dataset.url;
                var name = channelItem.dataset.name;
                
                $$('.channel-item').forEach(function(el) { el.classList.remove('active'); });
                channelItem.classList.add('active');
                
                playChannel(url, name);
            }
        });
    }
});

// Load channels from API
function loadChannels(apiUrl) {
    fetch(apiUrl)
        .then(function(response) { return response.text(); })
        .then(function(message) {
            var channelList = [];
            var str = message;
            var lst = str.split(",").slice(1).filter(function(x) { return /[^h]+.m3u8/.test(x); }).map(function(x) { return x.split("\n"); });
            var array = str.split(" ");
            var links = array.filter(function(x) { return /[^h]+.m3u8/.test(x); }).map(function(x) { return x.split("\n"); }).flat().filter(function(x) { return /[^h]+.m3u8/.test(x); });
            
            for (var i = 0; i < links.length; i++) {
                channels.push(links[i]);
                var channelName = (lst[i] && lst[i][0]) ? lst[i][0] : 'Unknown channel';
                channelList.push({
                    name: channelName,
                    url: links[i],
                    isFavorite: window.localStorage.getItem(FAV_PREFIX + links[i]) === channelName
                });
            }
            
            renderChannelList(channelList);
        })
        .catch(function() {
            $('#channelList').innerHTML = '<div class="no-channels"><i class="fas fa-exclamation-triangle"></i><p>Failed to load channels</p><p style="font-size: 12px; margin-top: 10px;">Please check your internet connection</p></div>';
        });
}

// Render channel list
function renderChannelList(channelList) {
    $('#channelList').innerHTML = '';
    $('#channelCount').textContent = channelList.length;
    
    if (channelList.length === 0) {
        $('#channelList').innerHTML = '<div class="no-channels"><i class="fas fa-tv"></i><p>No channels found</p></div>';
        return;
    }
    
    var html = '';
    channelList.forEach(function(channel, index) {
        var isFav = channel.isFavorite ? 'active' : '';
        html += '<div class="channel-item ' + (index === 0 ? 'active' : '') + '" data-url="' + escapeHtml(channel.url) + '" data-name="' + escapeHtml(channel.name) + '">';
        html += '    <div class="channel-icon"><i class="fas fa-tv"></i></div>';
        html += '    <span class="channel-name">' + escapeHtml(channel.name) + '</span>';
        html += '    <i class="fas fa-heart favorite-btn ' + isFav + '" title="Add to favorites"></i>';
        html += '</div>';
    });
    
    $('#channelList').innerHTML = html;
    
    // Play first channel automatically
    if (channelList.length > 0) {
        playChannel(channelList[0].url, channelList[0].name);
    }
}

// Play channel
function playChannel(url, name) {
    if (!player) {
        player = videojs('video1');
    }
    
    // Warn early when an insecure HTTP stream is played on an HTTPS page:
    // desktop browsers block it as mixed content (a very common reason why a
    // channel works on some devices but not on a PC).
    showStreamNotice(url);
    
    // Update current channel index
    for (var i = 0; i < channels.length; i++) {
        if (channels[i] === url) {
            currentChannelIndex = i;
            break;
        }
    }
    
    player.src({
        src: url,
        type: 'application/x-mpegURL'
    });
    
    player.play();
    $('#currentChannel').textContent = name;
}

// Load favorites list
function loadFavorites() {
    var favorites = [];
    
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
    
    var html = '';
    favorites.forEach(function(fav) {
        html += '<div class="favorite-item" data-url="' + escapeHtml(fav.url) + '" data-name="' + escapeHtml(fav.name) + '">';
        html += '    <i class="fas fa-tv"></i>';
        html += '    <span>' + escapeHtml(fav.name) + '</span>';
        html += '</div>';
    });
    
    $('#favoriteContent').innerHTML = html;
    
    // Click to play favorite
    $$('.favorite-item').forEach(function(item) {
        item.addEventListener('click', function() {
            var url = this.dataset.url;
            var name = this.dataset.name;
            
            playChannel(url, name);
            $('#favoritePanel').classList.remove('show');
            
            // Update active state in channel list
            $$('.channel-item').forEach(function(el) { el.classList.remove('active'); });
            var channelItem = $('.channel-item[data-url="' + url + '"]');
            if (channelItem) {
                channelItem.classList.add('active');
            }
        });
    });
}
