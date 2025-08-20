/* ==========================================================================
   ANABEL DOG GROOMING - GLOBAL JAVASCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all global functionality
    initMobileNavigation();
    initScrollHeader();
    initSmoothScrolling();
    initContactLinks();
});

/* ==========================================================================
   MOBILE NAVIGATION
   ========================================================================== */

function initMobileNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on links
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navToggle.contains(event.target) || navMenu.contains(event.target);
            
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

/* ==========================================================================
   SCROLL HEADER EFFECTS
   ========================================================================== */

function initScrollHeader() {
    const header = document.getElementById('main-header');
    
    if (header) {
        let lastScrollTop = 0;
        
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Add scrolled class when scrolling down
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        });
    }
}

/* ==========================================================================
   SMOOTH SCROLLING FOR ANCHOR LINKS
   ========================================================================== */

function initSmoothScrolling() {
    // Handle anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.getElementById('main-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==========================================================================
   CONTACT LINKS WITH SERVICE PARAMETERS
   ========================================================================== */

function initContactLinks() {
    // Handle service-specific contact links
    const serviceLinks = document.querySelectorAll('[href*="/contact"]');
    
    serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // If it contains service parameters, store them in sessionStorage
            if (href.includes('?service=')) {
                const url = new URL(href, window.location.origin);
                const service = url.searchParams.get('service');
                const size = url.searchParams.get('size');
                
                if (service) {
                    sessionStorage.setItem('selectedService', service);
                }
                
                if (size) {
                    sessionStorage.setItem('selectedSize', size);
                }
            }
        });
    });
}

/* ==========================================================================
   UTILITY FUNCTIONS
   ========================================================================== */

// Debounce function for performance optimization
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func(...args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func(...args);
    };
}

// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Animate elements on scroll
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/* ==========================================================================
   ACCESSIBILITY ENHANCEMENTS
   ========================================================================== */

// Skip link functionality
function initSkipLink() {
    const skipLink = document.querySelector('.skip-link');
    
    if (skipLink) {
        skipLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.setAttribute('tabindex', '-1');
                target.focus();
                target.addEventListener('blur', function() {
                    target.removeAttribute('tabindex');
                }, { once: true });
            }
        });
    }
}

// Keyboard navigation enhancement
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Escape key to close modals
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.active, .size-helper-modal.active');
            openModals.forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
}

/* ==========================================================================
   FORM VALIDATION HELPERS
   ========================================================================== */

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

function showFormMessage(form, message, type = 'success') {
    // Remove existing messages
    const existingMessage = form.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of the form
    form.insertBefore(messageDiv, form.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

/* ==========================================================================
   PERFORMANCE OPTIMIZATIONS
   ========================================================================== */

// Lazy load images
function initLazyLoading() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

// Preload critical resources
function preloadCriticalResources() {
    // Preload fonts
    const fontLinks = [
        'https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap'
    ];
    
    fontLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });
}

/* ==========================================================================
   ERROR HANDLING
   ========================================================================== */

// Global error handler
window.addEventListener('error', function(e) {
    console.error('Global error caught:', e.error);
    
    // Optionally send error to analytics or logging service
    // trackError(e.error);
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    
    // Prevent the default behavior (which would log to console)
    e.preventDefault();
    
    // Optionally handle the error gracefully
    // showUserFriendlyError();
});

/* ==========================================================================
   BROWSER COMPATIBILITY
   ========================================================================== */

// Polyfill for IntersectionObserver
if (!window.IntersectionObserver) {
    // Fallback behavior for scroll animations
    initScrollAnimations = function() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        function checkScroll() {
            animatedElements.forEach(element => {
                if (isInViewport(element)) {
                    element.classList.add('animated');
                }
            });
        }
        
        window.addEventListener('scroll', throttle(checkScroll, 100));
        checkScroll(); // Initial check
    };
}

// Initialize scroll animations and lazy loading when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initScrollAnimations();
    initLazyLoading();
    initSkipLink();
    initKeyboardNavigation();
    preloadCriticalResources();
});
