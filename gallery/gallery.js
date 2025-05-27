fetch('gallery.json')
  .then(res => res.json())
  .then(data => {
    const gallery = document.getElementById('galleryGrid');

    data.media.forEach(item => {
      const card = document.createElement('div');
      card.className = 'gallery-card';

      if (item.type === 'image') {
        card.innerHTML = `
          <img src="../assets/img/${item.src}" alt="${item.alt}" />
          <p>${item.caption}</p>
        `;
      } else if (item.type === 'video') {
        card.innerHTML = `
          <video controls>
            <source src="../assets/media/${item.src}" type="video/mp4" />
            Browser Anda tidak mendukung video.
          </video>
          <p>${item.caption}</p>
        `;
      }

      gallery.appendChild(card);
    });
  })
  .catch(err => console.error('Gagal load gallery.json:', err));
