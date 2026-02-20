document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('navLinks');
    const navItems = document.querySelectorAll('.nav-links li a');
    const navbar = document.getElementById('navbar');
    const videoItems = document.querySelectorAll('.video-item');
    const heroVideo = document.querySelector('.hero-video');
    const sections = document.querySelectorAll('.section');
    const drone = document.getElementById('drone');
    const parallaxSection = document.getElementById('parallax-dron');

    // --- Menú hamburguesa ---
    burger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        burger.classList.toggle('toggle');
    });

    // Cerrar menú al hacer clic en enlace
    navItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('nav-active');
            burger.classList.remove('toggle');
        });
    });

    // Cambiar estilo del navbar al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Marcar enlace activo
    const allSections = document.querySelectorAll('section, header');
    window.addEventListener('scroll', () => {
        let current = '';
        allSections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // --- MOVIMIENTO DEL DRON ---
    function moveDrone() {
        if (!drone || !parallaxSection) return;

        const scrollY = window.scrollY;
        const sectionTop = parallaxSection.offsetTop;
        const sectionHeight = parallaxSection.offsetHeight;
        const viewportHeight = window.innerHeight;

        const sectionVisibleStart = sectionTop - viewportHeight;
        const sectionVisibleEnd = sectionTop + sectionHeight;
        let progress = (scrollY - sectionVisibleStart) / (sectionVisibleEnd - sectionVisibleStart);
        progress = Math.min(1, Math.max(0, progress));

        const leftPosition = -20 + progress * 140;
        drone.style.left = leftPosition + '%';
    }

    window.addEventListener('scroll', moveDrone);
    moveDrone();

    // --- Animación de entrada para secciones (fade-in) ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => observer.observe(section));

    // --- Funcionalidad de video en galería ---
    videoItems.forEach(item => {
        const video = item.querySelector('video');
        const playBtn = item.querySelector('.play-video-btn');

        if (video && playBtn) {
            playBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (video.paused) {
                    video.play();
                    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                } else {
                    video.pause();
                    playBtn.innerHTML = '<i class="fas fa-play"></i>';
                }
            });

            const videoObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting && !video.paused) {
                        video.pause();
                        playBtn.innerHTML = '<i class="fas fa-play"></i>';
                    }
                });
            }, { threshold: 0.3 });
            videoObserver.observe(item);
        }
    });

    // Reproducir hero video si es posible
    if (heroVideo) {
        heroVideo.play().catch(() => {});
    }
});

// Cerrar menú al hacer clic fuera
document.addEventListener('click', (e) => {
    const nav = document.getElementById('navLinks');
    const burger = document.getElementById('burger');
    if (!nav.contains(e.target) && !burger.contains(e.target) && nav.classList.contains('nav-active')) {
        nav.classList.remove('nav-active');
        burger.classList.remove('toggle');
    }
});