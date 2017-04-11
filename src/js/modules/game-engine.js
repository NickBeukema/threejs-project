import Player from './player';
import { xPositive, xNegative } from './constants';

export default class GameEngine {
  constructor(args) {
    this.state = {};
    this.scene = args.scene;
    this.colliderSystem = new THREEx.ColliderSystem();
    this.colliderList = []

    this.initializePlayers();
  }

  initializePlayers() {
    this.myPlayer = new Player({
      type: 'human',
      direction: xPositive,
      colliderList: this.colliderList,
      scene:this.scene
    });

    this.computer = new Player({
      type: 'computer',
      direction: xNegative,
      colliderList: this.colliderList,
      scene: this.scene
    });

    this.state.players = [ this.myPlayer, this.computer ];
  }

  gameLoop(timestamp) {
    this.state.players.forEach(player => player.runLoop(timestamp));
    this.colliderSystem.computeAndNotify(this.colliderList);
  }
}