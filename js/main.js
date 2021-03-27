$(document).ready(function() {

$("#video1").width($("#div1").width()).height($("#div1").height())

$("ul").empty()

var player = videojs(document.querySelector('#video1'));

$.ajax({
    type: "GET",
    url: ' https://iptv-org.github.io/iptv/categories/movies.m3u',
    success: function (message, text, response) {
        let str = message
        let lst = str.split(",").slice(1,).filter(x=>/[^h]+.m3u8/.test(x)).map(x => x.split("\n"))
        let array = str.split(" ")
        console.log(lst)
        let links = array.filter(x =>/[^h]+.m3u8/.test(x)).map(x => x.split("\n")).flat().filter(x => /[^h]+.m3u8/.test(x))
        for (let i = 0; i<links.length; i++) {
            $("ul").append("<li>" + "<p title=" + links[i] + ">" + lst[i][0] + "</p>" + "</li>")
        }

        $("li p:gt(0)").click(function () {
            player.src({
                src: $(this).attr("title"),
                type: 'application/x-mpegURL' /*video type*/
            });

            player.play();
        })
        
        let menuHeight = document.getElementById('menu');
        let screenHeight = window.innerHeight;
        menuHeight.style.height=screenHeight-10+"px";
        $("#menu").css({"overflow-y":"auto","height":menuHeight});
    }
})

$("#player").on({
    mouseenter: function () {
        $(this).css({"opacity":1})
    },
    click: function() {
        $(this).css({"background-image":"url(../images/player.jpg)"})
        $("input").toggle()
        let link = $("input").val()
        if(link.length>0){
            player.src({
                src: link,
                type: 'application/x-mpegURL' /*video type*/
            });
            player.play();
        }
        $("input").val("")
    },
    mouseleave: function () {
        $(this).css({"opacity":0.5})
    }

});

})