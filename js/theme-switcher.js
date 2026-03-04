/* ═══════════════════════════════════════════
   MEME DEL MESE — Theme Switcher
   Shared across all pages.
   ═══════════════════════════════════════════ */
(function () {
  'use strict';

  var THEMES = [
    { id: 'meme-chaos',       label: '🤡 Meme Chaos',       url: '/variants/meme-chaos.html' },
    { id: 'vaporwave-sunset', label: '🌅 Vaporwave Sunset',  url: '/variants/vaporwave-sunset.html' },
    { id: 'cyberpunk',        label: '🏙️ Cyberpunk',         url: '/variants/cyberpunk.html' },
    { id: 'blade-runner',     label: '🌧️ Blade Runner',      url: '/variants/blade-runner.html' },
  ];

  var STORAGE_KEY = 'mdm_theme';

  // Detect current theme from URL
  function currentThemeId() {
    var path = location.pathname;
    for (var i = 0; i < THEMES.length; i++) {
      if (THEMES[i].url === path) return THEMES[i].id;
    }
    // Check for index.html or root
    if (path === '/' || path === '/index.html' || path.endsWith('/memedelmese.github.io/') || path.endsWith('/memedelmese.github.io/index.html')) {
      return 'default';
    }
    // Match by filename
    for (var j = 0; j < THEMES.length; j++) {
      if (path.indexOf(THEMES[j].id) !== -1) return THEMES[j].id;
    }
    return 'default';
  }

  // Root URL: always redirect to a random theme
  function handleRootRedirect() {
    var isRoot = location.pathname === '/' ||
                 location.pathname === '/index.html' ||
                 location.pathname.endsWith('/memedelmese.github.io/') ||
                 location.pathname.endsWith('/memedelmese.github.io/index.html');

    if (isRoot) {
      var pick = THEMES[Math.floor(Math.random() * THEMES.length)];
      localStorage.setItem(STORAGE_KEY, pick.id);
      location.replace(pick.url + location.hash);
      return true;
    }
    return false;
  }

  // Build the switcher UI
  function buildSwitcher() {
    var active = currentThemeId();

    // Floating button
    var fab = document.createElement('button');
    fab.className = 'theme-fab';
    fab.innerHTML = '🎨';
    fab.setAttribute('aria-label', 'Cambia tema');
    fab.title = 'Cambia tema';

    // Popup panel
    var popup = document.createElement('div');
    popup.className = 'theme-popup';

    var header = document.createElement('div');
    header.className = 'theme-popup-header';
    header.textContent = 'Scegli un tema';
    popup.appendChild(header);

    THEMES.forEach(function (t) {
      var btn = document.createElement('button');
      btn.className = 'theme-option' + (t.id === active ? ' active' : '');
      btn.textContent = t.label;
      btn.addEventListener('click', function () {
        localStorage.setItem(STORAGE_KEY, t.id);
        // Preserve hash (meme route)
        location.href = t.url + location.hash;
      });
      popup.appendChild(btn);
    });

    // Variant picker link
    var link = document.createElement('a');
    link.className = 'theme-picker-link';
    link.href = '/variants/';
    link.textContent = '↗ Confronta tutti i temi';
    popup.appendChild(link);

    // Toggle
    var open = false;
    fab.addEventListener('click', function (e) {
      e.stopPropagation();
      open = !open;
      popup.classList.toggle('visible', open);
      fab.classList.toggle('open', open);
    });

    document.addEventListener('click', function () {
      if (open) {
        open = false;
        popup.classList.remove('visible');
        fab.classList.remove('open');
      }
    });
    popup.addEventListener('click', function (e) { e.stopPropagation(); });

    document.body.appendChild(fab);
    document.body.appendChild(popup);
  }

  // Inject styles
  function injectStyles() {
    var css = document.createElement('style');
    css.textContent = [
      '.theme-fab{',
      '  position:fixed;bottom:1.5rem;right:1.5rem;z-index:9990;',
      '  width:3rem;height:3rem;border-radius:50%;border:none;',
      '  background:rgba(30,15,50,0.9);backdrop-filter:blur(8px);',
      '  font-size:1.3rem;cursor:pointer;',
      '  box-shadow:0 2px 16px rgba(0,0,0,0.4),0 0 0 1px rgba(185,103,255,0.3);',
      '  transition:all 0.3s ease;display:flex;align-items:center;justify-content:center;',
      '}',
      '.theme-fab:hover{transform:scale(1.1);box-shadow:0 2px 20px rgba(185,103,255,0.4),0 0 0 1px rgba(255,110,199,0.5);}',
      '.theme-fab.open{transform:rotate(45deg) scale(1.1);}',
      '.theme-popup{',
      '  position:fixed;bottom:5rem;right:1.5rem;z-index:9989;',
      '  background:rgba(20,8,40,0.95);backdrop-filter:blur(12px);',
      '  border:1px solid rgba(185,103,255,0.3);border-radius:12px;',
      '  padding:0.5rem;min-width:220px;',
      '  box-shadow:0 8px 32px rgba(0,0,0,0.5);',
      '  opacity:0;transform:translateY(10px) scale(0.95);pointer-events:none;',
      '  transition:all 0.25s cubic-bezier(0.4,0,0.2,1);',
      '}',
      '.theme-popup.visible{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}',
      '.theme-popup-header{',
      '  font-size:0.7rem;text-transform:uppercase;letter-spacing:0.12em;',
      '  color:rgba(185,103,255,0.7);padding:0.4rem 0.6rem 0.3rem;',
      '  font-family:monospace;',
      '}',
      '.theme-option{',
      '  display:block;width:100%;text-align:left;',
      '  padding:0.55rem 0.7rem;border:none;background:none;',
      '  color:#e0d6e8;font-size:0.85rem;cursor:pointer;',
      '  border-radius:8px;transition:all 0.2s ease;',
      '  font-family:inherit;',
      '}',
      '.theme-option:hover{background:rgba(185,103,255,0.15);color:#fff;}',
      '.theme-option.active{background:rgba(185,103,255,0.2);color:#ff6ec7;font-weight:600;}',
      '.theme-option.active::after{content:" ✓";font-size:0.75rem;}',
      '.theme-picker-link{',
      '  display:block;text-align:center;padding:0.5rem;margin-top:0.3rem;',
      '  font-size:0.72rem;color:rgba(0,255,245,0.6);text-decoration:none;',
      '  border-top:1px solid rgba(185,103,255,0.15);transition:color 0.2s ease;',
      '}',
      '.theme-picker-link:hover{color:rgba(0,255,245,1);}',
      '@media(max-width:500px){',
      '  .theme-fab{bottom:1rem;right:1rem;width:2.7rem;height:2.7rem;font-size:1.1rem;}',
      '  .theme-popup{bottom:4.2rem;right:1rem;min-width:200px;}',
      '}',
    ].join('\n');
    document.head.appendChild(css);
  }

  // Boot
  if (handleRootRedirect()) return; // redirecting, stop here
  injectStyles();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildSwitcher);
  } else {
    buildSwitcher();
  }
})();
