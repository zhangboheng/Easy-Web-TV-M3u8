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
        let ms = window.localStorage.getItem('movie').split(",");
        let arr = ["tky", "bjy", "39ys", "wlys", "phzy", "kby"];
        let lst = arr.filter(x => ms.includes(x)).map(x => arr.indexOf(x));
        let sts = [
            '<option value="https://api.tiankongapi.com/api.php/provide/vod/at/xml/from/tkm3u8/">天空云</option>',
            '<option value="http://cj.bajiecaiji.com/inc/bjm3u8.php">八戒云</option>',
            '<option value="https://www.39kan.com/api.php/provide/vod/at/json">39影视</option>',
            '<option value="https://collect.wolongzyw.com/api.php/provide/vod/at/xml">卧龙影视</option>',
            '<option value="http://www.zzrhgg.com/api.php/provide/vod/at/xml">飘花资源</option>',
            '<option value="http://www.kuaibozy.com/api.php/provide/vod/from/kbm3u8/at/xml/">快播云</option>',
        ];
        for (let i of lst) {
            $('#selectapi').append(sts[i]);
        }
    } catch (e) {
        $('#selectapi').append(`
            <option value="https://api.tiankongapi.com/api.php/provide/vod/at/xml/from/tkm3u8/">天空云</option>
            <option value="http://cj.bajiecaiji.com/inc/bjm3u8.php">八戒云</option>
            <option value="https://www.39kan.com/api.php/provide/vod/at/json">39影视</option>
            <option value="https://collect.wolongzyw.com/api.php/provide/vod/at/xml">卧龙影视</option>
            <option value="http://www.zzrhgg.com/api.php/provide/vod/at/xml">飘花资源</option>
            <option value="http://www.kuaibozy.com/api.php/provide/vod/from/kbm3u8/at/xml/">快播云</option>
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
                if (link == 'http://www.88zy.live/inc/api.php' || link == 'https://collect.wolongzyw.com/api.php/provide/vod/at/xml' || link == 'http://www.zzrhgg.com/api.php/provide/vod/at/xml') {
                    globallink = proxy[rand] + `${link}?ac=list&wd=${sts}&pg=${pnum}`;
                } else if (link == 'https://www.39kan.com/api.php/provide/vod/at/json') {
                    globallink = proxy[rand] + `${link}?ac=videolist&wd=${sts}&pg=${pnum}`;
                } else {
                    globallink = proxy[rand] + `${link}?ac=videolist&wd=${sts}&pg=${pnum}`;
                }
            } else {
                globallink = proxy[rand] + `${link}?ac=videolist&t=${str}&pg=${pnum}`;
            }
            $.ajax({
                type: 'GET',
                url: globallink,
                dataType: link == 'https://www.39kan.com/api.php/provide/vod/at/json' ? 'json' : 'html',
                success: function(data) {
                    if (link == 'https://www.39kan.com/api.php/provide/vod/at/json') {
                        $test = data.list;
                        $id = data.list;
                        $total = data.pagecount;
                    } else {
                        var xml = $.parseXML(data),
                            $xml = $(xml),
                            $test = $xml.find('pic'),
                            $total = $xml.find('list'),
                            $type = $xml.find('type'),
                            $name = $xml.find('name'),
                            $id = $xml.find('id');
                        var pic;
                    }
                    var count = link == 'https://www.39kan.com/api.php/provide/vod/at/json' ? $total : Number($total[0].attributes[1].value);
                    if (pnum <= count) {
                        $('.loadingimg').remove();
                        if ($(window).width() > 1024) {
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < $id.length; i++) {
                                if (link == 'https://www.39kan.com/api.php/provide/vod/at/json') {
                                    if (i % 4 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                    } else if (i % 4 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                    } else if (i % 4 == 2) {
                                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                    } else if (i % 4 == 3) {
                                        $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                    }
                                } else {
                                    pic = $test.length == 0 ? '../images/noimage.jpeg' : $test[i].innerHTML;
                                    if (i % 4 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                    } else if (i % 4 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                    } else if (i % 4 == 2) {
                                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                    } else if (i % 4 == 3) {
                                        $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                    }
                                }
                            }
                        } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                            $(`.itemContainer:eq(3)`).hide();
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < $id.length; i++) {
                                if (link == 'https://www.39kan.com/api.php/provide/vod/at/json') {
                                    if (i % 3 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                    } else if (i % 3 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                    } else if (i % 3 == 2) {
                                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                    }
                                } else {
                                    pic = $test.length == 0 ? '../images/noimage.jpeg' : $test[i].innerHTML;
                                    if (i % 3 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                    } else if (i % 3 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                    } else if (i % 3 == 2) {
                                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                    }
                                }
                            }
                        } else if ($(window).width() <= 640) {
                            $(`.itemContainer:eq(2)`).hide();
                            $(`.itemContainer:eq(3)`).hide();
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < $id.length; i++) {
                                if (link == 'https://www.39kan.com/api.php/provide/vod/at/json') {
                                    if (i % 2 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                    } else if (i % 2 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                    }
                                } else {
                                    pic = $test.length == 0 ? '../images/noimage.jpeg' : $test[i].innerHTML;
                                    if (i % 2 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                    } else if (i % 2 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                    }
                                }
                            }
                        }
                    } else {
                        $('.loadingimg').remove();
                    }
                }
            });
        }
    });
});

//Initial homepage menu
function iniMenu(link) {
    var menu;
    var list;
    if (link == 'https://www.39kan.com/api.php/provide/vod/at/json') {
        menu = $.getJSON(proxy[rand] + `${link}?ac=&pg=1`);
        list = $.getJSON(proxy[rand] + `${link}?ac=videolist&pg=1`);
    } else {
        menu = $.ajax({
            type: "GET",
            url: proxy[rand] + `${link}?ac=&pg=1`,
            dataType: "xml",
        });
        list = $.ajax({
            type: "GET",
            url: proxy[rand] + `${link}?ac=videolist&pg=1`,
            dataType: "xml",
        });
    }
    $('#root').append(`<div class="loadingimg"><img src="../images/loading.gif" tag="Easy Web TV"></div>`);
    $.when(menu, list).done(function(alp, bet) {
        $("#menu").empty();
        if (link == 'https://www.39kan.com/api.php/provide/vod/at/json') {
            $lef = alp[0]['class'];
            $test = bet[0]['list'];
        } else {
            var xml = $.parseXML(alp[2].responseText),
                $xml = $(xml),
                $lef = $xml.find('ty');
            var xmls = $.parseXML(bet[2].responseText),
                $xmls = $(xmls),
                $id = $xmls.find('id'),
                $test = $xmls.find('pic'),
                $type = $xmls.find('type'),
                $name = $xmls.find('name');
            var pic;
        }
        $("#menu").append('<li style="background-color:#fff"><input id="search" type="text" placeholder="Search..." /></li>');
        $("#menu").append(`<li><p><span class="0">最近更新</span></p></li>`);
        for (let i of $lef) {
            if (link == 'https://www.39kan.com/api.php/provide/vod/at/json') {
                $("#menu").append(`<li><p><span class="${i.type_id}">${i.type_name}</span></p></li>`);
            } else {
                $("#menu").append(`<li><p><span class="${i.id}">${i.innerHTML}</span></p></li>`);
            }
        };
        $('.loadingimg').remove();
        if ($(window).width() > 1024) {
            $(`.itemContainer:eq(4)`).hide();
            for (let i = 0; i < $test.length; i++) {
                if (link == 'https://www.39kan.com/api.php/provide/vod/at/json') {
                    if (i % 4 == 0) {
                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                    } else if (i % 4 == 1) {
                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                    } else if (i % 4 == 2) {
                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                    } else if (i % 4 == 3) {
                        $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                    }
                } else {
                    pic = $test.length == 0 ? '../images/noimage.jpeg' : $test[i].innerHTML;
                    if (i % 4 == 0) {
                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                    } else if (i % 4 == 1) {
                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                    } else if (i % 4 == 2) {
                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                    } else if (i % 4 == 3) {
                        $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                    }
                }
            };
        } else if ($(window).width() <= 1024 && $(window).width() > 640) {
            $(`.itemContainer:eq(3)`).hide();
            $(`.itemContainer:eq(4)`).hide();
            for (let i = 0; i < $test.length; i++) {
                if (link == 'https://www.39kan.com/api.php/provide/vod/at/json') {
                    if (i % 3 == 0) {
                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                    } else if (i % 3 == 1) {
                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                    } else if (i % 3 == 2) {
                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                    }
                } else {
                    pic = $test.length == 0 ? '../images/noimage.jpeg' : $test[i].innerHTML;
                    if (i % 3 == 0) {
                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                    } else if (i % 3 == 1) {
                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                    } else if (i % 3 == 2) {
                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                    }
                }
            };
        } else if ($(window).width() <= 640) {
            $(`.itemContainer:eq(2)`).hide();
            $(`.itemContainer:eq(3)`).hide();
            $(`.itemContainer:eq(4)`).hide();
            for (let i = 0; i < $test.length; i++) {
                if (link == 'https://www.39kan.com/api.php/provide/vod/at/json') {
                    if (i % 2 == 0) {
                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                    } else if (i % 2 == 1) {
                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                    }
                } else {
                    pic = $test.length == 0 ? '../images/noimage.jpeg' : $test[i].innerHTML;
                    if (i % 2 == 0) {
                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                    } else if (i % 2 == 1) {
                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                    }
                }
            }
        }
    }).done(function() {
        var searchlink = '';
        $("#search").on('keyup', function(e) {
            if (e.which == 13) {
                //Search Items
                var valThis = $(this).val().toLowerCase();
                if (link == 'http://www.kuaibozy.com/api.php/provide/vod/from/kbm3u8/at/xml/') {
                    alert('快播云 not support search');
                } else if (link == 'https://api.tiankongapi.com/api.php/provide/vod/at/xml/from/tkm3u8/') {
                    alert('天空云 not support search');
                } else if (link == 'http://cj.bajiecaiji.com/inc/bjm3u8.php') {
                    alert('八戒云 not support search');
                } else if (link == 'https://www.39kan.com/api.php/provide/vod/at/json') {
                    searchlink = proxy[rand] + `${link}?ac=videolist&wd=${valThis}`;
                } else if (link == 'http://www.88zy.live/inc/api.php' || link == "https://collect.wolongzyw.com/api.php/provide/vod/at/xml" || link == 'http://www.zzrhgg.com/api.php/provide/vod/at/xml') {
                    searchlink = proxy[rand] + `${link}?ac=list&wd=${valThis}`;
                }
                $.ajax({
                    tyep: 'GET',
                    url: searchlink,
                    dataType: link == 'https://www.39kan.com/api.php/provide/vod/at/json' ? 'json' : 'html',
                    success: function(data) {
                        if (link == 'https://www.39kan.com/api.php/provide/vod/at/json') {
                            $test = data.list;
                            $id = data.list;
                        } else {
                            var xml = $.parseXML(data),
                                $xml = $(xml),
                                $test = $xml.find('pic'),
                                $type = $xml.find('type'),
                                $name = $xml.find('name'),
                                $id = $xml.find('id');
                            var pic;
                        }
                        $('.itemContainer').empty();
                        if ($(window).width() > 1024) {
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < $id.length; i++) {
                                if (link == 'https://www.39kan.com/api.php/provide/vod/at/json') {
                                    if (i % 4 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                    } else if (i % 4 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                    } else if (i % 4 == 2) {
                                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                    } else if (i % 4 == 3) {
                                        $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                    }
                                } else {
                                    pic = $test.length == 0 ? '../images/noimage.jpeg' : $test[i].innerHTML;
                                    if (i % 4 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                    } else if (i % 4 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                    } else if (i % 4 == 2) {
                                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                    } else if (i % 4 == 3) {
                                        $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                    }
                                }
                            }
                        } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                            $(`.itemContainer:eq(3)`).hide();
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < $id.length; i++) {
                                if (link == 'https://www.39kan.com/api.php/provide/vod/at/json') {
                                    if (i % 3 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                    } else if (i % 3 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                    } else if (i % 3 == 2) {
                                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                    }
                                } else {
                                    pic = $test.length == 0 ? '../images/noimage.jpeg' : $test[i].innerHTML;
                                    if (i % 3 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                    } else if (i % 3 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                    } else if (i % 3 == 2) {
                                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                    }
                                }
                            }
                        } else if ($(window).width() <= 640) {
                            $(`.itemContainer:eq(2)`).hide();
                            $(`.itemContainer:eq(3)`).hide();
                            $(`.itemContainer:eq(4)`).hide();
                            for (let i = 0; i < $id.length; i++) {
                                if (link == 'https://www.39kan.com/api.php/provide/vod/at/json') {
                                    if (i % 2 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                    } else if (i % 2 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                    }
                                } else {
                                    pic = $test.length == 0 ? '../images/noimage.jpeg' : $test[i].innerHTML;
                                    if (i % 2 == 0) {
                                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                    } else if (i % 2 == 1) {
                                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                    }
                                }
                            }
                        }
                    }
                });
            }
        })
    }).done(function() {
        $("#menu li:eq(1)").addClass("bd");
        $("#menu li:gt(1)").on('click', function(){
            $(this).addClass("bd").siblings().removeClass("bd");
        });
        //Click to choose category
        $('#menu').on("click", "span", function(e) {
            let className = e.originalEvent.target.className;
            $('.hiddens').empty();
            $('.hiddens').append(`<p>${className}</p>`);
            $('#search').val('');
            $.ajax({
                tyep: 'GET',
                url: proxy[rand] + `${link}?ac=videolist&t=${className}`,
                dataType: link == 'https://www.39kan.com/api.php/provide/vod/at/json' ? 'json' : 'html',
                success: function(data) {
                    if (link == 'https://www.39kan.com/api.php/provide/vod/at/json') {
                        $test = data.list;
                        $id = data.list;
                    } else {
                        var xml = $.parseXML(data),
                            $xml = $(xml),
                            $test = $xml.find('pic'),
                            $type = $xml.find('type'),
                            $name = $xml.find('name'),
                            $id = $xml.find('id');
                        var pic;
                    }
                    $('.itemContainer').empty();
                    if ($(window).width() > 1024) {
                        $(`.itemContainer:eq(4)`).hide();
                        for (let i = 0; i < $test.length; i++) {
                            if (link == 'https://www.39kan.com/api.php/provide/vod/at/json') {
                                if (i % 4 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                } else if (i % 4 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                } else if (i % 4 == 2) {
                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                } else if (i % 4 == 3) {
                                    $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                }
                            } else {
                                pic = $test.length == 0 ? '../images/noimage.jpeg' : $test[i].innerHTML;
                                if (i % 4 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                } else if (i % 4 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                } else if (i % 4 == 2) {
                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                } else if (i % 4 == 3) {
                                    $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                }
                            }
                        }
                    } else if ($(window).width() <= 1024 && $(window).width() > 640) {
                        $(`.itemContainer:eq(3)`).hide();
                        $(`.itemContainer:eq(4)`).hide();
                        for (let i = 0; i < $test.length; i++) {
                            if (link == 'https://www.39kan.com/api.php/provide/vod/at/json') {
                                if (i % 3 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                } else if (i % 3 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                } else if (i % 3 == 2) {
                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                }
                            } else {
                                pic = $test.length == 0 ? '../images/noimage.jpeg' : $test[i].innerHTML;
                                if (i % 3 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                } else if (i % 3 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                } else if (i % 3 == 2) {
                                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                }
                            }
                        }
                    } else if ($(window).width() <= 640) {
                        $(`.itemContainer:eq(2)`).hide();
                        $(`.itemContainer:eq(3)`).hide();
                        $(`.itemContainer:eq(4)`).hide();
                        for (let i = 0; i < $test.length; i++) {
                            if (link == 'https://www.39kan.com/api.php/provide/vod/at/json') {
                                if (i % 2 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                } else if (i % 2 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$test[i]['vod_id']}"><div class="item"><img class="itemImg" src="${$test[i]['vod_pic']}" alt="${$test[i]['vod_name']}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$test[i]['type_name']}]${$test[i]['vod_name']}</span></div></div></a>`)
                                }
                            } else {
                                pic = $test.length == 0 ? '../images/noimage.jpeg' : $test[i].innerHTML;
                                if (i % 2 == 0) {
                                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                } else if (i % 2 == 1) {
                                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${pic}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                                }
                            }
                        }
                    }
                }
            });
        })
    });
}
