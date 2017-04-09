export default class GameView {
  constructor(globals, gameEngine) {
    this.scene = globals.scene;
    this.camera = globals.camera;
    this.renderer = globals.renderer;

    this.gameEngine = gameEngine;

    this.setupLight();

    var grid = new THREE.GridHelper(40, 10);
    this.scene.add(grid);

    this.camera.position.z = 100;
    this.camera.position.y = 50;
    this.camera.lookAt(this.scene.position)
  }

  setupLight() {
    let lightAmbient = new THREE.AmbientLight(0x666666);
    let lightSource = new THREE.PointLight(0x888888);

    lightSource.position.set(3, 3, 3);

    this.scene.add(lightAmbient);
    this.scene.add(lightSource);
  }

  renderLoop() {
    this.gameEngine.gameLoop();
  }
}
