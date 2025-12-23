// blog.js

document.addEventListener('DOMContentLoaded', () => {
  const postsContainer = document.getElementById('blog-posts');

  // Daftar postingan blog (statis)
  // Di masa depan, ini bisa diganti dengan panggilan API
  const posts = [
    {
      title: 'Hati Tahampas, Bapikir Malapas: Sebuah Pergulatan Batin di Panggung Teater',
      date: '2024-07-27',
      author: 'Tim Lokal B',
      excerpt: 'Menyelami makna di balik pertunjukan teater “Hati Tahampas, Bapikir Malapas”, sebuah karya yang menggambarkan dilema antara idealisme dan realita kehidupan seorang guru di pedalaman. Terinspirasi dari semangat budaya lokal Kalimantan Selatan, pertunjukan ini mengajak kita untuk merenungkan kembali arti pengabdian dan pendidikan.',
      url: '/blog/posts/hati-tahampas.html',
      thumbnail: '/assets/images/drama.jpeg'
    }
    // Tambahkan postingan lain di sini
  ];

  if (posts.length === 0) {
    postsContainer.innerHTML = '<p>Belum ada postingan blog.</p>';
    return;
  }

  posts.forEach(post => {
    const postCard = document.createElement('div');
    postCard.className = 'blog-post-card';

    postCard.innerHTML = `
      <img src="${post.thumbnail}" alt="${post.title}">
      <div class="blog-post-content">
        <h2 class="blog-post-title">${post.title}</h2>
        <p class="blog-post-meta">Oleh ${post.author} | ${post.date}</p>
        <p class="blog-post-excerpt">${post.excerpt}</p>
        <a href="${post.url}" class="read-more-btn">Baca Selengkapnya</a>
      </div>
    `;

    postsContainer.appendChild(postCard);
  });
});
