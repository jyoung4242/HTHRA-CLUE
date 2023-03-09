export default class GameMap {
  src = ``;
  w = 0;
  h = 0;
  constructor(w: number, h: number, src: string) {
    this.w = w;
    this.h = h;
    this.src = src;
  }
}
