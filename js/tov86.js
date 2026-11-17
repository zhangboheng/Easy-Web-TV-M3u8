// Retro PC (x86) Page JavaScript - based on v86 (vendored at vendor/v86, BSD-2-Clause).
// v86 emulates a complete x86 PC: floppy / hard disk / CD-ROM images and Linux
// kernels (bzImage) boot directly in the browser.

// Internationalization (same language set as todos.js)
var i18n = {
    zh: {
        pageTitle: '复古电脑 (x86)',
        reset: '重置',
        tabFile: '磁盘镜像',
        tabUrl: 'URL 输入',
        tabPreset: '预设系统',
        uploadTitle: '引导 PC 磁盘镜像',
        uploadDesc: '选择软盘 / 硬盘 / 光盘镜像或 Linux 内核 (bzImage)，在浏览器中启动整台 x86 电脑',
        uploadSelect: '选择磁盘镜像',
        mountLabel: '挂载为：',
        mountAuto: '自动识别',
        mountFloppy: '软盘',
        mountHdd: '硬盘',
        mountCdrom: '光盘',
        mountKernel: 'Linux 内核 (bzImage)',
        uploadHint: '镜像不会上传到任何服务器，完全本地运行。点击画面捕获键盘，双击锁定鼠标。',
        urlTitle: '从 URL 加载磁盘镜像',
        urlDesc: '输入磁盘镜像 (.img / .iso / .vhd / bzImage) 的直接链接',
        urlPlaceholder: 'https://example.com/disk.img',
        loadImage: '加载镜像',
        urlTip: '提示：必要时会通过公共 CORS 代理下载，大镜像可能较慢。',
        presetTitle: '预设系统',
        presetDesc: '一键启动的开源引导扇区游戏（即时），以及官方 v86 演示 CDN 上的系统镜像（点击下载，再到"磁盘镜像"页选择启动）',
        presetDownloaded: '下载已开始。请切换到"磁盘镜像"页，选择刚下载的文件即可启动。',
        loading: '正在加载磁盘镜像，请稍候...',
        loadingTip: '镜像解码完成后 x86 电脑开始启动，大镜像可能需要一些时间',
        playing: '正在启动：',
        invalidFile: '请选择有效的磁盘镜像文件',
        loadFailed: '镜像加载失败',
        urlFetchFailed: '下载镜像失败，请检查 URL 是否正确。',
        urlFetchError: '网络错误，无法下载镜像。',
        noEmulator: 'v86 运行时未加载，请刷新页面重试',
        restart: '重启',
        pause: '暂停',
        resume: '继续',
        fullscreen: '全屏',
        exitFullscreen: '按 ESC 退出全屏',
        instructions: '使用说明',
        controlsTitle: '操作方式',
        controlsHint: '点击画面获得键盘焦点，客户系统像真实电脑一样处理输入',
        mouseHint: '双击画面锁定鼠标，按 Esc 或再次双击释放',
        anyKeyHint: '如果画面停在 "Press any key" 或 DOS 提示符，请点击画面并按 Enter；Windows 3.0 预设需输入 WIN/3',
        fileProtocolHint: '请通过 HTTP 服务器访问本页（file:// 直开无法加载模拟器）',
        fullscreenDesc: '全屏：使用画面上方工具栏按钮'
    },
    en: {
        pageTitle: 'Retro PC (x86)',
        reset: 'Reset',
        tabFile: 'Disk Image',
        tabUrl: 'URL Input',
        tabPreset: 'Preset Systems',
        uploadTitle: 'Boot a PC Disk Image',
        uploadDesc: 'Select a floppy / hard disk / CD-ROM image or a Linux kernel (bzImage) to boot in the browser',
        uploadSelect: 'Select Disk Image',
        mountLabel: 'Mount as:',
        mountAuto: 'Auto detect',
        mountFloppy: 'Floppy disk',
        mountHdd: 'Hard disk',
        mountCdrom: 'CD-ROM',
        mountKernel: 'Linux kernel (bzImage)',
        uploadHint: 'Images never leave your device. Click the screen to capture the keyboard, double-click to lock the mouse.',
        urlTitle: 'Load a Disk Image from URL',
        urlDesc: 'Enter the direct URL of a disk image (.img / .iso / .vhd / bzImage)',
        urlPlaceholder: 'https://example.com/disk.img',
        loadImage: 'Load Image',
        urlTip: 'Tip: downloads go through a public CORS proxy when needed, so large images can be slow.',
        presetTitle: 'Preset Systems',
        presetDesc: 'Open-source bootsector games boot instantly with one click; OS images from the official v86 demo CDN are downloaded, then select them on the Disk Image tab to boot',
        presetDownloaded: 'Download started. Switch to the Disk Image tab and select the downloaded file to boot it.',
        loading: 'Loading disk image, please wait...',
        loadingTip: 'The x86 machine starts after the image is decoded; big images may take a while',
        playing: 'Booting: ',
        invalidFile: 'Please select a valid disk image file',
        loadFailed: 'Failed to load the disk image',
        urlFetchFailed: 'Failed to download the image. Please check the URL.',
        urlFetchError: 'Network error, unable to download the image.',
        noEmulator: 'v86 runtime not loaded, please refresh the page',
        restart: 'Restart',
        pause: 'Pause',
        resume: 'Resume',
        fullscreen: 'Fullscreen',
        exitFullscreen: 'Press ESC to exit fullscreen',
        instructions: 'Instructions',
        controlsTitle: 'Controls',
        controlsHint: 'Click the screen to give it keyboard focus; the guest OS handles input like a real PC',
        mouseHint: 'Double-click the screen to lock the mouse, press Esc or double-click again to release',
        anyKeyHint: 'If the screen stalls at "Press any key" or a DOS prompt, click it and press Enter; for the Windows 3.0 preset type WIN/3',
        fileProtocolHint: 'Please open this page through an HTTP server (file:// cannot load the emulator)',
        fullscreenDesc: 'Fullscreen: use the toolbar buttons above the screen'
    },
    ja: {
        pageTitle: 'レトロPC (x86)',
        reset: 'リセット',
        tabFile: 'ディスクイメージ',
        tabUrl: 'URL入力',
        tabPreset: 'プリセット',
        uploadTitle: 'PCディスクイメージを起動',
        uploadDesc: 'フロッピー / ハードディスク / CD-ROM イメージや Linux カーネル (bzImage) をブラウザで起動',
        uploadSelect: 'ディスクイメージを選択',
        mountLabel: 'マウント：',
        mountAuto: '自動判定',
        mountFloppy: 'フロッピー',
        mountHdd: 'ハードディスク',
        mountCdrom: 'CD-ROM',
        mountKernel: 'Linuxカーネル (bzImage)',
        uploadHint: 'イメージは端末外へ送信されません。画面をクリックするとキーボード入力がキャプチャされ、ダブルクリックでマウスをロックします。',
        urlTitle: 'URLからディスクイメージを読み込む',
        urlDesc: 'ディスクイメージ (.img / .iso / .vhd / bzImage) の直接URLを入力',
        urlPlaceholder: 'https://example.com/disk.img',
        loadImage: 'イメージを読み込む',
        urlTip: 'ヒント：必要に応じて公共CORSプロキシ経由でダウンロードするため、大きなイメージは時間がかかることがあります。',
        presetTitle: 'プリセットシステム',
        presetDesc: 'オープンソースのブートセクターゲームはワンクリックで即起動。公式 v86 デモCDNのOSイメージはダウンロード後、「ディスクイメージ」タブで選択して起動します',
        presetDownloaded: 'ダウンロードを開始しました。「ディスクイメージ」タブに切り替え、ダウンロードしたファイルを選択して起動してください。',
        loading: 'ディスクイメージを読み込み中...',
        loadingTip: 'イメージのデコード後、x86マシンが起動します。大きなイメージは時間がかかることがあります',
        playing: '起動中：',
        invalidFile: '有効なディスクイメージを選択してください',
        loadFailed: 'イメージの読み込みに失敗しました',
        urlFetchFailed: 'イメージのダウンロードに失敗しました。URLを確認してください。',
        urlFetchError: 'ネットワークエラー、イメージをダウンロードできません。',
        noEmulator: 'v86ランタイムが読み込まれていません。ページを更新してください',
        restart: '再起動',
        pause: '一時停止',
        resume: '再開',
        fullscreen: '全画面',
        exitFullscreen: 'ESCキーで全画面を解除',
        instructions: '使い方',
        controlsTitle: '操作方法',
        controlsHint: '画面をクリックしてキーボードフォーカスを与えると、ゲストOSが実PCのように入力を処理します',
        mouseHint: '画面をダブルクリックでマウスをロック、Escまたは再ダブルクリックで解除',
        anyKeyHint: '画面が "Press any key" や DOSプロンプトで止まったら、画面をクリックしてEnterを押してください。Windows 3.0プリセットでは WIN/3 と入力します',
        fileProtocolHint: 'このページはHTTPサーバー経由で開いてください（file://ではエミュレータをロードできません）',
        fullscreenDesc: '全画面：画面上部ツールバーのボタンを使用'
    },
    ko: {
        pageTitle: '레트로 PC (x86)',
        reset: '재설정',
        tabFile: '디스크 이미지',
        tabUrl: 'URL 입력',
        tabPreset: '프리셋',
        uploadTitle: 'PC 디스크 이미지 부팅',
        uploadDesc: '플로피 / 하드디스크 / CD-ROM 이미지 또는 Linux 커널 (bzImage)을 브라우저에서 부팅',
        uploadSelect: '디스크 이미지 선택',
        mountLabel: '마운트:',
        mountAuto: '자동 감지',
        mountFloppy: '플로피',
        mountHdd: '하드디스크',
        mountCdrom: 'CD-ROM',
        mountKernel: 'Linux 커널 (bzImage)',
        uploadHint: '이미지는 기기를 벗어나지 않습니다. 화면을 클릭하면 키보드가 캡처되고, 더블클릭으로 마우스가 잠깁니다.',
        urlTitle: 'URL에서 디스크 이미지 로드',
        urlDesc: '디스크 이미지 (.img / .iso / .vhd / bzImage)의 직접 URL을 입력',
        urlPlaceholder: 'https://example.com/disk.img',
        loadImage: '이미지 로드',
        urlTip: '팁: 필요 시 공용 CORS 프록시를 통해 다운로드되므로 큰 이미지는 느릴 수 있습니다.',
        presetTitle: '프리셋 시스템',
        presetDesc: '오픈소스 부트섹터 게임은 클릭 한 번으로 즉시 부팅됩니다. 공식 v86 데모 CDN의 OS 이미지는 다운로드 후 디스크 이미지 탭에서 선택하여 부팅하세요',
        presetDownloaded: '다운로드가 시작되었습니다. "디스크 이미지" 탭으로 전환하여 다운로드한 파일을 선택해 부팅하세요.',
        loading: '디스크 이미지를 불러오는 중...',
        loadingTip: '이미지 디코딩 후 x86 머신이 시작됩니다. 큰 이미지는 시간이 걸릴 수 있습니다',
        playing: '부팅 중: ',
        invalidFile: '유효한 디스크 이미지를 선택하세요',
        loadFailed: '이미지 로드 실패',
        urlFetchFailed: '이미지 다운로드 실패. URL을 확인하세요.',
        urlFetchError: '네트워크 오류, 이미지를 다운로드할 수 없습니다.',
        noEmulator: 'v86 런타임이 로드되지 않았습니다. 페이지를 새로고침하세요',
        restart: '재시작',
        pause: '일시정지',
        resume: '계속',
        fullscreen: '전체 화면',
        exitFullscreen: 'ESC 키로 전체 화면 종료',
        instructions: '사용 방법',
        controlsTitle: '조작 방법',
        controlsHint: '화면을 클릭해 키보드 포커스를 주면 게스트 OS가 실제 PC처럼 입력을 처리합니다',
        mouseHint: '화면 더블클릭으로 마우스 잠금, Esc 또는 다시 더블클릭으로 해제',
        anyKeyHint: '화면이 "Press any key"나 DOS 프롬프트에서 멈추면 화면을 클릭하고 Enter를 누르세요. Windows 3.0 프리셋은 WIN/3을 입력하세요',
        fileProtocolHint: '이 페이지는 HTTP 서버를 통해 열어주세요 (file://에서는 에뮬레이터를 로드할 수 없습니다)',
        fullscreenDesc: '전체 화면: 화면 상단 툴바 버튼 사용'
    },
    fr: {
        pageTitle: 'PC rétro (x86)',
        reset: 'Réinitialiser',
        tabFile: 'Image disque',
        tabUrl: 'URL',
        tabPreset: 'Préréglages',
        uploadTitle: 'Démarrer une image disque PC',
        uploadDesc: 'Sélectionnez une image disquette / disque dur / CD-ROM ou un noyau Linux (bzImage) à démarrer dans le navigateur',
        uploadSelect: 'Sélectionner une image disque',
        mountLabel: 'Monter comme :',
        mountAuto: 'Détection auto',
        mountFloppy: 'Disquette',
        mountHdd: 'Disque dur',
        mountCdrom: 'CD-ROM',
        mountKernel: 'Noyau Linux (bzImage)',
        uploadHint: 'Les images ne quittent jamais votre appareil. Cliquez sur l\'écran pour capturer le clavier, double-cliquez pour verrouiller la souris.',
        urlTitle: 'Charger une image disque depuis une URL',
        urlDesc: 'Entrez l\'URL directe d\'une image disque (.img / .iso / .vhd / bzImage)',
        urlPlaceholder: 'https://example.com/disk.img',
        loadImage: 'Charger l\'image',
        urlTip: 'Astuce : les téléchargements passent par un proxy CORS public si nécessaire, les grandes images peuvent être lentes.',
        presetTitle: 'Systèmes préréglés',
        presetDesc: 'Les jeux bootsector open-source démarrent en un clic ; les images OS du CDN de démo officiel v86 sont téléchargées, puis sélectionnez-les dans l\'onglet Disk Image',
        presetDownloaded: 'Téléchargement lancé. Passez à l\'onglet Image disque et sélectionnez le fichier téléchargé pour démarrer.',
        loading: 'Chargement de l\'image disque, veuillez patienter...',
        loadingTip: 'La machine x86 démarre après le décodage de l\'image ; les grandes images peuvent prendre du temps',
        playing: 'Démarrage : ',
        invalidFile: 'Veuillez sélectionner un fichier image disque valide',
        loadFailed: 'Échec du chargement de l\'image',
        urlFetchFailed: 'Échec du téléchargement. Vérifiez l\'URL.',
        urlFetchError: 'Erreur réseau, impossible de télécharger l\'image.',
        noEmulator: 'Runtime v86 non chargé, veuillez actualiser la page',
        restart: 'Redémarrer',
        pause: 'Pause',
        resume: 'Reprendre',
        fullscreen: 'Plein écran',
        exitFullscreen: 'Appuyez sur ÉCHAP pour quitter le plein écran',
        instructions: 'Instructions',
        controlsTitle: 'Commandes',
        controlsHint: 'Cliquez sur l\'écran pour lui donner le focus clavier ; l\'OS invité gère les entrées comme un vrai PC',
        mouseHint: 'Double-cliquez sur l\'écran pour verrouiller la souris, Échap ou double-clic pour libérer',
        anyKeyHint: 'Si l\'écran se bloque sur « Press any key » ou une invite DOS, cliquez puis appuyez sur Entrée ; pour le préréglage Windows 3.0 tapez WIN/3',
        fileProtocolHint: 'Veuillez ouvrir cette page via un serveur HTTP (file:// ne peut pas charger l\'émulateur)',
        fullscreenDesc: 'Plein écran : utilisez les boutons de la barre d\'outils au-dessus de l\'écran'
    },
    de: {
        pageTitle: 'Retro-PC (x86)',
        reset: 'Zurücksetzen',
        tabFile: 'Disk-Image',
        tabUrl: 'URL',
        tabPreset: 'Vorlagen',
        uploadTitle: 'PC-Disk-Image booten',
        uploadDesc: 'Disketten-/Festplatten-/CD-ROM-Image oder Linux-Kernel (bzImage) im Browser booten',
        uploadSelect: 'Disk-Image auswählen',
        mountLabel: 'Einbinden als:',
        mountAuto: 'Automatisch',
        mountFloppy: 'Diskette',
        mountHdd: 'Festplatte',
        mountCdrom: 'CD-ROM',
        mountKernel: 'Linux-Kernel (bzImage)',
        uploadHint: 'Images verlassen Ihr Gerät nie. Klicken Sie auf den Bildschirm, um die Tastatur zu erfassen; Doppelklick sperrt die Maus.',
        urlTitle: 'Disk-Image von URL laden',
        urlDesc: 'Geben Sie die direkte URL eines Disk-Images (.img / .iso / .vhd / bzImage) ein',
        urlPlaceholder: 'https://example.com/disk.img',
        loadImage: 'Image laden',
        urlTip: 'Tipp: Downloads laufen bei Bedarf über einen öffentlichen CORS-Proxy, große Images können langsam sein.',
        presetTitle: 'Vorlagen-Systeme',
        presetDesc: 'Open-Source-Bootsector-Spiele starten sofort per Klick; OS-Images vom offiziellen v86-Demo-CDN werden heruntergeladen und im Tab „Disk Image" ausgewählt',
        presetDownloaded: 'Download gestartet. Wechseln Sie zum Tab Disk-Image und wählen Sie die heruntergeladene Datei zum Booten aus.',
        loading: 'Disk-Image wird geladen, bitte warten...',
        loadingTip: 'Die x86-Maschine startet nach dem Dekodieren des Images; große Images können dauern',
        playing: 'Startet: ',
        invalidFile: 'Bitte eine gültige Disk-Image-Datei auswählen',
        loadFailed: 'Image konnte nicht geladen werden',
        urlFetchFailed: 'Download fehlgeschlagen. Bitte URL prüfen.',
        urlFetchError: 'Netzwerkfehler, Image kann nicht heruntergeladen werden.',
        noEmulator: 'v86-Runtime nicht geladen, bitte Seite neu laden',
        restart: 'Neustart',
        pause: 'Pause',
        resume: 'Fortsetzen',
        fullscreen: 'Vollbild',
        exitFullscreen: 'ESC drücken, um den Vollbildmodus zu verlassen',
        instructions: 'Anleitung',
        controlsTitle: 'Steuerung',
        controlsHint: 'Klicken Sie auf den Bildschirm für Tastaturfokus; das Gast-OS verarbeitet Eingaben wie ein echter PC',
        mouseHint: 'Doppelklick sperrt die Maus, Esc oder erneuter Doppelklick gibt sie frei',
        anyKeyHint: 'Wenn der Bildschirm bei "Press any key" oder am DOS-Prompt stehen bleibt, klicken Sie hinein und drücken Sie Enter; beim Windows-3.0-Preset geben Sie WIN/3 ein',
        fileProtocolHint: 'Bitte öffnen Sie diese Seite über einen HTTP-Server (file:// kann den Emulator nicht laden)',
        fullscreenDesc: 'Vollbild: Schaltflächen in der Symbolleiste über dem Bildschirm verwenden'
    },
    es: {
        pageTitle: 'PC retro (x86)',
        reset: 'Restablecer',
        tabFile: 'Imagen de disco',
        tabUrl: 'URL',
        tabPreset: 'Predefinidos',
        uploadTitle: 'Iniciar una imagen de disco PC',
        uploadDesc: 'Seleccione una imagen de disquete / disco duro / CD-ROM o un kernel de Linux (bzImage) para arrancar en el navegador',
        uploadSelect: 'Seleccionar imagen de disco',
        mountLabel: 'Montar como:',
        mountAuto: 'Detección automática',
        mountFloppy: 'Disquete',
        mountHdd: 'Disco duro',
        mountCdrom: 'CD-ROM',
        mountKernel: 'Kernel de Linux (bzImage)',
        uploadHint: 'Las imágenes nunca salen de su dispositivo. Haga clic en la pantalla para capturar el teclado; doble clic bloquea el ratón.',
        urlTitle: 'Cargar imagen de disco desde URL',
        urlDesc: 'Ingrese la URL directa de una imagen de disco (.img / .iso / .vhd / bzImage)',
        urlPlaceholder: 'https://example.com/disk.img',
        loadImage: 'Cargar imagen',
        urlTip: 'Consejo: las descargas usan un proxy CORS público si es necesario; las imágenes grandes pueden tardar.',
        presetTitle: 'Sistemas predefinidos',
        presetDesc: 'Los juegos bootsector de código abierto arrancan con un clic; las imágenes de SO del CDN oficial de demostración de v86 se descargan y luego se seleccionan en la pestaña Disk Image',
        presetDownloaded: 'Descarga iniciada. Cambie a la pestaña Imagen de disco y seleccione el archivo descargado para arrancar.',
        loading: 'Cargando la imagen de disco, espera...',
        loadingTip: 'La máquina x86 arranca tras decodificar la imagen; las imágenes grandes pueden tardar',
        playing: 'Iniciando: ',
        invalidFile: 'Seleccione un archivo de imagen de disco válido',
        loadFailed: 'No se pudo cargar la imagen',
        urlFetchFailed: 'Error al descargar. Verifique la URL.',
        urlFetchError: 'Error de red, no se puede descargar la imagen.',
        noEmulator: 'Runtime de v86 no cargado, actualice la página',
        restart: 'Reiniciar',
        pause: 'Pausar',
        resume: 'Continuar',
        fullscreen: 'Pantalla completa',
        exitFullscreen: 'Pulsa ESC para salir de pantalla completa',
        instructions: 'Instrucciones',
        controlsTitle: 'Controles',
        controlsHint: 'Haga clic en la pantalla para darle foco de teclado; el SO invitado maneja la entrada como un PC real',
        mouseHint: 'Doble clic bloquea el ratón, Esc o doble clic de nuevo lo libera',
        anyKeyHint: 'Si la pantalla se detiene en "Press any key" o en un prompt de DOS, haga clic y pulse Enter; para el predefinido de Windows 3.0 escriba WIN/3',
        fileProtocolHint: 'Abre esta página a través de un servidor HTTP (file:// no puede cargar el emulador)',
        fullscreenDesc: 'Pantalla completa: use los botones de la barra superior'
    },
    ru: {
        pageTitle: 'Ретро-ПК (x86)',
        reset: 'Сброс',
        tabFile: 'Образ диска',
        tabUrl: 'URL',
        tabPreset: 'Пресеты',
        uploadTitle: 'Загрузить образ диска ПК',
        uploadDesc: 'Выберите образ дискеты / жёсткого диска / CD-ROM или ядро Linux (bzImage) для запуска в браузере',
        uploadSelect: 'Выбрать образ диска',
        mountLabel: 'Подключить как:',
        mountAuto: 'Автоопределение',
        mountFloppy: 'Дискета',
        mountHdd: 'Жёсткий диск',
        mountCdrom: 'CD-ROM',
        mountKernel: 'Ядро Linux (bzImage)',
        uploadHint: 'Образы не покидают ваше устройство. Кликните по экрану для захвата клавиатуры; двойной клик захватывает мышь.',
        urlTitle: 'Загрузить образ диска по URL',
        urlDesc: 'Введите прямой URL образа диска (.img / .iso / .vhd / bzImage)',
        urlPlaceholder: 'https://example.com/disk.img',
        loadImage: 'Загрузить образ',
        urlTip: 'Совет: при необходимости загрузка идёт через публичный CORS-прокси, большие образы могут загружаться медленно.',
        presetTitle: 'Готовые системы',
        presetDesc: 'Bootsector-игры с открытым кодом запускаются одним кликом; образы ОС с официального демо-CDN v86 скачиваются, затем выберите их на вкладке Disk Image',
        presetDownloaded: 'Загрузка началась. Перейдите на вкладку «Образ диска» и выберите скачанный файл для запуска.',
        loading: 'Загрузка образа диска, подождите...',
        loadingTip: 'Машина x86 запускается после декодирования образа; большие образы могут занять время',
        playing: 'Запуск: ',
        invalidFile: 'Выберите корректный файл образа диска',
        loadFailed: 'Не удалось загрузить образ',
        urlFetchFailed: 'Ошибка загрузки. Проверьте URL.',
        urlFetchError: 'Сетевая ошибка, невозможно загрузить образ.',
        noEmulator: 'Runtime v86 не загружен, обновите страницу',
        restart: 'Перезапуск',
        pause: 'Пауза',
        resume: 'Продолжить',
        fullscreen: 'Полный экран',
        exitFullscreen: 'Нажмите ESC, чтобы выйти из полного экрана',
        instructions: 'Инструкция',
        controlsTitle: 'Управление',
        controlsHint: 'Кликните по экрану, чтобы передать фокус клавиатуры; гостевая ОС обрабатывает ввод как настоящий ПК',
        mouseHint: 'Двойной клик захватывает мышь, Esc или повторный двойной клик освобождает',
        anyKeyHint: 'Если экран остановился на «Press any key» или приглашении DOS, кликните по нему и нажмите Enter; для пресета Windows 3.0 введите WIN/3',
        fileProtocolHint: 'Откройте эту страницу через HTTP-сервер (file:// не может загрузить эмулятор)',
        fullscreenDesc: 'Полный экран: кнопки панели над экраном'
    }
};

