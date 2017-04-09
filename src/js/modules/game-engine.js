import Player from './player';
import { xPositive, xNegative } from './constants';

export default class GameEngine {

  constructor() {
    this.state = {};
    this.initializePlayers();
  }

  initializePlayers() {
    this.myPlayer = new Player({type: 'human', direction: xPositive});
    this.computer = new Player({type: 'computer', direction: xNegative});
    this.state.players = [ this.myPlayer, this.computer ];
  }

  gameLoop() {
    this.state.players.forEach(player => player.runLoop());
  }
}
