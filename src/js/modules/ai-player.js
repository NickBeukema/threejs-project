import { gridWidth, gridLength, gridSubDiv } from './constants';
import smartAI from '../ai/smart-ai';
import defensiveAI from '../ai/defensive-ai';
import randomAI from '../ai/random-ai';

export default class AI {

  constructor(args) {
    this.smartAI = smartAI;
    this.defensiveAI = defensiveAI;
    this.randomAI = randomAI;
    this.determineAIFunction(args.personality);
    this.player = args.player;
    this.spawnInterval = 325;
    this.lastUpgrade = 0;
    this.upgradeInterval = 1500;
    this.lastSpawn = 0;
    this.poppulationLimit = 30;
  }

  canSpawn(timestamp) {
    return timestamp - this.lastSpawn > this.spawnInterval && this.player.minions.length < this.poppulationLimit;
  }

  canUpgrade(timestamp) {
    return timestamp - this.lastUpgrade > this.upgradeInterval;
  }

  runLoop(timestamp, opponents) {
    if(this.canUpgrade(timestamp)) {
      this.applyUpgrades(this.checkUpgrades());
      this.lastUpgrade = timestamp;
    }

    if(!this.canSpawn(timestamp)) { return; }

    let spawnIndex = this.AIFunction(opponents, this.player.minions, this.player.spawnPos);

    if(spawnIndex >= 0) {
      this.player.spawnMinion(spawnIndex);
      this.lastSpawn = timestamp;
    }
  }

  determineAIFunction(personality) {
    if(personality) {
      this.AIFunction = this[personality];
    } else {
      this.AIFunction = this["randomAI"];
    }
  }

  //check all upgradeCosts to see if any can be upgrades returns a list of what can be upgraded and their cost
  checkUpgrades() {
    let upgrades = [];

    if(this.player.canUpgradeBaseHealth()) {
      upgrades.push({name: "upgradeBaseHealth", cost:this.player.getBaseHealthUpgradeCost()});
    }

    if(this.player.canUpgradeMinionHealth()) {
      upgrades.push({name: "upgradeMinionHealth", cost: this.player.getMinionHealthUpgradeCost()});
    }

    if(this.player.canUpgradeMinionAttack()) {
      upgrades.push({name: "upgradeMinionAttack", cost: this.player.getMinionAttackUpgradeCost()});
    }

    if(this.player.canUpgradeMinionAttackSpeed()) {
      upgrades.push({name: "upgradeMinionAttackSpeed", cost: this.player.getMinionAttackSpeedUpgradeCost()});
    }

    if(this.player.canUpgradeWizardAttack()) {
      upgrades.push({name: "upgradeWizardAttack", cost: this.player.getWizardAttackUpgradeCost()});
    }

    if(this.player.canUpgradeWizardAttackSpeed()) {
      upgrades.push({name: "upgradeWizardAttackSpeed", cost: this.player.getWizardAttackSpeedUpgradeCost()});
    }
    
    return upgrades;
  }

  applyUpgrades(upgrades) {
    upgrades.forEach((upgrade) => {
      if((this.player.money / 1.5) > upgrade.cost && this.player.money > 750) {
        let fn = this.player[upgrade.name];
        fn.apply(this.player);
      }
    });
  }
}
