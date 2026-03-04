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

  // ── Taglines (Easter Egg #1: random taglines) ──
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
    'npm install meme-del-mese --save-humor',
    'Connessione al server dei meme... stabilita',
    'Hai provato a spegnere e riaccendere i meme?',
  ];

  // ── Joke tooltips (Easter Egg #2: hover jokes) ──
  const TILE_JOKES = {
    1:  'Buon anno! (forse)',
    2:  'L\'amore è un meme 💕',
    4:  'Pesce d\'aprile? 🐟',
    7:  'Troppo caldo per meme migliori 🥵',
    8:  'Ferragosto mode: ON',
    10: 'Spooky meme season 🎃',
    12: 'Il meme di Natale 🎅',
  };

  // ── Locked tile messages (Easter Egg #3: different messages each click) ──
  const LOCKED_MESSAGES = [
    'Nessun meme per questo mese… ancora 🔒',
    'Qui non c\'è nulla. Come il mio conto in banca.',
    'Meme non pervenuto. Riprova tra un mese.',
    'Error 404: Meme Not Found 🕳️',
    'Questo mese era in ferie.',
    'Il meme è scappato. Lo stiamo cercando.',
    'Vuoto cosmico. Ma con stile.',
    '*rumore di grilli* 🦗',
    'Coming soon™ (forse)',
    'Il comitato ha deciso: niente meme questo mese.',
  ];

  // ── Easter Egg registry ──
  const TOTAL_EGGS = 10;
  const eggsFound = new Set(JSON.parse(localStorage.getItem('mdm_eggs') || '[]'));

  // ── State ──
  let memes = [];
  let currentRoute = null;
  let lockedClickIdx = 0;

  // ── DOM refs ──
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => [...document.querySelectorAll(sel)];

  // ── Init ──
  async function init() {
    setTagline();
    printConsoleArt();
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
    initTitleClicks();
    initTaglineClicks();
    initTypeMeme();
    initScrollSecret();
    updateEggTracker();
  }

  // ── Easter Egg #4: Console ASCII art ──
  function printConsoleArt() {
    const art = [
      '%c╔══════════════════════════════════════════╗',
      '║     🏆  M E M E  D E L  M E S E  🏆     ║',
      '║                                          ║',
      '║  Hai aperto la console? Sei un vero dev! ║',
      '║  Questo conta come easter egg #4 🥚      ║',
      '║                                          ║',
      '║  Prova: ↑↑↓↓←→←→BA (Konami Code)        ║',
      '║  Prova: scrivi "meme" sulla tastiera     ║',
      '║  Prova: clicca il titolo 10 volte        ║',
      '║  Prova: clicca le ☆ nel footer           ║',
      '║  Prova: scorri fino in fondo             ║',
      '╚══════════════════════════════════════════╝',
    ].join('\n');
    console.log(art, 'color: #b967ff; font-family: monospace; font-size: 12px;');
    console.log('%c🥚 Se stai leggendo questo, digita window.__unlock() nella console per un regalo!', 'color: #ff6ec7; font-size: 11px;');

    // Secret console command
    window.__unlock = function() {
      discoverEgg('console-unlock', 'Hai sbloccato l\'easter egg della console! 🧑‍💻');
      triggerEmojiRain(['🏆', '🥚', '⭐', '🎉', '💜'], 30);
      return '🏆 Congratulazioni, hacker dei meme!';
    };
  }

  // ── Tagline ──
  function setTagline() {
    const el = $('.site-tagline');
    if (el) el.textContent = TAGLINES[Math.floor(Math.random() * TAGLINES.length)];
  }

  // ── Easter Egg #1: Click tagline to cycle ──
  function initTaglineClicks() {
    const el = $('.site-tagline');
    if (!el) return;
    let idx = TAGLINES.indexOf(el.textContent);
    el.addEventListener('click', () => {
      idx = (idx + 1) % TAGLINES.length;
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = TAGLINES[idx];
        el.style.opacity = '1';
      }, 300);
      discoverEgg('tagline-click', 'Hai scoperto che le tagline sono cliccabili! 💬');
    });
  }

  // ── Router ──
  function onRoute() {
    const hash = location.hash.slice(1);
    if (/^\d{4}-\d{2}$/.test(hash)) {
      showMemeView(hash);
    } else {
      showHome();
    }
  }

  // ── Home View (with thumbnails) ──
  function showHome() {
    currentRoute = 'home';
    const app = $('#app');

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
        html += '<div class="thumb-wrap">';

        if (active) {
          html += `<div class="thumb-placeholder">${MONTH_EMOJI[m]}</div>`;
          html += `<img class="month-thumb" src="${meme.thumb || meme.file}" alt="${meme.alt}" loading="lazy" onload="this.classList.add('loaded')" onerror="this.remove()">`;
        } else {
          html += `<div class="thumb-placeholder">🔒</div>`;
        }

        html += '</div>';

        html += '<div class="month-label">';
        html += `<span class="month-emoji">${MONTH_EMOJI[m]}</span>`;
        html += `<span class="month-name">${MONTHS_IT[m].slice(0, 3)}</span>`;
        html += '</div>';
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
        const msg = LOCKED_MESSAGES[lockedClickIdx % LOCKED_MESSAGES.length];
        lockedClickIdx++;
        showToast(msg);
        if (lockedClickIdx >= 5) {
          discoverEgg('locked-clicks', 'Hai cliccato abbastanza mesi vuoti da meritare un premio! 🏅');
        }
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // ── Helpers ──
  function getYears() {
    const yearSet = new Set(memes.map(m => m.year));
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

  // Close modals on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const modal = $('.modal-overlay.visible');
      if (modal) modal.classList.remove('visible');
      const credits = $('.credits-modal.visible');
      if (credits) credits.classList.remove('visible');
    }
  });

  // ── Easter Egg #5: Konami Code ──
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

    const banner = document.createElement('div');
    banner.className = 'overdrive-banner';
    banner.textContent = '✦ V A P O R W A V E  O V E R D R I V E ✦';
    document.body.prepend(banner);

    discoverEgg('konami', '🌴 Vaporwave Overdrive attivato! 🌴');
    triggerEmojiRain(['🌴', '🌊', '🦩', '💜', '✨', '🎶'], 25);

    setTimeout(() => {
      document.body.classList.remove('vaporwave-overdrive');
      banner.remove();
      showToast('Overdrive disattivato. La realtà è tornata. 😌');
    }, 15000);
  }

  // ── Easter Egg #6: Secret Footer (click stars) ──
  function initSecretFooter() {
    $$('.footer-secret').forEach(star => {
      let clicks = 0;
      star.addEventListener('click', () => {
        clicks++;
        // Visual feedback on each click
        star.style.transform = `scale(${1 + clicks * 0.15}) rotate(${clicks * 30}deg)`;
        if (clicks >= 3) {
          clicks = 0;
          star.style.transform = '';
          showCredits();
        }
        setTimeout(() => { star.style.transform = ''; }, 600);
      });
    });
  }

  function showCredits() {
    discoverEgg('credits', 'Hai trovato i crediti segreti! ⭐');

    let modal = $('.credits-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'credits-modal';
      modal.innerHTML = `
        <div class="credits-content">
          <h2>🏆 Crediti Segreti</h2>
          <p>Sito creato con amore, caffeina e una quantità discutibile di CSS neon.</p>
          <p>Dedicato a tutti i meme che non ce l'hanno fatta. 🫡</p>
          <p style="margin-top:0.8rem">Easter egg trovati: <strong>${eggsFound.size}/${TOTAL_EGGS}</strong></p>
          <p style="font-size:0.75rem; margin-top:0.5rem; color: var(--text-muted)">${eggsFound.size >= TOTAL_EGGS ? '🎉 Li hai trovati TUTTI! Sei un meme master!' : 'Continua a cercare…'}</p>
          <button class="credits-close">Chiudi (e torna ai meme)</button>
        </div>
      `;
      modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('credits-close')) {
          modal.classList.remove('visible');
        }
      });
      document.body.appendChild(modal);
    } else {
      // Update count
      modal.querySelector('strong').textContent = `${eggsFound.size}/${TOTAL_EGGS}`;
    }
    modal.classList.add('visible');
  }

  // ── Easter Egg #7: Title clicks ──
  function initTitleClicks() {
    const title = $('.site-title');
    if (!title) return;
    let clicks = 0;

    title.addEventListener('click', () => {
      clicks++;
      title.classList.add('spin');
      setTimeout(() => title.classList.remove('spin'), 1000);

      if (clicks === 5) {
        showToast('Continua a cliccare… 🤔');
      }
      if (clicks >= 10) {
        clicks = 0;
        discoverEgg('title-clicks', 'Hai cliccato il titolo 10 volte! 🎯');
        triggerEmojiRain(['🏆', '🎉', '✨', '🌟', '💫', '⭐'], 40);
      }
    });
  }

  // ── Easter Egg #8: Type "meme" ──
  function initTypeMeme() {
    const target = 'meme';
    let buffer = '';

    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key.length === 1) {
        buffer += e.key.toLowerCase();
        if (buffer.length > target.length) buffer = buffer.slice(-target.length);
        if (buffer === target) {
          buffer = '';
          discoverEgg('type-meme', 'Hai digitato "meme"! Sei un vero intenditore! 🧠');
          triggerEmojiRain(['😂', '🤣', '💀', '😭', '🗿', '🫠', '😎', '🤡'], 50);
        }
      }
    });
  }

  // ── Easter Egg #9: Scroll to bottom reveals secret ──
  function initScrollSecret() {
    const secretDiv = document.createElement('div');
    secretDiv.className = 'scroll-secret';
    secretDiv.innerHTML = '🥚 Hai scrollato fino alla fine! Sei una persona determinata.<br><span style="font-size:0.65rem; opacity:0.5">Questo è l\'easter egg #9. Ne mancano pochi.</span>';
    document.body.appendChild(secretDiv);

    let revealed = false;
    window.addEventListener('scroll', () => {
      if (revealed) return;
      const scrollBottom = window.innerHeight + window.scrollY;
      const pageHeight = document.documentElement.scrollHeight;
      if (scrollBottom >= pageHeight - 20) {
        revealed = true;
        secretDiv.classList.add('revealed');
        discoverEgg('scroll-bottom', 'Hai scrollato fino in fondo! 📜');
      }
    });
  }

  // ── Emoji rain effect ──
  function triggerEmojiRain(emojis, count) {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const el = document.createElement('div');
        el.className = 'emoji-rain';
        el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        el.style.left = Math.random() * 100 + 'vw';
        el.style.animationDuration = (2 + Math.random() * 3) + 's';
        el.style.fontSize = (1.2 + Math.random() * 1.5) + 'rem';
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 5000);
      }, i * 80);
    }
  }

  // ── Easter Egg discovery system ──
  function discoverEgg(id, message) {
    const isNew = !eggsFound.has(id);
    eggsFound.add(id);
    localStorage.setItem('mdm_eggs', JSON.stringify([...eggsFound]));
    if (isNew) {
      showToast(`🥚 ${message} (${eggsFound.size}/${TOTAL_EGGS})`);
      updateEggTracker();
    } else {
      showToast(message);
    }
  }

  function updateEggTracker() {
    const tracker = $('.egg-tracker');
    if (!tracker) return;
    tracker.textContent = `🥚 ${eggsFound.size}/${TOTAL_EGGS} trovati`;
    if (eggsFound.size > 0) {
      tracker.classList.add('found');
      setTimeout(() => tracker.classList.remove('found'), 600);
    }
    if (eggsFound.size >= TOTAL_EGGS) {
      tracker.style.borderColor = 'var(--neon-pink)';
      tracker.style.color = 'var(--neon-pink)';
      tracker.textContent = `🥚 ${eggsFound.size}/${TOTAL_EGGS} ★ COMPLETO ★`;
    }
  }

  // ── Boot ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
