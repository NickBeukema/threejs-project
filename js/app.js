!function e(n,i,r){function t(d,s){if(!i[d]){if(!n[d]){var a="function"==typeof require&&require;if(!s&&a)return a(d,!0);if(o)return o(d,!0);var u=new Error("Cannot find module '"+d+"'");throw u.code="MODULE_NOT_FOUND",u}var c=i[d]={exports:{}};n[d][0].call(c.exports,function(e){var i=n[d][1][e];return t(i||e)},c,c.exports,e,n,i,r)}return i[d].exports}for(var o="function"==typeof require&&require,d=0;d<r.length;d++)t(r[d]);return t}({1:[function(e,n,i){"use strict";function r(){requestAnimationFrame(r),t.rotation.x+=.01,t.rotation.y+=.01,a.render(d,s)}var t,o=e("./modules/resizing"),d=void 0,s=void 0,a=void 0;!function(){d=new THREE.Scene,s=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3),a=new THREE.WebGLRenderer,a.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(a.domElement),window.addEventListener("resize",function(){(0,o.handleResize)(a,s)});var e=new THREE.AmbientLight(6710886),n=new THREE.PointLight(8947848);n.position.set(3,3,3),d.add(e),d.add(n);var i=new THREE.BoxGeometry(1,1,1),u=new THREE.MeshPhongMaterial({color:65280,specular:5592405,shininess:30});t=new THREE.Mesh(i,u),d.add(t),s.position.z=4,r()}()},{"./modules/resizing":2}],2:[function(e,n,i){"use strict";function r(e,n){console.log("triggered");var i=window.innerWidth,r=window.innerHeight;e.setSize(i,r),n.aspect=i/r,n.updateProjectionMatrix()}Object.defineProperty(i,"__esModule",{value:!0}),i.handleResize=r},{}]},{},[1]);
//# sourceMappingURL=maps/app.js.map
