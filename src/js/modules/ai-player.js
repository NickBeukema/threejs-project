Array.prototype.unique = function() {
  return this.filter(function (value, index, self) { 
    return self.indexOf(value) === index;
  });
}

import { gridWidth, gridLength, gridSubDiv } from './constants';

export default class AI {

  constructor(args) {
    this.determineAIFunction(args.personality);
    this.player = args.player;
    this.spawnInterval = 500;
    this.lastSpawn = 0;
    this.poppulationLimit = 1;
  }

  canSpawn(timestamp) {
    return timestamp - this.lastSpawn > this.spawnInterval;
  }

  runLoop(timestamp, opponents) {
    if(!this.canSpawn(timestamp)) { return; }

    let spawnIndex = this.AIFunction(opponents, this.player.minions);

    if(spawnIndex >= 0 && this.player.minions.length < this.poppulationLimit) {
      this.player.spawnMinion(spawnIndex);
      this.lastSpawn = timestamp;
    }
  }

  randomAI(opponents) {
    return Math.floor(Math.random() * gridSubDiv);
  }

  nicksAI(opponents, friendlies) {
    let startingPos = this.player.spawnPos;

    let friendlyMap = friendlies.map(m => {
      return {
        row: m.startingZ,
        distance: m.getPosition().x - startingPos
      }
    });

    let opponentMap = opponents.map(m => {

      let distance = startingPos - m.getPosition().x;
      return {
        row: m.startingZ,
        distance: distance
      };
    });

    let rowArray = [];
    for(let i = 0; i < gridSubDiv; i++) { rowArray.push(i); }

    let decision = {
      hasFriendlies: [],
      closestIndex: -1,
      closestVal: 99999,
      distanceTies: []

    };

    friendlyMap.forEach((val, idx) => {
      decision.hasFriendlies.push(val.row);
    });


    opponentMap.forEach((val, idx) => {
      if(val.distance < decision.closestVal) {
        decision.closestIndex = val.row;
        decision.closestVal = val.distance;

        if(decision.distanceTies.length > 0) {
          decision.distanceTies.length = 0;
        }
      } else if(val.distance === decision.closestVal) {
        decision.distanceTies.push(val.row);
      }
    });

    decision.distanceTies.push(decision.closestIndex);
    decision.hasFriendlies = decision.hasFriendlies.unique();

    let fullIdxArr = rowArray.slice(0);

    decision.gaps = fullIdxArr.filter(x => {
      return decision.hasFriendlies.indexOf(x) < 0;
    });


    //if(friendlies.length > 3) {
      //friendlies[2].viewObj.position.z += 1;
    //}


    let arrayToUse;
    if(decision.closestVal < gridWidth/2) {
      arrayToUse = decision.distanceTies;
    } else {
      arrayToUse = decision.gaps;
    }

    console.log(decision);

    let arrIdx = Math.floor(Math.random() * arrayToUse.length);
    return arrayToUse[arrIdx];

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
