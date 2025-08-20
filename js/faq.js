/* ==========================================================================
   ANABEL DOG GROOMING - FAQ PAGE INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    initAccordion();
    initCategoryFilters();
    initFAQSearch();
    initScrollAnimations();
});

/* ==========================================================================
   ACCORDION FUNCTIONALITY
   ========================================================================== */

function initAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');
        const toggle = item.querySelector('.faq-toggle');
        
        if (!question || !answer || !toggle) return;
        
        // Set initial state
        answer.style.maxHeight = '0';
        answer.style.overflow = 'hidden';
        answer.style.transition = 'max-height 0.3s ease, padding 0.3s ease';
        
        // Click handler
        question.addEventListener('click', function() {
            const isOpen = item.classList.contains('active');
            
            // Close all other items (optional - remove for multiple open accordions)
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    closeAccordionItem(otherItem);
                }
            });
            
            // Toggle current item
            if (isOpen) {
                closeAccordionItem(item);
            } else {
                openAccordionItem(item);
            }
        });
        
        // Keyboard accessibility
        question.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
        
        // Make question focusable
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        answer.setAttribute('aria-hidden', 'true');
    });
}

function openAccordionItem(item) {
    const answer = item.querySelector('.faq-answer');
    const toggle = item.querySelector('.faq-toggle');
    const question = item.querySelector('.faq-question');
    
    item.classList.add('active');
    toggle.textContent = '−';
    toggle.setAttribute('aria-label', 'Collapse answer');
    question.setAttribute('aria-expanded', 'true');
    answer.setAttribute('aria-hidden', 'false');
    
    // Calculate height and set it
    answer.style.maxHeight = answer.scrollHeight + 'px';
    answer.style.paddingTop = 'var(--space-md)';
    answer.style.paddingBottom = 'var(--space-md)';
    
    // Smooth scroll to item if it's not fully visible
    setTimeout(() => {
        const rect = item.getBoundingClientRect();
        const headerHeight = document.getElementById('main-header').offsetHeight;
        
        if (rect.top < headerHeight + 20) {
            const targetPosition = item.offsetTop - headerHeight - 20;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }, 150);
}

function closeAccordionItem(item) {
    const answer = item.querySelector('.faq-answer');
    const toggle = item.querySelector('.faq-toggle');
    const question = item.querySelector('.faq-question');
    
    item.classList.remove('active');
    toggle.textContent = '+';
    toggle.setAttribute('aria-label', 'Expand answer');
    question.setAttribute('aria-expanded', 'false');
    answer.setAttribute('aria-hidden', 'true');
    
    answer.style.maxHeight = '0';
    answer.style.paddingTop = '0';
    answer.style.paddingBottom = '0';
}

/* ==========================================================================
   CATEGORY FILTERING
   ========================================================================== */

function initCategoryFilters() {
    const categoryButtons = document.querySelectorAll('.category-btn');
    const faqItems = document.querySelectorAll('.faq-item');
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Update active button
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter FAQ items
            filterFAQItems(category);
            
            // Update URL hash for bookmarking
            if (category !== 'all') {
                window.history.replaceState(null, null, `#${category}`);
            } else {
                window.history.replaceState(null, null, window.location.pathname);
            }
        });
    });
    
    // Check for category in URL hash on load
    const urlHash = window.location.hash.substring(1);
    if (urlHash && document.querySelector(`[data-category="${urlHash}"]`)) {
        const targetButton = document.querySelector(`[data-category="${urlHash}"]`);
        if (targetButton) {
            targetButton.click();
        }
    }
}

function filterFAQItems(category) {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const itemCategory = item.dataset.category;
        
        if (category === 'all' || itemCategory === category) {
            showFAQItem(item);
        } else {
            hideFAQItem(item);
        }
    });
    
    // Close all open items when filtering
    const openItems = document.querySelectorAll('.faq-item.active');
    openItems.forEach(item => closeAccordionItem(item));
}

function showFAQItem(item) {
    item.style.display = 'block';
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    
    // Animate in
    setTimeout(() => {
        item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        item.style.opacity = '1';
        item.style.transform = 'translateY(0)';
    }, 50);
}

function hideFAQItem(item) {
    item.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    item.style.opacity = '0';
    item.style.transform = 'translateY(-20px)';
    
    setTimeout(() => {
        item.style.display = 'none';
    }, 300);
}

/* ==========================================================================
   SEARCH FUNCTIONALITY
   ========================================================================== */

function initFAQSearch() {
    const searchInput = document.getElementById('faq-search');
    const faqItems = document.querySelectorAll('.faq-item');
    
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        
        // Debounce search for performance
        searchTimeout = setTimeout(() => {
            const searchTerm = this.value.toLowerCase().trim();
            
            if (searchTerm.length === 0) {
                // Reset to current category filter
                const activeCategory = document.querySelector('.category-btn.active').dataset.category;
                filterFAQItems(activeCategory);
                clearSearchHighlights();
            } else {
                searchFAQItems(searchTerm);
            }
        }, 300);
    });
    
    // Clear search on escape key
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            this.dispatchEvent(new Event('input'));
            this.blur();
        }
    });
}

