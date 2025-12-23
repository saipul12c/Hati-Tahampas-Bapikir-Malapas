// vision-mission.js

// Memuat konten dari vision-mission.json
fetch('/vision-mission/json/vision-mission.json')
  .then(res => res.json())
  .then(data => {
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
  })
  .catch(err => console.error('Gagal memuat vision-mission.json:', err));

// Toggle hamburger menu (langsung aktif)
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}
