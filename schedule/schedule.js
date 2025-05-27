fetch('schedule.json')
  .then(res => res.json())
  .then(data => {
    const tbody = document.querySelector('#jadwalTable tbody');

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
  })
  .catch(err => console.error('Gagal load jadwal:', err));
