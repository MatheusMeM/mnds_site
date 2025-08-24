# mnds-site Interactive Portfolio

**Version:** 1.0.0
**Status:** In Development

An interactive portfolio for Matheus Mendes, built as a modern Single-Page Application (SPA). It features a real-time 3D background powered by Three.js, a minimalist design inspired by gmunk.com, and a fully data-driven content architecture.

## Key Features

- **SPA Routing:** A lightweight, client-side router provides seamless navigation between views without page reloads.
- **Interactive 3D Background:** A performant WebGL canvas renders a persistent, animated particle system.
- **Data-Driven Content:** All project information is managed via a Git-based headless CMS (Sveltia CMS).
- **Component-Based UI:** The user interface is built from modular components.
- **Responsive, Minimalist Design:** A GMUNK-inspired aesthetic with a professional design system.

---

## Content Management

This project uses **Sveltia CMS** for content management, powered by a self-hosted authentication server on Cloudflare Workers. The admin panel is accessible at `/admin/` on the live site.

-   **Workflow:** Log in with your GitHub account.
-   **Process:** Any changes made in the CMS will automatically generate a new commit in the `main` branch.
-   **Deployment:** This commit triggers a new build and deployment on Cloudflare Pages.

---

## File Structure & Architectural Overview

```
mnds_site/
├── public/
│   ├── admin/
│   ├── _redirects
│   ├── data/
│   │   └── projects.json
│   └── media/
├── src/
│   ├── main.js
│   ├── style.css
│   ├── components/
│   ├── scenes/
│   └── utils/
├── index.html
├── package.json
└── roadmap.md
```

---

## Project Changelog & Summary

Development has proceeded through a phased roadmap, establishing a robust foundation before implementing core features.

-   **Current Status:** Phase 2 (Experience & Interaction) is in progress.

-   **`fix(ui): implement markdown parser for project body`**
    -   Integrated the `marked.js` library to correctly render formatted text from the CMS.
    -   Project descriptions now support headings, links, bold/italic text, and other Markdown features.

-   **`feat(cms): implement sveltia cms with self-hosted auth`**
    -   Successfully integrated Sveltia CMS as the content management solution.
    -   Deployed and configured a secure, self-hosted Cloudflare Worker for platform-agnostic GitHub authentication.

-   **`feat(webgl): implement core scene manager and v1 background scene`**
    -   The application now has a live, animated 3D background powered by a modular `SceneManager`.

-   **`refactor(routing): implement category-aware routing and SPA navigation`**
    -   The SPA router was made intelligent, generating URLs like `/work/...` or `/project/...` based on data from `projects.json`.

-   **`feat(ui): implement full project detail view`**
    -   The project detail view now dynamically renders all project metadata, text, and media.

---

## How to Run This Project

1.  **Install Dependencies:**
    ```bash
    npm install
    ```
2.  **Run Development Server:**
    ```bash
    npm run dev