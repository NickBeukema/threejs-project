import Minion from './minion';
import Archer from './archer';
import Base from './base';
import { gridWidth, gridSubDiv } from './constants';
import Constants from './constants';

export default class Player {

  constructor(args) {
    this.type = args.type;
    this.id = args.id;
    this.direction = args.direction;
    this.colliderList = args.colliderList;
    this.colliderSystem = args.colliderSystem;
    this.scene = args.scene;
    this.minionId = 0;
    this.spawnPos = -gridWidth / 2 * this.direction;
    this.poppulationCap = 30;

    this.setUpgradeValues();
    this.loader = new THREE.ObjectLoader();

    this.setupGameState();
    this.spawnBase();
    this.spawnArchers();
  }

  spawnArchers() {
    let archer = new Archer({ 
      scene: this.scene, 
      colliderList: this.colliderList, 
      startingZ: 2, 
      startingY: 20, 
      startingX: this.spawnPos, 
      direction: this.direction, 
      player: this 
    });

    this.archers.push(archer);

    this.loader.load('./geometry/wizard.json', (obj) => {
      obj.position.y = -4;
      archer.viewObj.add(obj);

      archer.bodyModel = archer.viewObj.children[2];
      archer.rightArm = archer.bodyModel.children[1];
      archer.rightArm.rotation.z = (135 / 180) * Math.PI;
      if(archer.direction === -1) {
        archer.viewObj.children[2].rotation.y = Math.PI;
        archer.startingRotation = Math.PI;
      }

      this.scene.add(archer.viewObj);
    });
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
    if(this.minions.length <= this.poppulationCap) {
      if(this.money >= this.minionCost) {
        if(!this.gameOver) {
          this.money -= this.minionCost;
        }

        let minion = new Minion({
          id: this.minionId++,
          healthUpgrade: this.upgrades.minionBaseHealth,
          attackUpgrade: this.upgrades.minionBaseAttack,
          attackSpeedUpgrade: this.upgrades.minionBaseAttackSpeed,
          playerId: this.id,
          direction: this.direction,
          startingZ: index,
          colliderList: this.colliderList,
          player: this
        });

        this.minions.push(minion);
        this.loader.load('./geometry/model.json', (obj) => {
          obj.position.y = -4;
          minion.viewObj.add(obj);

          if(minion.direction === -1) {
            minion.viewObj.children[1].rotation.y = Math.PI;
          }

          this.scene.add(minion.viewObj);
        });
      }
    }
  }

  processReward(reward) {
    if(this.gameOver) { return; }
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

    this.archers.forEach((archer) => {
      archer.runLoop(timestamp);
    });

    this.minions.forEach((minion, index) => {
      minion.runLoop(timestamp);
      if(!minion.attack) { minion.resetAttackAnimation(); }
      if(minion.destroy) { this.destroyMinion(minion, index); }
    });

    this.colliderSystem.computeAndNotify(this.colliderList);
  }

  destroyMinion(minion, index) {
    this.scene.remove(minion.viewObj);

    this.colliderList.splice(this.findColliderIndex(minion.collider.id), 1);
    minion.collider.removeEventListener('contactEnter');
    minion.collider.removeEventListener('contactStay');
    minion.collider.removeEventListener('contactExit');
    minion.collider.removeEventListener('contactRemoved');
    this.minions.splice(index, 1);
  }

