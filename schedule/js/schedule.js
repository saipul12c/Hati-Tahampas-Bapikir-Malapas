document.addEventListener('DOMContentLoaded', () => {
  // Memuat data jadwal dan data acara (untuk tanggal hitung mundur)
  fetch('/schedule/json/schedule.json')
    .then(res => {
      if (!res.ok) throw new Error(`Gagal memuat schedule.json: ${res.statusText}`);
      return res.json();
    })
    .then(data => {
      if (data.jadwal) {
        loadSchedule(data.jadwal);
      }
      if (data.informasiAcara && data.informasiAcara.tanggalMulai) {
        initializeCountdown(data.informasiAcara.tanggalMulai);
      } else {
        // Fallback jika tanggal tidak ditemukan di JSON
        initializeCountdown('2025-06-28T00:00:00');
      }
    })
    .catch(err => console.error(err));
});

/**
 * Memuat dan menampilkan data jadwal ke dalam tabel.
 * @param {Array} scheduleData - Array objek jadwal.
 */
function loadSchedule(scheduleData) {
  const tbody = document.querySelector('#jadwalTable tbody');
  const headers = Array.from(document.querySelectorAll('#jadwalTable th')).map(th => th.textContent);

  if (!tbody) return;

  const fragment = document.createDocumentFragment();
  scheduleData.forEach(item => {
    const row = document.createElement('tr');

    const formatCell = (content) => {
      if (Array.isArray(content)) {
        return `<ul>${content.map(li => `<li>${li}</li>`).join('')}</ul>`;
      }
      return content || '-';
    };

    row.innerHTML = `
      <td data-label="${headers[0]}">${item.hari || '-'}</td>
      <td data-label="${headers[1]}">${item.waktu || '-'}</td>
      <td data-label="${headers[2]}">${formatCell(item.kegiatan)}</td>
      <td data-label="${headers[3]}">${formatCell(item.keterangan)}</td>
    `;
    fragment.appendChild(row);
  });

  tbody.appendChild(fragment);
}

/**
 * Menginisialisasi dan memulai hitung mundur ke tanggal target.
 * @param {string} targetDateString - String tanggal ISO (misal: '2025-06-28T00:00:00').
 */
function initializeCountdown(targetDateString) {
  const countdownEl = document.getElementById('countdown');
  if (!countdownEl) return;

  const targetDate = new Date(targetDateString).getTime();

  const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      clearInterval(countdownInterval);
      countdownEl.innerHTML = `<a href="/gallery/gallery.html" class="started-link">🎉 Acara Telah Dimulai! Lihat Dokumentasinya</a>`;
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    countdownEl.textContent = `${days}h ${hours}j ${minutes}m ${seconds}d menuju acara`;
  }, 1000);
}
