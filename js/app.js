/* =====================================================
   RODEO REALTY — SCROLL-DRIVEN EXPERIENCE
   GSAP + Lenis + Canvas Frame Playback
   ===================================================== */

// ---- CONSTANTS ----
const FRAME_COUNT = 235;
const FRAME_SPEED = 2.0;
const DARK_OVERLAY_ENTER = 0.25;
const DARK_OVERLAY_LEAVE = 0.38;
const MARQUEE_ENTER = 0.07;
const MARQUEE_LEAVE = 0.95;

// ---- DOM REFS ----
const loader       = document.getElementById('loader');
const loaderFill   = document.getElementById('loader-fill');
const loaderPct    = document.getElementById('loader-percent');
const canvas       = document.getElementById('canvas');
const canvasWrap   = document.getElementById('canvas-wrap');
const hero         = document.querySelector('.hero-standalone');
const scrollCt     = document.getElementById('scroll-container');
const darkOverlay  = document.getElementById('dark-overlay');
const marqueeWrap  = document.getElementById('marquee-1');
const siteHeader   = document.getElementById('site-header');
const navToggle    = document.getElementById('nav-toggle');
const navLinks     = document.getElementById('nav-links');

// ---- STATE ----
const ctx = canvas.getContext('2d');
let frames = new Array(FRAME_COUNT).fill(null);
let currentFrame = 0;
let bgColor = '#080705';
let loaded = 0;
let allLoaded = false;

// Expose globally for screenshot tooling
window._frames = frames;
window._drawFrameAt = (idx) => { if (frames[idx]) drawFrame(idx); };

// ---- TESTIMONIALS ----
const testimonials = [
  {
    text: 'Linda guided us through our first home purchase with extraordinary patience and expertise. She never rushed us, always put our interests first, and found us a home we love in Sherman Oaks. We cannot recommend her highly enough.',
    author: '— James &amp; Sarah M.',
    detail: 'First-Time Buyers · Sherman Oaks'
  },
  {
    text: 'When we needed to sell my mother\'s estate through probate, Linda handled everything with compassion, discretion, and remarkable efficiency. We felt supported every step of the way.',
    author: '— David T.',
    detail: 'Probate Estate Sale · Encino'
  },
  {
    text: 'Linda\'s market knowledge is unmatched. She helped us price our home perfectly and we received multiple offers above asking within the first week. Her selling strategy is simply excellent.',
    author: '— Michael &amp; Jennifer R.',
    detail: 'Luxury Home Sellers · Studio City'
  }
];

let testiIndex = 0;

// ====================================================
// CANVAS SETUP
// ====================================================
function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = window.innerWidth  * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width  = window.innerWidth  + 'px';
  canvas.style.height = window.innerHeight + 'px';
  ctx.scale(dpr, dpr);
}

// ====================================================
// BG COLOR SAMPLER
// ====================================================
let sampleTimer = 0;

function sampleBgColor(img) {
  const offscreen = document.createElement('canvas');
  offscreen.width = offscreen.height = 4;
  const octx = offscreen.getContext('2d');
  octx.drawImage(img, 0, 0, 4, 4);
  const d = octx.getImageData(0, 0, 4, 4).data;
  const r = d[0], g = d[4], b = d[8];
  bgColor = `rgb(${r},${g},${b})`;
}

// ====================================================
// DRAW FRAME
// ====================================================
const IMAGE_SCALE = 1.0;

function drawFrame(index) {
  const img = frames[index];
  if (!img) return;

  const cw = window.innerWidth;
  const ch = window.innerHeight;
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;

  const scale = Math.max(cw / iw, ch / ih) * IMAGE_SCALE;
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (cw - dw) / 2;
  const dy = (ch - dh) / 2;

  ctx.fillStyle = '#080705';
  ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(img, dx, dy, dw, dh);
}

