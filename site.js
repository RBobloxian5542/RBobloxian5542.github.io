(function () {
  const body = document.body;
  const base = (body.dataset.root || '.').replace(/\/$/, '');
  const active = body.dataset.active || 'profile';
  const themeKey = 'rbobloxian-theme';

  function asset(path) {
    return `${base}/${path}`;
  }

  const icon = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"></circle><path d="m16.5 16.5 4 4"></path></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3.5 13.4 5.7l2.5.4 1.8-1.7 2.2 2.2-1.7 1.8.4 2.5 2.2 1.4v3l-2.2 1.4-.4 2.5 1.7 1.8-2.2 2.2-1.8-1.7-2.5.4L12 22l-1.4-2.2-2.5-.4-1.8 1.7-2.2-2.2 1.7-1.8-.4-2.5L3.2 13v-3l2.2-1.4.4-2.5-1.7-1.8 2.2-2.2 1.8 1.7 2.5-.4L12 3.5Z"></path><circle cx="12" cy="12" r="3"></circle></svg>',
    coin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 2.7 20.1 7v10L12 21.3 3.9 17V7L12 2.7Z"></path><path d="M12 7.2v9.6M9.5 9.3c.5-.8 1.3-1.2 2.5-1.2 1.4 0 2.4.7 2.4 1.7 0 2.6-4.9 1.1-4.9 3.7 0 1 .9 1.7 2.5 1.7 1.2 0 2.1-.4 2.6-1.2"></path></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m3 10 9-7 9 7v10.5a.5.5 0 0 1-.5.5h-5v-6h-7v6h-5a.5.5 0 0 1-.5-.5V10Z"></path></svg>',
    profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="3.5"></circle><path d="M5 20c.7-3.6 3.1-5.5 7-5.5s6.3 1.9 7 5.5"></path></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3 19 7v10l-7 4-7-4V7l7-4Z"></path><path d="M12 8v8M8 12h8"></path></svg>',
    message: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 5.5h16v11H9l-5 4v-15Z"></path><path d="M8 9.5h8M8 12.5h5"></path></svg>',
    friends: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="9" cy="8" r="3"></circle><circle cx="17" cy="9" r="2.5"></circle><path d="M3.5 20c.5-3.3 2.4-5 5.5-5s5 1.7 5.5 5M15 15c2.7.1 4.4 1.7 5 4"></path></svg>',
    avatar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="7" r="3"></circle><path d="M7.5 21c.2-4.2 1.7-7 4.5-7s4.3 2.8 4.5 7M8.5 13.5 6 18l2 1M15.5 13.5 18 18l-2 1"></path></svg>',
    bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 8h14l1 13H4L5 8Z"></path><path d="M8 8V6a4 4 0 0 1 8 0v2"></path></svg>',
    trade: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 8h13l-3-3M20 16H7l3 3"></path><path d="M17 5h3v3M7 19H4v-3"></path></svg>',
    community: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="8" cy="8" r="2.5"></circle><circle cx="16" cy="8" r="2.5"></circle><path d="M3.5 19c.4-3.2 2-5 4.5-5s4.1 1.8 4.5 5M11.5 19c.4-3.2 2-5 4.5-5s4.1 1.8 4.5 5"></path></svg>',
    blog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m5 16-2 5 5-2 10-10-3-3L5 16Z"></path><path d="m13 6 3 3"></path></svg>',
    store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 10h16v10H4zM3 10l2-5h14l2 5"></path><path d="M8 10v3h8v-3M8 20v-5h8v5"></path></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 10h16v10H4zM3 7h18v3H3zM12 7v13"></path><path d="M12 7H8.5a2 2 0 1 1 0-4C10.4 3 12 7 12 7ZM12 7h3.5a2 2 0 1 0 0-4C13.6 3 12 7 12 7Z"></path></svg>'
  };

  const sidebarItems = [
    ['home', 'Home', 'home', `${base}/`],
    ['profile', 'Profile', 'profile', `${base}/`],
    ['plus', 'Roblox Plus', 'plus', '#'],
    ['messages', 'Messages', 'message', '#'],
    ['friends', 'Friends', 'friends', '#', '123'],
    ['avatar', 'Avatar', 'avatar', '#'],
    ['inventory', 'Inventory', 'bag', '#'],
    ['trade', 'Trade', 'trade', '#'],
    ['communities', 'Communities', 'community', '#'],
    ['blog', 'Blog', 'blog', '#'],
    ['store', 'Official Store', 'store', '#'],
    ['gift', 'Buy Gift Cards', 'gift', '#']
  ];

  function isActive(key) {
    return active === key || (active === 'profile' && key === 'profile');
  }

  const shell = document.createElement('div');
  shell.className = 'app-shell';
  shell.innerHTML = `
    <header class="topbar">
      <a class="brand" href="${base}/">RBOBLOXIAN</a>
      <nav class="topnav" aria-label="Main navigation">
        <a href="${base}/games/">Charts</a>
        <a href="${base}/ui/">Marketplace</a>
        <a href="${base}/systems/">Create</a>
        <span class="topnav-static">Robux</span>
      </nav>
      <label class="search-box" aria-label="Search">
        ${icon.search}
        <input id="site-search" type="search" placeholder="Search">
      </label>
      <div class="top-actions">
        <a class="top-profile" href="${base}/">
          <img class="mini-avatar" src="${asset('Images/Avatar.png')}" alt="">
          <span>RBobloxian5542</span>
          <span aria-hidden="true">◉</span>
        </a>
        <span class="robux-counter" title="Robux">${icon.coin}<span>2</span></span>
        <div class="settings-wrap">
          <button class="top-action" id="settings-button" type="button" aria-label="Settings" aria-expanded="false">${icon.settings}</button>
          <div class="settings-menu" id="settings-menu" role="menu">
            <span class="settings-label">Settings</span>
            <button class="theme-toggle" id="theme-toggle" type="button" role="menuitem">
              <span id="theme-label">Dark mode</span><span class="theme-switch" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
    <aside class="sidebar">
      <a class="sidebar-profile" href="${base}/">
        <img class="sidebar-avatar" src="${asset('Images/Avatar.png')}" alt="">
        <span>RBobloxian5542 ◉</span>
      </a>
      <nav class="sidebar-nav" aria-label="Profile navigation">
        ${sidebarItems.map(([key, label, glyph, href, badge]) => `
          <a class="sidebar-link${isActive(key) ? ' active' : ''}" href="${href}"${href === '#' ? ' data-static="true"' : ''}>
            ${icon[glyph]}<span>${label}</span>${badge ? `<span class="sidebar-badge">${badge}</span>` : ''}
          </a>`).join('')}
      </nav>
    </aside>
    <main class="page"><div class="page-inner" id="page-inner"></div></main>
  `;

  const content = document.getElementById('page-content');
  if (!content) return;
  shell.querySelector('#page-inner').append(...Array.from(content.childNodes));
  content.replaceWith(shell);

  const storedTheme = localStorage.getItem(themeKey);
  document.documentElement.dataset.theme = storedTheme === 'light' ? 'light' : 'dark';

  const settingsButton = document.getElementById('settings-button');
  const settingsMenu = document.getElementById('settings-menu');
  const themeButton = document.getElementById('theme-toggle');
  const themeLabel = document.getElementById('theme-label');

  function syncThemeLabel() {
    themeLabel.textContent = document.documentElement.dataset.theme === 'light' ? 'Light mode' : 'Dark mode';
  }
  syncThemeLabel();

  settingsButton.addEventListener('click', (event) => {
    event.stopPropagation();
    const open = settingsMenu.classList.toggle('open');
    settingsButton.setAttribute('aria-expanded', String(open));
  });
  themeButton.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    localStorage.setItem(themeKey, next);
    syncThemeLabel();
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.settings-wrap')) {
      settingsMenu.classList.remove('open');
      settingsButton.setAttribute('aria-expanded', 'false');
    }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      settingsMenu.classList.remove('open');
      settingsButton.setAttribute('aria-expanded', 'false');
    }
  });

  shell.querySelectorAll('[data-static="true"]').forEach((link) => {
    link.addEventListener('click', (event) => event.preventDefault());
  });
})();
