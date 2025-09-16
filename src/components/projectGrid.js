// src/components/projectGrid.js

import { resolveThumbnailPath } from '../utils/mediaResolver.js';

/**
 * Generates the HTML for the project card's background media.
 * This function is now intelligent, handling different media types.
 * @param {Object} project - The complete project object from projects.json.
 * @returns {string} The HTML string for the media element.
 */
function createThumbnailMedia(project) {
  const resolvedPath = resolveThumbnailPath(project);
  const { thumbnail } = project;
  
  switch (thumbnail.type) {
    case 'video':
      return `<video src="${resolvedPath}" class="project-card-video" autoplay loop muted playsinline></video>`;
    case 'image':
    case 'gif':
      return `<img src="${resolvedPath}" class="project-card-image" alt="">`;
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
        ${createThumbnailMedia(project)}
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