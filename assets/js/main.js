document.addEventListener('DOMContentLoaded', () => {

    /* ── Dark Mode (FAB) ── */
    const html = document.documentElement;
    const fabTheme = document.getElementById('fabTheme');
    const fabToggle = document.getElementById('fabToggle');
    const fabWidget = document.getElementById('fabWidget');
    const fabMenu = document.getElementById('fabMenu');

    function updateFabThemeIcons() {
        const isDark = html.classList.contains('dark');
        document.querySelectorAll('.fab-icon-moon').forEach(el => el.classList.toggle('hidden', !isDark));
        document.querySelectorAll('.fab-icon-sun').forEach(el => el.classList.toggle('hidden', isDark));
    }

    function setTheme(dark) {
        html.classList.toggle('dark', dark);
        localStorage.setItem('theme', dark ? 'dark' : 'light');
        updateFabThemeIcons();
    }

    fabTheme?.addEventListener('click', () => {
        setTheme(!html.classList.contains('dark'));
        closeFab();
    });
    updateFabThemeIcons();

    function closeFab() {
        fabWidget?.classList.remove('open');
        fabToggle?.setAttribute('aria-expanded', 'false');
        fabMenu?.setAttribute('aria-hidden', 'true');
    }

    fabToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        fabRipple(fabToggle, e);
        const isOpen = fabWidget?.classList.toggle('open');
        fabToggle?.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        fabMenu?.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    });

    document.addEventListener('click', (e) => {
        if (fabWidget?.classList.contains('open') && !fabWidget.contains(e.target)) {
            closeFab();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeFab();
    });

    /* ── FAB 3D tilt + ripple ── */
    function bindFab3DTilt(el) {
        const face = el.querySelector('.fab-3d-face, .fab-child-face, .wa-3d-face');
        if (!face) return;

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            const rotY = x * 14;
            const rotX = -y * 14;
            if (el.classList.contains('fab-main') && fabWidget?.classList.contains('open')) return;
            face.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.06) translateZ(6px)`;
        });

        el.addEventListener('mouseleave', () => {
            if (el.classList.contains('fab-main') && fabWidget?.classList.contains('open')) {
                face.style.transform = 'rotateZ(90deg)';
            } else {
                face.style.transform = '';
            }
        });
    }

    function fabRipple(el, e) {
        const rect = el.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.className = 'fab-ripple';
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        el.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    }

    document.querySelectorAll('.fab-3d-tilt').forEach(bindFab3DTilt);

    document.querySelector('.floating-wa-btn')?.addEventListener('click', (e) => {
        fabRipple(e.currentTarget, e);
    });

    /* ── Mobile Menu ── */
    const menuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    menuBtn?.addEventListener('click', () => mobileMenu?.classList.toggle('hidden'));

    /* ── Navbar scroll ── */
    const nav = document.getElementById('mainNav');
    if (nav) {
        const onScroll = () => {
            const scrolled = window.scrollY > 50;
            nav.classList.toggle('shadow-lg', scrolled);
            nav.classList.toggle('glass-nav-scrolled', scrolled);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();
    }

    /* ── Scroll Reveal ── */
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .animate-on-scroll');
    const revealObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible', 'fade-in');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObs.observe(el));

    /* Hero text immediate reveal */
    document.querySelectorAll('.hero-text .reveal-up').forEach((el, i) => {
        setTimeout(() => el.classList.add('visible'), 200 + i * 150);
    });
    document.querySelectorAll('.perspective-container.reveal-up').forEach(el => {
        setTimeout(() => el.classList.add('visible'), 700);
    });

    /* ── Animated Counters ── */
    function animateCounter(el) {
        const target = parseInt(el.dataset.target, 10) || 0;
        const duration = 1800;
        const start = performance.now();
        const suffix = el.dataset.suffix || '';

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.floor(eased * target).toLocaleString() + suffix;
            if (progress < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString() + suffix;
        }
        requestAnimationFrame(step);
    }

    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    document.querySelectorAll('.counter').forEach(el => counterObs.observe(el));

    /* ── 3D Tilt – Hero Card ── */
    const hero3d = document.getElementById('hero3dCard');
    if (hero3d) {
        const inner = hero3d.querySelector('.tilt-card-inner');
        const img = hero3d.querySelector('.hero-dental-img');
        const baseTilt = 'rotateY(-8deg) rotateX(5deg)';

        hero3d.addEventListener('mousemove', (e) => {
            const rect = hero3d.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            if (inner) inner.style.transform = `rotateY(${x * 22}deg) rotateX(${-y * 22}deg)`;
            if (img) img.style.transform = `scale(1.05) translateY(${-y * 8}px)`;
        });
        hero3d.addEventListener('mouseleave', () => {
            if (inner) inner.style.transform = baseTilt;
            if (img) img.style.transform = '';
        });
    }

    /* ── 3D Tilt – Generic cards ── */
    document.querySelectorAll('.tilt-hover').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    /* ── Parallax hero bg ── */
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scroll = window.scrollY;
            if (scroll < window.innerHeight) {
                heroBg.style.transform = `scale(1.05) translateY(${scroll * 0.35}px)`;
            }
        }, { passive: true });
    }

    /* ── Hero Particles ── */
    const canvas = document.getElementById('heroParticles');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animId;

        function resize() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        }

        function initParticles() {
            particles = Array.from({ length: 60 }, () => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                r: Math.random() * 2 + 0.5,
                dx: (Math.random() - 0.5) * 0.4,
                dy: (Math.random() - 0.5) * 0.4,
                opacity: Math.random() * 0.5 + 0.2,
            }));
        }

        function drawParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
                ctx.fill();
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;
            });
            animId = requestAnimationFrame(drawParticles);
        }

        resize();
        initParticles();
        drawParticles();
        window.addEventListener('resize', () => { resize(); initParticles(); });
    }

    /* ── Mobile menu accordion ── */
    document.querySelectorAll('.mobile-nav-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            const icon = btn.querySelector('svg');
            const isOpen = !target?.classList.contains('hidden');
            document.querySelectorAll('[id^="mob-"]').forEach(el => el.classList.add('hidden'));
            document.querySelectorAll('.mobile-nav-toggle svg').forEach(s => s.classList.remove('rotate-180'));
            if (!isOpen) {
                target?.classList.remove('hidden');
                icon?.classList.add('rotate-180');
            }
        });
    });

    /* ── Desktop nav dropdowns (click for touch) ── */
    document.querySelectorAll('.nav-dropdown').forEach(drop => {
        const btn = drop.querySelector('.nav-dropdown-btn');
        btn?.addEventListener('click', (e) => {
            e.stopPropagation();
            const wasOpen = drop.classList.contains('open');
            document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
            if (!wasOpen) drop.classList.add('open');
        });
    });
    document.addEventListener('click', () => {
        document.querySelectorAll('.nav-dropdown.open').forEach(d => d.classList.remove('open'));
    });

    /* ── FAQ accordion ── */
    document.querySelectorAll('.faq-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const wasOpen = item?.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(el => el.classList.remove('open'));
            if (!wasOpen) item?.classList.add('open');
        });
    });

    /* ── Gallery lightbox ── */
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (!img) return;
            const lb = document.createElement('div');
            lb.className = 'lightbox';
            lb.innerHTML = `<img src="${img.src}" alt="">`;
            lb.addEventListener('click', () => lb.remove());
            document.body.appendChild(lb);
        });
    });

    /* ── Appointment date min ── */
    const dateInput = document.getElementById('preferred_date');
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

    /* ── Form validation ── */
    document.querySelectorAll('form[data-validate]').forEach(form => {
        form.addEventListener('submit', (e) => {
            let valid = true;
            form.querySelectorAll('[required]').forEach(field => {
                if (!field.value.trim()) { valid = false; field.classList.add('border-red-500'); }
                else field.classList.remove('border-red-500');
            });
            if (!valid) e.preventDefault();
        });
    });
});
