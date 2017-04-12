export default class Base {

  constructor(args) {
    this.direction = args.direction;
    this.colliderList = args.colliderList;
    this.player = args.player;
    this.playerId = this.player.id;

    this.baseWidth = 80;
    this.baseHeight = 20;
    this.baseDepth = 10;

    this.maxHealth = 20;
    this.health = this.maxHealth;

    this.hitBoxBuffer = 2;

    this.killReward = {
      money: 550,
      score: 1000
    }

    this.initializeView(this.direction);
    this.registerCollision();
  }

  initializeView(direction, hitBoxOpacity=.25) {
    this.viewObj = new THREE.Group();

    let shapeGeometry = new THREE.BoxGeometry(
      this.baseDepth,
      this.baseHeight,
      this.baseWidth
    );

    let shapeMaterial = new THREE.MeshPhongMaterial({color: 0x00ff00, specular: 0x555555, shininess: 30 });
    let shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);

    let hitGeometry = new THREE.BoxGeometry(
      this.baseDepth + this.hitBoxBuffer,
      this.baseHeight + this.hitBoxBuffer,
      this.baseWidth + this.hitBoxBuffer 
    );

    let hitMaterial = new THREE.MeshBasicMaterial({color: 0x00ffff, transparent: true, opacity: hitBoxOpacity });
    let hitMesh = new THREE.Mesh(hitGeometry, hitMaterial);

    this.healthBar = this.initializeHealthBar();
    this.hitBox = hitMesh;

    this.viewObj.add(shapeMesh);
    this.viewObj.add(hitMesh);
    this.viewObj.add(this.healthBar);

    this.viewObj.position.x = (-35 - (this.baseDepth / 2)) * this.direction;
    this.viewObj.position.y = this.baseHeight/2;

    this.hitBox.userData.object = this;
    this.hitBox.userData.player = this.player;
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

    healthBarGroup.position.y = this.baseHeight + 5;

    return healthBarGroup;
  }

  updateHealthBar() {
    let healthPercent = this.health/this.maxHealth;
    let healthBarOffset = -(1-healthPercent) * this._healthBarWidth / 2;
    let fullHealthBar = this.healthBar.getObjectByName('FullHealthBar');

    fullHealthBar.scale.x = healthPercent;
    fullHealthBar.position.x = healthBarOffset;
  }

  registerCollision() {
    this.hitBox.geometry.computeBoundingBox()
    let box3 = this.hitBox.geometry.boundingBox.clone();
    this.collider = new THREEx.ColliderBox3(this.hitBox, box3);

    this.colliderList.push(this.collider);
  }

  runLoop() {
    this.collider.update();
    this.updateHealthBar();
  }
}
