import { directionTypes } from "./gObject";

export type TriggerCheck = {
  result: boolean;
  actions: Array<object> | null;
};

export default class CollisionManager {
  state: any;
  constructor(state: any) {
    this.state = state;
  }
  isObjectColliding(a: any, b: any): boolean {
    let A = this.calcCollisionBox(a);
    let B = this.calcCollisionBox(b);

    if (A.x < B.x + B.w && A.x + A.w > B.x && A.y < B.y + B.h && A.y + A.h > B.y) {
      return true;
    }
    return false;
  }
  isWallCollision(entity: any, direction: directionTypes): boolean {
    let walllength = this.state.map.configs[this.state.map.currentMap].walls.length;
    for (let i = 0; i < walllength; i++) {
      let w = this.state.map.configs[this.state.map.currentMap].walls[i];
      switch (direction) {
        case "left":
          if (!this.isLeftFree(w, entity)) return true;
          break;
        case "right":
          if (!this.isRightFree(w, entity)) return true;
          break;
        case "up":
          if (!this.isUpFree(w, entity)) return true;
          break;
        case "down":
          if (!this.isDownFree(w, entity)) return true;
          break;
      }
    }
    return false;
  }

  isTriggerCollision(entity: any, direction: directionTypes): TriggerCheck {
    let walllength = this.state.map.configs[this.state.map.currentMap].triggers.length;
    for (let i = 0; i < walllength; i++) {
      let w = this.state.map.configs[this.state.map.currentMap].triggers[i];
      switch (direction) {
        case "left":
          if (!this.isLeftFree(w, entity))
            return {
              result: true,
              actions: this.state.map.configs[this.state.map.currentMap].triggers[i].actions,
            };
          break;
        case "right":
          if (!this.isRightFree(w, entity))
            return {
              result: true,
              actions: this.state.map.configs[this.state.map.currentMap].triggers[i].actions,
            };
          break;
        case "up":
          if (!this.isUpFree(w, entity))
            return {
              result: true,
              actions: this.state.map.configs[this.state.map.currentMap].triggers[i].actions,
            };
          break;
        case "down":
          if (!this.isDownFree(w, entity))
            return {
              result: true,
              actions: this.state.map.configs[this.state.map.currentMap].triggers[i].actions,
            };
          break;
      }
    }
    return {
      result: false,
      actions: null,
    };
  }

  calcCollisionBox = (p: any): any => {
    return {
      w: p.borderbox.w,
      h: p.borderbox.h,
      x: p.x + p.borderbox.x,
      y: p.y + p.borderbox.y,
    };
  };

  isDownFree = (wall: any, player: any): boolean => {
    let a = wall;
    let b = this.calcCollisionBox(player);
    if (a.x < b.x + b.w && a.x + a.w >= b.x) {
      const distance = a.y - (b.y + b.h);
      //console.log("down check: ", distance);
      if (distance < 3 && distance >= 0) return false;
    }

    return true;
  };
  isUpFree = (wall: any, player: any): boolean => {
    let a = wall;
    let b = this.calcCollisionBox(player);
    if (a.x < b.x + b.w && a.x + a.w >= b.x) {
      const distance = a.y + a.h - b.y;
      //console.log("up check: ", distance);
      if (distance > -3 && distance <= 0) return false;
    }

    return true;
  };
  isLeftFree = (wall: any, player: any): boolean => {
    let a = wall;
    let b = this.calcCollisionBox(player);
    if (a.y < b.y + b.h && a.y + a.h >= b.y) {
      const distance = a.x + a.w - b.x;
      //console.log("left check: ", distance);
      if (distance > -3 && distance <= 0) return false;
    }

    return true;
  };
  isRightFree = (wall: any, player: any): boolean => {
    let a = wall;
    let b = this.calcCollisionBox(player);
    if (a.y < b.y + b.h && a.y + a.h >= b.y) {
      const distance = a.x - (b.x + b.w);
      //console.log("right check: ", distance);
      if (distance > -3 && distance <= 0) return false;
    }

    return true;
  };
}
