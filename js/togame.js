// Game Page JS - Modern UI Version
// Native JavaScript (No jQuery)

// Game data
var games = [
    // Emulator Games
    {
        id: 5,
        name: 'NES Emulator',
        platform: 'NES',
        category: 'emulator',
        image: '../images/nes.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=fceumm'
    },
    {
        id: 6,
        name: 'SNES Emulator',
        platform: 'SNES',
        category: 'emulator',
        image: '../images/snes.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=snes9x'
    },
    {
        id: 7,
        name: 'GBA Emulator',
        platform: 'GBA',
        category: 'emulator',
        image: '../images/gba.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=mgba'
    },
    {
        id: 8,
        name: 'Game Boy Emulator',
        platform: 'GB/GBC',
        category: 'emulator',
        image: '../images/gb.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=gambatte'
    },
    {
        id: 9,
        name: 'N64 Emulator',
        platform: 'N64',
        category: 'emulator',
        image: '../images/n64.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=mupen64plus_next'
    },
    {
        id: 10,
        name: 'PS1 Emulator',
        platform: 'PS1',
        category: 'emulator',
        image: '../images/ps1.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=pcsx_rearmed'
    },
    {
        id: 38,
        name: 'PSX Emulator',
        platform: 'PSX',
        category: 'emulator',
        image: '../images/psx.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=pcsx_rearmed'
    },
    {
        id: 12,
        name: 'Genesis Emulator',
        platform: 'Genesis',
        category: 'emulator',
        image: '../images/genesis.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=genesis_plus_gx'
    },
    {
        id: 13,
        name: 'Master System Emulator',
        platform: 'Master System',
        category: 'emulator',
        image: '../images/mastersystem.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=genesis_plus_gx'
    },
    {
        id: 14,
        name: 'Sega CD Emulator',
        platform: 'Sega CD',
        category: 'emulator',
        image: '../images/segacd.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=genesis_plus_gx'
    },
    {
        id: 15,
        name: 'Saturn Emulator',
        platform: 'Saturn',
        category: 'emulator',
        image: '../images/saturn.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=yabause'
    },
    {
        id: 17,
        name: 'NDS Emulator',
        platform: 'NDS',
        category: 'emulator',
        image: '../images/nds.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=melonds'
    },
    {
        id: 20,
        name: 'Atari 2600 Emulator',
        platform: 'Atari 2600',
        category: 'emulator',
        image: '../images/atari2600.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=stella2014'
    },
    {
        id: 21,
        name: 'Atari 7800 Emulator',
        platform: 'Atari 7800',
        category: 'emulator',
        image: '../images/atari7800.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=prosystem'
    },
    {
        id: 22,
        name: 'Atari 5200 Emulator',
        platform: 'Atari 5200',
        category: 'emulator',
        image: '../images/atari5200.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=a5200'
    },
    {
        id: 23,
        name: 'Atari Jaguar Emulator',
        platform: 'Atari Jaguar',
        category: 'emulator',
        image: '../images/atarijaguar.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=virtualjaguar'
    },
    {
        id: 24,
        name: 'Atari Lynx Emulator',
        platform: 'Atari Lynx',
        category: 'emulator',
        image: '../images/atarilynx.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=handy'
    },
    {
        id: 25,
        name: '3DO Emulator',
        platform: '3DO',
        category: 'emulator',
        image: '../images/3do.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=opera'
    },
    {
        id: 26,
        name: 'Arcade Emulator',
        platform: 'Arcade',
        category: 'emulator',
        image: '../images/arcade.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=fbneo'
    },
    {
        id: 27,
        name: 'MAME 2003 Emulator',
        platform: 'MAME',
        category: 'emulator',
        image: '../images/mame.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=mame2003'
    },
    {
        id: 28,
        name: 'ColecoVision Emulator',
        platform: 'ColecoVision',
        category: 'emulator',
        image: '../images/colecovision.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=gearcoleco'
    },
    {
        id: 29,
        name: 'Commodore 64 Emulator',
        platform: 'C64',
        category: 'emulator',
        image: '../images/c64.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=vice_x64'
    },
    {
        id: 30,
        name: 'Commodore 128 Emulator',
        platform: 'C128',
        category: 'emulator',
        image: '../images/c128.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=vice_x128'
    },
    {
        id: 31,
        name: 'Commodore VIC-20 Emulator',
        platform: 'VIC-20',
        category: 'emulator',
        image: '../images/vic20.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=vice_xvic'
    },
    {
        id: 32,
        name: 'Commodore PET Emulator',
        platform: 'PET',
        category: 'emulator',
        image: '../images/pet.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=vice_xpet'
    },
    {
        id: 33,
        name: 'Commodore Plus/4 Emulator',
        platform: 'Plus/4',
        category: 'emulator',
        image: '../images/plus4.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=vice_xplus4'
    },
    {
        id: 34,
        name: 'Amiga Emulator',
        platform: 'Amiga',
        category: 'emulator',
        image: '../images/amiga.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=puae'
    },
    {
        id: 35,
        name: 'Sega 32X Emulator',
        platform: 'Sega 32X',
        category: 'emulator',
        image: '../images/sega32x.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=picodrive'
    },
    {
        id: 36,
        name: 'Sega Game Gear Emulator',
        platform: 'Game Gear',
        category: 'emulator',
        image: '../images/gamegear.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=genesis_plus_gx'
    },
    {
        id: 37,
        name: 'Virtual Boy Emulator',
        platform: 'Virtual Boy',
        category: 'emulator',
        image: '../images/virtualboy.svg',
        url: '../routes/emulatorjs/emulatorjs.html?core=beetle_vb'
    },
    {
        id: 1,
        name: 'Square Obstacles',
        platform: 'PC',
        category: 'others',
        image: '../gamebox/ball/squareobstacle.png',
        url: '../catalogues/gameplay.html?game=square-obstacles'
    },
    {
        id: 2,
        name: 'Pong',
        platform: 'PC',
        category: 'others',
        image: '../gamebox/bong/bong.png',
        url: '../catalogues/gameplay.html?game=pong'
    },
    {
        id: 3,
        name: 'Breakout',
        platform: 'PC',
        category: 'others',
        image: '../gamebox/breakout/breakout.png',
        url: '../catalogues/gameplay.html?game=breakout'
    },
    {
        id: 4,
        name: 'Tic Tac Toe',
        platform: 'PC',
        category: 'others',
        image: '../gamebox/tic-tac-toe/tictactoe.png',
        url: '../catalogues/gameplay.html?game=tic-tac-toe'
    }
];

