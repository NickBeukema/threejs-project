import Player from './player';
import AI from './ai-player';
import { xPositive, xNegative, gridSubDiv } from './constants';

export default class GameEngine {
  constructor(args) {
    this.state = {};
    this.scene = args.scene;
    this.colliderSystem = new THREEx.ColliderSystem();
    this.colliderList = [];

    this.playerId = 0;

    this.initializePlayers();
  }

  initializePlayers() {
    this.myPlayer = new Player({
      type: 'human',
      direction: xPositive,
      colliderList: this.colliderList,
      scene:this.scene,
      id: this.playerId++
    });

    this.computer = new Player({
      type: 'computer',
      direction: xNegative,
      colliderList: this.colliderList,
      scene: this.scene,
      id: this.playerId++
    });

    this.AI = new AI({
      player: this.computer
    });

    this.playerAI = new AI({
      player: this.myPlayer
    });


    this.state.players = [ this.myPlayer, this.computer ];
  }

  gameLoop(timestamp) {
    if(this.AI) {
      this.AI.runLoop(timestamp);
    }

    if(this.playerAI) {
      this.playerAI.runLoop(timestamp);
    }
    this.state.players.forEach(player => player.runLoop(timestamp));
    this.colliderSystem.computeAndNotify(this.colliderList);
  }
}
