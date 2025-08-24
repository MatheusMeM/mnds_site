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
- [x] **Architect Data Layer & "API" Contract** `[E:2, I:High, R:Low]`
- [x] **Define Design System & Visual Language** `[E:3, I:High, R:Low]`
- [x] **Set Up Core Scene Architecture** `[E:5, I:High, R:Med]`
- [x] **Implement Sveltia CMS for Content Management** `[E:3, I:High, R:Med]`
- [ ] **Establish Performance Budget** `[E:1, I:Med, R:Low]`

---

### **Phase 1: Core Implementation (The Visible MVP)**

*Objective: Build the primary, visible components of the site based on the architectural decisions from Phase 0.*

- [x] **Implement Static UI & Layout** `[E:3, I:High, R:Low]`
- [x] **Develop Dynamic Project Grid** `[E:3, I:High, R:Low]`
- [x] **Develop Background Scene v1** `[E:5, I:High, R:High]`
- [x] **Orchestrate Application Entry Point** `[E:2, I:High, R:Low]`
- [x] **Implement SPA Routing for Project Pages** `[E:3, I:High, R:Low]`
- [x] **Implement Full Project Detail View** `[E:3, I:Med, R:Low]`

---

### **Phase 2: Experience & Interaction (The "Wow" Factor)**

*Objective: Layer in the signature interactive elements and polish the user journey.*

- [ ] **Enhance Project Detail View** `[E:5, I:High, R:Low]`
    - [x] **`fix`**: Implement Markdown parser (`marked.js`) to correctly render body text.
    - [ ] **`feat`**: Implement an automatic, responsive grid layout for the media gallery.

- [ ] **Refine Navigation & Flow** `[E:2, I:Med, R:Low]`
    - `[ ]` **`feat`**: Implement active states for the main navigation links to indicate the current page.
    - `[ ]` **`style`**: Animate the entry/exit transitions between the grid and detail views.

- [ ] **Develop "About" Interactive Scene** `[E:8, I:High, R:High]`
    - `[ ]` `feat`: Build the `aboutScene.js` with a 3D model and mouse-controlled point light.
    - `[ ]` `perf`: Aggressively optimize geometry, materials, and lighting.
    - **QA Gate:** Verify 60fps performance on target desktop and mobile devices.

---

### **Phase 3: Hardening & Extensibility (The Professional Polish)**

*Objective: Transform the functional site into a production-ready, robust, and accessible application.*

- [ ] **Implement Performance Optimizations** `[E:3, I:High, R:Med]`
    - `[ ]` **`perf`**: Implement lazy loading for media gallery images and videos to improve initial page load.

- [ ] **Implement Preloader & Asset Management** `[E:3, I:Med, R:Med]`
- [ ] **Conduct Accessibility (a11y) Audit & Remediation** `[E:5, I:High, R:Med]`
- [ ] **Implement Internationalization (i18n)** `[E:5, I:Med, R:Low]`
- [ ] **Final Performance & QA Sweep** `[E:3, I:High, R:Low]`

---

### **Backlog & Future Ideas**

*A collection of potential future enhancements once the core project is complete.*

- [ ] `idea`: Experiment with more advanced shaders in the scenes.
- [ ] `idea`: Implement project filtering based on tags.