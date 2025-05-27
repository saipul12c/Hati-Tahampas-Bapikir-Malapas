// Memuat konten dari home.json
fetch('home.json')
  .then(res => res.json())
  .then(data => {
    document.getElementById('judul').textContent = data.judul;
    document.getElementById('deskripsi').textContent = data.deskripsi;

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
  })
  .catch(err => console.error('Gagal load JSON:', err));

// Tombol scroll
document.getElementById('btnScroll').addEventListener('click', () => {
  document.getElementById('highlightContainer').scrollIntoView({ behavior: 'smooth' });
});
