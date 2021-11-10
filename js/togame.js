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
    if ($(window).width() > 1024) {
        $(`.itemContainer:eq(0)`).append(`<a href="../gamebox/ball/gameball.html"><div class="item"><img class="itemImg" src="../gamebox/ball/squareobstacle.png" alt="ball" /><div class="userInfo"><img class="avatar" src="../images/game.svg" alt="" /><span class="username">[PC] Square Obstacles</span></div></div></a>`);
        $(`.itemContainer:eq(1)`).append(`<a href="../gamebox/bong/gamebong.html"><div class="item"><img class="itemImg" src="../gamebox/bong/bong.png" alt="pong" /><div class="userInfo"><img class="avatar" src="../images/game.svg" alt="" /><span class="username">[PC] Pong</span></div></div></a>`);
        $(`.itemContainer:eq(2)`).append(`<a href="../gamebox/breakout/gamebreakout.html"><div class="item"><img class="itemImg" src="../gamebox/breakout/breakout.png" alt="breakout" /><div class="userInfo"><img class="avatar" src="../images/game.svg" alt="" /><span class="username">[PC] Breakout</span></div></div></a>`);
        $(`.itemContainer:eq(3)`).append(`<a href="../gamebox/tic-tac-toe/tic-tac-toe-game.html"><div class="item"><img class="itemImg" src="../gamebox/tic-tac-toe/tictactoe.png" alt="tic-tac-toe" /><div class="userInfo"><img class="avatar" src="../images/game.svg" alt="" /><span class="username">[PC] Tic Ta Toe</span></div></div></a>`);
        // $(`.itemContainer:eq(3)`).append(`<a href="../catalogues/mangaplay.html?web=${code[i]}"><div class="item"><img class="itemImg" src="${pic[i]}" alt="${title[i]}" /><div class="userInfo"><img class="avatar" src="../images/clickread.svg" alt="" /><span class="username">${title[i]}</span></div></div></a>`)
    } else if ($(window).width() <= 1024 && $(window).width() > 640) {
        $(`.itemContainer:eq(3)`).hide();
        $(`.itemContainer:eq(4)`).hide();
        $(`.itemContainer:eq(0)`).append(`<a href="../gamebox/ball/gameball.html"><div class="item"><img class="itemImg" src="../gamebox/ball/squareobstacle.png" alt="Snake" /><div class="userInfo"><img class="avatar" src="../images/game.svg" alt="" /><span class="username">[PC] Square Obstacles</span></div></div></a>`)
        $(`.itemContainer:eq(1)`).append(`<a href="../gamebox/bong/gamebong.html"><div class="item"><img class="itemImg" src="../gamebox/bong/bong.png" alt="Pong" /><div class="userInfo"><img class="avatar" src="../images/game.svg" alt="" /><span class="username">[PC] Pong</span></div></div></a>`)
        $(`.itemContainer:eq(2)`).append(`<a href="../gamebox/breakout/gamebreakout.html"><div class="item"><img class="itemImg" src="../gamebox/breakout/breakout.png" alt="breakout" /><div class="userInfo"><img class="avatar" src="../images/game.svg" alt="" /><span class="username">[PC] Breakout</span></div></div></a>`);
        $(`.itemContainer:eq(0)`).append(`<a href="../gamebox/tic-tac-toe/tic-tac-toe-game.html"><div class="item"><img class="itemImg" src="../gamebox/tic-tac-toe/tictactoe.png" alt="tic-tac-toe" /><div class="userInfo"><img class="avatar" src="../images/game.svg" alt="" /><span class="username">[PC] Tic Ta Toe</span></div></div></a>`);
    } else if ($(window).width() <= 640) {
        $(`.itemContainer:eq(2)`).hide();
        $(`.itemContainer:eq(3)`).hide();
        $(`.itemContainer:eq(4)`).hide();
        $(`.itemContainer:eq(0)`).append(`<a href="../gamebox/ball/gameball.html"><div class="item"><img class="itemImg" src="../gamebox/ball/squareobstacle.png" alt="Snake" /><div class="userInfo"><img class="avatar" src="../images/game.svg" alt="" /><span class="username">[PC] Square Obstacles</span></div></div></a>`)
        $(`.itemContainer:eq(1)`).append(`<a href="../gamebox/bong/gamebong.html"><div class="item"><img class="itemImg" src="../gamebox/bong/bong.png" alt="Pong" /><div class="userInfo"><img class="avatar" src="../images/game.svg" alt="" /><span class="username">[PC] Pong</span></div></div></a>`)
        $(`.itemContainer:eq(0)`).append(`<a href="../gamebox/breakout/gamebreakout.html"><div class="item"><img class="itemImg" src="../gamebox/breakout/breakout.png" alt="breakout" /><div class="userInfo"><img class="avatar" src="../images/game.svg" alt="" /><span class="username">[PC] Breakout</span></div></div></a>`);
        $(`.itemContainer:eq(1)`).append(`<a href="../gamebox/tic-tac-toe/tic-tac-toe-game.html"><div class="item"><img class="itemImg" src="../gamebox/tic-tac-toe/tictactoe.png" alt="tic-tac-toe" /><div class="userInfo"><img class="avatar" src="../images/game.svg" alt="" /><span class="username">[PC] Tic Ta Toe</span></div></div></a>`);
    }
})