import Player from './player';

export default class GameEngine {

  constructor() {
    this.state = {};
    this.initializePlayers();
  }

  initializePlayers() {
    this.state.players = [
      new Player({type: 'human'}), new Player({type: 'computer'})
    ];
  }
}
