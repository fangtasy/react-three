import * as THREE from 'three';
import { color } from '../config';

export class SurroundLine {
  constructor(scene, child, height, time) {
    this.scene = scene;
    this.child = child;
    this.height = height;
    this.time =  time;

    this.meshColor = color.mesh; // bottom color
    this.headColor = color.head;

    this.computedMesh();
    this.createMesh();

    this.createLine(); // 外围线条
  }

  computedMesh() {
    this.child.geometry.computeBoundingBox();
    this.child.geometry.computeBoundingSphere();
  }

  createMesh() {
    // this.computedMesh();

    const {max, min} = this.child.geometry.boundingBox;
    const size = max.z - min.z; // get heigt delta

    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_height: this.height,

        u_rising_color: {
          value: new THREE.Color(color.risingColor)
        },

        city_color: {
          value: new THREE.Color(this.meshColor)
        },
        u_head_color: {
          value: new THREE.Color(this.headColor)
        },
        u_size: {
          value: size
        }
      },
      vertexShader:`
        varying vec3 v_position;
        void main() {
          v_position = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(v_position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 v_position;
        uniform vec3 city_color;
        uniform vec3 u_head_color;
        uniform vec3 u_rising_color;
        uniform float u_height;
        uniform float u_size;
        
        void main() {
          vec3 base_color = city_color;
          base_color = mix(base_color, u_head_color, v_position.z / u_size);

          // 上升线条的高度
          if (u_height > v_position.z && u_height < v_position.z + 10.0) {
            float f_index = (u_height - v_position.z) / 5.0;
            base_color = mix(u_rising_color, base_color, abs(f_index - 1.0));
          }
          gl_FragColor = vec4(base_color,1.0);
        }
      `,
    })
    // const material = new THREE.MeshLambertMaterial({ color: '#ff0000'})
    const mesh = new THREE.Mesh(this.child.geometry, material);
    // let mesh inherit the position, rotation, scale form child 
    mesh.position.copy(this.child.position);
    mesh.rotation.copy(this.child.rotation);
    mesh.scale.copy(this.child.scale)

    this.scene.add(mesh);
  }

  createLine() {
    // get edges
    const geometry =  new THREE.EdgesGeometry(this.child.geometry);
    // api material
    // const material = new THREE.LineBasicMaterial({color: color.surroundLine});

    const { max, min } = this.child.geometry.boundingBox;
    console.log('max ', max, 'min ', min)

    const material = new THREE.ShaderMaterial({
      uniforms: {
        line_color: {
          value: new THREE.Color(color.surroundLine)
        },
        u_time: this.time,
        u_max: {
          value: max,
        },
        u_min: {
          value: min
        },
        moving_color: {
          value: new THREE.Color(color.movingColor)
        }
      },
      vertexShader: `
        uniform float u_time;
        uniform vec3 moving_color;
        uniform vec3 line_color;
        uniform vec3 u_max;
        uniform vec3 u_min;

        varying vec3 v_color;
        void main() {
          // 扫光
          float new_time = mod(u_time * 0.5, 1.0);
          float rangeY = mix(u_min.y, u_max.y, new_time);
          if (rangeY < position.y && rangeY > position.y - 100.0) {
            float f_index = 1.0 - sin((position.y - rangeY) / 100.0 * 3.14);
            float r = mix(moving_color.r, line_color.r, f_index);
            float g = mix(moving_color.g, line_color.g, f_index);
            float b = mix(moving_color.b, line_color.b, f_index);

            v_color = vec3(r,g,b);
          } else {
            v_color = line_color;
          }
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 v_color;
        
        void main() {
          gl_FragColor = vec4(v_color, 1.0);
        }
      `
    })

    const line = new THREE.LineSegments(geometry, material);

    line.scale.copy(this.child.scale);
    line.rotation.copy(this.child.rotation);
    line.position.copy(this.child.position);

    this.scene.add(line);
  }
}
