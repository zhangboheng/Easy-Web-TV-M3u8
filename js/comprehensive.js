//Set global array proxy links to solve CORS error
var proxy = {
    0: 'https://cors.luckydesigner.workers.dev/?',
};
var channels = [];
//Get default localstorage key
var localkey = ['manga', 'bannedcountries', 'novel', 'movie', 'music', 'languages', 'porn', 'adult'];
$(document).ready(function() {
    $("#video1").width($("#div1").width()).height($("#div1").height());
    $(".toggle").css({ 'left': $('#left').width() - 50 });
    var player = videojs(document.querySelector('#video1'));
    //Get Current href
    var initlink = decodeURIComponent(window.location.href).split('=')[1].split('&')[0];
    var id = decodeURIComponent(window.location.href).split('=')[2];
    //Get Source
    $.ajax({
        type: "GET",
        url: proxy[0] + `${initlink.replace('json','xml')}?ac=videolist&ids=${id}`,
        success: function(message, text, response) {
            $("#menu").empty();
            $('#epcontent').empty();
            var xml = $.parseXML(message),
                $xml = $(xml),
                $list = $xml.find('dd'),
                $des = $xml.find('des'),
                $name = $xml.find('name');
            $('#epcontent').append(`<h3>Content</h3><p>${$des[0].innerHTML.split("[")[2].split(']')[0]}</p>`);
            $('#left h3').html($name[0].innerHTML.split("[")[2].split(']')[0]);
            $("#channelcontent").empty();
            if (initlink == "http://www.88zy.live/inc/api.php") {
                var episode = [];
                var links = $list[1].innerHTML.split('[')[2].split(']')[0].split('\#').map(x => x.split('$')).map(x => x[0]);
                for (let i = 0; i < links.length; i++) {
                    episode.push(`第${Number(i+1)}集`);
                }
            } else {
                var episode = $list[0].innerHTML.split('[')[2].split(']')[0].split('\#').map(x => x.split('$')).map(x => x[0]);
                var links = $list[0].innerHTML.split('[')[2].split(']')[0].split('\#').map(x => x.split('$')).map(x => x[1]);
            }
            for (let i = 0; i < links.length; i++) {
                channels.push(links[i]);
                //Set Videojs Autoplay
                player.src({
                    src: links[0],
                    type: 'application/x-mpegURL'
                });

                player.play();
                if ($(window).width() > 640) {
                    if (window.localStorage.getItem(links[i]) == $name[0].innerHTML.split("[")[2].split(']')[0] + episode[i]) {
                        $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/favorite.png');"/><span title=${links[i]}>${$name[0].innerHTML.split("[")[2].split(']')[0] + episode[i]}</span></p></li>`);
                    } else {
                        $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/unfavorite.png');"/><span title=${links[i]}>${$name[0].innerHTML.split("[")[2].split(']')[0] + episode[i]}</span></p></li>`);
                    }
                } else {
                    if (window.localStorage.getItem(links[i]) == $name[0].innerHTML.split("[")[2].split(']')[0] + episode[i]) {
                        $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/favorite20.png');"/><span title=${links[i]}>${$name[0].innerHTML.split("[")[2].split(']')[0] + episode[i]}</span></p></li>`);
                    } else {
                        $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/unfavorite20.png');"/><span title=${links[i]}>${$name[0].innerHTML.split("[")[2].split(']')[0] + episode[i]}</span></p></li>`);
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
            window.location.href = "/Easy-Web-TV-M3u8/routes/comprehensive.html";
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