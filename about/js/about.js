// about.js

// Memuat konten dari about.json
fetch('/about/json/about.json')
  .then(res => res.json())
  .then(data => {
    // Judul dan deskripsi umum
    document.getElementById('judul').textContent = data.judul;
    document.getElementById('deskripsi').textContent = data.deskripsi;

    // Informasi dasar
    document.getElementById('tema').textContent = data.tema || '-';
    document.getElementById('lokasi').textContent = data.lokasi || '-';
    document.getElementById('tanggal').textContent = data.tanggal || '-';

    // Visi
    document.getElementById('visi').textContent = data.visi || '-';

    // Misi
    const misiList = document.getElementById('misiList');
    data.misi.forEach(misi => {
      const li = document.createElement('li');
      li.textContent = misi;
      misiList.appendChild(li);
    });

    // Nilai Inti
    const nilaiList = document.getElementById('nilaiList');
    data.nilai.forEach(nilai => {
      const li = document.createElement('li');
      li.textContent = nilai;
      nilaiList.appendChild(li);
    });

    // Struktur Panitia
    const panitiaList = document.getElementById('panitiaList');
    Object.entries(data.panitia).forEach(([jabatan, nama]) => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${formatJabatan(jabatan)}:</strong> ${nama}`;
      panitiaList.appendChild(li);
    });

    // Kontak
    document.getElementById('email').textContent = data.kontak.email || '-';
    document.getElementById('telepon').textContent = data.kontak.telepon || '-';

    const ig = document.getElementById('instagram');
    ig.textContent = data.kontak.instagram || '-';
    ig.href = data.kontak.instagram
      ? 'https://instagram.com/' + data.kontak.instagram.replace('@', '')
      : '#';

    const web = document.getElementById('website');
    web.textContent = data.kontak.website
      ? data.kontak.website.replace(/^https?:\/\//, '')
      : '-';
    web.href = data.kontak.website || '#';
  })
  .catch(err => console.error('Gagal memuat about.json:', err));

// Fungsi bantu: snake_case → Huruf Kapital
function formatJabatan(jabatan) {
  return jabatan
    .replace(/_/g, ' ')
    .replace(/\b\w/g, huruf => huruf.toUpperCase());
}

// Toggle hamburger menu (langsung aktif)
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}
