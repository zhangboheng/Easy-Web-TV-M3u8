// EmulatorJS Page JavaScript

// Internationalization
var i18n = {
    zh: {
        save: '存档',
        load: '读档',
        fullscreen: '全屏',
        reset: '重置',
        uploadTitle: '上传 ROM 文件',
        uploadDesc: '拖拽 ROM 文件到此处或点击选择',
        selectRom: '选择 ROM 文件',
        selectCore: '选择模拟器核心：',
        loading: '正在加载游戏，请稍候...',
        loadingTip: '这可能需要几秒钟',
        instructions: '使用说明',
        keyboardControls: '键盘控制',
        arrowKeys: '方向键',
        move: '移动',
        aButton: 'A 键',
        bButton: 'B 键',
        xButton: 'X 键',
        yButton: 'Y 键',
        start: '开始键',
        select: '选择键',
        gamepadSupport: '手柄支持',
        gamepadDesc: '自动检测 USB 手柄',
        gamepadMapping: '支持标准按键映射',
        gamepadTip: '请在加载游戏前连接手柄',
        saveLoadTitle: '存档/读档',
        saveDesc: '点击"存档"保存进度',
        loadDesc: '点击"读档"加载进度',
        slotsDesc: '提供 5 个存档槽位',
        storageDesc: '存档保存在浏览器中',
        fullscreenTitle: '全屏模式',
        fullscreenDesc: '点击"全屏"按钮进入',
        exitFullscreen: '按 ESC 退出全屏',
        browserFullscreen: '浏览器全屏',
        saveGame: '保存游戏',
        loadGame: '加载游戏',
        slot: '槽位',
        empty: '空',
        noGame: '没有运行中的游戏！',
        savedToSlot: '已保存到槽位',
        loadedFromSlot: '已从槽位加载',
        noSaveInSlot: '该槽位没有存档',
        slotDeleted: '槽位已删除！',
        saveFailed: '保存失败：',
        loadFailed: '加载失败：',
        deleteFailed: '删除失败：',
        loadEmulatorFailed: '加载模拟器失败，请检查网络连接。',
        settings: '设置',
        gamepadSettings: '手柄设置',
        gamepadSettingsDesc: '点击设置按钮，在弹出的面板中选择 "Gamepad" 进行按键配置',
        pressGamepadBtn: '按下任意手柄按键激活',
        clickGameToFocus: '点击游戏画面以获取焦点',
        gamepadDetected: '检测到 {n} 个手柄',
        noGamepadDetected: '未检测到手柄',
        gamepadConnected: '手柄已连接：',
        gamepadDisconnected: '手柄已断开',
        gamepadIndex: '索引',
        test: '测试',
        gamepadTest: '手柄测试',
        clickGearIcon: '请点击模拟器控制栏中的齿轮图标（⚙）打开设置',
        gameNotLoaded: '游戏尚未加载',
        tabFile: '文件上传',
        tabUrl: 'URL 输入',
        tabSearch: '搜索 ROM',
        urlTitle: '从 URL 加载 ROM',
        urlDesc: '输入 ROM 文件的直接链接地址',
        urlPlaceholder: 'https://example.com/game.nes',
        loadRom: '加载 ROM',
        urlTip: '提示：请输入 ROM 文件的直接下载链接，确保 URL 指向可下载的文件。',
        urlLoading: '正在从 URL 下载 ROM...',
        urlInvalid: '请输入有效的 URL 地址',
        urlFetchFailed: '下载 ROM 文件失败，请检查 URL 是否正确。',
        urlFetchError: '网络错误，无法下载 ROM 文件。',
        searchTitle: '搜索 ROM',
        searchDesc: '在 archive.org 中搜索游戏 ROM',
        searchPlaceholder: '输入游戏名称，例如 Super Mario Bros',
        search: '搜索',
        searchDisclaimer: '结果来自 archive.org，下载前请确认您拥有原始卡带/光盘。',
        searchLoading: '正在搜索...',
        searchFailed: '搜索失败，请稍后再试。',
        searchNoResults: '未找到匹配的游戏。',
        searchDownloading: '正在下载：',
        searchDownloadFailed: '下载失败，请重试。',
        searchManualDownload: '手动下载',
        searchManualTip: '下载失败，请点击上方链接手动下载，然后用文件上传加载 ROM。',
        searchSource: '搜索源：',
        urlPreset: '预设 ROM：',
        biosMissing: '缺少 NeoGeo BIOS，街机游戏无法启动。请将 neogeo.zip 放入 routes/bios/ 目录后刷新重试。',
        biosDownloaded: '已自动获取 NeoGeo BIOS'
    },
    en: {
        save: 'Save',
        load: 'Load',
        fullscreen: 'Fullscreen',
        reset: 'Reset',
        uploadTitle: 'Upload ROM File',
        uploadDesc: 'Drag and drop your ROM file here or click to select',
        selectRom: 'Select ROM File',
        selectCore: 'Select Emulator Core:',
        loading: 'Loading game, please wait...',
        loadingTip: 'This may take a few seconds',
        instructions: 'Instructions',
        keyboardControls: 'Keyboard Controls',
        arrowKeys: 'Arrow Keys',
        move: 'Move',
        aButton: 'A Button',
        bButton: 'B Button',
        xButton: 'X Button',
        yButton: 'Y Button',
        start: 'Start',
        select: 'Select',
        gamepadSupport: 'Gamepad Support',
        gamepadDesc: 'USB gamepads are automatically detected',
        gamepadMapping: 'Standard mapping is supported',
        gamepadTip: 'Connect gamepad before loading game',
        saveLoadTitle: 'Save & Load',
        saveDesc: 'Click "Save" to save progress',
        loadDesc: 'Click "Load" to load progress',
        slotsDesc: '5 save slots available',
        storageDesc: 'Saves stored in browser',
        fullscreenTitle: 'Fullscreen',
        fullscreenDesc: 'Click "Fullscreen" button to enter',
        exitFullscreen: 'Press ESC to exit fullscreen',
        browserFullscreen: 'Browser fullscreen',
        saveGame: 'Save Game',
        loadGame: 'Load Game',
        slot: 'Slot',
        empty: 'Empty',
        noGame: 'No game running!',
        savedToSlot: 'Saved to Slot',
        loadedFromSlot: 'Loaded from Slot',
        noSaveInSlot: 'No save found in this slot',
        slotDeleted: 'Slot deleted!',
        saveFailed: 'Save failed: ',
        loadFailed: 'Load failed: ',
        deleteFailed: 'Delete failed: ',
        loadEmulatorFailed: 'Failed to load emulator. Please check your network.',
        settings: 'Settings',
        gamepadSettings: 'Gamepad Settings',
        gamepadSettingsDesc: 'Click Settings button, then select "Gamepad" to configure buttons',
        pressGamepadBtn: 'Press any gamepad button to activate',
        clickGameToFocus: 'Click game screen to get focus',
        gamepadDetected: '{n} gamepad(s) detected',
        noGamepadDetected: 'No gamepad detected',
        gamepadConnected: 'Gamepad connected: ',
        gamepadDisconnected: 'Gamepad disconnected',
        gamepadIndex: 'Index',
        test: 'Test',
        gamepadTest: 'Gamepad Test',
        clickGearIcon: 'Please click the gear icon (⚙) in the emulator controls to open settings',
        gameNotLoaded: 'Game not loaded yet',
        tabFile: 'File Upload',
        tabUrl: 'URL Input',
        tabSearch: 'Search ROM',
        urlTitle: 'Load ROM from URL',
        urlDesc: 'Enter the direct URL of a ROM file to load',
        urlPlaceholder: 'https://example.com/game.nes',
        loadRom: 'Load ROM',
        urlTip: 'Tip: Enter a direct link to the ROM file. Make sure the URL points to a downloadable file.',
        urlLoading: 'Downloading ROM from URL...',
        urlInvalid: 'Please enter a valid URL',
        urlFetchFailed: 'Failed to download ROM file. Please check the URL.',
        urlFetchError: 'Network error, unable to download ROM file.',
        searchTitle: 'Search ROMs',
        searchDesc: 'Search archive.org for game ROMs',
        searchPlaceholder: 'Enter game name, e.g. Super Mario Bros',
        search: 'Search',
        searchDisclaimer: 'Results from archive.org. Ensure you own the original cartridge/disc before downloading.',
        searchLoading: 'Searching...',
        searchFailed: 'Search failed. Please try again later.',
        searchNoResults: 'No matching games found.',
        searchDownloading: 'Downloading:',
        searchDownloadFailed: 'Download failed. Please try again.',
        searchManualDownload: 'Manual download',
        searchManualTip: 'Download failed. Click the link above to download manually, then use File Upload to load the ROM.',
        searchSource: 'Search Source:',
        urlPreset: 'Preset ROMs:',
        biosMissing: 'NeoGeo BIOS is missing. Arcade games cannot start. Please place neogeo.zip in the routes/bios/ folder and refresh.',
        biosDownloaded: 'NeoGeo BIOS downloaded automatically'
    },
    ja: {
        save: 'セーブ',
        load: 'ロード',
        fullscreen: '全画面',
        uploadTitle: 'ROMファイルをアップロード',
        uploadDesc: 'ROMファイルをドラッグ＆ドロップするか、クリックして選択',
        selectRom: 'ROMファイルを選択',
        selectCore: 'エミュレータコアを選択：',
        loading: 'ゲームを読み込んでいます...',
        loadingTip: '数秒かかる場合があります',
        instructions: '操作説明',
        keyboardControls: 'キーボード操作',
        arrowKeys: '矢印キー',
        move: '移動',
        aButton: 'Aボタン',
        bButton: 'Bボタン',
        xButton: 'Xボタン',
        yButton: 'Yボタン',
        start: 'スタート',
        select: 'セレクト',
        gamepadSupport: 'ゲームパッド対応',
        gamepadDesc: 'USBゲームパッドを自動検出',
        gamepadMapping: '標準マッピングに対応',
        gamepadTip: 'ゲーム読み込み前にゲームパッドを接続',
        saveLoadTitle: 'セーブ＆ロード',
        saveDesc: '「セーブ」をクリックして進行状況を保存',
        loadDesc: '「ロード」をクリックして進行状況を読み込み',
        slotsDesc: '5つのセーブスロットが利用可能',
        storageDesc: 'セーブはブラウザに保存',
        fullscreenTitle: '全画面モード',
        fullscreenDesc: '「全画面」ボタンをクリック',
        exitFullscreen: 'ESCキーで全画面終了',
        browserFullscreen: 'ブラウザ全画面',
        saveGame: 'ゲームをセーブ',
        loadGame: 'ゲームをロード',
        slot: 'スロット',
        empty: '空',
        noGame: '実行中のゲームがありません！',
        savedToSlot: 'スロットに保存しました',
        loadedFromSlot: 'スロットから読み込みました',
        noSaveInSlot: 'このスロットにセーブがありません',
        slotDeleted: 'スロットを削除しました！',
        saveFailed: 'セーブ失敗：',
        loadFailed: 'ロード失敗：',
        deleteFailed: '削除失敗：',
        loadEmulatorFailed: 'エミュレータの読み込みに失敗しました。ネットワークを確認してください。',
        settings: '設定',
        gamepadSettings: 'ゲームパッド設定',
        gamepadSettingsDesc: '設定ボタンをクリックし、「Gamepad」を選択してボタンを設定',
        pressGamepadBtn: 'ゲームパッドのボタンを押してアクティブ化',
        clickGameToFocus: 'ゲーム画面をクリックしてフォーカス',
        gamepadDetected: '{n}個のゲームパッドを検出',
        noGamepadDetected: 'ゲームパッドが検出されません',
        gamepadConnected: 'ゲームパッド接続：',
        gamepadDisconnected: 'ゲームパッド切断',
        gamepadIndex: 'インデックス',
        test: 'テスト',
        gamepadTest: 'ゲームパッドテスト',
        clickGearIcon: 'エミュレータコントロールのギアアイコン（⚙）をクリックして設定を開く',
        gameNotLoaded: 'ゲームがまだ読み込まれていません',
        tabFile: 'ファイルアップロード',
        tabUrl: 'URL入力',
        tabSearch: 'ROM検索',
        urlTitle: 'URLからROMを読み込む',
        urlDesc: 'ROMファイルの直接URLを入力',
        urlPlaceholder: 'https://example.com/game.nes',
        loadRom: 'ROMを読み込む',
        urlTip: 'ヒント：ROMファイルの直接ダウンロードリンクを入力してください。',
        urlLoading: 'URLからROMをダウンロード中...',
        urlInvalid: '有効なURLを入力してください',
        urlFetchFailed: 'ROMファイルのダウンロードに失敗しました。URLを確認してください。',
        urlFetchError: 'ネットワークエラー、ROMファイルをダウンロードできません。',
        searchTitle: 'ROM検索',
        searchDesc: 'archive.orgでゲームROMを検索',
        searchPlaceholder: 'ゲーム名を入力（例：Super Mario Bros）',
        search: '検索',
        searchDisclaimer: 'archive.orgの検索結果です。ダウンロード前にオリジナルカートリッジ/ディスクの所有を確認してください。',
        searchLoading: '検索中...',
        searchFailed: '検索に失敗しました。後でもう一度お試しください。',
        searchNoResults: '一致するゲームが見つかりませんでした。',
        searchDownloading: 'ダウンロード中：',
        searchDownloadFailed: 'ダウンロードに失敗しました。',
        searchManualDownload: '手動ダウンロード',
        searchManualTip: 'ダウンロードに失敗しました。上のリンクをクリックして手動でダウンロードし、ファイルアップロードでROMを読み込んでください。',
        searchSource: '検索元：',
        urlPreset: 'ROMプリセット：',
        biosMissing: 'NeoGeo BIOS がありません。アーケードゲームを起動できません。routes/bios/ フォルダに neogeo.zip を配置して再読み込みしてください。',
        biosDownloaded: 'NeoGeo BIOS を自動取得しました'
    },
    ko: {
        save: '저장',
        load: '불러오기',
        fullscreen: '전체화면',
        uploadTitle: 'ROM 파일 업로드',
        uploadDesc: 'ROM 파일을 드래그 앤 드롭하거나 클릭하여 선택',
        selectRom: 'ROM 파일 선택',
        selectCore: '에뮬레이터 코어 선택：',
        loading: '게임을 불러오는 중...',
        loadingTip: '몇 초 정도 걸릴 수 있습니다',
        instructions: '사용 설명',
        keyboardControls: '키보드 조작',
        arrowKeys: '방향키',
        move: '이동',
        aButton: 'A 버튼',
        bButton: 'B 버튼',
        xButton: 'X 버튼',
        yButton: 'Y 버튼',
        start: '시작',
        select: '선택',
        gamepadSupport: '게임패드 지원',
        gamepadDesc: 'USB 게임패드 자동 감지',
        gamepadMapping: '표준 매핑 지원',
        gamepadTip: '게임 로드 전에 게임패드 연결',
        saveLoadTitle: '저장 & 불러오기',
        saveDesc: '"저장"을 클릭하여 진행 상황 저장',
        loadDesc: '"불러오기"를 클릭하여 진행 상황 불러오기',
        slotsDesc: '5개의 저장 슬롯 사용 가능',
        storageDesc: '저장은 브라우저에 저장됨',
        fullscreenTitle: '전체화면 모드',
        fullscreenDesc: '"전체화면" 버튼을 클릭',
        exitFullscreen: 'ESC 키로 전체화면 종료',
        browserFullscreen: '브라우저 전체화면',
        saveGame: '게임 저장',
        loadGame: '게임 불러오기',
        slot: '슬롯',
        empty: '비어있음',
        noGame: '실행 중인 게임이 없습니다！',
        savedToSlot: '슬롯에 저장됨',
        loadedFromSlot: '슬롯에서 불러옴',
        noSaveInSlot: '이 슬롯에 저장된 데이터가 없습니다',
        slotDeleted: '슬롯이 삭제되었습니다！',
        saveFailed: '저장 실패：',
        loadFailed: '불러오기 실패：',
        deleteFailed: '삭제 실패：',
        loadEmulatorFailed: '에뮬레이터 로드 실패. 네트워크 연결을 확인하세요.',
        settings: '설정',
        gamepadSettings: '게임패드 설정',
        gamepadSettingsDesc: '설정 버튼을 클릭하고 "Gamepad"를 선택하여 버튼 구성',
        pressGamepadBtn: '게임패드 버튼을 눌러 활성화',
        clickGameToFocus: '게임 화면을 클릭하여 포커스',
        gamepadDetected: '{n}개의 게임패드 감지',
        noGamepadDetected: '게임패드가 감지되지 않음',
        gamepadConnected: '게임패드 연결됨：',
        gamepadDisconnected: '게임패드 연결 해제',
        gamepadIndex: '인덱스',
        test: '테스트',
        gamepadTest: '게임패드 테스트',
        clickGearIcon: '에뮬레이터 컨트롤의 기어 아이콘（⚙）을 클릭하여 설정 열기',
        gameNotLoaded: '게임이 아직 로드되지 않음',
        tabFile: '파일 업로드',
        tabUrl: 'URL 입력',
        tabSearch: 'ROM 검색',
        urlTitle: 'URL에서 ROM 로드',
        urlDesc: 'ROM 파일의 직접 URL을 입력',
        urlPlaceholder: 'https://example.com/game.nes',
        loadRom: 'ROM 로드',
        urlTip: '提示：ROM 파일의 직접 다운로드 링크를 입력하세요.',
        urlLoading: 'URL에서 ROM 다운로드 중...',
        urlInvalid: '유효한 URL을 입력하세요',
        urlFetchFailed: 'ROM 파일 다운로드 실패. URL을 확인하세요.',
        urlFetchError: '네트워크 오류, ROM 파일을 다운로드할 수 없습니다.',
        searchTitle: 'ROM 검색',
        searchDesc: 'archive.org에서 게임 ROM 검색',
        searchPlaceholder: '게임 이름 입력 (예: Super Mario Bros)',
        search: '검색',
        searchDisclaimer: 'archive.org 검색 결과입니다. 다운로드 전 원본 카트리지/디스크 소유권을 확인하세요.',
        searchLoading: '검색 중...',
        searchFailed: '검색 실패. 나중에 다시 시도하세요.',
        searchNoResults: '일치하는 게임을 찾을 수 없습니다.',
        searchDownloading: '다운로드 중:',
        searchDownloadFailed: '다운로드 실패. 다시 시도하세요.',
        searchManualDownload: '수동 다운로드',
        searchManualTip: '다운로드 실패. 위 링크를 클릭하여 수동으로 다운로드한 후 파일 업로드로 ROM을 로드하세요.',
        searchSource: '검색 소스：',
        urlPreset: 'ROM 프리셋:',
        biosMissing: 'NeoGeo BIOS가 없어 아케이드 게임을 시작할 수 없습니다. routes/bios/ 폴더에 neogeo.zip을 넣고 새로고침하세요.',
        biosDownloaded: 'NeoGeo BIOS를 자동으로 가져왔습니다'
    },
    fr: {
        save: 'Sauvegarder',
        load: 'Charger',
        fullscreen: 'Plein écran',
        uploadTitle: 'Télécharger un fichier ROM',
        uploadDesc: 'Glissez-déposez votre fichier ROM ici ou cliquez pour sélectionner',
        selectRom: 'Sélectionner un fichier ROM',
        selectCore: 'Sélectionner le cœur de l\'émulateur：',
        loading: 'Chargement du jeu en cours...',
        loadingTip: 'Cela peut prendre quelques secondes',
        instructions: 'Instructions',
        keyboardControls: 'Contrôles clavier',
        arrowKeys: 'Touches fléchées',
        move: 'Déplacer',
        aButton: 'Bouton A',
        bButton: 'Bouton B',
        xButton: 'Bouton X',
        yButton: 'Bouton Y',
        start: 'Start',
        select: 'Select',
        gamepadSupport: 'Support manette',
        gamepadDesc: 'Les manettes USB sont détectées automatiquement',
        gamepadMapping: 'Mappage standard pris en charge',
        gamepadTip: 'Connectez la manette avant de charger le jeu',
        saveLoadTitle: 'Sauvegarder & Charger',
        saveDesc: 'Cliquez sur "Sauvegarder" pour enregistrer',
        loadDesc: 'Cliquez sur "Charger" pour restaurer',
        slotsDesc: '5 emplacements de sauvegarde disponibles',
        storageDesc: 'Sauvegardes stockées dans le navigateur',
        fullscreenTitle: 'Mode plein écran',
        fullscreenDesc: 'Cliquez sur "Plein écran"',
        exitFullscreen: 'Appuyez sur Échap pour quitter',
        browserFullscreen: 'Plein écran du navigateur',
        saveGame: 'Sauvegarder le jeu',
        loadGame: 'Charger le jeu',
        slot: 'Emplacement',
        empty: 'Vide',
        noGame: 'Aucun jeu en cours！',
        savedToSlot: 'Sauvegardé dans l\'emplacement',
        loadedFromSlot: 'Chargé depuis l\'emplacement',
        noSaveInSlot: 'Aucune sauvegarde dans cet emplacement',
        slotDeleted: 'Emplacement supprimé！',
        saveFailed: 'Échec de la sauvegarde：',
        loadFailed: 'Échec du chargement：',
        deleteFailed: 'Échec de la suppression：',
        loadEmulatorFailed: 'Échec du chargement de l\'émulateur. Vérifiez votre réseau.',
        settings: 'Paramètres',
        gamepadSettings: 'Paramètres manette',
        gamepadSettingsDesc: 'Cliquez sur Paramètres, puis "Gamepad" pour configurer',
        pressGamepadBtn: 'Appuyez sur un bouton pour activer',
        clickGameToFocus: 'Cliquez sur le jeu pour obtenir le focus',
        gamepadDetected: '{n} manette(s) détectée(s)',
        noGamepadDetected: 'Aucune manette détectée',
        gamepadConnected: 'Manette connectée：',
        gamepadDisconnected: 'Manette déconnectée',
        gamepadIndex: 'Index',
        test: 'Test',
        gamepadTest: 'Test manette',
        clickGearIcon: 'Cliquez sur l\'icône engrenage（⚙）dans les contrôles pour ouvrir les paramètres',
        gameNotLoaded: 'Jeu pas encore chargé',
        tabFile: 'Fichier',
        tabUrl: 'URL',
        urlTitle: 'Charger ROM depuis URL',
        urlDesc: 'Entrez l\'URL directe d\'un fichier ROM',
        urlPlaceholder: 'https://example.com/game.nes',
        loadRom: 'Charger ROM',
        urlTip: 'Conseil : Entrez un lien direct vers le fichier ROM.',
        urlLoading: 'Téléchargement du ROM depuis l\'URL...',
        urlInvalid: 'Veuillez entrer une URL valide',
        urlFetchFailed: 'Échec du téléchargement du ROM. Vérifiez l\'URL.',
        urlFetchError: 'Erreur réseau, impossible de télécharger le ROM.',
        searchTitle: 'Rechercher ROM',
        searchDesc: 'Rechercher des ROMs sur archive.org',
        searchPlaceholder: 'Entrez le nom du jeu, ex: Super Mario Bros',
        search: 'Rechercher',
        searchDisclaimer: "Résultats de archive.org. Assurez-vous de posséder la cartouche/disque original.",
        searchLoading: 'Recherche en cours...',
        searchFailed: 'Recherche échouée. Veuillez réessayer.',
        searchNoResults: 'Aucun jeu correspondant trouvé.',
        searchDownloading: 'Téléchargement:',
        searchDownloadFailed: 'Téléchargement échoué. Réessayez.',
        searchManualDownload: 'Téléchargement manuel',
        searchManualTip: 'Échec du téléchargement. Cliquez sur le lien ci-dessus pour télécharger manuellement, puis utilisez le téléchargement de fichier pour charger le ROM.',
        searchSource: 'Source de recherche:',
        urlPreset: 'ROM prédéfinis :',
        biosMissing: 'Le BIOS NeoGeo est manquant, les jeux d\'arcade ne peuvent pas démarrer. Placez neogeo.zip dans le dossier routes/bios/ puis actualisez.',
        biosDownloaded: 'BIOS NeoGeo téléchargé automatiquement'
    },
    de: {
        save: 'Speichern',
        load: 'Laden',
        fullscreen: 'Vollbild',
        uploadTitle: 'ROM-Datei hochladen',
        uploadDesc: 'Ziehen Sie Ihre ROM-Datei hierher oder klicken Sie zum Auswählen',
        selectRom: 'ROM-Datei auswählen',
        selectCore: 'Emulator-Kern auswählen：',
        loading: 'Spiel wird geladen...',
        loadingTip: 'Dies kann einige Sekunden dauern',
        instructions: 'Anleitung',
        keyboardControls: 'Tastatursteuerung',
        arrowKeys: 'Pfeiltasten',
        move: 'Bewegen',
        aButton: 'A-Taste',
        bButton: 'B-Taste',
        xButton: 'X-Taste',
        yButton: 'Y-Taste',
        start: 'Start',
        select: 'Select',
        gamepadSupport: 'Gamepad-Unterstützung',
        gamepadDesc: 'USB-Gamepads werden automatisch erkannt',
        gamepadMapping: 'Standard-Mapping wird unterstützt',
        gamepadTip: 'Gamepad vor dem Laden verbinden',
        saveLoadTitle: 'Speichern & Laden',
        saveDesc: 'Klicken Sie auf "Speichern" zum Speichern',
        loadDesc: 'Klicken Sie auf "Laden" zum Laden',
        slotsDesc: '5 Speicherplätze verfügbar',
        storageDesc: 'Speicherstände im Browser gespeichert',
        fullscreenTitle: 'Vollbildmodus',
        fullscreenDesc: 'Klicken Sie auf "Vollbild"',
        exitFullscreen: 'Drücken Sie ESC zum Beenden',
        browserFullscreen: 'Browser-Vollbild',
        saveGame: 'Spiel speichern',
        loadGame: 'Spiel laden',
        slot: 'Slot',
        empty: 'Leer',
        noGame: 'Kein Spiel läuft！',
        savedToSlot: 'Gespeichert in Slot',
        loadedFromSlot: 'Geladen aus Slot',
        noSaveInSlot: 'Kein Speicherstand in diesem Slot',
        slotDeleted: 'Slot gelöscht！',
        saveFailed: 'Speichern fehlgeschlagen：',
        loadFailed: 'Laden fehlgeschlagen：',
        deleteFailed: 'Löschen fehlgeschlagen：',
        loadEmulatorFailed: 'Emulator konnte nicht geladen werden. Bitte Netzwerk prüfen.',
        settings: 'Einstellungen',
        gamepadSettings: 'Gamepad-Einstellungen',
        gamepadSettingsDesc: 'Klicken Sie auf Einstellungen, dann "Gamepad"',
        pressGamepadBtn: 'Drücken Sie eine Gamepad-Taste',
        clickGameToFocus: 'Klicken Sie auf das Spiel für Focus',
        gamepadDetected: '{n} Gamepad(s) erkannt',
        noGamepadDetected: 'Kein Gamepad erkannt',
        gamepadConnected: 'Gamepad verbunden：',
        gamepadDisconnected: 'Gamepad getrennt',
        gamepadIndex: 'index',
        test: 'Test',
        gamepadTest: 'Gamepad-Test',
        clickGearIcon: 'Klicken Sie auf das Zahnrad-Symbol（⚙）in den Steuerelementen',
        gameNotLoaded: 'Spiel noch nicht geladen',
        tabFile: 'Datei',
        tabUrl: 'URL',
        urlTitle: 'ROM von URL laden',
        urlDesc: 'Geben Sie die direkte URL einer ROM-Datei ein',
        urlPlaceholder: 'https://example.com/game.nes',
        loadRom: 'ROM laden',
        urlTip: 'Tipp: Geben Sie einen direkten Link zur ROM-Datei ein.',
        urlLoading: 'ROM wird von URL heruntergeladen...',
        urlInvalid: 'Bitte geben Sie eine gültige URL ein',
        urlFetchFailed: 'ROM-Download fehlgeschlagen. Bitte URL prüfen.',
        urlFetchError: 'Netzwerkfehler, ROM kann nicht heruntergeladen werden.',
        searchTitle: 'ROM suchen',
        searchDesc: 'Durchsuchen Sie archive.org nach ROMs',
        searchPlaceholder: 'Spielnamen eingeben, z.B. Super Mario Bros',
        search: 'Suchen',
        searchDisclaimer: 'Ergebnisse von archive.org. Stellen Sie sicher, dass Sie die Originalkassette/Disk besitzen.',
        searchLoading: 'Suche läuft...',
        searchFailed: 'Suche fehlgeschlagen. Bitte versuchen Sie es später.',
        searchNoResults: 'Keine passenden Spiele gefunden.',
        searchDownloading: 'Herunterladen:',
        searchDownloadFailed: 'Download fehlgeschlagen. Bitte versuchen Sie es erneut.',
        searchManualDownload: 'Manueller Download',
        searchManualTip: 'Download fehlgeschlagen. Klicken Sie auf den Link oben zum manuellen Download, dann laden Sie das ROM über Datei-Upload.',
        searchSource: 'Suchquelle:',
        urlPreset: 'ROM-Vorlagen:',
        biosMissing: 'NeoGeo-BIOS fehlt, Arcade-Spiele können nicht starten. Legen Sie neogeo.zip in den Ordner routes/bios/ und aktualisieren Sie die Seite.',
        biosDownloaded: 'NeoGeo-BIOS automatisch geladen'
    },
    es: {
        save: 'Guardar',
        load: 'Cargar',
        fullscreen: 'Pantalla completa',
        uploadTitle: 'Subir archivo ROM',
        uploadDesc: 'Arrastra y suelta tu archivo ROM aquí o haz clic para seleccionar',
        selectRom: 'Seleccionar archivo ROM',
        selectCore: 'Seleccionar núcleo del emulador：',
        loading: 'Cargando juego...',
        loadingTip: 'Esto puede tomar unos segundos',
        instructions: 'Instrucciones',
        keyboardControls: 'Controles del teclado',
        arrowKeys: 'Teclas de flecha',
        move: 'Mover',
        aButton: 'Botón A',
        bButton: 'Botón B',
        xButton: 'Botón X',
        yButton: 'Botón Y',
        start: 'Start',
        select: 'Select',
        gamepadSupport: 'Soporte de mando',
        gamepadDesc: 'Los mandos USB se detectan automáticamente',
        gamepadMapping: 'Mapeo estándar soportado',
        gamepadTip: 'Conecta el mando antes de cargar el juego',
        saveLoadTitle: 'Guardar y Cargar',
        saveDesc: 'Haz clic en "Guardar" para guardar',
        loadDesc: 'Haz clic en "Cargar" para cargar',
        slotsDesc: '5 ranuras de guardado disponibles',
        storageDesc: 'Guardados almacenados en el navegador',
        fullscreenTitle: 'Modo pantalla completa',
        fullscreenDesc: 'Haz clic en "Pantalla completa"',
        exitFullscreen: 'Presiona ESC para salir',
        browserFullscreen: 'Pantalla completa del navegador',
        saveGame: 'Guardar juego',
        loadGame: 'Cargar juego',
        slot: 'Ranura',
        empty: 'Vacío',
        noGame: '¡No hay juego en ejecución！',
        savedToSlot: 'Guardado en ranura',
        loadedFromSlot: 'Cargado desde ranura',
        noSaveInSlot: 'No hay guardado en esta ranura',
        slotDeleted: '¡Ranura eliminada！',
        saveFailed: 'Error al guardar：',
        loadFailed: 'Error al cargar：',
        deleteFailed: 'Error al eliminar：',
        loadEmulatorFailed: 'Error al cargar el emulador. Verifica tu conexión.',
        settings: 'Configuración',
        gamepadSettings: 'Configuración de mando',
        gamepadSettingsDesc: 'Haz clic en Configuración, luego "Gamepad"',
        pressGamepadBtn: 'Presiona un botón del mando',
        clickGameToFocus: 'Haz clic en el juego para enfocar',
        gamepadDetected: '{n} mando(s) detectado(s)',
        noGamepadDetected: 'Ningún mando detectado',
        gamepadConnected: 'Mando conectado：',
        gamepadDisconnected: 'Mando desconectado',
        gamepadIndex: 'Índice',
        test: 'Prueba',
        gamepadTest: 'Prueba de mando',
        clickGearIcon: 'Haga clic en el icono de engranaje（⚙）en los controles',
        gameNotLoaded: 'Juego aún no cargado',
        tabFile: 'Archivo',
        tabUrl: 'URL',
        urlTitle: 'Cargar ROM desde URL',
        urlDesc: 'Ingrese la URL directa de un archivo ROM',
        urlPlaceholder: 'https://example.com/game.nes',
        loadRom: 'Cargar ROM',
        urlTip: 'Consejo: Ingrese un enlace directo al archivo ROM.',
        urlLoading: 'Descargando ROM desde URL...',
        urlInvalid: 'Por favor, ingrese una URL válida',
        urlFetchFailed: 'Error al descargar ROM. Verifique la URL.',
        urlFetchError: 'Error de red, no se puede descargar el ROM.',
        searchTitle: 'Buscar ROM',
        searchDesc: 'Buscar ROMs en archive.org',
        searchPlaceholder: 'Ingrese el nombre del juego, ej: Super Mario Bros',
        search: 'Buscar',
        searchDisclaimer: 'Resultados de archive.org. Asegúrese de poseer el cartucho/disco original.',
        searchLoading: 'Buscando...',
        searchFailed: 'Búsqueda fallida. Inténtelo de nuevo.',
        searchNoResults: 'No se encontraron juegos coincidentes.',
        searchDownloading: 'Descargando:',
        searchDownloadFailed: 'Descarga fallida. Inténtelo de nuevo.',
        searchManualDownload: 'Descarga manual',
        searchManualTip: 'Descarga fallida. Haga clic en el enlace de arriba para descargar manualmente, luego use Carga de archivo para cargar el ROM.',
        searchSource: 'Fuente de búsqueda:',
        urlPreset: 'ROM predefinidos:',
        biosMissing: 'Falta el BIOS de NeoGeo, los juegos arcade no pueden iniciar. Coloque neogeo.zip en la carpeta routes/bios/ y actualice.',
        biosDownloaded: 'BIOS de NeoGeo descargado automáticamente'
    },
    ru: {
        save: 'Сохранить',
        load: 'Загрузить',
        fullscreen: 'Полный экран',
        uploadTitle: 'Загрузить ROM-файл',
        uploadDesc: 'Перетащите ROM-файл сюда или нажмите для выбора',
        selectRom: 'Выбрать ROM-файл',
        selectCore: 'Выбрать ядро эмулятора：',
        loading: 'Загрузка игры...',
        loadingTip: 'Это может занять несколько секунд',
        instructions: 'Инструкции',
        keyboardControls: 'Управление клавиатурой',
        arrowKeys: 'Стрелки',
        move: 'Движение',
        aButton: 'Кнопка A',
        bButton: 'Кнопка B',
        xButton: 'Кнопка X',
        yButton: 'Кнопка Y',
        start: 'Start',
        select: 'Select',
        gamepadSupport: 'Поддержка геймпада',
        gamepadDesc: 'USB-геймпады определяются автоматически',
        gamepadMapping: 'Поддерживается стандартное сопоставление',
        gamepadTip: 'Подключите геймпад перед загрузкой игры',
        saveLoadTitle: 'Сохранение и Загрузка',
        saveDesc: 'Нажмите "Сохранить" для сохранения',
        loadDesc: 'Нажмите "Загрузить" для загрузки',
        slotsDesc: 'Доступно 5 слотов сохранения',
        storageDesc: 'Сохранения хранятся в браузере',
        fullscreenTitle: 'Полноэкранный режим',
        fullscreenDesc: 'Нажмите "Полный экран"',
        exitFullscreen: 'Нажмите ESC для выхода',
        browserFullscreen: 'Полный экран браузера',
        saveGame: 'Сохранить игру',
        loadGame: 'Загрузить игру',
        slot: 'Слот',
        empty: 'Пусто',
        noGame: 'Нет запущенной игры！',
        savedToSlot: 'Сохранено в слот',
        loadedFromSlot: 'Загружено из слота',
        noSaveInSlot: 'Нет сохранения в этом слоте',
        slotDeleted: 'Слот удалён！',
        saveFailed: 'Ошибка сохранения：',
        loadFailed: 'Ошибка загрузки：',
        deleteFailed: 'Ошибка удаления：',
        loadEmulatorFailed: 'Ошибка загрузки эмулятора. Проверьте сеть.',
        settings: 'Настройки',
        gamepadSettings: 'Настройки геймпада',
        gamepadSettingsDesc: 'Нажмите Настройки, затем "Gamepad"',
        pressGamepadBtn: 'Нажмите кнопку геймпада',
        clickGameToFocus: 'Кликните на игру для фокуса',
        gamepadDetected: 'Обнаружено геймпадов：{n}',
        noGamepadDetected: 'Геймпад не обнаружен',
        gamepadConnected: 'Геймпад подключен：',
        gamepadDisconnected: 'Геймпад отключен',
        gamepadIndex: 'Индекс',
        test: 'Тест',
        gamepadTest: 'Тест геймпада',
        clickGearIcon: 'Нажмите значок шестерёнки（⚙）в элементах управления',
        gameNotLoaded: 'Игра ещё не загружена',
        tabFile: 'Файл',
        tabUrl: 'URL',
        urlTitle: 'Загрузить ROM по URL',
        urlDesc: 'Введите прямой URL файла ROM',
        urlPlaceholder: 'https://example.com/game.nes',
        loadRom: 'Загрузить ROM',
        urlTip: 'Совет: Введите прямую ссылку на файл ROM.',
        urlLoading: 'Загрузка ROM по URL...',
        urlInvalid: 'Пожалуйста, введите корректный URL',
        urlFetchFailed: 'Ошибка загрузки ROM. Проверьте URL.',
        urlFetchError: 'Сетевая ошибка, невозможно загрузить ROM.',
        searchTitle: 'Поиск ROM',
        searchDesc: 'Поиск ROM на archive.org',
        searchPlaceholder: 'Введите название игры, например: Super Mario Bros',
        search: 'Поиск',
        searchDisclaimer: 'Результаты с archive.org. Убедитесь, что у вас есть оригинальный картридж/диск.',
        searchLoading: 'Поиск...',
        searchFailed: 'Поиск не удался. Попробуйте позже.',
        searchNoResults: 'Подходящих игр не найдено.',
        searchDownloading: 'Загрузка:',
        searchDownloadFailed: 'Загрузка не удалась. Попробуйте снова.',
        searchManualDownload: 'Ручная загрузка',
        searchManualTip: 'Загрузка не удалась. Нажмите на ссылку выше, чтобы загрузить вручную, затем используйте загрузку файла для загрузки ROM.',
        searchSource: 'Источник поиска:',
        urlPreset: 'Предустановленные ROM:',
        biosMissing: 'Отсутствует BIOS NeoGeo, аркадные игры не могут запуститься. Поместите neogeo.zip в папку routes/bios/ и обновите страницу.',
        biosDownloaded: 'BIOS NeoGeo загружен автоматически'
    }
};

