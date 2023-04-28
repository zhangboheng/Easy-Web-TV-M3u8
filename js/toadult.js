//Set global array proxy links to solve CORS error
var proxy = {
    0: 'https://cors.luckydesigner.workers.dev/?',
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
        let ms = window.localStorage.getItem('porn').split(",");
        let arr = ["zmwzy", "fedzy", "javmy", "hyzy", "sszy", "jjzy", "lsnzy", "bttzy", "llzy"];
        let lst = arr.filter(x => ms.includes(x)).map(x => arr.indexOf(x));
        let sts = ['<option value="http://f2dcj6.com/sapi/json?ac=list">富二代资源网</option>',
            '<option value="http://mygzycj.com/sapi.php?ac=jsonvideolist">JAV名优资源站</option>',
            '<option value="http://wmcj8.com/inc/jsonsapi.php?ac=videolist">环亚资源站</option>',
            '<option value="http://secj8.com/inc/jsonsapi.php?ac=videolist">色色资源网</option>',
            '<option value="http://99zywcj.com/inc/jsonsapi.php?ac=videolist">玖玖资源站</option>',
            '<option value="http://cjmygzy.com/inc/jsonsapi.php?ac=videolist">狼少年资源站</option>',
            '<option value="http://bttcj.com/inc/jsonsapi.php?ac=videolist">博天堂资源站</option>',
            '<option value="http://llzxcj.com/inc/json.php?ac=videolist">利来资源站</option>',
            '<option value="http://zmcj88.com/sapi/json?ac=list">字幕网资源站</option>',
        ];
        for (let i of lst) {
            $('#selectapi').append(sts[i]);
        }
    } catch (e) {
        $('#selectapi').append(`
            <option value="http://f2dcj6.com/sapi/json?ac=list">富二代资源网</option>
            <option value="http://mygzycj.com/sapi.php?ac=jsonvideolist">JAV名优资源站</option>
            <option value="http://wmcj8.com/inc/jsonsapi.php?ac=videolist">环亚资源站</option>
            <option value="http://secj8.com/inc/jsonsapi.php?ac=videolist">色色资源网</option>
            <option value="http://99zywcj.com/inc/jsonsapi.php?ac=videolist">玖玖资源站</option>
            <option value="http://cjmygzy.com/inc/jsonsapi.php?ac=videolist">狼少年资源站</option>
            <option value="http://bttcj.com/inc/jsonsapi.php?ac=videolist">博天堂资源站</option>
            <option value="http://llzxcj.com/inc/json.php?ac=videolist">利来资源站</option>
            <option value="http://zmcj88.com/sapi/json?ac=list">字幕网资源站</option>
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
    //Reinitial page num
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
        var globallink
        if (positionValue <= 0 && positionValue >= -50) {
            $('#root').append(`<div class="loadingimg"><img src="../images/loading.gif" tag="Easy Web TV"></div>`);
            pnum++;
            if (sts.length > 0) {
                if (link == "http://secj8.com/inc/jsonsapi.php?ac=videolist") {
                    kt[0].value = '';
                    alert('色色资源网 not support search');
                } else if (link == "http://99zywcj.com/inc/jsonsapi.php?ac=videolist") {
                    kt[0].value = '';
                    alert('玖玖资源站 not support search');
                } else if (link == "http://cjmygzy.com/inc/jsonsapi.php?ac=videolist") {
                    kt[0].value = '';
                    alert('狼少年资源站 not support search');
                } else if (link == "http://wmcj8.com/inc/jsonsapi.php?ac=videolist") {
                    kt[0].value = '';
                    alert('环亚资源站 not support search');
                } else if (link == "http://bttcj.com/inc/jsonsapi.php?ac=videolist") {
                    kt[0].value = '';
                    alert('博天堂资源站 not support search');
                } else if (link == "http://llzxcj.com/inc/json.php?ac=videolist") {
                    kt[0].value = '';
                    alert('利来资源站 not support search');
                } else {
                    globallink = proxy[0] + `${link}&wd=${sts}&pg=${pnum}`;
                }
            } else {
                globallink = proxy[0] + `${link}&t=${str}&pg=${pnum}`;
            }
            $.getJSON(globallink, function(data) {
                var test = data.data;
                var count = data.pagecount;
                if (pnum <= count) {
                    $('.loadingimg').remove();
                    if (link == "http://llzxcj.com/inc/json.php?ac=videolist") {
                        if ($(window).width() > 1024) {
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < test.length; i++) {
                                pic = test[i].vod_pic.length == 0 ? '../images/noimage.jpeg' : test[i].vod_pic;
                                if (i % 4 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/adultplay.html?web=${test[i].vpath}&${test[i].vod_title}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                                } else if (i % 4 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/adultplay.html?web=${test[i].vpath}&${test[i].vod_title}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                                } else if (i % 4 == 2) {
                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/adultplay.html?web=${test[i].vpath}&${test[i].vod_title}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                                } else if (i % 4 == 3) {
                                    $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/adultplay.html?web=${test[i].vpath}&${test[i].vod_title}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                                }
                            };
                        } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                            $(`.itemContainer:eq(3)`).hide();
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < test.length; i++) {
                                pic = test[i].vod_pic.length == 0 ? '../images/noimage.jpeg' : test[i].vod_pic;
                                if (i % 3 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/adultplay.html?web=${test[i].vpath}&${test[i].vod_title}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                                } else if (i % 3 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/adultplay.html?web=${test[i].vpath}&${test[i].vod_title}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                                } else if (i % 3 == 2) {
                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/adultplay.html?web=${test[i].vpath}&${test[i].vod_title}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                                }
                            };
                        } else if ($(window).width() <= 640) {
                            $(`.itemContainer:eq(2)`).hide();
                            $(`.itemContainer:eq(3)`).hide();
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < test.length; i++) {
                                pic = test[i].vod_pic.length == 0 ? '../images/noimage.jpeg' : test[i].vod_pic;
                                if (i % 2 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/adultplay.html?web=${test[i].vpath}&${test[i].vod_title}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                                } else if (i % 2 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/adultplay.html?web=${test[i].vpath}&${test[i].vod_title}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                                }
                            }
                        }
                    } else if ($(window).width() > 1024) {
                        $(`.itemContainer:eq(4)`).hide();
                        for (let i = 0; i < test.length; i++) {
                            pic = test[i].vod_pic.length == 0 ? '../images/noimage.jpeg' : test[i].vod_pic;
                            if (i % 4 == 0) {
                                $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                            } else if (i % 4 == 1) {
                                $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                            } else if (i % 4 == 2) {
                                $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                            } else if (i % 4 == 3) {
                                $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                            }
                        }
                    } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                        $(`.itemContainer:eq(3)`).hide();
                        $(`.itemContainer:eq(4)`).hide();
                        for (let i = 0; i < test.length; i++) {
                            pic = test[i].vod_pic.length == 0 ? '../images/noimage.jpeg' : test[i].vod_pic;
                            if (i % 3 == 0) {
                                $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                            } else if (i % 3 == 1) {
                                $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                            } else if (i % 3 == 2) {
                                $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                            }
                        }
                    } else if ($(window).width() <= 640) {
                        $(`.itemContainer:eq(2)`).hide();
                        $(`.itemContainer:eq(3)`).hide();
                        $(`.itemContainer:eq(4)`).hide();
                        for (let i = 0; i < test.length; i++) {
                            pic = test[i].vod_pic.length == 0 ? '../images/noimage.jpeg' : test[i].vod_pic;
                            if (i % 2 == 0) {
                                $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                            } else if (i % 2 == 1) {
                                $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                            }
                        }
                    }
                } else {
                    $('.loadingimg').remove();
                    alert(`There is nothing to load`);
                }
            });
        }
    });
});

//Initial homepage menu
function iniMenu(link) {
    let menu = $.getJSON(proxy[0] + `${link.replace('videolist','list')}`);
    let detail = $.getJSON(proxy[0] + `${link}`);
    $('#root').append(`<div class="loadingimg"><img src="../images/loading.gif" tag="Easy Web TV"></div>`);
    $.when(menu, detail).done(function(data, response) {
        $("#menu").empty();
        var lef = data[0]['class'];
        if (link == "http://zmcj88.com/sapi/json?ac=list" || link == 'http://f2dcj6.com/sapi/json?ac=list') {
            var test = data[0]['data'];
        } else {
            var test = response[0]['data'];
        }

        $("#menu").append('<li style="background-color:#fff"><input id="search" type="text" placeholder="Search..." /></li>');
        $("#menu").append(`<li><p><span class="0">最近更新</span></p></li>`);
        for (let i of Object.values(lef)) {
            $("#menu").append(`<li><p><span class="${i.cid}">${i.title}</span></p></li>`);
        };
        $('.loadingimg').remove();
        if (link == "http://llzxcj.com/inc/json.php?ac=videolist") {
            if ($(window).width() > 1024) {
                $(`.itemContainer:eq(4)`).hide();
                for (let i = 0; i < test.length; i++) {
                    pic = test[i].vod_pic.length == 0 ? '../images/noimage.jpeg' : test[i].vod_pic;
                    if (i % 4 == 0) {
                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/adultplay.html?web=${test[i].vpath}&${test[i].vod_title}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    } else if (i % 4 == 1) {
                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/adultplay.html?web=${test[i].vpath}&${test[i].vod_title}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    } else if (i % 4 == 2) {
                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/adultplay.html?web=${test[i].vpath}&${test[i].vod_title}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    } else if (i % 4 == 3) {
                        $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/adultplay.html?web=${test[i].vpath}&${test[i].vod_title}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    }
                };
            } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                $(`.itemContainer:eq(3)`).hide();
                $(`.itemContainer:eq(4)`).hide();
                for (let i = 0; i < test.length; i++) {
                    pic = test[i].vod_pic.length == 0 ? '../images/noimage.jpeg' : test[i].vod_pic;
                    if (i % 3 == 0) {
                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/adultplay.html?web=${test[i].vpath}&${test[i].vod_title}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    } else if (i % 3 == 1) {
                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/adultplay.html?web=${test[i].vpath}&${test[i].vod_title}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    } else if (i % 3 == 2) {
                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/adultplay.html?web=${test[i].vpath}&${test[i].vod_title}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    }
                };
            } else if ($(window).width() <= 640) {
                $(`.itemContainer:eq(2)`).hide();
                $(`.itemContainer:eq(3)`).hide();
                $(`.itemContainer:eq(4)`).hide();
                for (let i = 0; i < test.length; i++) {
                    pic = test[i].vod_pic.length == 0 ? '../images/noimage.jpeg' : test[i].vod_pic;
                    if (i % 2 == 0) {
                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/adultplay.html?web=${test[i].vpath}&${test[i].vod_title}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    } else if (i % 2 == 1) {
                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/adultplay.html?web=${test[i].vpath}&${test[i].vod_title}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    }
                }
            }
        } else {
            if ($(window).width() > 1024) {
                $(`.itemContainer:eq(4)`).hide();
                for (let i = 0; i < test.length; i++) {
                    pic = test[i].vod_pic.length == 0 ? '../images/noimage.jpeg' : test[i].vod_pic;
                    if (i % 4 == 0) {
                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    } else if (i % 4 == 1) {
                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    } else if (i % 4 == 2) {
                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    } else if (i % 4 == 3) {
                        $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    }
                };
            } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                $(`.itemContainer:eq(3)`).hide();
                $(`.itemContainer:eq(4)`).hide();
                for (let i = 0; i < test.length; i++) {
                    pic = test[i].vod_pic.length == 0 ? '../images/noimage.jpeg' : test[i].vod_pic;
                    if (i % 3 == 0) {
                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    } else if (i % 3 == 1) {
                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    } else if (i % 3 == 2) {
                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    }
                };
            } else if ($(window).width() <= 640) {
                $(`.itemContainer:eq(2)`).hide();
                $(`.itemContainer:eq(3)`).hide();
                $(`.itemContainer:eq(4)`).hide();
                for (let i = 0; i < test.length; i++) {
                    pic = test[i].vod_pic.length == 0 ? '../images/noimage.jpeg' : test[i].vod_pic;
                    if (i % 2 == 0) {
                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    } else if (i % 2 == 1) {
                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    }
                }
            }
        }
    }).done(function() {
        $("#menu li:eq(1)").addClass("bd");
        $("#menu li:gt(1)").on('click', function(){
            $(this).addClass("bd").siblings().removeClass("bd");
        });
        var searchlink = '';
        $("#search").on('keyup', function(e) {
            if (e.which == 13) {
                //Search Items
                var valThis = $(this).val().toLowerCase();
                if (link == 'http://secj8.com/inc/jsonsapi.php?ac=videolist') {
                    alert('色色资源网 not support search');
                } else if (link == 'http://99zywcj.com/inc/jsonsapi.php?ac=videolist') {
                    alert('玖玖资源站 not support search');
                } else if (link == 'http://cjmygzy.com/inc/jsonsapi.php?ac=videolist') {
                    alert('狼少年资源站 not support search');
                } else if (link == 'http://wmcj8.com/inc/jsonsapi.php?ac=videolist') {
                    alert('环亚资源站 not support search');
                } else if (link == "http://bttcj.com/inc/jsonsapi.php?ac=videolist") {
                    alert('博天堂资源站 not support search');
                } else if (link == "http://llzxcj.com/inc/json.php?ac=videolist") {
                    alert('利来资源站 not support search');
                } else {
                    searchlink = proxy[0] + `${link}&wd=${valThis}`;
                }
                $.getJSON(searchlink, function(data) {
                    var test = data['data'];
                    $('.itemContainer').empty();
                    if ($(window).width() > 1024) {
                        $(`.itemContainer:eq(4)`).hide();
                        for (let i = 0; i < test.length; i++) {
                            pic = test[i].vod_pic.length == 0 ? '../images/noimage.jpeg' : test[i].vod_pic;
                            if (i % 4 == 0) {
                                $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                            } else if (i % 4 == 1) {
                                $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                            } else if (i % 4 == 2) {
                                $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                            } else if (i % 4 == 3) {
                                $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                            }
                        }
                    } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                        $(`.itemContainer:eq(3)`).hide();
                        $(`.itemContainer:eq(4)`).hide();
                        for (let i = 0; i < test.length; i++) {
                            pic = test[i].vod_pic.length == 0 ? '../images/noimage.jpeg' : test[i].vod_pic;
                            if (i % 3 == 0) {
                                $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                            } else if (i % 3 == 1) {
                                $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                            } else if (i % 3 == 2) {
                                $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                            }
                        }
                    } else if ($(window).width() <= 640) {
                        $(`.itemContainer:eq(2)`).hide();
                        $(`.itemContainer:eq(3)`).hide();
                        $(`.itemContainer:eq(4)`).hide();
                        for (let i = 0; i < test.length; i++) {
                            pic = test[i].vod_pic.length == 0 ? '../images/noimage.jpeg' : test[i].vod_pic;
                            if (i % 2 == 0) {
                                $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                            } else if (i % 2 == 1) {
                                $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                            }
                        }
                    }
                });
            }
        });
    });
    //Click to choose category
    $('#menu').on("click", "span", function(e) {
        let className = e.originalEvent.target.className;
        $('.hiddens').empty();
        $('.hiddens').append(`<p>${className}</p>`);
        $('#search').val('');
        $.getJSON(proxy[0] + `${link}&t=${className}`, function(data) {
            var test = data['data'];
            $('.itemContainer').empty();
            if ($(window).width() > 1024) {
                $(`.itemContainer:eq(4)`).hide();
                for (let i = 0; i < test.length; i++) {
                    pic = test[i].vod_pic.length == 0 ? '../images/noimage.jpeg' : test[i].vod_pic;
                    if (i % 4 == 0) {
                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    } else if (i % 4 == 1) {
                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    } else if (i % 4 == 2) {
                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    } else if (i % 4 == 3) {
                        $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    }
                }
            } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                $(`.itemContainer:eq(3)`).hide();
                $(`.itemContainer:eq(4)`).hide();
                for (let i = 0; i < test.length; i++) {
                    pic = test[i].vod_pic.length == 0 ? '../images/noimage.jpeg' : test[i].vod_pic;
                    if (i % 3 == 0) {
                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    } else if (i % 3 == 1) {
                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    } else if (i % 3 == 2) {
                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    }
                }
            } else if ($(window).width() <= 640) {
                $(`.itemContainer:eq(2)`).hide();
                $(`.itemContainer:eq(3)`).hide();
                $(`.itemContainer:eq(4)`).hide();
                for (let i = 0; i < test.length; i++) {
                    pic = test[i].vod_pic.length == 0 ? '../images/noimage.jpeg' : test[i].vod_pic;
                    if (i % 2 == 0) {
                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    } else if (i % 2 == 1) {
                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/adultplay.html?web=${link}&ids=${test[i].vod_id}"><div class="item"><img class="itemImg" src="${pic}" alt="${test[i].vod_title}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${test[i].category}]${test[i].vod_title}</span></div></div></a>`)
                    }
                }
            }
        });
    });
};