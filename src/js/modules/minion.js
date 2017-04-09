export default class Minion {
  constructor(args) {
    this.health = 20;
    this.attackStrength = 3;
    this.direction = args.direction;
    this.initializeView(args.startingZ);
    this.speed = 0.08;
  }

  initializeView(startingZ) {
    let geometry = new THREE.BoxGeometry(1,1,1);
    let material = new THREE.MeshPhongMaterial({color: 0x00ff00, specular: 0x555555, shininess: 30 });
    this.viewObj = new THREE.Mesh(geometry, material);


    this.viewObj.position.z = (startingZ * 10) - 35;
    this.viewObj.position.x = -38 * this.direction;
    //this.viewObj.position.z = 0;

  }

  runLoop() {
    this.viewObj.position.x += (this.speed * this.direction);
  }
}
