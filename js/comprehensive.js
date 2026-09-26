// Comprehensive (Movie/TV) Play Page JS
// Native JavaScript (No jQuery)

// CORS proxy + failover now live in ../js/apiproxy.js (fetchJSONWithProxy)

// Store episodes data
var episodes = [];
var links = [];
var videoName = '';
var videoDes = '';
var player = null;
var currentEpisodeIndex = -1;  // Track current playing episode

// Favorite prefix for localStorage - ensures only this app's favorites are shown
var FAV_PREFIX = 'fav_comprehensive_';

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize player
    player = videojs(document.querySelector('#video1'));
    
    // Error handling - prevent loading spinner and error icon showing simultaneously
    player.on('error', function() {
        player.removeClass('vjs-waiting');
        player.removeClass('vjs-loading');
    });
    
    // Auto-play next episode when current episode ends
    player.on('ended', function() {
        console.log('Video ended, checking for next episode...');
        if (currentEpisodeIndex >= 0 && currentEpisodeIndex < links.length - 1) {
            var nextIndex = currentEpisodeIndex + 1;
            console.log('Auto-playing next episode:', nextIndex + 1);
            playEpisode(nextIndex);
        } else {
            console.log('No more episodes to play');
        }
    });
    
    // Get Current href parameters
    var initlink = decodeURIComponent(window.location.href).split('=')[1].split('&')[0];
    var id = decodeURIComponent(window.location.href).split('=')[2];
    
    // Load video data
    loadVideoData(initlink, id);
    
    // Initialize UI interactions
    initUIInteractions();
    
    // Load favorites
    loadFavorites();
});

// Load video data from API
function loadVideoData(linkUrl, videoId) {
    var baseUrl = linkUrl.endsWith('/') ? linkUrl : linkUrl + '/';
    var apiUrl = baseUrl + '?ac=videolist&ids=' + videoId;
    
    fetchJSONWithProxy(apiUrl)
        .then(function(data) {
            var episodeList = document.getElementById('episodeList');
            episodeList.innerHTML = '';
            
            // Parse JSON response
            var videos = data.list || [];
            if (videos.length === 0) {
                showError("No video data found!");
                return;
            }
            
            var video = videos[0];
            videoName = video.vod_name || 'Unknown';
            videoDes = video.vod_content || 'No description available';
            var vodPlayUrl = video.vod_play_url || '';
            
            // Update UI with video info
            document.getElementById('videoTitle').textContent = videoName;
            document.getElementById('detailContent').innerHTML = '<p>' + videoDes + '</p>';
            
            // Parse play links
            var sources = vodPlayUrl.split('$$$').filter(function(x) { return x.trim(); });
            var playItems = [];
            
            for (var j = 0; j < sources.length; j++) {
                var items = sources[j].split('#').filter(function(x) { return x.trim(); });
                playItems = playItems.concat(items);
            }
            
            episodes = [];
            links = [];
            
            for (var i = 0; i < playItems.length; i++) {
                var parts = playItems[i].split('$');
                if (parts.length >= 2) {
                    // Only keep m3u8 format links
                    if (parts[1].trim().toLowerCase().endsWith('.m3u8')) {
                        episodes.push(parts[0]);
                        links.push(parts[1]);
                    }
                } else if (parts.length === 1 && parts[0].includes('http')) {
                    // Only keep m3u8 format links
                    if (parts[0].trim().toLowerCase().endsWith('.m3u8')) {
                        episodes.push('第' + (i+1) + '集');
                        links.push(parts[0]);
                    }
                }
            }
            
            // Update episode count
            document.getElementById('episodeCount').textContent = episodes.length;
            
            if (episodes.length === 0) {
                episodeList.innerHTML = 
                    '<div class="no-episodes">' +
                        '<i class="fas fa-video-slash"></i>' +
                        '<span>No episodes available</span>' +
                    '</div>';
                return;
            }
            
            // Render episode list
            renderEpisodeList();
            
            // Play first episode
            if (links.length > 0) {
                playEpisode(0);
            }
        })
        .catch(function() {
            showError("Failed to load video data. Please check your internet connection.");
        });
}

