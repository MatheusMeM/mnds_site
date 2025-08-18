// src/utils/projectLoader.js

/**
 * Fetches the portfolio projects data from the JSON file.
 * This module decouples the data source from the components that use it.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of project objects.
 * @throws {Error} If the network response is not ok or parsing fails.
 */
export async function fetchProjects() {
  try {
    // CORRECTED PATH: Assets in the `public` directory are served from the web root.
    // This path will work correctly in both `dev` and `production` environments.
    const response = await fetch('/data/projects.json');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const projects = await response.json();
    return projects;

  } catch (error) {
    console.error("Failed to fetch or parse projects.json:", error);
    // Returning an empty array prevents the app from crashing on data load failure.
    return [];
  }
}