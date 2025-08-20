/* ==========================================================================
   ANABEL DOG GROOMING - SERVICES PAGE INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    initSizeHelperModal();
    initPricePillInteractions();
    initServiceScrollAnimations();
    initAddonCards();
});

/* ==========================================================================
   SIZE HELPER MODAL
   ========================================================================== */

function initSizeHelperModal() {
    const modal = document.getElementById('size-helper-modal');
    const openBtn = document.getElementById('size-helper-btn');
    const closeBtn = document.getElementById('modal-close');
    const closeModalBtn = document.getElementById('close-modal');
    const selectSizeBtn = document.getElementById('select-size');
    const sizeCategories = document.querySelectorAll('.size-category');
    
    let selectedSize = null;
    
    if (!modal || !openBtn) return;
    
    // Open modal
    openBtn.addEventListener('click', function() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        modal.focus();
    });
    
    // Close modal functions
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        openBtn.focus(); // Return focus to trigger
    }
    
    // Close button events
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Close on overlay click
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
    
    // Size selection
    sizeCategories.forEach(category => {
        category.addEventListener('click', function() {
            // Remove previous selection
            sizeCategories.forEach(cat => cat.classList.remove('selected'));
            
            // Add selection to current
            this.classList.add('selected');
            selectedSize = this.dataset.size;
            
            // Enable select button
            if (selectSizeBtn) {
                selectSizeBtn.disabled = false;
                selectSizeBtn.textContent = `Select ${this.querySelector('h4').textContent}`;
            }
        });
    });
    
    // Select size action
    if (selectSizeBtn) {
        selectSizeBtn.addEventListener('click', function() {
            if (selectedSize) {
                // Store selected size
                sessionStorage.setItem('selectedSize', selectedSize);
                
                // Highlight corresponding price pills
                highlightPricePills(selectedSize);
                
                // Close modal
                closeModal();
                
                // Scroll to first service section
                const firstService = document.getElementById('bath-brush');
                if (firstService) {
                    firstService.scrollIntoView({ behavior: 'smooth' });
                }
                
                // Show confirmation message
                showSizeSelection(selectedSize);
            }
        });
    }
}

/* ==========================================================================
   PRICE PILL INTERACTIONS
   ========================================================================== */

