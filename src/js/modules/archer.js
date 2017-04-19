import Constants from './constants';

export default class Archer {

  constructor(args) {
    this.scene = args.scene;
    this.player = args.player;
    this.playerId = this.player.id;
    this.colliderList = args.colliderList;

    this.direction = args.direction;
    this.startingZ = args.startingZ;
    this.startingY = args.startingY + 4;
    this.startingX = args.startingX - (4 * this.direction);

    this.targetList = [];
    this.arrows = [];

    this.startingRotation = 0;
    let _90deg = (90/180) * Math.PI;
    let _135deg = (135/180) * Math.PI;

    this.animationProperties = {
      arm: {
        startingAngle: _135deg,
        endingAngle: _90deg,
        angleDifference: _135deg - _90deg,
        speedDown: 200,
        speedUp: 150,
        lastAnimate: null
      },
      arrowSpeed: 500
    }

    this.attackProperties = {
      lastAttack: 0
    };

    this.attackSpeed = Constants.archer.baseAttackSpeed;
    this.arrowSpeed = Constants.archer.baseArrowSpeed;
    this.attackStrength = Constants.archer.baseAttack;
    this.arrowId = 0;
    this.initializeView();
    this.registerCollision();
  }

  initializeView(hitBoxOpacity=0) {
    this.viewObj = new THREE.Group();

    let bodyG = new THREE.BoxGeometry(0.01, 0.013, 0.013);
    let bodyMat = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
    this.body = new THREE.Mesh(bodyG, bodyMat);

    let hitBoxG = new THREE.BoxGeometry( 60, 60, 60 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00, transparent: true, opacity: hitBoxOpacity, depthWrite: false} );
    this.hitBox = new THREE.Mesh( hitBoxG, material );

    this.hitBox.userData.player = this.player;
    this.hitBox.userData.object = this;
    this.hitBox.userData.ranged = true;

    this.viewObj.add(this.body);
    this.viewObj.add(this.hitBox);