function searchFAQItems(searchTerm) {
    const faqItems = document.querySelectorAll('.faq-item');
    let hasResults = false;
    
    // Clear category filtering during search
    const categoryButtons = document.querySelectorAll('.category-btn');
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    
    faqItems.forEach(item => {
        const questionText = item.querySelector('.faq-question h3').textContent.toLowerCase();
        const answerText = item.querySelector('.faq-answer').textContent.toLowerCase();
        
        const matchesQuestion = questionText.includes(searchTerm);
        const matchesAnswer = answerText.includes(searchTerm);
        
        if (matchesQuestion || matchesAnswer) {
            showFAQItem(item);
            highlightSearchTerms(item, searchTerm);
            hasResults = true;
        } else {
            hideFAQItem(item);
        }
    });
    
    // Show no results message if needed
    showNoResultsMessage(!hasResults, searchTerm);
}

function highlightSearchTerms(item, searchTerm) {
    const question = item.querySelector('.faq-question h3');
    const answer = item.querySelector('.faq-answer');
    
    // Clear previous highlights
    clearHighlights(question);
    clearHighlights(answer);
    
    // Highlight in question
    highlightText(question, searchTerm);
    
    // Highlight in answer (but be careful with HTML structure)
    const textNodes = getTextNodes(answer);
    textNodes.forEach(node => {
        if (node.textContent.toLowerCase().includes(searchTerm)) {
            highlightInTextNode(node, searchTerm);
        }
    });
}

function highlightText(element, searchTerm) {
    const text = element.textContent;
    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
    const highlightedText = text.replace(regex, '<mark class="search-highlight">$1</mark>');
    element.innerHTML = highlightedText;
}

function highlightInTextNode(textNode, searchTerm) {
    const text = textNode.textContent;
    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
    
    if (regex.test(text)) {
        const highlightedHTML = text.replace(regex, '<mark class="search-highlight">$1</mark>');
        const wrapper = document.createElement('span');
        wrapper.innerHTML = highlightedHTML;
        textNode.parentNode.replaceChild(wrapper, textNode);
    }
}

function clearHighlights(element) {
    const highlights = element.querySelectorAll('.search-highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
}

function clearSearchHighlights() {
    const allHighlights = document.querySelectorAll('.search-highlight');
    allHighlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
}

function getTextNodes(element) {
    const textNodes = [];
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let node;
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    return textNodes;
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function showNoResultsMessage(show, searchTerm) {
    let noResultsDiv = document.querySelector('.no-results-message');
    
    if (show) {
        if (!noResultsDiv) {
            noResultsDiv = document.createElement('div');
            noResultsDiv.className = 'no-results-message';
            noResultsDiv.innerHTML = `
                <div class="no-results-content">
                    <div class="no-results-icon">🔍</div>
                    <h3>No results found</h3>
                    <p>No questions match your search for "<strong>${escapeHtml(searchTerm)}</strong>"</p>
                    <p>Try different keywords or browse our categories above.</p>
                    <button class="btn btn-outline" onclick="clearSearch()">Clear Search</button>
                </div>
            `;
            
            const container = document.querySelector('.faq-accordion .container');
            container.appendChild(noResultsDiv);
        }
        
        noResultsDiv.style.display = 'block';
    } else {
        if (noResultsDiv) {
            noResultsDiv.style.display = 'none';
        }
    }
}

function clearSearch() {
    const searchInput = document.getElementById('faq-search');
    if (searchInput) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/* ==========================================================================
   SCROLL ANIMATIONS
   ========================================================================== */

function initScrollAnimations() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    faqItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        
        observer.observe(item);
    });
}

/* ==========================================================================
   FAQ ITEM ENHANCEMENTS
   ========================================================================== */

function initFAQEnhancements() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        // Add hover effects
        item.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateX(5px)';
                this.style.backgroundColor = 'var(--pink-light)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateX(0)';
                this.style.backgroundColor = '';
            }
        });
        
        // Add category badges
        const category = item.dataset.category;
        if (category) {
            const badge = document.createElement('span');
            badge.className = 'category-badge';
            badge.textContent = getCategoryName(category);
            
            const question = item.querySelector('.faq-question');
            question.appendChild(badge);
        }
    });
}

function getCategoryName(category) {
    const categoryNames = {
        'booking': 'Booking',
        'services': 'Services',
        'preparation': 'Preparation',
        'policies': 'Policies',
        'health': 'Health'
    };
    
    return categoryNames[category] || category;
}

/* ==========================================================================
   FAQ ANALYTICS (OPTIONAL)
   ========================================================================== */

function initFAQAnalytics() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        const questionText = question.querySelector('h3').textContent;
        
        question.addEventListener('click', function() {
            // Track which questions are most commonly clicked
            // This could integrate with Google Analytics or other tracking
            console.log(`FAQ clicked: ${questionText}`);
            
            // You could send this data to an analytics service:
            // gtag('event', 'faq_click', {
            //     'faq_question': questionText,
            //     'faq_category': item.dataset.category
            // });
        });
    });
}

/* ==========================================================================
   INITIALIZE ALL FAQ FEATURES
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure DOM is fully rendered
    setTimeout(() => {
        initFAQEnhancements();
        // initFAQAnalytics(); // Uncomment if you want to track FAQ usage
    }, 100);
    
    // Add fade-in class to animated items
    setTimeout(() => {
        const fadeInItems = document.querySelectorAll('.faq-item');
        fadeInItems.forEach(item => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        });
    }, 200);
    
    // Auto-expand FAQ item if linked directly
    if (window.location.hash && window.location.hash.includes('faq-')) {
        const targetId = window.location.hash.substring(1);
        const targetItem = document.getElementById(targetId);
        if (targetItem && targetItem.classList.contains('faq-item')) {
            setTimeout(() => {
                openAccordionItem(targetItem);
                targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 500);
        }
    }
});
