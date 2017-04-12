let modal = document.getElementById('modal');
let startSection = document.getElementById('startModal');
let restartSection = document.getElementById('restartModal');
function activateStartScreen() {
  startSection.classList.add('modal--visible');
  restartSection.classList.remove('modal--visible');
}

function activateRestartScreen(winner) {
  startSection.classList.remove('modal--visible');
  restartSection.classList.add('modal--visible');
}

export function activateMenu(args) {
  modal.classList.add('modal--visible');

  if(args.winner !== null) {
    activateRestartScreen(args.winner);
  } else {
    activateStartScreen();
  }
}

export function closeMenu(args) {
  modal.classList.remove('modal--visible');
}

export function bindButtons(gameEngine) {
  startSection.addEventListener('click', () => {

  });

  restartSection.addEventListener('click', () => {
    gameEngine.restart();
    closeMenu();
  });
}
