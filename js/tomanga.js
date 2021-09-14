//Set global array proxy links to solve CORS errors
var proxy = {
    0: 'https://bird.ioliu.cn/v1?url=',
};
//Set global pagenum and random
var pnum = 1;
var rand = Math.floor(Math.random() * Object.keys(proxy).length);
$(document).ready(function() {
    //Variable zone
    var initlink = $('#selectapi').val();
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
            if (link == 'http://www.mangakakalot.com/') {
                if (sts.length > 0) {
                    globallink = proxy[0] + `${link + 'search/story/' + sts}` + `?page=${pnum}`;
                } else {
                    str = str == "0" ? link + `manga_list?type=latest&category=2&state=all&page=${pnum}` : str.split('&amp;').slice(0, 3).join('&') + `&page=${pnum}`;
                    globallink = proxy[0] + str;
                }
                $.ajax({
                    url: globallink,
                    type: "GET",
                    dataType: "html",
                    success: function(data) {
                        if (globallink.indexOf('search/story') > -1) {
                            var html = $.parseHTML(data.replace(/[\\"]/g, ''));
                            var title = $(html).find('h3.story_name a').map((x, y) => y.innerText);
                            var code = $(html).find('.story_item_right h3 a').map((x, y) => y.href);
                            var pic = $(html).find('.story_item a img').map((x, y) => y.attributes[0].value);
                        } else {
                            var html = $.parseHTML(data.replace(/[\\"]/g, ''));
                            var title = $(html).find('.list-truyen-item-wrap h3').map((x, y) => y.textContent.trim());
                            var code = $(html).find('.list-truyen-item-wrap h3 a').map((x, y) => y.href);
                            var pic = $(html).find('.list-truyen-item-wrap a img').map((x, y) => y.attributes[0].value);
                        }
                        if (pnum <= 1000) {
                            $('.loadingimg').remove();
                            if ($(window).width() > 1024) {
                                $(`.itemContainer:eq(4)`).hide();
                                for (let i = 0; i < pic.length; i++) {
                                    if (i % 4 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                    } else if (i % 4 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                    } else if (i % 4 == 2) {
                                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                    } else if (i % 4 == 3) {
                                        $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                    }
                                };
                            } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                                $(`.itemContainer:eq(4)`).hide();
                                for (let i = 0; i < pic.length; i++) {
                                    if (i % 4 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                    } else if (i % 4 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                    } else if (i % 4 == 2) {
                                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                    } else if (i % 4 == 3) {
                                        $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                    }
                                };
                            } else if ($(window).width() <= 640) {
                                $(`.itemContainer:eq(2)`).hide();
                                $(`.itemContainer:eq(3)`).hide();
                                $(`.itemContainer:eq(4)`).hide();
                                for (let i = 0; i < pic.length; i++) {
                                    if (i % 2 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                    } else if (i % 2 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                    }
                                }
                            }
                        } else {
                            $('.loadingimg').remove();
                            alert(`There is nothing to load`);
                        }
                    },
                    error: function() {
                        alert('Can\'t load more...');
                    }
                });
            }
        }
    });
});

//Initial homepage menu
function iniMenu(link) {
    $('#root').append(`<div class="loadingimg"><img src="../images/loading.gif" tag="Easy Web TV"></div>`);
    $("#menu").empty();
    if (link == 'http://www.mangakakalot.com/') {
        $.ajax({
            url: proxy[0] + `${link}`,
            data: {},
            type: "GET",
            dataType: "html",
            success: function(data) {
                var html = $.parseHTML(data.replace(/[\\"]/g, ''));
                var title = $(html).find('table tbody td a').slice(6).map((x, y) => y.lastChild.data);
                var target = $(html).find('table tbody td a').slice(6).map((x, y) => y.attributes[1].value.replace(/[\\"]/g, ''));
                $("#menu").append('<li style="background-color:#fff"><input id="search" type="text" placeholder="Search..." /></li>');
                for (let i = 1; i < title.length; i++) {
                    $("#menu").append(`<li><p><span class="${target[i]}">${title[i]}</span></p></li>`);
                }
            },
            error: function(xhr, status) {
                alert("Sorry, there was a problem!");
            },
            complete: function(xhr, status) {
                $.ajax({
                    url: proxy[0] + $('#menu li p span:eq(0)').attr('class'),
                    data: {},
                    type: "GET",
                    dataType: "html",
                    success: function(data) {
                        var html = $.parseHTML(data.replace(/[\\"]/g, ''));
                        var title = $(html).find('.list-truyen-item-wrap h3').map((x, y) => y.textContent.trim());
                        var code = $(html).find('.list-truyen-item-wrap h3 a').map((x, y) => y.href);
                        var pic = $(html).find('.list-truyen-item-wrap a img').map((x, y) => y.attributes[0].value);
                        $('.loadingimg').remove();
                        if ($(window).width() > 1024) {
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < pic.length; i++) {
                                if (i % 4 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                } else if (i % 4 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                } else if (i % 4 == 2) {
                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                } else if (i % 4 == 3) {
                                    $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                }
                            };
                        } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < pic.length; i++) {
                                if (i % 4 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                } else if (i % 4 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                } else if (i % 4 == 2) {
                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                } else if (i % 4 == 3) {
                                    $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                }
                            };
                        } else if ($(window).width() <= 640) {
                            $(`.itemContainer:eq(2)`).hide();
                            $(`.itemContainer:eq(3)`).hide();
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < pic.length; i++) {
                                if (i % 2 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                } else if (i % 2 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                }
                            }
                        }
                    },
                    error: function(xhr, status) {
                        alert("Sorry, there was a problem!");
                    },
                    complete: function(xhr, status) {
                        var searchlink = '';
                        $("#search").on('keyup', function(e) {
                            if (e.which == 13) {
                                $('.itemContainer').empty();
                                var valThis = $(this).val().toLowerCase();
                                searchlink = proxy[0] + `${link + 'search/story/' + valThis}`;
                                $.ajax({
                                    url: searchlink,
                                    data: {},
                                    type: "GET",
                                    dataType: "html",
                                    success: function(data) {
                                        var html = $.parseHTML(data.replace(/[\\"]/g, ''));
                                        var title = $(html).find('h3.story_name a').map((x, y) => y.innerText);
                                        var code = $(html).find('.story_item_right h3 a').map((x, y) => y.href);
                                        var pic = $(html).find('.story_item a img').map((x, y) => y.attributes[0].value);
                                        $('.loadingimg').remove();
                                        if ($(window).width() > 1024) {
                                            $(`.itemContainer:eq(4)`).hide();
                                            for (let i = 0; i < pic.length; i++) {
                                                if (i % 4 == 0) {
                                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                                } else if (i % 4 == 1) {
                                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                                } else if (i % 4 == 2) {
                                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                                } else if (i % 5 == 3) {
                                                    $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                                }
                                            };
                                        } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                                            $(`.itemContainer:eq(4)`).hide();
                                            for (let i = 0; i < pic.length; i++) {
                                                if (i % 4 == 0) {
                                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                                } else if (i % 4 == 1) {
                                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                                } else if (i % 4 == 2) {
                                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                                } else if (i % 4 == 3) {
                                                    $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                                }
                                            };
                                        } else if ($(window).width() <= 640) {
                                            $(`.itemContainer:eq(2)`).hide();
                                            $(`.itemContainer:eq(3)`).hide();
                                            $(`.itemContainer:eq(4)`).hide();
                                            for (let i = 0; i < pic.length; i++) {
                                                if (i % 2 == 0) {
                                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                                } else if (i % 2 == 1) {
                                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                                }
                                            }
                                        }
                                    },
                                    error: function(xhr, status) {
                                        alert("Sorry, there was a problem!");
                                    },
                                    complete: function(xhr, status) {

                                    }
                                });
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
        if (link == 'http://www.mangakakalot.com/') {
            className = e.originalEvent.target.className;
        }
        $('.hiddens').empty();
        $('.hiddens').append(`<p>${className}</p>`);
        $('#search').val('');
        $('#root').append(`<div class="loadingimg"><img src="../images/loading.gif" tag="Easy Web TV"></div>`);
        $.ajax({
            url: proxy[0] + className,
            type: "GET",
            dataType: "html",
            success: function(data) {
                var html = $.parseHTML(data.replace(/[\\"]/g, ''));
                var title = $(html).find('.list-truyen-item-wrap h3').map((x, y) => y.textContent.trim());
                var code = $(html).find('.list-truyen-item-wrap h3 a').map((x, y) => y.href);
                var pic = $(html).find('.list-truyen-item-wrap a img').map((x, y) => y.attributes[0].value);
                $(`.itemContainer`).empty();
                $('.loadingimg').remove();
                if ($(window).width() > 1024) {
                    $(`.itemContainer:eq(4)`).hide();
                    for (let i = 0; i < pic.length; i++) {
                        if (i % 4 == 0) {
                            $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                        } else if (i % 4 == 1) {
                            $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                        } else if (i % 5 == 2) {
                            $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                        } else if (i % 4 == 3) {
                            $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                        }
                    };
                } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                    $(`.itemContainer:eq(4)`).hide();
                    for (let i = 0; i < pic.length; i++) {
                        if (i % 4 == 0) {
                            $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                        } else if (i % 4 == 1) {
                            $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                        } else if (i % 4 == 2) {
                            $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                        } else if (i % 4 == 3) {
                            $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                        }
                    };
                } else if ($(window).width() <= 640) {
                    $(`.itemContainer:eq(2)`).hide();
                    $(`.itemContainer:eq(3)`).hide();
                    $(`.itemContainer:eq(4)`).hide();
                    for (let i = 0; i < pic.length; i++) {
                        if (i % 2 == 0) {
                            $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                        } else if (i % 2 == 1) {
                            $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                        }
                    }
                }
            },
            error: function() {

            }
        });
    });
};