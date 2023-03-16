import Game from "../scenes/game";
import Lobby from "../scenes/login";
import MapManager from "./mapmanager";
import objectManager from "./objects";

import DemoLower from "../assets/images/DemoLower.png";
import DemoUpper from "../assets/images/DemoUpper.png";

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

  constructor(state: any) {
    this.state = state;
    this.lobby = new Lobby(state);
    this.game = new Game(state);
    this.mapManager = new MapManager(state);
    this.objects = new objectManager(state);

    this.template = `
    <div class="camera" style="transform: translate(\${camera.x}px,\${camera.y}px); width:\${camera.w}px; height:\${camera.h}px;">
      
        ${this.mapManager.template}
        ${this.objects.template}
      
    </div>
    `;
    const demoMap = {
      config: {
        triggers: [{ x: 107, y: 45, w: 24, h: 24, actions: [{ type: "popup", text: "CUTSCENE STARTED!" }] }],
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
    this.mapManager.loadMap("demo", demoMap);
    this.mapManager.switchMap("demo");
  }
  shake() {}
  flash() {}
  follow() {}
  update() {
    let targetpositionX = this.state.viewport.x / 6 - this.state.camera.follow.w / 2;
    let targetpositionY = this.state.viewport.y / 6 - this.state.camera.follow.h / 2;
    this.state.camera.x = targetpositionX - this.state.camera.follow.x;
    this.state.camera.y = targetpositionY - this.state.camera.follow.y;
  }
}
