import Camera from "./camera";
import DialogManager from "./dialogue";

export default class Viewport {
  template = ``;
  state: any = undefined;
  camera: any = undefined;
  dialog: any = undefined;

  constructor(width: number, height: number, state: any) {
    this.state = state;
    this.camera = new Camera(state);
    this.state.dialog.dm = new DialogManager(state);
    this.template = `
    <div class="viewport" style="width: ${width}px; height: ${height}px;">
      <div style="position: relative; width:100%; height: 100%;">
        ${this.camera.template}
        ${this.state.dialog.dm.template}
      </div>
    </div>
    `;
    this.state.viewport.x = width;
    this.state.viewport.y = height;
  }

  update() {
    this.camera.update();
  }
}
