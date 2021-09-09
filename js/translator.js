$(document).ready(function() {
    //Change language to show
    $('#languages').on('change', function() {
        let lan = $(this).val();
        if (lan == 'en' || lan == 'en-AU' || lan == 'en-CA' || lan == 'en-IN' || lan == 'en-NZ' || lan == 'en-ZA' || lan == 'en-GB' || lan == 'en-US') {
            $('.stylebtn:eq(0)').text('GO!');
            $('.stylebtn').slice(1).text('Enter');
            $('.mobile p:eq(0)').text('Watch 6000+ TV Channels...');
            $('.mobile p:eq(1)').text('Watch Movies, Series, Animes...');
            $('.mobile p:eq(2)').text('Listen 28000+ Radio Stations...');
            $('.mobile p:eq(3)').text('Porn Videos...');
            $('h2').text('Select');
            $('#selectform input:eq(0)').next().text('Countries');
            $('#selectform input:eq(1)').next().text('Lanuages');
            $('#selectform input:eq(2)').next().text('Category');
            $('#mySidenav a:eq(0)').find('span').text('Sensitive Content');
            $('#mySidenav a:eq(1)').find('span').text('Languages');
            $('#mySidenav a:eq(2)').find('span').text('Version');
        } else if (lan == 'zh' || lan == 'zh-CN') {
            $('.stylebtn').text('进入');
            $('.mobile p:eq(0)').text('观看6000多个电视直播台......');
            $('.mobile p:eq(1)').text('观看电影，电视剧，动漫......');
            $('.mobile p:eq(2)').text('收听28000多个电台频道......');
            $('.mobile p:eq(3)').text('色情视频...');
            $('h2').text('选择');
            $('#selectform input:eq(0)').next().text('国家');
            $('#selectform input:eq(1)').next().text('语言');
            $('#selectform input:eq(2)').next().text('分类');
            $('#mySidenav a:eq(0)').find('span').text('敏感内容');
            $('#mySidenav a:eq(1)').find('span').text('语言');
            $('#mySidenav a:eq(2)').find('span').text('版本');
        } else if (lan == 'zh-HK' || lan == 'zh-TW') {
            $('.stylebtn').text('進入');
            $('.mobile p:eq(0)').text('觀看 6000 多個電視頻道...');
            $('.mobile p:eq(1)').text('看電影、電視劇、動漫……');
            $('.mobile p:eq(2)').text('收聽 28000 多個廣播電台...');
            $('.mobile p:eq(3)').text('色情影片...');
            $('h2').text('选择');
            $('#selectform input:eq(0)').next().text('國家');
            $('#selectform input:eq(1)').next().text('語言');
            $('#selectform input:eq(2)').next().text('分類');
            $('#mySidenav a:eq(0)').find('span').text('敏感內容');
            $('#mySidenav a:eq(1)').find('span').text('語言');
            $('#mySidenav a:eq(2)').find('span').text('版本');
        }
    });
})