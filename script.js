// ===== FORM SUBMISSION HANDLER =====
document.addEventListener('DOMContentLoaded', function() {
  const consultationForm = document.getElementById('consultationForm');
  if (consultationForm) {
    consultationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      alert('Thank you for your interest! A consultant will respond within 24 hours.');
      this.reset();
    });
  }
});

// ===== COUNTER ANIMATION =====
// Counter animation function
function animateCounter(element, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    // For numbers that should have + (like 60+), we add it at the end
    if (end > 60) {
      element.innerText = Math.floor(progress * (end - start) + start);
    } else {
      element.innerText = Math.floor(progress * (end - start) + start);
    }
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      // Add the + sign for numbers that need it
      if (end === 60 || end === 37) {
        element.innerText = end + '+';
      } else {
        element.innerText = end;
      }
    }
  };
  window.requestAnimationFrame(step);
}

// Intersection Observer to trigger counters when visible
const observerOptions = {
  threshold: 0.5,
  rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const statNumbers = entry.target.querySelectorAll('.stat-number');
      statNumbers.forEach(stat => {
        // Get the target value from data attribute
        const targetValue = parseInt(stat.getAttribute('data-target'));
        if (targetValue && !stat.classList.contains('counted')) {
          stat.classList.add('counted');
          stat.innerText = '0';
          animateCounter(stat, 0, targetValue, 2000);
        }
      });
      // Unobserve after animation starts
      counterObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe the hero stats section
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  counterObserver.observe(heroStats);
}

// ===== ACTIVE NAVIGATION HIGHLIGHT =====
// Highlight active navigation link based on scroll position
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  const scrollPosition = window.scrollY + 150; // Offset for header
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    if (href === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// Debounce function to limit how often scroll handler runs
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

// Add scroll event listener with debounce
window.addEventListener('scroll', debounce(updateActiveNavLink, 100));

// Call once on load to set initial active state
document.addEventListener('DOMContentLoaded', updateActiveNavLink);

// ===== SMOOTH SCROLLING FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = document.querySelector('.main-header').offsetHeight;
      const targetPosition = targetElement.offsetTop - headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
      
      // Update URL without jumping
      history.pushState(null, null, targetId);
    }
  });
});

// ===== BACK TO TOP BUTTON =====
// Create back to top button if it doesn't exist
function createBackToTopButton() {
  if (!document.getElementById('backToTop')) {
    const backToTop = document.createElement('button');
    backToTop.id = 'backToTop';
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);
    
    // Add click event
    backToTop.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
}

// Show/hide back to top button based on scroll position
function initBackToTop() {
  createBackToTopButton();
  
  const backToTop = document.getElementById('backToTop');
  if (!backToTop) return;
  
  window.addEventListener('scroll', debounce(function() {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  }, 100));
}

// Initialize back to top functionality
document.addEventListener('DOMContentLoaded', initBackToTop);

// ===== MOBILE MENU TOGGLE =====
function initMobileMenu() {
  const header = document.querySelector('.main-header');
  const nav = document.querySelector('nav');
  const headerContainer = document.querySelector('.header-container');
  
  // Only add mobile menu if on mobile and menu doesn't exist
  if (window.innerWidth <= 768 && nav && !document.querySelector('.mobile-menu-toggle')) {
    const menuToggle = document.createElement('button');
    menuToggle.className = 'mobile-menu-toggle';
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.setAttribute('aria-label', 'Toggle navigation menu');
    
    // Insert toggle button
    headerContainer.style.position = 'relative';
    headerContainer.appendChild(menuToggle);
    
    // Add mobile menu styles if not present
    if (!document.getElementById('mobile-menu-styles')) {
      const style = document.createElement('style');
      style.id = 'mobile-menu-styles';
      style.textContent = `
        .mobile-menu-toggle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          background: var(--accent-blue);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 1.2rem;
          cursor: pointer;
          margin-left: auto;
          transition: all 0.3s ease;
        }
        
        .mobile-menu-toggle:hover {
          background: var(--accent-blue-light);
          transform: scale(1.05);
        }
        
        @media (max-width: 768px) {
          nav {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: white;
            padding: 20px;
            flex-direction: column;
            gap: 10px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border-radius: 0 0 15px 15px;
            z-index: 1000;
            margin-top: 10px;
          }
          
          nav.mobile-open {
            display: flex !important;
          }
          
          nav .nav-link {
            margin: 0;
            padding: 12px 20px;
            width: 100%;
            text-align: center;
            border-radius: 8px;
          }
          
          nav .nav-link:hover {
            transform: none;
          }
        }
        
        @media (min-width: 769px) {
          .mobile-menu-toggle {
            display: none !important;
          }
          
          nav {
            display: flex !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
    
    // Toggle menu on click
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('mobile-open');
      menuToggle.innerHTML = nav.classList.contains('mobile-open') 
        ? '<i class="fas fa-times"></i>' 
        : '<i class="fas fa-bars"></i>';
    });
    
    // Close menu when clicking a link
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function() {
        nav.classList.remove('mobile-open');
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      });
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

// Initialize mobile menu on load and resize
document.addEventListener('DOMContentLoaded', initMobileMenu);
window.addEventListener('resize', debounce(initMobileMenu, 250));

// ===== CURRENT YEAR IN FOOTER =====
function updateFooterYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

document.addEventListener('DOMContentLoaded', updateFooterYear);

// ===== IMAGE FALLBACK FOR BROKEN IMAGES =====
function initImageFallbacks() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', function() {
      // Only add fallback for team photos
      if (this.closest('.team-photo')) {
        const teamPhoto = this.closest('.team-photo');
        const name = this.alt || 'Team Member';
        teamPhoto.innerHTML = `<div class="team-photo-fallback" style="width:100%;height:100%;background:linear-gradient(135deg, var(--primary-brown), var(--accent-blue));display:flex;align-items:center;justify-content:center;color:white;font-size:2rem;"><i class="fas fa-user-tie"></i></div>`;
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initImageFallbacks);

// ===== LAZY LOADING FOR IMAGES =====
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ===== PAGE LOAD PERFORMANCE =====
window.addEventListener('load', function() {
  // Add loaded class to body for any animations that should trigger after load
  document.body.classList.add('page-loaded');
  
  // Log performance
  if (window.performance) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`Page loaded in ${pageLoadTime}ms`);
  }
});
