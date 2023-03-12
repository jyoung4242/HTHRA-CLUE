type MapData = Record<string, Array<object>>;
import hero from "../assets/images/hero.png";
import GameObject from "../lib/gObject";

export enum GameState {
  NONE,
  Lobby,
  Game,
}

export default class State {
  state: any;
  constructor() {
    this.state = {
      routing: {
        currentState: GameState.Lobby,
        get isLobby() {
          return this.currentState == GameState.Lobby;
        },
        get isGame() {
          return this.currentState == GameState.Game;
        },
      },
      camera: {
        x: 0,
        y: 0,
        w: 200,
        h: 200,
        scale: 3,
      },
      map: {
        currentMap: "none",
        maps: <MapData>{},
        get selectMap() {
          return this.maps[this.currentMap];
        },
      },
      objects: [
        new GameObject({
          id: 0,
          sprtposX: 0,
          sprtposY: 0,
          src: hero,
          x: 50,
          y: 70,
          w: 32,
          h: 32,
          bgndw: 128,
          bgndh: 128,
          z: 3,
          type: "player",
          shadow: true,
          direction: "down",
          status: "idle",
          framerate: 2,
        }),
      ],
    };
  }
}
