import './style.css'

import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import * as TWEEN from '@tweenjs/tween.js' // For animation

// For OrbitControls
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { data } from '/dataHelper.js'

data.fetchExpensesData(callback, 'https://script.googleusercontent.com/macros/echo?user_content_key=mnMJjdbtxNsXVU5DkcC1R8jSHg1ThG-YMT2eMrP-rfWHrU9M9XpGmej903Briwzw2WXnQwO2CENmR_V07SkrgroyENcqPug3m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnHoKtwo45TyEP8jZyiOHuyClgs7H6_4QCH2QqyKLMawJgl8uPidZdGUUz3WljvP3LjHrMf2WZbZv8o61ayr3QD7dQAeXmQuFV9z9Jw9Md8uu&lib=MRuKKanBoH98B8EySqUsczSsRzDuZoC7Y');

function callback(){
  init();
  loadPiggyBank();
  loadCoin();
  createNav();
  animate()
}

// var init
const scene = new THREE.Scene();
const aspect = window.innerWidth / window.innerHeight;
const frustumSize = 50;
const camera = new THREE.OrthographicCamera( frustumSize * aspect / - 2, frustumSize * aspect / 2, frustumSize / 2, frustumSize / - 2, 1, 1000 );
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});
const pointer = new THREE.Vector2(1,1); // to avoid the piggy bank from being selected at the beginning
const raycaster = new THREE.Raycaster();

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff,0.20);    
const pointLightForPiggy = new THREE.PointLight(0xffffff,1.4, 250);
const keyLightForPiggy = new THREE.DirectionalLight(0xffffff,1.6);
const highLightForPiggy = new THREE.DirectionalLight(0xffffff,1.4);
const fillLightForPiggy = new THREE.DirectionalLight(0xffffff,0.6);

// For OrbitControls
// const controls = new OrbitControls(camera, renderer.domElement);

function init(){

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.setZ(160);
  // camera.position.setY(30);

  scene.background = new THREE.Color( 0xff6347 );

  pointLightForPiggy.position.set(0, -20, 200);
  keyLightForPiggy.position.set(100, 20, 160);
  highLightForPiggy.position.set(-120, 120, 0);
  fillLightForPiggy.position.set(-120, -20, 200);
  scene.add(pointLightForPiggy, ambientLight, keyLightForPiggy, highLightForPiggy, fillLightForPiggy);

  window.addEventListener( 'click', onClick );
  window.addEventListener( 'pointermove', onPointerMove );
  window.addEventListener( 'resize', onWindowResize );
}

async function loadFont(currentMonth) {
  const fontLoader = new FontLoader();
  await fontLoader.load(
    'assets/open_sans_regular.json',
    (font) => {
      const textGeometry = new TextGeometry(data.expenses[currentMonth]['Year'].toString() + ' ' + data.expenses[currentMonth]['Month'].toString(), {
        font: font,
        size: 3,
        height: 1,
        curveSegments: 5,
        bevelEnabled: true,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelOffset: 0,
        bevelSegments: 4,
      });
      textGeometry.center();
      makeInstanced(textGeometry);
    }
  );
}

function makeInstanced( geometry ) {
  const x = 30;
  const y = 40;
  let count = 0;
  const gap = 1.5;
  const total = x*y;
  const matrix = new THREE.Matrix4();
  const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
  const mesh = new THREE.InstancedMesh( geometry, material, total );
  
  // get the mesh actual dimensions
  const box = new THREE.Box3().setFromObject( mesh );
  const size = new THREE.Vector3();
  box.getSize( size );

  for ( let i = 0; i < total; i ++ ) {
    matrix.makeTranslation( (-(size.x*x)-((x-1)*gap))/2 + size.x/2 + i % x * (size.x + gap), y*size.y/2 - size.y/2 + count * -size.y, 0 );
    mesh.setMatrixAt( i, matrix );
    if (i%x === x-1) count++;
  }
  
  scene.add( mesh );
}

async function loadPiggyBank() {
  const loader = new GLTFLoader();
  await loader.load(
    'assets/piggy_bank/scene.gltf',
    function ( gltf ) {
      scene.add( gltf.scene );
      // change the color of the piggy bank
      gltf.scene.position.set(0, -9.5, 120);
      gltf.scene.scale.set(6.5, 6.5, 6.5);
      gltf.scene.rotation.set(0, 0.8, 0);

      var newMaterial = new THREE.MeshStandardMaterial({color: 0xff6347});

      gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
          // console.log(child);
          // change the body only
          if (child.name === 'Object_4') {
            child.material = newMaterial;
          }
          child.castShadow = true;
          child.receiveShadow = true;
        }
      } );

      keyLightForPiggy.target = gltf.scene;
      highLightForPiggy.target = gltf.scene;
      fillLightForPiggy.target = gltf.scene;

      loadFont(data.currentMonth);

    },
    function ( xhr ) {
      console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

    },
    function ( error ) {
      console.log( 'An error happened' );
    }

  );
}