// Get current language
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
    var elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(function(el) {
        var key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
    // Also apply placeholder translations
    var placeholderElements = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElements.forEach(function(el) {
        var key = el.getAttribute('data-i18n-placeholder');
        el.placeholder = t(key);
    });
}

// CORS proxy list (tried in order)
var corsProxies = [
    'https://cors.luckydesigner.workers.dev/?',
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?',
    'https://api.codetabs.com/v1/proxy?quest='
];

// Process ROM blob - shared by both URL and file upload paths
function processRomBlob(blob, filename) {
    var urlLoadBtn = document.getElementById('urlLoadBtn');
    
    var reader = new FileReader();
    reader.onload = function(e) {
        var romData = e.target.result;
        
        // Set current game info
        currentGame.name = filename.replace(/\.[^/.]+$/, "");
        currentGame.core = userSelectedCore || detectCore(filename) || 'fceumm';
        currentGame.romData = romData;
        
        // Update core select
                
        // Configure EmulatorJS
        EJS_core = currentGame.core;
        EJS_gameUrl = romData;
        
        // Show emulator section
        document.getElementById('uploadSection').classList.add('hidden');
        document.getElementById('emulatorSection').classList.add('active');
        
        // Show loading overlay
        document.getElementById('loadingOverlay').classList.remove('hidden');
        
        // Show reset button (guard against a missing element during cache transitions)
        var resetBtn = document.getElementById('resetBtn');
        if (resetBtn) resetBtn.style.display = 'flex';
        
        // Update title
        document.getElementById('pageTitle').textContent = currentGame.name;
        
        // Load EmulatorJS
        loadEmulatorJS();
    };
    reader.readAsDataURL(blob);
}

// Try fetching ROM through CORS proxies, then direct
function tryFetchWithProxy(originalUrl, proxyIndex, filename, onFinalError) {
    var urlLoadBtn = document.getElementById('urlLoadBtn');
    var fetchUrl;
    
    // Check if URL is local (localhost, 127.0.0.1, or absolute path)
    var isLocalUrl = originalUrl.includes('localhost') || 
                     originalUrl.includes('127.0.0.1') || 
                     originalUrl.startsWith('/');
    
    if (isLocalUrl) {
        // Local URL - fetch directly without CORS proxy
        fetchUrl = originalUrl;
        console.log('Local URL detected, fetching directly: ' + originalUrl);
    } else if (proxyIndex < corsProxies.length) {
        // Use CORS proxy for remote URLs
        fetchUrl = corsProxies[proxyIndex] + encodeURIComponent(originalUrl);
        console.log('Trying CORS proxy ' + (proxyIndex + 1) + ': ' + corsProxies[proxyIndex]);
    } else {
        // All proxies failed, try direct fetch (works for CORS-enabled servers)
        fetchUrl = originalUrl;
        console.log('Trying direct fetch (no proxy)');
    }
    
    fetch(fetchUrl)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            // Verify we got binary data, not an HTML error page from proxy
            var contentType = response.headers.get('content-type') || '';
            if (proxyIndex < corsProxies.length && contentType.indexOf('text/html') !== -1 && filename.indexOf('.html') === -1) {
                // Proxy returned HTML instead of the ROM file - try next proxy
                console.log('Proxy returned HTML, trying next...');
                throw new Error('Proxy returned HTML');
            }
            return response.blob();
        })
        .then(function(blob) {
            // Verify blob size is reasonable (ROM files should be > 1KB)
            if (blob.size < 1024 && filename.indexOf('.zip') === -1) {
                throw new Error('File too small, possibly an error page');
            }
            console.log('ROM downloaded successfully (' + blob.size + ' bytes)');
            processRomBlob(blob, filename);
        })
        .catch(function(error) {
            console.log('Fetch attempt failed: ' + error.message);
            if (proxyIndex < corsProxies.length) {
                // Try next proxy
                tryFetchWithProxy(originalUrl, proxyIndex + 1, filename, onFinalError);
            } else {
                // All methods failed
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

// Handle ROM from URL
function handleRomFromUrl(url) {
    // Validate URL
    if (!url || (!url.startsWith('http://') && !url.startsWith('https://'))) {
        showToast(t('urlInvalid'));
        return;
    }
    
    var urlLoadBtn = document.getElementById('urlLoadBtn');
    urlLoadBtn.disabled = true;
    showToast(t('urlLoading'));
    
    // Extract filename from URL
    var filename = url.split('/').pop().split('?')[0] || 'game.nes';
    
    // Try fetching through CORS proxies first, then direct
    tryFetchWithProxy(url, 0, filename, function(finalUrl, finalFilename) {
        showManualDownload(finalUrl, finalFilename);
    });
}

// Show manual download link when auto-download fails
function showManualDownload(url, filename) {
    var resultsDiv = document.getElementById("searchResults");
    resultsDiv.innerHTML = "<div class='search-error'>" + t("searchDownloadFailed") + "</div>" +
        "<div class='search-manual'>" +
            "<a href='" + url + "' download target='_blank' class='search-manual-link'>" + t("searchManualDownload") + ": " + filename + "</a>" +
            "<p class='search-manual-tip'>" + t("searchManualTip") + "</p>" +
        "</div>";
}

// Current search source
var currentSearchSource = "archive.org";

// Search ROMs
function searchRom(query) {
    if (!query || query.trim().length < 2) {
        showToast(t('searchNoResults'));
        return;
    }
    
    var resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '<div class=\"search-loading\">' + t('searchLoading') + '</div>';
    
    var searchBtn = document.getElementById('romSearchBtn');
    searchBtn.disabled = true;
    
    var source = currentSearchSource;
    if (source === 'github') {
        searchGitHub(query)
            .then(function(data) {
                searchBtn.disabled = false;
                renderSearchResults(data, 'github');
            })
            .catch(function(err) {
                searchBtn.disabled = false;
                console.error('GitHub search failed:', err);
                resultsDiv.innerHTML = '<div class=\"search-error\">' + t('searchFailed') + '</div>';
            });
    } else {
        searchArchiveOrg(query)
            .then(function(data) {
                searchBtn.disabled = false;
                renderSearchResults(data, 'archive.org');
            })
            .catch(function(err) {
                searchBtn.disabled = false;
                console.error('Archive.org search failed:', err);
                resultsDiv.innerHTML = '<div class=\"search-error\">' + t('searchFailed') + '</div>';
            });
    }
}

// Search on archive.org
function searchArchiveOrg(query) {
    var q = encodeURIComponent(query + ' mediatype:software');
    var url = 'https://archive.org/advancedsearch.php?q=' + q + '&fl=identifier,title,creator,year,downloads&rows=20&output=json';
    return tryFetchJson(url, 0);
}

// Search on GitHub
function searchGitHub(query) {
    var extFilter = 'extension:nes+extension:gba+extension:gbc+extension:gb+extension:sfc+extension:smc+extension:z64+extension:v64+extension:n64+extension:md+extension:smd+extension:gen+extension:zip';
    var q = encodeURIComponent(query + ' ' + extFilter);
    var url = 'https://api.github.com/search/code?q=' + q + '&per_page=20';
    
    return tryFetchJson(url, 0, {
        headers: {
            'Accept': 'application/vnd.github.v3+json'
        }
    }).then(function(data) {
        var docs = (data.items || []).map(function(item) {
            var parts = item.repository.full_name.split('/');
            var owner = parts[0] || '';
            var repo = parts[1] || '';
            var branch = item.repository.default_branch || 'main';
            var path = item.path || '';
            var filename = path.split('/').pop() || 'game.zip';
            
            return {
                identifier: owner + '/' + repo + '/' + branch + '/' + path,
                title: filename,
                creator: [item.repository.full_name],
                year: '',
                downloads: 0,
                githubRaw: 'https://raw.githubusercontent.com/' + owner + '/' + repo + '/' + branch + '/' + path
            };
        });
        return { response: { docs: docs } };
    });
}

// Fetch JSON through CORS proxies (similar to tryFetchWithProxy but for JSON)
function tryFetchJson(originalUrl, proxyIndex, options) {
    var fetchUrl;
    if (proxyIndex < corsProxies.length) {
        fetchUrl = corsProxies[proxyIndex] + encodeURIComponent(originalUrl);
    } else {
        fetchUrl = originalUrl;
    }
    
    var fetchOptions = options || {};
        return fetch(fetchUrl, fetchOptions)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            return response.json();
        })
        .catch(function(error) {
            if (proxyIndex < corsProxies.length) {
                return tryFetchJson(originalUrl, proxyIndex + 1);
            }
            throw error;
        });
}

// Render search results
function renderSearchResults(data, source) {
    var resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '';
    
    var docs = data.response && data.response.docs ? data.response.docs : [];
    if (docs.length === 0) {
        resultsDiv.innerHTML = '<div class=\"search-empty\">' + t('searchNoResults') + '</div>';
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
        if (creator) metaHtml += '<span>' + creator + '</span>';
        if (year) metaHtml += '<span>' + year + '</span>';
        metaHtml += '<span>⬇ ' + downloads + '</span>';
        
        item.innerHTML = '<div class=\"search-result-title\">' + title + '</div>' +
            '<div class=\"search-result-meta\">' + metaHtml + '</div>';
        
        item.addEventListener('click', function() {
            selectSearchResult(doc.identifier, title, source);
        });
        
        resultsDiv.appendChild(item);
    });
}

