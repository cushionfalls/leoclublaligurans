// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

document.addEventListener('DOMContentLoaded', () => {
    // 1. GSAP Preloader & Hero Timeline
    const mainTl = gsap.timeline();
    const preloader = document.getElementById('preloader');
    const hero = document.querySelector('.hero');

    if (!preloader) return;

    // Initialize Outer layer (12 petals - 30deg steps)
    for (let i = 1; i <= 12; i++) {
        gsap.set(`.p${i}`, { rotation: (i - 1) * 30, scale: 0, opacity: 0 });
    }
    // Initialize Mid layer (12 petals - 30deg steps starting at 15deg offset)
    for (let i = 1; i <= 12; i++) {
        gsap.set(`.pm${i}`, { rotation: (i - 1) * 30 + 15, scale: 0, opacity: 0 });
    }
    // Initialize Inner layer (12 petals - 30deg steps starting at 7.5deg offset)
    for (let i = 1; i <= 12; i++) {
        gsap.set(`.pi${i}`, { rotation: (i - 1) * 30 + 7.5, scale: 0, opacity: 0 });
    }

    gsap.set('.leaf', { scale: 0, opacity: 0 });
    gsap.set('.stamen', { scale: 0, opacity: 0, rotation: () => gsap.utils.random(-20, 20) });

    if (hero) {
        gsap.set('.hero .parallax-element', { opacity: 0, y: 50 });
        gsap.set('.hero-badge', { opacity: 0, scale: 0.8 });
        gsap.set('.hero h1 span', { opacity: 0, x: -20 });
    }

    gsap.set('.flower-center', { scale: 0, opacity: 0 });

    // Preloader Animation
    mainTl.to('.flower-center', {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: "back.out(1.7)"
    })
    .to('.petal, .petal-mid, .petal-inner', {
        scale: 1,
        opacity: 1,
        duration: 0.6,
        stagger: 0.02,
        ease: "back.out(1.5)"
    }, "-=0.1")
    .to('.leaf, .stamen', {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: 0.02,
        ease: "power2.out"
    }, "-=0.4")
    .to('.preloader-text', {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power3.out"
    }, "-=0.3")
    // Exit Preloader
    .to('#preloader', {
        opacity: 0,
        duration: 0.6,
        ease: "power2.inOut",
        delay: 0.2,
        onComplete: () => {
            preloader.style.visibility = 'hidden';
            preloader.style.display = 'none';
        }
    });

    if (hero) {
        mainTl.to('.hero h1', {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power4.out"
        }, "-=0.3")
        .to('.hero h1 span', {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.5")
        .to('.hero-tagline', {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out"
        }, "-=0.4")
        .to('.motto-item', {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "power2.out"
        }, "-=0.3")
        .to('.hero-buttons .btn', {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.15,
            ease: "back.out(1.5)"
        }, "-=0.3")
        .to('.scroll-indicator', {
            opacity: 1,
            duration: 0.8
        }, "-=0.2");
    }

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    if (navbar) {
        ScrollTrigger.create({
            start: 'top -100',
            onUpdate: (self) => {
                if (self.direction === 1) {
                    navbar.classList.add('scrolled');
                } else if (self.scroll() < 100) {
                    navbar.classList.remove('scrolled');
                }
            }
        });
    }

    // 3. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
            
            if (navLinks.classList.contains('active')) {
                gsap.from('.nav-links li', {
                    x: 50,
                    opacity: 0,
                    duration: 0.4,
                    stagger: 0.1,
                    ease: "power2.out"
                });
            }
        });

        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.textContent = '☰';
            });
        });
    }

    // 4. Parallax Effect with GSAP ScrollTrigger
    gsap.utils.toArray('.parallax-bg').forEach(bg => {
        gsap.to(bg, {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
                trigger: bg.parentElement,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });

    gsap.utils.toArray('.parallax-element').forEach(el => {
        const speed = el.getAttribute('data-speed') || 0.2;
        gsap.to(el, {
            y: -100 * speed,
            ease: "none",
            scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
    });



    // 6. Enhanced Scroll Reveals
    const reveals = gsap.utils.toArray('.reveal-up, .reveal-left, .reveal-right, .reveal-zoom');
    reveals.forEach(el => {
        // Set initial positions based on class
        const startX = el.classList.contains('reveal-left') ? -100 : (el.classList.contains('reveal-right') ? 100 : 0);
        const startY = el.classList.contains('reveal-up') ? 100 : 0;
        const startScale = el.classList.contains('reveal-zoom') ? 0.8 : 1;

        gsap.set(el, { x: startX, y: startY, scale: startScale, opacity: 0 });

        gsap.to(el, {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none none"
            }
        });
    });

    // Stagger containers
    gsap.utils.toArray('.stagger-container').forEach(container => {
        const children = container.querySelectorAll('.activity-card, .blog-card');
        gsap.set(children, { y: 50, opacity: 0 });
        
        gsap.to(children, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: container,
                start: "top 80%"
            }
        });
    });

    // 7. Blog Section - Responsive Animations
    const blogSection = document.querySelector('.blog');
    const blogCardsContainer = document.querySelector('.blog-cards');
    const blogProgressBar = document.querySelector('.blog-progress-bar');
    const blogCards = gsap.utils.toArray('.blog-card');

    if (blogSection && blogCardsContainer) {
        let mm = gsap.matchMedia();

        // Mobile/Tablet: Horizontal Pinning Scroll
        mm.add("(max-width: 1023px)", () => {
            const getScrollAmount = () => {
                return -(blogCardsContainer.scrollWidth - window.innerWidth);
            };

            gsap.to(blogCardsContainer, {
                x: getScrollAmount,
                ease: "none",
                scrollTrigger: {
                    trigger: blogSection,
                    start: "top top",
                    end: () => `+=${blogCardsContainer.scrollWidth}`,
                    pin: true,
                    scrub: 1,
                    invalidateOnRefresh: true,
                    onUpdate: (self) => {
                        if (blogProgressBar) {
                            gsap.to(blogProgressBar, { width: `${self.progress * 100}%`, duration: 0.1 });
                        }
                    }
                }
            });
        });

        // Desktop: Staggered Reveal Grid
        mm.add("(min-width: 1024px)", () => {
            gsap.set(blogCards, { y: 100, opacity: 0 });
            
            ScrollTrigger.batch(blogCards, {
                onEnter: batch => gsap.to(batch, { 
                    opacity: 1, 
                    y: 0, 
                    stagger: 0.15, 
                    duration: 1, 
                    ease: "power3.out",
                    overwrite: true 
                }),
                start: "top 85%"
            });
            
            // Reset x in case we resized from mobile
            gsap.set(blogCardsContainer, { x: 0 });
        });
    }

    // Refresh ScrollTrigger on resize to handle dynamic width/height
    window.addEventListener('resize', () => {
        ScrollTrigger.refresh();
    });

    // 8. Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.getElementById('navbar')?.offsetHeight || 0;
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: { y: target, offsetY: navHeight },
                    ease: "power4.inOut"
                });
            }
        });
    });


});
