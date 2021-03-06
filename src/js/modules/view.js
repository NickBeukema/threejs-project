function handleResize(renderer, camera){
  let w = window.innerWidth;
  let h = window.innerHeight;
  renderer.setSize(w,h);
  camera.aspect = w/h;
  camera.updateProjectionMatrix();
}

function setupResizing(renderer, camera) {
  window.addEventListener('resize', () => {
    handleResize(renderer, camera);
  });
}

export function setupScreenView() {
  let scene = new THREE.Scene();
  let camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
  let renderer = new THREE.WebGLRenderer();
  renderer.shadowMapEnabled = true;
  renderer.shadowMapType = THREE.PCFSoftShadowMap
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  setupResizing(renderer, camera);

  return { scene, camera, renderer };
}

export function setupPerformance() {
  var rendererStats = new THREEx.RendererStats();
  rendererStats.domElement.style.position = 'absolute'
  rendererStats.domElement.style.left = '0px'
  rendererStats.domElement.style.bottom = '0px'
  document.body.appendChild( rendererStats.domElement )
  return rendererStats;
}
