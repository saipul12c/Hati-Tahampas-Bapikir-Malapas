fetch('contact.json')
  .then(res => res.json())
  .then(data => {
    document.getElementById('kontakDeskripsi').textContent = data.deskripsi;

    const social = document.getElementById('socialLinks');
    data.sosial.forEach(link => {
      const a = document.createElement('a');
      a.href = link.url;
      a.textContent = link.nama;
      a.target = '_blank';
      social.appendChild(a);
    });
  });

document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  alert('Pesan kamu berhasil dikirim! (simulasi)');
});
