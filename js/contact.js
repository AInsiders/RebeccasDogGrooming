/* ==========================================================================
   ANABEL DOG GROOMING - CONTACT PAGE INTERACTIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFormValidation();
    initURLParameters();
    initDatePicker();
    initInteractiveElements();
});

/* ==========================================================================
   CONTACT FORM INITIALIZATION
   ========================================================================== */

function initContactForm() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
    
    // Reset form button
    const resetBtn = form.querySelector('button[type="reset"]');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            clearAllErrors();
            form.reset();
        });
    }
}

/* ==========================================================================
   FORM VALIDATION
   ========================================================================== */

function initFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    // Real-time validation on input blur
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            // Clear error state when user starts typing
            if (this.classList.contains('error')) {
                clearFieldError(this);
            }
        });
    });
    
    // Email validation on input
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            if (this.value && !isValidEmail(this.value)) {
                showFieldError(this, 'Please enter a valid email address');
            } else {
                clearFieldError(this);
            }
        });
    }
    
    // Phone number formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            this.value = formatPhoneNumber(this.value);
        });
    }
}

function validateForm() {
    const form = document.getElementById('contact-form');
    let isValid = true;
    
    // Clear all previous errors
    clearAllErrors();
    
    // Required fields validation
    const requiredFields = [
        { id: 'name', message: 'Please enter your name' },
        { id: 'email', message: 'Please enter your email address' },
        { id: 'dog-name', message: 'Please enter your dog\'s name' },
        { id: 'service', message: 'Please select a service' }
    ];
    
    requiredFields.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input.value.trim()) {
            showFieldError(input, field.message);
            isValid = false;
        }
    });
    
    // Email validation
    const emailInput = document.getElementById('email');
    if (emailInput.value && !isValidEmail(emailInput.value)) {
        showFieldError(emailInput, 'Please enter a valid email address');
        isValid = false;
    }
    
    // Phone validation (if provided)
    const phoneInput = document.getElementById('phone');
    if (phoneInput.value && !isValidPhone(phoneInput.value)) {
        showFieldError(phoneInput, 'Please enter a valid phone number');
        isValid = false;
    }
    
    return isValid;
}

function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        const fieldName = field.previousElementSibling.textContent.replace('*', '').trim();
        showFieldError(field, `Please enter ${fieldName.toLowerCase()}`);
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    if (field.type === 'tel' && value && !isValidPhone(value)) {
        showFieldError(field, 'Please enter a valid phone number');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    const errorElement = document.getElementById(field.getAttribute('aria-describedby'));
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = document.getElementById(field.getAttribute('aria-describedby'));
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }
}

function clearAllErrors() {
    const form = document.getElementById('contact-form');
    const errorInputs = form.querySelectorAll('.error');
    const errorMessages = form.querySelectorAll('.error-message');
    
    errorInputs.forEach(input => input.classList.remove('error'));
    errorMessages.forEach(msg => {
        msg.textContent = '';
        msg.style.display = 'none';
    });
}

/* ==========================================================================
   FORM SUBMISSION
   ========================================================================== */

function submitForm() {
    const form = document.getElementById('contact-form');
    const submitBtn = form.querySelector('button[type="submit"]');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    // Show loading state
    submitBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';
    
    // Collect form data
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Simulate form submission (in a real app, this would send to a server)
    setTimeout(() => {
        showSuccessMessage();
        
        // Reset button state
        submitBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        
        // Log form data for demonstration
        console.log('Form submitted with data:', data);
        
        // In a real application, you would send this data to your server:
        // fetch('/submit-contact-form', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });
        
    }, 2000);
}

function showSuccessMessage() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    
    form.style.display = 'none';
    successMessage.style.display = 'block';
    
    // Scroll to success message
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function resetForm() {
    const form = document.getElementById('contact-form');
    const successMessage = document.getElementById('success-message');
    
    form.style.display = 'block';
    successMessage.style.display = 'none';
    form.reset();
    clearAllErrors();
    
    // Scroll back to form
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ==========================================================================
   URL PARAMETERS HANDLING
   ========================================================================== */

function initURLParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    const service = urlParams.get('service');
    const size = urlParams.get('size');
    
    // Pre-fill service from URL
    if (service) {
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
            serviceSelect.value = service;
            
            // Trigger change event for any dependent fields
            serviceSelect.dispatchEvent(new Event('change'));
        }
    }
    
    // Pre-fill size from URL
    if (size) {
        const sizeSelect = document.getElementById('dog-size');
        if (sizeSelect) {
            sizeSelect.value = size;
        }
    }
    
    // Check session storage for selections
    const sessionService = sessionStorage.getItem('selectedService');
    const sessionSize = sessionStorage.getItem('selectedSize');
    
    if (sessionService && !service) {
        const serviceSelect = document.getElementById('service');
        if (serviceSelect) {
            serviceSelect.value = sessionService;
        }
    }
    
    if (sessionSize && !size) {
        const sizeSelect = document.getElementById('dog-size');
        if (sizeSelect) {
            sizeSelect.value = sessionSize;
        }
    }
}

/* ==========================================================================
   DATE PICKER INITIALIZATION
   ========================================================================== */

function initDatePicker() {
    const dateInput = document.getElementById('preferred-date');
    if (!dateInput) return;
    
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];
    
    // Set maximum date to 3 months from now
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    dateInput.max = maxDate.toISOString().split('T')[0];
    
    // Disable Sundays (assuming closed on Sundays)
    dateInput.addEventListener('input', function() {
        const selectedDate = new Date(this.value);
        const dayOfWeek = selectedDate.getDay();
        
        if (dayOfWeek === 0) { // Sunday
            showFieldError(this, 'Sorry, we\'re closed on Sundays. Please select another date.');
            this.value = '';
        } else {
            clearFieldError(this);
        }
    });
}

