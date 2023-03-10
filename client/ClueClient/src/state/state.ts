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
      viewport: {
        x: 0,
        y: 0,
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
        wallcheck: () => {
          if (!this.state.map) return false;

          const calcCollisionBox = (p: any): any => {
            return {
              w: p.borderbox.w,
              h: p.borderbox.h,
              x: p.x + p.borderbox.x,
              y: p.y + p.borderbox.y,
            };
          };

          const isDownFree = (wall: any, player: any): boolean => {
            let a = wall;
            let b = calcCollisionBox(player);
            if (a.x < b.x + b.w && a.x + a.w >= b.x) {
              const distance = a.y - (b.y + b.h);
              //console.log("down check: ", distance);
              if (distance < 3 && distance >= 0) return false;
            }

            return true;
          };
          const isUpFree = (wall: any, player: any): boolean => {
            let a = wall;
            let b = calcCollisionBox(player);
            if (a.x < b.x + b.w && a.x + a.w >= b.x) {
              const distance = a.y + a.h - b.y;
              console.log("up check: ", distance);
              if (distance > -3 && distance <= 0) return false;
            }

            return true;
          };
          const isLeftFree = (wall: any, player: any): boolean => {
            let a = wall;
            let b = calcCollisionBox(player);
            if (a.y < b.y + b.h && a.y + a.h >= b.y) {
              const distance = a.x + a.w - b.x;
              //console.log("left check: ", distance);
              if (distance > -3 && distance <= 0) return false;
            }

            return true;
          };
          const isRightFree = (wall: any, player: any): boolean => {
            let a = wall;
            let b = calcCollisionBox(player);
            if (a.y < b.y + b.h && a.y + a.h >= b.y) {
              const distance = a.x - (b.x + b.w);
              console.log("right check: ", distance);
              if (distance > -3 && distance <= 0) return false;
            }

            return true;
          };

          let player2 = this.state.objects[0];

          let walllength = this.state.map.maps[this.state.map.currentMap][1]["walls"].length;
          for (let i = 0; i < walllength; i++) {
            let w = this.state.map.maps[this.state.map.currentMap][1]["walls"][i];
            switch (player2.direction) {
              case "left":
                if (!isLeftFree(w, player2)) return false;
                break;
              case "right":
                if (!isRightFree(w, player2)) return false;
                break;
              case "up":
                if (!isUpFree(w, player2)) return false;
                break;
              case "down":
                if (!isDownFree(w, player2)) return false;
                break;
            }
          }
          return true;
        },
      },
      objects: [
        new GameObject(this, {
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
          borderbox: {
            enabled: true,
            w: 14,
            h: 8,
            x: 8,
            y: 24,
          },
        }),
      ],
    };
  }
}
