// src/components/projectDetailView.js

/**
 * Renders a single media item for the gallery.
 * @param {object} media - A media object from the project's mediaGallery array.
 * @returns {string} The HTML string for the media item.
 */
function createMediaGalleryItem(media) {
  const captionHTML = media.caption ? `<figcaption>${media.caption}</figcaption>` : '';
  
  switch (media.type) {
    case 'video':
      return `
        <figure class="gallery-item">
          <video src="${media.path}" controls playsinline></video>
          ${captionHTML}
        </figure>
      `;
    case 'image':
    case 'gif':
      return `
        <figure class="gallery-item">
          <img src="${media.path}" alt="${media.caption || 'Project image'}">
          ${captionHTML}
        </figure>
      `;
    default:
      return '';
  }
}

/**
 * Renders the full detail page for a single project into a container.
 * @param {Object} project - The project object to render.
 * @param {HTMLElement} containerElement - The DOM element to inject the content into.
 */
export function renderProjectDetail(project, containerElement) {
  // We will add a simple Markdown-like parser for the body text later if needed.
  // For now, we'll just handle newlines.
  const formattedBody = project.body.replace(/\n/g, '<br>');

  containerElement.innerHTML = `
    <div class="project-detail">
      <header class="project-detail-header">
        <h1 class="project-detail-title">${project.title}</h1>
        <button class="back-button">← Back to Grid</button>
      </header>

      <div class="project-detail-content">
        <aside class="project-meta">
          <div class="meta-item">
            <strong>Client</strong>
            <span>${project.client}</span>
          </div>
          <div class="meta-item">
            <strong>Year</strong>
            <span>${project.year}</span>
          </div>
          <div class="meta-item">
            <strong>Role</strong>
            <span>${project.role}</span>
          </div>
          <div class="meta-item">
            <strong>Tags</strong>
            <div class="project-tags">
              ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          </div>
        </aside>

        <main class="project-story">
          <p>${formattedBody}</p>
        </main>
      </div>

      <div class="project-detail-gallery">
        ${project.mediaGallery.map(createMediaGalleryItem).join('')}
      </div>
    </div>
  `;
}