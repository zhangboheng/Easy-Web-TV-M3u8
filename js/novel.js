//Set global array proxy links to solve CORS error
var proxy = {
    0: 'https://cors.luckydesigner.workers.dev/?',
};
var channels = [];
//Get default localstorage key
var localkey = ['manga', 'bannedcountries', 'novel', 'movie', 'music', 'languages', 'porn', 'adult'];
$(document).ready(function () {
    $("#video1").width($("#div1").width()).height($("#div1").height());
    $(".toggle").css({ 'left': $('#left').width() - 50 });
    //Get Current href
    var initlink = decodeURIComponent(window.location.href).split('web=')[1];
    var originurl;
    if (initlink.indexOf('http://www.xfjxs.com/') > -1) {
        originurl = 'http://www.xfjxs.com';
    } else if (initlink.indexOf('https://novelonlinefull.com/') > -1) {
        originurl = 'https://novelonlinefull.com';
    };
    //Get data
    $.ajax({
        url: proxy[0] + initlink,
        dataType: 'html',
        type: "GET",
        success: function (data) {
            var html = $.parseHTML(data);
            if (initlink.indexOf('http://www.xfjxs.com/') > -1) {
                var title = $(html).find('h1 a').text();
                var info = $(html).find('.r_cons').text();
                try {
                    var cates = $(html).find('#diralinks')[0].href;
                } catch {
                    location.reload();
                }
                $('#hiddens').append(`<p>${cates}</p>`);
            } else if (initlink.indexOf('https://novelonlinefull.com/') > -1) {
                var title = $(html).find('.truyen_info_right h1').text();
                var info = $(html).find('#noidungm').text();
            };
            $('#epcontent').empty();
            $('#left h3').html(title);
            $('#epcontent').append(`<h3>Content</h3><p>${info}</p>`);
        },
        error: function () {
            alert("Error");
        },
        complete: function (xhr, status) {
            if (initlink.indexOf('http://www.xfjxs.com/') > -1) {
                $.ajax({
                    url: proxy[0] + $('#hiddens').text(),
                    dataType: 'html',
                    type: "GET",
                    success: function (data) {
                        var html = $.parseHTML(data);
                        var episode = $(html).find('dd').find('a').map((x, y) => y.innerHTML);
                        var detail = $(html).find('dd').find('a').map((x, y) => y.attributes[0].value);
                        if (episode.length == 0) {
                            window.location.reload();
                        }
                        $('#menu').empty();
                        $("#channelcontent").empty();
                        for (let i = 0; i < episode.length; i++) {
                            if ($(window).width() > 640) {
                                if (window.localStorage.getItem(originurl + detail[i]) == episode[i].replace(/\s/g, '')) {
                                    $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/favorite.png');"/><span title=${originurl + detail[i]}>${episode[i].replace(/\s/g, '')}</span></p></li>`);
                                } else {
                                    $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/unfavorite.png');"/><span title=${originurl + detail[i]}>${episode[i].replace(/\s/g, '')}</span></p></li>`);
                                }
                            } else {
                                if (window.localStorage.getItem(originurl + detail[i]) == episode[i].replace(/\s/g, '')) {
                                    $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/favorite20.png');"/><span title=${originurl + detail[i]}>${episode[i].replace(/\s/g, '')}</span></p></li>`);
                                } else {
                                    $("#menu").append(`<li><p><input type="button" style="background-image: url('../images/unfavorite20.png');"/><span title=${originurl + detail[i]}>${episode[i].replace(/\s/g, '')}</span></p></li>`);
                                }
                            }
                            if (i == 0) {
                                var headurl = originurl + detail[0].split('/').slice(0, 3).join('/');
                                $.ajax({
                                    url: proxy[0] + originurl + detail[0],
                                    dataType: 'html',
                                    type: "GET",
                                    success: function (data) {
                                        $('#reader').empty();
                                        var html = $.parseHTML(data);
                                        var title = $(html).find('h1').text();
                                        var para = $(html).find('.yuedu_zhengwen');
                                        var btn = $(html).find('.button2 a');
                                        var arr = [];
                                        for (let i of btn) {
                                            arr.push(i.attributes[0].value);
                                        }
                                        arr = arr.filter((x, y) => y == 1 || y == 3).map(x => headurl + '/' + x);
                                        try {
                                            $('#reader').append(`<h2>${title}</h2>${para[0].innerHTML.replace(/最新网址：www.xfjxs.com/g, '').replace(/&nbsp;&nbsp;&nbsp;&nbsp;/g, '')}<br /><br /><div class="centerbtn"><button onclick="turnpage('${arr[0]}')">Prev</button><button onclick="turnpage('${arr[1]}')">Next</button></div>`);
                                        } catch {
                                            location.reload();
                                        }
                                        $('#center_tip').remove();
                                        $('#center_tip').remove();
                                    },
                                    error: function () {
                                        alert("Error");
                                    },
                                    complete: function (xhr, status) {

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
                        $('#menu li p input').click(function () {
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
                        $('#channelcontent li p input').click(function () {
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
                    error: function () {
                        alert("Error");
                    },
                    complete: function (xhr, status) {
                        //Click episode to read
                        $("li p span").click(function () {
                            var headurl = $(this).attr('title').split('.html')[0].replace(/\/\d+$/g, '');
                            $.ajax({
                                url: proxy[0] + $(this).attr('title'),
                                dataType: 'html',
                                type: "GET",
                                success: function (data) {
                                    $('#reader').empty();
                                    var html = $.parseHTML(data);
                                    var title = $(html).find('h1').text();
                                    var para = $(html).find('.yuedu_zhengwen');
                                    var btn = $(html).find('.button2 a');
                                    var arr = [];
                                    for (let i of btn) {
                                        arr.push(i.attributes[0].value);
                                    }
                                    arr = arr.filter((x, y) => y == 1 || y == 3).map(x => headurl + '/' + x);
                                    $('#reader').append(`<h2>${title}</h2>${para[0].innerHTML.replace(/最新网址：www.xfjxs.com/g, '').replace(/&nbsp;&nbsp;&nbsp;&nbsp;/g, '')}<br /><br /><div class="centerbtn"><button onclick="turnpage('${arr[0]}')">Prev</button><button onclick="turnpage('${arr[1]}')">Next</button></div>`);
                                    $('#center_tip').remove();
                                    $('#readzone').scrollTop(0);
                                    $('#left').hide();
                                    $('.toggle').css({ 'left': '5px' });
                                },
                                error: function () {
                                    alert("Error");
                                },
                                complete: function (xhr, status) {

                                }
                            });
                        });
                        $("#menu li:eq(0)").addClass("bd");
                        $("#menu li").on('click', function () {
                            $(this).addClass("bd").siblings().removeClass("bd");
                        });
                    }
                });
            } else if (initlink.indexOf('https://novelonlinefull.com/') > -1) {
                $.ajax({
                    url: proxy[0] + initlink,
                    dataType: 'html',
                    type: "GET",
                    success: function (data) {
                        var html = $.parseHTML(data);
                        var episodes = Object.values($(html).find('.row').slice(1).map((x, y) => y.children[0].innerText)).reverse().slice(2);
                        var epihref = Object.values($(html).find('.row a').map((x, y) => y.href)).reverse().slice(2);
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
                                    url: proxy[0] + epihref[0],
                                    dataType: 'html',
                                    type: "GET",
                                    success: function (data) {
                                        $('#reader').empty();
                                        var html = $.parseHTML(data);
                                        var para = $(html).find('#vung_doc');
                                        var btn = Object.values($(html).find('a.btn_theodoi.btn_doc').map((x, y) => y.href));
                                        var arr = [];
                                        for (let i of btn) {
                                            arr.push(i);
                                        }
                                        $('#reader').append(`${para[0].outerHTML}<br /><br /><div class="centerbtn"><button onclick="turnpage('${arr[0]}')">Prev</button><button onclick="turnpage('${arr[1]}')">Next</button></div>`);
                                    },
                                    error: function () {
                                        alert("Error");
                                    },
                                    complete: function (xhr, status) {

                                    }
                                });
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
                        //Change icon size
                        $('#menu li p input').click(function () {
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
                        $('#channelcontent li p input').click(function () {
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
                    error: function () {
                        alert("Error");
                    },
                    complete: function (xhr, status) {
                        //Click episode to read
                        $("li p span").click(function () {
                            $.ajax({
                                url: proxy[0] + $(this).attr('title'),
                                dataType: 'html',
                                type: "GET",
                                success: function (data) {
                                    $('#reader').empty();
                                    var html = $.parseHTML(data);
                                    var para = $(html).find('#vung_doc');
                                    var btn = Object.values($(html).find('a.btn_theodoi.btn_doc').map((x, y) => y.href));
                                    var arr = [];
                                    for (let i of btn) {
                                        arr.push(i);
                                    }
                                    $('#reader').append(`${para[0].outerHTML}<br /><br /><div class="centerbtn"><button onclick="turnpage('${arr[0]}')">Prev</button><button onclick="turnpage('${arr[1]}')">Next</button></div>`);
                                    $('#readzone').scrollTop(0);
                                    $('#left').hide();
                                    $('.toggle').css({ 'left': '5px' });
                                },
                                error: function () {
                                    alert("Error");
                                },
                                complete: function (xhr, status) {

                                }
                            });
                        });
                        $("#menu li:eq(0)").addClass("bd");
                        $("#menu li").on('click', function () {
                            $(this).addClass("bd").siblings().removeClass("bd");
                        });
                    }
                });
            }
        }
    });
});
//Set turnpage function
function turnpage(content) {
    if (content.indexOf('http://www.xfjxs.com/') > -1) {
        var headurl = content.split('.html')[0].replace(/\/\d+$/g, '');
        $.ajax({
            url: proxy[0] + content,
            dataType: 'html',
            type: "GET",
            success: function (data) {
                $('#reader').empty();
                var html = $.parseHTML(data);
                var title = $(html).find('h1').text();
                var para = $(html).find('.yuedu_zhengwen');
                var btn = $(html).find('.button2 a');
                var arr = [];
                for (let i of btn) {
                    arr.push(i.attributes[0].value);
                }
                arr = arr.filter((x, y) => y == 1 || y == 3).map(x => headurl + '/' + x);
                $('#reader').append(`<h2>${title}</h2>${para[0].innerHTML.replace(/最新网址：www.xfjxs.com/g, '').replace(/&nbsp;&nbsp;&nbsp;&nbsp;/g, '')}<br /><br /><div class="centerbtn"><button onclick="turnpage('${arr[0]}')">Prev</button><button onclick="turnpage('${arr[1]}')">Next</button></div>`);
                $('#center_tip').remove();
                $('#center_tip').remove();
                $('#readzone').scrollTop(0);
                $('#left').hide();
                $('.toggle').css({ 'left': '5px' });
            },
            error: function () {
                alert("Error");
            },
            complete: function (xhr, status) {

            }
        });
    } else if (content.indexOf('bestlightnovel') > -1 || content.indexOf('novelonlinefull') > -1) {
        $.ajax({
            url: proxy[0] + content,
            dataType: 'html',
            type: "GET",
            success: function (data) {
                $('#reader').empty();
                var html = $.parseHTML(data);
                var para = $(html).find('#vung_doc');
                var btn = Object.values($(html).find('a.btn_theodoi.btn_doc').map((x, y) => y.href));
                var arr = [];
                for (let i of btn) {
                    arr.push(i);
                }
                $('#reader').append(`${para[0].outerHTML}<br /><br /><div class="centerbtn"><button onclick="turnpage('${arr[0]}')">Prev</button><button onclick="turnpage('${arr[1]}')">Next</button></div>`);
                $('#readzone').scrollTop(0);
                $('#left').hide();
                $('.toggle').css({ 'left': '5px' });
            },
            error: function () {
                alert("Error");
            },
            complete: function (xhr, status) {

            }
        });
    }
}
//Set Toggle Menu
$('.toggle').click(function () {
    $('#left').toggle();
    if ($('#left').is(':visible')) {
        $('.toggle').css({ 'left': $('#left').width() - 50 });
    } else {
        $('.toggle').css({ 'left': '5px' });
    }
});
//Set Tools Menu
$("#menuicon").on({
    mouseenter: function () {
        $(this).css({ "opacity": 1 })
    },
    click: function () {
        $('#control div:gt(0)').slideToggle(500);
        $('#channelist').hide();
        $('#inputlink').hide();
        $('#epcontent').hide();
    },
    mouseleave: function () {
        $(this).css({ "opacity": 0.5 })
    }
});
//Set return home page
$("#prev").on({
    mouseenter: function () {
        $(this).css({ "opacity": 1 })
    },
    click: function () {
        window.location.href = "/Easy-Web-TV-M3u8/routes/novel.html";
    },
    mouseleave: function () {
        $(this).css({ "opacity": 0.5 })
    }
});
//Set Github link
$("#github").on({
    mouseenter: function () {
        $(this).css({ "opacity": 1 })
    },
    click: function () {
        window.open("https://github.com/zhangboheng/Easy-Web-TV-M3u8");
    },
    mouseleave: function () {
        $(this).css({ "opacity": 0.5 })
    }
});
//Set documents list
$("#favorite").on({
    mouseenter: function () {
        $(this).css({ "opacity": 1 })
    },
    click: function () {
        $('#channelist').toggle(500);
    },
    mouseleave: function () {
        $(this).css({ "opacity": 0.5 })
    }
});
//Set epcontent list
$("#epdetail").on({
    mouseenter: function () {
        $(this).css({ "opacity": 1 })
    },
    click: function () {
        $('#epcontent').toggle(500);
    },
    mouseleave: function () {
        $(this).css({ "opacity": 0.5 })
    }
});