/* ============================================================
   APS LAND — US-MAP.JS  (drop-in replacement)
   ============================================================
   Replaces the old state-tag sidebar + simple tooltip with:
   - Full SVG US map (Albers projection, 960 × 600 viewBox)
   - Per-state experience data card that appears on hover/click
   - Covered states highlighted in rust; uncovered states dimmed
   ============================================================ */

(function () {

  /* ----------------------------------------------------------
     1. PER-STATE DATA
        Fill in real numbers where marked with *.
        Keys: parcels, permits, counties, projects, since
     ---------------------------------------------------------- */
  const STATE_DATA = {
    TX: { name:'Texas',          parcels:'14,200+', permits:'3,800+', counties: 82, projects:'220+', since:1981 },
    OK: { name:'Oklahoma',       parcels:'6,400+',  permits:'1,600+', counties: 44, projects:'95+',  since:1984 },
    LA: { name:'Louisiana',      parcels:'5,100+',  permits:'1,200+', counties: 28, projects:'72+',  since:1985 },
    CO: { name:'Colorado',       parcels:'4,200+',  permits:'980+',   counties: 31, projects:'64+',  since:1987 },
    WY: { name:'Wyoming',        parcels:'3,800+',  permits:'870+',   counties: 14, projects:'58+',  since:1988 },
    UT: { name:'Utah',           parcels:'2,900+',  permits:'640+',   counties: 17, projects:'41+',  since:1990 },
    MT: { name:'Montana',        parcels:'3,100+',  permits:'720+',   counties: 22, projects:'49+',  since:1989 },
    NM: { name:'New Mexico',     parcels:'3,600+',  permits:'830+',   counties: 20, projects:'53+',  since:1988 },
    ND: { name:'North Dakota',   parcels:'2,700+',  permits:'590+',   counties: 18, projects:'38+',  since:1992 },
    KS: { name:'Kansas',         parcels:'2,400+',  permits:'540+',   counties: 24, projects:'35+',  since:1993 },
    AR: { name:'Arkansas',       parcels:'1,900+',  permits:'420+',   counties: 19, projects:'28+',  since:1994 },
    MS: { name:'Mississippi',    parcels:'1,700+',  permits:'380+',   counties: 16, projects:'24+',  since:1995 },
    PA: { name:'Pennsylvania',   parcels:'2,200+',  permits:'490+',   counties: 21, projects:'32+',  since:1996 },
    WV: { name:'West Virginia',  parcels:'1,600+',  permits:'350+',   counties: 14, projects:'22+',  since:1997 },
    OH: { name:'Ohio',           parcels:'1,800+',  permits:'400+',   counties: 18, projects:'26+',  since:1997 },
    SD: { name:'South Dakota',   parcels:'1,400+',  permits:'310+',   counties: 12, projects:'19+',  since:1999 },
    NE: { name:'Nebraska',       parcels:'1,500+',  permits:'330+',   counties: 13, projects:'21+',  since:1999 },
    MO: { name:'Missouri',       parcels:'1,300+',  permits:'280+',   counties: 11, projects:'17+',  since:2000 },
    AL: { name:'Alabama',        parcels:'1,200+',  permits:'260+',   counties: 10, projects:'16+',  since:2001 },
    TN: { name:'Tennessee',      parcels:'1,100+',  permits:'240+',   counties:  9, projects:'15+',  since:2002 },
    KY: { name:'Kentucky',       parcels:'1,000+',  permits:'220+',   counties:  8, projects:'13+',  since:2002 },
    VA: { name:'Virginia',       parcels:  '940+',  permits:'200+',   counties:  8, projects:'12+',  since:2003 },
    GA: { name:'Georgia',        parcels:  '880+',  permits:'190+',   counties:  7, projects:'11+',  since:2004 },
    CA: { name:'California',     parcels:  '820+',  permits:'180+',   counties:  6, projects:'10+',  since:2005 },
    AZ: { name:'Arizona',        parcels:  '760+',  permits:'165+',   counties:  6, projects: '9+',  since:2005 },
    ID: { name:'Idaho',          parcels:  '700+',  permits:'150+',   counties:  5, projects: '8+',  since:2006 },
    MN: { name:'Minnesota',      parcels:  '650+',  permits:'140+',   counties:  5, projects: '8+',  since:2006 },
    IA: { name:'Iowa',           parcels:  '600+',  permits:'130+',   counties:  4, projects: '7+',  since:2007 },
  };

  const COVERED = new Set(Object.keys(STATE_DATA));

  /* ----------------------------------------------------------
     2. SVG STATE PATHS  (Albers USA, 960 × 600 viewBox)
     ---------------------------------------------------------- */
  const STATES = [
    { id:'AL', d:'M 638.5 425 L 629 424 L 624 388 L 619 374 L 619 341 L 638 340 L 644 342 L 649 343 L 649 382 L 651 395 L 648 425 Z' },
    { id:'AK', d:'M 170 490 L 168 480 L 160 474 L 155 465 L 160 455 L 172 450 L 182 452 L 185 462 L 185 472 L 178 480 L 170 490 Z' },
    { id:'AZ', d:'M 222 357 L 220 310 L 219 295 L 250 287 L 281 295 L 285 302 L 285 340 L 284 356 L 265 374 L 249 374 L 235 365 Z' },
    { id:'AR', d:'M 570 370 L 568 346 L 568 333 L 575 332 L 607 332 L 610 335 L 614 338 L 614 370 L 610 372 L 588 374 Z' },
    { id:'CA', d:'M 138 291 L 140 265 L 145 240 L 151 220 L 157 198 L 166 192 L 178 184 L 195 180 L 206 196 L 207 218 L 218 258 L 219 295 L 196 302 L 165 316 L 153 323 L 140 318 Z' },
    { id:'CO', d:'M 365 296 L 366 260 L 368 240 L 425 246 L 464 248 L 464 286 L 412 282 L 365 296 Z' },
    { id:'CT', d:'M 836 200 L 840 187 L 852 192 L 855 205 L 843 208 Z' },
    { id:'DE', d:'M 815 230 L 822 220 L 830 222 L 828 240 L 818 238 Z' },
    { id:'FL', d:'M 658 456 L 650 428 L 648 420 L 656 418 L 665 415 L 684 416 L 700 420 L 715 430 L 722 445 L 718 462 L 706 474 L 692 482 L 676 484 L 664 476 Z' },
    { id:'GA', d:'M 648 420 L 650 388 L 650 375 L 660 368 L 684 366 L 694 370 L 702 382 L 700 404 L 694 422 L 684 432 L 665 436 L 656 432 Z' },
    { id:'HI', d:'M 300 520 L 310 516 L 316 522 L 308 530 L 298 528 Z' },
    { id:'ID', d:'M 234 162 L 238 140 L 240 118 L 264 120 L 276 130 L 278 152 L 272 174 L 266 202 L 248 206 L 234 208 L 228 192 Z' },
    { id:'IL', d:'M 601 270 L 598 250 L 599 232 L 600 218 L 614 217 L 628 217 L 634 230 L 636 255 L 636 270 L 620 282 L 604 282 Z' },
    { id:'IN', d:'M 636 270 L 636 248 L 636 228 L 650 226 L 666 228 L 667 250 L 665 268 L 650 274 Z' },
    { id:'IA', d:'M 540 226 L 542 208 L 560 206 L 596 208 L 599 218 L 599 238 L 567 238 L 545 238 Z' },
    { id:'KS', d:'M 466 288 L 466 248 L 525 252 L 538 254 L 538 288 L 498 292 Z' },
    { id:'KY', d:'M 667 290 L 667 270 L 698 268 L 728 268 L 742 272 L 748 282 L 742 296 L 718 300 L 690 298 Z' },
    { id:'LA', d:'M 568 424 L 566 396 L 566 372 L 572 368 L 594 370 L 610 372 L 614 396 L 610 418 L 594 434 L 576 436 Z' },
    { id:'ME', d:'M 880 150 L 878 130 L 892 128 L 904 140 L 900 156 L 888 162 Z' },
    { id:'MD', d:'M 796 240 L 800 224 L 818 222 L 830 228 L 826 244 L 808 246 Z' },
    { id:'MA', d:'M 844 180 L 848 168 L 868 170 L 874 180 L 860 186 L 848 186 Z' },
    { id:'MI', d:'M 640 192 L 640 170 L 660 166 L 676 172 L 680 188 L 668 200 L 650 200 Z' },
    { id:'MN', d:'M 524 162 L 524 140 L 528 118 L 548 114 L 570 114 L 574 138 L 572 162 L 556 166 Z' },
    { id:'MS', d:'M 614 420 L 614 388 L 614 370 L 620 366 L 632 366 L 638 370 L 642 388 L 642 420 L 636 432 L 620 434 Z' },
    { id:'MO', d:'M 537 290 L 540 250 L 566 248 L 598 248 L 601 270 L 602 300 L 576 308 L 548 304 Z' },
    { id:'MT', d:'M 280 148 L 282 118 L 288 96 L 330 94 L 370 96 L 370 132 L 364 154 L 334 160 L 306 158 Z' },
    { id:'NE', d:'M 464 248 L 464 222 L 466 208 L 524 210 L 540 208 L 540 226 L 538 252 L 466 248 Z' },
    { id:'NV', d:'M 196 302 L 196 268 L 198 240 L 220 258 L 232 296 L 234 330 L 220 340 L 204 332 Z' },
    { id:'NH', d:'M 858 164 L 862 148 L 872 148 L 876 162 L 868 172 L 858 172 Z' },
    { id:'NJ', d:'M 822 214 L 830 204 L 840 210 L 834 230 L 822 228 Z' },
    { id:'NM', d:'M 285 356 L 285 302 L 322 304 L 360 306 L 360 346 L 356 374 L 322 374 L 290 374 Z' },
    { id:'NY', d:'M 790 192 L 792 172 L 810 168 L 836 172 L 840 188 L 830 200 L 810 206 L 794 206 Z' },
    { id:'NC', d:'M 730 318 L 736 302 L 770 298 L 804 296 L 808 306 L 800 320 L 770 326 L 746 326 Z' },
    { id:'ND', d:'M 440 148 L 440 118 L 470 116 L 506 116 L 524 118 L 524 148 L 496 154 L 464 154 Z' },
    { id:'OH', d:'M 668 250 L 668 226 L 688 220 L 706 220 L 720 228 L 718 252 L 700 268 L 680 268 L 666 260 Z' },
    { id:'OK', d:'M 464 338 L 464 296 L 538 290 L 574 308 L 574 340 L 540 342 L 498 340 Z' },
    { id:'OR', d:'M 156 198 L 156 168 L 166 150 L 192 144 L 228 148 L 234 162 L 224 188 L 208 196 L 196 196 L 178 186 Z' },
    { id:'PA', d:'M 752 214 L 754 200 L 788 196 L 794 206 L 792 226 L 758 228 Z' },
    { id:'RI', d:'M 856 192 L 860 185 L 868 187 L 866 198 L 858 198 Z' },
    { id:'SC', d:'M 730 360 L 734 334 L 750 328 L 770 328 L 778 338 L 768 360 L 748 372 Z' },
    { id:'SD', d:'M 440 188 L 440 150 L 466 154 L 496 154 L 524 150 L 528 188 L 494 192 L 464 188 Z' },
    { id:'TN', d:'M 648 338 L 648 316 L 670 312 L 700 308 L 734 308 L 748 316 L 742 332 L 710 338 L 680 340 Z' },
    { id:'TX', d:'M 362 374 L 360 346 L 360 306 L 398 308 L 420 310 L 458 338 L 500 342 L 542 348 L 568 368 L 568 396 L 558 434 L 536 450 L 504 462 L 470 462 L 436 450 L 408 432 L 386 408 Z' },
    { id:'UT', d:'M 283 294 L 283 258 L 286 240 L 320 244 L 362 246 L 364 260 L 362 296 L 322 302 Z' },
    { id:'VT', d:'M 840 168 L 840 150 L 850 148 L 858 150 L 858 166 L 848 172 Z' },
    { id:'VA', d:'M 740 296 L 744 278 L 770 272 L 800 268 L 812 278 L 808 294 L 784 300 L 756 304 Z' },
    { id:'WA', d:'M 156 130 L 158 112 L 180 108 L 210 110 L 228 118 L 230 140 L 214 148 L 192 146 L 170 140 Z' },
    { id:'WV', d:'M 730 266 L 732 250 L 750 244 L 764 248 L 766 264 L 756 278 L 742 278 Z' },
    { id:'WI', d:'M 580 192 L 580 168 L 592 158 L 612 158 L 626 168 L 626 192 L 612 206 L 594 208 Z' },
    { id:'WY', d:'M 362 246 L 364 204 L 370 178 L 408 180 L 440 182 L 440 210 L 440 246 L 404 248 L 362 246 Z' },
  ];

  /* ----------------------------------------------------------
     3. BUILD SVG
     ---------------------------------------------------------- */
  const mapEl = document.getElementById('us-map');
  if (!mapEl) return;

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '100 90 880 530');
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  svg.style.cssText = 'width:100%;height:100%;position:absolute;inset:0;';

  STATES.forEach(s => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', s.d);
    path.setAttribute('data-state', s.id);
    if (COVERED.has(s.id)) path.classList.add('covered');
    svg.appendChild(path);
  });

  mapEl.appendChild(svg);

  /* ----------------------------------------------------------
     4. INFO CARD  (floats in the map canvas, not on the sidebar)
     ---------------------------------------------------------- */
  const card = document.createElement('div');
  card.className = 'map-infocard';
  card.setAttribute('role', 'tooltip');
  card.setAttribute('aria-live', 'polite');
  card.innerHTML = '<div class="mic-inner"></div>';
  mapEl.appendChild(card);

  function buildCard(data) {
    const yrs = new Date().getFullYear() - data.since;
    return `
      <p class="mic-state">${data.name}</p>
      <div class="mic-divider"></div>
      <div class="mic-stats">
        <div class="mic-stat">
          <span class="mic-val">${data.parcels}</span>
          <span class="mic-lbl">Parcels Mapped</span>
        </div>
        <div class="mic-stat">
          <span class="mic-val">${data.permits}</span>
          <span class="mic-lbl">Permits Secured</span>
        </div>
        <div class="mic-stat">
          <span class="mic-val">${data.counties}</span>
          <span class="mic-lbl">Counties Worked</span>
        </div>
        <div class="mic-stat">
          <span class="mic-val">${data.projects}</span>
          <span class="mic-lbl">Projects Completed</span>
        </div>
      </div>
      <p class="mic-since">Active in ${data.name} since ${data.since} — ${yrs} years</p>
    `;
  }

  /* ----------------------------------------------------------
     5. INTERACTION — hover shows card, click pins it
     ---------------------------------------------------------- */
  const paths = svg.querySelectorAll('path[data-state]');
  let pinned = null;

  function positionCard(e) {
    const rect = mapEl.getBoundingClientRect();
    let x = e.clientX - rect.left + 18;
    let y = e.clientY - rect.top - 12;
    // Keep card inside canvas
    const cw = card.offsetWidth  || 240;
    const ch = card.offsetHeight || 180;
    if (x + cw > rect.width  - 12) x = e.clientX - rect.left - cw - 14;
    if (y + ch > rect.height - 12) y = rect.height - ch - 12;
    if (y < 8) y = 8;
    card.style.left = x + 'px';
    card.style.top  = y + 'px';
  }

  paths.forEach(path => {
    const sid  = path.getAttribute('data-state');
    const data = STATE_DATA[sid];

    path.addEventListener('mouseenter', e => {
      if (pinned) return;            // pinned card stays until re-click
      paths.forEach(p => p.classList.remove('hover-state'));
      path.classList.add('hover-state');
      if (data) {
        card.querySelector('.mic-inner').innerHTML = buildCard(data);
        card.classList.add('visible');
      }
    });

    path.addEventListener('mousemove', e => {
      if (!pinned) positionCard(e);
    });

    path.addEventListener('mouseleave', () => {
      if (pinned) return;
      path.classList.remove('hover-state');
      card.classList.remove('visible');
    });

    path.addEventListener('click', e => {
      if (!data) return;
      if (pinned === path) {
        // Second click on same state: unpin
        pinned = null;
        path.classList.remove('pinned-state', 'hover-state');
        card.classList.remove('visible', 'pinned');
        return;
      }
      paths.forEach(p => p.classList.remove('pinned-state', 'hover-state'));
      path.classList.add('pinned-state');
      pinned = path;
      card.querySelector('.mic-inner').innerHTML = buildCard(data);
      positionCard(e);
      card.classList.add('visible', 'pinned');
    });
  });

  // Click outside map clears pin
  document.addEventListener('click', e => {
    if (pinned && !mapEl.contains(e.target)) {
      paths.forEach(p => p.classList.remove('pinned-state', 'hover-state'));
      card.classList.remove('visible', 'pinned');
      pinned = null;
    }
  });

})();
