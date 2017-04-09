import { setupView } from './modules/view';

// Globals
let globals;

let gameState;

// Shapes
var cube;

function init() {
  let { scene, camera, renderer } = setupView();
  globals = { scene, camera, renderer };

  var lightAmbient = new THREE.AmbientLight(0x666666);
  var lightSource = new THREE.PointLight(0x888888);
  lightSource.position.set(3, 3, 3);
  globals.scene.add(lightAmbient);
  globals.scene.add(lightSource);

  var geometry = new THREE.BoxGeometry(1,1,1);
  var material = new THREE.MeshPhongMaterial({color: 0x00ff00, specular: 0x555555, shininess: 30 });
  cube = new THREE.Mesh(geometry, material);

  globals.scene.add(cube);

  globals.camera.position.z = 4;
  render();
}

function render() {
  requestAnimationFrame(render);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  globals.renderer.render(globals.scene, globals.camera);
}

init();
