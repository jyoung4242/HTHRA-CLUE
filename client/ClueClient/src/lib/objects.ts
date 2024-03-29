export default class objectManager {
  template = ``;
  state;

  constructor(state: any) {
    this.state = state;
    this.template = `
      <div class="\${o.type}" \${o<=*renderedObjects:id} style="transform: translate( \${o.x}px, \${o.y}px); background-image: url(\${o.src});background-size: \${o.bgndw}px \${o.bgndh}px; background-position: -\${o.sprtposX}px -\${o.sprtposY}px; width: \${o.w}px; height: \${o.h}px; z-index: \${o.z};">
        <div class="shadow" \${===o.shadow}></div>
        <div class="emote" \${===o.emote} style="background-image: url(\${o.emoteSrc});"></div>
        <div class="collisionbox" \${===o.borderbox.enabled} style="transform: translate( \${o.borderbox.x}px, \${o.borderbox.y}px);width: \${o.borderbox.w}px; height: \${o.borderbox.h}px;"></div>
      </div>
      `;
  }
}
