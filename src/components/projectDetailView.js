// src/components/projectDetailView.js

// 1. Import the 'marked' library
import { marked } from 'marked';
import { resolveGalleryPaths, resolveThumbnailPath } from '../utils/mediaResolver.js';

/**
 * Renders a single media item for the gallery.
 * @param {object} media - A media object with resolved path from the project's mediaGallery array.
 * @returns {string} The HTML string for the media item.
 */
function createMediaGalleryItem(media) {
  const captionHTML = media.caption ? `<figcaption>${media.caption}</figcaption>` : '';
  const layoutClass = `layout-${media.layout || 'standard'}`;
  
  switch (media.type) {
    case 'video':
      return `
        <figure class="gallery-item ${layoutClass}">
          <video class="lazy" data-src="${media.path}" controls playsinline muted loop></video>
          ${captionHTML}
        </figure>
      `;
    case 'image':
    case 'gif':
      return `
        <figure class="gallery-item ${layoutClass}">
          <img class="lazy" data-src="${media.path}" alt="${media.caption || 'Project image'}">
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
  // 2. Process the body text through the marked parser.
  // The `breaks: true` option ensures single newlines are rendered as <br> tags.
  const formattedBody = marked.parse(project.body || '', { breaks: true });
  
  // 3. Resolve all media gallery paths using the project ID
  const resolvedGallery = resolveGalleryPaths(project);
  
  // 4. Resolve thumbnail path
  const thumbnailPath = resolveThumbnailPath(project);

  containerElement.innerHTML = `
    <article class="project-detail">
      <!-- Hero section with constrained thumbnail -->
      <section class="project-hero">
        <div class="hero-container">
          <img class="project-hero-thumbnail lazy" data-src="${thumbnailPath}" alt="${project.title}">
        </div>
      </section>

      <!-- Project title section -->
      <section class="project-header">
        <div class="header-container">
          <nav class="project-navigation">
            <button class="back-button">← Back to Grid</button>
          </nav>
          <h1 class="project-title">${project.title}</h1>
          <div class="project-meta-inline">
            <span class="meta-client">${project.client}</span>
            <span class="meta-year">${project.year}</span>
            <span class="meta-role">${project.role}</span>
          </div>
        </div>
      </section>

      <!-- Editorial content layout -->
      <section class="project-content">
        <div class="content-grid">
          <!-- Left column: Project information -->
          <aside class="project-sidebar">
            <div class="sidebar-section">
              <h3 class="sidebar-label">About</h3>
              <div class="project-description">
                ${formattedBody}
              </div>
            </div>
            
            <div class="sidebar-section">
              <h3 class="sidebar-label">Technologies</h3>
              <div class="project-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
              </div>
            </div>
          </aside>

          <!-- Right column: Visual content -->
          <main class="project-gallery">
            ${resolvedGallery.map(createMediaGalleryItem).join('')}
          </main>
        </div>
      </section>
    </article>
  `;
}