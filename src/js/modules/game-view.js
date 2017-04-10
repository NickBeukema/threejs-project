import { gridWidth, gridSubDiv } from './constants';

export default class GameView {
  constructor(globals, gameEngine) {
    this.scene = globals.scene;
    this.camera = globals.camera;
    this.renderer = globals.renderer;

    this.gameEngine = gameEngine;

    this.setupGrid();
    this.setupLight();

    this.mouse = { x: 0, y: 0 };

    this.camera.position.z = 50;
    this.camera.position.y = 50;
    this.camera.lookAt(this.scene.position);


    this.raycaster = new THREE.Raycaster();
    this.currentHoveredPanel = null;

    this.setupMouseEvent();
  }

  setupLight() {
    let lightAmbient = new THREE.AmbientLight(0x666666);
    let lightSource = new THREE.PointLight(0x888888);

    lightSource.position.set(3, 3, 3);

    this.scene.add(lightAmbient);
    this.scene.add(lightSource);
  }

  setupGrid() {
    var grid = new THREE.GridHelper(gridWidth, gridSubDiv);
    this.scene.add(grid);

    this.gridPanels = {};

    let panelLength = gridWidth / gridSubDiv;
    let zPos = -30.6;

    for(let i = 0; i < 8; i++) {
      var planeGeometry = new THREE.PlaneGeometry(gridWidth, panelLength);
      var planeMaterial = new THREE.MeshBasicMaterial({color: 0x666666});
      var plane = new THREE.Mesh(planeGeometry,planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.z = zPos;
      plane.position.y = -0.1;
      this.scene.add(plane);
      this.gridPanels[i] = plane;

      zPos += panelLength;
    }
  }

  checkGridIntersections() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    let planes = Object.values(this.gridPanels);
    var intersects = this.raycaster.intersectObjects(planes);

    planes.forEach((panel) => {
      panel.material.color.setHex(0x666666);
    });

    if(intersects.length > 0) {
      let obj = intersects[0].object;

      obj.material.color.setHex(0xff0000);
      this.currentHoveredPanel = obj;
    } else if(this.currentHoveredPanel){
      this.currentHoveredPanel = null;
    }

  }

  getCurrentPanelIndex() {
    if(!this.currentHoveredPanel) { return; }

    let planes = Object.values(this.gridPanels);

    for(let i = 0; i < 8; i++) {
      if(this.currentHoveredPanel === planes[i]) {
        return i;
      }
    }

  }

  setupMouseEvent() {
    let mouse = this.mouse;

    window.addEventListener('mousemove', evt => {
      mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
      mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    });
  }

  renderLoop() {
    this.checkGridIntersections();
    this.gameEngine.gameLoop();
  }
}
