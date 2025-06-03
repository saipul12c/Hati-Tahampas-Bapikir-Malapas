// Fungsi untuk menyisipkan navbar & footer ke semua halaman
document.addEventListener("DOMContentLoaded", () => {
  loadComponent('../shared/navbar.html', '#navbar');
  loadComponent('../shared/footer.html', '#footer');
});

function loadComponent(file, targetSelector) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      document.querySelector(targetSelector).innerHTML = html;
    })
    .catch(err => console.error(`Gagal load ${file}:`, err));
}
