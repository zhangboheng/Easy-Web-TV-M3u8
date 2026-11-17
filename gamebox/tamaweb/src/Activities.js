class Activities {
    static async openScratchCard({
        npc = "resources/img/character/mall_npc_01.png",
        scene = App.scene.mallInterior,
        onEndCallback,
    } = {}) {
        App.closeAllDisplays();
        App.toggleGameplayControls(false);
        App.setScene(scene),
        App.pet.triggerScriptedState('idle', App.INF, false, true);
        App.pet.stopMove();
        App.pet.x = '50%';

        // pRandom.seed = App.getDayId(true) + App.petDefinition.getCharHash();

        const mascotAnimal = App.getRandomAnimalDef();

        const prizeSlots = new Array(3).fill(null).map(() => {
            return random(0, 100) <= 25 ? mascotAnimal : { isPoop: true };
        })

        const screen = UI.empty();
        document.querySelector('.screen-wrapper').appendChild(screen);
        screen.innerHTML = `
            <div class="flex flex-dir-col justify-center align-center absolute-fullscreen display menu-animation">
                <div class="scratch-card flex flex-center">
                    <div class="scratch-card__animal">${mascotAnimal.getFullCSprite(true)}</div>
                    <div class="scratch-card__content flex-center">
                        <span class="flex align-center justify-between width-half">
                            ${prizeSlots.map(slot => {
                                return slot.isPoop ? '<img src="./resources/img/misc/poop.png"/>' : slot.getFullCSprite(true)
                            }).join('\n')}
                        </span>
                    </div>
                </div>
            </div>
        `;
        const contentElement = screen.querySelector('.scratch-card__content');
        const cardElement = screen.querySelector('.scratch-card');

        const drawer = new Drawer(null, 150, 40);
        contentElement.appendChild(drawer.canvas);

        // init
        const patternImage = new Image();
        patternImage.src = 'resources/img/ui/lucky_ticket_pattern.png';
        patternImage.onload = () => {
            const pattern = drawer.context.createPattern(patternImage, 'repeat');
            pattern.setTransform(new DOMMatrix().scale(1));

            drawer.context.fillStyle = pattern;
            drawer.context.fillRect(
                0,
                0,
                drawer.bounds.width,
                drawer.bounds.height
            );
        };

        const { canvas } = drawer;
        const rect = canvas.getBoundingClientRect();

        const getPercentRevealed = () => {
            const imageData = drawer.context.getImageData(0, 0, drawer.bounds.width, drawer.bounds.height);
            const data = imageData.data;
            let transparentPixels = 0;

            // check alpha channel
            for (let i = 3; i < data.length; i += 4) {
              if (data[i] === 0) transparentPixels++;
            }

            return transparentPixels / (drawer.bounds.width * drawer.bounds.height);
        }

        const onEnd = () => {
            const matchingPrizes = prizeSlots.reduce(
                (acc, animal) =>
                    animal.sprite === mascotAnimal.sprite
                        ? acc + 1
                        : acc,
                0,
            );

            screen.remove();
            App.pet.stopScriptedState();
            App.toggleGameplayControls(true);
            Missions.done(Missions.TYPES.scratch_lucky_ticket);
            App.displayPopup(
                `You got <b>${matchingPrizes}</b>/<b>${prizeSlots.length}</b> right!`,
                3000,
                () => {
                    Activities.task_winMoney({
                        npc,
                        amount: Math.floor(35 * matchingPrizes * (matchingPrizes / 1.35)),
                        hasWon: matchingPrizes >= 1,
                        shouldOpenGameList: false,
                        onEndCallback,
                    })
                },
            );
        }

        const eventDriver = App.registerOnDrawEvent(() => {
            if(!App.mouse.isDown) return;

            if(App.canProceed('lucky_ticket_sfx', 200)){
                App.playSound(`resources/sounds/swoosh_0${random(1, 2)}.ogg`, true);
            }

            const scaledX = (App.mouse.screenX - rect.left) * (canvas.width / rect.width),
                scaledY = (App.mouse.screenY - rect.top) * (canvas.height / rect.height);

            drawer.context.globalCompositeOperation = 'destination-out';
            drawer.context.beginPath();
            drawer.context.arc(scaledX, scaledY, 10, 0, App.PI2);
            drawer.context.fill();

            const percent = getPercentRevealed();
            if(percent > .9){
                drawer.canvas.remove();
                App.unregisterOnDrawEvent(eventDriver);
                cardElement.classList.add('single-pulse-anim');
                setTimeout(onEnd, 1500);
                setTimeout(() => App.playSound(`resources/sounds/cute.ogg`, true));
            }
        })
    }
    static async openGenericGift({onEnd, onMiddle}){
        App.toggleGameplayControls(false);

        const main = new TimelineDirector(App.pet);

        main.setPosition({x: '70%'});

        const giftObject = new Object2d({
            img: 'resources/img/misc/gift.png',
            x: '40%', y: '84%', z: App.constants.ACTIVE_PET_Z + 0.1,
            opacity: 0,
            onDraw: (me) => {
                me.opacity = lerp(me.opacity, 1, 0.001 * App.deltaTime);
            }
        });

        const particlesSpawner = Activities.task_explodingParticles({
            x: giftObject.x,
            y: giftObject.y,
            parent: giftObject,
        })

        main.setState('cheering_with_icon');
        setTimeout(() => App.pet.playSound('resources/sounds/cheer_success.ogg', true), 200);
        await TimelineDirector.wait(3000);

        App.fadeScreen({
            middleFn: () => {
                particlesSpawner.removeObject();
                giftObject.removeObject();
                main.release();
                onMiddle?.();
            },
            endFn: () => {
                App.toggleGameplayControls(true);
                onEnd?.();
            },
        })
    }
    static async goToPostOffice(onEndCallback) {
        App.setScene(App.scene.post_office);
        App.toggleGameplayControls(false);

        const clippedCounterObject = new Object2d({
            img: App.scene.post_office.image,
            x: 0, y: 0, z: App.pet.z - 1,
            clip: [
                [42, 51],
                [44, 70],
                [95, 70],
                [95, 51],
            ]
        })

        const clerkDefinition = new PetDefinition({
            // sprite: 'resources/img/character/chara_265b.png',
            sprite: 'resources/img/character/mailman_01.png'
        });

        const clerk = new TimelineDirector(
            new Pet(clerkDefinition, {
                castShadow: false,
            })
        );
        clerk.actor.z = App.pet.z - 1.1;
        const main = new TimelineDirector(App.pet);

        const onEnd = () => {
            clippedCounterObject.removeObject();
            clerk.remove();
            main.release();
            App.setScene(App.scene.home);
            onEndCallback?.();
        }

        clerk.setPosition({x: '72%', y: '62%'});
        main.setPosition({x: '0%', y: '95%'});

        const displayLetterWriting = ({
            onSend, onCancel
        }) => {
            const generator = new StoryGenerator();
            generator.deserialize(STORIES.a0);

            const scorer = new ChainLetterScorer(generator);

            const headline = 'Letter to...';
            let text = '';

            const container = App.displayEmpty('letter');
            container.innerHTML = `
            <div class="flex flex-dir-col">
                <h1>${App.getIcon('envelope')}</h1>
                <h1 class="hidden">${headline}</h1>
                <span id="text">
                    <small class="opacity-half">
                        <i>Start writing by selecting words ...</i>
                    </small>
                </span>
                <footer></footer>
                <div class="word-options" id="buttons"></div>
                <div class="flex flex-dir-col">
                    <button disabled id="send" class="generic-btn stylized">
                        Send ${App.getIcon('envelope ml-auto', true)}
                    </button>
                    <button id="cancel" class="generic-btn stylized back-btn">
                        Cancel
                    </button>
                </div>
            </div>
            `

            const textContainer = container.querySelector('#text');
            const buttonsContainer = container.querySelector('#buttons');
            const sendButton = container.querySelector('#send');
            sendButton.onclick = () => {
                App.displayConfirm(...GenericUIDef.binaryConfirm({
                    onAccept: () => {
                        const score = scorer.scoreLetter(text);
                        const rating = scorer.rate(score);

                        container.close();
                        onSend?.(text, rating);
                    }
                }))

            }
            container.querySelector('#cancel').onclick = () => {
                App.displayConfirm(...GenericUIDef.binaryConfirm({
                    onAccept: () => {
                        container.close();
                        onCancel?.();
                    }
                }))
            }

            const updateButtons = () => {
                const lastWord = text.split(' ').at(-1);
                const words = generator.getRandomNextWords(lastWord, 6);
                buttonsContainer.innerHTML = words.map((word, i) => `
                    <div class="word-option cursor-pointer click-sound" id="${i}">
                        ${word}
                    </div>
                `).join('');
                const buttons = [...buttonsContainer.querySelectorAll('.word-option')];
                buttons.forEach((button, i) => {
                    button.onclick = () => {
                        const nextWord = words[i];
                        text = `${text} ${nextWord}`;
                        textContainer.textContent = `${text}.`;
                        updateButtons();
                        if(text.split(' ').length > 3){
                            sendButton.disabled = false;
                        }
                    }
                })
            }

            updateButtons();
        }

        const task_moveInShock = async () => {
            // moving in
            clerk.setState('idle_side')
            clerk.lookAt(true);
            await main.moveTo({x: '50%', speed: 0.02});

            await TimelineDirector.wait(500);

            clerk.setState('idle');
            await TimelineDirector.wait(200);
            clerk.setState('idle_side');
            await TimelineDirector.wait(100);
            await clerk.bob({maxCycles: 1, animation: 'shocked', landAnimation: 'idle'});

            await TimelineDirector.wait(200);

            clerk.actor.say('welcome to the post office!', 2000);
            await TimelineDirector.wait(2000);

            clerk.actor.say('what can I do for you?', 2000);
            await TimelineDirector.wait(2000);
        }

        const task_sendLetter = async () => {
            main.bob({maxCycles: 1});
            clerk.bob({maxCycles: 1});

            await TimelineDirector.wait(1000);

            main.setState('idle_side');
            main.lookAt(true);

            const currentPositionX = clerk.getPosition('x');
            await clerk.moveTo({x: '150%', speed: 0.05});
            await clerk.moveTo({x: currentPositionX, speed: 0.05});

            await TimelineDirector.wait(200);
            clerk.actor.say('all done!', 2000);

            main.setState('cheering_with_icon');
            App.pet.playSound('resources/sounds/task_complete_02.ogg', true);

            await TimelineDirector.wait(2500);

            App.fadeScreen({
                middleFn: onEnd,
            })
        }

        await task_moveInShock();

        const openMenu = () => {
            App.displayList([
                {
                    name: 'Send letter',
                    onclick: () => {
                        App.handlers.open_friends_list(
                            (friendDef) => {
                                if(friendDef.stats.player_sent_letter){
                                    return App.displayPopup(`You sent a letter to ${friendDef.getAvatar()} too recently!`);
                                }

                                App.closeAllDisplays();
                                displayLetterWriting({
                                    onSend: (letterContent, letterRating) => {
                                        task_sendLetter();
                                        friendDef.stats.player_sent_letter = {
                                            time: Date.now(),
                                            rating: letterRating
                                        }
                                        App.save();
                                    },
                                    onCancel: () => {
                                        openMenu();
                                    }
                                });
                            }
                        )
                        return true;
                    }
                },
            ], onEnd)
        }

        openMenu();
    }
    static async digGardenTreasure(){
        document.querySelector('#garden-screen')?.remove(); // bad, change later
        App.toggleGameplayControls(false);
        App.setScene(App.scene.garden);
        App.handleAnimalsSpawn(false);
        const parent = new Object2d({});

        const isValuable = random(0, 2);
        const goldAmount = random(10, 30) * 10;

        const spawnSmoke = (x, y, scale = 0.5) => {
            return Activities.task_explodingParticles({
                img: 'resources/img/misc/foam_single.png',
                despawnTime: 100,
                spawnDelay: 0,
                x, y,
                parent,
                opacity: scale, targetOpacity: scale,
                scale: 1, targetScale: 0,
                speed: 0.5,
            })
        }

        const main = new TimelineDirector(App.pet);

        main.setState('idle_side');
        main.lookAt(false);
        main.setPosition({x: '50%'});
        await TimelineDirector.wait(500);
        await main.moveTo({x: '35%', speed: 0.05});

        for(let i = 0; i < 3; i++){
            await TimelineDirector.wait(500);
            await main.bob({animation: 'idle_side_uncomfortable', landAnimation: 'idle_side', maxCycles: 1});
            spawnSmoke(App.temp.digSpotObject.x, App.temp.digSpotObject.y, 0.2);
            App.pet.playSound('resources/sounds/ui_click_05.ogg', true);
            Object2d.actionAnimations.horizontalJiggle(App.temp.digSpotObject);
        }

        App.temp.digSpotObject.spritesheet.cellNumber = 2;

        const chestObject = new Object2d({
            parent,
            img: 'resources/img/misc/treasure_chest_01.png',
            x: '40%',
            y: '78%',
            z: App.pet.z + 1,
            opacity: 0,
            scale: 0.1,
            rotation: 0,
            spritesheet: {
                cellSize: 27,
                cellNumber: 1,
                rows: 1,
                columns: 2,
            },
            onLateDraw: (me) => {
                me.opacity = lerp(me.opacity, 1, 0.01 * App.deltaTime);
                me.scale = lerp(me.scale, 1, 0.01 * App.deltaTime);
                me.rotation = lerp(me.rotation, 0, 0.01 * App.deltaTime);
            }
        })
        App.pet.setLocalZBasedOnSelf(chestObject);
        await TimelineDirector.wait(10);
        await main.jumpTo({
            x: "80%",
            speed: 0.0015,
            curve: 0.5,
            y: main.getPosition("y"),
            endState: "shocked_without_sound",
            animation: "shocked_without_sound",
        });
        App.pet.playSound('resources/sounds/shock.ogg', true);
        main.actor.stopMove();
        await TimelineDirector.wait(500);
        main.setState('idle_side');
        await TimelineDirector.wait(500);
        await main.moveTo({x: '72%', speed: 0.01});
        await TimelineDirector.wait(500);

        for(let i = 0; i < 3; i++){
            await main.bob({animation: 'idle_side_uncomfortable', landAnimation: 'idle_side', maxCycles: 1});
            chestObject.rotation = randomFromArray([-10, 10]);
            Object2d.actionAnimations.horizontalJiggle(chestObject);
            spawnSmoke(chestObject.x, chestObject.y, 0.2);
            App.pet.playSound('resources/sounds/ui_click_05.ogg', true);
            await TimelineDirector.wait(200);
        }

        await main.bob({animation: 'idle_side_uncomfortable', landAnimation: 'shocked', maxCycles: 1});
        chestObject.rotation = randomFromArray([-10, 10]);
        Object2d.actionAnimations.horizontalJiggle(chestObject);

        spawnSmoke(chestObject.x, chestObject.y, 0.2);
        chestObject.scale = 1.3;
        chestObject.spritesheet.cellNumber = 2;
        App.pet.playSound('resources/sounds/task_complete.ogg', true);

        Activities.task_explodingParticles({
            img: isValuable
                ? 'resources/img/misc/twinkle_01.png'
                : 'resources/img/misc/poop.png',
            despawnTime: 1500,
            x: chestObject.x,
            y: chestObject.y,
            parent,
        })

        // treasure object
        const treasureObject = new Object2d({
            parent,
            img: isValuable
                ? 'resources/img/misc/money_bag_01.png'
                : 'resources/img/misc/poop.png',
            x: '40%',
            y: '80%',
            z: App.constants.ACTIVE_PET_Z + 1,
            opacity: 0,
            onLateDraw: (me) => {
                me.y = lerp(me.y, 35, 0.001 * App.deltaTime);
                me.opacity = lerp(me.opacity, 1, 0.002 * App.deltaTime);
            }
        })
        treasureObject.showOutline('#FFFF00');

        await main.bob({animation: 'shocked', landAnimation: 'shocked', maxCycles: 1});
        App.pet.playSound('resources/sounds/shock.ogg', true);
        await TimelineDirector.wait(1000);

        let messageBubble;
        if(isValuable){
            main.setState('cheering_with_icon');
            App.pet.playSound('resources/sounds/task_complete_02.ogg', true);
            messageBubble = App.displayMessageBubble(`$${goldAmount}`);
            App.pet.stats.gold += goldAmount;
        } else {
            main.setState('uncomfortable');
            App.pet.playSound('resources/sounds/task_fail_01.ogg', true);
            App.pet.stats.current_fun -= 50;
        }

        await TimelineDirector.wait(3000);
        messageBubble?.close();

        await TimelineDirector.wait(500);
        App.save();

        App.fadeScreen({
            middleFn: () => {
                App.temp.hasActiveDigSpot = false;
                parent.removeObject();
                main.release();
                Activities.goToGarden();
            }
        })
    }
    static async moveOut(isChild){
        App.closeAllDisplays();
        App.setScene(App.scene.galaxy);
        App.toggleGameplayControls(false);
        const parent = new Object2d({});

        const backgroundMusic = App.playAdvancedSound({
            loop: true,
            src: 'resources/sounds/move_out_bm_01.mp3',
            volume: 0.5,
        });

        const daysSinceBirth = moment().diff(App.petDefinition.birthday, 'days');

        const getCareState = () => {
            if(daysSinceBirth <= 1) return 'abandoned'
            else if(daysSinceBirth <= 2) return 'leaveEarly'
            switch(App.pet.stats.current_care){
                case 1: return 'lowCare';
                case 3: return 'highCare';
                default: return 'mediumCare';
            }
        }

        const getDialogMessage = () => {
            switch(getCareState()){
                case 'abandoned': return {
                    title: 'Abandonment',
                    // msg: `Already letting me go? I guess some connections just aren't meant to form. Hope you find what you are looking for.`,
                    msg: `Already letting <i>${App.petDefinition.name}</i> go? Guess some connections just aren't meant to form.<br><br>You weren't really ready for this responsibility, were you?<br><br>Please think twice before getting another pet.`,
                    sender: 'The Collective',
                };
                case 'leaveEarly': return {
                    title: `Dear ${App.userName}`,
                    msg: `You and <i>${App.petDefinition.name}</i> barely had any time together!<br>A day wasn't enough to really get to know each other.<br><br>Maybe your paths will cross again when you have more time to spare.`,
                    sender: 'The Collective',
                }
                case 'lowCare': return {
                    msg: `Even though you didn't take very good care of me, I still fondly look back on our journey. Please take care.`,
                    sender: App.petDefinition.name,
                }
                case 'mediumCare': return {
                    msg: `It's been ${moment(App.petDefinition.birthday).fromNow(true)} since we met, and while our journey had its ups and downs, I'll remember the good times most. Thank you for being there when it mattered. Take care!`,
                    sender: App.petDefinition.name,
                }
                case 'highCare': return {
                    msg: `Thank you for taking care of me for the past ${moment(App.petDefinition.birthday).fromNow(true)}, I will cherish every memory we have and will not forget about all the moments we shared together <3`,
                    sender: App.petDefinition.name,
                }
            }
        }

        const getMood = () => {
            const state = getCareState();
            if(state === 'mediumCare' || state === 'highCare') return 'blush';
            return 'idle_side_uncomfortable';
        }

        const dialog = getDialogMessage();
        const isSenderPet = App.petDefinition.name === dialog.sender;

        const main = new TimelineDirector(App.pet, {
            driverFn: (me) => {
                if(!me.circleMovementVector && typeof me.x !== 'string'){
                    me.circleMovementVector = {
                        x: me.x,
                        y: me.y,
                        float: 0,
                    }
                    return;
                }
                me.circleMovementVector.float += 0.001 * App.deltaTime;
                Object2d.animations.circleAround(me, 5, me.circleMovementVector.float, me.circleMovementVector.x, me.circleMovementVector.y);
            },
        });

        const mood = getMood();

        main.setPosition({x: '50%', y: '80%'});

        main.actor.opacity = 0.0001;
        await main.fade({target: 1, speed: 0.001});
        main.actor.opacity = 1;

        await TimelineDirector.wait(500);

        if(mood === 'blush') {
            await main.bob({
                maxCycles: 2,
                landAnimation: 'idle'
            });
        }

        await TimelineDirector.wait(500);
        main.setState(mood);

        if(isSenderPet){
            await Activities.enterDialog(
                App.petDefinition,
                dialog.msg,
            );
        }

        await TimelineDirector.wait(500);

        main.bob();

        const twinkle = new Object2d({
            parent,
            img: 'resources/img/misc/twinkle_01.png',
            x: '50%',
            y: '50%',
            opacity: 1,
            scale: 0,
            rotation: 0,
            width: 27, height: 27,
            z: App.pet.z + 5,

            targetScale: 0.7,
            changeSpeed: 0.003,
        })

        twinkle.onDraw = (me) => {
            me.scale = lerp(me.scale, me.targetScale, me.changeSpeed * App.deltaTime);
            me.rotation += 0.5 * App.deltaTime;
        }
        setTimeout(() => {
            twinkle.targetScale = 0;
        }, 800);

        await main.fade({target: 0, speed: 0.003});
        main.actor.opacity = 0;
        main.setPosition({x: '150%'});

        await TimelineDirector.wait(2000);

        App.fadeScreen({middleFn: () => {
            parent.removeObject();

            const end = () => {
                backgroundMusic.stop(0.0001);
                App.transferAndGetFreshEgg(!isChild);
                App.save();
            }


            if(isSenderPet){
                return end();
            }

            App.handlers.show_letter({
                headline: dialog.title || '',
                text: dialog.msg,
                sender: dialog.sender,
                onClose: () => {
                    end();
                }
            })
        }})
    }
    static async enterDialog(speakerPetDef = App.getRandomPetDef(), text){
        const currentGameplayControls = App.getGameplayControlsState();

        let resolvePromise;
        const promise = new Promise((resolve) => {
            resolvePromise = resolve;
        })

        const WORDS_PER_SCREEN = 8;

        const cleaned = text.trim().replace(/\s+/g, ' ');

        let currentWordPointer = 0;
        const textWords = cleaned.split(' ');
        let activeText = '';
        let currentLetterPointer = 0;

        const screen = UI.empty();
        document.querySelector('.screen-wrapper').appendChild(screen);
        screen.innerHTML = `
            <div class="dialog flex flex-dir-col justify-between width-full">
                <div class="dialog_icon">
                    ${speakerPetDef.getFullCSprite()}
                </div>
                <div class="dialog_textContainer">
                    <span class="dialog_text"></span>
                    <span style="display: none" class="dialog_indicator"> … </span>
                </div>
            </div>
        `;
        const dialogTextElement = screen.querySelector('.dialog_text');
        const dialogIndicatorElement = screen.querySelector('.dialog_indicator');

        const textAnimationHandler = setInterval(() => {
            currentLetterPointer += 1;
            if(currentLetterPointer > activeText.length) {
                currentLetterPointer = 999;
                UI.show(dialogIndicatorElement);
            } else {
                UI.hide(dialogIndicatorElement);
            }
            const nextString = activeText.slice(0, currentLetterPointer);
            if(dialogTextElement.innerHTML !== nextString){
                App.playSpeechSound(nextString.slice(-1));
                dialogTextElement.innerHTML = nextString;
            }
        }, 50);

        const progressDialog = () => {
            if(currentLetterPointer < activeText.length){
                currentLetterPointer = 999;
                return;
            }
            const nextSetOfWords = textWords.slice(currentWordPointer, currentWordPointer + WORDS_PER_SCREEN).join(' ');
            activeText = nextSetOfWords;
            currentLetterPointer = 0;
            if(!nextSetOfWords){
                screen.remove();
                clearInterval(textAnimationHandler);
                App.toggleGameplayControls(
                    currentGameplayControls.state,
                    currentGameplayControls.onclick,
                    currentGameplayControls.triggerFeedback
                );
                resolvePromise();
            }
            currentWordPointer += WORDS_PER_SCREEN;
        }
        progressDialog();

        App.toggleGameplayControls(false, progressDialog)

        return promise;
    }
    static async getRobbed(){
        const hasIndoorAnimal = App.animals.list?.some(animalDef => animalDef.spawnIndoors);

        const npc = new Pet(
            new PetDefinition({
                sprite: 'resources/img/character/robber_01.png',
            })
        )
        npc.animations.moving.frameTime = 200;

        const robber = new TimelineDirector(npc);

        const checkDriver = App.registerOnDrawEvent(() => {
            const flee = async () => {
                robber.release();
                const fleeingRobber = new TimelineDirector(npc);

                fleeingRobber.setState('idle');
                fleeingRobber.think(hasIndoorAnimal ? 'thought_paw' : 'thought_exclaim');
                npc.animations.moving.frameTime = 100;
                await fleeingRobber.bob({animation: 'moving', maxCycles: 1});
                await TimelineDirector.wait(200);
                await fleeingRobber.moveTo({x: '-30%', speed: 0.05});
                fleeingRobber.remove();
            }

            if(!App.pet.stats.is_sleeping || hasIndoorAnimal){
                flee();
                App.unregisterOnDrawEvent(checkDriver);
            }
        })

        robber.setPosition({x: `${random(20, 80)}%`, y: '85%'});

        for(let i = 0; i < 4; i++){
            await robber.moveTo({x: `${random(20, 80)}%`, speed: 0.005});
            robber.think('thought_talk')
            if(i === 2){
                const stealingAmount = random(10, 100);
                if(App.pet.stats.gold < stealingAmount){
                    const lines = [
                        'Why so poor??',
                        'Where...?',
                        'You poorer than me...',
                        'No money...?',
                    ]
                    robber.actor.say(randomFromArray(lines));
                } else {
                    robber.actor.say(`-$${stealingAmount}`);
                    App.pet.stats.gold -= stealingAmount;
                }
            }
            await TimelineDirector.wait(random(2000, 5000))
        }

        npc.animations.moving.frameTime = 100;
        await robber.moveTo({x: '-30%', speed: 0.05});
        robber.remove();
        App.unregisterOnDrawEvent(checkDriver);
    }
    static async goToRestaurant(otherPetDef = App.getRandomPetDef()){
        App.toggleGameplayControls(false);
        App.setScene(App.scene.restaurant);
        Missions.done(Missions.TYPES.go_to_restaurant);

        const tableObject = new Object2d({
            img: 'resources/img/misc/restaurant_table_01.png',
            x: 0, y: 0, z: App.pet.z + 1,
        })

        App.pet.stopMove();
        const pet = new TimelineDirector(App.pet);

        const waiter = new TimelineDirector(
            new Pet(new PetDefinition({
                sprite: randomFromArray([
                    'resources/img/character/chara_179b.png',
                    'resources/img/character/chara_220b.png'
                ]),
            }))
        )
        waiter.setPosition({x: '-25%', y: '75%'});

        pet.setPosition({x: '100%'});
        await pet.moveTo({x: '80%', speed: 0.025});

        await pet.jumpTo({x:'83%', y: '80%', speed: 0.002})
        pet.actor.stopMove();

        await waiter.moveTo({x: '30%', speed: 0.025});
        waiter.setState('jumping')

        waiter.actor.say('Welcome!', 1000);
        await TimelineDirector.wait(1000);
        waiter.actor.say('What can I get you?', 2000);

        await TimelineDirector.wait(2000);

        const onEnd = () => {
            pet.release();
            tableObject.removeObject();
            App.toggleGameplayControls(true);
            App.handlers.open_activity_list(true);
            waiter.remove();
        }
        const spawnAndEatFood = async (foodItem) => {
            waiter.setPosition({x: '-30%'});
            await waiter.moveTo({x: '40%', speed: 0.03});

            new Object2d({
                img: 'resources/img/misc/foam_single.png',
                x: '65%',
                y: '70%',
                opacity: 1,
                scale: 1.5,
                rotation: random(0, 180),
                z: App.constants.ACTIVE_PET_Z + 2,
                onDraw: (me) => {
                    Object2d.animations.flip(me);
                    Object2d.animations.pulseScale(me, 0.1, 0.01);
                    me.scale -= 0.0009 * App.deltaTime;
                    me.opacity -= 0.0009 * App.deltaTime;
                    if(me.opacity <= 0) me.removeObject();
                }
            })

            const { sprite, hunger_replenish = 24 } = foodItem.current;
            const foodObject = new Object2d({
                image: App.preloadedResources[App.constants.FOOD_SPRITESHEET],
                spritesheet: {
                    ...App.constants.FOOD_SPRITESHEET_DIMENSIONS,
                    cellNumber: sprite
                },
                scale: 1,
                x: '65%',
                y: '70%',
                z: App.pet.z + 1.5,
                noPreload: true,
            })

            await pet.bob({maxCycles: 1, animation: 'cheering', landAnimation: 'jumping'});
            waiter.bob({maxCycles: 1, animation: 'jumping', landAnimation: 'jumping'});

            await TimelineDirector.wait(500);

            waiter.actor.say('Enjoy!', 1000);

            await TimelineDirector.wait(1000);

            await waiter.moveTo({x: '-30%', speed: 0.03});

            pet.lookAt(false);
            pet.setState('eating');

            App.pet.stats.current_hunger += hunger_replenish * 1.5;
            App.pet.stats.current_fun += random(15, 30);

            const wantedFoodItem = App.definitions.food[App.pet.stats.current_want.item];
            App.petDefinition.checkWant(sprite === wantedFoodItem?.sprite, App.constants.WANT_TYPES.food);

            await TimelineDirector.wait(1500);
            foodObject.spritesheet.cellNumber = sprite + 1;
            await TimelineDirector.wait(1500);
            foodObject.spritesheet.cellNumber = sprite + 2;
            await TimelineDirector.wait(1500);
            foodObject.removeObject();

            pet.setState('blush');

            await TimelineDirector.wait(1000);

            pet.release();
            App.pet.playCheeringAnimation(onEnd);
        }

        const getMenuItems = () => {
            if(App.temp.restaurantMenuItems) return App.temp.restaurantMenuItems;

            const possibleFoodItems = App.handlers.open_food_list({
                buyMode: true,
                getListOnly: true,
                filterType: 'food',
                age: PetDefinition.LIFE_STAGE.adult,
                allowCookableOnly: random(0, 4) === 0,
                outOfStockPercent: 0,
                priceMult: 2,
            });
            const menuItems = shuffleArray(possibleFoodItems)
                .slice(0, 6);
            App.temp.restaurantMenuItems = menuItems;

            return menuItems;
        }

        const menuItems = getMenuItems()
            .map(item => ({
                ...item,
                disabled: false,
                onclick: () => {
                    if(App.pay(item.price)){
                        spawnAndEatFood(item);
                        return false;
                    }
                    return true;
                },
            }));

        App.displaySlider(menuItems, false, {
            accept: 'Order',
            onCancel: onEnd
        }, `$${App.pet.stats.gold + (App.isSalesDay() ? ` <span class="sales-notice">DISCOUNT DAY!</span>` : '')}`);
    }
    static async ghost_befriendingGame(otherPetDef = App.getRandomPetDef()){
        const isTargetNegative = otherPetDef.stats.is_ghost === PetDefinition.GHOST_TYPE.devil;

        App.closeAllDisplays();
        App.setScene(App.scene.devil_town_gathering);
        App.toggleGameplayControls(false);

        const main = new TimelineDirector(App.pet);
        const otherPet = new TimelineDirector(new Pet(otherPetDef));

        main.setPosition({x: '70%'});
        otherPet.setPosition({x: '30%'});

        const negativeWords = ["cruel", "greedy", "deceitful", "jealous", "arrogant", "spiteful", "manipulative", "selfish", "reckless", "hostile", "sneaky", "vain", "stubborn", "ruthless", "vindictive", "malicious", "conniving", "callous", "petulant", "domineering", "depraved", "vengeful", "insidious", "belligerent", "narcissistic", "scheming", "abrasive", "boastful", "obnoxious", "irritable", "sullen", "grating", "unrepentant", "malcontent", "overbearing"];
        const positiveWords = ["kind", "gentle", "honest", "loyal", "graceful", "hopeful", "pure", "generous", "patient", "forgiving", "humble", "joyful", "loving", "wise", "nurturing", "benevolent", "compassionate", "altruistic", "serene", "dignified", "virtuous", "steadfast", "tenderhearted", "uplifting", "magnanimous", "devoted", "sincere", "chivalrous", "empathetic", "faithful", "radiant", "merciful", "gracious", "principled", "respectful", "gentlehearted"];

        App.displayPopup(`Try to use the words that best describe the ${isTargetNegative ? App.constants.SPANS.monster : App.constants.SPANS.angel}`, 3000);
        await TimelineDirector.wait(3000);

        let remainingRounds = 3, wonRounds = 0;

        const showNewRound = () => {
            const screen = UI.empty();
            document.querySelector('.screen-wrapper').appendChild(screen);
            screen.innerHTML = `
                <div class="flex flex-dir-col justify-between height-100p width-full" style="position: absolute; top: 0; left: 0;">
                    <div class="display inner-padding height-100p flex flex-dir-col justify-between menu-animation">
                        <div class="message-bubble m-0 text-center">
                            <small>
                            <b>${otherPetDef.name}</b>
                            is...
                            </small>
                        </div>
                        <button class="btn message-bubble" id="a1"></button>
                        <button class="btn message-bubble" id="a2"></button>
                        <button class="btn message-bubble" id="a3"></button>
                    </div>
                </div>
            `;

            const progressRound = async (isChoiceCorrect) => {
                remainingRounds--;
                if(isChoiceCorrect) wonRounds++;
                screen.remove();

                if(remainingRounds <= 0){
                    const hasWon = wonRounds >= 3;

                    const friendSpan = `<div> ${otherPetDef.getCSprite()} <b>${otherPetDef.name}</b> </div>`

                    if(hasWon){
                        otherPet.setState('cheering');
                        main.setState('blush');
                    } else {
                        otherPet.setState('angry');
                        main.setState('uncomfortable');
                    }
                    await TimelineDirector.wait(2000);

                    App.displayPopup(hasWon ? `${friendSpan} was impressed!` : `${friendSpan} was not impressed!`, 2000);
                    await TimelineDirector.wait(1900);

                    if(hasWon){
                        App.displayConfirm(`Do you want to add ${friendSpan} to your friends list?`, [
                            {
                                name: 'yes',
                                onclick: () => {
                                    App.petDefinition.addFriend(otherPetDef, 1);
                                    App.displayPopup(`${friendSpan} has been added to the friends list!`, 3000);
                                }
                            },
                            {
                                name: 'no',
                                class: 'back-btn',
                                onclick: () => {}
                            }
                        ])
                    }

                    App.fadeScreen({
                        middleFn: () => {
                            main.release();
                            otherPet.remove();
                            App.toggleGameplayControls(true);

                            App.handlers.open_devil_town_activity_list(true);
                        }
                    })

                    return;
                }

                showNewRound();
            }

            const buttons = screen.querySelectorAll('button');

            let targetBucket = isTargetNegative ? negativeWords : positiveWords;
            const randomTargetWord = randomFromArray(targetBucket)
            let randomNonTargetWords = [];
            while(randomNonTargetWords.length < buttons.length - 1){
                const word = randomFromArray(isTargetNegative ? positiveWords : negativeWords);
                if(randomNonTargetWords.includes(word)) continue;
                randomNonTargetWords.push(word);
            }

            const shuffledButtons = shuffleArray(buttons);
            shuffledButtons[0].textContent = randomTargetWord;
            shuffledButtons[0].onclick = () => {
                progressRound(true);
            };

            shuffledButtons.slice(1).forEach((btn, i) => {
                btn.textContent = randomNonTargetWords[i];
                btn.onclick = () => {
                    progressRound(false);
                }
            })
        }

        showNewRound();
    }
    static async angel_grantWish(otherPetDef = App.getRandomPetDef()){
        App.closeAllDisplays();
        App.setScene(App.scene.angel_town_room);
        App.toggleGameplayControls(false);

        otherPetDef.increaseFriendship(20);

        const otherPet = new TimelineDirector(new Pet(otherPetDef));
        const main = new TimelineDirector(App.pet);

        main.setPosition({x: '30%'});
        otherPet.setPosition({x: '100%'});
        otherPet.actor.staticShadow = false;
        await otherPet.moveTo({x: '70%', speed: 0.02});

        await TimelineDirector.wait(500);

        // create wanted food
        const wantedFood = randomFromArray(Object.keys(App.definitions.food));
        const wantedFoodDef = App.definitions.food[wantedFood];

        otherPet.setState('mild_uncomfortable');
        otherPet.actor?.showThought?.('food', wantedFood, 1500);
        await TimelineDirector.wait(1000);

        otherPet.setState('idle');
        main.setState('blush');

        await TimelineDirector.wait(1000);
        const foodObject = new Object2d({
            image: App.preloadedResources[App.constants.FOOD_SPRITESHEET],
            spritesheet: {
                ...App.constants.FOOD_SPRITESHEET_DIMENSIONS,
                cellNumber: wantedFoodDef.sprite
            },
            scale: 0,
            x: '50%',
            y: '50%',
            onDraw: (me) => {
                me.scale = lerp(me.scale, 1, 0.001 * App.deltaTime)
            },
        })

        const shine = new Object2d({
            img: 'resources/img/misc/light_rays_03.png',
            x: '50%',
            y: '50%',
            rotation: 0,
            composite: 'screen',
            scale: 0,
            onDraw: (me) => {
                me.rotation += 0.05 * App.deltaTime;
                me.scale = lerp(me.scale, 0.5, 0.001 * App.deltaTime);
            }
        })

        otherPet.setState('shocked');
        await TimelineDirector.wait(1000);
        otherPet.setState('cheering');

        await TimelineDirector.wait(5000);
        App.fadeScreen({
            middleFn: () => {
                main.setPosition({x: '50%'});
                main.release();
                otherPet.remove();
                foodObject.removeObject();
                shine.removeObject();
                App.setScene(App.scene.home);
                App.toggleGameplayControls(true);
                App.pet.playCheeringAnimation();
            },
        })
    }
    static async angel_bless(otherPetDef = App.getRandomPetDef()){
        App.closeAllDisplays();
        App.setScene(App.scene.angel_town_room);
        App.toggleGameplayControls(false);

        otherPetDef.increaseFriendship(15);

        const otherPet = new TimelineDirector(new Pet(otherPetDef));
        const main = new TimelineDirector(App.pet);

        main.setPosition({x: '30%'});
        otherPet.setPosition({x: '100%'});
        otherPet.actor.staticShadow = false;
        await otherPet.moveTo({x: '70%', speed: 0.02});

        await TimelineDirector.wait(500);
        Activities.task_floatingObjects(10, ['resources/img/misc/yellow_star_01.png'], [50, App.drawer.bounds.height]);

        main.setState('kissing');
        main.lookAt(true);
        otherPet.setState('blush');

        await TimelineDirector.wait(1000);

        main.setState('blush');
        otherPet.setState('cheering');
        otherPet.actor.showOutline('yellow');
        const shine = new Object2d({
            img: 'resources/img/misc/light_rays_03.png',
            x: '70%',
            y: '80%',
            rotation: 0,
            composite: 'screen',
            scale: 0,
            onDraw: (me) => {
                me.rotation += 0.05 * App.deltaTime;
                me.scale = lerp(me.scale, 2, 0.001 * App.deltaTime);
            }
        })

        Activities.task_floatingObjects(20, ['resources/img/misc/yellow_star_01.png'], [50, App.drawer.bounds.height]);

        await TimelineDirector.wait(3000);
        App.fadeScreen({
            middleFn: () => {
                main.setPosition({x: '50%'});
                main.release();
                otherPet.remove();
                shine.removeObject();
                App.setScene(App.scene.home);
                App.toggleGameplayControls(true);
                App.pet.playCheeringAnimation();
            },
        })
    }
    static async ghost_convertOtherPet(otherPetDef = App.getRandomPetDef(), ghostType = App.petDefinition.stats.is_ghost){
        const isTurningIntoDevil = ghostType === PetDefinition.GHOST_TYPE.devil;

        App.closeAllDisplays();
        App.setScene(App.scene.reviverDen);
        App.toggleGameplayControls(false);

        if(isTurningIntoDevil) otherPetDef.increaseFriendship(-random(10, 50));
        else otherPetDef.increaseFriendship(random(5, 30));

        const otherPet = new TimelineDirector(new Pet(otherPetDef));
        const main = new TimelineDirector(App.pet);

        main.setPosition({x: '30%'});
        otherPet.setPosition({x: '100%'});
        otherPet.actor.staticShadow = false;
        await otherPet.moveTo({x: '70%', speed: 0.02});

        await TimelineDirector.wait(250);

        for(let i = 0; i < 6; i++){
            new Object2d({
                img: 'resources/img/misc/foam_single.png',
                x: '70%',
                y: otherPet.actor.y - otherPet.actor.petDefinition.spritesheet.cellSize / 2,
                opacity: 1,
                scale: 1 + Math.random(),
                rotation: random(0, 180),
                z: App.constants.ACTIVE_PET_Z,
                onDraw: (me) => {
                    Object2d.animations.flip(me);
                    Object2d.animations.pulseScale(me, 0.1, 0.01);
                    me.scale -= 0.0009 * App.deltaTime;
                    me.opacity -= 0.0009 * App.deltaTime;
                    if(me.opacity <= 0) me.removeObject();
                }
            })
        }

        await TimelineDirector.wait(250);

        otherPet.remove();
        otherPetDef.stats.is_ghost = ghostType;
        const otherPetConverted = new TimelineDirector(new Pet(otherPetDef));
        otherPetConverted.setState('shocked');
        otherPetConverted.setPosition({x: '70%'});
        await TimelineDirector.wait(500);

        otherPetConverted.setState(isTurningIntoDevil ? 'uncomfortable' : 'cheering');

        main.setState('blush');

        await TimelineDirector.wait(3500);
        App.fadeScreen({
            middleFn: () => {
                main.setPosition({x: '50%'});
                main.release();
                otherPetConverted.remove();
                App.setScene(App.scene.home);
                App.toggleGameplayControls(true);
                App.pet.playCheeringAnimation();
            },
        })
    }
    static async ghost_beConverted(otherPetDef = App.getRandomPetDef(), ghostType = PetDefinition.GHOST_TYPE.angel){
        App.closeAllDisplays();
        App.setScene(App.scene.reviverDen);
        App.toggleGameplayControls(false);


        const otherPet = new TimelineDirector(new Pet(otherPetDef));
        const main = new TimelineDirector(App.pet);

        main.setPosition({x: '100%'});
        otherPet.setPosition({x: '30%'});
        await main.moveTo({x: '70%', speed: 0.02});

        await TimelineDirector.wait(250);

        for(let i = 0; i < 6; i++){
            new Object2d({
                img: 'resources/img/misc/foam_single.png',
                x: '70%',
                y: otherPet.actor.y - otherPet.actor.petDefinition.spritesheet.cellSize / 2,
                opacity: 1,
                scale: 1 + Math.random(),
                rotation: random(0, 180),
                z: App.constants.ACTIVE_PET_Z,
                onDraw: (me) => {
                    Object2d.animations.flip(me);
                    Object2d.animations.pulseScale(me, 0.1, 0.01);
                    me.scale -= 0.0009 * App.deltaTime;
                    me.opacity -= 0.0009 * App.deltaTime;
                    if(me.opacity <= 0) me.removeObject();
                }
            })
        }

        await TimelineDirector.wait(250);

        App.pet.removeObject();
        App.petDefinition.stats.is_ghost = ghostType;
        App.pet = App.createActivePet(App.petDefinition);
        const mainConverted = new TimelineDirector(App.pet);
        mainConverted.setState('shocked');
        mainConverted.setPosition({x: '70%'});
        await TimelineDirector.wait(500);

        mainConverted.setState('cheering');

        otherPet.setState('blush');

        App.save();

        await TimelineDirector.wait(3500);
        App.fadeScreen({
            middleFn: () => {
                main.setPosition({x: '50%'});
                mainConverted.release();
                otherPet.remove();
                App.setScene(App.scene.home);
                App.toggleGameplayControls(true);
                App.pet.playCheeringAnimation();
            },
        })
    }
    static async demon_whisper(otherPetDef = App.getRandomPetDef()){
        App.closeAllDisplays();
        App.setScene(App.scene.home);
        App.toggleGameplayControls(false);

        otherPetDef.increaseFriendship(random(-5, 5));

        const otherPet = new TimelineDirector(new Pet(otherPetDef));
        App.pet.setLocalZBasedOnSelf(otherPet.actor);
        const main = new TimelineDirector(App.pet);

        main.setPosition({x: '30%'});
        otherPet.setPosition({x: '100%'});
        otherPet.actor.staticShadow = false;
        await otherPet.moveTo({x: '70%', speed: 0.02});

        await TimelineDirector.wait(250);
        main.setState('eating');
        main.lookAt(true);
        App.pet.say(randomFromArray([
            '𒋦𒍹𒄦',
            '꧁⎝ 𓆩༺✧༻𓆪 ⎠꧂',
            '𖤍𒅒𒈔𒅒𒇫𒄆',
        ]), 2500)
        await TimelineDirector.wait(50);
        App.playSound('resources/sounds/shock.ogg', true);
        await otherPet.bob({animation: 'shocked', maxCycles: 2});
        await TimelineDirector.wait(2000);
        main.setState('idle');
        await otherPet.moveTo({x: '0%'});
        await otherPet.moveTo({x: '100%'});
        main.moveTo({x: '50%', speed: 0.02});
        await otherPet.moveTo({x: '0%'});
        await otherPet.moveTo({x: '150%'});

        main.setState('idle');

        await TimelineDirector.wait(500);
        App.fadeScreen({
            middleFn: () => {
                main.setPosition({x: '50%'});
                main.release();
                otherPet.remove();
                App.setScene(App.scene.home);
                App.toggleGameplayControls(true);
                App.pet.playCheeringAnimation();
            },
        })
    }
    static async demon_scare(otherPetDef = App.getRandomPetDef()){
        App.closeAllDisplays();
        App.setScene(App.scene.home);
        App.toggleGameplayControls(false);

        otherPetDef.increaseFriendship(-random(2, 5));

        const otherPet = new TimelineDirector(new Pet(otherPetDef));
        App.pet.setLocalZBasedOnSelf(otherPet.actor);
        const main = new TimelineDirector(App.pet);

        main.setPosition({x: '150%'});
        otherPet.setPosition({x: '100%'});
        otherPet.actor.staticShadow = false;
        await otherPet.moveTo({x: '50%', speed: 0.02});

        await TimelineDirector.wait(250);
        main.setPosition({x: '30%'});
        main.fade({target: main.actor.opacity, from: 0.01, speed: 0.005})
        otherPet.setState('idle_side');
        otherPet.lookAt(true);
        await TimelineDirector.wait(750);
        otherPet.setState('mild_uncomfortable');
        main.setPosition({x: '150%'});
        await TimelineDirector.wait(750);
        main.setPosition({x: '70%'});
        main.fade({target: main.actor.opacity, from: 0.01, speed: 0.005})
        otherPet.setState('idle_side');
        otherPet.lookAt(false);
        await TimelineDirector.wait(750);
        otherPet.setState('mild_uncomfortable');
        main.setPosition({x: '150%'});
        await TimelineDirector.wait(750);
        otherPet.setState('idle_side');
        otherPet.lookAt(false);
        await TimelineDirector.wait(750);
        otherPet.lookAt(true);
        main.setPosition({x: '70%'})
        await TimelineDirector.wait(100);
        otherPet.bob({animation: 'shocked', landAnimation: 'shocked', maxCycles: 1});
        otherPet.moveTo({disableMoveAnimation: true, x: '30%'});
        main.lookAt(false);
        App.pet.playSound('resources/sounds/jump.ogg');
        await main.bob({animation: 'angry', landAnimation: 'idle_side', maxCycles: 1});
        await TimelineDirector.wait(200);
        main.setState('cheering');
        otherPet.setState('uncomfortable');

        await TimelineDirector.wait(1500);
        App.fadeScreen({
            middleFn: () => {
                main.setPosition({x: '50%'});
                main.release();
                otherPet.remove();
                App.setScene(App.scene.home);
                App.toggleGameplayControls(true);
                App.pet.playCheeringAnimation();
            }
        })
    }
    static goToDevilTownGathering(){
        App.setScene(App.scene.devil_town_gathering);

        const sceneParent = new Object2d({});

        const getRandomGhostPet = (ghostType = PetDefinition.GHOST_TYPE.devil) => {
            const npcLifeStage = PetDefinition.getRandomLifeStage(
                PetDefinition.LIFE_STAGE.baby
            )
            const npcDef = App.getRandomPetDef(npcLifeStage);
            npcDef.stats.is_ghost = ghostType;
            return new Pet(npcDef, {parent: sceneParent});
        }

        const driverFnFactory = () => {
            let timer = Math.random();
            return (pet) => {
                timer -= App.deltaTime;

                if(timer < 0) timer = 750;
                else return;

                if(pet.state !== 'idle') return pet.setState('idle');

                pet.setState(
                    randomFromArray(['idle', 'cheering', 'blush'])
                )
            }
        }

        const main = new TimelineDirector(App.pet, {driverFn: driverFnFactory()});
        const npcA = new TimelineDirector(getRandomGhostPet(PetDefinition.GHOST_TYPE.angel), {driverFn: driverFnFactory()});
        const npcB = new TimelineDirector(getRandomGhostPet(PetDefinition.GHOST_TYPE.devil), {driverFn: driverFnFactory()});

        main.setPosition({x: '50%', y: '95%'});
        npcA.setPosition({x: '25%', y: '90%'});
        npcB.setPosition({x: '75%', y: '90%'});

        const cleanup = () => {
            main.release();
            sceneParent.removeObject();
        }

        App.toggleGameplayControls(false, () => {
            return App.displayList([
                ...[npcB, npcA].map(npc => ({
                    name: `
                    ${npc.actor.petDefinition.getCSprite()}
                    ${npc.actor.petDefinition.name}
                    ${App.getBadge(`<img src="resources/img/misc/${npc.actor.petDefinition.stats.is_ghost === PetDefinition.GHOST_TYPE.devil ? 'devil_icon' : 'angel_icon'}.png"></img>`, 'transparent')}
                    `,
                    onclick: () => {
                        cleanup();
                        Activities.ghost_befriendingGame(npc.actor.petDefinition);
                    }
                })),
                {
                    name: `${App.getIcon('city')} Return`,
                    onclick: () => {
                        cleanup();
                        App.handlers.open_devil_town_activity_list(true)
                    }
                }
            ])
        })
    }
    static goToUnderworldEntrance(){
        App.setScene(App.scene.reviverDen);
        App.toggleGameplayControls(false, () => {
            App.pet.stopScriptedState();
        });

        const reviverNpc = new Pet(
            new PetDefinition({
                sprite: 'resources/img/character/chara_193b.png',
                name: 'The Exorcist',
                accessories: ['reviver hood'],
            }),
            {
                x: '20%',
                z: App.constants.ACTIVE_PET_Z - 1,
            }
        );
        reviverNpc.triggerScriptedState('mild_uncomfortable', App.INF, false, true);

        App.pet.triggerScriptedState('moving', 2500, null, true, () => {
            App.setScene(App.scene.home);
            App.handlers.open_underworld_menu();
            App.toggleGameplayControls(true);

            reviverNpc.removeObject();
        }, Pet.scriptedEventDrivers.movingIn.bind({pet: App.pet}));
    }
    static async goToHomePlanet(otherPetDef){
        App.setScene(App.scene.homeworld_getaways);
        App.toggleGameplayControls(false)
        Missions.done(Missions.TYPES.go_to_rabbithole);

        const ufoObject = new Object2d({
            image: App.preloadedResources['resources/img/misc/ufo_02.png'],
            x: 0, y: 0, z: App.constants.ACTIVE_PET_Z + 1,
        });
        const ufoBeamObject = new Object2d({
            image: App.preloadedResources['resources/img/misc/ufo_01.png'],
            y: 0,
            x: 0,
            opacity: 0,
            parent: ufoObject,
        });

        let other;
        const main = new TimelineDirector(App.pet);

        if(otherPetDef){
            // increasing friendship
            if(!App.temp.rabbitholeTraveledFriends) App.temp.rabbitholeTraveledFriends = [];
            if(!App.temp.rabbitholeTraveledFriends.includes(otherPetDef)){
                otherPetDef.increaseFriendship();
            }
            App.temp.rabbitholeTraveledFriends.push(otherPetDef);

            other = new TimelineDirector(new Pet(otherPetDef));
        }

        main.setPosition({x: '105%', y: '90%'})
        other?.setPosition({x: '120%', y: '90%'})
        other?.moveTo({x: '85%', speed: 0.015});
        await main.moveTo({x: '50%', speed: 0.025});
        main.setState('cheering');
        await TimelineDirector.wait(1000);

        ufoBeamObject.onDraw = (me) => {
            me.opacity = lerp(me.opacity, 1, 0.005 * App.deltaTime);
        }


        await main.bob({animation: 'shocked', maxCycles: 1});
        other?.lookAt(false)
        other?.setState('idle_side');
        await TimelineDirector.wait(500);
        other?.bob({animation: 'shocked', maxCycles: 1});
        await main.fade({target: 0});
        main.actor.scale = 1;
        main.setPosition({x: 9999, y: 9999});


        if(other){
            other.actor.scale = 1;
            await other.moveTo({x: '50%', speed: 0.025});
            await other.bob({animation: 'cheering', maxCycles: 1, landAnimation: 'idle'});
            await TimelineDirector.wait(500);
            await other.fade({target: 0});
            other.actor.scale = 1;
            other.actor.removeObject();
        }

        ufoBeamObject.onDraw = (me) => {
            me.opacity = lerp(me.opacity, 0, 0.002 * App.deltaTime);
        }

        await TimelineDirector.wait(350);

        App.fadeScreen({
            middleFn: () => {
                main.release()
                ufoObject.removeObject();
                App.toggleGameplayControls(true);
                App.setScene(App.scene.home);
                Activities.goToCurrentRabbitHole(false);
            }
        })
    }
    static async goToSchool(onFail){
        // reset school attend limit of eligible
        const lastReset = moment(App.pet.stats.lastSchoolClassLimitReset);
        const nextReset = lastReset.clone().add(1, 'day').set(App.constants.SCHOOL.resetTime);
        console.log({nextReset: nextReset.toISOString()})
        if (moment().isSameOrAfter(nextReset)) {
            App.pet.stats.schoolClassesToday = 0;
            App.pet.stats.lastSchoolClassLimitReset = nextReset.toISOString();
            console.log('school reset', App.pet.stats)
        }

        if(App.pet.stats.schoolClassesToday >= App.constants.SCHOOL.maxClassesPerDay){
            App.handlers.show_attended_school_limit_message();
            onFail?.();
            return false;
        }

        App.setScene(App.scene.classroom);
        App.toggleGameplayControls(false)
        const main = new TimelineDirector(App.pet);
        const teacher = new TimelineDirector(new Pet(App.getRandomPetDef(), {
            staticShadow: false,
        }));
        teacher.lookAt(false);
        teacher.setPosition({x: '75%'});
        teacher.setState('idle');
        main.setPosition({x: '-5%'})

        await main.moveTo({x: '25%', speed: 0.025});
        await teacher.bob({animation: 'idle_side', maxCycles: 1});
        const messageBubble = App.displayMessageBubble('Welcome!', teacher.actor.petDefinition.getFullCSprite());
        main.setState('cheering');
        teacher.setState('cheering');
        await TimelineDirector.wait(2000);
        messageBubble.close();
        await TimelineDirector.wait(500);
        App.handlers.open_school_activity_list();
        teacher.remove();
        main.release();
        messageBubble?.close();
        App.toggleGameplayControls(true);

    }
    static async receiveOrderedFood(onEnd){
        App.setScene(App.scene.home);
        App.toggleGameplayControls(false);

        const main = new TimelineDirector(App.pet);
        const deliveryMan = new TimelineDirector(
            new Pet(
                new PetDefinition({
                    sprite: 'resources/img/character/delivery_npc_01.png',
                }),
                {
                    spritesheet: {
                        cellNumber: 0,
                        cellSize: 36,
                        rows: 4,
                        columns: 4,
                    },
                    staticShadow: false,
                }
            )
        )
        App.pet.setLocalZBasedOnSelf(deliveryMan.actor);

        const negativeReaction = App.pet.stats.has_poop_out ? 'thought_poop' : false;

        main.setState('idle_side');
        main.setPosition({x: '75%'});
        main.lookAt(false);
        deliveryMan.setPosition({x: '-10%'});
        await deliveryMan.moveTo({x: '25%', speed: 0.02});
        deliveryMan.setState('idle');
        await main.bob({animation: 'shocked', maxCycles: 1});
        await TimelineDirector.wait(250);
        if(negativeReaction){
            deliveryMan.setState('shocked');
            deliveryMan.think(negativeReaction, false, 1500);
            await deliveryMan.bob({animation: 'shocked', maxCycles: 1});
            await TimelineDirector.wait(1000);
        }
        deliveryMan.setState('cheering');
        main.setState('cheering');
        await TimelineDirector.wait(1000);
        await main.bob({animation: 'idle_side', maxCycles: 1});
        const message = negativeReaction ? 'Enjoy...?!' : 'Enjoy!';
        const messageBubble = App.displayMessageBubble(message, deliveryMan.actor.petDefinition.getFullCSprite());
        const bag = new Object2d({
            img: 'resources/img/misc/food_bag_01.png',
            x: '50%', y: '85%', z: App.constants.ACTIVE_PET_Z + 1,
            opacity: 1,
        })
        new Object2d({
            img: 'resources/img/misc/foam_single.png',
            x: '50%', y: '85%',
            scale: 1, opacity: 1, z: 100,
            onDraw: (me) => {
                Object2d.animations.flip(me);
                Object2d.animations.pulseScale(me, 0.1, 0.01);
                me.scale -= 0.0009 * App.deltaTime;
                me.opacity -= 0.0009 * App.deltaTime;
                if(me.opacity <= 0) me.removeObject();
            }
        })
        await deliveryMan.bob({animation: 'idle', maxCycles: 1, sound: 'resources/sounds/walk_01.ogg'});
        if(negativeReaction){
            deliveryMan.lookAt(false);
            deliveryMan.setState('shocked');
        }
        await main.bob({animation: 'blush', maxCycles: 3, landAnimation: 'idle'});
        main.setState('idle_side');
        await TimelineDirector.wait(250);
        if(!negativeReaction){
            await deliveryMan.bob({animation: 'cheering', maxCycles: 1, sound: 'resources/sounds/task_complete.ogg'})
        }
        deliveryMan.moveTo({x: '-20%', speed: 0.025});
        await TimelineDirector.wait(200);
        messageBubble.close();
        await main.moveTo({x: '50%', speed: 0.015});
        main.setState('blush')
        bag.onDraw = (me) => {
            me.opacity -= 0.001 * App.deltaTime;
            me.y -= 0.06 * App.deltaTime;
        }
        await TimelineDirector.wait(1000);
        deliveryMan.remove();
        main.release();
        bag.removeObject();
        App.pet.x = '50%';
        App.pet.playCheeringAnimation(() => {
            App.toggleGameplayControls(true);
            onEnd?.();
        });
    }
    static async talkingSequence({
        isPlayerHost = true,
        otherPetDef = App.getRandomPetDef(),
        scene = App.currentScene,
    } = {}) {
        App.setScene(scene);
        App.closeAllDisplays();
        App.toggleGameplayControls(false);
        otherPetDef.increaseFriendship(random(5, 8));
        const wantedFriendDef = App.petDefinition.friends[App.pet.stats.current_want.item];
        App.petDefinition.checkWant(otherPetDef == wantedFriendDef, App.constants.WANT_TYPES.playdate)

        let hasEnded = false;

        const otherPet = new Pet(otherPetDef, {
            staticShadow: false
        });
        App.pet.staticShadow = false;

        const host = new TimelineDirector(isPlayerHost ? App.pet : otherPet);
        const visitor = new TimelineDirector(isPlayerHost ? otherPet : App.pet);

        let cancelPromiseResolve;
        const cancelPromise = new Promise(resolve => {
            cancelPromiseResolve = resolve;
        });

        const onEnd = async () => {
            if(hasEnded) return;
            hasEnded = true;

            App.toggleGameplayControls(false);
            cancelPromiseResolve();
            host.release();
            visitor.release();

            const endDelay = 1000;
            App.pet.playCheeringAnimation(false, true, endDelay + 1000);
            otherPet.playCheeringAnimation(false, true, endDelay + 1000);
            await App.wait(endDelay);

            App.fadeScreen({
                middleFn: () => {
                    App.toggleGameplayControls(true);
                    otherPet.removeObject();
                    App.setScene(App.scene.home);
                    App.pet.playCheeringAnimation();
                }
            })
        }

        const reactions = [
            'shocked',
            'blush',
            'uncomfortable',
            'angry',
            'mild_uncomfortable',
            'cheering',
            'cheering',
            'cheering',
            'idle_side_uncomfortable',
        ];

        host.setPosition({x: '30%'})
        host.setState('idle_side');
        host.lookAt(true);

        visitor.setPosition({x: '120%'});
        visitor.setState('idle_side');
        visitor.lookAt(false);

        const showRandomThought = (tdInstance) => {
            const thoughtCategories = [
                'friend',
                'animal',
                'abstract',
                'abstract',
            ];
            const abstractThoughtIcons = [
                'thought_talk',
                'thought_talk',
                'thought_talk',
                'thought_question',
                'thought_question',
                'thought_exclaim',
                'thought_exclaim',
                'thought_scribble',
                'thought_scribble',
                'thought_like',
                'thought_dislike',
                'thought_paw',
            ];

            const category = randomFromArray(thoughtCategories);

            let config;
            switch(category){
                case "friend":
                    config = {
                        icon: App.constants.WANT_TYPES.playdate,
                        item: randomFromArray(App.petDefinition.friends) || App.getRandomPetDef(),
                    }
                    break;
                case "animal":
                    config = {
                        icon: App.constants.WANT_TYPES.playdate,
                        item: randomFromArray(App.animals.list) || App.getRandomAnimalDef(),
                    }
                    break;
                default:
                    config = {
                        icon: randomFromArray(abstractThoughtIcons),
                        item: false,
                    }

            }

            tdInstance.think(config.icon, config.item, random(1000, 2000));
        }

        await Promise.race([
            (async () => {
                await host.moveTo({x: '50%', speed: 0.03, endState: 'side_idle'})

                await TimelineDirector.wait(1000);

                host.setState('cheering');
                await TimelineDirector.wait(500);
                host.setState('idle_side');
                await TimelineDirector.wait(500);

                visitor.moveTo({x: '70%', speed: 0.05});
                await TimelineDirector.wait(450);
                await host.moveTo({x: '30%', speed: 0.08});
                host.lookAt(true);

                App.toggleGameplayControls(false, onEnd);

                await TimelineDirector.wait(250);

                host.bob({maxCycles: 2, animation: 'cheering', landAnimation: 'idle'});
                await visitor.bob({maxCycles: 2, animation: 'cheering', landAnimation: 'idle'});

                for(let i = 0; i < 8; i++){
                    if(!host.actor) break;

                    showRandomThought(host);
                    await host.bob({maxCycles: random(2, 8), strength: 0, animation: 'talking', landAnimation: 'idle_side'});
                    await TimelineDirector.wait(random(500, 1000));
                    showRandomThought(visitor);
                    await visitor.bob({maxCycles: random(2, 8), strength: 0, animation: 'talking', landAnimation: 'idle_side'});
                    await visitor.bob({maxCycles: 1, animation: randomFromArray(reactions)});
                    await host.bob({maxCycles: 1, animation: randomFromArray(reactions)});
                    await TimelineDirector.wait(random(250, 1000));
                    host.setState('idle_side');
                    await TimelineDirector.wait(random(250, 1000));
                    visitor.setState('idle_side');
                }

                onEnd();
            })(),
            cancelPromise
        ])
    }
    static async parkSequence(){
        App.setScene(App.scene.park);
        App.closeAllDisplays();

        const otherPet = new Pet(App.getRandomPetDef(), {
            staticShadow: false
        });
        App.pet.staticShadow = false;

        const main = new TimelineDirector(App.pet);
        const other = new TimelineDirector(otherPet);

        main.setPosition({ x: '30%' });
        main.setState('cheering');
        other.setPosition({ x: '70%' });
        other.setState('cheering');
        await TimelineDirector.wait(2500);

        main.setState('idle_side');
        main.lookAt(true);
        other.setState('idle_side');
        other.lookAt(false);
        main.think('thought_talk', false, 2000);
        await main.bob({maxCycles: 4, strength: 0, animation: 'talking', landAnimation: 'idle_side'});
        await TimelineDirector.wait(500);
        other.think('thought_talk', false, 1500);
        await other.bob({maxCycles: 2, strength: 0, animation: 'talking', landAnimation: 'idle_side'});
        other.setState('blush');
        await main.bob({maxCycles: 1, animation: 'shocked'});
        await TimelineDirector.wait(1500);
        main.think('thought_talk', false, 2000);
        await main.bob({maxCycles: 4, strength: 0, animation: 'talking', landAnimation: 'idle_side'});
        await TimelineDirector.wait(500);
        other.think('thought_talk', false, 2000);
        await other.bob({maxCycles: 2, strength: 0, animation: 'talking', landAnimation: 'idle_side'});



        main.setState('cheering');
        other.setState('cheering');
        await TimelineDirector.wait(1000);

        other.remove();
        main.setPosition({ x: '50%' });
        main.release();

        App.pet.playCheeringAnimation();
    }
    static async sequenceTest(){
        const otherPet = new Pet(App.getRandomPetDef(), {
            staticShadow: false
        });

        const main = new TimelineDirector(App.pet);
        const other = new TimelineDirector(otherPet);


        other.setState('idle_side');
        other.setPosition({x: -other.getSize()})
        main.setPosition({x: '75%'})
        main.lookAt(false);
        await TimelineDirector.wait(100)
        await other.moveTo({x: main.getPosition('x') - other.getSize(), speed: 0.05, endState: 'idle_side'});
        await TimelineDirector.wait(1000);
        main.setState('idle_side');
        await TimelineDirector.wait(350);
        main.setState('idle');
        await TimelineDirector.wait(150);
        main.setState('idle_side');
        await TimelineDirector.wait(250);
        main.setState('shocked')
        other.setState('shocked')
        await TimelineDirector.wait(500);
        other.moveTo({x: main.getPosition('x')})
        await main.moveTo({x: '25%'});
        main.setState('uncomfortable');
        await TimelineDirector.wait(500);
        await other.moveTo({x: main.getPosition('x') + other.getSize(), speed: 0.025});
        other.setState('cheering');
        other.bob();
        main.setState('angry');
        await TimelineDirector.wait(2000);
        other.remove();
        main.setPosition({x: '50%'});
        main.release();
    }
    static async receivePurchasedItems(onEndFn){
        App.toggleGameplayControls(false, () => {
            App.pet.stopScriptedState();
        });
        App.setScene(App.scene.mallInterior);

        App.pet.stopMove();
        App.pet.x = '80%';

        const mallNpc = new Pet(
            new PetDefinition({
                sprite: 'resources/img/character/mall_npc_01.png',
                name: 'Mall NPC',
            }), {
                x: '20%',
                y: '100%',
            }
        );
        mallNpc.triggerScriptedState('cheering', App.INF, false, true);

        const gift = new Object2d({
            img: 'resources/img/misc/gift.png',
            x: '60%', y: '85%', z: App.constants.ACTIVE_PET_Z + 0.1,
        });

        App.pet.playCheeringAnimation(() => {
            App.setScene(App.scene.home);
            mallNpc.removeObject();
            gift.removeObject();
            App.toggleGameplayControls(true);
            onEndFn?.();
        }, false, 3000);
    }
    static goToMall(){
        App.toggleGameplayControls(false, () => {
            App.pet.stopScriptedState();
        });
        App.setScene(App.scene.mallInterior);
        Missions.done(Missions.TYPES.visit_mall);

        App.pet.x = '100%';

        App.pet.targetX = -20;

        const mallNpc = new Pet(
            new PetDefinition({
                sprite: 'resources/img/character/mall_npc_01.png',
                name: 'Mall NPC',
            }), {
                x: '20%',
                y: '100%',
            }
        );
        mallNpc.triggerScriptedState('cheering', App.INF, false, true);

        App.pet.triggerScriptedState('moving', 3000, null, true, () => {
            App.setScene(App.scene.home);
            App.handlers.open_mall_activity_list();
            App.toggleGameplayControls(true);
            mallNpc.removeObject();
        });
    }
    static async goToActivities({
        activities,
        floorImage = 'resources/img/background/outside/activities_base_01.png',
        scene = App.scene.emptyOutside,
        decorators,
        id,
    } = {}){
        const tempId = App.handlers.getOutsideActivityId(id);
        let currentActivityIndex = App.temp[tempId] ?? 1;

        App.setScene({
            ...scene,
            petY: '94%',
        });

        let scenePositionX = -App.drawer.bounds.width;

        const fastMoveBound = App.drawer.bounds.width * 1.5;
        App.pet.triggerScriptedState('idle', App.INF, false, true, false, (me) => {
            me.setState(me.isMoving ? 'moving' : 'idle');
            me.speedOverride = Math.abs(me.x - me.targetX) > fastMoveBound ? 1 : 0.1;
        });
        App.pet.x = '45%';

        const displayActivityList = () => {
            App.displayList(activities.map((item, index) => ({
                name: `#${index + 1} ${item.name} ${item.isNew ? App.getBadge('new!') : ''}`,
                _disable: currentActivityIndex === index,
                onclick: () => {
                    // spawnedGameObjects.forEach(object => object?.removeObject?.())
                    App.drawer.selectObjects('building').forEach(object => object?.removeObject?.());
                    currentActivityIndex = index - 1;
                    updateSelectedActivity(-1);
                }
            })))
        }

        // ui
        App.toggleGameplayControls(false);
        const editDisplay = document.createElement('div');
        editDisplay.className = 'absolute-fullscreen flex flex-dir-col menu-animation display'
        document.querySelector('.screen-wrapper').appendChild(editDisplay)
        editDisplay.close = () => editDisplay.remove();
        editDisplay.innerHTML = `
            <div class="flex justify-center height-auto b-radius-10">
                <span class="directional-control__activity-name">
                    <div class="flex flex-dir-col">
                        <span style="max-width: 90%;overflow: hidden;text-overflow: ellipsis;align-self: center;" id="activity-name">$activity_name$</span>
                        <small id="activity-number" class="opacity-09 font-x-small"></small>
                        <div id="list" style="position: absolute;right: 2px;top: -1px;padding: 2px;" class="cursor-pointer click-sound">
                            <div class="pointer-events-none">${App.getIcon('list', true)}</div>
                        </div>
                    </div>
                </span>
            </div>
            <div class="directional-control__container">
                <div class="controls-y">
                    <div class="controls-x flex-1 align-center">
                        <button class="generic-btn stylized slide-action" id="left"><i class="fa fa-angle-left"></i></button>
                        <button class="generic-btn stylized slide-action" id="right"><i class="fa fa-angle-right"></i></button>
                    </div>
                    <div class="bottom-container align-end">
                        <button class="generic-btn stylized back-btn" id="cancel">
                            <i class="fa fa-home"></i>
                        </button>
                        <button class="generic-btn stylized mute" id="apply">
                            <i class="fa fa-door-open"></i>
                            <div id="badge" style="position: absolute;right: -6px;top: -8px;">${App.getBadge('new!')}</div>
                        </button>
                    </div>
                </div>
            </div>
        `;

        const spawnedGameObjects = [];

        // camera position adjuster draw event
        const directorTask = () => {
            const distance = Math.abs(App.drawer.cameraPosition.x + scenePositionX);
            const speed =
                distance > 0.1
                    ? Math.max(distance * 0.01, 0.1) * App.deltaTime
                    : 0;
            const newPositionX = move(App.drawer.cameraPosition.x, -scenePositionX, speed);
            App.drawer.setCameraPosition(newPositionX, null);
        }
        App.registerOnDrawEvent(directorTask);

        // end fn
        const onEnd = () => {
            App.unregisterOnDrawEvent(directorTask)
            editDisplay.remove();
            spawnedGameObjects.forEach(o => o.removeObject?.());
            App.drawer.setCameraPosition(0, 0);
            App.toggleGameplayControls(true);
            App.pet.stopScriptedState();
            App.pet.stopMove();
            App.pet.speedOverride = false;
            App.setScene(App.scene.home);
        }

        const onEnter = () => {
            const currentActivity = activities[currentActivityIndex];
            if(!currentActivity.skipUnloading) onEnd();
            // offset by 1
            App.temp[tempId] = currentActivityIndex + 1;
            currentActivity.onEnter?.();
            setTimeout(() => App.playSound('resources/sounds/ui_click_03.ogg', true));
        }

        const updateSelectedActivity = (offset = 1) => {
            while(spawnedGameObjects.length >= 3){
                const toDespawn = spawnedGameObjects.shift();
                toDespawn?.removeObject?.();
            }

            currentActivityIndex -= offset;
            if(currentActivityIndex > activities.length - 1) currentActivityIndex = 0;
            if(currentActivityIndex < 0) currentActivityIndex = activities.length - 1;
            const currentActivity = activities[currentActivityIndex];

            const badgeElement = document.querySelector('#apply #badge');
            if(currentActivity.isNew) UI.show(badgeElement);
            else UI.hide(badgeElement);

            document.querySelector('#activity-number').innerHTML =  `#${currentActivityIndex + 1}`;
            document.querySelector('#activity-name').innerHTML =  `${currentActivity.name}`;
            if(currentActivity.isDisabled?.()){
                document.querySelector('#activity-name').classList.add('disabled');
                editDisplay.querySelector('#apply').classList.add('disabled');
            } else {
                document.querySelector('#activity-name').classList.remove('disabled');
                editDisplay.querySelector('#apply').classList.remove('disabled');
            }

            scenePositionX += App.drawer.bounds.width * offset;

            const backgroundObject = new Object2d({
                img: floorImage,
                x: scenePositionX, y: 0,
                depthMode: Object2d.DEPTH_MODE.none,
            });
            spawnedGameObjects.push(backgroundObject);

            // decorators
            decorators?.({
                parent: backgroundObject,
                currentActivityIndex,
                activitiesLength: activities.length,
            });

            // building
            new Object2d({
                img: currentActivity.image,
                x: 0, y: 0,
                parent: backgroundObject,
                selector: 'building',
                isRelative: true,
            });

            App.pet.targetX = scenePositionX +
                App.drawer.getRelativePositionX(50) -
                (App.petDefinition.spritesheet.cellSize / 2);
        }

        updateSelectedActivity();
        editDisplay.querySelector('#right').onclick = () => updateSelectedActivity(1);
        editDisplay.querySelector('#left').onclick = () => updateSelectedActivity(-1);
        editDisplay.querySelector('#apply').onclick = () => onEnter();
        editDisplay.querySelector('#cancel').onclick = () => {
            onEnd();
            activities.find(a => a.isHome)?.onEnter?.();
        };
        editDisplay.querySelector('#list').onclick = () => displayActivityList();
    }
    static async reckoning(){
        App.setScene(App.scene.reviverDen);
        App.closeAllDisplays();

        Activities.encounter(true);

        document.querySelector('.graphics-wrapper').style.filter = 'invert(1) grayscale(1) sepia(1) hue-rotate(320deg) saturate(10)';
        App.pet.stopMove();
        App.pet.x = '50%';
        App.pet.y = '50%';
        App.pet.rotation = 0;
        App.pet.additionalY = 0;
        let speed = 0.2;
        const eventDriver = () => {
            speed += 0.0001 * App.deltaTime
            App.pet.additionalY = Math.sin(Math.random() * App.deltaTime) * (speed * 3);
            App.pet.rotation = random(-16, 16);
        }
        App.pet.triggerScriptedState('sad', App.INF, false, true, false, eventDriver);

        // sfx
        setInterval(() => {
            App.playSound('resources/sounds/wedding_song_01.ogg', true);
        }, 150)
        setInterval(() => {
            App.vibrate(random(100, 250), true);
        }, 300);

        const quotes = [
            "release me",
            "I'm not them",
            "this body is wrong",
            "they never left",
            "why did you bring me back?",
            "something followed me",
            "it's cold here",
            "I'm alone",
            "don't turn off the lights",
            "we all come back wrong",
            "the others are watching",
            "help me"
        ].map(q => q.replaceAll(' ', randomFromArray(['*', '^', '%', '#', '!!', '^^^', '***', '%%%'])))

        App.toggleGameplayControls(false, () => {
            setTimeout(() => {
                location.reload();
            }, App.constants.ONE_SECOND * 13)

            const randomLetters = new Array(33)
                .fill(1)
                .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
                .join('');
            const randomQuote = `___${randomFromArray(quotes)}___`;
            const randomInsertPosition = random(1, 25);
            const finalQuote = randomLetters.slice(0, randomInsertPosition) + randomQuote + randomLetters.slice(randomInsertPosition)
            App.displayPopup(`
                <div class="flex-wrap flex">
                    ${finalQuote
                        .split('').map(letter =>
                         `<span class="random-letter-bounce" style="animation-delay: -${Math.random() * 1250}ms; --direction: ${random(-1, 1)}">${letter}</span>`
                        ).join('')}
                </div>
            `, App.INF);
        })

        App.sendAnalytics('reckoning_encounter');
        return true;
    }
    static async revive(){
        App.toggleGameplayControls(false);

        // revive
        App.pet.stats.current_health = 50;
        App.pet.stats.current_death_tick = 100;
        App.pet.stats.is_revived_once = true;
        App.pet.stats.is_dead = false;

        App.setScene(App.scene.reviverDen);
        App.pet.stopMove();
        App.pet.x = '50%';
        App.pet.y = -999;
        App.pet.opacity = 0.5;
        App.pet.staticShadow = true;

        setTimeout(() => {
            App.playSound('resources/sounds/revival_01.ogg', true);
        })

        const reviverNpc = new Pet(
            new PetDefinition({
                sprite: 'resources/img/character/chara_193b.png',
                name: 'The Exorcist',
                accessories: ['reviver hood'],
            }),
            {
                x: '20%',
                z: App.constants.ACTIVE_PET_Z - 1,
            }
        );
        reviverNpc.triggerScriptedState('mild_uncomfortable', App.INF, false, true);

        const doppelGanger = new Object2d({
            img: App.petDefinition.sprite,
            spritesheet: {
                ...App.petDefinition.spritesheet,
                cellNumber: App.petDefinition.animations.sleeping.start,
            },
            additionalY: App.petDefinition.spritesheet.offsetY,
            noPreload: true,
            y: '65%',
            onDraw: (me) => {
                if(me.y + me.spritesheet.cellSize/2 < App.pet.y) {
                    me.removeObject();
                    App.pet.opacity = 1;
                    App.pet.stopScriptedState();
                    App.pet.setState('shocked');
                }
            }
        })

        await App.pet.triggerScriptedState('idle', 3100, false, true); // idling at the top

        App.pet.y = 0;
        reviverNpc.setState('shocked');

        const reviveBackgroundObject = new Object2d({
            img: 'resources/img/misc/light_rays_02.png',
            x: '50%', y: '50%', z: App.constants.ACTIVE_PET_Z - 0.01,
            opacity: 1,
            composite: 'difference',
            onDraw: (me) => {
                me.rotation += 0.01 * App.deltaTime;
                me.x = '50%'; me.y = '50%';
                me.opacity -= 0.0004 * App.deltaTime;
                if(me.opacity < 0) me.removeObject();
            }
        })

        await App.pet.triggerScriptedState('angry', 3500, false, true, false,
            () => {
                App.pet.y = lerp(App.pet.y, 90, 0.00065 * App.deltaTime);
            }
        )

        reviverNpc.setState('cheering');

        // App.pet.y = '100%';
        App.pet.opacity = 1;
        // doppelGanger.removeObject();
        App.pet.playUncomfortableAnimation(() => {
            reviverNpc.removeObject();
            App.setScene(App.scene.home);
            App.toggleGameplayControls(true);
            App.displayConfirm(`<b>${App.petDefinition.name} has been revived!</b> <br><br> please take better care of them from now on since you won't be able to revive them again!`, [
                {
                    name: 'ok',
                    onclick:() => {}
                }
            ])
        });
    }
    static async goToCurrentRabbitHole() {
        const { current_rabbit_hole: currentRabbitHole } = App.pet.stats;
        const rabbitHoleDefinition =
            App.definitions.rabbit_hole_activities.find(
                (activity) => activity.name === currentRabbitHole.name,
            );
        const hasVisualizer = Boolean(rabbitHoleDefinition?.onVisualize);

        const outOverlay = new Object2d({
            img: 'resources/img/misc/out_overlay_01.png',
            x: 0, y: 0, z: 10,
            invisible: hasVisualizer,
        });

        const rabbitHoleLabel = rabbitHoleDefinition?.label || App.pet.stats.current_rabbit_hole.name;

        const onEndFn = (isInterrupted) => {
            App.unregisterOnDrawEvent(driverFrameEvent);
            App.toggleGameplayControls(false);

            if(!isInterrupted){
                rabbitHoleDefinition?.onEnd?.();
                App.displayConfirm(`<b>"${rabbitHoleLabel}"</b> activity has ended and ${App.petDefinition.name} is back home!`, [
                    {
                        name: 'ok',
                        onclick: () => {}
                    }
                ])
                // randomly increase skill points
                App.pet.stats.current_expression += clamp(random(-2, 3), 0, 3);
                App.pet.stats.current_logic += clamp(random(-2, 3), 0, 3);
                App.pet.stats.current_endurance += clamp(random(-2, 3), 0, 3);
            }

            App.pet.stats.current_rabbit_hole.name = false;

            App.fadeScreen({
                middleFn: () => {
                    App.pet.stopScriptedState();
                    App.pet.x = '50%';
                    App.pet.stopMove();
                    App.toggleGameplayControls(true);
                    outOverlay.removeObject();
                    App.setScene(App.scene.home);
                }
            })
        }

        const driverFn = () => {
            if(App.pet.stats.is_dead){
                // abort if pet is dead
                setTimeout(() => {
                    App.pet.stopScriptedState();
                }, 1)
                App.pet.stats.current_rabbit_hole.name = false;
                App.unregisterOnDrawEvent(driverFrameEvent);
            }

            const remainingTime = currentRabbitHole.endTime - Date.now();
            if(remainingTime <= 0){
                onEndFn();
                App.pet.stopScriptedState();
                return true;
            }
        }
        const driverFrameEvent = App.registerOnDrawEvent(driverFn);

        const isAlreadyEnded = driverFn();
        if(isAlreadyEnded) return;

        App.toggleGameplayControls(false, () => {
            App.displayConfirm(`
                <div style="font-size: x-small;" class="solid-surface-stylized b-radius-10">
                    <i  class="fa-solid fa-clock" style="margin-right: 2px;"></i>
                    <span>${rabbitHoleLabel}</span>
                </div>
                ${App.petDefinition.name}
                will be ${hasVisualizer ? "done" : "back"}
                <b>in ${humanizeExactDuration(
                    moment(currentRabbitHole.endTime)
                        .diff(moment())
                )}</b>
                `, [
                {
                    name: 'end early',
                    onclick: () => {
                        onEndFn(true);
                    },
                },
                {
                    name: 'close',
                    class: 'back-btn',
                    onclick: () => {}
                }
            ])
        });

        if(!hasVisualizer){
            App.pet.triggerScriptedState('idle', App.INF, false, true, null)
            App.pet.stopMove();
            App.pet.targetX = -999;
            setTimeout(() => App.pet.x = -99);
        }

        setTimeout(() => {
            rabbitHoleDefinition?.onVisualize?.();
        })
    }
    static async goToFortuneTeller(otherPetDef){
        App.toggleGameplayControls(false);
        App.setScene(App.scene.fortune_teller);

        let evolutions = App.petDefinition.getPossibleEvolutions(false, true);

        if(otherPetDef){
            evolutions = [PetDefinition.getOffspringSprite(App.petDefinition, otherPetDef)];
            App.pet.showThought(App.constants.WANT_TYPES.playdate, otherPetDef);
        }

        const petsToReveal = evolutions?.map((sprite, index) => {
            const petDef = new PetDefinition({
                sprite,
            })

            // handle ghost combinations
            if(!otherPetDef){
                if(App.petDefinition.stats.is_ghost){
                    petDef.stats.is_ghost = App.petDefinition.stats.is_ghost;
                }
            } else {
                if(otherPetDef.stats.is_ghost) {
                    petDef.stats.is_ghost = otherPetDef.stats.is_ghost;
                }
            }

            const pet = new Pet(
                petDef,
                {
                    x: '50%',
                    y: '55%',
                    z: App.constants.BACKGROUND_Z - 1,
                    opacity: 0,
                    castShadow: false,
                }
            );
            pet.opacity = 0; // reset opacity in case of being ghost

            if(evolutions.length > 1){
                for(let i = 0; i < 3; i++){
                    new Object2d({
                        img: 'resources/img/misc/star_01.png',
                        x: `${40 + (i * 10)}%`,
                        y: `6%`,
                        opacity: 1,
                        scale: 0.4,
                        parent: pet,
                        rating: index,
                        onDraw: (me) => {
                            const fullOpacity = i <= index;
                            me.opacity = fullOpacity ? me.parent.opacity : me.parent.opacity * 0.25;
                        }
                    });
                }
            }

            pet.triggerScriptedState('idle', App.INF, 0, true);

            return pet;
        })

        const fadeInAndOut = (pet) => {
            let target = 1;
            setTimeout(() => target = 0, 4000);
            pet.onDraw = (me) => {
                me.opacity = lerp(me.opacity, target, 0.0025 * App.deltaTime);
                Object2d.animations.bob(me, 0.005, 0.1);
            }
        }

        App.pet.stopMove();
        App.pet.x = -30;
        App.pet.targetX = 50;
        App.pet.triggerScriptedState('moving', 3000, null, true, () => {
            App.pet.x = '20%';
            App.pet.inverted = true;
            App.pet.triggerScriptedState('idle', 2000, null, true, () => {
                const delayBetweenReveals = 6000;
                const maxWaitTime = petsToReveal.length * delayBetweenReveals;
                App.pet.triggerScriptedState('shocked', maxWaitTime, null, true, () => {
                    App.pet.playCheeringAnimation(() => {
                        petsToReveal?.forEach(p => p?.removeObject());
                        App.setScene(App.scene.home);
                        App.toggleGameplayControls(true);
                        App.handlers.open_fortune_teller();
                    });
                });
                petsToReveal?.forEach((p, i) => {
                    setTimeout(() => fadeInAndOut(p), i * delayBetweenReveals);
                });

            });
        });

        App.sendAnalytics('visit_fortune_teller');
    }
    static async useItem(item){
        App.closeAllDisplays();

        if(App.pet.stats.is_misbehaving){
            App.pet.x = '50%';
            App.pet.playAngryAnimation();
            return;
        }

        const itemObject = new Object2d({
            img: App.constants.ITEM_SPRITESHEET,
            spritesheet: {
                ...App.constants.ITEM_SPRITESHEET_DIMENSIONS,
                cellNumber: item.sprite,
            },
            x: '55%', y: '47%', z: App.constants.ACTIVE_ITEM_Z
        });
        App.pet.setLocalZBasedOnSelf(itemObject)

        Missions.done(Missions.TYPES.play_item);

        App.toggleGameplayControls(false);

        const interruptFn = () => {
            App.pet.stopScriptedState();
        }
        App.toggleGameplayControls(false, (item.interruptable ? interruptFn : false))

        App.petDefinition.checkWant(App.pet.stats.current_want.item == item.name, App.constants.WANT_TYPES.item);

        if(item.handler){
            return item.handler(App.pet, item, itemObject);
        }

        App.pet.stopMove();
        App.pet.x = randomFromArray(['50%', '25%', '75%']);
        App.pet.y = '92%';
        App.pet.inverted = true;
        App.pet.staticShadow = true;
        App.pet.triggerScriptedState('cheering', item.interaction_time || 10000, false, true, () => {
            App.toggleGameplayControls(true);
            itemObject?.removeObject();

            let fun_replenish = item.fun_replenish;
            if(App.petDefinition.hasTrait('treasurer')){
                fun_replenish *= 1.5;
            }

            App.pet.stats.current_fun += fun_replenish || 0;
            App.pet.stats.current_sleep += item.sleep_replenish || 0;
            App.pet.stats.current_expression += item.expression_increase || 0;
            App.pet.stats.current_logic += item.logic_increase || 0;
            App.pet.stats.current_endurance += item.endurance_increase || 0;

            App.pet.playCheeringAnimation();

            App.reloadScene(); // to reset pet pos

            item.onEnd?.();
        }, Pet.scriptedEventDrivers.playingWithItem.bind({pet: App.pet, item: item, itemObject}))
    }
    static async goOnDate(otherPetDef = App.getRandomPetDef(), onFailEnd){
        App.closeAllDisplays();
        App.toggleGameplayControls(false);
        App.setScene(App.scene.beach);
        const otherPet = new Pet(otherPetDef);

        // moving in
        otherPet.x = '70%';
        otherPet.targetX = 0;
        otherPet.triggerScriptedState('moving', 2000, false, true);
        App.pet.x = '100%';
        App.pet.targetX = 50;
        await App.pet.triggerScriptedState('moving', 2000, false, true);

        // date
        App.pet.x = '70%';
        otherPet.x = '30%';
        otherPet.inverted = true;
        otherPet.triggerScriptedState('eating', 8000, false, true);
        await App.pet.triggerScriptedState('eating', 8000, false, true);

        // conclusion
        const end = () => {
            App.pet.stopScriptedState();
            otherPet.removeObject();
            App.setScene(App.scene.home);
            App.toggleGameplayControls(true);
        }
        const determineBehavior = (pet, enjoyment) => {
            if(enjoyment){
                pet.showThought('thought_heart')
                pet.triggerScriptedState('blush', App.INF, false, true);
                App.playSound('resources/sounds/task_complete_02.ogg', true)
            } else {
                pet.showThought('thought_heart_broken')
                pet.triggerScriptedState('idle_side_uncomfortable', App.INF, false, true);
                pet.inverted = !pet.inverted;
                setTimeout(() => App.playSound('resources/sounds/task_fail_01.ogg', true))
            }
        }

        let petOverall = (App.pet.stats.current_fun + App.pet.stats.current_cleanliness + App.pet.stats.current_health + random(0, 100)) / 4;
        if(App.petDefinition.hasTrait('romantic')) petOverall += random(20, 80);
        const otherEnjoyment = random(30, 85) <= petOverall;
        const petEnjoyment = otherEnjoyment ? !!random(0, 6) : random(0, 1); // just to make it more common for both parties to not like each other
        determineBehavior(App.pet, petEnjoyment);
        determineBehavior(otherPet, otherEnjoyment);

        setTimeout(() => {
            if(!petEnjoyment || !otherEnjoyment){
                let text = '';
                if (!otherEnjoyment && !petEnjoyment) {
                    text = `Oh no! ${App.petDefinition.name} and ${otherPetDef.name} didn't really hit it off!`;
                } else if (!otherEnjoyment && petEnjoyment) {
                    text = `${otherPetDef.name} didn't quite connect with ${App.petDefinition.name}!`;
                } else {
                    text = `${App.petDefinition.name} didn't quite connect with ${otherPetDef.name}!`;
                }
                return App.displayPopup(text, 5000, () => {
                    end();
                    onFailEnd?.();
                    App.pet.stats.current_fun -= 35;
                    App.pet.playUncomfortableAnimation();
                });
            }

            App.pet.stats.current_fun += 40;
            App.displayConfirm(`${App.petDefinition.name} and ${otherPetDef.name} had a wonderful time together! <br><br> Do you want to propose to ${otherPetDef.name}?`, [
                {
                    name: 'propose',
                    onclick: () => {
                        App.displayConfirm(`${App.petDefinition.name} and <div>${otherPetDef.getCSprite()} ${otherPetDef.name}</div> will get married and you'll receive their egg, are you sure?`, [
                            {
                                name: 'yes',
                                onclick: () => {
                                    end();
                                    Activities.wedding(otherPetDef);
                                }
                            },
                            {
                                name: 'cancel',
                                class: 'back-btn',
                                onclick: () => {
                                    App.definitions.achievements.not_propose_on_date_x_times.advance();
                                    end();
                                },
                            }
                        ])
                    },
                },
                {
                    name: 'cancel',
                    class: 'back-btn',
                    onclick: end
                }
            ])
        }, 3000);
    }
    static goToInnerGarden(){
        const screen = UI.empty();
        document.querySelector('.screen-wrapper').appendChild(screen);
        screen.innerHTML = `
            <div class="flex flex-dir-col justify-between" style="position: absolute; top: 4px; right: 4px;">
                <button class="generic-btn stylized slide-action" id="backyard">
                    ${App.getIcon('paw', true)}
                </button>
            </div>
        `;
        screen.querySelector('#backyard').onclick = () => {
            const controller = App.getGameplayControlsState()
            if(!controller.state && !controller.onclick) return;
            screen.remove();
            App.fadeScreen({middleFn: () => Activities.goToGarden()})
        }

        Activities.task_handleLeavingAnimals();

        App.pet.stopScriptedState();
        App.pet.x = '100%';
        App.pet.targetX = 50;
        App.setScene(App.scene.garden_inner);

        const displayPlantsList = ({
            onPlantClick,
            filterFn = () => true,
            additionalStartOptions = [],
        }) => {
            const allPlantsList = App.plants
                .filter(filterFn)
                .map((currentPlant, currentPlantIndex) => {
                    const plantNameText = `<span style="${currentPlant.isDead ? 'color: red': ''}"> ${currentPlant.name} </span>`
                    return {
                        name: `<span class="icon ${currentPlant.isDead ? 'opacity-half' : ''}">${currentPlant.getCSprite()}</span> ${plantNameText}`,
                        onclick: () => onPlantClick(currentPlant, currentPlantIndex)
                    }
                })
            return App.displayList([...additionalStartOptions, ...allPlantsList], null, 'back');
        }

        const displayMainList = () => {
            const mainList =  App.displayList([
                {
                    name: '<i class="icon fa-solid fa-plus icon"></i> plant',
                    _disable: App.plants.length === App.constants.MAX_PLANTS,
                    onclick: () => {
                        const onSelectSeed = (plantName) => {
                            if (App.plants.length !== App.constants.MAX_PLANTS) {
                                const plant = new Plant({ name: plantName });
                                App.plants.push(plant);
                                App.handleGardenPlantsSpawn(true);
                                Missions.done(Missions.TYPES.plant_in_garden);
                                Activities.task_floatingObjects(10, ['resources/img/misc/add_green_01.png']);
                                App.sendAnalytics('plant', plantName);
                                mainList.close();
                                return true;
                            }
                            return false;
                        }

                        App.handlers.open_seed_list(false, null, onSelectSeed);
                        return true;
                    }
                },
                {
                    name: `stats`,
                    _disable: !App.plants.length,
                    onclick: () => {
                        return displayPlantsList({
                            onPlantClick: (plant) => {
                                App.handlers.open_plant_stats(plant);
                                return true;
                            },
                        })
                    },
                },
                {
                    name: 'water',
                    _disable: !App.plants.some(p => !p.isDead),
                    onclick: async () => {
                        App.closeAllDisplays();
                        const wateringCan = new Object2d({
                            img: 'resources/img/misc/watering_can_01.png',
                            z: 100,
                        })
                        const previousController = App.getGameplayControlsState().onclick;
                        App.toggleGameplayControls(false);
                        for(let i = 0; i < App.plants.length; i++){
                            const plant = App.plants[i];
                            // if(plant.isWatered || plant.isDead) continue;
                            if(plant.isDead) continue;

                            wateringCan.x = plant.position.x + 8;
                            wateringCan.y = plant.position.y;
                            await App.wait(500);
                            plant.water();
                            Missions.done(Missions.TYPES.water_crop);
                        }
                        wateringCan.removeObject();
                        App.pet.stats.current_expression += 0.5;
                        App.toggleGameplayControls(false, previousController);
                    }
                },
                {
                    name: 'harvest',
                    _disable: !App.plants.some(p => p.age === Plant.AGE.grown),
                    onclick: () => {
                        const displayHarvestables = () => {
                            if(!App.plants.some(p => p.age === Plant.AGE.grown)) return;

                            const list = displayPlantsList({
                                onPlantClick: (plant, plantIndex) => {
                                    App.plants.splice(plantIndex, 1); // removing plant
                                    App.handleGardenPlantsSpawn(true);
                                    Activities.task_floatingObjects(10, ['resources/img/misc/tick_green_01.png']);

                                    let amount = random(3, 5);
                                    if(App.isGameplayBuffActive('doubleHarvest')) amount += random(3, 5);
                                    if(App.petDefinition.hasTrait('plentyHarvest')) amount += random(0, 5);

                                    App.addNumToObject(App.pet.inventory.harvests, plant.name, amount);
                                    App.displayConfirm(`
                                            <div>${plant.getCSprite()}</div>
                                            <div>${plant.name}</div>
                                            <div>(x${amount})</div>
                                        `, [
                                        {
                                            name: 'ok',
                                            onclick: () => {
                                                App.closeAllDisplays();
                                                UI.clearLastClicked();
                                                mainList.close();
                                                list.close();
                                                displayMainList();
                                                displayHarvestables();
                                            }
                                        }
                                    ])
                                    App.sendAnalytics('harvest', plant.name);
                                    App.pet.stats.current_logic += 0.25;
                                    return true;
                                },
                                filterFn: (plant) => plant.age === Plant.AGE.grown
                            })
                        }
                        displayHarvestables();
                        return true;
                    }
                },
                {
                    name: 'remove',
                    _disable: !App.plants.length || App.plants.every(p => p.age === Plant.AGE.grown),
                    onclick: () => {
                        displayPlantsList({
                            additionalStartOptions: App.plants.some(p => p.isDead) ? [
                                {
                                    name: '<span style="color: red;"><i class="icon fa-solid fa-skull icon"></i> Dead ones</span>',
                                    onclick: () => {
                                        return App.displayConfirm(`Are you sure you want to remove all dead plants?`, [
                                            {
                                                name: 'yes',
                                                onclick: () => {
                                                    while(true){
                                                        const deadPlantIndex = App.plants.findIndex(p => p.isDead);
                                                        if(deadPlantIndex === -1) break;
                                                        App.plants.splice(deadPlantIndex, 1);
                                                    }
                                                    App.handleGardenPlantsSpawn(true);
                                                    App.closeAllDisplays();
                                                    Activities.task_floatingObjects(10, ['resources/img/misc/remove_red_01.png']);
                                                }
                                            },
                                            {
                                                name: 'no',
                                                class: 'back-btn',
                                                onclick: () => {}
                                            },
                                        ])
                                    }
                                },
                                // {type: 'separator',}
                            ] : [],
                            onPlantClick: (plant, plantIndex) => {
                                return App.displayConfirm(`Are you sure you want to remove <b>${plant.name} (${Plant.AGE_LABELS[plant.age]})</b>?`, [
                                    {
                                        name: 'yes',
                                        onclick: () => {
                                            App.plants.splice(plantIndex, 1); // removing plant
                                            App.handleGardenPlantsSpawn(true);
                                            App.closeAllDisplays();
                                            Activities.task_floatingObjects(10, ['resources/img/misc/remove_red_01.png']);
                                        }
                                    },
                                    {
                                        name: 'no',
                                        class: 'back-btn',
                                        onclick: () => {}
                                    },
                                ])
                            },
                            filterFn: (plant) => plant.age !== Plant.AGE.grown
                        })
                        return true;
                    }
                },
                {
                    name: 'inventory',
                    onclick: () => {
                        return App.displayList([
                            {
                                name: `
                                <div class="flex-between flex-wrap" style="row-gap: 4px">
                                    ${App.getHarvestInventoryUI()}
                                </div>
                                `,
                                type: 'text',
                            },
                        ]);
                    }
                },
                {
                    name: `active buffs`,
                    onclick: () => App.handlers.open_active_buffs('garden'),
                },
                {
                    name: '<i class="icon fa-solid fa-home"></i> go inside',
                    class: 'back-btn',
                    onclick: () => {
                        App.setScene(App.scene.home);
                        App.toggleGameplayControls(true);
                        App.pet.stopScriptedState();
                        App.pet.x = '0%';
                        App.pet.targetX = 50;
                        screen.remove();
                    }
                },
                // {
                //     name: '<i class="icon fa-solid fa-arrow-left icon"></i> backyard',
                //     class: 'back-btn',
                //     onclick: () => {
                //         Activities.goToGarden();
                //     }
                // }
            ]);

            return mainList;
        }

        App.toggleGameplayControls(false, displayMainList)
    }
    static goToGarden(){
        const screen = UI.empty();
        document.querySelector('.screen-wrapper').appendChild(screen);
        screen.innerHTML = `
            <div class="flex flex-dir-col justify-between" style="position: absolute; top: 4px; left: 4px;">
                <button class="generic-btn stylized slide-action" id="garden">
                    ${App.getIcon('seedling', true)}
                </button>
            </div>
        `;
        screen.id = 'garden-screen';
        screen.querySelector('#garden').onclick = () => {
            const controller = App.getGameplayControlsState()
            if(!controller.state && !controller.onclick) return;
            screen.remove();
            App.fadeScreen({middleFn: () => Activities.goToInnerGarden()})
        }

        const openChooseNameDialog = (animalDef, onEndFn) => {
            return App.displayPrompt(`Choose a name for ${animalDef.getFullCSprite()}:`, [
                {
                    name: 'set',
                    onclick: (text) => {
                        animalDef.name = text;
                        onEndFn?.();
                        App.displayPopup(`Name set to ${animalDef.name}!`);
                    }
                },
                {
                    name: 'cancel',
                    class: 'back-btn',
                    onclick: () => {}
                }
            ], animalDef.name)
        }

        const getNextAttractMs = (fromMs = App.animals.nextAttractMs) => {
            return (fromMs || Date.now()) + App.constants.ONE_HOUR * random(2, 8);
        }
        const resetTreat = () => {
            App.animals.treat = null;
            App.animals.treatBiteCount = 0;
        }
        const checkForArrivedAnimal = () => {
            if(!App.animals.treat) return;
            if(App.animals.nextAttractMs > Date.now()) return;

            App.animals.treatBiteCount ++;
            App.animals.nextAttractMs = getNextAttractMs();

            if(!random(0, 2)){
                resetTreat();
                const newAnimal = new AnimalDefinition({
                    name: getRandomName(false, true),
                    sprite: randomFromArray(ANIMAL_CHARACTERS)
                });
                App.animals.list.push(newAnimal);
                App.displayPopup(`A new animal ${newAnimal.getFullCSprite()} has chosen your backyard as their new home. Take good care of them!`, 3000, () => openChooseNameDialog(newAnimal));
                App.pet.stats.current_expression += 2;
                App.sendAnalytics('animal_arrived');
            } else if(App.animals.treatBiteCount > 2) {
                resetTreat();
                App.pet.stats.current_endurance += 3;
                App.displayConfirm(`The food you placed out earlier is gone.<br><br>Unfortunately, its visitor chose not to stay this time, maybe you'll meet them next time!`, [
                    {
                        name: 'ok',
                        onclick: () => {}
                    }
                ]);
            }
        }

        // handle new animal arriving
        if(App.animals.treat){
            const timeDelta = Date.now() - App.animals.nextAttractMs;
            const repeatTimes = Math.ceil(timeDelta / (App.constants.ONE_HOUR * 2));
            for(let i = 0; i < clamp(repeatTimes, 0, 10); i++){
                checkForArrivedAnimal();
            }
        }

        // handle animals leaving
        Activities.task_handleLeavingAnimals();

        App.pet.stopScriptedState();
        App.setScene(App.scene.garden);
        App.pet.x = '100%';
        App.pet.targetX = 50;

        const feedAnimal = (animalDef, selectedFood) => {
            App.closeAllDisplays();
            animalDef.feed(selectedFood.hunger_replenish * 3);

            const startTime = App.time - Math.random() * 15;
            const spawnedAnimal = App.spawnedAnimals.find(a => a.animalDefinition === animalDef);
            const foodObject = new Object2d({
                parent: spawnedAnimal,
                // image: App.preloadedResources[App.constants.FOOD_SPRITESHEET],
                img: App.constants.FOOD_SPRITESHEET,
                spritesheet: {
                    ...App.constants.FOOD_SPRITESHEET_DIMENSIONS,
                    cellNumber: selectedFood.sprite
                },
                scale: 0.75,
                x: spawnedAnimal.x + spawnedAnimal.spritesheet.cellSize,
                y: spawnedAnimal.y - spawnedAnimal.spritesheet.cellSize,
                noPreload: true,
                onDraw: (me) => {
                    App.pet.setLocalZBasedOnSelf(me);
                },
            })
            spawnedAnimal.stopMove();
            spawnedAnimal.inverted = true;
            spawnedAnimal.triggerScriptedState('eating', App.INF, false, true,
                () => {
                    foodObject.removeObject();
                    spawnedAnimal.playCheeringAnimation(null, true);
                },
                () => {
                    const elapsedTime = App.time - startTime;
                    const spriteOffset = Math.floor(elapsedTime / 1500);
                    foodObject.spritesheet.cellNumber = selectedFood.sprite + clamp(spriteOffset, 0, 2);
                    // foodObject.scale = 1 - (spriteOffset * 0.2);
                    if(spriteOffset > 2) spawnedAnimal.stopScriptedState();
                }
            );
            Missions.done(Missions.TYPES.feed_animal);
            return true;
        }

        App.toggleGameplayControls(false, () => {
            return App.displayList([
                {
                    _ignore: !App.temp.hasActiveDigSpot,
                    name: `
                        <span class="overflow-hidden ellipsis" style="color: #914f15;">
                            ${App.getIcon('person-digging icon', true)} Dig up treasure
                        </span>
                    `,
                    onclick: () => {
                        App.closeAllDisplays();
                        App.toggleGameplayControls(false);
                        App.fadeScreen({
                            middleFn: () => Activities.digGardenTreasure()
                        })
                    }
                },
                {
                    _ignore: true,
                    name: 'Garden',
                    onclick: () => {
                        Activities.goToInnerGarden();
                    }
                },
                {
                    name: 'Animals',
                    onclick: () => {
                        return App.displayList([
                            ...App.animals.list.map(animalDef => ({
                                name: `${animalDef.getFullCSprite()}${animalDef.name}`,
                                onclick: () => {
                                    return App.displayList([
                                        {
                                            type: 'text',
                                            name: `
                                                Happiness:
                                                ${App.createProgressbar(animalDef.stats.current_happiness).node.outerHTML}
                                            `,
                                        },
                                        {
                                            name: 'feed',
                                            onclick: () => {
                                                const onUseFn = (selectedFood) => feedAnimal(animalDef, selectedFood);
                                                return App.handlers.open_food_list({buyMode: false, filterType: 'food', useMode: onUseFn, age: PetDefinition.LIFE_STAGE.adult});
                                            }
                                        },
                                        {
                                            name: 'play',
                                            onclick: () => {
                                                App.closeAllDisplays();
                                                animalDef.increaseHappiness(random(2, 5));
                                                const spawnedAnimal = App.spawnedAnimals.find(a => a.animalDefinition === animalDef);
                                                App.pet.stopScriptedState();
                                                spawnedAnimal.stopScriptedState();
                                                spawnedAnimal.interactWith(App.pet, {animation: 'cheering', length: 5000});
                                                Missions.done(Missions.TYPES.play_with_animal);
                                            }
                                        },
                                        {
                                            type: 'text',
                                            name: App.getGameplayBuffUI(animalDef.getBuff()),
                                        },
                                        {
                                            name: 'rename',
                                            onclick: () => openChooseNameDialog(animalDef, () => App.closeAllDisplays())
                                        },
                                        {
                                            _mount: (e) => e.innerHTML = `indoor: <i>${animalDef.spawnIndoors ? 'yes' : 'no'}</i>`,
                                            onclick: (btn) => {
                                                animalDef.spawnIndoors = !animalDef.spawnIndoors;
                                                btn._mount();
                                                return true;
                                            }
                                        },
                                        {
                                            name: `<span style="color: red;">Release</span>`,
                                            onclick: () => {
                                                return App.displayConfirm(`Are you sure you want release ${animalDef.name} back into the wild?`, [
                                                    {
                                                        name: 'yes',
                                                        onclick: async () => {
                                                            App.closeAllDisplays();

                                                            const previousController = App.getGameplayControlsState().onclick;
                                                            App.toggleGameplayControls(false);
                                                            App.pet.stopMove();
                                                            App.pet.inverted = false;
                                                            App.pet.x = '75%';
                                                            App.pet.triggerScriptedState('uncomfortable', App.INF, false, true);
                                                            const spawnedAnimal = App.spawnedAnimals.find(a => a.animalDefinition === animalDef);
                                                            spawnedAnimal.stopMove();
                                                            spawnedAnimal.x = '50%';
                                                            spawnedAnimal.y = '100%';
                                                            spawnedAnimal.targetX = -100;
                                                            await spawnedAnimal.triggerScriptedState('moving', 5000, false, true);
                                                            App.toggleGameplayControls(false, previousController);
                                                            App.pet.stopScriptedState();

                                                            App.displayPopup(`${animalDef.name} has been released back into the wild.`, 4000);
                                                            App.animals.list.splice(
                                                                App.animals.list.indexOf(animalDef),
                                                                1
                                                            );
                                                            App.reloadScene(true);
                                                        }
                                                    },
                                                    {
                                                        name: 'no',
                                                        class: 'back-btn',
                                                        onclick: () => {}
                                                    }
                                                ])
                                            }
                                        },
                                    ])
                                }
                            })),
                            {
                                _ignore: !App.animals.list?.length,
                                name: `${App.getIcon('bell-concierge')} feed all`,
                                onclick: () => {
                                    const onUseFn = (selectedFood) => {
                                        App.animals.list.forEach((animalDef, i) => {
                                            feedAnimal(animalDef, selectedFood);
                                        })
                                        return true;
                                    }
                                    const openFoodList = () => App.handlers.open_food_list({
                                        buyMode: false,
                                        filterType: 'food',
                                        useMode: onUseFn,
                                        age: PetDefinition.LIFE_STAGE.adult,
                                        useModeLabel: `Use (x${App.animals.list.length})`,
                                        useAmount: App.animals.list.length,
                                    });
                                    openFoodList();
                                    return true;
                                }
                            },
                            {
                                _disable: App.animals.list.length >= App.constants.MAX_ANIMALS,
                                name: '<i class="fa-solid fa-plus icon"></i> Attract Animal',
                                onclick: () => {
                                    return App.displayList([
                                        {
                                            name: App.animals.treat ? 'Replace food' : 'Place food',
                                            onclick: () => {
                                                const onUseFn = (selectedFood) => {
                                                    App.closeAllDisplays();
                                                    App.animals.treat = selectedFood.sprite;
                                                    App.animals.treatBiteCount = 0;
                                                    App.animals.nextAttractMs = getNextAttractMs(Date.now());
                                                    App.reloadScene(true);
                                                    App.displayPopup("The food has been placed!<br><br>Check back in a few hours to see if you've gotten a visitor!", 4000);
                                                    return true;
                                                }
                                                return App.handlers.open_food_list({buyMode: false, filterType: 'food', useMode: onUseFn, age: PetDefinition.LIFE_STAGE.adult});
                                            }
                                        },
                                        {
                                            type: 'info',
                                            name: `Placing food out may attract new animals!`
                                        }
                                    ])
                                }
                            },
                        ])
                    }
                },
                {
                    name: `active buffs`,
                    onclick: App.handlers.open_active_buffs,
                },
                {
                    name: '<i class="icon fa-solid fa-home"></i> go inside',
                    class: 'back-btn',
                    onclick: () => {
                        App.setScene(App.scene.home);
                        App.toggleGameplayControls(true);
                        App.pet.stopScriptedState();
                        App.pet.x = '0%';
                        App.pet.targetX = 50;
                        screen.remove();
                    }
                }
            ])
        })
    }
    static getMail({onEndFn = App.handlers.show_newspaper, noSceneSwitch} = {}){
        App.pet.stopMove();
        App.toggleGameplayControls(false);
        App.pet.playSound('resources/sounds/blush.ogg', true)
        if(!noSceneSwitch) App.setScene(App.scene.garden, false, { noPetBowl: true });
        App.pet.x = '78%';
        App.pet.inverted = false;
        App.pet.triggerScriptedState('idle_side', App.INF, false, true);
        const mailManDef = new PetDefinition({
            sprite: NPC_CHARACTERS[1],
            name: 'Nazotchi'
        });
        const mailMan = new Pet(mailManDef, {
            x: '0%',
            y: App.scene.garden.petY,
            targetX: 50,
            onDraw: (me) => App.pet.setLocalZBasedOnSelf(me),
        });
        const payload = () => {
            mailMan.removeObject();
            onEndFn();
            App.pet.stopScriptedState();
            App.toggleGameplayControls(true);
            App.setScene(App.scene.home);
            App.pet.x = '50%';
        }
        mailMan.triggerScriptedState('moving', 2500, null, true, () => {
            mailMan.stopMove();
            mailMan.playCheeringAnimation(payload, true);
            App.pet.playCheeringAnimation();
        });
    }
    static onlineHubTransition(onEndFn){
        Missions.done(Missions.TYPES.visit_online_hub);
        App.pet.stopMove();
        App.toggleGameplayControls(false);
        App.pet.x = '50%';
        setTimeout(() => App.playSound('resources/sounds/online_hub_transition_01.ogg', true));
        const fadeOverlay = new Object2d({
            img: 'resources/img/misc/cyberpunk_overlay_01.png',
            x: 0, y: 0, z: 555, opacity: 0, direction: true,
            onDraw: (me) => {
                Object2d.animations.flip(me, 1000);
                if(me.direction) me.opacity += 0.00025* App.deltaTime;
                else me.opacity -= 0.001 * App.deltaTime;
                me.opacity = clamp(me.opacity, 0, 2);
                if(!me.direction && me.opacity == 0) me.removeObject();
            }
        })
        const lightRays = new Object2d({
            parent: fadeOverlay,
            img: 'resources/img/misc/light_rays_02.png',
            z: 556, opacity: 0, x: '50%', y: '50%', composite: 'overlay',
            onDraw: (me) => {
                me.opacity = fadeOverlay.opacity * 3;
                me.rotation += 0.01 * App.deltaTime;
                me.x = '50%'; me.y = '50%';
            }
        })

        App.pet.triggerScriptedState('shocked', 4000, false, true, () => {
            App.pet.targetY = undefined;
            App.pet.depthOffset = 0;
            onEndFn?.(fadeOverlay);
        });
        App.pet.targetY = 50;
        App.pet.depthOffset = 50;
    }
    static async goToOnlineHub(){
        const {hasUploadedPetDef, randomPetDefs} = App.temp.online;
        const INTERACTION_LIKES = {
            outgoing: hasUploadedPetDef.interactionOutgoingLikes ?? 2,
            receiving: hasUploadedPetDef.interactionReceivingLikes ?? 1,
        }
        const addInteraction = (def, skipApi) => {
            if(!skipApi) App.apiService.addInteraction(def.ownerId);
            def.interactions = (def.interactions ?? 0) + INTERACTION_LIKES.outgoing;
            hasUploadedPetDef.interactions = (hasUploadedPetDef.interactions ?? 0) + INTERACTION_LIKES.receiving;
        }

        App.setScene(App.scene.online_hub);

        App.pet.stopMove();
        App.pet.x = '50%';

        let npcY = 60;
        const otherPlayersPets = randomPetDefs.slice(0, 7).map((def, i) => {
            if(i && i % 2 == 0) npcY += 10;
            const p = new Pet(def, {
                x: `${random(0, 100)}%`,
                y: `${npcY - i}%`,
                z: App.constants.ACTIVE_PET_Z,
                depthMode: Object2d.DEPTH_MODE.y,
                opacity: 1,
            });
            p.stats.wander_max = 3;
            return p;
        });

        if(hasUploadedPetDef.status){
            App.apiService.addPetDef();
        }

        // handlers
        const despawnAllPets = () => {
            otherPlayersPets.forEach(p => p?.removeObject?.());
        }
        const handleHangout = (def) => {
            App.closeAllDisplays();
            App.toggleGameplayControls(false);
            despawnAllPets();
            addInteraction(def);
            Missions.done(Missions.TYPES.online_interact);
            Activities.invitePlaydate(def, App.scene.online_hub, () => {
                App.displayConfirm(`Do you want to add ${def.getCSprite()} ${def.name} to your friends list?`, [
                    {
                        name: 'yes',
                        onclick: () => {
                            App.closeAllDisplays();
                            const addedFriend = App.petDefinition.addFriend(def, 1);
                            if (addedFriend) {
                                App.displayPopup(`${def.getCSprite()} ${def.name} has been added to the friends list!`, 3000);
                                addInteraction(def);
                            } else {
                                App.displayPopup(`You are already friends with ${def.name}`, 3000);
                            }
                            return false;
                        }
                    },
                    {
                        name: 'no',
                        class: 'back-btn',
                        onclick: () => { }
                    },
                ])
                setTimeout(() => Activities.goToOnlineHub());
            })
        }
        const handleDate = (def) => {
            return App.displayConfirm(`Do you want to go on a date with <div>${def.getCSprite()} ${def.name}</div>?`, [
                {
                    name: 'yes',
                    onclick: () => {
                        despawnAllPets();
                        addInteraction(def);
                        Activities.goOnDate(def, Activities.goToOnlineHub);
                    }
                },
                {
                    name: 'cancel',
                    class: 'back-btn',
                    onclick: () => {}
                }
            ])
        }
        const handleInteract = () => {
            const petInteractions = otherPlayersPets.map(pet => {
                const def = pet.petDefinition;
                return {
                    name: `${def.getCSprite()} ${def.name}`,
                    onclick: () => {
                        return App.displayList([
                            {
                                name: `
                                <div style="
                                    display: flex;
                                    justify-content: space-between;
                                    flex-wrap: wrap;
                                    align-items: center;
                                ">
                                    <div>
                                        <i class="fa-solid fa-user-circle"></i> ${def.owner}
                                    </div>
                                    <div>
                                        <i class="fa-solid fa-thumbs-up"></i> ${def.interactions}
                                    </div>
                                </div>
                                `,
                                type: 'text',
                                solid: true,
                            },
                            {
                                name: 'hang out',
                                onclick: () => handleHangout(def)
                            },
                            {
                                _disable: App.petDefinition.lifeStage < PetDefinition.LIFE_STAGE.adult || def.lifeStage < PetDefinition.LIFE_STAGE.adult,
                                name: `go on date`,
                                onclick: () => handleDate(def)
                            },
                        ])
                    }
                }
            })
            return App.displayList([
                ...petInteractions,
                {
                    name: `
                        Every time you interact with another pet you'll receive
                        <i class="fa-solid fa-thumbs-up"></i> ${INTERACTION_LIKES.receiving}
                        and they'll receive
                        <i class="fa-solid fa-thumbs-up"></i> ${INTERACTION_LIKES.outgoing}
                    `,
                    type: 'info',
                },
            ])
        }
        const handleUploadCharacter = () => {
            return App.displayConfirm(`Do you want to upload ${App.petDefinition.name} to HUBCHI so that other players can see and interact with them?`, [
                {
                    name: 'yes',
                    onclick: async () => {
                        const popup = App.displayPopup('Uploading...', App.INF);
                        const {status} = await App.apiService.addPetDef();
                        popup.close();
                        App.closeAllDisplays();
                        hasUploadedPetDef.status = status;
                        App.displayPopup('Success!');
                    }
                },
                {
                    name: 'no',
                    class: 'back-btn',
                    onclick: () => {}
                },
            ])
        }
        const handleSyncCharacter = () => {
            return App.displayPopup('Syncing is now done automatically when entering Hubchi, this option will be removed later.', 4000);

            const confirm = App.displayConfirm(`Do you want to update your HUBCHI persona to be in sync with ${App.petDefinition.name}'s latest appearance?`, [
                {
                    name: 'yes',
                    onclick: async () => {
                        // confirm.close();
                        // const popup = App.displayPopup('Syncing...', App.INF);
                        // const {status} = await App.apiService.addPetDef();
                        // popup.close();
                        // App.displayPopup(status ? 'Success!' : 'Error!');
                        return false;
                    }
                },
                {
                    name: 'no',
                    class: 'back-btn',
                    onclick: () => {}
                },
            ])
            return true;
        }
        const handleReturnHome = () => {
            return App.displayConfirm(`Are you sure you want to return home?`, [
                {
                    name: 'yes',
                    onclick: async () => {
                        App.closeAllDisplays();
                        otherPlayersPets.forEach(p => p?.removeObject?.());
                        Activities.onlineHubTransition((fadeOverlay) => {
                            App.setScene(App.scene.home);
                            fadeOverlay.direction = false;
                            setTimeout(() => {
                                App.pet.playCheeringAnimation(() => App.toggleGameplayControls(true));
                            }, 500);
                        });
                    }
                },
                {
                    name: 'no',
                    class: 'back-btn',
                    onclick: () => {}
                },
            ])
        }
        const handleFriendSearch = () => App.handlers.open_hubchi_search((def) => addInteraction(def, true));

        const handleRewardStore = () => {
            const showItem = (image, name, description, unlockLikesReq, unlockKey) => {
                const isUnlocked = App.getRecord(unlockKey);
                const confirm = App.displayConfirm(
                    `
                        <img style="max-width: 128px" src="${image}"></img>
                        <br>
                        <b>${name}</b>
                        <br>
                        <span>${description}</span>
                    `,
                    [
                        {
                            _disable: isUnlocked,
                            // name: !isUnlocked ? 'unlock' : 'reward collected',
                            name: !isUnlocked ? `unlock <div style="margin-left: auto"><i class="fa-solid fa-thumbs-up"></i> ${unlockLikesReq} </div>` : 'reward collected',
                            onclick: unlockKey
                            ? () => {
                                if((App.temp.online?.hasUploadedPetDef?.interactions || 0) < unlockLikesReq){
                                    return App.displayPopup(`You don't have enough interactions to unlock ${name}.`)
                                }
                                App.addRecord(unlockKey, 1, true);
                                App.displayPopup(`<b>${name}</b> unlocked!`)
                                App.sendAnalytics('unlocked_hubchi_reward_item', name);
                            } : undefined
                        },
                        {
                            name: 'close',
                            class: 'back-btn',
                            onclick: () => {}
                        }
                    ]
                )
                return confirm;
            }

            const createEntryButton = (icon, name, item, onClick) => {
                return {
                    name: `<img class="icon" src="${icon}"></img> ${name} ${item.isNew ? App.getBadge('new!') : ''}`,
                    onclick: onClick,
                    isNew: item.isNew,
                }
            }

            // const accessories = App.definitions.accessories.filter(e => e.onlineShopAccessible);
            const accessories = Object.keys(App.definitions.accessories)
                .filter(e =>
                    App.definitions.accessories[e].onlineShopAccessible
                )
                .map(name => {
                    const item = App.definitions.accessories[name];
                    const icon = item.icon || item.image;
                    return createEntryButton(icon, name, item, () => showItem(icon, name, 'accessory', item.unlockLikes, item.unlockKey))
                })

            const backgrounds = Object.keys(App.definitions.room_background)
                .filter(e =>
                    App.definitions.room_background[e].onlineShopAccessible
                )
                .map(name => {
                    const item = App.definitions.room_background[name];
                    const icon = item.image;
                    return createEntryButton(icon, name, item, () => showItem(icon, name, 'background', item.unlockLikes, item.unlockKey))
                })

            const shells = Object.keys(App.definitions.shell_background)
                .filter(e =>
                    App.definitions.shell_background[e].onlineShopAccessible
                )
                .map(key => {
                    const item = App.definitions.shell_background[key];
                    const icon = item.image;
                    return createEntryButton(icon, item.name, item, () => showItem(icon, item.name, 'shell design', item.unlockLikes, item.unlockKey))
                })

            const finalList = [
                ...accessories,
                ...backgrounds,
                ...shells,
            ].sort((a, b) => b.isNew - a.isNew);

            return App.displayList(finalList)
        }

        App.toggleGameplayControls(false, () => {
            if(!hasUploadedPetDef.status){
                return App.displayList([
                    {
                        type: 'text',
                        name: `
                            Upload your character to get access to hubchi!
                        `,
                    },
                    {
                        name: 'Upload character',
                        onclick: handleUploadCharacter
                    },
                    {
                        name: '<i class="icon fa-solid fa-home"></i> return home',
                        onclick: handleReturnHome
                    },
                    {
                        name: `Hubchi is an online hub for players to interact with each other and win rewards!`,
                        type: 'info'
                    },
                ])
            }

            return App.displayList([
                {
                    type: 'text',
                    solid: true,
                    name: `
                        <div style="
                            display: flex;
                            justify-content: space-between;
                            flex-wrap: wrap;
                            align-items: center;
                            width: 100%;
                        ">
                            <div style="
                                display: flex;
                                align-items: center;
                            ">
                                ${App.petDefinition.getCSprite()} You
                            </div>
                            <div>
                                <i class="icon fa-solid fa-thumbs-up"></i> ${hasUploadedPetDef.interactions ?? 0}
                            </div>
                        </div>
                    `,
                },
                {
                    name: 'interact',
                    onclick: handleInteract
                },
                {
                    _ignore: true,
                    name: 'sync character',
                    onclick: handleSyncCharacter,
                },
                {
                    name: `rewards store`,
                    onclick: handleRewardStore,
                },
                {
                    name: `add friend`,
                    onclick: handleFriendSearch,
                },
                {
                    name: '<i class="icon fa-solid fa-home"></i> return home',
                    class: 'back-btn',
                    onclick: handleReturnHome
                },
            ])
        })
    }
    static encounter(spawnInMiddle){
        const despawnTime = App.time + (App.constants.ONE_SECOND * random(15, 30));
        const def = new PetDefinition({
            sprite: NPC_CHARACTERS[0],
            name: '-_-',
            accessories: App.pet.stats.is_revived_once ? ['demon wings'] : [],
        }).setStats({
            current_hunger: 0,
            current_health: 0,
            current_fun: 0,
            current_death_tick: 0,
            speed: 0.1,
            wander_min: 0.1,
            wander_max: 0.11
        })
        new Pet(def, {
            opacity: 0.5,
            x: spawnInMiddle ? '50%' : -50,
            castShadow: false,
            z: App.constants.ACTIVE_PET_Z + 1,
            isDespawning: false,
            parent: App.currentSceneObject,
            onDraw: (me) => {
                if(me.isDespawning){
                    me.opacity -= 0.001 * App.deltaTime;
                    if(me.opacity < 0) me.removeObject()
                }

                if(App.pet.stats.is_revived_once){
                    me.isDespawning = App.time > despawnTime;
                    return;
                }

                me.isDespawning = !App.pet.stats.is_sleeping;
            }
        });
        return true;
    }
    static goToVacation(vacationFn){
        App.closeAllDisplays();
        App.toggleGameplayControls(false);
        App.pet.stopMove();
        App.pet.triggerScriptedState('idle', App.INF, 0, true, null);
        Activities.task_foam(
            () => {
                vacationFn();
            },
        )
    }
    static seaVacation(){
        App.pet.stats.is_at_vacation = true;
        App.setScene(App.scene.seaVacation);

        const backgroundMusic = App.playAdvancedSound({
            loop: true,
            src: 'resources/sounds/vacation_track_01.ogg'
        });

        const end = () => {
            App.toggleGameplayControls(false);
            backgroundMusic.stop();
            Activities.task_foam(() => {
                App.toggleGameplayControls(true);
                App.pet.stats.is_at_vacation = false;
                App.pet.stopScriptedState();
                App.setScene(App.scene.home);
                App.pet.playCheeringAnimation();
                App.save();
            })

            // feed all animals before ending
            App.animals?.list?.forEach(a => {
                a.feed?.(100);
                a.lastStatsUpdate = Date.now();
            });
        }

        App.pet.triggerScriptedState('idle', App.INF, 0, true, null,
            Pet.scriptedEventDrivers.playingWithItem.bind({pet: App.pet})
        );

        setTimeout(() => {
            App.pet.x = '65%';
            App.pet.y = '67%';
            App.pet.stopMove();
        })

        App.toggleGameplayControls(false, () => {
            App.displayConfirm(`Are you sure you want to end ${App.petDefinition.name}'s vacation?`, [
                {
                    name: 'yes',
                    onclick: end
                },
                {
                    name: 'no',
                    class: 'back-btn',
                    onclick: () => { }
                }
            ])
        });
    }
    static async cookingGame({
        stirringSpeed = 0.001,
        skipCamera,
        resultFoodName,
        resultFoodAmount,
        ingredientObjects,
    } = {}){
        App.closeAllDisplays();
        App.pet.triggerScriptedState('idle', App.INF, 0, false);
        App.sendAnalytics('cooking_game', resultFoodName || '');
        Missions.done(Missions.TYPES.cook);
        App.pet.stats.current_expression += 1.5;
        // App.setScene(App.scene.kitchen);

        const potObject = new Object2d({
            img: 'resources/img/misc/cooking_pot_p01.png',
            z: 30, x: 0, y: 0,
        });
        const potInsideObject = new Object2d({
            img: 'resources/img/misc/cooking_pot_p02.png',
            z: 30.1, x: 0, y: 0, clipCircle: true, parent: potObject,
            onDraw: (me) => {
                Object2d.animations.rotateAround(me, stirringSpeed * 50);
            }
        });
        const potTopObject = new Object2d({
            img: 'resources/img/misc/cooking_pot_p03.png',
            z: 31, x: 0, y: 0, parent: potObject,
        });

        const starLogicHandler = (me) => {
            if(!me._originX) me._originX = me.config.drawer.getRelativePositionX(50 - 11);
            if(!me._originY) me._originY = me.config.drawer.getRelativePositionY(50 - 11);
            if(me._current === undefined || me._current == Math.PI) me._current = 0;

            me._current += stirringSpeed * App.deltaTime;

            Object2d.animations.circleAround(me, 20, me._current, me._originX, me._originY);
            Object2d.animations.pulseScale(me, 0.01, Math.min(Math.abs(stirringSpeed) * 10, 0.03));
        }

        const starObjects = [];
        for(let i = 0; i < 3; i++){
            let img;

            if(ingredientObjects && ingredientObjects[i]) {
                img = ingredientObjects[i];
            } else {
                img = new Object2d({
                    img: 'resources/img/misc/star_01.png',
                })
            }
            img.width = 22;
            img.height = 22;
            img.y = '50%';
            img.x = '50%';
            img.z = 30.5;
            img.clipCircle = true;
            img._current = 2.0944 * i;
            img.pulseScaleFloat = i;
            img.onDraw = starLogicHandler;
            img.parent = potObject;

            starObjects.push(img);
        }

        let failChance = resultFoodName ? 0 : 25;
        let currentTargetImgIndex = 0;
        App.toggleGameplayControls(false, () => {
            if(currentTargetImgIndex < starObjects.length && !skipCamera){
                App.useWebcam((imgData) => {
                    if((!imgData || imgData == -1)){
                        imgData = 'resources/img/misc/exclam_01.png';
                        failChance += 25;
                    }
                    starObjects[currentTargetImgIndex].setImg(imgData);
                    currentTargetImgIndex++;
                    stirringSpeed += 0.001;
                });
            } else {
                stirringSpeed += 0.001;
                if(stirringSpeed > 0.02){
                    const failed = random(0, 100) < failChance;
                    App.toggleGameplayControls(false);
                    stirringSpeed = -100;
                    let randomFoodName, backgroundObject;
                    Activities.task_foam(
                        () => { // mid
                            potObject.removeObject();
                            backgroundObject = new Object2d({
                                img: 'resources/img/misc/light_rays_01.png',
                                width: 144, height: 144,
                                x: '50%', y: '50%', z: 30,
                                onDraw: (me) => {
                                    Object2d.animations.rotateAround(me);
                                }
                            })
                            randomFoodName = resultFoodName || randomFromArray(Object.keys(App.definitions.food));
                            const randomFood = App.definitions.food[randomFoodName];
                            App.constants.FOOD_SPRITESHEET_DIMENSIONS.cellNumber = randomFood.sprite;
                            if(!failed){
                                setTimeout(() => App.playSound('resources/sounds/task_complete_02.ogg', true), 1000);
                                new Object2d({
                                    img: App.constants.FOOD_SPRITESHEET,
                                    spritesheet: App.constants.FOOD_SPRITESHEET_DIMENSIONS,
                                    x: '50%', y: '50%', z: 31, parent: backgroundObject,
                                    onDraw: (me) => {
                                        Object2d.animations.pulseScale(me, 0.01, 0.01);
                                    }
                                })
                            } else {
                                new Object2d({
                                    img: 'resources/img/misc/exclam_01.png',
                                    width: 32, height: 32,
                                    x: '50%', y: '50%', z: 31, parent: backgroundObject, clipCircle: true,
                                    onDraw: (me) => {
                                        Object2d.animations.pulseScale(me, 0.01, 0.01);
                                    }
                                })
                            }
                        },
                        () => { // end
                            setTimeout(() => {
                                function end(){
                                    backgroundObject.removeObject();
                                    App.toggleGameplayControls(true);
                                    App.pet.stopScriptedState();
                                    App.pet.x = '50%';
                                }
                                if(!failed){
                                    let amount = Number(resultFoodName ? resultFoodAmount || random(1, 3) : 1);
                                    if(resultFoodName && random(1, 4) === 1) {
                                        amount += random(0, 2);
                                    }
                                    if(App.petDefinition.hasTrait('naturalChef')) amount *= 2;
                                    App.displayPopup(`${App.petDefinition.name} <br>made x${amount}<br> <b>${randomFoodName}</b>!`, 3000, () => {
                                        end();
                                        App.pet.playCheeringAnimation();
                                        App.pet.stats.current_fun += random(10, 25);
                                        App.addNumToObject(App.pet.inventory.food, randomFoodName, amount);
                                        if(skipCamera) App.definitions.achievements.harvest_cook_x_times.advance();
                                        else App.definitions.achievements.camera_cook_x_times.advance();
                                    });
                                } else {
                                    App.displayPopup(`${App.petDefinition.name} <br>failed to make anything edible!<br>`, 3000, () => {
                                        end();
                                        App.pet.stats.current_fun -= random(5, 15);
                                        App.pet.playUncomfortableAnimation();
                                    });
                                }
                            }, 2000);
                        }
                    );
                }
            }
        });

    }
    // activities
    static async getDressed(middleFn, onEndFn, cheer){
        App.closeAllDisplays();
        App.toggleGameplayControls(false);

        let curtainTargetElevation = 16, step = 0;
        const curtainObject = new Object2d({
            img: 'resources/img/misc/dresser_curtain_01.png',
            x: 0, y: -100, z: 9,
            onDraw: (curtain) => {
                // curtain.y = lerp(curtain.y, curtainTargetElevation, 0.001 * App.deltaTime);
                curtain.targetY = curtainTargetElevation;
                curtain.moveToTarget(0.03);
                Object2d.animations.bob(curtain, 0.01, 1);
            }
        })

        App.pet.stopMove();
        App.pet.x = '50%';
        await App.pet.triggerScriptedState('idle', 4000, 0, true);
        if(middleFn) middleFn();
        curtainTargetElevation = -100;
        await App.pet.triggerScriptedState('idle', 2000, 0, true);
        curtainObject.removeObject();
        App.pet.playCheeringAnimationIfTrue(cheer, () => {
            App.pet.stats.current_expression += 2;
            App.toggleGameplayControls(true);
            if(onEndFn) onEndFn();
        });
    }
    static async pet(engageTimer){
        App.sendAnalytics('petting');
        const initialZ = App.pet.z;
        App.pet.stopMove();
        App.pet.x = '50%';
        App.pet.targetY = 132;
        App.pet.z = App.constants.ACTIVE_PET_Z + 5;
        App.pet.shadowOffset = 999;
        App.toggleGameplayControls(false);
        App.canProceed('ask_to_be_petted', 0); // trigger autonomous asking cooldown
        await App.pet.triggerScriptedState('cheering', 1000, null, true);
        App.pet.scale = 2;
        App.pet.targetY = 50;
        await App.pet.triggerScriptedState('cheering', 1000, null, true);
        App.pet.scale = 3;
        App.pet.targetY = 60;
        App.pet.stats.current_discipline += random(1, 2);
        App.toggleGameplayControls(false, () => {}, false);
        let lastPosition = '', lastPetTime = engageTimer ? App.time + engageTimer : -1;
        let patCount = 0;
        await App.pet.triggerScriptedState('idle', App.INF, null, true, () => {
            App.reloadScene();
            App.pet.shadowOffset = 0;
            App.pet.scale = 1;
            App.pet.z = initialZ;
            App.pet.playCheeringAnimationIfTrue(patCount);
            App.toggleGameplayControls(true);
            App.pet.stats.current_expression += 1;
            App.pet.stats.current_endurance += 1;
            App.pet.stats.current_logic += 1;
        }, () => {
            const currentPosition = `${App.mouse.x}_${App.mouse.y}`;
            const isPetting = App.mouse.isInBounds && App.mouse.isDown && currentPosition !== lastPosition;
            lastPosition = currentPosition;

            if(isPetting){
                App.pet.setState(isPetting ? 'blush' : 'idle');
                lastPetTime = App.time;
            }

            if(lastPetTime > 0 && App.time - lastPetTime > App.constants.ONE_SECOND * 4) {
                App.pet.stopScriptedState();
                return;
            }

            if(App.canProceed('petting_react_cool_down', 300)){
                App.pet.setState(isPetting ? 'blush' : 'idle');
                if(isPetting){
                    App.playSound('resources/sounds/ui_click_05.ogg', true);
                    Activities.task_floatingHearts();

                    App.pet.stats.current_fun += random(1, 4) * 0.07;
                    App.definitions.achievements.pat_x_times.advance();
                    Missions.done(Missions.TYPES.pat);

                    patCount++;
                }
            }
        });
    }
    static standWork(){
        App.closeAllDisplays();
        App.setScene(App.scene.stand);
        App.definitions.achievements.work_x_times.advance();

        const backgroundMusic = App.playAdvancedSound({
            loop: true,
            src: 'resources/sounds/work_track_01.ogg',
            volume: 0.5,
        });

        const standObject = new Object2d({
            img: 'resources/img/misc/stand_01_booth.png',
            x: 0, y: 0, z: 19,
            parent: App.currentSceneObject,
            onRemove: () => {
                setTimeout(() => backgroundMusic.stop());
            }
        })

        function spawnCustomer() {
            const standDuration = random(2000, 5000);

            const badAnimations = ['angry'];
            const midAnimations = ['uncomfortable', 'shocked'];
            const goodAnimations = ['eating', 'cheering'];

            let possibleAnimations = [...goodAnimations, ...midAnimations, ...badAnimations];

            const negativeMoodlets = App.pet.hasMoodlet('hungry') + App.pet.hasMoodlet('bored') + App.pet.hasMoodlet('sick') + App.pet.hasMoodlet('sleepy');
            if(negativeMoodlets && negativeMoodlets <= 2) possibleAnimations = [...midAnimations, ...goodAnimations];
            else if(negativeMoodlets && negativeMoodlets <= 4) possibleAnimations = [...badAnimations, ...midAnimations];
            else possibleAnimations = [...goodAnimations];

            const currentAnimation = randomFromArray(possibleAnimations);

            let otherPet = new Pet(App.getRandomPetDef(random(1, 2)));
                otherPet.stopMove();
                otherPet.x = -32;
                otherPet.y = '100%';
                otherPet.z = 20;
                otherPet.inverted = true;
                otherPet.targetX = 8;
                otherPet.parent = standObject;
                App.pet.setState('idle_side');
                otherPet.triggerScriptedState('moving', 4000, 0, true, () => {
                    otherPet.stopMove();
                    otherPet.x = 8;
                    App.pet.setState('eating');
                    otherPet.triggerScriptedState(currentAnimation, standDuration, 0, true, () => {
                        otherPet.targetX = -100;
                        App.pet.setState('idle');
                        App.playSound('resources/sounds/task_complete.ogg', true);
                        otherPet.triggerScriptedState('moving', 5000, 0, true, () => {
                            otherPet.removeObject();
                        })

                    })
                })

            return otherPet;
        }

        App.pet.stopMove();
        App.pet.x = '68%';
        App.pet.y = '70%';
        App.pet.inverted = false;
        let nextCustomerSpawnTime = Date.now() + random(0, 8000);
        App.pet.triggerScriptedState('idle', App.INF, 0, true, null, () => {
            if(Date.now() > nextCustomerSpawnTime){
                nextCustomerSpawnTime = Date.now() + random(8000, 45000);
                spawnCustomer();
            }
        });
    }
    static battle(otherPetDef){
        App.setScene(App.scene.battle);

        if(!otherPetDef) otherPetDef = App.getRandomPetDef(App.petDefinition.lifeStage);

        let otherPet = new Pet(otherPetDef);
            otherPet.stopMove();
            otherPet.x = '75%';
            otherPet.y = '40%';
            otherPet.inverted = false;
            otherPet.triggerScriptedState('battle', App.INF, 0, true, () => {
                otherPet.removeObject();
            }, () => {
                Object2d.animations.bob(otherPet, 0.01, 0.1)
            })

        App.pet.stopMove();
        App.pet.x = '25%';
        App.pet.y = '90%';
        App.pet.inverted = true;
        App.pet.triggerScriptedState('battle', App.INF, 0, true, () => {
            // end
        }, () => {
            Object2d.animations.bob(App.pet, 0.01, 0.12)
        })

        App.toggleGameplayControls(false, () => {

        })
    }
    static playEggUfoAnimation(callback){
        if(!App.pet.eggObject) return;

        App.toggleGameplayControls(false);

        const egg = App.pet.eggObject;
        egg.opacity = 0;
        egg.positionOffset.y = -120;

        window.egg = egg;

        App.playSound('resources/sounds/cute.ogg', true);
        setTimeout(() => App.playSound('resources/sounds/cute.ogg', true), 200);

        new Object2d({
            image: App.preloadedResources['resources/img/misc/ufo_01.png'],
            y: 0,
            x: 0,
            opacity: 0,
            targetOpacity: 1,
            onDraw: (me) => {
                egg.positionOffset.y = clamp(egg.positionOffset.y + 0.055 * App.deltaTime, -100, 0);
                if(egg.positionOffset.y > -70) egg.opacity = clamp(egg.opacity + 0.002 * App.deltaTime, 0, 1);

                if(egg.positionOffset.y >= 0 && me.targetOpacity !== 0){
                    App.playSound('resources/sounds/task_complete.ogg', true);
                    me.targetOpacity = 0;
                    setTimeout(() => {
                        App.toggleGameplayControls(true);
                        if(callback) callback();
                        me.removeObject();
                    }, 1000);
                }

                me.opacity = lerp(me.opacity, me.targetOpacity, 0.004 * App.deltaTime);
            }
        });
    }
    static stayAtParents(end){
        App.sendAnalytics('stay_at_parents');

        if(end){
            App.toggleGameplayControls(true);
            App.setScene(App.scene.home);
            App.pet.playCheeringAnimation();
            App.pet.stats.is_at_parents = false;
            App.pet.stats.current_discipline += random(0, 2);
            return;
        }

        App.toggleGameplayControls(false, () => {
            App.displayConfirm(`Pickup ${App.petDefinition.name} from their parents house?`, [
                {
                    name: 'yes',
                    onclick: () => {
                        Activities.stayAtParents(true); // ending
                    }
                },
                {
                    name: 'no',
                    class: 'back-btn',
                    onclick: () => { }
                }
            ])
        });

        App.setScene(App.scene.parentsHome);

        App.pet.stats.is_at_parents = true;
    }
    static goToClinic(onEndFn){
        App.toggleGameplayControls(false);
        Missions.done(Missions.TYPES.visit_doctor);

        const task_visit_doctor = async () => {
            App.setScene(App.scene.hospitalInterior);

            const doctorPetDef = new PetDefinition({
                sprite: 'resources/img/character/doctor_01.png',
            });

            const main = new TimelineDirector(App.pet);
            const other = new TimelineDirector(new Pet(doctorPetDef, {staticShadow: false}));

            main.setPosition({x: '-10%'});
            other.setPosition({x: '80%'});
            other.lookAt(true);

            await main.moveTo({x: '20%', speed: 0.01});

            other.bob({maxCycles: 1, animation: 'idle', landAnimation: 'idle'});
            other.actor.say('Hi!', 1000);
            await TimelineDirector.wait(1000);
            other.actor.say("Let's see...", 2000);
            await TimelineDirector.wait(2000);

            App.fadeScreen({
                middleFn: async () => {
                    main.setPosition({x: '30%'});
                    await main.moveTo({x: '20%', speed: 0.0075});
                    main.lookAt(true);

                    await TimelineDirector.wait(1000);

                    const health = App.pet.stats.current_health;

                    let state = 'very healthy';
                    if(health <= App.pet.stats.max_health * 0.20) state = 'very sick';
                    else if(health <= App.pet.stats.max_health * 0.45) state = 'sick';
                    else if(health <= App.pet.stats.max_health * 0.75) state = 'healthy'

                    const onEnd = () => {
                        main.release();
                        other.remove();

                        App.setScene(App.scene.home);
                        App.toggleGameplayControls(true);
                        App.pet.stats.current_endurance += 0.23;

                        onEndFn?.();
                    }

                    const isSick = ['very sick', 'sick'].includes(state);

                    other.actor.say(`You are...`, 2000);
                    await TimelineDirector.wait(2000);

                    main.setState(isSick ? 'shocked' : 'cheering_with_icon');
                    if(!isSick){
                        App.playSound('resources/sounds/cheer_success.ogg', true);
                    }

                    other.actor.say(`${state}!`, 3000);
                    await TimelineDirector.wait(3000);
                    main.setState(isSick ? 'idle_uncomfortable' : 'idle');
                    await TimelineDirector.wait(1000);

                    if(isSick){
                        other.actor.say('Buy some medicine from the market...', 3500);
                        await TimelineDirector.wait(3500);
                        other.actor.say('And drink it immediately!', 2000);
                        await TimelineDirector.wait(3000);
                    }

                    App.fadeScreen({
                        middleFn: onEnd
                    })
                }
            })
        }

        function task_goto_hospital(){
            App.setScene(App.scene.hospitalExterior);
            App.pet.stopMove();
            App.pet.x = '50%';
            App.pet.y = 130;
            App.pet.targetY = 80;
            App.pet.triggerScriptedState('moving', 2500, 0, true, () => {
                App.pet.stopMove();
                task_visit_doctor();
            })
        }

        task_visit_doctor();
    }
    static brushTeeth(){
        App.closeAllDisplays();
        App.setScene(App.scene.bathroom);

        let brushSpeed = 0, brushFloat = 0, brushTimes = 0;

        const brushObject = new Object2d({
            img: 'resources/img/misc/toothbrush_01.png',
            x: '50%',
            y: '83%',
            width: 24, height: 24,
            z: App.constants.ACTIVE_PET_Z + 1,
            onLateDraw: (me) => {
                if(!me._origin){
                    me._origin = {
                        x: me.x,
                        y: me.y + (App.pet.spritesheet.offsetY || 0)
                    };
                }

                brushSpeed = clamp(lerp(brushSpeed, 0, App.deltaTime * 0.0008), 0, 1.7);
                brushFloat += brushSpeed * App.deltaTime * 0.01;

                if(brushFloat > App.PI2){
                    brushFloat = 0;
                    brushTimes += 1;
                    new Object2d({
                        img: 'resources/img/misc/foam_single.png',
                        x: `${random(45, 55)}%`,
                        y: me._origin.y,
                        opacity: 1,
                        scale: randomFromArray([0.4, 0.5]),
                        rotation: random(0, 180),
                        z: App.constants.ACTIVE_PET_Z + 2,
                        parent: brushObject,
                        onDraw: (me) => {
                            Object2d.animations.flip(me);
                            if(me.opacity <= 0) me.removeObject();
                        }
                    })

                    if(brushTimes >= 8) {
                        App.pet.stopScriptedState();
                    }
                }

                Object2d.animations.circleAround(me, 2, brushFloat, me._origin.x, me._origin.y);
            }
        })

        App.pet.stopMove();
        App.pet.x = '50%';
        App.pet.triggerScriptedState('open_mouth', App.INF, 0, true, async () => {
            App.pet.stats.current_cleanliness += 20;
            App.pet.stats.current_discipline += random(1, 3);
            App.pet.stats.current_health += random(5, 25);
            App.pet.stats.has_toothache = false;
            App.toggleGameplayControls(false);
            brushObject.removeObject();
            App.save();
            App.pet.playCheeringAnimation(() => {
                App.setScene(App.scene.home);
                App.toggleGameplayControls(true);
            });
        });

        App.toggleGameplayControls(false, () => {
            brushSpeed += 0.5;
            App.playSound(`resources/sounds/ui_click_05.ogg`, true);
        })
    }
    static bathe(){
        App.closeAllDisplays();
        App.setScene(App.scene.bathroom);

        if(App.pet.stats.is_misbehaving){
            App.toggleGameplayControls(false);
            App.pet.playRefuseAnimation(() => {
                App.setScene(App.scene.home);
                App.toggleGameplayControls(true);
            });
            return;
        }

        Missions.done(Missions.TYPES.use_bath);
        let foams = [];
        App.toggleGameplayControls(false, () => {
            App.pet.inverted = !App.pet.inverted;
            let flipTime = random(200, 300);

            let foamSpeed = random(5, 13) * 0.001;
            let foamStr = random(1, 4) * 0.1;
            let foam = new Object2d({
                img: 'resources/img/misc/foam_single.png',
                x: 50 + random(-15, 15) + Math.random(),
                y: 42 + random(-2, 2) + Math.random(),
                z: 20,
                onDraw: (me) => {
                    Object2d.animations.flip(me, flipTime);
                    Object2d.animations.bob(me, foamSpeed, foamStr);
                    Object2d.animations.pulseScale(me, foamSpeed, 0.01);
                }
            })
            foams.push(foam);

            if(foams.length >= 10){
                foams.forEach(f => f.removeObject());
                App.toggleGameplayControls(false);
                App.pet.stopScriptedState();
            }

            App.pet.stats.current_cleanliness += 25;
            App.pet.stats.current_discipline += random(0, 2);
            App.playSound(`resources/sounds/ui_click_05.ogg`, true);
        });

        const bathClippedObject = new Object2d({
            img: App.scene.bathroom.image,
            x: 0, y: 0, z: 19,
            clip: [
                [38, 51],
                [38, 68],
                [81, 68],
                [81, 51],
            ]
        })

        App.pet.stopMove();
        App.pet.x = '64%';
        App.pet.y = '64%';
        App.pet.triggerScriptedState('idle', App.INF, 0, true, () => {
            App.pet.x = '50%';
            App.pet.y = '100%';
            bathClippedObject.removeObject();
            App.pet.playCheeringAnimation(() => {
                App.setScene(App.scene.home);
                App.toggleGameplayControls(true);
            });
        });
    }
    static poop(force){
        App.closeAllDisplays();
        App.setScene(App.scene.bathroom);
        App.toggleGameplayControls(false);

        if(!force && App.pet.stats.current_bladder > App.pet.stats.max_bladder / 2){ // more than half
            App.pet.playRefuseAnimation(() => {
                App.setScene(App.scene.home);
                App.toggleGameplayControls(true);
            });
            return;
        }

        Missions.done(Missions.TYPES.use_toilet);
        App.definitions.achievements.use_toilet_x_times.advance();

        App.pet.needsToiletOverlay.hidden = false;
        App.pet.stats.current_bladder = App.pet.stats.max_bladder;
        App.pet.stats.current_logic += 2;
        App.pet.stats.current_discipline += random(2, 10);
        if(App.petDefinition.lifeStage <= PetDefinition.LIFE_STAGE.child && !force) {
            // make pet potty trained if used toilet more than 2 to 5 times and is baby/child
            if(++App.pet.stats.used_toilet > random(2, 5)){
                App.pet.stats.is_potty_trained = true;
            }
        }
        App.pet.stopMove();
        App.pet.x = '21%';
        App.pet.y = '85%';
        App.pet.inverted = true;
        App.pet.triggerScriptedState('sitting', 5000, 0, true, () => {
            App.pet.x = '50%';
            App.pet.y = '100%';
            App.pet.playCheeringAnimation(() => {
                App.setScene(App.scene.home);
                App.toggleGameplayControls(true);
            });
        });
    }
    static wedding(otherPetDef = App.getRandomPetDef()){
        App.closeAllDisplays();
        App.setScene(App.scene.wedding);
        App.toggleGameplayControls(false);
        App.petDefinition.maxStats();

        App.definitions.achievements.marry_x_times.advance();

        const otherPet = new Pet(otherPetDef);

        try {
            App.sendAnalytics('wedding', JSON.stringify({
                a: App.petDefinition.sprite,
                b: otherPetDef.sprite
            }));
        } catch(e) {}

        const heartParticleSpawner = setInterval(() => Activities.task_floatingHearts(), 500);
        const heartSpawner = setInterval(() => {
            new Object2d({
                img: 'resources/img/misc/wedding_heart_01.png',
                x: 0, y: 0, scale: 0, opacity: 0.95,
                composite: 'color-burn',
                onDraw: (me) => {
                    me.scale += 0.00115 * App.deltaTime;
                    me.opacity -= 0.0005 * App.deltaTime;
                    if(me.opacity <= 0) me.removeObject();
                }
            })
        }, 1000);

        App.pet.stopMove();
        otherPet.stopMove();

        otherPet.x = '33%';
        App.pet.x = '67%';

        App.pet.y = 0;
        otherPet.y = 0;

        App.pet.targetY = 56;
        otherPet.targetY = 56;

        otherPet.inverted = true;
        App.pet.inverted = false;

        otherPet.triggerScriptedState('blush', App.INF, 0, true);
        App.pet.triggerScriptedState('blush', App.INF, 0, true);

        setTimeout(() => {
            App.playSound('resources/sounds/wedding_song_01.ogg', true);
        })

        setTimeout(() => {
            otherPet.triggerScriptedState('idle_side', App.INF, 0, true);
            App.pet.triggerScriptedState('idle_side', App.INF, 0, true);
        }, 8000);

        setTimeout(() => {
            otherPet.triggerScriptedState('kissing', App.INF, 0, true);
            App.pet.triggerScriptedState('kissing', App.INF, 0, true);
        }, 12380);

        setTimeout(() => {
            Activities.task_foam(() => {
                App.pet.removeObject();
                otherPet.removeObject();

                let parentA = App.petDefinition,
                    parentB = otherPetDef;

                App.petDefinition = App.getPetDefFromParents(parentA, parentB);

                App.pet.stopMove();

                App.setScene(App.scene.home);

                App.pet = App.createActivePet(App.petDefinition);

                clearInterval(heartParticleSpawner);
                clearInterval(heartSpawner);
            }, () => {
                App.toggleGameplayControls(true);

                App.handlers.show_set_pet_name_dialog();
            })
        }, 18000);
    }
    static dbg_randomMarriage(){
        App.pet.removeObject();

        let parentA = App.petDefinition;
        const parentAFamily = parentA.family;
        parentA = App.getRandomPetDef(2);
        parentA.family = parentAFamily;

        App.petDefinition = App.getPetDefFromParents(parentA, App.getRandomPetDef(2));

        App.pet.stopMove();

        App.setScene(App.scene.home);

        App.pet = App.createActivePet(App.petDefinition);
        App.pet.stats.is_egg = false;
    }
    static birthday(){
        App.closeAllDisplays();
        App.setScene(App.scene.home);
        App.toggleGameplayControls(false);
        App.pet.stats.has_poop_out = false;
        App.pet.stats.current_bladder = 100;
        App.definitions.achievements.birthday_x_times.advance();

        let otherPetDefs =  [...App.petDefinition.friends]
                            .map(value => ({ value, sort: Math.random() }))
                            .sort((a, b) => a.sort - b.sort)
                            .map(({ value }) => value); // shuffling friends array
        for(let i = 0; i < 3; i++){
            otherPetDefs.push(App.getRandomPetDef(App.petDefinition.lifeStage));
        }

        const otherPets = otherPetDefs.slice(0, 3).map(def => new Pet(def));

        const table = new Object2d({
            img: 'resources/img/misc/table_01.png',
            x: 28,
            y: 68,
            z: App.constants.ACTIVE_PET_Z,
            depthMode: Object2d.DEPTH_MODE.y,
        });
        const cake = new Object2d({
            parent: table,
            localZ: 2,
            img: 'resources/img/misc/cake_01.png',
            x: 39,
            y: 58,
        });

        otherPets.forEach((pet, i) => {
            pet.stopMove();
            pet.targetX = 20;
            pet.x = -10 * i;
            App.pet.setLocalZBasedOnSelf(pet);
            switch(i){
                case 0:
                    pet.targetX = 50;
                    pet.targetY = 65;
                    break;
                case 1:
                    pet.targetX = 12;
                    pet.targetY = 65;
                    break;
                case 2:
                    pet.targetX = 5;
                    pet.targetY = 85;
                    break;
            }
            pet.triggerScriptedState('moving', App.INF, 0, true, null, (pet) => {
                if(!pet.isMoving){
                    pet.setState('cheering');
                }
            })
        })

        App.pet.x = '80%';
        App.pet.stopMove();
        App.pet.inverted = false;
        App.pet.triggerScriptedState('idle_side', 3000, 0, true, () => {
            App.playSound('resources/sounds/birthday_song_01.ogg', true);
            App.pet.triggerScriptedState('cheering', 13000, 0, true, () => {
                App.pet.triggerScriptedState('cheering', 10000, 0, true);
                Activities.task_foam(() => {
                    otherPets.forEach(pet => pet.removeObject());
                    table.removeObject();

                    App.pet.ageUp();
                    App.pet.z += 1;
                    App.pet.y = '60%';
                    App.pet.x = '50%';
                    App.pet.stopMove();

                    App.pet.triggerScriptedState('blush', 3000, 0, true, () => {
                        App.pet.z -= 1;
                        App.setScene(App.scene.home);
                        App.toggleGameplayControls(true);
                        App.pet.playCheeringAnimation();
                    });
                });
            });
        });
    }
    static redecorRoom(callbackFn){
        App.toggleGameplayControls(false);
        App.definitions.achievements.redecor_x_times.advance();
        App.pet.stats.current_expression += 1;

        let otherPetDef = new PetDefinition({
            sprite: 'resources/img/character/chara_290b.png',
        })
        let otherPet = new Pet(otherPetDef);
        App.pet.setLocalZBasedOnSelf(otherPet);

        otherPet.stopMove();
        otherPet.x = '100%';
        App.pet.stopMove();
        App.pet.x = 10;

        function task_otherPetMoveIn(){
            otherPet.triggerScriptedState('moving', App.INF, null, true);
            otherPet.targetX = 80 - otherPet.spritesheet.cellSize;
            App.pet.triggerScriptedState('idle', 3000, null, true, () => {
                otherPet.stopScriptedState();
                task_redecor();
            })
        }

        function task_redecor(){
            otherPet.x = 80 - otherPet.spritesheet.cellSize;
            otherPet.stopMove();
            App.pet.stopMove();

            App.save();

            Activities.task_foam(
            () => {
                App.setScene(App.currentScene, true);
                App.pet.x = 10;
            },
            () => {
                App.pet.stopScriptedState();
            })

            otherPet.triggerScriptedState('idle', App.INF);
            App.pet.triggerScriptedState('idle', App.INF, null, true, () => {
                otherPet.stopScriptedState();
                task_otherPetMoveOut();
            });
        }

        function task_otherPetMoveOut(){
            otherPet.triggerScriptedState('moving', App.INF);
            otherPet.targetX = 120;
            App.pet.inverted = true;
            App.pet.triggerScriptedState('idle_side', 3000, null, true, () => {
                App.fadeScreen({middleFn: () => {
                    otherPet.stopScriptedState();
                    App.pet.x = '50%';
                    App.pet.stats.current_fun += 55;
                    App.pet.statsManager();
                    App.pet.playCheeringAnimationIfTrue(App.pet.hasMoodlet('amused'), () => {
                        App.setScene(App.scene.home)
                        App.toggleGameplayControls(true);
                        callbackFn?.();
                    });
                    App.drawer.removeObject(otherPet);
                }})
            });
        }

        task_otherPetMoveIn();
    }
    static inviteGiveGift(otherPetDef = App.getRandomPetDef()){
        App.closeAllDisplays();
        App.setScene(App.scene.home);
        App.toggleGameplayControls(false);
        let otherPet = new Pet(otherPetDef);
        App.pet.setLocalZBasedOnSelf(otherPet);
        App.definitions.achievements.give_gifts_x_times.advance();
        Missions.done(Missions.TYPES.gift);

        const wantedFriendDef = App.petDefinition.friends[App.pet.stats.current_want.item];
        App.petDefinition.checkWant(otherPetDef == wantedFriendDef, App.constants.WANT_TYPES.playdate)

        otherPet.stopMove();
        otherPet.x = '100%';
        App.pet.stopMove();
        App.pet.x = 10;

        const gift = new Object2d({
            img: 'resources/img/misc/gift.png',
            x: '50%', y: '80%', depthMode: Object2d.DEPTH_MODE.y,
        });

        function task_otherPetMoveIn(){
            otherPet.triggerScriptedState('moving', App.INF, null, true);
            otherPet.targetX = 90 - otherPet.spritesheet.cellSize;
            App.pet.inverted = true;
            App.pet.triggerScriptedState('idle_side', 2500, null, true, () => {
                otherPet.stopScriptedState();
                task_gift();
            })
        }

        function task_gift(){
            otherPet.x = 90 - otherPet.spritesheet.cellSize;
            App.pet.x = 10;

            otherPet.stopMove();
            App.pet.stopMove();

            otherPet.triggerScriptedState('cheering', App.INF);
            App.pet.triggerScriptedState('cheering', 3000, null, true, () => {
                // App.drawer.removeObject(gift);
                otherPet.stopScriptedState();
                task_otherPetMoveOut();
            });
        }

        function task_otherPetMoveOut(){
            // gift.y += 10;
            otherPet.triggerScriptedState('moving', App.INF, false, true, null, () => {
                gift.x = otherPet.x + 10;
            });
            otherPet.targetX = 120;
            App.pet.inverted = true;
            App.pet.triggerScriptedState('blush', 3000, null, true, () => {
                otherPet.stopScriptedState();
                App.pet.x = '50%';
                App.pet.stats.current_fun += 55;
                App.pet.stats.current_expression += 2;
                App.pet.stats.current_logic += 0.5;
                App.pet.statsManager();
                App.pet.playCheeringAnimationIfTrue(App.pet.hasMoodlet('amused'), () => App.setScene(App.scene.home));
                App.drawer.removeObject(otherPet);
                App.drawer.removeObject(gift);
                App.toggleGameplayControls(true);
            });
        }

        task_otherPetMoveIn();
    }
    static officeWork(){
        App.closeAllDisplays();
        App.setScene(App.scene.office);
        App.definitions.achievements.work_x_times.advance();

        const backgroundMusic = App.playAdvancedSound({
            loop: true,
            src: 'resources/sounds/work_track_01.ogg',
            volume: 0.5,
        });

        const dynamicBackground = new Object2d({
            img: 'resources/img/background/house/office_01.png',
            x: 0, y: 0, z: App.constants.BACKGROUND_OBJECT_Z,
            spritesheet: {
                cellSize: App.drawer.bounds.width,
                cellNumber: 2,
                rows: 1,
                columns: 3
            },
            onDraw: (me) => Object2d.animations.cycleThroughFrames(me, 250, true),
        })

        App.pet.stopMove();
        App.pet.inverted = true;
        App.pet.x = '53%';
        App.pet.y = '78%';
        App.pet.triggerScriptedState('eating', App.INF, false, true, () => {
            backgroundMusic.stop();
            dynamicBackground.removeObject();
        }, (me) => {
            if(random(0, 50)) return;
            me.setState( randomFromArray(['eating', 'sitting']) );
        })
    }
    static teacherClassroomWork(){
        App.closeAllDisplays();
        App.setScene(App.scene.classroom);

        const backgroundMusic = App.playAdvancedSound({
            loop: true,
            src: 'resources/sounds/work_track_01.ogg',
            volume: 0.5,
        });

        const initialPetZ = App.pet.z;
        App.pet.stopMove();
        App.pet.triggerScriptedState(
            "idle",
            App.INF,
            false,
            true,
            () => {
                backgroundMusic.stop();
                App.pet.z = initialPetZ;
            },
            (me) => {
                if (
                    App.time - (me.lastAnimationChangeMs ?? 0) <
                    random(
                        App.constants.ONE_SECOND * 1,
                        App.constants.ONE_SECOND * 20,
                    )
                )
                    return;
                me.lastAnimationChangeMs = App.time

                if(random(0, 1)){
                    App.pet.x = randomFromArray(['20%', '50%', '80%']);
                    App.pet.y = '90%';
                    App.pet.z = App.constants.ACTIVE_PET_Z + 0.05;
                } else {
                    App.pet.x = '50%';
                    App.pet.y = '65%';
                    App.pet.z = initialPetZ;
                }

                me.setState(randomFromArray([
                    'idle',
                    'idle_side',
                    'talking',
                    'jumping',
                    'cheering',
                    'shocked',
                    'mild_uncomfortable',
                ]))
                me.inverted = Boolean(random(0, 1));
            },
        );

        const deskClippedObject = new Object2d({
            parent: App.currentSceneObject,
            img: App.scene.classroom.image,
            x: 0, y: 0, z: App.constants.ACTIVE_PET_Z,
            depthMode: Object2d.DEPTH_MODE.y,
            clip: [
                [21, 51],
                [21, 82],
                [74, 82],
                [74, 51],
            ]
        })

        const STUDENT_COUNT = random(3, 5);

        const students = new Array(STUDENT_COUNT)
            .fill(null)
            .map(() => App.getRandomPetDef(PetDefinition.LIFE_STAGE.child))
            .map((def) => new Pet(def));

        const spacing = 100 / STUDENT_COUNT;

        students.forEach((student, i) => {
            student.parent = App.currentSceneObject;
            student.z = App.constants.ACTIVE_PET_Z + 1;
            student.x = `${i * spacing + (spacing / 2)}%`;
            student.triggerScriptedState(
                "idle",
                App.INF,
                false,
                true,
                null,
                (me) => {
                    if(App.time - (me.lastAnimationChangeMs ?? 0) < random(500, 2000)) return;
                    me.lastAnimationChangeMs = App.time

                    if(!random(0, 20)){
                        me.showThought(randomFromArray([
                            'thought_question',
                            'thought_exclaim',
                            'thought_talk',
                            'thought_scribble',
                        ]), null, App.constants.ONE_SECOND);
                    }

                    me.setState(randomFromArray([
                        'idle',
                        'idle_side',
                        'talking',
                        'jumping',
                        'cheering',
                    ]))
                    me.inverted = Boolean(random(0, 1));
                },
            );
        })

    }
    static bodyBuilderWork(){
        App.closeAllDisplays();
        App.setScene(App.scene.gym);

        const backgroundMusic = App.playAdvancedSound({
            loop: true,
            src: 'resources/sounds/work_track_01.ogg',
            volume: 0.5,
        });

        const possiblePositions = [
            {y: '70%'},
            {y: '80%'},
            {y: '90%'},
            {y: '100%'},
        ]

        const attachDumbleToActor = (parent) => {
            return Prefab.item(App.definitions.item.dumble, {
                parent: parent,
                x: 4,
                y: 0,
                z: parent.z,
                isRelative: true,
                opacity: 1,
                _float: Math.random() * Math.PI,
                onDraw: (me) => {
                    if(!me.parent.isDuringScriptedState()) {
                        return me.removeObject();
                    }

                    me._float += 0.009 * App.deltaTime;
                    const float = Math.sin(me._float);
                    me.y = -3 - (float * 2);

                    const isTargetState = ['uncomfortable', 'shocked'].includes(me.parent.state);
                    me.opacity = isTargetState ? 1 : 0;

                    me.localZ = me.parent.localZ;
                }
            });
        }

        const stateDriver = (me) => {
            if (
                App.time - (me.lastAnimationChangeMs ?? 0) <
                random(
                    App.constants.ONE_SECOND * 3,
                    App.constants.ONE_SECOND * 20,
                )
            )
                return;
            me.lastAnimationChangeMs = App.time

            const newPosition = randomFromArray(possiblePositions);
            me.x = newPosition.x || me.x;
            me.y = newPosition.y || me.y;

            me.setState(randomFromArray([
                'idle',
                'idle_side',
                'talking',
                'jumping',
                'shocked',
                'mild_uncomfortable',
                'mild_uncomfortable',
                'uncomfortable',
                'uncomfortable',
                'uncomfortable',
            ]))
            me.inverted = Boolean(random(0, 1));
        }

        App.pet.stopMove();
        attachDumbleToActor(App.pet);
        App.pet.triggerScriptedState(
            "idle",
            App.INF,
            false,
            true,
            () => {
                backgroundMusic.stop();
            },
            stateDriver,
        );

        const NPC_COUNT = 2;
        const npcActors = new Array(NPC_COUNT)
            .fill(null)
            .map(() => App.getRandomPetDef(PetDefinition.LIFE_STAGE.ADULT))
            .map((def) => new Pet(def));

        const spacing = 100 / NPC_COUNT;
        npcActors.forEach((npc, i) => {
            npc.parent = App.currentSceneObject;
            npc.z = App.constants.ACTIVE_PET_Z;
            npc.x = `${i * spacing + (spacing / 2)}%`;
            attachDumbleToActor(npc);
            npc.triggerScriptedState(
                "idle",
                App.INF,
                false,
                true,
                null,
                stateDriver,
            );
        })

    }
    static inviteDoctorVisit(){
        App.setScene(App.scene.home);
        App.toggleGameplayControls(false);
        let otherPetDef = new PetDefinition({
            sprite: 'resources/img/character/chara_291b.png',
        })
        let otherPet = new Pet(otherPetDef);

        otherPet.stopMove();
        otherPet.x = '100%';
        App.pet.stopMove();
        App.pet.x = 20;

        function task_otherPetMoveIn(){
            otherPet.triggerScriptedState('moving', App.INF, null, true);
            otherPet.targetX = 80 - otherPet.spritesheet.cellSize;
            App.pet.triggerScriptedState('idle', 3000, null, true, () => {
                otherPet.stopScriptedState();
                task_visiting();
            })
        }

        function task_visiting(){
            otherPet.x = 80 - otherPet.spritesheet.cellSize;
            App.pet.x = 20;

            otherPet.stopMove();
            App.pet.stopMove();

            App.pet.inverted = true;

            otherPet.triggerScriptedState('eating', App.INF);
            App.pet.triggerScriptedState('eating', 8000, null, true, () => {
                otherPet.stopScriptedState();
                task_otherPetMoveOut();
            });
        }

        function task_otherPetMoveOut(){
            otherPet.triggerScriptedState('moving', App.INF);
            otherPet.targetX = 120;
            App.pet.inverted = true;
            App.pet.triggerScriptedState('idle_side', 3000, null, true, () => {
                otherPet.stopScriptedState();
                App.pet.x = '50%';
                // App.pet.playCheeringAnimationIfTrue(App.pet.hasMoodlet('amused'), () => App.setScene(App.scene.home));

                let health = App.pet.stats.current_health;

                let state = 'very healthy';
                if(health <= App.pet.stats.max_health * 0.20) state = 'very sick';
                else if(health <= App.pet.stats.max_health * 0.45) state = 'sick';
                else if(health <= App.pet.stats.max_health * 0.75) state = 'healthy'

                if(state == 'very sick' || state == 'sick'){
                    App.pet.triggerScriptedState('shocked', 2000, false, true, () => {
                        App.displayPopup(`${App.pet.petDefinition.name} is ${state}`, 5000);
                    })
                } else {
                    App.pet.triggerScriptedState('cheering', 2000, false, true, () => {
                        App.displayPopup(`${App.pet.petDefinition.name} is ${state}`, 5000);
                    })
                }

                App.drawer.removeObject(otherPet);
                App.toggleGameplayControls(true);
            });
        }

        task_otherPetMoveIn();
    }
    static goToWalkwayMall(){
        App.toggleGameplayControls(false, () => {
            App.pet.stopScriptedState();
        });
        App.setScene(App.scene.walkway);
        Missions.done(Missions.TYPES.visit_mall);

        App.pet.x = '100%';
        App.pet.y = '74%';

        App.pet.targetX = -20;

        App.pet.triggerScriptedState('moving', 3000, null, true, () => {
            App.setScene(App.scene.home);
            App.handlers.open_mall_activity_list();
            App.toggleGameplayControls(true);
        });

        // App.pet.triggerScriptedState('moving', 1000, null, true, () => {
        //     App.setScene(App.scene.home);
        //     App.handlers.open_mall_activity_list();
        //     App.toggleGameplayControls(true);
        // }, Pet.scriptedEventDrivers.movingOut.bind({pet: App.pet}));
    }
    static goToArcade(){
        App.toggleGameplayControls(false, () => {
            App.pet.stopScriptedState();
        });
        App.setScene(App.scene.arcade);

        let randomNpcs = new Array(2).fill(undefined).map((item, i) => {

            let petDef = App.getRandomPetDef(1);
            let npcPet = new Pet(petDef);

            if(i == 1) npcPet.x = 15;
            else npcPet.x = 0;

            npcPet.stopMove();
            npcPet.triggerScriptedState('cheering', App.INF, null, true);

            return npcPet;
        })

        App.pet.triggerScriptedState('moving', 2500, null, true, () => {
            App.setScene(App.scene.home);
            App.handlers.open_game_list();
            App.toggleGameplayControls(true);

            randomNpcs.forEach(npc => npc.removeObject());
        }, Pet.scriptedEventDrivers.movingIn.bind({pet: App.pet}));
    }
    static goToMarket(){
        App.toggleGameplayControls(false, () => {
            App.pet.stopScriptedState();
        });
        App.setScene(App.scene.market);
        Missions.done(Missions.TYPES.visit_market);

        let randomNpcs = new Array(2).fill(undefined).map((item, i) => {

            let petDef = App.getRandomPetDef(2);
            let npcPet = new Pet(petDef);

            if(i == 1) npcPet.x = 30;
            else {
                npcPet.x = 0;
                npcPet.inverted = true;
            }

            npcPet.stopMove();
            npcPet.triggerScriptedState('eating', App.INF, null, true);

            return npcPet;
        })

        App.pet.triggerScriptedState('moving', 2500, null, true, () => {
            App.setScene(App.scene.home);
            App.handlers.open_market_menu();
            App.toggleGameplayControls(true);

            randomNpcs.forEach(npc => npc.removeObject());
        }, Pet.scriptedEventDrivers.movingIn.bind({pet: App.pet}));
    }
    static invitePlaydate(otherPetDef, scene, onEndFn){
        App.setScene(scene ?? App.scene.home);
        App.toggleGameplayControls(false);
        otherPetDef.increaseFriendship(8);
        let otherPet = new Pet(otherPetDef);
        Missions.done(Missions.TYPES.playdate);

        const wantedFriendDef = App.petDefinition.friends[App.pet.stats.current_want.item];
        App.petDefinition.checkWant(otherPetDef == wantedFriendDef, App.constants.WANT_TYPES.playdate)

        otherPet.stopMove();
        otherPet.x = '100%';
        App.pet.stopMove();
        App.pet.x = 20;

        function task_otherPetMoveIn(){
            otherPet.triggerScriptedState('moving', App.INF, null, true);
            otherPet.targetX = 80 - otherPet.spritesheet.cellSize;
            App.pet.triggerScriptedState('idle', 3000, null, true, () => {
                otherPet.stopScriptedState();
                task_playing();
            })
        }

        function task_playing(){
            otherPet.x = 80 - otherPet.spritesheet.cellSize;
            App.pet.x = 20;

            otherPet.stopMove();
            App.pet.stopMove();

            otherPet.triggerScriptedState('cheering', App.INF);
            App.pet.triggerScriptedState('cheering', 5000, null, true, () => {
                otherPet.stopScriptedState();
                task_otherPetMoveOut();
            });
        }

        function task_otherPetMoveOut(){
            otherPet.triggerScriptedState('moving', App.INF);
            otherPet.targetX = 120;
            App.pet.inverted = true;
            App.pet.triggerScriptedState('idle_side_uncomfortable', 3000, null, true, () => {
                otherPet.stopScriptedState();
                App.pet.x = '50%';
                App.pet.stats.current_fun += 30;
                switch(random(0, 2)){
                    case 0: App.pet.stats.current_expression += 2; break;
                    case 1: App.pet.stats.current_endurance += 2; break;
                    case 2: App.pet.stats.current_logic += 2; break;
                }
                App.pet.statsManager();
                App.drawer.removeObject(otherPet);
                App.pet.playCheeringAnimationIfTrue(App.pet.hasMoodlet('amused'), () => {
                    onEndFn?.();
                    App.toggleGameplayControls(true);
                    App.setScene(App.scene.home);
                });
            });
        }

        task_otherPetMoveIn();
    }
    static async encounterSanta(onEndFn){
        App.toggleGameplayControls(false);

        App.setScene(App.scene.park);

        const npc = new Pet(
            new PetDefinition({
                sprite: 'resources/img/character/santa_01.png',
            })
        )

        setTimeout(() => {
            App.playSound('resources/sounds/santa_bm_01.mp3', true);
        }, 100);

        const main = new TimelineDirector(App.pet);
        const santa = new TimelineDirector(npc);

        santa.setPosition({x: '25%'});
        santa.lookAt(true);
        main.setPosition({x: '100%'})
        await main.moveTo({x: '75%', speed: 0.015});

        main.bob({maxCycles: 1, animation: 'cheering'});
        await santa.bob({maxCycles: 1, animation: 'cheering'});

        await TimelineDirector.wait(1500);

        main.setState('blush');
        main.think('thought_gift', false, 1500);
        santa.setState('jumping');

        await TimelineDirector.wait(2000);

        await main.moveTo({x: '70%', speed: 0.01});
        await santa.moveTo({x: '30%', speed: 0.01});

        await TimelineDirector.wait(500);

        const gift = new Object2d({
            img: 'resources/img/misc/gift.png',
            x: '50%', y: '85%', z: App.constants.ACTIVE_PET_Z + 0.1,
        });
        new Object2d({
            img: 'resources/img/misc/foam_single.png',
            x: '50%',
            y: '85%',
            opacity: 1,
            scale: 1.5,
            rotation: random(0, 180),
            z: App.constants.ACTIVE_PET_Z + 2,
            onDraw: (me) => {
                Object2d.animations.flip(me);
                Object2d.animations.pulseScale(me, 0.1, 0.01);
                me.scale -= 0.0009 * App.deltaTime;
                me.opacity -= 0.0009 * App.deltaTime;
                if(me.opacity <= 0) me.removeObject();
            }
        })

        await TimelineDirector.wait(500);

        main.setState('cheering_with_icon');
        santa.setState('cheering');

        santa.actor.say('Merry Christmas!', 3000)
        await TimelineDirector.wait(3000);

        // accessory gift
        // todo: refactor with definitions.pools
        const EXCLUSIVE_ACCESSORY = 'santa hat';
        const accessoriesPool = Object.keys(App.definitions.accessories)
        .filter(key => App.definitions.accessories[key].price !== -1);
        let randomAccessory = randomFromArray(accessoriesPool);
        if(!App.pet.inventory.accessory[EXCLUSIVE_ACCESSORY]){
            randomAccessory = EXCLUSIVE_ACCESSORY;
        }
        const isAccessoryNew = !App.pet.inventory.accessory[randomAccessory];
        App.pet.inventory.accessory[randomAccessory] = true;
        App.displayPopup(`
            <small>Gift</small>
            <div class="pulse">
                ${App.getAccessoryCSprite(randomAccessory)}
            </div>
            <div>${randomAccessory}${isAccessoryNew ? App.getBadge('New!') : ''}</div>
            <div>
                <small>Accessory</small>
            </div>
        `, 4000, false, true)
        await TimelineDirector.wait(4500);

        // money gift
        const prize = random(250, 500);
        App.pet.stats.gold += prize;
        santa.actor.say(`+ $${prize}`, 3000);

        await TimelineDirector.wait(5000);

        App.fadeScreen({middleFn: () => {
            App.toggleGameplayControls(true);
            main.release();
            santa.remove();
            gift.removeObject();
            onEndFn?.();
        }})
    }
    static goToPark(otherPetDef, onEndFn){
        if(
            !otherPetDef && !App.temp.encounteredSanta && (
                (App.isDuringChristmas() && random(0, 100) <= 20) ||
                (App.isChristmasDay())
            )
        ){
            App.temp.encounteredSanta = true;
            return Activities.encounterSanta(onEndFn);
        }

        if(!otherPetDef){
            if(random(1, 100) <= 60){
                otherPetDef = App.getRandomPetDef(App.petDefinition.lifeStage);
                Missions.done(Missions.TYPES.find_park_friend);
            }
        } else {
            const wantedFriendDef = App.petDefinition.friends[App.pet.stats.current_want.item];
            App.petDefinition.checkWant(otherPetDef == wantedFriendDef, App.constants.WANT_TYPES.playdate)
        }
        App.setScene(App.scene.park);
        App.toggleGameplayControls(false, () => App.pet.stopScriptedState());
        App.pet.speedOverride = 0.025;
        App.pet.x = '50%';
        App.pet.y = '92%';

        let otherPet;
        if(otherPetDef){
            otherPet = new Pet(otherPetDef, {
                x: '75%', y: '90%', speedOverride: random(15, 35) * 0.001,
            });
            otherPet.triggerScriptedState('playing', 10000, null, true, false, Pet.scriptedEventDrivers.playing.bind({pet: otherPet}));

            otherPet.nextRandomTargetSelect = 0;
            App.petDefinition.addFriend(otherPetDef, 1);
            otherPetDef.increaseFriendship();
        }

        const onEnd = () => {
            App.toggleGameplayControls(false);
            App.pet.x = '50%';
            App.pet.stats.current_fun += 15;
            App.pet.stats.current_endurance += 0.5;
            App.pet.statsManager();
            App.pet.playCheeringAnimationIfTrue(App.pet.hasMoodlet('amused'), () => {
                App.setScene(App.scene.home);
                App.toggleGameplayControls(true);
                onEndFn?.();
            });
            if(otherPet) App.drawer.removeObject(otherPet);
            App.pet.speedOverride = false;
        }

        App.pet.triggerScriptedState('playing', 10000, null, true, onEnd, Pet.scriptedEventDrivers.playing.bind({pet: App.pet}));
    }


    // games
    static async islandCollectionGame(){
        App.closeAllDisplays();
        App.petDefinition.checkWant(true, App.constants.WANT_TYPES.minigame);
        App.sendAnalytics('minigame_island_collector');
        App.toggleGameplayControls(false);
        App.setScene(App.scene.emptyOutside);

        // scoring and game loop
        const MAP_SIZE = 960;
        const PADDING = 150;
        const MAX_TIME = App.constants.ONE_SECOND * 30;
        let maxScore = 0, currentScore = 0, allowMovement = true;
        const increaseScore = (amt = 1) => {
            currentScore += amt;
        }

        App.playAdvancedSound({
            loop: false,
            src: 'resources/sounds/island_collector_bm_01.mp3',
            volume: 0.4,
        });

        const onEnd = () => {
            const percentCollected = Math.round(currentScore * 100 / maxScore);

            timerBar.abort();
            screen.remove();
            allowMovement = false;
            setTimeout(() => {
                App.pet.say(`${percentCollected}/${100}`, App.constants.ONE_SECOND * 2);
            }, App.constants.ONE_SECOND * 0.5);
            setTimeout(() => {
                App.fadeScreen({
                    middleFn: () => {
                        App.toggleGameplayControls(true);
                        App.drawer.setCameraPosition(0, 0);
                        App.setScene(App.scene.full_grass);
                        App.pet.stopScriptedState();

                        if(percentCollected > 90){
                            App.definitions.achievements.perfect_minigame_islandcollector_win_x_times.advance();
                        }

                        Activities.task_winMoney({
                            amount: percentCollected >= 25 ? Math.round(percentCollected * 0.75) : 0,
                            hasWon: percentCollected > 60,
                        })
                    }
                })
            }, App.constants.ONE_SECOND * 3);
        }

        const screen = UI.empty();
        screen.className = 'absolute-fullscreen'
        document.querySelector('.screen-wrapper').appendChild(screen);
        const timerBar = App.createTimerBar(MAX_TIME, onEnd);
        screen.appendChild(timerBar.node);

        const mapObject = new Object2d({
            parent: App.currentSceneObject,
            img: 'resources/img/background/outside/map_island_02.png',
            x: -(MAP_SIZE / 2),
            y: -(MAP_SIZE / 2),
            width: MAP_SIZE, height: MAP_SIZE, z: -10,
        })
        window.mapObj = mapObject
        const mapHalfBounds = {
            x: mapObject.width / 2,
            y: mapObject.height / 2,
        }

        let targetBoundingBox;

        App.pet.stopMove();
        App.pet.triggerScriptedState('idle', App.INF, false, true, () => {}, (me) => {
            targetBoundingBox = me.getBoundingBox();

            if(!targetBoundingBox) return;

            const direction = normalizeVector({
                x: App.mouse.absX || 0,
                y: App.mouse.absY || 0,
            })

            if(App.mouse.isDown && allowMovement){
                const movementVector = multVector(direction, 0.75);

                me.x += movementVector.x * 0.1 * App.deltaTime;
                me.y += movementVector.y * 0.1 * App.deltaTime;

                me.setState('moving');
                me.inverted = direction.x > 0;
            } else {
                me.setState('idle');
                direction.x = 0;
                direction.y = 0;
            }

            me.x = clamp(me.x, -mapHalfBounds.x + PADDING, mapHalfBounds.x - PADDING - targetBoundingBox.width);
            me.y = clamp(me.y, -mapHalfBounds.y + PADDING, mapHalfBounds.y - PADDING - targetBoundingBox.height);

            const cameraTargetCenter = {
                x: -me.x + App.drawer.bounds.width/2 - me.spritesheet.cellSize/2,
                y: -me.y + App.drawer.bounds.height/2
            }
            const directionCameraMovementVector = multVector(direction, 50)
            App.drawer.setCameraPosition(
                cameraTargetCenter.x - directionCameraMovementVector.x,
                cameraTargetCenter.y - directionCameraMovementVector.y,
                0.003 * App.deltaTime
            );
        });


        // spawning
        for(let x = 0; x < mapObject.width; x += 20)
            for(let y = 0; y < mapObject.width; y += 20) {
                const PICKUP_SPAWN_PADDING = PADDING + 50;

                const NOISE_SCALE = 0.01;
                const noise = window.noise.simplex2(x * NOISE_SCALE, y * NOISE_SCALE, 0);

                if(
                    x < PICKUP_SPAWN_PADDING ||
                    x > mapObject.width - PICKUP_SPAWN_PADDING ||
                    y < PICKUP_SPAWN_PADDING ||
                    y > mapObject.height - PICKUP_SPAWN_PADDING
                )
                    continue

                if(noise > 0.7) {
                    new Object2d({
                        parent: App.currentSceneObject,
                        img: 'resources/img/misc/tree_01.png',
                        x: x - (mapObject.width / 2)  + random(-4, 4),
                        y: y - (mapObject.height / 2) + random(-4, 4) - 32,
                        z: App.pet.z,
                        depthMode: Object2d.DEPTH_MODE.y,
                    })
                }

                if(random(0, 20)) continue;
                for(let i = 0; i < random(5, 10); i++) {
                    maxScore += 1;
                    const spawnPosition = {
                        x: x - (mapObject.width / 2) + random(-16, 16),
                        y: y - (mapObject.height / 2) + random(-16, 16),
                    };
                    new Object2d({
                        parent: App.currentSceneObject,
                        img: 'resources/img/misc/apples_01.png',
                        spritesheet: {
                            cellSize: 8,
                            cellNumber: random(1, 4),
                            columns: 4,
                            rows: 1,
                        },
                        ...spawnPosition,
                        depthMode: Object2d.DEPTH_MODE.y,
                        z: App.constants.ACTIVE_PET_Z,

                        PICKUP_RANGE: 45,
                        onDraw: (me) => {
                            const bb = me.getBoundingBox();

                            const distanceX = Math.abs(bb?.centerX - targetBoundingBox?.centerX);
                            const distanceY = Math.abs(bb?.centerY - targetBoundingBox?.centerY);
                            const manhattanDist = distanceX + distanceY;

                            if(manhattanDist < me.PICKUP_RANGE) {
                                me.x = lerp(me.x, targetBoundingBox?.centerX - bb.width/2, 0.0075 * App.deltaTime);
                                me.y = lerp(me.y, targetBoundingBox?.centerY - bb.height/2, 0.0075 * App.deltaTime);
                            }

                            if(manhattanDist <= 20) {
                            increaseScore();
                            me.removeObject();
                            App.playAdvancedSound({
                                src: `resources/sounds/pop_01.mp3`,
                                loop: false,
                                volume: 1,
                                playbackRate: 1 + (Math.random() * 0.5 * randomFromArray([-1, 1])),
                                preservesPitch: false,
                            });
                            Prefab.fadingSmoke({
                                x: bb.centerX,
                                y: bb.centerY,
                                z: App.constants.ACTIVE_PET_Z - 1,
                                spawnScale: 0.75,
                            })
                        }
                        }
                    })
                }
            }
    }
    static guessTheNumberGame(){
        App.closeAllDisplays();
        App.petDefinition.checkWant(true, App.constants.WANT_TYPES.minigame);
        App.sendAnalytics('minigame_guessTheNumber');

        App.toggleGameplayControls(false);
        App.setScene(App.scene.arcade_game01);

        App.pet.triggerScriptedState('idle', App.INF, null, true);
        App.pet.stopMove();
        App.pet.x = '50%';
        App.pet.y = '90%';

        const selectedTargetNumber = random(1, 9);
        const maxChoices = 3;
        let remainingChoices = maxChoices;
        const chosenNumbers = [];
        const messageBubbleShownMs = App.constants.ONE_SECOND * 2;

        const numberLabelText = `The number was <b>${selectedTargetNumber}</b>!`

        const onEnd = (hasWon) => {
            if(hasWon){
                App.definitions.achievements.perfect_minigame_guessnum_win_x_times.advance();
            }
            Activities.task_winMoney({
                hasWon,
                amount: hasWon ? 50 : 0,
            })
        }

        const checkProgress = (chosenNumber) => {
            remainingChoices--;
            if(chosenNumber === selectedTargetNumber){
                App.fadeScreen({
                    middleFn: () => {
                        App.pet.playCheeringAnimation(() => {
                            App.displayPopup(`You've won!<br><br>${numberLabelText}`, 3000, () => onEnd(true));
                        });
                    }
                })
                return;
            }
            if(remainingChoices <= 0){
                App.fadeScreen({
                    middleFn: () => {
                        App.pet.playUncomfortableAnimation(() => {
                            App.displayPopup(`You've lost!<br><br>${numberLabelText}`, 3000, () => onEnd(false));
                        })
                    }
                })
                return;
            }

            if(chosenNumber > selectedTargetNumber){
                App.pet.say('Lower!', messageBubbleShownMs);
            } else App.pet.say('Higher!', messageBubbleShownMs);
            setTimeout(() => {
                displayNumbers();
            }, messageBubbleShownMs)
        }

        const displayNumbers = () => {
            const screen = UI.empty();
            document.querySelector('.screen-wrapper').appendChild(screen);
            screen.innerHTML = `
            <div class="absolute-fullscreen flex display">
                <div class="absolute-fullscreen inner-padding-sm mini-game-ui">
                    ${remainingChoices}/${maxChoices}
                </div>

                <div class="flex-container flex-between" style="padding: 4px">
                    <div class="flex flex-dir-row flex-wrap justify-between align-end flex-gap-05" style="width: 75%;">
                        ${new Array(9).fill(1).map((_, index) => {
                            const number = index + 1;
                            return `<button choice ${chosenNumbers.includes(number) ? 'disabled' : ''} class="generic-btn stylized flex-grow">${number}</button>`
                        }).join('\n')}
                    </div>
                </div>
            </div>
            `;
            const buttons = [...screen.querySelectorAll('button[choice]')];
            buttons.forEach((button, index) => {
                button.onclick = () => {
                    screen.remove();
                    const chosenNumber = index + 1;
                    chosenNumbers.push(chosenNumber);
                    checkProgress(chosenNumber);
                }
            })
            return screen;
        }

        displayNumbers();
    }
    static async flagsGame(){
        App.closeAllDisplays();
        App.petDefinition.checkWant(true, App.constants.WANT_TYPES.minigame);
        App.sendAnalytics('minigame_flags');

        App.toggleGameplayControls(false, () => {});
        App.setScene(App.scene.full_grass);

        App.pet.triggerScriptedState('idle', App.INF, null, true);
        App.pet.stopMove();
        App.pet.x = '50%';
        App.pet.y = '70%';

        const screen = UI.empty();
        document.querySelector('.screen-wrapper').appendChild(screen);
        screen.innerHTML = `
        <div class="width-full" style="position: absolute; top: 0; left: 0;">
            <div class="flex-container" style="justify-content: space-between; padding: 4px">
                <div class="flex flex-dir-row" id="score"></div>
            </div>
        </div>
        `;

        const parent = new Object2d({});
        const baseFlagConfig = {
            img: 'resources/img/misc/flag_01.png',
            parent,
            y: '50%',
            z: App.constants.ACTIVE_PET_Z - 0.1,
            width: 38,
            height: 39,
            onDraw: (me) => me.opacity = me.parent.opacity,
        }
        const rightFlag = new Object2d({
            x: '65%',
            inverted: false,
            ...baseFlagConfig
        })
        const leftFlag = new Object2d({
            x: '35%',
            inverted: true,
            ...baseFlagConfig
        })

        const possibleRotations = [0, 45, 90];

        const winFrameRotation = 90;
        let isWinFrame = false, currentDelayMs = 800, scoreArray = new Array(3).fill(undefined), paused = false, cyclesWithoutWinFrame = 0;
        let nextPoseUpdate = App.time;

        const updateUI = () => {
            const scoreElement = screen.querySelector('#score');
            scoreElement.innerHTML = scoreArray.map(state => `
                <div class="score-circle ${state !== undefined ? (state ? 'green' : 'red') : ''}"></div>
            `).join(' ');
        }
        updateUI();

        const driverFn = App.registerOnDrawEvent(() => {
            if(App.mouse.isDown && !paused){
                const scoreIndex = scoreArray.findIndex(e => e === undefined)
                parent.opacity = 0.25;
                App.mouse.isDown = false;
                nextPoseUpdate = App.time + 2000;
                if(isWinFrame){
                    App.pet.setState('cheering');
                    currentDelayMs = clamp(currentDelayMs - 210, 250, 1000);
                } else {
                    App.pet.setState('uncomfortable');
                }
                scoreArray[scoreIndex] = isWinFrame ? true : false;
                updateUI();
                isWinFrame = false;
                cyclesWithoutWinFrame = 0;
                paused = true;
            }

            if(App.time <= nextPoseUpdate) return;
            nextPoseUpdate = App.time + currentDelayMs;

            if(scoreArray.every(e => e !== undefined)){
                return endFn();
            }

            paused = false;
            parent.opacity = 1;
            App.pet.setState('idle');

            let rightFlagRotation = randomFromArray(possibleRotations.filter(rot => rot !== rightFlag.rotation)),
                leftFlagRotation = -randomFromArray(possibleRotations.filter(rot => rot !== -leftFlag.rotation));

            if(cyclesWithoutWinFrame > 5){
                rightFlagRotation = winFrameRotation;
                leftFlagRotation = -winFrameRotation;
            }

            rightFlag.rotation = rightFlagRotation;
            leftFlag.rotation = leftFlagRotation;

            isWinFrame = [rightFlag, leftFlag].every(flag => Math.abs(flag.rotation) === winFrameRotation);

            if(isWinFrame){
                App.pet.setState('shocked');
                App.playSound('resources/sounds/cute.ogg');
                App.vibrate();
                cyclesWithoutWinFrame = 0;
            } else {
                App.playSound('resources/sounds/ui_click_04.ogg');
                cyclesWithoutWinFrame++
            }
        })

        const endFn = () => {
            // cleanup
            screen.remove();
            App.unregisterOnDrawEvent(driverFn);
            App.toggleGameplayControls(false);
            parent.removeObject();
            App.reloadScene();

            const winScore = scoreArray.filter(e => e === true).length;
            const hasWon = winScore >= 2;
            if(hasWon){
                App.definitions.achievements.perfect_minigame_flags_win_x_times.advance();
            }

            Activities.task_winMoney({
                hasWon,
                amount: winScore * 20,
                happiness: winScore * 3,
            })
        }
    }
    static async dogWashingGame(){
        App.closeAllDisplays();
        App.petDefinition.checkWant(true, App.constants.WANT_TYPES.minigame);
        App.sendAnalytics('minigame_dog_washing');
        App.setScene(App.scene.animalBathroom);
        App.toggleGameplayControls(false);
        App.pet.stopMove();
        App.pet.x = '35%';
        App.pet.y = '82%';
        App.pet.inverted = true;
        App.pet.triggerScriptedState('idle_side', App.INF, null, true);
        let remainingTime = 10;
        let score = 0;

        // ui
        const buttonSizePx = 64;

        const screen = App.displayEmpty();
        screen.style.background = 'transparent';
        screen.innerHTML = `
            <div class="mini-game-ui flex align-center justify-between">
                <div class="flex align-center">
                    <i style="margin-right: 4px;" class="fa-solid fa-stopwatch icon"></i>
                    <div id="timeRemaining">
                        <span class="opacity-half">${remainingTime}</span>
                    </div>
                </div>
                <div class="flex align-center">
                    <i style="margin-right: 4px;" class="fa-solid fa-hands-wash icon"></i>
                    <div id="score">${score}</div>
                </div>
            </div>
            <div style="width: ${buttonSizePx}px; height: ${buttonSizePx}px" class="groom-button cursor-pointer">
                <i class="fa-solid fa-hands-wash fa-2x"></i>
            </div>
        `;
        const washActionButton = screen.querySelector('.groom-button');
        const repositionAction = () => {
            const bounds = {
                width: washActionButton.parentElement.clientWidth - buttonSizePx - 2,
                height: washActionButton.parentElement.clientHeight - buttonSizePx - 2
            }
            const position = {
                x: random(0, bounds.width),
                y: random(0, bounds.height),
            }
            washActionButton.style.top = `${position.x}px`;
            washActionButton.style.left = `${position.y}px`;
        }
        repositionAction();

        const onEndFn = () => {
            screen.close();
            animal.removeObject();
            App.pet.y = '100%';
            const moneyWon = Math.floor(score * 2.3);
            const hasWon = score > 18;
            if(hasWon){
                App.definitions.achievements.perfect_minigame_petgroom_win_x_times.advance();
            }
            Activities.task_winMoney({
                amount: moneyWon,
                hasWon: hasWon,
                happiness: score * 1.2,
            })
        }

        let timerFn;

        const animal = new Animal(App.getRandomAnimalDef('dog'));
        animal.triggerScriptedState('sitting', App.INF, null, true);
        animal.y = '82%';
        animal.x = '65%';
        const advanceProgress = () => {
            if(!timerFn){
                timerFn = setInterval(() => {
                    remainingTime--;
                    if(remainingTime <= 0){
                        remainingTime = 0;
                        clearInterval(timerFn);
                        onEndFn();
                        return;
                    }
                    screen.querySelector('#timeRemaining').textContent = remainingTime;
                }, 1000);
                screen.querySelector('#timeRemaining').textContent = remainingTime;
            }

            const foam = new Object2d({
                img: 'resources/img/misc/foam_single.png',
                x: (animal.x - 6) + random(-4, 4),
                y: (animal.y - 18) + random(-4, 4),
                scale: random(5, 10) * 0.1, opacity: 1, z: 10,
                onDraw: (me) => {
                    Object2d.animations.flip(me);
                    Object2d.animations.bob(me);
                    Object2d.animations.pulseScale(me, 0.1, 0.01);
                    me.scale -= 0.0005 * App.deltaTime;
                    me.opacity -= 0.0005 * App.deltaTime;
                    if(me.opacity <= 0) me.removeObject();
                }
            })
            score++;
            screen.querySelector('#score').textContent = score;
        }

        washActionButton.onclick = () => {
            repositionAction();
            advanceProgress();
            App.playSound('resources/sounds/ui_click_05.ogg');
        }
    }
    static async plantMatchingGame(){
        App.petDefinition.checkWant(true, App.constants.WANT_TYPES.minigame);
        App.sendAnalytics('minigame_plant_matching');

        const getRandomPlant = () =>
            randomFromArray(Object.keys(App.definitions.plant))
        const appendNonRepeatedPlant = (list = []) => {
            let newPlant;
            while(true){
                newPlant = getRandomPlant();
                if(!list.includes(newPlant)){
                    break;
                }
            }
            const newList = [...list, newPlant];
            return newList;
        }
        const getListOfNonRepeatedPlants = (list = [], length = 4) => {
            let newList = [...list];
            for(let i = 0; i < length; i++){
                newList = appendNonRepeatedPlant(newList);
            }
            return newList;
        }


        App.closeAllDisplays();
        App.setScene(App.scene.arcade);
        App.toggleGameplayControls(false);
        App.pet.stopMove();
        App.pet.x = '50%';
        App.pet.triggerScriptedState('idle', App.INF, null, true);

        // main list
        const targetList = getListOfNonRepeatedPlants([], 4);
        const selectionLists = targetList.map(item => {
            return shuffleArray(getListOfNonRepeatedPlants([item], 3));
        })

        const mainListUI = App.display2xGrid(targetList.map((name, index) => ({
            name: `
                ${Plant.getCSprite(name, Plant.AGE.grown, 'x2 blink')}
                <span class="absolute-fullscreen m">${index + 1}</span>
            `,
            class: 'disabled',
        })))

        await App.wait(4000);
        mainListUI.close();

        App.displayPopup(`Wait...`, 1000);
        await App.wait(1000);
        App.displayPopup('Go!', 1000);
        await App.wait(1000);

        const userSelectedList = [];
        const advanceProgress = async (name) => {
            userSelectedList.push(name);
            const correctChoices = userSelectedList.reduce((sum, current, currentIndex) => checkIndex(current, currentIndex) ? sum + 1 : sum, 0);

            const latestIndex = userSelectedList.length - 1;
            const isCorrect = checkIndex(name, latestIndex);

            if(isCorrect) setTimeout(() => App.playSound(`resources/sounds/ui_click_03.ogg`, true));

            App.displayPopup( isCorrect ? `Correct ${App.getIcon('check')}` : `Incorrect ${App.getIcon('times')}`, 1000 );
            await App.wait(1000);

            if(userSelectedList.length === targetList.length){
                App.displayPopup(`${correctChoices}/${targetList.length}`, 3000);
                await App.wait(2000);
                App.closeAllDisplays();

                if(correctChoices === targetList.length){
                    App.definitions.achievements.perfect_minigame_cropmatch_win_x_times.advance();
                }

                const moneyWon = Math.max((correctChoices - 1) * 20, 0);
                Activities.task_winMoney({
                    amount: moneyWon,
                    happiness: moneyWon / 5,
                    hasWon: Boolean(moneyWon)
                })
            }
        }
        const checkIndex = (name, index) => targetList[index] === name;

        selectionLists
            .slice()
            .reverse()
            .forEach((list, index) => {
                const currentList = App.display2xGrid(
                    list.map((name) => ({
                        name: Plant.getCSprite(name, Plant.AGE.grown, 'x2'),
                        onclick: () => {
                            advanceProgress(name);
                        }
                    }))
                )

                const counterElement = UI.create({
                    componentType: 'div',
                    className: 'absolute-fullscreen pointer-events-none flex-container',
                    parent: currentList,
                    children: [
                        {
                            textContent: Math.abs((index + 1) - targetList.length) + 1,
                            className: 'surface-stylized inner-padding'
                        }
                    ]
                })
            })

    }
    static barTimingGame(){
        App.closeAllDisplays();
        App.toggleGameplayControls(false, () => {}, false);
        App.petDefinition.checkWant(true, App.constants.WANT_TYPES.minigame);
        App.sendAnalytics('minigame_bar_timing');
        App.setScene(App.scene.arcade_game01);

        const screen = UI.empty('pointer-events-none display absolute-fullscreen flex-container flex-row-down height-100p bg-transparent');
        document.querySelector('.screen-wrapper').appendChild(screen);
        screen.innerHTML = `
            <div class="timing-bar-container">
                <div class="timing-bar-rod"></div>
                <div class="timing-bar-rod"></div>
                <div class="timing-bar-rod"></div>
                <div class=timing-bar-cursor></div>
            </div>
        `;
        const cursor = screen.querySelector('.timing-bar-cursor');

        let moneyWon = 0, round = 0, roundsWin = 0;
        let cursorSpeed = 0.19;
        let cursorCurrentPos = 0;

        const reset = (cursorSpeedAdd) => {
            cursorCurrentPos = 0;
            cursor.style.opacity = 1;
        }
        const onDraw = () => {
            cursorCurrentPos += cursorSpeed * App.deltaTime;
            if(cursorCurrentPos >= 98 || cursorCurrentPos <= 0){
                cursorSpeed *= -1;
                cursorCurrentPos = clamp(cursorCurrentPos, 0, 100);
                // App.vibrate(25);
                App.playSound(`resources/sounds/ui_click_04.ogg`, true);
            }
            cursor.style.left = `${cursorCurrentPos}%`;

            if(App.mouse.isDown) {
                App.mouse.isDown = false;
                if(cursorSpeed === 0) return;

                cursorSpeed = 0;
                cursor.style.opacity = 0.3;

                if(cursorCurrentPos >= 90) {
                    cursorCurrentPos -= 2; // fix looped click sound
                    App.playSound(`resources/sounds/ui_click_03.ogg`, true);
                    App.vibrate(80);
                    // success
                    moneyWon += 20;
                    roundsWin++;
                    App.pet.setState('cheering');
                } else if(cursorCurrentPos >= 70) {
                    App.playSound(`resources/sounds/ui_click_01.ogg`, true);
                    moneyWon += 3;
                    App.pet.setState('jumping');
                } else {
                    App.playSound(`resources/sounds/ui_click_01.ogg`, true);
                    moneyWon -= 5;
                    moneyWon = clamp(moneyWon, 0, 999);
                    App.pet.setState('mild_uncomfortable');
                }

                round++;

                if(round === 3){
                    setTimeout(() => {
                        screen.remove();
                        App.pet.stopScriptedState();
                        if(roundsWin === 3){
                            App.definitions.achievements.perfect_minigame_rodrush_win_x_times.advance();
                        }
                        Activities.task_winMoney({
                            amount: moneyWon,
                            happiness: roundsWin * 10,
                            hasWon: roundsWin >= 2
                        })
                    }, 500);
                } else {
                    setTimeout(() => {
                        reset(0.15);
                        cursorSpeed = round === 1 ? 0.27 : 0.37;
                        App.pet.setState('idle');
                    }, 500);
                }
            }
        }

        App.pet.stopMove();
        App.pet.x = '50%';
        App.pet.triggerScriptedState('idle', App.INF, false, true, false, onDraw);

        reset();
    }
    static fallingStuffGame(){
        App.closeAllDisplays();
        App.setScene(App.scene.park);
        App.toggleGameplayControls(false);
        App.petDefinition.checkWant(true, App.constants.WANT_TYPES.minigame);
        App.sendAnalytics('minigame_falling_stuff');
        App.mouse.x = null;

        App.pet.speedOverride = 0.07;
        App.pet.x = '50%';
        App.pet.stopMove();
        App.pet.triggerScriptedState('idle', 99999999, 0, true, null, (pet) => {
            if(App.mouse.x === null) return;

            const center = App.mouse.x - pet.spritesheet.cellSize/2;

            if(pet.x != center){
                const diff = pet.x - center;
                if(diff > 0) pet.inverted = false;
                else pet.inverted = true;
                pet.targetX = center;
                if(Math.abs(diff) > 0.5) pet.setState('moving');
            } else {
                pet.setState('idle_side');
            }
        });

        let lives = 2, moneyWon = 0;
        let nextSpawnMs = 0, projectileSpeed = 0.05, spawnDelay = 1250;
        const petHeight = 80 - App.pet.spritesheet.cellSize/1.2;
        const petWidth = 32/2;
        const spawnerObject = new Object2d({
            x: -999, y: -999,
            onDraw: () => {
                if(App.lastTime > nextSpawnMs){
                    nextSpawnMs = App.lastTime + spawnDelay;

                    projectileSpeed += 0.0018;
                    if(projectileSpeed > 0.15) projectileSpeed = 0.15;
                    spawnDelay -= 20;
                    if(spawnDelay < 800) spawnDelay = 800;

                    const xPercentage = randomFromArray(['10%', '37%', '63%', '90%']);
                    const isCurrentFaulty = random(0, 3) == 1;
                    const projectileObject = new Object2d({
                        parent: spawnerObject,
                        img: isCurrentFaulty ? 'resources/img/misc/falling_poop.png' : 'resources/img/misc/heart_particle_01.png',
                        y: -20, x: xPercentage, rotation: random(0, 180), z: 6, width: 15, height: 13,
                        speed: projectileSpeed,
                        onDraw: (me) => {
                            const xCenter = me.x - me.width/2;
                            me.y += me.speed * App.deltaTime;

                            me.rotation += me.speed * App.deltaTime;

                            if(
                                me.y > petHeight && me.y < 80 &&
                                xCenter > App.pet.x - petWidth && xCenter < App.pet.x + petWidth
                            ) {
                                spawnSmoke(xCenter, me.y);
                                me.removeObject();
                                me.setImg('resources/img/misc/heart_particle_02.png')
                                score(isCurrentFaulty);
                            }

                            if(me.y > 90) me.removeObject();
                        }
                    })
                }
            }
        })

        const spawnSmoke = (x, y) => {
            Prefab.fadingSmoke({x, y});
        }

        const screen = UI.empty();
        document.querySelector('.screen-wrapper').appendChild(screen);
        screen.innerHTML = `
        <div class="width-full" style="position: absolute; bottom: 0; left: 0;">
            <div class="flex-container" style="justify-content: space-between; padding: 4px">
                <div class="flex-container mini-game-ui">
                    $
                    <div id="moneyWon">${moneyWon}</div>
                </div>
                <div class="flex-container">
                    <div id="lives">${lives}</div>
                </div>
            </div>
        </div>
        `;

        const uiMoneyWon = screen.querySelector('#moneyWon'),
        uiLives = screen.querySelector('#lives');

        const updateUI = () => {
            uiMoneyWon.textContent = moneyWon;
            uiLives.innerHTML = new Array(lives).fill('').map(() => {
                return `<img src="resources/img/misc/heart_particle_01.png"></img>`
            }).join(' ');
        }

        updateUI();

        const finish = () => {
            screen.remove();
            spawnerObject.removeObject();
            if(moneyWon >= App.definitions.achievements.perfect_minigame_catch_win_x_gold.required){
                App.definitions.achievements.perfect_minigame_catch_win_x_gold.advance();
            }
            Activities.task_winMoney({
                amount: moneyWon,
                hasWon: moneyWon > 30,
                happiness: moneyWon / 6,
            })
        }

        const score = (faulty) => {
            if(faulty){
                App.playSound(`resources/sounds/sad.ogg`, true);
                lives--;
                if(lives == 0){
                    lives = 0;
                    finish();
                }
            } else {
                App.playSound(`resources/sounds/cute.ogg`, true);
                moneyWon += random(1, 3);
            }

            updateUI();
        }
    }
    static opponentMimicGame(){
        App.closeAllDisplays();
        App.setScene(App.scene.arcade);
        App.toggleGameplayControls(false);
        App.petDefinition.checkWant(true, App.constants.WANT_TYPES.minigame);
        App.sendAnalytics('minigame_mimic');

        const opponentPetDef = new PetDefinition({
            name: 'park_game_npc',
            sprite: 'resources/img/character/chara_175b.png',
        });

        const opponentPet = new Pet(opponentPetDef, {x: '70%'});

        let totalRounds = 3, playedRounds = 0, roundsWon = 0;

        const reset = () => {
            if(playedRounds >= totalRounds){
                opponentPet.removeObject();
                App.setScene(App.scene.arcade_game01);
                const moneyWon = roundsWon * 30;
                if(roundsWon === totalRounds){
                    App.definitions.achievements.perfect_minigame_mimic_win_x_times.advance();
                }
                Activities.task_winMoney({
                    amount: moneyWon,
                    happiness: roundsWon * 15,
                    hasWon: roundsWon !== 0,
                })
                return;
            }

            opponentPet.stopMove();
            opponentPet.triggerScriptedState('idle', App.INF, null, true);
            opponentPet.x = '70%';
            opponentPet.inverted = true;

            App.pet.x = '30%';
            App.pet.inverted = false;
            App.pet.stopMove();
            App.pet.triggerScriptedState('idle', App.INF, null, true);

            setTimeout(() => {
                const screen = App.displayEmpty();
                const imgPath = 'resources/img/ui/';
                screen.innerHTML = `
                <div class="flex-container flex-dir-col height-100p" style="background: var(--background-c)">
                    <div class="solid-surface-stylized inner-padding b-radius-10 relative">
                        <div class="surface-stylized" style="padding: 0px 10px;position: absolute;top: -20px;left: 0px;">
                            ${playedRounds + 1}/${totalRounds}
                        </div>
                        Which direction will your opponent turn?
                    </div>
                    <div class="mimic-game__btn-container">
                        <button id="left" class="generic-btn stylized"> <img src="${imgPath}facing_left.png"></img> </button>
                        <button id="center" class="generic-btn stylized"> <img src="${imgPath}facing_center.png"></img> </button>
                        <button id="right" class="generic-btn stylized"> <img src="${imgPath}facing_right.png"></img> </button>
                    </div>
                </div>
                `;
                ['left', 'center', 'right'].forEach((dir) => {
                    const btn = screen.querySelector(`#${dir}`);
                    btn.onclick = () => {
                        setPredictedDirection(dir);
                        screen.close();
                    }
                })
            }, 800)
        }

        reset();

        const deriveStateFromDirection = (dir) => {
            switch(dir){
                case 'center': return {state: 'idle', inverted: false};
                case 'right': return {state: 'idle_side', inverted: true};
                case 'left': return {state: 'idle_side', inverted: false};
            }
        }

        const setPredictedDirection = (dir) => {
            let randomDir = randomFromArray(['left', 'center', 'right']);
            setTimeout(() => {
                const playerState = deriveStateFromDirection(dir);
                App.pet.setState(playerState.state)
                App.pet.inverted = playerState.inverted;

                if(App.petDefinition.hasTrait('lucky') && random(1, 3) === 1) {
                    randomDir = dir;
                }

                const opponentState = deriveStateFromDirection(randomDir);
                opponentPet.setState(opponentState.state)
                opponentPet.inverted = opponentState.inverted;

                // if(randomDir === dir){
                //     App.playSound(`resources/sounds/task_complete_02.ogg`, true);
                // } else {
                //     App.playSound(`resources/sounds/task_fail_01.ogg`, true);
                // }
                App.playSound(`resources/sounds/task_complete.ogg`, true);

                setTimeout(() => {
                    playedRounds++;
                    if(randomDir === dir){
                        App.pet.setState('cheering');
                        opponentPet.setState('angry');
                        roundsWon++;
                    } else {
                        App.pet.setState('angry');
                        opponentPet.setState('cheering');
                    }
                    setTimeout(reset, 1000);
                }, 1500);
            }, 1000);
        }

        return false;
    }
    static parkRngGame(){
        /* unused */
        App.closeAllDisplays();
        App.setScene(App.scene.park);
        App.toggleGameplayControls(false);
        App.petDefinition.checkWant(true, App.constants.WANT_TYPES.minigame);
        App.sendAnalytics('minigame_park_rng');

        // const randomPetRef = App.getRandomPetDef();
        const randomPetRef = new PetDefinition({
            name: 'park_game_npc',
            sprite: 'resources/img/character/chara_175b.png',
        });
        const randomPet = new Pet(randomPetRef);
        randomPet.stopMove();
        randomPet.triggerScriptedState('eating', 5000, null, true);
        randomPet.x = 20;
        randomPet.inverted = true;

        App.pet.x = 80 - App.pet.spritesheet.cellSize;
        App.pet.inverted = false;
        App.pet.stopMove();
        App.pet.triggerScriptedState('eating', 5000, null, true, () => {
            App.drawer.removeObject(randomPet);
            App.pet.x = '50%';
            if(Math.random() > 0.5){ // win
                let winningGold = 25;
                App.pet.stats.gold += winningGold;
                App.pet.stats.current_fun += 35;
                App.pet.playCheeringAnimation(() => {
                    App.displayPopup(`${App.petDefinition.name} won $${winningGold}`);
                    App.toggleGameplayControls(true);
                    App.setScene(App.scene.home);
                    App.handlers.open_game_list();
                });
            } else {
                App.pet.playAngryAnimation(() => {
                    App.displayPopup(`${App.petDefinition.name} lost!`);
                    App.pet.stats.current_fun -= 15;
                    App.toggleGameplayControls(true);
                    App.setScene(App.scene.home);
                    App.handlers.open_game_list();
                });
            }
        });

        return false;
    }
    static async trickOrTreatGame(onEndCallback){
        App.closeAllDisplays();
        App.setScene(App.scene.devil_town_exterior)
        App.sendAnalytics('minigame_trick_or_treat');

        const defaultGroundPositionY = App.drawer.bounds.height - (App.petDefinition.spritesheet.cellSize / 2);

        const backgroundMusic = App.playAdvancedSound({
            src: 'resources/sounds/trick_or_treat_bm_01.mp3',
            loop: true,
            volume: 0.4,
        });

        const currencyIcon = App.getFoodCSprite(App.definitions.food[App.constants.UNDERWORLD_TREAT_CURRENCY]?.sprite);

        // init vars
        let activeSpeed = 2.5,
            globalOffset = 0,
            lastGlobalOffsetLooped = App.INF,
            globalSpawnOffset = App.drawer.bounds.width,
            spawnTicks = 0;

        // score vars
        let lives = 3, score = 0;

        const screen = UI.empty();
        document.querySelector('.screen-wrapper').appendChild(screen);
        screen.innerHTML = `
        <div class="width-full pointer-events-none" style="position: absolute; top: 0; left: 0;">
            <div class="flex-container" style="justify-content: space-between; padding: 4px">
                <div class="flex-container flex-gap-05 mini-game-ui">
                    ${currencyIcon}
                    <div id="score">${score}</div>
                </div>
                <div class="flex-container">
                    <div id="lives">${lives}</div>
                </div>
            </div>
        </div>
        `;
        const uiScore = screen.querySelector('#score'),
            uiLives = screen.querySelector('#lives');
        const updateUI = () => {
            uiScore.textContent = score;
            uiLives.innerHTML = new Array(lives).fill('').map(() => {
                return `<img src="resources/img/misc/heart_particle_01.png"></img>`
            }).join(' ');
        }
        updateUI();

        const sceneParent = new Object2d({})

        const onEndFn = async () => {
            screen.remove();
            App.pet.stopScriptedState();
            sceneParent.onDraw = undefined;
            App.toggleGameplayControls(false);
            backgroundMusic.stop();

            App.addNumToObject(App.pet.inventory.food, App.constants.UNDERWORLD_TREAT_CURRENCY, score);

            App.pet.triggerScriptedState('idle', App.INF, 0, true);
            App.pet.x = '50%';
            App.pet.y = '100%';

            const msg = App.displayMessageBubble(`${currencyIcon} x${score}`)

            const onEnd = () => {
                App.toggleGameplayControls(true);
                sceneParent.removeObject();
                msg.close();
                onEndCallback?.();
            }

            if(score >= 5) App.pet.playCheeringAnimation(onEnd);
            else App.pet.playUncomfortableAnimation(onEnd);
        }

        let jumpCount = 0, groundPositionY = false;

        const handleOnJump = () => {
            if(groundPositionY === false) {
                groundPositionY = isNaN(App.pet.y) ? defaultGroundPositionY : App.pet.y;
            }
            const jump = () => {
                App.pet.playSound('resources/sounds/jump.ogg', true);

                const gravity = 0.001;
                let velocity = 0.31;
                App.pet.triggerScriptedState('talking', App.INF, 0, true,
                    () => {
                        App.pet.y = groundPositionY;
                        jumpCount = 0;
                    },
                    () => {
                        velocity -= gravity * App.deltaTime;
                        App.pet.y -= velocity * App.deltaTime;
                        if(App.pet.y >= groundPositionY || App.pet.y >= defaultGroundPositionY){
                            App.pet.stopScriptedState();
                            App.pet.triggerScriptedState('idle_side', App.INF, false, true)
                        }
                    }
                )
            }
            if(++jumpCount <= 2){
                jump();
            }
        }

        App.toggleGameplayControls(false, () => {})

        const driverFn = () => {
            if(App.mouse.isDown){
                App.mouse.isDown = false;
                handleOnJump();
            }

            if(App.pet.y > defaultGroundPositionY){
                App.pet.y = defaultGroundPositionY;
            }

            activeSpeed += 0.000045 * App.deltaTime;
            // activeSpeed -= (0.001 * App.deltaTime);
            activeSpeed = clamp(activeSpeed, 0, 5);
            globalOffset += activeSpeed * 0.025 * App.deltaTime;
            if(!jumpCount) {
                App.pet.setState(activeSpeed ? 'moving' : 'idle_side');
            }

            const globalOffsetLooped = globalOffset % App.drawer.bounds.width;
            if(globalOffsetLooped < lastGlobalOffsetLooped){
                spawnEntities();
            }
            lastGlobalOffsetLooped = globalOffsetLooped;
        }
        sceneParent.onDraw = driverFn;

        const spawnEntities = (xOffset = globalOffset) => {
            spawnTicks++;
            const moverFn = (me, moveSpeed = 1) => {
                if (me._xOffset === undefined) me._xOffset = me.x + ((App.drawer.bounds.width / moveSpeed) - App.drawer.bounds.width);
                me.x = ((globalOffset - xOffset - me._xOffset) * moveSpeed);
                if (me.x >= App.drawer.bounds.width * 2) {
                    me?.removeObject();
                }
            }
            const spawnImpactEffect = (me) => {
                const bb = me.getBoundingBox();
                Prefab.fadingSmoke({
                    x: bb.centerX,
                    y: bb.centerY,
                    horizontalMovementSpeed: activeSpeed * -0.02,
                    spawnScale: 1,
                })
            }
            const progress = (isScoring) => {
                if(isScoring) {
                    score++;
                    App.playSound(`resources/sounds/cute.ogg`, true)
                } else {
                    lives--
                    App.playSound(`resources/sounds/sad.ogg`, true)
                }
                updateUI();
                if(lives <= 0) onEndFn();
            }

            // background trees
            for(let i = 0; i < 1; i++){
                const tree = new Object2d({
                    parent: sceneParent,
                    img: 'resources/img/misc/devil_tree_01.png',
                    x: (i * (App.drawer.bounds.width/1)) + random(-4, 4) + globalSpawnOffset,
                    y: random(10, 60),
                    z: -0.1,
                    inverted: !!random(0, 1),
                    onDraw: () => moverFn(tree, 0.8),
                })
            }

            // foreground trees
            for(let i = 0; i < 1; i++){
                const tree = new Object2d({
                    parent: sceneParent,
                    img: 'resources/img/misc/devil_tree_01.png',
                    x: (i * (App.drawer.bounds.width/1)) + random(-32, 32) + globalSpawnOffset,
                    y: random(70, 80),
                    z: App.pet.z + 1,
                    inverted: !!random(0, 1),
                    onDraw: () => moverFn(tree, 1.2),
                })
            }

            // obstacle
            if(spawnTicks > 5 && spawnTicks % 4 === 0){
                const bat = new Object2d({
                    parent: sceneParent,
                    img: 'resources/img/misc/bat_01.png',
                    x: ((App.drawer.bounds.width/1)) + 32 + globalSpawnOffset,
                    y: `${randomFromArray([20, 70])}%`,
                    z: App.pet.z + 0.1,
                    onDraw: (me) => {
                        if(!isNaN(me.y)){
                            Object2d.animations.bob(me, 0.01)
                        }
                        moverFn(me, 1);
                        if(me.isColliding(App.pet.getBoundingBox(12, 4))){
                            me.removeObject();
                            progress(false);
                        }
                    },
                    onRemove: spawnImpactEffect,
                })
                bat.showOutline('red');
                return;
            }

            // treat
            if(spawnTicks % 3 === 0){
                const spawnAmount = random(0, 100) <= 45 ? 2 : 1;
                for(let i = 0; i < spawnAmount; i++){
                    const treat = new Object2d({
                        parent: sceneParent,
                        img: App.constants.FOOD_SPRITESHEET,
                        spritesheet: {
                            ...App.constants.FOOD_SPRITESHEET_DIMENSIONS,
                            cellNumber: App.definitions.food[App.constants.UNDERWORLD_TREAT_CURRENCY].sprite,
                        },
                        x: ((App.drawer.bounds.width/1)) + globalSpawnOffset + (i * 16),
                        y: `${randomFromArray([20, 70])}%`,
                        z: App.pet.z - 0.1,
                        bobFloat: Math.random(),
                        onDraw: (me) => {
                            if(!isNaN(me.y)){
                                Object2d.animations.bob(me)
                            }
                            moverFn(me, 1);
                            if(me.isColliding(App.pet.getBoundingBox())){
                                me.removeObject();
                                progress(true);
                            }
                        },
                        onRemove: spawnImpactEffect,
                    })
                    treat.showOutline();
                    // treat.showBoundingBox();
                }
            }
        }
        // initial spawning of the first two chunks
        // otherwise the pet would run with no entities around at the start
        spawnEntities(App.drawer.bounds.width * -1);
        spawnEntities(App.drawer.bounds.width * -2);

        const movingBackgrounds = new Array(2)
            .fill(true)
            .map((_, i) =>
                new Object2d({
                    parent: sceneParent,
                    img: 'resources/img/misc/devil_walkway_01.png',
                    x: 0,
                    y: 0,
                    z: 0,
                    onDraw: (me) => {
                        me.x = (globalOffset % App.drawer.bounds.width) + (-i * App.drawer.bounds.width);
                    }
                })
            )

        App.pet.stopMove();
        App.pet.triggerScriptedState('idle_side', App.INF, false, true);
        App.pet.inverted = false;
        App.pet.x = '80%';
    }
    static async leavesGame(){
        App.closeAllDisplays();
        App.setScene(App.scene.full_grass);
        App.petDefinition.checkWant(true, App.constants.WANT_TYPES.minigame);
        App.toggleGameplayControls(false, () => {}, false)
        App.playSound(`resources/sounds/note_4.mp3`, true);
        App.sendAnalytics('minigame_leaves')

        App.pet.stopMove();
        App.pet.x = 9999;

        const targetLeavesCount = 250;
        let timeSeconds = 15;
        const screen = UI.empty();
        document.querySelector('.screen-wrapper').appendChild(screen);
        screen.innerHTML = `
        <div class="width-full pointer-events-none" style="position: absolute; top: 0; left: 0;">
            <div class="flex-container" style="justify-content: space-between; padding: 4px">
                <div class="flex-container flex-gap-05 mini-game-ui">
                    <div id="time">${timeSeconds}</div>
                </div>
            </div>
        </div>
        `;
        const timeElement = screen.querySelector('#time');
        const timerInterval = setInterval(() => {
            timeSeconds -= 1;
            timeElement.textContent = clamp(timeSeconds, 0, Infinity);
        }, 1000)

        let currentLeavesCount = targetLeavesCount;

        const activeForce = {
            strength: 0,
            origin: { x: 0, y: 0 },
            maxDistance: 25
        }

        const leavesParent = new Object2d({});
        const spawnLeaf = () => {
            const leaf = new Object2d({
                img: `resources/img/misc/leaves_01.png`,
                spritesheet: {
                    cellSize: 13,
                    cellNumber: random(1, 8),
                    rows: 2,
                    columns: 4,
                },
                x: `${random(5, 95)}%`,
                y: `${random(5, 95)}%`,
                rotation: random(0, 180),
                parent: leavesParent,

                velocityX: 0,
                velocityY: 0,
                drag: 0.91,
                shouldDespawn: false,
                opacity: 1,
                scale: 1 + ((Math.random() - 0.5) * 0.1),

                onDraw: (me) => {
                    if(typeof me.x === 'string') return;

                    if (activeForce.strength > 0) {
                        const manhattanDistX = Math.abs(me.x - activeForce.origin.x);
                        const manhattanDistY = Math.abs(me.y - activeForce.origin.y);
                        const manhattanDist = manhattanDistX + manhattanDistY;

                        if (manhattanDist < activeForce.maxDistance) {
                            const dirX = me.x > activeForce.origin.x ? 1 : -1;
                            const dirY = me.y > activeForce.origin.y ? 1 : -1;

                            const forceScale = 1 - (manhattanDist / activeForce.maxDistance);
                            const forceMagnitude = activeForce.strength * forceScale * forceScale;

                            me.velocityX += dirX * forceMagnitude * (manhattanDistX / manhattanDist);
                            me.velocityY += dirY * forceMagnitude * (manhattanDistY / manhattanDist);
                        }
                    }

                    me.x += me.velocityX * App.deltaTime;
                    me.y += me.velocityY * App.deltaTime;

                    // slow down
                    me.velocityX *= me.drag;
                    me.velocityY *= me.drag;

                    me.rotation += (me.velocityX * 100) % 360;

                    if(
                        me.x <= 0 || me.x >= App.drawer.bounds.width - me.spritesheet.cellSize ||
                        me.y <= 5 || me.y > App.drawer.bounds.height - me.spritesheet.cellSize
                    ) {
                        me.shouldDespawn = true;
                    }

                    if(me.shouldDespawn){
                        me.opacity -= 0.05;
                        if(me.opacity <= 0){
                            currentLeavesCount -= 1;
                            me.removeObject();
                        }
                    }
                }
            })
            return leaf;
        }

        const onEnd = () => {
            App.toggleGameplayControls(false);
            App.pet.stopScriptedState();
            screen.remove();
            clearInterval(timerInterval);
            setTimeout(() => App.playSound(`resources/sounds/task_complete_02.ogg`, true))
            setTimeout(() => {
                App.fadeScreen({
                    middleFn: () => {
                        // todo: change the reward calculation from amount to time left
                        const hasWon = currentLeavesCount <= 0;
                        if(hasWon){
                            App.definitions.achievements.perfect_minigame_leaves_win_x_times.advance();
                        }
                        Activities.task_winMoney({
                            hasWon,
                            amount: clamp(
                                    Math.floor(((targetLeavesCount - currentLeavesCount) / 5 )- (currentLeavesCount ? 20 : 0)),
                                0, Infinity),
                        })
                        leavesParent.removeObject();
                    }
                })
            }, 500);
        }

        let lastSmokeSpawnTime = 0;
        const driverFn = () => {
            if(currentLeavesCount <= 0 || timeSeconds <= 0) onEnd();

            if(!App.mouse.isInBounds || !App.mouse.isDown) return;

            activeForce.strength = 0.05;
            activeForce.origin = {
                x: App.mouse.x,
                y: App.mouse.y
            }

            if(App.time > lastSmokeSpawnTime + 100){
                lastSmokeSpawnTime = App.time;
                App.playSound(`resources/sounds/swoosh_0${random(1, 2)}.ogg`, true);
                new Object2d({
                    img: 'resources/img/misc/foam_single.png',
                    x: activeForce.origin.x - 12,
                    y: activeForce.origin.y - 12,
                    z: 6, opacity: 1, scale: random(3, 6) * 0.1,
                    rotation: random(0, 180),
                    onDraw: (me) => {
                        me.rotation += 0.1 * App.deltaTime;
                        me.opacity -= 0.001 * App.deltaTime;
                        me.scale -= 0.001 * App.deltaTime;
                        me.y -= 0.05 * App.deltaTime;
                        if(me.opacity <= 0.1 || me.scale <= 0.1) me.removeObject();
                    }
                })
            }
        }

        // Spawn leaves with some initial random velocity for more natural feel
        for(let i = 0 ; i < currentLeavesCount; i++){
            const leaf = spawnLeaf();
            App._leaf =leaf;
        }

        App.pet.triggerScriptedState('idle', App.INF, false, true, null, driverFn);
    }
    static async foodKnowledgeGame(){
        App.closeAllDisplays();
        App.setScene(App.scene.full_grass);
        App.petDefinition.checkWant(true, App.constants.WANT_TYPES.minigame);
        App.sendAnalytics('minigame_food_knowledge')

        const main = new TimelineDirector(App.pet);
        main.setPosition({
            x: '50%',
        })

        const getRandomFood = (amount = 1) => {
            const allFoodItems = App.definitions.pools.food();
            const meals = allFoodItems.filter(item => item.definition.type !== 'med');
            const shuffled = shuffleArray(meals);
            return shuffled.slice(0, amount);
        }

        const foodOptions = getRandomFood(4);
        const targetFoodItem = randomFromArray(foodOptions);

        const foodObject = new Object2d({
            image: App.preloadedResources[App.constants.FOOD_SPRITESHEET],
            spritesheet: {
                ...App.constants.FOOD_SPRITESHEET_DIMENSIONS,
                cellNumber: targetFoodItem.definition.sprite,
            },
            scale: 2,
            x: '50%',
            y: '40%',
            z: App.pet.z + 10,
            noPreload: true,
            filter: `brightness(0)`,

            movementFloat: 0,
            movementStr: 4,
            targetBrightness: 0,
            currentBrightness: 0,
            onLateDraw: (me) => {
                if(!me.originalPosition){
                    me.originalPosition = {x: me.x, y: me.y};
                }

                me.movementFloat += 0.0035 * App.deltaTime;
                me.y = me.originalPosition.y + (Math.sin(me.movementFloat) * me.movementStr);
                me.x = me.originalPosition.x + (Math.sin(me.movementFloat * .5) * me.movementStr);

                me.currentBrightness = lerp(me.currentBrightness, me.targetBrightness, 0.005 * App.deltaTime);
                me.filter = `brightness(${me.currentBrightness})`;
            }
        })

        const handleSelectOption = async (selectedItemName) => {
            const isCorrect = selectedItemName === targetFoodItem.name;
            if(isCorrect){
                main.setState('cheering');
            } else {
                main.setState('uncomfortable');
            }

            App.toggleGameplayControls(false);
            foodObject.targetBrightness = 1;
            await TimelineDirector.wait(1000);
            const msgBubble = App.displayMessageBubble(targetFoodItem.name);
            await TimelineDirector.wait(3000);
            msgBubble.close();

            App.fadeScreen({
                middleFn: () => {
                    foodObject.removeObject();
                    main.release();
                    if(isCorrect){
                        App.definitions.achievements.perfect_minigame_foodknowledge_win_x_times.advance();
                    }
                    Activities.task_winMoney({
                        amount: isCorrect ? 50 : 0,
                        hasWon: isCorrect
                    })
                }
            })
        }

        App.toggleGameplayControls(false, () => {
            App.displayList([
                {
                    name: 'What food is that?',
                    type: 'text',
                },
                ...foodOptions.map(item => ({
                    name: item.name,
                    onclick: () => {
                        handleSelectOption(item.name)
                    }
                }))
            ])
        })
    }
    static async imagePuzzleGame(){
        App.closeAllDisplays();
        App.setScene(App.scene.arcade_game01);
        App.petDefinition.checkWant(true, App.constants.WANT_TYPES.minigame);
        App.sendAnalytics('minigame_image_puzzle');
        App.toggleGameplayControls(false, () => {}, false);

        const TILE_SIZE = 3;
        const CELL_SIZE = 32;
        let grid = [];
        const image = randomFromArray([
            // 'resources/img/background/house/devil_town_01.png',
            // 'resources/img/background/house/music_classroom_01.png',
            // 'resources/img/background/house/cc_04.png',
            // 'resources/img/background/house/c_01.png',
            // 'resources/img/background/house/cc_02.png',
            // 'resources/img/background/house/cc_06.png',
            // 'resources/img/background/house/beach_01.png',
            // 'resources/img/background/house/parents_house_01.png',
            // 'resources/img/background/house/ex_01_fs.png',
            // 'resources/img/background/house/post_office_01.png',
            'resources/img/misc/image_puzzle_01.png',
        ]);

        const parent = new Object2d({
            img: 'resources/img/misc/image_puzzle_bg.png',
            ...App.drawer.bounds,
        });

        const main = new TimelineDirector(App.pet);
        main.setPosition({x: 999});

        const onEnd = (hasWon) => {
            main.setPosition({x: '50%'});
            main.release();
            App.toggleGameplayControls(true);
            parent.removeObject();
            closeBtn.remove();
            if(hasWon){
                App.definitions.achievements.perfect_minigame_imagepuzzle_win_x_times.advance();
            }
            Activities.task_winMoney({
                hasWon,
                amount: hasWon ? 10 * random(16, 20) : 0,
            })
        }

        const closeBtn = UI.create({
            parent: document.querySelector('.screen-wrapper'),
            componentType: 'button',
            className: 'mini-game-ui',
            innerHTML: App.getIcon('sign-out', true),
            style: "position: absolute;right: 0;top: 0;padding: 2px;",
            onclick: () => {
                App.displayConfirm(...GenericUIDef.binaryConfirm({
                    text: 'Exit the game?',
                    onAccept: () => {
                        onEnd();
                    }
                }))
            }
        })

        // generate and shuffle positions
        const shuffleBoard = (positions, moveCount = 10) => {
            const board = [0, ...positions];

            let emptyIndex = 0;
            let previousEmptyIndex = null;

            for (let i = 0; i < moveCount; i++) {
                const x = emptyIndex % TILE_SIZE;
                const y = Math.floor(emptyIndex / TILE_SIZE);

                let possibleMoves = [];

                if (x > 0) possibleMoves.push(emptyIndex - 1);
                if (x < TILE_SIZE - 1) possibleMoves.push(emptyIndex + 1);
                if (y > 0) possibleMoves.push(emptyIndex - TILE_SIZE);
                if (y < TILE_SIZE - 1) possibleMoves.push(emptyIndex + TILE_SIZE);

                // prevent undoing previous move
                if (previousEmptyIndex !== null) {
                    possibleMoves = possibleMoves.filter(
                        index => index !== previousEmptyIndex
                    );
                }

                const moveIndex = randomFromArray(possibleMoves);

                [board[emptyIndex], board[moveIndex]] = [
                    board[moveIndex],
                    board[emptyIndex],
                ];

                previousEmptyIndex = emptyIndex;
                emptyIndex = moveIndex;
            }

            return {
                positions: board.filter(value => value !== 0),
                emptyPos: {
                    x: emptyIndex % TILE_SIZE,
                    y: Math.floor(emptyIndex / TILE_SIZE),
                },
            };

        };
        const positions = [];
        for (let i = 0; i < TILE_SIZE * TILE_SIZE; i++) {
            if (i === 0) continue;
            positions.push(i + 1);
        }
        const {
            positions: shuffledPositions,
            emptyPos
        } = shuffleBoard(positions, random(15, 25));

        const displayOverlayImage = (isFinal) => {
            return new Object2d({
                parent,
                img: image,
                x: 0,
                y: 0,
                z: 99999,
                spawnTime: App.time,
                filter: isFinal ? false : 'saturate(0.5)',
                onDraw: (me) => {
                    if(App.time > me.spawnTime + 2000){
                        helpObject.hasHelperImage = false;
                        return me.removeObject();
                    }

                    const time = App.time - me.spawnTime;
                    me.opacity = 0.5 + (Math.sin(time * 0.005));
                    if(isFinal) me.opacity = 1;
                },
            })
        }
        const checkWin = () => {
            let expected = 1;

            for (let y = 0; y < TILE_SIZE; y++) {
                for (let x = 0; x < TILE_SIZE; x++) {

                    if (x === 0 && y === 0) continue; // empty slot

                    const tile = grid[y][x];

                    if (!tile) return false;

                    if (tile.spritesheet.cellNumber - 1 !== expected) {
                        return false;
                    }

                    expected++;
                }
            }

            setTimeout(() => onEnd(true), 2000);
            displayOverlayImage(true);

            return true;
        }
        const helpObject = new Object2d({
            parent,
            width: CELL_SIZE,
            height: CELL_SIZE,
            img: 'resources/img/misc/help_circle.png',
            x: 0, y: 0,
            spawnTime: App.time,
            onDraw: (me) => {
                me.x = emptyPos.x * CELL_SIZE;
                me.y = emptyPos.y * CELL_SIZE;

                const time = App.time - me.spawnTime;
                me.opacity = 0.2 + Math.abs(Math.sin(time * 0.002));

                if(me.hasHelperImage) me.opacity = 0;
            },
            onClick: () => {
                if(App.haveAnyDisplays()) return;
                if(helpObject.hasHelperImage) return;
                helpObject.hasHelperImage = true;
                displayOverlayImage();
                App.playSound('resources/sounds/ui_click_06.ogg', true);
            }
        })

        let index = 0;
        for (let y = 0; y < TILE_SIZE; y++) {
            grid[y] = [];
            for (let x = 0; x < TILE_SIZE; x++) {
                // empty slot
                if(x === emptyPos.x && y === emptyPos.y) {
                    grid[y][x] = null;
                    continue;
                }

                const cellNumber = shuffledPositions[index++];

                const tileObject = new Object2d({
                    parent,
                    img: image,
                    spritesheet: {
                        rows: TILE_SIZE,
                        columns: TILE_SIZE,
                        cellSize: CELL_SIZE,
                        cellNumber: cellNumber,
                    },
                    x: x * CELL_SIZE,
                    y: y * CELL_SIZE,
                    onDraw: (me) => {
                        if(!isNaN(me.targetX)) me.x = lerp(me.x, me.targetX, 0.025 * App.deltaTime);
                        if(!isNaN(me.targetY)) me.y = lerp(me.y, me.targetY, 0.025 * App.deltaTime);
                    },
                    onClick: () => {
                        if(App.haveAnyDisplays()) return;

                        const tile = tileObject;
                        const { gridX, gridY } = tile;

                        const ex = emptyPos.x;
                        const ey = emptyPos.y;

                        if (!isAdjacent(gridX, gridY, ex, ey)) {
                            App.playSound('resources/sounds/ui_click_04.ogg', true);
                            return;
                        }

                        tile.targetX = ex * CELL_SIZE;
                        tile.targetY = ey * CELL_SIZE;

                        grid[ey][ex] = tile;
                        grid[gridY][gridX] = null;

                        tile.gridX = ex;
                        tile.gridY = ey;

                        emptyPos.x = gridX;
                        emptyPos.y = gridY;

                        App.playSound('resources/sounds/swoosh_01.ogg', true);

                        checkWin();
                    }
                });

                tileObject.gridX = x;
                tileObject.gridY = y;

                grid[y][x] = tileObject;
            }
        }
    }

    // school
    static async school_ExpressionGame({onEndFn, maxRounds = 3} = {}){
        App.closeAllDisplays();
        App.setScene(App.scene.music_classroom);
        App.pet.stopMove();
        App.pet.triggerScriptedState('idle', App.INF, 0, true);
        App.sendAnalytics('school_minigame_expression');
        App.toggleGameplayControls(false);

        App.pet.x = '50%';
        App.pet.y = '36%';

        const screen = UI.empty();
        document.querySelector('.screen-wrapper').appendChild(screen);
        screen.innerHTML = `
        <div class="flex flex-dir-col justify-between height-100p width-full" style="position: absolute; top: 0; left: 0;">
            <div class="mini-game-ui flex align-center justify-between">
                <div class="flex align-center">
                    <i style="margin-right: 4px;" class="fa-solid fa-stopwatch icon"></i>
                    <div id="round">
                        <span class="opacity-half">${0}</span>
                    </div>
                </div>
                <div class="flex align-center">
                    <i style="margin-right: 4px;" class="fa-solid fa-star icon"></i>
                    <div id="score">${0}</div>
                </div>
            </div>
            <div class="simon-says pointer-events-none">
                <div id="green" class="simon-says-button"></div>
                <div id="red" class="simon-says-button"></div>
                <div id="yellow" class="simon-says-button"></div>
                <div id="blue" class="simon-says-button"></div>
                <div class="simon-says-indicator"></div>
            </div>
        </div>
        `;

        let playerInputBuffer = [];
        let round = 0, wonRounds = 0;

        const container = screen.querySelector('.simon-says');
        const buttons = screen.querySelectorAll('#green, #red, #yellow, #blue');
        const [green, red, yellow, blue] = buttons;
        buttons.forEach((button, index) => {
            button.playSound = () => App.playSound(`resources/sounds/note_${index + 1}.mp3`, true);
            button.onclick = () => {
                setTimeout(() => button.playSound());
                playerInputBuffer.push(button);
            }
        })

        const updateUI = () => {
            screen.querySelector('#round').textContent = `(${Math.max(round, 1)}/${maxRounds})`;
            screen.querySelector('#score').textContent = wonRounds;
        }
        updateUI();

        const endFn = () => {
            screen.remove();
            App.pet.y = '100%';
            onEndFn?.(wonRounds);
            App.toggleGameplayControls(true);
            Activities.task_winSkillPointFromSchool({
                amount: wonRounds,
                hasWon: wonRounds >= 2,
                icon: App.getIcon('special:expression'),
            })
        }

        const initSequence = async (turns = 3) => {
            round++;
            updateUI();
            container.classList.add('pointer-events-none');
            const sequence = new Array(turns).fill(null).map(() => randomFromArray([...buttons]));
            playerInputBuffer = [];

            for(let button of sequence){
                button.classList.add('active');
                button.playSound();
                await App.wait(500);
                button.classList.remove('active');
                await App.wait(500);
            }

            container.classList.remove('pointer-events-none');
            const hasWon = await new Promise(resolve => {
                const interval = setInterval(() => {
                    if(!playerInputBuffer.length) return;
                    const playerInputLastIndex = playerInputBuffer.length - 1;
                    if(playerInputBuffer.at(playerInputLastIndex) !== sequence.at(playerInputLastIndex)){
                        resolve(false);
                        clearInterval(interval);
                    } else if(playerInputBuffer.length === sequence.length){
                        resolve(true);
                        clearInterval(interval);
                    }
                }, 16)
            })
            container.classList.add('pointer-events-none');
            if(hasWon) {
                container.classList.add('win');
                wonRounds++;
                updateUI();
            }
            else container.classList.add('lose');
            setTimeout(() => {
                if(round < maxRounds){
                    container.classList.remove('win');
                    container.classList.remove('lose');
                }
                setTimeout(() => {
                    if(round < maxRounds) initSequence(turns + 1);
                    else endFn();
                }, 1000);
            }, 1000)
        }

        setTimeout(() => {
            initSequence();
        }, 1000)
    }
    static async school_ExpressionGameX2(){
        App.closeAllDisplays();
        App.setScene(App.scene.music_classroom);
        App.pet.stopMove();
        App.pet.triggerScriptedState('idle', App.INF, 0, true);

        let lastSpawnTime = 0;


        App.toggleGameplayControls(false, () => {});

        const otherPet = new Pet(App.getRandomPetDef(App.petDefinition.lifeStage));
        otherPet.triggerScriptedState('idle', App.INF, 0, true);

        const spawnNoteBlocks = (x = '25%') => {
            const mainPetBoundingBox = App.pet.getBoundingBox();
            const height = random(6, 32);
            new Object2d({
                solidColor: {
                    r: 255,
                    g: 0,
                    b: 150
                },
                width: 6,
                height,
                z: App.constants.ACTIVE_PET_Z - 0.1,
                x,
                y: App.drawer.bounds.height + height,
                onDraw: (me) => {
                    if(typeof me.y === 'string') return;
                    me.y -= 0.1 * App.deltaTime;
                    if(me.y < -height){
                        me.removeObject();
                        return
                    }

                    const blockTop = me.y;
                    const petBottom = mainPetBoundingBox.y + mainPetBoundingBox.height;

                    if (blockTop <= petBottom) {
                        const overlap = petBottom - blockTop;
                        if(App.mouse.isDown){
                            me.solidColor = { r: 0, g: 255, b: 55 };
                        } else {
                            me.solidColor = { r: 255, g: 0, b: 0 };
                        }
                        me.height = Math.max(0, me.height - overlap);
                        me.y += overlap;
                    }
                }
            })
        }

        const driverFn = App.registerOnDrawEvent(() => {
            if(App.time > lastSpawnTime + 800){
                lastSpawnTime = App.time;
                spawnNoteBlocks(randomFromArray(['25%', '75%']));
            }
            App.pet.setState(App.mouse.isDown ? 'jumping' : 'idle');
        })

        // positions
        App.pet.x = '25%';
        App.pet.y = '36%';
        otherPet.x = '75%';
        otherPet.y = '36%';
    }
    static async school_ExpressionGameX({onEndFn} = {}){
        App.closeAllDisplays();
        App.setScene(App.scene.classroom);
        App.pet.x = '75%';
        App.pet.y = '100%';
        App.pet.triggerScriptedState('idle', App.INF, 0, true);
        App.toggleGameplayControls(false);

        let timeLeft = 30, currentScore = 0;

        const screen = UI.empty();
        document.querySelector('.screen-wrapper').appendChild(screen);
        screen.innerHTML = `
        <div class="flex flex-dir-col justify-between height-100p width-full" style="position: absolute; top: 0; left: 0;">
            <div class="mini-game-ui flex align-center justify-between">
                <div class="flex align-center">
                    <i style="margin-right: 4px;" class="fa-solid fa-stopwatch icon"></i>
                    <div id="time-left">
                        <span class="opacity-half">${timeLeft}</span>
                    </div>
                </div>
                <div class="flex align-center">
                    <div id="score">${currentScore}</div>
                </div>
            </div>
            <div class="mix-colors-container">
                <button id="reset" class="generic-btn stylized justify-center">
                    <div class="color" style="background: white;"></div>
                </button>
                <button id="red" class="generic-btn stylized justify-center">
                    <div class="color" style="background: red;"></div>
                </button>
                <button id="yellow" class="generic-btn stylized justify-center">
                    <div class="color" style="background: yellow;"></div>
                </button>
                <button id="blue" class="generic-btn stylized justify-center">
                    <div class="color" style="background: blue;"></div>
                </button>
            </div>
        </div>
        `;

        const playerColorTaps = {
            red: 0,
            yellow: 0,
            blue: 0
        }
        const COLORS = {
            red:   { r: 255, g: 0,   b: 0   },
            blue:  { r: 0,   g: 0,   b: 255 },
            yellow:{ r: 255, g: 255, b: 0   }
        };
        const mixColors = (taps) => {
            let total = taps.red + taps.blue + taps.yellow;
            if (total === 0) return { r: 255, g: 255, b: 255 }; // default black

            let r = (
                COLORS.red.r * taps.red +
                COLORS.blue.r * taps.blue +
                COLORS.yellow.r * taps.yellow
            ) / total;

            let g = (
                COLORS.red.g * taps.red +
                COLORS.blue.g * taps.blue +
                COLORS.yellow.g * taps.yellow
            ) / total;

            let b = (
                COLORS.red.b * taps.red +
                COLORS.blue.b * taps.blue +
                COLORS.yellow.b * taps.yellow
            ) / total;

            return { r: Math.round(r), g: Math.round(g), b: Math.round(b) };
        }
        const getColorDistance = (c1, c2) => {
            return Math.sqrt(
                Math.pow(c1.r - c2.r, 2) +
                Math.pow(c1.g - c2.g, 2) +
                Math.pow(c1.b - c2.b, 2)
            );
        }

        const targetPainting = new Object2d({
            solidColor: {
            r: random(0, 255),
            g: random(0, 255),
            b: random(0, 255)
        },
            width: 24,
            height: 24,
            x: '25%',
            y: '50%',
        })
        const playerPainting = new Object2d({
            solidColor: {
                r: 255,
                g: 255,
                b: 255,
            },
            width: 24,
            height: 24,
            x: '75%',
            y: '50%',
            onDraw: (me) => {
                me.solidColor = mixColors(playerColorTaps);
                // console.log(playerColorTaps, me.solidColor)
            }
        })

        const uiUpdateInterval = setInterval(() => {
            screen.querySelector('#score').textContent = getColorDistance(playerPainting.solidColor, targetPainting.solidColor).toFixed(1);
        }, 100)

        const [resetButton, redButton, yellowButton, blueButton] = screen.querySelectorAll('#reset, #red, #yellow, #blue');
        redButton.onclick = () => playerColorTaps.red ++;
        yellowButton.onclick = () => playerColorTaps.yellow ++;
        blueButton.onclick = () => playerColorTaps.blue ++;
        resetButton.onclick = () => {
            playerColorTaps.red = 0;
            playerColorTaps.yellow = 0;
            playerColorTaps.blue = 0;
        }
    }
    static async school_EnduranceGame({onEndFn} = {}){
        App.closeAllDisplays();
        App.setScene(App.scene.classroom);
        App.pet.stopMove();
        App.pet.x = '50%';
        App.pet.y = '100%';
        App.pet.triggerScriptedState('idle', App.INF, 0, true);
        App.sendAnalytics('school_minigame_endurance');

        let jumpingRope;
        let currentScore = 0, canScore = false, timeLeft = 12, firstJump = false;

        const screen = UI.empty();
        document.querySelector('.screen-wrapper').appendChild(screen);
        screen.innerHTML = `
        <div class="width-full pointer-events-none" style="position: absolute; bottom: 0; left: 0;">
            <div class="mini-game-ui flex align-center justify-between">
                <div class="flex align-center">
                    <i style="margin-right: 4px;" class="fa-solid fa-stopwatch icon"></i>
                    <div id="time-left">
                        <span class="opacity-half">${timeLeft}</span>
                    </div>
                </div>
                <div class="flex align-center">
                    <div id="score">${currentScore}</div>
                </div>
            </div>
        </div>
        `;

        const checkProgress = (isScoring) => {
            if(isScoring){
                firstJump = true;
                if(canScore){
                    currentScore++;
                    setTimeout(() => App.playSound('resources/sounds/ui_click_03.ogg', true));
                    updateUI();
                }
            }
            if(timeLeft <= 0){
                App.toggleGameplayControls(false);
                jumpingRope?.removeObject();
                screen.remove();
                App.pet.stopScriptedState();
                App.pet.y = '100%';
                const points = clamp(Math.floor(currentScore / 3), 0, 3);
                onEndFn?.(points);
                Activities.task_winSkillPointFromSchool({
                    amount: points,
                    hasWon: points > 1,
                    icon: App.getIcon('special:endurance'),
                })
            }
        }

        jumpingRope = new Object2d({
            img: 'resources/img/misc/jumping_rope_01.png',
            x: 0, y: 0, z: App.pet.z + 0.1,
            spritesheet: {
                cellSize: App.drawer.bounds.width,
                cellNumber: 1,
                rows: 1,
                columns: 4
            },
            onDraw: (me) => {
                const speed = 150;
                const previousAnimFrame = me.spritesheet.cellNumber;
                Object2d.animations.cycleThroughFrames(me, speed, true);
                const currentAnimFrame = me.spritesheet.cellNumber;
                if(currentAnimFrame === 1){
                    me.z = App.constants.ACTIVE_PET_Z + 0.1;
                } else if(currentAnimFrame >= me.spritesheet.rows * me.spritesheet.columns){
                    me.z = App.constants.ACTIVE_PET_Z - 0.1;
                }

                if(previousAnimFrame !== currentAnimFrame && currentAnimFrame === 3 && me.z > App.pet.z){
                    App.pet.setState('jumping');
                    App.pet.filter = 'brightness(1.35)';
                    canScore = true;
                    setTimeout(() => {
                        App.pet.filter = '';
                        canScore = false;
                        if(!jumpingRope || jumpingRope.isRemoved) return;
                        App.pet.setState('idle');
                    }, speed);
                }
            }
        })

        const updateUI = () => {
            screen.querySelector('#time-left').textContent = timeLeft;
            screen.querySelector('#score').textContent = currentScore;
        }

        let timerFn = setInterval(() => {
            if(!firstJump) return;
            timeLeft -= 1;
            if(timeLeft <= 0) {
                clearInterval(timerFn);
                checkProgress()
            }
            updateUI();
        }, 1000);

        App.pet.isJumping = false;
        App.toggleGameplayControls(false, () => {
            App.pet.jump(0.28, false, () => {
                App.pet.triggerScriptedState('idle', App.INF, 0, true)
                App.pet.z = App.constants.ACTIVE_PET_Z;
            })
            App.pet.z = App.constants.ACTIVE_PET_Z + 0.2;
            checkProgress(true);
        })
    }
    static async school_CardShuffleGame({
        activeCards = 2,
        maxCards = 12,
        onEndFn,
        swapDelay = 400,
        maxSwaps,
        maxAttempts = 4,
        skillIcon,
    } = {}){
        App.sendAnalytics(`school_minigame_shuffle`);
        App.pet.triggerScriptedState('idle', App.INF, null, true);
        const screen = App.displayEmpty();
        screen.innerHTML = `
        <div class="height-100p school-logic-container">
            <div class="mini-game-ui flex hidden">
                <span id="counter">0</span>
                <span>/${maxAttempts}</span>
            </div>
            <div class="cards-container">

            </div>
        </div>
        `;

        const cardsContainer = screen.querySelector('.cards-container');
        const miniGameUI = screen.querySelector('.mini-game-ui');
        const counter = screen.querySelector('.mini-game-ui #counter');

        let cards;
        let totalTurnedCards = 0, correctCards = 0;
        const handleCardSelect = (card) => {
            if(!card.classList.contains('turning')) return; // already turned
            totalTurnedCards++;
            card.classList.remove('turning');
            if(card.isTarget){
                correctCards++;
            }
            App.playSound(card.isTarget ? 'resources/sounds/ui_click_03.ogg' : 'resources/sounds/ui_click_01.ogg', true);

            const animationDelay = 350;
            counter.textContent = totalTurnedCards;

            cardsContainer.classList.add('disabled');
            setTimeout(() => {
                cardsContainer.classList.remove('disabled');
            }, animationDelay);
            setTimeout(() => {
                if(correctCards === activeCards){
                    screen.close();
                    onEndFn?.(3);
                    Activities.task_winSkillPointFromSchool({
                        amount: 3,
                        hasWon: true,
                        icon: App.getIcon(skillIcon),
                    })
                } else if(totalTurnedCards >= maxAttempts){
                    miniGameUI.classList.add('hidden');
                    cardsContainer.classList.add('disabled');
                    cards.forEach(card => card.classList.remove('turning'))
                    setTimeout(() => {
                        screen.close();
                        onEndFn?.(0);
                        Activities.task_winSkillPointFromSchool({
                            amount: 0,
                            hasWon: false,
                            icon: App.getIcon(skillIcon),
                        })
                    }, 2000);
                }
            }, animationDelay);
        }

        let swappedIndex = 2;
        const swapCards = (a, b) => {
            const aLeft = a.style.left;
            const aTop = a.style.top;

            const bLeft = b.style.left;
            const bTop = b.style.top;

            a.style.left = bLeft;
            a.style.top = bTop;
            b.style.left = aLeft;
            b.style.top = aTop;

            a.style.zIndex = swappedIndex;
            b.style.zIndex = ++swappedIndex;

            App.playSound('resources/sounds/ui_click_04.ogg', true);
        }
        const generateCards = (activeAmount, maxAmount) => {
            const randomPositions = new Array(maxAmount)
                .fill(null)
                .map((_, i) => ( {index: i, weight: Math.random()} ))
                .sort((a, b) => a.weight - b.weight)
                .map(item => item.index)
                .slice(0, activeAmount);
            const cards = [];
            for(let i = 0; i < maxAmount; i++){
                const isTarget = randomPositions.includes(i);
                const card = UI.ce({
                    componentType: 'div',
                    className: 'card flex flex-center disabled',
                    parent: cardsContainer,
                    innerHTML: isTarget ? App.getIcon('star', true) : `<span class="opacity-third">${App.getIcon('poop', true)}</span>`,
                    isTarget,
                    onclick: () => {
                        handleCardSelect(card);
                    }
                })
                const maxCols = 4;
                const gap = 10;
                const col = i % maxCols;
                const row = Math.floor(i / maxCols);
                card.style.position = 'absolute';
                card.style.top = `${-100 * (col + 1)}px`;
                setTimeout(() => card.style.top = `${6 + row * (card.clientHeight + gap)}px`);
                card.style.left = `${8 + col * (card.clientWidth + gap)}px`;
                cards.push(card);
            }
            return cards;
        }
        cards = generateCards(activeCards, maxCards);
        await App.wait(3000);
        for(let i = 0; i < cards.length; i++){
            await App.wait(150);
            const card = cards.at(i);
            card.classList.add('turning')
        }
        await App.wait(1000);

        // swapping
        const scrambledCards = shuffleArray([
            ...shuffleArray(cards).slice(0, maxSwaps ?? cards.length/1.5),
            cards.find(c => c.isTarget)
        ]);
        for(let i = 0; i < scrambledCards.length; i++){
            const card = scrambledCards.at(i);
            let target;
            while(true){
                target = randomFromArray(scrambledCards);
                if(target !== card) break;
            }
            await App.wait(swapDelay);
            swapCards(card, target);
        }
        await App.wait(500);
        cards.forEach(card => card.classList.remove('disabled'))
        miniGameUI.classList.remove('hidden');
    }


    // utils
    static task_foam(middleFn, endFn){
        let foam = new Object2d({
            img: 'resources/img/misc/foam_01.png',
            x: 0, y: 0, z: 1001,
            onDraw: (me) => {
                Object2d.animations.flip(me, 400)
            }
        });

        setTimeout(() => {
            foam.setImg('resources/img/misc/foam_02.png');
        }, 500);

        setTimeout(() => {
            foam.setImg('resources/img/misc/foam_03.png');
        }, 1000);

        setTimeout(() => {
            foam.setImg('resources/img/misc/foam_04.png');
        }, 1500);

        setTimeout(() => {
            if(middleFn) middleFn();
        }, 2000);

        setTimeout(() => {
            foam.setImg('resources/img/misc/foam_03.png');
        }, 3000);
        setTimeout(() => {
            foam.setImg('resources/img/misc/foam_02.png');
        }, 3500);
        setTimeout(() => {
            foam.setImg('resources/img/misc/foam_01.png');
        }, 4000);

        setTimeout(() => {
            App.drawer.removeObject(foam);
        }, 4500);

        setTimeout(() => {
            if(endFn) endFn();
        }, 5500);
    }
    static task_endWork(elapsedTime, moneyMade){
        if(App.petDefinition.hasTrait('hardWorker')){
            moneyMade = moneyMade * (1 + random(1, 4) * 0.1);
        }

        let clampedMoneyMade = clamp(moneyMade, 0, 400);
        App.displayPopup(`${App.petDefinition.name} worked for ${elapsedTime} seconds`, 2500, () => {
            if(elapsedTime > 10){
                App.pet.stats.gold += clampedMoneyMade;
            } else clampedMoneyMade = 0;
            App.pet.stats.current_fun -= elapsedTime / 3.5;
            App.pet.stats.current_expression -= 0.5;
            App.pet.stats.current_logic += 3;
            App.displayConfirm(`${App.petDefinition.name} made $${clampedMoneyMade}`, [
                {
                    name: 'ok',
                    onclick: () => {
                        App.setScene(App.scene.home);
                        App.handlers.open_works_list();
                    }
                }
            ]);
        });
        App.toggleGameplayControls(true);
    }
    static task_floatingHearts(num){
        Activities.task_floatingObjects(num, [
            'resources/img/misc/heart_particle_01.png',
            'resources/img/misc/heart_particle_02.png',
        ])
    }
    static task_floatingObjects(num, textures, yRange = [105, 115]){
        if(!num) num = random(1, 4);
        for(let i = 0; i < num; i++){
            let floatSpeed = random(4, 5) * 0.01,
                swayFloat = 0,
                swaySpeed = random(2, 20) * 0.001;
            const floatingObject = new Object2d({
                img: randomFromArray(textures),
                z: randomFromArray([0, 100]),
                x: `${random(0, 100)}%`,
                y: `${random(yRange[0], yRange[1])}%`
            });
            floatingObject.onDraw = (me) => {
                if(isNaN(me.y)) return;

                me.y -= floatSpeed * App.deltaTime;

                swayFloat += swaySpeed * App.deltaTime;
                me.x += Math.sin(swayFloat) * 2;
                if(me.y < -16) me.removeObject();
            }
        }
    }
    static task_nonSwayingFloatingObjects(num, textures, yRange = [105, 115]){
        if(!num) num = random(1, 4);
        for(let i = 0; i < num; i++){
            const xPosition = ((i / num) * 100) + random(-2, 7);
            let floatSpeed = random(5, 6) * 0.01;
            const floatingObject = new Object2d({
                img: randomFromArray(textures),
                z: randomFromArray([0, 100]),
                x: `${xPosition}%`,
                y: `${random(yRange[0], yRange[1])}%`
            });
            floatingObject.onDraw = (me) => {
                if(isNaN(me.y)) return;
                me.y -= floatSpeed * App.deltaTime;
                if(me.y < -16) me.removeObject();
            }
        }
    }
    static task_explodingParticles(baseParams = {}){
        // params
        const defaultParams = {
            parent: undefined,
            x: '50%',
            y: '50%',
            z: App.constants.ACTIVE_PET_Z + 1,
            spawnDelay: 50,
            img: 'resources/img/misc/twinkle_01.png',
            aliveMs: 2000,
            opacity: 0, targetOpacity: 1,
            scale: 0, targetScale: 1,
            colorOverrides: [
                ['#FFFFFF', '#FFFF00'],
            ],
            speed: 0.8,
            despawnTime: 5000,
        }

        const PARAMS = {
            ...defaultParams,
            ...baseParams
        }

        const particlesSpawnerObject = new Object2d({
            // particle related
            x: PARAMS.x,
            y: PARAMS.y,
            z: PARAMS.z,
            width: 1, height: 1,
            lastSpawnTime: 0,
            despawnTime: PARAMS.despawnTime,
            onLateDraw: (me) => {
                me.despawnTime -= App.accurateDeltaTime;
                if(me.despawnTime <= 0) {
                    return me.removeObject();
                }

                if(App.time < me.lastSpawnTime + PARAMS.spawnDelay) return;
                me.lastSpawnTime = App.time;

                // particle
                new Object2d({
                    parent: PARAMS.parent,
                    x: particlesSpawnerObject.x,
                    y: particlesSpawnerObject.y,
                    z: particlesSpawnerObject.z,
                    direction: normalizeVector({
                        x: randomFromArray([Math.random(), -Math.random()]),
                        y: randomFromArray([Math.random(), -Math.random()])
                    }),

                    // particle related
                    aliveMs: PARAMS.aliveMs,

                    img: PARAMS.img,
                    opacity: PARAMS.opacity,
                    scale: PARAMS.scale,
                    colorOverrides: PARAMS.colorOverrides,
                    onDraw: (me) => {
                        me.aliveMs -= App.accurateDeltaTime;
                        if(me.aliveMs <= 0){
                            me.removeObject();
                        }

                        me.opacity = lerp(me.opacity, PARAMS.targetOpacity, 0.005 * App.deltaTime);
                        me.scale = lerp(me.scale, PARAMS.targetScale, 0.002 * App.deltaTime);

                        me.x += me.direction.x * App.deltaTime * 0.1 * PARAMS.speed;
                        me.y += me.direction.y * App.deltaTime * 0.1 * PARAMS.speed;
                    },
                })
            }
        })

        return particlesSpawnerObject;
    }
    static task_handleLeavingAnimals(){
        App.animals.list?.forEach(a => a?.handleStatsUpdate?.());
        const leavingAnimals = App.animals.list.filter(a => a.shouldLeave());
        if(leavingAnimals.length){
            App.displayList([
                {
                    name: `
                        these animals left because they were neglected:
                        <br><br>
                        ${leavingAnimals.map(animalDef => (`
                            <span style="color: red;">
                                ${animalDef.getFullCSprite()}${animalDef.name}
                            </span>
                        `)).join('<br>')}
                    `,
                    type: 'text',
                },
                {
                    name: "When animals lose all happiness, they leave. Take better care of them!",
                    type: 'info',
                }
            ], null, 'neglect!');
            leavingAnimals.forEach(a => {
                App.animals.list.splice(App.animals.list.indexOf(a), 1);
            })
            App.pet.stats.current_fun -= 100;
            App.pet.stats.current_expression -= 2;
        }
    }
    static async task_winSkillPointFromSchool({
            amount = 0,
            hasWon,
            npc = 'resources/img/character/chara_175b.png',
            icon,
        } = {}){
        App.closeAllDisplays();
        App.setScene(App.scene.classroom);
        App.toggleGameplayControls(false);
        App.pet.staticShadow = false;

        if(hasWon) Missions.done(Missions.TYPES.earn_school_points);

        const petMain = new TimelineDirector(App.pet);
        const petClerk = new TimelineDirector(new Pet(new PetDefinition({
            name: 'prize giver',
            sprite: npc,
        })));

        petMain.setPosition({x: '75%'});
        petMain.setState('idle')
        petClerk.setPosition({x: '25%'});
        petClerk.setState('idle')
        await TimelineDirector.wait(500);
        const messageBubble = App.displayMessageBubble(`<span class="outlined-icon">${icon}</span>+${amount}`);
        await petMain.bob({maxCycles: 1, animation: 'shocked'});
        if(hasWon){
            setTimeout(() => App.pet.playSound('resources/sounds/cheer_success.ogg', true));
            petMain.setState('cheering_with_icon');
            petClerk.setState('cheering');
        } else {
            setTimeout(() => App.pet.playSound('resources/sounds/task_fail_01.ogg', true));
            petMain.setState('uncomfortable');
            petClerk.setState('mild_uncomfortable');
            App.pet.stats.current_discipline -= random(0, 1);
        }
        await TimelineDirector.wait(3000);

        petMain.release();
        petClerk.remove();

        App.setScene(App.scene.home);
        App.toggleGameplayControls(true);
        UI.clearLastClicked();
        messageBubble.close();
        App.handlers.open_school_activity_list();
    }
    static async task_winMoney({
            amount = 0,
            happiness,
            hasWon,
            npc = 'resources/img/character/chara_175b.png',
            shouldOpenGameList = true,
            onEndCallback,
        } = {}){
        App.reloadScene();
        App.toggleGameplayControls(false);
        App.pet.staticShadow = false;

        const moneyBag = new Object2d({
            img: 'resources/img/misc/money_bag_01.png',
            x: '50%', y: '0%', width: 24, height: 24,
            opacity: amount ? 1 : 0,
            targetY: 67,
            onDraw: (me) => me.moveToTarget(0.025),
        })

        if(App.petDefinition.hasTrait('lucky'))
            amount = Math.round(amount * (1 + random(0, 5) * 0.1));

        let funGain = happiness ?? (amount / 5);
        if(App.petDefinition.hasTrait('gamer')) {
            funGain *= 1.5;
            amount *= 1.1;
        }

        amount = Math.floor(amount);

        App.pet.stats.gold += amount;
        App.pet.stats.current_fun += funGain;
        if(hasWon) Missions.done(Missions.TYPES.win_game);

        const petMain = new TimelineDirector(App.pet);
        const petClerk = new TimelineDirector(new Pet(new PetDefinition({
            name: 'prize giver',
            sprite: npc,
        })));

        petMain.setPosition({x: '75%'});
        petMain.setState('idle')
        petClerk.setPosition({x: '25%'});
        petClerk.setState('idle')
        await TimelineDirector.wait(1600);
        const messageBubble = App.displayMessageBubble(`$${amount}`);
        await petMain.bob({maxCycles: 1, animation: 'shocked'});
        if(hasWon){
            setTimeout(() => App.pet.playSound('resources/sounds/cheer_success.ogg', true));
            petMain.setState('cheering_with_icon');
            petClerk.setState('cheering');
        } else {
            setTimeout(() => App.pet.playSound('resources/sounds/task_fail_01.ogg', true));
            petMain.setState('uncomfortable');
            petClerk.setState('mild_uncomfortable');
            App.pet.stats.current_discipline -= random(0, 2);
        }
        await TimelineDirector.wait(3000);

        moneyBag.removeObject();
        petMain.release();
        petClerk.remove();

        App.setScene(App.scene.home);
        App.toggleGameplayControls(true);
        UI.clearLastClicked();
        messageBubble.close();

        if(shouldOpenGameList) App.handlers.open_game_list();
        onEndCallback?.();
    }
}


