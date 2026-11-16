// DOS Games Page JavaScript (js-dos v8 based)
// js-dos is selfhosted at vendor/js-dos (GPL-2.0, (c) Dmitry 'caiiiycuk' Svetlov - see vendor/js-dos/README.md).

// Internationalization (same language set as emulatorjs.js)
var i18n = {
    zh: {
        pageTitle: 'DOS 游戏',
        reset: '重置',
        instructions: '使用说明',
        dosUploadTitle: '上传 DOS 游戏包',
        dosUploadDesc: '拖拽 .zip DOS 游戏包到此处或点击选择',
        dosSelect: '选择 ZIP 文件',
        dosHint: 'DOS 游戏在内置 DOS 环境中运行，点击画面后开始捕获键盘输入',
        dosLoading: '正在加载 DOS 环境，请稍候...',
        dosLoadingTip: '首次启动需下载约 2.5MB 组件，可能需要一些时间',
        dosPlaying: '正在播放：',
        dosInvalid: '请选择 .zip 或 .jsdos 文件',
        dosLoadError: 'DOS 播放器加载失败',
        dosControlsTitle: '操作方式',
        dosReleaseKeys: '按 Shift+Esc（或使用顶部工具栏）释放键盘和鼠标',
        dosFullscreen: '全屏',
        dosFullscreenDesc: '使用画面顶部工具栏中的全屏按钮',
        exitFullscreen: '按 ESC 退出全屏',
        dosSoundTitle: '声音与附加功能',
        dosSoundDesc: '将鼠标悬停在画面顶部调出工具栏，可调节音量、存档/读档和打开虚拟键盘',
        tabFile: '文件上传',
        tabUrl: 'URL 输入',
        tabSearch: '搜索 DOS',
        urlTitle: '从 URL 加载 DOS 游戏',
        urlDesc: '输入 .zip 游戏包的直接链接地址',
        urlPlaceholder: 'https://example.com/game.zip',
        loadRom: '加载游戏',
        urlTip: '提示：请输入 .zip 游戏包的直接下载链接。多软盘或需安装的游戏可能需要在 DOS 内额外配置。',
        urlLoading: '正在从 URL 下载游戏包...',
        urlInvalid: '请输入有效的 URL 地址',
        urlFetchFailed: '下载游戏包失败，请检查 URL 是否正确。',
        urlFetchError: '网络错误，无法下载游戏包。',
        urlPreset: '预设 DOS 游戏：',
        searchTitle: '搜索 DOS 游戏',
        searchDesc: '在 archive.org 中搜索经典 MS-DOS 游戏',
        searchPlaceholder: '输入游戏名称，例如 Prince of Persia',
        search: '搜索',
        searchDisclaimer: '结果来自 archive.org（softwarelibrary_msdos_games 收藏），部分游戏可能需要在 DOS 内进行键盘操作配置。',
        searchLoading: '正在搜索...',
        searchFailed: '搜索失败，请稍后再试。',
        searchNoResults: '未找到匹配的游戏。',
        searchDownloading: '正在下载：',
        searchDownloadFailed: '下载失败，请重试。',
        searchManualDownload: '手动下载',
        searchManualTip: '下载失败，请点击上方链接手动下载，然后用文件上传加载游戏包。'
    },
    en: {
        pageTitle: 'DOS Player',
        reset: 'Reset',
        instructions: 'Instructions',
        dosUploadTitle: 'Upload DOS Game',
        dosUploadDesc: 'Drag and drop a .zip DOS game here or click to select',
        dosSelect: 'Select ZIP File',
        dosHint: 'DOS games run inside a built-in DOS environment. Keyboard input is captured after you click the screen.',
        dosLoading: 'Loading DOS environment, please wait...',
        dosLoadingTip: 'The first launch downloads ~2.5MB of components and may take a while',
        dosPlaying: 'Now playing: ',
        dosInvalid: 'Please select a .zip or .jsdos file',
        dosLoadError: 'Failed to load the DOS player',
        dosControlsTitle: 'Controls',
        dosReleaseKeys: 'Press Shift+Esc (or use the toolbar) to release the keyboard and mouse',
        dosFullscreen: 'Fullscreen',
        dosFullscreenDesc: 'Use the fullscreen button in the player toolbar at the top',
        exitFullscreen: 'Press ESC to exit fullscreen',
        dosSoundTitle: 'Sound & Extras',
        dosSoundDesc: 'Hover the top of the screen for the toolbar: volume, save/load and the virtual keyboard',
        tabFile: 'File Upload',
        tabUrl: 'URL Input',
        tabSearch: 'Search DOS',
        urlTitle: 'Load DOS game from URL',
        urlDesc: 'Enter the direct URL of a .zip game package to load',
        urlPlaceholder: 'https://example.com/game.zip',
        loadRom: 'Load Game',
        urlTip: 'Tip: Enter a direct link to a .zip package. Multi-disk or install-based games may need extra setup inside DOS.',
        urlLoading: 'Downloading game package from URL...',
        urlInvalid: 'Please enter a valid URL',
        urlFetchFailed: 'Failed to download the game package. Please check the URL.',
        urlFetchError: 'Network error, unable to download the game package.',
        urlPreset: 'Preset DOS games:',
        searchTitle: 'Search DOS Games',
        searchDesc: 'Search archive.org for classic MS-DOS games',
        searchPlaceholder: 'Enter game name, e.g. Prince of Persia',
        search: 'Search',
        searchDisclaimer: 'Results from archive.org (softwarelibrary_msdos_games). Some games may need keyboard-heavy setup inside DOS.',
        searchLoading: 'Searching...',
        searchFailed: 'Search failed. Please try again later.',
        searchNoResults: 'No matching games found.',
        searchDownloading: 'Downloading:',
        searchDownloadFailed: 'Download failed. Please try again.',
        searchManualDownload: 'Manual download',
        searchManualTip: 'Download failed. Click the link above to download manually, then use File Upload to load the package.'
    },
    ja: {
        pageTitle: 'DOS プレイヤー',
        reset: 'リセット',
        instructions: '使い方',
        dosUploadTitle: 'DOS ゲームをアップロード',
        dosUploadDesc: '.zip の DOS ゲームをここにドラッグ＆ドロップ、またはクリックして選択',
        dosSelect: 'ZIP ファイルを選択',
        dosHint: 'DOS ゲームは内蔵の DOS 環境で動作します。画面をクリックするとキーボード入力がキャプチャされます。',
        dosLoading: 'DOS 環境を読み込み中...',
        dosLoadingTip: '初回は約 2.5MB のコンポーネントをダウンロードするため時間がかかることがあります',
        dosPlaying: '再生中：',
        dosInvalid: '.zip または .jsdos ファイルを選択してください',
        dosLoadError: 'DOS プレイヤーの読み込みに失敗しました',
        dosControlsTitle: '操作方法',
        dosReleaseKeys: 'Shift+Esc（またはツールバー）でキーボードとマウスのキャプチャを解除',
        dosFullscreen: '全画面',
        dosFullscreenDesc: '画面上部ツールバーの全画面ボタンを使用',
        exitFullscreen: 'ESC キーで全画面を解除',
        dosSoundTitle: 'サウンドとその他',
        dosSoundDesc: '画面上部にカーソルを合わせるとツールバーが表示されます：音量、セーブ/ロード、仮想キーボード',
        tabFile: 'ファイルアップロード',
        tabUrl: 'URL入力',
        tabSearch: 'DOS検索',
        urlTitle: 'URLからDOSゲームを読み込む',
        urlDesc: '.zip ゲームパッケージの直接URLを入力',
        urlPlaceholder: 'https://example.com/game.zip',
        loadRom: 'ゲームを読み込む',
        urlTip: 'ヒント：.zip パッケージの直接ダウンロードリンクを入力してください。マルチディスクやインストールが必要なゲームは DOS 内で追加設定が必要な場合があります。',
        urlLoading: 'URLからゲームパッケージをダウンロード中...',
        urlInvalid: '有効なURLを入力してください',
        urlFetchFailed: 'ゲームパッケージのダウンロードに失敗しました。URLを確認してください。',
        urlFetchError: 'ネットワークエラー、ゲームパッケージをダウンロードできません。',
        urlPreset: 'DOSゲームプリセット：',
        searchTitle: 'DOSゲーム検索',
        searchDesc: 'archive.orgでクラシックMS-DOSゲームを検索',
        searchPlaceholder: 'ゲーム名を入力（例：Prince of Persia）',
        search: '検索',
        searchDisclaimer: 'archive.org（softwarelibrary_msdos_games）の検索結果です。一部のゲームは DOS 内でキーボード操作の設定が必要な場合があります。',
        searchLoading: '検索中...',
        searchFailed: '検索に失敗しました。後でもう一度お試しください。',
        searchNoResults: '一致するゲームが見つかりませんでした。',
        searchDownloading: 'ダウンロード中：',
        searchDownloadFailed: 'ダウンロードに失敗しました。',
        searchManualDownload: '手動ダウンロード',
        searchManualTip: 'ダウンロードに失敗しました。上のリンクをクリックして手動でダウンロードし、ファイルアップロードで読み込んでください。'
    },
    ko: {
        pageTitle: 'DOS 플레이어',
        reset: '재설정',
        instructions: '사용 방법',
        dosUploadTitle: 'DOS 게임 업로드',
        dosUploadDesc: '.zip DOS 게임을 여기로 드래그하거나 클릭하여 선택',
        dosSelect: 'ZIP 파일 선택',
        dosHint: 'DOS 게임은 내장 DOS 환경에서 실행됩니다. 화면을 클릭하면 키보드 입력이 캡처됩니다.',
        dosLoading: 'DOS 환경을 불러오는 중...',
        dosLoadingTip: '첫 실행 시 약 2.5MB의 구성 요소를 다운로드하므로 시간이 걸릴 수 있습니다',
        dosPlaying: '재생 중: ',
        dosInvalid: '.zip 또는 .jsdos 파일을 선택하세요',
        dosLoadError: 'DOS 플레이어를 불러오지 못했습니다',
        dosControlsTitle: '조작 방법',
        dosReleaseKeys: 'Shift+Esc(또는 툴바)로 키보드와 마우스 캡처 해제',
        dosFullscreen: '전체 화면',
        dosFullscreenDesc: '화면 상단 툴바의 전체 화면 버튼 사용',
        exitFullscreen: 'ESC 키로 전체 화면 종료',
        dosSoundTitle: '소리 및 기타',
        dosSoundDesc: '화면 상단에 마우스를 올리면 툴바가 나타납니다: 음량, 저장/불러오기, 가상 키보드',
        tabFile: '파일 업로드',
        tabUrl: 'URL 입력',
        tabSearch: 'DOS 검색',
        urlTitle: 'URL에서 DOS 게임 로드',
        urlDesc: '.zip 게임 패키지의 직접 URL을 입력',
        urlPlaceholder: 'https://example.com/game.zip',
        loadRom: '게임 로드',
        urlTip: '팁: .zip 패키지의 직접 다운로드 링크를 입력하세요. 멀티 디스크나 설치형 게임은 DOS 내에서 추가 설정이 필요할 수 있습니다.',
        urlLoading: 'URL에서 게임 패키지 다운로드 중...',
        urlInvalid: '유효한 URL을 입력하세요',
        urlFetchFailed: '게임 패키지 다운로드 실패. URL을 확인하세요.',
        urlFetchError: '네트워크 오류, 게임 패키지를 다운로드할 수 없습니다.',
        urlPreset: 'DOS 게임 프리셋:',
        searchTitle: 'DOS 게임 검색',
        searchDesc: 'archive.org에서 클래식 MS-DOS 게임 검색',
        searchPlaceholder: '게임 이름 입력 (예: Prince of Persia)',
        search: '검색',
        searchDisclaimer: 'archive.org(softwarelibrary_msdos_games) 검색 결과입니다. 일부 게임은 DOS 내에서 키보드 설정이 필요할 수 있습니다.',
        searchLoading: '검색 중...',
        searchFailed: '검색 실패. 나중에 다시 시도하세요.',
        searchNoResults: '일치하는 게임을 찾을 수 없습니다.',
        searchDownloading: '다운로드 중:',
        searchDownloadFailed: '다운로드 실패. 다시 시도하세요.',
        searchManualDownload: '수동 다운로드',
        searchManualTip: '다운로드 실패. 위 링크를 클릭하여 수동으로 다운로드한 후 파일 업로드로 로드하세요.'
    },
    fr: {
        pageTitle: 'Lecteur DOS',
        reset: 'Réinitialiser',
        instructions: 'Instructions',
        dosUploadTitle: 'Téléverser un jeu DOS',
        dosUploadDesc: 'Glissez-déposez un jeu DOS .zip ici ou cliquez pour sélectionner',
        dosSelect: 'Sélectionner un fichier ZIP',
        dosHint: 'Les jeux DOS s\'exécutent dans un environnement DOS intégré. Le clavier est capturé après un clic sur l\'écran.',
        dosLoading: 'Chargement de l\'environnement DOS, veuillez patienter...',
        dosLoadingTip: 'Le premier lancement télécharge environ 2,5 Mo de composants, cela peut prendre du temps',
        dosPlaying: 'Lecture en cours : ',
        dosInvalid: 'Veuillez sélectionner un fichier .zip ou .jsdos',
        dosLoadError: 'Échec du chargement du lecteur DOS',
        dosControlsTitle: 'Commandes',
        dosReleaseKeys: 'Appuyez sur Maj+Échap (ou utilisez la barre d\'outils) pour libérer le clavier et la souris',
        dosFullscreen: 'Plein écran',
        dosFullscreenDesc: 'Utilisez le bouton plein écran dans la barre d\'outils en haut de l\'écran',
        exitFullscreen: 'Appuyez sur ÉCHAP pour quitter le plein écran',
        dosSoundTitle: 'Son et extras',
        dosSoundDesc: 'Survolez le haut de l\'écran pour la barre d\'outils : volume, sauvegarde/chargement et clavier virtuel',
        tabFile: 'Fichier',
        tabUrl: 'URL',
        tabSearch: 'Recherche DOS',
        urlTitle: 'Charger un jeu DOS depuis une URL',
        urlDesc: 'Entrez l\'URL directe d\'un paquet de jeu .zip',
        urlPlaceholder: 'https://example.com/game.zip',
        loadRom: 'Charger le jeu',
        urlTip: 'Astuce : entrez un lien direct vers le paquet .zip. Les jeux multi-disquettes ou avec installation peuvent nécessiter une configuration dans DOS.',
        urlLoading: 'Téléchargement du paquet depuis l\'URL...',
        urlInvalid: 'Veuillez entrer une URL valide',
        urlFetchFailed: 'Échec du téléchargement du paquet. Vérifiez l\'URL.',
        urlFetchError: 'Erreur réseau, impossible de télécharger le paquet.',
        urlPreset: 'Jeux DOS prédéfinis :',
        searchTitle: 'Rechercher des jeux DOS',
        searchDesc: 'Rechercher des jeux MS-DOS classiques sur archive.org',
        searchPlaceholder: 'Entrez le nom du jeu, ex : Prince of Persia',
        search: 'Rechercher',
        searchDisclaimer: 'Résultats de archive.org (softwarelibrary_msdos_games). Certains jeux peuvent nécessiter une configuration clavier dans DOS.',
        searchLoading: 'Recherche...',
        searchFailed: 'Recherche échouée. Réessayez plus tard.',
        searchNoResults: 'Aucun jeu correspondant trouvé.',
        searchDownloading: 'Téléchargement : ',
        searchDownloadFailed: 'Échec du téléchargement. Réessayez.',
        searchManualDownload: 'Téléchargement manuel',
        searchManualTip: 'Échec du téléchargement. Cliquez sur le lien ci-dessus pour télécharger manuellement, puis utilisez le téléversement de fichier pour charger le paquet.'
    },
    de: {
        pageTitle: 'DOS-Player',
        reset: 'Zurücksetzen',
        instructions: 'Anleitung',
        dosUploadTitle: 'DOS-Spiel hochladen',
        dosUploadDesc: '.zip-DOS-Spiel hierher ziehen oder klicken zum Auswählen',
        dosSelect: 'ZIP-Datei auswählen',
        dosHint: 'DOS-Spiele laufen in einer eingebauten DOS-Umgebung. Die Tastatureingabe wird nach einem Klick auf den Bildschirm erfasst.',
        dosLoading: 'DOS-Umgebung wird geladen, bitte warten...',
        dosLoadingTip: 'Beim ersten Start werden ca. 2,5 MB Komponenten heruntergeladen, das kann dauern',
        dosPlaying: 'Wird abgespielt: ',
        dosInvalid: 'Bitte eine .zip- oder .jsdos-Datei auswählen',
        dosLoadError: 'DOS-Player konnte nicht geladen werden',
        dosControlsTitle: 'Steuerung',
        dosReleaseKeys: 'Umschalt+Esc drücken (oder die Symbolleiste verwenden), um Tastatur und Maus freizugeben',
        dosFullscreen: 'Vollbild',
        dosFullscreenDesc: 'Verwenden Sie die Vollbild-Schaltfläche in der Symbolleiste oben',
        exitFullscreen: 'ESC drücken, um den Vollbildmodus zu verlassen',
        dosSoundTitle: 'Ton & Extras',
        dosSoundDesc: 'Fahren Sie mit der Maus über den oberen Bildschirmrand für die Symbolleiste: Lautstärke, Speichern/Laden und virtuelle Tastatur',
        tabFile: 'Datei',
        tabUrl: 'URL',
        tabSearch: 'DOS suchen',
        urlTitle: 'DOS-Spiel von URL laden',
        urlDesc: 'Geben Sie die direkte URL eines .zip-Spielpakets ein',
        urlPlaceholder: 'https://example.com/game.zip',
        loadRom: 'Spiel laden',
        urlTip: 'Tipp: Geben Sie einen direkten Link zum .zip-Paket ein. Multi-Disk- oder Installations-Spiele benötigen evtl. zusätzliche Einrichtung in DOS.',
        urlLoading: 'Spielpaket wird von URL heruntergeladen...',
        urlInvalid: 'Bitte geben Sie eine gültige URL ein',
        urlFetchFailed: 'Spielpaket-Download fehlgeschlagen. Bitte URL prüfen.',
        urlFetchError: 'Netzwerkfehler, Spielpaket kann nicht heruntergeladen werden.',
        urlPreset: 'DOS-Spiel-Vorlagen:',
        searchTitle: 'DOS-Spiele suchen',
        searchDesc: 'Durchsuchen Sie archive.org nach klassischen MS-DOS-Spielen',
        searchPlaceholder: 'Spielnamen eingeben, z.B. Prince of Persia',
        search: 'Suchen',
        searchDisclaimer: 'Ergebnisse von archive.org (softwarelibrary_msdos_games). Einige Spiele benötigen evtl. aufwendige Tastatur-Einrichtung in DOS.',
        searchLoading: 'Suche läuft...',
        searchFailed: 'Suche fehlgeschlagen. Bitte versuchen Sie es später.',
        searchNoResults: 'Keine passenden Spiele gefunden.',
        searchDownloading: 'Herunterladen:',
        searchDownloadFailed: 'Download fehlgeschlagen. Bitte versuchen Sie es erneut.',
        searchManualDownload: 'Manueller Download',
        searchManualTip: 'Download fehlgeschlagen. Klicken Sie auf den Link oben zum manuellen Download, dann laden Sie das Paket über Datei-Upload.'
    },
    es: {
        pageTitle: 'Reproductor DOS',
        reset: 'Restablecer',
        instructions: 'Instrucciones',
        dosUploadTitle: 'Subir juego DOS',
        dosUploadDesc: 'Arrastra un juego DOS .zip aquí o haz clic para seleccionar',
        dosSelect: 'Seleccionar archivo ZIP',
        dosHint: 'Los juegos DOS se ejecutan en un entorno DOS integrado. El teclado se captura tras hacer clic en la pantalla.',
        dosLoading: 'Cargando el entorno DOS, espera...',
        dosLoadingTip: 'El primer inicio descarga ~2,5 MB de componentes, puede tardar un rato',
        dosPlaying: 'Reproduciendo: ',
        dosInvalid: 'Selecciona un archivo .zip o .jsdos',
        dosLoadError: 'No se pudo cargar el reproductor DOS',
        dosControlsTitle: 'Controles',
        dosReleaseKeys: 'Pulsa Mayús+Esc (o usa la barra de herramientas) para liberar el teclado y el ratón',
        dosFullscreen: 'Pantalla completa',
        dosFullscreenDesc: 'Usa el botón de pantalla completa en la barra de herramientas superior',
        exitFullscreen: 'Pulsa ESC para salir de pantalla completa',
        dosSoundTitle: 'Sonido y extras',
        dosSoundDesc: 'Pasa el ratón por la parte superior para la barra de herramientas: volumen, guardar/cargar y teclado virtual',
        tabFile: 'Archivo',
        tabUrl: 'URL',
        tabSearch: 'Buscar DOS',
        urlTitle: 'Cargar juego DOS desde URL',
        urlDesc: 'Ingrese la URL directa de un paquete de juego .zip',
        urlPlaceholder: 'https://example.com/game.zip',
        loadRom: 'Cargar juego',
        urlTip: 'Consejo: Ingrese un enlace directo al paquete .zip. Los juegos multi-disco o con instalación pueden necesitar configuración dentro de DOS.',
        urlLoading: 'Descargando paquete desde URL...',
        urlInvalid: 'Por favor, ingrese una URL válida',
        urlFetchFailed: 'Error al descargar el paquete. Verifique la URL.',
        urlFetchError: 'Error de red, no se puede descargar el paquete.',
        urlPreset: 'Juegos DOS predefinidos:',
        searchTitle: 'Buscar juegos DOS',
        searchDesc: 'Buscar juegos MS-DOS clásicos en archive.org',
        searchPlaceholder: 'Ingrese el nombre del juego, ej: Prince of Persia',
        search: 'Buscar',
        searchDisclaimer: 'Resultados de archive.org (softwarelibrary_msdos_games). Algunos juegos pueden necesitar configuración de teclado dentro de DOS.',
        searchLoading: 'Buscando...',
        searchFailed: 'Búsqueda fallida. Inténtelo de nuevo.',
        searchNoResults: 'No se encontraron juegos coincidentes.',
        searchDownloading: 'Descargando:',
        searchDownloadFailed: 'Descarga fallida. Inténtelo de nuevo.',
        searchManualDownload: 'Descarga manual',
        searchManualTip: 'Descarga fallida. Haga clic en el enlace de arriba para descargar manualmente, luego use la carga de archivos para cargar el paquete.'
    },
    ru: {
        pageTitle: 'DOS-плеер',
        reset: 'Сброс',
        instructions: 'Инструкция',
        dosUploadTitle: 'Загрузить DOS-игру',
        dosUploadDesc: 'Перетащите DOS-игру .zip сюда или нажмите для выбора',
        dosSelect: 'Выбрать ZIP-файл',
        dosHint: 'DOS-игры работают во встроенной DOS-среде. Клавиатура захватывается после клика по экрану.',
        dosLoading: 'Загрузка DOS-среды, подождите...',
        dosLoadingTip: 'При первом запуске загружается около 2,5 МБ компонентов, это может занять время',
        dosPlaying: 'Воспроизводится: ',
        dosInvalid: 'Выберите файл .zip или .jsdos',
        dosLoadError: 'Не удалось загрузить DOS-плеер',
        dosControlsTitle: 'Управление',
        dosReleaseKeys: 'Нажмите Shift+Esc (или используйте панель инструментов), чтобы освободить клавиатуру и мышь',
        dosFullscreen: 'Полный экран',
        dosFullscreenDesc: 'Используйте кнопку полного экрана на панели инструментов сверху',
        exitFullscreen: 'Нажмите ESC, чтобы выйти из полного экрана',
        dosSoundTitle: 'Звук и дополнения',
        dosSoundDesc: 'Наведите курсор на верх экрана для панели инструментов: громкость, сохранение/загрузка и виртуальная клавиатура',
        tabFile: 'Файл',
        tabUrl: 'URL',
        tabSearch: 'Поиск DOS',
        urlTitle: 'Загрузить DOS-игру по URL',
        urlDesc: 'Введите прямой URL пакета игры .zip',
        urlPlaceholder: 'https://example.com/game.zip',
        loadRom: 'Загрузить игру',
        urlTip: 'Совет: введите прямую ссылку на пакет .zip. Многодисковым или устанавливаемым играм может понадобиться настройка внутри DOS.',
        urlLoading: 'Загрузка пакета по URL...',
        urlInvalid: 'Пожалуйста, введите корректный URL',
        urlFetchFailed: 'Ошибка загрузки пакета. Проверьте URL.',
        urlFetchError: 'Сетевая ошибка, невозможно загрузить пакет.',
        urlPreset: 'Предустановленные DOS-игры:',
        searchTitle: 'Поиск DOS-игр',
        searchDesc: 'Поиск классических игр MS-DOS на archive.org',
        searchPlaceholder: 'Введите название игры, например: Prince of Persia',
        search: 'Поиск',
        searchDisclaimer: 'Результаты с archive.org (softwarelibrary_msdos_games). Некоторым играм может понадобиться настройка клавиатуры внутри DOS.',
        searchLoading: 'Поиск...',
        searchFailed: 'Поиск не удался. Попробуйте позже.',
        searchNoResults: 'Подходящих игр не найдено.',
        searchDownloading: 'Загрузка:',
        searchDownloadFailed: 'Загрузка не удалась. Попробуйте снова.',
        searchManualDownload: 'Ручная загрузка',
        searchManualTip: 'Загрузка не удалась. Нажмите на ссылку выше, чтобы загрузить вручную, затем используйте загрузку файла для загрузки пакета.'
    }
};

