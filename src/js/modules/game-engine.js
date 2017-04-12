import Player from './player';
import AI from './ai-player';
import { activateMenu } from './menu-screen';
import { xPositive, xNegative, gridSubDiv } from './constants';

export default class GameEngine {
  constructor(args) {
    this.state = {};
    this.scene = args.scene;
    this.camera = args.camera;

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

    //this.AI = new AI({
      //player: this.computer,
      //personality: "defensiveAI"
    //});

     //this.playerAI = new AI({
       //player: this.myPlayer
     //});


    this.state.players = [ this.myPlayer, this.computer ];
  }

  initializeGameOver() {
    activateMenu({
      winner: this.winner
    })
  }

  restart() {
    while(this.colliderList.length > 0) {
      this.colliderList.pop();
    }
    this.state.players.forEach(player => {
      player.reset();
    });
    this.gameOver = false;
  }

  gameLoop(timestamp) {
    if(this.gameOver) {
    }
    if(this.AI) {
      this.AI.runLoop(timestamp, this.myPlayer.minions);
    }

    if(this.playerAI) {
      this.playerAI.runLoop(timestamp, this.computer.minions);
    }
    this.state.players.forEach(player => {
      player.runLoop(timestamp);
      if(player.lost && !this.gameOver) {
        this.gameOver = true;
        this.winner = player.id !== this.myPlayer.id;
        this.initializeGameOver();
      }
    });
    this.colliderSystem.computeAndNotify(this.colliderList);
  }
}
