// src/utils/lazyLoader.js

/**
 * IntersectionObserver instance for lazy loading media elements.
 * Observes elements with `data-src` attributes and loads them when they enter the viewport.
 * 
 * @type {IntersectionObserver}
 */
const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    // If the element is in the viewport
    if (entry.isIntersecting) {
      const element = entry.target;
      const src = element.dataset.src;

      if (!src) {
        console.warn('Lazy loading element missing data-src attribute:', element);
        observer.unobserve(element);
        return;
      }

      // Swap the data-src to src to trigger the load
      if (element.tagName === 'IMG') {
        element.src = src;
        element.onload = () => {
          element.classList.add('loaded');
          element.removeAttribute('data-src');
        };
        element.onerror = () => {
          console.error('Failed to load image:', src);
          element.classList.add('error');
        };
      } else if (element.tagName === 'VIDEO') {
        element.src = src;
        element.classList.add('loaded');
        element.removeAttribute('data-src');
      }
      
      // Stop observing the element once it has been loaded
      observer.unobserve(element);
    }
  });
}, { 
  // Start loading 200px before the element enters the viewport
  rootMargin: '0px 0px 200px 0px',
  // Trigger when at least 10% of the element is visible
  threshold: 0.1
});

/**
 * Finds all elements with a `data-src` attribute within a container and observes them.
 * This function should be called after DOM content has been rendered.
 * 
 * @param {HTMLElement} containerElement - The parent element to search within.
 * @returns {number} The number of elements being observed for lazy loading.
 */
export function initializeLazyLoading(containerElement) {
  if (!containerElement) {
    console.warn('initializeLazyLoading: containerElement is null or undefined');
    return 0;
  }

  const lazyElements = containerElement.querySelectorAll('[data-src]');
  
  if (lazyElements.length === 0) {
    return 0;
  }

  lazyElements.forEach(element => {
    // Add lazy class for CSS styling
    element.classList.add('lazy');
    lazyLoadObserver.observe(element);
  });

  return lazyElements.length;
}

/**
 * Disconnects the lazy loading observer.
 * Useful for cleanup when the application is being destroyed.
 */
export function destroyLazyLoading() {
  lazyLoadObserver.disconnect();
}