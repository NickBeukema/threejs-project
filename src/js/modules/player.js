import Minion from './minion';

export default class Player {

  constructor(args) {
    this.type = args.type;
    this.direction = args.direction;

    this.setupGameState();
  }

  spawnMinion(index) {
    if(this.money >= this.minionCost) {
      this.money -= this.minionCost;
      let minion = new Minion({direction: this.direction, startingZ: index});

      this.minions.push(minion);
      return minion;
    } else {
      return null;
    }
  }

  runLoop() {
    this.minions.forEach((minion, index) => {
      minion.runLoop();

      console.log(minion.viewObj.position.x);
      if(minion.viewObj.position.x > 35) {
        this.score += 20;
        this.money += 30;
        this.minions.splice(index, 1);
      }
    });
  }

  setupGameState() {
    this.minions = [];
    this.score = 0;
    this.money = 200;
    this.minionCost = 20;
  }
}
