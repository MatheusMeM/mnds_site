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
    <h1>Creative Tech Director </h1>

    <h2>engineering experiences where technology becomes tangible poetry</h2>

    <p><br/></p>
    
    <p>I exist at the intersection where electrical engineering meets human wonder—building systems that transform abstract concepts into interactive realities. My foundation in electronics and embedded systems drives a practice centered on making the invisible visible, the digital physical, the complex beautifully simple. Much like the technology I create, my approach is both methodical and mysteriously intuitive.</p>

    <p>The throughline in my work utilizes real-time computer vision, edge AI, and custom hardware to create experiences that respond to human presence and movement. My signature approach blends rigorous engineering with experimental discovery—reducing motion capture costs by 96% through algorithmic innovation, deploying interactive installations across cultural institutions serving over one million visitors, coordinating technical infrastructure that connects 700K+ people in shared moments of technological transcendence.</p>

    <p>My ethos is driven by the belief that technology should amplify human connection, not replace it. I continuously seek to apply my foundation in electrical engineering to new mediums, new collaborators, unexpected contexts. The results of these explorations often take beautiful and surprising forms: responsive environments that breathe with their occupants, sustainable maker spaces that transform plastic waste into creative possibility, generative systems that evolve through the poetry of human interaction.</p>

    <p>Whether developing multi-camera pose estimation pipelines, integrating IoT sensor networks for responsive environments, or designing custom PCBs that blur the line between art and engineering, I focus on solutions that scale gracefully from proof-of-concept to production deployment. My technical foundation spans embedded systems, computer vision libraries, and edge AI implementations, always documented for reproducible outcomes and seamless collaboration.</p>

    <p>Current explorations include generative systems in TouchDesigner and WebGL applications that push the boundaries of browser-based interactivity. See the Works section for large-scale cultural deployments, or explore Personal Projects for experimental builds that question the relationship between human and machine. Ready to create something unprecedented together.</p>

    <p><em>Press and hold on the dodecahedron to charge up the light – watch as energy builds and illuminates the experience.</em></p>
  `;

  aboutTextContainer.innerHTML = aboutContent;
}
