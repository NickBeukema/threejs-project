export default class Archer {

  constructor(args) {
    this.scene = args.scene;
    this.colliderList = args.colliderList;

    this.direction = args.direction;
    this.startingZ = args.startingZ;
    this.startingY = args.startingY + 3;
    this.startingX = args.startingX - (4 * this.direction);

    this.attackSpeed = 700;
    this.attackStrength = 1;
    this.initializeView();
  }

  initializeView(hitBoxOpacity=0) {
    this.viewObj = new THREE.Group();

    let bodyG = new THREE.BoxGeometry(3, 3, 3);
    let bodyMat = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
    this.body = new THREE.Mesh(bodyG, bodyMat);

    let hitRadiusG = new THREE.SphereGeometry( 40, 32, 32 );
    var material = new THREE.MeshBasicMaterial( {color: 0xffff00, transparent: true, opacity: hitBoxOpacity, depthWrite: false} );
    var sphere = new THREE.Mesh( hitRadiusG, material );

    this.viewObj.add(this.body);
    this.viewObj.add(sphere);


    this.scene.add(this.viewObj);
    this.viewObj.position.set(this.startingX, this.startingY, this.startingZ);
  }
}
