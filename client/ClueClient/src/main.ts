import "./style.css";
import { UI } from "@peasy-lib/peasy-ui";

import State from "./state/state";
import Viewport from "./lib/viewport";
import HathoraInterface from "./lib/hathora";
import KeyboardManagement from "./lib/keyboard";

const model = new State().state;
const viewport = new Viewport(800, 600, model);
const networkConnection = new HathoraInterface(model);
const keyboardmgr = new KeyboardManagement(model);

const template = `
<div class="app">
  ${viewport.template}
</div>
`;

UI.create(document.body, template, model);
UI.initialize(1000 / 60);
console.log(model);

setInterval(() => {
  model.objects.forEach((obj: any) => {
    obj.update();
  });
  viewport.update();
}, 50);
