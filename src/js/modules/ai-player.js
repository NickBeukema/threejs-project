import { gridWidth, gridLength, gridSubDiv } from './constants';

export default class AI {

  constructor(args) {
    this.determineAIFunction(args.personality);
    this.player = args.player;
    this.spawnInterval = 1;
    this.lastSpawn = 0;
  }

  canSpawn(timestamp) {
    return timestamp - this.lastSpawn > this.spawnInterval;
  }

  runLoop(timestamp, opponents) {
    if(!this.canSpawn(timestamp)) { return; }

    let spawnIndex = this.AIFunction(opponents);

    if(spawnIndex >= 0) {
      this.player.spawnMinion(spawnIndex);
      this.lastSpawn = timestamp;
    }
  }

  randomAI(opponents) {
    return Math.floor(Math.random() * gridSubDiv);
  }

  defensiveAI(opponents) {
    let map = {};
    for(let i = 0; i < gridSubDiv; i++) {
      map[i] = 0;
    }

    opponents.forEach((enemy) => {
      map[enemy.startingZ]--;
    });

    this.player.minions.forEach((minion) => {
      map[minion.startingZ]++
    });

    let spawnIndex = -1;
    let spawnValue = 100000;
    Object.values(map).forEach((val, index) => {
      if(val < spawnValue) {
        spawnValue = val;
        spawnIndex = index
      }
    });

    return spawnIndex;
  }

  determineAIFunction(personality) {
    if(personality) {
      this.AIFunction = this[personality];
    } else {
      this.AIFunction = this["randomAI"];
    }
  }
}
