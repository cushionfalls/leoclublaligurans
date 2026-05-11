document.addEventListener('DOMContentLoaded', () => {
    // 1. Preloader Handling
    const preloader = document.getElementById('preloader');
    
    // Minimum display time for preloader to ensure animation finishes
    const minPreloaderTime = 3500; 
    const startTime = Date.now();

    const startApp = () => {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, minPreloaderTime - elapsedTime);

        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.visibility = 'hidden';
                // Trigger hero animations after preloader
                document.querySelectorAll('.hero .parallax-element').forEach((el, index) => {
                    setTimeout(() => {
                        el.style.opacity = '1';
                        el.style.transform = 'translateY(0)';
                    }, index * 200);
                });
            }, 1000);
        }, remainingTime);
    };

    if (document.readyState === 'complete') {
        startApp();
    } else {
        window.addEventListener('load', startApp);
    }

    // 2. Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.textContent = '☰';
        });
    });

    // 4. Parallax Effect Logic
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        // Background Parallax
        const parallaxBgs = document.querySelectorAll('.parallax-bg');
        parallaxBgs.forEach(bg => {
            const speed = 0.5;
            bg.style.transform = `translateY(${scrolled * speed}px)`;
        });

        // Individual Element Parallax
        const parallaxElements = document.querySelectorAll('.parallax-element');
        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-speed') || 0.2;
            const yPos = -(scrolled * speed);
            // Check if element is in viewport to optimize
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.style.transform = `translateY(${yPos}px)`;
            }
        });
    });

    // 5. 3D Parallax for Cards
    const cards = document.querySelectorAll('[data-parallax-3d]');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-15px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
        });
    });

    // 6. Intersection Observer for Fade-in Animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Once visible, we can stop observing
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // 7. Smooth Scroll for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
