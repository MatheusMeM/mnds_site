Acknowledged. Here is the complete `README.md` file formatted in a single Markdown code block.

```markdown
# mnds-site Interactive Portfolio

**Version:** 1.0.0
**Status:** In Development

An interactive portfolio for Matheus Mendes, built as a modern Single-Page Application (SPA). It features a real-time 3D background powered by Three.js, a minimalist design inspired by gmunk.com, and a fully data-driven content architecture.

## Key Features

- **SPA Routing:** A lightweight, client-side router provides seamless navigation between views without page reloads, enabling unique, shareable URLs for each project.
- **Interactive 3D Background:** A performant WebGL canvas renders a persistent, animated particle system managed by a modular scene manager.
- **Data-Driven Content:** All project information is decoupled from the application logic, stored in a central `projects.json` file. This allows for easy content updates without touching the codebase.
- **Component-Based UI:** The user interface is built from modular components responsible for specific tasks (e.g., rendering the project grid, rendering a project detail page).
- **Responsive, Minimalist Design:** A GMUNK-inspired aesthetic with a professional design system built on CSS variables ensures a consistent and clean look across all devices.

---

## File Structure & Architectural Overview

The project follows a modular structure that separates concerns between data, state, UI, and rendering logic.

```
mnds_site/
├── public/                     # Static assets, copied as-is to production build
│   ├── _redirects              # [CRITICAL] SPA routing rules for Cloudflare Pages
│   ├── data/
│   │   └── projects.json       # [CRITICAL] The project's "API". Single source of truth for all content.
│   └── media/
│       ├── project/            # Media for "Personal Project" category
│       │   └── [project-id]/   # Self-contained project assets
│       └── work/               # Media for "Work" category
│           └── [project-id]/
├── src/                        # Application source code (processed by Vite)
│   ├── main.js                 # [CRITICAL] Application entry point and orchestrator.
│   ├── style.css               # Global styles & Design System (CSS Variables).
│   ├── components/
│   │   ├── projectDetailView.js # Renders a single project's page.
│   │   └── projectGrid.js      # Renders the grid of project cards.
│   ├── scenes/
│   │   ├── SceneManager.js     # [CRITICAL] Manages the core Three.js renderer and render loop.
│   │   └── backgroundScene.js  # Defines the content of the 3D background.
│   └── utils/
│       ├── projectLoader.js    # Utility for fetching and parsing projects.json.
│       └── router.js           # [CRITICAL] Client-side router utility.
├── index.html                  # The single HTML shell for the SPA.
├── package.json                # Project dependencies and scripts.
└── roadmap.md                  # Strategic project plan and progress tracker.
```

---

## Key Module & Function Definitions

This section details the responsibility and public API of the most important modules.

### Core Architecture

-   **`src/main.js`**
    -   **Responsibility:** The central orchestrator. Initializes all systems, sets up event listeners, and coordinates the routing logic.
    -   **Key Logic:** `handleRouteChange()` function acts as the main controller, determining which view to render based on the current URL.

-   **`src/scenes/SceneManager.js`**
    -   **Responsibility:** The "3D engine" of the application. Encapsulates all core Three.js logic.
    -   **API:**
        -   `constructor(canvas)`: Initializes the WebGL renderer.
        -   `setScene(scene)`: Sets the active scene to be rendered.
        -   `render()`: Starts the `requestAnimationFrame` loop.
        -   `onWindowResize()`: Handles viewport resizing.

-   **`src/utils/router.js`**
    -   **Responsibility:** Manages all interactions with the browser's History API for SPA navigation.
    -   **API:**
        -   `navigateTo(path)`: Programmatically changes the URL and triggers a route change event.
        -   `getCurrentLocation()`: Parses the current `window.location.pathname` and returns the route, category, and project ID.

-   **`src/utils/projectLoader.js`**
    -   **Responsibility:** The data-fetching layer.
    -   **API:**
        -   `async fetchProjects()`: Fetches and parses `/data/projects.json`, returning a `Promise` that resolves to an array of project objects.

### UI Components

-   **`src/components/projectGrid.js`**
    -   **Responsibility:** Renders the grid of project cards.
    -   **API:**
        -   `renderProjectGrid(projects, containerElement)`: Takes an array of project objects and injects the corresponding HTML into the container. Handles different thumbnail media types (`video`, `image`).

-   **`src/components/projectDetailView.js`**
    -   **Responsibility:** Renders the detailed page for a single project.
    -   **API:**
        -   `renderProjectDetail(project, containerElement)`: Takes a single project object and renders its title, body, and media gallery.

---

## Project Changelog & Summary

Development has proceeded through a phased roadmap, establishing a robust foundation before implementing core features.

-   **Current Status:** Phase 2 (Experience & Interaction) is in progress.

-   **`feat(webgl): implement core scene manager and v1 background scene`**
    -   The application now has a live, animated 3D background powered by a modular `SceneManager`. This establishes the core visual identity.

-   **`refactor(routing): implement category-aware routing and SPA navigation`**
    -   The SPA router was made intelligent. It now generates URLs like `/work/...` or `/project/...` based on the data in `projects.json`. Main navigation is now fully integrated into the SPA lifecycle.

-   **`feat(ui): implement core layout, design system, and initial view switching`**
    -   The visual foundation was built. A GMUNK-inspired design system using CSS variables was implemented, along with the main HTML structure and a fixed header.

-   **`feat(data): re-architect data model to project-centric structure`**
    -   A major architectural improvement. The `projects.json` schema was enhanced to support richer content (galleries, mixed-media thumbnails). The physical media assets were reorganized into a scalable, project-centric folder structure.

-   **`feat(core): establish project's data layer and API contract`**
    -   The initial data architecture was created, decoupling content from code via `projects.json` and a `projectLoader` utility.

-   **`feat(ui): implement full project detail view`**
    -   The project detail view now displays all project metadata, descriptive text, and media gallery with proper handling of both images and videos. The component is styled professionally and is fully responsive.

-   **`refactor(ui): update header to scrolling layout and add link animations`**
    -   The header was refactored to a scrolling layout with the logo on the left and navigation links on the right. Navigation links now feature a subtle underline and brightness animation on hover. The MNDS logo is now a clickable link that navigates to the home view.

---

## How to Run This Project

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Run Development Server:**
    ```bash
    npm run dev
    ```
3.  **Build for Production:**
    ```bash
    npm run build
    ```

```