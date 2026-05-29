/* ===== APP.JS — Altitude Culture Complete ===== */
const App = (() => {
  const state = {
    route: 'welcome',
    bookmarks: JSON.parse(localStorage.getItem('ac_bookmarks') || '[]'),
    selectedPillar: null,
    explorer: { alias: 'E-77/NOMAD', specialization: 'alpinist', basecamp: 'sector-alpha' },
    passport: null
  };

  const routes = ['welcome','identity','passport','pillars','kingdom','profile','map','moments','vault','specs','trials','basecamp','command','servicehub','diagnostics','servicereq','design'];

  function navigate(r) {
    if (!routes.includes(r)) r = 'welcome';
    state.route = r;
    window.location.hash = r;
    render();
  }

  function render() {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    const el = document.getElementById('section-' + state.route);
    if (el) el.classList.add('active');
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.toggle('active', l.dataset.route === state.route));
    document.querySelectorAll('.mobile-nav-link').forEach(l => l.classList.toggle('active', l.dataset.route === state.route));
    const idx = routes.indexOf(state.route) + 1;
    document.getElementById('routeIndicator').textContent = String(idx).padStart(2,'0') + ' / ' + String(routes.length).padStart(2,'0');
    const titleEl = document.getElementById('sectionTitle');
    if (titleEl) {
      const names = {welcome:'Welcome',identity:'Identity Protocol',passport:'Passport',pillars:'Pillars',kingdom:'Kingdom',profile:'Profile',map:'Map',moments:'Moments',vault:'Vault',specs:'Specs',trials:'Trials',basecamp:'Basecamp',command:'Command',servicehub:'Service',diagnostics:'Diagnostics',servicereq:'Service Req',design:'Design'};
      titleEl.textContent = names[state.route] || 'Altitude Culture';
    }
    window.scrollTo({top:0,behavior:'smooth'});
    setTimeout(initReveal, 100);
  }

  function initRouter() {
    window.addEventListener('hashchange', () => navigate(window.location.hash.replace('#','') || 'welcome'));
    navigate(window.location.hash.replace('#','') || 'welcome');
  }

  function saveBookmarks() { localStorage.setItem('ac_bookmarks', JSON.stringify(state.bookmarks)); }

  window.toggleBookmark = function(id, btn) {
    const i = state.bookmarks.indexOf(id);
    if (i > -1) { state.bookmarks.splice(i,1); btn.classList.remove('bookmarked'); }
    else { state.bookmarks.push(id); btn.classList.add('bookmarked'); }
    saveBookmarks();
  };

  window.shareMoment = function(title, location) {
    const t = `${title} — ${location} // Altitude Culture`;
    if (navigator.share) navigator.share({title,text:t,url:window.location.href}).catch(()=>{});
    else navigator.clipboard.writeText(t);
  };

  window.selectPillar = function(el) {
    document.querySelectorAll('.pillar-card').forEach(c => c.classList.remove('selected'));
    el.classList.add('selected');
    state.selectedPillar = el.dataset.pillar;
    const btn = document.getElementById('alignBtn');
    if (btn) {
      btn.classList.remove('opacity-50','cursor-not-allowed','pointer-events-none');
      btn.innerHTML = `ALIGN WITH ${state.selectedPillar.toUpperCase()} <span class="material-symbols-outlined">arrow_forward</span>`;
    }
  };

  window.toggleNarrative = function(el) {
    const panel = el.closest('.moment-item')?.querySelector('.narrative-panel');
    if (!panel) return;
    const open = panel.classList.contains('open');
    document.querySelectorAll('.narrative-panel.open').forEach(p => { if (p !== panel) { p.classList.remove('open'); p.style.maxHeight = '0'; } });
    if (open) { panel.classList.remove('open'); panel.style.maxHeight = '0'; }
    else { panel.classList.add('open'); panel.style.maxHeight = panel.scrollHeight + 'px'; }
  };

  window.filterMoments = function(filter) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
    document.querySelectorAll('.moment-item').forEach(item => {
      const tags = item.dataset.tags || '';
      if (filter === 'all') item.style.display = '';
      else if (filter === 'bookmarked') {
        const id = item.querySelector('.bookmark-btn')?.dataset.id;
        item.style.display = state.bookmarks.includes(id) ? '' : 'none';
      } else item.style.display = tags.includes(filter) ? '' : 'none';
    });
  };

  document.addEventListener('mousemove', e => {
    const x = e.clientX / window.innerWidth, y = e.clientY / window.innerHeight;
    document.querySelectorAll('.parallax-bg').forEach(bg => {
      bg.style.transform = `scale(1.1) translate(${-(x-0.5)*20}px, ${-(y-0.5)*20}px)`;
    });
  });

  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    document.querySelectorAll('.parallax-bg-scroll').forEach(bg => {
      bg.style.transform = `translate3d(0, ${s * 0.4}px, 0) scale(1.1)`;
    });
  });

  // Magnetic buttons
  document.addEventListener('mouseover', e => {
    const btn = e.target.closest('.magnetic-btn');
    if (!btn) return;
    const move = (ev) => {
      const r = btn.getBoundingClientRect();
      btn.style.transform = `translate(${(ev.clientX - r.left) / r.width - 0.5 * 10}px, ${(ev.clientY - r.top) / r.height - 0.5 * 10}px)`;
    };
    const leave = () => { btn.style.transform = ''; btn.removeEventListener('mousemove', move); };
    btn.addEventListener('mousemove', move);
    btn.addEventListener('mouseleave', leave, {once: true});
  });

  function initReveal() {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, {threshold: 0.15});
    document.querySelectorAll('.fade-slide-up, .reveal').forEach(el => observer.observe(el));
  }

  function init() {
    initRouter();
    initReveal();
    document.querySelectorAll('.bookmark-btn').forEach(b => {
      if (state.bookmarks.includes(b.dataset.id)) b.classList.add('bookmarked');
    });
    document.querySelectorAll('.sidebar-link, .mobile-nav-link').forEach(l => {
      l.addEventListener('click', e => { e.preventDefault(); navigate(l.dataset.route); });
    });
    // Override form submit
    const form = document.getElementById('identityForm');
    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        const d = new FormData(form);
        state.explorer = { alias: d.get('alias') || 'E-77/NOMAD', specialization: d.get('specialization') || 'alpinist', basecamp: d.get('basecamp') || 'sector-alpha' };
        state.passport = { callsign: state.explorer.alias, issued: new Date().toISOString().split('T')[0], clearance: 'LEVEL_01', sector: 'HUB_PRIME', hash: '0x' + Math.random().toString(16).slice(2,10) + '...' + Math.random().toString(16).slice(2,6) };
        ['callsign','issued','clearance','sector','hash'].forEach(k => {
          const el = document.getElementById('passport' + k.charAt(0).toUpperCase() + k.slice(1));
          if (el) el.textContent = state.passport[k];
        });
        navigate('passport');
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  return { navigate, state, toggleBookmark: window.toggleBookmark, selectPillar: window.selectPillar };
})();
