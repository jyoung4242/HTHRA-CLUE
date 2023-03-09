import "./style.css";
import { UI } from "@peasy-lib/peasy-ui";
import State from "./state/state";
import Viewport from "./lib/viewport";
import HathoraInterface from "./lib/hathora";

const model = new State().state;
const viewport = new Viewport(800, 600, model);
const networkConnection = new HathoraInterface(model);

const template = `
<div class="app">
  ${viewport.template}
</div>
`;

UI.create(document.body, template, model);
UI.initialize(1000 / 60);
console.log(model);

/*

"demo":[
  {{
    id:0,
    w: 192,
    h: 192,
    src: string
  },
  {
    id:1
    w: 192,
    h: 192,
    src: string
  },
}
]

*/
