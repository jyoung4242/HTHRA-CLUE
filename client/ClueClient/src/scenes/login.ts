export default class Lobby {
  template = ``;
  state = undefined;
  constructor(state: any) {
    this.state = state;
    this.template = `
    <div class="gamestate" \${=== routing.isLobby}>
        Lobby
    </div>
    `;
  }
}
