/* ==========================================================================
   ANABEL DOG GROOMING - 404 ERROR PAGE INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    init404Animations();
    initSearchFunctionality();
    initNavigationCards();
    initErrorPageFeatures();
});

/* ==========================================================================
   404 PAGE ANIMATIONS
   ========================================================================== */

function init404Animations() {
    // Animate the confused dog
    animateConfusedDog();
    
    // Animate error content entrance
    animateErrorContent();
    
    // Animate navigation cards
    animateNavigationCards();
    
    // Animate tips cards
    animateTipsCards();
}

function animateConfusedDog() {
    const confusedDog = document.querySelector('.confused-dog');
    if (!confusedDog) return;
    
    const dogBody = confusedDog.querySelector('.dog-body');
    const leash = confusedDog.querySelector('.leash');
    const questionMarks = confusedDog.querySelectorAll('.question');
    
    // Initial state
    confusedDog.style.opacity = '0';
    confusedDog.style.transform = 'scale(0.8)';
    
    // Animate dog entrance
    setTimeout(() => {
        confusedDog.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        confusedDog.style.opacity = '1';
        confusedDog.style.transform = 'scale(1)';
    }, 200);
    
    // Wiggle animation for dog body
    if (dogBody) {
        setInterval(() => {
            dogBody.style.transform = 'rotate(-5deg)';
            setTimeout(() => {
                dogBody.style.transform = 'rotate(5deg)';
                setTimeout(() => {
                    dogBody.style.transform = 'rotate(0deg)';
                }, 150);
            }, 150);
        }, 3000);
    }
    
    // Floating animation for question marks
    questionMarks.forEach((mark, index) => {
        mark.style.animationDelay = `${index * 0.5}s`;
        mark.style.animation = 'floatQuestion 2s ease-in-out infinite';
    });
    
    // Leash swing animation
    if (leash) {
        leash.style.animation = 'swingLeash 3s ease-in-out infinite';
    }
}

function animateErrorContent() {
    const errorCode = document.querySelector('.error-code');
    const errorTitle = document.querySelector('.error-title');
    const errorDescription = document.querySelector('.error-description');
    const errorActions = document.querySelector('.error-actions');
    
    const elements = [errorCode, errorTitle, errorDescription, errorActions];
    
    elements.forEach((element, index) => {
        if (!element) return;
        
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 500 + (index * 200));
    });
}

function animateNavigationCards() {
    const navCards = document.querySelectorAll('.nav-card');
    
    navCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 1000 + (index * 100));
        
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            this.querySelector('.nav-icon').style.transform = 'scale(1.2) rotate(5deg)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.querySelector('.nav-icon').style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

function animateTipsCards() {
    const tipCards = document.querySelectorAll('.tip-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = Array.from(tipCards).indexOf(entry.target);
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 150);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    tipCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        
        observer.observe(card);
    });
}

/* ==========================================================================
   SEARCH FUNCTIONALITY
   ========================================================================== */

function initSearchFunctionality() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    const searchTags = document.querySelectorAll('.search-tag');
    
    if (!searchInput || !searchBtn) return;
    
    // Search button click
    searchBtn.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    // Enter key in search input
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(this.value);
        }
    });
    
    // Search tag clicks
    searchTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const searchTerm = this.dataset.search;
            searchInput.value = searchTerm;
            performSearch(searchTerm);
        });
    });
}

function performSearch(query) {
    if (!query.trim()) {
        showSearchMessage('Please enter a search term', 'warning');
        return;
    }
    
    // Simple search logic - in a real app, this would search your content
    const searchResults = getSearchResults(query.toLowerCase());
    
    if (searchResults.length > 0) {
        // Redirect to the most relevant result
        window.location.href = searchResults[0].url;
    } else {
        showSearchMessage('No results found. Try browsing our sections above or contact us for help.', 'info');
    }
}

function getSearchResults(query) {
    const searchData = [
        { keywords: ['price', 'cost', 'money', 'fee', 'pricing'], url: '/services.html' },
        { keywords: ['puppy', 'young', 'baby', 'first'], url: '/services.html#puppy-groom' },
        { keywords: ['nail', 'claw', 'trim', 'cut'], url: '/services.html' },
        { keywords: ['book', 'appointment', 'schedule', 'contact'], url: '/contact.html' },
        { keywords: ['about', 'qualified', 'experience', 'anabel'], url: '/about.html' },
        { keywords: ['gallery', 'photo', 'picture', 'before', 'after'], url: '/gallery.html' },
        { keywords: ['question', 'faq', 'help', 'policy'], url: '/faq.html' },
        { keywords: ['bath', 'wash', 'clean', 'brush'], url: '/services.html#bath-brush' },
        { keywords: ['full', 'complete', 'groom', 'haircut', 'style'], url: '/services.html#full-groom' },
        { keywords: ['home', 'main', 'start'], url: '/' }
    ];
    
    return searchData.filter(item => 
        item.keywords.some(keyword => keyword.includes(query) || query.includes(keyword))
    );
}

