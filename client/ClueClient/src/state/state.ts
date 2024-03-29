type MapData = Record<string, mapConfig>;
import hero from "../assets/images/hero.png";
import npc1 from "../assets/images/npc2.png";
import GameObject from "../lib/gObject";
import { mapConfig, mapConfigData } from "../lib/mapmanager";
import sf from "./storyflags.json";

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
        maptransition: false,
      },
      camera: {
        x: 0,
        y: 0,
        w: 200,
        h: 200,
        scale: 3,
        follow: <GameObject | null>null,
        camera: undefined,
        flash: false,
      },
      map: {
        currentMap: <keyof mapConfigData>"none",
        showWalls: false,
        showTriggers: false,
        maps: <MapData>{},
        configs: <any>{},
        /*
        get selectMap() {
          console.log(this.maps[this.currentMap]);

          return this.maps[this.currentMap];
        },*/
        selectMap: [
          { id: 0, z: 0, src: "", w: 0, h: 0 },
          { id: 1, z: 5, src: "", w: 0, h: 0 },
        ],
        get getWalls() {
          return this.configs[this.currentMap].walls;
        },
        get getTriggers() {
          return this.configs[this.currentMap].triggers;
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
              //console.log("up check: ", distance);
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
              //console.log("right check: ", distance);
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
          map: "demo",
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
            enabled: false,
            w: 14,
            h: 8,
            x: 8,
            y: 24,
          },
          behaviorLoop: [],
        }),
        new GameObject(this, {
          map: "demo",
          id: 1,
          sprtposX: 0,
          sprtposY: 0,
          src: npc1,
          x: 28,
          y: 112, //60
          w: 32,
          h: 32,
          bgndw: 128,
          bgndh: 128,
          z: 3,
          type: "npc",
          shadow: true,
          direction: "down",
          status: "idle",
          framerate: 2,
          borderbox: {
            enabled: false,
            w: 14,
            h: 8,
            x: 8,
            y: 24,
          },
          interact: [{ type: "dialog", dialogId: "npc2dialog" }],
          behaviorLoop: [
            { type: "walk", direction: "up", distance: 24 },
            { type: "stand", direction: "left", duration: 750 },
            { type: "stand", direction: "down", duration: 750 },
            { type: "walk", direction: "right", distance: 24 },
            { type: "stand", direction: "up", duration: 750 },
            { type: "stand", direction: "left", duration: 750 },
            { type: "walk", direction: "down", distance: 24 },
            { type: "stand", direction: "right", duration: 750 },
            { type: "stand", direction: "up", duration: 750 },
            { type: "walk", direction: "left", distance: 24 },
            { type: "stand", direction: "right", duration: 750 },
            { type: "stand", direction: "down", duration: 750 },
            { type: "emote", duration: 2000, emoteType: "alerted", wait: true },
          ],
        }),
      ],
      get renderedObjects() {
        return this.objects.filter((obj: any) => obj.map == this.map.currentMap);
      },
      cutscenes: {
        isCutscenePlaying: false,
      },
      dialog: {
        dm: undefined,
        isVisible: false,
        leftAvatar: "",
        rightAvatar: "",
        dialogID: "",
        style: "basic",
        typeSpeed: 100,
        message: "",
        showNext: false,
        showDone: false,
        choices: [],
        choicemade: (_event: any, _model: any, element: any, _object: any) => {
          //set story flags
          this.state.dialog.dm.setSF((element as HTMLElement).getAttribute("data-choice"));
          //finish dialog
          this.state.dialog.dm.endDialog();
          const event = new CustomEvent("DialogComplete", { detail: { whoID: this.state.objects[0] } });
          document.dispatchEvent(event);
        },
        get isChoices() {
          return this.style == "right_interact" || this.style == "left_interact";
        },
        get isLeft() {
          return this.style == "left" || this.style == "left_interact";
        },
        get isRight() {
          return this.style == "right" || this.style == "right_interact";
        },
        get isBasic() {
          return this.style == "basic";
        },
        nextMessage: () => {
          this.state.dialog.dm.nextMessage();
        },
        doneMessage: () => {
          this.state.dialog.dm.endDialog();
          const event = new CustomEvent("DialogComplete", { detail: { whoID: this.state.objects[0] } });
          document.dispatchEvent(event);
        },
      },
      storyflags: sf,
    };
  }
}
