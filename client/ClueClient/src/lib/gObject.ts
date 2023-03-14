type animationTypes = `${statusTypes}-${directionTypes}`;
type statusTypes = "idle" | "walk";
type directionTypes = "up" | "down" | "left" | "right";

export default class GameObject {
  state: any;
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
  z = 3;
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
    this.z = config.z;
    this.type = config.type;
    this.shadow = config.shadow;
    this.direction = config.direction;
    this.status = config.status;
    this.framerate = config.framerate;
    this.olddirection = this.direction;
    this.oldstatus = this.status;
    this.framesizeX = this.bgndw / this.w;
    this.borderbox = config.borderbox;
  }

  get currentframe() {
    return this.animations[this.currentAnimation][this.frame];
  }

  getAnimation(dir: directionTypes, stat: statusTypes): animationTypes {
    return `${stat}-${dir}`;
  }

  update() {
    if (this.type == "player" && this.status == "walk") {
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
    } else if (this.type == "player" && this.status == "idle") {
      //idle
      this.frame = 0;
      this.currentAnimation = this.getAnimation(this.direction, this.status);
      this.sprtposX = this.animations[this.currentAnimation][this.frame][0];
      this.sprtposY = this.animations[this.currentAnimation][this.frame][1];
    }
  }
}
