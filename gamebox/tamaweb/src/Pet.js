class Pet extends Object2d {
    // basic init
    defaultElevation = -20;
    y = '100%';
    z = App.constants.ACTIVE_PET_Z;
    depthMode = Object2d.DEPTH_MODE.y;
    additionalY = this.defaultElevation;
    animation = {
        currentFrame: 0,
        nextFrameTime: 0,
        set: null,
    }
    scriptedEventCooldowns = {};
    state = 'idle';
    activeMoodlets = [];
    animObjectsQueue = [];
    accessoryObjects = [];
    additionalAccessories = [];

    // flags
    castShadow = true;
    speedOverride = 0;
    ignoreAnimationSetObjects = false;
    shouldDisplaySleepParticles = true;

    constructor(petDefinition, additionalProps){
        const image = petDefinition.spriteSkin
            ? App.getPreloadedResource(petDefinition.spriteSkin)
            : App.getPreloadedResource(petDefinition.sprite);

        const config = {
            image,
            spritesheet: petDefinition.spritesheet,
        };
        super(config);

        this.petDefinition = petDefinition;
        this.stats = this.petDefinition.stats;
        this.inventory = this.petDefinition.inventory;
        this.animations = this.petDefinition.animations;
        this.additionalY += this.petDefinition.spritesheet.offsetY || 0;

        if(App?.currentScene?.petY){
            this.y = App.currentScene.petY;
        }

        this.selector = 'pet';

        for(let prop in additionalProps){
            this[prop] = additionalProps[prop];
        }

        this.createOverlays();
        this.equipAccessories();
        this.handleGhost();
    }

    createOverlays(){
        this.needsToiletOverlay = new Object2d({
            parent: this,
            img: 'resources/img/misc/needstoilet_01.png',
            x: 0,
            y: 0,
            z: this.z,
            width: this.petDefinition.spritesheet.cellSize, height: this.petDefinition.spritesheet.cellSize,
            hidden: true,
            onDraw: (overlay) => {
                overlay.mimicParent(['inverted', 'upperHalfOffsetY']);
                Object2d.animations.flip(overlay, 250);
            }
        });

        this.dirtyOverlay = new Object2d({
            parent: this,
            img: 'resources/img/misc/stinky_01.png',
            x: 0,
            y: 0,
            z: this.z,
            localZ: -0.001,
            width: this.petDefinition.spritesheet.cellSize, height: this.petDefinition.spritesheet.cellSize,
            hidden: true,
            onDraw: (overlay) => {
                overlay.mimicParent(['inverted', 'upperHalfOffsetY']);
                Object2d.animations.flip(overlay, 300);
            }
        });

        this.shadowOverlay = new Object2d({
            parent: this,
            img: 'resources/img/misc/shadow_01.png',
            width: this.petDefinition.spritesheet.cellSize,
            height: this.petDefinition.spritesheet.cellSize,
            z: this.z,
            localZ: -999,
            depthMode: Object2d.DEPTH_MODE.none,
            invisible: !this.castShadow,
            onDraw: (overlay) => {
                overlay.invisible = !this.castShadow;

                if(overlay.invisible) return;

                overlay.x = this.x;

                if(App.currentScene.noShadows) {
                    overlay.y = -9999;
                    return;
                }

                if (this.staticShadow === undefined && this.isMainPet !== undefined){
                    if(this.isMainPet) this.staticShadow = false;
                    else this.staticShadow = true;
                }

                if (this.staticShadow) {
                    overlay.y = this.y + this.additionalY + Math.ceil(this.spritesheet.cellSize / 2.1);
                    return;
                }

                overlay.y =
                    this.y + this.additionalY + Math.ceil(this.spritesheet.cellSize / 2.1) +
                    (App.currentScene.shadowOffset || 0) +
                    (this.shadowOffset || 0);
                const distanceToCaster = overlay.y - this.y - this.positionOffset.y;
                overlay.scale = 1 - ((distanceToCaster + 4) * 0.01);
            }
        })

        this.sicknessOverlay = new Object2d({
            parent: this,
            img: 'resources/img/misc/sickness_overlay_01.png',
            x: 0,
            y: 0,
            hidden: true,
            z: this.z,
            localZ: 2,
            onDraw: (overlay) => {
                Object2d.animations.flip(overlay, 750);
            }
        });

        this.misbehavingOverlay = new Object2d({
            parent: this,
            img: 'resources/img/misc/misbehaving_01.png',
            x: 0,
            y: 0,
            invisible: true,
            z: this.z,
            localZ: 1,
            // width: this.petDefinition.spritesheet.cellSize, height: this.petDefinition.spritesheet.cellSize,
            onDraw: (overlay) => {
                overlay.invisible = !overlay.parent?.stats?.is_misbehaving;
                overlay.mimicParent(['inverted', 'upperHalfOffsetY']);
                overlay.x -= (overlay.parent.spritesheet.offsetY / 2) || 0;
                Object2d.animations.pulseScale(overlay, 0.01, 0.05);
            }
        })

        this.sleepParticles = new Object2d({
            parent: this,
            spawnTimerMs: Math.random(),
            onDraw: (me) => {
                if(!me.parent.shouldDisplaySleepParticles) {
                    me.hidden = true;
                    return;
                }
                if(me.parent.state !== 'sleeping') return;

                me.spawnTimerMs -= App.deltaTime;
                if(me.spawnTimerMs > 0) return;

                me.spawnTimerMs =  750;

                const particleSettings = {
                    speed: 0.02,
                    direction: random(0, 1) ? 1 : -1
                }

                new Object2d({
                    parent: me,
                    img: 'resources/img/misc/sleep_z_01.png',
                    x: me.parent.x,
                    y: me.parent.y - me.parent.spritesheet.cellSize,
                    rotation: 0,
                    opacity: 1,
                    onDraw: (particle) => {
                        const changeFloat = particleSettings.speed * App.deltaTime;
                        particle.y -= changeFloat;
                        particle.x += (Math.sin(particle.rotation * 0.5 * particleSettings.direction) * 0.5) + particleSettings.speed * particleSettings.direction * App.deltaTime * 0.2;
                        particle.rotation += changeFloat * particleSettings.direction;
                        particle.opacity -= 0.0009 * App.deltaTime;
                        if(particle.opacity <= 0) particle.removeObject()
                    }
                })
            }
        })

        this.toothacheOverlay = new Object2d({
            parent: this,
            img: 'resources/img/misc/toothache_01.png',
            x: 0,
            y: 0,
            invisible: true,
            z: this.z,
            localZ: 1,
            onDraw: (overlay) => {
                overlay.invisible = !overlay.parent?.stats?.has_toothache;
                overlay.mimicParent(['inverted', 'upperHalfOffsetY']);
                overlay.x -= (overlay.parent.spritesheet.offsetY / 2) || 0;
                Object2d.animations.pulseScale(overlay, 0.01, 0.05);
            }
        })
    }
    equipAccessories(){
        const ACCESSORY_CELL_SIZE = 64;
        const ADULT_BASE_SIZE = this.petDefinition.spritesheetDefinitions[PetDefinition.LIFE_STAGE.adult]?.cellSize ?? 32;
        const OVERLAY_SCALE = (this.petDefinition.spritesheet.cellSize / ADULT_BASE_SIZE) || 1;

        const overlayOffset = {
            x: (ACCESSORY_CELL_SIZE - this.spritesheet.cellSize) / 2,
            y: (ACCESSORY_CELL_SIZE - this.spritesheet.cellSize) / 2,
        }

        // removing old accessories
        this.accessoryObjects.forEach(accessoryObject => accessoryObject?.removeObject());
        this.accessoryObjects = [];

        const accessoriesToEquip = [
            ...this.petDefinition.accessories,
            ...this.additionalAccessories
        ];

        if(!accessoriesToEquip) return;
        accessoriesToEquip.forEach((accName) => {
            const accessory = App.definitions.accessories[accName];
            if(!accessory) return;

            const accessoryObject =
                accessory.createFn
                    ? accessory.createFn(this)
                    : new Object2d({
                        parent: this,
                        img: accessory.image,
                        // z: accessory.front ? (this.z + 0.1) || 5.1 : (this.z - 0.1) || 4.9,
                        z: this.z,
                        localZ: accessory.front ? 0.0001 : -0.0001,
                        scale: 1,
                        spritesheet: {
                            cellNumber: 1,
                            cellSize: ACCESSORY_CELL_SIZE,
                            rows: 4,
                            columns: 4,
                        },
                        onDraw: accessory.onDrawOverride ?? ((overlay) => {
                            overlay.mimicParent();
                            overlay.scale = overlay.scale * (OVERLAY_SCALE);
                            overlay.x -= overlayOffset.x;
                            overlay.y -= overlayOffset.y;

                            accessory.onDraw?.(overlay);
                        })
                    });

            this.accessoryObjects.push(accessoryObject);
        })
    }
    handleGhost(){
        if(this.animations._moving){
            this.animations.moving = this.animations._moving
        }

        if(!this.stats.is_ghost) return;

        const isDevilGhostType = this.stats.is_ghost === PetDefinition.GHOST_TYPE.devil;

        this.castShadow = false;
        this.opacity = 0.7;
        this.additionalAccessories = isDevilGhostType
            ? ['monster wings', 'demon horns']
            : ['angel wings', 'angel halo'];
        this.showOutline(isDevilGhostType ? '#B51919' : '#F9E07B', true)

        this.equipAccessories();
        this.animations._moving = this.animations.moving;
        this.animations.moving = this.animations.idle_side;


        // bobbing animation
        const bobStoppingStates =  [
            'eating',
            'sitting',
            'kissing',
        ];

        const initialAdditionalY = this.additionalY;
        let animationFloat = Math.random() * Math.PI;
        this.onDraw = (me) => {
            const floatSpeed = me.isMoving ? 0.0075 : 0.005;
            animationFloat += floatSpeed * App.deltaTime;
            if(animationFloat > App.PI2) animationFloat = 0;
            me._ghostAnimationFloat = animationFloat;

            me.additionalY = bobStoppingStates.includes(App.pet.state) ?
                initialAdditionalY :
                initialAdditionalY - 3 - Math.sin(animationFloat) * 3;
        }
    }
    onLateDraw() {
        this.behavior();
    }
    behavior() {
        this.isMainPet = this === App.pet;

        if(this.stats.is_dead) return this.handleDead();
        if(this.stats.is_egg) return this.handleEgg();

        this.think();
        this.moveToTarget(this.speedOverride || this.stats.speed);
        this.stateManager();
        this.handleAnimation();

        Object2d.animations.pixelBreath(this);
    }
    handleDirectInteractionStart(){
        const me = this;
        this.isInteractingWith = true;

        this.directInteractionInfo = {
            x: 0,
            y: 0,
            initialY: this.y
        }

        this.triggerScriptedState('shocked', App.INF, false, true,
            () => {
                me.isInteractingWith = false;
            },
            () => {
                const repositionSpeed = 0.008 * App.deltaTime;
                me.directInteractionInfo.x = App.mouse.x - (me.spritesheet.cellSize / 2);
                me.directInteractionInfo.y = App.mouse.y;
                this.x = lerp(this.x, me.directInteractionInfo.x, repositionSpeed);
                const yDiff = me.directInteractionInfo.y - this.directInteractionInfo.initialY;
                this.positionOffset.y = lerp(this.positionOffset.y, clamp(yDiff, -Infinity, 0), repositionSpeed);
                me.inverted = this.x < me.directInteractionInfo.x;
            }
        )
    }
    handleDirectInteractionEnd(){
        this.stopScriptedState();

        // falling
        const fallSpeed = this.stats.is_ghost ? 0.0003 : 0.0008;
        let currentFallOffset = 0.008;
        const handleOnEndFall = () => {
            this.triggerScriptedState('sitting', 500, false, true);
        }
        const fallDriver = () => {
            if(this.directInteractionInfo.x == null){
                this.stopScriptedState()
                return;
            }

            this.x = lerp(this.x, this.directInteractionInfo.x, 0.008 * App.deltaTime)
            currentFallOffset += fallSpeed * App.deltaTime;

            if(this.positionOffset.y < 0)
                this.positionOffset.y += currentFallOffset * App.deltaTime;

            if(this.positionOffset.y >= 0){
                this.positionOffset.y = 0;
                this.stopScriptedState();
                this.playSound('resources/sounds/ui_click_04.ogg', true);
                App.vibrate();
            }
        }
        this.triggerScriptedState('jumping', 10000, false, true, handleOnEndFall, fallDriver)
    }
    handleWants(){
        if(!this.isMainPet || App.haveAnyDisplays()) return;

        const {current_want} = this.stats;
        if(current_want.pendingFulfilled){
            this.showThought(App.constants.WANT_TYPES.fulfilled);
            current_want.pendingFulfilled = null;
        }

        if(App.fullTime > current_want.next_refresh_ms || 0){
            App.petDefinition.refreshWant()
            App.pet.showCurrentWant()
        }
    }
    handleDead(){
        App.setScene(App.scene.graveyard);

        const me = this;
        this.x = -600;

        App.toggleGameplayControls(false, () => {
            const handleReceiveEgg = () => App.transferAndGetFreshEgg();

            if(App.pet.stats.is_revived_once){
                App.displayConfirm(`Do you want to receive a new egg?`, [
                    {
                        name: 'yes',
                        onclick: handleReceiveEgg
                    },
                    {
                        name: 'no',
                        class: 'back-btn',
                        onclick: () => { }
                    },
                ], false);
            } else {
                const revivalPrice = clamp(Math.floor(App.pet.stats.gold / 2), App.constants.MIN_REVIVE_GOLDS, App.constants.MAX_REVIVE_GOLDS);
                App.displayConfirm(`<b>${App.petDefinition.name}</b> is dead but you can choose to revive them only <b>once</b>, do you want to revive them?`, [
                    {
                        name: `revive ($${revivalPrice})`,
                        onclick: () => {
                            if(App.pay(revivalPrice)){
                                Activities.revive()
                                return false;
                            }
                            return true;
                        }
                    },
                    {
                        name: 'get a new egg',
                        onclick: handleReceiveEgg
                    },
                    {
                        name: 'back',
                        class: 'back-btn',
                        onclick: () => {}
                    }
                ])
            }

        })

        if(!this.ghostObject){
            this.ghostObject = new Object2d({
                img: 'resources/img/misc/ghost_01.png',
                x: 0,
                y: -5,
                onDraw: (ghostObject) => {
                    Object2d.animations.bob(ghostObject, 0.001, 0.1);
                    Object2d.animations.flip(ghostObject, 1500);

                    if(!App.pet.stats.is_dead) {
                        ghostObject.removeObject();
                        delete me.ghostObject;
                    }
                }
            });
        }
    }
    handleEgg(){
        this.x = -200;

        App.toggleGameplayControls(false, () => {
            App.displayPopup('Wait for your egg to hatch');
        })

        const getEggSpritesheet = () => {
            if(this.stats.is_ghost === PetDefinition.GHOST_TYPE.angel)
                return 'resources/img/misc/egg_angel_01.png'

            if(this.stats.is_ghost === PetDefinition.GHOST_TYPE.devil)
                return 'resources/img/misc/egg_devil_01.png'

            return 'resources/img/misc/egg_normal_01.png';
        }

        if(!this.eggObject){
            this.eggStartTime = Date.now();
            this.hatchTime = this.eggStartTime + random(15000, 30000);
            this.eggObject = new Object2d({
                img: getEggSpritesheet(),
                spritesheet: {
                    cellSize: 16,
                    rows: 1,
                    columns: 2,
                    cellNumber: 1
                },
                x: '50%',
                y: '80%',
            });
            this.eggMotionFloat = 0;
            this.eggMotionFloatSpeed = 0.001;
            return;
        }

        this.eggMotionFloatSpeed = clamp(this.eggMotionFloatSpeed + (0.000001 * App.deltaTime), 0, 0.02);

        this.eggMotionFloat += this.eggMotionFloatSpeed * App.deltaTime;
        const motion = Math.sin(this.eggMotionFloat);

        if(this.eggMotionFloatSpeed === 0.02){
            if(this.eggObject.spritesheet.cellNumber !== 2){
                App.playSound('resources/sounds/task_complete.ogg', true);
            }
            this.eggObject.spritesheet.cellNumber = 2;
        }

        this.eggObject.x = 40 + (motion * 1.5);
        this.setLocalZBasedOnSelf(this.eggObject);

        if(Date.now() > this.hatchTime){
            this.stats.is_egg = false;
            App.setScene(App.scene.home);
            App.toggleGameplayControls(true);
            this.eggObject?.removeObject();
            this.eggObject = null;
            this.triggerScriptedState('uncomfortable', 5000);
            this.playCheeringAnimation(false, true);
            App.playSound('resources/sounds/task_complete_02.ogg', true);
            new Object2d({
                ...App.drawer.bounds,
                x: 0, y: 0, z: App.constants.ACTIVE_PET_Z + 5,
                solidColor: {
                    r: 255,
                    g: 255,
                    b: 255
                },
                opacity: 0.5,
                onDraw: (me) => {
                    me.opacity -= 0.002 * App.deltaTime;
                    if(me.opacity <= 0) me.removeObject();
                }
            })
            Activities.task_explodingParticles({
                x: '50%',
                y: '80%',
                despawnTime: 500,
            })
        }
    }
    sleep(){
        if(this.stats.is_sleeping || App.currentScene !== App.scene.home) return;
        this.stopMove();
        this.x = '50%';
        if(this.stats.is_misbehaving || (this.hasMoodlet('rested') && !App.isSleepHour())){
            this.playRefuseAnimation();
            return;
        }
        this.stats.is_sleeping = true;
    }
    feed(foodSpriteCellNumber, value, type, forced, onEndFn){
        const me = this;

        let hungerReplenishValue = value || 0;

        if(!type) type = 'food';

        App.toggleGameplayControls(false, () => {
            this.stopScriptedState();
        });
        this.stopMove();

        const refuse = () => {
            // App.foods.hidden = true;
            me.playRefuseAnimation();
            App.setScene(App.scene.home);
            App.uiFood.style.visibility = 'hidden';
            App.toggleGameplayControls(true);
            return false;
        }

        const shouldRefuse = () => {
            if(this.stats.has_toothache){
                this.showThought('thought_toothbrush');
                return true;
            }

            const isFavorite = this.petDefinition.isFavorite(foodSpriteCellNumber, type);
            if(isFavorite) return false;

            switch(type){
                case "food":
                    if(this.hasMoodlet('full')) return true;
                    break;
            }

            if(
                this.stats.is_misbehaving &&
                (this.stats.current_hunger > this.stats.max_hunger / 2)
            ){
                if(random(0, 100) >= 10) {
                    this.showThought('thought_scribble');
                    return true;
                }
            }

            // checking for over feeding the same item
            const reFedAmount = this.petDefinition.stats.last_eaten.reduce(
                (sum, current) => current === foodSpriteCellNumber ? sum + 1 : sum,
                0
            );
            const isMilk = foodSpriteCellNumber === App.definitions.food['milk'].sprite;
            if(
                reFedAmount >= App.constants.FEEDING_PICKINESS.refeedingTolerance
                && type !== 'med'
                && !isMilk
                && !this.petDefinition.hasTrait('voraciousHunger')
                && !isFavorite
            ) {
                this.showThought('thought_vomit');
                return true;
            }

            return false;
        }

        const wantedFoodItem = App.definitions.food[this.stats.current_want.item];
        if(this.petDefinition.checkWant(foodSpriteCellNumber === wantedFoodItem?.sprite, App.constants.WANT_TYPES.food)){
            forced = true;
        }

        if(!forced){
            if(shouldRefuse()) return refuse();
        }

        // keeping a track of last X consumed items
        this.petDefinition.stats.last_eaten = [
            foodSpriteCellNumber,
            ...this.petDefinition.stats.last_eaten
        ].slice(0, App.constants.FEEDING_PICKINESS.bufferSize);

        // give toothache if have eaten only snacks
        const allFoodEntires = Object.entries(App.definitions.food).map(e => e[1]);
        const treatsCount = this.petDefinition.stats.last_eaten.filter(
            spriteNumber => allFoodEntires.find(
                food => food.sprite === spriteNumber
            ).type === 'treat'
        ).length;
        // elders cannot get toothache
        this.petDefinition.stats.has_toothache =
            this.petDefinition.lifeStage !== PetDefinition.LIFE_STAGE.elder
            ? treatsCount >= random(7, 8) && type === 'treat'
            : false;

        Missions.done(Missions.TYPES.food);

        // favorite treat/food item
        if(['food', 'treat'].includes(type)){
            const isFavorite = this.petDefinition.checkFavorite(
                foodSpriteCellNumber,
                type
            );
            if(isFavorite) hungerReplenishValue *= 1.5;
        }

        /* App.foods.hidden = false; // remove this getting rid of ui food
        App.foods.spritesheet.cellNumber = foodSpriteCellNumber; */

        let baseFoodSpriteIndex = foodSpriteCellNumber - 1;
        let foodSpriteIndex = baseFoodSpriteIndex;
        let lastFoodSpriteIndexChangeMs = App.time;

        App.uiFood.style.visibility = 'visible';
        App.uiFood.setAttribute('index', foodSpriteCellNumber - 1);

        this.inverted = false;
        this.stats.current_hunger += hungerReplenishValue;

        App.setScene(App.scene.kitchen);

        this.triggerScriptedState('eating', 4000, null, true, () => {
            switch(type){
                case "med":
                    this.playCheeringAnimationIfTrue(this.hasMoodlet('healthy'), () => {
                        App.setScene(App.scene.home);
                        App.toggleGameplayControls(true);
                    });
                    break;
                default:
                    const end = (noLongerHungry) => {
                        App.closeAllDisplays();
                        App.toggleGameplayControls(true);
                        App.setScene(App.scene.home);
                        onEndFn?.(noLongerHungry);
                    }
                    if(this.hasMoodlet('full')){
                        App.toggleGameplayControls(false);
                        this.playCheeringAnimation(() => { end(true) });
                    } else end();
                    break;
            }
            // App.foods.hidden = true;
            App.uiFood.style.visibility = 'hidden';
            // App.toggleGameplayControls(true);
        }, () => {
            if(App.time - lastFoodSpriteIndexChangeMs > 1200){
                lastFoodSpriteIndexChangeMs = App.time;

                foodSpriteIndex = clamp(foodSpriteIndex + 1, baseFoodSpriteIndex, baseFoodSpriteIndex + 2);

                App.uiFood.setAttribute('index', foodSpriteIndex);
            }
        });

        return true;
    }
    playCheeringAnimationIfTrue(requirement, onEndFn){
        if(requirement)
            this.playCheeringAnimation(onEndFn);
        else
            if(onEndFn) onEndFn();
    }
    playCheeringAnimation(onEndFn, noSoundAndIcon, ms = 2000){
        this.stopMove();
        if(!noSoundAndIcon) setTimeout(() => this.playSound('resources/sounds/cheer_success.ogg', true));
        const stateName = !noSoundAndIcon ? 'cheering_with_icon' : 'cheering';
        this.triggerScriptedState(stateName, ms, null, true, () => {
            if(onEndFn) onEndFn();
        });
    }
    playRefuseAnimation(onEndFn){
        this.stopMove();
        this.triggerScriptedState('refuse', 2000, null, true, () => {
            if(onEndFn) onEndFn();
        });
    }
    playAngryAnimation(onEndFn){
        this.stopMove();
        this.triggerScriptedState('angry', 2000, null, true, () => {
            if(onEndFn) onEndFn();
        });
    }
    playUncomfortableAnimation(onEndFn){
        this.stopMove();
        this.triggerScriptedState('uncomfortable', 2000, null, true, () => {
            if(onEndFn) onEndFn();
        });
    }
    attemptMisbehave(forced){
        if(this.petDefinition.hasTrait('proper')) return;

        const shouldAllow = (App.fullTime - this.stats.last_time_misbehave_attempted) > App.constants.ONE_HOUR * 6;
        if(!shouldAllow && !forced) return;
        this.stats.last_time_misbehave_attempted = App.fullTime;

        let startingChance = 1;
        switch(this.petDefinition.lifeStage){
            case PetDefinition.LIFE_STAGE.teen:
                startingChance = 18; break;
            case PetDefinition.LIFE_STAGE.child:
                startingChance = 9; break;
            case PetDefinition.LIFE_STAGE.baby:
                startingChance = 5; break;
        }

        const helperDisciplineAdd = (100 - this.stats.current_discipline) / 2.8; // helper booster
        if(random(startingChance, this.stats.max_discipline) > (this.stats.current_discipline + helperDisciplineAdd)){
            this.stats.is_misbehaving = true;
        }
    }
    praise(){
        this.stopMove();
        App.reloadScene();
        if(!this.stats.is_misbehaving){
            const shouldIncreaseDiscipline = (App.fullTime - this.stats.last_time_praise_given) > App.constants.ONE_MINUTE * 7;
            if(shouldIncreaseDiscipline){
                this.stats.last_time_praise_given = App.fullTime;
                Activities.task_nonSwayingFloatingObjects(10, ['resources/img/misc/arrow_up_green_01.png'], [100, 150]);
                this.stats.current_discipline += random(1, 4);
                App.save();
            }
            this.playCheeringAnimation(false, !shouldIncreaseDiscipline);
        } else {
            const me = this;
            this.triggerScriptedState('shocked', random(-200, 500), null, true, () => me.playCheeringAnimation(false, true));
            if(!this.stats.current_want.type){ // has no want
                this.petDefinition.refreshWant()
                this.showCurrentWant();
            }
            this.stats.current_discipline -= random(1, 2);
        }
    }
    scold(){
        this.stopMove();
        App.reloadScene();
        if(this.stats.is_misbehaving) {
            const isSuccessful = random(0, 4) > 0;
            if(isSuccessful) {
                this.stats.current_discipline += random(1, 3);
                this.stats.is_misbehaving = false;
                this.triggerScriptedState('mild_uncomfortable', 2000, null, true);
                Activities.task_nonSwayingFloatingObjects(10, ['resources/img/misc/arrow_up_green_01.png'], [100, 150]);
                setTimeout(() => this.playSound('resources/sounds/cheer_success.ogg', true));
            } else this.playRefuseAnimation();
        } else {
            this.playUncomfortableAnimation();
            if(!random(0, 3)){ // 25% chance of care dropping
                this.petDefinition.adjustCare(false);
                setTimeout(() => this.showThought('thought_heart_broken'))
            } else {
                // to remove random want bubble showing up after scene reload
                setTimeout(() => this.activeBubble?.removeObject?.());
            }
            this.stats.current_fun -= random(4, 10);
            this.stats.current_discipline -= random(0, 2);
        }
    }
    think(){
        if(!this.nextThinkTime){
            // think twice a second
            this.nextThinkTime = App.lastTime + 500;
        } else if(this.nextThinkTime < App.lastTime){
            this.nextThinkTime = 0;
            return;
        } else {
            return;
        }

        // thinking
        this.statsManager();

        if(this.state == 'sleeping')
            return;

        if(!this.isDuringScriptedState()){
            this.wander();
            this.handleRandomGestures();
            this.handleWants();
            this.handleRandomSentences();
        }
    }
    handleRandomSentences(){
        if(!this.isMainPet) return;
        if(this.stats.current_expression < 20) return;

        const me = this;
        const now = App.time || 0;
        const setNextTime = (time) => {
            me.nextRandomSentenceTime = time ?? now + App.constants.ONE_MINUTE * random(1, 5);
        }
        if(!this.nextRandomSentenceTime) setNextTime(App.constants.ONE_SECOND * random(30, 180));
        if(this.nextRandomSentenceTime < now){
            setNextTime();
            if(!this.nextRandomSentenceQueued){
                this.nextRandomSentenceQueued = true;
                App.queueEvent(() => {
                    me.say(generateRandomSentence());
                    me.nextRandomSentenceQueued = false;
                })
            }
        }
    }
    handleRandomGestures(){
        /* if(random(0, 100) == 1){
            if(this.stats.current_sleep < this.stats.max_sleep / 3){
                this.triggerScriptedState('tired', 10000, 20000);
                this.stopMove();
                return;
            }
        } */

        if(App.time < 5000) return false;

        // bad animations
        if(random(0, 100) < 10){
            if(this.hasMoodlet('sleepy')){
                this.triggerScriptedState('angry', 4000, random(20000, 30000));
                this.stopMove();
                return;
            }
            if(this.hasMoodlet('hungry') || this.hasMoodlet('bored')){
                this.triggerScriptedState('uncomfortable', 4000, random(20000, 30000));
                this.stopMove();
                return;
            }
            if(this.stats.is_misbehaving){
                switch(random(0, 1)){
                    case 0:
                        this.triggerScriptedState('uncomfortable', 4000, random(20000, 30000));
                        break;
                    case 1:
                        this.triggerScriptedState('angry', 4000, random(20000, 30000));
                        break;
                }
                this.stopMove();
                return;
            }
        }

        // const hasGoodMoodlets = ['amused', 'rested', 'full', 'healthy'].map(moodName => this.hasMoodlet(moodName)).some(moodlet => moodlet);
        const hasBadMoodlets = ['bored', 'sleepy', 'hungry', 'sick'].map(moodName => this.hasMoodlet(moodName)).some(moodlet => moodlet);

        // good animations
        if(!hasBadMoodlets){
            if(random(0, 100) < 10){
                let animations = [
                    {name: 'sitting', length: random(2000, 4000)},
                    {name: 'blush', length: random(550, 1000)},
                    {name: 'cheering', length: random(550, 1000)},
                    {name: 'shocked', length: random(450, 800)},
                ];
                let animation = randomFromArray(animations);
                this.triggerScriptedState(animation.name, animation.length, random(10000, 20000));
                this.stopMove();
            } else if(random(0, 105) < 3 && this.isMainPet){
                this.jump();
            }
        }
    }
    statsManager(isOfflineProgression, hour = App.hour){
        if(!this.isMainPet || this.stats.is_dead) return;

        let stats = this.stats;
        const previousStats = Object.assign({}, this.stats);
        const { hasTrait } = this.petDefinition;

        let depletion_mult = 1, offlineAndIsNight = false;
        if(isOfflineProgression){
            depletion_mult = 0.25;

            if(App.isSleepHour(hour)){
                offlineAndIsNight = true;
                depletion_mult = 0.05;
            }

            if(hasTrait('independent')) depletion_mult *= 0.8;
            if(hasTrait('clingy')) depletion_mult *= 1.2;
        } else {
            this.attemptMisbehave();
        }

        switch(this.petDefinition.lifeStage){
            case PetDefinition.LIFE_STAGE.baby: depletion_mult *= 1.65; break;
            case PetDefinition.LIFE_STAGE.child: depletion_mult *= 1.46; break;
            case PetDefinition.LIFE_STAGE.teen: depletion_mult *= 1.3; break;
        }

        if(this.stats.is_at_parents){
            if((hour < App.constants.PARENT_DAYCARE_START || hour >= App.constants.PARENT_DAYCARE_END)){
                if(!isOfflineProgression) {
                    Activities.stayAtParents(true);
                }
                this.stats.is_at_parents = false;
            }
        }
        if(!offlineAndIsNight && this.stats.is_at_parents) depletion_mult = -0.1;

        if(this.stats.is_at_vacation) depletion_mult = -0.1;

        let hunger_depletion_rate = stats.hunger_depletion_rate * depletion_mult;
        if(hasTrait('lightEater')) hunger_depletion_rate *= 0.5;
        if(hasTrait('voraciousHunger')) hunger_depletion_rate *= 1.5;

        let sleep_depletion_rate = stats.sleep_depletion_rate * depletion_mult;
        if(hasTrait('deepSleeper')) sleep_depletion_rate *= 0.5;
        if(hasTrait('restless')) sleep_depletion_rate *= 1.5;

        let fun_depletion_rate = stats.fun_depletion_rate * depletion_mult;
        if(hasTrait('chill')) fun_depletion_rate *= 0.5;
        if(hasTrait('playBurnout')) fun_depletion_rate *= 1.5;

        let bladder_depletion_rate = stats.bladder_depletion_rate * depletion_mult;
        if(hasTrait('ironBladder')) bladder_depletion_rate *= 0.5;
        if(hasTrait('tinyTank')) bladder_depletion_rate *= 1.5;

        let health_depletion_rate = stats.health_depletion_rate * depletion_mult;
        if(hasTrait('germGuardian')) health_depletion_rate *= 0.5;

        let cleanliness_depletion_rate = stats.cleanliness_depletion_rate * depletion_mult;
        if(hasTrait('selfCleaning')) cleanliness_depletion_rate *= 0.5;
        if(hasTrait('dustMagnet')) cleanliness_depletion_rate *= 1.5;

        let discipline_depletion_rate = this.stats.is_at_vacation ? 0 : stats.discipline_depletion_rate;
        let max_death_tick = stats.max_death_tick;
        switch(this.petDefinition.lifeStage){
            case PetDefinition.LIFE_STAGE.baby:
                max_death_tick = stats.baby_max_death_tick;
                break;
            case PetDefinition.LIFE_STAGE.child:
                max_death_tick = stats.child_max_death_tick;
                break;
            case PetDefinition.LIFE_STAGE.teen:
                max_death_tick = stats.teen_max_death_tick;
                break;
        }

        if(isOfflineProgression){
            // health_depletion_rate = 0;
            sleep_depletion_rate /= 2;
        }

        // sleeping case
        if(this.stats.is_sleeping || offlineAndIsNight){
            // fun_depletion_rate = 0;
            // hunger_depletion_rate = 0;

            // health_depletion_rate = 0;

            let sleepAdditionalDepletionMult = 1;
            if(offlineAndIsNight) sleepAdditionalDepletionMult = 2;
            sleep_depletion_rate = -stats.sleep_replenish_rate * sleepAdditionalDepletionMult;
        }

        // clamping between 0 and max
        stats.current_hunger = clamp(stats.current_hunger, 0, stats.max_hunger);
        stats.current_sleep = clamp(stats.current_sleep, 0, stats.max_sleep);
        stats.current_fun = clamp(stats.current_fun, 0, stats.max_fun);
        stats.current_bladder = clamp(stats.current_bladder, 0, stats.max_bladder);
        stats.current_health = clamp(stats.current_health, 0, stats.max_health);
        stats.current_cleanliness = clamp(stats.current_cleanliness, 0, stats.max_cleanliness);
        stats.current_discipline = clamp(stats.current_discipline, 0, stats.max_discipline);

        // depletion
        stats.current_hunger -= hunger_depletion_rate;
        if(stats.current_hunger <= 0){
            stats.current_hunger = 0;
            // console.log('dead?');
        }
        stats.current_sleep -= sleep_depletion_rate;
        if(stats.current_sleep <= 0){
            stats.current_sleep = 0;
            if(App.currentScene === App.scene.home){
                this.stats.is_sleeping = true;
            }
        }
        stats.current_fun -= fun_depletion_rate;
        if(stats.current_fun <= 0){
            stats.current_fun = 0;
            // console.log('All my friends no fun?');
        }
        if(hasTrait('depressed')){
            stats.current_fun = 0;
        }
        stats.current_bladder -= bladder_depletion_rate;
        if(stats.current_bladder <= 0){
            stats.current_bladder = stats.max_bladder;
            if(!stats.is_potty_trained){
                if(!this.stats.has_poop_out) this.stats.has_poop_out = 1;
                else this.stats.has_poop_out += 1;
            }
            else if(!isOfflineProgression) {
                App.queueEvent(() => {
                    Activities.poop(true);
                }, 'poop');
            }
        }
        // spawning poop objects
        const spawnedPoopObjects = App.drawer.selectObjects('poop');
        const poopObjectsToBeSpawned = this.stats.has_poop_out - spawnedPoopObjects.length;
        if(
            poopObjectsToBeSpawned > 0
            && spawnedPoopObjects.length < App.constants.POOP_POSITIONS.length
            && !this.isDuringScriptedState()
        ){
            for(let i = 0; i < poopObjectsToBeSpawned; i++){
                const position = App.constants.POOP_POSITIONS.at(i + spawnedPoopObjects.length);
                if(!position) break;
                const poopObject = new Object2d({
                    image: App.preloadedResources["resources/img/misc/poop.png"],
                    ...position,
                    selector: 'poop',
                    onDraw: (me) => {
                        Object2d.animations.flip(me, 300);
                        this.setLocalZBasedOnSelf(poopObject);
                    }
                })
            }
        }

        this.needsToiletOverlay.hidden = stats.current_bladder > stats.max_bladder / 4;
        stats.current_cleanliness -= cleanliness_depletion_rate;
        if(stats.current_cleanliness <= 0){
            stats.current_cleanliness = 0;
        }
        if(stats.current_cleanliness <= 25){
            this.dirtyOverlay.hidden = false;
        } else {
            this.dirtyOverlay.hidden = true;
        }
        if(this.stats.has_poop_out || !this.dirtyOverlay.hidden){ // gradually decrease health if poop is nearby or dirty
            stats.current_health -= health_depletion_rate * stats.health_depletion_mult;
            stats.current_cleanliness -= cleanliness_depletion_rate * stats.cleanliness_depletion_mult;
        }
        if(stats.current_health <= 0){
            stats.current_health = 0;
            // console.log('dead of sickness?');
        }

        stats.current_discipline -= discipline_depletion_rate;
        if(stats.current_discipline <= 0){
            stats.current_discipline = 0;
            if(!this.petDefinition.hasTrait('proper')){
                stats.is_misbehaving = true;
            }
        }

        if(stats.current_health <= 0 &&
            stats.current_cleanliness <= 0 &&
            stats.current_fun <= 0 &&
            stats.current_hunger <= 0 &&
            !stats.is_ghost
        ) stats.current_death_tick -= stats.death_tick_rate;
        else stats.current_death_tick = max_death_tick;

        if(stats.current_death_tick <= 0){
            App.pet.stats.is_dead = true;
        }
        this.sicknessOverlay.hidden = stats.current_death_tick >= max_death_tick / 2;

        // care rating check
        if(App.temp.sessionCareRatingReduceCooldownTicks == null){
            App.temp.sessionCareRatingReduceCooldownTicks = 0;
        }
        const careAffectingStats = [
            'current_health',
            'current_fun',
            'current_hunger',
            'current_cleanliness',
        ]
        careAffectingStats.forEach(statName => {
            // decreasing
            if(
                previousStats[statName] != 0
                && this.stats[statName] == 0
                && !isOfflineProgression
            ) {
                App.temp.sessionCareRatingReduceCooldownTicks--;
                if(App.temp.sessionCareRatingReduceCooldownTicks <= 0){
                    App.temp.sessionCareRatingReduceCooldownTicks = 2;
                    this.petDefinition.adjustCare(false);
                    stats.current_discipline -= random(2, 5);
                }
            }
        })
        const areAllStatsEmpty = careAffectingStats.every(statName => this.stats[statName] <= 0);
        if(areAllStatsEmpty){
            this.stats.current_care = 1;
            this.petDefinition.adjustCare(false);
        }
        // increasing
        const careIncreaseThreshold = this.stats.hunger_satisfaction || 85; // this value is based on lowest satisfaction stat
        const eligibleForCareIncrease = careAffectingStats.every(statName => this.stats[statName] > careIncreaseThreshold);
        const shouldResetCareIncreaseFlag = careAffectingStats.some(statName => this.stats[statName] < 65);
        if(eligibleForCareIncrease){
            if(this.stats.should_care_increase){
                this.stats.should_care_increase = false;
                this.petDefinition.adjustCare(true);
            }
        } else if(shouldResetCareIncreaseFlag) {
            this.stats.should_care_increase = true;
        }

        // moodlets
        const hasGrumpyTrait = hasTrait('grumpy');

        let hunger_min_desire = stats.hunger_min_desire;
        if(hasGrumpyTrait) hunger_min_desire *= 1.5;

        let sleep_min_desire = stats.sleep_min_desire;
        if(hasGrumpyTrait) sleep_min_desire *= 2;

        let fun_min_desire = stats.fun_min_desire;
        if(hasGrumpyTrait) fun_min_desire *= 1.8;

        this.triggerMoodlet(
            stats.current_hunger,
            hunger_min_desire, 'hungry',
            stats.hunger_satisfaction, 'full'
        );
        this.triggerMoodlet(
            stats.current_sleep,
            sleep_min_desire, 'sleepy',
            stats.sleep_satisfaction, 'rested'
        );
        this.triggerMoodlet(
            stats.current_fun,
            fun_min_desire, 'bored',
            stats.fun_satisfaction, 'amused'
        );
        if(stats.has_toothache) {
            this.addMoodlet('sick');
        } else {
            this.removeMoodlet('sick');
            this.triggerMoodlet(
                stats.current_health,
                stats.max_health * 0.25, 'sick',
                stats.max_health * 0.8, 'healthy'
            );
        }
    }
    triggerMoodlet(current, min, minName, max, maxName){
        if(current < min){
            this.addMoodlet(minName);
        } else {
            this.removeMoodlet(minName);
        }

        if(current > max){
            this.addMoodlet(maxName);
        } else {
            this.removeMoodlet(maxName);
        }
    }
    addMoodlet(mood){
        if(this.activeMoodlets.indexOf(mood) >= 0) return;
        this.activeMoodlets.push(mood);
        return true;
    }
    removeMoodlet(mood){
        let index = this.activeMoodlets.indexOf(mood);
        if(index == -1) return;
        this.activeMoodlets.splice(index, 1);
        return true;
    }
    hasMoodlet(mood){
        return this.activeMoodlets.indexOf(mood) >= 0;
    }
    triggerScriptedState(state, length, cooldown, forced, onEndFn, driverFn){
        return new Promise((resolve, reject) => {
            if(!forced){
                if(this.scriptedEventTime){
                    return resolve(); // already during scripted event
                }

                if(this.scriptedEventCooldowns[state]){
                    if(this.scriptedEventCooldowns[state] > App.lastTime){
                        return resolve();
                    }
                }
            }

            /* check if this is needed
            // if(this.scriptedEventTime){
            //     if(this.scriptedEventOnEndFn) this.scriptedEventOnEndFn();
            // } */

            if(cooldown){
                this.scriptedEventCooldowns[state] = App.lastTime + cooldown;
            }

            this.scriptedEventTime = App.lastTime + length;
            this.scriptedEventOnEndFn = (...args) => {
                if(typeof onEndFn === "function") onEndFn(...args);
                onEndFn = null;
                resolve();
            };
            this.scriptedEventDriverFn = driverFn;
            this.setState(state);
        })
    }
    setState(newState){
        if(newState != this.state){
            this.animation.currentFrame = 0;
            this.animation.nextFrameTime = 0;
            this.animation.set = this.animations[newState];
            const {set} = this.animation;
            if(set?.sound?.interval === 0){
                set.sound._played = false;
            }

            this.state = newState;
        }
    }
    stopScriptedState(){
        this.stopMove();
        this.scriptedEventTime = null;
        const onEnd = this.scriptedEventOnEndFn;
        this.scriptedEventOnEndFn = null;
        if(onEnd) {
            onEnd();
            return true;
        }
        return false;
    }
    isDuringScriptedState(){
        return !!this.scriptedEventTime;
    }
    handleAnimationStateReplacement(){
        if(this.petDefinition.hasTrait('depressed')) {
            const replacableStates = [
                ['idle', 'idle_uncomfortable'],
                ['idle_side', 'idle_side_uncomfortable'],
                ['cheering', 'mild_uncomfortable'],
                ['cheering_with_icon', 'mild_uncomfortable'],
                ['blush', 'idle'],
                ['kissing', 'idle_side_uncomfortable'],
            ]
            replacableStates.forEach(([originalState, replacementState]) => {
                if(this.state === originalState){
                    this.setState(replacementState);
                }
            })
        }
    }
    stateManager(){
        this.handleAnimationStateReplacement();

        if(this.scriptedEventTime){
            if(this.scriptedEventTime < App.lastTime){ // ending scripted event time
                if(this.stopScriptedState()) return;
            } else { // during scripted event
                if(this.scriptedEventDriverFn) this.scriptedEventDriverFn(this);
                this.handleAnimationStateReplacement();
                return;
            }
        }

        if(this.stats.is_sleeping){
            if(
                (this.stats.current_sleep >= this.stats.max_sleep
                || (this.hasMoodlet('rested') && Math.random() < this.stats.light_sleepiness * 0.01))
                && !App.isSleepHour()
            ){
                this.stats.is_sleeping = false;
                App.toggleGameplayControls(true);
                return;
            }
            this.stopMove();
            this.setState('sleeping');
            const { state: currentControlState } = App.getGameplayControlsState()
            if(currentControlState){
                App.toggleGameplayControls(false, () => {
                    this.stats.is_sleeping = false;
                    App.toggleGameplayControls(true);
                    if(!this.hasMoodlet('rested')){
                        App.pet.triggerScriptedState('uncomfortable', 3000);
                    } else {
                        App.pet.playCheeringAnimation();
                    }
                });
            }
        }
        else if(this.isMoving)
            this.setState('moving');
        else {
            if(this.state.indexOf('idle') == -1){
                if(this.hasMoodlet('hungry') || this.hasMoodlet('sleepy') || this.hasMoodlet('bored') || this.hasMoodlet('sick')){
                    if(random(0, 1))
                        this.setState('idle_uncomfortable');
                    else
                        this.setState('idle_side_uncomfortable');
                }
                else {
                    this.setState('idle');
                }
            }
        }
    }
    handleAnimation(){
        const me = this;

        if(!this.animation.set) return;

        const { set } = this.animation;

        const frameRound = set.end - set.start;

        if(this.animation.nextFrameTime < App.lastTime){ // go to next frame
            if(this.animObjectsQueue.length){
                this.animObjectsQueue.forEach((obj, index) => {
                    if(obj._lives && obj._lives > 0){
                        obj._lives --;
                        return;
                    }
                    obj.removeObject();
                    this.animObjectsQueue[index] = null;
                })
                this.animObjectsQueue = this.animObjectsQueue.filter(Boolean);
            }

            this.animation.nextFrameTime = App.lastTime + set.frameTime;

            this.animation.currentFrame = (this.animation.currentFrame + 1) % frameRound;
            this.spritesheet.cellNumber = set.start + this.animation.currentFrame;

            if(set.sound){
                const filePath = `resources/sounds/${set.sound.file}`;

                if(set.sound.interval === 0){
                    if(!set.sound._played){
                        set.sound._played = true;
                        this.playSound(filePath);
                    }
                } else {
                    set.sound._counter = (set.sound._counter || 0) + 1;
                    if(set.sound._counter === set.sound.interval){
                        set.sound._counter = 0;
                        this.playSound(filePath);
                    }
                }
            }

            if(!this.ignoreAnimationSetObjects){
                set.objects?.forEach(objectDef => {
                    if(!objectDef._counter) objectDef._counter = 0;
                    if(++objectDef._counter == objectDef.interval){
                        objectDef._counter = 0;
                        const object = new Object2d({
                            parent: me,
                            ...objectDef,
                        });
                        me.animObjectsQueue.push(object);
                    }
                })
            }
        }
    }
    wander() {
        if(this.isMoving){
            this.nextRandomTargetSelect = 0;
        }

        if (!this.nextRandomTargetSelect) {
            this.nextRandomTargetSelect = App.lastTime + random(this.stats.wander_min, this.stats.wander_max) * 1000;
        }

        if (App.lastTime > this.nextRandomTargetSelect) {
            this.targetX = this.getRandomValidPosition();
            this.nextRandomTargetSelect = 0;
        }
    }
    getRandomValidPosition(axis = 'x'){
        return random(
            this.drawer.getRelativePositionX(0),
            this.drawer.getRelativePositionX(100) - this.spritesheet.cellSize,
        );
    }
    jump(strength = 0.28, silent, onEndFn, gravity = 0.001){
        if(this.isJumping) return false;

        this.isJumping = true;
        const startY = this.positionOffset.y;
        let velocity = strength;
        if(!silent) this.playSound('resources/sounds/jump.ogg', true);

        const jumpHander = App.registerOnDrawEvent(() => {
            velocity -= gravity * App.deltaTime;
            this.positionOffset.y -= velocity * App.deltaTime;
            if(this.positionOffset.y >= startY){
                this.positionOffset.y = startY;
                this.isJumping = false;
                if(this.state === 'jumping')
                    this.stopScriptedState();
                App.unregisterOnDrawEvent(jumpHander);
                onEndFn?.();
            }
        })

        this.triggerScriptedState('jumping', App.INF, 0, true);
    }
    simulateAwayProgression(elapsedTime){
        this.isMainPet = true;

        // calling stats manager once every second instead of twice every second
        let iterations = Math.floor((elapsedTime / 1000));
        for(let i = 0; i < iterations; i++){
            if(this.stats.is_egg){
                this.handleEgg();
                continue;
            }
            this.statsManager();
        }
    }
    simulateOfflineProgression(elapsedTime){
        this.isMainPet = true;
        // getting caught up with the stats simulation
        // since pets call statsManager twice each seconds
        // we are going to simulate that by approximating
        // deprecated: (max offline progression is 12 hours)
        // (max offline progression is 7 days)

        const { MAX_OFFLINE_PROGRESSION_SECS } = App.constants;

        const startTime = Date.now();
        let iterations = Math.floor(clamp(elapsedTime / 1000, 0, MAX_OFFLINE_PROGRESSION_SECS) * 2);
        for(let i = 0; i < iterations; i++){
            elapsedTime -= 500;
            let date = new Date(startTime - elapsedTime);
            let hour = date.getHours();

            // supplying hour because from 22:00 to 9:00 the starts will
            // drop much slower and pet will get sleep
            if(this.stats.is_egg){
                this.handleEgg();
                continue;
            }
            this.statsManager(true, hour);
        }
    }
    ageUp(){
        this.petDefinition.ageUp()
        this.recreateAsMainPet();
    }
    recreateAsMainPet(){
        this.removeObject();
        App.pet = App.createActivePet(this.petDefinition);
    }
    serializeStats(){
        return this.petDefinition.serializeStats();
    }
    loadStats(json){
        this.petDefinition.loadStats(json);
    }
    playSound(sound, force){
        if(!this.isMainPet || App.haveAnyDisplays()) return;
        App.playSound(sound, force);
    }
    getStatsDepletionRates(isOffline, targetLifeStage, hour){
        App.petDefinition.maxStats();
        const currentLifeStage = this.petDefinition.lifeStage;
        if(targetLifeStage != null) this.petDefinition.lifeStage = targetLifeStage;
        const { MAX_OFFLINE_PROGRESSION_SECS } = App.constants;

        const report = {};
        // let offline = false;

        App.temp.sessionCareRatingReduceCooldownTicks = 0;

        for(let i = 0; i < MAX_OFFLINE_PROGRESSION_SECS; i++){
            this.statsManager(isOffline, hour);
            this.statsManager(isOffline, hour);

            // prevents dying
            // this.stats.current_hunger += 1;

            let min = {m: i / 60, s: i, h: i / 60 / 60};
            if(this.stats.current_hunger <= 0 && !report.hunger) report.hunger = {...min, stat: this.stats.current_hunger};
            if(this.stats.current_sleep <= 2 && !report.sleep) report.sleep = {...min, stat: this.stats.current_sleep};
            if(this.stats.current_fun <= 0 && !report.fun) report.fun = {...min, stat: this.stats.current_fun};
            if(this.stats.current_bladder <= 3 && !report.bladder) report.bladder = {...min, stat: this.stats.current_bladder};
            if(this.stats.current_cleanliness <= 0 && !report.cleanliness) report.cleanliness = {...min, stat: this.stats.current_cleanliness};
            if(this.stats.current_health <= 0 && !report.health) report.health = {...min, stat: this.stats.current_health};
            if(this.stats.current_death_tick <= 0 && !report.death_tick) report.death_tick = {...min, stat: this.stats.current_death_tick};
            if(this.stats.current_discipline <= 0 && !report.discipline) report.discipline = {...min, stat: this.stats.current_discipline};
            if(this.stats.current_care <= 1 && !report.care) report.care = {...min, stat: this.stats.current_care};
        }

        console.log(`Time every stats hit ~0:`, report);
        this.petDefinition.lifeStage = currentLifeStage;
        App.petDefinition.maxStats();
    }
    showCurrentWant(withName){
        if(this.stats.current_want.type){
            this.showThought(this.stats.current_want.type, this.stats.current_want.item);

            if(withName){
                const display = App.displayMessageBubble(this.petDefinition.getWantName());
                setTimeout(() => display.close(), 3500);
            }
        }
    }
    showThought(type, item, disappearDelay = 5000){
        const bubble = new Object2d({
            parent: this,
            img: 'resources/img/misc/thought_bubble_01.png',
            x: -999,
            y: -999,
            opacity: 0,
            z: App.constants.ACTIVE_PET_Z + 0.1,
            shouldFadeout: false,
            float: 0,
            onDraw: (me) => {
                me.x = this.x;
                me.float += 0.004 * App.deltaTime;
                if(me.float > App.PI2) me.float = 0;
                me.y = this.y - (this.spritesheet.cellSize * 1.5) - (this.spritesheet.offsetY * 1.8 || 0) + this.positionOffset.y + Math.sin(me.float);
                const opacityTarget = me.shouldFadeout ? 0 : 1;
                me.opacity = lerp(me.opacity, opacityTarget, App.deltaTime * 0.01);
            }
        })

        this.activeBubble?.removeObject?.();
        this.activeBubble = bubble;

        // shows type icon if exists
        if([
            App.constants.WANT_TYPES.food,
            App.constants.WANT_TYPES.playdate,
            App.constants.WANT_TYPES.item,
        ].includes(type)) {
            const typeIcon = new Object2d({
                parent: bubble,
                img: `resources/img/misc/thought_bubble_type_${type}.png`,
                x: 0,
                y: 0,
                opacity: 0,
                z: App.constants.ACTIVE_PET_Z + 0.101,
                shouldFadeout: false,
                float: 0,
                onDraw: (me) => {
                    me.opacity = bubble.opacity;
                    me.x = bubble.x;
                    me.y = bubble.y;
                }
            })
        }

        const THOUGHT_ITEM_Z = App.constants.ACTIVE_PET_Z + 0.10;
        switch(type){
            case App.constants.WANT_TYPES.food:
                const foodSpriteIndex = App.definitions.food[item]?.sprite;
                if(!foodSpriteIndex) break;
                new Object2d({
                    parent: bubble,
                    image: App.preloadedResources[App.constants.FOOD_SPRITESHEET],
                    x: 10, y: 10, z: THOUGHT_ITEM_Z,
                    scale: 0.62,
                    spritesheet: {
                        cellNumber: foodSpriteIndex,
                        cellSize: 24,
                        rows: 33,
                        columns: 33,
                    },
                    onDraw: (me) => {
                        me.opacity = bubble.opacity;
                        me.x = bubble.x + 4;
                        me.y = bubble.y + 1;
                    }
                })
                break;
            case App.constants.WANT_TYPES.playdate:
                const friendDef = item instanceof PetDefinition
                    ? item
                    : this.petDefinition.friends[item];
                if(!friendDef) break;
                new Object2d({
                    parent: bubble,
                    image: App.preloadedResources[friendDef.sprite],
                    x: 10, y: 10, z: THOUGHT_ITEM_Z,
                    scale: 0.62,
                    spritesheet: friendDef.spritesheet,
                    onDraw: (me) => {
                        me.opacity = bubble.opacity;
                        me.x = bubble.x + (friendDef.spritesheet.offsetY ?? 0);
                        me.y = bubble.y - 4 + (friendDef.spritesheet.offsetY ?? 0);
                    }
                })
                break;
            case App.constants.WANT_TYPES.item:
                const itemSpriteIndex = App.definitions.item[item]?.sprite;
                if(!itemSpriteIndex) break;
                new Object2d({
                    parent: bubble,
                    image: App.preloadedResources["resources/img/item/items.png"],
                    x: 10, y: 10, z: THOUGHT_ITEM_Z,
                    scale: 0.7,
                    spritesheet: {
                        cellNumber: itemSpriteIndex,
                        cellSize: 22,
                        rows: 10,
                        columns: 10
                    },
                    onDraw: (me) => {
                        me.opacity = bubble.opacity;
                        me.x = bubble.x + 5;
                        me.y = bubble.y + 2;
                    }
                })
                break;
            case App.constants.WANT_TYPES.minigame:
                new Object2d({
                    parent: bubble,
                    image: App.preloadedResources["resources/img/misc/minigames.png"],
                    x: 10, y: 10, z: THOUGHT_ITEM_Z,
                    onDraw: (me) => {
                        me.opacity = bubble.opacity;
                        me.x = bubble.x;
                        me.y = bubble.y;
                    }
                })
                break;
            case App.constants.WANT_TYPES.fulfilled:
                new Object2d({
                    parent: bubble,
                    image: App.preloadedResources["resources/img/misc/want_fulfilled.png"],
                    x: 10, y: 10, z: THOUGHT_ITEM_Z,
                    onDraw: (me) => {
                        me.opacity = bubble.opacity;
                        me.x = bubble.x;
                        me.y = bubble.y;
                    }
                })
                break;
            default:
                new Object2d({
                    parent: bubble,
                    image: App.preloadedResources[`resources/img/misc/${type}.png`],
                    x: 10, y: 10, z: THOUGHT_ITEM_Z,
                    onDraw: (me) => {
                        me.opacity = bubble.opacity;
                        me.x = bubble.x;
                        me.y = bubble.y;
                    }
                })
        }

        setTimeout(() => {
            bubble.shouldFadeout = true;
            setTimeout(() => bubble.removeObject(), 1000);
        }, disappearDelay);
    }
    setLocalZBasedOnSelf(otherObject, matchBase = true){
        // @deprecated
        otherObject.depthMode = Object2d.DEPTH_MODE.y;
        otherObject.z = App.constants.ACTIVE_PET_Z;
        return;
        const currentBoundingBox = this.getBoundingBox();
        const otherBoundingBox = otherObject.getBoundingBox();

        const localZ = (otherBoundingBox.y + otherBoundingBox.height) - (currentBoundingBox.y + currentBoundingBox.height);

        if(matchBase) otherObject.z = this.z;
        otherObject.localZ = localZ;
    }
    say(sentence, ms = 6000){
        const pitch = 2 - (this.petDefinition.lifeStage * 0.5);
        const message = App.displayMessageBubble(sentence, this.petDefinition.getFullCSprite(), pitch);
        setTimeout(() => message?.close(), ms);
    }

    applyColorOverrides(){ return this.image; }

    static scriptedEventDrivers = {
        playing: function(start){
            this.pet.setState('moving');

            if(this.playing_current_target_x === undefined){
                this.playing_current_target_x = true;
                this.pet.targetX = 0;
            }

            if(this.pet.x == this.pet.targetX){
                if(this.pet.targetX == 0) this.pet.targetX = 100 - this.pet.spritesheet.cellSize;
                else this.pet.targetX = 0;
            }
        },
        moveCheck: function(){
            if(this.pet.x === this.pet.targetX || this.pet.targetX === undefined) {
                this.pet.stopScriptedState();
            }
        },
        movingOut: function(start){
            this.pet.setState('moving');

            if(this.moving_init_done === undefined){
                this.moving_init_done = true;
                this.pet.x = 0;
                this.pet.targetX = -20;
            }
        },
        movingIn: function(){
            this.pet.setState('moving');

            if(this.moving_init_done === undefined){
                this.moving_init_done = true;
                this.pet.x = '105%';
                this.pet.targetX = -20;
            }
        },
        playingWithItem: function(){ // this.pet, this.item, this.itemObject
            const skipLimitedFpsItems = ['grimoire', 'skate', 'fidget spinner'];

            if(!skipLimitedFpsItems.includes(this.item?.name)){
                if(this.lastMs && App.time <= this.lastMs + 500) return;
                this.lastMs = App.time;
            }

            const me = this;

            switch(this.item?.name){
                case "skate":
                    if(!this.init){
                        this.init = true;
                        App.setScene(App.scene.skate_park);
                        this.animationPosition = {x: -30, y: 75};
                        this.pet.setState('idle_side');
                        this.pet.inverted = true;
                        this.animationSpeed = 0.075;
                        this.petOffset = {x: 0, y: 0};
                    }


                    this.animationPosition.x += this.animationSpeed * App.deltaTime;
                    const isRightPast = this.animationPosition.x > App.drawer.bounds.width + 32;
                    const isLeftPast = this.animationPosition.x < -64;

                    if(isRightPast || isLeftPast) {
                        // crossed
                        this.animationSpeed = (isRightPast ? -0.075 : 0.075);
                        this.pet.inverted = this.animationSpeed > 0;


                        if(random(0, 2) && this.itemObject.rotation === 0){
                            this.petOffset.y + 5;
                            this.itemObject.rotation = 15;
                            this.pet.setState('jumping');
                            this.animationPosition.y = 55;
                        } else {
                            this.pet.setState('idle_side');
                            this.itemObject.rotation = 0;
                            this.petOffset.x = 0;
                            this.petOffset.y = 0;
                            this.animationPosition.y = 75;
                        }
                    }

                    this.pet.x = this.animationPosition.x + this.petOffset.x + (this.pet.petDefinition.spritesheet.offsetY || 0);
                    this.pet.y = this.animationPosition.y + this.petOffset.y + (this.pet.petDefinition.spritesheet.offsetY || 0);

                    this.itemObject.x = this.animationPosition.x + 5;
                    this.itemObject.y = this.animationPosition.y;
                    break;
                case "grimoire":
                    if(!this.startTime) {
                        this.startTime = App.time;
                        this.float = 0;
                        this.x = 0;
                        this.itemObject.scale = 1;
                        this.itemObject.opacity = 1;
                    }
                    if(App.time <= this.startTime + 2000){
                        this.pet.setState('idle');
                        this.pet.x = '50%';
                        this.pet.y = '80%';
                        this.itemObject.x = '50%';
                    } else {
                        this.pet.setState(this.itemObject.opacity > 0 ? 'shocked' : 'mild_uncomfortable');
                        this.float += 0.025 * App.deltaTime;
                        this.x = this.pet.x;
                        this.itemObject.x = this.x - (Math.cos(this.float) * 20);
                        this.itemObject.scale += this.float * 0.001;
                        if(this.float > 80){
                            this.itemObject.opacity -= 0.001 * App.deltaTime;
                        }
                    }
                    this.itemObject.y = 70 - (Math.sin(this.float) * 20);
                    this.itemObject.z = App.constants.ACTIVE_PET_Z + 0.1;
                    break;
                case "microphone":
                    this.pet.x = randomFromArray(['25%', '50%', '75%']);
                    this.pet.y = '85%';
                    this.pet.inverted = !this.pet.inverted;

                    this.itemObject.x = this.pet.x;
                    this.itemObject.y = ((App.drawer.getRelativePositionY(92) - App.constants.ITEM_SPRITESHEET_DIMENSIONS.cellSize));
                    this.itemObject.z = this.pet.z;
                    this.itemObject.inverted = this.pet.inverted;

                    this.itemObject.onDraw = function() {
                        if(!this._animFloat) this._animFloat = 0;
                        this._animFloat += 0.005 * App.deltaTime;
                        this.rotation = 0 + (Math.sin(this._animFloat) * 25);
                    }
                    break;

                case "rubicube":
                case "smartphone":
                case "magazine":
                case "retroboy":
                    const extendedAnimationItems = ['smartphone', 'retroboy'];
                    this.pet.setState(
                        randomFromArray([
                            'sitting', 'sitting',
                            extendedAnimationItems.includes(this.item?.name) ? 'eating' : 'sitting', 'shocked', 'blush'
                        ])
                    );
                    this.itemObject.x = this.pet.x + App.petDefinition.spritesheet.cellSize / 1.5;
                    this.itemObject.y = ((this.pet.y - 13) + random(-2, 2));
                    if(this.item?.name === 'rubicube') this.itemObject.inverted = !this.itemObject.inverted;
                    break;

                case "ball":
                    this.pet.y = '100%';
                    this.pet.x = '50%';

                    this.itemObject.x = randomFromArray(['40%', '60%']);
                    this.itemObject.y = ((App.drawer.getRelativePositionY(95) - App.constants.ITEM_SPRITESHEET_DIMENSIONS.cellSize) + random(-2, 2));
                    this.itemObject.z = this.pet.z + (randomFromArray([0.1, -0.1]));

                    break;
                case "music player":
                    this.pet.x = randomFromArray(['25%', '50%', '75%']);
                    this.pet.y = randomFromArray(['100%', '80%', '90%']);
                    this.pet.inverted = !this.pet.inverted;

                    this.itemObject.x = '50%';
                    this.itemObject.y = '70%';

                    this.itemObject.onDraw = function() {
                        if(!this._animFloat) this._animFloat = 0;
                        this._animFloat += 0.015 * App.deltaTime;
                        this.scale = 1 + (Math.sin(this._animFloat) * 0.09);
                    }
                    break;
                case "dumble":
                    this.pet.setState(randomFromArray(['uncomfortable', 'shocked']));
                    this.pet.x = '50%';
                    this.pet.y = '90%';
                    this.itemObject.z = this.pet.z + 0.1;
                    this.itemObject.x = '50%';
                    this.itemObject.y = ((App.drawer.getRelativePositionY(95) - App.constants.ITEM_SPRITESHEET_DIMENSIONS.cellSize) + random(-2, 2));
                    this.itemObject.inverted = !this.itemObject.inverted;
                    break;
                case "foxy":
                case "bear":
                    this.pet.setState(randomFromArray(['cheering', 'shocked', 'blush']));
                    const xOffset = (this.pet.petDefinition.spritesheet.cellSize / 2) * (random(0, 1) ? -0.5 : 1);
                    this.itemObject.z = this.pet.z + 0.1;
                    this.itemObject.x = this.pet.x + xOffset;
                    this.itemObject.y = ((this.pet.y - 10) + random(-2, 2));
                    this.itemObject.inverted = !this.itemObject.inverted;
                    break;
                case "fidget spinner":
                    if(!this.itemObject._speed) this.itemObject._speed = -10;
                    this.itemObject._speed = lerp(this.itemObject._speed, -5, 0.0005 * App.deltaTime);

                    if(this.itemObject._speed < 0){
                        this.pet.setState('mild_uncomfortable');
                    }
                    if(this.itemObject._speed <= -2){
                        this.pet.setState(randomFromArray(['cheering', 'shocked', 'blush']));
                        setTimeout(() => this.pet.setState('idle'), 500);
                        this.itemObject._speed = random(5, 50);
                        const xOffset = (this.pet.petDefinition.spritesheet.cellSize / 2.5) * randomFromArray([-0.5, 0.25, 1]);
                        this.itemObject.x = this.pet.x + xOffset;
                    }

                    const cappedSpeed = clamp(this.itemObject._speed, 0, 999);
                    this.itemObject.z = this.pet.z + 0.1;
                    this.itemObject.y = this.pet.y - 6;
                    this.itemObject.rotation += cappedSpeed * App.deltaTime;
                    break;
                case "rattle":
                    this.pet.y = '100%';

                    this.pet.x = randomFromArray(['30%', '50%', '70%']);

                    const possibleItemPositions = ['25%', '50%', '75%'];
                    this.itemObject.x = randomFromArray(possibleItemPositions);
                    this.itemObject.y = randomFromArray(possibleItemPositions);
                    this.itemObject.z = this.pet.z + 1;
                    this.itemObject.inverted = !this.itemObject.inverted;
                    break;
                case "robotty":
                    if(this.stateIndex === undefined){
                        this.pet.y = '80%';
                        this.pet.x = '50%';
                        this.pet.setState('idle');
                        this.itemObject.z = this.pet.z + 0.1;
                        this.stateIndex = -1;
                        this.positions = ['20%', '30%', '40%', '50%', '60%', '70%', '80%'];
                    } else {
                        App.playSound(`resources/sounds/ui_click_04.ogg`, true);
                    }

                    if(this.stateIndex % 3 === 0){
                        this.pet.inverted = Boolean(random(0, 1));
                        this.pet.setState( randomFromArray( ['cheering', 'shocked', 'idle_side', 'jumping', 'jumping', 'idle'] ) );
                        setTimeout(() => this.pet.setState('idle'), 350);
                    }

                    this.stateIndex++;
                    if(this.stateIndex >= this.positions.length){
                        this.positions.reverse();
                        this.stateIndex = 0;
                    }
                    this.itemObject.x = this.positions.at(this.stateIndex);
                    switch(this.stateIndex % 4){
                        case 0: this.itemObject.rotation = -5; break;
                        case 1: this.itemObject.rotation = 0; break;
                        case 2: this.itemObject.rotation = 5; break;
                        case 3: this.itemObject.rotation = 0; break;
                    }
                    switch(this.stateIndex % 2){
                        case 0: this.itemObject.y = '85%'; break;
                        case 1: this.itemObject.y = '80%'; break;
                    }
                    break;
                case "8ball":
                    if(!this.hasInit){
                        this.hasInit = true;
                        this.itemObject.x = '60%';
                        this.itemObject.y = this.pet.y - (this.pet.petDefinition.spritesheet.offsetY || 0);
                        this.itemObject.z = this.pet.z + 1;
                        this.pet.x = '50%';
                        this.pet.setState('idle');
                        setTimeout(() => {
                            App.displayConfirm(`Think of a question, <b>magic 8 ball</b> shall answer...`, [
                                {
                                    name: 'ask!',
                                    onclick: () => {
                                        this.isActivated = true;
                                        this.pet.setState('shocked');
                                        const msg = App.displayMessageBubble(App.getMagic8BallAnswer(), App.getItemCSprite(App.definitions.item['8ball'].sprite))
                                        setTimeout(() => {
                                            msg.close();
                                            this.pet.stopScriptedState();
                                        }, 5000);
                                    }
                                }
                            ])
                        }, 2000);
                    }

                    if(this.isActivated){
                        this.itemObject.rotation = random(-30, 30);
                    }
                    break;
                default:
                    if(Math.random() < 0.5){
                        const possibleStates = ['cheering', 'eating', 'shocked', 'sitting', 'blush'];
                        this.pet.setState(randomFromArray(possibleStates));
                        this.pet.inverted = random(0, 1) ? true : false;
                    }
            }
        }
    }
}
