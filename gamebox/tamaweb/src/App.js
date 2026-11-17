const App = {
    PI2: Math.PI * 2,
    INF: 9999999999,
    time: 0,
    deltaTime: 0,
    lastTime: 0,
    playTime: 0,
    hour: 12,
    accurateDeltaTime: 0,
    mouse: { x: 0, y: 0, isInBounds: false },
    userId: "_",
    userName: null,
    sessionId: Math.round(Math.random() * 9999999999),
    ENV: location.port == 5500 ? "dev" : "prod",
    isOnItch: false,
    isOnElectronClient: false,
    shellBackground: "",
    deferredInstallPrompt: null,

    gameEventsHistory: {},
    misc: {},
    mods: [],
    records: {},
    temp: {},
    ownedFurniture: [],
    plants: [],
    animals: { treat: null, list: [], nextAttractMs: 0, treatBiteCount: 0 },
    preloadedResources: {},

    settings: {
        screenSize: 1,
        playSound: true,
        vibrate: true,
        displayShell: true,
        displayShellButtons: true,
        displayShellLogo: true,
        shellShape: 6,
        backgroundColor: "#FFDEAD",
        backgroundPattern: "resources/img/ui/bg_pattern_01.png",
        notifications: false,
        automaticAging: true,
        sleepingHoursOffset: 0,
        classicMainMenuUI: false,
        isTester: false,
        theme: false,
        shellAdditionalSize: 0,
        showWantName: true,
        genderedPets: false,
        playMusic: true,
        skillsAffectingEvolution: true,
        season: "auto",
        tapEffect: true,
        decorationOverlay: "leaves_01",
    },
    constants: {
        ONE_HOUR: 1000 * 60 * 60,
        ONE_MINUTE: 1000 * 60,
        ONE_SECOND: 1000,
        AUTO_SAVE_INTERVAL_SECS: 6,
        FOOD_SPRITESHEET: "resources/img/item/foods_on.png",
        FOOD_SPRITESHEET_DIMENSIONS: {
            cellNumber: 1,
            cellSize: 24,
            rows: 33,
            columns: 33,
        },
        ITEM_SPRITESHEET: "resources/img/item/items.png",
        ITEM_SPRITESHEET_DIMENSIONS: {
            cellNumber: 1,
            cellSize: 22,
            rows: 10,
            columns: 10,
        },
        PLANT_SPRITESHEET: "resources/img/item/plants.png",
        PLANT_SPRITESHEET_DIMENSIONS: {
            cellNumber: 1,
            cellSize: 24,
            rows: 28,
            columns: 28,
        },
        MISC_SPRITESHEET: "resources/img/item/misc.png",
        MISC_SPRITESHEET_DIMENSIONS: {
            cellNumber: 1,
            cellSize: 24,
            rows: 33,
            columns: 33,
        },
        MAX_ANIMALS: 16,
        MAX_PLANTS: 8,
        MIN_REVIVE_GOLDS: 250,
        MAX_REVIVE_GOLDS: 1000,
        SKILL_EVOLUTION_EFFECTIVENESS: {
            bounds: 30,
            ratings: {
                endurance: 1,
                logic: 2,
                expression: 3,
            },
        },
        SLEEP_START: 21,
        SLEEP_END: 8,
        PARENT_DAYCARE_START: 3,
        PARENT_DAYCARE_END: 18,
        MAX_SHELL_SHAPES: 7,
        AFTERNOON_TIME: [12, 18],
        EVENING_TIME: [18, 20],
        NIGHT_TIME: [20, 6],
        CHRISTMAS_TIME: {
            start: "12-14",
            end: "12-31",
            absDay: "12-25",
        },
        MANUAL_AGE_HOURS_BABY: 1,
        MANUAL_AGE_HOURS_CHILD: 9,
        MANUAL_AGE_HOURS_TEEN: 12,
        MANUAL_AGE_HOURS_ADULT: 72,
        AUTO_AGE_HOURS_BABY: 24,
        AUTO_AGE_HOURS_CHILD: 36,
        AUTO_AGE_HOURS_TEEN: 48,
        AUTO_AGE_HOURS_ADULT: 336, // 14 days
        WANT_TYPES: {
            food: "food",
            playdate: "playdate",
            item: "item",
            minigame: "minigame",
            fulfilled: "fulfilled",
        },
        CHAR_UNLOCK_PREFIX: "ch_unl",
        FEEDING_PICKINESS: {
            refeedingTolerance: 10,
            bufferSize: 16,
        },
        ONLINE_FOOD_ORDER_MARKUP: 2,
        // z-index
        ACTIVE_PET_Z: 5,
        NPC_PET_Z: 4.6,
        BACKGROUND_OBJECT_Z: 0,
        MAX_PLACED_FURNITURE: 6,
        POOP_POSITIONS: [
            { x: "75%", y: "78%", z: 4.59 },
            { x: "85%", y: "84%", z: 4.592 },
            { x: "25%", y: "80%", z: 4.593 },
            { x: "15%", y: "82%", z: 4.594 },
        ],
        ACTIVE_ITEM_Z: 4.595,
        CHRISTMAS_TREE_Z: 4.58,
        BACKGROUND_Z: -10,
        INPUT_BASE_64: "0xffbx64",
        SCHOOL: {
            maxClassesPerDay: 10,
            resetTime: { hour: 7, minute: 0, second: 0 },
        },
        MAX_OFFLINE_PROGRESSION_SECS: 604800, // 3600(secs in 1 hour) * 24(1 day) * 7(7 days) = 604800
        GENDERS: ["genderless", "mars", "venus", "transgender", "venus-mars"],
        UNDERWORLD_TREAT_CURRENCY: "spookandy",
        SPANS: {
            monster: `<div> <img class="icon" src="resources/img/misc/devil_icon.png"></img> <b style="color: red;">monster</b> </div>`,
            angel: `<div> <img class="icon" src="resources/img/misc/angel_icon.png"></img> <b style="color: forestgreen;">angel</b> </div>`,
        },
        SEASON_COLORS: {
            source: {
                shadow0: "#C016B2",
                shadow1: "#C017B2",
                base: "#EF1CDE",
                highlight: "#F248E4",
            },
            winter: ["#C6DDFF", "#E8F1FF", "#FFFFFF"],
            autumn: ["#CE4429", "#ED782F", "#FF9D60"],
            spring: ["#63A04B", "#7FD060", "#96F271"],
            summer: ["#27AA2F", "#59D12F", "#BAD92F"],
        },
        LETTER_SCORE_RATING: {
            awful: 0,
            bad: 1,
            medium: 2,
            good: 3,
        },
    },
    routes: {
        BLOG: "https://tamawebgame.github.io/blog/",
        ITCH_REVIEW: "https://samandev.itch.io/tamaweb/rate?source=game",
        DISCORD: "https://tamawebgame.github.io/discord",
    },
    async init() {
        // window load events
        this.registerLoadEvents();

        // check for platforms
        if (location.host.indexOf("itch") !== -1) App.isOnItch = true;
        if (navigator?.userAgent?.includes("Electron"))
            App.isOnElectronClient = true;

        // init
        this.initSound();
        App.drawer = new Drawer(document.querySelector(".graphics-canvas"));
        Object2d.setDrawer(App.drawer);

        // moment settings
        moment.relativeTimeThreshold("m", 59);

        // load data
        const loadedData = await this.handleSequentiallyLoad([App.load]);
        console.log({ loadedData });

        if (!loadedData) return;

        // events history
        if (loadedData?.eventsHistory) {
            App.gameEventsHistory = loadedData.eventsHistory;
        }

        // records
        App.records = loadedData.records;

        // shell background
        this.setShellBackground(loadedData?.shellBackground);

        // mods
        this.loadMods(loadedData.mods);

        // handle settings
        if (loadedData.settings) {
            Object.assign(this.settings, loadedData.settings);
        }
        this.applySettings();

        // furniture
        if (loadedData.furniture) this.ownedFurniture = loadedData.furniture;

        // plants
        if (loadedData.plants)
            this.plants = loadedData.plants.map((p) => new Plant(p));

        // animals
        if (loadedData.animals) {
            this.animals = {
                ...loadedData.animals,
                list: loadedData.animals.list.map(
                    (a) => new AnimalDefinition(a),
                ),
            };
        }

        // handle preloading
        const forPreload = [
            ...SPRITES,
            ...ALL_PLAYABLE_CHARACTERS,
            ...NPC_CHARACTERS,
            ...ANIMAL_CHARACTERS,
        ];
        const preloadedResources = await this.preloadImages(forPreload);
        preloadedResources.forEach((resource, i) => {
            // let name = forPreload[i].slice(forPreload[i].lastIndexOf('/') + 1);
            const name = forPreload[i];
            this.preloadedResources[name] = resource;
        });

        // creating game objects
        App.background = new Object2d({
            image: null,
            x: 0,
            y: 0,
            width: 96,
            height: 96,
            z: App.constants.BACKGROUND_Z,
            noPreload: Boolean(App.mods.length),
            static: true,
        });
        // App.foodsSpritesheet = new Object2d({
        //     image: App.preloadedResources["resources/img/item/foods.png"],
        //     x: 10, y: 10,
        //     spritesheet: {
        //         cellNumber: 11,
        //         cellSize: 16,
        //         rows: 4,
        //         columns: 4,
        //     },
        //     hidden: true,
        // })
        App.foods = new Object2d({
            image: App.preloadedResources[App.constants.FOOD_SPRITESHEET],
            x: 10,
            y: 10,
            width: 12,
            height: 12,
            scale: 24,
            spritesheet: {
                cellNumber: 2,
                cellSize: 24,
                rows: 33,
                columns: 33,
            },
            hidden: true,
        });
        App.uiFood = document.createElement("c-sprite");
        App.uiFood.setAttribute("width", 24);
        App.uiFood.setAttribute("height", 24);
        App.uiFood.setAttribute("index", 0);
        App.uiFood.setAttribute("src", App.constants.FOOD_SPRITESHEET);
        App.uiFood.setAttribute("class", "ui-food");
        App.uiFood.style.visibility = "hidden";
        document.querySelector(".graphics-wrapper").appendChild(App.uiFood);

        App.darkOverlay = new Object2d({
            img: "resources/img/background/house/dark_overlay.png",
            x: 0,
            y: 0,
            z: 11,
            opacity: 0.85,
            composite: "source-atop",
            static: true,
            opacity: 0,
            isVisible: false,
            onDraw: (me) => {
                const targetOpacity =
                    App.pet?.stats?.is_sleeping && App.pet?.state === "sleeping"
                        ? 1
                        : 0;
                const currentOpacity = lerp(
                    me.opacity,
                    targetOpacity,
                    0.015 * App.deltaTime,
                );
                me.opacity = clamp(currentOpacity, 0, 1);
                me.isVisible = me.opacity > 0.2;
            },
        });
        App.sky = new Object2d({
            image: App.preloadedResources[
                "resources/img/background/sky/night.png"
            ],
            x: 0,
            y: 0,
            z: 99999,
            composite: "destination-over",
            static: true,
        });
        App.skyOverlay = new Object2d({
            image: App.preloadedResources[
                "resources/img/background/sky/night_overlay.png"
            ],
            x: 0,
            y: 0,
            z: 999,
            composite: "source-atop",
            opacity: 1,
            static: true,
        });
        App.skyWeather = new Object2d({
            image: App.preloadedResources[
                "resources/img/background/sky/rain_01.png"
            ],
            x: 0,
            y: 0,
            z: 999.1,
            composite: "xor",
            static: true,
            flipSpeed: 200,
            // hidden: true,
            onDraw: (me) => {
                Object2d.animations.flip(me, me.flipSpeed);
            },
        });
        App.petDefinition = new PetDefinition({
            name: getRandomName(),
            sprite: randomFromArray(PET_BABY_CHARACTERS),
        })
            .setStats({ is_egg: true })
            .loadStats(loadedData.pet)
            .loadAccessories(loadedData.accessories);

        // check automatic age up
        if (App.settings.automaticAging) {
            while (
                moment().isAfter(
                    App.petDefinition.getNextAutomaticBirthdayDate(),
                )
            ) {
                App.petDefinition.ageUp();
                App.sendAnalytics("auto_age_up", App.petDefinition.lifeStage);
            }
        }

        // put pet to sleep on start if is sleeping hour
        if (!App.petDefinition.stats.is_sleeping && !App.isTester()) {
            App.petDefinition.stats.is_sleeping =
                App.isSleepHour() && !loadedData.pet?.stats?.is_egg;
        }

        App.pet = App.createActivePet(App.petDefinition, {
            state: "",
        });

        if (!loadedData.pet || !Object.keys(loadedData.pet).length) {
            // first time
            setTimeout(() => {
                Activities.playEggUfoAnimation(() =>
                    App.handlers.show_set_pet_name_dialog(),
                );
            }, 100);
        }
        App.setScene(App.scene.home);
        this.applySky();

        // check if in rabbit hole
        if (App.pet.stats.current_rabbit_hole.name) {
            Activities.goToCurrentRabbitHole(false);
            App.petDefinition.stats.is_sleeping = false;
        }

        // simulating offline progression
        if (loadedData.lastTime) {
            let elapsedTime = Date.now() - loadedData.lastTime;

            if (App.ENV !== "dev")
                App.pet.simulateOfflineProgression(elapsedTime);

            let awaySeconds = Math.round(elapsedTime / 1000);
            let awayMinutes = Math.round(awaySeconds / 60);
            let awayHours = Math.round(awayMinutes / 60);

            let message;
            if (awaySeconds < 60) message = `${awaySeconds} seconds`;
            else if (awayMinutes < 60) message = `${awayMinutes} minutes`;
            else message = `${awayHours} hours`;

            App.awayTime = message;

            if (awaySeconds > 30 && App.ENV !== "dev") {
                App.displayConfirm(
                    `Welcome back!\n<b>${App.petDefinition.name}</b> missed you in those <b>${message}</b> you were away`,
                    [
                        {
                            name: "ok",
                            onclick: () => {},
                        },
                    ],
                );
            }
        }

        // missions
        Missions.init(loadedData.missions);

        // load room customizations
        this.applyRoomCustomizations(loadedData.roomCustomizations);

        // check if at daycare
        if (App.pet.stats.is_at_parents) {
            Activities.stayAtParents();
        }

        // check if at vacation
        if (App.pet.stats.is_at_vacation) {
            Activities.seaVacation();
        }

        /* // routing
        const historyIndex = window.history.length;
        window.history.pushState(null, null, window.top.location.pathname + window.top.location.search);
        window.addEventListener('popstate', (e) => {
            const activeDisplay = [...document.querySelectorAll('.root .display')].at(-1);
            const backAction = activeDisplay?.querySelector('.back-btn, .cancel-btn, .back-sound');
            console.log(e);
            if(backAction){
                backAction.click();
                window.history.pushState(null, null, window.top.location.pathname + window.top.location.search);
                e.preventDefault();
            }
        }); */

        // in-game events
        this.handleInGameEvents();

        // random encounters
        App.runRandomEncounters();

        // touch / mouse pos on canvas
        App.registerInputUpdates();

        // hide loading
        setTimeout(() => {
            UI.fadeOut(document.querySelector(".loading-text"));
            App.loadingEnded = true;
        }, 50);

        // rudder stack
        this.initRudderStack();

        // session start event
        App.sendSessionEvent(true);

        // periodic update
        setTimeout(() => {
            App.registerInterval(
                App.onPeriodicUpdate,
                App.constants.ONE_SECOND * 30,
            );
        }, App.constants.ONE_SECOND * 2);

        // saver
        App.registerInterval(
            () => {
                App.save(true);
            },
            App.constants.AUTO_SAVE_INTERVAL_SECS * App.constants.ONE_SECOND,
            false,
        );
    },
    initRudderStack: function () {
        // Vendored for Easy-Web-TV-M3u8: analytics stripped (no RudderStack SDK).
        return;
        rudderanalytics.identify(App.userId, {
            username: App.userName,
            petName: App.petDefinition?.name,
            playTime: App.playTime,
            isOnItch: App.isOnItch,
        });
    },
    registerInputUpdates: function () {
        const moveEventHandler = (evt) => {
            const { canvas } = App.drawer;
            const rect = canvas.getBoundingClientRect();

            const target = evt.type.startsWith("touch")
                ? evt.targetTouches[0]
                : evt;

            const x =
                (target.clientX - rect.left) * (canvas.width / rect.width);
            const y =
                (target.clientY - rect.top) * (canvas.height / rect.height);

            App.mouse.isInBounds =
                x >= 0 && y >= 0 && x < canvas.width && y < canvas.height;

            App.mouse.absX = x - canvas.width / 2;
            App.mouse.absY = y - canvas.height / 2;

            App.mouse.x = Math.max(0, Math.min(x, canvas.width));
            App.mouse.y = Math.max(0, Math.min(y, canvas.height));

            App.mouse.screenX = target.clientX;
            App.mouse.screenY = target.clientY;
        };
        const mouseDownHandler = (evt) => {
            App.mouse.isDown = true;
            moveEventHandler(evt);
            document.body.classList.remove("button-mode");
        };
        const mouseUpHandler = (evt) => {
            App.mouse.isDown = false;
        };

        document.addEventListener("mousemove", moveEventHandler);
        document.addEventListener("touchmove", moveEventHandler);
        document.addEventListener("mousedown", mouseDownHandler);
        document.addEventListener("mouseup", mouseUpHandler);
        document.addEventListener("touchstart", mouseDownHandler);
        document.addEventListener("touchend", mouseUpHandler);

        // mouse down ms
        App.registerOnDrawEvent(() => {
            if (!App.mouse.isDown) {
                App.mouse.isDownStartMs = 0;
                App.mouse.isDownMs = 0;
                return;
            }

            if (App.mouse.isDown && !App.mouse.isDownStartMs) {
                App.mouse.isDownStartMs = App.time;
            }

            App.mouse.isDownMs = App.time - App.mouse.isDownStartMs;
        });

        // gamepad
        window.addEventListener("gamepadconnected", () => {
            if (App.temp.gamepadDrawEvent) return;

            const gamepadKeys = {};
            const actionsMap = {
                0: () => App.handlers.shell_button(1),
                1: () => App.handlers.shell_button(2),
                2: () => App.handlers.shell_button(0),
            };

            App.temp.gamepadDrawEvent = App.registerOnDrawEvent(() => {
                if (!document.hasFocus()) return;

                const gamepad = navigator?.getGamepads()?.find(Boolean);
                if (!gamepad) return;

                // reset unpressed keys
                Object.keys(gamepadKeys).forEach((key) => {
                    if (gamepad.buttons[key]?.pressed) return;
                    gamepadKeys[key] = false;
                });

                // handle pressed keys
                Object.keys(actionsMap).forEach((key) => {
                    if (!gamepad.buttons[key]?.pressed) return;
                    if (gamepadKeys[key]) return;
                    gamepadKeys[key] = true;
                    actionsMap[key]();
                });
            });
        });

        // key down
        document.addEventListener("keydown", (event) => {
            switch (event.key) {
                case "`":
                    App.takeScreenshot();
                    break;
                case "ArrowLeft":
                    App.handlers.shell_button(0);
                    break;
                case "ArrowDown":
                    App.handlers.shell_button(1);
                    break;
                case "ArrowRight":
                    App.handlers.shell_button(2);
                    break;
            }
            App.mouse.isDown = true;
        });
        document.addEventListener("keyup", (event) => {
            App.mouse.isDown = false;
        });
    },
    registerLoadEvents: function () {
        const initializeRenderer = () => {
            App.targetFps = 60;
            App.fpsInterval = 1000 / App.targetFps;
            App.fpsLastTime = Date.now();
            App.fpsStartTime = App.fpsLastTime;
            App.onFrameUpdate(0);
        };
        document.addEventListener("DOMContentLoaded", function (event) {
            initializeRenderer();
        });
        window.onbeforeunload = function () {
            App.sendSessionEvent(false);
            // App.save();
        };

        let resizeEventTimeout;
        window.addEventListener("resize", () => {
            UI.hide(document.querySelector(".overlay-container"));
            clearTimeout(resizeEventTimeout);
            resizeEventTimeout = setTimeout(() => {
                UI.show(document.querySelector(".overlay-container"));
                App.initDecorationOverlay();
            }, App.constants.ONE_SECOND * 0.1);
        });

        if (navigator.storage && "persist" in navigator.storage) {
            if (App.playTime <= App.constants.ONE_MINUTE * 30) {
                navigator.storage.persist();
                // do not bother new users with storage persistence
                // and backup reminders
                App.isStoragePersistent = true;
            } else {
                navigator.storage.persist().then((persistent) => {
                    App.isStoragePersistent = persistent;
                });
            }
        }

        const observer = new MutationObserver((mutationsList) => {
            mutationsList.forEach((mutation) => {
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            App.indexUIElement(node);
                        }
                    });
                }
            });
        });
        observer.observe(document.querySelector(".screen-wrapper"), {
            childList: true,
            subtree: false,
        });

        // tap cursor
        const spawnCursorElement = (x, y, scale = 1) => {
            const animationTime = random(250, 450);
            const sparksCount = 5,
                offset = random(0, 45);
            const sparks = new Array(sparksCount).fill(null).map((_, index) => {
                const angle = index * (360 / sparksCount) + offset;
                const rad = (angle * Math.PI) / 180;
                const distance = random(50, 100);
                const dx = Math.cos(rad) * distance;
                const dy = Math.sin(rad) * distance;
                return {
                    className: "cursor-spark",
                    style: `
                        top: ${y}px;
                        left: ${x}px;
                        animation-duration: ${animationTime * 2}ms;
                        --dx: ${dx}px;
                        --dy: ${dy}px;
                        scale: ${random(5, 10) * 0.1};
                    `,
                };
            });
            const currentCursorElement = UI.ce({
                componentType: "div",
                children: [
                    ...sparks,
                    {
                        componentType: "div",
                        className: "cursor",
                        style: `
                            top: ${y}px;
                            left: ${x}px;
                            scale: ${scale};
                            animation-duration: ${animationTime}ms;
                        `,
                    },
                ],
            });
            document.body.appendChild(currentCursorElement);
            setTimeout(() => currentCursorElement.remove(), animationTime * 2);
            return currentCursorElement;
        };
        const touchDownHandler = (evt) => {
            if (!App.settings.tapEffect) return;

            if (evt.targetTouches) {
                return [...evt.targetTouches].forEach(touchDownHandler);
            }

            const origin = {
                x: evt.clientX,
                y: evt.clientY,
            };

            spawnCursorElement(origin.x, origin.y, 2);
            return;

            const maxPoints = 3,
                radius = 10,
                startingOffset = Math.random();
            for (let i = 0; i < maxPoints; i++) {
                const currentPoint =
                    ((i + startingOffset) * (Math.PI * 2)) / maxPoints;
                const circleVector = {
                    x: Math.sin(currentPoint) * radius,
                    y: Math.cos(currentPoint) * radius,
                };
                const spawnPosition = addVector(origin, circleVector);
                spawnCursorElement(
                    spawnPosition.x,
                    spawnPosition.y,
                    random(3, 6) * 0.1,
                );
            }
        };
        document.addEventListener("mouseup", touchDownHandler);
        document.addEventListener("touchend", touchDownHandler);
    },
    initDecorationOverlay: function () {
        if (App.isOnElectronClient) return;

        const container = document.querySelector(".overlay-container");
        container.innerHTML = "";

        const { decorationOverlay: overlayKey } = App.settings;
        const currentDecorationDef =
            App.definitions.decoration_overlay[overlayKey];

        if (
            !overlayKey ||
            !currentDecorationDef ||
            window.innerWidth <= 300 ||
            window.innerHeight <= 420
        )
            return;

        const getAngleToCenter = (objectX, objectY) => {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const angleRad = Math.atan2(centerY - objectY, centerX - objectX);
            const angleDeg = angleRad * (180 / Math.PI);
            return angleDeg + 90;
        };
        const getEvenEdgePosition = (
            index,
            total,
            objectWidth,
            objectHeight,
        ) => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            const halfWidth = objectWidth / 2;
            const halfHeight = objectHeight / 2;

            // the center travels around a rectangle expanded by half the
            // object's dimensions so that the object's edges touch the viewport.
            const left = -halfWidth;
            const right = width - halfWidth;
            const top = -halfHeight;
            const bottom = height - halfHeight;

            const horizontalLength = right - left;
            const verticalLength = bottom - top;

            const perimeter = 2 * (horizontalLength + verticalLength);
            const position = (index / total) * perimeter;

            let x,
                y,
                r,
                ignore = false;

            if (position < horizontalLength) {
                // t
                x = left + position;
                y = top;
                r = 180;
                ignore = false;
            } else if (position < horizontalLength + verticalLength) {
                // r
                x = right;
                y = top + (position - horizontalLength);
                r = -90;
            } else if (position < 2 * horizontalLength + verticalLength) {
                // b
                x = right - (position - horizontalLength - verticalLength);
                y = bottom;
                r = 0;
                ignore = false;
            } else {
                // l
                x = left;
                y = bottom - (position - 2 * horizontalLength - verticalLength);
                r = 90;
            }

            return { x, y, r, ignore };
        };

        const TOTAL = clamp(Math.floor(window.innerWidth / 26), 20, 100);
        for (let i = 0; i < TOTAL; i++) {
            const size = {
                x: 256,
                y: 256,
            };

            const scale = clamp(Math.abs(Math.sin(i * 1)), 0.5, 0.9);
            size.x *= scale;
            size.y *= scale;

            const position = getEvenEdgePosition(i, TOTAL, size.x, size.y);
            if (position.ignore) continue;
            position.x += random(-20, 20);
            position.y += random(-20, 20);

            let currentAsset = randomFromArray(
                currentDecorationDef.assets.slice(1),
            );
            if (random(0, 1)) currentAsset = currentDecorationDef.assets[0];

            let rotation = getAngleToCenter(position.x, position.y);

            UI.create({
                parent: container,
                componentType: "img",
                src: App.checkResourceOverride(currentAsset),
                style: `
                    left: ${position.x}px;
                    top: ${position.y}px;
                    rotate: ${rotation}deg;
                    width: ${size.x}px;
                    height: ${size.y}px;
                    animation-delay: ${i * -150}ms;
                `,
            });
        }
    },
    sendSessionEvent: function (login) {
        if (login) {
            const analyticsData = {
                session_id: App.sessionId,
                play_time_mins: (Math.round(App.playTime) / 1000 / 60).toFixed(
                    2,
                ),
                away: App.awayTime || -1,
                sprite: App.petDefinition?.sprite,
                is_egg: App.pet?.stats.is_egg,
                gold: App.pet?.stats.gold,
                ver: VERSION,
            };
            App.sendAnalytics("login", JSON.stringify(analyticsData));
        } else {
            const analyticsData = {
                session_id: App.sessionId,
                hunger: Math.round(App.pet?.stats.current_hunger),
                fun: Math.round(App.pet?.stats.current_fun),
                health: Math.round(App.pet?.stats.current_health),
                sleep: Math.round(App.pet?.stats.current_sleep),
                bladder: Math.round(App.pet?.stats.current_bladder),
                is_egg: App.pet?.stats.is_egg,
                has_poop_out: App.pet?.stats.has_poop_out,
                is_sleeping: App.pet?.stats.is_sleeping,
            };
            App.sendAnalytics("logout", JSON.stringify(analyticsData));
        }
    },
    applySettings: function () {
        const graphicsWrapper = document.querySelector(".graphics-wrapper");

        // fullscreen param
        const isFullscreen = new URLSearchParams(location.search).has(
            "fullscreen",
        );
        if (isFullscreen) graphicsWrapper.classList.add("fullscreen");

        // theme
        if (this.settings.theme) {
            document.body.className = `theme-${this.settings.theme}`;
        }

        // background color
        document.documentElement.style.setProperty(
            "--bg-color",
            this.settings.backgroundColor,
        );
        const metaThemeColor = document.querySelector(
            'meta[name="theme-color"]',
        );
        metaThemeColor?.setAttribute("content", this.settings.backgroundColor);
        // document.body.style.backgroundColor = this.settings.backgroundColor;
        // document.querySelector('.loading-text').style.background = this.settings.backgroundColor;

        // background pattern
        const bgPattern = document.querySelector(".bg-pattern");
        if (bgPattern) {
            if (this.settings.backgroundPattern) {
                UI.show(bgPattern);
                bgPattern.style.background = `url(${App.checkResourceOverride(this.settings.backgroundPattern)})`;
            } else {
                UI.hide(bgPattern);
            }
        }

        // decoration overlay
        if (!App.temp.decorationOverlayFirstInit) {
            App.temp.decorationOverlayFirstInit = true;
            this.initDecorationOverlay();
        }

        // screen / shell size
        this.settings.shellAdditionalSize = clamp(
            this.settings.shellAdditionalSize,
            -0.5,
            5,
        );
        this.settings.screenSize = clamp(this.settings.screenSize, 0.6, 5);
        graphicsWrapper.style.transform = `scale(${this.settings.screenSize})`;
        document.querySelector(".dom-shell").style.transform =
            `scale(${this.settings.screenSize + this.settings.shellAdditionalSize})`;

        // shell
        const domShell = document.querySelector(".dom-shell");
        domShell.style.display = App.settings.displayShell ? "" : "none";
        domShell.className = `dom-shell shell-shape-${this.settings.shellShape}`;
        document.querySelector(".shell-btn.main").style.display = App.settings
            .displayShellButtons
            ? ""
            : "none";
        document.querySelector(".shell-btn.right").style.display = App.settings
            .displayShellButtons
            ? ""
            : "none";
        document.querySelector(".shell-btn.left").style.display = App.settings
            .displayShellButtons
            ? ""
            : "none";
        document.querySelector(".dom-shell .logo").style.display = App.settings
            .displayShellLogo
            ? ""
            : "none";

        // classic main menu layout
        let classicMainMenuContainer = document.querySelector(
            ".classic-main-menu__container",
        );
        classicMainMenuContainer?.remove();
        graphicsWrapper.classList.remove("classic-main-menu");
        if (App.settings.classicMainMenuUI) {
            graphicsWrapper.classList.add("classic-main-menu");
            classicMainMenuContainer = UI.create({
                componentType: "div",
                className: "classic-main-menu__container",
                parent: graphicsWrapper,
                parentInsertBefore: true,
                children: App.definitions.main_menu.map((def) => {
                    return {
                        className: "classic-main-menu__item click-sound",
                        innerHTML: def.name,
                        onclick: def.onclick,
                        _mount: (me) => {
                            me.setAttribute("data-fb-focusable", "");
                        },
                    };
                }),
            });

            App.indexUIElement(classicMainMenuContainer);
            App.temp.classicMainMenuContainer = classicMainMenuContainer;

            if (!App.temp.defaultHomeSceneConfig) {
                App.temp.defaultHomeSceneConfig = {
                    petY: App.scene.home.petY,
                    shadowOffset: App.scene.home.shadowOffset,
                };
            }

            App.scene.home.petY = "90%";
            App.scene.home.shadowOffset = -10;
        } else {
            if (App.temp.defaultHomeSceneConfig) {
                App.scene.home.petY = App.temp.defaultHomeSceneConfig.petY;
                App.scene.home.shadowOffset =
                    App.temp.defaultHomeSceneConfig.shadowOffset;
            }
        }

        // season
        const currentSeason = App.getSeason();
        const currentSeasonColors = App.getSeasonColor(currentSeason);
        Object2d.setColorOverrides(currentSeasonColors);

        if (App.currentScene) {
            App.reloadScene();
        }

        // screenshot on dbl clicking logo
        document.querySelector(".logo").ondblclick = () => App.takeScreenshot();
    },
    loadMods: function (mods) {
        if (typeof mods !== "object" || !mods || !mods.length) return;
        App.mods = mods;

        const handleAddedResource = (modId, resource) => {
            switch (resource.type) {
                case "char":
                    resource.resId = `${modId}_${resource.id}`;

                    App.resourceOverrides[resource.resId] = resource.sprite;

                    if (resource.lifeStage === "baby")
                        PET_BABY_CHARACTERS.push(resource.resId);
                    else if (resource.lifeStage === "teen")
                        PET_TEEN_CHARACTERS.push(resource.resId);
                    else if (resource.lifeStage === "child")
                        PET_CHILD_CHARACTERS.push(resource.resId);
                    else if (resource.lifeStage === "elder")
                        PET_ELDER_CHARACTERS.push(resource.resId);
                    else PET_ADULT_CHARACTERS.push(resource.resId);
                    break;
            }
        };

        App.mods.forEach((mod) => {
            mod.replaced_resources?.forEach(([source, target], index) => {
                App.resourceOverrides[source] = target;

                if (ALL_PLAYABLE_CHARACTERS.includes(source)) {
                    if (!App.temp.convertedModAddedResources)
                        App.temp.convertedModAddedResources = [];
                    const targetLifeStage = PetDefinition.getLifeStage(source);
                    App.temp.convertedModAddedResources.push({
                        id: source,
                        sprite: target,
                        lifeStage: getKeyByValue(
                            PetDefinition.LIFE_STAGE,
                            PetDefinition.getLifeStage(source),
                        ),
                        name: `${mod.name} #${index}`,
                        modId: mod.id,
                        type: "char",
                    });
                }
            });
            mod.added_resources?.forEach((resource) =>
                handleAddedResource(mod.id, resource),
            );
        });

        App.temp.convertedModAddedResources?.forEach((resource) =>
            handleAddedResource(resource.modId, resource),
        );
    },
    handleFileLoad: function (
        inputElement,
        readType = "readAsDataURL",
        onLoad,
    ) {
        inputElement.onchange = () => {
            const file = inputElement.files[0];
            const reader = new FileReader();
            reader.addEventListener(
                "load",
                () => {
                    return onLoad(reader.result);
                },
                false,
            );
            if (file) {
                reader[readType](file);
            }
        };
    },
    registeredDrawEvents: [],
    registerOnDrawEvent: function (fn) {
        return this.registeredDrawEvents.push(fn) - 1;
    },
    unregisterOnDrawEvent: function (inp) {
        const index =
            typeof inp === "function"
                ? this.registeredDrawEvents.indexOf(inp)
                : inp;
        if (index !== -1) this.registeredDrawEvents[index] = null;
    },
    registerInterval: function (fn, interval, runInstantly = true) {
        App.temp.intervalId ??= 0;
        App.temp.intervalId++;
        const key = `_frm_interval_${App.temp.intervalId}`;

        if (!runInstantly) {
            // trigger cooldown so that it doesn't run instantly
            App.canProceed(key, interval);
        }

        return App.registerOnDrawEvent(() => {
            if (!App.canProceed(key, interval)) return;
            fn?.();
        });
    },
    onFrameUpdate: function (time) {
        App.date = new Date();
        App.hour = App.date.getHours();
        App.fullTime = App.date.getTime();

        requestAnimationFrame(App.onFrameUpdate);

        const fpsElapsedTime = App.fullTime - App.fpsLastTime;

        if (fpsElapsedTime > App.fpsInterval) {
            // everything here capped to targetFps
            // time and playtime
            App.time = time;
            App.accurateDeltaTime = time - App.lastTime;
            App.playTime += App.accurateDeltaTime;
            App.lastTime = time;
            App.fpsLastTime = App.fullTime - (fpsElapsedTime % App.fpsInterval);

            // simulating offline progression
            if (App.accurateDeltaTime > 5000) {
                App.pet?.simulateAwayProgression?.(App.accurateDeltaTime);
            }

            // deltaTime
            App.deltaTime = clamp(App.accurateDeltaTime, 0, 100);

            // drawing
            App.drawer?.draw();
            App.onDraw?.();
            App.registeredDrawEvents.forEach((fn) => fn?.());
        }

        // App.drawer.pixelate();
        // App.drawUI();
        // document.querySelector('.background-canvas').getContext('2d').drawImage(App.drawer.canvas, 0, 0);
    },
    onPeriodicUpdate: () => {
        if (
            App.pet.stats.is_egg ||
            App.pet.stats.is_at_parents ||
            App.pet.stats.is_at_vacation ||
            App.pet.stats.is_dead
        )
            return;

        const date = new Date();

        // the reminder
        if (
            App.pet.stats.is_revived_once &&
            date.getHours() === 3 &&
            App.currentScene === App.scene.home &&
            App.pet.stats.is_sleeping &&
            !App.haveAnyDisplays() &&
            !App.pet.isDuringScriptedState() &&
            !App.getRecord("thereminder")
        ) {
            App.setRecord("thereminder", Date.now());
            const toLetters = (text) => text
            .split("")
            .map(letter =>
                `<span
                    class="random-letter-bounce"
                    style="
                        animation-delay: -${Math.random() * 1250}ms;
                        --direction: ${100 * randomFromArray([-1, 1])};
                        opacity: 1 !important;
                    "
                >${letter}</span>`)
            .join("");
            App.handlers.show_letter({
                headline: `${toLetters("Beware. Visitor. and one who remains.")}`,
                text: `<div>${toLetters("w░43337")}.<br>${toLetters("s░666666666664")}</div>`,
                sender: `${toLetters("Your's truly, th░. ..igi▓.l")}`,
            });
        }

        // automatic birthday
        if (App.settings.automaticAging) {
            const nextAutomaticBirthday =
                App.petDefinition.getNextAutomaticBirthdayDate();
            if (moment().isAfter(nextAutomaticBirthday)) {
                if (
                    !App.canProceed(
                        "auto_birthday_event",
                        App.constants.ONE_MINUTE * 30,
                    )
                ) {
                    return;
                }
                App.queueEvent(() => {
                    Activities.birthday();
                    App.sendAnalytics(
                        "auto_age_up_live",
                        App.petDefinition.lifeStage,
                    );
                }, "automatic_birthday_party");
            }
        }

        // school invite
        if (
            App.petDefinition.lifeStage >= PetDefinition.LIFE_STAGE.child &&
            App.petDefinition.lifeStage <= PetDefinition.LIFE_STAGE.teen &&
            !App.pet.stats.has_received_school_invite &&
            !App.pet.stats.is_sleeping
        ) {
            App.pet.stats.has_received_school_invite = true;
            setTimeout(
                () => {
                    App.queueEvent(() => {
                        Activities.getMail({
                            onEndFn: () => {
                                App.handlers.show_letter({
                                    headline: "Official School Invitation",
                                    text: `Dear ${App.userName},<br>${App.petDefinition.name} is now old enough to start school.<br><br>Please make sure they show up to their classes every day, no skipping!`,
                                    sender: "School Administration",
                                });
                            },
                            noSceneSwitch: true,
                        });
                    }, "get_school_invitation");
                },
                random(1000, 2000),
            );
            return;
        }

        // newspaper delivery
        const newspaperDeliveryMs = App.getRecord("newspaper_delivery_ms") || 0;
        const shouldDeliver =
            moment().startOf("day").diff(moment(newspaperDeliveryMs), "days") >
            0;
        if (
            shouldDeliver &&
            !App.pet.stats.is_sleeping &&
            App.canProceed("newspaper_delivery", App.constants.ONE_MINUTE * 20)
        ) {
            setTimeout(
                () => {
                    App.queueEvent(() => {
                        Activities.getMail();
                        App.setRecord("newspaper_delivery_ms", Date.now());
                    }, "newspaper_delivery");
                },
                random(1000, 2000),
            );
            return;
        }

        // getting robbed
        if (
            App.currentScene === App.scene.home &&
            App.pet.stats.is_sleeping &&
            !App.pet.isDuringScriptedState() &&
            App.sky.name === "night" &&
            App.canProceed(
                "roll_rob_encounter",
                App.constants.ONE_MINUTE * 10,
            ) &&
            random(0, 100) <= 10 &&
            App.canProceed("get_robbed", App.constants.ONE_HOUR)
        ) {
            return Activities.getRobbed();
        }

        if (App.time < App.constants.ONE_SECOND * 30) {
            return false;
        }

        // receive friend letters
        const friendsPendingLetterResponse = App.petDefinition.friends.filter(
            (def) => {
                if (!def.stats.player_sent_letter) return false;
                const responseTime = moment(
                    def.stats.player_sent_letter.time,
                ).add(6, "hours");
                if (moment().isAfter(responseTime)) return true;
            },
        );
        if (friendsPendingLetterResponse.length) {
            const friendDef = friendsPendingLetterResponse[0];
            const { rating } = friendDef.stats.player_sent_letter;
            if (
                App.canProceed(
                    "get_letter_response",
                    App.constants.ONE_MINUTE * 15,
                )
            ) {
                const { LETTER_SCORE_RATING } = App.constants;
                const ratingMap = {
                    [LETTER_SCORE_RATING.awful]: "awful",
                    [LETTER_SCORE_RATING.bad]: "bad",
                    [LETTER_SCORE_RATING.good]: "good",
                    [LETTER_SCORE_RATING.medium]: "medium",
                };
                const ratingKey = ratingMap[rating] || "medium";

                const getLetterResponse = () =>
                    randomFromArray(App.definitions.letterResponses[ratingKey]);
                const getGift = () => {
                    if (rating === LETTER_SCORE_RATING.good)
                        return [
                            ...App.definitions.pools.items(),
                            ...App.definitions.pools.accessories(),
                            ...App.definitions.pools.exclusivePotions(),
                        ];
                    if (rating === LETTER_SCORE_RATING.medium)
                        return [
                            ...App.definitions.pools.food(),
                            App.definitions.pools.goldDef(10, 70),
                        ];
                    return false;
                };
                const getFriendshipGain = () => {
                    switch (rating) {
                        case LETTER_SCORE_RATING.awful:
                            return -10;
                        case LETTER_SCORE_RATING.bad:
                            return 0;
                        case LETTER_SCORE_RATING.good:
                            return random(10, 15);
                        default:
                            return random(3, 7);
                    }
                };

                const giftPool = getGift();
                const response = `${getLetterResponse().replaceAll("%name%", App.petDefinition.name)} ${giftPool ? `<br><br>I've sent you a gift, hope you like!` : ""}`;
                const friendshipGain = getFriendshipGain();

                return setTimeout(
                    () => {
                        App.queueEvent(() => {
                            friendDef.increaseFriendship(friendshipGain);
                            friendDef.stats.player_sent_letter = false;
                            Activities.getMail({
                                onEndFn: () => {
                                    App.handlers.show_letter({
                                        headline: "",
                                        text: response,
                                        sender: `${friendDef.getAvatar()}`,
                                        onClose: () => {
                                            if (!giftPool) return;
                                            Activities.openGenericGift({
                                                onMiddle: () => {
                                                    App.pullFromPool(giftPool);
                                                },
                                            });
                                        },
                                    });
                                },
                                noSceneSwitch: true,
                            });
                        }, "get_friend_letter");
                    },
                    random(1000, 2000),
                );
            }
        }

        if (App.pet.stats.is_sleeping) return;

        // random friend call
        if (
            !App.haveAnyDisplays() &&
            App.currentScene === App.scene.home &&
            random(0, 100) < 4 &&
            App.petDefinition.friends.length
        ) {
            if (App.canProceed("friend_call", App.constants.ONE_HOUR * 1)) {
                App.queueEvent(App.handlers.receive_friend_call, "friend_call");
                return;
            }
        }

        // ask to be petted
        if (
            !App.haveAnyDisplays() &&
            App.currentScene === App.scene.home &&
            random(0, 100) < 3 &&
            App.pet.stats.current_care >= 2 &&
            App.playTime > App.constants.ONE_MINUTE * 30 &&
            !App.isOnElectronClient
        ) {
            if (
                App.canProceed("ask_to_be_petted", App.constants.ONE_HOUR * 2)
            ) {
                App.queueEvent(() => Activities.pet(2000), "ask_to_be_petted");
                return;
            }
        }
    },
    onDraw: () => {},
    preloadImages: function (urls) {
        const promises = urls.map((url) => {
            return new Promise((resolve, reject) => {
                const image = new Image();

                image.src = App.checkResourceOverride(url);

                image.onload = () => resolve(image);
                // image.onerror = () => reject(`Image failed to load: ${url}`);
                image.onerror = () => {
                    const fallbackDataUri =
                        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAYdEVYdFNvZnR3YXJlAFBhaW50Lk5FVCA1LjEuNBLfpoMAAAC2ZVhJZklJKgAIAAAABQAaAQUAAQAAAEoAAAAbAQUAAQAAAFIAAAAoAQMAAQAAAAIAAAAxAQIAEAAAAFoAAABphwQAAQAAAGoAAAAAAAAAYAAAAAEAAABgAAAAAQAAAFBhaW50Lk5FVCA1LjEuNAADAACQBwAEAAAAMDIzMAGgAwABAAAAAQAAAAWgBAABAAAAlAAAAAAAAAACAAEAAgAEAAAAUjk4AAIABwAEAAAAMDEwMAAAAADX5rshveZftAAAADNJREFUOE9jZGBg+M+ABxzHL83AhC5AKhg1YDAYwHic4T/eiLZkYEQXQgEUu2DUgMFgAABKkwXjX3A3rgAAAABJRU5ErkJggg==";
                    const fallbackImage = new Image();
                    fallbackImage.src = fallbackDataUri;
                    resolve(fallbackImage);
                };
            });
        });

        return Promise.all(promises);
    },
    getPreloadedResource: (url) => {
        const preloadedResource = App.preloadedResources[url];
        if (!preloadedResource) {
            const image = new Image();
            image.src = App.checkResourceOverride(url);
            return image;
        }
        return preloadedResource;
    },
    resourceOverrides: {},
    checkResourceOverride: function (res) {
        if (!res) return res;
        return this.resourceOverrides[res.replace(location.href, "")] || res;
    },
    isTester: function () {
        if (App.settings.isTester) return true;
        return false;
        const testers = ["Saman", "samandev"];
        return testers.includes(App.userName) || App.ENV == "dev";
    },
    addEvent: function (name, payload, force) {
        if (!App.gameEventsHistory[name] || force) {
            App.gameEventsHistory[name] = true;
            payload?.();
            return true;
        }
        return false;
    },
    getEvent: function (name) {
        return App.gameEventsHistory[name];
    },
    addRecord: function (name, value = 1, shouldReplaceValue) {
        const currentValue = this.getRecord(name) || 0;
        this.records[name] = shouldReplaceValue ? value : currentValue + value;
        return this.records[name];
    },
    setRecord: function (name, value) {
        return this.addRecord(name, value, true);
    },
    getRecord: function (name) {
        return this.records[name];
    },
    deleteRecord: function (name) {
        delete this.records[name];
    },
    indexUIElement: (element) => {
        if (!element) return;

        const activeIndex = App.temp.fbKeepIndex || 0;

        // reset fbKeepIndex flag
        if (App.temp.fbKeepIndex) App.temp.fbKeepIndex = false;

        if (element?.hasAttribute?.("data-ui-indexed")) return;
        element?.setAttribute?.("data-ui-indexed", 1);

        const items = [
            ...element?.querySelectorAll?.("button, a, [data-fb-focusable]"),
        ];
        items?.forEach((item, i) => item?.setAttribute("data-ui-index", i));
        items[activeIndex]?.setAttribute("data-is-ui-active", "true");
    },
    handleShellButton: (buttonNumber) => {
        const classicMainMenuFallback =
            App.settings?.classicMainMenuUI &&
            !App.temp.classicMainMenuContainer?.classList?.contains(
                "disabled",
            ) &&
            App.temp.classicMainMenuContainer;
        const currentDisplay =
            App.getCurrentDisplay() || classicMainMenuFallback;

        const getItems = () => [
            ...currentDisplay.querySelectorAll("[data-ui-index]"),
        ];
        const handleNoDisplay = () => {
            if (
                App.disableGameplayControls &&
                Boolean(App.gameplayControlsOverwrite)
            )
                App.playSound("resources/sounds/ui_click_01.ogg", true);
            else App.playSound("resources/sounds/ui_click_09.ogg");
        };

        if (!currentDisplay) return handleNoDisplay();

        const displayActiveItemIndex =
            parseInt(currentDisplay.dataset.activeItemIndex) || 0;

        const items = getItems();
        const activeElement =
            currentDisplay.querySelector('[data-is-ui-active="true"]') ||
            items[displayActiveItemIndex];
        if (!activeElement) return handleNoDisplay();
        const activeIndex =
            displayActiveItemIndex ||
            items?.findIndex((el) => el === activeElement);

        const isActiveElementDisabled =
            activeElement.disabled ||
            activeElement?.classList?.contains("disabled");

        const updateActiveElement = (
            currentIndex = activeIndex,
            currentItems = items,
        ) => {
            const currentElement = currentItems[currentIndex];
            currentElement?.setAttribute("data-is-ui-active", "true");
            currentElement?.scrollIntoView({
                behavior: "smooth",
                block: "end",
            });
            currentDisplay.dataset.activeItemIndex = currentIndex;
        };

        switch (buttonNumber) {
            case 0:
                activeElement.removeAttribute("data-is-ui-active");

                let newActiveIndex = activeIndex,
                    newActiveElement;
                for (let i = 0; i < items.length; i++) {
                    newActiveIndex += 1;
                    if (newActiveIndex >= items.length) newActiveIndex = 0;
                    newActiveElement =
                        items[newActiveIndex] ||
                        currentDisplay.querySelector(
                            `[data-ui-index='${newActiveIndex}']`,
                        );
                    if (newActiveElement) break;
                }

                if (newActiveIndex !== activeIndex)
                    App.playSound("resources/sounds/ui_click_08.ogg", true);
                else App.playSound("resources/sounds/ui_click_04.ogg", true);

                updateActiveElement(newActiveIndex);
                break;
            case 1:
                if (isActiveElementDisabled) {
                    return App.playSound(
                        "resources/sounds/ui_click_04.ogg",
                        true,
                    );
                }
                if (activeElement.hasAttribute("data-fb-keep-index")) {
                    App.temp.fbKeepIndex = activeIndex;
                }
                activeElement?.click();
                setTimeout(() => updateActiveElement(undefined, getItems()));
                break;
            case 2:
                if (activeIndex !== 0) {
                    App.playSound("resources/sounds/ui_click_08.ogg", true);
                    activeElement.removeAttribute("data-is-ui-active");
                    updateActiveElement(0);
                } else {
                    const backBtn = currentDisplay?.querySelector(".back-btn");
                    if (backBtn) backBtn.click();
                    else
                        App.playSound("resources/sounds/ui_click_04.ogg", true);
                }
                break;
        }
    },
    handleInputCode: function (rawCode) {
        const { addEvent } = App;

        function showAlreadyUsed() {
            App.displayPopup(`You can only use this code once`);
            return false;
        }

        if (rawCode.indexOf(App.constants.INPUT_BASE_64) === 0) {
            rawCode = atob(rawCode.replace(App.constants.INPUT_BASE_64, ""));
        }

        let code = rawCode.toString().toUpperCase();

        let codeEventId = `input_code_event_${code}`;

        switch (code) {
            case "ERROR":
                App.displayPopup(`Exec undefinedFunction`);
                undefinedFunction();
                break;
            case "XUZFWQ":
                if (
                    !addEvent(codeEventId, () => {
                        App.pet.stats.gold += 250;
                    })
                )
                    return showAlreadyUsed();
                App.displayPopup(
                    `Congratulations! ${App.petDefinition.name} got $250!`,
                    5000,
                );
                break;
            case "PRNCSS":
                if (
                    !addEvent(codeEventId, () => {
                        App.displayPopup(`Success!`, 5000, () => {
                            App.closeAllDisplays();
                            Activities.redecorRoom();
                            App.scene.home.image =
                                App.definitions.room_background.princess.image;
                        });
                    })
                )
                    return showAlreadyUsed();
                break;
            case "HESOYAM":
                App.displayPopup(`All you had to do ...`, 5000, () => {
                    App.pet.stats.gold += 2500;
                    App.pet.stats.current_care = App.pet.stats.max_care;
                    App.pet.stats.current_health = App.pet.stats.max_health;
                });
                break;
            case "C29YCNK":
                if (
                    !addEvent(codeEventId, () => {
                        const goldAmount = 300,
                            missionPtsAmount = 250;
                        App.displayPopup(
                            `Sorry for the inconvenience, here's <b>${missionPtsAmount} mission pts</b> and <b>$${goldAmount}</b>!`,
                            5000,
                            () => {
                                App.pet.stats.gold += goldAmount;
                                Missions.currentPts += missionPtsAmount;
                            },
                        );
                    })
                )
                    return showAlreadyUsed();
                break;
            case "TAMAWEBGIFT":
                if (
                    !addEvent(codeEventId, () => {
                        App.displayPopup(
                            `You've redeemed <b>$1000</b>!<br><br> Thanks for playing!`,
                            5000,
                            () => {
                                App.pet.stats.gold += 1000;
                            },
                        );
                    })
                )
                    return showAlreadyUsed();
                break;
            // update specific
            case "FRUITCOL":
            case "QUICHE":
            case "HAGGLER":
                if (
                    !addEvent(codeEventId, () => {
                        const goldAmount = 150,
                            missionPtsAmount = 50;
                        App.pet.stats.gold += goldAmount;
                        Missions.currentPts += missionPtsAmount;
                        App.displayPopup(
                            `You've redeemed <b>$${goldAmount}</b>, <b>${missionPtsAmount} Mission pts</b>!`,
                            4000,
                        );
                    })
                )
                    return showAlreadyUsed();
                break;
            case "THANKYOU":
                if (
                    !addEvent(codeEventId, () => {
                        const goldAmount = 300,
                            missionPtsAmount = 100;
                        App.displayPopup(
                            `You've redeemed <b>$${goldAmount}</b>, <b>${missionPtsAmount} Mission pts</b>!`,
                            4000,
                        );
                    })
                )
                    return showAlreadyUsed();
                break;
            case "JINIINTHEBOTTLE":
                if (
                    !addEvent(codeEventId, () => {
                        const goldAmount = 1000,
                            missionPtsAmount = 100;
                        App.pet.stats.gold += goldAmount;
                        Missions.currentPts += missionPtsAmount;
                        App.displayPopup(
                            `You've redeemed <b>$${goldAmount}</b>, <b>${missionPtsAmount} Mission pts</b>!`,
                            4000,
                        );
                    })
                )
                    return showAlreadyUsed();
                break;
            case "DISCORD8K":
                if (
                    !addEvent(codeEventId, () => {
                        const goldAmount = 3000,
                            missionPtsAmount = 500;
                        App.pet.stats.gold += goldAmount;
                        Missions.currentPts += missionPtsAmount;
                        App.displayPopup(
                            `You've redeemed <b>$${goldAmount}</b>, <b>${missionPtsAmount} Mission pts</b>!`,
                            4000,
                        );
                    })
                )
                    return showAlreadyUsed();
                break;
            default:
                const showInvalidError = () => {
                    App.displayPopup(`Invalid code`);
                };

                const command = /(\S+?) *: *(.+)/g.exec(rawCode);
                if (!command) {
                    showInvalidError();
                    break;
                }
                [, commandType, commandPayload] = command;
                switch (commandType) {
                    case "save":
                        try {
                            const b64 = decodeURIComponent(
                                atob(commandPayload.replace(":endsave", "")),
                            );
                            console.log(b64);
                            let json = JSON.parse(b64);
                            if (!json.pet || typeof json.pet !== "object") {
                                throw "error";
                            }
                            console.log(json);
                            let petDef = json.pet;

                            let def = new PetDefinition().loadStats(petDef);

                            App.displayConfirm(
                                `Are you trying to load <div style="font-weight: bold">${def.getCSprite()} ${def.name}?</div>`,
                                [
                                    {
                                        name: "yes",
                                        onclick: () => {
                                            App.displayConfirm(
                                                `What do you want to do with ${def.name}?`,
                                                [
                                                    {
                                                        name: "as active pet",
                                                        onclick: () => {
                                                            App.displayConfirm(
                                                                `Are you sure? This will <b>remove</b> your current pet`,
                                                                [
                                                                    {
                                                                        name: "yes",
                                                                        onclick:
                                                                            () => {
                                                                                App.displayPopup(
                                                                                    "Loading...",
                                                                                    App.INF,
                                                                                );

                                                                                App.loadFromJson(
                                                                                    json,
                                                                                    () => {
                                                                                        App.displayPopup(
                                                                                            `${def.name} is now your pet!`,
                                                                                            App.INF,
                                                                                        );
                                                                                        setTimeout(
                                                                                            () => {
                                                                                                location.reload();
                                                                                            },
                                                                                            3000,
                                                                                        );
                                                                                    },
                                                                                );
                                                                            },
                                                                    },
                                                                    {
                                                                        name: "no",
                                                                        onclick:
                                                                            () => {},
                                                                    },
                                                                ],
                                                            );
                                                            return true;
                                                        },
                                                    },
                                                    {
                                                        _ignore:
                                                            json.user_id ===
                                                            App.userId,
                                                        name: "add friend",
                                                        onclick: () => {
                                                            App.petDefinition.addFriend(
                                                                def,
                                                            );
                                                            App.closeAllDisplays();
                                                            return App.displayPopup(
                                                                `${def.name} was added to the friends list!`,
                                                                3000,
                                                            );
                                                        },
                                                    },
                                                    {
                                                        name: "cancel",
                                                        class: "back-btn",
                                                        onclick: () => {},
                                                    },
                                                ],
                                            );
                                        },
                                    },
                                    {
                                        name: "no",
                                        class: "back-btn",
                                        onclick: () => {},
                                    },
                                ],
                            );
                        } catch (e) {
                            console.error(e);
                            return App.displayPopup(
                                "Character code is corrupted",
                            );
                        }
                        break;

                    case "setchar":
                        const sprite =
                            PetDefinition.generateFullCSprite(commandPayload);
                        App.displayConfirm(
                            `Are you sure you want to change your pet's sprite to ${sprite}?`,
                            [
                                {
                                    name: "yes",
                                    onclick: () => {
                                        App.petDefinition.sprite =
                                            commandPayload;
                                        App.save();
                                        window.location.reload();
                                    },
                                },
                                {
                                    name: "no",
                                    onclick: () => {},
                                },
                            ],
                        );
                        break;
                    case "settester":
                        App.settings.isTester = commandPayload === "1";
                        App.save();
                        App.displayPopup(
                            `Set tester: ${App.settings.isTester}`,
                            1000,
                            () => window.location.reload(),
                        );
                        break;
                    case "activity:reckoning":
                        Activities.reckoning(true);
                        break;
                    case "give_food_once":
                        const [foodKey, amount] = commandPayload.split("|");
                        const foodDef = App.definitions.food[foodKey];
                        if (!foodDef) return showInvalidError();
                        if (
                            !addEvent(codeEventId, () => {
                                App.addNumToObject(
                                    App.pet.inventory.food,
                                    foodKey,
                                    Number(amount),
                                );
                                App.displayPopup(
                                    `You've redeemed <b>x${amount} ${foodKey}</b>`,
                                    4000,
                                );
                            })
                        )
                            return showAlreadyUsed();
                        break;
                    default:
                        showInvalidError();
                }
        }
    },
    handleInGameEvents: function () {
        // add active pet to collection
        App.handlers.add_active_pet_to_collection();

        if (!App.awayTime || App.awayTime === -1) {
            App.handlers.show_onboarding();
            return;
        }

        const { addEvent } = App;

        if (!App.userName) {
            App.handlers.show_set_username_dialog();
            return;
        }

        // if(addEvent(`bugfix_notice_02`, () => {
        //     App.displayConfirm('<b>Important Update</b><br>The Issue regarding not being able to age up your pet is', [
        //         {
        //             name: 'ok',
        //             class: 'solid primary',
        //             onclick: () => {}
        //         },
        //     ])
        // })) return;

        if (
            addEvent(
                `update_30_notice`,
                () => {
                    App.displayList([
                        {
                            name: `New update is available!<b> <div><small>${VERSION}</small></div> ${App.getBadge("new!")}`,
                            type: "text",
                            solid: true,
                            bold: true,
                        },
                        {
                            name: `
                        <img class="update-banner" src="resources/img/ui/update_banner.png"></img>
                        <br>
                        <div>
                            Check out the new:
                            <ul style="margin: 6px 0px 6px -22px;" class="bold">
                                <li>Fruit Collector Mini-game</li>
                                <li>5 New Personality Traits</li>
                                <li>New Food and Snack</li>
                                <li>Improvements and bugfixes</li>
                            </ul>
                            and more!
                        </div>
                    `,
                            type: "text",
                        },
                        /* {
                    name: `
                        <div>
                        Check out the new <b>Personality Traits</b>, <b>Dig Treasure Activity</b>, <b>Leaves Mini-game</b>, <b>Move Out Interactions</b> and a lot more!
                        </div>
                    `,
                    type: 'text',
                }, */
                        {
                            link: App.routes.BLOG,
                            name: "see whats new",
                            class: "solid primary",
                            onclick: () => {
                                App.sendAnalytics("go_to_blog_whats_new");
                            },
                        },
                    ]);
                },
                false,
            )
        )
            return;

        if (
            addEvent("itch_rating_dialog", () => {
                App.handlers.show_rating_dialog();
                App.sendAnalytics("rating_auto_shown");
            })
        )
            return;

        // if(addEvent(`smallchange_01_notice`, () => {
        //     App.displayConfirm('The <b>Stay with parents</b> option is now moved to the <i class="fa-solid fa-house-chimney-user"></i> care menu', [
        //         {
        //             name: 'ok',
        //             class: 'solid primary',
        //             onclick: () => {}
        //         },
        //     ])
        // })) return;

        /* if(addEvent(`game_suggestions_poll_01`, () => {
            App.displayPrompt(`<b><small>Poll</small></b>what would you like to to be added in the next update?`, [
                {
                    name: 'send',
                    onclick: (data) => {
                        if(!data) return true;
                        App.displayPopup(`<b>Suggestion sent! thanks!</b><br> here's $200 for participating!`, 4000, () => {
                            App.pet.x = '50%';
                            App.pet.playCheeringAnimation();
                        });
                        App.pet.stats.gold += 200;
                        App.sendAnalytics('game_suggestions_poll_01', data);
                    },
                },
                {
                    name: 'cancel',
                    onclick: () => {
                        App.sendAnalytics('game_suggestions_poll_01', 'action_user_cancel');
                    },
                }
            ]);
        })) return;  */

        if (
            addEvent(`discord_server_02_notice`, () => {
                App.displayConfirm(
                    `<b>We have a Discord server!</b><br>Join us for early sneak peeks at upcoming features, interact with our community, and more!`,
                    [
                        {
                            link: App.routes.DISCORD,
                            name: "join (+$200)",
                            onclick: () => {
                                App.pet.stats.gold += 200;
                                App.sendAnalytics("discord_02_notice_accept");
                                return false;
                            },
                        },
                        {
                            name: "cancel",
                            class: "back-btn",
                            onclick: () => {
                                App.displayPopup(
                                    "You can join the server through <b>Settings > Join Discord</b> if you ever change your mind",
                                    5000,
                                );
                            },
                        },
                    ],
                );
                App.sendAnalytics("discord_02_notice_shown");
            })
        )
            return;
    },
    setScene(scene, noPositionChange, onLoadArg) {
        App.currentSceneObject?.removeObject();

        App.currentScene?.onUnload?.(scene);

        App.currentSceneObject = new Object2d({ x: 0, y: 0 });

        App.currentScene = scene;
        if (!noPositionChange) {
            App.pet.x = scene.petX || "50%";
            App.pet.y = scene.petY || "100%";
            App.pet.positionOffset.x = 0;
            App.pet.positionOffset.y = 0;
        }
        // todo: get rid of this
        if (scene.foodsX) App.foods.x = scene.foodsX;
        if (scene.foodsY) App.foods.y = scene.foodsY;
        App.background.setImg(scene.image, true);

        if (scene.onLoad) {
            scene.onLoad(onLoadArg);
        }

        this.applySky();
    },
    reloadScene(noPositionChange) {
        App.setScene(App.currentScene, noPositionChange);
    },
    isRoomFurnishable() {
        return App.scene.home.image?.includes("furnishable/");
    },
    getFurnishableBackground(backgroundSrc) {
        return backgroundSrc
            .replace("house/", "house/furnishable/")
            .replace("outside/", "outside/furnishable/");
    },
    getFurnitureDefFromId(id) {
        return App.definitions.furniture.find((current) => current.id === id);
    },
    handleFurnitureSpawn(furnitureData = App.ownedFurniture, removeOnly) {
        if (App.activeFurnitureObjects?.length) {
            App.activeFurnitureObjects.forEach((o) => o.removeObject());
        }

        App.activeFurnitureObjects = [];

        if (removeOnly || !App.isRoomFurnishable()) return;

        furnitureData.forEach?.((furniture) => {
            if (!furniture.isActive) return;
            const furnitureDef = App.getFurnitureDefFromId(furniture.id);
            if (!furnitureDef)
                return console.log("furniture was not found", furniture);
            let lastY = -App.INF,
                lastPetY = -App.INF;
            const furnitureObject = new Object2d({
                // image: App.preloadedResources[furnitureDef.image],
                img: furnitureDef.image,
                x: furniture.x || 0,
                y: furniture.y || 0,
                z: furniture.z || App.constants.BACKGROUND_Z + 0.1,
                z: App.pet.z,
                localZ: 0,
                def: furniture,
                onDraw: (me) => {
                    furnitureDef.onDraw?.(me);

                    if (lastY === me.y && lastPetY === App.pet.y) return;
                    lastY = me.y;
                    lastPetY = App.pet.y;
                    App.pet.setLocalZBasedOnSelf(me);
                },
            });
            App.activeFurnitureObjects.push(furnitureObject);
        });

        return App.activeFurnitureObjects;
    },
    editFurniture(gameObject, callbackFn) {
        if (!gameObject) return false;

        App.toggleGameplayControls(false);
        const editDisplay = document.createElement("div");
        editDisplay.className = "absolute-fullscreen";
        document.querySelector(".screen-wrapper").appendChild(editDisplay);
        editDisplay.close = () => editDisplay.remove();
        editDisplay.innerHTML = `
            <div class="directional-control__container display">
                <div class="controls-y">
                    <button class="control" id="up"><i class="fa fa-angle-up"></i></button>
                    <div class="controls-x">
                        <button class="control" id="left"><i class="fa fa-angle-left"></i></button>
                        <button class="control" id="right"><i class="fa fa-angle-right"></i></button>
                    </div>
                    <div class="bottom-container">
                        <button class="control" id="cancel"><i class="fa fa-times"></i></button>
                        <button class="control" id="down"><i class="fa fa-angle-down"></i></button>
                        <button class="control" id="apply"><i class="fa fa-check"></i></button>
                    </div>
                </div>
            </div>
        `;

        let blinkerFloat = 0;
        const onEditDrawEvent = () => {
            blinkerFloat += 0.0085 * App.deltaTime;
            blinkerFloat = blinkerFloat % App.PI2;
            gameObject.opacity = Math.max(
                0.65,
                0.65 + Math.sin(blinkerFloat) * 0.2,
            );
        };
        App.registerOnDrawEvent(onEditDrawEvent);

        const objectInitialPosition = {
            x: gameObject.x,
            y: gameObject.y,
            z: gameObject.z,
        };

        const leftButton = editDisplay.querySelector(".control#left");
        const rightButton = editDisplay.querySelector(".control#right");
        const upButton = editDisplay.querySelector(".control#up");
        const downButton = editDisplay.querySelector(".control#down");
        [leftButton, rightButton, upButton, downButton].forEach((button) => {
            button.onclick = () => {
                moveObject(button);
            };
        });

        const moveObject = (button) => {
            const unit = 2.4;
            switch (button) {
                case leftButton:
                    gameObject.x -= unit;
                    break;
                case rightButton:
                    gameObject.x += unit;
                    break;
                case upButton:
                    gameObject.y -= unit;
                    break;
                case downButton:
                    gameObject.y += unit;
                    break;
            }
            App.playSound("resources/sounds/ui_click_04.ogg");
            App.vibrate();
        };

        const onEndFn = (state) => {
            App.toggleGameplayControls(true);
            editDisplay.close();
            App.unregisterOnDrawEvent(onEditDrawEvent);
            gameObject.opacity = 1;
            callbackFn?.(state);
        };

        editDisplay.querySelector("#apply").onclick = () => {
            App.playSound("resources/sounds/ui_click_03.ogg");
            App.vibrate();
            App.displayConfirm(`Do you want to save the current placement?`, [
                {
                    name: "yes",
                    onclick: () => {
                        gameObject.def.x = gameObject.x;
                        gameObject.def.y = gameObject.y;
                        gameObject.def.z = gameObject.z;
                        onEndFn(true);
                    },
                },
                {
                    name: "no",
                    class: "back-btn",
                    onclick: () => {},
                },
            ]);
        };
        editDisplay.querySelector("#cancel").onclick = () => {
            App.playSound("resources/sounds/ui_click_02.ogg");
            App.vibrate();
            App.displayConfirm(
                `Are you sure you want to cancel the current placement?`,
                [
                    {
                        name: "yes",
                        onclick: () => {
                            gameObject.x = objectInitialPosition.x;
                            gameObject.y = objectInitialPosition.y;
                            gameObject.z = objectInitialPosition.z;
                            onEndFn(false);
                        },
                    },
                    {
                        name: "no",
                        class: "back-btn",
                        onclick: () => {},
                    },
                ],
            );
        };

        App.sendAnalytics("edit_furniture");
        return true;
    },
    handleGardenPlantsSpawn(shouldSpawn) {
        this.spawnedPlants?.forEach((o) => o.removeObject());

        if (!shouldSpawn) {
            return false;
        }

        const getPlantPosition = (i) => {
            const xOffset = 2,
                yOffset = 40;
            const maxCols = 4;
            return {
                x: i % maxCols === 0 ? xOffset : xOffset + 23 * (i % maxCols),
                y: yOffset + Math.floor(i / maxCols) * 20,
            };
        };

        this.spawnedPlants = [];
        for (let i = 0; i < App.constants.MAX_PLANTS; i++) {
            let currentPlant = App.plants?.at(i);

            const position = getPlantPosition(i);
            const patch = new Object2d({
                img: `resources/img/misc/garden_patch_01.png`,
                x: position.x,
                y: position.y + 12,
                depthMode: Object2d.DEPTH_MODE.none,
                // prevent patches from sharing 1 image element
                noPreload: true,
            });
            currentPlant?.createObject2d(patch);
            this.spawnedPlants.push(patch);
        }
    },
    handleAnimalsSpawn(shouldSpawn) {
        this.spawnedAnimals?.forEach?.((o) => o?.removeObject?.());

        if (!shouldSpawn) {
            return false;
        }

        const getSpawnableAnimals = () => {
            switch (App.currentScene) {
                case App.scene.home:
                    return App.animals.list?.filter(
                        (animalDef) =>
                            animalDef.spawnIndoors && !animalDef.shouldLeave(),
                    );
            }

            return App.animals.list;
        };

        this.spawnedAnimals = getSpawnableAnimals()?.map((animalDef) => {
            const animal = new Animal(animalDef, {
                x: random(0, App.drawer.bounds.width),
            });
            animal.y = animal.getValidRandomYPosition();
            return animal;
        });
    },
    applySky() {
        const { AFTERNOON_TIME, EVENING_TIME, NIGHT_TIME } = App.constants;
        const date = new Date();
        const h = App.clampWithin24HourFormat(
            new Date().getHours() + App.settings.sleepingHoursOffset,
        );
        // const h = 20;

        const isOutside = App.background.imageSrc?.indexOf("outside/") != -1;

        const season = App.getSeason();

        // weather
        App.skyWeather.z = isOutside ? 999.1 : -998;

        let weatherEffectChance = random(3, 10, date.getDate());
        if (App.isDuringChristmas()) weatherEffectChance += 25;
        if (App.isChristmasDay()) weatherEffectChance += 100;

        // pRandom setup
        pRandom.save();
        const seed = h + date.getDate() + App.userId;
        pRandom.seed = seed;

        // weather effect
        let weatherEffect = "rain";
        switch (season) {
            case "spring":
                break;
            case "summer":
                break;
            case "autumn":
                weatherEffectChance += 5;
                weatherEffect = pRandomFromArray([
                    "snow",
                    "rain",
                    "rain",
                    "rain",
                ]);
                break;
            case "winter":
                weatherEffectChance += 15;
                weatherEffect = "snow";
                break;
        }
        App.setWeather(weatherEffect);
        App.skyWeather.hidden = !pRandom.getPercent(weatherEffectChance);

        // pRandom reset
        pRandom.load();

        // sky
        let sky;
        if (h >= AFTERNOON_TIME[0] && h < AFTERNOON_TIME[1]) sky = "afternoon";
        else if (h >= EVENING_TIME[0] && h < EVENING_TIME[1]) sky = "evening";
        else if (h >= NIGHT_TIME[0] || h < NIGHT_TIME[1]) sky = "night";
        else sky = "morning";

        // weather / season affecting sky
        let renderedSky = sky;
        switch (season) {
            case "winter":
                // if(sky === 'evening') renderedSky = 'afternoon_cold';
                break;
        }
        if (!App.skyWeather.hidden) {
            const currentWeather = App.skyWeather.name;
            switch (currentWeather) {
                case "rain":
                    if (sky === "afternoon") renderedSky = "morning";
                    break;
                case "snow":
                    if (sky === "afternoon") renderedSky = "morning";
                    if (sky === "night") renderedSky = "night_cold";
                    if (sky === "evening") renderedSky = "evening_cold";
                    break;
            }
        }

        App.sky.name = sky;
        App.sky.setImage(
            App.preloadedResources[
                `resources/img/background/sky/${renderedSky}.png`
            ],
        );
        App.skyOverlay.setImage(
            App.preloadedResources[
                `resources/img/background/sky/${renderedSky}_overlay.png`
            ],
        );
        setTimeout(() => (App.skyOverlay.hidden = !isOutside));
        if (sky == "afternoon" || sky == "morning")
            App.skyOverlay.hidden = true;
    },
    setWeather(type) {
        switch (type) {
            case "rain":
                App.skyWeather.image =
                    App.preloadedResources[
                        "resources/img/background/sky/rain_01.png"
                    ];
                App.skyWeather.composite = "xor";
                App.skyWeather.flipSpeed = 200;
                break;
            case "snow":
                App.skyWeather.image =
                    App.preloadedResources[
                        "resources/img/background/sky/snow_01.png"
                    ];
                App.skyWeather.composite = "normal";
                App.skyWeather.flipSpeed = 400;
                break;
        }
        App.skyWeather.name = type;
    },
    isWeatherEffectActive() {
        return !App.skyWeather.hidden;
    },
    applyRoomCustomizations(data) {
        if (typeof data !== "object" || !data) return;
        Object.keys(data).forEach((key) => {
            const scene = App.scene[key];
            if (!scene) return console.error("Invalid scene:", key);
            scene.image = data[key].image;
        });
        App.reloadScene();
    },
    getRandomAnimalDef: function (type) {
        const animalGroups = {};
        animalGroups.cat = ANIMAL_CHARACTERS.filter((char) =>
            char.includes("cat"),
        );
        animalGroups.dog = ANIMAL_CHARACTERS.filter((char) =>
            char.includes("dog"),
        );
        animalGroups.other = ANIMAL_CHARACTERS.filter(
            (char) =>
                !animalGroups.cat.includes(char) &&
                !animalGroups.dog.includes(char),
        );

        if (type && !(type in animalGroups)) {
            console.error("Invalid Animal Group type: ", type);
            type = null;
        }

        const typesArray = type
            ? [animalGroups[type]]
            : [
                  // increases the chance of dogs and cats
                  animalGroups.cat,
                  animalGroups.dog,
                  animalGroups.cat,
                  animalGroups.dog,
                  animalGroups.cat,
                  animalGroups.dog,
                  animalGroups.other,
              ];

        const sprite = randomFromArray(randomFromArray(typesArray));

        const animal = new AnimalDefinition({
            name: getRandomName(false, true),
            sprite,
        });

        return animal;
    },
    getRandomPetDef: function (age = PetDefinition.LIFE_STAGE.adult, seed) {
        pRandom.save();
        let rndArrayFn = randomFromArray;

        if (seed !== undefined) {
            pRandom.seed = seed;
            rndArrayFn = pRandomFromArray;
        }

        let sprite;
        switch (age) {
            case PetDefinition.LIFE_STAGE.baby:
                sprite = rndArrayFn(PET_BABY_CHARACTERS);
                break;
            case PetDefinition.LIFE_STAGE.child:
                sprite = rndArrayFn(PET_CHILD_CHARACTERS);
                break;
            case PetDefinition.LIFE_STAGE.teen:
                sprite = rndArrayFn(PET_TEEN_CHARACTERS);
                break;
            case PetDefinition.LIFE_STAGE.elder:
                sprite = rndArrayFn(PET_ELDER_CHARACTERS);
                break;
            default:
                sprite = rndArrayFn(PET_ADULT_CHARACTERS);
                break;
        }

        let pet = new PetDefinition({
            sprite,
            name: getRandomName(seed ? seed : false),
        });
        pet.setStats({
            current_hunger: 100,
            current_sleep: 100,
            current_fun: 100,
        });
        pRandom.load();
        return pet;
    },
    getPetDefFromParents: function (parentA, parentB) {
        // parents are petDefinition
        // parentA is the main parent

        parentA.stats.player_friendship = 100;
        parentA.stats.is_player_family = true;
        parentB.stats.player_friendship = 80;
        parentB.stats.is_player_family = true;

        // new pet
        const sprite = PetDefinition.getOffspringSprite(parentA, parentB);
        const newPetDefinition = new PetDefinition({
            name: getRandomName(),
            sprite,
        }).setStats({ is_egg: true, is_ghost: parentB.stats.is_ghost });
        if (parentA.traits?.length) {
            newPetDefinition.traits = [randomFromArray(parentA.traits)];
        }

        newPetDefinition.friends = [parentA, parentB];
        newPetDefinition.family = [
            ...parentA.family,
            [parentA, parentB].map((parent) => App.minimalizePetDef(parent)),
        ];

        newPetDefinition.inventory = parentA.inventory;
        newPetDefinition.stats.gold = parentA.stats.gold + random(50, 150);
        newPetDefinition.stats.current_health = 100;

        return newPetDefinition;
    },
    minimalizePetDef: function (petDef) {
        return {
            sprite: petDef.sprite,
            name: petDef.name,
            birthday: petDef.birthday,
            accessories: petDef.accessories || [],
            lastBirthday: petDef.lastBirthday,
            stats: {
                is_ghost: petDef.stats.is_ghost,
            },
        };
    },
    createActivePet: function (petDef, props = {}) {
        if (petDef.sprite)
            App.handlers.add_active_pet_to_collection(petDef.sprite);

        let registeredInteractionDetector;

        const unregisterInteractionDetector = () => {
            App.unregisterOnDrawEvent(interactionHandler);
            registeredInteractionDetector = null;
        };

        const interactionHandler = () => {
            if (!App.pet.isInteractingWith && App.mouse.isDownMs < 200) {
                return;
            }

            // unregister if no longer hovering over and interaction not started
            if (
                (!App.pet.isInteractingWith && !App.pet.isHovered) ||
                (!App.mouse.isDown && !App.pet.isInteractingWith)
            )
                return unregisterInteractionDetector();

            if (!App.pet.isInteractingWith) {
                App.vibrate();
            }

            // end interaction
            if (!App.mouse.isDown) {
                App.pet.isInteractingWith = false;
                App.disableGameplayControls = false;
                App.pet.handleDirectInteractionEnd();
                return unregisterInteractionDetector();
            }

            if (App.pet.isDuringScriptedState()) {
                if (!App.pet.isInteractingWith) App.mouse.isDown = false;
                return;
            }

            App.pet.handleDirectInteractionStart();
            App.disableGameplayControls = true;
        };

        return new Pet(petDef, {
            z: App.constants.ACTIVE_PET_Z,
            scale: 1,
            castShadow: true,
            ...props,
            onHover: (me) => {
                if (
                    registeredInteractionDetector ||
                    !App.mouse.isDown ||
                    App.currentScene !== App.scene.home ||
                    App.disableGameplayControls ||
                    App.haveAnyDisplays()
                )
                    return;

                registeredInteractionDetector =
                    App.registerOnDrawEvent(interactionHandler);
            },
        });
    },
    transferAndGetFreshEgg: (addToPredecessors = true) => {
        const lastPet = App.petDefinition;
        App.pet.removeObject();
        App.petDefinition = new PetDefinition({
            name: getRandomName(),
            sprite: randomFromArray(PET_BABY_CHARACTERS),
        }).setStats({ is_egg: true });

        App.petDefinition.inventory = lastPet.inventory;
        App.petDefinition.stats.gold = lastPet.stats.gold;
        App.petDefinition.deceasedPredecessors = [
            ...(lastPet?.deceasedPredecessors ?? []),
        ];
        if (addToPredecessors) {
            App.petDefinition.deceasedPredecessors.push({
                birthday: lastPet.birthday,
                family: lastPet.family,
                sprite: lastPet.sprite,
                name: lastPet.name,
            });
        }

        App.pet = App.createActivePet(App.petDefinition);
        setTimeout(() => {
            Activities.playEggUfoAnimation(() =>
                App.handlers.show_set_pet_name_dialog(),
            );
        }, 100);
        App.setScene(App.scene.home);
        App.toggleGameplayControls(true);
    },
    _queueEventKeys: {},
    queueEvent: function (payloadFn, eventKey = App.time + Math.random()) {
        if (this._queueEventKeys[eventKey]) {
            // event already queued
            return false;
        }
        this._queueEventKeys[eventKey] = true;

        const checkForDecentTime = () => {
            if (
                App.pet.isDuringScriptedState() ||
                App.haveAnyDisplays() ||
                App.pet.stats.is_egg ||
                App.pet.stats.is_dead ||
                App.pet.stats.is_at_parents ||
                App.currentScene !== App.scene.home
            )
                return;

            App.unregisterOnDrawEvent(checkForDecentTime);
            payloadFn?.();
            delete this._queueEventKeys[eventKey];
        };
        App.registerOnDrawEvent(checkForDecentTime);
    },
    runRandomEncounters: function (source = "initial") {
        if (
            App.pet.stats.is_egg ||
            App.pet.stats.is_at_parents ||
            App.pet.stats.is_at_vacation ||
            App.pet.stats.is_dead
        )
            return;

        if (!App.temp.sourceRandomEncounterRan) {
            if (source !== "initial") {
                return;
            }
            App.temp.sourceRandomEncounterRan = true;
        }

        if (!this.canProceed("random_encounters", App.constants.ONE_MINUTE))
            return;

        const canRunEncounter = (targetSource) => {
            if (source === "initial") return true;
            return source === targetSource;
        };

        // revived encounter
        if (
            canRunEncounter("initial") &&
            App.pet.stats.is_revived_once &&
            random(0, 1300) === 13
        ) {
            return Activities.reckoning();
        }

        // entity encounter
        const encounterChance = App.pet.stats.is_revived_once
            ? random(0, 128)
            : random(0, 256);
        if (canRunEncounter("home") && encounterChance === 1) {
            return Activities.encounter();
        }
    },
    toggleGameplayControls: function (state, onclick, triggerFeedback = true) {
        App.disableGameplayControls = !state;
        App.gameplayControlsOverwrite = onclick;
        App.gameplayControlsTriggerFeedback = triggerFeedback;
        if (App.disableGameplayControls && !onclick) {
            App.drawer.canvas.style.cursor = "not-allowed";
        } else {
            App.drawer.canvas.style.cursor = "pointer";
        }
        if (App.settings.classicMainMenuUI) {
            if (state)
                document
                    .querySelector(".classic-main-menu__container")
                    .classList.remove("disabled");
            else
                document
                    .querySelector(".classic-main-menu__container")
                    .classList.add("disabled");
        }
        return;
    },
    getGameplayControlsState: function () {
        return {
            state: !App.disableGameplayControls,
            onclick: App.gameplayControlsOverwrite,
            triggerFeedback: App.gameplayControlsTriggerFeedback,
        };
    },
    createProgressbar: function (percent) {
        let progressbar = document
            .querySelector(".cloneables .progressbar")
            .cloneNode(true);

        let rod = progressbar.querySelector(".progressbar-rod"),
            background = progressbar.querySelector(".progressbar-background");

        let colors = {
            green: ["#04E762", "#93C48B"],
            red: ["#ED254E", "#ED254E"],
            yellow: ["#FDBA70", "#FF8300"],
        };

        function setPercent(percent) {
            rod.style.width = `${percent}%`;

            let colorSet = colors.green;
            if (percent < 30) colorSet = colors.red;
            else if (percent < 60) colorSet = colors.yellow;

            let rodColor = `linear-gradient(90deg, ${colorSet[0]}, ${colorSet[1]})`;
            rod.style.background = rodColor;

            background.style.background = `repeating-linear-gradient(90deg, ${colorSet[1]} 5px, ${colorSet[1]} 7px, transparent 6px, transparent 10px)`;
        }

        setPercent(percent);

        return {
            node: progressbar,
            setPercent,
        };
    },
    createStepper: function (maxSteps, currentStep) {
        const element = document.createElement("div");
        element.className = "stepper";
        element.innerHTML = `
            ${new Array(maxSteps)
                .fill(undefined)
                .map(
                    (_, i) => `
                <div
                    class="stepper__step ${i + 1 <= currentStep ? "active" : ""}"
                >
                    <span class="stepper__text">
                    <i class="fa fa-solid fa-check"></i>
                    </span>
                </div>
            `,
                )
                .join("\n")}
        `;

        return { node: element };
    },
    createTimerBar: function (time, onEnd) {
        const TICK = 100;
        let remainingMs = time;

        const element = UI.create({
            className: "timer-bar__container",
            children: [
                {
                    id: "progress",
                    className: "timer-bar__progress",
                },
            ],
        });
        const progressElement = element.querySelector("#progress");
        progressElement.style.transitionDuration = `${TICK}ms`;

        const interval = setInterval(() => {
            if (remainingMs <= 0) handleOnEnd();

            const percent = (remainingMs * 100) / time;
            progressElement.style.width = `${percent}%`;

            remainingMs -= TICK;
        }, TICK);

        const handleOnEnd = () => {
            onEnd?.();
            element?.remove?.();
            clearInterval(interval);
        };

        const abort = () => {
            element?.remove?.();
            clearInterval(interval);
        };

        return {
            node: element,
            abort,
        };
    },
    createRangeSlider: function ({
        min = 0,
        max = 100,
        dataList,
        _disable,
        ...rest
    } = {}) {
        const listId = hashCode(Math.random().toString());

        const element = UI.create({
            children: [
                {
                    componentType: "input",
                    type: "range",
                    list: listId,
                    min,
                    max,
                    ...rest,
                    disabled: _disable,
                    attributes: [
                        // ['data-fb-focusable', 1],
                        [
                            "oninput",
                            `App.playSound('resources/sounds/ui_click_08.ogg')`,
                        ],
                    ],
                },
                {
                    _ignore: !dataList,
                    componentType: "datalist",
                    id: listId,
                    children: dataList?.map(([value, label]) => ({
                        componentType: "option",
                        value,
                        label,
                    })),
                },
            ],
        });
        return element;
    },
    closeAllDisplays: function () {
        [...document.querySelectorAll(".display")].forEach((display) => {
            if (!display.closest(".cloneables")) {
                // display.close();
                if (display.close) display.close();
                else display.remove();
            }
        });
    },
    haveAnyDisplays: function () {
        return !![...document.querySelectorAll(".screen-wrapper .display")]
            .length;
    },
    initTab: function (element) {
        const tabs = element.querySelector(".tabs");
        if (!tabs) return;
        const tabTitles = [...element.querySelectorAll(".tab-title")];
        const tabContents = [...element.querySelectorAll(".tab")];
        tabTitles.forEach((tabTitle) => {
            const forWhichElement = tabTitle.getAttribute("for");
            const correspondingContent = tabContents.find(
                (t) => t.id === forWhichElement,
            );
            tabTitle.onclick = () => {
                [...tabTitles, ...tabContents].forEach((e) =>
                    e.classList.remove("active"),
                );
                tabTitle.classList.add("active");
                correspondingContent.classList.add("active");
            };
        });
        tabTitles.at(0).click();
    },
    getCurrentDisplay: function () {
        const sortedDisplays = [
            ...document.querySelectorAll(".screen-wrapper .display"),
        ].sort((a, b) => Number(a.style.zIndex) - Number(b.style.zIndex));
        return sortedDisplays.at(-1);
    },
    displayPhoneMenu: function (listItems) {
        // const list = document.querySelector('.cloneables .generic-grid-container').cloneNode(true);
        const container = UI.genericListContainer();
        container.classList.add("phone-container");
        const list = UI.create({
            parent: container,
            className: "phone-menu",
            children: [
                {
                    className: "flex flex-wrap flex-gap-1 phone-menu-list",
                    children: listItems.map((item, index) => ({
                        componentType: "div",
                        className:
                            "phone-app flex flex-dir-col justify-center align-center flex-grow",
                        style: "width: 45%",
                        children: [
                            {
                                componentType: "button",
                                className: "flex flex-center",
                                innerHTML: `${App.getIcon(item.icon, true)} ${item.isNew ? App.getBadge("new!") : ""}`,
                                onclick: item.onclick,
                                disabled: item._disable,
                                style: `--index: ${index}; --rotate: ${random(0, 180)}deg;`,
                            },
                            {
                                componentType: "span",
                                className: "ellipsis",
                                innerHTML: item.name,
                            },
                        ],
                    })),
                },
            ],
        });

        list.close = function () {
            list.remove();
        };

        document.querySelector(".screen-wrapper").appendChild(container);

        return container;
    },
    displayList: function (listItems, backFn, backFnTitle) {
        const list = UI.genericListContainer(backFn, backFnTitle);
        list._listItems = listItems;

        listItems.forEach((item, i) => {
            if (item._ignore) return;
            if (!item.name) item.name = "";

            let element;
            let defaultClassName;

            switch (item.type) {
                case "empty":
                    element = document.createElement("p");
                    element.innerHTML = item.name;
                    defaultClassName = ``;
                    break;
                case "info":
                case "text":
                    element = document.createElement("p");
                    element.innerHTML = item.name;
                    defaultClassName = `inner-padding b-radius-10 uppercase list-text ${item.solid ? "solid-" : ""}surface-stylized ${item.bold ? "text-bold" : ""}`;
                    if (item.type === "info") {
                        element.innerHTML = `
                            <small>
                                ${App.getIcon(item.icon || "info-circle", true)}
                                ${item.name}
                            </small>
                        `;
                    }
                    break;
                case "separator":
                    element = document.createElement("hr");
                    defaultClassName = "content-separator";
                    break;
                case "element":
                    element = item.innerHTML;
                    defaultClassName = ``;
                    break;
                default:
                    element = document.createElement(
                        item.link ? "a" : "button",
                    );
                    if (item.link) {
                        element.href = item.link;
                        element.target = "_blank";
                    }
                    if (item.icon) {
                        item.name = `<i class="fa-solid fa-${item.icon} corner-icon"></i> ${item.name}`;
                    }
                    if (i == listItems.length - 2)
                        element.className += " last-btn";
                    // '⤳ ' +
                    if (
                        item.name.indexOf("<") == -1 &&
                        item.name.indexOf("/") == -1
                    )
                        item.name = ellipsis(item.name, item.ellipsisLength);
                    element.innerHTML = item.name;
                    element.disabled = item._disable;
                    element.style = `--child-index:${Math.min(i, 10) + 1}`;
                    element.onclick = () => {
                        App.playSound(`resources/sounds/ui_click_01.ogg`, true);
                        UI.lastClickedButton = element;
                        let result = item.onclick(element, list);
                        if (!result) {
                            list.close();
                        }
                    };
                    defaultClassName = "generic-btn stylized mute";
            }

            element.className =
                defaultClassName + (item.class ? " " + item.class : "");

            if (item.style) element.style = item.style;
            if (item.id) element.id = item.id;

            item._mount?.(element);
            element._mount = () => item._mount?.(element);
            list.appendChild(element);
        });

        document.querySelector(".screen-wrapper").appendChild(list);

        return list;
    },
    displayGrid: function (listItems) {
        let list = document
            .querySelector(".cloneables .generic-grid-container")
            .cloneNode(true);

        list.close = function () {
            list.remove();
        };

        listItems.forEach((item) => {
            let button = document.createElement("button");
            button.className = "grid-item " + (item.class ? item.class : "");
            button.innerHTML = item.name;
            button.onclick = () => {
                let result = item.onclick(button, list);
                if (!result) {
                    list.close();
                }
            };
            list.appendChild(button);
        });

        document.querySelector(".screen-wrapper").appendChild(list);

        return list;
    },
    display2xGrid: function (listItems) {
        const list = document
            .querySelector(".cloneables .generic-grid-container")
            .cloneNode(true);
        list.classList.add("flex-wrap", "flex-gap-1");

        list.close = function () {
            list.remove();
        };

        listItems.forEach((item) => {
            let button = document.createElement("button");
            button.className =
                "grid-item-2x generic-btn stylized " +
                (item.class ? item.class : "");
            button.innerHTML = item.name;
            button.onclick = () => {
                let result = item.onclick(button, list);
                if (!result) {
                    list.close();
                }
            };
            list.appendChild(button);
        });

        document.querySelector(".screen-wrapper").appendChild(list);

        return list;
    },
    displaySlider: function (listItems, activeIndex, options, additionalText) {
        const hasIndexMenu = listItems.some((item) => item?.shortName);

        let list = document
            .querySelector(".cloneables .generic-slider-container")
            .cloneNode(true);

        if (activeIndex !== 0 && !activeIndex) {
            list.classList.add("menu-animation");
        }

        let maxIndex = listItems.length,
            currentIndex = Math.min(activeIndex, listItems.length - 1) || 0,
            contentElement = list.querySelector(".content"),
            acceptBtn = list.querySelector("#accept-btn"),
            cancelBtn = list.querySelector("#cancel-btn");

        list.close = function () {
            list.remove();
        };

        cancelBtn.innerHTML =
            options?.cancel ||
            /* '<i class="fa-solid fa-arrow-left"></i>' || */ '<i class="fa-solid fa-arrow-left"></i>';
        acceptBtn.innerHTML = options?.accept || "Accept";
        const defaultAcceptButtonLabel = acceptBtn.innerHTML;

        list.getCurrentIndex = () => currentIndex;

        cancelBtn.onclick = () => {
            options?.onCancel?.();
            list.close();
        };

        changeIndex = (diff = 0, asAbsoluteIndex) => {
            currentIndex += diff;
            if (currentIndex >= maxIndex) currentIndex = 0;
            else if (currentIndex < 0) currentIndex = maxIndex - 1;

            if (asAbsoluteIndex) currentIndex = diff;

            let item = listItems[currentIndex];
            let itemContent = document.createElement("div");
            itemContent.className =
                "slider-item" + (item.class ? item.class : "");
            itemContent.innerHTML = item.name;
            itemContent.setAttribute("data-index", currentIndex);
            acceptBtn.innerHTML = item.acceptLabel || defaultAcceptButtonLabel;
            acceptBtn.disabled = item.disabled;
            acceptBtn.onclick = () => {
                let result = item.onclick(itemContent, list);
                if (!result) {
                    list.close();
                }
            };

            let animationStart =
                diff < 0
                    ? "slider-item-anim-in-left"
                    : "slider-item-anim-in-right";
            itemContent.style.animation = `${diff ? animationStart : ""} 0.1s linear forwards`;

            contentElement.innerHTML = "";
            contentElement.appendChild(itemContent);
        };

        const displayItemsList = () => {
            App.displayList(
                listItems?.map((item, index) => ({
                    _disable: item.disabled,
                    name: item.shortName,
                    class: index === currentIndex ? "active" : "",
                    onclick: () => {
                        changeIndex(index, true);
                    },
                })),
                null,
                "Back",
            );
        };

        list.querySelector(".slide-left").onclick = () => {
            contentElement.querySelector(".slider-item").style.animation =
                "slider-item-anim-out-right 0.1s linear forwards";
            setTimeout(() => changeIndex(-1), 150);
            App.playSound(`resources/sounds/ui_click_01.ogg`, true);
        };
        list.querySelector(".slide-right").onclick = () => {
            contentElement.querySelector(".slider-item").style.animation =
                "slider-item-anim-out-left 0.1s linear forwards";
            setTimeout(() => changeIndex(1), 150);
            App.playSound(`resources/sounds/ui_click_01.ogg`, true);
        };

        if (additionalText) {
            list.querySelector(".top-slot.left").innerHTML = additionalText;
        } else list.querySelector(".top-slot.left").remove();

        if (hasIndexMenu) {
            const rightSlot = list.querySelector(".top-slot.right");
            rightSlot.innerHTML = `<div class="pointer-events-none">${App.getIcon("list", true)}</div>`;
            rightSlot.classList.add("cursor-pointer", "click-sound");
            rightSlot.onclick = displayItemsList;
        } else list.querySelector(".top-slot.right").remove();

        if (maxIndex === 1) {
            list.querySelector(".slide-left").classList.add("disabled");
            list.querySelector(".slide-right").classList.add("disabled");
        }

        changeIndex();

        document.querySelector(".screen-wrapper").appendChild(list);

        return list;
    },
    displayMessageBubble: function (content, icon = "", pitch) {
        let splitContent = content;
        if (!containsHtmlTags(content)) {
            splitContent = content
                .split("")
                .map(
                    (letter, index) =>
                        `<span style="animation-delay: ${index * 0.05}s">${letter}</span>`,
                )
                .join("");
        }
        const display = App.displayEmpty(
            "bg-transparent pointer-events-none overflow-hidden",
        );
        display.close = () => {
            UI.fadeOut(display.querySelector(".message-bubble"));
            setTimeout(() => display.remove(), 1000);
        };

        let speechIndex = 0;
        const speechSoundInterval = setInterval(() => {
            if (speechIndex++ >= content.length) {
                return clearInterval(speechSoundInterval);
            }
            if (icon) App.playSpeechSound(content[speechIndex], pitch);
        }, 50);

        const iconContent = !icon
            ? ""
            : `<div class="message-bubble_icon">${icon}</div>`;

        display.innerHTML = `<div class="message-bubble">${iconContent}${splitContent}</div>`;
        display.classList.remove("display");
        return display;
    },
    displayPopup: function (content, ms, onEndFn, isReveal) {
        let popup = document
            .querySelector(".cloneables .generic-list-container")
            .cloneNode(true);
        popup.classList.add("popup");
        if (isReveal) popup.classList.add("revealing");
        popup.innerHTML = `
                <div class="uppercase flex-center">
                    <div class="inner-padding b-radius-10 surface-stylized">
                        ${content}
                    </div>
                </div>
            `;
        popup.style["z-index"] = 3;
        popup.style["background"] = "var(--background-c)";
        popup.close = () => {
            popup.remove();
            if (onEndFn) {
                onEndFn();
            }
        };
        UI.attachScrollableIndicator(popup);
        setTimeout(() => {
            popup.close();
        }, ms || 2000);
        document.querySelector(".screen-wrapper").appendChild(popup);
        return popup;
    },
    displayConfirm: function (text, buttons) {
        let list = document
            .querySelector(".cloneables .generic-list-container")
            .cloneNode(true);
        list.classList.add("confirm", "inline-flex-between");
        list.innerHTML = `
                <div class="uppercase flex-center flex-1 height-auto">
                    <div class="inner-padding b-radius-10 surface-stylized">
                        ${text}
                    </div>
                </div>
                <div class="buttons-container"></div>
            `;
        list.style["z-index"] = 3;
        list.style["background"] = "var(--background-d)";

        list.close = function () {
            list.remove();
        };
        UI.attachScrollableIndicator(list);

        const btnContainer = list.querySelector(".buttons-container");
        buttons.forEach((def) => {
            if (def._ignore) return;

            const btn = document.createElement(def.link ? "a" : "button");
            if (def.link) {
                btn.href = def.link;
                btn.target = "_blank";
            }
            btn.innerHTML = def.name;
            btn.className = `generic-btn stylized ${def.class || ""}`;
            btn.disabled = def._disable;
            if (def.name == "back") btn.className += " back-btn";
            btn.onclick = () => {
                if (!def.onclick()) list.close();
            };
            btnContainer.appendChild(btn);
        });

        document.querySelector(".screen-wrapper").appendChild(list);
        return list;
    },
    displayPrompt: function (
        text,
        buttons,
        defaultValue,
        inputType = "input",
        placeholder = "",
    ) {
        let list = document
            .querySelector(".cloneables .generic-list-container")
            .cloneNode(true);
        list.classList.add("prompt");
        list.innerHTML = `
                ${
                    text
                        ? `
                    <div class="uppercase flex-center">
                        <div class="inner-padding b-radius-10 surface-stylized">
                            ${text}
                        </div>
                    </div>
                `
                        : ""
                }
                <div class="buttons-container"></div>
            `;
        list.style["z-index"] = 3;

        list.close = function () {
            list.remove();
        };
        UI.attachScrollableIndicator(list);

        const btnContainer = list.querySelector(".buttons-container");

        const input = document.createElement(inputType);
        input.setAttribute("spellcheck", false);
        input.setAttribute("placeholder", placeholder);
        if (defaultValue !== undefined) input.value = defaultValue;

        list.insertBefore(input, btnContainer);

        buttons.forEach((def) => {
            if (def._ignore) return;

            const btn = document.createElement("button");
            btn.innerHTML = def.name;
            btn.className = `generic-btn stylized ${def.class || ""}`;
            btn.onclick = () => {
                if (!def.onclick(input.value)) list.close();
            };
            btnContainer.appendChild(btn);
        });

        document.querySelector(".screen-wrapper").appendChild(list);
        input.focus();
        return list;
    },
    displayEmpty: function (addClass) {
        let display = document
            .querySelector(".cloneables .generic-empty-container")
            .cloneNode(true);
        if (addClass) display.className += " " + addClass;
        document.querySelector(".screen-wrapper").appendChild(display);
        display.close = function () {
            display.remove();
        };
        return display;
    },
    displayUiModal: function (content) {
        let modal = document.createElement("div");
        modal.className = "modal";
        modal.innerHTML = content;
        document.body.appendChild(modal);
    },
    getBadge: function (text, color, expirationDate) {
        if (!text && text !== "") text = "new!";
        if (!color) color = "red";

        if (expirationDate) {
            if (moment(expirationDate).isBefore(moment())) return "";
        }

        return `<span class="badge ${color}">${text}</span>`;
    },
    drawUI: function () {
        App.drawer.drawImmediate({
            x: 5,
            y: 50,
            width: 25,
            height: 25,
            // image: "resources/img/background/house/kitchen_01.png",
            text: "HEY",
        });
    },
    initSound: function () {
        try {
            this.audioChannel = new AudioChannel({
                preloadList: SOUNDS,
            });
        } catch (e) {}

        // button click event
        const clickSoundClassNames = ["click-sound", "list-item", "tab-title"];
        const backSoundClassNames = ["back-btn", "back-sound"];
        document.addEventListener("click", (e) => {
            // sfx
            if (
                clickSoundClassNames.some((n) =>
                    e.target.classList.contains(n),
                ) ||
                e.target.nodeName.toLowerCase() === "button" ||
                e.target.parentElement?.nodeName.toLowerCase() === "button"
            ) {
                App.vibrate();
                if (
                    !e.target.classList.contains("mute") &&
                    !e.target.parentElement?.classList.contains("mute")
                ) {
                    if (
                        backSoundClassNames.some((n) =>
                            e.target.classList.contains(n),
                        ) ||
                        e.target.textContent.toLowerCase() === "back"
                    )
                        this.playSound(
                            `resources/sounds/ui_click_02.ogg`,
                            true,
                        );
                    else
                        this.playSound(
                            `resources/sounds/ui_click_01.ogg`,
                            true,
                        );
                }
            }

            // menu animation
            if (
                e.target.classList.contains("back-btn") ||
                e.target.parentElement?.classList.contains("back-btn")
            ) {
                const previousListItem = [
                    ...document.querySelectorAll(
                        ".screen-wrapper .generic-list-container",
                    ),
                ].at(-1);
                if (previousListItem) {
                    previousListItem.transitionAnim?.();
                    [...previousListItem.children].forEach((child) =>
                        child?._mount?.(child),
                    );
                }
                UI.lastClickedButton = null;
            }
        });
    },
    formatTo12Hours: function (hour) {
        return hour > 12 ? hour - 12 + "pm" : hour + "am";
    },
    getDayId: function (forCurrentUser) {
        if (forCurrentUser) {
            return +(App.getDayId() + (App.userId || 1234))
                .toString()
                .slice(0, 10);
        }

        const date = new Date();
        return +`${date.getFullYear()}${date.getMonth()}${date.getDate() + 2}`;
    },
    isSalesDay: function () {
        let day = new Date().getDate();
        return [7, 12, 18, 20, 25, 29, 30].includes(day);
    },
    isDuringChristmas: function () {
        return moment().isBetween(
            moment(App.constants.CHRISTMAS_TIME.start, "MM-DD"),
            moment(App.constants.CHRISTMAS_TIME.end, "MM-DD"),
            null,
            "[]",
        );
    },
    isChristmasDay: function () {
        return moment().isSame(
            moment(App.constants.CHRISTMAS_TIME.absDay, "MM-DD"),
            "day",
        );
    },
    isSleepHour: function (hour = new Date().getHours()) {
        return App.isWithinHour(
            hour,
            App.constants.SLEEP_START + App.settings.sleepingHoursOffset,
            App.constants.SLEEP_END + App.settings.sleepingHoursOffset,
        );
    },
    getSeason: function (date = moment()) {
        if (App.settings.season !== "auto") {
            return App.settings.season;
        }

        const month = date.month(); // 0 = january, 11 = december

        if (month >= 2 && month <= 4) {
            return "spring"; // march, april, may
        } else if (month >= 5 && month <= 7) {
            return "summer"; // june, july, august
        } else if (month >= 8 && month <= 10) {
            return "autumn"; // september, october, november
        } else {
            return "winter"; // december, january, february
        }
    },
    getSeasonColor: function (name) {
        const { SEASON_COLORS } = App.constants;
        const { source } = SEASON_COLORS;

        const currentSeason = SEASON_COLORS[name] || SEASON_COLORS["spring"];
        const [shadow, base, highlight] = currentSeason;

        return [
            [source.shadow0, shadow],
            [source.shadow1, shadow],
            [source.base, base],
            [source.highlight, highlight],
        ];
    },
    isWithinHour: function (current, start, end) {
        start = App.clampWithin24HourFormat(start);
        end = App.clampWithin24HourFormat(end);
        current = App.clampWithin24HourFormat(current);
        if (start <= end) {
            return current >= start && current < end;
        } else {
            return current >= start || current < end;
        }
    },
    getOutOfStockCounter: (seed = random(1, 999999999)) => {
        pRandom.save();
        pRandom.seed = seed;
        const randomArray = new Array(100)
            .fill(50)
            .map(() => pRandom.getIntBetween(0, 100))
            .reverse();
        pRandom.load();
        let pointer = 0;

        const isOutOfStock = (percent) => {
            pointer += 1;
            if (pointer >= randomArray.length) pointer = 0;
            return (randomArray.at(pointer) || 50) < percent;
        };

        return isOutOfStock;
    },
    clampWithin24HourFormat: function (hour) {
        return ((hour % 24) + 24) % 24;
    },
    getFoodCSprite: function (index) {
        const { FOOD_SPRITESHEET_DIMENSIONS, FOOD_SPRITESHEET } = App.constants;
        const size =
            FOOD_SPRITESHEET_DIMENSIONS.rows *
            FOOD_SPRITESHEET_DIMENSIONS.cellSize;
        return `<c-sprite
            naturalWidth="${size}"
            naturalHeight="${size}"
            width="${FOOD_SPRITESHEET_DIMENSIONS.cellSize}" height="${FOOD_SPRITESHEET_DIMENSIONS.cellSize}"
            index="${index - 1}"
            src="${FOOD_SPRITESHEET}"></c-sprite>`;
    },
    getItemCSprite: function (index) {
        const { ITEM_SPRITESHEET_DIMENSIONS, ITEM_SPRITESHEET } = App.constants;
        const size =
            ITEM_SPRITESHEET_DIMENSIONS.rows *
            ITEM_SPRITESHEET_DIMENSIONS.cellSize;
        return `<c-sprite
            naturalWidth="${size}"
            naturalHeight="${size}"
            width="${ITEM_SPRITESHEET_DIMENSIONS.cellSize}"
            height="${ITEM_SPRITESHEET_DIMENSIONS.cellSize}"
            index="${index - 1}"
            src="${ITEM_SPRITESHEET}"></c-sprite>`;
    },
    getAccessoryCSprite: function (name) {
        const current = App.definitions.accessories[name];
        const image = App.checkResourceOverride(current.icon || current.image);
        return current.icon
            ? `<div style="width: 1"><img style="width: 36px; outline: none" src="${image}"></img></div>`
            : `<c-sprite width="64" height="36" index="0" src="${image}"></c-sprite>`;
    },
    getGenericCSprite: function (
        index,
        spritesheetImg,
        dimensions,
        className = "",
        additional = "",
    ) {
        const size = dimensions.rows * dimensions.cellSize;
        return `<c-sprite
            naturalWidth="${size}"
            naturalHeight="${size}"
            width="${dimensions.cellSize}"
            height="${dimensions.cellSize}"
            index="${index - 1}"
            class="${className}"
            src="${spritesheetImg}"
            ${additional}></c-sprite>`;
    },
    getTraitCSprite: (traitName, className = "icon") => {
        const definition = Object.entries(App.definitions.traits).find(
            ([key, content]) => key === traitName,
        )?.[1];

        if (!definition) return "";

        return App.getGenericCSprite(
            definition.icon + 1,
            "resources/img/misc/traits_01.png",
            {
                cellSize: 22,
                rows: 11,
            },
            className,
        );
    },
    getPersona: function (name, image) {
        return `
            <img style="height: inherit; width: 32px; object-fit: contain; margin-right: 10px" src="${image}"></img>
            <span class="overflow-hidden ellipsis">${name}<span>
        `;
    },
    getHarvestIcons: function (
        plantNameList,
        delimiter = " + ",
        disabledClassName = "",
    ) {
        return plantNameList
            .map((plantName) => {
                const hasInInventory = App.pet.inventory.harvests[plantName];
                return Plant.getCSprite(
                    plantName,
                    undefined,
                    hasInInventory ? "enabled" : disabledClassName,
                );
            })
            .join(delimiter);
    },
    getHarvestInventoryUI: function (filterFn = () => true) {
        const harvestsToShow = Object.keys(App.pet.inventory.harvests)
            .map((name) => ({
                amount: App.pet.inventory.harvests[name],
                name,
                def: Plant.getDefinitionByName(name),
            }))
            .filter((item) => item.amount)
            .filter(filterFn);

        if (!harvestsToShow.length) {
            return App.getEmptyStateUI("Empty inventory");
        }

        return `
        ${harvestsToShow
            .map(
                (item) =>
                    `<div onclick="App.displayPopup('${item.name} <div><b>x${item.amount}</b></div>')" class="flex align-center flex-gap-05">${Plant.getCSprite(item.name)} <span><small>x</small>${item.amount}</span></div>`,
            )
            .join("")}
        `;
    },
    getEmptyStateUI: function (text, icon = "fa-ghost") {
        return `<small class="flex-center width-full flex-gap-05 opacity-half">
            <i class="fa-solid ${icon}"></i>
            <i>${text}</i>
        </small>`;
    },
    getUidUI: () => {
        const UID = App.userName
            ? `${(App.userName ?? "") + "-" + App.userId?.toString().slice(0, 5)}`
            : "";
        const isClipboardAvailable =
            "clipboard" in navigator && !App.isOnItch && UID;
        return `
            <div class="user-id surface-stylized inner-padding text-transform-none">
                <div class="flex flex-dir-col">
                    <small>uid:</small>
                    <span>${UID}</span>
                </div>
                <small onclick="App.handlers.copyToClipboard('${UID}')" class="${isClipboardAvailable ? "flex" : "hidden"} justify-end">
                    <button class="generic-btn stylized uppercase" id="copy-btn">
                        <i class="fa-solid fa-copy"></i>
                    </button>
                </small>
            </div>
        `;
    },
    getFavoriteItemUI: () => {
        return `
            <div class="favorite-item-icon pulse">
                ${App.getIcon("heart", true)}
            </div>
        `;
    },
    pullFromPool: (pool, options = {}) => {
        const {
            isGoldPull = false,
            goldPullDef = App.definitions.pools.goldDef(),
            isDuringChristmas = App.isDuringChristmas(),
        } = options;

        const randomPull =
            isGoldPull && goldPullDef ? goldPullDef : randomFromArray(pool);
        const [min, max] = randomPull.count;
        let count = random(min, max) * (isGoldPull ? 5 : 1);
        if (isDuringChristmas) count *= 2;
        randomPull.onClaim?.(count);
        setTimeout(
            () => App.playSound("resources/sounds/task_complete_02.ogg", true),
            450,
        );
        App.displayPopup(
            `
            <div class="pulse">
                ${randomPull.icon}
            </div>
            <b>${randomPull.name}</b>
            <br>
            <span>x${count}</span>
            <br>
            <span>${randomPull.type}</span>
            ${isDuringChristmas ? App.getBadge("doubled!") : ""}
        `,
            5000,
            null,
            true,
        );
    },
    isCompanionAllowed: function (room) {
        if (!room) room = App.currentScene;

        const allowedScenes = [
            App.scene.home,
            App.scene.bathroom,
            App.scene.kitchen,
            App.scene.graveyard,
            App.scene.parentsHome,
        ];

        return allowedScenes.includes(room);
    },
    getRandomGameplayBuff() {
        return randomFromArray(Object.values(App.definitions.gameplay_buffs))
            .key;
    },
    isGameplayBuffActive: (buffKey) => {
        // currently only check for animals
        // but we can reuse the same method for other buff sources
        const hasBuff = App.animals.list.some((a) => a.stats.buff === buffKey);
        return hasBuff;
    },
    getGameplayBuffDefinitionFromKey: (buffKey) => {
        return App.definitions.gameplay_buffs[buffKey];
    },
    getGameplayBuffUI: (buff) => {
        if (typeof buff === "string")
            buff = App.getGameplayBuffDefinitionFromKey(buff);

        const getTypeUI = () => {
            let color = "";
            switch (buff.type) {
                case "garden":
                    color = "green";
                    break;
            }
            return `<span style="color: ${color}"> <i class="fa-solid fa-arrow-circle-up icon"></i> ${buff.type}</span> Buff`;
        };

        return `
            <div class="font-small flex flex-dir-col gameplay-buff-container">
                <div style="opacity: 0.75;"> ${getTypeUI()} </div>
                <b style="color: #3d00ff"> ${buff.name}</b>
                <i>${buff.description}</i>
            </div>
        `;
    },
    getZodiacSign(date) {
        const ZODIAC_SIGNS = [
            "♈",
            "♉",
            "♊",
            "♋",
            "♌",
            "♍",
            "♎",
            "♏",
            "♐",
            "♑",
            "♒",
            "♓",
        ];
        const day = moment(date).date();
        return ZODIAC_SIGNS[(day - 1) % ZODIAC_SIGNS.length];

        /* // todo: use these when bumping fa to v7.2+
        const ZODIAC_SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
        const day = moment(date).date();
        return ZODIAC_SIGNS[(day - 1) % ZODIAC_SIGNS.length] || 'aries'; */
    },
    getMagic8BallAnswer: () => {
        const positiveAnswers = [
            "It is certain.",
            "It is decidedly so.",
            "Without a doubt.",
            "Yes, definitely.",
            "You may rely on it.",
            "As I see it, yes.",
            "Most likely.",
            "Outlook good.",
            "Yes.",
            "Signs point to yes.",
        ];
        const nonCommittalAnswers = [
            "Reply hazy, try again.",
            "Ask again later.",
            "Better not tell you now.",
            "Cannot predict now.",
            "Concentrate and ask again.",
        ];
        const negativeAnswers = [
            "Don’t count on it.",
            "My reply is no.",
            "My sources say no.",
            "Outlook not so good.",
            "Very doubtful.",
        ];
        const list = [positiveAnswers, nonCommittalAnswers, negativeAnswers];
        const target = randomFromArray(list);
        return randomFromArray(target);
    },
    playSound: function (path, force) {
        if (!App.settings.playSound) return;

        this.audioChannel?.play(path, force);
    },
    playAdvancedSound: function (config) {
        const audioElement = new Audio();
        Object.keys(config).forEach((key) => (audioElement[key] = config[key]));
        audioElement.muted = !App.settings.playSound || !App.settings.playMusic;
        audioElement.play()?.catch?.(() => {});

        let fadeOutEvent = null;
        let stopped = false;

        const cleanup = () => {
            if (stopped) return;
            stopped = true;
            if(fadeOutEvent) App.unregisterOnDrawEvent(fadeOutEvent);
            audioElement.loop = false;
            audioElement.muted = true;
            audioElement.pause();
            audioElement.currentTime = 0;
            audioElement.src = "";
            audioElement.load();
        };

        return {
            element: audioElement,
            stop: (fadeSpeed = 0.0005) => {
                // iOS ignores programmatic volume changes, so fade-out never completes
                if (isIOS()) {
                    cleanup();
                    return;
                }

                fadeOutEvent = App.registerOnDrawEvent(() => {
                    const volume =
                        audioElement.volume - fadeSpeed * App.deltaTime;
                    audioElement.volume = clamp(volume, 0, 1);
                    if (audioElement.volume <= 0) cleanup();
                });
            },
        };
    },
    playSpeechSound: function (letter = "a", pitch = 1) {
        if (!App.settings.playSound) return;

        const muteLetters = [" ", ".", ",", "-"];
        if (muteLetters.includes(letter)) return;

        const maxSamples = 6;
        App.playAdvancedSound({
            src: `resources/sounds/speech/${random(1, maxSamples)}.mp3`,
            playbackRate: pitch,
            preservesPitch: false,
        });
    },
    takeScreenshot: () => {
        if (!App.isTester() && App.haveAnyDisplays()) return;
        const overlay = document.querySelector(".screenshot-overlay");
        UI.show(overlay);
        setTimeout(() => UI.hide(overlay), 250);
        App.playSound("resources/sounds/camera_shutter_01.ogg");
        const name = "Tamaweb_" + moment().format("D-M-YY_h-m-s");
        downloadUpscaledCanvasAsImage(App.drawer.canvas, name, 5);
    },
    handleSequentiallyLoad: async function (loaders) {
        const isValid = (data) => Boolean(data?.lastTime && data.pet?.name);
        let mainData;
        try {
            for (const loader of loaders) {
                const data = await loader();
                if (!mainData) mainData = data; // first loader is main data
                if (data.hasLoadError) throw "LoadError7520";
                if (isValid(data)) return data;
            }
        } catch (e) {
            const _save = App.save;
            App.save = () => {};
            const display = App.displayConfirm(
                `${App.getIcon("warning")} Something went wrong when trying to initialize the load system.`,
                [
                    {
                        name: "Reload",
                        class: "back-btn",
                        onclick: () => {
                            window.location.reload();
                            return true;
                        },
                    },
                    {
                        name: "Continue (Unsafe)",
                        onclick: () => {
                            return App.displayConfirm(
                                `You might lose your progress if you continue!`,
                                [
                                    {
                                        name: "Continue",
                                        onclick: () => {
                                            App.save = _save;
                                            display.close();
                                            return false;
                                        },
                                    },
                                    {
                                        name: "Cancel",
                                        class: "back-btn",
                                        onclick: () => {},
                                    },
                                ],
                            );
                        },
                    },
                    {
                        name: "View Error",
                        onclick: () => {
                            return App.displayConfirm(e, [
                                {
                                    name: "ok",
                                    onclick: () => {},
                                },
                            ]);
                        },
                    },
                ],
            );
            console.error(e);
            App.sendAnalytics("LoaderError", `${e} - ${navigator?.userAgent}`);
            UI.fadeOut(document.querySelector(".loading-text"));
        }

        return mainData;
    },
    save: function (noIndicator) {
        const IS_SAVING_DISABLED = false;

        if (IS_SAVING_DISABLED) {
            if (!App.canProceed("savingDisabledLog", Infinity)) {
                console.log(
                    "%cWARNING: SAVING DISABLED.",
                    "color: red; font-weight: bold; font-size: 30px",
                );
            }
            return;
        }

        if (!App.pet || !App.loadingEnded) return;

        const timeElapsedSinceLastSave = App.time - (App.temp.lastSaved ?? 0);
        if (
            noIndicator &&
            timeElapsedSinceLastSave <
                (App.constants.AUTO_SAVE_INTERVAL_SECS / 2) * 1000
        ) {
            return;
        }

        App.temp.lastSaved = Infinity; // prevent re-saving until save is complete
        const localStorageItemKeys = [
            "user_name",
            "user_id",
            "pet",
            "records",
            "ingame_events_history",
            "missions",
            "furniture",
            "plants",
            "animals",
            "play_time",
            "last_time",
            "settings",
        ];

        let savingData = [];
        const setItem = (key, value) => {
            savingData = [...savingData, [key, value]];

            if (localStorageItemKeys.includes(key)) {
                window.localStorage?.setItem(key, JSON.stringify(value));
            }
        };

        setItem("pet", App.pet.serializeStats());
        setItem("settings", App.settings);
        setItem("last_time", Date.now());
        setItem("user_id", App.userId);
        setItem("user_name", App.userName);
        setItem("ingame_events_history", App.gameEventsHistory);
        setItem("play_time", App.playTime);
        setItem("shell_background_v2.2", App.shellBackground);
        setItem("mods", App.mods);
        setItem("records", App.records);
        setItem("room_customization", {
            home: {
                image: App.scene.home.image,
            },
            bathroom: {
                image: App.scene.bathroom.image,
            },
            kitchen: {
                image: App.scene.kitchen.image,
            },
        });
        setItem("missions", {
            current: Missions.current,
            currentStep: Missions.currentStep,
            currentPts: Missions.currentPts,
            refreshTime: Missions.refreshTime,
        });
        setItem("furniture", App.ownedFurniture);
        setItem("plants", App.plants);
        setItem("animals", {
            ...App.animals,
            list: [...App.animals.list.map((a) => a.serialize())],
        });

        if (!noIndicator) {
            const saveIcon = document.querySelector(".save-indicator");
            saveIcon.style.display = "";
            setTimeout(() => (saveIcon.style.display = "none"), 2000);
        }

        if (!savingData?.length) {
            App.sendErrorLog(`savingData-no-length: ${savingData?.length}`);
            return;
        }
        window.idbKeyval
            ?.setMany(savingData)
            .then(() => (App.temp.lastSaved = App.time))
            .catch((e) => {
                setTimeout(() => (App.temp.lastSaved = App.time), 5000);
                console.error(e);
                App.sendErrorLog(`idbKeyval-setMany: ${e}`);
            });
    },
    load: async function () {
        let hasLoadError = false;
        const getLocalStorageItem = (key) => {
            const item = window.localStorage?.getItem(key);
            try {
                const json = JSON.parse(item);
                return json;
            } catch (e) {}
            return false;
        };
        const getItem = async (key, defaultValue) => {
            if (!window.idbKeyval) {
                hasLoadError = true;
                return defaultValue;
            }
            const value = await window.idbKeyval.get(key);
            const fallbackValue = getLocalStorageItem(key);
            if (fallbackValue && !value) {
                console.log("save data fallback", {
                    key,
                    value,
                    fallbackValue,
                });
            }
            return value !== null && value !== undefined
                ? value
                : fallbackValue || defaultValue;
        };

        const pet = await getItem("pet", {});
        const settings = await getItem("settings", null);
        const lastTime = await getItem("last_time", false);
        const eventsHistory = await getItem("ingame_events_history", null);
        const roomCustomizations = await getItem("room_customization", null);
        const mods = await getItem("mods", App.mods);
        const records = await getItem("records", App.records);

        const userId = await getItem(
            "user_id",
            random(100000000000, 999999999999),
        );
        App.userId = userId;

        const userName = await getItem("user_name", null);
        App.userName = userName === "null" ? null : userName;

        App.playTime = parseInt(await getItem("play_time", 0), 10);

        const shellBackground = await getItem(
            "shell_background_v2.2",
            App.definitions.shell_background.find((shell) => shell.isDefault)
                .image || App.definitions.shell_background[1].image,
        );

        const missions = await getItem("missions", {});
        const furniture = await getItem("furniture", false);
        const plants = await getItem("plants", App.plants);
        const animals = await getItem("animals", App.animals);

        App.loadedData = {
            pet,
            settings,
            lastTime,
            eventsHistory,
            roomCustomizations,
            shellBackground,
            playTime: App.playTime,
            mods,
            records,
            missions,
            furniture,
            plants,
            animals,
            hasLoadError,
        };

        return App.loadedData;
    },
    getDBItems: async function () {
        const entries = await window.idbKeyval.entries();
        return entries.reduce(
            (acc, [key, value]) => (acc = { ...acc, [key]: value }),
            {},
        );

        const keys = await window.idbKeyval.keys();
        const items = {};

        for (const key of keys) {
            items[key] = await window.idbKeyval.get(key);
        }

        return items;
    },
    loadFromJson: async function (json, callbackFn) {
        const ignoreKeys = [
            "user_name",
            "user_id",
            "play_time",
            "last_time",
            "mods",
            "shell_background_v2.2",
        ];
        App.save();
        App.save = () => {};

        // handle animals to update their lastStatsUpdate time to now
        json.animals?.list?.forEach((a) => {
            a.lastStatsUpdate = Date.now();
        });

        // handle auto-age on by resetting last birthday
        if (json.pet) {
            json.pet.birthday = Date.now();
        }

        for (let key of Object.keys(json)) {
            if (ignoreKeys.includes(key)) continue;
            await window.idbKeyval.set(key, json[key]);
        }
        const allowedKeys = [...Object.keys(json), ...ignoreKeys];
        const currentKeys = await window.idbKeyval.keys();
        for (let key of currentKeys) {
            if (!allowedKeys.includes(key)) {
                await window.idbKeyval.del(key);
            }
        }

        callbackFn?.();
    },
    getSaveCode: async function (providedStorage) {
        const storage = providedStorage ?? (await App.getDBItems());
        const serializableStorage = Object.assign({}, storage);
        const unserializableAttributes = ["shell_background_v2.2", "mods"];
        unserializableAttributes.forEach(
            (attribute) => delete serializableStorage[attribute],
        );
        const charCode = `save:${btoa(encodeURIComponent(JSON.stringify(serializableStorage)))}:endsave`;
        return charCode;
    },
    exportSaveCode: async function (providedCode) {
        const loadingPopup = App.displayPopup("loading...");
        const code = providedCode ?? (await App.getSaveCode());
        loadingPopup.close();
        downloadTextFile(
            `${App.petDefinition.name}_${generateTimestamp()}.tws`,
            code,
        );
    },
    vibrate: function (dur, force) {
        if (!App.settings.vibrate && !force) return;
        if (!navigator?.vibrate) return;
        navigator?.vibrate(dur || 35);
    },
    sendAnalytics: function (type, value, force) {
        // Vendored for Easy-Web-TV-M3u8: telemetry stripped (no analytics).
        return;
        if (!force && App.ENV !== "prod") return;

        if (!type) type = "default";

        rudderanalytics.track(type, { value });

        if (App.isOnItch) type += "_itch";
        else if (App.isOnElectronClient) type += "_electron";

        const user = (App.userName ? App.userName + "-" : "") + App.userId;
        const url = `https://docs.google.com/forms/d/e/1FAIpQLSfzl5hhhnV3IAdxuA90ieEaeBAhCY9Bh4s151huzTMeByMwiw/formResponse?usp=pp_url&entry.1384465975=${user}&entry.1653037117=${App.petDefinition?.name || ""}&entry.1322693089=${type}&entry.1403809294=${value || ""}`;

        fetch(url).catch((e) => {});
    },
    sendFeedback: function (text) {
        if (!text) return;

        const sendingText = `[game:${VERSION}-pl:${App.isOnItch ? "itch" : "web"}]: ${text}`;

        const user = (App.userName ? App.userName + "-" : "") + App.userId;
        const url = `https://docs.google.com/forms/d/e/1FAIpQLSenonpIhjHL8BYJbnOHqF2KudJiDciEveJG56BdGsvJ01-rTA/formResponse?usp=pp_url&entry.1753365981=${user}&entry.233513152=${sendingText}`;
        fetch(url).catch((e) => {});
    },
    sendErrorLog: function (error, force) {
        // Vendored for Easy-Web-TV-M3u8: error reporting stripped (no telemetry).
        return;
        if (!force && App.ENV !== "prod") return;

        if (!error) return;

        if (
            App.fullTime - App.temp.lastErrorSent <
            App.constants.ONE_SECOND * 30
        ) {
            return;
        }
        App.temp.lastErrorSent = App.fullTime;

        const versionInfo = `[game:${VERSION}-pl:${App.isOnItch ? "itch" : "web"}]`;
        const user = (App.userName ? App.userName + "-" : "") + App.userId;
        const url = `https://docs.google.com/forms/d/e/1FAIpQLScSloIis4P1yyKQ3imYcaipOk2XS12Qj16ZeM4DicTHi3RSCQ/formResponse?usp=pp_url&entry.1957124188=${user}&entry.1587672397=${`${versionInfo} - ${navigator?.userAgent}`}&entry.36658531=${error}`;
        fetch(url).catch((e) => {});
    },
    installAsPWA: function () {
        if (!App.deferredInstallPrompt) return false;
        App.deferredInstallPrompt.prompt();
        App.deferredInstallPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === "accepted") {
                App.sendAnalytics("pwa_install", navigator?.userAgent);
            } else {
                App.sendAnalytics("pwa_install_cancel", navigator?.userAgent);
            }
        });
    },
    setShellBackground: function (url) {
        if (!url) return;
        document.querySelector(
            "body > div.root > div.dom-shell",
        ).style.backgroundImage = `url(${url})`;
        document.querySelector(".background").style.backgroundImage =
            `url(${url})`;
        App.shellBackground = url;

        document.querySelector(".shell-btn.main").style.backgroundImage =
            `url(${App.shellBackground})`;
        document.querySelector(".shell-btn.right").style.backgroundImage =
            `url(${App.shellBackground})`;
        document.querySelector(".shell-btn.left").style.backgroundImage =
            `url(${App.shellBackground})`;
        return true;
    },
    addNumToObject: function (obj, key, amount) {
        if (!obj[key]) obj[key] = amount;
        else obj[key] += amount;
    },
    pay: function (amount) {
        let finalAmount = amount;

        if (App.pet.stats.gold < finalAmount) {
            App.displayPopup(`Don't have enough money!`);
            return false;
        }

        if (App.petDefinition.hasTrait("shopaholic"))
            App.pet.stats.current_fun += random(25, 45);
        if (App.petDefinition.hasTrait("moneySaver"))
            finalAmount = finalAmount * (random(8, 10) * 0.1);

        if (!isNaN(finalAmount))
            App.pet.stats.gold = Math.round(App.pet.stats.gold - finalAmount);

        return true;
    },
    getPreciseTimeFromNow: (time) => {
        const duration = moment.duration(moment(time).diff(moment()));

        const hours = Math.floor(duration.asHours());
        const minutes = Math.floor(duration.asMinutes()) % 60;

        if (hours > 0) {
            return `${hours} hour${hours !== 1 ? "s" : ""} and ${minutes} minute${minutes !== 1 ? "s" : ""}`;
        } else {
            return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
        }
    },
    useWebcam: function (callback, facingMode, shutterDelay) {
        if (!facingMode) facingMode = "environment";

        const gameplayControlsState = App.getGameplayControlsState();
        App.toggleGameplayControls(false);

        let openStream;

        function unloadWebcam() {
            App.toggleGameplayControls(
                gameplayControlsState.state,
                gameplayControlsState.onclick,
            );
            openStream?.getTracks().forEach(function (track) {
                track.stop();
            });
            videoContainer.remove();
        }

        function close(data) {
            if (callback) callback(data);
            unloadWebcam();
        }

        function showError() {
            App.displayConfirm(`Can't load the camera on this device`, [
                {
                    name: "back",
                    onclick: () => {
                        close(-1);
                    },
                },
            ]);
        }

        if (!navigator?.mediaDevices) return showError();

        const videoContainer = document
            .querySelector(".webcam-container")
            .cloneNode(true);

        const videoElement = videoContainer.querySelector(".webcam-video");
        const webcamButton = videoContainer.querySelector("#webcam-button");
        const webcamChangeButton = videoContainer.querySelector(
            "#webcam-change-button",
        );
        const canvas = document.createElement("canvas");

        document.querySelector(".screen-wrapper").appendChild(videoContainer);

        videoElement.onplaying = () => {
            webcamButton.style.display = "initial";
        };

        webcamButton.onclick = () => {
            webcamButton.disabled = true;
            videoElement.pause();
            videoElement.classList.add("taken");

            const context = canvas.getContext("2d");
            canvas.width =
                document.querySelector(".screen-wrapper").clientWidth;
            canvas.height =
                document.querySelector(".screen-wrapper").clientHeight;
            context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
            const data = canvas.toDataURL("image/png");

            setTimeout(() => {
                close(data);
            }, shutterDelay || 250);
        };

        webcamChangeButton.onclick = () => {
            unloadWebcam();
            // videoContainer.remove();
            App.useWebcam(
                callback,
                facingMode == "user" ? "environment" : "user",
            );
        };

        navigator?.mediaDevices
            .getUserMedia({
                // video: true,
                video: {
                    facingMode: facingMode,
                },
                // audio: true,
            })
            .then((stream) => {
                openStream = stream;
                videoElement.srcObject = stream;
                videoElement.addEventListener("loadedmetadata", () => {
                    videoElement.play();
                });
            })
            .catch(() => {
                videoContainer.remove();
                showError();
            });
    },
    createNotification: function (title, body) {
        if (!App.settings.notifications) return false;

        const options = {
            body: body,
            icon: `android-icon-48x48.png`,
        };
        new Notification(title, options);
    },
    checkPetStats: function () {
        if (!App.isTester())
            return setTimeout(() => App.checkPetStats(), 10000);

        console.log("checking pet stat");
        App.createNotification(
            "this is on testing interval",
            `Hello my name is ${Math.random()}`,
        );
        setTimeout(() => {
            App.checkPetStats();
        }, 10000);
    },
    getEncodedInputCode: (code) => {
        const encoded = `${App.constants.INPUT_BASE_64}${btoa(code)}`;
        return encoded;
    },
    getIcon: function (iconName, noRightMargin, color) {
        if (iconName.startsWith("special:")) {
            const iconDef =
                App.definitions.icons[iconName.replace("special:", "")];
            return App.getIcon(iconDef.icon, noRightMargin, iconDef.color);
        }
        const style = `${!noRightMargin ? "margin-right:10px;" : ""}${color ? `color:${color};` : ""}`;
        return `<i class="fa-solid fa-${iconName}" style="${style}"></i>`;
    },
    wait: function (ms = 0) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },
    canProceed: function (key, ms) {
        if (!App.temp.proceedBuffer) App.temp.proceedBuffer = {};
        const lastTime = App.temp.proceedBuffer[key] || -Infinity;
        if (App.time > lastTime + ms) {
            App.temp.proceedBuffer[key] = App.time;
            return true;
        }
        return false;
    },
    fadeScreen: function ({ middleFn, endFn, speed = 0.005 } = {}) {
        let phase = "fadeIn";
        new Object2d({
            image: App.getPreloadedResource(
                "resources/img/misc/black_overlay_01.png",
            ),
            opacity: 0,
            x: 0,
            y: 0,
            z: App.INF,
            depthMode: Object2d.DEPTH_MODE.none,
            static: true,
            onDraw: (me) => {
                const step = speed * App.deltaTime;

                if (phase === "fadeIn") {
                    me.opacity += step;
                    if (me.opacity >= 1.75) {
                        me.opacity = 1.75;
                        middleFn?.();
                        phase = "fadeOut";
                    }
                } else if (phase === "fadeOut") {
                    me.opacity -= step;
                    if (me.opacity <= 0) {
                        endFn?.();
                        me.removeObject();
                    }
                }
            },
        });
    },
    apiService: {
        ENDPOINT:
            "https://script.google.com/macros/s/AKfycbxCa6Yo_VdK5t9T7ZCHabxT1EY-xACEC3VUDHgkkwGdduF2U5VMGlp0KXBu9CtE8cWv9Q/exec",
        ENDPOINT_TEST:
            "https://script.google.com/macros/s/AKfycbzvoH9j7Ia0Zc_dCBXXYI6dB9UlUR_tGGr1J5Gsu2DG/dev",
        _getUid: () => {
            return App.userName + "-" + App.userId;
        },
        sendRequest: async (params, handler) => {
            return new Promise((resolve, reject) => {
                fetch(`${App.apiService.ENDPOINT}?${params.toString()}`)
                    .then((response) => response.json())
                    .then((json) => {
                        const handledResult = handler?.(json, false);
                        resolve(handledResult ?? json);
                    })
                    .catch((e) => {
                        const handledResult = handler?.(e, true);
                        resolve(handledResult ?? { error: e });
                    });
            });
        },
        addPetDef: (petDef) => {
            const params = new URLSearchParams({
                action: "addPetDef",
                userId: App.apiService._getUid(),
                data: JSON.stringify({
                    name: App.petDefinition.name,
                    sprite: App.petDefinition.sprite,
                    accessories: App.petDefinition.accessories,
                    is_ghost:
                        App.petDefinition.stats.is_ghost !== 0
                            ? App.petDefinition.stats.is_ghost
                            : undefined,
                }),
            });
            return App.apiService.sendRequest(params);
        },
        getPetDef: (userId) => {
            if (!userId) userId = App.apiService._getUid();
            const params = new URLSearchParams({
                action: "getPetDef",
                userId: userId,
            });
            return App.apiService.sendRequest(params);
        },
        getRandomPetDefs: (amount) => {
            const params = new URLSearchParams({
                action: "getRandomPetDefs",
                amount: amount ?? 10,
            });
            const handler = (json, error) => {
                if (error) return false;
                if (json) {
                    return json.data
                        .filter((petDef) => petDef.owner != App.userName)
                        .map((petDef) =>
                            new PetDefinition({
                                ...petDef,
                                name: profanityCleaner.clean(
                                    sanitize(petDef.name),
                                ),
                                owner: profanityCleaner.clean(
                                    sanitize(petDef.owner),
                                ),
                                sprite: sanitize(petDef.sprite),
                                ownerId: petDef.ownerId,
                                interactions: petDef.interactions,
                            }).setStats({
                                is_ghost: petDef.is_ghost || 0,
                            }),
                        );
                }
            };
            return App.apiService.sendRequest(params, handler);
        },
        addInteraction: (ownerId) => {
            const params = new URLSearchParams({
                action: "addUserInteraction",
                ownerId,
                interactingUserId: App.apiService._getUid(),
            });
            return App.apiService.sendRequest(params);
        },
    },
};