// Get current language (same mechanism as todos.js)
function getLang() {
    var lang = localStorage.getItem('languages') || 'en';
    return i18n[lang] ? lang : 'en';
}

function t(key) {
    var lang = getLang();
    return (i18n[lang] && i18n[lang][key]) || i18n['en'][key] || key;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
        el.setAttribute('placeholder', t(el.getAttribute('data-i18n-placeholder')));
    });
    document.documentElement.lang = getLang() === 'zh' ? 'zh-CN' : getLang();
}

// Toast
var toastTimer = null;
function showToast(message) {
    var toast = document.getElementById('toast');
    var msgEl = document.getElementById('toastMessage');
    if (!toast || !msgEl) return;
    msgEl.textContent = message;
    toast.classList.remove('hidden');
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(function() {
        toast.classList.add('hidden');
    }, 3500);
}
// ---------------------------------------------------------------------------
// Presets in two flavours:
//  - "instant": open-source bootsector images fetched live from GitHub
//    (raw.githubusercontent.com sends CORS headers, so they boot directly
//    with one click - files verified present in each repository).
//  - "download": larger OS images hosted on the official v86 demo CDN
//    (https://c.copy.sh/, verified against copy.sh's starter config). The CDN
//    sends no CORS headers and its Cloudflare blocks public proxies
//    (codetabs 522 / luckydesigner 429), so these trigger a native browser
//    download; the user then boots the file via the Disk Image tab.
// ---------------------------------------------------------------------------
var IMAGE_BASE = 'https://c.copy.sh/';
var PRESETS = [
    {
        name: 'BootRogue', mode: 'instant', mount: 'fda', mem: 32,
        url: 'https://raw.githubusercontent.com/nanochess/bootRogue/master/rogue.img',
        desc: 'Roguelike game in a 512-byte bootsector (BSD-2, nanochess/bootRogue)'
    },
    {
        name: 'BootBASIC', mode: 'instant', mount: 'fda', mem: 32,
        url: 'https://raw.githubusercontent.com/nanochess/bootBASIC/master/basic.img',
        desc: 'BASIC interpreter in a 512-byte bootsector (BSD-2, nanochess/bootBASIC)'
    },
    {
        name: 'bootOS', mode: 'instant', mount: 'fda', mem: 32,
        url: 'https://raw.githubusercontent.com/nanochess/bootOS/master/osall.img',
        desc: 'Monolithic 512-byte OS with chess, minesweeper and more (BSD-2, nanochess/bootOS)'
    },
    {
        name: 'Buildroot Linux', mode: 'download', mount: 'bzimage', mem: 64,
        url: IMAGE_BASE + 'buildroot-bzimage.bin',
        desc: 'Minimal Linux with Lua, ping, curl, telnet'
    },
    {
        name: 'Tiny Core Linux', mode: 'download', mount: 'cdrom', mem: 256,
        url: IMAGE_BASE + 'TinyCore-11.0.iso',
        desc: 'Tiny Linux desktop'
    },
    {
        name: 'Windows 3.0', mode: 'download', mount: 'cdrom', mem: 64,
        url: IMAGE_BASE + 'Win30.iso',
        desc: 'Windows 3.0 setup CD - after boot, type WIN/3 at the C:> prompt to start Windows'
    }
];

