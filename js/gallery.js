/* ==========================================================================
   ANABEL DOG GROOMING - GALLERY PAGE INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    initBeforeAfterSliders();
    initGalleryFilters();
    initImageModal();
    initGalleryAnimations();
    initLoadMore();
});

/* ==========================================================================
   BEFORE/AFTER SLIDERS
   ========================================================================== */

function initBeforeAfterSliders() {
    const sliders = document.querySelectorAll('.before-after-container');
    
    sliders.forEach(slider => {
        const handle = slider.querySelector('.slider-handle');
        const afterImage = slider.querySelector('.after-image');
        
        if (!handle || !afterImage) return;
        
        let isDragging = false;
        let startX = 0;
        let sliderRect = null;
        
        // Set initial position (50%)
        afterImage.style.clipPath = 'inset(0 50% 0 0)';
        handle.style.left = '50%';
        
        // Mouse events
        handle.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        
        // Touch events
        handle.addEventListener('touchstart', startDrag);
        document.addEventListener('touchmove', drag);
        document.addEventListener('touchend', stopDrag);
        
        // Click to drag to position
        slider.addEventListener('click', function(e) {
            if (e.target === handle || handle.contains(e.target)) return;
            
            sliderRect = slider.getBoundingClientRect();
            const clickX = e.clientX - sliderRect.left;
            const percentage = (clickX / sliderRect.width) * 100;
            updateSliderPosition(Math.max(0, Math.min(100, percentage)));
        });
        
        function startDrag(e) {
            isDragging = true;
            sliderRect = slider.getBoundingClientRect();
            startX = e.type === 'mousedown' ? e.clientX : e.touches[0].clientX;
            handle.style.cursor = 'grabbing';
            
            // Add visual feedback
            slider.classList.add('dragging');
            
            e.preventDefault();
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            const currentX = e.type === 'mousemove' ? e.clientX : e.touches[0].clientX;
            const deltaX = currentX - startX;
            const currentLeft = parseFloat(handle.style.left) || 50;
            const deltaPercentage = (deltaX / sliderRect.width) * 100;
            const newPercentage = currentLeft + deltaPercentage;
            
            updateSliderPosition(Math.max(0, Math.min(100, newPercentage)));
            
            startX = currentX;
            e.preventDefault();
        }
        
        function stopDrag() {
            if (!isDragging) return;
            
            isDragging = false;
            handle.style.cursor = 'grab';
            slider.classList.remove('dragging');
        }
        
        function updateSliderPosition(percentage) {
            handle.style.left = percentage + '%';
            afterImage.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
        }
        
        // Keyboard accessibility
        handle.addEventListener('keydown', function(e) {
            const currentLeft = parseFloat(handle.style.left) || 50;
            let newPercentage = currentLeft;
            
            switch(e.key) {
                case 'ArrowLeft':
                    newPercentage = Math.max(0, currentLeft - 5);
                    break;
                case 'ArrowRight':
                    newPercentage = Math.min(100, currentLeft + 5);
                    break;
                case 'Home':
                    newPercentage = 0;
                    break;
                case 'End':
                    newPercentage = 100;
                    break;
                default:
                    return;
            }
            
            updateSliderPosition(newPercentage);
            e.preventDefault();
        });
        
        // Make handle focusable
        handle.setAttribute('tabindex', '0');
        handle.setAttribute('role', 'slider');
        handle.setAttribute('aria-label', 'Before and after comparison slider');
        handle.setAttribute('aria-valuemin', '0');
        handle.setAttribute('aria-valuemax', '100');
        handle.setAttribute('aria-valuenow', '50');
    });
}

/* ==========================================================================
   GALLERY FILTERING
   ========================================================================== */

function initGalleryFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter gallery items
            filterGalleryItems(filter);
            
            // Update URL for bookmarking
            if (filter !== 'all') {
                window.history.replaceState(null, null, `#${filter}`);
            } else {
                window.history.replaceState(null, null, window.location.pathname);
            }
        });
    });
    
    // Check for filter in URL hash on load
    const urlHash = window.location.hash.substring(1);
    if (urlHash && document.querySelector(`[data-filter="${urlHash}"]`)) {
        const targetButton = document.querySelector(`[data-filter="${urlHash}"]`);
        if (targetButton) {
            targetButton.click();
        }
    }
}

