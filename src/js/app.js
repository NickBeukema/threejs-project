import { setupScreenView } from './modules/view';
import GameEngine from './modules/game-engine';
import GameView from './modules/game-view';

// Globals
let globals;

let gameEngine, gameView;

// Shapes
var cube;

function init() {
  let { scene, camera, renderer } = setupScreenView();
  globals = { scene, camera, renderer };

  gameEngine = new GameEngine();
  gameView = new GameView(globals);

  render();
}

function render() {
  requestAnimationFrame(render);
  gameView.renderLoop();
  globals.renderer.render(globals.scene, globals.camera);
}

init();
