/* ═══════════════════════════════════════════
   MEME DEL MESE — App Logic
   ═══════════════════════════════════════════ */

(function () {
  'use strict';

  // ── Italian month names ──
  const MONTHS_IT = [
    '', 'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
  ];

  const MONTH_EMOJI = [
    '', '❄️', '💘', '🌱', '🌸', '☀️', '🏖️',
    '🌊', '🔥', '🍂', '🎃', '🍁', '🎄'
  ];

  // ── Taglines (easter egg #2) ──
  const TAGLINES = [
    'Archivio ufficiale delle risate mensili',
    'Dove i meme vengono archiviati con rispetto™',
    'Nessun meme è stato maltrattato durante la creazione di questo sito',
    'Approvato dal consiglio dei meme',
    'Caricamento meme... completato ✓',
    '// TODO: aggiungere più meme',
    'La qualità dei meme può variare. Risultati non garantiti.',
    'Ctrl+Z non funziona qui, purtroppo',
    'Alimentato da puro caos e caffeina',
    'I meme vanno e vengono. L\'archivio è per sempre.',
    'Se stai leggendo questo, meriti un applauso 👏',
    'Nessuna IA è stata usata per scegliere questi meme. Forse.',
    'git commit -m "meme troppo bello per non committare"',
    'Error 200: Meme trovato con successo',
    'Sponsored by: nessuno, siamo troppo di nicchia',
  ];

  // ── Joke tooltips (easter egg #5) ──
  const TILE_JOKES = {
    1:  'Buon anno! (forse)',
    4:  'Pesce d\'aprile?',
    7:  'Troppo caldo per meme migliori',
    10: 'Spooky meme season 🎃',
    12: 'Il meme di Natale 🎅',
  };

  // ── State ──
  let memes = [];
  let currentRoute = null;

  // ── DOM refs ──
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  // ── Init ──
  async function init() {
    setTagline();
    try {
      const resp = await fetch('data/memes.json');
      if (!resp.ok) throw new Error('Failed to load memes');
      memes = await resp.json();
    } catch (e) {
      console.error('Could not load memes.json:', e);
      $('#app').innerHTML = '<p style="text-align:center;padding:3rem;color:var(--text-muted)">Impossibile caricare i meme. Riprova più tardi. 😢</p>';
      return;
    }

    window.addEventListener('hashchange', onRoute);
    onRoute();
    initKonamiCode();
    initSecretFooter();
  }

  // ── Tagline ──
  function setTagline() {
    const el = $('.site-tagline');
    if (el) el.textContent = TAGLINES[Math.floor(Math.random() * TAGLINES.length)];
  }

  // ── Router ──
  function onRoute() {
    const hash = location.hash.slice(1); // e.g. "2025-03"
    if (/^\d{4}-\d{2}$/.test(hash)) {
      showMemeView(hash);
    } else {
      showHome();
    }
  }

  // ── Home View ──
  function showHome() {
    currentRoute = 'home';
    const app = $('#app');

    // Determine year range
    const years = getYears();
    let html = '';

    for (const year of years) {
      html += `<section class="year-section" id="y${year}">`;
      html += `<h2 class="year-heading">${year}</h2>`;
      html += '<div class="month-grid">';

      for (let m = 1; m <= 12; m++) {
        const meme = findMeme(year, m);
        const slug = `${year}-${String(m).padStart(2, '0')}`;
        const active = !!meme;
        const cls = active ? 'active' : 'locked';
        const joke = TILE_JOKES[m] ? ` data-joke="${TILE_JOKES[m]}"` : '';

        html += `<div class="month-tile ${cls}" data-slug="${slug}"${joke}>`;
        html += `<span class="month-emoji">${MONTH_EMOJI[m]}</span>`;
        html += `<span class="month-name">${MONTHS_IT[m].slice(0, 3)}</span>`;
        html += '</div>';
      }

      html += '</div></section>';
    }

    app.innerHTML = html;
    app.className = '';

    // Bind clicks
    $$('.month-tile.active').forEach(tile => {
      tile.addEventListener('click', () => {
        location.hash = tile.dataset.slug;
      });
    });

    $$('.month-tile.locked').forEach(tile => {
      tile.addEventListener('click', () => {
        showToast('Nessun meme per questo mese… ancora 🔒');
      });
    });
  }

  // ── Meme View ──
  function showMemeView(slug) {
    currentRoute = slug;
    const [yearStr, monthStr] = slug.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const meme = findMeme(year, month);

    if (!meme) {
      location.hash = '';
      showToast('Meme non trovato 🤷');
      return;
    }

    const { prev, next } = getNeighbors(year, month);
    const app = $('#app');

    let html = '<div class="meme-viewer visible">';
    html += '<div class="viewer-header">';
    html += `<h2 class="viewer-title">${meme.title}</h2>`;
    html += '<div class="viewer-nav">';
    html += `<button class="btn btn-back" onclick="location.hash=''">← Archivio</button>`;

    if (prev) {
      html += `<button class="btn" onclick="location.hash='${prev}'" data-joke="Viaggio nel tempo ⏪">← Prec</button>`;
    } else {
      html += '<button class="btn" disabled>← Prec</button>';
    }
    if (next) {
      html += `<button class="btn" onclick="location.hash='${next}'" data-joke="Verso il futuro ⏩">Succ →</button>`;
    } else {
      html += '<button class="btn" disabled>Succ →</button>';
    }

    html += '</div></div>';

    html += '<div class="meme-container">';
    html += `<img class="meme-image loading" src="${meme.file}" alt="${meme.alt}" loading="lazy" onclick="window.__zoomImage(this)" onerror="this.parentElement.innerHTML='<div class=\\'meme-error\\'><div class=\\'error-emoji\\'>😵</div><p>Immagine non disponibile</p></div>'" onload="this.classList.remove('loading')">`;
    if (meme.notes) {
      html += `<p class="meme-notes">${meme.notes}</p>`;
    }
    html += '</div></div>';

    app.innerHTML = html;

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Helpers ──
  function getYears() {
    const yearSet = new Set(memes.map(m => m.year));
    // Fill in any gap years and include current year
    const min = Math.min(...yearSet);
    const max = Math.max(...yearSet, new Date().getFullYear());
    const years = [];
    for (let y = max; y >= min; y--) years.push(y);
    return years;
  }

  function findMeme(year, month) {
    return memes.find(m => m.year === year && m.month === month) || null;
  }

  function getNeighbors(year, month) {
    // Sort all memes by year then month
    const sorted = [...memes].sort((a, b) => a.year - b.year || a.month - b.month);
    const idx = sorted.findIndex(m => m.year === year && m.month === month);
    const prev = idx > 0 ? toSlug(sorted[idx - 1]) : null;
    const next = idx < sorted.length - 1 ? toSlug(sorted[idx + 1]) : null;
    return { prev, next };
  }

  function toSlug(meme) {
    return `${meme.year}-${String(meme.month).padStart(2, '0')}`;
  }

  // ── Toast ──
  function showToast(msg) {
    let toast = $('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    // Trigger reflow
    toast.classList.remove('visible');
    void toast.offsetWidth;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2500);
  }

  // ── Image Zoom Modal ──
  window.__zoomImage = function (img) {
    let overlay = $('.modal-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.innerHTML = '<button class="modal-close" aria-label="Chiudi">×</button><img>';
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay || e.target.classList.contains('modal-close')) {
          overlay.classList.remove('visible');
        }
      });
      document.body.appendChild(overlay);
    }
    overlay.querySelector('img').src = img.src;
    overlay.querySelector('img').alt = img.alt;
    overlay.classList.add('visible');
  };

  // Close modal on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = $('.modal-overlay.visible');
      if (modal) modal.classList.remove('visible');
      const credits = $('.credits-modal.visible');
      if (credits) credits.classList.remove('visible');
    }
  });

  // ── Easter Egg #1: Konami Code ──
  function initKonamiCode() {
    const code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let pos = 0;

    document.addEventListener('keydown', (e) => {
      if (e.key === code[pos]) {
        pos++;
        if (pos === code.length) {
          activateOverdrive();
          pos = 0;
        }
      } else {
        pos = 0;
      }
    });
  }

  function activateOverdrive() {
    if (document.body.classList.contains('vaporwave-overdrive')) return;
    document.body.classList.add('vaporwave-overdrive');

    // Add banner
    const banner = document.createElement('div');
    banner.className = 'overdrive-banner';
    banner.textContent = '✦ V A P O R W A V E  O V E R D R I V E ✦';
    document.body.prepend(banner);

    showToast('🌴 Vaporwave Overdrive attivato! 🌴');

    // Remove after 15 seconds
    setTimeout(() => {
      document.body.classList.remove('vaporwave-overdrive');
      banner.remove();
      showToast('Overdrive disattivato. La realtà è tornata. 😌');
    }, 15000);
  }

  // ── Easter Egg #3: Secret Footer ──
  function initSecretFooter() {
    const secret = $('.footer-secret');
    if (!secret) return;

    let clicks = 0;
    secret.addEventListener('click', () => {
      clicks++;
      if (clicks >= 3) {
        clicks = 0;
        showCredits();
      }
    });
  }

  function showCredits() {
    let modal = $('.credits-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'credits-modal';
      modal.innerHTML = `
        <div class="credits-content">
          <h2>🏆 Crediti Segreti</h2>
          <p>Sito creato con amore, caffeina e una quantità discutibile di CSS neon.</p>
          <p>Dedicato a tutti i meme che non ce l'hanno fatta. 🫡</p>
          <p style="font-size:0.75rem; margin-top:0.8rem; color: var(--text-muted)">Hai trovato un easter egg! Ce ne sono altri…</p>
          <button class="credits-close">Chiudi (e torna ai meme)</button>
        </div>
      `;
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('credits-close')) {
          modal.classList.remove('visible');
        }
      });
      document.body.appendChild(modal);
    }
    modal.classList.add('visible');
  }

  // ── Boot ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
