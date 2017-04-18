import {
  setupScreenView, setupPerformance
} from './modules/view';

import GameEngine from './modules/game-engine';
import GameView from './modules/game-view';

// Globals
let globals;

let gameEngine, gameView;
let rendererStats;
let performance = false;

function init() {
  let { scene, camera, renderer } = setupScreenView();
  globals = { scene, camera, renderer };

  if(performance) {
    rendererStats = setupPerformance();
  }

  gameEngine = new GameEngine(globals);
  gameView = new GameView(globals, gameEngine);

  render();
}

function render(timestamp) {
  requestAnimationFrame(render);
  gameView.renderLoop(timestamp);

  globals.renderer.render(globals.scene, globals.camera);
  if(performance) {
    rendererStats.update(globals.renderer);
  }
}

init();
