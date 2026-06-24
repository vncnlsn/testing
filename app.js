/**
 * APS Land Services - Core UX Interaction Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.nav-wrap');
  
  // Controls the clean structural scroll anchor transitions
  const checkScroll = () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  // Run immediately on initialization to catch initial position state
  checkScroll();

  // Scroll event observer
  window.addEventListener('scroll', checkScroll);
});