// Get current language (same mechanism as emulatorjs.js)
function getLang() {
    var lang = localStorage.getItem('languages') || 'en';
    return i18n[lang] ? lang : 'en';
}

// Get translated text
function t(key) {
    var lang = getLang();
    return i18n[lang][key] || i18n['en'][key] || key;
}

// Apply translations
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        var key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
        var key = el.getAttribute('data-i18n-placeholder');
        el.setAttribute('placeholder', t(key));
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

// js-dos player state
var currentMount = null;
var currentObjectUrl = null;
var loadingOverlay = null;
var overlayTimer = null;

function setOverlay(visible) {
    if (loadingOverlay) loadingOverlay.classList.toggle('hidden', !visible);
}

// Start playing a DOS package from an object URL (shared by file upload /
// URL / search paths). The URL may point at a raw zip or a client-built
// js-dos bundle (js-dos auto-detects the .jsdos/ layout either way).
function startDos(objectUrl, name) {
    var container = document.getElementById('emulator');
    if (!container) return;

    // Tear down any previous player (full mount swap; restart via the Reset button)
    if (currentMount && currentMount.parentNode) {
        currentMount.parentNode.removeChild(currentMount);
        currentMount = null;
    }
    if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
        currentObjectUrl = null;
    }

    if (!window.Dos || typeof window.Dos !== 'function') {
        showToast(t('dosLoadError'));
        console.error('js-dos (window.Dos) is not available');
        return;
    }

    console.log('Loading DOS package:', name);

    // js-dos renders its own player UI (canvas + toolbar) into this mount.
    // pathPrefix points at the selfhosted emulators build (wdosbox.wasm etc).
    var mount = document.createElement('div');
    mount.style.cssText = 'width:100%;max-width:800px;margin:0 auto;aspect-ratio:4/3;position:relative;background:#000;';
    container.appendChild(mount);
    currentMount = mount;
    currentObjectUrl = objectUrl;

    // Switch to the player view like flash.html does: hide the upload
    // section (it fills a whole viewport) and jump back to the top so the
    // game appears right under the header instead of far down the page.
    var uploadSection = document.getElementById('uploadSection');
    if (uploadSection) uploadSection.classList.add('hidden');
    var resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.style.display = 'flex';
    window.scrollTo(0, 0);

    setOverlay(true);
    try {
        window.Dos(mount, {
            url: currentObjectUrl,
            pathPrefix: '../vendor/js-dos/emulators/',
            autoStart: true,
            imageRendering: 'pixelated'
        });
        // js-dos shows its own bundle download progress UI; our overlay is
        // just a short "environment is starting" hint.
        if (overlayTimer) clearTimeout(overlayTimer);
        overlayTimer = setTimeout(function() { setOverlay(false); }, 3000);
        showToast(t('dosPlaying') + name);
    } catch (err) {
        console.error('js-dos start failed:', err);
        setOverlay(false);
        showToast(t('dosLoadError'));
    }
}

