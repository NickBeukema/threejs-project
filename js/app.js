!function e(t,i,n){function r(s,o){if(!i[s]){if(!t[s]){var h="function"==typeof require&&require;if(!o&&h)return h(s,!0);if(a)return a(s,!0);var l=new Error("Cannot find module '"+s+"'");throw l.code="MODULE_NOT_FOUND",l}var c=i[s]={exports:{}};t[s][0].call(c.exports,function(e){var i=t[s][1][e];return r(i||e)},c,c.exports,e,t,i,n)}return i[s].exports}for(var a="function"==typeof require&&require,s=0;s<n.length;s++)r(n[s]);return r}({1:[function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function r(e){requestAnimationFrame(r),p.renderLoop(e),a(),u.renderer.render(u.scene,u.camera)}function a(){f.textContent=d.myPlayer.score,y.textContent=d.myPlayer.money}var s=e("./modules/view"),o=e("./modules/game-engine"),h=n(o),l=e("./modules/game-view"),c=n(l),u=void 0,d=void 0,p=void 0,f=void 0,y=void 0;!function(){var e=(0,s.setupScreenView)(),t=e.scene,i=e.camera,n=e.renderer;u={scene:t,camera:i,renderer:n},d=new h.default(u),p=new c.default(u,d),f=document.getElementById("score"),y=document.getElementById("money"),window.addEventListener("click",function(){var e=p.getCurrentPanelIndex();e>=0&&d.myPlayer.spawnMinion(e)}),window.addEventListener("keypress",function(){d.computer.spawnMinion(3)}),r()}()},{"./modules/game-engine":5,"./modules/game-view":6,"./modules/view":9}],2:[function(e,t,i){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(i,"__esModule",{value:!0});var r=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),a=e("./constants"),s=function(){function e(t){n(this,e),this.determineAIFunction(t.personality),this.player=t.player,this.spawnInterval=1500,this.lastSpawn=0}return r(e,[{key:"canSpawn",value:function(e){return e-this.lastSpawn>this.spawnInterval}},{key:"runLoop",value:function(e){if(this.canSpawn(e)){var t=this.AIFunction();t>=0&&(this.player.spawnMinion(t),this.lastSpawn=e)}}},{key:"randomAI",value:function(e,t){return Math.floor(Math.random()*a.gridSubDiv)}},{key:"determineAIFunction",value:function(e){this.AIFunction=e?this[e]:this.randomAI}}]),e}();i.default=s},{"./constants":4}],3:[function(e,t,i){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(i,"__esModule",{value:!0});var r=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),a=e("./constants"),s=function(){function e(t){n(this,e),this.direction=t.direction,this.colliderList=t.colliderList,this.player=t.player,this.playerId=this.player.id,this.baseWidth=a.gridWidth,this.baseHeight=20,this.baseDepth=10,this.maxHealth=20,this.health=this.maxHealth,this.hitBoxBuffer=2,this.killReward={money:550,score:1e3},this.initializeView(this.direction),this.registerCollision()}return r(e,[{key:"initializeView",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:.25;this.viewObj=new THREE.Group;var i=new THREE.BoxGeometry(this.baseDepth,this.baseHeight,this.baseWidth),n=new THREE.MeshPhongMaterial({color:34816,specular:5592405,shininess:30}),r=new THREE.Mesh(i,n),s=new THREE.BoxGeometry(this.baseDepth+this.hitBoxBuffer,this.baseHeight+this.hitBoxBuffer,this.baseWidth+this.hitBoxBuffer),o=new THREE.MeshBasicMaterial({color:65535,transparent:!0,opacity:t}),h=new THREE.Mesh(s,o);this.healthBar=this.initializeHealthBar(),this.hitBox=h,this.viewObj.add(r),this.viewObj.add(h),this.viewObj.add(this.healthBar),this.viewObj.position.x=(-a.gridWidth/2-this.baseDepth/2)*this.direction,this.viewObj.position.y=this.baseHeight/2,this.hitBox.userData.object=this,this.hitBox.userData.player=this.player}},{key:"initializeHealthBar",value:function(){this._healthBarLength=a.gridWidth/10,this._healthBarWidth=a.gridWidth/150;var e=new THREE.BoxGeometry(this._healthBarLength,this._healthBarWidth,this._healthBarWidth),t=new THREE.MeshBasicMaterial({color:65280}),i=new THREE.Mesh(e,t);i.name="FullHealthBar";var n=new THREE.BoxGeometry(.99*this._healthBarLength,.9*this._healthBarWidth,.9*this._healthBarWidth),r=new THREE.MeshBasicMaterial({color:16711680}),s=new THREE.Mesh(n,r);s.name="EmptyHealthBar";var o=new THREE.Group;return o.add(i),o.add(s),o.position.y=this.baseHeight+5,o}},{key:"updateHealthBar",value:function(){var e=this.health/this.maxHealth,t=-(1-e)*this._healthBarLength/2,i=this.healthBar.getObjectByName("FullHealthBar");i.scale.x=e,i.position.x=t}},{key:"registerCollision",value:function(){this.hitBox.geometry.computeBoundingBox();var e=this.hitBox.geometry.boundingBox.clone();this.collider=new THREEx.ColliderBox3(this.hitBox,e),this.colliderList.push(this.collider)}},{key:"runLoop",value:function(){this.collider.update(),this.updateHealthBar()}}]),e}();i.default=s},{"./constants":4}],4:[function(e,t,i){"use strict";Object.defineProperty(i,"__esModule",{value:!0});i.xPositive=1,i.xNegative=-1,i.gridWidth=128,i.gridSubDiv=16},{}],5:[function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(i,"__esModule",{value:!0});var a=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),s=e("./player"),o=n(s),h=e("./ai-player"),l=n(h),c=e("./constants"),u=function(){function e(t){r(this,e),this.state={},this.scene=t.scene,this.colliderSystem=new THREEx.ColliderSystem,this.colliderList=[],this.playerId=0,this.initializePlayers()}return a(e,[{key:"initializePlayers",value:function(){this.myPlayer=new o.default({type:"human",direction:c.xPositive,colliderList:this.colliderList,scene:this.scene,id:this.playerId++}),this.computer=new o.default({type:"computer",direction:c.xNegative,colliderList:this.colliderList,scene:this.scene,id:this.playerId++}),this.AI=new l.default({player:this.computer}),this.playerAI=new l.default({player:this.myPlayer}),this.state.players=[this.myPlayer,this.computer]}},{key:"gameLoop",value:function(e){this.AI&&this.AI.runLoop(e),this.playerAI&&this.playerAI.runLoop(e),this.state.players.forEach(function(t){return t.runLoop(e)}),this.colliderSystem.computeAndNotify(this.colliderList)}}]),e}();i.default=u},{"./ai-player":2,"./constants":4,"./player":8}],6:[function(e,t,i){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(i,"__esModule",{value:!0});var r=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),a=e("./constants"),s=(new THREE.TextureLoader).load("textures/stone.jpg");s.repeat.set(10,10),s.wrapS=THREE.RepeatWrapping,s.wrapT=THREE.RepeatWrapping;var o=function(){function e(t,i){n(this,e),this.scene=t.scene,this.camera=t.camera,this.renderer=t.renderer,this.gameEngine=i,this.setupGrid(),this.setupLight(),this.mouse={x:-1e4,y:0};var r=a.gridWidth/2;this.camera.position.z=2*r,this.camera.position.y=1.5*r,this.camera.lookAt(this.scene.position),this.raycaster=new THREE.Raycaster,this.currentHoveredPanel=null,this.setupMouseEvent()}return r(e,[{key:"setupLight",value:function(){var e=new THREE.AmbientLight(6710886,3),t=new THREE.PointLight(8947848);t.position.set(3,3,3),this.scene.add(e),this.scene.add(t)}},{key:"setupGrid",value:function(){var e=new THREE.PlaneGeometry(a.gridWidth,a.gridWidth),t=new THREE.MeshBasicMaterial({map:s}),i=new THREE.Mesh(e,t);i.rotation.x=-.5*Math.PI,i.position.y=-.3,this.scene.add(i);var n=new THREE.GridHelper(a.gridWidth,a.gridSubDiv);this.scene.add(n),this.gridPanels={};for(var r=a.gridWidth/a.gridSubDiv,o=(a.gridWidth/2-r/2)*-1,h=0;h<a.gridSubDiv;h++){var l=new THREE.PlaneGeometry(a.gridWidth,r),c=new THREE.MeshBasicMaterial({transparent:!0,opacity:0}),u=new THREE.Mesh(l,c);u.rotation.x=-.5*Math.PI,u.position.z=o,u.position.y=-.2,this.scene.add(u),this.gridPanels[h]=u,o+=r}}},{key:"checkGridIntersections",value:function(){this.raycaster.setFromCamera(this.mouse,this.camera);var e=Object.values(this.gridPanels),t=this.raycaster.intersectObjects(e);if(e.forEach(function(e){e.material.color.setHex(6710886),e.material.opacity=0}),t.length>0){var i=t[0].object;i.material.color.setHex(16711680),i.material.opacity=.5,this.currentHoveredPanel=i}else this.currentHoveredPanel&&(this.currentHoveredPanel=null)}},{key:"getCurrentPanelIndex",value:function(){if(this.currentHoveredPanel)for(var e=Object.values(this.gridPanels),t=0;t<a.gridSubDiv;t++)if(this.currentHoveredPanel===e[t])return t}},{key:"setupMouseEvent",value:function(){var e=this.mouse;window.addEventListener("mousemove",function(t){e.x=event.clientX/window.innerWidth*2-1,e.y=2*-(event.clientY/window.innerHeight)+1})}},{key:"renderLoop",value:function(e){this.checkGridIntersections(),this.gameEngine.gameLoop(e)}}]),e}();i.default=o},{"./constants":4}],7:[function(e,t,i){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(i,"__esModule",{value:!0});var r=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),a=e("./constants"),s=function(){function e(t){n(this,e),this.direction=t.direction,this.colliderList=t.colliderList,this.id=t.id,this.playerId=t.playerId,this.player=t.player,this.maxHealth=10,this.health=this.maxHealth,this.attackStrength=3,this.attackSpeed=500,this.defaultSpeed=.5,this.speed=this.defaultSpeed,this.attackProperties={lastTimeStamp:null,attackTime:0},this.killReward={money:15,score:10},this.destroy=!1,this.attack=!1,this.initializeView(t.startingZ),this.registerCollision()}return r(e,[{key:"initializeView",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:.25;this.viewObj=new THREE.Group;var i=new THREE.BoxGeometry(2,2,2),n=new THREE.MeshPhongMaterial({color:65280,specular:5592405,shininess:30}),r=new THREE.Mesh(i,n),s=new THREE.BoxGeometry(3,3,3),o=new THREE.MeshBasicMaterial({color:65535,transparent:!0,opacity:t}),h=new THREE.Mesh(s,o);this.healthBar=this.initializeHealthBar(),h.add(this.healthBar),h.add(r),this.viewObj=h,this.hitBox=this.viewObj;var l=e*(a.gridWidth/a.gridSubDiv)-a.gridWidth/2+a.gridWidth/a.gridSubDiv/2,c=a.gridWidth/2*-this.direction;this.viewObj.position.z=l,this.viewObj.position.x=c,this.viewObj.position.y=2,this.hitBox.userData.object=this,this.hitBox.userData.player=this.player}},{key:"initializeHealthBar",value:function(){this._healthBarWidth=2;var e=new THREE.BoxGeometry(this._healthBarWidth,.3,.3),t=new THREE.MeshBasicMaterial({color:65280}),i=new THREE.Mesh(e,t);i.name="FullHealthBar";var n=new THREE.BoxGeometry(this._healthBarWidth,.2,.2),r=new THREE.MeshBasicMaterial({color:16711680}),a=new THREE.Mesh(n,r);a.name="EmptyHealthBar";var s=new THREE.Group;return s.add(i),s.add(a),s.position.y=4,s}},{key:"isObjectLoaded",value:function(e){return 0===e.position.x&&0===e.position.y&&0===e.position.z}},{key:"registerCollision",value:function(){var e=this;this.hitBox.geometry.computeBoundingBox();var t=this.hitBox.geometry.boundingBox.clone();this.collider=new THREEx.ColliderBox3(this.hitBox,t),this.colliderList.push(this.collider),this.collider.addEventListener("contactEnter",function(t){t.object3d.userData.player.id!==e.playerId&&(e.speed=0,e.attack=!0,e.currentTarget=t.object3d.userData.object)}),this.collider.addEventListener("contactStay",function(t){t.object3d.userData.player.id!==e.playerId&&null===e.currentTarget&&(e.speed=0,e.attack=!0,e.currentTarget=t.object3d.userData.object)}),this.collider.addEventListener("contactRemoved",function(t){e.speed=e.defaultSpeed,e.attack=!1,e.currentTarget=null})}},{key:"getAttackValue",value:function(){return Math.random()*this.attackStrength}},{key:"updateHealthBar",value:function(){var e=this.health/this.maxHealth,t=-(1-e)*this._healthBarWidth/2,i=this.healthBar.getObjectByName("FullHealthBar");i.scale.x=e,i.position.x=t}},{key:"runLoop",value:function(e){this.attackProcedure(e),this.viewObj.position.x+=this.speed*this.direction,this.collider.update(),this.updateHealthBar()}},{key:"attackProcedure",value:function(e){if(!(this.health<=0)){if(null!=this.attackProperties.lastTimeStamp&&this.attack){var t=e-this.attackProperties.lastTimeStamp;this.attackProperties.attackTime+=t,this.attackProperties.lastTimeStamp=e,this.attackLoop()}else this.attack&&(this.attackProperties.attackTime=0,this.attackProperties.lastTimeStamp=e,this.attackLoop());this.attackProperties.lastTimeStamp=e}}},{key:"attackLoop",value:function(){null!==this.currentTarget&&this.currentTarget.playerId!==this.playerId&&(this.attackProperties.attackTime<this.attackSpeed||(this.currentTarget.health-=this.getAttackValue(),this.currentTarget.health<=0&&(this.player.processReward(this.currentTarget.killReward),this.currentTarget.attack=!1,this.currentTarget.destroy=!0,this.currentTarget=null),this.attackProperties.attackTime=0,this.attackProperties.lastTimeStamp=null))}}]),e}();i.default=s},{"./constants":4}],8:[function(e,t,i){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function r(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(i,"__esModule",{value:!0});var a=function(){function e(e,t){for(var i=0;i<t.length;i++){var n=t[i];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,i,n){return i&&e(t.prototype,i),n&&e(t,n),t}}(),s=e("./minion"),o=n(s),h=e("./base"),l=n(h),c=function(){function e(t){r(this,e),this.type=t.type,this.id=t.id,this.direction=t.direction,this.colliderList=t.colliderList,this.scene=t.scene,this.minionId=0,this.setupGameState(),this.spawnBase()}return a(e,[{key:"spawnBase",value:function(){this.base=new l.default({direction:this.direction,colliderList:this.colliderList,player:this}),this.scene.add(this.base.viewObj)}},{key:"spawnMinion",value:function(e){if(!(this.money>=this.minionCost))return null;this.money-=this.minionCost;var t=new o.default({id:this.minionId++,playerId:this.id,direction:this.direction,startingZ:e,colliderList:this.colliderList,player:this});this.minions.push(t),this.scene.add(t.viewObj)}},{key:"processReward",value:function(e){var t=this;Object.keys(e).forEach(function(i){t[i]+=e[i]})}},{key:"runLoop",value:function(e){var t=this;null!==this.base&&(this.base.runLoop(),this.base.destroy&&this.destroyBase()),this.minions.forEach(function(i,n){i.runLoop(e),i.destroy&&t.destroyMinion(i,n)})}},{key:"destroyMinion",value:function(e,t){this.scene.remove(e.viewObj),this.colliderList.splice(this.findColliderIndex(e.collider.id),1),this.minions.splice(t,1)}},{key:"destroyBase",value:function(){this.scene.remove(this.base.viewObj),this.colliderList.splice(this.findColliderIndex(this.base.collider.id),1),this.base=null}},{key:"findColliderIndex",value:function(e){for(var t=-1,i=0;i<this.colliderList.length;i++)this.colliderList[i].id===e&&(t=i);return t}},{key:"setupGameState",value:function(){this.minions=[],this.score=0,this.money=400,this.minionCost=20}}]),e}();i.default=c},{"./base":3,"./minion":7}],9:[function(e,t,i){"use strict";function n(e,t){var i=window.innerWidth,n=window.innerHeight;e.setSize(i,n),t.aspect=i/n,t.updateProjectionMatrix()}function r(e,t){window.addEventListener("resize",function(){n(e,t)})}function a(){var e=new THREE.Scene,t=new THREE.PerspectiveCamera(75,window.innerWidth/window.innerHeight,.1,1e3),i=new THREE.WebGLRenderer;return i.setSize(window.innerWidth,window.innerHeight),document.body.appendChild(i.domElement),r(i,t),{scene:e,camera:t,renderer:i}}Object.defineProperty(i,"__esModule",{value:!0}),i.setupScreenView=a},{}]},{},[1]);
//# sourceMappingURL=maps/app.js.map