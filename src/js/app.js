import { setupScreenView } from './modules/view';
import GameEngine from './modules/game-engine';
import GameView from './modules/game-view';

// Globals
let globals;

let gameEngine, gameView;

// UI Elements
let scoreText, moneyText, fpsText;

// Shapes
var cube;

// performance
var rendererStats = new THREEx.RendererStats();
rendererStats.domElement.style.position = 'absolute'
rendererStats.domElement.style.left = '0px'
rendererStats.domElement.style.bottom = '0px'
document.body.appendChild( rendererStats.domElement )

function init() {
  let { scene, camera, renderer } = setupScreenView();
  globals = { scene, camera, renderer };

  gameEngine = new GameEngine(globals);
  gameView = new GameView(globals, gameEngine);

  scoreText = document.getElementById('score');
  moneyText = document.getElementById('money');
  fpsText = document.getElementById('fps');

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

let lastTimeStamp = 0;
function render(timestamp) {
  let delta = timestamp - lastTimeStamp;
  delta = delta / 1000;
  lastTimeStamp = timestamp;
  let fps = Math.round(1 / delta);
  requestAnimationFrame(render);
  gameView.renderLoop(timestamp);

  updateUI(fps);

  globals.renderer.render(globals.scene, globals.camera);
  rendererStats.update(globals.renderer);
}

function updateUI(fps) {
  scoreText.textContent = gameEngine.myPlayer.score;
  moneyText.textContent = gameEngine.myPlayer.money;
  fpsText.textContent = fps;
}

init();
