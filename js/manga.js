//Set global array proxy links to solve CORS errors
var proxy = {
    0: 'https://cors.luckydesigner.workers.dev/?',
    1: 'https://bird.ioliu.cn/v1?url=',
};
var channels = [];
$(document).ready(function() {
    $("#video1").width($("#div1").width()).height($("#div1").height());
    $(".toggle").css({ 'left': $('#left').width() - 50 });
    //Get Current href
    var initlink = decodeURIComponent(window.location.href).split('web=')[1];
    var originlink;
    if (initlink.indexOf('mangabuddy') > -1) {
        originlink = 'https://mangabuddy.com';
    }
    //Get data
    $.ajax({
        url: proxy[0] + initlink,
        dataType: 'html',
        type: "GET",
        success: function(data) {
            var html = $.parseHTML(data);
            var title = $(html).find('h1').text();
            var info = $(html).find('p.content').text();
            $('#epcontent').empty();
            $('#left h3').html(title);
            $('#epcontent').append(`<h3>Content</h3><p>${info}</p>`);
        },
        error: function() {
            alert("Error");
        },
        complete: function(xhr, status) {
            if (initlink.indexOf('mangabuddy') > -1) {
                $.ajax({
                    url: proxy[0] + initlink,
                    dataType: 'html',
                    type: "GET",
                    success: function(data) {
                        var html = $.parseHTML(data);
                        var episodes = Object.values($(html).find('.chapter-list li a').map((x, y) => y.innerText)).reverse().slice(2);
                        var epihref = Object.values($(html).find('.chapter-list li a').map((x, y) => originlink + y.attributes[0].value)).reverse().slice(2);
                        $('#menu').empty();
                        $("#channelcontent").empty();
                        for (let i = 0; i < episodes.length; i++) {
                            if ($(window).width() > 640) {
                                if (window.localStorage.getItem(epihref[i]) == episodes[i]) {
                                    $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/favorite.png');"/><span title=${epihref[i]}>${episodes[i]}</span></p></li>`);
                                } else {
                                    $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/unfavorite.png');"/><span title=${epihref[i]}>${episodes[i]}</span></p></li>`);
                                }
                            } else {
                                if (window.localStorage.getItem(epihref[i]) == episodes[i]) {
                                    $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/favorite20.png');"/><span title=${epihref[i]}>${episodes[i]}</span></p></li>`);
                                } else {
                                    $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/unfavorite20.png');"/><span title=${epihref[i]}>${episodes[i]}</span></p></li>`);
                                }
                            }
                            if (i == 0) {
                                $.ajax({
                                    url: proxy[1] + epihref[0],
                                    dataType: 'html',
                                    type: "GET",
                                    success: function(data) {
                                        $('#reader').empty();
                                        var html = $.parseHTML(data);
                                        var title = $(html).find('.chapter-info h1').text();
                                        var pic = $(html).find('img').map((x, y) => y.dataset.src.replace(/\\n/g, '').replace(/\\/g, '').replace(/\"/g, '')).filter((x, y) => !y.endsWith('.gif') && y.indexOf('/thumb/') == -1);
                                        $('#reader').append(`<h2>${title}</h2>`);
                                        for (let i of pic) {
                                            $('#reader').append(`<a class="spotlight" href="${i}"><img style="width:25%;" src="${i}" /></a>`);
                                        }
                                    },
                                    error: function() {
                                        alert("Error");
                                    },
                                    complete: function(xhr, status) {

                                    }
                                });
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
                    error: function() {
                        alert("Error");
                    },
                    complete: function(xhr, status) {
                        //Click episode to read
                        $("li p span").click(function() {
                            $.ajax({
                                url: proxy[1] + $(this).attr('title'),
                                dataType: 'html',
                                type: "GET",
                                success: function(data) {
                                    $('#reader').empty();
                                    var html = $.parseHTML(data);
                                    var title = $(html).find('.chapter-info h1').text();
                                    var pic = $(html).find('img').map((x, y) => y.dataset.src.replace(/\\n/g, '').replace(/\\/g, '').replace(/\"/g, '')).filter((x, y) => !y.endsWith('.gif') && y.indexOf('/thumb/') == -1);
                                    $('#reader').append(`<h2>${title}</h2>`);
                                    for (let i of pic) {
                                        $('#reader').append(`<a class="spotlight" href="${i}"><img style="width:25%;" src="${i}" /></a>`);
                                    }
                                },
                                error: function() {
                                    alert("Error");
                                },
                                complete: function(xhr, status) {

                                }
                            });
                        });
                    }
                });
            }
        }
    });
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