function initPricePillInteractions() {
    const pricePills = document.querySelectorAll('.price-pill');
    
    pricePills.forEach(pill => {
        // Click to select size and update contact links
        pill.addEventListener('click', function() {
            const size = this.dataset.size;
            const serviceSection = this.closest('.service-section');
            const serviceId = serviceSection ? serviceSection.id : '';
            
            // Store selected size and service
            sessionStorage.setItem('selectedSize', size);
            sessionStorage.setItem('selectedService', serviceId);
            
            // Update contact link in this section
            const contactLink = serviceSection.querySelector('.service-cta .btn');
            if (contactLink) {
                const currentHref = contactLink.getAttribute('href');
                const url = new URL(currentHref, window.location.origin);
                url.searchParams.set('size', size);
                contactLink.setAttribute('href', url.toString());
            }
            
            // Visual feedback
            const allPillsInSection = serviceSection.querySelectorAll('.price-pill');
            allPillsInSection.forEach(p => p.classList.remove('selected'));
            this.classList.add('selected');
            
            // Animate selection
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
        
        // Enhanced hover effects
        pill.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        pill.addEventListener('mouseleave', function() {
            if (!this.classList.contains('selected')) {
                this.style.transform = '';
            }
        });
    });
    
    // Check for pre-selected size from session storage
    const preSelectedSize = sessionStorage.getItem('selectedSize');
    if (preSelectedSize) {
        highlightPricePills(preSelectedSize);
    }
}

function highlightPricePills(size) {
    const pillsOfSize = document.querySelectorAll(`.price-pill[data-size="${size}"]`);
    
    pillsOfSize.forEach(pill => {
        pill.classList.add('highlighted');
        
        // Remove highlight after animation
        setTimeout(() => {
            pill.classList.remove('highlighted');
        }, 2000);
    });
}

function showSizeSelection(size) {
    const sizeNames = {
        'small': 'Small Dogs',
        'medium': 'Medium Dogs', 
        'large': 'Large Dogs',
        'xlarge': 'Extra Large Dogs'
    };
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = 'size-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">✓</span>
            <span>Selected: ${sizeNames[size]}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

/* ==========================================================================
   SERVICE SCROLL ANIMATIONS
   ========================================================================== */

function initServiceScrollAnimations() {
    const serviceSections = document.querySelectorAll('.service-section');
    
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const serviceContent = entry.target.querySelector('.service-content');
                const pricingSection = entry.target.querySelector('.pricing-section');
                
                // Animate service description
                if (serviceContent) {
                    serviceContent.style.opacity = '0';
                    serviceContent.style.transform = 'translateX(-30px)';
                    
                    setTimeout(() => {
                        serviceContent.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        serviceContent.style.opacity = '1';
                        serviceContent.style.transform = 'translateX(0)';
                    }, 100);
                }
                
                // Animate pricing section
                if (pricingSection) {
                    pricingSection.style.opacity = '0';
                    pricingSection.style.transform = 'translateX(30px)';
                    
                    setTimeout(() => {
                        pricingSection.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                        pricingSection.style.opacity = '1';
                        pricingSection.style.transform = 'translateX(0)';
                    }, 300);
                }
                
                // Animate price pills with stagger
                const pricePills = entry.target.querySelectorAll('.price-pill');
                pricePills.forEach((pill, index) => {
                    pill.style.opacity = '0';
                    pill.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        pill.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        pill.style.opacity = '1';
                        pill.style.transform = 'translateY(0)';
                    }, 500 + (index * 100));
                });
                
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    serviceSections.forEach(section => {
        observer.observe(section);
    });
}

/* ==========================================================================
   ADD-ON CARDS
   ========================================================================== */

function initAddonCards() {
    const addonCards = document.querySelectorAll('.addon-card');
    
    addonCards.forEach((card, index) => {
        // Staggered entrance animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
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
        
        // Interactive hover effects
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
   SMOOTH SCROLL TO SERVICES
   ========================================================================== */

function initServiceNavigation() {
    // Handle clicks on service links from other pages
    const serviceLinks = document.querySelectorAll('a[href*="#"]');
    
    serviceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            const targetId = href.split('#')[1];
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                e.preventDefault();
                
                const headerHeight = document.getElementById('main-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Highlight the service section
                targetElement.classList.add('highlighted-section');
                setTimeout(() => {
                    targetElement.classList.remove('highlighted-section');
                }, 3000);
            }
        });
    });
}

/* ==========================================================================
   SERVICE COMPARISON TOOL
   ========================================================================== */

function initServiceComparison() {
    // Create comparison floating widget
    const comparisonWidget = document.createElement('div');
    comparisonWidget.className = 'service-comparison-widget';
    comparisonWidget.innerHTML = `
        <div class="widget-header">
            <h4>Compare Services</h4>
            <button class="widget-close">&times;</button>
        </div>
        <div class="widget-content">
            <div class="comparison-services">
                <div class="service-compare" data-service="bath-brush">
                    <input type="checkbox" id="compare-bath">
                    <label for="compare-bath">Bath & Brush</label>
                </div>
                <div class="service-compare" data-service="full-groom">
                    <input type="checkbox" id="compare-full">
                    <label for="compare-full">Full Groom</label>
                </div>
                <div class="service-compare" data-service="puppy-groom">
                    <input type="checkbox" id="compare-puppy">
                    <label for="compare-puppy">Puppy Groom</label>
                </div>
            </div>
            <button class="btn btn-sm btn-primary" id="show-comparison">Compare Selected</button>
        </div>
    `;
    
    // Position widget (optional feature)
    comparisonWidget.style.position = 'fixed';
    comparisonWidget.style.bottom = '20px';
    comparisonWidget.style.right = '20px';
    comparisonWidget.style.background = 'white';
    comparisonWidget.style.padding = '15px';
    comparisonWidget.style.borderRadius = '10px';
    comparisonWidget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
    comparisonWidget.style.zIndex = '1000';
    comparisonWidget.style.display = 'none';
    
    document.body.appendChild(comparisonWidget);
    
    // Show widget after scrolling to services
    let hasShownWidget = false;
    window.addEventListener('scroll', function() {
        const firstService = document.getElementById('bath-brush');
        if (firstService && !hasShownWidget) {
            const rect = firstService.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                comparisonWidget.style.display = 'block';
                hasShownWidget = true;
            }
        }
    });
}

