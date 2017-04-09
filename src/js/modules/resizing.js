export function handleResize(renderer, camera){
  let w = window.innerWidth;
  let h = window.innerHeight;
  renderer.setSize(w,h);
  camera.aspect = w/h;
  camera.updateProjectionMatrix();
}