// Select a search result and get its ROM files
function selectSearchResult(identifier, title, source) {
    source = source || 'archive.org';
    var resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '<div class=\"search-loading\">' + t('searchDownloading') + ' ' + title + '</div>';
    
    if (source === 'github') {
        var parts = identifier.split('/');
        var downloadUrl = 'https://raw.githubusercontent.com/' + parts[0] + '/' + parts[1] + '/' + parts[2] + '/' + parts.slice(3).join('/');
        var filename = title || 'game.zip';
        downloadAndLoadRom(downloadUrl, filename);
    } else {
        var metaUrl = 'https://archive.org/metadata/' + identifier;
        
        tryFetchJson(metaUrl, 0)
            .then(function(meta) {
                var romFile = findRomFile(meta);
                if (!romFile) {
                    resultsDiv.innerHTML = '<div class=\"search-error\">' + t('searchNoResults') + '</div>';
                    return;
                }
                var downloadUrl = 'https://archive.org/download/' + identifier + '/' + romFile.name;
                downloadAndLoadRom(downloadUrl, romFile.name);
            })
            .catch(function(err) {
                console.error('Metadata fetch failed:', err);
                resultsDiv.innerHTML = '<div class=\"search-error\">' + t('searchDownloadFailed') + '</div>';
            });
    }
}

