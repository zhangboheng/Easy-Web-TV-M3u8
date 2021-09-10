    //Set a array to store source links
    var radiosource = ['https://de1.api.radio-browser.info/', 'https://fr1.api.radio-browser.info/', 'https://nl1.api.radio-browser.info/'];
    //Set a random integer
    var rand = Math.floor(Math.random() * radiosource.length);
    //Get next page number
    var key = decodeURIComponent(window.location.href).split('=')[1];
    //Set next page array
    var radiory = ['', 'json/countries', 'json/languages', 'json/tags'];
    //Set Page Title
    var word = ['', 'Countries', 'Languages', 'Category']
    $(document).ready(function() {
        $('title').html(word[Number(key)] + ' Channels');
        $('#left h3').empty();
        $('#left h3').html(word[Number(key)] + ' Channels');
        let count = $.getJSON(radiosource[rand] + radiory[Number(key)]);
        $.when(count).done(function(data) {
            $('#menu').empty();
            for (let i in data) {
                $('#menu').append(`<li><p><a href='../catalogues/radioplay.html?tab=${data[i].name}&t=${key}'>${data[i].name == 'Taiwan Province Of China'? 'Taiwan' : data[i].name}(${data[i].stationcount})</a></p></li>`);
            }
        });
        setInterval(function() {
            if ($('#menu li').length == 0 || $('#menu li').length == 1) {
                alert('Can\' t load list now, Please refresh the page to change source links')
            }
        }, 10000);
    });