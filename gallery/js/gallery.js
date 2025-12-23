document.addEventListener('DOMContentLoaded', () => {
  fetch('/gallery/json/gallery.json')
    .then(res => {
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      return res.json();
    })
    .then(data => {
      setupModal();
      renderMediaGrid(data.gallery.media || []);
      renderSection('shortsGrid', 'Video Shorts', data.gallery.media.filter(item => item.category?.toLowerCase() === 'short'));
      renderSection('posterSection', 'Poster Pagelaran', data.gallery.posters || []);
      renderSection('teamGrid', 'Tim Pelaksana', data.gallery.team_and_players.teams || []);
      renderPaginatedPlayers(data.gallery.team_and_players.players || []);
    })
    .catch(err => console.error('Gagal memuat atau memproses gallery.json:', err));
});

let modal, modalBody, modalCloseBtn;

function setupModal() {
  modal = document.getElementById('modalPopup');
  modalBody = document.getElementById('modalBody'); 
  modalCloseBtn = document.getElementById('modalCloseBtn');

  const closeModal = () => {
    modal.classList.add('hidden');
    modalBody.innerHTML = '';
  };

  modalCloseBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });
}

function openModal(contentHtml) {
  modalBody.innerHTML = contentHtml;
  modal.classList.remove('hidden');
}

function createGalleryCard(item) {
  const card = document.createElement('div');
  card.className = 'gallery-card';

  const isVideo = item.src && item.src.endsWith('.mp4');
  const mediaPath = `..${item.src || item.photo}`;
  const tagsHtml = item.tags?.map(tag => `<span>${tag}</span>`).join('') || '';

  let mediaElement, modalContent;

  if (isVideo) {
    mediaElement = `
      <video controls preload="none" poster="${mediaPath.replace('.mp4', '.jpg')}" class="gallery-video">
        <source src="${mediaPath}" type="video/mp4">
        Browser Anda tidak mendukung tag video.
      </video>`;
    modalContent = mediaElement;
  } else {
    mediaElement = `<img src="${mediaPath}" alt="${item.alt || item.name}" loading="lazy">`;
    modalContent = `
      <img src="${mediaPath}" alt="${item.alt || item.name}">
      <h2 class="section-title">${item.caption || item.name}</h2>
      <p>${item.description || item.role || ''}</p>
      ${tagsHtml ? `<div class="tags">${tagsHtml}</div>` : ''}`;
  }

  card.innerHTML = `
    ${mediaElement}
    <div class="gallery-card-content">
      <h3>${item.caption || item.name}</h3>
      <p>${item.description || item.role || ''}</p>
      ${tagsHtml ? `<div class="tags">${tagsHtml}</div>` : ''}
    </div>`;

  card.addEventListener('click', () => openModal(modalContent));

  return card;
}

function renderMediaGrid(mediaItems) {
  const galleryGrid = document.getElementById('galleryGrid');
  if (!galleryGrid) return;

  const fragment = document.createDocumentFragment();
  mediaItems.forEach(item => fragment.appendChild(createGalleryCard(item)));
  galleryGrid.appendChild(fragment);
}

function renderSection(elementId, title, items) {
  const section = document.getElementById(elementId);
  if (!section || !items.length) return;

  section.innerHTML = `<h2 class="section-title">${title}</h2>`;
  const grid = document.createElement('div');
  grid.className = elementId === 'posterSection' ? 'poster-wrapper' : 'gallery-grid';

  items.forEach(item => {
    const card = elementId === 'posterSection' ? createPosterCard(item) : createGalleryCard(item);
    grid.appendChild(card);
  });

  section.appendChild(grid);
}

function createPosterCard(item) {
    const poster = document.createElement('div');
    poster.className = 'poster-card';
    poster.innerHTML = `<img src="..${item.src}" alt="${item.alt}" class="poster-img" loading="lazy">`;
    return poster;
}

function renderPaginatedPlayers(players) {
  const playersSection = document.getElementById('playersSection');
  if (!playersSection || !players.length) return;

  const grid = document.createElement('div');
  grid.id = 'playersGrid';
  grid.className = 'gallery-grid';

  const nav = document.createElement('div');
  nav.id = 'playerNav';
  nav.className = 'pagination-nav';

  playersSection.innerHTML = '<h2 class="section-title">Pemain</h2>';
  playersSection.appendChild(grid);
  playersSection.appendChild(nav);

  let currentPage = 1;
  const playersPerPage = 8;
  const totalPages = Math.ceil(players.length / playersPerPage);

  const renderPage = page => {
    grid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    players.slice((page - 1) * playersPerPage, page * playersPerPage)
      .forEach(player => fragment.appendChild(createGalleryCard(player)));
    grid.appendChild(fragment);
  };

  const renderPagination = () => {
    nav.innerHTML = '';
    if (totalPages <= 1) return;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      if (i === currentPage) btn.className = 'active';
      btn.addEventListener('click', () => {
        currentPage = i;
        renderPage(i);
        renderPagination();
      });
      nav.appendChild(btn);
    }
  };

  renderPage(1);
  renderPagination();
}
