// src/components/aboutView.js

/**
 * Renders the About page content with formatted text
 * @param {HTMLElement} container - The container element to render content into
 */
export function renderAboutView(container) {
  const aboutTextContainer = container.querySelector('.about-text');
  
  if (!aboutTextContainer) {
    console.error('About text container not found');
    return;
  }

  const aboutContent = `
    <h1>Creative Technology Director</h1>
    
    <p>I'm <span class="highlight">Matheus Mendes</span>, a creative technology director specializing in interactive experiences that bridge the gap between art and technology.</p>
    
    <p>With over a decade of experience in digital innovation, I craft immersive experiences using cutting-edge web technologies, real-time graphics, and creative coding.</p>
    
    <h2>Expertise</h2>
    
    <p>My work spans <span class="highlight">WebGL development</span>, <span class="highlight">interactive installations</span>, and <span class="highlight">creative direction</span> for digital experiences. I specialize in Three.js, creative coding, and building performant web applications that push the boundaries of what's possible in the browser.</p>
    
    <p>I believe in creating technology that feels human – interfaces that respond intuitively, experiences that surprise and delight, and code that serves creativity.</p>
    
    <h2>Philosophy</h2>
    
    <p>Every pixel serves a purpose. Every interaction tells a story. Every line of code is an opportunity to create something meaningful.</p>
    
    <p><em>Click the dodecahedron to see it shatter and reform – a metaphor for how we build, break, and rebuild in the creative process.</em></p>
  `;

  aboutTextContainer.innerHTML = aboutContent;
}