export default class MapManager {
  template = ``;
  state;

  constructor(state: any) {
    this.state = state;
    this.template = `
    <div class="map" \${m<=*map.selectMap:id} style="transform: translate( \${m.x}px, \${m.y}px); background-image: url(\${m.src}); width: \${m.w}px; height: \${m.h}px; z-index: \${m.z};">
      <div class="wall" \${w<=*m.walls} style="transform: translate( \${w.x}px, \${w.y}px); width: \${w.w}px; height: \${w.h}px; z-index: 6; ">
      </div>
    </div>
    `;
  }

  loadMap(name: string, configObject: Array<object>) {
    if (this.state.map.maps[name]) return;
    this.state.map.maps[name] = [];
    configObject.forEach((element: any) => {
      this.state.map.maps[name].push(element);
    });
  }

  switchMap(name: string) {
    if (this.state.map.maps[name]) {
      this.state.map.currentMap = name;
    }
  }
}
