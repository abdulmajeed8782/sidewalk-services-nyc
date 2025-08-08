// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeNavigation();
    initializeAnimations();
    initializeContactForm();
    initializeSmoothScrolling();
    initializePhoneTracking();
});

// Navigation Functionality
function initializeNavigation() {
    const nav = document.querySelector('.nav');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    // Mobile menu toggle (if needed in future)
    const mobileMenuToggle = document.createElement('button');
    mobileMenuToggle.className = 'mobile-menu-toggle';
    mobileMenuToggle.innerHTML = '☰';
    mobileMenuToggle.style.display = 'none';
    
    // Add mobile menu functionality for smaller screens
    if (window.innerWidth <= 768) {
        setupMobileMenu();
    }
    
    // Handle dropdown menus
    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.dropdown-toggle');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        // Desktop hover behavior is handled by CSS
        // Add click behavior for mobile
        toggle.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
            }
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown')) {
            dropdowns.forEach(dropdown => {
                const menu = dropdown.querySelector('.dropdown-menu');
                if (menu) {
                    menu.style.display = 'none';
                }
            });
        }
    });
}

// Mobile Menu Setup
function setupMobileMenu() {
    const header = document.querySelector('.header');
    const nav = document.querySelector('.nav');
    
    // Create mobile menu button
    const mobileButton = document.createElement('button');
    mobileButton.className = 'mobile-menu-btn';
    mobileButton.innerHTML = '<span></span><span></span><span></span>';
    mobileButton.style.cssText = `
        display: flex;
        flex-direction: column;
        background: none;
        border: none;
        cursor: pointer;
        padding: 5px;
    `;
    
    // Style mobile button spans
    const spans = mobileButton.querySelectorAll('span');
    spans.forEach(span => {
        span.style.cssText = `
            width: 25px;
            height: 3px;
            background-color: white;
            margin: 2px 0;
            transition: 0.3s;
        `;
    });
    
    // Add mobile button to header
    header.querySelector('.container').appendChild(mobileButton);
    
    // Toggle mobile menu
    mobileButton.addEventListener('click', function() {
        nav.classList.toggle('mobile-active');
        mobileButton.classList.toggle('active');
    });
}

// Animation Functionality
function initializeAnimations() {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.service-item, .location-card, .value-item, .testimonial-item, .benefit-item');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Counter animation for stats (if any are added later)
    animateCounters();
    
    // Parallax effect for hero sections
    initializeParallax();
}

// Counter Animation
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        // Start animation when element is visible
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Parallax Effect
function initializeParallax() {
    const heroSections = document.querySelectorAll('.hero');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        heroSections.forEach(hero => {
            const rate = scrolled * -0.5;
            hero.style.transform = `translateY(${rate}px)`;
        });
    });
}

// Contact Form Functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData);
            
            // Validate form
            if (validateContactForm(data)) {
                // Show loading state
                showFormLoading(true);
                
                // Simulate form submission (replace with actual endpoint)
                setTimeout(() => {
                    showFormLoading(false);
                    showFormSuccess();
                    contactForm.reset();
                }, 2000);
            }
        });
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(input);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(input);
            });
        });
    }
}

