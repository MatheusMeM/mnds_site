// src/main.js

import './style.css';
import SceneManager from './scenes/SceneManager.js';
import BackgroundScene from './scenes/backgroundScene.js';
import AboutScene from './scenes/aboutScene.js';
import { fetchProjects } from './utils/projectLoader.js';
import { router } from './utils/router.js';
import { renderProjectGrid } from './components/projectGrid.js';
import { renderProjectDetail } from './components/projectDetailView.js';
import { renderAboutView } from './components/aboutView.js';
import { initializeLazyLoading } from './utils/lazyLoader.js';

// --- DOM Element Cache ---
const canvas = document.querySelector('.webgl-canvas');
const gridView = document.querySelector('#grid-view');
const detailView = document.querySelector('#detail-view');
const aboutView = document.querySelector('#about-view');
const workGridContainer = document.querySelector('#work-grid-container');
const header = document.querySelector('.main-header');
const navLinks = document.querySelectorAll('.main-nav a');

// --- Global State ---
let allProjects = [];
let currentPath = null; // CRITICAL FIX: State variable to track the current path
let aboutSceneInstance = null; // Keep a reference to destroy it later

// --- Animation Utility ---
const transitionDuration = 300; // Must match --transition-speed in CSS

function transitionViews(currentView, nextView, renderCallback) {
  // ... (This function remains unchanged, it is already correct) ...
  if (currentView) {
    currentView.classList.add('view-exit');
  }
  setTimeout(() => {
    if (currentView) {
      currentView.classList.add('hidden');
      currentView.classList.remove('view-exit');
    }
    renderCallback();
    nextView.classList.add('view-enter');
    nextView.classList.remove('hidden');
    void nextView.offsetWidth;
    nextView.classList.remove('view-enter');
  }, currentView ? transitionDuration : 0);
}

// --- Navigation State Update ---
function updateActiveNavLink(path, category) {
  // ... (This function remains unchanged, it is already correct) ...
  navLinks.forEach(link => {
    link.classList.remove('active');
    const linkPath = link.getAttribute('href');
    let isActive = false;
    if (path === '/' || category === 'work') {
      if (linkPath === '/') isActive = true;
    } else if (path === '/projects' || category === 'project') {
      if (linkPath === '/projects') isActive = true;
    } else if (path === '/about') {
      if (linkPath === '/about') isActive = true;
    }
    if (isActive) {
      link.classList.add('active');
    }
  });
}

// --- Route Handler ---
async function handleRouteChange() {
  const { path, category, projectId } = router.getCurrentLocation();

  // CRITICAL FIX: The new, correct guard clause.
  // Exit only if the path is exactly the same as the one we're already displaying.
  if (path === currentPath && !projectId) {
    return;
  }
  currentPath = path; // Update the state to the new path

  const currentView = document.querySelector('.view-container:not(.hidden)');
  
  if (category && projectId) {
    const project = allProjects.find(p => p.id === projectId);
    if (project) {
      const renderFn = () => {
        renderProjectDetail(project, detailView);
        detailView.dataset.currentProject = projectId;
        // Initialize lazy loading for the rendered media gallery
        initializeLazyLoading(detailView);
      };
      transitionViews(currentView, detailView, renderFn);
    } else {
      router.navigateTo('/');
    }
  } else if (path === '/about') {
    // Handle About page
    const renderFn = () => {
      // Cleanup old scene if it exists
      if (aboutSceneInstance) {
        aboutSceneInstance.destroy();
        aboutSceneInstance = null;
      }
      
      // Render the about text content
      renderAboutView(aboutView);
      
      // Initialize the 3D scene
      const container = document.querySelector('#about-interactive-container');
      if (container) {
        aboutSceneInstance = new AboutScene(container);
        aboutSceneInstance.init();
      }
    };
    transitionViews(currentView, aboutView, renderFn);
  } else {
    // Handle grid views (work/projects)
    // Cleanup about scene when leaving about page
    if (aboutSceneInstance) {
      aboutSceneInstance.destroy();
      aboutSceneInstance = null;
    }
    
    const renderFn = () => {
      let projectsToRender;
      switch (path) {
        case '/projects':
          projectsToRender = allProjects.filter(p => p.category === 'project');
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
  
  updateActiveNavLink(path, category);
}

// --- Event Listeners Setup ---
function setupEventListeners() {
  // ... (This function remains unchanged, it is already correct) ...
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
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            // Return home from any view when ESC is pressed
            if (!detailView.classList.contains('hidden') || !aboutView.classList.contains('hidden')) {
                router.navigateTo('/');
            }
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
  
  allProjects = await fetchProjects();
  
  // Call the router once on load to render the initial correct view.
  await handleRouteChange(); 
}

// --- Run the Application ---
document.addEventListener('DOMContentLoaded', initializePortfolio);