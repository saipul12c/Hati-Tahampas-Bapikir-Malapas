fetch('/gallery/json/gallery.json')
  .then(res => res.json())
  .then(data => {
    const gallery = document.getElementById('galleryGrid');
    const mediaItems = data.gallery.media;
    let currentPlaying = null;

    // === Modal Setup ===
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

    const openModal = html => {
      modalContent.innerHTML = html;
      mediaModal.classList.remove('hidden');
    };

    const closeModal = () => {
      mediaModal.classList.add('hidden');
      const video = modalContent.querySelector('video');
      if (video) video.pause();
      modalContent.innerHTML = '';
    };

    modalCloseBtn.addEventListener('click', closeModal);
    mediaModal.addEventListener('click', e => {
      if (e.target === mediaModal) closeModal();
    });

    // === Render General Media ===
    const fragmentMedia = document.createDocumentFragment();
    mediaItems.forEach(item => {
      if (item.type !== 'image' && (item.type !== 'video' || item.category?.toLowerCase() === 'short')) return;

      const card = document.createElement('div');
      card.className = 'gallery-card';

      const srcPath = `..${item.src}`;
      const mediaHtml = item.type === 'image'
        ? `<img class="media-img" src="${srcPath}" alt="${item.alt || ''}" />`
        : `<video class="media-video" controls><source src="${srcPath}" type="video/mp4" />Browser Anda tidak mendukung video.</video>`;

      const tagsHtml = item.tags?.map(tag => `<span class="tag">${tag}</span>`).join(' ') || '';
      const meta = item.metadata || {};
      const metaInfo = [
        meta.date_uploaded && `Diunggah: ${meta.date_uploaded}`,
        meta.duration && `Durasi: ${meta.duration}`,
        meta.author && `Pembuat: ${meta.author}`
      ].filter(Boolean).join(' | ');

      card.innerHTML = `
        ${mediaHtml}
        <h3 class="media-title">${item.caption || ''}</h3>
        ${item.category ? `<p class="media-category">Kategori: ${item.category}</p>` : ''}
        ${tagsHtml ? `<div class="tags">${tagsHtml}</div>` : ''}
        ${metaInfo ? `<p class="meta-info">${metaInfo}</p>` : ''}
      `;
      card.addEventListener('click', () => openModal(card.innerHTML));
      fragmentMedia.appendChild(card);
    });
    gallery.appendChild(fragmentMedia);

    // === Video Shorts ===
    const shorts = mediaItems.filter(item => item.type === 'video' && item.category?.toLowerCase() === 'short');
    const shortSection = document.createElement('section');
    shortSection.className = 'mt-10';
    shortSection.innerHTML = `<h2 class="section-title">Video Shorts</h2><div id="shortsGrid" class="shorts-grid"></div>`;
    gallery.after(shortSection);

    const shortsGrid = shortSection.querySelector('#shortsGrid');
    const shortPagination = document.createElement('div');
    shortPagination.className = 'short-pagination';
    shortSection.appendChild(shortPagination);

    const shortsPerPage = 3;
    let currentShortPage = 1;
    const totalShortPages = Math.ceil(shorts.length / shortsPerPage);

    const pauseAllShorts = () => {
      document.querySelectorAll('.short-video').forEach(v => v.pause());
    };

    const renderShortsPage = (page) => {
      shortsGrid.innerHTML = '';
      const fragment = document.createDocumentFragment();
      shorts.slice((page - 1) * shortsPerPage, page * shortsPerPage).forEach(item => {
        const card = document.createElement('div');
        card.className = 'short-card';
        const srcPath = `..${item.src}`;

        const meta = item.metadata || {};
        const tags = item.tags?.map(tag => `<span>#${tag}</span>`).join(' ') || '';

        card.innerHTML = `
          <div class="short-wrapper">
            <video class="short-video" muted playsinline preload="metadata"><source src="${srcPath}" type="video/mp4"></video>
            <button class="short-play-btn">&#9658;</button>
            <div class="short-overlay">
              <div class="short-caption">${item.caption || ''}</div>
              <div class="short-meta">
                ${meta.author ? `<span class="short-author">@${meta.author}</span>` : ''}
                ${meta.date_uploaded ? `<span class="short-date">${meta.date_uploaded}</span>` : ''}
              </div>
              ${tags ? `<div class="short-tags">${tags}</div>` : ''}
            </div>
          </div>
        `;

        const videoEl = card.querySelector('video');
        const overlay = card.querySelector('.short-overlay');
        const playBtn = card.querySelector('.short-play-btn');

        const togglePlay = () => {
          const paused = videoEl.paused;
          pauseAllShorts();
          if (paused) {
            videoEl.play();
            videoEl.muted = false;
            overlay.style.display = 'none';
            playBtn.style.display = 'none';
          }
        };

        playBtn.onclick = videoEl.onclick = togglePlay;
        videoEl.onpause = videoEl.onended = () => {
          overlay.style.display = 'flex';
          playBtn.style.display = 'flex';
        };

        card.onmouseenter = () => {
          if (videoEl.paused) {
            pauseAllShorts();
            videoEl.muted = true;
            videoEl.play();
            overlay.style.display = 'none';
            playBtn.style.display = 'none';
          }
        };

        card.onmouseleave = () => {
          if (!videoEl.paused) videoEl.pause();
        };

        fragment.appendChild(card);
      });
      shortsGrid.appendChild(fragment);
    };

    const renderShortPagination = () => {
      shortPagination.innerHTML = '';
      for (let i = 1; i <= totalShortPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === currentShortPage ? 'active' : '';
        btn.onclick = () => {
          currentShortPage = i;
          pauseAllShorts();
          renderShortsPage(currentShortPage);
          renderShortPagination();
        };
        shortPagination.appendChild(btn);
      }
    };

    renderShortsPage(currentShortPage);
    if (totalShortPages > 1) renderShortPagination();

    // === Tim & Pemain ===
    const teamSection = document.createElement('section');
    teamSection.className = 'mt-10';
    teamSection.innerHTML = '<h2 class="section-title">Tim & Pemain</h2><div id="teamGrid" class="gallery-grid"></div>';
    shortSection.after(teamSection);

    const teamGrid = teamSection.querySelector('#teamGrid');
    const fragmentTeam = document.createDocumentFragment();
    data.gallery.team_and_players.teams.forEach(team => {
      const card = document.createElement('div');
      card.className = 'gallery-card text-center cursor-pointer';
      card.innerHTML = `
        <img src="..${team.photo}" alt="${team.name}" class="media-img" />
        <h3 class="media-title">${team.name}</h3>
        ${team.person ? `<p class="media-role">${team.person}</p>` : ''}
        <p class="media-description">${team.description}</p>
      `;
      card.onclick = () => openModal(card.innerHTML);
      fragmentTeam.appendChild(card);
    });
    teamGrid.appendChild(fragmentTeam);

    // === Pemain + Paginasi ===
    const players = data.gallery.team_and_players.players;
    const pageSize = 12;
    let currentPage = 1;
    const totalPages = Math.ceil(players.length / pageSize);

    const playersSection = document.createElement('section');
    playersSection.className = 'mt-10';
    playersSection.innerHTML = `
      <div class="flex justify-between items-center mb-2">
        <h2 class="section-title">Pemain</h2>
        <div id="playerNav"></div>
      </div>
      <div id="playersGrid" class="gallery-grid"></div>
    `;
    teamSection.after(playersSection);

    const playersGrid = playersSection.querySelector('#playersGrid');
    const playerNav = playersSection.querySelector('#playerNav');

    const renderPlayers = page => {
      playersGrid.innerHTML = '';
      const fragment = document.createDocumentFragment();
      players.slice((page - 1) * pageSize, page * pageSize).forEach(player => {
        const card = document.createElement('div');
        card.className = 'gallery-card text-center cursor-pointer';
        card.innerHTML = `
          <img src="..${player.photo}" alt="${player.name}" class="media-img" />
          <h3 class="media-title">${player.name}</h3>
          <p class="media-role">${player.role}</p>
          <p class="media-description">${player.description}</p>
        `;
        card.onclick = () => openModal(card.innerHTML);
        fragment.appendChild(card);
      });
      playersGrid.appendChild(fragment);
    };

    const renderPagination = () => {
      playerNav.innerHTML = '';
      for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = `px-2 py-1 mx-1 rounded ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200'}`;
        btn.onclick = () => {
          currentPage = i;
          renderPlayers(currentPage);
          renderPagination();
        };
        playerNav.appendChild(btn);
      }
    };

    renderPlayers(currentPage);
    if (totalPages > 1) renderPagination();

    // === Toggle Navbar ===
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    navToggle?.addEventListener('click', () => navLinks?.classList.toggle('active'));
  })
  .catch(err => console.error('Gagal load gallery.json:', err));
