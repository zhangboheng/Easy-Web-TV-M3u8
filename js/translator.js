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
            $('#mySidenav a:eq(0)').find('span:eq(0)').text('Sensitive Content');
            $('#mySidenav a:eq(1)').find('span').text('Languages');
            $('#mySidenav a:eq(2)').find('span').text('Version');
        } else if (lan == 'de' || lan == 'de-AT' || lan == 'de-DE' || lan == 'de-LI' || lan == 'de-CH') {
            $('.stylebtn').text('Eintreten');
            $('.mobile p:eq(0)').text('Mehr als 6000 TV-Kanäle ansehen...');
            $('.mobile p:eq(1)').text('Filme, Serien, Animes ansehen...');
            $('.mobile p:eq(2)').text('Mehr als 28000 Radiosender anhören...');
            $('.mobile p:eq(3)').text('Pornovideos...');
            $('h2').text('Auswählen');
            $('#selectform input:eq(0)').next().text('Land');
            $('#selectform input:eq(1)').next().text('Sprachen');
            $('#selectform input:eq(2)').next().text('Kategorie');
            $('#mySidenav a:eq(0)').find('span:eq(0)').text('Sensible Inhalte');
            $('#mySidenav a:eq(1)').find('span').text('Sprachen');
            $('#mySidenav a:eq(2)').find('span').text('Ausführung');
        } else if (lan == 'fr' || lan == 'fr-CA' || lan == 'fr-FR' || lan == 'fr-CH') {
            $('.stylebtn').text('Enter');
            $('.mobile p:eq(0)').text('Regardez plus de 6000 chaînes de télévision...');
            $('.mobile p:eq(1)').text('Regardez des films, séries, animes...');
            $('.mobile p:eq(2)').text('Écoutez plus de 28 000 stations de radio...');
            $('.mobile p:eq(3)').text('Vidéos porno...');
            $('h2').text('Sélectionner');
            $('#selectform input:eq(0)').next().text('Des pays');
            $('#selectform input:eq(1)').next().text('Langages');
            $('#selectform input:eq(2)').next().text('Catégorie');
            $('#mySidenav a:eq(0)').find('span:eq(0)').text('Contenu sensible');
            $('#mySidenav a:eq(1)').find('span').text('Langages');
            $('#mySidenav a:eq(2)').find('span').text('Version');
        } else if (lan == 'ar') {
            $('.stylebtn').text('يدخل');
            $('.mobile p:eq(0)').text('شاهد أكثر من 6000 قناة تلفزيونية ...');
            $('.mobile p:eq(1)').text('مشاهدة الافلام والمسلسلات والرسوم المتحركة ...');
            $('.mobile p:eq(2)').text('الاستماع 28000+ محطات الراديو ...');
            $('.mobile p:eq(3)').text('أشرطة الفيديو الإباحية ...');
            $('h2').text('يختار');
            $('#selectform input:eq(0)').next().text('بلدان');
            $('#selectform input:eq(1)').next().text('اللغات');
            $('#selectform input:eq(2)').next().text('فئة');
            $('#mySidenav a:eq(0)').find('span:eq(0)').text('المحتوى الحساس');
            $('#mySidenav a:eq(1)').find('span').text('اللغات');
            $('#mySidenav a:eq(2)').find('span').text('إصدار');
        } else if (lan == 'sq') {
            $('.stylebtn').text('Hyni');
            $('.mobile p:eq(0)').text('Shikoni 6000+ kanale televizive ...');
            $('.mobile p:eq(1)').text('Shikoni filma, seri, anime ...');
            $('.mobile p:eq(2)').text('Dëgjoni 28000+ Stacione Radio ...');
            $('.mobile p:eq(3)').text('Video pornografike ...');
            $('h2').text('Zgjidhni');
            $('#selectform input:eq(0)').next().text('Vendet');
            $('#selectform input:eq(1)').next().text('Gjuhët');
            $('#selectform input:eq(2)').next().text('Kategoria');
            $('#mySidenav a:eq(0)').find('span:eq(0)').text('Përmbajtje e ndjeshme');
            $('#mySidenav a:eq(1)').find('span').text('Gjuhët');
            $('#mySidenav a:eq(2)').find('span').text('Version');
        } else if (lan == 'am') {
            $('.stylebtn').text('ግባ');
            $('.mobile p:eq(0)').text('6000+ የቴሌቪዥን ጣቢያዎችን ይመልከቱ ...');
            $('.mobile p:eq(1)').text('ፊልሞችን ፣ ተከታታዮችን ፣ አኒሞችን ይመልከቱ ...');
            $('.mobile p:eq(2)').text('28000+ የሬዲዮ ጣቢያዎችን ያዳምጡ ...');
            $('.mobile p:eq(3)').text('የወሲብ ቪዲዮዎች ...');
            $('h2').text('ይምረጡ');
            $('#selectform input:eq(0)').next().text('አገሮች');
            $('#selectform input:eq(1)').next().text('ቋንቋዎች');
            $('#selectform input:eq(2)').next().text('ምድብ');
            $('#mySidenav a:eq(0)').find('span:eq(0)').text('ስሜታዊ ይዘት');
            $('#mySidenav a:eq(1)').find('span').text('ቋንቋዎች');
            $('#mySidenav a:eq(2)').find('span').text('ስሪት');
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
            $('#mySidenav a:eq(0)').find('span:eq(0)').text('敏感内容');
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
            $('#mySidenav a:eq(0)').find('span:eq(0)').text('敏感內容');
            $('#mySidenav a:eq(1)').find('span').text('語言');
            $('#mySidenav a:eq(2)').find('span').text('版本');
        } else if (lan == 'af') {
            $('.stylebtn').text('Tik in');
            $('.mobile p:eq(0)').text('Kyk na 6000+ TV -kanale ...');
            $('.mobile p:eq(1)').text('Kyk films, reekse, anime ...');
            $('.mobile p:eq(2)').text('Luister na 28000+ radiostasies ...');
            $('.mobile p:eq(3)').text('Porno video\'s ...');
            $('h2').text('kies');
            $('#selectform input:eq(0)').next().text('land');
            $('#selectform input:eq(1)').next().text('Taal');
            $('#selectform input:eq(2)').next().text('kategorie');
            $('#mySidenav a:eq(0)').find('span:eq(0)').text('sensitiewe inhoud');
            $('#mySidenav a:eq(1)').find('span').text('Taal');
            $('#mySidenav a:eq(2)').find('span').text('weergawe');
        } else if (lan == 'ja') {
            $('.stylebtn').text('入力');
            $('.mobile p:eq(0)').text('6000以上のテレビチャンネルを見る...');
            $('.mobile p:eq(1)').text('映画、シリーズ、アニメを見る...');
            $('.mobile p:eq(2)').text('28000以上のラジオ局を聞く...');
            $('.mobile p:eq(3)').text('ポルノビデオ...');
            $('h2').text('選択する');
            $('#selectform input:eq(0)').next().text('国');
            $('#selectform input:eq(1)').next().text('言語');
            $('#selectform input:eq(2)').next().text('カテゴリー');
            $('#mySidenav a:eq(0)').find('span:eq(0)').text('デリケートなコンテンツ');
            $('#mySidenav a:eq(1)').find('span').text('言語');
            $('#mySidenav a:eq(2)').find('span').text('バージョン');
        } else if (lan == 'hi') {
            $('.stylebtn').text('प्रवेश करना');
            $('.mobile p:eq(0)').text('6000+ टीवी चैनल देखें...');
            $('.mobile p:eq(1)').text('फिल्में, सीरीज, एनीमे देखें...');
            $('.mobile p:eq(2)').text('28000+ रेडियो स्टेशन सुनें...');
            $('.mobile p:eq(3)').text('अश्लील वीडियो...');
            $('h2').text('चुनते हैं');
            $('#selectform input:eq(0)').next().text('देश');
            $('#selectform input:eq(1)').next().text('भाषा: हिन्दी');
            $('#selectform input:eq(2)').next().text('श्रेणी');
            $('#mySidenav a:eq(0)').find('span:eq(0)').text('संवेदनशील सामग्री');
            $('#mySidenav a:eq(1)').find('span').text('भाषा: हिन्दी');
            $('#mySidenav a:eq(2)').find('span').text('संस्करण');
        } else if (lan == 'ko') {
            $('.stylebtn').text('입력하다');
            $('.mobile p:eq(0)').text('6000개 이상의 TV 채널 시청...');
            $('.mobile p:eq(1)').text('영화, 시리즈, 애니메이션 감상...');
            $('.mobile p:eq(2)').text('28000개 이상의 라디오 방송국 듣기...');
            $('.mobile p:eq(3)').text('포르노 비디오...');
            $('h2').text('선택하다');
            $('#selectform input:eq(0)').next().text('국가');
            $('#selectform input:eq(1)').next().text('언어');
            $('#selectform input:eq(2)').next().text('श्रेणी');
            $('#mySidenav a:eq(0)').find('span:eq(0)').text('범주');
            $('#mySidenav a:eq(1)').find('span').text('언어');
            $('#mySidenav a:eq(2)').find('span').text('버전');
        }
    });
})