// ====================================================
// FRAME LOADER
// ====================================================
function loadFrames() {
  const FAST_BATCH = 12;

  function loadOne(i) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        frames[i] = img;
        loaded++;
        const pct = Math.round((loaded / FRAME_COUNT) * 100);
        loaderFill.style.width = pct + '%';
        loaderPct.textContent = pct + '%';
        if (loaded === FRAME_COUNT) {
          allLoaded = true;
          hideLoader();
        }
        resolve();
      };
      img.onerror = () => { loaded++; resolve(); };
      img.src = `frames/frame_${String(i + 1).padStart(4, '0')}.webp`;
    });
  }

  // Phase 1: first FAST_BATCH frames, then reveal immediately
  const phase1 = Array.from({ length: FAST_BATCH }, (_, i) => loadOne(i));
  Promise.all(phase1).then(() => {
    if (frames[0]) drawFrame(0);
    hideLoader(); // reveal hero after first batch — rest loads in background
    // Phase 2: rest in background
    for (let i = FAST_BATCH; i < FRAME_COUNT; i++) {
      loadOne(i);
    }
  });
}

// ====================================================
// HIDE LOADER + REVEAL HERO
// ====================================================
function hideLoader() {
  loader.classList.add('hidden');
  setTimeout(() => {
    loader.style.display = 'none';
    revealHero();
  }, 900);
}

function revealHero() {
  const eyebrow = hero.querySelector('.hero-eyebrow');
  const words   = hero.querySelectorAll('.hero-word');
  const tagline = hero.querySelector('.hero-tagline');
  const ctas    = hero.querySelector('.hero-ctas');

  gsap.to(eyebrow, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.1 });
  gsap.to([...words], {
    opacity: 1, y: 0,
    duration: 1.0,
    ease: 'power3.out',
    stagger: 0.12,
    delay: 0.3
  });
  gsap.to(tagline, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.7 });
  gsap.to(ctas,    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.95 });
}

// ====================================================
// DARK OVERLAY
// ====================================================
function updateDarkOverlay(p) {
  const enter = DARK_OVERLAY_ENTER;
  const leave  = DARK_OVERLAY_LEAVE;
  const fade   = 0.04;
  let opacity  = 0;

  if (p >= enter - fade && p < enter) {
    opacity = (p - (enter - fade)) / fade;
  } else if (p >= enter && p <= leave) {
    opacity = 0.9;
  } else if (p > leave && p <= leave + fade) {
    opacity = 0.9 * (1 - (p - leave) / fade);
  }
  darkOverlay.style.opacity = opacity;
}

// ====================================================
// MARQUEE OPACITY
// ====================================================
function updateMarqueeOpacity(p) {
  const fade = 0.04;
  let op = 0;
  if (p < MARQUEE_ENTER) op = 0;
  else if (p < MARQUEE_ENTER + fade) op = (p - MARQUEE_ENTER) / fade;
  else if (p < MARQUEE_LEAVE) op = 1;
  else if (p <= MARQUEE_LEAVE + fade) op = 1 - (p - MARQUEE_LEAVE) / fade;
  else op = 0;
  marqueeWrap.style.opacity = op;
}

// ====================================================
// SECTION SYSTEM
// ====================================================
const sectionRegistry = [];

