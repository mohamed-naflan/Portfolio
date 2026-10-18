/**
 * ==============================================================================
 * NAFLAN - PORTFOLIO JAVASCRIPT (ES6+)
 * ==============================================================================
 * Clean, lightweight, modular vanilla JavaScript.
 * No external libraries or build tools required.
 *
 * Features included:
 *  1. Mobile Navigation Drawer Toggle & Escape Key Handling
 *  2. Navigation Link Auto-Close on Mobile
 *  3. Header Scroll Effect (frosted glass background change)
 *  4. Active Section Highlighting on Scroll (Scroll Spy)
 *  5. Scroll-Triggered Reveal Animations (Intersection Observer)
 *  6. Project Category Filtering (All / Web Apps / UI & Landing)
 *  7. Contact Form Real-Time Validation & Submission Handling
 *  8. Back-To-Top Button Functionality
 *  9. Dynamic Copyright Year
 * ==============================================================================
 */

// Execute all initialization logic once the DOM is fully loaded and parsed
document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================================
     1. NAVIGATION & MOBILE MENU TOGGLE
     ============================================================================ */
  const header = document.getElementById('header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileCta = document.querySelector('.mobile-cta');

  /**
   * Opens or closes the mobile navigation drawer.
   * @param {boolean} shouldOpen - Force open or close, or toggle if omitted.
   */
  const toggleMobileNav = (shouldOpen) => {
    const isCurrentlyExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    const nextState = typeof shouldOpen === 'boolean' ? shouldOpen : !isCurrentlyExpanded;

    hamburgerBtn.setAttribute('aria-expanded', String(nextState));
    navMenu.classList.toggle('open', nextState);

    // Prevent background scrolling when mobile menu is active
    document.body.style.overflow = nextState ? 'hidden' : '';
  };

  if (hamburgerBtn && navMenu) {
    // Click on hamburger button
    hamburgerBtn.addEventListener('click', () => {
      toggleMobileNav();
    });

    // Close menu when clicking any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        toggleMobileNav(false);
      });
    });

    // Close menu when clicking the mobile CTA button
    if (mobileCta) {
      mobileCta.addEventListener('click', () => {
        toggleMobileNav(false);
      });
    }

    // Close menu on pressing the Escape key for accessibility
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMobileNav(false);
        hamburgerBtn.focus(); // Return focus to the button
      }
    });

    // Close menu if user clicks outside of header/nav
    document.addEventListener('click', (event) => {
      const isClickInside = header.contains(event.target);
      if (!isClickInside && navMenu.classList.contains('open')) {
        toggleMobileNav(false);
      }
    });
  }

  /* ============================================================================
     2. STICKY HEADER & TOP SCROLL PROGRESS INDICATOR
     Adds a subtle shadow/deeper background to the header and updates the top progress bar.
     ============================================================================ */
  const scrollProgressBar = document.getElementById('scroll-progress');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Sticky header blur & shadow state
    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Top scroll reading progress bar
    if (scrollProgressBar) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progressPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgressBar.style.width = `${Math.min(100, Math.max(0, progressPercent))}%`;
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Run on initial load in case page is refreshed midway

  /* ============================================================================
     3. ACTIVE SECTION HIGHLIGHTING (SCROLL SPY)
     Highlights the current section in the navigation menu as you scroll.
     ============================================================================ */
  const sections = document.querySelectorAll('section[id]');

  const updateActiveNavLink = () => {
    const scrollPosition = window.scrollY + 120; // Offset for header height

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  /* ============================================================================
     4. SCROLL REVEAL ANIMATIONS (Intersection Observer with Staggering)
     Reveals sections with smooth fade-in and slide-up as they enter viewport.
     Respects user's prefers-reduced-motion setting.
     ============================================================================ */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    // Add staggered delay to child cards inside grid containers
    document.querySelectorAll('.projects-grid, .skills-grid, .about-philosophy-cards').forEach((container) => {
      Array.from(container.children).forEach((child, idx) => {
        child.style.setProperty('--reveal-delay', `${(idx % 4) * 0.1}s`);
      });
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target); // Reveal only once for performance
          }
        });
      },
      {
        root: null,
        threshold: 0.12, // Element is 12% visible before triggering
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // If reduced motion or observer not supported, show immediately
    revealElements.forEach((el) => el.classList.add('is-revealed'));
  }

  /* ============================================================================
     5. PROJECT CATEGORY FILTERING (With Smooth Card Entrance Animation)
     Filters projects based on the 'data-category' attribute.
     ============================================================================ */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        // Update active filter button state and ARIA attribute
        filterButtons.forEach((b) => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const selectedFilter = btn.getAttribute('data-filter');

        // Filter cards smoothly with animation
        projectCards.forEach((card) => {
          const cardCategory = card.getAttribute('data-category');
          const shouldShow = selectedFilter === 'all' || cardCategory === selectedFilter;

          if (shouldShow) {
            card.classList.remove('is-hidden');
            card.classList.remove('filter-animating');
            // Force DOM reflow to restart CSS keyframe animation
            void card.offsetWidth;
            card.classList.add('filter-animating');
          } else {
            card.classList.add('is-hidden');
            card.classList.remove('filter-animating');
          }
        });
      });
    });
  }

  /* ============================================================================
     5.5 INTERACTIVE 3D CARD TILT & CURSOR SPOTLIGHT
     Applies high-end 3D perspective tilt and dynamic cursor light reflection.
     Enabled only on desktop/laptop pointers and respects reduced motion.
     ============================================================================ */
  if (!prefersReducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const interactiveCards = document.querySelectorAll('.project-card, .visual-card');

    interactiveCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5.5; // Max 5.5deg
        const rotateY = ((x - centerX) / centerX) * 5.5;

        // Apply smooth 3D tilt without disrupting existing translateY
        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-5px)`;

        // Set spotlight coordinates for glare pseudo-element
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.removeProperty('--mouse-x');
        card.style.removeProperty('--mouse-y');
      });
    });
  }

  /* ============================================================================
     6. CONTACT FORM VALIDATION & SUBMISSION SIMULATION
     Provides helpful real-time validation feedback and submission status.
     ============================================================================ */
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit-btn');

  // Simple, standard RFC 5322 compliant email regex check
  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  /**
   * Displays or clears an error message for an input field.
   * @param {HTMLElement} inputElement - Form input or textarea.
   * @param {string|null} message - Error message to display, or null to clear.
   */
  const setFieldError = (inputElement, message) => {
    const errorSpan = document.getElementById(`${inputElement.name}-error`);
    if (!errorSpan) return;

    if (message) {
      inputElement.classList.add('input-error');
      errorSpan.textContent = message;
      errorSpan.classList.add('visible');
    } else {
      inputElement.classList.remove('input-error');
      errorSpan.textContent = '';
      errorSpan.classList.remove('visible');
    }
  };

  /**
   * Validates an individual input field based on its specific rules.
   * @param {HTMLElement} field - Form input element to validate.
   * @returns {boolean} Whether the field is valid.
   */
  const validateField = (field) => {
    const value = field.value.trim();

    if (field === nameInput) {
      if (!value) {
        setFieldError(field, 'Please enter your name.');
        return false;
      }
      if (value.length < 2) {
        setFieldError(field, 'Name must be at least 2 characters.');
        return false;
      }
      setFieldError(field, null);
      return true;
    }

    if (field === emailInput) {
      if (!value) {
        setFieldError(field, 'Please enter your email address.');
        return false;
      }
      if (!isValidEmail(value)) {
        setFieldError(field, 'Please enter a valid email address (e.g. you@example.com).');
        return false;
      }
      setFieldError(field, null);
      return true;
    }

    if (field === subjectInput) {
      if (!value) {
        setFieldError(field, 'Please provide a subject for your message.');
        return false;
      }
      if (value.length < 3) {
        setFieldError(field, 'Subject must be at least 3 characters.');
        return false;
      }
      setFieldError(field, null);
      return true;
    }

    if (field === messageInput) {
      if (!value) {
        setFieldError(field, 'Please write your message.');
        return false;
      }
      if (value.length < 10) {
        setFieldError(field, 'Message must be at least 10 characters long.');
        return false;
      }
      setFieldError(field, null);
      return true;
    }

    return true;
  };

  // Add real-time validation on input/blur
  [nameInput, emailInput, subjectInput, messageInput].forEach((field) => {
    if (!field) return;

    // Validate as soon as user leaves the input field
    field.addEventListener('blur', () => {
      validateField(field);
    });

    // Clear error once user types valid data
    field.addEventListener('input', () => {
      if (field.classList.contains('input-error')) {
        validateField(field);
      }
    });
  });

  // Handle Form Submission
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Stop default browser page reload

      // Validate all four fields
      const isNameValid = validateField(nameInput);
      const isEmailValid = validateField(emailInput);
      const isSubjectValid = validateField(subjectInput);
      const isMessageValid = validateField(messageInput);

      const isFormValid = isNameValid && isEmailValid && isSubjectValid && isMessageValid;

      if (!isFormValid) {
        // Focus the first invalid input
        if (!isNameValid) nameInput.focus();
        else if (!isEmailValid) emailInput.focus();
        else if (!isSubjectValid) subjectInput.focus();
        else if (!isMessageValid) messageInput.focus();
        return;
      }

      // Display loading state on submit button
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Sending...</span>`;

      // Simulate network submission delay (e.g., 900ms)
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;

        // Display helpful success confirmation
        formStatus.className = 'form-status success';
        formStatus.innerHTML = `
          <strong>✓ Thank you, ${nameInput.value.trim()}!</strong><br>
          Your message has been validated successfully. (To receive live email submissions directly in your inbox, integrate with Formspree or EmailJS as explained in the guide).
        `;

        // Clear the form fields
        contactForm.reset();

        // Automatically hide the status notification after 8 seconds
        setTimeout(() => {
          formStatus.className = 'form-status';
          formStatus.textContent = '';
        }, 8000);
      }, 900);
    });
  }

  /* ============================================================================
     7. BACK-TO-TOP BUTTON
     Appears smoothly when scrolling down and scrolls back to top when clicked.
     ============================================================================ */
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }

  /* ============================================================================
     8. DYNAMIC COPYRIGHT YEAR
     Automatically updates the footer copyright year to the current calendar year.
     ============================================================================ */
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

});
