// Android-x86 Page JavaScript - v86 (BSD-2-Clause) vendored in vendor/v86.
// This host bundles the emulator engine only. Android-x86 ISO/disk images and
// Google apps are not bundled; users bring their own lawful image.
'use strict';

var i18n = {
    zh: {
        pageTitle: 'Android-x86 模拟器', reset: '重置',
        uploadTitle: '启动 Android-x86 镜像',
        uploadDesc: '选择 Android-x86 的 .iso 或 .img 镜像，在本机浏览器的 x86 虚拟机里启动 Android。请自备合法镜像；本项目不捆绑 Android 系统、GApps 或应用。',
        uploadSelect: '选择镜像',
        uploadHint: '镜像只会留在你的设备上，不会上传到服务器。镜像通常较大，建议使用桌面 Chrome/Edge，并耐心等待首次启动。',
        urlTitle: '从 URL 加载镜像', urlDesc: '输入 Android-x86 .iso / .img 的直接链接（需要站点允许跨域访问）',
        urlPlaceholder: 'https://example.com/android-x86.iso', loadImage: '加载镜像',
        urlFetchFailed: '下载镜像失败，请检查 URL 是否正确。', urlFetchError: '网络错误，无法下载镜像；请改用本地上传。',
        invalidFile: '请选择有效的 Android-x86 镜像文件', loadFailed: 'Android-x86 启动失败',
        noEmulator: 'v86 运行时未加载，请刷新页面重试',
        loading: '正在加载 Android-x86 镜像，请稍候...',
        loadingTip: '镜像解码后 x86 虚拟机开始启动；大镜像可能需要数分钟', playing: '正在启动：',
        pause: '暂停', resume: '继续', restart: '重启', fullscreen: '全屏', exitFullscreen: '按 ESC 退出全屏',
        instructions: '使用说明', controlsTitle: '操作方式',
        controlsHint1: '点击画面获得键盘焦点；Android-x86 启动后可用鼠标点击界面，必要时按 Esc 退出全屏。',
        controlsHint2: '推荐 x86 版 Android 6/7 或更小镜像；内存不足或启动失败时可尝试其他镜像。',
        aboutTitle: '关于',
        aboutHint: '本页使用 v86（BSD-2-Clause）在浏览器里模拟 x86 PC，不分发 Android 系统镜像、GApps 或专有软件；请从 Android-x86 官方项目或其他合法来源自行获取镜像。',
        fileProtocolHint: '请通过 HTTP 服务器访问本页（file:// 无法加载 WASM 模拟器）'
    },
    en: {
        pageTitle: 'Android-x86 Emulator', reset: 'Reset',
        uploadTitle: 'Boot an Android-x86 Image',
        uploadDesc: 'Select an Android-x86 .iso or .img and boot Android in a local browser x86 VM. Bring your own lawful image; this project bundles no Android system, GApps, or apps.',
        uploadSelect: 'Select Image',
        uploadHint: 'The image stays on your device and is never uploaded. Images are large: desktop Chrome/Edge is recommended and the first boot can take a while.',
        urlTitle: 'Load an Image from URL', urlDesc: 'Enter a direct URL to an Android-x86 .iso / .img (the host must allow cross-origin access)',
        urlPlaceholder: 'https://example.com/android-x86.iso', loadImage: 'Load Image',
        urlFetchFailed: 'Failed to download the image. Please check the URL.', urlFetchError: 'Network error, unable to download the image; use local upload instead.',
        invalidFile: 'Please select a valid Android-x86 image file', loadFailed: 'Failed to boot Android-x86',
        noEmulator: 'v86 runtime not loaded, please refresh the page',
        loading: 'Loading Android-x86 image, please wait...',
        loadingTip: 'The x86 machine starts after the image is decoded; large images can take several minutes', playing: 'Booting: ',
        pause: 'Pause', resume: 'Resume', restart: 'Restart', fullscreen: 'Fullscreen', exitFullscreen: 'Press ESC to exit fullscreen',
        instructions: 'Instructions', controlsTitle: 'Controls',
        controlsHint1: 'Click the screen for keyboard focus; after Android-x86 boots, use the mouse to tap the UI and press Esc to leave fullscreen.',
        controlsHint2: 'Android x86 6/7 or smaller images are recommended; try another image if RAM is insufficient or boot fails.',
        aboutTitle: 'About',
        aboutHint: 'This page uses v86 (BSD-2-Clause) to emulate an x86 PC in the browser. It distributes no Android system image, GApps, or proprietary software; obtain images from the Android-x86 project or another lawful source.',
        fileProtocolHint: 'Please open this page through an HTTP server (file:// cannot load the WASM emulator)'
    },
    ja: {
        pageTitle: 'Android-x86 エミュレータ', reset: 'リセット',
        uploadTitle: 'Android-x86 イメージを起動',
        uploadDesc: 'Android-x86 の .iso / .img を選び、ブラウザ内の x86 仮想マシンで Android を起動します。合法的なイメージは各自で用意してください。Android 本体、GApps、アプリは同梱しません。',
        uploadSelect: 'イメージを選択',
        uploadHint: 'イメージは端末外へ送信されません。大容量なのでデスクトップの Chrome/Edge を推奨し、初回起動には時間がかかります。',
        urlTitle: 'URL からイメージを読み込む', urlDesc: 'Android-x86 .iso / .img の直接 URL を入力（配信元が CORS を許可する必要があります）',
        urlPlaceholder: 'https://example.com/android-x86.iso', loadImage: 'イメージを読み込む',
        urlFetchFailed: 'イメージのダウンロードに失敗しました。URL を確認してください。', urlFetchError: 'ネットワークエラーでダウンロードできません。ローカルアップロードを使ってください。',
        invalidFile: '有効な Android-x86 イメージを選択してください', loadFailed: 'Android-x86 の起動に失敗しました',
        noEmulator: 'v86 ランタイムが読み込まれていません。ページを更新してください',
        loading: 'Android-x86 イメージを読み込み中...',
        loadingTip: 'デコード後に x86 マシンが起動します。大きなイメージは数分かかることがあります', playing: '起動中：',
        pause: '一時停止', resume: '再開', restart: '再起動', fullscreen: '全画面', exitFullscreen: 'ESC キーで全画面を解除',
        instructions: '使い方', controlsTitle: '操作方法',
        controlsHint1: '画面をクリックしてキーボードフォーカスを合わせます。起動後はマウスで UI を操作し、必要なら Esc で全画面を解除します。',
        controlsHint2: 'Android x86 6/7 または小さめのイメージを推奨します。メモリ不足や起動失敗時は別イメージをお試しください。',
        aboutTitle: 'について',
        aboutHint: 'このページは v86（BSD-2-Clause）でブラウザ内の x86 PC をエミュレートします。Android イメージ、GApps、 proprietary ソフトウェアは配布しません。Android-x86 プロジェクトなど合法的な入手元から取得してください。',
        fileProtocolHint: 'このページは HTTP サーバー経由で開いてください（file:// では WASM を読み込めません）'
    },
    ko: {
        pageTitle: 'Android-x86 에뮬레이터', reset: '재설정',
        uploadTitle: 'Android-x86 이미지 부팅',
        uploadDesc: 'Android-x86 .iso / .img를 선택해 브라우저 로컬 x86 가상 머신에서 Android를 부팅합니다. 합법적인 이미지는 직접 준비하세요. Android 시스템, GApps, 앱은 포함되지 않습니다.',
        uploadSelect: '이미지 선택',
        uploadHint: '이미지는 기기에만 남고 서버로 전송되지 않습니다. 용량이 크므로 데스크톱 Chrome/Edge를 권장하며 첫 부팅은 시간이 걸릴 수 있습니다.',
        urlTitle: 'URL에서 이미지 로드', urlDesc: 'Android-x86 .iso / .img의 직접 URL을 입력하세요(호스트가 CORS를 허용해야 합니다)',
        urlPlaceholder: 'https://example.com/android-x86.iso', loadImage: '이미지 로드',
        urlFetchFailed: '이미지 다운로드 실패. URL을 확인하세요.', urlFetchError: '네트워크 오류로 다운로드할 수 없습니다. 로컬 업로드를 사용하세요.',
        invalidFile: '유효한 Android-x86 이미지를 선택하세요', loadFailed: 'Android-x86 부팅 실패',
        noEmulator: 'v86 런타임이 로드되지 않았습니다. 페이지를 새로고침하세요',
        loading: 'Android-x86 이미지 로드 중...',
        loadingTip: '디코딩 후 x86 머신이 시작됩니다. 큰 이미지는 몇 분 걸릴 수 있습니다', playing: '부팅 중: ',
        pause: '일시정지', resume: '계속', restart: '재시작', fullscreen: '전체 화면', exitFullscreen: 'ESC 키로 전체 화면 종료',
        instructions: '사용 방법', controlsTitle: '조작 방법',
        controlsHint1: '화면을 클릭해 키보드 포커스를 주세요. 부팅 후에는 마우스로 UI를 조작하고, 필요하면 Esc로 전체 화면을 종료합니다.',
        controlsHint2: 'Android x86 6/7 또는 작은 이미지를 권장합니다. 메모리 부족이나 부팅 실패 시 다른 이미지를 사용하세요.',
        aboutTitle: '소개',
        aboutHint: '이 페이지는 v86(BSD-2-Clause)으로 브라우저에서 x86 PC를 에뮬레이트합니다. Android 이미지, GApps, 독점 소프트웨어는 배포하지 않으며 Android-x86 프로젝트 등 합법적인 경로에서 이미지를 받으세요.',
        fileProtocolHint: 'HTTP 서버로 이 페이지를 열어주세요(file://에서는 WASM을 로드할 수 없습니다)'
    },
    fr: {
        pageTitle: 'Émulateur Android-x86', reset: 'Réinitialiser',
        uploadTitle: 'Démarrer une image Android-x86',
        uploadDesc: 'Sélectionnez une image Android-x86 .iso / .img et démarrez Android dans une machine virtuelle x86 locale. Apportez votre propre image légale ; aucun système Android, GApps ou application n\'est fourni.',
        uploadSelect: 'Sélectionner une image',
        uploadHint: 'L\'image reste sur votre appareil et n\'est jamais envoyée à un serveur. Les images sont volumineuses : Chrome/Edge sur ordinateur est recommandé et le premier démarrage peut être long.',
        urlTitle: 'Charger une image depuis une URL', urlDesc: 'Entrez l\'URL directe d\'une image Android-x86 .iso / .img (le site doit autoriser CORS)',
        urlPlaceholder: 'https://example.com/android-x86.iso', loadImage: 'Charger l\'image',
        urlFetchFailed: 'Échec du téléchargement. Vérifiez l\'URL.', urlFetchError: 'Erreur réseau, impossible de télécharger l\'image ; utilisez l\'envoi local.',
        invalidFile: 'Veuillez sélectionner une image Android-x86 valide', loadFailed: 'Échec du démarrage d\'Android-x86',
        noEmulator: 'Runtime v86 non chargé, veuillez actualiser la page',
        loading: 'Chargement de l\'image Android-x86, veuillez patienter...',
        loadingTip: 'La machine x86 démarre après le décodage ; les grandes images peuvent prendre plusieurs minutes', playing: 'Démarrage : ',
        pause: 'Pause', resume: 'Reprendre', restart: 'Redémarrer', fullscreen: 'Plein écran', exitFullscreen: 'Appuyez sur ESC pour quitter le plein écran',
        instructions: 'Instructions', controlsTitle: 'Commandes',
        controlsHint1: 'Cliquez sur l\'écran pour capturer le clavier ; après le démarrage, utilisez la souris et appuyez sur Esc pour quitter le plein écran.',
        controlsHint2: 'Les images Android x86 6/7 ou plus petites sont recommandées ; essayez une autre image en cas de mémoire insuffisante.',
        aboutTitle: 'À propos',
        aboutHint: 'Cette page utilise v86 (BSD-2-Clause) pour émuler un PC x86 dans le navigateur. Aucune image Android, GApps ou logiciel propriétaire n\'est distribué ; obtenez une image depuis le projet Android-x86 ou une autre source légale.',
        fileProtocolHint: 'Ouvrez cette page via un serveur HTTP (file:// ne peut pas charger le WASM)'
    },
    de: {
        pageTitle: 'Android-x86-Emulator', reset: 'Zurücksetzen',
        uploadTitle: 'Android-x86-Image starten',
        uploadDesc: 'Wählen Sie ein Android-x86-.iso-/.img-Image und starten Sie Android in einer lokalen x86-VM im Browser. Bringen Sie Ihr eigenes legales Image mit; dieses Projekt enthält kein Android-System, keine GApps und keine Apps.',
        uploadSelect: 'Image auswählen',
        uploadHint: 'Das Image bleibt auf Ihrem Gerät und wird nie hochgeladen. Images sind groß: Desktop-Chrome/Edge wird empfohlen, der erste Start kann lange dauern.',
        urlTitle: 'Image von URL laden', urlDesc: 'Direkte URL zu einem Android-x86-.iso / .img eingeben (die Quelle muss CORS erlauben)',
        urlPlaceholder: 'https://example.com/android-x86.iso', loadImage: 'Image laden',
        urlFetchFailed: 'Image-Download fehlgeschlagen. Bitte URL prüfen.', urlFetchError: 'Netzwerkfehler, Image konnte nicht geladen werden; nutzen Sie den lokalen Upload.',
        invalidFile: 'Bitte eine gültige Android-x86-Imagedatei wählen', loadFailed: 'Android-x86-Start fehlgeschlagen',
        noEmulator: 'v86-Laufzeit nicht geladen, bitte Seite neu laden',
        loading: 'Android-x86-Image wird geladen, bitte warten...',
        loadingTip: 'Die x86-Maschine startet nach dem Dekodieren; große Images können mehrere Minuten brauchen', playing: 'Startet: ',
        pause: 'Pause', resume: 'Weiter', restart: 'Neustart', fullscreen: 'Vollbild', exitFullscreen: 'ESC zum Beenden des Vollbilds',
        instructions: 'Anleitung', controlsTitle: 'Steuerung',
        controlsHint1: 'Klicken Sie auf den Bildschirm für den Tastaturfokus; nach dem Booten können Sie die Oberfläche mit der Maus bedienen und mit Esc den Vollbildmodus verlassen.',
        controlsHint2: 'Android-x86 6/7 oder kleinere Images werden empfohlen; bei Speichermangel oder Startfehlern ein anderes Image versuchen.',
        aboutTitle: 'Über',
        aboutHint: 'Diese Seite nutzt v86 (BSD-2-Clause), um einen x86-PC im Browser zu emulieren. Es werden keine Android-Images, GApps oder proprietäre Software verteilt; beziehen Sie Images vom Android-x86-Projekt oder einer anderen legalen Quelle.',
        fileProtocolHint: 'Bitte über einen HTTP-Server öffnen (file:// kann das WASM nicht laden)'
    },
    es: {
        pageTitle: 'Emulador de Android-x86', reset: 'Reiniciar',
        uploadTitle: 'Iniciar una imagen de Android-x86',
        uploadDesc: 'Seleccione una imagen .iso / .img de Android-x86 e inicie Android en una máquina virtual x86 local. Traiga su propia imagen legal; este proyecto no incluye el sistema Android, GApps ni aplicaciones.',
        uploadSelect: 'Seleccionar imagen',
        uploadHint: 'La imagen permanece en su dispositivo y nunca se sube. Las imágenes son grandes: se recomienda Chrome/Edge de escritorio y el primer inicio puede tardar.',
        urlTitle: 'Cargar imagen desde URL', urlDesc: 'Introduzca una URL directa a un .iso / .img de Android-x86 (el sitio debe permitir CORS)',
        urlPlaceholder: 'https://example.com/android-x86.iso', loadImage: 'Cargar imagen',
        urlFetchFailed: 'Error al descargar la imagen. Compruebe la URL.', urlFetchError: 'Error de red, no se pudo descargar la imagen; use la subida local.',
        invalidFile: 'Seleccione un archivo de imagen Android-x86 válido', loadFailed: 'Error al iniciar Android-x86',
        noEmulator: 'El motor v86 no se cargó; actualice la página',
        loading: 'Cargando la imagen de Android-x86, espere...',
        loadingTip: 'La máquina x86 se inicia tras decodificar la imagen; las imágenes grandes pueden tardar varios minutos', playing: 'Iniciando: ',
        pause: 'Pausa', resume: 'Continuar', restart: 'Reiniciar', fullscreen: 'Pantalla completa', exitFullscreen: 'Pulse ESC para salir de pantalla completa',
        instructions: 'Instrucciones', controlsTitle: 'Controles',
        controlsHint1: 'Haga clic en la pantalla para capturar el teclado; tras el arranque, use el ratón y pulse Esc para salir de pantalla completa.',
        controlsHint2: 'Se recomiendan imágenes Android x86 6/7 o más pequeñas; pruebe otra imagen si falta memoria o falla el arranque.',
        aboutTitle: 'Acerca de',
        aboutHint: 'Esta página usa v86 (BSD-2-Clause) para emular un PC x86 en el navegador. No distribuye imágenes de Android, GApps ni software propietario; obtenga imágenes del proyecto Android-x86 u otra fuente legal.',
        fileProtocolHint: 'Abra esta página mediante un servidor HTTP (file:// no puede cargar WASM)'
    },
    ru: {
        pageTitle: 'Эмулятор Android-x86', reset: 'Сброс',
        uploadTitle: 'Загрузить образ Android-x86',
        uploadDesc: 'Выберите образ Android-x86 .iso / .img и запустите Android в локальной x86-виртуальной машине браузера. Используйте законный образ: проект не содержит систему Android, GApps или приложения.',
        uploadSelect: 'Выбрать образ',
        uploadHint: 'Образ остаётся на устройстве и не загружается на сервер. Образы большие: рекомендуем Chrome/Edge на ПК, первый запуск может быть долгим.',
        urlTitle: 'Загрузить образ по URL', urlDesc: 'Введите прямую ссылку на Android-x86 .iso / .img (источник должен разрешать CORS)',
        urlPlaceholder: 'https://example.com/android-x86.iso', loadImage: 'Загрузить образ',
        urlFetchFailed: 'Не удалось скачать образ. Проверьте URL.', urlFetchError: 'Ошибка сети, не удалось скачать образ; используйте локальную загрузку.',
        invalidFile: 'Выберите допустимый файл образа Android-x86', loadFailed: 'Не удалось запустить Android-x86',
        noEmulator: 'Среда v86 не загружена, обновите страницу',
        loading: 'Загрузка образа Android-x86, подождите...',
        loadingTip: 'x86-машина запустится после декодирования; большие образы могут занимать несколько минут', playing: 'Запуск: ',
        pause: 'Пауза', resume: 'Продолжить', restart: 'Перезапуск', fullscreen: 'Полный экран', exitFullscreen: 'Нажмите ESC для выхода из полноэкранного режима',
        instructions: 'Инструкции', controlsTitle: 'Управление',
        controlsHint1: 'Щёлкните по экрану для захвата клавиатуры; после загрузки используйте мышь, а Esc — для выхода из полного экрана.',
        controlsHint2: 'Рекомендуются образы Android x86 6/7 или меньшего размера; при нехватке памяти попробуйте другой образ.',
        aboutTitle: 'О проекте',
        aboutHint: 'Эта страница использует v86 (BSD-2-Clause) для эмуляции x86-ПК в браузере. Образы Android, GApps и проприетарное ПО не распространяются; получайте образы из проекта Android-x86 или других законных источников.',
        fileProtocolHint: 'Откройте страницу через HTTP-сервер (file:// не может загрузить WASM)'
    }
};

