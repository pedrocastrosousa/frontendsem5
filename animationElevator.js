import * as THREE from "three";

export default class AnimationsElevator {
    constructor(object, animations) {
    this.states = [ "02_open"];
    
        this.mixer = new THREE.AnimationMixer(object);
        this.actionInProgress = false;

        this.actions = {};
        for (let i = 0; i < animations.length; i++) {
            const clip = animations[i];
            const action = this.mixer.clipAction(clip);
            this.actions[clip.name] = action;
            
       }
    
    }
 

    fadeToAction(name, duration) {
       
            this.activeName = name;
            this.actions[this.activeName]
                .reset()
                .setEffectiveTimeScale(1)
                .setEffectiveWeight(1)
                .fadeIn(duration)
                .fadeOut(10)
                .play();
    }

  

    update(deltaT) {
        if (this.mixer) {
            this.mixer.update(deltaT);
        }
    }
}