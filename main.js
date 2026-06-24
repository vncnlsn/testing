'use strict';

const header = document.querySelector('.site-header');
const mobileToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const revealTargets = document.querySelectorAll('.reveal');

function setYear() {
  const el = document.querySelector('[data-year]');
  if (el) el.textContent = String(new Date().getFullYear());
}

function setScrolledState() {
  if (!header) return;
  const threshold = window.scrollY > 18;
  header.classList.toggle('is-scrolled', threshold);
}

function setActiveNav() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/';
  document.querySelectorAll('[data-nav] a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const clean = href.replace(/\/+$/, '') || '/';
    const active = href === '/'
      ? path === '/' || path.endsWith('/index.html')
      : path === clean || path.endsWith(clean + '.html');
    link.classList.toggle('is-active', active);
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

function setupMobileMenu() {
  if (!mobileToggle || !mobileMenu) return;
  const closeMenu = () => {
    mobileMenu.classList.remove('is-open');
    mobileToggle.setAttribute('aria-expanded', 'false');
  };

  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('is-open');
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 820) closeMenu();
  });

  document.addEventListener('click', (event) => {
    if (!mobileMenu.classList.contains('is-open')) return;
    const target = event.target;
    if (!(target instanceof Element)) return;
    if (mobileMenu.contains(target) || mobileToggle.contains(target)) return;
    closeMenu();
  });
}

function setupReveal() {
  if (!('IntersectionObserver' in window)) {
    revealTargets.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealTargets.forEach(el => observer.observe(el));
}

function setupMarquee() {
  const track = document.querySelector('.logo-track');
  if (!track) return;

  // Duplicate once if the markup only contains one set of logos.
  const slots = Array.from(track.children);
  if (slots.length > 0 && !track.dataset.cloned) {
    slots.forEach(node => {
      const clone = node.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      track.appendChild(clone);
    });
    track.dataset.cloned = 'true';
  }
}

function init() {
  setYear();
  setScrolledState();
  setActiveNav();
  setupMobileMenu();
  setupReveal();
  setupMarquee();
  window.addEventListener('scroll', setScrolledState, { passive: true });
}

document.addEventListener('DOMContentLoaded', init);
