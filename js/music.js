// Music Player JS - Native JavaScript (No jQuery)

var songs = [];
var playlist = [];
var currentSongId = null;
var artistName = '';
var artistId = '';
var FAV_PREFIX = 'fav_music_';
var pageNum = 1;
var isLoading = false;
var hasMore = true;

// CORS proxy + failover now live in ../js/apiproxy.js (fetchMusicJSON)

// Helper functions
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

document.addEventListener('DOMContentLoaded', function () {
    var player = videojs(document.querySelector('#video1'));
    
    // Error handling - prevent loading spinner and error icon showing simultaneously
    player.on('error', function() {
        player.removeClass('vjs-waiting');
        player.removeClass('vjs-loading');
    });
    
    // Get Current href
    artistId = decodeURIComponent(window.location.href).split('web=')[1];
    
    // Toggle sidebar - toggle chapter list and toolbar visibility
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
    $('#toggleSidebar').addEventListener('click', function () {
        toggleSidebar();
    });
    
    // Back Button
    $('#backBtn').addEventListener('click', function () {
        window.history.back();
    });
    
    // Favorite Panel Toggle
    $('#favoriteBtn').addEventListener('click', function () {
        $('#favoritePanel').classList.toggle('show');
    });
    
    // GitHub Button
    $('#githubBtn').addEventListener('click', function () {
        window.open('https://github.com/zhangboheng/Easy-Web-TV-M3u8', '_blank');
    });
    
    // Shuffle Play
    $('#shuffleBtn').addEventListener('click', function () {
        if (songs.length > 0) {
            var randomIndex = Math.floor(Math.random() * songs.length);
            playSong(songs[randomIndex].id, songs[randomIndex].name);
        }
    });
    
    // Song Search
    $('#songSearch').addEventListener('input', function () {
        var searchTerm = this.value.toLowerCase();
        $$('#songList .song-item').forEach(function (item) {
            var name = item.querySelector('.song-name').textContent.toLowerCase();
            if (name.indexOf(searchTerm) > -1) {
                item.style.display = '';
            } else {
                item.style.display = 'none';
            }
        });
    });
    
    // Close panels when clicking outside
    document.addEventListener('click', function (e) {
        var favoritePanel = $('#favoritePanel');
        var favoriteBtn = $('#favoriteBtn');
        if (!favoritePanel.contains(e.target) && !favoriteBtn.contains(e.target)) {
            favoritePanel.classList.remove('show');
        }
    });
    
    // Player events
    player.on('play', function () {
        $('#musicVisualizer').classList.remove('paused');
    });
    
    player.on('pause', function () {
        $('#musicVisualizer').classList.add('paused');
    });
    
    // Auto play next song on ended
    player.on('ended', function () {
        if (playlist.length > 0) {
            var randomIndex = Math.floor(Math.random() * playlist.length);
            playSong(playlist[randomIndex].id, playlist[randomIndex].name);
        }
    });
    
    // Scroll to load more songs in sidebar
    $('#songList').addEventListener('scroll', function () {
        var scrollTop = this.scrollTop;
        var scrollHeight = this.scrollHeight;
        var containerHeight = this.clientHeight;
        
        if (scrollTop + containerHeight >= scrollHeight - 50) {
            if (!isLoading && hasMore) {
                loadMoreSongs();
            }
        }
    });
    
    // Song list click delegation
    $('#songList').addEventListener('click', function (e) {
        var favoriteBtn = e.target.closest('.favorite-btn');
        if (favoriteBtn) {
            e.stopPropagation();
            var songItem = favoriteBtn.closest('.song-item');
            var id = songItem.dataset.id;
            var name = songItem.dataset.name;
            
            if (favoriteBtn.classList.contains('active')) {
                // Remove from favorites
                localStorage.removeItem(FAV_PREFIX + id);
                favoriteBtn.classList.remove('active');
            } else {
                // Add to favorites
                localStorage.setItem(FAV_PREFIX + id, name);
                favoriteBtn.classList.add('active');
            }
            
            loadFavorites();
            return;
        }
        
        var songItem = e.target.closest('.song-item');
        if (songItem) {
            var id = songItem.dataset.id;
            var name = songItem.dataset.name;
            playSong(id, name);
        }
    });
    
    // Load songs from API
    loadSongs(artistId);
    
    // Load favorites
    loadFavorites();
});