// Find the best ROM file from metadata
function findRomFile(meta) {
    if (!meta.files || meta.files.length === 0) return null;
    
    var romExts = ['.nes', '.gba', '.gbc', '.gb', '.sfc', '.smc', '.z64', '.v64', '.n64',
        '.iso', '.bin', '.cso', '.pbp', '.md', '.smd', '.gen', '.sms', '.gg', '.sg',
        '.cue', '.chd', '.nds', '.3ds', '.cia', '.a26', '.a78', '.zip'];
    
    var candidates = meta.files.filter(function(f) {
        var name = f.name || '';
        return romExts.some(function(ext) { return name.toLowerCase().endsWith(ext); });
    });
    
    if (candidates.length === 0) return null;
    
    // Prefer largest file (most likely to be complete ROM)
    candidates.sort(function(a, b) {
        return (b.size || 0) - (a.size || 0);
    });
    
    return candidates[0];
}

// Download ROM and load it
function downloadAndLoadRom(url, filename) {
    var resultsDiv = document.getElementById('searchResults');
    resultsDiv.innerHTML = '<div class=\"search-loading\">' + t('searchDownloading') + ' ' + filename + '</div>';
    
    tryFetchWithProxy(url, 0, filename, function(finalUrl, finalFilename) {
        showManualDownload(finalUrl, finalFilename);
    });
}

