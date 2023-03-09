import Game from "../scenes/game";
import Lobby from "../scenes/login";
import MapManager from "./mapmanager";

export default class Camera {
  template = ``;
  state: any;
  lobby: any = undefined;
  game: any = undefined;
  mapManager: any = undefined;
  constructor(state: any) {
    this.state = state;
    this.lobby = new Lobby(state);
    this.game = new Game(state);
    this.mapManager = new MapManager(state);
    this.template = `
    <div class="camera" style="transform: translate(\${camera.x}px,\${camera.y}px); width:\${camera.w}px; height:\${camera.h}px;">
      ${this.mapManager.template}
    </div?
    `;
    const demoMap = [
      { id: 0, w: 192, h: 192, src: "./assets/images/DemoLower.png" },
      { id: 1, w: 192, h: 192, src: "./assets/images/DemoUpper.png" },
    ];
    this.mapManager.loadMap("demo", demoMap);
    this.mapManager.switchMap("demo");
  }
  shake() {}
}
