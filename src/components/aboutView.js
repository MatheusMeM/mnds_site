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
    <h1>Matheus Mendes<br/>Creative Tech Director</h1>

    <h2>engineering experiences where technology becomes tangible poetry<br/><br/></h2>

    <p><strong>Matheus Mendes</strong> is a Electrical Engineer (PUC-Rio) specializing in Electronics, based in Rio de Janeiro, Brazil. He operates at the intersection where engineering meets human wonder, designing interactive, generative and immersive projects that transform abstract concepts into ludic and engaging experiences.</p>

    <p>As co-founder of DELED, he successfully scaled the creative technology studio, delivering 288 installations for global brands including <b>Rock in Rio, L'Oréal, and Web Summit</b>. His work ranges from custom DMX-Servo motor controllers for theatrical applications to curating public art initiatives like <b>IluminaRio 2021</b> (BMW Sponsored), engaging thousands.</p>

    <p>His ethos is driven by the conviction that technology should amplify human connection, not replace it. This belief has guided his diverse collaborations, from creating interactive exhibitions for the <b>Museum of Tomorrow (Rio)</b> to establishing sustainable maker spaces with <b>Precious Plastic Rio</b>, turning waste into possibility and empowering local communities.</p>

    <p>Matheus is perpetually driven by a genuine curiosity to see technology serve art and people, fostering a profound sense of wonder and engagement.</p>
  `;

  aboutTextContainer.innerHTML = aboutContent;
}