// Show manual download link when auto-download fails
function showManualDownload(url, filename) {
    var resultsDiv = document.getElementById("searchResults");
    resultsDiv.innerHTML = "<div class='search-error'>" + t("searchDownloadFailed") + "</div>" +
        "<div class='search-manual'>" +
            "<a href='" + url + "' download target='_blank' class='search-manual-link'>" + t("searchManualDownload") + ": " + filename + "</a>" +
            "<p class='search-manual-tip'>" + t("searchManualTip") + "</p>" +
        "</div>";
}

// Configuration - Use CDN for EmulatorJS
var EJS_player = '#emulator';
var EJS_core = 'fceumm';
var EJS_gameUrl = '';
var EJS_color = '#A3001B';
var EJS_startOnLoaded = true;
// Disable cheats to prevent memory errors on some cores (especially N64)
var EJS_cheats = false;
// Enable gamepad support
var EJS_gamepadSupport = true;
// Use CDN path instead of local
var EJS_pathtodata = 'https://cdn.emulatorjs.org/stable/data/';

// NeoGeo BIOS configuration
var EJS_biosUrl = './bios/neogeo.zip';
var EJS_dontExtractBIOS = false;
// Enable soft load for FBNeo core
var EJS_softLoad = true;
// 远程 NeoGeo BIOS 备用源（本地 routes/bios/neogeo.zip 缺失时自动尝试获取）
var REMOTE_BIOS_URLS = [
    'https://archive.org/download/neogeo-bios/neogeo/mame_0251b/roms/neogeo.zip',
    'https://archive.org/download/neogeo-bios/neogeo/mame_0111/roms/neogeo.zip'
];
// FBNeo(arcade) 等核心必需：游戏的 romset 名（否则核心显示 "Romset is unknown"）
var EJS_gameName = '';