// ---- helpers -----------------------------------------------------------
var currentLang = 'en';

var V86_RUNTIME = '../vendor/v86/libv86.js';
var V86_WASM = '../vendor/v86/v86.wasm';

function t(key) {
    var lang = i18n[currentLang] ? currentLang : 'en';
    return (i18n[lang] && i18n[lang][key]) || i18n.en[key] || key;
}

function applyTranslations() {
    var stored = 'en';
    try { stored = localStorage.getItem('language') || localStorage.getItem('lang') || 'en'; } catch (e) { /* ignore */ }
    currentLang = i18n[stored] ? stored : 'en';
    document.documentElement.lang = currentLang;
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
        el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
}

var emulator = null;
var bootConfig = null;
var isPaused = false;

function showToast(message) {
    var toast = document.getElementById('toast');
    var text = document.getElementById('toastMessage');
    if (!toast || !text) return;
    text.textContent = message;
    toast.classList.remove('hidden');
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(function() { toast.classList.add('hidden'); }, 3200);
}

function setOverlay(visible) {
    var overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.toggle('hidden', !visible);
}

function showPlayer(name) {
    document.getElementById('uploadSection').classList.add('hidden');
    document.getElementById('resetBtn').style.display = 'flex';
    document.getElementById('playerSection').classList.add('active');
    window.scrollTo(0, 0);
    showToast(t('playing') + name);
}