window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    App.deferredInstallPrompt = e;

    const showInstallPrompt = () => {
        App.addEvent(`pwa_install_notice_01`, () => {
            App.displayConfirm(
                `Do you want to install <b>Tamaweb</b> as an app?`,
                [
                    {
                        name: "install",
                        onclick: () => {
                            App.installAsPWA();
                        },
                    },
                    {
                        name: "cancel",
                        class: "back-btn",
                        onclick: () => {
                            App.displayPopup(
                                `You can install the game as an app anytime from the <b>settings</b>`,
                            );
                        },
                    },
                ],
            );
        });
    };

    let checkTries = 10;
    const checkForAwayTimeAndInit = () => {
        if (checkTries-- < 0) return;
        if (App.awayTime) {
            showInstallPrompt();
        } else setTimeout(checkForAwayTimeAndInit, 500);
    };

    checkForAwayTimeAndInit();
});

class DebugHelper {
    static giveAllHarvests(amount = 10) {
        const keys = Object.keys(App.definitions.plant);
        keys.forEach((key) => {
            App.addNumToObject(App.pet.inventory.harvests, key, amount);
        });
    }
    static stressTest() {
        const parent = new Object2d({});
        for (let i = 0; i < 5000; i++) {
            const pet = new Pet(App.getRandomPetDef());
            pet.parent = parent;
        }
        return () => parent.removeObject();
    }
}
