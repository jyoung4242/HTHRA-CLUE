import { Input } from "@peasy-lib/peasy-input";
import CollisionManager from "./collision";
import CutsceneManager from "./cutscenes";
import { TriggerCheck } from "./collision";
import { Chance } from "chance";

const chance = new Chance();

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
        "5": { action: "emote", repeat: false },
        "6": { action: "shake", repeat: false },
        "7": { action: "flash", repeat: false },
        "8": { action: "changemap", repeat: false },
        Enter: { action: "interact", repeat: false },
      },
      (action: string, doing: boolean) => {
        if (doing) {
          switch (action) {
            case "interact":
              const player = this.state.objects[0];
              if (this.state.cutscenes.isCutscenePlaying) return;
              //is there an interactable object in front of you?
              switch (this.state.objects[0].direction) {
                case "down":
                  for (let index = 1; index < this.state.objects.length; index++) {
                    const element = this.state.objects[index];
                    if (element.interact.length == 0) return false;
                    const rstl = this.checkForObject(element, "down");
                    if (rstl) {
                      //fire off cutscene of objects 'interactions'
                      this.cutscenes = new CutsceneManager(element.interact, this.state, player);
                      this.cutscenes.startCutscene();
                    }
                  }

                  break;
                case "up":
                  for (let index = 1; index < this.state.objects.length; index++) {
                    const element = this.state.objects[index];
                    if (element.interact.length == 0) return false;
                    const rstl = this.checkForObject(element, "up");
                    if (rstl) {
                      //fire off cutscene of objects 'interactions'
                      this.cutscenes = new CutsceneManager(element.interact, this.state, player);
                      this.cutscenes.startCutscene();
                    }
                  }
                  break;
                case "left":
                  for (let index = 1; index < this.state.objects.length; index++) {
                    const element = this.state.objects[index];
                    if (element.interact.length == 0) return false;
                    const rstl = this.checkForObject(element, "left");
                    if (rstl) {
                      //fire off cutscene of objects 'interactions'
                      this.cutscenes = new CutsceneManager(element.interact, this.state, player);
                      this.cutscenes.startCutscene();
                    }
                  }
                  break;
                case "right":
                  for (let index = 1; index < this.state.objects.length; index++) {
                    const element = this.state.objects[index];
                    if (element.interact.length == 0) return false;
                    const rstl = this.checkForObject(element, "right");
                    if (rstl) {
                      //fire off cutscene of objects 'interactions'
                      this.cutscenes = new CutsceneManager(element.interact, this.state, player);
                      this.cutscenes.startCutscene();
                    }
                  }
                  break;
              }
              //oh, there is, then engage its 'interact actions'
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
              this.state.objects[0].status = "walk";
              if ((this.lastkey == null || this.lastkey == "left") && !this.state.cutscenes.isCutscenePlaying) {
                this.keyLeft = true;
                this.state.objects[0].direction = "left";
                this.lastkey = "left";
                if (!this.cm.isWallCollision(this.state.objects[0], "left")) this.state.objects[0].x -= WALKSPEED; //this.state.map.wallcheck()
                //add Trigger check
                const trgRslt: TriggerCheck = this.cm.isTriggerCollision(this.state.objects[0], "left");
                if (trgRslt.result == true) {
                  if (trgRslt.actions) {
                    this.cutscenes = new CutsceneManager(trgRslt.actions, this.state, this.state.objects[0]);
                    this.cutscenes.startCutscene();
                  }
                }
              }

              break;
            case "walk-right":
              this.state.objects[0].status = "walk";
              if ((this.lastkey == null || this.lastkey == "right") && !this.state.cutscenes.isCutscenePlaying) {
                this.state.objects[0].direction = "right";
                this.keyRight = true;
                this.lastkey = "right";
                if (!this.cm.isWallCollision(this.state.objects[0], "right")) this.state.objects[0].x += WALKSPEED;
                //add Trigger check
                const trgRslt: TriggerCheck = this.cm.isTriggerCollision(this.state.objects[0], "right");
                if (trgRslt.result == true) {
                  if (trgRslt.actions) {
                    this.cutscenes = new CutsceneManager(trgRslt.actions, this.state, this.state.objects[0]);
                    this.cutscenes.startCutscene();
                  }
                }
              }

              break;
            case "walk-up":
              this.state.objects[0].status = "walk";
              if ((this.lastkey == null || this.lastkey == "up") && !this.state.cutscenes.isCutscenePlaying) {
                this.state.objects[0].direction = "up";
                this.keyUp = true;
                this.lastkey = "up";
                if (!this.cm.isWallCollision(this.state.objects[0], "up")) this.state.objects[0].y -= WALKSPEED;
                //add Trigger check
                const trgRslt: TriggerCheck = this.cm.isTriggerCollision(this.state.objects[0], "up");
                if (trgRslt.result == true) {
                  if (trgRslt.actions) {
                    this.cutscenes = new CutsceneManager(trgRslt.actions, this.state, this.state.objects[0]);
                    this.cutscenes.startCutscene();
                  }
                }
              }

              break;
            case "walk-down":
              this.state.objects[0].status = "walk";
              if ((this.lastkey == null || this.lastkey == "down") && !this.state.cutscenes.isCutscenePlaying) {
                this.state.objects[0].direction = "down";
                this.lastkey = "down";
                this.keyDown = true;
                if (!this.cm.isWallCollision(this.state.objects[0], "down")) this.state.objects[0].y += WALKSPEED;
                //add Trigger check
                const trgRslt: TriggerCheck = this.cm.isTriggerCollision(this.state.objects[0], "down");
                if (trgRslt.result == true) {
                  if (trgRslt.actions) {
                    this.cutscenes = new CutsceneManager(trgRslt.actions, this.state, this.state.objects[0]);
                    this.cutscenes.startCutscene();
                  }
                }
              }
              break;
            case "emote":
              const emotter = this.state.objects[0];
              const eType = chance.pickone(["busy", "angry", "happy", "excited", "alerted"]);

              this.cutscenes = new CutsceneManager(
                [{ type: "emote", emoteType: eType, duration: 4000, wait: chance.bool() }],
                this.state,
                emotter
              );
              this.cutscenes.startCutscene();
              break;
            case "shake":
              this.cutscenes = new CutsceneManager(
                [{ type: "cameraShake", duration: 750, magnitude: 3, interval: 5, shaketype: "random" }],
                this.state,
                this.state.objects[0]
              );
              this.cutscenes.startCutscene();
              break;
            case "flash":
              this.cutscenes = new CutsceneManager([{ type: "cameraflash" }], this.state, this.state.objects[0]);
              this.cutscenes.startCutscene();
              break;
            case "changemap":
              let newmap = "";
              let newx = 0;
              let newy = 0;

              if (this.state.map.currentMap == "demo") {
                newmap = "outside";
                newx = 105;
                newy = 75;
              } else {
                newmap = "demo";
                newx = 50;
                newy = 70;
              }

              this.state.objects[0].map = newmap;

              this.cutscenes = new CutsceneManager(
                [{ type: "changeMap", newMap: newmap, startingLocation: { x: newx, y: newy }, who: this.state.objects[0] }],
                this.state,
                this.state.objects[0]
              );
              this.cutscenes.startCutscene();
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

  rad2angle(rad: number): number {
    const pi = Math.PI;
    return rad * (180 / pi);
  }

  checkForObject(obj: any, dir: string): boolean {
    const x1 = obj.x;
    const y1 = obj.y;
    const x2 = this.state.objects[0].x;
    const y2 = this.state.objects[0].y;
    const xs = (x2 - x1) * (x2 - x1);
    const ys = (y2 - y1) * (y2 - y1);
    const distance = Math.sqrt(xs + ys);

    if (distance < 17) {
      const rads = Math.atan2(y2 - y1, x2 - x1);
      const angle = this.rad2angle(rads);
      switch (dir) {
        case "down":
          if (angle >= -160 && angle <= -25) return true;
          else return false;
          break;
        case "up":
          if (angle <= 160 && angle >= 25) return true;
          else return false;
          break;
        case "left":
          if (angle <= 65 || angle >= -65) return true;
          else return false;
          break;
        case "right":
          if (angle >= 125 || angle <= -125) return true;
          else return false;
          break;
      }
    }
    return false;
  }
}
