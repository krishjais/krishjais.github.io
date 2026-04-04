/* ═══════════════════════════════════════════
   KRISH JAISWAL PORTFOLIO — main.js
   All animations, interactions & motion
═══════════════════════════════════════════ */

/* ── CURSOR ── */
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.transform = `translate(${mouseX - 5}px, ${mouseY - 5}px)`;
});

// Smooth ring follow
function animateRing() {
  ringX += (mouseX - ringX - 17) * 0.12;
  ringY += (mouseY - ringY - 17) * 0.12;
  cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
  requestAnimationFrame(animateRing);
}
animateRing();

// Cursor scale on hover
document.querySelectorAll('a, button, .filter-btn, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform += ' scale(2.5)';
    cursorRing.style.width = '60px';
    cursorRing.style.height = '60px';
    cursorRing.style.borderColor = 'rgba(200,255,0,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.style.width = '34px';
    cursorRing.style.height = '34px';
    cursorRing.style.borderColor = 'rgba(200,255,0,0.5)';
  });
});

/* ── PRELOADER ── */
const preloader = document.getElementById('preloader');
const counterEl = document.getElementById('counter');
let count = 0;

const counterAnim = setInterval(() => {
  count += Math.floor(Math.random() * 12) + 4;
  if (count >= 100) {
    count = 100;
    clearInterval(counterAnim);
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
      triggerHeroAnimations();
    }, 300);
  }
  counterEl.textContent = count;
}, 60);

document.body.style.overflow = 'hidden';

function triggerHeroAnimations() {
  // Stats counter
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseInt(el.dataset.target);
    let current = 0;
    const step = target / 40;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = Math.floor(current);
      if (current >= target) clearInterval(timer);
    }, 40);
  });
}

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

/* ── HAMBURGER / MOBILE MENU ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ── SCROLL REVEAL (IntersectionObserver) ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
        // Animate skill bars
        entry.target.querySelectorAll('.skill-bar').forEach(bar => {
          const w = bar.dataset.width;
          bar.querySelector('.sb-fill').style.width = w + '%';
        });
      }, entry.target.dataset.delay || 0);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

// Reveal project cards with stagger
document.querySelectorAll('.project-card').forEach((card, i) => {
  card.dataset.delay = i * 80;
  revealObserver.observe(card);
});

// Reveal skill cards
document.querySelectorAll('.skill-card').forEach((card, i) => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(24px)';
  card.style.transition = `opacity .6s ease ${i * 0.1}s, transform .6s ease ${i * 0.1}s`;
  revealObserver.observe(card);

  // Fix: add visible manually for skill cards
  const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        e.target.querySelectorAll('.sb-fill').forEach(fill => {
          const w = fill.closest('.skill-bar').dataset.width;
          fill.style.width = w + '%';
        });
        skillObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  skillObs.observe(card);
});

// Section titles reveal
document.querySelectorAll('.section-title, .contact-big').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity .8s ease, transform .8s ease';
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  obs.observe(el);
});

// About paras
document.querySelectorAll('.about-para').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = `opacity .6s ease ${i * 0.15}s, transform .6s ease ${i * 0.15}s`;
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.opacity = '1';
        e.target.style.transform = 'translateY(0)';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  obs.observe(el);
});

/* ── PROJECT FILTER ── */
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;
    cards.forEach(card => {
      const show = filter === 'all' || card.dataset.cat === filter;
      if (show) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
          card.style.transition = 'opacity .4s ease, transform .4s ease, border-color .3s, box-shadow .3s';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 50);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

/* ── PARALLAX HERO ORBS ── */
document.addEventListener('mousemove', e => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;

  const orbs = document.querySelectorAll('.hero-orb');
  orbs.forEach((orb, i) => {
    const depth = (i + 1) * 8;
    orb.style.transform = `translate(${x * depth}px, ${y * depth}px)`;
  });
});

/* ── MASCOT TILT ── */
const mascotImg = document.querySelector('.mascot-img');
if (mascotImg) {
  const heroRight = document.querySelector('.hero-right');
  if (heroRight) {
    heroRight.addEventListener('mousemove', e => {
      const rect = heroRight.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rotX = ((e.clientY - cy) / rect.height) * -12;
      const rotY = ((e.clientX - cx) / rect.width) * 12;
      mascotImg.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      mascotImg.style.transition = 'transform 0.1s ease';
    });
    heroRight.addEventListener('mouseleave', () => {
      mascotImg.style.transform = '';
      mascotImg.style.transition = 'transform 0.5s ease';
    });
  }
}

/* ── CONTACT FORM ── */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = contactForm.querySelector('.form-submit');
    btn.textContent = 'Sending...';
    setTimeout(() => {
      btn.innerHTML = '<span>Send Message</span><span class="btn-arr">→</span>';
      formSuccess.classList.add('show');
      contactForm.reset();
      setTimeout(() => formSuccess.classList.remove('show'), 4000);
    }, 1200);
  });
}

/* ── TOOL PILLS HOVER GLOW ── */
document.querySelectorAll('.tool-pill').forEach(pill => {
  const colors = ['var(--acid)', 'var(--pink)', 'var(--blue)', 'var(--orange)', 'var(--purple)'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  pill.addEventListener('mouseenter', () => {
    pill.style.boxShadow = `0 0 16px ${color}40`;
  });
  pill.addEventListener('mouseleave', () => {
    pill.style.boxShadow = '';
  });
});

/* ── MARQUEE PAUSE ON HOVER ── */
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  marqueeTrack.addEventListener('mouseenter', () => marqueeTrack.style.animationPlayState = 'paused');
  marqueeTrack.addEventListener('mouseleave', () => marqueeTrack.style.animationPlayState = 'running');
}

/* ── ACTIVE NAV HIGHLIGHT ── */
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (active) active.style.color = 'var(--acid)';
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));

/* ── EASTER EGG: KONAMI CODE ── */
const konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIndex = 0;
document.addEventListener('keydown', e => {
  if (e.key === konami[konamiIndex]) {
    konamiIndex++;
    if (konamiIndex === konami.length) {
      document.body.style.animation = 'rainbowBg 2s ease forwards';
      const style = document.createElement('style');
      style.textContent = `@keyframes rainbowBg{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}`;
      document.head.appendChild(style);
      konamiIndex = 0;
    }
  } else {
    konamiIndex = 0;
  }
});

console.log('%c⚡ KRISH JAISWAL PORTFOLIO', 'color:#c8ff00;font-family:monospace;font-size:18px;font-weight:bold;');
console.log('%cDesigned & Built by Krish Jaiswal', 'color:#ff2d6f;font-family:monospace;font-size:12px;');
console.log('%c🎨 Graphic Designer · CS(AI) Student · Lucknow', 'color:#9b5de5;font-family:monospace;font-size:11px;');
