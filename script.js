document.addEventListener('DOMContentLoaded', () => {
    // --- Preloader y Entrada Cinemática ---
    const preloader = document.getElementById('preloader');

    window.addEventListener('load', () => {
        setTimeout(() => {
            if (preloader) {
                preloader.classList.add('fade-out');
                document.body.classList.add('loaded');
            }
        }, 2000); // 2 segundos de impacto visual
    });

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

    // --- EFECTOS DE SCROLL AVANZADOS ---
    function handleScrollEffects() {
        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;

        // 1. Movimiento del Dron Parallax
        if (drone && parallaxSection) {
            const sectionTop = parallaxSection.offsetTop;
            const sectionHeight = parallaxSection.offsetHeight;
            const sectionVisibleStart = sectionTop - viewportHeight;
            const sectionVisibleEnd = sectionTop + sectionHeight;

            let progress = (scrollY - sectionVisibleStart) / (sectionVisibleEnd - sectionVisibleStart);
            progress = Math.min(1, Math.max(0, progress));

            const leftPosition = -20 + progress * 140;
            const rotation = (progress - 0.5) * 40; // Rotación según dirección
            const lift = Math.sin(progress * Math.PI) * 50; // Elevación curva

            drone.style.left = leftPosition + '%';
            drone.style.transform = `rotate(${rotation}deg) translateY(-${lift}px)`;
        }

        // 2. Efectos de revelado de elementos internos
        sections.forEach(section => {
            if (section.classList.contains('visible')) {
                const rect = section.getBoundingClientRect();
                const progress = 1 - (rect.bottom / (viewportHeight + rect.height));

                // Aplicar parallax suave a los títulos o imágenes internas si existen
                const title = section.querySelector('.section-title');
                if (title) {
                    title.style.transform = `translateY(${progress * 20}px)`;
                }
            }
        });
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(handleScrollEffects);
    });
    handleScrollEffects();

    // --- Animación de entrada para secciones mejorada ---
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Opcional: quitar para que solo se anime una vez
                // entry.target.classList.remove('visible');
            }
        });
    }, observerOptions);

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

    // --- Barra de progreso de lectura ---
    const progressBar = document.getElementById('progress-bar');
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = scrolled + '%';
    });

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Cerrar otros
            faqItems.forEach(i => i.classList.remove('active'));

            // Si no estaba activo, abrirlo
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Reproducir hero video si es posible
    if (heroVideo) {
        heroVideo.play().catch(() => { });
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