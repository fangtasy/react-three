import * as THREE from 'three';

export default class Background {
  constructor(scene, url) {
    this.scene = scene;
    this.url = url;
    this.init();
  }

  init() {
    const loader = new THREE.TextureLoader()

    const geometry = new THREE.SphereGeometry(5000, 32,32);
    const material = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: loader.load(this.url)
    })

    const sphere = new THREE.Mesh(geometry, material);

    sphere.position.copy({ x: 0, y: 0, z: 0})
    this.scene.add(sphere);
  }
}