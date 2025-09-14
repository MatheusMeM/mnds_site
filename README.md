# mnds-site Interactive Portfolio

**Version:** 1.0.0  
**Status:** Content-Ready (3 minor fixes recommended)  
**Last Reviewed:** January 2025  
**Technology Stack:** Vanilla JS, Three.js, Vite, Sveltia CMS, Cloudflare Pages

---

## 📖 Project Overview

An interactive portfolio for Matheus Mendes showcasing creative technology projects. Built as a modern Single-Page Application (SPA) with real-time 3D graphics, demonstrating professional frontend development practices.

**Design Philosophy:** Minimalist, GMUNK-inspired aesthetic with sophisticated interactions and smooth transitions.

---

## 🏗️ Architecture Overview

### **Core Architecture Pattern: Component-Module Hybrid**

The codebase follows a **functional component architecture** with **ES6 modules**, avoiding framework overhead while maintaining clean separation of concerns.

```
mnds_site/
├── public/                     # Static assets and CMS data
│   ├── admin/                  # Sveltia CMS configuration
│   ├── data/projects.json      # Content data source
│   └── media/projects/         # Project images and videos
├── src/
│   ├── main.js                 # Application entry point & orchestration
│   ├── style.css               # CSS module entry point
│   ├── components/             # UI rendering functions
│   │   ├── projectGrid.js      # Grid view component
│   │   └── projectDetailView.js # Detail view component
│   ├── scenes/                 # WebGL scene management
│   │   ├── SceneManager.js     # WebGL renderer controller
│   │   └── backgroundScene.js  # Particle system implementation
│   ├── styles/                 # Modular CSS architecture
│   │   ├── _variables.css      # Design system tokens
│   │   ├── _base.css           # Global styles and resets
│   │   ├── _header.css         # Navigation styles
│   │   ├── _project-grid.css   # Grid layout styles
│   │   ├── _project-detail.css # Detail view styles
│   │   └── _transitions.css    # Animation and transition styles
│   └── utils/                  # Core application utilities
│       ├── projectLoader.js    # Data fetching and caching
│       └── router.js           # SPA routing system
├── index.html                  # Application shell
├── package.json                # Dependencies and scripts
└── roadmap.md                  # Development roadmap
```

---

## 🎯 Code Review Findings

### **✅ Strong Architecture Elements**

#### **Modular CSS System**
- Professional design token system in [`_variables.css`](src/styles/_variables.css)
- Clean separation of contents SoC across 6 partial files
- Responsive design with mobile-first approach
- Sophisticated transitions and animations

#### **Component Architecture**
- Pure functional components with clear APIs
- Single responsibility principle followed
- Clean separation between presentation and logic
- Intelligent media type handling (image/video/gif)

#### **WebGL Integration**
- Professional SceneManager pattern in [`SceneManager.js`](src/scenes/SceneManager.js)
- Proper Three.js renderer setup with optimization flags
- Clean scene lifecycle management
- Extensible architecture for multiple 3D contexts

#### **Routing System**
- Category-aware URL generation (`/work/id`, `/project/id`)
- Clean browser history integration
- Lightweight SPA implementation without framework overhead

### **⚠️ Issues Identified**

#### **Issue #1: Hardcoded Performance Settings**
**Location:** [`src/scenes/backgroundScene.js:15`](src/scenes/backgroundScene.js:15)
```javascript
const particleCount = 5000; // Same count for all devices
```
**Impact:** No device capability consideration for WebGL rendering

#### **Issue #2: Silent Error Handling**
**Location:** [`src/utils/projectLoader.js:23-27`](src/utils/projectLoader.js:23-27)
```javascript
} catch (error) {
  console.error("Failed to fetch or parse projects.json:", error);
  return []; // User sees empty grid with no explanation
}
```
**Impact:** Network failures result in blank screens

#### **~~Issue #3: No Progressive Loading~~** ✅ **RESOLVED**
**Location:** ~~Image rendering in components~~ → [`src/utils/lazyLoader.js`](src/utils/lazyLoader.js)
**Impact:** ~~All gallery images load simultaneously~~ → **Progressive loading with IntersectionObserver**
**Resolution:** Implemented professional lazy loading with fade-in animations and loading shimmer

---

## 🚀 Technology Stack & Dependencies

### **Core Dependencies**
- **three**: ^0.179.1 - WebGL 3D graphics library
- **marked**: ^16.2.0 - Markdown parsing for project descriptions
- **vite**: ^7.1.2 - Build tool and development server