function setupSections() {
  const sections = scrollCt.querySelectorAll('.scroll-section');

  sections.forEach(section => {
    const enter   = parseFloat(section.dataset.enter)   / 100;
    const leave   = parseFloat(section.dataset.leave)   / 100;
    const type    = section.dataset.animation || 'fade-up';
    const persist = section.dataset.persist === 'true';

    // Position at midpoint
    const mid = (enter + leave) / 2;
    section.style.top       = (mid * 100) + '%';
    section.style.transform = 'translateY(-50%)';
    section.style.position  = 'absolute';
    section.style.left      = '0';
    section.style.width     = '100%';

    // Children to animate
    const children = [
      ...section.querySelectorAll(
        '.section-label, .section-heading, .section-body, .cred-list, .cta-button, ' +
        '.stat, .service-item, .property-card, .properties-header, ' +
        '.testimonial-wrap, .testi-nav, ' +
        '.form-header, .form-wrap, .form-row, .form-group--full, .form-footer, ' +
        '.article-card, ' +
        '.footer-cta-col, .footer-info-grid, ' +
        '.portrait-frame, .portrait-name-plate'
      )
    ];

    // Build GSAP timeline
    const tl = gsap.timeline({ paused: true });

    switch (type) {
      case 'fade-up':
        gsap.set(children, { y: 50, opacity: 0 });
        tl.to(children, { y: 0, opacity: 1, stagger: 0.10, duration: 0.9, ease: 'power3.out' });
        break;

      case 'slide-left':
        gsap.set(children, { x: -80, opacity: 0 });
        tl.to(children, { x: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out' });
        break;

      case 'slide-right':
        gsap.set(children, { x: 80, opacity: 0 });
        tl.to(children, { x: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out' });
        break;

      case 'scale-up':
        gsap.set(children, { scale: 0.88, opacity: 0 });
        tl.to(children, { scale: 1, opacity: 1, stagger: 0.10, duration: 1.0, ease: 'power2.out' });
        break;

      case 'rotate-in':
        gsap.set(children, { y: 40, rotation: 3, opacity: 0 });
        tl.to(children, { y: 0, rotation: 0, opacity: 1, stagger: 0.10, duration: 0.9, ease: 'power3.out' });
        break;

      case 'stagger-up':
        gsap.set(children, { y: 60, opacity: 0 });
        tl.to(children, { y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: 'power3.out' });
        break;

      case 'clip-reveal':
        gsap.set(children, { clipPath: 'inset(100% 0 0 0)', opacity: 0 });
        tl.to(children, { clipPath: 'inset(0% 0 0 0)', opacity: 1, stagger: 0.12, duration: 1.1, ease: 'power4.inOut' });
        break;
    }

    sectionRegistry.push({ section, tl, enter, leave, persist, state: 'hidden' });
  });
}

function updateSections(p) {
  sectionRegistry.forEach((item, i) => {
    const { tl, enter, leave, persist } = item;
    const inWindow = p >= enter && (persist || p <= leave);
    const pastLeave = !persist && p > leave;
    const beforeEnter = p < enter;

    if (inWindow && item.state !== 'shown') {
      item.state = 'shown';
      if (tl.progress() < 0.5) tl.play();
    } else if ((beforeEnter || pastLeave) && item.state === 'shown' && !persist) {
      item.state = 'hidden';
      tl.reverse();
    }
  });
}

// ====================================================
// STAT COUNTERS
// ====================================================
function setupStatCounters() {
  document.querySelectorAll('.stat-number').forEach(el => {
    const target   = parseFloat(el.dataset.value);
    const decimals = parseInt(el.dataset.decimals || '0');

    gsap.from(el, {
      textContent: 0,
      duration: 2,
      ease: 'power1.out',
      snap: { textContent: decimals === 0 ? 1 : 0.1 },
      scrollTrigger: {
        trigger: el.closest('.scroll-section'),
        start: 'top 70%',
        toggleActions: 'play none none reverse'
      },
      onUpdate() {
        const val = parseFloat(this.targets()[0].textContent);
        el.textContent = decimals === 0 ? Math.round(val) : val.toFixed(decimals);
      }
    });
  });
}

// ====================================================
// TESTIMONIALS CAROUSEL
// ====================================================
function setupTestimonials() {
  const textEl   = document.getElementById('testi-text');
  const authEl   = document.getElementById('testi-author');
  const detailEl = document.getElementById('testi-detail');
  const dots     = document.querySelectorAll('.testi-dot');

  function goTo(index) {
    testiIndex = (index + testimonials.length) % testimonials.length;
    const t = testimonials[testiIndex];

    gsap.to([textEl, authEl, detailEl], {
      opacity: 0, y: 10, duration: 0.3, ease: 'power2.in',
      onComplete: () => {
        textEl.innerHTML   = t.text;
        authEl.innerHTML   = t.author;
        detailEl.innerHTML = t.detail;
        gsap.to([textEl, authEl, detailEl], {
          opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06
        });
      }
    });

    dots.forEach((d, i) => d.classList.toggle('active', i === testiIndex));
  }

  document.querySelector('.testi-prev')?.addEventListener('click', () => goTo(testiIndex - 1));
  document.querySelector('.testi-next')?.addEventListener('click', () => goTo(testiIndex + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => goTo(i)));
}

// ====================================================
// MOBILE NAV
// ====================================================
function setupNav() {
  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', open);
    navToggle.style.transform = open ? 'rotate(45deg)' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.style.transform = '';
    });
  });
}