// CORS proxy list (same set and caveats as todos.js)
var corsProxies = [
    'https://cors.luckydesigner.workers.dev/?',
    'https://api.cors.lol/?url=',
    'https://api.codetabs.com/v1/proxy?quest='
];

// Hosts that serve CORS headers - images from these hosts fetch directly
var directFetchHosts = [
    'raw.githubusercontent.com',
    'gist.githubusercontent.com',
    'cdn.jsdelivr.net'
];

function isDirectFetchable(url) {
    try {
        return directFetchHosts.indexOf(new URL(url).hostname) !== -1;
    } catch (e) {
        return false;
    }
}

// Detect proxy/CDN error pages returned with HTTP 200 (same heuristic as todos.js)
function isLikelyErrorBody(blob) {
    return new Promise(function(resolve) {
        var reader = new FileReader();
        reader.onload = function() {
            var head = String(reader.result || '').slice(0, 512).toLowerCase();
            resolve(head.indexOf('error code:') === 0 ||
                    head.indexOf('{"error') === 0 ||
                    head.indexOf('<!doctype') === 0 ||
                    head.indexOf('<html') === 0 ||
                    head.indexOf('rate limit') !== -1);
        };
        reader.onerror = function() { resolve(false); };
        reader.readAsText(blob.slice(0, 512));
    });
}