### **Development Environment**
- **Node.js**: 18+ required
- **Package Manager**: npm (lockfile present)
- **Browser Support:** Modern browsers with ES6+ and WebGL support

### **Build & Deployment**
- **Build Tool:** Vite with ES module output
- **Hosting:** Cloudflare Pages with automatic deployments
- **CMS:** Sveltia CMS with GitHub backend
- **Authentication:** PKCE-based GitHub OAuth via Cloudflare Workers

---

## 🔧 Development Workflow

### **Getting Started**
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### **Project Structure Guidelines**
- **Components**: Pure functions in `/src/components/`
- **Utilities**: Helper functions in `/src/utils/`
- **Styles**: Modular CSS in `/src/styles/`
- **Scenes**: WebGL scenes in `/src/scenes/`
- **Data**: JSON files in `/public/data/`

### **Code Style Standards**
- ES6+ modules with explicit imports/exports
- Functional programming patterns preferred
- JSDoc comments for all public functions
- CSS custom properties for theming
- Mobile-first responsive design

---

## 📝 Content Management

### **Sveltia CMS Integration**
- **Access**: `/admin/` (requires GitHub authentication)
- **Workflow**: Edit → Commit → Auto-deploy
- **Data Structure**: Validated through [`config.yml`](public/admin/config.yml)
- **Media Management**: Automatic optimization and CDN delivery

### **Project Data Schema**
```json
{
  "id": "string (unique identifier)",
  "title": "string",
  "year": "number",
  "client": "string",
  "role": "string",
  "category": "work | project",
  "tags": ["array", "of", "strings"],
  "body": "markdown string",
  "thumbnail": {
    "type": "image | video | gif",
    "path": "/media/projects/filename.ext"
  },
  "mediaGallery": [
    {
      "type": "image | video | gif",
      "path": "/media/projects/filename.ext",
      "caption": "optional string",
      "layout": "standard | wide | tall | large | full-bleed"
    }
  ]
}
```

---

## 🔒 Security Considerations

### **Current Security Measures**
- **HTTPS Enforcement**: Via Cloudflare Pages
- **Content Security**: GitHub-based review process for all content
- **Authentication**: Secure PKCE OAuth flow for CMS access
- **Environment Variables**: Proper secrets management via Vite

### **Security Recommendations**
- Regular `npm audit` for dependency vulnerabilities
- Content sanitization review for markdown rendering
- Runtime validation for CMS data structure

---

## 📈 Quick Fixes Recommended

Based on code review, these 3 issues can be addressed quickly:

### **Fix #1: Responsive Particles**
```javascript
// In src/scenes/backgroundScene.js:15
const particleCount = window.innerWidth < 768 ? 1500 : 5000;
```

### **Fix #2: Error User Feedback**
```javascript
// In src/utils/projectLoader.js - add user notification
} catch (error) {
  console.error("Failed to fetch or parse projects.json:", error);
  // Add: showErrorMessage("Unable to load projects. Please refresh.");
  return [];
}
```

### **~~Fix #3: Basic Lazy Loading~~** ✅ **IMPLEMENTED**
~~Implement intersection observer for gallery images to improve perceived performance.~~
**Completed:** Professional IntersectionObserver implementation with 500ms fade-in animations

---

## 🎯 Future AI Agent Instructions

**For future code reviews or modifications:**

1. **Architecture Preservation**: Maintain the functional component pattern and modular CSS system
2. **Performance Focus**: Any WebGL changes should consider device capabilities
3. **Error Handling**: Ensure user feedback for all failure scenarios
4. **State Management**: Current global state in [`main.js`](src/main.js) is functional for portfolio scale

**Key Files for AI Context:**
- [`src/main.js`](src/main.js) - Application orchestration and routing logic
- [`src/scenes/SceneManager.js`](src/scenes/SceneManager.js) - WebGL lifecycle management
- [`src/utils/router.js`](src/utils/router.js) - SPA routing implementation
- [`src/styles/_variables.css`](src/styles/_variables.css) - Design system tokens
- [`public/data/projects.json`](public/data/projects.json) - Content data structure

**Architecture Decisions to Preserve:**
- Modular CSS with custom properties
- Functional component patterns
- Scene manager abstraction for WebGL
- Git-based CMS workflow

---

## 📊 Current Status

**Ready for Content Addition:** The portfolio has solid architectural foundations and professional implementation patterns. The 3 identified issues are minor and don't prevent content creation or deployment.

**Next Steps:** Add project content via CMS, then optionally implement the quick fixes for enhanced reliability.

This codebase demonstrates strong technical foundations suitable for professional portfolio use and job applications.