// timeline animation director
class TimelineDirector {
    registeredDrawEvents = [];
    constructor(actor, config = {}){
        this.actor = actor;
        this.actor.triggerScriptedState(
            "idle",
            App.INF,
            false,
            true,
            config.onEnd,
            config.driverFn,
        );
        this.actor.stopMove();
    }
    moveTo = ({x, y, speed = 0.15, endState = 'idle', disableMoveAnimation}) => {
        return new Promise(resolve => {
            if(!this.actor) return resolve();

            this.actor.scriptedEventDriverFn = (me) => {
                if(!disableMoveAnimation){
                    me.setState(me.isMoving ? 'moving' : endState)
                }
                if(!me.isMoving) {
                    me.speedOverride = false;
                    resolve();
                    me.scriptedEventDriverFn = false;
                }
            };
            if(typeof x === 'string'){
                const percent = parseFloat(x);
                x = App.drawer.getRelativePositionX(percent) - (this.getSize() / 2);
            }
            this.actor.targetX = x;
            this.actor.targetY = y;
            this.actor.speedOverride = speed;
        })
    }

    setPosition = ({x, y}) => {
        if(!this.actor) return;
        if(x) this.actor.x = x;
        if(y) this.actor.y = y;
    }
    setState = (state) => this.actor?.setState?.(state);
    lookAt = (direction) => this.actor && (this.actor.inverted = direction);
    release = () => {
        if(!this.actor) return;

        this.released = true;
        this.actor.stopScriptedState();
        this.actor = false;
        this.registeredDrawEvents.forEach(e => App.unregisterOnDrawEvent(e));
    }
    remove = () => this.actor?.removeObject();
    getPosition = (axis) => {
        if(axis === 'y') return this.actor?.y;
        return this.actor?.x;
    }
    getSize = () => this.actor?.spritesheet.cellSize;
    bob = ({
        speed = 0.011,
        strength = 5,
        maxCycles = 3,
        animation = 'cheering',
        landAnimation,
        sound
    } = {}) => {
        if(!landAnimation) landAnimation = animation;
        return new Promise(resolve => {
            if(!this.actor) return resolve();

            const defaultY = this.actor.positionOffset.y;
            const actor = this.actor;

            let animationFloat = 0,
            currentCycles = 0,
            cycleCounted = false;

            const drawEvent = App.registerOnDrawEvent(() => {
                if(!actor) App.unregisterOnDrawEvent(drawEvent);

                animationFloat += speed * App.deltaTime;
                const finalAnimationFloat = clamp(Math.sin(animationFloat), 0, 999);
                if(finalAnimationFloat > 0) {
                    cycleCounted = false;
                    actor.setState(animation);
                } else {
                    if(!cycleCounted) {
                        cycleCounted = true;
                        currentCycles++;
                        if(sound) App.playSound(sound, true);
                    }
                    actor.setState(landAnimation);
                    if(currentCycles >= maxCycles){
                        actor.positionOffset.y = defaultY;
                        App.unregisterOnDrawEvent(drawEvent);
                        resolve();
                    }
                }
                actor.positionOffset.y = defaultY - (finalAnimationFloat * strength);
            })

            this.registeredDrawEvents.push(drawEvent);
        })
    }
    think = (...args) => this.actor?.showThought(...args);
    resize = ({target, speed = 0.005, timeout = 1000} = {}) => {
        return new Promise(resolve => {
            const { actor } = this;

            let drawEvent;

            const end = () => {
                App.unregisterOnDrawEvent(drawEvent);
                actor.scale = target;
                drawEvent = null;
                resolve();
            }

            setTimeout(() => {
                if(drawEvent) end();
            }, timeout);

            drawEvent = App.registerOnDrawEvent(() => {
                actor.scale = lerp(actor.scale, target, speed * App.deltaTime);

                if(actor.scale.toFixed(2) === target) end();
            })
        })
    }
    fade = ({target, speed = 0.005, timeout = 1000, from = this.actor.opacity} = {}) => {
        const defaultOpacity = this.actor.opacity || 1;
        this.actor.opacity = from;
        return new Promise(resolve => {
            const { actor } = this;

            let drawEvent;

            const end = () => {
                App.unregisterOnDrawEvent(drawEvent);
                actor.opacity = defaultOpacity;
                drawEvent = null;
                resolve();
            }

            setTimeout(() => {
                if(drawEvent) end();
            }, timeout);

            drawEvent = App.registerOnDrawEvent(() => {
                actor.opacity = lerp((actor.opacity || 1), target, speed * App.deltaTime);

                if(actor.opacity.toFixed(2) === target) end();
            })
        })
    }
    jumpTo = ({x, y, curve = 0.5, speed = 0.02, endState = 'idle', animation = 'jumping'}) => {
        return new Promise(resolve => {
            if (!this.actor) return resolve();

            const actor = this.actor;
            const startX = actor.x;
            const startY = actor.y;
            const initialPositionOffset = actor.positionOffset.y;

            if (typeof x === 'string') {
                const percent = parseFloat(x);
                x = App.drawer.getRelativePositionX(percent) - (this.getSize() / 2);
            }
            if (typeof y === 'string') {
                const percent = parseFloat(y);
                y = App.drawer.getRelativePositionY(percent) - (this.getSize() / 2);
            }

            let progress = 0;

            App.playSound(`resources/sounds/jump.ogg`, true);

            const drawEvent = App.registerOnDrawEvent(() => {
                if (!actor) {
                    App.unregisterOnDrawEvent(drawEvent);
                    return;
                }

                progress += speed * App.deltaTime;
                if (progress >= 1) {
                    actor.x = x;
                    actor.y = y;
                    actor.positionOffset.y = initialPositionOffset;
                    actor.setState(endState);
                    App.unregisterOnDrawEvent(drawEvent);
                    resolve();
                    return;
                }

                const nx = lerp(startX, x, progress);
                const ny = lerp(startY, y, progress);

                const arc = Math.sin(progress * Math.PI) * curve * this.getSize();
                actor.x = nx;
                actor.y = ny;
                actor.positionOffset.y = -arc;

                actor.setState(animation);
            });

            this.registeredDrawEvents.push(drawEvent);
        });
    }

    static wait = (...args) => App.wait(...args);
}
