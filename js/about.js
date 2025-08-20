/* ==========================================================================
   ANABEL DOG GROOMING - ABOUT PAGE INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    initTimelineAnimations();
    initValueCardsAnimations();
    initQualificationAnimations();
    initProtocolsAnimations();
    initSalonPhotosInteraction();
});

/* ==========================================================================
   TIMELINE ANIMATIONS
   ========================================================================== */

function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    timelineItems.forEach((item, index) => {
        // Initial state
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        observer.observe(item);
    });
}

/* ==========================================================================
   VALUE CARDS ANIMATIONS
   ========================================================================== */

function initValueCardsAnimations() {
    const valueCards = document.querySelectorAll('.value-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    valueCards.forEach((card, index) => {
        // Initial state
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            
            const icon = this.querySelector('.value-icon');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            
            const icon = this.querySelector('.value-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
        
        observer.observe(card);
    });
}

/* ==========================================================================
   QUALIFICATION ANIMATIONS
   ========================================================================== */

function initQualificationAnimations() {
    const qualificationCards = document.querySelectorAll('.qualification-card');
    const qualificationHighlight = document.querySelector('.qualification-highlight');
    
    // Animate qualification highlight
    if (qualificationHighlight) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('highlight-animate');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        
        observer.observe(qualificationHighlight);
    }
    
    // Animate qualification cards
    qualificationCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(card);
        
        // Hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
            this.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
    });
}

/* ==========================================================================
   PROTOCOLS ANIMATIONS
   ========================================================================== */

function initProtocolsAnimations() {
    const protocolItems = document.querySelectorAll('.protocol-item');
    
    protocolItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'scale(0.8)';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'scale(1)';
                    }, index * 80);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(item);
        
        // Interactive hover
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            
            const icon = this.querySelector('.protocol-icon');
            if (icon) {
                icon.style.transform = 'rotate(10deg) scale(1.1)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            
            const icon = this.querySelector('.protocol-icon');
            if (icon) {
                icon.style.transform = 'rotate(0deg) scale(1)';
            }
        });
    });
}

/* ==========================================================================
   SALON PHOTOS INTERACTION
   ========================================================================== */

function initSalonPhotosInteraction() {
    const salonPhotos = document.querySelectorAll('.salon-photo');
    
    salonPhotos.forEach((photo, index) => {
        // Staggered entrance
        photo.style.opacity = '0';
        photo.style.transform = 'translateY(30px)';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 120);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(photo);
        
        // Enhanced hover with caption slide
        photo.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.03)';
            
            const caption = this.querySelector('.photo-caption');
            const icon = this.querySelector('.photo-icon');
            
            if (caption) {
                caption.style.transform = 'translateY(-5px)';
                caption.style.opacity = '1';
            }
            
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(5deg)';
            }
        });
        
        photo.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            
            const caption = this.querySelector('.photo-caption');
            const icon = this.querySelector('.photo-icon');
            
            if (caption) {
                caption.style.transform = 'translateY(0)';
            }
            
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
        
        // Click to show larger view (optional)
        photo.addEventListener('click', function() {
            showPhotoDetail(this);
        });
    });
}

/* ==========================================================================
   PHOTO DETAIL MODAL (OPTIONAL)
   ========================================================================== */

function showPhotoDetail(photoElement) {
    const caption = photoElement.querySelector('.photo-caption h4').textContent;
    const description = photoElement.querySelector('.photo-caption p').textContent;
    const icon = photoElement.querySelector('.photo-icon').textContent;
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'photo-detail-modal';
    modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
            <button class="modal-close">&times;</button>
            <div class="photo-detail">
                <div class="detail-icon">${icon}</div>
                <h3>${caption}</h3>
                <p>${description}</p>
                <div class="detail-features">
                    <ul>
                        <li>Professional-grade equipment</li>
                        <li>Sanitized between each use</li>
                        <li>Designed for pet comfort</li>
                        <li>Regular maintenance and updates</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    // Style the modal
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.right = '0';
    modal.style.bottom = '0';
    modal.style.zIndex = '1000';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close functionality
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    function closeModal() {
        modal.remove();
        document.body.style.overflow = '';
    }
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    
    // Escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            closeModal();
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    
    document.addEventListener('keydown', escapeHandler);
}

/* ==========================================================================
   SCROLL PROGRESS INDICATOR
   ========================================================================== */

function initScrollProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    
    // Style the progress bar
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.width = '100%';
    progressBar.style.height = '3px';
    progressBar.style.background = 'rgba(255, 255, 255, 0.3)';
    progressBar.style.zIndex = '999';
    
    const progressFill = progressBar.querySelector('.progress-fill');
    progressFill.style.height = '100%';
    progressFill.style.background = 'var(--yellow-soft)';
    progressFill.style.width = '0%';
    progressFill.style.transition = 'width 0.1s ease';
    
    document.body.appendChild(progressBar);
    
    // Update progress on scroll
    function updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressFill.style.width = Math.min(scrollPercent, 100) + '%';
    }
    
    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial call
}

/* ==========================================================================
   FLOATING ACTION BUTTON
   ========================================================================== */

function initFloatingActionButton() {
    const fab = document.createElement('div');
    fab.className = 'floating-action-btn';
    fab.innerHTML = `
        <button class="fab-btn" title="Contact Me">
            <span class="fab-icon">💬</span>
        </button>
    `;
    
    // Style the FAB
    fab.style.position = 'fixed';
    fab.style.bottom = '30px';
    fab.style.right = '30px';
    fab.style.zIndex = '998';
    
    const fabBtn = fab.querySelector('.fab-btn');
    fabBtn.style.width = '60px';
    fabBtn.style.height = '60px';
    fabBtn.style.borderRadius = '50%';
    fabBtn.style.background = 'var(--yellow-soft)';
    fabBtn.style.border = '2px solid var(--pink-light)';
    fabBtn.style.cursor = 'pointer';
    fabBtn.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
    fabBtn.style.transition = 'all 0.3s ease';
    fabBtn.style.fontSize = '24px';
    
    document.body.appendChild(fab);
    
    // Hover effects
    fabBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 25px rgba(0,0,0,0.3)';
    });
    
    fabBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
    });
    
    // Click action
    fabBtn.addEventListener('click', function() {
        window.location.href = '/contact.html';
    });
    
    // Show/hide on scroll
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        
        if (scrollTop > lastScrollTop && scrollTop > 200) {
            // Scrolling down
            fab.style.transform = 'translateY(100px)';
        } else {
            // Scrolling up
            fab.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

/* ==========================================================================
   INITIALIZE ALL ABOUT PAGE FEATURES
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure DOM is fully rendered
    setTimeout(() => {
        initScrollProgress();
        initFloatingActionButton();
    }, 100);
    
    // Add custom animations class to timeline items
    setTimeout(() => {
        const timelineItems = document.querySelectorAll('.timeline-item.animate-in');
        timelineItems.forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'translateX(0)';
        });
    }, 200);
});
