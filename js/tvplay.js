// TV Player JS - Native JavaScript (No jQuery)

var channels = [];
var player;
var currentChannelIndex = -1;  // Track current playing channel index

// Favorite prefix for localStorage - ensures only this app's favorites are shown
var FAV_PREFIX = 'fav_tvplay_';

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
    
    // Error handling - prevent loading spinner and error icon showing simultaneously
    player.on('error', function() {
        player.removeClass('vjs-waiting');
        player.removeClass('vjs-loading');
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