// ====================================================
// FORM HANDLING
// ====================================================
function setupForm() {
  const form = document.querySelector('.consultation-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const span = btn.querySelector('span');
    span.textContent = 'Thank You — We\'ll Be In Touch';
    btn.style.background = 'var(--gold-dim)';
    btn.disabled = true;
  });
}

// ====================================================
// HEADER SCROLL BEHAVIOR
// ====================================================
function setupHeaderScroll() {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }, { passive: true });
}

// ====================================================
// HERO TRANSITION (circle-wipe + hero fade)
// ====================================================
function initHeroTransition() {
  ScrollTrigger.create({
    trigger: hero,
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress;
      // Hero fades out
      hero.style.opacity = Math.max(0, 1 - p * 1.8);
      // Canvas reveals via expanding circle
      const wipeP = Math.min(1, p * 1.5);
      if (wipeP >= 1) {
        canvasWrap.style.clipPath = 'none';
      } else {
        const radius = wipeP * 100;
        canvasWrap.style.clipPath = `circle(${radius}% at 50% 50%)`;
      }
    }
  });
}

// ====================================================
// FRAME + SECTION SCROLL DRIVER
// ====================================================
function initScrollDriver() {
  // Marquee animation
  gsap.to('#marquee-1 .marquee-text', {
    xPercent: -22,
    ease: 'none',
    scrollTrigger: {
      trigger: scrollCt,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true
    }
  });

  // Master onUpdate: frames + overlay + marquee + sections
  ScrollTrigger.create({
    trigger: scrollCt,
    start: 'top top',
    end: 'bottom bottom',
    scrub: true,
    onUpdate: (self) => {
      const p = self.progress;

      // Frame advancement
      const accel = Math.min(p * FRAME_SPEED, 1);
      const idx   = Math.min(Math.floor(accel * FRAME_COUNT), FRAME_COUNT - 1);
      if (idx !== currentFrame) {
        currentFrame = idx;
        requestAnimationFrame(() => {
          if (frames[idx]) drawFrame(idx);
        });
      }

      updateDarkOverlay(p);
      updateMarqueeOpacity(p);
      updateSections(p);
    }
  });
}

// ====================================================
// LENIS SMOOTH SCROLL
// ====================================================
function initLenis() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  window._lenis = lenis;
}

// ====================================================
// SEEK — direct progress drive (for screenshots/testing)
// ====================================================
window._seekTo = function(progress) {
  // Progress 0-1 over scroll container
  const p = Math.max(0, Math.min(1, progress));

  // Frame
  const accel = Math.min(p * FRAME_SPEED, 1);
  const idx   = Math.min(Math.floor(accel * FRAME_COUNT), FRAME_COUNT - 1);
  currentFrame = idx;
  if (frames[idx]) drawFrame(idx);

  // Canvas wipe (show fully when called)
  canvasWrap.style.clipPath = 'none';
  hero.style.opacity = '0';

  updateDarkOverlay(p);
  updateMarqueeOpacity(p);

  // Force all sections in range to show
  sectionRegistry.forEach(item => {
    const { tl, enter, leave, persist } = item;
    const inRange = p >= enter && (persist || p <= leave);
    if (inRange) {
      item.state = 'shown';
      tl.progress(1);
    } else if (p < enter) {
      item.state = 'hidden';
      tl.progress(0);
    } else if (!persist && p > leave) {
      item.state = 'hidden';
      tl.progress(0);
    }
  });
};

// ====================================================
// INIT
// ====================================================
function init() {
  gsap.registerPlugin(ScrollTrigger);

  resizeCanvas();
  window.addEventListener('resize', () => {
    resizeCanvas();
    if (frames[currentFrame]) drawFrame(currentFrame);
    ScrollTrigger.refresh();
  }, { passive: true });

  initLenis();
  setupSections();
  setupStatCounters();
  setupTestimonials();
  setupNav();
  setupForm();
  setupHeaderScroll();
  initHeroTransition();
  initScrollDriver();

  loadFrames();
}

// ====================================================
// SMOOTH ANCHOR SCROLLING
// ====================================================
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    // Find scroll position
    const targetY = target.offsetTop;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  });
});

// ====================================================
// START
// ====================================================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
