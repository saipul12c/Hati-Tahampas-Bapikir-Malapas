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

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Scroll
  btnScroll.addEventListener('click', () => {
    highlightContainer.scrollIntoView({ behavior: 'smooth' });
  });

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
      judul.textContent = hero.title;
      deskripsi.textContent = hero.description;
      tanggal.textContent = hero.date;
      lokasi.textContent = hero.location;
      kutipan.textContent = `\"${hero.quote}\"`;

      // Highlights
      highlights.forEach(item => {
        const card = document.createElement('div');
        card.className = 'highlight-card';
        card.innerHTML = `
          <h3>${item.title}</h3>
          <p>${item.description}</p>
        `;
        highlightContainer.appendChild(card);
      });

      // Coming Soon
      const comingSoonContent = document.createElement('div');
      comingSoonContent.innerHTML = `
        <h3>${comingSoon.title}</h3>
        <p>${comingSoon.description}</p>
      `;
      comingSoonSection.appendChild(comingSoonContent);

      // CTA
      ctaJudul.textContent = cta.title;
      ctaKonten.textContent = cta.content;
      ctaTautan.href = cta.link;
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      // Tampilkan pesan error di UI
      judul.textContent = 'Gagal memuat data';
      deskripsi.textContent = 'Silakan coba lagi nanti.';
    });

  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }

  function switchTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  themeToggle.addEventListener('click', switchTheme);
});
