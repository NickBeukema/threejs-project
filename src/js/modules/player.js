import Minion from './minion';

export default class Player {

  constructor(args) {
    this.type = args.type;
    this.id = args.id;
    this.direction = args.direction;
    this.colliderList = args.colliderList;
    this.scene = args.scene;
    this.minionId = 0;

    this.setupGameState();
  }

  spawnMinion(index) { 
    if(this.money >= this.minionCost) {
      this.money -= this.minionCost;

      let minion = new Minion({
        id: this.minionId++,
        playerId: this.id,
        direction: this.direction,
        startingZ: index,
        colliderList: this.colliderList,
        player: this
      });

      this.minions.push(minion);
      return minion;
    } else {
      return null;
    }
  }

  processReward(reward) {
    let t = this;
    Object.keys(reward).forEach((key) => {
      t[key] += reward[key];
    });
  }

  runLoop(timestamp) {
    this.minions.forEach((minion, index) => {
      minion.runLoop(timestamp);
      if(minion.destroy) {
        this.scene.remove(minion.viewObj);

        console.log(index, this.findColliderIndex(minion.collider.id));
        this.colliderList.splice(this.findColliderIndex(minion.collider.id), 1);

        let a = this.minions.splice(index, 1);
      }
    }); 
  }

  findColliderIndex(id) {
    let index = -1;

    for (var i = 0; i < this.colliderList.length; i++) {
      if(this.colliderList[i].id === id) {
        index = i;
      }
    }

    return index;
  }

  setupGameState() {
    this.minions = [];
    this.score = 0;
    this.money = 400;
    this.minionCost = 20;
  }
}