function showSearchMessage(message, type = 'info') {
    // Remove existing message
    const existingMessage = document.querySelector('.search-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `search-message search-message-${type}`;
    messageDiv.textContent = message;
    
    const searchForm = document.querySelector('.search-form');
    searchForm.parentNode.insertBefore(messageDiv, searchForm.nextSibling);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

/* ==========================================================================
   NAVIGATION CARDS FUNCTIONALITY
   ========================================================================== */

function initNavigationCards() {
    const navCards = document.querySelectorAll('.nav-card');
    
    navCards.forEach(card => {
        // Add keyboard support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Add ripple effect on click
        card.addEventListener('click', function(e) {
            createRippleEffect(this, e);
        });
        
        // Make focusable
        card.setAttribute('tabindex', '0');
    });
}

function createRippleEffect(element, event) {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple-effect');
    
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

/* ==========================================================================
   ERROR PAGE FEATURES
   ========================================================================== */

function initErrorPageFeatures() {
    // Add some fun easter eggs
    initEasterEggs();
    
    // Track 404 errors (for analytics)
    track404Error();
    
    // Auto-suggest based on URL
    suggestAlternativePages();
    
    // Add scroll animations
    initScrollAnimations();
}

function initEasterEggs() {
    let clickCount = 0;
    const confusedDog = document.querySelector('.confused-dog');
    
    if (confusedDog) {
        confusedDog.addEventListener('click', function() {
            clickCount++;
            
            if (clickCount === 1) {
                showEasterEggMessage('Woof! 🐕');
            } else if (clickCount === 3) {
                showEasterEggMessage('The dog is happy you\'re playing! 🎾');
                this.style.animation = 'bounce 0.5s ease';
            } else if (clickCount === 5) {
                showEasterEggMessage('You found the secret! Here\'s a treat: 10% off your first groom! 🦴');
                this.style.filter = 'hue-rotate(120deg)';
            }
        });
    }
}

function showEasterEggMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'easter-egg-message';
    messageDiv.textContent = message;
    messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--yellow-soft);
        padding: 1rem 2rem;
        border-radius: 25px;
        font-weight: bold;
        z-index: 1000;
        animation: bounceIn 0.5s ease;
    `;
    
    document.body.appendChild(messageDiv);
    
    setTimeout(() => {
        messageDiv.remove();
    }, 2000);
}

function track404Error() {
    // In a real application, you might want to track 404 errors for analytics
    const errorData = {
        url: window.location.href,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };
    
    console.log('404 Error tracked:', errorData);
    
    // You could send this to your analytics service:
    // gtag('event', 'page_not_found', {
    //     'page_location': errorData.url,
    //     'page_referrer': errorData.referrer
    // });
}

function suggestAlternativePages() {
    const currentPath = window.location.pathname.toLowerCase();
    const suggestions = [];
    
    if (currentPath.includes('service')) {
        suggestions.push({ text: 'Looking for our services?', url: '/services.html' });
    }
    
    if (currentPath.includes('book') || currentPath.includes('appointment')) {
        suggestions.push({ text: 'Want to book an appointment?', url: '/contact.html' });
    }
    
    if (currentPath.includes('price') || currentPath.includes('cost')) {
        suggestions.push({ text: 'Looking for pricing information?', url: '/services.html' });
    }
    
    if (currentPath.includes('photo') || currentPath.includes('gallery')) {
        suggestions.push({ text: 'Want to see our work?', url: '/gallery.html' });
    }
    
    if (suggestions.length > 0) {
        displaySuggestions(suggestions);
    }
}

function displaySuggestions(suggestions) {
    const suggestionsDiv = document.createElement('div');
    suggestionsDiv.className = 'url-suggestions';
    suggestionsDiv.innerHTML = `
        <h4>We think you might be looking for:</h4>
        ${suggestions.map(suggestion => 
            `<a href="${suggestion.url}" class="suggestion-link">${suggestion.text}</a>`
        ).join('')}
    `;
    
    const errorContent = document.querySelector('.error-content');
    errorContent.appendChild(suggestionsDiv);
}

function initScrollAnimations() {
    const sections = document.querySelectorAll('.quick-nav, .search-suggestion, .helpful-tips');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });
}

/* ==========================================================================
   ADD DYNAMIC CSS ANIMATIONS
   ========================================================================== */

function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatQuestion {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-10px) rotate(5deg); }
            50% { transform: translateY(-5px) rotate(-3deg); }
            75% { transform: translateY(-15px) rotate(2deg); }
        }
        
        @keyframes swingLeash {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(10deg); }
            75% { transform: rotate(-10deg); }
        }
        
        @keyframes bounceIn {
            0% { transform: translate(-50%, -50%) scale(0.3); }
            50% { transform: translate(-50%, -50%) scale(1.1); }
            100% { transform: translate(-50%, -50%) scale(1); }
        }
        
        @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        
        .ripple-effect {
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple-expand 0.6s linear;
            pointer-events: none;
        }
        
        @keyframes ripple-expand {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .search-message {
            padding: 1rem;
            border-radius: 8px;
            margin: 1rem 0;
            text-align: center;
            font-weight: 500;
        }
        
        .search-message-info {
            background: var(--blue-light, #e3f2fd);
            color: var(--blue-dark, #1565c0);
        }
        
        .search-message-warning {
            background: var(--yellow-light, #fff8e1);
            color: var(--yellow-dark, #f57f17);
        }
        
        .url-suggestions {
            background: var(--pink-light);
            border-radius: var(--radius-md);
            padding: var(--space-lg);
            margin-top: var(--space-lg);
        }
        
        .url-suggestions h4 {
            margin-bottom: var(--space-sm);
            color: var(--text-primary);
        }
        
        .suggestion-link {
            display: block;
            padding: var(--space-xs) 0;
            color: var(--text-primary);
            text-decoration: underline;
            font-weight: 500;
        }
        
        .suggestion-link:hover {
            color: var(--text-secondary);
        }
    `;
    
    document.head.appendChild(style);
}

/* ==========================================================================
   INITIALIZE ALL 404 FEATURES
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    addDynamicStyles();
    
    // Add some personality to the page
    setTimeout(() => {
        const tips = [
            "Did you know dogs can recognize over 150 words?",
            "Regular grooming helps detect skin issues early!",
            "A dog's sense of smell is 10,000 times stronger than humans!",
            "Grooming reduces shedding by up to 90%!"
        ];
        
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        console.log(`🐾 Grooming Tip: ${randomTip}`);
    }, 2000);
});
