$(document).ready(function () {

    $("#video1").width($("#div1").width()).height($("#div1").height())

    var player = videojs(document.querySelector('#video1'));

    //Get Current href
    var url = window.location.href;
    var key = url.split("/").slice(-1)[0].split(".")[0]
    $.ajax({
        type: "GET",
        url: ' https://iptv-org.github.io/iptv/categories/' + key + ".m3u",
        success: function (message, text, response) {
            $("ul").empty()
            let str = message
            let lst = str.split(",").slice(1,).filter(x => /[^h]+.m3u8/.test(x)).map(x => x.split("\n"))
            let array = str.split(" ")
            console.log(str)
            let links = array.filter(x => /[^h]+.m3u8/.test(x)).map(x => x.split("\n")).flat().filter(x => /[^h]+.m3u8/.test(x))
            for (let i = 0; i < links.length; i++) {
                $("ul").append("<li>" + "<p title=" + links[i] + ">" + lst[i][0] + "</p>" + "</li>")
            }
            $("ul").append(`<li><p title=end>END</p></li>`)
            $("ul").append(`<li><p title=love>♡</p></li>`)

            $("li p").click(function () {
                player.src({
                    src: $(this).attr("title"),
                    type: 'application/x-mpegURL' /*video type*/
                });

                player.play();
            })

            let menuHeight = document.getElementById('menu');
            let screenHeight = window.innerHeight;
            menuHeight.style.height = screenHeight + "px";
            $("#menu").css({ "overflow-y": "auto", "height": menuHeight });
        },
        fail: function(xhr, textStatus, errorThrown) {
            alert("Please check your Internet or the iptv source has gone out!")
        }
    })

    $("#player").on({
        mouseenter: function () {
            $(this).css({ "opacity": 1 })
        },
        click: function () {
            $(this).css({ "background-image": "url(../Easy-Web-TV-M3u8/images/player.jpg)", "border": "1px solid #fff" })
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
        mouseleave: function () {
            $(this).css({ "opacity": 0.5 })
        }
    });
    $("#prev").on({
        mouseenter: function () {
            $(this).css({ "opacity": 1 })
        },
        click: function () {
            window.location.href = "/Easy-Web-TV-M3u8/";
        },
        mouseleave: function () {
            $(this).css({ "opacity": 0.5 })
        }
    });
    $("input").on({
        mouseenter: function () {
            $(this).css({ "opacity": 1 })
        },
        mouseleave: function () {
            $(this).css({ "opacity": 0.5 })
            $(this).hide(2000)
            $("#player").css({ "background-image": "url(../Easy-Web-TV-M3u8/images/link.jpg)" })
        }
    })


})