// Form Validation
function validateContactForm(data) {
    let isValid = true;
    const errors = {};
    
    // Required fields
    if (!data.name || data.name.trim().length < 2) {
        errors.name = 'Please enter a valid name (at least 2 characters)';
        isValid = false;
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
        isValid = false;
    }
    
    if (!data.phone || !isValidPhone(data.phone)) {
        errors.phone = 'Please enter a valid phone number';
        isValid = false;
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.message = 'Please enter a message (at least 10 characters)';
        isValid = false;
    }
    
    // Display errors
    displayFormErrors(errors);
    
    return isValid;
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    let error = '';
    
    switch (field.name) {
        case 'name':
            if (!value || value.length < 2) {
                error = 'Please enter a valid name (at least 2 characters)';
            }
            break;
        case 'email':
            if (!value || !isValidEmail(value)) {
                error = 'Please enter a valid email address';
            }
            break;
        case 'phone':
            if (!value || !isValidPhone(value)) {
                error = 'Please enter a valid phone number';
            }
            break;
        case 'message':
            if (!value || value.length < 10) {
                error = 'Please enter a message (at least 10 characters)';
            }
            break;
    }
    
    if (error) {
        showFieldError(field, error);
        return false;
    } else {
        clearFieldError(field);
        return true;
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Phone validation
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(cleanPhone) && cleanPhone.length >= 10;
}

// Display form errors
function displayFormErrors(errors) {
    Object.keys(errors).forEach(fieldName => {
        const field = document.querySelector(`[name="${fieldName}"]`);
        if (field) {
            showFieldError(field, errors[fieldName]);
        }
    });
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: #e53e3e;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    `;
    
    field.style.borderColor = '#e53e3e';
    field.parentNode.appendChild(errorDiv);
}

// Clear field error
function clearFieldError(field) {
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    field.style.borderColor = '#e2e8f0';
}

// Show form loading state
function showFormLoading(loading) {
    const submitButton = document.querySelector('.submit-button');
    
    if (loading) {
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        submitButton.style.opacity = '0.7';
    } else {
        submitButton.disabled = false;
        submitButton.textContent = 'Send Message';
        submitButton.style.opacity = '1';
    }
}

// Show form success message
function showFormSuccess() {
    const form = document.getElementById('contactForm');
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.innerHTML = `
        <div style="
            background-color: #c6f6d5;
            color: #22543d;
            padding: 1rem;
            border-radius: 5px;
            margin-bottom: 1rem;
            border-left: 4px solid #38a169;
        ">
            <strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you soon.
        </div>
    `;
    
    form.parentNode.insertBefore(successDiv, form);
    
    // Remove success message after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

// Smooth Scrolling
function initializeSmoothScrolling() {
    // Smooth scroll for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Back to top functionality
    createBackToTopButton();
}

// Create Back to Top Button
function createBackToTopButton() {
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background-color: #1a365d;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(backToTop);
    
    // Show/hide based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.style.opacity = '1';
            backToTop.style.visibility = 'visible';
        } else {
            backToTop.style.opacity = '0';
            backToTop.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    backToTop.addEventListener('mouseenter', function() {
        this.style.backgroundColor = '#2d3748';
        this.style.transform = 'translateY(-2px)';
    });
    
    backToTop.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '#1a365d';
        this.style.transform = 'translateY(0)';
    });
}

// Phone Call Tracking
function initializePhoneTracking() {
    const phoneLinks = document.querySelectorAll('a[href^="tel:"]');
    
    phoneLinks.forEach(link => {
        link.addEventListener('click', function() {
            // Track phone clicks (replace with actual analytics)
            console.log('Phone call initiated:', this.href);
            
            // You can add Google Analytics or other tracking here
            if (typeof gtag !== 'undefined') {
                gtag('event', 'phone_call', {
                    'event_category': 'contact',
                    'event_label': this.href
                });
            }
        });
    });
}

// Utility Functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimized scroll handler
const optimizedScrollHandler = throttle(function() {
    // Handle scroll-based animations and effects
    const scrolled = window.pageYOffset;
    
    // Add scroll-based classes
    if (scrolled > 100) {
        document.body.classList.add('scrolled');
    } else {
        document.body.classList.remove('scrolled');
    }
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Resize handler
const optimizedResizeHandler = debounce(function() {
    // Handle responsive behavior
    if (window.innerWidth > 768) {
        // Desktop behavior
        const dropdownMenus = document.querySelectorAll('.dropdown-menu');
        dropdownMenus.forEach(menu => {
            menu.style.display = '';
        });
    }
}, 250);

window.addEventListener('resize', optimizedResizeHandler);

// Error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // You can add error reporting here
});

// Page visibility API for performance
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden, pause animations or heavy operations
        console.log('Page hidden');
    } else {
        // Page is visible, resume operations
        console.log('Page visible');
    }
});

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment when service worker is implemented
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered'))
        //     .catch(error => console.log('SW registration failed'));
    });
}

