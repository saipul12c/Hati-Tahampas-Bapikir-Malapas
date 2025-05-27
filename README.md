# 🌟 Pagelaran PGMI 2025 Website

Selamat datang di repositori resmi website **Pagelaran PGMI 2025**, acara tahunan dari Program Studi Pendidikan Guru Madrasah Ibtidaiyah (PGMI) yang menampilkan karya, inovasi, dan kreativitas mahasiswa PGMI seluruh Indonesia.

Website ini dirancang menggunakan teknologi sederhana namun fungsional:

* `HTML` untuk struktur
* `CSS` untuk desain
* `JavaScript` untuk interaktivitas
* `JSON` untuk data dinamis

---

## 🚀 Fitur Utama

* **🏠 Home Page**: Informasi singkat dan CTA utama
* **📚 About Page**: Latar belakang dan tujuan pagelaran
* **🎨 Gallery Page**: Dokumentasi foto dan video
* **📅 Schedule Page**: Jadwal acara interaktif dari file JSON
* **📞 Contact Page**: Formulir tanya jawab & info media sosial
* **🔄 Shared Components**: Navbar dan footer otomatis di semua halaman

---

## 📁 Struktur Folder

```
pagelaran-pgmi-2025/
│
├── index.html                 # Halaman utama redirect / entry point
│
├── home/
│   ├── home.html
│   ├── home.css
│   ├── home.js
│   └── home.json
│
├── about/
│   ├── about.html
│   ├── about.css
│   ├── about.js
│   └── about.json
│
├── contact/
│   ├── contact.html
│   ├── contact.css
│   ├── contact.js
│   └── contact.json
│
├── schedule/
│   ├── schedule.html
│   ├── schedule.css
│   ├── schedule.js
│   └── schedule.json
│
├── gallery/
│   ├── gallery.html
│   ├── gallery.css
│   ├── gallery.js
│   └── gallery.json
│
├── assets/
│   ├── img/
│   │   └── logo.png
│   ├── fonts/
│   └── media/
│       └── teaser.mp4
│
├── shared/
│   ├── navbar.html           # Komponen navbar (jika mau include via JS)
│   ├── footer.html           # Komponen footer
│   ├── global.css            # Styling umum (warna, font, layout dasar)
│   └── utils.js              # Fungsi JS umum (loader JSON, dll)
│
└── README.md                 # Dokumentasi proyek
```

---

## 🛠️ Cara Menjalankan

1. **Clone repo ini**

```bash
git clone https://github.com/username/pgmi2025.git
```

2. **Buka file `home/home.html` di browser lokal**

   * Pastikan struktur folder tetap utuh agar file JSON dan CSS bisa terbaca.

3. **(Opsional) Jalankan dengan Live Server**

   * Disarankan menggunakan ekstensi *Live Server* di VSCode agar `fetch()` JSON berjalan sempurna.

---

## ✨ Teknologi Digunakan

* HTML5
* CSS3
* JavaScript DOM & Fetch API
* JSON sebagai data layer
* Struktur modular berbasis folder

---

## 🤝 Kontribusi

Kontribusi sangat terbuka, terutama dari mahasiswa PGMI!
Silakan fork repo ini, buat perubahanmu, dan ajukan pull request.

**Ide kontribusi:**

* Desain UI/UX
* Fitur baru (Dark Mode, Gallery Filter)
* Optimasi responsif
* Konten acara atau jadwal

---

## 📄 Lisensi

Proyek ini menggunakan lisensi **MIT** — silakan digunakan, dimodifikasi, dan dikembangkan sesuai kebutuhan, tetap sertakan kredit jika bermanfaat. 🙏

---

## 👨‍🏫 Dibuat oleh

Tim Kreatif Pagelaran PGMI 2025
Universitas Islam Fiktif
📧 Email: [info@pgmi2025.id](mailto:info@pgmi2025.id)
🌐 Situs resmi: [pgmi2025.id](https://pgmi2025.id) *(contoh)*

---

> “Inovasi tidak lahir dari kemewahan teknologi, tapi dari semangat berbagi dan berkarya.”
> — Panitia PGMI 2025
