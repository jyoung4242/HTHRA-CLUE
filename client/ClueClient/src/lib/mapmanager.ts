export default class MapManager {
  template = ``;
  state;

  constructor(state: any) {
    this.state = state;
    this.template = `
    <div class="map" \${m<=*map.selectMap:id} style="background-image: \${m.src}; width: \${m.w}; height: \${m.h};">
    \${m.str}
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