// Load songs from API
function loadSongs(id) {
    artistId = id;
    isLoading = true;
    
    $('#songList').innerHTML = '<div class="loading-state"><i class="fas fa-spinner"></i><span>Loading songs...</span></div>';
    
    fetchMusicJSON('/artist/songs?id=' + artistId + '&limit=50&offset=0', function (message) {
        isLoading = false;
        var songList = message.songs;
        if (songList && songList.length > 0) {
            artistName = songList[0].ar[0].name;
            $('#artistTitle').textContent = artistName;
            $('#artistName span').textContent = artistName;
            
            songs = songList.map(function(x) { return { id: x.id, name: x.name }; });
            playlist = songs.slice();
            
            $('#songCount').textContent = songs.length;
            
            // Render song list
            renderSongList();
            
            // Play first song
            playSong(songs[0].id, songs[0].name);
            
            // Check if there might be more songs
            if (songList.length < 50) {
                hasMore = false;
            }
        } else {
            hasMore = false;
            $('#songList').innerHTML = '<div class="no-songs"><i class="fas fa-music"></i><span>No songs found</span></div>';
        }
    }, function () {
        isLoading = false;
        hasMore = false;
        $('#songList').innerHTML = '<div class="no-songs"><i class="fas fa-exclamation-circle"></i><span>Failed to load songs</span></div>';
    });
}

// Load more songs
function loadMoreSongs() {
    if (isLoading || !hasMore) return;
    isLoading = true;
    pageNum++;
    
    // Add loading indicator at bottom
    var loadingDiv = document.createElement('div');
    loadingDiv.className = 'loading-more';
    loadingDiv.id = 'loadingMore';
    loadingDiv.innerHTML = '<i class="fas fa-spinner" style="animation: spin 1s linear infinite;"></i><span style="color: rgba(255,255,255,0.5); font-size: 12px; margin-left: 10px;">Loading more...</span>';
    $('#songList').appendChild(loadingDiv);
    
    fetchMusicJSON('/artist/songs?id=' + artistId + '&limit=50&offset=' + (50 * (pageNum - 1)), function (message) {
        isLoading = false;
        $('#loadingMore').remove();
        
        var songList = message.songs;
        if (songList && songList.length > 0) {
            var newSongs = songList.map(function(x) { return { id: x.id, name: x.name }; });
            songs = songs.concat(newSongs);
            playlist = playlist.concat(newSongs);
            
            $('#songCount').textContent = songs.length;
            
            // Append new songs to list
            appendSongList(newSongs);
            
            if (songList.length < 50) {
                hasMore = false;
            }
        } else {
            hasMore = false;
        }
    }, function () {
        isLoading = false;
        pageNum--;
        $('#loadingMore').remove();
    });
}

// Render song list
function renderSongList() {
    var html = '';
    songs.forEach(function (song, index) {
        var isFavorite = localStorage.getItem(FAV_PREFIX + song.id);
        html += '<div class="song-item ' + (index === 0 ? 'active' : '') + '" data-id="' + song.id + '" data-name="' + song.name + '">';
        html += '    <div class="song-icon"><i class="fas fa-music"></i></div>';
        html += '    <span class="song-name">' + song.name + '</span>';
        html += '    <i class="fas fa-heart favorite-btn ' + (isFavorite ? 'active' : '') + '"></i>';
        html += '</div>';
    });
    $('#songList').innerHTML = html;
}

