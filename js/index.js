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
    //Select TV Options
    $('.stylebtn:eq(0)').on('click', function() {
        if ($('input[name=radioName]:checked', '#selectform').val() == 1) {
            window.location.href = "routes/countries.html";
        } else if ($('input[name=radioName]:checked', '#selectform').val() == 2) {
            window.location.href = "routes/language.html";
        } else {
            window.location.href = "routes/category.html";
        }
    });
    //Check sensetive content if or not
    $('#adultban').on('change', function() {
        if ($(window).width() > 640) {
            if ($(this).is(':checked')) {
                $('.mobile').append(`<li><img src="images/sex.svg" /><dd><a href="routes/adult.html"><button class="stylebtn">Enter</button></a></dd><p>Porn Videos...</p></li>`);
                $('#four_flash .flashBg ul.mobile li').css({
                    'width': '32%'
                })
            } else {
                $('.mobile li:eq(2)').remove();
                $('#four_flash .flashBg ul.mobile li').css({
                    'width': '48%'
                })
            }
        } else {
            if ($(this).is(':checked')) {
                $('.mobile').append(`<li><img src="images/sex.svg" /><dd><a href="routes/adult.html"><button class="stylebtn">Enter</button></a></dd><p>Porn Videos...</p></li>`);
            } else {
                $('.mobile li:eq(2)').remove();
            }
        }
    });
    //Change language to show
    $('#languages').on('change', function() {
        let lan = $(this).val();
        if (lan == 'en-US') {
            $('.stylebtn').text('Enter');
            $('.mobile p:eq(0)').text('Watch 6000+ TV Channels...');
            $('.mobile p:eq(1)').text('Watch Movies, Series, Animes...');
            $('h2').text('Select');
            $('#selectform input:eq(0)').next().text('Countries');
            $('#selectform input:eq(1)').next().text('Lanuages');
            $('#selectform input:eq(2)').next().text('Category');
            $('#mySidenav a:eq(0)').find('span').text('Sensitive Content');
            $('#mySidenav a:eq(1)').find('span').text('Languages');
            $('#mySidenav a:eq(2)').find('span').text('Version');
        } else if (lan == 'zh') {
            $('.stylebtn').text('进入');
            $('.mobile p:eq(0)').text('观看6000多个电视直播台......');
            $('.mobile p:eq(1)').text('观看电影，电视剧，动漫......');
            $('h2').text('选择');
            $('#selectform input:eq(0)').next().text('国家');
            $('#selectform input:eq(1)').next().text('语言');
            $('#selectform input:eq(2)').next().text('分类');
            $('#mySidenav a:eq(0)').find('span').text('敏感内容');
            $('#mySidenav a:eq(1)').find('span').text('语言');
            $('#mySidenav a:eq(2)').find('span').text('版本');
        } else if (lan == 'zh-CN') {
            $('.stylebtn').text('进入');
            $('.mobile p:eq(0)').text('观看6000多个电视直播台......');
            $('.mobile p:eq(1)').text('观看电影，电视剧，动漫......');
            $('h2').text('选择');
            $('#selectform input:eq(0)').next().text('国家');
            $('#selectform input:eq(1)').next().text('语言');
            $('#selectform input:eq(2)').next().text('分类');
            $('#mySidenav a:eq(0)').find('span').text('敏感内容');
            $('#mySidenav a:eq(1)').find('span').text('语言');
            $('#mySidenav a:eq(2)').find('span').text('版本');
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