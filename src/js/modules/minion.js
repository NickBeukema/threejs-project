export default class Minion {
  constructor(args) {
    this.direction = args.direction;
    this.colliderList = args.colliderList;
    this.id = args.id;

    this.health = 10;
    this.attackStrength = 3;
    this.speed = .5;
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

    this.hitBox = hitMesh;

    this.viewObj.add(shapeMesh);
    this.viewObj.add(hitMesh);

    this.viewObj.position.z = (startingZ * 9) - 32;
    this.viewObj.position.x = -38 * this.direction;
    this.viewObj.position.y = 2;

    this.hitBox.userData.minion = this;
  }

  registerCollision() {
    this.hitBox.geometry.computeBoundingBox()
    let box3 = this.hitBox.geometry.boundingBox.clone(); 
    this.collider = new THREEx.ColliderBox3(this.hitBox, box3);

    this.colliderList.push(this.collider);

    this.collider.addEventListener('contactEnter', (otherCollider) => {
      this.speed = 0;
      this.attack = true;
      otherCollider.object3d.userData.minion.attack = true;
      this.currentTarget = otherCollider;
    });

    this.collider.addEventListener('contactRemoved', (otherCollider) => {
      this.speed = .5;
      this.attack = false;
      this.currentTarget = null;
    });
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
  }

  attackLoop() {
    if(this.attackProperties.attackTime >= 500 && this.currentTarget !== null) {
      this.currentTarget.object3d.userData.minion.health -= this.attackStrength;
      
      console.log(this.id, this.health);
      if(this.currentTarget.object3d.userData.minion.health <= 0) {
        this.currentTarget.object3d.userData.minion.attack = false;
        this.currentTarget.object3d.userData.minion.destroy = true;
        this.currentTarget = null;
      }

      this.attackProperties.attackTime = 0;
      this.attackProperties.lastTimeStamp = null;
    }
  }
}
