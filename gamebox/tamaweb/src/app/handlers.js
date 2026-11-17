App.handlers = {
    go_to_home: function () {
        App.temp[App.handlers.getOutsideActivityId()] = 1;
        App.pet.x = "0%";
        App.pet.targetX = 50;
    },
    go_to_park: function () {
        Activities.goToPark(false, () => App.handlers.open_activity_list(true));
    },
    go_to_clinic: function () {
        Activities.goToClinic(() => App.handlers.open_activity_list(true));
    },
    go_to_post_office: function () {
        Activities.goToPostOffice(() => App.handlers.open_activity_list(true));
    },
    show_attended_school_limit_message: function () {
        const formattedResetTime = moment(
            App.constants.SCHOOL.resetTime,
        ).format("h:mmA");
        return App.displayPopup(
            `<b>${App.petDefinition.name}</b> has attended all of their classes today!<br><br>Come back tomorrow after <b>${formattedResetTime}</b>`,
            4000,
        );
    },
    go_to_school: function () {
        Activities.goToSchool(() => App.handlers.open_activity_list(true));
    },
    open_works_list: function () {
        const backFn = () => App.handlers.open_activity_list(true);

        const list = App.definitions.rabbit_hole_activities
            .filter((hole) => hole.type === "job")
            .sort((a, b) => Boolean(b.isNew) - Boolean(a.isNew))
            .sort(
                (a, b) =>
                    Boolean(b.condition && b.condition?.()) -
                    Boolean(a.condition && a.condition?.()),
            )
            .map((hole) => ({
                name: `
                        <div
                            style="max-width: 100%;"
                            class="flex-between flex-dir-col align-start width-full pointer-events-none overflow-hidden"
                        >
                            <div class="flex-between align-center width-full pointer-events-none">
                                <span class="overflow-hidden" style="margin-right: 10px">
                                    <div style="width: fit-content" class="${hole.label.length > 10 ? "marquee" : ""}">
                                        ${hole.icons ? `<span class="outlined-icon">${hole.icons.map((icon) => App.getIcon(icon, true)).join("")}</span>` : ""}
                                        ${hole.label}
                                    </div>
                                </span>

                                ${hole.isNew ? App.getBadge("new", "left red") : ""}

                                <span style="padding: 2px; margin: 0" class="flex flex-dir-col flex-gap-025 font-small">
                                    <span class="flex flex-gap-025 align-center">${App.getIcon("clock", true)}${Math.ceil(hole.duration / 1000 / 60)}</span>
                                    <span class="flex flex-gap-025 align-center">${App.getIcon("special:gold", true)}${App.handlers.getJobPay(hole)}</span>
                                </span>
                            </div>

                            ${
                                hole.skillDescription
                                    ? `<small class="marquee opacity-07 font-small">${hole.skillDescription}</small>`
                                    : ""
                            }
                        </div>
                    `,
                class: "large",
                _disable: hole.condition && !hole.condition(),
                onclick: () => {
                    return App.displayConfirm(
                        ...GenericUIDef.binaryConfirm({
                            text: `
                            ${App.petDefinition.name} will work as
                            <b>${hole.label}</b>
                            for
                            <b>${humanizeExactDuration(hole.duration)}</b>
                            and gets paid
                            <b>${App.getIcon("special:gold", true)} ${App.handlers.getJobPay(hole)}</b>
                            `,
                            acceptLabel: "Accept",
                            declineLabel: "Cancel",
                            onAccept: () => {
                                App.pet.stats.current_rabbit_hole = {
                                    name: hole.name,
                                    endTime: Date.now() + hole.duration,
                                };
                                Activities.goToCurrentRabbitHole();
                                App.save();
                            },
                        }),
                    );
                },
            }));

        return App.displayList(
            [
                ...list,
                {
                    name: `Working takes real-time minutes ${App.getIcon("clock", true)}, you can close the game while your pet is at work and come back later.`,
                    type: "info",
                },
                {
                    name: `Ending work early will result in no rewards.`,
                    type: "info",
                    icon: "warning",
                },
            ],
            backFn,
        );
    },
    open_fortune_teller: function () {
        const backFn = () => {
            App.handlers.open_activity_list(true);
        };
        return App.displayList(
            [
                {
                    _disable:
                        App.petDefinition.lifeStage ===
                        PetDefinition.LIFE_STAGE.elder,
                    name: "Next Evolution",
                    onclick: () => {
                        return App.displayConfirm(
                            `Do you want to see ${App.petDefinition.name}'s <b>next possible evolution(s)</b> based on different <b>care ratings</b>?`,
                            [
                                {
                                    name: "yes ($100)",
                                    onclick: () => {
                                        if (!App.pay(100)) return;
                                        App.closeAllDisplays();
                                        Activities.goToFortuneTeller();
                                    },
                                },
                                {
                                    name: "no",
                                    class: "back-btn",
                                    onclick: () => {},
                                },
                            ],
                        );
                    },
                },
                {
                    _disable:
                        App.petDefinition.lifeStage <
                        PetDefinition.LIFE_STAGE.adult,
                    name: "Offspring with ...",
                    onclick: () => {
                        const filter = (petDefinition) =>
                            !petDefinition.stats.is_player_family &&
                            petDefinition.lifeStage >=
                                PetDefinition.LIFE_STAGE.adult &&
                            App.petDefinition.lifeStage >=
                                PetDefinition.LIFE_STAGE.adult;
                        App.handlers.open_friends_list((friendDef) => {
                            return App.displayConfirm(
                                `Do you want to see ${friendDef.name} and ${App.petDefinition.name}'s baby <b>offspring</b>?`,
                                [
                                    {
                                        name: "yes ($100)",
                                        onclick: () => {
                                            if (!App.pay(100)) return;
                                            App.closeAllDisplays();
                                            Activities.goToFortuneTeller(
                                                friendDef,
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
                        }, filter);
                        return true;
                    },
                },
            ],
            backFn,
        );
    },
    open_hubchi_search: function (onAddCallback) {
        const prompt = App.displayPrompt(
            `
                Enter your friend's username (or UID): <small>(Case sensitive)</small>
                <button id="help" style="position: absolute; bottom: 0; right: 0" class="generic-btn stylized"><b>?</b></button>
                `,
            [
                {
                    name: '<i class="fa-solid fa-search icon"></i> search',
                    onclick: (query) => {
                        if (!query.trim())
                            return App.displayPopup(
                                "Please enter a valid username.",
                            );
                        const searchingPopup = App.displayPopup(
                            `Searching for "${query}"...`,
                            App.INF,
                        );
                        App.apiService
                            .getPetDef(query)
                            .then((data) => {
                                App.sendAnalytics(
                                    "username_search",
                                    JSON.stringify({
                                        status: data.status,
                                        username: query,
                                    }),
                                );

                                if (!data.status)
                                    return App.displayPopup(
                                        `Username not found <br> <small>(Make sure you are searching for user id, not pet name)</small>`,
                                    );

                                // if(data.data === hasUploadedPetDef.data) {
                                if (App.userName.indexOf(query) === 0) {
                                    return App.displayPopup(
                                        `Something went wrong!`,
                                    );
                                }

                                prompt.close();
                                try {
                                    const parsedJson = JSON.parse(data.data);
                                    const def = new PetDefinition(
                                        parsedJson,
                                    ).setStats({
                                        is_ghost: parsedJson.is_ghost || 0,
                                    });
                                    App.displayConfirm(
                                        `Do you want to add ${def.getCSprite()} ${def.name} to your friends list?`,
                                        [
                                            {
                                                name: "yes",
                                                onclick: () => {
                                                    App.closeAllDisplays();
                                                    const addedFriend =
                                                        App.petDefinition.addFriend(
                                                            def,
                                                            1,
                                                        );
                                                    if (addedFriend) {
                                                        App.displayPopup(
                                                            `${def.getCSprite()} ${def.name} has been added to the friends list!`,
                                                            3000,
                                                        );
                                                        App.apiService.addInteraction(
                                                            def.ownerId,
                                                        );
                                                        onAddCallback?.(def);
                                                    } else {
                                                        App.displayPopup(
                                                            `You are already friends with ${def.name}`,
                                                            3000,
                                                        );
                                                    }
                                                    return false;
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
                                    App.displayPopup("Something went wrong!");
                                }
                            })
                            .finally(() => searchingPopup.close());
                        return true;
                    },
                },
                {
                    name: "cancel",
                    class: "back-btn",
                    onclick: () => {},
                },
            ],
        );
        prompt.querySelector("#help").onclick = () => {
            App.displayConfirm(
                `
                        <div> Your friend must have uploaded their character to <b style="color: #ff00c6">Hubchi</b> </div>
                        <br>
                        <div> Ensure you search for their <b>UID</b> <small>(located in the profile section)</small> and <b>not their pet name</b> </div>
                        <br>
                        <div> UID is <b>case sensitive</b> </div>
                        <br>
                        <div> ${App.getUidUI()} </div>
                    `,
                [
                    {
                        name: "ok",
                        onclick: () => {},
                    },
                ],
            );
        };
        return prompt;
    },
    show_rating_dialog: function () {
        return App.displayConfirm(
            `If you're enjoying the game, please consider <b>rating it</b> on Itch. Your feedback makes a huge difference and helps us a lot!`,
            [
                {
                    link: App.routes.ITCH_REVIEW,
                    name: `rate!`,
                    onclick: () => {
                        App.sendAnalytics("rate_accept");
                    },
                },
                {
                    name: `cancel`,
                    class: "back-btn",
                    onclick: () => {
                        App.sendAnalytics("rate_decline");
                    },
                },
            ],
        );
    },
    show_onboarding: function () {
        const screenWrapper = document.querySelector(".screen-wrapper");
        const interval = setInterval(() => {
            if (!App.pet.stats.is_egg) {
                UI.show(document.querySelector(".tap-reminder"));
                const tapReminderRemoveHandler = () => {
                    UI.hide(document.querySelector(".tap-reminder"));
                    screenWrapper.removeEventListener(
                        "click",
                        tapReminderRemoveHandler,
                    );
                };
                screenWrapper.addEventListener(
                    "click",
                    tapReminderRemoveHandler,
                );
                clearInterval(interval);
            }
        }, 1000);
    },
    show_set_pet_name_dialog: function (text = "Name your new egg:") {
        const { GENDERS } = App.constants;
        const cycleBetweenGenders = (evt) => {
            const currentIndex = GENDERS.indexOf(App.pet.stats.gender);
            const nextIndex = (currentIndex + 1) % GENDERS.length;
            App.pet.stats.gender = GENDERS.at(nextIndex);
            evt.target.innerHTML = App.getIcon(App.pet.stats.gender, true);
        };
        const prompt = `
                <span>${App.petDefinition.getFullCSprite()}<br>${text}</span>
                ${
                    App.settings.genderedPets
                        ? `<button
                        style="position: absolute; bottom: 0; right: 0"
                        class="generic-btn stylized"
                        id='gender'
                    >
                        ${App.getIcon(App.pet.stats.gender, true)}
                    </button>`
                        : ""
                }
            `;
        const element = App.displayPrompt(
            prompt,
            [
                {
                    name: "set",
                    onclick: (value) => {
                        if (!value) return false;

                        App.pet.petDefinition.name = value.slice(0, 32);
                        App.save();
                        App.displayPopup(
                            `Name set to "${App.pet.petDefinition.name}"`,
                        );
                    },
                },
            ],
            App.pet.petDefinition.name || "",
        );
        const genderButton = element.querySelector("#gender");
        if (genderButton) {
            genderButton.onclick = cycleBetweenGenders;
        }
    },
    show_set_username_dialog: function () {
        const validate = (username) => {
            if (!username) return false;
            const regex = /^[a-zA-Z0-9]+$/;
            return username.match(regex) !== null;
        };

        App.displayPrompt(`Set your username`, [
            {
                name: "set",
                onclick: (username) => {
                    username = (username || "").toString().toLowerCase();
                    if (!validate(username))
                        return App.displayPopup(
                            "Username is not valid. Please use A-Z letters and numbers.",
                        );
                    if (username.length < 5)
                        return App.displayPopup(
                            "Your username cannot have less than 5 characters.",
                        );
                    if (username.length > 18)
                        return App.displayPopup(
                            "Your username cannot have more than 18 characters.",
                        );
                    App.userName = username;
                    App.save();
                    App.sendAnalytics("new_user", username);
                },
            },
        ]);
    },
    show_letter: function ({ headline, text, sender, onClose }) {
        const container = App.displayEmpty("letter");
        container.innerHTML = `
            <div class="flex flex-dir-col">
                <h1>${App.getIcon("envelope")}</h1>
                <h1>${headline}</h1>
                <span>${text}</span>
                <footer>${sender}</footer>
                <hr>
                <button style="margin: 10px; margin-top: 10px; flex: 1" class="generic-btn stylized back-btn">Ok</button>
            </div>
            `;
        const close = container.close;
        container.close = () => {};
        container.querySelector(".back-btn").onclick = () => {
            close();
            onClose?.();
        };
    },
    show_newspaper: function (headline, text) {
        if (!headline && !text) {
            [headline, text] = randomFromArray(
                App.definitions.mail.affirmations,
            );
        }

        const salesDaySection = !App.isSalesDay()
            ? ""
            : `
                <div>
                    <b style="color: orangered;">Discount Day!</b>
                    <br>
                    Local shops are slashing prices for today only. Don't miss out on huge savings! Check them out and save big!
                    <br><br><br>
                </div>
            `;

        const christmasSection = !App.isDuringChristmas()
            ? ""
            : `
                <div>
                    <b style="color: darkgreen;">Happy Xmas!</b>
                    <br>
                    DayMail sends you warm holiday wishes and a joyous New Year!
                    <br><br>
                    <small>
                        During xmas, you'll receive 2x rewards from opening mission chests, so don't forget to check them out!
                    </small>
                    <br><br><br>
                </div>
            `;

        const container = App.displayEmpty("bg-white flex flex-dir-col");
        container.style = `background: repeating-linear-gradient(0deg, white 0px, white 11px, rgb(201, 201, 201) 10px, white 12px) local; backdrop-filter: blur(100px)`;
        container.innerHTML = `
            <img class="width-full" src="resources/img/misc/newspaper_header_01.png"></img>
            <div style="text-align: left;" class="inner-padding">
                ${christmasSection}
                ${salesDaySection}
                <b>${headline}</b>
                <hr style="background: #0000003d; display: none">
                <br><br>
                <span>${text}</span>
                <br>
                </div>
            <button style="margin: 10px; margin-top: 10px; flex: 1" class="generic-btn stylized back-btn news-close">Ok</button>
            <i style="position: absolute;top: 0;right: 0;padding: 10px;border-radius: 100%;width: 10px;height: 10px;display: inline-flex;align-items: center;justify-content: center;color: #000000;cursor: pointer;" class="fa-solid fa-times news-close"></i>
            `;

        [...container.querySelectorAll(".news-close")].forEach(
            (btn) => (btn.onclick = container.close),
        );
    },
    getJobPay: function (definition) {
        const base = definition.payAmount || 0;
        const isSkillJob = definition.keywords?.includes("skill-job");
        if (isSkillJob && App.petDefinition.hasTrait("ambitious")) {
            return Math.round(base * 1.35);
        }
        return base;
    },
    finalize_work: function (definition) {
        const payAmount = App.handlers.getJobPay(definition);
        let funLoss = random(25, 45);
        if (
            definition.keywords?.includes("skill-job") &&
            App.petDefinition.hasTrait("ambitious")
        ) {
            funLoss = Math.round(funLoss * 0.5);
        }
        App.pet.stats.gold += payAmount;
        App.pet.stats.current_fun -= funLoss;
        App.displayConfirm(
            ...GenericUIDef.singleConfirm(
                `${App.petDefinition.getAvatar()} made $${payAmount}!`,
            ),
        );
    },
    open_main_menu: function () {
        if (App.preventNextGameplayControl) {
            App.preventNextGameplayControl = false;
            return;
        }
        const runControlOverwrite = () => {
            if (!App.gameplayControlsOverwrite) return;
            if (App.gameplayControlsTriggerFeedback)
                App.playSound(`resources/sounds/ui_click_01.ogg`, true);
            App.gameplayControlsOverwrite();
            if (App.gameplayControlsTriggerFeedback) App.vibrate();
        };
        if (App.disableGameplayControls || App.settings.classicMainMenuUI) {
            return runControlOverwrite();
        }
        UI.lastClickedButton = null;
        App.playSound(`resources/sounds/ui_click_06.ogg`, true);
        App.vibrate();

        if (typeof App.temp.showStoragePersistentBadge === "undefined") {
            App.temp.showStoragePersistentBadge = !App.isStoragePersistent;
        }
        const settingsBadge = App.temp.showStoragePersistentBadge
            ? App.getBadge("", "red circle")
            : "";
        const renderingMainMenu = App.definitions.main_menu.map((item) => {
            if (item.id === "settings") {
                return {
                    ...item,
                    name: `${item.name} ${settingsBadge}`,
                    onclick: () => {
                        item.onclick();
                        App.temp.showStoragePersistentBadge = false;
                    },
                };
            }
            return item;
        });
        App.displayGrid([
            ...renderingMainMenu,
            {
                name: App.getIcon("arrow-left back-sound", true),
                class: "back-sound back-btn",
                onclick: () => {},
            },
        ]);
        return true;
    },
    open_care_menu: function () {
        const getUnclaimedRewardsBadge = () => {
            return Missions.hasUnclaimedRewards() ? App.getBadge("!") : "";
        };
        const disciplineEntry = {
            type: "element",
            class: " flex flex-dir-col in-list-container flex-gap-05 inner-padding-sm",
            innerHTML: UI.create({
                children: [
                    {
                        domType: "span",
                        innerHTML: `${App.getGenericCSprite(1, "resources/img/misc/misbehaving_01.png", { cellSize: 9, rows: 1 }, "x2 opacity-half ml-2 ")} Discipline`,
                    },
                    {
                        domType: "div",
                        className: "flex-between flex-gap-05",
                        children: [
                            {
                                componentType: "button",
                                style: `color: #229d3c;`,
                                className:
                                    "generic-btn stylized m-0 flex-1 flex-center flex-dir-row",
                                innerHTML:
                                    App.getIcon("face-laugh-beam") +
                                    App.getIcon("thumbs-up", true),
                                onclick: () => {
                                    App.closeAllDisplays();
                                    App.pet.praise();
                                },
                            },
                            {
                                componentType: "button",
                                className: `generic-btn stylized m-0 flex-1 flex-center flex-dir-row ${App.pet.stats.is_misbehaving ? "attention" : ""}`,
                                style: `color: #e74040;`,
                                innerHTML:
                                    App.getIcon("face-angry") +
                                    App.getIcon(
                                        `thumbs-down ${App.pet.stats.is_misbehaving ? "fa-shake" : ""}`,
                                        true,
                                    ),
                                onclick: () => {
                                    App.closeAllDisplays();
                                    App.pet.scold();
                                    if (App.pet.stats.is_misbehaving) {
                                        // still misbehaving
                                        App.toggleGameplayControls(false);
                                        setTimeout(() => {
                                            App.toggleGameplayControls(true);
                                            App.handlers.open_care_menu();
                                        }, 2000);
                                    }
                                },
                            },
                        ],
                    },
                ],
            }),
        };

        App.displayList(
            [
                { ...disciplineEntry },
                {
                    _mount: (me) => {
                        me.innerHTML = `Missions ${getUnclaimedRewardsBadge()}`;
                    },
                    name: "",
                    onclick: () => {
                        Missions.openMenu();
                        return true;
                    },
                },
                {
                    name: `sleep ${App.isSleepHour() ? App.getBadge('<div style="margin-left: auto; padding: 2px"> <i class="fa-solid fa-moon"></i> <small>bedtime!</small> </div>', "night") : ""}`,
                    onclick: () => {
                        App.handlers.sleep();
                    },
                },
                {
                    name: `Backyard`,
                    onclick: () => {
                        Activities.goToGarden();
                    },
                },
                {
                    name: `Garden`,
                    onclick: () => {
                        Activities.goToInnerGarden();
                    },
                },
                {
                    name: `pet`,
                    onclick: () => {
                        App.displayPopup(
                            `Slide your finger across screen to pet<br><br>Stop sliding for a few seconds to stop petting`,
                            3200,
                            () => {
                                Activities.pet();
                            },
                        );
                    },
                },
                {
                    _ignore: !App.petDefinition.getParents(),
                    name: `stay with parents`,
                    onclick: () => {
                        if (
                            App.hour < App.constants.PARENT_DAYCARE_START ||
                            App.hour >= App.constants.PARENT_DAYCARE_END
                        ) {
                            return App.displayPopup(
                                `You can only leave ${App.petDefinition.name} at their parents house between <b>${App.formatTo12Hours(App.constants.PARENT_DAYCARE_START)}</b> and <b>${App.formatTo12Hours(App.constants.PARENT_DAYCARE_END)}</b>`,
                                4000,
                            );
                        }

                        App.displayConfirm(
                            `${App.petDefinition.name} will be with their parents, who will look after them from <b>${App.formatTo12Hours(App.constants.PARENT_DAYCARE_START)}</b> to <b>${App.formatTo12Hours(App.constants.PARENT_DAYCARE_END)}</b>, is that ok?`,
                            [
                                {
                                    name: "yes",
                                    onclick: () => {
                                        App.closeAllDisplays();
                                        Activities.stayAtParents();
                                        App.save();
                                    },
                                },
                                {
                                    name: "no",
                                    class: "back-btn",
                                    onclick: () => {},
                                },
                            ],
                        );

                        return true;
                    },
                },
                {
                    _disable: !App.pet.stats.current_want.type,
                    name: `current want`,
                    onclick: () => {
                        App.closeAllDisplays();
                        App.pet.showCurrentWant(App.settings.showWantName);
                    },
                },
            ],
            null,
            "Care",
        );
    },
    open_stuff_menu: function () {
        App.displayList(
            [
                {
                    name: `items`,
                    onclick: () => {
                        App.handlers.open_item_list();
                        return true;
                    },
                },
                {
                    name: `accessories`,
                    onclick: () => {
                        App.handlers.open_accessory_list();
                        return true;
                    },
                },
                {
                    name: `furniture`,
                    onclick: () => {
                        if (!App.isRoomFurnishable()) {
                            return App.displayConfirm(
                                `Your room came fully furnished.<br><br>Would you like to remove the default furniture set and customize it?`,
                                [
                                    {
                                        name: "yes",
                                        onclick: () => {
                                            App.closeAllDisplays();
                                            Activities.redecorRoom(() => {
                                                App.handlers.open_active_furniture_list();
                                            });
                                            App.scene.home.image =
                                                App.getFurnishableBackground(
                                                    App.scene.home.image,
                                                );
                                        },
                                    },
                                    {
                                        name: "no",
                                        onclick: () => {},
                                        class: "back-btn",
                                    },
                                ],
                            );
                        }
                        App.closeAllDisplays();
                        App.handlers.open_active_furniture_list();
                    },
                },
                {
                    name: `craft`,
                    onclick: () => {
                        App.handlers.open_craftables_list();
                        return true;
                    },
                },
                {
                    _ignore: !App.mods.length && !App.petDefinition.spriteSkin,
                    name: `change character ${App.getBadge("Modded")}`,
                    onclick: () => {
                        /* if(App.settings.automaticAging){
                            return App.displayPopup('Turn <b>Auto aging <span style="color: red;">off</span></b> in the gameplay settings to be able to use this feature.');
                        } */

                        const chars = [];
                        const addResourceChar = (resource, index) => {
                            chars.push({
                                def: new PetDefinition({
                                    sprite: resource.resId || resource.sprite,
                                }),
                                name: resource.name || `#${index}`,
                                src: resource.resId,
                            });
                        };
                        const changeCharacterSkin = (src) => {
                            Activities.getDressed(
                                () => {
                                    App.petDefinition.spriteSkin = src;
                                    App.petDefinition.prepareSprite();
                                    App.pet.recreateAsMainPet();
                                    App.save();
                                },
                                false,
                                true,
                            );
                        };

                        App.mods.forEach((mod) => {
                            mod.added_resources?.forEach(addResourceChar);
                        });

                        App.temp.convertedModAddedResources?.forEach(
                            addResourceChar,
                        );

                        const items = chars.map((char) => {
                            const isAgeCompatible =
                                char.def.lifeStage ===
                                App.petDefinition.lifeStage;
                            return {
                                _disable: !isAgeCompatible,
                                name: `
                                    ${char.def.getCSprite()} <span class="ellipsis">${char.name}</span>
                                    ${App.getBadge(char.def.getLifeStageLabel(), "neutral")}
                                `,
                                onclick: () => {
                                    return App.displayConfirm(
                                        ...GenericUIDef.binaryConfirm({
                                            text: `Are you sure you want to visually change your character? <br>${char.def.getFullCSprite()}`,
                                            onAccept: () => {
                                                changeCharacterSkin(char.src);
                                            },
                                        }),
                                    );
                                },
                            };
                        });

                        return App.displayList([
                            {
                                name: `Here you will be able to view and change into characters from your installed mods.<br><br><div style="color: red;">You can <b>change back any time</b>, but please <b class="blink">backup your save file</b> before continuing.</div>`,
                                type: "info",
                            },
                            {
                                _disable: !App.petDefinition.spriteSkin,
                                name: `
                                    ${App.petDefinition.getCSprite(false, App.petDefinition.sprite)} Change back
                                    ${App.getBadge(App.petDefinition.getLifeStageLabel(), "neutral")}
                                `,
                                class: "primary solid",
                                onclick: () => {
                                    return App.displayConfirm(
                                        ...GenericUIDef.binaryConfirm({
                                            text: `Are you sure you want to change back to your original character? <br>${App.petDefinition.getFullCSprite(App.petDefinition.sprite)}`,
                                            onAccept: () => {
                                                changeCharacterSkin(undefined);
                                            },
                                        }),
                                    );
                                },
                            },
                            ...items,
                        ]);
                    },
                },
            ],
            null,
            "Stuff",
        );
    },
    open_bathroom_menu: function () {
        App.displayList(
            [
                {
                    name: "bathe",
                    onclick: () => {
                        Activities.bathe();
                    },
                },
                {
                    name: "use toilet",
                    onclick: () => {
                        Activities.poop();
                    },
                },
                {
                    name: `brush teeth`,
                    onclick: () => {
                        Activities.brushTeeth();
                    },
                },
                {
                    name: "clean room",
                    onclick: () => {
                        App.handlers.clean();
                    },
                },
            ],
            null,
            "Cleaning",
        );
    },
    open_credits: function () {
        return App.displayList([
            {
                type: "text",
                name: `<small>developed by</small>
                    <br>
                    SamanDev
                    <small>
                        <a href="${App.routes.DISCORD}" target="_blank">discord</a>
                        <a href="https://samandev.itch.io" target="_blank">itch</a>
                    </small>
                    `,
            },
            {
                type: "text",
                name: `<small>art by</small>
                        <br>
                        <div class="credit-author">
                            <a href="https://samandev.itch.io" target="_blank">
                                SamanDev
                            </a>
                        </div>
                        <div class="credit-author">
                            <a href="https://sa311.tumblr.com/post/163140958242/about-me" target="_blank">
                                Curlour
                            </a>
                            <small>(eternitchi)</small>
                        </div>
                        <div class="credit-author">
                            <a href="https://www.tiktok.com/@prion_sigma" target="_blank">
                                Prion Sigma
                            </a>
                        </div>
                        <div class="credit-author">
                            <a href="https://www.instagram.com/abysmdelirium" target="_blank">
                                abysmDelirium
                            </a>
                        </div>
                        <div class="credit-author">
                            gawkyToaster
                        </div>
                        <div class="credit-author">
                            <a href="https://www.artstation.com/pistispixel" target="_blank">
                                Piixel_Nun
                            </a>
                        </div>
                        <div class="credit-author">
                            <a href="https://bsky.app/profile/teddieursa.bsky.social" target="_blank">
                                Teddie
                            </a>
                        </div>
                        <div class="credit-author">
                            Thunderputz
                        </div>
                        <div class="credit-author">
                            <a href="https://vairasmythe.carrd.co/" target="_blank">
                                Vaira Smythe
                            </a>
                        </div>
                    `,
            },
            {
                type: "text",
                name: `<small>music/sfx by</small>
                        <br>
                        <div class="credit-author">
                            <a href="https://samandev.itch.io" target="_blank">
                                SamanDev
                            </a>
                        </div>
                        <div class="credit-author">
                            <a href="https://x.com/Eth_DNautiluss" target="_blank">
                                Eth-D'Nautiluss
                            </a>
                        </div>
                    `,
            },
        ]);
    },
    open_settings: function () {
        const ignoreFirstDivider = !(
            App.deferredInstallPrompt || !App.isOnItch
        );

        const settings = App.displayList(
            [
                {
                    _ignore: App.isStoragePersistent,
                    name: `
                        <span>
                            Make sure to backup your progress regularly to prevent progress loses.
                        </span>
                        <div class="flex flex-dir-col mt-2">
                            <button id="emergency-backup" class="generic-btn stylized primary solid"> ${App.getIcon("download")} Backup </button>
                        </div>
                    `,
                    type: "info",
                    _mount: (e) => {
                        e.querySelector("#emergency-backup").onclick = (
                            evt,
                        ) => {
                            App.exportSaveCode();
                            App.isStoragePersistent = true;
                            evt.target.innerHTML = `${App.getIcon("check")} Exported!`;
                        };
                    },
                },
                {
                    _ignore: !App.isTester(),
                    name: `<span style="color:red;">devtools</span> ${App.getBadge("debug", "neutral")}`,
                    onclick: () => {
                        return App.displayList([
                            {
                                name: "eventshistory",
                                onclick: () => {
                                    const ui = UI.genericListContainer();
                                    const content = UI.empty();
                                    ui.appendChild(content);
                                    content.innerHTML = JSON.stringify(
                                        App.gameEventsHistory,
                                        null,
                                        2,
                                    );
                                    App.displayPopup(
                                        "array? " +
                                            Array.isArray(
                                                App.gameEventsHistory,
                                            ),
                                    );
                                    return true;
                                },
                            },
                            {
                                name: "user",
                                onclick: () => {
                                    const ui = UI.genericListContainer();
                                    const content = UI.empty();
                                    ui.appendChild(content);
                                    content.innerHTML = `${navigator.userAgent}`;
                                    return true;
                                },
                            },
                        ]);
                    },
                },
                {
                    name: `
                        ${App.getIcon("floppy-disk")}
                        <span class="flex flex-dir-col pointer-events-none">
                            <span>Manual Save</span>
                            <small style="font-size: x-small">auto-saves every ${App.constants.AUTO_SAVE_INTERVAL_SECS} secs</small>
                        </span>
                        `,
                    onclick: (me) => {
                        App.save();
                        me.disabled = true;
                        me.querySelector("span").textContent = "Saved!";
                        return true;
                    },
                },
                {
                    _ignore: !App.deferredInstallPrompt,
                    name: "install app",
                    onclick: () => {
                        App.installAsPWA();
                        return true;
                    },
                },
                {
                    _ignore: true || !window?.Notification || !App.isTester(), // unused
                    _mount: (e) =>
                        (e.innerHTML = `notifications: <i>${App.settings.notifications ? "on" : "off"}</i>`),
                    name: `notifications`,
                    onclick: (btn) => {
                        if (App.settings.notifications) {
                            App.settings.notifications = false;
                            btn._mount();
                        } else {
                            Notification.requestPermission().then((result) => {
                                if (result === "granted") {
                                    App.settings.notifications = true;
                                }
                                btn._mount();
                            });
                        }

                        return true;
                    },
                },
                {
                    name: `save management`,
                    onclick: () => {
                        return App.displayList([
                            {
                                name: `<i class="fa-solid fa-download icon"></i> <label class="custom-file-upload"><input id="save-file" type="file"></input>Import</label>`,
                                _mount: (element) => {
                                    const input =
                                        element.querySelector("#save-file");
                                    App.handleFileLoad(
                                        input,
                                        "readAsText",
                                        (data) => {
                                            App.handleInputCode(data);
                                            input.files =
                                                new DataTransfer().files;
                                            return true;
                                        },
                                    );
                                },
                                onclick: () => {
                                    return true;
                                },
                            },
                            {
                                name: `<i class="fa-solid fa-upload icon"></i> Export`,
                                onclick: () => App.exportSaveCode(),
                            },
                            {
                                name: `<i class="fa-solid fa-copy icon"></i> copy`,
                                onclick: async () => {
                                    const loadingPopup =
                                        App.displayPopup("loading...");
                                    const charCode = await App.getSaveCode();
                                    loadingPopup.close();
                                    App.displayConfirm(
                                        `Here you'll be able to copy your unique save code and continue your playthrough on another device`,
                                        [
                                            {
                                                name: "ok",
                                                onclick: () => {
                                                    App.displayConfirm(
                                                        `After copying the code, open Tamaweb on another device and paste the code in <b>settings > input code</b>`,
                                                        [
                                                            {
                                                                name: "ok",
                                                                onclick: () => {
                                                                    try {
                                                                        if (
                                                                            App.isOnItch
                                                                        )
                                                                            throw "itch_clipboard";
                                                                        navigator.clipboard.writeText(
                                                                            charCode,
                                                                        );
                                                                        console.log(
                                                                            "save code copied",
                                                                            charCode,
                                                                        );
                                                                        App.displayPopup(
                                                                            "Save code copied!",
                                                                            1000,
                                                                        );
                                                                    } catch (e) {
                                                                        const prompt =
                                                                            App.displayPrompt(
                                                                                `Copy your save code from the box below:<br><small><i class="fa-solid fa-info-circle"></i> starts with <b>save:</b> and ends with <b>:endsave</b></small>`,
                                                                                [
                                                                                    {
                                                                                        name: "Ok, I copied",
                                                                                        class: "back-btn",
                                                                                        onclick:
                                                                                            () => {},
                                                                                    },
                                                                                ],
                                                                                charCode,
                                                                            );
                                                                        const input =
                                                                            prompt.querySelector(
                                                                                "input",
                                                                            );
                                                                        input.focus();
                                                                        input.select();
                                                                    }
                                                                },
                                                            },
                                                        ],
                                                    );
                                                },
                                            },
                                        ],
                                    );
                                    return true;
                                },
                            },
                        ]);
                    },
                },
                {
                    // _ignore: !App.isTester(),
                    _ignore: App.isOnItch,
                    name: `mods`,
                    onclick: () => {
                        const display = App.displayList([
                            {
                                name: `
                                    <span>
                                        Please backup your save before installing mods.
                                    </span>
                                    <div class="flex flex-dir-col mt-2">
                                        <button id="emergency-backup" class="generic-btn stylized primary solid"> ${App.getIcon("download")} Backup </button>
                                    </div>
                                `,
                                type: "info",
                                _mount: (e) => {
                                    e.querySelector(
                                        "#emergency-backup",
                                    ).onclick = (evt) => {
                                        App.exportSaveCode();
                                        evt.target.innerHTML = `${App.getIcon("check")} Exported!`;
                                    };
                                },
                            },
                            {
                                name: '<label class="custom-file-upload"><input id="mod-file" type="file"></input>+ Add mod</label>',
                                onclick: (btn) => {
                                    return true;
                                },
                            },
                            {
                                name: `active mods (${App.mods.length})`,
                                onclick: () => {
                                    // App.displayPopup(JSON.stringify(App.mods, null, 2), 5000);
                                    if (!App.mods.length)
                                        return App.displayPopup(
                                            "No mods installed",
                                        );

                                    const activeModsList = App.displayList(
                                        App.mods.map((modInfo) => {
                                            return {
                                                name: modInfo.name,
                                                onclick: () => {
                                                    const modInfoScreen =
                                                        App.displayList([
                                                            {
                                                                name: `${modInfo.name} <br> <small style="font-size: small">by ${modInfo.author}</small>`,
                                                                type: "text",
                                                                solid: true,
                                                                bold: true,
                                                            },
                                                            {
                                                                _ignore:
                                                                    !modInfo.description,
                                                                name: modInfo.description,
                                                                type: "text",
                                                            },
                                                            {
                                                                name: "uninstall",
                                                                onclick: () => {
                                                                    App.displayConfirm(
                                                                        `Are you sure you want to uninstall <b>${modInfo.name}</b>?`,
                                                                        [
                                                                            {
                                                                                name: "yes",
                                                                                onclick:
                                                                                    () => {
                                                                                        App.mods.splice(
                                                                                            App.mods.indexOf(
                                                                                                modInfo,
                                                                                            ),
                                                                                            1,
                                                                                        );
                                                                                        App.save();
                                                                                        App.sendAnalytics(
                                                                                            "mod_uninstall",
                                                                                            modInfo.name,
                                                                                        );
                                                                                        App.displayPopup(
                                                                                            `<b>${modInfo.name}</b> uninstalled successfully, refreshing...`,
                                                                                            null,
                                                                                            () =>
                                                                                                location.reload(),
                                                                                        );
                                                                                    },
                                                                            },
                                                                            {
                                                                                name: "no",
                                                                                class: "back-btn",
                                                                                onclick:
                                                                                    () => {},
                                                                            },
                                                                        ],
                                                                    );
                                                                    return true;
                                                                },
                                                            },
                                                        ]);
                                                    return true;
                                                },
                                            };
                                        }),
                                    );

                                    return true;
                                },
                            },
                            {
                                name: "installing / uninstalling mods will refresh the game.",
                                type: "info",
                            },
                        ]);

                        App.handleFileLoad(
                            display.querySelector("#mod-file"),
                            "readAsText",
                            (data) => {
                                try {
                                    const json = JSON.parse(data);

                                    if (!json.name) {
                                        throw "Invalid";
                                    }

                                    const duplicateIndex = App.mods.findIndex(
                                        ({ id }) => id == json.id,
                                    );
                                    if (duplicateIndex != -1) {
                                        App.mods[duplicateIndex] = json;
                                        App.sendAnalytics(
                                            "mod_update",
                                            json.name,
                                        );
                                        App.displayPopup(
                                            `<b>${json.name}</b> updated! <br><br> refreshing...`,
                                            2000,
                                            () => {
                                                location.reload();
                                            },
                                        );
                                    } else {
                                        App.mods.push(json);
                                        App.sendAnalytics(
                                            "mod_install",
                                            json.name,
                                        );
                                        App.displayPopup(
                                            `<b>${json.name}</b> installed! <br><br> refreshing...`,
                                            2000,
                                            () => {
                                                location.reload();
                                            },
                                        );
                                    }
                                    App.save();
                                } catch (e) {
                                    console.log(e);
                                    App.displayPopup(
                                        `Something went wrong, Invalid package: ${e}`,
                                    );
                                }
                            },
                        );

                        return true;
                    },
                },
                { type: "separator", _ignore: ignoreFirstDivider },
                {
                    name: `gameplay settings`,
                    onclick: () => {
                        const getStateIcon = (state) => {
                            const className = state
                                ? "option on"
                                : "option off";
                            return `<div class="${className}"></div>`;
                        };

                        return App.displayList([
                            {
                                name: `Sleeping Hours`,
                                onclick: (e) => {
                                    const list = UI.genericListContainer();
                                    const content = UI.empty();

                                    content.innerHTML = `
                                        <div class="inner-padding b-radius-10 surface-stylized">
                                            <div class="inline-flex-between width-full items-center">
                                                <button id="subtract" class="generic-btn stylized primary solid"> <i class="fa-solid fa-minus"></i> </button>
                                                <div style="font-size: medium">
                                                    <b id="amount">${App.settings.sleepingHoursOffset}</b>
                                                </div>
                                                <button id="add" class="generic-btn stylized"> <i class="fa-solid fa-plus"></i> </button>
                                            </div>
                                        </div>

                                        <div id="info" class="inner-padding b-radius-10 solid-surface-stylized">
                                        </div>
                                    `;

                                    const amount =
                                        content.querySelector("#amount");
                                    const info = content.querySelector("#info");
                                    const updateUI = () => {
                                        amount.textContent =
                                            App.settings.sleepingHoursOffset;
                                        const startTime =
                                                App.constants.SLEEP_START +
                                                App.settings
                                                    .sleepingHoursOffset,
                                            endTime =
                                                App.constants.SLEEP_END +
                                                App.settings
                                                    .sleepingHoursOffset;
                                        const rangeStyle = `display: flex;justify-content: space-between;`;
                                        info.innerHTML = `
                                            sleeping
                                            <br>
                                            <b>
                                                <div style="${rangeStyle}">
                                                    from <div>${App.clampWithin24HourFormat(startTime)}:00</div>
                                                </div>
                                                <div style="${rangeStyle}">
                                                    to <div>${App.clampWithin24HourFormat(endTime)}:00</div>
                                                </div>
                                            </b>
                                        `;
                                    };
                                    const updateOffset = (amount) => {
                                        App.settings.sleepingHoursOffset =
                                            clamp(
                                                App.settings
                                                    .sleepingHoursOffset +
                                                    amount,
                                                -24,
                                                24,
                                            );
                                        updateUI();
                                        App.applySky();
                                    };
                                    content.querySelector("#add").onclick =
                                        () => updateOffset(1);
                                    content.querySelector("#subtract").onclick =
                                        () => updateOffset(-1);
                                    updateUI();

                                    list.appendChild(content);
                                    return true;
                                },
                            },
                            {
                                _mount: (e) =>
                                    (e.innerHTML = `${getStateIcon(App.settings.automaticAging)} Auto aging: <i>${App.settings.automaticAging ? "On" : "Off"}</i>`),
                                onclick: (e) => {
                                    if (!App.settings.automaticAging) {
                                        App.displayConfirm(
                                            `Are you sure? This will make your pets automatically age up after a certain amount of time`,
                                            [
                                                {
                                                    name: "yes",
                                                    onclick: () => {
                                                        App.settings.automaticAging = true;
                                                        App.displayPopup(
                                                            `Automatic aging turned on`,
                                                        );
                                                        e._mount();
                                                        App.save();
                                                    },
                                                },
                                                {
                                                    name: "no",
                                                    class: "back-btn",
                                                    onclick: () => {},
                                                },
                                            ],
                                        );
                                    } else {
                                        App.settings.automaticAging = false;
                                        App.displayPopup(
                                            `Automatic aging turned off`,
                                        );
                                        App.save();
                                    }
                                    e._mount();
                                    return true;
                                },
                            },
                            {
                                _mount: (e) =>
                                    (e.innerHTML = `${getStateIcon(App.settings.season)} Season: <i>${App.settings.season}</i>`),
                                onclick: (e) => {
                                    const possibleOptions = [
                                        "auto",
                                        "spring",
                                        "summer",
                                        "autumn",
                                        "winter",
                                    ];
                                    const currentSettingIndex =
                                        possibleOptions.indexOf(
                                            App.settings.season,
                                        );
                                    App.settings.season =
                                        possibleOptions[
                                            (currentSettingIndex + 1) %
                                                possibleOptions.length
                                        ];
                                    App.applySettings();
                                    e._mount();
                                    return true;
                                },
                            },
                            {
                                _mount: (e) =>
                                    (e.innerHTML = `${getStateIcon(App.settings.showWantName)} show want name: <i>${App.settings.showWantName ? "On" : "Off"}</i>`),
                                onclick: (item) => {
                                    App.settings.showWantName =
                                        !App.settings.showWantName;
                                    App.applySettings();
                                    item._mount();
                                    return true;
                                },
                            },
                            {
                                _mount: (e) =>
                                    (e.innerHTML = `${getStateIcon(App.settings.genderedPets)} gendered pets: <i>${App.settings.genderedPets ? "On" : "Off"}</i>`),
                                onclick: (item) => {
                                    App.settings.genderedPets =
                                        !App.settings.genderedPets;
                                    item._mount();
                                    return true;
                                },
                            },
                            {
                                _mount: (e) =>
                                    (e.innerHTML = `
                                ${getStateIcon(App.settings.skillsAffectingEvolution)}
                                <div class="overflow-hidden flex">
                                    <div class="marquee">
                                        skills affecting evolution: <i>${App.settings.skillsAffectingEvolution ? "On" : "Off"}</i>
                                    </div>
                                </div>
                                `),
                                onclick: (item) => {
                                    App.settings.skillsAffectingEvolution =
                                        !App.settings.skillsAffectingEvolution;
                                    item._mount();
                                    return true;
                                },
                            },
                        ]);
                    },
                },
                {
                    name: `system settings`,
                    onclick: () => {
                        App.displayList([
                            {
                                name: `sound fx: <i>${App.settings.playSound ? "on" : "off"}</i>`,
                                onclick: (item) => {
                                    App.settings.playSound =
                                        !App.settings.playSound;
                                    item.innerHTML = `sound fx: <i>${App.settings.playSound ? "on" : "off"}</i>`;
                                    return true;
                                },
                            },
                            {
                                _mount: (e) =>
                                    (e.innerHTML = `bg music: <i>${App.settings.playMusic ? "on" : "off"}</i>`),
                                onclick: (item) => {
                                    App.settings.playMusic =
                                        !App.settings.playMusic;
                                    item._mount();
                                    return true;
                                },
                            },
                            {
                                name: `vibration: <i>${App.settings.vibrate ? "on" : "off"}</i>`,
                                onclick: (item) => {
                                    App.settings.vibrate =
                                        !App.settings.vibrate;
                                    item.innerHTML = `vibration: <i>${App.settings.vibrate ? "on" : "off"}</i>`;
                                    return true;
                                },
                            },
                            {
                                _mount: (e) =>
                                    (e.innerHTML = `classic menu: <i>${App.settings.classicMainMenuUI ? "on" : "off"}</i>`),
                                onclick: (item) => {
                                    App.settings.classicMainMenuUI =
                                        !App.settings.classicMainMenuUI;
                                    item._mount();
                                    App.applySettings();
                                    return true;
                                },
                            },
                            {
                                _mount: (e) =>
                                    (e.innerHTML = `tap effects: <i>${App.settings.tapEffect ? "on" : "off"}</i>`),
                                onclick: (item) => {
                                    App.settings.tapEffect =
                                        !App.settings.tapEffect;
                                    item._mount();
                                    return true;
                                },
                            },
                            {
                                name: `back color`,
                                onclick: () => {
                                    App.displayList([
                                        {
                                            name: `<input type="color" value="${App.settings.backgroundColor}" id="background-color-picker"></input>`,
                                            onclick: () => {
                                                return true;
                                            },
                                        },
                                        {
                                            name: "apply",
                                            onclick: () => {
                                                let colorPicker =
                                                    document.querySelector(
                                                        "#background-color-picker",
                                                    );
                                                App.settings.backgroundColor =
                                                    colorPicker.value;
                                                App.applySettings();
                                                return true;
                                            },
                                        },
                                        {
                                            name: "reset",
                                            onclick: () => {
                                                let colorPicker =
                                                    document.querySelector(
                                                        "#background-color-picker",
                                                    );
                                                colorPicker.value = "#FFDEAD";
                                                App.settings.backgroundColor =
                                                    colorPicker.value;
                                                App.applySettings();
                                                return true;
                                            },
                                        },
                                    ]);
                                    return true;
                                },
                            },
                            {
                                _mount: (btn) => {
                                    const hasNew =
                                        App.definitions.background_pattern.some(
                                            (entry) => {
                                                const isUnlocked =
                                                    entry.unlockKey
                                                        ? App.getRecord(
                                                              entry.unlockKey,
                                                          )
                                                        : true;
                                                return (
                                                    entry.isNew && isUnlocked
                                                );
                                            },
                                        );
                                    btn.innerHTML = `back pattern ${hasNew ? App.getBadge("new!") : ""}`;
                                },
                                onclick: () => {
                                    App.handlers.open_background_pattern_list();
                                    return true;
                                },
                            },
                            {
                                _mount: (btn) => {
                                    const hasNew = Object.keys(
                                        App.definitions.decoration_overlay,
                                    )
                                        .map(
                                            (key) =>
                                                App.definitions
                                                    .decoration_overlay[key],
                                        )
                                        .some((def) => def.isNew);
                                    btn.innerHTML = `<span class="overflow-hidden ellipsis">decoration overlay</span> ${hasNew ? App.getBadge("new!") : ""}`;
                                },
                                onclick: () => {
                                    App.handlers.open_decoration_overlay_list();
                                    return true;
                                },
                            },
                            {
                                name: "+ view size",
                                onclick: () => {
                                    App.settings.screenSize += 0.1;
                                    App.applySettings();
                                    return true;
                                },
                            },
                            {
                                name: "- view size",
                                onclick: () => {
                                    App.settings.screenSize -= 0.1;
                                    App.applySettings();
                                    return true;
                                },
                            },
                            {
                                name: "reset view size",
                                onclick: () => {
                                    App.settings.screenSize = 1;
                                    App.applySettings();
                                    return true;
                                },
                            },
                        ]);
                        return true;
                    },
                },
                {
                    name: `Change Theme`,
                    onclick: () => {
                        const newThemes = [];
                        return App.displayList(
                            [...App.definitions.themes]
                                .sort(
                                    (a, b) =>
                                        newThemes.includes(b) -
                                        newThemes.includes(a),
                                )
                                .map((themeName) => ({
                                    name: `${themeName.replace("color ", "")} ${newThemes.includes(themeName) ? App.getBadge("new!") : ""}`,
                                    // class: `theme-${themeName}`,
                                    onclick: () => {
                                        App.settings.theme = themeName;
                                        App.applySettings();
                                        return true;
                                    },
                                })),
                        );
                    },
                },
                {
                    name: `Shell Settings`,
                    onclick: () => {
                        // App.handlers.open_shell_background_list();
                        // return true;

                        App.displayList([
                            {
                                _mount: (e) =>
                                    (e.innerHTML = `display shell: <i>${App.settings.displayShell ? App.getIcon("eye") : App.getIcon("eye-slash")}</i>`),
                                onclick: (item) => {
                                    App.settings.displayShell =
                                        !App.settings.displayShell;
                                    App.applySettings();
                                    item._mount();
                                    return true;
                                },
                            },
                            {
                                _mount: (e) =>
                                    (e.innerHTML = `shell button: <i>${App.settings.displayShellButtons ? App.getIcon("eye") : App.getIcon("eye-slash")}</i>`),
                                onclick: (item) => {
                                    App.settings.displayShellButtons =
                                        !App.settings.displayShellButtons;
                                    App.applySettings();
                                    item._mount();
                                    return true;
                                },
                            },
                            {
                                _mount: (e) =>
                                    (e.innerHTML = `shell logo: <i>${App.settings.displayShellLogo ? App.getIcon("eye") : App.getIcon("eye-slash")}</i>`),
                                onclick: (item) => {
                                    App.settings.displayShellLogo =
                                        !App.settings.displayShellLogo;
                                    App.applySettings();
                                    item._mount();
                                    return true;
                                },
                            },
                            {
                                name: `+ shell size`,
                                onclick: () => {
                                    App.settings.shellAdditionalSize += 0.1;
                                    App.applySettings();
                                    return true;
                                },
                            },
                            {
                                name: `- shell size`,
                                onclick: () => {
                                    App.settings.shellAdditionalSize -= 0.1;
                                    App.applySettings();
                                    return true;
                                },
                            },
                            {
                                name: `reset shell size`,
                                onclick: () => {
                                    App.settings.shellAdditionalSize = 0;
                                    App.applySettings();
                                    return true;
                                },
                            },
                            {
                                _mount: (e) =>
                                    (e.innerHTML = `shell shape: <i>${App.settings.shellShape}</i>`),
                                onclick: (item) => {
                                    App.settings.shellShape++;
                                    if (
                                        App.settings.shellShape >
                                        App.constants.MAX_SHELL_SHAPES
                                    ) {
                                        App.settings.shellShape = 1;
                                    }
                                    App.applySettings();
                                    item._mount();
                                    return true;
                                },
                            },
                            {
                                _mount: (e) => {
                                    const hasNew =
                                        App.definitions.shell_background.some(
                                            (entry) => {
                                                const isUnlocked =
                                                    entry.unlockKey
                                                        ? App.getRecord(
                                                              entry.unlockKey,
                                                          )
                                                        : true;
                                                return (
                                                    entry.isNew && isUnlocked
                                                );
                                            },
                                        );
                                    e.innerHTML = `change shell ${hasNew ? App.getBadge("new!") : ""}`;
                                },
                                onclick: () => {
                                    App.handlers.open_shell_background_list();
                                    return true;
                                },
                            },
                            {
                                name: "custom shell",
                                onclick: () => {
                                    let display = App.displayList([
                                        {
                                            name: `<label class="custom-file-upload"><input id="shell-image-file" type="file"></input>Browse</label>`,
                                            onclick: (btn) => {
                                                // btn.querySelector('label').click();
                                                return true;
                                            },
                                        },
                                        {
                                            name: "enter url",
                                            onclick: () => {
                                                App.displayPrompt(
                                                    `Enter URL:`,
                                                    [
                                                        {
                                                            name: "set",
                                                            onclick: (url) => {
                                                                let res =
                                                                    App.setShellBackground(
                                                                        url,
                                                                    );
                                                                if (res)
                                                                    App.displayPopup(
                                                                        "Shell background set",
                                                                    );
                                                                return true;
                                                            },
                                                        },
                                                        {
                                                            name: "cancel",
                                                            class: "back-btn",
                                                            onclick: () => {},
                                                        },
                                                    ],
                                                );
                                                return true;
                                            },
                                        },
                                        {
                                            _ignore: !App.isTester,
                                            name: "from clipboard",
                                            onclick: async () => {
                                                try {
                                                    const clipboardItems =
                                                        await navigator.clipboard.read();

                                                    const item =
                                                        clipboardItems[0];
                                                    const type = item.types[0];
                                                    const blob =
                                                        await item.getType(
                                                            type,
                                                        );

                                                    const reader =
                                                        new FileReader();
                                                    reader.onload = (event) => {
                                                        App.setShellBackground(
                                                            event.target.result,
                                                        );
                                                    };
                                                    reader.readAsDataURL(blob);
                                                } catch (e) {
                                                    console.error(e);
                                                }
                                            },
                                        },
                                    ]);

                                    App.handleFileLoad(
                                        display.querySelector(
                                            "#shell-image-file",
                                        ),
                                        "readAsDataURL",
                                        async (data) => {
                                            const downscaledData =
                                                await downscaleImage(
                                                    data,
                                                    768,
                                                    768,
                                                    0.5,
                                                );
                                            let res =
                                                App.setShellBackground(
                                                    downscaledData,
                                                );
                                            if (res)
                                                App.displayPopup(
                                                    "Shell background set",
                                                );
                                            return true;
                                        },
                                    );

                                    return true;
                                },
                            },
                        ]);

                        return true;
                    },
                },
                {
                    name: "input code",
                    onclick: () => {
                        App.displayPrompt(`Enter code:`, [
                            {
                                name: "set",
                                onclick: (value) => {
                                    App.handleInputCode(value);
                                    return false;
                                },
                            },
                            {
                                name: "cancel",
                                class: "back-btn",
                                onclick: () => {},
                            },
                        ]);
                        return true;
                    },
                },
                { type: "separator" },
                {
                    name: "reset pet data",
                    onclick: () => {
                        App.displayConfirm(
                            "Are you sure you want to delete your saved pet?",
                            [
                                {
                                    name: "yes (delete)",
                                    onclick: async () => {
                                        App.save();
                                        App.save = () => {};

                                        App.displayPopup(
                                            "resetting...",
                                            App.INF,
                                        );

                                        window.localStorage?.removeItem("pet");
                                        window.localStorage?.removeItem(
                                            "last_time",
                                        );
                                        await window.idbKeyval.delMany([
                                            "last_time",
                                            "pet",
                                        ]);

                                        setTimeout(() => {
                                            location.reload();
                                        }, 1000);

                                        return false;
                                    },
                                },
                                {
                                    name: "no",
                                    class: "back-btn",
                                    onclick: () => {},
                                },
                            ],
                        );
                        return true;
                    },
                },
                {
                    name: "factory reset",
                    onclick: () => {
                        App.displayConfirm(
                            "Are you sure you want to completely delete your data? this will reset your pets, achievements, online id and everything else!",
                            [
                                {
                                    name: "yes",
                                    onclick: () => {
                                        App.displayConfirm(
                                            "Are you sure? There is no way to revert this.",
                                            [
                                                {
                                                    name: "yes (delete)",
                                                    onclick: async () => {
                                                        App.save = () => {};
                                                        App.displayPopup(
                                                            "resetting...",
                                                            App.INF,
                                                        );

                                                        window.localStorage?.clear();
                                                        await window.idbKeyval.clear();

                                                        setTimeout(() => {
                                                            location.reload();
                                                        }, 1000);

                                                        return false;
                                                    },
                                                },
                                                {
                                                    name: "no",
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
                        return true;
                    },
                },
                { type: "separator" },
                {
                    name: "credits",
                    onclick: () => App.handlers.open_credits(),
                },
                {
                    name: `send feedback`,
                    onclick: () => {
                        return App.displayPrompt(
                            `what would you like to to be added in the next update?`,
                            [
                                {
                                    name: "send",
                                    onclick: (data) => {
                                        if (!data) return true;
                                        App.displayPopup(
                                            `<b>Suggestion sent!</b><br> thanks for participating!`,
                                            4000,
                                        );
                                        App.sendFeedback(data);
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
                    name: `<b>rate us!</b>`,
                    onclick: () => App.handlers.show_rating_dialog(),
                },
                {
                    // _ignore: true,
                    link: App.routes.BLOG,
                    name: `<b>see changelog</b>`,
                    onclick: () => {
                        App.sendAnalytics("go_to_blog");
                        return true;
                    },
                },
                {
                    // _ignore: true,
                    link: App.routes.DISCORD,
                    name: '<b>join <span style="color:#7289da;text-shadow:none;">discord</span></b>',
                    onclick: () => true,
                },
                { type: "separator" },
                {
                    _disable: true,
                    name: `Version ${VERSION || "???"}`,
                    onclick: () => {
                        return true;
                    },
                },
            ],
            null,
            "Settings",
        );
    },
    open_stats: function () {
        const getCareRatingIcons = (
            current = App.pet.stats.current_care,
            max = App.pet.stats.max_care,
            sizePx,
        ) => {
            return new Array(max)
                .fill("")
                .map((_, i) => {
                    const style =
                        i >= current
                            ? "opacity: 0.5; filter:grayscale();"
                            : "filter:hue-rotate(310deg);";
                    const finalStyle = `${style} ${sizePx ? `width: ${sizePx}px;` : ""}`;
                    return `<img style="margin-top: 2px; ${finalStyle}" src="resources/img/misc/star_01.png"></img>`;
                })
                .join(" ");
        };

        const list = UI.genericListContainer();
        const content = UI.empty();
        content.innerHTML = `
            <div class="tabs">
                <div class="tab-titles">
                    <button for="tab-1" class="tab-title">${App.getIcon("bar-chart", true)}</button>
                    <button for="tab-2" class="tab-title">${App.getIcon("star", true)}</button>
                </div>
                <div class="tab-contents">
                    <div id="tab-1" class="tab">
                        <div class="tab-content">
                            <div class="inner-padding b-radius-10 flex-gap-2 flex flex-dir-col m mt-6">
                                <div class="relative flex flex-dir-row align-center flex-gap-1">
                                    <div class="stats-label">Money</div>
                                    <b class="outlined-icon flex flex-center" style="width: 18px;">${App.getIcon("special:gold", true)}</b>
                                    <b>$${Math.floor(App.pet.stats.gold)}</b>
                                </div>
                                <div class="relative flex flex-dir-row align-center flex-gap-1">
                                    <div class="stats-label">Hunger</div>
                                    <b class="outlined-icon flex flex-center" style="width: 18px;">${App.getIcon("special:food", true)}</b>
                                    ${App.createProgressbar((App.pet.stats.current_hunger / App.pet.stats.max_hunger) * 100).node.outerHTML}
                                </div>
                                <div class="relative flex flex-dir-row align-center flex-gap-1">
                                    <div class="stats-label">Fun</div>
                                    <b class="outlined-icon flex flex-center" style="width: 18px;">${App.getIcon("special:fun", true)}</b>
                                    ${App.createProgressbar((App.pet.stats.current_fun / App.pet.stats.max_fun) * 100).node.outerHTML}
                                </div>
                                <div class="relative flex flex-dir-row align-center flex-gap-1">
                                    <div class="stats-label">Sleep</div>
                                    <b class="outlined-icon flex flex-center" style="width: 18px;">${App.getIcon("special:sleep", true)}</b>
                                    ${App.createProgressbar((App.pet.stats.current_sleep / App.pet.stats.max_sleep) * 100).node.outerHTML}
                                </div>
                                <div class="relative flex flex-dir-row align-center flex-gap-1">
                                    <div class="stats-label">Discipline</div>
                                    <b class="outlined-icon flex flex-center" style="width: 18px;">${App.getIcon("special:discipline", true)}</b>
                                    ${App.createProgressbar((App.pet.stats.current_discipline / App.pet.stats.max_discipline) * 100).node.outerHTML}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="tab-2" class="tab">
                        <div class="tab-content">
                            <div class="inner-padding b-radius-10 flex-gap-2 flex flex-dir-col m mt-6">
                                <div class="relative flex flex-dir-row align-center flex-gap-1">
                                    <div class="stats-label">Expression</div>
                                    <b class="outlined-icon flex flex-center" style="width: 18px;">${App.getIcon("special:expression", true)}</b>
                                    ${App.createProgressbar((App.pet.stats.current_expression / 100) * 100).node.outerHTML}
                                </div>
                                <div class="relative flex flex-dir-row align-center flex-gap-1">
                                    <div class="stats-label">Logic</div>
                                    <b class="outlined-icon flex flex-center" style="width: 18px;">${App.getIcon("special:logic", true)}</b>
                                    ${App.createProgressbar((App.pet.stats.current_logic / 100) * 100).node.outerHTML}
                                </div>
                                <div class="relative flex flex-dir-row align-center flex-gap-1">
                                    <div class="stats-label">Endurance</div>
                                    <b class="outlined-icon flex flex-center" style="width: 18px;">${App.getIcon("special:endurance", true)}</b>
                                    ${App.createProgressbar((App.pet.stats.current_endurance / 100) * 100).node.outerHTML}
                                </div>
                                <div class="flex-between align-center">
                                    <b>CARE:</b> <div style="display: inline-flex; gap: 1px">${getCareRatingIcons()}</div>
                                </div>
                            </div>
                            <div class="inner-padding b-radius-10 uppercase list-text surface-stylized ${!App.settings.skillsAffectingEvolution ? "hidden" : ""}">
                                <small>
                                    <i class="fa-solid fa-info-circle"></i>
                                    High enough skills will override care ratings above 1 when evolving.
                                    <hr>
                                    <div>
                                        <span class="flex-between items-center no-width-children"> ${App.getIcon("special:endurance")}➜ ${getCareRatingIcons(1, undefined, 16)} </span>
                                        <span class="flex-between items-center no-width-children"> ${App.getIcon("special:logic")}➜ ${getCareRatingIcons(2, undefined, 16)} </span>
                                        <span class="flex-between items-center no-width-children"> ${App.getIcon("special:expression")}➜ ${getCareRatingIcons(3, undefined, 16)} </span>
                                    </div>
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        App.initTab(content);
        list.appendChild(content);
    },
    open_food_stats: function (foodName) {
        const food = App.definitions.food[foodName];

        if (!food) return false;

        /* bugs out with negative values */

        const list = UI.genericListContainer(null, foodName);
        const content = UI.empty();
        content.innerHTML = `
            <div class="inner-padding b-radius-10 m surface-stylized">
                <div style="margin-bottom: 16px">
                    <small>Replenish rates for different stats:</small>
                </div>
                <div>
                    <b>HUNGER:</b> ${App.createProgressbar(food.hunger_replenish || (0 / App.pet.stats.max_hunger) * 100).node.outerHTML}
                </div>
                <div>
                    <b>SLEEP:</b> ${App.createProgressbar(food.sleep_replenish || (0 / App.pet.stats.max_sleep) * 100).node.outerHTML}
                </div>
                <div>
                    <b>FUN:</b> ${App.createProgressbar(food.fun_replenish || (0 / App.pet.stats.max_fun) * 100).node.outerHTML}
                </div>
                <div>
                    <b>HEALTH:</b> ${App.createProgressbar(food.health_replenish || (0 / App.pet.stats.max_health) * 100).node.outerHTML}
                </div>
            </div>
            `;
        list.appendChild(content);
        list.style.zIndex = 5;
    },
    add_active_pet_to_collection: function (char = App.petDefinition.sprite) {
        const eventId = `${App.constants.CHAR_UNLOCK_PREFIX}_${PetDefinition.getCharCode(char)}`;
        App.addEvent(eventId);
    },
    open_character_collection: function () {
        App.handlers.add_active_pet_to_collection();

        let unlockedCount = 0;
        const allCharacters = ALL_PLAYABLE_CHARACTERS;
        const charactersDef = allCharacters.map((char) => {
            const charCode = PetDefinition.getCharCode(char);
            const isUnlocked = App.getEvent(
                `${App.constants.CHAR_UNLOCK_PREFIX}_${charCode}`,
            );
            if (isUnlocked) unlockedCount++;
            return {
                componentType: "div",
                className: `collection__char ${!isUnlocked ? "locked" : ""}`,
                innerHTML: PetDefinition.generateFullCSprite(char),
                onclick: ({ target }) => {
                    if (!App.isTester()) return;
                    target.classList.remove("locked");
                },
                ondblclick: () => {
                    if (!App.isTester()) return;

                    if (confirm("Set this as main character?")) {
                        App.petDefinition.sprite = char;
                        App.save();
                        setTimeout(() => window.location.reload(), 1000);
                    }
                },
            };
        });

        const list = UI.genericListContainer(
            null,
            `(${unlockedCount}/${allCharacters.length})`,
        );
        const content = UI.empty();
        content.classList.add("collection__container");
        list.appendChild(content);
        charactersDef.forEach((def) => UI.create({ ...def, parent: content }));

        App.sendAnalytics("opened_character_collection");
    },
    open_family_tree: function (petDefinition, usePastTense) {
        if (!petDefinition) petDefinition = App.petDefinition;

        // populating family tree for the first time
        // for backwards compatibility
        if (!petDefinition.family.length) {
            const parents = petDefinition.getParents();
            if (parents?.length == 2) {
                petDefinition.family = [
                    parents.map((parent) => App.minimalizePetDef(parent)),
                ];
            }
        }

        if (!petDefinition.family.length && !usePastTense) {
            return App.displayPopup(
                `${petDefinition.name} is the pioneer of the family!<br> come back when your family has grown!`,
            );
        }

        const list = UI.genericListContainer();
        const content = UI.empty();

        const oldestAncestor = petDefinition.family.length
            ? petDefinition.family[0][0]
            : petDefinition;

        const infoPanelContent = usePastTense
            ? `
                        This family began on
                        <br>
                        <b>${moment(oldestAncestor.birthday).format("MMMM DD YYYY")}</b>
                        <br>
                        and ran for
                        <br>
                        <b>${petDefinition.family.length + 1} generations</b>
                    `
            : `
                        This family has been running for
                        <br>
                        <b>${petDefinition.family.length + 1} generations</b>
                        <br>
                        since
                        <br>
                        <b>${moment(oldestAncestor.birthday).fromNow()}</b>
                    `;

        content.innerHTML = `
                <div class="b-radius-10 m surface-stylized flex-center height-auto inner-padding">
                    ${petDefinition.family
                        .map((partners, i) => {
                            const [a, b] = partners;

                            return `
                                <div data-fb-focusable class="family-tree__partners-container">
                                    <div class="family-tree__gen-badge">${i + 1}</div>

                                    <div class="family-tree__member-container">
                                        ${PetDefinition.generateFullCSprite(b.sprite, null, PetDefinition.getSpriteClassName(b))}
                                        <small>${b.name}</small>
                                    </div>

                                    <div class="family-tree__vertical-line"></div>

                                    <div class="family-tree__member-container">
                                        ${PetDefinition.generateFullCSprite(a.sprite, null, PetDefinition.getSpriteClassName(a))}
                                        <small>${a.name}</small>
                                    </div>
                                </div>
                                <div class="family-tree__horizontal-line"></div>
                            `;
                        })
                        .join("")}
                    <div data-fb-focusable style="margin-left: 76px" class="family-tree__member-container">
                        ${petDefinition.getFullCSprite()}
                        <small>${petDefinition.name}</small>
                    </div>
                </div>

                <div data-fb-focusable class="b-radius-10 m surface-stylized height-auto inner-padding">
                    ${infoPanelContent}
                </div>
            `;

        list.appendChild(content);
        App.sendAnalytics("opened_family_tree");
    },
    open_food_list: function (props = {}) {
        const {
            buyMode,
            activeIndex,
            filterType,
            sellMode,
            useMode,
            useModeLabel = "Use",
            useAmount = 1,
            age = App.petDefinition.lifeStage,
            getListOnly,
            allowCookableOnly,
            limitFilter,
            outOfStockPercent = 20,
            priceMult = 1,
        } = props;

        let list = [];
        let sliderInstance;
        const salesDay = App.isSalesDay();
        let index = -1;
        const getIsOutOfStock = App.getOutOfStockCounter(
            App.getDayId(true) + 25,
        );
        for (let food of Object.keys(App.definitions.food)) {
            let isDisabled = false;

            let current = App.definitions.food[food];
            const currentType = current.type || "food";
            const ownedAmount = App.pet.inventory.food[food];
            const isFree = current.price === 0;

            // lifestage check
            if ("age" in current && !current.age.includes(age)) continue;

            // buy mode and should skip
            if (
                buyMode &&
                (isFree ||
                    (!allowCookableOnly && current.cookableOnly) ||
                    current.unbuyable)
            )
                continue;

            // filter type check
            if (filterType && currentType !== filterType) continue;

            if (limitFilter?.({ ...current, ownedAmount })) isDisabled = true;

            // check if current pet has this food on its inventory
            if (current.price && !ownedAmount && !buyMode) {
                continue;
            }

            // auto disable if more less than useAmount
            if (!buyMode && !isFree && ownedAmount < useAmount)
                isDisabled = true;

            // some entries become randomly unavailable to buy for the day
            const isOutOfStock =
                ++index &&
                buyMode &&
                getIsOutOfStock(outOfStockPercent) &&
                currentType !== "med";

            // 50% off on sales day
            const actualPrice = current.price * priceMult;
            let price = actualPrice;
            if (sellMode) {
                if (isFree) continue;
                let sellRate = current.cookableOnly ? 1.5 : 0.75;
                if (App.petDefinition.hasTrait("haggler")) sellRate *= 1.25;
                let sellPrice = Math.floor(actualPrice * sellRate);
                if (!current.cookableOnly && sellPrice > actualPrice) sellPrice = actualPrice - 1;
                price = sellPrice;
            }
            const sellTone = current.cookableOnly ? "positive" : "negative";
            if (salesDay) price = Math.round(price / 2);

            const foodIcon = App.getFoodCSprite(current.sprite);

            const isFavorite = App.petDefinition.isFavorite(
                current.sprite,
                currentType,
            );

            list.push({
                disabled: Boolean(isOutOfStock || isDisabled),
                current,
                foodName: food,
                price,
                icon: foodIcon,
                shortName: `<div class="icon">${foodIcon}</div> <span class="ellipsis">${food.toUpperCase()}</span>  ${isFavorite ? App.getBadge(App.getIcon("heart", true)) : ""}`,
                name: `
                        ${foodIcon}
                        ${current.cookableOnly ? "★ " : ""}
                        ${isFavorite ? App.getFavoriteItemUI() : ""}
                        ${food.toUpperCase()}
                        (x${ownedAmount > 0 ? ownedAmount : !current.price ? "∞" : 0})
                        ${
                            isOutOfStock
                                ? `<b class="red-label">OUT OF STOCK</b>`
                                : `<b>
                                ${
                                    buyMode || sellMode
                                        ? `
                                    ${sellMode ? `<span class="opacity-half">$${current.price} <i class="fa-solid fa-angle-right"></i> </span>` : ""}
                                    <span class="${sellMode ? `seller-analysis ${sellTone}` : ""}">
                                        $${price}
                                    </span>
                                `
                                        : ""
                                }
                            </b>`
                        }
                        ${current.isNew ? App.getBadge("new!") : ""}
                    `,
                onclick: (btn, list) => {
                    // buy mode
                    if (buyMode || sellMode) {
                        if (sellMode) {
                            // sell mode
                            App.pet.stats.gold += price;
                            App.addNumToObject(
                                App.pet.inventory.food,
                                food,
                                -1,
                            );
                        } else {
                            // buying
                            if (!App.pay(price)) return true;
                            App.addNumToObject(App.pet.inventory.food, food, 1);
                            Missions.done(Missions.TYPES.buy_food);
                        }
                        App.handlers.open_food_list({
                            ...props,
                            activeIndex: sliderInstance?.getCurrentIndex(),
                        });
                        return false;
                    }

                    const removeFoodFromInventory = (amount = useAmount) => {
                        const ownedAmount = App.pet.inventory.food[food];

                        if (ownedAmount >= amount) {
                            App.pet.inventory.food[food] -= amount;
                            return true;
                        }

                        return false;
                    };

                    if (useMode) {
                        const useResult = useMode(current);
                        if (useResult) removeFoodFromInventory();
                        return;
                    }

                    // eat mode
                    const reopenFn = (noLongerHungry) => {
                        if (noLongerHungry && currentType == "food") return;
                        App.handlers.open_feeding_menu();
                        App.handlers.open_food_list({
                            ...props,
                            activeIndex: sliderInstance?.getCurrentIndex(),
                        });
                    };

                    App.closeAllDisplays();
                    let ateFood = App.pet.feed(
                        current.sprite,
                        current.hunger_replenish ?? 0,
                        currentType,
                        null,
                        reopenFn,
                    );
                    if (ateFood) {
                        removeFoodFromInventory();

                        let funReplenish = current.fun_replenish ?? 0;
                        if (isFavorite) funReplenish += 10;
                        App.pet.stats.current_fun += funReplenish;

                        App.pet.stats.current_sleep +=
                            current.sleep_replenish ?? 0;

                        App.pet.stats.current_expression +=
                            current.expression_increase ?? 0;
                        App.pet.stats.current_logic +=
                            current.logic_increase ?? 0;
                        App.pet.stats.current_endurance +=
                            current.endurance_increase ?? 0;
                        App.pet.stats.current_discipline +=
                            current.discipline_increase ?? 0;

                        if (
                            App.pet.hasMoodlet("healthy") &&
                            food === "medicine"
                        )
                            App.pet.stats.current_health =
                                App.pet.stats.current_health * 0.6;
                        else
                            App.pet.stats.current_health +=
                                current.health_replenish ?? 0;

                        // custom callback after eating item
                        if (current.payload) {
                            App.queueEvent(current.payload);
                        }
                    }
                },
            });
        }

        if (getListOnly) {
            return list;
        }

        if (!list.length) {
            App.displayPopup(
                `You don't have any consumables, purchase some from the market`,
                2000,
            );
            return;
        }

        if (buyMode) list.push(list.shift());

        let acceptLabel = "Eat";
        if (buyMode) acceptLabel = "Purchase";
        else if (sellMode) acceptLabel = "Sell";
        else if (useMode) acceptLabel = useModeLabel;
        sliderInstance = App.displaySlider(
            list.sort(
                (a, b) => (b?.current?.isNew || 0) - (a?.current?.isNew || 0),
            ),
            activeIndex,
            { accept: acceptLabel },
            buyMode || sellMode
                ? `$${App.pet.stats.gold + (salesDay ? ` <span class="sales-notice">DISCOUNT DAY!</span>` : "")}`
                : null,
        );

        return sliderInstance;
    },
    open_seed_list: function (buyMode, activeIndex, payloadFn) {
        let list = [];
        let sliderInstance;
        const salesDay = App.isSalesDay();
        let index = -1;
        const getIsOutOfStock = App.getOutOfStockCounter(
            App.getDayId(true) + 50,
        );
        for (let plant of Object.keys(App.definitions.plant)) {
            let current = App.definitions.plant[plant];

            // buy mode and is free
            if (buyMode && current.price == 0) continue;

            // check if current pet has this seed on its inventory
            if (current.price && !App.pet.inventory.seeds[plant] && !buyMode) {
                continue;
            }

            // some entries become randomly unavailable to buy for the day
            const isOutOfStock = ++index && buyMode && getIsOutOfStock(0);

            // 50% off on sales day
            let price = current.price;
            if (salesDay) price = Math.round(price / 2);

            const plantIcon = Plant.getCSprite(
                plant,
                Plant.AGE.grown,
                "seed-pack",
            );

            list.push({
                disabled: isOutOfStock,
                shortName: `<div class="icon">${Plant.getCSprite(plant, Plant.AGE.grown)}</div> <span class="ellipsis">${plant.toUpperCase()}</span>`,
                name: `
                        ${plantIcon}
                        ${plant.toUpperCase()} seeds
                        (x${App.pet.inventory.seeds[plant] > 0 ? App.pet.inventory.seeds[plant] : !current.price ? "∞" : 0})
                        ${
                            isOutOfStock
                                ? `<b class="red-label">OUT OF STOCK</b>`
                                : `<b>${buyMode ? `$${price}` : ""}</b>`
                        }
                    `,
                onclick: (btn, list) => {
                    // buy mode
                    if (buyMode) {
                        if (!App.pay(price)) return true;
                        App.addNumToObject(App.pet.inventory.seeds, plant, 1);
                        App.handlers.open_seed_list(
                            true,
                            sliderInstance?.getCurrentIndex(),
                        );
                        return false;
                    }

                    const shouldRemove = payloadFn?.(plant, current); // passing name / object
                    if (shouldRemove) {
                        if (App.pet.inventory.seeds[plant] > 0)
                            App.pet.inventory.seeds[plant] -= 1;
                    }
                },
            });
        }

        if (!list.length) {
            App.displayPopup(
                `You don't have any seeds, purchase some from the market`,
                2000,
            );
            return;
        }

        if (buyMode) list.push(list.shift());

        sliderInstance = App.displaySlider(
            list,
            activeIndex,
            { accept: buyMode ? "Purchase" : "Plant" },
            buyMode
                ? `$${App.pet.stats.gold + (salesDay ? ` <span class="sales-notice">DISCOUNT DAY!</span>` : "")}`
                : null,
        );
        return sliderInstance;
    },
    open_feeding_menu: function () {
        App.displayList(
            [
                {
                    name: "food",
                    onclick: () => {
                        App.handlers.open_food_list({ filterType: "food" });
                        return true;
                    },
                },
                {
                    name: "snacks",
                    onclick: () => {
                        App.handlers.open_food_list({ filterType: "treat" });
                        return true;
                    },
                },
                {
                    name: "meds",
                    onclick: () => {
                        App.handlers.open_food_list({ filterType: "med" });
                        return true;
                    },
                },
                {
                    // _ignore: !App.isTester(),
                    _disable:
                        App.petDefinition.lifeStage <=
                        PetDefinition.LIFE_STAGE.baby,
                    name: `cook`,
                    onclick: () => {
                        return App.displayList([
                            {
                                name: "camera",
                                onclick: () => {
                                    return App.displayConfirm(
                                        `You take 3 pictures to use as ingredients for your soup! after that, tap to stir until it's mixed!`,
                                        [
                                            {
                                                name: "start",
                                                onclick: () =>
                                                    Activities.cookingGame(),
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
                                name: `harvests`,
                                onclick: () => {
                                    let allPlants = [];
                                    const getIngredients = (name) => {
                                        pRandom.save();
                                        const seed = hashCode(name);
                                        const results = new Array(3)
                                            .fill(null)
                                            .map((_, i) => {
                                                if (!allPlants.length)
                                                    allPlants = Object.keys(
                                                        App.definitions.plant,
                                                    )
                                                        .map((name) => ({
                                                            ...App.definitions
                                                                .plant[name],
                                                            name,
                                                        }))
                                                        .filter(
                                                            ({ inedible }) =>
                                                                !inedible,
                                                        )
                                                        .map(
                                                            ({ name }) => name,
                                                        );

                                                pRandom.seed =
                                                    seed + (i + 1) * 321 * seed;
                                                const item =
                                                    pRandomFromArray(allPlants);
                                                allPlants.splice(
                                                    allPlants.indexOf(item),
                                                    1,
                                                );
                                                return item;
                                            });
                                        pRandom.load();
                                        return results;
                                    };
                                    const getMinOwnedIngredients = (
                                        ingredients,
                                    ) => {
                                        let minOwnedIngredients = Infinity;
                                        ingredients.forEach(
                                            (ingredientName) => {
                                                const ownedAmount =
                                                    App.pet.inventory.harvests[
                                                        ingredientName
                                                    ];
                                                if (
                                                    minOwnedIngredients >
                                                    ownedAmount
                                                )
                                                    minOwnedIngredients =
                                                        ownedAmount;
                                            },
                                        );
                                        return minOwnedIngredients;
                                    };

                                    return App.displayList([
                                        {
                                            name: `
                                            <div class="flex-between flex-wrap" style="row-gap: 4px">
                                                ${App.getHarvestInventoryUI((item) => !item.def.inedible)}
                                            </div>
                                            `,
                                            type: "text",
                                        },
                                        ...Object.keys(App.definitions.food)
                                            .map((foodName) => ({
                                                ...App.definitions.food[
                                                    foodName
                                                ],
                                                name: foodName,
                                            }))
                                            .filter(
                                                (food) => !food.nonCraftable,
                                            )
                                            .map((food) => {
                                                const ingredients =
                                                    getIngredients(food.name);
                                                const hasAllIngredients =
                                                    ingredients.every(
                                                        (ingredientName) =>
                                                            App.pet.inventory
                                                                .harvests[
                                                                ingredientName
                                                            ],
                                                    );
                                                return {
                                                    ...food,
                                                    ingredients,
                                                    hasAllIngredients,
                                                };
                                            })
                                            .sort(
                                                (a, b) =>
                                                    (b.cookableOnly || false) -
                                                    (a.cookableOnly || false),
                                            )
                                            .sort(
                                                (a, b) =>
                                                    b.hasAllIngredients -
                                                    a.hasAllIngredients,
                                            )
                                            .map((food) => ({
                                                _disable:
                                                    !food.hasAllIngredients,
                                                class: "flex-between",
                                                name: `
                                                    ${App.getFoodCSprite(food.sprite)} = ${App.getHarvestIcons(food.ingredients)}
                                                    ${food.cookableOnly ? App.getBadge("★", "gold") : ""}
                                                `,
                                                onclick: () => {
                                                    const maxBatchCookingAmount =
                                                        getMinOwnedIngredients(
                                                            food.ingredients,
                                                        );
                                                    let currentCookAmount = 1;
                                                    const updateCookAmount = (
                                                        amount,
                                                    ) => {
                                                        currentCookAmount =
                                                            Number(amount);
                                                        list.querySelector(
                                                            "#cook-amount",
                                                        ).textContent =
                                                            currentCookAmount;
                                                    };
                                                    const list =
                                                        App.displayList(
                                                            [
                                                                {
                                                                    type: "text",
                                                                    name: `
                                                                <div>How many?</div>
                                                                <div class="mt-4"></div>
                                                                ${
                                                                    App.createRangeSlider(
                                                                        {
                                                                            min: 1,
                                                                            max: maxBatchCookingAmount,
                                                                            _disable:
                                                                                maxBatchCookingAmount ===
                                                                                1,
                                                                            dataList:
                                                                                [
                                                                                    [
                                                                                        1,
                                                                                        1,
                                                                                    ],
                                                                                    [
                                                                                        maxBatchCookingAmount,
                                                                                        maxBatchCookingAmount,
                                                                                    ],
                                                                                ],
                                                                        },
                                                                    ).outerHTML
                                                                }
                                                            `,
                                                                    _mount: (
                                                                        me,
                                                                    ) => {
                                                                        const input =
                                                                            me.querySelector(
                                                                                "input",
                                                                            );
                                                                        input.value =
                                                                            currentCookAmount;
                                                                        input.addEventListener(
                                                                            "input",
                                                                            () =>
                                                                                updateCookAmount(
                                                                                    input.value,
                                                                                ),
                                                                        );
                                                                    },
                                                                },
                                                                {
                                                                    name: `<span class="icon">${App.getFoodCSprite(food.sprite)}</span> <span class="mr-auto">Cook</span> x<span id="cook-amount">${currentCookAmount}</span>`,
                                                                    onclick:
                                                                        () => {
                                                                            const confirm =
                                                                                App.displayConfirm(
                                                                                    `
                                                                    Cook <div>${App.getFoodCSprite(food.sprite)}</div> <b>${food.cookableOnly ? "★ " : ""}${food.name}</b> <span>x${currentCookAmount}</span>?
                                                                    <button id="effects" style="display: none; position: absolute; bottom: 0; right: 0" class="generic-btn stylized"><b>effects</b></button>
                                                                `,
                                                                                    [
                                                                                        {
                                                                                            name: "yes",
                                                                                            onclick:
                                                                                                () => {
                                                                                                    food.ingredients.forEach(
                                                                                                        (
                                                                                                            ingredient,
                                                                                                        ) => {
                                                                                                            if (
                                                                                                                App
                                                                                                                    .pet
                                                                                                                    .inventory
                                                                                                                    .harvests[
                                                                                                                    ingredient
                                                                                                                ] >=
                                                                                                                currentCookAmount
                                                                                                            )
                                                                                                                App.pet.inventory.harvests[
                                                                                                                    ingredient
                                                                                                                ] -=
                                                                                                                    currentCookAmount;
                                                                                                        },
                                                                                                    );
                                                                                                    Activities.cookingGame(
                                                                                                        {
                                                                                                            skipCamera: true,
                                                                                                            resultFoodName:
                                                                                                                food.name,
                                                                                                            resultFoodAmount:
                                                                                                                currentCookAmount,
                                                                                                            stirringSpeed: 0.0095,
                                                                                                            ingredientObjects:
                                                                                                                food.ingredients.map(
                                                                                                                    (
                                                                                                                        name,
                                                                                                                    ) =>
                                                                                                                        new Object2d(
                                                                                                                            {
                                                                                                                                img: App
                                                                                                                                    .constants
                                                                                                                                    .PLANT_SPRITESHEET,
                                                                                                                                spritesheet:
                                                                                                                                    {
                                                                                                                                        ...App
                                                                                                                                            .constants
                                                                                                                                            .PLANT_SPRITESHEET_DIMENSIONS,
                                                                                                                                        cellNumber:
                                                                                                                                            App
                                                                                                                                                .definitions
                                                                                                                                                .plant[
                                                                                                                                                name
                                                                                                                                            ]
                                                                                                                                                .sprite +
                                                                                                                                            2,
                                                                                                                                    },
                                                                                                                            },
                                                                                                                        ),
                                                                                                                ),
                                                                                                        },
                                                                                                    );
                                                                                                },
                                                                                        },
                                                                                        {
                                                                                            name: "no",
                                                                                            class: "back-btn",
                                                                                            onclick:
                                                                                                () => {},
                                                                                        },
                                                                                    ],
                                                                                );

                                                                            const effectsBtn =
                                                                                confirm.querySelector(
                                                                                    "#effects",
                                                                                );
                                                                            if (
                                                                                effectsBtn
                                                                            ) {
                                                                                effectsBtn.onclick =
                                                                                    () =>
                                                                                        App.handlers.open_food_stats(
                                                                                            food.name,
                                                                                        );
                                                                            }

                                                                            return true;
                                                                        },
                                                                },
                                                            ],
                                                            null,
                                                            food.name,
                                                        );
                                                    return true;
                                                },
                                            })),
                                        {
                                            name: `★ Symbol indicates the item is only obtainable from cooking and has special effect(s)`,
                                            type: "info",
                                        },
                                    ]);
                                },
                            },
                        ]);
                    },
                },
            ],
            null,
            "Feeding",
        );
    },
    open_stats_menu: function () {
        const hasNewlyUnlockedAchievements =
            App.handlers.open_achievements_list(true);
        App.displayList(
            [
                {
                    name: "stats",
                    onclick: () => {
                        App.handlers.open_stats();
                        return true;
                    },
                },
                {
                    name: "profile",
                    onclick: () => {
                        if (!App.userName) {
                            App.handlers.show_set_username_dialog();
                            return true;
                        }
                        App.handlers.open_profile();
                        return true;
                    },
                },
                {
                    name: `family tree`,
                    onclick: () => {
                        App.handlers.open_family_tree();
                        return true;
                    },
                },
                {
                    name: `collection`,
                    onclick: () => {
                        App.handlers.open_character_collection();
                        return true;
                    },
                },
                {
                    name: `achievements ${hasNewlyUnlockedAchievements ? App.getBadge("Rewards!") : ""}`,
                    onclick: () => {
                        App.handlers.open_achievements_list();
                        return true;
                    },
                },
                {
                    name: App.settings.genderedPets
                        ? "set name/gender"
                        : "set nickname",
                    onclick: () => {
                        const prompt = App.settings.genderedPets
                            ? "Enter Name and Gender:"
                            : "Enter a new name for your pet:";
                        App.handlers.show_set_pet_name_dialog(prompt);
                        return true;
                    },
                },
                {
                    _disable: !App.petDefinition?.deceasedPredecessors?.length,
                    name: `past generations`,
                    onclick: () => {
                        const generations =
                            App.petDefinition?.deceasedPredecessors?.map(
                                (def) => {
                                    const petDefinition = new PetDefinition(
                                        def,
                                    );
                                    return {
                                        name: `${petDefinition.getCSprite()} ${petDefinition.name}`,
                                        onclick: () => {
                                            App.handlers.open_family_tree(
                                                petDefinition,
                                                true,
                                            );
                                            return true;
                                        },
                                    };
                                },
                            );
                        App.displayList([
                            {
                                name: "Select the generation",
                                type: "text",
                            },
                            ...generations,
                        ]);
                        return true;
                    },
                },
            ],
            null,
            "Information",
        );
    },
    open_active_buffs: (type) => {
        if (typeof type !== "string") type = null;

        const activeBuffs = Object.values(App.definitions.gameplay_buffs)
            .filter((buff) => (type ? buff.type === type : true))
            .filter((buff) => App.isGameplayBuffActive(buff.key));
        const buffsUI = activeBuffs
            .map((buff) => App.getGameplayBuffUI(buff))
            .join("<hr>");
        return App.displayList([
            {
                name: activeBuffs.length
                    ? buffsUI
                    : App.getEmptyStateUI(`No ${type ?? "active"} buffs`),
                type: "text",
            },
            {
                name: "You can get buffs by adopting animals in the backyard!",
                type: "info",
            },
        ]);
    },
    open_traits: () => {
        const traitKeys = Object.keys(App.definitions.traits);

        return App.displayList(
            traitKeys.map((key) => ({
                name: `${App.getTraitCSprite(key)} ${App.definitions.traits[key].name}`,
                onclick: () => {},
            })),
        );
    },
    open_profile: function () {
        const petExpTraitIcons = [
            {
                title: "Potty-trained",
                img: "resources/img/misc/poop.png",
                condition: App.pet.stats.is_potty_trained,
            },
            {
                title: "Revived",
                img: "resources/img/misc/ghost_02.png",
                condition: App.pet.stats.is_revived_once,
            },
            {
                title: "Immortal",
                img: "resources/img/misc/infinity_01.png",
                condition: App.pet.stats.is_ghost,
            },
        ];
        const unknownTraitIcon = `<span class="opacity-half">?</span>`;
        const wrapAsIcon = ({ content, onClickPopupContent }) => `<div
                ${onClickPopupContent ? `onclick="App.displayPopup(\`${onClickPopupContent}\`)"` : ""}
                class="pet-trait-icon click-sound">
                    ${content}
                </div>`;
        const getFavoriteIcon = (type) => {
            const value = App.petDefinition.stats.favorites[type];

            const getDescription = (name) =>
                `<small>Favorite ${type}:</small> <div> <b>${name ?? "Invalid"}</b> </div>`;

            if (!value) return "";

            if (["treat", "food"].includes(type)) {
                const def =
                    Object.entries(App.definitions.food).find(
                        ([_, item]) => item.sprite === value,
                    ) || [];
                return wrapAsIcon({
                    content: `${App.getFoodCSprite(value)}`,
                    onClickPopupContent: getDescription(def[0]),
                });
            }
        };

        const playTimeDuration = moment.duration(App.playTime);

        const list = UI.genericListContainer();
        const content = UI.empty("flex flex-dir-col flex-1");
        content.innerHTML = `
                <div data-fb-focusable class="flex-center flex-1 flex flex-gap-05 inner-padding surface-stylized height-auto relative">
                    ${App.petDefinition.getCSprite(true)}
                    <b>
                        <span>${App.settings.genderedPets ? App.getIcon(App.pet.stats.gender, true) : ""} ${App.petDefinition.name} </span>
                        <br>
                        <small>${App.petDefinition.getLifeStageLabel()} - gen ${App.petDefinition.family.length + 1}</small>
                    </b>
                    ${
                        App.pet.stats.is_ghost
                            ? `
                        <b>
                            ${App.pet.stats.is_ghost === PetDefinition.GHOST_TYPE.angel ? App.constants.SPANS.angel : ""}
                            ${App.pet.stats.is_ghost === PetDefinition.GHOST_TYPE.devil ? App.constants.SPANS.monster : ""}
                        </b>
                        `
                            : ""
                    }
                    <span>
                        Born ${moment(App.petDefinition.birthday).fromNow()}
                    </span>
                </div>
                <div class="surface-stylized inner-padding flex flex-gap-05 flex-dir-col">
                    <small>Traits:</small>
                    <div data-fb-focusable class="relative mt-6 width-full">
                        <div class="stats-label left-0">Experience</div>
                        <div class="pet-trait-icons-container">
                            ${petExpTraitIcons
                                .map((icon) => {
                                    return `<div onclick="App.displayPopup('<small>exp trait:</small> <br> <b>${icon.title}</b> <small>(${icon.condition ? "active" : "inactive"})</small>')" title="${icon.title}" class="pet-trait-icon click-sound ${!icon.condition ? "disabled" : ""}">
                                    <img src="${icon.img}"></img>
                                </div>`;
                                })
                                .join("")}
                        </div>
                    </div>
                    <div data-fb-focusable class="relative mt-6 width-full">
                        <div class="stats-label left-0">Personality</div>
                        <div class="pet-trait-icons-container">
                            ${!App.petDefinition.traits.length ? unknownTraitIcon : ""}
                            ${App.petDefinition.traits
                                .map((key) => {
                                    const definition =
                                        App.definitions.traits[key];
                                    if (!definition) return unknownTraitIcon;
                                    return `<div onclick="App.displayPopup('<small>trait:</small> <br> <b>${definition.name}</b><br><small>${definition.description}</small>')" title="${definition.name}" class="pet-trait-icon click-sound">
                                    ${App.getTraitCSprite(key)}
                                </div>`;
                                })
                                .join("")}
                        </div>
                    </div>
                    <div data-fb-focusable class="relative mt-6 width-full">
                        <div class="stats-label left-0">Zodiac sign</div>
                        <div class="pet-trait-icons-container">
                            ${App.getZodiacSign(App.petDefinition.birthday)}
                        </div>
                    </div>
                    <div data-fb-focusable class="relative mt-6 width-full">
                        <div class="stats-label left-0">Favorites</div>
                        <div class="pet-trait-icons-container">
                            ${!Object.keys(App.pet.stats.favorites).length ? unknownTraitIcon : ""}
                            ${getFavoriteIcon("food")}
                            ${getFavoriteIcon("treat")}
                        </div>
                    </div>
                </div>
                <div data-fb-focusable class="user-id surface-stylized inner-padding text-transform-none">
                    <div class="flex flex-dir-col">
                        <small>play time:</small>
                        <span>${Math.floor(playTimeDuration.asHours())} hours and ${playTimeDuration.minutes()} minutes</span>
                    </div>
                </div>
                ${App.getUidUI()}
            `;

        list.appendChild(content);
    },
    copyToClipboard: (content) => {
        navigator.clipboard.writeText(content);
        App.displayPopup("Copied!");
    },
    open_plant_stats: function (plant) {
        const list = UI.genericListContainer();
        const content = UI.empty();

        const { wateredDuration, deathDuration, growthDelay } =
            plant.getStatDurations();

        const getTimeDisplay = (time, pastMessage) => {
            const timeAsMoment = moment(time);
            // const text = timeAsMoment.fromNow(true);
            const text = App.getPreciseTimeFromNow(time);
            const isPast = timeAsMoment.isBefore(moment());

            if (isPast)
                return `<span class="overflow-hidden ellipsis" style="opacity: 0.7;text-decoration: line-through;display: block;">${pastMessage}</span>`;

            return `<span">${text}</span>`;
        };

        const nextGrowthTime = !plant.isDead
            ? plant.lastGrowthTime + growthDelay
            : -1;
        const deathTime = plant.lastWatered + deathDuration;
        const hydratedTime = plant.lastWatered + wateredDuration;

        let innerContent = `
                <div>
                    <b>GROWS IN:</b>
                    <div class="surface-stylized inner-padding">${getTimeDisplay(nextGrowthTime, "GROWN")}</div>
                </div>
                <div>
                    <b>Dehydrates in:</b>
                    <div class="surface-stylized inner-padding">${getTimeDisplay(hydratedTime, "DEHYDRATED")}</div>
                </div>
                <div>
                    <b>DIES IN:</b>
                    <div><small>(after dehydration)</small></div>
                    <div class="surface-stylized inner-padding">${getTimeDisplay(deathTime, "DEAD")}</div>
                </div>
            `;

        content.innerHTML = `
                <div class="inner-padding b-radius-10 m surface-stylized">
                    ${innerContent}
                </div>
            `;

        list.appendChild(content);
    },
    open_achievements_list: function (checkIfHasNewUnlocks) {
        const configureAchievement = (
            id,
            name,
            description,
            condition,
            rewardFn,
        ) => {
            const unlockEventName = `unlocked_${id}_achievement`;
            const unlockEventState = App.getEvent(unlockEventName);

            let badge = App.getBadge("★", "gray");
            if (!unlockEventState) {
                badge = App.getBadge("★");
            }

            const btn = {
                name: condition
                    ? `<small>${name}</small>${badge}`
                    : `<small><i class="fa-solid fa-lock"></i> ${name}</small>`,
                _disable: !condition,
                isNewlyUnlocked: condition && !unlockEventState,
                onclick: () => {
                    if (!condition) return true;
                    App.displayConfirm(
                        `<b>${name}</b> <br><br> ${description}`,
                        [
                            {
                                name: unlockEventState
                                    ? "reward collected"
                                    : "collect reward",
                                class: unlockEventState && "disabled",
                                onclick: () => {
                                    App.sendAnalytics(
                                        "achievement_reward_collect",
                                        name,
                                    );
                                    App.addEvent(unlockEventName);
                                    // do this to remove the badge from achievements
                                    // button in stats menu
                                    App.closeAllDisplays();
                                    UI.lastClickedButton = null;
                                    App.handlers.open_stats_menu();
                                    App.handlers.open_achievements_list();

                                    if (rewardFn) rewardFn();
                                },
                            },
                            {
                                name: "close",
                                class: "back-btn",
                                onclick: () => {
                                    App.handlers.open_achievements_list();
                                },
                            },
                        ],
                    );
                    return false;
                },
            };

            return btn;
        };

        const list = Object.keys(App.definitions.achievements)
            .map((id) => {
                const { name, description, checkProgress, getReward } =
                    App.definitions.achievements[id];
                return configureAchievement(
                    id,
                    name,
                    description,
                    checkProgress(),
                    getReward,
                );
            })
            .sort((a, b) =>
                a._disable == b._disable ? 0 : a._disable ? 1 : -1,
            )
            .sort((a, b) =>
                a.isNewlyUnlocked == b.isNewlyUnlocked
                    ? 0
                    : a.isNewlyUnlocked
                      ? -1
                      : 1,
            );

        if (checkIfHasNewUnlocks) {
            return list.some((a) => a.isNewlyUnlocked);
        }

        return App.displayList(list, null, "Achievements");
    },
    open_item_list: function (buyMode, activeIndex, customPayload) {
        let list = [];
        let sliderInstance;
        let salesDay = App.isSalesDay();
        for (let item of Object.keys(App.definitions.item)) {
            // check if current pet has this item on its inventory
            if (!App.pet.inventory.item[item] && !buyMode) {
                continue;
            }
            let current = App.definitions.item[item];

            // 50% off on sales day
            let price = current.price;
            if (salesDay) price = Math.round(price / 2);

            const iconElement = App.getItemCSprite(current.sprite);

            list.push({
                isNew: !!current.isNew,
                shortName: `<div class="icon">${iconElement}</div> <span class="ellipsis">${item.toUpperCase()}</span>`,
                name: `
                        ${iconElement}
                        ${item.toUpperCase()} (x${App.pet.inventory.item[item] || 0})
                        <b>${buyMode ? `$${price}` : ""}</b>
                        ${current.isNew ? App.getBadge("new!") : ""}
                    `,
                onclick: (btn, list) => {
                    if (buyMode) {
                        if (!App.pay(price)) return true;
                        App.temp.purchasedMallItem = true;
                        App.addNumToObject(App.pet.inventory.item, item, 1);
                        App.handlers.open_item_list(
                            true,
                            sliderInstance?.getCurrentIndex(),
                        );
                        return false;
                    }

                    if (customPayload) {
                        return customPayload({ ...current, name: item });
                    }

                    if (
                        "age" in current &&
                        !current.age?.includes(App.petDefinition.lifeStage)
                    ) {
                        return App.displayPopup(
                            `This item is not appropriate for ${App.petDefinition.name}'s age!`,
                        );
                    }
                    Activities.useItem({ ...current, name: item });
                },
            });
        }

        if (!list.length) {
            App.displayPopup(
                `You don't have any items, purchase some from the mall`,
                2000,
            );
            return;
        }

        list = list.sort((a, b) => b.isNew - a.isNew);
        sliderInstance = App.displaySlider(
            list,
            activeIndex,
            { accept: buyMode ? "Purchase" : "Use" },
            buyMode
                ? `$${App.pet.stats.gold + (salesDay ? ` <span class="sales-notice">DISCOUNT DAY!</span>` : "")}`
                : null,
        );
        return sliderInstance;
        return App.displayList(list);
    },
    open_craftables_list: function () {
        let sliderInstance;
        const {
            room_background: roomBackgroundDefs,
            accessories: accessoryDefs,
        } = App.definitions;

        const removeOneHarvestFromInventory = (name) => {
            if (App.pet.inventory.harvests[name] > 0)
                App.pet.inventory.harvests[name] -= 1;
        };

        const getCraftableUIDef = (current, type, owned) => ({
            current,
            isNew: !!current.isNew,
            shortName: `<span class="ellipsis">${current.name.toUpperCase()}</span>`,
            name: `
                    ${
                        current.icon ??
                        `<img style="
                            width: min-content;
                            align-self: center;
                        " src="${App.checkResourceOverride(current.image)}"></img>`
                    }
                    ${current.name.toUpperCase()}
                    <small>${type}</small>
                    <b class="flex-center flex-dir-row">
                    ${
                        owned
                            ? "OWNED"
                            : App.getHarvestIcons(
                                  current.craftingRecipe,
                                  undefined,
                                  "opacity-half",
                              )
                    }
                    </b>
                    ${current.isNew ? App.getBadge("new!") : ""}
                `,
            onclick: () => {
                if (owned)
                    return App.displayPopup(
                        `You already own the this ${type}!`,
                    );

                const hasAllIngredients = current.craftingRecipe.every(
                    (ingredientName) =>
                        App.pet.inventory.harvests[ingredientName],
                );
                if (!hasAllIngredients)
                    return App.displayPopup(
                        `You cannot craft this ${type} due to missing ingredients`,
                    );

                current.craftingRecipe.forEach((ingredient) =>
                    removeOneHarvestFromInventory(ingredient),
                );

                App.displayPopup(`Crafted x1 <b>${current.name}</b>!`);

                switch (type) {
                    case "room":
                        App.closeAllDisplays();
                        Activities.redecorRoom();
                        App.scene.home.image = App.checkResourceOverride(
                            current.image,
                        );
                        break;
                    case "furniture":
                        App.ownedFurniture.push({
                            id: current.id,
                            x: "50%",
                            y: "50%",
                            isActive: false,
                        });
                        break;
                    case "accessory":
                        App.pet.inventory.accessory[current.name] = true;
                        break;
                }

                App.sendAnalytics("craft", current.name);
                App.pet.stats.current_expression += 2;
                App.pet.stats.current_logic += 3;
            },
        });

        // room backgrounds
        const rooms = Object.keys(roomBackgroundDefs)
            .map((roomName) => ({
                ...roomBackgroundDefs[roomName],
                image: App.getFurnishableBackground(
                    roomBackgroundDefs[roomName].image,
                ),
                name: roomName,
            }))
            .filter((room) => room.isCraftable)
            .map((current) =>
                getCraftableUIDef(
                    current,
                    "room",
                    current.image === App.scene.home.image,
                ),
            );

        // furniture
        const furniture = App.definitions.furniture
            .filter((item) => item.isCraftable)
            .map((current) =>
                getCraftableUIDef(
                    current,
                    "furniture",
                    !!App.ownedFurniture.find((f) => f.id === current.id),
                ),
            );

        // accessories
        const accessories = Object.keys(accessoryDefs)
            .map((name) => ({ ...accessoryDefs[name], name }))
            .filter((current) => current.isCraftable)
            .map((current) =>
                getCraftableUIDef(
                    { ...current, icon: App.getAccessoryCSprite(current.name) },
                    "accessory",
                ),
            );

        const list = [...rooms, ...furniture, ...accessories].sort(
            (a, b) => b.isNew - a.isNew,
        );

        if (App.isTester()) {
            const ingredientUsageMap = {};
            Object.keys(App.definitions.plant).forEach((ing) => {
                if (App.definitions.plant[ing].inedible)
                    App.addNumToObject(ingredientUsageMap, ing, 0);
            });
            list.forEach((item) => {
                item.current.craftingRecipe.forEach((ing) =>
                    App.addNumToObject(ingredientUsageMap, ing, 1),
                );
            });
            console.log({ ingredientUsageMap });
        }

        sliderInstance = App.displaySlider(list, null, { accept: "Craft" });
        return sliderInstance;
    },
    open_room_background_list: function (onlyFurnishables, filterFn) {
        let list = [];
        let sliderInstance;
        let salesDay = App.isSalesDay();
        for (let room of Object.keys(App.definitions.room_background)) {
            const absCurrent = App.definitions.room_background[room];

            if (filterFn && !filterFn(absCurrent)) continue;
            else if (!filterFn && absCurrent.isCraftable) continue;

            let current = onlyFurnishables
                ? {
                      ...absCurrent,
                      image: App.getFurnishableBackground(absCurrent.image),
                  }
                : absCurrent;

            // check for unlockables
            if (current.unlockKey && !App.getRecord(current.unlockKey)) {
                continue;
            }

            // check for condition
            if (current.condition && !current.condition()) {
                continue;
            }

            // 50% off on sales day
            let price = current.price;
            if (onlyFurnishables) price /= 1.5;
            if (salesDay) price = price / 2;
            price = Math.round(price);

            // room type
            const roomType = current.type ?? "home";
            const scene = App.scene[roomType];
            if (!scene)
                return console.error("Invalid scene:", { roomType, scene });

            const defaultTypeImage = scene.image || App.scene.home.image;

            const icon = current.icon || current.image;

            list.push({
                isNew: !!current.isNew,
                shortName: `<span class="ellipsis">${room.toUpperCase()}</span>`,
                name: `<img style="min-height: 64px" src="${App.checkResourceOverride(icon)}"></img> ${room.toUpperCase()} <b>$${price}</b> ${current.isNew ? App.getBadge("new!") : ""}`,
                onclick: (btn, list) => {
                    if (current.image === defaultTypeImage) {
                        App.displayPopup("You already own this room");
                        return true;
                    }

                    if (!App.pay(price)) return true;

                    App.closeAllDisplays();
                    Activities.redecorRoom();
                    App.setScene(scene, true);
                    scene.image = current.image;

                    App.sendAnalytics("home_background_change", scene.image);

                    return false;
                },
            });
        }

        list = list.sort((a, b) => b.isNew - a.isNew);
        sliderInstance = App.displaySlider(
            list,
            null,
            { accept: "Purchase" },
            `$${App.pet.stats.gold + (salesDay ? ` <span class="sales-notice">DISCOUNT DAY!</span>` : "")}`,
        );
        return sliderInstance;
    },
    open_shell_background_list: function () {
        let sliderInstance;
        const list = App.definitions.shell_background
            .filter(
                (current) =>
                    !(current.unlockKey && !App.getRecord(current.unlockKey)),
            )
            .sort((a, b) => b.isNew - a.isNew)
            .map((current) => {
                return {
                    name: `<img src="${current.image}"></img>${current.isNew ? App.getBadge("new!") : ""}`,
                    onclick: (btn, list) => {
                        App.setShellBackground(current.image);
                        return true;
                    },
                };
            });

        sliderInstance = App.displaySlider(list, null, { accept: "Set" });
        return sliderInstance;
    },
    open_background_pattern_list: function () {
        let sliderInstance;
        const list = App.definitions.background_pattern
            .filter(
                (current) =>
                    !(current.unlockKey && !App.getRecord(current.unlockKey)),
            )
            .sort((a, b) => b.isNew - a.isNew)
            .map((current) => {
                return {
                    name: `
                        <img style="box-shadow: inset 0 0 0 100vw #0000009e;" src="${App.checkResourceOverride(current.image)}"></img>
                        ${current.isNew ? App.getBadge("new!") : ""}
                        <div>
                            ${current.name}
                        </div>
                    `,
                    onclick: () => {
                        if (App.settings.backgroundPattern === current.image)
                            App.settings.backgroundPattern = false;
                        else App.settings.backgroundPattern = current.image;
                        App.applySettings();
                        App.save();
                        return true;
                    },
                };
            });

        sliderInstance = App.displaySlider(list, null, { accept: "Toggle" });
        return sliderInstance;
    },
    open_decoration_overlay_list: function () {
        let sliderInstance;
        const list = Object.keys(App.definitions.decoration_overlay)
            .map((key) => ({ ...App.definitions.decoration_overlay[key], key }))
            .sort((a, b) => b.isNew - a.isNew)
            .map((current) => {
                return {
                    name: `
                        <img style="box-shadow: inset 0 0 0 100vw #0000009e;" src="${App.checkResourceOverride(current.assets[0])}"></img>
                        ${current.isNew ? App.getBadge("new!") : ""}
                        <div>
                            ${current.name}
                        </div>
                    `,
                    onclick: () => {
                        if (App.settings.decorationOverlay === current.key)
                            App.settings.decorationOverlay = false;
                        else App.settings.decorationOverlay = current.key;
                        App.initDecorationOverlay();
                        App.save();
                        return true;
                    },
                };
            });

        sliderInstance = App.displaySlider(list, null, { accept: "Toggle" });
        return sliderInstance;
    },
    open_accessory_list: function (props = {}) {
        const {
            buyMode,
            activeIndex,
            accessShop,
            onClose,
            useMode,
            useModeLabel = "Use",
        } = props;

        let list = [];
        let sliderInstance;
        let salesDay = App.isSalesDay();
        for (let accessoryName of Object.keys(App.definitions.accessories)) {
            // check if current pet has this item in its inventory
            if (!App.pet.inventory.accessory[accessoryName] && !buyMode) {
                continue;
            }
            let current = App.definitions.accessories[accessoryName];

            if (buyMode && (current.isCraftable || current.price === -1))
                continue;
            if (buyMode && accessShop !== current.accessShop) continue;

            // check for unlockables
            if (current.unlockKey && !App.getRecord(current.unlockKey)) {
                continue;
            }

            // 50% off on sales day
            let price = current.price;
            if (salesDay) price = Math.round(price / 2);

            const equipped =
                App.petDefinition.accessories.includes(accessoryName);
            const owned = App.pet.inventory.accessory[accessoryName];

            const reopen = (buyMode) => {
                if (!buyMode) App.handlers.open_stuff_menu();
                App.handlers.open_accessory_list({
                    ...props,
                    activeIndex: sliderInstance?.getCurrentIndex(),
                });
                return false;
            };

            const accessoryIcon = App.getAccessoryCSprite(accessoryName);

            list.push({
                isNew: !!current.isNew,
                shortName: `<span class="ellipsis">${accessoryName.toUpperCase()}</span>`,
                name: `
                        ${accessoryIcon}
                        ${accessoryName.toUpperCase()}
                        <b>
                        ${
                            buyMode
                                ? owned
                                    ? "OWNED"
                                    : `$${price}`
                                : equipped
                                  ? "EQUIPPED"
                                  : "NOT EQUIPPED"
                        }
                        </b>
                        ${current.isNew ? App.getBadge("new!") : ""}
                    `,
                onclick: (btn, list) => {
                    if (buyMode) {
                        if (App.pet.inventory.accessory[accessoryName]) {
                            App.displayPopup("You already own this accessory");
                            return true;
                        }
                        if (!App.pay(price)) return true;
                        App.temp.purchasedMallItem = true;
                        App.pet.inventory.accessory[accessoryName] = true;
                        return reopen(buyMode);
                    }

                    if (useMode) {
                        const useResult = useMode({
                            ...current,
                            name: accessoryName,
                            equipped,
                        });
                        if (useResult) {
                            App.pet.inventory.accessory[accessoryName] = false;
                        }
                        return;
                    }

                    // toggle equip mode
                    if (equipped)
                        App.petDefinition.accessories.splice(
                            App.petDefinition.accessories.indexOf(
                                accessoryName,
                            ),
                            1,
                        );
                    else App.petDefinition.accessories.push(accessoryName);
                    Activities.getDressed(
                        () => App.pet.equipAccessories(),
                        reopen,
                        !equipped,
                    );
                    App.sendAnalytics(
                        "accessory",
                        `${accessoryName} (${!equipped})`,
                    );
                },
            });
        }

        if (!list.length) {
            App.displayPopup(
                `You don't have any accessories, purchase some from the mall`,
                2000,
            );
            return;
        }

        const getButtonLabel = () => {
            if (useMode) return useModeLabel;
            if (buyMode) return "Purchase";
            return "Toggle";
        };

        list = list.sort((a, b) => b.isNew - a.isNew);
        sliderInstance = App.displaySlider(
            list,
            activeIndex,
            {
                accept: getButtonLabel(),
            },
            buyMode
                ? `$${App.pet.stats.gold + (salesDay ? ` <span class="sales-notice">DISCOUNT DAY!</span>` : "")}`
                : null,
        );
        return sliderInstance;
    },
    open_furniture_list: function (activeIndex) {
        let list = [];
        let sliderInstance;
        let salesDay = App.isSalesDay();

        App.definitions.furniture.forEach((current) => {
            // // check for unlockables
            // if(current.unlockKey && !App.getRecord(current.unlockKey)){
            //     continue;
            // }

            if (current.isCraftable) return;

            // 50% off on sales day
            let price = current.price ?? 1;
            if (salesDay) price = Math.round(price / 2);
            const owned = !!App.ownedFurniture.find((f) => f.id === current.id);

            const reopen = () => {
                App.handlers.open_furniture_list(
                    sliderInstance?.getCurrentIndex(),
                );
                return false;
            };

            const image = App.checkResourceOverride(current.image);
            const name = `
                <img style="min-height: 64px; object-fit: contain;" src="${image}"></img>
                ${current.name.toUpperCase()}
                <b>
                ${owned ? "OWNED" : `$${price}`}
                </b>
                ${current.isNew ? App.getBadge("new!") : ""}
                `;

            list.push({
                isNew: !!current.isNew,
                shortName: `<span class="ellipsis">${current.name.toUpperCase()}</span>`,
                name,
                onclick: (btn, list) => {
                    if (owned)
                        return App.displayPopup(
                            `You already own the this furniture!`,
                        );

                    if (!App.pay(price)) return true;
                    App.temp.purchasedMallItem = true;

                    App.ownedFurniture.push({
                        id: current.id,
                        x: "50%",
                        y: "50%",
                        isActive: false,
                    });

                    return reopen();
                },
            });
        });

        list = list.sort((a, b) => b.isNew - a.isNew);
        sliderInstance = App.displaySlider(
            list,
            activeIndex,
            { accept: "Purchase" },
            `$${App.pet.stats.gold + (salesDay ? ` <span class="sales-notice">DISCOUNT DAY!</span>` : "")}`,
        );
        return sliderInstance;
    },
    open_active_furniture_list: function () {
        const list = [
            ...App.activeFurnitureObjects.map((savedFurniture) => {
                const furnitureDef = App.getFurnitureDefFromId(
                    savedFurniture.def.id,
                );
                const persona = App.getPersona(
                    furnitureDef.name,
                    furnitureDef.image,
                );
                return {
                    name: persona,
                    onclick: () => {
                        return App.displayList([
                            {
                                name: `<div class="flex flex-center height-auto">${persona}</div>`,
                                type: "text",
                            },
                            {
                                name: "edit position",
                                onclick: () => {
                                    App.closeAllDisplays();
                                    App.editFurniture(savedFurniture, () => {
                                        App.handlers.open_active_furniture_list();
                                    });
                                },
                            },
                            {
                                name: "remove",
                                class: "back-btn",
                                onclick: () => {
                                    return App.displayConfirm(
                                        `Are you sure you want to remove this furniture from the room?`,
                                        [
                                            {
                                                name: "yes",
                                                onclick: () => {
                                                    savedFurniture.def.isActive = false;
                                                    App.handleFurnitureSpawn();
                                                    App.closeAllDisplays();
                                                    App.handlers.open_active_furniture_list();
                                                },
                                            },
                                            {
                                                name: "no",
                                                class: "back-btn",
                                                onclick: () => {},
                                            },
                                        ],
                                    );
                                },
                            },
                        ]);
                    },
                };
            }),
        ];

        const occupiedLength = list.length;
        for (
            let i = 0;
            i < App.constants.MAX_PLACED_FURNITURE - occupiedLength;
            i++
        ) {
            list.push({
                name: '<div class="width-full flex-center"> + </div>',
                onclick: () => {
                    // add furniture
                    const list = App.ownedFurniture
                        ?.filter((f) => !f.isActive)
                        .slice()
                        .reverse()
                        .map((furniture) => {
                            const def = App.getFurnitureDefFromId(furniture.id);
                            return {
                                _ignore: !def,
                                name: App.getPersona(def?.name, def?.image),
                                onclick: () => {
                                    furniture.isActive = true;
                                    App.closeAllDisplays();
                                    const furnitureObjects =
                                        App.handleFurnitureSpawn();
                                    const currentObject = furnitureObjects.find(
                                        (f) => f.def.id === def.id,
                                    );
                                    App.editFurniture(
                                        currentObject,
                                        (state) => {
                                            if (!state) {
                                                furniture.isActive = false;
                                            }
                                            App.handleFurnitureSpawn();
                                            App.handlers.open_active_furniture_list();
                                        },
                                    );
                                },
                            };
                        });

                    if (!App.ownedFurniture?.length || !list.length) {
                        return App.displayPopup(
                            "You don't own any furniture, purchase some from the mall",
                        );
                    }

                    return App.displayList(list, null, "Add furniture");
                },
            });
        }

        return App.displayList([...list]);
    },
    getOutsideActivityId: function (id = "default") {
        const tempId = `_outsideActivity_${id}`;
        return tempId;
    },
    open_activity_list: function (noIndexReset) {
        if (!noIndexReset) App.temp[App.handlers.getOutsideActivityId()] = 1;

        return Activities.goToActivities({
            activities: [...App.definitions.outside_activities],
            decorators: ({
                parent,
                currentActivityIndex,
                activitiesLength,
            }) => {
                new Object2d({
                    img: "resources/img/background/outside/activities_decor_01.png",
                    x: 0,
                    y: 0,
                    localZ: -2,
                    parent,
                    isRelative: true,
                });
                Prefab.treeBunch({
                    seed: (currentActivityIndex % activitiesLength) * 6943,
                    parent,
                });
                for (let i = 0; i < 2; i++) {
                    new Object2d({
                        img: "resources/img/misc/bush_01.png",
                        x: i == 0 ? "0%" : "100%",
                        y: pRandom.getIntBetween(45, 55),
                        width: 27,
                        localZ: -0.5,
                        parent,
                        isRelative: true,
                    });
                }
            },
        });
    },
    open_devil_town_activity_list: function (noIndexReset) {
        const id = "devilTown";

        if (!noIndexReset) App.temp[App.handlers.getOutsideActivityId(id)] = 1;

        return Activities.goToActivities({
            activities: [
                {
                    name: "Overworld Entrance",
                    image: "resources/img/misc/activity_building_devil_home.png",
                    onEnter: () => App.handlers.open_underworld_menu(),
                    isHome: true,
                },
                // {
                //     name: "Restaurant",
                //     image: 'resources/img/misc/activity_building_devil_restaurant.png',
                //     onEnter: () => App.handlers.go_to_home(),
                //     isHome: true,
                // },
                {
                    name: "Gathering",
                    image: "resources/img/misc/activity_building_devil_gathering.png",
                    onEnter: () => Activities.goToDevilTownGathering(),
                    isHome: true,
                },
                {
                    name: "Clothing Store",
                    image: "resources/img/misc/activity_building_devil_clothing_store.png",
                    onEnter: () => {
                        App.handlers.open_accessory_list({
                            buyMode: true,
                            accessShop: "devilsTown",
                        });
                        return true;
                    },
                    skipUnloading: true,
                },
            ],
            floorImage: "resources/img/misc/devil_walkway_02.png",
            scene: App.scene.devil_town_exterior,
            id,
        });
    },
    open_underworld_menu: function () {
        const CURRENCY_NAME = App.constants.UNDERWORLD_TREAT_CURRENCY;
        const CURRENCY_ICON = App.getFoodCSprite(
            App.definitions.food[CURRENCY_NAME]?.sprite,
        );

        const TICKETS_PRICE = 50,
            POTION_PRICE = 200;

        const backFn = () => {
            App.handlers.open_activity_list(true);
        };

        const payWithCustomCurrency = (amt) => {
            const currentAmount = App.pet.inventory.food[CURRENCY_NAME] || 0;
            if (amt > currentAmount) {
                App.displayPopup(`Don't have enough ${CURRENCY_NAME}!`);
                return false;
            }
            App.addNumToObject(App.pet.inventory.food, CURRENCY_NAME, -amt);
            return true;
        };
        const openPurchasableList = (activeIndex) => {
            let sliderInstance;
            const candyAmount = App.pet.inventory.food[CURRENCY_NAME] || 0;

            const foodNames = [
                "life essence",
                "potion of aging up",
                "potion of fulfillment",
                "potion of misbehaving",
                "potion of well behaving",
                "potion of neglect",
                "expression skill potion",
                "logic skill potion",
                "endurance skill potion",
            ];
            const miscItems = [
                {
                    name: "underworld tickets",
                    icon: App.getGenericCSprite(
                        1,
                        App.constants.MISC_SPRITESHEET,
                        App.constants.MISC_SPRITESHEET_DIMENSIONS,
                    ),
                    price: TICKETS_PRICE,
                    ownedAmount: App.pet.inventory.misc["underworld tickets"],
                    onclick: () => {
                        if (payWithCustomCurrency(TICKETS_PRICE)) {
                            App.addNumToObject(
                                App.pet.inventory.misc,
                                "underworld tickets",
                                3,
                            );
                            openPurchasableList(
                                sliderInstance?.getCurrentIndex(),
                            );
                            return false;
                        }
                        return true;
                    },
                },
            ];
            const itemDefs = [
                ...miscItems,
                ...foodNames.map((name) => {
                    const item = App.definitions.food[name];
                    return {
                        ...item,
                        name,
                        icon: App.getFoodCSprite(item.sprite),
                        price: POTION_PRICE,
                        ownedAmount: App.pet.inventory.food[name],
                        onclick: () => {
                            if (payWithCustomCurrency(POTION_PRICE)) {
                                App.addNumToObject(
                                    App.pet.inventory.food,
                                    name,
                                    1,
                                );
                                openPurchasableList(
                                    sliderInstance?.getCurrentIndex(),
                                );
                                return false;
                            }
                            return true;
                        },
                    };
                }),
            ];
            const allItems = [...itemDefs].map((current) => {
                return {
                    ...current,
                    shortName: `<div class="icon">${current.icon}</div> <span class="ellipsis">${current.name?.toUpperCase()}</span>`,
                    name: `
                            ${current.icon}
                            ${current.name?.toUpperCase()}
                            (x${current.ownedAmount || 0})
                            <b class="flex align-center flex-gap-025 justify-center">
                                ${CURRENCY_ICON} <span>X${current.price || 0}</span>
                            </b>
                            ${current.isNew ? App.getBadge("new!") : ""}
                        `,
                };
            });

            sliderInstance = App.displaySlider(
                allItems,
                activeIndex,
                {
                    accept: "Purchase",
                },
                `
                        <div class="flex align-center flex-gap-025">
                            ${CURRENCY_ICON} x${candyAmount}
                        </div>
                    `,
            );

            return sliderInstance;
        };

        return App.displayList(
            [
                {
                    name: `Enter Underworld`,
                    onclick: () => {
                        const ownedTickets =
                            App.pet.inventory.misc["underworld tickets"] || 0;
                        const ticketIcon = App.getGenericCSprite(
                            1,
                            App.constants.MISC_SPRITESHEET,
                            App.constants.MISC_SPRITESHEET_DIMENSIONS,
                        );
                        const ticketSpan = `<div class="flex align-center justify-center flex-gap-1 bold">${ticketIcon} Ticket</div>`;
                        if (!ownedTickets) {
                            return App.displayConfirm(
                                `
                                You don't have a
                                ${ticketSpan}
                                purchase some from the shop using
                                <div class="flex align-center justify-center flex-gap-1 bold">${CURRENCY_ICON} ${CURRENCY_NAME}</div>
                                `,
                                [
                                    {
                                        name: "open shop",
                                        onclick: () => {
                                            openPurchasableList();
                                        },
                                    },
                                    {
                                        name: "close",
                                        class: "back-btn",
                                        onclick: () => {},
                                    },
                                ],
                            );
                        }

                        return App.displayConfirm(
                            `Do you want to enter the Underworld? This will cost you x1 ${ticketSpan}`,
                            [
                                {
                                    name: "yes",
                                    onclick: () => {
                                        App.closeAllDisplays();
                                        App.addNumToObject(
                                            App.pet.inventory.misc,
                                            "underworld tickets",
                                            -1,
                                        );
                                        App.handlers.open_devil_town_activity_list();
                                        App.sendAnalytics("enter_underworld");
                                    },
                                },
                                {
                                    name: "no",
                                    class: "back-btn",
                                    onclick: () => {},
                                },
                            ],
                        );
                    },
                },
                {
                    name: `Trick or Treat ${App.getBadge(CURRENCY_ICON, "transparent")}`,
                    onclick: () => {
                        return App.displayPopup(
                            `Double jump to get all <br> ${CURRENCY_ICON} <br> while avoiding <br> <img src="resources/img/misc/bat_01.png"></img>`,
                            false,
                            () =>
                                Activities.trickOrTreatGame(
                                    App.handlers.open_underworld_menu,
                                ),
                        );
                    },
                },
                {
                    name: "Shop",
                    onclick: openPurchasableList,
                },
            ],
            backFn,
        );
    },
    open_rabbitholes_list: function () {
        if (!App.temp.rabbitholeTraveledFriends)
            App.temp.rabbitholeTraveledFriends = [];

        const backFn = () => {
            App.handlers.open_activity_list(true);
        };
        return App.displayList(
            [
                ...App.definitions.rabbit_hole_activities
                    .sort((a, b) => b.isNew || 0 - a.isNew || 0)
                    .filter((hole) => !hole.type)
                    .map((hole) => ({
                        name: `
                            <span class="ellipsis">${hole.name}<span>
                            ${App.getBadge(`${hole.isNew ? "New!" : ""} <span> <i class="fa-solid fa-clock fa-xs"></i> ${Math.ceil(hole.duration / 1000 / 60)}</span>`, hole.isNew ? false : "neutral")}
                        `,
                        onclick: () => {
                            const confirmFn = (otherPet) => {
                                App.displayConfirm(
                                    `Are you sure you want to <b>${hole.name}</b>${otherPet ? ` with <i>${otherPet.name}</i>` : ""}? <br><br> ${App.petDefinition.name} will go out for <b>${moment(hole.duration + Date.now()).toNow(true)}</b>`,
                                    [
                                        {
                                            name: "yes",
                                            onclick: () => {
                                                App.pet.stats.current_rabbit_hole =
                                                    {
                                                        name: hole.name,
                                                        endTime:
                                                            Date.now() +
                                                            hole.duration,
                                                    };
                                                Activities.goToHomePlanet(
                                                    otherPet,
                                                );
                                                App.save();
                                                App.closeAllDisplays();
                                                App.sendAnalytics(
                                                    "rabbit_hole",
                                                    hole.name,
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
                            };

                            const dialog = App.displayList(
                                [
                                    {
                                        name: `
                                        ${hole.name} ${hole.isNew ? App.getBadge("new!") : ""}
                                        <i>for about ${moment.duration(hole.duration).humanize()}</i>
                                    `,
                                        icon: "lemon",
                                        type: "info",
                                    },
                                    {
                                        _ignore: hole.noAlone,
                                        name: "Alone",
                                        onclick: () => {
                                            confirmFn();
                                            return true;
                                        },
                                    },
                                    {
                                        name: `With a friend`,
                                        onclick: () => {
                                            App.handlers.open_friends_list(
                                                (selectedFriend) => {
                                                    confirmFn(selectedFriend);
                                                },
                                            );
                                            return true;
                                        },
                                    },
                                ],
                                undefined,
                                "Back",
                            );

                            // confirmFn();
                            return true;
                        },
                    })),
                {
                    type: "info",
                    name: `${App.petDefinition.name} will visit their home planet to do one of <i>Homeworld Getaway</i> activities`,
                },
            ],
            backFn,
        );
    },
    open_friends_list: function (
        onClickOverride,
        customFilter,
        additionalButtons = [],
    ) {
        const friends = customFilter
            ? App.petDefinition.friends.filter(customFilter)
            : App.petDefinition.friends;

        if (!friends.length && !additionalButtons.length) {
            App.displayPopup(
                `${App.petDefinition.name} doesn't have any friends right now<br><br><small>Visit the park to find new friends<small>`,
                4000,
            );
            return;
        }

        const monsterIcon = `<img class="icon" src="resources/img/misc/devil_icon.png"></img>`;
        const angelIcon = `<img class="icon" src="resources/img/misc/angel_icon.png"></img>`;
        const monsterSpan = App.constants.SPANS.monster;
        const angelSpan = App.constants.SPANS.angel;

        let friendsList;
        const mappedFriendsList = friends.map((friendDef, index) => {
            const name = friendDef.name || "Unknown";
            const icon = friendDef.getCSprite();

            const getInteractionSet = (set, condition) =>
                condition ? set : [];

            // angel and monster interactions
            const monsterInteractions = [
                {
                    name: `Scare`,
                    onclick: () => {
                        Activities.demon_scare(friendDef);
                        return true;
                    },
                },
                {
                    name: `Whisper`,
                    onclick: () => {
                        Activities.demon_whisper(friendDef);
                        return true;
                    },
                },
                {
                    name: `Place curse`,
                    onclick: () => {
                        if (
                            App.pet.stats.current_hunger <
                            App.pet.stats.max_hunger / 2
                        ) {
                            return App.displayPopup(
                                "You don't have enough energy to do this.",
                            );
                        }

                        App.displayConfirm(
                            `This will turn <b>${friendDef.name}</b> into a ${monsterSpan},</div> do you want to continue?`,
                            [
                                {
                                    name: "yes",
                                    onclick: () => {
                                        Activities.ghost_convertOtherPet(
                                            friendDef,
                                            PetDefinition.GHOST_TYPE.devil,
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
                        return true;
                    },
                },
            ].map((entry) => ({
                ...entry,
                name: `${monsterIcon} <span style="color: red;">${entry.name}</span>`,
            }));
            const angelInteractions = [
                {
                    name: `Bless`,
                    onclick: () => {
                        Activities.angel_bless(friendDef);
                        return true;
                    },
                },
                {
                    name: `Grant Wish`,
                    onclick: () => {
                        Activities.angel_grantWish(friendDef);
                        return true;
                    },
                },
                {
                    name: `Gift Divinity`,
                    onclick: () => {
                        if (
                            App.pet.stats.current_hunger <
                            App.pet.stats.max_hunger / 2
                        ) {
                            return App.displayPopup(
                                "You don't have enough energy to do this.",
                            );
                        }

                        App.displayConfirm(
                            `This will turn <b>${friendDef.name}</b> into an ${angelSpan},</div> do you want to continue?`,
                            [
                                {
                                    name: "yes",
                                    onclick: () => {
                                        Activities.ghost_convertOtherPet(
                                            friendDef,
                                            PetDefinition.GHOST_TYPE.angel,
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
                        return true;
                    },
                },
            ].map((entry) => ({
                ...entry,
                name: `${angelIcon} <span style="color: forestgreen;">${entry.name}</span>`,
            }));

            return {
                name: `${icon} <span class="ellipsis overflow-hidden">${name}</span>`,
                onclick: () => {
                    const isMonsterGhost =
                        friendDef.stats.is_ghost ===
                        PetDefinition.GHOST_TYPE.devil;
                    const isAngelGhost =
                        friendDef.stats.is_ghost ===
                        PetDefinition.GHOST_TYPE.angel;
                    if (onClickOverride) return onClickOverride(friendDef);
                    const friendActivitiesList = App.displayList([
                        {
                            name: "info",
                            onclick: () => {
                                const list = UI.genericListContainer();
                                UI.genericListContainerContent(
                                    `
                                        <div class="inner-padding uppercase surface-stylized b-radius-10 flex flex-dir-col flex-gap-2">
                                            <div class="flex flex-dir-col flex-gap-05">
                                                <div class="flex align-center">
                                                    ${icon}
                                                    <div class="flex flex-dir-col overflow-hidden">
                                                        <span class="ellipsis overflow-hidden">${friendDef.name}</span>
                                                        <small class="font-x-small">(${friendDef.getLifeStageLabel()})</small>
                                                    </div>
                                                </div>
                                                <small class="${!(isMonsterGhost || isAngelGhost) ? "hidden" : ""}">
                                                    ${isMonsterGhost ? monsterSpan : ""}
                                                    ${isAngelGhost ? angelSpan : ""}
                                                </small>
                                            </div>
                                            <div class="relative flex flex-dir-row align-center flex-gap-1 mt-6">
                                                <div class="stats-label">Friendship</div>
                                                <b class="outlined-icon flex flex-center" style="width: 18px;">${App.getIcon("smile", true)}</b>
                                                ${App.createProgressbar((friendDef.getFriendship() / 100) * 100).node.outerHTML}
                                            </div>
                                        </div>
                                    `,
                                    list,
                                );
                                return true;
                            },
                        },
                        {
                            _ignore:
                                !friendDef.stats.is_ghost ||
                                friendDef.stats.is_ghost ===
                                    App.pet.stats.is_ghost,
                            name: `${isMonsterGhost ? monsterIcon : angelIcon} <span style="color: ${isMonsterGhost ? "red" : "forestgreen"};">Be converted</span>`,
                            onclick: () => {
                                if (friendDef.stats.player_friendship <= 98) {
                                    return App.displayPopup(
                                        `
                                            You need to be best friends with
                                            <b>${friendDef.name}</b>
                                            before asking to be converted to
                                            <div>
                                                ${isMonsterGhost ? monsterSpan : angelSpan}
                                            </div>
                                        `,
                                        3500,
                                    );
                                }

                                return App.displayConfirm(
                                    `This will turn your pet into ${isMonsterGhost ? monsterSpan : angelSpan} are you sure you want to continue?`,
                                    [
                                        {
                                            name: "yes",
                                            onclick: () => {
                                                Activities.ghost_beConverted(
                                                    friendDef,
                                                    friendDef.stats.is_ghost,
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
                            },
                        },
                        ...getInteractionSet(
                            monsterInteractions,
                            App.pet.stats.is_ghost ===
                                PetDefinition.GHOST_TYPE.devil &&
                                friendDef.stats.is_ghost !==
                                    App.pet.stats.is_ghost,
                        ),
                        ...getInteractionSet(
                            angelInteractions,
                            App.pet.stats.is_ghost ===
                                PetDefinition.GHOST_TYPE.angel &&
                                friendDef.stats.is_ghost !==
                                    App.pet.stats.is_ghost,
                        ),
                        {
                            _ignore:
                                App.petDefinition.lifeStage <
                                    PetDefinition.LIFE_STAGE.adult ||
                                friendDef.lifeStage <
                                    PetDefinition.LIFE_STAGE.adult ||
                                friendDef.stats.is_player_family,
                            name: `go on date`,
                            onclick: () => {
                                if (
                                    friendDef.getFriendship() < 60 &&
                                    !App.petDefinition.hasTrait("romantic")
                                ) {
                                    return App.displayPopup(
                                        `${App.petDefinition.name}'s friendship with ${friendDef.name} is too low <br><br> they don't want to go on a date.`,
                                        5000,
                                    );
                                }

                                App.displayConfirm(
                                    `Do you want to go on a date with <div>${icon} ${friendDef.name}</div>?`,
                                    [
                                        {
                                            name: "yes",
                                            onclick: () => {
                                                Activities.goOnDate(friendDef);
                                            },
                                        },
                                        {
                                            name: "cancel",
                                            class: "back-btn",
                                            onclick: () => {},
                                        },
                                    ],
                                );

                                return true;
                            },
                        },
                        {
                            name: `Hang out`,
                            onclick: () => {
                                const handleHangout = (
                                    scene,
                                    isPlayerHost = false,
                                ) => {
                                    App.closeAllDisplays();

                                    Activities.talkingSequence({
                                        scene,
                                        otherPetDef: friendDef,
                                        isPlayerHost,
                                    });
                                };

                                const getFriendsHomeScene = (
                                    backgroundOverride,
                                ) => {
                                    if (backgroundOverride) {
                                        return new Scene({
                                            image: backgroundOverride,
                                        });
                                    }

                                    if (friendDef.stats.is_player_family) {
                                        return new Scene({
                                            image: App.scene.parentsHome.image,
                                        });
                                    }

                                    pRandom.save();
                                    pRandom.seed =
                                        parseInt(
                                            `${PetDefinition.getCharCode(friendDef.sprite)}${App.userId}`,
                                        ) * 320;
                                    const sceneBackground = pRandomFromArray(
                                        Object.keys(
                                            App.definitions.room_background,
                                        ).map(
                                            (roomName) =>
                                                App.definitions.room_background[
                                                    roomName
                                                ].image,
                                        ),
                                    );
                                    const scene = new Scene({
                                        image: sceneBackground,
                                    });
                                    pRandom.load();
                                    return scene;
                                };

                                return App.displayList([
                                    {
                                        type: "text",
                                        name: "Where to hang out?",
                                    },
                                    {
                                        name: `friend's home`,
                                        onclick: () =>
                                            handleHangout(
                                                getFriendsHomeScene(),
                                            ),
                                    },
                                    {
                                        name: `your home`,
                                        onclick: () =>
                                            handleHangout(App.scene.home, true),
                                    },
                                    {
                                        name: `the mall`,
                                        onclick: () =>
                                            handleHangout(
                                                getFriendsHomeScene(
                                                    App.scene.mallInterior
                                                        .image,
                                                ),
                                                Boolean(random(0, 1)),
                                            ),
                                    },
                                    {
                                        name: `the beach`,
                                        onclick: () =>
                                            handleHangout(
                                                getFriendsHomeScene(
                                                    App.scene.beach.image,
                                                ),
                                                Boolean(random(0, 1)),
                                            ),
                                    },
                                ]);
                            },
                        },
                        {
                            name: "invite",
                            onclick: () => {
                                App.closeAllDisplays();
                                Activities.invitePlaydate(friendDef);
                            },
                        },
                        {
                            _disable:
                                App.petDefinition.lifeStage <=
                                PetDefinition.LIFE_STAGE.baby,
                            name: "park",
                            onclick: () => {
                                App.closeAllDisplays();
                                Activities.goToPark(friendDef);
                            },
                        },
                        {
                            _disable:
                                App.petDefinition.lifeStage <=
                                PetDefinition.LIFE_STAGE.child,
                            name: `gift`,
                            onclick: () => {
                                const handleOpenFoodMenu = (type) => {
                                    return App.handlers.open_food_list({
                                        filterType: type,
                                        age: PetDefinition.LIFE_STAGE.adult,
                                        useMode: (item) => {
                                            friendDef.increaseFriendship(
                                                Math.floor(item.price / 2.7),
                                            );
                                            Activities.inviteGiveGift(
                                                friendDef,
                                            );
                                            return true;
                                        },
                                    });
                                };

                                return App.displayList([
                                    {
                                        name: "Items",
                                        onclick: () => {
                                            return App.handlers.open_item_list(
                                                null,
                                                null,
                                                (item) => {
                                                    App.pet.inventory.item[
                                                        item.name
                                                    ] -= 1;
                                                    friendDef.increaseFriendship(
                                                        Math.floor(
                                                            item.price / 2.7,
                                                        ),
                                                    );
                                                    Activities.inviteGiveGift(
                                                        friendDef,
                                                    );
                                                },
                                            );
                                        },
                                    },
                                    {
                                        name: `Accessories`,
                                        onclick: () => {
                                            return App.handlers.open_accessory_list(
                                                {
                                                    useMode: (item) => {
                                                        if (
                                                            friendDef.accessories?.includes(
                                                                item.name,
                                                            )
                                                        ) {
                                                            App.displayPopup(
                                                                `${name} already has this accessory!`,
                                                            );
                                                            return false;
                                                        }
                                                        if (item.equipped) {
                                                            App.displayPopup(
                                                                "You have to unequip this accessory to be able to gift it.",
                                                            );
                                                            return false;
                                                        }
                                                        friendDef.increaseFriendship(
                                                            Math.floor(
                                                                item.price /
                                                                    2.7,
                                                            ),
                                                        );
                                                        Activities.inviteGiveGift(
                                                            friendDef,
                                                        );
                                                        if (
                                                            friendDef
                                                                .accessories
                                                                ?.length >= 3
                                                        ) {
                                                            friendDef.accessories?.shift();
                                                        }
                                                        friendDef.accessories?.push(
                                                            item.name,
                                                        );
                                                        return true;
                                                    },
                                                },
                                            );
                                        },
                                    },
                                    {
                                        name: `Food`,
                                        onclick: () =>
                                            handleOpenFoodMenu("food"),
                                    },
                                    {
                                        name: `Snacks`,
                                        onclick: () =>
                                            handleOpenFoodMenu("treat"),
                                    },
                                ]);
                            },
                        },
                        {
                            name: "unfriend",
                            onclick: () => {
                                App.displayConfirm(
                                    `Are you sure you want to unfriend ${icon} ${name}?`,
                                    [
                                        {
                                            name: "yes",
                                            onclick: () => {
                                                friendsList.close();
                                                friendActivitiesList.close();
                                                App.petDefinition.friends.splice(
                                                    index,
                                                    1,
                                                );
                                                App.handlers.open_friends_list();
                                            },
                                        },
                                        {
                                            name: "no",
                                            class: "back-btn",
                                            onclick: () => {},
                                        },
                                    ],
                                );
                                return true;
                            },
                        },
                    ]);
                    return true;
                },
            };
        });

        friendsList = App.displayList([
            ...mappedFriendsList,
            ...additionalButtons,
        ]);
    },
    open_phone: function () {
        App.displayPhoneMenu(
            [
                {
                    _disable:
                        App.petDefinition.lifeStage <=
                            PetDefinition.LIFE_STAGE.baby || !navigator?.onLine,
                    name: "Hubchi",
                    icon: "globe",
                    onclick: () => {
                        if (
                            App.petDefinition.lifeStage <=
                            PetDefinition.LIFE_STAGE.baby
                        ) {
                            return App.displayPopup(
                                `${App.petDefinition.name} is not old enough to go to hubchi!`,
                            );
                        }

                        if (!App.userName) {
                            App.handlers.show_set_username_dialog();
                            return true;
                        }

                        if (App.pet.stats.current_sleep < 10) {
                            return App.displayPopup(
                                `${App.petDefinition.name} is too sleepy to go to HUBCHI!`,
                            );
                        }

                        return App.displayConfirm(`Enter Hubchi?`, [
                            {
                                name: "yes",
                                onclick: async () => {
                                    App.closeAllDisplays();
                                    Activities.onlineHubTransition(
                                        async (fadeOverlay) => {
                                            setTimeout(() =>
                                                App.playSound(
                                                    "resources/sounds/task_complete.ogg",
                                                    true,
                                                ),
                                            );
                                            const popup = App.displayPopup(
                                                "Connecting...",
                                                App.INF,
                                            );
                                            App.temp.online = {};
                                            App.temp.online.hasUploadedPetDef =
                                                await App.apiService.getPetDef();
                                            App.temp.online.randomPetDefs =
                                                await App.apiService.getRandomPetDefs(
                                                    7,
                                                );
                                            // App.temp.online = JSON.parse('{"hasUploadedPetDef":{"status":true,"data":"{\\"name\\":\\"Missiechu\\",\\"sprite\\":\\"resources/img/character/chara_248b.png\\",\\"accessories\\":[\\"mini band\\",\\"secretary\\"]}"},"randomPetDefs":{"status":true,"data":[{"name":"farah3","sprite":"resources/img/character/chara_51b.png","accessories":[],"owner":"test3","ownerId":"test3-1234","interactions":0},{"name":"sep2","sprite":"resources/img/character/chara_50b.png","accessories":[],"owner":"test2","ownerId":"test2-1234","interactions":2},{"name":"qoli4","sprite":"resources/img/character/chara_210b.png","accessories":["witch hat"],"owner":"test4","ownerId":"test4-1234","interactions":0},{"name":"<saman1>","sprite":"resources/img/character/chara_28b.png","accessories":[],"owner":"test","ownerId":"test-1234","interactions":0},{"name":"Missiechu","sprite":"resources/img/character/chara_248b.png","accessories":["mini band","secretary"],"owner":"samandev","ownerId":"samandev-3430186","interactions":3}]}}');
                                            popup.close();
                                            App.closeAllDisplays();
                                            fadeOverlay.direction = false;

                                            if (
                                                !App.temp.online?.randomPetDefs
                                            ) {
                                                App.displayPopup(
                                                    "Error! Cannot connect.",
                                                );
                                                App.setScene(App.scene.home);
                                                App.toggleGameplayControls(
                                                    true,
                                                );
                                                return false;
                                            }

                                            setTimeout(() =>
                                                App.playSound(
                                                    "resources/sounds/task_complete_02.ogg",
                                                    true,
                                                ),
                                            );
                                            Activities.goToOnlineHub();
                                        },
                                    );

                                    App.sendAnalytics("go_to_online_hub");
                                },
                            },
                            {
                                name: "no",
                                class: "back-btn",
                                onclick: () => {},
                            },
                        ]);
                    },
                },
                {
                    _disable:
                        App.petDefinition.lifeStage <=
                        PetDefinition.LIFE_STAGE.baby,
                    name: "Snapmeal",
                    icon: "burger",
                    onclick: () => {
                        let list = [
                            ...App.handlers.open_food_list({
                                buyMode: true,
                                getListOnly: true,
                                filterType: "food",
                                age: PetDefinition.LIFE_STAGE.adult,
                            }),
                            ...App.handlers.open_food_list({
                                buyMode: true,
                                getListOnly: true,
                                filterType: "treat",
                                age: PetDefinition.LIFE_STAGE.adult,
                            }),
                            ...App.handlers
                                .open_food_list({
                                    buyMode: true,
                                    getListOnly: true,
                                    filterType: "food",
                                    allowCookableOnly: true,
                                    age: PetDefinition.LIFE_STAGE.adult,
                                })
                                .filter((item) => item.current.cookableOnly),
                        ]
                            .filter((item) => item.disabled)
                            .map((food) => ({
                                current: {
                                    ...food.current,
                                    price: food.current.cookableOnly
                                        ? Math.floor(food.current.price * 10)
                                        : Math.floor(
                                              food.current.price *
                                                  App.constants
                                                      .ONLINE_FOOD_ORDER_MARKUP,
                                          ),
                                },
                                foodName: food.foodName,
                            }));

                        // make list length odd
                        if (list.length % 2 === 0) {
                            list = list.slice(0, -1);
                        }

                        if (!list.length) {
                            return App.displayPopup(
                                "Sorry but <b>Snapmeal</b> is out of operation today!<br> <small>Please comeback tomorrow!</small>",
                                5000,
                            );
                        }

                        const getOrders = () =>
                            list.filter((item) => item.current.orderAmount > 0);
                        const getTotalPrice = () =>
                            getOrders().reduce(
                                (acc, { current }) =>
                                    acc + current.price * current.orderAmount,
                                0,
                            );

                        const parentContainer = UI.genericListContainer();
                        const content = UI.create({
                            className: "flex-grid-2x",
                            parent: parentContainer,
                            children: [
                                ...list.map(({ current, foodName }) => ({
                                    _mount: (me) => {
                                        me.innerHTML = `
                                                <div class="pointer-events-none">
                                                    <div class="x2"> ${App.getFoodCSprite(current.sprite)} </div>
                                                    <div class="flex-grid-2x__content ${!current.orderAmount ? "opacity-half" : ""}">
                                                        <span>X</span>
                                                        <span id="order-amount">${current.orderAmount || 0}</span>
                                                    </div>
                                                    <div class="flex-grid-2x__title">
                                                        <small>
                                                            <i>$${current.price}</i>
                                                            ${current.cookableOnly ? "★" : ""}
                                                        </small>
                                                    </div>
                                                </div>
                                            `;
                                    },
                                    componentType: "button",
                                    className: "generic-btn stylized",
                                    onClick: (me) => {
                                        const newOrderAmount =
                                            ((current.orderAmount || 0) + 1) %
                                            4;
                                        current.orderAmount = newOrderAmount;
                                        me._mount();
                                        parentContainer
                                            .querySelector("#submit-order")
                                            ._mount();
                                    },
                                })),
                                {
                                    innerHTML: App.getIcon(
                                        "spinner fa-spin-pulse",
                                        true,
                                    ),
                                    _mount: (me) => {
                                        const totalPrice = getTotalPrice();
                                        me.disabled = !totalPrice;
                                        me.innerHTML = `
                                            <div class="x2">
                                                ${App.getIcon("basket-shopping", true)}
                                            </div>
                                            <div class="flex-grid-2x__content">
                                                $${totalPrice}
                                            </div>
                                        `;
                                        if (totalPrice) {
                                            me.innerHTML +=
                                                App.getBadge(`Order!`);
                                        }
                                    },
                                    componentType: "button",
                                    className:
                                        "generic-btn stylized primary solid",
                                    id: "submit-order",
                                    disabled: true,
                                    onClick: () => {
                                        const totalPrice = getTotalPrice();
                                        return App.displayConfirm(
                                            `Are you sure you want to place your order for <b>$${getTotalPrice()}</b>?`,
                                            [
                                                {
                                                    name: "Yes",
                                                    onclick: () => {
                                                        if (
                                                            !App.pay(totalPrice)
                                                        )
                                                            return false;
                                                        App.sendAnalytics(
                                                            "online_food_order",
                                                            totalPrice,
                                                        );
                                                        getOrders().forEach(
                                                            (order) => {
                                                                App.addNumToObject(
                                                                    App.pet
                                                                        .inventory
                                                                        .food,
                                                                    order.foodName,
                                                                    order
                                                                        .current
                                                                        .orderAmount,
                                                                );
                                                                Missions.done(
                                                                    Missions
                                                                        .TYPES
                                                                        .order_food,
                                                                );
                                                            },
                                                        );
                                                        App.displayPopup(
                                                            `${App.getIcon("check-circle", true)} <br> Thanks for ordering! <br> <small>Your order will arrive shortly!</small>`,
                                                            2500,
                                                            () => {
                                                                App.closeAllDisplays();
                                                                const onEnd =
                                                                    () => {
                                                                        App.displayConfirm(
                                                                            ...GenericUIDef.binaryConfirm(
                                                                                {
                                                                                    text: "Do you want to eat a delivered item right now?",
                                                                                    onAccept:
                                                                                        () => {
                                                                                            App.displayList(
                                                                                                getOrders().map(
                                                                                                    ({
                                                                                                        current,
                                                                                                        foodName,
                                                                                                    }) => ({
                                                                                                        name: `
                                                                                <div class="icon">${App.getFoodCSprite(current.sprite)}</div>
                                                                                <span class="ellipsis">${foodName}</span>
                                                                            `,
                                                                                                        onclick:
                                                                                                            () => {
                                                                                                                App.closeAllDisplays();
                                                                                                                App.pet.feed(
                                                                                                                    current.sprite,
                                                                                                                    current.hunger_replenish ??
                                                                                                                        0,
                                                                                                                    "food",
                                                                                                                    true,
                                                                                                                );
                                                                                                                App.addNumToObject(
                                                                                                                    App
                                                                                                                        .pet
                                                                                                                        .inventory
                                                                                                                        .food,
                                                                                                                    foodName,
                                                                                                                    -1,
                                                                                                                );
                                                                                                            },
                                                                                                    }),
                                                                                                ),
                                                                                                undefined,
                                                                                                "cancel",
                                                                                            );
                                                                                        },
                                                                                },
                                                                            ),
                                                                        );
                                                                    };
                                                                Activities.receiveOrderedFood(
                                                                    onEnd,
                                                                );
                                                            },
                                                        );
                                                    },
                                                },
                                                {
                                                    name: "No",
                                                    class: "back-btn",
                                                    onclick: () => {},
                                                },
                                            ],
                                        );
                                    },
                                },
                            ],
                        });

                        return true;
                    },
                },
                {
                    name: `friends`,
                    icon: "children",
                    isNew: false,
                    onclick: () => {
                        App.handlers.open_friends_list(null, null, [
                            {
                                name: `<i class="fa-solid fa-plus icon"></i> Add Friend`,
                                onclick: () =>
                                    App.handlers.open_hubchi_search(),
                            },
                        ]);
                        return true;
                    },
                },
                {
                    _ignore:
                        App.petDefinition.lifeStage >=
                        PetDefinition.LIFE_STAGE.elder,
                    name: "have bday",
                    icon: "cake",
                    onclick: () => {
                        let nextBirthday =
                            App.petDefinition.getNextBirthdayDate();
                        if (moment().isBefore(nextBirthday)) {
                            return App.displayPopup(
                                `${App.petDefinition.name} hasn't grown enough to age up<br><br>come back <b>${moment(nextBirthday).fromNow()}</b>`,
                                5000,
                            );
                        }
                        App.displayConfirm(
                            `This will age up ${App.petDefinition.name}<br>Are you sure?`,
                            [
                                {
                                    name: "yes",
                                    onclick: () => {
                                        Activities.birthday();
                                        App.sendAnalytics(
                                            "age_up",
                                            App.petDefinition.lifeStage,
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
                    },
                },
                {
                    _disable:
                        App.petDefinition.lifeStage <=
                        PetDefinition.LIFE_STAGE.child,
                    name: `social`,
                    icon: "users",
                    isNew: false,
                    onclick: () => {
                        App.handlers.open_social_media();
                        return true;
                    },
                },
                {
                    _disable:
                        App.petDefinition.lifeStage <=
                        PetDefinition.LIFE_STAGE.baby,
                    name: `vacation`,
                    icon: "umbrella-beach",
                    onclick: () => {
                        const price = 250;
                        const { goToVacation } = Activities;
                        App.displayConfirm(
                            `Are you sure you want to send ${App.petDefinition.name} on a vacation? <br> it will cost you $${price} and ${App.petDefinition.name} will stay there until you decide to end their vacation <hr> <b>while on vacation, ${App.petDefinition.name}'s needs will not drop</b>`,
                            [
                                {
                                    name: `yes ($${price})`,
                                    onclick: () => {
                                        const commitFn = () => {
                                            goToVacation(
                                                Activities.seaVacation,
                                            );
                                            App.sendAnalytics("go_on_vacation");
                                            App.definitions.achievements.go_to_vacation_x_times.advance();
                                            App.save();
                                        };

                                        if (!App.pay(price)) return;
                                        if (App.animals?.list?.length) {
                                            App.displayPopup(
                                                "Your animal(s) will be taken care of while you are away!",
                                                5000,
                                                commitFn,
                                            );
                                        } else commitFn();
                                    },
                                },
                                {
                                    name: "no",
                                    class: "primary solid",
                                    onclick: () => {},
                                },
                            ],
                        );
                        return true;
                    },
                },
                {
                    name:
                        App.petDefinition.lifeStage <=
                        PetDefinition.LIFE_STAGE.child
                            ? `abandon`
                            : `move out`,
                    icon: "suitcase-rolling",
                    onclick: () => {
                        const { moveOut } = Activities;
                        App.displayConfirm(
                            `Are you sure you want to send ${App.petDefinition.getAvatar()} back to their home planet? <br><br> They will move out and you'll receive a fresh new egg to raise.`,
                            [
                                {
                                    name: `yes`,
                                    onclick: () => {
                                        App.displayConfirm(`Are you sure?`, [
                                            {
                                                name: "yes, move out",
                                                onclick: () => {
                                                    moveOut(
                                                        App.petDefinition
                                                            .lifeStage <=
                                                            PetDefinition
                                                                .LIFE_STAGE
                                                                .child,
                                                    );
                                                    App.sendAnalytics(
                                                        "move_out",
                                                    );
                                                },
                                            },
                                            {
                                                name: "no",
                                                class: "back-btn",
                                                onclick: () => {},
                                            },
                                        ]);
                                    },
                                },
                                {
                                    name: "no",
                                    class: "back-btn",
                                    onclick: () => {},
                                },
                            ],
                        );
                        return true;
                    },
                },
                {
                    name: `friend codes`,
                    icon: "circle-nodes",
                    onclick: () => {
                        App.displayList([
                            {
                                name: "get code",
                                onclick: async () => {
                                    const loading = App.displayPopup(
                                        "Loading...",
                                        App.INF,
                                    );
                                    const pet =
                                        await window.idbKeyval.get("pet");
                                    loading.close();
                                    let charCode =
                                        "friend:" +
                                        btoa(
                                            encodeURIComponent(
                                                JSON.stringify({
                                                    user_id: App.userId,
                                                    pet,
                                                }),
                                            ),
                                        );
                                    navigator.clipboard.writeText(charCode);
                                    console.log(charCode);
                                    App.displayConfirm(
                                        `Your friend code has been copied to the clipboard!`,
                                        [
                                            {
                                                name: "next",
                                                onclick: () => {
                                                    App.displayConfirm(
                                                        `Send it to your friend and they'll be able to add ${App.petDefinition.name} as a friend using <b>Phone > Friend Codes > Input code</b>`,
                                                        [
                                                            {
                                                                name: "ok",
                                                                onclick:
                                                                    () => {},
                                                            },
                                                        ],
                                                    );
                                                },
                                            },
                                        ],
                                    );
                                    return true;
                                },
                            },
                            {
                                name: "input code",
                                onclick: () => {
                                    App.displayPrompt(
                                        `enter your friend code:`,
                                        [
                                            {
                                                name: "enter",
                                                onclick: (rawCode) => {
                                                    if (
                                                        rawCode.indexOf(
                                                            "friend:",
                                                        ) == -1
                                                    )
                                                        return App.displayPopup(
                                                            `Invalid friend code!`,
                                                        );

                                                    let b64 = rawCode.replace(
                                                        "friend:",
                                                        "",
                                                    );
                                                    try {
                                                        b64 =
                                                            decodeURIComponent(
                                                                atob(b64),
                                                            );
                                                        let json =
                                                            JSON.parse(b64);
                                                        if (!json.pet) {
                                                            throw "error";
                                                        }

                                                        if (
                                                            json.user_id ===
                                                            App.userId
                                                        )
                                                            return App.displayPopup(
                                                                `You can't add yourself as a friend!`,
                                                            );

                                                        let petDef = json.pet;

                                                        let def =
                                                            new PetDefinition().loadStats(
                                                                petDef,
                                                            );

                                                        App.displayConfirm(
                                                            `Are you trying to add <div style="font-weight: bold">${def.getCSprite()} ${def.name}?</div> as a friend?`,
                                                            [
                                                                {
                                                                    name: "yes",
                                                                    onclick:
                                                                        () => {
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
                                                                    name: "no",
                                                                    class: "back-btn",
                                                                    onclick:
                                                                        () => {},
                                                                },
                                                            ],
                                                        );
                                                    } catch (e) {
                                                        return App.displayPopup(
                                                            "Invalid friend code!",
                                                        );
                                                    }
                                                },
                                            },

                                            {
                                                name: "cancel",
                                                class: "back-btn",
                                                onclick: () => {},
                                            },
                                        ],
                                    );

                                    return true;
                                },
                            },
                        ]);

                        return true;
                    },
                },
            ],
            null,
            "Phone",
        );
    },
    open_social_media: function () {
        if (!App.temp.seenSocialMediaPosts) {
            App.temp.seenSocialMediaPosts = 0;
        }
        function showPost(petDefinition, noMood, isSelfPost) {
            if (!isSelfPost) {
                App.temp.seenSocialMediaPosts += 1;
            }

            if (App.temp.seenSocialMediaPosts >= 12 && !isSelfPost) {
                return App.displayPopup(
                    "There are no more social media posts, comeback later!",
                );
            }

            Missions.done(Missions.TYPES.check_social_post);

            let post = document
                .querySelector(".cloneables .post-container")
                .cloneNode(true);
            document.querySelector(".screen-wrapper").appendChild(post);
            post.style.display = "";

            document.querySelector(".post-profile-icon").innerHTML =
                `${petDefinition.getCSprite()}`;

            let postDrawer = new Drawer(
                post.querySelector(".post-canvas"),
                96,
                96,
            );
            let postText = post.querySelector(".post-text");

            setTimeout(() => postDrawer.draw());
            const close = () => {
                post.remove();
            };
            // App.toggleGameplayControls(false, close);
            post.querySelector(".post-close").onclick = close;
            post.querySelector(".post-next").onclick = () => {
                close();
                showRandomPost();
            };
            const postLikeElement = post.querySelector(".post-like");
            postLikeElement.onclick = () => {
                if (postLikeElement.classList.contains("liked")) return;
                postLikeElement.classList.add("liked");
                petDefinition.increaseFriendship(random(1, 4) * 0.1);
            };
            if (isSelfPost) {
                post.querySelector(".post-next").remove();
                postLikeElement.remove();
            }

            let homeBackground = App.scene.home.image;
            if (petDefinition !== App.petDefinition)
                homeBackground = randomFromArray(
                    Object.keys(App.definitions.room_background).map(
                        (roomName) =>
                            App.definitions.room_background[roomName].image,
                    ),
                );

            const background = new Object2d({
                drawer: postDrawer,
                img: homeBackground,
                x: 0,
                y: 0,
                width: 96,
                height: 96,
            });

            const characterPositions = ["50%", "20%", "80%"],
                characterSpritePoses = [1, 11, 14, 8, 2, 12];

            const character = new Object2d({
                drawer: postDrawer,
                spritesheet: {
                    ...petDefinition.spritesheet,
                    cellNumber: randomFromArray(characterSpritePoses),
                },
                // image: App.pet.image.cloneNode(),
                // img: petDefinition.sprite,
                image: App.preloadedResources[petDefinition.sprite],
                x: randomFromArray(characterPositions),
                y: 55 + (petDefinition.spritesheet.offsetY * 2 || 0),
            });

            post.querySelector(".post-header").innerHTML = petDefinition.name;

            switch (App.pet.state) {
                default:
                    const [
                        text,
                        pose,
                        backgroundImg,
                        backgroundSpritesheetDef,
                    ] = randomFromArray(App.definitions.tweets.generic);
                    postText.innerHTML = text; // text
                    if (pose) character.spritesheet.cellNumber = pose; // pose
                    if (backgroundImg) background.setImg(backgroundImg); // background
                    if (backgroundSpritesheetDef)
                        background.spritesheet = backgroundSpritesheetDef;
            }

            if (!noMood) {
                if (App.pet.hasMoodlet("hungry")) {
                    postText.innerHTML = "Can go for a bite #hungy";
                    character.spritesheet.cellNumber = 4;
                    background.setImg(homeBackground);
                }
                if (App.pet.hasMoodlet("sleepy")) {
                    postText.innerHTML = "battery low, need a nap!";
                    character.spritesheet.cellNumber = 4;
                    background.setImg(homeBackground);
                }
                if (App.pet.hasMoodlet("bored")) {
                    postText.innerHTML = "Anyone wanna talk? #bored";
                    character.spritesheet.cellNumber = 4;
                    background.setImg(homeBackground);
                }
                if (App.pet.hasMoodlet("sick")) {
                    postText.innerHTML = "Not feeling too good... #tummyache";
                    if (App.pet.stats.has_toothache) {
                        postText.innerHTML =
                            "Ate way too much snacks... #toothache";
                    }
                    character.spritesheet.cellNumber = 4;
                    background.setImg(homeBackground);
                }
            }
        }

        const showRandomPost = () => {
            App.petDefinition.stats.current_fun += random(0, 5);
            switch (random(0, 2, 3)) {
                case 0:
                    App.pet.stats.current_expression += 0.5;
                    break;
                case 1:
                    App.pet.stats.current_endurance += 0.5;
                    break;
                case 2:
                    App.pet.stats.current_logic += 0.5;
                    break;
            }
            let otherPetDef;
            if (App.petDefinition.friends && App.petDefinition.friends.length) {
                otherPetDef = randomFromArray(App.petDefinition.friends);
            } else {
                otherPetDef = App.getRandomPetDef();
            }
            showPost(otherPetDef, true);
        };

        App.displayList([
            {
                name: "make post",
                onclick: () => {
                    App.petDefinition.stats.current_fun += random(1, 5);
                    App.pet.stats.current_expression += 0.5;
                    showPost(App.petDefinition, null, true);
                    return true;
                },
            },
            {
                name: "explore posts",
                onclick: () => {
                    showRandomPost();
                    return true;
                },
            },
            {
                name: "find friends",
                onclick: () => {
                    const seed = App.getDayId(true);
                    let potentialFriends = new Array(8)
                        .fill(undefined)
                        .map((spot, i) =>
                            App.getRandomPetDef(
                                App.petDefinition.lifeStage,
                                seed + i * 128,
                            ),
                        );
                    App.displayGrid([
                        ...potentialFriends.map((otherPetDef) => {
                            return {
                                name: `${otherPetDef.getFullCSprite()}`,
                                class: "bg-bef-1",
                                onclick: () => {
                                    App.displayConfirm(
                                        `Do you want to send friend request to<br><b>${otherPetDef.getCSprite()} ${otherPetDef.name}?</b>`,
                                        [
                                            {
                                                name: "yes",
                                                onclick: () => {
                                                    let willAcceptFriendRequest =
                                                        random(0, 1) === 1;
                                                    if (
                                                        App.petDefinition.hasTrait(
                                                            "charismatic",
                                                        )
                                                    )
                                                        willAcceptFriendRequest = true;
                                                    if (
                                                        App.petDefinition.hasTrait(
                                                            "lucky",
                                                        )
                                                    )
                                                        willAcceptFriendRequest =
                                                            Boolean(
                                                                random(0, 3),
                                                            );
                                                    if (
                                                        !willAcceptFriendRequest
                                                    ) {
                                                        App.displayPopup(
                                                            `${otherPetDef.name} did <b style="color: #ff6e74">not accept</b> ${App.petDefinition.name}'s friend request`,
                                                        );
                                                        return;
                                                    }
                                                    let state =
                                                        App.petDefinition.addFriend(
                                                            otherPetDef,
                                                        );
                                                    if (state) {
                                                        App.displayPopup(
                                                            `${otherPetDef.name} <b style="color: #87cf00">accepted</b> ${App.petDefinition.name}'s friend request!`,
                                                        );
                                                        App.pet.stats.current_expression += 2;
                                                    } else
                                                        App.displayPopup(
                                                            `${App.petDefinition.name} is already friends with ${otherPetDef.name}!`,
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
                                    return true;
                                },
                            };
                        }),
                        {
                            name: '<i class="fa-solid fa-arrow-left back-sound"></i>',
                            class: "back-sound",
                            onclick: () => {},
                        },
                    ]);
                    return true;
                },
            },
            {
                name: `send message`,
                onclick: () => {
                    App.handlers.open_friends_list((friendDef) => {
                        if (friendDef.sentMessage) {
                            App.displayPopup(
                                `${App.petDefinition.name} shouldn't spam ${friendDef.name}'s inbox!`,
                                3000,
                            );
                            return;
                        }

                        App.displayPrompt(
                            false,
                            [
                                {
                                    name: "send",
                                    onclick: (value) => {
                                        const generator =
                                            new MessageAnswerGenerator(
                                                friendDef,
                                            );
                                        generator.deserialize(STORIES.a0);
                                        const { isProfane, answer } =
                                            generator.generateAnswer(value);

                                        friendDef.sentMessage = true;
                                        App.pet.stats.current_expression += 0.2;
                                        if (isProfane)
                                            friendDef.increaseFriendship(
                                                -random(0, 2),
                                            );
                                        else friendDef.increaseFriendship(10);

                                        App.displayConfirm(
                                            ...GenericUIDef.singleConfirm(
                                                `${UIComponent.PetDefMessageHead({ friendDef })}
                                                    <q>${answer}</q>`,
                                            ),
                                        );
                                    },
                                },
                                {
                                    name: "cancel",
                                    onclick: () => {},
                                    class: "back-btn",
                                },
                            ],
                            null,
                            "textarea",
                            `enter your message for ${friendDef.name.toLowerCase()}`,
                        );
                    });
                    return true;
                },
            },
        ]);
    },
    open_school_activity_list: function () {
        const backFn = () => {
            App.handlers.open_activity_list(true);
        };

        const getFlipCardsDifficulty = (stat) => {
            if (stat < 6) {
                return {
                    activeCards: 1,
                    maxCards: 4,
                    maxAttempts: 2,
                };
            } else if (stat < 15) {
                return {
                    activeCards: 1,
                    maxCards: 8,
                    maxAttempts: 3,
                };
            } else if (stat <= 30) {
                return {
                    activeCards: 1,
                    maxCards: 12,
                    maxAttempts: 3,
                };
            } else if (stat <= 60) {
                return {
                    activeCards: 2,
                    maxCards: 12,
                };
            } else {
                return {
                    activeCards: 3,
                    maxCards: 12,
                    maxAttempts: 5,
                };
            }
        };

        const countClassVisit = (payload) => {
            if (
                App.pet.stats.schoolClassesToday >=
                App.constants.SCHOOL.maxClassesPerDay
            ) {
                App.handlers.show_attended_school_limit_message();
                return true;
            }
            App.pet.stats.schoolClassesToday += 1;
            console.log(App.pet.stats.schoolClassesToday);
            App.pet.stats.current_discipline += random(1, 4);
            return payload();
        };

        const startClassGame = (text, payload) => {
            App.displayPopup(text, 2000, () => countClassVisit(payload));
        };

        const flipCardsDescription = `Keep track of cards with the ${App.getIcon("star", true)} symbol and select them after the shuffle!`;

        return App.displayList(
            [
                {
                    name: `${App.getIcon("special:expression")} Expression`,
                    onclick: () => {
                        return App.displayList([
                            {
                                name: "Tune Practice",
                                onclick: () => {
                                    startClassGame(
                                        "Remember the order the blocks light up, and recreate it when the light turns on!",
                                        () =>
                                            Activities.school_ExpressionGame({
                                                onEndFn: (pts) => {
                                                    if (
                                                        App.petDefinition.hasTrait(
                                                            "artistic",
                                                        )
                                                    )
                                                        pts *= 1.5;
                                                    if (
                                                        App.petDefinition.hasTrait(
                                                            "slowLearner",
                                                        )
                                                    )
                                                        pts *= 0.75;
                                                    App.pet.stats.current_expression +=
                                                        pts;
                                                },
                                            }),
                                    );
                                },
                            },
                            {
                                name: "Flip Cards",
                                onclick: () =>
                                    startClassGame(flipCardsDescription, () =>
                                        Activities.school_CardShuffleGame({
                                            ...getFlipCardsDifficulty(
                                                App.pet.stats
                                                    .current_expression,
                                            ),
                                            skillIcon: "special:expression",
                                            onEndFn: (pts) => {
                                                if (
                                                    App.petDefinition.hasTrait(
                                                        "artistic",
                                                    )
                                                )
                                                    pts *= 1.5;
                                                if (
                                                    App.petDefinition.hasTrait(
                                                        "slowLearner",
                                                    )
                                                )
                                                    pts *= 0.75;
                                                App.pet.stats.current_expression +=
                                                    pts;
                                            },
                                        }),
                                    ),
                            },
                        ]);
                    },
                },
                {
                    name: `${App.getIcon("special:logic")} Logic`,
                    onclick: () => {
                        return App.displayList([
                            {
                                name: "Track",
                                onclick: () =>
                                    startClassGame(
                                        `Keep track of the card with the ${App.getIcon("star", true)} symbol and select it after the shuffle!`,
                                        () =>
                                            Activities.school_CardShuffleGame({
                                                activeCards: 1,
                                                maxCards: 4,
                                                swapDelay: 200,
                                                maxSwaps: 10,
                                                maxAttempts: 1,
                                                skillIcon: "special:logic",
                                                onEndFn: (pts) => {
                                                    if (
                                                        App.petDefinition.hasTrait(
                                                            "logical",
                                                        )
                                                    )
                                                        pts *= 1.5;
                                                    if (
                                                        App.petDefinition.hasTrait(
                                                            "slowLearner",
                                                        )
                                                    )
                                                        pts *= 0.75;
                                                    App.pet.stats.current_logic +=
                                                        pts;
                                                },
                                            }),
                                    ),
                            },
                            {
                                name: "Flip Cards",
                                onclick: () =>
                                    startClassGame(flipCardsDescription, () =>
                                        Activities.school_CardShuffleGame({
                                            ...getFlipCardsDifficulty(
                                                App.pet.stats.current_logic,
                                            ),
                                            skillIcon: "special:logic",
                                            onEndFn: (pts) => {
                                                if (
                                                    App.petDefinition.hasTrait(
                                                        "logical",
                                                    )
                                                )
                                                    pts *= 1.5;
                                                if (
                                                    App.petDefinition.hasTrait(
                                                        "slowLearner",
                                                    )
                                                )
                                                    pts *= 0.75;
                                                App.pet.stats.current_logic +=
                                                    pts;
                                            },
                                        }),
                                    ),
                            },
                        ]);
                    },
                },
                {
                    name: `${App.getIcon("special:endurance")} Endurance`,
                    onclick: () => {
                        return App.displayList([
                            {
                                name: "Skipping Rope",
                                onclick: () => {
                                    startClassGame(
                                        "Jump at the perfect time to avoid touching the rope!",
                                        () =>
                                            Activities.school_EnduranceGame({
                                                onEndFn: (pts) => {
                                                    if (
                                                        App.petDefinition.hasTrait(
                                                            "athletic",
                                                        )
                                                    )
                                                        pts *= 1.5;
                                                    if (
                                                        App.petDefinition.hasTrait(
                                                            "slowLearner",
                                                        )
                                                    )
                                                        pts *= 0.75;
                                                    App.pet.stats.current_endurance +=
                                                        pts;
                                                },
                                            }),
                                    );
                                },
                            },
                            {
                                name: "Flip Cards",
                                onclick: () =>
                                    startClassGame(flipCardsDescription, () =>
                                        Activities.school_CardShuffleGame({
                                            ...getFlipCardsDifficulty(
                                                App.pet.stats.current_endurance,
                                            ),
                                            skillIcon: "special:endurance",
                                            onEndFn: (pts) => {
                                                if (
                                                    App.petDefinition.hasTrait(
                                                        "athletic",
                                                    )
                                                )
                                                    pts *= 1.5;
                                                if (
                                                    App.petDefinition.hasTrait(
                                                        "slowLearner",
                                                    )
                                                )
                                                    pts *= 0.75;
                                                App.pet.stats.current_endurance +=
                                                    pts;
                                            },
                                        }),
                                    ),
                            },
                        ]);
                    },
                },
            ],
            backFn,
        );
    },
    open_mall_activity_list: function () {
        const hasNewMainDecor = Object.keys(
            App.definitions.room_background,
        ).some((key) => {
            const room = App.definitions.room_background[key];
            if (room.type) return false;
            const isUnlocked = room.unlockKey
                ? App.getRecord(room.unlockKey)
                : true;
            const conditionMet = room.condition ? room.condition() : true;
            return (
                room.isNew && isUnlocked && !room.isCraftable && conditionMet
            );
        });
        const hasNewKitchenDecor = Object.keys(
            App.definitions.room_background,
        ).some((key) => {
            const room = App.definitions.room_background[key];
            if (room.type !== "kitchen") return false;
            const isUnlocked = room.unlockKey
                ? App.getRecord(room.unlockKey)
                : true;
            return room.isNew && isUnlocked && !room.isCraftable;
        });
        const hasNewBathroomDecor = Object.keys(
            App.definitions.room_background,
        ).some((key) => {
            const room = App.definitions.room_background[key];
            if (room.type !== "bathroom") return false;
            const isUnlocked = room.unlockKey
                ? App.getRecord(room.unlockKey)
                : true;
            return room.isNew && isUnlocked && !room.isCraftable;
        });
        const hasNewAccessory = Object.keys(App.definitions.accessories).some(
            (key) => {
                const accessory = App.definitions.accessories[key];
                const isUnlocked = accessory.unlockKey
                    ? App.getRecord(accessory.unlockKey)
                    : true;
                const accessShopExclusive = accessory.accessShop;
                return (
                    accessory.isNew &&
                    isUnlocked &&
                    !accessory.isCraftable &&
                    !accessShopExclusive
                );
            },
        );
        const hasNewItem = Object.keys(App.definitions.item).some((key) => {
            const isUnlocked = App.definitions.item[key].unlockKey
                ? App.getRecord(App.definitions.item[key].unlockKey)
                : true;
            return App.definitions.item[key].isNew && isUnlocked;
        });
        const hasNewFurniture = Object.keys(App.definitions.furniture).some(
            (key) => {
                const furniture = App.definitions.furniture[key];
                const isUnlocked = furniture.unlockKey
                    ? App.getRecord(furniture.unlockKey)
                    : true;
                return furniture.isNew && isUnlocked && !furniture.isCraftable;
            },
        );
        const hasPendingLuckyTicket =
            App.getRecord("last_lucky_ticket") !== App.getDayId();

        const backFn = () => {
            if (App.temp.purchasedMallItem) {
                App.temp.purchasedMallItem = false;
                App.closeAllDisplays();
                Activities.receivePurchasedItems(() =>
                    App.handlers.open_activity_list(true),
                );
            } else {
                App.handlers.open_activity_list(true);
            }
        };

        const getWeight = (item) => {
            if (item._disable) return -1;
            return item.priority || 0;
        };
        const activities = [
            {
                name: `buy items ${hasNewItem ? App.getBadge("new!") : ""}`,
                onclick: () => {
                    App.handlers.open_item_list(true);
                    return true;
                },
            },
            {
                name: `buy accessories ${hasNewAccessory ? App.getBadge("new!") : ""}`,
                onclick: () => {
                    App.handlers.open_accessory_list({ buyMode: true });
                    return true;
                },
            },
            {
                name: `redécor room ${hasNewMainDecor ? App.getBadge("new!") : ""}`,
                onclick: () => {
                    const createFilterFn = (type) => {
                        return (e) => e.type === type && !e.isCraftable;
                    };
                    return App.displayList([
                        {
                            name: `living room ${hasNewMainDecor ? App.getBadge("new!") : ""}`,
                            onclick: () => {
                                return App.displayList([
                                    {
                                        name: `Pre-furnished ${hasNewMainDecor ? App.getBadge("new!") : ""}`,
                                        onclick: () =>
                                            App.handlers.open_room_background_list(
                                                false,
                                                createFilterFn(),
                                            ),
                                    },
                                    {
                                        name: `Customizable ${hasNewMainDecor ? App.getBadge("new!") : ""}`,
                                        onclick: () =>
                                            App.handlers.open_room_background_list(
                                                true,
                                                createFilterFn(),
                                            ),
                                    },
                                    {
                                        type: "info",
                                        name: "Place up to 5 furniture items of your choosing in customizable rooms.",
                                    },
                                ]);
                            },
                        },
                        {
                            name: `bathroom ${hasNewBathroomDecor ? App.getBadge("new!") : ""}`,
                            onclick: () =>
                                App.handlers.open_room_background_list(
                                    false,
                                    createFilterFn("bathroom"),
                                ),
                        },
                        {
                            name: `kitchen ${hasNewKitchenDecor ? App.getBadge("new!") : ""}`,
                            onclick: () =>
                                App.handlers.open_room_background_list(
                                    false,
                                    createFilterFn("kitchen"),
                                ),
                        },
                    ]);
                },
            },
            {
                name: `Buy furniture ${hasNewFurniture ? App.getBadge("new!") : ""}`,
                onclick: () => {
                    App.handlers.open_furniture_list();
                    return true;
                },
            },
            {
                name: `<span style="color: #4e36d3;">${App.getIcon("ticket")} Lucky Ticket</span> ${hasPendingLuckyTicket ? App.getBadge("", "circle red pulse") : ""}`,
                priority: 2,
                _disable: !hasPendingLuckyTicket,
                onclick: () => {
                    App.displayPopup(
                        `Scratch a <div class="bold whitespace-no-wrap">${App.getIcon("ticket", true)} lucky ticket</div> once a day for free!`,
                        3000,
                        () =>
                            Activities.openScratchCard({
                                onEndCallback: () => {
                                    App.setRecord(
                                        "last_lucky_ticket",
                                        App.getDayId(),
                                    );
                                    App.handlers.open_mall_activity_list();
                                },
                            }),
                    );
                },
            },
        ].sort((a, b) => getWeight(b) - getWeight(a));

        App.displayList(activities, backFn);
    },
    open_market_menu: function () {
        const backFn = () => {
            App.handlers.open_activity_list(true);
        };

        const hasNewFood = Object.keys(App.definitions.food).some((key) => {
            const definition = App.definitions.food[key];
            if (definition.type) return;
            return definition.isNew;
        });
        const hasNewTreat = Object.keys(App.definitions.food).some((key) => {
            const definition = App.definitions.food[key];
            if (definition.type !== "treat") return;
            return definition.isNew;
        });
        const hasNewMed = Object.keys(App.definitions.food).some((key) => {
            const definition = App.definitions.food[key];
            if (definition.type !== "med") return;
            return definition.isNew;
        });

        App.displayList(
            [
                {
                    name: `purchase food ${hasNewFood ? App.getBadge("new!") : ""}`,
                    onclick: () => {
                        App.handlers.open_food_list({
                            buyMode: true,
                            filterType: "food",
                        });
                        return true;
                    },
                },
                {
                    name: `purchase snacks ${hasNewTreat ? App.getBadge("new!") : ""}`,
                    onclick: () => {
                        App.handlers.open_food_list({
                            buyMode: true,
                            filterType: "treat",
                        });
                        return true;
                    },
                },
                {
                    name: `purchase meds ${hasNewMed ? App.getBadge("new!") : ""}`,
                    onclick: () => {
                        App.handlers.open_food_list({
                            buyMode: true,
                            filterType: "med",
                        });
                        return true;
                    },
                },
                {
                    name: `purchase seeds`,
                    onclick: () => {
                        App.handlers.open_seed_list(true);
                        return true;
                    },
                },
                {
                    name: `sell`,
                    onclick: () => {
                        App.handlers.open_sell_list();
                        return true;
                    },
                },
                {
                    name: `Shop stock changes daily, so check back often for new offers!`,
                    type: "info",
                },
            ],
            backFn,
        );
    },
    open_sell_list: function () {
        App.displayList([
            {
                name: "food",
                onclick: () => {
                    App.handlers.open_food_list({ sellMode: true });
                    return true;
                },
            },
            {
                name: "You can sell special items (★) for more than the market price",
                type: "info",
            },
        ]);
    },
    open_game_list: function () {
        const tutorialDisplayTime = 2000;
        const backFn = () => {
            App.handlers.open_activity_list(true);
        };

        const list = [
            {
                _disable:
                    App.petDefinition.lifeStage < PetDefinition.LIFE_STAGE.teen,
                name: `fruit collector`,
                onclick: () => {
                    App.displayPopup(
                        `Pickup as many fruits as you can before the timer runs out!`,
                        tutorialDisplayTime,
                        () => Activities.islandCollectionGame(),
                    );
                    return false;
                },
            },
            {
                _disable:
                    App.petDefinition.lifeStage <
                    PetDefinition.LIFE_STAGE.child,
                name: `food knowledge`,
                onclick: () => {
                    App.displayPopup(
                        `Guess the food's name from its silhouette!`,
                        tutorialDisplayTime,
                        () => Activities.foodKnowledgeGame(),
                    );
                    return false;
                },
            },
            {
                _disable:
                    App.petDefinition.lifeStage <
                    PetDefinition.LIFE_STAGE.child,
                name: `picture puzzle`,
                onclick: () => {
                    App.displayPopup(
                        `Slide each piece into the correct position to complete the picture!`,
                        tutorialDisplayTime,
                        () => Activities.imagePuzzleGame(),
                    );
                    return false;
                },
            },
            {
                _disable:
                    App.petDefinition.lifeStage <
                    PetDefinition.LIFE_STAGE.child,
                name: `guess the number`,
                onclick: () => {
                    App.displayPopup(
                        `Try guessing the correct number!`,
                        tutorialDisplayTime,
                        () => Activities.guessTheNumberGame(),
                    );
                    return false;
                },
            },
            {
                _disable:
                    App.petDefinition.lifeStage < PetDefinition.LIFE_STAGE.teen,
                name: `leaves`,
                onclick: () => {
                    App.displayPopup(
                        `Clear out all the leaves before the timer runs out!`,
                        tutorialDisplayTime,
                        () => Activities.leavesGame(),
                    );
                    return false;
                },
            },
            {
                _disable:
                    App.petDefinition.lifeStage <
                    PetDefinition.LIFE_STAGE.child,
                name: `flags`,
                onclick: () => {
                    const image = `
                        <div class="flex justify-center">
                            <img src="resources/img/ui/flags.png"></img>
                        </div>
                        `;
                    App.displayPopup(
                        `Tap when both flags are facing down! ${image}`,
                        tutorialDisplayTime,
                        () => Activities.flagsGame(),
                    );
                    return false;
                },
            },
            {
                name: `crop match`,
                onclick: () => {
                    App.displayPopup(
                        `Memorize the sequence of crops as they appear!`,
                        tutorialDisplayTime,
                        () => Activities.plantMatchingGame(),
                    );
                    return false;
                },
            },
            {
                _disable:
                    App.petDefinition.lifeStage <
                    PetDefinition.LIFE_STAGE.child,
                name: `pet grooming`,
                onclick: () => {
                    App.displayPopup(
                        `Press the wash icon <i class="fa-solid fa-hands-wash"></i> as much as possible before the timer runs out!`,
                        tutorialDisplayTime,
                        () => Activities.dogWashingGame(),
                    );
                    return false;
                },
            },
            {
                name: `mimic`,
                onclick: () => {
                    const imgPath = "resources/img/ui/";
                    const images = `
                        <div class="flex justify-center">
                            <img src="${imgPath}facing_left.png"></img>
                            <img src="${imgPath}facing_center.png"></img>
                            <img src="${imgPath}facing_right.png"></img>
                        </div>
                        `;
                    App.displayPopup(
                        `Try to predict your opponents next stance ${images} and mimic them!`,
                        tutorialDisplayTime,
                        () => Activities.opponentMimicGame(),
                    );
                    return false;
                },
            },
            {
                name: `catch`,
                onclick: () => {
                    App.displayPopup(
                        `Catch as much <img src="resources/img/misc/heart_particle_01.png"></img> while avoiding <img src="resources/img/misc/falling_poop.png"></img>`,
                        tutorialDisplayTime,
                        () => Activities.fallingStuffGame(),
                    );
                    return false;
                },
            },
            {
                _disable:
                    App.petDefinition.lifeStage <
                    PetDefinition.LIFE_STAGE.child,
                name: "rod rush",
                onclick: () => {
                    App.displayPopup(
                        `Stop the pointer at the perfect time!`,
                        tutorialDisplayTime,
                        () => Activities.barTimingGame(),
                    );
                    return false;
                },
            },
            // {
            //     name: 'guess game (wip)',
            //     onclick: () => {
            //         // return Activities.guessGame();
            //     }
            // },
        ];

        list.sort((a, b) => Boolean(a._disable) - Boolean(b._disable));

        App.displayList(list, backFn);
    },
    open_battle_screen: function () {
        Battle.start();
    },
    shell_button: function (buttonNumber) {
        document.body.classList.add("button-mode");

        if (
            App.disableGameplayControls &&
            Boolean(App.gameplayControlsOverwrite)
        ) {
            if (!App.haveAnyDisplays()) {
                App.gameplayControlsOverwrite();
                App.vibrate();
            }
        }

        let justOpened = false;
        if (!App.haveAnyDisplays()) {
            justOpened = App.handlers.open_main_menu();
        }

        if (!justOpened) App.handleShellButton(buttonNumber);

        App.vibrate();
    },
    sleep: function () {
        App.pet.sleep();
        App.save();
    },
    clean: function () {
        // todo: this belongs in activities
        App.pet.stopMove();
        App.pet.triggerScriptedState("idle", App.INF, false, true);
        App.pet.x = 20;
        App.pet.y = App.scene.home.petY;
        App.toggleGameplayControls(false);
        Missions.done(Missions.TYPES.clean_room);

        const getDraggedWithMop = (object2d, size) => {
            let dragStart;
            if (object2d.x <= mop.x + mop.width) {
                object2d.x = mop.x + mop.width;
                if (!dragStart) dragStart = App.time;
                object2d.setState?.(
                    App.time - dragStart < 500
                        ? "shocked"
                        : App.pet.stats.has_poop_out
                          ? "idle"
                          : "mild_uncomfortable",
                );
            }
        };

        const poopObjects = App.drawer.selectObjects("poop");
        const miscObjects = App.drawer.selectObjects(["falling_leaf"]);

        const mop = new Object2d({
            image: App.preloadedResources["resources/img/misc/cleaner.png"],
            x: -100,
            y: 0,
            z: 100,
            rotation: -90,
            width: 96,
            height: 96,
            opacity: 0.9,
            onDraw: function (me) {
                Object2d.animations.flip(me);
                this.x += 0.08 * App.deltaTime;

                getDraggedWithMop(
                    App.pet,
                    App.petDefinition.spritesheet.cellSize,
                );
                poopObjects.forEach((poop) => getDraggedWithMop(poop));
                miscObjects.forEach((object) => getDraggedWithMop(object));
                App.spawnedAnimals?.forEach((animal) =>
                    getDraggedWithMop(animal),
                );

                if (App.scene.home?.grimeOverlay) {
                    const grimeClipX = Math.max(this.x + mop.width, 0);
                    App.scene.home.grimeOverlay.clip = [
                        [grimeClipX, 0],
                        [App.scene.home.grimeOverlay.image.width, 0],
                        [
                            App.scene.home.grimeOverlay.image.width,
                            App.scene.home.grimeOverlay.image.height,
                        ],
                        [grimeClipX, App.scene.home.grimeOverlay.image.height],
                    ];
                }

                if (this.x >= mop.width / 1.5) {
                    me.hidden = true;
                    App.pet.setState("idle");

                    App.fadeScreen({
                        middleFn: () => {
                            App.pet.stopScriptedState();
                            me.removeObject();
                            App.toggleGameplayControls(true);
                            App.pet.x = "50%";
                            App.pet.playCheeringAnimationIfTrue(
                                App.pet.stats.has_poop_out,
                                () => {},
                            );
                            App.pet.stats.has_poop_out = false;
                            poopObjects.forEach((poop) => poop.removeObject());
                            App.spawnedAnimals?.forEach(
                                (animal) => (animal.x = `${random(20, 80)}%`),
                            );
                            if (App.scene.home?.grimeOverlay) {
                                App.scene.home.grimeOverlay.clip = false;
                            }
                        },
                    });
                }
            },
        });
    },
    receive_friend_call: function (
        friendDef = randomFromArray(App.petDefinition.friends),
    ) {
        if (!friendDef) return;

        const getCallConfig = () => {
            let screenContent = UIComponent.PetDefMessageHead({
                friendDef,
            });
            let onAccept;

            switch (random(0, 1)) {
                case 0:
                    const hangOutLocation = randomFromArray([
                        "park",
                        "mall",
                        "game center",
                    ]);
                    screenContent += `<q>Do you want to go hang out at the ${hangOutLocation}?</q>`;
                    onAccept = () => {
                        let hangOutScene = App.scene.park;
                        if (hangOutLocation === "mall")
                            hangOutScene = App.scene.mallInterior;
                        if (hangOutLocation === "game center")
                            hangOutScene = App.scene.arcade_game01;
                        Activities.talkingSequence({
                            isPlayerHost: false,
                            otherPetDef: friendDef,
                            scene: hangOutScene,
                        });
                    };
                    break;
                default:
                    screenContent += `<q>Can I come over to hang out?</q>`;
                    onAccept = () => {
                        Activities.talkingSequence({
                            isPlayerHost: true,
                            otherPetDef: friendDef,
                        });
                    };
            }

            return {
                screenContent,
                onAccept,
            };
        };

        const config = getCallConfig();

        let autoStopTimeout;
        const ringingPhoneElement = document.querySelector(".ringing-phone");
        const playRingingSound = () =>
            App.playSound("resources/sounds/call_01.mp3", true);
        const phoneRingSoundInterval = setInterval(() => {
            playRingingSound();
            App.vibrate();
        }, 2000);
        const stopRinging = () => {
            clearInterval(phoneRingSoundInterval);
            clearTimeout(autoStopTimeout);
            autoStopTimeout = false;
            hidePhoneElement();
        };
        const showPhoneElement = () => {
            UI.show(ringingPhoneElement);
        };
        const hidePhoneElement = () => {
            UI.hide(ringingPhoneElement);
        };

        playRingingSound();
        showPhoneElement();
        ringingPhoneElement.onclick = () => {
            stopRinging();
            App.playSound("resources/sounds/ui_click_06.ogg", true);
            App.displayConfirm(
                ...GenericUIDef.binaryConfirm({
                    text: config.screenContent,
                    onAccept: () => {
                        App.queueEvent(config.onAccept);
                    },
                }),
            );
        };
        autoStopTimeout = setTimeout(
            stopRinging,
            App.constants.ONE_SECOND * (random(9, 14) - 0.5),
        );
    },
};
