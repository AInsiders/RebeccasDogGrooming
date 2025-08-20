/* ==========================================================================
   ANABEL DOG GROOMING - HOMEPAGE INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    initTestimonialCarousel();
    initServiceCardAnimations();
    initScrollRevealAnimations();
});

/* ==========================================================================
   TESTIMONIAL CAROUSEL
   ========================================================================== */

function initTestimonialCarousel() {
    const carousel = document.querySelector('.testimonial-carousel');
    const slides = document.querySelectorAll('.testimonial-slide');
    const navButtons = document.querySelectorAll('.carousel-btn');
    
    if (!carousel || slides.length === 0) return;
    
    let currentSlide = 0;
    let autoPlayInterval;
    
    // Show specific slide
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.classList.remove('active');
        });
        
        // Remove active from all nav buttons
        navButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Show current slide
        if (slides[index]) {
            slides[index].classList.add('active');
        }
        
        // Activate corresponding nav button
        if (navButtons[index]) {
            navButtons[index].classList.add('active');
        }
        
        currentSlide = index;
    }
    
    // Next slide
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    // Previous slide
    function prevSlide() {
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev);
    }
    
    // Auto-play functionality
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    // Navigation button event listeners
    navButtons.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            showSlide(index);
            stopAutoPlay();
            startAutoPlay(); // Restart auto-play
        });
    });
    
    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                prevSlide();
                stopAutoPlay();
                startAutoPlay();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextSlide();
                stopAutoPlay();
                startAutoPlay();
                break;
        }
    });
    
    // Touch/swipe support
    let startX = 0;
    let endX = 0;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoPlay();
    });
    
    carousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        
        startAutoPlay();
    });
    
    // Pause auto-play on hover
    carousel.addEventListener('mouseenter', stopAutoPlay);
    carousel.addEventListener('mouseleave', startAutoPlay);
    
    // Pause auto-play when page is not visible
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoPlay();
        } else {
            startAutoPlay();
        }
    });
    
    // Initialize
    showSlide(0);
    startAutoPlay();
}

/* ==========================================================================
   SERVICE CARD ANIMATIONS
   ========================================================================== */

function initServiceCardAnimations() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach((card, index) => {
        // Staggered entrance animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        // Animate in when visible
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150); // Stagger delay
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2
        });
        
        observer.observe(card);
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

/* ==========================================================================
   SCROLL REVEAL ANIMATIONS
   ========================================================================== */

function initScrollRevealAnimations() {
    const animatedElements = document.querySelectorAll('.feature, .testimonial-carousel, .location-card, .hours-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        observer.observe(element);
    });
}

/* ==========================================================================
   HERO TEXT ANIMATION
   ========================================================================== */

function initHeroTextAnimation() {
    const heroPanel = document.querySelector('.hero-text-panel');
    
    if (heroPanel) {
        // Initial state
        heroPanel.style.opacity = '0';
        heroPanel.style.transform = 'translateY(50px) scale(0.95)';
        
        // Animate in after a short delay
        setTimeout(() => {
            heroPanel.style.transition = 'opacity 1s ease, transform 1s ease';
            heroPanel.style.opacity = '1';
            heroPanel.style.transform = 'translateY(0) scale(1)';
        }, 500);
    }
}

/* ==========================================================================
   FLOATING ELEMENTS ANIMATION
   ========================================================================== */

function initFloatingElements() {
    const floatingElements = document.querySelectorAll('.feature-icon, .paw-icon');
    
    floatingElements.forEach((element, index) => {
        // Random floating animation
        const animationDelay = index * 0.5;
        const animationDuration = 3 + Math.random() * 2; // 3-5 seconds
        
        element.style.animation = `float ${animationDuration}s ease-in-out ${animationDelay}s infinite`;
    });
}

/* ==========================================================================
   PARALLAX SCROLLING EFFECT
   ========================================================================== */

function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.hero-3d-canvas');
    
    if (parallaxElements.length === 0) return;
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Throttle scroll events for performance
    let ticking = false;
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }
    
    function handleScroll() {
        ticking = false;
        requestTick();
    }
    
    window.addEventListener('scroll', handleScroll);
}

/* ==========================================================================
   INTERACTIVE STATISTICS COUNTER
   ========================================================================== */

function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const targetNumber = parseInt(stat.textContent);
        const duration = 2000; // 2 seconds
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateNumber(entry.target, 0, targetNumber, duration);
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(stat);
    });
}

function animateNumber(element, start, end, duration) {
    const startTime = Date.now();
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        const current = Math.floor(start + (end - start) * easedProgress);
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end;
        }
    }
    
    update();
}

/* ==========================================================================
   HERO CTA BUTTON EFFECTS
   ========================================================================== */

function initHeroCTAEffects() {
    const ctaButtons = document.querySelectorAll('.hero-buttons .btn');
    
    ctaButtons.forEach(button => {
        // Ripple effect on click
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
        
        // Magnetic effect on hover (subtle)
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) translateY(-2px)`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0)';
        });
    });
}

/* ==========================================================================
   SECTION BACKGROUND ANIMATIONS
   ========================================================================== */

function initSectionBackgrounds() {
    // Add subtle animated background to sections
    const sections = document.querySelectorAll('.why-choose-us, .testimonials');
    
    sections.forEach(section => {
        // Create floating paw prints
        createFloatingPawPrints(section);
    });
}

function createFloatingPawPrints(container) {
    const pawPrints = ['🐾', '🐕', '🦴'];
    
    for (let i = 0; i < 5; i++) {
        const pawPrint = document.createElement('div');
        pawPrint.className = 'floating-decoration';
        pawPrint.textContent = pawPrints[Math.floor(Math.random() * pawPrints.length)];
        
        // Random positioning
        pawPrint.style.left = Math.random() * 100 + '%';
        pawPrint.style.top = Math.random() * 100 + '%';
        pawPrint.style.fontSize = (Math.random() * 20 + 20) + 'px';
        pawPrint.style.opacity = '0.1';
        pawPrint.style.position = 'absolute';
        pawPrint.style.pointerEvents = 'none';
        pawPrint.style.animation = `floatAround ${10 + Math.random() * 10}s ease-in-out infinite`;
        pawPrint.style.animationDelay = Math.random() * 5 + 's';
        
        container.style.position = 'relative';
        container.appendChild(pawPrint);
    }
}

/* ==========================================================================
   INITIALIZE ALL HOMEPAGE ANIMATIONS
   ========================================================================== */

// Initialize additional animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all elements are rendered
    setTimeout(() => {
        initHeroTextAnimation();
        initFloatingElements();
        initParallaxEffect();
        initStatCounters();
        initHeroCTAEffects();
        initSectionBackgrounds();
    }, 100);
});

/* ==========================================================================
   CSS ANIMATIONS (to be added to CSS file)
   ========================================================================== */

// Add this CSS to pages.css:
/*
@keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
}

@keyframes floatAround {
    0%, 100% { transform: translate(0, 0) rotate(0deg); }
    25% { transform: translate(20px, -20px) rotate(90deg); }
    50% { transform: translate(0, -40px) rotate(180deg); }
    75% { transform: translate(-20px, -20px) rotate(270deg); }
}

.fade-in-up {
    opacity: 1 !important;
    transform: translateY(0) !important;
}

.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
*/
