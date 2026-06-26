/* ============================================================
   APS LAND — MAIN.JS
   ============================================================ */

/* --- Nav scroll behavior --- */
const nav = document.querySelector('.nav');
function handleNavScroll() {
  if (!nav) return;
  if (window.scrollY > 40) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
}
window.addEventListener('scroll', handleNavScroll, { passive: true });
handleNavScroll();

/* --- Mobile nav toggle --- */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });
  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

/* --- Scroll reveal --- */
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  revealEls.forEach(el => observer.observe(el));
}

/* --- Animated stat counters --- */
function animateCounter(el, target, suffix = '') {
  const duration = 1800;
  const start = performance.now();
  const startVal = 0;
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(startVal + (target - startVal) * eased);
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const statNums = document.querySelectorAll('[data-count]');
if (statNums.length) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        animateCounter(el, target, suffix);
        statsObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  statNums.forEach(el => statsObserver.observe(el));
}

/* --- US Map: covered states --- */
const COVERED_STATES = [
  'TX','OK','LA','AR','NM','CO','WY','UT','MT','KS',
  'ND','SD','NE','MO','MS','AL','TN','KY','WV','OH',
  'PA','VA','GA','CA','AZ','ID','MN','IA'
];

function initMap() {
  const paths = document.querySelectorAll('#us-map path[data-state]');
  const tooltip = document.querySelector('.map-tooltip');
  const mapCanvas = document.querySelector('.map-canvas');

  if (!paths.length) return;

  paths.forEach(path => {
    const state = path.getAttribute('data-state');
    if (COVERED_STATES.includes(state)) {
      path.classList.add('covered');
    }
    path.addEventListener('mouseenter', (e) => {
      if (!tooltip) return;
      const stateName = path.getAttribute('data-name') || state;
      const isCovered = COVERED_STATES.includes(state);
      tooltip.textContent = stateName + (isCovered ? ' — Active Coverage' : '');
      tooltip.style.display = 'block';
    });
    path.addEventListener('mousemove', (e) => {
      if (!tooltip || !mapCanvas) return;
      const rect = mapCanvas.getBoundingClientRect();
      tooltip.style.left = (e.clientX - rect.left + 14) + 'px';
      tooltip.style.top = (e.clientY - rect.top - 12) + 'px';
    });
    path.addEventListener('mouseleave', () => {
      if (tooltip) tooltip.style.display = 'none';
    });
    path.addEventListener('click', () => {
      paths.forEach(p => p.classList.remove('active-state'));
      path.classList.add('active-state');
    });
  });

  // State tag sidebar filters
  const stateTags = document.querySelectorAll('.state-tag[data-state]');
  stateTags.forEach(tag => {
    tag.addEventListener('click', () => {
      const state = tag.getAttribute('data-state');
      stateTags.forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      paths.forEach(p => p.classList.remove('active-state'));
      const target = document.querySelector(`#us-map path[data-state="${state}"]`);
      if (target) target.classList.add('active-state');
    });
  });
}

document.addEventListener('DOMContentLoaded', initMap);

/* --- Contact form --- */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit .btn');
    const success = document.querySelector('.form-success');
    if (btn) {
      btn.textContent = 'Sending…';
      btn.disabled = true;
    }
    // Simulate submission — swap out for real endpoint (Formspree, Netlify, etc.)
    setTimeout(() => {
      if (success) {
        success.style.display = 'block';
        success.textContent = 'Message received. We\'ll be in touch within one business day.';
      }
      if (btn) {
        btn.textContent = 'Message Sent';
      }
      contactForm.reset();
    }, 900);
  });
}
