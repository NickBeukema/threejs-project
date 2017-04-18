import { gridWidth, gridLength, gridSubDiv } from './constants';
import { bindButtons } from './menu-screen';

// UI Elements
let scoreText, moneyText, fpsText, hud;


// Texture
const planeTexture = new THREE.TextureLoader().load("textures/stone.jpg");
planeTexture.repeat.set(10,10);
planeTexture.wrapS = THREE.RepeatWrapping;
planeTexture.wrapT = THREE.RepeatWrapping;


export default class GameView {
  constructor(globals, gameEngine) {
    this.scene = globals.scene;
    this.camera = globals.camera;
    this.renderer = globals.renderer;

    this.gameEngine = gameEngine;

    this.setupGrid();
    this.setupLight();

    this.mouse = { x: -10000, y: 0 };

    let positionScale = gridWidth / 2;

    this.camera.position.z = 2 * positionScale;
    this.camera.position.y = 1.5 * positionScale;
    this.camera.lookAt(this.scene.position);

    this.hud = document.getElementById('hud');
    this.lastTimeStamp = 0;
    this.started = false;

    this.raycaster = new THREE.Raycaster();
    this.currentHoveredPanel = null;

    this.setupMouseEvent();
    bindButtons(this, this.gameEngine);
  }

  setupLight() {
    let lightAmbient = new THREE.AmbientLight(0x666666, 3);
    let lightSource = new THREE.PointLight(0x888888);

    lightSource.position.set(3, 3, 3);

    this.scene.add(lightAmbient);
    this.scene.add(lightSource);
  }

  setupGrid() {
    let texturedSurfaceGeometry = new THREE.PlaneGeometry(gridWidth, gridWidth);
    let texturedSurfaceMaterial = new THREE.MeshBasicMaterial({map: planeTexture});
    let texturedSurface = new THREE.Mesh(texturedSurfaceGeometry, texturedSurfaceMaterial);
    texturedSurface.rotation.x = -0.5 * Math.PI;
    texturedSurface.position.y = -0.3;
    this.scene.add(texturedSurface);

    let grid = new THREE.GridHelper(gridWidth, gridSubDiv);
    this.scene.add(grid);

    this.gridPanels = {};

    let panelLength = gridWidth / gridSubDiv;
    let zPos = ((gridWidth / 2) - panelLength / 2) * -1;

    for(let i = 0; i < gridSubDiv; i++) {
      let planeGeometry = new THREE.PlaneGeometry(gridWidth, panelLength);
      let planeMaterial = new THREE.MeshBasicMaterial({transparent: true, opacity: 0});
      let plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -0.5 * Math.PI;
      plane.position.z = zPos;
      plane.position.y = -0.2;
      this.scene.add(plane);
      this.gridPanels[i] = plane;

      zPos += panelLength;
    }
  }

  checkGridIntersections() {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    let planes = Object.values(this.gridPanels);
    let intersects = this.raycaster.intersectObjects(planes);

    planes.forEach((panel) => {
      panel.material.color.setHex(0x666666);
      panel.material.opacity = 0;
    });

    if(intersects.length > 0) {
      let obj = intersects[0].object;

      obj.material.color.setHex(0xff0000);
      obj.material.opacity = .5;
      this.currentHoveredPanel = obj;
    } else if(this.currentHoveredPanel){
      this.currentHoveredPanel = null;
    }
  }

  getCurrentPanelIndex() {
    if(!this.currentHoveredPanel) { return; }

    let planes = Object.values(this.gridPanels);

    for(let i = 0; i < gridSubDiv; i++) {
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

  startFirstGame() {
    this.gameEngine.restart();

    this.hud.classList.remove('hud--hidden');
    scoreText = document.getElementById('score');
    moneyText = document.getElementById('money');
    fpsText = document.getElementById('fps');

    this.started = true;

    window.addEventListener('click', () => {
      let index = this.getCurrentPanelIndex();
      if(index >= 0) {
        this.gameEngine.myPlayer.spawnMinion(index);
      }
    });

    window.addEventListener('keypress', () => {
      let index = this.getCurrentPanelIndex();
      if(index >= 0) {
        this.gameEngine.computer.spawnMinion(index);
      }
    });
  }

  calculateFPS(timestamp) {
    let delta = timestamp - this.lastTimeStamp;
    delta = delta / 1000;
    this.lastTimeStamp = timestamp;
    return Math.round(1 / delta);
  }

  updateUI(timestamp) {
    scoreText.textContent = this.gameEngine.myPlayer.score;
    moneyText.textContent = this.gameEngine.myPlayer.money;
    fpsText.textContent = this.calculateFPS(timestamp);
  }

  renderLoop(timestamp) {
    this.checkGridIntersections();
    this.gameEngine.gameLoop(timestamp);

    if(this.started) {
      this.updateUI(timestamp);
    }
  }
} 
