class Scene {
    constructor(data) {
        Object.assign(this, data);
    }
}

App.scene = {
    home: new Scene({
        image: "resources/img/background/house/02.png",
        petX: "50%",
        petY: "100%",
        onLoad: function () {
            App.drawer
                .selectObjects("poop")
                .forEach((p) => (p.absHidden = false));
            App.pet.staticShadow = false;
            if (App.pet.sicknessOverlay) {
                App.pet.sicknessOverlay.absHidden = false;
            }

            if (random(0, 10) == 0) {
                App.pet.showCurrentWant();
            }

            if (App.isDuringChristmas()) {
                // xmas tree
                const tree = new Object2d({
                    img: "resources/img/misc/xmas_tree_01.png",
                    x: 60,
                    y: 12,
                    z: App.constants.CHRISTMAS_TREE_Z,
                    parent: App.currentSceneObject,
                });
                App.pet.setLocalZBasedOnSelf(tree);
            }

            App.handleFurnitureSpawn();
            App.handleAnimalsSpawn(true);

            const currentBackgroundId = App.background.imageSrc
                .split("/")
                .slice(-1)[0];
            App.temp.homeCurrentBackgroundDef = Object.entries(
                App.definitions.room_background,
            ).find(([_, def]) => def.image.endsWith(currentBackgroundId))?.[1];
            App.temp.homeCurrentBackgroundDef?.onLoad?.();

            // grime overlay
            this.grimeOverlay = new Object2d({
                img: "resources/img/misc/interior_grime_01.png",
                x: 0,
                y: 0,
                z: 2,
                invisible: true,
                composite: "source-atop",
                parent: App.currentSceneObject,
                onDraw: (me) => {
                    if (App.pet.stats.has_poop_out >= 2) me.invisible = false;
                    else me.invisible = true;
                },
            });

            // random encounters
            App.runRandomEncounters("home");
        },
        onUnload: function () {
            App.drawer
                .selectObjects("poop")
                .forEach((p) => (p.absHidden = true));
            App.pet.staticShadow = true;
            if (App.pet.sicknessOverlay) {
                App.pet.sicknessOverlay.absHidden = true;
            }
            App.handleFurnitureSpawn(null, true);
            App.handleAnimalsSpawn(false);
            App.temp.homeCurrentBackgroundDef?.onUnload?.();

            // reset pet scale
            App.pet.scale = 1;
        },
    }),
    kitchen: new Scene({
        image: "resources/img/background/house/kitchen_03.png",
        foodsX: "50%",
        foodsY: 44,
        petX: "75%",
        petY: "81%",
        noShadows: true,
        onLoad: () => {
            App.pet.staticShadow = false;
        },
        onUnload: () => {
            App.pet.staticShadow = true;
        },
    }),
    park: new Scene({
        image: "resources/img/background/outside/park_02.png",
        onLoad: function () {
            this.fallingLeaves = Prefab.fallingLeafSpawner();
        },
        onUnload: function () {
            this.fallingLeaves?.removeObject();
        },
    }),
    mallWalkway: new Scene({
        image: "resources/img/background/outside/mall_walkway.png",
    }),
    walkway: new Scene({
        image: "resources/img/background/outside/walkway_01.png",
    }),
    office: new Scene({
        image: "resources/img/background/house/office_01.png",
    }),
    wedding: new Scene({
        petX: "50%",
        petY: "100%",
        image: "resources/img/background/house/wedding_01.png",
        noShadows: true,
    }),
    arcade: new Scene({
        image: "resources/img/background/house/arcade_01.png",
    }),
    arcade_game01: new Scene({
        image: "resources/img/background/house/arcade_02.png",
    }),
    market: new Scene({
        image: "resources/img/background/outside/market_01.png",
    }),
    bathroom: new Scene({
        image: "resources/img/background/house/bathroom_01.png",
    }),
    hospitalExterior: new Scene({
        image: "resources/img/background/outside/hospital_01.png",
    }),
    hospitalInterior: new Scene({
        image: "resources/img/background/house/clinic_01.png",
    }),
    parentsHome: new Scene({
        image: "resources/img/background/house/parents_house_01.png",
        onLoad: () => {
            let parentDefs = App.petDefinition.getParents();
            // this.parents = parentDefs.map(parent => {
            //     let p = new Pet(parent);
            //         p.y = 65;
            //     return p;
            // });

            this.parent = new Pet(randomFromArray(parentDefs), {
                y: 65,
                z: 4,
            });
        },
        onUnload: () => {
            // this.parents.forEach(parent => parent.removeObject());
            this.parent?.removeObject();
        },
    }),
    seaVacation: new Scene({
        image: "resources/img/background/outside/vacation_sea_l_01.png",
        onLoad: () => {
            this.seaCreatureObject = new Object2d({
                img: "resources/img/background/outside/vacation_sea_l_02.png",
                x: 0,
                y: 15,
                z: 7,
                bobFloat: 0,
                onDraw: (me) => {
                    Object2d.animations.bob(me, 0.001, 0.04);
                },
            });

            this.boatObject = new Object2d({
                img: "resources/img/background/outside/vacation_sea_l_03.png",
                x: 0,
                y: 0,
                z: 6,
                bobFloat: 1,
            });

            this.overlay = new Object2d({
                img: "resources/img/misc/picture_overlay_01.png",
                x: 0,
                y: 0,
                z: 1000,
            });
        },
        onUnload: () => {
            this.seaCreatureObject.removeObject();
            this.boatObject.removeObject();
            this.overlay.removeObject();
        },
    }),
    graveyard: new Scene({
        image: "resources/img/background/outside/graveyard_01.png",
        noShadows: true,
    }),
    battle: new Scene({
        image: "resources/img/background/house/battle_01.png",
        noShadows: true,
    }),
    stand: new Scene({
        image: "resources/img/background/outside/stand_01.png",
    }),
    online_hub: new Scene({
        noShadows: true,
        image: "resources/img/background/house/online_hub_01.png",
        onLoad: () => {
            App.temp.lightRaysObject = new Object2d({
                img: "resources/img/misc/light_rays_02.png",
                opacity: 0.6,
                x: "50%",
                y: "50%",
                composite: "overlay",
                z: App.constants.BACKGROUND_OBJECT_Z - 1,
                onDraw: (me) => {
                    me.rotation -= 0.005 * App.deltaTime;
                },
            });
            App.temp.platformObject = new Object2d({
                img: "resources/img/misc/online_hub_01_front.png",
                x: 0,
                y: 0,
                z: App.constants.BACKGROUND_OBJECT_Z,
            });
        },
        onUnload: () => {
            App.temp.platformObject?.removeObject();
            App.temp.lightRaysObject?.removeObject();
        },
    }),
    garden: new Scene({
        image: "resources/img/background/outside/garden_01.png",
        petY: "95%",
        onLoad: function (args) {
            this.grassFieldObject = Prefab.grassField({ height: 30 });
            this.treeBunchObject = Prefab.treeBunch({
                seed: 64522824,
                randomDisplacementRange: [-5, 5],
                treeConfig: {
                    z: App.constants.BACKGROUND_Z - 1,
                },
            });

            App.pet.staticShadow = false;

            if (!args?.noPetBowl) {
                App.temp.petBowlObject = new Object2d({
                    img: "resources/img/misc/pet_bowl_01.png",
                    x: "20%",
                    y: "67%",
                    width: 22,
                    height: 22,
                    z: App.constants.ACTIVE_PET_Z,
                    depthMode: Object2d.DEPTH_MODE.y,
                });

                if (App.animals.treat) {
                    new Object2d({
                        parent: App.temp.petBowlObject,
                        img: App.constants.FOOD_SPRITESHEET,
                        spritesheet: {
                            ...App.constants.FOOD_SPRITESHEET_DIMENSIONS,
                            cellNumber:
                                App.animals.treat + App.animals.treatBiteCount,
                        },
                        x: App.temp.petBowlObject.x,
                        y: "63%",
                        localZ: 2,
                    });
                }
            }

            App.handleAnimalsSpawn(true);

            // handle dig spot spawn
            if (
                !App.temp.hasActiveDigSpot &&
                App.canProceed(
                    "backyardDigSpot",
                    App.constants.ONE_MINUTE * random(30, 120),
                )
            ) {
                const chance =
                    (App.animals?.list?.length || 0) +
                    (App.petDefinition.hasTrait("lucky") ? 4 : 0);
                App.temp.hasActiveDigSpot =
                    clamp(chance, 0, 9) >= random(0, 18);
            }

            if (App.temp.hasActiveDigSpot) {
                App.temp.digSpotObject = new Object2d({
                    img: "resources/img/misc/dig_spot_01.png",
                    x: "20%",
                    y: "84%",
                    z: App.pet.z + 1,
                    spritesheet: {
                        cellNumber: 1,
                        cellSize: 24,
                        rows: 1,
                        columns: 2,
                    },
                });
                // App.pet.setLocalZBasedOnSelf(App.temp.digSpotObject);
            }
        },
        onUnload: function () {
            this.grassFieldObject?.removeObject();
            this.treeBunchObject?.removeObject();

            App.pet.staticShadow = true;

            App.temp.petBowlObject?.removeObject?.();
            App.temp.digSpotObject?.removeObject?.();

            App.handleAnimalsSpawn(false);
        },
    }),
    beach: new Scene({
        image: "resources/img/background/house/beach_01.png",
    }),
    skate_park: new Scene({
        image: "resources/img/background/outside/skatepark_01.png",
    }),
    fortune_teller: new Scene({
        image: "resources/img/background/house/fortune_teller_01.png",
        onLoad: () => {
            const npcDef = new PetDefinition({
                sprite: "resources/img/character/chara_362b.png",
                accessories: ["witch hat"],
            });
            this.fortuneTellerNpc = new Pet(npcDef);
            this.fortuneTellerNpc.stopMove();
            this.fortuneTellerNpc.x = "80%";
            this.fortuneTellerNpc.triggerScriptedState(
                "idle",
                App.INF,
                false,
                true,
            );

            this.underlay = new Object2d({
                img: "resources/img/background/house/fortune_teller_01_underlay.png",
                z: App.constants.BACKGROUND_Z - 1,
                x: 0,
                y: 0,
            });
        },
        onUnload: () => {
            this.fortuneTellerNpc?.removeObject();
            this.underlay?.removeObject();
        },
    }),
    garden_inner: new Scene({
        image: "resources/img/background/outside/garden_inner_01.png",
        petY: "55%",
        animalMinY: 55,
        shadowOffset: -5,
        onLoad: () => {
            App.handleGardenPlantsSpawn(true);
            App.handleAnimalsSpawn(true);
            App.pet.staticShadow = true;
        },
        onUnload: () => {
            App.handleGardenPlantsSpawn(false);
            App.handleAnimalsSpawn(false);
            App.pet.staticShadow = false;
        },
    }),
    forest: new Scene({
        image: "resources/img/background/outside/transparent.png",
        petY: "94%",
        onLoad: () => {},
        onUnload: () => {},
    }),
    reviverDen: new Scene({
        image: "resources/img/background/house/reviver_01.png",
        noShadows: true,
    }),
    emptyOutside: new Scene({
        image: "resources/img/background/outside/transparent.png",
    }),
    genericOutside: new Scene({
        image: "resources/img/background/outside/activities_base_01.png",
    }),
    mallInterior: new Scene({
        image: "resources/img/background/house/mall_interior_01.png",
    }),
    animalBathroom: new Scene({
        image: "resources/img/background/house/animal_bathroom_01.png",
    }),
    classroom: new Scene({
        image: "resources/img/background/house/classroom_01.png",
        onLoad: () => {
            App.pet.staticShadow = false;
        },
        onUnload: () => {
            App.pet.staticShadow = true;
        },
    }),
    music_classroom: new Scene({
        image: "resources/img/background/house/music_classroom_01.png",
    }),
    gym: new Scene({
        image: "resources/img/background/house/gym_01.png",
    }),
    homeworld_getaways: new Scene({
        image: "resources/img/background/house/homeworld_getaways_01.png",
        noShadows: true,
    }),
    devil_town_exterior: new Scene({
        image: "resources/img/background/house/devil_town_01.png",
        noShadows: true,
        onLoad: () => {
            App.pet.showOutline();
        },
        onUnload: () => {
            App.pet.hideOutline();
        },
    }),
    devil_town_gathering: new Scene({
        image: "resources/img/background/house/devil_town_02.png",
        noShadows: true,
        onLoad: () => {
            App.pet.showOutline();
        },
        onUnload: () => {
            App.pet.hideOutline();
        },
    }),
    angel_town_room: new Scene({
        image: "resources/img/background/house/angel_town_01.png",
        noShadows: true,
    }),
    restaurant: new Scene({
        image: "resources/img/background/house/restaurant_01.png",
        noShadows: true,
    }),
    full_grass: new Scene({
        image: "resources/img/background/outside/full_grass_01.png",
        onLoad: function () {
            this.fallingLeaves = Prefab.fallingLeafSpawner();
        },
        onUnload: function () {
            this.fallingLeaves?.removeObject();
        },
    }),
    galaxy: new Scene({
        image: "resources/img/background/house/galaxy_01.png",
        noShadows: true,
        onLoad: () => {
            let lastSpawnTime = 0;
            this.shootingStarsSpawner = new Object2d({
                onDraw: () => {
                    if (App.time < lastSpawnTime + 100) return;

                    lastSpawnTime = App.time;

                    const shootingStar = new Object2d({
                        parent: this.shootingStarsSpawner,
                        img: "resources/img/misc/twinkle_01.png",
                        scale: 0.2 + Math.random() * 0.3,
                        x: `${random(0, 100)}%`,
                        y: `${random(0, 100)}%`,
                        opacity: 0.001,
                        opacityAdderSign: 1,
                        rotation: 0,
                        scale: 1,
                        direction: {
                            x: randomFromArray([1, -1]),
                            y: randomFromArray([1, -1]),
                        },
                        onLateDraw: (me) => {
                            me.opacity = clamp(
                                me.opacity +
                                    0.001 * me.opacityAdderSign * App.deltaTime,
                                0,
                                1,
                            );

                            if (me.opacity >= 1) me.opacityAdderSign = -3;
                            if (me.opacity <= 0) me.removeObject();

                            me.x += me.direction.x * App.deltaTime * 0.01;
                            me.y += me.direction.y * App.deltaTime * 0.01;

                            me.scale = lerp(
                                me.scale,
                                0,
                                0.0005 * App.deltaTime,
                            );
                        },
                    });
                },
            });
        },
        onUnload: () => {
            this.shootingStarsSpawner.removeObject();
        },
    }),
    post_office: new Scene({
        image: "resources/img/background/house/post_office_01.png",
    }),
};
