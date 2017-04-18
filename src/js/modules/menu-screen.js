let modal = document.getElementById('modal');
let startSection = document.getElementById('startModal');
let startButton = document.getElementById('startButton');
let restartSection = document.getElementById('restartModal');
let restartButton = document.getElementById('restartButton');
let restartModalMessage = document.getElementById('restartModalMessage');

function activateStartScreen() {
  startSection.classList.add('modal--visible');
  restartSection.classList.remove('modal--visible');
}

function activateRestartScreen(winner, score) {

  let text = `Player ${winner.id + 1} wins with a score of ${score}!`;
  restartModalMessage.textContent = text;

  startSection.classList.remove('modal--visible');
  restartSection.classList.add('modal--visible');
}

export function activateMenu(args) {
  modal.classList.add('modal--visible');

  if(args.winner !== null) {
    activateRestartScreen(args.winner, args.score);
  } else {
    activateStartScreen();
  }
}

export function closeMenu(args) {
  modal.classList.remove('modal--visible');
}

export function bindButtons(gameView, gameEngine) {
  startButton.addEventListener('click', () => {
    gameView.startFirstGame();
    closeMenu();
  });

  restartButton.addEventListener('click', () => {
    gameEngine.restart();
    closeMenu();
  });
}