/* ==========================================================================
   PRICING CALCULATOR
   ========================================================================== */

function initPricingCalculator() {
    // Simple pricing calculator for add-ons
    const pricePills = document.querySelectorAll('.price-pill');
    
    pricePills.forEach(pill => {
        pill.addEventListener('click', function() {
            const basePrice = parseInt(this.querySelector('.price-amount').textContent.replace('£', ''));
            const size = this.dataset.size;
            
            // Show add-on calculator
            showAddonCalculator(basePrice, size);
        });
    });
}

function showAddonCalculator(basePrice, size) {
    // Create floating calculator
    const calculator = document.createElement('div');
    calculator.className = 'pricing-calculator';
    calculator.innerHTML = `
        <div class="calculator-content">
            <h4>Price Calculator</h4>
            <div class="base-price">
                Base Price (${size}): £${basePrice}
            </div>
            <div class="addon-options">
                <label>
                    <input type="checkbox" data-price="5"> Teeth Cleaning (+£5)
                </label>
                <label>
                    <input type="checkbox" data-price="8"> Flea Treatment (+£8)
                </label>
                <label>
                    <input type="checkbox" data-price="10"> De-shedding (+£10)
                </label>
                <label>
                    <input type="checkbox" data-price="6"> Nail Painting (+£6)
                </label>
            </div>
            <div class="total-price">
                Total: £<span id="total-amount">${basePrice}</span>
            </div>
            <button class="btn btn-primary btn-sm" id="book-with-addons">Book This Service</button>
            <button class="btn btn-outline btn-sm" id="close-calculator">Close</button>
        </div>
    `;
    
    // Position and style
    calculator.style.position = 'fixed';
    calculator.style.top = '50%';
    calculator.style.left = '50%';
    calculator.style.transform = 'translate(-50%, -50%)';
    calculator.style.background = 'white';
    calculator.style.padding = '20px';
    calculator.style.borderRadius = '12px';
    calculator.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';
    calculator.style.zIndex = '1001';
    calculator.style.minWidth = '300px';
    
    document.body.appendChild(calculator);
    
    // Calculator logic
    const addonCheckboxes = calculator.querySelectorAll('input[type="checkbox"]');
    const totalElement = calculator.querySelector('#total-amount');
    
    addonCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            let total = basePrice;
            
            addonCheckboxes.forEach(cb => {
                if (cb.checked) {
                    total += parseInt(cb.dataset.price);
                }
            });
            
            totalElement.textContent = total;
        });
    });
    
    // Close calculator
    calculator.querySelector('#close-calculator').addEventListener('click', function() {
        calculator.remove();
    });
}

/* ==========================================================================
   INITIALIZE ALL SERVICE PAGE FEATURES
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure DOM is fully rendered
    setTimeout(() => {
        initServiceNavigation();
        initPricingCalculator();
        // initServiceComparison(); // Optional feature
    }, 100);
    
    // Handle direct links to service sections
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
            setTimeout(() => {
                const headerHeight = document.getElementById('main-header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }, 500);
        }
    }
});
