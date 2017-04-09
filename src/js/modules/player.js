import Minion from './minion';

export default class Player {

  constructor(args) {
    this.type = args.type;
    this.direction = args.direction;

    this.setupGameState();
  }

  spawnMinion() {
    if(this.money >= this.minionCost) {
      this.money -= this.minionCost;
      let minion = new Minion({direction: this.direction, startingZ: this.tmp});
      this.tmp += 1;

      this.minions.push(minion);
      return minion;
    } else {
      return null;
    }
  }

  runLoop() {
    this.minions.forEach(minion => minion.runLoop());
  }

  setupGameState() {
    this.minions = [];
    this.score = 0;
    this.money = 200;
    this.minionCost = 20;
    this.tmp = 0;
  }
}
