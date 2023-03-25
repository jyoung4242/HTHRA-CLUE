import objectManager from "./objects";

export type mapConfig = {
  config: mapConfigData;
  layers: Array<object>;
};

export type mapConfigData = {
  walls: Array<wallConfig>;
  triggers: Array<object>;
};

export type wallConfig = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export default class MapManager {
  template = ``;
  state;
  objects: any = undefined;

  constructor(state: any) {
    this.state = state;
    this.objects = new objectManager(state);
    this.template = `
    <div class="map" \${m<=*map.selectMap:id} style="transform: translate( \${m.x}px, \${m.y}px); background-image: url(\${m.src}); width: \${m.w}px; height: \${m.h}px; z-index: \${m.z};"></div>
    <div class="walls" \${===map.showWalls}>
      <div class="wall" \${w<=*map.getWalls} style="transform: translate( \${w.x}px, \${w.y}px); width: \${w.w}px; height: \${w.h}px; z-index: 6; "></div>
    </div>
    <div class="triggers" \${===map.showTriggers}>
      <div class="trigger" \${w<=*map.getTriggers} style="transform: translate( \${w.x}px, \${w.y}px); width: \${w.w}px; height: \${w.h}px; z-index: 6; "></div>
    </div>
    `;
  }

  loadMap(name: string, configObject: mapConfig) {
    if (this.state.map.maps[name]) return;
    this.state.map.maps[name] = [];
    this.state.map.configs[name] = configObject.config;
    configObject.layers.forEach((element: any) => {
      this.state.map.maps[name].push(element);
    });
  }

  switchMap(name: string) {
    console.log(this.state.map.maps[name]);

    if (this.state.map.maps[name]) {
      console.log(name);
      this.state.map.currentMap = name;
    }
  }
}
