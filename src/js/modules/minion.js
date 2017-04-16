import { gridWidth, gridLength, gridSubDiv } from './constants';

export default class Minion {
  constructor(args) {
    this.direction = args.direction;
    this.colliderList = args.colliderList;
    this.id = args.id;
    this.playerId = args.playerId;
    this.player = args.player;
    this.startingZ = args.startingZ;
    this.scene = args.scene;

    this.maxHealth = 10;
    this.health = this.maxHealth;
    this.attackStrength = 5;
    this.attackSpeed = 400;

    this.defaultSpeed = 0.3;
    this.speed = this.defaultSpeed;
    this.attackProperties = {
      lastTimeStamp: null,
      attackTime: 0
    };

    this.attackAnimationProperties = {
      direction: this.direction,
      speed: this.attackSpeed / 2,
    };

    this.walkingAnimationProperties = {
      direction: this.direction,
      speed: (this.defaultSpeed * 1000),
      lastTimeStamp: null,
      time: 0
    };

    this.killReward = {
      money: 75,
      score: 25
    };

    this.destroy = false;
    this.attack = false;

    this.rotObjectMatrix = null;

    this.initializeView(this.startingZ);
    this.registerCollision();
  }

  initializeView(startingZ, hitBoxOpacity=.25) {
    this.viewObj = new THREE.Group();    

    let hitGeometry = new THREE.BoxGeometry(3,8,3);
    let hitMaterial = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: hitBoxOpacity });
    let hitMesh = new THREE.Mesh(hitGeometry, hitMaterial);

    this.healthBar = this.initializeHealthBar();

    //this.viewObj.add(shapeMesh);
    //this.viewObj.add(hitMesh);
    //this.viewObj.add(this.healthBar);

    hitMesh.add(this.healthBar);
    this.viewObj = hitMesh;
    this.hitBox = this.viewObj;

    let z = ((startingZ * (gridWidth / gridSubDiv)) - (gridWidth / 2)) + (gridWidth / gridSubDiv / 2);
    let x = (gridWidth / 2) * -this.direction;
    this.viewObj.position.z = z;
    this.viewObj.position.x = x;
    this.viewObj.position.y = 4;

    this.hitBox.userData.object = this;
    this.hitBox.userData.player = this.player;
  }

  getPosition() {
    return this.viewObj.position;
  }

  initializeHealthBar() {
    this._healthBarWidth = 2;
    let fullHealthBarGeometry = new THREE.BoxGeometry(this._healthBarWidth, 0.3, 0.3);
    let fullHealthBarMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
    let fullHealthBarMesh = new THREE.Mesh(fullHealthBarGeometry, fullHealthBarMaterial);
    fullHealthBarMesh.name = "FullHealthBar";

    let emptyHealthBarGeometry = new THREE.BoxGeometry(this._healthBarWidth, 0.2, 0.2);
    let emptyHealthBarMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    let emptyHealthBarMesh = new THREE.Mesh(emptyHealthBarGeometry, emptyHealthBarMaterial);
    emptyHealthBarMesh.name = "EmptyHealthBar";

    let healthBarGroup = new THREE.Group();
    healthBarGroup.add(fullHealthBarMesh);
    healthBarGroup.add(emptyHealthBarMesh);

    healthBarGroup.position.y = 4;

    return healthBarGroup;
  }

  isObjectLoaded(obj) {
    return (obj.position.x === 0 && obj.position.y === 0 && obj.position.z === 0);
  }

  registerCollision() {
    this.hitBox.geometry.computeBoundingBox()
    let box3 = this.hitBox.geometry.boundingBox.clone();
    this.collider = new THREEx.ColliderBox3(this.hitBox, box3);

    this.colliderList.push(this.collider);

    this.collider.addEventListener('contactEnter', (otherCollider) => {
      if(otherCollider.object3d.userData.player.id === this.playerId) { return; }

      this.speed = 0;
      this.attack = true;
      this.currentTarget = otherCollider.object3d.userData.object;
      this.resetWalkAnimation();
    });

    this.collider.addEventListener('contactStay', (otherCollider) => {
      if(otherCollider.object3d.userData.player.id === this.playerId) { return; }

      if(this.currentTarget === null) {
        this.speed = 0;
        this.attack = true;
        this.currentTarget = otherCollider.object3d.userData.object;
        this.resetWalkAnimation();
      }
    });

    this.collider.addEventListener('contactRemoved', (otherCollider) => {
      this.speed = this.defaultSpeed;
      this.attack = false;
      this.currentTarget = null;
    });
  }

  getAttackValue() {
    let critProc = Math.random();
    return critProc >= .9 ? this.attackStrength * (Math.random() + 1) : this.attackStrength;
  }

  updateHealthBar() {
    let healthPercent = this.health/this.maxHealth;
    let healthBarOffset = -(1-healthPercent) * this._healthBarWidth / 2;
    let fullHealthBar = this.healthBar.getObjectByName('FullHealthBar');

    fullHealthBar.scale.x = healthPercent;
    fullHealthBar.position.x = healthBarOffset;
  }

  runLoop(timestamp) {

    this.attackProcedure(timestamp);
    this.viewObj.position.x += (this.speed * this.direction);
    this.walkProcedure(timestamp);

    this.collider.update();
    this.updateHealthBar();
  }

  attackProcedure(timestamp) {
    if(this.health <= 0) { return; }


    if(this.attackProperties.lastTimeStamp != null && this.attack) {
      let delta = timestamp - this.attackProperties.lastTimeStamp;
      this.attackProperties.attackTime = this.attackProperties.attackTime + delta;
      this.attackProperties.lastTimeStamp = timestamp;
      this.attackLoop(delta);
    } else if(this.attack) {
      this.attackProperties.attackTime = 0;
      this.attackProperties.lastTimeStamp = timestamp;
      this.attackLoop(0);
    }

    this.attackProperties.lastTimeStamp = timestamp;
  }

  attackLoop(delta) {
    if(this.currentTarget === null || this.currentTarget.playerId === this.playerId) { return; }
    this.animateAttack(delta);
    if(this.attackProperties.attackTime <= this.attackSpeed) { return; }
    
    this.currentTarget.health -= this.getAttackValue();

    if(this.currentTarget.health <= 0) {
      this.player.processReward(this.currentTarget.killReward);

      this.currentTarget.attack = false;
      this.currentTarget.destroy = true;
      this.currentTarget = null;
    }

    this.attackProperties.attackTime = 0;
    this.attackProperties.lastTimeStamp = null;
  }

  animateAttack(delta) {
    if(this.viewObj.children.length > 1) {
      let rightArm = this.viewObj.children[1].children[1];
      let currentAttackTime = this.attackProperties.attackTime;
      let direction = this.attackAnimationProperties.direction;
      let animationSpeed = this.attackAnimationProperties.speed;
      let maxRotation = 135;

      let rotation = direction * ((maxRotation * (Math.PI / 180)) * (delta / animationSpeed));
      rotation = Math.min(rightArm.rotation.z + rotation, maxRotation);
      rotation = Math.max(rotation, 0);

      rightArm.rotation.z = rotation;
      if(currentAttackTime > animationSpeed) {
        this.attackAnimationProperties.direction = -1;
      } else {
        this.attackAnimationProperties.direction = 1;
      }
    }
  }

  resetAttackAnimation() {
    if(this.viewObj.children.length > 1) {
      let rightArm = this.viewObj.children[1].children[1];
      rightArm.rotation.z = 0;
    }
  }

  walkProcedure(timestamp) {
    if(!this.attack && this.walkingAnimationProperties.lastTimeStamp !== null) {
      let delta = timestamp - this.walkingAnimationProperties.lastTimeStamp;
      this.walkingAnimationProperties.time = this.walkingAnimationProperties.time + delta;
      this.walkLoop(delta);
    } else {
      this.walkLoop(0);
    }

    this.walkingAnimationProperties.lastTimeStamp = timestamp;
  };

  walkLoop(delta) {
    this.animateWalk(delta);
    if(this.walkingAnimationProperties.time <= this.walkingAnimationProperties.speed) { return; }
    this.walkingAnimationProperties.time = 0;
  }

  animateWalk(delta) {
    if(this.viewObj.children.length > 1 && !this.attack) {
      let legs = this.viewObj.children[1].children[3];
      let leftLeg = legs.children[0];
      let rightLeg = legs.children[1];
      let animationTime = this.walkingAnimationProperties.time;
      let animationSpeed = this.walkingAnimationProperties.speed;
      let direction = this.walkingAnimationProperties.direction;
      let maxRotation = 150 * this.direction;

      let rotation = ((maxRotation * (Math.PI / 180)) * (delta / animationSpeed));

      console.log(leftLeg.rotation.z, rightLeg.rotation.z);
      if(direction === 1) {
        this.animateLegForward(leftLeg, rotation, maxRotation, delta);
        this.animateLegBack(rightLeg, rotation, maxRotation, delta);
      } else {
        this.animateLegForward(rightLeg, rotation, maxRotation, delta);
        this.animateLegBack(leftLeg, rotation, maxRotation, delta);
      }

      let animationChange = animationSpeed / 4;
      if(animationTime > animationChange && animationTime < (3 * animationChange)) {
        this.walkingAnimationProperties.direction = -1;
      }

      if(animationTime > (3 * animationChange) && animationTime < animationSpeed) {
        this.walkingAnimationProperties.direction = 1;
      }
    }
  }

  animateLegBack(leg, rotation, maxRotation, delta) {
    let max = (-maxRotation * (Math.PI / 180)) * this.direction;
    if(leg.rotation.z + -rotation < max) {
      console.log('Back', leg.rotation.z + -rotation, delta);
      leg.rotation.z = max;
    } else {
      leg.rotation.z += -rotation;
    }
  } 

  animateLegForward(leg, rotation, maxRotation, delta) {
    let max = (maxRotation * (Math.PI / 180)) * this.direction;
    if(leg.rotation.z + rotation > max) {
      console.log('Fore', leg.rotation.z + rotation, delta);
      leg.rotation.z = max;
    } else {
      leg.rotation.z += rotation;
    }
  }

  resetWalkAnimation() {
    let legs = this.viewObj.children[1].children[3];
    let leftLeg = legs.children[0];
    let rightLeg = legs.children[1];

    leftLeg.rotation.z = 0;
    rightLeg.rotation.z = 0;
  }
}
