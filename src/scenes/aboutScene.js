// src/scenes/aboutScene.js
import * as THREE from 'three';

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
    const finalGeometry = new THREE.BufferGeometry();
    const finalVertices = [];
    const finalUvs = [];
    const finalIndices = [];
    
    // A map to track unique vertices and avoid duplication
    const vertexMap = new Map();
    let indexCounter = 0;

    // Helper function to add a vertex or return its existing index
    function addVertex(vec) {
        const key = `${vec.x.toFixed(4)},${vec.y.toFixed(4)},${vec.z.toFixed(4)}`;
        if (vertexMap.has(key)) {
            return vertexMap.get(key);
        }
        const index = indexCounter++;
        finalVertices.push(vec.x, vec.y, vec.z);
        vertexMap.set(key, index);
        return index;
    }

    // Base shape to get the structure - use EdgesGeometry for reliable edge extraction
    const baseGeometry = new THREE.DodecahedronGeometry(2, 0);
    const edgesGeometry = new THREE.EdgesGeometry(baseGeometry);
    const edgePositions = edgesGeometry.attributes.position.array;
    
    const edgeThickness = 1.05; // How thick the edges are

    // Process pairs of vertices (each edge)
    for (let i = 0; i < edgePositions.length; i += 6) { // 6 = 2 vertices × 3 components
        const v1 = new THREE.Vector3(edgePositions[i], edgePositions[i+1], edgePositions[i+2]);
        const v2 = new THREE.Vector3(edgePositions[i+3], edgePositions[i+4], edgePositions[i+5]);

        // Extrude vertices outwards to create thickness
        const v3 = v1.clone().multiplyScalar(edgeThickness);
        const v4 = v2.clone().multiplyScalar(edgeThickness);

        // Get the indices for the four corners of our plane
        const i1 = addVertex(v1);
        const i2 = addVertex(v2);
        const i3 = addVertex(v3);
        const i4 = addVertex(v4);
        
        // Create two triangles (a quad) for the plane
        finalIndices.push(i1, i2, i3);
        finalIndices.push(i2, i4, i3);

        // Assign UVs to each vertex for the shader
        finalUvs[i1 * 2] = 0; finalUvs[i1 * 2 + 1] = 0;
        finalUvs[i2 * 2] = 1; finalUvs[i2 * 2 + 1] = 0;
        finalUvs[i3 * 2] = 0; finalUvs[i3 * 2 + 1] = 1;
        finalUvs[i4 * 2] = 1; finalUvs[i4 * 2 + 1] = 1;
    }
    
    finalGeometry.setAttribute('position', new THREE.Float32BufferAttribute(finalVertices, 3));
    finalGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(finalUvs, 2));
    finalGeometry.setIndex(finalIndices);
    finalGeometry.computeVertexNormals(); // Good practice for lighting/shading

    const noiseShaderMaterial = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0.0 } },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            uniform float uTime;
            varying vec2 vUv;
            float random(vec2 st) {
                return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
            }
            void main() {
                // Use the UVs to create a noisy pattern. Multiplying by a larger number
                // makes the noise pattern denser and more speckled.
                float noise = random(vUv * 10.0 + uTime * 0.1);
                if (noise < 0.5) {
                    discard;
                }
                gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
            }
        `,
        side: THREE.DoubleSide // Render both sides to ensure it's visible from all angles
    });

    this.dodecahedron = new THREE.Mesh(finalGeometry, noiseShaderMaterial);
    this.scene.add(this.dodecahedron);
  }

  createParticleSystem() {
    // CRITICAL: Ensure the dodecahedron is created first
    if (!this.dodecahedron) {
        console.error("Dodecahedron must be created before the particle system.");
        return;
    }

    // Use the vertices from our NEW procedural geometry for a perfect match
    const positions = this.dodecahedron.geometry.attributes.position.array;
    
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
    
    // The particle material shader remains largely the same, but we reference 'position' directly
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: 0.0 },
        uTime: { value: 0.0 },
      },
      vertexShader: `
        attribute vec3 scatterDirection;
        uniform float uProgress;
        uniform float uTime;
        
        void main() {
          // Animate from original position to scattered position
          vec3 pos = position + scatterDirection * uProgress;
          
          // Add some organic floating motion
          pos.y += sin(uTime * 0.5 + position.x * 2.0) * 0.2 * uProgress;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = (2.0 / -mvPosition.z) * (1.0 - uProgress); // Make points smaller as they expand
        }
      `,
      fragmentShader: `
        void main() {
          gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    
    this.particles = new THREE.Points(particleGeometry, particleMaterial);
    this.particles.visible = false;
    this.scene.add(this.particles);
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

  }

  startAnimationLoop() {
    this.animate();
  }

  animate() {
    this.animationId = requestAnimationFrame(this.animate);
    
    const time = performance.now() * 0.001;
    
    if (this.dodecahedron) {
      // LERP rotation for smooth mouse follow
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
      this.dodecahedron.rotation.z += 0.002;
    
      // Update shader material time uniform
      if (this.dodecahedron.material && this.dodecahedron.material.uniforms) {
        this.dodecahedron.material.uniforms.uTime.value = time;
      }
    }
    
    if (this.particles && this.particles.material.uniforms) {
      this.particles.material.uniforms.uTime.value = time;
    }
    
    this.renderer.render(this.scene, this.camera);
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
    this.dodecahedron = null;
    this.particles = null;
  }
}