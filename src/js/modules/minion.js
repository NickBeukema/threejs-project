export default class Minion {
  constructor(args) {
    this.direction = args.direction;
    this.colliderList = args.colliderList;
    this.id = args.id;
    this.playerId = args.playerId;

    this.maxHealth = 10;
    this.health = this.maxHealth;
    this.attackStrength = 3;
    this.attackSpeed = 500;
    this.defaultSpeed = 0.1;
    this.speed = this.defaultSpeed;
    this.attackProperties = {
      lastTimeStamp: null,
      attackTime: 0
    };

    this.destroy = false;
    this.attack = false;

    this.initializeView(args.startingZ);
    this.registerCollision();
  }

  initializeView(startingZ, hitBoxOpacity=.25) {
    this.viewObj = new THREE.Group();

    let shapeGeometry = new THREE.BoxGeometry(2,2,2);
    let shapeMaterial = new THREE.MeshPhongMaterial({color: 0x00ff00, specular: 0x555555, shininess: 30 });
    let shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);

    let hitGeometry = new THREE.BoxGeometry(3,3,3);
    let hitMaterial = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: hitBoxOpacity });
    let hitMesh = new THREE.Mesh(hitGeometry, hitMaterial);

    this.healthBar = this.initializeHealthBar();
    this.hitBox = hitMesh;

    this.viewObj.add(shapeMesh);
    this.viewObj.add(hitMesh);
    this.viewObj.add(this.healthBar);

    this.viewObj.position.z = (startingZ * 9) - 32;
    this.viewObj.position.x = -38 * this.direction;
    this.viewObj.position.y = 2;

    this.hitBox.userData.minion = this;
  }

  initializeHealthBar() {
    this._healthBarWidth = 2;
    let fullHealthBarGeometry = new THREE.BoxGeometry(this._healthBarWidth, 0.1, 0.1);
    let fullHealthBarMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
    let fullHealthBarMesh = new THREE.Mesh(fullHealthBarGeometry, fullHealthBarMaterial);
    fullHealthBarMesh.name = "FullHealthBar";

    let emptyHealthBarGeometry = new THREE.BoxGeometry(this._healthBarWidth, 0.09, 0.09);
    let emptyHealthBarMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    let emptyHealthBarMesh = new THREE.Mesh(emptyHealthBarGeometry, emptyHealthBarMaterial);
    emptyHealthBarMesh.name = "EmptyHealthBar";

    let healthBarGroup = new THREE.Group();
    healthBarGroup.add(fullHealthBarMesh);
    healthBarGroup.add(emptyHealthBarMesh);

    healthBarGroup.position.y = 4;

    return healthBarGroup;
  }

  registerCollision() {
    this.hitBox.geometry.computeBoundingBox()
    let box3 = this.hitBox.geometry.boundingBox.clone(); 
    this.collider = new THREEx.ColliderBox3(this.hitBox, box3);

    this.colliderList.push(this.collider);

    this.collider.addEventListener('contactEnter', (otherCollider) => {
      this.speed = 0;
      this.attack = true;
      this.currentTarget = otherCollider.object3d.userData.minion;
    });

    this.collider.addEventListener('contactRemoved', (otherCollider) => {
      this.speed = this.defaultSpeed;
      this.attack = false;
      this.currentTarget = null;
    });
  }

  getAttackValue() {
    return Math.random() * this.attackStrength;
  }

  updateHealthBar() {
    let healthPercent = this.health/this.maxHealth;
    let healthBarOffset = -(1-healthPercent) * this._healthBarWidth / 2;
    let fullHealthBar = this.healthBar.getObjectByName('FullHealthBar');

    fullHealthBar.scale.x = healthPercent;
    fullHealthBar.position.x = healthBarOffset;
  }

  runLoop(timestamp) {
    if(this.attackProperties.lastTimeStamp != null && this.attack) {
      let delta = timestamp - this.attackProperties.lastTimeStamp;
      this.attackProperties.attackTime += delta;
      this.attackProperties.lastTimeStamp = timestamp;
      this.attackLoop();
    } else if(this.attack) {
      this.attackProperties.attackTime = 0;
      this.attackProperties.lastTimeStamp = timestamp;
      this.attackLoop();
    }

    this.attackProperties.lastTimeStamp = timestamp;
    this.viewObj.position.x += (this.speed * this.direction);

    this.collider.update();
    this.updateHealthBar();
  }

  attackLoop() {
    if(this.currentTarget === null || this.currentTarget.playerId === this.playerId) { return; }
    if(this.attackProperties.attackTime < this.attackSpeed) { return; }

    this.currentTarget.health -= this.getAttackValue();

    console.log(this.id, this.health);
    if(this.currentTarget.health <= 0) {
      this.currentTarget.attack = false;
      this.currentTarget.destroy = true;
      this.currentTarget = null;
    }

    this.attackProperties.attackTime = 0;
    this.attackProperties.lastTimeStamp = null;
  }
}