// Append new songs to list
function appendSongList(newSongs) {
    var html = '';
    newSongs.forEach(function (song) {
        var isFavorite = localStorage.getItem(FAV_PREFIX + song.id);
        html += '<div class="song-item" data-id="' + song.id + '" data-name="' + song.name + '">';
        html += '    <div class="song-icon"><i class="fas fa-music"></i></div>';
        html += '    <span class="song-name">' + song.name + '</span>';
        html += '    <i class="fas fa-heart favorite-btn ' + (isFavorite ? 'active' : '') + '"></i>';
        html += '</div>';
    });
    $('#songList').insertAdjacentHTML('beforeend', html);
}

// Play song
function playSong(songId, songName) {
    currentSongId = songId;
    
    // Update UI
    $('#currentSong').textContent = songName;
    $('#songTitle').textContent = songName;
    $('#artistName span').textContent = artistName;
    
    // Update active state
    $$('#songList .song-item').forEach(function(item) {
        item.classList.remove('active');
    });
    var activeItem = $('#songList .song-item[data-id="' + songId + '"]');
    if (activeItem) {
        activeItem.classList.add('active');
        
        // Scroll to active song in sidebar
        var songList = $('#songList');
        var scrollPosition = activeItem.offsetTop - songList.clientHeight / 2 + activeItem.clientHeight / 2;
        songList.scrollTo({ top: scrollPosition, behavior: 'smooth' });
    }
    
    // Get playable URL and play (removed redundant /check/music pre-flight)
    fetchMusicJSON('/song/url?id=' + songId, function (data) {
        var url = data.data && data.data[0] && data.data[0].url;
        if (url) {
            var player = videojs(document.querySelector('#video1'));
            player.src({
                src: url,
                type: "audio/mp3"
            });
            player.play();
            $('#musicVisualizer').classList.remove('paused');
        } else {
            alert('Sorry, this song is not available...');
        }
    }, function () {
        alert('Sorry, no rights to play...');
    });
}

// Load favorites from localStorage
function loadFavorites() {
    var favorites = [];
    Object.keys(localStorage).forEach(function(key) {
        if (key.startsWith(FAV_PREFIX)) {
            var songId = key.replace(FAV_PREFIX, '');
            var songName = localStorage.getItem(key);
            favorites.push({ id: songId, name: songName });
        }
    });
    
    $('#favCount').textContent = favorites.length;
    
    if (favorites.length === 0) {
        $('#favoriteContent').innerHTML = '<div class="no-songs" style="padding: 20px;"><i class="fas fa-heart-broken" style="font-size: 24px;"></i><span style="font-size: 12px;">No favorites yet</span></div>';
    } else {
        var html = '';
        favorites.forEach(function (fav) {
            html += '<div class="favorite-item" data-id="' + fav.id + '" data-name="' + fav.name + '">';
            html += '    <i class="fas fa-heart"></i>';
            html += '    <span>' + fav.name + '</span>';
            html += '    <i class="fas fa-times delete-btn"></i>';
            html += '</div>';
        });
        $('#favoriteContent').innerHTML = html;
        
        // Add click handlers for favorite items
        $$('#favoriteContent .favorite-item').forEach(function(item) {
            item.addEventListener('click', function(e) {
                if (!e.target.classList.contains('delete-btn')) {
                    var id = this.dataset.id;
                    var name = this.dataset.name;
                    playSong(id, name);
                    $('#favoritePanel').classList.remove('show');
                }
            });
        });
        
        // Add click handlers for delete buttons
        $$('#favoriteContent .delete-btn').forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                var songItem = this.closest('.favorite-item');
                var id = songItem.dataset.id;
                localStorage.removeItem(FAV_PREFIX + id);
                loadFavorites();
                
                // Update song list favorite icon
                var favBtn = $('#songList .song-item[data-id="' + id + '"] .favorite-btn');
                if (favBtn) {
                    favBtn.classList.remove('active');
                }
            });
        });
    }
}
