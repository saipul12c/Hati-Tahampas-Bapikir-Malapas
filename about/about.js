fetch('about.json')
  .then(res => res.json())
  .then(data => {
    document.getElementById('judul').textContent = data.judul;
    document.getElementById('deskripsi').textContent = data.deskripsi;
    document.getElementById('visi').textContent = data.visi;

    const misiList = document.getElementById('misiList');
    data.misi.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      misiList.appendChild(li);
    });
  })
  .catch(err => console.error('Gagal memuat about.json:', err));
