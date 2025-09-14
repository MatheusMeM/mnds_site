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
    // --- START OF MODIFICATIONS ---

    // Define mobile-specific parameters based on the existing logic
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 1500 : 5000;
    const particleSize = isMobile ? 0.04 : 0.02;   // Particles are larger on mobile
    const spreadFactor = isMobile ? 15 : 20;     // Particles are closer together on mobile

    // --- END OF MODIFICATIONS ---

    const vertices = [];
    for (let i = 0; i < particleCount; i++) {
      // Use the new spreadFactor to control distribution
      const x = (Math.random() - 0.5) * spreadFactor;
      const y = (Math.random() - 0.5) * spreadFactor;
      const z = (Math.random() - 0.5) * spreadFactor;
      vertices.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    
    const material = new THREE.PointsMaterial({
      color: 0x888888,
      size: particleSize, // Use the new dynamic particleSize
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