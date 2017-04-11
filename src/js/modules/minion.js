export default class Minion {
  constructor(args) {
    this.direction = args.direction;
    this.colliderList = args.colliderList;

    this.health = 20;
    this.attackStrength = 3;
    this.speed = 1;

    this.initializeView(args.startingZ);
    this.registerCollision();
  }

  initializeView(startingZ, hitBoxOpacity=25) {
    this.viewObj = new THREE.Group();

    let shapeGeometry = new THREE.BoxGeometry(1,1,1);
    let shapeMaterial = new THREE.MeshPhongMaterial({color: 0x00ff00, specular: 0x555555, shininess: 30 });
    let shapeMesh = new THREE.Mesh(shapeGeometry, shapeMaterial);

    let hitGeometry = new THREE.BoxGeometry(1.25,1.25,1.25);
    let hitMaterial = new THREE.MeshBasicMaterial({color: 0xffffff, transparent: true, opacity: hitBoxOpacity });
    let hitMesh = new THREE.Mesh(hitGeometry, hitMaterial);

    this.hitBox = hitMesh;

    this.viewObj.add(shapeMesh);
    this.viewObj.add(hitMesh);

    this.viewObj.position.z = (startingZ * 9) - 32;
    this.viewObj.position.x = -38 * this.direction;
    this.viewObj.position.y = 1;

    this.hitBox.userData.minion = this;
  }

  registerCollision() {
    this.hitBox.geometry.computeBoundingBox()
    let box3 = this.hitBox.geometry.boundingBox.clone(); 
    this.collider = new THREEx.ColliderBox3(this.hitBox, box3);

    this.colliderList.push(this.collider);

    this.collider.addEventListener('contactEnter', (otherCollider) => {
      console.log(this.collider.id, otherCollider.id);
      console.log(otherCollider);
      this.speed = 0;
    });
  }

  runLoop() {
    this.viewObj.position.x += (this.speed * this.direction);

    this.collider.update();
  }
}