  destroyBase() {
    this.archers.forEach(archer => {
      this.scene.remove(archer.viewObj);
      this.colliderList.splice(this.findColliderIndex(archer.collider.id), 1);
    });
    this.archers.length = 0;
    
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

  setGameOver() {
    this.gameOver = true;
  }

  reset() {
    this.minions.forEach(minion => {
      this.scene.remove(minion.viewObj);
    });

    if(this.base) {
      this.scene.remove(this.base.viewObj);
      this.base = null;
    }

    this.archers.forEach(archers => {
      this.scene.remove(archers.viewObj);
    });

    this.gameOver = false;
    this.setUpgradeValues();
    this.setupGameState();
    this.spawnBase();
    this.spawnArchers();
  }


  setupGameState() {
    this.minions = [];
    this.archers = [];
    this.score = 0;
    this.money = 4000;
    this.minionCost = 50;
    this.lost = false;
  }

  setUpgradeValues() {
    this.upgrades = {
      baseHealth: 0,
      minionBaseHealth: 0,
      minionBaseAttack: 0,
      minionBaseAttackSpeed: 0,
      archerBaseAttack: 0,
      archerBaseAttackSpeed: 0
    }
  }

  getBaseHealthUpgradeCost() {
    return Constants.base.upgrades.health.cost * (this.upgrades.baseHealth + 1);
  }

  canUpgradeBaseHealth() {
    return this.money > this.getBaseHealthUpgradeCost();
  }

  upgradeBaseHealth() {
    if(this.canUpgradeBaseHealth()) {
      this.upgrades.baseHealth++;
      this.base.maxHealth += Constants.base.upgrades.health.amount;
      this.base.health += Constants.base.upgrades.health.amount;
      this.money -= Constants.base.upgrades.health.cost * this.upgrades.baseHealth;
    }
  }

  getMinionHealthUpgradeCost() {
    return Constants.minion.upgrades.health.cost * (this.upgrades.minionBaseHealth + 1);
  }

  canUpgradeMinionHealth() {
    return this.money > this.getMinionHealthUpgradeCost();
  }

  upgradeMinionHealth() {
    if(this.canUpgradeMinionHealth()) {
      this.upgrades.minionBaseHealth++;
      this.money -= Constants.minion.upgrades.health.cost * this.upgrades.minionBaseHealth;
    }
  }

  getMinionAttackUpgradeCost() {
    return Constants.minion.upgrades.attack.cost * (this.upgrades.minionBaseAttack + 1);
  }

  canUpgradeMinionAttack() {
    return this.money > this.getMinionAttackUpgradeCost();
  }

  upgradeMinionAttack() {
    if(this.canUpgradeMinionAttack()) {
      this.upgrades.minionBaseAttack++;
      this.money -= Constants.minion.upgrades.attack.cost * this.upgrades.minionBaseAttack;
    }
  }

  getMinionAttackSpeedUpgradeCost() {
    return Constants.minion.upgrades.attackSpeed.cost * (this.upgrades.minionBaseAttackSpeed + 1);
  }

  canUpgradeMinionAttackSpeed() {
    return this.money > this.getMinionAttackSpeedUpgradeCost();
  }

  upgradeMinionAttackSpeed() {
    if(this.canUpgradeMinionAttackSpeed()) {
      this.upgrades.minionBaseAttackSpeed++;
      this.money -= Constants.minion.upgrades.attackSpeed.cost * this.upgrades.minionBaseAttackSpeed++;
    }
  }

  getWizardAttackUpgradeCost() {
    return Constants.archer.upgrades.attack.cost * (this.upgrades.archerBaseAttack + 1);
  }

  canUpgradeWizardAttack() {
    return this.money > this.getWizardAttackUpgradeCost();
  }

  upgradeWizardAttack() {
    if(this.canUpgradeWizardAttack()) {
      this.archers.forEach((archer) => {
        archer.attackStrength += Constants.archer.upgrades.attack.amount;
      });

      this.upgrades.archerBaseAttack++;
      this.money -= Constants.archer.upgrades.attack.cost * this.upgrades.archerBaseAttack;
    }
  }

  getWizardAttackSpeedUpgradeCost() {
    return Constants.archer.upgrades.attackSpeed.cost * (this.upgrades.archerBaseAttackSpeed + 1) ;
  }

  canUpgradeWizardAttackSpeed() {
    return this.money > this.getWizardAttackSpeedUpgradeCost();
  }

  upgradeWizardAttackSpeed() {
    if(this.canUpgradeWizardAttackSpeed()) {
      this.archers.forEach((archer) => {
        archer.attackSpeed -= Constants.archer.upgrades.attackSpeed.amount;
        archer.arrowSpeed -= Constants.archer.upgrades.attackSpeed.amount;
      });

      this.upgrades.archerBaseAttackSpeed++;
      this.money -= Constants.archer.upgrades.attackSpeed.cost * this.upgrades.archerBaseAttackSpeed;
    }
  }
}