    this.viewObj.position.set(this.startingX, this.startingY, this.startingZ);
  }

  registerCollision() {
    this.hitBox.geometry.computeBoundingBox();
    let box3 = this.hitBox.geometry.boundingBox.clone();
    this.collider = new THREEx.ColliderBox3(this.hitBox, box3);
    this.colliderList.push(this.collider);

    this.collider.addEventListener('contactEnter', (otherCollider) => {
      let userData = otherCollider.object3d.userData;

      if(userData.player.id === this.playerId) { return; }
      if(userData.ranged || userData.immuneToRange) { return; }

      this.targetList.push(userData.object);
    });

    this.collider.addEventListener('contactStay', (otherCollider) => {
      let userData = otherCollider.object3d.userData;

      if(userData.player.id === this.playerId) { return; }
      if(userData.ranged || userData.immuneToRange) { return; }

      if(this.findColliderIndex(otherCollider.id) === -1) {
        this.targetList.push(userData.object);
      }
    });


    this.collider.addEventListener('contactRemoved', (otherCollider) => {
      this.targetList.splice(this.findColliderIndex(otherCollider), 1);
      this.determineTarget();
    });

    this.collider.addEventListener('contactExit', (otherCollider) => {
      this.removeTarget(otherCollider);
      this.determineTarget();
    });
  }

  findColliderIndex(id) {
    let index = -1;

    for (let i = 0; i < this.targetList.length; i++) {
      if(this.targetList[i].collider.id === id) {
        index = i;
      }
    }

    return index;
  }

  removeTarget(id) {
    this.targetList.splice(this.findColliderIndex(id), 1);
  }

  canAttack(timestamp) {
    if(this.targetList.length === 0) { return false; }
    if(this.initiateAttack || this.recharging) { return false; }

    let delta = timestamp - this.attackProperties.lastAttack;
    return delta >= this.attackSpeed;
  }

  getAttackValue() {
    return this.attackStrength;
  }

  determineTarget() {
    if(this.targetList.length > 0) {
      return this.targetList[0];
    } else {
      return null;
    }
  }

  attackProcedure(timestamp) {
    if(!this.canAttack(timestamp)) { return; }

    let target = this.determineTarget();
    if(target !== null && target.viewObj) {
      this.nextTarget = {
        target: target,
        callback: (target) => {
          target.health -= this.getAttackValue();
          if(target.health <= 0) {
            this.player.processReward(target.killReward);

            target.attack = false;
            target.destroy = true;
            this.removeTarget(target.collider.id);
          }
        }
      }
      this.initiateAttack = true;
    }

    this.attackProperties.lastAttack = timestamp;
  }


  spawnArrow(target, timestamp, callback) {
    let arrowG = new THREE.SphereGeometry(1, 10, 10);
    let arrowMat = new THREE.MeshBasicMaterial({ color: 0x9C3724 });
    let arrow = new THREE.Mesh(arrowG, arrowMat);
    arrow.name = "Arrow";
    this.scene.add(arrow);

    arrow.position.set(this.startingX, this.startingY + 2, this.startingZ);

    let id = this.arrowId++;

    let startingY = arrow.position.y;
    let max = startingY + 5;
    let endingY = target.viewObj.position.y;

    let x_1 = 0;
    let y_1 = startingY;

    let x_2 = 0.5;
    let y_2 = max;

    let x_3 = 1;
    let y_3 = endingY;

    let a = y_1/((x_1-x_2)*(x_1-x_3)) + y_2/((x_2-x_1)*(x_2-x_3)) + y_3/((x_3-x_1)*(x_3-x_2))

    let b = -y_1*(x_2+x_3)/((x_1-x_2)*(x_1-x_3))
        -y_2*(x_1+x_3)/((x_2-x_1)*(x_2-x_3))
        -y_3*(x_1+x_2)/((x_3-x_1)*(x_3-x_2))

    let c = y_1*x_2*x_3/((x_1-x_2)*(x_1-x_3))
      + y_2*x_1*x_3/((x_2-x_1)*(x_2-x_3))
      + y_3*x_1*x_2/((x_3-x_1)*(x_3-x_2))



    let yFunction = (delta) => {
      return (a * (delta * delta)) + (b * delta) + c;
    }

    let m_x = target.viewObj.position.x - arrow.position.x;
    let c_x = arrow.position.x;

    let xFunction = (delta) => {
      return (m_x * delta) + c_x;
    }

    let m_z = target.viewObj.position.z - arrow.position.z;
    let c_z = arrow.position.z;

    let zFunction = (delta) => {
      return (m_z * delta) + c_z;
    }


    this.arrows.push({
      id: id,
      obj: arrow,
      target: target,
      startingTime: timestamp,
      yFunction: yFunction,
      xFunction: xFunction,
      zFunction: zFunction
    });

    setTimeout(() => {
      callback(target);
      this.arrows = this.arrows.filter((a) => {
        return a !== id;
      });
      this.scene.remove(arrow);
    }, this.arrowSpeed);

  }

  animateArrows(timestamp) {
    this.arrows.forEach((arrow) => {
      let delta = (timestamp - arrow.startingTime) / this.arrowSpeed;
      arrow.obj.position.y = arrow.yFunction(delta);
      arrow.obj.position.x = arrow.xFunction(delta);
      arrow.obj.position.z = arrow.zFunction(delta);
    });
  }

  animateAttack(timestamp) {
    if(this.rightArm && this.initiateAttack) {
      if(this.rightArm.rotation.z > this.animationProperties.arm.endingAngle) {
        if(this.animationProperties.arm.lastAnimate === null) {
          this.animationProperties.arm.lastAnimate = timestamp;
        }

        let delta = timestamp - this.animationProperties.arm.lastAnimate;
        let timeRatio = delta / this.animationProperties.arm.speedDown;
        let degreeChange = this.animationProperties.arm.angleDifference * timeRatio;


        this.rightArm.rotation.z -= degreeChange;
        this.animationProperties.arm.lastAnimate = timestamp;
      } else {
        this.spawnArrow(
            this.nextTarget.target,
            timestamp,
            this.nextTarget.callback );

        this.resetAttackAnimation();
      }

    }

    if(this.rightArm && this.recharging) {
      if(this.rightArm.rotation.z < this.animationProperties.arm.startingAngle) {
        if(this.animationProperties.arm.lastAnimate === null) {
          this.animationProperties.arm.lastAnimate = timestamp;
        }

        let delta = timestamp - this.animationProperties.arm.lastAnimate;
        let timeRatio = delta / this.animationProperties.arm.speedUp;
        let degreeChange = this.animationProperties.arm.angleDifference * timeRatio;

        this.rightArm.rotation.z += degreeChange;
        this.animationProperties.arm.lastAnimate = timestamp;
      } else {
        this.recharging = false;
        this.animationProperties.arm.lastAnimate = null;
      }
    }

    if(this.nextTarget && this.nextTarget.target) {
      let angleTowardsTarget = this.calculateAngleToTarget(this.nextTarget.target);
      this.bodyModel.rotation.y = angleTowardsTarget + this.startingRotation;
    }
  }

  resetAttackAnimation() {
    this.initiateAttack = false;
    this.recharging = true;
    this.animationProperties.arm.lastAnimate = null;
  }

  calculateAngleToTarget(target) {
    let xDiff = target.viewObj.position.x - this.viewObj.position.x;
    let zDiff = target.viewObj.position.z - this.viewObj.position.z;
    let diffRatio = zDiff / xDiff;
    return (Math.PI * -this.direction) - Math.atan(diffRatio) + Math.PI;
  }

  runLoop(timestamp) {
    this.attackProcedure(timestamp);
    this.animateArrows(timestamp);
    this.animateAttack(timestamp);
    this.collider.update();
  }
}
