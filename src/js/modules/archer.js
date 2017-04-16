export default class Archer {

  constructor(args) {
    this.scene = args.scene;
    this.player = args.player;
    this.playerId = this.player.id;
    this.colliderList = args.colliderList;

    this.direction = args.direction;
    this.startingZ = args.startingZ;
    this.startingY = args.startingY + 3;
    this.startingX = args.startingX - (4 * this.direction);

    this.targetList = [];
    this.arrows = [];

    this.attackProperties = {
      lastAttack: 0
    };

    this.attackSpeed = 700;
    this.arrowSpeed = 1000;
    this.attackStrength = 1;
    this.arrowId = 0;
    this.initializeView();
    this.registerCollision();
  }

  initializeView(hitBoxOpacity=0) {
    this.viewObj = new THREE.Group();

    let bodyG = new THREE.BoxGeometry(3, 3, 3);
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


    this.scene.add(this.viewObj);
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
      console.log("Enter", this.targetList, this.playerId, otherCollider);
    });

    this.collider.addEventListener('contactRemoved', (otherCollider) => {
      console.log(otherCollider, this.targetList);
      this.targetList = this.targetList.filter(t => t.collider.id !== otherCollider);
      console.log("Exit", this.targetList, this.playerId);
    });
  }

  canAttack(timestamp) {
    if(this.targetList.length === 0) { return false; }

    let delta = timestamp - this.attackProperties.lastAttack;
    return delta >= this.attackSpeed;
  }

  getAttackValue() {
    return this.attackStrength;
  }

  determineTarget() {
    return this.targetList[0];
  }

  attackProcedure(timestamp) {
    if(!this.canAttack(timestamp)) { return; }

    let target = this.determineTarget();
    this.spawnArrow(target, timestamp, (target) => {
      target.health -= this.getAttackValue();
      if(target.health <= 0) {
        this.player.processReward(target.killReward);

        target.attack = false;
        target.destroy = true;
      }
    });


    this.attackProperties.lastAttack = timestamp;
  }

  spawnArrow(target, timestamp, callback) {
    let arrowG = new THREE.BoxGeometry(1, 1, 1);
    let arrowMat = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
    let arrow = new THREE.Mesh(arrowG, arrowMat);
    this.scene.add(arrow);

    arrow.position.set(this.startingX, this.startingY, this.startingZ);

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

  runLoop(timestamp) {
    this.collider.update();
    this.attackProcedure(timestamp);
    this.animateArrows(timestamp);
  }
}
