// src/utils/mediaResolver.js

/**
 * Resolves media paths from relative project paths to absolute URLs.
 * This centralized resolver handles the transition from flat media structure
 * to project-organized folders automatically.
 * 
 * @param {string} projectId - The unique project identifier
 * @param {string} relativePath - The relative path within the project folder
 * @returns {string} The absolute media URL
 */
export function resolveMediaPath(projectId, relativePath) {
  // Handle legacy absolute paths (backward compatibility)
  if (relativePath.startsWith('/media/projects/')) {
    return relativePath;
  }
  
  // Handle new relative paths (project-organized structure)
  return `/media/projects/${projectId}/${relativePath}`;
}

/**
 * Resolves thumbnail media path for a project.
 * @param {Object} project - The project object containing id and thumbnail
 * @returns {string} The resolved thumbnail path
 */
export function resolveThumbnailPath(project) {
  return resolveMediaPath(project.id, project.thumbnail.path);
}

/**
 * Resolves all media gallery paths for a project.
 * @param {Object} project - The project object containing id and mediaGallery
 * @returns {Array} Array of media objects with resolved paths
 */
export function resolveGalleryPaths(project) {
  return project.mediaGallery.map(media => ({
    ...media,
    path: resolveMediaPath(project.id, media.path)
  }));
}