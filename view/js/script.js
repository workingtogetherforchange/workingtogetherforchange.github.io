// Modern ES6+ JavaScript for Working Together for Change
class SiteController {
    constructor() {
        this.init();
        this.bindEvents();
        this.initAnimations();
    }

    init() {
        // Initialize mobile menu
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.mainHeader = document.querySelector('.main-header');
        this.header = document.querySelector('header');
        
        // Create mobile menu toggle if it doesn't exist
        if (!this.mobileMenuToggle && window.innerWidth <= 768) {
            this.createMobileMenuToggle();
        }
        
        // Initialize intersection observer for animations
        this.initIntersectionObserver();
        
        // Initialize counter animations
        this.initCounterAnimations();
    }

    createMobileMenuToggle() {
        const toggle = document.createElement('button');
        toggle.className = 'mobile-menu-toggle';
        toggle.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        const headerContainer = document.querySelector('.header-container');
        if (headerContainer) {
            headerContainer.appendChild(toggle);
            this.mobileMenuToggle = toggle;
        }
    }

    bindEvents() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.handleSmoothScroll.bind(this));
        });

        // Scroll indicator functionality
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', this.handleScrollDown.bind(this));
        }

        // Mobile menu toggle
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', this.toggleMobileMenu.bind(this));
        }

        // Header scroll effect
        window.addEventListener('scroll', this.handleHeaderScroll.bind(this));

        // Form validation
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleFormSubmit.bind(this));
        }

        // Button analytics tracking
        document.querySelectorAll('.btn, .donate').forEach(button => {
            button.addEventListener('click', this.trackButtonClick.bind(this));
        });

        // Resize handler
        window.addEventListener('resize', this.handleResize.bind(this));

        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboardNav.bind(this));
    }

    handleSmoothScroll(event) {
        const target = document.querySelector(event.currentTarget.getAttribute('href'));
        if (target) {
            event.preventDefault();
            const headerHeight = this.header ? this.header.offsetHeight : 80;
            const targetPosition = target.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    handleScrollDown(event) {
        event.preventDefault();
        const experiencesSection = document.querySelector('#experiences');
        if (experiencesSection) {
            const headerHeight = this.header ? this.header.offsetHeight : 80;
            const targetPosition = experiencesSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    toggleMobileMenu() {
        if (this.mobileMenuToggle && this.mainHeader) {
            this.mobileMenuToggle.classList.toggle('active');
            this.mainHeader.classList.toggle('active');
            
            // Also toggle header-right for mobile
            const headerRight = document.querySelector('.header-right');
            if (headerRight) {
                headerRight.classList.toggle('active');
            }
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = this.mainHeader.classList.contains('active') ? 'hidden' : '';
        }
    }

    handleHeaderScroll() {
        if (this.header) {
            const scrolled = window.scrollY > 50;
            this.header.classList.toggle('scrolled', scrolled);
        }
    }

    handleFormSubmit(event) {
        const form = event.target;
        let isValid = true;
        const errors = [];

        // Clear previous errors
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

        // Check required fields
        form.querySelectorAll('[required]').forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.classList.add('error');
                errors.push(`${field.name || field.id || 'Field'} is required`);
            }
        });

        // Email validation
        const emailField = form.querySelector('#email, [type="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                isValid = false;
                emailField.classList.add('error');
                errors.push('Please enter a valid email address');
            }
        }

        if (!isValid) {
            event.preventDefault();
            this.showFormErrors(errors);
        } else {
            this.trackFormSubmission();
        }
    }

    showFormErrors(errors) {
        // Create or update error message
        let errorContainer = document.querySelector('.form-errors');
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.className = 'form-errors';
            const form = document.getElementById('contact-form');
            form.insertBefore(errorContainer, form.firstChild);
        }
        
        errorContainer.innerHTML = `
            <div class="alert alert-danger">
                <strong>Please correct the following errors:</strong>
                <ul>${errors.map(error => `<li>${error}</li>`).join('')}</ul>
            </div>
        `;
        
        errorContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    trackButtonClick(event) {
        const button = event.currentTarget;
        const buttonText = button.textContent.trim() || button.getAttribute('aria-label') || 'Unknown Button';
        
        // Google Analytics 4
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                event_category: 'Button',
                event_label: buttonText,
                value: 1
            });
        }
        
        // Console log for debugging
        console.log(`Button clicked: ${buttonText}`);
    }

    trackFormSubmission() {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                event_category: 'Contact',
                event_label: 'Contact Form',
                value: 1
            });
        }
    }

    handleResize() {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768 && this.mainHeader?.classList.contains('active')) {
            this.toggleMobileMenu();
        }
    }

    handleKeyboardNav(event) {
        // ESC key closes mobile menu
        if (event.key === 'Escape' && this.mainHeader?.classList.contains('active')) {
            this.toggleMobileMenu();
        }
    }

    initIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements for animation
        document.querySelectorAll('.event-item, .stat-item, .profile-card').forEach(el => {
            observer.observe(el);
        });
    }

    initCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    animateCounter(element) {
        const target = parseInt(element.textContent) || 0;
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        element.classList.add('counting');

        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current);
        }, 16);
    }

    initAnimations() {
        // Add CSS for animations
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                animation: slideInUp 0.6s ease-out forwards;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .form-errors {
                margin-bottom: 1rem;
            }
            
            .alert {
                padding: 1rem;
                border-radius: 0.5rem;
                margin-bottom: 1rem;
            }
            
            .alert-danger {
                background-color: #fee;
                border: 1px solid #fcc;
                color: #c33;
            }
            
            .error {
                border-color: #dc3545 !important;
                box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new SiteController());
} else {
    new SiteController();
}

// Legacy jQuery support for existing code
if (typeof $ !== 'undefined') {
    $(document).ready(function() {
        // Maintain backward compatibility
        console.log('Legacy jQuery support active');
    });
} 