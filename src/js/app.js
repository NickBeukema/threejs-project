var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


var lightAmbient = new THREE.AmbientLight(0x666666);
var lightSource = new THREE.PointLight(0x888888);
lightSource.position.set(3, 3, 3);
scene.add(lightAmbient);
scene.add(lightSource);


var geometry = new THREE.BoxGeometry(1,1,1);
var material = new THREE.MeshPhongMaterial({color: 0x00ff00, specular: 0x555555, shininess: 30 });
var cube = new THREE.Mesh(geometry, material);

scene.add(cube);

camera.position.z = 4;

function render() {
  requestAnimationFrame(render);
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}

render();
