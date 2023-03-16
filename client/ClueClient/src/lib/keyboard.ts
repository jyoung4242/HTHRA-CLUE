import { Input } from "@peasy-lib/peasy-input";
import CollisionManager from "./collision";
import CutsceneManager from "./cutscenes";
import { TriggerCheck } from "./collision";

export const WALKSPEED = 3;

export default class KeyboardManagement {
  map: any;
  state: any;
  keyLeft = false;
  keyRight = false;
  keyUp = false;
  keyDown = false;
  cm;
  cutscenes: any;
  lastkey: any;
  constructor(state: any) {
    this.state = state;
    this.cm = new CollisionManager(state);
    this.lastkey = null;
    this.map = Input.map(
      {
        ArrowLeft: { action: "walk-left", repeat: true },
        ArrowRight: { action: "walk-right", repeat: true },
        ArrowUp: { action: "walk-up", repeat: true },
        ArrowDown: { action: "walk-down", repeat: true },
        "1": { action: "showWalls", repeat: false },
        "2": { action: "showTriggers", repeat: false },
        "3": { action: "showCollisionBox", repeat: false },
        "4": { action: "toggleCamera", repeat: false },
        " ": "interact",
      },
      (action: string, doing: boolean) => {
        if (doing) {
          this.state.objects[0].status = "walk";
          console.log(action);

          switch (action) {
            case "interact":
              break;
            case "toggleCamera":
              if (this.state.camera.follow == this.state.objects[0]) this.state.camera.follow = this.state.objects[1];
              else this.state.camera.follow = this.state.objects[0];
              break;
            case "showCollisionBox":
              console.log("toggle collisionsboxes");
              this.state.objects.forEach((o: any) => {
                if (o.borderbox.enabled) o.borderbox.enabled = false;
                else o.borderbox.enabled = true;
              });
              break;
            case "showWalls":
              console.log("toggle walls");

              if (this.state.map.showWalls) this.state.map.showWalls = false;
              else this.state.map.showWalls = true;
              break;
            case "showTriggers":
              console.log("toggle triggers");
              if (this.state.map.showTriggers) this.state.map.showTriggers = false;
              else this.state.map.showTriggers = true;
              break;
            case "walk-left":
              if ((this.lastkey == null || this.lastkey == "left") && !this.state.cutscenes.isCutscenePlaying) {
                this.keyLeft = true;
                this.state.objects[0].direction = "left";
                this.lastkey = "left";
                if (!this.cm.isWallCollision(this.state.objects[0], "left")) this.state.objects[0].x -= WALKSPEED; //this.state.map.wallcheck()
                //add Trigger check
                const trgRslt: TriggerCheck = this.cm.isTriggerCollision(this.state.objects[0], "left");
                if (trgRslt.result == true) {
                  if (trgRslt.actions) this.cutscenes = new CutsceneManager(trgRslt.actions, this.state);
                  this.cutscenes.startCutscene();
                  this.keyLeft = false;
                }
              }

              break;
            case "walk-right":
              if ((this.lastkey == null || this.lastkey == "right") && !this.state.cutscenes.isCutscenePlaying) {
                this.state.objects[0].direction = "right";
                this.keyRight = true;
                this.lastkey = "right";
                if (!this.cm.isWallCollision(this.state.objects[0], "right")) this.state.objects[0].x += WALKSPEED;
                //add Trigger check
                const trgRslt: TriggerCheck = this.cm.isTriggerCollision(this.state.objects[0], "right");
                if (trgRslt.result == true) {
                  if (trgRslt.actions) this.cutscenes = new CutsceneManager(trgRslt.actions, this.state);
                  this.cutscenes.startCutscene();
                  this.keyRight = false;
                }
              }

              break;
            case "walk-up":
              if ((this.lastkey == null || this.lastkey == "up") && !this.state.cutscenes.isCutscenePlaying) {
                this.state.objects[0].direction = "up";
                this.keyUp = true;
                this.lastkey = "up";
                if (!this.cm.isWallCollision(this.state.objects[0], "up")) this.state.objects[0].y -= WALKSPEED;
                //add Trigger check
                const trgRslt: TriggerCheck = this.cm.isTriggerCollision(this.state.objects[0], "up");
                if (trgRslt.result == true) {
                  if (trgRslt.actions) this.cutscenes = new CutsceneManager(trgRslt.actions, this.state);
                  this.keyUp = false;
                  this.cutscenes.startCutscene();
                }
              }

              break;
            case "walk-down":
              if ((this.lastkey == null || this.lastkey == "down") && !this.state.cutscenes.isCutscenePlaying) {
                this.state.objects[0].direction = "down";
                this.lastkey = "down";
                this.keyDown = true;
                if (!this.cm.isWallCollision(this.state.objects[0], "down")) this.state.objects[0].y += WALKSPEED;
                //add Trigger check
                const trgRslt: TriggerCheck = this.cm.isTriggerCollision(this.state.objects[0], "down");
                if (trgRslt.result == true) {
                  if (trgRslt.actions) this.cutscenes = new CutsceneManager(trgRslt.actions, this.state);
                  this.cutscenes.startCutscene();
                  this.keyDown = false;
                }
              }
              break;
          }
        } else {
          console.log(action, doing);

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
