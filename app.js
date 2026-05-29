/* ===== APP.JS — Altitude Culture Immersive ===== */
const App = (() => {
  const state = {
    bookmarks: JSON.parse(localStorage.getItem('ac_bookmarks') || '[]'),
    currentSection: 0,
    totalSections: 0
  };

  const DOM = {};

  function initMist() {
    document.querySelectorAll('.hero, .moment-detail[data-moment="afriski"]').forEach(s => {
      const m = document.createElement('div');
      m.className = 'mist-layer';
      s.appendChild(m);
    });
  }

  function initTilt() {
    if (window.innerWidth < 768) return;
    document.querySelectorAll('.moment-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX-r.left)/r.width-0.5)*8;
        const y = (-(e.clientY-r.top)/r.height+0.5)*8;
        card.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${y}deg) translateZ(20px)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  function initJourneyScroll() {
    const section = document.querySelector('.journey.cinematic');
    if (!section) return;
    const cards = section.querySelectorAll('.journey-card');
    const nodes = section.querySelectorAll('.journey-node');
    const fill = document.getElementById('journeyProgressFill');
    if (!cards.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const card = entry.target;
        const idx = parseInt(card.dataset.stage);
        if (entry.isIntersecting) {
          card.classList.add('active');
          nodes.forEach((n, i) => n.classList.toggle('active', i === idx));
          if (fill) fill.style.height = ((idx / (cards.length - 1)) * 100) + '%';
        } else {
          card.classList.remove('active');
        }
      });
    }, { threshold: 0.6, rootMargin: '-20% 0px -20% 0px' });

    cards.forEach(c => observer.observe(c));

    // Mobile swipe active state
    if (window.innerWidth < 768) {
      const track = document.getElementById('journeyCards');
      if (!track) return;
      track.addEventListener('scroll', () => {
        const center = track.scrollLeft + track.clientWidth / 2;
        cards.forEach((card, i) => {
          const left = card.offsetLeft;
          const right = left + card.offsetWidth;
          const isActive = center >= left && center <= right;
          card.classList.toggle('active', isActive);
          if (isActive && fill) fill.style.height = ((i / (cards.length - 1)) * 100) + '%';
        });
      });
    }
  }

  function initActionPlanScroll() {
    const track = document.getElementById('actionTrack');
    if (!track) return;
    let isDown = false, startX, scrollLeft;
    track.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft; });
    track.addEventListener('mouseleave', () => isDown = false);
    track.addEventListener('mouseup', () => isDown = false);
    track.addEventListener('mousemove', e => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - track.offsetLeft;
      track.scrollLeft = scrollLeft - (x - startX) * 2;
    });
    track.addEventListener('wheel', e => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        track.scrollLeft += e.deltaY;
      }
    });
  }

  function init() {
    cacheDOM();
    state.totalSections = document.querySelectorAll('.section').length;
    buildDots();
    initLoader();
    initScroll();
    initReveal();
    initParallax();
    initProgress();
    initDots();
    initMenu();
    initBookmarks();
    initAnchors();
    initFloatingStats();
    initServiceWorker();
    initMist();
    initTilt();
    initJourneyScroll();
    initActionPlanScroll();
    renderDots();
  }

  function cacheDOM() {
    DOM.loader = document.getElementById('loader');
    DOM.sections = document.querySelectorAll('.section');
    DOM.dots = document.getElementById('sectionNav');
    DOM.progressFill = document.getElementById('progressFill');
    DOM.floatingStats = document.getElementById('floatingStats');
    DOM.menuToggle = document.getElementById('menuToggle');
  }

  function initLoader() {
    window.addEventListener('load', () => {
      setTimeout(() => DOM.loader?.classList.add('loaded'), 400);
    });
    if (document.readyState === 'complete') {
      setTimeout(() => DOM.loader?.classList.add('loaded'), 400);
    }
  }

  function buildDots() {
    DOM.sections.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot';
      dot.dataset.index = i;
      dot.setAttribute('aria-label', `Go to section ${i + 1}`);
      dot.addEventListener('click', () => scrollToSection(i));
      DOM.dots.appendChild(dot);
    });
  }

  function scrollToSection(index) {
    const target = DOM.sections[index];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function renderDots() {
    const dots = DOM.dots.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === state.currentSection);
    });
  }

  function initScroll() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.dataset.index);
          if (!isNaN(idx)) {
            state.currentSection = idx;
            renderDots();
            updateFloatingStats(idx);
          }
        }
      });
    }, { threshold: 0.5 });

    DOM.sections.forEach(s => observer.observe(s));
  }

  function initReveal() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-slide, .journey-step, .idea-card').forEach(el => observer.observe(el));
  }

  function initParallax() {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const vh = window.innerHeight;

          DOM.sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const viewCenter = vh / 2;
            const offset = (center - viewCenter) / vh;

            const bg = section.querySelector('.layer-bg');
            if (bg) {
              const speed = 0.15;
              bg.style.transform = `scale(1.1) translateY(${offset * speed * 100}px)`;
            }
          });
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function initProgress() {
    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      DOM.progressFill.style.width = progress + '%';
    }, { passive: true });
  }

  function initDots() {
    document.addEventListener('wheel', (e) => {
      if (e.deltaY === 0) return;
      const dir = e.deltaY > 0 ? 1 : -1;
      const next = Math.max(0, Math.min(state.totalSections - 1, state.currentSection + dir));
      if (next !== state.currentSection) {
        // We let native scroll-snap handle it; dots update via IntersectionObserver
      }
    }, { passive: true });
  }

  function initMenu() {
    DOM.menuToggle?.addEventListener('click', () => {
      const nav = document.getElementById('mobileNav');
      if (nav) {
        nav.classList.toggle('open');
        DOM.menuToggle.querySelector('.material-symbols-outlined').textContent =
          nav.classList.contains('open') ? 'close' : 'menu';
      }
    });
  }

  function initBookmarks() {
    document.querySelectorAll('.bookmark-btn').forEach(b => {
      if (state.bookmarks.includes(b.dataset.id)) b.classList.add('bookmarked');
    });
  }

  function initAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function initFloatingStats() {
    setTimeout(() => DOM.floatingStats?.classList.add('visible'), 2000);
  }

  function updateFloatingStats(idx) {
    const statNums = DOM.floatingStats?.querySelectorAll('.stat-num');
    if (statNums && idx >= 2) {
      statNums.forEach(el => {
        const target = parseFloat(el.dataset.target);
        if (!el.dataset.counted) {
          el.dataset.counted = 'true';
          animateCounter(el, target);
        }
      });
    }
  }

  function animateCounter(el, target) {
    const duration = 2000;
    const start = performance.now();
    const isFloat = target % 1 !== 0;
    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;
      el.textContent = isFloat ? current.toFixed(2) : Math.round(current);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = isFloat ? target.toFixed(2) : target;
    }
    requestAnimationFrame(tick);
  }

  function initServiceWorker() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }

  window.toggleBookmark = function(id, btn) {
    const i = state.bookmarks.indexOf(id);
    if (i > -1) {
      state.bookmarks.splice(i, 1);
      btn.classList.remove('bookmarked');
    } else {
      state.bookmarks.push(id);
      btn.classList.add('bookmarked');
    }
    localStorage.setItem('ac_bookmarks', JSON.stringify(state.bookmarks));
  };

  window.shareMoment = function(title, location, btn) {
    const text = `${title} — ${location} // Altitude Culture — The Roof of Africa`;
    if (navigator.share) {
      navigator.share({ title, text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text).then(() => {
        if (btn) {
          const original = btn.innerHTML;
          btn.innerHTML = '<span class="material-symbols-outlined">check</span>';
          setTimeout(() => btn.innerHTML = original, 1500);
        }
      }).catch(() => {});
    }
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  return {
    toggleBookmark: window.toggleBookmark,
    shareMoment: window.shareMoment,
    scrollToSection,
    state
  };
})();
