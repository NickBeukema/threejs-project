import { gridWidth, gridLength, gridSubDiv } from './constants';

export default class AI {

  constructor(args) {
    this.determineAIFunction(args.personality);
    this.player = args.player;
    this.spawnInterval = 1500;
    this.lastSpawn = 0;
  }

  canSpawn(timestamp) {
    return timestamp - this.lastSpawn > this.spawnInterval;
  }

  runLoop(timestamp) {
    if(!this.canSpawn(timestamp)) { return; }

    let spawnIndex = this.AIFunction();

    if(spawnIndex >= 0) {
      this.player.spawnMinion(spawnIndex);
      this.lastSpawn = timestamp;
    }
  }

  randomAI(opponents, friendlies) {
    return Math.floor(Math.random() * gridSubDiv);
  }

  determineAIFunction(personality) {
    if(personality) {
      this.AIFunction = this[personality];
    } else {
      this.AIFunction = this["randomAI"];
    }
  }
}