// Download an image through the proxy chain; returns an ArrayBuffer
function downloadImage(url) {
    var attempts = [];
    if (isDirectFetchable(url)) {
        attempts.push(url);
    }
    corsProxies.forEach(function(p) { attempts.push(p + encodeURIComponent(url)); });

    var idx = 0;
    function tryNext() {
        if (idx >= attempts.length) {
            return Promise.reject(new Error('all proxies failed'));
        }
        var target = attempts[idx++];
        return fetch(target)
            .then(function(res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.blob();
            })
            .then(function(blob) {
                if (blob.size === 0) throw new Error('empty body');
                return isLikelyErrorBody(blob).then(function(bad) {
                    if (bad) throw new Error('error page body');
                    return blob.arrayBuffer();
                });
            })
            .catch(function(err) {
                console.warn('v86 image download failed via', target, err);
                return tryNext();
            });
    }
    return tryNext();
}

// Auto-detect the mount type from filename + size
function detectMount(filename, size) {
    var lower = filename.toLowerCase();
    if (/\.iso$/.test(lower)) return 'cdrom';
    if (/\.bzimage$/.test(lower) || /bzimage/i.test(filename)) return 'bzimage';
    // Floppy-capable extensions at classic floppy sizes (360K/720K/1.2M/1.44M/2.88M)
    if (/\.(img|ima|dsk|vfd)$/.test(lower) && size <= 3 * 1024 * 1024) return 'fda';
    return 'hda';
}
// ---------------------------------------------------------------------------
// Player control
// ---------------------------------------------------------------------------
var emulator = null;          // V86 instance
var bootConfig = null;        // { buffer, mount, mem, name } for restart
var isPaused = false;
var bootSeq = 0;              // increments per boot; invalidates stale auto-Enter timers

