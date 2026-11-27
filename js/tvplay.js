// TV Player JS - Native JavaScript (No jQuery)

var channels = [];
var player;
var currentChannelIndex = -1;  // Track current playing channel index

// Favorite prefix for localStorage - ensures only this app's favorites are shown
var FAV_PREFIX = 'fav_tvplay_';

// Cache TTL for parsed playlists and the currently loaded playlist URL.
var TV_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h
var currentApiUrl = '';

function tvCacheGet(key) {
    try {
        var raw = window.localStorage.getItem(key);
        if (!raw) return null;
        var obj = JSON.parse(raw);
        if (!obj || !Array.isArray(obj.data)) return null;
        return { data: obj.data, at: obj.at || 0 };
    } catch (e) { return null; }
}
function tvCacheSet(key, data) {
    try { window.localStorage.setItem(key, JSON.stringify({ data: data, at: Date.now() })); }
    catch (e) { /* storage full - caching is best-effort */ }
}

// Standard M3U8 playlist parser. Line-based: EXTINF carries the channel
// metadata (tvg-id / tvg-logo / group-title) after the comma; URL lines follow.
// Handles #EXTVLCOPT, de-duplicates (tvg-id + url), and drops non-http URLs
// so the sidebar and failover only see playable entries.
function parseM3U(text) {
    var out = [];
    var seen = {};
    var lines = String(text || '').split(/\r?\n/);
    var cur = null;
    for (var i = 0; i < lines.length; i++) {
        var line = lines[i].trim();
        if (!line) continue;
        if (line.indexOf('#EXTM3U') === 0) continue;
        if (line.indexOf('#EXTINF:') === 0) {
            var attrText = line.substring(line.indexOf(':') + 1);
            var comma = attrText.indexOf(',');
            var attrPart = comma === -1 ? '' : attrText.substring(0, comma);
            var name = comma === -1 ? '' : attrText.substring(comma + 1).trim();
            var attrs = {};
            var re = /([a-zA-Z0-9_-]+)="([^"]*)"/g;
            var m;
            while ((m = re.exec(attrPart)) !== null) {
                // Convert hyphenated keys (tvg-id) to camelCase (tvgId) so
                // lookups below can use dot notation.
                var key = m[1].toLowerCase().replace(/-([a-z])/g, function (_, c) { return c.toUpperCase(); });
                attrs[key] = m[2];
            }
            cur = {
                name: name || attrs.tvgName || attrs.tvgId || 'Unknown channel',
                tvgId: attrs.tvgId || '',
                logo: attrs.tvgLogo || '',
                group: attrs.groupTitle || '',
                opts: []
            };
            continue;
        }
        if (line.indexOf('#EXTVLCOPT') === 0) {
            if (cur) cur.opts.push(line.substring(line.indexOf(':') + 1).trim());
            continue;
        }
        if (line.charAt(0) === '#') continue; // other directives (#KODIPROP, ...)
        var url = line;
        // Skip non-playable schemes (rtmp/rtsp/udp/mms appear in some iptv-org
        // lists) but KEEP cur alive so a following http(s) URL under the same
        // EXTINF still carries the channel's name / tvg-id / group.
        if (!/^https?:\/\//i.test(url)) { continue; }
        var key = (cur ? cur.tvgId : '') + '|' + url;
        if (seen[key]) { continue; }
        seen[key] = true;
        out.push({
            name: cur ? cur.name : 'Unknown channel',
            tvgId: cur ? cur.tvgId : '',
            logo: cur ? cur.logo : '',
            group: cur ? cur.group : '',
            opts: cur ? cur.opts : [],
            url: url
        });
        // Keep cur alive (do NOT null it): a #EXTVLCOPT may follow the URL and
        // accumulate into cur.opts, which is shared by reference with every
        // channel pushed from this EXTINF. The next EXTINF reassigns cur.
    }
    return out;
}

// ============================== Stream diagnostics ==============================
// Explain why a channel may fail on this device. The #1 real-world cause is
// mixed content: the site runs on HTTPS (GitHub Pages) while the channel is a
// plain http:// stream - desktop Chrome/Edge/Firefox block that, while some
// mobile/TV webviews allow it. That matches "works on my other devices".
function currentChannelUrl() {
    if (currentChannelIndex >= 0 && channels[currentChannelIndex]) return channels[currentChannelIndex].url;
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
    
    // Error handling - explain the failure and auto-fail over to the next
    // playable channel after a short delay (skips dead sources).
    player.on('error', function() {
        player.removeClass('vjs-waiting');
        player.removeClass('vjs-loading');
        showStreamNotice(currentChannelUrl());
        var failedIdx = currentChannelIndex;
        markChannelFailed(failedIdx);
        // wait briefly so transient errors don't thrash; then fail over - but
        // only if the user hasn't manually switched away from the failed
        // channel in the meantime (otherwise we'd interrupt their new pick).
        setTimeout(function () {
            if (currentChannelIndex === failedIdx) {
                tryNextChannel();
            }
        }, 600);
    });

    // Auto-play next playable channel when current channel ends
    player.on('ended', function() {
        console.log('Video ended, checking for next channel...');
        if (!tryNextChannel()) {
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
            window.location.href = '../routes/tv.html';
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
                var ci = channelIndexByUrl(url);
                if (ci >= 0) channels[ci].failed = false;

                $$('.channel-item').forEach(function(el) { el.classList.remove('active'); });
                channelItem.classList.add('active');

                playChannel(url, name);
            }
        });
    }
});

