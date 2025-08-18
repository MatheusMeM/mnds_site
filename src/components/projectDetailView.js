// src/components/projectDetailView.js

/**
 * Renders the full detail page for a single project into a container.
 * @param {Object} project - The project object to render.
 * @param {HTMLElement} containerElement - The DOM element to inject the content into.
 */
export function renderProjectDetail(project, containerElement) {
  // A basic structure. This will be styled and expanded later.
  containerElement.innerHTML = `
    <div class="project-detail">
      <header class="project-detail-header">
        <h1 class="project-detail-title">${project.title}</h1>
        <div class="project-detail-meta">
          <span>${project.client}</span>
          <span>${project.year}</span>
        </div>
        <button id="back-to-grid" class="back-button">← Back</button>
      </header>
      <div class="project-detail-body">
        <p>${project.body}</p>
      </div>
      <div class="project-detail-gallery">
        <!-- The media gallery will be rendered here -->
        ${project.mediaGallery.map(media => 
          media.type === 'video' ? 
            `<video src="${media.path}" controls></video>` : 
            `<img src="${media.path}" alt="${media.caption || ''}">`
        ).join('')}
      </div>
    </div>
  `;
}