// Load a local DOS package (file upload / drag & drop)
function playDos(file) {
    if (!/\.(zip|jsdos)$/i.test(file.name)) {
        showToast(t('dosInvalid'));
        return;
    }
    processDosBlob(file, file.name);
}

// ---------------------------------------------------------------------------
// URL input & archive.org search support (ported from emulatorjs.js/toflash.js,
// with the ROM-specific bits swapped for .zip package handling via js-dos)
// ---------------------------------------------------------------------------

// CORS proxy list (tried in order). Same set and caveats as emulatorjs.js:
// codetabs is unstable; corsmirror was removed for corrupting binary bodies.
var corsProxies = [
    'https://cors.luckydesigner.workers.dev/?',
    'https://api.cors.lol/?url=',
    'https://api.codetabs.com/v1/proxy?quest='
];

// Hosts that serve CORS headers (Access-Control-Allow-Origin: *) - packages
// from these hosts can be fetched directly without any proxy
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

// Detect proxy/CDN error pages returned with HTTP 200 (e.g. Cloudflare's
// plain-text "error code: 522" body) so garbage is never fed into js-dos
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

// Detect binary corruption from text-mangling proxies: a broken proxy may
// transcode the response as text, replacing every non-ASCII byte with the
// UTF-8 replacement character (EF BF BD). Count occurrences in the head.
function hasBinaryCorruption(blob) {
    return new Promise(function(resolve) {
        var reader = new FileReader();
        reader.onload = function() {
            var bytes = new Uint8Array(reader.result || new ArrayBuffer(0));
            var hits = 0;
            for (var i = 0; i + 2 < bytes.length; i++) {
                if (bytes[i] === 0xEF && bytes[i + 1] === 0xBF && bytes[i + 2] === 0xBD) {
                    hits++;
                    if (hits >= 3) { resolve(true); return; }
                    i += 2;
                }
            }
            resolve(false);
        };
        reader.onerror = function() { resolve(false); };
        reader.readAsArrayBuffer(blob.slice(0, 512));
    });
}

