export default class GameView {
  constructor(globals) {
    this.scene = globals.scene;
    this.camera = globals.camera;
    this.renderer = globals.renderer;

    this.setupLight();
    this.setupCube();

    this.camera.position.z = 4;
  }

  setupLight() {
    let lightAmbient = new THREE.AmbientLight(0x666666);
    let lightSource = new THREE.PointLight(0x888888);

    lightSource.position.set(3, 3, 3);

    this.scene.add(lightAmbient);
    this.scene.add(lightSource);
  }

  setupCube() {
    let geometry = new THREE.BoxGeometry(1,1,1);
    let material = new THREE.MeshPhongMaterial({color: 0x00ff00, specular: 0x555555, shininess: 30 });
    this.cube = new THREE.Mesh(geometry, material);

    this.scene.add(this.cube);
  }

  renderLoop() {
    this.cube.rotation.x += 0.01;
    this.cube.rotation.y += 0.01;
  }
}
