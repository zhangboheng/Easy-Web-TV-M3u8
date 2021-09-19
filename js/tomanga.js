//Set global array proxy links to solve CORS errors
var proxy = {
    0: 'https://bird.ioliu.cn/v1?url=',
    1: 'https://cors.luckydesigner.workers.dev/?',
};
//Set global pagenum and random
var pnum = 1;
var rand = Math.floor(Math.random() * Object.keys(proxy).length);
$(document).ready(function() {
    //Append Select Options
    if (window.localStorage.getItem('bannedcountries') == 'true') {
        $('#selectapi').append(`
        <option value="https://mangabuddy.com/">mangabuddy</option>
        <option value="https://m.dmmhw.com/">耽美漫画(PC端)</option>
        `);
    } else {
        $('#selectapi').append(`
        <option value="https://mangabuddy.com/">mangabuddy</option>
        <option value="https://llmh27.com/">啦啦漫画</option>
        <option value="https://m.dmmhw.com/">耽美漫画(PC端)</option>
        `);
    }
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
            if (link == 'https://mangabuddy.com/') {
                if (sts.length > 0) {
                    globallink = proxy[1] + `${link + 'search?q=' + sts}` + `&page=${pnum}`;
                } else {
                    str = str == "0" ? link + `genres/action?page=${pnum}` : str + `?page=${pnum}`;
                    globallink = proxy[1] + str;
                }
                $.ajax({
                    url: globallink,
                    type: "GET",
                    dataType: "html",
                    success: function(data) {
                        var html = $.parseHTML(data);
                        var title = $(html).find('.title h3').map((x, y) => y.textContent.trim());
                        var code = $(html).find('.title h3 a').map((x, y) => link.slice(0, -1) + y.attributes[1].value);
                        var pic = $(html).find('.thumb a img').map((x, y) => 'https:' + y.attributes[2].value);
                        if (pnum <= 1000) {
                            $('.loadingimg').remove();
                            if ($(window).width() > 1024) {
                                $(`.itemContainer:eq(4)`).hide();
                                for (let i = 0; i < title.length; i++) {
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
                                $(`.itemContainer:eq(3)`).hide();
                                $(`.itemContainer:eq(4)`).hide();
                                for (let i = 0; i < title.length; i++) {
                                    if (i % 3 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                    } else if (i % 3 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                    } else if (i % 3 == 2) {
                                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                    }
                                };
                            } else if ($(window).width() <= 640) {
                                $(`.itemContainer:eq(2)`).hide();
                                $(`.itemContainer:eq(3)`).hide();
                                $(`.itemContainer:eq(4)`).hide();
                                for (let i = 0; i < title.length; i++) {
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
            } else if (link == 'https://m.dmmhw.com/') {
                if (sts.length > 0) {
                    $('.loadingimg').remove();
                    return;
                } else {
                    str = str == "0" ? link + `xiaoshuodaquan/page_${pnum}.html` : str + `page_${pnum}.html`;
                    globallink = proxy[1] + str;
                    $.ajax({
                        url: globallink,
                        type: "GET",
                        dataType: "html",
                        success: function(data) {
                            var html = $.parseHTML(data);
                            var title = $(html).find('.pt-name a').map((x, y) => y.innerText);
                            var code = $(html).find('.pt-name a').map((x, y) => link.slice(0, -1) + y.attributes[0].value);
                            var pic = $(html).find('.pt-cover img').map((x, y) => y.attributes[2].value);
                            if (pnum <= 30) {
                                $('.loadingimg').remove();
                                $(`.itemContainer:eq(4)`).show();
                                if ($(window).width() > 1024) {
                                    for (let i = 0; i < pic.length; i++) {
                                        if (i % 5 == 0) {
                                            $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[1] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                        } else if (i % 5 == 1) {
                                            $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[1] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                        } else if (i % 5 == 2) {
                                            $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[1] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                        } else if (i % 5 == 3) {
                                            $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[1] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                        } else if (i % 5 == 4) {
                                            $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[1] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                        }
                                    };
                                } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                                    return;
                                } else if ($(window).width() <= 640) {
                                    return;
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
            } else if (link == 'https://llmh27.com/') {
                str = str == "0" ? link + `json/comic/?ticai=61` : link + `json/comic/?ticai=${str}`;
                globallink = proxy[0] + str;
                $.ajax({
                    url: globallink,
                    data: {
                        ph: '1',
                        tempid: '2',
                        classid: '1',
                        page: pnum,
                        orderby: 'diggtop',
                        line: '10'
                    },
                    type: "GET",
                    dataType: "json",
                    success: function(data) {
                        var parse = data.data;
                        $('.loadingimg').remove();
                        $(`.itemContainer:eq(4)`).show();
                        if ($(window).width() > 1024) {
                            for (let i = 0; i < parse.length; i++) {
                                if (i % 5 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                                } else if (i % 5 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                                } else if (i % 5 == 2) {
                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                                } else if (i % 5 == 3) {
                                    $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                                } else if (i % 5 == 4) {
                                    $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                                }
                            };
                        } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                            $(`.itemContainer:eq(3)`).hide();
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < parse.length; i++) {
                                if (i % 3 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                                } else if (i % 3 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                                } else if (i % 3 == 2) {
                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                                }
                            };
                        } else if ($(window).width() <= 640) {
                            $(`.itemContainer:eq(2)`).hide();
                            $(`.itemContainer:eq(3)`).hide();
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < parse.length; i++) {
                                if (i % 2 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                                } else if (i % 2 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                                }
                            };
                        }
                    },
                    error: function(xhr, status) {
                        $('.loadingimg').remove();
                        setTimeout(() => {
                            alert("Sorry, there was a problem!");
                        }, 3000);
                    },
                });
            }
        }
    });
});

//Initial homepage menu
function iniMenu(link) {
    $('#root').append(`<div class="loadingimg"><img src="../images/loading.gif" tag="Easy Web TV"></div>`);
    $("#menu").empty();
    if (link == 'https://mangabuddy.com/') {
        $.ajax({
            url: proxy[1] + `${link}`,
            data: {},
            type: "GET",
            dataType: "html",
            success: function(data) {
                var html = $.parseHTML(data);
                var title = $(html).find('ul.genres__wrapper.clearfix li a').slice(3, -2).map((x, y) => y.innerText);
                var target = $(html).find('ul.genres__wrapper.clearfix li a').slice(3, -2).map((x, y) => link.slice(0, -1) + y.attributes[0].value);
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
                    url: proxy[1] + $('#menu li p span:eq(0)').attr('class'),
                    data: {},
                    type: "GET",
                    dataType: "html",
                    success: function(data) {
                        var html = $.parseHTML(data);
                        var title = $(html).find('.title h3').map((x, y) => y.textContent.trim());
                        var code = $(html).find('.title h3 a').map((x, y) => link.slice(0, -1) + y.attributes[1].value);
                        var pic = $(html).find('.thumb a img').map((x, y) => 'https:' + y.attributes[2].value);
                        $('.loadingimg').remove();
                        if ($(window).width() > 1024) {
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < title.length; i++) {
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
                            $(`.itemContainer:eq(3)`).hide();
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < title.length; i++) {
                                if (i % 3 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                } else if (i % 3 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                } else if (i % 3 == 2) {
                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                }
                            };
                        } else if ($(window).width() <= 640) {
                            $(`.itemContainer:eq(2)`).hide();
                            $(`.itemContainer:eq(3)`).hide();
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < title.length; i++) {
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
                                searchlink = proxy[1] + `${link + 'search?q=' + valThis}`;
                                $.ajax({
                                    url: searchlink,
                                    data: {},
                                    type: "GET",
                                    dataType: "html",
                                    success: function(data) {
                                        var html = $.parseHTML(data);
                                        var title = $(html).find('.title h3').map((x, y) => y.textContent.trim());
                                        var code = $(html).find('.title h3 a').map((x, y) => link.slice(0, -1) + y.attributes[1].value);
                                        var pic = $(html).find('.thumb a img').map((x, y) => 'https:' + y.attributes[2].value);
                                        $('.loadingimg').remove();
                                        if ($(window).width() > 1024) {
                                            $(`.itemContainer:eq(4)`).hide();
                                            for (let i = 0; i < title.length; i++) {
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
                                            $(`.itemContainer:eq(3)`).hide();
                                            $(`.itemContainer:eq(4)`).hide();
                                            for (let i = 0; i < title.length; i++) {
                                                if (i % 3 == 0) {
                                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                                } else if (i % 3 == 1) {
                                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                                } else if (i % 3 == 2) {
                                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                                }
                                            };
                                        } else if ($(window).width() <= 640) {
                                            $(`.itemContainer:eq(2)`).hide();
                                            $(`.itemContainer:eq(3)`).hide();
                                            $(`.itemContainer:eq(4)`).hide();
                                            for (let i = 0; i < title.length; i++) {
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
    } else if (link == 'https://m.dmmhw.com/') {
        $.ajax({
            url: proxy[1] + `${link + 'xiaoshuodaquan'}`,
            data: {},
            type: "GET",
            dataType: "html",
            success: function(data) {
                var html = $.parseHTML(data);
                var title = $(html).find('.categories.ptm-clearfix li a').map((x, y) => y.innerText);
                var target = $(html).find('.categories.ptm-clearfix li a').map((x, y) => link.slice(0, -1) + y.attributes[0].value);
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
                    url: proxy[1] + $('#menu li p span:eq(0)').attr('class'),
                    data: {},
                    type: "GET",
                    dataType: "html",
                    success: function(data) {
                        var html = $.parseHTML(data);
                        var title = $(html).find('.pt-name a').map((x, y) => y.innerText);
                        var code = $(html).find('.pt-name a').map((x, y) => link.slice(0, -1) + y.attributes[0].value);
                        var pic = $(html).find('.pt-cover img').map((x, y) => y.attributes[2].value);
                        $('.loadingimg').remove();
                        $(`.itemContainer:eq(4)`).show();
                        if ($(window).width() > 1024) {
                            for (let i = 0; i < pic.length; i++) {
                                if (i % 5 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                } else if (i % 5 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                } else if (i % 5 == 2) {
                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                } else if (i % 5 == 3) {
                                    $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                } else if (i % 5 == 4) {
                                    $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                }
                            };
                        } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                            return;
                        } else if ($(window).width() <= 640) {
                            return;
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
                                searchlink = proxy[1] + `${link + 'home/search?action=search&q=' + valThis}`;
                                $.ajax({
                                    url: searchlink,
                                    data: {},
                                    type: "GET",
                                    dataType: "html",
                                    success: function(data) {
                                        var html = $.parseHTML(data);
                                        var title = $(html).find('.ptm-card').slice(1).find('.imgarea a').map((x, y) => y.attributes[1].value);
                                        var code = $(html).find('.ptm-card').slice(1).find('.imgarea a').map((x, y) => link.slice(0, -1) + y.attributes[0].value);
                                        var pic = $(html).find('.ptm-card').slice(1).find('.imgarea img').map((x, y) => y.attributes[3].value);
                                        $('.loadingimg').remove();
                                        $(`.itemContainer:eq(3)`).hide();
                                        $(`.itemContainer:eq(4)`).hide();
                                        if ($(window).width() > 1024) {
                                            for (let i = 0; i < pic.length; i++) {
                                                if (i % 5 == 0) {
                                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                                } else if (i % 5 == 1) {
                                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                                } else if (i % 5 == 2) {
                                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                                }
                                            };
                                        } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                                            return;
                                        } else if ($(window).width() <= 640) {
                                            return;
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
    } else if (link == 'https://llmh27.com/') {
        $("#menu").append('<li style="background-color:#fff"><input id="search" type="text" placeholder="No Support..." disabled/></li>');
        $("#menu").append(`
        <li><p><span class="61">剧情</span></p></li>
        <li><p><span class="62">浪漫爱情</span></p></li>
        <li><p><span class="63">校园</span></p></li>
        <li><p><span class="64">奇幻冒险</span></p></li>
        <li><p><span class="65">恐怖</span></p></li>
        <li><p><span class="66">惊悚</span></p></li>
        <li><p><span class="67">BL</span></p></li>
        <li><p><span class="68">幽默搞笑</span></p></li>
        <li><p><span class="69">动作</span></p></li>
        <li><p><span class="70">科幻</span></p></li>
        <li><p><span class="71">古风穿越</span></p></li>
        <li><p><span class="72">其他</span></p></li>
        `);
        $.ajax({
            url: proxy[0] + link + 'json/comic/',
            data: {
                ph: '1',
                tempid: '2',
                classid: '1',
                page: '0',
                ticai: '61',
                orderby: 'diggtop',
                line: '20'
            },
            type: "GET",
            dataType: "json",
            success: function(data) {
                var prefy = data.replace("}{", "},{");
                var parse = JSON.parse(prefy).data;
                $('.loadingimg').remove();
                $(`.itemContainer:eq(4)`).show();
                if ($(window).width() > 1024) {
                    for (let i = 0; i < parse.length; i++) {
                        if (i % 5 == 0) {
                            $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                        } else if (i % 5 == 1) {
                            $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                        } else if (i % 5 == 2) {
                            $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                        } else if (i % 5 == 3) {
                            $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                        } else if (i % 5 == 4) {
                            $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                        }
                    };
                } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                    $(`.itemContainer:eq(3)`).hide();
                    $(`.itemContainer:eq(4)`).hide();
                    for (let i = 0; i < parse.length; i++) {
                        if (i % 3 == 0) {
                            $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                        } else if (i % 3 == 1) {
                            $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                        } else if (i % 3 == 2) {
                            $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                        }
                    };
                } else if ($(window).width() <= 640) {
                    $(`.itemContainer:eq(2)`).hide();
                    $(`.itemContainer:eq(3)`).hide();
                    $(`.itemContainer:eq(4)`).hide();
                    for (let i = 0; i < parse.length; i++) {
                        if (i % 2 == 0) {
                            $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                        } else if (i % 2 == 1) {
                            $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                        }
                    };
                }
            },
            error: function(xhr, status) {
                setTimeout(() => {
                    alert("Sorry, there was a problem!");
                }, 3000);
            },
        });
    }
    //Click to choose category
    $('#menu').on("click", "span", function(e) {
        var className;
        className = e.originalEvent.target.className;
        $('.hiddens').empty();
        $('.hiddens').append(`<p>${className}</p>`);
        $('#search').val('');
        $('#root').append(`<div class="loadingimg"><img src="../images/loading.gif" tag="Easy Web TV"></div>`);
        if (link == 'https://llmh27.com/') {
            $.ajax({
                url: proxy[0] + link + 'json/comic/',
                data: {
                    ph: '1',
                    tempid: '2',
                    classid: '1',
                    page: '0',
                    ticai: className,
                    orderby: 'diggtop',
                    line: '20'
                },
                type: "GET",
                dataType: "json",
                success: function(data) {
                    if (Number(className) > 63) {
                        var parse = data.data;
                    } else {
                        var prefy = data.replace("}{", "},{");
                        var parse = JSON.parse(prefy).data;
                    }
                    $('.loadingimg').remove();
                    $(`.itemContainer`).empty();
                    $(`.itemContainer:eq(4)`).show();
                    if ($(window).width() > 1024) {
                        for (let i = 0; i < parse.length; i++) {
                            if (i % 5 == 0) {
                                $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                            } else if (i % 5 == 1) {
                                $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                            } else if (i % 5 == 2) {
                                $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                            } else if (i % 5 == 3) {
                                $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                            } else if (i % 5 == 4) {
                                $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                            }
                        };
                    } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                        $(`.itemContainer:eq(3)`).hide();
                        $(`.itemContainer:eq(4)`).hide();
                        for (let i = 0; i < parse.length; i++) {
                            if (i % 3 == 0) {
                                $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                            } else if (i % 3 == 1) {
                                $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                            } else if (i % 3 == 2) {
                                $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                            }
                        };
                    } else if ($(window).width() <= 640) {
                        $(`.itemContainer:eq(2)`).hide();
                        $(`.itemContainer:eq(3)`).hide();
                        $(`.itemContainer:eq(4)`).hide();
                        for (let i = 0; i < parse.length; i++) {
                            if (i % 2 == 0) {
                                $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                            } else if (i % 2 == 1) {
                                $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${link + 'comic/'+parse[i].Id}"><div class="item"><img class="itemImg" src="${parse[i].ImgUrl}" alt="${parse[i].Title}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${parse[i].Title}</span></div></div></a>`)
                            }
                        };
                    }
                },
                error: function() {
                    setTimeout(() => {
                        alert("Sorry, there was a problem!");
                    }, 3000);
                }
            });
        } else {
            $.ajax({
                url: proxy[1] + className,
                type: "GET",
                dataType: "html",
                success: function(data) {
                    var html = $.parseHTML(data);
                    if (link == 'https://mangabuddy.com/') {
                        var title = $(html).find('.title h3').map((x, y) => y.textContent.trim());
                        var code = $(html).find('.title h3 a').map((x, y) => link.slice(0, -1) + y.attributes[1].value);
                        var pic = $(html).find('.thumb a img').map((x, y) => 'https:' + y.attributes[2].value);
                        $('.loadingimg').remove();
                        $(`.itemContainer`).empty();
                        if ($(window).width() > 1024) {
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < title.length; i++) {
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
                            $(`.itemContainer:eq(3)`).hide();
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < title.length; i++) {
                                if (i % 3 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                } else if (i % 3 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                } else if (i % 3 == 2) {
                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                }
                            };
                        } else if ($(window).width() <= 640) {
                            $(`.itemContainer:eq(2)`).hide();
                            $(`.itemContainer:eq(3)`).hide();
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < title.length; i++) {
                                if (i % 2 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                } else if (i % 2 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                }
                            }
                        }
                    } else if (link == 'https://m.dmmhw.com/') {
                        var title = $(html).find('.pt-name a').map((x, y) => y.innerText);
                        var code = $(html).find('.pt-name a').map((x, y) => link.slice(0, -1) + y.attributes[0].value);
                        var pic = $(html).find('.pt-cover img').map((x, y) => y.attributes[2].value);
                        $('.loadingimg').remove();
                        $(`.itemContainer`).empty();
                        $(`.itemContainer:eq(4)`).show();
                        if ($(window).width() > 1024) {
                            for (let i = 0; i < pic.length; i++) {
                                if (i % 5 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[1] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                } else if (i % 5 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[1] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                } else if (i % 5 == 2) {
                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[1] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                } else if (i % 5 == 3) {
                                    $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[1] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                } else if (i % 5 == 4) {
                                    $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[1] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
                                }
                            };
                        } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                            return;
                        } else if ($(window).width() <= 640) {
                            return;
                        }
                    }
                },
                error: function() {

                }
            });
        }
    });
};