// Cache Storage shared with emulatorjs.js ('ewtv-rom-cache-v2'): avoids
// re-downloading (and re-proxying) the same package. archive.org downloads
// have no CORS headers and depend entirely on public proxies.
var ROM_CACHE_NAME = 'ewtv-rom-cache-v2';

// Parse a zip's central directory to list entry names (no inflation needed).
// Returns [{name, size}] or null when the data is not a readable zip.
function parseZipEntries(arrayBuffer) {
    try {
        var bytes = new Uint8Array(arrayBuffer);
        // Locate the End Of Central Directory record (PK\x05\x06), scanning
        // backwards to tolerate a trailing zip comment (max 65535 bytes)
        var i = bytes.length - 22;
        var eocd = -1;
        var minOfs = bytes.length - 22 - 65535;
        for (; i >= 0 && i >= minOfs; i--) {
            if (bytes[i] === 0x50 && bytes[i + 1] === 0x4B && bytes[i + 2] === 0x05 && bytes[i + 3] === 0x06) {
                eocd = i;
                break;
            }
        }
        if (eocd < 0) return null;
        var totalEntries = bytes[eocd + 10] | (bytes[eocd + 11] << 8);
        var cdSize = (bytes[eocd + 12] | (bytes[eocd + 13] << 8) | (bytes[eocd + 14] << 16) | (bytes[eocd + 15] << 24)) >>> 0;
        var cdOfs = (bytes[eocd + 16] | (bytes[eocd + 17] << 8) | (bytes[eocd + 18] << 16) | (bytes[eocd + 19] << 24)) >>> 0;
        var cdEnd = Math.min(cdOfs + cdSize, bytes.length);
        var names = [];
        var p = cdOfs;
        for (var n = 0; n < totalEntries && p + 46 <= cdEnd; n++) {
            if (bytes[p] !== 0x50 || bytes[p + 1] !== 0x4B || bytes[p + 2] !== 0x01 || bytes[p + 3] !== 0x02) break;
            var uSize = (bytes[p + 24] | (bytes[p + 25] << 8) | (bytes[p + 26] << 16) | (bytes[p + 27] << 24)) >>> 0;
            var nameLen = bytes[p + 28] | (bytes[p + 29] << 8);
            var extraLen = bytes[p + 30] | (bytes[p + 31] << 8);
            var comLen = bytes[p + 32] | (bytes[p + 33] << 8);
            var name = '';
            for (var c = 0; c < nameLen; c++) name += String.fromCharCode(bytes[p + 46 + c]);
            if (name.charAt(name.length - 1) !== '/') {
                names.push({ name: name, size: uSize });
            }
            p += 46 + nameLen + extraLen + comLen;
        }
        return names;
    } catch (e) {
        return null;
    }
}

