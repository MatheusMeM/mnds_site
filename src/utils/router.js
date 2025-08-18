// src/utils/router.js

/**
 * A lightweight client-side router to handle SPA navigation.
 */
export const router = {
  /**
   * Pushes a new state to the browser's history and dispatches an event.
   * @param {string} path - The new path to navigate to (e.g., '/work/project-id').
   */
  navigateTo(path) {
    history.pushState(null, null, path);
    // Dispatch a custom event that our main app can listen for.
    window.dispatchEvent(new PopStateEvent('popstate'));
  },

  /**
   * Returns the current path and extracts category/project ID if present.
   * @returns {{path: string, category: string|null, projectId: string|null}}
   */
  getCurrentLocation() {
    const path = window.location.pathname;
    // e.g., /work/project-id -> ['', 'work', 'project-id']
    const pathParts = path.split('/').filter(part => part !== '');
    
    // Check for a valid project path: /category/id
    if (['work', 'project'].includes(pathParts[0]) && pathParts.length === 2) {
      return { path: `/${pathParts[0]}`, category: pathParts[0], projectId: pathParts[1] };
    }
    
    // Handle other top-level paths like /about, /projects, or /
    return { path: path === '' ? '/' : path, category: null, projectId: null };
  }
};