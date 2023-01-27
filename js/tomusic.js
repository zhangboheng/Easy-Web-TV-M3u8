//Set global array proxy links to solve CORS error
var proxy = {
    0: 'https://bird.ioliu.cn/v1?url=',
    1: 'https://cors.luckydesigner.workers.dev/?',
};
//Set global pagenum and random
var pnum = 1;
var plyist = [];
var rand = Math.floor(Math.random() * Object.keys(proxy).length);
$(document).ready(function() {
    //Toggle menu and adjust size
    $(".toggle").css({ 'left': $('#left').width() - 50 });
    $('.toggle').click(function() {
        $('#left').toggle();
        if ($('#left').is(':visible')) {
            $('.toggle').css({ 'left': $('#left').width() - 50 });
        } else {
            $('.toggle').css({ 'left': '5px' });
        }
    });
    //Get select source
    try {
        let ms = window.localStorage.getItem('music').split(",");
        let arr = ["wymusic"];
        let lst = arr.filter(x => ms.includes(x)).map(x => arr.indexOf(x));
        let sts = ['<option value="https://api-music.imsyy.top/">网易云音乐</option>'];
        for (let i of lst) {
            $('#selectapi').append(sts[i]);
        }
    } catch (e) {
        $('#selectapi').append(`
            <option value="https://api-music.imsyy.top/">网易云音乐</option>
        `);
    }
    //Variable zone
    var initlink = $('#selectapi').val();
    //Initial homepage menu and episod lists
    iniMenu(initlink);
    //Select Different Source Website
    $('#selectapi').on('change', function() {
        var key = $(this).val();
        $('.itemContainer').empty();
        iniMenu(key);
        pnum = 1;
    });
    // //Reinitial page num
    $("#menu").click(function() {
        pnum = 1;
    });
    //Scroll down to load more
    $(window).scroll(function(e) {
        $('#left').hide();
        $('.toggle').css({ 'left': '5px' });
        var ks = $('.hiddens');
        var kt = $('#search');
        var str = ks[0].children[0].innerHTML;
        var sts = kt[0].value;
        var scrollTop = $(this).scrollTop(),
            scrollHeight = $(document).height(),
            windowHeight = $(this).height();
        var positionValue = (scrollTop + windowHeight) - scrollHeight;
        var link = $('#selectapi').val();
        var globallink;
        if (positionValue <= 0 && positionValue >= -5) {
            $('#root').append(`<div class="loadingimg"><img src="../images/loading.gif" tag="Easy Web TV"></div>`);
            pnum++;
            if (link == 'https://api-music.imsyy.top/') {
                if (sts.length > 0) {
                    globallink = proxy[0] + link + 'search?keywords=' + sts + `&limit=20&offset=${20*pnum - 20}`;
                } else {
                    str = str == "0" ? link + `artist/list?type=-1&area=-1&limit=20&offset=${20*pnum - 20}` : str + `&limit=20&offset=${20*pnum - 20}`;
                    globallink = str;
                }
                $.ajax({
                    url: proxy[0] + globallink,
                    type: "GET",
                    dataType: "json",
                    success: function(data) {
                        $('.loadingimg').remove();
                        if (globallink.indexOf('keywords') > -1) {
                            let artisery = data.result.songs;
                            if ($(window).width() > 1024) {
                                for (let i = 0; i < artisery.length; i++) {
                                    if (i % 5 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                    } else if (i % 5 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                    } else if (i % 5 == 2) {
                                        $(`.itemContainer:eq(2)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                    } else if (i % 5 == 3) {
                                        $(`.itemContainer:eq(3)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                    } else if (i % 5 == 4) {
                                        $(`.itemContainer:eq(4)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                    }
                                    plyist.push(artisery[i].id);
                                };
                            } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                                $(`.itemContainer:eq(4)`).hide();
                                for (let i = 0; i < artisery.length; i++) {
                                    if (i % 4 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                    } else if (i % 4 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                    } else if (i % 4 == 2) {
                                        $(`.itemContainer:eq(2)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                    } else if (i % 4 == 3) {
                                        $(`.itemContainer:eq(3)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                    }
                                    plyist.push(artisery[i].id);
                                };
                            } else if ($(window).width() <= 640) {
                                $(`.itemContainer:eq(2)`).hide();
                                $(`.itemContainer:eq(3)`).hide();
                                $(`.itemContainer:eq(4)`).hide();
                                for (let i = 0; i < artisery.length; i++) {
                                    if (i % 2 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                    } else if (i % 2 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                    }
                                    plyist.push(artisery[i].id);
                                }
                            }
                        } else {
                            let artisery = data.artists;
                            if ($(window).width() > 1024) {
                                for (let i = 0; i < artisery.length; i++) {
                                    if (i % 5 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                                    } else if (i % 5 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                                    } else if (i % 5 == 2) {
                                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                                    } else if (i % 5 == 3) {
                                        $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                                    } else if (i % 5 == 4) {
                                        $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                                    }
                                };
                            } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                                $(`.itemContainer:eq(4)`).hide();
                                for (let i = 0; i < artisery.length; i++) {
                                    if (i % 4 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                                    } else if (i % 4 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                                    } else if (i % 4 == 2) {
                                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                                    } else if (i % 4 == 3) {
                                        $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                                    }
                                };

                            } else if ($(window).width() <= 640) {
                                $(`.itemContainer:eq(2)`).hide();
                                $(`.itemContainer:eq(3)`).hide();
                                $(`.itemContainer:eq(4)`).hide();
                                for (let i = 0; i < artisery.length; i++) {
                                    if (i % 2 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                                    } else if (i % 2 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                                    }

                                }
                            }
                        }
                    },
                    error: function() {
                        alert('Can\'t load more...');
                    }
                });
            }
        }
    });
    //Add random playlist music 
    document.getElementById('Audio1').addEventListener("ended", function() {
        let playlist = [...new Set(plyist)];
        var index = Math.floor(Math.random() * playlist.length);
        audioPlay(playlist[index]);
    });
});

//Initial homepage menu
function iniMenu(link) {
    $('#root').append(`<div class="loadingimg"><img src="../images/loading.gif" tag="Easy Web TV"></div>`);
    $("#menu").empty();
    //Get 163 music initial list
    if (link == 'https://api-music.imsyy.top/') {
        $("#menu").append('<li style="background-color:#fff"><input id="search" type="text" placeholder="Search..." /></li>');
        var initmenu = {
            0: '其他',
            1: '男歌手',
            2: '女歌手',
            3: '乐队',
            7: '华语',
            8: '日本',
            16: '韩国',
            96: '欧美',
        };
        var code = Object.keys(initmenu);
        var area = Object.values(initmenu);
        for (let i = 0; i < code.length; i++) {
            $("#menu").append(`<li><p><span class="${code[i]}">${area[i]}</span></p></li>`);
        }
        $("#menu li:gt(1)").on('click', function(){
            $(this).addClass("bd").siblings().removeClass("bd");
        });
        $.ajax({
            url: proxy[0] + link + 'artist/list',
            data: {
                type: '-1',
                area: '-1',
                limit: '20'
            },
            dataType: 'json',
            async: false,
            success: function(data) {
                $('.loadingimg').remove();
                $('.itemContainer').empty();
                let artisery = data.artists;
                if ($(window).width() > 1024) {
                    for (let i = 0; i < artisery.length; i++) {
                        if (i % 5 == 0) {
                            $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        } else if (i % 5 == 1) {
                            $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        } else if (i % 5 == 2) {
                            $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        } else if (i % 5 == 3) {
                            $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        } else if (i % 5 == 4) {
                            $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        }
                    };
                } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                    $(`.itemContainer:eq(4)`).hide();
                    for (let i = 0; i < artisery.length; i++) {
                        if (i % 4 == 0) {
                            $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        } else if (i % 4 == 1) {
                            $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        } else if (i % 4 == 2) {
                            $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        } else if (i % 4 == 3) {
                            $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        }
                    };

                } else if ($(window).width() <= 640) {
                    $(`.itemContainer:eq(2)`).hide();
                    $(`.itemContainer:eq(3)`).hide();
                    $(`.itemContainer:eq(4)`).hide();
                    for (let i = 0; i < artisery.length; i++) {
                        if (i % 2 == 0) {
                            $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        } else if (i % 2 == 1) {
                            $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        }

                    }
                }
            },
            error: function() {
                alert('Can\'t load more...');
            },
            complete: function(data) {
                var searchlink = '';
                $("#search").on('keyup', function(e) {
                    if (e.which == 13) {
                        $('.itemContainer').empty();
                        var valThis = $(this).val().toLowerCase();
                        searchlink = `${link + 'search?keywords=' + valThis}`;
                        $.ajax({
                            url: proxy[0] + searchlink,
                            data: {
                                limit: 20,
                            },
                            type: "GET",
                            dataType: "json",
                            success: function(data) {
                                let artisery = data.result.songs;
                                if ($(window).width() > 1024) {
                                    for (let i = 0; i < artisery.length; i++) {
                                        if (i % 5 == 0) {
                                            $(`.itemContainer:eq(0)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                        } else if (i % 5 == 1) {
                                            $(`.itemContainer:eq(1)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                        } else if (i % 5 == 2) {
                                            $(`.itemContainer:eq(2)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                        } else if (i % 5 == 3) {
                                            $(`.itemContainer:eq(3)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                        } else if (i % 5 == 4) {
                                            $(`.itemContainer:eq(4)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                        }
                                        plyist.push(artisery[i].id);
                                    };
                                } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                                    $(`.itemContainer:eq(4)`).hide();
                                    for (let i = 0; i < artisery.length; i++) {
                                        if (i % 4 == 0) {
                                            $(`.itemContainer:eq(0)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                        } else if (i % 4 == 1) {
                                            $(`.itemContainer:eq(1)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                        } else if (i % 4 == 2) {
                                            $(`.itemContainer:eq(2)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                        } else if (i % 4 == 3) {
                                            $(`.itemContainer:eq(3)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                        }
                                        plyist.push(artisery[i].id);
                                    };

                                } else if ($(window).width() <= 640) {
                                    $(`.itemContainer:eq(2)`).hide();
                                    $(`.itemContainer:eq(3)`).hide();
                                    $(`.itemContainer:eq(4)`).hide();
                                    for (let i = 0; i < artisery.length; i++) {
                                        if (i % 2 == 0) {
                                            $(`.itemContainer:eq(0)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                        } else if (i % 2 == 1) {
                                            $(`.itemContainer:eq(1)`).append(`<div class="item" onclick="audioPlay('${artisery[i].id}')"><img class="itemImg" src="../images/noimage.jpeg" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[Music]${artisery[i].name}</span></div></div>`)
                                        }
                                        plyist.push(artisery[i].id);
                                    }
                                }
                            },
                            error: function(xhr, status) {
                                setTimeout(() => {
                                    alert('Sorry, the music is blocked by NetEase');
                                }, 3000);
                            }
                        });
                    }
                });
            }
        });
    }
    //Click to choose category
    $('#menu').on("click", "span", function(e) {
        var className;
        if (link == 'https://api-music.imsyy.top/') {
            if (['1', '2', '3'].includes(e.originalEvent.target.className)) {
                className = link + 'artist/list?type=' + e.originalEvent.target.className;
            } else if (['0', '7', '8', '16', '96'].includes(e.originalEvent.target.className)) {
                className = link + 'artist/list?area=' + e.originalEvent.target.className;
            }
        }
        $('.hiddens').empty();
        $('.hiddens').append(`<p>${className}</p>`);
        $('#search').val('');
        $('#root').append(`<div class="loadingimg"><img src="../images/loading.gif" tag="Easy Web TV"></div>`);
        $.ajax({
            url: proxy[0] + className,
            data: {
                limit: 20
            },
            dataType: 'json',
            async: false,
            success: function(data) {
                $('.loadingimg').remove();
                $('.itemContainer').empty();
                let artisery = data.artists;
                if ($(window).width() > 1024) {
                    for (let i = 0; i < artisery.length; i++) {
                        if (i % 5 == 0) {
                            $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        } else if (i % 5 == 1) {
                            $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        } else if (i % 5 == 2) {
                            $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        } else if (i % 5 == 3) {
                            $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        } else if (i % 5 == 4) {
                            $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        }
                    };
                } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                    $(`.itemContainer:eq(4)`).hide();
                    for (let i = 0; i < artisery.length; i++) {
                        if (i % 4 == 0) {
                            $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        } else if (i % 4 == 1) {
                            $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        } else if (i % 4 == 2) {
                            $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        } else if (i % 4 == 3) {
                            $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        }
                    };

                } else if ($(window).width() <= 640) {
                    $(`.itemContainer:eq(2)`).hide();
                    $(`.itemContainer:eq(3)`).hide();
                    $(`.itemContainer:eq(4)`).hide();
                    for (let i = 0; i < artisery.length; i++) {
                        if (i % 2 == 0) {
                            $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        } else if (i % 2 == 1) {
                            $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/musicplay.html?web=${artisery[i].id}"><div class="item"><img class="itemImg" src="${artisery[i].picUrl}" alt="${artisery[i].name}" /><div class="userInfo"><img class="avatar" src="../images/music.svg" alt="" /><span class="username">[${artisery[i].alias}]${artisery[i].name}</span></div></div></a>`)
                        }

                    }
                }
            },
            error: function() {
                alert('Can\'t load more...');
            },
            complete: function(data) {
                console.log(data);
            }
        });
    });
};

//Play audio source
function audioPlay(ids) {
    //Test muisc if is invalid
    $.ajax({
        url: proxy[0] + 'https://api-music.imsyy.top' + '/check/music?id=' + ids,
        type: "GET",
        dataType: "json",
        success: function(data) {
            $.ajax({
                url: proxy[0] + 'https://api-music.imsyy.top' + '/song/url?id=' + ids,
                type: "GET",
                dataType: "json",
                success: function(data) {
                    $('audio').show();
                    var fileName = data.data[0].url;
                    $("#Audio1").attr("src", fileName).trigger("play");
                },
                error: function(xhr, status) {
                    setTimeout(() => {
                        alert('Sorry, the music is not support to play...');
                    }, 3000);
                }
            });
        },
        error: function(xhr, status) {
            setTimeout(() => {
                alert('Sorry, the music is not support to play...');
            }, 3000);
        }
    });
}