// Parse a zip's central directory to list entry names (no inflation needed).
// Returns [{name, size}] or null when the data is not a readable zip.
function parseZipEntries(arrayBuffer) {
    try {
        var bytes = new Uint8Array(arrayBuffer);
        // Locate the End Of Central Directory record (PK\x05\x06), scanning
        // backwards to tolerate a trailing zip comment (max 65535 bytes)
        var i = bytes.length - 22;
        var eocd = -1;
        var minOfs = bytes.length - 22 - 65535;
        for (; i >= 0 && i >= minOfs; i--) {
            if (bytes[i] === 0x50 && bytes[i + 1] === 0x4B && bytes[i + 2] === 0x05 && bytes[i + 3] === 0x06) {
                eocd = i;
                break;
            }
        }
        if (eocd < 0) return null;
        var totalEntries = bytes[eocd + 10] | (bytes[eocd + 11] << 8);
        var cdSize = (bytes[eocd + 12] | (bytes[eocd + 13] << 8) | (bytes[eocd + 14] << 16) | (bytes[eocd + 15] << 24)) >>> 0;
        var cdOfs = (bytes[eocd + 16] | (bytes[eocd + 17] << 8) | (bytes[eocd + 18] << 16) | (bytes[eocd + 19] << 24)) >>> 0;
        var cdEnd = Math.min(cdOfs + cdSize, bytes.length);
        var names = [];
        var p = cdOfs;
        for (var n = 0; n < totalEntries && p + 46 <= cdEnd; n++) {
            if (bytes[p] !== 0x50 || bytes[p + 1] !== 0x4B || bytes[p + 2] !== 0x01 || bytes[p + 3] !== 0x02) break;
            var uSize = (bytes[p + 24] | (bytes[p + 25] << 8) | (bytes[p + 26] << 16) | (bytes[p + 27] << 24)) >>> 0;
            var nameLen = bytes[p + 28] | (bytes[p + 29] << 8);
            var extraLen = bytes[p + 30] | (bytes[p + 31] << 8);
            var comLen = bytes[p + 32] | (bytes[p + 33] << 8);
            var name = '';
            for (var c = 0; c < nameLen; c++) name += String.fromCharCode(bytes[p + 46 + c]);
            if (name.charAt(name.length - 1) !== '/') {
                names.push({ name: name, size: uSize });
            }
            p += 46 + nameLen + extraLen + comLen;
        }
        return names;
    } catch (e) {
        return null;
    }
}

// Append stored entries to an existing zip without recompressing it: keep the
// original local section, add new local entries before the central directory,
// then rebuild the central directory and EOCD around them.
function zipAppendEntries(origU8, adds) {
    var bytes = origU8;
    // Locate EOCD as in parseZipEntries
    var i = bytes.length - 22;
    var eocd = -1;
    var minOfs = bytes.length - 22 - 65535;
    for (; i >= 0 && i >= minOfs; i--) {
        if (bytes[i] === 0x50 && bytes[i + 1] === 0x4B && bytes[i + 2] === 0x05 && bytes[i + 3] === 0x06) {
            eocd = i;
            break;
        }
    }
    if (eocd < 0) return null;
    var totalEntries = (bytes[eocd + 10] | (bytes[eocd + 11] << 8)) >>> 0;
    var cdSize = (bytes[eocd + 12] | (bytes[eocd + 13] << 8) | (bytes[eocd + 14] << 16) | (bytes[eocd + 15] << 24)) >>> 0;
    var cdOfs = (bytes[eocd + 16] | (bytes[eocd + 17] << 8) | (bytes[eocd + 18] << 16) | (bytes[eocd + 19] << 24)) >>> 0;
    if (cdOfs + cdSize > bytes.length) return null;

    var encoder = new TextEncoder();
    var newLocals = [];
    var newCentrals = [];
    var newLocalTotal = 0;
    var offset = cdOfs; // new local entries start where the old CD began
    adds.forEach(function(f) {
        var nameBytes = encoder.encode(f.name);
        var crc = crc32(f.data);
        var local = new DataView(new ArrayBuffer(30));
        local.setUint32(0, 0x04034b50, true);
        local.setUint16(4, 20, true);
        local.setUint16(6, 0, true);
        local.setUint16(8, 0, true); // stored
        local.setUint16(10, 0, true);
        local.setUint16(12, 0x21, true);
        local.setUint32(14, crc, true);
        local.setUint32(18, f.data.length, true);
        local.setUint32(22, f.data.length, true);
        local.setUint16(26, nameBytes.length, true);
        local.setUint16(28, 0, true);
        newLocals.push(concatBytes(new Uint8Array(local.buffer), nameBytes, f.data));
        var central = new DataView(new ArrayBuffer(46));
        central.setUint32(0, 0x02014b50, true);
        central.setUint16(4, 20, true);
        central.setUint16(6, 20, true);
        central.setUint16(8, 0, true);
        central.setUint16(10, 0, true);
        central.setUint16(12, 0, true);
        central.setUint16(14, 0x21, true);
        central.setUint32(16, crc, true);
        central.setUint32(20, f.data.length, true);
        central.setUint32(24, f.data.length, true);
        central.setUint16(28, nameBytes.length, true);
        central.setUint16(30, 0, true);
        central.setUint16(32, 0, true);
        central.setUint16(34, 0, true);
        central.setUint16(36, 0, true);
        central.setUint32(38, 0, true);
        central.setUint32(42, offset, true);
        newCentrals.push(concatBytes(new Uint8Array(central.buffer), nameBytes));
        offset += 30 + nameBytes.length + f.data.length;
        newLocalTotal += 30 + nameBytes.length + f.data.length;
    });
    var newCentralTotal = 0;
    newCentrals.forEach(function(c) { newCentralTotal += c.length; });
    var eocdBuf = new DataView(new ArrayBuffer(22));
    eocdBuf.setUint32(0, 0x06054b50, true);
    eocdBuf.setUint16(4, 0, true);
    eocdBuf.setUint16(6, 0, true);
    eocdBuf.setUint16(8, (totalEntries + adds.length) & 0xFFFF, true);
    eocdBuf.setUint16(10, (totalEntries + adds.length) & 0xFFFF, true);
    eocdBuf.setUint32(12, cdSize + newCentralTotal, true);
    // The original central directory moved behind the newly inserted local
    // entries, so its offset must be adjusted accordingly
    eocdBuf.setUint32(16, cdOfs + newLocalTotal, true);
    eocdBuf.setUint16(20, 0, true);
    return concatBytes(
        bytes.slice(0, cdOfs),
        concatBytes.apply(null, newLocals),
        bytes.slice(cdOfs, cdOfs + cdSize),
        concatBytes.apply(null, newCentrals),
        new Uint8Array(eocdBuf.buffer)
    );
}

