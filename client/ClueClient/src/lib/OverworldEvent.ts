type OverworldEventType = "walk" | "stand" | "console" | "dialog";

type OverworldEventParam = {
  who: number;
  type: OverworldEventType;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  distance?: number;
  text?: string;
  dialogId: string;
};

import SF from "../state/storyflags.json";

export default class OverworldEvent {
  //map: any;
  state: any;
  event: OverworldEventParam;

  constructor({ state, event }: any) {
    //this.map = map;
    this.state = state;
    this.event = event;
  }

  console(resolve: any) {
    console.log("popup event: ", this.event.text);
    resolve();
  }

  stand(resolve: any) {
    const whoIndex = this.state.objects.findIndex((obj: any) => {
      return obj.id === this.event.who;
    });

    if (whoIndex < 0) {
      resolve();
      return;
    }
    const who = this.state.objects[whoIndex];
    who.startBehavior({
      type: "stand",
      direction: this.event.direction,
      time: this.event.duration,
    });

    const completeHandler = (e: any) => {
      if (e.detail.whoID === this.event.who) {
        document.removeEventListener("PersonStandComplete", completeHandler);
        resolve();
      }
    };

    document.addEventListener("PersonStandComplete", completeHandler);
  }

  walk(resolve: any) {
    const whoIndex = this.state.objects.findIndex((obj: any) => {
      return obj.id === this.event.who;
    });

    if (whoIndex < 0) {
      resolve();
      return;
    }
    const who = this.state.objects[whoIndex];
    who.startBehavior({
      type: "walk",
      direction: this.event.direction,
      distance: this.event.distance,
      retry: true,
    });

    const completeHandler = (e: any) => {
      if (e.detail.whoID === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
      }
    };

    document.addEventListener("PersonWalkingComplete", completeHandler);
  }

  dialog(resolve: any) {
    const textcompleteHandler = (e: any) => {
      console.log("done: ", e.detail.whoID, this.event.who);
      if (e.detail.whoID === this.event.who) {
        document.removeEventListener("DialogComplete", textcompleteHandler);
        this.state.cutscenes.isCutscenePlaying = false;
        resolve();
      }
    };

    this.state.cutscenes.isCutscenePlaying = true;
    this.state.dialog.dialogID = this.event.dialogId;
    document.addEventListener("DialogComplete", textcompleteHandler);
    this.state.dialog.dm.startDialog(this.event.dialogId);
  }
  /* 
  textMessage(resolve: any) {
    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppoDirection(this.map.gameObjects["hero"].direction);
    }

    const msg = new TextMessage({
      text: this.event.text,
      onComplete: () => {
        resolve();
      },
    });

    msg.init(document.querySelector(".game-container"));
  }

  changeMap(resolve: any) {
    const sceneTransition = new SceneTransition();
    sceneTransition.init(document.querySelector(".game-container"), () => {
      this.map.overworld.startMap(window.OverworldMaps[this.event.map], {
        x: this.event.x,
        y: this.event.y,
        direction: this.event.direction,
      });
      resolve();

      sceneTransition.fadeOut();
    });
  }

  battle(resolve: any) {
    
    const battle = new Battle({
      enemy: Enemies[this.event.enemyId],
      onComplete: () => {
        resolve();
      },
    });
    battle.init(document.querySelector(".game-container"));
  }

  pause(resolve: any) {
    this.map.isPaused = true;
    
    const menu = new PauseMenu({
      progress: this.map.overworld.progress,
      onComplete: () => {
        resolve();
        this.map.isPaused = false;
        this.map.overworld.startGameLoop();
      },
    });
    menu.init(document.querySelector(".game-container"));
  }

  addStoryFlag(resolve: any) {
    window.playerState.storyFlags[this.event.flag] = true;
    resolve();
  }

  craftingMenu(resolve: any) {
    const menu = new CraftingMenu({
      pizzas: this.event.pizzas,
      onComplete: () => {
        resolve();
      },
    });
    menu.init(document.querySelector(".game-container"));
  } */

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve);
    });
  }
}
