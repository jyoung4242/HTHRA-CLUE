import Game from "../scenes/game";
import Lobby from "../scenes/login";
import MapManager from "./mapmanager";
import objectManager from "./objects";

import DemoLower from "../assets/images/DemoLower.png";
import DemoUpper from "../assets/images/DemoUpper.png";
import outsideLower from "../assets/images/StreetNorthLower.png";
import outsideUpper from "../assets/images/StreetNorthUpper.png";

export type ShakeDirection = "horizontal" | "vertical" | "random";

/*
rendering layers
z - 0 floor
z - 5 canopy

z - 1 ysort -1
z - 2 objects
z - 3 ysort +1

z - 4 reserved...
*/

export default class Camera {
  following: any = null;
  template = ``;
  state: any;
  lobby: any = undefined;
  game: any = undefined;
  mapManager: any = undefined;
  objects: any = undefined;

  //shaking props
  isShaking: boolean = false;
  shakeType: ShakeDirection = "horizontal";
  shakeAngle = 0;
  shakeFrequency = 0;
  shakeDuration = 0;
  shakeMagnitude = 0;
  shakeElapsedTime = 0;
  shakeIntervalTime = 0;

  constructor(state: any) {
    this.state = state;
    this.lobby = new Lobby(state);
    this.game = new Game(state);
    this.mapManager = new MapManager(state);
    this.objects = new objectManager(state);
    this.state.camera.camera = this;

    this.template = `
    <div class="camera" style="transform: translate(\${camera.x}px,\${camera.y}px); width:\${camera.w}px; height:\${camera.h}px;">
        <div class="flash" \${===camera.flash}></div>
        ${this.mapManager.template}
        ${this.objects.template}  
    </div>
    `;

    const outsideMap = {
      config: {
        triggers: [],
        walls: [],
      },
      layers: [
        {
          id: 0,
          w: 256,
          h: 288,
          src: `${outsideLower}`,
          z: 0,
        },
        {
          id: 1,
          w: 256,
          h: 288,
          src: `${outsideUpper}`,
          z: 5,
        },
      ],
    };

    const demoMap = {
      config: {
        triggers: [
          {
            x: 107,
            y: 45,
            w: 24,
            h: 24,
            actions: [{ type: "dialog", dialogId: "floortile" }],
          },
          {
            x: 75,
            y: 175,
            w: 24,
            h: 24,
            actions: [
              { type: "changeMap", newMap: "outside", startingLocation: { x: 100, y: 100 }, who: this.state.objects[0] },
            ],
          },
        ],
        walls: [
          { x: 48, y: 45, w: 28, h: 24 },
          { x: 0, y: 35, w: 100, h: 27 },
          { x: 0, y: 0, w: 12, h: 170 },
          { x: 0, y: 160, w: 76, h: 15 },
          { x: 65, y: 175, w: 30, h: 5 },
          { x: 96, y: 160, w: 75, h: 15 },
          { x: 110, y: 96, w: 32, h: 28 },
          { x: 96, y: 45, w: 11, h: 32 },
          { x: 103, y: 40, w: 20, h: 20 },
          { x: 128, y: 45, w: 12, h: 32 },
          { x: 136, y: 35, w: 32, h: 27 },
          { x: 172, y: 0, w: 5, h: 170 },
        ],
      },
      layers: [
        {
          id: 0,
          w: 192,
          h: 192,
          src: `${DemoLower}`,
          z: 0,
        },
        {
          id: 1,
          w: 192,
          h: 192,
          src: `${DemoUpper}`,
          z: 5,
        },
      ],
    };

    this.state.camera.follow = this.state.objects[0];
    this.mapManager.loadMap("outside", outsideMap);
    this.mapManager.loadMap("demo", demoMap);
    this.mapManager.switchMap("demo");
  }
  shake(shakeType: ShakeDirection, magnitude: number, duration: number, interval: number) {
    this.shakeElapsedTime = 0;
    this.shakeIntervalTime = 0;
    this.shakeType = shakeType;
    this.shakeMagnitude = magnitude;
    this.shakeDuration = duration;
    this.shakeFrequency = interval;
    this.isShaking = true;
    const event = new CustomEvent("cameraShakeComplete", { detail: { whoID: this.state.objects[0] } });
    document.dispatchEvent(event);
  }

  flash() {
    this.state.camera.flash = true;
    setTimeout(() => {
      this.state.camera.flash = false;
    }, 10);
  }

  follow(who: any) {
    this.state.camera.follow = who;
  }

  shakeUpdate(time: number): any {
    if (!this.isShaking) return { shakeX: 0, shakeY: 0 };

    this.shakeElapsedTime += time * 1000;
    this.shakeIntervalTime += time * 1000;
    //console.log("shaking:", this.shakeIntervalTime, this.shakeDuration);
    // We're done shaking
    if (this.shakeElapsedTime >= this.shakeDuration) {
      this.isShaking = false;
      return { shakeX: 0, shakeY: 0 };
    }

    while (this.shakeIntervalTime >= this.shakeFrequency) {
      this.shakeIntervalTime -= this.shakeFrequency;
      // Reset interval time and recalculate shake offset
      switch (this.shakeType) {
        case "horizontal":
          this.shakeAngle = this.shakeAngle === 0 ? 180 : 0;
          break;
        case "vertical":
          this.shakeAngle = this.shakeAngle === 90 ? 270 : 90;
          break;
        case "random":
          this.shakeAngle = Math.floor(Math.random() * 360);
          break;
      }
    }

    // Convert to radians
    const theta = (this.shakeAngle * Math.PI) / 180;
    // Convert magnitude and angle to vector
    return { shakeX: this.shakeMagnitude * Math.cos(theta), shakeY: this.shakeMagnitude * Math.sin(theta) };
  }

  update() {
    let targetpositionX = this.state.viewport.x / 6 - this.state.camera.follow.w / 2;
    let targetpositionY = this.state.viewport.y / 6 - this.state.camera.follow.h / 2;
    let { shakeX, shakeY } = this.shakeUpdate(0.1);
    this.state.camera.x = targetpositionX - this.state.camera.follow.x + shakeX;
    this.state.camera.y = targetpositionY - this.state.camera.follow.y + shakeY;
  }
}
