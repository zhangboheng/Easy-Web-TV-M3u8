var channels = [];
//Set a array to store source links
var radiosource = ['https://de1.api.radio-browser.info/', 'https://at1.api.radio-browser.info/', 'https://nl1.api.radio-browser.info/',];
//Set a random integer
var rand = Math.floor(Math.random() * radiosource.length);
//Get default localstorage key
var localkey = ['manga', 'bannedcountries', 'novel', 'movie', 'music', 'languages', 'porn', 'adult'];
$(document).ready(function() {

    $("#video1").width($("#div1").width()).height($("#div1").height());
    $(".toggle").css({ 'left': $('#left').width() - 50 });
    var player = videojs(document.querySelector('#video1'));

    //Get Current href
    var key = decodeURIComponent(window.location.href).split('=')[1].split('&')[0].replace('#', '');
    var vls = decodeURIComponent(window.location.href).split('=')[2];
    //Set Page Title
    $('title').html(key == "Taiwan Province Of China" ? 'Taiwan' : key + ' Channels');
    $('#left h3').empty();
    $('#left h3').html(key == "Taiwan Province Of China" ? 'Taiwan' : key + ' Channels');
    //Set getjson array
    var getry = ['', 'json/stations/bycountry/', 'json/stations/bylanguage/', 'json/stations/bytag/'];
    //Get radio-browser list and show contents lists
    $.ajax({
        type: "GET",
        url: radiosource[rand] + getry[Number(vls)] + key,
        success: function(message, text, response) {
            $("#menu").empty();
            $("#menu").append('<li style="background-color:#fff"><input id="search" type="text" placeholder="Search..." /></li>');
            $("#channelcontent").empty();
            var str = message;
            var lst = str.map(x => x.name);
            var pic = str.map(x => x.favicon);
            var links = str.map(x => x.url);
            let types;
            for (let i = 0; i < links.length; i++) {
                channels.push(links[i]);
                if (i == 0) {
                    types = links[0].indexOf('m3u8') > -1 ? 'application/x-mpegURL' : 'audio/mp3';
                    player.src({
                        src: links[0],
                        type: types /*video type*/
                    });

                    player.play();
                }
                if ($(window).width() > 640) {
                    if (window.localStorage.getItem(links[i]) == lst[i][0]) {
                        $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/favorite.png');"/><span title=${links[i]} class="${pic[i]}">${lst[i]}</span></p></li>`);
                    } else {
                        $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/unfavorite.png');"/><span title=${links[i]} class="${pic[i]}">${lst[i]}</span></p></li>`);
                    }
                } else {
                    if (window.localStorage.getItem(links[i]) == lst[i][0]) {
                        $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/favorite20.png');"/><span title=${links[i]} class="${pic[i]}">${lst[i]}</span></p></li>`);
                    } else {
                        $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/unfavorite20.png');"/><span title=${links[i]} class="${pic[i]}">${lst[i]}</span></p></li>`);
                    }
                }
            }
            //Append favorite list
            for (let i of Object.keys(localStorage).filter(x => !localkey.includes(x))) {
                if ($(window).width() > 640) {
                    $("#channelcontent").append(`<li><p><input type="button" style="background-image: url('../images/favorite.png');"/><span title=${i}>${localStorage[i]}</span></p></li>`);
                } else {
                    $("#channelcontent").append(`<li><p><input type="button" style="background-image: url('../images/favorite20.png');"/><span title=${i}>${localStorage[i]}</span></p></li>`);
                }
            }
            //Click channels to play
            $("li p span").click(function() {
                var types;
                $('.vjs-poster').css({
                    'background-image': 'url(' + $(this).attr('class') + ')',
                    'display': 'block'
                });
                types = $(this).attr("title").indexOf('m3u8') > -1 ? 'application/x-mpegURL' : 'audio/mp3';
                player.src({
                    src: $(this).attr("title"),
                    type: types /*video type*/
                });

                player.play();
            });
            //Click play random channels
            $("#shuffleplay").click(function() {
                var types;
                let detail = channels[Math.floor(Math.random() * channels.length)];
                types = detail.indexOf('m3u8') > -1 ? 'application/x-mpegURL' : 'audio/mp3';
                $('.vjs-poster').css({
                    'background-image': 'url(' + pic[channels.indexOf(detail)] + ')',
                    'display': 'block'
                });
                player.src({
                    src: detail,
                    type: types /*video type*/
                });

                player.play();
            });
            //Change icon size
            $('#menu li p input').click(function() {
                //Get browser support localstorage if or not
                if (!window.localStorage) {
                    console.log("Browser not support localstorage");
                    return false;
                } else {
                    window.localStorage.setItem($(this).next().attr('title'), $(this).next().text());
                }
                if ($(window).width() > 640) {
                    $(this).css({ 'background-image': 'url(../images/favorite.png)' });
                } else {
                    $(this).css({ 'background-image': 'url(../images/favorite20.png)' });
                }
                if ($(this).next().attr('title').length > 0) {
                    window.location.reload();
                }
            });
            //Collect favorite channles
            $('#channelcontent li p input').click(function() {
                //Get browser support localstorage if or not
                if (!window.localStorage) {
                    console.log("Browser not support localstorage");
                    return false;
                } else {
                    localStorage.removeItem($(this).next().attr('title'));
                }
                if ($(window).width() > 640) {
                    $(this).css({ 'background-image': 'url(../images/unfavorite.png)' });
                } else {
                    $(this).css({ 'background-image': 'url(../images/unfavorite20.png)' });
                }
                window.location.reload();
            });
            //Search Channels
            $("#search").on("keyup", function(e) {
                var valThis = $(this).val().toLowerCase();
                if (valThis == "") {
                    $('#menu li').slice(1).show(); // show all lis
                } else {
                    $('#menu li:gt(0)').each(function() {
                        var label = $(this); // cache this
                        var text = label.text().toLowerCase();
                        if (text.indexOf(valThis) > -1) {
                            label.show() // show all li parents up the ancestor tree
                        } else {
                            label.hide(); // hide current li as it doesn't match
                        }
                    });
                };
            });
        },
        fail: function(xhr, textStatus, errorThrown) {
            alert("Please check your Internet or the radio-browser source has gone out!")
        },
        complete: function(){
            $("#menu li:eq(1)").addClass("bd");
            $("#menu li").on('click', function(){
                $(this).addClass("bd").siblings().removeClass("bd");
            });
        }
    });
    //Set Toggle Menu
    $('.toggle').click(function() {
            $('#left').toggle();
            if ($('#left').is(':visible')) {
                $('.toggle').css({ 'left': $('#left').width() - 50 });
            } else {
                $('.toggle').css({ 'left': '5px' });
            }
        })
        //Set M3U8 links to play
    $("#player").on({
        mouseenter: function() {
            $(this).css({ "opacity": 1 })
        },
        click: function() {
            $(this).css({ "background-image": "url(../images/player.jpg)", "border": "1px solid #fff" })
            if (window.width > 640) {
                $("#inputlink").show(500)
            } else {
                $("#inputlink").toggle(500)
            }
            let link = $("#inputlink").val()
            if (link.length > 0) {
                player.src({
                    src: link,
                    type: 'application/x-mpegURL' /*video type*/
                });
                player.play();
            }
            $('#inputlink').val("")
        },
        mouseleave: function() {
            $(this).css({ "opacity": 0.5 })
        }
    });
    //Set Tools Menu
    $("#menuicon").on({
        mouseenter: function() {
            $(this).css({ "opacity": 1 })
        },
        click: function() {
            $('#control div:gt(0)').slideToggle(500);
            $('#channelist').hide();
            $('#inputlink').hide();
        },
        mouseleave: function() {
            $(this).css({ "opacity": 0.5 })
        }
    });
    //Set return home page
    $("#prev").on({
        mouseenter: function() {
            $(this).css({ "opacity": 1 })
        },
        click: function() {
            window.location.href = "/Easy-Web-TV-M3u8/routes/radio.html";
        },
        mouseleave: function() {
            $(this).css({ "opacity": 0.5 })
        }
    });
    //Set Github link
    $("#github").on({
        mouseenter: function() {
            $(this).css({ "opacity": 1 })
        },
        click: function() {
            window.open("https://github.com/zhangboheng/Easy-Web-TV-M3u8");
        },
        mouseleave: function() {
            $(this).css({ "opacity": 0.5 })
        }
    });
    //Set documents list
    $("#favorite").on({
        mouseenter: function() {
            $(this).css({ "opacity": 1 })
        },
        click: function() {
            $('#channelist').toggle(500);
        },
        mouseleave: function() {
            $(this).css({ "opacity": 0.5 })
        }
    });
    //Set shuffle play
    $("#shuffleplay").on({
        mouseenter: function() {
            $(this).css({ "opacity": 1 })
        },
        mouseleave: function() {
            $(this).css({ "opacity": 0.5 })
        }
    });
    //Set link input
    $('#inputlink').on({
        mouseenter: function() {
            $(this).css({ "opacity": 1 });
        },
        mouseleave: function() {
            $(this).css({ "opacity": 0.5 });
            $(this).hide(3000);
            $("#player").css({ "background-image": "url(../images/link.jpg)" });
        }
    });
})