import * as THREE from "three";

export default class AnimationsDoor {
    constructor(object, animations) {
    this.states = [ "close/open"];
    
        this.mixer = new THREE.AnimationMixer(object);
        this.actionInProgress = false;

        this.actions = {};
        for (let i = 0; i < animations.length; i++) {
            const clip = animations[i];
            const action = this.mixer.clipAction(clip);
            this.actions[clip.name] = action;
            if (this.states.indexOf(clip.name) >= 4 ) {
                action.clampWhenFinished = true;
                action.loop = THREE.LoopOnce;
            }
       }
        this.activeName =  "close/open";
        this.actions[this.activeName].play();
    }
 

    fadeToAction(name, duration) {
       
            const previousName = this.activeName;
            this.activeName = name;
            this.actions[previousName].fadeOut(duration);
            this.actions[this.activeName]
                .reset()
                .setEffectiveTimeScale(1)
                .setEffectiveWeight(1)
                .fadeIn(duration)
                .play();
    }

    // actionFinished() {
    //     if (this.actionInProgress) {
    //         this.actionInProgress = false;
    //         this.mixer.removeEventListener("finished", this.actionInProgress);
    //     }
    // }

    update(deltaT) {
        if (this.mixer) {
            this.mixer.update(deltaT);
        }
    }
}