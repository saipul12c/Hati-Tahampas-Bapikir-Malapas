const videoList = document.getElementById("videoList");
const dokumentasiList = document.getElementById("dokumentasiList");
const popup = document.getElementById("popup");
const popupVideo = document.getElementById("popupVideo");
const popupInfo = document.getElementById("popupInfo");
const closePopup = document.getElementById("closePopup");
const searchInput = document.getElementById("search");
const toggleModeButton = document.getElementById("toggle-mode");

const dokList1 = document.getElementById("dokList1");
const dokList3 = document.getElementById("dokList3");

let allMediaItems = [];
let dokumentasiItems = [];
const itemWidth = 240;
const spacing = 16;
const buffer = 5;
let renderedIndexes = new Set();

fetch("./json/videos.json")
  .then((res) => res.json())
  .then((data) => {
    allMediaItems = data;
    renderVideos();

    dokumentasiItems = allMediaItems.filter((item) => item.type === "dokumentasi");

    dokumentasiList.style.width = `${dokumentasiItems.length * (itemWidth + spacing)}px`;
    renderVirtualDokumentasi();
    renderDokumentasiRows();
  })
  .catch((err) => {
    console.error("Gagal memuat data:", err);
    videoList.innerHTML = `<p class="error">Gagal memuat video.</p>`;
    if (dokumentasiList) {
      dokumentasiList.innerHTML = `<p class="error">Gagal memuat dokumentasi.</p>`;
    }
  });

function renderVideos(filter = "") {
  videoList.innerHTML = "";
  const filtered = allMediaItems
    .filter((item) => item.type !== "dokumentasi")
    .filter((item) => item.title.toLowerCase().includes(filter.toLowerCase()));

  if (filtered.length === 0) {
    videoList.innerHTML = `<p class="info">Tidak ada video ditemukan.</p>`;
    return;
  }

  filtered.forEach((video) => {
    const card = createMediaCard(video);
    videoList.appendChild(card);
  });
}

function renderVirtualDokumentasi() {
  const scrollLeft = dokumentasiList.parentElement.scrollLeft;
  const startIdx = Math.max(0, Math.floor(scrollLeft / (itemWidth + spacing)) - buffer);
  const visibleCount = Math.ceil(window.innerWidth / (itemWidth + spacing)) + buffer * 2;
  const endIdx = Math.min(dokumentasiItems.length, startIdx + visibleCount);

  [...dokumentasiList.children].forEach((child) => {
    const idx = parseInt(child.dataset.index);
    if (idx < startIdx - buffer || idx > endIdx + buffer) {
      dokumentasiList.removeChild(child);
      renderedIndexes.delete(idx);
    }
  });

  for (let i = startIdx; i < endIdx; i++) {
    if (renderedIndexes.has(i)) continue;
    const item = dokumentasiItems[i];

    const div = document.createElement("div");
    div.className = "media-card";
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

dokumentasiList.parentElement.addEventListener("scroll", renderVirtualDokumentasi);

function renderDokumentasiRows() {
  if (dokumentasiItems.length < 3) return;

  const total = dokumentasiItems.length;
  const third = Math.floor(total / 3);

  const baris1Items = dokumentasiItems.slice(0, third);
  const baris2Items = dokumentasiItems.slice(third, 2 * third);
  const baris3Items = dokumentasiItems.slice(2 * third);

  // Baris 1 (auto-scroll kanan)
  baris1Items.forEach((item) => {
    const card = createMediaCard(item);
    dokList1.appendChild(card);
  });

  // Baris 2 (manual scroll)
  baris2Items.forEach((item) => {
    const card = createMediaCard(item);
    dokumentasiList.appendChild(card);
  });

  // Baris 3 (auto-scroll kiri)
  baris3Items.forEach((item) => {
    const card = createMediaCard(item);
    dokList3.appendChild(card);
  });

  setupAutoScroll(dokList1, "right", 30); // Baris 1 scroll ke kanan
  setupAutoScroll(dokList3, "left", 22);  // Baris 3 scroll ke kiri
}

function setupAutoScroll(container, direction, speed = 20) {
  const scrollContainer = container.parentElement;
  let scrollInterval;
  let isManualScroll = false;

  function startAutoScroll() {
    if (scrollInterval) return;
    scrollInterval = setInterval(() => {
      if (direction === "right") {
        if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) {
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += 1;
        }
      } else {
        if (scrollContainer.scrollLeft <= 0) {
          scrollContainer.scrollLeft = scrollContainer.scrollWidth;
        } else {
          scrollContainer.scrollLeft -= 1;
        }
      }
    }, speed);
  }

  function stopAutoScroll() {
    clearInterval(scrollInterval);
    scrollInterval = null;
  }

  scrollContainer.addEventListener("scroll", () => {
    if (!isManualScroll) {
      isManualScroll = true;
      stopAutoScroll();
      setTimeout(() => {
        isManualScroll = false;
        startAutoScroll();
      }, 3000);
    }
  });

  startAutoScroll();
}

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
      <p>${media.desc}${media.duration ? ` • ${media.duration}` : ""}</p>
    </div>
  `;

  card.onclick = () => showPopup(media);
  return card;
}

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
      <p>${media.desc}${media.duration ? ` • Durasi: ${media.duration}` : ""}</p>
    `;
  }

  popup.style.display = "flex";
}

closePopup.onclick = () => {
  popupVideo.src = "";
  popup.style.display = "none";
};

searchInput.addEventListener("input", (e) => {
  renderVideos(e.target.value);
});

toggleModeButton.onclick = () => {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");

  toggleModeButton.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
};
