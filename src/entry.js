import * as THREE from 'three';
import { City } from './utils/city';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export const initScene = () => {
  const canvas = document.getElementById('canvas-three');

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(-200,250,800)
  scene.add(camera);

  const controls = new OrbitControls(camera, canvas);

  controls.enableDamping = true;
  controls.enableZoom = true;
  controls.minDistance = 100;
  controls.maxDistance = 1000;


  scene.add(new THREE.AmbientLight(0xadadad))
  const directionLight = new THREE.DirectionalLight(0xffffff);
  directionLight.position.set(0, 1.0, 5.0);
  scene.add(directionLight);

  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setClearColor(new THREE.Color(0x000000), 1);

  const city = new City(scene, camera);
  city.loadCity('/src/model/minhang.fbx');
  const start = () => {
    city.start();
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