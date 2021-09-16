var channels = [];
$(document).ready(function() {
    $("#video1").width($("#div1").width()).height($("#div1").height());
    $(".toggle").css({ 'left': $('#left').width() - 50 });
    //Get Current href
    var ids = decodeURIComponent(window.location.href).split('web=')[1];
    //Get radio-browser list and show contents lists
    $.ajax({
        type: "GET",
        url: `https://163.lpddr5.cn/artist/songs?id=${ids}`,
        data: {
            limit: 100
        },
        success: function(message, text, response) {
            $("#menu").empty();
            $("#menu").append('<li style="background-color:#fff"><input id="search" type="text" placeholder="Search..." /></li>');
            $("#channelcontent").empty();
            var str = message.songs;
            $('#left h3').empty();
            $('#left h3').html(str[0].ar[0].name);
            var lst = str.map(x => x.name);
            var links = str.map(x => x.dt);
            for (let i = 0; i < links.length; i++) {
                channels.push(links[i]);
                if (i == 0) {
                    audioPlay(links[0]);
                }
                if ($(window).width() > 640) {
                    if (window.localStorage.getItem(links[i]) == lst[i][0]) {
                        $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/favorite.png');"/><span title=${links[i]}>${lst[i]}</span></p></li>`);
                    } else {
                        $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/unfavorite.png');"/><span title=${links[i]}>${lst[i]}</span></p></li>`);
                    }
                } else {
                    if (window.localStorage.getItem(links[i]) == lst[i][0]) {
                        $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/favorite20.png');"/><span title=${links[i]}>${lst[i]}</span></p></li>`);
                    } else {
                        $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/unfavorite20.png');"/><span title=${links[i]}>${lst[i]}</span></p></li>`);
                    }
                }
            }
            //Append favorite list
            for (let i of Object.keys(localStorage)) {
                if ($(window).width() > 640) {
                    $("#channelcontent").append(`<li><p><input type="button" style="background-image: url('../images/favorite.png');"/><span title=${i}>${localStorage[i]}</span></p></li>`);
                } else {
                    $("#channelcontent").append(`<li><p><input type="button" style="background-image: url('../images/favorite20.png');"/><span title=${i}>${localStorage[i]}</span></p></li>`);
                }
            }
            //Click channels to play
            $("li p span").click(function() {
                audioPlay($(this).attr("title"));
            });
            //Click play random channels
            $("#shuffleplay").click(function() {
                let detail = channels[Math.floor(Math.random() * channels.length)];
                audioPlay(detail);
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
});

//Play audio source
function audioPlay(ids) {
    var player = videojs(document.querySelector('#video1'));
    //Test muisc if is invalid
    $.ajax({
        url: 'https://163.lpddr5.cn' + '/check/music?id=' + ids,
        type: "GET",
        dataType: "json",
        success: function(data) {
            $.ajax({
                url: 'https://163.lpddr5.cn' + '/song/url?id=' + ids,
                type: "GET",
                dataType: "json",
                success: function(data) {
                    var fileName = data.data[0].url;
                    player.src({
                        src: fileName,
                        type: "audio/mp3"
                    });

                    player.play();
                },
                error: function(xhr, status) {
                    alert("Sorry, there was a problem!");
                }
            });
        },
        error: function(xhr, status) {
            alert('Sorry, the music is not support to play...');
        }
    });
}