function backToUpload() {
    if (emulator) {
        try { emulator.destroy(); } catch (e) { /* already gone */ }
        emulator = null;
    }
    bootConfig = null;
    isPaused = false;
    document.getElementById('uploadSection').classList.remove('hidden');
    document.getElementById('resetBtn').style.display = 'none';
    document.getElementById('playerSection').classList.remove('active');
    setOverlay(false);
}

function detectMount(name, size) {
    var lower = String(name || '').toLowerCase();
    if (/\.iso$/.test(lower)) return 'cdrom';
    if (/\.(img|ima|dsk|vfd)$/.test(lower) && size <= 3 * 1024 * 1024) return 'fda';
    return 'hda';
}

function bootImage(buffer, mount, name) {
    if (buffer.byteLength < 512) {
        showToast(t('invalidFile'));
        setOverlay(false);
        return;
    }
    if (typeof V86 !== 'function') {
        showToast(t('noEmulator'));
        setOverlay(false);
        return;
    }
    if (emulator) {
        try { emulator.destroy(); } catch (e) { /* already gone */ }
        emulator = null;
    }
    bootConfig = { buffer: buffer, mount: mount, name: name };
    var opts = {
        wasm_path: V86_WASM,
        memory_size: 512 * 1024 * 1024,
        vga_memory_size: 8 * 1024 * 1024,
        screen_container: document.getElementById('screen_container'),
        bios: { url: '../vendor/v86/seabios.bin' },
        vga_bios: { url: '../vendor/v86/vgabios.bin' },
        autostart: true
    };
    var image = { buffer: buffer };
    if (mount === 'fda') opts.fda = image;
    else if (mount === 'cdrom') opts.cdrom = image;
    else opts.hda = image;
    setOverlay(true);
    try {
        emulator = new V86(opts);
        emulator.add_listener('emulator-ready', function() { setOverlay(false); });
        setTimeout(function() { setOverlay(false); }, 20000);
        showPlayer(name);
    } catch (err) {
        console.error('Android-x86 boot failed:', err);
        setOverlay(false);
        showToast(t('loadFailed'));
        backToUpload();
    }
}

