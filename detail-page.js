(function () {
  const body = document.body;
  const dataFile = body.dataset.dataFile;
  const imageRoot = body.dataset.imageRoot || '';
  const thumbRoot = body.dataset.thumbRoot || '';
  const queryKey = body.dataset.queryKey || 'game';
  const params = new URLSearchParams(window.location.search);
  const slug = params.get(queryKey);
  const videoSlot = document.getElementById('detail-video');
  const fallbackSlot = document.getElementById('detail-fallback');
  const title = document.getElementById('detail-title');
  const role = document.getElementById('detail-role');
  const visits = document.getElementById('detail-visits');
  const description = document.getElementById('detail-description');
  const playLink = document.getElementById('detail-link');
  const carousel = document.getElementById('media-carousel');
  const carouselImage = document.getElementById('carousel-image');
  const carouselCounter = document.getElementById('carousel-counter');
  const previousButton = document.getElementById('carousel-prev');
  const nextButton = document.getElementById('carousel-next');
  let carouselImages = [];
  let carouselIndex = 0;

  function youtubeId(url) {
    if (!url) return null;
    if (url.includes('youtube.com/watch')) return new URL(url).searchParams.get('v');
    if (url.includes('youtu.be/')) return url.split('youtu.be/')[1].split(/[?&]/)[0];
    return null;
  }

  function videoMarkup(url) {
    if (!url) return '';
    if (/\.(mp4|webm)(\?.*)?$/i.test(url)) {
      return `<video autoplay muted loop playsinline controls><source src="${url}" type="video/mp4"></video>`;
    }
    const id = youtubeId(url);
    if (id) {
      return `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&mute=1&playsinline=1&rel=0" title="Video showcase" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    }
    return `<iframe src="${url}" title="Video showcase" allow="autoplay; fullscreen" allowfullscreen></iframe>`;
  }

  function updateCarousel() {
    if (!carouselImages.length) return;
    carouselImage.src = carouselImages[carouselIndex];
    carouselCounter.textContent = `${carouselIndex + 1} / ${carouselImages.length}`;
    previousButton.hidden = carouselImages.length < 2;
    nextButton.hidden = carouselImages.length < 2;
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

  fetch(dataFile)
    .then((response) => response.json())
    .then(async (items) => {
      const item = items.find((entry) => entry.slug === slug) || items[0];
      if (!item) throw new Error('No project found');

      document.title = `${item.title} — RBobloxian5542`;
      title.textContent = item.title;
      role.textContent = item.tag || item.broadDescription || '';
      role.hidden = !role.textContent;
      visits.textContent = item.visits == null ? '' : `Visits: ${item.visits}`;
      visits.hidden = !visits.textContent;
      description.textContent = item.description || item.broadDescription || 'No description yet.';
      if (item.link) {
        playLink.href = item.link;
        playLink.hidden = false;
      } else if (item.repo) {
        playLink.href = item.repo;
        playLink.textContent = 'View Repository';
        playLink.hidden = false;
      } else {
        playLink.hidden = true;
      }

      const firstVideo = Array.isArray(item.videos) && item.videos.length ? item.videos[0] : null;
      if (firstVideo) {
        videoSlot.innerHTML = videoMarkup(typeof firstVideo === 'string' ? firstVideo : firstVideo.url);
        videoSlot.hidden = false;
        fallbackSlot.hidden = true;
      } else if (item.thumb) {
        fallbackSlot.innerHTML = `<img src="${item.thumb.startsWith('http') ? item.thumb : thumbRoot + item.thumb}" alt="${item.title}">`;
        fallbackSlot.hidden = false;
        videoSlot.hidden = true;
      } else {
        fallbackSlot.hidden = false;
        videoSlot.hidden = true;
      }

      carouselImages = await imageSeries(item.imageFolder);
      if (!carouselImages.length && item.thumb) {
        carouselImages = [item.thumb.startsWith('http') ? item.thumb : thumbRoot + item.thumb];
      }
      if (carouselImages.length) {
        carousel.hidden = false;
        updateCarousel();
      } else {
        carousel.hidden = true;
      }
    })
    .catch(() => {
      title.textContent = 'Could not load project data';
      description.textContent = '';
      carousel.hidden = true;
    });

  previousButton.addEventListener('click', () => {
    carouselIndex = (carouselIndex - 1 + carouselImages.length) % carouselImages.length;
    updateCarousel();
  });
  nextButton.addEventListener('click', () => {
    carouselIndex = (carouselIndex + 1) % carouselImages.length;
    updateCarousel();
  });
})();