// Render episode list
function renderEpisodeList() {
    var episodeList = document.getElementById('episodeList');
    episodeList.innerHTML = '';
    
    for (var i = 0; i < episodes.length; i++) {
        var displayName = videoName + ' - ' + episodes[i];
        var favKey = FAV_PREFIX + links[i];
        var isFavorited = window.localStorage.getItem(favKey) === displayName;
        
        var div = document.createElement('div');
        div.className = 'episode-item';
        div.setAttribute('data-index', i);
        div.innerHTML = 
            '<div class="episode-icon">' +
                '<i class="fas fa-play"></i>' +
            '</div>' +
            '<span class="episode-name">' + episodes[i] + '</span>' +
            '<i class="fas fa-heart favorite-btn ' + (isFavorited ? 'active' : '') + '" data-link="' + links[i] + '" data-name="' + displayName + '"></i>';
        
        episodeList.appendChild(div);
    }
    
    // Click handler for episodes
    var items = episodeList.querySelectorAll('.episode-item');
    items.forEach(function(item) {
        item.addEventListener('click', function(e) {
            if (!e.target.classList.contains('favorite-btn')) {
                var index = parseInt(this.getAttribute('data-index'));
                playEpisode(index);
            }
        });
    });
    
    // Favorite button click handler
    var favBtns = episodeList.querySelectorAll('.favorite-btn');
    favBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var link = this.getAttribute('data-link');
            var name = this.getAttribute('data-name');
            toggleFavorite(link, name, this);
        });
    });
}

// Play episode by index
function playEpisode(index) {
    if (index < 0 || index >= links.length) return;
    
    currentEpisodeIndex = index;  // Update current index
    var url = links[index];
    var name = episodes[index];
    
    player.src({
        src: url,
        type: 'application/x-mpegURL'
    });
    player.play();
    
    // Update current episode display
    document.getElementById('currentEpisode').textContent = videoName + ' - ' + name;
    
    // Update active state
    var items = document.querySelectorAll('.episode-item');
    items.forEach(function(item) {
        item.classList.remove('active');
    });
    var activeItem = document.querySelector('.episode-item[data-index="' + index + '"]');
    if (activeItem) activeItem.classList.add('active');
}

// Toggle favorite
function toggleFavorite(link, name, btn) {
    if (!window.localStorage) {
        console.log("Browser does not support localStorage");
        return;
    }
    
    var favKey = FAV_PREFIX + link;
    var isFavorited = window.localStorage.getItem(favKey) === name;
    
    if (isFavorited) {
        window.localStorage.removeItem(favKey);
        btn.classList.remove('active');
    } else {
        window.localStorage.setItem(favKey, name);
        btn.classList.add('active');
    }
    
    // Refresh favorites panel
    loadFavorites();
}

// Load favorites
function loadFavorites() {
    var favorites = [];
    
    Object.keys(localStorage).forEach(function(key) {
        if (key.startsWith(FAV_PREFIX)) {
            favorites.push({
                link: key.replace(FAV_PREFIX, ''),
                name: localStorage.getItem(key)
            });
        }
    });
    
    document.getElementById('favCount').textContent = favorites.length;
    
    var favContent = document.getElementById('favoriteContent');
    
    if (favorites.length === 0) {
        favContent.innerHTML = 
            '<div class="no-episodes" style="padding: 20px;">' +
                '<i class="fas fa-heart-broken" style="font-size: 24px;"></i>' +
                '<span style="font-size: 12px;">No favorites yet</span>' +
            '</div>';
        return;
    }
    
    favContent.innerHTML = '';
    
    favorites.forEach(function(fav) {
        var div = document.createElement('div');
        div.className = 'favorite-item';
        div.setAttribute('data-link', fav.link);
        div.innerHTML = 
            '<i class="fas fa-play-circle"></i>' +
            '<span>' + fav.name + '</span>' +
            '<i class="fas fa-times remove-fav" title="Remove"></i>';
        
        favContent.appendChild(div);
    });
    
    // Click handler for favorite items
    var favItems = favContent.querySelectorAll('.favorite-item');
    favItems.forEach(function(item) {
        item.addEventListener('click', function(e) {
            if (!e.target.classList.contains('remove-fav')) {
                var link = this.getAttribute('data-link');
                var span = this.querySelector('span');
                playCustomLink(link, span.textContent);
            }
        });
    });
    
    // Remove favorite handler
    var removeBtns = favContent.querySelectorAll('.remove-fav');
    removeBtns.forEach(function(btn) {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var item = this.closest('.favorite-item');
            var link = item.getAttribute('data-link');
            localStorage.removeItem(FAV_PREFIX + link);
            loadFavorites();
            renderEpisodeList();
        });
    });
}

