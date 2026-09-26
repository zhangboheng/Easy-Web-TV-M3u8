// Radio Page JS - Modern UI Version
// Native JavaScript (No jQuery)

// RadioBrowser fetch + mirror failover now live in ../js/apiproxy.js (fetchRadio)

document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    document.querySelectorAll('.tab-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            var targetTab = this.dataset.tab;
            
            // Toggle tab button state
            document.querySelectorAll('.tab-btn').forEach(function(el) {
                el.classList.remove('active');
            });
            this.classList.add('active');
            
            // Switch the content area
            document.querySelectorAll('.tab-content').forEach(function(el) {
                el.classList.remove('active');
            });
            document.getElementById(targetTab).classList.add('active');
            
            // Clear the search box
            document.getElementById('searchInput').value = '';
            // Show all cards
            document.querySelectorAll('.item-card').forEach(function(el) {
                el.style.display = '';
            });
        });
    });
    
    // Search
    document.getElementById('searchInput').addEventListener('input', function() {
        var searchTerm = this.value.toLowerCase();
        var activeTab = document.querySelector('.tab-content.active').id;
        
        document.querySelectorAll('#' + activeTab + ' .item-card').forEach(function(card) {
            var text = card.querySelector('a').textContent.toLowerCase();
            if (text.indexOf(searchTerm) > -1) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    });
    
    // Back button
    document.getElementById('backBtn').addEventListener('click', function() {
        window.history.back();
    });
    
    // Card click navigation - using event delegation
    document.addEventListener('click', function(e) {
        var card = e.target.closest('.item-card');
        if (card) {
            // If the clicked element is the <a> tag itself, let it navigate naturally
            if (e.target.tagName === 'A') {
                return;
            }
            var link = card.querySelector('a');
            if (link) {
                window.location.href = link.getAttribute('href');
            }
        }
    });
    
    // Dynamically load the Countries list
    function loadCountries() {
        fetchRadio('json/countries')
            .then(function(data) {
                var grid = document.getElementById('countries-grid');
                grid.innerHTML = '';
                // Sort by name
                data.sort(function(a, b) {
                    return a.name.localeCompare(b.name);
                });
                for (var i = 0; i < data.length; i++) {
                    var country = data[i];
                    var name = country.name;
                    // Handle the Taiwan name
                    var displayName = name === 'Taiwan Province Of China' ? 'Taiwan' : name;
                    var stationcount = country.stationcount;
                    var link = '../catalogues/radioplay.html?tab=' + encodeURIComponent(name) + '&t=1';
                    var cardHtml = '<div class="item-card">' +
                        '<a href="' + link + '">' + displayName + '</a>' +
                        '<span class="station-count">' + stationcount + ' stations</span>' +
                        '</div>';
                    grid.insertAdjacentHTML('beforeend', cardHtml);
                }
            })
            .catch(function() {
                document.getElementById('countries-grid').innerHTML = '<div class="no-results"><i class="fas fa-exclamation-triangle"></i><p>Failed to load countries list</p></div>';
            });
    }
    
    // Dynamically load the Languages list
    function loadLanguages() {
        fetchRadio('json/languages')
            .then(function(data) {
                var grid = document.getElementById('languages-grid');
                grid.innerHTML = '';
                // Sort by name
                data.sort(function(a, b) {
                    return a.name.localeCompare(b.name);
                });
                for (var i = 0; i < data.length; i++) {
                    var lang = data[i];
                    var name = lang.name;
                    var stationcount = lang.stationcount;
                    var link = '../catalogues/radioplay.html?tab=' + encodeURIComponent(name) + '&t=2';
                    var cardHtml = '<div class="item-card">' +
                        '<a href="' + link + '">' + name + '</a>' +
                        '<span class="station-count">' + stationcount + ' stations</span>' +
                        '</div>';
                    grid.insertAdjacentHTML('beforeend', cardHtml);
                }
            })
            .catch(function() {
                document.getElementById('languages-grid').innerHTML = '<div class="no-results"><i class="fas fa-exclamation-triangle"></i><p>Failed to load languages list</p></div>';
            });
    }
    
    // Dynamically load the Tags (Category) list
    function loadTags() {
        fetchRadio('json/tags')
            .then(function(data) {
                var grid = document.getElementById('category-grid');
                grid.innerHTML = '';
                // Sort by name
                data.sort(function(a, b) {
                    return a.name.localeCompare(b.name);
                });
                for (var i = 0; i < data.length; i++) {
                    var tag = data[i];
                    var name = tag.name;
                    var stationcount = tag.stationcount;
                    var link = '../catalogues/radioplay.html?tab=' + encodeURIComponent(name) + '&t=3';
                    var cardHtml = '<div class="item-card">' +
                        '<a href="' + link + '">' + name + '</a>' +
                        '<span class="station-count">' + stationcount + ' stations</span>' +
                        '</div>';
                    grid.insertAdjacentHTML('beforeend', cardHtml);
                }
            })
            .catch(function() {
                document.getElementById('category-grid').innerHTML = '<div class="no-results"><i class="fas fa-exclamation-triangle"></i><p>Failed to load tags list</p></div>';
            });
    }
    
    // Fetch data on page load
    loadCountries();
    loadLanguages();
    loadTags();
    
    // Error detection
    setInterval(function() {
        var countriesGrid = document.getElementById('countries-grid');
        var languagesGrid = document.getElementById('languages-grid');
        var categoryGrid = document.getElementById('category-grid');
        
        if (countriesGrid.querySelectorAll('.item-card').length === 0 && countriesGrid.querySelectorAll('.loading-spinner').length === 0) {
            if (countriesGrid.querySelectorAll('.no-results').length === 0) {
                loadCountries();
            }
        }
        if (languagesGrid.querySelectorAll('.item-card').length === 0 && languagesGrid.querySelectorAll('.loading-spinner').length === 0) {
            if (languagesGrid.querySelectorAll('.no-results').length === 0) {
                loadLanguages();
            }
        }
        if (categoryGrid.querySelectorAll('.item-card').length === 0 && categoryGrid.querySelectorAll('.loading-spinner').length === 0) {
            if (categoryGrid.querySelectorAll('.no-results').length === 0) {
                loadTags();
            }
        }
    }, 10000);
});