function setOverlay(visible) {
    var overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.toggle('hidden', !visible);
}

function showPlayer(name) {
    var uploadSection = document.getElementById('uploadSection');
    if (uploadSection) uploadSection.classList.add('hidden');
    var resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.style.display = 'flex';
    var playerSection = document.getElementById('playerSection');
    if (playerSection) playerSection.classList.add('active');
    window.scrollTo(0, 0);
    showToast(t('playing') + name);
}

function destroyEmulator() {
    if (emulator) {
        try { emulator.destroy(); } catch (e) { /* already gone */ }
        emulator = null;
    }
    isPaused = false;
    updatePauseLabel();
    // Clear the previous guest screen so switching presets doesn't show stale output
    var sc = document.getElementById('screen_container');
    if (sc) {
        var textDiv = sc.querySelector('div');
        if (textDiv) textDiv.textContent = '';
        var canvas = sc.querySelector('canvas');
        if (canvas && canvas.getContext) {
            var ctx = canvas.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
}

function bootImage(buffer, mount, memMB, name) {
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
    destroyEmulator();
    bootConfig = { buffer: buffer, mount: mount, mem: memMB, name: name };

    var opts = {
        wasm_path: '../vendor/v86/v86.wasm',
        memory_size: memMB * 1024 * 1024,
        vga_memory_size: 8 * 1024 * 1024,
        screen_container: document.getElementById('screen_container'),
        bios: { url: '../vendor/v86/seabios.bin' },
        vga_bios: { url: '../vendor/v86/vgabios.bin' },
        autostart: true
    };
    var img = { buffer: buffer };
    if (mount === 'fda') opts.fda = img;
    else if (mount === 'hda') opts.hda = img;
    else if (mount === 'cdrom') opts.cdrom = img;
    else if (mount === 'bzimage') opts.bzimage = img;
    else opts.hda = img;

    setOverlay(true);
    try {
        emulator = new V86(opts);
        // Hide the loader once the machine is actually ready to run, with a
        // fallback so a failed wasm/BIOS fetch can never leave it stuck.
        emulator.add_listener('emulator-ready', function() { setOverlay(false); });
        setTimeout(function() { setOverlay(false); }, 15000);
        showPlayer(name);
        // OS images (CD/bzImage) usually pause at a "Press any key" prompt or
        // a DOS/AUTOEXEC banner. Nudge them along with a few automatic Enter
        // keystrokes (floppy games are left untouched). bootSeq guards against
        // timers from a previous boot after a restart.
        if (mount === 'cdrom' || mount === 'bzimage') {
            var seq = ++bootSeq;
            [8000, 16000, 24000].forEach(function(delay) {
                setTimeout(function() {
                    if (emulator && bootSeq === seq && !isPaused) {
                        try { emulator.keyboard_adapter.simulate_press(13); } catch (e) { /* gone */ }
                    }
                }, delay);
            });
        }
    } catch (err) {
        console.error('v86 boot failed:', err);
        setOverlay(false);
        showToast(t('loadFailed'));
        backToUpload();
    }
}

function backToUpload() {
    destroyEmulator();
    bootConfig = null;
    var uploadSection = document.getElementById('uploadSection');
    if (uploadSection) uploadSection.classList.remove('hidden');
    var resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.style.display = 'none';
    var playerSection = document.getElementById('playerSection');
    if (playerSection) playerSection.classList.remove('active');
    setOverlay(false);
}

function updatePauseLabel() {
    var btn = document.getElementById('pauseBtn');
    if (!btn) return;
    var label = btn.querySelector('span[data-i18n]');
    if (label) label.textContent = isPaused ? t('resume') : t('pause');
    var icon = btn.querySelector('i');
    if (icon) icon.className = isPaused ? 'fas fa-play' : 'fas fa-pause';
}
// ---------------------------------------------------------------------------
// Event wiring
// ---------------------------------------------------------------------------
function bindEvents() {
    // Back / reset
    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = 'game.html';
    });
    document.getElementById('resetBtn').addEventListener('click', function() {
        backToUpload();
    });

    // Tabs (same behavior as dos.html)
    document.querySelectorAll('.upload-tab').forEach(function(tab) {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.upload-tab').forEach(function(el) {
                el.classList.remove('active');
            });
            this.classList.add('active');
            var which = this.dataset.tab;
            document.getElementById('uploadBox').classList.toggle('hidden', which !== 'file');
            document.getElementById('urlBox').classList.toggle('hidden', which !== 'url');
            document.getElementById('presetBox').classList.toggle('hidden', which !== 'preset');
        });
    });

    // Instructions toggle
    var instrHeader = document.getElementById('instructionsHeader');
    var instrToggle = document.getElementById('instructionsToggle');
    var instrContent = document.getElementById('instructionsContent');
    if (instrHeader && instrToggle && instrContent) {
        instrHeader.addEventListener('click', function() {
            var collapsed = instrContent.style.display === 'none';
            instrContent.style.display = collapsed ? '' : 'none';
            instrToggle.classList.toggle('collapsed', !collapsed);
        });
    }

    // File upload
    var diskInput = document.getElementById('diskInput');
    document.getElementById('uploadBtn').addEventListener('click', function() {
        diskInput.click();
    });
    diskInput.addEventListener('change', function() {
        var file = diskInput.files && diskInput.files[0];
        if (!file) return;
        var mount = document.getElementById('mountSelect').value;
        if (mount === 'auto') mount = detectMount(file.name, file.size);
        file.arrayBuffer().then(function(buf) {
            bootImage(buf, mount, mount === 'bzimage' ? 64 : 128, file.name);
        }).catch(function(err) {
            console.error('read failed:', err);
            showToast(t('loadFailed'));
        });
        diskInput.value = '';
    });

    // URL input
    document.getElementById('urlLoadBtn').addEventListener('click', function() {
        var input = document.getElementById('diskUrlInput');
        var url = (input.value || '').trim();
        if (!/^https?:\/\//i.test(url)) {
            showToast(t('urlFetchFailed'));
            return;
        }
        setOverlay(true);
        downloadImage(url).then(function(buf) {
            var name = url.split('/').pop().split('?')[0] || 'image.img';
            var mount = detectMount(name, buf.byteLength);
            bootImage(buf, mount, mount === 'bzimage' ? 64 : 128, name);
        }).catch(function(err) {
            console.error('v86 URL image failed:', err);
            setOverlay(false);
            showToast(t('urlFetchError'));
        });
    });

    // v86 needs fetch() for libv86.js/v86.wasm, which is impossible on file://
    if (location.protocol === 'file:') {
        console.warn('[v86] page opened via file:// - wasm fetch will fail; serve over HTTP');
        showToast(t('fileProtocolHint'));
    }

    // Preset list. "instant" presets fetch an open-source image from GitHub
    // (CORS-enabled) and boot it right away; "download" presets trigger a
    // native browser download (navigation downloads are not subject to CORS,
    // so this always works even though the CDN sends no CORS headers) and the
    // user boots the file via the Disk Image tab.
    var presetList = document.getElementById('presetList');
    PRESETS.forEach(function(p) {
        var item = document.createElement('div');
        item.className = 'preset-item';
        var icon = p.mode === 'instant' ? 'fas fa-play' : 'fas fa-download';
        var badge = p.mode === 'instant' ? p.mount.toUpperCase() : 'DL';
        item.innerHTML =
            '<i class="' + icon + ' pi-icon"></i>' +
            '<div><div class="pi-name">' + p.name + '</div>' +
            '<div class="pi-desc">' + p.desc + '</div></div>' +
            '<span class="pi-size">' + badge + '</span>';
        item.addEventListener('click', function() {
            if (p.mode === 'instant') {
                setOverlay(true);
                downloadImage(p.url).then(function(buf) {
                    if (buf.byteLength < 512) {
                        setOverlay(false);
                        showToast(t('invalidFile'));
                        return;
                    }
                    bootImage(buf, p.mount, p.mem, p.name);
                }).catch(function(err) {
                    console.error('v86 preset fetch failed:', err);
                    setOverlay(false);
                    showToast(t('urlFetchError'));
                });
            } else {
                var a = document.createElement('a');
                a.href = p.url;
                a.download = p.url.split('/').pop();
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                showToast(t('presetDownloaded'));
            }
        });
        presetList.appendChild(item);
    });

    // Toolbar: pause / restart / fullscreen
    document.getElementById('pauseBtn').addEventListener('click', function() {
        if (!emulator) return;
        isPaused = !isPaused;
        try {
            if (isPaused) emulator.stop(); else emulator.run();
        } catch (e) { /* ignore */ }
        updatePauseLabel();
    });
    document.getElementById('restartBtn').addEventListener('click', function() {
        if (!bootConfig) return;
        bootImage(bootConfig.buffer, bootConfig.mount, bootConfig.mem, bootConfig.name);
    });
    document.getElementById('fullscreenBtn').addEventListener('click', function() {
        var wrapper = document.getElementById('screenWrapper');
        if (!wrapper) return;
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else if (wrapper.requestFullscreen) {
            wrapper.requestFullscreen();
        }
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== Retro PC (v86) Page Loaded ===');
    applyTranslations();
    bindEvents();
});
