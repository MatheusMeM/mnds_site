// src/main.js

import './style.css';
import SceneManager from './scenes/SceneManager.js';
import BackgroundScene from './scenes/backgroundScene.js';
import { fetchProjects } from './utils/projectLoader.js';
import { router } from './utils/router.js';
import { renderProjectGrid } from './components/projectGrid.js';
import { renderProjectDetail } from './components/projectDetailView.js';

// --- DOM Element Cache ---
const canvas = document.querySelector('.webgl-canvas');
const gridView = document.querySelector('#grid-view');
const detailView = document.querySelector('#detail-view');
const workGridContainer = document.querySelector('#work-grid-container');
const header = document.querySelector('.main-header');

// --- Global State ---
let allProjects = [];

// --- Animation Utility ---
const transitionDuration = 300; // Must match --transition-speed in CSS

function transitionViews(currentView, nextView, renderCallback) {
  // 1. Animate the current view out
  if (currentView) {
    currentView.classList.add('view-exit');
  }

  // 2. After the animation, hide the old view, render content, and show the new view
  setTimeout(() => {
    if (currentView) {
      currentView.classList.add('hidden');
      currentView.classList.remove('view-exit');
    }

    // 3. Render the new content
    renderCallback();

    // 4. Prepare the new view for entry animation
    nextView.classList.add('view-enter');
    nextView.classList.remove('hidden');

    // 5. Force a browser reflow to ensure the transition is applied
    void nextView.offsetWidth;

    // 6. Animate the new view in
    nextView.classList.remove('view-enter');
  }, currentView ? transitionDuration : 0); // No delay for initial render of detail view
}

// --- Route Handler ---
async function handleRouteChange(isInitialLoad = false) {
  const { path, category, projectId } = router.getCurrentLocation();
  const currentView = document.querySelector('.view-container:not(.hidden)');

  if (category && projectId) {
    const project = allProjects.find(p => p.id === projectId);
    if (project) {
      if (currentView === detailView && detailView.dataset.currentProject === projectId) return; // Already on the correct page
      
      const renderFn = () => {
        renderProjectDetail(project, detailView);
        detailView.dataset.currentProject = projectId;
      };
      
      // If it's the first page load, we don't need to animate out the (empty) grid
      transitionViews(isInitialLoad ? null : currentView, detailView, renderFn);
    } else {
      router.navigateTo('/');
    }
  } else {
    // This is a grid view route (/, /projects, etc.)
    if (currentView === gridView && !isInitialLoad) return; // Already on the grid
    
    const renderFn = () => {
      let projectsToRender;
      switch (path) {
        case '/projects':
          projectsToRender = allProjects.filter(p => p.category === 'project');
          break;
        case '/about':
          projectsToRender = allProjects;
          console.log("Navigated to About page (placeholder).");
          break;
        case '/':
        default:
          projectsToRender = allProjects.filter(p => p.category === 'work');
          break;
      }
      renderProjectGrid(projectsToRender, workGridContainer);
    };

    transitionViews(currentView, gridView, renderFn);
  }
}

// --- Event Listeners Setup ---
function setupEventListeners() {
    workGridContainer.addEventListener('click', (event) => {
        const projectCard = event.target.closest('.project-card');
        if (projectCard) {
            const { id, category } = projectCard.dataset;
            router.navigateTo(`/${category}/${id}`);
        }
    });

    detailView.addEventListener('click', (event) => {
        if (event.target.closest('.back-button')) {
            router.navigateTo('/');
        }
    });

    header.addEventListener('click', (event) => {
        const link = event.target.closest('a');
        if (link) {
            event.preventDefault();
            const path = link.getAttribute('href');
            router.navigateTo(path);
        }
    });

    window.addEventListener('popstate', () => handleRouteChange());
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !detailView.classList.contains('hidden')) {
            router.navigateTo('/');
        }
    });
}

// --- Main Application Setup ---
async function initializePortfolio() {
  const sceneManager = new SceneManager(canvas);
  const backgroundScene = new BackgroundScene();
  sceneManager.setScene(backgroundScene);
  sceneManager.render();
  window.addEventListener('resize', () => sceneManager.onWindowResize());

  setupEventListeners();

  // CRITICAL FIX: The data must be loaded before any routing decisions are made.
  allProjects = await fetchProjects();
  
  // Now handle the route, passing a flag to indicate it's the initial load.
  await handleRouteChange(true); 
}

// --- Run the Application ---
document.addEventListener('DOMContentLoaded', initializePortfolio);