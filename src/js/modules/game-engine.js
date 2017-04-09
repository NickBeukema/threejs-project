import Player from './player';

export default class GameEngine {

  constructor() {
    this.state = {};
    this.initializePlayers();
    this.initializeShapes();
  }

  initializePlayers() {
    this.state.players = [
      new Player({type: 'human'}), new Player({type: 'computer'})
    ];
  }

  initializeShapes() {
    this.shapes = [
      { rotation: {
          x: 0,
          y: 0
        }
      }
    ]
  }

  gameLoop() {
    this.shapes[0].rotation.x += 0.01;
    this.shapes[0].rotation.y += 0.01;
  }
}
