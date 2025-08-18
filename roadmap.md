# Project Roadmap: mnds-site Interactive Portfolio (v2.0)

This architectural blueprint outlines the development of the `mnds-site` portfolio. It prioritizes a robust foundation, early risk mitigation, and continuous integration of non-functional requirements. This is a living document.

**Legend:**
- `[x]` - Completed
- `[ ]` - To Do
- `E`: Effort (Points) | `I`: Impact | `R`: Risk

---

### **Phase 0: Architectural Blueprint & Foundation**

*Objective: Establish the project's core architecture, tooling, and non-functional requirements. A failure in this phase creates technical debt that compounds over time.*

- [x] **Establish Project Environment & Tooling** `[E:3, I:High, R:Low]`
    - `[x]` `chore`: Setup Vite project with Vanilla JS template.
    - `[x]` `chore`: Initialize Git repository and push to GitHub.
    - `[x]` `chore`: Configure and deploy initial project to Cloudflare Pages.
    - `[x]` `chore`: Set up ESLint and Prettier for code quality and consistency.
    - `[x]` `docs`: Define RooCode AI Agent persona and project directives.

- [x] **Architect Data Layer & "API" Contract** `[E:2, I:High, R:Low]`
    - `[x]` `feat`: Finalize the schema for `projects.json`. This is our API contract.
    - `[x]` `feat`: Create `projectLoader.js` utility with robust error handling.

- [x] **Define Design System & Visual Language** `[E:3, I:High, R:Low]`
    - `[x]` `docs`: Establish design tokens (colors, typography, spacing, grid) in a central CSS file or variables.
    - `[x]` `docs`: Define motion design principles (transition speeds, easing functions).

- [ ] **Establish Performance Budget** `[E:1, I:Med, R:Low]`
    - `[ ]` `docs`: Set performance targets (e.g., Lighthouse score > 95, Largest Contentful Paint < 2.5s, mobile interactive < 5s). This informs all future decisions.

- [ ] **Set Up Core Scene Architecture** `[E:5, I:High, R:Med]`
    - `[ ]` `refactor`: Create a main `SceneManager.js` class to handle the renderer, camera, and render loop.
    - `[ ]` `refactor`: Design a simple interface for "scenes" (`backgroundScene`, `aboutScene`) so they can be easily swapped or layered by the manager.

---

### **Phase 1: Core Implementation (The Visible MVP)**

*Objective: Build the primary, visible components of the site based on the architectural decisions from Phase 0.*

- [x] **Implement Static UI & Layout** `[E:3, I:High, R:Low]`
    - `[x]` `feat`: Build the core HTML structure and navigation skeleton.
    - `[x]` `style`: Implement the design system via CSS, ensuring basic responsiveness.

- [x] **Develop Dynamic Project Grid** `[E:3, I:High, R:Low]`
    - `[x]` `feat`: Create the `ProjectGrid.js` component that fetches data and renders project cards.
    - `[x]` `feat`: Implement the click-through logic to a placeholder project detail view/modal.

- [ ] **Develop Background Scene v1** `[E:5, I:High, R:High]`
    - `[ ]` `feat`: Implement the abstract Three.js background with basic geometry/shaders.
    - `[ ]` `feat`: Add subtle mouse-tracking interactivity.
    - **QA Gate:** Test on a low-powered mobile device. If performance is poor, this high-risk item must be re-architected before proceeding.

- [x] **Orchestrate Application Entry Point** `[E:2, I:High, R:Low]`
    - `[x]` `refactor`: Update `main.js` to initialize all systems in the correct order (data fetching, UI rendering, scene management).

- [x] **Implement SPA Routing for Project Pages** `[E:3, I:High, R:Low]`
    - `[x]` `feat`: Create a client-side router to enable unique URLs for each project.
    - `[x]` `feat`: Implement navigation between the project grid and detail views without page reloads.

---

### **Phase 2: Experience & Interaction (The "Wow" Factor)**

*Objective: Layer in the signature interactive elements and polish the user journey.*

- [ ] **Develop "About" Interactive Scene** `[E:8, I:High, R:High]`
    - `[ ]` `feat`: Build the `aboutScene.js` with the 3D model and mouse-controlled point light.
    - `[ ]` `perf`: Aggressively optimize geometry, materials, and lighting. No dynamic shadows. Throttle mouse events.
    - **QA Gate:** Verify 60fps performance on target desktop and mobile devices.

- [ ] **Implement Full Project Detail View** `[E:3, I:Med, R:Low]`
    - `[ ]` `feat`: Build out the modal or page to display the full project video, description, and tags.
    - `[ ]` `style`: Animate the entry/exit of this view.

- [ ] **Refine Navigation & Flow** `[E:2, I:Med, R:Low]`
    - `[ ]` `feat`: Implement smooth-scrolling and active states for the main navigation.

---

### **Phase 3: Hardening & Extensibility (The Professional Polish)**

*Objective: Transform the functional site into a production-ready, robust, and accessible application.*

- [ ] **Implement Preloader & Asset Management** `[E:3, I:Med, R:Med]`
    - `[ ]` `feat`: Create a loading manager to track the progress of 3D assets.
    - `[ ]` `feat`: Display a minimal loading screen to prevent a blank page on initial visit.

- [ ] **Conduct Accessibility (a11y) Audit & Remediation** `[E:5, I:High, R:Med]`
    - `[ ]` `fix`: Ensure all UI is keyboard-navigable.
    - `[ ]` `fix`: Add appropriate ARIA attributes to interactive elements.
    - `[ ]` `fix`: Verify sufficient color contrast.

- [ ] **Implement Internationalization (i18n)** `[E:5, I:Med, R:Low]`
    - `[ ]` `feat`: Create JSON files for `en` and `pt` languages.
    - `[ ]` `refactor`: Abstract all UI strings to use a language-switching utility.

- [ ] **Final Performance & QA Sweep** `[E:3, I:High, R:Low]`
    - `[ ]` `perf`: Audit against the performance budget defined in Phase 0.
    - `[ ]` `test`: Conduct cross-browser and cross-device testing.

---

### **Backlog & Future Ideas**

*A collection of potential future enhancements once the core project is complete.*

- [ ] `idea`: Integrate a headless CMS to manage projects.
- [ ] `idea`: Experiment with more advanced shaders in the scenes.
- [ ] `idea`: Implement project filtering based on tags.