function filterGalleryItems(filter) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        const itemCategory = item.dataset.category;
        const shouldShow = filter === 'all' || itemCategory === filter;
        
        if (shouldShow) {
            showGalleryItem(item, index);
        } else {
            hideGalleryItem(item);
        }
    });
}

function showGalleryItem(item, index) {
    item.style.display = 'block';
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px) scale(0.95)';
    
    // Staggered animation
    setTimeout(() => {
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0) scale(1)';
    }, index * 100);
}

function hideGalleryItem(item) {
    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    item.style.opacity = '0';
    item.style.transform = 'translateY(-20px) scale(0.95)';
    
    setTimeout(() => {
        item.style.display = 'none';
    }, 300);
}

/* ==========================================================================
   IMAGE MODAL
   ========================================================================== */

function initImageModal() {
    const modal = document.getElementById('image-modal');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const closeBtn = document.getElementById('modal-close');
    const modalOverlay = modal.querySelector('.modal-overlay');
    
    // Open modal on gallery item click
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            openImageModal(this);
        });
        
        // Add keyboard support
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openImageModal(this);
            }
        });
        
        // Make items focusable
        item.setAttribute('tabindex', '0');
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', 'View larger image');
    });
    
    // Close modal events
    closeBtn.addEventListener('click', closeImageModal);
    modalOverlay.addEventListener('click', closeImageModal);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (modal.classList.contains('active')) {
            switch(e.key) {
                case 'Escape':
                    closeImageModal();
                    break;
                case 'ArrowLeft':
                    navigateModal(-1);
                    break;
                case 'ArrowRight':
                    navigateModal(1);
                    break;
            }
        }
    });
    
    function openImageModal(galleryItem) {
        const title = galleryItem.querySelector('h3').textContent;
        const serviceType = galleryItem.querySelector('.service-type').textContent;
        const description = galleryItem.querySelector('.description').textContent;
        
        // Update modal content
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-service').textContent = serviceType;
        document.getElementById('modal-description').textContent = description;
        
        // Show modal
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Initialize modal slider
        initModalSlider();
        
        // Focus management
        modal.focus();
        
        // Store current item for navigation
        modal.currentItem = galleryItem;
    }
    
    function closeImageModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to the item that opened the modal
        if (modal.currentItem) {
            modal.currentItem.focus();
        }
    }
    
    function navigateModal(direction) {
        const currentItem = modal.currentItem;
        if (!currentItem) return;
        
        const allItems = Array.from(document.querySelectorAll('.gallery-item:not([style*="display: none"])'));
        const currentIndex = allItems.indexOf(currentItem);
        const newIndex = currentIndex + direction;
        
        if (newIndex >= 0 && newIndex < allItems.length) {
            openImageModal(allItems[newIndex]);
        }
    }
    
    function initModalSlider() {
        const modalContainer = modal.querySelector('.modal-before-after');
        const modalHandle = modal.querySelector('.modal-slider-handle');
        const modalAfterImage = modal.querySelector('.modal-after-image');
        
        if (!modalHandle || !modalAfterImage) return;
        
        // Reset to 50%
        modalAfterImage.style.clipPath = 'inset(0 50% 0 0)';
        modalHandle.style.left = '50%';
        
        // Add the same slider functionality as the gallery items
        let isDragging = false;
        let startX = 0;
        let sliderRect = null;
        
        modalHandle.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
        
        function startDrag(e) {
            isDragging = true;
            sliderRect = modalContainer.getBoundingClientRect();
            startX = e.clientX;
            e.preventDefault();
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            const currentX = e.clientX;
            const deltaX = currentX - startX;
            const currentLeft = parseFloat(modalHandle.style.left) || 50;
            const deltaPercentage = (deltaX / sliderRect.width) * 100;
            const newPercentage = Math.max(0, Math.min(100, currentLeft + deltaPercentage));
            
            modalHandle.style.left = newPercentage + '%';
            modalAfterImage.style.clipPath = `inset(0 ${100 - newPercentage}% 0 0)`;
            
            startX = currentX;
            e.preventDefault();
        }
        
        function stopDrag() {
            isDragging = false;
        }
    }
}

/* ==========================================================================
   GALLERY ANIMATIONS
   ========================================================================== */

