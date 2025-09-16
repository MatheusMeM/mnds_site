// src/components/projectGrid.js

/**
 * Generates the HTML for the project card's background media.
 * This function handles different media types with direct path usage.
 * @param {Object} thumbnail - The thumbnail object from projects.json.
 * @returns {string} The HTML string for the media element.
 */
function createThumbnailMedia(thumbnail) {
  switch (thumbnail.type) {
    case 'video':
      return `<video src="${thumbnail.path}" class="project-card-video" autoplay loop muted playsinline></video>`;
    case 'image':
    case 'gif':
      return `<img src="${thumbnail.path}" class="project-card-image" alt="">`;
    // Add a case for 'model' in the future for 3D objects
    default:
      console.warn(`Unsupported thumbnail type: ${thumbnail.type}`);
      return ''; // Return an empty string if type is unknown
  }
}

/**
 * Creates the HTML for a single project card.
 * @param {Object} project - A single project object from projects.json.
 * @returns {string} The HTML string for the project card.
 */
function createProjectCard(project) {
  return `
    <div
      class="project-card"
      data-id="${project.id}"
      data-category="${project.category}"
    >
      <div class="project-card-media-wrapper">
        ${createThumbnailMedia(project.thumbnail)}
      </div>
      <div class="project-card-content">
        <h3 class="project-card-title">${project.title}</h3>
        <p class="project-card-client">${project.client}</p>
      </div>
    </div>
  `;
}

/**
 * Renders the entire grid of projects into a container element.
 * @param {Array<Object>} projects - An array of project objects.
 * @param {HTMLElement} containerElement - The DOM element to inject the grid into.
 */
export function renderProjectGrid(projects, containerElement) {
  if (!containerElement) {
    console.error("Container element for project grid not found.");
    return;
  }

  // For now, we render all projects. We can filter by category later.
  const gridHTML = projects.map(createProjectCard).join('');
  
  containerElement.innerHTML = gridHTML;
}