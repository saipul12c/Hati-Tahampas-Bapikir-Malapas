fetch('/gallery/json/gallery.json')
  .then(res => res.json())
  .then(data => {
    const gallery = document.getElementById('galleryGrid');
    const mediaItems = data.gallery.media;

    // Modal popup for media & team/player
    const mediaModal = document.createElement('div');
    mediaModal.id = 'modalPopup';
    mediaModal.className = 'fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center hidden z-50';
    mediaModal.innerHTML = `
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto relative p-4">
        <button id="modalCloseBtn" class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl font-bold">&times;</button>
        <div id="modalContent"></div>
      </div>
    `;
    document.body.appendChild(mediaModal);

    const modalContent = mediaModal.querySelector('#modalContent');
    const modalCloseBtn = mediaModal.querySelector('#modalCloseBtn');

    function openModal(htmlContent) {
      modalContent.innerHTML = htmlContent;
      mediaModal.classList.remove('hidden');
    }

    function closeModal() {
      mediaModal.classList.add('hidden');
      const video = modalContent.querySelector('video');
      if (video) video.pause();
      modalContent.innerHTML = '';
    }

    modalCloseBtn.addEventListener('click', closeModal);
    mediaModal.addEventListener('click', (e) => { if (e.target === mediaModal) closeModal(); });

    // Render media items
    const fragmentMedia = document.createDocumentFragment();
    mediaItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'gallery-card border rounded-lg overflow-hidden shadow-md p-3 mb-6 cursor-pointer hover:shadow-lg transition-shadow duration-200';

      let mediaHtml = '';
      if (item.type === 'image') {
        mediaHtml = `<img class="w-full h-auto object-cover rounded" src="..${item.src}" alt="${item.alt || ''}" />`;
      } else if (item.type === 'video') {
        mediaHtml = `
          <video class="w-full rounded" controls>
            <source src="..${item.src}" type="video/mp4" />
            Browser Anda tidak mendukung video.
          </video>
        `;
      }

      const tagsHtml = item.tags?.length
        ? `<div class="tags">${item.tags.map(tag => `<span>${tag}</span>`).join('')}</div>`
        : '';

      const metaParts = [];
      if (item.metadata?.date_uploaded) metaParts.push(`Diunggah: ${item.metadata.date_uploaded}`);
      if (item.metadata?.duration) metaParts.push(`Durasi: ${item.metadata.duration}`);
      if (item.metadata?.author) metaParts.push(`Pembuat: ${item.metadata.author}`);

      const metadataHtml = metaParts.length
        ? `<p class="text-xs text-gray-500 mt-1 italic">${metaParts.join(' | ')}</p>`
        : '';

      card.innerHTML = `
        ${mediaHtml}
        <h3 class="mt-2 font-semibold">${item.caption || ''}</h3>
        ${item.category ? `<p class="text-sm text-gray-600">Kategori: ${item.category}</p>` : ''}
        ${tagsHtml}
        ${metadataHtml}
      `;

      card.addEventListener('click', () => openModal(card.innerHTML));
      fragmentMedia.appendChild(card);
    });
    gallery.appendChild(fragmentMedia);

    // Render Team Section
    const teamSection = document.createElement('section');
    teamSection.className = 'mt-10';
    teamSection.innerHTML = '<h2 class="text-2xl font-semibold mb-4">Tim & Pemain</h2><div id="teamGrid" class="gallery-grid"></div>';
    gallery.parentNode.insertBefore(teamSection, gallery.nextSibling);

    const teamGrid = document.getElementById('teamGrid');
    const fragmentTeam = document.createDocumentFragment();
    data.gallery.team_and_players.teams.forEach(team => {
      const card = document.createElement('div');
      card.className = 'gallery-card text-center cursor-pointer';
      card.innerHTML = `
        <img src="..${team.photo}" alt="${team.name}" class="w-full h-48 object-cover rounded" />
        <h3 class="mt-2 font-semibold">${team.name}</h3>
        ${team.person ? `<p class="text-sm text-gray-700 font-medium">${team.person}</p>` : ''}
        <p class="text-sm text-gray-600 mt-1">${team.description}</p>
      `;
      card.addEventListener('click', () => openModal(card.innerHTML));
      fragmentTeam.appendChild(card);
    });
    teamGrid.appendChild(fragmentTeam);

    // Render Players Section (with pagination if needed)
    const playersSection = document.createElement('section');
    playersSection.className = 'mt-10';
    playersSection.innerHTML = '<div class="flex justify-between items-center mb-2"><h2 class="text-xl font-semibold">Pemain</h2><div id="playerNav"></div></div><div id="playersGrid" class="gallery-grid"></div>';
    teamSection.parentNode.insertBefore(playersSection, teamSection.nextSibling);

    const playersGrid = document.getElementById('playersGrid');
    const playerNav = document.getElementById('playerNav');

    const players = data.gallery.team_and_players.players;
    const pageSize = 12;
    let currentPage = 1;
    const totalPages = Math.ceil(players.length / pageSize);

    function renderPlayers(page) {
      playersGrid.innerHTML = '';
      const fragmentPlayers = document.createDocumentFragment();
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      players.slice(start, end).forEach(player => {
        const card = document.createElement('div');
        card.className = 'gallery-card text-center cursor-pointer';
        card.innerHTML = `
          <img src="..${player.photo}" alt="${player.name}" class="w-full h-48 object-cover rounded" />
          <h3 class="mt-2 font-semibold">${player.name}</h3>
          <p class="text-sm text-gray-600">${player.role}</p>
          <p class="text-sm text-gray-600 mt-1">${player.description}</p>
        `;
        card.addEventListener('click', () => openModal(card.innerHTML));
        fragmentPlayers.appendChild(card);
      });
      playersGrid.appendChild(fragmentPlayers);
    }

    function renderPagination() {
      playerNav.innerHTML = '';
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = `px-2 py-1 mx-1 rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200'}`;
        btn.addEventListener('click', () => {
          currentPage = i;
          renderPlayers(currentPage);
          renderPagination();
        });
        playerNav.appendChild(btn);
      }
    }

    renderPlayers(currentPage);
    if (totalPages > 1) renderPagination();

    // Toggle menu
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    }
  })
  .catch(err => console.error('Gagal load gallery.json:', err));
