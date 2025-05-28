// Memuat konten dari home.json
fetch('/home/json/home.json')
  .then(res => res.json())
  .then(data => {
    // Judul dan deskripsi utama
    document.getElementById('judul').textContent = data.judul;
    document.getElementById('deskripsi').textContent = data.deskripsi;

    // Tanggal & lokasi
    document.getElementById('isiTanggal').textContent = data.tanggal || 'Segera diumumkan';
    document.getElementById('isiLokasi').textContent = data.lokasi || 'Segera diumumkan';

    // Kutipan inspiratif
    if (data.kutipan) {
      document.getElementById('kutipan').textContent = `"${data.kutipan}"`;
    }

    // Highlight acara
    const highlightContainer = document.getElementById('highlightContainer');
    data.highlight.forEach(item => {
      const card = document.createElement('div');
      card.className = 'highlight-card';
      card.innerHTML = `
        <h3>${item.judul}</h3>
        <p>${item.konten}</p>
      `;
      highlightContainer.appendChild(card);
    });

    // Call to Action (CTA)
    if (data.call_to_action) {
      document.getElementById('cta-judul').textContent = data.call_to_action.judul;
      document.getElementById('cta-konten').textContent = data.call_to_action.konten;
      document.getElementById('cta-tautan').href = data.call_to_action.tautan;
    }
  })
  .catch(err => console.error('Gagal load JSON:', err));

// Tombol scroll ke highlight
document.getElementById('btnScroll').addEventListener('click', () => {
  document.getElementById('highlightContainer').scrollIntoView({ behavior: 'smooth' });
});

// Toggle hamburger menu untuk tampilan kecil
document.addEventListener('DOMContentLoaded', () => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
});
