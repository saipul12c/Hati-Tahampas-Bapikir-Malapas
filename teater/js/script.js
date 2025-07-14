const videoList = document.getElementById("videoList");
const dokumentasiList = document.getElementById("dokumentasiList");
const popup = document.getElementById("popup");
const popupVideo = document.getElementById("popupVideo");
const popupInfo = document.getElementById("popupInfo");
const closePopup = document.getElementById("closePopup");
const searchInput = document.getElementById("search");
const toggleModeButton = document.getElementById("toggle-mode");

let allMediaItems = [];
let dokumentasiItems = [];
const itemWidth = 240;
const spacing = 16; // Jarak antar kartu dokumentasi
const buffer = 5;
let renderedIndexes = new Set();

// Ambil data dari JSON eksternal
fetch("./json/videos.json")
  .then(response => response.json())
  .then(data => {
    allMediaItems = data;
    renderVideos();

    dokumentasiItems = allMediaItems.filter(item => item.type === "dokumentasi");
    dokumentasiList.style.width = `${dokumentasiItems.length * (itemWidth + spacing)}px`;
    renderVirtualDokumentasi();
  })
  .catch(error => {
    console.error("Gagal memuat data:", error);
    videoList.innerHTML = "<p class='error'>Gagal memuat video.</p>";
    if (dokumentasiList) {
      dokumentasiList.innerHTML = "<p class='error'>Gagal memuat dokumentasi.</p>";
    }
  });

// Render video untuk bagian "Galeri Video"
function renderVideos(filter = "") {
  videoList.innerHTML = "";
  const filtered = allMediaItems
    .filter(item => item.type !== "dokumentasi")
    .filter(item => item.title.toLowerCase().includes(filter.toLowerCase()));

  if (filtered.length === 0) {
    videoList.innerHTML = "<p class='info'>Tidak ada video ditemukan.</p>";
  }

  filtered.forEach(video => {
    const card = createMediaCard(video);
    videoList.appendChild(card);
  });
}

// Render virtual dokumentasi (horizontal scroll)
function renderVirtualDokumentasi() {
  const scrollLeft = dokumentasiList.parentElement.scrollLeft;
  const startIdx = Math.max(0, Math.floor(scrollLeft / (itemWidth + spacing)) - buffer);
  const endIdx = Math.min(dokumentasiItems.length, startIdx + Math.ceil(window.innerWidth / (itemWidth + spacing)) + buffer * 2);

  // Hapus elemen yang tidak terlihat
  [...dokumentasiList.children].forEach(child => {
    const idx = parseInt(child.dataset.index);
    if (idx < startIdx - buffer || idx > endIdx + buffer) {
      dokumentasiList.removeChild(child);
      renderedIndexes.delete(idx);
    }
  });

  // Tambahkan elemen yang perlu ditampilkan
  for (let i = startIdx; i < endIdx; i++) {
    if (renderedIndexes.has(i)) continue;

    const item = dokumentasiItems[i];
    const div = document.createElement("div");
    div.className = "media-card";
    div.style.position = "absolute";
    div.style.left = `${i * (itemWidth + spacing)}px`;
    div.dataset.index = i;

    div.innerHTML = `
      <img src="${item.url}" alt="${item.title}" loading="lazy" />
      <div class="media-details">
        <h3>${item.title}</h3>
        <p>${item.desc}</p>
      </div>
    `;

    div.onclick = () => showPopup(item);

    dokumentasiList.appendChild(div);
    renderedIndexes.add(i);
  }
}

// Deteksi scroll untuk memicu virtual render
dokumentasiList.parentElement.addEventListener("scroll", () => {
  renderVirtualDokumentasi();
});

// Buat kartu media (untuk video dan gambar)
function createMediaCard(media) {
  const card = document.createElement("div");
  card.className = "media-card";

  const mediaElement = media.isImage
    ? `<img src="${media.url}" alt="${media.title}" loading="lazy" />`
    : `<iframe src="${media.url}" allowfullscreen loading="lazy"></iframe>`;

  card.innerHTML = `
    ${mediaElement}
    <div class="media-details">
      <h3>${media.title}</h3>
      <p>${media.desc} ${media.duration ? `• ${media.duration}` : ""}</p>
    </div>
  `;

  card.onclick = () => showPopup(media);
  return card;
}

// Tampilkan popup saat klik media
function showPopup(media) {
  popupInfo.innerHTML = "";

  if (media.isImage) {
    popupVideo.style.display = "none";
    popupInfo.innerHTML = `
      <img src="${media.url}" alt="${media.title}" style="width:100%; border-radius:8px; margin-bottom:12px;" />
      <h3>${media.title}</h3>
      <p>${media.desc}</p>
    `;
  } else {
    popupVideo.style.display = "block";
    popupVideo.src = `${media.url}?autoplay=1`;
    popupInfo.innerHTML = `
      <h3>${media.title}</h3>
      <p>${media.desc} • Durasi: ${media.duration}</p>
    `;
  }

  popup.style.display = "flex";
}

// Tutup popup
closePopup.onclick = () => {
  popupVideo.src = "";
  popup.style.display = "none";
};

// Filter video berdasarkan input pencarian
searchInput.addEventListener("input", e => {
  renderVideos(e.target.value);
});

// Toggle mode terang/gelap
toggleModeButton.onclick = () => {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
  toggleModeButton.textContent =
    document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
};
