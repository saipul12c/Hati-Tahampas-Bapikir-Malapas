document.addEventListener('DOMContentLoaded', () => {
  fetch('/contact/json/contact.json')
    .then(res => {
      if (!res.ok) {
        throw new Error(`Gagal memuat contact.json: ${res.statusText}`);
      }
      return res.json();
    })
    .then(data => {
      // Perbarui deskripsi halaman dari JSON
      const descriptionEl = document.getElementById('kontakDeskripsi');
      if (descriptionEl && data.deskripsi) {
        descriptionEl.textContent = data.deskripsi;
      }

      // Isi kartu sosial yang sudah ada di HTML dengan data dari JSON
      const socialLinksContainer = document.getElementById('socialLinks');
      if (socialLinksContainer && data.sosial) {
        // Ambil semua elemen kartu yang ada
        const socialCards = socialLinksContainer.querySelectorAll('.social-card');

        // Loop melalui data JSON dan isi kartu yang sesuai
        data.sosial.forEach((socialInfo, index) => {
          // Pastikan ada kartu untuk diisi
          if (socialCards[index]) {
            const card = socialCards[index];
            const platformSlug = socialInfo.nama.toLowerCase().replace(/\s+/g, '-');
            const imgSrc = `/assets/qrcode/${platformSlug}.png`;

            const imgEl = card.querySelector('.qrcode-img');
            const nameEl = card.querySelector('p');
            const linkEl = card.querySelector('a'); // Tidak digunakan lagi, tapi bisa untuk referensi

            if (imgEl) {
              imgEl.src = imgSrc;
              imgEl.alt = `QR Code untuk ${socialInfo.nama}`;
            }
            if (nameEl) {
              nameEl.textContent = socialInfo.nama;
            }
          }
        });
      }
    })
    .catch(err => {
      console.error('Terjadi kesalahan saat memproses data kontak:', err);
    });
});
