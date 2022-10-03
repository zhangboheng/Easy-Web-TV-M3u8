$(document).ready(function() {
    //Check sser IP belongs to if in China, North Korea
    if (window.localStorage.getItem('bannedcountries') != 'true') {
        getUserIp();
    } else {
        $('#mySidenav div:eq(0)').hide();
    }
    //Append select language options
    $("#languages").append(`
    <option value="selectbox">==Select==</option>
    <option value="af">Afrikaans</option>
    <option value="sq">Albanian - shqip</option>
    <option value="am">Amharic - አማርኛ</option>
    <option value="ar">Arabic - العربية</option>
    <option value="hy">Armenian - հայերեն</option>
    <option value="az">Azerbaijani - azərbaycan dili</option>
    <option value="eu">Basque - euskara</option>
    <option value="be">Belarusian - беларуская</option>
    <option value="bn">Bangla - বাংলা</option>
    <option value="bs">Bosnian - bosanski</option>
    <option value="bg">Bulgarian - български</option>
    <option value="ca">Catalan - català</option>
    <option value="zh">Chinese - 中文</option>
    <option value="zh-HK">Chinese (Hong Kong) - 中文（香港）</option>
    <option value="zh-CN">Chinese (Simplified) - 中文（简体）</option>
    <option value="zh-TW">Chinese (Traditional) - 中文（繁體）</option>
    <option value="co">Corsican</option>
    <option value="hr">Croatian - hrvatski</option>
    <option value="cs">Czech - čeština</option>
    <option value="da">Danish - dansk</option>
    <option value="nl">Dutch - Nederlands</option>
    <option value="en">English</option>
    <option value="en-AU">English (Australia)</option>
    <option value="en-CA">English (Canada)</option>
    <option value="en-IN">English (India)</option>
    <option value="en-NZ">English (New Zealand)</option>
    <option value="en-ZA">English (South Africa)</option>
    <option value="en-GB">English (United Kingdom)</option>
    <option value="en-US">English (United States)</option>
    <option value="eo">Esperanto - esperanto</option>
    <option value="et">Estonian - eesti</option>
    <option value="fil">Filipino</option>
    <option value="fi">Finnish - suomi</option>
    <option value="fr">French - français</option>
    <option value="fr-CA">French (Canada) - français (Canada)</option>
    <option value="fr-FR">French (France) - français (France)</option>
    <option value="fr-CH">French (Switzerland) - français (Suisse)</option>
    <option value="gl">Galician - galego</option>
    <option value="ka">Georgian - ქართული</option>
    <option value="de">German - Deutsch</option>
    <option value="de-AT">German (Austria) - Deutsch (Österreich)</option>
    <option value="de-DE">German (Germany) - Deutsch (Deutschland)</option>
    <option value="de-LI">German (Liechtenstein) - Deutsch (Liechtenstein)</option>
    <option value="de-CH">German (Switzerland) - Deutsch (Schweiz)</option>
    <option value="el">Greek - Ελληνικά</option>
    <option value="gu">Gujarati - ગુજરાતી</option>
    <option value="ha">Hausa</option>
    <option value="haw">Hawaiian - ʻŌlelo Hawaiʻi</option>
    <option value="he">Hebrew - עברית</option>
    <option value="hi">Hindi - हिन्दी</option>
    <option value="hu">Hungarian - magyar</option>
    <option value="is">Icelandic - íslenska</option>
    <option value="id">Indonesian - Indonesia</option>
    <option value="ga">Irish - Gaeilge</option>
    <option value="it">Italian - italiano</option>
    <option value="it-IT">Italian (Italy) - italiano (Italia)</option>
    <option value="it-CH">Italian (Switzerland) - italiano (Svizzera)</option>
    <option value="ja">Japanese - 日本語</option>
    <option value="kn">Kannada - ಕನ್ನಡ</option>
    <option value="kk">Kazakh - қазақ тілі</option>
    <option value="km">Khmer - ខ្មែរ</option>
    <option value="ko">Korean - 한국어</option>
    <option value="ku">Kurdish - Kurdî</option>
    <option value="ky">Kyrgyz - кыргызча</option>
    <option value="lo">Lao - ລາວ</option> 
    <option value="la">Latin</option>
    <option value="lv">Latvian - latviešu</option>
    <option value="lt">Lithuanian - lietuvių</option>
    <option value="mk">Macedonian - македонски</option>
    <option value="ms">Malay - Bahasa Melayu</option>
    <option value="ml">Malayalam - മലയാളം</option>
    <option value="mt">Maltese - Malti</option>
    <option value="mr">Marathi - मराठी</option>
    <option value="mn">Mongolian - монгол</option>
    <option value="ne">Nepali - नेपाली</option>
    <option value="no">Norwegian - norsk</option>
    <option value="nb">Norwegian Bokmål - norsk bokmål</option>
    <option value="nn">Norwegian Nynorsk - nynorsk</option>
    <option value="od">Odia</option>
    <option value="ps">Pashto - پښتو</option>
    <option value="fa">Persian - فارسی</option>
    <option value="pl">Polish - polski</option>
    <option value="pt">Portuguese - português</option>
    <option value="pt-BR">Portuguese (Brazil) - português (Brasil)</option>
    <option value="pt-PT">Portuguese (Portugal) - português (Portugal)</option>
    <option value="pa">Punjabi - ਪੰਜਾਬੀ</option>
    <option value="ro">Romanian - română</option>
    <option value="mo">Romanian (Moldova) - română (Moldova)</option>
    <option value="rm">Romansh - rumantsch</option>
    <option value="ru">Russian - русский</option>
    <option value="gd">Scottish Gaelic</option>
    <option value="sr">Serbian - српски</option> 
    <option value="sn">Shona - chiShona</option>
    <option value="sd">Sindhi</option>
    <option value="si">Sinhala - සිංහල</option>
    <option value="sk">Slovak - slovenčina</option>
    <option value="sl">Slovenian - slovenščina</option>
    <option value="so">Somali - Soomaali</option>
    <option value="st">Southern Sotho</option>
    <option value="es">Spanish - español</option>
    <option value="es-AR">Spanish (Argentina) - español (Argentina)</option>
    <option value="es-419">Spanish (Latin America) - español (Latinoamérica)</option>
    <option value="es-MX">Spanish (Mexico) - español (México)</option>
    <option value="es-ES">Spanish (Spain) - español (España)</option>
    <option value="es-US">Spanish (United States) - español (Estados Unidos)</option>
    <option value="su">Sundanese</option>
    <option value="sw">Swahili - Kiswahili</option> 
    <option value="sv">Swedish - svenska</option>
    <option value="tg">Tajik - тоҷикӣ</option>
    <option value="ta">Tamil - தமிழ்</option> 
    <option value="tt">Tatar</option>
    <option value="te">Telugu - తెలుగు</option>
    <option value="th">Thai - ไทย</option>
    <option value="tr">Turkish - Türkçe</option>
    <option value="tk">Turkmen</option>
    <option value="uk">Ukrainian - українська</option>
    <option value="ur">Urdu - اردو</option>
    <option value="ug">Uyghur</option>
    <option value="uz">Uzbek - o‘zbek</option>
    <option value="vi">Vietnamese - Tiếng Việt</option>
    <option value="cy">Welsh - Cymraeg</option>
    <option value="fy">Western Frisian</option>
    <option value="xh">Xhosa</option>
    <option value="yi">Yiddish</option>
    <option value="yo">Yoruba - Èdè Yorùbá</option>
    <option value="zu">Zulu - isiZulu</option>
    `);
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
    if (link.indexOf('popupbox') > -1) {
        window.location.replace('https://zhangboheng.github.io/Easy-Web-TV-M3u8/');
    }
    //Set attributes to button
    $('.stylebtn:eq(2)').click(function() {
        $(this).attr('title', 'selected');
        $('.stylebtn:eq(4)').removeAttr("title");
    });
    $('.stylebtn:eq(4)').click(function() {
        $(this).attr('title', 'selected');
        $('.stylebtn:eq(2)').removeAttr("title");
    });
    //Select TV Options
    $('.stylebtn:eq(0)').on('click', function() {
        if ($('input[name=radioName]:checked', '#selectform').val() == 1 && $('.stylebtn:eq(2)').attr('title') == 'selected') {
            window.location.href = "routes/countries.html";
        } else if ($('input[name=radioName]:checked', '#selectform').val() == 2 && $('.stylebtn:eq(2)').attr('title') == 'selected') {
            window.location.href = "routes/language.html";
        } else if ($('input[name=radioName]:checked', '#selectform').val() == 3 && $('.stylebtn:eq(2)').attr('title') == 'selected') {
            window.location.href = "routes/category.html";
        } else if ($('input[name=radioName]:checked', '#selectform').val() == 1 && $('.stylebtn:eq(4)').attr('title') == 'selected') {
            window.location.href = "routes/radio.html?t=1";
        } else if ($('input[name=radioName]:checked', '#selectform').val() == 2 && $('.stylebtn:eq(4)').attr('title') == 'selected') {
            window.location.href = "routes/radio.html?t=2";
        } else if ($('input[name=radioName]:checked', '#selectform').val() == 3 && $('.stylebtn:eq(4)').attr('title') == 'selected') {
            window.location.href = "routes/radio.html?t=3";
        }
    });
    //Set adult content default
    if (window.localStorage.getItem('bannedcountries') != 'true' && window.localStorage.getItem('adult') == 'open') {
        $('#adultban').prop('checked', true);
        $('.mobile').append(`<li><img src="images/sex.svg" /><dd><a href="routes/adult.html"><button class="stylebtn">Enter</button></a></dd><p>Porn Videos...</p></li>`);
    }
    //Check sensetive content if or not
    $('#adultban').on('change', function() {
        if ($(this).is(':checked')) {
            if (confirm("Are you over 18 years old?")) {
                $('.mobile').append(`<li><img src="images/sex.svg" /><dd><a href="routes/adult.html"><button class="stylebtn">Enter</button></a></dd><p>Porn Videos...</p></li>`);
                window.localStorage.setItem('adult', 'open');
            } else {
                $(this).prop('checked', false);
            }
        } else {
            $('.mobile li:eq(7)').remove();
            localStorage.removeItem('adult');
        }
    });
    //Clear cache
    $('.cachebtn:eq(0)').click(function() {
        if (confirm("Are you sure clear the cache?")) {
            localStorage.clear();
        } else {
            console.log("Not do nothing...");
        }
    });
    //Append log history
    $('.scrollidbar').empty();
    $('.scrollidbar').append(`
        <p>[2021-10-09] V8.2.0 release support to play one game</p>
        <p>[2021-10-06] V8.1.1 release Add about feature and fixed some bugs</p>
        <p>[2021-10-02] V8.1.0 release Add source control feature</p>
        <p>[2021-10-01] Delete one invalid manga source and add log history</p>
        <p>[2021-09-16] V8.0.0 release support to listen to music online</p>
        <p>[2021-09-15] V7.0.0 release support to read manga books</p>
        <p>[2021-09-13] V6.0.0 release support to read novel books</p>
        <p>[2021-09-08] V5.0.0 release support to listen 28000+ radio stations</p>
        <p>[2021-09-04] V4.0.0 release support to watch movies, series, cartoon...</p>
        <p>[2021-08-31] V3.0.0 release support to watch IPTV</p>
        <p>[2021-08-29] V2.0.0 release support to search IPTV channels</p>
        <p>[2021-08-29] V1.1.0 release pure code</p>
        <p>[2021-08-28] V1.0.3 release support to remark favorite channels</p>
        <p>[2021-04-21] V1.0.0 release</p>
    `);
    //Show QRcode
    $('.circlescon li:eq(3)').click(function() {
        $('.qrcode').toggle(500);
    });
    $('.circlescon li:eq(3)').mouseleave(function() {
        $('.qrcode').hide(500);
    });
});
//Go to source nextpage
function goToSource() {
    if ($('input[name="sourceName"]:checked').val() == 1) {
        $('#sourceitem div').remove();
        $('#sourceitem button').remove();
        $('#sourceitem').append(`
            <div id="selectform" style="display:flex;">
                <input type="checkbox" name="movie" value="39ys" checked />
                <label for="movie"> 39影视</label><br />
                <input type="checkbox" name="movie" value="wlys" checked />
                <label for="movie"> 卧龙影视</label><br />
                <input type="checkbox" name="movie" value="phzy" checked />
                <label for="movie"> 飘花资源</label><br />
            </div>
            <div id="selectform" style="display:flex;">
                <input type="checkbox" name="movie" value="kby" checked />
                <label for="movie"> 快播云</label><br />
                <input type="checkbox" name="movie" value="tky" checked />
                <label for="movie"> 天空云</label><br />
                <input type="checkbox" name="movie" value="bjy" checked />
                <label for="movie"> 八戒云</label><br />
            </div>
            <button class="stylebtn" onclick="returnSource()"><img src="./images/return.svg" style="width:30px;"></button>
        `);
        let ms = window.localStorage.getItem('movie').split(",");
        let arr = ["39ys", "hnzy", "88zy", "kby", "tky", "bjy"];
        let lst = arr.filter(x => ms.includes(x)).map(x => arr.indexOf(x));
        let cat = arr.filter(x => !ms.includes(x)).map(x => arr.indexOf(x));
        for (let i of lst) {
            $(`input[name="movie"]:eq(${i})`).prop('checked', true);
        }
        for (let i of cat) {
            $(`input[name="movie"]:eq(${i})`).prop('checked', false);
        }
    } else if ($('input[name="sourceName"]:checked').val() == 2) {
        $('#sourceitem div').remove();
        $('#sourceitem button').remove();
        $('#sourceitem').append(`
            <div id="selectform" style="display:flex;">
                <input type="checkbox" name="novel" value="novelonlinefull" checked />
                <label for="novel"> novelonlinefull</label><br />
                <input type="checkbox" name="novel" value="95sb" checked />
                <label for="novel"> 95书包</label><br />
            </div>
            <button class="stylebtn" onclick="returnSource()"><img src="./images/return.svg" style="width:30px;"></button>
        `);
        let ms = window.localStorage.getItem('novel').split(",");
        let arr = ["novelonlinefull", "95sb"];
        let lst = arr.filter(x => ms.includes(x)).map(x => arr.indexOf(x));
        let cat = arr.filter(x => !ms.includes(x)).map(x => arr.indexOf(x));
        for (let i of lst) {
            $(`input[name="novel"]:eq(${i})`).prop('checked', true);
        }
        for (let i of cat) {
            $(`input[name="novel"]:eq(${i})`).prop('checked', false);
        }
    } else if ($('input[name="sourceName"]:checked').val() == 3) {
        $('#sourceitem div').remove();
        $('#sourceitem button').remove();
        $('#sourceitem').append(`
            <div id="selectform" style="display:flex;">
                <input type="checkbox" name="manga" value="mangabuddy" checked />
                <label for="manga"> mangabuddy</label><br />
                <input type="checkbox" name="manga" value="mangadex" checked />
                <label for="manga"> mangadex</label><br />
            </div>
            <div id="selectform" style="display:flex;">
                <input type="checkbox" name="manga" value="dmmh" checked>
                <label for="manga"> 耽美漫画(PC端)</label><br />
            </div>
            <button class="stylebtn" onclick="returnSource()"><img src="./images/return.svg" style="width:30px;"></button>
        `);
        let ms = window.localStorage.getItem('manga').split(",");
        let arr = ["mangabuddy", "mangadex", "dmmh"];
        let lst = arr.filter(x => ms.includes(x)).map(x => arr.indexOf(x));
        let cat = arr.filter(x => !ms.includes(x)).map(x => arr.indexOf(x));
        for (let i of lst) {
            $(`input[name="manga"]:eq(${i})`).prop('checked', true);
        }
        for (let i of cat) {
            $(`input[name="manga"]:eq(${i})`).prop('checked', false);
        }
    } else if ($('input[name="sourceName"]:checked').val() == 4) {
        $('#sourceitem div').remove();
        $('#sourceitem button').remove();
        $('#sourceitem').append(`
            <div id="selectform" style="display:flex;">
                <input type="checkbox" name="music" value="wymusic" checked>
                <label for="music"> 网易云音乐</label><br />
            </div>
            <button class="stylebtn" onclick="returnSource()"><img src="./images/return.svg" style="width:30px;"></button>
        `);
        let ms = window.localStorage.getItem('music').split(",");
        let arr = ["wymusic"];
        let lst = arr.filter(x => ms.includes(x)).map(x => arr.indexOf(x));
        let cat = arr.filter(x => !ms.includes(x)).map(x => arr.indexOf(x));
        for (let i of lst) {
            $(`input[name="music"]:eq(${i})`).prop('checked', true);
        }
        for (let i of cat) {
            $(`input[name="music"]:eq(${i})`).prop('checked', false);
        }
    } else if ($('input[name="sourceName"]:checked').val() == 5) {
        $('#sourceitem div').remove();
        $('#sourceitem button').remove();
        $('#sourceitem').append(`
            <div id="selectform" style="display:flex;">
                <input type="checkbox" name="porn" value="zmwzy" checked>
                <label for="porn"> 字幕网</label><br />
                <input type="checkbox" name="porn" value="fedzy" checked>
                <label for="porn"> 富二代</label><br />
                <input type="checkbox" name="porn" value="javmy" checked>
                <label for="porn"> JAV名优</label><br />
            </div>
            <div id="selectform" style="display:flex;">
                <input type="checkbox" name="porn" value="hyzy" checked>
                <label for="porn"> 环亚</label><br />
                <input type="checkbox" name="porn" value="sszy" checked>
                <label for="porn"> 色色</label><br />
                <input type="checkbox" name="porn" value="jjzy" checked>
                <label for="porn"> 玖玖</label><br />
            </div>
            <div id="selectform" style="display:flex;">
                <input type="checkbox" name="porn" value="lsnzy" checked>
                <label for="porn"> 狼少年</label><br />
                <input type="checkbox" name="porn" value="bttzy" checked>
                <label for="porn"> 博天堂</label><br />
                <input type="checkbox" name="porn" value="llzy" checked>
                <label for="porn"> 利来</label><br />
            </div>
            <button class="stylebtn" onclick="returnSource()"><img src="./images/return.svg" style="width:30px;"></button>
        `);
        let ms = window.localStorage.getItem('porn').split(",");
        let arr = ["zmwzy", "fedzy", "javmy", "hyzy", "sszy", "jjzy", "lsnzy", "bttzy", "llzy"];
        let lst = arr.filter(x => ms.includes(x)).map(x => arr.indexOf(x));
        let cat = arr.filter(x => !ms.includes(x)).map(x => arr.indexOf(x));
        for (let i of lst) {
            $(`input[name="porn"]:eq(${i})`).prop('checked', true);
        }
        for (let i of cat) {
            $(`input[name="porn"]:eq(${i})`).prop('checked', false);
        }
    }
}
//Return source homepage
function returnSource() {
    var arr = [];
    $('input[name="movie"]:checked').each(function() {
        arr[0] = "movie";
        arr.push($(this).val());
    });
    $('input[name="novel"]:checked').each(function() {
        arr[0] = "novel";
        arr.push($(this).val());
    });
    $('input[name="manga"]:checked').each(function() {
        arr[0] = "manga";
        arr.push($(this).val());
    });
    $('input[name="music"]:checked').each(function() {
        arr[0] = "music";
        arr.push($(this).val());
    });
    $('input[name="porn"]:checked').each(function() {
        arr[0] = "porn";
        arr.push($(this).val());
    });
    if (arr.length == 0) {
        alert("Please select at least one source...");
    } else {
        if (arr[0] == "movie") {
            window.localStorage.setItem('movie', arr.slice(1).join(","));
        } else if (arr[0] == "novel") {
            window.localStorage.setItem('novel', arr.slice(1).join(","));
        } else if (arr[0] == "manga") {
            window.localStorage.setItem('manga', arr.slice(1).join(","));
        } else if (arr[0] == "music") {
            window.localStorage.setItem('music', arr.slice(1).join(","));
        } else if (arr[0] == "porn") {
            window.localStorage.setItem('porn', arr.slice(1).join(","));
        }
        $('#sourceitem div').remove();
        $('#sourceitem button').remove();
        $('#sourceitem').append(`
            <div id="selectform">
                <input type="radio" name="sourceName" value="1" checked/> <span>Moive</span> <br />
                <input type="radio" name="sourceName" value="2" /> <span>Novel</span> <br />
                <input type="radio" name="sourceName" value="3" /> <span>Manga</span> <br />
                <input type="radio" name="sourceName" value="4" /> <span>Music</span> <br />
                <input type="radio" name="sourceName" value="5" /> <span>Porn</span> <br />
            </div>
            <button class="stylebtn" onclick="goToSource()"><img src="./images/nextselect.svg" style="width:30px;"></button>
        `);
    }
}
//Get User IP
function getUserIp() {
    var request = new XMLHttpRequest();

    request.open('GET', 'https://api.ipdata.co/?api-key=7910661894e758448cbebb4a636485005498427178dea6ef0e911311');

    request.setRequestHeader('Accept', 'application/json');

    request.onreadystatechange = function() {
        if (this.readyState === 4) {
            let country = JSON.parse(this.responseText).country_code;
            if (country.toLowerCase() == 'cn' || country.toLowerCase() == 'kp') {
                window.localStorage.setItem('bannedcountries', 'true');
                $('#mySidenav div:eq(0)').hide();
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
                    window.localStorage.setItem('bannedcountries', 'true');
                    $('#mySidenav div:eq(0)').hide();
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