// Pick the most likely game launcher from a zip listing: prefer the shallowest
// path, then real executables (.exe/.com) over batch files (.bat), then size
function pickDosExecutable(entries) {
    if (!entries || !entries.length) return null;
    var exeRe = /\.(exe|com|bat)$/i;
    var cands = entries.filter(function(e) { return exeRe.test(e.name); });
    if (!cands.length) return null;
    cands.sort(function(a, b) {
        var dA = a.name.split('/').length;
        var dB = b.name.split('/').length;
        if (dA !== dB) return dA - dB;
        var bA = /\.bat$/i.test(a.name) ? 1 : 0;
        var bB = /\.bat$/i.test(b.name) ? 1 : 0;
        if (bA !== bB) return bA - bB;
        return (b.size || 0) - (a.size || 0);
    });
    return cands[0].name;
}

// Build a DOSBox [autoexec] section that mounts the package and launches the
// game. js-dos' default conf for raw zips only prints a readme, so without
// this the player would boot to an empty C:\> prompt.
function buildDosboxConf(exePath) {
    var norm = exePath.replace(/\//g, '\\');
    var dir = '';
    var file = norm;
    var idx = norm.lastIndexOf('\\');
    if (idx !== -1) {
        dir = norm.slice(0, idx);
        file = norm.slice(idx + 1);
    }
    var lines = ['[autoexec]', 'echo off', 'mount c .', 'c:'];
    if (dir) lines.push('cd ' + dir);
    lines.push(file);
    lines.push('echo on');
    return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Minimal stored-mode zip writer (no compression) used to wrap a raw game zip
// into a js-dos bundle: { bundle.zip, .jsdos/dosbox.conf, .jsdos/jsdos.json }.
// js-dos only auto-runs games from bundles; raw zips boot to a C:\> prompt.
// ---------------------------------------------------------------------------

var CRC32_TABLE = (function() {
    var table = new Uint32Array(256);
    for (var n = 0; n < 256; n++) {
        var c = n;
        for (var k = 0; k < 8; k++) {
            c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        }
        table[n] = c;
    }
    return table;
})();

function crc32(bytes) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < bytes.length; i++) {
        c = CRC32_TABLE[(c ^ bytes[i]) & 0xFF] ^ (c >>> 8);
    }
    return (c ^ 0xFFFFFFFF) >>> 0;
}

function concatBytes() {
    var total = 0;
    for (var i = 0; i < arguments.length; i++) total += arguments[i].length;
    var out = new Uint8Array(total);
    var pos = 0;
    for (var j = 0; j < arguments.length; j++) {
        out.set(arguments[j], pos);
        pos += arguments[j].length;
    }
    return out;
}

function buildJsDosBundle(gameZipU8, confText, version) {
    var encoder = new TextEncoder();
    var confBytes = encoder.encode(confText);
    var jsonBytes = encoder.encode(JSON.stringify({ version: version }));
    // js-dos re-wraps whatever bytes it receives into { bundle.zip, .jsdos/* }
    // (emulators.bundleUpdateConfig) and the dosbox worker unpacks that inner
    // bundle.zip entry as drive C. So the bytes we hand over must be a plain
    // zip of the game files plus the .jsdos/ metadata - exactly one layer.
    return zipAppendEntries(gameZipU8, [
        { name: '.jsdos/jsdos.json', data: jsonBytes },
        { name: '.jsdos/dosbox.conf', data: confBytes }
    ]);
}

function cacheGetRom(url) {
    if (!window.caches || !window.caches.open) return Promise.resolve(null);
    return window.caches.open(ROM_CACHE_NAME)
        .then(function(cache) { return cache.match(url); })
        .then(function(response) { return response ? response.blob() : null; })
        .catch(function() { return null; });
}

function cachePutRom(url, blob) {
    if (!window.caches || !window.caches.open) return;
    window.caches.open(ROM_CACHE_NAME)
        .then(function(cache) {
            var headers = { 'Content-Type': blob.type || 'application/octet-stream' };
            return cache.put(url, new Response(blob, { headers: headers }));
        })
        .catch(function() { /* caching is best-effort; ignore failures */ });
}

// Hand a downloaded package blob to the player
function processDosBlob(blob, filename) {
    clearUrlError();
    var urlLoadBtn = document.getElementById('urlLoadBtn');
    if (urlLoadBtn) urlLoadBtn.disabled = false;

    // .jsdos bundles already carry their own config - pass them straight through.
    if (/\.jsdos$/i.test(filename)) {
        startDos(URL.createObjectURL(blob), filename);
        return;
    }

    // For plain zips, wrap the package into a js-dos bundle client-side with an
    // [autoexec] that runs the detected game (js-dos' default conf for raw zips
    // only prints a readme, leaving the player at an empty C:\> prompt). The
    // bundle is served through a blob URL; js-dos detects the .jsdos/ layout
    // and boots it like any other bundle. Very large packages are skipped to
    // avoid doubling memory usage.
    if (/\.zip$/i.test(filename) && typeof blob.arrayBuffer === 'function' && blob.size <= 100 * 1024 * 1024) {
        blob.arrayBuffer().then(function(buf) {
            var entries = parseZipEntries(buf);
            var exe = pickDosExecutable(entries);
            if (!exe) {
                console.log('No DOS executable found in zip, using default conf');
                startDos(URL.createObjectURL(blob), filename);
                return;
            }
            console.log('DOS autoexec ->', exe);
            var confText = buildDosboxConf(exe);
            var bundleBytes = buildJsDosBundle(new Uint8Array(buf), confText, '8.5.4');
            var bundleBlob = new Blob([bundleBytes], { type: 'application/zip' });
            startDos(URL.createObjectURL(bundleBlob), filename);
        }).catch(function(err) {
            console.log('Bundle build failed, falling back to raw zip URL:', err);
            startDos(URL.createObjectURL(blob), filename);
        });
        return;
    }

    startDos(URL.createObjectURL(blob), filename);
}

