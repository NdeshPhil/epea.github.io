// script.js - EPEA Consultants Africa Ltd - EMERGENCY FIX

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('EPEA Consultants website loaded successfully!');
    
    // Initialize all features
    initSmoothScrolling();
    initConsultationForm();
    initBackToTop();
    initCurrentYear();
    initMobileMenu();
    initLogoDebug();
});

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    document.querySelectorAll('nav a, .hero-button').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href;
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Update active nav link
                    updateActiveNavLink(href);
                }
            }
        });
    });
}

function updateActiveNavLink(activeHref) {
    document.querySelectorAll('nav a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === activeHref) {
            link.classList.add('active');
        }
    });
}

// ===== CONSULTATION FORM =====
function initConsultationForm() {
    const consultationForm = document.getElementById('consultationForm');
    
    if (consultationForm) {
        consultationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                company: document.getElementById('company').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                service: document.getElementById('service').value,
                message: document.getElementById('message').value.trim()
            };
            
            // Validate form
            if (validateConsultationForm(formData)) {
                // Show loading state
                const submitBtn = consultationForm.querySelector('.submit-btn');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...';
                submitBtn.disabled = true;
                
                // Simulate sending to server
                setTimeout(() => {
                    // Success notification
                    showFormNotification('Thank you! Your consultation request has been submitted. Our team will contact you within 24 hours.', 'success');
                    
                    // Reset form
                    consultationForm.reset();
                    
                    // Restore button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Log for debugging
                    console.log('Consultation request submitted:', {
                        ...formData,
                        timestamp: new Date().toISOString()
                    });
                    
                }, 1500);
            }
        });
    }
}

function validateConsultationForm(data) {
    // Clear previous errors
    clearFormErrors();
    
    let isValid = true;
    
    // Name validation
    if (!data.name || data.name.length < 2) {
        showFieldError('name', 'Please enter your full name (minimum 2 characters)');
        isValid = false;
    }
    
    // Company validation
    if (!data.company) {
        showFieldError('company', 'Please enter your company/organization name');
        isValid = false;
    }
    
    // Email validation
    if (!data.email) {
        showFieldError('email', 'Please enter your email address');
        isValid = false;
    } else if (!isValidEmail(data.email)) {
        showFieldError('email', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Service validation
    if (!data.service) {
        showFieldError('service', 'Please select a service interest');
        isValid = false;
    }
    
    // Message validation
    if (!data.message || data.message.length < 10) {
        showFieldError('message', 'Please provide a brief description (minimum 10 characters)');
        isValid = false;
    }
    
    return isValid;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');
    
    // Add error styling
    field.style.borderColor = '#DC2626';
    
    // Create or update error message
    let errorElement = formGroup.querySelector('.error-message');
    if (!errorElement) {
        errorElement = document.createElement('div');
        errorElement.className = 'error-message text-red-600 text-sm mt-2';
        formGroup.appendChild(errorElement);
    }
    errorElement.innerHTML = `<i class="fas fa-exclamation-circle mr-1"></i> ${message}`;
}

function clearFormErrors() {
    // Clear error styling
    document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(field => {
        field.style.borderColor = '';
    });
    
    // Remove error messages
    document.querySelectorAll('.error-message').forEach(el => {
        el.remove();
    });
}

function showFormNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
        type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
        type === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
        'bg-blue-50 text-blue-800 border border-blue-200'
    }`;
    notification.style.maxWidth = '400px';
    notification.innerHTML = `
        <div class="flex items-start">
            <i class="fas ${
                type === 'success' ? 'fa-check-circle text-green-500' :
                type === 'error' ? 'fa-exclamation-circle text-red-500' :
                'fa-info-circle text-blue-500'
            } text-xl mr-3 mt-1"></i>
            <div class="flex-1">
                <p class="font-medium mb-2">${type === 'success' ? 'Success!' : type === 'error' ? 'Error!' : 'Notice'}</p>
                <p>${message}</p>
            </div>
            <button class="ml-4 text-gray-400 hover:text-gray-600" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 8000);
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        // Show/hide based on scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when clicked
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===== CURRENT YEAR =====
function initCurrentYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// ===== LOGO DEBUG HELPER =====
function initLogoDebug() {
    // This function helps debug image loading issues
    console.log('Checking image paths...');
    
    const images = document.querySelectorAll('.client-logo-container img');
    images.forEach((img, index) => {
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt');
        
        // Create image object to check if it loads
        const testImage = new Image();
        testImage.onload = function() {
            console.log(`✓ Logo ${index + 1} loaded: ${alt}`);
        };
        testImage.onerror = function() {
            console.log(`✗ Logo ${index + 1} failed: ${src
