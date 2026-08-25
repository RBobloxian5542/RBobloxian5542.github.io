(function () {
  const body = document.body;
  const base = (body.dataset.root || '.').replace(/\/$/, '');
  const requestedSection = new URLSearchParams(window.location.search).get('section');
  const active = body.dataset.active === 'home' && ['games', 'systems', 'effects'].includes(requestedSection)
    ? requestedSection
    : body.dataset.active || 'profile';
  const themeKey = 'rbobloxian-theme';
  const robloxUserId = '7539349290';
  // Static GitHub Pages cannot reliably proxy Roblox's CORS-restricted media
  // endpoints, so these current CDN URLs keep the profile usable when calls fail.
  const cachedRobloxMedia = {
    headshot: 'https://tr.rbxcdn.com/30DAY-AvatarHeadshot-8BC4829F25FC44C4D14FFDDE5FA7DF8F-Png/150/150/AvatarHeadshot/Png/isCircular',
    avatar: 'https://tr.rbxcdn.com/30DAY-Avatar-8BC4829F25FC44C4D14FFDDE5FA7DF8F-Png/720/720/Avatar/Png/noFilter'
  };

  function asset(path) {
    return `${base}/${path}`;
  }

  const icon = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7"></circle><path d="m16.5 16.5 4 4"></path></svg>',
    settings: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M19.43 12.98c.04-.32.07-.65.07-.98s-.03-.66-.08-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.6-.22l-2.49 1a7.7 7.7 0 0 0-1.69-.98l-.38-2.65A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.5.42l-.38 2.65c-.61.25-1.17.58-1.69.98l-2.49-1a.5.5 0 0 0-.6.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.04.32-.08.65-.08.98s.03.66.08.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46a.5.5 0 0 0 .6.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65A.5.5 0 0 0 10 22h4a.5.5 0 0 0 .5-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1a.5.5 0 0 0 .6-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65ZM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Z"></path></svg>',
    robux: `<img class="inline-robux-icon" src="${asset('Images/SkillIcons/Robux.svg')}" alt="">`,
    verified: '<svg class="badge-icon verified-badge" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5 14.1 4l2.6-.2 1.2 2.3 2.3 1.2-.2 2.6L21.5 12 20 14.1l.2 2.6-2.3 1.2-1.2 2.3-2.6-.2L12 21.5 9.9 20l-2.6.2-1.2-2.3-2.3-1.2.2-2.6L2.5 12 4 9.9l-.2-2.6 2.3-1.2 1.2-2.3 2.6.2L12 2.5Z"></path><path d="m8.3 12.2 2.3 2.3 5.1-5.1" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path></svg>',
    robloxPlus: '<svg class="badge-icon plus-badge" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.5 19 6.2v8.6L12 18.5 5 14.8V6.2l7-3.7Z"></path><path d="M12 7v7M8.5 10.5h7"></path></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m3 10 9-7 9 7v10.5a.5.5 0 0 1-.5.5h-5v-6h-7v6h-5a.5.5 0 0 1-.5-.5V10Z"></path></svg>',
    profile: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="8" r="3.5"></circle><path d="M5 20c.7-3.6 3.1-5.5 7-5.5s6.3 1.9 7 5.5"></path></svg>',
    games: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M7 8h10a4 4 0 0 1 3.9 3.1l1.1 4.2a2 2 0 0 1-3.5 1.6L16 14H8l-2.5 2.9A2 2 0 0 1 2 15.3l1.1-4.2A4 4 0 0 1 7 8Z"></path><path d="M8 11v4M6 13h4"></path><circle cx="16.5" cy="12.5" r=".8"></circle><circle cx="19" cy="14.5" r=".8"></circle></svg>',
    systems: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z"></path><path d="m8 10 4 2 4-2M12 12v5"></path></svg>',
    effects: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m12 3 1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5L12 3ZM19 16l.7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z"></path></svg>'
  };

  const sidebarItems = [
    ['home', 'Home', 'home', `${base}/home.html`],
    ['profile', 'Profile', 'profile', `${base}/`],
    ['games', 'Games', 'games', `${base}/home.html?section=games`],
    ['systems', 'Systems', 'systems', `${base}/home.html?section=systems`],
    ['effects', 'Effects', 'effects', `${base}/home.html?section=effects`]
  ];

  function isActive(key) {
    return active === key;
  }

  const shell = document.createElement('div');
  shell.className = 'app-shell';
  shell.innerHTML = `
    <header class="topbar">
      <a class="brand" href="${base}/">ROBLOX</a>
      <div class="top-actions">
        <a class="top-profile" href="${base}/">
          <img class="mini-avatar" data-profile-headshot src="${asset('Images/Avatar.png')}" alt="">
          <span data-profile-name>RBobloxian5542</span>
          <span data-profile-plus hidden>${icon.robloxPlus}</span>
          <span data-profile-verified hidden>${icon.verified}</span>
        </a>
        <span class="robux-counter" title="Total skill value" aria-label="Total skill value: 2 204 Robux">${icon.robux}<span class="robux-total">2 204</span></span>
        <div class="settings-wrap">
          <button class="top-action" id="settings-button" type="button" aria-label="Settings" aria-expanded="false">${icon.settings}</button>
          <div class="settings-menu" id="settings-menu" role="menu">
            <button class="theme-toggle" id="theme-toggle" type="button" role="menuitem">
              <span id="theme-label">Dark mode</span><span class="theme-switch" aria-hidden="true"></span>
            </button>
          </div>
        </div>
      </div>
    </header>
    <aside class="sidebar">
      <a class="sidebar-profile" href="${base}/">
        <img class="sidebar-avatar" data-profile-headshot src="${asset('Images/Avatar.png')}" alt="">
        <span data-profile-name>RBobloxian5542</span>
        <span data-profile-plus hidden>${icon.robloxPlus}</span>
        <span data-profile-verified hidden>${icon.verified}</span>
      </a>
      <nav class="sidebar-nav" aria-label="Main navigation">
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

  window.robloxProfileMedia = { headshot: null, avatar: null, avatar3d: null };

  function setProfileImages(selector, source) {
    if (!source) return;
    document.querySelectorAll(selector).forEach((image) => {
      image.src = source;
    });
  }

  async function fetchProfileMedia() {
    const headshotUrl = `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${robloxUserId}&size=150x150&format=Png&isCircular=true`;
    const avatarUrl = `https://thumbnails.roblox.com/v1/users/avatar?userIds=${robloxUserId}&size=720x720&format=Png&isCircular=false`;
    const avatar3dUrl = `https://thumbnails.roblox.com/v1/users/avatar-3d?userId=${robloxUserId}`;
    const [headshotResult, avatarResult, avatar3dResult] = await Promise.allSettled([
      fetch(headshotUrl).then((response) => response.ok ? response.json() : null),
      fetch(avatarUrl).then((response) => response.ok ? response.json() : null),
      fetch(avatar3dUrl).then((response) => response.ok ? response.json() : null)
    ]);
    const headshot = headshotResult.status === 'fulfilled' ? headshotResult.value?.data?.[0]?.imageUrl : null;
    const avatar = avatarResult.status === 'fulfilled' ? avatarResult.value?.data?.[0]?.imageUrl : null;
    window.robloxProfileMedia.headshot = headshot || cachedRobloxMedia.headshot;
    window.robloxProfileMedia.avatar = avatar || cachedRobloxMedia.avatar;
    window.robloxProfileMedia.avatar3d = avatar3dResult.status === 'fulfilled' ? avatar3dResult.value : null;
    setProfileImages('[data-profile-headshot]', window.robloxProfileMedia.headshot);
    setProfileImages('[data-profile-avatar]', window.robloxProfileMedia.avatar);
    window.dispatchEvent(new CustomEvent('roblox-profile-media-ready'));
  }

  async function fetchProfileBadges() {
    const userResult = await fetch(`https://users.roblox.com/v1/users/${robloxUserId}`).then((response) => response.ok ? response.json() : null).catch(() => null);
    if (userResult?.name) {
      document.querySelectorAll('[data-profile-name]').forEach((element) => { element.textContent = userResult.name; });
    }
    if (userResult?.hasVerifiedBadge) {
      document.querySelectorAll('[data-profile-verified]').forEach((element) => { element.hidden = false; });
    }

    const membership = await fetch(`https://premiumfeatures.roblox.com/v1/users/${robloxUserId}/validate-membership`)
      .then((response) => response.ok ? response.text() : 'false')
      .catch(() => 'false');
    if (membership.trim().toLowerCase() === 'true') {
      document.querySelectorAll('[data-profile-plus]').forEach((element) => { element.hidden = false; });
    }
  }

  async function fetchProfileCounts() {
    const countEndpoints = {
      friends: `https://friends.roblox.com/v1/users/${robloxUserId}/friends/count`,
      followers: `https://friends.roblox.com/v1/users/${robloxUserId}/followers/count`,
      following: `https://friends.roblox.com/v1/users/${robloxUserId}/followings/count`
    };
    await Promise.all(Object.entries(countEndpoints).map(async ([key, endpoint]) => {
      const result = await fetch(endpoint).then((response) => response.ok ? response.json() : null).catch(() => null);
      const count = result?.count;
      if (!Number.isFinite(count)) return;
      const element = document.querySelector(`[data-profile-count="${key}"]`);
      if (element) element.textContent = count.toLocaleString();
    }));
  }

  fetchProfileMedia();
  fetchProfileBadges();
  fetchProfileCounts();

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
    document.documentElement.classList.add('theme-changing');
    document.documentElement.dataset.theme = next;
    localStorage.setItem(themeKey, next);
    syncThemeLabel();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.documentElement.classList.remove('theme-changing');
    }));
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
