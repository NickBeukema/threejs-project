import Player from './player';
import AI from './ai-player';
import { activateMenu } from './menu-screen';
import { xPositive, xNegative, gridSubDiv } from './constants';

export default class GameEngine {
  constructor(args) {
    this.gameOver = true;
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
      colliderSystem: this.colliderSystem,
      scene:this.scene,
      id: this.playerId++
    });

    this.computer = new Player({
      type: 'computer',
      direction: xNegative,
      colliderList: this.colliderList,
      colliderSystem: this.colliderSystem,
      scene: this.scene,
      id: this.playerId++
    });

    this.AI = new AI({
      player: this.computer,
      personality: "randomAI"
    });

    this.playerAI = new AI({
      player: this.myPlayer,
      personality: "randomAI"
    });


    this.state.players = [ this.myPlayer, this.computer ];
  }

  initializeGameOver({ winner, score }) {
    this.state.players.forEach(p => p.setGameOver());
    activateMenu({
      winner: winner,
      score: score
    })
  }

  restart(difficulty=1, computers=1) {
    while(this.colliderList.length > 0) {
      this.colliderList.pop();
    }
    if(computers === 0) {
      this.AI = null;
      this.playerAI = null;
    } else if(computers === 1) {
      this.AI = new AI({
        player: this.computer,
        personality: "randomAI"
      });
      this.playerAI = null;
    } else if(computers === 2) {
      this.AI = new AI({
        player: this.computer,
        personality: "randomAI"
      });

      this.playerAI = new AI({
        player: this.myPlayer,
        personality: "randomAI"
      });
    }

    if(this.AI) {
      this.AI.setDifficulty(difficulty);
    }

    if(this.playerAI) {
      this.playerAI.setDifficulty(difficulty);
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
        let winner = this.state.players.find(p => p.id !== player.id);
        let score = winner.score;
        this.initializeGameOver({ winner, score });
      }
    });
    this.colliderSystem.computeAndNotify(this.colliderList);
  }
}
