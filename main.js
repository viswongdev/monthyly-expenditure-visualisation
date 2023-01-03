import './style.css'

import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'

import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

// For OrbitControls
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

let totalMonths, currentMonth;

// For loading the data from Google Sheet
let expenses = [];
let fetch_data = fetch('https://script.googleusercontent.com/macros/echo?user_content_key=mnMJjdbtxNsXVU5DkcC1R8jSHg1ThG-YMT2eMrP-rfWHrU9M9XpGmej903Briwzw2WXnQwO2CENmR_V07SkrgroyENcqPug3m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnHoKtwo45TyEP8jZyiOHuyClgs7H6_4QCH2QqyKLMawJgl8uPidZdGUUz3WljvP3LjHrMf2WZbZv8o61ayr3QD7dQAeXmQuFV9z9Jw9Md8uu&lib=MRuKKanBoH98B8EySqUsczSsRzDuZoC7Y')
.then(res => res.json())
.then(data => {
  // console.log(data);
  // formatting the data
  data.GoogleSheetData.shift();
  let keyName = data.GoogleSheetData[0];
  data.GoogleSheetData.shift();
  data.GoogleSheetData.forEach((item) => {
    // console.log(item);
    let obj = {};
    item.forEach((value, index) => {
      // console.log(keyName[index]);
      if (keyName[index] === 'Month') {
        // console.log(value);
        switch (value) {
          case 1:
            value = 'Jan';
            break;
          case 2:
            value = 'Feb';
            break;
          case 3:
            value = 'Mar';
            break;
          case 4:
            value = 'Apr';
            break;
          case 5:
            value = 'May';
            break;
          case 6:
            value = 'Jun';
            break;
          case 7:
            value = 'Jul';
            break;
          case 8:
            value = 'Aug';
            break;
          case 9:
            value = 'Sep';
            break;
          case 10:
            value = 'Oct';
            break;
          case 11:
            value = 'Nov';
            break;
          case 12:
            value = 'Dec';
            break;
          default:
            break;
        }
        obj[keyName[index]] = value;
      } else {
        obj[keyName[index]] = Math.round(value);
      }
    });
    expenses.push(obj);
  });
  totalMonths = expenses.length - 1;
  currentMonth = totalMonths;
  console.log(expenses);
  init();
  animate();
  loadFont(currentMonth);

  // create button
  let leftArr = document.createElement('div');
  leftArr.innerHTML = '&larr;';
  leftArr.className = 'nav';
  leftArr.addEventListener('click', () => {
    if (currentMonth === 0) return;
    console.log('left clicked');
    currentMonth--;
    loadFont(currentMonth);
  });
  document.getElementById('info').appendChild(leftArr);

  let rightArr = document.createElement('div');
  rightArr.innerHTML = '&rarr;';
  rightArr.className = 'nav';
  rightArr.addEventListener('click', () => {
    if (currentMonth === totalMonths) return;
    console.log('right clicked');
    currentMonth++;
    loadFont(currentMonth);
  });
  document.getElementById('info').appendChild(rightArr);
});

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({
    canvas: document.querySelector('#bg'),
  });

  // const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
  const material = new THREE.MeshStandardMaterial({ color: 0xFF6347 });
  // const torus = new THREE.Mesh(geometry, material);

function init(){

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.position.setZ(30);

  // scene.add(torus);

  const pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(20, 20, 20);

  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(pointLight, ambientLight);

  const lightHelper = new THREE.PointLightHelper(pointLight);
  const gridHelper = new THREE.GridHelper(200, 50);
  scene.add(lightHelper, gridHelper);

  // For OrbitControls
  // const controls = new OrbitControls(camera, renderer.domElement);
}

function loadFont(currentMonth) {
  const fontLoader = new FontLoader();
  fontLoader.load(
    'node_modules/three/examples/fonts/helvetiker_regular.typeface.json',
    (font) => {
      const textGeometry = new TextGeometry(expenses[currentMonth]['Year'].toString() + ' ' + expenses[currentMonth]['Month'].toString(), {
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
      const textMaterial = new THREE.MeshStandardMaterial({ color: 0xff6347 });
      const text = new THREE.Mesh(textGeometry, textMaterial);
      // remove previous text
      scene.remove(scene.children[scene.children.length - 1]);
      scene.add(text);
    }
  );
}

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

function animate() {
  requestAnimationFrame(animate);

  // resize canvas that maintains the camera aspect ratio
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;

  // controls.update();

  renderer.render(scene, camera);
}