// Load channels from API
function loadChannels(apiUrl) {
    currentApiUrl = apiUrl;
    var cacheKey = 'tvplay_cache_' + apiUrl;
    // fetchWithProxy (from apiproxy.js) routes through the unified proxy pool
    // with its health cache + per-attempt timeout; fall back to raw fetch.
    var fetchText = (typeof fetchWithProxy === 'function')
        ? function (u) { return fetchWithProxy(u); }
        : function (u) { return fetch(u).then(function (r) { return r.text(); }); };

    function renderAndCache(parsed) {
        tvCacheSet(cacheKey, parsed);
        channels = parsed;
        renderChannelList(parsed);
    }
    function onError() {
        var cached = tvCacheGet(cacheKey);
        if (cached) { channels = cached.data; renderChannelList(cached.data); }
        else { renderLoadError(); }
    }

    var cached = tvCacheGet(cacheKey);
    if (cached && (Date.now() - cached.at) < TV_CACHE_TTL_MS) {
        channels = cached.data;
        renderChannelList(cached.data);
        // refresh in the background; only update the cache so the user's
        // current channel isn't interrupted by a re-render + auto-play.
        fetchText(apiUrl).then(function (message) {
            tvCacheSet(cacheKey, parseM3U(message));
        }).catch(function () { /* keep cached */ });
        return;
    }
    return fetchText(apiUrl)
        .then(function (message) { renderAndCache(parseM3U(message)); })
        .catch(onError);
}

function renderLoadError() {
    $('#channelList').innerHTML = '<div class="no-channels"><i class="fas fa-exclamation-triangle"></i>' +
        '<p>Failed to load channels</p>' +
        '<p style="font-size:12px;margin-top:10px;">Please check your internet connection</p>' +
        '<button type="button" id="tvRetryBtn" class="play-link-btn">Retry</button></div>';
    var btn = document.getElementById('tvRetryBtn');
    if (btn) btn.addEventListener('click', function () { loadChannels(currentApiUrl); });
}

// Render channel list
function renderChannelList(parsed) {
    var channelList = parsed.map(function (c) {
        return {
            name: c.name,
            url: c.url,
            group: c.group,
            logo: c.logo,
            isFavorite: window.localStorage.getItem(FAV_PREFIX + c.url) === c.name
        };
    });
    $('#channelList').innerHTML = '';
    $('#channelCount').textContent = channelList.length;

    if (channelList.length === 0) {
        $('#channelList').innerHTML = '<div class="no-channels"><i class="fas fa-tv"></i><p>No channels found</p></div>';
        return;
    }

    var html = '';
    channelList.forEach(function (channel, index) {
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
    
    // Update current channel index. Reset first: a URL that is not in the
    // channel list (custom link input, a favorite not in the current list)
    // must clear the index to -1. Otherwise a stale index points at an
    // unrelated channel, and the error handler would mark that wrong channel
    // as failed and trigger failover on it.
    currentChannelIndex = -1;
    for (var i = 0; i < channels.length; i++) {
        if (channels[i] && channels[i].url === url) {
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

function channelIndexByUrl(url) {
    for (var i = 0; i < channels.length; i++) {
        if (channels[i] && channels[i].url === url) return i;
    }
    return -1;
}

function markChannelFailed(idx) {
    if (idx >= 0 && idx < channels.length && channels[idx]) channels[idx].failed = true;
}

// Advance to the next playable channel, skipping failed and mixed-content
// (http on an https page, which browsers block) entries. Returns true when it
// started another channel, false when nothing usable remains. The loop runs
// i < channels.length (not <=): it never revisits the start channel, so an
// 'ended' event can't loop by re-playing the same channel that just finished.
function tryNextChannel() {
    var start = currentChannelIndex;
    if (start < 0 || !channels.length) return false;
    for (var i = 1; i < channels.length; i++) {
        var idx = (start + i) % channels.length;
        var ch = channels[idx];
        if (!ch || ch.failed) continue;
        if (isMixedContent(ch.url)) { ch.failed = true; continue; }
        playChannel(ch.url, ch.name);
        $$('.channel-item').forEach(function (el) { el.classList.remove('active'); });
        var item = $$('.channel-item')[idx];
        if (item) item.classList.add('active');
        return true;
    }
    return false;
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
