/* ════════════════════════════════════════
   APS Land — main.js v6
   ════════════════════════════════════════ */
'use strict';

/* ── Year ─────────────────────────────── */
document.querySelectorAll('#year').forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* ── Nav: transparent → solid on scroll ─ */
const siteNav = document.getElementById('site-nav');
const hero    = document.querySelector('.hero');
let rafPending = false;

function updateNav() {
  if (!siteNav) return;
  // Only toggle scroll state if nav started transparent (homepage)
  if (siteNav.classList.contains('nav--solid')) return;
  const threshold = hero ? hero.getBoundingClientRect().bottom : 0;
  if (threshold <= siteNav.offsetHeight) {
    siteNav.classList.add('scrolled');
  } else {
    siteNav.classList.remove('scrolled');
  }
  rafPending = false;
}

window.addEventListener('scroll', () => {
  if (!rafPending) {
    requestAnimationFrame(updateNav);
    rafPending = true;
  }
}, { passive: true });

updateNav();

/* ── Mobile nav toggle ─────────────────── */
const hamburger = document.getElementById('nav-hamburger');
const navLinks  = document.getElementById('nav-links');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('is-open');
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ── Scroll fade-in ────────────────────── */
const fadeEls = document.querySelectorAll('.fade-in');

if (fadeEls.length) {
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings slightly
        const delay = (entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('in-view'), delay);
        fadeObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -40px 0px'
  });

  // Add stagger delays to grid siblings
  document.querySelectorAll(
    '.pillars-grid, .process-steps, .values-grid, .leadership-grid, ' +
    '.capability-groups, .landowner-steps, .map-stats'
  ).forEach(parent => {
    parent.querySelectorAll('.fade-in').forEach((el, i) => {
      el.dataset.delay = i * 80;
    });
  });

  fadeEls.forEach(el => fadeObserver.observe(el));
}

/* ── APS Reach Map ─────────────────────── */
const apsMapData = {
  // Active states: set firstYear, counties, parcels when you have real data
  // null values display as [—] placeholders
  activeStates: {
    OR: { name: 'Oregon',        firstYear: null, counties: null, parcels: null },
    CA: { name: 'California',    firstYear: null, counties: null, parcels: null },
    NV: { name: 'Nevada',        firstYear: null, counties: null, parcels: null },
    ID: { name: 'Idaho',         firstYear: null, counties: null, parcels: null },
    MT: { name: 'Montana',       firstYear: null, counties: null, parcels: null },
    WA: { name: 'Washington',    firstYear: null, counties: null, parcels: null },
    ND: { name: 'North Dakota',  firstYear: null, counties: null, parcels: null },
    SD: { name: 'South Dakota',  firstYear: null, counties: null, parcels: null },
    WY: { name: 'Wyoming',       firstYear: null, counties: null, parcels: null },
    UT: { name: 'Utah',          firstYear: null, counties: null, parcels: null },
    CO: { name: 'Colorado',      firstYear: null, counties: null, parcels: null },
    AZ: { name: 'Arizona',       firstYear: null, counties: null, parcels: null },
    NM: { name: 'New Mexico',    firstYear: null, counties: null, parcels: null },
    TX: { name: 'Texas',         firstYear: null, counties: null, parcels: null },
    OK: { name: 'Oklahoma',      firstYear: null, counties: null, parcels: null },
    LA: { name: 'Louisiana',     firstYear: null, counties: null, parcels: null },
    KS: { name: 'Kansas',        firstYear: null, counties: null, parcels: null },
    MO: { name: 'Missouri',      firstYear: null, counties: null, parcels: null },
    AR: { name: 'Arkansas',      firstYear: null, counties: null, parcels: null },
    PA: { name: 'Pennsylvania',  firstYear: null, counties: null, parcels: null },
    OH: { name: 'Ohio',          firstYear: null, counties: null, parcels: null },
    WV: { name: 'West Virginia', firstYear: null, counties: null, parcels: null },
    KY: { name: 'Kentucky',      firstYear: null, counties: null, parcels: null },
    TN: { name: 'Tennessee',     firstYear: null, counties: null, parcels: null },
    NE: { name: 'Nebraska',      firstYear: null, counties: null, parcels: null },
    IL: { name: 'Illinois',      firstYear: null, counties: null, parcels: null },
    IA: { name: 'Iowa',          firstYear: null, counties: null, parcels: null },
    IN: { name: 'Indiana',       firstYear: null, counties: null, parcels: null },
    AK: { name: 'Alaska',        firstYear: null, counties: null, parcels: null },
    HI: { name: 'Hawaii',        firstYear: null, counties: null, parcels: null },
  },

  // Panel elements
  mapEl:       null,
  panelEl:     null,
  panelData:   null,
  stateName:   null,
  firstYearEl: null,
  countiesEl:  null,
  parcelsEl:   null,

  init() {
    this.mapEl       = document.getElementById('aps-map');
    this.panelEl     = document.getElementById('map-panel');
    this.panelData   = document.getElementById('map-panel-data');
    this.stateName   = document.getElementById('panel-state-name');
    this.firstYearEl = document.getElementById('panel-first-year');
    this.countiesEl  = document.getElementById('panel-counties');
    this.parcelsEl   = document.getElementById('panel-parcels');

    if (!this.mapEl) return;

    Object.keys(this.activeStates).forEach(id => {
      const el = this.mapEl.querySelector('#' + id);
      if (!el) return;
      el.classList.add('state--active');
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', this.activeStates[id].name);

      el.addEventListener('pointerenter', () => this.show(id));
      el.addEventListener('pointerleave', () => this.clear());
      el.addEventListener('focus',        () => this.show(id));
      el.addEventListener('blur',         () => this.clear());
    });
  },

  setVal(el, val) {
    if (!el) return;
    if (val !== null && val !== undefined) {
      el.textContent = String(val);
      el.classList.remove('is-placeholder');
    } else {
      el.textContent = '[—]';
      el.classList.add('is-placeholder');
    }
  },

  show(id) {
    const data  = this.activeStates[id];
    if (!data) return;
    const stateEl = this.mapEl.querySelector('#' + id);

    // Map highlight
    this.mapEl.classList.add('map--has-hover');
    this.mapEl.querySelectorAll('.state--hover').forEach(el => el.classList.remove('state--hover'));
    if (stateEl) stateEl.classList.add('state--hover');

    // Panel — fade out content, update, fade back
    if (this.panelEl) {
      if (this.panelData) this.panelData.style.opacity = '0';

      setTimeout(() => {
        if (this.stateName)   this.stateName.textContent = data.name.toUpperCase();
        this.setVal(this.firstYearEl, data.firstYear);
        this.setVal(this.countiesEl,  data.counties);
        this.setVal(this.parcelsEl,   data.parcels);
        this.panelEl.classList.add('panel--active');
        if (this.panelData) this.panelData.style.opacity = '';
      }, 80);
    }
  },

  clear() {
    this.mapEl.classList.remove('map--has-hover');
    this.mapEl.querySelectorAll('.state--hover').forEach(el => el.classList.remove('state--hover'));

    if (this.panelEl) {
      if (this.panelData) this.panelData.style.opacity = '0';
      setTimeout(() => {
        this.panelEl.classList.remove('panel--active');
        if (this.panelData) this.panelData.style.opacity = '';
      }, 80);
    }
  },
};

document.addEventListener('DOMContentLoaded', () => apsMapData.init());
