import Player from './player';
import { xPositive, xNegative } from './constants';

export default class GameEngine {

  constructor() {
    this.state = {};

    this.colliderSystem = new THREEx.ColliderSystem();
    this.colliderList = []

    this.initializePlayers();
  }

  initializePlayers() {
    this.myPlayer = new Player({
      type: 'human',
      direction: xPositive,
      colliderList: this.colliderList
    });

    this.computer = new Player({
      type: 'computer',
      direction: xNegative,
      colliderList: this.colliderList
    });

    this.state.players = [ this.myPlayer, this.computer ];
  }

  gameLoop() {
    this.colliderSystem.computeAndNotify(this.colliderList);
    this.state.players.forEach(player => player.runLoop());
  }
}
