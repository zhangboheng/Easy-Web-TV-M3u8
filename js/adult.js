//Set global array proxy links to solve CORS error
var proxy = {
    0: 'https://cors.luckydesigner.workers.dev/?',
};
//Get default localstorage key
var localkey = ['manga', 'bannedcountries', 'novel', 'movie', 'music', 'languages', 'porn', 'adult'];
$(document).ready(function() {
    $("#video1").width($("#div1").width()).height($("#div1").height());
    $(".toggle").css({ 'left': $('#left').width() - 50 });
    var player = videojs(document.querySelector('#video1'));
    //Get Current href
    var initlink = decodeURIComponent(window.location.href).split('web=')[1];
    //Get iptv-org m3u list and show contents lists
    if (initlink.indexOf('youxijian') > 1) {
        $('#left h3').html('Playlist');
        $("#menu").empty();
        player.src({
            src: initlink.split('&')[0],
            type: 'application/x-mpegURL'
        });
        player.play();
        if ($(window).width() > 640) {
            if (window.localStorage.getItem(initlink.split('&')[0]) == initlink.split('&')[1]) {
                $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/favorite.png');"/><span title=${initlink.split('&')[0]}>${initlink.split('&')[1]}</span></p></li>`);
            } else {
                $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/unfavorite.png');"/><span title=${initlink.split('&')[0]}>${initlink.split('&')[1]}</span></p></li>`);
            }
        } else {
            if (window.localStorage.getItem(initlink.split('&')[0]) == initlink.split('&')[1]) {
                $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/favorite20.png');"/><span title=${initlink.split('&')[0]}>${initlink.split('&')[1]}</span></p></li>`);
            } else {
                $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/unfavorite20.png');"/><span title=${initlink.split('&')[0]}>${initlink.split('&')[1]}</span></p></li>`);
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
        $("#menu li:eq(0)").addClass("bd");
        $("#menu li").on('click', function(){
            $(this).addClass("bd").siblings().removeClass("bd");
        });
        //Click channels to play
        $("li p span").click(function() {
            player.src({
                src: $(this).attr("title"),
                type: 'application/x-mpegURL'
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
    } else {
        $.ajax({
            type: "GET",
            url: proxy[0] + `${initlink}`,
            success: function(message, text, response) {
                $("#menu").empty();
                $('#epcontent').empty();
                message = JSON.parse(message);
                var test = message.data[0],
                    name = test.vod_title,
                    des = test.vod_content,
                    play = test.vpath;
                if (initlink.indexOf('http://zmcj88.com/sapi/json?ac=list') > -1 || initlink.indexOf('http://f2dcj6.com/sapi/json?ac=list') > -1 || initlink.indexOf('http://mygzycj.com/sapi.php?ac=jsonvideolist') > -1) {
                    play = test.vpath;
                } else {
                    play = play.split('$')[1];
                }
                $('#epcontent').append(`<h3>Content</h3><p>${des.length==0?'暂无':des}</p>`);
                $('#left h3').html('Playlist');
                $("#channelcontent").empty();
                //Set Videojs Autoplay
                player.src({
                    src: play,
                    type: 'application/x-mpegURL'
                });
                player.play();
                if ($(window).width() > 640) {
                    if (window.localStorage.getItem(play) == name) {
                        $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/favorite.png');"/><span title=${play}>${name}</span></p></li>`);
                    } else {
                        $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/unfavorite.png');"/><span title=${play}>${name}</span></p></li>`);
                    }
                } else {
                    if (window.localStorage.getItem(play) == name) {
                        $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/favorite20.png');"/><span title=${play}>${name}</span></p></li>`);
                    } else {
                        $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/unfavorite20.png');"/><span title=${play}>${name}</span></p></li>`);
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
                $("#menu li:eq(0)").addClass("bd");
                $("#menu li").on('click', function(){
                    $(this).addClass("bd").siblings().removeClass("bd");
                });
                //Click channels to play
                $("li p span").click(function() {
                    player.src({
                        src: $(this).attr("title"),
                        type: 'application/x-mpegURL'
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
            },
            fail: function(xhr, textStatus, errorThrown) {
                alert("Please check your Internet or the iptv source has gone out!")
            }
        });
    }
    //Set Toggle Menu
    $('.toggle').click(function() {
        $('#left').toggle();
        if ($('#left').is(':visible')) {
            $('.toggle').css({ 'left': $('#left').width() - 50 });
        } else {
            $('.toggle').css({ 'left': '5px' });
        }
    });
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
                    type: 'application/x-mpegURL'
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
            $('#epcontent').hide();
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
            window.location.href = "/Easy-Web-TV-M3u8/routes/adult.html";
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
    //Set epcontent list
    $("#epdetail").on({
        mouseenter: function() {
            $(this).css({ "opacity": 1 })
        },
        click: function() {
            $('#epcontent').toggle(500);
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