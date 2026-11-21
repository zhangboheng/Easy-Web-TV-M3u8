// Flash Player Page JavaScript (Ruffle-based)
// Ruffle is selfhosted at vendor/ruffle (MIT OR Apache-2.0).

// Internationalization (same language set as emulatorjs.js)
var i18n = {
    zh: {
        pageTitle: 'Flash 游戏',
        reset: '重置',
        instructions: '使用说明',
        flashUploadTitle: '上传 SWF 文件',
        flashUploadDesc: '拖拽 .swf Flash 游戏到此处或点击选择',
        flashSelect: '选择 SWF 文件',
        flashHint: 'Flash 游戏使用键盘和鼠标操作，移动端能否游玩取决于游戏本身',
        flashLoading: '正在加载 Flash 播放器，请稍候...',
        flashLoadingTip: '首次使用需下载约 14MB 组件，可能需要一些时间',
        flashPlaying: '正在播放：',
        flashInvalid: '请选择 .swf 文件',
        flashLoadError: 'Flash 播放器加载失败',
        flashControlsTitle: '操作方式',
        flashRightClick: '右键点击画面打开 Flash 播放器菜单',
        flashFullscreen: '全屏',
        flashFullscreenDesc: '右键点击游戏画面并选择"进入全屏"',
        exitFullscreen: '按 ESC 退出全屏',
        flashSoundTitle: '声音',
        flashSoundDesc: '在播放器菜单（右键）中点击喇叭图标取消静音',
        tabFile: '文件上传',
        tabUrl: 'URL 输入',
        tabSearch: '搜索 Flash',
        urlTitle: '从 URL 加载 SWF',
        urlDesc: '输入 .swf 文件的直接链接地址',
        urlPlaceholder: 'https://example.com/game.swf',
        loadRom: '加载 SWF',
        urlTip: '提示：请输入 .swf 文件的直接下载链接。运行时需要加载额外文件的 Flash 游戏，从其原始站点加载效果最佳。',
        urlLoading: '正在从 URL 下载 SWF...',
        urlInvalid: '请输入有效的 URL 地址',
        urlFetchFailed: '下载 SWF 文件失败，请检查 URL 是否正确。',
        urlFetchError: '网络错误，无法下载 SWF 文件。',
        urlPreset: '预设 Flash 游戏：',
        searchTitle: '搜索 Flash 游戏',
        searchDesc: '在 archive.org 中搜索 .swf Flash 游戏',
        searchPlaceholder: '输入游戏名称，例如 Pac-Man flash game',
        search: '搜索',
        searchDisclaimer: '结果来自 archive.org，部分 Flash 游戏 Ruffle 可能尚未完全支持。',
        searchLoading: '正在搜索...',
        searchFailed: '搜索失败，请稍后再试。',
        searchNoResults: '未找到匹配的游戏。',
        searchDownloading: '正在下载：',
        searchDownloadFailed: '下载失败，请重试。',
        searchManualDownload: '手动下载',
        searchManualTip: '下载失败，请点击上方链接手动下载，然后用文件上传加载 SWF。'
    },
    en: {
        pageTitle: 'Flash Player',
        reset: 'Reset',
        instructions: 'Instructions',
        flashUploadTitle: 'Upload SWF File',
        flashUploadDesc: 'Drag and drop a .swf Flash game here or click to select',
        flashSelect: 'Select SWF File',
        flashHint: 'Flash games use keyboard and mouse. On mobile, playability depends on the game itself.',
        flashLoading: 'Loading Flash player, please wait...',
        flashLoadingTip: 'The first launch downloads ~14MB of components and may take a while',
        flashPlaying: 'Now playing: ',
        flashInvalid: 'Please select a .swf file',
        flashLoadError: 'Failed to load the Flash player',
        flashControlsTitle: 'Controls',
        flashRightClick: 'Right-click on the screen to open the Flash player menu',
        flashFullscreen: 'Fullscreen',
        flashFullscreenDesc: 'Right-click the game screen and choose "Enter Fullscreen"',
        exitFullscreen: 'Press ESC to exit fullscreen',
        flashSoundTitle: 'Sound',
        flashSoundDesc: 'Use the speaker icon in the player menu (right-click) to unmute',
        tabFile: 'File Upload',
        tabUrl: 'URL Input',
        tabSearch: 'Search Flash',
        urlTitle: 'Load SWF from URL',
        urlDesc: 'Enter the direct URL of a .swf file to load',
        urlPlaceholder: 'https://example.com/game.swf',
        loadRom: 'Load SWF',
        urlTip: 'Tip: Enter a direct link to the .swf file. Games that load extra files at runtime work best when loaded from their original host.',
        urlLoading: 'Downloading SWF from URL...',
        urlInvalid: 'Please enter a valid URL',
        urlFetchFailed: 'Failed to download SWF file. Please check the URL.',
        urlFetchError: 'Network error, unable to download SWF file.',
        urlPreset: 'Preset Flash games:',
        searchTitle: 'Search Flash Games',
        searchDesc: 'Search archive.org for .swf Flash games',
        searchPlaceholder: 'Enter game name, e.g. Pac-Man flash game',
        search: 'Search',
        searchDisclaimer: 'Results from archive.org. Some Flash games may not be fully supported by Ruffle yet.',
        searchLoading: 'Searching...',
        searchFailed: 'Search failed. Please try again later.',
        searchNoResults: 'No matching games found.',
        searchDownloading: 'Downloading:',
        searchDownloadFailed: 'Download failed. Please try again.',
        searchManualDownload: 'Manual download',
        searchManualTip: 'Download failed. Click the link above to download manually, then use File Upload to load the SWF.'
    },
    ja: {
        pageTitle: 'Flash プレイヤー',
        reset: 'リセット',
        instructions: '使い方',
        flashUploadTitle: 'SWF ファイルをアップロード',
        flashUploadDesc: '.swf Flash ゲームをここにドラッグ＆ドロップ、またはクリックして選択',
        flashSelect: 'SWF ファイルを選択',
        flashHint: 'Flash ゲームはキーボードとマウスで操作します。モバイルで遊べるかはゲーム次第です。',
        flashLoading: 'Flash プレイヤーを読み込み中...',
        flashLoadingTip: '初回は約 14MB のコンポーネントをダウンロードするため時間がかかることがあります',
        flashPlaying: '再生中：',
        flashInvalid: '.swf ファイルを選択してください',
        flashLoadError: 'Flash プレイヤーの読み込みに失敗しました',
        flashControlsTitle: '操作方法',
        flashRightClick: '画面を右クリックして Flash プレイヤーメニューを開く',
        flashFullscreen: '全画面',
        flashFullscreenDesc: 'ゲーム画面を右クリックして「全画面表示」を選択',
        exitFullscreen: 'ESC キーで全画面を解除',
        flashSoundTitle: 'サウンド',
        flashSoundDesc: 'プレイヤーメニュー（右クリック）のスピーカーアイコンでミュート解除',
        tabFile: 'ファイルアップロード',
        tabUrl: 'URL入力',
        tabSearch: 'Flash検索',
        urlTitle: 'URLからSWFを読み込む',
        urlDesc: '.swfファイルの直接URLを入力',
        urlPlaceholder: 'https://example.com/game.swf',
        loadRom: 'SWFを読み込む',
        urlTip: 'ヒント：.swfファイルの直接ダウンロードリンクを入力してください。実行時に追加ファイルを読み込むFlashゲームは、元のサイトから読み込むのが最適です。',
        urlLoading: 'URLからSWFをダウンロード中...',
        urlInvalid: '有効なURLを入力してください',
        urlFetchFailed: 'SWFファイルのダウンロードに失敗しました。URLを確認してください。',
        urlFetchError: 'ネットワークエラー、SWFファイルをダウンロードできません。',
        urlPreset: 'Flashゲームプリセット：',
        searchTitle: 'Flashゲーム検索',
        searchDesc: 'archive.orgで.swf Flashゲームを検索',
        searchPlaceholder: 'ゲーム名を入力（例：Pac-Man flash game）',
        search: '検索',
        searchDisclaimer: 'archive.orgの検索結果です。一部のFlashゲームはRuffleでまだ完全にサポートされていない場合があります。',
        searchLoading: '検索中...',
        searchFailed: '検索に失敗しました。後でもう一度お試しください。',
        searchNoResults: '一致するゲームが見つかりませんでした。',
        searchDownloading: 'ダウンロード中：',
        searchDownloadFailed: 'ダウンロードに失敗しました。',
        searchManualDownload: '手動ダウンロード',
        searchManualTip: 'ダウンロードに失敗しました。上のリンクをクリックして手動でダウンロードし、ファイルアップロードでSWFを読み込んでください。'
    },
    ko: {
        pageTitle: 'Flash 플레이어',
        reset: '재설정',
        instructions: '사용 방법',
        flashUploadTitle: 'SWF 파일 업로드',
        flashUploadDesc: '.swf Flash 게임을 여기로 드래그하거나 클릭하여 선택',
        flashSelect: 'SWF 파일 선택',
        flashHint: 'Flash 게임은 키보드와 마우스로 조작합니다. 모바일에서의 플레이 가능 여부는 게임에 따라 다릅니다.',
        flashLoading: 'Flash 플레이어를 불러오는 중...',
        flashLoadingTip: '첫 실행 시 약 14MB의 구성 요소를 다운로드하므로 시간이 걸릴 수 있습니다',
        flashPlaying: '재생 중: ',
        flashInvalid: '.swf 파일을 선택하세요',
        flashLoadError: 'Flash 플레이어를 불러오지 못했습니다',
        flashControlsTitle: '조작 방법',
        flashRightClick: '화면을 우클릭하여 Flash 플레이어 메뉴 열기',
        flashFullscreen: '전체 화면',
        flashFullscreenDesc: '게임 화면을 우클릭하고 "전체 화면" 선택',
        exitFullscreen: 'ESC 키로 전체 화면 종료',
        flashSoundTitle: '소리',
        flashSoundDesc: '플레이어 메뉴(우클릭)의 스피커 아이콘을 클릭하여 음소거 해제',
        tabFile: '파일 업로드',
        tabUrl: 'URL 입력',
        tabSearch: 'Flash 검색',
        urlTitle: 'URL에서 SWF 로드',
        urlDesc: '.swf 파일의 직접 URL을 입력',
        urlPlaceholder: 'https://example.com/game.swf',
        loadRom: 'SWF 로드',
        urlTip: '팁: .swf 파일의 직접 다운로드 링크를 입력하세요. 실행 시 추가 파일을 불러오는 Flash 게임은 원본 사이트에서 로드하는 것이 가장 좋습니다.',
        urlLoading: 'URL에서 SWF 다운로드 중...',
        urlInvalid: '유효한 URL을 입력하세요',
        urlFetchFailed: 'SWF 파일 다운로드 실패. URL을 확인하세요.',
        urlFetchError: '네트워크 오류, SWF 파일을 다운로드할 수 없습니다.',
        urlPreset: 'Flash 게임 프리셋:',
        searchTitle: 'Flash 게임 검색',
        searchDesc: 'archive.org에서 .swf Flash 게임 검색',
        searchPlaceholder: '게임 이름 입력 (예: Pac-Man flash game)',
        search: '검색',
        searchDisclaimer: 'archive.org 검색 결과입니다. 일부 Flash 게임은 Ruffle에서 아직 완전히 지원되지 않을 수 있습니다.',
        searchLoading: '검색 중...',
        searchFailed: '검색 실패. 나중에 다시 시도하세요.',
        searchNoResults: '일치하는 게임을 찾을 수 없습니다.',
        searchDownloading: '다운로드 중:',
        searchDownloadFailed: '다운로드 실패. 다시 시도하세요.',
        searchManualDownload: '수동 다운로드',
        searchManualTip: '다운로드 실패. 위 링크를 클릭하여 수동으로 다운로드한 후 파일 업로드로 SWF를 로드하세요.'
    },
    fr: {
        pageTitle: 'Lecteur Flash',
        reset: 'Réinitialiser',
        instructions: 'Instructions',
        flashUploadTitle: 'Téléverser un fichier SWF',
        flashUploadDesc: 'Glissez-déposez un jeu Flash .swf ici ou cliquez pour sélectionner',
        flashSelect: 'Sélectionner un fichier SWF',
        flashHint: 'Les jeux Flash se jouent au clavier et à la souris. Sur mobile, la jouabilité dépend du jeu.',
        flashLoading: 'Chargement du lecteur Flash, veuillez patienter...',
        flashLoadingTip: 'Le premier lancement télécharge environ 14 Mo de composants, cela peut prendre du temps',
        flashPlaying: 'Lecture en cours : ',
        flashInvalid: 'Veuillez sélectionner un fichier .swf',
        flashLoadError: 'Échec du chargement du lecteur Flash',
        flashControlsTitle: 'Commandes',
        flashRightClick: 'Clic droit sur l\'écran pour ouvrir le menu du lecteur Flash',
        flashFullscreen: 'Plein écran',
        flashFullscreenDesc: 'Clic droit sur l\'écran de jeu puis choisissez « Plein écran »',
        exitFullscreen: 'Appuyez sur ÉCHAP pour quitter le plein écran',
        flashSoundTitle: 'Son',
        flashSoundDesc: 'Utilisez l\'icône haut-parleur dans le menu du lecteur (clic droit) pour réactiver le son',
        tabFile: 'Fichier',
        tabUrl: 'URL',
        tabSearch: 'Recherche Flash',
        urlTitle: 'Charger un SWF depuis une URL',
        urlDesc: 'Entrez l\'URL directe d\'un fichier .swf',
        urlPlaceholder: 'https://example.com/game.swf',
        loadRom: 'Charger le SWF',
        urlTip: 'Astuce : entrez un lien direct vers le fichier .swf. Les jeux qui chargent des fichiers supplémentaires fonctionnent mieux depuis leur site d\'origine.',
        urlLoading: 'Téléchargement du SWF depuis l\'URL...',
        urlInvalid: 'Veuillez entrer une URL valide',
        urlFetchFailed: 'Échec du téléchargement du fichier SWF. Vérifiez l\'URL.',
        urlFetchError: 'Erreur réseau, impossible de télécharger le fichier SWF.',
        urlPreset: 'Jeux Flash prédéfinis :',
        searchTitle: 'Rechercher des jeux Flash',
        searchDesc: 'Rechercher des jeux Flash .swf sur archive.org',
        searchPlaceholder: 'Entrez le nom du jeu, ex : Pac-Man flash game',
        search: 'Rechercher',
        searchDisclaimer: 'Résultats de archive.org. Certains jeux Flash ne sont pas encore entièrement pris en charge par Ruffle.',
        searchLoading: 'Recherche...',
        searchFailed: 'Recherche échouée. Réessayez plus tard.',
        searchNoResults: 'Aucun jeu correspondant trouvé.',
        searchDownloading: 'Téléchargement : ',
        searchDownloadFailed: 'Échec du téléchargement. Réessayez.',
        searchManualDownload: 'Téléchargement manuel',
        searchManualTip: 'Échec du téléchargement. Cliquez sur le lien ci-dessus pour télécharger manuellement, puis utilisez le téléversement de fichier pour charger le SWF.'
    },
    de: {
        pageTitle: 'Flash-Player',
        reset: 'Zurücksetzen',
        instructions: 'Anleitung',
        flashUploadTitle: 'SWF-Datei hochladen',
        flashUploadDesc: '.swf-Flashspiel hierher ziehen oder klicken zum Auswählen',
        flashSelect: 'SWF-Datei auswählen',
        flashHint: 'Flash-Spiele werden mit Tastatur und Maus gespielt. Auf Mobilgeräten hängt die Spielbarkeit vom Spiel ab.',
        flashLoading: 'Flash-Player wird geladen, bitte warten...',
        flashLoadingTip: 'Beim ersten Start werden ca. 14 MB Komponenten heruntergeladen, das kann dauern',
        flashPlaying: 'Wird abgespielt: ',
        flashInvalid: 'Bitte eine .swf-Datei auswählen',
        flashLoadError: 'Flash-Player konnte nicht geladen werden',
        flashControlsTitle: 'Steuerung',
        flashRightClick: 'Rechtsklick auf den Bildschirm öffnet das Flash-Player-Menü',
        flashFullscreen: 'Vollbild',
        flashFullscreenDesc: 'Rechtsklick auf das Spielfeld und "Vollbild" wählen',
        exitFullscreen: 'ESC drücken, um den Vollbildmodus zu verlassen',
        flashSoundTitle: 'Ton',
        flashSoundDesc: 'Lautsprechersymbol im Player-Menü (Rechtsklick) verwenden, um den Ton zu aktivieren',
        tabFile: 'Datei',
        tabUrl: 'URL',
        tabSearch: 'Flash suchen',
        urlTitle: 'SWF von URL laden',
        urlDesc: 'Geben Sie die direkte URL einer .swf-Datei ein',
        urlPlaceholder: 'https://example.com/game.swf',
        loadRom: 'SWF laden',
        urlTip: 'Tipp: Geben Sie einen direkten Link zur .swf-Datei ein. Spiele, die zur Laufzeit zusätzliche Dateien laden, funktionieren am besten von ihrer ursprünglichen Website.',
        urlLoading: 'SWF wird von URL heruntergeladen...',
        urlInvalid: 'Bitte geben Sie eine gültige URL ein',
        urlFetchFailed: 'SWF-Download fehlgeschlagen. Bitte URL prüfen.',
        urlFetchError: 'Netzwerkfehler, SWF kann nicht heruntergeladen werden.',
        urlPreset: 'Flash-Spiel-Vorlagen:',
        searchTitle: 'Flash-Spiele suchen',
        searchDesc: 'Durchsuchen Sie archive.org nach .swf-Flashspielen',
        searchPlaceholder: 'Spielnamen eingeben, z.B. Pac-Man flash game',
        search: 'Suchen',
        searchDisclaimer: 'Ergebnisse von archive.org. Einige Flash-Spiele werden von Ruffle noch nicht vollständig unterstützt.',
        searchLoading: 'Suche läuft...',
        searchFailed: 'Suche fehlgeschlagen. Bitte versuchen Sie es später.',
        searchNoResults: 'Keine passenden Spiele gefunden.',
        searchDownloading: 'Herunterladen:',
        searchDownloadFailed: 'Download fehlgeschlagen. Bitte versuchen Sie es erneut.',
        searchManualDownload: 'Manueller Download',
        searchManualTip: 'Download fehlgeschlagen. Klicken Sie auf den Link oben zum manuellen Download, dann laden Sie das SWF über Datei-Upload.'
    },
    es: {
        pageTitle: 'Reproductor Flash',
        reset: 'Restablecer',
        instructions: 'Instrucciones',
        flashUploadTitle: 'Subir archivo SWF',
        flashUploadDesc: 'Arrastra un juego Flash .swf aquí o haz clic para seleccionar',
        flashSelect: 'Seleccionar archivo SWF',
        flashHint: 'Los juegos Flash se juegan con teclado y ratón. En móvil, la jugabilidad depende del juego.',
        flashLoading: 'Cargando el reproductor Flash, espera...',
        flashLoadingTip: 'El primer inicio descarga ~14 MB de componentes, puede tardar un rato',
        flashPlaying: 'Reproduciendo: ',
        flashInvalid: 'Selecciona un archivo .swf',
        flashLoadError: 'No se pudo cargar el reproductor Flash',
        flashControlsTitle: 'Controles',
        flashRightClick: 'Clic derecho en la pantalla para abrir el menú del reproductor Flash',
        flashFullscreen: 'Pantalla completa',
        flashFullscreenDesc: 'Clic derecho en la pantalla del juego y elige "Pantalla completa"',
        exitFullscreen: 'Pulsa ESC para salir de pantalla completa',
        flashSoundTitle: 'Sonido',
        flashSoundDesc: 'Usa el icono de altavoz en el menú del reproductor (clic derecho) para activar el sonido',
        tabFile: 'Archivo',
        tabUrl: 'URL',
        tabSearch: 'Buscar Flash',
        urlTitle: 'Cargar SWF desde URL',
        urlDesc: 'Ingrese la URL directa de un archivo .swf',
        urlPlaceholder: 'https://example.com/game.swf',
        loadRom: 'Cargar SWF',
        urlTip: 'Consejo: Ingrese un enlace directo al archivo .swf. Los juegos que cargan archivos adicionales funcionan mejor desde su sitio original.',
        urlLoading: 'Descargando SWF desde URL...',
        urlInvalid: 'Por favor, ingrese una URL válida',
        urlFetchFailed: 'Error al descargar el archivo SWF. Verifique la URL.',
        urlFetchError: 'Error de red, no se puede descargar el archivo SWF.',
        urlPreset: 'Juegos Flash predefinidos:',
        searchTitle: 'Buscar juegos Flash',
        searchDesc: 'Buscar juegos Flash .swf en archive.org',
        searchPlaceholder: 'Ingrese el nombre del juego, ej: Pac-Man flash game',
        search: 'Buscar',
        searchDisclaimer: 'Resultados de archive.org. Algunos juegos Flash aún no están totalmente compatibles con Ruffle.',
        searchLoading: 'Buscando...',
        searchFailed: 'Búsqueda fallida. Inténtelo de nuevo.',
        searchNoResults: 'No se encontraron juegos coincidentes.',
        searchDownloading: 'Descargando:',
        searchDownloadFailed: 'Descarga fallida. Inténtelo de nuevo.',
        searchManualDownload: 'Descarga manual',
        searchManualTip: 'Descarga fallida. Haga clic en el enlace de arriba para descargar manualmente, luego use la carga de archivos para cargar el SWF.'
    },
    ru: {
        pageTitle: 'Flash-плеер',
        reset: 'Сброс',
        instructions: 'Инструкция',
        flashUploadTitle: 'Загрузить SWF-файл',
        flashUploadDesc: 'Перетащите Flash-игру .swf сюда или нажмите для выбора',
        flashSelect: 'Выбрать SWF-файл',
        flashHint: 'Flash-игры управляются клавиатурой и мышью. На мобильных устройствах играбельность зависит от игры.',
        flashLoading: 'Загрузка Flash-плеера, подождите...',
        flashLoadingTip: 'При первом запуске загружается около 14 МБ компонентов, это может занять время',
        flashPlaying: 'Воспроизводится: ',
        flashInvalid: 'Выберите файл .swf',
        flashLoadError: 'Не удалось загрузить Flash-плеер',
        flashControlsTitle: 'Управление',
        flashRightClick: 'Правый клик по экрану открывает меню Flash-плеера',
        flashFullscreen: 'Полный экран',
        flashFullscreenDesc: 'Правый клик по игровому экрану и выбор «Полный экран»',
        exitFullscreen: 'Нажмите ESC, чтобы выйти из полного экрана',
        flashSoundTitle: 'Звук',
        flashSoundDesc: 'Используйте значок динамика в меню плеера (правый клик), чтобы включить звук',
        tabFile: 'Файл',
        tabUrl: 'URL',
        tabSearch: 'Поиск Flash',
        urlTitle: 'Загрузить SWF по URL',
        urlDesc: 'Введите прямой URL файла .swf',
        urlPlaceholder: 'https://example.com/game.swf',
        loadRom: 'Загрузить SWF',
        urlTip: 'Совет: введите прямую ссылку на файл .swf. Игры, загружающие дополнительные файлы во время работы, лучше запускать с их исходного сайта.',
        urlLoading: 'Загрузка SWF по URL...',
        urlInvalid: 'Пожалуйста, введите корректный URL',
        urlFetchFailed: 'Ошибка загрузки SWF. Проверьте URL.',
        urlFetchError: 'Сетевая ошибка, невозможно загрузить файл SWF.',
        urlPreset: 'Предустановленные Flash-игры:',
        searchTitle: 'Поиск Flash-игр',
        searchDesc: 'Поиск .swf Flash-игр на archive.org',
        searchPlaceholder: 'Введите название игры, например: Pac-Man flash game',
        search: 'Поиск',
        searchDisclaimer: 'Результаты с archive.org. Некоторые Flash-игры ещё не полностью поддерживаются Ruffle.',
        searchLoading: 'Поиск...',
        searchFailed: 'Поиск не удался. Попробуйте позже.',
        searchNoResults: 'Подходящих игр не найдено.',
        searchDownloading: 'Загрузка:',
        searchDownloadFailed: 'Загрузка не удалась. Попробуйте снова.',
        searchManualDownload: 'Ручная загрузка',
        searchManualTip: 'Загрузка не удалась. Нажмите на ссылку выше, чтобы загрузить вручную, затем используйте загрузку файла для загрузки SWF.'
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

// Ruffle player state
var currentPlayer = null;
var currentObjectUrl = null;
var loadingOverlay = null;

function setOverlay(visible) {
    if (loadingOverlay) loadingOverlay.classList.toggle('hidden', !visible);
}

// Start playing a SWF from an object URL (shared by file upload / URL / search paths)
async function startSwf(objectUrl, name) {
    var container = document.getElementById('emulator');
    if (!container) return;

    // Tear down any previous player
    if (currentPlayer) {
        try { currentPlayer.remove(); } catch (e) { /* ignore */ }
        currentPlayer = null;
    }
    if (currentObjectUrl) {
        URL.revokeObjectURL(currentObjectUrl);
        currentObjectUrl = null;
    }

    if (!window.RufflePlayer || typeof window.RufflePlayer.newest !== 'function') {
        showToast(t('flashLoadError'));
        return;
    }

    console.log('Loading SWF:', name);

    var api = window.RufflePlayer.newest();
    var player = api.createPlayer();
    player.style.width = '100%';
    player.style.maxWidth = '800px';
    player.style.aspectRatio = '4 / 3';
    container.appendChild(player);
    currentPlayer = player;

    currentObjectUrl = objectUrl;
    setOverlay(true);

    // Switch to the player view like emulatorjs.html does: hide the upload
    // section (it fills a whole viewport) and jump back to the top so the
    // game appears right under the header instead of far down the page.
    var uploadSection = document.getElementById('uploadSection');
    if (uploadSection) uploadSection.classList.add('hidden');
    var resetBtn = document.getElementById('resetBtn');
    if (resetBtn) resetBtn.style.display = 'flex';
    window.scrollTo(0, 0);

    try {
        await player.ruffle().load({
            url: currentObjectUrl,
            allowScriptAccess: 'never',
            autoplay: 'on',
            letterbox: 'on'
        });
        showToast(t('flashPlaying') + name);
        console.log('SWF loaded successfully:', name);
    } catch (err) {
        console.error('Ruffle load failed:', err);
        showToast(t('flashLoadError'));
    } finally {
        setOverlay(false);
    }
}

// Load a local SWF file (file upload / drag & drop)
async function playSwf(file) {
    if (!/\.swf$/i.test(file.name)) {
        showToast(t('flashInvalid'));
        return;
    }
    startSwf(URL.createObjectURL(file), file.name);
}

// ---------------------------------------------------------------------------
// URL input & archive.org search support (ported from emulatorjs.js, with the
// ROM-specific bits swapped for SWF handling via Ruffle)
// ---------------------------------------------------------------------------

// CORS proxy chain from the unified ProxyConfig (Settings > Proxy Settings).
// corsmirror mangles binary bodies; hasBinaryCorruption() skips it automatically.
//
// getProxyPool() is called per request instead of once at load, so a proxy the
// health cache just demoted - or one the user just added in Settings - takes
// effect without a page reload. Each failover chain snapshots the array it
// started with, because the recursion indexes into it.
function getProxyPool() {
    return (typeof ProxyConfig !== 'undefined') ? ProxyConfig.getProxies() : [];
}

// Hosts that serve CORS headers (Access-Control-Allow-Origin: *) - SWFs from
// these hosts can be fetched directly without any proxy
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
// plain-text "error code: 522" body) so garbage is never fed into Ruffle
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
function hasBinaryCorruption(blob, target) {
    return new Promise(function(resolve) {
        var reader = new FileReader();
        reader.onload = function() {
            var bytes = new Uint8Array(reader.result || new ArrayBuffer(0));
            var hits = 0;
            for (var i = 0; i + 2 < bytes.length; i++) {
                if (bytes[i] === 0xEF && bytes[i + 1] === 0xBF && bytes[i + 2] === 0xBD) {
                    hits++;
                    if (hits >= 3) {
                        // Blame the proxy that delivered this exact body: the caller
                        // passes the URL it fetched, so two concurrent downloads can
                        // never accuse each other's proxy (see proxy-config.js).
                        if (typeof ProxyConfig !== 'undefined' && ProxyConfig.reportCorruptionFor) {
                            ProxyConfig.reportCorruptionFor(target);
                        }
                        resolve(true); return;
                    }
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
// re-downloading (and re-proxying) the same SWF. archive.org downloads have
// no CORS headers and depend entirely on public proxies, so caching matters.
var SWF_CACHE_NAME = 'ewtv-rom-cache-v2';

function cacheGetSwf(url) {
    if (!window.caches || !window.caches.open) return Promise.resolve(null);
    return window.caches.open(SWF_CACHE_NAME)
        .then(function(cache) { return cache.match(url); })
        .then(function(response) { return response ? response.blob() : null; })
        .catch(function() { return null; });
}

function cachePutSwf(url, blob) {
    if (!window.caches || !window.caches.open) return;
    window.caches.open(SWF_CACHE_NAME)
        .then(function(cache) {
            var headers = { 'Content-Type': blob.type || 'application/octet-stream' };
            return cache.put(url, new Response(blob, { headers: headers }));
        })
        .catch(function() { /* caching is best-effort; ignore failures */ });
}

// Hand a downloaded SWF blob to the player
function processSwfBlob(blob, filename) {
    clearUrlError();
    var urlLoadBtn = document.getElementById('urlLoadBtn');
    if (urlLoadBtn) urlLoadBtn.disabled = false;
    startSwf(URL.createObjectURL(blob), filename);
}

// Fetch a SWF: direct first for CORS-enabled hosts, then through CORS
// proxies, then a final direct attempt as last resort
// `pool` is threaded through the recursion so the proxy list stays stable for
// the whole chain; the top-level caller omits it and gets a fresh snapshot.
function tryFetchWithProxy(originalUrl, proxyIndex, filename, onFinalError, directTried, pool) {
    var urlLoadBtn = document.getElementById('urlLoadBtn');
    var corsProxies = pool || getProxyPool();
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
                return hasBinaryCorruption(blob, fetchUrl).then(function(corrupt) {
                    if (corrupt) {
                        throw new Error('Proxy corrupted the binary data (U+FFFD transcoding)');
                    }
                    return blob;
                });
            });
        })
        .then(function(blob) {
            console.log('SWF downloaded successfully (' + blob.size + ' bytes)');
            cachePutSwf(originalUrl, blob);
            processSwfBlob(blob, filename);
        })
        .catch(function(error) {
            clearTimeout(fetchTimer);
            console.log('Fetch attempt failed: ' + error.message);
            var nextProxy = proxyIndex < 0 ? 0 : proxyIndex + 1;
            if (nextProxy < corsProxies.length) {
                tryFetchWithProxy(originalUrl, nextProxy, filename, onFinalError, directTried, corsProxies);
            } else if (!directTried) {
                tryFetchWithProxy(originalUrl, nextProxy, filename, onFinalError, directTried, corsProxies);
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

// Handle SWF from a user-provided URL
function handleSwfFromUrl(url) {
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
        showToast(t('urlInvalid'));
        return;
    }

    var urlLoadBtn = document.getElementById('urlLoadBtn');
    urlLoadBtn.disabled = true;
    clearUrlError();
    showToast(t('urlLoading'));

    var filename = url.split('/').pop().split('?')[0] || 'game.swf';

    // Serve previously downloaded SWFs from Cache Storage (no network needed)
    cacheGetSwf(url).then(function(cachedBlob) {
        if (cachedBlob && cachedBlob.size > 0) {
            console.log('SWF served from cache (' + cachedBlob.size + ' bytes)');
            processSwfBlob(cachedBlob, filename);
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

// Search archive.org for .swf Flash games
function searchSwf(query) {
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

// Search on archive.org (same advancedsearch shape as emulatorjs.js)
function searchArchiveOrg(query) {
    var q = encodeURIComponent(query + ' mediatype:software');
    var url = 'https://archive.org/advancedsearch.php?q=' + q + '&fl=identifier,title,creator,year,downloads&rows=20&output=json';
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
function tryFetchJson(originalUrl, proxyIndex, pool) {
    var corsProxies = pool || getProxyPool();
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
                return tryFetchJson(originalUrl, nextProxy, corsProxies);
            }
            throw error;
        });
}

// Render search results
function renderSearchResults(data) {
    var resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '';

    var docs = data.response && data.response.docs ? data.response.docs : [];
    if (docs.length === 0) {
        resultsDiv.innerHTML = '<div class="search-empty">' + t('searchNoResults') + '</div>';
        return;
    }

    docs.forEach(function(doc) {
        var item = document.createElement('div');
        item.className = 'search-result-item';

        var title = doc.title || doc.identifier || 'Unknown';
        var creator = doc.creator ? doc.creator[0] : '';
        var year = doc.year || '';
        var downloads = doc.downloads || 0;

        var metaHtml = '';
        if (creator) metaHtml += '<span>' + escapeHtml(creator) + '</span>';
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

// Select a search result and get its .swf files
function selectSearchResult(identifier, title) {
    var resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '<div class="search-loading">' + t('searchDownloading') + ' ' + escapeHtml(title) + '</div>';

    var metaUrl = 'https://archive.org/metadata/' + encodeURIComponent(identifier);

    tryFetchJson(metaUrl, 0)
        .then(function(meta) {
            var swfFile = findSwfFile(meta);
            if (!swfFile) {
                resultsDiv.innerHTML = '<div class="search-error">' + t('searchNoResults') + '</div>';
                return;
            }
            var downloadUrl = 'https://archive.org/download/' + encodeURIComponent(identifier) + '/' + encodeURIComponent(swfFile.name);
            downloadAndLoadSwf(downloadUrl, swfFile.name);
        })
        .catch(function(err) {
            console.error('Metadata fetch failed:', err);
            resultsDiv.innerHTML = '<div class="search-error">' + t('searchDownloadFailed') + '</div>';
        });
}

// Find the best .swf file from archive.org metadata
function findSwfFile(meta) {
    if (!meta.files || meta.files.length === 0) return null;

    var candidates = meta.files.filter(function(f) {
        var name = f.name || '';
        return name.toLowerCase().endsWith('.swf');
    });

    if (candidates.length === 0) return null;

    // Prefer largest file (most likely to be the complete game)
    candidates.sort(function(a, b) {
        return (b.size || 0) - (a.size || 0);
    });

    return candidates[0];
}

// Download SWF and load it
function downloadAndLoadSwf(url, filename) {
    var resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '<div class="search-loading">' + t('searchDownloading') + ' ' + escapeHtml(filename) + '</div>';

    cacheGetSwf(url).then(function(cachedBlob) {
        if (cachedBlob && cachedBlob.size > 0) {
            console.log('SWF served from cache (' + cachedBlob.size + ' bytes)');
            processSwfBlob(cachedBlob, filename);
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
        window.location.href = 'game.html';
    });

    // Reset button - back to the SWF selection screen with a fresh player
    // (full reload, same behavior as the emulator page)
    document.getElementById('resetBtn').addEventListener('click', function() {
        window.location.reload();
    });

    // File selection
    var swfInput = document.getElementById('swfInput');
    var uploadBtn = document.getElementById('uploadBtn');
    uploadBtn.addEventListener('click', function() {
        swfInput.click();
    });
    swfInput.addEventListener('change', function() {
        var f = this.files && this.files[0];
        if (f) playSwf(f);
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
        if (f) playSwf(f);
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
        handleSwfFromUrl(url);
    });

    // Preset SWF select
    document.getElementById('romPresetSelect').addEventListener('change', function() {
        var url = this.value.trim();
        if (url) {
            document.getElementById('romUrlInput').value = url;
            handleSwfFromUrl(url);
        }
    });

    // URL input Enter key
    document.getElementById('romUrlInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            var url = this.value.trim();
            handleSwfFromUrl(url);
        }
    });

    // Search button + Enter key
    document.getElementById('romSearchBtn').addEventListener('click', function() {
        var query = document.getElementById('romSearchInput').value.trim();
        searchSwf(query);
    });
    document.getElementById('romSearchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            var query = this.value.trim();
            searchSwf(query);
        }
    });

    // Preset Flash games from data/roms/flash.json (group hidden when empty/missing)
    var presetCache = null;
    (function loadPresetOptions() {
        var select = document.getElementById('romPresetSelect');
        if (!select) return;
        var presetGroup = select.closest ? select.closest('.url-preset-group') : null;
        fetch('../data/roms/flash.json')
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }
                return response.json();
            })
            .then(function(data) {
                presetCache = data;
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

