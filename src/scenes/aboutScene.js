// src/scenes/aboutScene.js
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

export default class AboutScene {
  constructor(container) {
    this.container = container;
    this.isAnimating = false; // State management flag
    this.mouse = new THREE.Vector2();
    this.targetRotation = new THREE.Vector2();
    
    // Core Three.js objects
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.composer = null;
    this.dodecahedron = null;
    this.particles = null;
    
    // Animation and interaction
    this.animationId = null;
    this.resizeObserver = null;
    
    // Bind methods
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onResize = this.onResize.bind(this);
    this.animate = this.animate.bind(this);
  }

  init() {
    this.createRenderer();
    this.createScene();
    this.createCamera();
    this.createDodecahedron();
    this.createParticleSystem();
    this.setupPostProcessing();
    this.setupEventListeners();
    this.setupResizeObserver();
    this.startAnimationLoop();
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    
    // Performance optimizations
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0); // Transparent background
    
    const rect = this.container.getBoundingClientRect();
    this.renderer.setSize(rect.width, rect.height);
    
    this.container.appendChild(this.renderer.domElement);
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  createCamera() {
    const rect = this.container.getBoundingClientRect();
    this.camera = new THREE.PerspectiveCamera(
      75,
      rect.width / rect.height,
      0.1,
      1000
    );
    this.camera.position.z = 5;
  }

