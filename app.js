/* ===== APP.JS — Altitude Culture Immersive ===== */
const App = (() => {
  const state = {
    bookmarks: JSON.parse(localStorage.getItem('ac_bookmarks') || '[]'),
    currentSection: 0,
    totalSections: 0
  };

  const DOM = {};

  function initCursor() {
    if (window.innerWidth < 768) return;
    document.body.classList.add('cursor-hidden');
    const el = document.createElement('div');
    el.id = 'cursorFlake';
    el.innerHTML = '<svg viewBox="0 0 24 24" width="34" height="34"><defs><filter id="cglow"><feGaussianBlur stdDeviation="2" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07M12 2l-3 3 3 3 3-3-3-3zM12 22l-3-3 3-3 3 3-3 3zM2 12l3 3 3-3-3-3-3 3zM22 12l-3 3-3-3 3-3 3 3z" fill="none" stroke="#fff" stroke-width="1" filter="url(#cglow)" opacity="0.95"/><circle cx="12" cy="12" r="2.5" fill="#adc7ff" opacity="0.6"/></svg>';
    document.body.appendChild(el);
    let mx=-100, my=-100, cx=-100, cy=-100;
    document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; el.classList.add('visible'); });
    document.addEventListener('mouseleave', () => el.classList.remove('visible'));
    function tick() { cx+=(mx-cx)*0.12; cy+=(my-cy)*0.12; el.style.transform=`translate(${cx}px,${cy}px) translate(-50%,-50%)`; requestAnimationFrame(tick); }
    tick();
    initCursorTrail();
  }

  function initCursorTrail() {
    const trails = [];
    const maxTrails = 8;
    for (let i = 0; i < maxTrails; i++) {
      const t = document.createElement('div');
      t.className = 'cursor-trail';
      document.body.appendChild(t);
      trails.push({el:t, x:-100, y:-100, life:0});
    }
    let mx=-100, my=-100;
    document.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });
    function tick() {
      for (let i = trails.length - 1; i > 0; i--) {
        trails[i].x = trails[i-1].x; trails[i].y = trails[i-1].y;
        trails[i].el.style.transform = `translate(${trails[i].x}px,${trails[i].y}px) translate(-50%,-50%)`;
        trails[i].el.classList.add('active');
      }
      trails[0].x = mx; trails[0].y = my;
      trails[0].el.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
      trails[0].el.classList.add('active');
      requestAnimationFrame(tick);
    }
    tick();
  }

  function initSnowfall() {
    if (/Android|iPhone|iPad|iPod/i.test(navigator.userAgent) && window.innerWidth<768) return;
    const c = document.createElement('canvas');
    c.id = 'snowCanvas';
    document.body.prepend(c);
    const resize = () => { c.width=window.innerWidth; c.height=window.innerHeight; };
    resize(); window.addEventListener('resize', resize);
    const ctx = c.getContext('2d');
    const count = Math.min(100, Math.floor(window.innerWidth*0.1));
    const flakes = Array.from({length:count}, () => ({
      x:Math.random()*c.width, y:Math.random()*c.height,
      r:Math.random()*3+0.5, s:Math.random()*1.2+0.3,
      w:Math.random()*0.6-0.3, o:Math.random()*0.5+0.25
    }));
    function draw() {
      ctx.clearRect(0,0,c.width,c.height);
      flakes.forEach(f => {
        f.y+=f.s; f.x+=f.w+Math.sin(f.y*0.01)*0.2;
        if (f.y>c.height) { f.y=-5; f.x=Math.random()*c.width; }
        if (f.x<0||f.x>c.width) f.x=Math.random()*c.width;
        ctx.beginPath(); ctx.arc(f.x,f.y,f.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(210,225,255,${f.o})`; ctx.fill();
        if (f.r > 2) {
          ctx.beginPath(); ctx.arc(f.x,f.y,f.r*1.5,0,Math.PI*2);
          ctx.fillStyle=`rgba(210,225,255,${f.o*0.15})`; ctx.fill();
        }
      });
      requestAnimationFrame(draw);
    }
    draw();
  }

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

  function initHero3D() {
    const scene = document.getElementById('hero3D');
    if (!scene) return;
    const crystals = document.getElementById('snowCrystals');
    if (crystals) {
      for (let i = 0; i < 12; i++) {
        const c = document.createElement('div');
        c.className = 'crystal';
        c.style.left = Math.random()*100 + '%';
        c.style.top = Math.random()*60 + 20 + '%';
        c.style.animationDelay = Math.random()*8 + 's';
        c.style.animationDuration = (6+Math.random()*6) + 's';
        crystals.appendChild(c);
      }
    }
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const vh = window.innerHeight;
          const progress = Math.min(scrollY / vh, 1);
          const far = scene.querySelector('.hero-3d-far');
          const mid = scene.querySelector('.hero-3d-mid');
          const near = scene.querySelector('.hero-3d-near');
          if (far) far.style.transform = `translateZ(-300px) scale(1.3) translateY(${progress*50}px)`;
          if (mid) mid.style.transform = `translateZ(-150px) scale(1.15) translateY(${progress*30}px)`;
          if (near) near.style.transform = `translateZ(0) translateY(${progress*10}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, {passive:true});
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
    initCursor();
    initSnowfall();
    initMist();
    initTilt();
    initHero3D();
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
