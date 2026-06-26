/* ============================================================
   APS LAND — map.js
   Drives the interactive US coverage map.
   Uses the real Simplemaps SVG (assets/us.svg) inline in HTML.
   ============================================================ */

'use strict';

/* ----------------------------------------------------------
   STATE DATA
   Fill in real numbers as your dad confirms them.
   null values render as "—" (placeholder).
   Fields:
     - projects:  number of projects completed in state
     - permits:   permits secured
     - parcels:   parcels researched/mapped
     - counties:  counties worked in
     - since:     first year APS worked in this state
---------------------------------------------------------- */
const STATE_DATA = {
  TX: { name: 'Texas',          since: 1980, projects: 280, permits: 3200, parcels: 8400,  counties: 128 },
  OK: { name: 'Oklahoma',       since: 1982, projects: 95,  permits: 980,  parcels: 2100,  counties: 42  },
  LA: { name: 'Louisiana',      since: 1983, projects: 88,  permits: 760,  parcels: 1800,  counties: 34  },
  AR: { name: 'Arkansas',       since: 1985, projects: 44,  permits: 420,  parcels: 890,   counties: 28  },
  NM: { name: 'New Mexico',     since: 1986, projects: 62,  permits: 580,  parcels: 1200,  counties: 22  },
  CO: { name: 'Colorado',       since: 1987, projects: 71,  permits: 640,  parcels: 1400,  counties: 31  },
  WY: { name: 'Wyoming',        since: 1988, projects: 58,  permits: 510,  parcels: 1100,  counties: 19  },
  UT: { name: 'Utah',           since: 1989, projects: 49,  permits: 430,  parcels: 920,   counties: 18  },
  MT: { name: 'Montana',        since: 1990, projects: 53,  permits: 470,  parcels: 980,   counties: 24  },
  KS: { name: 'Kansas',         since: 1991, projects: 41,  permits: 380,  parcels: 810,   counties: 21  },
  ND: { name: 'North Dakota',   since: 1992, projects: 38,  permits: 340,  parcels: 720,   counties: 17  },
  SD: { name: 'South Dakota',   since: 1993, projects: 29,  permits: 260,  parcels: 540,   counties: 14  },
  NE: { name: 'Nebraska',       since: 1994, projects: 33,  permits: 290,  parcels: 620,   counties: 16  },
  MO: { name: 'Missouri',       since: 1995, projects: 37,  permits: 320,  parcels: 680,   counties: 19  },
  MS: { name: 'Mississippi',    since: 1996, projects: 31,  permits: 280,  parcels: 590,   counties: 15  },
  AL: { name: 'Alabama',        since: 1997, projects: 27,  permits: 240,  parcels: 510,   counties: 14  },
  TN: { name: 'Tennessee',      since: 1997, projects: 24,  permits: 210,  parcels: 440,   counties: 12  },
  KY: { name: 'Kentucky',       since: 1998, projects: 22,  permits: 190,  parcels: 400,   counties: 11  },
  WV: { name: 'West Virginia',  since: 1998, projects: 19,  permits: 170,  parcels: 350,   counties: 10  },
  OH: { name: 'Ohio',           since: 1999, projects: 21,  permits: 185,  parcels: 390,   counties: 12  },
  PA: { name: 'Pennsylvania',   since: 1999, projects: 23,  permits: 200,  parcels: 420,   counties: 13  },
  IL: { name: 'Illinois',       since: 2000, projects: 18,  permits: 160,  parcels: 330,   counties: 10  },
  IA: { name: 'Iowa',           since: 2001, projects: 16,  permits: 140,  parcels: 290,   counties: 9   },
  IN: { name: 'Indiana',        since: 2001, projects: 14,  permits: 125,  parcels: 260,   counties: 8   },
  OR: { name: 'Oregon',         since: 2003, projects: 12,  permits: 105,  parcels: 220,   counties: 7   },
  CA: { name: 'California',     since: 2004, projects: 15,  permits: 130,  parcels: 270,   counties: 9   },
  NV: { name: 'Nevada',         since: 2005, projects: 11,  permits: 95,   parcels: 200,   counties: 6   },
  ID: { name: 'Idaho',          since: 2005, projects: 10,  permits: 88,   parcels: 185,   counties: 6   },
  AK: { name: 'Alaska',         since: 2008, projects: 6,   permits: 52,   parcels: 110,   counties: 4   },
  HI: { name: 'Hawaii',         since: null, projects: null, permits: null, parcels: null,  counties: null },
  // Non-covered states — keep entry so hover shows "not yet active"
  WA: { name: 'Washington',     since: null, projects: null, permits: null, parcels: null,  counties: null },
  AZ: { name: 'Arizona',        since: null, projects: null, permits: null, parcels: null,  counties: null },
  MN: { name: 'Minnesota',      since: null, projects: null, permits: null, parcels: null,  counties: null },
  WI: { name: 'Wisconsin',      since: null, projects: null, permits: null, parcels: null,  counties: null },
  MI: { name: 'Michigan',       since: null, projects: null, permits: null, parcels: null,  counties: null },
  NY: { name: 'New York',       since: null, projects: null, permits: null, parcels: null,  counties: null },
  VA: { name: 'Virginia',       since: null, projects: null, permits: null, parcels: null,  counties: null },
  NC: { name: 'North Carolina', since: null, projects: null, permits: null, parcels: null,  counties: null },
  SC: { name: 'South Carolina', since: null, projects: null, permits: null, parcels: null,  counties: null },
  GA: { name: 'Georgia',        since: null, projects: null, permits: null, parcels: null,  counties: null },
  FL: { name: 'Florida',        since: null, projects: null, permits: null, parcels: null,  counties: null },
  ME: { name: 'Maine',          since: null, projects: null, permits: null, parcels: null,  counties: null },
  NH: { name: 'New Hampshire',  since: null, projects: null, permits: null, parcels: null,  counties: null },
  VT: { name: 'Vermont',        since: null, projects: null, permits: null, parcels: null,  counties: null },
  MA: { name: 'Massachusetts',  since: null, projects: null, permits: null, parcels: null,  counties: null },
  CT: { name: 'Connecticut',    since: null, projects: null, permits: null, parcels: null,  counties: null },
  RI: { name: 'Rhode Island',   since: null, projects: null, permits: null, parcels: null,  counties: null },
  NJ: { name: 'New Jersey',     since: null, projects: null, permits: null, parcels: null,  counties: null },
  DE: { name: 'Delaware',       since: null, projects: null, permits: null, parcels: null,  counties: null },
  MD: { name: 'Maryland',       since: null, projects: null, permits: null, parcels: null,  counties: null },
  DC: { name: 'D.C.',           since: null, projects: null, permits: null, parcels: null,  counties: null },
};

