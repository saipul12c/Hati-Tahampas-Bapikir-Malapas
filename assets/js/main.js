document.addEventListener("DOMContentLoaded", () => {
    const skeletonLoader = document.getElementById('skeleton-loader');
    const mainContent = document.querySelector('main');
    const navbar = document.querySelector('.navbar');
    const footer = document.querySelector('.footer');

    // Tampilkan skeleton loader dan sembunyikan konten utama
    if (skeletonLoader) {
        skeletonLoader.style.display = 'block';
        mainContent.style.display = 'none';
        navbar.style.display = 'none';
        footer.style.display = 'none';

        // Sembunyikan skeleton loader dan tampilkan konten utama setelah beberapa waktu
        setTimeout(() => {
            skeletonLoader.style.display = 'none';
            mainContent.style.display = 'block';
            navbar.style.display = 'block';
            footer.style.display = 'block';
        }, 1500); // Sesuaikan waktu sesuai kebutuhan
    }

    const e = document.getElementById("theme-toggle"),
        t = window.matchMedia("(prefers-color-scheme: dark)");

    function a(o) {
        document.documentElement.setAttribute("data-theme", o),
            localStorage.setItem("theme", o),
            e && (e.innerHTML = o === "dark" ?
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="sun-icon"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>' :
                '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="moon-icon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>')
    }
    e && e.addEventListener("click", () => {
        const o = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        a(o)
    }), a(localStorage.getItem("theme") || (t.matches ? "dark" : "light"));
    const n = document.querySelector(".nav-toggle"),
        c = document.querySelector(".nav-links");
    n && c && (n.addEventListener("click", o => {
        o.stopPropagation(), c.classList.toggle("active")
    }), c.addEventListener("click", () => {
        c.classList.contains("active") && c.classList.remove("active")
    })), document.addEventListener("click", o => {
        c && c.classList.contains("active") && !c.contains(o.target) && !n.contains(o.target) && c.classList.remove("active")
    });
    const i = document.querySelector(".navbar");
    if (i) {
        let l = 0;
        window.addEventListener("scroll", () => {
            let o = window.pageYOffset || document.documentElement.scrollTop;
            o > 10 ? i.classList.add("navbar-scrolled") : i.classList.remove("navbar-scrolled"), o > l && o > 100 ? i.classList.add("navbar-hidden") : i.classList.remove("navbar-hidden"), l = o <= 0 ? 0 : o
        }, { passive: !0 })
    }
});