import GameObjects from "./objects";
import Sprite from "./sprite";

export default class PlayableObject extends GameObjects {
  sprite: Sprite | null = null;
  constructor(x: number, y: number, w: number, h: number) {
    super(x, y, w, h);
    this.sprite = new Sprite();
  }
}
