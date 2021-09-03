//Set global array proxy links to solve CORS errors
var proxy = {
    0: 'https://bird.ioliu.cn/v1?url=',
};
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
    });
    $(window).scroll(function(e) {
        console.log(e);
    });
});

//Initial homepage menu
function iniMenu(link) {
    let menu = $.getJSON(proxy[rand] + `${link}?ac=&pg=1`);
    let list = $.getJSON(proxy[rand] + `${link}?ac=videolist&pg=1`);
    $.when(menu, list).done(function(alp, bet) {
        $("#menu").empty();
        var xml = $.parseXML(alp[0]),
            $xml = $(xml),
            $lef = $xml.find('ty');
        var xmls = $.parseXML(bet[0]),
            $xmls = $(xmls),
            $id = $xmls.find('id'),
            $test = $xmls.find('pic'),
            $type = $xmls.find('type'),
            $name = $xmls.find('name');
        $("#menu").append(`<li><p><span class="0">最近更新</span></p></li>`);
        for (let i of $lef) {
            $("#menu").append(`<li><p><span class="${i.id}">${i.innerHTML}</span></p></li>`);
        };
        for (let i = 0; i < $test.length; i++) {
            if (i % 5 == 0) {
                $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
            } else if (i % 5 == 1) {
                $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
            } else if (i % 5 == 2) {
                $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
            } else if (i % 5 == 3) {
                $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
            } else {
                $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
            }
        };
    });
    //Click to choose category
    $('#menu').on("click", "span", function(e) {
        let className = e.originalEvent.target.className;
        $('.hiddens').empty();
        $('.hiddens').append(`<p>${className}</p>`);
        $.getJSON(proxy[rand] + `${link}?ac=videolist&t=${className}`, function(data) {
            var xml = $.parseXML(data),
                $xml = $(xml),
                $test = $xml.find('pic'),
                $type = $xml.find('type'),
                $name = $xml.find('name'),
                $id = $xml.find('id');
            $('.itemContainer').empty();
            for (let i = 0; i < $test.length; i++) {
                if (i % 5 == 0) {
                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                } else if (i % 5 == 1) {
                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                } else if (i % 5 == 2) {
                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                } else if (i % 5 == 3) {
                    $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                } else {
                    $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                }
            }
        });
    });
};

//Scroll down to refresh
function reload(link, category, pnum) {
    console.log($('.hiddens p').text());
    $(window).scroll(function() {
        var scrollTop = $(this).scrollTop(),
            scrollHeight = $(document).height(),
            windowHeight = $(this).height();
        var positionValue = (scrollTop + windowHeight) - scrollHeight;
        if (positionValue == 0) {
            $.getJSON(proxy[rand] + `${link}?ac=videolist&t=${category}&pg=${pnum}`, function(data) {
                var xml = $.parseXML(data),
                    $xml = $(xml),
                    $test = $xml.find('pic'),
                    $type = $xml.find('type'),
                    $name = $xml.find('name'),
                    $id = $xml.find('id');
                for (let i = 0; i < $test.length; i++) {
                    if (i % 5 == 0) {
                        $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                    } else if (i % 5 == 1) {
                        $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                    } else if (i % 5 == 2) {
                        $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                    } else if (i % 5 == 3) {
                        $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                    } else {
                        $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/complay.html?web=${link}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                    }
                }
            });
        }
    });
};