async function loadCoin() {
  const loader = new GLTFLoader();
  await loader.load(
    'assets/coin/scene.gltf',
    function ( gltf ) {
      scene.add( gltf.scene );
      gltf.scene.position.set(0, 0, 120);
      gltf.scene.scale.set(20, 20, 20);
      gltf.scene.rotation.set(0, 0, 0);
      gltf.scene.traverse( function ( child ) {
        if ( child.isMesh ) {
          child.castShadow = true;
          child.receiveShadow = true;
          // reduce the reflectivity of the coin
          child.material.metalness = 1;
        }
      } );
    },
    undefined,
    function ( error ) {
      console.error( error );
    }
  );
}


function createNav(){
  // create button
  let leftArr = document.createElement('div');
  leftArr.innerHTML = '<';
  leftArr.className = 'nav';
  leftArr.addEventListener('click', () => {
    if (data.currentMonth === 0) return;
    console.log('left clicked');
    clean();
    data.currentMonth--;
    loadFont(data.currentMonth);
    resetObjects();
  });
  document.getElementById('info').appendChild(leftArr);

  let rightArr = document.createElement('div');
  rightArr.innerHTML = '>';
  rightArr.className = 'nav';
  rightArr.addEventListener('click', () => {
    if (data.currentMonth === data.totalMonths) return;
    console.log('right clicked');
    clean();
    data.currentMonth++;
    loadFont(data.currentMonth);
    resetObjects();
  });
  document.getElementById('info').appendChild(rightArr);
}

function resetObjects() {
  // camera.position.setY(0);
  scene.getObjectByName('Object_4').parent.position.setY(0);
  scene.getObjectByName('Coin_Coin_0').scale.set(1, 1, 1);
}

function clean() {

  const meshes = [];

  scene.traverse( function ( object ) {

    if ( object.isMesh ) meshes.push( object );

  } );

  for ( let i = 0; i < meshes.length; i ++ ) {

    const mesh = meshes[ i ];
    mesh.material.dispose();
    mesh.geometry.dispose();

    scene.remove( mesh );

  }

}

function resetScaleForPiggyBank() {
  if(scene.getObjectByName('Object_4')) {
    scene.getObjectByName('Object_4').parent.scale.set(1, 1, 1);
  }
}

function hover() {
  raycaster.setFromCamera( pointer, camera );
  const intersects = raycaster.intersectObjects( scene.children, true );
  if(intersects.length > 0) {
    const object = intersects[0].object;
    if (object.isMesh && (object.name === 'Object_4' || object.name === 'Object_5')) {
      scene.getObjectByName('Object_4').parent.scale.set(1.2, 1.2, 1.2);
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = 'default';
    }
  }
}

function onClick(event){
  raycaster.setFromCamera( pointer, camera );
  const intersects = raycaster.intersectObjects( scene.children, true );
  for (let i = 0; i < intersects.length; i++) {
    const object = intersects[i].object;
    if (object.isMesh && (object.name === 'Object_4' || object.name === 'Object_5')) {
      tween.start();
      tween2.start();
      console.log('clicked');
    }
  }
}

function onPointerMove(event) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onWindowResize() {

  const aspect = window.innerWidth / window.innerHeight;

  camera.left = - frustumSize * aspect / 2;
  camera.right = frustumSize * aspect / 2;
  camera.top = frustumSize / 2;
  camera.bottom = - frustumSize / 2;

  camera.updateProjectionMatrix();

  renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate(t) {
  TWEEN.update(t);
  setTimeout( function() {

    requestAnimationFrame(animate);  

  }, 1000 / 60 ); // 60 fps

  resetScaleForPiggyBank();
  hover();

  renderer.render(scene, camera);
}

// bounce in out
const tween = new TWEEN.Tween({y:0})
  .to({ y: -3.5}, 1000)
  .delay(100)
  .easing(TWEEN.Easing.Back.InOut)
  .onUpdate((coords) => {
    scene.getObjectByName('Object_4').parent.position.y = coords.y;
  });

  const tween2 = new TWEEN.Tween({x:1, y:1, z:1})
  .to({x:3, y:3, z:3}, 1000)
  .easing(TWEEN.Easing.Back.In)
  .onUpdate((scales) => {
    scene.getObjectByName('Coin_Coin_0').scale.set(scales.x, scales.y, scales.z);
  });
