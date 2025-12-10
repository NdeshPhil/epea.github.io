// script.js - EPEA Consultants Africa Ltd

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('EPEA Consultants Africa Ltd website loaded successfully!');
    
    // Initialize all features
    initSmoothScrolling();
    initConsultationForm();
    initBackToTop();
    initCurrentYear();
    initServiceCategoryEffects();
    initTeamCardAnimations();
    initScrollAnimations();
    initMobileMenu();
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
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
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
                sector: document.getElementById('sector').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value.trim()
            };
            
            // Validate form
            if (validateConsultationForm(formData)) {
                // Show loading state
                const submitBtn = consultationForm.querySelector('.submit-btn');
                const originalText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing Request...';
                submitBtn.disabled = true;
                
                // Simulate sending to server (in production, use fetch/axios)
                setTimeout(() => {
                    // Success notification
                    showFormNotification('Thank you! Your consultation request has been submitted. Our team will contact you within 24 hours.', 'success');
                    
                    // Reset form
                    consultationForm.reset();
                    
                    // Restore button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    
                    // Log for debugging (in production, send to server)
                    console.log('Consultation request submitted:', {
                        ...formData,
                        timestamp: new Date().toISOString(),
                        source: 'EPEA Website Contact Form'
                    });
                    
                    // Optional: Send to email service
                    sendFormToEmailService(formData);
                    
                }, 2000);
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
    
    // Sector validation
    if (!data.sector) {
        showFieldError('sector', 'Please select your industry sector');
        isValid = false;
    }
    
    // Service validation
    if (!data.service) {
        showFieldError('service', 'Please select a service interest');
        isValid = false;
    }
    
    // Message validation
    if (!data.message || data.message.length < 20) {
        showFieldError('message', 'Please provide a brief description of your needs (minimum 20 characters)');
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

function sendFormToEmailService(formData) {
    // In production, implement actual email sending
    // Example using Formspree, EmailJS, or your backend API
    console.log('Form data ready for email submission:', formData);
    
    // Example using Formspree (you would need to set up your Formspree ID)
    /*
    fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Email sent successfully:', data);
    })
    .catch(error => {
        console.error('Email sending error:', error);
    });
    */
}

// ===== BACK TO TOP =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        // Show/hide based on scroll
        window.addEventListener('scroll', debounce(function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }, 100));
        
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

// ===== SERVICE CATEGORY EFFECTS =====
function initServiceCategoryEffects() {
    const serviceCategories = document.querySelectorAll('.service-category');
    
    serviceCategories.forEach(category => {
        category.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        category.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ===== TEAM CARD ANIMATIONS =====
function initTeamCardAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }, { threshold: 0.1 });
    
    // Observe team cards
    document.querySelectorAll('.team-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// ===== SCROLL ANIMATIONS =====
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    
    // Observe elements for animation
    document.querySelectorAll('.service-category, .contact-card, .mission-vision, .hero-stats').forEach(el => {
        observer.observe(el);
    });
}

// ===== MOBILE MENU =====
function initMobileMenu() {
    if (window.innerWidth < 768) {
        const nav = document.querySelector('nav');
        const header = document.querySelector('header .max-w-7xl');
        
        if (nav && header) {
            // Create mobile menu toggle
            const menuToggle = document.createElement('button');
            menuToggle.className = 'mobile-menu-toggle';
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: center;
                width: 45px;
                height: 45px;
                background: rgba(226, 162, 39, 0.2);
                border: 1px solid rgba(226, 162, 39, 0.3);
                border-radius: 8px;
                color: var(--primary-gold);
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: auto;
            `;
            
            // Insert toggle button
            const headerContainer = document.querySelector('.max-w-7xl');
            if (headerContainer) {
                headerContainer.style.position = 'relative';
                headerContainer.appendChild(menuToggle);
            }
            
            // Toggle menu
            menuToggle.addEventListener('click', function() {
                nav.classList.toggle('mobile-open');
                menuToggle.innerHTML = nav.classList.contains('mobile-open') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
            
            // Add mobile styles
            const style = document.createElement('style');
            style.textContent = `
                @media (max-width: 768px) {
                    nav {
                        display: none;
                        position: absolute;
                        top: 100%;
                        left: 0;
                        right: 0;
                        background: var(--dark-bronze);
                        padding: 20px;
                        flex-direction: column;
                        gap: 15px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                        border-radius: 0 0 15px 15px;
                        z-index: 100;
                        margin-top: 10px;
                    }
                    nav.mobile-open {
                        display: flex;
                    }
                    nav a {
                        padding: 12px 20px;
                        border-radius: 8px;
                        background: rgba(255, 255, 255, 0.05);
                    }
                    .mobile-menu-toggle {
                        display: flex !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// ===== UTILITY FUNCTIONS =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Newsletter form (optional)
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input').value;
            if (email && isValidEmail(email)) {
                // Handle newsletter subscription
                console.log('Newsletter subscription:', email);
                this.querySelector('input').value = '';
                showFormNotification('Thank you for subscribing to our newsletter!', 'success');
            }
        });
    }
}

// Initialize newsletter on load
if (document.querySelector('.newsletter-form')) {
    initNewsletter();
}

// Page load performance tracking
window.addEventListener('load', function() {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log(`EPEA Consultants website loaded in ${loadTime}ms`);
    
    // Add loaded class for any final animations
    document.body.classList.add('loaded');
});