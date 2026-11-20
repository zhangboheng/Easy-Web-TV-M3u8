// Game Play Page JS
// Native JavaScript (No jQuery)

// Game data mapping
var games = {
    'square-obstacles': {
        name: 'Square Obstacles',
        category: 'arcade',
        url: '../gamebox/ball/gameball.html'
    },
    'pong': {
        name: 'Pong',
        category: 'classic',
        url: '../gamebox/bong/gamebong.html'
    },
    'breakout': {
        name: 'Breakout',
        category: 'arcade',
        url: '../gamebox/breakout/gamebreakout.html'
    },
    'tic-tac-toe': {
        name: 'Tic Tac Toe',
        category: 'puzzle',
        url: '../gamebox/tic-tac-toe/tic-tac-toe-game.html'
    }
};

// Get URL parameters
function getUrlParams() {
    var params = {};
    var search = window.location.search.substring(1);
    if (search) {
        var pairs = search.split('&');
        for (var i = 0; i < pairs.length; i++) {
            var pair = pairs[i].split('=');
            params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }
    }
    return params;
}

// Load game
function loadGame() {
    var params = getUrlParams();
    var gameId = params.game || '';
    console.info('Loading game:', gameId);
    // Default to first game if not found
    if (!gameId || !games[gameId]) {
        gameId = Object.keys(games)[0];
    }
    
    var game = games[gameId];
    
    // Update UI
    var gameTitle = document.getElementById('gameTitle');
    var gameCategory = document.getElementById('gameCategory');
    if (gameTitle) gameTitle.textContent = game.name;
    if (gameCategory) gameCategory.textContent = game.category;
    document.title = game.name + ' - Easy Web TV';
    
    // Load game in iframe
    var iframe = document.getElementById('gameFrame');
    if (iframe) iframe.src = game.url;
}

// Toggle fullscreen
function toggleFullscreen() {
    var container = document.getElementById('gameplayContainer');
    var fullscreenBtn = document.getElementById('fullscreenBtn');
    var icon = fullscreenBtn ? fullscreenBtn.querySelector('i') : null;
    var span = fullscreenBtn ? fullscreenBtn.querySelector('span') : null;
    
    if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
        if (icon) {
            icon.classList.remove('fa-expand');
            icon.classList.add('fa-compress');
        }
        if (span) span.textContent = 'Exit';
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        if (icon) {
            icon.classList.remove('fa-compress');
            icon.classList.add('fa-expand');
        }
        if (span) span.textContent = 'Fullscreen';
    }
}

// Restart game
function restartGame() {
    var iframe = document.getElementById('gameFrame');
    var loadingOverlay = document.getElementById('loadingOverlay');
    if (iframe && iframe.src) {
        iframe.src = iframe.src;
        if (loadingOverlay) loadingOverlay.classList.remove('hidden');
    }
}

// Update fullscreen button UI
function updateFullscreenButton() {
    var fullscreenBtn = document.getElementById('fullscreenBtn');
    var icon = fullscreenBtn ? fullscreenBtn.querySelector('i') : null;
    var span = fullscreenBtn ? fullscreenBtn.querySelector('span') : null;
    
    if (icon) {
        icon.classList.remove('fa-compress');
        icon.classList.add('fa-expand');
    }
    if (span) span.textContent = 'Fullscreen';
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Game Play Page Loaded ===');
    
    // Load game
    loadGame();
    
    // Back button - go to games page
    var backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = '../routes/game.html';
        });
    }
    
    // Home button - go to home page
    var homeBtn = document.getElementById('homeBtn');
    if (homeBtn) {
        homeBtn.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    }
    
    // Restart button
    var restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', function() {
            restartGame();
        });
    }
    
    // Fullscreen button
    var fullscreenBtn = document.getElementById('fullscreenBtn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', function() {
            toggleFullscreen();
        });
    }
    
    // Listen for fullscreen changes
    document.addEventListener('fullscreenchange', function() {
        if (!document.fullscreenElement) {
            updateFullscreenButton();
        }
    });
    
    document.addEventListener('webkitfullscreenchange', function() {
        if (!document.webkitFullscreenElement) {
            updateFullscreenButton();
        }
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // ESC - exit fullscreen or go back
        if (e.key === 'Escape') {
            if (document.fullscreenElement) {
                toggleFullscreen();
            }
        }
        // R - restart
        if (e.key === 'r' || e.key === 'R') {
            restartGame();
        }
        // F - fullscreen
        if (e.key === 'f' || e.key === 'F') {
            toggleFullscreen();
        }
    });
});
