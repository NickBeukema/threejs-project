import { gridWidth, gridLength, gridSubDiv } from './constants';

export default class Base {

  constructor(args) {
    this.direction = args.direction;
    this.colliderList = args.colliderList;
    this.player = args.player;
    this.playerId = this.player.id;

    this.baseWidth = gridWidth;
    this.baseHeight = 20;
    this.baseDepth = 10;

    this.maxHealth = 250;
    this.health = this.maxHealth;

    this.hitBoxBuffer = 2;

    this.killReward = {
      money: 550,
      score: 1000
    }

    this.initializeView(this.direction);
    this.registerCollision();
  }

  initializeView(direction, hitBoxOpacity=0) {
    this.viewObj = new THREE.Group();

    let shapeGeometry = new THREE.BoxGeometry(
      this.baseDepth,
      this.baseHeight,
      this.baseWidth
    );


    let textureLoader = new THREE.TextureLoader();
    let normalMap = textureLoader.load('textures/rock-normal-map.jpg');
    let longTexture = textureLoader.load('textures/brick-wall.jpg');
    let skinnyTexture = textureLoader.load('textures/brick-wall.jpg');
    let sideTexture = textureLoader.load('textures/brick-wall.jpg');
    let baseColor = 0x555555;

    longTexture.wrapS = longTexture.wrapT = THREE.RepeatWrapping;
    longTexture.repeat.set(3, 1);

    skinnyTexture.wrapS = skinnyTexture.wrapT = THREE.RepeatWrapping;
    skinnyTexture.repeat.set(1, 3);

    sideTexture.wrapS = sideTexture.wrapT = THREE.RepeatWrapping;
    sideTexture.repeat.set(1, 1);

    let skinnyMat = new THREE.MeshPhongMaterial({color: 0x333333, specular: 0x333333, shininess: 15, normalMap: textureLoader.load('textures/rock-normal-map.jpg'), normalScale: new THREE.Vector2( 0.05, 1 ), map: skinnyTexture });


    let longMat = new THREE.MeshPhongMaterial({color: baseColor, specular: 0x333333, shininess: 15, normalMap: normalMap, normalScale: new THREE.Vector2( 1, 1 ), map: longTexture });

    let sideMat = new THREE.MeshPhongMaterial({color: baseColor, specular: 0x333333, shininess: 15, normalMap: normalMap, normalScale: new THREE.Vector2( 1, 1 ), map: sideTexture });

    let shapeMaterials = [
      longMat, // Right
      longMat, // Left
      skinnyMat, // Top
      sideMat, // Back
      sideMat, // Front
      skinnyMat, // Bottom

    ]

    let shapeMesh = new THREE.Mesh(shapeGeometry, new THREE.MultiMaterial(shapeMaterials));


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

    this.viewObj.position.x = ((-gridWidth/2) - (this.baseDepth / 2)) * this.direction;
    this.viewObj.position.y = this.baseHeight/2;

    this.hitBox.userData.object = this;
    this.hitBox.userData.player = this.player;
    this.hitBox.userData.immuneToRange = true;
  }

  initializeHealthBar() {
    this._healthBarLength = gridWidth / 10;
    this._healthBarWidth = gridWidth / 150;
    let fullHealthBarGeometry = new THREE.BoxGeometry(this._healthBarLength, this._healthBarWidth, this._healthBarWidth);
    let fullHealthBarMaterial = new THREE.MeshBasicMaterial({color: 0x00ff00});
    let fullHealthBarMesh = new THREE.Mesh(fullHealthBarGeometry, fullHealthBarMaterial);
    fullHealthBarMesh.name = "FullHealthBar";

    let emptyHealthBarGeometry = new THREE.BoxGeometry(this._healthBarLength * 0.99, this._healthBarWidth * 0.9, this._healthBarWidth * 0.9);
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
    let healthBarOffset = -(1-healthPercent) * this._healthBarLength / 2;
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
