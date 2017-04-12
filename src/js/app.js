import { setupScreenView } from './modules/view';
import GameEngine from './modules/game-engine';
import GameView from './modules/game-view';

// Globals
let globals;

let gameEngine, gameView;

// UI Elements
let scoreText, moneyText;

// Shapes
var cube;

function init() {
  let { scene, camera, renderer } = setupScreenView();
  globals = { scene, camera, renderer };

  gameEngine = new GameEngine(globals);
  gameView = new GameView(globals, gameEngine);

  scoreText = document.getElementById('score');
  moneyText = document.getElementById('money');

  window.addEventListener('click', () => {
    let index = gameView.getCurrentPanelIndex();
    if(index >= 0) {
      gameEngine.myPlayer.spawnMinion(index);
    }
  });

  window.addEventListener('keypress', () => {
    gameEngine.computer.spawnMinion(3);
  });

  render();
}


function render(timestamp) {
  requestAnimationFrame(render);
  gameView.renderLoop(timestamp);

  updateUI();

  globals.renderer.render(globals.scene, globals.camera);
}

function updateUI() {
  scoreText.textContent = gameEngine.myPlayer.score;
  moneyText.textContent = gameEngine.myPlayer.money;
}

init();
