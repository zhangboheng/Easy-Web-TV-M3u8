$(document).ready(function() {

    $("#video1").width($("#div1").width()).height($("#div1").height());
    $(".toggle").css({ 'left': $('#left').width() - 50 });
    var player = videojs(document.querySelector('#video1'));

    //Get Current href
    var key = window.location.href.split('=')[1];

    //Set Page Title
    $('title').html(key.toUpperCase().split('')[0] + key.slice(1) + ' Channels');
    $('#left h3').empty();
    $('#left h3').html(key.toUpperCase().split('')[0] + key.slice(1) + ' Channels')
        //Get iptv-org m3u list and show contents lists
    $.ajax({
        type: "GET",
        url: ' https://iptv-org.github.io/iptv/categories/' + key + ".m3u",
        success: function(message, text, response) {
            $("#menu").empty();
            $("#channelcontent").empty();
            let str = message
            let lst = str.split(",").slice(1, ).filter(x => /[^h]+.m3u8/.test(x)).map(x => x.split("\n"))
            let array = str.split(" ")
            let links = array.filter(x => /[^h]+.m3u8/.test(x)).map(x => x.split("\n")).flat().filter(x => /[^h]+.m3u8/.test(x))
            for (let i = 0; i < links.length; i++) {
                if ($(window).width() > 640) {
                    if (window.localStorage.getItem(links[i]) == lst[i][0]) {
                        $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/favorite.png');"/><span title=${links[i]}>${lst[i][0]}</span></p></li>`);
                        $("#channelcontent").append(`<li><p><input type="button" style="background-image: url('../images/favorite.png');"/><span title=${links[i]}>${lst[i][0]}</span></p></li>`);
                    } else {
                        $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/unfavorite.png');"/><span title=${links[i]}>${lst[i][0]}</span></p></li>`);
                    }
                } else {
                    if (window.localStorage.getItem(links[i]) == lst[i][0]) {
                        $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/favorite20.png');"/><span title=${links[i]}>${lst[i][0]}</span></p></li>`);
                        $("#channelcontent").append(`<li><p><input type="button" style="background-image: url('../images/favorite20.png');"/><span title=${links[i]}>${lst[i][0]}</span></p></li>`);
                    } else {
                        $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/unfavorite20.png');"/><span title=${links[i]}>${lst[i][0]}</span></p></li>`);
                    }
                }
            }

            $("li p span").click(function() {
                player.src({
                    src: $(this).attr("title"),
                    type: 'application/x-mpegURL' /*video type*/
                });

                player.play();
            });
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
            let menuHeight = document.getElementById('menu');
            let screenHeight = window.innerHeight;
            menuHeight.style.height = screenHeight - 60 + "px";
            $("#menu").css({ "overflow-y": "auto", "height": menuHeight });
        },
        fail: function(xhr, textStatus, errorThrown) {
            alert("Please check your Internet or the iptv source has gone out!")
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
    //Set return home page
    $("#prev").on({
        mouseenter: function() {
            $(this).css({ "opacity": 1 })
        },
        click: function() {
            window.location.href = "/Easy-Web-TV-M3u8/";
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
    //Set link input
    $('#inputlink').on({
        mouseenter: function() {
            $(this).css({ "opacity": 1 })
        },
        mouseleave: function() {
            $(this).css({ "opacity": 0.5 })
            $(this).hide(2000)
            $("#player").css({ "background-image": "url(../images/link.jpg)" })
        }
    });
})