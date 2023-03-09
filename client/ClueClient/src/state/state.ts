type MapData = Record<string, Array<object>>;

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
        x: 10,
        y: 20,
        w: 25,
        h: 25,
      },
      map: {
        currentMap: "none",
        maps: <MapData>{},
        get selectMap() {
          return this.maps[this.currentMap];
        },
      },
    };
  }
}
