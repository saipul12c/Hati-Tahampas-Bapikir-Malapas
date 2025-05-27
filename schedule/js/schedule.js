// Menampilkan jadwal jika tersedia
fetch('/schedule/json/schedule.json')
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector('#jadwalTable tbody');

    if (data.jadwal && Array.isArray(data.jadwal)) {
      data.jadwal.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${item.hari}</td>
          <td>${item.jam}</td>
          <td>${item.kegiatan}</td>
          <td>${item.tempat}</td>
        `;
        tbody.appendChild(row);
      });
    }
  })
  .catch(err => console.error('Gagal load jadwal:', err));

// Hitung mundur ke tanggal 28 Juni 2025
function mulaiHitungMundur() {
  const targetDate = new Date('2025-06-28T00:00:00');
  const countdownElement = document.getElementById('countdown');

  setInterval(() => {
    const now = new Date();
    
    const hariIni = now.toLocaleDateString('id-ID', { weekday: 'long' });
    const tanggalIni = now.toLocaleDateString('id-ID');
    const jam = now.getHours().toString().padStart(2, '0');
    const menit = now.getMinutes().toString().padStart(2, '0');
    const detik = now.getSeconds().toString().padStart(2, '0');

    const selisih = targetDate - now;

    if (selisih <= 0) {
      countdownElement.innerHTML = "Acara telah dimulai!";
      return;
    }

    const days = Math.floor(selisih / (1000 * 60 * 60 * 24));
    const hours = Math.floor((selisih % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((selisih % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((selisih % (1000 * 60)) / 1000);

    countdownElement.innerHTML = `
      Hari ini: ${hariIni}, ${tanggalIni} - ${jam}:${menit}:${detik}<br>
      Hitung mundur ke Pagelaran: ${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik
    `;
  }, 1000);
}

mulaiHitungMundur();
