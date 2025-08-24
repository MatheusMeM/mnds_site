# mnds-site Interactive Portfolio

**Version:** 1.0.0
**Status:** In Development

An interactive portfolio for Matheus Mendes, built as a modern Single-Page Application (SPA). It features a real-time 3D background powered by Three.js, a minimalist design inspired by gmunk.com, and a fully data-driven content architecture.

## Key Features

- **SPA Routing:** A lightweight, client-side router provides seamless navigation between views without page reloads, enabling unique, shareable URLs for each project.
- **Interactive 3D Background:** A performant WebGL canvas renders a persistent, animated particle system managed by a modular scene manager.
- **Data-Driven Content:** All project information is managed via a Git-based headless CMS (Sveltia CMS), allowing for easy content updates without touching the codebase.
- **Component-Based UI:** The user interface is built from modular components responsible for specific tasks.
- **Responsive, Minimalist Design:** A GMUNK-inspired aesthetic with a professional design system built on CSS variables.

---

## Content Management

This project uses **Sveltia CMS** for content management, powered by a self-hosted authentication server on Cloudflare Workers. The admin panel is accessible at `/admin/` on the live site.

-   **Workflow:** Log in with your GitHub account.
-   **Process:** Any changes made in the CMS will automatically generate a new commit in the `main` branch.
-   **Deployment:** This commit triggers a new build and deployment on Cloudflare Pages.

---

## File Structure & Architectural Overview

The project follows a modular structure that separates concerns between data, state, UI, and rendering logic.

```
mnds_site/
├── public/
│   ├── admin/                  # [CRITICAL] Sveltia CMS application and config
│   │   ├── config.yml
│   │   └── index.html
│   ├── _redirects              # [CRITICAL] SPA routing rules for Cloudflare Pages
│   ├── data/
│   │   └── projects.json       # [CRITICAL] The project's "API". Single source of truth.
│   └── media/
│       ├── project/
│       └── work/
├── src/
│   ├── main.js                 # [CRITICAL] Application entry point and orchestrator.
│   ├── style.css               # Global styles & Design System.
│   ├── components/
│   ├── scenes/
│   │   ├── SceneManager.js     # [CRITICAL] Manages the core Three.js renderer and render loop.
│   │   └── backgroundScene.js
│   └── utils/
│       ├── projectLoader.js
│       └── router.js           # [CRITICAL] Client-side router utility.
├── index.html
├── package.json
└── roadmap.md
```

---

## Project Changelog & Summary

Development has proceeded through a phased roadmap, establishing a robust foundation before implementing core features.

-   **Current Status:** Phase 2 (Experience & Interaction) is in progress.

-   **`feat(cms): implement sveltia cms with self-hosted auth`**
    -   Successfully integrated Sveltia CMS as the content management solution.
    -   Deployed and configured a secure, self-hosted Cloudflare Worker for platform-agnostic GitHub authentication.
    -   The admin panel at `/admin/` is now fully operational, replacing the need for manual JSON editing.

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
    -   The project detail view now dynamically renders all project metadata, descriptive text, and media gallery with proper handling of both images and videos. The component is styled professionally and is fully responsive.

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