// Fetch a package: direct first for CORS-enabled hosts, then through CORS
// proxies, then a final direct attempt as last resort
function tryFetchWithProxy(originalUrl, proxyIndex, filename, onFinalError, directTried) {
    var urlLoadBtn = document.getElementById('urlLoadBtn');
    var fetchUrl;
    var viaProxy;

    // Check if URL is local (localhost, 127.0.0.1, or absolute path)
    var isLocalUrl = originalUrl.indexOf('localhost') !== -1 ||
                     originalUrl.indexOf('127.0.0.1') !== -1 ||
                     originalUrl.charAt(0) === '/';

    if (isLocalUrl) {
        fetchUrl = originalUrl;
        viaProxy = false;
        console.log('Local URL detected, fetching directly: ' + originalUrl);
    } else if (!directTried && isDirectFetchable(originalUrl)) {
        fetchUrl = originalUrl;
        viaProxy = false;
        directTried = true;
        proxyIndex = -1; // marker: continue with proxy 0 after this attempt
        console.log('CORS-enabled host detected, fetching directly: ' + originalUrl);
    } else if (proxyIndex < corsProxies.length) {
        fetchUrl = corsProxies[proxyIndex] + encodeURIComponent(originalUrl);
        viaProxy = true;
        console.log('Trying CORS proxy ' + (proxyIndex + 1) + ': ' + corsProxies[proxyIndex]);
    } else {
        fetchUrl = originalUrl;
        viaProxy = false;
        directTried = true;
        console.log('Trying direct fetch (no proxy)');
    }

    // Proxied attempts get a longer timeout: free-tier proxies can take 30s+
    // to wake up from a cold start
    var controller = new AbortController();
    var fetchTimer = setTimeout(function(){ controller.abort(); }, viaProxy ? 30000 : 20000);
    fetch(fetchUrl, { signal: controller.signal })
        .then(function(response) {
            clearTimeout(fetchTimer);
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            var contentType = response.headers.get('content-type') || '';
            if (viaProxy && contentType.indexOf('text/html') !== -1 && filename.indexOf('.html') === -1) {
                console.log('Proxy returned HTML, trying next...');
                throw new Error('Proxy returned HTML');
            }
            return response.blob();
        })
        .then(function(blob) {
            if (blob.size < 1024) {
                throw new Error('File too small, possibly an error page');
            }
            return isLikelyErrorBody(blob).then(function(isError) {
                if (isError) {
                    throw new Error('Proxy returned an error page');
                }
                return hasBinaryCorruption(blob).then(function(corrupt) {
                    if (corrupt) {
                        throw new Error('Proxy corrupted the binary data (U+FFFD transcoding)');
                    }
                    return blob;
                });
            });
        })
        .then(function(blob) {
            console.log('Package downloaded successfully (' + blob.size + ' bytes)');
            cachePutRom(originalUrl, blob);
            processDosBlob(blob, filename);
        })
        .catch(function(error) {
            clearTimeout(fetchTimer);
            console.log('Fetch attempt failed: ' + error.message);
            var nextProxy = proxyIndex < 0 ? 0 : proxyIndex + 1;
            if (nextProxy < corsProxies.length) {
                tryFetchWithProxy(originalUrl, nextProxy, filename, onFinalError, directTried);
            } else if (!directTried) {
                tryFetchWithProxy(originalUrl, nextProxy, filename, onFinalError, directTried);
            } else {
                if (urlLoadBtn) urlLoadBtn.disabled = false;
                console.error('All fetch methods failed for: ' + originalUrl);
                if (typeof onFinalError === 'function') {
                    onFinalError(originalUrl, filename);
                } else {
                    showToast(t('urlFetchError'));
                }
            }
        });
}

// Handle a package from a user-provided URL
function handleDosFromUrl(url) {
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
        showToast(t('urlInvalid'));
        return;
    }

    var urlLoadBtn = document.getElementById('urlLoadBtn');
    urlLoadBtn.disabled = true;
    clearUrlError();
    showToast(t('urlLoading'));

    var filename = url.split('/').pop().split('?')[0] || 'game.zip';

    // Serve previously downloaded packages from Cache Storage (no network needed)
    cacheGetRom(url).then(function(cachedBlob) {
        if (cachedBlob && cachedBlob.size > 0) {
            console.log('Package served from cache (' + cachedBlob.size + ' bytes)');
            processDosBlob(cachedBlob, filename);
            return;
        }
        tryFetchWithProxy(url, 0, filename, function(finalUrl, finalFilename) {
            showUrlManualDownload(finalUrl, finalFilename);
            showToast(t('urlFetchError'));
        });
    });
}

