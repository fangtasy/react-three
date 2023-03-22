import * as THREE from 'three';
import { City } from './utils/city';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const initScene = () => {
  const canvas = document.getElementById('canvas-three');

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(0,500,1000)
  scene.add(camera);

  const controls = new OrbitControls(camera, canvas);

  controls.enableDamping = true;
  controls.enableZoom = true;
  controls.minDistance = 100;
  controls.maxDistance = 2000;


  scene.add(new THREE.AmbientLight(0xadadad))
  const directionLight = new THREE.DirectionalLight(0xffffff);
  directionLight.position.set(0, 0, 0);
  scene.add(directionLight);
  // [
  //   [0,0,0],
  //   [10,0,0],
  //   [20,0,0],
  //   [30,0,0],
  //   [0,0,-10],
  //   [0,0,-20],
  //   [0,0,-40],
  //   [0,0,-80],
  //   [80,0,-80],
  //   [200,0,-200],
  //   [300,0,-310],
  //   [400,0,-410],
  //   [420,0,-430],
  //   [440,0,-410],
  //   [500,0,-300],
  //   [630,0,-80],
  // ].forEach(item => {
  //   const dotGeometry = new THREE.BufferGeometry();
  //   const dotMaterial = new THREE.PointsMaterial( { size: 10, color: 0xffffff } );
  //   dotGeometry.setAttribute( 'position', new THREE.Float32BufferAttribute( item, 3 ) );
  //   const point = new THREE.Points(dotGeometry, dotMaterial)
  
  //   scene.add(point);
  // })
  

  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(new THREE.Color(0x000000), 1);

  const city = new City(scene, camera);
  city.loadCity('/src/model/东方明珠.fbx');
  
  const clock = new THREE.Clock();

  const start = () => {
    city.start(clock.getDelta());
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(start);
  }

  start();

  window.addEventListener('resize', ()=> {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  })
}