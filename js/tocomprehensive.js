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
    //Initial homepage menu
    $.getJSON(`https://bird.ioliu.cn/v1?url=${initlink}`, function(data) {
        $("#menu").empty();
        var xml = $.parseXML(data),
            $xml = $(xml),
            $test = $xml.find('ty');
        for (let i of $test) {
            $("#menu").append(`<li><p><span class=${i.id}>${i.innerHTML}</span></p></li>`);
        }
    });
    //Initial homepage lists
    $.getJSON(`https://bird.ioliu.cn/v1?url=${initlink}?ac=videolist&pg=1`, function(data) {
        var xml = $.parseXML(data),
            $xml = $(xml),
            $test = $xml.find('pic'),
            $type = $xml.find('type'),
            $name = $xml.find('name'),
            $id = $xml.find('id');
        for (let i = 0; i < $test.length; i++) {
            if (i % 5 == 0) {
                $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${initlink}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
            } else if (i % 5 == 1) {
                $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${initlink}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
            } else if (i % 5 == 2) {
                $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/complay.html?web=${initlink}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
            } else if (i % 5 == 3) {
                $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/complay.html?web=${initlink}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
            } else {
                $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/complay.html?web=${initlink}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
            }
        }
    });
    //Scroll to get new list
    adscroller(initlink);
    //Select Different Source Website
    $('#selectapi').on('change', function() {
        $("#menu").empty();
        $.getJSON(`https://bird.ioliu.cn/v1?url=${this.value}`, function(data) {
            var xml = $.parseXML(data),
                $xml = $(xml),
                $test = $xml.find('ty');
            for (let i of $test) {
                $("#menu").append(`<li><p><span class=${i.id}>${i.innerHTML}</span></p></li>`);
            }
        });
        //Initial homepage lists
        $.getJSON(`https://bird.ioliu.cn/v1?url=${this.value}?ac=videolist&pg=1`, function(data) {
            $(`.itemContainer`).empty();
            var xml = $.parseXML(data),
                $xml = $(xml),
                $test = $xml.find('pic'),
                $type = $xml.find('type'),
                $name = $xml.find('name'),
                $id = $xml.find('id');
            for (let i = 0; i < $test.length; i++) {
                if (i % 5 == 0) {
                    $(`.itemContainer:eq(0)`).append(`<a href="../catalogues/complay.html?web=${this.value}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                } else if (i % 5 == 1) {
                    $(`.itemContainer:eq(1)`).append(`<a href="../catalogues/complay.html?web=${this.value}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                } else if (i % 5 == 2) {
                    $(`.itemContainer:eq(2)`).append(`<a href="../catalogues/complay.html?web=${this.value}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                } else if (i % 5 == 3) {
                    $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/complay.html?web=${this.value}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                } else {
                    $(`.itemContainer:eq(4)`).append(`<a href="../catalogues/complay.html?web=${this.value}&tab=${$id[i].innerHTML}"><div class="item"><img class="itemImg" src="${$test[i].innerHTML}" alt="" /><div class="userInfo"><img class="avatar" src="../images/player.jpg" alt="${$name[i].innerHTML.split("[")[2].split(']')[0]}" /><span class="username">[${$type[i].innerHTML}]${$name[i].innerHTML.split("[")[2].split(']')[0]}</span></div></div></a>`)
                }
            }
        });
        adscroller(this.value)
    });
})

function adscroller(link) {
    var viewport = document.getElementsByTagName('body')[0];
    var index = 1;

    function getNewList() {
        var allhei = viewport.scrollHeight;
        var scroll = viewport.scrollTop;
        if ($(window).height() + scroll == allhei) {
            index++;
            $.getJSON(`https://bird.ioliu.cn/v1?url=${link}?ac=videolist&pg=${index}`, function(data) {
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
        };
    }

    viewport.addEventListener('scroll', getNewList, false);
}