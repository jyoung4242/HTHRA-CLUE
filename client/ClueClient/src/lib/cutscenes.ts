import OverworldEvent from "./OverworldEvent";

export default class CutsceneManager {
  id: any;
  actions: any;
  actionLoopIndex = 0;
  state;
  constructor(actions: Array<object>, state: any) {
    this.actions = actions;
    this.state = state;
  }

  startCutscene() {
    this.state.cutscenes.isCutscenePlaying = true;
    if (this.actions.length) this.doActionEvents();
  }

  async doActionEvents() {
    let eventConfig = this.actions[this.actionLoopIndex];
    eventConfig.who = this.id;
    const eventHandler = new OverworldEvent({ state: this.state.state, event: eventConfig });
    await eventHandler.init();

    this.actionLoopIndex += 1;
    if (this.actionLoopIndex === this.actions.length) {
      this.cutSceneComplete();
      return;
    }
    this.doActionEvents();
  }

  cutSceneComplete() {
    this.state.cutscenes.isCutscenePlaying = false;
    this.state.objects.forEach((o: any) => {
      if (o.behaviorLoop.length) o.doBehaviorEvent();
      else {
        o.status = "idle";
        o.direction = "down";
      }
    });
  }
}