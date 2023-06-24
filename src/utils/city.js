import { loadFBX } from "./fbxLoader";
import * as THREE from 'three'
import { Tween } from "@tweenjs/tween.js";
import Background from "../background";
import { SurroundLine } from '../effect/surroundLine';
import { Radar } from '../effect/radar';
import { Road } from '../effect/road';

export class City {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    // this.loadCity();

    this.tweenPosition = null;
    this.tweenRotation = null;
    this.height = {
      value : 5
    };
    this.time = {
      value: 0,
    }
  }

  async loadCity(url) {
    const obj = await loadFBX(url);
    console.log('fbx obj ', obj);
    obj.traverse((child)=>{
      console.log('child ', child,'this.time ', this.time)
      if (child.isMesh) {
        new SurroundLine(this.scene, child, this.height, this.time)
      }
    })
    // this.scene.add(obj);
    // // const material = new THREE.MeshLambertMaterial({ color: '#ff0000'})
    // const mesh = new THREE.Mesh(this.child.geometry, material);
    // // let mesh inherit the position, rotation, scale form child 
    // mesh.position.copy(this.child.position);
    // mesh.rotation.copy(this.child.rotation);
    // // mesh.scale.copy(this.child.scale)
    // this.scene.add(mesh);
    this.initEffect()
  }

  initEffect() {
    new Background(this.scene, '/src/assets/black-bg.png');
    new Radar(this.scene, this.time);
    new Road(this.scene, this.time);

    this.addClick();
  }

  addClick() {
    let flag = true;
    document.onmousedown = () => {
      flag = true;

      document.onmousemove = () => {
        setTimeout(() => flag = false, 100 ) 
      }
    }

    document.onmouseup = (event) => {
      if (flag) {
        this.clickEvent(event)
      }
      document.onmousemove = null;
    }
  }

  clickEvent(event) {
    // 获取到浏览器坐标
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 创建设备坐标（三维）
    const standardVector = new THREE.Vector3(x, y, 0.5);

    // 转化为世界坐标
    const worldVector = standardVector.unproject(this.camera);

    // 做序列化
    const ray = worldVector.sub(this.camera.position).normalize();

    // 如何实现点击选中
    // 创建一个射线发射器，用来发射一条射线
    const raycaster = new THREE.Raycaster(this.camera.position, ray);

    // 返回射线碰撞到的物体
    const intersects = raycaster.intersectObjects(this.scene.children, true);

    let point3d = null;
    if (intersects.length) {
      point3d = intersects[0]
    }

    if (point3d) {
      const proportion = 3;
      // 开始动画来修改观察点
      const time = 1000;

      this.tweenPosition = new Tween(this.camera.position).to({
        x: point3d.point.x * proportion,
        y: point3d.point.y * proportion,
        z: point3d.point.z * proportion,
      }, time).start();
      this.tweenRotation = new Tween(this.camera.rotation).to({
        x: this.camera.rotation.x,
        y: this.camera.rotation.y,
        z: this.camera.rotation.z,
      }, time).start();
    }
  }

  start(delta) {
    if (this.tweenPosition && this.tweenRotation) {
      this.tweenPosition.update()
      this.tweenRotation.update()
    }
    this.time.value += delta;
    // console.log('this.time v', this.time.value)
    this.height.value += 0.5
    if (this.height.value > 500) {
      this.height.value = 5
    }
  }
}