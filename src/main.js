// src/main.js

// Imports: The application's dependencies are clearly defined. We are importing
// our CSS for styling, our data layer (fetchProjects), our routing utility,
// and our UI components. This is a clean, modular entry point.
import './style.css';
import SceneManager from './scenes/SceneManager.js';
import BackgroundScene from './scenes/backgroundScene.js';
import { fetchProjects } from './utils/projectLoader.js';
import { router } from './utils/router.js';
import { renderProjectGrid } from './components/projectGrid.js';
import { renderProjectDetail } from './components/projectDetailView.js';

// --- DOM Element Cache ---
// Architectural Rationale: Caching these DOM elements at initialization is a
// performance best practice. It avoids repeated, costly DOM queries inside
// functions that may be called frequently, such as the route handler.
const canvas = document.querySelector('.webgl-canvas');
const gridView = document.querySelector('#grid-view');
const detailView = document.querySelector('#detail-view');
const workGridContainer = document.querySelector('#work-grid-container');
const mainNav = document.querySelector('.main-nav');
const header = document.querySelector('.main-header'); // Get the parent header

// --- Global State ---
// Architectural Rationale: A simple, module-scoped variable for our projects.
// For an application of this scale, this is an effective and straightforward
// state management solution. It serves as a single source of truth for
// project data after the initial fetch.
let allProjects = [];

// --- Route Handler ---
// This is the core controller of the application. Its responsibility is to
// synchronize the UI state with the current browser URL.
async function handleRouteChange() {
  // State-aware data fetching: A critical optimization. The application only
  // fetches project data once and then reuses the cached `allProjects` array.
  if (allProjects.length === 0) {
    allProjects = await fetchProjects();
  }

  // Decoupling: The router utility is queried for the current location. This
  // main file doesn't need to know *how* the URL is parsed, only what the result is.
  const { path, category, projectId } = router.getCurrentLocation();

  // View Management: The system defaults to a "clean slate" by hiding all
  // views, then explicitly showing the correct one. This prevents bugs where
  // multiple views might be visible simultaneously.
  gridView.classList.add('hidden');
  detailView.classList.add('hidden');
  
  // Conditional Rendering Logic:
  if (category && projectId) { // Handles project detail pages like /work/some-id
    const project = allProjects.find(p => p.id === projectId);
    if (project) {
      // If a valid project is found, the detail view is shown and rendered.
      detailView.classList.remove('hidden');
      renderProjectDetail(project, detailView);
    } else {
      // Graceful error handling: If the URL points to a non-existent project,
      // it safely redirects the user to the home page.
      router.navigateTo('/');
    }
  } else { // Handles top-level pages like /, /projects, /about
    gridView.classList.remove('hidden');
    let projectsToRender;
    // The switch statement correctly filters the data based on the route,
    // ensuring the grid displays the relevant subset of projects.
    switch (path) {
      case '/projects':
        projectsToRender = allProjects.filter(p => p.category === 'project');
        break;
      case '/about':
        // This is a placeholder for future implementation, correctly noted.
        projectsToRender = allProjects; 
        console.log("Navigated to About page (placeholder).");
        break;
      case '/':
      default:
        projectsToRender = allProjects.filter(p => p.category === 'work');
        break;
    }
    // The same grid component is reused, fed with different data, which is efficient.
    renderProjectGrid(projectsToRender, workGridContainer);
  }
}

// --- Event Listeners Setup ---
// Architectural Rationale: This function encapsulates all event handling,
// keeping the main initialization logic clean. It follows the principle of
// separating concerns.
function setupEventListeners() {
    // Event Delegation: A single listener is attached to the grid container.
    // This is more performant than attaching a listener to every single project card.
    workGridContainer.addEventListener('click', (event) => {
        const projectCard = event.target.closest('.project-card');
        if (projectCard) {
            const { id, category } = projectCard.dataset;
            // The router is used to trigger navigation, maintaining the SPA flow.
            router.navigateTo(`/${category}/${id}`);
        }
    });

    // Back button functionality within the detail view.
    detailView.addEventListener('click', (event) => {
        if (event.target.closest('.back-button')) {
            router.navigateTo('/');
        }
    });

    // Listen for clicks on the entire header for robust navigation
    header.addEventListener('click', (event) => {
        const link = event.target.closest('a'); // Find the clicked link
        if (link) {
            event.preventDefault(); // Prevent full page reload
            const path = link.getAttribute('href');
            router.navigateTo(path);
        }
    });

    // Browser History Integration: This listener ensures that when the user
    // clicks the browser's back or forward buttons, our application re-renders
    // the correct view.
    window.addEventListener('popstate', handleRouteChange);
}

// --- Main Application Setup ---
// This is the application's boot sequence.
async function initializePortfolio() {
  // 1. Initialize the 3D Scene
  const sceneManager = new SceneManager(canvas);
  const backgroundScene = new BackgroundScene();
  sceneManager.setScene(backgroundScene);
  
  // Start the render loop and set up resizing
  sceneManager.render();
  window.addEventListener('resize', () => sceneManager.onWindowResize());

  // 2. Set up the rest of the application
  setupEventListeners();
  // The initial route is handled on page load, ensuring that bookmarked
  // URLs or direct navigation works correctly.
  await handleRouteChange(); 
}

// --- Run the Application ---
// The `DOMContentLoaded` event ensures that the script only runs after the
// entire HTML document has been loaded and parsed.
document.addEventListener('DOMContentLoaded', initializePortfolio);