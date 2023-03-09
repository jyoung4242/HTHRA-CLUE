import Camera from "./camera";

export default class Viewport {
  template = ``;
  state: any = undefined;
  camera: any = undefined;

  constructor(width: number, height: number, state: any) {
    this.state = state;
    this.camera = new Camera(state);
    this.template = `
    <div class="viewport" style="width: ${width}px; height: ${height}px;">
      <div style="position: relative; width:100%; height: 100%;">
        ${this.camera.template}
      </div>
    </div>
    `;
  }
}
