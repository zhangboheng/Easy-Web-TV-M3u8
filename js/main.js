$(document).ready(function() {

    $("#video1").width($("#div1").width()).height($("#div1").height())

    var player = videojs(document.querySelector('#video1'));

    //Get Current href
    var url = window.location.href;
    var key = url.split("/").slice(-1)[0].split(".")[0];
    //Get iptv-org m3u list and show contents lists
    $.ajax({
        type: "GET",
        url: ' https://iptv-org.github.io/iptv/categories/' + key + ".m3u",
        success: function(message, text, response) {
            $("ul").empty()
            let str = message
            let lst = str.split(",").slice(1, ).filter(x => /[^h]+.m3u8/.test(x)).map(x => x.split("\n"))
            let array = str.split(" ")
            console.log(str)
            let links = array.filter(x => /[^h]+.m3u8/.test(x)).map(x => x.split("\n")).flat().filter(x => /[^h]+.m3u8/.test(x))
            for (let i = 0; i < links.length; i++) {
                $("ul").append("<li>" + "<p title=" + links[i] + ">" + lst[i][0] + "</p>" + "</li>")
            }

            $("li p").click(function() {
                player.src({
                    src: $(this).attr("title"),
                    type: 'application/x-mpegURL' /*video type*/
                });

                player.play();
            })

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
    if ($(window).width() < 640) {
        $('.toggle').click(function() {
            $('#left').toggle();
            if ($('#left').is(':visible')) {
                $('.toggle').css({ 'left': '30px' });
            } else {
                $('.toggle').css({ 'left': '5px' });
            }
        })
    } else if ($(window).width() >= 640 && $(window).width() < 1024) {
        $('.toggle').click(function() {
            $('#left').toggle();
            if ($('#left').is(':visible')) {
                $('.toggle').css({ 'left': '130px' });
            } else {
                $('.toggle').css({ 'left': '5px' });
            }
        })
    } else {
        $('.toggle').click(function() {
            $('#left').toggle();
            if ($('#left').is(':visible')) {
                $('.toggle').css({ 'left': '230px' });
            } else {
                $('.toggle').css({ 'left': '5px' });
            }
        })
    };
    //Set M3U8 links to play
    $("#player").on({
        mouseenter: function() {
            $(this).css({ "opacity": 1 })
        },
        click: function() {
            $(this).css({ "background-image": "url(../images/player.jpg)", "border": "1px solid #fff" })
            if (window.width > 640) {
                $("input").show()
            } else {
                $("input").toggle()
            }
            let link = $("input").val()
            if (link.length > 0) {
                player.src({
                    src: link,
                    type: 'application/x-mpegURL' /*video type*/
                });
                player.play();
            }
            $("input").val("")
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
    //Set link input
    $("input").on({
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