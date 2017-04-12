import Minion from './minion';
import Base from './base';

export default class Player {

  constructor(args) {
    this.type = args.type;
    this.id = args.id;
    this.direction = args.direction;
    this.colliderList = args.colliderList;
    this.scene = args.scene;
    this.minionId = 0;

    this.setupGameState();
    this.spawnBase();
  }

  spawnBase() {
    this.base = new Base({
      direction: this.direction,
      colliderList: this.colliderList,
      player: this
    });

    this.scene.add(this.base.viewObj);
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
      this.scene.add(minion.viewObj);
    }
  }

  processReward(reward) {
    let t = this;
    Object.keys(reward).forEach((key) => {
      t[key] += reward[key];
    });
  }

  runLoop(timestamp) {
    if(this.base !== null) { 
      this.base.runLoop();
      if(this.base.destroy) { this.destroyBase(); } 
    }

    this.minions.forEach((minion, index) => {
      minion.runLoop(timestamp);
      if(minion.destroy) { this.destroyMinion(minion, index); }
    });
  }

  destroyMinion(minion, index) {
    this.scene.remove(minion.viewObj);

    this.colliderList.splice(this.findColliderIndex(minion.collider.id), 1);

    this.minions.splice(index, 1);
  }

  destroyBase() {
    this.scene.remove(this.base.viewObj);
    this.colliderList.splice(this.findColliderIndex(this.base.collider.id), 1);
    this.base = null;
    this.lost = true;
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

  reset() {
    this.minions.forEach(minion => {
      this.scene.remove(minion.viewObj);
    });

    if(this.base) {
      this.scene.remove(this.base.viewObj);
      this.base = null;
    }

    this.spawnBase();
    this.setupGameState();
  }


  setupGameState() {
    this.minions = [];
    this.score = 0;
    this.money = 400;
    this.minionCost = 20;
    this.lost = false;
  }
}
