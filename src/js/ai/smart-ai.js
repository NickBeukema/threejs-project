import { gridWidth, gridLength, gridSubDiv } from '../modules/constants';

Array.prototype.unique = function() {
  return this.filter(function (value, index, self) { 
    return self.indexOf(value) === index;
  });
}

export default function(opponents, friendlies, spawnPos) {
  let startingPos = spawnPos;

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

  let arrIdx = Math.floor(Math.random() * arrayToUse.length);
  return arrayToUse[arrIdx];
}