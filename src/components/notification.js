// src/components/notification.js

/**
 * Displays a temporary notification message on the screen.
 * Follows the project's functional component pattern with clean separation of concerns.
 * 
 * @param {string} message - The message to display to the user.
 * @param {string} type - The type of notification ('error' or 'info'). Defaults to 'error'.
 */
export function showNotification(message, type = 'error') {
  // Create the notification element
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.textContent = message;

  // Append to the body
  document.body.appendChild(notification);

  // Animate in with a small delay to allow CSS transitions to apply
  setTimeout(() => {
    notification.classList.add('visible');
  }, 10);

  // Automatically remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove('visible');
    // Remove from DOM after the transition completes
    notification.addEventListener('transitionend', () => notification.remove());
  }, 5000);
}