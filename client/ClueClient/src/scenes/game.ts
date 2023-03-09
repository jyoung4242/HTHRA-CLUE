export default class Game {
  template = ``;
  state = undefined;
  constructor(state: any) {
    this.state = state;
    this.template = `
    <div class="gamestate" \${=== routing.isGame}>
        Game
    </div>
    `;
  }
}
