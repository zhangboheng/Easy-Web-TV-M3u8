class AnimalDefinition extends PetDefinition {
    constructor(config){
        super(config);

        this.stats = {
            ...this.stats,
            wander_min: 0.1,
            wander_max: 0.2,
            speed: 0.02 + (Math.random() * 0.01),

            // serialized stats
            current_happiness: config.stats?.current_happiness ?? random(15, 50),
            buff: config.stats?.buff || App.getRandomGameplayBuff(),
        };
        this.lastStatsUpdate = config.lastStatsUpdate || Date.now();
        this.spawnIndoors = config.spawnIndoors || false;
    }
    getLifeStage(){
        return PetDefinition.LIFE_STAGE.baby;
    }
    feed(amt){
        this.stats.current_happiness += amt;
    }
    increaseHappiness(amt){
        return this.feed(amt);
    }
    shouldLeave(){
        return this.stats.current_happiness <= 0;
    }
    serialize(){
        return {
            ...App.minimalizePetDef(this.serializeStats(true)),
            lastStatsUpdate: this.lastStatsUpdate,
            spawnIndoors: this.spawnIndoors,
            stats: {
                current_happiness: this.stats.current_happiness,
                buff: this.stats.buff,
            }
        };
    }
    handleStatsUpdate(){
        const HOURS_UNTIL_LEAVE = 48;

        const now = Date.now();

        const happiness_decrease_rate = 100 / (HOURS_UNTIL_LEAVE * 3600);
        const delta = now - this.lastStatsUpdate;
        this.lastStatsUpdate = now;

        const ticks = delta / 1000;
        const happinessDecrease = happiness_decrease_rate * ticks;
        this.stats.current_happiness -= Math.abs(happinessDecrease);

        this.stats.current_happiness = clamp(this.stats.current_happiness, 0, 100);
    }
    getFullCSprite(noMargin){
        const margin = noMargin ? 0 : 10;
        return `<c-sprite width="16" height="16" index="0" src="${this.sprite}" pos-x="0" pos-y="0" style="margin-right: ${margin}px;"></c-sprite>`;
    }
    getBuff(){
        return App.getGameplayBuffDefinitionFromKey(this.stats.buff) ||
            App.definitions.gameplay_buffs.increasedWateredDuration;
    }

    hasTrait(){}
    developTrait(){}

    static calculateTimeToZero(decreaseRate) {
        const maxStat = 100;
        const timeToZeroMilliseconds = (maxStat / decreaseRate) * 1000;
        const duration = moment.duration(timeToZeroMilliseconds);

        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();

        console.log(`${hours}:${minutes}`);
    }
}



class Animal extends Pet {
    shouldDisplaySleepParticles = false;
    ignoreAnimationSetObjects = true;

