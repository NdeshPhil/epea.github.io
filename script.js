// script.js - EPEA Consultants Africa Ltd

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
    initActiveNavOnScroll();
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
                    
                    // Close mobile menu if open
                    const nav = document.querySelector('nav');
                    const toggle = document.querySelector('.mobile-menu-toggle');
                    if (nav && nav.classList.contains('mobile-open')) {
                        nav.classList.remove('mobile-open');
                        if (toggle) toggle.innerHTML = '<i class="fas fa-bars"></i>';
                    }
                }
            }
        });
    });
}

// ===== ACTIVE NAV ON SCROLL =====
function initActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
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
                    
                    // Scroll to top
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
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
    field.style.boxShadow = '0 0 0 3px rgba(220, 38, 38, 0.1)';
    
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
        field.style.boxShadow = '';
    });
    
    // Remove error messages
    document.querySelectorAll('.error-message').forEach(el => {
        el.remove();
    });
}

function showFormNotification(message, type = 'success') {
    // Remove existing notifications
    document.querySelectorAll('.form-notification').forEach(el => el.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `form-notification fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 ${
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

// ===== MOBILE MENU =====
function initMobileMenu() {
    const nav = document.querySelector('nav');
    const headerContainer = document.querySelector('header .max-w-7xl');
    
    if (nav && headerContainer && window.innerWidth < 768) {
        // Check if toggle already exists
        if (!document.querySelector('.mobile-menu-toggle')) {
            // Create mobile menu toggle button
            const menuToggle = document.createElement('button');
            menuToggle.className = 'mobile-menu-toggle';
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
            
            // Insert toggle button
            headerContainer.style.position = 'relative';
            headerContainer.appendChild(menuToggle);
            
            // Toggle menu
            menuToggle.addEventListener('click', function() {
                nav.classList.toggle('mobile-open');
                menuToggle.innerHTML = nav.classList.contains('mobile-open') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
            
            // Close menu when clicking outside
            document.addEventListener('click', function(e) {
                if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('mobile-open')) {
                    nav.classList.remove('mobile-open');
                    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        }
    }
}

// ===== LOGO DEBUG HELPER =====
function initLogoDebug() {
    // This function helps debug image loading issues
    console.log('Checking image paths...');
    
    const images = document.querySelectorAll('.client-logo-container img, .team-photo img');
    images.forEach((img, index) => {
        const src = img.getAttribute('src');
        const alt = img.getAttribute('alt') || 'Image ' + (index + 1);
        
        // Create image object to check if it loads
        const testImage = new Image();
        testImage.onload = function() {
            console.log(`✓ Image loaded: ${alt}`);
            img.style.opacity = '1';
        };
        testImage.onerror = function() {
            console.log(`✗ Image failed: ${src} (${alt})`);
            // Add fallback for team photos
            if (src.includes('team') || src.includes('edith') || src.includes('apollo') || src.includes('anne')) {
                const parent = img.parentElement;
                if (parent.classList.contains('team-photo')) {
                    const name = alt.split(' - ')[0] || alt;
                    parent.innerHTML = `<div class="team-photo-fallback" style="width:100%;height:100%;background:linear-gradient(135deg, #823E0E, #BB6D15);display:flex;align-items:center;justify-content:center;color:white;font-size:2rem;"><i class="fas fa-user-tie"></i></div>`;
                    console.log(`Created fallback for team photo: ${name}`);
                }
            }
            // Add visual indicator for broken client logos
            img.style.border = '2px dashed #DC2626';
            img.style.padding = '5px';
        };
        testImage.src = src;
    });
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

// Page load performance tracking
window.addEventListener('load', function() {
    const loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    console.log(`EPEA Consultants website loaded in ${loadTime}ms`);
    
    // Check if images loaded
    setTimeout(() => {
        const brokenImages = Array.from(document.querySelectorAll('img')).filter(img => {
            return img.complete && img.naturalWidth === 0;
        });
        if (brokenImages.length > 0) {
            console.warn(`${brokenImages.length} images failed to load. Check file paths.`);
        }
    }, 1000);
    
    // Add CSS for active nav link
    const style = document.createElement('style');
    style.textContent = `
        nav a.active {
            color: #E2A227 !important;
            font-weight: 600;
        }
        nav a.active::after {
            width: 100% !important;
        }
        .team-photo-fallback {
            border-radius: 10px;
        }
    `;
    document.head.appendChild(style);
});

// Handle window resize for mobile menu
window.addEventListener('resize', debounce(function() {
    const nav = document.querySelector('nav');
    const toggle = document.querySelector('.mobile-menu-toggle');
    
    if (window.innerWidth >= 768) {
        if (nav) nav.classList.remove('mobile-open');
        if (toggle) toggle.style.display = 'none';
    } else {
        if (toggle) toggle.style.display = 'flex';
    }
}, 250));
