import { gridWidth, gridLength, gridSubDiv } from '../modules/constants';

export default function(opponents) {
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