// Play custom link
function playCustomLink(url, name) {
    player.src({
        src: url,
        type: 'application/x-mpegURL'
    });
    player.play();
    document.getElementById('currentEpisode').textContent = name || 'Custom URL';
}

// Show error message
function showError(message) {
    var episodeList = document.getElementById('episodeList');
    episodeList.innerHTML = 
        '<div class="no-episodes">' +
            '<i class="fas fa-exclamation-triangle"></i>' +
            '<span>' + message + '</span>' +
        '</div>';
}

// Initialize UI interactions
function initUIInteractions() {
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
            window.history.back();
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
            var linkInput = document.getElementById('linkInput');
            var link = linkInput.value.trim();
            if (link) {
                playCustomLink(link, 'Custom URL');
                linkInput.value = '';
            }
        });
    }
    
    // Enter key for link input
    var linkInput = document.getElementById('linkInput');
    if (linkInput) {
        linkInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                var link = this.value.trim();
                if (link) {
                    playCustomLink(link, 'Custom URL');
                    this.value = '';
                }
            }
        });
    }
    
    // Favorite Panel Toggle
    var favoriteBtn = document.getElementById('favoriteBtn');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function() {
            document.getElementById('favoritePanel').classList.toggle('show');
            document.getElementById('detailPanel').classList.remove('show');
        });
    }
    
    // Detail Panel Toggle
    var detailBtn = document.getElementById('detailBtn');
    if (detailBtn) {
        detailBtn.addEventListener('click', function() {
            document.getElementById('detailPanel').classList.toggle('show');
            document.getElementById('favoritePanel').classList.remove('show');
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
            if (links.length > 0) {
                var randomIndex = Math.floor(Math.random() * links.length);
                playEpisode(randomIndex);
            }
        });
    }
    
    // Episode Search
    var episodeSearch = document.getElementById('episodeSearch');
    if (episodeSearch) {
        episodeSearch.addEventListener('input', function() {
            var searchTerm = this.value.toLowerCase();
            var items = document.querySelectorAll('.episode-item');
            items.forEach(function(item) {
                var name = item.querySelector('.episode-name').textContent.toLowerCase();
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
        var favoritePanel = document.getElementById('favoritePanel');
        var favoriteBtnEl = document.getElementById('favoriteBtn');
        var detailPanel = document.getElementById('detailPanel');
        var detailBtnEl = document.getElementById('detailBtn');
        var linkInputWrapper = document.getElementById('linkInputWrapper');
        var linkBtnEl = document.getElementById('linkBtn');
        
        if (!favoritePanel.contains(e.target) && !favoriteBtnEl.contains(e.target)) {
            favoritePanel.classList.remove('show');
        }
        if (!detailPanel.contains(e.target) && !detailBtnEl.contains(e.target)) {
            detailPanel.classList.remove('show');
        }
        if (!linkInputWrapper.contains(e.target) && !linkBtnEl.contains(e.target)) {
            linkInputWrapper.classList.remove('show');
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Escape to close panels
        if (e.key === 'Escape') {
            document.getElementById('favoritePanel').classList.remove('show');
            document.getElementById('detailPanel').classList.remove('show');
            document.getElementById('linkInputWrapper').classList.remove('show');
        }
        
        // Space to toggle play/pause (when not focused on input)
        if (e.key === ' ' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            if (player.paused()) {
                player.play();
            } else {
                player.pause();
            }
        }
    });
}