/* ==========================================================================
   INTERACTIVE ELEMENTS
   ========================================================================== */

function initInteractiveElements() {
    // Service selection handler
    const serviceSelect = document.getElementById('service');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            updateServiceDescription(this.value);
        });
    }
    
    // Form progress tracking
    initFormProgress();
    
    // Auto-save form data to localStorage
    initAutoSave();
    
    // Map interaction
    initMapInteraction();
}

function updateServiceDescription(service) {
    // You could show estimated duration and price based on service selection
    const serviceDescriptions = {
        'bath-brush': 'Duration: 1.5-2 hours | Price: From £30',
        'full-groom': 'Duration: 2.5-3.5 hours | Price: From £40', 
        'puppy-groom': 'Duration: 1-1.5 hours | Price: From £20',
        'nail-trim': 'Duration: 15-20 minutes | Price: £10',
        'consultation': 'Free consultation available'
    };
    
    // Create or update service info display
    let serviceInfo = document.getElementById('service-info');
    if (!serviceInfo) {
        serviceInfo = document.createElement('div');
        serviceInfo.id = 'service-info';
        serviceInfo.className = 'service-info';
        document.getElementById('service').parentNode.appendChild(serviceInfo);
    }
    
    if (service && serviceDescriptions[service]) {
        serviceInfo.innerHTML = `<small>ℹ️ ${serviceDescriptions[service]}</small>`;
        serviceInfo.style.display = 'block';
    } else {
        serviceInfo.style.display = 'none';
    }
}

function initFormProgress() {
    const form = document.getElementById('contact-form');
    const requiredFields = form.querySelectorAll('[required]');
    
    // Create progress indicator
    const progressContainer = document.createElement('div');
    progressContainer.className = 'form-progress';
    progressContainer.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
        <span class="progress-text">0% complete</span>
    `;
    
    form.insertBefore(progressContainer, form.firstChild);
    
    const progressFill = progressContainer.querySelector('.progress-fill');
    const progressText = progressContainer.querySelector('.progress-text');
    
    function updateProgress() {
        let filledFields = 0;
        
        requiredFields.forEach(field => {
            if (field.value.trim()) {
                filledFields++;
            }
        });
        
        const percentage = Math.round((filledFields / requiredFields.length) * 100);
        progressFill.style.width = percentage + '%';
        progressText.textContent = percentage + '% complete';
    }
    
    // Update progress on input
    requiredFields.forEach(field => {
        field.addEventListener('input', updateProgress);
        field.addEventListener('change', updateProgress);
    });
    
    // Initial update
    updateProgress();
}

function initAutoSave() {
    const form = document.getElementById('contact-form');
    const formInputs = form.querySelectorAll('input, select, textarea');
    
    // Load saved data
    formInputs.forEach(input => {
        const savedValue = localStorage.getItem(`contact_form_${input.name}`);
        if (savedValue && !input.value) {
            input.value = savedValue;
        }
    });
    
    // Save data on input
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            localStorage.setItem(`contact_form_${this.name}`, this.value);
        });
    });
    
    // Clear saved data on successful submission
    form.addEventListener('submit', function() {
        formInputs.forEach(input => {
            localStorage.removeItem(`contact_form_${input.name}`);
        });
    });
}

function initMapInteraction() {
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', function() {
            // Open Google Maps in new tab
            const address = encodeURIComponent('123 High Street, Your City, YC1 2AB, UK');
            window.open(`https://www.google.com/maps/search/${address}`, '_blank');
        });
        
        mapPlaceholder.style.cursor = 'pointer';
        mapPlaceholder.setAttribute('role', 'button');
        mapPlaceholder.setAttribute('tabindex', '0');
        mapPlaceholder.setAttribute('aria-label', 'Open location in Google Maps');
        
        // Keyboard support
        mapPlaceholder.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
}

/* ==========================================================================
   UTILITY FUNCTIONS
   ========================================================================== */

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    // UK phone number validation
    const phoneRegex = /^(\+44|0)[1-9]\d{8,9}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone);
}

function formatPhoneNumber(phone) {
    // Basic UK phone number formatting
    const numbers = phone.replace(/\D/g, '');
    
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return numbers.replace(/(\d{3})(\d+)/, '$1 $2');
    if (numbers.length <= 10) return numbers.replace(/(\d{3})(\d{3})(\d+)/, '$1 $2 $3');
    
    return numbers.replace(/(\d{2})(\d{4})(\d{3})(\d+)/, '+$1 $2 $3 $4');
}

/* ==========================================================================
   CONTACT PAGE ANIMATIONS
   ========================================================================== */

function initContactAnimations() {
    const quickContactItems = document.querySelectorAll('.quick-contact-item');
    
    quickContactItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // Form section animation
    const formSection = document.querySelector('.contact-form-section');
    const infoSection = document.querySelector('.contact-info-section');
    
    if (formSection && infoSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('slide-in');
                }
            });
        }, { threshold: 0.2 });
        
        observer.observe(formSection);
        observer.observe(infoSection);
    }
}

/* ==========================================================================
   INITIALIZE ALL CONTACT FEATURES
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initContactAnimations, 100);
    
    // Add form focus enhancements
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
        });
    });
});

// Make resetForm globally accessible
window.resetForm = resetForm;
