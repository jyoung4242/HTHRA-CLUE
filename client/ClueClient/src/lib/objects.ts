export default class objectManager {
  template = ``;
  state;

  constructor(state: any) {
    this.state = state;
    this.template = `
      <div class="\${o.type}" \${o<=*objects:id} style="transform: translate( \${o.x}px, \${o.y}px); background-image: url(\${o.src});background-size: \${o.bgndw}px \${o.bgndh}px; background-position: -\${o.sprtposX}px -\${o.sprtposY}px; width: \${o.w}px; height: \${o.h}px; z-index: \${o.z};">
        <div class="shadow" \${===o.shadow}></div>
      </div>
      `;
  }
}