// Escape a string for safe interpolation into innerHTML
function escapeHtml(s) {
    return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Show inline error + a manual-download button on the URL tab
function showUrlManualDownload(url, filename) {
    var el = document.getElementById('urlLoadError');
    if (!el) return;
    el.innerHTML = "<div class='search-error'>" + t('urlFetchFailed') + "</div>" +
        "<div class='search-manual'>" +
        "<a href='" + escapeHtml(url) + "' download target='_blank' rel='noopener' class='search-manual-link'>" +
        "<i class='fas fa-download'></i> " + t('searchManualDownload') + ": " + escapeHtml(filename) + "</a>" +
        "<p class='search-manual-tip'>" + t('searchManualTip') + "</p>" +
        "</div>";
    el.classList.remove('hidden');
}

function clearUrlError() {
    var el = document.getElementById('urlLoadError');
    if (el) { el.innerHTML = ''; el.classList.add('hidden'); }
}

// Search archive.org for MS-DOS games (collection-scoped)
function searchDos(query) {
    if (!query || query.trim().length < 2) {
        showToast(t('searchNoResults'));
        return;
    }

    var resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '<div class="search-loading">' + t('searchLoading') + '</div>';

    var searchBtn = document.getElementById('romSearchBtn');
    searchBtn.disabled = true;

    searchArchiveOrg(query)
        .then(function(data) {
            searchBtn.disabled = false;
            renderSearchResults(data);
        })
        .catch(function(err) {
            searchBtn.disabled = false;
            console.error('Archive.org search failed:', err);
            resultsDiv.innerHTML = '<div class="search-error">' + t('searchFailed') + '</div>';
        });
}

// Search on archive.org, limited to the official softwarelibrary_msdos_games
// collection so results are directly playable zip packages
function searchArchiveOrg(query) {
    var q = encodeURIComponent(query + ' collection:softwarelibrary_msdos_games');
    var url = 'https://archive.org/advancedsearch.php?q=' + q + '&fl%5B%5D=identifier&fl%5B%5D=title&fl%5B%5D=creator&fl%5B%5D=year&fl%5B%5D=downloads&fl%5B%5D=is_dark&rows=20&output=json';
    return tryFetchJson(url, 0);
}

// JSON API hosts that serve CORS headers - fetched directly without a proxy
function isJsonDirectFetchable(url) {
    try {
        var hostname = new URL(url).hostname;
        return hostname === 'archive.org' || hostname === 'api.github.com' ||
               directFetchHosts.indexOf(hostname) !== -1;
    } catch (e) {
        return false;
    }
}

// Fetch JSON through CORS proxies (archive.org metadata/advancedsearch are
// fetched directly first - they serve CORS headers)
function tryFetchJson(originalUrl, proxyIndex) {
    var fetchUrl;
    var viaProxy;

    if (proxyIndex === 0 && isJsonDirectFetchable(originalUrl)) {
        fetchUrl = originalUrl;
        viaProxy = false;
        proxyIndex = -1; // marker: continue with proxy 0 after this attempt
        console.log('Fetching JSON directly (CORS-enabled API)');
    } else if (proxyIndex >= 0 && proxyIndex < corsProxies.length) {
        fetchUrl = corsProxies[proxyIndex] + encodeURIComponent(originalUrl);
        viaProxy = true;
    } else {
        fetchUrl = originalUrl;
        viaProxy = false;
    }

    var controller = new AbortController();
    var fetchTimer = setTimeout(function(){ controller.abort(); }, viaProxy ? 30000 : 20000);
    return fetch(fetchUrl, { signal: controller.signal })
        .then(function(response) {
            clearTimeout(fetchTimer);
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            return response.json();
        })
        .catch(function(error) {
            clearTimeout(fetchTimer);
            var nextProxy = proxyIndex < 0 ? 0 : proxyIndex + 1;
            if (nextProxy < corsProxies.length) {
                return tryFetchJson(originalUrl, nextProxy);
            }
            throw error;
        });
}

// Render search results
function renderSearchResults(data) {
    var resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '';

    var docs = data.response && data.response.docs ? data.response.docs : [];
    // Darkened items are withheld on archive.org (downloads return 403)
    docs = docs.filter(function(doc) { return !doc.is_dark; });

    if (docs.length === 0) {
        resultsDiv.innerHTML = '<div class="search-empty">' + t('searchNoResults') + '</div>';
        return;
    }

    docs.forEach(function(doc) {
        var item = document.createElement('div');
        item.className = 'search-result-item';

        var title = doc.title || doc.identifier || 'Unknown';
        var creator = Array.isArray(doc.creator) ? doc.creator[0] : (doc.creator || '');
        var year = doc.year || '';
        var downloads = doc.downloads || 0;

        var metaHtml = '';
        if (creator) metaHtml += '<span>' + escapeHtml(String(creator)) + '</span>';
        if (year) metaHtml += '<span>' + escapeHtml(String(year)) + '</span>';
        metaHtml += '<span>⬇ ' + downloads + '</span>';

        item.innerHTML = '<div class="search-result-title">' + escapeHtml(title) + '</div>' +
            '<div class="search-result-meta">' + metaHtml + '</div>';

        item.addEventListener('click', function() {
            selectSearchResult(doc.identifier, title);
        });

        resultsDiv.appendChild(item);
    });
}

// Select a search result and get its .zip files
function selectSearchResult(identifier, title) {
    var resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '<div class="search-loading">' + t('searchDownloading') + ' ' + escapeHtml(title) + '</div>';

    var metaUrl = 'https://archive.org/metadata/' + encodeURIComponent(identifier);

    tryFetchJson(metaUrl, 0)
        .then(function(meta) {
            var zipFile = findDosFile(meta);
            if (!zipFile) {
                resultsDiv.innerHTML = '<div class="search-error">' + t('searchNoResults') + '</div>';
                return;
            }
            var downloadUrl = 'https://archive.org/download/' + encodeURIComponent(identifier) + '/' + encodeURIComponent(zipFile.name);
            downloadAndLoadDos(downloadUrl, zipFile.name);
        })
        .catch(function(err) {
            console.error('Metadata fetch failed:', err);
            resultsDiv.innerHTML = '<div class="search-error">' + t('searchDownloadFailed') + '</div>';
        });
}

// Find the best .zip file from archive.org metadata
function findDosFile(meta) {
    if (!meta.files || meta.files.length === 0) return null;

    var candidates = meta.files.filter(function(f) {
        var name = f.name || '';
        return name.toLowerCase().endsWith('.zip');
    });

    if (candidates.length === 0) return null;

    // Prefer largest file (most likely to be the complete game)
    candidates.sort(function(a, b) {
        return (b.size || 0) - (a.size || 0);
    });

    return candidates[0];
}

// Download package and load it
function downloadAndLoadDos(url, filename) {
    var resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '<div class="search-loading">' + t('searchDownloading') + ' ' + escapeHtml(filename) + '</div>';

    cacheGetRom(url).then(function(cachedBlob) {
        if (cachedBlob && cachedBlob.size > 0) {
            console.log('Package served from cache (' + cachedBlob.size + ' bytes)');
            processDosBlob(cachedBlob, filename);
            return;
        }
        tryFetchWithProxy(url, 0, filename, function(finalUrl, finalFilename) {
            showManualDownload(finalUrl, finalFilename);
        });
    });
}

// Show manual download link in the search results when auto-download fails
function showManualDownload(url, filename) {
    var resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = "<div class='search-error'>" + t("searchDownloadFailed") + "</div>" +
        "<div class='search-manual'>" +
            "<a href='" + escapeHtml(url) + "' download target='_blank' rel='noopener' class='search-manual-link'>" + t("searchManualDownload") + ": " + escapeHtml(filename) + "</a>" +
            "<p class='search-manual-tip'>" + t("searchManualTip") + "</p>" +
        "</div>";
}

// Init
document.addEventListener('DOMContentLoaded', function() {
    applyTranslations();
    loadingOverlay = document.getElementById('loadingOverlay');

    // Back button
    document.getElementById('backBtn').addEventListener('click', function() {
        window.history.back();
    });

    // Reset button - back to the game selection screen with a fresh player
    // (full reload, same behavior as the emulator/flash pages)
    document.getElementById('resetBtn').addEventListener('click', function() {
        window.location.reload();
    });

    // File selection
    var zipInput = document.getElementById('swfInput');
    var uploadBtn = document.getElementById('uploadBtn');
    uploadBtn.addEventListener('click', function() {
        zipInput.click();
    });
    zipInput.addEventListener('change', function() {
        var f = this.files && this.files[0];
        if (f) playDos(f);
    });

    // Drag and drop
    var uploadBox = document.getElementById('uploadBox');
    ['dragenter', 'dragover'].forEach(function(evt) {
        uploadBox.addEventListener(evt, function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadBox.style.borderColor = '#4a9eff';
        });
    });
    ['dragleave', 'drop'].forEach(function(evt) {
        uploadBox.addEventListener(evt, function(e) {
            e.preventDefault();
            e.stopPropagation();
            uploadBox.style.borderColor = '';
        });
    });
    uploadBox.addEventListener('drop', function(e) {
        var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) playDos(f);
    });

    // Tab switching
    document.getElementById('tabFile').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('tabUrl').classList.remove('active');
        document.getElementById('tabSearch').classList.remove('active');
        document.getElementById('uploadBox').classList.remove('hidden');
        document.getElementById('urlBox').classList.add('hidden');
        document.getElementById('searchBox').classList.add('hidden');
    });

    document.getElementById('tabUrl').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('tabFile').classList.remove('active');
        document.getElementById('tabSearch').classList.remove('active');
        document.getElementById('urlBox').classList.remove('hidden');
        document.getElementById('uploadBox').classList.add('hidden');
        document.getElementById('searchBox').classList.add('hidden');
    });

    document.getElementById('tabSearch').addEventListener('click', function() {
        this.classList.add('active');
        document.getElementById('tabFile').classList.remove('active');
        document.getElementById('tabUrl').classList.remove('active');
        document.getElementById('searchBox').classList.remove('hidden');
        document.getElementById('uploadBox').classList.add('hidden');
        document.getElementById('urlBox').classList.add('hidden');
    });

    // URL load button
    document.getElementById('urlLoadBtn').addEventListener('click', function() {
        var url = document.getElementById('romUrlInput').value.trim();
        handleDosFromUrl(url);
    });

    // Preset package select
    document.getElementById('romPresetSelect').addEventListener('change', function() {
        var url = this.value.trim();
        if (url) {
            document.getElementById('romUrlInput').value = url;
            handleDosFromUrl(url);
        }
    });

    // URL input Enter key
    document.getElementById('romUrlInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            var url = this.value.trim();
            handleDosFromUrl(url);
        }
    });

    // Search button + Enter key
    document.getElementById('romSearchBtn').addEventListener('click', function() {
        var query = document.getElementById('romSearchInput').value.trim();
        searchDos(query);
    });
    document.getElementById('romSearchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            var query = document.getElementById('romSearchInput').value.trim();
            searchDos(query);
        }
    });

    // Preset DOS games from data/roms/dos.json (group hidden when empty/missing)
    (function loadPresetOptions() {
        var select = document.getElementById('romPresetSelect');
        if (!select) return;
        var presetGroup = select.closest ? select.closest('.url-preset-group') : null;
        fetch('../data/roms/dos.json')
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }
                return response.json();
            })
            .then(function(data) {
                if (!data || !data.games || data.games.length === 0) {
                    if (presetGroup) presetGroup.classList.add('hidden');
                    return;
                }
                select.innerHTML = '<option value="">-- Select a game --</option>';
                data.games.forEach(function(game) {
                    var option = document.createElement('option');
                    option.value = game.url;
                    option.textContent = game.name;
                    select.appendChild(option);
                });
            })
            .catch(function() {
                // No preset data file - hide the group entirely
                if (presetGroup) presetGroup.classList.add('hidden');
            });
    })();

    // Instructions collapse
    var instructionsHeader = document.getElementById('instructionsHeader');
    var instructionsContent = document.getElementById('instructionsContent');
    if (instructionsHeader && instructionsContent) {
        instructionsHeader.addEventListener('click', function() {
            instructionsContent.style.display =
                instructionsContent.style.display === 'none' ? '' : 'none';
        });
    }
});