// ROM file extensions mapping
var coreMapping = {
    'nes': 'fceumm',
    'gba': 'mgba',
    'gbc': 'gambatte',
    'gb': 'gambatte',
    'sfc': 'snes9x',
    'smc': 'snes9x',
    'z64': 'mupen64plus_next',
    'v64': 'mupen64plus_next',
    'n64': 'mupen64plus_next',
    'iso': 'pcsx_rearmed',
    'bin': 'pcsx_rearmed',
    'md': 'genesis_plus_gx',
    'smd': 'genesis_plus_gx',
    'gen': 'genesis_plus_gx',
    'sms': 'smsplus',
    'gg': 'smsplus',
    'nds': 'melonds',
    'a26': 'stella2014',
    'a78': 'prosystem'
};

// 用户通过 URL 参数或下拉框明确选择的 core，优先级高于扩展名自动检测
var userSelectedCore = '';

// Current game info
var currentGame = {
    name: '',
    core: '',
    romData: null
};

// Show toast
function showToast(message) {
    var toast = document.getElementById('toast');
    var msg = document.getElementById('toastMessage');
    msg.textContent = message;
    toast.classList.remove('hidden');
    
    setTimeout(function() {
        toast.classList.add('hidden');
    }, 3000);
}

// Auto-detect core from file extension
function detectCore(filename) {
    var ext = filename.split('.').pop().toLowerCase();
    return coreMapping[ext] || '';
}

