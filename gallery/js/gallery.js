fetch('/gallery/json/gallery.json')
  .then(res => res.json())
  .then(data => {
    const gallery = document.getElementById('galleryGrid');
    const mediaItems = data.gallery.media;

    // Modal popup
    const modal = document.createElement('div');
    modal.id = 'modalPopup';
    modal.className = 'fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center hidden z-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto relative p-4">
        <button id="modalCloseBtn" class="absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-2xl font-bold">&times;</button>
        <div id="modalContent"></div>
      </div>
    `;
    document.body.appendChild(modal);

    const modalContent = modal.querySelector('#modalContent');
    const modalCloseBtn = modal.querySelector('#modalCloseBtn');

    function openModal(item) {
      let contentHtml = '';
      if (item.type === 'image') {
        contentHtml = `<img class="w-full h-auto rounded" src="../assets/img/${item.src}" alt="${item.alt || ''}" />`;
      } else if (item.type === 'video') {
        contentHtml = `
          <video class="w-full rounded" controls>
            <source src="../assets/media/${item.src}" type="video/mp4" />
            Browser Anda tidak mendukung video.
          </video>
        `;
      }

      const metaParts = [];
      if (item.metadata?.date_taken) metaParts.push(`Tanggal: ${item.metadata.date_taken}`);
      if (item.metadata?.date_created) metaParts.push(`Tanggal: ${item.metadata.date_created}`);
      if (item.metadata?.date_uploaded) metaParts.push(`Diunggah: ${item.metadata.date_uploaded}`);
      if (item.metadata?.duration) metaParts.push(`Durasi: ${item.metadata.duration}`);
      if (item.metadata?.photographer) metaParts.push(`Foto oleh: ${item.metadata.photographer}`);
      if (item.metadata?.author) metaParts.push(`Pembuat: ${item.metadata.author}`);
      if (item.metadata?.designer) metaParts.push(`Desainer: ${item.metadata.designer}`);

      const metaDetails = metaParts.length
        ? `<p class="text-sm text-gray-700 mt-2 italic">${metaParts.join(' | ')}</p>`
        : '';

      const tagsHtml = item.tags?.length
        ? `<div class="tags">${item.tags.map(tag => `<span>${tag}</span>`).join('')}</div>`
        : '';

      modalContent.innerHTML = `
        ${contentHtml}
        <h2 class="mt-3 text-lg font-semibold">${item.caption || ''}</h2>
        ${item.category ? `<p class="text-sm text-gray-600">Kategori: ${item.category}</p>` : ''}
        ${tagsHtml}
        ${metaDetails}
      `;

      modal.classList.remove('hidden');
    }

    function closeModal() {
      modal.classList.add('hidden');
      const video = modalContent.querySelector('video');
      if (video) video.pause();
      modalContent.innerHTML = '';
    }

    modalCloseBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    // Render galeri
    mediaItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'gallery-card border rounded-lg overflow-hidden shadow-md p-3 mb-6 cursor-pointer hover:shadow-lg transition-shadow duration-200';

      let mediaHtml = '';
      if (item.type === 'image') {
        mediaHtml = `<img class="w-full h-auto object-cover rounded" src="../assets/img/${item.src}" alt="${item.alt || ''}" />`;
      } else if (item.type === 'video') {
        mediaHtml = `
          <video class="w-full rounded" controls>
            <source src="../assets/media/${item.src}" type="video/mp4" />
            Browser Anda tidak mendukung video.
          </video>
        `;
      }

      const tagsHtml = item.tags?.length
        ? `<div class="tags">${item.tags.map(tag => `<span>${tag}</span>`).join('')}</div>`
        : '';

      const metaParts = [];
      if (item.metadata?.date_taken) metaParts.push(`Tanggal: ${item.metadata.date_taken}`);
      if (item.metadata?.date_created) metaParts.push(`Tanggal: ${item.metadata.date_created}`);
      if (item.metadata?.date_uploaded) metaParts.push(`Diunggah: ${item.metadata.date_uploaded}`);
      if (item.metadata?.duration) metaParts.push(`Durasi: ${item.metadata.duration}`);
      if (item.metadata?.photographer) metaParts.push(`Foto oleh: ${item.metadata.photographer}`);
      if (item.metadata?.author) metaParts.push(`Pembuat: ${item.metadata.author}`);
      if (item.metadata?.designer) metaParts.push(`Desainer: ${item.metadata.designer}`);

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

      card.addEventListener('click', () => openModal(item));
      gallery.appendChild(card);
    });
  })
  .catch(err => console.error('Gagal load gallery.json:', err));

// ✅ Toggle menu langsung aktif setelah halaman dimuat
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}