function loadFile(file) {
    if (!file) return;
    file.arrayBuffer().then(function(buf) {
        bootImage(buf, detectMount(file.name, file.size), file.name);
    }).catch(function(err) {
        console.error('Android-x86 image read failed:', err);
        showToast(t('loadFailed'));
    });
}

function bindEvents() {
    document.getElementById('backBtn').addEventListener('click', function() {
        if (document.getElementById('playerSection').classList.contains('active')) {
            backToUpload();
            return;
        }
        window.location.href = '../routes/game.html?category=mobile';
    });
    document.getElementById('resetBtn').addEventListener('click', backToUpload);
    var input = document.getElementById('diskInput');
    document.getElementById('uploadBtn').addEventListener('click', function() { input.click(); });
    input.addEventListener('change', function() {
        loadFile(input.files && input.files[0]);
        input.value = '';
    });
    document.getElementById('urlLoadBtn').addEventListener('click', function() {
        var url = (document.getElementById('diskUrlInput').value || '').trim();
        if (!/^https?:\/\//i.test(url)) {
            showToast(t('urlFetchFailed'));
            return;
        }
        setOverlay(true);
        fetch(url).then(function(res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.arrayBuffer();
        }).then(function(buf) {
            var name = url.split('/').pop().split('?')[0] || 'android-x86.img';
            bootImage(buf, detectMount(name, buf.byteLength), name);
        }).catch(function(err) {
            console.error('Android-x86 URL image failed:', err);
            setOverlay(false);
            showToast(t('urlFetchError'));
        });
    });
    document.getElementById('pauseBtn').addEventListener('click', function() {
        if (!emulator) return;
        isPaused = !isPaused;
        try { if (isPaused) emulator.stop(); else emulator.run(); } catch (e) { /* ignore */ }
        var btn = document.getElementById('pauseBtn');
        var label = btn.querySelector('span[data-i18n]');
        if (label) label.textContent = isPaused ? t('resume') : t('pause');
        var icon = btn.querySelector('i');
        if (icon) icon.className = isPaused ? 'fas fa-play' : 'fas fa-pause';
    });
    document.getElementById('restartBtn').addEventListener('click', function() {
        if (bootConfig) bootImage(bootConfig.buffer, bootConfig.mount, bootConfig.name);
    });
    document.getElementById('fullscreenBtn').addEventListener('click', function() {
        var wrapper = document.getElementById('screenWrapper');
        if (!wrapper) return;
        if (document.fullscreenElement) document.exitFullscreen();
        else if (wrapper.requestFullscreen) wrapper.requestFullscreen();
    });
    if (location.protocol === 'file:') showToast(t('fileProtocolHint'));
}

document.addEventListener('DOMContentLoaded', function() {
    applyTranslations();
    bindEvents();
});
