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
    const demoMap = [
      { id: 0, w: 192, h: 192, src: `${DemoLower}`, z: 0 },
      { id: 1, w: 192, h: 192, src: `${DemoUpper}`, z: 5 },
    ];
    this.mapManager.loadMap("demo", demoMap);
    this.mapManager.switchMap("demo");
  }
  shake() {}
  flash() {}
  follow() {}
}
