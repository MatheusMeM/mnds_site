// src/scenes/backgroundScene.js
import * as THREE from 'three';

export default class BackgroundScene {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.z = 5;

    this.particles = this.createParticles();
    this.scene.add(this.particles);
  }

  createParticles() {
    const particleCount = 5000;
    const vertices = [];
    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 20;
      vertices.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const material = new THREE.PointsMaterial({
      color: 0x888888,
      size: 0.02,
      transparent: true,
      opacity: 0.5
    });
    
    return new THREE.Points(geometry, material);
  }

  update() {
    // This is our animation loop for this specific scene
    if (this.particles) {
      this.particles.rotation.y += 0.0005;
      this.particles.rotation.x += 0.0002;
    }
  }
}