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
       // this.activeName =  "02_open";
      //  this.actions[this.activeName].play();
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