// Handle ROM upload
function handleRomUpload(file) {
    var reader = new FileReader();
    
    reader.onload = function(e) {
        var romData = e.target.result;
        var filename = file.name;
        
        // Set current game info
        currentGame.name = filename.replace(/\.[^/.]+$/, "");
        currentGame.core = userSelectedCore || detectCore(filename) || 'fceumm';
        currentGame.romData = romData;
        
        // Update core select
                
        // Configure EmulatorJS
        EJS_core = currentGame.core;
        EJS_gameUrl = romData;
        
        // Show emulator section
        document.getElementById('uploadSection').classList.add('hidden');
        document.getElementById('emulatorSection').classList.add('active');
        
        // Show loading overlay
        document.getElementById('loadingOverlay').classList.remove('hidden');
        
        // Show reset button (guard against a missing element during cache transitions)
        var resetBtn = document.getElementById('resetBtn');
        if (resetBtn) resetBtn.style.display = 'flex';
        
        // Update title
        document.getElementById('pageTitle').textContent = currentGame.name;
        
        // Load EmulatorJS
        loadEmulatorJS();
    };
    
    reader.readAsDataURL(file);
}

// Fetch a binary file as blob through CORS proxies, then direct fetch
function fetchBlobWithProxy(originalUrl, proxyIndex, onSuccess, onError) {
    var fetchUrl;
    var isLocalUrl = originalUrl.indexOf('localhost') !== -1 ||
                     originalUrl.indexOf('127.0.0.1') !== -1 ||
                     originalUrl.charAt(0) === '/';
    if (isLocalUrl) {
        fetchUrl = originalUrl;
    } else if (proxyIndex < corsProxies.length) {
        fetchUrl = corsProxies[proxyIndex] + encodeURIComponent(originalUrl);
        console.log('Trying CORS proxy ' + (proxyIndex + 1) + ' for BIOS');
    } else {
        fetchUrl = originalUrl;
        console.log('Trying direct fetch for BIOS');
    }

    fetch(fetchUrl)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('HTTP error ' + response.status);
            }
            var contentType = response.headers.get('content-type') || '';
            if (proxyIndex < corsProxies.length && contentType.indexOf('text/html') !== -1) {
                throw new Error('Proxy returned HTML');
            }
            return response.blob();
        })
        .then(function(blob) {
            if (blob.size < 1024) {
                throw new Error('File too small, possibly an error page');
            }
            console.log('BIOS downloaded (' + blob.size + ' bytes)');
            onSuccess(blob);
        })
        .catch(function(error) {
            console.log('BIOS fetch attempt failed: ' + error.message);
            if (proxyIndex < corsProxies.length) {
                fetchBlobWithProxy(originalUrl, proxyIndex + 1, onSuccess, onError);
            } else if (typeof onError === 'function') {
                onError();
            }
        });
}

// 本地 BIOS 缺失时，尝试从远程源下载并转换为 data URL 交给 EmulatorJS
function fetchRemoteBios(callback) {
    function tryNext(index) {
        if (index >= REMOTE_BIOS_URLS.length) {
            console.error('All remote BIOS sources failed');
            callback(false);
            return;
        }
        fetchBlobWithProxy(REMOTE_BIOS_URLS[index], 0, function(blob) {
            var reader = new FileReader();
            reader.onload = function(e) {
                EJS_biosUrl = e.target.result; // data URL
                showToast(t('biosDownloaded'));
                callback(true);
            };
            reader.readAsDataURL(blob);
        }, function() {
            tryNext(index + 1);
        });
    }
    tryNext(0);
}

// 确保 arcade 核心的 BIOS 可用（本地优先，缺失时尝试远程），避免 "Romset is unknown"
function ensureArcadeBios(callback) {
    if (EJS_core !== 'fbneo' && EJS_core !== 'mame2003') {
        callback(true);
        return;
    }
    if (!EJS_biosUrl) {
        callback(true);
        return;
    }
    // 1. 检查本地 BIOS 是否可访问
    fetch(EJS_biosUrl, { method: 'HEAD' })
        .then(function(res) {
            if (res.ok) {
                console.log('Local BIOS OK:', EJS_biosUrl);
                callback(true);
            } else {
                console.warn('Local BIOS not found (' + res.status + '), trying remote...');
                fetchRemoteBios(callback);
            }
        })
        .catch(function() {
            console.warn('Local BIOS check failed, trying remote...');
            fetchRemoteBios(callback);
        });
}

// Load EmulatorJS script
function loadEmulatorJS() {
    // 对于 arcade/fbneo 等核心，必须设置游戏的 romset 名，否则核心显示 "Romset is unknown"
    if (EJS_core === 'fbneo' || EJS_core === 'mame2003') {
        EJS_gameName = currentGame.name || '';
        console.log('EJS_gameName:', EJS_gameName);
    }
    // 先确保 BIOS 可用，再加载模拟器
    ensureArcadeBios(function(biosReady) {
        if (!biosReady) {
            console.error('NeoGeo BIOS is not available.');
            var overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.classList.add('hidden');
            }
            showToast(t('biosMissing'));
            return;
        }
        doLoadEmulatorJS();
    });
}

// Actually load the EmulatorJS loader script
function doLoadEmulatorJS() {
    var script = document.createElement('script');
    script.src = EJS_pathtodata + 'loader.js';
    script.onload = function() {
        console.log('EmulatorJS loaded successfully');
        console.log('Core:', EJS_core);
        console.log('Game URL:', EJS_gameUrl);
        
        // Wait for EmulatorJS to initialize
        var checkInterval = setInterval(function() {
            if (window.EJS_emulator) {
                clearInterval(checkInterval);
                console.log('Emulator instance created');
                
                // Listen for errors
                window.EJS_emulator.on('error', function(error) {
                    var msg = (error && error.message) ? error.message : 'Unknown error';
                    console.error('EmulatorJS error:', error);
                    // BIOS/ROM 加载失败时给出明确提示，而非静默显示 "Romset is unknown"
                    if (/content-length|romset|bios|404|load.*fail/i.test(msg)) {
                        showToast(t('biosMissing'));
                    } else {
                        showToast('Emulator error: ' + msg);
                    }
                });
            }
        }, 500);
        
        // Hide loading overlay after a short delay
        setTimeout(function() {
            var overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.classList.add('hidden');
            }
        }, 3000);
    };
    script.onerror = function() {
        console.error('Failed to load EmulatorJS from:', EJS_pathtodata);
        var overlay = document.getElementById('loadingOverlay');
            if (overlay) {
                overlay.classList.add('hidden');
            }
        showToast('Failed to load emulator. Please check console for details.');
    };
    document.body.appendChild(script);
}

// Gamepad detection variables
var gamepads = {};
var gamepadPollInterval = null;

// Update gamepad status UI
function updateGamepadStatus() {
    var gamepadList = document.getElementById('gamepadList');
    var gamepadIndicator = document.getElementById('gamepadIndicator');
    var gamepadStatusText = document.getElementById('gamepadStatusText');
    var gamepadNoDevices = document.getElementById('gamepadNoDevices');
    
    var gamepadArray = Object.values(gamepads);
    
    if (gamepadArray.length > 0) {
        gamepadIndicator.className = 'gamepad-indicator connected';
        gamepadStatusText.textContent = t('gamepadDetected').replace('{n}', gamepadArray.length);
        gamepadNoDevices.style.display = 'none';
        
        // Build gamepad list
        var listHtml = '';
        gamepadArray.forEach(function(gp) {
            listHtml += '<div class="gamepad-item">' +
                '<div class="gamepad-item-info">' +
                    '<i class="fas fa-gamepad"></i>' +
                    '<div>' +
                        '<div class="gamepad-item-name">' + gp.id + '</div>' +
                        '<div class="gamepad-item-index">' + t('gamepadIndex') + ': ' + gp.index + '</div>' +
                    '</div>' +
                '</div>' +
                '<button class="gamepad-test-btn" onclick="testGamepad(' + gp.index + ')">' +
                    '<i class="fas fa-vial"></i> ' + t('test') +
                '</button>' +
            '</div>';
        });
        gamepadList.innerHTML = listHtml;
    } else {
        gamepadIndicator.className = 'gamepad-indicator disconnected';
        gamepadStatusText.textContent = t('noGamepadDetected');
        gamepadList.innerHTML = '<div class="gamepad-no-devices" id="gamepadNoDevices">' +
            '<i class="fas fa-unlink"></i>' +
            '<span data-i18n="noGamepad">No gamepad connected</span>' +
        '</div>';
    }
}

