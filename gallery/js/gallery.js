fetch('/gallery/json/gallery.json')
  .then(res => res.json())
  .then(data => {
    const gallery = document.getElementById('galleryGrid');
    const mediaItems = data.gallery.media;
    let currentPlaying = null;

    // === Modal untuk media popup ===
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
    mediaModal.addEventListener('click', (e) => {
      if (e.target === mediaModal) closeModal();
    });

    // === Render Media Umum (bukan shorts) ===
    const fragmentMedia = document.createDocumentFragment();
    mediaItems
      .filter(item => item.type === 'image' || (item.type === 'video' && item.category?.toLowerCase() !== 'short'))
      .forEach(item => {
        const card = document.createElement('div');
        card.className = 'gallery-card';

        let mediaHtml = '';
        if (item.type === 'image') {
          mediaHtml = `<img class="media-img" src="..${item.src}" alt="${item.alt || ''}" />`;
        } else if (item.type === 'video') {
          mediaHtml = `
            <video class="media-video" controls>
              <source src="..${item.src}" type="video/mp4" />
              Browser Anda tidak mendukung video.
            </video>
          `;
        }

        const tagsHtml = item.tags?.length
          ? `<div class="tags">${item.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')}</div>`
          : '';

        const metaParts = [];
        if (item.metadata?.date_uploaded) metaParts.push(`Diunggah: ${item.metadata.date_uploaded}`);
        if (item.metadata?.duration) metaParts.push(`Durasi: ${item.metadata.duration}`);
        if (item.metadata?.author) metaParts.push(`Pembuat: ${item.metadata.author}`);

        const metadataHtml = metaParts.length
          ? `<p class="meta-info">${metaParts.join(' | ')}</p>`
          : '';

        card.innerHTML = `
          ${mediaHtml}
          <h3 class="media-title">${item.caption || ''}</h3>
          ${item.category ? `<p class="media-category">Kategori: ${item.category}</p>` : ''}
          ${tagsHtml}
          ${metadataHtml}
        `;

        card.addEventListener('click', () => openModal(card.innerHTML));
        fragmentMedia.appendChild(card);
      });
    gallery.appendChild(fragmentMedia);

    // === Video Shorts Section ===
    const shortSection = document.createElement('section');
    shortSection.className = 'mt-10';
    shortSection.innerHTML = '<h2 class="section-title">Video Shorts</h2><div id="shortsGrid" class="shorts-grid"></div>';
    gallery.parentNode.insertBefore(shortSection, gallery.nextSibling);

    const shortsGrid = document.getElementById('shortsGrid');
    const shortPagination = document.createElement('div');
    shortPagination.className = 'short-pagination';
    shortsGrid.parentNode.appendChild(shortPagination);

    const shorts = mediaItems.filter(item => item.type === 'video' && item.category?.toLowerCase() === 'short');
    const shortsPerPage = 3;
    let currentShortPage = 1;
    const totalShortPages = Math.ceil(shorts.length / shortsPerPage);

    function pauseAllShorts() {
      document.querySelectorAll('.short-video').forEach(v => v.pause());
    }

    function renderShortsPage(page) {
      shortsGrid.innerHTML = '';
      const start = (page - 1) * shortsPerPage;
      const end = start + shortsPerPage;
      const pageShorts = shorts.slice(start, end);

      pageShorts.forEach(item => {
        const card = document.createElement('div');
        card.className = 'short-card';

        card.innerHTML = `
          <div class="short-wrapper">
            <video class="short-video" muted playsinline preload="metadata">
              <source src="..${item.src}" type="video/mp4" />
            </video>
            <button class="short-play-btn">&#9658;</button>
            <div class="short-overlay">
              <div class="short-caption">${item.caption || ''}</div>
              <div class="short-meta">
                ${item.metadata?.author ? `<span class="short-author">@${item.metadata.author}</span>` : ''}
                ${item.metadata?.date_uploaded ? `<span class="short-date">${item.metadata.date_uploaded}</span>` : ''}
              </div>
              ${item.tags?.length ? `<div class="short-tags">${item.tags.map(tag => `<span>#${tag}</span>`).join(' ')}</div>` : ''}
            </div>
          </div>
        `;

        const videoEl = card.querySelector('video');
        const overlay = card.querySelector('.short-overlay');
        const playBtn = card.querySelector('.short-play-btn');

        overlay.style.display = 'flex';
        playBtn.style.display = 'flex';

        function pauseOthers(currentVideo) {
          document.querySelectorAll('.short-video').forEach(vid => {
            if (vid !== currentVideo) {
              vid.pause();
              const p = vid.closest('.short-card');
              if (p) {
                p.querySelector('.short-play-btn').style.display = 'flex';
                p.querySelector('.short-overlay').style.display = 'flex';
              }
            }
          });
        }

        playBtn.addEventListener('click', () => {
          if (videoEl.paused) {
            pauseOthers(videoEl);
            videoEl.play();
            videoEl.muted = false;
            overlay.style.display = 'none';
            playBtn.style.display = 'none';
          } else {
            videoEl.pause();
          }
        });

        videoEl.addEventListener('click', () => {
          if (videoEl.paused) {
            pauseOthers(videoEl);
            videoEl.play();
            videoEl.muted = false;
            overlay.style.display = 'none';
            playBtn.style.display = 'none';
          } else {
            videoEl.pause();
          }
        });

        videoEl.addEventListener('pause', () => {
          overlay.style.display = 'flex';
          playBtn.style.display = 'flex';
        });

        videoEl.addEventListener('ended', () => {
          overlay.style.display = 'flex';
          playBtn.style.display = 'flex';
        });

        card.addEventListener('mouseenter', () => {
          if (videoEl.paused) {
            pauseOthers(videoEl);
            videoEl.muted = true;
            videoEl.play();
            overlay.style.display = 'none';
            playBtn.style.display = 'none';
          }
        });

        card.addEventListener('mouseleave', () => {
          if (!videoEl.paused) videoEl.pause();
        });

        shortsGrid.appendChild(card);
      });
    }

    function renderShortPagination() {
      shortPagination.innerHTML = '';
      for (let i = 1; i <= totalShortPages; i++) {
        const btn = document.createElement('button');
        btn.textContent = i;
        btn.className = i === currentShortPage ? 'active' : '';
        btn.addEventListener('click', () => {
          currentShortPage = i;
          pauseAllShorts();
          renderShortsPage(currentShortPage);
          renderShortPagination();
        });
        shortPagination.appendChild(btn);
      }
    }

    renderShortsPage(currentShortPage);
    if (totalShortPages > 1) renderShortPagination();

    // === TIM ===
    const teamSection = document.createElement('section');
    teamSection.className = 'mt-10';
    teamSection.innerHTML = '<h2 class="section-title">Tim & Pemain</h2><div id="teamGrid" class="gallery-grid"></div>';
    shortSection.parentNode.insertBefore(teamSection, shortSection.nextSibling);

    const teamGrid = document.getElementById('teamGrid');
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
      card.addEventListener('click', () => openModal(card.innerHTML));
      fragmentTeam.appendChild(card);
    });
    teamGrid.appendChild(fragmentTeam);

    // === PEMAIN + PAGINASI ===
    const playersSection = document.createElement('section');
    playersSection.className = 'mt-10';
    playersSection.innerHTML = '<div class="flex justify-between items-center mb-2"><h2 class="section-title">Pemain</h2><div id="playerNav"></div></div><div id="playersGrid" class="gallery-grid"></div>';
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
          <img src="..${player.photo}" alt="${player.name}" class="media-img" />
          <h3 class="media-title">${player.name}</h3>
          <p class="media-role">${player.role}</p>
          <p class="media-description">${player.description}</p>
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

    // === Toggle menu ===
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
      navToggle.addEventListener('click', () => navLinks.classList.toggle('active'));
    }
  })
  .catch(err => console.error('Gagal load gallery.json:', err));
