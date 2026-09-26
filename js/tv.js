// TV Channels Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var targetTab = this.getAttribute('data-tab');
            
            // Toggle tab button state
            document.querySelectorAll('.tab-btn').forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            // Switch the content area
            document.querySelectorAll('.tab-content').forEach(function(content) {
                content.classList.remove('active');
            });
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // Search
    var searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            var searchTerm = this.value.toLowerCase();
            var activeTab = document.querySelector('.tab-content.active');
            
            if (activeTab) {
                activeTab.querySelectorAll('.item-card').forEach(function(card) {
                    var text = card.querySelector('a').textContent.toLowerCase();
                    if (text.indexOf(searchTerm) > -1) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    }
    
    // Back button
    var backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.history.back();
        });
    }
    
    // Card click navigation - using event delegation
    document.addEventListener('click', function(e) {
        var card = e.target.closest('.item-card');
        if (card) {
            // If the clicked element is the <a> tag itself, let it navigate naturally
            if (e.target.tagName === 'A') {
                return;
            }
            var link = card.querySelector('a');
            if (link && link.getAttribute('href')) {
                window.location.href = link.getAttribute('href');
            }
        }
    });
    
    // Dynamically load the Countries list
    function loadCountries() {
        fetch('https://iptv-org.github.io/api/countries.json')
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                var grid = document.getElementById('countries-grid');
                grid.innerHTML = '';
                // Sort by name
                data.sort(function(a, b) {
                    return a.name.localeCompare(b.name);
                });
                data.forEach(function(country) {
                    var code = country.code.toLowerCase();
                    var name = country.name;
                    var flag = country.flag;
                    var link = '../catalogues/tvplay.html?type=countries&key=' + code + '&title=' + encodeURIComponent(name);
                    var card = document.createElement('div');
                    card.className = 'item-card';
                    card.innerHTML = '<span class="flag-icon">' + flag + '</span><a href="' + link + '">' + name + '</a>';
                    grid.appendChild(card);
                });
            })
            .catch(function() {
                document.getElementById('countries-grid').innerHTML = '<div class="no-results"><i class="fas fa-exclamation-triangle"></i><p>Failed to load countries list</p></div>';
            });
    }
    
    // Dynamically load the Languages list
    function loadLanguages() {
        fetch('https://iptv-org.github.io/api/languages.json')
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                var grid = document.getElementById('languages-grid');
                grid.innerHTML = '';
                // Sort by name
                data.sort(function(a, b) {
                    return a.name.localeCompare(b.name);
                });
                data.forEach(function(lang) {
                    var code = lang.code;
                    var name = lang.name;
                    var link = '../catalogues/tvplay.html?type=languages&key=' + code + '&title=' + encodeURIComponent(name);
                    var card = document.createElement('div');
                    card.className = 'item-card';
                    card.innerHTML = '<i class="fas fa-comments card-icon"></i><a href="' + link + '">' + name + '</a>';
                    grid.appendChild(card);
                });
            })
            .catch(function() {
                document.getElementById('languages-grid').innerHTML = '<div class="no-results"><i class="fas fa-exclamation-triangle"></i><p>Failed to load languages list</p></div>';
            });
    }
    
    // Dynamically load the Categories list
    function loadCategories() {
        fetch('https://iptv-org.github.io/api/categories.json')
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                var grid = document.getElementById('category-grid');
                grid.innerHTML = '';
                // Sort by name
                data.sort(function(a, b) {
                    return a.name.localeCompare(b.name);
                });
                // Category icon mapping
                var iconMap = {
                    'animation': 'fa-film',
                    'auto': 'fa-car',
                    'business': 'fa-briefcase',
                    'classic': 'fa-clock',
                    'comedy': 'fa-laugh',
                    'cooking': 'fa-utensils',
                    'culture': 'fa-palette',
                    'documentary': 'fa-book',
                    'education': 'fa-graduation-cap',
                    'entertainment': 'fa-theater-masks',
                    'family': 'fa-users',
                    'general': 'fa-tv',
                    'interactive': 'fa-gamepad',
                    'kids': 'fa-child',
                    'legislative': 'fa-landmark',
                    'lifestyle': 'fa-heart',
                    'movies': 'fa-film',
                    'music': 'fa-music',
                    'news': 'fa-newspaper',
                    'outdoor': 'fa-tree',
                    'relax': 'fa-spa',
                    'religious': 'fa-church',
                    'science': 'fa-flask',
                    'series': 'fa-play-circle',
                    'shopping': 'fa-shopping-cart',
                    'sports': 'fa-futbol',
                    'tech': 'fa-microchip',
                    'travel': 'fa-plane',
                    'weather': 'fa-cloud-sun',
                    'undefined': 'fa-ellipsis-h'
                };
                data.forEach(function(cat) {
                    var id = cat.id;
                    var name = cat.name;
                    var icon = iconMap[id] || 'fa-folder';
                    var link = '../catalogues/tvplay.html?type=categories&key=' + id + '&title=' + encodeURIComponent(name);
                    var card = document.createElement('div');
                    card.className = 'item-card';
                    card.setAttribute('data-category', id);
                    card.innerHTML = '<i class="fas ' + icon + ' card-icon"></i><a href="' + link + '">' + name + '</a>';
                    grid.appendChild(card);
                });
            })
            .catch(function() {
                document.getElementById('category-grid').innerHTML = '<div class="no-results"><i class="fas fa-exclamation-triangle"></i><p>Failed to load categories list</p></div>';
            });
    }
    
    // Fetch data on page load
    loadCountries();
    loadLanguages();
    loadCategories();
});
