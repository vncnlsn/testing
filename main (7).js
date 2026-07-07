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
  function step(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(target * eased);
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

/* --- Services page: tab selector --- */
const servicesTabs = document.querySelectorAll('.services-tab');
if (servicesTabs.length) {
  const tabList = document.querySelector('.services-sidebar');

  function activateTab(tab, { focus = false } = {}) {
    servicesTabs.forEach(t => {
      const isActive = t === tab;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive);
      t.tabIndex = isActive ? 0 : -1;
      const panel = document.getElementById(t.dataset.panel);
      if (panel) {
        panel.classList.toggle('active', isActive);
        panel.hidden = !isActive;
      }
    });
    if (focus) tab.focus();
  }

  servicesTabs.forEach(tab => {
    tab.addEventListener('click', () => activateTab(tab));
  });

  if (tabList) {
    tabList.addEventListener('keydown', (e) => {
      const tabsArr = Array.from(servicesTabs);
      const current = tabsArr.indexOf(document.activeElement);
      if (current === -1) return;
      let next = null;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = tabsArr[(current + 1) % tabsArr.length];
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = tabsArr[(current - 1 + tabsArr.length) % tabsArr.length];
      if (next) {
        e.preventDefault();
        activateTab(next, { focus: true });
      }
    });
  }

  const hashId = window.location.hash.replace('#', '');
  if (hashId) {
    const hashTab = document.getElementById('tab-' + hashId);
    if (hashTab) activateTab(hashTab);
  }
}

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
    setTimeout(() => {
      if (success) {
        success.style.display = 'block';
        success.textContent = 'Message received. We\'ll be in touch within one business day.';
      }
      if (btn) btn.textContent = 'Message Sent';
      contactForm.reset();
    }, 900);
  });
}
