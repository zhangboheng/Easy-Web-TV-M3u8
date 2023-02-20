//Set global array proxy links to solve CORS error
var proxy = {
    0: 'https://cors.luckydesigner.workers.dev/?',
    1: 'https://bird.ioliu.cn/v1?url='
};
//Set global pagenum and random
var pnum = 1;
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
        let ms = window.localStorage.getItem('novel').split(",");
        let arr = ["novelonlinefull", "95sb"];
        let lst = arr.filter(x => ms.includes(x)).map(x => arr.indexOf(x));
        let sts = ['<option value="https://novelonlinefull.com/">novelonlinefull</option>',
            '<option value="http://www.95shubao.net/">95书包</option>'
        ];
        for (let i of lst) {
            $('#selectapi').append(sts[i]);
        }
    } catch (e) {
        $('#selectapi').append(`
            <option value="https://novelonlinefull.com/">novelonlinefull</option>
            <option value="http://www.95shubao.net/">95书包</option>
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
            if (link == 'http://www.95shubao.net/') {
                if (sts.length > 0) {
                    $('.loadingimg').remove();
                } else {
                    str = str == "0" ? `mulu/1-${pnum}.html` : str.split('-')[0] + '-' + pnum + '.html';
                    globallink = proxy[rand] + link + str;
                }
                $.ajax({
                    url: globallink,
                    type: "GET",
                    dataType: "html",
                    success: function(data) {
                        var html = $.parseHTML(data);
                        var title = $(html).find('.title h2 a').map((x, y) => y.lastChild.data);
                        var code = $(html).find('.title h2 a').map((x, y) => y.href.replace(link, ''));
                        var pic = $(html).find('.pic a img').map((x, y) => y.attributes.src.value);
                        var author = $(html).find('.title span a').map((x, y) => y.lastChild.data);
                        var lastpage = $(html).find('.last').text();
                        if (pnum <= Number(lastpage)) {
                            $('.loadingimg').remove();
                            if ($(window).width() > 1024) {
                                for (let i = 0; i < pic.length; i++) {
                                    if (i % 5 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                    } else if (i % 5 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                    } else if (i % 5 == 2) {
                                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                    } else if (i % 5 == 3) {
                                        $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                    } else if (i % 5 == 4) {
                                        $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                    }
                                };
                            } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                                $(`.itemContainer:eq(3)`).hide();
                                $(`.itemContainer:eq(4)`).hide();
                                for (let i = 0; i < pic.length; i++) {
                                    if (i % 3 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                    } else if (i % 3 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                    } else if (i % 3 == 2) {
                                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                    }
                                };
                            } else if ($(window).width() <= 640) {
                                $(`.itemContainer:eq(2)`).hide();
                                $(`.itemContainer:eq(3)`).hide();
                                $(`.itemContainer:eq(4)`).hide();
                                for (let i = 0; i < pic.length; i++) {
                                    if (i % 2 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                    } else if (i % 2 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
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
            } else if (link == 'https://novelonlinefull.com/') {
                if (sts.length > 0) {
                    globallink = proxy[rand] + link + 'search_novels/' + `${sts}?page=${pnum}`;
                } else {
                    str = str == "0" ? link + `novel_list?type=latest&category=1&state=all&page=${pnum}` : str.split('&amp;').slice(0, 3).join('&') + `&page=${pnum}`;
                    globallink = proxy[rand] + str;
                }
                $.ajax({
                    url: globallink,
                    type: "GET",
                    dataType: "html",
                    success: function(data) {
                        var html = $.parseHTML(data);
                        var title = $(html).find('.update_item_right h3').map((x, y) => y.textContent.trim());
                        var code = $(html).find('.update_item_right h3 a').map((x, y) => y.href);
                        var pic = $(html).find('.update_item.list_category img').map((x, y) => y.attributes[0].value);
                        var author = $(html).find('.update_item_right span').filter((x, y) => x % 3 == 0).map((x, y) => y.textContent);
                        var lastpage = $(html).find('.group-page a').filter((x, y) => x == $(html).find('.group-page a').length - 1).text().replace(/[^\d]/g, '');
                        if (pnum <= Number(lastpage)) {
                            $('.loadingimg').remove();
                            if ($(window).width() > 1024) {
                                for (let i = 0; i < pic.length; i++) {
                                    if (i % 5 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                    } else if (i % 5 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                    } else if (i % 5 == 2) {
                                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                    } else if (i % 5 == 3) {
                                        $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                    } else if (i % 5 == 4) {
                                        $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                    }
                                };
                            } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                                $(`.itemContainer:eq(4)`).hide();
                                for (let i = 0; i < pic.length; i++) {
                                    if (i % 4 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                    } else if (i % 4 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                    } else if (i % 4 == 2) {
                                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                    } else if (i % 4 == 3) {
                                        $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                    }
                                };
                            } else if ($(window).width() <= 640) {
                                $(`.itemContainer:eq(2)`).hide();
                                $(`.itemContainer:eq(3)`).hide();
                                $(`.itemContainer:eq(4)`).hide();
                                for (let i = 0; i < pic.length; i++) {
                                    if (i % 2 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                    } else if (i % 2 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
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
    if (link == 'http://www.95shubao.net/') {
        $.ajax({
            url: proxy[rand] + `${link}`,
            data: {},
            type: "GET",
            dataType: "html",
            success: function(data) {
                var html = $.parseHTML(data);
                var title = $(html).find('.nav ul li a').map((x, y) => y.lastChild.data);
                var target = $(html).find('.nav ul li a').map((x, y) => y.attributes[0].value);
                $("#menu").append('<li style="background-color:#fff"><input id="search" type="text" placeholder="Search..." /></li>');
                for (let i = 1; i < title.length; i++) {
                    $("#menu").append(`<li><p><span class="${target[i]}">${title[i]}</span></p></li>`);
                }
            },
            error: function(xhr, status) {
                alert("Sorry, there was a problem!");
            },
            complete: function(xhr, status) {
                $("#menu li:eq(1)").addClass("bd");
                $("#menu li:gt(1)").on('click', function(){
                    $(this).addClass("bd").siblings().removeClass("bd");
                });
                $.ajax({
                    url: proxy[rand] + `${link + $('#menu li p span:eq(0)').attr('class').slice(1)}`,
                    data: {},
                    type: "GET",
                    dataType: "html",
                    success: function(data) {
                        var html = $.parseHTML(data);
                        var title = $(html).find('.title h2 a').map((x, y) => y.lastChild.data);
                        var code = $(html).find('.title h2 a').map((x, y) => y.href.replace(link, ''));
                        var pic = $(html).find('.pic a img').map((x, y) => y.attributes.src.value);
                        var author = $(html).find('.title span a').map((x, y) => y.lastChild.data);
                        $('.loadingimg').remove();
                        if ($(window).width() > 1024) {
                            for (let i = 0; i < pic.length; i++) {
                                if (i % 5 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                } else if (i % 5 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                } else if (i % 5 == 2) {
                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                } else if (i % 5 == 3) {
                                    $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                } else if (i % 5 == 4) {
                                    $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                }
                            };
                        } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                            $(`.itemContainer:eq(3)`).hide();
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < pic.length; i++) {
                                if (i % 3 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                } else if (i % 3 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                } else if (i % 3 == 2) {
                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                }
                            };
                        } else if ($(window).width() <= 640) {
                            $(`.itemContainer:eq(2)`).hide();
                            $(`.itemContainer:eq(3)`).hide();
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < pic.length; i++) {
                                if (i % 2 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                } else if (i % 2 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
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
                                searchlink = proxy[rand] + `${link + 'modules/article/search.php?searchkey=' + valThis}`;
                                $.ajax({
                                    url: searchlink,
                                    data: {},
                                    type: "GET",
                                    dataType: "html",
                                    success: function(data) {
                                        var html = $.parseHTML(data);
                                        var title = $(html).find('td:first-child').find('a').map((x, y) => y.lastChild.data);
                                        var code = $(html).find('td:first-child').find('a').map((x, y) => y.href.replace(link, ''));
                                        var author = $(html).find('.odd').filter(x => x % 3 == 1).map((x, y) => y.lastChild.data);
                                        if ($(window).width() > 1024) {
                                            for (let i = 0; i < title.length; i++) {
                                                if (i % 5 == 0) {
                                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="../images/noimage.jpeg" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                                } else if (i % 5 == 1) {
                                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="../images/noimage.jpeg" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                                } else if (i % 5 == 2) {
                                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="../images/noimage.jpeg" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                                } else if (i % 5 == 3) {
                                                    $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="../images/noimage.jpeg" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                                } else if (i % 5 == 4) {
                                                    $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="../images/noimage.jpeg" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                                }
                                            };
                                        } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                                            $(`.itemContainer:eq(3)`).hide();
                                            $(`.itemContainer:eq(4)`).hide();
                                            for (let i = 0; i < title.length; i++) {
                                                if (i % 3 == 0) {
                                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="../images/noimage.jpeg" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                                } else if (i % 3 == 1) {
                                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="../images/noimage.jpeg" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                                } else if (i % 3 == 2) {
                                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="../images/noimage.jpeg" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                                }
                                            };
                                        } else if ($(window).width() <= 640) {
                                            $(`.itemContainer:eq(2)`).hide();
                                            $(`.itemContainer:eq(3)`).hide();
                                            $(`.itemContainer:eq(4)`).hide();
                                            for (let i = 0; i < title.length; i++) {
                                                if (i % 2 == 0) {
                                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="../images/noimage.jpeg" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                                } else if (i % 2 == 1) {
                                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="../images/noimage.jpeg" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
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
                        })
                    }
                });
            }
        });
    } else if (link == 'https://novelonlinefull.com/') {
        $.ajax({
            url: proxy[0] + `${link}`,
            data: {},
            type: "GET",
            dataType: "html",
            success: function(data) {
                var html = $.parseHTML(data);
                var title = $(html).find('table tbody td a').slice(6).map((x, y) => y.lastChild.data);
                var target = $(html).find('table tbody td a').slice(6).map((x, y) => y.attributes[0].value.replace(/[\\"]/g, ''));
                $("#menu").append('<li style="background-color:#fff"><input id="search" type="text" placeholder="Search..." /></li>');
                for (let i = 1; i < title.length; i++) {
                    $("#menu").append(`<li><p><span class="${target[i]}">${title[i]}</span></p></li>`);
                }
            },
            error: function(xhr, status) {
                alert("Sorry, there was a problem!");
            },
            complete: function(xhr, status) {
                $("#menu li:eq(1)").addClass("bd");
                $("#menu li:gt(1)").on('click', function(){
                    $(this).addClass("bd").siblings().removeClass("bd");
                });
                $.ajax({
                    url: proxy[rand] + $('#menu li p span:eq(0)').attr('class'),
                    data: {},
                    type: "GET",
                    dataType: "html",
                    success: function(data) {
                        var html = $.parseHTML(data);
                        var title = $(html).find('.update_item_right h3').map((x, y) => y.textContent.trim());
                        var code = $(html).find('.update_item_right h3 a').map((x, y) => y.href);
                        var pic = $(html).find('.update_item.list_category img').map((x, y) => y.attributes[0].value);
                        var author = $(html).find('.update_item_right span').filter((x, y) => x % 3 == 0).map((x, y) => y.textContent);
                        $('.loadingimg').remove();
                        if ($(window).width() > 1024) {
                            for (let i = 0; i < pic.length; i++) {
                                if (i % 5 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                } else if (i % 5 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                } else if (i % 5 == 2) {
                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                } else if (i % 5 == 3) {
                                    $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                } else if (i % 5 == 4) {
                                    $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                }
                            };
                        } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < pic.length; i++) {
                                if (i % 4 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                } else if (i % 4 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                } else if (i % 4 == 2) {
                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                } else if (i % 4 == 3) {
                                    $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                }
                            };
                        } else if ($(window).width() <= 640) {
                            $(`.itemContainer:eq(2)`).hide();
                            $(`.itemContainer:eq(3)`).hide();
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < pic.length; i++) {
                                if (i % 2 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                } else if (i % 2 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
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
                                searchlink = proxy[rand] + `${link + 'search_novels/' + valThis}`;
                                $.ajax({
                                    url: searchlink,
                                    data: {},
                                    type: "GET",
                                    dataType: "html",
                                    success: function(data) {
                                        var html = $.parseHTML(data);
                                        var title = $(html).find('.update_item_right h3').map((x, y) => y.textContent.trim());
                                        var code = $(html).find('.update_item_right h3 a').map((x, y) => y.href);
                                        var pic = $(html).find('.update_item.list_category img').map((x, y) => y.attributes[0].value);
                                        var author = $(html).find('.update_item_right span').filter((x, y) => x % 3 == 0).map((x, y) => y.textContent);
                                        $('.loadingimg').remove();
                                        if ($(window).width() > 1024) {
                                            for (let i = 0; i < pic.length; i++) {
                                                if (i % 5 == 0) {
                                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                                } else if (i % 5 == 1) {
                                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                                } else if (i % 5 == 2) {
                                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                                } else if (i % 5 == 3) {
                                                    $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                                } else if (i % 5 == 4) {
                                                    $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                                }
                                            };
                                        } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                                            $(`.itemContainer:eq(4)`).hide();
                                            for (let i = 0; i < pic.length; i++) {
                                                if (i % 4 == 0) {
                                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                                } else if (i % 4 == 1) {
                                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                                } else if (i % 4 == 2) {
                                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                                } else if (i % 4 == 3) {
                                                    $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                                }
                                            };
                                        } else if ($(window).width() <= 640) {
                                            $(`.itemContainer:eq(2)`).hide();
                                            $(`.itemContainer:eq(3)`).hide();
                                            $(`.itemContainer:eq(4)`).hide();
                                            for (let i = 0; i < pic.length; i++) {
                                                if (i % 2 == 0) {
                                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                                                } else if (i % 2 == 1) {
                                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
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
        if (link == 'http://www.95shubao.net/') {
            className = link + e.originalEvent.target.className.slice(1);
        } else if (link == 'https://novelonlinefull.com/') {
            className = e.originalEvent.target.className;
        }
        $('.hiddens').empty();
        $('.hiddens').append(`<p>${className}</p>`);
        $('#search').val('');
        $('#root').append(`<div class="loadingimg"><img src="../images/loading.gif" tag="Easy Web TV"></div>`);
        $.ajax({
            url: proxy[rand] + className,
            type: "GET",
            dataType: "html",
            success: function(data) {
                var html = $.parseHTML(data);
                if (link == 'http://www.xfjxs.com/') {
                    var title = $(html).find('.title h2 a').map((x, y) => y.lastChild.data);
                    var code = $(html).find('.title h2 a').map((x, y) => y.href.replace(link, ''));
                    var pic = $(html).find('.pic a img').map((x, y) => y.attributes.src.value);
                    var author = $(html).find('.title span a').map((x, y) => y.lastChild.data);
                } else if (link == 'https://novelonlinefull.com/') {
                    var title = $(html).find('.update_item_right h3').map((x, y) => y.textContent.trim());
                    var code = $(html).find('.update_item_right h3 a').map((x, y) => y.href);
                    var pic = $(html).find('.update_item.list_category img').map((x, y) => y.attributes[0].value);
                    var author = $(html).find('.update_item_right span').filter((x, y) => x % 3 == 0).map((x, y) => y.textContent);
                }
                $('.loadingimg').remove();
                $('.itemContainer').empty();
                if ($(window).width() > 1024) {
                    for (let i = 0; i < pic.length; i++) {
                        if (link == 'http://www.xfjxs.com/') {
                            if (i % 5 == 0) {
                                $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                            } else if (i % 5 == 1) {
                                $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                            } else if (i % 5 == 2) {
                                $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                            } else if (i % 5 == 3) {
                                $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                            } else if (i % 5 == 4) {
                                $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                            }
                        } else if (link == 'https://novelonlinefull.com/') {
                            if (i % 5 == 0) {
                                $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                            } else if (i % 5 == 1) {
                                $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                            } else if (i % 5 == 2) {
                                $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                            } else if (i % 5 == 3) {
                                $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                            } else if (i % 5 == 4) {
                                $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                            }
                        }
                    };
                } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                    if (link == 'http://www.xfjxs.com/') {
                        $(`.itemContainer:eq(3)`).hide();
                        $(`.itemContainer:eq(4)`).hide();
                        for (let i = 0; i < pic.length; i++) {
                            if (i % 3 == 0) {
                                $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                            } else if (i % 3 == 1) {
                                $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                            } else if (i % 3 == 2) {
                                $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                            }
                        };
                    } else if (link == 'https://novelonlinefull.com/') {
                        $(`.itemContainer:eq(4)`).hide();
                        for (let i = 0; i < pic.length; i++) {
                            if (i % 4 == 0) {
                                $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                            } else if (i % 4 == 1) {
                                $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                            } else if (i % 4 == 2) {
                                $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                            } else if (i % 4 == 3) {
                                $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                            }
                        };
                    }
                } else if ($(window).width() <= 640) {
                    $(`.itemContainer:eq(2)`).hide();
                    $(`.itemContainer:eq(3)`).hide();
                    $(`.itemContainer:eq(4)`).hide();
                    for (let i = 0; i < pic.length; i++) {
                        if (link == 'http://www.xfjxs.com/') {
                            if (i % 2 == 0) {
                                $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                            } else if (i % 2 == 1) {
                                $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${link + code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                            }
                        } else if (link == 'https://novelonlinefull.com/') {
                            if (i % 2 == 0) {
                                $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                            } else if (i % 2 == 1) {
                                $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/novelplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${proxy[0] + pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">[${author[i]}]${title[i]}</span></div></div></a>`)
                            }
                        }
                    }
                }
            },
            error: function() {

            }
        });
    });
};
