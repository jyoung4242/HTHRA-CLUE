type animationTypes = `${statusTypes}-${directionTypes}`;
type statusTypes = "idle" | "walk";
export type directionTypes = "up" | "down" | "left" | "right";

import CollisionManager from "./collision";
import OverworldEvent from "./OverworldEvent";
import { WALKSPEED } from "./keyboard";

export default class GameObject {
  state: any;
  cm;
  isColliding = false;
  id = 0;
  sprtposX = 0;
  sprtposY = 0;
  src = "";
  x = 0;
  y = 0;
  w = 32;
  h = 32;
  bgndw = 128;
  bgndh = 128;
  //z = 3;
  get z() {
    //check z-index
    if (this.type == "npc") {
      if (
        this.y + this.borderbox.y + this.borderbox.h / 2 <
        this.state.state.objects[0].y + this.state.state.objects[0].borderbox.y + this.state.state.objects[0].borderbox.h / 2
      ) {
        if (
          this.x + 15 >= this.state.state.objects[0].x + this.state.state.objects[0].borderbox.x &&
          this.x - 15 <=
            this.state.state.objects[0].x + this.state.state.objects[0].borderbox.x + this.state.state.objects[0].borderbox.w
        ) {
          return 2;
        } else {
          return 3;
        }
      } else {
        return 3;
      }
    } else return 3;
  }
  type = "";
  shadow = false;
  direction: directionTypes = "down";
  status: statusTypes = "idle";
  tik = 0;
  framesizeX = 0;
  framesizeY = 0;
  framerate = 2;
  currentAnimation: animationTypes = "idle-left";
  frame = 0;
  oldstatus: statusTypes;
  olddirection: directionTypes;
  borderbox: any;
  interact: any;
  isStanding: any = false;
  behaviorLoopIndex = 0;
  behaviorLoop: any;
  movingProgressRemaining = 0;
  animations = {
    "idle-down": [[0, 0]],
    "idle-up": [[0, 2 * 32]],
    "idle-left": [[0, 3 * 32]],
    "idle-right": [[0, 1 * 32]],
    "walk-down": [
      [1 * 32, 0],
      [0, 0],
      [3 * 32, 0],
      [0, 0],
    ],
    "walk-up": [
      [1 * 32, 2 * 32],
      [0, 2 * 32],
      [3 * 32, 2 * 32],
      [0, 2 * 32],
    ],
    "walk-left": [
      [1 * 32, 3 * 32],
      [0, 3 * 32],
      [3 * 32, 3 * 32],
      [0, 3 * 32],
    ],
    "walk-right": [
      [1 * 32, 1 * 32],
      [0, 1 * 32],
      [3 * 32, 1 * 32],
      [0, 1 * 32],
    ],
  };

  constructor(state: any, config: any) {
    this.state = state;
    this.cm = new CollisionManager(state);
    this.id = config.id;
    this.sprtposX = config.sprtposX;
    this.sprtposY = config.sprtposY;
    this.src = config.src;
    this.x = config.x;
    this.y = config.y;
    this.w = config.w;
    this.h = config.h;
    this.bgndh = config.bgndh;
    this.bgndw = config.bgndw;

    this.type = config.type;
    this.shadow = config.shadow;
    this.direction = config.direction;
    this.status = config.status;
    this.framerate = config.framerate;
    this.olddirection = this.direction;
    this.oldstatus = this.status;
    this.framesizeX = this.bgndw / this.w;
    this.borderbox = config.borderbox;
    this.behaviorLoop = config.behaviorLoop;
    this.interact = config.interact;

    if (this.behaviorLoop.length != 0) {
      setTimeout(() => {
        this.doBehaviorEvent();
      }, 20);
    }
  }

  get currentframe() {
    return this.animations[this.currentAnimation][this.frame];
  }

  getAnimation(dir: directionTypes, stat: statusTypes): animationTypes {
    return `${stat}-${dir}`;
  }

  async doBehaviorEvent() {
    if (this.state.state.cutscenes.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding) return;

    let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];

    eventConfig.who = this.id;
    const eventHandler = new OverworldEvent({ state: this.state.state, event: eventConfig });
    await eventHandler.init();

    this.behaviorLoopIndex += 1;
    if (this.behaviorLoopIndex === this.behaviorLoop.length) {
      this.behaviorLoopIndex = 0;
    }
    this.doBehaviorEvent();
  }

  updatePosition() {
    //check for collision
    let allObjects = this.state.state.objects.filter((obj: any) => {
      return obj.id != this.id;
    });
    for (let index = 0; index < allObjects.length; index++) {
      const element = allObjects[index];
      if (this.cm.isObjectColliding(element, this)) return;
      this.isColliding = false;
    }

    if (this.isColliding) return;
    this.movingProgressRemaining -= 1;
    switch (this.direction) {
      case "down":
        this.y += WALKSPEED;
        break;
      case "up":
        this.y -= WALKSPEED;
        break;
      case "left":
        this.x -= WALKSPEED;
        break;
      case "right":
        this.x += WALKSPEED;
        break;
    }
    if (this.movingProgressRemaining === 0) {
      //trigger event
      const event = new CustomEvent("PersonWalkingComplete", { detail: { whoID: this.id } });
      document.dispatchEvent(event);
    }
  }

  startBehavior(behavior: any) {
    this.direction = behavior.direction;
    if (behavior.type === "walk") {
      this.movingProgressRemaining = behavior.distance / 3;
      this.status = "walk";
    }

    if (behavior.type === "stand") {
      this.status = "idle";
      this.isStanding = true;
      setTimeout(() => {
        const event = new CustomEvent("PersonStandComplete", { detail: { whoID: this.id } });
        document.dispatchEvent(event);
        this.isStanding = false;
      }, behavior.time);
    }
  }

  update() {
    if (this.movingProgressRemaining > 0) {
      //update position if moving
      this.updatePosition();
    }
    //update animations
    if ((this.type == "player" || this.type == "npc") && this.status == "walk") {
      //sequence changed
      if (this.olddirection != this.direction || this.status != this.oldstatus) {
        this.tik = 0;
        this.frame = 0;
        this.currentAnimation = this.getAnimation(this.direction, this.status);
        this.olddirection = this.direction;
        this.oldstatus = this.status;
      } else {
        this.currentAnimation = this.getAnimation(this.direction, this.status);
        this.tik++;
        if (this.tik >= this.framerate) {
          this.frame++;
          if (this.frame >= this.animations[this.currentAnimation].length) {
            this.frame = 0;
          }
          this.tik = 0;
        }
      }

      this.sprtposX = this.animations[this.currentAnimation][this.frame][0];
      this.sprtposY = this.animations[this.currentAnimation][this.frame][1];
    } else if ((this.type == "player" || this.type == "npc") && this.status == "idle") {
      //idle
      this.frame = 0;
      this.currentAnimation = this.getAnimation(this.direction, this.status);
      this.sprtposX = this.animations[this.currentAnimation][this.frame][0];
      this.sprtposY = this.animations[this.currentAnimation][this.frame][1];
    }
  }
}