function initGalleryAnimations() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    const observerOptions = {
        threshold: 0.1,
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
    
    galleryItems.forEach((item, index) => {
        // Initial state
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        // Enhanced hover effects
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 15px 40px rgba(0,0,0,0.15)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
        
        observer.observe(item);
    });
    
    // Add animate-in styles
    const style = document.createElement('style');
    style.textContent = `
        .gallery-item.animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/* ==========================================================================
   LOAD MORE FUNCTIONALITY
   ========================================================================== */

function initLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Simulate loading more items
            this.textContent = 'Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                // Add more gallery items (in a real app, this would fetch from an API)
                addMoreGalleryItems();
                
                this.textContent = 'View More Transformations';
                this.disabled = false;
                
                // Hide button after a few loads (optional)
                const currentItems = document.querySelectorAll('.gallery-item').length;
                if (currentItems >= 16) {
                    this.style.display = 'none';
                    document.querySelector('.load-more-text').textContent = 'You\'ve seen all our amazing transformations!';
                }
            }, 1500);
        });
    }
}

function addMoreGalleryItems() {
    const galleryGrid = document.querySelector('.gallery-grid');
    const moreItems = [
        {
            category: 'full-groom',
            breed: 'Cocker Spaniel',
            name: 'Honey the Cocker Spaniel',
            service: 'Full Groom',
            description: 'Beautiful breed-specific cut with feathering and perfect proportions.',
            duration: '2.5 hours',
            size: 'Medium',
            beforeIcon: '🐕',
            afterIcon: '🌸'
        },
        {
            category: 'bath-brush',
            breed: 'German Shepherd',
            name: 'Rex the German Shepherd',
            service: 'Bath & Brush',
            description: 'Deep cleaning and thorough brushing for this handsome working dog.',
            duration: '2 hours',
            size: 'Extra Large',
            beforeIcon: '🐕‍🦺',
            afterIcon: '⚡'
        }
    ];
    
    moreItems.forEach((itemData, index) => {
        const newItem = createGalleryItem(itemData);
        galleryGrid.appendChild(newItem);
        
        // Animate in the new item
        setTimeout(() => {
            newItem.style.opacity = '1';
            newItem.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Reinitialize sliders for new items
    initBeforeAfterSliders();
}

function createGalleryItem(data) {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.dataset.category = data.category;
    item.dataset.breed = data.breed;
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    item.innerHTML = `
        <div class="gallery-card">
            <div class="before-after-container">
                <div class="before-image">
                    <div class="placeholder-image">
                        <div class="image-icon">${data.beforeIcon}</div>
                        <span class="image-label">Before</span>
                    </div>
                </div>
                <div class="after-image">
                    <div class="placeholder-image after">
                        <div class="image-icon">${data.afterIcon}</div>
                        <span class="image-label">After</span>
                    </div>
                </div>
                <div class="slider-handle">
                    <div class="handle-icon">⟷</div>
                </div>
            </div>
            <div class="gallery-info">
                <h3>${data.name}</h3>
                <p class="service-type">${data.service}</p>
                <p class="description">${data.description}</p>
                <div class="gallery-meta">
                    <span class="duration">⏱️ ${data.duration}</span>
                    <span class="size">🐕 ${data.size}</span>
                </div>
            </div>
        </div>
    `;
    
    return item;
}

/* ==========================================================================
   GALLERY SEARCH (OPTIONAL ENHANCEMENT)
   ========================================================================== */

function initGallerySearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search by breed or name...';
    searchInput.className = 'gallery-search';
    
    const filtersSection = document.querySelector('.gallery-filters .container');
    filtersSection.appendChild(searchInput);
    
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            searchGallery(this.value.toLowerCase());
        }, 300);
    });
}

function searchGallery(searchTerm) {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        const name = item.querySelector('h3').textContent.toLowerCase();
        const breed = item.dataset.breed.toLowerCase();
        const description = item.querySelector('.description').textContent.toLowerCase();
        
        const matches = name.includes(searchTerm) || 
                       breed.includes(searchTerm) || 
                       description.includes(searchTerm);
        
        if (matches) {
            showGalleryItem(item, 0);
        } else {
            hideGalleryItem(item);
        }
    });
}

/* ==========================================================================
   INITIALIZE ALL GALLERY FEATURES
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Optional enhancements
    // initGallerySearch(); // Uncomment to add search functionality
    
    // Scroll to gallery if coming from another page
    if (window.location.hash && window.location.hash.includes('gallery')) {
        setTimeout(() => {
            document.querySelector('.gallery-grid-section').scrollIntoView({
                behavior: 'smooth'
            });
        }, 500);
    }
});