  createDodecahedron() {
    // Create dodecahedron geometry
    const geometry = new THREE.DodecahedronGeometry(2, 0);
    
    // Create wireframe geometry with thicker lines
    const wireframe = new THREE.WireframeGeometry(geometry);
    
    // Create line material for thicker wireframes
    const material = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.9,
      linewidth: 3 // Note: linewidth may not work on all platforms
    });
    
    this.dodecahedron = new THREE.LineSegments(wireframe, material);
    this.scene.add(this.dodecahedron);
  }

  createParticleSystem() {
    // Extract vertices from dodecahedron for particle positions
    const dodecaGeometry = new THREE.DodecahedronGeometry(2, 0);
    const positions = dodecaGeometry.attributes.position.array;
    
    // Create particle geometry
    const particleGeometry = new THREE.BufferGeometry();
    
    // Add random scatter directions for each vertex
    const scatterDirections = [];
    const originalPositions = [];
    
    for (let i = 0; i < positions.length; i += 3) {
      // Store original positions
      originalPositions.push(positions[i], positions[i + 1], positions[i + 2]);
      
      // Generate random scatter direction
      const direction = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );
      scatterDirections.push(direction.x, direction.y, direction.z);
    }
    
    particleGeometry.setAttribute('position', new THREE.Float32BufferAttribute(originalPositions, 3));
    particleGeometry.setAttribute('originalPosition', new THREE.Float32BufferAttribute(originalPositions, 3));
    particleGeometry.setAttribute('scatterDirection', new THREE.Float32BufferAttribute(scatterDirections, 3));
    
    // Create particle material with custom shader
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: 0.0 },
        uTime: { value: 0.0 },
        uPointSize: { value: 3.0 }
      },
      vertexShader: `
        attribute vec3 originalPosition;
        attribute vec3 scatterDirection;
        uniform float uProgress;
        uniform float uTime;
        uniform float uPointSize;
        
        void main() {
          vec3 pos = originalPosition + scatterDirection * uProgress;
          
          // Add some floating motion during scatter
          pos.y += sin(uTime * 2.0 + originalPosition.x * 10.0) * 0.1 * uProgress;
          pos.x += cos(uTime * 1.5 + originalPosition.z * 8.0) * 0.1 * uProgress;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = uPointSize * (1.0 + uProgress * 2.0);
        }
      `,
      fragmentShader: `
        uniform float uProgress;
        
        void main() {
          // Create circular points
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          
          // Fade based on progress
          alpha *= (1.0 - uProgress * 0.3);
          
          gl_FragColor = vec4(1.0, 1.0, 1.0, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    
    this.particles = new THREE.Points(particleGeometry, particleMaterial);
    this.particles.visible = false;
    this.scene.add(this.particles);
  }

  setupPostProcessing() {
    // Create effect composer
    this.composer = new EffectComposer(this.renderer);
    
    // Add render pass
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);
    
    // Create dither shader
    const ditherShader = {
      uniforms: {
        'tDiffuse': { value: null },
        'uResolution': { value: new THREE.Vector2() }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 uResolution;
        varying vec2 vUv;
        
        // 4x4 Bayer matrix for dithering
        float bayer4x4(vec2 coord) {
          int x = int(mod(coord.x, 4.0));
          int y = int(mod(coord.y, 4.0));
          int index = x + y * 4;
          float matrix[16] = float[](
            0.0/16.0,  8.0/16.0,  2.0/16.0, 10.0/16.0,
            12.0/16.0, 4.0/16.0, 14.0/16.0,  6.0/16.0,
            3.0/16.0, 11.0/16.0,  1.0/16.0,  9.0/16.0,
            15.0/16.0, 7.0/16.0, 13.0/16.0,  5.0/16.0
          );
          return matrix[index];
        }
        
        void main() {
          vec4 color = texture2D(tDiffuse, vUv);
          
          // Convert to grayscale
          float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
          
          // Apply dithering
          vec2 ditherCoord = gl_FragCoord.xy;
          float threshold = bayer4x4(ditherCoord);
          
          // Create dithered result
          float dithered = step(threshold, gray);
          
          // Mix original color with dithered result for a stylized effect
          vec3 ditherColor = mix(vec3(0.1), vec3(1.0), dithered);
          vec3 finalColor = mix(color.rgb, ditherColor, 0.6);
          
          gl_FragColor = vec4(finalColor, color.a);
        }
      `
    };
    
    const ditherPass = new ShaderPass(ditherShader);
    ditherPass.renderToScreen = true;
    this.composer.addPass(ditherPass);
    
    // Update resolution uniform
    const rect = this.container.getBoundingClientRect();
    ditherPass.uniforms.uResolution.value.set(rect.width, rect.height);
  }

  setupEventListeners() {
    // Mouse movement tracking
    this.container.addEventListener('mousemove', this.onMouseMove);
    
    // Click interaction
    this.container.addEventListener('click', this.onClick);
  }

  setupResizeObserver() {
    this.resizeObserver = new ResizeObserver(this.onResize);
    this.resizeObserver.observe(this.container);
  }

  onMouseMove(event) {
    const rect = this.container.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Calculate target rotation based on mouse position
    this.targetRotation.x = this.mouse.y * 0.5;
    this.targetRotation.y = this.mouse.x * 0.5;
  }

  onClick() {
    if (this.isAnimating) return;
    
    this.startShatterAnimation();
  }

  startShatterAnimation() {
    this.isAnimating = true;
    
    // Hide dodecahedron, show particles
    this.dodecahedron.visible = false;
    this.particles.visible = true;
    
    // Animate shatter (0 -> 1)
    this.animateProgress(0, 1, 1500, () => {
      // After shatter, animate reform (1 -> 0)
      this.animateProgress(1, 0, 1500, () => {
        // Reset to original state
        this.dodecahedron.visible = true;
        this.particles.visible = false;
        this.isAnimating = false;
      });
    });
  }

  animateProgress(from, to, duration, onComplete) {
    const start = performance.now();
    const initialValue = from;
    const delta = to - from;
    
    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easing function
      const easedProgress = progress < 0.5 
        ? 2 * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;
      
      const currentValue = initialValue + delta * easedProgress;
      this.particles.material.uniforms.uProgress.value = currentValue;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else if (onComplete) {
        onComplete();
      }
    };
    
    requestAnimationFrame(animate);
  }

  onResize() {
    const rect = this.container.getBoundingClientRect();
    
    if (this.camera) {
      this.camera.aspect = rect.width / rect.height;
      this.camera.updateProjectionMatrix();
    }
    
    if (this.renderer) {
      this.renderer.setSize(rect.width, rect.height);
    }
    
    if (this.composer) {
      this.composer.setSize(rect.width, rect.height);
      
      // Update dither shader resolution
      const ditherPass = this.composer.passes[1];
      if (ditherPass && ditherPass.uniforms && ditherPass.uniforms.uResolution) {
        ditherPass.uniforms.uResolution.value.set(rect.width, rect.height);
      }
    }
  }

  startAnimationLoop() {
    this.animate();
  }

  animate() {
    this.animationId = requestAnimationFrame(this.animate);
    
    const time = performance.now() * 0.001;
    
    if (this.dodecahedron) {
      // Smooth rotation following mouse with LERP
      this.dodecahedron.rotation.x = THREE.MathUtils.lerp(
        this.dodecahedron.rotation.x,
        this.targetRotation.x,
        0.05
      );
      this.dodecahedron.rotation.y = THREE.MathUtils.lerp(
        this.dodecahedron.rotation.y,
        this.targetRotation.y,
        0.05
      );
      
      // Add subtle continuous rotation
      this.dodecahedron.rotation.z += 0.002;
    }
    
    if (this.particles && this.particles.material.uniforms) {
      this.particles.material.uniforms.uTime.value = time;
    }
    
    if (this.composer) {
      this.composer.render();
    } else if (this.renderer && this.scene && this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }

  destroy() {
    // Stop animation loop
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    // Remove event listeners
    if (this.container) {
      this.container.removeEventListener('mousemove', this.onMouseMove);
      this.container.removeEventListener('click', this.onClick);
    }
    
    // Disconnect resize observer
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
    
    // Dispose of Three.js objects
    if (this.scene) {
      this.scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
    
    if (this.composer) {
      this.composer.dispose();
    }
    
    if (this.renderer) {
      this.renderer.dispose();
      if (this.container && this.renderer.domElement) {
        this.container.removeChild(this.renderer.domElement);
      }
    }
    
    // Clear references
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.composer = null;
    this.dodecahedron = null;
    this.particles = null;
  }
}