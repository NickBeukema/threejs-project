import { gridWidth,
         gridLength,
         gridSubDiv,
         minionBaseHealth,
         minionBaseAttack,
         minionBaseAttackSpeed,
         archerBaseAttack,
         archerBaseAttackSpeed,
         baseHealthUpgradeAmount
       } from './constants';

import Constants from './constants';
import { bindButtons } from './menu-screen';

// UI Elements
let scoreText, moneyText, poppulationText, baseHealthText, minionBaseHealthText ,minionBaseAttackText ,minionBaseAttackSpeedText ,archerBaseAttackText ,archerBaseAttackSpeedText;
let baseHealthUpgrade, minionBaseHealthUpgrade ,minionBaseAttackUpgrade ,minionBaseAttackSpeedUpgrade ,archerBaseAttackUpgrade ,archerBaseAttackSpeedUpgrade;


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
    this.setupGrassField();
    this.setupLight();

    this.mouse = { x: -10000, y: 0 };

    let positionScale = gridWidth / 2;

    this.camera.position.z = 2 * positionScale;
    this.camera.position.y = 1.5 * positionScale;
    this.camera.lookAt(this.scene.position);

    this.hud = document.getElementById('hud');
    this.hudUpgrade = document.getElementById('hud-upgrade');
    this.lastTimeStamp = 0;
    this.started = false;

    this.raycaster = new THREE.Raycaster();
    this.currentHoveredPanel = null;

    this.setupMouseEvent();
    bindButtons(this, this.gameEngine);
  }

  setupLight() {
    let lightAmbient = new THREE.AmbientLight(0x666666, 3);
    let lightSource = new THREE.PointLight(0x888888, 1);

    lightSource.position.set(0, 30, 0);
    lightAmbient.position.set(0, 30, 0);

    this.scene.add(lightAmbient);
    this.scene.add(lightSource);
  }

  setupGrid() {
     //let texturedSurfaceGeometry = new THREE.PlaneGeometry(gridWidth, gridWidth);
     //let texturedSurfaceMaterial = new THREE.MeshBasicMaterial({map: planeTexture});
     //let texturedSurface = new THREE.Mesh(texturedSurfaceGeometry, texturedSurfaceMaterial);
     //texturedSurface.rotation.x = -0.5 * Math.PI;
     //texturedSurface.position.y = -0.3;
     //this.scene.add(texturedSurface);

    let grid = new THREE.GridHelper(gridWidth, gridSubDiv);
    grid.position.y = -.4
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
      plane.position.y = 0;
      this.scene.add(plane);
      this.gridPanels[i] = plane;

      zPos += panelLength;
    }
  }

  setupGrassField() {
    let textureUrl  = 'textures/grasslight-small.jpg'
    let texture = new THREE.TextureLoader().load(textureUrl);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.y= gridSubDiv;
    texture.repeat.x= gridSubDiv;
    texture.anisotropy = this.renderer.getMaxAnisotropy()
    // build object3d
    let geometry  = new THREE.PlaneGeometry(gridWidth * 10, gridWidth * 10)
    let material  = new THREE.MeshPhongMaterial({
      map : texture,
      shininess: 10
    })
    let plane  = new THREE.Mesh(geometry, material)
    plane.rotateX(-Math.PI/2);
    plane.position.y = -0.2;
    this.scene.add(plane);

     // let nTufts  = 2000;
     // let positions = new Array(nTufts);
     // for(let i = 0; i < nTufts; i++){
     //   let position  = new THREE.Vector3();
     //   position.x  = (Math.random()-0.5)*gridWidth;
     //   position.z  = (Math.random()-0.5)*gridWidth;
     //   positions[i]  = position;
     // }
     // let mesh  = THREEx.createGrassTufts(positions);
     // this.scene.add(mesh);
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
    this.hudUpgrade.classList.remove('hud--hidden');

    this.initializeUpgradeButtons();
    this.initializeHudTexts();

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
    poppulationText.textContent = this.gameEngine.myPlayer.minions.length + "/" + this.gameEngine.myPlayer.poppulationCap;
    
    if(this.gameEngine.myPlayer.base !== null) {
      baseHealthText.textContent = Math.max(this.gameEngine.myPlayer.base.health, 0).toFixed(2) + " / " + this.gameEngine.myPlayer.base.maxHealth;
    } else {
      baseHealthText.textContent = "0";
    }
    
    minionBaseHealthText.textContent = Constants.minion.baseHealth + (Constants.minion.upgrades.health.amount * this.gameEngine.myPlayer.upgrades.minionBaseHealth);
    minionBaseAttackText.textContent = Constants.minion.baseAttack + (Constants.minion.upgrades.attack.amount * this.gameEngine.myPlayer.upgrades.minionBaseAttack);
    minionBaseAttackSpeedText.textContent = ((Constants.minion.baseAttackSpeed + (this.gameEngine.myPlayer.upgrades.minionBaseAttackSpeed * -Constants.minion.upgrades.attackSpeed.amount)) / 1000).toFixed(2) + 's';
    
    archerBaseAttackText.textContent = Constants.archer.baseAttack + (this.gameEngine.myPlayer.upgrades.archerBaseAttack * Constants.archer.upgrades.attack.amount);
    archerBaseAttackSpeedText.textContent = ((Constants.archer.baseAttackSpeed - (this.gameEngine.myPlayer.upgrades.archerBaseAttackSpeed * Constants.archer.upgrades.attackSpeed.amount)) / 1000).toFixed(2) + "s";
  }     

  renderLoop(timestamp) {
    this.checkGridIntersections();
    this.gameEngine.gameLoop(timestamp);

    if(this.started) {
      this.updateUI(timestamp);
    }
  }

  initializeHudTexts() {
    scoreText = document.getElementById('score');
    moneyText = document.getElementById('money');
    poppulationText = document.getElementById('poppulation');
    baseHealthText = document.getElementById('baseHealth');
    minionBaseHealthText = document.getElementById('minionBaseHealth');
    minionBaseAttackText = document.getElementById('minionBaseAttack');
    minionBaseAttackSpeedText = document.getElementById('minionBaseAttackSpeed');
    archerBaseAttackText = document.getElementById('archerBaseAttack');
    archerBaseAttackSpeedText = document.getElementById('archerBaseAttackSpeed');
  }

  initializeUpgradeButtons() {
    let gameView = this;
    
    baseHealthUpgrade =  document.getElementById('baseHealthUpgrade');
    baseHealthUpgrade.addEventListener('click', function() {
      gameView.gameEngine.myPlayer.upgradeBaseHealth();
    });

    minionBaseHealthUpgrade =  document.getElementById('minionBaseHealthUpgrade');
    minionBaseHealthUpgrade.addEventListener('click', function() {
      gameView.gameEngine.myPlayer.upgradeMinionHealth();
    });

    minionBaseAttackUpgrade =  document.getElementById('minionBaseAttackUpgrade');
    minionBaseAttackUpgrade.addEventListener('click', function() {
      gameView.gameEngine.myPlayer.upgradeMinionAttack();
    });

    minionBaseAttackSpeedUpgrade =  document.getElementById('minionBaseAttackSpeedUpgrade');
    minionBaseAttackSpeedUpgrade.addEventListener('click', function() {
      gameView.gameEngine.myPlayer.upgradeMinionAttackSpeed();
    });

    archerBaseAttackUpgrade =  document.getElementById('archerBaseAttackUpgrade');
    archerBaseAttackUpgrade.addEventListener('click', function() {
      gameView.gameEngine.myPlayer.upgradeWizardAttack();
    });

    archerBaseAttackSpeedUpgrade =  document.getElementById('archerBaseAttackSpeedUpgrade');
    archerBaseAttackSpeedUpgrade.addEventListener('click', function() {
      gameView.gameEngine.myPlayer.upgradeWizardAttackSpeed();
    });
  }
} 
