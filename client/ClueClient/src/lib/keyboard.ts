import { Input } from "@peasy-lib/peasy-input";

export const WALKSPEED = 3;

export default class KeyboardManagement {
  map: any;
  state: any;
  keyLeft = false;
  keyRight = false;
  keyUp = false;
  keyDown = false;

  lastkey: any;
  constructor(state: any) {
    this.state = state;
    this.lastkey = null;
    this.map = Input.map(
      {
        ArrowLeft: { action: "walk-left", repeat: true },
        ArrowRight: { action: "walk-right", repeat: true },
        ArrowUp: { action: "walk-up", repeat: true },
        ArrowDown: { action: "walk-down", repeat: true },
        " ": "interact",
      },
      (action: string, doing: boolean) => {
        if (doing) {
          this.state.objects[0].status = "walk";

          switch (action) {
            case "interact":
              break;
            case "walk-left":
              if (this.lastkey == null || this.lastkey == "left") {
                this.keyLeft = true;
                this.state.objects[0].direction = "left";
                this.lastkey = "left";
                if (this.state.map.wallcheck()) this.state.objects[0].x -= WALKSPEED;
              }

              break;
            case "walk-right":
              if (this.lastkey == null || this.lastkey == "right") {
                this.state.objects[0].direction = "right";
                this.keyRight = true;
                this.lastkey = "right";
                if (this.state.map.wallcheck()) this.state.objects[0].x += WALKSPEED;
              }

              break;
            case "walk-up":
              if (this.lastkey == null || this.lastkey == "up") {
                this.state.objects[0].direction = "up";
                this.keyUp = true;
                this.lastkey = "up";
                if (this.state.map.wallcheck()) this.state.objects[0].y -= WALKSPEED;
              }

              break;
            case "walk-down":
              if (this.lastkey == null || this.lastkey == "down") {
                this.state.objects[0].direction = "down";
                this.lastkey = "down";
                this.keyDown = true;
                if (this.state.map.wallcheck()) this.state.objects[0].y += WALKSPEED;
              }
              break;
          }
        } else {
          switch (action) {
            case "walk-left":
              this.keyLeft = false;
              break;
            case "walk-right":
              this.keyRight = false;
              break;
            case "walk-up":
              this.keyUp = false;
              break;
            case "walk-down":
              this.keyDown = false;
              break;
          }

          if (!this.keyDown && !this.keyUp && !this.keyLeft && !this.keyRight) {
            this.state.objects[0].status = "idle";
            this.lastkey = null;
          }
        }
      }
    );
  }
}
