$(document).ready(function() {
    //Check sser IP belongs to if in China, North Korea or Iran. 
    try {
        getUserIp();
    } catch (e) {
        console.log(e)
    }
    //Toggle Menu
    $('#main').click(function() {
        if ($('#mySidenav').is(':visible')) {
            $(this).css({
                'marginRight': '0'
            });
            $('#mySidenav').hide();
        } else {
            if ($(window).width() > 640) {
                $(this).css({
                    'marginRight': '400px'
                });
            } else {
                $(this).css({
                    'marginRight': '250px'
                });
            }
            $('#mySidenav').show();
        };
    });
    //if user back refresh page
    let link = window.location.href;
    if (link.indexOf('#') > -1) {
        window.location.replace('https://zhangboheng.github.io/Easy-Web-TV-M3u8/');
    }
    //Set attributes to button
    $('.stylebtn:eq(1)').click(function() {
        $(this).attr('title', 'selected');
        $('.stylebtn:eq(3)').removeAttr("title");
    });
    $('.stylebtn:eq(3)').click(function() {
        $(this).attr('title', 'selected');
        $('.stylebtn:eq(1)').removeAttr("title");
    });
    //Select TV Options
    $('.stylebtn:eq(0)').on('click', function() {
        if ($('input[name=radioName]:checked', '#selectform').val() == 1 && $('.stylebtn:eq(1)').attr('title') == 'selected') {
            window.location.href = "routes/countries.html";
        } else if ($('input[name=radioName]:checked', '#selectform').val() == 2 && $('.stylebtn:eq(1)').attr('title') == 'selected') {
            window.location.href = "routes/language.html";
        } else if ($('input[name=radioName]:checked', '#selectform').val() == 3 && $('.stylebtn:eq(1)').attr('title') == 'selected') {
            window.location.href = "routes/category.html";
        } else if ($('input[name=radioName]:checked', '#selectform').val() == 1 && $('.stylebtn:eq(3)').attr('title') == 'selected') {
            window.location.href = "routes/radiocountry.html";
        } else if ($('input[name=radioName]:checked', '#selectform').val() == 2 && $('.stylebtn:eq(3)').attr('title') == 'selected') {
            window.location.href = "routes/radiolanguage.html";
        } else if ($('input[name=radioName]:checked', '#selectform').val() == 3 && $('.stylebtn:eq(3)').attr('title') == 'selected') {
            window.location.href = "routes/radiotag.html";
        }
    });

    //Check sensetive content if or not
    $('#adultban').on('change', function() {
        if ($(window).width() > 768) {
            if ($(this).is(':checked')) {
                $('.mobile').append(`<li><img src="images/sex.svg" /><dd><a href="routes/adult.html"><button class="stylebtn">Enter</button></a></dd><p>Porn Videos...</p></li>`);
            } else {
                $('.mobile li:eq(7)').remove();
            }
        } else {
            if ($(this).is(':checked')) {
                $('.mobile').append(`<li><img src="images/sex.svg" /><dd><a href="routes/adult.html"><button class="stylebtn">Enter</button></a></dd><p>Porn Videos...</p></li>`);
            } else {
                $('.mobile li:eq(7)').remove();
            }
        }
    });
});

//Get User IP
function getUserIp() {
    var request = new XMLHttpRequest();

    request.open('GET', 'https://api.ipdata.co/?api-key=7910661894e758448cbebb4a636485005498427178dea6ef0e911311');

    request.setRequestHeader('Accept', 'application/json');

    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            let country = JSON.parse(this.responseText).country_code;
            if (country.toLowerCase() == 'cn' || country.toLowerCase() == 'kp') {
                $('#mySidenav a:eq(0)').hide();
            }
        } else {
            getCoordintes();
        }
    };
    request.send();
}
// Step 1: Get user coordinates
function getCoordintes() {
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    function success(pos) {
        var crd = pos.coords;
        var lat = crd.latitude.toString();
        var lng = crd.longitude.toString();
        var coordinates = [lat, lng];
        var xhr = new XMLHttpRequest();
        var lat = coordinates[0];
        var lng = coordinates[1];

        // Paste your LocationIQ token below.
        xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.dd067483fe694f72f04c0fdd2d312091&lat=" + lat + "&lon=" + lng + "&format=json", true);
        xhr.send();
        xhr.onreadystatechange = processRequest;

        function processRequest(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                var response = JSON.parse(xhr.responseText);
                var city = response.address;
                if (city.country_code == 'cn' || city.country_code == 'kp') {
                    $('#mySidenav a:eq(0)').hide();
                };
            }
        }
        return;
    }

    function error(err) {
        console.log(err);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);
}