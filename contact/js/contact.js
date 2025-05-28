fetch('/contact/json/contact.json')
  .then(res => res.json())
  .then(data => {
    // Update deskripsi
    document.getElementById('kontakDeskripsi').textContent = data.deskripsi;

    // Tampilkan barcode sosial media
    const social = document.getElementById('socialLinks');
    data.sosial.forEach(link => {
      const card = document.createElement('div');
      card.className = 'social-card text-center';

      const platformSlug = link.nama.toLowerCase().replace(/\s+/g, '');
      const imgSrc = `/assets/qrcode/${platformSlug}.png`; // Pastikan file QR ada

      card.innerHTML = `
        <img src="${imgSrc}" alt="QR ${link.nama}" class="qrcode-img" />
        <p class="mt-2 font-semibold">${link.nama}</p>
        <a href="${link.url}" target="_blank" class="text-sm text-blue-600 hover:underline">${link.url}</a>
      `;

      social.appendChild(card);
    });
  })
  .catch(err => {
    console.error('Gagal memuat contact.json:', err);
  });

// Hapus form jika masih ada
const form = document.getElementById('contactForm');
if (form) {
  form.remove();
}
