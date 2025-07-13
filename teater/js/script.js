const videoData = [
  {
    title: "Hati Tahampas Bapikir malapas",
    desc: "Karya ini kami persembahkan untuk semua orang yang telahh kelancaran acara dan Tari dari sanggar bahana antasari banjarmasin ",
    url: "https://www.youtube.com/embed/hJ0LsaAlfJY?si=yhph6BnoucvlX-7W",
    duration: "49:10"
  }
];

const videoList = document.getElementById("videoList");
const popup = document.getElementById("popup");
const popupVideo = document.getElementById("popupVideo");
const popupInfo = document.getElementById("popupInfo");
const closePopup = document.getElementById("closePopup");
const searchInput = document.getElementById("search");

function renderVideos(filter = "") {
  videoList.innerHTML = "";
  const filtered = videoData.filter(v =>
    v.title.toLowerCase().includes(filter.toLowerCase())
  );
  filtered.forEach(video => {
    const card = document.createElement("div");
    card.className = "video-card";
    card.innerHTML = `
      <iframe src="${video.url}" allowfullscreen></iframe>
      <div class="video-details">
        <h3>${video.title}</h3>
        <p>${video.desc} • ${video.duration}</p>
      </div>
    `;
    card.onclick = () => {
      popupVideo.src = video.url + "?autoplay=1";
      popupInfo.innerHTML = `
        <h3>${video.title}</h3>
        <p>${video.desc} • Durasi: ${video.duration}</p>
      `;
      popup.style.display = "flex";
    };
    videoList.appendChild(card);
  });
}

renderVideos();

searchInput.addEventListener("input", e => {
  renderVideos(e.target.value);
});

closePopup.onclick = () => {
  popupVideo.src = "";
  popup.style.display = "none";
};

document.getElementById("toggle-mode").onclick = () => {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");
  document.getElementById("toggle-mode").textContent =
    document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
};
