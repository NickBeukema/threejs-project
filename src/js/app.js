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

  gameEngine = new GameEngine();
  gameView = new GameView(globals, gameEngine);


  scoreText = document.getElementById('score');
  moneyText = document.getElementById('money');


  window.addEventListener('click', () => {
    let minion = gameEngine.myPlayer.spawnMinion();
    if(minion) {
      scene.add(minion.viewObj);
    }
  });

  window.addEventListener('keypress', () => {
    let minion = gameEngine.computer.spawnMinion();
    if(minion) {
      scene.add(minion.viewObj);
    }
  });

  render();
}


function render() {
  requestAnimationFrame(render);
  gameView.renderLoop();

  updateUI();

  globals.renderer.render(globals.scene, globals.camera);
}

function updateUI() {
  scoreText.textContent = gameEngine.myPlayer.score;
  moneyText.textContent = gameEngine.myPlayer.money;
}

init();
