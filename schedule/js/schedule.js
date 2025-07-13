// schedule.js

// Memuat data jadwal dari schedule.json
fetch('/schedule/json/schedule.json')
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector('#jadwalTable tbody');
    if (data.jadwal && Array.isArray(data.jadwal)) {
      data.jadwal.forEach(item => {
        const row = document.createElement('tr');

        // Ubah kegiatan jadi list jika array
        const kegiatan = Array.isArray(item.kegiatan)
          ? `<ul>${item.kegiatan.map(k => `<li>${k}</li>`).join('')}</ul>`
          : item.kegiatan || '-';

        // Ubah keterangan/penanggung jawab jadi list jika array
        const keterangan = Array.isArray(item.keterangan)
          ? `<ul>${item.keterangan.map(k => `<li>${k}</li>`).join('')}</ul>`
          : item.keterangan || '-';

        row.innerHTML = `
          <td>${item.hari || '-'}</td>
          <td>${item.waktu || '-'}</td>
          <td>${kegiatan}</td>
          <td>${keterangan}</td>
        `;
        tbody.appendChild(row);
      });
    }
  })
  .catch(err => console.error('Gagal memuat jadwal:', err));

// Hitung mundur ke 28 Juni 2025
function mulaiHitungMundur() {
  const targetDate = new Date('2025-06-28T00:00:00');
  const countdownEl = document.getElementById('countdown');

  setInterval(() => {
    const now = new Date();
    const selisih = targetDate - now;

    // Format waktu sekarang
    const hariIni    = now.toLocaleDateString('id-ID', { weekday: 'long' });
    const tanggalIni = now.toLocaleDateString('id-ID');
    const jam        = String(now.getHours()).padStart(2, '0');
    const menit      = String(now.getMinutes()).padStart(2, '0');
    const detik      = String(now.getSeconds()).padStart(2, '0');

    if (selisih <= 0) {
      countdownEl.innerHTML = "🎉 Acara telah dimulai!";
      return;
    }

    const days    = Math.floor(selisih / (1000 * 60 * 60 * 24));
    const hours   = Math.floor((selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((selisih % (1000 * 60)) / 1000);

    countdownEl.innerHTML = `
      Hari ini: ${hariIni}, ${tanggalIni} – ${jam}:${menit}:${detik}<br>
      Hitung mundur: ${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik
    `;
  }, 1000);
}

mulaiHitungMundur();

// Toggle hamburger menu untuk mobile
const navToggle2 = document.querySelector('.nav-toggle');
const navLinks2  = document.querySelector('.nav-links');
if (navToggle2 && navLinks2) {
  navToggle2.addEventListener('click', () => {
    navLinks2.classList.toggle('active');
  });
}
