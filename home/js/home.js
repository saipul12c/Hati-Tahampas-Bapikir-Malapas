document.addEventListener('DOMContentLoaded', () => {
  const judul = document.getElementById('judul');
  const deskripsi = document.getElementById('deskripsi');
  const tanggal = document.getElementById('isiTanggal');
  const lokasi = document.getElementById('isiLokasi');
  const kutipan = document.getElementById('kutipan');
  const btnScroll = document.getElementById('btnScroll');
  const highlightContainer = document.getElementById('highlightContainer');
  const comingSoonSection = document.getElementById('comingSoon');
  const ctaJudul = document.getElementById('cta-judul');
  const ctaKonten = document.getElementById('cta-konten');
  const ctaTautan = document.getElementById('cta-tautan');

  // Navigasi
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Scroll
  if (btnScroll) {
    btnScroll.addEventListener('click', () => {
      highlightContainer.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Fetch data
  fetch('/home/json/home.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      const { hero, highlights, comingSoon, cta } = data;

      // Hero
      if (judul) judul.textContent = hero.title;
      if (deskripsi) deskripsi.textContent = hero.description;
      if (tanggal) tanggal.textContent = hero.date;
      if (lokasi) lokasi.textContent = hero.location;
      if (kutipan) kutipan.textContent = `\"${hero.quote}\"`;

      // Highlights
      if (highlightContainer) {
        highlights.forEach(item => {
          const card = document.createElement('div');
          card.className = 'highlight-card';
          card.innerHTML = `
            <img src="${item.image}" alt="${item.title}" class="highlight-image" loading="lazy">
            <h3>${item.title}</h3>
            <p>${item.description}</p>
          `;
          highlightContainer.appendChild(card);
        });
      }

      // Coming Soon
      if (comingSoonSection) {
        const comingSoonContent = document.createElement('div');
        comingSoonContent.innerHTML = `
          <h3>${comingSoon.title}</h3>
          <p>${comingSoon.description}</p>
        `;
        comingSoonSection.appendChild(comingSoonContent);
      }

      // CTA
      if (ctaJudul) ctaJudul.textContent = cta.title;
      if (ctaKonten) ctaKonten.textContent = cta.content;
      if (ctaTautan) ctaTautan.href = cta.link;
    })
    .catch(error => {
      console.error('Error fetching home data:', error);
      if (judul) judul.textContent = 'Gagal memuat data';
      if (deskripsi) deskripsi.textContent = 'Silakan coba lagi nanti.';
    });
});