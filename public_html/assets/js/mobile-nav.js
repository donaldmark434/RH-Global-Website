/**
 * Mobile Bottom Navigation JavaScript Component
 * RH Global Innovation Nig Ltd
 * Handles mobile navigation functionality and active states
 */

class MobileNavigation {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    /**
     * Initialize mobile navigation
     */
    init() {
        this.createMobileNav();
        this.setActiveState();
        this.bindEvents();
        this.handleScrollBehavior();
    }

    /**
     * Get current page from URL
     */
    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        return page.replace('.html', '') || 'index';
    }

    /**
     * Create mobile navigation HTML structure
     */
    createMobileNav() {
        // Check if mobile nav already exists
        if (document.querySelector('.mobile-bottom-nav')) {
            return;
        }

        const navHTML = `
            <nav class="mobile-bottom-nav" role="navigation" aria-label="Mobile navigation">
                <div class="mobile-nav-container">
                    <a href="index.html" class="mobile-nav-item" data-page="index" aria-label="Home">
                        <i class="fa fa-home" aria-hidden="true"></i>
                        <span class="mobile-nav-label">Home</span>
                    </a>
                    <a href="about.html" class="mobile-nav-item" data-page="about" aria-label="About us">
                        <i class="fa fa-info-circle" aria-hidden="true"></i>
                        <span class="mobile-nav-label">About</span>
                    </a>
                    <a href="services.html" class="mobile-nav-item" data-page="services" aria-label="Our services">
                        <i class="fa fa-cogs" aria-hidden="true"></i>
                        <span class="mobile-nav-label">Services</span>
                    </a>
                    <a href="projects.html" class="mobile-nav-item" data-page="projects" aria-label="Our projects">
                        <i class="fa fa-building" aria-hidden="true"></i>
                        <span class="mobile-nav-label">Projects</span>
                    </a>
                    <a href="contact.html" class="mobile-nav-item" data-page="contact" aria-label="Contact us">
                        <i class="fa fa-phone" aria-hidden="true"></i>
                        <span class="mobile-nav-label">Contact</span>
                    </a>
                </div>
            </nav>
        `;

        // Insert mobile navigation before closing body tag
        document.body.insertAdjacentHTML('beforeend', navHTML);
    }

    /**
     * Set active state for current page
     */
    setActiveState() {
        const navItems = document.querySelectorAll('.mobile-nav-item');
        
        navItems.forEach(item => {
            item.classList.remove('active');
            
            const itemPage = item.getAttribute('data-page');
            if (itemPage === this.currentPage) {
                item.classList.add('active');
                item.setAttribute('aria-current', 'page');
            } else {
                item.removeAttribute('aria-current');
            }
        });
    }

    /**
     * Bind navigation events
     */
    bindEvents() {
        const navItems = document.querySelectorAll('.mobile-nav-item');
        
        navItems.forEach(item => {
            // Click event
            item.addEventListener('click', (e) => {
                this.handleNavClick(e, item);
            });

            // Keyboard navigation
            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.handleNavClick(e, item);
                }
            });

            // Touch feedback for mobile
            item.addEventListener('touchstart', () => {
                item.style.transform = 'translateY(-1px)';
            });

            item.addEventListener('touchend', () => {
                setTimeout(() => {
                    item.style.transform = '';
                }, 150);
            });
        });
    }

    /**
     * Handle navigation item click
     */
    handleNavClick(e, item) {
        const href = item.getAttribute('href');
        
        // Add loading state
        this.addLoadingState(item);
        
        // Navigate after brief delay for visual feedback
        setTimeout(() => {
            window.location.href = href;
        }, 200);
    }

    /**
     * Add loading state to navigation item
     */
    addLoadingState(item) {
        const icon = item.querySelector('i');
        const originalClass = icon.className;
        
        icon.className = 'fa fa-spinner fa-spin';
        
        // Reset after navigation
        setTimeout(() => {
            icon.className = originalClass;
        }, 1000);
    }

    /**
     * Handle scroll behavior - hide/show navigation
     */
    handleScrollBehavior() {
        let lastScrollTop = 0;
        let scrollTimeout;
        const nav = document.querySelector('.mobile-bottom-nav');
        
        if (!nav) return;

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Clear existing timeout
            clearTimeout(scrollTimeout);
            
            // Hide navigation when scrolling down, show when scrolling up
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                // Scrolling down
                nav.classList.add('hide');
                nav.classList.remove('show');
            } else {
                // Scrolling up or at top
                nav.classList.remove('hide');
                nav.classList.add('show');
            }
            
            // Always show navigation when scroll stops
            scrollTimeout = setTimeout(() => {
                nav.classList.remove('hide');
                nav.classList.add('show');
            }, 150);
            
            lastScrollTop = scrollTop;
        });
    }

    /**
     * Update active state (useful for SPA-like behavior)
     */
    updateActiveState(page) {
        this.currentPage = page;
        this.setActiveState();
    }

    /**
     * Show mobile navigation
     */
    show() {
        const nav = document.querySelector('.mobile-bottom-nav');
        if (nav) {
            nav.classList.remove('hide');
            nav.classList.add('show');
        }
    }

    /**
     * Hide mobile navigation
     */
    hide() {
        const nav = document.querySelector('.mobile-bottom-nav');
        if (nav) {
            nav.classList.add('hide');
            nav.classList.remove('show');
        }
    }

    /**
     * Destroy mobile navigation
     */
    destroy() {
        const nav = document.querySelector('.mobile-bottom-nav');
        if (nav) {
            nav.remove();
        }
        
        // Remove body padding
        if (window.innerWidth <= 768) {
            document.body.style.paddingBottom = '';
        }
    }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Only initialize on mobile devices
    if (window.innerWidth <= 768) {
        window.mobileNav = new MobileNavigation();
    }
});

// Handle resize events
window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) {
        // Initialize mobile nav if not exists
        if (!window.mobileNav) {
            window.mobileNav = new MobileNavigation();
        }
    } else {
        // Destroy mobile nav on desktop
        if (window.mobileNav) {
            window.mobileNav.destroy();
            window.mobileNav = null;
        }
    }
});

// Export for manual initialization if needed
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MobileNavigation;
}