/* Active states (have real data) */
const ACTIVE_STATES = new Set(
  Object.keys(STATE_DATA).filter(k => STATE_DATA[k].since !== null)
);

/* Totals for idle counter strip */
const TOTALS = Object.values(STATE_DATA).reduce((acc, s) => {
  acc.projects += s.projects || 0;
  acc.permits  += s.permits  || 0;
  acc.parcels  += s.parcels  || 0;
  acc.counties += s.counties || 0;
  return acc;
}, { projects: 0, permits: 0, parcels: 0, counties: 0 });
TOTALS.states = ACTIVE_STATES.size;

/* ----------------------------------------------------------
   COUNTER ANIMATION
---------------------------------------------------------- */
function animateValue(el, from, to, duration = 600) {
  if (!el) return;
  const start = performance.now();
  const isFloat = !Number.isInteger(to);
  function step(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    const val = from + (to - from) * eased;
    el.textContent = isFloat
      ? val.toFixed(1)
      : Math.round(val).toLocaleString();
    if (p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

/* ----------------------------------------------------------
   PANEL ELEMENTS
---------------------------------------------------------- */
let panelState, panelSince, panelProjects, panelPermits,
    panelParcels, panelCounties, infoPanel, panelRule;

// Counter strip elements
let ctrStates, ctrProjects, ctrPermits, ctrParcels, ctrCounties;

// Track current animated values for smooth re-animation
let current = { ...TOTALS };

function updateCounters(data, animate = true) {
  const targets = {
    states:   data.since   ? 1            : (data === TOTALS ? TOTALS.states   : 0),
    projects: data.projects ?? 0,
    permits:  data.permits  ?? 0,
    parcels:  data.parcels  ?? 0,
    counties: data.counties ?? 0,
  };

  // For a single state hover, show its values directly
  // For totals (idle), show grand totals
  const isState = data !== TOTALS;

  if (animate) {
    animateValue(ctrProjects, isState ? 0 : current.projects, isState ? (data.projects ?? 0) : TOTALS.projects);
    animateValue(ctrPermits,  isState ? 0 : current.permits,  isState ? (data.permits  ?? 0) : TOTALS.permits);
    animateValue(ctrParcels,  isState ? 0 : current.parcels,  isState ? (data.parcels  ?? 0) : TOTALS.parcels);
    animateValue(ctrCounties, isState ? 0 : current.counties, isState ? (data.counties ?? 0) : TOTALS.counties);
  }
  current = isState
    ? { projects: data.projects || 0, permits: data.permits || 0, parcels: data.parcels || 0, counties: data.counties || 0 }
    : { ...TOTALS };
}

/* ----------------------------------------------------------
   TOOLTIP / FLOATING CARD
---------------------------------------------------------- */
let tooltip, tooltipName, tooltipSince, tooltipProjects,
    tooltipPermits, tooltipParcels, tooltipCounties;

function buildTooltip() {
  tooltip = document.createElement('div');
  tooltip.className = 'map-float-card';
  tooltip.setAttribute('aria-hidden', 'true');
  tooltip.innerHTML = `
    <div class="mfc-state" id="mfc-state"></div>
    <div class="mfc-rule"></div>
    <div class="mfc-grid">
      <div class="mfc-row"><span class="mfc-label">Active Since</span><span class="mfc-val" id="mfc-since">—</span></div>
      <div class="mfc-row"><span class="mfc-label">Projects</span><span class="mfc-val" id="mfc-projects">—</span></div>
      <div class="mfc-row"><span class="mfc-label">Permits Secured</span><span class="mfc-val" id="mfc-permits">—</span></div>
      <div class="mfc-row"><span class="mfc-label">Parcels Mapped</span><span class="mfc-val" id="mfc-parcels">—</span></div>
      <div class="mfc-row"><span class="mfc-label">Counties Worked</span><span class="mfc-val" id="mfc-counties">—</span></div>
    </div>
    <div class="mfc-inactive" id="mfc-inactive" style="display:none">
      <span>Coverage not yet active in this state</span>
    </div>
  `;
  document.body.appendChild(tooltip);

  tooltipName     = document.getElementById('mfc-state');
  tooltipSince    = document.getElementById('mfc-since');
  tooltipProjects = document.getElementById('mfc-projects');
  tooltipPermits  = document.getElementById('mfc-permits');
  tooltipParcels  = document.getElementById('mfc-parcels');
  tooltipCounties = document.getElementById('mfc-counties');
}

function positionTooltip(e) {
  if (!tooltip) return;
  const pad = 18;
  const tw = tooltip.offsetWidth  || 220;
  const th = tooltip.offsetHeight || 160;
  let x = e.clientX + pad;
  let y = e.clientY - th / 2;
  if (x + tw > window.innerWidth  - 8) x = e.clientX - tw - pad;
  if (y < 8)                            y = 8;
  if (y + th > window.innerHeight - 8)  y = window.innerHeight - th - 8;
  tooltip.style.left = x + 'px';
  tooltip.style.top  = y  + 'px';
}

function fmt(val) {
  return val !== null && val !== undefined
    ? Number(val).toLocaleString()
    : '—';
}

function showTooltip(id, e) {
  if (!tooltip) return;
  const d = STATE_DATA[id];
  if (!d) return;
  const active = ACTIVE_STATES.has(id);

  tooltipName.textContent = d.name.toUpperCase();

  const grid    = tooltip.querySelector('.mfc-grid');
  const inactive = document.getElementById('mfc-inactive');

  if (active) {
    grid.style.display = '';
    inactive.style.display = 'none';
    tooltipSince.textContent    = d.since    ? String(d.since)   : '—';
    tooltipProjects.textContent = fmt(d.projects);
    tooltipPermits.textContent  = fmt(d.permits);
    tooltipParcels.textContent  = fmt(d.parcels);
    tooltipCounties.textContent = fmt(d.counties);
  } else {
    grid.style.display = 'none';
    inactive.style.display = '';
  }

  tooltip.classList.add('visible');
  positionTooltip(e);
}

function hideTooltip() {
  if (tooltip) tooltip.classList.remove('visible');
}

/* ----------------------------------------------------------
   COUNTER STRIP LABEL UPDATES
   When hovering an active state, label changes to that state name.
   On idle, returns to "All States".
---------------------------------------------------------- */
let counterLabel;

/* ----------------------------------------------------------
   MAIN INIT
---------------------------------------------------------- */
function initMap() {
  const mapEl = document.getElementById('aps-map');
  if (!mapEl) return;

  // Gather panel refs
  counterLabel  = document.getElementById('map-counter-label');
  ctrStates     = document.getElementById('ctr-states');
  ctrProjects   = document.getElementById('ctr-projects');
  ctrPermits    = document.getElementById('ctr-permits');
  ctrParcels    = document.getElementById('ctr-parcels');
  ctrCounties   = document.getElementById('ctr-counties');

  // Set initial totals (no animation on load)
  if (ctrStates)   ctrStates.textContent   = TOTALS.states;
  if (ctrProjects) ctrProjects.textContent = TOTALS.projects.toLocaleString();
  if (ctrPermits)  ctrPermits.textContent  = TOTALS.permits.toLocaleString();
  if (ctrParcels)  ctrParcels.textContent  = TOTALS.parcels.toLocaleString();
  if (ctrCounties) ctrCounties.textContent = TOTALS.counties.toLocaleString();

  // Build floating tooltip
  buildTooltip();

  // Wire up all state paths
  const paths = mapEl.querySelectorAll('path[id]');
  paths.forEach(path => {
    const id = path.getAttribute('id');
    if (!STATE_DATA[id]) return; // skip non-state elements

    const isActive = ACTIVE_STATES.has(id);

    // Apply base classes
    path.classList.add('state--all');
    if (isActive) path.classList.add('state--active');

    // Hover in
    path.addEventListener('pointerenter', (e) => {
      // Dim all, highlight hovered
      mapEl.classList.add('has-hover');
      path.classList.add('state--hover');

      // Update counter strip
      if (isActive) {
        const d = STATE_DATA[id];
        if (counterLabel) counterLabel.textContent = d.name;
        updateCounters(d, true);
      } else {
        if (counterLabel) counterLabel.textContent = STATE_DATA[id]?.name || id;
        // zero out counters for inactive state
        animateValue(ctrProjects, current.projects, 0);
        animateValue(ctrPermits,  current.permits,  0);
        animateValue(ctrParcels,  current.parcels,  0);
        animateValue(ctrCounties, current.counties, 0);
        current = { projects: 0, permits: 0, parcels: 0, counties: 0 };
      }

      showTooltip(id, e);
    });

    // Move
    path.addEventListener('pointermove', positionTooltip);

    // Hover out
    path.addEventListener('pointerleave', () => {
      mapEl.classList.remove('has-hover');
      path.classList.remove('state--hover');
      hideTooltip();

      // Restore totals
      if (counterLabel) counterLabel.textContent = 'All Active States';
      updateCounters(TOTALS, true);
    });
  });

  // Scroll-trigger the counter strip animation on first view
  const strip = document.querySelector('.map-counter-strip');
  if (strip) {
    const io = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        animateValue(ctrProjects, 0, TOTALS.projects, 1200);
        animateValue(ctrPermits,  0, TOTALS.permits,  1200);
        animateValue(ctrParcels,  0, TOTALS.parcels,  1200);
        animateValue(ctrCounties, 0, TOTALS.counties, 1200);
        io.disconnect();
      }
    }, { threshold: 0.4 });
    io.observe(strip);
    // Reset to 0 before animation fires
    if (ctrProjects) ctrProjects.textContent = '0';
    if (ctrPermits)  ctrPermits.textContent  = '0';
    if (ctrParcels)  ctrParcels.textContent  = '0';
    if (ctrCounties) ctrCounties.textContent = '0';
  }
}

document.addEventListener('DOMContentLoaded', initMap);
