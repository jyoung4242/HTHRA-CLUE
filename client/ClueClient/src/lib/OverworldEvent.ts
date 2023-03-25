type OverworldEventType = "walk" | "stand" | "console" | "dialog";

type OverworldEventParam = {
  who: number;
  type: OverworldEventType;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
  distance?: number;
  text?: string;
  dialogId: string;
  emoteType: string;
  wait: boolean;
  magnitude: number;
  interval: number;
  shaketype: string;
  flag: any;
  newMap: string;
  startingLocation: { x: number; y: number };
};

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

  cameraShake(resolve: any) {
    console.log("here");
    //shake(shakeType: ShakeDirection, magnitude: number, duration: number, interval: number)

    const completeHandler = (e: any) => {
      console.log("done");

      document.removeEventListener("cameraShakeComplete", completeHandler);
      resolve();
    };

    document.addEventListener("cameraShakeComplete", completeHandler);
    this.state.camera.camera.shake(this.event.shaketype, this.event.magnitude, this.event.duration, this.event.interval);
  }

  cameraflash(resolve: any) {
    console.log("here");
    this.state.camera.camera.flash();
    resolve();
  }

  dialog(resolve: any) {
    const textcompleteHandler = (e: any) => {
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

  setStoryFlag(resolve: any) {
    this.state.storyFlags[this.event.flag] = true;
    resolve();
  }

  async changeMap(resolve: any) {
    this.state.cutscenes.isCutscenePlaying = true;
    const who: any = this.state.objects[this.event.who];
    const newmap = this.event.newMap;
    const startingX = this.event.startingLocation.x;
    const startingY = this.event.startingLocation.y;
    console.log(newmap);

    this.state.viewport.maptransition = true;
    await sleep(0.3);
    this.state.camera.camera.mapManager.switchMap(newmap);
    //this.state.map.currentMap = newmap;

    who.map = newmap;
    who.x = startingX;
    who.y = startingY;
    who.direction = "down";
    who.status = "idle";
    await sleep(0.3);
    this.state.viewport.maptransition = false;
    resolve();
    this.state.cutscenes.isCutscenePlaying = false;
    console.log(this.state);
  }
  /*
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

  
   */

  emote(resolve: any) {
    const whoIndex = this.state.objects.findIndex((obj: any) => {
      return obj.id === this.event.who;
    });

    if (whoIndex < 0) {
      resolve();
      return;
    }
    const who = this.state.objects[whoIndex];
    const completeHandler = (e: any) => {
      if (e.detail.whoID === this.event.who) {
        document.removeEventListener("emoteComplete", completeHandler);
        resolve();
      }
    };
    document.addEventListener("emoteComplete", completeHandler);

    who.startBehavior({
      type: "emote",
      emoteType: this.event.emoteType,
      duration: this.event.duration,
      wait: this.event.wait,
    });
  }

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve);
    });
  }
}

async function sleep(seconds: number) {
  return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}
