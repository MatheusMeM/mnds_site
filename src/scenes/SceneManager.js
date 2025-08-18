// src/scenes/SceneManager.js
import * as THREE from 'three';

export default class SceneManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.screenDimensions = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.renderer = this.createRenderer();
    this.currentScene = null;

    // Bind 'this' to methods that will be used as callbacks
    this.onWindowResize = this.onWindowResize.bind(this);
    this.render = this.render.bind(this);
  }

  createRenderer() {
    const renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true // Allows for transparent background
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(this.screenDimensions.width, this.screenDimensions.height);
    return renderer;
  }

  setScene(scene) {
    this.currentScene = scene;
  }

  onWindowResize() {
    this.screenDimensions.width = window.innerWidth;
    this.screenDimensions.height = window.innerHeight;

    if (this.currentScene && this.currentScene.camera) {
      this.currentScene.camera.aspect = this.screenDimensions.width / this.screenDimensions.height;
      this.currentScene.camera.updateProjectionMatrix();
    }
    
    this.renderer.setSize(this.screenDimensions.width, this.screenDimensions.height);
  }

  render() {
    requestAnimationFrame(this.render);
    
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(); // Call the scene's own update loop
    }
    
    if (this.currentScene && this.currentScene.scene && this.currentScene.camera) {
      this.renderer.render(this.currentScene.scene, this.currentScene.camera);
    }
  }
}