var currentCategory = 'all';
var searchQuery = '';

// Helper functions
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

// Render games
function renderGames() {
    var filteredGames = games;
    
    // Filter by category
    if (currentCategory !== 'all') {
        filteredGames = filteredGames.filter(function(game) {
            return game.category === currentCategory;
        });
    }
    
    // Filter by search
    if (searchQuery) {
        filteredGames = filteredGames.filter(function(game) {
            return game.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
        });
    }
    
    var grid = $('#gameGrid');
    grid.innerHTML = '';
    
    if (filteredGames.length === 0) {
        grid.innerHTML = '<div class="no-results"><i class="fas fa-gamepad"></i><p>No games found</p></div>';
        return;
    }
    
    var html = '';
    filteredGames.forEach(function(game) {
        html += '<a href="' + game.url + '" class="game-card">';
        html += '  <div class="game-image-wrapper">';
        html += '    <img class="game-image" src="' + game.image + '" alt="' + game.name + '" onerror="this.src=\'../images/noimage.jpeg\'">';
        html += '  </div>';
        html += '  <div class="game-overlay"></div>';
        html += '  <div class="play-icon"><i class="fas fa-play"></i></div>';
        html += '  <div class="game-info">';
        html += '    <span class="game-platform">' + game.platform + '</span>';
        html += '    <h4 class="game-name">' + game.name + '</h4>';
        html += '  </div>';
        html += '</a>';
    });
    
    grid.innerHTML = html;
}

// Toggle sidebar
function toggleSidebar() {
    var sidebar = $('#sidebar');
    var mainContent = $('#mainContent');
    
    if (window.innerWidth <= 768) {
        sidebar.classList.toggle('show-mobile');
    } else {
        sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('expanded');
    }
}

// Show toast notification
function showToast(message, type) {
    type = type || 'info';
    
    // Remove existing toast
    var existingToast = $('.toast-notification');
    if (existingToast) {
        existingToast.remove();
    }
    
    var toast = document.createElement('div');
    toast.className = 'toast-notification ' + type;
    toast.style.cssText = 'position: fixed; top: 80px; right: 20px; padding: 15px 20px; background: rgba(0,0,0,0.9); border: 2px solid #a3001b; border-radius: 10px; color: #fff; z-index: 9999; display: flex; align-items: center; gap: 10px;';
    toast.innerHTML = '<i class="fas fa-info-circle" style="color: #a3001b"></i><span>' + message + '</span>';
    
    document.body.appendChild(toast);
    
    setTimeout(function() {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(function() {
            toast.remove();
        }, 300);
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Game Page Loaded ===');
    
    // Render initial games
    renderGames();
    
    // Back button
    $('#backBtn').addEventListener('click', function() {
        window.history.back();
    });
    
    // Menu toggle
    $('#menuBtn').addEventListener('click', function() {
        toggleSidebar();
    });
    
    // Toggle sidebar button
    $('#toggleSidebar').addEventListener('click', function() {
        toggleSidebar();
    });
    
    // Category selection
    $$('.category-item').forEach(function(item) {
        item.addEventListener('click', function() {
            $$('.category-item').forEach(function(el) {
                el.classList.remove('active');
            });
            this.classList.add('active');
            currentCategory = this.dataset.category;
            renderGames();
            
            // Hide sidebar on mobile
            if (window.innerWidth <= 768) {
                $('#sidebar').classList.remove('show-mobile');
            }
        });
    });
    
    // Search functionality
    $('#searchInput').addEventListener('keyup', function(e) {
        searchQuery = this.value.trim();
        renderGames();
    });
    
    $('#searchBtn').addEventListener('click', function() {
        searchQuery = $('#searchInput').value.trim();
        renderGames();
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            $('#sidebar').classList.remove('show-mobile');
        }
    });
});