    constructor(definition, additionalProps){
        super(definition, additionalProps);

        this.selector = 'animal';

        this.z = App.constants.ACTIVE_PET_Z;
        this.animalDefinition = this.petDefinition;
    }
    async interactWith(other, interactionConfig = {
        animation: randomFromArray(['cheering', 'shocked', 'blush', 'sitting', 'angry', 'kissing']),
        length: random(2000, 5000),
    }){
        other.stopMove();
        other.triggerScriptedState('idle', 0, false);

        this.stopMove();
        if(other.inverted) this.targetX = other.x + this.spritesheet.cellSize;
        else this.targetX = other.x - this.spritesheet.cellSize;
        this.targetY = other.y;
        await this.triggerScriptedState('moving', 20000, false, true, false, Pet.scriptedEventDrivers.moveCheck.bind({pet: this}));
        this.inverted = !other.inverted;

        // check if the target has entered a scripted state
        // during the we were trying to reach them
        if(other.isDuringScriptedState()) return;

        other.stopMove();
        other.triggerScriptedState(interactionConfig.animation, interactionConfig.length, false);
        this.triggerScriptedState(interactionConfig.animation, interactionConfig.length, false, true);
    }
    getInteractionTarget(){
        const target = randomFromArray(
            [...App.spawnedAnimals, App.pet]
                .filter(a => a !== this)
                .filter(a => !a.isDuringScriptedState() && !a?.stats?.is_sleeping)
        );
        return target;
    }
    onDraw(){
        if(!this.currentScenePets) {
            this.currentScenePets = App.drawer.selectObjects('pet');
        }

        if(this.currentScenePets?.length){
            const lastPet = this.currentScenePets[this.currentScenePets.length - 1];
            return lastPet?.setLocalZBasedOnSelf?.(this);
        }

        App.pet.setLocalZBasedOnSelf(this);
    }
    wander() {
        if(this.isMoving){
            this.nextRandomTargetSelect = 0;
        }

        if (!this.nextRandomTargetSelect) {
            this.nextRandomTargetSelect = App.lastTime + random(this.stats.wander_min, this.stats.wander_max) * 1000;
        }

        if (App.lastTime > this.nextRandomTargetSelect) {
            if(this.handleAutomaticInteractions()) return;

            this.targetX = random(this.drawer.getRelativePositionX(0), this.drawer.getRelativePositionX(100) - this.spritesheet.cellSize);
            if(!random(0, 4)) {
                this.targetX = App.pet.x - this.spritesheet.cellSize;
            }

            this.targetY = this.getValidRandomYPosition();

            this.nextRandomTargetSelect = 0;
        }
    }
    getValidRandomYPosition(minY){
        const sceneMinY = minY || App.currentScene.animalMinY || 88;
        return random(
            this.drawer.getRelativePositionX(100) - (this.spritesheet.cellSize / 2),
            this.drawer.getRelativePositionX(sceneMinY) - this.spritesheet.cellSize
        );
    }
    handleAutomaticInteractions(){
        if(App.haveAnyDisplays()) return false;
        if(App.lastTime > (this.nextInteractionTime || 0)){
            const interactionTarget = this.getInteractionTarget();
            if(interactionTarget){
                this.nextInteractionTime = App.lastTime + random(10000, 30000);
                interactionTarget.nextInteractionTime = App.lastTime + random(10000, 30000);
                this.interactWith(interactionTarget);
                return true;
            }
        }
        return false;
    }
    handleRandomGestures(){
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
        }

        // const hasGoodMoodlets = ['amused', 'rested', 'full', 'healthy'].map(moodName => this.hasMoodlet(moodName)).some(moodlet => moodlet);
        const hasBadMoodlets = ['bored', 'sleepy', 'hungry', 'sick'].map(moodName => this.hasMoodlet(moodName)).some(moodlet => moodlet);

        // good animations
        if(!hasBadMoodlets){
            if(random(0, 100) < 10){
                const commonAnimations = [
                    {name: 'sitting', length: random(2000, 4000)},
                    {name: 'blush', length: random(550, 1000)},
                    {name: 'cheering', length: random(550, 1000)},
                    {name: 'shocked', length: random(450, 800)},
                ];
                const rareAnimation = [
                    {name: 'sleeping', length: random(10000, 30000)},
                ];
                let animation = randomFromArray([
                    ...commonAnimations,
                    ...commonAnimations,
                    ...commonAnimations,
                    ...commonAnimations,
                    ...commonAnimations,
                    ...commonAnimations,
                    ...commonAnimations,
                    ...commonAnimations,
                    ...rareAnimation,
                ]);
                if(App.pet.stats.is_sleeping){
                    animation = {name: 'sleeping', length: random(10000, 30000)};
                }
                this.triggerScriptedState(animation.name, animation.length, random(10000, 20000));
                this.stopMove();
            } else if(random(0, 105) < 3){
                this.jump(0.28, true);
            }
        }
    }
    statsManager(){
        this.animalDefinition.handleStatsUpdate();
    }
    handleWants(){}
    sleep(){}
}
