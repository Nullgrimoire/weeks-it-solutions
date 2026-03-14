/* ================================================================
   Weeks IT Solutions — main.js
   All interactive functionality. Guards ensure functions only
   run when the relevant elements exist on the current page.
================================================================ */

/* ─────────────────────────────────────────────────────────────────
   1. ACTIVE NAV LINK — highlights the current page in the navbar
────────────────────────────────────────────────────────────────── */
(function setActiveNav() {
  const filename = window.location.pathname.split('/').pop() || 'index.html';
  const page     = filename.replace('.html', '') || 'index';

  document.querySelectorAll('.nav-link[data-page]').forEach(link => {
    if (link.dataset.page === page) {
      link.classList.add('active');
    }
  });
})();


/* ─────────────────────────────────────────────────────────────────
   2. PARTICLE CANVAS — animated dots + connecting lines (hero only)
────────────────────────────────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return; // not on this page

  const ctx = canvas.getContext('2d');
  let pts   = [];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Dot {
    constructor() { this.reset(true); }
    reset(init) {
      this.x  = Math.random() * canvas.width;
      this.y  = init ? Math.random() * canvas.height : (Math.random() > 0.5 ? -5 : canvas.height + 5);
      this.r  = Math.random() * 1.4 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.35;
      this.vy = (Math.random() - 0.5) * 0.35;
      this.a  = Math.random() * 0.35 + 0.08;
      this.c  = Math.random() > 0.5 ? '168,85,247' : '59,130,246';
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < -10 || this.x > canvas.width + 10 ||
          this.y < -10 || this.y > canvas.height + 10) this.reset(false);
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.c},${this.a})`;
      ctx.fill();
    }
  }

  function build() {
    pts = [];
    const n = Math.min(Math.floor((canvas.width * canvas.height) / 10000), 130);
    for (let i = 0; i < n; i++) pts.push(new Dot());
  }

  function connect() {
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(168,85,247,${0.07 * (1 - d / 110)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(tick);
  }

  resize(); build(); tick();
  window.addEventListener('resize', () => { resize(); build(); });
})();


/* ─────────────────────────────────────────────────────────────────
   3. STICKY NAVBAR — add .scrolled glass effect after 50px
────────────────────────────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}


/* ─────────────────────────────────────────────────────────────────
   4. HAMBURGER / MOBILE MENU
────────────────────────────────────────────────────────────────── */
(function initMenu() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobile-menu');
  const hb1  = document.getElementById('hb-1');
  const hb2  = document.getElementById('hb-2');
  const hb3  = document.getElementById('hb-3');
  if (!btn || !menu) return;

  let open = false;

  function toggleMenu(force) {
    open = (force !== undefined) ? force : !open;
    btn.setAttribute('aria-expanded', open);

    if (open) {
      menu.classList.add('open');
      hb1.style.cssText = 'transform:translateY(8px) rotate(45deg)';
      hb2.style.cssText = 'opacity:0;transform:scaleX(0)';
      hb3.style.cssText = 'transform:translateY(-8px) rotate(-45deg);width:24px';
    } else {
      menu.classList.remove('open');
      hb1.style.cssText = hb2.style.cssText = hb3.style.cssText = '';
    }
  }

  btn.addEventListener('click', () => toggleMenu());

  // Close on any mobile link click
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(false)));

  // Close on outside click
  document.addEventListener('click', e => {
    if (open && !navbar.contains(e.target)) toggleMenu(false);
  });
})();


/* ─────────────────────────────────────────────────────────────────
   5. SCROLL REVEAL — IntersectionObserver for .reveal / .reveal-l / .reveal-r
────────────────────────────────────────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal, .reveal-l, .reveal-r');
if (revealEls.length > 0) {
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObs.observe(el));
}


/* ─────────────────────────────────────────────────────────────────
   6. COUNTER ANIMATION — runs when [data-target] elements enter view
────────────────────────────────────────────────────────────────── */
const counterEls = document.querySelectorAll('[data-target]');
if (counterEls.length > 0) {
  function animateCount(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix ?? '';
    let   val    = 0;
    const inc    = target / 55;
    const timer  = setInterval(() => {
      val += inc;
      if (val >= target) { val = target; clearInterval(timer); }
      el.textContent = Math.floor(val) + suffix;
    }, 22);
  }

  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counterEls.forEach(el => countObs.observe(el));
}


/* ─────────────────────────────────────────────────────────────────
   7. CONTACT FORM VALIDATION & SUBMISSION  (contact.html only)
────────────────────────────────────────────────────────────────── */
(function initForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form || !success) return;

  // Validation helpers
  const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
  const isUrl   = v => {
    if (!v) return true; // field is optional
    try { const u = new URL(v); return u.protocol === 'http:' || u.protocol === 'https:'; }
    catch { return false; }
  };

  function setErr(fieldId, errId, show) {
    document.getElementById(fieldId).classList.toggle('error', show);
    document.getElementById(errId).classList.toggle('show', show);
  }

  // Clear individual errors on input
  ['name', 'email', 'website', 'message'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => setErr(id, `${id}-error`, false));
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const website = document.getElementById('website').value.trim();
    const message = document.getElementById('message').value.trim();

    let ok = true;

    if (!name)                { setErr('name',    'name-error',    true); ok = false; }
    if (!isEmail(email))      { setErr('email',   'email-error',   true); ok = false; }
    if (!isUrl(website))      { setErr('website', 'website-error', true); ok = false; }
    if (message.length < 10)  { setErr('message', 'message-error', true); ok = false; }

    if (ok) {
      // Replace this block with a fetch() to your backend / form service in production
      form.style.display = 'none';
      success.classList.add('show');
      form.reset();
    }
  });
})();


/* ─────────────────────────────────────────────────────────────────
   8. SMOOTH SCROLL — for same-page anchor links only
────────────────────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