// Test gamepad
function testGamepad(index) {
    var modal = document.getElementById('gamepadTestModal');
    if (!modal) {
        // Create test modal
        var testModalHtml = '<div class="gamepad-test-modal" id="gamepadTestModal">' +
            '<div class="gamepad-test-content">' +
                '<div class="gamepad-test-header">' +
                    '<h3 class="gamepad-test-title">' +
                        '<i class="fas fa-gamepad"></i>' +
                        '<span>' + t('gamepadTest') + '</span>' +
                    '</h3>' +
                    '<button class="modal-close" onclick="closeGamepadTest()">' +
                        '<i class="fas fa-times"></i>' +
                    '</button>' +
                '</div>' +
                '<div class="gamepad-visual">' +
                    '<div class="gamepad-buttons" id="gamepadButtons">' +
                        '<div class="gamepad-btn" data-btn="0">A</div>' +
                        '<div class="gamepad-btn" data-btn="1">B</div>' +
                        '<div class="gamepad-btn" data-btn="2">X</div>' +
                        '<div class="gamepad-btn" data-btn="3">Y</div>' +
                        '<div class="gamepad-btn" data-btn="4">LB</div>' +
                        '<div class="gamepad-btn" data-btn="5">RB</div>' +
                        '<div class="gamepad-btn" data-btn="6">LT</div>' +
                        '<div class="gamepad-btn" data-btn="7">RT</div>' +
                    '</div>' +
                    '<div class="gamepad-axes">' +
                        '<div class="gamepad-axis"><div class="gamepad-axis-dot" id="axis0"></div></div>' +
                        '<div class="gamepad-axis"><div class="gamepad-axis-dot" id="axis1"></div></div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
        document.body.insertAdjacentHTML('beforeend', testModalHtml);
        modal = document.getElementById('gamepadTestModal');
    }
    modal.dataset.gamepadIndex = index;
    modal.classList.add('active');
    startGamepadPolling(index);
}

// Close gamepad test
function closeGamepadTest() {
    var modal = document.getElementById('gamepadTestModal');
    if (modal) {
        modal.classList.remove('active');
    }
    if (gamepadPollInterval) {
        clearInterval(gamepadPollInterval);
        gamepadPollInterval = null;
    }
}

// Start gamepad polling for test
function startGamepadPolling(index) {
    if (gamepadPollInterval) {
        clearInterval(gamepadPollInterval);
    }
    
    gamepadPollInterval = setInterval(function() {
        var gp = navigator.getGamepads()[index];
        if (!gp) return;
        
        // Update buttons
        var buttons = document.querySelectorAll('.gamepad-btn');
        buttons.forEach(function(btn, i) {
            if (gp.buttons[i]) {
                if (gp.buttons[i].pressed) {
                    btn.classList.add('pressed');
                } else {
                    btn.classList.remove('pressed');
                }
            }
        });
        
        // Update axes
        var axis0 = document.getElementById('axis0');
        var axis1 = document.getElementById('axis1');
        if (axis0 && gp.axes.length >= 2) {
            var x = gp.axes[0] * 30;
            var y = gp.axes[1] * 30;
            axis0.style.transform = 'translate(calc(-50% + ' + x + 'px), calc(-50% + ' + y + 'px))';
        }
        if (axis1 && gp.axes.length >= 4) {
            var x2 = gp.axes[2] * 30;
            var y2 = gp.axes[3] * 30;
            axis1.style.transform = 'translate(calc(-50% + ' + x2 + 'px), calc(-50% + ' + y2 + 'px))';
        }
    }, 16);
}

// Scan for gamepads
function scanGamepads() {
    var gps = navigator.getGamepads ? navigator.getGamepads() : [];
    for (var i = 0; i < gps.length; i++) {
        if (gps[i]) {
            if (!gamepads[gps[i].index]) {
                gamepads[gps[i].index] = gps[i];
            }
        }
    }
    updateGamepadStatus();
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Apply translations
    applyTranslations();
    
    // Back button
    document.getElementById('backBtn').addEventListener('click', function() {
        window.history.back();
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
    
    // Upload button
    document.getElementById('uploadBtn').addEventListener('click', function() {
        document.getElementById('romInput').click();
    });
    
    // URL load button
    document.getElementById('urlLoadBtn').addEventListener('click', function() {
        var url = document.getElementById('romUrlInput').value.trim();
        handleRomFromUrl(url);
    });
    
    // Preset ROM select
    document.getElementById('romPresetSelect').addEventListener('change', function() {
        var url = this.value.trim();
        if (url) {
            document.getElementById('romUrlInput').value = url;
            handleRomFromUrl(url);
        }
    });
    
    // URL input Enter key
    document.getElementById('romUrlInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            var url = this.value.trim();
            handleRomFromUrl(url);
        }
    });
    
    // Search button
    document.getElementById('romSearchBtn').addEventListener('click', function() {
        var query = document.getElementById('romSearchInput').value.trim();
        searchRom(query);
    });
    
    // Source selector
    document.getElementById('searchSource').addEventListener('change', function() {
        currentSearchSource = this.value;
    });
    
    // Search input Enter key
    document.getElementById('romSearchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            var query = this.value.trim();
            searchRom(query);
        }
    });
    
    // File input change
    document.getElementById('romInput').addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleRomUpload(e.target.files[0]);
        }
    });
    
    // Drag and drop
    var uploadBox = document.getElementById('uploadBox');
    
    uploadBox.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadBox.classList.add('dragover');
    });
    
    uploadBox.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadBox.classList.remove('dragover');
    });
    
    uploadBox.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadBox.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleRomUpload(e.dataTransfer.files[0]);
        }
    });
    
    // Core-to-platform mapping for preset filtering
    var corePlatformMap = {
        'fceumm': 'nes',
        'snes9x': 'snes',
        'mgba': 'gba',
        'gambatte': 'gb',
        'mupen64plus_next': 'n64',
        'melonds': 'nds',
        'pcsx_rearmed': 'psx',
        'genesis_plus_gx': 'genesis',
        'smsplus': 'sms',
        'picodrive': 'sega32x',
        'yabause': 'saturn',
        'stella2014': 'atari2600',
        'prosystem': 'atari7800',
        'a5200': 'atari5200',
        'virtualjaguar': 'atarijaguar',
        'handy': 'atarilynx',
        'opera': '3do',
        'fbneo': 'arcade',
        'mame2003': 'mame',
        'gearcoleco': 'coleco',
        'vice_x64': 'c64',
        'vice_x128': 'c128',
        'vice_xvic': 'vic20',
        'vice_xpet': 'pet',
        'vice_xplus4': 'plus4',
        'puae': 'amiga',
        'beetle_vb': 'vb'
};


    // Preset ROM cache
    var presetCache = {};

    // Load preset ROM options from JSON file based on core
    function loadPresetOptions(core) {
        var platform = corePlatformMap[core] || '';
        var select = document.getElementById('romPresetSelect');
        if (!select) return;
        
        // Reset select to default option
        select.innerHTML = '<option value="">-- Select a ROM --</option>';
        
        if (!platform) {
            return;
        }
        
        // Check cache first
        if (presetCache[platform]) {
            populatePresetSelect(select, presetCache[platform]);
            return;
        }
        
        // Show loading state
        select.innerHTML = '<option value="">Loading...</option>';
        
        // Fetch JSON file
        var jsonUrl = '../../data/roms/' + platform + '.json';
        fetch(jsonUrl)
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('HTTP ' + response.status);
                }
                return response.json();
            })
            .then(function(data) {
                presetCache[platform] = data;
                populatePresetSelect(select, data);
            })
            .catch(function(error) {
                console.error('Failed to load preset ROMs:', error);
                select.innerHTML = '<option value="">Failed to load ROMs</option>';
            });
    }
    
    // Populate select with games from JSON data
    function populatePresetSelect(select, data) {
        select.innerHTML = '<option value="">-- Select a ROM --</option>';
        
        if (!data || !data.games || !Array.isArray(data.games)) {
            return;
        }
        
        data.games.forEach(function(game) {
            var option = document.createElement('option');
            option.value = game.url;
            option.setAttribute('data-platform', data.platform || '');
            option.setAttribute('data-game-name', game.name);
            option.textContent = game.name;
            select.appendChild(option);
        });
    }

    // Get core from URL parameter
    var urlParams = new URLSearchParams(window.location.search);
    var coreParam = urlParams.get('core');
    if (coreParam) {
        EJS_core = coreParam;
        userSelectedCore = coreParam;
    }
    
    // Initialize preset options based on current core
    loadPresetOptions(EJS_core);
    
    // Reset button - reload the page to return to the ROM selection screen
    var resetBtn = document.getElementById('resetBtn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            location.reload();
        });
    }
    
    // Instructions toggle
    document.getElementById('instructionsHeader').addEventListener('click', function() {
        var content = document.getElementById('instructionsContent');
        var toggle = document.getElementById('instructionsToggle');
        content.classList.toggle('hidden');
        toggle.classList.toggle('collapsed');
    });    // Gamepad connection events
    window.addEventListener('gamepadconnected', function(e) {
        console.log('Gamepad connected:', e.gamepad.id);
        gamepads[e.gamepad.index] = e.gamepad;
        updateGamepadStatus();
        showToast(t('gamepadConnected') + e.gamepad.id);
    });
    
    window.addEventListener('gamepaddisconnected', function(e) {
        console.log('Gamepad disconnected:', e.gamepad.id);
        delete gamepads[e.gamepad.index];
        updateGamepadStatus();
        showToast(t('gamepadDisconnected'));
    });
    
    // Scan on load
    setTimeout(scanGamepads, 500);
    // Periodic scan
    setInterval(scanGamepads, 1000);
});
