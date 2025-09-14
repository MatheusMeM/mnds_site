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
    
    // CORRECTED: Negate the mouse.y input for natural-feeling rotation
    this.targetRotation.x = -this.mouse.y * 0.5;
    this.targetRotation.y = this.mouse.x * 0.5;
  }

  onClick() {
    if (this.isAnimating) return;
    
    this.startShatterAnimation();
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