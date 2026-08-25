(function () {
  const body = document.body;
  const dataFile = body.dataset.dataFile;
  const imageRoot = body.dataset.imageRoot || '';
  const thumbRoot = body.dataset.thumbRoot || '';
  const queryKey = body.dataset.queryKey || 'game';
  const params = new URLSearchParams(window.location.search);
  const slug = params.get(queryKey);
  const title = document.getElementById('detail-title');
  const summary = document.getElementById('detail-summary');
  const role = document.getElementById('detail-role');
  const descriptionText = document.getElementById('detail-description-text');
  const playLink = document.getElementById('detail-link');
  const mediaCarousel = document.getElementById('media-carousel');
  const carouselMedia = document.getElementById('carousel-media');
  const previousButton = document.getElementById('carousel-prev');
  const nextButton = document.getElementById('carousel-next');
  const stats = document.getElementById('detail-stats');
  const activeStat = document.getElementById('detail-active');
  const visitsStat = document.getElementById('detail-visits');
  const favoritesStat = document.getElementById('detail-favorites');
  const maxPlayersStat = document.getElementById('detail-max-players');
  const genreStat = document.getElementById('detail-genre');
  let mediaItems = [];
  let carouselIndex = 0;
  let carouselAnimating = false;

  function formatCompactCount(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return '—';
    if (number >= 1000000000) return `${Math.floor(number / 1000000000)}B`;
    if (number >= 1000000) return `${Math.floor(number / 1000000)}M`;
    if (number >= 1000) return `${Math.floor(number / 1000)}K`;
    return String(Math.floor(number));
  }

  function youtubeId(url) {
    if (!url) return null;
    try {
      const parsed = new URL(url);
      if (parsed.hostname === 'youtu.be') return parsed.pathname.slice(1);
      if (parsed.hostname.includes('youtube.com')) return parsed.searchParams.get('v');
    } catch (error) {
      return null;
    }
    return null;
  }

  function videoMarkup(url) {
    if (!url) return '';
    if (/\.(mp4|webm)(\?.*)?$/i.test(url)) {
      return `<video autoplay muted loop playsinline controls><source src="${url}" type="video/mp4"></video>`;
    }
    const id = youtubeId(url);
    if (id) {
      const origin = window.location.origin && window.location.origin !== 'null'
        ? `&origin=${encodeURIComponent(window.location.origin)}`
        : '';
      return `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&controls=1&modestbranding=1&iv_load_policy=3&rel=0&fs=0${origin}" title="Video showcase" referrerpolicy="strict-origin-when-cross-origin" allow="autoplay; encrypted-media; picture-in-picture; web-share"></iframe>`;
    }
    return `<iframe src="${url}" title="Video showcase" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
  }

  function mediaMarkup(item, itemIndex) {
    if (item.type === 'video') return videoMarkup(item.url);
    return `<img src="${item.url}" alt="Game screenshot ${itemIndex + 1}">`;
  }

  function createCarouselItem(item, itemIndex, className) {
    const element = document.createElement('div');
    element.className = `carousel-item ${className}`;
    element.innerHTML = mediaMarkup(item, itemIndex);
    return element;
  }

  function updateCarousel(animate = false) {
    if (!mediaItems.length) return;
    const item = mediaItems[carouselIndex];
    if (!animate || !carouselMedia.firstElementChild) {
      carouselMedia.replaceChildren(createCarouselItem(item, carouselIndex, 'is-current'));
    } else if (!carouselAnimating) {
      const currentItem = carouselMedia.firstElementChild;
      const nextItem = createCarouselItem(item, carouselIndex, 'is-next');
      carouselAnimating = true;
      currentItem.classList.replace('is-current', 'is-fading');
      carouselMedia.append(nextItem);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => currentItem.classList.add('is-disappearing'));
      });
      window.setTimeout(() => {
        carouselMedia.replaceChildren(createCarouselItem(item, carouselIndex, 'is-current'));
        carouselAnimating = false;
      }, 500);
    }
    const hasMultipleItems = mediaItems.length > 1;
    previousButton.hidden = !hasMultipleItems;
    nextButton.hidden = !hasMultipleItems;
  }

  async function imageSeries(folder) {
    if (!folder) return [];
    const found = [];
    for (let i = 1; i <= 20; i += 1) {
      const src = `${imageRoot}${folder}/${i}.png`;
      const exists = await new Promise((resolve) => {
        const image = new Image();
        image.onload = () => resolve(true);
        image.onerror = () => resolve(false);
        image.src = src;
      });
      if (!exists) break;
      found.push(src);
    }
    return found;
  }

  async function fetchGameStats(universeId) {
    if (!universeId) return null;
    const response = await fetch(`https://games.roblox.com/v1/games?universeIds=${encodeURIComponent(universeId)}`);
    if (!response.ok) throw new Error('Stats unavailable');
    const result = await response.json();
    return result?.data?.[0] || null;
  }

  function renderStats(item, gameStats) {
    if (!stats) return;
    const hasGameStats = Boolean(gameStats || item.universeId || item.visits != null || item.ccu != null);
    if (!hasGameStats) {
      stats.hidden = true;
      return;
    }
    const current = gameStats || {};
    activeStat.textContent = formatCompactCount(current.playing ?? item.ccu);
    visitsStat.textContent = formatCompactCount(current.visits ?? item.visits);
    favoritesStat.textContent = formatCompactCount(current.favoritedCount);
    maxPlayersStat.textContent = formatCompactCount(current.maxPlayers);
    genreStat.textContent = current.genre || '—';
    stats.hidden = false;
  }

  fetch(dataFile)
    .then((response) => response.json())
    .then(async (items) => {
      const item = items.find((entry) => entry.slug === slug) || items[0];
      if (!item) throw new Error('No project found');

      document.title = `${item.title} — RBobloxian5542`;
      title.textContent = item.title;
      if (summary) {
        summary.textContent = item.broadDescription || item.description || '';
        summary.hidden = !summary.textContent;
      }
      if (item.tag) {
        role.innerHTML = `<span class="detail-role-label">Role:</span><span class="detail-role-value">${item.tag}</span>`;
      } else {
        role.hidden = true;
      }
      descriptionText.textContent = item.description || item.broadDescription || 'No description yet.';

      if (playLink) {
        if (item.link) {
          playLink.href = item.link;
          playLink.hidden = false;
        } else if (item.repo) {
          playLink.href = item.repo;
          playLink.hidden = false;
        } else {
          playLink.hidden = true;
        }
      }

      const videos = Array.isArray(item.videos)
        ? item.videos
          .map((video) => typeof video === 'string' ? video : video.url)
          .filter(Boolean)
          .map((url) => ({ type: 'video', url }))
        : [];
      const images = (await imageSeries(item.imageFolder)).map((url) => ({ type: 'image', url }));
      if (!images.length && item.thumb) {
        images.push({ type: 'image', url: item.thumb.startsWith('http') ? item.thumb : thumbRoot + item.thumb });
      }
      mediaItems = [...videos, ...images];
      if (mediaItems.length) {
        mediaCarousel.hidden = false;
        updateCarousel();
      }

      renderStats(item);
      fetchGameStats(item.universeId).then((gameStats) => renderStats(item, gameStats)).catch(() => {});
    })
    .catch(() => {
      title.textContent = 'Could not load project data';
      descriptionText.textContent = '';
      if (stats) stats.hidden = true;
    });

  previousButton.addEventListener('click', () => {
    if (carouselAnimating) return;
    carouselIndex = (carouselIndex - 1 + mediaItems.length) % mediaItems.length;
    updateCarousel(true);
  });
  nextButton.addEventListener('click', () => {
    if (carouselAnimating) return;
    carouselIndex = (carouselIndex + 1) % mediaItems.length;
    updateCarousel(true);
  });
})();
